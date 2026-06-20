"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getBudgetData(month: number, year: number) {
  const session = await getSession();
  if (!session.userId) return null;

  const [budgets, transactions, allCategories] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: session.userId, month, year },
      include: { category: true },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.userId,
        type: "EXPENSE",
        date: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0, 23, 59, 59, 999),
        },
      },
      select: { amount: true, categoryId: true },
    }),
    prisma.category.findMany({
      where: { isDefault: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Sum actual spending by category
  const spendMap = new Map<string, number>();
  for (const tx of transactions) {
    spendMap.set(tx.categoryId, (spendMap.get(tx.categoryId) ?? 0) + Number(tx.amount));
  }

  const items = budgets
    .map((b) => {
      const spent = spendMap.get(b.categoryId) ?? 0;
      const budgetAmt = Number(b.amount);
      const pct = budgetAmt > 0 ? Math.round((spent / budgetAmt) * 100) : 0;
      return {
        id: b.id,
        categoryId: b.categoryId,
        categoryName: b.category.name,
        categoryEmoji: b.category.emoji,
        categoryColor: b.category.color,
        budgetAmount: budgetAmt,
        spentAmount: spent,
        pct,
        over: spent > budgetAmt,
      };
    })
    .sort((a, b) => b.pct - a.pct);

  const totalBudget = items.reduce((s, i) => s + i.budgetAmount, 0);
  const totalSpent = items.reduce((s, i) => s + i.spentAmount, 0);

  // Categories not yet budgeted this month
  const budgetedIds = new Set(budgets.map((b) => b.categoryId));
  const availableCategories = allCategories
    .filter((c) => !budgetedIds.has(c.id))
    .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, color: c.color }));

  return { items, totalBudget, totalSpent, availableCategories };
}

export async function setBudgetAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const categoryId = formData.get("categoryId") as string;
  const rawAmount = formData.get("amount") as string;
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);
  const amount = parseInt(rawAmount.replace(/\D/g, ""));

  if (!categoryId) return { error: "Vui lòng chọn danh mục." };
  if (!amount || amount <= 0) return { error: "Số tiền không hợp lệ." };

  // Manual upsert — PrismaNeonHttp doesn't support transactions
  const existing = await prisma.budget.findUnique({
    where: {
      userId_categoryId_month_year: {
        userId: session.userId,
        categoryId,
        month,
        year,
      },
    },
  });

  if (existing) {
    await prisma.budget.update({
      where: {
        userId_categoryId_month_year: {
          userId: session.userId,
          categoryId,
          month,
          year,
        },
      },
      data: { amount },
    });
  } else {
    await prisma.budget.create({
      data: { userId: session.userId, categoryId, amount, month, year },
    });
  }

  revalidatePath("/budget");
  return null;
}

export async function deleteBudgetAction(budgetId: string) {
  const session = await getSession();
  if (!session.userId) return;
  // deleteMany avoids "not found" error and verifies ownership
  await prisma.budget.deleteMany({ where: { id: budgetId, userId: session.userId } });
  revalidatePath("/budget");
}
