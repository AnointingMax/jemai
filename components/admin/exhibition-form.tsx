"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";

import { ArtworkPicker } from "@/components/admin/artwork-picker";
import { FileDrop } from "@/components/admin/file-drop";
import {
  FieldHint,
  FieldLabel,
  FormSection,
  fieldChrome,
} from "@/components/admin/form-section";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import { slugify, type ContentAsset } from "@/lib/admin/content";
import type { Artwork } from "@/lib/gallery";
import { cn } from "@/lib/utils";

/**
 * The form's own shape: every scalar is a string, because that is what the
 * controls hand back. `toInput` on the server side of the action is the only
 * place numbers and booleans are parsed.
 */
export type ExhibitionFormValues = {
  name: string;
  slug: string;
  artist: string;
  startDate: string;
  endDate: string;
  venue: string;
  /** "free" | "paid" — the radio pair's value. */
  admission: string;
  price: string;
  summary: string;
  content: string;
  artistBio: string;
  thumbnail: ContentAsset[];
  artistProfile: ContentAsset[];
  media: ContentAsset[];
  featured: string[];
};

export const emptyExhibitionForm: ExhibitionFormValues = {
  name: "",
  slug: "",
  artist: "",
  startDate: "",
  endDate: "",
  venue: "",
  admission: "free",
  price: "",
  summary: "",
  content: "",
  artistBio: "",
  thumbnail: [],
  artistProfile: [],
  media: [],
  featured: [],
};

type ExhibitionFormProps = {
  /**
   * Absent on the create screen. Supplied, the same form edits that exhibition —
   * the fields, the validation and the submit path are identical, only the
   * defaults, the heading and the action differ.
   */
  exhibition?: ExhibitionFormValues;
  /** The catalogue the Featured Artworks grid draws. */
  artworks: Artwork[];
  /**
   * Server action. Hands back the saved show's slug — which the create screen
   * has no way of knowing, and an edit can change — so the caller navigates.
   */
  action: (
    values: ExhibitionFormValues,
  ) => Promise<ActionResult<{ slug: string; name: string; }>>;
  /** Where the close button goes, and where a cancelled edit returns to. */
  cancelHref: string;
  submitLabel: string;
  heading: string;
};

const required = (message: string) => ({
  required: message,
  validate: (value: string) => value.trim().length > 0 || message,
});

