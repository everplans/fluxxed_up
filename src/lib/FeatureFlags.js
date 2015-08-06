class FeatureFlags {
  init(flags) {
    this.flags = {}
    flags.map((f)=> { this.flags[f.flag]= f.status })
  }

  isEnabled(flag) { return this.flags && this.flags[flag] ? String(this.flags[flag]).toUpperCase() === 'ENABLED' : false}
}

module.exports = new FeatureFlags() // specifically want a singleton
