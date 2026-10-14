// Settings: change these two lines (empty string = no filter)
const REGION = 'Scotland';      // e.g. 'London', 'North West', 'Northern Ireland', '' for all
const SECTOR = '';              // SIC prefix ('43') or words ('construction', 'restaurant'), '' for all

const csv = $input.first().json.data;
const lines = csv.trim().split('\n');
const parse = (l) => { const out = []; let cur = '', q = false;
  for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; }
  out.push(cur); return out; };
const head = parse(lines[0]);
const rows = lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])));
const norm = (s) => String(s || '').toLowerCase();
let r = rows;
if (REGION) r = r.filter((x) => norm(x.region).includes(norm(REGION)));
if (SECTOR) r = /^\d+$/.test(SECTOR) ? r.filter((x) => x.sic_code.startsWith(SECTOR)) : r.filter((x) => norm(x.sic_description).includes(norm(SECTOR)));
return r.map((x) => ({ json: {
  rank: Number(x.rank), company: x.company_name, company_number: x.company_number, town: x.town, region: x.region,
  sector: `${x.sic_code} ${x.sic_description}`,
  turnover_2022_gbp: Number(x.turnover_2022_gbp), turnover_2024_gbp: Number(x.turnover_2024_gbp),
  growth_per_year_pct: Number(x.cagr_2022_2024_pct), companies_house: x.companies_house_url,
  summary: `#${x.rank} ${x.company_name} (${x.town}): £${(x.turnover_2022_gbp/1e6).toFixed(1)}m -> £${(x.turnover_2024_gbp/1e6).toFixed(1)}m, +${x.cagr_2022_2024_pct}%/yr`,
} }));