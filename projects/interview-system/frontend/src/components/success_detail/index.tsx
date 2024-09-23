import React, { useState } from 'react'
import { Button, Card, Icon } from '@alifd/next'

import styles from './index.module.scss'
import { useInterval } from 'ahooks'
import FontRender from '../font_render'

interface DetailProcessFunc {
  (): any;
}

export interface ISuccessDetailProps {
  statusCode?: string;
  description?: string;
  buttonBackDesc?: string;
  buttonContinueDesc?: string;
  countDownSecnods: number;
  onButtonBack?: DetailProcessFunc;
  onButtonContinue?: DetailProcessFunc;
}

export default function SuccessDetail(props: ISuccessDetailProps) {
  const {
    statusCode = '',
    description = '',
    buttonBackDesc = '',
    buttonContinueDesc = '',
    countDownSecnods = 5,
    onButtonBack = null,
    onButtonContinue = null,
  } = props

  const [second, setSecond] = useState(countDownSecnods)

  const gobackHandle = () => {
    onButtonBack && onButtonBack()
  }

  useInterval(
    () => {
      if (countDownSecnods !== 0) {
        setSecond(second - 1)
        if (second <= 0) {
          gobackHandle()
        }
      }
    },
    (countDownSecnods !== 0 && second >= 0) ? 1000 : null,
  )

  const goContinueHandle = () => {
    onButtonContinue && onButtonContinue()
  }

  return (
    <Card free className={styles.SuccessDetail}>
      <div>
        <FontRender type="success" className={styles.exceptionImage} content={<Icon type="success" />} />
        <h1 className={styles.statuscode}>{statusCode}</h1>
        {description && <div className={styles.description}>{`${second > 0 ? second : ''}${description}`}</div>}
        <div className={styles.operationWrap}>
          {buttonBackDesc && (
            <Button type="primary" onClick={gobackHandle} className={styles.mainAction}>
              {buttonBackDesc}
            </Button>
          )}
          {buttonContinueDesc && <Button onClick={goContinueHandle}>{buttonContinueDesc}</Button>}
        </div>
      </div>
    </Card>
  )
}
