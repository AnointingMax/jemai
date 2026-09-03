/**
 * The Christmas styling campaign's fixed vocabulary — the decoration areas the
 * request form offers and the property types it asks for. Both ends of the
 * application read these, so they live on the read side rather than beside
 * either screen.
 */

export type DecorationArea = {
  name: string;
  caption: string;
  photo: string;
  /**
   * Room-based areas are counted; a compound is not. This is what decides
   * whether a selection adds a quantity row under the chips.
   */
  counted: boolean;
};

export const decorationAreas: DecorationArea[] = [
  {
    name: "Exterior & Compound",
    caption: "The arrival, frontage and outdoor spaces that set the first note.",
    photo: "/figma/christmas/spaces/exterior.jpg",
    counted: false,
  },
  {
    name: "Living + Dining",
    caption: "The shared rooms where people gather around food and conversation.",
    photo: "/figma/christmas/spaces/living-dining.jpg",
    counted: true,
  },
  {
    name: "Bedrooms",
    caption: "A quieter festive language for private rooms and overnight guests.",
    photo: "/figma/christmas/spaces/bedrooms.jpg",
    counted: true,
  },
  {
    name: "Kitchen",
    caption: "Thoughtful details for the room at the heart of Christmas preparation.",
    photo: "/figma/christmas/spaces/kitchen.jpg",
    counted: true,
  },
];

export const propertyTypes = [
  "Apartment",
  "Detached house",
  "Semi-detached house",
  "Duplex",
  "Bungalow",
  "Commercial space",
  "Other",
] as const;

/** The season's fixed allocation. Availability is this less what has been filed. */
export const seasonCapacity = 20;
