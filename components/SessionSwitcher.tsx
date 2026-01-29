"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Badge } from "./ui/Badge";

export function SessionSwitcher() {
  const { session, setSession, logout, db } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  
  const getSessionDisplay = () => {
    if (session.type === "GUEST") return "Guest";
    if (session.type === "HUB") {
      const hub = db.hubs.find((h) => h.id === session.id);
      return hub ? `Hub: ${hub.name}` : "Hub";
    }
    if (session.type === "PILGRIM") {
      const pilgrim = db.pilgrims.find((p) => p.id === session.id);
      return pilgrim ? `Pilgrim: ${pilgrim.name}` : "Pilgrim";
    }
    if (session.type === "PATRON") {
      const patron = db.patrons.find((p) => p.id === session.id);
      return patron ? `Patron: ${patron.name}` : "Patron";
    }
    return "Unknown";
  };
  
  const getBadgeVariant = () => {
    switch (session.type) {
      case "HUB":
        return "accent1";
      case "PILGRIM":
        return "accent2";
      case "PATRON":
        return "purple";
      default:
        return "gray";
    }
  };
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Badge variant={getBadgeVariant()}>{getSessionDisplay()}</Badge>
        <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
          Switch
        </Button>
        {session.type !== "GUEST" && (
          <Button size="sm" variant="outline" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Switch Session"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Hubs</h3>
            <div className="space-y-2">
              {db.hubs.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => {
                    setSession({ type: "HUB", id: hub.id });
                    setModalOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 border-2 border-black rounded hover:bg-accent1 transition-colors"
                >
                  <div className="font-semibold">{hub.name}</div>
                  <div className="text-sm text-gray-600">
                    Credits: {hub.creditBalance}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Pilgrims</h3>
            <div className="space-y-2">
              {db.pilgrims.map((pilgrim) => (
                <button
                  key={pilgrim.id}
                  onClick={() => {
                    setSession({ type: "PILGRIM", id: pilgrim.id });
                    setModalOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 border-2 border-black rounded hover:bg-accent2 transition-colors"
                >
                  <div className="font-semibold">{pilgrim.name}</div>
                  <div className="text-sm text-gray-600">
                    Credits: {pilgrim.creditBalance} | Reputation: {pilgrim.reputationScore}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Patrons</h3>
            <div className="space-y-2">
              {db.patrons.map((patron) => (
                <button
                  key={patron.id}
                  onClick={() => {
                    setSession({ type: "PATRON", id: patron.id });
                    setModalOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 border-2 border-black rounded hover:bg-purple-100 transition-colors"
                >
                  <div className="font-semibold">{patron.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Button
              onClick={() => {
                setSession({ type: "GUEST" });
                setModalOpen(false);
              }}
              variant="outline"
              className="w-full"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
