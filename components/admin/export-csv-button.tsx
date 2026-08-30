"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import type { CsvExport } from "@/lib/admin/csv";

/**
 * Downloads the list as a CSV the marketing and door tools can take.
 *
 * The file is built by a server action that re-runs the index's own query under
 * the filters in the URL, so the export is the database's answer rather than a
 * serialisation of whatever rows a page had already fetched — it is not limited
 * to the page in front of the reader, and it cannot drift from what a filtered
 * screen claims to be showing.
 */
export const ExportCsvButton = ({
  onExport,
}: {
  onExport: () => Promise<ActionResult<CsvExport>>;
}) => {
  const [exporting, startExport] = useTransition();

  const download = () =>
    startExport(async () => {
      const result = await onExport();

      if (result.error) {
        toast.error(result.message);
        return;
      }

      // Excel reads a bare UTF-8 CSV as the system codepage and mangles anything
      // non-ASCII; the BOM is what makes it read the file as UTF-8.
      const blob = new Blob(["﻿", result.data.csv], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.filename;
      link.click();
      URL.revokeObjectURL(url);
    });

  return (
    <Button
      onClick={download}
      size="lg"
      disabled={exporting}
      className="h-11 shrink-0 px-5 text-sm"
    >
      {exporting ? "Preparing…" : "Export CSV"}
    </Button>
  );
};
