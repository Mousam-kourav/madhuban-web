"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal, Button, Input, Select, TextArea, Toggle } from "@/components/admin/ui";

const CATEGORY_OPTIONS = [
  { value: "food_beverage",   label: "Food & Beverage" },
  { value: "mini_bar",        label: "Mini Bar" },
  { value: "laundry",         label: "Laundry" },
  { value: "spa_wellness",    label: "Spa & Wellness" },
  { value: "forest_walk",     label: "Forest Walk Experience" },
  { value: "village_visit",   label: "Village Visit Experience" },
  { value: "late_checkout",   label: "Late Check-out Fee" },
  { value: "damage",          label: "Damage Charge" },
  { value: "extra_bed",       label: "Extra Bed" },
  { value: "other",           label: "Other" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddChargesModal({ open, onClose }: Props) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [gstApplies, setGstApplies] = useState(true);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!category) e.category = "Category is required";
    if (!description.trim()) e.description = "Description is required";
    if (!amount || Number(amount) <= 0) e.amount = "Amount must be greater than 0";
    return e;
  }

  function handleClose() {
    setCategory(""); setDescription(""); setAmount(""); setGstApplies(true); setNotes(""); setErrors({});
    onClose();
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    toast.info("Charge form captured — backend wiring deferred to a later phase. Charge not saved.");
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Charge" size="md">
      <div className="space-y-4">
        <Select
          label="Category"
          required
          placeholder="Select a category"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: "" })); }}
          error={errors.category}
        />
        <Input
          label="Description"
          required
          placeholder="e.g. 2x espresso, 1x sandwich"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: "" })); }}
          error={errors.description}
        />
        <Input
          label="Amount (₹)"
          required
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: "" })); }}
          error={errors.amount}
        />
        <Toggle
          label="GST Applies"
          checked={gstApplies}
          onChange={setGstApplies}
          description="12% on F&B, 18% on others"
        />
        <TextArea
          label="Notes"
          placeholder="Optional notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
        <div className="flex justify-end gap-3 pt-2 border-t border-admin-card-border">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Add Charge</Button>
        </div>
      </div>
    </Modal>
  );
}
