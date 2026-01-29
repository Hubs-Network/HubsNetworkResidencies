"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Hub } from "@/lib/types";
import { getHubStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MapPage() {
  const { db } = useStore();
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  
  // Map dimensions (simple grid representation)
  const MAP_WIDTH = 800;
  const MAP_HEIGHT = 600;
  
  // Convert lat/lng to x/y coordinates on our simple map
  const getPosition = (hub: Hub) => {
    // Simple linear mapping for demo purposes
    // Real implementation would use proper map projection
    const x = ((hub.lng || 0) + 10) * (MAP_WIDTH / 40);
    const y = ((60 - (hub.lat || 50)) * (MAP_HEIGHT / 20));
    return { x, y };
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Hub Map</h1>
        <p className="text-gray-600">
          Visualize hubs by residency status across locations
        </p>
      </div>

      {/* Legend */}
      <Card>
        <h3 className="font-bold mb-3">Status Colors</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Has open residencies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent1"></div>
            <span className="text-sm">Has running residencies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">No active residencies</span>
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="p-0 overflow-hidden">
        <div className="relative bg-gray-100" style={{ width: "100%", paddingBottom: "75%" }}>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          >
            {/* Grid lines */}
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

            {/* Hub markers */}
            {db.hubs.map((hub) => {
              const pos = getPosition(hub);
              const statusColor = getHubStatusColor(hub);
              const colorMap = {
                green: "#22c55e",
                accent1: "#A1FFEF",
                purple: "#a855f7",
              };
              const color = colorMap[statusColor];

              return (
                <g key={hub.id}>
                  {/* Marker circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={color}
                    stroke="#000"
                    strokeWidth="2"
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedHub(hub)}
                  />
                  {/* Marker label */}
                  <text
                    x={pos.x}
                    y={pos.y + 25}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {hub.name.length > 15 ? hub.name.substring(0, 15) + "..." : hub.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      {/* Hub Quick View Modal */}
      {selectedHub && (
        <Modal
          isOpen={!!selectedHub}
          onClose={() => setSelectedHub(null)}
          title={selectedHub.name}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">{selectedHub.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Credits</div>
                <div className="text-2xl font-bold">{selectedHub.creditBalance}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <Badge variant={getHubStatusColor(selectedHub)}>
                  {selectedHub.residencies.some((r) => r.status === "SUBMISSIONS_OPEN")
                    ? "Open"
                    : selectedHub.residencies.some((r) => r.status === "RUNNING")
                    ? "Running"
                    : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Open Residencies */}
            {selectedHub.residencies.filter((r) => r.status === "SUBMISSIONS_OPEN").length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Open Residencies</h4>
                <div className="space-y-2">
                  {selectedHub.residencies
                    .filter((r) => r.status === "SUBMISSIONS_OPEN")
                    .map((res) => (
                      <div key={res.id} className="text-sm border-2 border-gray-200 rounded p-2">
                        <div className="font-semibold">{res.title}</div>
                        <div className="text-gray-600 text-xs">
                          {res.submissions.length} application(s)
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <Link href={`/hubs/${selectedHub.id}`}>
              <Button className="w-full">View Full Profile</Button>
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
}
