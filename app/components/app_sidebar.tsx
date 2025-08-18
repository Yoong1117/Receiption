// Icons
import {
  ChevronUp,
  Home,
  Files,
  CircleUserRound,
  ChevronDown,
} from "lucide-react";

// UI components
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarFooter,
} from "~/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "~/components/ui/collapsible";

import { Separator } from "./ui/separator";

// React
import { supabase } from "~/supabase/supabaseClient";
import { useEffect, useState } from "react";
// Hook
import { useSignOut } from "~/hooks/signOut";

export function AppSidebar() {
  const [username, setUsername] = useState<string>("User");
  const handleSignOut = useSignOut();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const name =
          user.user_metadata?.username || user.user_metadata?.full_name;
        setUsername(name || "User");
      } else if (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-lg font-bold">Receiption</h1>
      </SidebarHeader>
      <Separator className="bg-gray-400/70"></Separator>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Receipt Dropdown */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Files />
                      <span>Receipts</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/receipt_management">Manage Receipts</a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/receipt_upload">Upload Receipts</a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/receipt_deleted">Deleted Receipts</a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator className="bg-gray-400/70"></Separator>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center w-full px-2 py-1 hover:bg-[#acc9dd]/20 rounded cursor-pointer">
              <span className="flex items-center gap-2 px-1">
                <CircleUserRound className="w-5 h-5" />
                {username}
              </span>
              <ChevronUp className="ml-auto w-3 h-3" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="border border-gray-300 bg-[#ebf6ff]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-[#acc9dd]/20"
              onClick={handleSignOut}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
