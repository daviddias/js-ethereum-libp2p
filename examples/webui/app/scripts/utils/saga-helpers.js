import {take, call, cancelled} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'

export function events (name, emitter) {
  let handler

  return eventChannel((listener) => {
    handler = (channel) => {
      listener(channel)
    }
    emitter.on(name, handler)

    return () => {
      emitter.removeListener(name, handler)
    }
  })
}

export function * handleEvent (chan, handler) {
  try {
    while (true) {
      yield take(chan)
      yield call(handler)
    }
  } finally {
    if (yield cancelled()) {
      chan.close()
    }
  }
}
