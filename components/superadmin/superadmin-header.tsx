"use client"

import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { LogOut, Menu, Home, Building2, BarChart3, Users, User, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function SuperAdminHeader({ initialTab = 'polls' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { data: userData } = useSession()

  const SIDEBAR_TABS = [
    { key: 'chokhla', label: 'चोखरा प्रबंधन', icon: Building2, shortLabel: 'चोखरा' },
    { key: 'village', label: 'गांव प्रबंधन', icon: Home, shortLabel: 'गांव' },
    { key: 'statics', label: 'आँकड़े', icon: BarChart3, shortLabel: 'आँकड़े' },
    { key: 'user', label: 'यूज़र प्रबंधन', icon: Users, shortLabel: 'यूज़र' },
    { key: 'polls', label: 'पोल्स', icon: Vote, shortLabel: 'पोल्स', tab: 'polls' },
    { key: 'profile', label: 'सुपर एडमिन प्रोफ़ाइल', icon: User, shortLabel: 'प्रोफ़ाइल' },
  ]

  const handleLogoutClick = () => setShowLogoutConfirm(true)
  const handleLogoutConfirm = () => signOut({ callbackUrl: '/login' })
  const handleLogoutCancel = () => setShowLogoutConfirm(false)

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setMobileMenuOpen(false)
  }

  const getCurrentTabLabel = () => {
    const currentTab = SIDEBAR_TABS.find((tab) => tab.key === activeTab)
    return currentTab?.label || 'सुपर एडमिन पैनल'
  }

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Image
                            src="/images/main-logo.png"
                            alt="Panchal Samaj Logo"
                            width={40}
                            height={40}
                            className="rounded-full shadow-lg"
                          />
                          <div>
                            <h2 className="text-white font-bold text-lg">पंचाल समाज</h2>
                            <p className="text-orange-100 text-sm">सुपर एडमिन पैनल</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <nav className="flex-1 p-4">
                      <div className="space-y-2">
                        {SIDEBAR_TABS.map((tab) => {
                          const Icon = tab.icon
                          return (
                            <Button
                              key={tab.key}
                              variant={activeTab === tab.key ? 'default' : 'ghost'}
                              onClick={() => handleTabChange(tab.key)}
                              className={`w-full justify-start text-left font-medium transition-all duration-200 ${
                                activeTab === tab.key
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-800'
                              }`}
                            >
                              <Icon className="w-5 h-5 mr-3" />
                              {tab.label}
                            </Button>
                          )
                        })}
                      </div>
                    </nav>
                    <div className="p-4 border-t">
                      <Button
                        onClick={handleLogoutClick}
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        लॉगआउट
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px] rounded-full shadow-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  <span className="hidden md:inline">पंचाल समाज 14 चोखरा - सुपर एडमिन</span>
                  <span className="md:hidden">{getCurrentTabLabel()}</span>
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm truncate">स्वागत है, {userData?.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden md:flex text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-700">
              <LogOut className="w-5 h-5" />
              लॉगआउट की पुष्टि करें
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              क्या आप वाकई लॉगआउट करना चाहते हैं? आपको दोबारा लॉगिन करना होगा।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel} className="bg-gray-100 hover:bg-gray-200">
              रद्द करें
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              हां, लॉगआउट करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
