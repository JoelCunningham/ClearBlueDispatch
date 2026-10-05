export type LoginUserInput = {
  email: string;
  password: string;
};

export type SetupPasswordInput = {
  userId?: number;
  password: string;
  confirmPassword: string;
  callbackUrl?: string;
};

export type ResetPasswordInput = {
  email: string;
};
