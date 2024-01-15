import solidAPI from './solid-api.js'

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
