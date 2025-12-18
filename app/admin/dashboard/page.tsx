"use client";

import { useAuth } from "@/hooks/useAuth";
import { ScheduleEditor } from "@/components/admin/ScheduleEditor";
import { ManualStatusToggle } from "@/components/admin/ManualStatusToggle";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Gestiona los horarios y el estado de tu negocio
        </p>
      </div>

      <ManualStatusToggle barberId={user.id} />

      <ScheduleEditor barberId={user.id} />
    </div>
  );
}

