/**
 * Rules-based scam and safety screening for outgoing chat messages (blueprint 5.3, P0).
 * It runs before a message is sent and only ever warns the sender: it never blocks,
 * rewrites or reports a message on its own.
 */
export type Flag = { kind: "phone" | "upi" | "link" | "crypto" | "money"; title: string; advice: string };

const rules: { flag: Flag; pattern: RegExp }[] = [
  {
    pattern: /[\w.-]{2,}@(?:ok\w+|ybl|upi|paytm|ibl|axl|apl)\b/i,
    flag: { kind: "upi", title: "That looks like a UPI ID", advice: "Seats are paid for in the app, where refunds are guaranteed. Nobody here should ask you to pay them directly." },
  },
  {
    pattern: /\b(?:crypto|bitcoin|usdt|binance|guaranteed returns|investment plan)\b/i,
    flag: { kind: "crypto", title: "Investment talk is a common scam opener", advice: "Members are never asked to invest or trade. If someone raises it with you, report them." },
  },
  {
    pattern: /\b(?:send|transfer|lend|pay)\b[^.?!]*(?:\b(?:money|rupees|rs|upi)\b|₹)/i,
    flag: { kind: "money", title: "This mentions sending money", advice: "Seats are paid for in the app. Be careful about sending money privately to someone you’ve only just met." },
  },
  {
    pattern: /(?:https?:\/\/|www\.|bit\.ly|t\.me\/|wa\.me\/)/i,
    flag: { kind: "link", title: "You’re sharing a link", advice: "Links can take people off the app, where our safety team can’t help. Share it only if the group needs it." },
  },
  {
    pattern: /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/,
    flag: { kind: "phone", title: "That looks like a phone number", advice: "Once it’s sent, everyone in this chat has it. The host’s number is already in Trip Mode if you need to call." },
  },
];

export function scanMessage(text: string): Flag | null {
  return rules.find((rule) => rule.pattern.test(text))?.flag ?? null;
}

export const reportReasons = [
  "Harassment or unwanted advances",
  "Asked for money or shared a payment ID",
  "Fake profile or not who they say they are",
  "May be under 18",
  "Unsafe behaviour on a plan",
  "Something else",
];
