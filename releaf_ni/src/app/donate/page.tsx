import { DonationForm } from "@/components/donation-form"

export default function DonatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Support Our Cause</h1>
            <p className="text-gray-500 dark:text-gray-400 mx-auto">
              Your donation helps us continue our mission. Every contribution makes a difference.
            </p>
          </div>
          <DonationForm />
        </div>
      </div>
    </div>
  );
}