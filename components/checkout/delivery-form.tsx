"use client";

import type { ComponentProps } from "react";
import { Controller, useFormContext, type Path } from "react-hook-form";
import { Country, State } from "country-state-city";
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
import {
  fieldBorder,
  inkStrong,
  labelInk,
  placeholderInk,
} from "@/components/checkout/tokens";

export type CheckoutFormValues = {
  fullName: string;
  /**
   * The frame's Contact group draws a name and a phone number only. An email
   * address is added because the payment cannot open without one and there is
   * nowhere else to send a receipt — a data requirement the frame did not have
   * to answer, not a layout departure.
   */
  email: string;
  phone: string;
  /** ISO 3166-1 alpha-2, e.g. "NG" — `country-state-city` keys off it. */
  country: string;
  address: string;
  city: string;
  postalCode: string;
  /** ISO subdivision code within `country`, cleared whenever country changes. */
  state: string;
  notes: string;
};

export const emptyCheckout: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  country: "NG",
  address: "",
  city: "",
  postalCode: "",
  state: "",
  notes: "",
};

const required = { required: true } as const;

type Option = { value: string; label: string; };

const countries: Option[] = Country.getAllCountries().map((country) => ({
  value: country.isoCode,
  label: country.name,
}));

const statesOf = (countryCode: string): Option[] =>
  State.getStatesOfCountry(countryCode).map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));

const controlClass =
  "h-8.5 w-full rounded-none border bg-white px-4 text-body-sm shadow-none placeholder:text-[#808080] focus-visible:ring-0 focus-visible:border-border-strong";

const Label = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={cn("text-body block", className)}
    style={{ color: labelInk }}
    {...props}
  />
);

const TextField = ({
  label,
  name,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  name: Path<CheckoutFormValues>;
}) => {
  const { register } = useFormContext<CheckoutFormValues>();
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <Input
        placeholder={label}
        className={cn(controlClass, className)}
        style={{ borderColor: fieldBorder, color: inkStrong }}
        {...register(name, required)}
        {...props}
      />
    </label>
  );
};

const PickerField = ({
  label,
  name,
  options,
  disabled,
  onSelect,
}: {
  label: string;
  name: Path<CheckoutFormValues>;
  options: Option[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}) => {
  const { control } = useFormContext<CheckoutFormValues>();
  return (
    <Controller
      control={control}
      name={name}
      // A country with no subdivisions leaves the picker empty and disabled,
      // so requiring it would make the form unsubmittable.
      rules={disabled ? undefined : required}
      render={({ field }) => (
        <Select
          value={field.value || undefined}
          disabled={disabled}
          onValueChange={(value) => {
            field.onChange(value);
            onSelect?.(value);
          }}
        >
          <SelectTrigger
            aria-label={label}
            ref={field.ref}
            onBlur={field.onBlur}
            className={cn(
              controlClass,
              // SelectTrigger carries its own `data-[size=default]:h-8`, which outranks
              // a plain h-8.5 because the variant selector is more specific.
              "justify-between px-4 py-0 data-[size=default]:h-8.5",
            )}
            style={{
              borderColor: fieldBorder,
              color: field.value ? inkStrong : placeholderInk,
            }}
          >
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="max-h-70">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export const DeliveryForm = () => {
  const { register, setValue, watch } = useFormContext<CheckoutFormValues>();
  const states = statesOf(watch("country"));

  return (
    <section aria-labelledby="delivery-heading">
      <h2 id="delivery-heading" className="font-heading text-text-primary text-h4 font-normal">
        Delivery
      </h2>

      <div className="mt-5.75">
        <Label>Contact</Label>
        <div className="mt-2 space-y-2">
          <TextField label="Full Name" name="fullName" autoComplete="name" />
          <TextField label="Email" name="email" type="email" autoComplete="email" />
          <TextField label="Phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="mt-6">
        <Label>Billing Address</Label>
        <div className="mt-2 space-y-2">
          <PickerField
            label="Country"
            name="country"
            options={countries}
            // The state list is scoped to the country, so an old selection
            // would be meaningless against a new one.
            onSelect={() => setValue("state", "", { shouldValidate: true })}
          />
          <TextField label="Address" name="address" autoComplete="street-address" />
          {/* City and Postal code share an edge in the frame — two hairlines
              touching, not one collapsed border, so the row carries no gap. */}
          <div className="grid grid-cols-2">
            <TextField label="City" name="city" autoComplete="address-level2" />
            <TextField
              label="Postal code"
              name="postalCode"
              autoComplete="postal-code"
            />
          </div>
          <PickerField
            label="State"
            name="state"
            options={states}
            disabled={states.length === 0}
          />
        </div>
      </div>

      <div className="mt-6">
        <Label>Order notes (optional)</Label>
        <Textarea
          placeholder="Notes about your order, e.g. special notes for delivery."
          className="text-body-sm mt-2 h-37.5 min-h-0 resize-none rounded-none border bg-white px-4 py-3 shadow-none placeholder:text-[#808080] focus-visible:border-border-strong focus-visible:ring-0"
          style={{ borderColor: fieldBorder, color: inkStrong }}
          {...register("notes")}
        />
      </div>
    </section>
  );
};
