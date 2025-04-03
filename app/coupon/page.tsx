"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CouponPage() {
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!couponCode.trim()) {
      setError("Please enter a coupon code")
      return
    }

    if (!user) {
      setError("You must be logged in")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode, userId: user.id }),
      })

      const data = await response.json()

      if (data.valid) {
        setSuccess(true)
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError("Invalid coupon code. Please try again.")
      }
    } catch (err) {
      console.error("Error applying coupon:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/95">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Coupon Code</CardTitle>
          <CardDescription>
            Enter your coupon code to get full access to ClassMent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApplyCoupon}>
            {error && (
              <Alert className="mb-4 bg-destructive/20 text-destructive border-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-900/20 text-green-500 border-green-500">
                <AlertDescription>
                  Coupon applied successfully! Redirecting you...
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={loading || success}
                className="bg-background/50 border-muted"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-[#0066FF] hover:bg-[#0066FF]/90 text-white"
            onClick={handleApplyCoupon}
            disabled={loading || success}
          >
            {loading ? "Applying..." : "Apply Coupon"}
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/payments")}
            disabled={loading || success}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}