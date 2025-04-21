import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Icon } from "../ui/icon";
import LabelInputContainer from "./LabelInputContainer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAccountFormSchema } from "@/schemas/FormsValidation";
import Link from "next/link";
import { PhoneInput } from "../ui/PhoneInput";
import { useUserAccount } from "@/hooks/apis/useUserAuth";

export function CreateAccountForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmShowPassword, setConfirmShowPassword] =
    useState<boolean>(false);

  const { mutate: createAccount, isPending: loading } = useUserAccount();

  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      username: "",
      phone: "",
      referCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof createAccountFormSchema>) => {
    const payload = {
      ...data,
      countryCode: data.phone.slice(0, 3),
      phone: data.phone.slice(3),
    };
    createAccount(payload);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-medium">Create Account</CardTitle>
          <CardDescription>
            New Admin? Register yourself by filling below form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="py-2" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3.5">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-1">
                  <LabelInputContainer>
                    <Label htmlFor="username">Username</Label>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter username"
                              type="text"
                              id="username"
                              className="outline-none focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </LabelInputContainer>
                </div>
                <div className="grid gap-3.5">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-1">
                    <LabelInputContainer>
                      <Label htmlFor="phone">Whatsapp Mobile Number</Label>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <PhoneInput
                                id="phone"
                                placeholder="Enter whatsapp number"
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
                  </div>
                  <LabelInputContainer>
                    <Label htmlFor="referCode">Refer Code</Label>
                    <FormField
                      control={form.control}
                      name="referCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter refer code"
                              type="text"
                              id="referCode"
                              className="outline-none focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </LabelInputContainer>
                  <div className="grid gap-2">
                    <LabelInputContainer>
                      <Label htmlFor="password">Password</Label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="outline-none focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            {!showPassword ? (
                              <Icon
                                name="Eye"
                                size={18}
                                className={cn(
                                  "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                                  !!form.formState.errors.password
                                    ? "top-[20%]"
                                    : "top-[32%]"
                                )}
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            ) : (
                              <Icon
                                name="EyeOff"
                                size={20}
                                className={cn(
                                  "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                                  !!form.formState.errors.password
                                    ? "top-[20%]"
                                    : "top-[32%]"
                                )}
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>
                  </div>
                  <div className="grid gap-2">
                    <LabelInputContainer className="mb-4">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder="••••••••"
                                type={confirmShowPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="outline-none focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            {!confirmShowPassword ? (
                              <Icon
                                name="Eye"
                                size={18}
                                className={cn(
                                  "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                                  !!form.formState.errors.password
                                    ? "top-[20%]"
                                    : "top-[20%]"
                                )}
                                onClick={() =>
                                  setConfirmShowPassword(!confirmShowPassword)
                                }
                              />
                            ) : (
                              <Icon
                                name="EyeOff"
                                size={20}
                                className={cn(
                                  "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                                  !!form.formState.errors.password
                                    ? "top-[20%]"
                                    : "top-[20%]"
                                )}
                                onClick={() =>
                                  setConfirmShowPassword(!confirmShowPassword)
                                }
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>
                  </div>
                  <Button type="submit" className="w-full">
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
