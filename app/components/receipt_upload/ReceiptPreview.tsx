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
  return (
    <>
      {" "}
      <Card className="bg-[#E0EDF9]/20 w-7/8 flex flex-col rounded-none border-r border-gray-200">
        <CardHeader className="sticky top-0 z-10 ">
          <CardTitle>Receipt Preview</CardTitle>
          <CardDescription>Preview the uploaded receipt image</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center items-center">
          <div
            className={
              file
                ? "w-[230px] h-auto flex items-center justify-center text-gray-500 rounded"
                : "w-80 h-[460px] border border-gray-400 bg-white/50 flex items-center justify-center text-gray-500 rounded"
            }
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Receipt Preview"
                className="object-contain"
              />
            ) : (
              "No Receipt"
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Label className="cursor-pointer">
            <Button
              className="cursor-pointer "
              onClick={() => {
                onUploadClick();
              }}
            >
              {file ? <>Re-upload</> : <>Upload</>}
            </Button>
          </Label>
        </CardFooter>
      </Card>
    </>
  );
}
