## Packages
recharts | For the financial summary bar chart
date-fns | For date formatting (Portuguese locale needed)
lucide-react | For beautiful icons (already in base, but listing for confirmation)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
API Endpoints:
- GET /api/summary (Chart data)
- GET/POST/DELETE /api/incomes
- GET/POST/DELETE /api/costs
