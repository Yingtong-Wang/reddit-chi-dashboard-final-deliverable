"use client"

import { Users, MessageSquare, Eye, ChevronUp, TrendingUp, Activity } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/data-context"
import { WeekSelector } from "@/components/week-selector"
import week1Data from '@/data/combined.json'
import week2Data from '@/data/combined-week2.json'
import week3Data from '@/data/week-3.json'

// Data files loaded via context
console.log('Dashboard: Component initialized')

const chartConfig = {
  composite: {
    label: "CHS Composite",
    color: "hsl(var(--chart-1))",
  },
  qual: {
    label: "CHS Qualitative",
    color: "hsl(var(--chart-2))",
  },
  quan: {
    label: "CHI Quantitative",
    color: "hsl(var(--chart-3))",
  },
}

// Navigation sections
const navigationSections = [
  { id: "overview", label: "Overview" },
  { id: "drilldown", label: "Drilldown" },
  { id: "compare", label: "Compare All" },
]

// Helper function to get display name from data
function getDisplayName(subreddit: string): string {
  return subreddit;
}

// Helper function to get status from CHS_qual (as a proxy for composite)
function getStatusFromComposite(score: number): string {
  if (score >= 730) return "Exemplary";
  if (score >= 650) return "Healthy";
  if (score >= 589) return "Developing";
  return "At-Risk";
}

function getStatusColor(status: string) {
  switch (status) {
    case "Exemplary":
      return "bg-purple-500"
    case "Healthy":
      return "bg-green-500"
    case "Developing":
      return "bg-yellow-500"
    case "At-Risk":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Exemplary":
      return "default"
    case "Healthy":
      return "secondary"
    case "Developing":
      return "outline"
    case "At-Risk":
      return "destructive"
    default:
      return "secondary"
  }
}

