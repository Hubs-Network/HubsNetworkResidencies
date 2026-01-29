"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { advanceSeason, getCurrentSeason } from "@/lib/mockDb";
import { formatDate } from "@/lib/utils";

export default function SeasonsPage() {
  const { db, refreshDb, addToast } = useStore();
  
  const currentSeason = getCurrentSeason();
  
  const handleAdvanceSeason = () => {
    if (!confirm("Advance to the next season? This will apply credit degradation rules.")) return;
    
    advanceSeason();
    refreshDb();
    addToast("Advanced to next season!", "success");
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Seasons</h1>
        <p className="text-gray-600">
          Quarterly credit disbursement and network economic activity
        </p>
      </div>

      {/* Current Season */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Current Season</h2>
          <Badge variant="accent1" className="text-lg px-4 py-2">
            {currentSeason.quarterLabel}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Quarter</h3>
            <div className="text-2xl font-bold">{currentSeason.quarterLabel}</div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600 mb-1">Disbursement Date</h3>
            <div className="text-2xl font-bold">{formatDate(currentSeason.disbursementDate)}</div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600 mb-1">Hub Mint Amount</h3>
            <div className="text-2xl font-bold">{currentSeason.hubMintAmount} credits</div>
          </div>
        </div>
      </Card>

      {/* Next Season Live Balance */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Next Season Live Balance</h2>
        <p className="text-gray-600 mb-4">
          Accumulates from pilgrim credit spending throughout the current season
        </p>
        <div className="text-4xl font-bold text-accent2">
          {currentSeason.nextSeasonLiveBalance} credits
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This balance represents the economic activity in the network and will be 
          disbursed in the next season.
        </p>
      </Card>

      {/* Season Mechanics */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Season Mechanics</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">💰 Credit Minting</h3>
            <p className="text-sm text-gray-600">
              Each season, every hub receives {currentSeason.hubMintAmount} fresh credits to 
              allocate to new residencies.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">🔄 Credit Flow</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Hubs allocate credits to create residencies</li>
              <li>Pilgrims earn credits based on residency evaluation scores</li>
              <li>Pilgrims spend credits on hub menu items</li>
              <li>Spent credits contribute to the next season's live balance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">📉 Credit Degradation</h3>
            <p className="text-sm text-gray-600">
              Pilgrim credits degrade by 10% after 12 seasons of inactivity to encourage 
              ongoing participation in the network.
            </p>
          </div>
        </div>
      </Card>

      {/* All Seasons History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Season History</h2>
        <div className="space-y-3">
          {db.seasons.map((season, index) => (
            <Card key={season.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{season.quarterLabel}</div>
                  <div className="text-sm text-gray-600">
                    Disbursement: {formatDate(season.disbursementDate)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Minted</div>
                  <div className="font-bold">{season.hubMintAmount} credits</div>
                </div>
                {index === db.currentSeason && (
                  <Badge variant="accent1">Current</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Controls */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Demo Controls</h2>
        <p className="text-gray-600 mb-4">
          Advance to the next season to see credit degradation in action and seasonal transitions.
        </p>
        <Button onClick={handleAdvanceSeason} variant="secondary">
          Advance Season (Demo)
        </Button>
      </Card>
    </div>
  );
}
