'use strict'
module.exports = {
    fixNANs: x => Number.isFinite(x) ? x : 0,

    rad2deg: r => r * 180.0 / Math.PI,

    clampTo: (value, min, max) => Math.min(Math.max(min, value), max)
}