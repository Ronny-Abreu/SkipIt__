"use client";

import { useState, useEffect } from "react";
import { Calendar, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { getSchedule, saveSchedule, getDefaultWeeklySchedule } from "@/lib/firebase/schedule";
import { weeklyScheduleSchema } from "@/lib/validations/schedule";
import { DAY_NAMES, DAY_LABELS, type WeeklySchedule, type DayName, type DaySchedule } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface ScheduleEditorProps {
  barberId: string;
}

export const ScheduleEditor = ({ barberId }: ScheduleEditorProps) => {
  const [schedule, setSchedule] = useState<Omit<WeeklySchedule, "updatedAt"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const existingSchedule = await getSchedule(barberId);
        if (existingSchedule) {
          setSchedule({
            monday: existingSchedule.monday,
            tuesday: existingSchedule.tuesday,
            wednesday: existingSchedule.wednesday,
            thursday: existingSchedule.thursday,
            friday: existingSchedule.friday,
            saturday: existingSchedule.saturday,
            sunday: existingSchedule.sunday,
            manualOverride: existingSchedule.manualOverride,
            barberId: existingSchedule.barberId,
          });
        } else {
          setSchedule(getDefaultWeeklySchedule(barberId));
        }
      } catch (error) {
        console.error("Error al cargar horario:", error);
        setSchedule(getDefaultWeeklySchedule(barberId));
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [barberId]);

  const updateDay = (day: DayName, updates: Partial<WeeklySchedule[typeof day]>) => {
    if (!schedule) return;
    
    const updatedDayData: DaySchedule = {
      active: updates.active !== undefined ? updates.active : schedule[day].active,
      start: updates.start !== undefined ? updates.start : schedule[day].start,
      end: updates.end !== undefined ? updates.end : schedule[day].end,
    };
    
    if (updates.breakStart !== undefined || schedule[day].breakStart !== undefined) {
      updatedDayData.breakStart = updates.breakStart !== undefined 
        ? updates.breakStart 
        : schedule[day].breakStart;
    }
    if (updates.breakEnd !== undefined || schedule[day].breakEnd !== undefined) {
      updatedDayData.breakEnd = updates.breakEnd !== undefined 
        ? updates.breakEnd 
        : schedule[day].breakEnd;
    }
    
    setSchedule({
      ...schedule,
      [day]: updatedDayData,
    });
    setErrors({});
  };

  const handleSave = async () => {
    if (!schedule) return;

    setErrors({});
    setSaveSuccess(false);

    const validation = weeklyScheduleSchema.safeParse(schedule);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      await saveSchedule(schedule);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error al guardar horario:", error);
      setErrors({ _general: "Error al guardar. Intenta nuevamente." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando horarios...</div>
      </div>
    );
  }

  if (!schedule) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Configuración de Horarios
        </h2>
      </div>

      {errors._general && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{errors._general}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
          Horarios guardados correctamente
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        {DAY_NAMES.map((day) => {
          const daySchedule = schedule[day];
          const dayError = errors[day];

          return (
            <div
              key={day}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                daySchedule.active
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {DAY_LABELS[day]}
                </h3>
                <Switch
                  checked={daySchedule.active}
                  onChange={(e) => 
                    updateDay(day, { active: e.target.checked })
                  }
                />
              </div>

              {daySchedule.active && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Input
                      type="time"
                      label="Inicio"
                      value={daySchedule.start}
                      onChange={(e) => updateDay(day, { start: e.target.value })}
                      error={errors[`${day}.start`]}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Input
                      type="time"
                      label="Fin"
                      value={daySchedule.end}
                      onChange={(e) => updateDay(day, { end: e.target.value })}
                      error={errors[`${day}.end`]}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Input
                      type="time"
                      label="Inicio Descanso (opcional)"
                      value={daySchedule.breakStart || ""}
                      onChange={(e) =>
                        updateDay(day, {
                          breakStart: e.target.value || undefined,
                        })
                      }
                      error={errors[`${day}.breakStart`]}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Input
                      type="time"
                      label="Fin Descanso (opcional)"
                      value={daySchedule.breakEnd || ""}
                      onChange={(e) =>
                        updateDay(day, {
                          breakEnd: e.target.value || undefined,
                        })
                      }
                      error={errors[`${day}.breakEnd`]}
                      className="text-black"
                    />
                  </div>
                </div>
              )}

              {dayError && (
                <p className="mt-2 text-sm text-red-600">{dayError}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Configuración Completa"}
        </Button>
      </div>
    </div>
  );
};

