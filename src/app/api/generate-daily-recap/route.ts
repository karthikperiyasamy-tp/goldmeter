import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateDailyRecap } from '@/lib/gemini';
import { 
  getNewsForDate, 
  saveRecap, 
  recapExists, 
  getYesterdayDate,
  formatDateForDisplay,
  ensureRecapIndexes,
} from '@/lib/recapDB';

// Generate slug from date
function generateSlug(date: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = d.getFullYear();
  return `daily-recap-${day}-${month}-${year}`;
}

export async function POST(request: Request) {
  try {
    console.log('🤖 Starting daily recap generation...');

    // Get date from request or use yesterday
    const body = await request.json().catch(() => ({}));
    const targetDate = body.date || getYesterdayDate();
    
    console.log(`📅 Generating recap for: ${targetDate}`);

    // Ensure indexes
    await ensureRecapIndexes();

    // Check if recap already exists (skip if forced)
    if (!body.force && await recapExists(targetDate)) {
      console.log(`⚠️ Recap already exists for ${targetDate}`);
      return NextResponse.json({
        success: false,
        error: 'Recap already exists for this date',
        date: targetDate,
      });
    }

    // Get news articles for the date
    const articles = await getNewsForDate(targetDate);
    console.log(`📰 Found ${articles.length} articles for ${targetDate}`);

    if (articles.length < 3) {
      console.log(`⚠️ Not enough articles (${articles.length}) to generate recap`);
      return NextResponse.json({
        success: false,
        error: `Not enough articles (${articles.length}) to generate recap. Need at least 3.`,
        date: targetDate,
      });
    }

    // Prepare headlines for AI
    const headlines = articles.slice(0, 15).map(article => ({
      title: article.title,
      source: article.sourceName,
      summary: article.summary,
    }));

    // Generate recap using Gemini
    console.log('🤖 Calling Gemini API...');
    const displayDate = formatDateForDisplay(targetDate);
    const generated = await generateDailyRecap(headlines, displayDate);
    console.log(`✅ Generated recap: "${generated.title}"`);

    // Save to database
    const recap = await saveRecap({
      date: targetDate,
      title: generated.title,
      slug: generateSlug(targetDate),
      summary: generated.summary,
      content: generated.content,
      highlights: generated.highlights,
      sourcesCount: articles.length,
      generatedAt: new Date(),
      publishedAt: new Date(),
    });

    console.log(`💾 Saved recap to database`);

    // Revalidate news page and recap page
    revalidatePath('/news');
    revalidatePath(`/news/recap/${recap.slug}`);

    return NextResponse.json({
      success: true,
      message: `Generated recap for ${displayDate}`,
      recap: {
        title: recap.title,
        slug: recap.slug,
        date: recap.date,
        sourcesCount: recap.sourcesCount,
      },
    });

  } catch (error) {
    console.error('❌ Error generating recap:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for easy testing
export async function GET() {
  const mockRequest = new Request('http://localhost/api/generate-daily-recap', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  return POST(mockRequest);
}

