import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./db.server";
import { Prisma } from "@prisma/client";

type SessionData = {
  userId?: number;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "_gop_shop_session",
      httpOnly: true,
      maxAge: 60 * 30,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    // const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    // throw redirect(`/login?${searchParams}`);
    throw redirect(`/admin/login`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "number") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      select: { id: true, name: true },
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function getCartItems(request: Request) {
  const session = await getUserSession(request);
  const userId = await getUserId(request);

  const where: Prisma.CartItemWhereInput = {};
  if (userId) {
    where.userId = userId;
  } else {
    where.sessionId = session.id;
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where,
      select: {
        productId: true,
        qty: true,
      },
    });

    return cartItems.reduce((lookup, item) => {
      lookup[item.productId] = item.qty;
      return lookup;
    }, {} as Record<number, number>);
  } catch (e) {
    console.log(e);
  }
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  session.unset("userId");

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export { getSession, commitSession, destroySession };
