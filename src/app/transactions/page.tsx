import { getTransactionsByMonth } from "@/app/actions/transactions";
import Transactions from "@/components/Transactions";

function getMonthList(currentMonth: number, currentYear: number) {
  const list = [];
  for (let i = 0; i < 6; i++) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m <= 0) { m += 12; y--; }
    list.push({ month: m, year: y });
  }
  return list;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = Math.min(12, Math.max(1, Number(sp?.month) || now.getMonth() + 1));
  const year = Number(sp?.year) || now.getFullYear();

  const raw = await getTransactionsByMonth(month, year);

  // Serialize Decimal + Date for client
  const transactions = raw.map((tx) => ({
    id: tx.id,
    type: tx.type as "INCOME" | "EXPENSE",
    amount: Number(tx.amount),
    note: tx.note ?? "",
    date: tx.date.toISOString(),
    category: {
      id: tx.category.id,
      name: tx.category.name,
      emoji: tx.category.emoji,
      color: tx.category.color,
    },
  }));

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  // Expense breakdown by category
  const catMap = new Map<string, { name: string; emoji: string; color: string; total: number }>();
  for (const tx of transactions.filter((t) => t.type === "EXPENSE")) {
    const existing = catMap.get(tx.category.id);
    if (existing) {
      existing.total += tx.amount;
    } else {
      catMap.set(tx.category.id, {
        name: tx.category.name,
        emoji: tx.category.emoji,
        color: tx.category.color,
        total: tx.amount,
      });
    }
  }
  const categories = Array.from(catMap.values())
    .sort((a, b) => b.total - a.total)
    .map((c) => ({
      ...c,
      pct: expense > 0 ? Math.round((c.total / expense) * 100) : 0,
    }));

  return (
    <Transactions
      transactions={transactions}
      income={income}
      expense={expense}
      balance={income - expense}
      categories={categories}
      month={month}
      year={year}
      monthList={getMonthList(now.getMonth() + 1, now.getFullYear())}
    />
  );
}
