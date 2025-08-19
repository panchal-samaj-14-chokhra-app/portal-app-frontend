import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFamily, deleteFamilyWithId, getFamilyDetails, getVillageDetails, updateFamily, getAllVillages, createVillage, getChokhlaDetails, updateChokhla, getAllChokhlas, createChokhla, getAllVillagesWithChokhlaID, getAlluserList, fetchMemberDetails, updatePerson, toggleUserStatus, registerUser, } from '../requests/village-family';
import { createMember } from '../requests/village-family';
import { removeMember as removeMemberRequest } from '../requests/village-family';

export const useCreateFamily = (onSuccess: any, onError: { (): void; (arg0: Error): void; }) => {
  const mutation = useMutation({
    mutationFn: (payload): any => createFamily(payload),
    onSuccess,
    onError: (err) => {
      if (onError) onError(err);
      else console.log(err);
    },
  });
  return { mutation };
};

export const useUpdateFamily = (onSuccess: any, onError: (arg0: Error) => void) => {
  const mutation = useMutation({
    mutationFn: ({ familyId, submitData }: { familyId: any, submitData: any }) => updateFamily(familyId, submitData),
    onSuccess,
    onError: (err) => {
      if (onError) onError(err);
      else console.log(err);
    },
  });

  return { mutation };
};


export const useGetFamilyDetails = (familyId: string) => {
  return useQuery({
    queryKey: ["family-detail", familyId],
    queryFn: () => getFamilyDetails(familyId),
  });
};



export const useDeleteFamilyUsingID = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (familyId: string) => deleteFamilyWithId(familyId),
    onSuccess: () => {
      // Optional: Refetch or clean up any queries
      queryClient.invalidateQueries({ queryKey: ["family-list"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};


export const useVillageDetails = (villageId: string) => {
  return useQuery({
    queryKey: ['village-details', villageId],
    queryFn: () => getVillageDetails(villageId),
  })
}

export const useAllVillages = () => {
  return useQuery({
    queryKey: ['all-villages'],
    queryFn: getAllVillages,
  });
}

export const useGetAllVillageswithChokhlaID = (chokhlaID: string) => {
  return useQuery({
    queryKey: ['all-villages-with-chokhla-id'],
    queryFn: async () => await getAllVillagesWithChokhlaID(chokhlaID),
  });
}

export const useCreateVillage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createVillage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-villages', 'all-villages-with-chokhla-id'] });
    },
  });
}

export const useChokhlaDetails = (chokhlaId: string) => {
  return useQuery({
    queryKey: ['chokhla-details', chokhlaId],
    queryFn: () => getChokhlaDetails(chokhlaId),
    enabled: !!chokhlaId,
  });
}

export const useUpdateChokhla = (chokhlaId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updateChokhla(chokhlaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chokhla-details', chokhlaId] });
    },
  });
}

export const useAllChokhlas = () => {
  return useQuery({
    queryKey: ['all-chokhlas'],
    queryFn: getAllChokhlas,
  });
}

export const useCreateChokhla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createChokhla(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-chokhlas'] });
    },
  });
}


export const useCreateMember = () => {
  return useMutation({
    mutationFn: (payload: any) => createMember(payload),

  });
};


export const useGetMemberDetails = (memberId: string) => {
  return useQuery({
    queryKey: ["memberDetails", memberId],
    queryFn: () => fetchMemberDetails(memberId),
  });
};
export const useDeleteMember = (): ReturnType<typeof useMutation> => {
  return useMutation({
    mutationFn: (id: any) => removeMemberRequest(id),
  });
};

export const useUpdatePerson = (): ReturnType<typeof useMutation> => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updatePerson({ id, payload }),
  });
};
export const useToggleUserStatus = (): ReturnType<typeof useMutation> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
  });
};

export const useGetAllUserList = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: getAlluserList
  });
};


export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
  })
}
