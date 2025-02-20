import classNames from "classnames"
import PropTypes from "prop-types"
import React from "react"

//import Link from "../link"

const Button = ({
  type = `button`,
  theme,
  useDefaultStyling = false,
  isInverted = false,
  isRounded = false,
  onClick,
  to,
  classname,
  openAsTab = false,
  GTMUngated = false,
  hasPathFactoryOverlay = false,
  children,
  ...others
}) => {
  const isLink =
    to &&
    (to.includes(`http`) ||
      to.startsWith(`#`) ||
      to.startsWith(`mailto`) ||
      to.startsWith(`/`))

  const defaultClasses = `text-center text-xs inline-block mobile-only:w-full`
  const dynamicClasses = {
    border: true,
    "text-white border-charcoal bg-charcoal hover:bg-superdark hover:text-white hover:border-superdark":
      (theme === `primary` || theme === `dark`) && !isInverted,
    "text-white border-charcoal bg-charcoal hover:bg-superdark hover:text-white hover:border-superdark inverted":
      (theme === `primary` || theme === `dark`) && isInverted,
    "text-charcoal border-charcoal bg-transparent hover:bg-superdark hover:text-white hover:border-superdark":
      theme === `light` && !isInverted,
    "text-white border-white bg-transparent hover:bg-white hover:text-charcoal hover:border-white":
      theme === `light` && isInverted,
    "py-2 px-3 rounded-lg": !isRounded,
    "py-1 px-4 rounded-full": isRounded,
  }

  /*
   * Use default styling, remove padding and background color, to set the button to render similar to a link
   * This is useful if we want to use a <Button> component for buttons with arrow icons as the icon will render without additional styling
   * Use the <Button useDefaultStyling> ... </Button> prop to apply
   * Fallback is provided to apply all classes for buttons that do not use this prop
   */
  const buttonClassNames = useDefaultStyling
    ? defaultClasses
    : classNames(defaultClasses, dynamicClasses)

  const renderAsButton = () => (
    <button
      {...{ type, onClick }}
      className="ft-button"
      {...others}
    >
      {children}
    </button>
  )

  const renderAsLink = () => (
    <a
      {...{ to }}
      role="button"
      className="ft-button"
      target={openAsTab ? `blank` : undefined}
      hasPathFactoryOverlay={hasPathFactoryOverlay}
      {...others}
    >
      {children}
    </a>
  )

  return isLink ? renderAsLink() : renderAsButton()
}

Button.propTypes = {
  type: PropTypes.oneOf([`button`, `submit`, `reset`]),
  theme: PropTypes.oneOf([`primary`, `dark`, `light`]),
  isInverted: PropTypes.bool,
  isRounded: PropTypes.bool,
  to: PropTypes.any,
  classname: PropTypes.string,
  openAsTab: PropTypes.oneOf([true, false]),
  GTMUngated: PropTypes.bool,
  hasPathFactoryOverlay: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Button
