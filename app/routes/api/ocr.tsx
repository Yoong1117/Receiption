// routes/api/ocr.ts
import type { ActionFunctionArgs } from "react-router";
import vision from "@google-cloud/vision";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON env variable");
}

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

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
