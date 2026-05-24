import Image from "next/image";
import Link from "next/link";

import StoryForm from "@/components/StoryForm";
import { buildApiUrl, fetchStories } from "@/app/lib/api";

type HealthResponse = {
  status: string;
  service: string;
};


/**
 * Fetch the health status from the backend API.
 * 
 * @returns The health status from the backend API, or null if the request fails.
 */
async function fetchHealth(): Promise<HealthResponse | null> {
  const url = buildApiUrl("/health");

  try {
    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 5 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as HealthResponse;

    return data;
  }
  catch {
    return null;
  }
}


/**
 * Home page for the Lumina frontend.
 *
 * This is a server component in the Next.js App Router. It fetches
 * the backend health status during the initial render and displays
 * a simple indicator to confirm that the API is reachable.
 */
export default async function Home(): Promise<React.JSX.Element> {
  const health = await fetchHealth();
  const stories = await fetchStories();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Lumina – short stories with AI-generated media
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Backend health:{" "}
            <span className="font-semibold">
              {health ? `${health.status} (${health.service})` : "unreachable"}
            </span>
          </p>
          <section className="w-full max-w-md">
            <h2 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
              Create a story
            </h2>
            <StoryForm />
          </section>

          <section className="w-full max-w-md">
            <h2 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
              Your stories
            </h2>
            {stories.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">No stories yet.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {stories.map((story) => (
                  <li
                    key={story.id}
                    className="rounded border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <h3 className="font-semibold text-black dark:text-zinc-50">
                      <Link
                        href={`/stories/${story.id}`}
                        className="hover:underline"
                      >
                        {story.title}
                      </Link>
                    </h3>
                    {story.body && (
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {story.body}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}