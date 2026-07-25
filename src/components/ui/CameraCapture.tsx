"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

const cameraSupported = () =>
  typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

interface CameraCaptureProps {
  onClose: () => void;
  onCapture: (file: File) => void;
}

// Mounted only while the camera is open (see Dropzone), so opening always
// starts from clean state and closing tears the stream down via unmount.
export function CameraCapture({ onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  // getUserMedia is undefined entirely outside a secure context, so that case
  // is a missing API rather than a rejected permission -- it deserves its own
  // message, since "allow camera access" is useless advice when no prompt can
  // ever appear. It's knowable at first render, so it seeds the initial state
  // instead of being assigned from the effect.
  const [error, setError] = useState<string | null>(() =>
    cameraSupported() ? null : "The browser only allows camera access over HTTPS or on localhost."
  );

  useEffect(() => {
    if (!cameraSupported()) return;

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 } } })
      .then((stream) => {
        // The user can close the modal while the permission prompt is still up.
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not open the camera. Check the site's camera permission.");
        }
      });

    return () => {
      cancelled = true;
      // Releasing every track matters: skip it and the camera stays powered
      // with its indicator light on after the modal closes.
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    // JPEG at 0.85 keeps a 1920px frame near 400KB, well under the API's 5MB
    // cap, and the upload route only accepts image/* anyway.
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onCapture(new File([blob], `receipt-${Date.now()}.jpg`, { type: "image/jpeg" }));
        onClose();
      },
      "image/jpeg",
      0.85
    );
  };

  return (
    <Modal open onClose={onClose} title="Take a photo">
      {error ? (
        <p className="text-sm text-(--danger)">{error}</p>
      ) : (
        <div className="relative overflow-hidden rounded-md bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-56 w-full object-contain"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-white" />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {!error && (
          <Button type="button" onClick={takePhoto} disabled={!ready}>
            <Camera size={16} className="mr-1.5" />
            Capture
          </Button>
        )}
      </div>
    </Modal>
  );
}
