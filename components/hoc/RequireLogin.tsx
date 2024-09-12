"use client";

import { use } from "react";
import { UserRoleContext } from "@/lib/contexts/userRoleContext";
import { useRouter } from "next/navigation";

export default function RequireLogin({
  children,
}: React.PropsWithChildren<unknown>) {
  const [access_token] = use(UserRoleContext);
  const route = useRouter();

  if (access_token === null) {
    route.replace("/login");
  }

  return children;
}
