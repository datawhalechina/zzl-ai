import React from 'react'
import ServerError from '@/components/Exception'

const FeedbackNotFound = () => {
  return <ServerError statusCode="404" description="当前页面不存在哟～～" />
}

export default FeedbackNotFound
