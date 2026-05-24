"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

import { deleteStory, updateStory, type Story } from "@/app/lib/api";

type StoryActionsProps = {
  story: Story;
};

export default function StoryActions({ story }: StoryActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(story.title);
  const [body, setBody] = useState(story.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleUpdate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const updated = await updateStory(story.id, {
      title: title.trim(),
      body: body.trim() || null,
    });

    setSubmitting(false);

    if (!updated) {
      setError("Failed to update story.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this story? This cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    const ok = await deleteStory(story.id);
    setSubmitting(false);

    if (!ok) {
      setError("Failed to delete story.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="mt-8 flex flex-col gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {submitting ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    );
  }

  return (
    <div className="mt-8 flex gap-3">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={submitting}
        className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}