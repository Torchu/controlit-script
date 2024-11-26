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
    { month: 12, day: 25 },
  ],
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
