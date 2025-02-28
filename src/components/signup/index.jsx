import axios from "axios"
import jsonpAdapter from "axios-jsonp"
import classNames from "classnames"
import Cookies from "js-cookie"
import jstz from "jstz"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import InputCheckbox from "../checkbox"
import InputRadio from "../radio"
import InputSelect from "../select"
import InputText from "../text"
import Button from "../button"
import agencies from "../../data/agencies"
import companies from "../../data/companies"
import countries from "../../data/countries"

const Signup = () => {
  const [selectedRadioOption, setSelectedRadioOption] = useState(null)

  // States
  const form = useForm()
  const {
    formState: { errors },
  } = form
  const [sending, setSending] = useState(false)

  const isSSR = typeof window === `undefined`
  const urlParams = new URLSearchParams(isSSR ? `` : location.search)
  const plan = `ENTERPRISE_TRIAL`

  // Helper functions
  const setEmailError = (type, message) => {
    form.setError(`email`, {
      type: type,
      message: message,
    })
  }
  const getPhonePlaceholder = () => {
    const country = form.watch(`country`)

    /*
    if (!country) return `${transl.phonePlaceholder?.value} +41...`
    return `${transl.phonePlaceholder?.value} +${
      countries.find(e => e[0] === country)[1]
    }…`
    */
  }

  // Submit function
  const submit = formState => {
    const gclid = sessionStorage ? sessionStorage.getItem(`gclid`) : ``
    const msclkid = sessionStorage ? sessionStorage.getItem(`msclkid`) : ``

    setSending(true)

    const tz = jstz.determine()
    const referrer = sessionStorage ? sessionStorage.getItem(`referrer`) : ``
    const sessionStorageLanding = sessionStorage
      ? sessionStorage.getItem(`landing`)
      : ``
    const localStorageLanding = localStorage
      ? localStorage.getItem(`landing`)
      : ``
    let landing

    if (
      localStorageLanding &&
      // eslint-disable-next-line no-useless-escape
      /(\&|\?)utm([_a-z0-9+\-]+)/g.test(localStorageLanding)
    ) {
      landing = localStorageLanding
    } else {
      landing = sessionStorageLanding
    }

    const request = {
      language: `en`,
      referer: referrer,
      landing: landing,
      timezone: tz.name(),
      type: `STYLEGUIDE`,
      plan_code: plan,
      plan_interval: urlParams.get(`interval`) || `YEARLY`,
      voucher: urlParams.get(`voucher`) || ``,
      hutk: Cookies.get(`hubspotutk`),
      pageUrl: window.location.href,
      pageName: document.title,
      user: {
        name: `${formState.firstName} ${formState.lastName}`,
        email: formState.email,
        password: formState.password,
        phone: formState.phone || ``,
        country: formState.country,
        agency_identification: selectedRadioOption,
        companySize: formState.agency_size || formState.company_size, // This is the value from the agency or company size drop-down
        terms: true,
        gclid: gclid || ``,
        msclkid: msclkid || ``,
      },
    }

    // API call to product
    fetch(`${process.env.GATSBY_APP_URL}/api/user/signup`, {
      method: `POST`,
      mode: `cors`,
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify(request),
    })
      .then(res => res.json())
      .then(data => {
        const { success, domain, token, errors } = data

        if (success && domain && token) {
          const url = `https://${domain}/api/account/login/?token=${token}`

          return axios({
            method: `POST`,
            url: url,
            adapter: jsonpAdapter,
          })
        } else {
          if (errors) {
            if (errors[`email-already-in-use`]) {
              setEmailError(`emailInUse`, `Email address already in use`)
              setSending(false)
            } else if (errors[`email-invalid`]) {
              setEmailError(
                `emailInvalid`,
                `Please enter a valid email address`
              )

              setSending(false)
            }
            return {
              data: {
                success: false,
              },
            }
          }
        }
      })
      .then(res => {
        const { success, url } = res.data
        if (success && url) {
          if (window.dataLayer) {
            window.dataLayer.push({ event: `custom.tracking.signup` })
          }
          // Redirect to the specified URL after successful form submission
          window.location.href = `https://www.frontify.com/en/signup-thank-you/`
        }
      })
  }

  const handleOptionChange = option => {
    setSelectedRadioOption(option)
  }

  return (
    <div>
      <form id="ga-free_trial" onSubmit={form.handleSubmit(submit)}>
        <div>
          {plan && (
            <>
              <div className="grid-cols">
                <div>
                  <InputText
                    name="firstName"
                    validation={{ required: true }}
                    {...{ form }}
                    label="First Name"
                    placeholder="e.g., Jamie"
                  />
                  <InputSelect
                    name="country"
                    validation={{ required: true }}
                    {...{ form }}
                    label="Country"
                    placeholder="e.g., Switzerland"
                    options={countries.map(country => ({
                      value: country[0],
                      label: country[0],
                    }))}
                  />
                  <InputText
                    name="email"
                    validation={{ required: true }}
                    {...{ form }}
                    type="email"
                    label="Work Email"
                    placeholder="e.g., hello@frontify.com"
                  />
                  {errors?.email?.type === `emailInUse` && (
                    <p
                      className="absolute bottom-0 text-xxs text-brightred"
                      style={{ transform: `translateY(105%)` }}
                    />
                  )}
                </div>
                <div>
                  <InputText
                    name="lastName"
                    validation={{ required: true }}
                    {...{ form }}
                    label="Last Name"
                    placeholder="e.g., Doe"
                  />          
                  <InputText
                    name="phone"
                    validation={{ minLength: 7, maxLength: 20 }}
                    {...{ form }}
                    label="Phone Number"
                    placeholder="e.g., +41..."
                    type="tel"
                  />
                  <InputText
                    name="password"
                    validation={{ required: true }}
                    {...{ form }}
                    type="password"
                    label="Password"
                    placeholder="e.g., correct horse battery staple"
                  />
                </div>
              </div>
              <div class="ft-radio-buttons-group">
                <div>Are you with an Agency? (branding, design, advertising, consulting, tech)*</div>
                <div className="ft-radio-buttons">
                  <InputRadio
                      className="mb-5"
                      name="agency_identification"
                      label="Yes"
                      value="Yes"
                      validation={{ required: true }}
                      {...{ form }}
                      checked={selectedRadioOption === `Yes`}
                      onChange={() => handleOptionChange(`Yes`)}
                    />
                  <InputRadio
                    name="agency_identification"
                    label="No"
                    value="No"
                    validation={{ required: true }}
                    {...{ form }}
                    checked={selectedRadioOption === `No`}
                    onChange={() => handleOptionChange(`No`)}
                  />
                </div>
              </div>
              <div>
                {selectedRadioOption === `Yes` && (
                  <InputSelect
                    name="agency_size"
                    validation={{ required: true }}
                    {...{ form }}
                    label="How big is your agency?"
                    placeholder="e.g., 1-10"
                    options={agencies.map(agency => ({
                      value: agency[0],
                      label: agency[0],
                    }))}
                  />
                )}
                {selectedRadioOption === `No` && (
                  <InputSelect
                    name="company_size"
                    validation={{ required: true }}
                    {...{ form }}
                    label="How big is your company?"
                    placeholder="e.g., 1-20"
                    options={companies.map(company => ({
                      value: company[0],
                      label: company[0],
                    }))}
                  />
                )}
              </div>
              {errors?.agency_identification && (
                <p>
                  {/*{transl.agencyErrorMessage?.value}*/}
                </p>
              )}
              <div>
                <InputCheckbox
                  checkRequired
                  name="terms"
                  value="terms"
                  label="I have read and agree to Frontify's Terms of Service, General Terms and Conditions and Privacy Policy."
                  validation={{ required: true }}
                  {...{ form }}
                />
                {errors?.terms && (
                  <p>
                    {/*{transl.termsErrorMessage?.value}*/}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={sending}
              >
                {sending ? (
                  <>
                    {/*{transl.SubmitButtonTextSubmitting?.value}*/}
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </>
                ) : (
                  <>
                      {/*<>{transl.SubmitButtonText?.value}</>*/}
                      Sign Up
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default Signup
