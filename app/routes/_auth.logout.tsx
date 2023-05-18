import { ActionArgs } from "@remix-run/node";
import { logout } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  return logout(request);
};
