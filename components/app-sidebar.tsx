"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  BookOpenIcon,
  CreditCard,
  FrameIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  StarIcon,
  TerminalSquareIcon,
  TicketIcon,
  Users
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"



// ✅ E-COMMERCE DATA
const data = {
  user: {
    name: "Admin",
    email: "admin@store.com",
    avatar: "/avatars/admin.jpg",
  },

  teams: [
    {
      name: "Dalabzone",
      plan: "Admin - Dashboard",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <PieChartIcon />,
      isActive: true,
    },

    // 📦 PRODUCTS
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <FrameIcon />,
      items: [
        { title: "All Products", url: "/dashboard/products/all-products" },
        { title: "Add Product", url: "/dashboard/products/create" },
        { title: "Add Product Detials", url: "/dashboard/products/product-detials" },
        { title: "Add Product Images", url: "/dashboard/products/product-images" },
        { title: "Search Product", url: "/dashboard/products/search" }
      ],
    },

    // 🧾 ORDERS
    {
      title: "Orders",
      url: "/orders",
      icon: <TerminalSquareIcon />,
      items: [
        { title: "All Orders", url: "/dashboard/orders/all-orders" },
        { title: "Manage", url: "/dashboard/orders/manage" },
      ],
    },

    // 👥 CUSTOMERS (🔥 what you asked)
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <Users />,
      // items: [
      //   { title: "All Customers", url: "/dashboard/customers" },
      //   { title: "Register Customer", url: "/dashboard/customers/register" },
      //   { title: "Search Customer", url: "/dashboard/customers/search" },
      // ],
    },

    // 💳 PAYMENTS
    {
      title: "Payments",
      url: "/payments",
      icon: <CreditCard />,
      items: [
        { title: "Transactions", url: "/dashboard/payments" },
        { title: "Pending Payments", url: "/dashboard/payments?status=pending" },
        { title: "Completed", url: "/dashboard/payments?status=paid" },
      ],
    },

    // 📊 REPORTS
    {
      title: "Reports",
      url: "/reports",
      icon: <BookOpenIcon />,
      items: [
        { title: "Sales Report", url: "/dashboard/reports/sales" },
        { title: "Customer Analytics", url: "/dashboard/reports/customers" },
      ],
    },

    // ⚙️ SETTINGS
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
      items: [
        // { title: "General", url: "/dashboard/settings" },
        { title: "Roles", url: "/dashboard/settings/roles" },
        { title: "Staff Users", url: "/dashboard/settings/staff" },
      ],
    },
  ],

  // 🎟 EXTRA SECTIONS
  projects: [
    {
      name: "Coupons",
      url: "/dashboard/coupons",
      icon: <TicketIcon />,
    },
    {
      name: "Reviews",
      url: "/dashboard/reviews",
      icon: <StarIcon />,
    },
  ],

  reports: [
    {
      name: "Sales Analytics",
      url: "/dashboard/reports/sales",
      icon: <PieChartIcon />,
    },
    {
      name: "Traffic",
      url: "/dashboard/reports/traffic",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useAuthStore()


  return (
    <Sidebar
      className=" "
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects title="Discount" projects={data.projects} />
        {/* <NavProjects title="Reports" projects={data.reports} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}