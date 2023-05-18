import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(5, "Product name is required"),
  categoryId: z.coerce.number().min(1, "Please select category"),
});
