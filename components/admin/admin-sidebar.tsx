"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Layers,
  LogOut,
  Plus,
  UserRoundCog,
} from "lucide-react";

import { adminNav } from "@/components/admin/nav";
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

const account = {
  name: "Admin",
  email: "admin@jemai.co",
};

/**
 * The console rail: wordmark, three collapsible sections and the account card.
 * The frame draws each section's rows as a sub-menu — hairline rail, 28px pills
 * — so the groups use `SidebarMenuSub` rather than a top-level menu.
 *
 * Collapsing keeps the rail on screen as a 48px icon strip. The sub-menu and the
 * group labels are both hidden in that state by the primitive, so the sections
 * render twice: the frame's grouped list at full width, and a flat icon list
 * with tooltips once collapsed. Both read the same `adminNav`.
 */
export const AdminSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();

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
          {/* Collapsed, only the wordmark's leading mark fits. The badge logo
              is a ring of fine lettering that turns to mush under 40px, so the
              mark is clipped out of the wordmark itself — 17px of its 96. */}
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
        {adminNav.map((group) => (
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

        {/* The collapsed rail. Groups are flattened — there is no room for a
            label at 48px — but the order still tracks the frame's sections. */}
        <SidebarGroup className="hidden px-2 py-0 group-data-[collapsible=icon]:block">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {adminNav.flatMap((group) =>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Invite Team"
              className="text-text-primary"
            >
              <Plus />
              <span>Invite Team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

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
                <DropdownMenuItem asChild>
                  <Link href="/admin/login">
                    <LogOut />
                    Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
