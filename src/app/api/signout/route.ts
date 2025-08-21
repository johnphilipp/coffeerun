import { signOut } from "@/auth";

export async function GET() {
  return signOut({ redirectTo: "/" });
}

export const POST = GET;
