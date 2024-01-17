import solidAPI from './solid-api.js'

const simply = window.simply

const moviePickerApp = simply.app({
  view: {
    urls: []
  },
  commands: {
    'loadMovies': (form, values) => {
      return moviePickerApp.actions.loadMovies(values.url)
    }
  },
  actions: {
    loadMovies: async (url) => {
      let list = await solidAPI.list(url)
      window.folder = list
      let output = document.getElementById('response')
      let store = new solidAPI.Store
      let count = 0
      let total = list.length
      for (let movie of list) {
        count++
        output.value += `${count}/${total}: ${movie}\n`
        output.scrollTop = output.scrollHeight
        await solidAPI.get(movie, store)
      }
      window.movieStore = store
    }
  }

})

window.moviePickerApp = moviePickerApp