import { getDashboardData } from "@/app/actions/transactions";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function HomePage() {
  const data = await getDashboardData();
  if (!data) redirect("/login");

  return (
    <Dashboard
      userName={data.name ?? "Gia đình"}
      income={data.income}
      expense={data.expense}
      balance={data.balance}
      month={data.month}
      year={data.year}
      recentTransactions={data.recent.map((tx) => ({
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
