var libContext = require.context("./lib/", true, /Spec.js$/);
libContext.keys().forEach(libContext);

import FUHelpers from './support/SinonAddons'

chai.use(FUHelpers)