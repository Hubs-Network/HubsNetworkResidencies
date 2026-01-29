"use client";

import React, { useState } from "react";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { Hub, Residency, ResidencyType } from "@/lib/types";
import { createResidency, updateHub, updateResidency } from "@/lib/mockDb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResidencyCard } from "./ResidencyCard";

interface ResidenciesTabProps {
  hub: Hub;
}

export function ResidenciesTab({ hub }: ResidenciesTabProps) {
  const { refreshDb, addToast, db } = useStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "OPEN_APPLICATION" as ResidencyType,
    title: "",
    description: "",
    giinTags: "",
    complianceFactors: "",
    creditAllocated: 10,
    taggedPatronIds: [] as string[],
  });
  
  const openResidencies = hub.residencies.filter((r) => r.status === "SUBMISSIONS_OPEN");
  const runningResidencies = hub.residencies.filter((r) => r.status === "RUNNING");
  const closedResidencies = hub.residencies.filter((r) => r.status === "CLOSED");
  
  const handleCreateResidency = (e: React.FormEvent) => {
    e.preventDefault();
    
    const residency: Residency = {
      id: `res-${nanoid(8)}`,
      hubId: hub.id,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      giinTags: formData.giinTags.split(",").map((t) => t.trim()).filter(Boolean),
      complianceFactors: formData.complianceFactors.split(",").map((t) => t.trim()).filter(Boolean),
      status: "SUBMISSIONS_OPEN",
      creditAllocated: formData.creditAllocated,
      taggedPatronIds: formData.taggedPatronIds,
      submissions: [],
      thread: { id: `thread-${nanoid(8)}`, messages: [] },
      logPosts: [],
    };
    
    createResidency(hub.id, residency);
    // Credits will be deducted when the residency is closed, not now
    refreshDb();
    addToast("Residency created successfully!", "success");
    setCreateModalOpen(false);
    setFormData({
      type: "OPEN_APPLICATION",
      title: "",
      description: "",
      giinTags: "",
      complianceFactors: "",
      creditAllocated: 10,
      taggedPatronIds: [],
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Your Residencies</h3>
        <Button onClick={() => setCreateModalOpen(true)}>
          Create New Residency
        </Button>
      </div>

      {hub.residencies.length === 0 ? (
        <EmptyState
          title="No residencies yet"
          description="Create your first residency to start attracting pilgrims"
          action={{
            label: "Create Residency",
            onClick: () => setCreateModalOpen(true),
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Open Submissions */}
          {openResidencies.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Badge variant="green">Submissions Open</Badge>
                ({openResidencies.length})
              </h4>
              <div className="space-y-4">
                {openResidencies.map((res) => (
                  <ResidencyCard key={res.id} residency={res} hub={hub} />
                ))}
              </div>
            </div>
          )}

          {/* Running */}
          {runningResidencies.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Badge variant="accent1">Running</Badge>
                ({runningResidencies.length})
              </h4>
              <div className="space-y-4">
                {runningResidencies.map((res) => (
                  <ResidencyCard key={res.id} residency={res} hub={hub} />
                ))}
              </div>
            </div>
          )}

          {/* Closed */}
          {closedResidencies.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Badge variant="purple">Closed</Badge>
                ({closedResidencies.length})
              </h4>
              <div className="space-y-4">
                {closedResidencies.map((res) => (
                  <ResidencyCard key={res.id} residency={res} hub={hub} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Residency Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Residency"
        size="lg"
      >
        <form onSubmit={handleCreateResidency} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="OPEN_APPLICATION"
                  checked={formData.type === "OPEN_APPLICATION"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ResidencyType })}
                />
                <span>Open Application</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="SPECIFIC_PR"
                  checked={formData.type === "SPECIFIC_PR"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ResidencyType })}
                />
                <span>Specific PR</span>
              </label>
            </div>
          </div>

          <Input
            label="Title *"
            placeholder="Digital Art Residency"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Description *"
            placeholder="Describe the residency opportunity..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <Input
            label="GIIN Tags (comma-separated)"
            placeholder="Arts & Culture, Technology"
            value={formData.giinTags}
            onChange={(e) => setFormData({ ...formData, giinTags: e.target.value })}
          />

          <Input
            label="Compliance Factors (comma-separated)"
            placeholder="Open Source, Community Impact"
            value={formData.complianceFactors}
            onChange={(e) => setFormData({ ...formData, complianceFactors: e.target.value })}
          />

          <Input
            label="Credits to Allocate *"
            type="number"
            min="1"
            max={hub.creditBalance}
            value={formData.creditAllocated}
            onChange={(e) => setFormData({ ...formData, creditAllocated: parseInt(e.target.value) })}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Tag Patrons (optional)</label>
            <div className="space-y-2">
              {db.patrons.map((patron) => (
                <label key={patron.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.taggedPatronIds.includes(patron.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          taggedPatronIds: [...formData.taggedPatronIds, patron.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          taggedPatronIds: formData.taggedPatronIds.filter((id) => id !== patron.id),
                        });
                      }
                    }}
                  />
                  <span>{patron.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Create Residency
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
