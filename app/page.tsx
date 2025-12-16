"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-center text-4xl font-bold mb-8">
          SkipIt - Sistema de Gestión de Citas
        </h1>
        <p className="text-center text-lg">
          Bienvenido al sistema de gestión de citas para negocios de servicios personales.
        </p>

        {user ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="text-gray-700">
              Hola, <span className="font-semibold">{user.name}</span>!
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button>Panel de Administración</Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="outline">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Registrarse</Button>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

