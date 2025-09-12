import { NextRequest, NextResponse } from 'next/server';
import { getCatalogBooks } from '@/lib/actions/book.actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const availability = (searchParams.get('availability') as 'all' | 'available' | 'unavailable') || 'all';

    const result = await getCatalogBooks({
      page,
      limit,
      query,
      category,
      availability
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in catalog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
