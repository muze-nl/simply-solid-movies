import { getDefaultSession } from 'https://cdn.skypack.dev/pin/@inrupt/solid-client-authn-browser@v2.0.0-3Py1cpWfOrpxuIlTz5M2/dist=es2019,mode=imports/optimized/@inrupt/solid-client-authn-browser.js'
import { Store, Parser } from 'https://cdn.skypack.dev/pin/n3@v1.12.0-JyCuQEtqH88WU0Kn0PZm/mode=imports,min/optimized/n3.js'

const solidAPI = {
  getCleanURL: (url) => {
    let cleanURL = new URL(url)
    cleanURL.hash = ''
    return cleanURL.href
  },
  fetch: async (url, loginInfo) => {
    let cleanURL = solidAPI.getCleanURL(url)

    let result = null
    try {
      result = await publicFetch(cleanURL)      
    } catch(err) {
      result = await solidFetch(cleanURL)
    }
    return result
  },
  parse: (url, text) => {
    let cleanURL = solidAPI.getCleanURL(url)

    let parser = new Parser({blankNodePrefix: '', baseIRI: cleanURL })
    let prefixes = {}
    let data = parser.parse(text, null, (prefix, url) => {
      prefixes[prefix] = url.id
    })
    return new Store(data)
    // return {
    //   data, prefixes
    // }
  },
  list: async (url) => {
    let turtle = await solidAPI.fetch(url)
    let data = solidAPI.parse(url, turtle)
    let result = []
    for (let quad of data.match(url, "http://www.w3.org/ns/ldp#contains")) {
      result.push(quad.object.id)
    }
    return result
  }
}

const publicFetch = async (url, params={}) => {
  params = Object.assign({
    mode: 'cors',
    headers: {
      'Accept': 'text/turtle'
    }
  }, params)
  let response = await fetch(url, params)
  if (response.ok) {
    return response.text()
  } else {
    throw new Error(response.status+': '+response.statusText)
  }
}

const solidSession = getDefaultSession()

const solidFetch = async (url, params={}) => {
  params = Object.assign({
    mode: 'cors',
    headers: {
      'Accept': 'text/turtle'
    }
  }, params)
  let response = await solidSession.fetch(url, params)  
  if (response.ok) {
    return response.text()
  } else {
    throw new Error(response.status+': '+response.statusText)
  }
}

export default solidAPI