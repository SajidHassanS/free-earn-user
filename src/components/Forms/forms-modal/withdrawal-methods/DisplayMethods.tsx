import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContextConsumer } from "@/context/Context";
import { useGetWithdrawalMethods } from "@/hooks/apis/useWithdrawalMethods";
import { Button } from "@/components/ui/button";
import {
  useBonusWithdrawRequest,
  useWithdrawRequest,
} from "@/hooks/apis/useWithdrawls";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const DisplayMethodsModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawType: "balance" | "signup" | "referral";
}> = ({ open, onOpenChange, withdrawType }) => {
  const { token } = useContextConsumer();
  const [selectedMethod, setSelectedMethod] = React.useState<string>("");

  const { data: withdrawalMethods } = useGetWithdrawalMethods(token);
  const { mutate: withdrawRequest, isPending: requesting } =
    useWithdrawRequest();
  const { mutate: bonusWithdrawRequest, isPending: bonusRequesting } =
    useBonusWithdrawRequest();

  const handleRequest = () => {
    if (!selectedMethod) return;

    if (withdrawType === "balance") {
      withdrawRequest(
        { methodUuid: selectedMethod, token },
        {
          onSuccess: (res) => {
            if (res?.success) onOpenChange(false);
          },
        }
      );
    } else {
      bonusWithdrawRequest(
        { token, bonusType: withdrawType, methodUuid: selectedMethod },
        {
          onSuccess: (res) => {
            if (res?.success) onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[80vw] md:max-w-md h-auto overflow-y-auto scrollbar-custom space-y-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-primary text-xl font-bold pt-4">
              Select Withdrawal Method
            </DialogTitle>
          </DialogHeader>

          {withdrawalMethods?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {withdrawalMethods.data.map((method: any) => (
                <div
                  key={method.uuid}
                  onClick={() => setSelectedMethod(method.uuid)}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    selectedMethod === method.uuid
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-gray-300 hover:border-primary/40"
                  )}
                >
                  <div className="text-sm font-medium capitalize text-primary">
                    {method.methodType}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{method.accountNumber}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{method.accountTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Please add withdraw method first.
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRequest}
            disabled={
              (withdrawType === "balance" && requesting) ||
              ((withdrawType === "signup" || withdrawType === "referral") &&
                bonusRequesting) ||
              !selectedMethod ||
              withdrawalMethods?.data?.length === 0
            }
          >
            Withdraw
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisplayMethodsModal;
