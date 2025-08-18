import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import TiltedCard from "@/TiltedCard/TiltedCard";

export default function YtdSummaryCard({
  total,
  avg,
}: {
  total: number;
  avg: number;
}) {
  return (
    <TiltedCard
      imageSrc="https://yzqirhxhflvzgseibsga.supabase.co/storage/v1/object/public/receipts/dashboard/ytd.jpg"
      containerHeight="300px"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={6}
      scaleOnHover={1.05}
      showMobileWarning={false}
      displayOverlayContent
      overlayContent={
        <Card className="bg-[#E0EDF9]/70 w-full h-full p-6 border border-gray-500">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold">
              Year-to-Date: Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[18px] space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Year-to-Date Spending:
              </span>
              <span className="ml-2 text-[#3763BE] font-bold">
                RM {total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Average Per Month:
              </span>
              <span className="ml-2 text-[#3763BE] font-bold">
                RM {avg.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}
