import { supabase } from "~/supabase/supabaseClient";

export async function uploadImage(file: File, userId: string) {
  const filePath = `private/${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("receipts")
    .upload(filePath, file);
  if (error) throw error;

  const { data } = supabase.storage.from("receipts").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function insertReceipt(
  userId: string,
  imageUrl: string,
  rawText: string
) {
  const { data, error } = await supabase
    .from("receipts")
    .insert([
      {
        user_id: userId,
        is_active: true,
        image_url: imageUrl,
        raw_text: rawText,
      },
    ])
    .select("id");

  if (error) throw error;
  return data[0].id;
}

export async function insertParsedReceipt(
  receipt_id: string,
  vendor: string,
  amount: string,
  date: string,
  payment: string,
  category: string,
  remark?: string
) {
  const { error } = await supabase
    .from("parsed_receipts")
    .insert([
      {
        receipt_id,
        vendor,
        total_amount: amount,
        date,
        payment_method: payment,
        category,
        remark: remark || null,
      },
    ]);
  if (error) throw error;
}
