// Run: npm run seed
// Uses neon HTTP driver directly — no transactions, no WebSocket needed
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set. Make sure .env is loaded.");
  console.error("   Hãy chạy: npm run seed  (tsx tự động load .env)");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const DEFAULT_CATEGORIES = [
  { id: "cat-food",   name: "Ăn uống",    emoji: "🍜", color: "#FF6B6B" },
  { id: "cat-home",   name: "Nhà cửa",    emoji: "🏠", color: "#4ECDC4" },
  { id: "cat-travel", name: "Di chuyển",  emoji: "🚗", color: "#45B7D1" },
  { id: "cat-fun",    name: "Giải trí",   emoji: "🎮", color: "#DDA0DD" },
  { id: "cat-edu",    name: "Giáo dục",   emoji: "📚", color: "#98FB98" },
  { id: "cat-health", name: "Sức khỏe",   emoji: "💊", color: "#FFEAA7" },
  { id: "cat-shop",   name: "Mua sắm",    emoji: "🛍️", color: "#96CEB4" },
  { id: "cat-salary", name: "Lương",      emoji: "💰", color: "#FFD700" },
  { id: "cat-biz",    name: "Kinh doanh", emoji: "💼", color: "#87CEEB" },
  { id: "cat-other",  name: "Khác",       emoji: "📦", color: "#D3D3D3" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert categories using raw SQL (HTTP, no transaction)
  for (const c of DEFAULT_CATEGORIES) {
    await sql`
      INSERT INTO "Category" (id, name, emoji, color, "isDefault", "createdAt")
      VALUES (${c.id}, ${c.name}, ${c.emoji}, ${c.color}, true, NOW())
      ON CONFLICT (id) DO UPDATE SET emoji = ${c.emoji}, color = ${c.color}
    `;
  }
  console.log(`✅ ${DEFAULT_CATEGORIES.length} danh mục mặc định`);

  // Check if user exists
  const rows = await sql`SELECT id FROM "User" WHERE email = 'admin@finfamily.app'`;
  if (rows.length > 0) {
    console.log("✅ User admin đã tồn tại, bỏ qua");
    console.log("\n🎉 Xong! Đăng nhập: admin / admin123");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 12);
  const userId = randomUUID();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "User" (id, name, email, username, password, "createdAt", "updatedAt")
    VALUES (${userId}, 'Nhà Nguyễn', 'admin@finfamily.app', 'admin', ${passwordHash}, ${now}, ${now})
  `;
  console.log(`✅ User: username=admin / password=admin123`);

  // Sample transactions
  const samples = [
    { type: "INCOME",  amount: 18000000, note: "Lương tháng",       catId: "cat-salary", days: 5 },
    { type: "EXPENSE", amount: 450000,   note: "Đi chợ Vinmart",    catId: "cat-food",   days: 0 },
    { type: "EXPENSE", amount: 890000,   note: "Tiền điện nước",    catId: "cat-home",   days: 1 },
    { type: "EXPENSE", amount: 150000,   note: "Xăng xe máy",       catId: "cat-travel", days: 2 },
    { type: "EXPENSE", amount: 2500000,  note: "Học phí lớp toán",  catId: "cat-edu",    days: 3 },
  ];

  for (const s of samples) {
    const date = new Date();
    date.setDate(date.getDate() - s.days);
    const txId = randomUUID();
    await sql`
      INSERT INTO "Transaction" (id, type, amount, note, date, "userId", "categoryId", "createdAt", "updatedAt")
      VALUES (${txId}, ${s.type}::"TransactionType", ${s.amount}, ${s.note}, ${date.toISOString()}, ${userId}, ${s.catId}, NOW(), NOW())
    `;
  }
  console.log(`✅ ${samples.length} giao dịch mẫu`);
  console.log("\n🎉 Xong! Đăng nhập: admin / admin123");
}

main().catch((e) => { console.error(e); process.exit(1); });
