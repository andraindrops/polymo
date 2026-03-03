import { NextResponse } from "next/server";

import * as productPolicy from "@/policies/domain/product";

import * as authService from "@/services/shared/auth";

import { getFile } from "@/services/domain/product/studio";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const teamId = await authService.getTeamId();
    await productPolicy.assertAccessible({ scope: { teamId }, id });

    const html = await getFile({ productId: id, filePath: "index.html" });
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
