import { Card } from "@repo/ui/card";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    // TODO: Can the type of `status` be more specific?
    status: string;
    provider: string;
  }[];
}) => {
  if (!transactions?.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t, index) => (
          <div
            key={index}
            className={`flex justify-between border-b border-slate-300 pb-2 ${
              t.status === "Failure" ? "text-red-500" : t.status === "Success" ? "text-green-500" : "text-slate-600"
            }`}
          >
            <div>
              <div className="text-sm">
                {t.status}
              </div>
              <div
                className={`text-xs ${
                  t.status === "Failure" ? "text-red-500" : t.status === "Success" ? "text-green-500" : "text-slate-600"
                }`}
              >
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
