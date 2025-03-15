import { SignupForm } from "@/components/sign-up-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Create an Account</h1>
        <SignupForm />
      </div>
    </div>
  )
}