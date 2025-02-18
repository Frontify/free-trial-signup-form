import { graphql, useStaticQuery } from "gatsby"
import { useSelector } from "react-redux"

/*
 *  Return a ResourceSet with all Resource and their children as an object
 */

const getResourceSet = name => {
  const current_locale = useSelector(state => state.app.locale.current)
  const data = useStaticQuery(query)

  const split = e => {
    if (e.value && e.value.value) {
      return { value: e.value.value, markdown: e.markdown }
    } else if (e.content) {
      //recursion for the win
      var obj = {}
      e.content.forEach(x => {
        if (x.__typename === `ContentfulMedia`) {
          if (obj[`content`]) {
            obj[`content`].push(x)
          } else {
            obj[`content`] = [x]
          }
          obj[x.contentfulTitle] = [x]
        } else {
          obj[x.key] = split(x)
        }
      })
      return obj
    } else return `Error: no value and no content set`
  }

  const resourceSet = data.allContentfulResourceSet.edges
    .map(e => e.node)
    .filter(e => e.node_locale === current_locale)
    .filter(e => e.name === name)[0]

  if (resourceSet) {
    var obj = {}
    resourceSet.resources.forEach(e => {
      obj[e.key] = split(e)
    })
    return obj
  } else {
    //eslint-disable-next-line
    console.error(
      `ResourceSet "${name}" not found. Make sure it exists in contentful and is published`
    )
    return null
  }
}

export default getResourceSet

const query = graphql`
  {
    allContentfulResourceSet {
      edges {
        node {
          name
          node_locale
          resources {
            key
            value {
              value
            }
            markdown: value {
              childMarkdownRemark {
                html
              }
            }
            content {
              __typename
              ... on Node {
                ... on ContentfulResource {
                  key
                  value {
                    value
                  }
                  markdown: value {
                    childMarkdownRemark {
                      html
                    }
                  }
                  content {
                    __typename
                    ... on Node {
                      ... on ContentfulResource {
                        key
                        value {
                          value
                        }
                        markdown: value {
                          childMarkdownRemark {
                            html
                          }
                        }
                        content {
                          __typename
                          ... on Node {
                            ... on ContentfulResource {
                              key
                              value {
                                value
                              }
                              markdown: value {
                                childMarkdownRemark {
                                  html
                                }
                              }
                              content {
                                __typename
                                ... on Node {
                                  ... on ContentfulResource {
                                    key
                                    value {
                                      value
                                    }
                                    markdown: value {
                                      childMarkdownRemark {
                                        html
                                      }
                                    }
                                    content {
                                      __typename
                                      ... on Node {
                                        ... on ContentfulResource {
                                          key
                                          value {
                                            value
                                          }
                                          markdown: value {
                                            childMarkdownRemark {
                                              html
                                            }
                                          }
                                        }
                                        ... on ContentfulMedia {
                                          contentfulTitle
                                          ...contentfulMediaFragment
                                        }
                                      }
                                    }
                                  }
                                  ... on ContentfulMedia {
                                    contentfulTitle
                                    ...contentfulMediaFragment
                                  }
                                }
                              }
                            }
                            ... on ContentfulMedia {
                              contentfulTitle
                              ...contentfulMediaFragment
                            }
                          }
                        }
                      }
                      ... on ContentfulMedia {
                        contentfulTitle
                        ...contentfulMediaFragment
                      }
                    }
                  }
                }
                ... on ContentfulMedia {
                  contentfulTitle
                  ...contentfulMediaFragment
                }
              }
            }
          }
        }
      }
    }
  }
`
