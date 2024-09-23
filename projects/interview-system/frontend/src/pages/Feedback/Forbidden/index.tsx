import React from 'react'
import ServerError from '@/components/Exception'

const FeedbackForbidden = () => {
  return <ServerError statusCode="403" description="无权限访问" />
}

export default FeedbackForbidden
