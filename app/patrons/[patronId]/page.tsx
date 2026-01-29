"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PatronProfilePage() {
  const params = useParams();
  const patronId = params.patronId as string;
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
  
  const patron = db.patrons.find((p) => p.id === patronId);
  
  if (!patron) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Patron not found</h1>
        <Link href="/patrons">
          <Button>Back to Patrons</Button>
        </Link>
      </div>
    );
  }
  
  // Find residencies where this patron is tagged
  const taggedResidencies = db.hubs
    .flatMap((h) =>
      h.residencies
        .filter((r) => r.taggedPatronIds.includes(patron.id))
        .map((r) => ({ ...r, hub: h }))
    );
  
  // Count total vouches by this patron
  const totalVouches = db.hubs
    .flatMap((h) => h.residencies)
    .flatMap((r) => r.submissions)
    .flatMap((s) => s.vouches)
    .filter((v) => v.byType === "PATRON" && v.byId === patron.id).length;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{patron.name}</h1>
        <p className="text-gray-600">{patron.description}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Total Vouches</h3>
          <div className="text-3xl font-bold">{totalVouches}</div>
        </Card>

        <Card>
          <h3 className="text-sm text-gray-600 mb-1">Tagged Residencies</h3>
          <div className="text-3xl font-bold">{taggedResidencies.length}</div>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <h3 className="font-bold mb-3">Contact & Links</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Contact:</span> {patron.contact}
          </div>
          {patron.links.length > 0 && (
            <div>
              <span className="text-gray-600">Links:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patron.links.map((link, i) => (
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

      {/* Standards Tags */}
      {patron.standardsTags.length > 0 && (
        <Card>
          <h3 className="font-bold mb-3">Standards & Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {patron.standardsTags.map((tag) => (
              <Badge key={tag} variant="purple">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Tagged Residencies */}
      {taggedResidencies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tagged Residencies</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {taggedResidencies.map((item) => (
              <Card key={item.id}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.hub.name}</p>
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
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
