import { config } from "./config";
import type { ApiResponse, LoginResponse } from "./types";
import { DateTime } from "luxon";

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
  const { username, password } = getCredentials();
  const accessToken = await login(username, password);
  const day = DateTime.fromObject({
    year: 2024,
    month: 11,
    day: 20,
  });
  registerDay(accessToken, day);
};

main();
