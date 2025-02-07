import { User } from "../../shared/models/user";

export interface UserState {
  users: User[];
  currentUserId: string | null;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  currentUserId: null,
  currentUser: null,
  isLoading: false,
  error: null,
};