# n8n template: fastest-growing UK SMEs by region or sector

Import [`growth100-uk-workflow.json`](growth100-uk-workflow.json) in n8n (Workflows → Import from file). No credentials needed.

1. **Get Growth 100 UK (CSV)** downloads the dataset from this repo.
2. **Filter by region / sector**: set `REGION` (e.g. `Scotland`, `London`, `North West`) and `SECTOR` (SIC prefix like `43`, or words like `construction`, `restaurant`).
3. Connect the output to Slack, Google Sheets, Airtable, email or your CRM. Each item has `company`, `company_number`, `town`, `region`, `sector`, filed turnover 2022/2024, `growth_per_year_pct`, a Companies House link and a one-line `summary`.

Example output (`REGION = 'Scotland'`): `#2 Diona Construction Ltd (Glasgow): £9.6m -> £28.1m, +71.3%/yr`.

## Data coverage

S.C.A.L.A. Score holds about 249 million company records from public registries and open data in 264 countries (home page of [score.get-scala.com](https://score.get-scala.com): "Data from official registries in 264 countries · 249,353,619 companies", checked 03/11/2026). Not all records have financial data, and coverage varies by country: revenue, employees and score are shown only where the source publishes them. Always check each field before relying on it.
