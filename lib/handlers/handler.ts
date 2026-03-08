
import {
  databases,
  DB_ID,
  STOCK_PRICE_COLLECTION_ID,
  STOCK_PRICE_DOC_ID,
} from "../appwrite/client";

export async function fetchTeslaPrice() {
  const apiKey = 'd583bspr01qptoaq18ogd583bspr01qptoaq18p0';

  if (!apiKey) throw new Error("Missing API Key");

  try {
    // 'c' is the current price
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=TSLA&token=${apiKey}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds to save API calls
      }
    );

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    return data.c; // Finnhub returns 'c' for current price
  } catch (error) {
    console.error(error);
    return 0; // Fallback
  }
}
export async function fetchStockPrice(symbol: string) {
  const key = symbol.toLowerCase(); // spacex, tesla, neuralink

  const doc: any = await databases.getDocument(
    DB_ID,
    STOCK_PRICE_COLLECTION_ID,
    STOCK_PRICE_DOC_ID
  );

  // Return number safely
  const price = Number(doc[key] || 0);

  return price;
}
