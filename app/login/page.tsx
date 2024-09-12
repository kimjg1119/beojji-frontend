"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { apiAuthLogin } from "@/lib/api";

import { UserRoleContext } from "@/lib/contexts/userRoleContext";

export default function LoginPage() {
  const [userRole, setUserRole] = use(UserRoleContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiAuthLogin(credentials);
      const token = data.access_token;
      if (token) {
        setUserRole(token);
        route.push("/");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">

    </div>
  );
}
