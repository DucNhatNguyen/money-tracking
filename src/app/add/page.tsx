import { getDefaultCategories } from "@/lib/queries";
import AddTransaction from "@/components/AddTransaction";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function AddPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const todayStr = toDateStr(now);

  // Compute the default date based on which month the user came from
  let defaultDate = todayStr;
  if (sp?.month && sp?.year) {
    const month = Math.min(12, Math.max(1, Number(sp.month)));
    const year = Number(sp.year);
    const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
    if (!isCurrentMonth) {
      // Past month: default to last day of that month so transaction falls inside it
      const lastDay = new Date(year, month, 0);
      defaultDate = toDateStr(lastDay);
    }
  }

  const categories = await getDefaultCategories();

  return <AddTransaction categories={categories} defaultDate={defaultDate} todayStr={todayStr} />;
}
