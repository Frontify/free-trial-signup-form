//import "./form.css"
import "../../styles/form.css"

import classnames from "classnames"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import React from "react"
import { useId } from "react-id-generator"

const InputCheckbox = props => {
  const {
    className,
    readOnly,
    validation,
    name,
    label,
    form,
    checkRequired,
    value,
  } = props
  const { register } = form

  const [htmlId] = useId()
  const readOnlyInputClass = readOnly ? `state--hidden` : ``

  const state = form.watch(name)
  const isChecked = state && state?.includes(value)

  const transition = {
    type: `tween`,
    ease: `easeOut`,
    duration: 0.2,
  }

  const validator = e => {
    const single = e === value
    const multi = Array.isArray(e) && e?.includes(value)

    return single || multi ? true : `Checking is required`
  }

  const validationObj = checkRequired
    ? {
        ...validation,
        validate: validator,
      }
    : { ...validation }

  return (
    /*<motion.div
      className="block"
      transition={transition}
      animate={{
        height: !isChecked && readOnly ? 0 : `auto`,
      }}
    >*/
    <div class="checkbox">
      <input
        id={`checkbox-${htmlId}`}
        type="checkbox"
        className={classnames(
          `bg-transparent transition duration-200 ease-in-out `,
          className
        )}
        value={value}
        name={name}
        readOnly={readOnly}
        {...register(name, validationObj)}
      />
      <label
        /*style={{
          backgroundColor: `transparent`,
          pointerEvents: readOnly ? `none` : `auto`,
          transition: `padding-left 200ms ease`,
          paddingLeft: readOnly ? 0 : `3.5rem`,
        }}*/
        className={classnames(
          `font-bold relative text-md w-full`,
          readOnlyInputClass
        )}
        htmlFor={`checkbox-${htmlId}`}
      >
        {label}
      </label>
    </div>
  )
}

InputCheckbox.propTypes = {
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  validation: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  form: PropTypes.object.isRequired,
  checkRequired: PropTypes.bool,
  value: PropTypes.string.isRequired,
}

export default InputCheckbox
