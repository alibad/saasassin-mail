import { redirect } from "next/navigation";

// src/proxy.ts serves SaaSassin Mail at "/" whenever STANDALONE_PRODUCT is set (next.config.ts
// sets it by default). This page only renders if it is not, and sends visitors to the product.
export default function Home() {
  redirect("/apps/mail");
}
