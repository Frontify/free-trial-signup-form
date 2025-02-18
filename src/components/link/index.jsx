import classNames from "classnames"
import { Link as GatsbyLink } from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"
import Modal from "react-modal"
import { useSelector } from "react-redux"

//import CompanionAppLink from "../atoms/companion-app-link"
import CompanionAppLink from "../companion-app-link"
//import ModalDemoRequest from "../molecules/modal-demo-request"
import ModalDemoRequest from "../modal-demo-request"

const Link = ({
  to,
  role,
  className,
  activeClassName,
  style,
  openAsTab = false,
  GTMUngated = false,
  isInverted = false,
  hasUnderline = false,
  hasArrow = false,
  isSmall = false,
  hasPathFactoryOverlay = false,
  children,
  ...others
}) => {
  // Locales for the languages used across the website
  const locales = [`/en/`, `/de/`, `/fr/`]
  const locale = useSelector(state => state.app.locale)

  const [modalIsOpen, setModalOpen] = useState(false)

  const localePrefixed = to
    ? locales.some(function (v) {
        return to.indexOf(v) >= 0
      })
    : ``

  // Check for internal links
  const isInternalLink = /^\/(?!\/)/.test(to)
  // Check for external links that start with http and https
  const isExternalLink = to && to.startsWith(`http`)
  // Check for email links that have a valid email address containing "@"
  const isEmailLink = /\S+@\S+\.\S+/.test(to)
  // Check for an anchor link that uses a hash (#)
  const isAnchorLink = /^#/.test(to)

  const demoRequest = /#demorequest/gi.test(to)
  const agencyRequest = /#demorequestagency/gi.test(to)
  // Check which URLs to render the <CompanionAppLink /> component
  const companionApp =
    /^frontify-for-desktop-github/.test(to) ||
    /^frontify-for-desktop-github-osx/.test(to) ||
    /^frontify-for-desktop-github-windows/.test(to)

  /*
   * Render the component using the Gatsby link component if link is internal, otherwise render a simple anchor tag.
   * Alternatively, if the URLs passed to the link match those listed in the companionApp variable, render the <CompanionAppLink /> component.
   */
  const Tag = isInternalLink
    ? GatsbyLink
    : companionApp
    ? CompanionAppLink
    : `a`

  // Set localisation if the link is internal and without a prefixed locale set
  if (isInternalLink && !localePrefixed) {
    to = `/${locale.current}/${to}`.replace(/([^:]\/)\/+/g, `$1`)
  }

  // TODO: legacy code for opening a modal, should be refactored in the future
  if (demoRequest || agencyRequest) {
    Modal.setAppElement(`#___gatsby`)

    return (
      <>
        <a
          onClick={e => {
            e.preventDefault()
            setModalOpen(true)
          }}
          href={to}
          {...others}
        >
          {children}
        </a>

        <Modal
          closeTimeoutMS={300}
          isOpen={modalIsOpen}
          onRequestClose={() => {
            setModalOpen(false)
          }}
          style={{
            overlay: {
              backgroundColor: `rgba(45, 50, 50, 0.9)`,
            },
          }}
          contentLabel="Demo Request"
          overlayClassName="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center opacity-0 transition transition-300 overflow-auto"
          bodyOpenClassName="overflow-hidden"
          className="relative w-full max-w-5xl m-auto bg-white outline-none text-charcoal"
        >
          <button
            className="absolute cursor-pointer"
            style={{ top: 25, right: 25 }}
            onClick={() => setModalOpen(false)}
          >
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g
                stroke="#363D4A"
                strokeWidth="2"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="square"
              >
                <path d="M2.045 2.045l19.754 19.754M21.955 2.045L2.201 21.799"></path>
              </g>
            </svg>
          </button>
          <ModalDemoRequest agency={agencyRequest} />
        </Modal>
      </>
    )
  }

  // Any classes we want to add to the link either fixed or via props, should be added here
  const classes = classNames(
    GTMUngated ? `gtm-ungated` : undefined,
    isInverted ? `text-white hover:text-white` : undefined,
    hasUnderline ? `underline hover:no-underline` : undefined,
    hasArrow ? `group flex items-center gap-1` : undefined,
    isSmall ? `text-xs` : undefined,
    className
  )

  return (
    <Tag
      /*
       * Render the "href" attribute if the link is external or is a mailto: link.
       * If an internal link, use the "to" attribute instead.
       * Remove the forward slash from the # links that are used for anchor links.
       */
      {...(hasPathFactoryOverlay
        ? { href: `#` }
        : isInternalLink
        ? { to }
        : {
            href:
              isEmailLink && !to.startsWith(`mailto:`) // Check for existing mailto:
                ? `mailto:${to}`
                : isAnchorLink
                ? `#${to.substring(1)}`
                : to,
          })}
      {...{ style, role }}
      // Conditionally include the className prop only if classes are passed into the link component
      {...(classes ? { className: classes } : {})}
      target={openAsTab ? `blank` : undefined}
      rel={isExternalLink ? `noopener noreferrer` : undefined}
      activeClassName={
        isInternalLink && activeClassName ? activeClassName : undefined
      }
      onClick={
        isAnchorLink
          ? e => {
              e.preventDefault()
              const headerHeight = 90

              const node = document.getElementById(to.replace(`#`, ``))
              if (node) {
                const nodeOffset = node.getBoundingClientRect().top

                window.scrollBy({
                  top: nodeOffset - headerHeight,
                  left: 0,
                  behavior: `smooth`,
                })
              }
            }
          : undefined
      }
      // Conditionally add the data-lookbook-overlay-href attribute needed to open the PathFactory overlay
      {...(hasPathFactoryOverlay ? { "data-lookbook-overlay-href": to } : {})}
      {...others}
    >
      {children}
      {hasArrow && (
        <div className="transition-transform duration-300 ease-in-out transform group-hover:translate-x-2">
          <svg
            width={isSmall ? `18` : `20`}
            height={isSmall ? `18` : `20`}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7506 3.63666C11.4577 3.34377 10.9829 3.34377 10.69 3.63667C10.3971 3.92956 10.3971 4.40443 10.69 4.69733L15.2433 9.25059L2.63672 9.25059C2.2225 9.25059 1.88672 9.58637 1.88672 10.0006C1.88672 10.4148 2.2225 10.7506 2.63672 10.7506L15.2433 10.7506L10.6903 15.3036C10.3974 15.5965 10.3971 16.0717 10.69 16.3645C10.9829 16.6574 11.4578 16.6574 11.7507 16.3645L18.1146 10.0006L11.7506 3.63666Z"
              fill={isInverted ? `#fff` : `#2D3232`}
            />
          </svg>
        </div>
      )}
    </Tag>
  )
}

Link.propTypes = {
  to: PropTypes.string,
  role: PropTypes.string,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  style: PropTypes.string,
  openAsTab: PropTypes.bool,
  GTMUngated: PropTypes.bool,
  isInverted: PropTypes.bool,
  hasUnderline: PropTypes.bool,
  hasArrow: PropTypes.bool,
  isSmall: PropTypes.bool,
  hasPathFactoryOverlay: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Link
