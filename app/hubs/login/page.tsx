"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HubLoginPage() {
  const router = useRouter();
  const { db, setSession, addToast } = useStore();
  
  const handleLogin = (hubId: string) => {
    setSession({ type: "HUB", id: hubId });
    addToast("Logged in successfully!", "success");
    router.push("/hubs/dashboard");
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Hub Login</h1>
        <p className="text-gray-600">
          Select your hub to access the dashboard
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Available Hubs</h2>
        <div className="space-y-3">
          {db.hubs.map((hub) => (
            <div
              key={hub.id}
              className="flex items-center justify-between p-4 border-2 border-black rounded hover:bg-accent1 transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg">{hub.name}</h3>
                <p className="text-sm text-gray-600">{hub.address}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">Credits: {hub.creditBalance}</Badge>
                  <Badge variant="accent2">
                    Residencies: {hub.residencies.length}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => handleLogin(hub.id)}>
                Login
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Don't have a hub yet?
        </p>
        <Button variant="outline" onClick={() => router.push("/hubs/register")}>
          Register New Hub
        </Button>
      </div>
    </div>
  );
}
