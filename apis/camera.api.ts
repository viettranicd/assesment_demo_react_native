import { NewCamera } from "@/constants/Type"
import axiosInstance from "@/utils/axiosClient"

export const cameraApis = {
  addCamera: (body: NewCamera) => axiosInstance.post('/camera', body),
  getCameraDetail: (id: number) => axiosInstance.get(`/camera/${id}`),
  getCameras: () => axiosInstance.get('/camera'),
  updateCamera: (id: number, body: Partial<NewCamera>) => axiosInstance.patch(`/camera/${id}`, body),
  deleteCamera: (id: number) => axiosInstance.delete(`/camera/${id}`)
}