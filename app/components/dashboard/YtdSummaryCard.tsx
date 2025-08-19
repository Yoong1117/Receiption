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
      containerHeight="100%"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={6}
      scaleOnHover={1.05}
      showMobileWarning={false}
      displayOverlayContent
      overlayContent={
        <Card className="overflow-hidden bg-[#E0EDF9]/70 w-full h-full pt-4 sm:pt-2 lg:pt-4 border border-gray-500">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold">
              Year-to-Date: Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[18px] space-y-4">
            {/* Year-to-Date Spending */}
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-700">
                Year-to-Date Spending:
              </span>
              <span className="text-[#3763BE] font-bold sm:ml-2">
                RM {total.toFixed(2)}
              </span>
            </div>

            {/* Average Per Month */}
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-700">
                Average Per Month:
              </span>
              <span className="text-[#3763BE] font-bold sm:ml-2">
                RM {avg.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}
