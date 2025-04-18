/**
 * SignupPage Component
 *
 * This page allows new users to create an account for the application.
 * It presents a clean, centered form with a simple interface focused on
 * collecting user registration information efficiently.
 */
import { SignupForm } from "@/components/sign-up-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Content container with constrained width for optimal form presentation */}
      <div className="w-full max-w-md">
        {/* Page title - clear heading indicating the purpose of the page */}
        <h1 className="mb-4 text-center text-2xl font-bold">Create an Account</h1>

        {/* SignupForm component - contains all input fields and registration logic */}
        <SignupForm />
      </div>
    </div>
  )
}
