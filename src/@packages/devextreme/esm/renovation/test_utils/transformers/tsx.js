/**
 * DevExtreme (esm/renovation/test_utils/transformers/tsx.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
var fs = require("fs");
var tsJest = require("ts-jest");
var getCacheKey = require("./get_cache_key");
var THIS_FILE = fs.readFileSync(__filename);
var jestTransformer = tsJest.createTransformer();
var addCreateElementImport = src => "import React from 'react'; ".concat(src);
module.exports = {
    process: (src, filename, config) => jestTransformer.process(filename.indexOf("__tests__") > -1 ? src : addCreateElementImport(src), filename, config),
    getCacheKey: (fileData, filePath, configStr) => getCacheKey(fileData, filePath, configStr, THIS_FILE)
};
