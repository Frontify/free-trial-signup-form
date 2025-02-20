//import "./form.css"
import "../../styles/form.css"

import classnames from "classnames"
import PropTypes from "prop-types"
import React, { useEffect } from "react"

const InputSelect = props => {
  const {
    className,
    validation,
    readOnly,
    name,
    options,
    form,
    label,
    placeholder,
    selected,
  } = props
  const {
    register,
    watch,
    formState: { errors },
  } = form
  const editModeClass = !readOnly ? `state--editing` : ``
  const textColor = errors[name] ? `text-brightred` : `text-charcoal`

  const changed = watch(name) !== ``

  // This is a complete hack to make the signup form work again, remove this later
  useEffect(() => {
    form.setValue(name, selected ? selected : ``)
  }, [])

  return (
    <div class="ft-form-field ft-form-field-select">
      <label 
        className="ft-label" 
        htmlFor={`htmlId`}
      >
        {label}
        {validation && validation.required && `*`}
      </label>
      <div
        className={classnames(
          `select-wrapper py-1`,
          editModeClass,
          !changed && `text-charcoal`
        )}
      >
        <select
          className="ft-select"
          name={name}
          id={`htmlId`}
          readOnly={readOnly}
          {...register(name, validation)}
          tabIndex={readOnly ? -1 : 0}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}

          {options.map((elem, index) => {
            return (
              <option key={`select-${index}`} value={elem.value}>
                {elem.label}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

InputSelect.propTypes = {
  className: PropTypes.string,
  validation: PropTypes.object,
  readOnly: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  selected: PropTypes.string,
}

export default InputSelect
