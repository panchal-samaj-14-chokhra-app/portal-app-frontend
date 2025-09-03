'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
                <h2 className="text-red-600 text-3xl font-extrabold mb-6">कुछ गलत हो गया!</h2>
                <p className="mb-8 text-gray-700 text-lg">
                    सर्वर से डेटा प्राप्त करने में समस्या आई। कृपया नीचे बटन दबाकर पुनः प्रयास करें।
                </p>
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
                >
                    पुनः प्रयास करें (Retry)
                </button>
            </div>
        </div>
    )
}
