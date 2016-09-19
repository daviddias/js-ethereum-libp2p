import {action, createRequestTypes} from './utils'

export const FEED = createRequestTypes('FEED')

export const feed = {
  request: () => action(FEED.REQUEST),
  success: (response) => action(FEED.SUCCESS, {response}),
  failure: (error) => action(FEED.FAILURE, {error})
}
