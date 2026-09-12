export const PROGRESS_KEY = "hmwi.hacker-space.progress.v1";
export const PROGRESS_EVENT = "hmwi:hacker-space-progress";
export type Result = { version: number; best: number; last: number; attempts: number };
export type Progress = Record<string, Result>;
type MissionVersion = { id: string; version: number };

export function parseProgress(raw: string, missions: MissionVersion[]): Progress {
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || !("schema" in data) || data.schema !== 1 || !("results" in data)) return {};
    const results = data.results;
    if (!results || typeof results !== "object") return {};
    const valid: Progress = {};
    for (const mission of missions) {
      if (!Object.hasOwn(results, mission.id)) continue;
      const value: unknown = (results as Record<string, unknown>)[mission.id];
      if (!value || typeof value !== "object") continue;
      const r = value as Result;
      if (r.version === mission.version && Number.isInteger(r.best) && r.best >= 0 && r.best <= 100
        && Number.isInteger(r.last) && r.last >= 0 && r.last <= r.best
        && Number.isSafeInteger(r.attempts) && r.attempts > 0) {
        valid[mission.id] = { version: r.version, best: r.best, last: r.last, attempts: r.attempts };
      }
    }
    return valid;
  } catch {
    return {};
  }
}

export function recordResult(progress: Progress, mission: MissionVersion, score: number): Progress {
  if (!Number.isInteger(score) || score < 0 || score > 100) throw new Error("Invalid score");
  const old = progress[mission.id]?.version === mission.version ? progress[mission.id] : undefined;
  return { ...progress, [mission.id]: {
    version: mission.version, best: Math.max(old?.best ?? 0, score), last: score,
    attempts: Math.min((old?.attempts ?? 0) + 1, Number.MAX_SAFE_INTEGER),
  } };
}

export function readSnapshot(): string {
  try { return window.localStorage.getItem(PROGRESS_KEY) ?? ""; } catch { return ""; }
}
export function serverSnapshot(): string { return ""; }
export function subscribeProgress(callback: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === PROGRESS_KEY || event.key === null) callback();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(PROGRESS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROGRESS_EVENT, callback);
  };
}
export function saveResult(missions: MissionVersion[], mission: MissionVersion, score: number): boolean {
  try {
    const results = recordResult(parseProgress(readSnapshot(), missions), mission, score);
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ schema: 1, results }));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
    return true;
  } catch { return false; }
}
