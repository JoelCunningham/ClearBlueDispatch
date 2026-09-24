export type LoginFormInput = {
  email: string;
  password: string;
  newPassword?: string;
};

export type LoginUserInput = LoginFormInput;

export type SetPasswordInput = LoginFormInput;
