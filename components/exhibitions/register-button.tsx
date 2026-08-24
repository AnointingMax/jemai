"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RegisterModal,
  type RegisterExhibition,
} from "@/components/exhibitions/register-modal";

/** The maroon CTA and the registration modal it opens — the only client
 *  boundary on either upcoming page. */
export const RegisterButton = ({
  exhibition,
  label = "Register to Attend",
  className = "w-37",
}: {
  exhibition: RegisterExhibition;
  label?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="jemai"
        size="cta"
        onClick={() => setOpen(true)}
        className={`border-0 ${className}`}
      >
        {label}
      </Button>
      <RegisterModal
        open={open}
        onOpenChange={setOpen}
        exhibition={exhibition}
      />
    </>
  );
};
