"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { createPatron } from "@/lib/mockDb";
import { Patron } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function RegisterPatronPage() {
  const router = useRouter();
  const { refreshDb, addToast, session, db } = useStore();
  
  // Check if already logged in as a patron
  const isLoggedInAsPatron = session.type === "PATRON";
  const currentPatron = isLoggedInAsPatron ? db.patrons.find(p => p.id === session.id) : null;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact: "",
    links: "",
    standardsTags: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patron: Patron = {
      id: `patron-${nanoid(8)}`,
      name: formData.name,
      description: formData.description,
      contact: formData.contact,
      links: formData.links.split(",").map((l) => l.trim()).filter(Boolean),
      standardsTags: formData.standardsTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    
    createPatron(patron);
    refreshDb();
    addToast("Patron registered successfully!", "success");
    router.push("/patrons");
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Register Patron</h1>
        <p className="text-gray-600">
          Create a new patron profile to support residency programs
        </p>
      </div>

      {/* Already logged in warning */}
      {isLoggedInAsPatron && currentPatron && (
        <Card className="bg-purple-100 border-4 border-purple-500">
          <div className="space-y-3">
            <h3 className="font-bold">⚠️ Already Logged In</h3>
            <p className="text-sm">
              You're currently logged in as <strong>{currentPatron.name}</strong>.
              If you want to register a new patron, please logout first using the Session Switcher.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/patrons/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/patrons")}>
                Browse Patrons
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Organization Name *"
            placeholder="Creative Arts Foundation"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Description *"
            placeholder="Supporting emerging artists and creative projects..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <Input
            label="Contact Email *"
            type="email"
            placeholder="grants@foundation.example"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
          />

          <Input
            label="Links (comma-separated)"
            placeholder="https://website.com, https://social.com"
            value={formData.links}
            onChange={(e) => setFormData({ ...formData, links: e.target.value })}
          />

          <Input
            label="Standards Tags (comma-separated)"
            placeholder="B-Corp, ESG Certified, Open Source"
            value={formData.standardsTags}
            onChange={(e) => setFormData({ ...formData, standardsTags: e.target.value })}
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Register Patron
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
