import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().min(1, "Email is Required").email(),
  password: z.string().min(1, "Password is Required"),
});

export type AdminLoginSchemaType = z.infer<typeof AdminLoginSchema>;
