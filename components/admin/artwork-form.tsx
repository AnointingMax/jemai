"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  FieldHint,
  FieldLabel,
  FormSection,
  fieldChrome,
} from "@/components/admin/form-section";
import { FileDrop } from "@/components/admin/file-drop";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import { slugify, type ContentAsset } from "@/lib/admin/content";
import { cn } from "@/lib/utils";

export type ArtworkFormValues = {
  title: string;
  slug: string;
  artist: string;
  medium: string;
  year: string;
  dimensions: string;
  summary: string;
  story: string;
  curatorsPick: boolean;
  thumbnail: ContentAsset[];
  media: ContentAsset[];
};

export const emptyArtworkForm: ArtworkFormValues = {
  title: "",
  slug: "",
  artist: "",
  medium: "",
  year: "",
  dimensions: "",
  summary: "",
  story: "",
  curatorsPick: false,
  thumbnail: [],
  media: [],
};

type ArtworkFormProps = {
  /**
   * Absent on the create screen. Supplied, the same form edits that artwork —
   * fields, validation and submit path are identical; only the defaults, the
   * heading and the action differ.
   */
  artwork?: ArtworkFormValues;
  mediums: string[];
  years: string[];
  /**
   * Server action. Hands back the saved work's slug — which the create screen
   * does not know in advance, and an edit can change — and this form does the
   * navigating, so a rejected save can stay on the filled-in fields.
   */
  action: (
    values: ArtworkFormValues,
  ) => Promise<ActionResult<{ slug: string; title: string; }>>;
  cancelHref: string;
  submitLabel: string;
  heading: string;
};

const required = (message: string) => ({
  required: message,
  validate: (value: string) => value.trim().length > 0 || message,
});

export const ArtworkForm = ({
  artwork,
  mediums,
  years,
  action,
  cancelHref,
  submitLabel,
  heading,
}: ArtworkFormProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(Boolean(artwork));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ArtworkFormValues>({
    mode: "onChange",
    defaultValues: artwork ?? emptyArtworkForm,
  });

  // `useWatch` rather than `useForm`'s `watch`: that one returns a fresh
  // function each render, which the React Compiler cannot memoize.
  const medium = useWatch({ control, name: "medium" });
  const year = useWatch({ control, name: "year" });
  const story = useWatch({ control, name: "story" });
  const curatorsPick = useWatch({ control, name: "curatorsPick" });
  const thumbnail = useWatch({ control, name: "thumbnail" });
  const media = useWatch({ control, name: "media" });

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

      toast.success(`${result.data.title} saved`);
      // The detail screen renders on the server from the row this just wrote,
      // so the cached one it would otherwise land on has to go first.
      router.refresh();
      router.push(`/admin/artworks/${result.data.slug}`);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="border-border-default bg-background overflow-hidden rounded-xl border"
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
          className="disabled:bg-action-primary/32 h-11 px-5 text-sm disabled:opacity-100"
        >
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[700px] flex-col gap-8">
          <h1 className="text-text-primary text-2xl font-semibold">{heading}</h1>

          {failed ? (
            <p role="alert" className="text-[#e11d48] text-sm">
              {failed}
            </p>
          ) : null}

          <Accordion type="multiple" defaultValue={["general"]}>
            <FormSection
              value="general"
              title="General information"
              required
              description="To start displaying, all you need is a title and an artist."
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="title" required>
                    Artwork title
                  </FieldLabel>
                  <Input
                    id="title"
                    className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                    {...register("title", {
                      ...required("An artwork title is required."),
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
                  <FieldHint error={errors.title?.message}>
                    {"Give the work a short and clear title.\n50-60 characters is the recommended length for search engines."}
                  </FieldHint>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-1.5 sm:max-w-[calc(50%-0.75rem)]">
                <FieldLabel htmlFor="artist" required>
                  Artist
                </FieldLabel>
                <Input
                  id="artist"
                  className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                  {...register("artist", required("An artist is required."))}
                />
                <FieldHint error={errors.artist?.message} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="medium">Medium</FieldLabel>
                  <Select
                    value={medium}
                    onValueChange={(value) => setValue("medium", value, { shouldValidate: true })}
                  >
                    <SelectTrigger id="medium" className={cn(fieldChrome, "h-11 w-full text-sm")}>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediums.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="year">Year</FieldLabel>
                  <Select
                    value={year}
                    onValueChange={(value) => setValue("year", value, { shouldValidate: true })}
                  >
                    <SelectTrigger id="year" className={cn(fieldChrome, "h-11 w-full text-sm")}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-1.5 sm:max-w-[calc(50%-0.75rem)]">
                <FieldLabel htmlFor="dimensions" required>
                  Dimensions
                </FieldLabel>
                <Input
                  id="dimensions"
                  placeholder="Example: 180 × 240 cm"
                  className={cn(fieldChrome, "h-11 text-sm md:text-sm")}
                  {...register("dimensions", required("Dimensions are required."))}
                />
                <FieldHint error={errors.dimensions?.message} />
              </div>

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
                  {"Give the work a short and clear description.\n120-160 characters is the recommended length for search engines."}
                </FieldHint>
              </div>

              <label className="bg-admin-field mt-6 flex w-fit cursor-pointer items-center gap-6 rounded-lg px-4 py-3">
                <span className="flex flex-col gap-0.5">
                  <span className="text-text-primary text-sm font-medium">Curator&rsquo;s Pick</span>
                  <span className="text-text-secondary text-xs">
                    Feature this work in the curated introduction
                  </span>
                </span>
                <Switch
                  checked={curatorsPick}
                  onCheckedChange={(checked) => setValue("curatorsPick", checked)}
                  aria-label="Curator's Pick"
                />
              </label>
            </FormSection>

            <FormSection
              value="story"
              title="Artwork Story"
              description="Type into the field or copy/paste"
            >
              <RichTextEditor
                id="story"
                value={story}
                onChange={(html) => setValue("story", html, { shouldValidate: true })}
                placeholder="Tell the story behind this work…"
              />
            </FormSection>

            <FormSection
              value="thumbnail"
              title="Thumbnail"
              description="Used to represent your artwork during enquiry, social sharing and more."
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
              description="Used to represent your artwork during enquiry, social sharing and more."
            >
              <FileDrop
                label="Artwork media"
                multiple
                reorderable
                assets={media}
                onChange={(assets) => setValue("media", assets, { shouldValidate: true })}
              />
            </FormSection>
          </Accordion>
        </div>
      </div>
    </form>
  );
};
