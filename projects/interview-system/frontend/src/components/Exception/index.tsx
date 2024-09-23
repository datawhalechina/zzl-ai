import React, { SFC } from 'react'
import { Button, Card } from '@alifd/next'
import styles from './index.module.scss'
import logoSrc from '@/assets/logo.svg'
import { useHistory } from 'ice'

export interface ExceptionProps {
  statusCode: string;
  description: string;
  image: string;
}

const Exception: SFC<ExceptionProps> = (props: ExceptionProps) => {
  const { statusCode = '500', description = '服务器好像挂了你要等会了', image = logoSrc } = props

  const history = useHistory()
  return (
    <Card free className={styles.exception}>
      <div>
        <img src={image} className={styles.exceptionImage} alt="img" />
        <h1 className={styles.statuscode}>{statusCode}</h1>
        <div className={styles.description}>{description}</div>
        <Button type="primary" size="large" className={styles.Button} onClick={() => history.replace('/')}>
          去首页
        </Button>
      </div>
    </Card>
  )
}

export default Exception
