"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PilgrimsPage() {
  const { db, session } = useStore();
  
  const isLoggedInAsPilgrim = session.type === "PILGRIM";
  const currentPilgrim = isLoggedInAsPilgrim ? db.pilgrims.find(p => p.id === session.id) : null;
  
  return (
    <div className="space-y-8">
      {/* Logged in banner */}
      {isLoggedInAsPilgrim && currentPilgrim && (
        <Card className="bg-accent2 border-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">✓ Logged in as: {currentPilgrim.name}</h3>
              <p className="text-sm">You can now apply to residencies, spend credits, and manage your profile</p>
            </div>
            <Link href="/pilgrims/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Pilgrims</h1>
          <p className="text-gray-600">
            Independent workers, artists, and creators participating in residencies
          </p>
        </div>
        {!isLoggedInAsPilgrim && (
          <div className="flex gap-2">
            <Link href="/pilgrims/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/pilgrims/register">
              <Button>Register Pilgrim</Button>
            </Link>
          </div>
        )}
      </div>

      {db.pilgrims.length === 0 ? (
        <EmptyState
          title="No pilgrims yet"
          description="Be the first to register as a pilgrim and start applying for residencies"
          action={{
            label: "Register Pilgrim",
            onClick: () => window.location.href = "/pilgrims/register",
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.pilgrims.map((pilgrim) => (
            <Card key={pilgrim.id} hover>
              <Link href={`/pilgrims/${pilgrim.id}`}>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{pilgrim.name}</h3>
                    {pilgrim.alias && (
                      <p className="text-sm text-gray-600">@{pilgrim.alias}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pilgrim.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="accent2" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-semibold">{pilgrim.creditBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reputation:</span>
                      <span className="font-semibold">{pilgrim.reputationScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Residencies:</span>
                      <span className="font-semibold">{pilgrim.residencies.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
