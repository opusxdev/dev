"use client";

import { useEffect, useState } from "react";

interface ContributionData {
  date: string;
  count: number;
}

export default function GitHubCalendar({ username }: { username: string }) {
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchContributions = async () => {
      if (!username || username === "YOUR_GITHUB_USERNAME") {
        // Generate sample data for demo
        const mockData: ContributionData[] = [];
        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const count = Math.floor(Math.random() * 5);
          mockData.push({
            date: d.toISOString().split("T")[0],
            count,
          });
        }
        setContributions(mockData);
        setTotalContributions(mockData.reduce((sum, day) => sum + day.count, 0));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use our own API route to avoid CORS issues
        const response = await fetch(
          `/api/github-contributions?username=${username}&year=${selectedYear}`
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.contributions && Array.isArray(data.contributions) && data.contributions.length > 0) {
            const formattedData: ContributionData[] = data.contributions.map(
              (item: any) => ({
                date: item.date || item[0] || "",
                count: item.count || item[1] || 0,
              })
            ).filter((item: ContributionData) => item.date); // Filter out invalid dates

            setContributions(formattedData);
            setTotalContributions(data.total || formattedData.reduce((sum, day) => sum + day.count, 0));
            setLoading(false);
            return;
          }
        }

        // Fallback: Try direct API calls if our API route fails
        const apis = [
          `https://github-contributions-api.vercel.app/api/v1/${username}?year=${selectedYear}`,
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`,
        ];

        let success = false;
        for (const apiUrl of apis) {
          try {
            const directResponse = await fetch(apiUrl, {
              headers: {
                'Accept': 'application/json',
              },
            });

            if (directResponse.ok) {
              const directData = await directResponse.json();
              
              // Handle different API response formats
              let contributionsArray: any[] = [];
              
              if (directData.contributions && Array.isArray(directData.contributions)) {
                contributionsArray = directData.contributions;
              } else if (directData.data && Array.isArray(directData.data)) {
                contributionsArray = directData.data;
              } else if (Array.isArray(directData)) {
                contributionsArray = directData;
              }

              if (contributionsArray.length > 0) {
                const formattedData: ContributionData[] = contributionsArray.map(
                  (item: any) => ({
                    date: item.date || item[0] || "",
                    count: item.count || item[1] || 0,
                  })
                ).filter((item: ContributionData) => item.date);

                setContributions(formattedData);
                setTotalContributions(
                  formattedData.reduce((sum, day) => sum + day.count, 0)
                );
                success = true;
                break;
              }
            }
          } catch (apiError) {
            console.log(`Direct API ${apiUrl} failed, trying next...`);
            continue;
          }
        }

        if (!success) {
          throw new Error("All APIs failed");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contributions:", error);
        // Fallback to mock data
        const mockData: ContributionData[] = [];
        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const count = Math.floor(Math.random() * 5);
          mockData.push({
            date: d.toISOString().split("T")[0],
            count,
          });
        }
        setContributions(mockData);
        setTotalContributions(mockData.reduce((sum, day) => sum + day.count, 0));
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, selectedYear]);

  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  const getColorClass = (intensity: number): string => {
    const colors = [
      "bg-[#1A1A1A] border border-[#2A2A2A]", // empty with subtle border
      "bg-[#FF6B35] border border-[#2A2A2A] opacity-30",
      "bg-[#FF6B35] border border-[#2A2A2A] opacity-50",
      "bg-[#FF6B35] border border-[#2A2A2A] opacity-70",
      "bg-[#FF6B35] border border-[#2A2A2A] opacity-100",
    ];
    return colors[intensity] || colors[0];
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weeks: ContributionData[][] = [];
  const startDate = new Date(selectedYear, 0, 1);
  const endDate = new Date(selectedYear, 11, 31);
  
  // Get the first day of the year and find which day of the week it is
  const firstDay = new Date(selectedYear, 0, 1);
  const startDayOfWeek = firstDay.getDay();
  
  // Create empty days for the first week if needed
  const firstWeek: ContributionData[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    firstWeek.push({ date: "", count: 0 });
  }
  
  // Add actual days
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayData = contributions.find((c) => c.date === dateStr) || {
      date: dateStr,
      count: 0,
    };
    firstWeek.push(dayData);
    
    if (firstWeek.length === 7) {
      weeks.push([...firstWeek]);
      firstWeek.length = 0;
    }
  }
  
  if (firstWeek.length > 0) {
    while (firstWeek.length < 7) {
      firstWeek.push({ date: "", count: 0 });
    }
    weeks.push(firstWeek);
  }

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded">
        <p className="text-[#999] text-sm">Loading contributions...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-4 md:p-6 rounded font-mono">
      {/* Contribution graph */}
      <div className="mb-4">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-[#1A1A1A] hover:scrollbar-thumb-[#FF6B35]">
          <div className="inline-block">
            <div className="flex gap-1 mb-2">
              <div className="w-4"></div>
              {months.map((month, idx) => {
                const monthStart = new Date(selectedYear, idx, 1);
                const weekStart = new Date(monthStart);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                return (
                  <div
                    key={month}
                    className="text-[#999] text-xs sm:text-sm font-normal"
                    style={{ minWidth: `${(weeks.length / 12) * 11}px` }}
                  >
                    {month}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 text-[#999] text-xs sm:text-sm pr-2 font-normal">
                {["", "Mon", "", "Wed", "", "Fri", ""].map((day, idx) => (
                  <div key={idx} className="h-3 flex items-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                      const intensity = getIntensity(day.count);
                      return (
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          className={`w-3 h-3 ${getColorClass(intensity)}`}
                          title={
                            day.date
                              ? `${day.date}: ${day.count} contributions`
                              : ""
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution summary and legend */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="text-[#E5E5E5] text-sm sm:text-base font-normal">
          {totalContributions} contributions in {selectedYear}
        </div>
        <div className="flex items-center gap-2 text-[#999] text-xs sm:text-sm font-normal">
          <span>Less</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 bg-[#FF6B35] border border-[#2A2A2A]`}
                style={{ opacity: level * 0.25 }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Year navigation */}
      <div className="flex items-center gap-4 text-xs sm:text-sm text-[#999] font-normal flex-wrap">
        {[2024, 2025, 2026].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`hover:text-[#FF6B35] transition-colors ${
              selectedYear === year ? "underline decoration-[#FF6B35] underline-offset-2" : ""
            }`}
          >
            {year}
          </button>
        ))}
        <span className="text-[#999] ml-auto">Viewing: {selectedYear}</span>
      </div>
    </div>
  );
}
