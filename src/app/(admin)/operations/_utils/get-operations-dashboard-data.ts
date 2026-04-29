import "server-only";
import { getRoutes, getVehicles } from "./transit-api";
import type { OperationsDashboardData } from "../_types/operations.types";

export async function getOperationsDashboardData(): Promise<OperationsDashboardData> {
  const [routes, vehicles] = await Promise.all([getRoutes(), getVehicles()]);

  return {
    routes,
    vehicles,
    totals: {
      routes: routes.length,
      activeRoutes: routes.filter((route) => route.isActive).length,
      vehicles: vehicles.length,
      activeVehicles: vehicles.filter((vehicle) => vehicle.status === "ACTIVE")
        .length,
      maintenanceVehicles: vehicles.filter(
        (vehicle) => vehicle.status === "MAINTENANCE",
      ).length,
    },
  };
}
