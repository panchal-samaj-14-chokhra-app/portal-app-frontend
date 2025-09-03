// lib/server-api/getChokhlas.ts

import { id } from "date-fns/locale"

export interface ChokhlaSummary {
    adhyaksh: string
    state: string
    district: string
    villageCount: number
    familyCount: number
    memberCount: number
    chokhlaName: string
    ChokhraID: string
}

export async function getAllChokhlasServer(): Promise<ChokhlaSummary[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/chokhla`, {
        headers: {
            // Authorization: `Bearer ${process.env.API_SECRET}`,
        },
        cache: 'no-store',
    })

    if (!res.ok) {
        throw new Error('Failed to fetch chokhlas')
    }

    const data = await res.json()

    // Pick only required fields
    return data.map((item: any) => ({
        chokhlaName: item.name,
        adhyaksh: item.adhyaksh,
        state: item.state,
        district: item.district,
        villageCount: item.villageCount,
        familyCount: item.familyCount,
        memberCount: item.memberCount,
        ChokhraID: item.id
    }))
}
