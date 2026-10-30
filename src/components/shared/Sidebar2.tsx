import { AppSidebar } from "./AppSidebar";

export function Sidebar2() {
  return (
    <AppSidebar active="chatbots" links={{ playground: "/tpg", channels: "/tch" }} />
  );
}
