var libContext = require.context("./lib/", true, /Spec.js$/);
libContext.keys().forEach(libContext);

import FUHelpers from '../src/testUtils/ChaiAddons'

chai.use(FUHelpers)
