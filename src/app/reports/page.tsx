import { getReportData } from "@/app/actions/transactions";
import Reports from "@/components/Reports";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = Math.min(12, Math.max(1, Number(sp?.month) || now.getMonth() + 1));
  const year = Number(sp?.year) || now.getFullYear();

  const data = await getReportData(month, year);

  return (
    <Reports
      month={month}
      year={year}
      income={data?.income ?? 0}
      expense={data?.expense ?? 0}
      balance={data?.balance ?? 0}
      categories={data?.categories ?? []}
      trend={data?.trend ?? []}
    />
  );
}
