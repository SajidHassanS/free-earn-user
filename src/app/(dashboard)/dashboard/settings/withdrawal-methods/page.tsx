"use client";

import { useContextConsumer } from "@/context/Context";
import {
  useGetWithdrawalMethods,
  useMarkWithdrawalMethod,
  useUpdateWithdrawAccountTitle,
} from "@/hooks/apis/useWithdrawalMethods";
import React, { useState } from "react";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { Banknote, Check, CheckCircle, Pencil, Plus } from "lucide-react";
import CreateWithdrawalMethod from "@/components/Forms/forms-modal/withdrawal-methods/CreateWithdrawalMethod";
import { cn } from "@/lib/utils";

const WithdrawalMethods = () => {
  const { token } = useContextConsumer();
  const [isAddWithdrawModalOpen, setIsAddWithdrawModalOpen] =
    useState<boolean>(false);
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [titleInputs, setTitleInputs] = useState<Record<string, string>>({});

  const { data, isLoading } = useGetWithdrawalMethods(token);
  const { mutate: markWithdrawal, isPending: marking } =
    useMarkWithdrawalMethod();
  const { mutate: updateAccountTitle, isPending: updating } =
    useUpdateWithdrawAccountTitle();

  const methods = data?.data || [];

  const handleMark = (method: any) => {
    const updatedData = {
      data: {
        ...data,
        uuid: method?.uuid,
      },
      token,
    };
    markWithdrawal(updatedData);
  };

  return (
    <>
      <Toaster />
      {/* <TabLayout> */}
      <div className="space-y-6 p-10 rounded-2xl max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Withdrawal Methods
          </h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsAddWithdrawModalOpen(true)}
          >
            Add Withdrawal Method
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>

        {isLoading ? (
          <SkeletonCard className="w-full h-40" />
        ) : methods.length <= 0 ? (
          <p className="text-gray-500">No Withdrawal Methods Available!</p>
        ) : (
          <div className="grid gap-4">
            {methods.map((method: any, idx: number) => (
              <div
                key={method.uuid || idx}
                className={cn(
                  "border rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition duration-200",
                  method.isDefault
                    ? "border-primary dark:border-green-500"
                    : "border-gray-200 dark:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {method.methodType}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Added on{" "}
                        {format(
                          new Date(method.createdAt),
                          "dd MMM yyyy, hh:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-sm flex items-center gap-2"
                      onClick={() => handleMark(method)}
                      disabled={marking}
                    >
                      Set As Default
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pl-1">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Account Title:</span>
                    {editingStates[method.uuid] ? (
                      <>
                        <input
                          type="text"
                          value={
                            titleInputs[method.uuid] ?? method.accountTitle
                          }
                          onChange={(e) =>
                            setTitleInputs((prev) => ({
                              ...prev,
                              [method.uuid]: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-0.5 text-sm w-48 dark:bg-zinc-800 dark:text-white"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-green-600"
                          onClick={() => {
                            if (
                              titleInputs[method.uuid] &&
                              titleInputs[method.uuid] !== method.accountTitle
                            ) {
                              updateAccountTitle({
                                data: {
                                  uuid: method.uuid,
                                  accountTitle: titleInputs[method.uuid],
                                },
                                token,
                              });
                            }
                            setEditingStates((prev) => ({
                              ...prev,
                              [method.uuid]: false,
                            }));
                          }}
                          disabled={updating}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>{method.accountTitle}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingStates((prev) => ({
                              ...prev,
                              [method.uuid]: true,
                            }));
                            setTitleInputs((prev) => ({
                              ...prev,
                              [method.uuid]: method.accountTitle,
                            }));
                          }}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    {method.accountNumber}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium">Default:</span>{" "}
                    {method.isDefault ? (
                      <span className="flex items-center text-green-600">
                        Yes <CheckCircle className="w-4 h-4 ml-1" />
                      </span>
                    ) : (
                      "No"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateWithdrawalMethod
        open={isAddWithdrawModalOpen}
        onOpenChange={setIsAddWithdrawModalOpen}
      />
    </>
  );
};

export default WithdrawalMethods;
