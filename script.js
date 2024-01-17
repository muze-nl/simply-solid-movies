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
      moviePickerApp.view.progress = {
        total: list.length,
        value: 0
      }
      for (let movie of list) {
        moviePickerApp.view.progress.value++
        await solidAPI.get(movie, store)
      }
      window.movieStore = store
    }
  }

})

window.moviePickerApp = moviePickerApp

window.editor.transformers.progress = {
  render: function(data) {
    this.value = data.value
    this.max = data.total
  },
  extract: function() {
    return {
      value: this.value,
      total: this.max
    }
  }
}