export const createFamily = async (familyData: ICreateFamilyRequest) => {
  const { data, status, statusText } = await request.post<ICreateFamilyResponse>(
    'family/create',
    familyData
  );
  return { data, status, statusText };
};

export const addFamilyMember = async (familyId: string, memberData: IAddFamilyMemberRequest) => {
  const { data, status, statusText } = await request.post<IAddFamilyMemberResponse>(
    `family/${familyId}/member/add`,
    memberData
  );
  return { data, status, statusText };
};


export const deleteFamily = async (familyId: string) => {
  const { data, status, statusText } = await request.delete<IDeleteFamilyResponse>(
    `family/${familyId}/delete`
  );
  return { data, status, statusText };
};


export const updateFamily = async (familyId: string, updateData: IUpdateFamilyRequest) => {
  const { data, status, statusText } = await request.put<IUpdateFamilyResponse>(
    `family/${familyId}/update`,
    updateData
  );
  return { data, status, statusText };
};


export const getAllVillageDetails = async () => {
  const { data, status, statusText } = await request.get<IVillageDetailsResponse>(
    'village/all'
  );
  return { data, status, statusText };
};
