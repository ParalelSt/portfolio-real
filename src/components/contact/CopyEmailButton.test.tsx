import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CopyEmailButton from "@/components/contact/CopyEmailButton";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("CopyEmailButton", () => {
  it("shows the email address by default", () => {
    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    expect(
      screen.getByRole("button", { name: /aronmatoic@gmail.com/ }),
    ).toBeInTheDocument();
  });

  it("copies to the clipboard and flips the label", async () => {
    // userEvent.setup() attaches its own clipboard stub directly onto the
    // `navigator` object; if it runs after vi.stubGlobal, it clobbers our
    // writeText mock. Call it first so our stub is the one left standing.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    await user.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("aronmatoic@gmail.com");
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("shows a manual hint when copying fails", async () => {
    // Same ordering requirement as above: setup() before stubGlobal().
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Press Ctrl+C to copy")).toBeInTheDocument();
  });
});
