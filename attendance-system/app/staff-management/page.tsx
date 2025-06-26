"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Trash2, AlertTriangle } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  joinDate: string
  status: "active" | "inactive"
  phone: string
}

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@company.com",
    position: "Quản lý",
    department: "Quản lý",
    joinDate: "2023-01-01",
    status: "active",
    phone: "0123456789",
  },
  {
    id: "2",
    name: "Nguyễn Văn A",
    email: "nguyenvana@company.com",
    position: "Nhân viên",
    department: "Kỹ thuật",
    joinDate: "2023-03-15",
    status: "active",
    phone: "0123456790",
  },
  {
    id: "3",
    name: "Trần Thị B",
    email: "tranthib@company.com",
    position: "Nhân viên",
    department: "Marketing",
    joinDate: "2023-05-20",
    status: "active",
    phone: "0123456791",
  },
  {
    id: "4",
    name: "Lê Văn C",
    email: "levanc@company.com",
    position: "Nhân viên",
    department: "Kỹ thuật",
    joinDate: "2023-07-10",
    status: "active",
    phone: "0123456792",
  },
  {
    id: "5",
    name: "Phạm Thị D",
    email: "phamthid@company.com",
    position: "Nhân viên",
    department: "Nhân sự",
    joinDate: "2023-09-05",
    status: "active",
    phone: "0123456793",
  },
]

export default function StaffManagement() {
  const [user, setUser] = useState<any>(null)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    position: "Nhân viên",
    department: "",
    phone: "",
    status: "active",
  })
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

    // Load employees from localStorage if exists
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
  }, [router])

  const handleAddEmployee = () => {
    if (employees.length >= 10) {
      setShowLimitWarning(true)
      return
    }

    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.phone) {
      return
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position || "Nhân viên",
      department: newEmployee.department,
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      phone: newEmployee.phone,
    }

    const updatedEmployees = [...employees, employee]
    setEmployees(updatedEmployees)
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    setNewEmployee({
      name: "",
      email: "",
      position: "Nhân viên",
      department: "",
      phone: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id)
    setEmployees(updatedEmployees)
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Đang làm việc</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Nghỉ việc</Badge>
    )
  }

  if (!user || user.role !== "Manager") return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý nhân viên</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý thông tin và danh sách nhân viên</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0077b6] hover:bg-[#005a8b]">
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>Nhập thông tin nhân viên mới vào hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={newEmployee.name || ""}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email || ""}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Nhập email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone || ""}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select
                    value={newEmployee.department || ""}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                      <SelectItem value="Kế toán">Kế toán</SelectItem>
                      <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Select
                    value={newEmployee.position || "Nhân viên"}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                      <SelectItem value="Trưởng nhóm">Trưởng nhóm</SelectItem>
                      <SelectItem value="Phó phòng">Phó phòng</SelectItem>
                      <SelectItem value="Trưởng phòng">Trưởng phòng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEmployee}>
                  Thêm nhân viên
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {showLimitWarning && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-600 dark:text-red-400">
              <strong>Vượt giới hạn!</strong> Hệ thống chỉ hỗ trợ tối đa 10 nhân viên. Liên hệ đội phát triển{" "}
              <strong>The Next Generation</strong> để mở rộng hệ thống.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số nhân viên</CardTitle>
            <Users className="h-4 w-4 text-[#0077b6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0077b6]">
              {employees.filter((emp) => emp.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Đang làm việc / {employees.length} tổng cộng</p>
            <div className="mt-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">Giới hạn: {employees.length}/10 nhân viên</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-[#0077b6] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(employees.length / 10) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>Quản lý thông tin chi tiết của từng nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Ngày vào làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{new Date(employee.joinDate).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {employee.name !== "Admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
