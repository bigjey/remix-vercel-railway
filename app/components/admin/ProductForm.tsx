import { Form } from "@remix-run/react";
import { InputText } from "../ui/InputText";
import { Product } from "@prisma/client";

export type ProductForm = MakePartial<
  Product,
  "id" | "categoryId" | "productGroupId" | "rating"
>;

export function ProductForm() {
  return (
    <Form className="flex flex-col gap-4 ">
      <div>
        <div>
          <label htmlFor="name">Name</label>
        </div>
        <InputText
          id="name"
          type="name"
          name="name"
          className="block w-full"
          // error={fetcher.data?.errors["name"]}
        />
      </div>
    </Form>
  );
}
