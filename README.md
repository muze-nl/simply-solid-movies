# Solid Movie Picker

This glitch showcases a very basic Solid Application. Solid is a framework to build decentralized web applications, see https://solidproject.org/ for more information.

It also shows how to use [SimplyEdit](https://simplyedit.io/) and [SimplyView](https://reference.simplyedit.io/simplyview/) to create a web application.

The application assumes you have a Solid Data POD, and you have used [mediaKraken](https://noeldemartin.github.io/media-kraken/login) to create a folder with movies in your data pod.
mediaKraken is a web application that supports solid data pods. You can find the [source code on github](https://github.com/NoelDeMartin/media-kraken), and the author has also made [some talks about the development of the app](https://www.youtube.com/watch?app=desktop&v=cajBTJXmKhA).

So to use this glitch:

1. create a Solid Data POD, e.g. at [Inrupt.com](https://start.inrupt.com/profile)
2. start [mediaKraken](https://noeldemartin.github.io/media-kraken/login) and connect it to your pod
3. enter a few movies - keep it under 20 for performance reasons
4. click on a few of those to tag them as 'watched'
5. open your solid data pod and find the movies/ folder, copy its URL
6. load the glitch index.html and enter your movies url, press load movies.

Depending on how many movies you imported with mediaKraken, this can take a while.

Then this glitch application will select a random movie that you haven't watched.

## Structure of the application

1. index.html

This contains the skeleton HTML, and loads the required scripts. The `script.js` file contains the application code.

2. script.js

This creates an application (`simply.app()`) with `commands` and `actions`.
A command ties a user interface element (say a button or form) with code in the application. So here the HTML contains:

```
<form data-simply-command="loadMovies">
```

And in the application code, there is a command named `loadMovies`:

```
const moviePickerApp = simply.app({
  ...,
  commands: {
    loadMovies: async (form, values) => {
      ...
    }
  }
})
```

Now when you submit the form, the loadMovies command function is called. It then handles the form inputs.

3. solid-api.js

This is the low level code that allows the application to talk to solid pods and to parse linked data formats like turtle.

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people come together to build web apps and websites.

- Need more help? [Check out our Help Center](https://help.glitch.com/) for answers to any common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your app with private sharing, more storage and memory, domains and more.
