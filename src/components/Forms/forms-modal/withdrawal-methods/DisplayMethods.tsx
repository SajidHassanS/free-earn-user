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
import toast from "react-hot-toast";
import {
  useBonusWithdrawRequest,
  useWithdrawRequest,
} from "@/hooks/apis/useWithdrawls";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { Copy } from "lucide-react";

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

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const handleRequest = () => {
    if (!selectedMethod) return;

    if (withdrawType === "balance") {
      withdrawRequest(
        { method: selectedMethod, token },
        {
          onSuccess: (res) => {
            if (res?.success) onOpenChange(false);
          },
        }
      );
    } else {
      bonusWithdrawRequest(
        { token, bonusType: withdrawType, method: selectedMethod },
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
                  onClick={() => setSelectedMethod(method.methodType)}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    selectedMethod === method.methodType
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-gray-300 hover:border-primary/40"
                  )}
                >
                  <div className="text-sm font-medium capitalize text-primary">
                    {method.methodType}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span>{method.accountNumber}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-2"
                      title="Copy Account No"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(method.accountNumber);
                      }}
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <span>{method.accountTitle}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-2"
                      title="Copy Account Title"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(method.accountTitle);
                      }}
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
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
