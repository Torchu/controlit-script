import { getLatestEventDate } from "./getLatestEvent";
import { login } from "./login";
import { registerRange } from "./registerHours";
import { DateTime } from "luxon";

/**
 * Process the arguments passed to the script
 *
 * @returns The start and end date
 */
const processArgs = (): { start?: DateTime; end?: DateTime } => {
  const getArgValue = (argName: string): string | undefined => {
    const arg = process.argv.find((a) => a.startsWith(`--${argName}=`));
    return arg ? arg.split("=")[1] : undefined;
  };

  const startArg = getArgValue("start");
  const endArg = getArgValue("end");

  const start = startArg ? DateTime.fromISO(startArg) : undefined;
  const end = endArg ? DateTime.fromISO(endArg) : undefined;

  if ((start && !start.isValid) || (end && !end.isValid)) {
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
 * Main function
 */
const main = async () => {
  let { start, end } = processArgs();

  const { username, password } = getCredentials();
  const accessToken = await login(username, password);

  if (!start) {
    console.log(
      "No --start argument provided. Using the day following the latest registered event."
    );
    start = (await getLatestEventDate(accessToken)).plus({ days: 1 });
  }

  if (!end) {
    console.log("No --end argument provided. Using today's date.");
    end = DateTime.now();
  }

  console.log(`Registering from ${start.toISODate()} to ${end.toISODate()}...`);

  await registerRange(accessToken, start, end);
  console.log("Registration completed!");
};

main();
