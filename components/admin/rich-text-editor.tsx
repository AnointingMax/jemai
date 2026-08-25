"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Italic,
  List,
  Underline,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

/**
 * `document.execCommand` is deprecated but has no standard replacement, and the
 * only alternatives are a full editor dependency (tiptap, Lexical) or hand-built
 * range surgery. For a toolbar this small — six commands over a contenteditable
 * — it remains the proportionate choice; every browser still implements it.
 * Whatever it emits is sanitised again on save by `sanitizeRichText`.
 */
const exec = (command: string, value?: string) => {
  // Off by default, `foreColor` emits `<font color>` and the alignment commands
  // emit `align` attributes — both of which `sanitizeRichText` drops, so the
  // formatting would silently vanish on save. On, they emit inline `style`,
  // which is exactly the one attribute the allowlist keeps.
  document.execCommand("styleWithCSS", false, "true");
  document.execCommand(command, false, value);
};

type Command = { id: string; label: string; icon: typeof Bold; command: string };

const MARKS: Command[] = [
  { id: "bold", label: "Bold", icon: Bold, command: "bold" },
  { id: "italic", label: "Italic", icon: Italic, command: "italic" },
  { id: "underline", label: "Underline", icon: Underline, command: "underline" },
];

const BLOCKS: Command[] = [
  { id: "left", label: "Align left", icon: AlignLeft, command: "justifyLeft" },
  { id: "center", label: "Align centre", icon: AlignCenter, command: "justifyCenter" },
  { id: "list", label: "Bulleted list", icon: List, command: "insertUnorderedList" },
];

/** The swatches the colour control offers, brand first. */
const COLOURS = ["#160507", "#701926", "#2f6fe0", "#2f8f4e", "#e07a2f"];

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
};

export const RichTextEditor = ({ value, onChange, placeholder, id }: RichTextEditorProps) => {
  const editor = useRef<HTMLDivElement>(null);
  // What we last handed the parent. The editable div owns its own DOM while the
  // author types, so writing `value` back on every render would reset the
  // caret to the start on each keystroke; it is only synced when the incoming
  // value is something we did not produce (initial load, or a form reset).
  // Starts null rather than `value` so the first sync always runs — seeded with
  // `value`, mount compares equal and the editor renders empty on an edit.
  const emitted = useRef<string | null>(null);
  const [active, setActive] = useState<string[]>([]);
  const [empty, setEmpty] = useState(!value);

  useEffect(() => {
    if (!editor.current || value === emitted.current) return;
    editor.current.innerHTML = value;
    emitted.current = value;
    setEmpty(!editor.current.textContent?.trim());
  }, [value]);

  /** Which marks apply at the caret, so the toolbar can show them pressed. */
  const syncActive = useCallback(() => {
    if (!editor.current?.contains(document.getSelection()?.anchorNode ?? null)) return;
    setActive(
      [...MARKS, ...BLOCKS]
        .filter((entry) => {
          try {
            return document.queryCommandState(entry.command);
          } catch {
            return false;
          }
        })
        .map((entry) => entry.id)
    );
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, [syncActive]);

  const emit = () => {
    if (!editor.current) return;
    const html = editor.current.innerHTML;
    emitted.current = html;
    setEmpty(!editor.current.textContent?.trim());
    onChange(html);
  };

  const run = (command: string, argument?: string) => {
    editor.current?.focus();
    exec(command, argument);
    syncActive();
    emit();
  };

  const button = ({ id: commandId, label, icon: Icon, command }: Command) => (
    <Toggle
      key={commandId}
      size="sm"
      pressed={active.includes(commandId)}
      // The editor loses its selection the moment the button takes focus.
      onMouseDown={(event) => event.preventDefault()}
      onPressedChange={() => run(command)}
      aria-label={label}
      title={label}
      className="text-text-secondary data-[state=on]:bg-surface-subtle data-[state=on]:text-text-primary size-8"
    >
      <Icon />
    </Toggle>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="border-border-default flex w-fit flex-wrap items-center gap-1 rounded-lg border p-1 shadow-xs">
        {MARKS.map(button)}
        <Separator orientation="vertical" className="bg-border-default mx-1 h-5!" />
        <div className="flex items-center gap-1">
          {COLOURS.map((colour) => (
            <button
              key={colour}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => run("foreColor", colour)}
              aria-label={`Text colour ${colour}`}
              title={`Text colour ${colour}`}
              className="focus-visible:ring-ring/50 size-4 cursor-pointer rounded-full outline-none focus-visible:ring-3"
              style={{ backgroundColor: colour }}
            />
          ))}
        </div>
        <Separator orientation="vertical" className="bg-border-default mx-1 h-5!" />
        {BLOCKS.map(button)}
      </div>

      <div className="relative">
        {empty && placeholder ? (
          <p className="text-text-secondary pointer-events-none absolute top-3 left-3 text-sm">
            {placeholder}
          </p>
        ) : null}
        <div
          id={id}
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Artwork story"
          onInput={emit}
          onBlur={emit}
          onKeyUp={syncActive}
          onMouseUp={syncActive}
          className={cn(
            "bg-admin-field border-border-default text-text-primary focus-visible:border-ring focus-visible:ring-ring/50 min-h-60 rounded-lg border px-3 py-3 text-sm outline-none focus-visible:ring-3",
            "[&_li]:ml-4 [&_li]:list-disc [&_p:not(:last-child)]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4"
          )}
        />
      </div>
    </div>
  );
};
