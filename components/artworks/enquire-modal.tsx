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
import { Textarea } from "@/components/ui/textarea";

type EnquiryValues = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

type EnquireModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The piece the enquiry is about — locked, and shown in both panes. */
  artwork: { title: string; artist: string; image: string; };
};

/**
 * Field rhythm, measured off `design-reference/modal wrapper.png`: the rules sit
 * 84px apart (y=1136, 1220), each row is 25px of lead, a 14px eyebrow label,
 * 6px, then a 37px control closing on the rule. That is the Contact field
 * recipe on a 9px shorter lead.
 */
const fieldClass = "border-border-default border-b pt-6.25";
const labelClass = "text-eyebrow text-text-secondary block uppercase";
const controlClass =
  "mt-1.5 h-9.25 rounded-none border-0 bg-transparent px-0 text-body-sm text-text-primary shadow-none placeholder:text-text-primary/25 focus-visible:border-0 focus-visible:ring-0";

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<EnquiryValues>;
  register: UseFormRegister<EnquiryValues>;
};

/** Module scope on purpose — declared inside the form it would remount on every
 *  render and drop focus mid-keystroke. */
const Field = ({ label, name, register, ...props }: FieldProps) => (
  <div className={fieldClass}>
    <span className={labelClass}>{label}</span>
    <Input
      aria-label={label}
      className={controlClass}
      {...register(name, { required: true })}
      {...props}
    />
  </div>
);

/**
 * The 1124 × 715 enquiry wrapper: a 423px photograph on the left with its
 * caption block inset 32px, and a 702px `surface-page` panel on the right
 * padded 48px all round. Same shape as the checkout modal, a different measure.
 */
export const EnquireModal = ({
  open,
  onOpenChange,
  artwork,
}: EnquireModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<EnquiryValues>({
    defaultValues: { fullName: "", email: "", phone: "", message: "" },
  });

  /* No endpoint exists and no frame draws a sent state, so the modal
     acknowledges in place — `onSubmit` is the seam to point at a real handler. */
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const caption = `${artwork.title} · ${artwork.artist}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          /* Radix focuses the close button by default, which the frame draws
             bare; sending focus to the first field is both closer and kinder. */
          event.preventDefault();
          (event.target as HTMLElement | null)
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }}
        className="flex h-178.75 w-[min(1124px,calc(100vw-2rem))] max-w-none overflow-hidden max-lg:h-auto max-lg:max-h-[calc(100dvh-2rem)] max-lg:overflow-y-auto">
        {/* Left: the piece, with its caption block */}
        <div className="bg-surface-inverse relative hidden w-105.75 shrink-0 lg:block">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="423px"
            className="object-cover"
          />
          <div className="bg-surface-inverse absolute inset-x-8 bottom-8 px-4 py-4">
            <p className="text-eyebrow text-text-inverse uppercase">
              Selected artwork
            </p>
            <p className="text-body-sm text-text-inverse mt-1">{caption}</p>
          </div>
        </div>

        {/* Right: the enquiry */}
        <div className="bg-surface-page flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <DialogTitle className="text-h3">
                Enquire about this artwork
              </DialogTitle>
              <DialogDescription className="text-body-sm text-text-secondary mt-2.25">
                Begin a conversation with JEMAI about availability, placement or
                acquisition.
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
            <p className={labelClass}>Artwork</p>
            <p className="bg-surface-subtle text-body-sm text-text-primary mt-1.5 flex min-h-14 items-center px-3 py-3">
              {caption}
            </p>
            <p className="text-body-xs text-text-secondary mt-2.5">
              The artwork is selected automatically and cannot be changed here.
            </p>

            <Field
              register={register}
              label="Full name"
              name="fullName"
              placeholder="Enter your full name"
            />

            {/* Two 290px columns on a 24px gutter — the 604px measure split. */}
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

            <div className={fieldClass}>
              <span className={labelClass}>Message</span>
              <Textarea
                aria-label="Message"
                placeholder="I would like to know more about this work and its availability."
                className="text-body text-text-primary placeholder:text-text-primary/25 mt-1.5 h-28 resize-none rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-body"
                {...register("message")}
              />
            </div>

            {isSubmitSuccessful ? (
              <p role="status" className="text-body-sm text-text-primary mt-8">
                Thank you — your enquiry is with the JEMAI art team. We will be
                in touch shortly.
              </p>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="jemai"
                  size="cta"
                  className="px-6"
                >
                  Send enquiry
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    size="cta"
                    className="border-border-strong text-text-primary rounded-none border bg-transparent px-6 hover:bg-transparent"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
