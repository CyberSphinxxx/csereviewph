import { isBrowserTarget } from "./safe-storage";

/**
 * Notes: a local-first scratchpad for what the examinee learns while
 * practicing (formulas, rules, tricks). Lives in its own localStorage key so
 * existing data namespaces stay untouched; rides along in backup payloads
 * (version 2) but is never required to sync.
 */

export interface StoredNote {
  id: string;
  title: string;
  body: string;
  /** Subject name tag; "General" when untagged. */
  subject: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NOTES_STORAGE_KEY = "cse_guest_notes";

const MAX_NOTES = 500;

function safeGet(): StoredNote[] {
  if (!isBrowserTarget()) return [];
  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n) => n && typeof n === "object" && typeof n.id === "string")
      .map((n) => ({
        id: String(n.id),
        title: typeof n.title === "string" ? n.title : "",
        body: typeof n.body === "string" ? n.body : "",
        subject: typeof n.subject === "string" && n.subject ? n.subject : "General",
        pinned: Boolean(n.pinned),
        createdAt: typeof n.createdAt === "string" ? n.createdAt : new Date().toISOString(),
        updatedAt: typeof n.updatedAt === "string" ? n.updatedAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

function safeSet(notes: StoredNote[]): boolean {
  if (!isBrowserTarget()) return false;
  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes.slice(0, MAX_NOTES)));
    return true;
  } catch {
    return false;
  }
}

export class NotesService {
  public static getAll(): StoredNote[] {
    return safeGet().sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }

  public static search(query: string): StoredNote[] {
    const q = query.trim().toLowerCase();
    const all = this.getAll();
    if (!q) return all;
    return all.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)
    );
  }

  public static create(input?: { title?: string; body?: string; subject?: string }): StoredNote {
    const now = new Date().toISOString();
    const note: StoredNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: input?.title ?? "",
      body: input?.body ?? "",
      subject: input?.subject ?? "General",
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    const all = safeGet();
    safeSet([note, ...all]);
    return note;
  }

  public static update(id: string, updates: Partial<Pick<StoredNote, "title" | "body" | "subject" | "pinned">>): StoredNote | null {
    const all = safeGet();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const updated: StoredNote = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    safeSet(all);
    return updated;
  }

  public static remove(id: string): void {
    safeSet(safeGet().filter((n) => n.id !== id));
  }

  public static count(): number {
    return safeGet().length;
  }

  /** Backup/restore helpers (version 2 payloads carry these). */
  public static exportForBackup(): StoredNote[] {
    return safeGet();
  }

  public static importFromBackup(notes: unknown): void {
    if (!Array.isArray(notes)) return;
    const existing = new Map(safeGet().map((n) => [n.id, n]));
    for (const raw of notes) {
      if (!raw || typeof raw !== "object" || typeof (raw as StoredNote).id !== "string") continue;
      const n = raw as StoredNote;
      existing.set(n.id, {
        id: n.id,
        title: typeof n.title === "string" ? n.title : "",
        body: typeof n.body === "string" ? n.body : "",
        subject: typeof n.subject === "string" && n.subject ? n.subject : "General",
        pinned: Boolean(n.pinned),
        createdAt: typeof n.createdAt === "string" ? n.createdAt : new Date().toISOString(),
        updatedAt: typeof n.updatedAt === "string" ? n.updatedAt : new Date().toISOString(),
      });
    }
    safeSet(Array.from(existing.values()));
  }
}
