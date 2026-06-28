"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MatrimonialEdit from "./matrimonial-edit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Heart, Search, Pencil, Trash2, Eye, Loader2, ChevronLeft, ChevronRight, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMatrimonialProfiles, useUpdateMatrimonialProfile, useDeleteMatrimonialProfile } from "@/data-hooks/mutation-query/useMatrimonial"

const LIMIT = 10

export default function MatrimonialManagement() {
  const { toast } = useToast()
  const [editing, setEditing] = useState<{ id: string; view: boolean } | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [gender, setGender] = useState("all")
  const [marital, setMarital] = useState("all")
  const [confirm, setConfirm] = useState<any | null>(null)

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const { data, isFetching } = useMatrimonialProfiles({
    page, limit: LIMIT, name: debounced,
    gender: gender === "all" ? "" : gender,
    maritalStatus: marital === "all" ? "" : marital,
  })
  const update = useUpdateMatrimonialProfile()
  const del = useDeleteMatrimonialProfile()

  const profiles = data?.data || []
  const meta = data?.meta || { totalCount: 0, totalPages: 1, currentPage: 1 }

  const toggleActive = (p: any) => {
    update.mutate(
      { id: p.id, payload: { isProfileActive: !p.isProfileActive } },
      {
        onSuccess: () => toast({ title: !p.isProfileActive ? "ऐप पर दिखाया गया" : "ऐप से हटाया गया", variant: "success" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )
  }

  if (editing) {
    return <MatrimonialEdit profileId={editing.id} viewOnly={editing.view} onBack={() => setEditing(null)} />
  }

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-orange-700"><Heart className="w-5 h-5 mr-2" />वैवाहिक प्रोफ़ाइल</CardTitle>
            <CardDescription>कुल {meta.totalCount} प्रोफ़ाइल · "ऐप पर दिखाएं" बंद करने पर प्रोफ़ाइल ऐप से हट जाती है।</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="नाम से खोजें" className="pl-8" />
          </div>
          <Select value={gender} onValueChange={(v) => { setGender(v); setPage(1) }}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="लिंग" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी लिंग</SelectItem>
              <SelectItem value="MALE">पुरुष</SelectItem>
              <SelectItem value="FEMALE">महिला</SelectItem>
              <SelectItem value="OTHER">अन्य</SelectItem>
            </SelectContent>
          </Select>
          <Select value={marital} onValueChange={(v) => { setMarital(v); setPage(1) }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="वैवाहिक स्थिति" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी स्थिति</SelectItem>
              <SelectItem value="single">अविवाहित</SelectItem>
              <SelectItem value="married">विवाहित</SelectItem>
              <SelectItem value="divorced">तलाकशुदा</SelectItem>
              <SelectItem value="widowed">विधवा/विधुर</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto relative">
          {isFetching && <div className="absolute right-2 top-1 text-orange-500"><Loader2 className="w-4 h-4 animate-spin" /></div>}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">नाम</th>
                <th className="py-2 pr-2">आयु</th>
                <th className="py-2 pr-2">लिंग</th>
                <th className="py-2 pr-2">स्थान</th>
                <th className="py-2 pr-2">मोबाइल</th>
                <th className="py-2 pr-2">स्थिति</th>
                <th className="py-2 pr-2 text-center">ऐप पर</th>
                <th className="py-2 pr-2 text-right">कार्य</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-500">कोई प्रोफ़ाइल नहीं मिली।</td></tr>
              ) : profiles.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-2 text-gray-500">{p.profileNumber}</td>
                  <td className="py-2 pr-2 font-medium text-gray-900">{[p.name, p.lastName].filter(Boolean).join(" ") || "—"}</td>
                  <td className="py-2 pr-2">{p.age || "—"}</td>
                  <td className="py-2 pr-2">{p.gender === "MALE" ? "पुरुष" : p.gender === "FEMALE" ? "महिला" : "अन्य"}</td>
                  <td className="py-2 pr-2 text-gray-600 truncate max-w-[160px]">{[p.district, p.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="py-2 pr-2 text-gray-600">{p.mobileNumber || "—"}</td>
                  <td className="py-2 pr-2">
                    <Badge className={p.isProfileActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}>
                      {p.isProfileActive ? "सक्रिय" : "हटाई गई"}
                    </Badge>
                  </td>
                  <td className="py-2 pr-2 text-center"><Switch checked={!!p.isProfileActive} onCheckedChange={() => toggleActive(p)} /></td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setEditing({ id: p.id, view: true })} className="border-gray-200 h-8 px-2"><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing({ id: p.id, view: false })} className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8 px-2"><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirm(p)} className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">पृष्ठ {meta.currentPage} / {meta.totalPages} · कुल {meta.totalCount}</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4 mr-1" />पिछला</Button>
            <Button size="sm" variant="outline" disabled={page >= meta.totalPages || isFetching} onClick={() => setPage((p) => p + 1)}>अगला<ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>प्रोफ़ाइल हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>"{[confirm?.name, confirm?.lastName].filter(Boolean).join(" ")}" को स्थायी रूप से हटाने की पुष्टि करें। यह क्रिया वापस नहीं होगी। (केवल ऐप से हटाना हो तो "ऐप पर" टॉगल बंद करें।)</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!confirm) return
                del.mutate(confirm.id, {
                  onSuccess: () => { toast({ title: "प्रोफ़ाइल हटाई गई", variant: "success" }); setConfirm(null) },
                  onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
                })
              }}
            >हां, हटाएं</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
