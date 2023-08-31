# vite-plugin-elm-watch
> Use [Vite](https://vitejs.dev) with [elm-watch](https://lydell.github.io/elm-watch/)


## Try it out locally

```sh
# Temporary step, still tinkering around 👇
npm install -g elm elm-watch

# Run the project in "./example"
npm start
```

### 🚧 What's not working yet

- Page is refreshing when `Main.elm` is changed, we want it not to
- Need to check for local `elm-watch` and `elm` installations (to prevent global install step)
- Need to run `elm-watch make --optimize` in production, along with minification stuff