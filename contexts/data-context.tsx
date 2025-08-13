"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WeekData } from '@/components/week-selector'

// Import data with better error handling
let week1Data: any[] = []
let week2Data: any[] = []
let week3Data: any[] = []
let insightsData: any = {}

try {
  week1Data = require('@/data/combined.json')
  console.log('Successfully loaded week1Data:', Array.isArray(week1Data), week1Data?.length)
} catch (error) {
  console.error('Failed to load week1Data:', error)
  week1Data = []
}

try {
  week2Data = require('@/data/combined-week2.json')
  console.log('Successfully loaded week2Data:', Array.isArray(week2Data), week2Data?.length)
} catch (error) {
  console.error('Failed to load week2Data:', error)
  week2Data = []
}

try {
  week3Data = require('@/data/week-3.json')
  console.log('Successfully loaded week3Data:', Array.isArray(week3Data), week3Data?.length)
} catch (error) {
  console.error('Failed to load week3Data:', error)
  week3Data = []
}

try {
  insightsData = require('@/data/insights.json')
  console.log('Successfully loaded insightsData:', typeof insightsData, Object.keys(insightsData))
} catch (error) {
  console.error('Failed to load insightsData:', error)
  insightsData = {}
}

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
  Total_Posts?: string | null
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

// Data for different weeks - with better error handling
const weekDataMap: Record<string, DataItem[]> = {
  'week-1': Array.isArray(week1Data) ? week1Data : [],
  'week-2': Array.isArray(week2Data) ? week2Data : [],
  'week-3': Array.isArray(week3Data) ? week3Data : []
}

console.log('DataContext: Week data map initialized:', {
  'week-1': weekDataMap['week-1']?.length || 0,
  'week-2': weekDataMap['week-2']?.length || 0,
  'week-3': weekDataMap['week-3']?.length || 0
})

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
  console.log('DataProvider: Week data lengths:', {
    'week-1': weekDataMap['week-1']?.length || 'undefined',
    'week-2': weekDataMap['week-2']?.length || 'undefined',
    'week-3': weekDataMap['week-3']?.length || 'undefined'
  })

  useEffect(() => {
    console.log('DataProvider: useEffect triggered for week', selectedWeek)
    setIsLoading(true)
    
    try {
      const weekData = weekDataMap[selectedWeek] || []
      console.log('DataContext: Loading week', selectedWeek, 'with', weekData.length, 'items')
      console.log('DataContext: Week data is array?', Array.isArray(weekData))
      console.log('DataContext: Week data type:', typeof weekData)
      console.log('DataContext: Week data sample:', weekData[0])
      
      // Ensure we always have an array and filter out invalid items
      const safeData = Array.isArray(weekData) 
        ? weekData.filter(item => item && item.subreddit && item.CHS_composite !== null && item.CHS_composite !== undefined)
        : []
      
      console.log('DataContext: Setting safe data with length:', safeData.length)
      console.log('DataContext: First safe item sample:', safeData[0])
      
      setCurrentData(safeData)
      setIsLoading(false)
    } catch (error) {
      console.error('DataContext: Error loading data for week', selectedWeek, error)
      setCurrentData([])
      setIsLoading(false)
    }
  }, [selectedWeek])

  const getInsights = (subreddit: string) => {
    try {
      const weekInsights = insightsData[selectedWeek as keyof typeof insightsData]
      if (weekInsights && weekInsights[subreddit]) {
        return weekInsights[subreddit]
      }
      // Fallback to any available insights
      for (const weekKey in insightsData) {
        const weekData = insightsData[weekKey as keyof typeof insightsData]
        if (weekData && weekData[subreddit]) {
          return weekData[subreddit]
        }
      }
      return null
    } catch (error) {
      console.error('Error getting insights:', error)
      return null
    }
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