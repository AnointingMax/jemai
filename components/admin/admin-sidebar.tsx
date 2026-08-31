"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Layers,
  Plus,
  UserRoundCog,
} from "lucide-react";

import { visibleAdminNav } from "@/components/admin/nav";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { SignOutItem } from "@/components/admin/sign-out-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type AdminSidebarProps = React.ComponentProps<typeof Sidebar> & {
  account: { name: string; email: string; };
  permissions: string[];
};

export const AdminSidebar = ({ account, permissions, ...props }: AdminSidebarProps) => {
  const pathname = usePathname();
  const nav = visibleAdminNav(permissions);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-3 pt-6 pb-9 group-data-[collapsible=icon]:px-2">
        <Link
          href="/admin"
          aria-label="JEMAI Admin home"
          className="shrink-0 overflow-hidden"
        >
          <Image
            src="/figma/brand/wordmark.svg"
            alt="JEMAI"
            width={96}
            height={24}
            priority
            unoptimized
            className="max-w-none group-data-[collapsible=icon]:hidden"
          />
          <span className="hidden w-4.25 overflow-hidden group-data-[collapsible=icon]:block">
            <Image
              src="/figma/brand/wordmark.svg"
              alt="JEMAI"
              width={96}
              height={24}
              unoptimized
              className="max-w-none"
            />
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {nav.map((group) => (
          <Collapsible key={group.title} defaultOpen className="group/section">
            <SidebarGroup className="px-2 py-0 pb-3 group-data-[collapsible=icon]:hidden">
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-text-primary hover:bg-sidebar-accent/60 h-8 cursor-pointer gap-2 text-base font-normal">
                  <Layers />
                  {group.title}
                  <ChevronDown className="text-text-secondary ml-auto transition-transform group-data-closed/section:-rotate-90" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuSub className="mt-1 mr-1 ml-3.25 gap-2 px-2.5 py-0.5">
                    {group.items.map((item) => (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === item.url}
                          className="text-text-secondary data-active:text-text-primary"
                        >
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        <SidebarGroup className="hidden px-2 py-0 group-data-[collapsible=icon]:block">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {nav.flatMap((group) =>
                group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      className="text-text-secondary data-active:text-text-primary"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 px-2 pb-4">
        {hasPermission(permissions, "admins") ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Invite Team" className="text-text-primary">
                <Link href="/admin/admins?invite=1">
                  <Plus />
                  <span>Invite Team</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={account.name}
                  className="data-open:bg-sidebar-accent gap-3 px-2 hover:bg-transparent group-data-[collapsible=icon]:px-0!"
                >
                  <span className="bg-surface-inverse text-text-inverse flex size-8.5 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-8">
                    <GalleryVerticalEnd className="size-4" />
                  </span>
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="text-text-primary truncate text-base">
                      {account.name}
                    </span>
                    <span className="text-text-secondary truncate text-xs">
                      {account.email}
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuLabel className="text-text-secondary text-xs font-normal">
                  {account.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserRoundCog />
                  Account settings
                </DropdownMenuItem>
                <SignOutItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
