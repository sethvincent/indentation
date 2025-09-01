import { runtime } from 'which-runtime'

export function getArgv () {
  switch (runtime) {
    case 'bare': {
      return Bare.argv
    }

    case 'node': {
      return process.argv
    }
  }
}

export const argv = getArgv()
