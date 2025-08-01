import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/auth.tsx"),
    route("dashboard","routes/dashboard.tsx"),
    route("dashboard/receipt_management","routes/receipt_management.tsx"),
    
] satisfies RouteConfig;
