import type { Card } from "@/shared/api/types";

function escapeVCard(value: string): string {
  return value.replace(/[,;\\\n]/g, "\\$&");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  while (remaining.length > 75) {
    parts.push(remaining.slice(0, 75));
    remaining = " " + remaining.slice(75);
  }
  if (remaining) parts.push(remaining);
  return parts.join("\r\n");
}

export function generateVCard(card: Card): string {
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:4.0");

  const fullName = [card.prefix, card.firstName, card.middleName, card.lastName, card.suffix]
    .filter(Boolean)
    .join(" ");
  lines.push(`FN:${escapeVCard(fullName)}`);

  const lastName = [card.prefix, card.lastName].filter(Boolean).join(" ");
  const firstNameFields = [card.firstName, card.middleName].filter(Boolean).join(" ");
  lines.push(`N:${escapeVCard(lastName)};${escapeVCard(firstNameFields)};;;`);

  if (card.nickname) {
    lines.push(`NICKNAME:${escapeVCard(card.nickname)}`);
  }

  if (card.jobTitle) {
    lines.push(`TITLE:${escapeVCard(card.jobTitle)}`);
  }

  if (card.company) {
    let org = card.company;
    if (card.department) org += `;${card.department}`;
    lines.push(`ORG:${escapeVCard(org)}`);
  }

  if (card.bio) {
    lines.push(`NOTE:${escapeVCard(card.bio)}`);
  }

  for (const phone of card.phones) {
    const types: string[] = [];
    if (phone.primary) types.push("PREF");
    switch (phone.type) {
      case "mobile": types.push("CELL"); break;
      case "work": types.push("WORK"); break;
      case "home": types.push("HOME"); break;
    }
    lines.push(`TEL;TYPE=${types.join(",")}:${escapeVCard(phone.number)}`);
  }

  for (const email of card.emails) {
    const types: string[] = [];
    if (email.primary) types.push("PREF");
    switch (email.type) {
      case "work": types.push("WORK"); break;
      case "personal": types.push("HOME"); break;
    }
    lines.push(`EMAIL${types.length ? `;TYPE=${types.join(",")}` : ""}:${escapeVCard(email.address)}`);
  }

  for (const addr of card.addresses) {
    const label = addr.label ? `;LABEL="${escapeVCard(addr.label)}"` : "";
    lines.push(
      `ADR${label};;${escapeVCard(addr.street)};${escapeVCard(addr.city)};${escapeVCard(addr.state ?? "")};${escapeVCard(addr.postalCode ?? "")};${escapeVCard(addr.country)}`,
    );
  }

  for (const link of card.socialLinks) {
    const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
    lines.push(`URL;TYPE=${escapeVCard(label)}:${escapeVCard(link.url)}`);
  }

  if (card.profileImage) {
    lines.push(`PHOTO;VALUE=URI:${escapeVCard(card.profileImage)}`);
  }

  lines.push(`REV:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`);
  lines.push("END:VCARD");

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function downloadVCard(card: Card, fileName?: string): void {
  const vcard = generateVCard(card);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const name = fileName ?? `${card.firstName}-${card.lastName}`.toLowerCase().replace(/\s+/g, "-");
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
