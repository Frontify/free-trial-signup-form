import PropTypes from "prop-types"
import React from "react"

const Heading = ({ level, className, children, ...others }) => {
  const Tag = `h${level}`

  return (
    <Tag className={className ? className : undefined} {...others}>
      {children}
    </Tag>
  )
}

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Heading
