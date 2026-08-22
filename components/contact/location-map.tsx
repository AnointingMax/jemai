"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Lagos Island / Ikoyi, which is the extent the frame's map draws. Note the
 * frame's own address data disagrees with itself — a New York street address
 * under "Visit", "Lagos" under "City" — so this follows the map, not the text.
 */
const CENTER: [number, number] = [3.42, 6.445];
const ZOOM = 12.3;

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * The map panel — 932 x 480 in the frame, held as an aspect ratio so it scales.
 *
 * Renders live Mapbox when `NEXT_PUBLIC_MAPBOX_TOKEN` is set, and otherwise
 * falls back to the still recovered from the frame export, which sits
 * unobstructed at full alpha and so cropped straight out. That keeps the page
 * rendering the designed panel with no token configured, and upgrades in place
 * as soon as one is.
 */
export const LocationMap = () => {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token || !container.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: CENTER,
      zoom: ZOOM,
      attributionControl: true,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.on("error", () => setFailed(true));

    return () => map.remove();
  }, []);

  const live = Boolean(token) && !failed;

  return (
    <div className="relative aspect-[932/480] w-full overflow-hidden">
      {live ? (
        <div ref={container} className="absolute inset-0" />
      ) : (
        <Image
          src="/figma/contact/map.jpg"
          alt="Map showing the JEMAI showroom location"
          fill
          sizes="(min-width: 1024px) 932px, 100vw"
          className="object-cover"
        />
      )}
    </div>
  );
};
