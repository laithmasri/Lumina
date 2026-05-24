import Link from "next/link";
import StoryActions from "@/components/StoryActions";

import { notFound } from "next/navigation";
import { fetchStory } from "@/app/lib/api";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Story detail page — shows one story at /stories/[id].
 *
 * Server component: fetches the story on the server before sending HTML.
 */
export default async function StoryPage({
  params,
}: StoryPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const storyId = Number(id);

  if (Number.isNaN(storyId)) {
    notFound();
  }

  const story = await fetchStory(storyId);

  if (!story) {
    notFound();
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