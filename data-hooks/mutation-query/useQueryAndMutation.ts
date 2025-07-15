import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFamily,
  addFamilyMember,
  deleteFamily,
  updateFamily,
  getAllVillageDetails,
} from '@/requests/village-family.ts'; // Adjust paths if some are from different files
import { FETCH_VILLAGE_DETAILS } from '@/constants/queryKeys/village';

// 1. Create Family
export const useCreateFamily = () => {
  const mutation = useMutation({
    mutationFn: (payload: ICreateFamilyRequest) => createFamily(payload),
    onError: (err) => {
      // Handle error
    },
  });
  return { mutation };
};

// 2. Add Family Member
export const useAddFamilyMember = () => {
  const mutation = useMutation({
    mutationFn: ({
      familyId,
      memberData,
    }: {
      familyId: string;
      memberData: IAddFamilyMemberRequest;
    }) => addFamilyMember(familyId, memberData),
    onError: (err) => {
      // Handle error
    },
  });
  return { mutation };
};

// 3. Delete Family
export const useDeleteFamily = () => {
  const mutation = useMutation({
    mutationFn: (familyId: string) => deleteFamily(familyId),
    onError: (err) => {
      // Handle error
    },
  });
  return { mutation };
};

// 4. Update Family
export const useUpdateFamily = () => {
  const mutation = useMutation({
    mutationFn: ({
      familyId,
      updateData,
    }: {
      familyId: string;
      updateData: IUpdateFamilyRequest;
    }) => updateFamily(familyId, updateData),
    onError: (err) => {
      // Handle error
    },
  });
  return { mutation };
};

// 5. Get All Village Details
export const useGetAllVillageDetails = () => {
  const query = useQuery({
    queryKey: [FETCH_VILLAGE_DETAILS],
    queryFn: getAllVillageDetails,
    onError: (err) => {
      // Handle error
    },
  });
  return { query };
};
