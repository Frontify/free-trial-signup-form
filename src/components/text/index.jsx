import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import { useId } from "react-id-generator"

const InputText = props => {
  const {
    className,
    validation,
    readOnly,
    name,
    label,
    form,
    type,
    placeholder,
  } = props
  const {
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = form
  console.log(errors);
  const [htmlId] = useId()

  return (
    <div className="ft-form-field">
      {label && (
        <label 
          className="ft-label" 
          htmlFor={htmlId}
        >
          {label}
          {validation && validation.required && `*`}
        </label>
      )}
      <input
        id={htmlId}
        type={type ? type : `text`}
        className="ft-input"
        onChange={() => {
          clearErrors(name)
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        {...register(name, validation)}
        tabIndex={readOnly ? -1 : 0}
      />
          {errors?.[name] && (<div className="ft-error">{errors[name]?.message || "This field is required"}</div>)}
    </div>
  )
}

InputText.propTypes = {
  className: PropTypes.string,
  validation: PropTypes.object,
  readOnly: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
}

export default InputText
