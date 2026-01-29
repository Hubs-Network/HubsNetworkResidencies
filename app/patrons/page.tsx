"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PatronsPage() {
  const { db, session } = useStore();
  
  const isLoggedInAsPatron = session.type === "PATRON";
  const currentPatron = isLoggedInAsPatron ? db.patrons.find(p => p.id === session.id) : null;
  
  return (
    <div className="space-y-8">
      {/* Logged in banner */}
      {isLoggedInAsPatron && currentPatron && (
        <Card className="bg-purple-100 border-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">✓ Logged in as: {currentPatron.name}</h3>
              <p className="text-sm">You can now vouch for applications and support promising projects</p>
            </div>
            <Link href="/patrons/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Patrons</h1>
          <p className="text-gray-600">
            Organizations and funders supporting residency programs
          </p>
        </div>
        {!isLoggedInAsPatron && (
          <div className="flex gap-2">
            <Link href="/patrons/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/patrons/register">
              <Button>Register Patron</Button>
            </Link>
          </div>
        )}
      </div>

      {db.patrons.length === 0 ? (
        <EmptyState
          title="No patrons yet"
          description="Be the first to register as a patron and start supporting pilgrims"
          action={{
            label: "Register Patron",
            onClick: () => window.location.href = "/patrons/register",
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.patrons.map((patron) => (
            <Card key={patron.id} hover>
              <Link href={`/patrons/${patron.id}`}>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{patron.name}</h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {patron.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {patron.standardsTags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="purple" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
