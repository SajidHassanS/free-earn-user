import * as z from "zod";

const createAccountFormSchema = z
  .object({
    username: z.string().nonempty({
      message: "Enter username",
    }),
    phone: z.string().nonempty({
      message: "Enter phone number.",
    }),
    organization: z.string().nonempty({
      message: "Enter organiztion name",
    }),
    referCode: z.string().nonempty({
      message: "Enter reffer code",
    }),
    password: z
      .string()
      .nonempty({
        message: "Enter password",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one numeric digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .nonempty({
        message: "Enter confirm password",
      })
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginAccountFormSchema = z.object({
  username: z.string().nonempty({
    message: "Enter username",
  }),
  password: z
    .string()
    .nonempty({
      message: "Password is required.",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one numeric digit")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const profileFormSchema = z.object({
  username: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export {
  createAccountFormSchema,
  loginAccountFormSchema,
  profileFormSchema,
  passwordSchema,
};
