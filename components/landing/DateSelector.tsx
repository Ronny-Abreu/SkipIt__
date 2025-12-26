"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DAY_LABELS, type DayName } from "@/types/schedule";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector = ({
  selectedDate,
  onDateChange,
}: DateSelectorProps) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextDates: Date[] = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextDates.push(date);
    }

    setDates(nextDates);
  }, []);

  const getDayName = (date: Date): DayName => {
    const dayIndex = date.getDay();
    const dayMap: DayName[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return dayMap[dayIndex];
  };

  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const formatDayNumber = (date: Date): string => {
    return date.getDate().toString();
  };

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md py-4 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:overflow-x-visible">
          {dates.map((date, index) => {
            const dayName = getDayName(date);
            const selected = isSelected(date);

            return (
              <motion.button
                key={date.toISOString()}
                onClick={() => onDateChange(date)}
                className={`relative flex min-w-[60px] flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-colors ${selected ? "bg-zinc-900" : ""
                  }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {selected && (
                  <motion.div
                    layoutId="selectedDate"
                    className="absolute inset-0 rounded-2xl bg-zinc-900"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 text-xs font-medium ${selected ? "text-white" : "text-zinc-500"
                    }`}
                >
                  {DAY_LABELS[dayName].slice(0, 3)}
                </span>
                <span
                  className={`relative z-10 text-lg font-bold ${selected ? "text-white" : "text-zinc-900"
                    }`}
                >
                  {formatDayNumber(date)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
