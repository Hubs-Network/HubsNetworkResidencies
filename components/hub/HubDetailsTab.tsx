"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Hub } from "@/lib/types";
import { updateHub } from "@/lib/mockDb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface HubDetailsTabProps {
  hub: Hub;
}

export function HubDetailsTab({ hub }: HubDetailsTabProps) {
  const { refreshDb, addToast } = useStore();
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: hub.name,
    description: hub.description,
    address: hub.address,
    contact: hub.contact,
    links: hub.links.join(", "),
    impactTags: hub.impactTags.join(", "),
    esgImpactText: hub.esgImpactText,
    kpiTags: hub.kpiTags.join(", "),
  });
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateHub(hub.id, {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      contact: formData.contact,
      links: formData.links.split(",").map((l) => l.trim()).filter(Boolean),
      impactTags: formData.impactTags.split(",").map((t) => t.trim()).filter(Boolean),
      esgImpactText: formData.esgImpactText,
      kpiTags: formData.kpiTags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    
    refreshDb();
    addToast("Hub details updated!", "success");
    setEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({
      name: hub.name,
      description: hub.description,
      address: hub.address,
      contact: hub.contact,
      links: hub.links.join(", "),
      impactTags: hub.impactTags.join(", "),
      esgImpactText: hub.esgImpactText,
      kpiTags: hub.kpiTags.join(", "),
    });
    setEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Hub Details</h3>
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Details</Button>
        )}
      </div>

      {editing ? (
        <Card>
          <form onSubmit={handleSave} className="space-y-6">
            <Input
              label="Hub Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Textarea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />

            <Input
              label="Address *"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <Input
              label="Contact Email *"
              type="email"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />

            <Input
              label="Links (comma-separated)"
              value={formData.links}
              onChange={(e) => setFormData({ ...formData, links: e.target.value })}
            />

            <Input
              label="Impact Tags (comma-separated)"
              value={formData.impactTags}
              onChange={(e) => setFormData({ ...formData, impactTags: e.target.value })}
            />

            <Textarea
              label="ESG Impact Statement"
              value={formData.esgImpactText}
              onChange={(e) => setFormData({ ...formData, esgImpactText: e.target.value })}
              rows={3}
            />

            <Input
              label="KPI Tags (GIIN Taxonomy, comma-separated)"
              value={formData.kpiTags}
              onChange={(e) => setFormData({ ...formData, kpiTags: e.target.value })}
            />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Name</h4>
              <p>{hub.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Description</h4>
              <p>{hub.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Address</h4>
              <p>{hub.address}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Contact</h4>
              <p>{hub.contact}</p>
            </div>

            {hub.links.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Links</h4>
                <ul className="list-disc list-inside">
                  {hub.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Impact Tags</h4>
              <p>{hub.impactTags.join(", ")}</p>
            </div>

            {hub.esgImpactText && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">ESG Impact</h4>
                <p>{hub.esgImpactText}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">KPI Tags</h4>
              <p>{hub.kpiTags.join(", ")}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
