"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useContextConsumer } from "@/context/Context";
import { Plus, Trash } from "lucide-react";
import { addBulkPhoneSchema } from "@/schemas/FormsValidation";
import { useBulkPhones } from "@/hooks/apis/useUserAuth";
import LabelInputContainer from "../../LabelInputContainer";
import { PhoneInput } from "@/components/ui/PhoneInput";

const AddBulkPhoneForm = ({ onClose }: { onClose: () => void }) => {
  const { token } = useContextConsumer();

  const { mutate: addBulkPhones, isPending: loading } = useBulkPhones();

  const form = useForm({
    resolver: zodResolver(addBulkPhoneSchema),
    shouldUnregister: true,
  });

  const { fields, append, remove } = useFieldArray({
    name: "phones",
    control: form.control,
  });

  useEffect(() => {
    if (fields.length === 0) append("");
  }, [fields, append]);

  const onSubmit = (data: any) => {
    const filteredPhones = data.phones.filter(
      (phone: string) => phone && phone.trim() !== ""
    );

    const phones = filteredPhones
      .map((fullPhone: string) => {
        const cleaned = fullPhone.replace(/[^\d+]/g, "");

        const match = cleaned.match(/^(\+\d{1,4})(\d{10})$/);

        if (!match) return null;

        const [, countryCode, phone] = match;
        return { countryCode, phone };
      })
      .filter(Boolean);

    if (phones.length === 0) {
      form.setError("phones", {
        type: "manual",
        message: "Please enter at least one valid phone number with 10 digits.",
      });
      return;
    }

    addBulkPhones(
      { data: { phones }, token },
      {
        onSuccess: (res) => {
          if (res?.success) onClose();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row items-center gap-3 mb-4"
          >
            <LabelInputContainer className="mb-1">
              <Label htmlFor={`phone_${index}`}>Mobile No</Label>
              <FormField
                control={form.control}
                name={`phones.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInput
                        id={`phone_${index}`}
                        placeholder="3********"
                        defaultCountry="PK"
                        className="focus:border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            {fields.length > 1 && (
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 text-white mt-5"
                type="button"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
            {index === fields.length - 1 && (
              <Button
                size="icon"
                className="bg-primary text-white mt-5"
                type="button"
                onClick={() => append("")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button className="w-full text-white font-medium mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddBulkPhoneForm;
