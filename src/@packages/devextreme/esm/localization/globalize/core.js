/**
 * DevExtreme (esm/localization/globalize/core.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Globalize from "globalize";
import coreLocalization from "../core";
if (Globalize && Globalize.load) {
    var likelySubtags = {
        supplemental: {
            version: {
                _cldrVersion: "28",
                _unicodeVersion: "8.0.0",
                _number: "$Revision: 11965 $"
            },
            likelySubtags: {
                en: "en-Latn-US",
                de: "de-Latn-DE",
                ru: "ru-Cyrl-RU",
                ja: "ja-Jpan-JP"
            }
        }
    };
    if (!Globalize.locale()) {
        Globalize.load(likelySubtags);
        Globalize.locale("en")
    }
    coreLocalization.inject({
        locale: function(_locale) {
            if (!_locale) {
                return Globalize.locale().locale
            }
            Globalize.locale(_locale)
        }
    })
}
