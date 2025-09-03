import { getAllChokhlasServer } from '@/lib/server-api/getChokhlas'
import ClientComponent from './ClientComponent'

export default async function CommunityHubPage() {
    const chokhlas = await getAllChokhlasServer()

    return (
        <ClientComponent chokhlas={chokhlas} />
    )
}
