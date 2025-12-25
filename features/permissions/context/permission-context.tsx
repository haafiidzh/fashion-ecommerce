"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Permission, PermissionState } from "../types/permission-types";
import { permissionApi } from "../service/permission-service";
import { toast } from "sonner";

const initialState: PermissionState = {
  permissions: [],
  loading: false,
};

type PermissionAction =
  | { type: "FETCH_PERMISSIONS_REQUEST" }
  | { type: "FETCH_PERMISSIONS_SUCCESS"; payload: Permission[] }
  | { type: "CREATE_PERMISSION_SUCCESS"; payload: Permission }
  | { type: "UPDATE_PERMISSION_SUCCESS"; payload: Permission }
  | { type: "DELETE_PERMISSION_SUCCESS"; payload: number };

const permissionReducer = (state: PermissionState, action: PermissionAction): PermissionState => {
  switch (action.type) {
    case "FETCH_PERMISSIONS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PERMISSIONS_SUCCESS":
      return { ...state, loading: false, permissions: action.payload };
    case "CREATE_PERMISSION_SUCCESS":
      const currentPermissions = Array.isArray(state.permissions) ? state.permissions : [];
      return {
        ...state,
        loading: false,
        permissions: [...currentPermissions, action.payload],
      };
    case "UPDATE_PERMISSION_SUCCESS":
      const permissionsForUpdate = Array.isArray(state.permissions) ? state.permissions : [];
      return {
        ...state,
        loading: false,
        permissions: permissionsForUpdate.map((permission) => permission.id === action.payload.id ? action.payload : permission),
      };
    case "DELETE_PERMISSION_SUCCESS":
      const permissionsForDelete = Array.isArray(state.permissions) ? state.permissions : [];
      return {
        ...state,
        loading: false,
        permissions: permissionsForDelete.filter((permission) => permission.id !== action.payload),
      };
    default:
      return state;
  }
};

const PermissionContext = createContext<{
  state: PermissionState;
  fetchPermissions: () => Promise<void>;
  createPermission: (data: Permission) => Promise<void>;
  updatePermission: (id: number, data: Permission) => Promise<void>;
  deletePermission: (id: number) => Promise<void>;
}>({
  state: initialState,
  fetchPermissions: async () => {},
  createPermission: async () => {},
  updatePermission: async () => {},
  deletePermission: async () => {},
});

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(permissionReducer, initialState);

  const fetchPermissions = async () => {
    dispatch({ type: "FETCH_PERMISSIONS_REQUEST" });
    try {
      const permissions = await permissionApi.getPermissions();
      dispatch({ type: "FETCH_PERMISSIONS_SUCCESS", payload: permissions });
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error("Failed to get permissions");

    }
  };

  const createPermission = async (data: Permission) => {
    dispatch({ type: "FETCH_PERMISSIONS_REQUEST" });
    try {
      const permission = await permissionApi.createPermission(data);
      dispatch({ type: "CREATE_PERMISSION_SUCCESS", payload: permission });
      toast.success("Success to create permission");
    } catch (error) {
      console.error("Failed to create permission:", error);
      toast.error("Failed to create permission");
    }
  };

  const updatePermission = async (id: number, data: Permission) => {
    dispatch({ type: "FETCH_PERMISSIONS_REQUEST" });
    try {
      console.log(id, data);
      const permission = await permissionApi.updatePermission(id, data);
      dispatch({ type: "UPDATE_PERMISSION_SUCCESS", payload: permission });
      toast.success("Success to update permission");
    } catch (error) {
      console.error("Failed to update permission:", error);
      toast.error("Failed to update permission");
    }
  };

  const deletePermission = async (id: number) => {
    dispatch({ type: "FETCH_PERMISSIONS_REQUEST" });
    try {
      console.log(id);
      await permissionApi.deletePermission(id);
      dispatch({ type: "DELETE_PERMISSION_SUCCESS", payload: id });
      toast.success("Success to delete permission");
    } catch (error) {
      console.error("Failed to delete permission:", error);
      toast.error("Failed to delete permission");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        state,
        fetchPermissions,
        createPermission,
        updatePermission,
        deletePermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  return useContext(PermissionContext);
};