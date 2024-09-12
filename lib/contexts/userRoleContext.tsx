"use client";

import { createContext, useContext, ReactNode } from "react";

import useTabSharedState from "@/lib/hooks/tabSharedState";

import { KEY_USER_PROFILE } from "@/lib/config";

type UserRole = string | null;

export type UserRoleContextType = [UserRole, SetState<UserRole>];
export const UserRoleContext = createContext<UserRoleContextType>([
  null,
  () => {},
]);

/**
 * @deprecated please use `use(UserRoleContext)` instead.
 *
 * @returns
 */
export function useUserRole() {
  return useContext(UserRoleContext);
}

export default function UserRoleContextProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const [userRole, setUserRole] = useTabSharedState<UserRole>(
    KEY_USER_PROFILE,
    null,
  );

  return (
    <UserRoleContext.Provider key={userRole} value={[userRole, setUserRole]}>
      {children}
    </UserRoleContext.Provider>
  );
}
