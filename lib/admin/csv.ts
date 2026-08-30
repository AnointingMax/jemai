/**
 * Building a CSV a spreadsheet will open cleanly.
 *
 * This lives on the server because that is where an export is built: the action
 * re-runs the index's own query and turns the rows it gets into a file, so what
 * downloads is what the database holds under those filters rather than whatever
 * a page had already fetched.
 */

/**
 * A field is quoted whenever it holds a comma, a quote or a newline, with inner
 * quotes doubled — the whole of RFC 4180 that a spreadsheet import cares about.
 */
const cell = (value: string) =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export const toCsv = (headers: string[], rows: string[][]) =>
  [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

/** What an export action hands back for the browser to save. */
export type CsvExport = { filename: string; csv: string; };

/** A CSV named for the day it was taken, so two exports do not collide. */
export const csvExport = (name: string, headers: string[], rows: string[][]): CsvExport => ({
  filename: `${name}-${new Date().toISOString().slice(0, 10)}.csv`,
  csv: toCsv(headers, rows),
});
