import type { LoginResponse } from "./types";

/**
 * Returns the access token for the user
 *
 * @param user User to log in
 * @param pass Password for the user
 *
 * @returns Access token for the user if the log in is successful
 */
export const login = async (user: string, pass: string): Promise<string> => {
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
