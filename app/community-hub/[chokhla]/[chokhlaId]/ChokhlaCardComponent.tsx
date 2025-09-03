'use client';  // <--- add this at the very top
import { useRouter } from 'next/navigation';
import React from 'react';
// other imports

export default function ChokhlaClientComponent({ villageData }) {
    const router = useRouter();


    return (
        <>
            {villageData.sort((a, b) => b.personCount - a.personCount).map((c, idx) => (
                <div
                    key={idx}
                    className="
            flex items-start space-x-4 p-5
            bg-white bg-opacity-70
            rounded-xl border border-orange-200
            shadow-md
            transition-transform transform
            hover:scale-[1.03] hover:shadow-xl
            cursor-pointer
            duration-300
          "
                    role="button"
                    tabIndex={0}
                    aria-label={`Details for ${c.chokhlaName}`}

                >
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg sm:text-xl text-orange-700 mb-2 tracking-wide">
                            {c.name}{' '}
                            <span className="text-s sm:text-base text-orange-700 font-normal">
                                <strong>({c.state}, {c.district}, {c.tehsil} )</strong>
                            </span>
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-1">
                            <span><strong>कुल परिवार : {c.familyCount}</strong></span><br />
                            <span><strong>कुल परिवारो के सदस्य : {c.personCount}</strong></span><br />
                            <span><strong>स्कूल की सुविधा : {c.isVillageHaveSchool ? 'हाँ' : 'नहीं'}</strong></span><br />
                            <span><strong>प्राथमिक स्वास्थ्य केंद्र : {c.isVillageHavePrimaryHealthCare ? 'हाँ' : 'नहीं'}</strong></span><br />
                            <span><strong>सामुदायिक भवन : {c.isVillageHaveCommunityHall ? 'हाँ' : 'नहीं'}</strong></span><br />
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
}
