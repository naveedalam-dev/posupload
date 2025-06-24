"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"

// Sample expense data
const expenses = [
  {
    id: "EXP-001",
    date: "2023-03-15",
    category: "Rent",
    amount: 1500.0,
    paymentMethod: "Bank Transfer",
    description: "Monthly office rent",
    status: "Paid",
  },
  {
    id: "EXP-002",
    date: "2023-03-14",
    category: "Utilities",
    amount: 250.75,
    paymentMethod: "Credit Card",
    description: "Electricity bill",
    status: "Paid",
  },
  {
    id: "EXP-003",
    date: "2023-03-10",
    category: "Inventory",
    amount: 3450.0,
    paymentMethod: "Bank Transfer",
    description: "Product stock purchase",
    status: "Paid",
  },
  {
    id: "EXP-004",
    date: "2023-03-08",
    category: "Salaries",
    amount: 5200.0,
    paymentMethod: "Bank Transfer",
    description: "Staff salaries",
    status: "Paid",
  },
  {
    id: "EXP-005",
    date: "2023-03-05",
    category: "Marketing",
    amount: 750.0,
    paymentMethod: "Credit Card",
    description: "Social media advertising",
    status: "Pending",
  },
  {
    id: "EXP-006",
    date: "2023-03-01",
    category: "Equipment",
    amount: 1200.0,
    paymentMethod: "Credit Card",
    description: "New POS terminal",
    status: "Paid",
  },
]

export function ExpenseList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
        <CardDescription>Monitor and manage your business expenses.</CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>Rs{expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={expense.status === "Paid" ? "default" : "secondary"}>{expense.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </div>
        <div className="text-sm font-medium">
          Total: Rs{filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  )
}

