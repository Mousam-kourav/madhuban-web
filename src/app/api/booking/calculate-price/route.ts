import { NextRequest, NextResponse } from "next/server";
import { calculatePriceSchema } from "@/lib/booking/schemas";
import { calculatePricing } from "@/lib/booking/pricing";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = calculatePriceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    const pricing = await calculatePricing(parsed.data);
    return NextResponse.json(pricing);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to calculate price";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
