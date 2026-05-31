/**
 * Shared API utilities for talking to the Lumina backend.
 */

import { supabase } from "@/lib/supabase/client";

export type Story = {
    id: number;
    title: string;
    body: string | null;
    created_at: string;
    updated_at: string;
};

export type StoryCreatePayload = {
    title: string;
    body?: string | null;
};

export type StoryUpdatePayload = {
    title?: string;
    body?: string | null;
};


/**
 * Build the absolute URL for a backend API endpoint.
 * 
 * @param path - The URL path.
 * 
 * @returns - The built path.
 */
export function buildApiUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    return `${baseUrl}${path}`;
}

async function getAuthHeaders(
    accessToken?: string | null,
): Promise<HeadersInit | null> {
    if (accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`,
        };
    }

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
        return null;
    }

    return {
        Authorization: `Bearer ${data.session.access_token}`,
    };
}


/**
 * Create a new story via POST. Used from client components (browser).
 * 
 * @param payload  - The new story info.
 * 
 * @returns - The story that was created.
 */
export async function createStory(
    payload: StoryCreatePayload,
): Promise<Story | null> {
    const url = buildApiUrl("/api/v1/stories");

    try {
        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            return null;
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                ...authHeaders,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as Story;
    } catch {
        return null;
    }
}


/**
 * Delete a story linked to the provided storyId value.
 * 
 * @param storyId - The id of the story to delete.
 * 
 * @returns - True if the story was deleted. Otherwise False.
 */
export async function deleteStory(storyId: number): Promise<boolean> {
    const url = buildApiUrl(`/api/v1/stories/${storyId}`);
  
    try {
        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            return false;
        }

        const response = await fetch(url, {
            method: "DELETE",
            headers: authHeaders,
        });
  
        return response.ok;
    } catch {
        return false;
    }
}


/**
 * Update the story that has the provided storyId.
 * 
 * @param storyId - The id of the story that needs to be updated.
 * @param payload - The updated information for the story.
 * 
 * @returns - The story with the updated information.
 */
export async function updateStory(
    storyId: number,
    payload: StoryUpdatePayload,
  ): Promise<Story | null> {
    const url = buildApiUrl(`/api/v1/stories/${storyId}`);
  
    try {
        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            return null;
        }

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                ...authHeaders,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
            return null;
        }
  
        return (await response.json()) as Story;
    } catch {
        return null;
    }
}


/**
 * Fetch a single story by id.
 * Intended for server components on the story detail page.
 * 
 * @param storyId - The id of the story to be fetched.
 * 
 * @returns - The story that was requested.
 */
export async function fetchStory(
    storyId: number,
    accessToken?: string | null,
): Promise<Story | null> {
    const url = buildApiUrl(`/api/v1/stories/${storyId}`);
    try {
        const authHeaders = await getAuthHeaders(accessToken);
        if (!authHeaders) {
            return null;
        }

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: authHeaders,
        });
        if (!response.ok) {
            return null;
        }
        return (await response.json()) as Story;
    } catch {
        return null;
    }
}


/**
 * Fetch all stories from the backend (newest first).
 * Intended for server components during page render.
 * 
 * @returns - All the fetched stories.
 */
export async function fetchStories(
    accessToken?: string | null,
): Promise<Story[]> {
    const url = buildApiUrl("/api/v1/stories");

    try {
        const authHeaders = await getAuthHeaders(accessToken);
        if (!authHeaders) {
            return [];
        }

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: authHeaders,
        });

        if (!response.ok) {
            return [];
        }

        return (await response.json()) as Story[];
    } catch {
        return [];
    }
}






