"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signIn } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email: email.trim() === "",
      password: password === "",
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    setIsSubmitting(true);
    setSubmitError("");
    const result = await signIn(email, password);

    if (!result.success) {
      setSubmitError(result.error ?? "Something went wrong. Try again.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Login</h1>
      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">Email is required</p>
          )}
        </div>
        <div>
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">Password is required</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-brand-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}
