import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/auth.tsx"),
    route("dashboard","routes/dashboard.tsx"),
    route("receipt_management","routes/receipt_management.tsx"),
    route("receipt_upload","routes/receipt_upload.tsx"),
    
] satisfies RouteConfig;
