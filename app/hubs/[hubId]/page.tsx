"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusLabel } from "@/lib/utils";

export default function HubProfilePage() {
  const params = useParams();
  const hubId = params.hubId as string;
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
  
  const hub = db.hubs.find((h) => h.id === hubId);
  
  if (!hub) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Hub not found</h1>
        <Link href="/hubs">
          <Button>Back to Hubs</Button>
        </Link>
      </div>
    );
  }
  
  const openResidencies = hub.residencies.filter((r) => r.status === "SUBMISSIONS_OPEN");
  const runningResidencies = hub.residencies.filter((r) => r.status === "RUNNING");
  const closedResidencies = hub.residencies.filter((r) => r.status === "CLOSED");
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold">{hub.name}</h1>
        </div>
        <p className="text-gray-600">{hub.description}</p>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold mb-3">Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Address:</span> {hub.address}
            </div>
            <div>
              <span className="text-gray-600">Contact:</span> {hub.contact}
            </div>
            {hub.links.length > 0 && (
              <div>
                <span className="text-gray-600">Links:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {hub.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Link {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Impact</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Impact Tags</div>
              <div className="flex flex-wrap gap-1">
                {hub.impactTags.map((tag) => (
                  <Badge key={tag} variant="accent1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {hub.esgImpactText && (
              <div>
                <div className="text-sm text-gray-600 mb-1">ESG Impact</div>
                <p className="text-sm">{hub.esgImpactText}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* KPI Tags */}
      {hub.kpiTags.length > 0 && (
        <Card>
          <h3 className="font-bold mb-3">GIIN KPI Tags</h3>
          <div className="flex flex-wrap gap-2">
            {hub.kpiTags.map((tag) => (
              <Badge key={tag} variant="gray">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Menu Items */}
      <Card>
        <h3 className="font-bold mb-3">Menu Items</h3>
        {hub.menuItems.length === 0 ? (
          <p className="text-gray-600 text-sm">No menu items available</p>
        ) : (
          <div className="space-y-3">
            {hub.menuItems.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-xs text-gray-500 mt-1">Code: {item.code}</div>
                </div>
                <Badge variant="accent2">{item.priceCredits} credits</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Residencies */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Residencies</h2>
        
        {hub.residencies.length === 0 ? (
          <EmptyState
            title="No residencies yet"
            description="This hub hasn't created any residencies"
          />
        ) : (
          <div className="space-y-6">
            {/* Open Residencies */}
            {openResidencies.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Badge variant="green">Open</Badge>
                  {openResidencies.length} Open Residenc{openResidencies.length === 1 ? "y" : "ies"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {openResidencies.map((res) => (
                    <Card key={res.id} hover>
                      <div className="space-y-2">
                        <h4 className="font-bold">{res.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{res.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-semibold">{res.type === "OPEN_APPLICATION" ? "Open Application" : "Specific PR"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Credits:</span>
                          <span className="font-semibold">{res.creditAllocated}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Submissions:</span>
                          <span className="font-semibold">{res.submissions.length}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Running Residencies */}
            {runningResidencies.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Badge variant="accent1">Running</Badge>
                  {runningResidencies.length} Running Residenc{runningResidencies.length === 1 ? "y" : "ies"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {runningResidencies.map((res) => (
                    <Card key={res.id}>
                      <div className="space-y-2">
                        <h4 className="font-bold">{res.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{res.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Closed Residencies */}
            {closedResidencies.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Badge variant="purple">Closed</Badge>
                  {closedResidencies.length} Closed Residenc{closedResidencies.length === 1 ? "y" : "ies"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {closedResidencies.map((res) => (
                    <Card key={res.id}>
                      <div className="space-y-2">
                        <h4 className="font-bold">{res.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{res.description}</p>
                        {res.closing && (
                          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Final Score:</span>
                            <span className="font-semibold">{res.closing.score0to100}/100</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
