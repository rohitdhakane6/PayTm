"use client"
import React, { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textInput";
import { createOnrampTransaction } from "../app/lib/actions/createOnrampTransaction";

// Supported banks data
const SUPPORTED_BANKS = [
  { name: "HDFC Bank", redirectUrl: "http://localhost:3003/hdfcWebhook" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" }
];

const AddMoney = () => {
  // State initialization
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl ||"");
  const [amount, setAmount] = useState(0);
  const [selectedBank, setSelectedBank] = useState(SUPPORTED_BANKS[0]?.name || "");

  // Event handlers
  const handleAmountChange = (value:string) => {
    setAmount(Number(value));
  };

  const handleBankSelect = (value:string) => {
    const bank = SUPPORTED_BANKS.find((bank) => bank.name === value);
    setSelectedBank(bank?.name || "");
    setRedirectUrl(bank?.redirectUrl || "");
  };

  const handleAddMoney = async () => {
    const res=await createOnrampTransaction(amount*100, selectedBank,redirectUrl);
    window.location.href=res.url ||"";
    
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label="Amount"
          placeholder="Amount"
          onChange={handleAmountChange}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={handleBankSelect}
          options={SUPPORTED_BANKS.map((bank) => ({
            key: bank.name,
            value: bank.name
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button onClick={handleAddMoney}>Add Money</Button>
        </div>
      </div>
    </Card>
  );
};

export default AddMoney;
