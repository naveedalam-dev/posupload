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
import { useToast } from "@/components/ui/use-toast"

// Sample vendor data
const vendors = [
  {
    id: "1",
    name: "Tech Supplies Inc.",
    contact: "John Smith",
    email: "john@techsupplies.com",
    phone: "555-123-4567",
    status: "Active",
    products: 12,
  },
  {
    id: "2",
    name: "Kitchen Essentials",
    contact: "Sarah Johnson",
    email: "sarah@kitchenessentials.com",
    phone: "555-987-6543",
    status: "Active",
    products: 8,
  },
  {
    id: "3",
    name: "Fashion Forward",
    contact: "Michael Brown",
    email: "michael@fashionforward.com",
    phone: "555-456-7890",
    status: "Inactive",
    products: 15,
  },
  {
    id: "4",
    name: "Office Solutions",
    contact: "Emily Davis",
    email: "emily@officesolutions.com",
    phone: "555-789-0123",
    status: "Active",
    products: 6,
  },
  {
    id: "5",
    name: "Global Electronics",
    contact: "David Wilson",
    email: "david@globalelectronics.com",
    phone: "555-234-5678",
    status: "Active",
    products: 20,
  },
]

export function VendorList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Directory</CardTitle>
        <CardDescription>Manage your suppliers and vendor relationships.</CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
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
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contact}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.products}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status}</Badge>
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
                        <DropdownMenuItem>View Products</DropdownMenuItem>
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
          Showing {filteredVendors.length} of {vendors.length} vendors
        </div>
      </CardFooter>
    </Card>
  )
}

