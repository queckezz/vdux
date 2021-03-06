/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import component from 'virtex-component'
import ephemeral from 'redux-ephemeral'
import string from 'virtex-string'
import local from 'virtex-local'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (middleware, reducer, initialState, app, ready = () => true) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(string, local('ui'), component, ...middleware)(createStore)(ephemeral('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create} = virtex(store.dispatch)

  /**
   * Render the VDOM tree
   */

  let tree = render()

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  return new Promise((resolve, reject) => {
    render()
    const unsub = store.subscribe(render)

    function render () {
      const state = store.getState()
      const html = create(app(state)).element

      if (ready(state)) {
        resolve(html)
        unsub()
      }
    }
  })
}

/**
 * Exports
 */

export default vdux
