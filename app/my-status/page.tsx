"use client";

import { apiMyUser } from "@/lib/api";
import { use } from "react";

export default function MyStatusPage() {
  const status = use(apiMyUser({})).data;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-foreground">My Status</h2>
      <div className="bg-card shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">
            Name:
          </label>
          <p className="text-foreground">{status.username}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">
            Email:
          </label>
          <p className="text-foreground">{status.email}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">
            Student ID:
          </label>
          <p className="text-foreground">{status.studentId}</p>
        </div>
        <div className="mb-4 bg-accent/10 p-3 rounded">
          <label className="block text-muted-foreground text-sm font-bold mb-2">
            Role:
          </label>
          <p className="text-foreground">{status.role}</p>
        </div>
      </div>
    </div>
  );
}
