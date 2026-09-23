"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, Pin, Plus, Search, Trash2 } from "lucide-react";
import { NotesService, type StoredNote } from "@/lib/storage";
import { getExamSubjects } from "@/config/exams";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

const CARD =
  "rounded-3xl bg-white dark:bg-[#2b1620] shadow-[0_0_0_1.5px_rgba(138,22,48,0.12),0_18px_36px_-26px_rgba(90,15,35,0.4)] dark:shadow-[0_0_0_1.5px_rgba(255,255,255,0.1)] p-5";

export function NotesView() {
  const { currentWorkspace } = useExamWorkspace();
  const [notes, setNotes] = useState<StoredNote[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const reload = () => {
    const all = NotesService.getAll();
    setNotes(all);
    return all;
  };

  useEffect(() => {
    const all = reload();
    setSelectedId(all[0]?.id ?? null);
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const subjectOptions = useMemo(() => {
    const subjects = currentWorkspace
      ? getExamSubjects(currentWorkspace.examId, currentWorkspace.levelId).map((s) => s.name)
      : [];
    return ["General", ...subjects];
  }, [currentWorkspace]);

  const createNote = () => {
    const note = NotesService.create();
    reload();
    setSelectedId(note.id);
    setQuery("");
  };

  const patchNote = (id: string, updates: Partial<StoredNote>) => {
    NotesService.update(id, updates);
    reload();
  };

  const deleteNote = (id: string) => {
    NotesService.remove(id);
    const all = reload();
    if (selectedId === id) setSelectedId(all[0]?.id ?? null);
  };

  if (!hydrated) {
    return <div className={`${CARD} h-64 animate-pulse`} aria-hidden="true" />;
  }

  return (
    <div className="animate-page-enter space-y-5">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1b1216] dark:text-[#f5eff1]">
          Notes
        </h1>
        <p className="text-[#5a4a50] dark:text-[#a89ba1] text-sm mt-1">
          Keep what you learn. Saved on this device.
        </p>
      </div>

      <div className="grid lg:grid-cols-[330px_minmax(0,1fr)] gap-4 items-start">
        {/* List column */}
        <section className={CARD} aria-label="Your notes">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-extrabold text-[#1b1216] dark:text-[#f8ecee]">
              Your notes
            </h2>
            <button
              type="button"
              onClick={createNote}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8a1630] text-white text-[13px] font-extrabold hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>

          <label className="flex items-center gap-2.5 rounded-2xl bg-[#f4ecee] dark:bg-[#3a1f29] px-3.5 mb-1 focus-within:shadow-[0_0_0_2px_#8a1630]">
            <Search className="w-4 h-4 text-[#8a7a80] dark:text-[#a89ba1] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="flex-1 min-w-0 bg-transparent outline-none py-2.5 text-[14px] font-semibold text-[#1b1216] dark:text-[#f8ecee] placeholder:text-[#a89ba1]"
            />
          </label>

          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <span className="w-16 mx-auto block" aria-hidden="true">
                <ReviewTayoOwl size={64} withCap />
              </span>
              <p className="text-[13px] font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-2">
                {notes.length === 0
                  ? "No notes yet. Write your first one."
                  : "No notes match your search."}
              </p>
            </div>
          ) : (
            filtered.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setSelectedId(note.id)}
                aria-current={note.id === selectedId}
                className={`block w-full text-left rounded-2xl px-3.5 py-3 mt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                  note.id === selectedId
                    ? "bg-[#fbeff0] dark:bg-[#351a22] shadow-[inset_0_0_0_2px_#8a1630]"
                    : "shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.12)] hover:bg-[#fbeff0] dark:hover:bg-[#351a22]"
                }`}
              >
                <b className="flex items-center gap-1.5 text-[14px] font-bold text-[#1b1216] dark:text-[#f8ecee]">
                  {note.pinned && <Pin className="w-3.5 h-3.5 text-[#f6b93b] shrink-0" />}
                  <span className="truncate">{note.title || "Untitled note"}</span>
                </b>
                <small className="block text-[12px] font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-0.5 truncate">
                  {note.subject} · {note.body.split("\n")[0] || "No text yet"}
                </small>
              </button>
            ))
          )}
        </section>

        {/* Editor column */}
        {selected ? (
          <section className={CARD} aria-label="Note editor">
            <input
              type="text"
              value={selected.title}
              onChange={(e) => patchNote(selected.id, { title: e.target.value })}
              placeholder="Note title"
              aria-label="Note title"
              className="w-full bg-transparent outline-none font-display text-2xl font-extrabold tracking-[-0.02em] text-[#1b1216] dark:text-[#f8ecee] placeholder:text-[#c9b3b9]"
            />
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <select
                value={selected.subject}
                onChange={(e) => patchNote(selected.id, { subject: e.target.value })}
                aria-label="Note subject"
                className="rounded-xl bg-[#f4ecee] dark:bg-[#3a1f29] px-3 py-2 text-[13px] font-bold text-[#1b1216] dark:text-[#f8ecee] outline-none"
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                {!subjectOptions.includes(selected.subject) && (
                  <option value={selected.subject}>{selected.subject}</option>
                )}
              </select>
              <span className="text-[12px] font-bold text-[#12a150]">Saved on this device</span>
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => patchNote(selected.id, { pinned: !selected.pinned })}
                aria-pressed={selected.pinned}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.24)] text-[12.5px] font-extrabold text-[#1b1216] dark:text-[#f8ecee]"
              >
                <Pin className="w-3.5 h-3.5" />
                {selected.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                type="button"
                onClick={() => deleteNote(selected.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-[inset_0_0_0_1.5px_#9d1a33] text-[12.5px] font-extrabold text-[#9d1a33]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
            <textarea
              value={selected.body}
              onChange={(e) => patchNote(selected.id, { body: e.target.value })}
              placeholder="Write what you learned. Formulas, rules, tricks."
              aria-label="Note text"
              className="w-full min-h-[280px] mt-3.5 rounded-2xl bg-[#fbeff0] dark:bg-[#351a22] outline-none p-4 text-[15px] leading-relaxed font-medium text-[#1b1216] dark:text-[#f8ecee] resize-y focus-visible:shadow-[0_0_0_2px_#8a1630]"
            />
          </section>
        ) : (
          <section className={`${CARD} text-center py-14`} aria-label="No note selected">
            <span className="w-20 mx-auto block" aria-hidden="true">
              <ReviewTayoOwl size={80} withCap bob />
            </span>
            <h3 className="font-display text-xl font-extrabold mt-3 text-[#1b1216] dark:text-[#f8ecee]">
              Nothing selected
            </h3>
            <p className="text-[13px] font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-1">
              Pick a note, or write a new one.
            </p>
            <button
              type="button"
              onClick={createNote}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a1630] text-white text-sm font-extrabold"
            >
              <Bookmark className="w-4 h-4" />
              New note
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
