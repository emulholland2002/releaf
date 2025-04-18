/**
 * SigninPage Component
 *
 * This page provides user authentication functionality, allowing existing users
 * to sign in to their accounts. It presents a simple, centered form with
 * a clean interface focused on the authentication experience.
 */
import { SigninForm } from "@/components/sign-in-form"

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Content container with constrained width for better readability */}
      <div className="w-full max-w-md">
        {/* Page title - simple, bold heading for the sign-in form */}
        <h1 className="mb-4 text-center text-2xl font-bold">Sign in</h1>

        {/* SigninForm component - contains input fields and submission logic */}
        <SigninForm />
      </div>
    </div>
  )
}
