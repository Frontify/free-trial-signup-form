//import "./form.css"
import "../../styles/form.css"

import classnames from "classnames"
//import { motion } from "framer-motion"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useId } from "react-id-generator"

const InputRadio = props => {
  const {
    className,
    readOnly,
    onChange,
    validation,
    name,
    label,
    form,
    value,
    tabIndex = 0,
  } = props
  const { register } = form

  const [htmlId] = useId()
  const readOnlyInputClass = readOnly ? `state--hidden` : ``
  const [isChecked, setIsChecked] = useState(false)

  const transition = {
    type: `tween`,
    ease: `easeOut`,
    duration: 0.2,
  }

  return (
    <div className="radio-buttons-group">
      <input
        className="ft-radio"
        id={htmlId}
        type="radio"
        value={value || label}
        readOnly={readOnly}
        {...register(name, validation)}
        onChange={e => {
          setIsChecked(e.currentTarget.checked)
          onChange(e) // Invoke the custom onChange function
        }}
        tabIndex={tabIndex}
      />
      <label
        className="ft-label"
        htmlFor={htmlId}
      >
        {label}
      </label>
    </div>
  )
}

InputRadio.propTypes = {
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  onChange: PropTypes.string,
  validation: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  value: PropTypes.string,
  tabIndex: PropTypes.number,
}

export default InputRadio
