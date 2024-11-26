import { config } from "./config";
import type { ApiResponse, LoginResponse } from "./types";
import { DateTime } from "luxon";

/**
 * Process the arguments passed to the script
 *
 * @returns The start and end date
 */
const processArgs = (): { start: DateTime; end: DateTime } => {
  const getArgValue = (argName: string): string | undefined => {
    const arg = process.argv.find((a) => a.startsWith(`--${argName}=`));
    return arg ? arg.split("=")[1] : undefined;
  };

  const startArg = getArgValue("start");
  const endArg = getArgValue("end");

  if (!startArg || !endArg) {
    console.error("Please provide both --start and --end arguments.");
    process.exit(1);
  }

  const start = DateTime.fromISO(startArg);
  const end = DateTime.fromISO(endArg);

  if (!start.isValid || !end.isValid) {
    console.error("Invalid date format. Please use YYYY-MM-DD.");
    process.exit(1);
  }

  return { start, end };
};

/**
 * Get credentials from the environment
 *
 * @returns The credentials from the environment
 */
const getCredentials = (): { username: string; password: string } => {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) {
    throw new Error("Missing credentials");
  }

  return { username, password };
};

/**
 * Returns the access token for the user
 *
 * @param user User to log in
 * @param pass Password for the user
 *
 * @returns Access token for the user if the log in is successful
 */
const login = async (user: string, pass: string): Promise<string> => {
  const response = await fetch("https://api.controlit.es/api/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Username: user,
      Password: pass,
    }),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP error while login! status: ${response.status}`);
  }

  const data = (await response.json()) as LoginResponse;

  if (!data.Success) {
    throw new Error(data.Message);
  }

  return data.User.AccessToken;
};

/**
 * Registers a range of days, skipping weekends and holidays
 *
 * @param accessToken The access token for the user
 * @param start The start date
 * @param end The end date
 */
const registerRange = async (
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
  const { start, end } =
    config.workingHours[day.weekdayLong ?? "default"] ??
    config.workingHours.default;
  const startDate = day.set(start);
  const endDate = day.set(end);

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
        StartDate: formatDate(startDate),
        EndDate: formatDate(endDate),
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
 * Formats a date to the format expected by the API
 * @param date The date to format
 *
 * @returns A string with the formatted date
 */
const formatDate = (date: DateTime): string => {
  return date.toFormat("yyyy-MM-dd'T'HH':'mm':'ssZZ");
};

/**
 * Main function
 */
const main = async () => {
  const { start, end } = processArgs();
  console.log(`Registering from ${start.toISODate()} to ${end.toISODate()}...`);

  const { username, password } = getCredentials();
  const accessToken = await login(username, password);

  await registerRange(accessToken, start, end);
  console.log("Registration completed!");
};

main();
