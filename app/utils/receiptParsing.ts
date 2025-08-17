// Clean Text (Remove symbols and unrevelant characters)
// \s: any whitespace character
// +: one or more occurences
// g: global flag, replace all matches

// \x20 → space character (ASCII 32)
// \x7E → ~ character (ASCII 126)
// [^\x20-\x7E] → matches any character NOT in the printable ASCII range

export function preprocess(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[^\x20-\x7E\n]/g, "") // keep only readable ASCII & line breaks
    .replace(/\n{2,}/g, "\n") // merge multiple line breaks
    .trim();
}

export function extractVendor(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blacklist = [
    "welcome",
    "invoice",
    "receipt",
    "thank",
    "sales",
    "pos",
    "staff",
    "reg",
    "cashier",
  ];

  const isValidVendorLine = (line: string): boolean => {
    const lower = line.toLowerCase();

    // Exclude blacklisted words
    if (blacklist.some((word) => lower.includes(word))) return false;

    // Exclude lines that are mostly numbers or symbols
    const alphaCount = (line.match(/[a-z]/gi) || []).length;
    const nonAlphaCount = (line.match(/[^a-z]/gi) || []).length;

    if (alphaCount < 2 || alphaCount < nonAlphaCount) return false;

    // Exclude lines that look like registration numbers
    if (/\b\d{6,}\b/.test(line)) return false;

    return true;
  };

  const firstFew = lines.slice(0, 6);

  for (const line of firstFew) {
    if (isValidVendorLine(line)) {
      return line;
    }
  }

  return null;
}

export function extractDate(text: string) {
  const datePatterns = [
    {
      regex: /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/g, // dd/mm/yyyy
      format: (d: string, m: string, y: string) =>
        `${padYear(y)}-${pad(m)}-${pad(d)}`,
    },
    {
      regex:
        /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+(\d{4})/gi,
      format: (d: string, month: string, y: string) =>
        `${y}-${convertMonth(month)}-${pad(d)}`,
    },
    {
      regex:
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/gi,
      format: (month: string, d: string, y: string) =>
        `${y}-${convertMonth(month)}-${pad(d)}`,
    },
    {
      regex: /(\d{2,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g, // yyyy/mm/dd
      format: (y: string, m: string, d: string) =>
        `${padYear(y)}-${pad(m)}-${pad(d)}`,
    },
  ];

  const allMatches: {
    index: number;
    formatted: string;
  }[] = [];

  for (const pattern of datePatterns) {
    const matches = [...text.matchAll(pattern.regex)];

    for (const match of matches) {
      try {
        const formatted = pattern.format(match[1], match[2], match[3]);
        const dateObj = new Date(formatted);
        if (!isNaN(dateObj.getTime())) {
          allMatches.push({
            index: match.index ?? text.indexOf(match[0]),
            formatted,
          });
        }
      } catch (e) {
        // Ignore bad matches
      }
    }
  }

  // Sort by appearance in text and return first valid
  allMatches.sort((a, b) => a.index - b.index);
  return allMatches.length > 0 ? allMatches[0].formatted : null;
}

export function extractTotal(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const totalKeywords = [
    "grand total",
    "total amount",
    "amount due",
    "total sales",
    "net total",
    "sub-total",
    "subtotal",
    "total",
  ];

  const excludeKeywords = [
    "received",
    "paid",
    "payment method",
    "change",
    "cash",
    "wallet",
    "tng",
  ];

  let totalFromLine: number | null = null;

  // 1. Try keyword-based total detection (excluding bad keywords)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (
      totalKeywords.some((keyword) => line.includes(keyword)) &&
      !excludeKeywords.some((bad) => line.includes(bad))
    ) {
      const match = lines[i].match(/\d+\.\d{2}/);
      if (match) {
        totalFromLine = parseFloat(match[0]);
        break;
      }
    }
  }

  // 2. Fallback: all amounts excluding "bad" lines and their next line
  const skipLines = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (excludeKeywords.some((bad) => lower.includes(bad))) {
      skipLines.add(i);
      skipLines.add(i + 1); // also skip next line
    }
  }

  const fallbackMatches = lines
    .flatMap((line, i) => {
      if (skipLines.has(i)) return [];
      return line.match(/\d+\.\d{2}/g) || [];
    })
    .map(parseFloat);

  const maxAmount =
    fallbackMatches.length > 0 ? Math.max(...fallbackMatches) : null;

  return totalFromLine ?? maxAmount;
}

