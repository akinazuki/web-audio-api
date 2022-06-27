const assert = require('assert')
const AudioBuffer = require('../../src/AudioBuffer.js')
const {BLOCK_SIZE} = require('../../src/constants.js')
const EqualPowerPanner = require('../../src/PannerNode/EqualPowerPanner.js')
const initHelpers = require('../helpers.js')

let helpers = initHelpers({ approx : 0.01 })

describe('EqualPowerPanner', function() {

  var testBlockGain = function(block, gainL, gainR) {
    assert.equal(block.numberOfChannels, 2)
    assert.equal(block.length, BLOCK_SIZE)
    helpers.assertAllValuesApprox(block.getChannelData(0), gainL)
    helpers.assertAllValuesApprox(block.getChannelData(1), gainR)
  }

  describe('pan', function() {
    it('must not be used directly', function() {
      const inBuff  = AudioBuffer.filledWithVal(1, 2, BLOCK_SIZE, 44100)
      const outBuff = AudioBuffer.filledWithVal(1, 2, BLOCK_SIZE, 44100)

      const p = new EqualPowerPanner(44100)

      // front
      p.reset()
      p.pan(0, 0, inBuff, outBuff, BLOCK_SIZE)
      testBlockGain(outBuff, 1, 1)

      // left
      p.reset()
      p.pan(-90, 0, inBuff, outBuff, BLOCK_SIZE)
      testBlockGain(outBuff, 2, 0)

      // right
      p.reset()
      p.pan(90, 0, inBuff, outBuff, BLOCK_SIZE)
      testBlockGain(outBuff, 0, 2)

      // rear
      p.reset()
      p.pan(180, 0, inBuff, outBuff, BLOCK_SIZE)
      testBlockGain(outBuff, 1, 1)
    })
  })
})
