import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { insertEmails } from "@/schemas/FormsValidation";
import { Button } from "@/components/ui/button";
import { useInsertEmails } from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";
import { Textarea } from "@/components/ui/textarea";

const InsertEmailsModals: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof insertEmails>>({
    resolver: zodResolver(insertEmails),
    defaultValues: {
      emails: "",
    },
  });

  const { mutate: insert, isPending: inserting } = useInsertEmails();

  const onSubmit = (formData: z.infer<typeof insertEmails>) => {
    insert(
      {
        data: formData,
        token: token,
      },
      {
        onSuccess: (res: any) => {
          if (res?.success) {
            // form.reset();
            onOpenChange();
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-[50vh] overflow-y-auto scrollbar-custom">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Insert Emails
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <LabelInputContainer className="mb-1">
              <Label htmlFor="emails" className="dark:text-farmacieGrey">
                Enter Emails
              </Label>
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder="Paste multiple emails here (comma or newline separated)"
                        className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <Button
              className="w-full text-white font-medium mt-4"
              type="submit"
              disabled={inserting}
            >
              Submit
            </Button>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertEmailsModals;
