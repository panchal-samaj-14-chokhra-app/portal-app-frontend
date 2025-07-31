"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddChokhlaForm } from "@/components/forms/add-chokhla-form"
import { ChokhlaSuccessModal } from "@/components/modals/chokhla-success-modal"
import { useAllChokhlas } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { Plus, Users, Building, MapPin } from "lucide-react"

export default function SuperAdminPage() {
  const t = useTranslations()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [newChokhlaData, setNewChokhlaData] = useState(null)

  const { data: chokhlas, isLoading } = useAllChokhlas()

  const handleChokhlaCreated = (data: any) => {
    setNewChokhlaData(data)
    setIsAddDialogOpen(false)
    setIsSuccessModalOpen(true)
  }

  const stats = {
    totalChokhlas: chokhlas?.length || 0,
    totalVillages: 0,
    totalFamilies: 0,
    totalMembers: 0,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("superadmin.title")}</h1>
          <p className="text-muted-foreground">{t("superadmin.description")}</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("superadmin.addChokhla")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("superadmin.addNewChokhla")}</DialogTitle>
              <DialogDescription>{t("superadmin.addChokhlaDescription")}</DialogDescription>
            </DialogHeader>
            <AddChokhlaForm onSuccess={handleChokhlaCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("superadmin.stats.totalChokhlas")}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChokhlas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("superadmin.stats.totalVillages")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVillages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("superadmin.stats.totalFamilies")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFamilies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("superadmin.stats.totalMembers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chokhlas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chokhlas">{t("superadmin.tabs.chokhlas")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("superadmin.tabs.analytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="chokhlas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("superadmin.chokhlasList")}</CardTitle>
              <CardDescription>{t("superadmin.chokhlasList.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
                </div>
              ) : chokhlas && chokhlas.length > 0 ? (
                <div className="grid gap-4">
                  {chokhlas.map((chokhla: any) => (
                    <Card key={chokhla.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{chokhla.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t("superadmin.admin")}: {chokhla.adminName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("superadmin.email")}: {chokhla.adminEmail}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("common.view")}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">{t("superadmin.noChokhlas")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("superadmin.noChokhlas.description")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("superadmin.analytics")}</CardTitle>
              <CardDescription>{t("superadmin.analytics.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("superadmin.analytics.comingSoon")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChokhlaSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        chokhlaData={newChokhlaData}
      />
    </div>
  )
}
