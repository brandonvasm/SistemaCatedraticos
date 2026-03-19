import LoginForm from "../components/auth/LoginForm"

export default function Login() {
  return (
    <div className="app-bg flex items-center justify-center relative overflow-hidden">
      


      <div className="blob w-[800px] h-[800px] bg-blue-700/20 rounded-full blur-[140px] -top-60 -left-40 animate-pulse duration-[12s]" />
      

      <div className="blob w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[120px] -bottom-40 -right-20 animate-pulse duration-[18s]" />

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}