export const ExhibitionForm = ({
  exhibition,
  artworks,
  action,
  cancelHref,
  submitLabel,
  heading,
}: ExhibitionFormProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<string | null>(null);
  // On an existing exhibition the slug is already settled, so it stops tracking
  // the name; on a new one it follows until the author edits it by hand.
  const [slugLocked, setSlugLocked] = useState(Boolean(exhibition));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ExhibitionFormValues>({
    mode: "onChange",
    defaultValues: exhibition ?? emptyExhibitionForm,
  });

  const admission = useWatch({ control, name: "admission" });
  const thumbnail = useWatch({ control, name: "thumbnail" });
  const artistProfile = useWatch({ control, name: "artistProfile" });
  const media = useWatch({ control, name: "media" });
  const featured = useWatch({ control, name: "featured" });
  const startDate = useWatch({ control, name: "startDate" });

  const onSubmit = handleSubmit((values) => {
    setFailed(null);
    startTransition(async () => {
      const result = await action(values);

      if (result.error) {
        // Twice over: the toast carries it past a long form's scroll position,
        // the inline line keeps it in front of the reader while they fix it.
        setFailed(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(`${result.data.name} saved`);
      // The detail screen renders on the server from the row this just wrote,
      // so the cached one it would otherwise land on has to go first.
      router.refresh();
      router.push(`/admin/exhibitions/${result.data.slug}`);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="border-border-default overflow-hidden rounded-xl border bg-background"
    >
      <div className="border-border-default flex items-center justify-between gap-4 border-b p-4">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          asChild
          aria-label="Close without saving"
          className="border-border-default"
        >
          <Link href={cancelHref}>
            <X />
          </Link>
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || pending}
          className="h-11 px-5 text-sm disabled:bg-action-primary/32 disabled:opacity-100"
        >
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-175 flex-col gap-8">
          <h1 className="text-text-primary font-heading text-3xl sm:text-4xl">{heading}</h1>

          {failed ? (
            <p role="alert" className="text-[#e11d48] text-sm">
              {failed}
            </p>
          ) : null}

          <Accordion type="multiple" defaultValue={["basics"]}>
            <FormSection
              value="basics"
              title="Event basics"
              required
              description="To start displaying, all you need is a name and a date."
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="name" required>
                    Exhibition name
                  </FieldLabel>
                  <Input
                    id="name"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("name", {
                      ...required("An exhibition name is required."),
                      onChange: (event) => {
                        if (!slugLocked) setValue("slug", slugify(event.target.value));
                      },
                    })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <div
                    className={cn(
                      fieldChrome,
                      "focus-within:border-ring flex h-11 items-center gap-1 border px-3"
                    )}
                  >
                    <span aria-hidden className="text-text-secondary text-sm">
                      /
                    </span>
                    <Input
                      id="slug"
                      className="h-full flex-1 rounded-none border-0 bg-transparent px-0 text-sm focus-visible:ring-0 md:text-sm"
                      {...register("slug", { onChange: () => setSlugLocked(true) })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <FieldHint error={errors.name?.message}>
                    {"Give your exhibition a short and clear title.\n50-60 characters is the recommended length for search engines."}
                  </FieldHint>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="artist">Artist</FieldLabel>
                  <Input
                    id="artist"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("artist")}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <p className="text-text-secondary text-xs">
                    The run decides where the show appears: it is listed as upcoming
                    until it opens, open while it runs, and moves into the past
                    record the day after it ends.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="startDate" required>
                    Start date
                  </FieldLabel>
                  <Input
                    id="startDate"
                    type="date"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("startDate", { required: "A start date is required." })}
                  />
                  <FieldHint error={errors.startDate?.message} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="endDate" required>
                    End date
                  </FieldLabel>
                  <Input
                    id="endDate"
                    type="date"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("endDate", {
                      required: "An end date is required.",
                      // Both are `yyyy-mm-dd`, so a string compare is a date compare.
                      validate: (value) =>
                        !startDate || value >= startDate || "The run cannot end before it starts.",
                    })}
                  />
                  <FieldHint error={errors.endDate?.message} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="venue">Venue</FieldLabel>
                  <Input
                    id="venue"
                    placeholder="JEMAI Gallery, Lagos"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("venue")}
                  />
                </div>
              </div>

              <fieldset className="mt-6 flex flex-col gap-2">
                <legend className="text-text-secondary text-eyebrow-lg mb-2 uppercase">
                  Admission
                </legend>
                <RadioGroup
                  value={admission}
                  onValueChange={(value) =>
                    setValue("admission", value, { shouldValidate: true })
                  }
                  className="gap-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="free" id="admission-free" />
                    <Label htmlFor="admission-free" className="text-text-primary text-sm">
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="paid" id="admission-paid" />
                    <Label htmlFor="admission-paid" className="text-text-primary text-sm">
                      Paid
                    </Label>
                  </div>
                </RadioGroup>
                {/* The amount only applies on the paid branch; it keeps whatever
                    was typed while free, so toggling back and forth loses nothing. */}
                {admission === "paid" ? (
                  <div className="mt-1 flex flex-col gap-1.5 sm:max-w-[calc(50%-0.75rem)]">
                    <Input
                      inputMode="numeric"
                      placeholder="Amount"
                      aria-label="Admission amount in naira"
                      className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                      {...register("price", {
                        validate: (value) =>
                          admission !== "paid" ||
                          (Number(value) > 0 && Number.isFinite(Number(value))) ||
                          "Enter a ticket price in whole naira.",
                      })}
                    />
                    <FieldHint error={errors.price?.message} />
                  </div>
                ) : null}
              </fieldset>

              <div className="mt-6 flex flex-col gap-1.5">
                <FieldLabel htmlFor="summary" required>
                  Short summary
                </FieldLabel>
                <Textarea
                  id="summary"
                  rows={3}
                  className={cn(fieldChrome, "min-h-20 text-sm md:text-sm")}
                  {...register("summary", required("A short summary is required."))}
                />
                <FieldHint error={errors.summary?.message}>
                  {"Give your exhibition a short and clear description.\n120-160 characters is the recommended length for search engines."}
                </FieldHint>
              </div>
            </FormSection>

            <FormSection
              value="content"
              title="Exhibition detail page content"
              description="Type into the field or copy/paste"
            >
              {/* The frame draws a rich-text toolbar above this field. No editor
                  is bundled in the project, so the copy is plain text for now and
                  paragraphs are split on blank lines when the page renders it. */}
              <Textarea
                id="content"
                rows={10}
                className={cn(fieldChrome, "min-h-60 text-sm md:text-sm")}
                {...register("content")}
              />
            </FormSection>

            <FormSection
              value="thumbnail"
              title="Thumbnail"
              description="Used to represent your exhibition during enquiry, social sharing and more."
            >
              <FileDrop
                label="Thumbnail image"
                assets={thumbnail}
                onChange={(assets) => setValue("thumbnail", assets, { shouldValidate: true })}
              />
            </FormSection>

            <FormSection
              value="media"
              title="Media"
              description="Used to represent your exhibition during enquiry, social sharing and more."
            >
              <FileDrop
                label="Exhibition media"
                multiple
                reorderable
                assets={media}
                onChange={(assets) => setValue("media", assets, { shouldValidate: true })}
              />
            </FormSection>

            <FormSection
              value="featured"
              title="Featured Artworks"
              description="Link related artworks to this exhibition page"
            >
              <ArtworkPicker
                artworks={artworks}
                selected={featured}
                onChange={(slugs) => setValue("featured", slugs, { shouldValidate: true })}
              />
            </FormSection>

            <FormSection
              value="artist"
              title="Artist(s) Profile"
              description="Provide details of the artist"
            >
              <div className="flex flex-col gap-6">
                <FileDrop
                  label="Artist portrait"
                  assets={artistProfile}
                  onChange={(assets) =>
                    setValue("artistProfile", assets, { shouldValidate: true })
                  }
                />
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="artistBio">Biography</FieldLabel>
                  <Textarea
                    id="artistBio"
                    rows={10}
                    className={cn(fieldChrome, "min-h-60 text-sm md:text-sm")}
                    {...register("artistBio")}
                  />
                </div>
              </div>
            </FormSection>
          </Accordion>
        </div>
      </div>
    </form>
  );
};
