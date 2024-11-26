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
  holidays: [
    { month: 12, day: 6 },
    { month: 12, day: 19 },
    { month: 12, day: 20 },
    { month: 12, day: 21 },
    { month: 12, day: 22 },
    { month: 12, day: 23 },
    { month: 12, day: 24 },
    { month: 12, day: 25 },
    { month: 12, day: 26 },
    { month: 12, day: 27 },
    { month: 12, day: 28 },
    { month: 12, day: 29 },
    { month: 12, day: 30 },
    { month: 12, day: 31 },
  ],
};

type Config = {
  workingHours: Record<string, WorkingHours>;
  holidays: { month: number; day: number }[];
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
