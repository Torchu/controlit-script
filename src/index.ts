import { login } from "./login";
import { registerRange } from "./registerHours";
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
