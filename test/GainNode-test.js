const assert = require('assert')
const _ = require('underscore')
const AudioBuffer = require('../src/AudioBuffer.js')
const { BLOCK_SIZE } = require('../src/constants.js')
const GainNode = require('../src/GainNode.js')
const AudioNode = require('../src/AudioNode.js')
const initHelpers = require('./helpers.js')

const helpers = initHelpers()

describe('GainNode', function() {

  describe('_tick', function() {

    let dummyContext

    beforeEach(function() {
      dummyContext = {sampleRate: 44100, currentTime: 0, BLOCK_SIZE: BLOCK_SIZE}
    })

    it('should apply the gain to its input', function() {
      var gainNode = new GainNode(dummyContext)
        , sourceNode = new AudioNode(dummyContext, 0, 1)
        , block
      sourceNode.connect(gainNode)
      sourceNode._tick = function() {
        return AudioBuffer.filledWithVal(1, 2, BLOCK_SIZE, 44100)
      }

      // output = 1 * 1
      dummyContext.currentTime++
      block = gainNode._tick()
      assert.equal(block.numberOfChannels, 2)
      assert.equal(block.length, BLOCK_SIZE)
      helpers.assertAllValuesApprox(block.getChannelData(0), 1)
      helpers.assertAllValuesApprox(block.getChannelData(1), 1)

      // output = 1 * 0.2
      dummyContext.currentTime++
      gainNode.gain.value = 0.2
      block = gainNode._tick()
      assert.equal(block.numberOfChannels, 2)
      assert.equal(block.length, BLOCK_SIZE)
      helpers.assertAllValuesApprox(block.getChannelData(0), 0.2)
      helpers.assertAllValuesApprox(block.getChannelData(1), 0.2)

      // output = 0.5 * 0.3
      dummyContext.currentTime++
      sourceNode._tick = function() {
        return AudioBuffer.filledWithVal(0.5, 3, BLOCK_SIZE, 44100)
      }
      gainNode.gain.value = 0.3
      block = gainNode._tick()
      assert.equal(block.numberOfChannels, 3)
      assert.equal(block.length, BLOCK_SIZE)
      helpers.assertAllValuesApprox(block.getChannelData(0), 0.15)
      helpers.assertAllValuesApprox(block.getChannelData(1), 0.15)
      helpers.assertAllValuesApprox(block.getChannelData(2), 0.15)
    })

  })

})
