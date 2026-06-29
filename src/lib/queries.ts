import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Danh mục mặc định hiếm khi thay đổi → cache 1 giờ
export const getDefaultCategories = unstable_cache(
  () =>
    prisma.category.findMany({
      where: { isDefault: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, emoji: true, color: true },
    }),
  ["default-categories"],
  { revalidate: 3600 }
);
