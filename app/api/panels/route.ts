import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { appendPanelEntries, type PanelEntry } from "@/lib/panels";

function sanitizeEntry(entry: PanelEntry): PanelEntry | null {
  const { date, employeeName, jobNumber, markNumber, panelType } = entry;
  if (!date || !employeeName || !jobNumber || !markNumber || !panelType) {
    return null;
  }
  return {
    date: date.trim(),
    employeeName: employeeName.trim(),
    jobNumber: jobNumber.trim(),
    markNumber: markNumber.trim(),
    panelType: panelType.trim(),
  };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const entries = Array.isArray(body.entries) ? body.entries : [];
  if (!entries.length) {
    return NextResponse.json({ error: "No entries provided" }, { status: 400 });
  }

  const sanitized: PanelEntry[] = [];
  for (const entry of entries) {
    const cleaned = sanitizeEntry(entry as PanelEntry);
    if (!cleaned) {
      return NextResponse.json({ error: "Invalid entry detected" }, { status: 400 });
    }
    sanitized.push(cleaned);
  }

  await appendPanelEntries(sanitized);
  return NextResponse.json({ success: true, count: sanitized.length });
}
