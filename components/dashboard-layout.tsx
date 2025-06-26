"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Clock, Calendar, DollarSign, Users, LogOut, Moon, Sun, User } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    const savedTheme = localStorage.getItem("theme")
    const isDark = savedTheme === "dark"
    setIsDarkMode(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [router])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newTheme)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Manager", "Staff"],
    },
    {
      title: "Chấm công",
      url: "/timekeeping",
      icon: Clock,
      roles: ["Manager", "Staff"],
    },
    {
      title: "Bảng chấm công",
      url: "/attendance",
      icon: Calendar,
      roles: ["Manager", "Staff"],
    },
    {
      title: "Báo cáo lương",
      url: "/salary",
      icon: DollarSign,
      roles: ["Manager"],
    },
    {
      title: "Quản lý nhân viên",
      url: "/staff-management",
      icon: Users,
      roles: ["Manager"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role))

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-gray-200 dark:border-gray-800">
          <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077b6] to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">TNG</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Chấm Công</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">The Next Generation</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full justify-start">
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <User className="h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-gray-500">{user.role}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-56">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
