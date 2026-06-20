import { getBudgetData } from "@/app/actions/budget";
import Budget from "@/components/Budget";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = Math.min(12, Math.max(1, Number(sp?.month) || now.getMonth() + 1));
  const year = Number(sp?.year) || now.getFullYear();

  const data = await getBudgetData(month, year);

  return (
    <Budget
      month={month}
      year={year}
      items={data?.items ?? []}
      totalBudget={data?.totalBudget ?? 0}
      totalSpent={data?.totalSpent ?? 0}
      availableCategories={data?.availableCategories ?? []}
    />
  );
}
