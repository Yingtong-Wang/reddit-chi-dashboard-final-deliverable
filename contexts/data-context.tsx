"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WeekData } from '@/components/week-selector'
import week1Data from '@/data/combined.json'
import week2Data from '@/data/combined-week2.json'
import week3Data from '@/data/week-3.json'
import insightsData from '@/data/insights.json'

interface DataItem {
  subreddit: string
  CHS_qual: string | null
  Normalized_Sentiment: string | null
  Normalized_Civility: string | null
  Normalized_Empathy: string | null
  Normalized_Helpfulness: string | null
  Normalized_Relevance: string | null
  CHS_quan: string | null
  Subscribers: string | null
  Posts: string | null
  Members_Factor: string | null
  Content_Factor: string | null
  Traffic_Factor: string | null
  Responsiveness: string | null
  Interaction: string | null
  Health_Grade: string | null
  CHS_composite: number | null
}

interface DataContextType {
  currentData: DataItem[]
  selectedWeek: string
  setSelectedWeek: (weekId: string) => void
  weeks: WeekData[]
  isLoading: boolean
  getInsights: (subreddit: string) => { insight: string; nextStep: string } | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Data for different weeks
const weekDataMap: Record<string, DataItem[]> = {
  'week-1': week1Data,
  'week-2': week2Data,
  'week-3': week3Data
}

const weeks: WeekData[] = [
  {
    id: 'week-1',
    label: 'Week 1',
    date: 'Jul 15-21, 2024',
    isCurrent: false
  },
  {
    id: 'week-2',
    label: 'Week 2',
    date: 'Jul 22-28, 2024',
    isCurrent: true
  },
  {
    id: 'week-3',
    label: 'Week 3',
    date: 'Jul 29-Aug 4, 2024',
    isCurrent: false
  }
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [selectedWeek, setSelectedWeek] = useState<string>('week-2') // Default to current week
  const [currentData, setCurrentData] = useState<DataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  console.log('DataProvider: Initializing with week', selectedWeek)
  console.log('DataProvider: Available weeks:', Object.keys(weekDataMap))

  useEffect(() => {
    console.log('DataProvider: useEffect triggered for week', selectedWeek)
    setIsLoading(true)
    // Simulate loading delay
    const timer = setTimeout(() => {
      const weekData = weekDataMap[selectedWeek] || []
      console.log('DataContext: Loading week', selectedWeek, 'with', weekData.length, 'items')
      console.log('DataContext: Week data is array?', Array.isArray(weekData))
      console.log('DataContext: Week data type:', typeof weekData)
      console.log('DataContext: Week data sample:', weekData[0])
      // Ensure we always have an array
      const safeData = Array.isArray(weekData) ? weekData : []
      console.log('DataContext: Setting safe data with length:', safeData.length)
      setCurrentData(safeData)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedWeek])

  const getInsights = (subreddit: string) => {
    const weekInsights = insightsData[selectedWeek as keyof typeof insightsData]
    if (weekInsights && weekInsights[subreddit]) {
      return weekInsights[subreddit]
    }
    return null
  }

  const value: DataContextType = {
    currentData,
    selectedWeek,
    setSelectedWeek,
    weeks,
    isLoading,
    getInsights
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
} 