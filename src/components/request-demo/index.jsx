import React from "react"
import HubspotForm from "react-hubspot-form"

const RequestDemo = () => {
  return (
    <HubspotForm
      portalId="2035494"
      formId="7840aa85-74c1-4ae2-9756-a79a3ab7cd79"
      loading={<div>Loading...</div>}
    />
  )
}

export default RequestDemo
