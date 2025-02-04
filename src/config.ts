export const config: Config = {
  workingHours: {
    default: {
      start: {
        hour: 7,
        minute: 0,
      },
      end: {
        hour: 15,
        minute: 0,
      },
    },
  },
  // [{month: MM, day: DD}]
  holidays: [
    { month: 1, day: 1 },
    { month: 1, day: 6 },
    { month: 4, day: 17 },
    { month: 4, day: 18 },
    { month: 5, day: 1 },
    { month: 6, day: 9 },
    { month: 7, day: 25 },
    { month: 7, day: 28 },
    { month: 8, day: 15 },
    { month: 9, day: 15 },
    { month: 11, day: 1 },
    { month: 12, day: 6 },
    { month: 12, day: 8 },
    { month: 12, day: 25 },
  ],
  // [{start: {month: MM, day: DD}, end: {month: MM, day: DD}}]
  vacations: [{ start: { month: 12, day: 19 }, end: { month: 12, day: 31 } }],
};

type Config = {
  workingHours: Record<string, WorkingHours>;
  holidays: Day[];
  vacations: { start: Day; end: Day }[];
};

type WorkingHours = {
  start: {
    hour: number;
    minute: number;
  };
  end: {
    hour: number;
    minute: number;
  };
};

type Day = {
  month: number;
  day: number;
};
