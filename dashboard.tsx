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

// Import the latest merged CHI data with updated CSV files
import combinedData from "./data/combined.json"

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
  if (score >= 800) return "Exemplary";
  if (score >= 600) return "Healthy";
  if (score >= 400) return "Developing";
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
    if (score <= 399) {
      // At-Risk: 0-399 (0-40%)
      return (score / 399) * 40;
    } else if (score <= 599) {
      // Developing: 400-599 (40-60%)
      return 40 + ((score - 400) / 200) * 20;
    } else if (score <= 799) {
      // Healthy: 600-799 (60-80%)
      return 60 + ((score - 600) / 200) * 20;
    } else {
      // Exemplary: 800-1000 (80-100%)
      return 80 + ((score - 800) / 200) * 20;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>400</span>
        <span>600</span>
        <span>800</span>
        <span>1000</span>
      </div>
      <div className="relative h-12 rounded-lg overflow-hidden flex">
        <div className="bg-red-500" style={{ flexBasis: '40%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">At-Risk</div>
        </div>
        <div className="bg-yellow-500" style={{ flexBasis: '20%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">Developing</div>
        </div>
        <div className="bg-green-500" style={{ flexBasis: '20%' }}>
          <div className="flex items-center justify-center h-full text-white text-sm font-medium">Healthy</div>
        </div>
        <div className="bg-purple-500" style={{ flexBasis: '20%' }}>
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

export default function Component() {
  // Filter out subreddits with composite score of 0 for better UX
  const validSubreddits = useMemo(() => {
    return combinedData.filter((item) => item.CHS_composite !== null && Number(item.CHS_composite) > 0)
  }, [])

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

  const currentData = useMemo(() => {
    return combinedData.find((item) => item.subreddit === selectedSubreddit)
  }, [selectedSubreddit])

  // Prepare radar chart data for current subreddit
  const radarData = useMemo(() => {
    if (!currentData) return [];
    return [
      {
        metric: "Sentiment",
        value: Number(currentData.Normalized_Sentiment) || 0,
        fullMark: 1000,
      },
      {
        metric: "Civility",
        value: Number(currentData.Normalized_Civility) || 0,
        fullMark: 1000,
      },
      {
        metric: "Empathy",
        value: Number(currentData.Normalized_Empathy) || 0,
        fullMark: 1000,
      },
      {
        metric: "Helpfulness",
        value: Number(currentData.Normalized_Helpfulness) || 0,
        fullMark: 1000,
      },
      {
        metric: "Relevance",
        value: Number(currentData.Normalized_Relevance) || 0,
        fullMark: 1000,
      },
    ];
  }, [currentData]);

  // Prepare trend line data (simulated historical data for demonstration)
  const trendData = useMemo(() => {
    if (!currentData) return [];
    const baseScore = Number(currentData.CHS_qual) || 0;
    return [
      { month: "Jan", score: Math.max(0, baseScore - 50 + Math.random() * 20) },
      { month: "Feb", score: Math.max(0, baseScore - 40 + Math.random() * 20) },
      { month: "Mar", score: Math.max(0, baseScore - 30 + Math.random() * 20) },
      { month: "Apr", score: Math.max(0, baseScore - 20 + Math.random() * 20) },
      { month: "May", score: Math.max(0, baseScore - 10 + Math.random() * 20) },
      { month: "Jun", score: baseScore },
    ];
  }, [currentData]);

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

  const status = getStatusFromComposite(Number(currentData?.CHS_composite) || 0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between w-full max-w-7xl px-12 py-4 mx-auto mb-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-lg text-gray-800">Reddit CHI Dashboard</span>
          </div>
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
      {/* Visual divider between header and main content */}
      <div className="w-full border-t-2 border-muted-foreground/30 my-2" />

      {/* Main Content */}
      <nav className="sticky top-16 z-50 bg-white border-b py-2 px-6 flex gap-6 text-sm font-medium">
        <a href="#health-overview" className="hover:underline">Health</a>
        <a href="#community-drilldown" className="hover:underline">Drilldown</a>
        <a href="#quant-performance" className="hover:underline">KPIs</a>
        <a href="#community-stats" className="hover:underline">Stats</a>
        <a href="#compare-communities" className="hover:underline">Compare</a>
        <a href="#comparison-table" className="hover:underline">All Data</a>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-8">
        {/* Overview Section */}
        <section id="health-overview" className="space-y-4 py-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Overview</h2>
          <div className="w-full max-w-5xl mx-auto space-y-2">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Health Overview</h1>
              <p className="text-base text-muted-foreground">
                {getDisplayName(currentData.subreddit)} • {status} status • Grade: {currentData.Health_Grade}
              </p>
            </div>
            <div className="flex flex-row items-start justify-center gap-4 w-full">
              <Card className="w-[700px] flex-1 py-2 px-6 flex flex-col justify-center rounded-xl shadow-md bg-white">
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
                        style={{ left: `${Math.min(Math.max((Number(currentData.CHS_composite) / 1000) * 100, 0), 100)}%` }}
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
                    <div className="text-4xl font-bold text-gray-900">{currentData.CHS_composite}</div>
                    <div className="text-base font-medium text-gray-600 mt-1">Current CHS Composite Score</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-[250px] flex flex-col justify-center items-center py-2 px-4 rounded-xl shadow-md bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant={getStatusBadgeVariant(status)} className="text-lg px-4 py-2">
                    {status}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Drilldown Section */}
        <section id="community-drilldown" className="space-y-4 py-6 bg-gray-50 rounded-xl mt-8 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Drilldown</h2>
          <div className="w-full max-w-6xl mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Community Drilldown</h1>
              <p className="text-xl text-muted-foreground">
                Detailed metrics for {getDisplayName(currentData.subreddit)}
              </p>
            </div>

            {/* Radar Chart and Component Breakdown */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
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
                  <CardDescription>6-month composite score progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-11/12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
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

            {/* Quantitative Metrics */}
            <section id="quant-performance" className="space-y-4 py-6 mt-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quantitative Performance Metrics</h2>
              <Card className="max-w-7xl mx-auto w-full rounded-xl shadow-md bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quantitative Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators from quantitative analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        name: "Responsiveness",
                        value: Math.round(currentData.Responsiveness * 100),
                        unit: "%",
                        icon: MessageSquare,
                      },
                      { name: "Interaction", value: Math.round(currentData.Interaction * 100), unit: "%", icon: Users },
                      {
                        name: "Content Factor",
                        value: Math.round(currentData.Content_Factor * 100),
                        unit: "%",
                        icon: Eye,
                      },
                      {
                        name: "Traffic Factor",
                        value: Math.round(currentData.Traffic_Factor * 100),
                        unit: "%",
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
                            <Progress value={metric.value} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {metric.value >= 80
                                ? "Excellent"
                                : metric.value >= 60
                                  ? "Good"
                                  : metric.value >= 40
                                    ? "Fair"
                                    : "Poor"}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Community Stats */}
            <section id="community-stats" className="space-y-4 py-6 bg-gray-50 rounded-xl mt-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Statistics</h2>
              <Card className="max-w-6xl mx-auto rounded-xl shadow-md bg-white">
                <CardHeader className="text-center">
                  <CardTitle>Community Statistics</CardTitle>
                  <CardDescription>Basic community metrics and demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {currentData?.Subscribers ? Number(currentData.Subscribers).toLocaleString() : "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {currentData?.Posts ? Number(currentData.Posts).toLocaleString() : "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{currentData.Health_Grade}</div>
                      <p className="text-sm text-muted-foreground">Health Grade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>

        {/* Compare All Section */}
        <section id="compare-communities" className="space-y-4 py-6 mt-8 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare All Communities</h2>
          <div className="container space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Compare All Communities</h1>
              <p className="text-xl text-muted-foreground">Comprehensive comparison across all subreddits</p>
            </div>

            {/* Bar Chart and Actionable Insights */}
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
              {/* Bar Chart - Left Side */}
              <Card className="flex-1 lg:w-1/2 rounded-xl shadow-md bg-white">
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

              {/* Actionable Insights - Right Side */}
              <Card className="flex-1 lg:w-1/2 rounded-xl shadow-md bg-white">
                <CardHeader>
                  <CardTitle>Actionable Insights</CardTitle>
                  <CardDescription>Improvement suggestions for {getDisplayName(currentData.subreddit)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Recommended Actions
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>Improve responsiveness to user posts and comments to increase engagement scores.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>Increase post frequency and encourage community-driven content creation.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>Encourage participation through AMAs, polls, and interactive community events.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>Implement better moderation practices to maintain civility and helpfulness.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>Create weekly discussion threads to boost regular community interaction.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Status:</span>
                      <Badge variant={getStatusBadgeVariant(getStatusFromComposite(Number(currentData?.CHS_composite) || 0))} className="text-xs">
                        {getStatusFromComposite(Number(currentData?.CHS_composite) || 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">CHS Composite:</span>
                      <span className="font-semibold">{currentData?.CHS_composite ?? "N/A"}/1000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Health Grade:</span>
                      <span className="font-semibold">{currentData.Health_Grade}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <section id="comparison-table" className="space-y-4 py-6 bg-gray-50 rounded-xl mt-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">All Communities Comparison</h2>
              <Card className="max-w-6xl mx-auto rounded-xl shadow-md bg-white">
                <CardHeader>
                  <CardTitle>All Communities Comparison</CardTitle>
                  <CardDescription>Complete overview of all subreddits in the dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subreddit</TableHead>
                          <TableHead>CHS Qual</TableHead>
                          <TableHead>Sentiment</TableHead>
                          <TableHead>CHI Score</TableHead>
                          <TableHead>Subscribers</TableHead>
                          <TableHead>Posts</TableHead>
                          <TableHead>Health Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {combinedData.map((item, idx) => (
                          <TableRow key={item.subreddit || idx}>
                            <TableCell>{item.subreddit}</TableCell>
                            <TableCell>{item.CHS_qual ?? "N/A"}</TableCell>
                            <TableCell>{item.Normalized_Sentiment ?? "N/A"}</TableCell>
                            <TableCell>{item.CHI_Score ?? "N/A"}</TableCell>
                            <TableCell>{item.Subscribers ?? "N/A"}</TableCell>
                            <TableCell>{item.Posts ?? "N/A"}</TableCell>
                            <TableCell>{item.Health_Grade ?? "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  )
}
