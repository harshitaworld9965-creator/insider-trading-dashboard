import { NextResponse } from 'next/server';
import { getStockData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const { ticker } = params;
    const data = await getStockData(ticker);
    
    return NextResponse.json({ ticker, data });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch data for ${params.ticker}` },
      { status: 500 }
    );
  }
}