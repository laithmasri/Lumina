"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AuthPanel, { type AuthState } from "@/components/AuthPanel";
import StoryForm from "@/components/StoryForm";
import { buildApiUrl, fetchStories } from "@/app/lib/api";
import type { Story } from "@/app/lib/api";

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
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as HealthResponse;

    return data;
  } catch {
    return null;
  }
}


/**
 * Home page for the Lumina frontend.
 */
export default function Home(): React.JSX.Element {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  function handleAuthChanged({ isAuthenticated, accessToken: token }: AuthState) {
    setAuthenticated(isAuthenticated);
    setAccessToken(token);
    if (!isAuthenticated) {
      setStories([]);
    }
  }

  async function loadStories() {
    if (!accessToken) {
      setStories([]);
      return;
    }

    const result = await fetchStories(accessToken);
    setStories(result);
  }

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    fetchStories(accessToken).then((result) => {
      if (!cancelled) {
        setStories(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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
          <AuthPanel onAuthChanged={handleAuthChanged} />

          {authenticated ? (
            <>
              <section className="w-full max-w-md">
                <h2 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
                  Create a story
                </h2>
                <StoryForm onStoryCreated={loadStories} />
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
            </>
          ) : (
            <p className="max-w-md text-zinc-600 dark:text-zinc-400">
              Sign in to create and view your stories.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
