"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ResidenciesTab } from "@/components/hub/ResidenciesTab";
import { MenuItemsTab } from "@/components/hub/MenuItemsTab";
import { HubDetailsTab } from "@/components/hub/HubDetailsTab";

export default function HubDashboardPage() {
  const router = useRouter();
  const { session, db } = useStore();
  
  if (session.type !== "HUB" || !session.id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in as a Hub to access this dashboard
        </p>
        <Button onClick={() => router.push("/hubs")}>
          Browse Hubs
        </Button>
      </div>
    );
  }
  
  const hub = db.hubs.find((h) => h.id === session.id);
  
  if (!hub) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Hub Not Found</h2>
        <Button onClick={() => router.push("/hubs")}>
          Browse Hubs
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{hub.name} Dashboard</h1>
        <p className="text-gray-600">Manage your residencies, menu items, and details</p>
      </div>

      {/* What you can do banner */}
      <Card className="bg-accent1 border-2 border-black">
        <h3 className="font-bold mb-2">🎯 What you can do as a Hub:</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Create new residencies (if you have credits)</li>
          <li>✓ Review pilgrim applications and choose participants</li>
          <li>✓ Chat with chosen pilgrims and generate handshakes</li>
          <li>✓ Monitor running residencies with shared logs</li>
          <li>✓ Close residencies and evaluate pilgrims</li>
          <li>✓ Manage your menu items for pilgrims to purchase</li>
          <li>✓ Edit your hub details and information</li>
        </ul>
      </Card>

      {/* Credit Balance */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Credit Balance</h3>
            <div className="text-3xl font-bold">{hub.creditBalance}</div>
          </div>
          <Badge variant="accent1" className="text-lg px-4 py-2">
            foo: {hub.creditBalance}
          </Badge>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: "residencies",
            label: "Residencies",
            content: <ResidenciesTab hub={hub} />,
          },
          {
            id: "menu",
            label: "Menu Items",
            content: <MenuItemsTab hub={hub} />,
          },
          {
            id: "details",
            label: "Hub Details",
            content: <HubDetailsTab hub={hub} />,
          },
        ]}
      />
    </div>
  );
}
