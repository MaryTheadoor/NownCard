import { z } from "zod";

export const phoneSchema = z.object({
  type: z.enum(["mobile", "work", "home", "other"]),
  number: z.string().min(1, "Phone number is required"),
  primary: z.boolean().optional(),
});

export const emailSchema = z.object({
  type: z.enum(["work", "personal", "other"]),
  address: z.string().email("Invalid email"),
  primary: z.boolean().optional(),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
});

export const themeOptions = ["cosmic", "warm", "minimal"] as const;

export const cardFormSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  phones: z.array(phoneSchema),
  emails: z.array(emailSchema),
  addresses: z.array(addressSchema),
  socialLinks: z.array(socialLinkSchema),
  theme: z.enum(themeOptions),
  accentColor: z.string(),
  profileImage: z.string().optional(),
  backgroundImage: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSizeScale: z.number().optional(),
  customFontUrl: z.string().optional(),
  isPublic: z.boolean(),
});

export type CardFormData = z.infer<typeof cardFormSchema>;
export type PhoneField = z.infer<typeof phoneSchema>;
export type EmailField = z.infer<typeof emailSchema>;
export type AddressField = z.infer<typeof addressSchema>;
export type SocialLinkField = z.infer<typeof socialLinkSchema>;
