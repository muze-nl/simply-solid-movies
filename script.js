import { getDefaultSession } from 'https://cdn.skypack.dev/pin/@inrupt/solid-client-authn-browser@v2.0.0-3Py1cpWfOrpxuIlTz5M2/dist=es2019,mode=imports/optimized/@inrupt/solid-client-authn-browser.js'
import { Parser } from 'https://cdn.skypack.dev/pin/n3@v1.12.0-JyCuQEtqH88WU0Kn0PZm/mode=imports,min/optimized/n3.js'

const simply = window.simply

const app = simply.app({
  commands: {
    'loadMovies': (el, value) => {
      alert('jay')
    }
  }
})

