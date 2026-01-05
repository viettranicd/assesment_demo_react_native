import { BoxStatus } from "./Status";

export interface AiBox {
  id: number;
  name: string;
  description?: string;
  updatedAt: Date;
  status: BoxStatus;
  createdAt: Date;
  cameras?: Camera[]
  ipAddress: string
  port: number
  macAddress?: string
  maxCameras?: number
}

export interface Camera {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  preview: string
}

export interface NewBox {
  deviceId: string
  name: string
  ipAddress: string
  port: string
  macAddress?: string
  maxCameras?: number
  description: string
}

export interface NewCamera {
  name: string
  description: string
  ipAddress: string
  port: string
  boxId: number
  camUser: string
  camPass: string
  isEnable: boolean
  aiType: number[]
  zones: CamZone[]
}

export interface CamZone {
  zoneName: string
  points: number[][]
}

export interface AlarmData {
  DeviceID: string
  CameraID: string
  Zone: string
  AlarmID: string
  AlarmInfo: string
  Images: string[]
  Video: string[]
}

export interface AlarmType {
  Datetime: string
  uuid: string
  Data: AlarmData
}