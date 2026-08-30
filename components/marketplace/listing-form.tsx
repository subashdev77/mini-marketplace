"use client";

import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import type {
  CreateListingInput,
  ListingStatus,
  UpdateListingInput,
} from "@/types/marketplace";
import Link from "next/link";
import { useState, type FormEvent } from "react";

interface ListingFormProps {
  initial?: {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    status?: ListingStatus;
  };
  onSubmit: (data: CreateListingInput & Partial<UpdateListingInput>) => Promise<void>;
  submitLabel?: string;
  cancelHref?: string;
  showStatus?: boolean;
}

export function ListingForm({
  initial,
  onSubmit,
  submitLabel = "Save Listing",
  cancelHref,
  showStatus = false,
}: ListingFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [status, setStatus] = useState<ListingStatus>(
    initial?.status ?? "ACTIVE"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const parsedPrice = parseFloat(price);
    if (!title.trim() || !description.trim() || isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: imageUrl.trim() || undefined,
        ...(showStatus ? { status } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Field label="Title" htmlFor="title" required>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product name"
            required
          />
        </Field>

        <Field label="Description" htmlFor="description" required>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product"
            className="min-h-28"
            required
          />
        </Field>

        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Price ($)" htmlFor="price" required>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="99.99"
              required
            />
          </Field>

          {showStatus ? (
            <Field label="Status" htmlFor="status">
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ListingStatus)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </Field>
          ) : (
            <Field
              label="Image URL"
              htmlFor="imageUrl"
              hint="Optional — paste a direct image link"
            >
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </Field>
          )}
        </div>

        {showStatus && (
          <Field
            label="Image URL"
            htmlFor="imageUrl"
            hint="Optional — paste a direct image link"
          >
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Field>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {cancelHref && (
          <Link href={cancelHref}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        )}
        <Button type="submit" isLoading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
