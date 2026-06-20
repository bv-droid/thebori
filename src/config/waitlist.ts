/* Waitlist via GetWaitlist (getwaitlist.com).
   TO GO LIVE: put your NUMERIC Waitlist ID in .env.local as
     NEXT_PUBLIC_WAITLIST_ID=12345
   (no code change / rebuild needed beyond a dev restart). Find the number in
   the GetWaitlist dashboard URL (app.getwaitlist.com/waitlists/<ID>), in
   Settings → Waitlist ID, or in the embed snippet (data-waitlist_id="...").
   It is the PUBLIC id — NOT the secret API key (keep that out of the client).
   The custom form stays; GetWaitlist stores leads and returns each signup's
   position, which becomes the Pack ID. */
export const waitlistConfig = {
  waitlistId: Number(process.env.NEXT_PUBLIC_WAITLIST_ID) || 0,
  apiBase: "https://api.getwaitlist.com/api/v1",
};

export function packIdFromPosition(position: number): string {
  return `KZ-AST-${String(Math.max(1, position)).padStart(6, "0")}`;
}
