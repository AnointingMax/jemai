"use client";

import { useState, useTransition, type ComponentProps } from "react";
import Image from "next/image";
import { useForm, type Path, type UseFormRegister } from "react-hook-form";
import { CircleAlert, X } from "lucide-react";
import { sendArtworkEnquiryAction } from "@/app/(customer)/(site)/artworks/[slug]/actions";
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
  name: string;
  email: string;
  phone: string;
  message: string;
};

type EnquireModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: { slug: string; title: string; artist: string; image: string; };
};

const fieldClass = "border-border-default border-b pt-6.25";
const labelClass = "text-eyebrow text-text-secondary block uppercase";
const controlClass =
  "mt-1.5 h-9.25 rounded-none border-0 bg-transparent px-0 text-body-sm text-text-primary shadow-none placeholder:text-text-primary/25 focus-visible:border-0 focus-visible:ring-0";

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<EnquiryValues>;
  register: UseFormRegister<EnquiryValues>;
};

const Field = ({ label, name, register, ...props }: FieldProps) => (
  <div className={fieldClass}>
    <span className={labelClass}>{label}</span>
    <Input
      aria-label={label}
      className={controlClass}
      {...register(name)}
      {...props}
    />
  </div>
);

export const EnquireModal = ({
  open,
  onOpenChange,
  artwork,
}: EnquireModalProps) => {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<EnquiryValues>({
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
      setSent(null);
      setError(null);
    }
    onOpenChange(next);
  };

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      setError(null);
      const result = await sendArtworkEnquiryAction(artwork.slug, values);

      if (result.error) {
        setError(result.message);
        return;
      }

      setSent(result.data);
      reset();
    }),
  );

  const caption = `${artwork.title} · ${artwork.artist}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.target as HTMLElement | null)
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }}
        className="flex h-178.75 w-[min(1124px,calc(100vw-2rem))] max-w-none overflow-hidden max-lg:h-auto max-lg:max-h-[calc(100dvh-2rem)] max-lg:overflow-y-auto">
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

          <form onSubmit={onSubmit} noValidate className="mt-6.25">
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
              name="name"
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

            <div className={fieldClass}>
              <span className={labelClass}>Message</span>
              <Textarea
                aria-label="Message"
                placeholder="I would like to know more about this work and its availability."
                className="text-body text-text-primary placeholder:text-text-primary/25 mt-1.5 h-28 resize-none rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:border-0 focus-visible:ring-0 md:text-body"
                {...register("message")}
              />
            </div>

            {sent ? (
              <p role="status" className="text-body-sm text-text-primary mt-8">
                {sent}
              </p>
            ) : (
              <div className="mt-8 flex flex-col gap-3">
                {error ? (
                  <p
                    role="alert"
                    className="bg-surface-subtle text-body-sm border-destructive text-destructive flex items-start gap-2 border-l-3 px-3.5 py-3"
                  >
                    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    variant="jemai"
                    size="cta"
                    disabled={pending}
                    className="px-6"
                  >
                    {pending ? "Sending…" : "Send enquiry"}
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
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
