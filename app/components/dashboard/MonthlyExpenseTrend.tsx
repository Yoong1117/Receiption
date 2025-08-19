// UI components
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import TiltedCard from "@/TiltedCard/TiltedCard";
// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type MonthlyTrendProps = {
  trend: { month: string; total: number }[];
};

export default function MonthlyExpenseTrend({ trend }: MonthlyTrendProps) {
  return (
    <TiltedCard
      imageSrc="https://yzqirhxhflvzgseibsga.supabase.co/storage/v1/object/public/receipts/dashboard/trend.jpg"
      containerHeight="100%"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={6}
      scaleOnHover={1.05}
      showMobileWarning={false}
      displayOverlayContent
      overlayContent={
        <Card className="overflow-hidden bg-[#BADBF7]/90 w-full h-full pt-2 sm:pt-2 lg:pt-4 border border-gray-600">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold">
              Monthly Expense: Trend
            </CardTitle>
          </CardHeader>

          <CardContent className="text-[18px]">
            <div className="h-[170px] sm:h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trend}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "rgba(224, 237, 249, 0.3)" }}
                    formatter={(value: number) => [
                      `RM ${value.toFixed(2)}`,
                      "Total",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                    wrapperStyle={{ outline: "none" }}
                    contentStyle={{
                      backgroundColor: "rgba(224, 237, 249, 0.95)",
                      borderRadius: "6px",
                      width: "140px",
                    }}
                    itemStyle={{
                      fontSize: "14px",
                      padding: 0,
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    radius={[5, 5, 0, 0]}
                    barSize={25}
                    activeBar={false}
                  >
                    {trend.map((_, index) => {
                      const colors = ["#5591DC", "#4077D0", "#3763BE"];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      }
    />
  );
}
