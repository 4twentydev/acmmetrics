import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/sign-out-button";
import { AdminDataTools } from "@/components/admin-data-tools";
import { authOptions } from "@/lib/auth";
import {
  acmMix,
  companyHeadlineStats,
  crewReviews,
  crewSummary,
  type CrewReview,
  type CrewSummaryBreakdown,
  yearlyMetrics,
} from "@/lib/metrics";
import {
  getEmployeeAccountById,
  type EmployeeAccount,
} from "@/lib/employees";

const numberFormatter = new Intl.NumberFormat("en-US");
const percentFormatter = (value: number) => `${(value * 100).toFixed(1)}%`;

type StatCardProps = {
  title: string;
  value: string;
  helper?: string;
  accent?: "default" | "emerald";
};

function isActiveInYear(review: CrewReview, year: number) {
  const start = new Date(review.hireDate);
  const lastActive = new Date(start);
  lastActive.setDate(start.getDate() + review.activeWeeks * 7);
  return start.getFullYear() <= year && lastActive.getFullYear() >= year;
}

function weeksActiveInYear(review: CrewReview, year: number) {
  const start = new Date(review.hireDate);
  const end = new Date(start);
  end.setDate(start.getDate() + review.activeWeeks * 7);

  const yearStart = new Date(`${year}-01-01T00:00:00Z`);
  const yearEnd = new Date(`${year}-12-31T23:59:59Z`);

  const overlapStart = new Date(Math.max(start.getTime(), yearStart.getTime()));
  const overlapEnd = new Date(Math.min(end.getTime(), yearEnd.getTime()));

  const ms = overlapEnd.getTime() - overlapStart.getTime();
  if (ms <= 0) return 0;
  return ms / (1000 * 60 * 60 * 24 * 7);
}

function panelsForYear(review: CrewReview, year: number) {
  const weeks = weeksActiveInYear(review, year);
  if (weeks <= 0) return 0;
  return Math.max(0, Math.round(review.acmPerWeek * weeks));
}

