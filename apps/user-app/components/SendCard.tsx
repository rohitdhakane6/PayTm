"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [mobileNo, setmobileNo] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="">
            <Card title="Send" >
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Mobile No" onChange={(value) => {
                        setmobileNo(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            const res=await p2pTransfer(Number(amount)*100,mobileNo)
                            console.log(res);
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
    </div>
}