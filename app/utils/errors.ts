import { ZodIssue } from "zod";

export function zodIssuesToServerErrors(
  issues: ZodIssue[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}
