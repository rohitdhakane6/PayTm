"use server";

import db from "@repo/db/client";
import { authOptions } from "../auth";
import { getServerSession } from "next-auth";

export async function p2pTransfer(amount: number, mobileNo: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const toUser = await db.user.findFirst({
    where: {
      number: mobileNo,
    },
  });
  if (!toUser) {
    return {
      message: "User not found",
    };
  }

  await db.$transaction(async (txn) => {
    await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(session.user?.id)} FOR UPDATE`;
    const userBalnce = await txn.balance.findFirst({
      where: { userId: Number(session.user?.id) },
    });
    if (!userBalnce || userBalnce?.amount < amount) {
      throw new Error("Insufficient funds");
    }
    await new Promise(re=>setTimeout(re,4000))
    await txn.balance.update({
      where: { userId: Number(session.user?.id) },
      data: { amount: { decrement: amount } },
    });
    await txn.balance.update({
      where: { userId: toUser.id },
      data: { amount: { increment: amount } },
    });
  });
  return "Done";
}
