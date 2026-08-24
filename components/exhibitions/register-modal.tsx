"use client";

import { useEffect, type ComponentProps } from "react";
import Image from "next/image";
import { useForm, type Path, type UseFormRegister } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  modalControlClass,
  modalFieldClass,
  modalLabelClass,
} from "@/components/site/modal-field";

type RegisterValues = { fullName: string; email: string; phone: string; };

export type RegisterExhibition = {
  title: string;
  artist: string;
  /** "12 Sep 2026" — the frame draws the opening date beside the title. */
  when: string;
  image: string;
  /** Present for a paid event, which is what switches the modal's geometry. */
  ticket?: { label: string; price: string; };
};

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibition: RegisterExhibition;
};

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<RegisterValues>;
  register: UseFormRegister<RegisterValues>;
};

/** Module scope on purpose — declared inside the form it would remount on every
 *  render and drop focus mid-keystroke. */
const Field = ({ label, name, register, ...props }: FieldProps) => (
  <div className={modalFieldClass}>
    <span className={modalLabelClass}>{label}</span>
    <Input
      aria-label={label}
      className={modalControlClass}
      {...register(name, { required: true })}
      {...props}
    />
  </div>
);

/**
 * The registration wrapper, in the two geometries the frames draw.
 *
 * - **Free** (the upcoming index and the unpaid detail frame, which are
 *   pixel-identical): 1120 × 579, a 544px photograph and a 576px panel.
 * - **Paid**: 1120 × 710, a 419px photograph and a 701px panel, with a ticket
 *   summary between the exhibition field and the name field, and a Paystack
 *   line under the buttons.
 *
 * Both pad 48px all round and share the field rhythm in `modal-field.tsx`.
 */
export const RegisterModal = ({
  open,
  onOpenChange,
  exhibition,
}: RegisterModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<RegisterValues>({
    defaultValues: { fullName: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const paid = Boolean(exhibition.ticket);
  const caption = `${exhibition.title} · ${exhibition.artist}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          /* Radix focuses the close button by default, which the frames draw
             bare; sending focus to the first field is closer and kinder. */
          event.preventDefault();
          (event.target as HTMLElement | null)
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }}
        className={`flex w-[min(1120px,calc(100vw-2rem))] max-w-none overflow-hidden max-lg:h-auto max-lg:max-h-[calc(100dvh-2rem)] max-lg:overflow-y-auto ${
          paid ? "h-177.5" : "h-144.75"
        }`}
      >
        {/* Left: the exhibition, with its caption block */}
        <div
          className={`bg-surface-inverse relative hidden shrink-0 lg:block ${
            paid ? "w-104.75" : "w-136"
          }`}
        >
          <Image
            src={exhibition.image}
            alt={exhibition.title}
            fill
            sizes="544px"
            className="object-cover"
          />
          <div className="bg-surface-inverse absolute inset-x-8 bottom-8 px-4 py-4">
            <p className="text-eyebrow text-text-inverse uppercase">
              {paid ? "Paid exhibition" : "Upcoming exhibition"}
            </p>
            <p className="text-body-sm text-text-inverse mt-1">{caption}</p>
          </div>
        </div>

        {/* Right: the registration */}
        <div className="bg-surface-page flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <DialogTitle className="text-h3">
                Register for the exhibition
              </DialogTitle>
              <DialogDescription className="text-body-sm text-text-secondary mt-2.25">
                Reserve your place for this upcoming presentation at JEMAI.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                variant="quiet"
                aria-label="Close"
                className="border-border-default text-icon-primary size-10 shrink-0 rounded-full border"
              >
                <X className="size-3.5" />
              </Button>
            </DialogClose>
          </div>

          <form onSubmit={handleSubmit(() => {})} noValidate className="mt-6.25">
            <p className={modalLabelClass}>Exhibition</p>
            <p className="bg-surface-subtle text-body-sm text-text-primary mt-1.5 flex min-h-14 items-center px-3 py-3">
              {exhibition.title} &middot; {exhibition.when}
            </p>

            {exhibition.ticket ? (
              <dl className="bg-surface-subtle mt-6.25 px-4 pt-4.25 pb-3.5">
                <p className="text-eyebrow text-action-primary uppercase">
                  Ticket summary
                </p>
                <div className="text-body-sm text-text-primary mt-3 flex justify-between">
                  <dt>{exhibition.ticket.label}</dt>
                  <dd>{exhibition.ticket.price}</dd>
                </div>
                <div className="text-body-sm text-text-primary mt-3 flex justify-between">
                  <dt>Number of guests</dt>
                  <dd>1</dd>
                </div>
                <div className="text-body-sm text-text-primary mt-3 flex justify-between font-semibold">
                  <dt>Total due</dt>
                  <dd>{exhibition.ticket.price}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-body-xs text-text-secondary mt-2.5">
                This exhibition is selected automatically.
              </p>
            )}

            <Field
              register={register}
              label="Full name"
              name="fullName"
              placeholder="Enter your full name"
            />

            <div className="grid gap-x-6 sm:grid-cols-2">
              <Field
                register={register}
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
              <Field
                register={register}
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="+234 000 000 0000"
              />
            </div>

            {isSubmitSuccessful ? (
              <p role="status" className="text-body-sm text-text-primary mt-6">
                {paid
                  ? "Thank you — we are handing you to Paystack to complete the payment."
                  : "Thank you — your place is reserved. A confirmation is on its way to your inbox."}
              </p>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    variant="jemai"
                    size="cta"
                    className="px-6"
                  >
                    {paid ? "Continue to secure payment" : "Complete registration"}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      size="cta"
                      className="border-border-strong text-action-primary rounded-none border bg-transparent px-6 hover:bg-transparent"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
                {paid && (
                  <p className="text-body-xs text-text-secondary mt-5.75">
                    You&rsquo;ll be redirected to Paystack. JEMAI does not store
                    your card or bank details.
                  </p>
                )}
              </>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
