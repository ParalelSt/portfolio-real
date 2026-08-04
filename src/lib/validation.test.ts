import { describe, expect, it } from "vitest";
import {
  hasErrors,
  isBot,
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  NAME_MIN,
  validateContact,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/validation";

describe("validateName", () => {
  it("rejects empty and whitespace-only input", () => {
    expect(validateName("")).toBeTruthy();
    expect(validateName("   ")).toBeTruthy();
  });

  it("rejects input below the minimum length", () => {
    expect(validateName("A".repeat(NAME_MIN - 1))).toBeTruthy();
  });

  it("accepts input at the minimum and maximum length", () => {
    expect(validateName("A".repeat(NAME_MIN))).toBeNull();
    expect(validateName("A".repeat(NAME_MAX))).toBeNull();
  });

  it("rejects input above the maximum length", () => {
    expect(validateName("A".repeat(NAME_MAX + 1))).toBeTruthy();
  });

  it("trims before measuring", () => {
    expect(validateName("  Aron  ")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("rejects empty input", () => {
    expect(validateEmail("   ")).toBeTruthy();
  });

  it("rejects addresses without an @ or a dotted domain", () => {
    expect(validateEmail("aron")).toBeTruthy();
    expect(validateEmail("aron@")).toBeTruthy();
    expect(validateEmail("aron@localhost")).toBeTruthy();
    expect(validateEmail("aron @example.com")).toBeTruthy();
  });

  it("accepts a normal address", () => {
    expect(validateEmail("aronmatoic@gmail.com")).toBeNull();
    expect(validateEmail("  aron+tag@sub.example.co.uk  ")).toBeNull();
  });

  it("rejects absurdly long addresses", () => {
    expect(validateEmail(`${"a".repeat(250)}@example.com`)).toBeTruthy();
  });

  it("rejects a single-character top-level domain", () => {
    expect(validateEmail("aron@example.c")).toBeTruthy();
  });

  it("accepts a two-character top-level domain", () => {
    expect(validateEmail("aron@example.co")).toBeNull();
  });
});

describe("validateMessage", () => {
  it("rejects empty and too-short input", () => {
    expect(validateMessage("")).toBeTruthy();
    expect(validateMessage("A".repeat(MESSAGE_MIN - 1))).toBeTruthy();
  });

  it("accepts input at both bounds", () => {
    expect(validateMessage("A".repeat(MESSAGE_MIN))).toBeNull();
    expect(validateMessage("A".repeat(MESSAGE_MAX))).toBeNull();
  });

  it("rejects input above the maximum", () => {
    expect(validateMessage("A".repeat(MESSAGE_MAX + 1))).toBeTruthy();
  });

  it("rejects whitespace-only input", () => {
    expect(validateMessage("   ".repeat(10))).toBeTruthy();
  });

  it("trims before measuring", () => {
    const atMinimum = "A".repeat(MESSAGE_MIN);
    expect(validateMessage(`   ${atMinimum}   `)).toBeNull();
    expect(validateMessage(`   ${"A".repeat(MESSAGE_MIN - 1)}   `)).toBeTruthy();
  });
});

describe("validateContact and hasErrors", () => {
  const valid = {
    name: "Aron",
    email: "aronmatoic@gmail.com",
    message: "Hello there, I would like to work with you.",
    website: "",
  };

  it("reports no errors for valid input", () => {
    const errors = validateContact(valid);
    expect(errors).toEqual({ name: null, email: null, message: null });
    expect(hasErrors(errors)).toBe(false);
  });

  it("reports errors per field", () => {
    const errors = validateContact({ ...valid, email: "nope", message: "hi" });
    expect(errors.name).toBeNull();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });
});

describe("isBot", () => {
  it("is false when the honeypot is empty", () => {
    expect(isBot({ name: "A", email: "a@b.co", message: "x", website: "" })).toBe(false);
    expect(isBot({ name: "A", email: "a@b.co", message: "x", website: "  " })).toBe(false);
  });

  it("is true when the honeypot is filled", () => {
    expect(
      isBot({ name: "A", email: "a@b.co", message: "x", website: "spam.example" }),
    ).toBe(true);
  });
});
