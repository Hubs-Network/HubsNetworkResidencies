"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Hub, MenuItem } from "@/lib/types";
import { updateHub } from "@/lib/mockDb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableRow, TableCell } from "@/components/ui/Table";

interface MenuItemsTabProps {
  hub: Hub;
}

export function MenuItemsTab({ hub }: MenuItemsTabProps) {
  const { refreshDb, addToast } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    priceCredits: 1,
  });
  
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ code: "", title: "", description: "", priceCredits: 1 });
    setModalOpen(true);
  };
  
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setModalOpen(true);
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedItems: MenuItem[];
    
    if (editingItem) {
      // Edit existing
      updatedItems = hub.menuItems.map((item) =>
        item.code === editingItem.code ? formData : item
      );
      addToast("Menu item updated!", "success");
    } else {
      // Create new
      if (hub.menuItems.some((item) => item.code === formData.code)) {
        addToast("Item code already exists", "error");
        return;
      }
      updatedItems = [...hub.menuItems, formData];
      addToast("Menu item created!", "success");
    }
    
    updateHub(hub.id, { menuItems: updatedItems });
    refreshDb();
    setModalOpen(false);
  };
  
  const handleDelete = (code: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    
    const updatedItems = hub.menuItems.filter((item) => item.code !== code);
    updateHub(hub.id, { menuItems: updatedItems });
    refreshDb();
    addToast("Menu item deleted", "success");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Menu Items</h3>
          <p className="text-sm text-gray-600">
            Items that pilgrims can purchase with credits
          </p>
        </div>
        <Button onClick={handleOpenCreate}>Add Menu Item</Button>
      </div>

      {hub.menuItems.length === 0 ? (
        <EmptyState
          title="No menu items"
          description="Add items that pilgrims can purchase with their credits"
          action={{
            label: "Add Menu Item",
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <Table headers={["Code", "Title", "Description", "Price", "Actions"]}>
          {hub.menuItems.map((item) => (
            <TableRow key={item.code}>
              <TableCell>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.code}</code>
              </TableCell>
              <TableCell className="font-semibold">{item.title}</TableCell>
              <TableCell className="text-sm text-gray-600">{item.description}</TableCell>
              <TableCell>
                <Badge variant="accent2">{item.priceCredits}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.code)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Menu Item" : "Create Menu Item"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Item Code *"
            placeholder="DESK001"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            disabled={!!editingItem}
            required
          />

          <Input
            label="Title *"
            placeholder="Hot Desk Day Pass"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Description *"
            placeholder="One day hot desk access"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Input
            label="Price (Credits) *"
            type="number"
            min="1"
            value={formData.priceCredits}
            onChange={(e) => setFormData({ ...formData, priceCredits: parseInt(e.target.value) })}
            required
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {editingItem ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
