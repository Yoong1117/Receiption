// React
import { useRef } from "react";

// UI component
import { Button } from "../ui/button";

interface DropzoneModalProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export default function DropzoneModal({
  onDrop,
  onFileSelect,
  onCancel,
}: DropzoneModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-xl p-8 w-[500px] max-w-[90%] text-center text-gray-600 shadow-lg">
        {/* Drop Area */}
        <div
          className="mb-4 h-[220px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center hover:border-gray-600 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <span className="font-medium text-gray-600">
            Drag & Drop your receipt here
          </span>
        </div>

        {/* Clickable text */}
        <p className="text-sm text-gray-500 mb-4">
          or{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            click here to select a file
          </span>
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onFileSelect}
        />

        {/* Actions */}
        <Button
          className="mt-2 cursor-pointer bg-red-700/90 hover:bg-red-600/90 text-white hover:text-white"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
