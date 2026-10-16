/** Sources + helpers du scraper pagesjaunes.ci (importé par scrape-pharmacies.mjs) */
export const BASE = "https://pagesjaunes.ci";

export const SOURCES = [
  { slug: "abobo", commune: "Abobo", city: "Abidjan", lat: 5.4167, lng: -4.0167 },
  { slug: "adjame", commune: "Adjamé", city: "Abidjan", lat: 5.35, lng: -4.0333 },
  { slug: "anyama", commune: "Anyama", city: "Abidjan", lat: 5.5, lng: -4.05 },
  { slug: "attecoube", commune: "Attécoubé", city: "Abidjan", lat: 5.35, lng: -4.05 },
  { slug: "bingerville", commune: "Bingerville", city: "Bingerville", lat: 5.35, lng: -3.8833 },
  { slug: "brofodoume", commune: "Brofodoumé", city: "Brofodoumé", lat: 5.4333, lng: -3.9167 },
  { slug: "cocody", commune: "Cocody", city: "Abidjan", lat: 5.35, lng: -3.9833 },
  { slug: "koumassi", commune: "Koumassi", city: "Abidjan", lat: 5.3, lng: -3.95 },
  { slug: "marcory", commune: "Marcory", city: "Abidjan", lat: 5.3, lng: -3.9833 },
  { slug: "plateau", commune: "Plateau", city: "Abidjan", lat: 5.3167, lng: -4.0167 },
  { slug: "port-bouet", commune: "Port-Bouët", city: "Abidjan", lat: 5.25, lng: -3.95 },
  { slug: "treichville", commune: "Treichville", city: "Abidjan", lat: 5.2833, lng: -4.0 },
  { slug: "yopougon", commune: "Yopougon", city: "Abidjan", lat: 5.3333, lng: -4.0833 },
];

const MONTHS_FR = {
  janvier: 0, fevrier: 1, "février": 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, "août": 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, "décembre": 11,
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchHtml(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IvoireHubBot/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!res.ok) throw new Error("HTTP " + res.status + " pour " + url);
      return await res.text();
    } catch (e) {
      lastErr = e;
      await sleep(1500 * (i + 1));
    }
  }
  throw lastErr;
}

export function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** "SEMAINE DU SAMEDI 10 OCTOBRE AU VENDREDI 16 OCTOBRE 2026" -> {start_date,end_date} */
export function parsePeriod(text) {
  const re = /SEMAINE DU SAMEDI\s+(\d{1,2})\s+(\S+)\s+AU VENDREDI\s+(\d{1,2})\s+(\S+)\s+(\d{4})/i;
  const m = text.match(re);
  const fmt = (d) => d.toISOString().slice(0, 10);
  if (!m) {
    const d = new Date();
    const diffToSat = (d.getDay() + 1) % 7;
    const sat = new Date(d);
    sat.setDate(d.getDate() - diffToSat);
    const fri = new Date(sat);
    fri.setDate(sat.getDate() + 6);
    return { start_date: fmt(sat), end_date: fmt(fri) };
  }
  const d1 = parseInt(m[1], 10);
  const d2 = parseInt(m[3], 10);
  const m1 = MONTHS_FR[m[2].toLowerCase()] ?? new Date().getMonth();
  const m2 = MONTHS_FR[m[4].toLowerCase()] ?? m1;
  const y = parseInt(m[5], 10);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    start_date: y + "-" + pad(m1 + 1) + "-" + pad(d1),
    end_date: y + "-" + pad(m2 + 1) + "-" + pad(d2),
  };
}
