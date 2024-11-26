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
};

type Config = {
  workingHours: Record<string, WorkingHours>;
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
