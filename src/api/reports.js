import request from '@/utils/request'

export function getSltComsReport(userId, startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-coms/${userId}/${startTime}/${endTime}`,
    method: 'GET'
  })
}

export function downloadSltComsReport(userId, startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-coms/${userId}/${startTime}/${endTime}`,
    method: 'POST',
    responseType: 'blob'
  })
}

export function getSltCheckReport(startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-check/${startTime}/${endTime}`,
    method: 'GET'
  })
}

export function downloadSltCheckReport(startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-check/${startTime}/${endTime}`,
    method: 'POST',
    responseType: 'blob'
  })
}
