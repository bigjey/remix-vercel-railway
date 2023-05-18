import { LoaderArgs, json } from "@remix-run/node";
import {
  Form,
  NavLink,
  NavLinkProps,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { Button } from "~/components/ui/Button";
import { getUser, requireUserId } from "~/session.server";
import { cn } from "~/utils/cn";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const user = await getUser(request);
  return json({ user });
};

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen max-w-[1200px] m-auto">
      <div className="flex flex-col w-[250px] p-3 h-full gap-4 shrink-0">
        <div className="text-3xl">Admin</div>
        <div className="flex flex-col gap-1 grow overflow-auto">
          <NavItem to="/admin" end>
            Dashboard
          </NavItem>
          <NavItem to="/admin/categories">Categories</NavItem>
          <NavItem to="/admin/products">Products</NavItem>
        </div>
        <div className="flex justify-between items-center">
          <div>Hi, {user?.name ?? "Admin"}. </div>
          <Form action="/logout" method="post">
            <Button size="small" variant="secondary">
              Log Out
            </Button>
          </Form>
        </div>
      </div>
      <div className="overflow-y-auto p-3 grow">
        <Outlet />
      </div>
    </div>
  );
}

const NavItem = (props: NavLinkProps) => {
  return (
    <NavLink
      {...props}
      className={({ isActive, isPending }) => {
        return cn("flex items-center gap-x-3.5 py-2 px-2.5 rounded-md ", {
          "bg-blue-200 text-black": isActive || isPending,
          "hover:bg-gray-100 text-slate-700": !isActive,
        });
      }}
    />
  );
};
