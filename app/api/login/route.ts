import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== process.env.ADMIN_USERNAME) {
    return NextResponse.json({ error: "Sai username" }, { status: 401 });
  }
  console.log("password: ", password);
  console.log("hash env length:", process.env.ADMIN_PASSWORD_HASH?.length);
  console.log("hash: ", process.env.ADMIN_PASSWORD_HASH);

  const valid = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH!,
  );

  console.log("valid check: ", valid);
  if (!valid) {
    return NextResponse.json({ error: "Sai password" }, { status: 401 });
  }

  // Nếu đúng, set cookie session
  return NextResponse.json(
    { message: "Login thành công" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `admin=1; Path=/; HttpOnly; SameSite=Strict; Secure`,
      },
    },
  );
}
