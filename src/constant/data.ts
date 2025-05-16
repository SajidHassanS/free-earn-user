export const paymentMethods = [
  {
    value: "easypaisa",
    label: "Easypaisa",
    icon: "/images/icons/easypaisa.png",
  },
  {
    value: "jazzcash",
    label: "Jazzcash",
    icon: "/images/icons/jazzcash.png",
  },
  {
    value: "bank",
    label: "Bank",
    icon: "/images/icons/bank.svg",
  },
  {
    value: "upaisa",
    label: "UPaisa",
    icon: "/images/icons/upaisa.png",
  },
  {
    value: "nayapay",
    label: "Nayapay",
    icon: "/images/icons/nayapay.png",
  },
];

export const faqs = [
  {
    id: 1,
    question: "How late does the internet close?",
    answer: "The internet doesn't close. It's available 24/7.",
    icon: "❤️",
    iconPosition: "right",
  },
  {
    id: 2,
    question: "Do I need a license to browse this website?",
    answer: "No, you don't need a license to browse this website.",
  },
  {
    id: 3,
    question: "What flavour are the cookies?",
    answer:
      "Our cookies are digital, not edible. They're used for website functionality.",
  },
  {
    id: 4,
    question: "Can I get lost here?",
    answer: "Yes, but we do have a return policy",
    icon: "⭐",
    iconPostion: "left",
  },
  {
    id: 5,
    question: "What if I click the wrong button?",
    answer: "Don't worry, you can always go back or refresh the page.",
  },
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
    title: "Chat",
    url: "/dashboard/chat",
    icon: "chat",
    isActive: false,
    shortcut: ["ch", "ch"],
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
