"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setErrors({});

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(formData.email, formData.password, formData.name);
      
      router.push("/");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("Este email ya está registrado");
      } else if (error.code === "auth/weak-password") {
        setAuthError("La contraseña es muy débil");
      } else if (error.code?.includes("permission") || error.message?.includes("permisos")) {
        if (error.message?.includes("crear perfil")) {
          setAuthError("Usuario creado. Redirigiendo...");
          setTimeout(() => router.push("/"), 1000);
        } else {
          setAuthError("Error de permisos. Verifica las reglas de Firestore.");
        }
      } else {
        setAuthError(
          `Error al crear la cuenta: ${error.message || "Intenta nuevamente"}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-sm text-gray-600">
          O{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 hover:text-gray-700"
          >
            inicia sesión si ya tienes cuenta
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {authError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{authError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              label="Nombre"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              className="pr-10"
              required
            />
            <User className="pointer-events-none absolute right-3 top-[38px] h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type="email"
              label="Email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              className="pr-10"
              required
            />
            <Mail className="pointer-events-none absolute right-3 top-[38px] h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              className="pr-10"
              required
            />
            <Lock className="pointer-events-none absolute right-3 top-[38px] h-5 w-5 text-gray-400" />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </Button>
      </form>
    </>
  );
}

