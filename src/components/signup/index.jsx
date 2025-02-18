import axios from "axios"
import jsonpAdapter from "axios-jsonp"
import classNames from "classnames"
import Cookies from "js-cookie"
import jstz from "jstz"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import getResourceSet from "../../../utils/getResourceSet"
import InputCheckbox from "../../atoms/form/input-checkbox"
import InputRadio from "../../atoms/form/input-radio"
import InputSelect from "../../atoms/form/input-select"
import InputText from "../../atoms/form/input-text"
import Button from "../../button"
import Heading from "../../heading"
import agencies from "./agencies"
import companies from "./companies"
import countries from "./countries"

const Signup = () => {
  const transl = getResourceSet(`Signup`)

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

    if (!country) return `${transl.phonePlaceholder?.value} +41...`
    return `${transl.phonePlaceholder?.value} +${
      countries.find(e => e[0] === country)[1]
    }…`
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
    <div className="mt-12">
      <div className="pb-5 text-center">
        <Heading
          level={1}
          className="font-semibold text-[40px] md:text-[64px] leading-[40px] md:leading-[64px] tracking-tight"
        >
          {transl.pageHeading?.value}
        </Heading>

        <div className="mt-4 text-md">{transl.pageSubHeading?.value}</div>
      </div>
      <form onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          {plan && (
            <>
              <InputText
                name="firstName"
                validation={{ required: true }}
                {...{ form }}
                label={transl.firstNameLabel?.value}
                placeholder={transl.firstNamePlaceholder?.value}
              />

              <InputText
                name="lastName"
                validation={{ required: true }}
                {...{ form }}
                label={transl.lastNameLabel?.value}
                placeholder={transl.lastNamePlaceholder?.value}
              />

              <InputSelect
                name="country"
                validation={{ required: true }}
                {...{ form }}
                label={transl.countryLabel?.value}
                placeholder={transl.countryPlaceholder?.value}
                options={countries.map(country => ({
                  value: country[0],
                  label: country[0],
                }))}
              />

              <InputText
                name="phone"
                validation={{ minLength: 7, maxLength: 20 }}
                {...{ form }}
                label={transl.phoneLabel?.value}
                placeholder={getPhonePlaceholder()}
                type="tel"
              />

              <div className="relative">
                <InputText
                  name="email"
                  validation={{ required: true }}
                  {...{ form }}
                  label={transl.emailLabel?.value}
                  type="email"
                  placeholder={transl.emailPlaceholder?.value}
                />
                {errors?.email?.type === `emailInUse` && (
                  <p
                    className="absolute bottom-0 text-xxs text-brightred"
                    dangerouslySetInnerHTML={{
                      __html:
                        transl.emailInUseErrorMessage?.markdown
                          ?.childMarkdownRemark?.html,
                    }}
                    style={{ transform: `translateY(105%)` }}
                  />
                )}
              </div>

              <InputText
                name="password"
                validation={{ required: true }}
                {...{ form }}
                label={transl.passwordLabel?.value}
                type="password"
                placeholder={transl.passwordPlaceholder?.value}
              />
            </>
          )}
        </div>
        {plan && (
          <>
            <div className="mt-5 mb-2">{transl.agencyLabel?.value}*</div>
            <div>
              <div className="flex gap-4">
                <InputRadio
                  className="mb-5"
                  name="agency_identification"
                  label={transl.yesRadioLabel?.value}
                  value="Yes"
                  validation={{ required: true }}
                  {...{ form }}
                  checked={selectedRadioOption === `Yes`}
                  onChange={() => handleOptionChange(`Yes`)}
                />
                <InputRadio
                  name="agency_identification"
                  label={transl.noRadioLabel?.value}
                  value="No"
                  validation={{ required: true }}
                  {...{ form }}
                  checked={selectedRadioOption === `No`}
                  onChange={() => handleOptionChange(`No`)}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                {selectedRadioOption === `Yes` && (
                  <InputSelect
                    name="agency_size"
                    validation={{ required: true }}
                    {...{ form }}
                    label={transl.agencyYesLabel?.value}
                    placeholder={transl.agencySizePlaceholder?.value}
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
                    label={transl.agencyNoLabel?.value}
                    placeholder={transl.companySizePlaceholder?.value}
                    options={companies.map(company => ({
                      value: company[0],
                      label: company[0],
                    }))}
                  />
                )}
              </div>

              {errors?.agency_identification && (
                <p className="mt-1 text-xs text-brightred">
                  {transl.agencyErrorMessage?.value}
                </p>
              )}
            </div>
            <div className="relative pb-3 my-5">
              <div className="absolute">
                <InputCheckbox
                  checkRequired
                  name="terms"
                  value="terms"
                  validation={{ required: true }}
                  {...{ form }}
                />
              </div>
              <div
                className="ml-5"
                dangerouslySetInnerHTML={{
                  __html: transl?.terms?.markdown?.childMarkdownRemark?.html,
                }}
              />

              {errors?.terms && (
                <p className="mt-1 text-xs text-brightred">
                  {transl.termsErrorMessage?.value}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className={classNames(
                `block md:inline-block text-center bg-charcoal hover:bg-superdark shadow-button rounded-lg text-white text-xs lg:text-sm px-5 py-2 transition duration-500`,
                sending && `sending`
              )}
              disabled={sending}
            >
              {sending ? (
                <>
                  {transl.SubmitButtonTextSubmitting?.value}
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </>
              ) : (
                <>{transl.SubmitButtonText?.value}</>
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}

export default Signup
