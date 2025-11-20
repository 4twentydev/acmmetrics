import type { CrewReview } from "@/lib/metrics";
import { crewReviews } from "@/lib/metrics";

export type Role = "admin" | "manager" | "employee";

export type EmployeeAccount = {
  id: string;
  username: string;
  email: string;
  name: string;
  password: string;
  role: Role;
};

const DEFAULT_PASSWORD = "620Harlan";
const ADMIN_PASSWORD = "BYorkAdmin620";

const suffixes = new Set(["jr", "sr", "iii", "iv"]);

function toUsernameFromId(id: string, name: string) {
  const partsFromId = id.split("-");
  if (partsFromId.length >= 2) {
    const last = partsFromId[partsFromId.length - 1];
    const first = partsFromId.slice(0, partsFromId.length - 1).join("-");
    return `${last}-${first}`;
  }

  const nameParts = name
    .toLowerCase()
    .split(" ")
    .map((part) => part.replace(/[^a-z]/g, ""))
    .filter(Boolean);
  if (nameParts.length < 2) return `${nameParts[0] ?? name}-crew`;
  const maybeSuffix = nameParts[nameParts.length - 1];
  const lastName = suffixes.has(maybeSuffix)
    ? nameParts[nameParts.length - 2]
    : maybeSuffix;
  return `${lastName}-${nameParts[0]}`;
}

// Demo accounts powered by the static dataset. Replace this with a real user store + hashed passwords in production.
const baseAccounts: EmployeeAccount[] = crewReviews.map((crew) => {
  const username = toUsernameFromId(crew.id, crew.name);
  const isBrandon = crew.id === "brandon-york";
  return {
    id: crew.id,
    username,
    email: `${username}@acmweekly.com`,
    name: crew.name,
    password: isBrandon ? ADMIN_PASSWORD : DEFAULT_PASSWORD,
    role: isBrandon ? "admin" : "employee",
  };
});

export const employeeAccounts: EmployeeAccount[] = [
  ...baseAccounts,
  {
    id: "james-tucker",
    username: "tucker-james",
    email: "tucker-james@acmweekly.com",
    name: "James Tucker",
    password: DEFAULT_PASSWORD,
    role: "manager",
  },
];

export function findEmployeeByUsername(
  username: string,
): EmployeeAccount | undefined {
  const normalized = username.toLowerCase();
  return employeeAccounts.find(
    (account) => account.username.toLowerCase() === normalized,
  );
}

export function getEmployeeAccountById(id: string) {
  return employeeAccounts.find((account) => account.id === id);
}

export function getCrewReviewByAccount(
  account: EmployeeAccount,
): CrewReview | undefined {
  return crewReviews.find((crew) => crew.id === account.id);
}
