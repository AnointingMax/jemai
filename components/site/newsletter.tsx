import Link from "next/link";
import { Eyebrow } from "@/components/site/eyebrow";
import { SubscribeForm } from "@/components/site/subscribe-form";

/**
 * Newsletter / Desktop (`240:15599`) — the journal sign-up that closes the
 * editorial sections. Shares the rule + centred 1080px measure the other
 * numbered sections use, so it reads as "06" in the same rhythm.
 */
export const Newsletter = () => (
  <section className="flex w-full flex-col items-center gap-stack-loose pt-8 lg:pt-16">
    <div className="flex w-full max-w-432 flex-col gap-stack-loose px-4 sm:px-6 lg:px-page-gutter">
      <hr className="border-border-strong w-full border-t-3" />

      <div className="flex w-full flex-col items-center py-8">
        <div className="flex w-full max-w-270 flex-col gap-2.5">
          <Eyebrow className="text-eyebrow-lg">06 / The JEMAI Journal</Eyebrow>

          <div className="flex flex-col gap-stack-heading lg:flex-row lg:gap-7.5">
            <h2 className="font-heading text-text-primary flex-1 text-3xl font-bold leading-tight sm:text-h2">
              Stay Close To The World Of JEMAI.
            </h2>

            <div className="flex flex-1 flex-col gap-5">
              <p className="text-body text-text-secondary">
                Receive new furniture and artwork, exhibition invitations and
                considered ideas for the spaces you live and work in.
              </p>

              <SubscribeForm
                id="newsletter-email"
                source="Footer form"
                className="lg:max-w-121"
                fieldClassName="sm:flex-row sm:items-start"
                inputClassName="text-body placeholder:text-text-secondary h-12.5 w-full bg-white px-3.5 lg:max-w-82"
                buttonClassName="h-13 w-full sm:w-37"
              >
                <p className="text-body-xs text-text-secondary">
                  By subscribing, you agree to receive news and updates from
                  JEMAI. You can unsubscribe at any time. View our{" "}
                  <Link href="/privacy" className="underline-offset-2 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </SubscribeForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
