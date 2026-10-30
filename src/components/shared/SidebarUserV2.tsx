import { AppSidebar } from "./AppSidebar";

export function SidebarUserV2() {
  return (
    <AppSidebar active="channels" links={{ channels: "/ch3" }} className="absolute left-0 top-0 h-full" />
  );
}
