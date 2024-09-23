import React from 'react'
import ServerError from '@/components/Exception'

const FeedbackServerError = () => {
  return <ServerError statusCode="500" description="服务器好像挂了你要等会了" />
}

export default FeedbackServerError
