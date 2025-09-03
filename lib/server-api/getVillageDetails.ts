// lib/server-api/getVillageDetails.ts

export interface VillageDetails {
    name: string;
    tehsil: string;
    district: string;
    state: string;
    isVillageHaveSchool: boolean;
    isVillageHavePrimaryHealthCare: boolean;
    isVillageHaveCommunityHall: boolean;
    familyCount: number;
    personCount: number;
}

export async function getVillageDetailsServer(id: string): Promise<VillageDetails[]> {
    const url = `${process.env.NEXT_PUBLIC_REQUEST_URL}/chokhla/getvillage/${id}`;
    console.log(url, "ur;;;");

    const res = await fetch(url, {
        headers: {
            // Add auth headers if needed
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch village details');
    }

    const data = await res.json();
    console.log(data, "villages data");

    // Transform array of raw village data
    return data.map((village: any) => ({
        name: village.name,
        tehsil: village.tehsil,
        district: village.district,
        state: village.state,
        isVillageHaveSchool: village.isVillageHaveSchool,
        isVillageHavePrimaryHealthCare: village.isVillageHavePrimaryHealthCare,
        isVillageHaveCommunityHall: village.isVillageHaveCommunityHall,
        familyCount: village.familyCount,
        personCount: village.personCount,
    }));
}
