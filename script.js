import solidAPI from './solid-api.js'

const simply = window.simply

const moviePickerApp = simply.app({
  commands: {
    'loadMovies': (form, values) => {
      return moviePickerApp.actions.loadMovies(values.url)
    }
  },
  actions: {
    loadMovies: async (url) => {
      let result = await solidAPI.fetch(url)
      document.getElementById('response').innerText = result
      let data = solidAPI.parse(url, result)
      window.folder = data
      for (let quad of data.match(url, "http://www.w3.org/ns/ldp#contains")) {
        console.log(quad)
      }
    }
  }

})

window.moviePickerApp = moviePickerApp