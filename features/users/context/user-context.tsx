"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { User, UserState } from "../types/user-types";
import { usersApi } from "../services/user-service";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const initialState: UserState = {
  users: [],
  loading: false,
};

type UserAction =
  | { type: "FETCH_USERS_REQUEST" }
  | { type: "FETCH_USERS_SUCCESS"; payload: User[] }
  | { type: "CREATE_USER_SUCCESS"; payload: User }
  | { type: "UPDATE_USER_SUCCESS"; payload: User }
  | { type: "DELETE_USER_SUCCESS"; payload: number };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_USERS_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "CREATE_USER_SUCCESS": {
      const currentUsers = Array.isArray(state.users) ? state.users : [];
      return {
        ...state,
        loading: false,
        users: [...currentUsers, action.payload],
      };
    }
    case "UPDATE_USER_SUCCESS": {
      const usersForUpdate = Array.isArray(state.users) ? state.users : [];
      return {
        ...state,
        loading: false,
        users: usersForUpdate.map((user) => {
          return user.id === action.payload.id ? action.payload : user;
        }),
      };
    }
    case "DELETE_USER_SUCCESS": {
      const usersForDelete = Array.isArray(state.users) ? state.users : [];
      return {
        ...state,
        loading: false,
        users: usersForDelete.filter((user) => {
          return user.id !== action.payload;
        }),
      };
    }
    default:
      return state;
  }
};

export const UserContext = createContext<{
  state: UserState;
  fetchUsers: (includeDeleted: boolean) => Promise<void>;
  createUser: (data: User) => Promise<User | void>;
  updateUser: (id: number, data: User) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}>({
  state: initialState,
  fetchUsers: async () => {},
  createUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const path = usePathname();
  const fetchUsers = async () => {
    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
      const users = await usersApi.getUsers();
      const usersArray = Array.isArray(users) ? users : [];
      dispatch({
        type: "FETCH_USERS_SUCCESS",
        payload: usersArray,
      });

      if (path === "/dashboard/users") {
        toast.success("Success to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to get users");
      dispatch({
        type: "FETCH_USERS_SUCCESS",
        payload: [],
      });
    }
  };

  const createUser = async (data: User) => {
    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
      const user = await usersApi.createUser(data);
      dispatch({
        type: "CREATE_USER_SUCCESS",
        payload: user,
      });
      toast.success("Success to create user");
      return user;
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
      throw error;
    }
  };

  const updateUser = async (id: number, data: User) => {
    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
			console.log(id, data);
      const user = await usersApi.updateUser(id, data);
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: user,
      });
      toast.success("Success to update user");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
      await usersApi.deleteUser(id);
      dispatch({
        type: "DELETE_USER_SUCCESS",
        payload: id,
      });
      toast.success("Success to delete user");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        state,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
