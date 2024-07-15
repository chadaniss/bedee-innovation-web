/** @format */
"use client";

import { useState } from "react";
import Nav from "./ui/nav";

type Props = {};

import {
  LayoutDashboard,
  Settings,
  ChevronRight,
  LogIn,
  LogOut,
  UsersRound,
} from "lucide-react";
import { Button } from "./ui/button";

import { useWindowWidth } from "@react-hook/window-size";
import dynamic from "next/dynamic";

function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="relative min-w-[80px] border-r px-3  pb-10 pt-24 ">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Check-In",
            href: "/check-in",
            icon: LogIn,
            variant: "ghost",
          },
          {
            title: "Check-Out",
            href: "/check-out",
            icon: LogOut,
            variant: "ghost",
          },
          {
            title: "User",
            href: "/user",
            icon: UsersRound,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/settings",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(SideNavbar), { ssr: false });