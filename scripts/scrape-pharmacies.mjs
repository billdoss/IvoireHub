import { BASE, SOURCES, fetchHtml, stripTags, parsePeriod, sleep } from "./pharmacies-sources.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function extractPhones(chunk) {
  const phones = new Set();
  const re = /(\+225[\s.\-/]*\d[\d\s.\-/]{7,})|((?:\d{2}[\s.\-/]?){4,5})/g;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const p = m[0].replace(/\s+/g, " ").trim();
    if (p.replace(/\D/g, "").length >= 8) phones.add(p);
  }
  const arr = [...phones];
  return arr.length ? arr.join(" / ").slice(0, 120) : null;
}

function parseListings(html, meta) {
  const text = stripTags(html);
  // Marqueur stable observé : chaque fiche se termine par "Enregistrer Preview"
  const parts = text.split(/Enregistrer/i).slice(1);
  const out = [];
  const seen = new Set();
  for (const raw of parts) {
    const chunk = raw.trim();
    if (!/pharmacie/i.test(chunk.slice(0, 80))) continue;
    const nameMatch = chunk.match(/((?:pharmacie|clinique)[^.\-|]{2,90})/i);
    if (!nameMatch) continue;
    let name = nameMatch[1].replace(/\s+/g, " ").trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (name.length < 5 || name.length > 90) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    let rest = chunk.slice(nameMatch.index + nameMatch[0].length).trim();
    rest = rest.replace(/^(cocody|abidjan|plateau|yopougon|marcory|koumassi)[,\s]*/i, "").trim();
    const address = rest.split(/Afficher la carte|PHARMACIES DE GARDE|Copyright/i)[0].trim().slice(0, 300) || null;
    out.push({
      name, address, phone: extractPhones(chunk),
      commune_name: meta.commune, city_name: meta.city,
      latitude: meta.lat, longitude: meta.lng,
      source: "pagesjaunes.ci", source_url: meta.url,
    });
  }
  return out;
}

async function supabaseUpsert(rows, period) {
  if (!SUPABASE_URL || !SERVICE_KEY) return { inserted: 0, dryRun: true };
  const payload = rows.map((r) => ({
    name: r.name, address: r.address, phone: r.phone,
    commune_name: r.commune_name, city_name: r.city_name,
    latitude: r.latitude, longitude: r.longitude,
    source: r.source, source_url: r.source_url,
    start_date: period.start_date, end_date: period.end_date,
    scraped_at: new Date().toISOString(), is_active: true,
  }));
  let inserted = 0;
  for (let i = 0; i < payload.length; i += 100) {
    const batch = payload.slice(i, i + 100);
    const res = await fetch(SUPABASE_URL + "/rest/v1/pharmacies_garde?on_conflict=name,start_date,end_date", {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(batch),
    });
    if (!res.ok) throw new Error("Upsert " + res.status + ": " + (await res.text()).slice(0, 500));
    const returned = await res.json().catch(() => []);
    console.log("  > batch " + (i / 100 + 1) + ": " + (Array.isArray(returned) ? returned.length : "?") + " ligne(s) confirmees");
    inserted += Array.isArray(returned) ? returned.length : batch.length;
  }
  await fetch(
    SUPABASE_URL + "/rest/v1/pharmacies_garde?end_date=lt." + period.start_date + "&is_active=eq.true",
    {
      method: "PATCH",
      headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: false }),
    }
  );
  return { inserted, dryRun: false };
}

async function main() {
  console.log("Scraping pagesjaunes.ci — pharmacies de garde");
  const indexHtml = await fetchHtml(BASE + "/pharmacies-de-garde/");
  const period = parsePeriod(stripTags(indexHtml));
  console.log("Periode : " + period.start_date + " -> " + period.end_date);
  const all = [];
  for (const src of SOURCES) {
    const url = BASE + "/pharmacies-de-garde-" + src.slug + "/";
    try {
      const html = await fetchHtml(url);
      const rows = parseListings(html, { ...src, url });
      console.log("  - " + src.commune + ": " + rows.length);
      all.push(...rows);
    } catch (e) {
      console.warn("  ! " + src.commune + ": " + e.message);
    }
    await sleep(800);
  }
  const uniq = [...new Map(all.map((r) => [r.name.toLowerCase(), r])).values()];
  console.log("Total unique : " + uniq.length);
  const fs = await import("node:fs");
  fs.writeFileSync("pharmacies-garde.json", JSON.stringify({ period, count: uniq.length, rows: uniq }, null, 2));
  const res = await supabaseUpsert(uniq, period);
  console.log(res.dryRun ? "Dry-run (pas de cles Supabase)." : res.inserted + " ligne(s) vers Supabase.");
}

main().catch((e) => { console.error("Echec scraping :", e); process.exit(1); });
