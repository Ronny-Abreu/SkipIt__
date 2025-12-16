"use client";

import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.name || user?.email}
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Cerrar Sesión
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Citas
        </h2>
        <p className="mt-2 text-gray-600">
          Aquí irá el panel de gestión de citas y horarios (ETAPA 3).
        </p>
      </div>
    </div>
  );
}

