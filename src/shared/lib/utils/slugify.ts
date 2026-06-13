export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateUniqueSlug(firstName: string, lastName: string): string {
  const base = slugify(`${firstName}-${lastName}`);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
