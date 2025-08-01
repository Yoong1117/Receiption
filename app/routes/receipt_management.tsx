import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Receipt Management" }];
}

export default function ReceiptManagement() {
  return <div> Receipt Management </div>;
}
