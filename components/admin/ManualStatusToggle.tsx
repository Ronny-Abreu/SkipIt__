"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSchedule, updateManualOverride } from "@/lib/firebase/schedule";
import type { ManualOverride } from "@/types/schedule";

interface ManualStatusToggleProps {
  barberId: string;
}

export const ManualStatusToggle = ({ barberId }: ManualStatusToggleProps) => {
  const [manualOverride, setManualOverride] = useState<ManualOverride>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const schedule = await getSchedule(barberId);
        setManualOverride(schedule?.manualOverride || null);
      } catch (error) {
        console.error("Error al cargar estado manual:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [barberId]);

  const handleStatusChange = async (newStatus: ManualOverride) => {
    const finalStatus = manualOverride === newStatus ? null : newStatus;
    setUpdating(true);
    try {
      await updateManualOverride(barberId, finalStatus);
      setManualOverride(finalStatus);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-gray-600">Cargando estado...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Estado Manual del Negocio
        </h2>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Usa estos controles para forzar el estado del negocio independientemente
        del horario configurado. Útil para cierres de emergencia o aperturas
        especiales.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={manualOverride === "open" ? "default" : "outline"}
          onClick={() => handleStatusChange("open")}
          disabled={updating}
          className="gap-2 text-black"
        >
          <CheckCircle className="h-4 w-4" />
          Forzar Abierto
        </Button>

        <Button
          variant={manualOverride === "closed" ? "default" : "outline"}
          onClick={() => handleStatusChange("closed")}
          disabled={updating}
          className="gap-2 text-black"
        >
          <XCircle className="h-4 w-4" />
          Forzar Cerrado
        </Button>

        {manualOverride && (
          <Button
            variant="ghost"
            onClick={() => handleStatusChange(null)}
            disabled={updating}
          >
            Usar Horario Normal
          </Button>
        )}
      </div>

      {manualOverride && (
        <div className="mt-4 rounded-md bg-amber-50 p-3">
          <p className="text-sm text-amber-800">
            Estado manual activo:{" "}
            <span className="font-semibold">
              {manualOverride === "open" ? "ABIERTO" : "CERRADO"}
            </span>
            . El horario configurado será ignorado.
          </p>
        </div>
      )}
    </div>
  );
};

