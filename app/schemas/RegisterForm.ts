import { ZodIssueCode, z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().min(1, "Email is Required").email(),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword && values.confirmPassword !== values.password) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
