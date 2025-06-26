"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, LogIn, LogOut } from "lucide-react"

export default function Timekeeping() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null)
  const [lateReason, setLateReason] = useState("")
  const [showLateReason, setShowLateReason] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "warning">("success")
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

    // Load today's attendance from localStorage
    const today = new Date().toDateString()
    const attendanceKey = `attendance_${userData ? JSON.parse(userData).username : ""}_${today}`
    const todayAttendance = localStorage.getItem(attendanceKey)
    if (todayAttendance) {
      const attendance = JSON.parse(todayAttendance)
      setIsCheckedIn(attendance.isCheckedIn)
      setCheckInTime(attendance.checkInTime ? new Date(attendance.checkInTime) : null)
      setCheckOutTime(attendance.checkOutTime ? new Date(attendance.checkOutTime) : null)
    }

    return () => clearInterval(timer)
  }, [router])

  const getTimeStatus = () => {
    const hour = currentTime.getHours()
    const minute = currentTime.getMinutes()
    const timeInMinutes = hour * 60 + minute

    // Check-in times
    const checkInStart = 8 * 60 // 08:00
    const checkInOnTime = 8 * 60 + 30 // 08:30
    const checkInLate = 9 * 60 + 30 // 09:30

    // Check-out times
    const checkOutStart = 16 * 60 + 30 // 16:30
    const checkOutEnd = 17 * 60 // 17:00

    if (!isCheckedIn) {
      if (timeInMinutes >= checkInStart && timeInMinutes <= checkInOnTime) {
        return { canCheckIn: true, status: "ontime", message: "Có thể chấm công đúng giờ" }
      } else if (timeInMinutes > checkInOnTime && timeInMinutes <= checkInLate) {
        return { canCheckIn: true, status: "late", message: "Đi trễ - Vui lòng ghi lý do" }
      } else {
        return { canCheckIn: false, status: "outside", message: "Ngoài khung giờ chấm công" }
      }
    } else {
      if (timeInMinutes >= checkOutStart && timeInMinutes <= checkOutEnd) {
        return { canCheckOut: true, status: "checkout", message: "Có thể chấm công ra về" }
      } else {
        return { canCheckOut: false, status: "outside", message: "Chưa đến giờ ra về" }
      }
    }
  }

  const handleCheckIn = () => {
    const status = getTimeStatus()
    if (!status.canCheckIn) return

    if (status.status === "late" && !lateReason.trim()) {
      setShowLateReason(true)
      setMessage("Vui lòng nhập lý do đi trễ")
      setMessageType("warning")
      return
    }

    const now = new Date()
    setIsCheckedIn(true)
    setCheckInTime(now)
    setMessage(`Chấm công thành công lúc ${now.toLocaleTimeString("vi-VN")}`)
    setMessageType("success")
    setShowLateReason(false)

    // Save to localStorage
    const today = new Date().toDateString()
    const attendanceKey = `attendance_${user.username}_${today}`
    const attendanceData = {
      isCheckedIn: true,
      checkInTime: now.toISOString(),
      checkOutTime: null,
      status: status.status,
      lateReason: status.status === "late" ? lateReason : "",
    }
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData))
  }

  const handleCheckOut = () => {
    const status = getTimeStatus()
    if (!status.canCheckOut) return

    const now = new Date()
    setCheckOutTime(now)
    setMessage(`Chấm công ra về thành công lúc ${now.toLocaleTimeString("vi-VN")}`)
    setMessageType("success")

    // Update localStorage
    const today = new Date().toDateString()
    const attendanceKey = `attendance_${user.username}_${today}`
    const existingData = JSON.parse(localStorage.getItem(attendanceKey) || "{}")
    const attendanceData = {
      ...existingData,
      checkOutTime: now.toISOString(),
    }
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData))
  }

  if (!user) return null

  const timeStatus = getTimeStatus()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chấm công</h1>
          <p className="text-gray-600 dark:text-gray-300">Thực hiện chấm công vào/ra cho ngày hôm nay</p>
        </div>

        {/* Current Time Display */}
        <Card className="bg-gradient-to-r from-[#0077b6] to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <div className="text-4xl font-bold mb-2">{currentTime.toLocaleTimeString("vi-VN")}</div>
            <div className="text-lg opacity-90">
              {currentTime.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {message && (
          <Alert
            className={`${
              messageType === "success"
                ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                : messageType === "error"
                  ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
            }`}
          >
            <AlertDescription
              className={`${
                messageType === "success"
                  ? "text-green-600 dark:text-green-400"
                  : messageType === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Check-in/Check-out Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-green-500" />
                Check-in
              </CardTitle>
              <CardDescription>Thời gian cho phép: 08:00 - 09:30</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkInTime ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">Đã check-in</p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      {checkInTime.toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`p-4 rounded-lg ${
                      timeStatus.status === "ontime"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : timeStatus.status === "late"
                          ? "bg-yellow-50 dark:bg-yellow-900/20"
                          : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        timeStatus.status === "ontime"
                          ? "text-green-700 dark:text-green-400"
                          : timeStatus.status === "late"
                            ? "text-yellow-700 dark:text-yellow-400"
                            : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {timeStatus.message}
                    </p>
                  </div>

                  {showLateReason && timeStatus.status === "late" && (
                    <div className="space-y-2">
                      <Label htmlFor="lateReason">Lý do đi trễ</Label>
                      <Textarea
                        id="lateReason"
                        value={lateReason}
                        onChange={(e) => setLateReason(e.target.value)}
                        placeholder="Nhập lý do đi trễ..."
                        className="min-h-[80px]"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleCheckIn}
                    disabled={!timeStatus.canCheckIn}
                    className="w-full h-12 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Check-in
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-blue-500" />
                Check-out
              </CardTitle>
              <CardDescription>Thời gian cho phép: 16:30 - 17:00</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkOutTime ? (
                <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-400">Đã check-out</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {checkOutTime.toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`p-4 rounded-lg ${
                      timeStatus.canCheckOut ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        timeStatus.canCheckOut ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {isCheckedIn ? timeStatus.message : "Cần check-in trước"}
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckOut}
                    disabled={!isCheckedIn || !timeStatus.canCheckOut}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Check-out
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary */}
        {(checkInTime || checkOutTime) && (
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt ngày hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                  <p className="text-lg font-semibold">
                    {checkInTime ? checkInTime.toLocaleTimeString("vi-VN") : "--:--"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                  <p className="text-lg font-semibold">
                    {checkOutTime ? checkOutTime.toLocaleTimeString("vi-VN") : "--:--"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tổng giờ làm</p>
                  <p className="text-lg font-semibold">
                    {checkInTime && checkOutTime
                      ? `${Math.round(((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)) * 10) / 10}h`
                      : "--h"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
