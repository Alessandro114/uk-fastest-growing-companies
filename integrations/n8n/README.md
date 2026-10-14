# n8n template: fastest-growing UK SMEs by region or sector

Import [`growth100-uk-workflow.json`](growth100-uk-workflow.json) in n8n (Workflows → Import from file). No credentials needed.

1. **Get Growth 100 UK (CSV)** downloads the dataset from this repo.
2. **Filter by region / sector**: set `REGION` (e.g. `Scotland`, `London`, `North West`) and `SECTOR` (SIC prefix like `43`, or words like `construction`, `restaurant`).
3. Connect the output to Slack, Google Sheets, Airtable, email or your CRM. Each item has `company`, `company_number`, `town`, `region`, `sector`, filed turnover 2022/2024, `growth_per_year_pct`, a Companies House link and a one-line `summary`.

Example output (`REGION = 'Scotland'`): `#2 Diona Construction Ltd (Glasgow): £9.6m -> £28.1m, +71.3%/yr`.
