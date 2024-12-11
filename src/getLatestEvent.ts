import { DateTime } from "luxon";
import type { EventHistoryResponse } from "./types";

/**
 * Gets the date of the latest event
 *
 * @param accessToken Access token for the user
 *
 * @returns The date of the latest event
 */
export const getLatestEventDate = async (
  accessToken: string
): Promise<DateTime> => {
  const response = await fetch("https://api.controlit.es/api/events/latest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error while registering a day! status: ${response.status}`
    );
  }

  const data = (await response.json()) as EventHistoryResponse;

  if (!data.Success) {
    throw new Error(data.Message);
  }

  return DateTime.fromISO(data.EventHistory[0].StartDate);
};
