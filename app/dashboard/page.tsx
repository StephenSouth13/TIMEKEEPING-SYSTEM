"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

const attendanceData = [
  { name: "Đúng giờ", value: 20, color: "#10b981" },
  { name: "Đi trễ", value: 3, color: "#f59e0b" },
  { name: "Nghỉ không phép", value: 2, color: "#ef4444" },
]

const weeklyData = [
  { day: "T2", checkin: 8.5, checkout: 17.5 },
  { day: "T3", checkin: 8.2, checkout: 17.3 },
  { day: "T4", checkin: 8.0, checkout: 17.0 },
  { day: "T5", checkin: 8.3, checkout: 17.2 },
  { day: "T6", checkin: 8.1, checkout: 17.1 },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Xin chào, {user.username}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              Vai trò: <span className="font-semibold text-[#0077b6]">{user.role}</span>
            </p>
          </div>
          <Card className="bg-gradient-to-r from-[#0077b6] to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Thời gian hiện tại</p>
                <p className="text-xl font-bold">{currentTime.toLocaleTimeString("vi-VN")}</p>
                <p className="text-sm opacity-90">
                  {currentTime.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ngày làm việc</CardTitle>
              <Calendar className="h-4 w-4 text-[#0077b6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0077b6]">20</div>
              <p className="text-xs text-muted-foreground">Tháng này</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đi trễ</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">3</div>
              <p className="text-xs text-muted-foreground">Lần trong tháng</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nghỉ không phép</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">2</div>
              <p className="text-xs text-muted-foreground">Ngày trong tháng</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ đúng giờ</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">80%</div>
              <p className="text-xs text-muted-foreground">Tháng này</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Thống kê chấm công</CardTitle>
              <CardDescription>Tỷ lệ chấm công theo trạng thái</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {attendanceData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Giờ làm việc tuần này</CardTitle>
              <CardDescription>Thời gian check-in và check-out</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[7, 19]} />
                  <Tooltip />
                  <Bar dataKey="checkin" fill="#0077b6" name="Check-in" />
                  <Bar dataKey="checkout" fill="#60a5fa" name="Check-out" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
