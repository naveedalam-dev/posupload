"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { CartItemType } from "@/types/cart"

// Define return type
export interface Return {
  id: string
  orderId: string
  customer: string
  date: string
  items: CartItemType[]
  amount: number
  reason: string
  status: "Pending" | "Processing" | "Completed" | "Rejected"
  createdAt: string
  updatedAt: string
}

// Define return reasons
export const RETURN_REASONS = [
  "Defective product",
  "Wrong product",
  "Expired product",
  "Customer dissatisfaction",
  "Adverse reaction",
  "Other",
]

// Sample initial returns
const INITIAL_RETURNS: Return[] = [
  {
    id: "RET-001",
    orderId: "ORD-001",
    customer: "John Smith",
    date: new Date().toISOString(),
    items: [{ id: "1", name: "Paracetamol 500mg", price: 5.99, quantity: 1 }],
    amount: 5.99,
    reason: "Expired product",
    status: "Completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "RET-002",
    orderId: "ORD-002",
    customer: "Sarah Johnson",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    items: [{ id: "2", name: "Amoxicillin 250mg", price: 12.99, quantity: 1 }],
    amount: 12.99,
    reason: "Wrong product",
    status: "Processing",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

// Define context type
interface ReturnContextType {
  returns: Return[]
  addReturn: (returnItem: Omit<Return, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateReturn: (returnItem: Return) => Promise<boolean>
  deleteReturn: (returnId: string) => Promise<boolean>
  getReturn: (returnId: string) => Return | undefined
  getReasons: () => string[]
}

// Create the context
const ReturnContext = createContext<ReturnContextType | undefined>(undefined)

// Provider props
interface ReturnProviderProps {
  children: ReactNode
}

// Create the provider component
export function ReturnProvider({ children }: ReturnProviderProps) {
  const [returns, setReturns] = useState<Return[]>([])
  const { toast } = useToast()

  // Initialize returns
  useEffect(() => {
    // Load returns from localStorage or use initial returns
    try {
      const storedReturns = localStorage.getItem("pos_returns")
      if (storedReturns) {
        setReturns(JSON.parse(storedReturns))
      } else {
        setReturns(INITIAL_RETURNS)
        localStorage.setItem("pos_returns", JSON.stringify(INITIAL_RETURNS))
      }
    } catch (error) {
      console.error("Failed to load returns from localStorage:", error)
      setReturns(INITIAL_RETURNS)
      localStorage.setItem("pos_returns", JSON.stringify(INITIAL_RETURNS))
    }
  }, [])

  // Add return function
  const addReturn = async (newReturn: Omit<Return, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      // Create return with ID and timestamps
      const returnToAdd: Return = {
        ...newReturn,
        id: `RET-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add return to state
      const updatedReturns = [returnToAdd, ...returns]
      setReturns(updatedReturns)

      // Save to localStorage
      localStorage.setItem("pos_returns", JSON.stringify(updatedReturns))

      toast({
        title: "Return processed",
        description: `Return #${returnToAdd.id} has been processed successfully`,
      })

      return true
    } catch (error) {
      console.error("Error adding return:", error)
      toast({
        title: "Error",
        description: "Failed to process return. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Update return function
  const updateReturn = async (updatedReturn: Return): Promise<boolean> => {
    try {
      // Find return index
      const returnIndex = returns.findIndex((r) => r.id === updatedReturn.id)

      if (returnIndex === -1) {
        toast({
          title: "Error",
          description: "Return not found",
          variant: "destructive",
        })
        return false
      }

      // Update return with new timestamp
      const returnToUpdate = {
        ...updatedReturn,
        updatedAt: new Date().toISOString(),
      }

      // Update return in state
      const updatedReturns = [...returns]
      updatedReturns[returnIndex] = returnToUpdate
      setReturns(updatedReturns)

      // Save to localStorage
      localStorage.setItem("pos_returns", JSON.stringify(updatedReturns))

      toast({
        title: "Return updated",
        description: `Return #${returnToUpdate.id} has been updated successfully`,
      })

      return true
    } catch (error) {
      console.error("Error updating return:", error)
      toast({
        title: "Error",
        description: "Failed to update return. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete return function
  const deleteReturn = async (returnId: string): Promise<boolean> => {
    try {
      // Find return
      const returnToDelete = returns.find((r) => r.id === returnId)

      if (!returnToDelete) {
        toast({
          title: "Error",
          description: "Return not found",
          variant: "destructive",
        })
        return false
      }

      // Remove return from state
      const updatedReturns = returns.filter((r) => r.id !== returnId)
      setReturns(updatedReturns)

      // Save to localStorage
      localStorage.setItem("pos_returns", JSON.stringify(updatedReturns))

      toast({
        title: "Return deleted",
        description: `Return #${returnId} has been deleted successfully`,
      })

      return true
    } catch (error) {
      console.error("Error deleting return:", error)
      toast({
        title: "Error",
        description: "Failed to delete return. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Get return by ID
  const getReturn = (returnId: string) => {
    return returns.find((r) => r.id === returnId)
  }

  // Get all reasons
  const getReasons = () => {
    return RETURN_REASONS
  }

  const value = {
    returns,
    addReturn,
    updateReturn,
    deleteReturn,
    getReturn,
    getReasons,
  }

  return <ReturnContext.Provider value={value}>{children}</ReturnContext.Provider>
}

// Custom hook to use the return context
export function useReturns() {
  const context = useContext(ReturnContext)
  if (context === undefined) {
    throw new Error("useReturns must be used within a ReturnProvider")
  }
  return context
}

