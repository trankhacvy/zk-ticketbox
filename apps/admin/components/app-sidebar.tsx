import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@acme/ui/components/sidebar";
import { NavGroup } from "@/components/nav-group";
import { NavUser } from "@/components/nav-user";
import { sidebarData } from "@/data/sidebar-data";
import { TicketBoxUser } from "@/types/user";
import { GalleryThumbnailsIcon } from "lucide-react";
import Link from "next/link";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: TicketBoxUser }) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryThumbnailsIcon className="size-4" />
                  <img
                    src="/logo.png"
                    className="w-full h-full object-cover"
                    alt="TicketBox"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TicketBox</span>
                  {/* <span className="">v1.0.0</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
