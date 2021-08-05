import request from '@/utils/request'

export function getSltComsReport(param) {
  return request({
    url: `/v1/api/reports/slt-coms/${param.userId}/${param.startTime}/${param.endTime}?timeType=${param.timeType}`,
    method: 'GET'
  })
}

export function downloadSltComsReport(param) {
  return request({
    url: `/v1/api/reports/slt-coms/${param.userId}/${param.startTime}/${param.endTime}?timeType=${param.timeType}`,
    method: 'POST',
    responseType: 'blob'
  })
}

export function getSltCheckReport(param) {
  return request({
    url: `/v1/api/reports/slt-check/${param.startTime}/${param.endTime}?timeType=${param.timeType}&userId=${param.userId}`,
    method: 'GET'
  })
}

export function downloadSltCheckReport(param) {
  return request({
    url: `/v1/api/reports/slt-check/${param.startTime}/${param.endTime}?timeType=${param.timeType}&userId=${param.userId}`,
    method: 'POST',
    responseType: 'blob'
  })
}
