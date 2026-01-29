"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PatronLoginPage() {
  const router = useRouter();
  const { db, setSession, addToast } = useStore();
  
  const handleLogin = (patronId: string) => {
    setSession({ type: "PATRON", id: patronId });
    addToast("Logged in successfully!", "success");
    router.push("/patrons/dashboard");
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Patron Login</h1>
        <p className="text-gray-600">
          Select your patron organization to access the dashboard
        </p>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Available Patrons</h2>
        <div className="space-y-3">
          {db.patrons.map((patron) => (
            <div
              key={patron.id}
              className="flex items-center justify-between p-4 border-2 border-black rounded hover:bg-purple-100 transition-colors"
            >
              <div>
                <h3 className="font-bold text-lg">{patron.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{patron.description}</p>
                <div className="flex flex-wrap gap-1">
                  {patron.standardsTags.map((tag) => (
                    <Badge key={tag} variant="purple" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={() => handleLogin(patron.id)}>
                Login
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Don't have a patron organization yet?
        </p>
        <Button variant="outline" onClick={() => router.push("/patrons/register")}>
          Register New Patron
        </Button>
      </div>
    </div>
  );
}
