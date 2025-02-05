import { User } from "../../shared/models/user";

export interface UserState {
  users: User[];
  currentUserId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  currentUserId: null,
  isLoading: false,
  error: null,
};