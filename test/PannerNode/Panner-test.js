const assert = require('assert')
const Panner = require('../../src/PannerNode/Panner.js')

describe('Panner', function() {
  it('must not be used directly', function() {
    const p = new Panner()
    assert.throws(function() { p.pan() })
  })
})
