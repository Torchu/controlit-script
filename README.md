# controlit-script

ControlIT script to generate a report of the hours worked in a range of days.

## Installing dependencies

```bash
bun install
```

## Configuring the script

Edit the `src/config.ts` file to configure the script.

### Working hours

Add your working hours per day in the `workingHours` object. The key is the day of the week (E.g. `Monday`). Every day without specific working hours set, will use the `default` working hours.

### Holidays

Add your holidays in the `holidays` array. The date must be in the format `{ month: number, day: number }`.

### Vacations

Add your vacations in the `vacations` array. The date must be in the format `{ start: { month: number, day: number }, end: { month: number, day: number } }`.

## Running the script

Run the script passing the start and end date as arguments in the format `YYYY-MM-DD`. The end date is also included in the report.

```bash
bun run start --start=YYYY-MM-DD --end=YYYY-MM-DD
```

If not provided, the `start` date will be the following day of the date of the last report and the `end` date will be the current date.

**BE CAREFUL** not to run the script with a range of days that were already included in a previous report.

This project was created using `bun init` in bun v1.1.37. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
