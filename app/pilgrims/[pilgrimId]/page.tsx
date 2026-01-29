"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PilgrimProfilePage() {
  const params = useParams();
  const pilgrimId = params.pilgrimId as string;
  const { db } = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  const pilgrim = db.pilgrims.find((p) => p.id === pilgrimId);
  
  if (!pilgrim) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Pilgrim not found</h1>
        <Link href="/pilgrims">
          <Button>Back to Pilgrims</Button>
        </Link>
      </div>
    );
  }
  
  // Get residency history with details
  const residencyHistory = pilgrim.residencies.map((pr) => {
    const residency = db.hubs
      .flatMap((h) => h.residencies)
      .find((r) => r.id === pr.residencyId);
    const hub = db.hubs.find((h) => h.id === residency?.hubId);
    return { ...pr, residency, hub };
  });
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{pilgrim.name}</h1>
        {pilgrim.alias && <p className="text-lg text-gray-600">@{pilgrim.alias}</p>}
        {pilgrim.ens && <p className="text-sm text-gray-500">{pilgrim.ens}</p>}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Credit Balance</h3>
          <div className="text-3xl font-bold">{pilgrim.creditBalance}</div>
        </Card>

        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Reputation Score</h3>
          <div className="text-3xl font-bold">{pilgrim.reputationScore}</div>
        </Card>

        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Residencies</h3>
          <div className="text-3xl font-bold">{pilgrim.residencies.length}</div>
        </Card>
      </div>

      {/* Tags */}
      {pilgrim.tags.length > 0 && (
        <Card>
          <h3 className="font-bold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {pilgrim.tags.map((tag) => (
              <Badge key={tag} variant="accent2">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Skills */}
      {pilgrim.skills.length > 0 && (
        <Card>
          <h3 className="font-bold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {pilgrim.skills.map((skill) => (
              <Badge key={skill} variant="gray">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Residency History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Residency History</h2>
        {residencyHistory.length === 0 ? (
          <Card>
            <p className="text-gray-600 text-center py-4">
              No residencies yet
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {residencyHistory.map((item) => (
              <Card key={item.residencyId}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{item.residency?.title || "Unknown"}</h4>
                      <p className="text-sm text-gray-600">
                        {item.hub?.name || "Unknown Hub"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "SUBMISSIONS_OPEN"
                          ? "green"
                          : item.status === "RUNNING"
                          ? "accent1"
                          : "purple"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">{item.role}</p>

                  {item.residency?.closing && item.status === "CLOSED" && (
                    <div className="pt-2 border-t border-gray-200 flex justify-between text-sm">
                      <span className="text-gray-600">Final Score:</span>
                      <span className="font-semibold">
                        {item.residency.closing.score0to100}/100
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
