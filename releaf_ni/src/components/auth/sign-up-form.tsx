"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SignUpForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors(null)

    const result = await signUp(formData)

    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setErrors(result.message as Record<string, string[]>)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
          {errors?.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {errors?.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {errors?.password && <p className="text-sm text-destructive">{errors.password[0]}</p>}
        </div>

        {errors?._form && (
          <Alert variant="destructive">
            <AlertDescription>{errors._form[0]}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

