import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/components/contact/ContactForm";

const sendForm = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: { sendForm: (...args: unknown[]) => sendForm(...args) },
}));

beforeEach(() => {
  sendForm.mockReset();
  sendForm.mockResolvedValue({ status: 200, text: "OK" });
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "svc");
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "tpl");
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", "key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
  delete (globalThis as unknown as { jest?: unknown }).jest;
});

// @testing-library/react's asyncWrapper drains an internal microtask queue
// via a hardcoded `setTimeout(..., 0)` that it only advances when it detects
// Jest's fake timers (a global `jest` with a faked `setTimeout`). Vitest has
// no such global, so under `vi.useFakeTimers()` that internal timer never
// fires and user-event's act()-wrapped interactions (click/type) deadlock.
// Shimming a minimal `jest.advanceTimersByTime` that delegates to Vitest's
// real fake-timer clock satisfies RTL's detection and unblocks it. Cleaned
// up in afterEach above so it never leaks into other tests.
function enableJestFakeTimerShim() {
  (globalThis as unknown as { jest?: { advanceTimersByTime: typeof vi.advanceTimersByTime } }).jest = {
    advanceTimersByTime: vi.advanceTimersByTime,
  };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Aron");
  await user.type(screen.getByLabelText("Email"), "aron@example.com");
  await user.type(
    screen.getByLabelText("Message"),
    "Hello, I would like to talk about a project.",
  );
}

describe("ContactForm", () => {
  it("shows validation errors and does not send when submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
    expect(sendForm).not.toHaveBeenCalled();
  });

  it("marks invalid fields with aria-invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
  });

  it("sends and reports success for valid input", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => expect(sendForm).toHaveBeenCalledTimes(1));
    expect(sendForm.mock.calls[0][0]).toBe("svc");
    expect(sendForm.mock.calls[0][1]).toBe("tpl");
    expect(
      await screen.findByText("Email sent successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("reports failure and keeps the entered values", async () => {
    sendForm.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText("Failed to send email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Aron");
  });

  it("clears the status message after three seconds", async () => {
    vi.useFakeTimers();
    enableJestFakeTimerShim();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));
    await vi.waitFor(() =>
      expect(screen.getByText("Email sent successfully!")).toBeInTheDocument(),
    );

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Email sent successfully!")).toBeNull();
  });

  it("silently drops submissions when the honeypot is filled", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);

    await fillValid(user);
    const honeypot = container.querySelector<HTMLInputElement>(
      "input[name='website']",
    );
    expect(honeypot).not.toBeNull();
    await user.type(honeypot!, "spam.example");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => expect(sendForm).not.toHaveBeenCalled());
  });

  it("disables submit and explains when EmailJS is not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "");
    render(<ContactForm />);

    expect(screen.getByRole("button", { name: "Send Message" })).toBeDisabled();
    expect(
      screen.getByText(/contact form is not configured/i),
    ).toBeInTheDocument();
  });
});