function StatCard({ title, value, helper, accent = "default" }: StatCardProps) {
  const accentClasses =
    accent === "emerald"
      ? "border-emerald-400/40 bg-emerald-500/10"
      : "border-white/10 bg-slate-900/80";
  return (
    <div
      className={`rounded-2xl ${accentClasses} p-4 shadow-sm shadow-black/5 backdrop-blur sm:p-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {helper ? (
        <p className="mt-1 text-sm text-slate-400">{helper}</p>
      ) : null}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
      {label}
    </span>
  );
}

function PersonalizedHero({
  viewer,
  panelRank,
  paceRank,
  totalCrew,
}: {
  viewer: CrewReview;
  panelRank: number;
  paceRank: number;
  totalCrew: number;
}) {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 p-8 shadow-sm shadow-emerald-500/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill label="Personalized view" />
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Hey {viewer.name.split(" ")[0]}, here&apos;s your lane
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            You&apos;re #{panelRank} out of {totalCrew} for lifetime ACM panels and #{paceRank}
            for ACM/week velocity.
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ACM panels"
          value={numberFormatter.format(viewer.acmPanels)}
          helper={`${viewer.acmPerWeek.toFixed(1)} ACM / week`}
          accent="emerald"
        />
        <StatCard
          title="Active weeks"
          value={`${viewer.activeWeeks}`}
          helper={`Hire ${viewer.hireDate}`}
        />
        <StatCard
          title="ACM share"
          value={percentFormatter(viewer.acmShare)}
          helper="Of your tracked panels"
        />
        <StatCard
          title="Crew percentile"
          value={`${Math.round(((totalCrew - panelRank + 1) / totalCrew) * 100)}th`}
          helper="Panel volume placement"
        />
      </div>
    </section>
  );
}

function ManagerHero({ account }: { account: EmployeeAccount }) {
  const label = account.role === "admin" ? "Admin control" : "Leadership view";
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 p-8 shadow-sm shadow-emerald-500/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill label={label} />
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Welcome back, {account.name}
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            Monitor ACM vs Seal & Stack output and crew pacing. Editing and overrides stay in
            the ops toolkit.
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ACM panels analyzed"
          value={numberFormatter.format(companyHeadlineStats.analyzedPanels)}
          helper="Across 55 multi-week employees"
        />
        <StatCard
          title="Strongest ACM year"
          value={`${companyHeadlineStats.strongestYear}`}
          helper={`${companyHeadlineStats.strongestYearRate.toFixed(1)} ACM / week`}
        />
        <StatCard
          title="Current crew share"
          value={percentFormatter(companyHeadlineStats.currentCrewShare)}
          helper="Of 2024-2025 ACM output"
        />
        <StatCard
          title="High-purity specialists"
          value={`${companyHeadlineStats.highPuritySpecialists}`}
          helper=">85% of workload is ACM"
        />
      </div>
    </section>
  );
}

function NeighborList({
  viewer,
  sortedCrew,
  year,
}: {
  viewer: CrewReview;
  sortedCrew: { review: CrewReview; panels: number }[];
  year: number;
}) {
  const rank = sortedCrew.findIndex((row) => row.review.id === viewer.id);
  const windowStart = Math.max(0, rank - 2);
  const windowEnd = Math.min(sortedCrew.length, rank + 3);
  const window = sortedCrew.slice(windowStart, windowEnd);

  if (rank === -1) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Where you sit</h3>
            <p className="text-sm text-slate-400">
              No ranking for {year} yet. Once you log activity this year, your placement will show up
              here.
            </p>
          </div>
          <Pill label={`${year} YTD`} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Where you sit</h3>
          <p className="text-sm text-slate-400">ACM panels leaderboard · {year}</p>
        </div>
        <Pill label={`${year} YTD`} />
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {window.map((crew) => {
          const place =
            sortedCrew.findIndex((row) => row.review.id === crew.review.id) + 1;
          const isViewer = crew.review.id === viewer.id;
          return (
            <li
              key={crew.review.id}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                isViewer
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">#{place}</span>
                <div>
                  <p className="font-medium text-white">
                    {crew.review.name}
                    {isViewer ? " (you)" : ""}
                  </p>
                  <p className="text-xs text-slate-400">
                    {crew.review.acmPerWeek.toFixed(1)} ACM / week ·{" "}
                    {numberFormatter.format(crew.panels)} panels
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {percentFormatter(crew.review.acmShare)} share
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const account = getEmployeeAccountById(session.user.id);
  if (!account) {
    redirect("/login");
  }

  const currentYear =
    yearlyMetrics[yearlyMetrics.length - 1]?.year ?? new Date().getFullYear();
  const viewer = crewReviews.find((review) => review.id === account.id);
  const canSeeAll = account.role !== "employee";
  const sortedByPanels = [...crewReviews].sort((a, b) => b.acmPanels - a.acmPanels);
  const sortedByPace = [...crewReviews].sort((a, b) => b.acmPerWeek - a.acmPerWeek);
  const currentYearCrew = crewReviews.filter((review) =>
    isActiveInYear(review, currentYear),
  );
  const currentYearPanels = currentYearCrew.map((review) => ({
    review,
    panels: panelsForYear(review, currentYear),
  }));
  const currentYearSortedByPanels = currentYearPanels
    .filter((row) => row.panels > 0)
    .sort((a, b) => b.panels - a.panels);

  const panelRank = viewer
    ? sortedByPanels.findIndex((row) => row.id === viewer.id) + 1
    : null;
  const paceRank = viewer
    ? sortedByPace.findIndex((row) => row.id === viewer.id) + 1
    : null;
  const totalCrew = crewReviews.length;
  const lifetimeBreakdowns: CrewSummaryBreakdown[] = [
    crewSummary.lifetime,
    crewSummary.modern,
  ];
  const orderedReviews = canSeeAll
    ? crewReviews
    : viewer
      ? [viewer]
      : [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-16 pt-10 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {viewer ? (
          <PersonalizedHero
            viewer={viewer}
            panelRank={panelRank!}
            paceRank={paceRank!}
            totalCrew={totalCrew}
          />
        ) : (
          <ManagerHero account={account} />
        )}

        {account.role === "admin" ? <AdminDataTools /> : null}

        {viewer ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <NeighborList viewer={viewer} sortedCrew={currentYearSortedByPanels} year={currentYear} />
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
              <h3 className="text-lg font-semibold text-white">Snapshot</h3>
              <p className="text-sm text-slate-400">
                You sit ahead of {totalCrew - (panelRank ?? 0)} teammates in lifetime ACM output
                and ahead of {totalCrew - (paceRank ?? 0)} in ACM/week.
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Share of crew ACM</dt>
                  <dd className="font-semibold text-white">
                    {percentFormatter(
                      viewer.acmPanels / crewSummary.modern.currentCrew,
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Mix purity</dt>
                  <dd className="font-semibold text-white">
                    {percentFormatter(viewer.acmShare)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Velocity rank</dt>
                  <dd className="font-semibold text-white">#{paceRank}</dd>
                </div>
              </dl>
              <Link
                href="#reviews"
                className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-300"
              >
                Jump to detailed review →
              </Link>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Company story by year</h2>
              <p className="text-sm text-slate-400">
                Focus on 2015 baseline plus 2023-2025 rebuild era.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill label="ACM share" />
              <Pill label="Productivity per week" />
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2">Year</th>
                  <th>ACM panels</th>
                  <th>Seal & stack</th>
                  <th>Total panels</th>
                  <th>ACM share</th>
                  <th>ACM / week</th>
                  <th>Headline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {yearlyMetrics.map((metric) => (
                  <tr key={metric.year} className="text-sm">
                    <td className="py-3 font-medium text-white">{metric.year}</td>
                    <td>{numberFormatter.format(metric.acmPanels)}</td>
                    <td>{numberFormatter.format(metric.sealPanels)}</td>
                    <td>{numberFormatter.format(metric.totalPanels)}</td>
                    <td className="font-medium">{percentFormatter(metric.acmShare)}</td>
                    <td>{metric.acmPerWeek.toFixed(1)}</td>
                    <td className="text-slate-400">{metric.headline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Weeks are distinct ISO weeks with production. Shop rows with unknown personnel stay
            inside company totals but not individual stats.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">ACM system mix</h2>
                <p className="text-sm text-slate-400">SRS dominates the modern era; 2015 stayed balanced.</p>
              </div>
              <Pill label="SRS heavy" />
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="py-2">Year</th>
                    <th>DRY</th>
                    <th>WET</th>
                    <th>SRS</th>
                    <th>PER</th>
                    <th>Other</th>
                    <th>BVR</th>
                    <th>RSC</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {acmMix.map((row) => (
                    <tr key={row.year} className="text-sm">
                      <td className="py-3 font-medium text-white">{row.year}</td>
                      <td>{percentFormatter(row.dry)}</td>
                      <td>{percentFormatter(row.wet)}</td>
                      <td className="font-semibold text-emerald-600">{percentFormatter(row.srs)}</td>
                      <td>{percentFormatter(row.per)}</td>
                      <td>{percentFormatter(row.other)}</td>
                      <td>{percentFormatter(row.bvr)}</td>
                      <td>{percentFormatter(row.rsc)}</td>
                      <td className="text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
              <h3 className="text-lg font-semibold text-white">ACM heroes call-out</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>Robert Hutchinson sits #2 all-time</li>
                <li>
                  Cristian Fuentes already #9 with {" "}
                  <span className="font-semibold">1.7k</span> ACM panels
                </li>
                <li>Use them as mentors for SRS-heavy runs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Current crew vs legacy</h2>
              <p className="text-sm text-slate-400">Lifetime dataset vs modern era (2024-2025) cut.</p>
            </div>
            <Pill label="Crew load" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {lifetimeBreakdowns.map((segment) => {
              const currentShare = segment.currentCrew / segment.totalAcm;
              return (
                <div key={segment.label} className="rounded-2xl border border-white/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {segment.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {numberFormatter.format(segment.totalAcm)}{" "}
                    <span className="text-base font-normal text-slate-400">ACM</span>
                  </p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt>Current crew</dt>
                      <dd className="font-semibold text-white">
                        {numberFormatter.format(segment.currentCrew)} ({percentFormatter(currentShare)})
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Legacy names</dt>
                      <dd className="text-slate-400">{numberFormatter.format(segment.legacyCrew)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Shop / unassigned</dt>
                      <dd className="text-slate-400">{numberFormatter.format(segment.shop)}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {crewSummary.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section
          id="reviews"
          className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-sm shadow-black/10"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-white">Individual reviews</h2>
            <p className="text-sm text-slate-400">
              Hire date = first appearance in the dataset. Active weeks are unique ISO weeks with activity.
            </p>
          </div>
          {orderedReviews.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No crew metrics tied to this login yet.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {orderedReviews.map((review) => (
                <article
                  key={review.id}
                  className={`rounded-2xl border bg-slate-900/60 p-5 ${
                    review.id === viewer?.id
                      ? "border-emerald-400/40"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {review.name}
                        {review.id === viewer?.id ? " · you" : ""}
                      </h3>
                      <p className="text-sm text-slate-400">{review.context}</p>
                    </div>
                    <Pill label={`Hire ${review.hireDate}`} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <StatCard title="Active weeks" value={review.activeWeeks.toString()} />
                    <StatCard
                      title="ACM panels"
                      value={numberFormatter.format(review.acmPanels)}
                    />
                    <StatCard
                      title="ACM / week"
                      value={review.acmPerWeek.toFixed(1)}
                    />
                    <StatCard
                      title="ACM share"
                      value={percentFormatter(review.acmShare)}
                    />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Strengths
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                        {review.strengths.map((strength) => (
                          <li key={strength}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                        Opportunities
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                        {review.opportunities.map((opportunity) => (
                          <li key={opportunity}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
