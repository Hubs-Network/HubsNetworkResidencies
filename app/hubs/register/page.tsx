"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { createHub } from "@/lib/mockDb";
import { Hub } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function RegisterHubPage() {
  const router = useRouter();
  const { refreshDb, addToast, session, db } = useStore();
  
  // Check if already logged in as a hub
  const isLoggedInAsHub = session.type === "HUB";
  const currentHub = isLoggedInAsHub ? db.hubs.find(h => h.id === session.id) : null;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contact: "",
    links: "",
    impactTags: "",
    esgImpactText: "",
    kpiTags: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hub: Hub = {
      id: `hub-${nanoid(8)}`,
      name: formData.name,
      description: formData.description,
      address: formData.address,
      contact: formData.contact,
      links: formData.links.split(",").map((l) => l.trim()).filter(Boolean),
      impactTags: formData.impactTags.split(",").map((t) => t.trim()).filter(Boolean),
      esgImpactText: formData.esgImpactText,
      kpiTags: formData.kpiTags.split(",").map((t) => t.trim()).filter(Boolean),
      menuItems: [],
      creditBalance: 100,
      residencies: [],
      lat: 40 + Math.random() * 20,
      lng: -10 + Math.random() * 30,
    };
    
    createHub(hub);
    refreshDb();
    addToast("Hub registered successfully!", "success");
    router.push("/hubs");
  };
  
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Register Hub</h1>
        <p className="text-gray-600">
          Create a new hub to offer residencies and resources
        </p>
      </div>

      {/* Already logged in warning */}
      {isLoggedInAsHub && currentHub && (
        <Card className="bg-accent1 border-4">
          <div className="space-y-3">
            <h3 className="font-bold">⚠️ Already Logged In</h3>
            <p className="text-sm">
              You're currently logged in as <strong>{currentHub.name}</strong>.
              If you want to register a new hub, please logout first using the Session Switcher.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/hubs/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/hubs")}>
                Browse Hubs
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Hub Name *"
            placeholder="The Creative Hub"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Description *"
            placeholder="A collaborative space for artists and makers..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <Input
            label="Address *"
            placeholder="123 Main St, Amsterdam"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <Input
            label="Contact Email *"
            type="email"
            placeholder="info@creativehub.example"
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
            label="Impact Tags (comma-separated)"
            placeholder="Arts, Community, Education"
            value={formData.impactTags}
            onChange={(e) => setFormData({ ...formData, impactTags: e.target.value })}
          />

          <Textarea
            label="ESG Impact Statement"
            placeholder="Describe your environmental, social, and governance impact..."
            value={formData.esgImpactText}
            onChange={(e) => setFormData({ ...formData, esgImpactText: e.target.value })}
            rows={3}
          />

          <Input
            label="KPI Tags (GIIN Taxonomy, comma-separated)"
            placeholder="Arts & Culture, Employment Generation, Community Development"
            value={formData.kpiTags}
            onChange={(e) => setFormData({ ...formData, kpiTags: e.target.value })}
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Register Hub
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
