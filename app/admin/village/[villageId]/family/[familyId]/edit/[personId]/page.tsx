'use client'
import { MemberForm } from '@/components/group-component/family-form/member-form'
import { useGetMemberDetails } from '@/data-hooks/mutation-query/useQueryAndMutation';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button/button"
import { ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
function EditPersonPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const personId = useParams().personId;
    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" })
    }
    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/login")
    }, [session, status, router])

    console.log(session, 'sessionsession')
    const { data, isLoading, error } = useGetMemberDetails(personId);
    if (isLoading) {
        return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-orange-700">लोड हो रहा है...</p>
            </div>
        </div>
    }

    if (error) return <div className="text-red-500">Failed to load member details.</div>
    return (
        <>
            <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Image
                                src="/images/main-logo.png"
                                alt="Panchal Samaj Logo"
                                width={50}
                                height={50}
                                className="rounded-full shadow-lg"
                            />
                            <div className="min-w-0">

                                <p className="text-orange-100 text-sm truncate">स्वागत है, {session?.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">

                            <Button onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                वापस जॉए
                            </Button>

                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                लॉगआउट
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <MemberForm
                fetchedData={data || {}}
                onRemoveMember={function (memberId: string): void {

                }} membersCount={0} index={0} errors={"undefined"}


            />

        </>
    )
}

export default EditPersonPage
