'use client'
import { MemberForm } from '@/components/group-component/family-form/member-form'
import { useGetMemberDetails } from '@/data-hooks/mutation-query/useQueryAndMutation';
import { useParams } from 'next/navigation';
import React from 'react'

function EditPersonPage() {

    const personId = useParams().personId;


    const { data, isLoading, error } = useGetMemberDetails(personId);// Replace with actual personId logic
    console.log(data, isLoading, error);
    return (
        <MemberForm
            fetchedData={data || {}}
            onRemoveMember={function (memberId: string): void {
                console.log(hhhh)
            }} membersCount={0} index={0} errors={"undefined"}


        />)
}

export default EditPersonPage
