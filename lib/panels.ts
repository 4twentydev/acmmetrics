import { promises as fs } from "fs";
import path from "path";

export type PanelEntry = {
  date: string;
  employeeName: string;
  jobNumber: string;
  markNumber: string;
  panelType: string;
};

const dataPath = path.join(process.cwd(), "data", "panel-data.json");

export async function readPanelEntries() {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(file) as PanelEntry[];
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(dataPath, "[]", "utf-8");
      return [];
    }
    throw error;
  }
}

export async function appendPanelEntries(entries: PanelEntry[]) {
  const existing = await readPanelEntries();
  const next = [...existing, ...entries];
  await fs.writeFile(dataPath, JSON.stringify(next, null, 2));
  return next;
}
