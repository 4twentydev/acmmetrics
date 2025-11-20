"use client";

import { useState } from "react";

type PanelEntry = {
  date: string;
  employeeName: string;
  jobNumber: string;
  markNumber: string;
  panelType: string;
};

const initialManualEntry: PanelEntry = {
  date: "",
  employeeName: "",
  jobNumber: "",
  markNumber: "",
  panelType: "",
};

function parseCsv(content: string) {
  const rows = content
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const entries: PanelEntry[] = [];
  for (const row of rows) {
    const columns = row.split(",").map((col) => col.trim());
    if (columns.length < 5) continue;
    const [date, employeeName, jobNumber, markNumber, panelType] = columns;
    entries.push({ date, employeeName, jobNumber, markNumber, panelType });
  }
  return entries;
}

async function sendEntries(entries: PanelEntry[], setMessage: (msg: string) => void) {
  try {
    const response = await fetch("/api/panels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    if (!response.ok) {
      const error = await response.json();
      setMessage(error.error ?? "Upload failed");
      return;
    }
    const data = await response.json();
    setMessage(`Uploaded ${data.count} entries`);
  } catch (error) {
    setMessage((error as Error).message);
  }
}

export function AdminDataTools() {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [manualEntry, setManualEntry] = useState<PanelEntry>(initialManualEntry);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result?.toString() ?? "";
      const entries = parseCsv(text);
      if (!entries.length) {
        setStatusMessage("No rows detected in CSV");
        return;
      }
      setIsSubmitting(true);
      await sendEntries(entries, setStatusMessage);
      setIsSubmitting(false);
    };
    reader.readAsText(file);
  }

  async function handleManualSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    await sendEntries([manualEntry], setStatusMessage);
    setManualEntry(initialManualEntry);
    setIsSubmitting(false);
  }

  return (
    <section className="rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 shadow-sm shadow-emerald-500/20">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Admin only</p>
          <h2 className="text-2xl font-semibold text-white">Update panel data</h2>
          <p className="text-sm text-slate-400">
            Upload a CSV with headers (date, employeename, jobnumber, marknumber, paneltype) or add a
            quick manual row.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <label className="text-sm font-medium text-white">Upload CSV</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-slate-200"
          />
          <p className="mt-2 text-xs text-slate-500">
            Example row: 1-1-25,york-brandon,24017,sp1001,SRS
          </p>
        </div>
        <form onSubmit={handleManualSubmit} className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { label: "Date", id: "date", value: manualEntry.date, placeholder: "1-1-25" },
              { label: "Employee", id: "employeeName", value: manualEntry.employeeName, placeholder: "york-brandon" },
              { label: "Job number", id: "jobNumber", value: manualEntry.jobNumber, placeholder: "24017" },
              { label: "Mark number", id: "markNumber", value: manualEntry.markNumber, placeholder: "sp1001" },
              { label: "Panel type", id: "panelType", value: manualEntry.panelType, placeholder: "SRS" },
            ] as const
          ).map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {field.label}
              </label>
              <input
                id={field.id}
                type="text"
                value={field.value}
                onChange={(event) =>
                  setManualEntry((prev) => ({
                    ...prev,
                    [field.id]: event.target.value,
                  }))
                }
                required
                placeholder={field.placeholder}
                className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add manual entry"}
            </button>
          </div>
        </form>
        {statusMessage ? (
          <p className="text-sm font-medium text-emerald-300">{statusMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
