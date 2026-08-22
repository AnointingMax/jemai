/**
 * The checkout frames are a block pasted in from another design system — the
 * same story as the cart drawer and the catalogue's Load-more band. Every value
 * here was sampled off the frame export and has no JEMAI counterpart within
 * reach, so they are literal hex rather than invented tokens. Worth raising
 * with the designer.
 *
 * Everything that *does* map to a token is used as one: the payment box's
 * hairline is `border-border-default` (#dad7d7 composited), Pay Now and the
 * modal's primary buttons are `action-primary`, the modal's info block is
 * `surface-subtle`, its alert is `surface-tint` on `border-action`, and every
 * heading is `text-primary`.
 */

/** Hairline around the delivery fields, the radio and the checkboxes. */
export const fieldBorder = "#e3e1e1";
/** Placeholder copy inside the fields. Also hard-coded in `delivery-form.tsx`
 *  and `order-summary.tsx` as `placeholder:text-[#808080]`, which Tailwind
 *  needs as a literal class. */
export const placeholderInk = "#808080";
/** The group labels — Contact, Billing Address, Order notes. */
export const labelInk = "#656565";
/** Primary copy in this flow. Matches the cart drawer's `inkStrong`. */
export const inkStrong = "#202025";
/** Secondary copy — "Color: …" on a line, the Payment sub-line. */
export const inkMuted = "#636366";
/** "edit cart", the only blue on the site. */
export const linkBlue = "#016fd0";