export function extractCategory(text: string) {
  const CATEGORY_PATTERNS: Record<string, RegExp> = {
    utilities:
      /\b(water|syabas|electric|electricity|power|tenaga|gas|lpg|pipedgas|internet|broadband|wifi|fiber|fibre|unifi|streamyx|maxis|celcom|digi|tmnet|telco|postpaid|prepaid|sim|data|airtime|sms|mms|tv|astro|netflix|disney|hbo|primevideo|iflix|tonton|mytv|subscription|utility|utilities|bill|billing)s?\b/i,

    travel:
      /\b(hotel|motel|hostel|lodging|accommodation|airbnb|stay|flight|airline|airfare|airasia|malaysiaairlines|mas|boarding|jetstar|passport|immigration|travel|tour|itinerary|reservation|monorail|carhire|ferry)s?\b/i,

    food: /\b(food|restaurant|cafe|coffee|dining|snack|drink|meal|meals|eatery|eateries|beverage|beverages|lunch|breakfast|dinner|kopitiam|fastfood|takeaway|take-out|takeout|bistro|canteen|stall|buffet|foodcourt|mamak|fnb|deli)s?\b/i,

    groceries:
      /\b(grocer|grocery|supermarket|hypermarket|market|minimart|(?:\w+\s?)?mart|tesco|mydin|aeon|lotus|giant|jaya|99speedmart|wetmarket|daily\sneeds|grocerystore|coldstorage|bens|villagegrocer|econsave)s?\b/i,

    transport:
      /\b(grab|uber|taxi|ride|bus|train|mrt|lrt|monorail|toll|parking|fare|fuel|petrol|diesel|shell|petronas|mobil|caltex|bicycle|bike|parkinglot|ezlink|myrapid|rapidkl|ktm|transport|transportation|commute|rideshare|ride-hailing)s?\b/i,

    health:
      /\b(pharmacy|vitamin|medicine|medication|supplement|drugs|watsons|guardian|clinic|hospital|health|wellness|personal\s?care|dental|denture|eyecare|optical|prescription|skinclinic|derma|medicalcheckup|medicines)s?\b/i,

    clothing:
      /\b(clothing|clothes|fashion|apparel|shirt|t[\s\-]?shirt|blouse|pants|trousers|dress|wear|footwear|jeans|jacket|sock|shoe|sneaker|accessory|accessories|hat|cap|scarf|belt|glove|outfit|undergarment|innerwear)s?\b/i,

    household:
      /\b(furniture|cleaning|cleaner|detergent|kitchen|cookware|utensil|home|household|decor|bed|bedding|blanket|pillow|curtain|rug|storage|light|lighting|repair|tool|hardware|diy|maintenance|appliance|freshener)s?\b/i,

    personal:
      /\b(haircut|salon|spa|beauty|makeup|cosmetic|skincare|massage|grooming|facial|manicure|pedicure|waxing|barber|selfcare|personal\s?care)s?\b/i,

    entertainment:
      /\b(movie|cinema|entertainment|netflix|spotify|youtube|game|gaming|concert|show|leisure|funfair|event|livestream|streaming|disney|hbo|theater|music|musical|poker)s?\b/i,

    education:
      /\b(book|tuition|course|study|studies|school|exam|learning|class|classes|college|university|online\s?course|tuition\s?fee)s?\b/i,

    office:
      /\b(office|stationery|paper|printer|ink|file|files|desk|chair|pen|pencil|notebook|textbook|supply|supplies|print|toner|folder|label|envelope|clip|whiteboard|planner|calendar|stapler)s?\b/i,

    electronics:
      /\b(electronic|gadget|laptop|tablet|tech|device|charger|usb|accessory|accessories|appliance|machine|computer|monitor|screen|tv|smartwatch|headphone|earphone|camera|drone)s?\b/i,

    charity:
      /\b(donation|donations|zakat|tabung|charity|offering|wakaf|sumbangan|fund|funds|nonprofit|amal|sedekah|yayasan|relief|infaq|qurban)s?\b/i,
  };

  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (pattern.test(text)) {
      return category;
    }
  }
}

export function extractPaymentMethod(text: string) {
  const PAYMENT_PATTERNS: Record<string, RegExp> = {
    tng: /\b(touch[ -]?n[ -]?go|tng|tngo|touchngo|tngewallet)\b/i,
    grabpay: /\b(grabpay|grab pay|paid with grab)\b/i,
    shopeepay: /\b(shopeepay|shopee pay|paid with shopee)\b/i,
    card: /\b(credit card|debit card|visa|mastercard|amex|american express)\b/i,
    cash: /\b(cash|tunai)\b/i,
    bank: /\b(maybank|cimb|rhb|public bank|ambank|bank islam|bank rakyat|hsbc|ocbc|uob|affin)\b/i,
    fpx: /\b(fpx|online banking|internet banking|bank transfer|instant transfer)\b/i,
    boost: /\b(boostpay|boost)\b/i,
    duitnow: /\b(duitnow)\b/i,
    bigpay: /\b(bigpay|big pay)\b/i,
    paypal: /\b(paypal)\b/i,
    stripe: /\b(stripe)\b/i,
    qr: /\b(qr ?pay(ment)?|scan ?& ?pay|qr code|qr)\b/i,
    unionpay: /\b(union ?pay)\b/i,
    alipay: /\b(ali ?pay)\b/i,
    wechatpay: /\b(wechat ?pay)\b/i,
    applepay: /\b(apple ?pay)\b/i,
    googlepay: /\b(google ?pay|gpay)\b/i,
    samsungpay: /\b(samsung ?pay)\b/i,
  };

  for (const [method, pattern] of Object.entries(PAYMENT_PATTERNS)) {
    if (pattern.test(text)) {
      return method;
    }
  }
}

export function convertMonth(shortMonth: string): string {
  const months: { [key: string]: string } = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const cleaned =
    shortMonth.slice(0, 3).charAt(0).toUpperCase() +
    shortMonth.slice(1, 3).toLowerCase();
  return months[cleaned] || "01";
}

export function pad(num: string): string {
  // Add 0 up to 2 digits
  return num.padStart(2, "0");
}

export function padYear(year: string): string {
  if (year.length === 2) {
    const num = parseInt(year, 10);
    return num < 26 ? `20${year}` : `19${year}`; // heuristic cutoff
  }
  return year;
}
