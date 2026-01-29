"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { addSubmission, transferCredits, generateTxHash, updateResidency, updatePilgrim } from "@/lib/mockDb";
import { Submission, Residency } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PilgrimDashboardPage() {
  const router = useRouter();
  const { session, db, refreshDb, addToast } = useStore();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [spendModalOpen, setSpendModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedResidency, setSelectedResidency] = useState<Residency | null>(null);
  const [selectedClosedResidency, setSelectedClosedResidency] = useState<Residency | null>(null);
  
  const [applyData, setApplyData] = useState({
    text: "",
    proposedTitle: "",
    proposedDescription: "",
  });
  
  const [spendData, setSpendData] = useState({
    itemCode: "",
  });
  
  const [feedbackData, setFeedbackData] = useState({
    agree: true,
    motivation: "",
  });
  
  if (session.type !== "PILGRIM" || !session.id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in as a Pilgrim to access this dashboard
        </p>
        <Button onClick={() => router.push("/pilgrims")}>
          Browse Pilgrims
        </Button>
      </div>
    );
  }
  
  const pilgrim = db.pilgrims.find((p) => p.id === session.id);
  
  if (!pilgrim) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Pilgrim Not Found</h2>
        <Button onClick={() => router.push("/pilgrims")}>
          Browse Pilgrims
        </Button>
      </div>
    );
  }
  
  // Get all open residencies
  const openResidencies = db.hubs
    .flatMap((h) =>
      h.residencies
        .filter((r) => r.status === "SUBMISSIONS_OPEN")
        .map((r) => ({ ...r, hub: h }))
    );
  
  // Get pilgrim's running residencies
  const runningResidencies = pilgrim.residencies
    .filter((pr) => pr.status === "RUNNING")
    .map((pr) => {
      const residency = db.hubs.flatMap((h) => h.residencies).find((r) => r.id === pr.residencyId);
      const hub = db.hubs.find((h) => h.id === residency?.hubId);
      return { ...pr, residency, hub };
    })
    .filter((item) => item.residency);
  
  // Get closed residencies awaiting feedback
  const closedResidencies = pilgrim.residencies
    .filter((pr) => pr.status === "CLOSED")
    .map((pr) => {
      const residency = db.hubs.flatMap((h) => h.residencies).find((r) => r.id === pr.residencyId);
      const hub = db.hubs.find((h) => h.id === residency?.hubId);
      return { ...pr, residency, hub };
    })
    .filter((item) => item.residency && !item.residency.dispute);
  
  const handleOpenApply = (residency: Residency) => {
    setSelectedResidency(residency);
    setApplyData({ text: "", proposedTitle: "", proposedDescription: "" });
    setApplyModalOpen(true);
  };
  
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidency) return;
    
    const submission: Submission = {
      id: `sub-${nanoid(8)}`,
      residencyId: selectedResidency.id,
      pilgrimId: pilgrim.id,
      text: applyData.text,
      proposedTitle: selectedResidency.type === "OPEN_APPLICATION" ? applyData.proposedTitle : undefined,
      proposedDescription: selectedResidency.type === "OPEN_APPLICATION" ? applyData.proposedDescription : undefined,
      createdAt: new Date().toISOString(),
      vouches: [],
    };
    
    addSubmission(selectedResidency.id, submission);
    refreshDb();
    addToast("Application submitted!", "success");
    setApplyModalOpen(false);
  };
  
  const handleSpend = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the hub with this menu item
    let foundHub = null;
    let foundItem = null;
    
    for (const hub of db.hubs) {
      const item = hub.menuItems.find((i) => i.code === spendData.itemCode.toUpperCase());
      if (item) {
        foundHub = hub;
        foundItem = item;
        break;
      }
    }
    
    if (!foundItem || !foundHub) {
      addToast("Item code not found", "error");
      return;
    }
    
    if (pilgrim.creditBalance < foundItem.priceCredits) {
      addToast("Insufficient credits", "error");
      return;
    }
    
    const success = transferCredits("PILGRIM", pilgrim.id, foundItem.priceCredits, true);
    if (success) {
      const txHash = generateTxHash();
      addToast(`Spent ${foundItem.priceCredits} credits! TX: ${txHash.substring(0, 10)}...`, "success");
      refreshDb();
      setSpendModalOpen(false);
      setSpendData({ itemCode: "" });
    } else {
      addToast("Transaction failed", "error");
    }
  };
  
  const handleOpenFeedback = (residency: Residency) => {
    setSelectedClosedResidency(residency);
    setFeedbackData({ agree: true, motivation: "" });
    setFeedbackModalOpen(true);
  };
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClosedResidency) return;
    
    if (feedbackData.agree) {
      addToast("Feedback accepted. Thank you!", "success");
    } else {
      // Create dispute
      const agreementFactor = selectedClosedResidency.closing
        ? (selectedClosedResidency.closing.score0to100 / 100)
        : 0.5;
      
      updateResidency(selectedClosedResidency.id, {
        dispute: {
          status: "PENDING",
          motivation: feedbackData.motivation,
          agreementToDisagreementFactor: agreementFactor,
        },
      });
      
      addToast("Dispute created. Agreement-to-Disagreement factor recorded.", "info");
    }
    
    refreshDb();
    setFeedbackModalOpen(false);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{pilgrim.name} Dashboard</h1>
        <p className="text-gray-600">Apply for residencies, manage your work, and spend credits</p>
      </div>

      {/* What you can do banner */}
      <Card className="bg-accent2 border-2 border-black">
        <h3 className="font-bold mb-2">🎯 What you can do as a Pilgrim:</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Browse and apply to open residencies</li>
          <li>✓ Spend your credits on hub menu items</li>
          <li>✓ Add posts to your running residency logs</li>
          <li>✓ Provide feedback on closed residencies (agree/dispute scores)</li>
          <li>✓ Build your reputation through successful residencies</li>
          <li>✓ View your residency history and earned credits</li>
        </ul>
      </Card>

      {/* Credit Balance */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Credit Balance</h3>
            <div className="text-3xl font-bold">{pilgrim.creditBalance}</div>
          </div>
          <Button variant="secondary" onClick={() => setSpendModalOpen(true)}>
            Spend Credits
          </Button>
        </div>
      </Card>

      {/* Open Residencies */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Open Residencies</h2>
        {openResidencies.length === 0 ? (
          <EmptyState
            title="No open residencies"
            description="Check back later for new opportunities"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {openResidencies.map((item) => (
              <Card key={item.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.hub.name}</p>
                    </div>
                    <Badge variant={item.type === "OPEN_APPLICATION" ? "accent2" : "accent1"}>
                      {item.type === "OPEN_APPLICATION" ? "Open" : "Specific"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-semibold">{item.creditAllocated}</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenApply(item)}
                  >
                    Apply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Running Residencies */}
      {runningResidencies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Running Residencies</h2>
          <div className="space-y-4">
            {runningResidencies.map((item) => (
              <Card key={item.residencyId}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{item.residency?.title}</h4>
                      <p className="text-sm text-gray-600">{item.hub?.name}</p>
                    </div>
                    <Badge variant="accent1">Running</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Role: {item.role} • Continue working and posting logs!
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Closed Residencies Awaiting Feedback */}
      {closedResidencies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Feedback Needed</h2>
          <div className="space-y-4">
            {closedResidencies.map((item) => (
              <Card key={item.residencyId}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{item.residency?.title}</h4>
                      <p className="text-sm text-gray-600">{item.hub?.name}</p>
                    </div>
                    <Badge variant="purple">Closed</Badge>
                  </div>

                  {item.residency?.closing && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hub's Score:</span>
                      <span className="font-semibold">{item.residency.closing.score0to100}/100</span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOpenFeedback(item.residency!)}
                  >
                    Provide Feedback
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply: ${selectedResidency?.title}`}
        size="lg"
      >
        <form onSubmit={handleApply} className="space-y-6">
          {selectedResidency?.type === "OPEN_APPLICATION" && (
            <>
              <Input
                label="Proposed Title *"
                placeholder="Your project title"
                value={applyData.proposedTitle}
                onChange={(e) => setApplyData({ ...applyData, proposedTitle: e.target.value })}
                required
              />

              <Textarea
                label="Proposed Description *"
                placeholder="Describe what you plan to work on..."
                value={applyData.proposedDescription}
                onChange={(e) => setApplyData({ ...applyData, proposedDescription: e.target.value })}
                rows={4}
                required
              />
            </>
          )}

          <Textarea
            label="Application Text *"
            placeholder="Why are you a good fit for this residency?"
            value={applyData.text}
            onChange={(e) => setApplyData({ ...applyData, text: e.target.value })}
            rows={6}
            required
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setApplyModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Spend Modal */}
      <Modal
        isOpen={spendModalOpen}
        onClose={() => setSpendModalOpen(false)}
        title="Spend Credits"
        size="md"
      >
        <form onSubmit={handleSpend} className="space-y-6">
          <p className="text-gray-600">
            Enter a menu item code to spend credits on hub services
          </p>

          <Input
            label="Item Code *"
            placeholder="DESK001"
            value={spendData.itemCode}
            onChange={(e) => setSpendData({ itemCode: e.target.value.toUpperCase() })}
            required
          />

          <div className="bg-accent1 border-2 border-black rounded p-4">
            <h4 className="font-bold mb-2">Available Menu Items</h4>
            <div className="space-y-2 text-sm">
              {db.hubs.flatMap((h) =>
                h.menuItems.map((item) => (
                  <div key={`${h.id}-${item.code}`} className="flex justify-between">
                    <span>
                      <code className="bg-white px-2 py-1 rounded">{item.code}</code> - {item.title}
                    </span>
                    <span className="font-semibold">{item.priceCredits} credits</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Spend Credits
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSpendModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Residency Feedback"
        size="md"
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          {selectedClosedResidency?.closing && (
            <div className="bg-gray-100 border-2 border-black rounded p-4">
              <h4 className="font-bold mb-2">Hub's Evaluation</h4>
              <div className="text-2xl font-bold mb-2">
                {selectedClosedResidency.closing.score0to100}/100
              </div>
              <div className="space-y-1 text-sm">
                {selectedClosedResidency.closing.evaluationFields.map((field) => (
                  <div key={field.key} className="flex justify-between">
                    <span className="capitalize">{field.key.replace(/_/g, " ")}:</span>
                    <span className="font-semibold">
                      {typeof field.value === "boolean" ? (field.value ? "Yes" : "No") : field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3">Do you agree with this evaluation?</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="agree"
                  checked={feedbackData.agree}
                  onChange={() => setFeedbackData({ ...feedbackData, agree: true })}
                />
                <span>Yes, I agree</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="agree"
                  checked={!feedbackData.agree}
                  onChange={() => setFeedbackData({ ...feedbackData, agree: false })}
                />
                <span>No, I disagree (create dispute)</span>
              </label>
            </div>
          </div>

          {!feedbackData.agree && (
            <Textarea
              label="Dispute Motivation *"
              placeholder="Explain why you disagree with the evaluation..."
              value={feedbackData.motivation}
              onChange={(e) => setFeedbackData({ ...feedbackData, motivation: e.target.value })}
              rows={4}
              required
            />
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Submit Feedback
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFeedbackModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
