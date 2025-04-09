export const paymentMethods = [
  { value: "easypaisa", label: "Easypaisa" },
  { value: "jazzcash", label: "Jazzcash" },
  { value: "bank", label: "Bank" },
];

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard/overiew",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Emails",
    url: "/dashboard/emails",
    icon: "mail",
    isActive: false,
    shortcut: ["e", "e"],
    items: [],
  },
  {
    title: "Duplicate Emails",
    url: "/dashboard/duplicate-emails",
    icon: "duplicateEmail",
    isActive: false,
    shortcut: ["de", "de"],
    items: [],
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: "notification",
    isActive: false,
    shortcut: ["n", "n"],
    items: [],
  },
  {
    title: "Withdrawls",
    url: "/dashboard/withdrawls",
    icon: "PanelTopOpen",
    isActive: false,
    shortcut: ["w", "w"],
    items: [],
  },
  {
    title: "Profile",
    url: "/dashboard/settings",
    icon: "user",
    isActive: false,
    shortcut: ["u", "u"],
    items: [],
  },
];
