import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { name } });

  if (existing) {
    return NextResponse.json(
      { error: "Username is already taken." },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.user.create({
    data: { name, password: hashed },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
