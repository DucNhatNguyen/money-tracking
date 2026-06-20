import { getDashboardData } from "@/app/actions/transactions";
import { getSession } from "@/lib/session";
import Dashboard from "@/components/Dashboard";

export default async function HomePage() {
  const [session, data] = await Promise.all([getSession(), getDashboardData()]);

  return (
    <Dashboard
      userName={session.name ?? "Gia đình"}
      income={data?.income ?? 0}
      expense={data?.expense ?? 0}
      balance={data?.balance ?? 0}
      month={data?.month ?? new Date().getMonth() + 1}
      year={data?.year ?? new Date().getFullYear()}
      recentTransactions={(data?.recent ?? []).map((tx) => ({
        id: tx.id,
        note: tx.note,
        amount: Number(tx.amount),
        type: tx.type as "INCOME" | "EXPENSE",
        date: tx.date,
        category: { name: tx.category.name, emoji: tx.category.emoji, color: tx.category.color },
      }))}
    />
  );
}
