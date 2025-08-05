// React Router
import type { Route } from "./+types/dashboard";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CountUp from "@/CountUp/CountUp";
import AnimatedContent from "@/AnimatedContent/AnimatedContent";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

// Auth
import ProtectedRoute from "~/components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

function DashboardContent() {
  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Sidebar */}
      <AppSidebar />

      {/* Dashboard Content */}
      <div className="flex flex-1 relative z-10">
        {/* Main Content */}
        <div className="flex-col flex-1">
          {/* Top Bar */}
          <div className="text-white px-6 pr-8 bg-transparent">
            <div className="flex justify-between items-center w-full">
              {/* Left: Sidebar Trigger */}
              <SidebarTrigger className="bg-gray-200/90 hover:bg-gray-400 text-black hover:text-white mt-4 ml-2 border border-black cursor-pointer" />
            </div>
          </div>

          {/* Dashboard Content */}
          <main
            className="flex-1 w-full p-8 grid gap-8
                 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 auto-rows-fr"
          >
            {/* Number of Receipts - Dark Red */}
            <div className="col-span-2">
              <AnimatedContent
                distance={150}
                direction="horizontal"
                reverse
                duration={1.2}
                ease="power3.out"
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.2}
              >
                <Card className="bg-gray-300 w-full h-[300px] p-6 border-black text-black">
                  <CardHeader>
                    <CardTitle className="text-[28px] font-semibold">
                      Number of Receipts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-[100px] font-semibold">
                    <CountUp
                      from={0}
                      to={10}
                      separator=","
                      direction="up"
                      duration={1}
                      delay={0.4}
                    />
                  </CardContent>
                </Card>
              </AnimatedContent>
            </div>

            {/* Monthly Expense Summary - Dark Green */}
            <div className="col-span-3">
              <AnimatedContent
                distance={150}
                direction="vertical"
                reverse
                duration={1.2}
                ease="power3.out"
                animateOpacity
                scale={1.1}
                threshold={0.4}
                delay={0.4}
              >
                <Card className="bg-gray-400/80 w-full h-[300px] p-6 border-black text-black">
                  <CardHeader>
                    <CardTitle className="text-[28px] font-bold">
                      Monthly Expense: Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[18px]">
                    <label>Total Spent: RM652.30</label> <br />
                    <label>Highest Spent: RM320.00 @ IKEA</label> <br />
                    <label>Top Category: Food & Dining (RM120)</label>
                  </CardContent>
                </Card>
              </AnimatedContent>
            </div>

            {/* Monthly Expense Trend*/}
            <div className="col-span-3">
              <AnimatedContent
                distance={150}
                direction="vertical"
                duration={1.2}
                ease="power3.out"
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.6}
              >
                <Card className="bg-gray-500/80 w-full h-[300px] p-6 border-black text-black">
                  <CardHeader>
                    <CardTitle className="text-[28px] font-bold">
                      Monthly Expense: Trend
                    </CardTitle>
                  </CardHeader>
                </Card>
              </AnimatedContent>
            </div>

            {/* Top Spending Categories*/}
            <div className="col-span-2">
              <AnimatedContent
                distance={150}
                direction="horizontal"
                duration={1.2}
                ease="power3.out"
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.8}
              >
                <Card className="bg-gray-200/60 w-full h-[300px] p-6 border-black text-black">
                  <CardHeader>
                    <CardTitle className="text-[28px] font-bold">
                      Top Spending Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[18px]">
                    <label>1. Groceries - RM250</label> <br />
                    <label>2. Dining - RM180</label> <br />
                    <label>3. Transport - RM20</label> <br />
                    <label>4. Utilities - RM90</label>
                  </CardContent>
                </Card>
              </AnimatedContent>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
