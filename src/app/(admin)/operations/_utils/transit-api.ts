import "server-only";
import type { RouteItem, VehicleItem } from "../_types/operations.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error consultando ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getRoutes(): Promise<RouteItem[]> {
  return fetchApi<RouteItem[]>("/routes");
}

export async function getVehicles(): Promise<VehicleItem[]> {
  return fetchApi<VehicleItem[]>("/vehicles");
}
