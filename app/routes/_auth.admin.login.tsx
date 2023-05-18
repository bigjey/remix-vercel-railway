import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/Button";
import { InputText } from "~/components/ui/InputText";
import { prisma } from "~/db.server";
import { AdminLoginSchema } from "~/schemas/AdminLogin";
import { commitSession, getSession } from "~/session.server";
import { zodIssuesToServerErrors } from "~/utils/errors";
import bcrypt from "bcryptjs";
import { Link } from "~/components/ui/Link";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/admin");
  }

  return json(null);
}

export default function AdminLogin() {
  const fetcher = useFetcher<typeof action>();

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      <fetcher.Form
        className="w-[400px] max-w-full m-auto flex flex-col gap-4 p-4"
        method="post"
        noValidate
      >
        <div className="text-2xl">Authentication</div>
        <div>
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <InputText
            id="email"
            type="email"
            name="email"
            className="block w-full"
            error={fetcher.data?.errors["email"]}
          />
        </div>
        <div>
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <InputText
            id="password"
            type="password"
            name="password"
            className="block w-full"
            error={fetcher.data?.errors["password"]}
          />
        </div>
        {fetcher.data?.errors["form"] ? (
          <div className="text-red-500">{fetcher.data?.errors["form"]}</div>
        ) : null}
        <div className="mt-2">
          <Button type="submit" size="medium">
            Log In
          </Button>
        </div>
        <div>or</div>
        <div>
          <Link to="/register">Create Account</Link>
        </div>
      </fetcher.Form>
    </div>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());

  const validation = AdminLoginSchema.safeParse(data);
  if (!validation.success) {
    return json(
      {
        errors: zodIssuesToServerErrors(validation.error.issues),
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validation.data.email,
    },
  });

  if (!user) {
    return json(
      {
        errors: {
          form: "Wrong email or password",
        } as Record<string, string>,
      },
      { status: 400 }
    );
  }

  const match = bcrypt.compareSync(validation.data.password, user.password);

  if (!match) {
    return json(
      {
        errors: {
          form: "Wrong email or password",
        } as Record<string, string>,
      },
      { status: 400 }
    );
  }

  const session = await getSession(request.headers.get("Cookie"));

  session.set("userId", user.id);

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
