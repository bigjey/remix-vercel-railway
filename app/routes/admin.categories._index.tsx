import type { Category } from "@prisma/client";
import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputText } from "~/components/ui/InputText";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { Table } from "~/components/ui/Table";
import { prisma } from "~/db.server";
import { CategoryFormSchema } from "~/schemas/CategoryForm";
import { z } from "zod";
import { zodIssuesToServerErrors } from "~/utils/errors";
import { Link } from "~/components/ui/Link";

type SafeCategory = Omit<Category, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const loader = async function ({}: LoaderArgs) {
  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
  return json({
    categories,
  });
};

export default function AdminCategories() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <Page>
      <PageTitle>Categories</PageTitle>
      <CategoriesList categories={data.categories} />
      {!data.categories.length && (
        <div className="m-auto">No Categories yet...</div>
      )}
      <div>
        <NewCategoryForm />
      </div>
    </Page>
  );
}

export const action = async function ({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());

  if (request.method === "POST" && data.action === "create") {
    const validation = CategoryFormSchema.safeParse(data);
    if (!validation.success) {
      return json(
        { errors: zodIssuesToServerErrors(validation.error.issues) },
        { status: 400 }
      );
    }

    try {
      await prisma.category.create({
        data: { ...validation.data, isActive: true },
      });
      return { success: true };
    } catch (e: any) {
      if (e?.code === "P2002") {
        return json(
          {
            errors: {
              [e.meta.target[0]]: `Already exists`,
            },
          },
          { status: 400 }
        );
      }
      return json({ notValid: true }, { status: 400 });
    }
  } else if (request.method === "DELETE" && data.action === "delete") {
    const validation = z.object({ id: z.coerce.number() }).safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({ notValid: true }), { status: 400 });
    }

    await prisma.category.delete({
      where: {
        id: validation.data.id,
      },
    });

    return { success: true };
  }

  throw new Response(null, { status: 405 });
};

const CategoriesList = ({ categories }: { categories: SafeCategory[] }) => {
  return (
    <>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.CellHeading>Name</Table.CellHeading>
            <Table.CellHeading>Active</Table.CellHeading>
            <Table.CellHeading>Actions</Table.CellHeading>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {categories.map((c) => (
            <Category category={c} key={c.id} />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const Category = ({ category }: { category: SafeCategory }) => {
  const deleter = useFetcher();
  const isDeleting = deleter.state === "submitting";

  return (
    <Table.Row key={category.id}>
      <Table.Cell>
        <div className="text-lg">
          <Link to={`${category.id}`}>{category.name}</Link>
        </div>
      </Table.Cell>
      <Table.Cell>
        {category.isActive ? (
          <div className="text-green-600">Active</div>
        ) : null}
      </Table.Cell>
      <Table.Cell>
        <deleter.Form method="DELETE">
          <input hidden name="id" defaultValue={category.id} />
          <Button
            size="small"
            name="action"
            value="delete"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </deleter.Form>
      </Table.Cell>
    </Table.Row>
  );
};

const NewCategoryForm = () => {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "create";

  useEffect(() => {
    if (!isAdding && fetcher.data?.success) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  if (!showAddForm) {
    return <Button onClick={() => setShowAddForm(true)}>+ Add Category</Button>;
  }

  return (
    <fetcher.Form method="POST" ref={formRef}>
      <div className="flex flex-col gap-4 p-4 border rounded-md">
        <div className="text-lg">Add new Category</div>
        <InputText
          label="Name"
          name="name"
          error={
            fetcher.state === "idle" ? fetcher?.data?.errors?.name : undefined
          }
        />
        <div className="flex gap-2">
          <Button
            size="medium"
            type="submit"
            disabled={isAdding}
            name="action"
            value="create"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
};
