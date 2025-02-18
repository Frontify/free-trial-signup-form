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

  const inputValue = watch(name)
  const [htmlId] = useId()
  const textColor = errors[name]
    ? `placeholder-brightred text-brightred`
    : `placeholder-charcoal text-charcoal`

  return (
    <div>
      {label && (
        <label className="text-xs" htmlFor={htmlId}>
          {label}
          {validation && validation.required && `*`}
        </label>
      )}
      <input
        id={htmlId}
        type={type ? type : `text`}
        className={classnames(
          `bg-transparent transition duration-200 ease-in-out text-sm sm:text-md w-full py-1 focus:outline-none `,
          readOnly && `pointer-events-none`,
          className,
          textColor,
          !inputValue && `text-charcoal`
        )}
        onChange={() => {
          clearErrors(name)
        }}
        placeholder={placeholder}
        style={{
          backgroundColor: `transparent`,
          borderBottom: readOnly ? `1px solid transparent` : `1px solid black`,
        }}
        readOnly={readOnly}
        {...register(name, validation)}
        tabIndex={readOnly ? -1 : 0}
      />
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
