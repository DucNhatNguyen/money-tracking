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

  // One query covering 6 months back through current month end
  let startMonth = month - 5;
  let startYear = year;
  while (startMonth <= 0) { startMonth += 12; startYear--; }

  const rangeStart = new Date(startYear, startMonth - 1, 1);
  const rangeEnd = new Date(year, month, 0, 23, 59, 59, 999);

  const allTxs = await prisma.transaction.findMany({
    where: { userId: session.userId, date: { gte: rangeStart, lte: rangeEnd } },
    select: {
      type: true,
      amount: true,
      date: true,
      category: { select: { id: true, name: true, emoji: true, color: true } },
    },
  });

  // Current month filter
  const currentStart = new Date(year, month - 1, 1);
  const currentEnd = new Date(year, month, 0, 23, 59, 59, 999);
  const currentTxs = allTxs.filter(
    (tx) => tx.date >= currentStart && tx.date <= currentEnd
  );

  const income = currentTxs
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = currentTxs
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + Number(t.amount), 0);

  // Expense breakdown by category for current month
  const catMap = new Map<string, { name: string; emoji: string; color: string; total: number }>();
  for (const tx of currentTxs.filter((t) => t.type === "EXPENSE")) {
    const existing = catMap.get(tx.category.id);
    if (existing) existing.total += Number(tx.amount);
    else catMap.set(tx.category.id, { name: tx.category.name, emoji: tx.category.emoji, color: tx.category.color, total: Number(tx.amount) });
  }
  const categories = Array.from(catMap.values())
    .sort((a, b) => b.total - a.total)
    .map((c) => ({ ...c, pct: expense > 0 ? Math.round((c.total / expense) * 100) : 0 }));

  // 6-month trend
  const trend: { month: number; year: number; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    let m = month - i;
    let y = year;
    while (m <= 0) { m += 12; y--; }
    const mStart = new Date(y, m - 1, 1);
    const mEnd = new Date(y, m, 0, 23, 59, 59, 999);
    const mTxs = allTxs.filter((tx) => tx.date >= mStart && tx.date <= mEnd);
    trend.push({
      month: m,
      year: y,
      income: mTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0),
      expense: mTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0),
    });
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
    income: Number(income._sum.amount ?? 0),
    expense: Number(expense._sum.amount ?? 0),
    balance: Number(income._sum.amount ?? 0) - Number(expense._sum.amount ?? 0),
    recent,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}
