import { LoaderArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/Button";
import { Link } from "~/components/ui/Link";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { prisma } from "~/db.server";
import { getCartItems } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    categories: await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        Product: {
          orderBy: {
            name: "asc",
          },
        },
      },
    }),
    cartItems: await getCartItems(request),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <Page>
        <PageTitle>Home</PageTitle>
        <Link to="/admin">Admin Panel</Link>
        {data.categories.map((c) => (
          <div key={c.id}>
            <div className="font-bold">{c.name}</div>
            {c.Product.length ? (
              <ul className="w-[300px]">
                {c.Product.map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-2 justify-between items-center"
                  >
                    <div>
                      {p.name} ({data.cartItems?.[p.id] ?? 0})
                    </div>
                    <AddToCart productId={p.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <div>---</div>
            )}
          </div>
        ))}
      </Page>
    </div>
  );
}

function AddToCart({ productId }: { productId: number }) {
  const fetcher = useFetcher();

  const isAdding = fetcher.state === "submitting";

  return (
    <fetcher.Form action="/api/cart/add" method="post">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="qty" value={1} />
      <Button
        variant="secondary"
        type="submit"
        size="small"
        disabled={isAdding}
      >
        {isAdding ? "Adding" : "Add to Cart"}
      </Button>
    </fetcher.Form>
  );
}
