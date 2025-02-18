//import { StaticImage } from "gatsby-plugin-image"
import PropTypes from "prop-types"
import React from "react"

import Heading from "../heading"
//import RequestDemo from "../molecules/request-demo"
import RequestDemo from "../request-demo"

const ModalDemoRequest = ({ agency }) => {
  return (
    <div className="w-full h-full grid grid-flow-col">
      <div
        className="relative hidden md:block"
        style={{ width: 390, minHeight: 641 }}
      >
        {/*<StaticImage
          src="../../images/modal/modal-top.png"
          alt="A background image"
          layout="fixed"
          className="absolute top-0 left-0"
          quality={100}
          formats={[`PNG`]}
          width={300}
        />*/}
      </div>
      <div className="my-10 mt-9 mx-3 sm:mx-5">
        <div className="mb-7">
          <div className="mb-4">
            <Heading level={2} className="text-lg md:text-xl">
              Let&apos;s Dive Deeper
            </Heading>
          </div>
          {!agency ? (
            <>
              <Heading level={4} className="text-md">
                Schedule Free Demo
              </Heading>
              <p>An expert will show you how Frontify works</p>
            </>
          ) : (
            <>
              <Heading level={4} className="text-md">
                Let&apos;s Have a Conversation
              </Heading>
              <p>A partnership manager will reach out soon</p>
            </>
          )}
        </div>
        <RequestDemo />
      </div>
    </div>
  )
}

ModalDemoRequest.propTypes = {
  agency: PropTypes.bool.isRequired,
}

export default ModalDemoRequest
