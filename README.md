# POS Log Analyzer Dashboard

A professional, fully responsive React + TypeScript dashboard for analyzing POS API logs. Built with Vite, Tailwind CSS, Lucide React icons, and date-fns.

## Features
- File upload with drag-and-drop for JSON logs
- Log processing and analysis (API events only, error detection, latency, status)
- Interactive dashboard with summary cards
- Filterable and sortable API calls table
- Expandable rows for detailed information
- Powerful filtering: search, status, date range, EZETAP APIs only, errors only
- Responsive, modern UI with Tailwind CSS

## Usage
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open the app:**
   Visit [http://localhost:5173](http://localhost:5173) in your browser.

## File Upload
- Accepts `.json` and `.txt` files containing an array of log entries.
- Drag-and-drop or use the "browse files" link.
- Shows a sample JSON format for reference.

## Filtering & Analysis
- Search by URL or method
- Filter by status code, date range, EZETAP APIs, or errors only
- Expand rows for full API call details

## Technologies Used
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [date-fns](https://date-fns.org/)

---

MIT License
