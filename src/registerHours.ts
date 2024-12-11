import { DateTime } from "luxon";
import { config } from "./config";
import type { ApiResponse } from "./types";

/**
 * Registers a range of days, skipping weekends and holidays
 *
 * @param accessToken The access token for the user
 * @param start The start date
 * @param end The end date
 */
export const registerRange = async (
  accessToken: string,
  start: DateTime,
  end: DateTime
): Promise<void> => {
  for (let day = start; day <= end; day = day.plus({ days: 1 })) {
    if (day.weekday > 5 || isHoliday(day) || isVacation(day)) {
      continue;
    }

    try {
      await registerDay(accessToken, day);
    } catch (error) {
      console.error(`Error registering day ${day.toISODate()}: ${error}`);
    }
  }
};

/**
 * Check if the date is a holiday
 * @param date Date to check
 *
 * @returns True if the date is a holiday, false otherwise
 */
const isHoliday = (date: DateTime): boolean => {
  return config.holidays.some(
    (holiday) => holiday.month === date.month && holiday.day === date.day
  );
};

/**
 * Check if the date is a vacation day
 * @param date Date to check
 *
 * @returns True if the date is a vacation, false otherwise
 */
const isVacation = (date: DateTime): boolean => {
  return config.vacations.some((vacation) => {
    const startVacation = DateTime.fromObject({
      month: vacation.start.month,
      day: vacation.start.day,
      year: date.year,
    });
    const endVacation = DateTime.fromObject({
      month: vacation.end.month,
      day: vacation.end.day,
      year: date.year,
    });

    return date >= startVacation && date <= endVacation; // Check if the date is within the vacation range
  });
};

/**
 * Register the day getting the start and end time from the config
 * @param accessToken Access token for the user
 * @param day Day to register
 */
const registerDay = async (
  accessToken: string,
  day: DateTime
): Promise<void> => {
  const { start, end } = getWorkingHours(day);

  const response = await fetch(
    "https://api.controlit.es/api/events/manual-register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        EventTypeId: "d8cc9d74-ef29-4267-906b-24fda81e87ec",
        StartDate: formatDate(start),
        EndDate: formatDate(end),
      }),
      redirect: "follow",
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP error while registering a day! status: ${response.status}`
    );
  }

  const data = (await response.json()) as ApiResponse;

  if (!data.Success) {
    throw new Error(data.Message);
  }
};

/**
 * Returns the working hours for a day, adding a random variation to the start and end time
 *
 * @param day The day to get the working hours
 *
 * @returns An object with the start and end working hours
 */
const getWorkingHours = (day: DateTime): { start: DateTime; end: DateTime } => {
  const { start, end } =
    config.workingHours[day.weekdayLong ?? "default"] ??
    config.workingHours.default;

  const variation = Math.random() * 10 - 5; // Random number between -5 and 5

  return {
    start: day.set(start).plus({ minutes: variation }),
    end: day.set(end).plus({ minutes: variation }),
  };
};

/**
 * Formats a date to the format expected by the API
 * @param date The date to format
 *
 * @returns A string with the formatted date
 */
const formatDate = (date: DateTime): string => {
  return date.toFormat("yyyy-MM-dd'T'HH':'mm':'ssZZ");
};
