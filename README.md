# UK fastest-growing companies (SCALA Growth 100 UK, 2022–2024)

The **100 independent UK SMEs whose turnover grew fastest from FY2022 to FY2024**, computed only from accounts filed at [Companies House](https://find-and-update.company-information.service.gov.uk/), and every company reviewed by hand. As a dataset (CSV/JSON), a zero-dependency CLI, and a skill your AI agent can use.

**Full ranking, badges and method:** https://score.get-scala.com/rankings/uk/growth-100/

## Ask your agent

Install the skill in Claude Code:

```
/plugin marketplace add Alessandro114/uk-fastest-growing-companies
/plugin install uk-fastest-growing-companies@uk-fastest-growing-companies
```

Then ask: *"Which construction companies in Scotland grew fastest from 2022 to 2024?"*, *"Is Travellanda in the UK Growth 100?"*, *"Show me the fastest-growing UK SMEs with more than £20m turnover."*

Any agent that can run a shell command (OpenClaw, Hermes, Codex, Cursor...) can use the CLI directly. Point it to [`skills/uk-fastest-growing-companies/SKILL.md`](skills/uk-fastest-growing-companies/SKILL.md).

## CLI

```
npx -y github:Alessandro114/uk-fastest-growing-companies top --limit 10
npx -y github:Alessandro114/uk-fastest-growing-companies filter --region "North West" --table
npx -y github:Alessandro114/uk-fastest-growing-companies filter --sector construction
npx -y github:Alessandro114/uk-fastest-growing-companies company "Diona Construction"
npx -y github:Alessandro114/uk-fastest-growing-companies regions
```

JSON by default (for agents), `--table` for humans. Offline, no API key.

## Integrations

- **n8n**: ready-made workflow in [`integrations/n8n`](integrations/n8n/) (download, filter by region or sector, send to Slack/Sheets/CRM).
- **Any tool that reads a URL**: `https://raw.githubusercontent.com/Alessandro114/uk-fastest-growing-companies/main/data/growth100-uk-2022-2024.csv` (or `.json`).

## What's in it

| Field | Meaning |
|---|---|
| `rank` | Position by compound annual turnover growth, FY2022 → FY2024 |
| `company_name`, `company_number` | As on the Companies House register |
| `town`, `postcode`, `region` | Registered office; region = ONS region via postcodes.io |
| `sic_code`, `sic_description` | First SIC code |
| `turnover_2022/2023/2024_gbp` | Turnover as filed (company accounts, not group) |
| `cagr_2022_2024_pct` | Compound annual growth rate |

At a glance: median growth 31% a year; together the 100 went from £1.3bn to £2.35bn in turnover; 19 are in Greater London and 81 outside it; construction is the largest group (14 companies).

## Method (short)

- Turnover rising every year FY2022 → FY2023 → FY2024; 12-month company accounts with the same year-end month; consolidated figures excluded.
- Turnover at least £1.7m in 2022 and between £4.3m and £43m in 2024; no single-year jump above 2.5×; companies whose 2025 accounts already show a fall of more than 30% are excluded.
- Active companies only (no strike-off, liquidation or administration), no micro or audit-exempt-subsidiary accounts, no name change since 2023.
- Independent as far as could be confirmed: no foreign corporate parent, no larger UK group, no private-equity owner (PSC register + manual review). 260 candidates were reviewed by hand and 97 excluded.

Spotted an error, or want your company removed? Open an issue or use the contact link on the [ranking page](https://score.get-scala.com/rankings/uk/growth-100/).

## Source and licence

Source: the Companies House public register (iXBRL accounts filed January 2024 to December 2025; PSC snapshot of 12 October 2026; company data product of 1 October 2026), processed by [SCALA](https://score.get-scala.com). Code: MIT. Data: CC BY 4.0 ([LICENSE-DATA](LICENSE-DATA)), attribution "SCALA, score.get-scala.com".

More company data for 40+ countries: [SCALA Score](https://score.get-scala.com) · [world-company-database](https://github.com/Alessandro114/world-company-database)
