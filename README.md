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

Here are a few missing things to do before publishing this:

- [x] Page is refreshing when `Main.elm` is changed, we want it not to
- [x] Need to check for local installations of `elm-watch` and `elm` (to prevent global install step)
- [ ] Need to run `elm-watch make --optimize` in production (along with minification and optimization postprocess stuff?)
- [ ] I noticed the debugger/optimize toggling isn't working as expected, and requires a Vite server restart. Maybe there's a way to invalidate things so we send the new compiled elm-watch JS