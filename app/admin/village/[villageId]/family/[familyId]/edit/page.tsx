"use client"
import AddFamilyPage from '@/components/group-component/add-edit-family'
import { useParams } from 'next/navigation';

import React from 'react'

function Page() {

  const params = useParams();
  const familyId = params.familyId as string;
  return (
    <div>
      <AddFamilyPage mode={'edit'} familyId={familyId} />
    </div>
  )
}

export default Page
