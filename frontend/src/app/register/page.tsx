import dynamic from "next/dynamic"

const RegisterPage = dynamic(() => import("@/components/pages/RegisterPage"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>
})

export default function Register() {
  return <RegisterPage />
}