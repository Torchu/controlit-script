export type LoginResponse = ApiResponse & {
  User: {
    AccessToken: string;
  };
};

export type EventHistoryResponse = ApiResponse & {
  EventHistory: ControlITEvent[];
};

export type ControlITEvent = {
  StartDate: string;
  EndDate: string;
};

export type ApiResponse = {
  Success: boolean;
  Message: string;
  ErrorCode: number;
};
