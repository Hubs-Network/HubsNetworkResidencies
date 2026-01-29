"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getHubStatusColor } from "@/lib/utils";

export default function HubsPage() {
  const { db, session } = useStore();
  
  const isLoggedInAsHub = session.type === "HUB";
  const currentHub = isLoggedInAsHub ? db.hubs.find(h => h.id === session.id) : null;
  
  return (
    <div className="space-y-8">
      {/* Logged in banner */}
      {isLoggedInAsHub && currentHub && (
        <Card className="bg-accent1 border-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">✓ Logged in as: {currentHub.name}</h3>
              <p className="text-sm">You can now manage your residencies, menu items, and hub details</p>
            </div>
            <Link href="/hubs/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Hubs</h1>
          <p className="text-gray-600">
            Physical spaces offering residencies and creative resources
          </p>
        </div>
        {!isLoggedInAsHub && (
          <div className="flex gap-2">
            <Link href="/hubs/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/hubs/register">
              <Button>Register Hub</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <Card>
        <h3 className="font-bold mb-3">Hub Status Legend</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="green">Green</Badge>
            <span className="text-sm">Has open residencies</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent1">Electric Mint</Badge>
            <span className="text-sm">Has running residencies</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">Purple</Badge>
            <span className="text-sm">No active residencies</span>
          </div>
        </div>
      </Card>

      {/* Hubs List */}
      {db.hubs.length === 0 ? (
        <EmptyState
          title="No hubs yet"
          description="Be the first to register a hub and start offering residencies"
          action={{
            label: "Register Hub",
            onClick: () => window.location.href = "/hubs/register",
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.hubs.map((hub) => {
            const statusColor = getHubStatusColor(hub);
            const openResidencies = hub.residencies.filter(
              (r) => r.status === "SUBMISSIONS_OPEN"
            ).length;
            const runningResidencies = hub.residencies.filter(
              (r) => r.status === "RUNNING"
            ).length;

            return (
              <Card key={hub.id} hover>
                <Link href={`/hubs/${hub.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold">{hub.name}</h3>
                      <Badge variant={statusColor}>●</Badge>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {hub.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {hub.impactTags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="gray" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-200 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-semibold">{hub.creditBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open Residencies:</span>
                        <span className="font-semibold">{openResidencies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Running:</span>
                        <span className="font-semibold">{runningResidencies}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
