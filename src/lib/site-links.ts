import { DEFAULT_SETTINGS } from "./constants";

export type SiteSettings = Record<string, string>;

export function getSiteSetting(settings: SiteSettings | null | undefined, key: string) {
  return settings?.[key] || DEFAULT_SETTINGS[key] || "";
}

export function buildTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function buildWhatsAppHref(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function buildMapHref(settings: SiteSettings | null | undefined) {
  return getSiteSetting(settings, "map_link");
}