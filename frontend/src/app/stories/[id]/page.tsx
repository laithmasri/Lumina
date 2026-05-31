"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import StoryActions from "@/components/StoryActions";
import { fetchStory, type Story } from "@/app/lib/api";
import { supabase } from "@/lib/supabase/client";

/**
 * Story detail page — shows one story at /stories/[id].
 */
export default function StoryPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStory() {
      const storyId = Number(params.id);
      if (Number.isNaN(storyId)) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token ?? null;
      if (!accessToken) {
        if (!cancelled) {
          setStory(null);
          setLoading(false);
        }
        return;
      }

      const result = await fetchStory(storyId, accessToken);
      if (!cancelled) {
        setStory(result);
        setLoading(false);
      }
    }

    loadStory();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex min-h-screen justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
        <article className="w-full max-w-2xl">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to all stories
          </Link>
          <p className="mt-6 text-zinc-600 dark:text-zinc-400">
            Story not found, or you are not signed in.
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <article className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to all stories
        </Link>

        <h1 className="mt-6 text-3xl font-semibold text-black dark:text-zinc-50">
          {story.title}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Created {new Date(story.created_at).toLocaleString()}
        </p>

        {story.body ? (
          <p className="mt-8 whitespace-pre-wrap text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            {story.body}
          </p>
        ) : (
          <p className="mt-8 italic text-zinc-500">No body text.</p>
        )}
        <StoryActions story={story} />
      </article>
    </div>
  );
}
