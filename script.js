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
      let list = await solidAPI.list(url)
      window.folder = list
      document.getElementById('response').innerHTML = list.join(', ')
    }
  }

})

window.moviePickerApp = moviePickerApp