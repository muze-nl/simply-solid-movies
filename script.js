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
      console.log(data)
      moviePickerApp.view.folder = data
    }
  },
  view: {
    test: 'test',
    folder: {}
  }

})

window.moviePickerApp = moviePickerApp