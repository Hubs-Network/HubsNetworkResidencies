"use client";

import React, { useState } from "react";
import { nanoid } from "nanoid";
import { useStore } from "@/store/useStore";
import { Hub, Residency, Pilgrim, ChatMessage, LogPost } from "@/lib/types";
import { updateResidency, addChatMessage, addLogPost, updateHub, addCredits, generateChecksum, generateTxHash } from "@/lib/mockDb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatDate } from "@/lib/utils";

interface ResidencyCardProps {
  residency: Residency;
  hub: Hub;
}

export function ResidencyCard({ residency, hub }: ResidencyCardProps) {
  const { refreshDb, addToast, db } = useStore();
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [logText, setLogText] = useState("");
  const [closeData, setCloseData] = useState({
    score: 50,
    deliverables_met: true,
    communication: 3,
    quality: 3,
    impact: 3,
  });
  
  const chosenPilgrim = residency.chosenPilgrimId
    ? db.pilgrims.find((p) => p.id === residency.chosenPilgrimId)
    : null;
  
  const handleChoosePilgrim = (pilgrimId: string) => {
    updateResidency(residency.id, { chosenPilgrimId: pilgrimId });
    refreshDb();
    addToast("Pilgrim selected! Open chat to discuss terms.", "success");
    setSubmissionsModalOpen(false);
  };
  
  const handleOpenChat = () => {
    setChatModalOpen(true);
  };
  
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const message: ChatMessage = {
      id: `msg-${nanoid(8)}`,
      fromType: "HUB",
      fromId: hub.id,
      text: chatMessage,
      createdAt: new Date().toISOString(),
    };
    
    addChatMessage(residency.id, message);
    refreshDb();
    setChatMessage("");
  };
  
  const handleGenerateHandshake = async () => {
    if (!residency.chosenPilgrimId) return;
    
    const agreement = {
      residencyId: residency.id,
      hubId: hub.id,
      pilgrimId: residency.chosenPilgrimId,
      title: residency.title,
      creditAllocated: residency.creditAllocated,
      terms: residency.description,
    };
    
    const checksum = await generateChecksum(agreement);
    const txHash = generateTxHash();
    
    updateResidency(residency.id, {
      handshake: {
        checksum,
        agreementJson: JSON.stringify(agreement, null, 2),
        signedByHub: true,
        signedByPilgrim: true, // Auto-sign for demo
        signedAt: new Date().toISOString(),
      },
      status: "RUNNING",
    });
    
    refreshDb();
    addToast(`Handshake generated! TX: ${txHash.substring(0, 10)}...`, "success");
    setChatModalOpen(false);
  };
  
  const handleAddLog = () => {
    if (!logText.trim()) return;
    
    const log: LogPost = {
      id: `log-${nanoid(8)}`,
      authorType: "HUB",
      authorId: hub.id,
      text: logText,
      createdAt: new Date().toISOString(),
    };
    
    addLogPost(residency.id, log);
    refreshDb();
    addToast("Log post added!", "success");
    setLogText("");
  };
  
  const handleCloseResidency = () => {
    if (!residency.chosenPilgrimId) return;
    
    updateResidency(residency.id, {
      status: "CLOSED",
      closing: {
        score0to100: closeData.score,
        evaluationFields: [
          { key: "deliverables_met", type: "boolean", value: closeData.deliverables_met },
          { key: "communication", type: "scale1to5", value: closeData.communication },
          { key: "quality", type: "scale1to5", value: closeData.quality },
          { key: "impact", type: "scale1to5", value: closeData.impact },
        ],
        closedAt: new Date().toISOString(),
      },
    });
    
    // Award credits to pilgrim based on score
    const creditsEarned = Math.floor((closeData.score / 100) * residency.creditAllocated);
    addCredits("PILGRIM", residency.chosenPilgrimId, creditsEarned);
    
    // Update pilgrim reputation
    const pilgrim = db.pilgrims.find((p) => p.id === residency.chosenPilgrimId);
    if (pilgrim) {
      const totalScore = pilgrim.residencies.reduce((sum, r) => {
        const res = db.hubs.flatMap((h) => h.residencies).find((re) => re.id === r.residencyId);
        return sum + (res?.closing?.score0to100 || 0);
      }, closeData.score);
      const avgScore = Math.floor(totalScore / (pilgrim.residencies.length + 1));
      pilgrim.reputationScore = avgScore;
    }
    
    refreshDb();
    addToast(`Residency closed! Pilgrim earned ${creditsEarned} credits.`, "success");
    setCloseModalOpen(false);
  };
  
  return (
    <>
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-bold text-lg">{residency.title}</h5>
              <p className="text-sm text-gray-600">{residency.description}</p>
            </div>
            <Badge variant={residency.type === "OPEN_APPLICATION" ? "accent2" : "accent1"}>
              {residency.type === "OPEN_APPLICATION" ? "Open App" : "Specific PR"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Credits:</span> {residency.creditAllocated}
            </div>
            <div>
              <span className="text-gray-600">Submissions:</span> {residency.submissions.length}
            </div>
          </div>

          {residency.giinTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {residency.giinTags.map((tag) => (
                <Badge key={tag} variant="gray" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions based on status */}
          <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-200">
            {residency.status === "SUBMISSIONS_OPEN" && (
              <>
                <Button size="sm" onClick={() => setSubmissionsModalOpen(true)}>
                  View Submissions ({residency.submissions.length})
                </Button>
                {residency.chosenPilgrimId && (
                  <Button size="sm" variant="secondary" onClick={handleOpenChat}>
                    Open Chat
                  </Button>
                )}
              </>
            )}

            {residency.status === "RUNNING" && (
              <>
                <Button size="sm" onClick={() => setChatModalOpen(true)}>
                  Chat ({residency.thread.messages.length})
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setLogModalOpen(true)}>
                  Log/Blog ({residency.logPosts.length})
                </Button>
                <Button size="sm" variant="outline" onClick={() => setCloseModalOpen(true)}>
                  Close Residency
                </Button>
              </>
            )}

            {residency.status === "CLOSED" && (
              <>
                <Button size="sm" onClick={() => setLogModalOpen(true)}>
                  View Logs ({residency.logPosts.length})
                </Button>
                {residency.closing && (
                  <Badge variant="purple">Score: {residency.closing.score0to100}/100</Badge>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Submissions Modal */}
      <Modal
        isOpen={submissionsModalOpen}
        onClose={() => setSubmissionsModalOpen(false)}
        title="Submissions"
        size="lg"
      >
        <div className="space-y-4">
          {residency.submissions.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No submissions yet</p>
          ) : (
            residency.submissions.map((sub) => {
              const pilgrim = db.pilgrims.find((p) => p.id === sub.pilgrimId);
              return (
                <Card key={sub.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{pilgrim?.name || "Unknown Pilgrim"}</h4>
                        <p className="text-xs text-gray-500">{formatDate(sub.createdAt)}</p>
                      </div>
                      {residency.chosenPilgrimId === sub.pilgrimId && (
                        <Badge variant="green">Chosen</Badge>
                      )}
                    </div>

                    {sub.proposedTitle && (
                      <div>
                        <div className="text-sm font-semibold">Proposed Title:</div>
                        <div className="text-sm">{sub.proposedTitle}</div>
                      </div>
                    )}

                    {sub.proposedDescription && (
                      <div>
                        <div className="text-sm font-semibold">Proposed Description:</div>
                        <div className="text-sm">{sub.proposedDescription}</div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-semibold">Application:</div>
                      <div className="text-sm">{sub.text}</div>
                    </div>

                    {sub.vouches.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Vouches ({sub.vouches.length}):</div>
                        {sub.vouches.map((vouch) => {
                          const voucherName =
                            vouch.byType === "HUB"
                              ? db.hubs.find((h) => h.id === vouch.byId)?.name
                              : db.patrons.find((p) => p.id === vouch.byId)?.name;
                          return (
                            <div key={vouch.id} className="text-xs text-gray-600 flex items-center gap-2">
                              <Badge variant="purple" className="text-xs">{vouch.byType}</Badge>
                              <span>{voucherName}</span>
                              {vouch.amountFiat && <span>• ${vouch.amountFiat}</span>}
                              {vouch.token && <span>• {vouch.token.amount} tokens</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!residency.chosenPilgrimId && (
                      <Button
                        size="sm"
                        onClick={() => handleChoosePilgrim(sub.pilgrimId)}
                        className="w-full"
                      >
                        Choose This Pilgrim
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Modal>

      {/* Chat Modal */}
      <Modal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title={`Chat: ${residency.title}`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Messages */}
          <div className="border-2 border-black rounded p-4 h-64 overflow-y-auto space-y-3">
            {residency.thread.messages.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No messages yet</p>
            ) : (
              residency.thread.messages.map((msg) => {
                const isHub = msg.fromType === "HUB";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isHub ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded ${
                        isHub ? "bg-accent1" : "bg-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {isHub ? "Hub" : "Pilgrim"} • {formatDate(msg.createdAt)}
                      </div>
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          {residency.status === "SUBMISSIONS_OPEN" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSendMessage} className="flex-1">
                  Send Message
                </Button>
                {!residency.handshake && residency.thread.messages.length > 0 && (
                  <Button variant="secondary" onClick={handleGenerateHandshake}>
                    Generate Handshake
                  </Button>
                )}
              </div>
              {residency.handshake && (
                <div className="p-3 bg-green-100 border-2 border-green-600 rounded">
                  <div className="font-bold text-sm">Handshake Complete ✓</div>
                  <div className="text-xs text-gray-600">
                    Checksum: {residency.handshake.checksum.substring(0, 40)}...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Log Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title={`Logs: ${residency.title}`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Log posts */}
          <div className="space-y-3">
            {residency.logPosts.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No log posts yet</p>
            ) : (
              residency.logPosts.map((log) => (
                <Card key={log.id}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.authorType === "HUB" ? "accent1" : "accent2"}>
                        {log.authorType}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-sm">{log.text}</p>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Add log (only if running) */}
          {residency.status === "RUNNING" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Add a log post..."
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddLog} className="w-full">
                Add Log Post
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Close Residency Modal */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Close Residency"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Evaluate the pilgrim's performance and close the residency.
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              Score (0-100) *
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={closeData.score}
              onChange={(e) => setCloseData({ ...closeData, score: parseInt(e.target.value) })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Pilgrim will earn {Math.floor((closeData.score / 100) * residency.creditAllocated)} credits
              ({closeData.score}% of {residency.creditAllocated} allocated)
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={closeData.deliverables_met}
                onChange={(e) => setCloseData({ ...closeData, deliverables_met: e.target.checked })}
              />
              <span className="text-sm font-medium">Deliverables Met</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Communication (1-5)
            </label>
            <Input
              type="number"
              min="1"
              max="5"
              value={closeData.communication}
              onChange={(e) => setCloseData({ ...closeData, communication: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quality (1-5)
            </label>
            <Input
              type="number"
              min="1"
              max="5"
              value={closeData.quality}
              onChange={(e) => setCloseData({ ...closeData, quality: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Impact (1-5)
            </label>
            <Input
              type="number"
              min="1"
              max="5"
              value={closeData.impact}
              onChange={(e) => setCloseData({ ...closeData, impact: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleCloseResidency} className="flex-1">
              Close Residency
            </Button>
            <Button
              variant="outline"
              onClick={() => setCloseModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
