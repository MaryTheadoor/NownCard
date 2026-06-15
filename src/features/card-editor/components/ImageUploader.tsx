import { useCallback, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Loader2, Upload } from "lucide-react";
import { compressImage } from "@/shared/lib/utils/compressImage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/shared/lib/firebase/storage";
import { useAuth } from "@/app/providers/AuthProvider";

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  storagePath: string;
  maxSize?: number;
}

export function ImageUploader({ label, value, onChange, storagePath, maxSize = 1200 }: ImageUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);
      try {
        const compressed = await compressImage(file, maxSize);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = storagePath
          .replace("{uid}", user.uid)
          .replace("{timestamp}", String(Date.now()))
          .replace("{filename}", safeName);
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, compressed);
        const url = await getDownloadURL(fileRef);
        setPreview(url);
        onChange(url);
      } catch {
        // Error handled silently - compression/upload failures are non-critical
      } finally {
        setUploading(false);
      }
    },
    [user, storagePath, maxSize, onChange],
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {preview ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
          <img src={preview} alt={label} className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Change
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-32 w-32 flex-col gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-xs">{uploading ? "Uploading..." : "Upload"}</span>
        </Button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
}
