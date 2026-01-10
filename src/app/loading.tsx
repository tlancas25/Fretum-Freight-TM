import { Truck } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      {/* Animated loader */}
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-brand-200 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Truck className="w-8 h-8 text-brand-600 animate-bounce" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" />
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
    </div>
  )
}
