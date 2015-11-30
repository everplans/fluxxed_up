class FeatureFlags {
  init(flags) {
    this.flags = {}
    flags.map((flagObject) => { this.flags[flagObject.flag] = flagObject.status })
  }
  isEnabled(flagName) {
    return (this.flags && this.flags[flagName] ? String(this.flags[flagName]).toUpperCase() === 'ENABLED' : false)
  }
}

module.exports = new FeatureFlags() // specifically want a singleton
