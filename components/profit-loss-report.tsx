"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from "react"

// Sample P&L data
const plData = [
  {
    month: "January",
    revenue: 45000,
    cogs: 18000,
    expenses: 12000,
    profit: 15000,
  },
  {
    month: "February",
    revenue: 48000,
    cogs: 19200,
    expenses: 12500,
    profit: 16300,
  },
  {
    month: "March",
    revenue: 52000,
    cogs: 20800,
    expenses: 13000,
    profit: 18200,
  },
  {
    month: "April",
    revenue: 49000,
    cogs: 19600,
    expenses: 12800,
    profit: 16600,
  },
  {
    month: "May",
    revenue: 53000,
    cogs: 21200,
    expenses: 13200,
    profit: 18600,
  },
  {
    month: "June",
    revenue: 55000,
    cogs: 22000,
    expenses: 13500,
    profit: 19500,
  },
]

// Chart data
const chartData = plData.map((item) => ({
  name: item.month,
  revenue: item.revenue,
  profit: item.profit,
}))

export function ProfitLossReport() {
  const [period, setPeriod] = useState("monthly")

  // Calculate totals
  const totalRevenue = plData.reduce((sum, item) => sum + item.revenue, 0)
  const totalCOGS = plData.reduce((sum, item) => sum + item.cogs, 0)
  const totalExpenses = plData.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = plData.reduce((sum, item) => sum + item.profit, 0)
  const profitMargin = (totalProfit / totalRevenue) * 100

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total COGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCOGS.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Trends</CardTitle>
          <CardDescription>Monthly revenue and profit performance</CardDescription>
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
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--secondary))"
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
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>Detailed monthly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>COGS</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plData.map((item) => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell>${item.revenue.toLocaleString()}</TableCell>
                  <TableCell>${item.cogs.toLocaleString()}</TableCell>
                  <TableCell>${item.expenses.toLocaleString()}</TableCell>
                  <TableCell>${item.profit.toLocaleString()}</TableCell>
                  <TableCell>{((item.profit / item.revenue) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

