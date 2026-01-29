"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { resetToSeed, isPersistenceEnabled, setPersistenceEnabled } from "@/lib/mockDb";

export default function SettingsPage() {
  const { refreshDb, addToast } = useStore();
  const [persistence, setPersistence] = useState(isPersistenceEnabled());
  const [showDebug, setShowDebug] = useState(false);
  
  const handleResetData = () => {
    if (!confirm("Reset all data to seed state? This cannot be undone.")) return;
    
    resetToSeed();
    refreshDb();
    addToast("Data reset to seed state", "success");
  };
  
  const handleTogglePersistence = () => {
    const newValue = !persistence;
    setPersistenceEnabled(newValue);
    setPersistence(newValue);
    addToast(
      newValue ? "Persistence enabled" : "Persistence disabled",
      "success"
    );
  };
  
  const { db } = useStore();
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage demo data and debug tools
        </p>
      </div>

      {/* Persistence */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">LocalStorage Persistence</h2>
        <p className="text-gray-600 mb-4">
          When enabled, all changes are saved to browser localStorage and persist across sessions.
        </p>
        <div className="flex items-center gap-4">
          <Badge variant={persistence ? "green" : "gray"}>
            {persistence ? "Enabled" : "Disabled"}
          </Badge>
          <Button onClick={handleTogglePersistence} variant="secondary">
            {persistence ? "Disable" : "Enable"} Persistence
          </Button>
        </div>
      </Card>

      {/* Reset Data */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Reset Demo Data</h2>
        <p className="text-gray-600 mb-4">
          Reset all data to the original seed state. This will delete all changes and 
          restore the demo data.
        </p>
        <Button onClick={handleResetData} variant="danger">
          Reset to Seed Data
        </Button>
      </Card>

      {/* Debug Viewer */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Debug Viewer</h2>
        <p className="text-gray-600 mb-4">
          View the current state of the mock database (for development purposes).
        </p>
        <Button onClick={() => setShowDebug(!showDebug)} variant="outline">
          {showDebug ? "Hide" : "Show"} Debug Data
        </Button>
        
        {showDebug && (
          <div className="mt-4">
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
              <pre>{JSON.stringify(db, null, 2)}</pre>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Database Stats</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600">Total Hubs</div>
            <div className="text-3xl font-bold">{db.hubs.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Pilgrims</div>
            <div className="text-3xl font-bold">{db.pilgrims.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Patrons</div>
            <div className="text-3xl font-bold">{db.patrons.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Residencies</div>
            <div className="text-3xl font-bold">
              {db.hubs.reduce((sum, h) => sum + h.residencies.length, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Open Residencies</div>
            <div className="text-3xl font-bold">
              {db.hubs.reduce(
                (sum, h) => sum + h.residencies.filter((r) => r.status === "SUBMISSIONS_OPEN").length,
                0
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Season</div>
            <div className="text-3xl font-bold">{db.seasons[db.currentSeason]?.quarterLabel}</div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">About This Demo</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            This is a frontend-only prototype of the Hubs Network platform. 
            All data is mocked and stored in-memory with optional localStorage persistence.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Hub registration, residency management, chat, handshake, and evaluation</li>
            <li>Pilgrim registration (with referral codes), application submission, credit spending, and feedback</li>
            <li>Patron vouching for applications with fiat or tokens</li>
            <li>Seasonal credit disbursement and degradation rules</li>
            <li>Interactive map visualization of hubs</li>
            <li>Complete residency lifecycle from creation to closure</li>
          </ul>
          <p>
            <strong>No real authentication, blockchain integration, or backend.</strong> 
            This is purely for demonstration and product validation purposes.
          </p>
        </div>
      </Card>
    </div>
  );
}
