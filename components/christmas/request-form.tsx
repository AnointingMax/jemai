"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import {
  Controller,
  useForm,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Ornament } from "@/components/christmas/ornament";
import {
  OutcomeModal,
  type Outcome,
} from "@/components/christmas/outcome-modal";
import { decorationAreas, propertyTypes } from "@/lib/christmas";
import { cn } from "@/lib/utils";

export type RequestValues = {
  propertyType: string;
  name: string;
  email: string;
  phone: string;
};

/** The inquiry form's recipe on the campaign's tighter lead. */
const fieldClass = "border-border-default border-b pt-3";
const labelClass = "text-eyebrow text-text-secondary block uppercase";
const controlClass =
  "mt-2 h-8 rounded-none border-0 bg-transparent px-0 text-body text-text-primary shadow-none placeholder:text-text-primary/30 focus-visible:border-0 focus-visible:ring-0";

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<RequestValues>;
  register: UseFormRegister<RequestValues>;
};

/** Module scope — inside the form it would remount and drop focus per keystroke. */
const Field = ({ label, name, register, className, ...props }: FieldProps) => (
  <div className={fieldClass}>
    <span className={labelClass}>{label} *</span>
    <Input
      aria-label={label}
      className={cn(controlClass, className)}
      {...register(name, { required: true })}
      {...props}
    />
  </div>
);

const Step = ({ children }: { children: string }) => (
  <p className="text-eyebrow-lg text-text-secondary uppercase">{children}</p>
);

type RequestFormProps = {
  eyebrow: string;
  heading: string;
  copy: string;
  footnote: string;
};

/**
 * Section 04 — the request itself, on the frame's 800px measure.
 *
 * The chips carry the areas and the quantity rows follow the *counted* ones, so
 * a compound never asks how many of it there are. Both ends of that rule live
 * in `lib/christmas`, which the console reads too.
 *
 * Nothing is filed yet: submission opens the outcome modal the frames draw. The
 * server action goes in behind `onSubmit` without moving any of this.
 */
export const RequestForm = ({
  eyebrow,
  heading,
  copy,
  footnote,
}: RequestFormProps) => {
  const { register, control, handleSubmit } = useForm<RequestValues>({
    defaultValues: { propertyType: "", name: "", email: "", phone: "" },
  });
  const [areas, setAreas] = useState<Record<string, number>>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const toggleArea = (name: string) =>
    setAreas((current) => {
      if (!(name in current)) return { ...current, [name]: 1 };
      const rest = { ...current };
      delete rest[name];
      return rest;
    });

  const counted = decorationAreas.filter(
    (area) => area.counted && area.name in areas,
  );

  const onSubmit = handleSubmit(() => setOutcome("received"));

  return (
    <section
      id="request"
      className="bg-surface-subtle relative w-full overflow-hidden px-4 pb-20 sm:px-6 lg:pb-31"
    >
      <Image
        src="/figma/christmas/garland.png"
        alt=""
        aria-hidden
        width={1440}
        height={254}
        unoptimized
        className="pointer-events-none absolute top-0 left-1/2 w-full min-w-180 -translate-x-1/2 select-none"
      />

      <Ornament
        src="/figma/christmas/reindeer.png"
        width={140}
        height={167}
        className="right-0 bottom-0"
      />

      <div className="relative mx-auto w-full max-w-200 pt-40 sm:pt-60 lg:pt-85.25">
        <div className="text-center">
          <p className="text-eyebrow-lg text-text-secondary uppercase">
            {eyebrow}
          </p>
          <h2 className="font-heading text-text-primary mt-4 text-3xl leading-snug sm:text-4xl lg:text-5xl lg:leading-none">
            {heading}
          </h2>
          <p className="text-body text-text-secondary mt-4.5">{copy}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-12">
          <Step>01 / Your space</Step>

          <div className={cn(fieldClass, "mt-3")}>
            <span className={labelClass}>Property type</span>
            <Controller
              control={control}
              name="propertyType"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-label="Property type"
                    className={cn(
                      controlClass,
                      "data-placeholder:text-text-primary/45 w-full justify-between px-0 data-[size=default]:h-8",
                    )}
                  >
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="mt-9.75 flex flex-wrap items-baseline gap-2">
            <Step>02 / Decoration areas</Step>
            <span className="text-body-sm text-action-primary">
              (Choose one or more)
            </span>
          </div>

          <div className="mt-5.75 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {decorationAreas.map((area) => {
              const selected = area.name in areas;
              return (
                <Button
                  key={area.name}
                  type="button"
                  variant="chip"
                  aria-pressed={selected}
                  onClick={() => toggleArea(area.name)}
                  /* The `chip` variant paints its own `aria-pressed:` colours,
                     so the selected state has to answer on the same variant or
                     the label goes back to ink on ink. */
                  className={cn(
                    "text-body-sm h-10.25 w-full gap-2 px-2 font-normal whitespace-normal",
                    "aria-pressed:bg-surface-inverse aria-pressed:text-text-inverse aria-pressed:border-surface-inverse",
                  )}
                >
                  {selected && <Check aria-hidden className="size-3.5" />}
                  {area.name}
                </Button>
              );
            })}
          </div>

          <p className={cn(labelClass, "mt-4")}>Room quantities</p>

          {counted.length > 0 && (
            <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
              {counted.map((area) => (
                <div
                  key={area.name}
                  className="border-border-default flex items-center justify-between gap-4 border-b py-1.5"
                >
                  <span className="text-body text-text-secondary">
                    {area.name}
                  </span>
                  <QuantityStepper
                    size="sm"
                    label={area.name}
                    value={areas[area.name]}
                    max={20}
                    onChange={(value) =>
                      setAreas((current) => ({
                        ...current,
                        [area.name]: value,
                      }))
                    }
                    className="h-8 w-22 border-0"
                  />
                </div>
              ))}
            </div>
          )}

          <p className="text-body-sm text-text-secondary mt-3">
            Quantities appear only for selected room-based areas.
          </p>

          <div className="mt-11 pb-3.25">
            <Step>03 / Your details</Step>
          </div>

          <Field
            register={register}
            label="Name"
            name="name"
            placeholder="Full name"
            className="mt-2.5"
          />

          <div className="grid gap-x-6 sm:grid-cols-2">
            <Field
              register={register}
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
            />
            <Field
              register={register}
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="+234 000 000 0000"
            />
          </div>

          <p className="text-body-sm text-text-secondary mt-5.5">
            We use these details only to review your request and contact you
            about this Christmas consultation.
          </p>

          <Button
            type="submit"
            variant="jemai"
            disabled={Object.keys(areas).length === 0}
            className="text-label mt-15 h-12.25 w-full border-0"
          >
            Submit Consultation Request
          </Button>

          <p className="text-body-xs text-text-secondary mx-auto mt-8.25 max-w-160 text-center">
            {footnote}
          </p>
        </form>
      </div>

      <OutcomeModal
        outcome={outcome}
        onOpenChange={(open) => !open && setOutcome(null)}
      />
    </section>
  );
};
