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
  type: "mobile" | "work" | "home" | "other";
  number: string;
  primary?: boolean;
}

export interface Email {
  type: "work" | "personal" | "other";
  address: string;
  primary?: boolean;
}

export interface Address {
  label?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export type CardTheme = "cosmic" | "warm" | "minimal";

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

  theme: CardTheme;
  accentColor: string;
  profileImage?: string;
  backgroundImage?: string;

  isPublic: boolean;
  isTeamCard?: boolean;
  viewCount: number;
  saveCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id?: string;
  senderUid: string;
  recipientUid: string;
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
  createdAt: Timestamp;
}
