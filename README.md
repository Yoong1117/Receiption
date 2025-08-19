## 🚀 Live Demo

🔗 [View the App on Vercel](https://receiptionv1.vercel.app/)

## ✨ Features

### 👤 User Authentication

- Secure login/signup with Google OAuth via Supabase

### 📊 Dashboard

- Year-to-date expense summary
- Current month expense summary
- Monthly expenses bar chart
- Top 3 spending categories

### 📤 Receipt Upload Page

- Upload receipt images (click-to-upload or drag & drop)
- Store image and URL in Supabase
- Display parsed receipt fields
- Allow user to edit before saving
- Confirm and save to database

### 🔍 OCR & Data Extraction

- Extract raw text from receipts using Google Vision API (OCR)
- Parse structured data with regex and autofill form fields:
  - Vendor
  - Date of purchase
  - Total amount
  - Payment method
  - Category
  - Remark
- Store both raw and structured data

### 📁 Receipt Management Page

- View, edit, and delete uploaded receipts
- Search by:
  - Vendor
  - Payment method
  - Category
- Sort receipts in ascending/descending order

### 🗑️ Deleted Receipt Page

- Sort & filter deleted receipts
- View soft-deleted receipts
- Restore or permanently delete receipts
