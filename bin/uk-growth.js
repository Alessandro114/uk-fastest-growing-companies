#!/usr/bin/env node
// uk-growth: query the SCALA Growth 100 UK dataset (fastest-growing independent UK SMEs, FY2022-FY2024).
// Zero dependencies, offline, JSON output by default so AI agents can parse it. Data: ../data/growth100-uk-2022-2024.json
'use strict';
const path = require('path');
const fs = require('fs');

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'growth100-uk-2022-2024.json'), 'utf8'));
const ROWS = DATA.companies;

const HELP = `uk-growth — fastest-growing independent UK SMEs (SCALA Growth 100 UK, FY2022 to FY2024)

Usage:
  uk-growth top [--limit N]                         Top N companies by growth (default 10)
  uk-growth filter [--region R] [--sector S] [--min-turnover GBP] [--max-turnover GBP] [--limit N]
                                                    R: region name (e.g. "Scotland", "London", "North West")
                                                    S: SIC code prefix ("43", "56101") or words ("construction", "restaurant")
  uk-growth company <name or company number>        One company, with filed turnover and Companies House link
  uk-growth regions                                 Count of companies per region
  uk-growth sectors                                 Count of companies per SIC division (2 digits)
  uk-growth about                                   Source, method, licence
Add --table for a human-readable table instead of JSON.

Source: Companies House filed accounts. Method: ${DATA.method_url}`;

function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      o[k] = v;
    } else o._.push(a);
  }
  return o;
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function slim(r) {
  return {
    rank: r.rank, company_name: r.company_name, company_number: r.company_number, town: r.town, region: r.region,
    sic: `${r.sic_code} ${r.sic_description}`, turnover_2022_gbp: r.turnover_gbp['2022'], turnover_2024_gbp: r.turnover_gbp['2024'],
    cagr_2022_2024_pct: r.cagr_2022_2024_pct, companies_house_url: r.companies_house_url,
  };
}

function out(rows, o, note) {
  if (o.table) {
    for (const r of rows) {
      if (r.rank !== undefined) {
        console.log(`#${String(r.rank).padEnd(4)}${r.company_name.padEnd(46).slice(0, 46)} ${String(r.town || '').padEnd(16).slice(0, 16)} £${(r.turnover_2022_gbp / 1e6).toFixed(1)}m -> £${(r.turnover_2024_gbp / 1e6).toFixed(1)}m  +${r.cagr_2022_2024_pct}%/yr`);
      } else console.log(Object.values(r).join('  '));
    }
    if (note) console.log(`\n${note}`);
    return;
  }
  console.log(JSON.stringify({ results: rows, count: rows.length, source: DATA.source, method: DATA.method_url, note }, null, 1));
}

function main() {
  const o = args(process.argv.slice(2));
  const cmd = o._[0];
  const limit = Math.max(1, parseInt(o.limit || 10, 10));
  if (!cmd || cmd === 'help' || o.help) return console.log(HELP);
  if (cmd === 'about') {
    const { companies, ...meta } = DATA;
    return console.log(JSON.stringify({ ...meta, companies_count: companies.length }, null, 1));
  }
  if (cmd === 'top') return out(ROWS.slice(0, limit).map(slim), o);
  if (cmd === 'filter') {
    let r = ROWS;
    if (o.region) r = r.filter((x) => norm(x.region).includes(norm(o.region)));
    if (o.sector) {
      const s = String(o.sector);
      r = /^\d+$/.test(s) ? r.filter((x) => x.sic_code.startsWith(s)) : r.filter((x) => norm(x.sic_description).includes(norm(s)));
    }
    if (o['min-turnover']) r = r.filter((x) => x.turnover_gbp['2024'] >= Number(o['min-turnover']));
    if (o['max-turnover']) r = r.filter((x) => x.turnover_gbp['2024'] <= Number(o['max-turnover']));
    return out(r.slice(0, limit).map(slim), o, r.length > limit ? `${r.length} matches, showing ${limit}; use --limit` : undefined);
  }
  if (cmd === 'company') {
    const q = norm(o._.slice(1).join(' '));
    if (!q) return console.error('usage: uk-growth company <name or company number>'), process.exit(2);
    const hit = ROWS.filter((x) => norm(x.company_number) === q || norm(x.company_name).includes(q));
    return out(hit.map((x) => ({ ...slim(x), turnover_2023_gbp: x.turnover_gbp['2023'], postcode: x.postcode })), o,
      hit.length ? undefined : 'Not in the Growth 100 UK. This dataset only covers the 100 ranked companies.');
  }
  const count = (key) => Object.entries(ROWS.reduce((m, x) => ((m[key(x)] = (m[key(x)] || 0) + 1), m), {}))
    .sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ [cmd === 'regions' ? 'region' : 'sic_division']: k, companies: n }));
  if (cmd === 'regions') return out(count((x) => x.region), o);
  if (cmd === 'sectors') return out(count((x) => x.sic_code.slice(0, 2)), o);
  console.error(`unknown command: ${cmd}\n\n${HELP}`);
  process.exit(2);
}

main();
