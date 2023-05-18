import { ActionArgs, LoaderFunction, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/Button";
import { InputText } from "~/components/ui/InputText";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { prisma } from "~/db.server";
import { ProductFormSchema } from "~/schemas/ProductForm";
import { zodIssuesToServerErrors } from "~/utils/errors";

export const loader = async ({}: LoaderFunction) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return json({ categories });
};

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());

  const parsed = ProductFormSchema.safeParse(data);

  if (!parsed.success) {
    return json(
      { errors: zodIssuesToServerErrors(parsed.error.issues) },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.create({
      data: { ...parsed.data, specPresetId: 1 },
    });
  } catch (e) {
    console.log(e);
  }

  return json({});
};

export default function AdminProductAdd() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <Page>
      <PageTitle>Product Add Form</PageTitle>
      <Form className="flex flex-col gap-4" method="POST">
        <div>
          <div>
            <label htmlFor="name">Name</label>
          </div>
          <InputText
            id="name"
            type="name"
            name="name"
            className="block w-full"
            error={actionData?.errors?.name}
          />
        </div>
        <div>
          <div>
            <label htmlFor="category">Category</label>
          </div>
          <select id="category" name="categoryId" className="block w-full">
            <option value="">Select Category</option>
            {data.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {actionData?.errors?.categoryId ? (
            <div className="text-red-500 text-sm mt-1">
              {actionData?.errors?.categoryId}
            </div>
          ) : null}
        </div>
        <div>
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </Page>
  );
}
