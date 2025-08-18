// UI components
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import TiltedCard from "@/TiltedCard/TiltedCard";

type topCategoriesProps = {
  categories: { category: string; total: number }[];
};

export default function TopSpendingCategories({
  categories,
}: topCategoriesProps) {
  return (
    <TiltedCard
      imageSrc="https://yzqirhxhflvzgseibsga.supabase.co/storage/v1/object/public/receipts/dashboard/top3categories.jpg"
      containerHeight="300px"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={6}
      scaleOnHover={1.05}
      showMobileWarning={false}
      displayOverlayContent={true}
      overlayContent={
        <Card className="bg-[#E0EDF9]/90 w-full h-full p-6 border border-gray-500">
          <CardHeader>
            <CardTitle className="text-[28px] font-bold ">
              Top 3 Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[18px] space-y-2">
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <div key={index} className="flex justify-between pb-1">
                  <span className="font-semibold">
                    {index + 1}.{" "}
                    {cat.category.charAt(0).toUpperCase() +
                      cat.category.slice(1)}
                  </span>
                  <span className="font-bold text-[#3763BE]">
                    RM {cat.total.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </CardContent>
        </Card>
      }
    />
  );
}
