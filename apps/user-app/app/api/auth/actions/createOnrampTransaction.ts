"use server";

import prisma from "@repo/db/client";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth";

export async function createOnrampTransaction(amount:number,provider:string){
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data:{
            provider,
            startTime:new Date(),
            token,
            amount,
            status: "Processing",
            userId: Number(session?.user?.id),
        }

    })

}