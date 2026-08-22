"use client";

import dynamic from "next/dynamic";

/**
 * The map panel — 932 x 480 in the frame, held as an aspect ratio so it scales.
 *
 * Leaflet touches `window` at module scope, so the map itself is loaded with
 * `ssr: false`. That option is only legal inside a Client Component, which is
 * the whole reason this thin wrapper exists: the Contact page stays a Server
 * Component (and keeps its `metadata` export) and only this boundary is client.
 */
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="bg-surface-subtle h-full w-full animate-pulse"
    />
  ),
});

export const LocationMap = () => (
  /* `overflow-hidden` matters: Leaflet always paints tiles past the edges of
     its pane, and without the clip they push the page wider on mobile.
     `min-h` is a derived-responsive call — the frame has no mobile layout, and
     932/480 leaves the map only 184px tall at 390. */
  <div className="relative aspect-[932/480] w-full min-h-65 overflow-hidden">
    <LeafletMap />
  </div>
);
