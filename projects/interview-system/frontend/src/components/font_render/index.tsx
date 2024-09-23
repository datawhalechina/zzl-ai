import React from 'react'

const FontRender: React.FC = ({
  type = 'default',
  content,
  title,
  ...restProp
}: {
  type: string;
  content: unknown;
  title: string;
}) => {
  const allColor = { default: '#000', error: '#FF3333', warning: '#FFA003', success: '#1DC11D' }
  return (
    <span style={{ color: allColor[type], textAlign: 'center' }} title={title} {...restProp}>
      {content}
    </span>
  )
}

export default FontRender
