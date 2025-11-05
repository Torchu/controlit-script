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
  // [{start: {month: MM, day: DD}, end: {month: MM, day: DD}}] both included
  vacations: [
    { start: { month: 1, day: 2 }, end: { month: 1, day: 3 } }, // Christmas Vacations 2024
    { start: { month: 3, day: 7 }, end: { month: 3, day: 7 } }, // Growth Day
    { start: { month: 6, day: 25 }, end: { month: 6, day: 27 } }, // WRONG Vacations from 2024
    { start: { month: 6, day: 27 }, end: { month: 6, day: 27 } }, // Growth Day
    { start: { month: 7, day: 16 }, end: { month: 8, day: 1 } }, // Summer Vacations I
    { start: { month: 9, day: 2 }, end: { month: 9, day: 5 } }, // Summer Vacations II
    { start: { month: 12, day: 5 }, end: { month: 12, day: 5 } }, // Constitution Day
    { start: { month: 12, day: 22 }, end: { month: 12, day: 31 } }, // Christmas Vacations

    // { start: { month: 7, day: 16 }, end: { month: 7, day: 18 } },
  ],
  sickLeaves: [{ start: { month: 11, day: 6 }, end: { month: 11, day: 21 } }],
};

type Config = {
  workingHours: Record<string, WorkingHours>;
  holidays: Day[];
  vacations: { start: Day; end: Day }[];
  sickLeaves: { start: Day; end: Day }[];
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
