export type LoginResponse = ApiResponse & {
  User: {
    AccessToken: string;
  };
};

export type ApiResponse = {
  Success: boolean;
  Message: string;
  ErrorCode: number;
};
