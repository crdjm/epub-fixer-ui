import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  return new Response(JSON.stringify(session), {
    headers: { 'Content-Type': 'application/json' }
  });
}