import request from '@/utils/request'

export function getSltComsReport(userId, startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-coms/${userId}/${startTime}/${endTime}`,
    method: 'GET'
  })
}

export function getSltCheckReport(startTime, endTime) {
  return request({
    url: `/v1/api/reports/slt-check/${startTime}/${endTime}`,
    method: 'GET'
  })
}
