"use client";

import { useState, useTransition, type ComponentProps } from "react";
import {
  Controller,
  useForm,
  type Control,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Calendar, Mail } from "lucide-react";
import { toast } from "sonner";

import { requestConsultationAction } from "@/app/(customer)/(site)/consultation/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { budgets, projectTypes } from "@/lib/admin/consultation-record";
import { cn } from "@/lib/utils";

type InquiryValues = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  startDate: string;
  endDate: string;
  budget: string;
  summary: string;
};

/**
 * Same field recipe as the Contact form on a tighter lead: 26px, a 14px eyebrow
 * label, 6px, then a 37px control closing on the rule. That gives the frame's
 * 84px rule pitch (284 / 368 / 456 / 540) and puts each label's ink where the
 * export has it.
 */
const fieldClass = "border-border-default border-b pt-6.5";
const labelClass = "text-eyebrow text-text-secondary block uppercase";
const controlClass =
  "mt-1.5 h-9.25 rounded-none border-0 bg-transparent px-0 text-body-sm text-text-primary shadow-none placeholder:text-text-primary/30 focus-visible:border-0 focus-visible:ring-0";

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<InquiryValues>;
  register: UseFormRegister<InquiryValues>;
  required?: boolean;
};

/** Module scope — inside the form it would remount and drop focus per keystroke. */
const Field = ({
  label,
  name,
  register,
  required,
  className,
  ...props
}: FieldProps) => (
  <div className={fieldClass}>
    <span className={labelClass}>
      {label}
      {required && " *"}
    </span>
    <Input
      aria-label={label}
      className={cn(controlClass, className)}
      {...register(name, required ? { required: true } : undefined)}
      {...props}
    />
  </div>
);

/**
 * The frame draws "Select date" with a calendar glyph, which a native date
 * input cannot show — it has no placeholder. So the control starts as text and
 * swaps to `date` on focus, and the browser's own indicator is made
 * transparent so the drawn glyph is what you click.
 */
const DateField = ({
  label,
  name,
  register,
}: {
  label: string;
  name: Path<InquiryValues>;
  register: UseFormRegister<InquiryValues>;
}) => {
  const { onBlur, ...rest } = register(name);
  // `pb-1`: the frame gives the date row 88px where every other row is 84.
  return (
    <div className={cn(fieldClass, "relative pb-1")}>
      <span className={labelClass}>{label}</span>
      <Input
        type="text"
        aria-label={label}
        placeholder="Select date"
        onFocus={(event) => {
          event.target.type = "date";
        }}
        onBlur={(event) => {
          if (!event.target.value) event.target.type = "text";
          return onBlur(event);
        }}
        className={cn(
          controlClass,
          "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:opacity-0",
        )}
        {...rest}
      />
      <Calendar
        aria-hidden
        className="text-text-secondary pointer-events-none absolute right-0 bottom-2.75 size-3.5"
      />
    </div>
  );
};

const Picker = ({
  label,
  name,
  control,
  options,
  placeholder,
}: {
  label: string;
  name: Path<InquiryValues>;
  control: Control<InquiryValues>;
  options: readonly string[];
  placeholder?: string;
}) => (
  <div className={fieldClass}>
    <span className={labelClass}>{label}</span>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value || undefined} onValueChange={field.onChange}>
          <SelectTrigger
            aria-label={label}
            className={cn(
              controlClass,
              "w-full justify-between px-0 data-[size=default]:h-9.25 data-placeholder:text-text-primary/30",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </div>
);

type InquiryFormProps = {
  eyebrow: string;
  heading: string;
  copy: string;
  email: string;
};

export const InquiryForm = ({
  eyebrow,
  heading,
  copy,
  email,
}: InquiryFormProps) => {
  const { register, control, handleSubmit, reset } = useForm<InquiryValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: projectTypes[0],
      startDate: "",
      endDate: "",
      budget: "",
      summary: "",
    },
  });
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  /* The brief is filed by the action; the form clears and acknowledges in place
     — no frame draws a sent state, so the line below the button is it. */
  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await requestConsultationAction(values);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      toast.success(result.data);
      reset();
      setSent(true);
    }),
  );

  return (
    <section className="bg-surface-subtle w-full px-4 pt-20.75 pb-21.25 sm:px-6">
      <div className="mx-auto w-full max-w-160">
        <div className="text-center">
          <p className="text-eyebrow text-text-secondary uppercase">
            {eyebrow}
          </p>
          <h2 className="font-heading text-text-primary mt-2.75 text-2xl font-bold sm:text-h3">
            {heading}
          </h2>
          <p className="text-body text-text-secondary mt-3.25">{copy}</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-5.25"
        >
          <div className="grid gap-x-6 sm:grid-cols-2">
            <Field
              register={register}
              label="Name"
              name="name"
              required
              placeholder="Full name"
            />
            <Field
              register={register}
              label="Email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
            />
            <Field
              register={register}
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+234 000 000 0000"
            />
            <Picker
              label="Project Type"
              name="projectType"
              control={control}
              options={projectTypes}
            />
            <DateField
              label="Start Date"
              name="startDate"
              register={register}
            />
            <DateField label="End Date" name="endDate" register={register} />
          </div>

          <Picker
            label="Estimated Budget"
            name="budget"
            control={control}
            options={budgets}
            placeholder="Select range"
          />
          <p className="text-body-xs text-text-secondary mt-2.25">
            Optional, but useful for shaping the right proposal.
          </p>

          <div className={fieldClass}>
            <span className={labelClass}>Project Summary</span>
            <Textarea
              aria-label="Project Summary"
              placeholder="Tell us what you are creating, changing or solving."
              className="text-body text-text-primary placeholder:text-text-primary/30 mt-1.5 h-27.75 resize-none rounded-none border-0 bg-transparent px-0 pt-2.5 shadow-none focus-visible:border-0 focus-visible:ring-0"
              {...register("summary", { required: true })}
            />
          </div>

          {/* Full-measure button — 640 x 48 in the frame. */}
          <Button
            type="submit"
            variant="jemai"
            disabled={pending}
            className="text-label mt-10.5 h-12 w-full border-0"
          >
            {pending ? "Sending…" : "Request a consultation"}
          </Button>

          {sent && (
            <p
              className="text-body-sm text-action-primary mt-4 text-center"
              role="status"
            >
              Thank you — we&rsquo;ll be in touch to arrange your first
              conversation.
            </p>
          )}

          <a
            href={`mailto:${email}`}
            className="text-body-sm text-text-primary hover:text-action-link mt-7.25 flex items-center justify-center gap-2 transition-colors"
          >
            <Mail aria-hidden className="size-3.5" />
            {email}
          </a>
        </form>
      </div>
    </section>
  );
};
