// routes/api/ocr.ts
import type { ActionFunctionArgs } from "react-router";
import vision from "@google-cloud/vision";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS env variable");
}

// Decode base64 first
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "base64").toString(
    "utf-8"
  )
);

const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  projectId: credentials.project_id,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file" }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const [result] = await client.textDetection(buffer);
  const rawText = result.textAnnotations?.[0]?.description || "";

  return new Response(JSON.stringify({ rawText }), {
    headers: { "Content-Type": "application/json" },
  });
}
