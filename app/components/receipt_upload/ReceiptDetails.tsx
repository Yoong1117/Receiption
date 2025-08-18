// React Router
import { useNavigate } from "react-router";

// UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/components/ui/command";

// Icons
import { ChevronsUpDown, Check } from "lucide-react";

// Utility for Tailwind
import { cn } from "~/lib/utils";

interface Option {
  id: string;
  label: string;
}

interface ReceiptDetailsFormProps {
  from: string;
  vendor: string;
  date: string;
  amount: string;
  selectedPayment: string;
  selectedCategory: string;
  remark: string;
  paymentMethods: Option[];
  categories: Option[];
  paymentOpen: boolean;
  categoryOpen: boolean;
  setVendor: (value: string) => void;
  setDate: (value: string) => void;
  setAmount: (value: string) => void;
  setSelectedPayment: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setRemark: (value: string) => void;
  setPaymentOpen: (open: boolean) => void;
  setCategoryOpen: (open: boolean) => void;
  onSubmit: () => void;
}

export default function ReceiptDetailsForm(props: ReceiptDetailsFormProps) {
  const navigate = useNavigate();

  const {
    from,
    vendor,
    date,
    amount,
    selectedPayment,
    selectedCategory,
    remark,
    paymentMethods,
    categories,
    paymentOpen,
    categoryOpen,
    setVendor,
    setDate,
    setAmount,
    setSelectedPayment,
    setSelectedCategory,
    setRemark,
    setPaymentOpen,
    setCategoryOpen,
    onSubmit,
  } = props;

  return (
    <Card className="bg-white/90 w-1/2 rounded-none border-l border-gray-200 flex flex-col">
      <CardHeader className="sticky top-0 z-10">
        <CardTitle>Receipt Details</CardTitle>
        <CardDescription>
          Check and edit the receipt information
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Vendor */}
        <div className="grid gap-2">
          <Label htmlFor="vendor">
            Vendor<span className="text-red-500">*</span>
          </Label>
          <Input
            id="vendor"
            className="w-[200px]"
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
          />
        </div>

        {/* Date */}
        <div className="grid gap-2">
          <Label htmlFor="date">
            Date<span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            className="w-[200px]"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Amount */}
        <div className="grid gap-2">
          <Label htmlFor="amount">
            Amount (RM)<span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            className="w-[200px]"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required={true}
          />
        </div>

        {/* Payment Method */}
        <div className="grid gap-2">
          <Label htmlFor="payment">Payment method</Label>
          <Popover open={paymentOpen} onOpenChange={setPaymentOpen}>
            <PopoverTrigger asChild className="border-gray-200">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={paymentOpen}
                className="w-[200px] justify-between bg-transparent"
              >
                {selectedPayment
                  ? paymentMethods.find((p) => p.id === selectedPayment)?.label
                  : "Select Payment..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border-gray-200">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No payment method found.</CommandEmpty>
                  <CommandGroup>
                    {paymentMethods.map((payment) => (
                      <CommandItem
                        key={payment.id}
                        value={payment.id}
                        onSelect={(value) => {
                          setSelectedPayment(
                            value === selectedPayment ? "" : value
                          );
                          setPaymentOpen(false);
                        }}
                      >
                        {payment.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedPayment === payment.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Category */}
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild className="border-gray-200">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-[200px] justify-between bg-transparent"
              >
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.label
                  : "Select Category..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border-gray-200">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.id}
                        onSelect={(value) => {
                          setSelectedCategory(
                            value === selectedCategory ? "" : value
                          );
                          setCategoryOpen(false);
                        }}
                      >
                        {category.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedCategory === category.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Remark */}
        <div className="grid gap-2">
          <Label htmlFor="remark">Remark (Optional)</Label>
          <Input
            id="remark"
            className="w-[200px]"
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>
      </CardContent>

      {from === "receipt_upload" && (
        <CardFooter className="pt-10 flex justify-center">
          <Button
            type="button"
            onClick={onSubmit}
            className="px-6 py-2 cursor-pointer bg-[#4077D0] hover:bg-[#3763BE]"
          >
            Add
          </Button>
        </CardFooter>
      )}

      {from === "receipt_edit" && (
        <CardFooter className="pt-10 flex justify-between">
          <Button
            type="button"
            onClick={() => navigate("/receipt_management")}
            className="px-6 py-2 cursor-pointer bg-red-700/90 hover:bg-red-600/90 text-white hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="px-6 py-2 cursor-pointer bg-[#4077D0] hover:bg-[#3763BE]"
          >
            Confirm
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
