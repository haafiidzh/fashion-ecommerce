"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Role, RoleState } from "../types/role-types";
import { rolesApi } from "../services/role-service";
import { toast } from "sonner";

const initialState: RoleState = {
  roles: [],
  loading: false,
};

type RoleAction =
  | { type: "FETCH_ROLES_REQUEST" }
  | { type: "FETCH_ROLES_SUCCESS"; payload: Role[] }
  | { type: "CREATE_ROLE_SUCCESS"; payload: Role }
  | { type: "UPDATE_ROLE_SUCCESS"; payload: Role }
  | { type: "DELETE_ROLE_SUCCESS"; payload: number };

const roleReducer = (state: RoleState, action: RoleAction): RoleState => {
  switch (action.type) {
    case "FETCH_ROLES_REQUEST":
      return { ...state, loading: true };
    case "FETCH_ROLES_SUCCESS":
      return { ...state, loading: false, roles: action.payload };
    case "CREATE_ROLE_SUCCESS": {
      const currentRoles = Array.isArray(state.roles) ? state.roles : [];
      return {
        ...state,
        loading: false,
        roles: [...currentRoles, action.payload],
      };
    }
    case "UPDATE_ROLE_SUCCESS": {
      const rolesForUpdate = Array.isArray(state.roles) ? state.roles : [];
      return {
        ...state,
        loading: false,
        roles: rolesForUpdate.map((role) => {
          return role.id === action.payload.id ? action.payload : role;
        }),
      };
    }
    case "DELETE_ROLE_SUCCESS": {
      const rolesForDelete = Array.isArray(state.roles) ? state.roles : [];
      return {
        ...state,
        loading: false,
        roles: rolesForDelete.filter((role) => {
          return role.id !== action.payload;
        }),
      };
    }
    default:
      return state;
  }
};

const RoleContext = createContext<{
  state: RoleState;
  fetchRoles: (includeDeleted: boolean) => Promise<void>;
  createRole: (data: Role) => Promise<void>;
  updateRole: (id: number, data: Role) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}>({
  state: initialState,
  fetchRoles: async () => {},
  createRole: async () => {},
  updateRole: async () => {},
  deleteRole: async () => {},
});

export const RoleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(roleReducer, initialState);

  const fetchRoles = async () => {
    dispatch({ type: "FETCH_ROLES_REQUEST" });
    try {
      const roles = await rolesApi.getRoles();
      const rolesArray = Array.isArray(roles) ? roles : [];
      dispatch({
        type: "FETCH_ROLES_SUCCESS",
        payload: rolesArray,
      });
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to get roles");
      dispatch({
        type: "FETCH_ROLES_SUCCESS",
        payload: [],
      });
    }
  };

  const createRole = async (data: Role) => {
    dispatch({ type: "FETCH_ROLES_REQUEST" });
    try {
      const role = await rolesApi.createRole(data);
      dispatch({
        type: "CREATE_ROLE_SUCCESS",
        payload: role,
      });
      toast.success("Success to create role");
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("Failed to create role");
    }
  };

  const updateRole = async (id: number, data: Role) => {
    dispatch({ type: "FETCH_ROLES_REQUEST" });
    try {
      console.log(id, data);
      const role = await rolesApi.updateRole(id, data);
      dispatch({
        type: "UPDATE_ROLE_SUCCESS",
        payload: role,
      });
      toast.success("Success to update role");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const deleteRole = async (id: number) => {
    dispatch({ type: "FETCH_ROLES_REQUEST" });
    try {
      await rolesApi.deleteRole(id);
      dispatch({
        type: "DELETE_ROLE_SUCCESS",
        payload: id,
      });
      toast.success("Success to delete role");
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <RoleContext.Provider
      value={{
        state,
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
