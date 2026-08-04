export type FieldError = string | null;

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactFields = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export type ContactErrors = {
  name: FieldError;
  email: FieldError;
  message: FieldError;
};

export function validateName(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter your name.";
  if (value.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`;
  if (value.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`;
  return null;
}

export function validateEmail(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter your email address.";
  if (value.length > EMAIL_MAX) return `Email must be ${EMAIL_MAX} characters or fewer.`;
  if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address.";
  return null;
}

export function validateMessage(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter a message.";
  if (value.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters.`;
  if (value.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
  return null;
}

export function validateContact(fields: ContactFields): ContactErrors {
  return {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    message: validateMessage(fields.message),
  };
}

export function hasErrors(errors: ContactErrors): boolean {
  return Boolean(errors.name ?? errors.email ?? errors.message);
}

export function isBot(fields: ContactFields): boolean {
  return fields.website.trim().length > 0;
}
