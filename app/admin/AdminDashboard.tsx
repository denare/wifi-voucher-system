"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminDashboard({ users }: { users: any[] }) {
  const [stats, setStats] = useState({
    activeUsers: users?.length || 0,
  });

  const router = useRouter();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Active Users: {stats.activeUsers}</p>
      <Button onClick={() => router.push("/")}>Go Home</Button>

      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
