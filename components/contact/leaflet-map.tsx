"use client";

import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Lagos Island, which is the extent the frame's map draws and the city the
 * "Where to find us" block names.
 *
 * **The design's address data contradicts itself** — "Visit" on this page gives
 * a New York street address, "Neighborhood" gives Murray Hill (also Manhattan),
 * "City" gives Lagos, and the footer carries an Abuja address. Everything the
 * map needs is in this one constant, so pointing it at the real address is a
 * one-line change.
 */
export const LOCATION = {
  lat: 8.9978,
  lng: 7.5087,
  zoom: 17.5,
  label: "JEMAI, Lagos Island, Lagos",
};

/**
 * Leaflet's default marker resolves its icon from relative image paths, which
 * bundlers break. A `divIcon` sidesteps that entirely and lets the pin carry
 * the brand maroon rather than shipping a PNG.
 */
const pin = divIcon({
  className: "",
  html: `<span style="
    display:block;width:18px;height:18px;border-radius:9999px;
    background:#701926;border:3px solid #f7f5f3;
    box-shadow:0 0 0 1px rgba(22,5,7,.25);
  "></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const LeafletMap = () => (
  <MapContainer
    center={[LOCATION.lat, LOCATION.lng]}
    zoom={LOCATION.zoom}
    // A full-width map that swallows page scroll is hostile; zoom stays on the
    // controls and on double-click.
    scrollWheelZoom={false}
    className="h-full w-full"
    aria-label={`Map showing ${LOCATION.label}`}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[LOCATION.lat, LOCATION.lng]} icon={pin}>
      <Popup>{LOCATION.label}</Popup>
    </Marker>
  </MapContainer>
);

export default LeafletMap;
