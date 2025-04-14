export type User = {
  id: number;
  name: string;
  email: string;
  role: boolean;
  tenantId: number;
};

export type UserUpdateFormData = {
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
