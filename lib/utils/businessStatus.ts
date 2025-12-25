import type { WeeklySchedule, DayName } from "@/types/schedule";
import { DAY_NAMES } from "@/types/schedule";

/**
 * Determina si el negocio está abierto o cerrado basado en:
 * 1. manualOverride (tiene prioridad)
 * 2. El horario del día actual
 * 3. La hora actual
 */
export const isBusinessOpen = (schedule: WeeklySchedule | null): boolean => {
  if (!schedule) return false;

  if (schedule.manualOverride === "open") return true;
  if (schedule.manualOverride === "closed") return false;

  const now = new Date();
  const currentDay = now.getDay(); // 0-6
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const dayMap: DayName[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const todaySchedule = schedule[dayMap[currentDay]];

  if (!todaySchedule.active) return false;

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const currentMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(todaySchedule.start);
  const endMinutes = timeToMinutes(todaySchedule.end);

  if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
    return false;
  }

  if (todaySchedule.breakStart && todaySchedule.breakEnd) {
    const breakStartMinutes = timeToMinutes(todaySchedule.breakStart);
    const breakEndMinutes = timeToMinutes(todaySchedule.breakEnd);

    if (
      currentMinutes >= breakStartMinutes &&
      currentMinutes < breakEndMinutes
    ) {
      return false;
    }
  }

  return true;
};
