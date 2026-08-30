"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { fieldChrome } from "@/components/admin/form-section";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ArtistOption = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  portrait: string | null;
};

type ArtistComboboxProps = {
  id: string;
  value: string;
  artists: ArtistOption[];
  exclude?: string[];
  onChange: (name: string) => void;
  onSelect?: (artist: ArtistOption) => void;
  onBlur?: () => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
};

const normalize = (value: string) => value.trim().toLowerCase();

/** Names are matched the way the store matches them — trimmed and case-blind. */
export const sameName = (one: string, other: string) =>
  normalize(one) === normalize(other);

export const ArtistCombobox = ({
  id,
  value,
  artists,
  exclude = [],
  onChange,
  onSelect,
  onBlur,
  placeholder = "Search or type a new name",
  "aria-invalid": invalid,
}: ArtistComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const taken = exclude.map(normalize);
  const query = normalize(value);

  const matches = artists.filter(
    (artist) =>
      // The name in the field is this card's own, so it never counts as taken.
      (!taken.includes(normalize(artist.name)) || normalize(artist.name) === query) &&
      (!query || normalize(artist.name).includes(query)),
  );

  const choose = (artist: ArtistOption) => {
    onChange(artist.name);
    onSelect?.(artist);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") return setOpen(false);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return setOpen(true);
      if (!matches.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((at) => (at + step + matches.length) % matches.length);
      return;
    }
    if (event.key === "Enter" && open && matches[active]) {
      // The list is open with a row under the cursor, so Enter takes that row
      // rather than submitting a half-filled form.
      event.preventDefault();
      choose(matches[active]);
    }
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
        onBlur?.();
      }}
    >
      <div
        className={cn(
          fieldChrome,
          "focus-within:border-ring flex h-11 items-center border",
          invalid && "border-[#e11d48]",
        )}
      >
        <Input
          id={id}
          ref={inputRef}
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-full flex-1 rounded-none border-0 bg-transparent px-3 text-sm focus-visible:ring-0 md:text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Show artists"
          onClick={() => {
            setOpen((was) => !was);
            inputRef.current?.focus();
          }}
          className="text-text-secondary flex h-full cursor-pointer items-center px-3"
        >
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </div>

      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="border-border-default bg-background absolute top-full right-0 left-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border py-1 shadow-md"
        >
          {matches.length === 0 ? (
            <li className="text-text-secondary px-3 py-2 text-sm">
              {artists.length === 0
                ? "No artists on file yet — the name you type starts one."
                : "No match. The name you type starts a new artist."}
            </li>
          ) : (
            matches.map((artist, index) => {
              const on = sameName(artist.name, value);
              return (
                <li key={artist.id} role="option" aria-selected={on}>
                  <button
                    type="button"
                    // Pointer-down would blur the input before the click lands.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(artist)}
                    className={cn(
                      "text-text-primary flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm",
                      index === active && "bg-surface-subtle",
                    )}
                  >
                    <span className="truncate">{artist.name}</span>
                    {on ? (
                      <Check aria-hidden className="text-action-primary size-4 shrink-0" />
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
};

/** The line under the field: whether this save reuses a record or starts one. */
export const ArtistOrigin = ({
  value,
  artists,
}: {
  value: string;
  artists: ArtistOption[];
}) => {
  if (!value.trim()) return null;
  const known = artists.some((artist) => sameName(artist.name, value));
  return (
    <p className="text-text-secondary text-xs">
      {known
        ? "On file already — this links to the artist you picked."
        : "Not on file — saving adds them as a new artist."}
    </p>
  );
};
