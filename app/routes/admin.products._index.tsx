import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "~/components/ui/Link";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { prisma } from "~/db.server";

export const loader = async ({}: LoaderArgs) => {
  return json(
    await prisma.product.findMany({
      orderBy: [
        {
          categoryId: "asc",
        },
        { name: "asc" },
      ],
    })
  );
};

export default function AdminProducts() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page>
      <PageTitle>Products</PageTitle>
      <Link to="/admin/products/add">+ Add Product</Link>
      {data.map((p) => (
        <Link key={p.id} to={`/admin/products/${p.id}`}>
          {p.name}
        </Link>
      ))}
    </Page>
  );
}
