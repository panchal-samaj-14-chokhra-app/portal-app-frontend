// lib/server-api/getChokhlas.ts

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
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/chokhla/public/summary`, {
            cache: 'no-store',
        })

        if (!res.ok) return []

        const data = await res.json()

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
    } catch {
        return []
    }
}
