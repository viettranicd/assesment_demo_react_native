import { NewBox } from '@/constants/Type';
import axiosClient from '@/utils/axiosClient';

export const boxApis = {
  getBoxes: () => axiosClient.get('/ai-box'),
  getBoxDetail: (id: string) => axiosClient.get(`/ai-box/${id}`),
  addBox: (body: NewBox) => axiosClient.post('/ai-box', body),
  updateBox: (id: string, body: Partial<NewBox>) => axiosClient.patch(`/ai-box/${id}`, body),
  sync: () => axiosClient.post('/ai-box/sync')
}