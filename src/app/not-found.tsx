"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Truck, Home, ArrowLeft, Search, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="text-center max-w-lg">
        {/* Animated Truck Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-brand-100 rounded-full animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-xl flex items-center justify-center">
              <Truck className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-brand-600 mb-2">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Load Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like this shipment took a wrong turn. The page you&apos;re looking for 
          doesn&apos;t exist or has been moved to a new destination.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/loads">
              <Search className="w-4 h-4 mr-2" />
              Search Loads
            </Link>
          </Button>
        </div>

        {/* Help Link */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/help" className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
