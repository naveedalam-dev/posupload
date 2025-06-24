"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define vendor type
export interface Vendor {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address?: string
  status: "Active" | "Inactive"
  products: number
  createdAt: string
  updatedAt: string
}

// Sample initial vendors
const INITIAL_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "MediSupply Inc.",
    contact: "John Smith",
    email: "john@medisupply.com",
    phone: "555-123-4567",
    address: "123 Medical Blvd, Pharma City, PC 12345",
    status: "Active",
    products: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "PharmaCare Distribution",
    contact: "Sarah Johnson",
    email: "sarah@pharmacare.com",
    phone: "555-987-6543",
    address: "456 Health St, Medicine Town, MT 67890",
    status: "Active",
    products: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Global Pharmaceuticals",
    contact: "Michael Brown",
    email: "michael@globalpharm.com",
    phone: "555-456-7890",
    address: "789 Remedy Road, Wellness City, WC 54321",
    status: "Inactive",
    products: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Define context type
interface VendorContextType {
  vendors: Vendor[]
  addVendor: (vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateVendor: (vendor: Vendor) => Promise<boolean>
  deleteVendor: (vendorId: string) => Promise<boolean>
  getVendor: (vendorId: string) => Vendor | undefined
}

// Create the context
const VendorContext = createContext<VendorContextType | undefined>(undefined)

// Provider props
interface VendorProviderProps {
  children: ReactNode
}

// Create the provider component
export function VendorProvider({ children }: VendorProviderProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const { toast } = useToast()

  // Initialize vendors
  useEffect(() => {
    // Load vendors from localStorage or use initial vendors
    const storedVendors = localStorage.getItem("pos_vendors")
    if (storedVendors) {
      try {
        setVendors(JSON.parse(storedVendors))
      } catch (error) {
        console.error("Failed to parse stored vendors:", error)
        setVendors(INITIAL_VENDORS)
        localStorage.setItem("pos_vendors", JSON.stringify(INITIAL_VENDORS))
      }
    } else {
      setVendors(INITIAL_VENDORS)
      localStorage.setItem("pos_vendors", JSON.stringify(INITIAL_VENDORS))
    }
  }, [])

  // Add vendor function
  const addVendor = async (newVendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    // Check if email already exists
    if (vendors.some((v) => v.email === newVendor.email)) {
      toast({
        title: "Error",
        description: "A vendor with this email already exists",
        variant: "destructive",
      })
      return false
    }

    // Create vendor with ID and timestamps
    const vendorToAdd: Vendor = {
      ...newVendor,
      id: `vendor-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add vendor to state and localStorage
    const updatedVendors = [...vendors, vendorToAdd]
    setVendors(updatedVendors)
    localStorage.setItem("pos_vendors", JSON.stringify(updatedVendors))

    toast({
      title: "Vendor added",
      description: `${vendorToAdd.name} has been added successfully`,
    })

    return true
  }

  // Update vendor function
  const updateVendor = async (updatedVendor: Vendor): Promise<boolean> => {
    // Find vendor index
    const vendorIndex = vendors.findIndex((v) => v.id === updatedVendor.id)

    if (vendorIndex === -1) {
      toast({
        title: "Error",
        description: "Vendor not found",
        variant: "destructive",
      })
      return false
    }

    // Check if email already exists on another vendor
    if (vendors.some((v) => v.email === updatedVendor.email && v.id !== updatedVendor.id)) {
      toast({
        title: "Error",
        description: "Another vendor with this email already exists",
        variant: "destructive",
      })
      return false
    }

    // Update vendor with new timestamp
    const vendorToUpdate = {
      ...updatedVendor,
      updatedAt: new Date().toISOString(),
    }

    // Update vendor in state and localStorage
    const updatedVendors = [...vendors]
    updatedVendors[vendorIndex] = vendorToUpdate
    setVendors(updatedVendors)
    localStorage.setItem("pos_vendors", JSON.stringify(updatedVendors))

    toast({
      title: "Vendor updated",
      description: `${vendorToUpdate.name} has been updated successfully`,
    })

    return true
  }

  // Delete vendor function
  const deleteVendor = async (vendorId: string): Promise<boolean> => {
    // Find vendor
    const vendorToDelete = vendors.find((v) => v.id === vendorId)

    if (!vendorToDelete) {
      toast({
        title: "Error",
        description: "Vendor not found",
        variant: "destructive",
      })
      return false
    }

    // Remove vendor from state and localStorage
    const updatedVendors = vendors.filter((v) => v.id !== vendorId)
    setVendors(updatedVendors)
    localStorage.setItem("pos_vendors", JSON.stringify(updatedVendors))

    toast({
      title: "Vendor deleted",
      description: `${vendorToDelete.name} has been deleted successfully`,
    })

    return true
  }

  // Get vendor by ID
  const getVendor = (vendorId: string) => {
    return vendors.find((v) => v.id === vendorId)
  }

  const value = {
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    getVendor,
  }

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
}

// Custom hook to use the vendor context
export function useVendors() {
  const context = useContext(VendorContext)
  if (context === undefined) {
    throw new Error("useVendors must be used within a VendorProvider")
  }
  return context
}

