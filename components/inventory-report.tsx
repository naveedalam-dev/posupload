"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Sample inventory data
const inventoryData = [
  { id: "1", name: "pandol", stock: 15, reorderLevel: 5, status: "In Stock", value: 19499.85 },
  { id: "2", name: "Wireless Headphones", stock: 42, reorderLevel: 10, status: "In Stock", value: 6299.58 },
  { id: "3", name: "Coffee Maker", stock: 3, reorderLevel: 5, status: "Low Stock", value: 269.97 },
  { id: "4", name: "Running Shoes", stock: 31, reorderLevel: 8, status: "In Stock", value: 2479.69 },
  { id: "5", name: "Smartphone X", stock: 8, reorderLevel: 5, status: "In Stock", value: 7199.92 },
  { id: "6", name: "Blender", stock: 2, reorderLevel: 5, status: "Low Stock", value: 99.98 },
  { id: "7", name: "T-Shirt", stock: 65, reorderLevel: 15, status: "In Stock", value: 1299.35 },
  { id: "8", name: "Desk Lamp", stock: 0, reorderLevel: 5, status: "Out of Stock", value: 0 },
]

// Chart data
const chartData = inventoryData.map((item) => ({
  name: item.name,
  stock: item.stock,
  reorderLevel: item.reorderLevel,
}))

export function InventoryReport() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default"
      case "Low Stock":
        return "warning"
      case "Out of Stock":
        return "destructive"
      default:
        return "default"
    }
  }

  const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0)
  const lowStockItems = inventoryData.filter((item) => item.status === "Low Stock").length
  const outOfStockItems = inventoryData.filter((item) => item.status === "Out of Stock").length

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs{totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels</CardTitle>
          <CardDescription>Current stock levels vs. reorder points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reorderLevel" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
          <CardDescription>Detailed breakdown of inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>Rs{item.value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

