import { type Timestamp } from "firebase/firestore";

export interface User {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  plan: "free" | "pro" | "business";
  isAdmin: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stripeCustomerId?: string;
}

export interface Phone {
  type: "mobile" | "work" | "home" | "other" | string;
  number: string;
  primary?: boolean;
}

export interface Email {
  type: "work" | "personal" | "other" | string;
  address: string;
  primary?: boolean;
}

export interface Address {
  label?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  zip?: string;
  country: string;
  type?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PaymentLink {
  platform: string;
  url: string;
}

export interface Website {
  type?: string;
  url: string;
}

export type CardTheme = "cosmic" | "warm" | "minimal";

export type CardNameLayout = "personal" | "business";
export type ProfileShape = "circle" | "rounded" | "square";
export type ProfileSize = "small" | "medium" | "large";
export type QrMode = "url" | "vcard";

export interface Card {
  id: string;
  ownerUid: string;
  slug: string;

  prefix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  nickname?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;

  phones: Phone[];
  emails: Email[];
  addresses: Address[];
  socialLinks: SocialLink[];
  paymentLinks?: PaymentLink[];
  websites?: Website[];

  birthday?: string;
  anniversary?: string;

  theme: CardTheme;
  accentColor: string;
  cardTheme?: "light" | "dark";
  cardBgColor?: string;
  textColor?: string;

  profileImage?: string;
  backgroundImage?: string;
  bgOpacity?: number;
  bgPosition?: string;
  bgSize?: string;
  bgZoom?: number;
  bgRotation?: number;
  bgDisplayMode?: "full" | "header";

  fontFamily?: string;
  fontSizeScale?: number;
  customFontUrl?: string;

  nameLayout?: CardNameLayout;
  profileShape?: ProfileShape;
  profileSize?: ProfileSize;

  backBackgroundImage?: string;
  backBgPosition?: string;
  backBgRotation?: number;

  hideNavbar?: boolean;
  hideLogo?: boolean;
  qrMode?: QrMode;

  isPublic: boolean;
  isTeamCard?: boolean;
  viewCount: number;
  saveCount: number;

  bioPosition?: "front" | "back";
  contactsPosition?: "front" | "back";
  socialsPosition?: "front" | "back";
  paymentsPosition?: "front" | "back";

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id?: string;
  senderUid: string;
  senderName?: string;
  senderEmail?: string;
  recipientUid: string;
  cardId?: string;
  cardSlug: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface DailyAnalytics {
  cardId: string;
  date: string;
  views: number;
  uniqueViews: number;
  saves: number;
  flips?: number;
  device?: Record<string, number>;
  referrer?: Record<string, number>;
  createdAt: Timestamp;
}
