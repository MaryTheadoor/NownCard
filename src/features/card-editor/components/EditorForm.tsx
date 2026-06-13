import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Card as CardUI, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { cardFormSchema, type CardFormData } from "../types";
import { ImageUploader } from "./ImageUploader";
import { ThemePicker } from "./ThemePicker";
import { useSaveCard } from "../hooks";
import type { Card as CardData } from "@/shared/api/types";

interface EditorFormProps {
  card?: CardData | null;
  cardId?: string;
  loading?: boolean;
}

function emptyPhone() {
  return { type: "mobile" as const, number: "" };
}
function emptyEmail() {
  return { type: "work" as const, address: "" };
}
function emptyAddress() {
  return { street: "", city: "", country: "" };
}
function emptySocialLink() {
  return { platform: "", url: "" };
}

export function EditorForm({ card, cardId, loading }: EditorFormProps) {
  const { save, saving } = useSaveCard();

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      prefix: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      nickname: "",
      jobTitle: "",
      department: "",
      company: "",
      bio: "",
      phones: [],
      emails: [],
      addresses: [],
      socialLinks: [],
      theme: "minimal",
      accentColor: "#c9a278",
      isPublic: false,
    },
  });

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = form;

  const phonesField = useFieldArray({ control, name: "phones" });
  const emailsField = useFieldArray({ control, name: "emails" });
  const addressesField = useFieldArray({ control, name: "addresses" });
  const socialLinksField = useFieldArray({ control, name: "socialLinks" });

  useEffect(() => {
    if (card) {
      reset({
        prefix: card.prefix ?? "",
        firstName: card.firstName,
        middleName: card.middleName ?? "",
        lastName: card.lastName,
        suffix: card.suffix ?? "",
        nickname: card.nickname ?? "",
        jobTitle: card.jobTitle ?? "",
        department: card.department ?? "",
        company: card.company ?? "",
        bio: card.bio ?? "",
        phones: card.phones ?? [],
        emails: card.emails ?? [],
        addresses: card.addresses ?? [],
        socialLinks: card.socialLinks ?? [],
        theme: card.theme,
        accentColor: card.accentColor,
        isPublic: card.isPublic,
      });
    }
  }, [card, reset]);

  const onSubmit = async (data: CardFormData) => {
    await save(data, cardId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const theme = watch("theme");
  const accentColor = watch("accentColor");
  const profileImage = watch("profileImage");
  const backgroundImage = watch("backgroundImage");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <CardUI>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input id="prefix" placeholder="Mr./Ms./Dr." {...register("prefix")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input id="suffix" placeholder="Jr./III/Esq." {...register("suffix")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="John" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" placeholder="M." {...register("middleName")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Doe" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input id="nickname" placeholder="Johnny" {...register("nickname")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="Software Engineer" {...register("jobTitle")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Engineering" {...register("department")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." {...register("company")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A brief introduction..." rows={3} {...register("bio")} />
          </div>
        </CardContent>
      </CardUI>

      {/* Phones */}
      <CardUI>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phone Numbers</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={() => phonesField.append(emptyPhone())}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {phonesField.fields.length === 0 && (
            <p className="text-sm text-gray-500">No phone numbers added.</p>
          )}
          {phonesField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <select
                className="h-9 w-28 rounded-md border border-input bg-transparent px-2 text-sm"
                {...register(`phones.${index}.type`)}
              >
                <option value="mobile">Mobile</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="other">Other</option>
              </select>
              <Input placeholder="+1 (555) 000-0000" {...register(`phones.${index}.number`)} />
              <Button type="button" size="icon" variant="ghost" onClick={() => phonesField.remove(index)} aria-label="Remove">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </CardUI>

      {/* Emails */}
      <CardUI>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Email Addresses</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={() => emailsField.append(emptyEmail())}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {emailsField.fields.length === 0 && (
            <p className="text-sm text-gray-500">No email addresses added.</p>
          )}
          {emailsField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <select
                className="h-9 w-28 rounded-md border border-input bg-transparent px-2 text-sm"
                {...register(`emails.${index}.type`)}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
              <Input type="email" placeholder="you@example.com" {...register(`emails.${index}.address`)} />
              <Button type="button" size="icon" variant="ghost" onClick={() => emailsField.remove(index)} aria-label="Remove">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </CardUI>

      {/* Addresses */}
      <CardUI>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Addresses</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={() => addressesField.append(emptyAddress())}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {addressesField.fields.length === 0 && (
            <p className="text-sm text-gray-500">No addresses added.</p>
          )}
          {addressesField.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-lg border p-3">
              <div className="flex justify-between">
                <Input placeholder="Label (e.g. Office, Home)" {...register(`addresses.${index}.label`)} className="flex-1" />
                <Button type="button" size="icon" variant="ghost" onClick={() => addressesField.remove(index)} aria-label="Remove">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <Input placeholder="Street address" {...register(`addresses.${index}.street`)} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="City" {...register(`addresses.${index}.city`)} />
                <Input placeholder="State / Province" {...register(`addresses.${index}.state`)} />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Postal code" {...register(`addresses.${index}.postalCode`)} />
                <Input placeholder="Country" {...register(`addresses.${index}.country`)} />
              </div>
            </div>
          ))}
        </CardContent>
      </CardUI>

      {/* Social Links */}
      <CardUI>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Links</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={() => socialLinksField.append(emptySocialLink())}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialLinksField.fields.length === 0 && (
            <p className="text-sm text-gray-500">No social links added.</p>
          )}
          {socialLinksField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input placeholder="Platform (e.g. LinkedIn)" {...register(`socialLinks.${index}.platform`)} className="w-40" />
              <Input placeholder="https://..." {...register(`socialLinks.${index}.url`)} className="flex-1" />
              <Button type="button" size="icon" variant="ghost" onClick={() => socialLinksField.remove(index)} aria-label="Remove">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </CardUI>

      {/* Design */}
      <CardUI>
        <CardHeader>
          <CardTitle>Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemePicker
            value={theme}
            onChange={(v) => setValue("theme", v)}
            accentColor={accentColor}
            onAccentColorChange={(v) => setValue("accentColor", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploader
              label="Profile Image"
              value={profileImage}
              onChange={(url) => setValue("profileImage", url)}
              storagePath="users"
            />
            <ImageUploader
              label="Background Image"
              value={backgroundImage}
              onChange={(url) => setValue("backgroundImage", url)}
              storagePath="users/backgrounds"
              maxSize={2000}
            />
          </div>
        </CardContent>
      </CardUI>

      {/* Settings */}
      <CardUI>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("isPublic")} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
            <div>
              <p className="text-sm font-medium">Make card public</p>
              <p className="text-xs text-gray-500">Anyone with the link can view your card</p>
            </div>
          </label>
        </CardContent>
      </CardUI>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {cardId ? "Update Card" : "Create Card"}
        </Button>
      </div>
    </form>
  );
}
