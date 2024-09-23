import React from 'react'
import { Button } from '@alifd/next'
import logoSrc from '@/assets/logo.svg'

const ExceptionBlock: React.FunctionComponent = ({ onRefresh = () => {} }): JSX.Element => {
  return (
    <div className="table-empty-block">
      <div className="result-image">
        <img alt="data empty" src={logoSrc} />
      </div>
      <div className="result-title">
        <Button type="secondary" onClick={onRefresh}>
          重新加载
        </Button>
      </div>
    </div>
  )
}

export default ExceptionBlock
