import { OSS_ENDPOINT, OSS_BUCKET } from '@/constants'
import * as attachmentAPI from '@/apis/attachments'
import moment from 'moment'
import { createHash } from 'crypto'
const OSS = require('ali-oss')

let STS_TOKEN = null

const getUploadClient = (token) => {
  return new OSS({
    accessKeyId: token.AccessKeyId,
    accessKeySecret: token.AccessKeySecret,
    stsToken: token.SecurityToken,
    region: OSS_ENDPOINT,
    bucket: OSS_BUCKET
  });
}

export const getSTSClient = () => {
  return new Promise((resolve, reject) => {
    if (!STS_TOKEN || (STS_TOKEN && (new Date(STS_TOKEN.Expiration) < Date.now()))) {
       attachmentAPI.getSTSToken().then(r => {
         if (r) {
           STS_TOKEN = r
           resolve(getUploadClient(STS_TOKEN))
         } else {
           reject()
         }
       })
    } else {
      resolve(getUploadClient(STS_TOKEN))
    }
  })
}

export const encodeFileName = (filename) => {
  const timeStr = moment().format('YYYYMMDDHHmmss')
  const hash = createHash('md5').update(filename + timeStr).digest('hex')
  return hash
}

export const downloadFile = (uri, filename) => {
  fetch(uri)
  .then(res => res.blob()
  .then(blob => {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }))
}
