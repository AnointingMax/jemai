import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthFieldProps = React.ComponentProps<typeof Input> & {
  /** Omitted on the reset screen, where the frames label the fields inline. */
  label?: string;
};

/**
 * The 44px field the auth frames draw: page-ground fill, hairline border and an
 * 8px radius, with an optional 15px label sitting 11px above it.
 */
export const AuthField = ({ label, className, id, ...props }: AuthFieldProps) => (
  <div className="flex flex-col gap-1.5">
    {label ? (
      <Label htmlFor={id} className="text-text-primary text-sm font-medium">
        {label}
      </Label>
    ) : null}
    <Input
      id={id}
      className={cn(
        "bg-surface-page border-border-default text-text-primary placeholder:text-text-secondary h-11 rounded-lg px-4 text-base md:text-base",
        className
      )}
      {...props}
    />
  </div>
);
