import { adminsWithPermission } from "@/lib/admin/admins";
import type { AdminPermission } from "@/lib/admin/auth/permissions";
import { naira } from "@/lib/admin/content";
import type { AdminConsultation } from "@/lib/admin/consultation-record";
import type { AdminEnquiry } from "@/lib/admin/enquiry-record";
import { consultationWindow } from "@/lib/admin/consultation-record";
import { describeItem, type AdminOrder } from "@/lib/admin/order-record";
import type { Registration } from "@/lib/admin/registration-record";
import env from "@/lib/env";
import { renderEmail, type SummaryRow } from "@/lib/mail/render";
import { notify, type Message } from "@/lib/mail/send";

/** Every mail that points somewhere points into this site. */
const url = (path: string) => `${env.APP_URL}${path}`;

const notifyDesk = async (permission: AdminPermission, message: Omit<Message, "to">) => {
  const desk = await adminsWithPermission(permission);

  if (!desk.length) {
    console.warn(`[mail] No active admin holds "${permission}" — "${message.subject}" went nowhere.`);
    return;
  }

  await Promise.all(desk.map((admin) => notify({ ...message, to: admin.email })));
};

const orderLines = (order: AdminOrder): SummaryRow[] => {
  const described = order.items.map((item) => {
    const variant = describeItem(item);
    return {
      label: `${item.name} × ${item.quantity}${variant ? ` (${variant})` : ""}`,
      value: naira(item.unitPrice * item.quantity),
    };
  });

  return [
    ...described,
    { label: "Subtotal", value: naira(order.subtotal) },
    { label: "Delivery", value: naira(order.shipping) },
    { label: "Total", value: naira(order.total), strong: true },
  ];
};

/**
 * The receipt, sent once — when an order actually crosses into `Paid`, which is
 * why `settleOrder` sends it rather than the two callers that race to settle.
 */
export const sendOrderConfirmation = async (order: AdminOrder) => {
  const { html, text } = renderEmail({
    preview: `We have your payment for order ${order.number}.`,
    heading: "Your order is confirmed",
    paragraphs: [
      `Thank you, ${order.customer.split(" ")[0]}. We have your payment, and order ${order.number} is now with our makers.`,
      "We will write again the moment it leaves us. Keep this message — the order number is what to quote if you need us.",
    ],
    summary: { title: `Order ${order.number}`, rows: orderLines(order) },
    footnotes: [
      `Delivering to: ${order.address}`,
      "Questions about this order? Reply to this message and it reaches the team.",
    ],
  });

  await notify({ to: order.email, subject: `Order ${order.number} is confirmed`, html, text });
};

/** The dispatch note. Sent on the move into "Ready for dispatch", once. */
export const sendOrderDispatched = async (order: AdminOrder) => {
  const { html, text } = renderEmail({
    preview: `Order ${order.number} is on its way.`,
    heading: "Your order is on its way",
    paragraphs: [
      `Order ${order.number} has left us and is on its way to you.`,
      "Our delivery team will call ahead on the number you gave us to agree a time.",
    ],
    summary: {
      title: `Order ${order.number}`,
      rows: [
        ...order.items.map((item) => ({
          label: item.name,
          value: `× ${item.quantity}`,
        })),
        { label: "Delivering to", value: order.address },
      ],
    },
    footnotes: ["Need to change the delivery details? Reply to this message and we will sort it."],
  });

  await notify({ to: order.email, subject: `Order ${order.number} is on its way`, html, text });
};

/**
 * A place at a show, confirmed. Free places are confirmed the moment they are
 * asked for; paid ones only once Paystack says the money arrived.
 */
