import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFamily, deleteFamilyWithId, getFamilyDetails, getVillageDetails, updateFamily, getAllVillages, createVillage, getChokhlaDetails, updateChokhla, getAllChokhlas, createChokhla, getAllVillagesWithChokhlaID, getAlluserList } from '../requests/village-family';

export const useCreateFamily = (onSuccess: any, onError: { (): void; (arg0: Error): void; }) => {
  const mutation = useMutation({
    mutationFn: (payload) => createFamily(payload),
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
    mutationFn: (id: void, payload: undefined) => updateFamily(id, payload),
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


export const useGetAllUserList = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: getAlluserList
  });
};
