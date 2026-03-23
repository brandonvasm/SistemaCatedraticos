import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-[#0b101f] relative overflow-hidden">
      

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[140px] -top-60 -left-40 animate-pulse duration-[10s]" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] bottom-0 right-0 animate-pulse duration-[15s]" />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] top-1/2 left-1/4" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 pl-64">
        <Navbar />

        <main className="p-8 pt-24"> 
          {children}
        </main>
      </div>
    </div>
  )
}