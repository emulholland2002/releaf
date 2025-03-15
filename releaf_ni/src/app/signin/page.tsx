import { SigninForm } from "@/components/sign-in-form"

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Sign in</h1>
        <SigninForm />
      </div>
    </div>
  )
}

