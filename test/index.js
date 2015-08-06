var libContext = require.context("./lib/", true, /Spec.js$/);
libContext.keys().forEach(libContext);