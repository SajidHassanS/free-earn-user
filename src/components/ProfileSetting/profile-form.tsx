"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema, profileFormSchema } from "@/schemas/FormsValidation";
import { useContextConsumer } from "@/context/Context";
import { useEffect, useReducer, useState } from "react";
import {
  useGetUSerPhonesNo,
  useGetUSerProfile,
  useUpdateUserAccountPassword,
  useUpdateUserProfile,
} from "@/hooks/apis/useUserAuth";
import { useSession } from "next-auth/react";
import { Pencil, Plus } from "lucide-react";
import LabelInputContainer from "../Forms/LabelInputContainer";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/PhoneInput";
import { APIResponseLoader } from "../ui/ResponseLoader";
import { Icon } from "../ui/icon";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "../Loaders/SkeletonLoader";
import BulkPhoneModal from "../Forms/forms-modal/BulkPhoneNo/AddBulkPhoneNo";
import { baseURL } from "@/api/auth";
import Image from "next/image";

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

type PasswordVisibilityState = {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

type Action =
  | { type: "TOGGLE_OLD" }
  | { type: "TOGGLE_NEW" }
  | { type: "TOGGLE_CONFIRM" };

const visibilityReducer = (
  state: PasswordVisibilityState,
  action: Action
): PasswordVisibilityState => {
  switch (action.type) {
    case "TOGGLE_OLD":
      return { ...state, oldPassword: !state.oldPassword };
    case "TOGGLE_NEW":
      return { ...state, newPassword: !state.newPassword };
    case "TOGGLE_CONFIRM":
      return { ...state, confirmPassword: !state.confirmPassword };
    default:
      return state;
  }
};

export default function UserProfileForm() {
  const { token } = useContextConsumer();
  const [isEditable, setIsEditable] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isOpenBulkPhoneModal, setIsOpenBulkPhoneModal] = useState(false);
  const [visibility, dispatch] = useReducer(visibilityReducer, {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { data: session } = useSession();
  const { data: apiUser, isLoading } = useGetUSerProfile(token);
  const { mutate: updateUser, isPending: updating } = useUpdateUserProfile();
  const { mutate: updatePassword } = useUpdateUserAccountPassword();

  // phones no api
  const { data: phonesNo, isLoading: loadingPhonesno } =
    useGetUSerPhonesNo(token);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      countryCode: "",
      phone: "",
      profileImg: null,
      userTitle: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (apiUser?.success && apiUser.data) {
      profileForm.reset({
        username: apiUser.data.username || "",
        phone: apiUser.data.phone || "",
        countryCode: apiUser.data.countryCode || "+92",
        profileImg: apiUser.data.profileImg || "",
        userTitle: apiUser.data.userTitle || "",
      });
    }
  }, [apiUser, profileForm]);

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateUser(
      { data, token },
      {
        onSuccess: () => {
          setIsEditable(false);
        },
      }
    );
  };

  const onSubmitPassword = (data: PasswordFormValues) => {
    updatePassword(
      { data, token },
      {
        onSuccess: () => {
          passwordForm.reset();
          setShowPasswordForm(false);
        },
      }
    );
  };

  const profileImgValue = profileForm.watch("profileImg");

  const formattedImageSrc =
    profileImgValue && typeof profileImgValue === "string"
      ? `${baseURL.replace("/api", "")}${profileImgValue}`
      : "";

  return isLoading ? (
    <APIResponseLoader className="h-60 w-full col-span-3" />
  ) : (
    <>
      <div className="relative">
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className="py-2 px-4"
          >
            {isEditable ? "Cancel" : "Edit"}
            {!isEditable && <Pencil className="w-3.5 h-3.5 ml-2" />}
          </Button>
          <Button
            size="sm"
            type="button"
            className="py-2 px-4 ml-2"
            onClick={() => setIsOpenBulkPhoneModal(true)}
          >
            Add More Phone <Plus size={16} className="ml-1" />
          </Button>
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-2 mb-12">
            <div className="relative">
              <Image
                src={formattedImageSrc}
                width={80}
                height={80}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow"
              />
              {isEditable && (
                <label className="absolute bottom-0 left-12 bg-primary p-1.5 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          profileForm.setValue(
                            "profileImg",
                            reader.result as string
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Pencil className="w-3 h-3 text-white" />
                </label>
              )}
            </div>

            <LabelInputContainer>
              <p className="text-md text-gray-700 dark:text-gray-300 capitalize pl-3 font-bold">
                {apiUser?.data?.username || "-"}
              </p>
            </LabelInputContainer>
          </div>
        )}

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <LabelInputContainer>
              <Label htmlFor="phone">Primary Mobile No</Label>
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInput
                        id="phone"
                        placeholder="Enter your phone number"
                        defaultCountry="PK"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            {/* {isEditable && (
              <div className="flex justify-end items-end">
                <Button type="submit">
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            )} */}
          </form>
        </Form>

        {loadingPhonesno ? (
          <SkeletonCard className="" />
        ) : (
          phonesNo?.data &&
          phonesNo.data.length > 0 && (
            <div className="mt-8">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Secondary Mobile No
              </h3>
              <ul className="border border-primary/40 rounded-lg divide-y divide-primary/40 bg-white max-w-md">
                {phonesNo.data.map((phone: any, idx: number) => (
                  <li
                    key={phone.uuid || idx}
                    className="px-4 py-3 text-sm text-gray-800"
                  >
                    {phone.countryCode} {phone.phone}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {isEditable && (
          <div className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Hide Password Update" : "Change Password"}
            </Button>
          </div>
        )}

        {showPasswordForm && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
            >
              {["oldPassword", "newPassword", "confirmPassword"].map(
                (fieldName, index) => {
                  const label =
                    fieldName === "oldPassword"
                      ? "Old Password"
                      : fieldName === "newPassword"
                      ? "New Password"
                      : "Confirm Password";

                  return (
                    <LabelInputContainer key={index}>
                      <Label htmlFor={fieldName}>{label}</Label>
                      <FormField
                        control={passwordForm.control}
                        name={fieldName as keyof PasswordFormValues}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                placeholder={`Enter ${label.toLowerCase()}`}
                                type={
                                  visibility[
                                    fieldName as keyof PasswordVisibilityState
                                  ]
                                    ? "text"
                                    : "password"
                                }
                                id={fieldName}
                                className="outline-none focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <Icon
                              name={
                                visibility[
                                  fieldName as keyof PasswordVisibilityState
                                ]
                                  ? "EyeOff"
                                  : "Eye"
                              }
                              size={18}
                              className={cn(
                                "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                                !!passwordForm.formState.errors[
                                  fieldName as keyof PasswordFormValues
                                ]
                                  ? "top-[20%]"
                                  : "top-[32%]"
                              )}
                              onClick={() =>
                                dispatch({
                                  type:
                                    fieldName === "oldPassword"
                                      ? "TOGGLE_OLD"
                                      : fieldName === "newPassword"
                                      ? "TOGGLE_NEW"
                                      : "TOGGLE_CONFIRM",
                                })
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>
                  );
                }
              )}
              <div className="flex justify-end col-span-full">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Form>
        )}
      </div>
      <BulkPhoneModal
        open={isOpenBulkPhoneModal}
        onOpenChange={setIsOpenBulkPhoneModal}
      />
    </>
  );
}
