import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    // Try multiple GitHub contributions API services
    const apis = [
      `https://github-contributions-api.vercel.app/api/v1/${username}?year=${year}`,
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (response.ok) {
          const data = await response.json();
          
          // Handle different API response formats
          let contributionsArray: any[] = [];
          
          if (data.contributions && Array.isArray(data.contributions)) {
            contributionsArray = data.contributions;
          } else if (data.data && Array.isArray(data.data)) {
            contributionsArray = data.data;
          } else if (Array.isArray(data)) {
            contributionsArray = data;
          }

          if (contributionsArray.length > 0) {
            return NextResponse.json({
              contributions: contributionsArray,
              total: contributionsArray.reduce((sum: number, item: any) => sum + (item.count || item[1] || 0), 0),
            });
          }
        }
      } catch (apiError) {
        console.log(`API ${apiUrl} failed, trying next...`);
        continue;
      }
    }

    throw new Error("All APIs failed");
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions", contributions: [], total: 0 },
      { status: 500 }
    );
  }
}
