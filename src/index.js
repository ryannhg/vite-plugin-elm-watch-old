import path from 'node:path'
import fs from 'node:fs/promises'
import os from 'node:os'
import { exec } from 'node:child_process'

const fileRegex = /\.(elm)$/

let elmWatch

export default function myPlugin() {
  return {
    name: 'elm-land',
    buildStart() { console.log("BUILD START") },
    buildEnd(err) {
      if (elmWatch) {
        elmWatch.kill()
      }
    },
    handleHotUpdate() { return [] },
    async load(filepath) {
      if (fileRegex.test(filepath)) {
        return compileTheCurrentFile(filepath)
      }
    }
  }
}

// Used during development
const compileTheCurrentFile = async (filepath) => {
  let outputFilepath = await elmWatchHot({ filepath })

  let contents = await fs.readFile(outputFilepath, { encoding: 'utf-8' })
  return `export default ({ run () { ${contents} window.Elm = this.Elm; return window.Elm } }).run()`
}

let serverRunning = false

let startElmWatchHotServer = async ({ temp }) => {
  if (serverRunning === false) {
    let env = npxEnv()
    elmWatch = exec('elm-watch hot', { cwd: temp, env }, async (err, stdout, stderr) => {
      if (err) { console.error(stdout) }
    })
    serverRunning = true
  }
}

let elmWatchHot = async ({ filepath }) => {
  let temp = path.join(os.tmpdir())

  let elmWatchJsonFilepath = path.join(temp, 'elm-watch.json')
  let outputFilepath = path.join(temp, 'dist', 'out.js')

  let elmWatchJson = {
    targets: {
      Main: {
        inputs: [filepath],
        output: outputFilepath
      }
    }
  }

  await fs.writeFile(
    elmWatchJsonFilepath,
    JSON.stringify(elmWatchJson),
    { encoding: 'utf-8' }
  )

  startElmWatchHotServer({ temp })

  return outputFilepath
}

// 
// 💖 Thanks, Simon! (@lydell)
// 
// Some people install elm and elm-format locally instead of globally, using
// npm or the elm-tooling CLI. To run locally installed tools, they use `npx`.
//
// `npx` adds all potential `node_modules/.bin` up the current directory to the
// beginning of PATH, for example:
//
//     ❯ npx node -p 'process.env.PATH.split(path.delimiter)'
//     [
//       '/Users/you/stuff/node_modules/.bin',
//       '/Users/you/node_modules/.bin',
//       '/Users/node_modules/.bin',
//       '/node_modules/.bin',
//       '/usr/bin',
//       'etc'
//     ]
//
// This function also does that, so that local installations just work.
function npxEnv() {
  let cwd = process.cwd()
  return {
    ...process.env,
    PATH: [
      ...([cwd])
        .flatMap(folder =>
          folder.split(path.sep)
            .map((_, index, parts) =>
              [...parts.slice(0, index + 1), 'node_modules', '.bin'].join(path.sep)
            )
            .reverse()
        ),
      process.env.PATH
    ].join(path.delimiter)
  }
}