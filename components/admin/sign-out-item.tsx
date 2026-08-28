"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { signOutAction } from "@/app/admin/(auth)/actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/**
 * Sign out from the rail's account menu. `preventDefault` keeps the menu open
 * while the action runs, so a failed sign-out has somewhere to report back to
 * rather than closing over a console the reader is still signed in to.
 */
export const SignOutItem = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onSelect = (event: Event) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await signOutAction();

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      router.refresh();
      router.replace("/admin/login");
    });
  };

  return (
    <DropdownMenuItem onSelect={onSelect} disabled={pending}>
      <LogOut />
      {pending ? "Signing out…" : "Sign out"}
    </DropdownMenuItem>
  );
};
