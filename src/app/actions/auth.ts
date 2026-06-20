"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ thông tin." };
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] },
  });

  if (!user?.password) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.username = user.username ?? user.email;
  session.name = user.name;
  await session.save();

  redirect("/");
}

export async function registerAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const name = (formData.get("name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !username || !password || !confirmPassword) {
    return { error: "Vui lòng nhập đầy đủ thông tin." };
  }
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { error: "Tên đăng nhập 3–20 ký tự, chỉ gồm chữ thường, số và dấu _" };
  }
  if (password.length < 8) {
    return { error: "Mật khẩu phải có ít nhất 8 ký tự." };
  }
  if (password !== confirmPassword) {
    return { error: "Xác nhận mật khẩu không khớp." };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: `${username}@finfamily.local` }] },
  });
  if (existing) {
    return { error: "Tên đăng nhập đã được sử dụng." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      username,
      email: `${username}@finfamily.local`,
      password: passwordHash,
    },
  });

  const session = await getSession();
  session.userId = user.id;
  session.username = user.username!;
  session.name = user.name;
  await session.save();

  redirect("/");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
