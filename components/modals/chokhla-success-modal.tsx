"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Copy, Download, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface ChokhlaSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  chokhlaData: any
}

export function ChokhlaSuccessModal({ isOpen, onClose, chokhlaData }: ChokhlaSuccessModalProps) {
  const t = useTranslations()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!chokhlaData) return null

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(t("common.copiedToClipboard"))
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error(t("common.failedToCopy"))
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(chokhlaData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `chokhla-${chokhlaData.name}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(t("common.dataExported"))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <DialogTitle className="text-green-700">{t("modals.chokhlaCreated.title")}</DialogTitle>
          </div>
          <DialogDescription>{t("modals.chokhlaCreated.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("modals.chokhlaCreated.details")}
                <Badge variant="secondary">{t("common.active")}</Badge>
              </CardTitle>
              <CardDescription>{t("modals.chokhlaCreated.detailsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("forms.chokhlaName")}</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{chokhlaData.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.name, "name")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("forms.chokhlaId")}</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm">{chokhlaData.id}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.id, "id")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">{t("modals.chokhlaCreated.adminDetails")}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("forms.adminName")}</label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{chokhlaData.adminName}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(chokhlaData.adminName, "adminName")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("forms.adminEmail")}</label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{chokhlaData.adminEmail}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(chokhlaData.adminEmail, "adminEmail")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("forms.loginUrl")}</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm text-blue-600">
                      {`${window.location.origin}/admin/chokhla/${chokhlaData.id}`}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`${window.location.origin}/admin/chokhla/${chokhlaData.id}`, "loginUrl")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("common.createdAt")}</label>
                <p className="text-sm">{new Date(chokhlaData.createdAt || Date.now()).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => window.open(`/admin/chokhla/${chokhlaData.id}`, "_blank")} className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("modals.chokhlaCreated.openChokhla")}
            </Button>

            <Button variant="outline" onClick={exportData} className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              {t("modals.chokhlaCreated.exportData")}
            </Button>

            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
