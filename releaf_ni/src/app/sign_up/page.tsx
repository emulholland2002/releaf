import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
        <p className="text-muted-foreground text-center mb-8">Join Releaf today and be part of the change</p>
        <SignUpForm />
      </div>
    </div>
  )
}

