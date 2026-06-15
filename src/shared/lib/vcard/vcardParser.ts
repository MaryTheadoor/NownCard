import type { Phone, Email, Address, SocialLink, Website } from "@/shared/api/types";

function vCardUnescape(val: string): string {
  return val
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseVCardLine(line: string): {
  key: string;
  params: Record<string, string>;
  value: string;
} | null {
  const colonIdx = line.indexOf(":");
  if (colonIdx < 0) return null;
  const left = line.slice(0, colonIdx);
  const value = vCardUnescape(line.slice(colonIdx + 1).trim());
  const parts = left.split(";");
  const key = parts[0].trim().toUpperCase();
  const params: Record<string, string> = {};
  const standaloneTypes: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const p = parts[i].trim();
    const eq = p.indexOf("=");
    if (eq > 0) {
      const pk = p.slice(0, eq).toLowerCase();
      const pv = p.slice(eq + 1);
      params[pk] = pv;
      if (pk === "type") {
        const splitTypes = pv
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        if (splitTypes.length > 0) standaloneTypes.push(...splitTypes);
      }
    } else {
      const lower = p.toLowerCase();
      if (lower && lower !== "pref" && !lower.startsWith("x-")) {
        standaloneTypes.push(lower);
      }
      params[lower] = "true";
    }
  }

  if (standaloneTypes.length > 0 && !params.type) {
    params.type = standaloneTypes[0];
  }
  return { key, params, value };
}

interface ParsedCard {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  company?: string;
  department?: string;
  jobTitle?: string;
  bio?: string;
  birthday?: string;
  anniversary?: string;
  profileImage?: string;
  phones: Phone[];
  emails: Email[];
  websites: Website[];
  addresses: Address[];
  socialLinks: SocialLink[];
}

export function parseVCard(text: string): ParsedCard {
  const result: ParsedCard = {
    phones: [],
    emails: [],
    websites: [],
    addresses: [],
    socialLinks: [],
  };

  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  const unfolded: string[] = [];
  for (const line of lines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      if (unfolded.length > 0)
        unfolded[unfolded.length - 1] += line.trimStart();
    } else {
      unfolded.push(line);
    }
  }

  const itemLabels: Record<string, string> = {};
  for (const raw of unfolded) {
    const parsed = parseVCardLine(raw);
    if (!parsed) continue;
    if (parsed.key.startsWith("ITEM") && parsed.key.includes(".X-ABLABEL")) {
      const itemKey = parsed.key.split(".")[0];
      itemLabels[itemKey] = parsed.value.toLowerCase();
    }
  }

  for (const raw of unfolded) {
    const parsed = parseVCardLine(raw);
    if (!parsed) continue;
    let { key } = parsed;
    const { params, value } = parsed;
    const type = (params.type || "").toLowerCase();

    if (key.startsWith("ITEM")) {
      const dotIdx = key.indexOf(".");
      if (dotIdx > 0) {
        const itemKey = key.slice(0, dotIdx);
        const actualKey = key.slice(dotIdx + 1);
        if (itemLabels[itemKey] && !params.type) {
          params.type = itemLabels[itemKey];
        }
        key = actualKey;
      }
    }

    switch (key) {
      case "N": {
        const parts = value.split(";");
        result.lastName = parts[0]?.trim() || undefined;
        result.firstName = parts[1]?.trim() || undefined;
        result.middleName = parts[2]?.trim() || undefined;
        result.prefix = parts[3]?.trim() || undefined;
        result.suffix = parts[4]?.trim() || undefined;
        break;
      }
      case "FN": {
        const hasFirst = !!result.firstName?.trim();
        const hasLast = !!result.lastName?.trim();
        if (!hasFirst && !hasLast) {
          const parts = value.split(" ");
          result.firstName = parts[0];
          result.lastName = parts.slice(1).join(" ");
        } else if (!hasFirst) {
          const parts = value.split(" ");
          if (parts.length > 1 && parts[0]?.trim()) {
            result.firstName = parts[0].trim();
          }
        } else if (!hasLast) {
          const parts = value.split(" ");
          if (parts.length > 1) {
            result.lastName = parts.slice(1).join(" ");
          }
        }
        break;
      }
      case "ORG": {
        const orgParts = value.split(";");
        result.company = orgParts[0]?.trim() || undefined;
        result.department = orgParts[1]?.trim() || undefined;
        break;
      }
      case "TITLE":
        result.jobTitle = value || undefined;
        break;
      case "ROLE":
        if (!result.jobTitle) result.jobTitle = value || undefined;
        break;
      case "TEL":
        result.phones.push({
          type: (type || "cell") as Phone["type"],
          number: value,
        });
        break;
      case "EMAIL":
        result.emails.push({
          type: (type || "work") as Email["type"],
          address: value,
        });
        break;
      case "URL":
        result.websites.push({ type: type || "Work", url: value });
        break;
      case "ADR": {
        const adrParts = value.split(";");
        const streetParts: string[] = [];
        if (adrParts[2]?.trim()) streetParts.push(adrParts[2].trim());
        if (adrParts[1]?.trim()) streetParts.push(adrParts[1].trim());
        result.addresses.push({
          type: (type || "work") as Address["type"],
          street: streetParts.join(", ") || "",
          city: adrParts[3]?.trim() || "",
          state: adrParts[4]?.trim() || undefined as unknown as string,
          zip: adrParts[5]?.trim() || undefined as unknown as string,
          country: adrParts[6]?.trim() || "",
        });
        break;
      }
      case "BDAY":
        result.birthday = value || undefined;
        break;
      case "ANNIVERSARY":
      case "X-ANNIVERSARY":
        result.anniversary = value || undefined;
        break;
      case "NOTE":
        result.bio = value || undefined;
        break;
      case "PHOTO":
        if (value.startsWith("http")) {
          result.profileImage = value;
        } else if (
          params.encoding?.toLowerCase() === "b" ||
          params.encoding?.toLowerCase() === "base64"
        ) {
          const mime =
            params.type?.toLowerCase() || "image/jpeg";
          const cleanValue = value.replace(/\s/g, "");
          result.profileImage = `data:${mime};base64,${cleanValue}`;
        }
        break;
      case "X-SOCIALPROFILE":
      case "X-SOCIAL":
        result.socialLinks.push({
          platform: params.type || params.service || "Website",
          url: value,
        });
        break;
      case "X-ABDATE": {
        const label = (
          params.xAbLabel ||
          params.label ||
          ""
        ).toLowerCase();
        if (label.includes("birth") || label.includes("bday"))
          result.birthday = value || undefined;
        else if (label.includes("anniversary"))
          result.anniversary = value || undefined;
        else if (!result.birthday)
          result.birthday = value || undefined;
        break;
      }
    }
  }

  return result;
}
