"use client";

import { useState, type ComponentProps } from "react";
import {
  Controller,
  useForm,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
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
import { cn } from "@/lib/utils";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  message: string;
};

/**
 * The frame draws "Book a Space" as the selected value and no open menu, so
 * the rest of the list is written rather than transcribed.
 */
const inquiryTypes = [
  "Book a Space",
  "Furniture Enquiry",
  "Art & Collecting",
  "Design Consultation",
  "Press",
  "Other",
];

/**
 * Field rhythm, measured off `design-reference/Container.png`: the rules sit 92px
 * apart (y=90, 182, 274, 366), each row is 34px of lead, a 14px eyebrow label,
 * 6px, then a 37px control closing on the rule. That puts the label ink at 127
 * against the frame's 127 and the input ink at ~159 against 159.
 */
const fieldClass = "border-border-default border-b pt-8.5";
const labelClass = "text-eyebrow text-text-secondary block uppercase";
const controlClass =
  "mt-1.5 h-9.25 rounded-none border-0 bg-transparent px-0 text-body-sm text-text-primary shadow-none placeholder:text-text-primary/25 focus-visible:border-0 focus-visible:ring-0";

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: Path<ContactFormValues>;
  optional?: boolean;
  register: UseFormRegister<ContactFormValues>;
};

/** Module scope on purpose — declared inside the form it would remount on every
 *  render and drop focus mid-keystroke. */
const Field = ({ label, name, optional, register, ...props }: FieldProps) => (
  <div className={fieldClass}>
    <span className={labelClass}>
      {label}
      {optional && " (Optional)"}
    </span>
    <Input
      aria-label={label}
      className={controlClass}
      {...register(name, optional ? undefined : { required: true })}
      {...props}
    />
  </div>
);

export const ContactForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: inquiryTypes[0],
      message: "",
    },
  });

  const [sent, setSent] = useState(false);

  /**
   * No endpoint exists yet and no frame draws a sent state, so the form
   * acknowledges in place. Point this at the real handler when there is one.
   */
  const onSubmit = () => setSent(true);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-eyebrow text-text-secondary uppercase">01 &middot; The Brief</p>
      <div className="border-border-default mt-5.5 border-t" />

      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field register={register} label="First Name" name="firstName" placeholder="Jane" />
        <Field register={register} label="Last Name" name="lastName" placeholder="Smith" />
        <Field
          register={register}
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />
        <Field
          register={register}
          label="Phone"
          name="phone"
          type="tel"
          optional
          placeholder="+234 000 000 0000"
        />
        <Field
          register={register}
          label="Company or Agency"
          name="company"
          optional
          placeholder="Where you’re writing from"
        />

        <div className={fieldClass}>
          <span className={labelClass}>Inquiry Type</span>
          <Controller
            control={control}
            name="inquiryType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-label="Inquiry Type"
                  className={cn(controlClass, "w-full justify-between px-0")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className={fieldClass}>
        <span className={labelClass}>Message</span>
        <Textarea
          aria-label="Message"
          placeholder="The occasion, headcount, dates and anything else we should know…"
          className="text-body text-text-primary placeholder:text-text-primary/25 mt-1.5 h-27.75 resize-none rounded-none border-0 bg-transparent px-0 pt-2.5 shadow-none focus-visible:border-0 focus-visible:ring-0"
          {...register("message", { required: true })}
        />
      </div>

      {/* 148 x 48 in the frame, which is the 88px label plus 30px either side. */}
      <Button
        type="submit"
        variant="jemai"
        className="text-label mt-11.75 h-12 border-0 px-7.5"
      >
        Send Message
      </Button>

      {(sent || isSubmitSuccessful) && (
        <p className="text-body-sm text-action-primary mt-4" role="status">
          Thank you — your message is on its way. We reply within two working
          days.
        </p>
      )}

      {/* max-w-172 (688px), not the column's 732: the frame breaks this after
          "Our only domain is" and drops "jemai.co." to a second line, which a
          full-width measure does not do (the whole run is 713). */}
      <p className="text-body-xs text-text-secondary mt-10.25 max-w-172">
        JEMAI International will never contact you from a personal email or ask
        for payment outside of our official channels. Our only domain is
        jemai.co.
      </p>
    </form>
  );
};
