"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { createPilgrim } from "@/lib/mockDb";
import { Pilgrim } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPilgrimPage() {
  const router = useRouter();
  const { refreshDb, addToast, session, db } = useStore();
  
  // Check if already logged in as a pilgrim
  const isLoggedInAsPilgrim = session.type === "PILGRIM";
  const currentPilgrim = isLoggedInAsPilgrim ? db.pilgrims.find(p => p.id === session.id) : null;
  
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    ens: "",
    tags: "",
    skills: "",
    referralCode: "",
  });
  
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate referral code (accept HN000-HN999)
    const referralPattern = /^HN\d{3}$/;
    if (!referralPattern.test(formData.referralCode)) {
      setError("Invalid referral code. Use format: HN000");
      return;
    }
    
    const pilgrim: Pilgrim = {
      id: `pilgrim-${nanoid(8)}`,
      name: formData.name,
      alias: formData.alias || undefined,
      ens: formData.ens || undefined,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      skills: formData.skills.split(",").map((t) => t.trim()).filter(Boolean),
      referrals: [],
      referralCodeUsed: formData.referralCode,
      creditBalance: 0,
      reputationScore: 0,
      residencies: [],
      lastActiveSeason: 0,
    };
    
    createPilgrim(pilgrim);
    refreshDb();
    addToast("Pilgrim registered successfully!", "success");
    router.push("/pilgrims");
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Register Pilgrim</h1>
        <p className="text-gray-600">
          Create a new pilgrim profile to apply for residencies
        </p>
      </div>

      {/* Already logged in warning */}
      {isLoggedInAsPilgrim && currentPilgrim && (
        <Card className="bg-accent2 border-4">
          <div className="space-y-3">
            <h3 className="font-bold">⚠️ Already Logged In</h3>
            <p className="text-sm">
              You're currently logged in as <strong>{currentPilgrim.name}</strong>.
              If you want to register a new pilgrim, please logout first using the Session Switcher.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/pilgrims/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/pilgrims")}>
                Browse Pilgrims
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Referral Code *"
            placeholder="HN000"
            value={formData.referralCode}
            onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
            error={error}
            required
          />

          <Input
            label="Full Name *"
            placeholder="Alice Martinez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Alias"
            placeholder="alice.eth"
            value={formData.alias}
            onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
          />

          <Input
            label="ENS Name"
            placeholder="alice.eth"
            value={formData.ens}
            onChange={(e) => setFormData({ ...formData, ens: e.target.value })}
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="Artist, Creative, Digital Media"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />

          <Input
            label="Skills (comma-separated)"
            placeholder="Generative Art, Processing, TouchDesigner"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />

          <div className="bg-accent1 border-2 border-black rounded p-4">
            <h3 className="font-bold mb-2">Referral Code Info</h3>
            <p className="text-sm text-gray-700">
              A valid referral code is required to register. For this demo, use any code 
              in the format <code className="bg-white px-2 py-1 rounded">HN000</code> through{" "}
              <code className="bg-white px-2 py-1 rounded">HN999</code>.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Register Pilgrim
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
