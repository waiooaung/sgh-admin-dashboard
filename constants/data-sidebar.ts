import {
  LayoutDashboard,
  ArrowLeftRight,
  GalleryVerticalEnd,
  Settings2,
  Handshake,
  Users,
  Banknote,
} from "lucide-react";

export const data = {
  user: {
    name: "Admin",
    email: "admin@sgh.ae",
    avatar:
      "https://lh3.googleusercontent.com/-XWMTi1SuMkg/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkkNZTHZxpJdxVPretWl9nHosVwq6g/photo.jpg?sz=46",
  },
  teams: [
    {
      name: "SMART GLOBAL HUB",
      logo: GalleryVerticalEnd,
      plan: "Enjoy your days!",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: ArrowLeftRight,
      items: [],
    },
    {
      title: "Payments",
      icon: Banknote,
      url: "/dashboard/payments",
      isActive: false,
      items: [
        {
          title: "Agent Payments",
          url: "/dashboard/payments/agent-payments",
        },
        {
          title: "Suppliers Payments",
          url: "/dashboard/payments/supplier-payments",
        },
      ],
    },
    {
      title: "Suppliers",
      url: "/dashboard/suppliers",
      icon: Handshake,
      items: [],
    },
    {
      title: "Agents",
      url: "/dashboard/agents",
      icon: Users,
      items: [],
    },
    {
      title: "Settings",
      icon: Settings2,
      url: "/dashboard/settings",
      isActive: false,
      items: [
        {
          title: "Daily Rates",
          url: "/dashboard/settings/daily-rates",
        },
        {
          title: "Transacted Rates",
          url: "/dashboard/settings/transacted-rates",
        },
      ],
    },
  ],
};
