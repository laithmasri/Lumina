"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
};

type AuthPanelProps = {
  onAuthChanged: (auth: AuthState) => void;
};

function isEmailNotVerifiedError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("email not confirmed") ||
    normalized.includes("email not verified")
  );
}

export default function AuthPanel({ onAuthChanged }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const onAuthChangedRef = useRef(onAuthChanged);

  useEffect(() => {
    onAuthChangedRef.current = onAuthChanged;
  }, [onAuthChanged]);

  useEffect(() => {
    function notifyAuth(session: { user: { email?: string } | null; access_token?: string } | null) {
      setUserEmail(session?.user?.email ?? null);
      onAuthChangedRef.current({
        isAuthenticated: Boolean(session?.user),
        accessToken: session?.access_token ?? null,
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      notifyAuth(session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      notifyAuth(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function handleResendConfirmation() {
    if (!email.trim()) {
      setError("Enter your email above, then click resend.");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setMessage("Confirmation email sent. Check your inbox and spam folder.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setNeedsEmailVerification(false);
    setLoading(true);

    try {
      if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          setMessage("Account created. You are signed in.");
          setEmail("");
          setPassword("");
          return;
        }

        setMessage(
          "Account created. Check your email for a confirmation link before signing in.",
        );
        setMode("sign-in");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (isEmailNotVerifiedError(signInError.message)) {
          setNeedsEmailVerification(true);
          setError(
            "Your email is not verified yet. Confirm it from the email Supabase sent, or resend the confirmation email below.",
          );
          return;
        }

        setError(signInError.message);
        return;
      }

      if (data.session) {
        setUserEmail(data.session.user.email ?? null);
        onAuthChangedRef.current({
          isAuthenticated: true,
          accessToken: data.session.access_token,
        });
      }

      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (userEmail) {
    return (
      <section className="w-full max-w-md rounded border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Signed in as <span className="font-medium">{userEmail}</span>
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className="mt-3 rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>
    );
  }

  return (
    <section className="w-full max-w-md rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
        {mode === "sign-in" ? "Sign in" : "Create account"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
      {needsEmailVerification && (
        <button
          type="button"
          onClick={handleResendConfirmation}
          disabled={loading}
          className="mt-3 text-sm underline"
        >
          Resend confirmation email?
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          setError(null);
          setMessage(null);
          setNeedsEmailVerification(false);
        }}
        className="mt-3 text-sm underline"
      >
        {mode === "sign-in"
          ? " Need an account? Sign up"
          : " Already have an account? Sign in"}
      </button>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
