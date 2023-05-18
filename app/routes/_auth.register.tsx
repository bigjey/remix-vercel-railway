import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/Button";
import { InputText } from "~/components/ui/InputText";
import { prisma } from "~/db.server";
import { RegisterSchema } from "~/schemas/RegisterForm";
import { commitSession, destroySession, getSession } from "~/session.server";
import { zodIssuesToServerErrors } from "~/utils/errors";
import bcrypt from "bcryptjs";
import { Link } from "~/components/ui/Link";

export default function Register() {
  const fetcher = useFetcher<typeof action>();

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      <fetcher.Form
        className="w-[400px] max-w-full m-auto flex flex-col gap-4 p-4"
        method="post"
        noValidate
      >
        <div className="text-2xl">Create an Account</div>
        <div>
          <div>
            <label htmlFor="name">Name</label>
          </div>
          <InputText
            id="name"
            type="name"
            name="name"
            className="block w-full"
            error={fetcher.data?.errors["name"]}
          />
        </div>
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
        <div>
          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
          </div>
          <InputText
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className="block w-full"
            error={fetcher.data?.errors["confirmPassword"]}
          />
        </div>
        <div className="mt-2">
          <Button type="submit" size="medium">
            Create
          </Button>
        </div>
        <div>or</div>
        <div>
          <Link to="/admin/login">Sign In</Link>
        </div>
      </fetcher.Form>
    </div>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());

  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    return json(
      {
        errors: zodIssuesToServerErrors(validation.error.issues),
      },
      { status: 400 }
    );
  }

  const password = bcrypt.hashSync(validation.data.password, 8);

  try {
    await prisma.user.create({
      data: {
        name: validation.data.name,
        password,
        role: "Admin",
        email: validation.data.email,
      },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return json(
        {
          errors: {
            [e.meta.target[0]]: `Already exists`,
          } as Record<string, string>,
        },
        { status: 400 }
      );
    }
    return json({
      errors: {
        form: e instanceof Error ? e.message : "Failed to create your account",
      } as Record<string, string>,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
