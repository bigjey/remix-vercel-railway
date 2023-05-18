import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { prisma } from "~/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const productId = Number(params.id);
  return json(
    await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })
  );
};

export default function AdminProductEdit() {
  const data = useLoaderData<typeof loader>();
  return (
    <Page>
      <PageTitle>Product Edit Form</PageTitle>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Page>
  );
}
