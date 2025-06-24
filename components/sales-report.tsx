"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample sales data
const salesData = [
  { date: "2023-03-01", sales: 1234.56, orders: 12, avgOrderValue: 102.88 },
  { date: "2023-03-02", sales: 2345.67, orders: 18, avgOrderValue: 130.32 },
  { date: "2023-03-03", sales: 1876.54, orders: 15, avgOrderValue: 125.1 },
  { date: "2023-03-04", sales: 2987.65, orders: 22, avgOrderValue: 135.8 },
  { date: "2023-03-05", sales: 1765.43, orders: 14, avgOrderValue: 126.1 },
  { date: "2023-03-06", sales: 2543.21, orders: 19, avgOrderValue: 133.85 },
  { date: "2023-03-07", sales: 3210.98, orders: 24, avgOrderValue: 133.79 },
  { date: "2023-03-08", sales: 2109.87, orders: 17, avgOrderValue: 124.11 },
  { date: "2023-03-09", sales: 1987.65, orders: 16, avgOrderValue: 124.23 },
  { date: "2023-03-10", sales: 2765.43, orders: 21, avgOrderValue: 131.69 },
  { date: "2023-03-11", sales: 1876.54, orders: 15, avgOrderValue: 125.1 },
  { date: "2023-03-12", sales: 2345.67, orders: 18, avgOrderValue: 130.32 },
  { date: "2023-03-13", sales: 2987.65, orders: 22, avgOrderValue: 135.8 },
  { date: "2023-03-14", sales: 3210.98, orders: 24, avgOrderValue: 133.79 },
]

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Chart data
const chartData = salesData.map((item) => ({
  name: formatDate(item.date),
  sales: item.sales,
}))

export function SalesReport() {
  const [period, setPeriod] = useState("weekly")

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange className="w-auto" />
        </div>

        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>View your sales performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Details</CardTitle>
          <CardDescription>Detailed breakdown of sales by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Avg. Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item) => (
                <TableRow key={item.date}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>${item.sales.toFixed(2)}</TableCell>
                  <TableCell>{item.orders}</TableCell>
                  <TableCell>${item.avgOrderValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

