import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/ui/Page";
import { PageTitle } from "~/components/ui/PageTitle";
import { prisma } from "~/db.server";
import { getUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return { user };
};

export default function AdminDashboard() {
  const data = useLoaderData<typeof loader>();
  return (
    <Page>
      <PageTitle>Dashboard</PageTitle>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Page>
  );
}
