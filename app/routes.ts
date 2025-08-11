import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Pages
  index("routes/pages/auth.tsx"),
  route("dashboard", "routes/pages/dashboard.tsx"),
  route("receipt_management", "routes/pages/receipt_management.tsx"),
  route("receipt_upload", "routes/pages/receipt_upload.tsx"),
  route("*", "routes/pages/not_found.tsx"),

  // API
  route("api/ocr", "routes/api/receipt_upload/ocr.ts"),
] satisfies RouteConfig;
