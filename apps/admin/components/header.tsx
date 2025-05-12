import React from "react";
import { Separator } from "@acme/ui/components/separator";
import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { ProfileDropdown } from "./profile-dropdown";
import { ThemeSwitch } from "./theme-switch";
import { Breadcrumbs } from "./breadcrumbs";

export const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* <CtaGithub /> */}
        <div className="hidden md:flex">{/* <SearchInput /> */}</div>
        {/* <UserNav />
        <ModeToggle />
        <ThemeSelector /> */}
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </header>
  );
};
