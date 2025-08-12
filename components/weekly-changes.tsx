"use client"

import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"

interface WeeklyChange {
  subreddit: string
  CHS_qual_change: number
  CHI_Score_change: number
  Subscribers_change: number
  current_CHS_qual: string
  current_CHI_Score: string
  current_Subscribers: string
  current_Health_Grade: string
}

interface WeeklyComparison {
  total_subreddits: number
  biggest_improvements: {
    CHS_qual: WeeklyChange[]
    CHI_Score: WeeklyChange[]
    Subscribers: WeeklyChange[]
  }
  biggest_declines: {
    CHS_qual: WeeklyChange[]
    CHI_Score: WeeklyChange[]
    Subscribers: WeeklyChange[]
  }
  all_changes: WeeklyChange[]
}

export function WeeklyChanges() {
  const [comparisonData, setComparisonData] = useState<WeeklyComparison | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    // For now, we'll simulate the data
    const mockComparisonData: WeeklyComparison = {
      total_subreddits: 16,
      biggest_improvements: {
        CHS_qual: [
          {
            subreddit: "Parenting",
            CHS_qual_change: 7,
            CHI_Score_change: 5,
            Subscribers_change: 40000,
            current_CHS_qual: "792",
            current_CHI_Score: "714.92",
            current_Subscribers: "8200000",
            current_Health_Grade: "B"
          },
          {
            subreddit: "personalfinance",
            CHS_qual_change: 5,
            CHI_Score_change: 5,
            Subscribers_change: 140000,
            current_CHS_qual: "640",
            current_CHI_Score: "721.66",
            current_Subscribers: "21400000",
            current_Health_Grade: "B"
          },
          {
            subreddit: "TwoXChromosomes",
            CHS_qual_change: 3,
            CHI_Score_change: 5,
            Subscribers_change: 75000,
            current_CHS_qual: "598",
            current_CHI_Score: "734.16",
            current_Subscribers: "13700000",
            current_Health_Grade: "B"
          }
        ],
        CHI_Score: [
          {
            subreddit: "Seattle",
            CHS_qual_change: 6.5,
            CHI_Score_change: 5,
            Subscribers_change: 4400,
            current_CHS_qual: "348.5",
            current_CHI_Score: "720.88",
            current_Subscribers: "730000",
            current_Health_Grade: "B"
          },
          {
            subreddit: "TwoXChromosomes",
            CHS_qual_change: 3,
            CHI_Score_change: 5,
            Subscribers_change: 75000,
            current_CHS_qual: "598",
            current_CHI_Score: "734.16",
            current_Subscribers: "13700000",
            current_Health_Grade: "B"
          }
        ],
        Subscribers: [
          {
            subreddit: "personalfinance",
            CHS_qual_change: 5,
            CHI_Score_change: 5,
            Subscribers_change: 140000,
            current_CHS_qual: "640",
            current_CHI_Score: "721.66",
            current_Subscribers: "21400000",
            current_Health_Grade: "B"
          },
          {
            subreddit: "TwoXChromosomes",
            CHS_qual_change: 3,
            CHI_Score_change: 5,
            Subscribers_change: 75000,
            current_CHS_qual: "598",
            current_CHI_Score: "734.16",
            current_Subscribers: "13700000",
            current_Health_Grade: "B"
          }
        ]
      },
      biggest_declines: {
        CHS_qual: [
          {
            subreddit: "Seattle",
            CHS_qual_change: -6.5,
            CHI_Score_change: 5,
            Subscribers_change: 4400,
            current_CHS_qual: "348.5",
            current_CHI_Score: "720.88",
            current_Subscribers: "730000",
            current_Health_Grade: "B"
          },
          {
            subreddit: "consulting",
            CHS_qual_change: -7,
            CHI_Score_change: 5,
            Subscribers_change: 2600,
            current_CHS_qual: "372",
            current_CHI_Score: "670.22",
            current_Subscribers: "328000",
            current_Health_Grade: "B"
          }
        ],
        CHI_Score: [],
        Subscribers: []
      },
      all_changes: []
    }

    setComparisonData(mockComparisonData)
    setLoading(false)
  }, [])

  const formatChange = (change: number, isPercentage = false) => {
    if (change === 0) return <Minus className="h-4 w-4 text-gray-400" />
    
    const isPositive = change > 0
    const formattedValue = isPercentage 
      ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
      : change > 0 
        ? `+${change.toLocaleString()}`
        : change.toLocaleString()
    
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {formattedValue}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading weekly changes...</p>
        </div>
      </div>
    )
  }

  if (!comparisonData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No weekly comparison data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Subreddits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisonData.total_subreddits}</div>
            <p className="text-xs text-muted-foreground">Analyzed this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {comparisonData.biggest_improvements.CHS_qual.length}
            </div>
            <p className="text-xs text-muted-foreground">Subreddits improved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Declines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {comparisonData.biggest_declines.CHS_qual.length}
            </div>
            <p className="text-xs text-muted-foreground">Subreddits declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top Improvements
          </CardTitle>
          <CardDescription>
            Subreddits with the biggest improvements in CHS Qualitative Score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subreddit</TableHead>
                <TableHead>CHS Qual Change</TableHead>
                <TableHead>CHI Score Change</TableHead>
                <TableHead>Subscriber Growth</TableHead>
                <TableHead>Current Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.biggest_improvements.CHS_qual.map((change, index) => (
                <TableRow key={change.subreddit}>
                  <TableCell className="font-medium">{change.subreddit}</TableCell>
                  <TableCell>{formatChange(change.CHS_qual_change)}</TableCell>
                  <TableCell>{formatChange(change.CHI_Score_change)}</TableCell>
                  <TableCell>{formatChange(change.Subscribers_change)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{change.current_Health_Grade}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Declines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Top Declines
          </CardTitle>
          <CardDescription>
            Subreddits with the biggest declines in CHS Qualitative Score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subreddit</TableHead>
                <TableHead>CHS Qual Change</TableHead>
                <TableHead>CHI Score Change</TableHead>
                <TableHead>Subscriber Change</TableHead>
                <TableHead>Current Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.biggest_declines.CHS_qual.map((change, index) => (
                <TableRow key={change.subreddit}>
                  <TableCell className="font-medium">{change.subreddit}</TableCell>
                  <TableCell>{formatChange(change.CHS_qual_change)}</TableCell>
                  <TableCell>{formatChange(change.CHI_Score_change)}</TableCell>
                  <TableCell>{formatChange(change.Subscribers_change)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{change.current_Health_Grade}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 