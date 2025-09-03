'use client';

import { FolderSync } from 'lucide-react';
import { Button } from '@/components/ui/button'; // adjust this path as needed

export default function ReloadButton() {
    return (
        <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
            <FolderSync className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            जानकारी पुनः प्राप्त करें (Reload)
        </Button>
    );
}
