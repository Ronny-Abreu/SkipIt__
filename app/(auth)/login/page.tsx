"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(formData.email, formData.password);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setAuthError("Email o contraseña incorrectos");
      } else if (error.code === "auth/user-not-found") {
        setAuthError("Usuario no encontrado");
      } else {
        setAuthError("Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          O{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:text-gray-700"
          >
            crea una cuenta nueva
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
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>
    </>
  );
}

