import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-indigo-600"></div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Freelance Flow</h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              footerActionLink: "text-indigo-600 hover:text-indigo-800",
            }
          }}
        />
      </div>
    </div>
  );
}