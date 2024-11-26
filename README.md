# controlit-script

## Installing dependencies

```bash
bun install
```

## Configuring the script

Edit the `src/config.ts` file to configure the script.

### Working hours

Add your working hours per day in the `workingHours` object. The key is the day of the week (E.g. `Monday`). Every day without specific working hours set, will use the `default` working hours.

## Running the script

```bash
bun run start
```

This project was created using `bun init` in bun v1.1.37. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
