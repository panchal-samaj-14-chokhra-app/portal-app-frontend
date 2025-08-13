import request from "@/config/request";

export const getApiCall = async () => {
  const { data } = await request.get('/')

  return { data }
}


export const createFamily = async (payload: void) => {
  const { data } = await request.post('/family/create', payload)

  return { data }
}

export const updateFamily = async (id: string, payload: any) => {
  const { data } = await request.put(`/family/update/${id}`, payload)
  return { data }
}


export const getFamilyDetails = async (id: string) => {
  const { data } = await request.get(`/family/${id}`)
  return data
}

export const deleteFamilyWithId = async (id: string) => {
  const { data } = await request.delete(`/family/delete/${id}`)
  return data
}


export const getVillageDetails = async (id: string) => {
  const { data } = await request.get(`/village/${id}`)
  return data
}

export const getAllVillages = async () => {
  const { data } = await request.get('/village');
  return data;
}
export const getAllVillagesWithChokhlaID = async (chokhlaID: string) => {
  const { data } = await request.get(`chokhla/getvillage/${chokhlaID}`);
  return data;
}

export const createVillage = async (payload: any) => {
  const { data } = await request.post('/village/create', payload);
  return data;
}

export const getChokhlaDetails = async (id: string) => {
  const { data } = await request.get(`/chokhla/${id}`);
  return data;
}

export const updateChokhla = async (id: string, payload: any) => {
  const { data } = await request.put(`/chokhla/${id}`, payload);
  return data;
}

export const getAllChokhlas = async () => {
  const { data } = await request.get('/chokhla');
  return data;
}

export const createChokhla = async (payload: any) => {
  const { data } = await request.post('/chokhla/create', payload);
  return data;
}

export const getAlluserList = async () => {
  const { data } = await request.get('/api/auth/users')
  return data;
}


export const createMember = async (payload) => {
  const { data } = await request.post('/person/create', payload);
  return { data };
}


export const fetchMemberDetails = async (memberId: string) => {
  const { data } = await request.get(`/person/${memberId}`);
  return data;
};

export const removeMember = async (id: any) => {
  const { data } = await request.delete(`/person/${id}`);
  return { data };
}
