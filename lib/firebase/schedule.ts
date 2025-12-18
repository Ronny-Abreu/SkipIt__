import { doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { db } from "./config";
import type { WeeklySchedule, DaySchedule, DayName } from "@/types/schedule";
import { DAY_NAMES } from "@/types/schedule";

const DEFAULT_SCHEDULE: DaySchedule = {
  active: false,
  start: "09:00",
  end: "18:00",
};

export const getDefaultWeeklySchedule = (
  barberId: string
): Omit<WeeklySchedule, "updatedAt"> => {
  return {
    monday: { ...DEFAULT_SCHEDULE },
    tuesday: { ...DEFAULT_SCHEDULE },
    wednesday: { ...DEFAULT_SCHEDULE },
    thursday: { ...DEFAULT_SCHEDULE },
    friday: { ...DEFAULT_SCHEDULE },
    saturday: { ...DEFAULT_SCHEDULE },
    sunday: { ...DEFAULT_SCHEDULE },
    manualOverride: null,
    barberId,
  };
};

const cleanDayData = (dayData: any): DaySchedule => {
  if (!dayData) return DEFAULT_SCHEDULE;
  
  const cleaned: DaySchedule = {
    active: dayData.active ?? DEFAULT_SCHEDULE.active,
    start: dayData.start ?? DEFAULT_SCHEDULE.start,
    end: dayData.end ?? DEFAULT_SCHEDULE.end,
  };
  
  if (dayData.breakStart !== undefined && dayData.breakStart !== null) {
    cleaned.breakStart = dayData.breakStart;
  }
  if (dayData.breakEnd !== undefined && dayData.breakEnd !== null) {
    cleaned.breakEnd = dayData.breakEnd;
  }
  
  return cleaned;
};

export const getSchedule = async (
  barberId: string
): Promise<WeeklySchedule | null> => {
  try {
    const scheduleDoc = await getDoc(doc(db, "schedules", barberId));
    if (!scheduleDoc.exists()) {
      return null;
    }

    const data = scheduleDoc.data();
    return {
      monday: cleanDayData(data.monday),
      tuesday: cleanDayData(data.tuesday),
      wednesday: cleanDayData(data.wednesday),
      thursday: cleanDayData(data.thursday),
      friday: cleanDayData(data.friday),
      saturday: cleanDayData(data.saturday),
      sunday: cleanDayData(data.sunday),
      manualOverride: data.manualOverride || null,
      barberId: data.barberId || barberId,
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error al obtener horario:", error);
    throw error;
  }
};

const daySchedulesEqual = (day1: DaySchedule, day2: any): boolean => {
  if (!day2) return false;
  
  if (day1.active !== day2.active) return false;
  if (day1.start !== day2.start) return false;
  if (day1.end !== day2.end) return false;
  
  const breakStart1 = day1.breakStart || null;
  const breakStart2 = day2.breakStart || null;
  if (breakStart1 !== breakStart2) return false;
  
  const breakEnd1 = day1.breakEnd || null;
  const breakEnd2 = day2.breakEnd || null;
  if (breakEnd1 !== breakEnd2) return false;
  
  return true;
};

export const saveSchedule = async (
  schedule: Omit<WeeklySchedule, "updatedAt">
): Promise<void> => {
  try {
    const scheduleRef = doc(db, "schedules", schedule.barberId);
    
    const currentDoc = await getDoc(scheduleRef);
    const currentData = currentDoc.exists() ? currentDoc.data() : {};
    
    const scheduleWithTimestamps: Record<string, any> = {
      barberId: schedule.barberId,
      manualOverride: schedule.manualOverride,
      updatedAt: serverTimestamp(),
    };

    DAY_NAMES.forEach((dayName) => {
      const newDayData = schedule[dayName];
      const currentDayData = currentData[dayName];
      
      const hasChanged = !daySchedulesEqual(newDayData, currentDayData);
      
      if (hasChanged) {
        scheduleWithTimestamps[dayName] = {
          ...newDayData,
          updatedAt: serverTimestamp(),
        };
      } else {
        if (currentDayData) {
          scheduleWithTimestamps[dayName] = {
            ...newDayData,
            updatedAt: currentDayData.updatedAt,
          };
        } else {
          scheduleWithTimestamps[dayName] = {
            ...newDayData,
            updatedAt: serverTimestamp(),
          };
        }
      }
    });

    await setDoc(
      scheduleRef,
      scheduleWithTimestamps,
      { merge: true }
    );
  } catch (error) {
    console.error("Error al guardar horario:", error);
    throw error;
  }
};

export const updateManualOverride = async (
  barberId: string,
  override: "open" | "closed" | null
): Promise<void> => {
  try {
    await setDoc(
      doc(db, "schedules", barberId),
      {
        manualOverride: override,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error al actualizar estado manual:", error);
    throw error;
  }
};

export const updateDaySchedule = async (
  barberId: string,
  dayName: DayName,
  dayData: DaySchedule
): Promise<void> => {
  try {
    const scheduleRef = doc(db, "schedules", barberId);
    
    const currentDoc = await getDoc(scheduleRef);
    
    const updatePayload: Record<string, any> = {
      [`${dayName}.active`]: Boolean(dayData.active),
      [`${dayName}.start`]: String(dayData.start),
      [`${dayName}.end`]: String(dayData.end),
      [`${dayName}.updatedAt`]: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    if (dayData.breakStart !== undefined && dayData.breakStart !== null && dayData.breakStart !== "") {
      updatePayload[`${dayName}.breakStart`] = String(dayData.breakStart);
    } else if (currentDoc.exists() && currentDoc.data()[dayName]?.breakStart !== undefined) {
      updatePayload[`${dayName}.breakStart`] = deleteField();
    }
    
    if (dayData.breakEnd !== undefined && dayData.breakEnd !== null && dayData.breakEnd !== "") {
      updatePayload[`${dayName}.breakEnd`] = String(dayData.breakEnd);
    } else if (currentDoc.exists() && currentDoc.data()[dayName]?.breakEnd !== undefined) {
      updatePayload[`${dayName}.breakEnd`] = deleteField();
    }
    
    await updateDoc(scheduleRef, updatePayload);
  } catch (error) {
    console.error("Error al actualizar horario del día:", error);
    throw error;
  }
};

