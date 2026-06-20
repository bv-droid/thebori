import { waitlistConfig } from "@/config/waitlist";
import { FOUNDING_SEED } from "./useWaitlistCount";
import { getAttribution } from "./attribution";

export type WaitlistResult = {
  position: number;
  referral: string;
  demo: boolean;
};

/* Submit a signup to GetWaitlist; returns the position (→ Pack ID) + referral link.
   When no waitlistId is configured yet, returns a demo position so the UX is testable.
   Attaches UTM + inbound referral so signups are attributed and the referrer credited. */
export async function submitWaitlist(
  email: string,
  name: string,
): Promise<WaitlistResult> {
  const attr = getAttribution();

  if (!waitlistConfig.waitlistId) {
    await new Promise((r) => setTimeout(r, 700));
    // demo position sits just past the displayed counter (seed) so the assigned
    // Pack ID stays plausible against the scarcity number the visitor just saw
    return {
      position: FOUNDING_SEED + 1 + Math.floor(Math.random() * 6),
      referral: "",
      demo: true,
    };
  }

  const res = await fetch(`${waitlistConfig.apiBase}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      waitlist_id: waitlistConfig.waitlistId,
      ...(attr.ref ? { referral_link: attr.ref } : {}),
      metadata: { name, ...attr },
    }),
  });
  if (!res.ok) throw new Error(`waitlist signup failed (${res.status})`);
  const data = await res.json();
  const position: number =
    data.priority ?? data.total_signups ?? data.total_users ?? 0;
  return { position, referral: data.referral_link ?? "", demo: false };
}
