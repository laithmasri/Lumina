"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

import { createStory } from "@/app/lib/api";

/**
 * Form for creating a new story. Runs in the browser (client component).
 */
export default function StoryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const story = await createStory({
      title: title.trim(),
      body: body.trim() || null,
    });

    setSubmitting(false);

    if (!story) {
      setError("Failed to create story. Is the backend running?");
      return;
    }

    setTitle("");
    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <textarea
        placeholder="Story body (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {submitting ? "Saving…" : "Create story"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}