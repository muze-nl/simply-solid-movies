import { getDefaultSession } from 'https://cdn.skypack.dev/pin/@inrupt/solid-client-authn-browser@v2.0.0-3Py1cpWfOrpxuIlTz5M2/dist=es2019,mode=imports/optimized/@inrupt/solid-client-authn-browser.js'
import { Parser } from 'https://cdn.skypack.dev/pin/n3@v1.12.0-JyCuQEtqH88WU0Kn0PZm/mode=imports,min/optimized/n3.js'

const simply = window.simply

const app = simply.app({
  commands: {
    'loadMovies': (el, value) => {
      return this.app.actions.loadMovies(value)
    }
  },
  actions: {
    loadMovies: async (url) => {
      
    }
  }
})

const solidApi = {
  fetch: (url, loginInfo) {
    let cleanURL = new URL(url)
    cleanURL.hash = ''
    cleanURL = cleanURL.href

    let result = null
    try {
      result = await publicFetch(cleanURL)      
    } catch(err) {
      try {
        result = await solidFetch(cleanURL)
      } catch(err) {
        alert(err)
        return
      }
    }

    let parser = new Parser({blankNodePrefix: '', baseIRI: cleanURL })
    let prefixes = {}
    let data = parser.parse()
  }
}

const publicFetch = async (url, params={}) => {
  params = Object.assign({
    mode: 'cors',
    headers: {
      'Accept': 'application/*'
    }
  }, params)
  let response = await fetch(url, params)
  if (response.ok) {
    return response.text()
  } else {
    throw new Error(response.status+': '+reponse.statusText)
  }
}