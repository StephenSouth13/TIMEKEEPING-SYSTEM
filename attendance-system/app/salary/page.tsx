"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Download, TrendingUp, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock salary data
const generateSalaryData = () => {
  const employees = [
    { name: "Admin", position: "Quản lý", baseSalary: 20000000 },
    { name: "Nguyễn Văn A", position: "Nhân viên", baseSalary: 12000000 },
    { name: "Trần Thị B", position: "Nhân viên", baseSalary: 11000000 },
    { name: "Lê Văn C", position: "Nhân viên", baseSalary: 13000000 },
    { name: "Phạm Thị D", position: "Nhân viên", baseSalary: 12500000 },
  ]

  return employees.map((emp) => {
    const workDays = Math.floor(Math.random() * 3) + 20 // 20-22 days
    const lateDays = Math.floor(Math.random() * 4) // 0-3 days
    const absentDays = Math.floor(Math.random() * 3) // 0-2 days
    const overtimeHours = Math.floor(Math.random() * 20) // 0-19 hours

    const dailySalary = emp.baseSalary / 22
    const workingSalary = dailySalary * workDays
    const lateDeduction = lateDays * (dailySalary * 0.1)
    const absentDeduction = absentDays * dailySalary
    const overtimeBonus = overtimeHours * 50000
    const bonus = Math.random() > 0.7 ? 1000000 : 0

    const netSalary = workingSalary - lateDeduction - absentDeduction + overtimeBonus + bonus

    return {
      ...emp,
      workDays,
      lateDays,
      absentDays,
      overtimeHours,
      workingSalary,
      lateDeduction,
      absentDeduction,
      overtimeBonus,
      bonus,
      netSalary,
    }
  })
}

export default function Salary() {
  const [user, setUser] = useState<any>(null)
  const [salaryData, setSalaryData] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Check if user is manager
    if (parsedUser.role !== "Manager") {
      router.push("/dashboard")
      return
    }

    setSalaryData(generateSalaryData())
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const exportToCSV = () => {
    const headers = [
      "Họ tên",
      "Chức vụ",
      "Số ngày làm",
      "Số ngày trễ",
      "Số ngày nghỉ",
      "Giờ làm thêm",
      "Lương cơ bản",
      "Khấu trừ trễ",
      "Khấu trừ nghỉ",
      "Thưởng làm thêm",
      "Thưởng khác",
      "Lương thực lãnh",
    ]

    const csvContent = [
      headers.join(","),
      ...salaryData.map((row) =>
        [
          row.name,
          row.position,
          row.workDays,
          row.lateDays,
          row.absentDays,
          row.overtimeHours,
          row.baseSalary,
          row.lateDeduction,
          row.absentDeduction,
          row.overtimeBonus,
          row.bonus,
          row.netSalary,
        ]
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `bang-luong-${selectedMonth}-${selectedYear}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user || user.role !== "Manager") return null

  const totalSalary = salaryData.reduce((sum, emp) => sum + emp.netSalary, 0)
  const avgSalary = salaryData.length > 0 ? totalSalary / salaryData.length : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Báo cáo lương</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý và tính toán lương nhân viên</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Tháng {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToCSV} className="bg-[#0077b6] hover:bg-[#005a8b]">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            <strong>Lưu ý:</strong> Dữ liệu lương được tính toán tự động dựa trên chấm công và các quy định của công ty.
          </AlertDescription>
        </Alert>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng chi lương</CardTitle>
              <DollarSign className="h-4 w-4 text-[#0077b6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0077b6]">{formatCurrency(totalSalary)}</div>
              <p className="text-xs text-muted-foreground">
                Tháng {selectedMonth}/{selectedYear}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lương trung bình</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(avgSalary)}</div>
              <p className="text-xs text-muted-foreground">Trên {salaryData.length} nhân viên</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số nhân viên</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{salaryData.length}</div>
              <p className="text-xs text-muted-foreground">Nhân viên đang làm việc</p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Bảng lương chi tiết - Tháng {selectedMonth}/{selectedYear}
            </CardTitle>
            <CardDescription>Tính toán dựa trên dữ liệu chấm công và các quy định lương thưởng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead className="text-center">Ngày làm</TableHead>
                    <TableHead className="text-center">Ngày trễ</TableHead>
                    <TableHead className="text-center">Ngày nghỉ</TableHead>
                    <TableHead className="text-center">Giờ thêm</TableHead>
                    <TableHead className="text-right">Lương cơ bản</TableHead>
                    <TableHead className="text-right">Khấu trừ</TableHead>
                    <TableHead className="text-right">Thưởng</TableHead>
                    <TableHead className="text-right">Thực lãnh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryData.map((emp, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell className="text-center">{emp.workDays}</TableCell>
                      <TableCell className="text-center">{emp.lateDays}</TableCell>
                      <TableCell className="text-center">{emp.absentDays}</TableCell>
                      <TableCell className="text-center">{emp.overtimeHours}h</TableCell>
                      <TableCell className="text-right">{formatCurrency(emp.baseSalary)}</TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(emp.lateDeduction + emp.absentDeduction)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +{formatCurrency(emp.overtimeBonus + emp.bonus)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-[#0077b6]">
                        {formatCurrency(emp.netSalary)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
