"use client";

import { useId, useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatFileSize, type ContentAsset } from "@/lib/admin/content";
import { cn } from "@/lib/utils";

/**
 * Reads a picked file into a data URL. There is no upload endpoint yet, so the
 * bytes ride along in the form payload and land in the in-memory store; swapping
 * this for a real upload is the one change the rest of the form needs.
 */
const toAsset = (file: File) =>
  new Promise<ContentAsset>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () =>
      resolve({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        src: String(reader.result),
      });
    reader.readAsDataURL(file);
  });

type FileDropProps = {
  assets: ContentAsset[];
  onChange: (assets: ContentAsset[]) => void;
  /** Single-slot (thumbnail) replaces on pick; multiple (media) appends. */
  multiple?: boolean;
  /** Only the media list is ordered, so only it draws grip handles. */
  reorderable?: boolean;
  label: string;
};

export const FileDrop = ({
  assets,
  onChange,
  multiple = false,
  reorderable = false,
  label,
}: FileDropProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const accept = async (files: FileList | null) => {
    if (!files?.length) return;
    const picked = await Promise.all(
      Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map(toAsset)
    );
    if (!picked.length) return;
    onChange(multiple ? [...assets, ...picked] : picked.slice(0, 1));
  };

  const remove = (id: string) => onChange(assets.filter((asset) => asset.id !== id));

  /** Moves the dragged row to the position of the row it was dropped on. */
  const reorder = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const from = assets.findIndex((asset) => asset.id === fromId);
    const to = assets.findIndex((asset) => asset.id === toId);
    if (from === -1 || to === -1) return;
    const next = [...assets];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange(next);
  };

  return (
    <div className="flex flex-col">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          void accept(event.dataTransfer.files);
        }}
        className={cn(
          "border-border-strong/40 flex flex-col items-center gap-1 rounded-lg border border-dashed px-6 py-6 text-center transition-colors",
          over && "border-action-primary bg-admin-field"
        )}
      >
        <p className="text-text-secondary text-sm">
          Drop your file here, or{" "}
          <label
            htmlFor={inputId}
            className="text-[#6d28d9] cursor-pointer underline-offset-2 hover:underline"
          >
            click to browse
          </label>
        </p>
        <p className="text-text-secondary text-xs">1200 × 1600 (3:4) recommended</p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple={multiple}
          aria-label={label}
          className="sr-only"
          onChange={(event) => {
            void accept(event.target.files);
            // Let the same file be picked again after it has been removed.
            event.target.value = "";
          }}
        />
      </div>

      {assets.length ? (
        <ul className="flex flex-col">
          {assets.map((asset) => (
            <li
              key={asset.id}
              draggable={reorderable}
              onDragStart={() => setDragging(asset.id)}
              onDragEnd={() => setDragging(null)}
              onDragOver={(event) => reorderable && event.preventDefault()}
              onDrop={(event) => {
                if (!reorderable || !dragging) return;
                event.preventDefault();
                event.stopPropagation();
                reorder(dragging, asset.id);
                setDragging(null);
              }}
              className={cn(
                "border-border-default flex items-center gap-3 border-b py-3 last:border-b-0",
                dragging === asset.id && "opacity-50"
              )}
            >
              {reorderable ? (
                <GripVertical
                  aria-hidden
                  className="text-text-secondary size-4 shrink-0 cursor-grab"
                />
              ) : null}
              {/* A data URL from the picker, so this stays a plain img rather
                  than going through the image optimiser. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt=""
                className="bg-surface-subtle size-12 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="text-text-primary block truncate text-sm">{asset.name}</span>
                <span className="text-text-secondary block text-xs">
                  {formatFileSize(asset.size)}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(asset.id)}
                aria-label={`Remove ${asset.name}`}
                className="text-text-secondary hover:text-text-primary shrink-0"
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
