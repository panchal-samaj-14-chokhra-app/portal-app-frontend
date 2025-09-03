export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 hindi-text">जानकारी लोड हो रही है...</p>
            </div>
        </div>
    )
}