// Status Threshold Band Component
function StatusThresholdBand({ score }: { score: number }) {
  // Calculate pointer position based on status thresholds
  const getPointerPosition = (score: number) => {
    if (score <= 588) {
      // At-Risk: 0-588 (0-58.8%)
      return (score / 588) * 58.8;
    } else if (score <= 649) {
      // Developing: 589-649 (58.8-64.9%)
      return 58.8 + ((score - 589) / 61) * 6.1;
    } else if (score <= 729) {
      // Healthy: 650-729 (64.9-72.9%)
      return 64.9 + ((score - 650) / 80) * 8;
    } else {
      // Exemplary: 730-1000 (72.9-100%)
      return 72.9 + ((score - 730) / 270) * 27.1;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>588</span>
        <span>649</span>
        <span>729</span>
        <span>1000</span>
      </div>
      <div className="relative h-12 rounded-lg overflow-hidden flex">
        <div className="bg-red-500" style={{ flexBasis: '58.8%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">At-Risk</div>
        </div>
        <div className="bg-yellow-500" style={{ flexBasis: '6.1%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">Developing</div>
        </div>
        <div className="bg-green-500" style={{ flexBasis: '8%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">Healthy</div>
        </div>
        <div className="bg-purple-500" style={{ flexBasis: '27.1%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">Exemplary</div>
        </div>
        <div
          className="absolute top-0 w-2 h-full bg-black z-10 transform -translate-x-1"
          style={{ left: `${getPointerPosition(score)}%` }}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">{score}</div>
        <p className="text-lg font-medium">Current CHS Composite Score</p>
      </div>
    </div>
  );
}

// Back to Top Button Component
function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button onClick={scrollToTop} className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg z-50" size="icon">
      <ChevronUp className="h-4 w-4" />
      <span className="sr-only">Back to top</span>
    </Button>
  )
}

export default function Dashboard() {
  const { currentData, selectedWeek, setSelectedWeek, weeks, isLoading, getInsights } = useData()
  
  // Debug logging
  console.log('Dashboard render:', {
    selectedWeek,
    dataLength: currentData?.length,
    isLoading,
    sampleData: currentData?.[0]?.subreddit
  })

  // Filter out subreddits with composite score of 0 for better UX
  const validSubreddits = useMemo(() => {
    return currentData.filter((item) => item.CHS_composite !== null && Number(item.CHS_composite) > 0)
  }, [currentData])

  const [selectedSubreddit, setSelectedSubreddit] = useState<string>(validSubreddits[0]?.subreddit || "")
  const [activeSection, setActiveSection] = useState<string>("overview")
  // Add dropdown state at the top of the component
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const compositeChartData = useMemo(() => {
    return [...validSubreddits]
      .sort((a, b) => (Number(b.CHS_composite) || 0) - (Number(a.CHS_composite) || 0))
      .map((item) => ({
        subreddit: item.subreddit,
        CHS_composite: Number(item.CHS_composite) || 0,
        rawSubreddit: item.subreddit,
      }))
  }, [validSubreddits])

  // Bottom 3 communities by CHS_composite
  const lowestCommunities = useMemo(() => {
    const lastThree = [...compositeChartData].slice(-3)
    return lastThree.sort((a, b) => a.CHS_composite - b.CHS_composite)
  }, [compositeChartData])

  const selectedSubredditData = useMemo(() => {
    return currentData.find((item) => item.subreddit === selectedSubreddit)
  }, [currentData, selectedSubreddit])

  // Prepare radar chart data for current subreddit
  const radarData = useMemo(() => {
    if (!selectedSubredditData) return [];
    return [
      {
        metric: "Sentiment",
        value: Number(selectedSubredditData.Normalized_Sentiment) || 0,
        fullMark: 1000,
      },
      {
        metric: "Civility",
        value: Number(selectedSubredditData.Normalized_Civility) || 0,
        fullMark: 1000,
      },
      {
        metric: "Empathy",
        value: Number(selectedSubredditData.Normalized_Empathy) || 0,
        fullMark: 1000,
      },
      {
        metric: "Helpfulness",
        value: Number(selectedSubredditData.Normalized_Helpfulness) || 0,
        fullMark: 1000,
      },
      {
        metric: "Relevance",
        value: Number(selectedSubredditData.Normalized_Relevance) || 0,
        fullMark: 1000,
      },
    ];
  }, [selectedSubredditData]);

  // Prepare trend line data (weekly data from all weeks)
  const trendData = useMemo(() => {
    if (!selectedSubredditData) return [];
    
    const week1Item = week1Data.find((item: any) => item.subreddit === selectedSubredditData.subreddit);
    const week2Item = week2Data.find((item: any) => item.subreddit === selectedSubredditData.subreddit);
    const week3Item = week3Data.find((item: any) => item.subreddit === selectedSubredditData.subreddit);
    
    const trendPoints = [];
    
    if (week1Item) {
      trendPoints.push({ week: "Week 1", score: Number(week1Item.CHS_composite) || 0 });
    }
    if (week2Item) {
      trendPoints.push({ week: "Week 2", score: Number(week2Item.CHS_composite) || 0 });
    }
    if (week3Item) {
      trendPoints.push({ week: "Week 3", score: Number(week3Item.CHS_composite) || 0 });
    }
    
    return trendPoints;
  }, [selectedSubredditData]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 120 // Account for sticky header
      const elementPosition = element.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.map((section) => section.id)
      const scrollPosition = window.scrollY + 150

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          const offsetPosition = offsetTop - 120 // Declare offsetPosition here
          if (scrollPosition >= offsetTop && scrollPosition < offsetPosition + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!currentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-muted-foreground">Selected subreddit data is not available.</p>
        </div>
      </div>
    )
  }

  const status = getStatusFromComposite(Number(selectedSubredditData?.CHS_composite) || 0)

  // Calculate pointer position based on status thresholds with equal segment sizes
  const getPointerPosition = (score: number) => {
    if (score <= 588) {
      // At-Risk: 0-588 (0-25% of bar)
      return (score / 588) * 25;
    } else if (score <= 649) {
      // Developing: 589-649 (25-50% of bar)
      return 25 + ((score - 589) / 61) * 25;
    } else if (score <= 729) {
      // Healthy: 650-729 (50-75% of bar)
      return 50 + ((score - 650) / 80) * 25;
    } else {
      // Exemplary: 730-1000 (75-100% of bar)
      return 75 + ((score - 730) / 270) * 25;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between w-full max-w-7xl px-12 py-4 mx-auto mb-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-lg text-gray-800">Reddit CHI Dashboard</span>
          </div>
          <WeekSelector 
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            weeks={weeks}
          />
          <div className="relative">
            <button
              className="w-[220px] px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 flex items-center justify-between"
              id="subreddit-menu-button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {selectedSubreddit ? (
                <span>{selectedSubreddit}</span>
              ) : (
                <span className="text-gray-400">Select a Subreddit</span>
              )}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-1">
                  {validSubreddits.map((item) => (
                    <li
                      key={item.subreddit}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 rounded transition-colors ${selectedSubreddit === item.subreddit ? 'bg-gray-100 font-semibold' : ''}`}
                      onClick={() => {
                        setSelectedSubreddit(item.subreddit);
                        setDropdownOpen(false);
                      }}
                    >
                      {item.subreddit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>


      {/* Main Content */}
      <nav className="sticky top-16 z-50 bg-white border-b py-2 px-6 flex gap-6 text-sm font-medium">
        <a href="#compare-communities" className="hover:underline">Compare</a>
        <a href="#health-overview" className="hover:underline">Health</a>
        <a href="#community-drilldown" className="hover:underline">Drilldown</a>
        <a href="#metrics-stats" className="hover:underline">Metrics & Stats</a>
        <a href="#actionable-insights" className="hover:underline">Insights</a>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-8">
        {/* Compare All Section */}
        <section id="compare-communities" className="space-y-4 py-6 scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Compare All Communities</h1>
              <p className="text-xl text-muted-foreground">Comprehensive comparison across all subreddits</p>
            </div>
            {/* Bar Chart and Actionable Insights */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
              {/* Bar Chart - Left Side */}
              <Card className="w-full lg:w-3/5 rounded-xl shadow-md bg-white">
                <CardHeader>
                  <CardTitle>Composite Community Health Score by Subreddit</CardTitle>
                  <CardDescription>
                    CHS Composite scores (0.4 × Qualitative + 0.6 × Quantitative) across all subreddits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[500px] w-11/12">
                    <BarChart
                      data={compositeChartData}
                      layout="horizontal"
                      margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                      barCategoryGap={"20%"}
                      barGap={2}
                      onClick={(data) => {
                        if (data && data.activePayload && data.activePayload[0]) {
                          const clickedSubreddit = data.activePayload[0].payload.rawSubreddit
                          setSelectedSubreddit(clickedSubreddit)
                          scrollToSection("overview")
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subreddit" type="category" interval={0} angle={-30} textAnchor="end" height={70} label={{ value: "Subreddit", position: "insideBottom", offset: -60 }} />
                      <YAxis dataKey="CHS_composite" type="number" domain={[0, 1000]} label={{ value: "CHS Composite Score", angle: -90, position: "insideLeft", offset: 10 }} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {data.subreddit}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      CHS Composite: {data.CHS_composite}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="CHS_composite" radius={[4, 4, 0, 0]} minPointSize={2} fill="#64748b">
                        {compositeChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.rawSubreddit === selectedSubreddit
                                ? "#f59e42" // Highlight selected
                                : "#64748b"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              {/* Lowest CHS Communities - Right Side */}
              <Card className="w-full lg:w-2/5 rounded-xl shadow-md bg-white">
                <CardHeader>
                  <CardTitle>Communities Needing Attention</CardTitle>
                  <CardDescription>3 subreddits with the lowest CHS Composite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowestCommunities.map((item, idx) => (
                      <div key={item.rawSubreddit} className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedSubreddit(item.rawSubreddit)
                          scrollToSection("health-overview")
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-gray-900">{item.subreddit}</span>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            At-Risk
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">CHS Score:</span>
                          <span className="font-bold text-red-600">{item.CHS_composite}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${(item.CHS_composite / 1000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-500 rounded-full p-1 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-800">Priority Action Needed</p>
                        <p className="text-xs text-amber-700 mt-1">
                          These communities require immediate attention to improve their health scores.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Health Overview Section */}
        <section id="health-overview" className="space-y-4 py-6 scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto space-y-2">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Health Overview</h1>
              <p className="text-base text-muted-foreground">
                {getDisplayName(selectedSubredditData?.subreddit || '')} • {status} status • Grade: {selectedSubredditData?.Health_Grade || 'N/A'}
              </p>
            </div>
            <div className="flex flex-row items-stretch justify-center gap-4 w-full">
              <Card className="w-[800px] py-2 px-6 flex flex-col justify-center rounded-xl shadow-md bg-white" style={{ height: '280px' }}>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Community Health Status</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Current CHS Composite score position within health thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center w-full py-0">
                  {/* CHI Status Bar */}
                  <div className="w-full max-w-2xl flex flex-col items-center relative">
                    <div className="flex w-full h-10 rounded-lg overflow-hidden mb-1 relative">
                      <div className="bg-red-500 flex-1"></div>
                      <div className="bg-yellow-500 flex-1"></div>
                      <div className="bg-green-500 flex-1"></div>
                      <div className="bg-purple-500 flex-1"></div>
                      {/* Pointer */}
                      <div
                        className="absolute top-0 w-2 h-10 bg-black z-10 transform -translate-x-1"
                        style={{ left: `${getPointerPosition(Number(selectedSubredditData?.CHS_composite || 0))}%` }}
                      >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                      </div>
                    </div>
                    {/* Subtle labels under the bar */}
                    <div className="flex w-full max-w-2xl justify-between text-xs text-gray-400 mt-0 px-2">
                      <span className="w-1/4 text-left">At-Risk</span>
                      <span className="w-1/4 text-center">Developing</span>
                      <span className="w-1/4 text-center">Healthy</span>
                      <span className="w-1/4 text-right">Exemplary</span>
                    </div>
                  </div>
                  {/* Vertically centered composite score */}
                  <div className="flex flex-col items-center justify-center mt-2 mb-1">
                    <div className="text-4xl font-bold text-gray-900">{selectedSubredditData?.CHS_composite || 'N/A'}</div>
                    <div className="text-base font-medium text-gray-600 mt-1">Current CHS Composite Score</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-[250px] flex flex-col justify-center items-center py-2 px-4 rounded-xl shadow-md bg-white" style={{ height: '280px' }}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Badge variant={getStatusBadgeVariant(status)} className="text-lg px-4 py-2">
                    {status}
                  </Badge>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {selectedSubredditData?.Health_Grade || 'N/A'}
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-1">Grade</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Drilldown Section */}
        <section id="community-drilldown" className="space-y-4 py-6 bg-gray-50 rounded-xl mt-8 scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Community Drilldown</h1>
              <p className="text-xl text-muted-foreground">
                Detailed metrics for {getDisplayName(selectedSubredditData?.subreddit || '')}
              </p>
            </div>

            {/* Radar Chart and Component Breakdown */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Qualitative Health Radar</CardTitle>
                  <CardDescription>Multi-dimensional qualitative assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-11/12">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius={100}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={30} domain={[0, 1000]} />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.6}
                        />
                        <ChartTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* CHI Score Trend Line */}
              <Card className="w-full md:w-1/2 rounded-xl shadow-md bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    CHI Score Trend
                  </CardTitle>
                  <CardDescription>Weekly composite score progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-11/12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[0, 1000]} />
                        <ChartTooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Metrics & Stats */}
            <section id="metrics-stats" className="space-y-4 py-6 mt-8 scroll-mt-24">
            <Card className="w-full max-w-7xl mx-auto rounded-xl shadow-md bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Activity className="h-5 w-5" />
                    Metrics & Statistics
                  </CardTitle>
                  <CardDescription>Performance indicators and community metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Quantitative Performance Metrics */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quantitative Performance Metrics</h3>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                          {
                            name: "Responsiveness",
                            value: Number((Number(selectedSubredditData?.Responsiveness) || 0).toFixed(2)),
                            unit: "",
                            icon: MessageSquare,
                          },
                          { name: "Interaction", value: Number((Number(selectedSubredditData?.Interaction) || 0).toFixed(2)), unit: "", icon: Users },
                          {
                            name: "Content Factor",
                            value: Number((Number(selectedSubredditData?.Content_Factor) || 0).toFixed(2)),
                            unit: "",
                            icon: Eye,
                          },
                          {
                            name: "Traffic Factor",
                            value: Number((Number(selectedSubredditData?.Traffic_Factor) || 0).toFixed(2)),
                            unit: "",
                            icon: TrendingUp,
                          },
                        ].map((metric) => {
                          const Icon = metric.icon
                          return (
                            <Card key={metric.name}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {metric.value}
                                  {metric.unit}
                                </div>
                                <Progress value={Math.min(metric.value * 10, 100)} className="mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {metric.value >= 8
                                    ? "Excellent"
                                    : metric.value >= 6
                                      ? "Good"
                                      : metric.value >= 4
                                        ? "Fair"
                                        : "Poor"}
                                </p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Community Statistics */}
          <div className="w-full max-w-7xl mx-auto">
                      <h3 className="text-lg font-semibold mb-4">Community Statistics</h3>
                      <div className="grid gap-6 md:grid-cols-3 w-full">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {selectedSubredditData?.Subscribers ? Number(selectedSubredditData.Subscribers).toLocaleString() : "N/A"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Total community members
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {selectedSubredditData?.Posts ? Number(selectedSubredditData.Posts).toLocaleString() : "N/A"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Community content volume
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Health Grade</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{selectedSubredditData?.Health_Grade || "N/A"}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Overall community health
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
        {/* Actionable Insights Section - Moved to end */}
        <section id="actionable-insights" className="space-y-4 py-6 scroll-mt-24">
          <div className="w-full max-w-7xl mx-auto">
            <Card className="rounded-xl shadow-md bg-white">
                <CardHeader>
                  <CardTitle>Actionable Insights</CardTitle>
                  <CardDescription>Improvement suggestions for {getDisplayName(selectedSubredditData?.subreddit || '')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Current Insight
                    </h4>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedSubredditData?.subreddit ? (
                      (() => {
                        const insight = getInsights(selectedSubredditData.subreddit)?.insight;
                        if (!insight) {
                          return <ul><li>No specific insights available for this subreddit.</li></ul>;
                        }
                        // Split by period followed by space or end of string, filter out empty
                        const points = insight.split(/\.( |$)/).map(s => s.trim()).filter(Boolean);
                        return <ul className="list-disc pl-5 space-y-1">{points.map((point, idx) => <li key={idx}>{point}.</li>)}</ul>;
                      })()
                    ) : (
                      <ul><li>Select a subreddit to view insights.</li></ul>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Recommended Actions
                    </h4>
                    <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      {selectedSubredditData?.subreddit ? (
                      (() => {
                        const nextStep = getInsights(selectedSubredditData.subreddit)?.nextStep;
                        if (!nextStep) {
                          return <ul><li>Continue monitoring current performance and trends.</li></ul>;
                        }
                        const points = nextStep.split(/\.( |$)/).map(s => s.trim()).filter(Boolean);
                        return <ul className="list-disc pl-5 space-y-1">{points.map((point, idx) => <li key={idx}>{point}.</li>)}</ul>;
                      })()
                    ) : (
                      <ul><li>Select a subreddit to view recommendations.</li></ul>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Status:</span>
                      <Badge variant={getStatusBadgeVariant(getStatusFromComposite(Number(selectedSubredditData?.CHS_composite) || 0))} className="text-xs">
                        {getStatusFromComposite(Number(selectedSubredditData?.CHS_composite) || 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">CHS Composite:</span>
                      <span className="font-semibold">{selectedSubredditData?.CHS_composite ?? "N/A"}/1000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Health Grade:</span>
                      <span className="font-semibold">{selectedSubredditData?.Health_Grade}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  )
}
