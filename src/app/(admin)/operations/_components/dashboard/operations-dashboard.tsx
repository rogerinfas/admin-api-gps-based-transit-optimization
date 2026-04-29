"use client";

import { useMemo, useState } from "react";
import type {
  OperationsDashboardData,
  RouteItem,
} from "../../_types/operations.types";

type Props = {
  data: OperationsDashboardData;
};

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success",
  INACTIVE: "bg-surface text-muted",
  MAINTENANCE: "bg-warning/15 text-warning",
};

function routeLabel(route: RouteItem): string {
  return `${route.name} (${route.code})`;
}

export default function OperationsDashboard({ data }: Props) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("all");

  const visibleVehicles = useMemo(() => {
    if (selectedRouteId === "all") return data.vehicles;
    return data.vehicles.filter((vehicle) => vehicle.routeId === selectedRouteId);
  }, [data.vehicles, selectedRouteId]);

  const selectedRoute = data.routes.find((route) => route.id === selectedRouteId);

  return (
    <>
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Arequipa - Centro de Operaciones
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          TransiGo Ops Panel
        </h1>
      </section>
      <section className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Rutas Totales</p><p className="mt-2 text-3xl font-semibold">{data.totals.routes}</p></article>
          <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Rutas Activas</p><p className="mt-2 text-3xl font-semibold">{data.totals.activeRoutes}</p></article>
          <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Flota Total</p><p className="mt-2 text-3xl font-semibold">{data.totals.vehicles}</p></article>
          <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Buses Activos</p><p className="mt-2 text-3xl font-semibold">{data.totals.activeVehicles}</p></article>
          <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">En Mantenimiento</p><p className="mt-2 text-3xl font-semibold">{data.totals.maintenanceVehicles}</p></article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10">
            <h2 className="text-lg font-semibold">Corredores de Ruta</h2>
            <p className="mt-1 text-sm text-muted">Flujo estilo despacho Uber para monitoreo por corredor.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button type="button" onClick={() => setSelectedRouteId("all")} className={`rounded-xl px-3 py-2 text-left text-sm ring-1 ring-foreground/10 transition ${selectedRouteId === "all" ? "bg-primary text-primary-contrast" : "bg-surface"}`}>Todas las rutas ({data.routes.length})</button>
              {data.routes.map((route) => (
                <button type="button" key={route.id} onClick={() => setSelectedRouteId(route.id)} className={`rounded-xl px-3 py-2 text-left text-sm ring-1 ring-foreground/10 transition ${selectedRouteId === route.id ? "bg-primary text-primary-contrast" : "bg-surface"}`}>
                  <p className="font-semibold">{route.name}</p>
                  <p className="text-xs opacity-80">{route.code}</p>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Vista Operativa</p>
                  <h2 className="mt-1 text-xl font-semibold">{selectedRoute ? routeLabel(selectedRoute) : "Todas las rutas de Arequipa"}</h2>
                </div>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-contrast">{visibleVehicles.length} buses visibles</span>
              </div>
            </article>

            <article className="rounded-2xl bg-surface-strong p-5 ring-1 ring-foreground/10">
              <h3 className="text-lg font-semibold">Unidades en servicio</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {visibleVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="rounded-xl bg-surface p-4 ring-1 ring-foreground/10">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{vehicle.code}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClasses[vehicle.status]}`}>{vehicle.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">Placa: {vehicle.plateNumber ?? "Sin placa"}</p>
                    <p className="mt-1 text-sm text-muted">Capacidad: {vehicle.capacity ?? "-"} pasajeros</p>
                  </div>
                ))}
              </div>
              {visibleVehicles.length === 0 && <p className="mt-4 text-sm text-muted">No hay buses en esta ruta.</p>}
            </article>
          </div>
        </section>
      </section>
    </>
  );
}
