"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface DropzoneProps {
  previewUrl: string | null;
  uploading: boolean;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

export function Dropzone({ previewUrl, uploading, onFileSelected, onRemove }: DropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  };

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "relative flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-colors",
        dragOver ? "border-(--accent) bg-(--accent-soft)" : "border-(--border) hover:bg-black/2"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- external MinIO/S3 URL, not a static app asset */}
          <img
            src={previewUrl}
            alt="Receipt preview"
            className="h-full w-full rounded-md object-contain p-1"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-1 right-1 rounded-full bg-white p-1 shadow-sm hover:bg-black/4"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <Upload size={20} className="text-(--muted)" />
          <p className="px-4 text-center text-xs text-(--muted)">
            Drag and drop an image, or click to browse
          </p>
        </>
      )}

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/70">
          <Loader2 size={20} className="animate-spin text-(--accent)" />
        </div>
      )}
    </div>
  );
}
