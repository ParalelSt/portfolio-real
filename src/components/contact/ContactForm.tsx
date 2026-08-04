"use client";

import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  hasErrors,
  isBot,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/validation";

const EMPTY_FIELDS: ContactFields = { name: "", email: "", message: "", website: "" };
const NO_ERRORS: ContactErrors = { name: null, email: null, message: null };

const FIELD_CLASS =
  "w-full rounded-sm border border-rule bg-surface px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-accent";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<ContactErrors>(NO_ERRORS);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

  // Read at component scope (not module scope) so tests can stub env vars
  // per-case with vi.stubEnv. The full literal `process.env.NEXT_PUBLIC_*`
  // access is preserved so Next's build-time inlining still works.
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

  const configured =
    SERVICE_ID.length > 0 && TEMPLATE_ID.length > 0 && PUBLIC_KEY.length > 0;

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const update = (key: keyof ContactFields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !configured) return;

    if (isBot(fields)) {
      setFields(EMPTY_FIELDS);
      return;
    }

    const nextErrors = validateContact(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    if (!formRef.current) return;

    setSending(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setFields(EMPTY_FIELDS);
      setErrors(NO_ERRORS);
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
      <Field
        id="name"
        label="Name"
        error={errors.name}
        value={fields.name}
        onChange={update("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        error={errors.email}
        value={fields.email}
        onChange={update("email")}
      />
      <Field
        id="message"
        label="Message"
        multiline
        error={errors.message}
        value={fields.message}
        onChange={update("message")}
      />

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={update("website")}
        />
      </div>

      {!configured && (
        <p className="font-mono text-xs text-ink-faint">
          The contact form is not configured right now. Email me directly instead.
        </p>
      )}

      <button
        type="submit"
        disabled={sending || !configured}
        className="w-fit rounded-full bg-accent px-6 py-3 font-mono text-sm text-canvas transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>

      <p
        aria-live="polite"
        className={cn(
          "font-mono text-sm",
          status === "sent" && "text-accent",
          status === "failed" && "text-red-400",
        )}
      >
        {status === "sent" && "Email sent successfully!"}
        {status === "failed" && "Failed to send email"}
      </p>
    </form>
  );
}

type FieldProps = {
  id: "name" | "email" | "message";
  label: string;
  error: string | null;
  value: string;
  type?: string;
  multiline?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

function Field({ id, label, error, value, type = "text", multiline, onChange }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CLASS, "resize-y", error && "border-red-400")}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CLASS, error && "border-red-400")}
        />
      )}
      {error && (
        <p id={errorId} className="font-mono text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
