import { z } from "zod";

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

const dayScheduleSchema = z
  .object({
    active: z.boolean(),
    start: z.string().regex(timeRegex, "Formato de hora inválido (HH:MM)"),
    end: z.string().regex(timeRegex, "Formato de hora inválido (HH:MM)"),
    breakStart: z.string().regex(timeRegex).optional(),
    breakEnd: z.string().regex(timeRegex).optional(),
  })
  .refine(
    (data) => {
      if (!data.active) return true;
      const start = data.start.split(":").map(Number);
      const end = data.end.split(":").map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return endMinutes > startMinutes;
    },
    {
      message: "La hora de fin debe ser mayor a la de inicio",
      path: ["end"],
    }
  )
  .refine(
    (data) => {
      if (!data.active || !data.breakStart || !data.breakEnd) return true;
      const start = data.start.split(":").map(Number);
      const end = data.end.split(":").map(Number);
      const breakStart = data.breakStart.split(":").map(Number);
      const breakEnd = data.breakEnd.split(":").map(Number);

      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
      const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];

      return (
        breakStartMinutes >= startMinutes &&
        breakEndMinutes > breakStartMinutes &&
        breakEndMinutes <= endMinutes
      );
    },
    {
      message: "El horario de descanso debe estar dentro del horario laboral",
      path: ["breakEnd"],
    }
  );

export const weeklyScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
  manualOverride: z.enum(["open", "closed"]).nullable(),
});

export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>;

