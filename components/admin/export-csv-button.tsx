"use client";

import { Button } from "@/components/ui/button";

/**
 * A field is quoted whenever it holds a comma, a quote or a newline, with inner
 * quotes doubled — the whole of RFC 4180 that a spreadsheet import cares about.
 */
const cell = (value: string) =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const toCsv = (headers: string[], rows: string[][]) =>
  [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

/**
 * Downloads the list as a CSV the marketing tools can take. The export is built
 * in the browser rather than fetched, so it costs no round trip and always
 * matches the rows the reader is looking at.
 */
export const ExportCsvButton = ({
  filename,
  headers,
  rows,
}: {
  filename: string;
  headers: string[];
  rows: string[][];
}) => {
  const download = () => {
    // Excel reads a bare UTF-8 CSV as the system codepage and mangles anything
    // non-ASCII; the BOM is what makes it read the file as UTF-8.
    const blob = new Blob(["﻿", toCsv(headers, rows)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} size="lg" className="h-11 shrink-0 px-5 text-sm">
      Export CSV
    </Button>
  );
};
