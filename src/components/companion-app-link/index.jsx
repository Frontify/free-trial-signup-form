import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

const CompanionAppLink = props => {
  const { to, children, ...other } = props

  const apiEndpoint = `https://api.github.com/repos/frontify/frontify-companion-release/releases/latest`

  const [link, setLink] = useState(
    `https://github.com/Frontify/frontify-companion-release/releases/latest`
  )

  const getReleaseLink = os => {
    fetch(apiEndpoint)
      .then(res => res.json())
      .then(data => {
        const url = data.assets.find(e =>
          e.browser_download_url.endsWith(os)
        ).browser_download_url
        url && setLink(url)
      })
  }

  useEffect(() => {
    if (to === `frontify-for-desktop-github-osx`) {
      getReleaseLink(`.dmg`)
    } else if (to === `frontify-for-desktop-github-windows`) {
      getReleaseLink(`.exe`)
    } else {
      if (navigator.appVersion.indexOf(`Win`) != -1) getReleaseLink(`.exe`)
      if (navigator.appVersion.indexOf(`Mac`) != -1) getReleaseLink(`.dmg`)
    }
  }, [])

  return (
    <>
      <a href={link} {...other}>
        {children}
      </a>
    </>
  )
}

CompanionAppLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any,
}

export default CompanionAppLink
