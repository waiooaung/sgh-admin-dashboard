import {
  LayoutDashboard,
  ArrowLeftRight,
  FileCogIcon,
  GalleryVerticalEnd,
  Settings2,
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
      title: "Configs",
      url: "/dashboard/configs",
      icon: FileCogIcon,
      items: [],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [],
    },
  ],
};
