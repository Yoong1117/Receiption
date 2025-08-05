import type { Route } from "./+types/receipt_management";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Management" }];
}

export default function ReceiptManagement() {
  return <div> Receipt Management </div>;
}
