import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/location", "routes/location-selection.tsx"),
  route("/settings", "routes/settings.tsx"),
  route("/calendar", "routes/calendar.tsx"),
] satisfies RouteConfig;
