"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function addTransactionAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const type = formData.get("type") as string;
  const rawAmount = formData.get("amount") as string;
  const categoryId = formData.get("categoryId") as string;
  const note = (formData.get("note") as string) || null;
  const dateStr = (formData.get("date") as string) || "";
  const amount = parseFloat(rawAmount.replace(/[^0-9.]/g, ""));

  if (!amount || isNaN(amount) || amount <= 0) {
    return { error: "Số tiền không hợp lệ." };
  }
  if (!categoryId || categoryId.startsWith("_")) {
    return { error: "Vui lòng chọn danh mục." };
  }

  // Parse date from form; fall back to today if missing/invalid
  const parsedDate = dateStr ? new Date(dateStr) : new Date();
  const date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  try {
    await prisma.transaction.create({
      data: {
        type: type === "income" ? "INCOME" : "EXPENSE",
        amount,
        note,
        date,
        userId: session.userId,
        categoryId,
      },
    });
  } catch (err) {
    console.error("[addTransactionAction]", err);
    return { error: "Không thể lưu giao dịch. Vui lòng thử lại." };
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  redirect("/");
}

export async function getTransactionsByMonth(month: number, year: number) {
  const session = await getSession();
  if (!session.userId) return [];

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  return prisma.transaction.findMany({
    where: { userId: session.userId, date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
    include: { category: true },
  });
}

export async function getReportData(month: number, year: number) {
  const session = await getSession();
  if (!session.userId) return null;

  const userId = session.userId;

  let startMonth = month - 5;
  let startYear = year;
  while (startMonth <= 0) { startMonth += 12; startYear--; }

  const rangeStart = new Date(startYear, startMonth - 1, 1);
  const rangeEnd = new Date(year, month, 0, 23, 59, 59, 999);
  const currentStart = new Date(year, month - 1, 1);
  const currentEnd = new Date(year, month, 0, 23, 59, 59, 999);

  // 3 queries chạy song song — DB làm aggregation, không kéo raw rows về JS
  const [monthTotals, catBreakdown, trendRaw] = await Promise.all([
    // 1. Tổng thu/chi tháng hiện tại — tối đa 2 rows
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, date: { gte: currentStart, lte: currentEnd } },
      _sum: { amount: true },
    }),

    // 2. Chi tiêu theo danh mục tháng hiện tại — JOIN + GROUP BY trong DB
    prisma.$queryRaw<{ id: string; name: string; emoji: string; color: string; total: number }[]>`
      SELECT c.id, c.name, c.emoji, c.color, SUM(t.amount)::float AS total
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryId" = c.id
      WHERE t."userId" = ${userId}
        AND t.type = 'EXPENSE'::"TransactionType"
        AND t.date >= ${currentStart}
        AND t.date <= ${currentEnd}
      GROUP BY c.id, c.name, c.emoji, c.color
      ORDER BY total DESC
    `,

    // 3. Trend 6 tháng — GROUP BY month trong DB, tối đa 12 rows
    prisma.$queryRaw<{ year: number; month: number; type: string; total: number }[]>`
      SELECT
        EXTRACT(YEAR FROM date)::int AS year,
        EXTRACT(MONTH FROM date)::int AS month,
        type::text AS type,
        SUM(amount)::float AS total
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND date >= ${rangeStart}
        AND date <= ${rangeEnd}
      GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date), type
      ORDER BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
    `,
  ]);

  const income = Number(monthTotals.find((t) => t.type === "INCOME")?._sum.amount ?? 0);
  const expense = Number(monthTotals.find((t) => t.type === "EXPENSE")?._sum.amount ?? 0);

  const categories = catBreakdown.map((c) => ({
    ...c,
    total: Number(c.total),
    pct: expense > 0 ? Math.round((Number(c.total) / expense) * 100) : 0,
  }));

  // Dựng mảng trend đủ 6 tháng (kể cả tháng không có giao dịch)
  const trendMap = new Map<string, { income: number; expense: number }>();
  for (const row of trendRaw) {
    const key = `${row.year}-${row.month}`;
    const entry = trendMap.get(key) ?? { income: 0, expense: 0 };
    if (row.type === "INCOME") entry.income = Number(row.total);
    else entry.expense = Number(row.total);
    trendMap.set(key, entry);
  }

  const trend: { month: number; year: number; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    let m = month - i;
    let y = year;
    while (m <= 0) { m += 12; y--; }
    const d = trendMap.get(`${y}-${m}`) ?? { income: 0, expense: 0 };
    trend.push({ month: m, year: y, ...d });
  }

  return { income, expense, balance: income - expense, categories, trend };
}

export async function getDashboardData() {
  const session = await getSession();
  if (!session.userId) return null;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [income, expense, recent] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: session.userId, type: "INCOME", date: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: session.userId, type: "EXPENSE", date: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  return {
    name: session.name,
    income: Number(income._sum.amount ?? 0),
    expense: Number(expense._sum.amount ?? 0),
    balance: Number(income._sum.amount ?? 0) - Number(expense._sum.amount ?? 0),
    recent,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}
