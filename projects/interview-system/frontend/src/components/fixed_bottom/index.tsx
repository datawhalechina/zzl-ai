import React, { SFC, useState, useRef, useEffect } from 'react'
import { findDOMNode } from 'react-dom'
import styles from './index.module.scss'

const FixedBottom: SFC = ({
  children,
  type = 'default',
}: {
  children: React.ReactNode[];
  type: 'FormItem' | 'default';
}) => {
  const containerRef = useRef(null)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  useEffect(() => {
    const parentNode =
      type === 'default'
        ? containerRef.current.parentNode
        : containerRef.current.parentNode.parentNode.parentNode.parentNode
    // eslint-disable-next-line react/no-find-dom-node
    const dom = findDOMNode(parentNode) as HTMLDivElement
    const rect = (dom && dom.getBoundingClientRect()) || {}
    setLeft(rect.left)
    setRight(document.documentElement.offsetWidth - rect.left - rect.width)
  }, [type])

  return (
    <div ref={containerRef} style={{ left, right }} className={styles.fixedBottom}>
      {children}
    </div>
  )
}

export default FixedBottom
