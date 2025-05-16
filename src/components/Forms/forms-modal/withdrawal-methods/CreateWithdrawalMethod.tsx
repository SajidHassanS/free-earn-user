import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContextConsumer } from "@/context/Context";
import { useCreateWithdrawalMethod } from "@/hooks/apis/useWithdrawalMethods";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import LabelInputContainer from "../../LabelInputContainer";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentMethods } from "@/constant/data";
import Image from "next/image";

const CreateWithdrawalMethodModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();

  const { mutate: createWithdrawalMethod, isPending: creating } =
    useCreateWithdrawalMethod();

  const form = useForm({
    defaultValues: {
      methodType: "",
      accountNumber: "",
      accountTitle: "",
    },
  });

  const onSubmit = (values: any) => {
    createWithdrawalMethod(
      { data: values, token },
      {
        onSuccess: (res) => {
          if (res?.success) {
            form.reset();
            onOpenChange(false);
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-auto overflow-y-auto scrollbar-custom space-y-4">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            Add Withdrawal Method
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LabelInputContainer className="mb-1">
              <Label htmlFor="methodType" className="dark:text-farmacieGrey">
                Method Type
              </Label>
              <FormField
                control={form.control}
                name="methodType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={cn(
                            "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20"
                          )}
                        >
                          <SelectValue placeholder="Select Method Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectGroup>
                            <SelectLabel>Select Method</SelectLabel>
                            {paymentMethods.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Image
                                    width={100}
                                    height={100}
                                    src={type.icon}
                                    alt={type.label}
                                    className="w-7 h-7 rounded-sm object-contain"
                                  />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <Label>Account Number</Label>
                  <FormControl>
                    <Input placeholder="Account no here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountTitle"
              render={({ field }) => (
                <FormItem>
                  <Label>Account Title</Label>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? "Adding..." : "Add Method"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWithdrawalMethodModal;
