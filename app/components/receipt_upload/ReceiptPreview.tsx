// React
import { useState } from "react";

// UI Components
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";

interface ReceiptPreviewPros {
  file: File | null;
  onUploadClick: () => void;
}

export default function ReceiptPreview({
  file,
  onUploadClick,
}: ReceiptPreviewPros) {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Reset zoom state when modal opens
  const openZoom = () => {
    setZoomed(true);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => {
      const newScale = e.deltaY < 0 ? prev * 1.1 : prev / 1.1;
      return Math.min(Math.max(newScale, 1), 5); // clamp between 1x and 5x
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      {/* Main preview card */}
      <Card className="bg-[#E0EDF9]/20 w-7/8 flex flex-col rounded-none border-r border-gray-200">
        <CardHeader className="sticky top-0 z-10">
          <CardTitle>Receipt Preview</CardTitle>
          <CardDescription>Preview the uploaded receipt image</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-center items-center">
          <div
            className={
              file
                ? "w-[230px] h-auto flex items-center justify-center text-gray-500 rounded cursor-zoom-in"
                : "w-80 h-[460px] border border-gray-400 bg-white/50 flex items-center justify-center text-gray-500 rounded"
            }
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Receipt Preview"
                className="object-contain max-h-[400px]"
                onClick={openZoom} // open modal
              />
            ) : (
              "No Receipt"
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Label className="cursor-pointer">
            <Button className="cursor-pointer" onClick={onUploadClick}>
              {file ? "Re-upload" : "Upload"}
            </Button>
          </Label>
        </CardFooter>
      </Card>

      {/* Zoom modal */}
      {zoomed && file && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <img
            src={URL.createObjectURL(file)}
            alt="Zoomed Receipt"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: dragging ? "none" : "transform 0.1s ease-out",
              cursor: dragging ? "grabbing" : "grab",
              maxWidth: "none",
              maxHeight: "none",
            }}
            className="select-none"
            onMouseDown={handleMouseDown}
            onDoubleClick={() => setZoomed(false)} // double-click to close
          />
          {/* Close button */}
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full px-3 py- cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
