"use client";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Calendar, Users, LogOut } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.name || user?.email}
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="gap-2">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/admin/dashboard">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-3">
                <Calendar className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Gestión de Horarios
                </h3>
                <p className="text-sm text-gray-600">
                  Configura tus horarios semanales
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-3">
              <Users className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Gestión de Citas
              </h3>
              <p className="text-sm text-gray-600">
                Próximamente (ETAPA 9)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

