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
import { addVouch, generateTxHash } from "@/lib/mockDb";
import { Vouch, Submission, Residency } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PatronDashboardPage() {
  const router = useRouter();
  const { session, db, refreshDb, addToast } = useStore();
  const [vouchModalOpen, setVouchModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{
    submission: Submission;
    residency: Residency;
  } | null>(null);
  
  const [vouchData, setVouchData] = useState({
    type: "fiat" as "fiat" | "token",
    amountFiat: 100,
    tokenContract: "",
    tokenAmount: 1000,
    requirementsText: "",
  });
  
  if (session.type !== "PATRON" || !session.id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in as a Patron to access this dashboard
        </p>
        <Button onClick={() => router.push("/patrons")}>
          Browse Patrons
        </Button>
      </div>
    );
  }
  
  const patron = db.patrons.find((p) => p.id === session.id);
  
  if (!patron) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Patron Not Found</h2>
        <Button onClick={() => router.push("/patrons")}>
          Browse Patrons
        </Button>
      </div>
    );
  }
  
  // Get all open residencies where this patron is tagged
  const taggedResidencies = db.hubs
    .flatMap((h) =>
      h.residencies
        .filter((r) => r.status === "SUBMISSIONS_OPEN" && r.taggedPatronIds.includes(patron.id))
        .map((r) => ({ ...r, hub: h }))
    );
  
  // Get all open residencies (not just tagged)
  const allOpenResidencies = db.hubs
    .flatMap((h) =>
      h.residencies
        .filter((r) => r.status === "SUBMISSIONS_OPEN")
        .map((r) => ({ ...r, hub: h }))
    );
  
  const handleOpenVouch = (submission: Submission, residency: Residency) => {
    setSelectedSubmission({ submission, residency });
    setVouchData({
      type: "fiat",
      amountFiat: 100,
      tokenContract: "",
      tokenAmount: 1000,
      requirementsText: "",
    });
    setVouchModalOpen(true);
  };
  
  const handleVouch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    
    const txHash = generateTxHash();
    
    const vouch: Vouch = {
      id: `vouch-${nanoid(8)}`,
      byType: "PATRON",
      byId: patron.id,
      amountFiat: vouchData.type === "fiat" ? vouchData.amountFiat : undefined,
      token:
        vouchData.type === "token"
          ? { contract: vouchData.tokenContract, amount: vouchData.tokenAmount }
          : undefined,
      committed: true,
      txHash,
      requirementsText: vouchData.requirementsText || undefined,
    };
    
    addVouch(selectedSubmission.residency.id, selectedSubmission.submission.id, vouch);
    refreshDb();
    addToast(`Vouch committed! TX: ${txHash.substring(0, 10)}...`, "success");
    setVouchModalOpen(false);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{patron.name} Dashboard</h1>
        <p className="text-gray-600">Browse residencies and vouch for promising applications</p>
      </div>

      {/* What you can do banner */}
      <Card className="bg-purple-100 border-2 border-purple-500">
        <h3 className="font-bold mb-2">🎯 What you can do as a Patron:</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Browse residencies with open submissions</li>
          <li>✓ Review pilgrim applications and their profiles</li>
          <li>✓ Vouch for promising applications with fiat or tokens</li>
          <li>✓ Support projects aligned with your organization's values</li>
          <li>✓ Track residencies you've been tagged in</li>
          <li>✓ Sign transactions to commit your vouching support</li>
        </ul>
      </Card>

      {/* Tagged Residencies */}
      {taggedResidencies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Residencies Tagged for You ({taggedResidencies.length})
          </h2>
          <div className="space-y-6">
            {taggedResidencies.map((item) => (
              <Card key={item.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.hub.name}</p>
                    </div>
                    <Badge variant="green">Open</Badge>
                  </div>

                  <p className="text-gray-600">{item.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {item.giinTags.map((tag) => (
                      <Badge key={tag} variant="gray" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Submissions */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      Applications ({item.submissions.length})
                    </h4>
                    {item.submissions.length === 0 ? (
                      <p className="text-sm text-gray-600">No applications yet</p>
                    ) : (
                      <div className="space-y-3">
                        {item.submissions.map((sub) => {
                          const pilgrim = db.pilgrims.find((p) => p.id === sub.pilgrimId);
                          const hasVouched = sub.vouches.some(
                            (v) => v.byType === "PATRON" && v.byId === patron.id
                          );
                          return (
                            <div
                              key={sub.id}
                              className="border-2 border-gray-200 rounded p-3 space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold">{pilgrim?.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(sub.createdAt)}
                                  </div>
                                </div>
                                {hasVouched && <Badge variant="purple">Vouched</Badge>}
                              </div>

                              {sub.proposedTitle && (
                                <div className="text-sm">
                                  <span className="font-semibold">Proposed:</span>{" "}
                                  {sub.proposedTitle}
                                </div>
                              )}

                              <p className="text-sm text-gray-600">{sub.text}</p>

                              {sub.vouches.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  {sub.vouches.length} vouch{sub.vouches.length !== 1 ? "es" : ""}
                                </div>
                              )}

                              {!hasVouched && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleOpenVouch(sub, item)}
                                >
                                  Vouch for This Application
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Open Residencies */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Open Residencies</h2>
        {allOpenResidencies.length === 0 ? (
          <EmptyState
            title="No open residencies"
            description="Check back later for new opportunities to support"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {allOpenResidencies.map((item) => {
              const isTagged = item.taggedPatronIds.includes(patron.id);
              return (
                <Card key={item.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.hub.name}</p>
                      </div>
                      {isTagged && <Badge variant="accent1">Tagged</Badge>}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Applications:</span>
                      <span className="font-semibold">{item.submissions.length}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Vouch Modal */}
      <Modal
        isOpen={vouchModalOpen}
        onClose={() => setVouchModalOpen(false)}
        title="Vouch for Application"
        size="md"
      >
        <form onSubmit={handleVouch} className="space-y-6">
          {selectedSubmission && (
            <div className="bg-gray-100 border-2 border-black rounded p-4">
              <h4 className="font-bold mb-2">
                {db.pilgrims.find((p) => p.id === selectedSubmission.submission.pilgrimId)?.name}
              </h4>
              <p className="text-sm text-gray-600">{selectedSubmission.submission.text}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Vouch Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="vouchType"
                  checked={vouchData.type === "fiat"}
                  onChange={() => setVouchData({ ...vouchData, type: "fiat" })}
                />
                <span>Fiat Amount</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="vouchType"
                  checked={vouchData.type === "token"}
                  onChange={() => setVouchData({ ...vouchData, type: "token" })}
                />
                <span>Token Amount</span>
              </label>
            </div>
          </div>

          {vouchData.type === "fiat" ? (
            <Input
              label="Fiat Amount ($) *"
              type="number"
              min="1"
              value={vouchData.amountFiat}
              onChange={(e) => setVouchData({ ...vouchData, amountFiat: parseInt(e.target.value) })}
              required
            />
          ) : (
            <>
              <Input
                label="Token Contract Address *"
                placeholder="0x123..."
                value={vouchData.tokenContract}
                onChange={(e) => setVouchData({ ...vouchData, tokenContract: e.target.value })}
                required
              />
              <Input
                label="Token Amount *"
                type="number"
                min="1"
                value={vouchData.tokenAmount}
                onChange={(e) => setVouchData({ ...vouchData, tokenAmount: parseInt(e.target.value) })}
                required
              />
            </>
          )}

          <Textarea
            label="Requirements & Conditions (Optional)"
            placeholder="Describe any requirements, conditions, or expectations for this vouch..."
            value={vouchData.requirementsText}
            onChange={(e) => setVouchData({ ...vouchData, requirementsText: e.target.value })}
            rows={4}
          />

          <div className="bg-accent2 border-2 border-black rounded p-4">
            <h4 className="font-bold mb-2">⚠️ Commitment Notice</h4>
            <p className="text-sm">
              By vouching, you commit your support to this application. Pulling off after commitment 
              may result in exclusion penalties (demo: no enforcement in this prototype).
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Sign Transaction & Vouch
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setVouchModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
