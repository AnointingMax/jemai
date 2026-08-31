"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";

import { inviteAdminAction } from "@/app/admin/(dashboard)/admins/actions";
import { FieldLabel, fieldChrome } from "@/components/admin/form-section";
import { adminPermissionLabels } from "@/components/admin/nav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { AdminPermission } from "@/lib/admin/auth/permissions";
import { MIN_ADMIN_PASSWORD_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

type InviteValues = {
  name: string;
  email: string;
  password: string;
};

export const InviteAdminDialog = ({
  grantable,
  initiallyOpen = false,
}: {
  grantable: AdminPermission[];
  initiallyOpen?: boolean;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(initiallyOpen);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [pending, startTransition] = useTransition();

  const { register, handleSubmit, reset } = useForm<InviteValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const toggle = (permission: AdminPermission, checked: boolean) =>
    setPermissions((held) =>
      checked ? [...held, permission] : held.filter((slug) => slug !== permission),
    );

  const close = () => {
    setOpen(false);
    setPermissions([]);
    reset();
    if (initiallyOpen) router.replace("/admin/admins", { scroll: false });
  };

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await inviteAdminAction({ ...values, permissions });

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(`${result.data.name} can now sign in`);
      close();
      router.refresh();
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
    >
      <DialogTrigger asChild>
        {/* The same button every index header carries — the other sections open
            a "new" route with it, this one opens the dialog. */}
        <Button size="lg" className="h-11 shrink-0 px-5 text-sm">
          Invite administrator
        </Button>
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.target as HTMLElement | null)
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }}
        className="admin-surface bg-background border-border-default flex max-h-[calc(100dvh-2rem)] w-[min(520px,calc(100vw-2rem))] flex-col overflow-y-auto rounded-xl border p-6 shadow-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-text-primary font-sans text-xl font-semibold">
              Invite an administrator
            </DialogTitle>
            <DialogDescription className="text-text-secondary text-sm">
              They sign in with the address and password you set here, so pass both
              on yourself — nothing is emailed to them.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              className="text-text-secondary -mt-1 -mr-2 shrink-0"
            >
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="invite-name" required>
              Name
            </FieldLabel>
            <Input
              id="invite-name"
              autoComplete="off"
              placeholder="Amina Bako"
              disabled={pending}
              className={cn(fieldChrome, "h-11")}
              {...register("name")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="invite-email" required>
              Email
            </FieldLabel>
            <Input
              id="invite-email"
              type="email"
              autoComplete="off"
              placeholder="amina@jemai.com"
              disabled={pending}
              className={cn(fieldChrome, "h-11")}
              {...register("email")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="invite-password" required>
              Temporary password
            </FieldLabel>
            <Input
              id="invite-password"
              type="text"
              autoComplete="off"
              placeholder={`At least ${MIN_ADMIN_PASSWORD_LENGTH} characters`}
              disabled={pending}
              className={cn(fieldChrome, "h-11")}
              {...register("password")}
            />
            {/* Shown rather than masked: whoever types it has to read it back
                to the person it belongs to. */}
            <p className="text-text-secondary text-xs">
              Visible so you can pass it on. They should change it once they are in.
            </p>
          </div>

          <fieldset className="flex flex-col gap-3" disabled={pending}>
            <FieldLabel required>Sections they may work in</FieldLabel>
            <div className="border-border-default grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2">
              {grantable.map((permission) => (
                <label
                  key={permission}
                  className="text-text-primary flex cursor-pointer items-center gap-2.5 text-sm"
                >
                  <Checkbox
                    checked={permissions.includes(permission)}
                    onCheckedChange={(checked) => toggle(permission, checked === true)}
                  />
                  {adminPermissionLabels[permission]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-1 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Opening account…" : "Open account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
