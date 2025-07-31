# Reddit CHI Dashboard

## Project Overview

The Reddit CHI Dashboard is a modern, interactive web dashboard for visualizing and comparing the Community Health Index (CHI) and related metrics across various subreddits. It combines qualitative and quantitative data to provide actionable insights and community health status at a glance.

## Features
- Interactive dashboard with sticky navigation
- Visualizations: bar charts, radar charts, trend lines
- Community health status cards and statistics
- Section navigation for Health Overview, Drilldown, KPIs, Stats, Compare, and All Data
- Responsive, modern UI with Tailwind CSS and Recharts
- Data pipeline for merging CSV/JSON data sources

## Setup Instructions

### 1. Install Dependencies
```
npm install
```

### 2. Prepare Data
- Place your `qualitative.csv` and `quantitative.csv` files in the `data/` directory.
- Run the data pipeline script to generate `combined.json`:
```
npx ts-node scripts/combine-jsons-to-combined.ts
```

### 3. Start the Development Server
```
npm run dev
```
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Data Pipeline
- Data is merged from qualitative and quantitative sources into `data/combined.json`.
- The dashboard reads from `data/combined.json` for all visualizations and tables.
- To update data, edit the CSV/JSON files and re-run the combine script.

## Development
- Main dashboard code: `dashboard.tsx`
- Data scripts: `scripts/`
- UI components: `components/`
- Styles: Tailwind CSS (`tailwind.config.ts`, `app/globals.css`)

## License
MIT License 