import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import TiltedCard from "@/TiltedCard/TiltedCard";

type MonthlySummaryProps = {
  monthTotal: number;
  spent: {
    amount: number;
    vendor: string;
  };
  topCat: {
    category: string;
    total: number;
  };
};

export default function MonthlySummaryCard({
  monthTotal,
  spent,
  topCat,
}: MonthlySummaryProps) {
  const now = new Date();
  const currentMonthName = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  return (
    <TiltedCard
      imageSrc="https://yzqirhxhflvzgseibsga.supabase.co/storage/v1/object/public/receipts/dashboard/month.jpg"
      containerHeight="300px"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={4}
      scaleOnHover={1.04}
      showMobileWarning={false}
      displayOverlayContent
      overlayContent={
        <Card className="bg-[#C8DFF5]/85 w-full h-full p-6 border border-gray-500">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold">
              Expense Summary - {currentMonthName} {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[18px] space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Total Spent:</span>
              <span className="ml-2 font-bold text-[#3763BE]">
                RM {monthTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Highest Spent:
              </span>
              <span>
                <span className="ml-2 font-bold text-[#3763BE]">
                  RM {spent.amount.toFixed(2)}
                </span>
                <span className="ml-1 text-gray-700">@ {spent.vendor}</span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Top Category:</span>
              <span>
                <span className="ml-2 font-bold text-[#3763BE]">
                  {topCat.category
                    ? topCat.category.charAt(0).toUpperCase() +
                      topCat.category.slice(1)
                    : "-"}
                </span>
                <span className="ml-1 text-gray-700">
                  – RM {topCat.total.toFixed(2)}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}
