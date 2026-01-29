"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PilgrimLoginPage() {
  const router = useRouter();
  const { db, setSession, addToast } = useStore();
  
  const handleLogin = (pilgrimId: string) => {
    setSession({ type: "PILGRIM", id: pilgrimId });
    addToast("Logged in successfully!", "success");
    router.push("/pilgrims/dashboard");
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Pilgrim Login</h1>
        <p className="text-gray-600">
          Select your pilgrim profile to access the dashboard
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Available Pilgrims</h2>
        <div className="space-y-3">
          {db.pilgrims.map((pilgrim) => (
            <div
              key={pilgrim.id}
              className="flex items-center justify-between p-4 border-2 border-black rounded hover:bg-accent2 transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg">{pilgrim.name}</h3>
                {pilgrim.alias && (
                  <p className="text-sm text-gray-600">@{pilgrim.alias}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">Credits: {pilgrim.creditBalance}</Badge>
                  <Badge variant="accent1">
                    Reputation: {pilgrim.reputationScore}
                  </Badge>
                  <Badge variant="gray">
                    Residencies: {pilgrim.residencies.length}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => handleLogin(pilgrim.id)}>
                Login
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Don't have a profile yet?
        </p>
        <Button variant="outline" onClick={() => router.push("/pilgrims/register")}>
          Register New Pilgrim
        </Button>
      </div>
    </div>
  );
}
