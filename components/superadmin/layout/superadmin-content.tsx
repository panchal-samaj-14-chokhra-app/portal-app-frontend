"use client"

import { VillageManagement } from "../village-management"
import { ChokhlaManagement } from "../chokhla-management"
import { UserManagement } from "../user-management"
import { ProfileManagement } from "../profile-management"
import { StatisticsManagement } from "../statistics-management"
import { useSuperAdmin } from "../providers/superadmin-provider"

export function SuperAdminContent() {
  const {
    activeTab,
    villages,
    choklas,
    users,
    statistics,
    profile,
    isLoadingVillages,
    isLoadingChoklas,
    isLoadingUsers,
    isLoadingStatistics,
    isLoadingProfile,
    handleRefreshVillages,
    handleRefreshChoklas,
    handleRefreshUsers,
    handleCreateChokhla,
    handleUpdateProfile,
    handleToggleUserStatus,
    handleToggleChokhlaStatus,
  } = useSuperAdmin()

  switch (activeTab) {
    case "statistics":
      return <StatisticsManagement statistics={statistics} isLoading={isLoadingStatistics} />

    case "villages":
      return <VillageManagement villages={villages} isLoading={isLoadingVillages} onRefresh={handleRefreshVillages} />

    case "choklas":
      return (
        <ChokhlaManagement
          choklas={choklas}
          isLoading={isLoadingChoklas}
          onRefresh={handleRefreshChoklas}
          onCreateChokhla={handleCreateChokhla}
          onToggleStatus={handleToggleChokhlaStatus}
        />
      )

    case "users":
      return (
        <UserManagement
          users={users}
          isLoading={isLoadingUsers}
          onRefresh={handleRefreshUsers}
          onToggleStatus={handleToggleUserStatus}
        />
      )

    case "profile":
      return <ProfileManagement profile={profile} isLoading={isLoadingProfile} onUpdateProfile={handleUpdateProfile} />

    default:
      return <StatisticsManagement statistics={statistics} isLoading={isLoadingStatistics} />
  }
}