export const sendRegistrationConfirmed = async (registration: Registration) => {
  const paid = registration.amountPaid ?? 0;

  const { html, text } = renderEmail({
    preview: `Your place at ${registration.exhibitionTitle} is confirmed.`,
    heading: "Your place is confirmed",
    paragraphs: [
      `Thank you, ${registration.name.split(" ")[0]}. We have you down for ${registration.exhibitionTitle}.`,
      "Bring this message with you — the reference below is what we look you up by at the door.",
    ],
    summary: {
      title: "Your registration",
      rows: [
        { label: "Exhibition", value: registration.exhibitionTitle },
        { label: "Name", value: registration.name },
        { label: "Reference", value: registration.reference, strong: true },
        { label: "Admission", value: paid > 0 ? naira(paid) : "Free" },
      ],
    },
    action: { label: "See the programme", url: url("/exhibitions") },
    footnotes: ["Cannot make it after all? Reply to this message and we will free the place up."],
  });

  await notify({
    to: registration.email,
    subject: `You're registered for ${registration.exhibitionTitle}`,
    html,
    text,
  });
};

/** The acknowledgement behind the artwork enquiry modal's "we will be in touch". */
export const sendEnquiryReceived = async (enquiry: AdminEnquiry) => {
  const { html, text } = renderEmail({
    preview: `We have your enquiry about ${enquiry.artworkTitle}.`,
    heading: "We have your enquiry",
    paragraphs: [
      `Thank you, ${enquiry.name.split(" ")[0]}. Your enquiry is with the JEMAI art team and someone will come back to you shortly.`,
      "This is what you sent us:",
    ],
    summary: {
      title: `Enquiry ${enquiry.reference}`,
      rows: [
        { label: "Artwork", value: enquiry.artworkTitle },
        ...(enquiry.artist ? [{ label: "Artist", value: enquiry.artist }] : []),
        { label: "Your message", value: enquiry.message },
      ],
    },
    footnotes: ["Anything to add? Reply to this message and it reaches the same team."],
  });

  await notify({
    to: enquiry.email,
    subject: `Your enquiry about ${enquiry.artworkTitle}`,
    html,
    text,
  });
};

/** The acknowledgement behind the consultation form's "we'll be in touch". */
export const sendConsultationReceived = async (request: AdminConsultation) => {
  const timeline = consultationWindow(request);

  const { html, text } = renderEmail({
    preview: "We have your consultation brief.",
    heading: "We have your brief",
    paragraphs: [
      `Thank you, ${request.name.split(" ")[0]}. Your brief is with our design team, and we will be in touch to arrange your first conversation.`,
      "This is what we have from you:",
    ],
    summary: {
      title: `Request ${request.reference}`,
      rows: [
        { label: "Project", value: request.projectType },
        ...(timeline ? [{ label: "Timeline", value: timeline }] : []),
        ...(request.budget ? [{ label: "Budget", value: request.budget }] : []),
        { label: "Your summary", value: request.summary },
      ],
    },
    footnotes: ["Anything to add before we speak? Reply to this message."],
  });

  await notify({ to: request.email, subject: "Your JEMAI consultation request", html, text });
};

/** The list's one-line welcome, sent only to an address that was not on it. */
export const sendSubscriptionWelcome = async (subscriber: { email: string; name: string; }) => {
  const { html, text } = renderEmail({
    preview: "You're on the JEMAI list.",
    heading: "You're on the list",
    paragraphs: [
      subscriber.name ? `Thank you for signing up, ${subscriber.name.split(" ")[0]}.` : "Thank you for signing up.",
      "You will hear from us when a new collection lands, a show opens, or a piece we are proud of leaves the workshop. Not often, and never noise.",
    ],
    action: { label: "Browse the collection", url: url("/furniture") },
    footnotes: ["Signed up by mistake? Reply to this message and we will take you off the list."],
  });

  await notify({ to: subscriber.email, subject: "You're on the JEMAI list", html, text });
};

/**
 * What a new colleague gets when an account is opened for them. Deliberately
 * without the password: whoever opened the account typed it and reads it back
 * to them in person, and a password that has travelled by email is one that has
 * been written down somewhere neither of them controls.
 */
