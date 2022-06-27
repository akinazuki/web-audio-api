'use strict'
const DistanceModelType = {
  inverse     : 'inverse',
  linear      : 'linear',
  exponential : 'exponential',
}

/**
 * Computes distance effect gain and manages related properties.
 */
class DistanceEffect {

  constructor() {
    this._model         = DistanceModelType.inverse
    this._isClamped     = true
    this._refDistance   = 1.0
    this._maxDistance   = 10000.0
    this._rolloffFactor = 1.0
  }

  get model() { return this._model }

  /**
   * @param {DistanceModelType} model
   * @param {boolean} clampled
   */
  setModel(model, clamped) {
    if (!DistanceModelType[model]) {
      throw new Error('Invalid DistanceModelType')
    }
    this._model     = model
    this._isClamped = clamped
  }

  get refDistance() { return this._refDistance }
  set refDistance(refDistance) {
    if (!Number.isFinite(refDistance)) {
      throw new Error('Invalid refDistance')
    }
    this._refDistance = refDistance
  }

  get maxDistance() { return this._maxDistance }
  set maxDistance(maxDistance) {
    if (!Number.isFinite(maxDistance)) {
      throw new Error('Invalid maxDistance')
    }
    this._maxDistance = maxDistance
  }

  get rolloffFactor() { return this._rolloffFactor }
  set rolloffFactor(rolloffFactor) {
    if (!Number.isFinite(rolloffFactor)) {
      throw new Error('Invalid rolloffFactor')
    }
    this._rolloffFactor = rolloffFactor
  }

  /**
   * @param {number}
   * @return {number}
   */
  gain(distance) {
    // don't go beyond maximum distance
    distance = Math.min(distance, this._maxDistance)

    // if clamped, don't get closer than reference distance
    if (this._isClamped) {
      distance = Math.max(distance, this._refDistance)
    }

    switch (this._model) {
    case DistanceModelType.linear:
      return this.linearGain(distance)
    case DistanceModelType.inverse:
      return this.inverseGain(distance)
    case DistanceModelType.exponential:
      return this.exponentialGain(distance)
    default:
      throw new TypeError('Invalid distance model', this._model)
    }
  }

  /**
   * @param {number}
   * @return {number}
   */
  linearGain(distance) {
    return (1.0 - this._rolloffFactor * (distance - this._refDistance) / (this._maxDistance - this._refDistance))
  }

  /**
   * @param {number}
   * @return {number}
   */
  inverseGain(distance) {
    return this._refDistance / (this._refDistance + this._rolloffFactor * (distance - this._refDistance))
  }

  /**
   * @param {number}
   * @return {number}
   */
  exponentialGain(distance) {
    return Math.pow(distance / this._refDistance, -this._rolloffFactor)
  }

}

module.exports = DistanceEffect
