import solidAPI from './solid-api.js'

const simply = window.simply

const moviePicker = simply.app({
  commands: {
    'loadMovies': (form, values) => {
      return moviePicker.actions.loadMovies(values.url)
    }
  },
  actions: {
    loadMovies: async (url) => {
      let result = await solidAPI.fetch(url)
      document.getElementById('response').innerText = result
      let data = solidAPI.parse(url, result)
      console.log(data)
    }
  }
})
