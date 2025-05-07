"use client";

import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import {
  useBonusWithdrawRequest,
  useGetWithdrawlBonusHistory,
  useGetWithdrawlHistory,
  useGetWithdrawls,
  useGetWithdrawlsBonus,
} from "@/hooks/apis/useWithdrawls";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Banknote, Gift } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { format } from "date-fns";
import { useState } from "react";
import DisplayMethodsModal from "@/components/Forms/forms-modal/withdrawal-methods/DisplayMethods";

const Withdrawals = () => {
  const { token } = useContextConsumer();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [withdrawType, setWithdrawType] = useState<
    "balance" | "signup" | "referral"
  >("balance");

  //
  const { data, isLoading } = useGetWithdrawls(token);
  const { data: bonusData, isLoading: bonusDataLoading } =
    useGetWithdrawlsBonus(token);
  const { data: withdrawlHistory, isLoading: historyDataLoading } =
    useGetWithdrawlHistory(token);
  const { data: withdrawlBonusHistory, isLoading: bonusHistoryDataLoading } =
    useGetWithdrawlBonusHistory(token);

  const balance = data?.data?.balance || 0;
  const signupBonus = bonusData?.data?.signup || {};
  const referralBonus = bonusData?.data?.referral || {};
  const history = withdrawlHistory?.data || [];
  const bonusHistory = withdrawlBonusHistory?.data || [];

  const columns = [
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Method Type",
      accessor: "withdrawalMethod.methodType",
    },
    {
      Header: "Account Number",
      accessor: "withdrawalMethod.accountNumber",
    },
    {
      Header: "Requested At",
      accessor: "createdAt",
      Cell: ({ row }: any) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
    },
  ];

  const bonusColumns = [
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Bonus Type",
      accessor: "withdrawalType",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ row }: any) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
    },
  ];

  return (
    <>
      <Toaster />
      <div className="space-y-6 p-10 rounded-2xl max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Available Balance
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You can withdraw the amount shown below.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setWithdrawType("balance");
                  setIsModalOpen(true);
                }}
              >
                Withdraw
              </Button>
            </div>
            {isLoading ? (
              <SkeletonCard className="w-full h-16" />
            ) : (
              <div className="text-3xl font-bold text-primary pl-1">
                {balance.toFixed(2)} PKR
              </div>
            )}
          </div>
          <div className="flex-1 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Bonus Balance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Withdraw from signup and referral bonuses.
                </p>
              </div>
            </div>
            {bonusDataLoading ? (
              <SkeletonCard className="w-full h-24" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted dark:bg-zinc-800">
                  <div>
                    <p className="text-md font-bold text-muted-foreground mb-1">
                      Signup Bonus
                    </p>
                    {signupBonus.locked > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-1">
                          Your signup bonus is locked until you complete your
                          first email withdrawal.
                        </p>
                        <p className="text-sm font-medium text-primary">
                          Bonus: {signupBonus.locked} PKR
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-primary">
                        Bonus: {signupBonus.unlocked} PKR
                      </p>
                    )}

                    {/* <p className="text-sm font-medium text-primary">
                      Total: {signupBonus.total} PKR
                    </p> */}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWithdrawType("signup");
                      setIsModalOpen(true);
                    }}
                    disabled={signupBonus.unlocked <= 0}
                  >
                    Withdraw
                  </Button>
                </div>

                <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted dark:bg-zinc-800">
                  <div>
                    <p className="text-md font-bold text-muted-foreground mb-1">
                      Referral Bonus
                    </p>
                    {referralBonus.total > 0 ? (
                      <>
                        {referralBonus.locked > 0 && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Your referral bonus is locked until your referee
                            completes their first withdrawal
                          </p>
                        )}
                        <p className="text-sm font-medium text-primary">
                          Available: {referralBonus.unlocked} PKR
                        </p>
                        <p className="text-sm font-medium text-primary">
                          Locked: {referralBonus.locked} PKR
                        </p>
                        <p className="text-sm font-medium text-primary">
                          Total: {referralBonus.total} PKR
                        </p>
                      </>
                    ) : (
                      "No referral bonus."
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWithdrawType("referral");
                      setIsModalOpen(true);
                    }}
                    disabled={referralBonus.unlocked <= 0}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 mt-10">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Withdrawal History
          </h3>

          {historyDataLoading ? (
            <SkeletonCard className="w-full h-32" />
          ) : history.length <= 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No withdrawal history available.
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={history}
              paginate={history.length > 5}
            />
          )}
        </div>
        <div className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Bonus Withdrawal History
          </h3>

          {bonusHistoryDataLoading ? (
            <SkeletonCard className="w-full h-32" />
          ) : bonusHistory.length <= 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No bonus withdrawal history available.
            </p>
          ) : (
            <DataTable
              columns={bonusColumns}
              data={bonusHistory}
              paginate={bonusHistory.length > 5}
            />
          )}
        </div>
      </div>
      <DisplayMethodsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        withdrawType={withdrawType}
      />
    </>
  );
};

export default Withdrawals;
