export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"

export default function MandirAdminIndex() {
  redirect("/mandir-admin/mandir")
}
