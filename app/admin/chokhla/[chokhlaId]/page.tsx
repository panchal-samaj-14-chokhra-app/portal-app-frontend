"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ChokhlaHeader } from "@/components/chokhla/chokhla-header"
import { CokhlaSidebar } from "@/components/chokhla/chokhla-sidebar"
import { VillageForm } from "@/components/chokhla/village-form"
import { VillageTable } from "@/components/chokhla/village-table"
import { ProfileForm } from "@/components/chokhla/profile-form"
import { SuccessDialog } from "@/components/chokhla/success-dialog"
import { ErrorDialog } from "@/components/chokhla/error-dialog"
import type { Village, ChokhlaProfile, VillageFormData, ProfileFormData } from "@/components/chokhla/types"

export default function ChokhlaPage() {
  const params = useParams()
  const chokhlaId = params.chokhlaId as string

  // State management
  const [activeTab, setActiveTab] = useState("villages")
  const [profile, setProfile] = useState<ChokhlaProfile | null>(null)
  const [villages, setVillages] = useState<Village[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingVillages, setIsLoadingVillages] = useState(true)
  const [isSubmittingVillage, setIsSubmittingVillage] = useState(false)
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)

  // Dialog states
  const [successDialog, setSuccessDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    details?: Record<string, any>
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onRetry?: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chokhla/${chokhlaId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल लोड करने में त्रुटि",
        message: "प्रोफाइल की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchProfile,
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Fetch villages data
  const fetchVillages = async () => {
    try {
      setIsLoadingVillages(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chokhla/${chokhlaId}/villages`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setVillages(data)
    } catch (error) {
      console.error("Error fetching villages:", error)
      setErrorDialog({
        isOpen: true,
        title: "गांवों की सूची लोड करने में त्रुटि",
        message: "गांवों की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: fetchVillages,
      })
    } finally {
      setIsLoadingVillages(false)
    }
  }

  // Handle village form submission
  const handleVillageSubmit = async (data: VillageFormData) => {
    try {
      setIsSubmittingVillage(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chokhla/${chokhlaId}/villages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const newVillage = await response.json()
      setVillages((prev) => [...prev, newVillage])

      setSuccessDialog({
        isOpen: true,
        title: "गांव सफलतापूर्वक पंजीकृत हुआ",
        message: "नया गांव सफलतापूर्वक जोड़ा गया है।",
        details: {
          "गांव का नाम": data.name,
          राज्य: data.state,
          जिला: data.district,
          पिनकोड: data.pincode,
        },
      })

      // Switch to villages tab to show the new village
      setActiveTab("villages")

      toast.success("गांव सफलतापूर्वक पंजीकृत हुआ")
    } catch (error) {
      console.error("Error creating village:", error)
      setErrorDialog({
        isOpen: true,
        title: "गांव पंजीकरण में त्रुटि",
        message: error instanceof Error ? error.message : "गांव पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleVillageSubmit(data),
      })
    } finally {
      setIsSubmittingVillage(false)
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmittingProfile(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chokhla/${chokhlaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)

      setSuccessDialog({
        isOpen: true,
        title: "प्रोफाइल सफलतापूर्वक अपडेट हुई",
        message: "आपकी प्रोफाइल की जानकारी सफलतापूर्वक अपडेट हो गई है।",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          मोबाइल: data.mobileNumber,
          स्थान: `${data.district}, ${data.state}`,
        },
      })

      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हुई")
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorDialog({
        isOpen: true,
        title: "प्रोफाइल अपडेट में त्रुटि",
        message: error instanceof Error ? error.message : "प्रोफाइल अपडेट करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleProfileSubmit(data),
      })
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (chokhlaId) {
      fetchProfile()
      fetchVillages()
    }
  }, [chokhlaId])

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "villages":
        return <VillageTable villages={villages} isLoading={isLoadingVillages} />

      case "add-village":
        return <VillageForm onSubmit={handleVillageSubmit} isLoading={isSubmittingVillage} />

      case "profile":
        return (
          <ProfileForm
            profile={profile}
            onSubmit={handleProfileSubmit}
            isLoading={isLoadingProfile || isSubmittingProfile}
          />
        )

      default:
        return <VillageTable villages={villages} isLoading={isLoadingVillages} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ChokhlaHeader profile={profile} isLoading={isLoadingProfile} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <CokhlaSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
        title={successDialog.title}
        message={successDialog.message}
        details={successDialog.details}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        onRetry={errorDialog.onRetry}
      />
    </div>
  )
}