export const sendAdminWelcome = async (admin: { name: string; email: string; }) => {
  const { html, text } = renderEmail({
    preview: "Your JEMAI admin account is open.",
    heading: "Your admin account is open",
    paragraphs: [
      `${admin.name.split(" ")[0]}, an account has been opened for you on the JEMAI console.`,
      "Sign in with this address and the password whoever set it up gave you. If you do not have it, use “Forgot password” on the sign-in screen and set your own.",
    ],
    summary: {
      title: "Your account",
      rows: [{ label: "Email address", value: admin.email }],
    },
    action: { label: "Sign in to the console", url: url("/admin/login") },
    footnotes: [
      "If you were not expecting this, ignore it — nobody can sign in as you without the password.",
    ],
  });

  await notify({ to: admin.email, subject: "Your JEMAI admin account", html, text });
};

/**
 * The console's own copy of a paid order, sent to whoever works the orders
 * section. It goes out on the same settlement as the buyer's receipt: an order
 * that has not been paid for is not yet work, and the screen already lists it.
 */
export const notifyDeskOfOrder = async (order: AdminOrder) => {
  const { html, text } = renderEmail({
    preview: `${order.customer} paid for ${order.number}.`,
    heading: `New order ${order.number}`,
    paragraphs: [
      `${order.customer} has paid for ${order.number}. It is in the console as New and waiting to be moved into production.`,
    ],
    summary: {
      title: "The order",
      rows: [
        { label: "Customer", value: order.customer },
        { label: "Email", value: order.email },
        { label: "Phone", value: order.phone },
        { label: "Deliver to", value: order.address },
        ...orderLines(order),
      ],
    },
    action: { label: "Open the order book", url: url("/admin/orders") },
  });

  await notifyDesk("orders", { subject: `New order ${order.number} — ${order.customer}`, html, text });
};

/** The door list's copy of a confirmed place, for whoever runs the programme. */
export const notifyDeskOfRegistration = async (registration: Registration) => {
  const paid = registration.amountPaid ?? 0;

  const { html, text } = renderEmail({
    preview: `${registration.name} is registered for ${registration.exhibitionTitle}.`,
    heading: "New exhibition registration",
    paragraphs: [
      `${registration.name} has a confirmed place at ${registration.exhibitionTitle}.`,
    ],
    summary: {
      title: "The registration",
      rows: [
        { label: "Exhibition", value: registration.exhibitionTitle },
        { label: "Name", value: registration.name },
        { label: "Email", value: registration.email },
        { label: "Phone", value: registration.phone },
        { label: "Reference", value: registration.reference },
        { label: "Admission", value: paid > 0 ? naira(paid) : "Free" },
      ],
    },
    action: { label: "Open the programme", url: url("/admin/exhibitions") },
  });

  await notifyDesk("exhibitions", {
    subject: `New registration — ${registration.exhibitionTitle}`,
    html,
    text,
  });
};

/** The brief queue's copy of a new request, for whoever triages it. */
export const notifyDeskOfConsultation = async (request: AdminConsultation) => {
  const timeline = consultationWindow(request);

  const { html, text } = renderEmail({
    preview: `${request.name} has sent a consultation brief.`,
    heading: "New consultation request",
    paragraphs: [`${request.name} has sent a brief. It is in the console as New.`],
    summary: {
      title: `Request ${request.reference}`,
      rows: [
        { label: "Name", value: request.name },
        { label: "Email", value: request.email },
        ...(request.phone ? [{ label: "Phone", value: request.phone }] : []),
        { label: "Project", value: request.projectType },
        ...(timeline ? [{ label: "Timeline", value: timeline }] : []),
        ...(request.budget ? [{ label: "Budget", value: request.budget }] : []),
        { label: "Summary", value: request.summary },
      ],
    },
    action: { label: "Open the request", url: url("/admin/consultation-requests") },
  });

  await notifyDesk("consultation-requests", {
    subject: `New consultation request — ${request.name}`,
    html,
    text,
  });
};
