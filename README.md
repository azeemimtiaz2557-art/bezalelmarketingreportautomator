# Bezalel Marketing Report Automator

Crafted with Purpose.

A marketing analytics dashboard for campaign CSV files. Upload a file, check it, and see KPIs, charts and a campaign table. Built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts and PapaParse.

## Current status (please read)

- **Frontend only.** No login, no database, no server-side storage.
- **Not yet run or tested.** The source was written without installing packages or starting the app, so it may contain errors. Vercel's build step is the first real check. Please report any error text you see.
- **Not yet built:**
  - PDF reports (`@react-pdf/renderer` is listed in `package.json` but not used yet).
  - shadcn/ui components. Current components are custom Tailwind components with the same look. shadcn can be added later with its CLI.
  - Automated tests for the CSV and metric functions.
  - Real logo watermark on reports.

## Project structure

```
app/                  Pages (Dashboard, Upload Data, Analytics, Reports, Settings)
components/           Shell, sidebar, header, KPI cards, charts, table, upload zone
lib/csv.ts            CSV validation and parsing (file checks, row checks, error messages)
lib/metrics.ts        KPI calculations, campaign grouping, date filters
lib/format.ts         Number, currency and date formatting
lib/types.ts          Shared data types
public/brand/         Official Bezalel Media logo (do not redraw or replace)
public/samples/       Fictional sample CSV files
```

## Setup on a computer (Node.js 18.18 or newer)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Setup on an Android phone

1. Create a GitHub account and a **new, empty repository** for this project. Do not use your existing portfolio repository.
2. Upload the project files to that repository, or use the GitHub app to add them.
3. In Vercel, choose **Add New → Project**, select the new repository, and click **Deploy**. Vercel detects Next.js automatically.
4. If the build fails, copy the error text and send it to the assistant.

## CSV format

Required columns (header names are not case-sensitive):

| Column | Rule |
| --- | --- |
| `campaign` | Text, not empty |
| `impressions` | Number, 0 or more |
| `clicks` | Number, 0 or more |
| `conversions` | Number, 0 or more |
| `spend` | Number, 0 or more |

Optional: `date` in `YYYY-MM-DD` format. Without it, date filters and daily trends are unavailable.

Limits: `.csv` only, 2 MB maximum, 10,000 rows maximum. Invalid rows are skipped and listed with their line numbers. They are never silently turned into zeros.

## Privacy

- Uploaded files are read in the browser and kept in memory for the current session only.
- Refreshing the page returns the app to the fictional sample data.
- No customer names, phone numbers or emails are collected.
- No data is sent to external services.

## Brand

- The logo in `public/brand/bezalel-logo.png` is the original supplied file, unaltered.
- Colours: Midnight Navy `#18243A`, Warm Gold `#B89A62`, Soft Off-White `#F7F7F5`, Slate `#77808D`.
- Font: Poppins, loaded through `next/font`.
- Respects the reduced-motion setting: animations are shortened to near-zero.
