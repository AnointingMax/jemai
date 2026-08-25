import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The 40px full-width maroon action every auth frame closes on. */
export const AuthSubmit = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    className={cn("h-10 w-full rounded-lg border-0 text-base font-normal", className)}
    {...props}
  />
);
