export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(Params: UploadParams): Promise<{ link: string }>
}
