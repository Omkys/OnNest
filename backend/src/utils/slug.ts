import { customAlphabet } from "./nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(alphabet, 8);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function generateOrganizationId(): string {
  return `org_${nanoid()}`;
}

export function generateUniqueSlug(base: string): string {
  const slug = slugify(base) || "org";
  return `${slug}-${nanoid().slice(0, 4)}`;
}
