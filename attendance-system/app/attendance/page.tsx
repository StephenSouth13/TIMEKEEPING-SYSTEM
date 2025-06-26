"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download } from "lucide-react"

// Mock data for attendance
const generateAttendanceData = (username: string, role: string) => {
  const data = []
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    // Skip future dates
    if (date > today) continue

    const random = Math.random()
    let status = "Đúng giờ"
    let checkIn = "08:00"
    let checkOut = "17:00"
    let note = ""

    if (random < 0.1) {
      status = "Nghỉ không phép"
      checkIn = "--"
      checkOut = "--"
      note = "Không có thông báo"
    } else if (random < 0.25) {
      status = "Đi trễ"
      checkIn = "08:45"
      checkOut = "17:00"
      note = "Tắc đường"
    }

    data.push({
      date: date.toLocaleDateString("vi-VN"),
      checkIn,
      checkOut,
      status,
      note,
      employee: username,
    })
  }

  // If manager, add data for other employees
  if (role === "Manager") {
    const employees = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"]
    employees.forEach((emp) => {
      for (let day = 1; day <= Math.min(daysInMonth, today.getDate()); day++) {
        const date = new Date(currentYear, currentMonth, day)
        const dayOfWeek = date.getDay()

        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const random = Math.random()
        let status = "Đúng giờ"
        let checkIn = "08:00"
        let checkOut = "17:00"
        let note = ""

        if (random < 0.05) {
          status = "Nghỉ không phép"
          checkIn = "--"
          checkOut = "--"
        } else if (random < 0.15) {
          status = "Đi trễ"
          checkIn = "08:30"
          checkOut = "17:00"
          note = "Lý do cá nhân"
        }

        data.push({
          date: date.toLocaleDateString("vi-VN"),
          checkIn,
          checkOut,
          status,
          note,
          employee: emp,
        })
      }
    })
  }

  return data.sort(
    (a, b) =>
      new Date(b.date.split("/").reverse().join("-")).getTime() -
      new Date(a.date.split("/").reverse().join("-")).getTime(),
  )
}

export default function Attendance() {
  const [user, setUser] = useState<any>(null)
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    const data = generateAttendanceData(parsedUser.username, parsedUser.role)
    setAttendanceData(data)
    setFilteredData(data)
  }, [router])

  useEffect(() => {
    let filtered = attendanceData

    if (selectedEmployee !== "all") {
      filtered = filtered.filter((item) => item.employee === selectedEmployee)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus)
    }

    setFilteredData(filtered)
  }, [selectedEmployee, selectedStatus, attendanceData])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đúng giờ":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Đúng giờ</Badge>
      case "Đi trễ":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Đi trễ</Badge>
      case "Nghỉ không phép":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Nghỉ không phép</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const exportToCSV = () => {
    const headers =
      user?.role === "Manager"
        ? ["Ngày", "Nhân viên", "Check-in", "Check-out", "Trạng thái", "Ghi chú"]
        : ["Ngày", "Check-in", "Check-out", "Trạng thái", "Ghi chú"]

    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => {
        const values =
          user?.role === "Manager"
            ? [row.date, row.employee, row.checkIn, row.checkOut, row.status, row.note]
            : [row.date, row.checkIn, row.checkOut, row.status, row.note]
        return values.map((val) => `"${val}"`).join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `bang-cham-cong-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) return null

  const employees = [...new Set(attendanceData.map((item) => item.employee))]
  const statuses = [...new Set(attendanceData.map((item) => item.status))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảng chấm công</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Xem chi tiết thông tin chấm công</p>
          </div>
          <Button onClick={exportToCSV} className="bg-[#0077b6] hover:bg-[#005a8b]">
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dữ liệu chấm công tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </CardTitle>
                <CardDescription>Tổng cộng {filteredData.length} bản ghi</CardDescription>
              </div>

              <div className="flex gap-2">
                {user.role === "Manager" && (
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả nhân viên</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp} value={emp}>
                          {emp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    {user.role === "Manager" && <TableHead>Nhân viên</TableHead>}
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={user.role === "Manager" ? 6 : 5} className="text-center py-8 text-gray-500">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{row.date}</TableCell>
                        {user.role === "Manager" && <TableCell>{row.employee}</TableCell>}
                        <TableCell>{row.checkIn}</TableCell>
                        <TableCell>{row.checkOut}</TableCell>
                        <TableCell>{getStatusBadge(row.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{row.note || "--"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
