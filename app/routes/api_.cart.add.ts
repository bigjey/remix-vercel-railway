import { Prisma } from "@prisma/client";
import { ActionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/db.server";
import {
  commitSession,
  getSession,
  getUserId,
  getUserSession,
  requireUserId,
} from "~/session.server";
import { zodIssuesToServerErrors } from "~/utils/errors";

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());
  const parsed = z
    .object({
      productId: z.coerce.number().min(1),
      qty: z.coerce.number().min(1),
    })
    .safeParse(data);
  if (!parsed.success) {
    return json(
      {
        errors: zodIssuesToServerErrors(parsed.error.issues),
      },
      {
        status: 400,
      }
    );
  }

  const session = await getUserSession(request);
  const userId = await getUserId(request);

  const where: Prisma.CartItemWhereUniqueInput = {};
  if (userId !== null) {
    where.productId_userId = {
      productId: parsed.data.productId,
      userId,
    };
  } else {
    where.productId_sessionId = {
      productId: parsed.data.productId,
      sessionId: session.id,
    };
  }

  try {
    await prisma.cartItem.upsert({
      where,
      create: {
        productId: parsed.data.productId,
        qty: parsed.data.qty,
        userId: userId,
        sessionId: userId ? undefined : session.id,
      },
      update: {
        qty: {
          increment: parsed.data.qty,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};
