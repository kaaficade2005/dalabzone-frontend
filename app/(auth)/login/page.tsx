export const metadata = {
  title: "Login - Dalabzone",
  description:
    "Access your Dalabzone account to manage orders, track deliveries, update your profile, and enjoy a seamless shopping experience.",
}





import LeftSideAuth from "@/components/auth/LeftSideAuth"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">

      {/* LEFT SIDE (Image / Branding) */}
      <LeftSideAuth />

      {/* RIGHT SIDE (Login) */}
      <div className="flex flex-col justify-center items-center p-6 md:p-10">
        {/* Login Card */}
        <div className="w-full max-w-md rounded-2xl  p-4 md:p-8 space-y-6">



          <LoginForm />

        </div>
      </div>
    </div>
  )
}