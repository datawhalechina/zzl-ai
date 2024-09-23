import React from 'react'
import logoSrc from '@/assets/logo.svg'

import styles from './index.module.scss'

const EmptyBlock: React.FC = () => {
  return (
    <div className={styles.EmptyBlock}>
      <div className="result-image">
        <img alt="data empty" src={logoSrc} />
      </div>
      <div className="result-title">数据为空</div>
    </div>
  )
}

export default EmptyBlock
