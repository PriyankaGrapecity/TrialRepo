(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["Globalize"], factory);
	else if(typeof exports === 'object')
		exports["Formatter"] = factory(require(undefined));
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["Formatter"] = factory(root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["Globalize"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
	    var formatter = __webpack_require__(1);
	    var GeneralFormatter = formatter.GeneralFormatter;
	    function ExcelFormatter(format, formatMode, cultureName){
	        this._gFormatter = new GeneralFormatter(format, formatMode, cultureName);
	    };
	    ExcelFormatter.prototype = {
	        format: function(obj, conditionalForeColor){
	            return this._gFormatter.Format(obj, conditionalForeColor);
	        },
	
	        formatMode: function(value){
	            return this._gFormatter.FormatMode(value);
	        },
	
	        formatString : function(value){
	            return this._gFormatter.formatString(value);
	        },
	
	        dateTimeFormatInfo: function(value){
	            return this._gFormatter.DateTimeFormatInfo(value);
	        },
	
	        numberFormatInfo: function(value){
	            return this._gFormatter.NumberFormatInfo(value);
	        }
	    };
	
	    module.exports = {
	        ExcelFormatter: ExcelFormatter,
	        FormatMode: formatter.FormatMode
	    };
	}());


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	*
	* SpreadJS Library 1.0.0
	* http://wijmo.com/
	*
	* Copyright(c) GrapeCity, Inc.  All rights reserved.
	*
	* Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
	* licensing@wijmo.com
	* http://wijmo.com/widgets/license/
	*
	*
	**/
	
	(function () {
	    // migrate from spreadjs formatter, too many warnings, in order to keep less difference with spread so first ignore jshint
	    /* jshint ignore:start */
	
	    'use strict';
	    var formatterUtils = __webpack_require__(3);
	    var globalize = __webpack_require__(2);
	    var formatter = {};
	    module.exports = formatter;
	
	    var __extends = function (d, b) {
	            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	            function __() {
	                this.constructor = d;
	            }
	
	            __.prototype = b.prototype;
	            d.prototype = new __();
	        };
	
	    var keyword_null = null, keyword_undefined = undefined, Math_abs = Math.abs, Math_ceil = Math.ceil, Math_pow = Math.pow, Math_floor = Math.floor, Math_max = Math.max, Math_min = Math.min, Math_round = Math.round;
	
	    //<editor-fold desc="For .NET">
	    var stringEx = {
	        Empty: "",
	        Format: function () {
	            var args = [];
	            for (var _i = 0; _i < (arguments.length - 0); _i++) {
	                args[_i] = arguments[_i + 0];
	            }
	            if (arguments.length === 0) {
	                return keyword_null;
	            }
	
	            var str = args[0];
	            for (var i = 1; i < arguments.length; i++) {
	                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
	                str = str.replace(re, arguments[i]);
	            }
	            return str;
	        },
	        IsNullOrEmpty: function (obj) {
	            return !obj || obj === stringEx.Empty;
	        }
	    };
	
	    var DateTimeStyles;
	    (function (DateTimeStyles) {
	        DateTimeStyles[DateTimeStyles["None"] = 0] = "None";
	        DateTimeStyles[DateTimeStyles["AllowLeadingWhite"] = 1] = "AllowLeadingWhite";
	        DateTimeStyles[DateTimeStyles["AllowTrailingWhite"] = 2] = "AllowTrailingWhite";
	        DateTimeStyles[DateTimeStyles["AllowInnerWhite"] = 4] = "AllowInnerWhite";
	        DateTimeStyles[DateTimeStyles["AllowWhiteSpaces"] = 7] = "AllowWhiteSpaces";
	        DateTimeStyles[DateTimeStyles["NoCurrentDateDefault"] = 8] = "NoCurrentDateDefault";
	        DateTimeStyles[DateTimeStyles["AdjustToUniversal"] = 16] = "AdjustToUniversal";
	        DateTimeStyles[DateTimeStyles["AssumeLocal"] = 32] = "AssumeLocal";
	        DateTimeStyles[DateTimeStyles["AssumeUniversal"] = 64] = "AssumeUniversal";
	        DateTimeStyles[DateTimeStyles["RoundtripKind"] = 128] = "RoundtripKind";
	    })(formatter.DateTimeStyles || (formatter.DateTimeStyles = {}));
	
	    var char = {
	        IsDigit: function (c) {
	            var cc = c.charCodeAt(0);
	            return cc >= 0x30 && cc <= 0x39;
	        },
	        IsWhiteSpace: function (c) {
	            var cc = c.charCodeAt(0);
	            return (cc >= 0x0009 && cc <= 0x000D) || (cc === 0x0020) || (cc === 0x0085) || (cc === 0x00A0);
	        }
	    };
	
	    //</editor-folder>
	    //<editor-fold desc="Enum">
	    /**
	     * Represents the format mode.
	     * @enum {number}
	     */
	    (function (FormatMode) {
	        /** Indicates whether to format the value with the Excel-compatible format string.*/
	        FormatMode[FormatMode["CustomMode"] = 0] = "CustomMode";
	
	        /** Indicates whether to format the value with the standard date-time format.*/
	        FormatMode[FormatMode["StandardDateTimeMode"] = 1] = "StandardDateTimeMode";
	
	        /** Indicates whether to format the value with the standard numeric format.*/
	        FormatMode[FormatMode["StandardNumericMode"] = 2] = "StandardNumericMode";
	    })(formatter.FormatMode || (formatter.FormatMode = {}));
	    var FormatMode = formatter.FormatMode;
	
	    /**
	     * Represents the number format type.
	     * @enum {number}
	     */
	    (function (NumberFormatType) {
	        /** Formats the data using the general formatter.*/
	        NumberFormatType[NumberFormatType["General"] = 0] = "General";
	
	        /** Formats the data using the number formatter.*/
	        NumberFormatType[NumberFormatType["Number"] = 1] = "Number";
	
	        /** Formats the data using the date-time formatter.*/
	        NumberFormatType[NumberFormatType["DateTime"] = 2] = "DateTime";
	
	        /** Formats the data using the text formatter.*/
	        NumberFormatType[NumberFormatType["Text"] = 3] = "Text";
	    })(formatter.NumberFormatType || (formatter.NumberFormatType = {}));
	    var NumberFormatType = formatter.NumberFormatType;
	
	    var TimePart;
	    (function (TimePart) {
	        TimePart[TimePart["Hour"] = 0] = "Hour";
	        TimePart[TimePart["Minute"] = 1] = "Minute";
	        TimePart[TimePart["Second"] = 2] = "Second";
	    })(TimePart || (TimePart = {}));
	
	    var DefaultTokens = (function () {
	         function DefaultTokens() {
	        }
	
	        DefaultTokens.DateTimeFormatInfo = function () {
	            return globalize.Cultures._CultureInfo._currentCulture.DateTimeFormat();
	        };
	
	        DefaultTokens.NumberFormatInfo = function () {
	            return globalize.Cultures._CultureInfo._currentCulture.NumberFormat();
	        };
	
	        DefaultTokens.Filter = function (s, bracketsStart, bracketsEnd) {
	            if (s === keyword_undefined || s === keyword_null || s === "") {
	                return s;
	            }
	            var sb = "";
	            var refCount = 0;
	            for (var n = 0; n < s.length; n++) {
	                var c = s[n];
	                if (c === bracketsStart) {
	                    refCount++;
	                } else if (c === bracketsEnd) {
	                    refCount--;
	                    if (refCount < 0) {
	                        refCount = 0;
	                    }
	                } else if (refCount === 0) {
	                    sb += c;
	                }
	            }
	
	            return sb.toString();
	        };
	
	        DefaultTokens.TrimSquareBracket = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return token;
	            }
	
	            if (token[0] === DefaultTokens.LeftSquareBracket) {
	                token = formatterUtils.StringHelper.TrimStart(token, DefaultTokens.LeftSquareBracket);
	            }
	
	            if (token[token.length - 1] === DefaultTokens.RightSquareBracket) {
	                token = formatterUtils.StringHelper.TrimEnd(token, DefaultTokens.RightSquareBracket);
	            }
	
	            return token;
	        };
	
	        DefaultTokens.IsOperator = function (c) {
	            return (c === DefaultTokens.LessThanSign || c === DefaultTokens.GreaterThanSign || c === DefaultTokens.EqualsThanSign);
	        };
	
	        DefaultTokens.TrimEscape = function (token) {
	            var len = token.length;
	            var inEscape = false;
	            var sb = "";
	            for (var n = 0; n < len; n++) {
	                var c = token.charAt(n);
	                if (c === DefaultTokens.ReverseSolidusSign) {
	                    inEscape = !inEscape;
	                    if (!inEscape) {
	                        sb += c;
	                    }
	                } else {
	                    inEscape = false;
	                    sb += c;
	                }
	            }
	            return sb;
	        };
	
	        DefaultTokens.AddSquareBracket = function (token) {
	            if (!token) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIsNull);
	            }
	
	            if (token.length === 0 || token[0] !== DefaultTokens.LeftSquareBracket) {
	                token = formatterUtils.StringHelper.Insert(token, 0, DefaultTokens.LeftSquareBracket.toString());
	            }
	
	            if (token.length === 0 || token[token.length - 1] !== DefaultTokens.RightSquareBracket) {
	                token = formatterUtils.StringHelper.Insert(token, token.length, DefaultTokens.RightSquareBracket.toString());
	            }
	
	            return token;
	        };
	
	        DefaultTokens.IsEquals = function (a, b, isIgnoreCase) {
	            if (!a && !b) {
	                return true;
	            } else if (!a || !b) {
	                return false;
	            } else if (isIgnoreCase) {
	                return a.toLowerCase() === b.toLowerCase();
	            } else {
	                return a === b;
	            }
	        };
	
	        DefaultTokens.ReplaceKeyword = function (s, oldString, newString) {
	            if (!s || s === stringEx.Empty || this.IsEquals(oldString, newString, true)) {
	                return s;
	            }
	
	            var strTemp = s;
	            var start = 0;
	            while (true) {
	                var index = formatterUtils.StringHelper.IndexOf(strTemp, oldString, 1 /* CurrentCultureIgnoreCase */);
	                if (index > -1) {
	                    strTemp = formatterUtils.StringHelper.Remove(strTemp, index, oldString.length);
	                    strTemp = formatterUtils.StringHelper.Insert(strTemp, index, newString);
	                    start = index + newString.length;
	                } else {
	                    break;
	                }
	            }
	
	            return strTemp;
	        };
	
	        DefaultTokens.IsDecimal = function (s, numberFormatInfo) {
	            var decimalSeparator = DefaultTokens.DecimalSeparator;
	
	            //if (numberFormatInfo) {
	            //    decimalSeparator = numberFormatInfo.numberDecimalSeparator;
	            //}
	            return (s.indexOf(decimalSeparator) > -1);
	        };
	        DefaultTokens.DoubleQuote = '\"';
	        DefaultTokens.SingleQuote = '\'';
	        DefaultTokens.Tab = '\t';
	        DefaultTokens.LeftSquareBracket = '[';
	        DefaultTokens.RightSquareBracket = ']';
	        DefaultTokens.LessThanSign = '<';
	        DefaultTokens.GreaterThanSign = '>';
	        DefaultTokens.EqualsThanSign = '=';
	        DefaultTokens.PlusSign = '+';
	        DefaultTokens.HyphenMinus = '-';
	        DefaultTokens.UnderLine = '_';
	        DefaultTokens.LeftParenthesis = '(';
	        DefaultTokens.RightParenthesis = ')';
	        DefaultTokens.Dollar = '$';
	        DefaultTokens.Comma = ';';
	
	        DefaultTokens.Space = ' ';
	        DefaultTokens.SolidusSign = '/';
	        DefaultTokens.ReverseSolidusSign = '\\';
	        DefaultTokens.Zero = '0';
	        DefaultTokens.QuestionMark = '?';
	        DefaultTokens.Colon = ':';
	        DefaultTokens.Semicolon = ';';
	        DefaultTokens.Sharp = '#';
	        DefaultTokens.CommercialAt = '@';
	        DefaultTokens.NumberSign = '#';
	        DefaultTokens.Asterisk = '*';
	
	        DefaultTokens.Exponential1 = "E+";
	        DefaultTokens.Exponential2 = "E-";
	        DefaultTokens.DecimalSeparator = ".";
	        DefaultTokens.numberGroupSeparator = ",";
	        DefaultTokens.percentSymbol = "%";
	        DefaultTokens.nanSymbol = "NaN";
	        DefaultTokens.FormatSeparator = ";";
	        DefaultTokens.negativeSign = "-";
	        DefaultTokens.ReplacePlaceholder = "@";
	        DefaultTokens.ExponentialSymbol = "E";
	        return DefaultTokens;
	    })();
	    formatter.DefaultTokens = DefaultTokens;
	
	    //</editor-fold>
	    //<editor-fold desc="NumberFormatBase">
	    var NumberFormatBase = (function () {
	        function NumberFormatBase(partLocaleID, dbNumberFormatPart, cultureName) {
	            var self = this;
	            self._classNames = ["NumberFormatBase", "IFormatter", "IFormatProviderSupport"];
	            self.numberFormatInfo = keyword_null;
	            self.dateTimeFormatInfo = keyword_null;
	            self.cultureName = "";
	            self._initFileds();
	            self.partLocaleID = partLocaleID;
	            self.partDbNumberFormat = dbNumberFormatPart;
	            if (!cultureName) {
	                self.cultureName = globalize.Cultures._CultureInfo._currentCulture.Name();
	            } else {
	                self.cultureName = cultureName;
	            }
	        }
	
	        var nfPrototype = NumberFormatBase.prototype;
	        nfPrototype._initFileds = function () {
	            var self = this;
	            self.numberStringConverter = keyword_null;
	            self.numberFormatInfo = keyword_null;
	            self.dateTimeFormatInfo = keyword_null;
	            self.partLocaleID = keyword_null;
	            self.partDbNumberFormat = keyword_null;
	        };
	
	        //NumberFormatBase Public Properties
	        nfPrototype.NumberStringConverter = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.numberStringConverter) {
	                    return self.numberStringConverter;
	                }
	
	                return keyword_null;
	            } else {
	                //Set
	                self.numberStringConverter = value;
	                return value;
	            }
	        };
	
	        nfPrototype.PartLocaleID = function () {
	            return formatterUtils.util.asCustomType(this.partLocaleID, "LocaleIDFormatPart");
	        };
	
	        nfPrototype.PartDBNumberFormat = function () {
	            return formatterUtils.util.asCustomType(this.partDbNumberFormat, "DBNumberFormatPart");
	        };
	
	        nfPrototype.DateTimeFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.dateTimeFormatInfo;
	            } else {
	                //Set
	                self.dateTimeFormatInfo = value;
	                return value;
	            }
	        };
	
	        nfPrototype.NumberFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.numberFormatInfo;
	            } else {
	                //Set
	                self.numberFormatInfo = value;
	                return value;
	            }
	        };
	
	        nfPrototype.CultureName = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                return self.partLocaleID ? self.partLocaleID.CultureInfo().Name() : self.cultureName;
	            } else {
	                self.cultureName = value;
	                return value;
	            }
	        };
	
	        //NumberFormatBase Protected Properties
	        nfPrototype.numberGroupSeparator = function () {
	            var self = this;
	            if (self.NumberFormatInfo()) {
	                return self.NumberFormatInfo().numberGroupSeparator;
	            }
	
	            return DefaultTokens.numberGroupSeparator;
	        };
	
	        nfPrototype.PercentSymbol = function () {
	            var self = this;
	            if (self.NumberFormatInfo()) {
	                return self.NumberFormatInfo().percentSymbol;
	            }
	
	            return DefaultTokens.percentSymbol;
	        };
	
	        nfPrototype.PositiveSign = function () {
	            var self = this;
	            if (self.NumberFormatInfo()) {
	                return self.NumberFormatInfo().positiveSign;
	            }
	
	            return DefaultTokens.NumberFormatInfo().positiveSign;
	        };
	
	        nfPrototype.NegativeSign = function () {
	            var self = this;
	            if (self.NumberFormatInfo()) {
	                return self.NumberFormatInfo().negativeSign;
	            }
	
	            return DefaultTokens.negativeSign;
	        };
	
	        nfPrototype.DecimalSeparator = function () {
	            //if (this.NumberFormatInfo()) {
	            //    return this.NumberFormatInfo().numberDecimalSeparator;
	            //}
	            return DefaultTokens.DecimalSeparator;
	        };
	
	        nfPrototype.NaNSymbol = function () {
	            if (this.NumberFormatInfo()) {
	                return this.NumberFormatInfo().nanSymbol;
	            }
	
	            return DefaultTokens.nanSymbol;
	        };
	
	        NumberFormatBase.TrimNotSupportSymbol = function (format, isSupportFraction) {
	            if (arguments.length === 1) {
	                isSupportFraction = true;
	            }
	
	            var inComments = false;
	            var sb = "";
	            for (var n = 0; n < format.length; n++) {
	                var c = format[n];
	                var append = true;
	                if (c === '\"') {
	                    inComments = !inComments;
	                } else {
	                    if (!inComments) {
	                        if (!isSupportFraction) {
	                            if (c === '?') {
	                                if (!NumberFormatBase.IsTransform(format, n)) {
	                                    append = false;
	                                }
	                            }
	
	                            if (c === '/') {
	                                if (!NumberFormatBase.IsTransform(format, n)) {
	                                    append = false;
	                                }
	                            }
	                        }
	                        if (c === '_') {
	                            if (!NumberFormatBase.IsTransform(format, n)) {
	                                append = false;
	                                n++;
	                            }
	                        } else if (c === '*') {
	                            if (!NumberFormatBase.IsTransform(format, n)) {
	                                append = false;
	                            }
	                        }
	                    }
	                }
	
	                if (append) {
	                    sb += c;
	                }
	            }
	
	            return sb;
	        };
	
	        NumberFormatBase.IsTransform = function (str, currentpos) {
	            if (str[currentpos] === '\\') {
	                throw new Error(globalize.StringResoures.SR.Exp_InvalidBackslash);
	            }
	
	            if (currentpos - 1 > 0 && currentpos - 1 < str.length) {
	                if (str[currentpos - 1] === '\\') {
	                    if (currentpos - 2 < 0) {
	                        return true;
	                    } else {
	                        if (currentpos - 2 > 0 && currentpos - 2 < str.length) {
	                            return str[currentpos - 2] !== '\\';
	                        }
	                    }
	                }
	            }
	
	            return false;
	        };
	
	        NumberFormatBase.ContainsKeywords = function (format, keywords, keywordsSet) {
	            if (!format || format === stringEx.Empty) {
	                return false;
	            }
	            if (keywordsSet[format]) {
	                return true;
	            }
	            var stringOnlyKeywords = "";
	            var inComments = false;
	            var last = keyword_null, cCode;
	            for (var n = 0; n < format.length; n++) {
	                var c = format[n];
	                if (c === '\"') {
	                    inComments = !inComments;
	                } else {
	                    if (!inComments) {
	                        if (c !== DefaultTokens.UnderLine && last !== DefaultTokens.UnderLine) {
	                            if (c !== 'E') {
	                                cCode = c.charCodeAt(0);
	                                if (cCode >= 65 && cCode <= 90) {
	                                    cCode |= 0x20;
	                                    c = String.fromCharCode(cCode);
	                                }
	                            }
	                            stringOnlyKeywords += c;
	                        }
	                    }
	                }
	
	                last = c;
	            }
	            var formatTemp = stringOnlyKeywords;
	            if (keywordsSet[formatTemp]) {
	                return true;
	            }
	            for (var index = 0; index < keywords.length; index++) {
	                if (formatTemp.indexOf(keywords[index]) >= 0) {
	                    return true;
	                }
	            }
	
	            return false;
	        };
	
	        nfPrototype.Format = function (obj) {
	            return "";
	        };
	
	        nfPrototype.Parse = function (str) {
	            return keyword_null;
	        };
	
	        nfPrototype.FormatString = function () {
	            return "";
	        };
	
	        nfPrototype.ExcelCompatibleFormatString = function () {
	            return "";
	        };
	        NumberFormatBase.General = "General";
	        NumberFormatBase.General_Lower = "general";
	        NumberFormatBase._keywords = [NumberFormatBase.General_Lower];
	        NumberFormatBase._keywordsSet = {"general": true};
	        return NumberFormatBase;
	    })();
	
	    //<editor-fold desc="StandardDateTimeFormatter/StandardNumberFormatter">
	    var _StandardDateTimeFormatter = (function () {
	        function _StandardDateTimeFormatter(format) {
	            var self = this;
	            self.shortDatePattern = "d";
	            self.longDatePattern = "D";
	            self.FullDatePatternShortTime = "f";
	            self.FullDatePatternLongTime = "F";
	            self.GeneralDatePatternLongTimeShortTime = "g";
	            self.GeneralDatePatternLongTimeLongTime = "G";
	            self.MonthDayPattern1 = "m";
	            self.MonthDayPattern2 = "M";
	            self.RoundTripDatePattern1 = "o";
	            self.RoundTripDatePattern2 = "O";
	            self.RFC1123Pattern1 = "r";
	            self.RFC1123Pattern2 = "R";
	            self.SortableDatePattern = "s";
	            self.shortTimePattern = "t";
	            self.longTimePattern = "T";
	            self.UniversalSortableDatePattern = "u";
	            self.UniversalFullDatePattern = "U";
	            self.YearMonthPattern1 = "y";
	            self.YearMonthPattern2 = "Y";
	
	            self._classNames = ["StandardDateTimeFormatter", "IFormatter"];
	            self._formatString = format;
	        }
	
	        var sdfPrototype = _StandardDateTimeFormatter.prototype;
	        sdfPrototype.EvaluateFormat = function (format) {
	            var self = this;
	            if (format === self.shortDatePattern || format === self.longDatePattern || format === self.FullDatePatternShortTime || format === self.FullDatePatternLongTime || format === self.GeneralDatePatternLongTimeShortTime || format === self.GeneralDatePatternLongTimeLongTime || format === self.MonthDayPattern1 || format === self.MonthDayPattern2 || format === self.RoundTripDatePattern1 || format === self.RoundTripDatePattern2 || format === self.RFC1123Pattern1 || format === self.RFC1123Pattern2 || format === self.SortableDatePattern || format === self.shortTimePattern || format === self.longTimePattern || format === self.UniversalSortableDatePattern || format === self.UniversalFullDatePattern || format === self.YearMonthPattern1 || format === self.YearMonthPattern2) {
	                return true;
	            }
	
	            return false;
	        };
	
	        sdfPrototype.Format = function (obj) {
	            try {
	                if (obj === keyword_undefined || obj === keyword_null || obj === "") {
	                    return "";
	                }
	                return new formatterUtils._DateTimeHelper(obj).localeFormat(this._formatString);
	            } catch (err) {
	                return obj.toString();
	            }
	        };
	
	        sdfPrototype.Parse = function (str) {
	            try {
	                if (!str || str === "") {
	                    return keyword_null;
	                }
	                return formatterUtils._DateTimeHelper.parseLocale(str, this._formatString);
	            } catch (err) {
	                return new Date(str);
	            }
	        };
	
	        sdfPrototype.FormatString = function () {
	            return this._formatString;
	        };
	        return _StandardDateTimeFormatter;
	    })();
	    formatter._StandardDateTimeFormatter = _StandardDateTimeFormatter;
	
	    var _StandardNumberFormatter = (function () {
	        function _StandardNumberFormatter(format) {
	            var self = this;
	            self.CurrencyPattern1 = "c";
	            self.CurrencyPattern2 = "C";
	            self.DecimalPattern1 = "d";
	            self.DecimalPattern2 = "D";
	            self.ScientificPattern1 = "e";
	            self.ScientificPattern2 = "E";
	            self.FixedPointPattern1 = "f";
	            self.FixedPointPattern2 = "F";
	            self.GeneralPattern1 = "g";
	            self.GeneralPattern2 = "G";
	            self.NumberPattern1 = "n";
	            self.NumberPattern2 = "N";
	            self.PercentPattern1 = "p";
	            self.PercentPattern2 = "P";
	            self.RoundTripPattern1 = "r";
	            self.RoundTripPattern2 = "R";
	            self.HexadecimalPattern1 = "x";
	            self.HexadecimalPattern2 = "X";
	
	            self._classNames = ["StandardNumberFormatter", "IFormatter"];
	            self._formatString = format;
	        }
	
	        var snfPrototype = _StandardNumberFormatter.prototype;
	        snfPrototype.EvaluateFormat = function (format) {
	            var self = this;
	            if (format && format !== stringEx.Empty && format.length > 0) {
	                var key = format.substr(0, 1);
	                if (key === self.CurrencyPattern1 || key === self.CurrencyPattern2 || key === self.DecimalPattern1 || key === self.DecimalPattern2 || key === self.ScientificPattern1 || key === self.ScientificPattern2 || key === self.FixedPointPattern1 || key === self.FixedPointPattern2 || key === self.GeneralPattern1 || key === self.GeneralPattern2 || key === self.NumberPattern1 || key === self.NumberPattern2 || key === self.PercentPattern1 || key === self.PercentPattern2 || key === self.RoundTripPattern1 || key === self.RoundTripPattern2 || key === self.HexadecimalPattern1 || key === self.HexadecimalPattern2) {
	                    return true;
	                }
	            }
	
	            return false;
	        };
	
	        snfPrototype.Format = function (obj) {
	            try {
	                if (obj === keyword_null || obj === keyword_undefined || obj === "") {
	                    return "";
	                }
	                return new formatterUtils._NumberHelper(obj).localeFormat(this._formatString);
	            } catch (err) {
	                return obj.toString();
	            }
	        };
	
	        snfPrototype.Parse = function (str) {
	            try {
	                if (str === keyword_null || str === keyword_undefined || str === "") {
	                    return keyword_null;
	                }
	                return formatterUtils._NumberHelper.parseLocale(str);
	            } catch (err) {
	                var result = parseFloat(str);
	                if (isNaN(result) || !isFinite(result)) {
	                    return keyword_null;
	                }
	                return result;
	            }
	        };
	
	        snfPrototype.FormatString = function () {
	            return this._formatString;
	        };
	        return _StandardNumberFormatter;
	    })();
	    formatter._StandardNumberFormatter = _StandardNumberFormatter;
	
	    //</editor-fold>
	    //<editor-fold desc="NumberFormatText">
	    var NumberFormatText = (function (_super) {
	        __extends(NumberFormatText, _super);
	        function NumberFormatText(format, partLocaleID, dbNumberFormatPart, culture) {
	            var self = this;
	            _super.call(this, partLocaleID, dbNumberFormatPart, culture);
	            self._classNames = ["NumberFormatText", "IFormatter"];
	            var formatTemp = NumberFormatBase.TrimNotSupportSymbol(format, false);
	            if (partLocaleID) {
	                formatTemp = DefaultTokens.ReplaceKeyword(formatTemp, self.PartLocaleID().OriginalToken(), self.PartLocaleID().CurrencySymbol());
	            }
	            formatTemp = DefaultTokens.Filter(formatTemp, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
	            formatTemp = DefaultTokens.TrimEscape(formatTemp);
	            self._formatString = formatTemp;
	        }
	
	        var nfPrototype = NumberFormatText.prototype;
	        nfPrototype.Format = function (obj) {
	            try {
	                var result = formatterUtils.util.toString(obj);
	                var formatStringTemp = formatterUtils.StringHelper.Replace(this._formatString, "\"", "");
	                if (formatStringTemp !== keyword_null && formatStringTemp !== keyword_undefined) {
	                    result = formatterUtils.StringHelper.Replace(formatStringTemp, "@", result);
	                }
	                return result;
	            } catch (err) {
	                return "";
	            }
	        };
	
	        nfPrototype.Parse = function (str) {
	            if (!str) {
	                return "";
	            }
	            return str;
	        };
	
	        nfPrototype.FormatString = function () {
	            return this._formatString;
	        };
	
	        NumberFormatText.EvaluateFormat = function (format) {
	            return true;
	        };
	
	        //</editor-fold>
	        //<editor-fold desc="DefaultDateTimeNumberStringConverter">
	        nfPrototype.DefaultDateTimeNumberStringConverter = function () {
	        };
	        return NumberFormatText;
	    })(NumberFormatBase);
	
	    //</editor-fold>
	    //<editor-fold desc="AutoFormatter">
	    var AutoFormatter = (function () {
	        /**
	         * Represents an automatic format.
	         * @class
	         * @param {$.wijmo.wijspread.GeneralFormatter} innerFormatter The inner formatter.
	         */
	        function AutoFormatter(innerFormatter) {
	            this._innerFormatter = innerFormatter;
	        }
	
	        var afPrototype = AutoFormatter.prototype;
	
	        /**
	         * Gets the expression that is used to format and parse.
	         * @returns {string} The expression that is used to format and parse.
	         */
	        afPrototype.FormatString = function () {
	            var self = this;
	            return self._innerFormatter ? self._innerFormatter.FormatString() : '';
	        };
	
	        /**
	         * Gets or sets the inner formatter.
	         * @param {$.wijmo.wijspread.GeneralFormatter} formatter The inner formatter.
	         * @returns {$.wijmo.wijspread.GeneralFormatter} The inner formatter.
	         */
	        afPrototype.innerFormatter = function (formatter) {
	            var self = this;
	            if (arguments.length === 0) {
	                return self._innerFormatter;
	            }
	            self._innerFormatter = formatter;
	            return self;
	        };
	
	        /**
	         * Parses the specified text.
	         * @param {string} text The text.
	         * @returns {Object} The parsed object.
	         */
	        afPrototype.Parse = function (text) {
	            var self = this;
	            return self._innerFormatter ? self._innerFormatter.Parse(text) : text;
	        };
	
	        /**
	         * Formats the specified object as a string.
	         * @param {Object} text The object with cell data to format.
	         * @returns {string} The formatted string.
	         */
	        afPrototype.Format = function (obj) {
	            var self = this;
	            return self._innerFormatter ? self._innerFormatter.Format(obj) : ((obj === keyword_undefined || obj === keyword_null) ? "" : obj.toString());
	        };
	
	        afPrototype.toJSON = function () {
	            return keyword_undefined;
	        };
	        return AutoFormatter;
	    })();
	    formatter.AutoFormatter = AutoFormatter;
	
	    //</editor-fold>
	    var CustomNumberFormat = (function () {
	        function CustomNumberFormat(format, culture) {
	            var self = this;
	            self.conditionFormatPart = keyword_null;
	            self.colorFormatPart = keyword_null;
	            self.localeIDFormatPart = keyword_null;
	            self.dbNumberFormatPart = keyword_null;
	            self.numberFormat = keyword_null;
	            self.dateTimeFormatInfo = keyword_null;
	            self.numberFormatInfo = keyword_null;
	            self.formatCached = keyword_null;
	
	            self._classNames = ["CustomNumberFormat", "IFormatter", "IFormatProviderSupport"];
	            if (!culture) {
	                culture = globalize.Cultures._CultureInfo._currentCulture.Name();
	            }
	            if (arguments.length === 0) {
	                self.formatCached = NumberFormatBase.General;
	                self.numberFormat = new NumberFormatGeneral();
	            } else {
	                self.Init(format, culture);
	            }
	        }
	
	        var cfPrototype = CustomNumberFormat.prototype;
	        cfPrototype.Init = function (format, culture) {
	            if (format === keyword_null || format === keyword_undefined) {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	
	            var self = this;
	            self.formatCached = format;
	
	            var contentToken = "";
	            var token = "";
	            var isInFormatPart = false;
	            var absTimePart = [];
	            for (var index = 0; index < format.length; index++) {
	                var c = format[index];
	                if (c === DefaultTokens.LeftSquareBracket) {
	                    if (isInFormatPart) {
	                        throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                    } else {
	                        if (token) {
	                            if (!contentToken) {
	                                contentToken = "";
	                            }
	
	                            contentToken += token;
	                            token = "";
	                        }
	
	                        token = c.toString();
	                    }
	                    isInFormatPart = true;
	                } else if (c === DefaultTokens.RightSquareBracket) {
	                    if (isInFormatPart) {
	                        if (token) {
	                            token += c;
	                            var part = token.toString();
	                            var partObject = formatterUtils.util.asCustomType(FormatPartBase.Create(part), "FormatPartBase");
	                            if (partObject && !(formatterUtils.util.isCustomType(partObject, "ABSTimeFormatPart"))) {
	                                self.AddPart(partObject);
	                            } else {
	                                if (formatterUtils.util.isCustomType(partObject, "ABSTimeFormatPart")) {
	                                    absTimePart.push(formatterUtils.util.asCustomType(partObject, "ABSTimeFormatPart"));
	                                    contentToken += token;
	                                } else {
	                                    throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                                }
	                            }
	
	                            token = "";
	                        } else {
	                            throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                        }
	                    } else {
	                        throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                    }
	
	                    isInFormatPart = false;
	                } else {
	                    token += c;
	                }
	            }
	
	            if (token) {
	                if (isInFormatPart) {
	                    throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                } else {
	                    contentToken += token;
	                }
	            }
	
	            // Use the localeID in format string.
	            if (self.localeIDFormatPart !== keyword_null) {
	                culture = self.localeIDFormatPart.CultureInfo().Name();
	            }
	
	            var content = contentToken ? contentToken.toString() : stringEx.Empty;
	            if (NumberFormatGeneral.EvaluateFormat(content)) {
	                self.numberFormat = new NumberFormatGeneral(content, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture);
	            } else if (NumberFormatDateTime.EvaluateFormat(content)) {
	                var absPartsArray = absTimePart.length > 0 ? absTimePart : keyword_null;
	                self.numberFormat = new NumberFormatDateTime(content, absPartsArray, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture);
	            } else if (NumberFormatDigital.EvaluateFormat(content)) {
	                self.numberFormat = new NumberFormatDigital(format, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture);
	            } else if (NumberFormatText.EvaluateFormat(content)) {
	                self.numberFormat = new NumberFormatText(format, self.LocaleIDFormatPart(), self.dbNumberFormatPart, culture);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	        };
	
	        //CustomNumberFormat Public Properties
	        cfPrototype.FormatString = function () {
	            var self = this;
	            var formatBuilder = "";
	            if (self.numberFormat && self.numberFormat.FormatString()) {
	                if (self.ColorFormatPart()) {
	                    formatBuilder += (self.ColorFormatPart().toString());
	                }
	
	                if (self.ConditionFormatPart()) {
	                    formatBuilder += (self.ConditionFormatPart().toString());
	                }
	
	                if (self.DBNumberFormatPart()) {
	                    formatBuilder += (self.DBNumberFormatPart().toString());
	                }
	
	                if (self.LocaleIDFormatPart()) {
	                    formatBuilder += (self.LocaleIDFormatPart().toString());
	                }
	
	                formatBuilder += (self.numberFormat.FormatString());
	            }
	
	            return formatBuilder.toString();
	        };
	
	        cfPrototype.ConditionFormatPart = function () {
	            return this.conditionFormatPart;
	        };
	
	        cfPrototype.ColorFormatPart = function () {
	            return this.colorFormatPart;
	        };
	
	        cfPrototype.LocaleIDFormatPart = function () {
	            return this.localeIDFormatPart;
	        };
	
	        cfPrototype.DBNumberFormatPart = function () {
	            return this.dbNumberFormatPart;
	        };
	
	        cfPrototype.NumberStringConverter = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.numberFormat) {
	                    return self.numberFormat.NumberStringConverter();
	                }
	
	                return keyword_null;
	            } else {
	                //Set
	                if (self.numberFormat) {
	                    self.numberFormat.NumberStringConverter(value);
	                }
	            }
	        };
	
	        cfPrototype.ExcelCompatibleFormatString = function () {
	            var self = this;
	            var formatBuilder = "";
	            if (self.numberFormat && self.numberFormat.ExcelCompatibleFormatString()) {
	                // the parts should be added here when number format is no NumberFormatDigital,
	                // NumberFormatDigital is keeping the parts information in self.numberFormat.ExcelCompatibleFormatString, so no need to added here again.
	                if (!(formatterUtils.util.isCustomType(self.numberFormat, "NumberFormatDigital"))) {
	                    if (self.DBNumberFormatPart()) {
	                        formatBuilder += (self.DBNumberFormatPart().toString());
	                    }
	
	                    if (self.LocaleIDFormatPart()) {
	                        formatBuilder += (self.LocaleIDFormatPart().toString());
	                    }
	
	                    if (self.ConditionFormatPart()) {
	                        formatBuilder += (self.ConditionFormatPart().toString());
	                    }
	
	                    if (self.ColorFormatPart()) {
	                        formatBuilder += (self.ColorFormatPart().toString());
	                    }
	                }
	
	                formatBuilder += (self.numberFormat.ExcelCompatibleFormatString());
	            }
	
	            return formatBuilder.toString();
	        };
	
	        cfPrototype.Formatter = function () {
	            return this.numberFormat;
	        };
	
	        cfPrototype.DateTimeFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.Formatter().DateTimeFormatInfo();
	            } else {
	                //Set
	                self.Formatter().DateTimeFormatInfo(value);
	                self.dateTimeFormatInfo = value;
	                return value;
	            }
	        };
	
	        cfPrototype.NumberFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.Formatter().NumberFormatInfo();
	            } else {
	                //Set
	                self.Formatter().NumberFormatInfo(value);
	                self.numberFormatInfo = value;
	                return value;
	            }
	        };
	
	        //CustomNumberFormat Public Methods
	        cfPrototype.AddPart = function (part) {
	            if (!part) {
	                throw new Error(globalize.StringResoures.SR.Exp_PartIsNull);
	            }
	
	            var self = this;
	            if (formatterUtils.util.isCustomType(part, "ConditionFormatPart")) {
	                if (!self.conditionFormatPart) {
	                    self.conditionFormatPart = formatterUtils.util.asCustomType(part, "ConditionFormatPart");
	                    ;
	                } else {
	                    throw new Error(globalize.StringResoures.SR.Exp_DuplicatedDescriptor);
	                }
	            } else if (formatterUtils.util.isCustomType(part, "ColorFormatPart")) {
	                if (!self.colorFormatPart) {
	                    self.colorFormatPart = formatterUtils.util.asCustomType(part, "ColorFormatPart");
	                } else {
	                    throw new Error(globalize.StringResoures.SR.Exp_DuplicatedDescriptor);
	                }
	            } else if (formatterUtils.util.isCustomType(part, "LocaleIDFormatPart")) {
	                if (!self.localeIDFormatPart) {
	                    self.localeIDFormatPart = formatterUtils.util.asCustomType(part, "LocaleIDFormatPart");
	                } else {
	                    throw new Error(globalize.StringResoures.SR.Exp_DuplicatedDescriptor);
	                }
	            } else if (formatterUtils.util.isCustomType(part, "DBNumberFormatPart")) {
	                if (!self.dbNumberFormatPart) {
	                    self.dbNumberFormatPart = formatterUtils.util.asCustomType(part, "DBNumberFormatPart");
	                } else {
	                    throw new Error(globalize.StringResoures.SR.Exp_DuplicatedDescriptor);
	                }
	            }
	        };
	
	        cfPrototype.Format = function (obj) {
	            return this.numberFormat.Format(obj);
	        };
	
	        cfPrototype.Parse = function (str) {
	            return this.numberFormat.Parse(str);
	        };
	        return CustomNumberFormat;
	    })();
	
	    //<editor-fold desc="GeneralFormatter">
	    var GeneralFormatter = (function () {
	        /**
	         * Represents a formatter with the specified format mode and format string.
	         * @class
	         * @param {string} format The format.
	         * @param {$.wijmo.wijspread.FormatMode} formatMode The format mode.
	         * @param {string} cultureName The culture name.
	         */
	        function GeneralFormatter(format, formatMode, cultureName) {
	            var self = this;
	            self.formatters = keyword_null;
	            self.formatModeType = 0 /* CustomMode */;
	            self.dateTimeFormatInfo = keyword_null;
	            self.numberFormatInfo = keyword_null;
	            self.isSingleFormatterInfo = true;
	            self.isDefault = true;
	            self.isConstructed = false;
	            self.customerCultureName = keyword_null;
	            self.PropertyChanged = [];
	
	            self._classNames = ["GeneralFormatter", "IFormatter", "INotifyPropertyChanged", "IColorFormatter"];
	            if (stringEx.IsNullOrEmpty(format)) {
	                format = NumberFormatBase.General;
	            }
	            if (!formatMode) {
	                formatMode = 0 /* CustomMode */;
	            }
	            self.formatCached = format;
	            self.formatModeType = formatMode;
	            self.isDefault = self.formatCached.toLowerCase() === NumberFormatBase.General_Lower;
	            self.isConstructed = false;
	
	            if (cultureName) {
	                self.customerCultureName = globalize.Cultures._CultureInfo.getCulture(cultureName).Name();
	            } else {
	                self.customerCultureName = globalize.Cultures._CultureInfo._currentCulture.Name();
	            }
	        }
	
	        //judge whether format changed with culture.
	        GeneralFormatter._needChangeDefaultFormat = function (defaultFormat) {
	            if (!defaultFormat) {
	                return true;
	            } else {
	                var currentCulture = globalize.Cultures._CultureInfo._currentCulture.Name().toLowerCase();
	                var oldCulture = defaultFormat.customerCultureName.toLowerCase();
	                if (oldCulture === currentCulture) {
	                    return false;
	                } else {
	                    return true;
	                }
	            }
	        };
	
	        //GeneralFormatter static Properties
	        GeneralFormatter.DefaultNumberFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultNumberFormatter)) {
	                self.defaultNumberFormatter = new GeneralFormatter("###################0.################", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultNumberFormatter;
	        };
	
	        GeneralFormatter.DefaultGeneralFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultGeneralFormatter)) {
	                self.defaultGeneralFormatter = new GeneralFormatter();
	            }
	            return self.defaultGeneralFormatter;
	        };
	
	        GeneralFormatter.DefaultShortDatePatternFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultShortDatePatternFormatter)) {
	                self.defaultShortDatePatternFormatter = new GeneralFormatter(DefaultTokens.DateTimeFormatInfo().shortDatePattern);
	            }
	            return self.defaultShortDatePatternFormatter;
	        };
	
	        GeneralFormatter.DefaultSXDatetimePatternFormatter = function () {
	            var self = this;
	            var currentFormat = DefaultTokens.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss";
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultSXDatetimePatternFormatter)) {
	                self.defaultSXDatetimePatternFormatter = new GeneralFormatter(currentFormat);
	            }
	            return self.defaultSXDatetimePatternFormatter;
	        };
	
	        GeneralFormatter.DefaultLongTimePatternFormatter = function () {
	            var self = this;
	            var currentFormat = DefaultTokens.DateTimeFormatInfo().longTimePattern;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultLongTimePatternFormatter)) {
	                self.defaultLongTimePatternFormatter = new GeneralFormatter(currentFormat);
	            }
	            return self.defaultLongTimePatternFormatter;
	        };
	
	        GeneralFormatter.DefaultDMMMFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultDMMMFormatter)) {
	                self.defaultDMMMFormatter = new GeneralFormatter("d-mmm", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultDMMMFormatter;
	        };
	
	        GeneralFormatter.DefaultMMMYYFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultMMMYYFormatter)) {
	                self.defaultMMMYYFormatter = new GeneralFormatter("mmm-yy", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultMMMYYFormatter;
	        };
	
	        GeneralFormatter.DefaultHMMFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultHMMFormatter)) {
	                self.defaultHMMFormatter = new GeneralFormatter("h:mm", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultHMMFormatter;
	        };
	
	        GeneralFormatter.DefaultHMMSSFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultHMMSSFormatter)) {
	                self.defaultHMMSSFormatter = new GeneralFormatter("h:mm:ss", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultHMMSSFormatter;
	        };
	
	        GeneralFormatter.DefaultHMMSS0Formatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultHMMSS0Formatter)) {
	                self.defaultHMMSS0Formatter = new GeneralFormatter("h:mm:ss.0", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultHMMSS0Formatter;
	        };
	
	        GeneralFormatter.DefaultComboNumberFormatter1 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultComboNumberFormatter1)) {
	                self.defaultComboNumberFormatter1 = new GeneralFormatter(stringEx.Format("{0}#,##0.00;[Red]({0}#,##0.00)", DefaultTokens.NumberFormatInfo().currencySymbol));
	            }
	            return self.defaultComboNumberFormatter1;
	        };
	
	        GeneralFormatter.DefaultComboNumberFormatter2 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultComboNumberFormatter2)) {
	                self.defaultComboNumberFormatter2 = new GeneralFormatter(stringEx.Format("{0}#,##0;[Red]({0}#,##0)", DefaultTokens.NumberFormatInfo().currencySymbol));
	            }
	            return self.defaultComboNumberFormatter2;
	        };
	
	        GeneralFormatter.DefaultStandardNumberFormatter = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultStandardNumberFormatter)) {
	                self.defaultStandardNumberFormatter = new GeneralFormatter("0.00E+00", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultStandardNumberFormatter;
	        };
	
	        GeneralFormatter.DefaultStandardPercentFormatter1 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultStandardPercentFormatter1)) {
	                self.defaultStandardPercentFormatter1 = new GeneralFormatter("0.00%", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultStandardPercentFormatter1;
	        };
	
	        GeneralFormatter.DefaultStandardPercentFormatter2 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultStandardPercentFormatter2)) {
	                self.defaultStandardPercentFormatter2 = new GeneralFormatter("0%", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultStandardPercentFormatter2;
	        };
	
	        GeneralFormatter.DefaultStandardGroupNumberFormatter1 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultStandardGroupNumberFormatter1)) {
	                self.defaultStandardGroupNumberFormatter1 = new GeneralFormatter("#,##0.00", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultStandardGroupNumberFormatter1;
	        };
	
	        GeneralFormatter.DefaultStandardGroupNumberFormatter2 = function () {
	            var self = this;
	            if (GeneralFormatter._needChangeDefaultFormat(self.defaultStandardGroupNumberFormatter2)) {
	                self.defaultStandardGroupNumberFormatter2 = new GeneralFormatter("#,##0", 0 /* CustomMode */, globalize.Cultures._CultureInfo._currentCulture.Name());
	            }
	            return self.defaultStandardGroupNumberFormatter2;
	        };
	
	        var gfPrototype = GeneralFormatter.prototype;
	        gfPrototype.findDateTimeGeneralFormatter = function (s, v, formatter, foundCallback) {
	            if (formatter && formatter.length > 0) {
	                for (var k in formatter) {
	                    if (formatter.hasOwnProperty(k)) {
	                        var f = formatter[k];
	
	                        //var dt = DateFormatHelper.string2Date(s, f);
	                        var dt = formatterUtils._DateTimeHelper.parseLocale(s, f);
	                        if (dt && (dt - v === 0)) {
	                            return foundCallback();
	                        }
	                    }
	                }
	            }
	            return keyword_null;
	        };
	
	        gfPrototype.toJSON = function () {
	            var self = this;
	            var dictData = {
	                formatModeType: self.formatModeType,
	                customerCultureName: self.customerCultureName,
	                formatCached: self.formatCached
	            };
	            return dictData;
	        };
	
	        //GeneralFormatter Public Properties
	        /**
	         * Gets a value that indicates whether this formatted text contains a foreground color.
	         * @returns {boolean} <c>true</c> if this formatted text contains a foreground color; otherwise, <c>false</c>.
	         */
	        gfPrototype.HasFormatedColor = function () {
	            var self = this;
	            if (self.isDefault) {
	                return false;
	            }
	
	            if (self.PositiveExpression() && self.PositiveExpression().ColorFormatPart()) {
	                return true;
	            }
	
	            if (self.NegativeExpression() && self.NegativeExpression().ColorFormatPart()) {
	                return true;
	            }
	
	            if (self.ZeroExpression() && self.ZeroExpression().ColorFormatPart()) {
	                return true;
	            }
	
	            if (self.TextExpression() && self.TextExpression().ColorFormatPart()) {
	                return true;
	            }
	
	            return false;
	        };
	
	        /**
	         * Gets a value that indicates whether this formatter is the default formatter.
	         * @returns {boolean} <c>true</c> if this formatter is the default formatter; otherwise, <c>false</c>.
	         */
	        gfPrototype.IsDefaultFormat = function () {
	            return this.isDefault;
	        };
	
	        /**
	         * Gets the format string for this formatter.
	         * @param {string} value The format string for this formatter.
	         * @returns {string} The format string for this formatter. The default value is "General".
	         */
	        gfPrototype.FormatString = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                self.Init();
	                var formatStringBuilder = keyword_null;
	                switch (self.FormatMode()) {
	                    case 0 /* CustomMode */
	                    :
	                        if (self.formatters) {
	                            for (var index = 0; index < self.formatters.length; index++) {
	                                var formatter = self.formatters[index];
	                                if (formatterUtils.util.isCustomType(formatter, "CustomNumberFormat")) {
	                                    if (formatStringBuilder == keyword_null) {
	                                        formatStringBuilder = "";
	                                    } else {
	                                        formatStringBuilder += (DefaultTokens.FormatSeparator);
	                                    }
	
	                                    var formatTemp = formatter.FormatString();
	                                    formatStringBuilder += (formatTemp);
	                                }
	                            }
	                        }
	                        break;
	                    case 1 /* StandardDateTimeMode */
	                    :
	                        if (formatterUtils.util.isCustomType(self.formatters[0], "StandardDateTimeFormatter")) {
	                            return self.formatters[0].FormatString();
	                        }
	                        break;
	                    case 2 /* StandardNumericMode */
	                    :
	                        if (formatterUtils.util.isCustomType(self.formatters[0], "StandardNumberFormatter")) {
	                            return self.formatters[0].FormatString();
	                        }
	                        break;
	                }
	
	                if (formatStringBuilder) {
	                    return formatStringBuilder;
	                } else {
	                    return stringEx.Empty;
	                }
	            } else {
	                //Set
	                if (!value) {
	                    throw new Error(globalize.StringResoures.SR.Exp_ValueIsNull);
	                }
	                self.formatters = keyword_null;
	                self.formatCached = value;
	                self.isDefault = self.formatCached.toLowerCase() === NumberFormatBase.General_Lower;
	                self.isConstructed = false;
	                self.Init();
	                self.RaisePropertyChanged("FormatString");
	            }
	        };
	
	        gfPrototype.DateTimeFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                self.Init();
	                if (self.dateTimeFormatInfo) {
	                    return self.dateTimeFormatInfo;
	                }
	
	                return DefaultTokens.DateTimeFormatInfo();
	            } else {
	                //Set
	                self.Init();
	                self.dateTimeFormatInfo = value;
	                if (self.formatters) {
	                    for (var index = 0; index < self.formatters.length; index++) {
	                        var formatter = self.formatters[index];
	                        if (formatterUtils.util.isCustomType(formatter, "IFormatProviderSupport")) {
	                            var formaterTmp = formatter;
	                            formaterTmp.DateTimeFormatInfo(value);
	                        }
	                    }
	                }
	                self.RaisePropertyChanged("DateTimeFormatInfo");
	                return value;
	            }
	        };
	
	        gfPrototype.NumberFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                self.Init();
	                if (self.numberFormatInfo) {
	                    return self.numberFormatInfo;
	                }
	
	                return DefaultTokens.NumberFormatInfo();
	            } else {
	                //Set
	                self.Init();
	                self.numberFormatInfo = value;
	                if (self.formatters) {
	                    for (var index = 0; index < self.formatters.length; index++) {
	                        var formatter = self.formatters[index];
	                        if (formatterUtils.util.isCustomType(formatter, "IFormatProviderSupport")) {
	                            var formaterTmp = formatter;
	                            formaterTmp.NumberFormatInfo(value);
	                        }
	                    }
	                }
	                self.RaisePropertyChanged("NumberFormatInfo");
	                return value;
	            }
	        };
	
	        /**
	         * Gets the format mode for this formatter.
	         * @param {$.wijmo.wijspread.FormatMode} value The format mode for this formatter.
	         * @returns {$.wijmo.wijspread.FormatMode} The format mode for this formatter. The default value is FormatMode.CustomMode.
	         */
	        gfPrototype.FormatMode = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.formatModeType;
	            } else {
	                //Set
	                self.formatModeType = value;
	                self.RaisePropertyChanged("FormatMode");
	                return value;
	            }
	        };
	
	        /**
	         * Gets the Excel-compatible format string.
	         * @returns {string} The Excel-compatible format string. The default value is an empty string.
	         */
	        gfPrototype.ExcelCompatibleFormatString = function () {
	            var self = this;
	            self.Init();
	            var formatStringBuilder = keyword_null;
	            switch (self.FormatMode()) {
	                case 0 /* CustomMode */
	                :
	                    if (self.formatters) {
	                        for (var index = 0; index < self.formatters.length; index++) {
	                            var formatter = self.formatters[index];
	                            if (formatterUtils.util.isCustomType(formatter, "CustomNumberFormat")) {
	                                if (formatStringBuilder == keyword_null) {
	                                    formatStringBuilder = "";
	                                } else {
	                                    formatStringBuilder += (DefaultTokens.FormatSeparator);
	                                }
	
	                                var formatTemp = formatter.ExcelCompatibleFormatString();
	                                formatStringBuilder += (formatTemp);
	                            }
	                        }
	                    }
	                    break;
	                case 1 /* StandardDateTimeMode */
	                :
	                    if (formatterUtils.util.isCustomType(self.formatters[0], "StandardDateTimeFormatter")) {
	                        return self.formatters[0].ExcelCompatibleFormatString();
	                    }
	                    break;
	                case 2 /* StandardNumericMode */
	                :
	                    if (formatterUtils.util.isCustomType(self.formatters[0], "StandardNumberFormatter")) {
	                        return self.formatters[0].ExcelCompatibleFormatString();
	                    }
	                    break;
	            }
	
	            if (formatStringBuilder) {
	                return formatStringBuilder.toString();
	            } else {
	                return stringEx.Empty;
	            }
	        };
	
	        gfPrototype.PositiveExpression = function () {
	            var self = this;
	            self.Init();
	            if (self.formatters && self.formatters.length > 0) {
	                return formatterUtils.util.asCustomType(self.formatters[0], "CustomNumberFormat");
	            }
	            return keyword_null;
	        };
	
	        gfPrototype.NegativeExpression = function () {
	            var self = this;
	            self.Init();
	            if (self.formatters && self.formatters.length > 1) {
	                return formatterUtils.util.asCustomType(self.formatters[1], "CustomNumberFormat");
	            }
	            return keyword_null;
	        };
	
	        gfPrototype.ZeroExpression = function () {
	            var self = this;
	            self.Init();
	            if (self.formatters && self.formatters.length > 2) {
	                return formatterUtils.util.asCustomType(self.formatters[2], "CustomNumberFormat");
	            }
	            return keyword_null;
	        };
	
	        gfPrototype.TextExpression = function () {
	            var self = this;
	            self.Init();
	            if (self.formatters && self.formatters.length > 3) {
	                return formatterUtils.util.asCustomType(self.formatters[3], "CustomNumberFormat");
	            }
	            return keyword_null;
	        };
	
	        //GeneralFormatter Public Methods
	        /**
	         * Gets the preferred formatter type for a specified object.
	         * @param {Object} obj The object value to format.
	         * @returns {$.wijmo.wijspread.NumberFormatType} The NumberFormatType enumeration that specifies the format type.
	         */
	        gfPrototype.GetFormatType = function (obj) {
	            this.Init();
	            var formatInfo = this.GetFormatInfo(obj);
	            if (formatterUtils.util.isCustomType(formatInfo, "CustomNumberFormat")) {
	                var customFormat = formatInfo.Formatter();
	                if (formatterUtils.util.isCustomType(customFormat, "NumberFormatDigital")) {
	                    return 1 /* Number */;
	                } else if (formatterUtils.util.isCustomType(customFormat, "NumberFormatDateTime")) {
	                    return 2 /* DateTime */;
	                } else if (formatterUtils.util.isCustomType(customFormat, "NumberFormatText")) {
	                    return 3 /* Text */;
	                }
	            } else {
	                if (formatterUtils.util.isCustomType(formatInfo, "NumberFormatDigital") || formatterUtils.util.isCustomType(formatInfo, "StandardNumberFormatter")) {
	                    return 1 /* Number */;
	                } else if (formatterUtils.util.isCustomType(formatInfo, "NumberFormatDateTime") || formatterUtils.util.isCustomType(formatInfo, "StandardDateTimeFormatter")) {
	                    return 2 /* DateTime */;
	                } else if (formatterUtils.util.isCustomType(formatInfo, "NumberFormatText")) {
	                    return 3 /* Text */;
	                }
	            }
	
	            return 0 /* General */;
	        };
	
	        /**
	         * Gets the preferred editing formatter.
	         * @param {Object} obj The object value to format.
	         * @returns {Object} The preferred editing formatter for the object.
	         */
	        gfPrototype.GetPreferredEditingFormatter = function (obj) {
	            this.Init();
	        if (formatterUtils.util.isType(obj, "DateTime")) {
	                var dt = new formatterUtils._DateTimeHelper(obj);
	                if (dt.Hour() === 0 && dt.Minute() === 0 && dt.Second() === 0 && dt.Millisecond() === 0) {
	                    return GeneralFormatter.DefaultShortDatePatternFormatter();
	                } else {
	                    return GeneralFormatter.DefaultSXDatetimePatternFormatter();
	                }
	            } else if (formatterUtils.util.isType(obj, "TimeSpan")) {
	                return GeneralFormatter.DefaultLongTimePatternFormatter();
	            } else if (formatterUtils.FormatConverter.IsNumber(obj)) {
	                var value = formatterUtils.FormatConverter.ToDouble(obj);
	                if (value > 1E20) {
	                    return new GeneralFormatter("0.##E+00");
	                } else {
	                    return GeneralFormatter.DefaultNumberFormatter();
	                }
	            } else if (formatterUtils.util.isType(obj, "string")) {
	                return GeneralFormatter.DefaultGeneralFormatter();
	            } else {
	                return GeneralFormatter.DefaultGeneralFormatter();
	            }
	        };
	
	        /**
	         * Gets the preferred display format string.
	         * @param {string} s The formatted data string.
	         * @param {Object} valueRef The parsed value.
	         * @returns {$.wijmo.wijspread.NumberFormatType} The preferred formatter for the string.
	         */
	        gfPrototype.GetPreferredDisplayFormatter = function (s, valueRef) {
	            //The following three lines of code is for saving workload of writing cellformatter test scripts.
	            //The test scripts are migrated from SX,and GetPreferredDisplayFormatter has only one param in SX,so make this change.
	            //If user doesn't want to get the result of Parse when call this method,the second param of the method can be omitted.
	            var self = this;
	            if (!valueRef) {
	                valueRef = {'value': keyword_null};
	            }
	            valueRef.value = keyword_null;
	            self.Init();
	
	            if (stringEx.IsNullOrEmpty(s)) {
	                return new GeneralFormatter();
	            }
	
	            var strTemp = s;
	            var v = (valueRef.value = self.Parse(strTemp));
	            if (formatterUtils.util.isType(v, "DateTime") || formatterUtils.util.isType(v, "TimeSpan")) {
	                var result;
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralMonthDay(), function () {
	                        return GeneralFormatter.DefaultDMMMFormatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralYearMonth(), function () {
	                        return GeneralFormatter.DefaultMMMYYFormatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralYearMonthDay(), function () {
	                        return GeneralFormatter.DefaultShortDatePatternFormatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinute(), function () {
	                        return GeneralFormatter.DefaultHMMFormatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecond(), function () {
	                        return GeneralFormatter.DefaultHMMSSFormatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondSubSecond(), function () {
	                        return GeneralFormatter.DefaultHMMSS0Formatter();
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteWithDate(), function () {
	                        if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMFormatter)) {
	                            GeneralFormatter.defaultShortDatePatternHMMFormatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm");
	                        }
	                        return GeneralFormatter.defaultShortDatePatternHMMFormatter;
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondWithDate(), function () {
	                        if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMSSFormatter)) {
	                            GeneralFormatter.defaultShortDatePatternHMMSSFormatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss");
	                        }
	                        return GeneralFormatter.defaultShortDatePatternHMMSSFormatter;
	                    }))) {
	                    return result;
	                }
	                if ((result = self.findDateTimeGeneralFormatter(s, v, NumberFormatGeneral.GeneralHourMinuteSecondSubSecondWithDate(), function () {
	                        if (GeneralFormatter._needChangeDefaultFormat(GeneralFormatter.defaultShortDatePatternHMMSS0Formatter)) {
	                            GeneralFormatter.defaultShortDatePatternHMMSS0Formatter = new GeneralFormatter(self.DateTimeFormatInfo().shortDatePattern + " " + "h:mm:ss.0");
	                        }
	                        return GeneralFormatter.defaultShortDatePatternHMMSS0Formatter;
	                    }))) {
	                    return result;
	                }
	            } else if (formatterUtils.FormatConverter.IsNumber(v)) {
	                if (strTemp[0] === DefaultTokens.NumberFormatInfo().currencySymbol[0]) {
	                    if (formatterUtils.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator)) {
	                        return GeneralFormatter.DefaultComboNumberFormatter1();
	                    } else {
	                        return GeneralFormatter.DefaultComboNumberFormatter2();
	                    }
	                } else if (formatterUtils.StringHelper.IndexOf(strTemp, "e", 1 /* CurrentCultureIgnoreCase */) > -1) {
	                    return GeneralFormatter.DefaultStandardNumberFormatter();
	                } else if (strTemp[0].toString() === DefaultTokens.percentSymbol || strTemp[strTemp.length - 1].toString() === DefaultTokens.percentSymbol) {
	                    if (formatterUtils.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator)) {
	                        return GeneralFormatter.DefaultStandardPercentFormatter1();
	                    } else {
	                        return GeneralFormatter.DefaultStandardPercentFormatter2();
	                    }
	                } else if (formatterUtils.StringHelper.Contains(strTemp, DefaultTokens.numberGroupSeparator)) {
	                    if (formatterUtils.StringHelper.Contains(strTemp, DefaultTokens.DecimalSeparator)) {
	                        return GeneralFormatter.DefaultStandardGroupNumberFormatter1();
	                    } else {
	                        return GeneralFormatter.DefaultStandardGroupNumberFormatter2();
	                    }
	                }
	            }
	
	            return GeneralFormatter.DefaultGeneralFormatter();
	        };
	
	        /**
	         * Formats the specified object as a string with a conditional color.
	         * @param {Object} obj The object with cell data to format.
	         * @param {Object} conditionalForeColor The conditional foreground color.
	         * @returns {string} The formatted string.
	         */
	        gfPrototype.Format = function (obj, conditionalForeColor) {
	            if (formatterUtils.util.isType(obj, 'boolean')) {
	                return obj.toString().toUpperCase();
	            }
	
	            // get fore color
	            if (conditionalForeColor) {
	                conditionalForeColor.value = keyword_null;
	            }
	            this.Init();
	            var formatInfo = this.GetFormatInfo(obj);
	
	            if (formatterUtils.util.isCustomType(formatInfo, "CustomNumberFormat")) {
	                var colorPart = formatInfo.ColorFormatPart();
	                if (conditionalForeColor && colorPart) {
	                    conditionalForeColor.value = colorPart.ForeColor();
	                }
	            }
	
	            // format value
	            var value = 0;
	            var isNumber = formatterUtils.FormatConverter.IsNumber(obj);
	            if (isNumber) {
	                value = formatterUtils.FormatConverter.ToDouble(obj);
	            }
	
	            if (formatInfo) {
	                var result = keyword_null;
	                if (isNumber && formatInfo === this.NegativeExpression()) {
	                    result = formatInfo.Format(Math_abs(value));
	                    if (formatterUtils.util.isCustomType(formatInfo, "CustomNumberFormat")) {
	                        var cf = formatterUtils.util.asCustomType(formatInfo, "CustomNumberFormat");
	                        if (cf && cf.ConditionFormatPart() && cf.ConditionFormatPart().Value() > 0 && value < 0) {
	                            result = DefaultTokens.negativeSign + result;
	                        }
	                    }
	                } else {
	                    try {
	                        result = formatInfo.Format(obj);
	                    } catch (Exception) {
	                        if (formatterUtils.util.isType(obj, "string")) {
	                            result = obj.toString();
	                        }
	                    }
	                }
	
	                if (result) {
	                    return result;
	                } else {
	                    return stringEx.Empty;
	                }
	            } else {
	                if (isNumber && value < 0) {
	                    return DefaultTokens.HyphenMinus.toString();
	                } else {
	                    if (formatterUtils.util.isType(obj, "string")) {
	                        return obj.toString();
	                    } else {
	                        return (obj === keyword_undefined || obj === keyword_null) ? stringEx.Empty : obj.toString();
	                    }
	                }
	            }
	        };
	
	        /**
	         * Parses the specified text.
	         * @param {string} text The text.
	         * @returns {Object} The parsed object.
	         */
	        gfPrototype.Parse = function (str) {
	            var self = this;
	            self.Init();
	            if (self.formatters && self.formatters.length > 0) {
	                return self.formatters[0].Parse(str);
	            }
	
	            return keyword_null;
	        };
	
	        //GeneralFormatter Private Methods
	        gfPrototype.Init = function () {
	            var self = this;
	            if (!self.isConstructed) {
	                self.isConstructed = true;
	                switch (self.formatModeType) {
	                    case 0 /* CustomMode */
	                    :
	                        self.InitExcelCompatibleMode(self.formatCached);
	                        break;
	                    case 1 /* StandardDateTimeMode */
	                    :
	                        self.InitStandardDateTimeMode(self.formatCached);
	                        break;
	                    case 2 /* StandardNumericMode */
	                    :
	                        self.InitStandardNumericMode(self.formatCached);
	                        break;
	                }
	            }
	        };
	
	        gfPrototype.InitStandardDateTimeMode = function (format) {
	            var formatter = new _StandardDateTimeFormatter(format);
	            if (formatter.EvaluateFormat(format)) {
	                this.formatters = [];
	                this.formatters.push(formatter);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	        };
	
	        gfPrototype.InitStandardNumericMode = function (format) {
	            var formatter = new _StandardNumberFormatter(format);
	            if (formatter.EvaluateFormat(format)) {
	                this.formatters = [];
	                this.formatters.push(formatter);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	        };
	
	        gfPrototype.InitExcelCompatibleMode = function (format) {
	            if (stringEx.IsNullOrEmpty(format)) {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	            var self = this;
	            self.formatters = [];
	            if (self.isDefault) {
	                self.formatters.push(new CustomNumberFormat());
	            } else {
	                self.isSingleFormatterInfo = !formatterUtils.StringHelper.Contains(format, DefaultTokens.FormatSeparator.toString());
	                var items = format.split(DefaultTokens.FormatSeparator);
	                if (!items) {
	                    throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                }
	
	                if (items.length < 1 || items.length > 5) {
	                    throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                }
	
	                var count = 0;
	                for (var index = 0; index < items.length; index++) {
	                    count++;
	                    if (count > 4) {
	                        break;
	                    }
	
	                    var formatItem = new CustomNumberFormat(items[index], self.customerCultureName);
	                    if (formatItem) {
	                        self.formatters.push(formatItem);
	                    }
	                }
	
	                if (!self.PositiveExpression()) {
	                    throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	                }
	            }
	        };
	
	        gfPrototype.GetFormatInfo = function (obj) {
	            var self = this;
	            if (self.FormatMode() === 0 /* CustomMode */) {
	                if (typeof (obj) === "string" && isNaN(obj)) {
	                    if (self.TextExpression()) {
	                        return self.TextExpression();
	                    } else {
	                        return self.PositiveExpression();
	                    }
	                } else if (formatterUtils.FormatConverter.IsNumber(obj) || formatterUtils.util.isType(obj, "boolean")) {
	                    var positive = self.PositiveExpression();
	                    var negative = self.NegativeExpression();
	                    var value = formatterUtils.FormatConverter.ToDouble(obj);
	
	                    var positiveHasCondition = positive && positive.ConditionFormatPart();
	                    var negativeHasCondition = negative && negative.ConditionFormatPart();
	                    var resultFormatter = self.isSingleFormatterInfo ? positive : keyword_null;
	                    if (positive) {
	                        if (positiveHasCondition) {
	                            if (positive.ConditionFormatPart().IsMeetCondition(value)) {
	                                resultFormatter = positive;
	                            }
	                        } else {
	                            if (value > 0 || (value === 0 && !self.ZeroExpression())) {
	                                resultFormatter = positive;
	                            }
	                        }
	                    }
	
	                    if (!resultFormatter && self.NegativeExpression()) {
	                        if (negativeHasCondition) {
	                            if (negative.ConditionFormatPart().IsMeetCondition(value)) {
	                                resultFormatter = negative;
	                            }
	                        } else {
	                            if (value < 0) {
	                                resultFormatter = negative;
	                            }
	                        }
	                    }
	
	                    if (!resultFormatter && self.ZeroExpression()) {
	                        if (value === 0) {
	                            resultFormatter = self.ZeroExpression();
	                        }
	                    }
	
	                    if (!resultFormatter && self.ZeroExpression()) {
	                        resultFormatter = self.ZeroExpression();
	                    }
	
	                    if (!resultFormatter && self.NegativeExpression()) {
	                        resultFormatter = self.NegativeExpression();
	                    }
	
	                    return resultFormatter;
	                }
	            } else if (self.FormatMode() === 1 /* StandardDateTimeMode */ || self.FormatMode() === 2 /* StandardNumericMode */) {
	                if (self.formatters && self.formatters.length === 1) {
	                    return self.formatters[0];
	                }
	            }
	
	            return keyword_null;
	        };
	
	        gfPrototype.RaisePropertyChanged = function (propertyName) {
	            var self = this;
	            if (self.PropertyChanged) {
	                for (var index = 0; index < self.PropertyChanged.length; index++) {
	                    var method = self.PropertyChanged[index];
	                    if (typeof (method) === "function") {
	                        method(self, propertyName);
	                    }
	                }
	            }
	        };
	        GeneralFormatter.defaultNumberFormatter = keyword_null;
	        GeneralFormatter.defaultGeneralFormatter = keyword_null;
	        GeneralFormatter.defaultShortDatePatternFormatter = keyword_null;
	        GeneralFormatter.defaultLongTimePatternFormatter = keyword_null;
	        GeneralFormatter.defaultSXDatetimePatternFormatter = keyword_null;
	        GeneralFormatter.defaultDMMMFormatter = keyword_null;
	        GeneralFormatter.defaultMMMYYFormatter = keyword_null;
	        GeneralFormatter.defaultHMMFormatter = keyword_null;
	        GeneralFormatter.defaultHMMSSFormatter = keyword_null;
	        GeneralFormatter.defaultHMMSS0Formatter = keyword_null;
	        GeneralFormatter.defaultShortDatePatternHMMFormatter = keyword_null;
	        GeneralFormatter.defaultShortDatePatternHMMSSFormatter = keyword_null;
	        GeneralFormatter.defaultShortDatePatternHMMSS0Formatter = keyword_null;
	        GeneralFormatter.defaultComboNumberFormatter1 = keyword_null;
	        GeneralFormatter.defaultComboNumberFormatter2 = keyword_null;
	        GeneralFormatter.defaultStandardNumberFormatter = keyword_null;
	        GeneralFormatter.defaultStandardPercentFormatter1 = keyword_null;
	        GeneralFormatter.defaultStandardPercentFormatter2 = keyword_null;
	        GeneralFormatter.defaultStandardGroupNumberFormatter1 = keyword_null;
	        GeneralFormatter.defaultStandardGroupNumberFormatter2 = keyword_null;
	        return GeneralFormatter;
	    })();
	    formatter.GeneralFormatter = GeneralFormatter;
	
	    //</editor-fold>
	    //<editor-fold desc="FormatPartBase">
	    var FormatPartBase = (function () {
	        function FormatPartBase(token) {
	            this._classNames = ["FormatPartBase"];
	
	            this.originalToken = token;
	        }
	
	        FormatPartBase.prototype.OriginalToken = function () {
	            return this.originalToken;
	        };
	
	        FormatPartBase.prototype.SupportedPartFormat = function () {
	            if (!FormatPartBase._supportedPartFormat) {
	                FormatPartBase._supportedPartFormat = ["ConditionFormatPart", "ColorFormatPart", "LocaleIDFormatPart"];
	            }
	            return FormatPartBase._supportedPartFormat;
	        };
	
	        FormatPartBase.Create = function (token) {
	            if (ConditionFormatPart.EvaluateFormat(token)) {
	                return new ConditionFormatPart(token);
	            } else if (DBNumberFormatPart.EvaluateFormat(token)) {
	                return new DBNumberFormatPart(token);
	            } else if (LocaleIDFormatPart.EvaluateFormat(token)) {
	                return new LocaleIDFormatPart(token);
	            } else if (ABSTimeFormatPart.EvaluateFormat(token)) {
	                return new ABSTimeFormatPart(token);
	            } else if (ColorFormatPart.EvaluateFormat(token)) {
	                return new ColorFormatPart(token);
	            } else {
	                return keyword_null;
	            }
	        };
	        return FormatPartBase;
	    })();
	
	    //</editor-fold>
	    //<editor-fold desc="ConditionFormatPart">
	    var ConditionFormatPart = (function (_super) {
	        __extends(ConditionFormatPart, _super);
	        function ConditionFormatPart(token) {
	            _super.call(this, token);
	            var self = this;
	            FormatPartBase.call(self, token);
	
	            self._classNames.push("ConditionFormatPart");
	            self._initFileds();
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	            if (stringEx.IsNullOrEmpty(content)) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            var tokenBuilder = "";
	            var index = 0;
	            var c = keyword_null;
	
	            for (; index < content.length; index++) {
	                c = content[index];
	                if (DefaultTokens.IsOperator(c)) {
	                    tokenBuilder += c;
	                } else {
	                    break;
	                }
	            }
	
	            if (!tokenBuilder) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            var strCompareOperator = tokenBuilder;
	            tokenBuilder = "";
	            switch (strCompareOperator) {
	                case "<":
	                    self.compareOperator = 4 /* LessThan */;
	                    break;
	                case "<=":
	                    self.compareOperator = 5 /* LessThanOrEqualsTo */;
	                    break;
	                case "=":
	                    self.compareOperator = 0 /* EqualsTo */;
	                    break;
	                case ">=":
	                    self.compareOperator = 3 /* GreaterThanOrEqualsTo */;
	                    break;
	                case ">":
	                    self.compareOperator = 2 /* GreaterThan */;
	                    break;
	                case "<>":
	                    self.compareOperator = 1 /* NotEqualsTo */;
	                    break;
	                default:
	                    throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            for (; index < content.length; index++) {
	                c = content[index];
	                if (DefaultTokens.IsOperator(c)) {
	                    throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	                }
	
	                tokenBuilder += c;
	            }
	
	            if (!tokenBuilder) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            var strValueNumber = tokenBuilder;
	            var tempValue = parseFloat(strValueNumber);
	            if (!isNaN(tempValue)) {
	                self.value = tempValue;
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	        }
	
	        var cfPrototype = ConditionFormatPart.prototype;
	
	        cfPrototype._initFileds = function () {
	            this.value = 0.0;
	            this.compareOperator = keyword_null;
	        };
	
	        cfPrototype.CompareOperator = function () {
	            return this.compareOperator;
	        };
	
	        cfPrototype.Value = function () {
	            return this.value;
	        };
	
	        cfPrototype.toString = function () {
	            var sb = "";
	            switch (this.compareOperator) {
	                case 0 /* EqualsTo */
	                :
	                    sb += ("=");
	                    break;
	                case 2 /* GreaterThan */
	                :
	                    sb += (">");
	                    break;
	                case 3 /* GreaterThanOrEqualsTo */
	                :
	                    sb += (">=");
	                    break;
	                case 4 /* LessThan */
	                :
	                    sb += ("<");
	                    break;
	                case 5 /* LessThanOrEqualsTo */
	                :
	                    sb += ("<=");
	                    break;
	                case 1 /* NotEqualsTo */
	                :
	                    sb += ("<>");
	                    break;
	                default:
	                    throw new Error();
	            }
	
	            sb += (this.value.toString());
	            var result = DefaultTokens.AddSquareBracket(sb);
	            return result;
	        };
	
	        cfPrototype.IsMeetCondition = function (value) {
	            var self = this;
	            switch (self.compareOperator) {
	                case 0 /* EqualsTo */
	                :
	                    return value === self.value;
	                case 2 /* GreaterThan */
	                :
	                    return value > self.value;
	                case 3 /* GreaterThanOrEqualsTo */
	                :
	                    return value >= self.value;
	                case 4 /* LessThan */
	                :
	                    return value < self.value;
	                case 5 /* LessThanOrEqualsTo */
	                :
	                    return value <= self.value;
	                case 1 /* NotEqualsTo */
	                :
	                    return value !== self.value;
	            }
	
	            return false;
	        };
	
	        ConditionFormatPart.EvaluateFormat = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return false;
	            }
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	
	            if (!content || content === stringEx.Empty) {
	                return false;
	            }
	
	            return DefaultTokens.IsOperator(content[0]);
	        };
	        return ConditionFormatPart;
	    })(FormatPartBase);
	
	    //</editor-fold>
	    //<editor-fold desc="ColorFormatPart">
	    var ColorFormatPart = (function (_super) {
	        __extends(ColorFormatPart, _super);
	        function ColorFormatPart(token) {
	            var self = this;
	            _super.call(self, token);
	            self.foreColor = "black";
	            self.index = -1;
	            self.colorName = keyword_null;
	            FormatPartBase.call(self, token);
	            self._classNames.push("ColorFormatPart");
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	            if (!content || content === stringEx.Empty) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            try {
	                //        var t = FormatterColorHelper.FromStringValue(content);
	                //        if (t)
	                //            self.foreColor = t;
	                self.foreColor = content;
	                self.colorName = content;
	                return;
	            } catch (ex) {
	            }
	
	            // parse by color index
	            if (content.length > "Color".length) {
	                content = formatterUtils.StringHelper.Remove(content, 0, "Color".length);
	                var index = -1;
	                var tempIndex = parseInt(content, 10);
	                if (!isNaN(tempIndex)) {
	                    index = tempIndex;
	                    if (index >= 1 && index <= 56) {
	                        //todo
	                        //                self.foreColor = FormatterColorHelper.ColorFromIndex(index);
	                        //                self.index = index;
	                        return;
	                    }
	                }
	            }
	
	            throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	        }
	
	        var cpPrototype = ColorFormatPart.prototype;
	
	        cpPrototype.ForeColor = function () {
	            return this.foreColor;
	        };
	
	        cpPrototype.toString = function () {
	            var self = this;
	            if (self.index > -1) {
	                return DefaultTokens.AddSquareBracket("Color" + self.index);
	            } else if (self.colorName) {
	                return DefaultTokens.AddSquareBracket(self.colorName);
	            }
	
	            throw new Error();
	        };
	
	        ColorFormatPart.EvaluateFormat = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return false;
	            }
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	
	            if (!content || content === stringEx.Empty) {
	                return false;
	            }
	
	            if (content.length < 3) {
	                return false;
	            }
	
	            if (!isNaN(token[token.length - 1])) {
	                return formatterUtils.StringHelper.StartsWith(token, "Color", 1 /* CurrentCultureIgnoreCase */);
	            } else {
	                return token[0] !== token[1];
	            }
	        };
	        return ColorFormatPart;
	    })(FormatPartBase);
	
	    //</editor-fold>
	    //<editor-fold desc="ABSTimeFormatPart">
	    var ABSTimeFormatPart = (function (_super) {
	        __extends(ABSTimeFormatPart, _super);
	        function ABSTimeFormatPart(token) {
	            _super.call(this, token);
	            var self = this;
	            FormatPartBase.call(self, token);
	
	            self._classNames.push("ABSTimeFormatPart");
	            self._initFileds();
	
	            if (ABSTimeFormatPart.EvaluateFormat(token)) {
	                self.token = token.toLowerCase();
	                if (self.token[1] === ABSTimeFormatPart.HoursABSContent) {
	                    self.type = 0 /* Hour */;
	                } else if (self.token[1] === ABSTimeFormatPart.MinuteABSContent) {
	                    self.type = 1 /* Minute */;
	                } else if (self.token[1] === ABSTimeFormatPart.SecondABSContent) {
	                    self.type = 2 /* Second */;
	                } else {
	                    throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	                }
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            var sb = "";
	            for (var n = 0; n < self.token.length - 2; n++) {
	                sb += ("0");
	            }
	
	            self.formatString = sb;
	        }
	
	        var apPrototype = ABSTimeFormatPart.prototype;
	
	        apPrototype._initFileds = function () {
	            this.token = keyword_null;
	            this.type = keyword_null;
	            this.formatString = keyword_null;
	        };
	
	        apPrototype.FormatString = function () {
	            return this.formatString;
	        };
	
	        apPrototype.TimePartType = function () {
	            return this.type;
	        };
	        apPrototype.Token = function () {
	            return this.token;
	        };
	
	        ABSTimeFormatPart.EvaluateFormat = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return false;
	            }
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	
	            if (!content || content === stringEx.Empty) {
	                return false;
	            }
	
	            content = content.toLowerCase();
	            var c = keyword_null;
	            for (var n = 0; n < content.length; n++) {
	                if (!c) {
	                    c = content[n];
	                }
	
	                var fp = ABSTimeFormatPart;
	                if (c !== fp.HoursABSContent && c !== fp.MinuteABSContent && c !== fp.SecondABSContent) {
	                    return false;
	                }
	
	                if (c !== content[n]) {
	                    return false;
	                }
	            }
	
	            return true;
	        };
	        ABSTimeFormatPart.HoursABSContent = "h";
	        ABSTimeFormatPart.MinuteABSContent = "m";
	        ABSTimeFormatPart.SecondABSContent = "s";
	        return ABSTimeFormatPart;
	    })(FormatPartBase);
	
	    //</editor-fold>
	    //<editor-fold desc="DBNumber">
	    var DBNumber = (function () {
	        function DBNumber(units, numbers) {
	            var self = this;
	            self._classNames = ["DBNumber"];
	            var key = keyword_null, u = keyword_null;
	
	            if (units) {
	                self.units = [];
	                for (var i = 0; i < units.length; i++) {
	                    u = units[i];
	                    if (u === 0) {
	                        self.units.push(stringEx.Empty);
	                    } else {
	                        self.units.push(String.fromCharCode(u));
	                    }
	                }
	            }
	
	            if (numbers) {
	                self.numbers = [];
	                for (var i = 0; i < numbers.length; i++) {
	                    u = numbers[i];
	                    if (u === 0) {
	                        self.numbers.push(stringEx.Empty);
	                    } else {
	                        self.numbers.push(String.fromCharCode(u));
	                    }
	                }
	            }
	        }
	
	        DBNumber.JapaneseDBNum1 = function () {
	            if (!DBNumber.japaneseDBNum1) {
	                DBNumber.japaneseDBNum1 = new DBNumber(DBNumber.JapaneseNumberUnitLetter1, DBNumber.JapaneseNumberLetterValues1);
	            }
	            return DBNumber.japaneseDBNum1;
	        };
	
	        DBNumber.JapaneseDBNum2 = function () {
	            if (!DBNumber.japaneseDBNum2) {
	                DBNumber.japaneseDBNum2 = new DBNumber(DBNumber.JapaneseNumberUnitLetter2, DBNumber.JapaneseNumberLetterValues2);
	            }
	            return DBNumber.japaneseDBNum2;
	        };
	
	        DBNumber.JapaneseDBNum3 = function () {
	            if (!DBNumber.japaneseDBNum3) {
	                DBNumber.japaneseDBNum3 = new DBNumber(keyword_null, DBNumber.JapaneseNumberLetterValues3);
	            }
	            return DBNumber.japaneseDBNum3;
	        };
	
	        //DBNumber Public properties
	        DBNumber.prototype.Units = function () {
	            return this.units;
	        };
	        DBNumber.prototype.Numbers = function () {
	            return this.numbers;
	        };
	        DBNumber.japaneseDBNum1 = keyword_null;
	        DBNumber.japaneseDBNum2 = keyword_null;
	        DBNumber.japaneseDBNum3 = keyword_null;
	
	        DBNumber.JapaneseNumberUnitLetter1 = [0x5343, 0x767e, 0x5341, 0x5146, 0x5343, 0x767e, 0x5341, 0x5104, 0x5343, 0x767e, 0x5341, 0x4e07, 0x5343, 0x767e, 0x5341, 0x0];
	        DBNumber.JapaneseNumberUnitLetter2 = [0x9621, 0x767e, 0x62fe, 0x5146, 0x9621, 0x767e, 0x62fe, 0x5104, 0x9621, 0x767e, 0x62fe, 0x842c, 0x9621, 0x767e, 0x62fe, 0x0];
	        DBNumber.JapaneseNumberLetterValues1 = [0x3007, 0x4e00, 0x4e8c, 0x4e09, 0x56db, 0x4e94, 0x516d, 0x4e03, 0x516b, 0x4e5d];
	        DBNumber.JapaneseNumberLetterValues2 = [0x3007, 0x58f1, 0x5f10, 0x53c2, 0x56db, 0x4f0d, 0x516d, 0x4e03, 0x516b, 0x4e5d];
	        DBNumber.JapaneseNumberLetterValues3 = [0xff10, 0xff11, 0xff12, 0xff13, 0xff14, 0xff15, 0xff16, 0xff17, 0xff18, 0xff19];
	        return DBNumber;
	    })();
	
	    //</editor-fold>
	    var DBNumberFormatPart = (function (_super) {
	        __extends(DBNumberFormatPart, _super);
	        //<editor-fold desc="DBNumberFormatPart">
	        function DBNumberFormatPart(token) {
	            _super.call(this, token);
	            this.token = keyword_null;
	            this.type = 0;
	            var self = this;
	            self._classNames.push("DBNumberFormatPart");
	
	            if (DBNumberFormatPart.EvaluateFormat(token)) {
	                self.token = token;
	                var content = DefaultTokens.TrimSquareBracket(token);
	                var strType = formatterUtils.StringHelper.Remove(content, 0, "dbnum".length);
	                self.type = parseInt(strType, 10);
	                if (self.type < 0 || self.type > 3) {
	                    throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	                }
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	        }
	
	        var npPrototype = DBNumberFormatPart.prototype;
	
	        npPrototype.Token = function () {
	            if (!this.token) {
	                return stringEx.Empty;
	            }
	
	            return this.token;
	        };
	
	        npPrototype.Type = function () {
	            return this.type;
	        };
	
	        npPrototype.ReplaceNumberString = function (s, dbNumber, isNumber) {
	            if (!s || s === stringEx.Empty) {
	                return s;
	            }
	
	            var strData = s;
	            var str = s;
	            var end = -1;
	            var start = -1;
	            var hasPoint = false;
	            var token = keyword_null;
	            var ret = keyword_null;
	            var formatedNumber = keyword_null;
	
	            for (var n = s.length - 1; n >= 0; n--) {
	                var c = str[n];
	                if (!isNaN(c) || (DefaultTokens.IsEquals(c, DefaultTokens.DecimalSeparator, false) && !hasPoint)) {
	                    if (DefaultTokens.IsEquals(c, DefaultTokens.DecimalSeparator, false)) {
	                        hasPoint = true;
	                    }
	
	                    if (end === -1) {
	                        end = n;
	                    }
	
	                    start = n;
	                } else {
	                    if (start > -1 && end > -1) {
	                        token = str.substr(start, end - start + 1);
	                        ret = parseFloat(token);
	                        if (!isNaN(ret)) {
	                            formatedNumber = this.NumberString(token, dbNumber, isNumber); //NumberString(ret, dbNuber, isNumber);
	                            strData = formatterUtils.StringHelper.Remove(strData, start, end - start + 1);
	                            strData = formatterUtils.StringHelper.Insert(strData, start, formatedNumber);
	                        }
	
	                        end = -1;
	                        start = -1;
	                        hasPoint = false;
	                    }
	                }
	            }
	
	            if (start > -1 && end > -1) {
	                token = str.substr(start, end - start + 1);
	                ret = parseFloat(token);
	                if (!isNaN(ret)) {
	                    formatedNumber = this.NumberString(token, dbNumber, isNumber); // NumberString(ret, dbNuber, isNumber);
	                    strData = formatterUtils.StringHelper.Remove(strData, start, end - start + 1);
	                    strData = formatterUtils.StringHelper.Insert(strData, start, formatedNumber);
	                }
	
	                end = -1;
	                start = -1;
	                hasPoint = false;
	            }
	
	            return strData;
	        };
	
	        npPrototype.NumberString = function (value, dbNumber, isNumber) {
	            var partValues = value.split('.');
	            if (partValues) {
	                if (partValues.length === 1) {
	                    return DBNumberFormatPart.FormatNumberString(partValues[0], dbNumber.Numbers(), isNumber ? dbNumber.Units() : keyword_null);
	                } else if (partValues.length === 2) {
	                    var integerString = DBNumberFormatPart.FormatNumberString(partValues[0], dbNumber.Numbers(), isNumber ? dbNumber.Units() : keyword_null);
	                    var decimalString = DBNumberFormatPart.FormatNumberString(partValues[1], dbNumber.Numbers());
	                    return integerString + "." + decimalString;
	                }
	            }
	
	            throw new Error(globalize.StringResoures.SR.Exp_ValueIllegal);
	        };
	
	        npPrototype.toString = function () {
	            if (this.type > -1) {
	                return DefaultTokens.AddSquareBracket("DBNum" + this.type);
	            }
	
	            throw new Error();
	        };
	
	        DBNumberFormatPart.EvaluateFormat = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return false;
	            }
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	
	            if (!content || content === stringEx.Empty) {
	                return false;
	            }
	
	            if (formatterUtils.StringHelper.StartsWith(content, "DBNum", 1 /* CurrentCultureIgnoreCase */)) {
	                return true;
	            }
	
	            return false;
	        };
	
	        DBNumberFormatPart.FormatNumberString = function (value, numbers, units) {
	            var strValue = value;
	            var n = 0;
	            var c = keyword_null;
	            var nC = 0;
	
	            if (arguments.length === 2) {
	                var sb = "";
	                for (n = 0; n < strValue.length; n++) {
	                    c = strValue.substr(n, 1);
	                    nC = parseInt(c, 10);
	                    sb += (numbers[nC]);
	                }
	
	                return sb;
	            } else if (arguments.length === 3) {
	                if (!units) {
	                    return DBNumberFormatPart.FormatNumberString(value, numbers);
	                }
	
	                var zeroCount = 0;
	                var result = "";
	                var maxLength = strValue.length;
	                var inZero = false;
	                var numberLetter = [];
	                for (n = 0; n < maxLength; n++) {
	                    var validCharIndex = units.length - 1 - n;
	                    if (validCharIndex > -1) {
	                        numberLetter.push(units[validCharIndex].toString());
	                    } else {
	                        numberLetter.push(stringEx.Empty);
	                    }
	                }
	                var tmpLetters = [];
	                for (var i = numberLetter.length - 1; i >= 0; i--) {
	                    tmpLetters[numberLetter.length - i - 1] = numberLetter[i];
	                }
	                numberLetter = tmpLetters;
	                var isZeroAcceptable = false;
	                for (var i = 0; i < maxLength; i++) {
	                    c = strValue.substr(i, 1);
	                    nC = parseInt(c, 10);
	                    var ch1 = stringEx.Empty;
	                    var ch2 = stringEx.Empty;
	
	                    if (maxLength - i - 16 > 0) {
	                        ch1 = numbers[nC];
	                        ch2 = "";
	                        isZeroAcceptable = true;
	                    } else if (i !== (maxLength - 1) && i !== (maxLength - 5) && i !== (maxLength - 9) && i !== (maxLength - 13)) {
	                        if (c === "0") {
	                            ch1 = "";
	                            ch2 = "";
	                            zeroCount = zeroCount + 1;
	                        } else {
	                            if (c !== "0" && zeroCount !== 0) {
	                                ch1 = numbers[0] + numbers[nC];
	                                ch2 = numberLetter[i];
	                                zeroCount = 0;
	                            } else {
	                                ch1 = numbers[nC];
	                                ch2 = numberLetter[i];
	                                zeroCount = 0;
	                            }
	                        }
	                    } else {
	                        if (c !== "0" && zeroCount !== 0) {
	                            ch1 = numbers[0] + numbers[nC];
	                            ch2 = numberLetter[i];
	                            zeroCount = 0;
	                        } else {
	                            if ((c !== "0" && zeroCount === 0) || isZeroAcceptable) {
	                                ch1 = numbers[nC];
	                                ch2 = numberLetter[i];
	                                zeroCount = 0;
	                                isZeroAcceptable = false;
	                            } else {
	                                if (c === "0" && zeroCount >= 3) {
	                                    ch1 = "";
	                                    ch2 = "";
	                                    zeroCount = zeroCount + 1;
	                                } else {
	                                    if (maxLength >= 11) {
	                                        ch1 = "";
	                                        zeroCount = zeroCount + 1;
	                                    } else {
	                                        ch1 = "";
	                                        ch2 = numberLetter[i];
	                                        zeroCount = zeroCount + 1;
	                                    }
	                                }
	                            }
	                        }
	                    }
	
	                    var isZero = (ch1 + ch2) === stringEx.Empty;
	                    if (!isZero) {
	                        inZero = false;
	                    }
	
	                    if (i === (maxLength - 13) && !inZero) {
	                        ch2 = numberLetter[i];
	                        inZero = true;
	                    }
	
	                    if (i === (maxLength - 9) && !inZero) {
	                        ch2 = numberLetter[i];
	                        inZero = true;
	                    }
	
	                    if (i === (maxLength - 1)) {
	                        ch2 = numberLetter[i];
	                        inZero = true;
	                    }
	
	                    result = result + ch1 + ch2;
	                }
	
	                var iValue = parseInt(value, 10);
	                if (!isNaN(iValue)) {
	                    if (iValue === 0) {
	                        return numbers[0];
	                    }
	                }
	
	                return result;
	            }
	        };
	        return DBNumberFormatPart;
	    })(FormatPartBase);
	
	    //<editor-fold desc="NumberHelper">
	    var NumberHelper = (function () {
	        function NumberHelper() {
	        }
	
	        NumberHelper.ParseHexString = function (str) {
	            if (!str || str === stringEx.Empty) {
	                throw new Error(globalize.StringResoures.SR.Exp_StringIllegal);
	            }
	
	            return parseInt(str, 16);
	        };
	        NumberHelper.FixJapaneseChars = function (s) {
	            return s;
	        };
	        NumberHelper.GetFraction = function (value, denominatorDigits, out_integer, out_numerator, out_denominator) {
	            var integer = 0;
	            var numerator = 0;
	            var denominator = 0;
	            var decimalValue = 0;
	            if (value > 0) {
	                decimalValue = value - Math_ceil(value) + 1.0;
	                if (decimalValue == 1.0) {
	                    decimalValue = 0;
	                    integer = value;
	                } else
	                    integer = Math_ceil(value) - 1.0;
	            } else if (value < 0) {
	                integer = Math_ceil(value);
	                decimalValue = Math_ceil(value) - value;
	            }
	
	            var min = 2;
	            var max = 9;
	            min = Math_pow(10, denominatorDigits - 1);
	            max = Math_pow(10, denominatorDigits) - 1;
	            if (min < 2)
	                min = 2;
	            if (max < 2)
	                max = 2;
	            var isValueSet = false;
	            var lastTriedValue = 0;
	            for (var n = min; n <= max; n++) {
	                var valueTemp = n * decimalValue;
	                var valueIntegerTemp = Math_round(valueTemp);
	                var triedValue = valueIntegerTemp / n;
	                var deviation = Math_abs(triedValue - decimalValue);
	                if (isValueSet ? deviation < Math_abs(lastTriedValue - decimalValue) : true) {
	                    isValueSet = true;
	                    lastTriedValue = triedValue;
	                    numerator = valueIntegerTemp;
	                    denominator = n;
	                    if (deviation < 0.0005) {
	                        break;
	                    }
	                }
	            }
	            out_integer.value = integer;
	            out_numerator.value = numerator;
	            out_denominator.value = denominator;
	            return isValueSet;
	        };
	        return NumberHelper;
	    })();
	
	    //</editor-fold>
	    //<editor-fold desc="CultureHelper">
	    var CultureHelper = (function () {
	        function CultureHelper() {
	        }
	
	        CultureHelper.AllowScience = function (cultureName) {
	            if (cultureName) {
	                return (!(cultureName.indexOf("ja") === 0) && !(cultureName.indexOf("zh") === 0));
	            }
	            return true;
	        };
	
	        CultureHelper.CreateCultureInfo = function (cultureID) {
	            switch (cultureID) {
	                case 0x0409:
	                    return globalize.Cultures._CultureInfo.getCulture(CultureHelper.EnglishUnitedStates);
	                case 0x0411:
	                    return globalize.Cultures._CultureInfo.getCulture(CultureHelper.JapanneseJapan);
	                default:
	                    return globalize.Cultures._CultureInfo.currentCulture();
	            }
	        };
	        CultureHelper.JapanneseJapan = "ja-JP";
	        CultureHelper.EnglishUnitedStates = "en-US";
	        return CultureHelper;
	    })();
	
	    //</editor-fold>
	    //<editor-fold desc="LocaleIDFormatPart">
	    var LocaleIDFormatPart = (function (_super) {
	        __extends(LocaleIDFormatPart, _super);
	        function LocaleIDFormatPart(token) {
	            var self = this;
	            _super.call(self, token);
	            self.currencySymbol = keyword_null;
	            self.locateID = -1;
	            self.cultureInfo = keyword_null;
	            self.content = keyword_null;
	            FormatPartBase.call(self, token);
	
	            self._classNames.push("LocaleIDFormatPart");
	
	            if (!token) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIsNull);
	            }
	
	            if (token === stringEx.Empty) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            self.content = DefaultTokens.TrimSquareBracket(token);
	            var contentTemp = self.content;
	            if (!contentTemp || contentTemp === stringEx.Empty) {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            // remove ASCII_DOLLAR_SIGN
	            if (DefaultTokens.IsEquals(contentTemp[0], DefaultTokens.Dollar, false)) {
	                contentTemp = formatterUtils.StringHelper.Remove(contentTemp, 0, 1);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            // get UTF16-ANY
	            var minus = contentTemp.indexOf(DefaultTokens.HyphenMinus);
	            if (minus > -1) {
	                self.currencySymbol = contentTemp.substr(0, minus);
	
	                // remove utf16any
	                contentTemp = formatterUtils.StringHelper.Remove(contentTemp, 0, minus);
	            } else {
	                self.currencySymbol = contentTemp;
	                return;
	            }
	
	            // get ASCII-HYPHEN-MINUS
	            if (DefaultTokens.IsEquals(contentTemp[0], DefaultTokens.HyphenMinus, false)) {
	                contentTemp = formatterUtils.StringHelper.Remove(contentTemp, 0, 1);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	
	            // get 3*8ASCII-DIGIT-HEXADECIMAL
	            if (contentTemp.length > 0) {
	                self.locateID = NumberHelper.ParseHexString(contentTemp);
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_TokenIllegal);
	            }
	        }
	
	        var lpPrototype = LocaleIDFormatPart.prototype;
	
	        lpPrototype.CultureInfo = function () {
	            var self = this;
	            if (!self.cultureInfo) {
	                self.cultureInfo = CultureHelper.CreateCultureInfo(self.locateID);
	                if (self.currencySymbol && self.currencySymbol !== stringEx.Empty) {
	                    if (self.cultureInfo && !self.cultureInfo.NumberFormat().isReadOnly) {
	                        self.cultureInfo.NumberFormat().currencySymbol = self.currencySymbol;
	                    }
	                }
	            }
	            return self.cultureInfo;
	        };
	
	        lpPrototype.CurrencySymbol = function () {
	            var self = this;
	            if (self.currencySymbol) {
	                return this.EncodeSymbol(self.currencySymbol);
	            }
	
	            return stringEx.Empty;
	        };
	
	        lpPrototype.AllowScience = function () {
	            var self = this;
	            if (self.cultureInfo) {
	                return CultureHelper.AllowScience(self.cultureInfo.Name());
	            }
	        };
	
	        lpPrototype.GetDBNumber = function (type) {
	            var regionID = this.locateID & 0x00ff;
	
	            switch (regionID) {
	                case 0x11:
	                    switch (type) {
	                        case 1:
	                            return DBNumber.JapaneseDBNum1();
	                        case 2:
	                            return DBNumber.JapaneseDBNum2();
	                        case 3:
	                            return DBNumber.JapaneseDBNum3();
	                    }
	
	                    break;
	                default:
	                    break;
	            }
	
	            return keyword_null;
	        };
	
	        lpPrototype.toString = function () {
	            if (this.content) {
	                return DefaultTokens.AddSquareBracket(this.content);
	            }
	
	            return stringEx.Empty;
	        };
	
	        lpPrototype.EncodeSymbol = function (symbol) {
	            return formatterUtils.StringHelper.Replace(symbol, "\\.", "'.'");
	        };
	
	        LocaleIDFormatPart.EvaluateFormat = function (token) {
	            if (!token || token === stringEx.Empty) {
	                return false;
	            }
	
	            var content = DefaultTokens.TrimSquareBracket(token);
	
	            if (!content || content === stringEx.Empty) {
	                return false;
	            }
	
	            return DefaultTokens.IsEquals(content[0], DefaultTokens.Dollar, false);
	        };
	        return LocaleIDFormatPart;
	    })(FormatPartBase);
	
	    var DefaultDateTimeNumberStringConverter = (function () {
	        function DefaultDateTimeNumberStringConverter() {
	        }
	
	        DefaultDateTimeNumberStringConverter.prototype.ConvertTo = function (num, value, isGeneralNumber, locale, dbNumber) {
	            var strTemp = num;
	            if (locale != keyword_null && dbNumber != keyword_null && value instanceof Date) {
	                var dbNumberTemp = locale.GetDBNumber(dbNumber.Type());
	                strTemp = dbNumber.ReplaceNumberString(strTemp, dbNumberTemp, true);
	                strTemp = strTemp.replace(DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearFourDigit, new formatterUtils._DateTimeHelper(value).localeFormat(NumberFormatDateTime.YearFourDigit));
	                strTemp = strTemp.replace(DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearTwoDigit, new formatterUtils._DateTimeHelper(value).localeFormat(NumberFormatDateTime.YearTwoDigit));
	                strTemp = dbNumber.ReplaceNumberString(strTemp, dbNumberTemp, false);
	            }
	            return strTemp;
	        };
	        return DefaultDateTimeNumberStringConverter;
	    })();
	
	    //<editor-fold desc="NumberFormatDateTime">
	    var NumberFormatDateTime = (function (_super) {
	        __extends(NumberFormatDateTime, _super);
	        function NumberFormatDateTime(format, absTimeParts, partLocaleID, dbNumberFormatPart, cultureName) {
	            var self = this;
	            _super.call(self, partLocaleID, dbNumberFormatPart, cultureName);
	            self.baseNumberStringConverter = NumberFormatBase.prototype.NumberStringConverter;
	            self.baseDateTimeFormatInfo = NumberFormatBase.prototype.DateTimeFormatInfo;
	            self.baseCultureName = NumberFormatBase.prototype.CultureName;
	            self.validDateTimeFormatString = keyword_null;
	            self.formatString = keyword_null;
	            self.hasJD = false;
	            self.absoluteTime = keyword_null;
	            self.absTimeParts = keyword_null;
	            self.hasYearDelay = false;
	            self.exactlyMatch = false;
	
	            self._classNames.push("NumberFormatDateTime");
	
	            self.exactlyMatch = false;
	            self.formatString = self.FixFormat(NumberFormatBase.TrimNotSupportSymbol(format));
	            self.absTimeParts = absTimeParts;
	            self._init(format, absTimeParts, partLocaleID, dbNumberFormatPart);
	        }
	
	        //NumberFormatDateTime static Methods
	        NumberFormatDateTime.EvaluateFormat = function (format) {
	            return NumberFormatBase.ContainsKeywords(format, NumberFormatDateTime.keyWords, NumberFormatDateTime.keyWordsSet());
	        };
	
	        var nfPrototype = NumberFormatDateTime.prototype;
	
	        nfPrototype._init = function (format, absTimeParts, partLocaleID, dbNumberFormatPart) {
	            var self = this;
	            var formatTemp = {'value': self.formatString};
	            var selfClass = NumberFormatDateTime;
	            if (selfClass.EvaluateFormat(formatTemp.value)) {
	                var hasAMPM = self.ProcessAMPM(formatTemp);
	
	                // mmmmm -> "@MMMMM"
	                self.hasJD = self.Replace(formatTemp.value, selfClass.MonthJD, "\"" + selfClass.PlaceholderMonthJD + "\"", true, false, formatTemp, false, false);
	
	                // mmmm -> MMMM
	                self.Replace(formatTemp.value, selfClass.MonthUnabbreviated, selfClass.StandardMonthUnabbreviated, true, false, formatTemp, false, false);
	
	                // mmm -> MMM
	                self.Replace(formatTemp.value, selfClass.MonthAbbreviation, selfClass.StandardMonthAbbreviation, true, false, formatTemp, false, false);
	
	                // mm -> MM
	                self.Replace(formatTemp.value, selfClass.MonthTwoDigit, selfClass.StandardMonthTwoDigit, true, false, formatTemp, false, false);
	
	                // m -> %M
	                self.Replace(formatTemp.value, selfClass.MonthSingleDigit, selfClass.StandardMonthSingleDigit, true, false, formatTemp, false, false);
	
	                // aaa -> ddd
	                self.Replace(formatTemp.value, selfClass.DayWeekDayAbbreviation, selfClass.StandardDayWeekDayAbbreviation, true, true, formatTemp, false, true);
	
	                // aaaa -> dddd
	                self.Replace(formatTemp.value, selfClass.DayWeekDayUnabbreviated, selfClass.StandardDayWeekDayUnabbreviated, true, true, formatTemp, false, true);
	
	                // m -> %m
	                self.Replace(formatTemp.value, selfClass.MinuteSingleDigit, selfClass.StandardMinuteSingleDigit, false, true, formatTemp, false, false);
	                if (!hasAMPM) {
	                    // h -> H
	                    self.Replace(formatTemp.value, selfClass.HoursSingleDigit, selfClass.StandardHourSingleDigit, true, true, formatTemp, false, false);
	
	                    // hh -> HH
	                    self.Replace(formatTemp.value, selfClass.HoursTwoDigit, selfClass.StandardHourTwoDigit, true, true, formatTemp, false, false);
	                }
	
	                // s -> %s
	                self.Replace(formatTemp.value, selfClass.SecondSingleDigit, selfClass.StandardSecondSingleDigit, true, true, formatTemp, false, true);
	
	                // .000 -> .fff
	                //self.Replace(formatTemp.value, selfClass.SubSecondThreeDigit, selfClass.StandardSubSecondThreeDigit, true, true, formatTemp, false, true);
	                // .00 -> .ff
	                //self.Replace(formatTemp.value, selfClass.SubSecondTwoDigit, selfClass.StandardSubSecondTwoDigit, true, true, formatTemp, false, true);
	                // .0 -> .f
	                //self.Replace(formatTemp.value, selfClass.SubSecondSingleDigit, selfClass.StandardSubSecondSingleDigit, true, true, formatTemp, false, true);
	                // era year mustn't be replace to delay formatting. era year"e" always display the era years not Gregorian year(e.g. never display 2008.).
	                if (self.PartDBNumberFormat() && self.PartLocaleID()) {
	                    // yyyy -> "@yyyy"
	                    self.hasYearDelay = self.hasYearDelay || self.Replace(formatTemp.value, selfClass.YearFourDigit, "\"" + DefaultTokens.ReplacePlaceholder + selfClass.YearFourDigit + "\"", true, false, formatTemp, false, true);
	
	                    // yy -> "@yy"
	                    self.hasYearDelay = self.hasYearDelay || self.Replace(formatTemp.value, selfClass.YearTwoDigit, "\"" + DefaultTokens.ReplacePlaceholder + selfClass.YearTwoDigit + "\"", true, false, formatTemp, false, true);
	                }
	
	                //  --------------------------------------------
	                // Cylj comment these codes at 2014/1/16.
	                // SpreadX use .net framework to format, so SX should replace the 'e' to 'y',
	                // SpreadH format date by ourself, so use 'e' directly.
	                //if (self._isJanpaneseCulture()) //for janpan culture
	                //{
	                //    // e -> y
	                //    self.Replace(formatTemp.value, selfClass.EraYear, selfClass.YearSingleDigit, true, false, formatTemp, false, true);
	                //    // ee -> yy
	                //    self.Replace(formatTemp.value, selfClass.EraYear + selfClass.EraYear, selfClass.YearTwoDigit, true, false, formatTemp, false, true);
	                //    // eee -> yy
	                //    self.Replace(formatTemp.value, selfClass.EraYear + selfClass.EraYear + selfClass.EraYear, selfClass.YearTwoDigit, true, false, formatTemp, false, true);
	                //} else {
	                //    // e -> yyyy
	                //    self.Replace(formatTemp.value, selfClass.EraYear, selfClass.YearFourDigit, true, false, formatTemp, false, true);
	                //    // ee -> yyyy
	                //    self.Replace(formatTemp.value, selfClass.EraYear + selfClass.EraYear, selfClass.YearFourDigit, true, false, formatTemp, false, true);
	                //    // eee -> yyyy
	                //    self.Replace(formatTemp.value, selfClass.EraYear + selfClass.EraYear + selfClass.EraYear, selfClass.YearFourDigit, true, false, formatTemp, false, true);
	                //}
	                // y -> %y
	                //self.Replace(formatTemp.value, selfClass.YearSingleDigit, selfClass.StandardYearSingleDigit, true, false, formatTemp, false, true);
	                //  --------------------------------------------
	                if (self.absTimeParts) {
	                    for (var key = 0; key < self.absTimeParts.length; key++) {
	                        var absPart = self.absTimeParts[key];
	                        self.Replace(formatTemp.value, absPart.token, DefaultTokens.ReplacePlaceholder + absPart.token, true, true, formatTemp, false, true);
	                    }
	                }
	
	                self.validDateTimeFormatString = formatTemp.value;
	            } else {
	                throw new Error(globalize.StringResoures.SR.Exp_FormatIllegal);
	            }
	        };
	
	        nfPrototype._isJanpaneseCulture = function () {
	            var self = this;
	            var partLocalID = self.PartLocaleID();
	            if (partLocalID !== keyword_null && partLocalID.CultureInfo() !== keyword_null) {
	                if (partLocalID.CultureInfo() === globalize.Cultures._CultureInfo.japanCulture()) {
	                    return true;
	                }
	            } else if (self.CultureName() === globalize.Cultures._CultureInfo.japanCulture().Name()) {
	                return true;
	            }
	            return false;
	        };
	
	        nfPrototype.NumberStringConverter = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.baseNumberStringConverter()) {
	                    return self.baseNumberStringConverter();
	                }
	
	                return NumberFormatDateTime.defaultDateTimeNumberStringConverter;
	            } else {
	                //Set
	                self.baseNumberStringConverter(value);
	                return value;
	            }
	        };
	
	        nfPrototype.AbsoluteTime = function () {
	            var self = this;
	            if (self.absoluteTime) {
	                return self.absoluteTime;
	            }
	
	            return NumberFormatDateTime.defaultAbsoluteTime;
	        };
	
	        nfPrototype.FormatString = function () {
	            return this.formatString;
	        };
	
	        nfPrototype.DateTimeFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.baseDateTimeFormatInfo()) {
	                    return self.baseDateTimeFormatInfo();
	                }
	                if (self.PartLocaleID() && self.PartLocaleID().CultureInfo()) {
	                    return self.PartLocaleID().CultureInfo().DateTimeFormat();
	                }
	
	                if (self.baseCultureName()) {
	                    return globalize.Cultures._CultureInfo.getCulture(self.baseCultureName()).DateTimeFormat();
	                }
	
	                return DefaultTokens.DateTimeFormatInfo();
	            } else {
	                //Set
	                self.baseDateTimeFormatInfo(value);
	                return value;
	            }
	        };
	
	        nfPrototype.ExcelCompatibleFormatString = function () {
	            var self = this;
	            var formatTemp = self.formatString;
	            var selfClass = NumberFormatDateTime;
	            var result = {'value': formatTemp};
	
	            // MMMM -> mmmm
	            self.Replace(formatTemp, selfClass.StandardAMPMSingleDigit, self.CurrentAMPM(), true, true, result, false, true);
	
	            // MMMM -> mmmm
	            self.Replace(formatTemp, selfClass.StandardMonthUnabbreviated, selfClass.MonthUnabbreviated, true, false, result, false, true);
	
	            // MMM -> mmm
	            self.Replace(formatTemp, selfClass.StandardMonthAbbreviation, selfClass.MonthAbbreviation, true, false, result, false, true);
	
	            // MM -> mm
	            self.Replace(formatTemp, selfClass.StandardMonthTwoDigit, selfClass.MonthTwoDigit, true, false, result, false, true);
	
	            // %M -> m
	            self.Replace(formatTemp, selfClass.StandardMonthSingleDigit, selfClass.MonthSingleDigit, true, false, result, false, true);
	
	            // ddd -> aaa
	            self.Replace(formatTemp, selfClass.StandardDayWeekDayAbbreviation, selfClass.DayWeekDayAbbreviation, true, true, result, false, true);
	
	            // dddd -> aaaa
	            self.Replace(formatTemp, selfClass.StandardDayWeekDayUnabbreviated, selfClass.DayWeekDayUnabbreviated, true, true, result, false, true);
	
	            // %m -> m
	            self.Replace(formatTemp, selfClass.StandardMinuteSingleDigit, selfClass.MinuteSingleDigit, false, true, result, false, true);
	
	            // HH -> self.formatTemp,
	            self.Replace(formatTemp, selfClass.StandardHourSingleDigit, selfClass.HoursSingleDigit, true, true, result, false, false);
	
	            // H -> h
	            self.Replace(formatTemp, selfClass.StandardHourTwoDigit, selfClass.HoursTwoDigit, true, true, result, false, false);
	
	            // %s -> s
	            self.Replace(formatTemp, selfClass.StandardSecondSingleDigit, selfClass.SecondSingleDigit, true, true, result, false, true);
	
	            // .fff -> .000
	            self.Replace(formatTemp, selfClass.StandardSubSecondThreeDigit, selfClass.SubSecondThreeDigit, true, true, result, false, true);
	
	            // .ff -> .00
	            self.Replace(formatTemp, selfClass.StandardSubSecondTwoDigit, selfClass.SubSecondTwoDigit, true, true, result, false, true);
	
	            // .f -> .0
	            self.Replace(formatTemp, selfClass.StandardSubSecondSingleDigit, selfClass.SubSecondSingleDigit, true, true, result, false, true);
	
	            //-----------------------
	            // Cylj comment these codes at 2014/1/16.
	            // SpreadH do not replace the 'e' to 'yyyy'.
	            // yyyy -> e
	            //self.Replace(formatTemp, selfClass.YearFourDigit, selfClass.EraYear, true, false, result, false, true);
	            // %y -> y
	            //self.Replace(formatTemp, selfClass.StandardYearSingleDigit, selfClass.YearSingleDigit, true, true, result, false, true);
	            //-----------------------
	            return result.value;
	        };
	
	        nfPrototype.CurrentAMPM = function () {
	            var self = this;
	            var formatInfo = keyword_null;
	            if (self.DateTimeFormatInfo()) {
	                formatInfo = self.DateTimeFormatInfo();
	            } else {
	                formatInfo = DefaultTokens.DateTimeFormatInfo();
	            }
	
	            if (formatInfo && formatInfo.amDesignator && formatInfo.amDesignator !== stringEx.Empty && formatInfo.pmDesignator && formatInfo.pmDesignator !== stringEx.Empty) {
	                var ampm = stringEx.Format("{0}/{1}", formatInfo.amDesignator, formatInfo.pmDesignator);
	                return ampm;
	            }
	
	            return NumberFormatDateTime.AMPMTwoDigit;
	        };
	
	        nfPrototype.Format = function (obj) {
	            if (formatterUtils.util.isType(obj, 'boolean')) {
	                return obj.toString().toUpperCase();
	            }
	
	            var self = this;
	            var result = stringEx.Empty;
	            var dateTime = keyword_null;
	            try {
	                try {
	                    dateTime = formatterUtils.util.toDateTime(obj);
	                    if (!dateTime) {
	                        result = obj.toString();
	                    }
	                } catch (err) {
	                    result = obj.toString();
	                }
	
	                if (dateTime) {
	                    //fix single format string :  h,H -> hour / m ->minute /M -> month / d -> day /s->second /y ->year
	                    var validDTF = self.validDateTimeFormatString;
	                    var fs = self.validDateTimeFormatString.replace(/%/g, "");
	                    if (fs === "H" || fs === "h" || fs === "m" || fs === "M" || fs === "d" || fs === "s" || fs === "y") {
	                        validDTF = "%" + fs;
	                        self.validDateTimeFormatString = validDTF;
	                    } else {
	                        validDTF = fs;
	                    }
	
	                    //get cultureInfo
	                    if (self.PartLocaleID() && self.PartLocaleID().CultureInfo()) {
	                        result = new formatterUtils._DateTimeHelper(dateTime).customCultureFormat(validDTF, self.PartLocaleID().CultureInfo());
	                    } else if (self.CultureName()) {
	                        result = new formatterUtils._DateTimeHelper(dateTime).customCultureFormat(validDTF, globalize.Cultures._CultureInfo.getCulture(self.CultureName()));
	                    } else {
	                        result = new formatterUtils._DateTimeHelper(dateTime).localeFormat(validDTF);
	                    }
	
	                    if (self.hasJD) {
	                        var monthName = self._getMonthName(dateTime.getMonth());
	                        result = formatterUtils.StringHelper.Replace(result, NumberFormatDateTime.PlaceholderMonthJD, monthName.substr(0, 1));
	                    }
	
	                    if (self.absTimeParts) {
	                        var span = (formatterUtils._DateTimeHelper.___toOADate(dateTime) - formatterUtils._DateTimeHelper.___toOADate(self.AbsoluteTime())) * 24 * 60 * 60 * 1000;
	                        for (var key = 0; key < self.absTimeParts.length; key++) {
	                            var absPart = self.absTimeParts[key];
	                            var absTimePartString = keyword_null;
	                            switch (absPart.TimePartType()) {
	                                case 0 /* Hour */
	                                :
	                                    absTimePartString = Math_floor(span / 1000 / 3600);
	                                    break;
	                                case 1 /* Minute */
	                                :
	                                    absTimePartString = Math_floor(span / 1000 / 60);
	                                    break;
	                                case 2 /* Second */
	                                :
	                                    absTimePartString = Math_floor(span / 1000);
	                                    break;
	                            }
	
	                            if (absTimePartString !== keyword_null && absTimePartString !== keyword_undefined) {
	                                var tempAbsPart = absPart.token.replace("[", "\\[").replace("]", "\\]");
	                                result = formatterUtils.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + tempAbsPart, absTimePartString);
	                            }
	                        }
	                    }
	                }
	            } catch (ex) {
	                result = formatterUtils.FormatConverter.toString(obj);
	            }
	
	            if (self.NumberStringConverter()) {
	                if (self.NumberStringConverter() instanceof DefaultDateTimeNumberStringConverter) {
	                    result = self.NumberStringConverter().ConvertTo(result, obj, false, self.PartLocaleID(), self.PartDBNumberFormat());
	                } else {
	                    if (self.hasYearDelay) {
	                        result = formatterUtils.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearFourDigit, new formatterUtils._DateTimeHelper(dateTime).localeFormat(NumberFormatDateTime.YearFourDigit));
	                        result = formatterUtils.StringHelper.Replace(result, DefaultTokens.ReplacePlaceholder + NumberFormatDateTime.YearTwoDigit, new formatterUtils._DateTimeHelper(dateTime).localeFormat(NumberFormatDateTime.YearTwoDigit));
	                    }
	                    result = self.NumberStringConverter().ConvertTo(result, obj, true, self.PartLocaleID(), self.PartDBNumberFormat());
	                }
	            }
	            return result;
	        };
	
	        nfPrototype._getMonthName = function (monthIndex) {
	            //Only support english culture
	            var array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	            return array[monthIndex];
	        };
	
	        nfPrototype.Parse = function (s) {
	            if (!s || s === stringEx.Empty) {
	                return keyword_null;
	            }
	
	            var self = this;
	            var strTemp = NumberHelper.FixJapaneseChars(s);
	
	            var boolResult = strTemp.toLowerCase();
	            if (boolResult === "true") {
	                return true;
	            } else if (boolResult === "false") {
	                return false;
	            }
	
	            if (self.validDateTimeFormatString) {
	                var dateTimeResult = formatterUtils._DateTimeHelper.parseExact(strTemp, self.validDateTimeFormatString, globalize.Cultures._CultureInfo.getCulture(self.CultureName()));
	                if (dateTimeResult) {
	                    return dateTimeResult;
	                }
	            }
	
	            if (!self.exactlyMatch) {
	                try {
	                    var resultDate = formatterUtils.util.toDateTime(strTemp);
	                    if (resultDate && !isNaN(resultDate)) {
	                        return resultDate;
	                    } else {
	                        return strTemp;
	                    }
	                } catch (err) {
	                    return strTemp;
	                }
	            }
	
	            return keyword_null;
	        };
	
	        nfPrototype.FixFormat = function (format) {
	            var formatTemp = format;
	            var strBuilder = "";
	            var inComments = false;
	            var hasTime = (formatterUtils.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.HoursSingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1 || formatterUtils.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.SecondSingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1);
	            var hasDate = (formatterUtils.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.YearTwoDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1 || formatterUtils.StringHelper.IndexOf(formatTemp, NumberFormatDateTime.DaySingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1);
	
	            for (var n = 0; n < formatTemp.length; n++) {
	                var c = formatTemp[n];
	                if (c === '\"') {
	                    inComments = !inComments;
	                } else {
	                    if (!inComments) {
	                        if (c === 'Y' || c === 'D' || c === 'S' || c === 'E' || c === 'G') {
	                            c = c.toLowerCase();
	                        } else if (c === 'M') {
	                            if (n > 1) {
	                                if (!DefaultTokens.IsEquals('A', formatTemp[n - 1], true) && !DefaultTokens.IsEquals('P', formatTemp[n - 1], true)) {
	                                    c = c.toLowerCase();
	                                }
	                            } else {
	                                c = c.toLowerCase();
	                            }
	                        }
	                    }
	                }
	
	                strBuilder += (c);
	            }
	
	            return strBuilder;
	        };
	
	        nfPrototype.ProcessAMPM = function (format) {
	            var isHandled = false;
	            if (formatterUtils.StringHelper.Contains(format.value, NumberFormatDateTime.AMPMTwoDigit)) {
	                format.value = formatterUtils.StringHelper.Replace(format.value, NumberFormatDateTime.AMPMTwoDigit, NumberFormatDateTime.StandardAMPMSingleDigit);
	                isHandled = true;
	            }
	
	            var currentDateTimeFormatInfo = this.DateTimeFormatInfo();
	            if (formatterUtils.StringHelper.Contains(format.value, NumberFormatDateTime.AMPMSingleDigit)) {
	                format.value = formatterUtils.StringHelper.Replace(format.value, NumberFormatDateTime.AMPMSingleDigit, NumberFormatDateTime.StandardAMPMSingleDigit);
	                if (currentDateTimeFormatInfo) {
	                    //todo
	                    //            if (this.DateTimeFormatInfo().isReadOnly()) {
	                    //                this.DateTimeFormatInfo(util.asCustomType(this.DateTimeFormatInfo.Clone(), "DateTimeFormatInfo"));
	                    //            }
	                    currentDateTimeFormatInfo.amDesignator = NumberFormatDateTime.AMPMSingleDigit.substr(0, 1); // A
	                    currentDateTimeFormatInfo.pmDesignator = NumberFormatDateTime.AMPMSingleDigit.substr(2, 1); // P
	                }
	
	                isHandled = true;
	            }
	
	            var currentAMPM = this.CurrentAMPM();
	            if (formatterUtils.StringHelper.Contains(format.value, currentAMPM)) {
	                format.value = formatterUtils.StringHelper.Replace(format.value, currentAMPM, NumberFormatDateTime.StandardAMPMSingleDigit);
	                var ampm = currentAMPM.split('/');
	                if (ampm && ampm.length === 2) {
	                    //todo
	                    //            if (this.DateTimeFormatInfo().isReadOnly()) {
	                    //                this.DateTimeFormatInfo(util.asCustomType(this.DateTimeFormatInfo().Clone(), "DateTimeFormatInfo"));
	                    //            }
	                    currentDateTimeFormatInfo.amDesignator = ampm[0]; // Special AM
	                    currentDateTimeFormatInfo.pmDesignator = ampm[1]; // Special PM
	                }
	                isHandled = true;
	            }
	
	            return isHandled;
	        };
	
	        nfPrototype.Replace = function (format, oldToken, newToken, isReplaceInDateFormat, isReplaceInTimeFormat, result, justSearch, isIgnoreCase) {
	            result.value = format;
	            if (isReplaceInDateFormat || isReplaceInTimeFormat) {
	                var positions = [];
	                var isInDate = true;
	                var hasTime = (formatterUtils.StringHelper.IndexOf(result.value, NumberFormatDateTime.HoursSingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1 || formatterUtils.StringHelper.IndexOf(result.value, NumberFormatDateTime.SecondSingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1);
	                var hasDate = (formatterUtils.StringHelper.IndexOf(result.value, NumberFormatDateTime.YearTwoDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1 || formatterUtils.StringHelper.IndexOf(result.value, NumberFormatDateTime.DaySingleDigit[0], 1 /* CurrentCultureIgnoreCase */) > -1);
	                if (!hasDate && hasTime) {
	                    isInDate = false;
	                }
	                var isStartSpecialString = false;
	                var tokenCharIndex = 0;
	                var index = 0;
	                for (; index < result.value.length; index++) {
	                    var c = result.value[index];
	                    if (DefaultTokens.IsEquals(c, NumberFormatDateTime.HoursSingleDigit[0], true) || DefaultTokens.IsEquals(c, NumberFormatDateTime.SecondSingleDigit[0], true)) {
	                        isInDate = false;
	                    } else if (DefaultTokens.IsEquals(c, NumberFormatDateTime.YearTwoDigit[0], true) || DefaultTokens.IsEquals(c, NumberFormatDateTime.DaySingleDigit[0], true)) {
	                        isInDate = true;
	                    }
	
	                    if ((isReplaceInDateFormat && DefaultTokens.IsEquals(c, oldToken[tokenCharIndex], isIgnoreCase) && isInDate) || (isReplaceInTimeFormat && DefaultTokens.IsEquals(c, oldToken[tokenCharIndex], isIgnoreCase) && !isInDate)) {
	                        var isMatch = true;
	                        for (var x = 0; x < oldToken.length; x++) {
	                            if (x + index >= format.length || !DefaultTokens.IsEquals(oldToken[x], result.value[x + index], isIgnoreCase)) {
	                                isMatch = false;
	                                break;
	                            }
	                        }
	
	                        var indexLastMatch = index + oldToken.length - 1;
	                        if (isMatch && indexLastMatch + 1 < result.value.length) {
	                            var lastMatchChar = result.value[indexLastMatch];
	                            var tail = -1;
	                            for (tail = indexLastMatch + 1; tail < result.value.length; tail++) {
	                                if (!DefaultTokens.IsEquals(lastMatchChar, result.value[tail], isIgnoreCase)) {
	                                    break;
	                                }
	                            }
	
	                            if (tail > indexLastMatch + 1) {
	                                index = tail;
	                                isMatch = false;
	                                //break;
	                            }
	                        }
	
	                        if (isMatch && !isStartSpecialString) {
	                            positions.splice(0, 0, index);
	                            //formatterUtils.ArrayHelper.insert(positions, 0, index);
	                        }
	                    }
	
	                    if (c === '\"') {
	                        isStartSpecialString = !isStartSpecialString;
	                    }
	                }
	
	                if (positions.length > 0) {
	                    if (!justSearch) {
	                        for (index = 0; index < positions.length; index++) {
	                            var position = positions[index];
	                            result.value = formatterUtils.StringHelper.Remove(result.value, position, oldToken.length);
	                            result.value = formatterUtils.StringHelper.Insert(result.value, position, newToken);
	                        }
	                    }
	                    return true;
	                } else {
	                    return false;
	                }
	            }
	
	            return false;
	        };
	
	        NumberFormatDateTime.keyWordsSet = function () {
	            var selfClass = NumberFormatDateTime;
	            if (!selfClass._keyWordsSet) {
	                var obj = {};
	                for (var i = 0; i < selfClass.keyWords.length; i++) {
	                    obj[selfClass.keyWords[i]] = true;
	                }
	                selfClass._keyWordsSet = obj;
	            }
	            return selfClass._keyWordsSet;
	        };
	        NumberFormatDateTime.defaultDateTimeNumberStringConverter = new DefaultDateTimeNumberStringConverter();
	        NumberFormatDateTime.YearTwoDigit = "yy";
	        NumberFormatDateTime.YearSingleDigit = "y";
	        NumberFormatDateTime.YearFourDigit = "yyyy";
	        NumberFormatDateTime.MonthSingleDigit = "m";
	        NumberFormatDateTime.MonthTwoDigit = "mm";
	        NumberFormatDateTime.MonthAbbreviation = "mmm";
	        NumberFormatDateTime.MonthUnabbreviated = "mmmm";
	        NumberFormatDateTime.MonthJD = "mmmmm";
	        NumberFormatDateTime.DaySingleDigit = "d";
	        NumberFormatDateTime.DayTwoDigit = "dd";
	        NumberFormatDateTime.DayWeekDayAbbreviation = "aaa";
	        NumberFormatDateTime.DayWeekDayUnabbreviated = "aaaa";
	        NumberFormatDateTime.HoursSingleDigit = "h";
	        NumberFormatDateTime.HoursTwoDigit = "hh";
	        NumberFormatDateTime.MinuteSingleDigit = "m";
	        NumberFormatDateTime.MinuteTwoDigit = "mm";
	        NumberFormatDateTime.SecondSingleDigit = "s";
	        NumberFormatDateTime.SecondTwoDigit = "ss";
	        NumberFormatDateTime.SubSecondSingleDigit = ".0";
	        NumberFormatDateTime.SubSecondTwoDigit = ".00";
	        NumberFormatDateTime.SubSecondThreeDigit = ".000";
	        NumberFormatDateTime.EraYear = "e";
	        NumberFormatDateTime.AMPMTwoDigit = "AM/PM";
	        NumberFormatDateTime.AMPMSingleDigit = "A/P";
	        NumberFormatDateTime.StandardYearSingleDigit = "%y";
	        NumberFormatDateTime.StandardMonthSingleDigit = "%M";
	        NumberFormatDateTime.StandardMonthTwoDigit = "MM";
	        NumberFormatDateTime.StandardMonthAbbreviation = "MMM";
	        NumberFormatDateTime.StandardMonthUnabbreviated = "MMMM";
	        NumberFormatDateTime.StandardAMPMSingleDigit = "tt";
	        NumberFormatDateTime.StandardMinuteSingleDigit = "%m";
	        NumberFormatDateTime.StandardHourSingleDigit = "H";
	        NumberFormatDateTime.StandardHourTwoDigit = "HH";
	        NumberFormatDateTime.StandardSecondSingleDigit = "%s";
	        NumberFormatDateTime.StandardSubSecondSingleDigit = ".f";
	        NumberFormatDateTime.StandardSubSecondTwoDigit = ".ff";
	        NumberFormatDateTime.StandardSubSecondThreeDigit = ".fff";
	        NumberFormatDateTime.StandardDayWeekDayAbbreviation = "ddd";
	        NumberFormatDateTime.StandardDayWeekDayUnabbreviated = "dddd";
	        NumberFormatDateTime.PlaceholderMonthJD = DefaultTokens.ReplacePlaceholder + "mmmmm";
	        NumberFormatDateTime.defaultAbsoluteTime = new Date(1899, 11, 30, 0, 0, 0, 0);
	
	        NumberFormatDateTime.keyWords = [
	            NumberFormatDateTime.YearSingleDigit,
	            NumberFormatDateTime.YearTwoDigit,
	            NumberFormatDateTime.YearFourDigit,
	            NumberFormatDateTime.MonthSingleDigit,
	            NumberFormatDateTime.MonthTwoDigit,
	            NumberFormatDateTime.MonthAbbreviation,
	            NumberFormatDateTime.MonthUnabbreviated,
	            NumberFormatDateTime.MonthJD,
	            NumberFormatDateTime.DaySingleDigit,
	            NumberFormatDateTime.DayTwoDigit,
	            NumberFormatDateTime.DayWeekDayAbbreviation,
	            NumberFormatDateTime.DayWeekDayUnabbreviated,
	            NumberFormatDateTime.HoursSingleDigit,
	            NumberFormatDateTime.HoursTwoDigit,
	            NumberFormatDateTime.MinuteSingleDigit,
	            NumberFormatDateTime.MinuteTwoDigit,
	            NumberFormatDateTime.SecondSingleDigit,
	            NumberFormatDateTime.SecondTwoDigit,
	            "ggg", "gg", "g", "ee", "e"
	        ];
	        return NumberFormatDateTime;
	    })(NumberFormatBase);
	
	    //</editor-fold>
	    var DefaultNumberStringConverter = (function () {
	        function DefaultNumberStringConverter() {
	        }
	
	        DefaultNumberStringConverter.prototype.ConvertTo = function (num, value, isGeneralNumber, locale, dbNumber) {
	            if (locale != keyword_null && dbNumber != keyword_null) {
	                var dbNumberTemp = locale.GetDBNumber(dbNumber.Type());
	                if (dbNumberTemp != keyword_null)
	                    return dbNumber.ReplaceNumberString(num, dbNumberTemp, isGeneralNumber);
	            }
	
	            return num;
	        };
	        return DefaultNumberStringConverter;
	    })();
	
	    //<editor-fold desc="NumberFormatDigital">
	    var NumberFormatDigital = (function (_super) {
	        __extends(NumberFormatDigital, _super);
	        function NumberFormatDigital(format, partLocaleID, dbNumberFormatPart, cultureName) {
	            var self = this;
	            //base Constructor
	            _super.call(self, partLocaleID, dbNumberFormatPart, cultureName);
	            self.baseNumberStringConverter = NumberFormatBase.prototype.NumberStringConverter;
	            self.baseNumberFormatInfo = NumberFormatBase.prototype.NumberFormatInfo;
	            self.baseCultureName = NumberFormatBase.prototype.CultureName;
	
	            self.numberFormatString = keyword_null;
	            self.fullFormatString = keyword_null;
	            self.isGeneralNumber = false;
	            self.fractionIntegerFormat = keyword_null;
	            self.fractionNumeratorFormat = keyword_null;
	            self.fractionDenominatorFormat = keyword_null;
	            self.excelFormatString = stringEx.Empty;
	
	            self._classNames.push("NumberFormatDigital");
	
	            var formatTemp = NumberFormatBase.TrimNotSupportSymbol(format);
	            self.fullFormatString = DefaultTokens.Filter(format, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
	            self.excelFormatString = formatTemp;
	            if (partLocaleID) {
	                var oldFormat = formatTemp;
	                formatTemp = DefaultTokens.ReplaceKeyword(oldFormat, self.PartLocaleID().OriginalToken(), self.PartLocaleID().CurrencySymbol());
	            }
	
	            if (self.PartDBNumberFormat()) {
	                self.excelFormatString = DefaultTokens.ReplaceKeyword(self.excelFormatString, self.PartDBNumberFormat().OriginalToken(), self.PartDBNumberFormat().toString()); // change dbnum1 -> DBNum1
	            }
	
	            formatTemp = DefaultTokens.Filter(formatTemp, DefaultTokens.LeftSquareBracket, DefaultTokens.RightSquareBracket);
	
	            //Fraction:
	            var solidusIndex = formatTemp.indexOf(DefaultTokens.SolidusSign);
	            if (solidusIndex > -1) {
	                formatTemp = formatterUtils.StringHelper.Replace(formatTemp, "\\" + DefaultTokens.QuestionMark, DefaultTokens.Zero);
	                var sp = formatTemp.split(DefaultTokens.SolidusSign);
	                if (sp && sp.length === 2) {
	                    self.fractionDenominatorFormat = sp[1];
	                    var left = sp[0];
	                    if (left) {
	                        var kjIndex = left.lastIndexOf(DefaultTokens.Space);
	                        if (kjIndex > -1) {
	                            self.fractionIntegerFormat = left.substr(0, kjIndex);
	                            self.fractionNumeratorFormat = left.substr(kjIndex + 1, left.length - kjIndex - 1);
	                        } else {
	                            self.fractionNumeratorFormat = left;
	                        }
	                    }
	                }
	            }
	
	            self.numberFormatString = formatTemp;
	        }
	
	        var ndPrototype = NumberFormatDigital.prototype;
	
	        ndPrototype.NumberStringConverter = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.baseNumberStringConverter()) {
	                    return self.baseNumberStringConverter();
	                }
	
	                return NumberFormatDigital.defaultNumberStringConverter;
	            } else {
	                //Set
	                self.baseNumberStringConverter(value);
	                return value;
	            }
	        };
	
	        ndPrototype.FormatString = function () {
	            return this.fullFormatString;
	        };
	
	        ndPrototype.NumberFormatInfo = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                if (self.baseNumberFormatInfo()) {
	                    return self.baseNumberFormatInfo();
	                }
	
	                if (self.PartLocaleID() && self.PartLocaleID().CultureInfo()) {
	                    return self.PartLocaleID().CultureInfo().NumberFormat();
	                }
	
	                if (self.baseCultureName()) {
	                    return globalize.Cultures._CultureInfo.getCulture(self.baseCultureName()).NumberFormat();
	                }
	
	                return DefaultTokens.NumberFormatInfo();
	            } else {
	                //Set
	                self.baseNumberFormatInfo(value);
	                return value;
	            }
	        };
	
	        ndPrototype.IsGeneralNumber = function (value) {
	            var self = this;
	            if (arguments.length === 0) {
	                //Get
	                return self.isGeneralNumber;
	            } else {
	                //Set
	                self.isGeneralNumber = value;
	                return value;
	            }
	        };
	
	        ndPrototype.ExcelCompatibleFormatString = function () {
	            return this.excelFormatString;
	        };
	
	        ndPrototype.Format = function (obj) {
	            if (formatterUtils.util.isType(obj, 'boolean')) {
	                return obj.toString().toUpperCase();
	            }
	            var self = this;
	            var num = formatterUtils.FormatConverter.ToDouble(obj);
	            if (isNaN(num) || !isFinite(num) || isNaN(obj)) {
	                if (typeof obj === 'string') {
	                    return obj;
	                }
	                return keyword_null;
	            }
	            var result = self.NaNSymbol();
	            var sb = keyword_null;
	
	            var cultureInfo;
	
	            if (self.CultureName()) {
	                cultureInfo = globalize.Cultures._CultureInfo.getCulture(self.CultureName());
	            } else {
	                cultureInfo = globalize.Cultures._CultureInfo._currentCulture;
	            }
	
	            if (self.fractionNumeratorFormat && self.fractionDenominatorFormat) {
	                var out_integer = {'value': 0.0};
	                var out_numerator = {'value': 0.0};
	                var out_denominator = {'value': 0.0};
	                var d = self.fractionDenominatorFormat.length;
	                if (NumberFormatDigital.GetFraction(num, d, out_integer, out_numerator, out_denominator)) {
	                    var tempValue = self.GetGCD(out_numerator.value, out_denominator.value);
	                    if (tempValue > 1) {
	                        out_numerator.value /= tempValue;
	                        out_denominator.value /= tempValue;
	                    }
	
	                    if (self.fractionIntegerFormat) {
	                        sb = "";
	                        if (out_integer.value !== 0) {
	                            sb += (new formatterUtils._NumberHelper(out_integer.value).customCultureFormat(self.fractionIntegerFormat, cultureInfo));
	                            sb += (DefaultTokens.Space);
	                        }
	
	                        if (out_integer.value === 0 && num < 0) {
	                            sb += (DefaultTokens.negativeSign);
	                        }
	
	                        if (num === 0) {
	                            sb += ("0");
	                        }
	
	                        var denominatorFormat = self.fractionDenominatorFormat;
	                        var fixedDenominator = parseFloat(denominatorFormat);
	                        if (!isNaN(fixedDenominator)) {
	                            if (fixedDenominator > 0) {
	                                out_numerator.value *= fixedDenominator / out_denominator.value;
	                                denominatorFormat = stringEx.Empty;
	                                out_denominator.value = fixedDenominator;
	                                var numeratorValueRoundUp = Math_ceil(out_numerator.value);
	                                var temp = numeratorValueRoundUp - out_numerator.value;
	                                if (temp <= 0.5 && temp >= 0) {
	                                    out_numerator.value = parseFloat(numeratorValueRoundUp.toString());
	                                } else {
	                                    out_numerator.value = parseFloat((numeratorValueRoundUp - 1).toString());
	                                }
	                            }
	                        }
	
	                        // fix numeratorFormat string.
	                        var numeratorFormat = self.fractionNumeratorFormat;
	                        var fixedNumeratorForma = parseFloat(numeratorFormat);
	                        if (!isNaN(fixedNumeratorForma)) {
	                            if (fixedNumeratorForma === 0) {
	                                var numeratorFormatLength = numeratorFormat.length;
	                                var numeratorString = out_numerator.value.toString();
	                                var numeratorLength = numeratorString.length;
	                                if (numeratorFormatLength > numeratorLength) {
	                                    numeratorFormat = numeratorFormat.substr(0, numeratorFormatLength - (numeratorFormatLength - numeratorLength));
	                                } else if (numeratorFormatLength < numeratorLength) {
	                                    numeratorString = numeratorString.substr(0, numeratorLength - (numeratorLength - numeratorFormatLength));
	                                    out_numerator.value = parseInt(numeratorString, 10);
	                                }
	                            }
	                        }
	
	                        if (out_numerator.value !== 0) {
	                            sb += (new formatterUtils._NumberHelper(out_numerator.value).customCultureFormat(numeratorFormat, cultureInfo).replace(/^0*/, ''));
	                            sb += (DefaultTokens.SolidusSign);
	                            sb += (new formatterUtils._NumberHelper(out_denominator.value).customCultureFormat(denominatorFormat, cultureInfo).replace(/^0*/, ''));
	                        }
	                        return sb;
	                    } else {
	                        sb = "";
	                        var value = out_integer.value * out_denominator.value + out_numerator.value;
	                        var denominatorFormat = self.fractionDenominatorFormat;
	                        var fixedDenominator = parseFloat(denominatorFormat);
	                        if (fixedDenominator > 0) {
	                            value *= fixedDenominator / out_denominator.value;
	                            denominatorFormat = stringEx.Empty;
	                            out_denominator.value = fixedDenominator;
	                            var numeratorValueRoundUp = Math_ceil(value);
	                            var temp = numeratorValueRoundUp - value;
	                            if (temp <= 0.5 && temp >= 0) {
	                                value = parseFloat(numeratorValueRoundUp.toString());
	                            } else {
	                                value = parseFloat((numeratorValueRoundUp - 1).toString());
	                            }
	                            sb += (value + DefaultTokens.SolidusSign + out_denominator.value);
	                        } else {
	                            sb += (new formatterUtils._NumberHelper(value).customCultureFormat(self.fractionNumeratorFormat, cultureInfo).replace(/^0*/, ''));
	                            sb += (DefaultTokens.SolidusSign);
	                            sb += (new formatterUtils._NumberHelper(out_denominator.value).customCultureFormat(self.fractionDenominatorFormat, cultureInfo).replace(/^0*/, ''));
	                        }
	                        return sb;
	                    }
	                } else {
	                    //TODO: toString with arguments.
	                    //return num.toString(self.NumberFormatInfo());
	                    return num.toString();
	                }
	            } else {
	                //result = number.numberFormat(self.EncodeNumberFormat(self.numberFormatString));
	                result = new formatterUtils._NumberHelper(num).customCultureFormat(self.EncodeNumberFormat(self.numberFormatString), cultureInfo);
	                if (self.NumberStringConverter()) {
	                    result = self.NumberStringConverter().ConvertTo(result, obj, self.isGeneralNumber, self.PartLocaleID(), self.PartDBNumberFormat());
	                }
	            }
	
	            return result;
	        };
	
	        ndPrototype.Parse = function (s) {
	            var self = this;
	            s = self.TrimSpecialSymbol(s);
	            s = self.TrimCurrencySymbol(s);
	            if (!s || s === stringEx.Empty) {
	                return keyword_null;
	            }
	
	            // bug 320,
	            // you know the double.TryParse can parse the text as "2," to 2,
	            // the fixes just hard code to forbid the comma ending text parsing.
	            if (formatterUtils.StringHelper.EndsWith(s, DefaultTokens.numberGroupSeparator)) {
	                return s;
	            }
	
	            var strTemp = NumberHelper.FixJapaneseChars(s);
	            if (s.toLowerCase() === "true") {
	                return true;
	            } else if (s.toLowerCase() === "false") {
	                return false;
	            }
	
	            var isDecimal = DefaultTokens.IsDecimal(strTemp, self.NumberFormatInfo());
	            var EIndex = formatterUtils.StringHelper.IndexOf(strTemp, DefaultTokens.ExponentialSymbol, 1 /* CurrentCultureIgnoreCase */);
	            var isE = EIndex > -1;
	            if (self.numberFormatString) {
	                var out_percentSignCount = {'value': 0};
	                s = self.TrimPercentSign(s, out_percentSignCount);
	
	                var str = s;
	                if (isE) {
	                    str = s.substr(0, EIndex);
	                }
	                if (str[0] === DefaultTokens.NumberFormatInfo().positiveSign) {
	                    str = str.substr(1);
	                    s = s.substr(1);
	                }
	                var tempS = formatterUtils.StringHelper.Replace(str, DefaultTokens.numberGroupSeparator, "");
	                var index = tempS.indexOf(DefaultTokens.DecimalSeparator);
	                if (index === tempS.lastIndexOf(DefaultTokens.DecimalSeparator)) {
	                    var strBuilder = "#,##0";
	                    if (index !== -1) {
	                        strBuilder += (".");
	                        var decimalLength = tempS.length - index - 1;
	                        for (var i = 0; i < decimalLength; i++) {
	                            strBuilder += ("0");
	                        }
	                    }
	                    var newS = new GeneralFormatter(strBuilder).Format(tempS);
	                    if (newS === str) {
	                        if (isE) {
	                            s = tempS + s.substr(EIndex);
	                        } else {
	                            s = tempS;
	                        }
	                    }
	                }
	                var value = parseFloat(s);
	
	                var nRegExp = keyword_null;
	                if (value.toString() !== s) {
	                    var nfi = self.NumberFormatInfo();
	                    var decimalSeparator = DefaultTokens.DecimalSeparator;
	
	                    //if (nfi) {
	                    //    decimalSeparator = nfi.numberDecimalSeparator;
	                    //}
	                    if (!isDecimal && !isE) {
	                        nRegExp = new RegExp("^((\\+|-)?\\d+)$", "ig");
	                    } else if (isDecimal && !isE) {
	                        nRegExp = new RegExp("^((\\+|-)?\\d*)" + decimalSeparator + "(\\d*)$", "ig");
	                    } else if (!isDecimal && isE) {
	                        nRegExp = new RegExp("^((\\+|-)?\\d+)((E(\\+|-)?|e(\\+|-)?)\\d+)$", "ig");
	                    } else if (isDecimal && isE) {
	                        nRegExp = new RegExp("^((\\+|-)?\\d*)" + decimalSeparator + "(\\d*)((E(\\+|-)?|e(\\+|-)?)\\d+)$", "ig");
	                    }
	                }
	
	                if (!isNaN(value) && isFinite(value) && (!nRegExp || nRegExp.test(s))) {
	                    if (out_percentSignCount.value > 0) {
	                        value = value / parseFloat((100.0 * out_percentSignCount.value).toString());
	                    }
	
	                    if (value !== 0 && Math_abs(value - Math_floor(value)) !== 0) {
	                        isDecimal = true;
	                    }
	
	                    if (isE) {
	                        isDecimal = true;
	                    }
	
	                    return self.ToObject(value, isDecimal);
	                }
	            }
	
	            return keyword_null;
	        };
	
	        ndPrototype.EncodeNumberFormat = function (format) {
	            if (format) {
	                var charArray = format.split("");
	                var strBuilder = "";
	                for (var i = 0; i < charArray.length - 1;) {
	                    if (charArray[i] === "\\") {
	                        strBuilder += (charArray[i + 1]);
	                        i += 2;
	                    } else {
	                        strBuilder += (charArray[i]);
	                        i++;
	                    }
	                }
	                if (i === charArray.length - 1) {
	                    if (charArray[i] !== "\\") {
	                        strBuilder += (charArray[i]);
	                    }
	                }
	                format = strBuilder;
	            }
	            return format;
	        };
	
	        ndPrototype.ToObject = function (value, isDecimal) {
	            if (!isDecimal) {
	                //Javascript max exact precision to 16 decimals, and min value of exponent it 1E+22
	                if (value <= 1E+22) {
	                    return value;
	                } else {
	                    return value;
	                }
	            }
	
	            return value;
	        };
	
	        ndPrototype.TrimPercentSign = function (s, out_count) {
	            out_count.value = 0;
	            if (!s || s === stringEx.Empty) {
	                return s;
	            }
	
	            var strTemp = s;
	            var percentSymbol = DefaultTokens.percentSymbol;
	            var index = s.indexOf(percentSymbol);
	            if (index === s.length - 1 && index === s.lastIndexOf(percentSymbol)) {
	                strTemp = formatterUtils.StringHelper.Replace(strTemp, percentSymbol, "");
	                out_count.value += ((s.length - strTemp.length) / percentSymbol.length);
	            }
	            return strTemp;
	        };
	
	        ndPrototype.TrimSpecialSymbol = function (s) {
	            if (!s || s === stringEx.Empty) {
	                return s;
	            }
	
	            var strTemp = s;
	
	            var firstDigital = -1;
	            for (var fd = 0; fd < strTemp.length; fd++) {
	                if (char.IsDigit(strTemp[fd])) {
	                    firstDigital = fd;
	                    break;
	                }
	            }
	
	            var lastDigital = -1;
	            for (var ld = strTemp.length - 1; ld > -1; ld--) {
	                if (char.IsDigit(strTemp[ld])) {
	                    lastDigital = ld;
	                    break;
	                }
	            }
	
	            for (var n = strTemp.length - 1; n > -1; n--) {
	                var c = strTemp[n];
	                if (this.IsSpecialSymbol(c)) {
	                    if (char.IsWhiteSpace(c)) {
	                        if (n < firstDigital || lastDigital < n) {
	                            strTemp = formatterUtils.StringHelper.Remove(strTemp, n, 1);
	                        }
	                    } else {
	                        strTemp = formatterUtils.StringHelper.Remove(strTemp, n, 1);
	                    }
	                } else {
	                    if (c === '-' || c === '+') {
	                        if (n > 0) {
	                            if (strTemp[n - 1] !== 'e' && strTemp[n - 1] !== 'E' && strTemp[n - 1] !== '(' && strTemp[n - 1].toString() !== DefaultTokens.NumberFormatInfo().currencySymbol) {
	                                break;
	                            }
	                        }
	                    }
	                }
	            }
	
	            return strTemp;
	        };
	
	        ndPrototype.IsStandardNumberSymbol = function (c) {
	            var formatProvider = this.NumberFormatInfo() ? this.NumberFormatInfo() : DefaultTokens.NumberFormatInfo();
	            if (formatProvider) {
	                var str = c.toString();
	                if (str === formatProvider.currencyDecimalSeparator || str === formatProvider.currencyGroupSeparator || str === formatProvider.currencySymbol || str === formatProvider.nanSymbol || str === formatProvider.negativeInfinitySymbol || str === formatProvider.negativeSign || str === formatProvider.numberDecimalSeparator || str === formatProvider.numberGroupSeparator || str === formatProvider.percentDecimalSeparator || str === formatProvider.percentGroupSeparator || str === formatProvider.percentSymbol || str === formatProvider.perMilleSymbol || str === formatProvider.positiveInfinitySymbol || str === formatProvider.positiveSign) {
	                    return true;
	                }
	            }
	
	            return false;
	        };
	
	        ndPrototype.IsSpecialSymbol = function (c) {
	            if (this.IsStandardNumberSymbol(c)) {
	                return false;
	            }
	
	            if (char.IsWhiteSpace(c)) {
	                return true;
	            }
	
	            return false;
	        };
	
	        ndPrototype.TrimCurrencySymbol = function (s) {
	            if (!s) {
	                return s;
	            }
	            var formatProvider = this.NumberFormatInfo() ? this.NumberFormatInfo() : DefaultTokens.NumberFormatInfo();
	            if (formatProvider) {
	                var currencySymbol = formatProvider.currencySymbol;
	                var index = s.toString().indexOf(currencySymbol);
	                if (index === 0 && index === s.lastIndexOf(currencySymbol)) {
	                    s = s.substr(1);
	                }
	            }
	            return s;
	        };
	
	        NumberFormatDigital.keyWordsSet = function () {
	            var selfClass = NumberFormatDigital;
	            if (!selfClass._keyWordsSet) {
	                var obj = {};
	                for (var i = 0; i < selfClass.keywords.length; i++) {
	                    obj[selfClass.keywords[i]] = true;
	                }
	                selfClass._keyWordsSet = obj;
	            }
	            return selfClass._keyWordsSet;
	        };
	
	        NumberFormatDigital.EvaluateFormat = function (format) {
	            return NumberFormatBase.ContainsKeywords(format, NumberFormatDigital.keywords, NumberFormatDigital.keyWordsSet());
	        };
	
	        NumberFormatDigital.GetFraction = function (value, denominatorDigits, out_integer, out_numerator, out_denominator) {
	            return NumberHelper.GetFraction(value, denominatorDigits, out_integer, out_numerator, out_denominator);
	        };
	
	        ndPrototype.GetGCD = function (value1, value2) {
	            if (value1 == 0.0)
	                return Math_abs(value2);
	            if (value2 == 0.0)
	                return Math_abs(value1);
	
	            var max = Math_max(value1, value2);
	            var min = Math_min(value1, value2);
	            var value3 = max % min;
	
	            while (value3 != 0.0) {
	                max = min;
	                min = value3;
	                value3 = max % min;
	            }
	
	            return Math_abs(min);
	        };
	        NumberFormatDigital.defaultNumberStringConverter = new DefaultNumberStringConverter();
	
	        NumberFormatDigital.keywords = [
	            DefaultTokens.Exponential1,
	            DefaultTokens.Exponential2,
	            DefaultTokens.NumberSign,
	            DefaultTokens.DecimalSeparator,
	            DefaultTokens.numberGroupSeparator,
	            DefaultTokens.percentSymbol,
	            DefaultTokens.Zero,
	            DefaultTokens.SolidusSign];
	        return NumberFormatDigital;
	    })(NumberFormatBase);
	
	    //</editor-fold>
	    //<editor-fold desc="NumberFormatGeneral">
	    var NumberFormatGeneral = (function (_super) {
	        __extends(NumberFormatGeneral, _super);
	        function NumberFormatGeneral(format, partLocaleID, dbNumberFormatPart, cultureName) {
	            var self = this;
	            _super.call(self, partLocaleID, dbNumberFormatPart, cultureName);
	            self.digitalFormat = keyword_null;
	            self.exponentialDigitalFormat = keyword_null;
	            self.fullFormatString = keyword_null;
	            self._classNames.push("NumberFormatGeneral");
	
	            if (arguments.length > 0) {
	                if (NumberFormatGeneral.EvaluateFormat(format)) {
	                    if (format.indexOf(DefaultTokens.Zero) >= 0 || format.indexOf(DefaultTokens.NumberSign) >= 0 || format.indexOf(DefaultTokens.DecimalSeparator) >= 0 || format.indexOf(DefaultTokens.CommercialAt) >= 0) {
	                        throw globalize.StringResoures.SR.Exp_FormatIllegal;
	                    }
	                    self.fullFormatString = format;
	                } else {
	                    throw globalize.StringResoures.SR.Exp_FormatIllegal;
	                }
	            } else {
	                self.fullFormatString = NumberFormatBase.General;
	            }
	        }
	
	        var ngPrototype = NumberFormatGeneral.prototype;
	
	        ngPrototype.DigitalFormat = function () {
	            var self = this;
	            if (!self.digitalFormat) {
	                var nfStringTmp = self.fullFormatString;
	                nfStringTmp = DefaultTokens.ReplaceKeyword(nfStringTmp, NumberFormatBase.General, NumberFormatGeneral.GeneralNumber);
	                self.digitalFormat = new NumberFormatDigital(nfStringTmp, self.PartLocaleID(), self.PartDBNumberFormat(), self.CultureName());
	                self.digitalFormat.IsGeneralNumber(true);
	            }
	            return self.digitalFormat;
	        };
	
	        ngPrototype.ExponentialDigitalFormat = function () {
	            var self = this;
	            if (!self.exponentialDigitalFormat) {
	                self.exponentialDigitalFormat = new NumberFormatDigital("0.#####E+00", self.PartLocaleID(), self.PartDBNumberFormat(), self.CultureName());
	                self.exponentialDigitalFormat.IsGeneralNumber(true);
	            }
	            return self.exponentialDigitalFormat;
	        };
	
	        ngPrototype.FormatString = function () {
	            return formatterUtils.StringHelper.Replace(this.fullFormatString, NumberFormatGeneral.GeneralPlaceholder, NumberFormatBase.General);
	        };
	
	        ngPrototype.Format = function (obj) {
	            var self = this;
	            if (formatterUtils.FormatConverter.IsNumber(obj)) {
	                var allowS = !self.PartLocaleID() ? true : self.PartLocaleID().AllowScience();
	                var d = formatterUtils.FormatConverter.ToDouble(obj);
	                if (d !== keyword_undefined && d !== keyword_null) {
	                    if ((Math_abs(d) > 99999999999 && allowS) || (Math_abs(d) < 1E-11 && d !== 0)) {
	                        return self.ExponentialDigitalFormat().Format(obj);
	                    } else {
	                        return self.DigitalFormat().Format(obj);
	                    }
	                }
	            } else if (formatterUtils.util.isType(obj, "string")) {
	                var formatTmp = formatterUtils.StringHelper.Replace(self.FormatString(), '"', '');
	                formatTmp = DefaultTokens.TrimEscape(formatTmp);
	                if (formatTmp) {
	                    return formatterUtils.StringHelper.Replace(formatTmp, "General", obj);
	                }
	                return obj;
	            } else if (formatterUtils.util.isType(obj, "boolean")) {
	                return obj.toString().toUpperCase();
	            }
	            return "";
	        };
	
	        ngPrototype.Parse = function (s) {
	            if (stringEx.IsNullOrEmpty(s)) {
	                return keyword_null;
	            }
	            var hasMin = false;
	            var minIndex = formatterUtils.StringHelper.IndexOf(s, "-");
	            if (minIndex > 0) {
	                if (!DefaultTokens.IsEquals(s.charAt(minIndex - 1), DefaultTokens.ExponentialSymbol, true)) {
	                    hasMin = true;
	                }
	            }
	            if (formatterUtils.StringHelper.Contains(s, "/") || hasMin || formatterUtils.StringHelper.Contains(s, ":") || formatterUtils.StringHelper.Contains(s, "-")) {
	                //var dt = DateFormatHelper.string2Date(s);
	                var dt = formatterUtils._DateTimeHelper.parseLocale(s);
	
	                //TODO: isNaN(Date)
	                if (dt) {
	                    return dt;
	                }
	            }
	            var tmp = s;
	            var result = keyword_null;
	            var hasSignNegative = keyword_null;
	            if (tmp.charAt(0) === DefaultTokens.negativeSign) {
	                hasSignNegative = true;
	            } else if (tmp.charAt(0) === DefaultTokens.NumberFormatInfo().positiveSign) {
	                hasSignNegative = false;
	            }
	            var hasParenthesis = false;
	            if (hasSignNegative) {
	                if (tmp.length > 3) {
	                    if (tmp.charAt(1) === DefaultTokens.LeftParenthesis && tmp.charAt(tmp.length - 1) === DefaultTokens.RightParenthesis) {
	                        hasParenthesis = true;
	                    }
	                }
	            }
	            if (hasSignNegative && hasParenthesis) {
	                result = this.DigitalFormat().Parse(formatterUtils.StringHelper.Remove(s, 0, 1));
	                if (result) {
	                    if (formatterUtils.util.isType(result, "number")) {
	                        return Math_abs(result) * (hasSignNegative ? -1 : 1);
	                    }
	                    return result;
	                }
	            } else {
	                result = this.DigitalFormat().Parse(s);
	                if (result !== keyword_undefined && result !== keyword_null) {
	                    return result;
	                }
	            }
	            return s;
	        };
	
	        NumberFormatGeneral.GeneralMonthDay = function () {
	            return [
	                "M/d", "MMM/d", "MMMM/d",
	                "d/M", "d/MMM", "d/MMMM",
	                "M-d", "MMM-d", "MMMM-d",
	                "d-M", "d-MMM", "d-MMMM"];
	        };
	
	        NumberFormatGeneral.GeneralYearMonth = function () {
	            return [
	                "M/y", "MMM/y",
	                "M/yyyy", "MMM/yyyy",
	                "M-y", "MMM-y",
	                "M-yyyy", "MMM-yyyy"];
	        };
	
	        NumberFormatGeneral.GeneralYearMonthDay = function () {
	            return [
	                "M/d/y", "MMM/d/y", "MMMM/d/y",
	                "M/d/yyyy", "MMM/d/yyyy", "MMMM/d/yyyy",
	                "d/M/y", "d/MMM/y", "d/MMMM/y",
	                "d/M/yyyy", "d/MMM/yyyy", "d/MMMM/yyyy",
	                "yyyy/M/d",
	                "M-d-y", "MMM-d-y", "MMMM-d-y",
	                "M-d-yyyy", "MMM-d-yyyy", "MMMM-d-yyyy",
	                "d-M-y", "d-MMM-y", "d-MMMM-y",
	                "d-M-yyyy", "d-MMM-yyyy", "d-MMMM-yyyy",
	                "yyyy-M-d"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinute = function () {
	            return ["H:m", "h:m tt"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinuteWithDate = function () {
	            return [
	                "M/d H:m", "MMM/d H:m", "MMMM/d H:m",
	                "d/M H:m", "d/MMM H:m", "d/MMMM H:m",
	                "M/y H:m", "MMM/y H:m",
	                "M/yyyy H:m", "MMM/yyyy H:m",
	                "M/d/y H:m", "MMM/d/y H:m", "MMMM/d/y H:m",
	                "M/d/yyyy H:m", "MMM/d/yyyy H:m", "MMMM/d/yyyy H:m",
	                "M-d H:m", "MMM-d H:m", "MMMM-d H:m",
	                "d-M H:m", "d-MMM H:m", "d-MMMM H:m",
	                "M-y H:m", "MMM-y H:m",
	                "M-yyyy H:m", "MMM-yyyy H:m",
	                "M-d-y H:m", "MMM-d-y H:m", "MMMM-d-y H:m",
	                "M-d-yyyy H:m", "MMM-d-yyyy H:m", "MMMM-d-yyyy H:m",
	                "M/d h:m tt", "MMM/d h:m tt", "MMMM/d h:m tt",
	                "d/M h:m tt", "d/MMM h:m tt", "d/MMMM h:m tt",
	                "M/y h:m tt", "MMM/y h:m tt",
	                "M/yyyy h:m tt", "MMM/yyyy h:m tt",
	                "M/d/y h:m tt", "MMM/d/y h:m tt", "MMMM/d/y h:m tt",
	                "M/d/yyyy h:m tt", "MMM/d/yyyy h:m tt", "MMMM/d/yyyy h:m tt",
	                "M-d h:m tt", "MMM-d h:m tt", "MMMM-d h:m tt",
	                "d-M h:m tt", "d-MMM h:m tt", "d-MMMM h:m tt",
	                "M-y h:m tt", "MMM-y h:m tt",
	                "M-yyyy h:m tt", "MMM-yyyy h:m tt",
	                "M-d-y h:m tt", "MMM-d-y h:m tt", "MMMM-d-y h:m tt",
	                "M-d-yyyy h:m tt", "MMM-d-yyyy h:m tt", "MMMM-d-yyyy h:m tt"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinuteSecond = function () {
	            return ["H:m:s", "h:m:s tt", "H:m:s", "h:mm:ss tt"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinuteSecondSubSecond = function () {
	            return [
	                "H:m:s.FFF",
	                "h:m:s.FFF tt"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinuteSecondWithDate = function () {
	            return [
	                "M/d H:m:s", "MMM/d H:m:s", "MMMM/d H:m:s",
	                "d/M H:m:s", "d/MMM H:m:s", "d/MMMM H:m:s",
	                "M/y H:m:s", "MMM/y H:m:s",
	                "M/yyyy H:m:s", "MMM/yyyy H:m:s",
	                "M/d/y H:m:s", "MMM/d/y H:m:s", "MMMM/d/y H:m:s",
	                "M/d/yyyy H:m:s", "MMM/d/yyyy H:m:s", "MMMM/d/yyyy H:m:s",
	                "d/M/y H:m:s", "d/MMM/y H:m:s", "d/MMMM/y H:m:s",
	                "d/M/yyyy H:m:s", "d/MMM/yyyy H:m:s", "d/MMMM/yyyy H:m:s",
	                "yyyy/M/d H:m:s",
	                "M-d H:m:s", "MMM-d H:m:s", "MMMM-d H:m:s",
	                "d-M H:m:s", "d-MMM H:m:s", "d-MMMM H:m:s",
	                "M-y H:m:s", "MMM-y H:m:s",
	                "M-yyyy H:m:s", "MMM-yyyy H:m:s",
	                "M-d-y H:m:s", "MMM-d-y H:m:s", "MMMM-d-y H:m:s",
	                "M-d-yyyy H:m:s", "MMM-d-yyyy H:m:s", "MMMM-d-yyyy H:m:s",
	                "d-M-y H:m:s", "d-MMM-y H:m:s", "d-MMMM-y H:m:s",
	                "d-M-yyyy H:m:s", "d-MMM-yyyy H:m:s", "d-MMMM-yyyy H:m:s",
	                "yyyy-M-d H:m:s",
	                "M/d h:m:s tt", "MMM/d h:m:s tt", "MMMM/d h:m:s tt",
	                "d/M h:m:s tt", "d/MMM h:m:s tt", "d/MMMM h:m:s tt",
	                "M/y h:m:s tt", "MMM/y h:m:s tt",
	                "M/yyyy h:m:s tt", "MMM/yyyy h:m:s tt",
	                "M/d/y h:m:s tt", "MMM/d/y h:m:s tt", "MMMM/d/y h:m:s tt",
	                "M/d/yyyy h:m:s tt", "MMM/d/yyyy h:m:s tt", "MMMM/d/yyyy h:m:s tt",
	                "d/M/y h:m:s tt", "d/MMM/y h:m:s tt", "d/MMMM/y h:m:s tt",
	                "d/M/yyyy h:m:s tt", "d/MMM/yyyy h:m:s tt", "d/MMMM/yyyy h:m:s tt",
	                "yyyy/M/d h:m:s tt", "M/d/yyyy h:mm:ss tt",
	                "M-d h:m:s tt", "MMM-d h:m:s tt", "MMMM-d h:m:s tt",
	                "d-M h:m:s tt", "d-MMM h:m:s tt", "d-MMMM h:m:s tt",
	                "M-y h:m:s tt", "MMM-y h:m:s tt",
	                "M-yyyy h:m:s tt", "MMM-yyyy h:m:s tt",
	                "M-d-y h:m:s tt", "MMM-d-y h:m:s tt", "MMMM-d-y h:m:s tt",
	                "M-d-yyyy h:m:s tt", "MMM-d-yyyy h:m:s tt", "MMMM-d-yyyy h:m:s tt",
	                "d-M-y h:m:s tt", "d-MMM-y h:m:s tt", "d-MMMM-y h:m:s tt",
	                "d-M-yyyy h:m:s tt", "d-MMM-yyyy h:m:s tt", "d-MMMM-yyyy h:m:s tt",
	                "yyyy-M-d h:m:s tt"];
	        };
	
	        NumberFormatGeneral.GeneralHourMinuteSecondSubSecondWithDate = function () {
	            return [
	                "M/d H:m:s.FFF", "MMM/d H:m:s.FFF", "MMMM/d H:m:s.FFF",
	                "d/M H:m:s.FFF", "d/MMM H:m:s.FFF", "d/MMMM H:m:s.FFF",
	                "M/y H:m:s.FFF", "MMM/y H:m:s.FFF",
	                "M/yyyy H:m:s.FFF", "MMM/yyyy H:m:s.FFF",
	                "d/M/y H:m", "d/MMM/y H:m", "d/MMMM/y H:m",
	                "d/M/yyyy H:m", "d/mmm/yyyy H:m", "d/MMMM/yyyy H:m",
	                "yyyy/M/d H:m",
	                "M/d/y H:m:s.FFF", "MMM/d/y H:m:s.FFF", "MMMM/d/y H:m:s.FFF",
	                "M/d/yyyy H:m:s", "MMM/d/yyyy H:m:s.FFF", "MMMM/d/yyyy H:m:s.FFF",
	                "d/M/y H:m:s.FFF", "d/MMM/y H:m:s.FFF", "d/MMMM/y H:m:s.FFF",
	                "d/M/yyyy H:m:s.FFF", "d/MMM/yyyy H:m:s.FFF", "d/MMMM/yyyy H:m:s.FFF",
	                "yyyy/M/d H:m:s.FFF",
	                "M-d H:m:s.FFF", "MMM-d H:m:s.FFF", "MMMM-d H:m:s.FFF",
	                "d-M H:m:s.FFF", "d-MMM H:m:s.FFF", "d-MMMM H:m:s.FFF",
	                "M-y H:m:s.FFF", "MMM-y H:m:s.FFF",
	                "M-yyyy H:m:s.FFF", "MMM-Yyyy H:m:s.FFF",
	                "d-M-y H:m", "d-MMM-y H:m", "d-MMMM-y H:m",
	                "d-M-yyyy H:m", "d-MMM-yyyy H:m", "d-MMMM-yyyy H:m",
	                "yyyy-M-d H:m",
	                "M-d-y H:m:s.FFF", "MMM-d-y H:m:s.FFF", "MMMM-d-y H:m:s.FFF",
	                "M-d-yyyy H:m:s", "MMM-d-yyyy H:m:s.FFF", "MMMM-d-yyyy H:m:s.FFF",
	                "D-M-y H:m:s.FFF", "d-MMM-y H:m:s.FFF", "d-MMMM-y H:m:s.FFF",
	                "D-M-yyyy H:m:s.FFF", "d-MMM-yyyy H:m:s.FFF", "d-MMMM-yyyy H:m:s.FFF",
	                "yyyy-M-d H:m:s.FFF",
	                "M/d h:m:s.FFF tt", "MMM/d h:m:s.FFF tt", "MMMM/d h:m:s.FFF tt",
	                "d/M h:m:s.FFF tt", "d/MMM h:m:s.FFF tt", "d/MMMM h:m:s.FFF tt",
	                "M/y h:m:s.FFF tt", "MMM/y h:m:s.FFF tt",
	                "M/yyyy h:m:s.FFF tt", "MMM/yyyy h:m:s.FFF tt",
	                "d/M/y h:m tt", "d/MMM/y h:m tt", "d/MMMM/y h:m tt",
	                "d/M/yyyy h:m tt", "d/mmm/yyyy h:m tt", "d/MMMM/yyyy h:m tt",
	                "yyyy/M/d h:m tt",
	                "M/d/y h:m:s.FFF tt", "MMM/d/y h:m:s.FFF tt", "MMMM/d/y h:m:s.FFF tt",
	                "M/d/yyyy h:m:s tt", "MMM/d/yyyy h:m:s.FFF tt", "MMMM/d/yyyy h:m:s.FFF tt",
	                "d/M/y h:m:s.FFF tt", "d/MMM/y h:m:s.FFF tt", "d/MMMM/y h:m:s.FFF tt",
	                "d/M/yyyy h:m:s.FFF tt", "d/MMM/yyyy h:m:s.FFF tt", "d/MMMM/yyyy h:m:s.FFF tt",
	                "yyyy/M/d h:m:s.FFF tt",
	                "M-d h:m:s.FFF tt", "MMM-d h:m:s.FFF tt", "MMMM-d h:m:s.FFF tt",
	                "d-M h:m:s.FFF tt", "d-MMM h:m:s.FFF tt", "d-MMMM h:m:s.FFF tt",
	                "M-y h:m:s.FFF tt", "MMM-y h:m:s.FFF tt",
	                "M-yyyy h:m:s.FFF tt", "MMM-Yyyy h:m:s.FFF tt",
	                "d-M-y h:m tt", "d-MMM-y h:m tt", "d-MMMM-y h:m tt",
	                "d-M-yyyy h:m tt", "d-MMM-yyyy h:m tt", "d-MMMM-yyyy h:m tt",
	                "yyyy-M-d h:m tt",
	                "M-d-y h:m:s.FFF tt", "MMM-d-y h:m:s.FFF tt", "MMMM-d-y h:m:s.FFF tt",
	                "M-d-yyyy H:m:s tt", "MMM-d-yyyy H:m:s.FFF tt", "MMMM-d-yyyy h:m:s.FFF tt",
	                "d-M-y h:m:s.FFF tt", "d-MMM-y h:m:s.FFF tt", "d-MMMM-y h:m:s.FFF tt",
	                "d-M-yyyy h:m:s.FFF tt", "d-MMM-yyyy h:m:s.FFF tt", "d-MMMM-yyyy h:m:s.FFF tt",
	                "yyyy-M-d h:m:s.FFF tt"];
	        };
	
	        NumberFormatGeneral.EvaluateFormat = function (format) {
	            if (!format || format === stringEx.Empty) {
	                return false;
	            }
	            var baseClass = NumberFormatBase;
	            return baseClass.ContainsKeywords(format, baseClass._keywords, baseClass._keywordsSet);
	        };
	        NumberFormatGeneral.GeneralPlaceholder = "@NumberFormat";
	        NumberFormatGeneral.GeneralNumber = "##################0.################";
	        return NumberFormatGeneral;
	    })(NumberFormatBase);
	
	    //</editor-fold>
	    var CustomFormatterBase = (function () {
	        /**
	         * Represents a custom formatter with the specified format string.
	         * @class
	         * @param {string} format The format.
	         * @param {string} cultureName The culture name.
	         */
	        function CustomFormatterBase(format, cultureName) {
	            this.formatCached = format;
	            this.cultureName = cultureName;
	        }
	
	        var cfPrototype = CustomFormatterBase.prototype;
	
	        /**
	         * Formats the specified object as a string with a conditional color. This function should be overwritten.
	         * @param {Object} obj The object with cell data to format.
	         * @param {Object} conditionalForeColor The conditional foreground color.
	         * @returns {string} The formatted string.
	         */
	        cfPrototype.Format = function (obj, conditionalForeColor) {
	            return keyword_null;
	        };
	
	        /**
	         * Parses the specified text. This function should be overwritten.
	         * @param {string} text The text.
	         * @returns {Object} The parsed object.
	         */
	        cfPrototype.Parse = function (str) {
	            return keyword_null;
	        };
	
	        cfPrototype.FormatString = function () {
	            return this.formatCached;
	        };
	        return CustomFormatterBase;
	    })();
	    formatter.CustomFormatterBase = CustomFormatterBase;
	
	    formatter.DateTimeHelper = formatterUtils._DateTimeHelper;
	    /* jshint ignore:end */
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *
	 * SpreadJS Library 1.0.0
	 * http://wijmo.com/
	 *
	 * Copyright(c) GrapeCity, Inc.  All rights reserved.
	 *
	 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
	 * licensing@wijmo.com
	 * http://wijmo.com/widgets/license/
	 *
	 *
	 **/
	
	    (function () {
	        var globalize = __webpack_require__(2);
	
	        var spread = {};
	        module.exports = spread;
	
	        var const_undefined = "undefined", const_number = "number", const_string = "string", const_boolean = "boolean", const_true = "TRUE", const_false = "FALSE";
	        var keyword_null = null, keyword_undefined = undefined, Math_max = Math.max, Math_min = Math.min, Math_ceil = Math.ceil, Math_floor = Math.floor, Math_abs = Math.abs, Math_pow = Math.pow, Math_round = Math.round;
	
	        var const_boolean = "boolean", const_date = "date", const_undefined = "undefined", keyword_undefined = undefined, keyword_null = null;
	
	        var ArrayHelper = (function () {
	            function ArrayHelper() {
	            }
	            ArrayHelper.insert = function (array, index, item) {
	                array.splice(index, 0, item);
	            };
	
	            ArrayHelper.add = function (array, item) {
	                array[array.length] = item;
	            };
	
	            ArrayHelper.contains = function (array, item) {
	                for (var i = 0; i < array.length; i++) {
	                    if (array[i] === item) {
	                        return true;
	                    }
	                }
	                return false;
	            };
	
	            ArrayHelper.remove = function (array, item) {
	                for (var i = 0; i < array.length; i++) {
	                    if (array[i] === item) {
	                        array.splice(i, 1);
	                        return;
	                    }
	                }
	            };
	
	            ArrayHelper.removeByIndex = function (array, index) {
	                return array = array.slice(0, index).concat(array.slice(index + 1));
	            };
	
	            ArrayHelper.indexOf = function (array, item, start) {
	                if (typeof (item) === const_undefined) {
	                    return -1;
	                }
	                start = start || 0;
	                for (var i = start; i < array.length; i++) {
	                    if (array[i] === item) {
	                        return i;
	                    }
	                }
	                return -1;
	            };
	
	            ArrayHelper.map = function (array, callback, thisArg) {
	                // Array.map is not existed in IE7/8, use this as a fix
	                if (!Array.prototype.map) {
	                    var T, A, k;
	
	                    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	                    var O = window.Object(array);
	
	                    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
	                    // 3. Let len be ToUint32(lenValue).
	                    var len = O.length >>> 0;
	
	                    // 4. If IsCallable(callback) is false, throw a TypeError exception.
	                    // See: http://es5.github.com/#x9.11
	                    if (typeof callback !== "function") {
	                        throw new TypeError(callback + spread.SR.Exp_NotAFunction);
	                    }
	
	                    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	                    if (thisArg) {
	                        T = thisArg;
	                    }
	
	                    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
	                    // the standard built-in constructor with that name and len is the value of len.
	                    A = new Array(len);
	
	                    // 7. Let k be 0
	                    k = 0;
	
	                    while (k < len) {
	                        var kValue, mappedValue;
	
	                        // a. Let Pk be ToString(k).
	                        //   This is implicit for LHS operands of the in operator
	                        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
	                        //   This step can be combined with c
	                        // c. If kPresent is true, then
	                        if (k in O) {
	                            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
	                            kValue = O[k];
	
	                            // ii. Let mappedValue be the result of calling the Call internal method of callback
	                            // with T as the this value and argument list containing kValue, k, and O.
	                            mappedValue = callback.call(T, kValue, k, O);
	
	                            // iii. Call the DefineOwnProperty internal method of A with arguments
	                            // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
	                            // and false.
	                            // In browsers that support Object.defineProperty, use the following:
	                            // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
	                            // For best browser support, use the following:
	                            A[k] = mappedValue;
	                        }
	
	                        // d. Increase k by 1.
	                        k++;
	                    }
	
	                    // 9. return A
	                    return A;
	                }
	                return array.map(callback, thisArg);
	            };
	
	            ArrayHelper.clear = function (array, index, count) {
	                if (index < 0) {
	                    return;
	                }
	                var n = 0;
	                for (var i = 0; n < count && i < array.length; i++) {
	                    array[index + i] = keyword_null;
	                    n++;
	                }
	            };
	
	            ArrayHelper.nextNonEmptyIndex = function (array, index) {
	                if (index < 0) {
	                    index = -1;
	                }
	                var n = index + 1;
	                for (var i = n; i < array.length; i++) {
	                    if (array[i] !== keyword_undefined && array[i] !== keyword_null) {
	                        return i;
	                    }
	                }
	                return -1;
	            };
	            return ArrayHelper;
	        })();
	        spread.ArrayHelper = ArrayHelper;
	
	        (function (StringComparison) {
	            //  Compare strings using culture-sensitive sort rules and the current culture.*/
	            StringComparison[StringComparison["CurrentCulture"] = 0] = "CurrentCulture";
	
	            //  Compare strings using culture-sensitive sort rules, the current culture, and ignoring the case of the strings being compared.*/
	            StringComparison[StringComparison["CurrentCultureIgnoreCase"] = 1] = "CurrentCultureIgnoreCase";
	
	            //  Compare strings using culture-sensitive sort rules and the invariant culture.*/
	            StringComparison[StringComparison["InvariantCulture"] = 2] = "InvariantCulture";
	
	            //  Compare strings using culture-sensitive sort rules, the invariant culture, and ignoring the case of the strings being compared.*/
	            StringComparison[StringComparison["InvariantCultureIgnoreCase"] = 3] = "InvariantCultureIgnoreCase";
	
	            //  Compare strings using ordinal sort rules.*/
	            StringComparison[StringComparison["Ordinal"] = 4] = "Ordinal";
	
	            // Compare strings using ordinal sort rules and ignoring the case of the strings being compared.*/
	            StringComparison[StringComparison["OrdinalIgnoreCase"] = 5] = "OrdinalIgnoreCase";
	        })(spread.StringComparison || (spread.StringComparison = {}));
	        var StringComparison = spread.StringComparison;
	
	        var util = (function () {
	            function util() {
	            }
	            //Create an EventHandler for a element
	            util.createEventHandler = function (element, method) {
	                return function () {
	                    // call method.
	                    return method.apply(element, arguments);
	                };
	            };
	
	            //Cancels the route for DOM event.
	            //@param {Event} e Indicates the event to be cancelled.
	            //@returns {boolean} This function always returns <c>false</c>.
	            util.cancelDefault = function (e) {
	                if (e.preventDefault) {
	                    e.preventDefault();
	                    e.stopPropagation();
	                } else {
	                    e.cancelBubble = false;
	                    e.returnValue = false;
	                }
	                return false;
	            };
	
	            util._isStandardCanvas = function () {
	                if (typeof util.canvasApiFound === const_undefined) {
	                    util.canvasApiFound = (typeof document.createElement("canvas").getContext !== const_undefined);
	                }
	                return util.canvasApiFound;
	            };
	
	            util.inArray = function (elem, arr, i) {
	                if (arr) {
	                    if (Array.prototype.indexOf) {
	                        return Array.prototype.indexOf.call(arr, elem, i);
	                    }
	
	                    var len = arr.length;
	                    i = i ? i < 0 ? Math_max(0, len + i) : i : 0;
	
	                    for (; i < len; i++) {
	                        // Skip accessing in sparse arrays
	                        if (i in arr && arr[i] === elem) {
	                            return i;
	                        }
	                    }
	                }
	
	                return -1;
	            };
	
	            util.parseColorString = function (value) {
	                var rrggbbPattern = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
	                var rgbPattern = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
	                var rgbFunctionPattern = /^rgb\(([\s\d]*),([\s\d]*),([\s\d]*)\)$/i;
	                var rgbaFunctionPattern = /^rgba\(([\s\d]*),([\s\d]*),([\s\d]*),([\s\d]*)\)$/i;
	
	                var normalizeColorString = (function (useCanvas) {
	                    var _dummyColorSpan, _canvasContext;
	                    return useCanvas ? function (strColor1) {
	                        if (!_canvasContext) {
	                            var c = window.document.createElement('canvas');
	                            if (c && c.getContext) {
	                                _canvasContext = c.getContext('2d');
	                            }
	                        }
	                        if (!_canvasContext) {
	                            return strColor1;
	                        }
	                        _canvasContext.fillStyle = strColor1;
	
	                        //return _canvasContext.fillStyle; //Note: this code will manify wrong.
	                        strColor1 = _canvasContext.fillStyle;
	                        return strColor1;
	                    } : function (strColor2) {
	                        if (typeof _dummyColorSpan === const_undefined) {
	                            _dummyColorSpan = $("<span></span>");
	                        }
	                        _dummyColorSpan.css("color", strColor2);
	                        return _dummyColorSpan.css("color");
	                    };
	                }(util._isStandardCanvas()));
	
	                var hexToColorUnit = function (x) {
	                    return parseInt(x, 16);
	                };
	
	                var hex2ToColorUnit2 = function (x) {
	                    return parseInt(x + x, 16);
	                };
	
	                var decOrPercentToColorUnit = function (x) {
	                    return x.indexOf("%") > 0 ? parseFloat(x) * 2.55 : x | 0;
	                };
	
	                var sColor = normalizeColorString(value);
	                var re = RegExp;
	                if (rrggbbPattern.test(sColor)) {
	                    return ArrayHelper.map([re.$1, re.$2, re.$3], hexToColorUnit);
	                } else if (rgbaFunctionPattern.test(sColor)) {
	                    var v = ArrayHelper.map([re.$1, re.$2, re.$3], decOrPercentToColorUnit);
	                    v.splice(0, 0, parseFloat(re.$4) * 255);
	                    return v;
	                } else if (rgbFunctionPattern.test(sColor)) {
	                    return ArrayHelper.map([re.$1, re.$2, re.$3], decOrPercentToColorUnit);
	                } else if (rgbPattern.test(sColor)) {
	                    return ArrayHelper.map([re.$1, re.$2, re.$3], hex2ToColorUnit2);
	                }
	                return keyword_null;
	            };
	
	            util.position = function (target, options) {
	                if (!options || !options.offset) {
	                    return util._position.call(target, options);
	                }
	
	                var offset = options.offset.split(" "), at = options.at.split(" ");
	                if (offset.length === 1) {
	                    offset[1] = offset[0];
	                }
	                if (/^\d/.test(offset[0])) {
	                    offset[0] = "+" + offset[0];
	                }
	                if (/^\d/.test(offset[1])) {
	                    offset[1] = "+" + offset[1];
	                }
	                if (at.length === 1) {
	                    if (/left|center|right/.test(at[0])) {
	                        at[1] = "center";
	                    } else {
	                        at[1] = at[0];
	                        at[0] = "center";
	                    }
	                }
	
	                return util._position.call(target, _.extend(options, {
	                    at: at[0] + offset[0] + " " + at[1] + offset[1],
	                    offset: ""
	                }));
	            };
	
	            util.hasCalc = function () {
	                return spread.features.calc && spread.features.calc.common;
	            };
	
	            //convert header name to string
	            util.toString = function(value) {
	                try {
	                    if (typeof value === const_undefined || value === keyword_null) {
	                        return '';
	                    } else if (typeof value === const_boolean) {
	                        return value ? const_true : const_false;
	                    } else if (typeof value === const_string) {
	                        return value;
	                    } else if (value instanceof Date) {
	                        return new _DateTimeHelper(value).localeFormat("M/d/yyyy h:mm:ss");
	                    }
	                    //else if (value instanceof CalcArray) {
	                    //    throw formatterUtils.SR.Exp_InvalidCast;
	                    //}
	                    else {
	                        return value.toString();
	                    }
	                } catch (err) {
	                    throw formatterUtils.SR.Exp_InvalidCast;
	                }
	            }
	
	            util.toDateTime = function(value) {
	                if (typeof value === const_undefined || value === keyword_null) {
	                    return _DateTimeHelper.fromOADate(0);
	                } else if (value instanceof Date) {
	                    return new Date(value);
	                } else if (typeof value === const_string) {
	                    var dateTime = _DateTimeHelper.parseLocale(value);
	                    if ((typeof dateTime === const_undefined || dateTime === keyword_null) && !isNaN(value)) {
	                        dateTime = _DateTimeHelper.fromOADate(parseFloat(value));
	                    }
	                    if (dateTime === keyword_undefined || dateTime === keyword_null) {
	                        throw spread.SR.Exp_InvalidArgument;
	                    }
	                    return dateTime;
	                } else if (typeof value === const_number) {
	                    return _DateTimeHelper.fromOADate(value);
	                } else {
	                    throw spread.SR.Exp_InvalidCast;
	                }
	            };
	
	            util.device = function () {
	                var ua = navigator.userAgent;
	                var result = ua.match(/iPad/i), firstMatch, isIpad, isIphone, isAndroid;
	                if (result) {
	                    firstMatch = result[0];
	                    if (firstMatch) {
	                        isIpad = firstMatch.toLowerCase() === "ipad";
	                    }
	                }
	                result = ua.match(/iPhone/i);
	                if (result) {
	                    firstMatch = result[0];
	                    if (firstMatch) {
	                        isIphone = firstMatch.toLowerCase() === "iphone";
	                    }
	                }
	
	                result = ua.match(/android/i);
	                if (result) {
	                    firstMatch = result[0];
	                    if (firstMatch) {
	                        isIphone = firstMatch.toLowerCase() === "android";
	                    }
	                }
	                return {
	                    ipad: isIpad,
	                    iphone: isIphone,
	                    android: isAndroid
	                };
	            };
	
	            util.initPaint = function (id) {
	                var isStandardCanvas = util._isStandardCanvas();
	                if (isStandardCanvas) {
	                    return;
	                }
	                var host = document.getElementById(id);
	                var self = $(host).data('spread');
	                if (!self) {
	                    return;
	                }
	                if (self._initPaintTimeout !== keyword_undefined && self._initPaintTimeout !== keyword_null) {
	                    window.clearTimeout(self._initPaintTimeout);
	                }
	
	                var control = self.canvas.firstChild;
	
	                if (control && control.loaded) {
	                    var spreadsheetObject = control.Content.SpreadsheetObject;
	                    self.attachSpreadsheetObject(spreadsheetObject);
	                } else {
	                    self._initPaintTimeout = window.setTimeout(function () {
	                        util.initPaint(id);
	                    }, 10);
	                }
	            };
	
	            util.isType = function (obj, type) {
	                if (obj === keyword_undefined || obj === keyword_null) {
	                    return type === "null";
	                }
	                if (!type) {
	                    return false;
	                }
	                var basetypes = util._basetypes;
	                if (basetypes[typeof obj] === type) {
	                    return true;
	                }
	                if (type === "function" && /^\s*\bfunction\b/.test("" + obj)) {
	                    return true;
	                }
	
	                if (Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type.toLowerCase()) {
	                    return true;
	                }
	                if (obj && obj._classNames) {
	                    for (var index = 0; index < obj._classNames.length; index++) {
	                        var classname = obj._classNames[index];
	                        if (classname === type) {
	                            return true;
	                        }
	                    }
	                    return false;
	                } else {
	                    if (obj === keyword_undefined || obj === keyword_null) {
	                        return false;
	                    }
	                    if (type === "DateTime" || type === "TimeSpan") {
	                        return obj instanceof Date;
	                    }
	                }
	                if (typeof type === "string") {
	                    if (basetypes[type]) {
	                        return false;
	                    }
	                }
	                return obj instanceof type;
	            };
	
	            util.isCustomType = function (obj, type) {
	                if (obj === keyword_undefined || obj === keyword_null) {
	                    return type === "null";
	                }
	                if (!type) {
	                    return false;
	                }
	                if (obj && obj._classNames) {
	                    for (var index = 0; index < obj._classNames.length; index++) {
	                        var classname = obj._classNames[index];
	                        if (classname === type) {
	                            return true;
	                        }
	                    }
	                    return false;
	                } else {
	                    if (type === "DateTime" || type === "TimeSpan") {
	                        return obj instanceof Date;
	                    }
	                }
	
	                if (type === "function" && /^\s*\bfunction\b/.test("" + obj)) {
	                    return true;
	                }
	                if (Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type.toLowerCase()) {
	                    return true;
	                }
	                return obj instanceof type;
	            };
	            util.asCustomType = function (obj, typename) {
	                if (obj && obj._classNames) {
	                    for (var index = 0; index < obj._classNames.length; index++) {
	                        var classname = obj._classNames[index];
	                        if (classname === typename) {
	                            return obj;
	                        }
	                    }
	                    return keyword_null;
	                }
	                if (util.isType(obj, typename)) {
	                    return obj;
	                } else {
	                    return keyword_null;
	                }
	            };
	
	            util.isStringNumber = function (obj) {
	                if (obj === keyword_undefined || obj === keyword_null) {
	                    return false;
	                }
	                return /^[-,.\d]+$/.test(obj.toString());
	            };
	
	            //static asType(obj: any, typename: string): any {
	            //    if (util.isType(obj, typename)) {
	            //        return obj;
	            //    } else {
	            //        return keyword_null;
	            //    }
	            //}
	            util.getPreferredZIndex = function (context) {
	                var element = context;
	                while (element && element.parentElement && element.parentElement !== document.body) {
	                    element = element.parentElement;
	                }
	                var zindex = 1000, index;
	                if (element && element.parentElement === document.body) {
	                    index = parseInt($(element).css("z-index"));
	                    if (!isNaN(index)) {
	                        zindex += index;
	                    }
	                }
	                return zindex;
	            };
	            //util._position = $.fn.position;
	
	            util._basetypes = { 'undefined': 'undefined', 'number': 'number', 'boolean': 'boolean', 'string': 'string' };
	            return util;
	        })();
	        spread.util = util;
	
	        var StringUtil = (function () {
	            function StringUtil() {
	            }
	            StringUtil.replace = function (src, substr, replacement) {
	                return src.split(substr).join(replacement);
	            };
	
	            StringUtil.startsWith = function (src, prefix) {
	                return src.indexOf(prefix) === 0;
	            };
	
	            StringUtil.endsWith = function (src, suffix) {
	                var l = src.length - suffix.length;
	                return l >= 0 && src.indexOf(suffix, l) === l;
	            };
	
	            StringUtil.leftBefore = function (src, suffex) {
	                var index = src.indexOf(suffex);
	                if (index < 0 || index >= src.length) {
	                    return src;
	                } else {
	                    return src.substr(0, index);
	                }
	            };
	
	            StringUtil.contains = function (src, ss) {
	                return src.indexOf(ss) >= 0;
	            };
	
	            StringUtil.count = function (src, ss) {
	                var count = 0, pos = src.indexOf(ss);
	                while (pos >= 0) {
	                    count += 1;
	                    pos = src.indexOf(ss, pos + 1);
	                }
	                return count;
	            };
	            return StringUtil;
	        })();
	        spread.StringUtil = StringUtil;
	
	        var RegUtil = (function () {
	            function RegUtil() {
	            }
	            RegUtil.getReg = function (regStr) {
	                var reg = RegUtil.regDict[regStr];
	                if (!reg) {
	                    reg = RegUtil.regDict[regStr] = new RegExp(regStr, 'g');
	                }
	                reg.lastIndex = 0;
	                return reg;
	            };
	
	            RegUtil.getRegIgnoreCase = function (regStr) {
	                var reg = RegUtil.regDictIgnoreCase[regStr];
	                if (!reg) {
	                    reg = RegUtil.regDictIgnoreCase[regStr] = new RegExp(regStr, 'gi');
	                }
	                reg.lastIndex = 0;
	                return reg;
	            };
	
	            RegUtil.getWildcardCriteria = function (criteria) {
	                if (RegUtil.wildcardParseRecord[criteria]) {
	                    return RegUtil.wildcardParseResultBuffer[criteria];
	                }
	                if (RegUtil.getReg("[~?*]+").test(criteria)) {
	                    var criteriaTemp = criteria;
	                    var asteriskSymbol = RegUtil.getReplaceSymbol("asterisk", criteriaTemp);
	                    var questionSymbol = RegUtil.getReplaceSymbol("question", criteriaTemp);
	                    var tildeSymbol = RegUtil.getReplaceSymbol("tilde", criteriaTemp);
	
	                    criteriaTemp = StringUtil.replace(criteriaTemp, "~~", tildeSymbol);
	                    criteriaTemp = StringUtil.replace(criteriaTemp, "~*", asteriskSymbol);
	                    criteriaTemp = StringUtil.replace(criteriaTemp, "~?", questionSymbol);
	
	                    criteriaTemp = criteriaTemp.replace(RegUtil.getReg("([.+$^\\[\\](){}|\/])"), "\\$1");
	                    criteriaTemp = StringUtil.replace(criteriaTemp, "*", ".*");
	                    criteriaTemp = StringUtil.replace(criteriaTemp, "?", ".");
	
	                    criteriaTemp = StringUtil.replace(criteriaTemp, asteriskSymbol, "\\*");
	                    criteriaTemp = StringUtil.replace(criteriaTemp, questionSymbol, "\\?");
	                    criteriaTemp = StringUtil.replace(criteriaTemp, tildeSymbol, "~");
	                    RegUtil.wildcardParseResultBuffer[criteria] = criteriaTemp;
	                    RegUtil.wildcardParseRecord[criteria] = true;
	                    return criteriaTemp;
	                }
	
	                return keyword_null;
	            };
	
	            RegUtil.getWildcardCriteriaFullMatch = function (criteria) {
	                var criteriaTemp = RegUtil.getWildcardCriteria(criteria);
	                if (criteriaTemp) {
	                    criteriaTemp = '^' + criteriaTemp + '$';
	                }
	                return criteriaTemp;
	            };
	
	            RegUtil.getReplaceSymbol = function (expectSymbol, srcStr) {
	                var asteriskSymbol = '#' + expectSymbol + "0#";
	                for (var i = 1; i < 10000; i++) {
	                    if (srcStr.indexOf(asteriskSymbol) > 0) {
	                        asteriskSymbol = StringUtil.replace(asteriskSymbol, "#" + expectSymbol + (i - 1) + "#", "#" + expectSymbol + i + "#");
	                        continue;
	                    }
	                    return asteriskSymbol;
	                }
	            };
	            RegUtil.regDict = {};
	            RegUtil.regDictIgnoreCase = {};
	            RegUtil.wildcardParseRecord = {};
	            RegUtil.wildcardParseResultBuffer = {};
	            return RegUtil;
	        })();
	        spread.RegUtil = RegUtil;
	
	        //<editor-fold desc="StringBuilder">
	        var _StringBuilder = (function () {
	            function _StringBuilder(str) {
	                this._value = {};
	                this._len = 0;
	                this._init(str);
	            }
	            _StringBuilder.prototype._init = function (initialText) {
	                this._parts = (typeof (initialText) !== const_undefined && initialText !== keyword_null && initialText !== '') ? [initialText.toString()] : [];
	                this._value = {};
	                this._len = 0;
	            };
	
	            _StringBuilder.prototype._insert = function (text) {
	                this._parts.splice(0, 0, text);
	            };
	
	            _StringBuilder.prototype.insert = function (text, position) {
	                var self = this;
	                if (position === keyword_undefined || position === keyword_null) {
	                    position = 0;
	                }
	                if (position === 0) {
	                    self._insert(text);
	                    return;
	                }
	                var content = self.toString();
	                if (position >= content.length) {
	                    self.append(text);
	                    return;
	                }
	                var first = content.substring(0, position);
	                var left = content.substr(position);
	                self._init(first + text + left);
	            };
	
	            _StringBuilder.prototype.append = function (text) {
	                this._parts[this._parts.length] = text;
	            };
	
	            _StringBuilder.prototype.appendLine = function (text) {
	                this._parts[this._parts.length] = ((typeof (text) === const_undefined) || (text === keyword_null) || (text === '')) ? '\r\n' : text + '\r\n';
	            };
	
	            _StringBuilder.prototype.clear = function () {
	                this._init();
	            };
	
	            _StringBuilder.prototype.isEmpty = function () {
	                if (this._parts.length === 0) {
	                    return true;
	                }
	                return this.toString() === '';
	            };
	
	            _StringBuilder.prototype.toString = function (separator) {
	                var self = this;
	                separator = separator || '';
	                var parts = self._parts;
	                if (self._len !== parts.length) {
	                    self._value = {};
	                    self._len = parts.length;
	                }
	                var val = self._value;
	                if (typeof (val[separator]) === const_undefined) {
	                    if (separator !== '') {
	                        for (var i = 0; i < parts.length;) {
	                            if ((typeof (parts[i]) === const_undefined) || (parts[i] === '') || (parts[i] === keyword_null)) {
	                                parts.splice(i, 1);
	                            } else {
	                                i++;
	                            }
	                        }
	                    }
	                    val[separator] = self._parts.join(separator);
	                }
	                return val[separator];
	            };
	            return _StringBuilder;
	        })();
	        spread._StringBuilder = _StringBuilder;
	
	        //</editor-fold>
	
	        //</editor-fold>
	        //<editor-fold desc="StringHelper">
	        var _StringHelper = (function () {
	            function _StringHelper(str) {
	                this._str = str;
	            }
	            _StringHelper.__toFormattedString = function (useLocale, args) {
	                var result = '';
	                var format = args[0];
	                for (var i = 0; ;) {
	                    var open = format.indexOf('{', i);
	                    var close = format.indexOf('}', i);
	                    if ((open < 0) && (close < 0)) {
	                        result += format.slice(i);
	                        break;
	                    }
	                    if ((close > 0) && ((close < open) || (open < 0))) {
	                        if (format.charAt(close + 1) !== '}') {
	                            throw new Error(spread.SR.Exp_BraceMismatch);
	                        }
	                        result += format.slice(i, close + 1);
	                        i = close + 2;
	                        continue;
	                    }
	                    result += format.slice(i, open);
	                    i = open + 1;
	                    if (format.charAt(i) === '{') {
	                        result += '{';
	                        i++;
	                        continue;
	                    }
	                    if (close < 0) {
	                        throw new Error(spread.SR.Exp_BraceMismatch);
	                    }
	                    var brace = format.substring(i, close);
	                    var colonIndex = brace.indexOf(':');
	                    var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
	                    if (isNaN(argNumber)) {
	                        throw new Error(spread.SR.Exp_InvalidFormat);
	                    }
	                    var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
	                    var arg = args[argNumber];
	                    if (typeof (arg) === const_undefined || arg === keyword_null) {
	                        arg = '';
	                    }
	                    if (arg.toFormattedString) {
	                        result += arg.toFormattedString(argFormat);
	                    } else if (useLocale && arg.localeFormat) {
	                        result += arg.localeFormat(argFormat);
	                    } else if (arg.format) {
	                        result += arg.format(argFormat);
	                    } else {
	                        result += arg.toString();
	                    }
	                    i = close + 1;
	                }
	                return result;
	            };
	
	            _StringHelper.prototype.startsWith = function (prefix) {
	                return (this._str.substr(0, prefix.length) === prefix);
	            };
	
	            _StringHelper.prototype.endsWith = function (suffix) {
	                return this._str.indexOf(suffix, this._str.length - suffix.length) !== -1;
	            };
	
	            _StringHelper.prototype.trim = function () {
	                return this._str.replace(/^\s+|\s+$/g, '');
	            };
	
	            _StringHelper.prototype.trimEnd = function () {
	                return this._str.replace(/\s+$/, '');
	            };
	
	            _StringHelper.prototype.trimStart = function () {
	                return this._str.replace(/^\s+/, '');
	            };
	            _StringHelper.prototype.format = function (format, args) {
	                var args2 = [];
	                args2.push(format);
	                for (var i = 0; i < args.length; i++) {
	                    args2.push(args[i]);
	                }
	                return _StringHelper.__toFormattedString(false, args2);
	            };
	            return _StringHelper;
	        })();
	        spread._StringHelper = _StringHelper;
	
	        var StringHelper = (function () {
	            function StringHelper() {
	            }
	            StringHelper.Contains = function (str, value) {
	                return value === "" || str.indexOf(value) >= 0;
	            };
	
	            StringHelper.IndexOf = function (str, value, comparisonType) {
	                if (!comparisonType) {
	                    return str.indexOf(value);
	                } else if (comparisonType === 1 /* CurrentCultureIgnoreCase */) {
	                    var tempStr = str.toLowerCase();
	                    var tempValue = value.toLowerCase();
	                    return tempStr.indexOf(tempValue);
	                } else {
	                    return str.indexOf(value);
	                }
	            };
	
	            StringHelper.TrimStart = function (str, trimChar) {
	                if (!trimChar) {
	                    return str;
	                }
	                var temp = str;
	                while (true) {
	                    if (temp.substr(0, trimChar.length) !== trimChar) {
	                        break;
	                    }
	                    temp = temp.substr(trimChar.length);
	                }
	                return temp;
	            };
	
	            StringHelper.TrimEnd = function (str, trimChar) {
	                if (!trimChar) {
	                    return str;
	                }
	                var temp = str;
	                while (true) {
	                    if (temp.substr(temp.length - trimChar.length, trimChar.length) !== trimChar) {
	                        break;
	                    }
	                    temp = temp.substr(0, temp.length - trimChar.length);
	                }
	                return temp;
	            };
	
	            StringHelper.Trim = function (str, trimChar) {
	                var temp = trimChar;
	                if (!trimChar) {
	                    temp = " ";
	                }
	                str = StringHelper.TrimStart(str, temp);
	                str = StringHelper.TrimEnd(str, temp);
	                return str;
	            };
	
	            StringHelper.Insert = function (str, startIndex, value) {
	                if (startIndex < 0 || startIndex > str.length || value === keyword_null || value === keyword_undefined) {
	                    throw new Error();
	                }
	                var tempStrStart = str.substr(0, startIndex);
	                var tempStrEnd = str.substr(startIndex, str.length - startIndex);
	                return tempStrStart + value + tempStrEnd;
	            };
	
	            StringHelper.Remove = function (str, startIndex, count) {
	                if (count === keyword_undefined || count === keyword_null) {
	                    count = str.length - startIndex;
	                }
	                if (startIndex < 0 || count < 0 || startIndex + count > str.length) {
	                    throw new Error();
	                }
	                var valueStart = str.substr(0, startIndex);
	                var valueEnd = str.substr(startIndex + count, str.length - startIndex - count);
	                return valueStart + valueEnd;
	            };
	
	            StringHelper.StartsWith = function (str, value, comparisonType) {
	                if (!value) {
	                    throw new Error();
	                }
	                if (value === "") {
	                    return true;
	                }
	                if (value.length > str.length) {
	                    return false;
	                }
	                var thisStr = str;
	                var valueStr = value;
	                if (comparisonType === 1 /* CurrentCultureIgnoreCase */) {
	                    thisStr = thisStr.toLowerCase();
	                    valueStr = valueStr.toLowerCase();
	                }
	                return thisStr.search(new RegExp("^" + valueStr)) > -1;
	            };
	
	            StringHelper.EndsWith = function (str, value, comparisonType) {
	                if (!value) {
	                    throw new Error();
	                }
	                if (value === "") {
	                    return true;
	                }
	                if (value.length > str.length) {
	                    return false;
	                }
	                var thisStr = str;
	                var valueStr = value;
	                if (comparisonType === 1 /* CurrentCultureIgnoreCase */) {
	                    thisStr = thisStr.toLowerCase();
	                    valueStr = valueStr.toLowerCase();
	                }
	                return thisStr.search(new RegExp(valueStr + "$")) > -1;
	            };
	
	            StringHelper.Replace = function (str, oldValue, newValue) {
	                if (!oldValue || oldValue === "") {
	                    throw new Error();
	                }
	                var re = new RegExp(oldValue, "g");
	                return str.replace(re, newValue);
	            };
	            return StringHelper;
	        })();
	        spread.StringHelper = StringHelper;
	
	        //</editor-fold>
	        //<editor-fold desc="DateHelper">
	        var _DateTimeHelper = (function () {
	            function _DateTimeHelper(date) {
	                this._date = date;
	            }
	            _DateTimeHelper.prototype.Hour = function () {
	                return this._date.getHours();
	            };
	
	            _DateTimeHelper.prototype.Minute = function () {
	                return this._date.getMinutes();
	            };
	
	            _DateTimeHelper.prototype.Second = function () {
	                return this._date.getSeconds();
	            };
	
	            _DateTimeHelper.prototype.Millisecond = function () {
	                return this._date.getMilliseconds();
	            };
	
	            _DateTimeHelper.prototype.TotalDays = function () {
	                return Math_floor(this.toOADate());
	            };
	
	            _DateTimeHelper.prototype.toOADate = function () {
	                return _DateTimeHelper.___toOADate(this._date);
	            };
	
	            _DateTimeHelper.prototype.format = function (format) {
	                return this._toFormattedString(format, globalize.Cultures._CultureInfo._currentCulture);
	            };
	
	            _DateTimeHelper.prototype.customCultureFormat = function (format, cultureInfo) {
	                if (!cultureInfo) {
	                    cultureInfo = globalize.Cultures._CultureInfo._currentCulture;
	                }
	                return this._toFormattedString(format, cultureInfo);
	            };
	
	            _DateTimeHelper.prototype.localeFormat = function (format) {
	                return this._toFormattedString(format, globalize.Cultures._CultureInfo._currentCulture);
	            };
	
	            _DateTimeHelper.prototype._toFormattedString = function (format, cultureInfo) {
	                var self = this;
	                var dtf = cultureInfo.DateTimeFormat(), convert = dtf.Calendar.convert;
	                if (!format || !format.length || (format === 'i')) {
	                    if (cultureInfo && cultureInfo.Name().length) {
	                        if (convert) {
	                            return self._toFormattedString(dtf.fullDateTimePattern, cultureInfo);
	                        } else {
	                            return self._date.toLocaleString();
	                            //var eraDate = new Date(self._date.getTime());
	                            //var era = _DateTimeHelper.__getEra(self._date, dtf.eras);
	                            //eraDate.setFullYear(_DateTimeHelper.__getEraYear(self._date, dtf, era));
	                            //return eraDate.toLocaleString();
	                        }
	                    } else {
	                        return self._date.toString();
	                    }
	                }
	                var eras = dtf.eras, sortable = (format === "s");
	                format = _DateTimeHelper.__expandFormat(dtf, format);
	                var ret = "";
	                var hour;
	
	                var foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g;
	
	                function hasDay() {
	                    if (foundDay || checkedDay) {
	                        return foundDay;
	                    }
	                    foundDay = dayPartRegExp.test(format);
	                    checkedDay = true;
	                    return foundDay;
	                }
	
	                var quoteCount = 0, tokenRegExp = _DateTimeHelper.__getTokenRegExp(), converted;
	                if (!sortable && convert) {
	                    converted = convert.fromGregorian(self._date);
	                }
	                function getPart(date, part) {
	                    if (converted) {
	                        return converted[part];
	                    }
	                    switch (part) {
	                        case 0:
	                            return date.getFullYear();
	                        case 1:
	                            return date.getMonth();
	                        case 2:
	                            return date.getDate();
	                    }
	                }
	
	                var eraDateInfo = keyword_null;
	                var eraIndex = -2;
	                var eraYearIndex = -2;
	                var stringValue = { value: "" };
	                for (var tokenIndex = 0; ; tokenIndex++) {
	                    var index = tokenRegExp.lastIndex;
	                    var ar = tokenRegExp.exec(format);
	                    var preMatch = format.slice(index, ar ? ar.index : format.length);
	                    stringValue.value = "";
	                    quoteCount += _DateTimeHelper.__appendPreOrPostMatch(preMatch, stringValue);
	                    ret += stringValue.value;
	                    if (!ar) {
	                        break;
	                    }
	                    if ((quoteCount % 2) === 1) {
	                        ret += (ar[0]);
	                        continue;
	                    }
	
	                    switch (ar[0]) {
	                        case "dddd":
	                            ret += (dtf.dayNames[self._date.getDay()]);
	                            break;
	                        case "ddd":
	                            ret += (dtf.abbreviatedDayNames[self._date.getDay()]);
	                            break;
	                        case "dd":
	                            foundDay = true;
	                            ret += (_DateTimeHelper.___addLeadingZero(getPart(self._date, 2)));
	                            break;
	                        case "d":
	                            foundDay = true;
	                            ret += (getPart(self._date, 2));
	                            break;
	                        case "MMMM":
	                            ret += ((dtf.monthGenitiveNames && hasDay()) ? dtf.monthGenitiveNames[getPart(self._date, 1)] : dtf.monthNames[getPart(self._date, 1)]);
	                            break;
	                        case "MMM":
	                            ret += ((dtf.abbreviatedMonthGenitiveNames && hasDay()) ? dtf.abbreviatedMonthGenitiveNames[getPart(self._date, 1)] : dtf.abbreviatedMonthNames[getPart(self._date, 1)]);
	                            break;
	                        case "MM":
	                            ret += (_DateTimeHelper.___addLeadingZero(getPart(self._date, 1) + 1));
	                            break;
	                        case "M":
	                            ret += (getPart(self._date, 1) + 1);
	                            break;
	                        case "yyyy":
	                        case "yyy":
	                            // If era had been setted, same as "ee".
	                            if (eraIndex >= 0) {
	                                ret += eras.formatEraPart("ee", self._date);
	                            } else {
	                                ret += (_DateTimeHelper.___padYear(converted ? converted[0] : self._date.getFullYear()));
	                            }
	                            break;
	                        case "yy":
	                            // If era had been setted, same as "ee".
	                            if (eraIndex >= 0) {
	                                ret += eras.formatEraPart("ee", self._date);
	                            } else {
	                                ret += (_DateTimeHelper.___addLeadingZero((converted ? converted[0] : self._date.getFullYear()) % 100));
	                            }
	                            break;
	                        case "y":
	                            // If era had been setted, same as "e".
	                            if (eraIndex >= 0) {
	                                ret += eras.formatEraPart("e", self._date);
	                            } else {
	                                ret += (((converted ? converted[0] : self._date.getFullYear()) % 100).toString());
	                            }
	                            break;
	                        case "hh":
	                            hour = self._date.getHours() % 12;
	                            if (hour === 0) {
	                                hour = 12;
	                            }
	                            ret += (_DateTimeHelper.___addLeadingZero(hour));
	                            break;
	                        case "h":
	                            hour = self._date.getHours() % 12;
	                            if (hour === 0) {
	                                hour = 12;
	                            }
	                            ret += (hour);
	                            break;
	                        case "HH":
	                            ret += (_DateTimeHelper.___addLeadingZero(self._date.getHours()));
	                            break;
	                        case "H":
	                            ret += (self._date.getHours().toString());
	                            break;
	                        case "mm":
	                            ret += (_DateTimeHelper.___addLeadingZero(self._date.getMinutes()));
	                            break;
	                        case "m":
	                            ret += (self._date.getMinutes().toString());
	                            break;
	                        case "ss":
	                            ret += (_DateTimeHelper.___addLeadingZero(self._date.getSeconds()));
	                            break;
	                        case "s":
	                            ret += (self._date.getSeconds().toString());
	                            break;
	                        case "tt":
	                            ret += ((self._date.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator);
	                            break;
	                        case "t":
	                            ret += (((self._date.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator).charAt(0));
	                            break;
	                        case "f":
	                            ret += (_DateTimeHelper.___addLeadingZeros(self._date.getMilliseconds()).charAt(0));
	                            break;
	                        case "ff":
	                            ret += (_DateTimeHelper.___addLeadingZeros(self._date.getMilliseconds()).substr(0, 2));
	                            break;
	                        case "fff":
	                            ret += (_DateTimeHelper.___addLeadingZeros(self._date.getMilliseconds()));
	                            break;
	                        case "z":
	                            hour = self._date.getTimezoneOffset() / 60;
	                            ret += (((hour <= 0) ? '+' : '-') + Math_floor(Math_abs(hour)));
	                            break;
	                        case "zz":
	                            hour = self._date.getTimezoneOffset() / 60;
	                            ret += (((hour <= 0) ? '+' : '-') + _DateTimeHelper.___addLeadingZero(Math_floor(Math_abs(hour))));
	                            break;
	                        case "zzz":
	                            hour = self._date.getTimezoneOffset() / 60;
	                            ret += (((hour <= 0) ? '+' : '-') + _DateTimeHelper.___addLeadingZero(Math_floor(Math_abs(hour))) + ":" + _DateTimeHelper.___addLeadingZero(Math_abs(self._date.getTimezoneOffset() % 60)));
	                            break;
	                        case "g":
	                        case "gg":
	                        case "ggg":
	                            // other culture, do nothing.
	                            if (!eras) {
	                                break;
	                            }
	                            if (eraIndex === tokenIndex - 1) {
	                                eraIndex = tokenIndex;
	                                break;
	                            } else {
	                                ret += eras.formatEraPart(ar[0], self._date);
	                                eraIndex = tokenIndex;
	                            }
	                            break;
	                        case "e":
	                        case "ee":
	                            // other culture
	                            if (!eras) {
	                                ret += (_DateTimeHelper.___padYear(converted ? converted[0] : self._date.getFullYear()));
	                                break;
	                            } else if (eraYearIndex === tokenIndex - 1) {
	                                eraYearIndex = tokenIndex;
	                                break;
	                            } else {
	                                ret += eras.formatEraPart(ar[0], self._date);
	                                eraYearIndex = tokenIndex;
	                            }
	                            break;
	                        case "/":
	                            ret += (dtf.dateSeparator);
	                            break;
	                        case "[h]":
	                            ret += ("[h]");
	                            break;
	                        case "[hh]":
	                            ret += ("[hh]");
	                            break;
	                        case "[mm]":
	                            ret += ("[mm]");
	                            break;
	                        case "[ss]":
	                            ret += ("[ss]");
	                            break;
	                        default:
	                            throw new Error(spread.SR.Exp_InvalidDateFormat);
	                    }
	                }
	                return ret.toString();
	            };
	
	            _DateTimeHelper.parseLocale = function (value, formats) {
	                var args;
	                if (formats) {
	                    args = [value, formats];
	                } else {
	                    args = [value];
	                }
	                return _DateTimeHelper._parseDate(value, globalize.Cultures._CultureInfo._currentCulture, args);
	            };
	
	            _DateTimeHelper.parseInvariant = function (value, formats) {
	                return _DateTimeHelper._parseDate(value, globalize.Cultures._CultureInfo.invariantCulture(), [value, formats]);
	            };
	
	            _DateTimeHelper.__appendPreOrPostMatch = function (preMatch, strBuilder) {
	                var quoteCount = 0;
	                var escaped = false;
	                for (var i = 0, il = preMatch.length; i < il; i++) {
	                    var c = preMatch.charAt(i);
	                    switch (c) {
	                        case '\'':
	                        case '\"':
	                            if (escaped) {
	                                strBuilder.value += "'";
	                            } else {
	                                quoteCount++;
	                            }
	                            escaped = false;
	                            break;
	                        case '\\':
	                            if (escaped) {
	                                strBuilder.value += "\\";
	                            }
	                            escaped = !escaped;
	                            break;
	                        default:
	                            strBuilder.value += c;
	                            escaped = false;
	                            break;
	                    }
	                }
	                return quoteCount;
	            };
	
	            _DateTimeHelper.__expandFormat = function (dtf, format) {
	                if (!format) {
	                    format = "F";
	                }
	                var len = format.length;
	                if (len === 1) {
	                    switch (format) {
	                        case "d":
	                            return dtf.shortDatePattern;
	                        case "D":
	                            return dtf.longDatePattern;
	                        case "t":
	                            return dtf.shortTimePattern;
	                        case "T":
	                            return dtf.longTimePattern;
	                        case "f":
	                            return dtf.longDatePattern + " " + dtf.shortTimePattern;
	                        case "F":
	                            return dtf.fullDateTimePattern;
	                        case "M":
	                        case "m":
	                            return dtf.monthDayPattern;
	                        case "s":
	                            return dtf.sortableDateTimePattern;
	                        case "Y":
	                        case "y":
	                            return dtf.yearMonthPattern;
	                        case "g":
	                            return dtf.shortDatePattern + " " + dtf.shortTimePattern;
	                        case "G":
	                            return dtf.shortDatePattern + " " + dtf.longTimePattern;
	                        case "e":
	                            return format;
	                        case "R":
	                        case "r":
	                            return dtf.rfc1123Pattern;
	                        case "u":
	                            return dtf.universalSortableDateTimePattern;
	                        case "U":
	                            return dtf.fullDateTimePattern;
	                        case "o":
	                        case "O":
	                            return "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss\'.\'fffffff";
	                        default:
	                            throw new Error(spread.SR.Exp_InvalidString);
	                    }
	                } else if ((len === 2) && (format.charAt(0) === "%")) {
	                    format = format.charAt(1);
	                }
	                return format;
	            };
	
	            _DateTimeHelper.__expandYear = function (cultureInfo, year) {
	                var now = new Date();
	                var eras = cultureInfo.DateTimeFormat().eras;
	                if (eras && year < 100) {
	                    var curr = eras.getEraDate(now).eraYear;
	                    year += curr - (curr % 100);
	                    if (year > cultureInfo.DateTimeFormat().Calendar.TwoDigitYearMax) {
	                        year -= 100;
	                    }
	                }
	                return year;
	            };
	
	            _DateTimeHelper.__getTokenRegExp = function () {
	                return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|ggg|gg|g|ee|e|\[h\]|\[hh\]|\[mm\]|\[ss\]/g;
	            };
	
	            _DateTimeHelper.__getParseRegExp = function (dtf, format) {
	                if (!dtf._parseRegExp) {
	                    dtf._parseRegExp = {};
	                } else if (dtf._parseRegExp[format]) {
	                    return dtf._parseRegExp[format];
	                }
	                var expFormat = _DateTimeHelper.__expandFormat(dtf, format);
	
	                // Cylj fix the bug 41571 at 2013/10/21.
	                // The validDateTimeFormatString will replace the "m" to "%M",
	                // So remove the "%" here.
	                expFormat = expFormat.replace("%M", "M");
	                expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
	                var regexp = "^";
	                var stringValue = { value: "" };
	                var groups = [];
	                var index = 0;
	                var quoteCount = 0;
	                var tokenRegExp = _DateTimeHelper.__getTokenRegExp();
	                var match;
	                while ((match = tokenRegExp.exec(expFormat)) !== keyword_null) {
	                    stringValue.value = "";
	                    var preMatch = expFormat.slice(index, match.index);
	                    index = tokenRegExp.lastIndex;
	                    quoteCount += _DateTimeHelper.__appendPreOrPostMatch(preMatch, stringValue);
	                    regexp += stringValue.value;
	                    if ((quoteCount % 2) === 1) {
	                        regexp += match[0];
	                        continue;
	                    }
	                    switch (match[0]) {
	                        case 'dddd':
	                        case 'ddd':
	                        case 'MMMM':
	                        case 'MMM':
	                        case 'gggg':
	                        case 'ggg':
	                        case 'gg':
	                        case 'g':
	                            regexp += "(\\D+)";
	                            break;
	                        case 'tt':
	                        case 't':
	                            regexp += "(\\D*)";
	                            break;
	                        case 'yyy':
	                        case 'yyyy':
	                            regexp += "(\\d{4})";
	                            break;
	                        case 'fff':
	                            regexp += "(\\d{3})";
	                            break;
	                        case 'ff':
	                            regexp += "(\\d{2})";
	                            break;
	                        case 'f':
	                            regexp += "(\\d)";
	                            break;
	                        case 'dd':
	                        case 'd':
	                        case 'MM':
	                        case 'M':
	                        case 'yy':
	                        case 'y':
	                        case 'eee':
	                        case 'ee':
	                        case 'e':
	                        case 'HH':
	                        case 'H':
	                        case 'hh':
	                        case 'h':
	                        case 'mm':
	                        case 'm':
	                        case 'ss':
	                        case 's':
	                            regexp += "(\\d\\d?)";
	                            break;
	                        case 'zzz':
	                            regexp += "([+-]?\\d\\d?:\\d{2})";
	                            break;
	                        case 'zz':
	                        case 'z':
	                            regexp += "([+-]?\\d\\d?)";
	                            break;
	                        case '/':
	                            regexp += "(\\" + dtf.dateSeparator + ")";
	                            break;
	                        default:
	                            throw new Error(spread.SR.Exp_InvalidDateFormat);
	                    }
	                    ArrayHelper.add(groups, match[0]);
	                }
	                stringValue.value = "";
	                _DateTimeHelper.__appendPreOrPostMatch(expFormat.slice(index), stringValue);
	                regexp += stringValue.value;
	                regexp += "$";
	                var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
	                var parseRegExp = { 'regExp': regexpStr, 'groups': groups, 'exp': new RegExp(regexpStr) };
	                dtf._parseRegExp[format] = parseRegExp;
	                return parseRegExp;
	            };
	
	            _DateTimeHelper._parseDateExact = function (value, format, cultureInfo) {
	                value = new _StringHelper(value).trim();
	                var dtf = cultureInfo.DateTimeFormat(), parseInfo = _DateTimeHelper.__getParseRegExp(dtf, format), match = parseInfo.exp.exec(value);
	                if (match === keyword_null) {
	                    return keyword_null;
	                }
	
	                var groups = parseInfo.groups, era = keyword_null, year = keyword_null, month = keyword_null, date = keyword_null, weekDay = keyword_null, hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = keyword_null, pmHour = false;
	                var isTimeSpan = true;
	                for (var j = 0, jl = groups.length; j < jl; j++) {
	                    var matchGroup = match[j + 1];
	                    if (matchGroup) {
	                        switch (groups[j]) {
	                            case 'dd':
	                            case 'd':
	                                isTimeSpan = false;
	                                date = parseInt(matchGroup, 10);
	                                if ((date < 1) || (date > 31)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'MMMM':
	                                isTimeSpan = false;
	                                month = cultureInfo._getMonthIndex(matchGroup);
	                                if ((month < 0) || (month > 11)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'MMM':
	                                isTimeSpan = false;
	                                month = cultureInfo._getAbbrMonthIndex(matchGroup);
	                                if ((month < 0) || (month > 11)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'M':
	                            case 'MM':
	                            case '%M':
	                                isTimeSpan = false;
	                                month = parseInt(matchGroup, 10) - 1;
	                                if ((month < 0) || (month > 11)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'e':
	                            case 'ee':
	                                isTimeSpan = false;
	                                year = _DateTimeHelper.__expandYear(cultureInfo, parseInt(matchGroup, 10));
	                                if ((year < 0) || (year > 9999)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'y':
	                            case 'yy':
	                            case 'yyy':
	                            case 'yyyy':
	                                isTimeSpan = false;
	                                year = parseInt(matchGroup, 10);
	                                if ((year < 0) || (year > 9999)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'h':
	                            case 'hh':
	                            case 'H':
	                            case 'HH':
	                                hour = parseInt(matchGroup, 10);
	                                if ((hour < 0) || (hour > 23)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'm':
	                            case 'mm':
	                                min = parseInt(matchGroup, 10);
	                                if ((min < 0) || (min > 59)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 's':
	                            case 'ss':
	                                sec = parseInt(matchGroup, 10);
	                                if ((sec < 0) || (sec > 59)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'tt':
	                            case 't':
	                                var upperToken = matchGroup.toUpperCase();
	                                pmHour = (upperToken === dtf.pmDesignator.toUpperCase());
	                                if (!pmHour && (upperToken !== dtf.amDesignator.toUpperCase())) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'f':
	                                msec = parseInt(matchGroup, 10) * 100;
	                                if ((msec < 0) || (msec > 999)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'ff':
	                                msec = parseInt(matchGroup, 10) * 10;
	                                if ((msec < 0) || (msec > 999)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'fff':
	                                msec = parseInt(matchGroup, 10);
	                                if ((msec < 0) || (msec > 999)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'dddd':
	                                isTimeSpan = false;
	                                weekDay = cultureInfo._getDayIndex(matchGroup);
	                                if ((weekDay < 0) || (weekDay > 6)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'ddd':
	                                isTimeSpan = false;
	                                weekDay = cultureInfo._getAbbrDayIndex(matchGroup);
	                                if ((weekDay < 0) || (weekDay > 6)) {
	                                    return keyword_null;
	                                }
	                                break;
	                            case 'zzz':
	                                var offsets = matchGroup.split(/:/);
	                                if (offsets.length !== 2) {
	                                    return keyword_null;
	                                }
	                                hourOffset = parseInt(offsets[0], 10);
	                                if ((hourOffset < -12) || (hourOffset > 13)) {
	                                    return keyword_null;
	                                }
	                                var minOffset = parseInt(offsets[1], 10);
	                                if ((minOffset < 0) || (minOffset > 59)) {
	                                    return keyword_null;
	                                }
	                                tzMinOffset = (hourOffset * 60) + (new _StringHelper(matchGroup).startsWith('-') ? -minOffset : minOffset);
	                                break;
	                            case 'z':
	                            case 'zz':
	                                hourOffset = parseInt(matchGroup, 10);
	                                if ((hourOffset < -12) || (hourOffset > 13)) {
	                                    return keyword_null;
	                                }
	                                tzMinOffset = hourOffset * 60;
	                                break;
	                            case 'g':
	                            case 'gg':
	                            case "ggg":
	                                var eraName = matchGroup;
	                                if (!eraName || !dtf.eras) {
	                                    return keyword_null;
	                                }
	                                era = dtf.eras.parseEraPart(groups[j], eraName);
	                                if (era < 0) {
	                                    return keyword_null;
	                                }
	                                break;
	                        }
	                    }
	                }
	
	                //1899/12/30 is the start date of OADate
	                var result = new Date(1899, 11, 30), defaults, convert = dtf.Calendar.convert;
	                if (convert) {
	                    defaults = convert.fromGregorian(result);
	                }
	                if (!convert) {
	                    defaults = [result.getFullYear(), result.getMonth(), result.getDate()];
	                }
	                if (year === keyword_null) {
	                    year = defaults[0];
	                } else if (year < 100) {
	                    if (dtf.eras) {
	                        //year += dtf.eras[(era || 0) + 3];
	                        year = dtf.eras.getYearFromEra(era || 0, year);
	                    } else {
	                        if (year >= 30) {
	                            year += 1900;
	                        } else {
	                            year += 2000;
	                        }
	                    }
	                }
	                if (month === keyword_null) {
	                    month = defaults[1];
	                }
	                if (date === keyword_null) {
	                    date = defaults[2];
	                }
	                if (convert) {
	                    result = convert.toGregorian(year, month, date);
	                    if (result === keyword_null) {
	                        return keyword_null;
	                    }
	                } else {
	                    result.setFullYear(year, month, date);
	                    if (result.getDate() !== date) {
	                        return keyword_null;
	                    }
	                    if ((weekDay !== keyword_null) && (result.getDay() !== weekDay)) {
	                        return keyword_null;
	                    }
	                }
	                if (pmHour && (hour < 12)) {
	                    hour += 12;
	                }
	                result.setHours(hour, min, sec, msec);
	                if (tzMinOffset !== keyword_null) {
	                    var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
	                    result.setHours(result.getHours() + adjustedMin / 60, adjustedMin % 60);
	                }
	
	                //TODO: extends _classNames to Date.
	                //result._classNames = [isTimeSpan ? "TimeSpan" : "DateTime"];
	                return result;
	            };
	
	            _DateTimeHelper.___addLeadingZero = function (num) {
	                return num < 10 ? ('0' + num) : num.toString();
	            };
	
	            _DateTimeHelper.___addLeadingZeros = function (num) {
	                return num < 10 ? ('00' + num) : (num < 100 ? ('0' + num) : num.toString());
	            };
	
	            _DateTimeHelper.___padYear = function (year) {
	                return year < 10 ? ('000' + year) : (year < 100 ? ('00' + year) : (year < 1000 ? ('0' + year) : year.toString()));
	            };
	
	            _DateTimeHelper._parseDate = function (value, cultureInfo, args) {
	                var i, l, date, format, formats, custom = false;
	                for (i = 1, l = args.length; i < l; i++) {
	                    format = args[i];
	                    if (format) {
	                        custom = true;
	                        date = _DateTimeHelper._parseDateExact(value, format, cultureInfo);
	                        if (date) {
	                            return date;
	                        }
	                    }
	                }
	                if (!custom) {
	                    formats = cultureInfo._getDateTimeFormats();
	                    for (i = 0, l = formats.length; i < l; i++) {
	                        date = _DateTimeHelper._parseDateExact(value, formats[i], cultureInfo);
	                        if (date) {
	                            return date;
	                        }
	                    }
	                }
	                return keyword_null;
	            };
	
	            // 1440: 60*24  oneDayMinute
	            // 86400000: oneDayMillSeconds
	            // 25569: oaDate of 1970/1/1
	            // Date.getTime() mill seconds from 1970/1/1(UTC)
	            _DateTimeHelper.___toOADate = function (date) {
	                if (date === keyword_undefined || date === keyword_null) {
	                    return 0;
	                }
	                if (typeof date === "number") {
	                    date = new Date(date);
	                }
	
	                //return (date.getTime() / 86400000) + 25569 - date.getTimezoneOffset() / 1440;
	                // multiply 86400000 and 1440 first then do divide. it will cause some float precision error if the order is not.
	                return (date.getTime() * 1440 + 25569 * 86400000 * 1440 - date.getTimezoneOffset() * 86400000) / (86400000 * 1440);
	            };
	
	            _DateTimeHelper._fromOADate = function (oadate) {
	                var offsetDay = oadate - 25569;
	                var date = new Date(offsetDay * 86400000);
	
	                // multiply 86400000 first then do divide. it will cause some float precision error if the order is not.
	                // 2014/10/17 ben.yin here is a "+1" or "-1", is for javascript divide low precision, it will loss last digit precision.So here add 1, for loss, for result right.
	                // add 1 when after 1987, sub 1 when before 1987
	                var adjustValue = offsetDay >= 0 ? 1 : -1;
	                return new Date((oadate * 86400000 * 1440 + adjustValue - 25569 * 86400000 * 1440 + date.getTimezoneOffset() * 86400000) / 1440);
	            };
	            _DateTimeHelper.parseExact = _DateTimeHelper._parseDateExact;
	            _DateTimeHelper.fromOADate = _DateTimeHelper._fromOADate;
	            return _DateTimeHelper;
	        })();
	        spread._DateTimeHelper = _DateTimeHelper;
	
	        //</editor-fold>
	        var parsedFormat = (function () {
	            function parsedFormat(normal, negative, zero) {
	                this.normal = normal;
	                this.negative = negative;
	                this.zero = zero;
	            }
	            return parsedFormat;
	        })();
	
	        var parsedFormatPart = (function () {
	            function parsedFormatPart() {
	                var self = this;
	                self.intPart = keyword_null;
	                self.decPart = keyword_null;
	                self.group = false;
	                self.scale = 0;
	                self.percent = 0;
	                self.permile = 0;
	                self.exponent = keyword_null;
	            }
	            return parsedFormatPart;
	        })();
	
	        //<editor-fold desc="NumberHelper">
	        var _NumberHelper = (function () {
	            function _NumberHelper(num) {
	                this._num = num;
	            }
	            _NumberHelper.prototype.format = function (format) {
	                return this._toFormattedString(format, globalize.Cultures._CultureInfo.invariantCulture());
	            };
	
	            _NumberHelper.prototype.localeFormat = function (format) {
	                return this._toFormattedString(format, globalize.Cultures._CultureInfo._currentCulture);
	            };
	
	            _NumberHelper.prototype.customCultureFormat = function (format, cultureInfo) {
	                if (!cultureInfo) {
	                    cultureInfo = globalize.Cultures._CultureInfo._currentCulture;
	                }
	                return this._toFormattedString(format, cultureInfo);
	            };
	
	            _NumberHelper.prototype._toFormattedString = function (format, cultureInfo) {
	                var self = this;
	                if (!format || (format.length === 0) || (format === 'i')) {
	                    if (cultureInfo && (cultureInfo.Name().length > 0)) {
	                        return self._num.toLocaleString();
	                    } else {
	                        return self._num.toString();
	                    }
	                }
	
	                if (_NumberHelper.__getStandardTokenRegExp().test(format)) {
	                    return self._toStandardFormattedString(format, cultureInfo.NumberFormat());
	                } else {
	                    return self._toCustomFormattedString(format, cultureInfo.NumberFormat());
	                }
	            };
	
	            _NumberHelper.prototype._toStandardFormattedString = function (format, nf) {
	                var self = this;
	                var num = Math_abs(self._num).toString();
	                if (!format) {
	                    format = "D";
	                }
	                var precision = -1;
	                if (format.length > 1) {
	                    precision = parseInt(format.slice(1), 10);
	                }
	                var pattern, resultArray;
	                switch (format.charAt(0)) {
	                    case "d":
	                    case "D":
	                        pattern = 'n';
	                        if (precision !== -1) {
	                            num = _NumberHelper.___zeroPad("" + num, precision, true);
	                        }
	                        if (self._num < 0) {
	                            num = "-" + num;
	                        }
	                        break;
	                    case "c":
	                    case "C":
	                        if (self._num < 0) {
	                            pattern = _NumberHelper.___currencyNegativePattern[nf.currencyNegativePattern];
	                        } else {
	                            pattern = _NumberHelper.___currencyPositivePattern[nf.currencyPositivePattern];
	                        }
	                        if (precision === -1) {
	                            precision = nf.currencyDecimalDigits;
	                        }
	                        num = _NumberHelper.___expandNumber(Math_abs(self._num), precision, nf.currencyGroupSizes, nf.currencyGroupSeparator, nf.currencyDecimalSeparator, nf.negativeSign);
	                        break;
	                    case "n":
	                    case "N":
	                        if (self._num < 0) {
	                            pattern = _NumberHelper.___numberNegativePattern[nf.numberNegativePattern];
	                        } else {
	                            pattern = 'n';
	                        }
	                        if (precision === -1) {
	                            precision = nf.numberDecimalDigits;
	                        }
	                        num = _NumberHelper.___expandNumber(Math_abs(self._num), precision, nf.numberGroupSizes, ',', '.', nf.negativeSign);
	                        break;
	                    case "p":
	                    case "P":
	                        if (self._num < 0) {
	                            pattern = _NumberHelper.___percentNegativePattern[nf.percentNegativePattern];
	                        } else {
	                            pattern = _NumberHelper.___percentPositivePattern[nf.percentPositivePattern];
	                        }
	                        if (precision === -1) {
	                            precision = nf.percentDecimalDigits;
	                        }
	                        num = _NumberHelper.___expandNumber(Math_abs(self._num) * 100, precision, nf.percentGroupSizes, nf.percentGroupSeparator, nf.percentDecimalSeparator, nf.negativeSign);
	                        break;
	                    case "F":
	                    case "f":
	                        resultArray = self._toFixedPoint(num, pattern, format, precision, nf);
	                        num = resultArray[0];
	                        pattern = resultArray[1];
	                        break;
	                    case "e":
	                    case "E":
	                        resultArray = self._toScientificNotation(num, pattern, format, precision, nf);
	                        num = resultArray[0];
	                        pattern = resultArray[1];
	                        break;
	                    case "x":
	                    case "X":
	                        pattern = "n";
	                        num = _NumberHelper.___toHexString(self._num, format.charAt(0) === 'x', precision === -1 ? 0 : precision);
	                        break;
	                    case "g":
	                    case "G":
	                        var numToStr = self._num.toString();
	                        resultArray = [];
	                        if ((numToStr.indexOf("e")) === -1 && (numToStr.indexOf("E") === -1)) {
	                            resultArray = self._toFixedPoint(num, pattern, format, precision, nf);
	                        } else {
	                            resultArray = self._toScientificNotation(num, pattern, format.replace("g", "e").replace("G", "E"), precision, nf);
	                        }
	                        num = resultArray[0];
	                        pattern = resultArray[1];
	                        break;
	                    default:
	                        throw new Error(spread.SR.Exp_BadFormatSpecifier);
	                }
	                var regex = /n|\$|-|%/g;
	                var ret = "";
	                for (; ;) {
	                    var index = regex.lastIndex;
	                    var ar = regex.exec(pattern);
	                    ret += pattern.slice(index, ar ? ar.index : pattern.length);
	                    if (!ar) {
	                        break;
	                    }
	                    switch (ar[0]) {
	                        case "n":
	                            ret += num;
	                            break;
	                        case "$":
	                            ret += nf.currencySymbol;
	                            break;
	                        case "-":
	                            if (/[1-9]/.test(num)) {
	                                ret += nf.negativeSign;
	                            }
	                            break;
	                        case "%":
	                            ret += nf.percentSymbol;
	                            break;
	                        default:
	                            throw new Error(spread.SR.Exp_InvalidNumberFormat);
	                    }
	                }
	                return ret;
	            };
	
	            _NumberHelper.prototype._toScientificNotation = function (num, pattern, format, precision, nf) {
	                pattern = "n";
	                num = _NumberHelper.___toScientific(Math_abs(this._num), format.charAt(0), precision === -1 ? 6 : precision, nf.numberGroupSizes, ',', '.', nf.negativeSign);
	                if (this._num < 0) {
	                    num = "-" + num;
	                }
	                return [num, pattern];
	            };
	
	            _NumberHelper.prototype._toFixedPoint = function (num, pattern, format, precision, nf) {
	                if (this._num < 0) {
	                    pattern = _NumberHelper.___numberNegativePattern[nf.numberNegativePattern];
	                } else {
	                    pattern = 'n';
	                }
	                if (precision === -1) {
	                    precision = 2;
	                }
	                var numberValue = parseFloat(num);
	                var integer = Math_floor(numberValue);
	                var dec = numberValue - integer;
	                num = _NumberHelper.___expandNumber(dec, precision, nf.numberGroupSizes, ',', '.', nf.negativeSign);
	                num = "" + integer + num.substring(1);
	                return [num, pattern];
	            };
	
	            _NumberHelper.prototype._toCustomFormattedString = function (format, nf) {
	                var parsedFormat = _NumberHelper.___parseCustomNumberFormatter(format);
	
	                var formatter = keyword_null;
	                if (this._num === 0) {
	                    formatter = parsedFormat.zero;
	                } else if (this._num < 0) {
	                    formatter = parsedFormat.negative;
	                }
	                if (!formatter) {
	                    formatter = parsedFormat.normal;
	                }
	
	                // parsing format success.
	                var result = _NumberHelper.___formatNumber(this._num, formatter, nf) + "";
	
	                //Only support english culture
	                if ((result.indexOf(nf.negativeSign) === 1) && (result.indexOf(nf.currencySymbol) === 0)) {
	                    result = result[1] + result[0] + result.substring(2);
	                }
	                return result;
	            };
	
	            _NumberHelper.parseLocale = function (value) {
	                return _NumberHelper.__parseNumber(value, globalize.Cultures._CultureInfo._currentCulture);
	            };
	
	            _NumberHelper.parseInvariant = function (value) {
	                return _NumberHelper.__parseNumber(value, globalize.Cultures._CultureInfo.invariantCulture());
	            };
	
	            _NumberHelper.__getStandardTokenRegExp = function () {
	                return /^(C|c|D|d|E|e|F|f|G|g|N|n|P|p|R|r|X|x)(\d*)$/g;
	            };
	
	            //        function ___getCustomTokenRegExp() {
	            //            return /(0|#|\.|,|%|\u2030|\\|((E(\+|-)?|e(\+|-)?)\d+)|;|"|')/g;
	            //        }
	            _NumberHelper.___getDigitLength = function (value, separator) {
	                var ip = Math_floor(Math_abs(value));
	
	                var digit = { integer: 1, decimal: 0 };
	                while (ip >= 10) {
	                    ip = ip / 10;
	                    digit.integer++;
	                }
	
	                var valueStr = value.toString();
	                var exponentIndex = valueStr.search(/e/ig);
	                var pointIndex = valueStr.indexOf(separator);
	                var length;
	                if (exponentIndex !== -1) {
	                    var numPart = valueStr.substr(0, exponentIndex);
	                    var expPart = valueStr.substr(exponentIndex + 1);
	                    var decimalPartLength = 0;
	                    if (pointIndex !== -1) {
	                        decimalPartLength = numPart.substr(pointIndex + 1).length;
	                    }
	                    var expValue = parseFloat(expPart);
	                    length = decimalPartLength - expValue;
	                    if (length < 0) {
	                        length = 0;
	                    }
	                    digit.decimal = length;
	                } else {
	                    length = 0;
	                    if (pointIndex !== -1) {
	                        length = valueStr.substr(pointIndex + 1).length;
	                    }
	                    digit.decimal = length;
	                }
	                return digit;
	            };
	
	            _NumberHelper.___parseExponentFormat = function (format) {
	                var exponent = {
	                    symbol: format.charAt(0),
	                    sign: 0,
	                    exp: 0
	                };
	                var ss = '';
	                for (var si = 1; si < format.length; si++) {
	                    ss = format.charAt(si);
	                    if (ss === '+') {
	                        exponent.sign = 1;
	                    } else if (ss === '-') {
	                        exponent.sign = -1;
	                    } else if (ss === '0') {
	                        exponent.exp = format.length - si;
	                        break;
	                    } else {
	                        throw new Error(spread.SR.Exp_InvalidExponentFormat);
	                    }
	                }
	                return exponent;
	            };
	
	            _NumberHelper.___parseCustomNumberFormatter = function (format) {
	                var partNormal = keyword_null, partNegative = keyword_null, partZero = keyword_null;
	                var partCurr = new parsedFormatPart();
	                var strBuf = '', insqStr = false, indqStr = false, inESC = false, inSci = false, decPointFound = false, groupSepFound = false, sciFound = false, intPlaceHoldFound = false;
	                var curChar = keyword_null, prevChar = keyword_null, curPart = [];
	                for (var i = 0; i < format.length; i++) {
	                    curChar = format.charAt(i);
	                    if (insqStr) {
	                        if (curChar !== '\'') {
	                            strBuf += curChar;
	                        } else {
	                            curPart.push(strBuf);
	                            strBuf = '';
	                            insqStr = false;
	                        }
	                        prevChar = curChar;
	                        continue;
	                    } else if (indqStr) {
	                        if (curChar !== '"') {
	                            strBuf += curChar;
	                        } else {
	                            curPart.push(strBuf);
	                            strBuf = '';
	                            indqStr = false;
	                        }
	                        prevChar = curChar;
	                        continue;
	                    } else if (inESC) {
	                        curPart.push(strBuf + curChar);
	                        strBuf = '';
	                        prevChar = curChar;
	                        continue;
	                    } else if (inSci) {
	                        if (prevChar === 'E' || prevChar === 'e') {
	                            if (curChar === '+' || curChar === '-' || curChar === '0') {
	                                strBuf += curChar;
	                                continue;
	                            } else {
	                                inSci = false;
	                            }
	                        } else if (prevChar === '+' || prevChar === '-') {
	                            if (curChar === '0') {
	                                strBuf += curChar;
	                                continue;
	                            } else {
	                                inSci = false;
	                                curPart.push(strBuf);
	                                strBuf = '';
	                            }
	                        } else if (prevChar === '0') {
	                            if (curChar === '0') {
	                                strBuf += curChar;
	                                continue;
	                            } else {
	                                inSci = false;
	                                if (!sciFound) {
	                                    sciFound = true;
	
	                                    // parse strBuf to get current exp format
	                                    partCurr.exponent = _NumberHelper.___parseExponentFormat(strBuf);
	                                }
	                                curPart.push(strBuf);
	                                strBuf = '';
	                            }
	                        }
	                    } else if ((curChar === '0' || curChar === '#')) {
	                        intPlaceHoldFound = true;
	                        if (prevChar === '0' || prevChar === '#') {
	                            strBuf += curChar;
	                            prevChar = curChar;
	                            continue;
	                        } else if (strBuf !== '') {
	                            curPart.push(strBuf);
	                            strBuf = '';
	                        }
	                    } else if ((prevChar === '0' || prevChar === '#') && curChar !== '0' && curChar !== '#') {
	                        curPart.push(strBuf);
	                        strBuf = '';
	                    }
	
	                    if (curChar === ';') {
	                        if (strBuf !== '') {
	                            if (inSci && !sciFound) {
	                                // parse strBuf to get current exp format
	                                partCurr.exponent = _NumberHelper.___parseExponentFormat(strBuf);
	                            }
	
	                            curPart.push(strBuf);
	                            strBuf = '';
	                        }
	                        if (!decPointFound) {
	                            partCurr.intPart = curPart;
	                        } else {
	                            partCurr.decPart = curChar;
	                        }
	                        curPart = [];
	                        if (partNormal === keyword_undefined || partNormal === keyword_null) {
	                            partNormal = partCurr;
	                        } else if (partNegative === keyword_undefined || partNegative === keyword_null) {
	                            partNegative = partCurr;
	                        } else if (partZero === keyword_undefined || partZero === keyword_null) {
	                            partZero = partCurr;
	                        } else {
	                            throw new Error(spread.SR.Exp_InvalidSemicolons);
	                        }
	                        decPointFound = false;
	                        intPlaceHoldFound = false;
	                        if (groupSepFound) {
	                            partCurr.group = true;
	                            groupSepFound = false;
	                        }
	                        partCurr = new parsedFormatPart();
	                    } else if (!decPointFound && curChar === '.') {
	                        if (prevChar !== '#' && prevChar !== '0') {
	                            // if the character before dot is not number, auto add '#' before dot, for display number before dot which user input
	                            curPart.push(strBuf);
	                            strBuf = '#';
	                        }
	                        if (strBuf !== '') {
	                            curPart.push(strBuf);
	                            strBuf = '';
	                        }
	                        partCurr.intPart = curPart;
	                        curPart = [];
	                        decPointFound = true;
	                        intPlaceHoldFound = false;
	                        if (groupSepFound) {
	                            partCurr.group = true;
	                            groupSepFound = false;
	                        }
	                    } else if (curChar === '\'') {
	                        insqStr = true;
	                    } else if (curChar === '"') {
	                        indqStr = true;
	                    } else if (curChar === '%') {
	                        partCurr.percent++;
	                        curPart.push(curChar);
	                    } else if (curChar === globalize.Cultures.CR.perMilleSymbol) {
	                        partCurr.permile++;
	                        curPart.push(curChar);
	                    } else if (curChar === '0' || curChar === '#') {
	                        strBuf += curChar;
	                    } else if (curChar === ',') {
	                        if (!decPointFound) {
	                            if (strBuf !== '') {
	                                curPart.push(strBuf);
	                                strBuf = '';
	                            }
	                            if (!intPlaceHoldFound) {
	                                continue;
	                            }
	                            var isScale = true, strQuote = '';
	                            for (var j = i + 1; j < format.length; j++) {
	                                var nextChar = format.charAt(j);
	                                if (strQuote !== '') {
	                                    if (nextChar === '\'' || nextChar === '"') {
	                                        strQuote = '';
	                                    }
	                                    continue;
	                                }
	                                if (nextChar === '\'' || nextChar === '"') {
	                                    strQuote = nextChar;
	                                } else if (nextChar === '0' || nextChar === '#') {
	                                    isScale = false;
	                                    break;
	                                } else if (nextChar === '.' || nextChar === ';') {
	                                    break;
	                                }
	                            }
	                            if (isScale) {
	                                partCurr.scale++;
	                            } else {
	                                groupSepFound = true;
	                            }
	                        } else {
	                            if (strBuf !== '') {
	                                curPart.push(strBuf);
	                                strBuf = '';
	                            }
	                        }
	                    } else if (curChar === 'E' || curChar === 'e') {
	                        inSci = true;
	                        if (strBuf !== '') {
	                            curPart.push(strBuf);
	                        }
	                        strBuf = curChar;
	                    } else {
	                        strBuf += curChar;
	                    }
	
	                    prevChar = curChar;
	                }
	                if (strBuf !== '') {
	                    if (inSci && !sciFound) {
	                        // parse strBuf to get current exp format
	                        partCurr.exponent = _NumberHelper.___parseExponentFormat(strBuf);
	                    }
	
	                    curPart.push(strBuf);
	                }
	                if (groupSepFound) {
	                    partCurr.group = true;
	                }
	                if (!decPointFound) {
	                    partCurr.intPart = curPart;
	                } else {
	                    partCurr.decPart = curPart;
	                }
	                if (partNormal === keyword_undefined || partNormal === keyword_null) {
	                    partNormal = partCurr;
	                } else if (partNegative === keyword_undefined || partNegative === keyword_null) {
	                    partNegative = partCurr;
	                } else if (partZero === keyword_undefined || partZero === keyword_null) {
	                    partZero = partCurr;
	                }
	                return new parsedFormat(partNormal, partNegative, partZero);
	            };
	
	            _NumberHelper.___zeroPad = function (str, count, left) {
	                for (var l = str.length; l < count; l++) {
	                    str = (left ? ('0' + str) : (str + '0'));
	                }
	                return str;
	            };
	
	            _NumberHelper.__insertGroupSeparator = function (numberString, groupSizes, sep, negativeSign) {
	                //if (groupSizes.length <= 0 && console && console.log) {
	                //    console.log("groupSizes must be an array of at least 1");
	                //}
	                var curSize = groupSizes[0];
	                var curGroupIndex = 1;
	                var stringIndex = numberString.length - 1;
	                var stringBuilder = new _StringBuilder("");
	                var numberCount = 0;
	                var needSep = false;
	                while (stringIndex >= 0) {
	                    if (curSize < 1 || curSize > 9) {
	                        throw new Error(spread.SR.Exp_InvalidNumberGroupSize);
	                    }
	
	                    if (/\d/ig.test(numberString[stringIndex])) {
	                        if (needSep) {
	                            stringBuilder.insert(sep, 0);
	                            needSep = false;
	                        }
	                        numberCount++;
	                    } else {
	                        numberCount = 0;
	                    }
	                    stringBuilder.insert(numberString[stringIndex], 0);
	                    if (numberCount === curSize) {
	                        needSep = true;
	                        numberCount = 0;
	
	                        if (curGroupIndex < groupSizes.length) {
	                            curSize = groupSizes[curGroupIndex];
	                            curGroupIndex++;
	                        }
	                    }
	                    stringIndex--;
	                }
	                return stringBuilder.toString();
	            };
	
	            _NumberHelper.___expandNumber = function (num, precision, groupSizes, sep, decimalChar, negativeSign, noGroupSep) {
	                var factor = Math_pow(10, precision);
	                var rounded = (Math_round(num * factor) / factor);
	                if (!isFinite(rounded)) {
	                    rounded = num;
	                }
	                num = rounded;
	
	                var numberString = num.toString();
	                var right;
	                var exponent;
	
	                var split = numberString.split(/e/i);
	                numberString = split[0];
	                exponent = (split.length > 1 ? parseInt(split[1], 10) : 0);
	                split = numberString.split('.');
	                numberString = split[0];
	                right = split.length > 1 ? split[1] : "";
	
	                if (exponent > 0) {
	                    right = _NumberHelper.___zeroPad(right, exponent, false);
	                    numberString += right.slice(0, exponent);
	                    right = right.substr(exponent);
	                } else if (exponent < 0) {
	                    exponent = -exponent;
	                    if (num < 0) {
	                        numberString = negativeSign + _NumberHelper.___zeroPad(numberString.replace(negativeSign, ""), exponent + 1, true);
	                    } else {
	                        numberString = _NumberHelper.___zeroPad(numberString, exponent + 1, true);
	                    }
	                    right = numberString.slice(-exponent, numberString.length) + right;
	                    numberString = numberString.slice(0, -exponent);
	                }
	                if (precision > 0) {
	                    if (right.length > precision) {
	                        right = right.slice(0, precision);
	                    } else {
	                        right = _NumberHelper.___zeroPad(right, precision, false);
	                    }
	                    right = decimalChar + right;
	                } else {
	                    right = "";
	                }
	
	                if (noGroupSep === true) {
	                    return numberString + right;
	                } else {
	                    return _NumberHelper.__insertGroupSeparator(numberString, groupSizes, sep, negativeSign) + right;
	                }
	            };
	
	            _NumberHelper.___formatNumber = function (value, formatter, nf) {
	                var resultBuilder = new _StringBuilder('');
	                value = value * (Math_pow(100, formatter.percent));
	                value = value * (Math_pow(1000, formatter.permile));
	                value = value / (Math_pow(10, formatter.scale * 3));
	                var intPart = formatter.intPart, decPart = formatter.decPart;
	                if (!intPart && !decPart) {
	                    return '';
	                }
	                var partIntFormatter = keyword_null, partDecFormatter = keyword_null;
	                var i, ip, d, dp, exp;
	                if (intPart) {
	                    partIntFormatter = '';
	                    for (i = 0; i < intPart.length; i++) {
	                        ip = intPart[i];
	                        if (/^(0|#)+/g.test(ip)) {
	                            partIntFormatter += ip;
	                        }
	                    }
	                }
	                if (decPart) {
	                    partDecFormatter = '';
	                    for (d = 0; d < decPart.length; d++) {
	                        dp = decPart[d];
	                        if (/^(0|#)+/g.test(dp)) {
	                            partDecFormatter += dp;
	                        }
	                    }
	                }
	                if (!partIntFormatter && !partDecFormatter) {
	                    return (intPart ? intPart.join('') : '') + (decPart ? decPart.join('') : '');
	                } else {
	                    if (!partDecFormatter) {
	                        partDecFormatter = '';
	                    }
	                }
	
	                var exponentValue = 0;
	                var dl = _NumberHelper.___getDigitLength(value, '.');
	                if (formatter.exponent) {
	                    var aValue = Math_abs(value);
	                    var intLen = (!partIntFormatter) ? 1 : partIntFormatter.length;
	                    if (aValue >= 1) {
	                        if (dl.integer > intLen) {
	                            dl.integer -= intLen;
	                            dl.decimal += intLen;
	                            value = value / Math_pow(10, dl.integer);
	                            exponentValue = dl.integer;
	                        } else if (dl.integer < intLen) {
	                            exponentValue = 0;
	                        } else {
	                            exponentValue = 0;
	                        }
	                        if (formatter.exponent.sign === -1) {
	                            formatter.exponent.sign = 0;
	                        }
	                    } else if (aValue < 1 && aValue > 0) {
	                        formatter.exponent.sign = -1;
	                        dl.integer = intLen;
	                        dl.decimal -= intLen;
	                        var baseVal = Math_pow(10, intLen);
	                        while (aValue * 10 < baseVal) {
	                            aValue *= 10;
	                            exponentValue++;
	                        }
	                        value *= Math_pow(10, exponentValue);
	                    }
	                }
	
	                var zerophIndex = partDecFormatter.lastIndexOf('0');
	                var digitphIndex = partDecFormatter.lastIndexOf('#');
	                var precision = dl.decimal;
	                if (zerophIndex >= 0) {
	                    // have '0' placeholder, all digit before this '0' should be valid
	                    precision = zerophIndex + 1;
	                }
	                if (digitphIndex > zerophIndex && digitphIndex < dl.decimal) {
	                    precision = digitphIndex + 1;
	                }
	
	                if (!decPart) {
	                    precision = 0;
	                }
	                var numbers = _NumberHelper.___expandNumber(value, precision, nf.numberGroupSizes, ',', '.', nf.negativeSign, true);
	
	                if (numbers === '') {
	                    return (intPart ? intPart.join('') : '') + (decPart ? decPart.join('') : '');
	                }
	
	                var replaceExponent = false;
	                if (intPart) {
	                    var numberIntPart = numbers.split('.')[0];
	                    var neg = numberIntPart.substr(0, 1);
	                    if (neg === nf.negativeSign) {
	                        numberIntPart = numberIntPart.substr(1);
	                    }
	                    var procDigitLen = 0, procIntPart = '';
	                    var firstZerophIndex = partIntFormatter.indexOf('0');
	                    var intDigLen = (firstZerophIndex === -1) ? numberIntPart.length : (partIntFormatter.length - firstZerophIndex);
	                    for (i = intPart.length - 1; i >= 0; i--) {
	                        ip = intPart[i];
	                        if (/^(0|#)+/g.test(ip)) {
	                            procIntPart = ip + procIntPart;
	                            if (procIntPart !== partIntFormatter) {
	                                var iplen = ip.length;
	                                for (var ipi = numberIntPart.length - procDigitLen - 1; ipi >= 0 && iplen > 0; ipi--) {
	                                    var nc = numberIntPart.charAt(ipi);
	                                    resultBuilder._insert(nc);
	                                    iplen--;
	                                    procDigitLen++;
	                                }
	                                if (procDigitLen >= numberIntPart.length && procDigitLen < intDigLen && iplen > 0) {
	                                    resultBuilder._insert(new Array(iplen + 1).join('0'));
	                                    procDigitLen += iplen;
	                                }
	                            } else {
	                                var part = numberIntPart.substr(0, numberIntPart.length - procDigitLen);
	                                if (firstZerophIndex >= 0 && firstZerophIndex < partIntFormatter.length - procDigitLen - part.length) {
	                                    part = new Array(partIntFormatter.length - procDigitLen - firstZerophIndex - part.length + 1).join('0') + part;
	                                }
	                                resultBuilder._insert(part);
	                            }
	                        } else if (formatter.exponent && !replaceExponent && /^((E(\+|-)?|e(\+|-)?)\d+)/g.test(ip)) {
	                            replaceExponent = true;
	                            exp = '';
	                            exp += formatter.exponent.symbol;
	                            exp += _NumberHelper.___signs[formatter.exponent.sign];
	                            exp += _NumberHelper.___zeroPad(exponentValue.toString(), formatter.exponent.exp, true);
	                            resultBuilder._insert(exp);
	                        } else {
	                            resultBuilder._insert(ip);
	                        }
	                    }
	                    if (neg === nf.negativeSign) {
	                        resultBuilder._insert(neg);
	                    }
	                    if (formatter.group === true) {
	                        var str = _NumberHelper.__insertGroupSeparator(resultBuilder.toString(), nf.numberGroupSizes, ',', nf.negativeSign);
	                        resultBuilder = new _StringBuilder(str);
	                    }
	                }
	                if (decPart) {
	                    var numberDecPart = '';
	                    if (precision > 0) {
	                        var decSepIndex = numbers.indexOf('.');
	                        if (decSepIndex !== -1) {
	                            numberDecPart = numbers.substring(decSepIndex + 1);
	                            if (partIntFormatter === '') {
	                                resultBuilder.append(numbers.substr(0, decSepIndex));
	                            }
	                            resultBuilder.append('.');
	                        }
	                    } else if (!/^(#+)$/ig.test(partDecFormatter) || decPart.join('').length !== partDecFormatter.length) {
	                        resultBuilder.append('.');
	                        if (zerophIndex > 0) {
	                            numberDecPart = new Array(zerophIndex + 1).join('0');
	                        }
	                    }
	
	                    // decimal part.
	                    var numDecIndex = 0;
	                    for (d = 0; d < decPart.length; d++) {
	                        dp = decPart[d];
	                        if (/^(0|#)+/g.test(dp)) {
	                            resultBuilder.append(numberDecPart.substr(numDecIndex, dp.length));
	                            numDecIndex += dp.length;
	                        } else if (formatter.exponent && !replaceExponent && /^((E(\+|-)?|e(\+|-)?)\d+)/g.test(dp)) {
	                            replaceExponent = true;
	                            exp = '';
	                            exp += formatter.exponent.symbol;
	                            exp += _NumberHelper.___signs[formatter.exponent.sign];
	                            exp += _NumberHelper.___zeroPad(exponentValue.toString(), formatter.exponent.exp, true);
	                            resultBuilder.append(exp);
	                        } else {
	                            resultBuilder.append(dp);
	                        }
	                    }
	                }
	                var resultString = resultBuilder.toString();
	
	                //process auto add '#' for alone '.', if exist substring '0.' and not a float number,then remove '0'
	                var zeroDotIndex = resultString.indexOf("0.");
	                if (zeroDotIndex >= 0) {
	                    if (zeroDotIndex + 2 == resultString.length) {
	                        // if endwith '0.', remove it, result is '.'
	                        resultString = resultString.replace("0.", ".");
	                    } else if (zeroDotIndex + 2 < resultString.length) {
	                        // if it is '0.abc' or sth, remove '0', result is '.abc'
	                        if (!/[0-9]+/g.test(resultString.charAt(zeroDotIndex + 2))) {
	                            resultString = resultString.replace("0.", ".");
	                        }
	                    }
	                }
	
	                return resultString;
	            };
	
	            _NumberHelper.__parseNumberNegativePattern = function (value, numFormat, numberNegativePattern) {
	                var neg = numFormat.negativeSign;
	                var pos = numFormat.positiveSign;
	                var valueStr = new _StringHelper(value);
	                if (numberNegativePattern === 4 || numberNegativePattern === 2) {
	                    neg = ' ' + neg;
	                    pos = ' ' + pos;
	                }
	                if (numberNegativePattern === 4 || numberNegativePattern === 3) {
	                    if (valueStr.endsWith(neg)) {
	                        return ['-', value.substr(0, value.length - neg.length)];
	                    } else if (valueStr.endsWith(pos)) {
	                        return ['+', value.substr(0, value.length - pos.length)];
	                    }
	                } else if (numberNegativePattern === 2 || numberNegativePattern === 1) {
	                    if (valueStr.startsWith(neg)) {
	                        return ['-', value.substr(neg.length)];
	                    } else if (valueStr.startsWith(pos)) {
	                        return ['+', value.substr(pos.length)];
	                    }
	                } else if (numberNegativePattern === 0) {
	                    if (valueStr.startsWith('(') && valueStr.endsWith(')')) {
	                        return ['-', value.substr(1, value.length - 2)];
	                    }
	                } else {
	                    throw new Error("");
	                }
	                return ['', value];
	            };
	
	            _NumberHelper.__parseNumber = function (value, cultureInfo) {
	                value = (value !== keyword_undefined && value !== keyword_null) ? new _StringHelper(value).trim() : "";
	
	                if (value.match(/^[+-]?infinity$/i)) {
	                    return parseFloat(value);
	                }
	                if (value.match(/^0x[a-f0-9]+$/i)) {
	                    return parseInt(value, 10);
	                }
	                var numFormat = cultureInfo.numberFormat;
	                var signInfo = _NumberHelper.__parseNumberNegativePattern(value, numFormat, numFormat.numberNegativePattern);
	                var sign = signInfo[0];
	                var num = signInfo[1];
	
	                if ((sign === '') && (numFormat.numberNegativePattern !== 1)) {
	                    signInfo = _NumberHelper.__parseNumberNegativePattern(value, numFormat, 1);
	                    sign = signInfo[0];
	                    num = signInfo[1];
	                }
	                if (sign === '') {
	                    sign = '+';
	                }
	
	                //trim currencySymbol
	                if (num[0] === numFormat.currencySymbol) {
	                    num = num.substr(1);
	                }
	
	                var exponent;
	                var intAndFraction;
	                var exponentPos = num.indexOf('e');
	                if (exponentPos < 0) {
	                    exponentPos = num.indexOf('E');
	                }
	                if (exponentPos < 0) {
	                    intAndFraction = num;
	                    exponent = keyword_null;
	                } else {
	                    intAndFraction = num.substr(0, exponentPos);
	                    exponent = num.substr(exponentPos + 1);
	                }
	
	                var integer, fraction;
	                var decimalPos = intAndFraction.indexOf('.');
	                if (decimalPos < 0) {
	                    integer = intAndFraction;
	                    fraction = keyword_null;
	                } else {
	                    integer = intAndFraction.substr(0, decimalPos);
	                    fraction = intAndFraction.substr(decimalPos + '.'.length);
	                }
	
	                integer = integer.split(',').join('');
	                var altNumGroupSeparator = ','.replace(/\u00A0/g, " ");
	                if (',' !== altNumGroupSeparator) {
	                    integer = integer.split(altNumGroupSeparator).join('');
	                }
	
	                var p = sign + integer;
	                if (fraction !== keyword_null) {
	                    p += '.' + fraction;
	                }
	
	                //trim percentSymbol,then correct
	                var lastChar = p[p.length - 1];
	                if (lastChar === numFormat.percentSymbol) {
	                    p = p.substr(0, p.length - 1);
	                    p = new _StringHelper(p).trimEnd();
	                    var ndp = p.indexOf('.');
	                    if (ndp === -1) {
	                        ndp = p.length;
	                    }
	                    var resultBuilder = new _StringBuilder('');
	                    resultBuilder.append(p.substr(0, ndp - 2));
	                    resultBuilder.append('.');
	                    resultBuilder.append(p.substr(ndp - 2, 2));
	                    resultBuilder.append(p.substr(ndp + 1));
	                    p = resultBuilder.toString();
	                }
	
	                if (exponent !== keyword_null) {
	                    var expSignInfo = _NumberHelper.__parseNumberNegativePattern(exponent, numFormat, 1);
	                    if (expSignInfo[0] === '') {
	                        expSignInfo[0] = '+';
	                    }
	                    p += 'e' + expSignInfo[0] + expSignInfo[1];
	                }
	                if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
	                    return parseFloat(p);
	                }
	                return NaN;
	            };
	
	            _NumberHelper.___toHexString = function (num, lowCase, precision) {
	                if (Math_abs(Math_floor(num) - num) !== 0) {
	                    throw new Error(spread.SR.Exp_BadFormatSpecifier);
	                }
	                var number = num >= 0 ? num.toString(16) : (_NumberHelper.___maxInt32 + num + 1).toString(16);
	                number = lowCase ? number.toLowerCase() : number.toUpperCase();
	                if (precision !== keyword_undefined && precision !== keyword_null && number.length < precision) {
	                    return _NumberHelper.___zeroPad(number, precision, true);
	                }
	                return number;
	            };
	
	            _NumberHelper.___toScientific = function (num, e, precision, groupSizes, sep, decimalChar, negativeSign) {
	                var digitLen = 0;
	                var digSepMoveRight = (num >= 1 || num === 0);
	                while (digitLen < 1000) {
	                    var base = Math_pow(10, digitLen);
	
	                    // checkFn
	                    if (digSepMoveRight && (num / base < 10) || !digSepMoveRight && (num * base >= 1))
	                        break;
	                    digitLen++;
	                }
	                num = digSepMoveRight ? Math_abs(num) / Math_pow(10, digitLen) : Math_abs(num) * Math_pow(10, digitLen);
	                var number = _NumberHelper.___expandNumber(num, precision, groupSizes, sep, decimalChar, negativeSign);
	                number += e + (digSepMoveRight ? "+" : "-") + _NumberHelper.___zeroPad(digitLen.toString(), 3, true);
	                return number;
	            };
	
	            _NumberHelper.removeCultureSymbolInNum = function (obj) {
	                if (obj === keyword_undefined || obj === keyword_null) {
	                    return obj;
	                }
	                var numberString = obj.toString();
	                numberString = numberString.replace(new RegExp('[,]', "g"), "");
	                return numberString.replace(new RegExp('[.]', "g"), ".");
	            };
	
	            _NumberHelper.replaceCultureSymbolToNormal = function (value) {
	                if (typeof value !== 'string') {
	                    return value;
	                }
	                if (globalize.Cultures.CR.numberDecimalSeparator !== '.') {
	                    value = value.replace(RegUtil.getReg('[' + globalize.Cultures.CR.numberDecimalSeparator + ']'), '#dot#');
	                }
	                if (globalize.Cultures.CR.numberGroupSeparator !== ',') {
	                    value = value.replace(RegUtil.getReg('[' + globalize.Cultures.CR.numberGroupSeparator + ']'), '#group#');
	                }
	                if (globalize.Cultures.CR.numberDecimalSeparator !== '.') {
	                    value = value.replace(RegUtil.getReg('#dot#'), '.');
	                }
	                if (globalize.Cultures.CR.numberGroupSeparator !== ',') {
	                    value = value.replace(RegUtil.getReg('#group#'), ',');
	                }
	                return value;
	            };
	
	            _NumberHelper.replaceNormalToCultureSymble = function (value) {
	                if (typeof value !== 'string') {
	                    return value;
	                }
	                if (globalize.Cultures.CR.numberDecimalSeparator !== '.') {
	                    value = value.replace(RegUtil.getReg('[.]'), '#dot#');
	                }
	                if (globalize.Cultures.CR.numberGroupSeparator !== ',') {
	                    value = value.replace(RegUtil.getReg('[,]'), '#group#');
	                }
	
	                if (globalize.Cultures.CR.numberDecimalSeparator !== '.') {
	                    value = value.replace(RegUtil.getReg('#dot#'), globalize.Cultures.CR.numberDecimalSeparator);
	                }
	                if (globalize.Cultures.CR.numberGroupSeparator !== ',') {
	                    value = value.replace(RegUtil.getReg('#group#'), globalize.Cultures.CR.numberGroupSeparator);
	                }
	                return value;
	            };
	            _NumberHelper.___signs = {
	                '1': '+',
	                '0': '',
	                '-1': '-'
	            };
	
	            _NumberHelper.___maxInt32 = 4294967295;
	            _NumberHelper.___percentPositivePattern = ["n %", "n%", "%n", "% n"];
	            _NumberHelper.___percentNegativePattern = ["-n %", "-n%", "-%n", "%-n", "%n-", "n-%", "n%-", "-% n", "n %-", "% n-", "% -n", "n- %"];
	            _NumberHelper.___numberNegativePattern = ["(n)", "-n", "- n", "n-", "n -"];
	            _NumberHelper.___currencyPositivePattern = ["$n", "n$", "$ n", "n $"];
	            _NumberHelper.___currencyNegativePattern = [
	                "($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n",
	                "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
	            return _NumberHelper;
	        })();
	        spread._NumberHelper = _NumberHelper;
	
	        var _WordWrapHelper = (function () {
	            function _WordWrapHelper() {
	            }
	            _WordWrapHelper._getCtx = function () {
	                if (!_WordWrapHelper._ctx) {
	                    var canvas = document.createElement("canvas");
	                    if (canvas.getContext) {
	                        _WordWrapHelper._ctx = canvas.getContext("2d");
	                    }
	                }
	                return _WordWrapHelper._ctx;
	            };
	
	            _WordWrapHelper._getWrapInfo = function (text, width, font) {
	                var wrapLines = [];
	                if (text.length === 0) {
	                    return wrapLines;
	                }
	                var ctx = _WordWrapHelper._getCtx();
	                if (!ctx) {
	                    return wrapLines;
	                }
	                ctx.font = font;
	                if (width <= 0) {
	                    var charMinWidth = -1;
	                    var flag = true;
	                    for (var index = 0; index < text.length; index++) {
	                        var tempChar = text.charAt(index);
	                        if (tempChar !== " " && !flag) {
	                            charMinWidth = Math_min(charMinWidth, ctx.measureText(tempChar).width);
	                        } else if (tempChar !== " " && flag) {
	                            charMinWidth = ctx.measureText(tempChar).width;
	                            flag = false;
	                        }
	                    }
	                    width = charMinWidth;
	                }
	                var lines = text.split(/\r\n|\r|\n/);
	                for (var i = 0; i < lines.length; i++) {
	                    var wrapLine = _WordWrapHelper._getWrapInfoByWord(lines[i], width);
	                    if (wrapLine != keyword_null) {
	                        for (var j = 0; j < wrapLine.length; j++) {
	                            wrapLines.push(wrapLine[j]);
	                        }
	                    }
	                }
	                return wrapLines;
	            };
	
	            _WordWrapHelper._getTextWords = function (text) {
	                var lines = [];
	                var startIndex = 0;
	                var space = " ";
	
	                for (var i = 0; i < text.length; i++) {
	                    if (lines[startIndex] === keyword_undefined) {
	                        lines[startIndex] = "";
	                    }
	                    var currentChar = text.charAt(i);
	                    var nextChar = "";
	                    if (i + 1 < text.length) {
	                        nextChar = text.charAt(i + 1);
	                    }
	                    if ((currentChar === space && nextChar !== space)) {
	                        lines[startIndex] += currentChar;
	                        startIndex++;
	                    } else {
	                        lines[startIndex] += currentChar;
	                    }
	                }
	                return lines;
	            };
	
	            _WordWrapHelper._measureText = function (text, font) {
	                var ctx = _WordWrapHelper._getCtx();
	                if (!ctx) {
	                    return 0;
	                }
	
	                if (ctx.font !== font) {
	                    ctx.font = font;
	                }
	                return ctx.measureText(text).width;
	            };
	
	            _WordWrapHelper._measureTextWithoutEndSpaces = function (text, font) {
	                var ctx = _WordWrapHelper._getCtx();
	                if (!ctx) {
	                    return 0;
	                }
	                if (font) {
	                    ctx.font = font;
	                }
	                var tempText = _WordWrapHelper._removeEndSpace(text);
	                return ctx.measureText(tempText).width;
	            };
	
	            _WordWrapHelper._removeEndSpace = function (text) {
	                var index = text.length - 1;
	                while (text.charAt(index) === ' ') {
	                    index--;
	                }
	                if (index !== text.length - 1) {
	                    text = text.substring(0, index + 1);
	                }
	                return text;
	            };
	
	            _WordWrapHelper._getWrapInfoByCharacter = function (text, width) {
	                var lines = [];
	                var ctx = _WordWrapHelper._getCtx();
	                if (!ctx) {
	                    return lines;
	                }
	                var totalWidth = ctx.measureText(text).width;
	                var charWidth = totalWidth / text.length;
	                var targetLength = Math_ceil(width / charWidth);
	                if (totalWidth > width) {
	                    var isLong = false;
	                    while (true) {
	                        var subText = text.substring(0, targetLength);
	                        var subWidth = ctx.measureText(subText).width;
	
	                        if (subWidth == width || isLong && subWidth < width) {
	                            lines.push(subText);
	                            lines.push(text.substring(subText.length));
	                            return lines;
	                        } else if (subWidth > width) {
	                            if (subText.length === 1) {
	                                var remainText = text.substring(subText.length);
	                                if (_WordWrapHelper._measureTextWithoutEndSpaces(remainText) !== 0) {
	                                    lines.push(subText);
	                                    lines.push(remainText);
	                                } else {
	                                    lines.push(text);
	                                }
	                                return lines;
	                            }
	                            targetLength -= 1;
	                            isLong = true;
	                        } else {
	                            var step = (width - subWidth) / charWidth;
	                            step = step >= 1 ? step : 1;
	                            targetLength += step;
	                        }
	                    }
	                } else {
	                    if (text != keyword_null && text.length > 0) {
	                        lines.push(text);
	                    }
	                }
	                return lines;
	            };
	
	            _WordWrapHelper._getWrapInfoByWord = function (text, width) {
	                var lines = [];
	                var words = _WordWrapHelper._getTextWords(text);
	                var ctx = _WordWrapHelper._getCtx();
	                if (!ctx) {
	                    return lines;
	                }
	                var totalWidth = ctx.measureText(text).width;
	                var charWidth = totalWidth / text.length;
	                var averageLength = parseInt((width / charWidth) + "", 10);
	
	                var lineIndex = 0, stackCharCount = 0, tempCount = 0, index = 0;
	                var stack = [];
	                var isLong = false;
	                while (index < words.length) {
	                    if (isLong === false) {
	                        var word = words[index];
	                        stack.push(word);
	                        stackCharCount += word.length;
	                        if (stackCharCount < averageLength) {
	                            index++;
	                            continue;
	                        } else {
	                            tempCount = stackCharCount;
	                            stackCharCount = 0;
	                        }
	                    }
	                    var subWidth = _WordWrapHelper._measureTextWithoutEndSpaces(stack.join(""));
	                    if (subWidth > width) {
	                        var tempWord = stack.pop();
	                        if (stack.length === 0) {
	                            var parts = _WordWrapHelper._getWrapInfoByCharacter(tempWord, width);
	                            stack.push(parts[0]);
	                            if (parts.length === 2) {
	                                words[index] = parts[1];
	                            } else {
	                                index++; // if the word matches /[^\s][\s]*/, go to next word.
	                            }
	                            lines[lineIndex++] = stack.join("");
	                            isLong = false;
	                            stack = [];
	                        } else {
	                            isLong = true; // stack contains more than one word.
	                            index--;
	                        }
	                    } else if ((subWidth < width && isLong === true) || subWidth === width) {
	                        isLong = false;
	                        lines[lineIndex++] = _WordWrapHelper._removeEndSpace(stack.join(""));
	                        stack = [];
	                        index++;
	                    } else if (subWidth < width) {
	                        index++;
	                        stackCharCount = tempCount;
	                    }
	                }
	                if (stack.length !== 0) {
	                    lines[lineIndex] = _WordWrapHelper._removeEndSpace(stack.join(""));
	                }
	                return lines;
	            };
	            return _WordWrapHelper;
	        })();
	        spread._WordWrapHelper = _WordWrapHelper;
	
	        //<editor-fold desc="FormatConverter">
	        /**
	         * Represents the converting of a value to a specified data type.
	         * @class
	         */
	        var FormatConverter = (function () {
	            function FormatConverter() {
	            }
	            /**
	             * Determines whether the specified value is a number, DateTime, or TimeSpan value.
	             * @param {Object} value The value for which to determine the number type.
	             * @returns {boolean} <c>true</c> if the value is a number; otherwise, <c>false</c>.
	             */
	            FormatConverter.IsNumber = function (value) {
	                return util.isType(value, "number") || util.isType(value, "DateTime") || util.isType(value, "TimeSpan") || (value && !util.isType(value, "boolean") && !isNaN(value));
	            };
	
	            /**
	             * Converts the value to a double type.
	             * @param {Object} value The value to convert to the number type.
	             * @returns {number} The converted number.
	             */
	            FormatConverter.ToDouble = function (value) {
	                if (value === keyword_null || value === keyword_undefined || value === "") {
	                    return 0.0;
	                } else if (util.isType(value, "number")) {
	                    return value;
	                } else if (util.isType(value, "string") && !isNaN(value)) {
	                    return _NumberHelper.parseLocale(value);
	                } else if (util.isType(value, "boolean")) {
	                    return value ? 1.0 : 0.0;
	                } else if (util.isType(value, "DateTime")) {
	                    return new _DateTimeHelper(value).toOADate();
	                } else if (util.isType(value, "TimeSpan")) {
	                    return new _DateTimeHelper(value).TotalDays();
	                } else {
	                    return parseFloat(value);
	                }
	            };
	
	            /**
	             * Converts the specified value to a string representation.
	             * @param {Object} value The value to convert to string type.
	             * @returns {number} The converted string.
	             */
	            FormatConverter.toString = function (value) {
	                try  {
	                    if (value === keyword_null || value === keyword_undefined)
	                        return "";
	                    else if (typeof value === "boolean")
	                        return value ? "TRUE" : "FALSE";
	                    else if (typeof value === "string")
	                        return value;
	                    else
	                        return value.toString();
	                } catch (err) {
	                    return "";
	                }
	            };
	            return FormatConverter;
	        })();
	        spread.FormatConverter = FormatConverter;
	    })();


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzODA4N2I5ZjI0YjMzYTRkZTUzYSIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL251bWJlckZvcm1hdHRlci9mb3JtYXR0ZXIuZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9udW1iZXJGb3JtYXR0ZXIvZm9ybWF0dGVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJyb290XCI6W1wiR2NTcHJlYWRcIixcIlZpZXdzXCIsXCJHY0dyaWRcIixcIlBsdWdpbnNcIixcIkdsb2JhbGl6ZVwiXSxcImFtZFwiOlwiR2xvYmFsaXplXCJ9Iiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvbnVtYmVyRm9ybWF0dGVyL2Zvcm1hdHRlclV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsNkRBQTZELGlGQUFpRix1R0FBdUc7QUFDaFMsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDbENEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNEIsNkJBQTZCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBMkIsc0JBQXNCO0FBQ2pELHlDQUF3QyxrQkFBa0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUssNERBQTREOztBQUVqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUssb0RBQW9EO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLLGdFQUFnRTtBQUNyRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSyw0QkFBNEI7O0FBRWpDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixjQUFjO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLFNBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQix5QkFBeUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUM7QUFDekM7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLG1DQUFtQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLG1DQUFtQztBQUN0RCxzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQix1QkFBdUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSxrQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCLG9CQUFtQiw2QkFBNkI7QUFDaEQsb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEZBQTJGLEVBQUUsU0FBUyxPQUFPLEVBQUU7QUFDL0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRGQUEyRixFQUFFLE1BQU0sT0FBTyxFQUFFO0FBQzVHO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQixRQUFRLGdFQUFnRTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFxQixRQUFRLHdEQUF3RDtBQUNyRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUErQyxnQ0FBZ0M7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUM7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMsZ0NBQWdDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF1QyxnQ0FBZ0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLDZCQUE2QjtBQUNoRCxzQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFxQixPQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUEyQyxnQ0FBZ0M7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBaUM7QUFDakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCLHNCQUFxQixtQ0FBbUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCLHNCQUFxQixPQUFPO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixvQkFBbUIsT0FBTztBQUMxQixzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTRCO0FBQzVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsb0JBQW1CLE9BQU87QUFDMUIsc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixzQkFBcUIsT0FBTztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW1DLHNCQUFzQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUMscUNBQXFDO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBLDRCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUEyQixvQkFBb0I7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdDQUErQixrQkFBa0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBK0Isb0JBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEwRjtBQUMxRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUEyQixxQkFBcUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsZUFBZTtBQUMxQztBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBcUQsUUFBUTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQSxzQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QixVQUFVO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFxQyxnQ0FBZ0M7QUFDckU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEwQjs7QUFFMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBLDhDQUE2QyxFQUFFLEVBQUUsRUFBRTtBQUNuRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQXlDLGdDQUFnQztBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdIQUErRztBQUMvRyxnSEFBK0c7QUFDL0c7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBcUU7QUFDckUsc0VBQXFFO0FBQ3JFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCLDZCQUE2QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXVDLHFCQUFxQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTJELDRCQUE0QjtBQUN2RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXVDLDBCQUEwQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBK0IsK0JBQStCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnTEFBK0s7QUFDL0s7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0Esb0NBQW1DO0FBQ25DLHNDQUFxQztBQUNyQyx3Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNEM7QUFDNUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXVDLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBK0IsMEJBQTBCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNkJBQTRCLHFCQUFxQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQTZDLFNBQVM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQiwrQkFBK0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixvQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixvQkFBbUIsT0FBTztBQUMxQixzQkFBcUIsT0FBTztBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsc0JBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUM3N0lELGdEOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQStCLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBK0Isa0JBQWtCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQyxrQkFBa0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUVBQW9FO0FBQ3BFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EseURBQXdELGlFQUFpRTtBQUN6SDtBQUNBO0FBQ0EsOERBQTZELDJFQUEyRTtBQUN4STtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQiwrQkFBK0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixrQkFBa0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVMsMERBQTBEO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXNCLE1BQU07QUFDNUIseUJBQXdCLFFBQVE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJCQUEwQixTQUFTO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0RBQWlELEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRTtBQUM3RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkRBQTBEO0FBQzFEO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCOztBQUVqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMsZ0NBQWdDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMsZ0NBQWdDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF1QyxnQ0FBZ0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBK0I7QUFDL0I7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5RkFBd0Y7QUFDeEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMsa0JBQWtCO0FBQ3pEO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixFQUFFO0FBQ2pDLGlEQUFnRDtBQUNoRCxrREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQStDO0FBQy9DLHFDQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixpQkFBaUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkMseUNBQXdDLEVBQUU7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXFELFFBQVE7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBeUUsRUFBRTtBQUMzRTtBQUNBLG9DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTRDLEVBQUU7QUFDOUM7QUFDQTtBQUNBLDZDQUE0QyxFQUFFO0FBQzlDO0FBQ0E7QUFDQSw2Q0FBNEMsRUFBRTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBeUQsRUFBRTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUM7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTRDLE9BQU87QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFtRCxPQUFPO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFzQixFQUFFO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1GQUFrRjtBQUNsRjtBQUNBO0FBQ0E7O0FBRUEsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxvQkFBb0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7O0FBRUEsdUNBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBK0MsbUJBQW1CO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0Esa0NBQWlDLDZDQUE2QztBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBK0Isb0JBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBK0Isb0JBQW9CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF1Rix1QkFBdUI7QUFDOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQStCLG9CQUFvQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBdUMscUJBQXFCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUErQixrQkFBa0I7QUFDakQ7QUFDQTtBQUNBLHdDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDQUErQixpQkFBaUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0IseUNBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCLDJDQUEwQztBQUMxQztBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCLE9BQU87QUFDOUIsMEJBQXlCLFFBQVEsc0NBQXNDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBdUIsT0FBTztBQUM5QiwwQkFBeUIsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF1QixPQUFPO0FBQzlCLDBCQUF5QixPQUFPO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxNQUFLIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKHVuZGVmaW5lZCkpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiR2xvYmFsaXplXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkZvcm1hdHRlclwiXSA9IGZhY3RvcnkocmVxdWlyZSh1bmRlZmluZWQpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJHY1NwcmVhZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl1bXCJGb3JtYXR0ZXJcIl0gPSBmYWN0b3J5KHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXVtcIkdsb2JhbGl6ZVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDM4MDg3YjlmMjRiMzNhNGRlNTNhXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBmb3JtYXR0ZXIgPSByZXF1aXJlKCcuL2Zvcm1hdHRlcicpO1xuICAgIHZhciBHZW5lcmFsRm9ybWF0dGVyID0gZm9ybWF0dGVyLkdlbmVyYWxGb3JtYXR0ZXI7XG4gICAgZnVuY3Rpb24gRXhjZWxGb3JtYXR0ZXIoZm9ybWF0LCBmb3JtYXRNb2RlLCBjdWx0dXJlTmFtZSl7XG4gICAgICAgIHRoaXMuX2dGb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihmb3JtYXQsIGZvcm1hdE1vZGUsIGN1bHR1cmVOYW1lKTtcbiAgICB9O1xuICAgIEV4Y2VsRm9ybWF0dGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZm9ybWF0OiBmdW5jdGlvbihvYmosIGNvbmRpdGlvbmFsRm9yZUNvbG9yKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nRm9ybWF0dGVyLkZvcm1hdChvYmosIGNvbmRpdGlvbmFsRm9yZUNvbG9yKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRNb2RlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ0Zvcm1hdHRlci5Gb3JtYXRNb2RlKHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXRTdHJpbmcgOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ0Zvcm1hdHRlci5mb3JtYXRTdHJpbmcodmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhdGVUaW1lRm9ybWF0SW5mbzogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dGb3JtYXR0ZXIuRGF0ZVRpbWVGb3JtYXRJbmZvKHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBudW1iZXJGb3JtYXRJbmZvOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ0Zvcm1hdHRlci5OdW1iZXJGb3JtYXRJbmZvKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgRXhjZWxGb3JtYXR0ZXI6IEV4Y2VsRm9ybWF0dGVyLFxuICAgICAgICBGb3JtYXRNb2RlOiBmb3JtYXR0ZXIuRm9ybWF0TW9kZVxuICAgIH07XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvbnVtYmVyRm9ybWF0dGVyL2Zvcm1hdHRlci5lbnRyeS5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4qXG4qIFNwcmVhZEpTIExpYnJhcnkgMS4wLjBcbiogaHR0cDovL3dpam1vLmNvbS9cbipcbiogQ29weXJpZ2h0KGMpIEdyYXBlQ2l0eSwgSW5jLiAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIFdpam1vIENvbW1lcmNpYWwgTGljZW5zZS4gQWxzbyBhdmFpbGFibGUgdW5kZXIgdGhlIEdOVSBHUEwgVmVyc2lvbiAzIGxpY2Vuc2UuXG4qIGxpY2Vuc2luZ0B3aWptby5jb21cbiogaHR0cDovL3dpam1vLmNvbS93aWRnZXRzL2xpY2Vuc2UvXG4qXG4qXG4qKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBtaWdyYXRlIGZyb20gc3ByZWFkanMgZm9ybWF0dGVyLCB0b28gbWFueSB3YXJuaW5ncywgaW4gb3JkZXIgdG8ga2VlcCBsZXNzIGRpZmZlcmVuY2Ugd2l0aCBzcHJlYWQgc28gZmlyc3QgaWdub3JlIGpzaGludFxuICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZm9ybWF0dGVyVXRpbHMgPSByZXF1aXJlKCcuL2Zvcm1hdHRlclV0aWxzJyk7XG4gICAgdmFyIGdsb2JhbGl6ZSA9IHJlcXVpcmUoJ0dsb2JhbGl6ZScpO1xuICAgIHZhciBmb3JtYXR0ZXIgPSB7fTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdHRlcjtcblxuICAgIHZhciBfX2V4dGVuZHMgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgICAgICAgICBmdW5jdGlvbiBfXygpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XG4gICAgICAgICAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xuICAgICAgICB9O1xuXG4gICAgdmFyIGtleXdvcmRfbnVsbCA9IG51bGwsIGtleXdvcmRfdW5kZWZpbmVkID0gdW5kZWZpbmVkLCBNYXRoX2FicyA9IE1hdGguYWJzLCBNYXRoX2NlaWwgPSBNYXRoLmNlaWwsIE1hdGhfcG93ID0gTWF0aC5wb3csIE1hdGhfZmxvb3IgPSBNYXRoLmZsb29yLCBNYXRoX21heCA9IE1hdGgubWF4LCBNYXRoX21pbiA9IE1hdGgubWluLCBNYXRoX3JvdW5kID0gTWF0aC5yb3VuZDtcblxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJGb3IgLk5FVFwiPlxuICAgIHZhciBzdHJpbmdFeCA9IHtcbiAgICAgICAgRW1wdHk6IFwiXCIsXG4gICAgICAgIEZvcm1hdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCAoYXJndW1lbnRzLmxlbmd0aCAtIDApOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2kgKyAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0ciA9IGFyZ3NbMF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoJ1xcXFx7JyArIChpIC0gMSkgKyAnXFxcXH0nLCAnZ20nKTtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH0sXG4gICAgICAgIElzTnVsbE9yRW1wdHk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiAhb2JqIHx8IG9iaiA9PT0gc3RyaW5nRXguRW1wdHk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIERhdGVUaW1lU3R5bGVzO1xuICAgIChmdW5jdGlvbiAoRGF0ZVRpbWVTdHlsZXMpIHtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJOb25lXCJdID0gMF0gPSBcIk5vbmVcIjtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJBbGxvd0xlYWRpbmdXaGl0ZVwiXSA9IDFdID0gXCJBbGxvd0xlYWRpbmdXaGl0ZVwiO1xuICAgICAgICBEYXRlVGltZVN0eWxlc1tEYXRlVGltZVN0eWxlc1tcIkFsbG93VHJhaWxpbmdXaGl0ZVwiXSA9IDJdID0gXCJBbGxvd1RyYWlsaW5nV2hpdGVcIjtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJBbGxvd0lubmVyV2hpdGVcIl0gPSA0XSA9IFwiQWxsb3dJbm5lcldoaXRlXCI7XG4gICAgICAgIERhdGVUaW1lU3R5bGVzW0RhdGVUaW1lU3R5bGVzW1wiQWxsb3dXaGl0ZVNwYWNlc1wiXSA9IDddID0gXCJBbGxvd1doaXRlU3BhY2VzXCI7XG4gICAgICAgIERhdGVUaW1lU3R5bGVzW0RhdGVUaW1lU3R5bGVzW1wiTm9DdXJyZW50RGF0ZURlZmF1bHRcIl0gPSA4XSA9IFwiTm9DdXJyZW50RGF0ZURlZmF1bHRcIjtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJBZGp1c3RUb1VuaXZlcnNhbFwiXSA9IDE2XSA9IFwiQWRqdXN0VG9Vbml2ZXJzYWxcIjtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJBc3N1bWVMb2NhbFwiXSA9IDMyXSA9IFwiQXNzdW1lTG9jYWxcIjtcbiAgICAgICAgRGF0ZVRpbWVTdHlsZXNbRGF0ZVRpbWVTdHlsZXNbXCJBc3N1bWVVbml2ZXJzYWxcIl0gPSA2NF0gPSBcIkFzc3VtZVVuaXZlcnNhbFwiO1xuICAgICAgICBEYXRlVGltZVN0eWxlc1tEYXRlVGltZVN0eWxlc1tcIlJvdW5kdHJpcEtpbmRcIl0gPSAxMjhdID0gXCJSb3VuZHRyaXBLaW5kXCI7XG4gICAgfSkoZm9ybWF0dGVyLkRhdGVUaW1lU3R5bGVzIHx8IChmb3JtYXR0ZXIuRGF0ZVRpbWVTdHlsZXMgPSB7fSkpO1xuXG4gICAgdmFyIGNoYXIgPSB7XG4gICAgICAgIElzRGlnaXQ6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICByZXR1cm4gY2MgPj0gMHgzMCAmJiBjYyA8PSAweDM5O1xuICAgICAgICB9LFxuICAgICAgICBJc1doaXRlU3BhY2U6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICByZXR1cm4gKGNjID49IDB4MDAwOSAmJiBjYyA8PSAweDAwMEQpIHx8IChjYyA9PT0gMHgwMDIwKSB8fCAoY2MgPT09IDB4MDA4NSkgfHwgKGNjID09PSAweDAwQTApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vPC9lZGl0b3ItZm9sZGVyPlxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJFbnVtXCI+XG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyB0aGUgZm9ybWF0IG1vZGUuXG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKi9cbiAgICAoZnVuY3Rpb24gKEZvcm1hdE1vZGUpIHtcbiAgICAgICAgLyoqIEluZGljYXRlcyB3aGV0aGVyIHRvIGZvcm1hdCB0aGUgdmFsdWUgd2l0aCB0aGUgRXhjZWwtY29tcGF0aWJsZSBmb3JtYXQgc3RyaW5nLiovXG4gICAgICAgIEZvcm1hdE1vZGVbRm9ybWF0TW9kZVtcIkN1c3RvbU1vZGVcIl0gPSAwXSA9IFwiQ3VzdG9tTW9kZVwiO1xuXG4gICAgICAgIC8qKiBJbmRpY2F0ZXMgd2hldGhlciB0byBmb3JtYXQgdGhlIHZhbHVlIHdpdGggdGhlIHN0YW5kYXJkIGRhdGUtdGltZSBmb3JtYXQuKi9cbiAgICAgICAgRm9ybWF0TW9kZVtGb3JtYXRNb2RlW1wiU3RhbmRhcmREYXRlVGltZU1vZGVcIl0gPSAxXSA9IFwiU3RhbmRhcmREYXRlVGltZU1vZGVcIjtcblxuICAgICAgICAvKiogSW5kaWNhdGVzIHdoZXRoZXIgdG8gZm9ybWF0IHRoZSB2YWx1ZSB3aXRoIHRoZSBzdGFuZGFyZCBudW1lcmljIGZvcm1hdC4qL1xuICAgICAgICBGb3JtYXRNb2RlW0Zvcm1hdE1vZGVbXCJTdGFuZGFyZE51bWVyaWNNb2RlXCJdID0gMl0gPSBcIlN0YW5kYXJkTnVtZXJpY01vZGVcIjtcbiAgICB9KShmb3JtYXR0ZXIuRm9ybWF0TW9kZSB8fCAoZm9ybWF0dGVyLkZvcm1hdE1vZGUgPSB7fSkpO1xuICAgIHZhciBGb3JtYXRNb2RlID0gZm9ybWF0dGVyLkZvcm1hdE1vZGU7XG5cbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBudW1iZXIgZm9ybWF0IHR5cGUuXG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKi9cbiAgICAoZnVuY3Rpb24gKE51bWJlckZvcm1hdFR5cGUpIHtcbiAgICAgICAgLyoqIEZvcm1hdHMgdGhlIGRhdGEgdXNpbmcgdGhlIGdlbmVyYWwgZm9ybWF0dGVyLiovXG4gICAgICAgIE51bWJlckZvcm1hdFR5cGVbTnVtYmVyRm9ybWF0VHlwZVtcIkdlbmVyYWxcIl0gPSAwXSA9IFwiR2VuZXJhbFwiO1xuXG4gICAgICAgIC8qKiBGb3JtYXRzIHRoZSBkYXRhIHVzaW5nIHRoZSBudW1iZXIgZm9ybWF0dGVyLiovXG4gICAgICAgIE51bWJlckZvcm1hdFR5cGVbTnVtYmVyRm9ybWF0VHlwZVtcIk51bWJlclwiXSA9IDFdID0gXCJOdW1iZXJcIjtcblxuICAgICAgICAvKiogRm9ybWF0cyB0aGUgZGF0YSB1c2luZyB0aGUgZGF0ZS10aW1lIGZvcm1hdHRlci4qL1xuICAgICAgICBOdW1iZXJGb3JtYXRUeXBlW051bWJlckZvcm1hdFR5cGVbXCJEYXRlVGltZVwiXSA9IDJdID0gXCJEYXRlVGltZVwiO1xuXG4gICAgICAgIC8qKiBGb3JtYXRzIHRoZSBkYXRhIHVzaW5nIHRoZSB0ZXh0IGZvcm1hdHRlci4qL1xuICAgICAgICBOdW1iZXJGb3JtYXRUeXBlW051bWJlckZvcm1hdFR5cGVbXCJUZXh0XCJdID0gM10gPSBcIlRleHRcIjtcbiAgICB9KShmb3JtYXR0ZXIuTnVtYmVyRm9ybWF0VHlwZSB8fCAoZm9ybWF0dGVyLk51bWJlckZvcm1hdFR5cGUgPSB7fSkpO1xuICAgIHZhciBOdW1iZXJGb3JtYXRUeXBlID0gZm9ybWF0dGVyLk51bWJlckZvcm1hdFR5cGU7XG5cbiAgICB2YXIgVGltZVBhcnQ7XG4gICAgKGZ1bmN0aW9uIChUaW1lUGFydCkge1xuICAgICAgICBUaW1lUGFydFtUaW1lUGFydFtcIkhvdXJcIl0gPSAwXSA9IFwiSG91clwiO1xuICAgICAgICBUaW1lUGFydFtUaW1lUGFydFtcIk1pbnV0ZVwiXSA9IDFdID0gXCJNaW51dGVcIjtcbiAgICAgICAgVGltZVBhcnRbVGltZVBhcnRbXCJTZWNvbmRcIl0gPSAyXSA9IFwiU2Vjb25kXCI7XG4gICAgfSkoVGltZVBhcnQgfHwgKFRpbWVQYXJ0ID0ge30pKTtcblxuICAgIHZhciBEZWZhdWx0VG9rZW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIGZ1bmN0aW9uIERlZmF1bHRUb2tlbnMoKSB7XG4gICAgICAgIH1cblxuICAgICAgICBEZWZhdWx0VG9rZW5zLkRhdGVUaW1lRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5EYXRlVGltZUZvcm1hdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OdW1iZXJGb3JtYXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBEZWZhdWx0VG9rZW5zLkZpbHRlciA9IGZ1bmN0aW9uIChzLCBicmFja2V0c1N0YXJ0LCBicmFja2V0c0VuZCkge1xuICAgICAgICAgICAgaWYgKHMgPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IHMgPT09IGtleXdvcmRfbnVsbCB8fCBzID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc2IgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHJlZkNvdW50ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgcy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgIHZhciBjID0gc1tuXTtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gYnJhY2tldHNTdGFydCkge1xuICAgICAgICAgICAgICAgICAgICByZWZDb3VudCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gYnJhY2tldHNFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmQ291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZkNvdW50IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWZDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzYiArPSBjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNiLnRvU3RyaW5nKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgRGVmYXVsdFRva2Vucy5UcmltU3F1YXJlQnJhY2tldCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgaWYgKCF0b2tlbiB8fCB0b2tlbiA9PT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlblswXSA9PT0gRGVmYXVsdFRva2Vucy5MZWZ0U3F1YXJlQnJhY2tldCkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlRyaW1TdGFydCh0b2tlbiwgRGVmYXVsdFRva2Vucy5MZWZ0U3F1YXJlQnJhY2tldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlblt0b2tlbi5sZW5ndGggLSAxXSA9PT0gRGVmYXVsdFRva2Vucy5SaWdodFNxdWFyZUJyYWNrZXQpIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5UcmltRW5kKHRva2VuLCBEZWZhdWx0VG9rZW5zLlJpZ2h0U3F1YXJlQnJhY2tldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfTtcblxuICAgICAgICBEZWZhdWx0VG9rZW5zLklzT3BlcmF0b3IgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgcmV0dXJuIChjID09PSBEZWZhdWx0VG9rZW5zLkxlc3NUaGFuU2lnbiB8fCBjID09PSBEZWZhdWx0VG9rZW5zLkdyZWF0ZXJUaGFuU2lnbiB8fCBjID09PSBEZWZhdWx0VG9rZW5zLkVxdWFsc1RoYW5TaWduKTtcbiAgICAgICAgfTtcblxuICAgICAgICBEZWZhdWx0VG9rZW5zLlRyaW1Fc2NhcGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIHZhciBsZW4gPSB0b2tlbi5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgaW5Fc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBzYiA9IFwiXCI7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGxlbjsgbisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0b2tlbi5jaGFyQXQobik7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IERlZmF1bHRUb2tlbnMuUmV2ZXJzZVNvbGlkdXNTaWduKSB7XG4gICAgICAgICAgICAgICAgICAgIGluRXNjYXBlID0gIWluRXNjYXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluRXNjYXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYiArPSBjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5Fc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2IgKz0gYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2I7XG4gICAgICAgIH07XG5cbiAgICAgICAgRGVmYXVsdFRva2Vucy5BZGRTcXVhcmVCcmFja2V0ID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5Jc051bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW4ubGVuZ3RoID09PSAwIHx8IHRva2VuWzBdICE9PSBEZWZhdWx0VG9rZW5zLkxlZnRTcXVhcmVCcmFja2V0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuSW5zZXJ0KHRva2VuLCAwLCBEZWZhdWx0VG9rZW5zLkxlZnRTcXVhcmVCcmFja2V0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW4ubGVuZ3RoID09PSAwIHx8IHRva2VuW3Rva2VuLmxlbmd0aCAtIDFdICE9PSBEZWZhdWx0VG9rZW5zLlJpZ2h0U3F1YXJlQnJhY2tldCkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluc2VydCh0b2tlbiwgdG9rZW4ubGVuZ3RoLCBEZWZhdWx0VG9rZW5zLlJpZ2h0U3F1YXJlQnJhY2tldC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9O1xuXG4gICAgICAgIERlZmF1bHRUb2tlbnMuSXNFcXVhbHMgPSBmdW5jdGlvbiAoYSwgYiwgaXNJZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICBpZiAoIWEgJiYgIWIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWEgfHwgIWIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzSWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnRvTG93ZXJDYXNlKCkgPT09IGIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgRGVmYXVsdFRva2Vucy5SZXBsYWNlS2V5d29yZCA9IGZ1bmN0aW9uIChzLCBvbGRTdHJpbmcsIG5ld1N0cmluZykge1xuICAgICAgICAgICAgaWYgKCFzIHx8IHMgPT09IHN0cmluZ0V4LkVtcHR5IHx8IHRoaXMuSXNFcXVhbHMob2xkU3RyaW5nLCBuZXdTdHJpbmcsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJUZW1wID0gcztcbiAgICAgICAgICAgIHZhciBzdGFydCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbmRleE9mKHN0clRlbXAsIG9sZFN0cmluZywgMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0clRlbXAgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVtb3ZlKHN0clRlbXAsIGluZGV4LCBvbGRTdHJpbmcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgc3RyVGVtcCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbnNlcnQoc3RyVGVtcCwgaW5kZXgsIG5ld1N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gaW5kZXggKyBuZXdTdHJpbmcubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0clRlbXA7XG4gICAgICAgIH07XG5cbiAgICAgICAgRGVmYXVsdFRva2Vucy5Jc0RlY2ltYWwgPSBmdW5jdGlvbiAocywgbnVtYmVyRm9ybWF0SW5mbykge1xuICAgICAgICAgICAgdmFyIGRlY2ltYWxTZXBhcmF0b3IgPSBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3I7XG5cbiAgICAgICAgICAgIC8vaWYgKG51bWJlckZvcm1hdEluZm8pIHtcbiAgICAgICAgICAgIC8vICAgIGRlY2ltYWxTZXBhcmF0b3IgPSBudW1iZXJGb3JtYXRJbmZvLm51bWJlckRlY2ltYWxTZXBhcmF0b3I7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIHJldHVybiAocy5pbmRleE9mKGRlY2ltYWxTZXBhcmF0b3IpID4gLTEpO1xuICAgICAgICB9O1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkRvdWJsZVF1b3RlID0gJ1xcXCInO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLlNpbmdsZVF1b3RlID0gJ1xcJyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuVGFiID0gJ1xcdCc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuTGVmdFNxdWFyZUJyYWNrZXQgPSAnWyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuUmlnaHRTcXVhcmVCcmFja2V0ID0gJ10nO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkxlc3NUaGFuU2lnbiA9ICc8JztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5HcmVhdGVyVGhhblNpZ24gPSAnPic7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuRXF1YWxzVGhhblNpZ24gPSAnPSc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuUGx1c1NpZ24gPSAnKyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuSHlwaGVuTWludXMgPSAnLSc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuVW5kZXJMaW5lID0gJ18nO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkxlZnRQYXJlbnRoZXNpcyA9ICcoJztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5SaWdodFBhcmVudGhlc2lzID0gJyknO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkRvbGxhciA9ICckJztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5Db21tYSA9ICc7JztcblxuICAgICAgICBEZWZhdWx0VG9rZW5zLlNwYWNlID0gJyAnO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLlNvbGlkdXNTaWduID0gJy8nO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLlJldmVyc2VTb2xpZHVzU2lnbiA9ICdcXFxcJztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5aZXJvID0gJzAnO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLlF1ZXN0aW9uTWFyayA9ICc/JztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5Db2xvbiA9ICc6JztcbiAgICAgICAgRGVmYXVsdFRva2Vucy5TZW1pY29sb24gPSAnOyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuU2hhcnAgPSAnIyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuQ29tbWVyY2lhbEF0ID0gJ0AnO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLk51bWJlclNpZ24gPSAnIyc7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuQXN0ZXJpc2sgPSAnKic7XG5cbiAgICAgICAgRGVmYXVsdFRva2Vucy5FeHBvbmVudGlhbDEgPSBcIkUrXCI7XG4gICAgICAgIERlZmF1bHRUb2tlbnMuRXhwb25lbnRpYWwyID0gXCJFLVwiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3IgPSBcIi5cIjtcbiAgICAgICAgRGVmYXVsdFRva2Vucy5udW1iZXJHcm91cFNlcGFyYXRvciA9IFwiLFwiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLnBlcmNlbnRTeW1ib2wgPSBcIiVcIjtcbiAgICAgICAgRGVmYXVsdFRva2Vucy5uYW5TeW1ib2wgPSBcIk5hTlwiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkZvcm1hdFNlcGFyYXRvciA9IFwiO1wiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLm5lZ2F0aXZlU2lnbiA9IFwiLVwiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLlJlcGxhY2VQbGFjZWhvbGRlciA9IFwiQFwiO1xuICAgICAgICBEZWZhdWx0VG9rZW5zLkV4cG9uZW50aWFsU3ltYm9sID0gXCJFXCI7XG4gICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zO1xuICAgIH0pKCk7XG4gICAgZm9ybWF0dGVyLkRlZmF1bHRUb2tlbnMgPSBEZWZhdWx0VG9rZW5zO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJOdW1iZXJGb3JtYXRCYXNlXCI+XG4gICAgdmFyIE51bWJlckZvcm1hdEJhc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOdW1iZXJGb3JtYXRCYXNlKHBhcnRMb2NhbGVJRCwgZGJOdW1iZXJGb3JtYXRQYXJ0LCBjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5fY2xhc3NOYW1lcyA9IFtcIk51bWJlckZvcm1hdEJhc2VcIiwgXCJJRm9ybWF0dGVyXCIsIFwiSUZvcm1hdFByb3ZpZGVyU3VwcG9ydFwiXTtcbiAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0SW5mbyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZGF0ZVRpbWVGb3JtYXRJbmZvID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5jdWx0dXJlTmFtZSA9IFwiXCI7XG4gICAgICAgICAgICBzZWxmLl9pbml0RmlsZWRzKCk7XG4gICAgICAgICAgICBzZWxmLnBhcnRMb2NhbGVJRCA9IHBhcnRMb2NhbGVJRDtcbiAgICAgICAgICAgIHNlbGYucGFydERiTnVtYmVyRm9ybWF0ID0gZGJOdW1iZXJGb3JtYXRQYXJ0O1xuICAgICAgICAgICAgaWYgKCFjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VsdHVyZU5hbWUgPSBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VsdHVyZU5hbWUgPSBjdWx0dXJlTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZlByb3RvdHlwZSA9IE51bWJlckZvcm1hdEJhc2UucHJvdG90eXBlO1xuICAgICAgICBuZlByb3RvdHlwZS5faW5pdEZpbGVkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYubnVtYmVyU3RyaW5nQ29udmVydGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5udW1iZXJGb3JtYXRJbmZvID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5kYXRlVGltZUZvcm1hdEluZm8gPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLnBhcnRMb2NhbGVJRCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYucGFydERiTnVtYmVyRm9ybWF0ID0ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vTnVtYmVyRm9ybWF0QmFzZSBQdWJsaWMgUHJvcGVydGllc1xuICAgICAgICBuZlByb3RvdHlwZS5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5udW1iZXJTdHJpbmdDb252ZXJ0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubnVtYmVyU3RyaW5nQ29udmVydGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU2V0XG4gICAgICAgICAgICAgICAgc2VsZi5udW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuUGFydExvY2FsZUlEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKHRoaXMucGFydExvY2FsZUlELCBcIkxvY2FsZUlERm9ybWF0UGFydFwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5QYXJ0REJOdW1iZXJGb3JtYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUodGhpcy5wYXJ0RGJOdW1iZXJGb3JtYXQsIFwiREJOdW1iZXJGb3JtYXRQYXJ0XCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLkRhdGVUaW1lRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvL0dldFxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmRhdGVUaW1lRm9ybWF0SW5mbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9TZXRcbiAgICAgICAgICAgICAgICBzZWxmLmRhdGVUaW1lRm9ybWF0SW5mbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5OdW1iZXJGb3JtYXRJbmZvID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vR2V0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubnVtYmVyRm9ybWF0SW5mbztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9TZXRcbiAgICAgICAgICAgICAgICBzZWxmLm51bWJlckZvcm1hdEluZm8gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuQ3VsdHVyZU5hbWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucGFydExvY2FsZUlEID8gc2VsZi5wYXJ0TG9jYWxlSUQuQ3VsdHVyZUluZm8oKS5OYW1lKCkgOiBzZWxmLmN1bHR1cmVOYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1bHR1cmVOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vTnVtYmVyRm9ybWF0QmFzZSBQcm90ZWN0ZWQgUHJvcGVydGllc1xuICAgICAgICBuZlByb3RvdHlwZS5udW1iZXJHcm91cFNlcGFyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLk51bWJlckZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLk51bWJlckZvcm1hdEluZm8oKS5udW1iZXJHcm91cFNlcGFyYXRvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMubnVtYmVyR3JvdXBTZXBhcmF0b3I7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuUGVyY2VudFN5bWJvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLk51bWJlckZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLk51bWJlckZvcm1hdEluZm8oKS5wZXJjZW50U3ltYm9sO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRGVmYXVsdFRva2Vucy5wZXJjZW50U3ltYm9sO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLlBvc2l0aXZlU2lnbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLk51bWJlckZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLk51bWJlckZvcm1hdEluZm8oKS5wb3NpdGl2ZVNpZ247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLk51bWJlckZvcm1hdEluZm8oKS5wb3NpdGl2ZVNpZ247XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuTmVnYXRpdmVTaWduID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuTnVtYmVyRm9ybWF0SW5mbygpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuTnVtYmVyRm9ybWF0SW5mbygpLm5lZ2F0aXZlU2lnbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMubmVnYXRpdmVTaWduO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLkRlY2ltYWxTZXBhcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2lmICh0aGlzLk51bWJlckZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIHRoaXMuTnVtYmVyRm9ybWF0SW5mbygpLm51bWJlckRlY2ltYWxTZXBhcmF0b3I7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3I7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuTmFOU3ltYm9sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuTnVtYmVyRm9ybWF0SW5mbygpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuTnVtYmVyRm9ybWF0SW5mbygpLm5hblN5bWJvbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMubmFuU3ltYm9sO1xuICAgICAgICB9O1xuXG4gICAgICAgIE51bWJlckZvcm1hdEJhc2UuVHJpbU5vdFN1cHBvcnRTeW1ib2wgPSBmdW5jdGlvbiAoZm9ybWF0LCBpc1N1cHBvcnRGcmFjdGlvbikge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpc1N1cHBvcnRGcmFjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbkNvbW1lbnRzID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgc2IgPSBcIlwiO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBmb3JtYXQubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGZvcm1hdFtuXTtcbiAgICAgICAgICAgICAgICB2YXIgYXBwZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJ1xcXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQ29tbWVudHMgPSAhaW5Db21tZW50cztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluQ29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNTdXBwb3J0RnJhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJz8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTnVtYmVyRm9ybWF0QmFzZS5Jc1RyYW5zZm9ybShmb3JtYXQsIG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBlbmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFOdW1iZXJGb3JtYXRCYXNlLklzVHJhbnNmb3JtKGZvcm1hdCwgbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICdfJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTnVtYmVyRm9ybWF0QmFzZS5Jc1RyYW5zZm9ybShmb3JtYXQsIG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIU51bWJlckZvcm1hdEJhc2UuSXNUcmFuc2Zvcm0oZm9ybWF0LCBuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBlbmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IGM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2I7XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0QmFzZS5Jc1RyYW5zZm9ybSA9IGZ1bmN0aW9uIChzdHIsIGN1cnJlbnRwb3MpIHtcbiAgICAgICAgICAgIGlmIChzdHJbY3VycmVudHBvc10gPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0ludmFsaWRCYWNrc2xhc2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3VycmVudHBvcyAtIDEgPiAwICYmIGN1cnJlbnRwb3MgLSAxIDwgc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChzdHJbY3VycmVudHBvcyAtIDFdID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRwb3MgLSAyIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudHBvcyAtIDIgPiAwICYmIGN1cnJlbnRwb3MgLSAyIDwgc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJbY3VycmVudHBvcyAtIDJdICE9PSAnXFxcXCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRCYXNlLkNvbnRhaW5zS2V5d29yZHMgPSBmdW5jdGlvbiAoZm9ybWF0LCBrZXl3b3Jkcywga2V5d29yZHNTZXQpIHtcbiAgICAgICAgICAgIGlmICghZm9ybWF0IHx8IGZvcm1hdCA9PT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5d29yZHNTZXRbZm9ybWF0XSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0cmluZ09ubHlLZXl3b3JkcyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgaW5Db21tZW50cyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGxhc3QgPSBrZXl3b3JkX251bGwsIGNDb2RlO1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBmb3JtYXQubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGZvcm1hdFtuXTtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJ1xcXCInKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQ29tbWVudHMgPSAhaW5Db21tZW50cztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluQ29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjICE9PSBEZWZhdWx0VG9rZW5zLlVuZGVyTGluZSAmJiBsYXN0ICE9PSBEZWZhdWx0VG9rZW5zLlVuZGVyTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjICE9PSAnRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY0NvZGUgPSBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjQ29kZSA+PSA2NSAmJiBjQ29kZSA8PSA5MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY0NvZGUgfD0gMHgyMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNDb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdPbmx5S2V5d29yZHMgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxhc3QgPSBjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZvcm1hdFRlbXAgPSBzdHJpbmdPbmx5S2V5d29yZHM7XG4gICAgICAgICAgICBpZiAoa2V5d29yZHNTZXRbZm9ybWF0VGVtcF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBrZXl3b3Jkcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0VGVtcC5pbmRleE9mKGtleXdvcmRzW2luZGV4XSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5Gb3JtYXQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5QYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuRXhjZWxDb21wYXRpYmxlRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH07XG4gICAgICAgIE51bWJlckZvcm1hdEJhc2UuR2VuZXJhbCA9IFwiR2VuZXJhbFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXRCYXNlLkdlbmVyYWxfTG93ZXIgPSBcImdlbmVyYWxcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0QmFzZS5fa2V5d29yZHMgPSBbTnVtYmVyRm9ybWF0QmFzZS5HZW5lcmFsX0xvd2VyXTtcbiAgICAgICAgTnVtYmVyRm9ybWF0QmFzZS5fa2V5d29yZHNTZXQgPSB7XCJnZW5lcmFsXCI6IHRydWV9O1xuICAgICAgICByZXR1cm4gTnVtYmVyRm9ybWF0QmFzZTtcbiAgICB9KSgpO1xuXG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIlN0YW5kYXJkRGF0ZVRpbWVGb3JtYXR0ZXIvU3RhbmRhcmROdW1iZXJGb3JtYXR0ZXJcIj5cbiAgICB2YXIgX1N0YW5kYXJkRGF0ZVRpbWVGb3JtYXR0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBfU3RhbmRhcmREYXRlVGltZUZvcm1hdHRlcihmb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuc2hvcnREYXRlUGF0dGVybiA9IFwiZFwiO1xuICAgICAgICAgICAgc2VsZi5sb25nRGF0ZVBhdHRlcm4gPSBcIkRcIjtcbiAgICAgICAgICAgIHNlbGYuRnVsbERhdGVQYXR0ZXJuU2hvcnRUaW1lID0gXCJmXCI7XG4gICAgICAgICAgICBzZWxmLkZ1bGxEYXRlUGF0dGVybkxvbmdUaW1lID0gXCJGXCI7XG4gICAgICAgICAgICBzZWxmLkdlbmVyYWxEYXRlUGF0dGVybkxvbmdUaW1lU2hvcnRUaW1lID0gXCJnXCI7XG4gICAgICAgICAgICBzZWxmLkdlbmVyYWxEYXRlUGF0dGVybkxvbmdUaW1lTG9uZ1RpbWUgPSBcIkdcIjtcbiAgICAgICAgICAgIHNlbGYuTW9udGhEYXlQYXR0ZXJuMSA9IFwibVwiO1xuICAgICAgICAgICAgc2VsZi5Nb250aERheVBhdHRlcm4yID0gXCJNXCI7XG4gICAgICAgICAgICBzZWxmLlJvdW5kVHJpcERhdGVQYXR0ZXJuMSA9IFwib1wiO1xuICAgICAgICAgICAgc2VsZi5Sb3VuZFRyaXBEYXRlUGF0dGVybjIgPSBcIk9cIjtcbiAgICAgICAgICAgIHNlbGYuUkZDMTEyM1BhdHRlcm4xID0gXCJyXCI7XG4gICAgICAgICAgICBzZWxmLlJGQzExMjNQYXR0ZXJuMiA9IFwiUlwiO1xuICAgICAgICAgICAgc2VsZi5Tb3J0YWJsZURhdGVQYXR0ZXJuID0gXCJzXCI7XG4gICAgICAgICAgICBzZWxmLnNob3J0VGltZVBhdHRlcm4gPSBcInRcIjtcbiAgICAgICAgICAgIHNlbGYubG9uZ1RpbWVQYXR0ZXJuID0gXCJUXCI7XG4gICAgICAgICAgICBzZWxmLlVuaXZlcnNhbFNvcnRhYmxlRGF0ZVBhdHRlcm4gPSBcInVcIjtcbiAgICAgICAgICAgIHNlbGYuVW5pdmVyc2FsRnVsbERhdGVQYXR0ZXJuID0gXCJVXCI7XG4gICAgICAgICAgICBzZWxmLlllYXJNb250aFBhdHRlcm4xID0gXCJ5XCI7XG4gICAgICAgICAgICBzZWxmLlllYXJNb250aFBhdHRlcm4yID0gXCJZXCI7XG5cbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMgPSBbXCJTdGFuZGFyZERhdGVUaW1lRm9ybWF0dGVyXCIsIFwiSUZvcm1hdHRlclwiXTtcbiAgICAgICAgICAgIHNlbGYuX2Zvcm1hdFN0cmluZyA9IGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZGZQcm90b3R5cGUgPSBfU3RhbmRhcmREYXRlVGltZUZvcm1hdHRlci5wcm90b3R5cGU7XG4gICAgICAgIHNkZlByb3RvdHlwZS5FdmFsdWF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09IHNlbGYuc2hvcnREYXRlUGF0dGVybiB8fCBmb3JtYXQgPT09IHNlbGYubG9uZ0RhdGVQYXR0ZXJuIHx8IGZvcm1hdCA9PT0gc2VsZi5GdWxsRGF0ZVBhdHRlcm5TaG9ydFRpbWUgfHwgZm9ybWF0ID09PSBzZWxmLkZ1bGxEYXRlUGF0dGVybkxvbmdUaW1lIHx8IGZvcm1hdCA9PT0gc2VsZi5HZW5lcmFsRGF0ZVBhdHRlcm5Mb25nVGltZVNob3J0VGltZSB8fCBmb3JtYXQgPT09IHNlbGYuR2VuZXJhbERhdGVQYXR0ZXJuTG9uZ1RpbWVMb25nVGltZSB8fCBmb3JtYXQgPT09IHNlbGYuTW9udGhEYXlQYXR0ZXJuMSB8fCBmb3JtYXQgPT09IHNlbGYuTW9udGhEYXlQYXR0ZXJuMiB8fCBmb3JtYXQgPT09IHNlbGYuUm91bmRUcmlwRGF0ZVBhdHRlcm4xIHx8IGZvcm1hdCA9PT0gc2VsZi5Sb3VuZFRyaXBEYXRlUGF0dGVybjIgfHwgZm9ybWF0ID09PSBzZWxmLlJGQzExMjNQYXR0ZXJuMSB8fCBmb3JtYXQgPT09IHNlbGYuUkZDMTEyM1BhdHRlcm4yIHx8IGZvcm1hdCA9PT0gc2VsZi5Tb3J0YWJsZURhdGVQYXR0ZXJuIHx8IGZvcm1hdCA9PT0gc2VsZi5zaG9ydFRpbWVQYXR0ZXJuIHx8IGZvcm1hdCA9PT0gc2VsZi5sb25nVGltZVBhdHRlcm4gfHwgZm9ybWF0ID09PSBzZWxmLlVuaXZlcnNhbFNvcnRhYmxlRGF0ZVBhdHRlcm4gfHwgZm9ybWF0ID09PSBzZWxmLlVuaXZlcnNhbEZ1bGxEYXRlUGF0dGVybiB8fCBmb3JtYXQgPT09IHNlbGYuWWVhck1vbnRoUGF0dGVybjEgfHwgZm9ybWF0ID09PSBzZWxmLlllYXJNb250aFBhdHRlcm4yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBzZGZQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IGtleXdvcmRfbnVsbCB8fCBvYmogPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgZm9ybWF0dGVyVXRpbHMuX0RhdGVUaW1lSGVscGVyKG9iaikubG9jYWxlRm9ybWF0KHRoaXMuX2Zvcm1hdFN0cmluZyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2RmUHJvdG90eXBlLlBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0ciB8fCBzdHIgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlci5wYXJzZUxvY2FsZShzdHIsIHRoaXMuX2Zvcm1hdFN0cmluZyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzZGZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdFN0cmluZztcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9TdGFuZGFyZERhdGVUaW1lRm9ybWF0dGVyO1xuICAgIH0pKCk7XG4gICAgZm9ybWF0dGVyLl9TdGFuZGFyZERhdGVUaW1lRm9ybWF0dGVyID0gX1N0YW5kYXJkRGF0ZVRpbWVGb3JtYXR0ZXI7XG5cbiAgICB2YXIgX1N0YW5kYXJkTnVtYmVyRm9ybWF0dGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gX1N0YW5kYXJkTnVtYmVyRm9ybWF0dGVyKGZvcm1hdCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5DdXJyZW5jeVBhdHRlcm4xID0gXCJjXCI7XG4gICAgICAgICAgICBzZWxmLkN1cnJlbmN5UGF0dGVybjIgPSBcIkNcIjtcbiAgICAgICAgICAgIHNlbGYuRGVjaW1hbFBhdHRlcm4xID0gXCJkXCI7XG4gICAgICAgICAgICBzZWxmLkRlY2ltYWxQYXR0ZXJuMiA9IFwiRFwiO1xuICAgICAgICAgICAgc2VsZi5TY2llbnRpZmljUGF0dGVybjEgPSBcImVcIjtcbiAgICAgICAgICAgIHNlbGYuU2NpZW50aWZpY1BhdHRlcm4yID0gXCJFXCI7XG4gICAgICAgICAgICBzZWxmLkZpeGVkUG9pbnRQYXR0ZXJuMSA9IFwiZlwiO1xuICAgICAgICAgICAgc2VsZi5GaXhlZFBvaW50UGF0dGVybjIgPSBcIkZcIjtcbiAgICAgICAgICAgIHNlbGYuR2VuZXJhbFBhdHRlcm4xID0gXCJnXCI7XG4gICAgICAgICAgICBzZWxmLkdlbmVyYWxQYXR0ZXJuMiA9IFwiR1wiO1xuICAgICAgICAgICAgc2VsZi5OdW1iZXJQYXR0ZXJuMSA9IFwiblwiO1xuICAgICAgICAgICAgc2VsZi5OdW1iZXJQYXR0ZXJuMiA9IFwiTlwiO1xuICAgICAgICAgICAgc2VsZi5QZXJjZW50UGF0dGVybjEgPSBcInBcIjtcbiAgICAgICAgICAgIHNlbGYuUGVyY2VudFBhdHRlcm4yID0gXCJQXCI7XG4gICAgICAgICAgICBzZWxmLlJvdW5kVHJpcFBhdHRlcm4xID0gXCJyXCI7XG4gICAgICAgICAgICBzZWxmLlJvdW5kVHJpcFBhdHRlcm4yID0gXCJSXCI7XG4gICAgICAgICAgICBzZWxmLkhleGFkZWNpbWFsUGF0dGVybjEgPSBcInhcIjtcbiAgICAgICAgICAgIHNlbGYuSGV4YWRlY2ltYWxQYXR0ZXJuMiA9IFwiWFwiO1xuXG4gICAgICAgICAgICBzZWxmLl9jbGFzc05hbWVzID0gW1wiU3RhbmRhcmROdW1iZXJGb3JtYXR0ZXJcIiwgXCJJRm9ybWF0dGVyXCJdO1xuICAgICAgICAgICAgc2VsZi5fZm9ybWF0U3RyaW5nID0gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNuZlByb3RvdHlwZSA9IF9TdGFuZGFyZE51bWJlckZvcm1hdHRlci5wcm90b3R5cGU7XG4gICAgICAgIHNuZlByb3RvdHlwZS5FdmFsdWF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChmb3JtYXQgJiYgZm9ybWF0ICE9PSBzdHJpbmdFeC5FbXB0eSAmJiBmb3JtYXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBmb3JtYXQuc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHNlbGYuQ3VycmVuY3lQYXR0ZXJuMSB8fCBrZXkgPT09IHNlbGYuQ3VycmVuY3lQYXR0ZXJuMiB8fCBrZXkgPT09IHNlbGYuRGVjaW1hbFBhdHRlcm4xIHx8IGtleSA9PT0gc2VsZi5EZWNpbWFsUGF0dGVybjIgfHwga2V5ID09PSBzZWxmLlNjaWVudGlmaWNQYXR0ZXJuMSB8fCBrZXkgPT09IHNlbGYuU2NpZW50aWZpY1BhdHRlcm4yIHx8IGtleSA9PT0gc2VsZi5GaXhlZFBvaW50UGF0dGVybjEgfHwga2V5ID09PSBzZWxmLkZpeGVkUG9pbnRQYXR0ZXJuMiB8fCBrZXkgPT09IHNlbGYuR2VuZXJhbFBhdHRlcm4xIHx8IGtleSA9PT0gc2VsZi5HZW5lcmFsUGF0dGVybjIgfHwga2V5ID09PSBzZWxmLk51bWJlclBhdHRlcm4xIHx8IGtleSA9PT0gc2VsZi5OdW1iZXJQYXR0ZXJuMiB8fCBrZXkgPT09IHNlbGYuUGVyY2VudFBhdHRlcm4xIHx8IGtleSA9PT0gc2VsZi5QZXJjZW50UGF0dGVybjIgfHwga2V5ID09PSBzZWxmLlJvdW5kVHJpcFBhdHRlcm4xIHx8IGtleSA9PT0gc2VsZi5Sb3VuZFRyaXBQYXR0ZXJuMiB8fCBrZXkgPT09IHNlbGYuSGV4YWRlY2ltYWxQYXR0ZXJuMSB8fCBrZXkgPT09IHNlbGYuSGV4YWRlY2ltYWxQYXR0ZXJuMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBzbmZQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX251bGwgfHwgb2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgZm9ybWF0dGVyVXRpbHMuX051bWJlckhlbHBlcihvYmopLmxvY2FsZUZvcm1hdCh0aGlzLl9mb3JtYXRTdHJpbmcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNuZlByb3RvdHlwZS5QYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0ciA9PT0ga2V5d29yZF9udWxsIHx8IHN0ciA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgc3RyID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXJVdGlscy5fTnVtYmVySGVscGVyLnBhcnNlTG9jYWxlKHN0cik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VGbG9hdChzdHIpO1xuICAgICAgICAgICAgICAgIGlmIChpc05hTihyZXN1bHQpIHx8ICFpc0Zpbml0ZShyZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc25mUHJvdG90eXBlLkZvcm1hdFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRTdHJpbmc7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfU3RhbmRhcmROdW1iZXJGb3JtYXR0ZXI7XG4gICAgfSkoKTtcbiAgICBmb3JtYXR0ZXIuX1N0YW5kYXJkTnVtYmVyRm9ybWF0dGVyID0gX1N0YW5kYXJkTnVtYmVyRm9ybWF0dGVyO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJOdW1iZXJGb3JtYXRUZXh0XCI+XG4gICAgdmFyIE51bWJlckZvcm1hdFRleHQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoTnVtYmVyRm9ybWF0VGV4dCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gTnVtYmVyRm9ybWF0VGV4dChmb3JtYXQsIHBhcnRMb2NhbGVJRCwgZGJOdW1iZXJGb3JtYXRQYXJ0LCBjdWx0dXJlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBwYXJ0TG9jYWxlSUQsIGRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZSk7XG4gICAgICAgICAgICBzZWxmLl9jbGFzc05hbWVzID0gW1wiTnVtYmVyRm9ybWF0VGV4dFwiLCBcIklGb3JtYXR0ZXJcIl07XG4gICAgICAgICAgICB2YXIgZm9ybWF0VGVtcCA9IE51bWJlckZvcm1hdEJhc2UuVHJpbU5vdFN1cHBvcnRTeW1ib2woZm9ybWF0LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAocGFydExvY2FsZUlEKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0VGVtcCA9IERlZmF1bHRUb2tlbnMuUmVwbGFjZUtleXdvcmQoZm9ybWF0VGVtcCwgc2VsZi5QYXJ0TG9jYWxlSUQoKS5PcmlnaW5hbFRva2VuKCksIHNlbGYuUGFydExvY2FsZUlEKCkuQ3VycmVuY3lTeW1ib2woKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3JtYXRUZW1wID0gRGVmYXVsdFRva2Vucy5GaWx0ZXIoZm9ybWF0VGVtcCwgRGVmYXVsdFRva2Vucy5MZWZ0U3F1YXJlQnJhY2tldCwgRGVmYXVsdFRva2Vucy5SaWdodFNxdWFyZUJyYWNrZXQpO1xuICAgICAgICAgICAgZm9ybWF0VGVtcCA9IERlZmF1bHRUb2tlbnMuVHJpbUVzY2FwZShmb3JtYXRUZW1wKTtcbiAgICAgICAgICAgIHNlbGYuX2Zvcm1hdFN0cmluZyA9IGZvcm1hdFRlbXA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmZQcm90b3R5cGUgPSBOdW1iZXJGb3JtYXRUZXh0LnByb3RvdHlwZTtcbiAgICAgICAgbmZQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC50b1N0cmluZyhvYmopO1xuICAgICAgICAgICAgICAgIHZhciBmb3JtYXRTdHJpbmdUZW1wID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlcGxhY2UodGhpcy5fZm9ybWF0U3RyaW5nLCBcIlxcXCJcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdFN0cmluZ1RlbXAgIT09IGtleXdvcmRfbnVsbCAmJiBmb3JtYXRTdHJpbmdUZW1wICE9PSBrZXl3b3JkX3VuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShmb3JtYXRTdHJpbmdUZW1wLCBcIkBcIiwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLlBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdFN0cmluZztcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRUZXh0LkV2YWx1YXRlRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy88L2VkaXRvci1mb2xkPlxuICAgICAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiRGVmYXVsdERhdGVUaW1lTnVtYmVyU3RyaW5nQ29udmVydGVyXCI+XG4gICAgICAgIG5mUHJvdG90eXBlLkRlZmF1bHREYXRlVGltZU51bWJlclN0cmluZ0NvbnZlcnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIE51bWJlckZvcm1hdFRleHQ7XG4gICAgfSkoTnVtYmVyRm9ybWF0QmFzZSk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIkF1dG9Gb3JtYXR0ZXJcIj5cbiAgICB2YXIgQXV0b0Zvcm1hdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXByZXNlbnRzIGFuIGF1dG9tYXRpYyBmb3JtYXQuXG4gICAgICAgICAqIEBjbGFzc1xuICAgICAgICAgKiBAcGFyYW0geyQud2lqbW8ud2lqc3ByZWFkLkdlbmVyYWxGb3JtYXR0ZXJ9IGlubmVyRm9ybWF0dGVyIFRoZSBpbm5lciBmb3JtYXR0ZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBBdXRvRm9ybWF0dGVyKGlubmVyRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9pbm5lckZvcm1hdHRlciA9IGlubmVyRm9ybWF0dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFmUHJvdG90eXBlID0gQXV0b0Zvcm1hdHRlci5wcm90b3R5cGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIGV4cHJlc3Npb24gdGhhdCBpcyB1c2VkIHRvIGZvcm1hdCBhbmQgcGFyc2UuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBleHByZXNzaW9uIHRoYXQgaXMgdXNlZCB0byBmb3JtYXQgYW5kIHBhcnNlLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2lubmVyRm9ybWF0dGVyID8gc2VsZi5faW5uZXJGb3JtYXR0ZXIuRm9ybWF0U3RyaW5nKCkgOiAnJztcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBvciBzZXRzIHRoZSBpbm5lciBmb3JtYXR0ZXIuXG4gICAgICAgICAqIEBwYXJhbSB7JC53aWptby53aWpzcHJlYWQuR2VuZXJhbEZvcm1hdHRlcn0gZm9ybWF0dGVyIFRoZSBpbm5lciBmb3JtYXR0ZXIuXG4gICAgICAgICAqIEByZXR1cm5zIHskLndpam1vLndpanNwcmVhZC5HZW5lcmFsRm9ybWF0dGVyfSBUaGUgaW5uZXIgZm9ybWF0dGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZQcm90b3R5cGUuaW5uZXJGb3JtYXR0ZXIgPSBmdW5jdGlvbiAoZm9ybWF0dGVyKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9pbm5lckZvcm1hdHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX2lubmVyRm9ybWF0dGVyID0gZm9ybWF0dGVyO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIHRleHQuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0LlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcGFyc2VkIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGFmUHJvdG90eXBlLlBhcnNlID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9pbm5lckZvcm1hdHRlciA/IHNlbGYuX2lubmVyRm9ybWF0dGVyLlBhcnNlKHRleHQpIDogdGV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRm9ybWF0cyB0aGUgc3BlY2lmaWVkIG9iamVjdCBhcyBhIHN0cmluZy5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRleHQgVGhlIG9iamVjdCB3aXRoIGNlbGwgZGF0YSB0byBmb3JtYXQuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2lubmVyRm9ybWF0dGVyID8gc2VsZi5faW5uZXJGb3JtYXR0ZXIuRm9ybWF0KG9iaikgOiAoKG9iaiA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgb2JqID09PSBrZXl3b3JkX251bGwpID8gXCJcIiA6IG9iai50b1N0cmluZygpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZlByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF91bmRlZmluZWQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBBdXRvRm9ybWF0dGVyO1xuICAgIH0pKCk7XG4gICAgZm9ybWF0dGVyLkF1dG9Gb3JtYXR0ZXIgPSBBdXRvRm9ybWF0dGVyO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIHZhciBDdXN0b21OdW1iZXJGb3JtYXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDdXN0b21OdW1iZXJGb3JtYXQoZm9ybWF0LCBjdWx0dXJlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLmNvbmRpdGlvbkZvcm1hdFBhcnQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmNvbG9yRm9ybWF0UGFydCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYubG9jYWxlSURGb3JtYXRQYXJ0ID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5kYk51bWJlckZvcm1hdFBhcnQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLm51bWJlckZvcm1hdCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZGF0ZVRpbWVGb3JtYXRJbmZvID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5udW1iZXJGb3JtYXRJbmZvID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5mb3JtYXRDYWNoZWQgPSBrZXl3b3JkX251bGw7XG5cbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMgPSBbXCJDdXN0b21OdW1iZXJGb3JtYXRcIiwgXCJJRm9ybWF0dGVyXCIsIFwiSUZvcm1hdFByb3ZpZGVyU3VwcG9ydFwiXTtcbiAgICAgICAgICAgIGlmICghY3VsdHVyZSkge1xuICAgICAgICAgICAgICAgIGN1bHR1cmUgPSBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZm9ybWF0Q2FjaGVkID0gTnVtYmVyRm9ybWF0QmFzZS5HZW5lcmFsO1xuICAgICAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0ID0gbmV3IE51bWJlckZvcm1hdEdlbmVyYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Jbml0KGZvcm1hdCwgY3VsdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2ZQcm90b3R5cGUgPSBDdXN0b21OdW1iZXJGb3JtYXQucHJvdG90eXBlO1xuICAgICAgICBjZlByb3RvdHlwZS5Jbml0ID0gZnVuY3Rpb24gKGZvcm1hdCwgY3VsdHVyZSkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0ga2V5d29yZF9udWxsIHx8IGZvcm1hdCA9PT0ga2V5d29yZF91bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Gb3JtYXRJbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5mb3JtYXRDYWNoZWQgPSBmb3JtYXQ7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50VG9rZW4gPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRva2VuID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBpc0luRm9ybWF0UGFydCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGFic1RpbWVQYXJ0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZm9ybWF0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBjID0gZm9ybWF0W2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gRGVmYXVsdFRva2Vucy5MZWZ0U3F1YXJlQnJhY2tldCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbkZvcm1hdFBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250ZW50VG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRva2VuID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9rZW4gKz0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IGMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc0luRm9ybWF0UGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSBEZWZhdWx0VG9rZW5zLlJpZ2h0U3F1YXJlQnJhY2tldCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbkZvcm1hdFBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuICs9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnQgPSB0b2tlbi50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0T2JqZWN0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUoRm9ybWF0UGFydEJhc2UuQ3JlYXRlKHBhcnQpLCBcIkZvcm1hdFBhcnRCYXNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0T2JqZWN0ICYmICEoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUocGFydE9iamVjdCwgXCJBQlNUaW1lRm9ybWF0UGFydFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5BZGRQYXJ0KHBhcnRPYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShwYXJ0T2JqZWN0LCBcIkFCU1RpbWVGb3JtYXRQYXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYnNUaW1lUGFydC5wdXNoKGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKHBhcnRPYmplY3QsIFwiQUJTVGltZUZvcm1hdFBhcnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRva2VuICs9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRm9ybWF0SWxsZWdhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRm9ybWF0SWxsZWdhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpc0luRm9ybWF0UGFydCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuICs9IGM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbkZvcm1hdFBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRm9ybWF0SWxsZWdhbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFRva2VuICs9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXNlIHRoZSBsb2NhbGVJRCBpbiBmb3JtYXQgc3RyaW5nLlxuICAgICAgICAgICAgaWYgKHNlbGYubG9jYWxlSURGb3JtYXRQYXJ0ICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICBjdWx0dXJlID0gc2VsZi5sb2NhbGVJREZvcm1hdFBhcnQuQ3VsdHVyZUluZm8oKS5OYW1lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY29udGVudFRva2VuID8gY29udGVudFRva2VuLnRvU3RyaW5nKCkgOiBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgIGlmIChOdW1iZXJGb3JtYXRHZW5lcmFsLkV2YWx1YXRlRm9ybWF0KGNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5udW1iZXJGb3JtYXQgPSBuZXcgTnVtYmVyRm9ybWF0R2VuZXJhbChjb250ZW50LCBzZWxmLkxvY2FsZUlERm9ybWF0UGFydCgpLCBzZWxmLmRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlckZvcm1hdERhdGVUaW1lLkV2YWx1YXRlRm9ybWF0KGNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFic1BhcnRzQXJyYXkgPSBhYnNUaW1lUGFydC5sZW5ndGggPiAwID8gYWJzVGltZVBhcnQgOiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5udW1iZXJGb3JtYXQgPSBuZXcgTnVtYmVyRm9ybWF0RGF0ZVRpbWUoY29udGVudCwgYWJzUGFydHNBcnJheSwgc2VsZi5Mb2NhbGVJREZvcm1hdFBhcnQoKSwgc2VsZi5kYk51bWJlckZvcm1hdFBhcnQsIGN1bHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXJGb3JtYXREaWdpdGFsLkV2YWx1YXRlRm9ybWF0KGNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5udW1iZXJGb3JtYXQgPSBuZXcgTnVtYmVyRm9ybWF0RGlnaXRhbChmb3JtYXQsIHNlbGYuTG9jYWxlSURGb3JtYXRQYXJ0KCksIHNlbGYuZGJOdW1iZXJGb3JtYXRQYXJ0LCBjdWx0dXJlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyRm9ybWF0VGV4dC5FdmFsdWF0ZUZvcm1hdChjb250ZW50KSkge1xuICAgICAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0ID0gbmV3IE51bWJlckZvcm1hdFRleHQoZm9ybWF0LCBzZWxmLkxvY2FsZUlERm9ybWF0UGFydCgpLCBzZWxmLmRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vQ3VzdG9tTnVtYmVyRm9ybWF0IFB1YmxpYyBQcm9wZXJ0aWVzXG4gICAgICAgIGNmUHJvdG90eXBlLkZvcm1hdFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBmb3JtYXRCdWlsZGVyID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChzZWxmLm51bWJlckZvcm1hdCAmJiBzZWxmLm51bWJlckZvcm1hdC5Gb3JtYXRTdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLkNvbG9yRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdEJ1aWxkZXIgKz0gKHNlbGYuQ29sb3JGb3JtYXRQYXJ0KCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuQ29uZGl0aW9uRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdEJ1aWxkZXIgKz0gKHNlbGYuQ29uZGl0aW9uRm9ybWF0UGFydCgpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLkRCTnVtYmVyRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdEJ1aWxkZXIgKz0gKHNlbGYuREJOdW1iZXJGb3JtYXRQYXJ0KCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuTG9jYWxlSURGb3JtYXRQYXJ0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0QnVpbGRlciArPSAoc2VsZi5Mb2NhbGVJREZvcm1hdFBhcnQoKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3JtYXRCdWlsZGVyICs9IChzZWxmLm51bWJlckZvcm1hdC5Gb3JtYXRTdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRCdWlsZGVyLnRvU3RyaW5nKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuQ29uZGl0aW9uRm9ybWF0UGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbkZvcm1hdFBhcnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuQ29sb3JGb3JtYXRQYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JGb3JtYXRQYXJ0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNmUHJvdG90eXBlLkxvY2FsZUlERm9ybWF0UGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZUlERm9ybWF0UGFydDtcbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS5EQk51bWJlckZvcm1hdFBhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYk51bWJlckZvcm1hdFBhcnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuTnVtYmVyU3RyaW5nQ29udmVydGVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vR2V0XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubnVtYmVyRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm51bWJlckZvcm1hdC5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm51bWJlckZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm51bWJlckZvcm1hdC5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS5FeGNlbENvbXBhdGlibGVGb3JtYXRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZm9ybWF0QnVpbGRlciA9IFwiXCI7XG4gICAgICAgICAgICBpZiAoc2VsZi5udW1iZXJGb3JtYXQgJiYgc2VsZi5udW1iZXJGb3JtYXQuRXhjZWxDb21wYXRpYmxlRm9ybWF0U3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgcGFydHMgc2hvdWxkIGJlIGFkZGVkIGhlcmUgd2hlbiBudW1iZXIgZm9ybWF0IGlzIG5vIE51bWJlckZvcm1hdERpZ2l0YWwsXG4gICAgICAgICAgICAgICAgLy8gTnVtYmVyRm9ybWF0RGlnaXRhbCBpcyBrZWVwaW5nIHRoZSBwYXJ0cyBpbmZvcm1hdGlvbiBpbiBzZWxmLm51bWJlckZvcm1hdC5FeGNlbENvbXBhdGlibGVGb3JtYXRTdHJpbmcsIHNvIG5vIG5lZWQgdG8gYWRkZWQgaGVyZSBhZ2Fpbi5cbiAgICAgICAgICAgICAgICBpZiAoIShmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShzZWxmLm51bWJlckZvcm1hdCwgXCJOdW1iZXJGb3JtYXREaWdpdGFsXCIpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5EQk51bWJlckZvcm1hdFBhcnQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0QnVpbGRlciArPSAoc2VsZi5EQk51bWJlckZvcm1hdFBhcnQoKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLkxvY2FsZUlERm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRCdWlsZGVyICs9IChzZWxmLkxvY2FsZUlERm9ybWF0UGFydCgpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuQ29uZGl0aW9uRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRCdWlsZGVyICs9IChzZWxmLkNvbmRpdGlvbkZvcm1hdFBhcnQoKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLkNvbG9yRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRCdWlsZGVyICs9IChzZWxmLkNvbG9yRm9ybWF0UGFydCgpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9ybWF0QnVpbGRlciArPSAoc2VsZi5udW1iZXJGb3JtYXQuRXhjZWxDb21wYXRpYmxlRm9ybWF0U3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0QnVpbGRlci50b1N0cmluZygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNmUHJvdG90eXBlLkZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm51bWJlckZvcm1hdDtcbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS5EYXRlVGltZUZvcm1hdEluZm8gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5Gb3JtYXR0ZXIoKS5EYXRlVGltZUZvcm1hdEluZm8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9TZXRcbiAgICAgICAgICAgICAgICBzZWxmLkZvcm1hdHRlcigpLkRhdGVUaW1lRm9ybWF0SW5mbyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kYXRlVGltZUZvcm1hdEluZm8gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuTnVtYmVyRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvL0dldFxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLkZvcm1hdHRlcigpLk51bWJlckZvcm1hdEluZm8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9TZXRcbiAgICAgICAgICAgICAgICBzZWxmLkZvcm1hdHRlcigpLk51bWJlckZvcm1hdEluZm8odmFsdWUpO1xuICAgICAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0SW5mbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL0N1c3RvbU51bWJlckZvcm1hdCBQdWJsaWMgTWV0aG9kc1xuICAgICAgICBjZlByb3RvdHlwZS5BZGRQYXJ0ID0gZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgICAgIGlmICghcGFydCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1BhcnRJc051bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUocGFydCwgXCJDb25kaXRpb25Gb3JtYXRQYXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmNvbmRpdGlvbkZvcm1hdFBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25kaXRpb25Gb3JtYXRQYXJ0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUocGFydCwgXCJDb25kaXRpb25Gb3JtYXRQYXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRHVwbGljYXRlZERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUocGFydCwgXCJDb2xvckZvcm1hdFBhcnRcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuY29sb3JGb3JtYXRQYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29sb3JGb3JtYXRQYXJ0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUocGFydCwgXCJDb2xvckZvcm1hdFBhcnRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRHVwbGljYXRlZERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUocGFydCwgXCJMb2NhbGVJREZvcm1hdFBhcnRcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYubG9jYWxlSURGb3JtYXRQYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9jYWxlSURGb3JtYXRQYXJ0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUocGFydCwgXCJMb2NhbGVJREZvcm1hdFBhcnRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRHVwbGljYXRlZERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUocGFydCwgXCJEQk51bWJlckZvcm1hdFBhcnRcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuZGJOdW1iZXJGb3JtYXRQYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGJOdW1iZXJGb3JtYXRQYXJ0ID0gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUocGFydCwgXCJEQk51bWJlckZvcm1hdFBhcnRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRHVwbGljYXRlZERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS5Gb3JtYXQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5udW1iZXJGb3JtYXQuRm9ybWF0KG9iaik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuUGFyc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5udW1iZXJGb3JtYXQuUGFyc2Uoc3RyKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEN1c3RvbU51bWJlckZvcm1hdDtcbiAgICB9KSgpO1xuXG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIkdlbmVyYWxGb3JtYXR0ZXJcIj5cbiAgICB2YXIgR2VuZXJhbEZvcm1hdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXByZXNlbnRzIGEgZm9ybWF0dGVyIHdpdGggdGhlIHNwZWNpZmllZCBmb3JtYXQgbW9kZSBhbmQgZm9ybWF0IHN0cmluZy5cbiAgICAgICAgICogQGNsYXNzXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXQgVGhlIGZvcm1hdC5cbiAgICAgICAgICogQHBhcmFtIHskLndpam1vLndpanNwcmVhZC5Gb3JtYXRNb2RlfSBmb3JtYXRNb2RlIFRoZSBmb3JtYXQgbW9kZS5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGN1bHR1cmVOYW1lIFRoZSBjdWx0dXJlIG5hbWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBHZW5lcmFsRm9ybWF0dGVyKGZvcm1hdCwgZm9ybWF0TW9kZSwgY3VsdHVyZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuZm9ybWF0dGVycyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZm9ybWF0TW9kZVR5cGUgPSAwIC8qIEN1c3RvbU1vZGUgKi87XG4gICAgICAgICAgICBzZWxmLmRhdGVUaW1lRm9ybWF0SW5mbyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0SW5mbyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuaXNTaW5nbGVGb3JtYXR0ZXJJbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuaXNDb25zdHJ1Y3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jdXN0b21lckN1bHR1cmVOYW1lID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5Qcm9wZXJ0eUNoYW5nZWQgPSBbXTtcblxuICAgICAgICAgICAgc2VsZi5fY2xhc3NOYW1lcyA9IFtcIkdlbmVyYWxGb3JtYXR0ZXJcIiwgXCJJRm9ybWF0dGVyXCIsIFwiSU5vdGlmeVByb3BlcnR5Q2hhbmdlZFwiLCBcIklDb2xvckZvcm1hdHRlclwiXTtcbiAgICAgICAgICAgIGlmIChzdHJpbmdFeC5Jc051bGxPckVtcHR5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBOdW1iZXJGb3JtYXRCYXNlLkdlbmVyYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvcm1hdE1vZGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRNb2RlID0gMCAvKiBDdXN0b21Nb2RlICovO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5mb3JtYXRDYWNoZWQgPSBmb3JtYXQ7XG4gICAgICAgICAgICBzZWxmLmZvcm1hdE1vZGVUeXBlID0gZm9ybWF0TW9kZTtcbiAgICAgICAgICAgIHNlbGYuaXNEZWZhdWx0ID0gc2VsZi5mb3JtYXRDYWNoZWQudG9Mb3dlckNhc2UoKSA9PT0gTnVtYmVyRm9ybWF0QmFzZS5HZW5lcmFsX0xvd2VyO1xuICAgICAgICAgICAgc2VsZi5pc0NvbnN0cnVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXJDdWx0dXJlTmFtZSA9IGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uZ2V0Q3VsdHVyZShjdWx0dXJlTmFtZSkuTmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1c3RvbWVyQ3VsdHVyZU5hbWUgPSBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2p1ZGdlIHdoZXRoZXIgZm9ybWF0IGNoYW5nZWQgd2l0aCBjdWx0dXJlLlxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdCA9IGZ1bmN0aW9uIChkZWZhdWx0Rm9ybWF0KSB7XG4gICAgICAgICAgICBpZiAoIWRlZmF1bHRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDdWx0dXJlID0gZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmUuTmFtZSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIG9sZEN1bHR1cmUgPSBkZWZhdWx0Rm9ybWF0LmN1c3RvbWVyQ3VsdHVyZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAob2xkQ3VsdHVyZSA9PT0gY3VycmVudEN1bHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL0dlbmVyYWxGb3JtYXR0ZXIgc3RhdGljIFByb3BlcnRpZXNcbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0TnVtYmVyRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdE51bWJlckZvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHROdW1iZXJGb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihcIiMjIyMjIyMjIyMjIyMjIyMjIyMwLiMjIyMjIyMjIyMjIyMjIyNcIiwgMCAvKiBDdXN0b21Nb2RlICovLCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdE51bWJlckZvcm1hdHRlcjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRHZW5lcmFsRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdEdlbmVyYWxGb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0R2VuZXJhbEZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0R2VuZXJhbEZvcm1hdHRlcjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRTaG9ydERhdGVQYXR0ZXJuRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5Gb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKERlZmF1bHRUb2tlbnMuRGF0ZVRpbWVGb3JtYXRJbmZvKCkuc2hvcnREYXRlUGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkZvcm1hdHRlcjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRTWERhdGV0aW1lUGF0dGVybkZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjdXJyZW50Rm9ybWF0ID0gRGVmYXVsdFRva2Vucy5EYXRlVGltZUZvcm1hdEluZm8oKS5zaG9ydERhdGVQYXR0ZXJuICsgXCIgXCIgKyBcImg6bW06c3NcIjtcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRTWERhdGV0aW1lUGF0dGVybkZvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRTWERhdGV0aW1lUGF0dGVybkZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKGN1cnJlbnRGb3JtYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdFNYRGF0ZXRpbWVQYXR0ZXJuRm9ybWF0dGVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdExvbmdUaW1lUGF0dGVybkZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjdXJyZW50Rm9ybWF0ID0gRGVmYXVsdFRva2Vucy5EYXRlVGltZUZvcm1hdEluZm8oKS5sb25nVGltZVBhdHRlcm47XG4gICAgICAgICAgICBpZiAoR2VuZXJhbEZvcm1hdHRlci5fbmVlZENoYW5nZURlZmF1bHRGb3JtYXQoc2VsZi5kZWZhdWx0TG9uZ1RpbWVQYXR0ZXJuRm9ybWF0dGVyKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVmYXVsdExvbmdUaW1lUGF0dGVybkZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKGN1cnJlbnRGb3JtYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdExvbmdUaW1lUGF0dGVybkZvcm1hdHRlcjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRETU1NRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdERNTU1Gb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0RE1NTUZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKFwiZC1tbW1cIiwgMCAvKiBDdXN0b21Nb2RlICovLCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdERNTU1Gb3JtYXR0ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0TU1NWVlGb3JtYXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoR2VuZXJhbEZvcm1hdHRlci5fbmVlZENoYW5nZURlZmF1bHRGb3JtYXQoc2VsZi5kZWZhdWx0TU1NWVlGb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0TU1NWVlGb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihcIm1tbS15eVwiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0TU1NWVlGb3JtYXR0ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0SE1NRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdEhNTUZvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRITU1Gb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihcImg6bW1cIiwgMCAvKiBDdXN0b21Nb2RlICovLCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdEhNTUZvcm1hdHRlcjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRITU1TU0Zvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRITU1TU0Zvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRITU1TU0Zvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKFwiaDptbTpzc1wiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0SE1NU1NGb3JtYXR0ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0SE1NU1MwRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdEhNTVNTMEZvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRITU1TUzBGb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihcImg6bW06c3MuMFwiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0SE1NU1MwRm9ybWF0dGVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdENvbWJvTnVtYmVyRm9ybWF0dGVyMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRDb21ib051bWJlckZvcm1hdHRlcjEpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIxID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoc3RyaW5nRXguRm9ybWF0KFwiezB9IywjIzAuMDA7W1JlZF0oezB9IywjIzAuMDApXCIsIERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbygpLmN1cnJlbmN5U3ltYm9sKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIxO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdENvbWJvTnVtYmVyRm9ybWF0dGVyMiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRDb21ib051bWJlckZvcm1hdHRlcjIpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIyID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoc3RyaW5nRXguRm9ybWF0KFwiezB9IywjIzA7W1JlZF0oezB9IywjIzApXCIsIERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbygpLmN1cnJlbmN5U3ltYm9sKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIyO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFN0YW5kYXJkTnVtYmVyRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdFN0YW5kYXJkTnVtYmVyRm9ybWF0dGVyKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVmYXVsdFN0YW5kYXJkTnVtYmVyRm9ybWF0dGVyID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoXCIwLjAwRSswMFwiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0U3RhbmRhcmROdW1iZXJGb3JtYXR0ZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U3RhbmRhcmRQZXJjZW50Rm9ybWF0dGVyMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRTdGFuZGFyZFBlcmNlbnRGb3JtYXR0ZXIxKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVmYXVsdFN0YW5kYXJkUGVyY2VudEZvcm1hdHRlcjEgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihcIjAuMDAlXCIsIDAgLyogQ3VzdG9tTW9kZSAqLywgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmUuTmFtZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmLmRlZmF1bHRTdGFuZGFyZFBlcmNlbnRGb3JtYXR0ZXIxO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFN0YW5kYXJkUGVyY2VudEZvcm1hdHRlcjIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoR2VuZXJhbEZvcm1hdHRlci5fbmVlZENoYW5nZURlZmF1bHRGb3JtYXQoc2VsZi5kZWZhdWx0U3RhbmRhcmRQZXJjZW50Rm9ybWF0dGVyMikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRTdGFuZGFyZFBlcmNlbnRGb3JtYXR0ZXIyID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoXCIwJVwiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0U3RhbmRhcmRQZXJjZW50Rm9ybWF0dGVyMjtcbiAgICAgICAgfTtcblxuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRTdGFuZGFyZEdyb3VwTnVtYmVyRm9ybWF0dGVyMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChHZW5lcmFsRm9ybWF0dGVyLl9uZWVkQ2hhbmdlRGVmYXVsdEZvcm1hdChzZWxmLmRlZmF1bHRTdGFuZGFyZEdyb3VwTnVtYmVyRm9ybWF0dGVyMSkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlZmF1bHRTdGFuZGFyZEdyb3VwTnVtYmVyRm9ybWF0dGVyMSA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKFwiIywjIzAuMDBcIiwgMCAvKiBDdXN0b21Nb2RlICovLCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZS5OYW1lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGVmYXVsdFN0YW5kYXJkR3JvdXBOdW1iZXJGb3JtYXR0ZXIxO1xuICAgICAgICB9O1xuXG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFN0YW5kYXJkR3JvdXBOdW1iZXJGb3JtYXR0ZXIyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KHNlbGYuZGVmYXVsdFN0YW5kYXJkR3JvdXBOdW1iZXJGb3JtYXR0ZXIyKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZGVmYXVsdFN0YW5kYXJkR3JvdXBOdW1iZXJGb3JtYXR0ZXIyID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoXCIjLCMjMFwiLCAwIC8qIEN1c3RvbU1vZGUgKi8sIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlLk5hbWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kZWZhdWx0U3RhbmRhcmRHcm91cE51bWJlckZvcm1hdHRlcjI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGdmUHJvdG90eXBlID0gR2VuZXJhbEZvcm1hdHRlci5wcm90b3R5cGU7XG4gICAgICAgIGdmUHJvdG90eXBlLmZpbmREYXRlVGltZUdlbmVyYWxGb3JtYXR0ZXIgPSBmdW5jdGlvbiAocywgdiwgZm9ybWF0dGVyLCBmb3VuZENhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyICYmIGZvcm1hdHRlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlci5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBmb3JtYXR0ZXJba107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGR0ID0gRGF0ZUZvcm1hdEhlbHBlci5zdHJpbmcyRGF0ZShzLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdCA9IGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlci5wYXJzZUxvY2FsZShzLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkdCAmJiAoZHQgLSB2ID09PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZENhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBkaWN0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBmb3JtYXRNb2RlVHlwZTogc2VsZi5mb3JtYXRNb2RlVHlwZSxcbiAgICAgICAgICAgICAgICBjdXN0b21lckN1bHR1cmVOYW1lOiBzZWxmLmN1c3RvbWVyQ3VsdHVyZU5hbWUsXG4gICAgICAgICAgICAgICAgZm9ybWF0Q2FjaGVkOiBzZWxmLmZvcm1hdENhY2hlZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBkaWN0RGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL0dlbmVyYWxGb3JtYXR0ZXIgUHVibGljIFByb3BlcnRpZXNcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aGV0aGVyIHRoaXMgZm9ybWF0dGVkIHRleHQgY29udGFpbnMgYSBmb3JlZ3JvdW5kIGNvbG9yLlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGM+dHJ1ZTwvYz4gaWYgdGhpcyBmb3JtYXR0ZWQgdGV4dCBjb250YWlucyBhIGZvcmVncm91bmQgY29sb3I7IG90aGVyd2lzZSwgPGM+ZmFsc2U8L2M+LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2ZQcm90b3R5cGUuSGFzRm9ybWF0ZWRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmlzRGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuUG9zaXRpdmVFeHByZXNzaW9uKCkgJiYgc2VsZi5Qb3NpdGl2ZUV4cHJlc3Npb24oKS5Db2xvckZvcm1hdFBhcnQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5OZWdhdGl2ZUV4cHJlc3Npb24oKSAmJiBzZWxmLk5lZ2F0aXZlRXhwcmVzc2lvbigpLkNvbG9yRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLlplcm9FeHByZXNzaW9uKCkgJiYgc2VsZi5aZXJvRXhwcmVzc2lvbigpLkNvbG9yRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLlRleHRFeHByZXNzaW9uKCkgJiYgc2VsZi5UZXh0RXhwcmVzc2lvbigpLkNvbG9yRm9ybWF0UGFydCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBmb3JtYXR0ZXIgaXMgdGhlIGRlZmF1bHQgZm9ybWF0dGVyLlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGM+dHJ1ZTwvYz4gaWYgdGhpcyBmb3JtYXR0ZXIgaXMgdGhlIGRlZmF1bHQgZm9ybWF0dGVyOyBvdGhlcndpc2UsIDxjPmZhbHNlPC9jPi5cbiAgICAgICAgICovXG4gICAgICAgIGdmUHJvdG90eXBlLklzRGVmYXVsdEZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGVmYXVsdDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgZm9ybWF0IHN0cmluZyBmb3IgdGhpcyBmb3JtYXR0ZXIuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgZm9ybWF0IHN0cmluZyBmb3IgdGhpcyBmb3JtYXR0ZXIuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXQgc3RyaW5nIGZvciB0aGlzIGZvcm1hdHRlci4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgXCJHZW5lcmFsXCIuXG4gICAgICAgICAqL1xuICAgICAgICBnZlByb3RvdHlwZS5Gb3JtYXRTdHJpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICBzZWxmLkluaXQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0U3RyaW5nQnVpbGRlciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHNlbGYuRm9ybWF0TW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMCAvKiBDdXN0b21Nb2RlICovXG4gICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmZvcm1hdHRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc2VsZi5mb3JtYXR0ZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gc2VsZi5mb3JtYXR0ZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGZvcm1hdHRlciwgXCJDdXN0b21OdW1iZXJGb3JtYXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXRTdHJpbmdCdWlsZGVyID09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdFN0cmluZ0J1aWxkZXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRTdHJpbmdCdWlsZGVyICs9IChEZWZhdWx0VG9rZW5zLkZvcm1hdFNlcGFyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXRUZW1wID0gZm9ybWF0dGVyLkZvcm1hdFN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0U3RyaW5nQnVpbGRlciArPSAoZm9ybWF0VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxIC8qIFN0YW5kYXJkRGF0ZVRpbWVNb2RlICovXG4gICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShzZWxmLmZvcm1hdHRlcnNbMF0sIFwiU3RhbmRhcmREYXRlVGltZUZvcm1hdHRlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZvcm1hdHRlcnNbMF0uRm9ybWF0U3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyIC8qIFN0YW5kYXJkTnVtZXJpY01vZGUgKi9cbiAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKHNlbGYuZm9ybWF0dGVyc1swXSwgXCJTdGFuZGFyZE51bWJlckZvcm1hdHRlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZvcm1hdHRlcnNbMF0uRm9ybWF0U3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0U3RyaW5nQnVpbGRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0U3RyaW5nQnVpbGRlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nRXguRW1wdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVmFsdWVJc051bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmZvcm1hdHRlcnMgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtYXRDYWNoZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLmlzRGVmYXVsdCA9IHNlbGYuZm9ybWF0Q2FjaGVkLnRvTG93ZXJDYXNlKCkgPT09IE51bWJlckZvcm1hdEJhc2UuR2VuZXJhbF9Mb3dlcjtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQ29uc3RydWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLkluaXQoKTtcbiAgICAgICAgICAgICAgICBzZWxmLlJhaXNlUHJvcGVydHlDaGFuZ2VkKFwiRm9ybWF0U3RyaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLkRhdGVUaW1lRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvL0dldFxuICAgICAgICAgICAgICAgIHNlbGYuSW5pdCgpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRhdGVUaW1lRm9ybWF0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kYXRlVGltZUZvcm1hdEluZm87XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMuRGF0ZVRpbWVGb3JtYXRJbmZvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU2V0XG4gICAgICAgICAgICAgICAgc2VsZi5Jbml0KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5kYXRlVGltZUZvcm1hdEluZm8gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzZWxmLmZvcm1hdHRlcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gc2VsZi5mb3JtYXR0ZXJzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShmb3JtYXR0ZXIsIFwiSUZvcm1hdFByb3ZpZGVyU3VwcG9ydFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXRlclRtcCA9IGZvcm1hdHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRlclRtcC5EYXRlVGltZUZvcm1hdEluZm8odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuUmFpc2VQcm9wZXJ0eUNoYW5nZWQoXCJEYXRlVGltZUZvcm1hdEluZm9cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLk51bWJlckZvcm1hdEluZm8gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICBzZWxmLkluaXQoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5udW1iZXJGb3JtYXRJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLm51bWJlckZvcm1hdEluZm87XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIHNlbGYuSW5pdCgpO1xuICAgICAgICAgICAgICAgIHNlbGYubnVtYmVyRm9ybWF0SW5mbyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmZvcm1hdHRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNlbGYuZm9ybWF0dGVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBzZWxmLmZvcm1hdHRlcnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGZvcm1hdHRlciwgXCJJRm9ybWF0UHJvdmlkZXJTdXBwb3J0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1hdGVyVG1wID0gZm9ybWF0dGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdGVyVG1wLk51bWJlckZvcm1hdEluZm8odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuUmFpc2VQcm9wZXJ0eUNoYW5nZWQoXCJOdW1iZXJGb3JtYXRJbmZvXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgZm9ybWF0IG1vZGUgZm9yIHRoaXMgZm9ybWF0dGVyLlxuICAgICAgICAgKiBAcGFyYW0geyQud2lqbW8ud2lqc3ByZWFkLkZvcm1hdE1vZGV9IHZhbHVlIFRoZSBmb3JtYXQgbW9kZSBmb3IgdGhpcyBmb3JtYXR0ZXIuXG4gICAgICAgICAqIEByZXR1cm5zIHskLndpam1vLndpanNwcmVhZC5Gb3JtYXRNb2RlfSBUaGUgZm9ybWF0IG1vZGUgZm9yIHRoaXMgZm9ybWF0dGVyLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBGb3JtYXRNb2RlLkN1c3RvbU1vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBnZlByb3RvdHlwZS5Gb3JtYXRNb2RlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vR2V0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZm9ybWF0TW9kZVR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU2V0XG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtYXRNb2RlVHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGYuUmFpc2VQcm9wZXJ0eUNoYW5nZWQoXCJGb3JtYXRNb2RlXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgRXhjZWwtY29tcGF0aWJsZSBmb3JtYXQgc3RyaW5nLlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgRXhjZWwtY29tcGF0aWJsZSBmb3JtYXQgc3RyaW5nLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBnZlByb3RvdHlwZS5FeGNlbENvbXBhdGlibGVGb3JtYXRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLkluaXQoKTtcbiAgICAgICAgICAgIHZhciBmb3JtYXRTdHJpbmdCdWlsZGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc3dpdGNoIChzZWxmLkZvcm1hdE1vZGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMCAvKiBDdXN0b21Nb2RlICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc2VsZi5mb3JtYXR0ZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBzZWxmLmZvcm1hdHRlcnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShmb3JtYXR0ZXIsIFwiQ3VzdG9tTnVtYmVyRm9ybWF0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXRTdHJpbmdCdWlsZGVyID09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0U3RyaW5nQnVpbGRlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRTdHJpbmdCdWlsZGVyICs9IChEZWZhdWx0VG9rZW5zLkZvcm1hdFNlcGFyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybWF0VGVtcCA9IGZvcm1hdHRlci5FeGNlbENvbXBhdGlibGVGb3JtYXRTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0U3RyaW5nQnVpbGRlciArPSAoZm9ybWF0VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMSAvKiBTdGFuZGFyZERhdGVUaW1lTW9kZSAqL1xuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKHNlbGYuZm9ybWF0dGVyc1swXSwgXCJTdGFuZGFyZERhdGVUaW1lRm9ybWF0dGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5mb3JtYXR0ZXJzWzBdLkV4Y2VsQ29tcGF0aWJsZUZvcm1hdFN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMiAvKiBTdGFuZGFyZE51bWVyaWNNb2RlICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUoc2VsZi5mb3JtYXR0ZXJzWzBdLCBcIlN0YW5kYXJkTnVtYmVyRm9ybWF0dGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5mb3JtYXR0ZXJzWzBdLkV4Y2VsQ29tcGF0aWJsZUZvcm1hdFN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9ybWF0U3RyaW5nQnVpbGRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRTdHJpbmdCdWlsZGVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBnZlByb3RvdHlwZS5Qb3NpdGl2ZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLkluaXQoKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmZvcm1hdHRlcnMgJiYgc2VsZi5mb3JtYXR0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyVXRpbHMudXRpbC5hc0N1c3RvbVR5cGUoc2VsZi5mb3JtYXR0ZXJzWzBdLCBcIkN1c3RvbU51bWJlckZvcm1hdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgZ2ZQcm90b3R5cGUuTmVnYXRpdmVFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5Jbml0KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzICYmIHNlbGYuZm9ybWF0dGVycy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKHNlbGYuZm9ybWF0dGVyc1sxXSwgXCJDdXN0b21OdW1iZXJGb3JtYXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLlplcm9FeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5Jbml0KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzICYmIHNlbGYuZm9ybWF0dGVycy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKHNlbGYuZm9ybWF0dGVyc1syXSwgXCJDdXN0b21OdW1iZXJGb3JtYXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLlRleHRFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5Jbml0KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzICYmIHNlbGYuZm9ybWF0dGVycy5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKHNlbGYuZm9ybWF0dGVyc1szXSwgXCJDdXN0b21OdW1iZXJGb3JtYXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2VuZXJhbEZvcm1hdHRlciBQdWJsaWMgTWV0aG9kc1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgcHJlZmVycmVkIGZvcm1hdHRlciB0eXBlIGZvciBhIHNwZWNpZmllZCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB2YWx1ZSB0byBmb3JtYXQuXG4gICAgICAgICAqIEByZXR1cm5zIHskLndpam1vLndpanNwcmVhZC5OdW1iZXJGb3JtYXRUeXBlfSBUaGUgTnVtYmVyRm9ybWF0VHlwZSBlbnVtZXJhdGlvbiB0aGF0IHNwZWNpZmllcyB0aGUgZm9ybWF0IHR5cGUuXG4gICAgICAgICAqL1xuICAgICAgICBnZlByb3RvdHlwZS5HZXRGb3JtYXRUeXBlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdGhpcy5Jbml0KCk7XG4gICAgICAgICAgICB2YXIgZm9ybWF0SW5mbyA9IHRoaXMuR2V0Rm9ybWF0SW5mbyhvYmopO1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGZvcm1hdEluZm8sIFwiQ3VzdG9tTnVtYmVyRm9ybWF0XCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1c3RvbUZvcm1hdCA9IGZvcm1hdEluZm8uRm9ybWF0dGVyKCk7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGN1c3RvbUZvcm1hdCwgXCJOdW1iZXJGb3JtYXREaWdpdGFsXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxIC8qIE51bWJlciAqLztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGN1c3RvbUZvcm1hdCwgXCJOdW1iZXJGb3JtYXREYXRlVGltZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMiAvKiBEYXRlVGltZSAqLztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGN1c3RvbUZvcm1hdCwgXCJOdW1iZXJGb3JtYXRUZXh0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAzIC8qIFRleHQgKi87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUoZm9ybWF0SW5mbywgXCJOdW1iZXJGb3JtYXREaWdpdGFsXCIpIHx8IGZvcm1hdHRlclV0aWxzLnV0aWwuaXNDdXN0b21UeXBlKGZvcm1hdEluZm8sIFwiU3RhbmRhcmROdW1iZXJGb3JtYXR0ZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEgLyogTnVtYmVyICovO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUoZm9ybWF0SW5mbywgXCJOdW1iZXJGb3JtYXREYXRlVGltZVwiKSB8fCBmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShmb3JtYXRJbmZvLCBcIlN0YW5kYXJkRGF0ZVRpbWVGb3JtYXR0ZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDIgLyogRGF0ZVRpbWUgKi87XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShmb3JtYXRJbmZvLCBcIk51bWJlckZvcm1hdFRleHRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDMgLyogVGV4dCAqLztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwIC8qIEdlbmVyYWwgKi87XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIHByZWZlcnJlZCBlZGl0aW5nIGZvcm1hdHRlci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHZhbHVlIHRvIGZvcm1hdC5cbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHByZWZlcnJlZCBlZGl0aW5nIGZvcm1hdHRlciBmb3IgdGhlIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGdmUHJvdG90eXBlLkdldFByZWZlcnJlZEVkaXRpbmdGb3JtYXR0ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICB0aGlzLkluaXQoKTtcbiAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKG9iaiwgXCJEYXRlVGltZVwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBkdCA9IG5ldyBmb3JtYXR0ZXJVdGlscy5fRGF0ZVRpbWVIZWxwZXIob2JqKTtcbiAgICAgICAgICAgICAgICBpZiAoZHQuSG91cigpID09PSAwICYmIGR0Lk1pbnV0ZSgpID09PSAwICYmIGR0LlNlY29uZCgpID09PSAwICYmIGR0Lk1pbGxpc2Vjb25kKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5Gb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U1hEYXRldGltZVBhdHRlcm5Gb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKG9iaiwgXCJUaW1lU3BhblwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRMb25nVGltZVBhdHRlcm5Gb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMuRm9ybWF0Q29udmVydGVyLklzTnVtYmVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIuVG9Eb3VibGUob2JqKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiAxRTIwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR2VuZXJhbEZvcm1hdHRlcihcIjAuIyNFKzAwXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHROdW1iZXJGb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKG9iaiwgXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0R2VuZXJhbEZvcm1hdHRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0R2VuZXJhbEZvcm1hdHRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSBwcmVmZXJyZWQgZGlzcGxheSBmb3JtYXQgc3RyaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcyBUaGUgZm9ybWF0dGVkIGRhdGEgc3RyaW5nLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVSZWYgVGhlIHBhcnNlZCB2YWx1ZS5cbiAgICAgICAgICogQHJldHVybnMgeyQud2lqbW8ud2lqc3ByZWFkLk51bWJlckZvcm1hdFR5cGV9IFRoZSBwcmVmZXJyZWQgZm9ybWF0dGVyIGZvciB0aGUgc3RyaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2ZQcm90b3R5cGUuR2V0UHJlZmVycmVkRGlzcGxheUZvcm1hdHRlciA9IGZ1bmN0aW9uIChzLCB2YWx1ZVJlZikge1xuICAgICAgICAgICAgLy9UaGUgZm9sbG93aW5nIHRocmVlIGxpbmVzIG9mIGNvZGUgaXMgZm9yIHNhdmluZyB3b3JrbG9hZCBvZiB3cml0aW5nIGNlbGxmb3JtYXR0ZXIgdGVzdCBzY3JpcHRzLlxuICAgICAgICAgICAgLy9UaGUgdGVzdCBzY3JpcHRzIGFyZSBtaWdyYXRlZCBmcm9tIFNYLGFuZCBHZXRQcmVmZXJyZWREaXNwbGF5Rm9ybWF0dGVyIGhhcyBvbmx5IG9uZSBwYXJhbSBpbiBTWCxzbyBtYWtlIHRoaXMgY2hhbmdlLlxuICAgICAgICAgICAgLy9JZiB1c2VyIGRvZXNuJ3Qgd2FudCB0byBnZXQgdGhlIHJlc3VsdCBvZiBQYXJzZSB3aGVuIGNhbGwgdGhpcyBtZXRob2QsdGhlIHNlY29uZCBwYXJhbSBvZiB0aGUgbWV0aG9kIGNhbiBiZSBvbWl0dGVkLlxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZVJlZikge1xuICAgICAgICAgICAgICAgIHZhbHVlUmVmID0geyd2YWx1ZSc6IGtleXdvcmRfbnVsbH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZVJlZi52YWx1ZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuSW5pdCgpO1xuXG4gICAgICAgICAgICBpZiAoc3RyaW5nRXguSXNOdWxsT3JFbXB0eShzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR2VuZXJhbEZvcm1hdHRlcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RyVGVtcCA9IHM7XG4gICAgICAgICAgICB2YXIgdiA9ICh2YWx1ZVJlZi52YWx1ZSA9IHNlbGYuUGFyc2Uoc3RyVGVtcCkpO1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKHYsIFwiRGF0ZVRpbWVcIikgfHwgZm9ybWF0dGVyVXRpbHMudXRpbC5pc1R5cGUodiwgXCJUaW1lU3BhblwiKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgPSBzZWxmLmZpbmREYXRlVGltZUdlbmVyYWxGb3JtYXR0ZXIocywgdiwgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsTW9udGhEYXkoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdERNTU1Gb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgocmVzdWx0ID0gc2VsZi5maW5kRGF0ZVRpbWVHZW5lcmFsRm9ybWF0dGVyKHMsIHYsIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbFllYXJNb250aCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0TU1NWVlGb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgocmVzdWx0ID0gc2VsZi5maW5kRGF0ZVRpbWVHZW5lcmFsRm9ybWF0dGVyKHMsIHYsIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbFllYXJNb250aERheSgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U2hvcnREYXRlUGF0dGVybkZvcm1hdHRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgPSBzZWxmLmZpbmREYXRlVGltZUdlbmVyYWxGb3JtYXR0ZXIocywgdiwgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsSG91ck1pbnV0ZSgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0SE1NRm9ybWF0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCA9IHNlbGYuZmluZERhdGVUaW1lR2VuZXJhbEZvcm1hdHRlcihzLCB2LCBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlU2Vjb25kKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBHZW5lcmFsRm9ybWF0dGVyLkRlZmF1bHRITU1TU0Zvcm1hdHRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgPSBzZWxmLmZpbmREYXRlVGltZUdlbmVyYWxGb3JtYXR0ZXIocywgdiwgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsSG91ck1pbnV0ZVNlY29uZFN1YlNlY29uZCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0SE1NU1MwRm9ybWF0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCA9IHNlbGYuZmluZERhdGVUaW1lR2VuZXJhbEZvcm1hdHRlcihzLCB2LCBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlV2l0aERhdGUoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1Gb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkhNTUZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKHNlbGYuRGF0ZVRpbWVGb3JtYXRJbmZvKCkuc2hvcnREYXRlUGF0dGVybiArIFwiIFwiICsgXCJoOm1tXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1Gb3JtYXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCA9IHNlbGYuZmluZERhdGVUaW1lR2VuZXJhbEZvcm1hdHRlcihzLCB2LCBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlU2Vjb25kV2l0aERhdGUoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1TU0Zvcm1hdHRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRTaG9ydERhdGVQYXR0ZXJuSE1NU1NGb3JtYXR0ZXIgPSBuZXcgR2VuZXJhbEZvcm1hdHRlcihzZWxmLkRhdGVUaW1lRm9ybWF0SW5mbygpLnNob3J0RGF0ZVBhdHRlcm4gKyBcIiBcIiArIFwiaDptbTpzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRTaG9ydERhdGVQYXR0ZXJuSE1NU1NGb3JtYXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCA9IHNlbGYuZmluZERhdGVUaW1lR2VuZXJhbEZvcm1hdHRlcihzLCB2LCBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlU2Vjb25kU3ViU2Vjb25kV2l0aERhdGUoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdlbmVyYWxGb3JtYXR0ZXIuX25lZWRDaGFuZ2VEZWZhdWx0Rm9ybWF0KEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1TUzBGb3JtYXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkhNTVNTMEZvcm1hdHRlciA9IG5ldyBHZW5lcmFsRm9ybWF0dGVyKHNlbGYuRGF0ZVRpbWVGb3JtYXRJbmZvKCkuc2hvcnREYXRlUGF0dGVybiArIFwiIFwiICsgXCJoOm1tOnNzLjBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkhNTVNTMEZvcm1hdHRlcjtcbiAgICAgICAgICAgICAgICAgICAgfSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIuSXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyVGVtcFswXSA9PT0gRGVmYXVsdFRva2Vucy5OdW1iZXJGb3JtYXRJbmZvKCkuY3VycmVuY3lTeW1ib2xbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5Db250YWlucyhzdHJUZW1wLCBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIxKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbmRleE9mKHN0clRlbXAsIFwiZVwiLCAxIC8qIEN1cnJlbnRDdWx0dXJlSWdub3JlQ2FzZSAqLykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U3RhbmRhcmROdW1iZXJGb3JtYXR0ZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0clRlbXBbMF0udG9TdHJpbmcoKSA9PT0gRGVmYXVsdFRva2Vucy5wZXJjZW50U3ltYm9sIHx8IHN0clRlbXBbc3RyVGVtcC5sZW5ndGggLSAxXS50b1N0cmluZygpID09PSBEZWZhdWx0VG9rZW5zLnBlcmNlbnRTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5Db250YWlucyhzdHJUZW1wLCBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U3RhbmRhcmRQZXJjZW50Rm9ybWF0dGVyMSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFN0YW5kYXJkUGVyY2VudEZvcm1hdHRlcjIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkNvbnRhaW5zKHN0clRlbXAsIERlZmF1bHRUb2tlbnMubnVtYmVyR3JvdXBTZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuQ29udGFpbnMoc3RyVGVtcCwgRGVmYXVsdFRva2Vucy5EZWNpbWFsU2VwYXJhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdFN0YW5kYXJkR3JvdXBOdW1iZXJGb3JtYXR0ZXIxKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2VuZXJhbEZvcm1hdHRlci5EZWZhdWx0U3RhbmRhcmRHcm91cE51bWJlckZvcm1hdHRlcjIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEdlbmVyYWxGb3JtYXR0ZXIuRGVmYXVsdEdlbmVyYWxGb3JtYXR0ZXIoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRm9ybWF0cyB0aGUgc3BlY2lmaWVkIG9iamVjdCBhcyBhIHN0cmluZyB3aXRoIGEgY29uZGl0aW9uYWwgY29sb3IuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB3aXRoIGNlbGwgZGF0YSB0byBmb3JtYXQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25kaXRpb25hbEZvcmVDb2xvciBUaGUgY29uZGl0aW9uYWwgZm9yZWdyb3VuZCBjb2xvci5cbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBnZlByb3RvdHlwZS5Gb3JtYXQgPSBmdW5jdGlvbiAob2JqLCBjb25kaXRpb25hbEZvcmVDb2xvcikge1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKG9iaiwgJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgZm9yZSBjb2xvclxuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbmFsRm9yZUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uYWxGb3JlQ29sb3IudmFsdWUgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLkluaXQoKTtcbiAgICAgICAgICAgIHZhciBmb3JtYXRJbmZvID0gdGhpcy5HZXRGb3JtYXRJbmZvKG9iaik7XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzQ3VzdG9tVHlwZShmb3JtYXRJbmZvLCBcIkN1c3RvbU51bWJlckZvcm1hdFwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBjb2xvclBhcnQgPSBmb3JtYXRJbmZvLkNvbG9yRm9ybWF0UGFydCgpO1xuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25hbEZvcmVDb2xvciAmJiBjb2xvclBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uYWxGb3JlQ29sb3IudmFsdWUgPSBjb2xvclBhcnQuRm9yZUNvbG9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmb3JtYXQgdmFsdWVcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgICAgICB2YXIgaXNOdW1iZXIgPSBmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIuSXNOdW1iZXIob2JqKTtcbiAgICAgICAgICAgIGlmIChpc051bWJlcikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyVXRpbHMuRm9ybWF0Q29udmVydGVyLlRvRG91YmxlKG9iaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXRJbmZvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIgJiYgZm9ybWF0SW5mbyA9PT0gdGhpcy5OZWdhdGl2ZUV4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmb3JtYXRJbmZvLkZvcm1hdChNYXRoX2Ficyh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc0N1c3RvbVR5cGUoZm9ybWF0SW5mbywgXCJDdXN0b21OdW1iZXJGb3JtYXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZiA9IGZvcm1hdHRlclV0aWxzLnV0aWwuYXNDdXN0b21UeXBlKGZvcm1hdEluZm8sIFwiQ3VzdG9tTnVtYmVyRm9ybWF0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNmICYmIGNmLkNvbmRpdGlvbkZvcm1hdFBhcnQoKSAmJiBjZi5Db25kaXRpb25Gb3JtYXRQYXJ0KCkuVmFsdWUoKSA+IDAgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gRGVmYXVsdFRva2Vucy5uZWdhdGl2ZVNpZ24gKyByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZm9ybWF0SW5mby5Gb3JtYXQob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoRXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc1R5cGUob2JqLCBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpc051bWJlciAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMuSHlwaGVuTWludXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc1R5cGUob2JqLCBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChvYmogPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IG9iaiA9PT0ga2V5d29yZF9udWxsKSA/IHN0cmluZ0V4LkVtcHR5IDogb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIHRleHQuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0LlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcGFyc2VkIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGdmUHJvdG90eXBlLlBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5Jbml0KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi5mb3JtYXR0ZXJzICYmIHNlbGYuZm9ybWF0dGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZm9ybWF0dGVyc1swXS5QYXJzZShzdHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2VuZXJhbEZvcm1hdHRlciBQcml2YXRlIE1ldGhvZHNcbiAgICAgICAgZ2ZQcm90b3R5cGUuSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5pc0NvbnN0cnVjdGVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0NvbnN0cnVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHNlbGYuZm9ybWF0TW9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwIC8qIEN1c3RvbU1vZGUgKi9cbiAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5Jbml0RXhjZWxDb21wYXRpYmxlTW9kZShzZWxmLmZvcm1hdENhY2hlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxIC8qIFN0YW5kYXJkRGF0ZVRpbWVNb2RlICovXG4gICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuSW5pdFN0YW5kYXJkRGF0ZVRpbWVNb2RlKHNlbGYuZm9ybWF0Q2FjaGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDIgLyogU3RhbmRhcmROdW1lcmljTW9kZSAqL1xuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLkluaXRTdGFuZGFyZE51bWVyaWNNb2RlKHNlbGYuZm9ybWF0Q2FjaGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBnZlByb3RvdHlwZS5Jbml0U3RhbmRhcmREYXRlVGltZU1vZGUgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVyID0gbmV3IF9TdGFuZGFyZERhdGVUaW1lRm9ybWF0dGVyKGZvcm1hdCk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyLkV2YWx1YXRlRm9ybWF0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdHRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdHRlcnMucHVzaChmb3JtYXR0ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Gb3JtYXRJbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBnZlByb3RvdHlwZS5Jbml0U3RhbmRhcmROdW1lcmljTW9kZSA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBuZXcgX1N0YW5kYXJkTnVtYmVyRm9ybWF0dGVyKGZvcm1hdCk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyLkV2YWx1YXRlRm9ybWF0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdHRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdHRlcnMucHVzaChmb3JtYXR0ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Gb3JtYXRJbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBnZlByb3RvdHlwZS5Jbml0RXhjZWxDb21wYXRpYmxlTW9kZSA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmdFeC5Jc051bGxPckVtcHR5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Gb3JtYXRJbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuZm9ybWF0dGVycyA9IFtdO1xuICAgICAgICAgICAgaWYgKHNlbGYuaXNEZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5mb3JtYXR0ZXJzLnB1c2gobmV3IEN1c3RvbU51bWJlckZvcm1hdCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc1NpbmdsZUZvcm1hdHRlckluZm8gPSAhZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkNvbnRhaW5zKGZvcm1hdCwgRGVmYXVsdFRva2Vucy5Gb3JtYXRTZXBhcmF0b3IudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gZm9ybWF0LnNwbGl0KERlZmF1bHRUb2tlbnMuRm9ybWF0U2VwYXJhdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPCAxIHx8IGl0ZW1zLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfRm9ybWF0SWxsZWdhbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1hdEl0ZW0gPSBuZXcgQ3VzdG9tTnVtYmVyRm9ybWF0KGl0ZW1zW2luZGV4XSwgc2VsZi5jdXN0b21lckN1bHR1cmVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZm9ybWF0dGVycy5wdXNoKGZvcm1hdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLlBvc2l0aXZlRXhwcmVzc2lvbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBnZlByb3RvdHlwZS5HZXRGb3JtYXRJbmZvID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuRm9ybWF0TW9kZSgpID09PSAwIC8qIEN1c3RvbU1vZGUgKi8pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChvYmopID09PSBcInN0cmluZ1wiICYmIGlzTmFOKG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuVGV4dEV4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuVGV4dEV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLlBvc2l0aXZlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIuSXNOdW1iZXIob2JqKSB8fCBmb3JtYXR0ZXJVdGlscy51dGlsLmlzVHlwZShvYmosIFwiYm9vbGVhblwiKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpdmUgPSBzZWxmLlBvc2l0aXZlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmVnYXRpdmUgPSBzZWxmLk5lZ2F0aXZlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIuVG9Eb3VibGUob2JqKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpdmVIYXNDb25kaXRpb24gPSBwb3NpdGl2ZSAmJiBwb3NpdGl2ZS5Db25kaXRpb25Gb3JtYXRQYXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZWdhdGl2ZUhhc0NvbmRpdGlvbiA9IG5lZ2F0aXZlICYmIG5lZ2F0aXZlLkNvbmRpdGlvbkZvcm1hdFBhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdEZvcm1hdHRlciA9IHNlbGYuaXNTaW5nbGVGb3JtYXR0ZXJJbmZvID8gcG9zaXRpdmUgOiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aXZlSGFzQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aXZlLkNvbmRpdGlvbkZvcm1hdFBhcnQoKS5Jc01lZXRDb25kaXRpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEZvcm1hdHRlciA9IHBvc2l0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gMCB8fCAodmFsdWUgPT09IDAgJiYgIXNlbGYuWmVyb0V4cHJlc3Npb24oKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Rm9ybWF0dGVyID0gcG9zaXRpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRGb3JtYXR0ZXIgJiYgc2VsZi5OZWdhdGl2ZUV4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5lZ2F0aXZlSGFzQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5lZ2F0aXZlLkNvbmRpdGlvbkZvcm1hdFBhcnQoKS5Jc01lZXRDb25kaXRpb24odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEZvcm1hdHRlciA9IG5lZ2F0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRGb3JtYXR0ZXIgPSBuZWdhdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdEZvcm1hdHRlciAmJiBzZWxmLlplcm9FeHByZXNzaW9uKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEZvcm1hdHRlciA9IHNlbGYuWmVyb0V4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Rm9ybWF0dGVyICYmIHNlbGYuWmVyb0V4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Rm9ybWF0dGVyID0gc2VsZi5aZXJvRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRGb3JtYXR0ZXIgJiYgc2VsZi5OZWdhdGl2ZUV4cHJlc3Npb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Rm9ybWF0dGVyID0gc2VsZi5OZWdhdGl2ZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLkZvcm1hdE1vZGUoKSA9PT0gMSAvKiBTdGFuZGFyZERhdGVUaW1lTW9kZSAqLyB8fCBzZWxmLkZvcm1hdE1vZGUoKSA9PT0gMiAvKiBTdGFuZGFyZE51bWVyaWNNb2RlICovKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZm9ybWF0dGVycyAmJiBzZWxmLmZvcm1hdHRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZvcm1hdHRlcnNbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGdmUHJvdG90eXBlLlJhaXNlUHJvcGVydHlDaGFuZ2VkID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuUHJvcGVydHlDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNlbGYuUHJvcGVydHlDaGFuZ2VkLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWV0aG9kID0gc2VsZi5Qcm9wZXJ0eUNoYW5nZWRbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChtZXRob2QpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZChzZWxmLCBwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHROdW1iZXJGb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdEdlbmVyYWxGb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5Gb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdExvbmdUaW1lUGF0dGVybkZvcm1hdHRlciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U1hEYXRldGltZVBhdHRlcm5Gb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdERNTU1Gb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdE1NTVlZRm9ybWF0dGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRITU1Gb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdEhNTVNTRm9ybWF0dGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRITU1TUzBGb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1Gb3JtYXR0ZXIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFNob3J0RGF0ZVBhdHRlcm5ITU1TU0Zvcm1hdHRlciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U2hvcnREYXRlUGF0dGVybkhNTVNTMEZvcm1hdHRlciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0Q29tYm9OdW1iZXJGb3JtYXR0ZXIxID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRDb21ib051bWJlckZvcm1hdHRlcjIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIEdlbmVyYWxGb3JtYXR0ZXIuZGVmYXVsdFN0YW5kYXJkTnVtYmVyRm9ybWF0dGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRTdGFuZGFyZFBlcmNlbnRGb3JtYXR0ZXIxID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRTdGFuZGFyZFBlcmNlbnRGb3JtYXR0ZXIyID0ga2V5d29yZF9udWxsO1xuICAgICAgICBHZW5lcmFsRm9ybWF0dGVyLmRlZmF1bHRTdGFuZGFyZEdyb3VwTnVtYmVyRm9ybWF0dGVyMSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgR2VuZXJhbEZvcm1hdHRlci5kZWZhdWx0U3RhbmRhcmRHcm91cE51bWJlckZvcm1hdHRlcjIgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIHJldHVybiBHZW5lcmFsRm9ybWF0dGVyO1xuICAgIH0pKCk7XG4gICAgZm9ybWF0dGVyLkdlbmVyYWxGb3JtYXR0ZXIgPSBHZW5lcmFsRm9ybWF0dGVyO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJGb3JtYXRQYXJ0QmFzZVwiPlxuICAgIHZhciBGb3JtYXRQYXJ0QmFzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEZvcm1hdFBhcnRCYXNlKHRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGFzc05hbWVzID0gW1wiRm9ybWF0UGFydEJhc2VcIl07XG5cbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG5cbiAgICAgICAgRm9ybWF0UGFydEJhc2UucHJvdG90eXBlLk9yaWdpbmFsVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbFRva2VuO1xuICAgICAgICB9O1xuXG4gICAgICAgIEZvcm1hdFBhcnRCYXNlLnByb3RvdHlwZS5TdXBwb3J0ZWRQYXJ0Rm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFGb3JtYXRQYXJ0QmFzZS5fc3VwcG9ydGVkUGFydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIEZvcm1hdFBhcnRCYXNlLl9zdXBwb3J0ZWRQYXJ0Rm9ybWF0ID0gW1wiQ29uZGl0aW9uRm9ybWF0UGFydFwiLCBcIkNvbG9yRm9ybWF0UGFydFwiLCBcIkxvY2FsZUlERm9ybWF0UGFydFwiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBGb3JtYXRQYXJ0QmFzZS5fc3VwcG9ydGVkUGFydEZvcm1hdDtcbiAgICAgICAgfTtcblxuICAgICAgICBGb3JtYXRQYXJ0QmFzZS5DcmVhdGUgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIGlmIChDb25kaXRpb25Gb3JtYXRQYXJ0LkV2YWx1YXRlRm9ybWF0KHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29uZGl0aW9uRm9ybWF0UGFydCh0b2tlbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKERCTnVtYmVyRm9ybWF0UGFydC5FdmFsdWF0ZUZvcm1hdCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERCTnVtYmVyRm9ybWF0UGFydCh0b2tlbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKExvY2FsZUlERm9ybWF0UGFydC5FdmFsdWF0ZUZvcm1hdCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvY2FsZUlERm9ybWF0UGFydCh0b2tlbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKEFCU1RpbWVGb3JtYXRQYXJ0LkV2YWx1YXRlRm9ybWF0KHRva2VuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQUJTVGltZUZvcm1hdFBhcnQodG9rZW4pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChDb2xvckZvcm1hdFBhcnQuRXZhbHVhdGVGb3JtYXQodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvckZvcm1hdFBhcnQodG9rZW4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRm9ybWF0UGFydEJhc2U7XG4gICAgfSkoKTtcblxuICAgIC8vPC9lZGl0b3ItZm9sZD5cbiAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiQ29uZGl0aW9uRm9ybWF0UGFydFwiPlxuICAgIHZhciBDb25kaXRpb25Gb3JtYXRQYXJ0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENvbmRpdGlvbkZvcm1hdFBhcnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIENvbmRpdGlvbkZvcm1hdFBhcnQodG9rZW4pIHtcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHRva2VuKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIEZvcm1hdFBhcnRCYXNlLmNhbGwoc2VsZiwgdG9rZW4pO1xuXG4gICAgICAgICAgICBzZWxmLl9jbGFzc05hbWVzLnB1c2goXCJDb25kaXRpb25Gb3JtYXRQYXJ0XCIpO1xuICAgICAgICAgICAgc2VsZi5faW5pdEZpbGVkcygpO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IERlZmF1bHRUb2tlbnMuVHJpbVNxdWFyZUJyYWNrZXQodG9rZW4pO1xuICAgICAgICAgICAgaWYgKHN0cmluZ0V4LklzTnVsbE9yRW1wdHkoY29udGVudCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Ub2tlbklsbGVnYWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdG9rZW5CdWlsZGVyID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgICAgICB2YXIgYyA9IGtleXdvcmRfbnVsbDtcblxuICAgICAgICAgICAgZm9yICg7IGluZGV4IDwgY29udGVudC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjID0gY29udGVudFtpbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKERlZmF1bHRUb2tlbnMuSXNPcGVyYXRvcihjKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbkJ1aWxkZXIgKz0gYztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdG9rZW5CdWlsZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHN0ckNvbXBhcmVPcGVyYXRvciA9IHRva2VuQnVpbGRlcjtcbiAgICAgICAgICAgIHRva2VuQnVpbGRlciA9IFwiXCI7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0ckNvbXBhcmVPcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgXCI8XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gNCAvKiBMZXNzVGhhbiAqLztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIjw9XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gNSAvKiBMZXNzVGhhbk9yRXF1YWxzVG8gKi87XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gMCAvKiBFcXVhbHNUbyAqLztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIj49XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gMyAvKiBHcmVhdGVyVGhhbk9yRXF1YWxzVG8gKi87XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gMiAvKiBHcmVhdGVyVGhhbiAqLztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIjw+XCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGFyZU9wZXJhdG9yID0gMSAvKiBOb3RFcXVhbHNUbyAqLztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICg7IGluZGV4IDwgY29udGVudC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjID0gY29udGVudFtpbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKERlZmF1bHRUb2tlbnMuSXNPcGVyYXRvcihjKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Ub2tlbklsbGVnYWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRva2VuQnVpbGRlciArPSBjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRva2VuQnVpbGRlcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1Rva2VuSWxsZWdhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJWYWx1ZU51bWJlciA9IHRva2VuQnVpbGRlcjtcbiAgICAgICAgICAgIHZhciB0ZW1wVmFsdWUgPSBwYXJzZUZsb2F0KHN0clZhbHVlTnVtYmVyKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4odGVtcFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSB0ZW1wVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1Rva2VuSWxsZWdhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2ZQcm90b3R5cGUgPSBDb25kaXRpb25Gb3JtYXRQYXJ0LnByb3RvdHlwZTtcblxuICAgICAgICBjZlByb3RvdHlwZS5faW5pdEZpbGVkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAwLjA7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVPcGVyYXRvciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS5Db21wYXJlT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wYXJlT3BlcmF0b3I7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBjZlByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzYiA9IFwiXCI7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY29tcGFyZU9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwIC8qIEVxdWFsc1RvICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICBzYiArPSAoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDIgLyogR3JlYXRlclRoYW4gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IChcIj5cIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBHcmVhdGVyVGhhbk9yRXF1YWxzVG8gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IChcIj49XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQgLyogTGVzc1RoYW4gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IChcIjxcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNSAvKiBMZXNzVGhhbk9yRXF1YWxzVG8gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IChcIjw9XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEgLyogTm90RXF1YWxzVG8gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHNiICs9IChcIjw+XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2IgKz0gKHRoaXMudmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gRGVmYXVsdFRva2Vucy5BZGRTcXVhcmVCcmFja2V0KHNiKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuSXNNZWV0Q29uZGl0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzd2l0Y2ggKHNlbGYuY29tcGFyZU9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwIC8qIEVxdWFsc1RvICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IHNlbGYudmFsdWU7XG4gICAgICAgICAgICAgICAgY2FzZSAyIC8qIEdyZWF0ZXJUaGFuICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPiBzZWxmLnZhbHVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBHcmVhdGVyVGhhbk9yRXF1YWxzVG8gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA+PSBzZWxmLnZhbHVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNCAvKiBMZXNzVGhhbiAqL1xuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIDwgc2VsZi52YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDUgLyogTGVzc1RoYW5PckVxdWFsc1RvICovXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPD0gc2VsZi52YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDEgLyogTm90RXF1YWxzVG8gKi9cbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gc2VsZi52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIENvbmRpdGlvbkZvcm1hdFBhcnQuRXZhbHVhdGVGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIGlmICghdG9rZW4gfHwgdG9rZW4gPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IERlZmF1bHRUb2tlbnMuVHJpbVNxdWFyZUJyYWNrZXQodG9rZW4pO1xuXG4gICAgICAgICAgICBpZiAoIWNvbnRlbnQgfHwgY29udGVudCA9PT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLklzT3BlcmF0b3IoY29udGVudFswXSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDb25kaXRpb25Gb3JtYXRQYXJ0O1xuICAgIH0pKEZvcm1hdFBhcnRCYXNlKTtcblxuICAgIC8vPC9lZGl0b3ItZm9sZD5cbiAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiQ29sb3JGb3JtYXRQYXJ0XCI+XG4gICAgdmFyIENvbG9yRm9ybWF0UGFydCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhDb2xvckZvcm1hdFBhcnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIENvbG9yRm9ybWF0UGFydCh0b2tlbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgc2VsZi5mb3JlQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICBzZWxmLmluZGV4ID0gLTE7XG4gICAgICAgICAgICBzZWxmLmNvbG9yTmFtZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIEZvcm1hdFBhcnRCYXNlLmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgc2VsZi5fY2xhc3NOYW1lcy5wdXNoKFwiQ29sb3JGb3JtYXRQYXJ0XCIpO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IERlZmF1bHRUb2tlbnMuVHJpbVNxdWFyZUJyYWNrZXQodG9rZW4pO1xuICAgICAgICAgICAgaWYgKCFjb250ZW50IHx8IGNvbnRlbnQgPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdmFyIHQgPSBGb3JtYXR0ZXJDb2xvckhlbHBlci5Gcm9tU3RyaW5nVmFsdWUoY29udGVudCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgIGlmICh0KVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgc2VsZi5mb3JlQ29sb3IgPSB0O1xuICAgICAgICAgICAgICAgIHNlbGYuZm9yZUNvbG9yID0gY29udGVudDtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbG9yTmFtZSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcGFyc2UgYnkgY29sb3IgaW5kZXhcbiAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCA+IFwiQ29sb3JcIi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShjb250ZW50LCAwLCBcIkNvbG9yXCIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcEluZGV4ID0gcGFyc2VJbnQoY29udGVudCwgMTApO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4odGVtcEluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHRlbXBJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDEgJiYgaW5kZXggPD0gNTYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdG9kb1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgc2VsZi5mb3JlQ29sb3IgPSBGb3JtYXR0ZXJDb2xvckhlbHBlci5Db2xvckZyb21JbmRleChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBzZWxmLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1Rva2VuSWxsZWdhbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3BQcm90b3R5cGUgPSBDb2xvckZvcm1hdFBhcnQucHJvdG90eXBlO1xuXG4gICAgICAgIGNwUHJvdG90eXBlLkZvcmVDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcmVDb2xvcjtcbiAgICAgICAgfTtcblxuICAgICAgICBjcFByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRGVmYXVsdFRva2Vucy5BZGRTcXVhcmVCcmFja2V0KFwiQ29sb3JcIiArIHNlbGYuaW5kZXgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmNvbG9yTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLkFkZFNxdWFyZUJyYWNrZXQoc2VsZi5jb2xvck5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBDb2xvckZvcm1hdFBhcnQuRXZhbHVhdGVGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIGlmICghdG9rZW4gfHwgdG9rZW4gPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IERlZmF1bHRUb2tlbnMuVHJpbVNxdWFyZUJyYWNrZXQodG9rZW4pO1xuXG4gICAgICAgICAgICBpZiAoIWNvbnRlbnQgfHwgY29udGVudCA9PT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNOYU4odG9rZW5bdG9rZW4ubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5TdGFydHNXaXRoKHRva2VuLCBcIkNvbG9yXCIsIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuWzBdICE9PSB0b2tlblsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIENvbG9yRm9ybWF0UGFydDtcbiAgICB9KShGb3JtYXRQYXJ0QmFzZSk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIkFCU1RpbWVGb3JtYXRQYXJ0XCI+XG4gICAgdmFyIEFCU1RpbWVGb3JtYXRQYXJ0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEFCU1RpbWVGb3JtYXRQYXJ0LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBBQlNUaW1lRm9ybWF0UGFydCh0b2tlbikge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgdG9rZW4pO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgRm9ybWF0UGFydEJhc2UuY2FsbChzZWxmLCB0b2tlbik7XG5cbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMucHVzaChcIkFCU1RpbWVGb3JtYXRQYXJ0XCIpO1xuICAgICAgICAgICAgc2VsZi5faW5pdEZpbGVkcygpO1xuXG4gICAgICAgICAgICBpZiAoQUJTVGltZUZvcm1hdFBhcnQuRXZhbHVhdGVGb3JtYXQodG9rZW4pKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2tlbiA9IHRva2VuLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudG9rZW5bMV0gPT09IEFCU1RpbWVGb3JtYXRQYXJ0LkhvdXJzQUJTQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnR5cGUgPSAwIC8qIEhvdXIgKi87XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnRva2VuWzFdID09PSBBQlNUaW1lRm9ybWF0UGFydC5NaW51dGVBQlNDb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudHlwZSA9IDEgLyogTWludXRlICovO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi50b2tlblsxXSA9PT0gQUJTVGltZUZvcm1hdFBhcnQuU2Vjb25kQUJTQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnR5cGUgPSAyIC8qIFNlY29uZCAqLztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Ub2tlbklsbGVnYWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNiID0gXCJcIjtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgc2VsZi50b2tlbi5sZW5ndGggLSAyOyBuKyspIHtcbiAgICAgICAgICAgICAgICBzYiArPSAoXCIwXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmZvcm1hdFN0cmluZyA9IHNiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFwUHJvdG90eXBlID0gQUJTVGltZUZvcm1hdFBhcnQucHJvdG90eXBlO1xuXG4gICAgICAgIGFwUHJvdG90eXBlLl9pbml0RmlsZWRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy50b2tlbiA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0U3RyaW5nID0ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFwUHJvdG90eXBlLkZvcm1hdFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFN0cmluZztcbiAgICAgICAgfTtcblxuICAgICAgICBhcFByb3RvdHlwZS5UaW1lUGFydFR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50eXBlO1xuICAgICAgICB9O1xuICAgICAgICBhcFByb3RvdHlwZS5Ub2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRva2VuO1xuICAgICAgICB9O1xuXG4gICAgICAgIEFCU1RpbWVGb3JtYXRQYXJ0LkV2YWx1YXRlRm9ybWF0ID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICBpZiAoIXRva2VuIHx8IHRva2VuID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBEZWZhdWx0VG9rZW5zLlRyaW1TcXVhcmVCcmFja2V0KHRva2VuKTtcblxuICAgICAgICAgICAgaWYgKCFjb250ZW50IHx8IGNvbnRlbnQgPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIGMgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGNvbnRlbnQubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIWMpIHtcbiAgICAgICAgICAgICAgICAgICAgYyA9IGNvbnRlbnRbbl07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZwID0gQUJTVGltZUZvcm1hdFBhcnQ7XG4gICAgICAgICAgICAgICAgaWYgKGMgIT09IGZwLkhvdXJzQUJTQ29udGVudCAmJiBjICE9PSBmcC5NaW51dGVBQlNDb250ZW50ICYmIGMgIT09IGZwLlNlY29uZEFCU0NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjICE9PSBjb250ZW50W25dKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBBQlNUaW1lRm9ybWF0UGFydC5Ib3Vyc0FCU0NvbnRlbnQgPSBcImhcIjtcbiAgICAgICAgQUJTVGltZUZvcm1hdFBhcnQuTWludXRlQUJTQ29udGVudCA9IFwibVwiO1xuICAgICAgICBBQlNUaW1lRm9ybWF0UGFydC5TZWNvbmRBQlNDb250ZW50ID0gXCJzXCI7XG4gICAgICAgIHJldHVybiBBQlNUaW1lRm9ybWF0UGFydDtcbiAgICB9KShGb3JtYXRQYXJ0QmFzZSk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIkRCTnVtYmVyXCI+XG4gICAgdmFyIERCTnVtYmVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gREJOdW1iZXIodW5pdHMsIG51bWJlcnMpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMgPSBbXCJEQk51bWJlclwiXTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXl3b3JkX251bGwsIHUgPSBrZXl3b3JkX251bGw7XG5cbiAgICAgICAgICAgIGlmICh1bml0cykge1xuICAgICAgICAgICAgICAgIHNlbGYudW5pdHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHUgPSB1bml0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudW5pdHMucHVzaChzdHJpbmdFeC5FbXB0eSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVuaXRzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSh1KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5udW1iZXJzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHUgPSBudW1iZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5udW1iZXJzLnB1c2goc3RyaW5nRXguRW1wdHkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5udW1iZXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSh1KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBEQk51bWJlci5KYXBhbmVzZURCTnVtMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghREJOdW1iZXIuamFwYW5lc2VEQk51bTEpIHtcbiAgICAgICAgICAgICAgICBEQk51bWJlci5qYXBhbmVzZURCTnVtMSA9IG5ldyBEQk51bWJlcihEQk51bWJlci5KYXBhbmVzZU51bWJlclVuaXRMZXR0ZXIxLCBEQk51bWJlci5KYXBhbmVzZU51bWJlckxldHRlclZhbHVlczEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIERCTnVtYmVyLmphcGFuZXNlREJOdW0xO1xuICAgICAgICB9O1xuXG4gICAgICAgIERCTnVtYmVyLkphcGFuZXNlREJOdW0yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFEQk51bWJlci5qYXBhbmVzZURCTnVtMikge1xuICAgICAgICAgICAgICAgIERCTnVtYmVyLmphcGFuZXNlREJOdW0yID0gbmV3IERCTnVtYmVyKERCTnVtYmVyLkphcGFuZXNlTnVtYmVyVW5pdExldHRlcjIsIERCTnVtYmVyLkphcGFuZXNlTnVtYmVyTGV0dGVyVmFsdWVzMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gREJOdW1iZXIuamFwYW5lc2VEQk51bTI7XG4gICAgICAgIH07XG5cbiAgICAgICAgREJOdW1iZXIuSmFwYW5lc2VEQk51bTMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIURCTnVtYmVyLmphcGFuZXNlREJOdW0zKSB7XG4gICAgICAgICAgICAgICAgREJOdW1iZXIuamFwYW5lc2VEQk51bTMgPSBuZXcgREJOdW1iZXIoa2V5d29yZF9udWxsLCBEQk51bWJlci5KYXBhbmVzZU51bWJlckxldHRlclZhbHVlczMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIERCTnVtYmVyLmphcGFuZXNlREJOdW0zO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vREJOdW1iZXIgUHVibGljIHByb3BlcnRpZXNcbiAgICAgICAgREJOdW1iZXIucHJvdG90eXBlLlVuaXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5pdHM7XG4gICAgICAgIH07XG4gICAgICAgIERCTnVtYmVyLnByb3RvdHlwZS5OdW1iZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVycztcbiAgICAgICAgfTtcbiAgICAgICAgREJOdW1iZXIuamFwYW5lc2VEQk51bTEgPSBrZXl3b3JkX251bGw7XG4gICAgICAgIERCTnVtYmVyLmphcGFuZXNlREJOdW0yID0ga2V5d29yZF9udWxsO1xuICAgICAgICBEQk51bWJlci5qYXBhbmVzZURCTnVtMyA9IGtleXdvcmRfbnVsbDtcblxuICAgICAgICBEQk51bWJlci5KYXBhbmVzZU51bWJlclVuaXRMZXR0ZXIxID0gWzB4NTM0MywgMHg3NjdlLCAweDUzNDEsIDB4NTE0NiwgMHg1MzQzLCAweDc2N2UsIDB4NTM0MSwgMHg1MTA0LCAweDUzNDMsIDB4NzY3ZSwgMHg1MzQxLCAweDRlMDcsIDB4NTM0MywgMHg3NjdlLCAweDUzNDEsIDB4MF07XG4gICAgICAgIERCTnVtYmVyLkphcGFuZXNlTnVtYmVyVW5pdExldHRlcjIgPSBbMHg5NjIxLCAweDc2N2UsIDB4NjJmZSwgMHg1MTQ2LCAweDk2MjEsIDB4NzY3ZSwgMHg2MmZlLCAweDUxMDQsIDB4OTYyMSwgMHg3NjdlLCAweDYyZmUsIDB4ODQyYywgMHg5NjIxLCAweDc2N2UsIDB4NjJmZSwgMHgwXTtcbiAgICAgICAgREJOdW1iZXIuSmFwYW5lc2VOdW1iZXJMZXR0ZXJWYWx1ZXMxID0gWzB4MzAwNywgMHg0ZTAwLCAweDRlOGMsIDB4NGUwOSwgMHg1NmRiLCAweDRlOTQsIDB4NTE2ZCwgMHg0ZTAzLCAweDUxNmIsIDB4NGU1ZF07XG4gICAgICAgIERCTnVtYmVyLkphcGFuZXNlTnVtYmVyTGV0dGVyVmFsdWVzMiA9IFsweDMwMDcsIDB4NThmMSwgMHg1ZjEwLCAweDUzYzIsIDB4NTZkYiwgMHg0ZjBkLCAweDUxNmQsIDB4NGUwMywgMHg1MTZiLCAweDRlNWRdO1xuICAgICAgICBEQk51bWJlci5KYXBhbmVzZU51bWJlckxldHRlclZhbHVlczMgPSBbMHhmZjEwLCAweGZmMTEsIDB4ZmYxMiwgMHhmZjEzLCAweGZmMTQsIDB4ZmYxNSwgMHhmZjE2LCAweGZmMTcsIDB4ZmYxOCwgMHhmZjE5XTtcbiAgICAgICAgcmV0dXJuIERCTnVtYmVyO1xuICAgIH0pKCk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgdmFyIERCTnVtYmVyRm9ybWF0UGFydCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEQk51bWJlckZvcm1hdFBhcnQsIF9zdXBlcik7XG4gICAgICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJEQk51bWJlckZvcm1hdFBhcnRcIj5cbiAgICAgICAgZnVuY3Rpb24gREJOdW1iZXJGb3JtYXRQYXJ0KHRva2VuKSB7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCB0b2tlbik7XG4gICAgICAgICAgICB0aGlzLnRva2VuID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gMDtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMucHVzaChcIkRCTnVtYmVyRm9ybWF0UGFydFwiKTtcblxuICAgICAgICAgICAgaWYgKERCTnVtYmVyRm9ybWF0UGFydC5FdmFsdWF0ZUZvcm1hdCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBEZWZhdWx0VG9rZW5zLlRyaW1TcXVhcmVCcmFja2V0KHRva2VuKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RyVHlwZSA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZW1vdmUoY29udGVudCwgMCwgXCJkYm51bVwiLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgc2VsZi50eXBlID0gcGFyc2VJbnQoc3RyVHlwZSwgMTApO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLnR5cGUgPCAwIHx8IHNlbGYudHlwZSA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1Rva2VuSWxsZWdhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbnBQcm90b3R5cGUgPSBEQk51bWJlckZvcm1hdFBhcnQucHJvdG90eXBlO1xuXG4gICAgICAgIG5wUHJvdG90eXBlLlRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0V4LkVtcHR5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2tlbjtcbiAgICAgICAgfTtcblxuICAgICAgICBucFByb3RvdHlwZS5UeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHlwZTtcbiAgICAgICAgfTtcblxuICAgICAgICBucFByb3RvdHlwZS5SZXBsYWNlTnVtYmVyU3RyaW5nID0gZnVuY3Rpb24gKHMsIGRiTnVtYmVyLCBpc051bWJlcikge1xuICAgICAgICAgICAgaWYgKCFzIHx8IHMgPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJEYXRhID0gcztcbiAgICAgICAgICAgIHZhciBzdHIgPSBzO1xuICAgICAgICAgICAgdmFyIGVuZCA9IC0xO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gLTE7XG4gICAgICAgICAgICB2YXIgaGFzUG9pbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHZhciByZXQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB2YXIgZm9ybWF0ZWROdW1iZXIgPSBrZXl3b3JkX251bGw7XG5cbiAgICAgICAgICAgIGZvciAodmFyIG4gPSBzLmxlbmd0aCAtIDE7IG4gPj0gMDsgbi0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzdHJbbl07XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihjKSB8fCAoRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhjLCBEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3IsIGZhbHNlKSAmJiAhaGFzUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChEZWZhdWx0VG9rZW5zLklzRXF1YWxzKGMsIERlZmF1bHRUb2tlbnMuRGVjaW1hbFNlcGFyYXRvciwgZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNQb2ludCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPiAtMSAmJiBlbmQgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBzdHIuc3Vic3RyKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGFyc2VGbG9hdCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHJldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRlZE51bWJlciA9IHRoaXMuTnVtYmVyU3RyaW5nKHRva2VuLCBkYk51bWJlciwgaXNOdW1iZXIpOyAvL051bWJlclN0cmluZyhyZXQsIGRiTnViZXIsIGlzTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJEYXRhID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShzdHJEYXRhLCBzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJEYXRhID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluc2VydChzdHJEYXRhLCBzdGFydCwgZm9ybWF0ZWROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNQb2ludCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RhcnQgPiAtMSAmJiBlbmQgPiAtMSkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gc3RyLnN1YnN0cihzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgICAgICAgICAgICAgICByZXQgPSBwYXJzZUZsb2F0KHRva2VuKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHJldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ZWROdW1iZXIgPSB0aGlzLk51bWJlclN0cmluZyh0b2tlbiwgZGJOdW1iZXIsIGlzTnVtYmVyKTsgLy8gTnVtYmVyU3RyaW5nKHJldCwgZGJOdWJlciwgaXNOdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBzdHJEYXRhID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShzdHJEYXRhLCBzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgc3RyRGF0YSA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbnNlcnQoc3RyRGF0YSwgc3RhcnQsIGZvcm1hdGVkTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlbmQgPSAtMTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgIGhhc1BvaW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdHJEYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5wUHJvdG90eXBlLk51bWJlclN0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSwgZGJOdW1iZXIsIGlzTnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgcGFydFZhbHVlcyA9IHZhbHVlLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiAocGFydFZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0VmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gREJOdW1iZXJGb3JtYXRQYXJ0LkZvcm1hdE51bWJlclN0cmluZyhwYXJ0VmFsdWVzWzBdLCBkYk51bWJlci5OdW1iZXJzKCksIGlzTnVtYmVyID8gZGJOdW1iZXIuVW5pdHMoKSA6IGtleXdvcmRfbnVsbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0VmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZWdlclN0cmluZyA9IERCTnVtYmVyRm9ybWF0UGFydC5Gb3JtYXROdW1iZXJTdHJpbmcocGFydFZhbHVlc1swXSwgZGJOdW1iZXIuTnVtYmVycygpLCBpc051bWJlciA/IGRiTnVtYmVyLlVuaXRzKCkgOiBrZXl3b3JkX251bGwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbFN0cmluZyA9IERCTnVtYmVyRm9ybWF0UGFydC5Gb3JtYXROdW1iZXJTdHJpbmcocGFydFZhbHVlc1sxXSwgZGJOdW1iZXIuTnVtYmVycygpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGludGVnZXJTdHJpbmcgKyBcIi5cIiArIGRlY2ltYWxTdHJpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9WYWx1ZUlsbGVnYWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5wUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMuQWRkU3F1YXJlQnJhY2tldChcIkRCTnVtXCIgKyB0aGlzLnR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBEQk51bWJlckZvcm1hdFBhcnQuRXZhbHVhdGVGb3JtYXQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIGlmICghdG9rZW4gfHwgdG9rZW4gPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IERlZmF1bHRUb2tlbnMuVHJpbVNxdWFyZUJyYWNrZXQodG9rZW4pO1xuXG4gICAgICAgICAgICBpZiAoIWNvbnRlbnQgfHwgY29udGVudCA9PT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuU3RhcnRzV2l0aChjb250ZW50LCBcIkRCTnVtXCIsIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgREJOdW1iZXJGb3JtYXRQYXJ0LkZvcm1hdE51bWJlclN0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSwgbnVtYmVycywgdW5pdHMpIHtcbiAgICAgICAgICAgIHZhciBzdHJWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgICAgdmFyIGMgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB2YXIgbkMgPSAwO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHZhciBzYiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yIChuID0gMDsgbiA8IHN0clZhbHVlLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGMgPSBzdHJWYWx1ZS5zdWJzdHIobiwgMSk7XG4gICAgICAgICAgICAgICAgICAgIG5DID0gcGFyc2VJbnQoYywgMTApO1xuICAgICAgICAgICAgICAgICAgICBzYiArPSAobnVtYmVyc1tuQ10pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzYjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGlmICghdW5pdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERCTnVtYmVyRm9ybWF0UGFydC5Gb3JtYXROdW1iZXJTdHJpbmcodmFsdWUsIG51bWJlcnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB6ZXJvQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBtYXhMZW5ndGggPSBzdHJWYWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGluWmVybyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBudW1iZXJMZXR0ZXIgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKG4gPSAwOyBuIDwgbWF4TGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbGlkQ2hhckluZGV4ID0gdW5pdHMubGVuZ3RoIC0gMSAtIG47XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZENoYXJJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJMZXR0ZXIucHVzaCh1bml0c1t2YWxpZENoYXJJbmRleF0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJMZXR0ZXIucHVzaChzdHJpbmdFeC5FbXB0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRtcExldHRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gbnVtYmVyTGV0dGVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcExldHRlcnNbbnVtYmVyTGV0dGVyLmxlbmd0aCAtIGkgLSAxXSA9IG51bWJlckxldHRlcltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbnVtYmVyTGV0dGVyID0gdG1wTGV0dGVycztcbiAgICAgICAgICAgICAgICB2YXIgaXNaZXJvQWNjZXB0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYyA9IHN0clZhbHVlLnN1YnN0cihpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgbkMgPSBwYXJzZUludChjLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaDEgPSBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoMiA9IHN0cmluZ0V4LkVtcHR5O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggLSBpIC0gMTYgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBudW1iZXJzW25DXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoMiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1plcm9BY2NlcHRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpICE9PSAobWF4TGVuZ3RoIC0gMSkgJiYgaSAhPT0gKG1heExlbmd0aCAtIDUpICYmIGkgIT09IChtYXhMZW5ndGggLSA5KSAmJiBpICE9PSAobWF4TGVuZ3RoIC0gMTMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoMiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgemVyb0NvdW50ID0gemVyb0NvdW50ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgIT09IFwiMFwiICYmIHplcm9Db3VudCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBudW1iZXJzWzBdICsgbnVtYmVyc1tuQ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoMiA9IG51bWJlckxldHRlcltpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgemVyb0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBudW1iZXJzW25DXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2gyID0gbnVtYmVyTGV0dGVyW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6ZXJvQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjICE9PSBcIjBcIiAmJiB6ZXJvQ291bnQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBudW1iZXJzWzBdICsgbnVtYmVyc1tuQ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2gyID0gbnVtYmVyTGV0dGVyW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHplcm9Db3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYyAhPT0gXCIwXCIgJiYgemVyb0NvdW50ID09PSAwKSB8fCBpc1plcm9BY2NlcHRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoMSA9IG51bWJlcnNbbkNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDIgPSBudW1iZXJMZXR0ZXJbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHplcm9Db3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzWmVyb0FjY2VwdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIwXCIgJiYgemVyb0NvdW50ID49IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoMSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgemVyb0NvdW50ID0gemVyb0NvdW50ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhMZW5ndGggPj0gMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaDEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHplcm9Db3VudCA9IHplcm9Db3VudCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoMSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2gyID0gbnVtYmVyTGV0dGVyW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHplcm9Db3VudCA9IHplcm9Db3VudCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNaZXJvID0gKGNoMSArIGNoMikgPT09IHN0cmluZ0V4LkVtcHR5O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzWmVybykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5aZXJvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gKG1heExlbmd0aCAtIDEzKSAmJiAhaW5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaDIgPSBudW1iZXJMZXR0ZXJbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpblplcm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IChtYXhMZW5ndGggLSA5KSAmJiAhaW5aZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaDIgPSBudW1iZXJMZXR0ZXJbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpblplcm8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IChtYXhMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2gyID0gbnVtYmVyTGV0dGVyW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5aZXJvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIGNoMSArIGNoMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgaVZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlWYWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcnNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gREJOdW1iZXJGb3JtYXRQYXJ0O1xuICAgIH0pKEZvcm1hdFBhcnRCYXNlKTtcblxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJOdW1iZXJIZWxwZXJcIj5cbiAgICB2YXIgTnVtYmVySGVscGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gTnVtYmVySGVscGVyKCkge1xuICAgICAgICB9XG5cbiAgICAgICAgTnVtYmVySGVscGVyLlBhcnNlSGV4U3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgaWYgKCFzdHIgfHwgc3RyID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1N0cmluZ0lsbGVnYWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoc3RyLCAxNik7XG4gICAgICAgIH07XG4gICAgICAgIE51bWJlckhlbHBlci5GaXhKYXBhbmVzZUNoYXJzID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9O1xuICAgICAgICBOdW1iZXJIZWxwZXIuR2V0RnJhY3Rpb24gPSBmdW5jdGlvbiAodmFsdWUsIGRlbm9taW5hdG9yRGlnaXRzLCBvdXRfaW50ZWdlciwgb3V0X251bWVyYXRvciwgb3V0X2Rlbm9taW5hdG9yKSB7XG4gICAgICAgICAgICB2YXIgaW50ZWdlciA9IDA7XG4gICAgICAgICAgICB2YXIgbnVtZXJhdG9yID0gMDtcbiAgICAgICAgICAgIHZhciBkZW5vbWluYXRvciA9IDA7XG4gICAgICAgICAgICB2YXIgZGVjaW1hbFZhbHVlID0gMDtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcbiAgICAgICAgICAgICAgICBkZWNpbWFsVmFsdWUgPSB2YWx1ZSAtIE1hdGhfY2VpbCh2YWx1ZSkgKyAxLjA7XG4gICAgICAgICAgICAgICAgaWYgKGRlY2ltYWxWYWx1ZSA9PSAxLjApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVjaW1hbFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaW50ZWdlciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBpbnRlZ2VyID0gTWF0aF9jZWlsKHZhbHVlKSAtIDEuMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCAwKSB7XG4gICAgICAgICAgICAgICAgaW50ZWdlciA9IE1hdGhfY2VpbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZGVjaW1hbFZhbHVlID0gTWF0aF9jZWlsKHZhbHVlKSAtIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWluID0gMjtcbiAgICAgICAgICAgIHZhciBtYXggPSA5O1xuICAgICAgICAgICAgbWluID0gTWF0aF9wb3coMTAsIGRlbm9taW5hdG9yRGlnaXRzIC0gMSk7XG4gICAgICAgICAgICBtYXggPSBNYXRoX3BvdygxMCwgZGVub21pbmF0b3JEaWdpdHMpIC0gMTtcbiAgICAgICAgICAgIGlmIChtaW4gPCAyKVxuICAgICAgICAgICAgICAgIG1pbiA9IDI7XG4gICAgICAgICAgICBpZiAobWF4IDwgMilcbiAgICAgICAgICAgICAgICBtYXggPSAyO1xuICAgICAgICAgICAgdmFyIGlzVmFsdWVTZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBsYXN0VHJpZWRWYWx1ZSA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gbWluOyBuIDw9IG1heDsgbisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlVGVtcCA9IG4gKiBkZWNpbWFsVmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlSW50ZWdlclRlbXAgPSBNYXRoX3JvdW5kKHZhbHVlVGVtcCk7XG4gICAgICAgICAgICAgICAgdmFyIHRyaWVkVmFsdWUgPSB2YWx1ZUludGVnZXJUZW1wIC8gbjtcbiAgICAgICAgICAgICAgICB2YXIgZGV2aWF0aW9uID0gTWF0aF9hYnModHJpZWRWYWx1ZSAtIGRlY2ltYWxWYWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsdWVTZXQgPyBkZXZpYXRpb24gPCBNYXRoX2FicyhsYXN0VHJpZWRWYWx1ZSAtIGRlY2ltYWxWYWx1ZSkgOiB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsdWVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsYXN0VHJpZWRWYWx1ZSA9IHRyaWVkVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG51bWVyYXRvciA9IHZhbHVlSW50ZWdlclRlbXA7XG4gICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yID0gbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRldmlhdGlvbiA8IDAuMDAwNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXRfaW50ZWdlci52YWx1ZSA9IGludGVnZXI7XG4gICAgICAgICAgICBvdXRfbnVtZXJhdG9yLnZhbHVlID0gbnVtZXJhdG9yO1xuICAgICAgICAgICAgb3V0X2Rlbm9taW5hdG9yLnZhbHVlID0gZGVub21pbmF0b3I7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWx1ZVNldDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIE51bWJlckhlbHBlcjtcbiAgICB9KSgpO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJDdWx0dXJlSGVscGVyXCI+XG4gICAgdmFyIEN1bHR1cmVIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBDdWx0dXJlSGVscGVyKCkge1xuICAgICAgICB9XG5cbiAgICAgICAgQ3VsdHVyZUhlbHBlci5BbGxvd1NjaWVuY2UgPSBmdW5jdGlvbiAoY3VsdHVyZU5hbWUpIHtcbiAgICAgICAgICAgIGlmIChjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIShjdWx0dXJlTmFtZS5pbmRleE9mKFwiamFcIikgPT09IDApICYmICEoY3VsdHVyZU5hbWUuaW5kZXhPZihcInpoXCIpID09PSAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBDdWx0dXJlSGVscGVyLkNyZWF0ZUN1bHR1cmVJbmZvID0gZnVuY3Rpb24gKGN1bHR1cmVJRCkge1xuICAgICAgICAgICAgc3dpdGNoIChjdWx0dXJlSUQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDB4MDQwOTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uZ2V0Q3VsdHVyZShDdWx0dXJlSGVscGVyLkVuZ2xpc2hVbml0ZWRTdGF0ZXMpO1xuICAgICAgICAgICAgICAgIGNhc2UgMHgwNDExOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5nZXRDdWx0dXJlKEN1bHR1cmVIZWxwZXIuSmFwYW5uZXNlSmFwYW4pO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLmN1cnJlbnRDdWx0dXJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEN1bHR1cmVIZWxwZXIuSmFwYW5uZXNlSmFwYW4gPSBcImphLUpQXCI7XG4gICAgICAgIEN1bHR1cmVIZWxwZXIuRW5nbGlzaFVuaXRlZFN0YXRlcyA9IFwiZW4tVVNcIjtcbiAgICAgICAgcmV0dXJuIEN1bHR1cmVIZWxwZXI7XG4gICAgfSkoKTtcblxuICAgIC8vPC9lZGl0b3ItZm9sZD5cbiAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiTG9jYWxlSURGb3JtYXRQYXJ0XCI+XG4gICAgdmFyIExvY2FsZUlERm9ybWF0UGFydCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhMb2NhbGVJREZvcm1hdFBhcnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIExvY2FsZUlERm9ybWF0UGFydCh0b2tlbikge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwoc2VsZiwgdG9rZW4pO1xuICAgICAgICAgICAgc2VsZi5jdXJyZW5jeVN5bWJvbCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYubG9jYXRlSUQgPSAtMTtcbiAgICAgICAgICAgIHNlbGYuY3VsdHVyZUluZm8gPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmNvbnRlbnQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBGb3JtYXRQYXJ0QmFzZS5jYWxsKHNlbGYsIHRva2VuKTtcblxuICAgICAgICAgICAgc2VsZi5fY2xhc3NOYW1lcy5wdXNoKFwiTG9jYWxlSURGb3JtYXRQYXJ0XCIpO1xuXG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5Jc051bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5jb250ZW50ID0gRGVmYXVsdFRva2Vucy5UcmltU3F1YXJlQnJhY2tldCh0b2tlbik7XG4gICAgICAgICAgICB2YXIgY29udGVudFRlbXAgPSBzZWxmLmNvbnRlbnQ7XG4gICAgICAgICAgICBpZiAoIWNvbnRlbnRUZW1wIHx8IGNvbnRlbnRUZW1wID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX1Rva2VuSWxsZWdhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBBU0NJSV9ET0xMQVJfU0lHTlxuICAgICAgICAgICAgaWYgKERlZmF1bHRUb2tlbnMuSXNFcXVhbHMoY29udGVudFRlbXBbMF0sIERlZmF1bHRUb2tlbnMuRG9sbGFyLCBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50VGVtcCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZW1vdmUoY29udGVudFRlbXAsIDAsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Ub2tlbklsbGVnYWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgVVRGMTYtQU5ZXG4gICAgICAgICAgICB2YXIgbWludXMgPSBjb250ZW50VGVtcC5pbmRleE9mKERlZmF1bHRUb2tlbnMuSHlwaGVuTWludXMpO1xuICAgICAgICAgICAgaWYgKG1pbnVzID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbmN5U3ltYm9sID0gY29udGVudFRlbXAuc3Vic3RyKDAsIG1pbnVzKTtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB1dGYxNmFueVxuICAgICAgICAgICAgICAgIGNvbnRlbnRUZW1wID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShjb250ZW50VGVtcCwgMCwgbWludXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbmN5U3ltYm9sID0gY29udGVudFRlbXA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgQVNDSUktSFlQSEVOLU1JTlVTXG4gICAgICAgICAgICBpZiAoRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhjb250ZW50VGVtcFswXSwgRGVmYXVsdFRva2Vucy5IeXBoZW5NaW51cywgZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgY29udGVudFRlbXAgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVtb3ZlKGNvbnRlbnRUZW1wLCAwLCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGdsb2JhbGl6ZS5TdHJpbmdSZXNvdXJlcy5TUi5FeHBfVG9rZW5JbGxlZ2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IDMqOEFTQ0lJLURJR0lULUhFWEFERUNJTUFMXG4gICAgICAgICAgICBpZiAoY29udGVudFRlbXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYubG9jYXRlSUQgPSBOdW1iZXJIZWxwZXIuUGFyc2VIZXhTdHJpbmcoY29udGVudFRlbXApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Ub2tlbklsbGVnYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxwUHJvdG90eXBlID0gTG9jYWxlSURGb3JtYXRQYXJ0LnByb3RvdHlwZTtcblxuICAgICAgICBscFByb3RvdHlwZS5DdWx0dXJlSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5jdWx0dXJlSW5mbykge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VsdHVyZUluZm8gPSBDdWx0dXJlSGVscGVyLkNyZWF0ZUN1bHR1cmVJbmZvKHNlbGYubG9jYXRlSUQpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmN1cnJlbmN5U3ltYm9sICYmIHNlbGYuY3VycmVuY3lTeW1ib2wgIT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmN1bHR1cmVJbmZvICYmICFzZWxmLmN1bHR1cmVJbmZvLk51bWJlckZvcm1hdCgpLmlzUmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VsdHVyZUluZm8uTnVtYmVyRm9ybWF0KCkuY3VycmVuY3lTeW1ib2wgPSBzZWxmLmN1cnJlbmN5U3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY3VsdHVyZUluZm87XG4gICAgICAgIH07XG5cbiAgICAgICAgbHBQcm90b3R5cGUuQ3VycmVuY3lTeW1ib2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW5jeVN5bWJvbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkVuY29kZVN5bWJvbChzZWxmLmN1cnJlbmN5U3ltYm9sKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0V4LkVtcHR5O1xuICAgICAgICB9O1xuXG4gICAgICAgIGxwUHJvdG90eXBlLkFsbG93U2NpZW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmN1bHR1cmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEN1bHR1cmVIZWxwZXIuQWxsb3dTY2llbmNlKHNlbGYuY3VsdHVyZUluZm8uTmFtZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBscFByb3RvdHlwZS5HZXREQk51bWJlciA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICB2YXIgcmVnaW9uSUQgPSB0aGlzLmxvY2F0ZUlEICYgMHgwMGZmO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHJlZ2lvbklEKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAweDExOlxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREJOdW1iZXIuSmFwYW5lc2VEQk51bTEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREJOdW1iZXIuSmFwYW5lc2VEQk51bTIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gREJOdW1iZXIuSmFwYW5lc2VEQk51bTMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxwUHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLkFkZFNxdWFyZUJyYWNrZXQodGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0V4LkVtcHR5O1xuICAgICAgICB9O1xuXG4gICAgICAgIGxwUHJvdG90eXBlLkVuY29kZVN5bWJvbCA9IGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShzeW1ib2wsIFwiXFxcXC5cIiwgXCInLidcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgTG9jYWxlSURGb3JtYXRQYXJ0LkV2YWx1YXRlRm9ybWF0ID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICBpZiAoIXRva2VuIHx8IHRva2VuID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBEZWZhdWx0VG9rZW5zLlRyaW1TcXVhcmVCcmFja2V0KHRva2VuKTtcblxuICAgICAgICAgICAgaWYgKCFjb250ZW50IHx8IGNvbnRlbnQgPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhjb250ZW50WzBdLCBEZWZhdWx0VG9rZW5zLkRvbGxhciwgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gTG9jYWxlSURGb3JtYXRQYXJ0O1xuICAgIH0pKEZvcm1hdFBhcnRCYXNlKTtcblxuICAgIHZhciBEZWZhdWx0RGF0ZVRpbWVOdW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBEZWZhdWx0RGF0ZVRpbWVOdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKSB7XG4gICAgICAgIH1cblxuICAgICAgICBEZWZhdWx0RGF0ZVRpbWVOdW1iZXJTdHJpbmdDb252ZXJ0ZXIucHJvdG90eXBlLkNvbnZlcnRUbyA9IGZ1bmN0aW9uIChudW0sIHZhbHVlLCBpc0dlbmVyYWxOdW1iZXIsIGxvY2FsZSwgZGJOdW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBzdHJUZW1wID0gbnVtO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSAhPSBrZXl3b3JkX251bGwgJiYgZGJOdW1iZXIgIT0ga2V5d29yZF9udWxsICYmIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBkYk51bWJlclRlbXAgPSBsb2NhbGUuR2V0REJOdW1iZXIoZGJOdW1iZXIuVHlwZSgpKTtcbiAgICAgICAgICAgICAgICBzdHJUZW1wID0gZGJOdW1iZXIuUmVwbGFjZU51bWJlclN0cmluZyhzdHJUZW1wLCBkYk51bWJlclRlbXAsIHRydWUpO1xuICAgICAgICAgICAgICAgIHN0clRlbXAgPSBzdHJUZW1wLnJlcGxhY2UoRGVmYXVsdFRva2Vucy5SZXBsYWNlUGxhY2Vob2xkZXIgKyBOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyRm91ckRpZ2l0LCBuZXcgZm9ybWF0dGVyVXRpbHMuX0RhdGVUaW1lSGVscGVyKHZhbHVlKS5sb2NhbGVGb3JtYXQoTnVtYmVyRm9ybWF0RGF0ZVRpbWUuWWVhckZvdXJEaWdpdCkpO1xuICAgICAgICAgICAgICAgIHN0clRlbXAgPSBzdHJUZW1wLnJlcGxhY2UoRGVmYXVsdFRva2Vucy5SZXBsYWNlUGxhY2Vob2xkZXIgKyBOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyVHdvRGlnaXQsIG5ldyBmb3JtYXR0ZXJVdGlscy5fRGF0ZVRpbWVIZWxwZXIodmFsdWUpLmxvY2FsZUZvcm1hdChOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyVHdvRGlnaXQpKTtcbiAgICAgICAgICAgICAgICBzdHJUZW1wID0gZGJOdW1iZXIuUmVwbGFjZU51bWJlclN0cmluZyhzdHJUZW1wLCBkYk51bWJlclRlbXAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHJUZW1wO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRGVmYXVsdERhdGVUaW1lTnVtYmVyU3RyaW5nQ29udmVydGVyO1xuICAgIH0pKCk7XG5cbiAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiTnVtYmVyRm9ybWF0RGF0ZVRpbWVcIj5cbiAgICB2YXIgTnVtYmVyRm9ybWF0RGF0ZVRpbWUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoTnVtYmVyRm9ybWF0RGF0ZVRpbWUsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIE51bWJlckZvcm1hdERhdGVUaW1lKGZvcm1hdCwgYWJzVGltZVBhcnRzLCBwYXJ0TG9jYWxlSUQsIGRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHNlbGYsIHBhcnRMb2NhbGVJRCwgZGJOdW1iZXJGb3JtYXRQYXJ0LCBjdWx0dXJlTmFtZSk7XG4gICAgICAgICAgICBzZWxmLmJhc2VOdW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSBOdW1iZXJGb3JtYXRCYXNlLnByb3RvdHlwZS5OdW1iZXJTdHJpbmdDb252ZXJ0ZXI7XG4gICAgICAgICAgICBzZWxmLmJhc2VEYXRlVGltZUZvcm1hdEluZm8gPSBOdW1iZXJGb3JtYXRCYXNlLnByb3RvdHlwZS5EYXRlVGltZUZvcm1hdEluZm87XG4gICAgICAgICAgICBzZWxmLmJhc2VDdWx0dXJlTmFtZSA9IE51bWJlckZvcm1hdEJhc2UucHJvdG90eXBlLkN1bHR1cmVOYW1lO1xuICAgICAgICAgICAgc2VsZi52YWxpZERhdGVUaW1lRm9ybWF0U3RyaW5nID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5mb3JtYXRTdHJpbmcgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmhhc0pEID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmFic29sdXRlVGltZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuYWJzVGltZVBhcnRzID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5oYXNZZWFyRGVsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuZXhhY3RseU1hdGNoID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMucHVzaChcIk51bWJlckZvcm1hdERhdGVUaW1lXCIpO1xuXG4gICAgICAgICAgICBzZWxmLmV4YWN0bHlNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5mb3JtYXRTdHJpbmcgPSBzZWxmLkZpeEZvcm1hdChOdW1iZXJGb3JtYXRCYXNlLlRyaW1Ob3RTdXBwb3J0U3ltYm9sKGZvcm1hdCkpO1xuICAgICAgICAgICAgc2VsZi5hYnNUaW1lUGFydHMgPSBhYnNUaW1lUGFydHM7XG4gICAgICAgICAgICBzZWxmLl9pbml0KGZvcm1hdCwgYWJzVGltZVBhcnRzLCBwYXJ0TG9jYWxlSUQsIGRiTnVtYmVyRm9ybWF0UGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL051bWJlckZvcm1hdERhdGVUaW1lIHN0YXRpYyBNZXRob2RzXG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLkV2YWx1YXRlRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlckZvcm1hdEJhc2UuQ29udGFpbnNLZXl3b3Jkcyhmb3JtYXQsIE51bWJlckZvcm1hdERhdGVUaW1lLmtleVdvcmRzLCBOdW1iZXJGb3JtYXREYXRlVGltZS5rZXlXb3Jkc1NldCgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbmZQcm90b3R5cGUgPSBOdW1iZXJGb3JtYXREYXRlVGltZS5wcm90b3R5cGU7XG5cbiAgICAgICAgbmZQcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAoZm9ybWF0LCBhYnNUaW1lUGFydHMsIHBhcnRMb2NhbGVJRCwgZGJOdW1iZXJGb3JtYXRQYXJ0KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZm9ybWF0VGVtcCA9IHsndmFsdWUnOiBzZWxmLmZvcm1hdFN0cmluZ307XG4gICAgICAgICAgICB2YXIgc2VsZkNsYXNzID0gTnVtYmVyRm9ybWF0RGF0ZVRpbWU7XG4gICAgICAgICAgICBpZiAoc2VsZkNsYXNzLkV2YWx1YXRlRm9ybWF0KGZvcm1hdFRlbXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0FNUE0gPSBzZWxmLlByb2Nlc3NBTVBNKGZvcm1hdFRlbXApO1xuXG4gICAgICAgICAgICAgICAgLy8gbW1tbW0gLT4gXCJATU1NTU1cIlxuICAgICAgICAgICAgICAgIHNlbGYuaGFzSkQgPSBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLk1vbnRoSkQsIFwiXFxcIlwiICsgc2VsZkNsYXNzLlBsYWNlaG9sZGVyTW9udGhKRCArIFwiXFxcIlwiLCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIC8vIG1tbW0gLT4gTU1NTVxuICAgICAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuTW9udGhVbmFiYnJldmlhdGVkLCBzZWxmQ2xhc3MuU3RhbmRhcmRNb250aFVuYWJicmV2aWF0ZWQsIHRydWUsIGZhbHNlLCBmb3JtYXRUZW1wLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgLy8gbW1tIC0+IE1NTVxuICAgICAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuTW9udGhBYmJyZXZpYXRpb24sIHNlbGZDbGFzcy5TdGFuZGFyZE1vbnRoQWJicmV2aWF0aW9uLCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIC8vIG1tIC0+IE1NXG4gICAgICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5Nb250aFR3b0RpZ2l0LCBzZWxmQ2xhc3MuU3RhbmRhcmRNb250aFR3b0RpZ2l0LCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIC8vIG0gLT4gJU1cbiAgICAgICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLk1vbnRoU2luZ2xlRGlnaXQsIHNlbGZDbGFzcy5TdGFuZGFyZE1vbnRoU2luZ2xlRGlnaXQsIHRydWUsIGZhbHNlLCBmb3JtYXRUZW1wLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWFhIC0+IGRkZFxuICAgICAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRGF5V2Vla0RheUFiYnJldmlhdGlvbiwgc2VsZkNsYXNzLlN0YW5kYXJkRGF5V2Vla0RheUFiYnJldmlhdGlvbiwgdHJ1ZSwgdHJ1ZSwgZm9ybWF0VGVtcCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWFhYSAtPiBkZGRkXG4gICAgICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5EYXlXZWVrRGF5VW5hYmJyZXZpYXRlZCwgc2VsZkNsYXNzLlN0YW5kYXJkRGF5V2Vla0RheVVuYWJicmV2aWF0ZWQsIHRydWUsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIG0gLT4gJW1cbiAgICAgICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLk1pbnV0ZVNpbmdsZURpZ2l0LCBzZWxmQ2xhc3MuU3RhbmRhcmRNaW51dGVTaW5nbGVEaWdpdCwgZmFsc2UsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNBTVBNKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGggLT4gSFxuICAgICAgICAgICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLkhvdXJzU2luZ2xlRGlnaXQsIHNlbGZDbGFzcy5TdGFuZGFyZEhvdXJTaW5nbGVEaWdpdCwgdHJ1ZSwgdHJ1ZSwgZm9ybWF0VGVtcCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBoaCAtPiBISFxuICAgICAgICAgICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLkhvdXJzVHdvRGlnaXQsIHNlbGZDbGFzcy5TdGFuZGFyZEhvdXJUd29EaWdpdCwgdHJ1ZSwgdHJ1ZSwgZm9ybWF0VGVtcCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzIC0+ICVzXG4gICAgICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5TZWNvbmRTaW5nbGVEaWdpdCwgc2VsZkNsYXNzLlN0YW5kYXJkU2Vjb25kU2luZ2xlRGlnaXQsIHRydWUsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIC4wMDAgLT4gLmZmZlxuICAgICAgICAgICAgICAgIC8vc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5TdWJTZWNvbmRUaHJlZURpZ2l0LCBzZWxmQ2xhc3MuU3RhbmRhcmRTdWJTZWNvbmRUaHJlZURpZ2l0LCB0cnVlLCB0cnVlLCBmb3JtYXRUZW1wLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gLjAwIC0+IC5mZlxuICAgICAgICAgICAgICAgIC8vc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5TdWJTZWNvbmRUd29EaWdpdCwgc2VsZkNsYXNzLlN0YW5kYXJkU3ViU2Vjb25kVHdvRGlnaXQsIHRydWUsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyAuMCAtPiAuZlxuICAgICAgICAgICAgICAgIC8vc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAudmFsdWUsIHNlbGZDbGFzcy5TdWJTZWNvbmRTaW5nbGVEaWdpdCwgc2VsZkNsYXNzLlN0YW5kYXJkU3ViU2Vjb25kU2luZ2xlRGlnaXQsIHRydWUsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyBlcmEgeWVhciBtdXN0bid0IGJlIHJlcGxhY2UgdG8gZGVsYXkgZm9ybWF0dGluZy4gZXJhIHllYXJcImVcIiBhbHdheXMgZGlzcGxheSB0aGUgZXJhIHllYXJzIG5vdCBHcmVnb3JpYW4geWVhcihlLmcuIG5ldmVyIGRpc3BsYXkgMjAwOC4pLlxuICAgICAgICAgICAgICAgIGlmIChzZWxmLlBhcnREQk51bWJlckZvcm1hdCgpICYmIHNlbGYuUGFydExvY2FsZUlEKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8geXl5eSAtPiBcIkB5eXl5XCJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oYXNZZWFyRGVsYXkgPSBzZWxmLmhhc1llYXJEZWxheSB8fCBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLlllYXJGb3VyRGlnaXQsIFwiXFxcIlwiICsgRGVmYXVsdFRva2Vucy5SZXBsYWNlUGxhY2Vob2xkZXIgKyBzZWxmQ2xhc3MuWWVhckZvdXJEaWdpdCArIFwiXFxcIlwiLCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHl5IC0+IFwiQHl5XCJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oYXNZZWFyRGVsYXkgPSBzZWxmLmhhc1llYXJEZWxheSB8fCBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcC52YWx1ZSwgc2VsZkNsYXNzLlllYXJUd29EaWdpdCwgXCJcXFwiXCIgKyBEZWZhdWx0VG9rZW5zLlJlcGxhY2VQbGFjZWhvbGRlciArIHNlbGZDbGFzcy5ZZWFyVHdvRGlnaXQgKyBcIlxcXCJcIiwgdHJ1ZSwgZmFsc2UsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICAvLyBDeWxqIGNvbW1lbnQgdGhlc2UgY29kZXMgYXQgMjAxNC8xLzE2LlxuICAgICAgICAgICAgICAgIC8vIFNwcmVhZFggdXNlIC5uZXQgZnJhbWV3b3JrIHRvIGZvcm1hdCwgc28gU1ggc2hvdWxkIHJlcGxhY2UgdGhlICdlJyB0byAneScsXG4gICAgICAgICAgICAgICAgLy8gU3ByZWFkSCBmb3JtYXQgZGF0ZSBieSBvdXJzZWxmLCBzbyB1c2UgJ2UnIGRpcmVjdGx5LlxuICAgICAgICAgICAgICAgIC8vaWYgKHNlbGYuX2lzSmFucGFuZXNlQ3VsdHVyZSgpKSAvL2ZvciBqYW5wYW4gY3VsdHVyZVxuICAgICAgICAgICAgICAgIC8ve1xuICAgICAgICAgICAgICAgIC8vICAgIC8vIGUgLT4geVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciwgc2VsZkNsYXNzLlllYXJTaW5nbGVEaWdpdCwgdHJ1ZSwgZmFsc2UsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyAgICAvLyBlZSAtPiB5eVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciArIHNlbGZDbGFzcy5FcmFZZWFyLCBzZWxmQ2xhc3MuWWVhclR3b0RpZ2l0LCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vICAgIC8vIGVlZSAtPiB5eVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciArIHNlbGZDbGFzcy5FcmFZZWFyICsgc2VsZkNsYXNzLkVyYVllYXIsIHNlbGZDbGFzcy5ZZWFyVHdvRGlnaXQsIHRydWUsIGZhbHNlLCBmb3JtYXRUZW1wLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgIC8vIGUgLT4geXl5eVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciwgc2VsZkNsYXNzLlllYXJGb3VyRGlnaXQsIHRydWUsIGZhbHNlLCBmb3JtYXRUZW1wLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gICAgLy8gZWUgLT4geXl5eVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciArIHNlbGZDbGFzcy5FcmFZZWFyLCBzZWxmQ2xhc3MuWWVhckZvdXJEaWdpdCwgdHJ1ZSwgZmFsc2UsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyAgICAvLyBlZWUgLT4geXl5eVxuICAgICAgICAgICAgICAgIC8vICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuRXJhWWVhciArIHNlbGZDbGFzcy5FcmFZZWFyICsgc2VsZkNsYXNzLkVyYVllYXIsIHNlbGZDbGFzcy5ZZWFyRm91ckRpZ2l0LCB0cnVlLCBmYWxzZSwgZm9ybWF0VGVtcCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgIC8vIHkgLT4gJXlcbiAgICAgICAgICAgICAgICAvL3NlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBzZWxmQ2xhc3MuWWVhclNpbmdsZURpZ2l0LCBzZWxmQ2xhc3MuU3RhbmRhcmRZZWFyU2luZ2xlRGlnaXQsIHRydWUsIGZhbHNlLCBmb3JtYXRUZW1wLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYWJzVGltZVBhcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSA9IDA7IGtleSA8IHNlbGYuYWJzVGltZVBhcnRzLmxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYnNQYXJ0ID0gc2VsZi5hYnNUaW1lUGFydHNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLnZhbHVlLCBhYnNQYXJ0LnRva2VuLCBEZWZhdWx0VG9rZW5zLlJlcGxhY2VQbGFjZWhvbGRlciArIGFic1BhcnQudG9rZW4sIHRydWUsIHRydWUsIGZvcm1hdFRlbXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlbGYudmFsaWREYXRlVGltZUZvcm1hdFN0cmluZyA9IGZvcm1hdFRlbXAudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLl9pc0phbnBhbmVzZUN1bHR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcGFydExvY2FsSUQgPSBzZWxmLlBhcnRMb2NhbGVJRCgpO1xuICAgICAgICAgICAgaWYgKHBhcnRMb2NhbElEICE9PSBrZXl3b3JkX251bGwgJiYgcGFydExvY2FsSUQuQ3VsdHVyZUluZm8oKSAhPT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRMb2NhbElELkN1bHR1cmVJbmZvKCkgPT09IGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uamFwYW5DdWx0dXJlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLkN1bHR1cmVOYW1lKCkgPT09IGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uamFwYW5DdWx0dXJlKCkuTmFtZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuTnVtYmVyU3RyaW5nQ29udmVydGVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vR2V0XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYmFzZU51bWJlclN0cmluZ0NvbnZlcnRlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmJhc2VOdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyRm9ybWF0RGF0ZVRpbWUuZGVmYXVsdERhdGVUaW1lTnVtYmVyU3RyaW5nQ29udmVydGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIHNlbGYuYmFzZU51bWJlclN0cmluZ0NvbnZlcnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLkFic29sdXRlVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmFic29sdXRlVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmFic29sdXRlVGltZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIE51bWJlckZvcm1hdERhdGVUaW1lLmRlZmF1bHRBYnNvbHV0ZVRpbWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0U3RyaW5nO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLkRhdGVUaW1lRm9ybWF0SW5mbyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvL0dldFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmJhc2VEYXRlVGltZUZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5iYXNlRGF0ZVRpbWVGb3JtYXRJbmZvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLlBhcnRMb2NhbGVJRCgpICYmIHNlbGYuUGFydExvY2FsZUlEKCkuQ3VsdHVyZUluZm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5QYXJ0TG9jYWxlSUQoKS5DdWx0dXJlSW5mbygpLkRhdGVUaW1lRm9ybWF0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYmFzZUN1bHR1cmVOYW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uZ2V0Q3VsdHVyZShzZWxmLmJhc2VDdWx0dXJlTmFtZSgpKS5EYXRlVGltZUZvcm1hdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBEZWZhdWx0VG9rZW5zLkRhdGVUaW1lRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIHNlbGYuYmFzZURhdGVUaW1lRm9ybWF0SW5mbyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLkV4Y2VsQ29tcGF0aWJsZUZvcm1hdFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBmb3JtYXRUZW1wID0gc2VsZi5mb3JtYXRTdHJpbmc7XG4gICAgICAgICAgICB2YXIgc2VsZkNsYXNzID0gTnVtYmVyRm9ybWF0RGF0ZVRpbWU7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyd2YWx1ZSc6IGZvcm1hdFRlbXB9O1xuXG4gICAgICAgICAgICAvLyBNTU1NIC0+IG1tbW1cbiAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLCBzZWxmQ2xhc3MuU3RhbmRhcmRBTVBNU2luZ2xlRGlnaXQsIHNlbGYuQ3VycmVudEFNUE0oKSwgdHJ1ZSwgdHJ1ZSwgcmVzdWx0LCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIE1NTU0gLT4gbW1tbVxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZE1vbnRoVW5hYmJyZXZpYXRlZCwgc2VsZkNsYXNzLk1vbnRoVW5hYmJyZXZpYXRlZCwgdHJ1ZSwgZmFsc2UsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBNTU0gLT4gbW1tXG4gICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcCwgc2VsZkNsYXNzLlN0YW5kYXJkTW9udGhBYmJyZXZpYXRpb24sIHNlbGZDbGFzcy5Nb250aEFiYnJldmlhdGlvbiwgdHJ1ZSwgZmFsc2UsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBNTSAtPiBtbVxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZE1vbnRoVHdvRGlnaXQsIHNlbGZDbGFzcy5Nb250aFR3b0RpZ2l0LCB0cnVlLCBmYWxzZSwgcmVzdWx0LCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vICVNIC0+IG1cbiAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLCBzZWxmQ2xhc3MuU3RhbmRhcmRNb250aFNpbmdsZURpZ2l0LCBzZWxmQ2xhc3MuTW9udGhTaW5nbGVEaWdpdCwgdHJ1ZSwgZmFsc2UsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBkZGQgLT4gYWFhXG4gICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcCwgc2VsZkNsYXNzLlN0YW5kYXJkRGF5V2Vla0RheUFiYnJldmlhdGlvbiwgc2VsZkNsYXNzLkRheVdlZWtEYXlBYmJyZXZpYXRpb24sIHRydWUsIHRydWUsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBkZGRkIC0+IGFhYWFcbiAgICAgICAgICAgIHNlbGYuUmVwbGFjZShmb3JtYXRUZW1wLCBzZWxmQ2xhc3MuU3RhbmRhcmREYXlXZWVrRGF5VW5hYmJyZXZpYXRlZCwgc2VsZkNsYXNzLkRheVdlZWtEYXlVbmFiYnJldmlhdGVkLCB0cnVlLCB0cnVlLCByZXN1bHQsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gJW0gLT4gbVxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZE1pbnV0ZVNpbmdsZURpZ2l0LCBzZWxmQ2xhc3MuTWludXRlU2luZ2xlRGlnaXQsIGZhbHNlLCB0cnVlLCByZXN1bHQsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gSEggLT4gc2VsZi5mb3JtYXRUZW1wLFxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZEhvdXJTaW5nbGVEaWdpdCwgc2VsZkNsYXNzLkhvdXJzU2luZ2xlRGlnaXQsIHRydWUsIHRydWUsIHJlc3VsdCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gSCAtPiBoXG4gICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcCwgc2VsZkNsYXNzLlN0YW5kYXJkSG91clR3b0RpZ2l0LCBzZWxmQ2xhc3MuSG91cnNUd29EaWdpdCwgdHJ1ZSwgdHJ1ZSwgcmVzdWx0LCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyAlcyAtPiBzXG4gICAgICAgICAgICBzZWxmLlJlcGxhY2UoZm9ybWF0VGVtcCwgc2VsZkNsYXNzLlN0YW5kYXJkU2Vjb25kU2luZ2xlRGlnaXQsIHNlbGZDbGFzcy5TZWNvbmRTaW5nbGVEaWdpdCwgdHJ1ZSwgdHJ1ZSwgcmVzdWx0LCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIC5mZmYgLT4gLjAwMFxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZFN1YlNlY29uZFRocmVlRGlnaXQsIHNlbGZDbGFzcy5TdWJTZWNvbmRUaHJlZURpZ2l0LCB0cnVlLCB0cnVlLCByZXN1bHQsIGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gLmZmIC0+IC4wMFxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZFN1YlNlY29uZFR3b0RpZ2l0LCBzZWxmQ2xhc3MuU3ViU2Vjb25kVHdvRGlnaXQsIHRydWUsIHRydWUsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyAuZiAtPiAuMFxuICAgICAgICAgICAgc2VsZi5SZXBsYWNlKGZvcm1hdFRlbXAsIHNlbGZDbGFzcy5TdGFuZGFyZFN1YlNlY29uZFNpbmdsZURpZ2l0LCBzZWxmQ2xhc3MuU3ViU2Vjb25kU2luZ2xlRGlnaXQsIHRydWUsIHRydWUsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvLyBDeWxqIGNvbW1lbnQgdGhlc2UgY29kZXMgYXQgMjAxNC8xLzE2LlxuICAgICAgICAgICAgLy8gU3ByZWFkSCBkbyBub3QgcmVwbGFjZSB0aGUgJ2UnIHRvICd5eXl5Jy5cbiAgICAgICAgICAgIC8vIHl5eXkgLT4gZVxuICAgICAgICAgICAgLy9zZWxmLlJlcGxhY2UoZm9ybWF0VGVtcCwgc2VsZkNsYXNzLlllYXJGb3VyRGlnaXQsIHNlbGZDbGFzcy5FcmFZZWFyLCB0cnVlLCBmYWxzZSwgcmVzdWx0LCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAvLyAleSAtPiB5XG4gICAgICAgICAgICAvL3NlbGYuUmVwbGFjZShmb3JtYXRUZW1wLCBzZWxmQ2xhc3MuU3RhbmRhcmRZZWFyU2luZ2xlRGlnaXQsIHNlbGZDbGFzcy5ZZWFyU2luZ2xlRGlnaXQsIHRydWUsIHRydWUsIHJlc3VsdCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5DdXJyZW50QU1QTSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBmb3JtYXRJbmZvID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgaWYgKHNlbGYuRGF0ZVRpbWVGb3JtYXRJbmZvKCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRJbmZvID0gc2VsZi5EYXRlVGltZUZvcm1hdEluZm8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0SW5mbyA9IERlZmF1bHRUb2tlbnMuRGF0ZVRpbWVGb3JtYXRJbmZvKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JtYXRJbmZvICYmIGZvcm1hdEluZm8uYW1EZXNpZ25hdG9yICYmIGZvcm1hdEluZm8uYW1EZXNpZ25hdG9yICE9PSBzdHJpbmdFeC5FbXB0eSAmJiBmb3JtYXRJbmZvLnBtRGVzaWduYXRvciAmJiBmb3JtYXRJbmZvLnBtRGVzaWduYXRvciAhPT0gc3RyaW5nRXguRW1wdHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW1wbSA9IHN0cmluZ0V4LkZvcm1hdChcInswfS97MX1cIiwgZm9ybWF0SW5mby5hbURlc2lnbmF0b3IsIGZvcm1hdEluZm8ucG1EZXNpZ25hdG9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW1wbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIE51bWJlckZvcm1hdERhdGVUaW1lLkFNUE1Ud29EaWdpdDtcbiAgICAgICAgfTtcblxuICAgICAgICBuZlByb3RvdHlwZS5Gb3JtYXQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc1R5cGUob2JqLCAnYm9vbGVhbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgIHZhciBkYXRlVGltZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZVRpbWUgPSBmb3JtYXR0ZXJVdGlscy51dGlsLnRvRGF0ZVRpbWUob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRlVGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGVUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZml4IHNpbmdsZSBmb3JtYXQgc3RyaW5nIDogIGgsSCAtPiBob3VyIC8gbSAtPm1pbnV0ZSAvTSAtPiBtb250aCAvIGQgLT4gZGF5IC9zLT5zZWNvbmQgL3kgLT55ZWFyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWxpZERURiA9IHNlbGYudmFsaWREYXRlVGltZUZvcm1hdFN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZzID0gc2VsZi52YWxpZERhdGVUaW1lRm9ybWF0U3RyaW5nLnJlcGxhY2UoLyUvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcyA9PT0gXCJIXCIgfHwgZnMgPT09IFwiaFwiIHx8IGZzID09PSBcIm1cIiB8fCBmcyA9PT0gXCJNXCIgfHwgZnMgPT09IFwiZFwiIHx8IGZzID09PSBcInNcIiB8fCBmcyA9PT0gXCJ5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkRFRGID0gXCIlXCIgKyBmcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudmFsaWREYXRlVGltZUZvcm1hdFN0cmluZyA9IHZhbGlkRFRGO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWREVEYgPSBmcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IGN1bHR1cmVJbmZvXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLlBhcnRMb2NhbGVJRCgpICYmIHNlbGYuUGFydExvY2FsZUlEKCkuQ3VsdHVyZUluZm8oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlcihkYXRlVGltZSkuY3VzdG9tQ3VsdHVyZUZvcm1hdCh2YWxpZERURiwgc2VsZi5QYXJ0TG9jYWxlSUQoKS5DdWx0dXJlSW5mbygpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLkN1bHR1cmVOYW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBmb3JtYXR0ZXJVdGlscy5fRGF0ZVRpbWVIZWxwZXIoZGF0ZVRpbWUpLmN1c3RvbUN1bHR1cmVGb3JtYXQodmFsaWREVEYsIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uZ2V0Q3VsdHVyZShzZWxmLkN1bHR1cmVOYW1lKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBmb3JtYXR0ZXJVdGlscy5fRGF0ZVRpbWVIZWxwZXIoZGF0ZVRpbWUpLmxvY2FsZUZvcm1hdCh2YWxpZERURik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5oYXNKRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vbnRoTmFtZSA9IHNlbGYuX2dldE1vbnRoTmFtZShkYXRlVGltZS5nZXRNb250aCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZXBsYWNlKHJlc3VsdCwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuUGxhY2Vob2xkZXJNb250aEpELCBtb250aE5hbWUuc3Vic3RyKDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmFic1RpbWVQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW4gPSAoZm9ybWF0dGVyVXRpbHMuX0RhdGVUaW1lSGVscGVyLl9fX3RvT0FEYXRlKGRhdGVUaW1lKSAtIGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlci5fX190b09BRGF0ZShzZWxmLkFic29sdXRlVGltZSgpKSkgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgc2VsZi5hYnNUaW1lUGFydHMubGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYnNQYXJ0ID0gc2VsZi5hYnNUaW1lUGFydHNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWJzVGltZVBhcnRTdHJpbmcgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhYnNQYXJ0LlRpbWVQYXJ0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMCAvKiBIb3VyICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFic1RpbWVQYXJ0U3RyaW5nID0gTWF0aF9mbG9vcihzcGFuIC8gMTAwMCAvIDM2MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMSAvKiBNaW51dGUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJzVGltZVBhcnRTdHJpbmcgPSBNYXRoX2Zsb29yKHNwYW4gLyAxMDAwIC8gNjApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMiAvKiBTZWNvbmQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJzVGltZVBhcnRTdHJpbmcgPSBNYXRoX2Zsb29yKHNwYW4gLyAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhYnNUaW1lUGFydFN0cmluZyAhPT0ga2V5d29yZF9udWxsICYmIGFic1RpbWVQYXJ0U3RyaW5nICE9PSBrZXl3b3JkX3VuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFic1BhcnQgPSBhYnNQYXJ0LnRva2VuLnJlcGxhY2UoXCJbXCIsIFwiXFxcXFtcIikucmVwbGFjZShcIl1cIiwgXCJcXFxcXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlcGxhY2UocmVzdWx0LCBEZWZhdWx0VG9rZW5zLlJlcGxhY2VQbGFjZWhvbGRlciArIHRlbXBBYnNQYXJ0LCBhYnNUaW1lUGFydFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmb3JtYXR0ZXJVdGlscy5Gb3JtYXRDb252ZXJ0ZXIudG9TdHJpbmcob2JqKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuTnVtYmVyU3RyaW5nQ29udmVydGVyKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKSBpbnN0YW5jZW9mIERlZmF1bHREYXRlVGltZU51bWJlclN0cmluZ0NvbnZlcnRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmLk51bWJlclN0cmluZ0NvbnZlcnRlcigpLkNvbnZlcnRUbyhyZXN1bHQsIG9iaiwgZmFsc2UsIHNlbGYuUGFydExvY2FsZUlEKCksIHNlbGYuUGFydERCTnVtYmVyRm9ybWF0KCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmhhc1llYXJEZWxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlcGxhY2UocmVzdWx0LCBEZWZhdWx0VG9rZW5zLlJlcGxhY2VQbGFjZWhvbGRlciArIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJGb3VyRGlnaXQsIG5ldyBmb3JtYXR0ZXJVdGlscy5fRGF0ZVRpbWVIZWxwZXIoZGF0ZVRpbWUpLmxvY2FsZUZvcm1hdChOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyRm91ckRpZ2l0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShyZXN1bHQsIERlZmF1bHRUb2tlbnMuUmVwbGFjZVBsYWNlaG9sZGVyICsgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuWWVhclR3b0RpZ2l0LCBuZXcgZm9ybWF0dGVyVXRpbHMuX0RhdGVUaW1lSGVscGVyKGRhdGVUaW1lKS5sb2NhbGVGb3JtYXQoTnVtYmVyRm9ybWF0RGF0ZVRpbWUuWWVhclR3b0RpZ2l0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZi5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKS5Db252ZXJ0VG8ocmVzdWx0LCBvYmosIHRydWUsIHNlbGYuUGFydExvY2FsZUlEKCksIHNlbGYuUGFydERCTnVtYmVyRm9ybWF0KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuX2dldE1vbnRoTmFtZSA9IGZ1bmN0aW9uIChtb250aEluZGV4KSB7XG4gICAgICAgICAgICAvL09ubHkgc3VwcG9ydCBlbmdsaXNoIGN1bHR1cmVcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5W21vbnRoSW5kZXhdO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLlBhcnNlID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIGlmICghcyB8fCBzID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBzdHJUZW1wID0gTnVtYmVySGVscGVyLkZpeEphcGFuZXNlQ2hhcnMocyk7XG5cbiAgICAgICAgICAgIHZhciBib29sUmVzdWx0ID0gc3RyVGVtcC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGJvb2xSZXN1bHQgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJvb2xSZXN1bHQgPT09IFwiZmFsc2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYudmFsaWREYXRlVGltZUZvcm1hdFN0cmluZykge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlVGltZVJlc3VsdCA9IGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlci5wYXJzZUV4YWN0KHN0clRlbXAsIHNlbGYudmFsaWREYXRlVGltZUZvcm1hdFN0cmluZywgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5nZXRDdWx0dXJlKHNlbGYuQ3VsdHVyZU5hbWUoKSkpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRlVGltZVJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZVRpbWVSZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXNlbGYuZXhhY3RseU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdERhdGUgPSBmb3JtYXR0ZXJVdGlscy51dGlsLnRvRGF0ZVRpbWUoc3RyVGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHREYXRlICYmICFpc05hTihyZXN1bHREYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdERhdGU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyVGVtcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyVGVtcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuRml4Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdFRlbXAgPSBmb3JtYXQ7XG4gICAgICAgICAgICB2YXIgc3RyQnVpbGRlciA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgaW5Db21tZW50cyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGhhc1RpbWUgPSAoZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluZGV4T2YoZm9ybWF0VGVtcCwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuSG91cnNTaW5nbGVEaWdpdFswXSwgMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pID4gLTEgfHwgZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluZGV4T2YoZm9ybWF0VGVtcCwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU2Vjb25kU2luZ2xlRGlnaXRbMF0sIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSA+IC0xKTtcbiAgICAgICAgICAgIHZhciBoYXNEYXRlID0gKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbmRleE9mKGZvcm1hdFRlbXAsIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJUd29EaWdpdFswXSwgMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pID4gLTEgfHwgZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluZGV4T2YoZm9ybWF0VGVtcCwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRGF5U2luZ2xlRGlnaXRbMF0sIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSA+IC0xKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBmb3JtYXRUZW1wLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBmb3JtYXRUZW1wW25dO1xuICAgICAgICAgICAgICAgIGlmIChjID09PSAnXFxcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5Db21tZW50cyA9ICFpbkNvbW1lbnRzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5Db21tZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICdZJyB8fCBjID09PSAnRCcgfHwgYyA9PT0gJ1MnIHx8IGMgPT09ICdFJyB8fCBjID09PSAnRycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gYy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnTScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFEZWZhdWx0VG9rZW5zLklzRXF1YWxzKCdBJywgZm9ybWF0VGVtcFtuIC0gMV0sIHRydWUpICYmICFEZWZhdWx0VG9rZW5zLklzRXF1YWxzKCdQJywgZm9ybWF0VGVtcFtuIC0gMV0sIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gYy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdHJCdWlsZGVyICs9IChjKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0ckJ1aWxkZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmZQcm90b3R5cGUuUHJvY2Vzc0FNUE0gPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICB2YXIgaXNIYW5kbGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkNvbnRhaW5zKGZvcm1hdC52YWx1ZSwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuQU1QTVR3b0RpZ2l0KSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdC52YWx1ZSA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZXBsYWNlKGZvcm1hdC52YWx1ZSwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuQU1QTVR3b0RpZ2l0LCBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZEFNUE1TaW5nbGVEaWdpdCk7XG4gICAgICAgICAgICAgICAgaXNIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlVGltZUZvcm1hdEluZm8gPSB0aGlzLkRhdGVUaW1lRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5Db250YWlucyhmb3JtYXQudmFsdWUsIE51bWJlckZvcm1hdERhdGVUaW1lLkFNUE1TaW5nbGVEaWdpdCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQudmFsdWUgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShmb3JtYXQudmFsdWUsIE51bWJlckZvcm1hdERhdGVUaW1lLkFNUE1TaW5nbGVEaWdpdCwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU3RhbmRhcmRBTVBNU2luZ2xlRGlnaXQpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RGF0ZVRpbWVGb3JtYXRJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdG9kb1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIGlmICh0aGlzLkRhdGVUaW1lRm9ybWF0SW5mbygpLmlzUmVhZE9ubHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICB0aGlzLkRhdGVUaW1lRm9ybWF0SW5mbyh1dGlsLmFzQ3VzdG9tVHlwZSh0aGlzLkRhdGVUaW1lRm9ybWF0SW5mby5DbG9uZSgpLCBcIkRhdGVUaW1lRm9ybWF0SW5mb1wiKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZVRpbWVGb3JtYXRJbmZvLmFtRGVzaWduYXRvciA9IE51bWJlckZvcm1hdERhdGVUaW1lLkFNUE1TaW5nbGVEaWdpdC5zdWJzdHIoMCwgMSk7IC8vIEFcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGVUaW1lRm9ybWF0SW5mby5wbURlc2lnbmF0b3IgPSBOdW1iZXJGb3JtYXREYXRlVGltZS5BTVBNU2luZ2xlRGlnaXQuc3Vic3RyKDIsIDEpOyAvLyBQXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXNIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRBTVBNID0gdGhpcy5DdXJyZW50QU1QTSgpO1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5Db250YWlucyhmb3JtYXQudmFsdWUsIGN1cnJlbnRBTVBNKSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdC52YWx1ZSA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZXBsYWNlKGZvcm1hdC52YWx1ZSwgY3VycmVudEFNUE0sIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkQU1QTVNpbmdsZURpZ2l0KTtcbiAgICAgICAgICAgICAgICB2YXIgYW1wbSA9IGN1cnJlbnRBTVBNLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgaWYgKGFtcG0gJiYgYW1wbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgaWYgKHRoaXMuRGF0ZVRpbWVGb3JtYXRJbmZvKCkuaXNSZWFkT25seSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHRoaXMuRGF0ZVRpbWVGb3JtYXRJbmZvKHV0aWwuYXNDdXN0b21UeXBlKHRoaXMuRGF0ZVRpbWVGb3JtYXRJbmZvKCkuQ2xvbmUoKSwgXCJEYXRlVGltZUZvcm1hdEluZm9cIikpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGVUaW1lRm9ybWF0SW5mby5hbURlc2lnbmF0b3IgPSBhbXBtWzBdOyAvLyBTcGVjaWFsIEFNXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlVGltZUZvcm1hdEluZm8ucG1EZXNpZ25hdG9yID0gYW1wbVsxXTsgLy8gU3BlY2lhbCBQTVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc0hhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNIYW5kbGVkO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5mUHJvdG90eXBlLlJlcGxhY2UgPSBmdW5jdGlvbiAoZm9ybWF0LCBvbGRUb2tlbiwgbmV3VG9rZW4sIGlzUmVwbGFjZUluRGF0ZUZvcm1hdCwgaXNSZXBsYWNlSW5UaW1lRm9ybWF0LCByZXN1bHQsIGp1c3RTZWFyY2gsIGlzSWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgcmVzdWx0LnZhbHVlID0gZm9ybWF0O1xuICAgICAgICAgICAgaWYgKGlzUmVwbGFjZUluRGF0ZUZvcm1hdCB8fCBpc1JlcGxhY2VJblRpbWVGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGlzSW5EYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaGFzVGltZSA9IChmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuSW5kZXhPZihyZXN1bHQudmFsdWUsIE51bWJlckZvcm1hdERhdGVUaW1lLkhvdXJzU2luZ2xlRGlnaXRbMF0sIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSA+IC0xIHx8IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5JbmRleE9mKHJlc3VsdC52YWx1ZSwgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU2Vjb25kU2luZ2xlRGlnaXRbMF0sIDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSA+IC0xKTtcbiAgICAgICAgICAgICAgICB2YXIgaGFzRGF0ZSA9IChmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuSW5kZXhPZihyZXN1bHQudmFsdWUsIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJUd29EaWdpdFswXSwgMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pID4gLTEgfHwgZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluZGV4T2YocmVzdWx0LnZhbHVlLCBOdW1iZXJGb3JtYXREYXRlVGltZS5EYXlTaW5nbGVEaWdpdFswXSwgMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pID4gLTEpO1xuICAgICAgICAgICAgICAgIGlmICghaGFzRGF0ZSAmJiBoYXNUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzSW5EYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpc1N0YXJ0U3BlY2lhbFN0cmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbkNoYXJJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaW5kZXggPCByZXN1bHQudmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gcmVzdWx0LnZhbHVlW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKERlZmF1bHRUb2tlbnMuSXNFcXVhbHMoYywgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuSG91cnNTaW5nbGVEaWdpdFswXSwgdHJ1ZSkgfHwgRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhjLCBOdW1iZXJGb3JtYXREYXRlVGltZS5TZWNvbmRTaW5nbGVEaWdpdFswXSwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzSW5EYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhjLCBOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyVHdvRGlnaXRbMF0sIHRydWUpIHx8IERlZmF1bHRUb2tlbnMuSXNFcXVhbHMoYywgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRGF5U2luZ2xlRGlnaXRbMF0sIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0luRGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoKGlzUmVwbGFjZUluRGF0ZUZvcm1hdCAmJiBEZWZhdWx0VG9rZW5zLklzRXF1YWxzKGMsIG9sZFRva2VuW3Rva2VuQ2hhckluZGV4XSwgaXNJZ25vcmVDYXNlKSAmJiBpc0luRGF0ZSkgfHwgKGlzUmVwbGFjZUluVGltZUZvcm1hdCAmJiBEZWZhdWx0VG9rZW5zLklzRXF1YWxzKGMsIG9sZFRva2VuW3Rva2VuQ2hhckluZGV4XSwgaXNJZ25vcmVDYXNlKSAmJiAhaXNJbkRhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNNYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9sZFRva2VuLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggKyBpbmRleCA+PSBmb3JtYXQubGVuZ3RoIHx8ICFEZWZhdWx0VG9rZW5zLklzRXF1YWxzKG9sZFRva2VuW3hdLCByZXN1bHQudmFsdWVbeCArIGluZGV4XSwgaXNJZ25vcmVDYXNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc01hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4TGFzdE1hdGNoID0gaW5kZXggKyBvbGRUb2tlbi5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTWF0Y2ggJiYgaW5kZXhMYXN0TWF0Y2ggKyAxIDwgcmVzdWx0LnZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0TWF0Y2hDaGFyID0gcmVzdWx0LnZhbHVlW2luZGV4TGFzdE1hdGNoXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFpbCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodGFpbCA9IGluZGV4TGFzdE1hdGNoICsgMTsgdGFpbCA8IHJlc3VsdC52YWx1ZS5sZW5ndGg7IHRhaWwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIURlZmF1bHRUb2tlbnMuSXNFcXVhbHMobGFzdE1hdGNoQ2hhciwgcmVzdWx0LnZhbHVlW3RhaWxdLCBpc0lnbm9yZUNhc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWlsID4gaW5kZXhMYXN0TWF0Y2ggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gdGFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTWF0Y2ggJiYgIWlzU3RhcnRTcGVjaWFsU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnNwbGljZSgwLCAwLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3JtYXR0ZXJVdGlscy5BcnJheUhlbHBlci5pbnNlcnQocG9zaXRpb25zLCAwLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJ1xcXCInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0U3BlY2lhbFN0cmluZyA9ICFpc1N0YXJ0U3BlY2lhbFN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWp1c3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHBvc2l0aW9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBwb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZW1vdmUocmVzdWx0LnZhbHVlLCBwb3NpdGlvbiwgb2xkVG9rZW4ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudmFsdWUgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuSW5zZXJ0KHJlc3VsdC52YWx1ZSwgcG9zaXRpb24sIG5ld1Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUua2V5V29yZHNTZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZkNsYXNzID0gTnVtYmVyRm9ybWF0RGF0ZVRpbWU7XG4gICAgICAgICAgICBpZiAoIXNlbGZDbGFzcy5fa2V5V29yZHNTZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmQ2xhc3Mua2V5V29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3NlbGZDbGFzcy5rZXlXb3Jkc1tpXV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmQ2xhc3MuX2tleVdvcmRzU2V0ID0gb2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGZDbGFzcy5fa2V5V29yZHNTZXQ7XG4gICAgICAgIH07XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLmRlZmF1bHREYXRlVGltZU51bWJlclN0cmluZ0NvbnZlcnRlciA9IG5ldyBEZWZhdWx0RGF0ZVRpbWVOdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKTtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuWWVhclR3b0RpZ2l0ID0gXCJ5eVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5ZZWFyU2luZ2xlRGlnaXQgPSBcInlcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuWWVhckZvdXJEaWdpdCA9IFwieXl5eVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5Nb250aFNpbmdsZURpZ2l0ID0gXCJtXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLk1vbnRoVHdvRGlnaXQgPSBcIm1tXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLk1vbnRoQWJicmV2aWF0aW9uID0gXCJtbW1cIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuTW9udGhVbmFiYnJldmlhdGVkID0gXCJtbW1tXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLk1vbnRoSkQgPSBcIm1tbW1tXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLkRheVNpbmdsZURpZ2l0ID0gXCJkXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLkRheVR3b0RpZ2l0ID0gXCJkZFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5EYXlXZWVrRGF5QWJicmV2aWF0aW9uID0gXCJhYWFcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRGF5V2Vla0RheVVuYWJicmV2aWF0ZWQgPSBcImFhYWFcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuSG91cnNTaW5nbGVEaWdpdCA9IFwiaFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5Ib3Vyc1R3b0RpZ2l0ID0gXCJoaFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5NaW51dGVTaW5nbGVEaWdpdCA9IFwibVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5NaW51dGVUd29EaWdpdCA9IFwibW1cIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU2Vjb25kU2luZ2xlRGlnaXQgPSBcInNcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU2Vjb25kVHdvRGlnaXQgPSBcInNzXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN1YlNlY29uZFNpbmdsZURpZ2l0ID0gXCIuMFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdWJTZWNvbmRUd29EaWdpdCA9IFwiLjAwXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN1YlNlY29uZFRocmVlRGlnaXQgPSBcIi4wMDBcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRXJhWWVhciA9IFwiZVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5BTVBNVHdvRGlnaXQgPSBcIkFNL1BNXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLkFNUE1TaW5nbGVEaWdpdCA9IFwiQS9QXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkWWVhclNpbmdsZURpZ2l0ID0gXCIleVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZE1vbnRoU2luZ2xlRGlnaXQgPSBcIiVNXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkTW9udGhUd29EaWdpdCA9IFwiTU1cIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU3RhbmRhcmRNb250aEFiYnJldmlhdGlvbiA9IFwiTU1NXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkTW9udGhVbmFiYnJldmlhdGVkID0gXCJNTU1NXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkQU1QTVNpbmdsZURpZ2l0ID0gXCJ0dFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZE1pbnV0ZVNpbmdsZURpZ2l0ID0gXCIlbVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZEhvdXJTaW5nbGVEaWdpdCA9IFwiSFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZEhvdXJUd29EaWdpdCA9IFwiSEhcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU3RhbmRhcmRTZWNvbmRTaW5nbGVEaWdpdCA9IFwiJXNcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU3RhbmRhcmRTdWJTZWNvbmRTaW5nbGVEaWdpdCA9IFwiLmZcIjtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuU3RhbmRhcmRTdWJTZWNvbmRUd29EaWdpdCA9IFwiLmZmXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlN0YW5kYXJkU3ViU2Vjb25kVGhyZWVEaWdpdCA9IFwiLmZmZlwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZERheVdlZWtEYXlBYmJyZXZpYXRpb24gPSBcImRkZFwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TdGFuZGFyZERheVdlZWtEYXlVbmFiYnJldmlhdGVkID0gXCJkZGRkXCI7XG4gICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlBsYWNlaG9sZGVyTW9udGhKRCA9IERlZmF1bHRUb2tlbnMuUmVwbGFjZVBsYWNlaG9sZGVyICsgXCJtbW1tbVwiO1xuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5kZWZhdWx0QWJzb2x1dGVUaW1lID0gbmV3IERhdGUoMTg5OSwgMTEsIDMwLCAwLCAwLCAwLCAwKTtcblxuICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5rZXlXb3JkcyA9IFtcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJTaW5nbGVEaWdpdCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJUd29EaWdpdCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlllYXJGb3VyRGlnaXQsXG4gICAgICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5Nb250aFNpbmdsZURpZ2l0LFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuTW9udGhUd29EaWdpdCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLk1vbnRoQWJicmV2aWF0aW9uLFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuTW9udGhVbmFiYnJldmlhdGVkLFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuTW9udGhKRCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLkRheVNpbmdsZURpZ2l0LFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRGF5VHdvRGlnaXQsXG4gICAgICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5EYXlXZWVrRGF5QWJicmV2aWF0aW9uLFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuRGF5V2Vla0RheVVuYWJicmV2aWF0ZWQsXG4gICAgICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5Ib3Vyc1NpbmdsZURpZ2l0LFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuSG91cnNUd29EaWdpdCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLk1pbnV0ZVNpbmdsZURpZ2l0LFxuICAgICAgICAgICAgTnVtYmVyRm9ybWF0RGF0ZVRpbWUuTWludXRlVHdvRGlnaXQsXG4gICAgICAgICAgICBOdW1iZXJGb3JtYXREYXRlVGltZS5TZWNvbmRTaW5nbGVEaWdpdCxcbiAgICAgICAgICAgIE51bWJlckZvcm1hdERhdGVUaW1lLlNlY29uZFR3b0RpZ2l0LFxuICAgICAgICAgICAgXCJnZ2dcIiwgXCJnZ1wiLCBcImdcIiwgXCJlZVwiLCBcImVcIlxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gTnVtYmVyRm9ybWF0RGF0ZVRpbWU7XG4gICAgfSkoTnVtYmVyRm9ybWF0QmFzZSk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgdmFyIERlZmF1bHROdW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBEZWZhdWx0TnVtYmVyU3RyaW5nQ29udmVydGVyKCkge1xuICAgICAgICB9XG5cbiAgICAgICAgRGVmYXVsdE51bWJlclN0cmluZ0NvbnZlcnRlci5wcm90b3R5cGUuQ29udmVydFRvID0gZnVuY3Rpb24gKG51bSwgdmFsdWUsIGlzR2VuZXJhbE51bWJlciwgbG9jYWxlLCBkYk51bWJlcikge1xuICAgICAgICAgICAgaWYgKGxvY2FsZSAhPSBrZXl3b3JkX251bGwgJiYgZGJOdW1iZXIgIT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRiTnVtYmVyVGVtcCA9IGxvY2FsZS5HZXREQk51bWJlcihkYk51bWJlci5UeXBlKCkpO1xuICAgICAgICAgICAgICAgIGlmIChkYk51bWJlclRlbXAgIT0ga2V5d29yZF9udWxsKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGJOdW1iZXIuUmVwbGFjZU51bWJlclN0cmluZyhudW0sIGRiTnVtYmVyVGVtcCwgaXNHZW5lcmFsTnVtYmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIERlZmF1bHROdW1iZXJTdHJpbmdDb252ZXJ0ZXI7XG4gICAgfSkoKTtcblxuICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJOdW1iZXJGb3JtYXREaWdpdGFsXCI+XG4gICAgdmFyIE51bWJlckZvcm1hdERpZ2l0YWwgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoTnVtYmVyRm9ybWF0RGlnaXRhbCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gTnVtYmVyRm9ybWF0RGlnaXRhbChmb3JtYXQsIHBhcnRMb2NhbGVJRCwgZGJOdW1iZXJGb3JtYXRQYXJ0LCBjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy9iYXNlIENvbnN0cnVjdG9yXG4gICAgICAgICAgICBfc3VwZXIuY2FsbChzZWxmLCBwYXJ0TG9jYWxlSUQsIGRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZU5hbWUpO1xuICAgICAgICAgICAgc2VsZi5iYXNlTnVtYmVyU3RyaW5nQ29udmVydGVyID0gTnVtYmVyRm9ybWF0QmFzZS5wcm90b3R5cGUuTnVtYmVyU3RyaW5nQ29udmVydGVyO1xuICAgICAgICAgICAgc2VsZi5iYXNlTnVtYmVyRm9ybWF0SW5mbyA9IE51bWJlckZvcm1hdEJhc2UucHJvdG90eXBlLk51bWJlckZvcm1hdEluZm87XG4gICAgICAgICAgICBzZWxmLmJhc2VDdWx0dXJlTmFtZSA9IE51bWJlckZvcm1hdEJhc2UucHJvdG90eXBlLkN1bHR1cmVOYW1lO1xuXG4gICAgICAgICAgICBzZWxmLm51bWJlckZvcm1hdFN0cmluZyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZnVsbEZvcm1hdFN0cmluZyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuaXNHZW5lcmFsTnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmZyYWN0aW9uSW50ZWdlckZvcm1hdCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZnJhY3Rpb25OdW1lcmF0b3JGb3JtYXQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmZyYWN0aW9uRGVub21pbmF0b3JGb3JtYXQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmV4Y2VsRm9ybWF0U3RyaW5nID0gc3RyaW5nRXguRW1wdHk7XG5cbiAgICAgICAgICAgIHNlbGYuX2NsYXNzTmFtZXMucHVzaChcIk51bWJlckZvcm1hdERpZ2l0YWxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtYXRUZW1wID0gTnVtYmVyRm9ybWF0QmFzZS5UcmltTm90U3VwcG9ydFN5bWJvbChmb3JtYXQpO1xuICAgICAgICAgICAgc2VsZi5mdWxsRm9ybWF0U3RyaW5nID0gRGVmYXVsdFRva2Vucy5GaWx0ZXIoZm9ybWF0LCBEZWZhdWx0VG9rZW5zLkxlZnRTcXVhcmVCcmFja2V0LCBEZWZhdWx0VG9rZW5zLlJpZ2h0U3F1YXJlQnJhY2tldCk7XG4gICAgICAgICAgICBzZWxmLmV4Y2VsRm9ybWF0U3RyaW5nID0gZm9ybWF0VGVtcDtcbiAgICAgICAgICAgIGlmIChwYXJ0TG9jYWxlSUQpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkRm9ybWF0ID0gZm9ybWF0VGVtcDtcbiAgICAgICAgICAgICAgICBmb3JtYXRUZW1wID0gRGVmYXVsdFRva2Vucy5SZXBsYWNlS2V5d29yZChvbGRGb3JtYXQsIHNlbGYuUGFydExvY2FsZUlEKCkuT3JpZ2luYWxUb2tlbigpLCBzZWxmLlBhcnRMb2NhbGVJRCgpLkN1cnJlbmN5U3ltYm9sKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5QYXJ0REJOdW1iZXJGb3JtYXQoKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZXhjZWxGb3JtYXRTdHJpbmcgPSBEZWZhdWx0VG9rZW5zLlJlcGxhY2VLZXl3b3JkKHNlbGYuZXhjZWxGb3JtYXRTdHJpbmcsIHNlbGYuUGFydERCTnVtYmVyRm9ybWF0KCkuT3JpZ2luYWxUb2tlbigpLCBzZWxmLlBhcnREQk51bWJlckZvcm1hdCgpLnRvU3RyaW5nKCkpOyAvLyBjaGFuZ2UgZGJudW0xIC0+IERCTnVtMVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3JtYXRUZW1wID0gRGVmYXVsdFRva2Vucy5GaWx0ZXIoZm9ybWF0VGVtcCwgRGVmYXVsdFRva2Vucy5MZWZ0U3F1YXJlQnJhY2tldCwgRGVmYXVsdFRva2Vucy5SaWdodFNxdWFyZUJyYWNrZXQpO1xuXG4gICAgICAgICAgICAvL0ZyYWN0aW9uOlxuICAgICAgICAgICAgdmFyIHNvbGlkdXNJbmRleCA9IGZvcm1hdFRlbXAuaW5kZXhPZihEZWZhdWx0VG9rZW5zLlNvbGlkdXNTaWduKTtcbiAgICAgICAgICAgIGlmIChzb2xpZHVzSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGZvcm1hdFRlbXAgPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShmb3JtYXRUZW1wLCBcIlxcXFxcIiArIERlZmF1bHRUb2tlbnMuUXVlc3Rpb25NYXJrLCBEZWZhdWx0VG9rZW5zLlplcm8pO1xuICAgICAgICAgICAgICAgIHZhciBzcCA9IGZvcm1hdFRlbXAuc3BsaXQoRGVmYXVsdFRva2Vucy5Tb2xpZHVzU2lnbik7XG4gICAgICAgICAgICAgICAgaWYgKHNwICYmIHNwLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmZyYWN0aW9uRGVub21pbmF0b3JGb3JtYXQgPSBzcFsxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnQgPSBzcFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrakluZGV4ID0gbGVmdC5sYXN0SW5kZXhPZihEZWZhdWx0VG9rZW5zLlNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrakluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmZyYWN0aW9uSW50ZWdlckZvcm1hdCA9IGxlZnQuc3Vic3RyKDAsIGtqSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZnJhY3Rpb25OdW1lcmF0b3JGb3JtYXQgPSBsZWZ0LnN1YnN0cihrakluZGV4ICsgMSwgbGVmdC5sZW5ndGggLSBrakluZGV4IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZnJhY3Rpb25OdW1lcmF0b3JGb3JtYXQgPSBsZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLm51bWJlckZvcm1hdFN0cmluZyA9IGZvcm1hdFRlbXA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmRQcm90b3R5cGUgPSBOdW1iZXJGb3JtYXREaWdpdGFsLnByb3RvdHlwZTtcblxuICAgICAgICBuZFByb3RvdHlwZS5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5iYXNlTnVtYmVyU3RyaW5nQ29udmVydGVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuYmFzZU51bWJlclN0cmluZ0NvbnZlcnRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXJGb3JtYXREaWdpdGFsLmRlZmF1bHROdW1iZXJTdHJpbmdDb252ZXJ0ZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU2V0XG4gICAgICAgICAgICAgICAgc2VsZi5iYXNlTnVtYmVyU3RyaW5nQ29udmVydGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbmRQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnVsbEZvcm1hdFN0cmluZztcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5OdW1iZXJGb3JtYXRJbmZvID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vR2V0XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYmFzZU51bWJlckZvcm1hdEluZm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5iYXNlTnVtYmVyRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLlBhcnRMb2NhbGVJRCgpICYmIHNlbGYuUGFydExvY2FsZUlEKCkuQ3VsdHVyZUluZm8oKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5QYXJ0TG9jYWxlSUQoKS5DdWx0dXJlSW5mbygpLk51bWJlckZvcm1hdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmJhc2VDdWx0dXJlTmFtZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLmdldEN1bHR1cmUoc2VsZi5iYXNlQ3VsdHVyZU5hbWUoKSkuTnVtYmVyRm9ybWF0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL1NldFxuICAgICAgICAgICAgICAgIHNlbGYuYmFzZU51bWJlckZvcm1hdEluZm8odmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5Jc0dlbmVyYWxOdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy9HZXRcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5pc0dlbmVyYWxOdW1iZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vU2V0XG4gICAgICAgICAgICAgICAgc2VsZi5pc0dlbmVyYWxOdW1iZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbmRQcm90b3R5cGUuRXhjZWxDb21wYXRpYmxlRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhjZWxGb3JtYXRTdHJpbmc7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmRQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYgKGZvcm1hdHRlclV0aWxzLnV0aWwuaXNUeXBlKG9iaiwgJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG51bSA9IGZvcm1hdHRlclV0aWxzLkZvcm1hdENvbnZlcnRlci5Ub0RvdWJsZShvYmopO1xuICAgICAgICAgICAgaWYgKGlzTmFOKG51bSkgfHwgIWlzRmluaXRlKG51bSkgfHwgaXNOYU4ob2JqKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHNlbGYuTmFOU3ltYm9sKCk7XG4gICAgICAgICAgICB2YXIgc2IgPSBrZXl3b3JkX251bGw7XG5cbiAgICAgICAgICAgIHZhciBjdWx0dXJlSW5mbztcblxuICAgICAgICAgICAgaWYgKHNlbGYuQ3VsdHVyZU5hbWUoKSkge1xuICAgICAgICAgICAgICAgIGN1bHR1cmVJbmZvID0gZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5nZXRDdWx0dXJlKHNlbGYuQ3VsdHVyZU5hbWUoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1bHR1cmVJbmZvID0gZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmZyYWN0aW9uTnVtZXJhdG9yRm9ybWF0ICYmIHNlbGYuZnJhY3Rpb25EZW5vbWluYXRvckZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHZhciBvdXRfaW50ZWdlciA9IHsndmFsdWUnOiAwLjB9O1xuICAgICAgICAgICAgICAgIHZhciBvdXRfbnVtZXJhdG9yID0geyd2YWx1ZSc6IDAuMH07XG4gICAgICAgICAgICAgICAgdmFyIG91dF9kZW5vbWluYXRvciA9IHsndmFsdWUnOiAwLjB9O1xuICAgICAgICAgICAgICAgIHZhciBkID0gc2VsZi5mcmFjdGlvbkRlbm9taW5hdG9yRm9ybWF0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyRm9ybWF0RGlnaXRhbC5HZXRGcmFjdGlvbihudW0sIGQsIG91dF9pbnRlZ2VyLCBvdXRfbnVtZXJhdG9yLCBvdXRfZGVub21pbmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wVmFsdWUgPSBzZWxmLkdldEdDRChvdXRfbnVtZXJhdG9yLnZhbHVlLCBvdXRfZGVub21pbmF0b3IudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcFZhbHVlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0X251bWVyYXRvci52YWx1ZSAvPSB0ZW1wVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRfZGVub21pbmF0b3IudmFsdWUgLz0gdGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuZnJhY3Rpb25JbnRlZ2VyRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3V0X2ludGVnZXIudmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYiArPSAobmV3IGZvcm1hdHRlclV0aWxzLl9OdW1iZXJIZWxwZXIob3V0X2ludGVnZXIudmFsdWUpLmN1c3RvbUN1bHR1cmVGb3JtYXQoc2VsZi5mcmFjdGlvbkludGVnZXJGb3JtYXQsIGN1bHR1cmVJbmZvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2IgKz0gKERlZmF1bHRUb2tlbnMuU3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3V0X2ludGVnZXIudmFsdWUgPT09IDAgJiYgbnVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNiICs9IChEZWZhdWx0VG9rZW5zLm5lZ2F0aXZlU2lnbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW0gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYiArPSAoXCIwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVub21pbmF0b3JGb3JtYXQgPSBzZWxmLmZyYWN0aW9uRGVub21pbmF0b3JGb3JtYXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZml4ZWREZW5vbWluYXRvciA9IHBhcnNlRmxvYXQoZGVub21pbmF0b3JGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihmaXhlZERlbm9taW5hdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXhlZERlbm9taW5hdG9yID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRfbnVtZXJhdG9yLnZhbHVlICo9IGZpeGVkRGVub21pbmF0b3IgLyBvdXRfZGVub21pbmF0b3IudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yRm9ybWF0ID0gc3RyaW5nRXguRW1wdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dF9kZW5vbWluYXRvci52YWx1ZSA9IGZpeGVkRGVub21pbmF0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmF0b3JWYWx1ZVJvdW5kVXAgPSBNYXRoX2NlaWwob3V0X251bWVyYXRvci52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gbnVtZXJhdG9yVmFsdWVSb3VuZFVwIC0gb3V0X251bWVyYXRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXAgPD0gMC41ICYmIHRlbXAgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0X251bWVyYXRvci52YWx1ZSA9IHBhcnNlRmxvYXQobnVtZXJhdG9yVmFsdWVSb3VuZFVwLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0X251bWVyYXRvci52YWx1ZSA9IHBhcnNlRmxvYXQoKG51bWVyYXRvclZhbHVlUm91bmRVcCAtIDEpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXggbnVtZXJhdG9yRm9ybWF0IHN0cmluZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmF0b3JGb3JtYXQgPSBzZWxmLmZyYWN0aW9uTnVtZXJhdG9yRm9ybWF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpeGVkTnVtZXJhdG9yRm9ybWEgPSBwYXJzZUZsb2F0KG51bWVyYXRvckZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKGZpeGVkTnVtZXJhdG9yRm9ybWEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpeGVkTnVtZXJhdG9yRm9ybWEgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bWVyYXRvckZvcm1hdExlbmd0aCA9IG51bWVyYXRvckZvcm1hdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmF0b3JTdHJpbmcgPSBvdXRfbnVtZXJhdG9yLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmF0b3JMZW5ndGggPSBudW1lcmF0b3JTdHJpbmcubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtZXJhdG9yRm9ybWF0TGVuZ3RoID4gbnVtZXJhdG9yTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmF0b3JGb3JtYXQgPSBudW1lcmF0b3JGb3JtYXQuc3Vic3RyKDAsIG51bWVyYXRvckZvcm1hdExlbmd0aCAtIChudW1lcmF0b3JGb3JtYXRMZW5ndGggLSBudW1lcmF0b3JMZW5ndGgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChudW1lcmF0b3JGb3JtYXRMZW5ndGggPCBudW1lcmF0b3JMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyYXRvclN0cmluZyA9IG51bWVyYXRvclN0cmluZy5zdWJzdHIoMCwgbnVtZXJhdG9yTGVuZ3RoIC0gKG51bWVyYXRvckxlbmd0aCAtIG51bWVyYXRvckZvcm1hdExlbmd0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0X251bWVyYXRvci52YWx1ZSA9IHBhcnNlSW50KG51bWVyYXRvclN0cmluZywgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3V0X251bWVyYXRvci52YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNiICs9IChuZXcgZm9ybWF0dGVyVXRpbHMuX051bWJlckhlbHBlcihvdXRfbnVtZXJhdG9yLnZhbHVlKS5jdXN0b21DdWx0dXJlRm9ybWF0KG51bWVyYXRvckZvcm1hdCwgY3VsdHVyZUluZm8pLnJlcGxhY2UoL14wKi8sICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2IgKz0gKERlZmF1bHRUb2tlbnMuU29saWR1c1NpZ24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNiICs9IChuZXcgZm9ybWF0dGVyVXRpbHMuX051bWJlckhlbHBlcihvdXRfZGVub21pbmF0b3IudmFsdWUpLmN1c3RvbUN1bHR1cmVGb3JtYXQoZGVub21pbmF0b3JGb3JtYXQsIGN1bHR1cmVJbmZvKS5yZXBsYWNlKC9eMCovLCAnJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2IgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gb3V0X2ludGVnZXIudmFsdWUgKiBvdXRfZGVub21pbmF0b3IudmFsdWUgKyBvdXRfbnVtZXJhdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlbm9taW5hdG9yRm9ybWF0ID0gc2VsZi5mcmFjdGlvbkRlbm9taW5hdG9yRm9ybWF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpeGVkRGVub21pbmF0b3IgPSBwYXJzZUZsb2F0KGRlbm9taW5hdG9yRm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXhlZERlbm9taW5hdG9yID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICo9IGZpeGVkRGVub21pbmF0b3IgLyBvdXRfZGVub21pbmF0b3IudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVub21pbmF0b3JGb3JtYXQgPSBzdHJpbmdFeC5FbXB0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRfZGVub21pbmF0b3IudmFsdWUgPSBmaXhlZERlbm9taW5hdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1lcmF0b3JWYWx1ZVJvdW5kVXAgPSBNYXRoX2NlaWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gbnVtZXJhdG9yVmFsdWVSb3VuZFVwIC0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXAgPD0gMC41ICYmIHRlbXAgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQobnVtZXJhdG9yVmFsdWVSb3VuZFVwLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCgobnVtZXJhdG9yVmFsdWVSb3VuZFVwIC0gMSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNiICs9ICh2YWx1ZSArIERlZmF1bHRUb2tlbnMuU29saWR1c1NpZ24gKyBvdXRfZGVub21pbmF0b3IudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYiArPSAobmV3IGZvcm1hdHRlclV0aWxzLl9OdW1iZXJIZWxwZXIodmFsdWUpLmN1c3RvbUN1bHR1cmVGb3JtYXQoc2VsZi5mcmFjdGlvbk51bWVyYXRvckZvcm1hdCwgY3VsdHVyZUluZm8pLnJlcGxhY2UoL14wKi8sICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2IgKz0gKERlZmF1bHRUb2tlbnMuU29saWR1c1NpZ24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNiICs9IChuZXcgZm9ybWF0dGVyVXRpbHMuX051bWJlckhlbHBlcihvdXRfZGVub21pbmF0b3IudmFsdWUpLmN1c3RvbUN1bHR1cmVGb3JtYXQoc2VsZi5mcmFjdGlvbkRlbm9taW5hdG9yRm9ybWF0LCBjdWx0dXJlSW5mbykucmVwbGFjZSgvXjAqLywgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogdG9TdHJpbmcgd2l0aCBhcmd1bWVudHMuXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIG51bS50b1N0cmluZyhzZWxmLk51bWJlckZvcm1hdEluZm8oKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vcmVzdWx0ID0gbnVtYmVyLm51bWJlckZvcm1hdChzZWxmLkVuY29kZU51bWJlckZvcm1hdChzZWxmLm51bWJlckZvcm1hdFN0cmluZykpO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBmb3JtYXR0ZXJVdGlscy5fTnVtYmVySGVscGVyKG51bSkuY3VzdG9tQ3VsdHVyZUZvcm1hdChzZWxmLkVuY29kZU51bWJlckZvcm1hdChzZWxmLm51bWJlckZvcm1hdFN0cmluZyksIGN1bHR1cmVJbmZvKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5OdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmLk51bWJlclN0cmluZ0NvbnZlcnRlcigpLkNvbnZlcnRUbyhyZXN1bHQsIG9iaiwgc2VsZi5pc0dlbmVyYWxOdW1iZXIsIHNlbGYuUGFydExvY2FsZUlEKCksIHNlbGYuUGFydERCTnVtYmVyRm9ybWF0KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5QYXJzZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzID0gc2VsZi5UcmltU3BlY2lhbFN5bWJvbChzKTtcbiAgICAgICAgICAgIHMgPSBzZWxmLlRyaW1DdXJyZW5jeVN5bWJvbChzKTtcbiAgICAgICAgICAgIGlmICghcyB8fCBzID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJ1ZyAzMjAsXG4gICAgICAgICAgICAvLyB5b3Uga25vdyB0aGUgZG91YmxlLlRyeVBhcnNlIGNhbiBwYXJzZSB0aGUgdGV4dCBhcyBcIjIsXCIgdG8gMixcbiAgICAgICAgICAgIC8vIHRoZSBmaXhlcyBqdXN0IGhhcmQgY29kZSB0byBmb3JiaWQgdGhlIGNvbW1hIGVuZGluZyB0ZXh0IHBhcnNpbmcuXG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkVuZHNXaXRoKHMsIERlZmF1bHRUb2tlbnMubnVtYmVyR3JvdXBTZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJUZW1wID0gTnVtYmVySGVscGVyLkZpeEphcGFuZXNlQ2hhcnMocyk7XG4gICAgICAgICAgICBpZiAocy50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzLnRvTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlzRGVjaW1hbCA9IERlZmF1bHRUb2tlbnMuSXNEZWNpbWFsKHN0clRlbXAsIHNlbGYuTnVtYmVyRm9ybWF0SW5mbygpKTtcbiAgICAgICAgICAgIHZhciBFSW5kZXggPSBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuSW5kZXhPZihzdHJUZW1wLCBEZWZhdWx0VG9rZW5zLkV4cG9uZW50aWFsU3ltYm9sLCAxIC8qIEN1cnJlbnRDdWx0dXJlSWdub3JlQ2FzZSAqLyk7XG4gICAgICAgICAgICB2YXIgaXNFID0gRUluZGV4ID4gLTE7XG4gICAgICAgICAgICBpZiAoc2VsZi5udW1iZXJGb3JtYXRTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0X3BlcmNlbnRTaWduQ291bnQgPSB7J3ZhbHVlJzogMH07XG4gICAgICAgICAgICAgICAgcyA9IHNlbGYuVHJpbVBlcmNlbnRTaWduKHMsIG91dF9wZXJjZW50U2lnbkNvdW50KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHIgPSBzO1xuICAgICAgICAgICAgICAgIGlmIChpc0UpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gcy5zdWJzdHIoMCwgRUluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0clswXSA9PT0gRGVmYXVsdFRva2Vucy5OdW1iZXJGb3JtYXRJbmZvKCkucG9zaXRpdmVTaWduKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgICAgIHMgPSBzLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBTID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlcGxhY2Uoc3RyLCBEZWZhdWx0VG9rZW5zLm51bWJlckdyb3VwU2VwYXJhdG9yLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0ZW1wUy5pbmRleE9mKERlZmF1bHRUb2tlbnMuRGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0ZW1wUy5sYXN0SW5kZXhPZihEZWZhdWx0VG9rZW5zLkRlY2ltYWxTZXBhcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHJCdWlsZGVyID0gXCIjLCMjMFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWlsZGVyICs9IChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbExlbmd0aCA9IHRlbXBTLmxlbmd0aCAtIGluZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjaW1hbExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVpbGRlciArPSAoXCIwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdTID0gbmV3IEdlbmVyYWxGb3JtYXR0ZXIoc3RyQnVpbGRlcikuRm9ybWF0KHRlbXBTKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1MgPT09IHN0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSB0ZW1wUyArIHMuc3Vic3RyKEVJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMgPSB0ZW1wUztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUZsb2F0KHMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG5SZWdFeHAgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnRvU3RyaW5nKCkgIT09IHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5maSA9IHNlbGYuTnVtYmVyRm9ybWF0SW5mbygpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbFNlcGFyYXRvciA9IERlZmF1bHRUb2tlbnMuRGVjaW1hbFNlcGFyYXRvcjtcblxuICAgICAgICAgICAgICAgICAgICAvL2lmIChuZmkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgZGVjaW1hbFNlcGFyYXRvciA9IG5maS5udW1iZXJEZWNpbWFsU2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0RlY2ltYWwgJiYgIWlzRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgblJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJeKChcXFxcK3wtKT9cXFxcZCspJFwiLCBcImlnXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzRGVjaW1hbCAmJiAhaXNFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuUmVnRXhwID0gbmV3IFJlZ0V4cChcIl4oKFxcXFwrfC0pP1xcXFxkKilcIiArIGRlY2ltYWxTZXBhcmF0b3IgKyBcIihcXFxcZCopJFwiLCBcImlnXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFpc0RlY2ltYWwgJiYgaXNFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuUmVnRXhwID0gbmV3IFJlZ0V4cChcIl4oKFxcXFwrfC0pP1xcXFxkKykoKEUoXFxcXCt8LSk/fGUoXFxcXCt8LSk/KVxcXFxkKykkXCIsIFwiaWdcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNEZWNpbWFsICYmIGlzRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgblJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJeKChcXFxcK3wtKT9cXFxcZCopXCIgKyBkZWNpbWFsU2VwYXJhdG9yICsgXCIoXFxcXGQqKSgoRShcXFxcK3wtKT98ZShcXFxcK3wtKT8pXFxcXGQrKSRcIiwgXCJpZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWUpICYmIGlzRmluaXRlKHZhbHVlKSAmJiAoIW5SZWdFeHAgfHwgblJlZ0V4cC50ZXN0KHMpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0X3BlcmNlbnRTaWduQ291bnQudmFsdWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gcGFyc2VGbG9hdCgoMTAwLjAgKiBvdXRfcGVyY2VudFNpZ25Db3VudC52YWx1ZSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IDAgJiYgTWF0aF9hYnModmFsdWUgLSBNYXRoX2Zsb29yKHZhbHVlKSkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVjaW1hbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlY2ltYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuVG9PYmplY3QodmFsdWUsIGlzRGVjaW1hbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5kUHJvdG90eXBlLkVuY29kZU51bWJlckZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhckFycmF5ID0gZm9ybWF0LnNwbGl0KFwiXCIpO1xuICAgICAgICAgICAgICAgIHZhciBzdHJCdWlsZGVyID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJBcnJheS5sZW5ndGggLSAxOykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhckFycmF5W2ldID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVpbGRlciArPSAoY2hhckFycmF5W2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWlsZGVyICs9IChjaGFyQXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpID09PSBjaGFyQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhckFycmF5W2ldICE9PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVpbGRlciArPSAoY2hhckFycmF5W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBzdHJCdWlsZGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5Ub09iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSwgaXNEZWNpbWFsKSB7XG4gICAgICAgICAgICBpZiAoIWlzRGVjaW1hbCkge1xuICAgICAgICAgICAgICAgIC8vSmF2YXNjcmlwdCBtYXggZXhhY3QgcHJlY2lzaW9uIHRvIDE2IGRlY2ltYWxzLCBhbmQgbWluIHZhbHVlIG9mIGV4cG9uZW50IGl0IDFFKzIyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIDw9IDFFKzIyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmRQcm90b3R5cGUuVHJpbVBlcmNlbnRTaWduID0gZnVuY3Rpb24gKHMsIG91dF9jb3VudCkge1xuICAgICAgICAgICAgb3V0X2NvdW50LnZhbHVlID0gMDtcbiAgICAgICAgICAgIGlmICghcyB8fCBzID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RyVGVtcCA9IHM7XG4gICAgICAgICAgICB2YXIgcGVyY2VudFN5bWJvbCA9IERlZmF1bHRUb2tlbnMucGVyY2VudFN5bWJvbDtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHMuaW5kZXhPZihwZXJjZW50U3ltYm9sKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gcy5sZW5ndGggLSAxICYmIGluZGV4ID09PSBzLmxhc3RJbmRleE9mKHBlcmNlbnRTeW1ib2wpKSB7XG4gICAgICAgICAgICAgICAgc3RyVGVtcCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZXBsYWNlKHN0clRlbXAsIHBlcmNlbnRTeW1ib2wsIFwiXCIpO1xuICAgICAgICAgICAgICAgIG91dF9jb3VudC52YWx1ZSArPSAoKHMubGVuZ3RoIC0gc3RyVGVtcC5sZW5ndGgpIC8gcGVyY2VudFN5bWJvbC5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0clRlbXA7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmRQcm90b3R5cGUuVHJpbVNwZWNpYWxTeW1ib2wgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgaWYgKCFzIHx8IHMgPT09IHN0cmluZ0V4LkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdHJUZW1wID0gcztcblxuICAgICAgICAgICAgdmFyIGZpcnN0RGlnaXRhbCA9IC0xO1xuICAgICAgICAgICAgZm9yICh2YXIgZmQgPSAwOyBmZCA8IHN0clRlbXAubGVuZ3RoOyBmZCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXIuSXNEaWdpdChzdHJUZW1wW2ZkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3REaWdpdGFsID0gZmQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxhc3REaWdpdGFsID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBsZCA9IHN0clRlbXAubGVuZ3RoIC0gMTsgbGQgPiAtMTsgbGQtLSkge1xuICAgICAgICAgICAgICAgIGlmIChjaGFyLklzRGlnaXQoc3RyVGVtcFtsZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3REaWdpdGFsID0gbGQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgbiA9IHN0clRlbXAubGVuZ3RoIC0gMTsgbiA+IC0xOyBuLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHN0clRlbXBbbl07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuSXNTcGVjaWFsU3ltYm9sKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFyLklzV2hpdGVTcGFjZShjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBmaXJzdERpZ2l0YWwgfHwgbGFzdERpZ2l0YWwgPCBuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyVGVtcCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZW1vdmUoc3RyVGVtcCwgbiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJUZW1wID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShzdHJUZW1wLCBuLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjID09PSAnLScgfHwgYyA9PT0gJysnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyVGVtcFtuIC0gMV0gIT09ICdlJyAmJiBzdHJUZW1wW24gLSAxXSAhPT0gJ0UnICYmIHN0clRlbXBbbiAtIDFdICE9PSAnKCcgJiYgc3RyVGVtcFtuIC0gMV0udG9TdHJpbmcoKSAhPT0gRGVmYXVsdFRva2Vucy5OdW1iZXJGb3JtYXRJbmZvKCkuY3VycmVuY3lTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3RyVGVtcDtcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5Jc1N0YW5kYXJkTnVtYmVyU3ltYm9sID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXRQcm92aWRlciA9IHRoaXMuTnVtYmVyRm9ybWF0SW5mbygpID8gdGhpcy5OdW1iZXJGb3JtYXRJbmZvKCkgOiBEZWZhdWx0VG9rZW5zLk51bWJlckZvcm1hdEluZm8oKTtcbiAgICAgICAgICAgIGlmIChmb3JtYXRQcm92aWRlcikge1xuICAgICAgICAgICAgICAgIHZhciBzdHIgPSBjLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIuY3VycmVuY3lEZWNpbWFsU2VwYXJhdG9yIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIuY3VycmVuY3lHcm91cFNlcGFyYXRvciB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLmN1cnJlbmN5U3ltYm9sIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIubmFuU3ltYm9sIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIubmVnYXRpdmVJbmZpbml0eVN5bWJvbCB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLm5lZ2F0aXZlU2lnbiB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLm51bWJlckRlY2ltYWxTZXBhcmF0b3IgfHwgc3RyID09PSBmb3JtYXRQcm92aWRlci5udW1iZXJHcm91cFNlcGFyYXRvciB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLnBlcmNlbnREZWNpbWFsU2VwYXJhdG9yIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIucGVyY2VudEdyb3VwU2VwYXJhdG9yIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIucGVyY2VudFN5bWJvbCB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLnBlck1pbGxlU3ltYm9sIHx8IHN0ciA9PT0gZm9ybWF0UHJvdmlkZXIucG9zaXRpdmVJbmZpbml0eVN5bWJvbCB8fCBzdHIgPT09IGZvcm1hdFByb3ZpZGVyLnBvc2l0aXZlU2lnbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5Jc1NwZWNpYWxTeW1ib2wgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgaWYgKHRoaXMuSXNTdGFuZGFyZE51bWJlclN5bWJvbChjKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNoYXIuSXNXaGl0ZVNwYWNlKGMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZFByb3RvdHlwZS5UcmltQ3VycmVuY3lTeW1ib2wgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgaWYgKCFzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZm9ybWF0UHJvdmlkZXIgPSB0aGlzLk51bWJlckZvcm1hdEluZm8oKSA/IHRoaXMuTnVtYmVyRm9ybWF0SW5mbygpIDogRGVmYXVsdFRva2Vucy5OdW1iZXJGb3JtYXRJbmZvKCk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0UHJvdmlkZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVuY3lTeW1ib2wgPSBmb3JtYXRQcm92aWRlci5jdXJyZW5jeVN5bWJvbDtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzLnRvU3RyaW5nKCkuaW5kZXhPZihjdXJyZW5jeVN5bWJvbCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwICYmIGluZGV4ID09PSBzLmxhc3RJbmRleE9mKGN1cnJlbmN5U3ltYm9sKSkge1xuICAgICAgICAgICAgICAgICAgICBzID0gcy5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0RGlnaXRhbC5rZXlXb3Jkc1NldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmQ2xhc3MgPSBOdW1iZXJGb3JtYXREaWdpdGFsO1xuICAgICAgICAgICAgaWYgKCFzZWxmQ2xhc3MuX2tleVdvcmRzU2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZkNsYXNzLmtleXdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtzZWxmQ2xhc3Mua2V5d29yZHNbaV1dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZkNsYXNzLl9rZXlXb3Jkc1NldCA9IG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmQ2xhc3MuX2tleVdvcmRzU2V0O1xuICAgICAgICB9O1xuXG4gICAgICAgIE51bWJlckZvcm1hdERpZ2l0YWwuRXZhbHVhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyRm9ybWF0QmFzZS5Db250YWluc0tleXdvcmRzKGZvcm1hdCwgTnVtYmVyRm9ybWF0RGlnaXRhbC5rZXl3b3JkcywgTnVtYmVyRm9ybWF0RGlnaXRhbC5rZXlXb3Jkc1NldCgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXREaWdpdGFsLkdldEZyYWN0aW9uID0gZnVuY3Rpb24gKHZhbHVlLCBkZW5vbWluYXRvckRpZ2l0cywgb3V0X2ludGVnZXIsIG91dF9udW1lcmF0b3IsIG91dF9kZW5vbWluYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlckhlbHBlci5HZXRGcmFjdGlvbih2YWx1ZSwgZGVub21pbmF0b3JEaWdpdHMsIG91dF9pbnRlZ2VyLCBvdXRfbnVtZXJhdG9yLCBvdXRfZGVub21pbmF0b3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG5kUHJvdG90eXBlLkdldEdDRCA9IGZ1bmN0aW9uICh2YWx1ZTEsIHZhbHVlMikge1xuICAgICAgICAgICAgaWYgKHZhbHVlMSA9PSAwLjApXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGhfYWJzKHZhbHVlMik7XG4gICAgICAgICAgICBpZiAodmFsdWUyID09IDAuMClcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aF9hYnModmFsdWUxKTtcblxuICAgICAgICAgICAgdmFyIG1heCA9IE1hdGhfbWF4KHZhbHVlMSwgdmFsdWUyKTtcbiAgICAgICAgICAgIHZhciBtaW4gPSBNYXRoX21pbih2YWx1ZTEsIHZhbHVlMik7XG4gICAgICAgICAgICB2YXIgdmFsdWUzID0gbWF4ICUgbWluO1xuXG4gICAgICAgICAgICB3aGlsZSAodmFsdWUzICE9IDAuMCkge1xuICAgICAgICAgICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgICAgICAgICBtaW4gPSB2YWx1ZTM7XG4gICAgICAgICAgICAgICAgdmFsdWUzID0gbWF4ICUgbWluO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gTWF0aF9hYnMobWluKTtcbiAgICAgICAgfTtcbiAgICAgICAgTnVtYmVyRm9ybWF0RGlnaXRhbC5kZWZhdWx0TnVtYmVyU3RyaW5nQ29udmVydGVyID0gbmV3IERlZmF1bHROdW1iZXJTdHJpbmdDb252ZXJ0ZXIoKTtcblxuICAgICAgICBOdW1iZXJGb3JtYXREaWdpdGFsLmtleXdvcmRzID0gW1xuICAgICAgICAgICAgRGVmYXVsdFRva2Vucy5FeHBvbmVudGlhbDEsXG4gICAgICAgICAgICBEZWZhdWx0VG9rZW5zLkV4cG9uZW50aWFsMixcbiAgICAgICAgICAgIERlZmF1bHRUb2tlbnMuTnVtYmVyU2lnbixcbiAgICAgICAgICAgIERlZmF1bHRUb2tlbnMuRGVjaW1hbFNlcGFyYXRvcixcbiAgICAgICAgICAgIERlZmF1bHRUb2tlbnMubnVtYmVyR3JvdXBTZXBhcmF0b3IsXG4gICAgICAgICAgICBEZWZhdWx0VG9rZW5zLnBlcmNlbnRTeW1ib2wsXG4gICAgICAgICAgICBEZWZhdWx0VG9rZW5zLlplcm8sXG4gICAgICAgICAgICBEZWZhdWx0VG9rZW5zLlNvbGlkdXNTaWduXTtcbiAgICAgICAgcmV0dXJuIE51bWJlckZvcm1hdERpZ2l0YWw7XG4gICAgfSkoTnVtYmVyRm9ybWF0QmFzZSk7XG5cbiAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIk51bWJlckZvcm1hdEdlbmVyYWxcIj5cbiAgICB2YXIgTnVtYmVyRm9ybWF0R2VuZXJhbCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhOdW1iZXJGb3JtYXRHZW5lcmFsLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBOdW1iZXJGb3JtYXRHZW5lcmFsKGZvcm1hdCwgcGFydExvY2FsZUlELCBkYk51bWJlckZvcm1hdFBhcnQsIGN1bHR1cmVOYW1lKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBfc3VwZXIuY2FsbChzZWxmLCBwYXJ0TG9jYWxlSUQsIGRiTnVtYmVyRm9ybWF0UGFydCwgY3VsdHVyZU5hbWUpO1xuICAgICAgICAgICAgc2VsZi5kaWdpdGFsRm9ybWF0ID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgc2VsZi5leHBvbmVudGlhbERpZ2l0YWxGb3JtYXQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLmZ1bGxGb3JtYXRTdHJpbmcgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICBzZWxmLl9jbGFzc05hbWVzLnB1c2goXCJOdW1iZXJGb3JtYXRHZW5lcmFsXCIpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyRm9ybWF0R2VuZXJhbC5FdmFsdWF0ZUZvcm1hdChmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXQuaW5kZXhPZihEZWZhdWx0VG9rZW5zLlplcm8pID49IDAgfHwgZm9ybWF0LmluZGV4T2YoRGVmYXVsdFRva2Vucy5OdW1iZXJTaWduKSA+PSAwIHx8IGZvcm1hdC5pbmRleE9mKERlZmF1bHRUb2tlbnMuRGVjaW1hbFNlcGFyYXRvcikgPj0gMCB8fCBmb3JtYXQuaW5kZXhPZihEZWZhdWx0VG9rZW5zLkNvbW1lcmNpYWxBdCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZ2xvYmFsaXplLlN0cmluZ1Jlc291cmVzLlNSLkV4cF9Gb3JtYXRJbGxlZ2FsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZnVsbEZvcm1hdFN0cmluZyA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBnbG9iYWxpemUuU3RyaW5nUmVzb3VyZXMuU1IuRXhwX0Zvcm1hdElsbGVnYWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmZ1bGxGb3JtYXRTdHJpbmcgPSBOdW1iZXJGb3JtYXRCYXNlLkdlbmVyYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmdQcm90b3R5cGUgPSBOdW1iZXJGb3JtYXRHZW5lcmFsLnByb3RvdHlwZTtcblxuICAgICAgICBuZ1Byb3RvdHlwZS5EaWdpdGFsRm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFzZWxmLmRpZ2l0YWxGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmZTdHJpbmdUbXAgPSBzZWxmLmZ1bGxGb3JtYXRTdHJpbmc7XG4gICAgICAgICAgICAgICAgbmZTdHJpbmdUbXAgPSBEZWZhdWx0VG9rZW5zLlJlcGxhY2VLZXl3b3JkKG5mU3RyaW5nVG1wLCBOdW1iZXJGb3JtYXRCYXNlLkdlbmVyYWwsIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbE51bWJlcik7XG4gICAgICAgICAgICAgICAgc2VsZi5kaWdpdGFsRm9ybWF0ID0gbmV3IE51bWJlckZvcm1hdERpZ2l0YWwobmZTdHJpbmdUbXAsIHNlbGYuUGFydExvY2FsZUlEKCksIHNlbGYuUGFydERCTnVtYmVyRm9ybWF0KCksIHNlbGYuQ3VsdHVyZU5hbWUoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kaWdpdGFsRm9ybWF0LklzR2VuZXJhbE51bWJlcih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmLmRpZ2l0YWxGb3JtYXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmdQcm90b3R5cGUuRXhwb25lbnRpYWxEaWdpdGFsRm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFzZWxmLmV4cG9uZW50aWFsRGlnaXRhbEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZXhwb25lbnRpYWxEaWdpdGFsRm9ybWF0ID0gbmV3IE51bWJlckZvcm1hdERpZ2l0YWwoXCIwLiMjIyMjRSswMFwiLCBzZWxmLlBhcnRMb2NhbGVJRCgpLCBzZWxmLlBhcnREQk51bWJlckZvcm1hdCgpLCBzZWxmLkN1bHR1cmVOYW1lKCkpO1xuICAgICAgICAgICAgICAgIHNlbGYuZXhwb25lbnRpYWxEaWdpdGFsRm9ybWF0LklzR2VuZXJhbE51bWJlcih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmLmV4cG9uZW50aWFsRGlnaXRhbEZvcm1hdDtcbiAgICAgICAgfTtcblxuICAgICAgICBuZ1Byb3RvdHlwZS5Gb3JtYXRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlcGxhY2UodGhpcy5mdWxsRm9ybWF0U3RyaW5nLCBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxQbGFjZWhvbGRlciwgTnVtYmVyRm9ybWF0QmFzZS5HZW5lcmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICBuZ1Byb3RvdHlwZS5Gb3JtYXQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMuRm9ybWF0Q29udmVydGVyLklzTnVtYmVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWxsb3dTID0gIXNlbGYuUGFydExvY2FsZUlEKCkgPyB0cnVlIDogc2VsZi5QYXJ0TG9jYWxlSUQoKS5BbGxvd1NjaWVuY2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGZvcm1hdHRlclV0aWxzLkZvcm1hdENvbnZlcnRlci5Ub0RvdWJsZShvYmopO1xuICAgICAgICAgICAgICAgIGlmIChkICE9PSBrZXl3b3JkX3VuZGVmaW5lZCAmJiBkICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChNYXRoX2FicyhkKSA+IDk5OTk5OTk5OTk5ICYmIGFsbG93UykgfHwgKE1hdGhfYWJzKGQpIDwgMUUtMTEgJiYgZCAhPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLkV4cG9uZW50aWFsRGlnaXRhbEZvcm1hdCgpLkZvcm1hdChvYmopO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuRGlnaXRhbEZvcm1hdCgpLkZvcm1hdChvYmopO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzVHlwZShvYmosIFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdFRtcCA9IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5SZXBsYWNlKHNlbGYuRm9ybWF0U3RyaW5nKCksICdcIicsICcnKTtcbiAgICAgICAgICAgICAgICBmb3JtYXRUbXAgPSBEZWZhdWx0VG9rZW5zLlRyaW1Fc2NhcGUoZm9ybWF0VG1wKTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0VG1wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuUmVwbGFjZShmb3JtYXRUbXAsIFwiR2VuZXJhbFwiLCBvYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXJVdGlscy51dGlsLmlzVHlwZShvYmosIFwiYm9vbGVhblwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmdQcm90b3R5cGUuUGFyc2UgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgaWYgKHN0cmluZ0V4LklzTnVsbE9yRW1wdHkocykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhhc01pbiA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIG1pbkluZGV4ID0gZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLkluZGV4T2YocywgXCItXCIpO1xuICAgICAgICAgICAgaWYgKG1pbkluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICghRGVmYXVsdFRva2Vucy5Jc0VxdWFscyhzLmNoYXJBdChtaW5JbmRleCAtIDEpLCBEZWZhdWx0VG9rZW5zLkV4cG9uZW50aWFsU3ltYm9sLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNNaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuQ29udGFpbnMocywgXCIvXCIpIHx8IGhhc01pbiB8fCBmb3JtYXR0ZXJVdGlscy5TdHJpbmdIZWxwZXIuQ29udGFpbnMocywgXCI6XCIpIHx8IGZvcm1hdHRlclV0aWxzLlN0cmluZ0hlbHBlci5Db250YWlucyhzLCBcIi1cIikpIHtcbiAgICAgICAgICAgICAgICAvL3ZhciBkdCA9IERhdGVGb3JtYXRIZWxwZXIuc3RyaW5nMkRhdGUocyk7XG4gICAgICAgICAgICAgICAgdmFyIGR0ID0gZm9ybWF0dGVyVXRpbHMuX0RhdGVUaW1lSGVscGVyLnBhcnNlTG9jYWxlKHMpO1xuXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBpc05hTihEYXRlKVxuICAgICAgICAgICAgICAgIGlmIChkdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRtcCA9IHM7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgdmFyIGhhc1NpZ25OZWdhdGl2ZSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIGlmICh0bXAuY2hhckF0KDApID09PSBEZWZhdWx0VG9rZW5zLm5lZ2F0aXZlU2lnbikge1xuICAgICAgICAgICAgICAgIGhhc1NpZ25OZWdhdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRtcC5jaGFyQXQoMCkgPT09IERlZmF1bHRUb2tlbnMuTnVtYmVyRm9ybWF0SW5mbygpLnBvc2l0aXZlU2lnbikge1xuICAgICAgICAgICAgICAgIGhhc1NpZ25OZWdhdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhhc1BhcmVudGhlc2lzID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoaGFzU2lnbk5lZ2F0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRtcC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0bXAuY2hhckF0KDEpID09PSBEZWZhdWx0VG9rZW5zLkxlZnRQYXJlbnRoZXNpcyAmJiB0bXAuY2hhckF0KHRtcC5sZW5ndGggLSAxKSA9PT0gRGVmYXVsdFRva2Vucy5SaWdodFBhcmVudGhlc2lzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNQYXJlbnRoZXNpcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzU2lnbk5lZ2F0aXZlICYmIGhhc1BhcmVudGhlc2lzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5EaWdpdGFsRm9ybWF0KCkuUGFyc2UoZm9ybWF0dGVyVXRpbHMuU3RyaW5nSGVscGVyLlJlbW92ZShzLCAwLCAxKSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyVXRpbHMudXRpbC5pc1R5cGUocmVzdWx0LCBcIm51bWJlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGhfYWJzKHJlc3VsdCkgKiAoaGFzU2lnbk5lZ2F0aXZlID8gLTEgOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5EaWdpdGFsRm9ybWF0KCkuUGFyc2Uocyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0ga2V5d29yZF91bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxNb250aERheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgXCJNL2RcIiwgXCJNTU0vZFwiLCBcIk1NTU0vZFwiLFxuICAgICAgICAgICAgICAgIFwiZC9NXCIsIFwiZC9NTU1cIiwgXCJkL01NTU1cIixcbiAgICAgICAgICAgICAgICBcIk0tZFwiLCBcIk1NTS1kXCIsIFwiTU1NTS1kXCIsXG4gICAgICAgICAgICAgICAgXCJkLU1cIiwgXCJkLU1NTVwiLCBcImQtTU1NTVwiXTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxZZWFyTW9udGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIFwiTS95XCIsIFwiTU1NL3lcIixcbiAgICAgICAgICAgICAgICBcIk0veXl5eVwiLCBcIk1NTS95eXl5XCIsXG4gICAgICAgICAgICAgICAgXCJNLXlcIiwgXCJNTU0teVwiLFxuICAgICAgICAgICAgICAgIFwiTS15eXl5XCIsIFwiTU1NLXl5eXlcIl07XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsWWVhck1vbnRoRGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBcIk0vZC95XCIsIFwiTU1NL2QveVwiLCBcIk1NTU0vZC95XCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveXl5eVwiLCBcIk1NTS9kL3l5eXlcIiwgXCJNTU1NL2QveXl5eVwiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3lcIiwgXCJkL01NTS95XCIsIFwiZC9NTU1NL3lcIixcbiAgICAgICAgICAgICAgICBcImQvTS95eXl5XCIsIFwiZC9NTU0veXl5eVwiLCBcImQvTU1NTS95eXl5XCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5L00vZFwiLFxuICAgICAgICAgICAgICAgIFwiTS1kLXlcIiwgXCJNTU0tZC15XCIsIFwiTU1NTS1kLXlcIixcbiAgICAgICAgICAgICAgICBcIk0tZC15eXl5XCIsIFwiTU1NLWQteXl5eVwiLCBcIk1NTU0tZC15eXl5XCIsXG4gICAgICAgICAgICAgICAgXCJkLU0teVwiLCBcImQtTU1NLXlcIiwgXCJkLU1NTU0teVwiLFxuICAgICAgICAgICAgICAgIFwiZC1NLXl5eXlcIiwgXCJkLU1NTS15eXl5XCIsIFwiZC1NTU1NLXl5eXlcIixcbiAgICAgICAgICAgICAgICBcInl5eXktTS1kXCJdO1xuICAgICAgICB9O1xuXG4gICAgICAgIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbEhvdXJNaW51dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1wiSDptXCIsIFwiaDptIHR0XCJdO1xuICAgICAgICB9O1xuXG4gICAgICAgIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbEhvdXJNaW51dGVXaXRoRGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgXCJNL2QgSDptXCIsIFwiTU1NL2QgSDptXCIsIFwiTU1NTS9kIEg6bVwiLFxuICAgICAgICAgICAgICAgIFwiZC9NIEg6bVwiLCBcImQvTU1NIEg6bVwiLCBcImQvTU1NTSBIOm1cIixcbiAgICAgICAgICAgICAgICBcIk0veSBIOm1cIiwgXCJNTU0veSBIOm1cIixcbiAgICAgICAgICAgICAgICBcIk0veXl5eSBIOm1cIiwgXCJNTU0veXl5eSBIOm1cIixcbiAgICAgICAgICAgICAgICBcIk0vZC95IEg6bVwiLCBcIk1NTS9kL3kgSDptXCIsIFwiTU1NTS9kL3kgSDptXCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveXl5eSBIOm1cIiwgXCJNTU0vZC95eXl5IEg6bVwiLCBcIk1NTU0vZC95eXl5IEg6bVwiLFxuICAgICAgICAgICAgICAgIFwiTS1kIEg6bVwiLCBcIk1NTS1kIEg6bVwiLCBcIk1NTU0tZCBIOm1cIixcbiAgICAgICAgICAgICAgICBcImQtTSBIOm1cIiwgXCJkLU1NTSBIOm1cIiwgXCJkLU1NTU0gSDptXCIsXG4gICAgICAgICAgICAgICAgXCJNLXkgSDptXCIsIFwiTU1NLXkgSDptXCIsXG4gICAgICAgICAgICAgICAgXCJNLXl5eXkgSDptXCIsIFwiTU1NLXl5eXkgSDptXCIsXG4gICAgICAgICAgICAgICAgXCJNLWQteSBIOm1cIiwgXCJNTU0tZC15IEg6bVwiLCBcIk1NTU0tZC15IEg6bVwiLFxuICAgICAgICAgICAgICAgIFwiTS1kLXl5eXkgSDptXCIsIFwiTU1NLWQteXl5eSBIOm1cIiwgXCJNTU1NLWQteXl5eSBIOm1cIixcbiAgICAgICAgICAgICAgICBcIk0vZCBoOm0gdHRcIiwgXCJNTU0vZCBoOm0gdHRcIiwgXCJNTU1NL2QgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkL00gaDptIHR0XCIsIFwiZC9NTU0gaDptIHR0XCIsIFwiZC9NTU1NIGg6bSB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS95IGg6bSB0dFwiLCBcIk1NTS95IGg6bSB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS95eXl5IGg6bSB0dFwiLCBcIk1NTS95eXl5IGg6bSB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS9kL3kgaDptIHR0XCIsIFwiTU1NL2QveSBoOm0gdHRcIiwgXCJNTU1NL2QveSBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcIk0vZC95eXl5IGg6bSB0dFwiLCBcIk1NTS9kL3l5eXkgaDptIHR0XCIsIFwiTU1NTS9kL3l5eXkgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNLWQgaDptIHR0XCIsIFwiTU1NLWQgaDptIHR0XCIsIFwiTU1NTS1kIGg6bSB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC1NIGg6bSB0dFwiLCBcImQtTU1NIGg6bSB0dFwiLCBcImQtTU1NTSBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcIk0teSBoOm0gdHRcIiwgXCJNTU0teSBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcIk0teXl5eSBoOm0gdHRcIiwgXCJNTU0teXl5eSBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcIk0tZC15IGg6bSB0dFwiLCBcIk1NTS1kLXkgaDptIHR0XCIsIFwiTU1NTS1kLXkgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNLWQteXl5eSBoOm0gdHRcIiwgXCJNTU0tZC15eXl5IGg6bSB0dFwiLCBcIk1NTU0tZC15eXl5IGg6bSB0dFwiXTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlU2Vjb25kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcIkg6bTpzXCIsIFwiaDptOnMgdHRcIiwgXCJIOm06c1wiLCBcImg6bW06c3MgdHRcIl07XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsSG91ck1pbnV0ZVNlY29uZFN1YlNlY29uZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgXCJIOm06cy5GRkZcIixcbiAgICAgICAgICAgICAgICBcImg6bTpzLkZGRiB0dFwiXTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRHZW5lcmFsLkdlbmVyYWxIb3VyTWludXRlU2Vjb25kV2l0aERhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIFwiTS9kIEg6bTpzXCIsIFwiTU1NL2QgSDptOnNcIiwgXCJNTU1NL2QgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcImQvTSBIOm06c1wiLCBcImQvTU1NIEg6bTpzXCIsIFwiZC9NTU1NIEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJNL3kgSDptOnNcIiwgXCJNTU0veSBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiTS95eXl5IEg6bTpzXCIsIFwiTU1NL3l5eXkgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcIk0vZC95IEg6bTpzXCIsIFwiTU1NL2QveSBIOm06c1wiLCBcIk1NTU0vZC95IEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveXl5eSBIOm06c1wiLCBcIk1NTS9kL3l5eXkgSDptOnNcIiwgXCJNTU1NL2QveXl5eSBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3kgSDptOnNcIiwgXCJkL01NTS95IEg6bTpzXCIsIFwiZC9NTU1NL3kgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcImQvTS95eXl5IEg6bTpzXCIsIFwiZC9NTU0veXl5eSBIOm06c1wiLCBcImQvTU1NTS95eXl5IEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5L00vZCBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiTS1kIEg6bTpzXCIsIFwiTU1NLWQgSDptOnNcIiwgXCJNTU1NLWQgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcImQtTSBIOm06c1wiLCBcImQtTU1NIEg6bTpzXCIsIFwiZC1NTU1NIEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJNLXkgSDptOnNcIiwgXCJNTU0teSBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiTS15eXl5IEg6bTpzXCIsIFwiTU1NLXl5eXkgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcIk0tZC15IEg6bTpzXCIsIFwiTU1NLWQteSBIOm06c1wiLCBcIk1NTU0tZC15IEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJNLWQteXl5eSBIOm06c1wiLCBcIk1NTS1kLXl5eXkgSDptOnNcIiwgXCJNTU1NLWQteXl5eSBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiZC1NLXkgSDptOnNcIiwgXCJkLU1NTS15IEg6bTpzXCIsIFwiZC1NTU1NLXkgSDptOnNcIixcbiAgICAgICAgICAgICAgICBcImQtTS15eXl5IEg6bTpzXCIsIFwiZC1NTU0teXl5eSBIOm06c1wiLCBcImQtTU1NTS15eXl5IEg6bTpzXCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5LU0tZCBIOm06c1wiLFxuICAgICAgICAgICAgICAgIFwiTS9kIGg6bTpzIHR0XCIsIFwiTU1NL2QgaDptOnMgdHRcIiwgXCJNTU1NL2QgaDptOnMgdHRcIixcbiAgICAgICAgICAgICAgICBcImQvTSBoOm06cyB0dFwiLCBcImQvTU1NIGg6bTpzIHR0XCIsIFwiZC9NTU1NIGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNL3kgaDptOnMgdHRcIiwgXCJNTU0veSBoOm06cyB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS95eXl5IGg6bTpzIHR0XCIsIFwiTU1NL3l5eXkgaDptOnMgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0vZC95IGg6bTpzIHR0XCIsIFwiTU1NL2QveSBoOm06cyB0dFwiLCBcIk1NTU0vZC95IGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveXl5eSBoOm06cyB0dFwiLCBcIk1NTS9kL3l5eXkgaDptOnMgdHRcIiwgXCJNTU1NL2QveXl5eSBoOm06cyB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3kgaDptOnMgdHRcIiwgXCJkL01NTS95IGg6bTpzIHR0XCIsIFwiZC9NTU1NL3kgaDptOnMgdHRcIixcbiAgICAgICAgICAgICAgICBcImQvTS95eXl5IGg6bTpzIHR0XCIsIFwiZC9NTU0veXl5eSBoOm06cyB0dFwiLCBcImQvTU1NTS95eXl5IGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5L00vZCBoOm06cyB0dFwiLCBcIk0vZC95eXl5IGg6bW06c3MgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0tZCBoOm06cyB0dFwiLCBcIk1NTS1kIGg6bTpzIHR0XCIsIFwiTU1NTS1kIGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkLU0gaDptOnMgdHRcIiwgXCJkLU1NTSBoOm06cyB0dFwiLCBcImQtTU1NTSBoOm06cyB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS15IGg6bTpzIHR0XCIsIFwiTU1NLXkgaDptOnMgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0teXl5eSBoOm06cyB0dFwiLCBcIk1NTS15eXl5IGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNLWQteSBoOm06cyB0dFwiLCBcIk1NTS1kLXkgaDptOnMgdHRcIiwgXCJNTU1NLWQteSBoOm06cyB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS1kLXl5eXkgaDptOnMgdHRcIiwgXCJNTU0tZC15eXl5IGg6bTpzIHR0XCIsIFwiTU1NTS1kLXl5eXkgaDptOnMgdHRcIixcbiAgICAgICAgICAgICAgICBcImQtTS15IGg6bTpzIHR0XCIsIFwiZC1NTU0teSBoOm06cyB0dFwiLCBcImQtTU1NTS15IGg6bTpzIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkLU0teXl5eSBoOm06cyB0dFwiLCBcImQtTU1NLXl5eXkgaDptOnMgdHRcIiwgXCJkLU1NTU0teXl5eSBoOm06cyB0dFwiLFxuICAgICAgICAgICAgICAgIFwieXl5eS1NLWQgaDptOnMgdHRcIl07XG4gICAgICAgIH07XG5cbiAgICAgICAgTnVtYmVyRm9ybWF0R2VuZXJhbC5HZW5lcmFsSG91ck1pbnV0ZVNlY29uZFN1YlNlY29uZFdpdGhEYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBcIk0vZCBIOm06cy5GRkZcIiwgXCJNTU0vZCBIOm06cy5GRkZcIiwgXCJNTU1NL2QgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJkL00gSDptOnMuRkZGXCIsIFwiZC9NTU0gSDptOnMuRkZGXCIsIFwiZC9NTU1NIEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwiTS95IEg6bTpzLkZGRlwiLCBcIk1NTS95IEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwiTS95eXl5IEg6bTpzLkZGRlwiLCBcIk1NTS95eXl5IEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3kgSDptXCIsIFwiZC9NTU0veSBIOm1cIiwgXCJkL01NTU0veSBIOm1cIixcbiAgICAgICAgICAgICAgICBcImQvTS95eXl5IEg6bVwiLCBcImQvbW1tL3l5eXkgSDptXCIsIFwiZC9NTU1NL3l5eXkgSDptXCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5L00vZCBIOm1cIixcbiAgICAgICAgICAgICAgICBcIk0vZC95IEg6bTpzLkZGRlwiLCBcIk1NTS9kL3kgSDptOnMuRkZGXCIsIFwiTU1NTS9kL3kgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveXl5eSBIOm06c1wiLCBcIk1NTS9kL3l5eXkgSDptOnMuRkZGXCIsIFwiTU1NTS9kL3l5eXkgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJkL00veSBIOm06cy5GRkZcIiwgXCJkL01NTS95IEg6bTpzLkZGRlwiLCBcImQvTU1NTS95IEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3l5eXkgSDptOnMuRkZGXCIsIFwiZC9NTU0veXl5eSBIOm06cy5GRkZcIiwgXCJkL01NTU0veXl5eSBIOm06cy5GRkZcIixcbiAgICAgICAgICAgICAgICBcInl5eXkvTS9kIEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwiTS1kIEg6bTpzLkZGRlwiLCBcIk1NTS1kIEg6bTpzLkZGRlwiLCBcIk1NTU0tZCBIOm06cy5GRkZcIixcbiAgICAgICAgICAgICAgICBcImQtTSBIOm06cy5GRkZcIiwgXCJkLU1NTSBIOm06cy5GRkZcIiwgXCJkLU1NTU0gSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJNLXkgSDptOnMuRkZGXCIsIFwiTU1NLXkgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJNLXl5eXkgSDptOnMuRkZGXCIsIFwiTU1NLVl5eXkgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJkLU0teSBIOm1cIiwgXCJkLU1NTS15IEg6bVwiLCBcImQtTU1NTS15IEg6bVwiLFxuICAgICAgICAgICAgICAgIFwiZC1NLXl5eXkgSDptXCIsIFwiZC1NTU0teXl5eSBIOm1cIiwgXCJkLU1NTU0teXl5eSBIOm1cIixcbiAgICAgICAgICAgICAgICBcInl5eXktTS1kIEg6bVwiLFxuICAgICAgICAgICAgICAgIFwiTS1kLXkgSDptOnMuRkZGXCIsIFwiTU1NLWQteSBIOm06cy5GRkZcIiwgXCJNTU1NLWQteSBIOm06cy5GRkZcIixcbiAgICAgICAgICAgICAgICBcIk0tZC15eXl5IEg6bTpzXCIsIFwiTU1NLWQteXl5eSBIOm06cy5GRkZcIiwgXCJNTU1NLWQteXl5eSBIOm06cy5GRkZcIixcbiAgICAgICAgICAgICAgICBcIkQtTS15IEg6bTpzLkZGRlwiLCBcImQtTU1NLXkgSDptOnMuRkZGXCIsIFwiZC1NTU1NLXkgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJELU0teXl5eSBIOm06cy5GRkZcIiwgXCJkLU1NTS15eXl5IEg6bTpzLkZGRlwiLCBcImQtTU1NTS15eXl5IEg6bTpzLkZGRlwiLFxuICAgICAgICAgICAgICAgIFwieXl5eS1NLWQgSDptOnMuRkZGXCIsXG4gICAgICAgICAgICAgICAgXCJNL2QgaDptOnMuRkZGIHR0XCIsIFwiTU1NL2QgaDptOnMuRkZGIHR0XCIsIFwiTU1NTS9kIGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC9NIGg6bTpzLkZGRiB0dFwiLCBcImQvTU1NIGg6bTpzLkZGRiB0dFwiLCBcImQvTU1NTSBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0veSBoOm06cy5GRkYgdHRcIiwgXCJNTU0veSBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0veXl5eSBoOm06cy5GRkYgdHRcIiwgXCJNTU0veXl5eSBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcImQvTS95IGg6bSB0dFwiLCBcImQvTU1NL3kgaDptIHR0XCIsIFwiZC9NTU1NL3kgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkL00veXl5eSBoOm0gdHRcIiwgXCJkL21tbS95eXl5IGg6bSB0dFwiLCBcImQvTU1NTS95eXl5IGg6bSB0dFwiLFxuICAgICAgICAgICAgICAgIFwieXl5eS9NL2QgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNL2QveSBoOm06cy5GRkYgdHRcIiwgXCJNTU0vZC95IGg6bTpzLkZGRiB0dFwiLCBcIk1NTU0vZC95IGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS9kL3l5eXkgaDptOnMgdHRcIiwgXCJNTU0vZC95eXl5IGg6bTpzLkZGRiB0dFwiLCBcIk1NTU0vZC95eXl5IGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC9NL3kgaDptOnMuRkZGIHR0XCIsIFwiZC9NTU0veSBoOm06cy5GRkYgdHRcIiwgXCJkL01NTU0veSBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcImQvTS95eXl5IGg6bTpzLkZGRiB0dFwiLCBcImQvTU1NL3l5eXkgaDptOnMuRkZGIHR0XCIsIFwiZC9NTU1NL3l5eXkgaDptOnMuRkZGIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5L00vZCBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcIk0tZCBoOm06cy5GRkYgdHRcIiwgXCJNTU0tZCBoOm06cy5GRkYgdHRcIiwgXCJNTU1NLWQgaDptOnMuRkZGIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkLU0gaDptOnMuRkZGIHR0XCIsIFwiZC1NTU0gaDptOnMuRkZGIHR0XCIsIFwiZC1NTU1NIGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS15IGg6bTpzLkZGRiB0dFwiLCBcIk1NTS15IGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiTS15eXl5IGg6bTpzLkZGRiB0dFwiLCBcIk1NTS1ZeXl5IGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC1NLXkgaDptIHR0XCIsIFwiZC1NTU0teSBoOm0gdHRcIiwgXCJkLU1NTU0teSBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcImQtTS15eXl5IGg6bSB0dFwiLCBcImQtTU1NLXl5eXkgaDptIHR0XCIsIFwiZC1NTU1NLXl5eXkgaDptIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJ5eXl5LU0tZCBoOm0gdHRcIixcbiAgICAgICAgICAgICAgICBcIk0tZC15IGg6bTpzLkZGRiB0dFwiLCBcIk1NTS1kLXkgaDptOnMuRkZGIHR0XCIsIFwiTU1NTS1kLXkgaDptOnMuRkZGIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJNLWQteXl5eSBIOm06cyB0dFwiLCBcIk1NTS1kLXl5eXkgSDptOnMuRkZGIHR0XCIsIFwiTU1NTS1kLXl5eXkgaDptOnMuRkZGIHR0XCIsXG4gICAgICAgICAgICAgICAgXCJkLU0teSBoOm06cy5GRkYgdHRcIiwgXCJkLU1NTS15IGg6bTpzLkZGRiB0dFwiLCBcImQtTU1NTS15IGg6bTpzLkZGRiB0dFwiLFxuICAgICAgICAgICAgICAgIFwiZC1NLXl5eXkgaDptOnMuRkZGIHR0XCIsIFwiZC1NTU0teXl5eSBoOm06cy5GRkYgdHRcIiwgXCJkLU1NTU0teXl5eSBoOm06cy5GRkYgdHRcIixcbiAgICAgICAgICAgICAgICBcInl5eXktTS1kIGg6bTpzLkZGRiB0dFwiXTtcbiAgICAgICAgfTtcblxuICAgICAgICBOdW1iZXJGb3JtYXRHZW5lcmFsLkV2YWx1YXRlRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgaWYgKCFmb3JtYXQgfHwgZm9ybWF0ID09PSBzdHJpbmdFeC5FbXB0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiYXNlQ2xhc3MgPSBOdW1iZXJGb3JtYXRCYXNlO1xuICAgICAgICAgICAgcmV0dXJuIGJhc2VDbGFzcy5Db250YWluc0tleXdvcmRzKGZvcm1hdCwgYmFzZUNsYXNzLl9rZXl3b3JkcywgYmFzZUNsYXNzLl9rZXl3b3Jkc1NldCk7XG4gICAgICAgIH07XG4gICAgICAgIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbFBsYWNlaG9sZGVyID0gXCJATnVtYmVyRm9ybWF0XCI7XG4gICAgICAgIE51bWJlckZvcm1hdEdlbmVyYWwuR2VuZXJhbE51bWJlciA9IFwiIyMjIyMjIyMjIyMjIyMjIyMjMC4jIyMjIyMjIyMjIyMjIyMjXCI7XG4gICAgICAgIHJldHVybiBOdW1iZXJGb3JtYXRHZW5lcmFsO1xuICAgIH0pKE51bWJlckZvcm1hdEJhc2UpO1xuXG4gICAgLy88L2VkaXRvci1mb2xkPlxuICAgIHZhciBDdXN0b21Gb3JtYXR0ZXJCYXNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlcHJlc2VudHMgYSBjdXN0b20gZm9ybWF0dGVyIHdpdGggdGhlIHNwZWNpZmllZCBmb3JtYXQgc3RyaW5nLlxuICAgICAgICAgKiBAY2xhc3NcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdCBUaGUgZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY3VsdHVyZU5hbWUgVGhlIGN1bHR1cmUgbmFtZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEN1c3RvbUZvcm1hdHRlckJhc2UoZm9ybWF0LCBjdWx0dXJlTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5mb3JtYXRDYWNoZWQgPSBmb3JtYXQ7XG4gICAgICAgICAgICB0aGlzLmN1bHR1cmVOYW1lID0gY3VsdHVyZU5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2ZQcm90b3R5cGUgPSBDdXN0b21Gb3JtYXR0ZXJCYXNlLnByb3RvdHlwZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRm9ybWF0cyB0aGUgc3BlY2lmaWVkIG9iamVjdCBhcyBhIHN0cmluZyB3aXRoIGEgY29uZGl0aW9uYWwgY29sb3IuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIG92ZXJ3cml0dGVuLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3Qgd2l0aCBjZWxsIGRhdGEgdG8gZm9ybWF0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZGl0aW9uYWxGb3JlQ29sb3IgVGhlIGNvbmRpdGlvbmFsIGZvcmVncm91bmQgY29sb3IuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgY2ZQcm90b3R5cGUuRm9ybWF0ID0gZnVuY3Rpb24gKG9iaiwgY29uZGl0aW9uYWxGb3JlQ29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIHRleHQuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIG92ZXJ3cml0dGVuLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dC5cbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHBhcnNlZCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICBjZlByb3RvdHlwZS5QYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2ZQcm90b3R5cGUuRm9ybWF0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0Q2FjaGVkO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ3VzdG9tRm9ybWF0dGVyQmFzZTtcbiAgICB9KSgpO1xuICAgIGZvcm1hdHRlci5DdXN0b21Gb3JtYXR0ZXJCYXNlID0gQ3VzdG9tRm9ybWF0dGVyQmFzZTtcblxuICAgIGZvcm1hdHRlci5EYXRlVGltZUhlbHBlciA9IGZvcm1hdHRlclV0aWxzLl9EYXRlVGltZUhlbHBlcjtcbiAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL251bWJlckZvcm1hdHRlci9mb3JtYXR0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wicm9vdFwiOltcIkdjU3ByZWFkXCIsXCJWaWV3c1wiLFwiR2NHcmlkXCIsXCJQbHVnaW5zXCIsXCJHbG9iYWxpemVcIl0sXCJhbWRcIjpcIkdsb2JhbGl6ZVwifVxuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKlxuICogU3ByZWFkSlMgTGlicmFyeSAxLjAuMFxuICogaHR0cDovL3dpam1vLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQoYykgR3JhcGVDaXR5LCBJbmMuICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBXaWptbyBDb21tZXJjaWFsIExpY2Vuc2UuIEFsc28gYXZhaWxhYmxlIHVuZGVyIHRoZSBHTlUgR1BMIFZlcnNpb24gMyBsaWNlbnNlLlxuICogbGljZW5zaW5nQHdpam1vLmNvbVxuICogaHR0cDovL3dpam1vLmNvbS93aWRnZXRzL2xpY2Vuc2UvXG4gKlxuICpcbiAqKi9cblxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBnbG9iYWxpemUgPSByZXF1aXJlKCdHbG9iYWxpemUnKTtcblxuICAgICAgICB2YXIgc3ByZWFkID0ge307XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gc3ByZWFkO1xuXG4gICAgICAgIHZhciBjb25zdF91bmRlZmluZWQgPSBcInVuZGVmaW5lZFwiLCBjb25zdF9udW1iZXIgPSBcIm51bWJlclwiLCBjb25zdF9zdHJpbmcgPSBcInN0cmluZ1wiLCBjb25zdF9ib29sZWFuID0gXCJib29sZWFuXCIsIGNvbnN0X3RydWUgPSBcIlRSVUVcIiwgY29uc3RfZmFsc2UgPSBcIkZBTFNFXCI7XG4gICAgICAgIHZhciBrZXl3b3JkX251bGwgPSBudWxsLCBrZXl3b3JkX3VuZGVmaW5lZCA9IHVuZGVmaW5lZCwgTWF0aF9tYXggPSBNYXRoLm1heCwgTWF0aF9taW4gPSBNYXRoLm1pbiwgTWF0aF9jZWlsID0gTWF0aC5jZWlsLCBNYXRoX2Zsb29yID0gTWF0aC5mbG9vciwgTWF0aF9hYnMgPSBNYXRoLmFicywgTWF0aF9wb3cgPSBNYXRoLnBvdywgTWF0aF9yb3VuZCA9IE1hdGgucm91bmQ7XG5cbiAgICAgICAgdmFyIGNvbnN0X2Jvb2xlYW4gPSBcImJvb2xlYW5cIiwgY29uc3RfZGF0ZSA9IFwiZGF0ZVwiLCBjb25zdF91bmRlZmluZWQgPSBcInVuZGVmaW5lZFwiLCBrZXl3b3JkX3VuZGVmaW5lZCA9IHVuZGVmaW5lZCwga2V5d29yZF9udWxsID0gbnVsbDtcblxuICAgICAgICB2YXIgQXJyYXlIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gQXJyYXlIZWxwZXIoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBBcnJheUhlbHBlci5pbnNlcnQgPSBmdW5jdGlvbiAoYXJyYXksIGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZCA9IGZ1bmN0aW9uIChhcnJheSwgaXRlbSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2FycmF5Lmxlbmd0aF0gPSBpdGVtO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXJyYXlIZWxwZXIuY29udGFpbnMgPSBmdW5jdGlvbiAoYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXJyYXlIZWxwZXIucmVtb3ZlID0gZnVuY3Rpb24gKGFycmF5LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLnJlbW92ZUJ5SW5kZXggPSBmdW5jdGlvbiAoYXJyYXksIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5ID0gYXJyYXkuc2xpY2UoMCwgaW5kZXgpLmNvbmNhdChhcnJheS5zbGljZShpbmRleCArIDEpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmluZGV4T2YgPSBmdW5jdGlvbiAoYXJyYXksIGl0ZW0sIHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoaXRlbSkgPT09IGNvbnN0X3VuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLm1hcCA9IGZ1bmN0aW9uIChhcnJheSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgICAgICAgICAvLyBBcnJheS5tYXAgaXMgbm90IGV4aXN0ZWQgaW4gSUU3LzgsIHVzZSB0aGlzIGFzIGEgZml4XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5wcm90b3R5cGUubWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBULCBBLCBrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxuICAgICAgICAgICAgICAgICAgICB2YXIgTyA9IHdpbmRvdy5PYmplY3QoYXJyYXkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIElmIElzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyBzcHJlYWQuU1IuRXhwX05vdEFGdW5jdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzQXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIDYuIExldCBBIGJlIGEgbmV3IGFycmF5IGNyZWF0ZWQgYXMgaWYgYnkgdGhlIGV4cHJlc3Npb24gbmV3IEFycmF5KGxlbikgd2hlcmUgQXJyYXkgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHN0YW5kYXJkIGJ1aWx0LWluIGNvbnN0cnVjdG9yIHdpdGggdGhhdCBuYW1lIGFuZCBsZW4gaXMgdGhlIHZhbHVlIG9mIGxlbi5cbiAgICAgICAgICAgICAgICAgICAgQSA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIDcuIExldCBrIGJlIDBcbiAgICAgICAgICAgICAgICAgICAgayA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrVmFsdWUsIG1hcHBlZFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoayBpbiBPKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS4gTGV0IGtWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtWYWx1ZSA9IE9ba107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpaS4gTGV0IG1hcHBlZFZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIFQgYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBlZFZhbHVlID0gY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWlpLiBDYWxsIHRoZSBEZWZpbmVPd25Qcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgQSB3aXRoIGFyZ3VtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBrLCBQcm9wZXJ0eSBEZXNjcmlwdG9yIHtWYWx1ZTogbWFwcGVkVmFsdWUsIDogdHJ1ZSwgRW51bWVyYWJsZTogdHJ1ZSwgQ29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgZmFsc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSwgdXNlIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KEEsIFBrLCB7IHZhbHVlOiBtYXBwZWRWYWx1ZSwgd3JpdGFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYmVzdCBicm93c2VyIHN1cHBvcnQsIHVzZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFba10gPSBtYXBwZWRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gOS4gcmV0dXJuIEFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5tYXAoY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQXJyYXlIZWxwZXIuY2xlYXIgPSBmdW5jdGlvbiAoYXJyYXksIGluZGV4LCBjb3VudCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IG4gPCBjb3VudCAmJiBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbaW5kZXggKyBpXSA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLm5leHROb25FbXB0eUluZGV4ID0gZnVuY3Rpb24gKGFycmF5LCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG4gPSBpbmRleCArIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IG47IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gIT09IGtleXdvcmRfdW5kZWZpbmVkICYmIGFycmF5W2ldICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gQXJyYXlIZWxwZXI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHNwcmVhZC5BcnJheUhlbHBlciA9IEFycmF5SGVscGVyO1xuXG4gICAgICAgIChmdW5jdGlvbiAoU3RyaW5nQ29tcGFyaXNvbikge1xuICAgICAgICAgICAgLy8gIENvbXBhcmUgc3RyaW5ncyB1c2luZyBjdWx0dXJlLXNlbnNpdGl2ZSBzb3J0IHJ1bGVzIGFuZCB0aGUgY3VycmVudCBjdWx0dXJlLiovXG4gICAgICAgICAgICBTdHJpbmdDb21wYXJpc29uW1N0cmluZ0NvbXBhcmlzb25bXCJDdXJyZW50Q3VsdHVyZVwiXSA9IDBdID0gXCJDdXJyZW50Q3VsdHVyZVwiO1xuXG4gICAgICAgICAgICAvLyAgQ29tcGFyZSBzdHJpbmdzIHVzaW5nIGN1bHR1cmUtc2Vuc2l0aXZlIHNvcnQgcnVsZXMsIHRoZSBjdXJyZW50IGN1bHR1cmUsIGFuZCBpZ25vcmluZyB0aGUgY2FzZSBvZiB0aGUgc3RyaW5ncyBiZWluZyBjb21wYXJlZC4qL1xuICAgICAgICAgICAgU3RyaW5nQ29tcGFyaXNvbltTdHJpbmdDb21wYXJpc29uW1wiQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlXCJdID0gMV0gPSBcIkN1cnJlbnRDdWx0dXJlSWdub3JlQ2FzZVwiO1xuXG4gICAgICAgICAgICAvLyAgQ29tcGFyZSBzdHJpbmdzIHVzaW5nIGN1bHR1cmUtc2Vuc2l0aXZlIHNvcnQgcnVsZXMgYW5kIHRoZSBpbnZhcmlhbnQgY3VsdHVyZS4qL1xuICAgICAgICAgICAgU3RyaW5nQ29tcGFyaXNvbltTdHJpbmdDb21wYXJpc29uW1wiSW52YXJpYW50Q3VsdHVyZVwiXSA9IDJdID0gXCJJbnZhcmlhbnRDdWx0dXJlXCI7XG5cbiAgICAgICAgICAgIC8vICBDb21wYXJlIHN0cmluZ3MgdXNpbmcgY3VsdHVyZS1zZW5zaXRpdmUgc29ydCBydWxlcywgdGhlIGludmFyaWFudCBjdWx0dXJlLCBhbmQgaWdub3JpbmcgdGhlIGNhc2Ugb2YgdGhlIHN0cmluZ3MgYmVpbmcgY29tcGFyZWQuKi9cbiAgICAgICAgICAgIFN0cmluZ0NvbXBhcmlzb25bU3RyaW5nQ29tcGFyaXNvbltcIkludmFyaWFudEN1bHR1cmVJZ25vcmVDYXNlXCJdID0gM10gPSBcIkludmFyaWFudEN1bHR1cmVJZ25vcmVDYXNlXCI7XG5cbiAgICAgICAgICAgIC8vICBDb21wYXJlIHN0cmluZ3MgdXNpbmcgb3JkaW5hbCBzb3J0IHJ1bGVzLiovXG4gICAgICAgICAgICBTdHJpbmdDb21wYXJpc29uW1N0cmluZ0NvbXBhcmlzb25bXCJPcmRpbmFsXCJdID0gNF0gPSBcIk9yZGluYWxcIjtcblxuICAgICAgICAgICAgLy8gQ29tcGFyZSBzdHJpbmdzIHVzaW5nIG9yZGluYWwgc29ydCBydWxlcyBhbmQgaWdub3JpbmcgdGhlIGNhc2Ugb2YgdGhlIHN0cmluZ3MgYmVpbmcgY29tcGFyZWQuKi9cbiAgICAgICAgICAgIFN0cmluZ0NvbXBhcmlzb25bU3RyaW5nQ29tcGFyaXNvbltcIk9yZGluYWxJZ25vcmVDYXNlXCJdID0gNV0gPSBcIk9yZGluYWxJZ25vcmVDYXNlXCI7XG4gICAgICAgIH0pKHNwcmVhZC5TdHJpbmdDb21wYXJpc29uIHx8IChzcHJlYWQuU3RyaW5nQ29tcGFyaXNvbiA9IHt9KSk7XG4gICAgICAgIHZhciBTdHJpbmdDb21wYXJpc29uID0gc3ByZWFkLlN0cmluZ0NvbXBhcmlzb247XG5cbiAgICAgICAgdmFyIHV0aWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gdXRpbCgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vQ3JlYXRlIGFuIEV2ZW50SGFuZGxlciBmb3IgYSBlbGVtZW50XG4gICAgICAgICAgICB1dGlsLmNyZWF0ZUV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBtZXRob2QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseShlbGVtZW50LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL0NhbmNlbHMgdGhlIHJvdXRlIGZvciBET00gZXZlbnQuXG4gICAgICAgICAgICAvL0BwYXJhbSB7RXZlbnR9IGUgSW5kaWNhdGVzIHRoZSBldmVudCB0byBiZSBjYW5jZWxsZWQuXG4gICAgICAgICAgICAvL0ByZXR1cm5zIHtib29sZWFufSBUaGlzIGZ1bmN0aW9uIGFsd2F5cyByZXR1cm5zIDxjPmZhbHNlPC9jPi5cbiAgICAgICAgICAgIHV0aWwuY2FuY2VsRGVmYXVsdCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGUuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdXRpbC5faXNTdGFuZGFyZENhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHV0aWwuY2FudmFzQXBpRm91bmQgPT09IGNvbnN0X3VuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB1dGlsLmNhbnZhc0FwaUZvdW5kID0gKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQgIT09IGNvbnN0X3VuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLmNhbnZhc0FwaUZvdW5kO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdXRpbC5pbkFycmF5ID0gZnVuY3Rpb24gKGVsZW0sIGFyciwgaSkge1xuICAgICAgICAgICAgICAgIGlmIChhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChhcnIsIGVsZW0sIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpID8gaSA8IDAgPyBNYXRoX21heCgwLCBsZW4gKyBpKSA6IGkgOiAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNraXAgYWNjZXNzaW5nIGluIHNwYXJzZSBhcnJheXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIGluIGFyciAmJiBhcnJbaV0gPT09IGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHV0aWwucGFyc2VDb2xvclN0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBycmdnYmJQYXR0ZXJuID0gL14jKFswLTlhLWZdezJ9KShbMC05YS1mXXsyfSkoWzAtOWEtZl17Mn0pJC9pO1xuICAgICAgICAgICAgICAgIHZhciByZ2JQYXR0ZXJuID0gL14jKFswLTlhLWZdKShbMC05YS1mXSkoWzAtOWEtZl0pJC9pO1xuICAgICAgICAgICAgICAgIHZhciByZ2JGdW5jdGlvblBhdHRlcm4gPSAvXnJnYlxcKChbXFxzXFxkXSopLChbXFxzXFxkXSopLChbXFxzXFxkXSopXFwpJC9pO1xuICAgICAgICAgICAgICAgIHZhciByZ2JhRnVuY3Rpb25QYXR0ZXJuID0gL15yZ2JhXFwoKFtcXHNcXGRdKiksKFtcXHNcXGRdKiksKFtcXHNcXGRdKiksKFtcXHNcXGRdKilcXCkkL2k7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9ybWFsaXplQ29sb3JTdHJpbmcgPSAoZnVuY3Rpb24gKHVzZUNhbnZhcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2R1bW15Q29sb3JTcGFuLCBfY2FudmFzQ29udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZUNhbnZhcyA/IGZ1bmN0aW9uIChzdHJDb2xvcjEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX2NhbnZhc0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyAmJiBjLmdldENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NhbnZhc0NvbnRleHQgPSBjLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfY2FudmFzQ29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJDb2xvcjE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBzdHJDb2xvcjE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIF9jYW52YXNDb250ZXh0LmZpbGxTdHlsZTsgLy9Ob3RlOiB0aGlzIGNvZGUgd2lsbCBtYW5pZnkgd3JvbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJDb2xvcjEgPSBfY2FudmFzQ29udGV4dC5maWxsU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyQ29sb3IxO1xuICAgICAgICAgICAgICAgICAgICB9IDogZnVuY3Rpb24gKHN0ckNvbG9yMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBfZHVtbXlDb2xvclNwYW4gPT09IGNvbnN0X3VuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kdW1teUNvbG9yU3BhbiA9ICQoXCI8c3Bhbj48L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2R1bW15Q29sb3JTcGFuLmNzcyhcImNvbG9yXCIsIHN0ckNvbG9yMik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2R1bW15Q29sb3JTcGFuLmNzcyhcImNvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0odXRpbC5faXNTdGFuZGFyZENhbnZhcygpKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaGV4VG9Db2xvclVuaXQgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoeCwgMTYpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgaGV4MlRvQ29sb3JVbml0MiA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh4ICsgeCwgMTYpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVjT3JQZXJjZW50VG9Db2xvclVuaXQgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5pbmRleE9mKFwiJVwiKSA+IDAgPyBwYXJzZUZsb2F0KHgpICogMi41NSA6IHggfCAwO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgc0NvbG9yID0gbm9ybWFsaXplQ29sb3JTdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciByZSA9IFJlZ0V4cDtcbiAgICAgICAgICAgICAgICBpZiAocnJnZ2JiUGF0dGVybi50ZXN0KHNDb2xvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5SGVscGVyLm1hcChbcmUuJDEsIHJlLiQyLCByZS4kM10sIGhleFRvQ29sb3JVbml0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJnYmFGdW5jdGlvblBhdHRlcm4udGVzdChzQ29sb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gQXJyYXlIZWxwZXIubWFwKFtyZS4kMSwgcmUuJDIsIHJlLiQzXSwgZGVjT3JQZXJjZW50VG9Db2xvclVuaXQpO1xuICAgICAgICAgICAgICAgICAgICB2LnNwbGljZSgwLCAwLCBwYXJzZUZsb2F0KHJlLiQ0KSAqIDI1NSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmdiRnVuY3Rpb25QYXR0ZXJuLnRlc3Qoc0NvbG9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXlIZWxwZXIubWFwKFtyZS4kMSwgcmUuJDIsIHJlLiQzXSwgZGVjT3JQZXJjZW50VG9Db2xvclVuaXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmdiUGF0dGVybi50ZXN0KHNDb2xvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5SGVscGVyLm1hcChbcmUuJDEsIHJlLiQyLCByZS4kM10sIGhleDJUb0NvbG9yVW5pdDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdXRpbC5wb3NpdGlvbiA9IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLl9wb3NpdGlvbi5jYWxsKHRhcmdldCwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0LnNwbGl0KFwiIFwiKSwgYXQgPSBvcHRpb25zLmF0LnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRbMV0gPSBvZmZzZXRbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgvXlxcZC8udGVzdChvZmZzZXRbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFswXSA9IFwiK1wiICsgb2Zmc2V0WzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoL15cXGQvLnRlc3Qob2Zmc2V0WzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRbMV0gPSBcIitcIiArIG9mZnNldFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL2xlZnR8Y2VudGVyfHJpZ2h0Ly50ZXN0KGF0WzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXRbMV0gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXRbMV0gPSBhdFswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0WzBdID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLl9wb3NpdGlvbi5jYWxsKHRhcmdldCwgXy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICAgICAgICAgICAgICBhdDogYXRbMF0gKyBvZmZzZXRbMF0gKyBcIiBcIiArIGF0WzFdICsgb2Zmc2V0WzFdLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IFwiXCJcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1dGlsLmhhc0NhbGMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwcmVhZC5mZWF0dXJlcy5jYWxjICYmIHNwcmVhZC5mZWF0dXJlcy5jYWxjLmNvbW1vbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vY29udmVydCBoZWFkZXIgbmFtZSB0byBzdHJpbmdcbiAgICAgICAgICAgIHV0aWwudG9TdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IGNvbnN0X3VuZGVmaW5lZCB8fCB2YWx1ZSA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBjb25zdF9ib29sZWFuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgPyBjb25zdF90cnVlIDogY29uc3RfZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBjb25zdF9zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgX0RhdGVUaW1lSGVscGVyKHZhbHVlKS5sb2NhbGVGb3JtYXQoXCJNL2QveXl5eSBoOm1tOnNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBDYWxjQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhyb3cgZm9ybWF0dGVyVXRpbHMuU1IuRXhwX0ludmFsaWRDYXN0O1xuICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBmb3JtYXR0ZXJVdGlscy5TUi5FeHBfSW52YWxpZENhc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLnRvRGF0ZVRpbWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IGNvbnN0X3VuZGVmaW5lZCB8fCB2YWx1ZSA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfRGF0ZVRpbWVIZWxwZXIuZnJvbU9BRGF0ZSgwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBjb25zdF9zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGVUaW1lID0gX0RhdGVUaW1lSGVscGVyLnBhcnNlTG9jYWxlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgZGF0ZVRpbWUgPT09IGNvbnN0X3VuZGVmaW5lZCB8fCBkYXRlVGltZSA9PT0ga2V5d29yZF9udWxsKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlVGltZSA9IF9EYXRlVGltZUhlbHBlci5mcm9tT0FEYXRlKHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0ZVRpbWUgPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IGRhdGVUaW1lID09PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IHNwcmVhZC5TUi5FeHBfSW52YWxpZEFyZ3VtZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlVGltZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gY29uc3RfbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfRGF0ZVRpbWVIZWxwZXIuZnJvbU9BRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgc3ByZWFkLlNSLkV4cF9JbnZhbGlkQ2FzdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1dGlsLmRldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB1YS5tYXRjaCgvaVBhZC9pKSwgZmlyc3RNYXRjaCwgaXNJcGFkLCBpc0lwaG9uZSwgaXNBbmRyb2lkO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RNYXRjaCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzSXBhZCA9IGZpcnN0TWF0Y2gudG9Mb3dlckNhc2UoKSA9PT0gXCJpcGFkXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdWEubWF0Y2goL2lQaG9uZS9pKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TWF0Y2ggPSByZXN1bHRbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0lwaG9uZSA9IGZpcnN0TWF0Y2gudG9Mb3dlckNhc2UoKSA9PT0gXCJpcGhvbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHVhLm1hdGNoKC9hbmRyb2lkL2kpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RNYXRjaCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0TWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzSXBob25lID0gZmlyc3RNYXRjaC50b0xvd2VyQ2FzZSgpID09PSBcImFuZHJvaWRcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpcGFkOiBpc0lwYWQsXG4gICAgICAgICAgICAgICAgICAgIGlwaG9uZTogaXNJcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6IGlzQW5kcm9pZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1dGlsLmluaXRQYWludCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIHZhciBpc1N0YW5kYXJkQ2FudmFzID0gdXRpbC5faXNTdGFuZGFyZENhbnZhcygpO1xuICAgICAgICAgICAgICAgIGlmIChpc1N0YW5kYXJkQ2FudmFzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGhvc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSAkKGhvc3QpLmRhdGEoJ3NwcmVhZCcpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9pbml0UGFpbnRUaW1lb3V0ICE9PSBrZXl3b3JkX3VuZGVmaW5lZCAmJiBzZWxmLl9pbml0UGFpbnRUaW1lb3V0ICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChzZWxmLl9pbml0UGFpbnRUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY29udHJvbCA9IHNlbGYuY2FudmFzLmZpcnN0Q2hpbGQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29udHJvbCAmJiBjb250cm9sLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByZWFkc2hlZXRPYmplY3QgPSBjb250cm9sLkNvbnRlbnQuU3ByZWFkc2hlZXRPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXR0YWNoU3ByZWFkc2hlZXRPYmplY3Qoc3ByZWFkc2hlZXRPYmplY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2luaXRQYWludFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmluaXRQYWludChpZCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1dGlsLmlzVHlwZSA9IGZ1bmN0aW9uIChvYmosIHR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBiYXNldHlwZXMgPSB1dGlsLl9iYXNldHlwZXM7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2V0eXBlc1t0eXBlb2Ygb2JqXSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiAmJiAvXlxccypcXGJmdW5jdGlvblxcYi8udGVzdChcIlwiICsgb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkgPT09IHR5cGUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9iaiAmJiBvYmouX2NsYXNzTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5fY2xhc3NOYW1lcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc25hbWUgPSBvYmouX2NsYXNzTmFtZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzbmFtZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkRhdGVUaW1lXCIgfHwgdHlwZSA9PT0gXCJUaW1lU3BhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2V0eXBlc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdXRpbC5pc0N1c3RvbVR5cGUgPSBmdW5jdGlvbiAob2JqLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iaiA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgb2JqID09PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob2JqICYmIG9iai5fY2xhc3NOYW1lcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgb2JqLl9jbGFzc05hbWVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsYXNzbmFtZSA9IG9iai5fY2xhc3NOYW1lc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NuYW1lID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcIkRhdGVUaW1lXCIgfHwgdHlwZSA9PT0gXCJUaW1lU3BhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIgJiYgL15cXHMqXFxiZnVuY3Rpb25cXGIvLnRlc3QoXCJcIiArIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSA9PT0gdHlwZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1dGlsLmFzQ3VzdG9tVHlwZSA9IGZ1bmN0aW9uIChvYmosIHR5cGVuYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iaiAmJiBvYmouX2NsYXNzTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG9iai5fY2xhc3NOYW1lcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc25hbWUgPSBvYmouX2NsYXNzTmFtZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzbmFtZSA9PT0gdHlwZW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1dGlsLmlzVHlwZShvYmosIHR5cGVuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdXRpbC5pc1N0cmluZ051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAvXlstLC5cXGRdKyQvLnRlc3Qob2JqLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9zdGF0aWMgYXNUeXBlKG9iajogYW55LCB0eXBlbmFtZTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgICAgIC8vICAgIGlmICh1dGlsLmlzVHlwZShvYmosIHR5cGVuYW1lKSkge1xuICAgICAgICAgICAgLy8gICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICAvLyAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIHV0aWwuZ2V0UHJlZmVycmVkWkluZGV4ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5wYXJlbnRFbGVtZW50ICYmIGVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgemluZGV4ID0gMTAwMCwgaW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gcGFyc2VJbnQoJChlbGVtZW50KS5jc3MoXCJ6LWluZGV4XCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHppbmRleCArPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gemluZGV4O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vdXRpbC5fcG9zaXRpb24gPSAkLmZuLnBvc2l0aW9uO1xuXG4gICAgICAgICAgICB1dGlsLl9iYXNldHlwZXMgPSB7ICd1bmRlZmluZWQnOiAndW5kZWZpbmVkJywgJ251bWJlcic6ICdudW1iZXInLCAnYm9vbGVhbic6ICdib29sZWFuJywgJ3N0cmluZyc6ICdzdHJpbmcnIH07XG4gICAgICAgICAgICByZXR1cm4gdXRpbDtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgc3ByZWFkLnV0aWwgPSB1dGlsO1xuXG4gICAgICAgIHZhciBTdHJpbmdVdGlsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0cmluZ1V0aWwoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTdHJpbmdVdGlsLnJlcGxhY2UgPSBmdW5jdGlvbiAoc3JjLCBzdWJzdHIsIHJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNyYy5zcGxpdChzdWJzdHIpLmpvaW4ocmVwbGFjZW1lbnQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgU3RyaW5nVXRpbC5zdGFydHNXaXRoID0gZnVuY3Rpb24gKHNyYywgcHJlZml4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNyYy5pbmRleE9mKHByZWZpeCkgPT09IDA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdVdGlsLmVuZHNXaXRoID0gZnVuY3Rpb24gKHNyYywgc3VmZml4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGwgPSBzcmMubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbCA+PSAwICYmIHNyYy5pbmRleE9mKHN1ZmZpeCwgbCkgPT09IGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdVdGlsLmxlZnRCZWZvcmUgPSBmdW5jdGlvbiAoc3JjLCBzdWZmZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzcmMuaW5kZXhPZihzdWZmZXgpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc3JjLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3JjO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcmMuc3Vic3RyKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdVdGlsLmNvbnRhaW5zID0gZnVuY3Rpb24gKHNyYywgc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3JjLmluZGV4T2Yoc3MpID49IDA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdVdGlsLmNvdW50ID0gZnVuY3Rpb24gKHNyYywgc3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwLCBwb3MgPSBzcmMuaW5kZXhPZihzcyk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHNyYy5pbmRleE9mKHNzLCBwb3MgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmdVdGlsO1xuICAgICAgICB9KSgpO1xuICAgICAgICBzcHJlYWQuU3RyaW5nVXRpbCA9IFN0cmluZ1V0aWw7XG5cbiAgICAgICAgdmFyIFJlZ1V0aWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gUmVnVXRpbCgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFJlZ1V0aWwuZ2V0UmVnID0gZnVuY3Rpb24gKHJlZ1N0cikge1xuICAgICAgICAgICAgICAgIHZhciByZWcgPSBSZWdVdGlsLnJlZ0RpY3RbcmVnU3RyXTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZykge1xuICAgICAgICAgICAgICAgICAgICByZWcgPSBSZWdVdGlsLnJlZ0RpY3RbcmVnU3RyXSA9IG5ldyBSZWdFeHAocmVnU3RyLCAnZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWcubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVnVXRpbC5nZXRSZWdJZ25vcmVDYXNlID0gZnVuY3Rpb24gKHJlZ1N0cikge1xuICAgICAgICAgICAgICAgIHZhciByZWcgPSBSZWdVdGlsLnJlZ0RpY3RJZ25vcmVDYXNlW3JlZ1N0cl07XG4gICAgICAgICAgICAgICAgaWYgKCFyZWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnID0gUmVnVXRpbC5yZWdEaWN0SWdub3JlQ2FzZVtyZWdTdHJdID0gbmV3IFJlZ0V4cChyZWdTdHIsICdnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWcubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVnVXRpbC5nZXRXaWxkY2FyZENyaXRlcmlhID0gZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG4gICAgICAgICAgICAgICAgaWYgKFJlZ1V0aWwud2lsZGNhcmRQYXJzZVJlY29yZFtjcml0ZXJpYV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZ1V0aWwud2lsZGNhcmRQYXJzZVJlc3VsdEJ1ZmZlcltjcml0ZXJpYV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChSZWdVdGlsLmdldFJlZyhcIlt+PypdK1wiKS50ZXN0KGNyaXRlcmlhKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3JpdGVyaWFUZW1wID0gY3JpdGVyaWE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhc3Rlcmlza1N5bWJvbCA9IFJlZ1V0aWwuZ2V0UmVwbGFjZVN5bWJvbChcImFzdGVyaXNrXCIsIGNyaXRlcmlhVGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvblN5bWJvbCA9IFJlZ1V0aWwuZ2V0UmVwbGFjZVN5bWJvbChcInF1ZXN0aW9uXCIsIGNyaXRlcmlhVGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aWxkZVN5bWJvbCA9IFJlZ1V0aWwuZ2V0UmVwbGFjZVN5bWJvbChcInRpbGRlXCIsIGNyaXRlcmlhVGVtcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3JpdGVyaWFUZW1wID0gU3RyaW5nVXRpbC5yZXBsYWNlKGNyaXRlcmlhVGVtcCwgXCJ+flwiLCB0aWxkZVN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhVGVtcCA9IFN0cmluZ1V0aWwucmVwbGFjZShjcml0ZXJpYVRlbXAsIFwifipcIiwgYXN0ZXJpc2tTeW1ib2wpO1xuICAgICAgICAgICAgICAgICAgICBjcml0ZXJpYVRlbXAgPSBTdHJpbmdVdGlsLnJlcGxhY2UoY3JpdGVyaWFUZW1wLCBcIn4/XCIsIHF1ZXN0aW9uU3ltYm9sKTtcblxuICAgICAgICAgICAgICAgICAgICBjcml0ZXJpYVRlbXAgPSBjcml0ZXJpYVRlbXAucmVwbGFjZShSZWdVdGlsLmdldFJlZyhcIihbLiskXlxcXFxbXFxcXF0oKXt9fFxcL10pXCIpLCBcIlxcXFwkMVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY3JpdGVyaWFUZW1wID0gU3RyaW5nVXRpbC5yZXBsYWNlKGNyaXRlcmlhVGVtcCwgXCIqXCIsIFwiLipcIik7XG4gICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhVGVtcCA9IFN0cmluZ1V0aWwucmVwbGFjZShjcml0ZXJpYVRlbXAsIFwiP1wiLCBcIi5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgY3JpdGVyaWFUZW1wID0gU3RyaW5nVXRpbC5yZXBsYWNlKGNyaXRlcmlhVGVtcCwgYXN0ZXJpc2tTeW1ib2wsIFwiXFxcXCpcIik7XG4gICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhVGVtcCA9IFN0cmluZ1V0aWwucmVwbGFjZShjcml0ZXJpYVRlbXAsIHF1ZXN0aW9uU3ltYm9sLCBcIlxcXFw/XCIpO1xuICAgICAgICAgICAgICAgICAgICBjcml0ZXJpYVRlbXAgPSBTdHJpbmdVdGlsLnJlcGxhY2UoY3JpdGVyaWFUZW1wLCB0aWxkZVN5bWJvbCwgXCJ+XCIpO1xuICAgICAgICAgICAgICAgICAgICBSZWdVdGlsLndpbGRjYXJkUGFyc2VSZXN1bHRCdWZmZXJbY3JpdGVyaWFdID0gY3JpdGVyaWFUZW1wO1xuICAgICAgICAgICAgICAgICAgICBSZWdVdGlsLndpbGRjYXJkUGFyc2VSZWNvcmRbY3JpdGVyaWFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyaXRlcmlhVGVtcDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVnVXRpbC5nZXRXaWxkY2FyZENyaXRlcmlhRnVsbE1hdGNoID0gZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNyaXRlcmlhVGVtcCA9IFJlZ1V0aWwuZ2V0V2lsZGNhcmRDcml0ZXJpYShjcml0ZXJpYSk7XG4gICAgICAgICAgICAgICAgaWYgKGNyaXRlcmlhVGVtcCkge1xuICAgICAgICAgICAgICAgICAgICBjcml0ZXJpYVRlbXAgPSAnXicgKyBjcml0ZXJpYVRlbXAgKyAnJCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjcml0ZXJpYVRlbXA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBSZWdVdGlsLmdldFJlcGxhY2VTeW1ib2wgPSBmdW5jdGlvbiAoZXhwZWN0U3ltYm9sLCBzcmNTdHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXN0ZXJpc2tTeW1ib2wgPSAnIycgKyBleHBlY3RTeW1ib2wgKyBcIjAjXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCAxMDAwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmNTdHIuaW5kZXhPZihhc3Rlcmlza1N5bWJvbCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3Rlcmlza1N5bWJvbCA9IFN0cmluZ1V0aWwucmVwbGFjZShhc3Rlcmlza1N5bWJvbCwgXCIjXCIgKyBleHBlY3RTeW1ib2wgKyAoaSAtIDEpICsgXCIjXCIsIFwiI1wiICsgZXhwZWN0U3ltYm9sICsgaSArIFwiI1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3Rlcmlza1N5bWJvbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgUmVnVXRpbC5yZWdEaWN0ID0ge307XG4gICAgICAgICAgICBSZWdVdGlsLnJlZ0RpY3RJZ25vcmVDYXNlID0ge307XG4gICAgICAgICAgICBSZWdVdGlsLndpbGRjYXJkUGFyc2VSZWNvcmQgPSB7fTtcbiAgICAgICAgICAgIFJlZ1V0aWwud2lsZGNhcmRQYXJzZVJlc3VsdEJ1ZmZlciA9IHt9O1xuICAgICAgICAgICAgcmV0dXJuIFJlZ1V0aWw7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHNwcmVhZC5SZWdVdGlsID0gUmVnVXRpbDtcblxuICAgICAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiU3RyaW5nQnVpbGRlclwiPlxuICAgICAgICB2YXIgX1N0cmluZ0J1aWxkZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX1N0cmluZ0J1aWxkZXIoc3RyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZW4gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXQoc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9TdHJpbmdCdWlsZGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIChpbml0aWFsVGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRzID0gKHR5cGVvZiAoaW5pdGlhbFRleHQpICE9PSBjb25zdF91bmRlZmluZWQgJiYgaW5pdGlhbFRleHQgIT09IGtleXdvcmRfbnVsbCAmJiBpbml0aWFsVGV4dCAhPT0gJycpID8gW2luaXRpYWxUZXh0LnRvU3RyaW5nKCldIDogW107XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZW4gPSAwO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1N0cmluZ0J1aWxkZXIucHJvdG90eXBlLl9pbnNlcnQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRzLnNwbGljZSgwLCAwLCB0ZXh0KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9TdHJpbmdCdWlsZGVyLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAodGV4dCwgcG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBwb3NpdGlvbiA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2luc2VydCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHNlbGYudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPj0gY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHBlbmQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0ID0gY29udGVudC5zdWJzdHJpbmcoMCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gY29udGVudC5zdWJzdHIocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHNlbGYuX2luaXQoZmlyc3QgKyB0ZXh0ICsgbGVmdCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfU3RyaW5nQnVpbGRlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0c1t0aGlzLl9wYXJ0cy5sZW5ndGhdID0gdGV4dDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9TdHJpbmdCdWlsZGVyLnByb3RvdHlwZS5hcHBlbmRMaW5lID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0c1t0aGlzLl9wYXJ0cy5sZW5ndGhdID0gKCh0eXBlb2YgKHRleHQpID09PSBjb25zdF91bmRlZmluZWQpIHx8ICh0ZXh0ID09PSBrZXl3b3JkX251bGwpIHx8ICh0ZXh0ID09PSAnJykpID8gJ1xcclxcbicgOiB0ZXh0ICsgJ1xcclxcbic7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfU3RyaW5nQnVpbGRlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1N0cmluZ0J1aWxkZXIucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKSA9PT0gJyc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfU3RyaW5nQnVpbGRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnJztcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBzZWxmLl9wYXJ0cztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5fbGVuICE9PSBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fdmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbGVuID0gcGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gc2VsZi5fdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsW3NlcGFyYXRvcl0pID09PSBjb25zdF91bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcGFyYXRvciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIChwYXJ0c1tpXSkgPT09IGNvbnN0X3VuZGVmaW5lZCkgfHwgKHBhcnRzW2ldID09PSAnJykgfHwgKHBhcnRzW2ldID09PSBrZXl3b3JkX251bGwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhbFtzZXBhcmF0b3JdID0gc2VsZi5fcGFydHMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsW3NlcGFyYXRvcl07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIF9TdHJpbmdCdWlsZGVyO1xuICAgICAgICB9KSgpO1xuICAgICAgICBzcHJlYWQuX1N0cmluZ0J1aWxkZXIgPSBfU3RyaW5nQnVpbGRlcjtcblxuICAgICAgICAvLzwvZWRpdG9yLWZvbGQ+XG5cbiAgICAgICAgLy88L2VkaXRvci1mb2xkPlxuICAgICAgICAvLzxlZGl0b3ItZm9sZCBkZXNjPVwiU3RyaW5nSGVscGVyXCI+XG4gICAgICAgIHZhciBfU3RyaW5nSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9TdHJpbmdIZWxwZXIoc3RyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyID0gc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX1N0cmluZ0hlbHBlci5fX3RvRm9ybWF0dGVkU3RyaW5nID0gZnVuY3Rpb24gKHVzZUxvY2FsZSwgYXJncykge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0ID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgOykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3BlbiA9IGZvcm1hdC5pbmRleE9mKCd7JywgaSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZSA9IGZvcm1hdC5pbmRleE9mKCd9JywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgob3BlbiA8IDApICYmIChjbG9zZSA8IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gZm9ybWF0LnNsaWNlKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKChjbG9zZSA+IDApICYmICgoY2xvc2UgPCBvcGVuKSB8fCAob3BlbiA8IDApKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5jaGFyQXQoY2xvc2UgKyAxKSAhPT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmVhZC5TUi5FeHBfQnJhY2VNaXNtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gZm9ybWF0LnNsaWNlKGksIGNsb3NlICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gY2xvc2UgKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGZvcm1hdC5zbGljZShpLCBvcGVuKTtcbiAgICAgICAgICAgICAgICAgICAgaSA9IG9wZW4gKyAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0LmNoYXJBdChpKSA9PT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJ3snO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsb3NlIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmVhZC5TUi5FeHBfQnJhY2VNaXNtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJyYWNlID0gZm9ybWF0LnN1YnN0cmluZyhpLCBjbG9zZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvbkluZGV4ID0gYnJhY2UuaW5kZXhPZignOicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJnTnVtYmVyID0gcGFyc2VJbnQoKGNvbG9uSW5kZXggPCAwKSA/IGJyYWNlIDogYnJhY2Uuc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpLCAxMCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4oYXJnTnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmVhZC5TUi5FeHBfSW52YWxpZEZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ0Zvcm1hdCA9IChjb2xvbkluZGV4IDwgMCkgPyAnJyA6IGJyYWNlLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2FyZ051bWJlcl07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGFyZykgPT09IGNvbnN0X3VuZGVmaW5lZCB8fCBhcmcgPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy50b0Zvcm1hdHRlZFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGFyZy50b0Zvcm1hdHRlZFN0cmluZyhhcmdGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHVzZUxvY2FsZSAmJiBhcmcubG9jYWxlRm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYXJnLmxvY2FsZUZvcm1hdChhcmdGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5mb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBhcmcuZm9ybWF0KGFyZ0Zvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaSA9IGNsb3NlICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9TdHJpbmdIZWxwZXIucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9zdHIuc3Vic3RyKDAsIHByZWZpeC5sZW5ndGgpID09PSBwcmVmaXgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1N0cmluZ0hlbHBlci5wcm90b3R5cGUuZW5kc1dpdGggPSBmdW5jdGlvbiAoc3VmZml4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0ci5pbmRleE9mKHN1ZmZpeCwgdGhpcy5fc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9TdHJpbmdIZWxwZXIucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfU3RyaW5nSGVscGVyLnByb3RvdHlwZS50cmltRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdHIucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfU3RyaW5nSGVscGVyLnByb3RvdHlwZS50cmltU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0ci5yZXBsYWNlKC9eXFxzKy8sICcnKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfU3RyaW5nSGVscGVyLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0LCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MyID0gW107XG4gICAgICAgICAgICAgICAgYXJnczIucHVzaChmb3JtYXQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzMi5wdXNoKGFyZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gX1N0cmluZ0hlbHBlci5fX3RvRm9ybWF0dGVkU3RyaW5nKGZhbHNlLCBhcmdzMik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIF9TdHJpbmdIZWxwZXI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHNwcmVhZC5fU3RyaW5nSGVscGVyID0gX1N0cmluZ0hlbHBlcjtcblxuICAgICAgICB2YXIgU3RyaW5nSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0cmluZ0hlbHBlcigpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN0cmluZ0hlbHBlci5Db250YWlucyA9IGZ1bmN0aW9uIChzdHIsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBcIlwiIHx8IHN0ci5pbmRleE9mKHZhbHVlKSA+PSAwO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgU3RyaW5nSGVscGVyLkluZGV4T2YgPSBmdW5jdGlvbiAoc3RyLCB2YWx1ZSwgY29tcGFyaXNvblR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBhcmlzb25UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHIuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wYXJpc29uVHlwZSA9PT0gMSAvKiBDdXJyZW50Q3VsdHVyZUlnbm9yZUNhc2UgKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBTdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBWYWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wU3RyLmluZGV4T2YodGVtcFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyLmluZGV4T2YodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFN0cmluZ0hlbHBlci5UcmltU3RhcnQgPSBmdW5jdGlvbiAoc3RyLCB0cmltQ2hhcikge1xuICAgICAgICAgICAgICAgIGlmICghdHJpbUNoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzdHI7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXAuc3Vic3RyKDAsIHRyaW1DaGFyLmxlbmd0aCkgIT09IHRyaW1DaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0ZW1wID0gdGVtcC5zdWJzdHIodHJpbUNoYXIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdIZWxwZXIuVHJpbUVuZCA9IGZ1bmN0aW9uIChzdHIsIHRyaW1DaGFyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0cmltQ2hhcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHN0cjtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcC5zdWJzdHIodGVtcC5sZW5ndGggLSB0cmltQ2hhci5sZW5ndGgsIHRyaW1DaGFyLmxlbmd0aCkgIT09IHRyaW1DaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0ZW1wID0gdGVtcC5zdWJzdHIoMCwgdGVtcC5sZW5ndGggLSB0cmltQ2hhci5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFN0cmluZ0hlbHBlci5UcmltID0gZnVuY3Rpb24gKHN0ciwgdHJpbUNoYXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHRyaW1DaGFyO1xuICAgICAgICAgICAgICAgIGlmICghdHJpbUNoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcCA9IFwiIFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHIgPSBTdHJpbmdIZWxwZXIuVHJpbVN0YXJ0KHN0ciwgdGVtcCk7XG4gICAgICAgICAgICAgICAgc3RyID0gU3RyaW5nSGVscGVyLlRyaW1FbmQoc3RyLCB0ZW1wKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgU3RyaW5nSGVscGVyLkluc2VydCA9IGZ1bmN0aW9uIChzdHIsIHN0YXJ0SW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCAwIHx8IHN0YXJ0SW5kZXggPiBzdHIubGVuZ3RoIHx8IHZhbHVlID09PSBrZXl3b3JkX251bGwgfHwgdmFsdWUgPT09IGtleXdvcmRfdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGVtcFN0clN0YXJ0ID0gc3RyLnN1YnN0cigwLCBzdGFydEluZGV4KTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcFN0ckVuZCA9IHN0ci5zdWJzdHIoc3RhcnRJbmRleCwgc3RyLmxlbmd0aCAtIHN0YXJ0SW5kZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wU3RyU3RhcnQgKyB2YWx1ZSArIHRlbXBTdHJFbmQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdIZWxwZXIuUmVtb3ZlID0gZnVuY3Rpb24gKHN0ciwgc3RhcnRJbmRleCwgY291bnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IGNvdW50ID09PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSBzdHIubGVuZ3RoIC0gc3RhcnRJbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCAwIHx8IGNvdW50IDwgMCB8fCBzdGFydEluZGV4ICsgY291bnQgPiBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVTdGFydCA9IHN0ci5zdWJzdHIoMCwgc3RhcnRJbmRleCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlRW5kID0gc3RyLnN1YnN0cihzdGFydEluZGV4ICsgY291bnQsIHN0ci5sZW5ndGggLSBzdGFydEluZGV4IC0gY291bnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVN0YXJ0ICsgdmFsdWVFbmQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdIZWxwZXIuU3RhcnRzV2l0aCA9IGZ1bmN0aW9uIChzdHIsIHZhbHVlLCBjb21wYXJpc29uVHlwZSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IHN0ci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGhpc1N0ciA9IHN0cjtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVTdHIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFyaXNvblR5cGUgPT09IDEgLyogQ3VycmVudEN1bHR1cmVJZ25vcmVDYXNlICovKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNTdHIgPSB0aGlzU3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlU3RyID0gdmFsdWVTdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNTdHIuc2VhcmNoKG5ldyBSZWdFeHAoXCJeXCIgKyB2YWx1ZVN0cikpID4gLTE7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBTdHJpbmdIZWxwZXIuRW5kc1dpdGggPSBmdW5jdGlvbiAoc3RyLCB2YWx1ZSwgY29tcGFyaXNvblR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRoaXNTdHIgPSBzdHI7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlU3RyID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmlzb25UeXBlID09PSAxIC8qIEN1cnJlbnRDdWx0dXJlSWdub3JlQ2FzZSAqLykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzU3RyID0gdGhpc1N0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVN0ciA9IHZhbHVlU3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzU3RyLnNlYXJjaChuZXcgUmVnRXhwKHZhbHVlU3RyICsgXCIkXCIpKSA+IC0xO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgU3RyaW5nSGVscGVyLlJlcGxhY2UgPSBmdW5jdGlvbiAoc3RyLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZFZhbHVlIHx8IG9sZFZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKG9sZFZhbHVlLCBcImdcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZ0hlbHBlcjtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgc3ByZWFkLlN0cmluZ0hlbHBlciA9IFN0cmluZ0hlbHBlcjtcblxuICAgICAgICAvLzwvZWRpdG9yLWZvbGQ+XG4gICAgICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJEYXRlSGVscGVyXCI+XG4gICAgICAgIHZhciBfRGF0ZVRpbWVIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX0RhdGVUaW1lSGVscGVyKGRhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRlID0gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5wcm90b3R5cGUuSG91ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnByb3RvdHlwZS5NaW51dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnByb3RvdHlwZS5TZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGUuZ2V0U2Vjb25kcygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnByb3RvdHlwZS5NaWxsaXNlY29uZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5wcm90b3R5cGUuVG90YWxEYXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoX2Zsb29yKHRoaXMudG9PQURhdGUoKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIucHJvdG90eXBlLnRvT0FEYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfRGF0ZVRpbWVIZWxwZXIuX19fdG9PQURhdGUodGhpcy5fZGF0ZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdG9Gb3JtYXR0ZWRTdHJpbmcoZm9ybWF0LCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIucHJvdG90eXBlLmN1c3RvbUN1bHR1cmVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0LCBjdWx0dXJlSW5mbykge1xuICAgICAgICAgICAgICAgIGlmICghY3VsdHVyZUluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY3VsdHVyZUluZm8gPSBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvRm9ybWF0dGVkU3RyaW5nKGZvcm1hdCwgY3VsdHVyZUluZm8pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnByb3RvdHlwZS5sb2NhbGVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvRm9ybWF0dGVkU3RyaW5nKGZvcm1hdCwgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnByb3RvdHlwZS5fdG9Gb3JtYXR0ZWRTdHJpbmcgPSBmdW5jdGlvbiAoZm9ybWF0LCBjdWx0dXJlSW5mbykge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZHRmID0gY3VsdHVyZUluZm8uRGF0ZVRpbWVGb3JtYXQoKSwgY29udmVydCA9IGR0Zi5DYWxlbmRhci5jb252ZXJ0O1xuICAgICAgICAgICAgICAgIGlmICghZm9ybWF0IHx8ICFmb3JtYXQubGVuZ3RoIHx8IChmb3JtYXQgPT09ICdpJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1bHR1cmVJbmZvICYmIGN1bHR1cmVJbmZvLk5hbWUoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3RvRm9ybWF0dGVkU3RyaW5nKGR0Zi5mdWxsRGF0ZVRpbWVQYXR0ZXJuLCBjdWx0dXJlSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kYXRlLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgZXJhRGF0ZSA9IG5ldyBEYXRlKHNlbGYuX2RhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBlcmEgPSBfRGF0ZVRpbWVIZWxwZXIuX19nZXRFcmEoc2VsZi5fZGF0ZSwgZHRmLmVyYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZXJhRGF0ZS5zZXRGdWxsWWVhcihfRGF0ZVRpbWVIZWxwZXIuX19nZXRFcmFZZWFyKHNlbGYuX2RhdGUsIGR0ZiwgZXJhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gZXJhRGF0ZS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RhdGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZXJhcyA9IGR0Zi5lcmFzLCBzb3J0YWJsZSA9IChmb3JtYXQgPT09IFwic1wiKTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBfRGF0ZVRpbWVIZWxwZXIuX19leHBhbmRGb3JtYXQoZHRmLCBmb3JtYXQpO1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBob3VyO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kRGF5LCBjaGVja2VkRGF5LCBkYXlQYXJ0UmVnRXhwID0gLyhbXmRdfF4pKGR8ZGQpKFteZF18JCkvZztcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhc0RheSgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kRGF5IHx8IGNoZWNrZWREYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZERheTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3VuZERheSA9IGRheVBhcnRSZWdFeHAudGVzdChmb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICBjaGVja2VkRGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kRGF5O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBxdW90ZUNvdW50ID0gMCwgdG9rZW5SZWdFeHAgPSBfRGF0ZVRpbWVIZWxwZXIuX19nZXRUb2tlblJlZ0V4cCgpLCBjb252ZXJ0ZWQ7XG4gICAgICAgICAgICAgICAgaWYgKCFzb3J0YWJsZSAmJiBjb252ZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbnZlcnQuZnJvbUdyZWdvcmlhbihzZWxmLl9kYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UGFydChkYXRlLCBwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb252ZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb252ZXJ0ZWRbcGFydF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBlcmFEYXRlSW5mbyA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgZXJhSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICB2YXIgZXJhWWVhckluZGV4ID0gLTI7XG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZ1ZhbHVlID0geyB2YWx1ZTogXCJcIiB9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHRva2VuSW5kZXggPSAwOyA7IHRva2VuSW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0b2tlblJlZ0V4cC5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhciA9IHRva2VuUmVnRXhwLmV4ZWMoZm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZU1hdGNoID0gZm9ybWF0LnNsaWNlKGluZGV4LCBhciA/IGFyLmluZGV4IDogZm9ybWF0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgcXVvdGVDb3VudCArPSBfRGF0ZVRpbWVIZWxwZXIuX19hcHBlbmRQcmVPclBvc3RNYXRjaChwcmVNYXRjaCwgc3RyaW5nVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gc3RyaW5nVmFsdWUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgocXVvdGVDb3VudCAlIDIpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKGFyWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhclswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRkZGRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKGR0Zi5kYXlOYW1lc1tzZWxmLl9kYXRlLmdldERheSgpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZGRkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChkdGYuYWJicmV2aWF0ZWREYXlOYW1lc1tzZWxmLl9kYXRlLmdldERheSgpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZGRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZERheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm8oZ2V0UGFydChzZWxmLl9kYXRlLCAyKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZERheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChnZXRQYXJ0KHNlbGYuX2RhdGUsIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNTU1NXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9ICgoZHRmLm1vbnRoR2VuaXRpdmVOYW1lcyAmJiBoYXNEYXkoKSkgPyBkdGYubW9udGhHZW5pdGl2ZU5hbWVzW2dldFBhcnQoc2VsZi5fZGF0ZSwgMSldIDogZHRmLm1vbnRoTmFtZXNbZ2V0UGFydChzZWxmLl9kYXRlLCAxKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1NTVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoKGR0Zi5hYmJyZXZpYXRlZE1vbnRoR2VuaXRpdmVOYW1lcyAmJiBoYXNEYXkoKSkgPyBkdGYuYWJicmV2aWF0ZWRNb250aEdlbml0aXZlTmFtZXNbZ2V0UGFydChzZWxmLl9kYXRlLCAxKV0gOiBkdGYuYWJicmV2aWF0ZWRNb250aE5hbWVzW2dldFBhcnQoc2VsZi5fZGF0ZSwgMSldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNTVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKGdldFBhcnQoc2VsZi5fZGF0ZSwgMSkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoZ2V0UGFydChzZWxmLl9kYXRlLCAxKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInl5eXlcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ5eXlcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBlcmEgaGFkIGJlZW4gc2V0dGVkLCBzYW1lIGFzIFwiZWVcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJhSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZXJhcy5mb3JtYXRFcmFQYXJ0KFwiZWVcIiwgc2VsZi5fZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChfRGF0ZVRpbWVIZWxwZXIuX19fcGFkWWVhcihjb252ZXJ0ZWQgPyBjb252ZXJ0ZWRbMF0gOiBzZWxmLl9kYXRlLmdldEZ1bGxZZWFyKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwieXlcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBlcmEgaGFkIGJlZW4gc2V0dGVkLCBzYW1lIGFzIFwiZWVcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJhSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZXJhcy5mb3JtYXRFcmFQYXJ0KFwiZWVcIiwgc2VsZi5fZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm8oKGNvbnZlcnRlZCA/IGNvbnZlcnRlZFswXSA6IHNlbGYuX2RhdGUuZ2V0RnVsbFllYXIoKSkgJSAxMDApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwieVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGVyYSBoYWQgYmVlbiBzZXR0ZWQsIHNhbWUgYXMgXCJlXCIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyYUluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGVyYXMuZm9ybWF0RXJhUGFydChcImVcIiwgc2VsZi5fZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9ICgoKGNvbnZlcnRlZCA/IGNvbnZlcnRlZFswXSA6IHNlbGYuX2RhdGUuZ2V0RnVsbFllYXIoKSkgJSAxMDApLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoaFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPSBzZWxmLl9kYXRlLmdldEhvdXJzKCkgJSAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaG91ciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3VyID0gMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKGhvdXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9IHNlbGYuX2RhdGUuZ2V0SG91cnMoKSAlIDEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob3VyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPSAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChob3VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJISFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKHNlbGYuX2RhdGUuZ2V0SG91cnMoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKHNlbGYuX2RhdGUuZ2V0SG91cnMoKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtbVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKHNlbGYuX2RhdGUuZ2V0TWludXRlcygpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoc2VsZi5fZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3NcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKF9EYXRlVGltZUhlbHBlci5fX19hZGRMZWFkaW5nWmVybyhzZWxmLl9kYXRlLmdldFNlY29uZHMoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKHNlbGYuX2RhdGUuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInR0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9ICgoc2VsZi5fZGF0ZS5nZXRIb3VycygpIDwgMTIpID8gZHRmLmFtRGVzaWduYXRvciA6IGR0Zi5wbURlc2lnbmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKCgoc2VsZi5fZGF0ZS5nZXRIb3VycygpIDwgMTIpID8gZHRmLmFtRGVzaWduYXRvciA6IGR0Zi5wbURlc2lnbmF0b3IpLmNoYXJBdCgwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvcyhzZWxmLl9kYXRlLmdldE1pbGxpc2Vjb25kcygpKS5jaGFyQXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZmXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm9zKHNlbGYuX2RhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpLnN1YnN0cigwLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmZmXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm9zKHNlbGYuX2RhdGUuZ2V0TWlsbGlzZWNvbmRzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ6XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9IHNlbGYuX2RhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoKChob3VyIDw9IDApID8gJysnIDogJy0nKSArIE1hdGhfZmxvb3IoTWF0aF9hYnMoaG91cikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ6elwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPSBzZWxmLl9kYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKCgoaG91ciA8PSAwKSA/ICcrJyA6ICctJykgKyBfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm8oTWF0aF9mbG9vcihNYXRoX2Ficyhob3VyKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ6enpcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3VyID0gc2VsZi5fZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9ICgoKGhvdXIgPD0gMCkgPyAnKycgOiAnLScpICsgX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKE1hdGhfZmxvb3IoTWF0aF9hYnMoaG91cikpKSArIFwiOlwiICsgX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvKE1hdGhfYWJzKHNlbGYuX2RhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAlIDYwKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdnZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyIGN1bHR1cmUsIGRvIG5vdGhpbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlcmFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJhSW5kZXggPT09IHRva2VuSW5kZXggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyYUluZGV4ID0gdG9rZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGVyYXMuZm9ybWF0RXJhUGFydChhclswXSwgc2VsZi5fZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyYUluZGV4ID0gdG9rZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXIgY3VsdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXJhcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKF9EYXRlVGltZUhlbHBlci5fX19wYWRZZWFyKGNvbnZlcnRlZCA/IGNvbnZlcnRlZFswXSA6IHNlbGYuX2RhdGUuZ2V0RnVsbFllYXIoKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyYVllYXJJbmRleCA9PT0gdG9rZW5JbmRleCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJhWWVhckluZGV4ID0gdG9rZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGVyYXMuZm9ybWF0RXJhUGFydChhclswXSwgc2VsZi5fZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyYVllYXJJbmRleCA9IHRva2VuSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKGR0Zi5kYXRlU2VwYXJhdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJbaF1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKFwiW2hdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIltoaF1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gKFwiW2hoXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJbbW1dXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IChcIlttbV1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiW3NzXVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAoXCJbc3NdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByZWFkLlNSLkV4cF9JbnZhbGlkRGF0ZUZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldC50b1N0cmluZygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnBhcnNlTG9jYWxlID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IFt2YWx1ZSwgZm9ybWF0c107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IFt2YWx1ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfRGF0ZVRpbWVIZWxwZXIuX3BhcnNlRGF0ZSh2YWx1ZSwgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmUsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnBhcnNlSW52YXJpYW50ID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9EYXRlVGltZUhlbHBlci5fcGFyc2VEYXRlKHZhbHVlLCBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLmludmFyaWFudEN1bHR1cmUoKSwgW3ZhbHVlLCBmb3JtYXRzXSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX19hcHBlbmRQcmVPclBvc3RNYXRjaCA9IGZ1bmN0aW9uIChwcmVNYXRjaCwgc3RyQnVpbGRlcikge1xuICAgICAgICAgICAgICAgIHZhciBxdW90ZUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgZXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHByZU1hdGNoLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBwcmVNYXRjaC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnXFwnJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1xcXCInOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1aWxkZXIudmFsdWUgKz0gXCInXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGVDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWlsZGVyLnZhbHVlICs9IFwiXFxcXFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1aWxkZXIudmFsdWUgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1b3RlQ291bnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX19leHBhbmRGb3JtYXQgPSBmdW5jdGlvbiAoZHRmLCBmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBcIkZcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IGZvcm1hdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGxlbiA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnNob3J0RGF0ZVBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkdGYubG9uZ0RhdGVQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnNob3J0VGltZVBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkdGYubG9uZ1RpbWVQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLmxvbmdEYXRlUGF0dGVybiArIFwiIFwiICsgZHRmLnNob3J0VGltZVBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkdGYuZnVsbERhdGVUaW1lUGF0dGVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkdGYubW9udGhEYXlQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnNvcnRhYmxlRGF0ZVRpbWVQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIllcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ5XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGR0Zi55ZWFyTW9udGhQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnNob3J0RGF0ZVBhdHRlcm4gKyBcIiBcIiArIGR0Zi5zaG9ydFRpbWVQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnNob3J0RGF0ZVBhdHRlcm4gKyBcIiBcIiArIGR0Zi5sb25nVGltZVBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnJmYzExMjNQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLnVuaXZlcnNhbFNvcnRhYmxlRGF0ZVRpbWVQYXR0ZXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLmZ1bGxEYXRlVGltZVBhdHRlcm47XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwib1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ5eXl5XFwnLVxcJ01NXFwnLVxcJ2RkXFwnVFxcJ0hIXFwnOlxcJ21tXFwnOlxcJ3NzXFwnLlxcJ2ZmZmZmZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmVhZC5TUi5FeHBfSW52YWxpZFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChsZW4gPT09IDIpICYmIChmb3JtYXQuY2hhckF0KDApID09PSBcIiVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LmNoYXJBdCgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fX2V4cGFuZFllYXIgPSBmdW5jdGlvbiAoY3VsdHVyZUluZm8sIHllYXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgZXJhcyA9IGN1bHR1cmVJbmZvLkRhdGVUaW1lRm9ybWF0KCkuZXJhcztcbiAgICAgICAgICAgICAgICBpZiAoZXJhcyAmJiB5ZWFyIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyID0gZXJhcy5nZXRFcmFEYXRlKG5vdykuZXJhWWVhcjtcbiAgICAgICAgICAgICAgICAgICAgeWVhciArPSBjdXJyIC0gKGN1cnIgJSAxMDApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeWVhciA+IGN1bHR1cmVJbmZvLkRhdGVUaW1lRm9ybWF0KCkuQ2FsZW5kYXIuVHdvRGlnaXRZZWFyTWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyIC09IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fX2dldFRva2VuUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvXFwvfGRkZGR8ZGRkfGRkfGR8TU1NTXxNTU18TU18TXx5eXl5fHl5eXx5eXx5fGhofGh8SEh8SHxtbXxtfHNzfHN8dHR8dHxmZmZ8ZmZ8Znx6enp8enp8enxnZ2d8Z2d8Z3xlZXxlfFxcW2hcXF18XFxbaGhcXF18XFxbbW1cXF18XFxbc3NcXF0vZztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fX2dldFBhcnNlUmVnRXhwID0gZnVuY3Rpb24gKGR0ZiwgZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFkdGYuX3BhcnNlUmVnRXhwKSB7XG4gICAgICAgICAgICAgICAgICAgIGR0Zi5fcGFyc2VSZWdFeHAgPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGR0Zi5fcGFyc2VSZWdFeHBbZm9ybWF0XSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZHRmLl9wYXJzZVJlZ0V4cFtmb3JtYXRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZXhwRm9ybWF0ID0gX0RhdGVUaW1lSGVscGVyLl9fZXhwYW5kRm9ybWF0KGR0ZiwgZm9ybWF0KTtcblxuICAgICAgICAgICAgICAgIC8vIEN5bGogZml4IHRoZSBidWcgNDE1NzEgYXQgMjAxMy8xMC8yMS5cbiAgICAgICAgICAgICAgICAvLyBUaGUgdmFsaWREYXRlVGltZUZvcm1hdFN0cmluZyB3aWxsIHJlcGxhY2UgdGhlIFwibVwiIHRvIFwiJU1cIixcbiAgICAgICAgICAgICAgICAvLyBTbyByZW1vdmUgdGhlIFwiJVwiIGhlcmUuXG4gICAgICAgICAgICAgICAgZXhwRm9ybWF0ID0gZXhwRm9ybWF0LnJlcGxhY2UoXCIlTVwiLCBcIk1cIik7XG4gICAgICAgICAgICAgICAgZXhwRm9ybWF0ID0gZXhwRm9ybWF0LnJlcGxhY2UoLyhbXFxeXFwkXFwuXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFx7XFx9XSkvZywgXCJcXFxcXFxcXCQxXCIpO1xuICAgICAgICAgICAgICAgIHZhciByZWdleHAgPSBcIl5cIjtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nVmFsdWUgPSB7IHZhbHVlOiBcIlwiIH07XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHF1b3RlQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHZhciB0b2tlblJlZ0V4cCA9IF9EYXRlVGltZUhlbHBlci5fX2dldFRva2VuUmVnRXhwKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAgICAgICAgIHdoaWxlICgobWF0Y2ggPSB0b2tlblJlZ0V4cC5leGVjKGV4cEZvcm1hdCkpICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nVmFsdWUudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJlTWF0Y2ggPSBleHBGb3JtYXQuc2xpY2UoaW5kZXgsIG1hdGNoLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB0b2tlblJlZ0V4cC5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHF1b3RlQ291bnQgKz0gX0RhdGVUaW1lSGVscGVyLl9fYXBwZW5kUHJlT3JQb3N0TWF0Y2gocHJlTWF0Y2gsIHN0cmluZ1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IHN0cmluZ1ZhbHVlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHF1b3RlQ291bnQgJSAyKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGRkZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZGQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnTU1NTSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdNTU0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdnZ2cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxEKylcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cCArPSBcIihcXFxcRCopXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd5eXknOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneXl5eSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxkezR9KVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZmZmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdleHAgKz0gXCIoXFxcXGR7M30pXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmZic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxkezJ9KVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxkKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdNTSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3l5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWVlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnSEgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnSCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdoaCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21tJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxkXFxcXGQ/KVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnenp6JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdleHAgKz0gXCIoWystXT9cXFxcZFxcXFxkPzpcXFxcZHsyfSlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3p6JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3onOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2V4cCArPSBcIihbKy1dP1xcXFxkXFxcXGQ/KVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnZXhwICs9IFwiKFxcXFxcIiArIGR0Zi5kYXRlU2VwYXJhdG9yICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJlYWQuU1IuRXhwX0ludmFsaWREYXRlRm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBBcnJheUhlbHBlci5hZGQoZ3JvdXBzLCBtYXRjaFswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZ1ZhbHVlLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX19hcHBlbmRQcmVPclBvc3RNYXRjaChleHBGb3JtYXQuc2xpY2UoaW5kZXgpLCBzdHJpbmdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmVnZXhwICs9IHN0cmluZ1ZhbHVlLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJlZ2V4cCArPSBcIiRcIjtcbiAgICAgICAgICAgICAgICB2YXIgcmVnZXhwU3RyID0gcmVnZXhwLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxzKy9nLCBcIlxcXFxzK1wiKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VSZWdFeHAgPSB7ICdyZWdFeHAnOiByZWdleHBTdHIsICdncm91cHMnOiBncm91cHMsICdleHAnOiBuZXcgUmVnRXhwKHJlZ2V4cFN0cikgfTtcbiAgICAgICAgICAgICAgICBkdGYuX3BhcnNlUmVnRXhwW2Zvcm1hdF0gPSBwYXJzZVJlZ0V4cDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VSZWdFeHA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX3BhcnNlRGF0ZUV4YWN0ID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXQsIGN1bHR1cmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXcgX1N0cmluZ0hlbHBlcih2YWx1ZSkudHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhciBkdGYgPSBjdWx0dXJlSW5mby5EYXRlVGltZUZvcm1hdCgpLCBwYXJzZUluZm8gPSBfRGF0ZVRpbWVIZWxwZXIuX19nZXRQYXJzZVJlZ0V4cChkdGYsIGZvcm1hdCksIG1hdGNoID0gcGFyc2VJbmZvLmV4cC5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSBwYXJzZUluZm8uZ3JvdXBzLCBlcmEgPSBrZXl3b3JkX251bGwsIHllYXIgPSBrZXl3b3JkX251bGwsIG1vbnRoID0ga2V5d29yZF9udWxsLCBkYXRlID0ga2V5d29yZF9udWxsLCB3ZWVrRGF5ID0ga2V5d29yZF9udWxsLCBob3VyID0gMCwgaG91ck9mZnNldCwgbWluID0gMCwgc2VjID0gMCwgbXNlYyA9IDAsIHR6TWluT2Zmc2V0ID0ga2V5d29yZF9udWxsLCBwbUhvdXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgaXNUaW1lU3BhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gZ3JvdXBzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoR3JvdXAgPSBtYXRjaFtqICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaEdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGdyb3Vwc1tqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUaW1lU3BhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlID0gcGFyc2VJbnQobWF0Y2hHcm91cCwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGRhdGUgPCAxKSB8fCAoZGF0ZSA+IDMxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdNTU1NJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUaW1lU3BhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IGN1bHR1cmVJbmZvLl9nZXRNb250aEluZGV4KG1hdGNoR3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG1vbnRoIDwgMCkgfHwgKG1vbnRoID4gMTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVGltZVNwYW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBjdWx0dXJlSW5mby5fZ2V0QWJick1vbnRoSW5kZXgobWF0Y2hHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobW9udGggPCAwKSB8fCAobW9udGggPiAxMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnTSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnTU0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJyVNJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUaW1lU3BhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKSAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobW9udGggPCAwKSB8fCAobW9udGggPiAxMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RpbWVTcGFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBfRGF0ZVRpbWVIZWxwZXIuX19leHBhbmRZZWFyKGN1bHR1cmVJbmZvLCBwYXJzZUludChtYXRjaEdyb3VwLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHllYXIgPCAwKSB8fCAoeWVhciA+IDk5OTkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3l5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd5eXknOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3l5eXknOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RpbWVTcGFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBwYXJzZUludChtYXRjaEdyb3VwLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoeWVhciA8IDApIHx8ICh5ZWFyID4gOTk5OSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaGgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0hIJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChob3VyIDwgMCkgfHwgKGhvdXIgPiAyMykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW4gPSBwYXJzZUludChtYXRjaEdyb3VwLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWluIDwgMCkgfHwgKG1pbiA+IDU5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYyA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChzZWMgPCAwKSB8fCAoc2VjID4gNTkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVwcGVyVG9rZW4gPSBtYXRjaEdyb3VwLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBtSG91ciA9ICh1cHBlclRva2VuID09PSBkdGYucG1EZXNpZ25hdG9yLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBtSG91ciAmJiAodXBwZXJUb2tlbiAhPT0gZHRmLmFtRGVzaWduYXRvci50b1VwcGVyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNlYyA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKSAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtc2VjIDwgMCkgfHwgKG1zZWMgPiA5OTkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNlYyA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKSAqIDEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG1zZWMgPCAwKSB8fCAobXNlYyA+IDk5OSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZmZmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNlYyA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtc2VjIDwgMCkgfHwgKG1zZWMgPiA5OTkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RpbWVTcGFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlZWtEYXkgPSBjdWx0dXJlSW5mby5fZ2V0RGF5SW5kZXgobWF0Y2hHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgod2Vla0RheSA8IDApIHx8ICh3ZWVrRGF5ID4gNikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGRkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUaW1lU3BhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWVrRGF5ID0gY3VsdHVyZUluZm8uX2dldEFiYnJEYXlJbmRleChtYXRjaEdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh3ZWVrRGF5IDwgMCkgfHwgKHdlZWtEYXkgPiA2KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd6enonOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0cyA9IG1hdGNoR3JvdXAuc3BsaXQoLzovKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldHMubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXJPZmZzZXQgPSBwYXJzZUludChvZmZzZXRzWzBdLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaG91ck9mZnNldCA8IC0xMikgfHwgKGhvdXJPZmZzZXQgPiAxMykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbk9mZnNldCA9IHBhcnNlSW50KG9mZnNldHNbMV0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtaW5PZmZzZXQgPCAwKSB8fCAobWluT2Zmc2V0ID4gNTkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR6TWluT2Zmc2V0ID0gKGhvdXJPZmZzZXQgKiA2MCkgKyAobmV3IF9TdHJpbmdIZWxwZXIobWF0Y2hHcm91cCkuc3RhcnRzV2l0aCgnLScpID8gLW1pbk9mZnNldCA6IG1pbk9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3onOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3p6JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCA9IHBhcnNlSW50KG1hdGNoR3JvdXAsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChob3VyT2Zmc2V0IDwgLTEyKSB8fCAoaG91ck9mZnNldCA+IDEzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ek1pbk9mZnNldCA9IGhvdXJPZmZzZXQgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnZ2dcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyYU5hbWUgPSBtYXRjaEdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVyYU5hbWUgfHwgIWR0Zi5lcmFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyYSA9IGR0Zi5lcmFzLnBhcnNlRXJhUGFydChncm91cHNbal0sIGVyYU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vMTg5OS8xMi8zMCBpcyB0aGUgc3RhcnQgZGF0ZSBvZiBPQURhdGVcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IERhdGUoMTg5OSwgMTEsIDMwKSwgZGVmYXVsdHMsIGNvbnZlcnQgPSBkdGYuQ2FsZW5kYXIuY29udmVydDtcbiAgICAgICAgICAgICAgICBpZiAoY29udmVydCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0cyA9IGNvbnZlcnQuZnJvbUdyZWdvcmlhbihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWNvbnZlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHMgPSBbcmVzdWx0LmdldEZ1bGxZZWFyKCksIHJlc3VsdC5nZXRNb250aCgpLCByZXN1bHQuZ2V0RGF0ZSgpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHllYXIgPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB5ZWFyID0gZGVmYXVsdHNbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh5ZWFyIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkdGYuZXJhcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy95ZWFyICs9IGR0Zi5lcmFzWyhlcmEgfHwgMCkgKyAzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBkdGYuZXJhcy5nZXRZZWFyRnJvbUVyYShlcmEgfHwgMCwgeWVhcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeWVhciA+PSAzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgKz0gMTkwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeWVhciArPSAyMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtb250aCA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbnRoID0gZGVmYXVsdHNbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkYXRlID09PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IGRlZmF1bHRzWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29udmVydCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBjb252ZXJ0LnRvR3JlZ29yaWFuKHllYXIsIG1vbnRoLCBkYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5nZXREYXRlKCkgIT09IGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCh3ZWVrRGF5ICE9PSBrZXl3b3JkX251bGwpICYmIChyZXN1bHQuZ2V0RGF5KCkgIT09IHdlZWtEYXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwbUhvdXIgJiYgKGhvdXIgPCAxMikpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldEhvdXJzKGhvdXIsIG1pbiwgc2VjLCBtc2VjKTtcbiAgICAgICAgICAgICAgICBpZiAodHpNaW5PZmZzZXQgIT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRqdXN0ZWRNaW4gPSByZXN1bHQuZ2V0TWludXRlcygpIC0gKHR6TWluT2Zmc2V0ICsgcmVzdWx0LmdldFRpbWV6b25lT2Zmc2V0KCkpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc2V0SG91cnMocmVzdWx0LmdldEhvdXJzKCkgKyBhZGp1c3RlZE1pbiAvIDYwLCBhZGp1c3RlZE1pbiAlIDYwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1RPRE86IGV4dGVuZHMgX2NsYXNzTmFtZXMgdG8gRGF0ZS5cbiAgICAgICAgICAgICAgICAvL3Jlc3VsdC5fY2xhc3NOYW1lcyA9IFtpc1RpbWVTcGFuID8gXCJUaW1lU3BhblwiIDogXCJEYXRlVGltZVwiXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLl9fX2FkZExlYWRpbmdaZXJvID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW0gPCAxMCA/ICgnMCcgKyBudW0pIDogbnVtLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX19fYWRkTGVhZGluZ1plcm9zID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW0gPCAxMCA/ICgnMDAnICsgbnVtKSA6IChudW0gPCAxMDAgPyAoJzAnICsgbnVtKSA6IG51bS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fX19wYWRZZWFyID0gZnVuY3Rpb24gKHllYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhciA8IDEwID8gKCcwMDAnICsgeWVhcikgOiAoeWVhciA8IDEwMCA/ICgnMDAnICsgeWVhcikgOiAoeWVhciA8IDEwMDAgPyAoJzAnICsgeWVhcikgOiB5ZWFyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fcGFyc2VEYXRlID0gZnVuY3Rpb24gKHZhbHVlLCBjdWx0dXJlSW5mbywgYXJncykge1xuICAgICAgICAgICAgICAgIHZhciBpLCBsLCBkYXRlLCBmb3JtYXQsIGZvcm1hdHMsIGN1c3RvbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDEsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBhcmdzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXN0b20gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IF9EYXRlVGltZUhlbHBlci5fcGFyc2VEYXRlRXhhY3QodmFsdWUsIGZvcm1hdCwgY3VsdHVyZUluZm8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWN1c3RvbSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRzID0gY3VsdHVyZUluZm8uX2dldERhdGVUaW1lRm9ybWF0cygpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gZm9ybWF0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUgPSBfRGF0ZVRpbWVIZWxwZXIuX3BhcnNlRGF0ZUV4YWN0KHZhbHVlLCBmb3JtYXRzW2ldLCBjdWx0dXJlSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAxNDQwOiA2MCoyNCAgb25lRGF5TWludXRlXG4gICAgICAgICAgICAvLyA4NjQwMDAwMDogb25lRGF5TWlsbFNlY29uZHNcbiAgICAgICAgICAgIC8vIDI1NTY5OiBvYURhdGUgb2YgMTk3MC8xLzFcbiAgICAgICAgICAgIC8vIERhdGUuZ2V0VGltZSgpIG1pbGwgc2Vjb25kcyBmcm9tIDE5NzAvMS8xKFVUQylcbiAgICAgICAgICAgIF9EYXRlVGltZUhlbHBlci5fX190b09BRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGUgPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IGRhdGUgPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL3JldHVybiAoZGF0ZS5nZXRUaW1lKCkgLyA4NjQwMDAwMCkgKyAyNTU2OSAtIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE0NDA7XG4gICAgICAgICAgICAgICAgLy8gbXVsdGlwbHkgODY0MDAwMDAgYW5kIDE0NDAgZmlyc3QgdGhlbiBkbyBkaXZpZGUuIGl0IHdpbGwgY2F1c2Ugc29tZSBmbG9hdCBwcmVjaXNpb24gZXJyb3IgaWYgdGhlIG9yZGVyIGlzIG5vdC5cbiAgICAgICAgICAgICAgICByZXR1cm4gKGRhdGUuZ2V0VGltZSgpICogMTQ0MCArIDI1NTY5ICogODY0MDAwMDAgKiAxNDQwIC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogODY0MDAwMDApIC8gKDg2NDAwMDAwICogMTQ0MCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfRGF0ZVRpbWVIZWxwZXIuX2Zyb21PQURhdGUgPSBmdW5jdGlvbiAob2FkYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldERheSA9IG9hZGF0ZSAtIDI1NTY5O1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUob2Zmc2V0RGF5ICogODY0MDAwMDApO1xuXG4gICAgICAgICAgICAgICAgLy8gbXVsdGlwbHkgODY0MDAwMDAgZmlyc3QgdGhlbiBkbyBkaXZpZGUuIGl0IHdpbGwgY2F1c2Ugc29tZSBmbG9hdCBwcmVjaXNpb24gZXJyb3IgaWYgdGhlIG9yZGVyIGlzIG5vdC5cbiAgICAgICAgICAgICAgICAvLyAyMDE0LzEwLzE3IGJlbi55aW4gaGVyZSBpcyBhIFwiKzFcIiBvciBcIi0xXCIsIGlzIGZvciBqYXZhc2NyaXB0IGRpdmlkZSBsb3cgcHJlY2lzaW9uLCBpdCB3aWxsIGxvc3MgbGFzdCBkaWdpdCBwcmVjaXNpb24uU28gaGVyZSBhZGQgMSwgZm9yIGxvc3MsIGZvciByZXN1bHQgcmlnaHQuXG4gICAgICAgICAgICAgICAgLy8gYWRkIDEgd2hlbiBhZnRlciAxOTg3LCBzdWIgMSB3aGVuIGJlZm9yZSAxOTg3XG4gICAgICAgICAgICAgICAgdmFyIGFkanVzdFZhbHVlID0gb2Zmc2V0RGF5ID49IDAgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKChvYWRhdGUgKiA4NjQwMDAwMCAqIDE0NDAgKyBhZGp1c3RWYWx1ZSAtIDI1NTY5ICogODY0MDAwMDAgKiAxNDQwICsgZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogODY0MDAwMDApIC8gMTQ0MCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLnBhcnNlRXhhY3QgPSBfRGF0ZVRpbWVIZWxwZXIuX3BhcnNlRGF0ZUV4YWN0O1xuICAgICAgICAgICAgX0RhdGVUaW1lSGVscGVyLmZyb21PQURhdGUgPSBfRGF0ZVRpbWVIZWxwZXIuX2Zyb21PQURhdGU7XG4gICAgICAgICAgICByZXR1cm4gX0RhdGVUaW1lSGVscGVyO1xuICAgICAgICB9KSgpO1xuICAgICAgICBzcHJlYWQuX0RhdGVUaW1lSGVscGVyID0gX0RhdGVUaW1lSGVscGVyO1xuXG4gICAgICAgIC8vPC9lZGl0b3ItZm9sZD5cbiAgICAgICAgdmFyIHBhcnNlZEZvcm1hdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBwYXJzZWRGb3JtYXQobm9ybWFsLCBuZWdhdGl2ZSwgemVybykge1xuICAgICAgICAgICAgICAgIHRoaXMubm9ybWFsID0gbm9ybWFsO1xuICAgICAgICAgICAgICAgIHRoaXMubmVnYXRpdmUgPSBuZWdhdGl2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnplcm8gPSB6ZXJvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEZvcm1hdDtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICB2YXIgcGFyc2VkRm9ybWF0UGFydCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBwYXJzZWRGb3JtYXRQYXJ0KCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLmludFBhcnQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWNQYXJ0ID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLnNjYWxlID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLnBlcmNlbnQgPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYucGVybWlsZSA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5leHBvbmVudCA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRGb3JtYXRQYXJ0O1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIC8vPGVkaXRvci1mb2xkIGRlc2M9XCJOdW1iZXJIZWxwZXJcIj5cbiAgICAgICAgdmFyIF9OdW1iZXJIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX051bWJlckhlbHBlcihudW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9udW0gPSBudW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvRm9ybWF0dGVkU3RyaW5nKGZvcm1hdCwgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5pbnZhcmlhbnRDdWx0dXJlKCkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5wcm90b3R5cGUubG9jYWxlRm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90b0Zvcm1hdHRlZFN0cmluZyhmb3JtYXQsIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uX2N1cnJlbnRDdWx0dXJlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIucHJvdG90eXBlLmN1c3RvbUN1bHR1cmVGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0LCBjdWx0dXJlSW5mbykge1xuICAgICAgICAgICAgICAgIGlmICghY3VsdHVyZUluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY3VsdHVyZUluZm8gPSBnbG9iYWxpemUuQ3VsdHVyZXMuX0N1bHR1cmVJbmZvLl9jdXJyZW50Q3VsdHVyZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RvRm9ybWF0dGVkU3RyaW5nKGZvcm1hdCwgY3VsdHVyZUluZm8pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5wcm90b3R5cGUuX3RvRm9ybWF0dGVkU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCwgY3VsdHVyZUluZm8pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtYXQgfHwgKGZvcm1hdC5sZW5ndGggPT09IDApIHx8IChmb3JtYXQgPT09ICdpJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1bHR1cmVJbmZvICYmIChjdWx0dXJlSW5mby5OYW1lKCkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9udW0udG9Mb2NhbGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9udW0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfTnVtYmVySGVscGVyLl9fZ2V0U3RhbmRhcmRUb2tlblJlZ0V4cCgpLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdG9TdGFuZGFyZEZvcm1hdHRlZFN0cmluZyhmb3JtYXQsIGN1bHR1cmVJbmZvLk51bWJlckZvcm1hdCgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fdG9DdXN0b21Gb3JtYXR0ZWRTdHJpbmcoZm9ybWF0LCBjdWx0dXJlSW5mby5OdW1iZXJGb3JtYXQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5wcm90b3R5cGUuX3RvU3RhbmRhcmRGb3JtYXR0ZWRTdHJpbmcgPSBmdW5jdGlvbiAoZm9ybWF0LCBuZikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgbnVtID0gTWF0aF9hYnMoc2VsZi5fbnVtKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGlmICghZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IFwiRFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gLTE7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IHBhcnNlSW50KGZvcm1hdC5zbGljZSgxKSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcGF0dGVybiwgcmVzdWx0QXJyYXk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYXQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJEXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gJ24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZWNpc2lvbiAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW0gPSBfTnVtYmVySGVscGVyLl9fX3plcm9QYWQoXCJcIiArIG51bSwgcHJlY2lzaW9uLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9udW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtID0gXCItXCIgKyBudW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9udW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiA9IF9OdW1iZXJIZWxwZXIuX19fY3VycmVuY3lOZWdhdGl2ZVBhdHRlcm5bbmYuY3VycmVuY3lOZWdhdGl2ZVBhdHRlcm5dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gX051bWJlckhlbHBlci5fX19jdXJyZW5jeVBvc2l0aXZlUGF0dGVybltuZi5jdXJyZW5jeVBvc2l0aXZlUGF0dGVybl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IG5mLmN1cnJlbmN5RGVjaW1hbERpZ2l0cztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG51bSA9IF9OdW1iZXJIZWxwZXIuX19fZXhwYW5kTnVtYmVyKE1hdGhfYWJzKHNlbGYuX251bSksIHByZWNpc2lvbiwgbmYuY3VycmVuY3lHcm91cFNpemVzLCBuZi5jdXJyZW5jeUdyb3VwU2VwYXJhdG9yLCBuZi5jdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IsIG5mLm5lZ2F0aXZlU2lnbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5cIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk5cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9udW0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybiA9IF9OdW1iZXJIZWxwZXIuX19fbnVtYmVyTmVnYXRpdmVQYXR0ZXJuW25mLm51bWJlck5lZ2F0aXZlUGF0dGVybl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSAnbic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IG5mLm51bWJlckRlY2ltYWxEaWdpdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBudW0gPSBfTnVtYmVySGVscGVyLl9fX2V4cGFuZE51bWJlcihNYXRoX2FicyhzZWxmLl9udW0pLCBwcmVjaXNpb24sIG5mLm51bWJlckdyb3VwU2l6ZXMsICcsJywgJy4nLCBuZi5uZWdhdGl2ZVNpZ24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJQXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5fbnVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBfTnVtYmVySGVscGVyLl9fX3BlcmNlbnROZWdhdGl2ZVBhdHRlcm5bbmYucGVyY2VudE5lZ2F0aXZlUGF0dGVybl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBfTnVtYmVySGVscGVyLl9fX3BlcmNlbnRQb3NpdGl2ZVBhdHRlcm5bbmYucGVyY2VudFBvc2l0aXZlUGF0dGVybl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IG5mLnBlcmNlbnREZWNpbWFsRGlnaXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtID0gX051bWJlckhlbHBlci5fX19leHBhbmROdW1iZXIoTWF0aF9hYnMoc2VsZi5fbnVtKSAqIDEwMCwgcHJlY2lzaW9uLCBuZi5wZXJjZW50R3JvdXBTaXplcywgbmYucGVyY2VudEdyb3VwU2VwYXJhdG9yLCBuZi5wZXJjZW50RGVjaW1hbFNlcGFyYXRvciwgbmYubmVnYXRpdmVTaWduKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRlwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXJyYXkgPSBzZWxmLl90b0ZpeGVkUG9pbnQobnVtLCBwYXR0ZXJuLCBmb3JtYXQsIHByZWNpc2lvbiwgbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtID0gcmVzdWx0QXJyYXlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gcmVzdWx0QXJyYXlbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFycmF5ID0gc2VsZi5fdG9TY2llbnRpZmljTm90YXRpb24obnVtLCBwYXR0ZXJuLCBmb3JtYXQsIHByZWNpc2lvbiwgbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtID0gcmVzdWx0QXJyYXlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gcmVzdWx0QXJyYXlbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInhcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBcIm5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bSA9IF9OdW1iZXJIZWxwZXIuX19fdG9IZXhTdHJpbmcoc2VsZi5fbnVtLCBmb3JtYXQuY2hhckF0KDApID09PSAneCcsIHByZWNpc2lvbiA9PT0gLTEgPyAwIDogcHJlY2lzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZ1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiR1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bVRvU3RyID0gc2VsZi5fbnVtLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChudW1Ub1N0ci5pbmRleE9mKFwiZVwiKSkgPT09IC0xICYmIChudW1Ub1N0ci5pbmRleE9mKFwiRVwiKSA9PT0gLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXJyYXkgPSBzZWxmLl90b0ZpeGVkUG9pbnQobnVtLCBwYXR0ZXJuLCBmb3JtYXQsIHByZWNpc2lvbiwgbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBcnJheSA9IHNlbGYuX3RvU2NpZW50aWZpY05vdGF0aW9uKG51bSwgcGF0dGVybiwgZm9ybWF0LnJlcGxhY2UoXCJnXCIsIFwiZVwiKS5yZXBsYWNlKFwiR1wiLCBcIkVcIiksIHByZWNpc2lvbiwgbmYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbnVtID0gcmVzdWx0QXJyYXlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gcmVzdWx0QXJyYXlbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJlYWQuU1IuRXhwX0JhZEZvcm1hdFNwZWNpZmllcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IC9ufFxcJHwtfCUvZztcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKDsgOykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSByZWdleC5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhciA9IHJlZ2V4LmV4ZWMocGF0dGVybik7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBwYXR0ZXJuLnNsaWNlKGluZGV4LCBhciA/IGFyLmluZGV4IDogcGF0dGVybi5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGFyWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiblwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBudW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiJFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBuZi5jdXJyZW5jeVN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bMS05XS8udGVzdChudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBuZi5uZWdhdGl2ZVNpZ247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gbmYucGVyY2VudFN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmVhZC5TUi5FeHBfSW52YWxpZE51bWJlckZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIucHJvdG90eXBlLl90b1NjaWVudGlmaWNOb3RhdGlvbiA9IGZ1bmN0aW9uIChudW0sIHBhdHRlcm4sIGZvcm1hdCwgcHJlY2lzaW9uLCBuZikge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBcIm5cIjtcbiAgICAgICAgICAgICAgICBudW0gPSBfTnVtYmVySGVscGVyLl9fX3RvU2NpZW50aWZpYyhNYXRoX2Ficyh0aGlzLl9udW0pLCBmb3JtYXQuY2hhckF0KDApLCBwcmVjaXNpb24gPT09IC0xID8gNiA6IHByZWNpc2lvbiwgbmYubnVtYmVyR3JvdXBTaXplcywgJywnLCAnLicsIG5mLm5lZ2F0aXZlU2lnbik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX251bSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtID0gXCItXCIgKyBudW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbbnVtLCBwYXR0ZXJuXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIucHJvdG90eXBlLl90b0ZpeGVkUG9pbnQgPSBmdW5jdGlvbiAobnVtLCBwYXR0ZXJuLCBmb3JtYXQsIHByZWNpc2lvbiwgbmYpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbnVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gX051bWJlckhlbHBlci5fX19udW1iZXJOZWdhdGl2ZVBhdHRlcm5bbmYubnVtYmVyTmVnYXRpdmVQYXR0ZXJuXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuID0gJ24nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbnVtYmVyVmFsdWUgPSBwYXJzZUZsb2F0KG51bSk7XG4gICAgICAgICAgICAgICAgdmFyIGludGVnZXIgPSBNYXRoX2Zsb29yKG51bWJlclZhbHVlKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjID0gbnVtYmVyVmFsdWUgLSBpbnRlZ2VyO1xuICAgICAgICAgICAgICAgIG51bSA9IF9OdW1iZXJIZWxwZXIuX19fZXhwYW5kTnVtYmVyKGRlYywgcHJlY2lzaW9uLCBuZi5udW1iZXJHcm91cFNpemVzLCAnLCcsICcuJywgbmYubmVnYXRpdmVTaWduKTtcbiAgICAgICAgICAgICAgICBudW0gPSBcIlwiICsgaW50ZWdlciArIG51bS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtudW0sIHBhdHRlcm5dO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5wcm90b3R5cGUuX3RvQ3VzdG9tRm9ybWF0dGVkU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCwgbmYpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkRm9ybWF0ID0gX051bWJlckhlbHBlci5fX19wYXJzZUN1c3RvbU51bWJlckZvcm1hdHRlcihmb3JtYXQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlciA9IGtleXdvcmRfbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbnVtID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlciA9IHBhcnNlZEZvcm1hdC56ZXJvO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbnVtIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZXIgPSBwYXJzZWRGb3JtYXQubmVnYXRpdmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlciA9IHBhcnNlZEZvcm1hdC5ub3JtYWw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2luZyBmb3JtYXQgc3VjY2Vzcy5cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX051bWJlckhlbHBlci5fX19mb3JtYXROdW1iZXIodGhpcy5fbnVtLCBmb3JtYXR0ZXIsIG5mKSArIFwiXCI7XG5cbiAgICAgICAgICAgICAgICAvL09ubHkgc3VwcG9ydCBlbmdsaXNoIGN1bHR1cmVcbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdC5pbmRleE9mKG5mLm5lZ2F0aXZlU2lnbikgPT09IDEpICYmIChyZXN1bHQuaW5kZXhPZihuZi5jdXJyZW5jeVN5bWJvbCkgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFsxXSArIHJlc3VsdFswXSArIHJlc3VsdC5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLnBhcnNlTG9jYWxlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9OdW1iZXJIZWxwZXIuX19wYXJzZU51bWJlcih2YWx1ZSwgZ2xvYmFsaXplLkN1bHR1cmVzLl9DdWx0dXJlSW5mby5fY3VycmVudEN1bHR1cmUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5wYXJzZUludmFyaWFudCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfTnVtYmVySGVscGVyLl9fcGFyc2VOdW1iZXIodmFsdWUsIGdsb2JhbGl6ZS5DdWx0dXJlcy5fQ3VsdHVyZUluZm8uaW52YXJpYW50Q3VsdHVyZSgpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIuX19nZXRTdGFuZGFyZFRva2VuUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvXihDfGN8RHxkfEV8ZXxGfGZ8R3xnfE58bnxQfHB8UnxyfFh8eCkoXFxkKikkL2c7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAgICAgICAgZnVuY3Rpb24gX19fZ2V0Q3VzdG9tVG9rZW5SZWdFeHAoKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHJldHVybiAvKDB8I3xcXC58LHwlfFxcdTIwMzB8XFxcXHwoKEUoXFwrfC0pP3xlKFxcK3wtKT8pXFxkKyl8O3xcInwnKS9nO1xuICAgICAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIuX19fZ2V0RGlnaXRMZW5ndGggPSBmdW5jdGlvbiAodmFsdWUsIHNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgIHZhciBpcCA9IE1hdGhfZmxvb3IoTWF0aF9hYnModmFsdWUpKTtcblxuICAgICAgICAgICAgICAgIHZhciBkaWdpdCA9IHsgaW50ZWdlcjogMSwgZGVjaW1hbDogMCB9O1xuICAgICAgICAgICAgICAgIHdoaWxlIChpcCA+PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICBpcCA9IGlwIC8gMTA7XG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0LmludGVnZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVTdHIgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIHZhciBleHBvbmVudEluZGV4ID0gdmFsdWVTdHIuc2VhcmNoKC9lL2lnKTtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRJbmRleCA9IHZhbHVlU3RyLmluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChleHBvbmVudEluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtUGFydCA9IHZhbHVlU3RyLnN1YnN0cigwLCBleHBvbmVudEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cFBhcnQgPSB2YWx1ZVN0ci5zdWJzdHIoZXhwb25lbnRJbmRleCArIDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbFBhcnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlY2ltYWxQYXJ0TGVuZ3RoID0gbnVtUGFydC5zdWJzdHIocG9pbnRJbmRleCArIDEpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwVmFsdWUgPSBwYXJzZUZsb2F0KGV4cFBhcnQpO1xuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBkZWNpbWFsUGFydExlbmd0aCAtIGV4cFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkaWdpdC5kZWNpbWFsID0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludEluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWVTdHIuc3Vic3RyKHBvaW50SW5kZXggKyAxKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGlnaXQuZGVjaW1hbCA9IGxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpZ2l0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19wYXJzZUV4cG9uZW50Rm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHZhciBleHBvbmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sOiBmb3JtYXQuY2hhckF0KDApLFxuICAgICAgICAgICAgICAgICAgICBzaWduOiAwLFxuICAgICAgICAgICAgICAgICAgICBleHA6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBzcyA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMTsgc2kgPCBmb3JtYXQubGVuZ3RoOyBzaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNzID0gZm9ybWF0LmNoYXJBdChzaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcyA9PT0gJysnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvbmVudC5zaWduID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzcyA9PT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvbmVudC5zaWduID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3MgPT09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb25lbnQuZXhwID0gZm9ybWF0Lmxlbmd0aCAtIHNpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByZWFkLlNSLkV4cF9JbnZhbGlkRXhwb25lbnRGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBleHBvbmVudDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIuX19fcGFyc2VDdXN0b21OdW1iZXJGb3JtYXR0ZXIgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnROb3JtYWwgPSBrZXl3b3JkX251bGwsIHBhcnROZWdhdGl2ZSA9IGtleXdvcmRfbnVsbCwgcGFydFplcm8gPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnRDdXJyID0gbmV3IHBhcnNlZEZvcm1hdFBhcnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RyQnVmID0gJycsIGluc3FTdHIgPSBmYWxzZSwgaW5kcVN0ciA9IGZhbHNlLCBpbkVTQyA9IGZhbHNlLCBpblNjaSA9IGZhbHNlLCBkZWNQb2ludEZvdW5kID0gZmFsc2UsIGdyb3VwU2VwRm91bmQgPSBmYWxzZSwgc2NpRm91bmQgPSBmYWxzZSwgaW50UGxhY2VIb2xkRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgY3VyQ2hhciA9IGtleXdvcmRfbnVsbCwgcHJldkNoYXIgPSBrZXl3b3JkX251bGwsIGN1clBhcnQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvcm1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGFyID0gZm9ybWF0LmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3FTdHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGFyICE9PSAnXFwnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1ZiArPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQYXJ0LnB1c2goc3RyQnVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNxU3RyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hhciA9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRxU3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hhciAhPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1ZiArPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQYXJ0LnB1c2goc3RyQnVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRxU3RyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hhciA9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbkVTQykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1ZiArIGN1ckNoYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q2hhciA9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpblNjaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDaGFyID09PSAnRScgfHwgcHJldkNoYXIgPT09ICdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGFyID09PSAnKycgfHwgY3VyQ2hhciA9PT0gJy0nIHx8IGN1ckNoYXIgPT09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgKz0gY3VyQ2hhcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5TY2kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZDaGFyID09PSAnKycgfHwgcHJldkNoYXIgPT09ICctJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGFyID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmICs9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluU2NpID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZDaGFyID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyQ2hhciA9PT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1ZiArPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblNjaSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNjaUZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2lGb3VuZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhcnNlIHN0ckJ1ZiB0byBnZXQgY3VycmVudCBleHAgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0Q3Vyci5leHBvbmVudCA9IF9OdW1iZXJIZWxwZXIuX19fcGFyc2VFeHBvbmVudEZvcm1hdChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGN1ckNoYXIgPT09ICcwJyB8fCBjdXJDaGFyID09PSAnIycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRQbGFjZUhvbGRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNoYXIgPT09ICcwJyB8fCBwcmV2Q2hhciA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmICs9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNoYXIgPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJCdWYgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1Zik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKHByZXZDaGFyID09PSAnMCcgfHwgcHJldkNoYXIgPT09ICcjJykgJiYgY3VyQ2hhciAhPT0gJzAnICYmIGN1ckNoYXIgIT09ICcjJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1Zik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGFyID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJCdWYgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluU2NpICYmICFzY2lGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSBzdHJCdWYgdG8gZ2V0IGN1cnJlbnQgZXhwIGZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0Q3Vyci5leHBvbmVudCA9IF9OdW1iZXJIZWxwZXIuX19fcGFyc2VFeHBvbmVudEZvcm1hdChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ckJ1ZiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWNQb2ludEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydEN1cnIuaW50UGFydCA9IGN1clBhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmRlY1BhcnQgPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnROb3JtYWwgPT09IGtleXdvcmRfdW5kZWZpbmVkIHx8IHBhcnROb3JtYWwgPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnROb3JtYWwgPSBwYXJ0Q3VycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydE5lZ2F0aXZlID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBwYXJ0TmVnYXRpdmUgPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnROZWdhdGl2ZSA9IHBhcnRDdXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0WmVybyA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgcGFydFplcm8gPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRaZXJvID0gcGFydEN1cnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJlYWQuU1IuRXhwX0ludmFsaWRTZW1pY29sb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlY1BvaW50Rm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludFBsYWNlSG9sZEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBTZXBGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmdyb3VwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cFNlcEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0Q3VyciA9IG5ldyBwYXJzZWRGb3JtYXRQYXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWRlY1BvaW50Rm91bmQgJiYgY3VyQ2hhciA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNoYXIgIT09ICcjJyAmJiBwcmV2Q2hhciAhPT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGNoYXJhY3RlciBiZWZvcmUgZG90IGlzIG5vdCBudW1iZXIsIGF1dG8gYWRkICcjJyBiZWZvcmUgZG90LCBmb3IgZGlzcGxheSBudW1iZXIgYmVmb3JlIGRvdCB3aGljaCB1c2VyIGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1Zik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmID0gJyMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ckJ1ZiAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQYXJ0LnB1c2goc3RyQnVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmludFBhcnQgPSBjdXJQYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVjUG9pbnRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRQbGFjZUhvbGRGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwU2VwRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0Q3Vyci5ncm91cCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTZXBGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckNoYXIgPT09ICdcXCcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNxU3RyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJDaGFyID09PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRxU3RyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJDaGFyID09PSAnJScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLnBlcmNlbnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChjdXJDaGFyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJDaGFyID09PSBnbG9iYWxpemUuQ3VsdHVyZXMuQ1IucGVyTWlsbGVTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLnBlcm1pbGUrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChjdXJDaGFyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJDaGFyID09PSAnMCcgfHwgY3VyQ2hhciA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgKz0gY3VyQ2hhcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJDaGFyID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGVjUG9pbnRGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJCdWYgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clBhcnQucHVzaChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnRQbGFjZUhvbGRGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzU2NhbGUgPSB0cnVlLCBzdHJRdW90ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IGZvcm1hdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dENoYXIgPSBmb3JtYXQuY2hhckF0KGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyUXVvdGUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dENoYXIgPT09ICdcXCcnIHx8IG5leHRDaGFyID09PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyUXVvdGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Q2hhciA9PT0gJ1xcJycgfHwgbmV4dENoYXIgPT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0clF1b3RlID0gbmV4dENoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV4dENoYXIgPT09ICcwJyB8fCBuZXh0Q2hhciA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NjYWxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXh0Q2hhciA9PT0gJy4nIHx8IG5leHRDaGFyID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1NjYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLnNjYWxlKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTZXBGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyQnVmICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQYXJ0LnB1c2goc3RyQnVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckNoYXIgPT09ICdFJyB8fCBjdXJDaGFyID09PSAnZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluU2NpID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJCdWYgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1Zik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJCdWYgPSBjdXJDaGFyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyQnVmICs9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcmV2Q2hhciA9IGN1ckNoYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdHJCdWYgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpblNjaSAmJiAhc2NpRm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhcnNlIHN0ckJ1ZiB0byBnZXQgY3VycmVudCBleHAgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0Q3Vyci5leHBvbmVudCA9IF9OdW1iZXJIZWxwZXIuX19fcGFyc2VFeHBvbmVudEZvcm1hdChzdHJCdWYpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyUGFydC5wdXNoKHN0ckJ1Zik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChncm91cFNlcEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmdyb3VwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkZWNQb2ludEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmludFBhcnQgPSBjdXJQYXJ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRDdXJyLmRlY1BhcnQgPSBjdXJQYXJ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFydE5vcm1hbCA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgcGFydE5vcm1hbCA9PT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnROb3JtYWwgPSBwYXJ0Q3VycjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnROZWdhdGl2ZSA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgcGFydE5lZ2F0aXZlID09PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydE5lZ2F0aXZlID0gcGFydEN1cnI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0WmVybyA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgcGFydFplcm8gPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0WmVybyA9IHBhcnRDdXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcnNlZEZvcm1hdChwYXJ0Tm9ybWFsLCBwYXJ0TmVnYXRpdmUsIHBhcnRaZXJvKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIuX19femVyb1BhZCA9IGZ1bmN0aW9uIChzdHIsIGNvdW50LCBsZWZ0KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IHN0ci5sZW5ndGg7IGwgPCBjb3VudDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IChsZWZ0ID8gKCcwJyArIHN0cikgOiAoc3RyICsgJzAnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLl9faW5zZXJ0R3JvdXBTZXBhcmF0b3IgPSBmdW5jdGlvbiAobnVtYmVyU3RyaW5nLCBncm91cFNpemVzLCBzZXAsIG5lZ2F0aXZlU2lnbikge1xuICAgICAgICAgICAgICAgIC8vaWYgKGdyb3VwU2l6ZXMubGVuZ3RoIDw9IDAgJiYgY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKFwiZ3JvdXBTaXplcyBtdXN0IGJlIGFuIGFycmF5IG9mIGF0IGxlYXN0IDFcIik7XG4gICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgdmFyIGN1clNpemUgPSBncm91cFNpemVzWzBdO1xuICAgICAgICAgICAgICAgIHZhciBjdXJHcm91cEluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nSW5kZXggPSBudW1iZXJTdHJpbmcubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nQnVpbGRlciA9IG5ldyBfU3RyaW5nQnVpbGRlcihcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtYmVyQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBuZWVkU2VwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN0cmluZ0luZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clNpemUgPCAxIHx8IGN1clNpemUgPiA5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByZWFkLlNSLkV4cF9JbnZhbGlkTnVtYmVyR3JvdXBTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICgvXFxkL2lnLnRlc3QobnVtYmVyU3RyaW5nW3N0cmluZ0luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZWVkU2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nQnVpbGRlci5pbnNlcnQoc2VwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWVkU2VwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ0J1aWxkZXIuaW5zZXJ0KG51bWJlclN0cmluZ1tzdHJpbmdJbmRleF0sIDApO1xuICAgICAgICAgICAgICAgICAgICBpZiAobnVtYmVyQ291bnQgPT09IGN1clNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRTZXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyQ291bnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyR3JvdXBJbmRleCA8IGdyb3VwU2l6ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyU2l6ZSA9IGdyb3VwU2l6ZXNbY3VyR3JvdXBJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyR3JvdXBJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ0luZGV4LS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdCdWlsZGVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLl9fX2V4cGFuZE51bWJlciA9IGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbiwgZ3JvdXBTaXplcywgc2VwLCBkZWNpbWFsQ2hhciwgbmVnYXRpdmVTaWduLCBub0dyb3VwU2VwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZhY3RvciA9IE1hdGhfcG93KDEwLCBwcmVjaXNpb24pO1xuICAgICAgICAgICAgICAgIHZhciByb3VuZGVkID0gKE1hdGhfcm91bmQobnVtICogZmFjdG9yKSAvIGZhY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShyb3VuZGVkKSkge1xuICAgICAgICAgICAgICAgICAgICByb3VuZGVkID0gbnVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBudW0gPSByb3VuZGVkO1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bWJlclN0cmluZyA9IG51bS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIHZhciByaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgZXhwb25lbnQ7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSBudW1iZXJTdHJpbmcuc3BsaXQoL2UvaSk7XG4gICAgICAgICAgICAgICAgbnVtYmVyU3RyaW5nID0gc3BsaXRbMF07XG4gICAgICAgICAgICAgICAgZXhwb25lbnQgPSAoc3BsaXQubGVuZ3RoID4gMSA/IHBhcnNlSW50KHNwbGl0WzFdLCAxMCkgOiAwKTtcbiAgICAgICAgICAgICAgICBzcGxpdCA9IG51bWJlclN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgIG51bWJlclN0cmluZyA9IHNwbGl0WzBdO1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gc3BsaXQubGVuZ3RoID4gMSA/IHNwbGl0WzFdIDogXCJcIjtcblxuICAgICAgICAgICAgICAgIGlmIChleHBvbmVudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSBfTnVtYmVySGVscGVyLl9fX3plcm9QYWQocmlnaHQsIGV4cG9uZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlclN0cmluZyArPSByaWdodC5zbGljZSgwLCBleHBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcmlnaHQuc3Vic3RyKGV4cG9uZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4cG9uZW50IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBleHBvbmVudCA9IC1leHBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlclN0cmluZyA9IG5lZ2F0aXZlU2lnbiArIF9OdW1iZXJIZWxwZXIuX19femVyb1BhZChudW1iZXJTdHJpbmcucmVwbGFjZShuZWdhdGl2ZVNpZ24sIFwiXCIpLCBleHBvbmVudCArIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyU3RyaW5nID0gX051bWJlckhlbHBlci5fX196ZXJvUGFkKG51bWJlclN0cmluZywgZXhwb25lbnQgKyAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IG51bWJlclN0cmluZy5zbGljZSgtZXhwb25lbnQsIG51bWJlclN0cmluZy5sZW5ndGgpICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlclN0cmluZyA9IG51bWJlclN0cmluZy5zbGljZSgwLCAtZXhwb25lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHQubGVuZ3RoID4gcHJlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnNsaWNlKDAsIHByZWNpc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA9IF9OdW1iZXJIZWxwZXIuX19femVyb1BhZChyaWdodCwgcHJlY2lzaW9uLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSBkZWNpbWFsQ2hhciArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobm9Hcm91cFNlcCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyU3RyaW5nICsgcmlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9OdW1iZXJIZWxwZXIuX19pbnNlcnRHcm91cFNlcGFyYXRvcihudW1iZXJTdHJpbmcsIGdyb3VwU2l6ZXMsIHNlcCwgbmVnYXRpdmVTaWduKSArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9OdW1iZXJIZWxwZXIuX19fZm9ybWF0TnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXR0ZXIsIG5mKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdEJ1aWxkZXIgPSBuZXcgX1N0cmluZ0J1aWxkZXIoJycpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKiAoTWF0aF9wb3coMTAwLCBmb3JtYXR0ZXIucGVyY2VudCkpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKiAoTWF0aF9wb3coMTAwMCwgZm9ybWF0dGVyLnBlcm1pbGUpKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gKE1hdGhfcG93KDEwLCBmb3JtYXR0ZXIuc2NhbGUgKiAzKSk7XG4gICAgICAgICAgICAgICAgdmFyIGludFBhcnQgPSBmb3JtYXR0ZXIuaW50UGFydCwgZGVjUGFydCA9IGZvcm1hdHRlci5kZWNQYXJ0O1xuICAgICAgICAgICAgICAgIGlmICghaW50UGFydCAmJiAhZGVjUGFydCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBwYXJ0SW50Rm9ybWF0dGVyID0ga2V5d29yZF9udWxsLCBwYXJ0RGVjRm9ybWF0dGVyID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgIHZhciBpLCBpcCwgZCwgZHAsIGV4cDtcbiAgICAgICAgICAgICAgICBpZiAoaW50UGFydCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0SW50Rm9ybWF0dGVyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnRQYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpcCA9IGludFBhcnRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL14oMHwjKSsvZy50ZXN0KGlwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRJbnRGb3JtYXR0ZXIgKz0gaXA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRlY1BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydERlY0Zvcm1hdHRlciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGQgPSAwOyBkIDwgZGVjUGFydC5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHAgPSBkZWNQYXJ0W2RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eKDB8IykrL2cudGVzdChkcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0RGVjRm9ybWF0dGVyICs9IGRwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghcGFydEludEZvcm1hdHRlciAmJiAhcGFydERlY0Zvcm1hdHRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGludFBhcnQgPyBpbnRQYXJ0LmpvaW4oJycpIDogJycpICsgKGRlY1BhcnQgPyBkZWNQYXJ0LmpvaW4oJycpIDogJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFydERlY0Zvcm1hdHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydERlY0Zvcm1hdHRlciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGV4cG9uZW50VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBkbCA9IF9OdW1iZXJIZWxwZXIuX19fZ2V0RGlnaXRMZW5ndGgodmFsdWUsICcuJyk7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlci5leHBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYVZhbHVlID0gTWF0aF9hYnModmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW50TGVuID0gKCFwYXJ0SW50Rm9ybWF0dGVyKSA/IDEgOiBwYXJ0SW50Rm9ybWF0dGVyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFWYWx1ZSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGwuaW50ZWdlciA+IGludExlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRsLmludGVnZXIgLT0gaW50TGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRsLmRlY2ltYWwgKz0gaW50TGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoX3BvdygxMCwgZGwuaW50ZWdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb25lbnRWYWx1ZSA9IGRsLmludGVnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRsLmludGVnZXIgPCBpbnRMZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvbmVudFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb25lbnRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyLmV4cG9uZW50LnNpZ24gPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyLmV4cG9uZW50LnNpZ24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFWYWx1ZSA8IDEgJiYgYVZhbHVlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyLmV4cG9uZW50LnNpZ24gPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRsLmludGVnZXIgPSBpbnRMZW47XG4gICAgICAgICAgICAgICAgICAgICAgICBkbC5kZWNpbWFsIC09IGludExlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYXNlVmFsID0gTWF0aF9wb3coMTAsIGludExlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYVZhbHVlICogMTAgPCBiYXNlVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVZhbHVlICo9IDEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9uZW50VmFsdWUrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICo9IE1hdGhfcG93KDEwLCBleHBvbmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB6ZXJvcGhJbmRleCA9IHBhcnREZWNGb3JtYXR0ZXIubGFzdEluZGV4T2YoJzAnKTtcbiAgICAgICAgICAgICAgICB2YXIgZGlnaXRwaEluZGV4ID0gcGFydERlY0Zvcm1hdHRlci5sYXN0SW5kZXhPZignIycpO1xuICAgICAgICAgICAgICAgIHZhciBwcmVjaXNpb24gPSBkbC5kZWNpbWFsO1xuICAgICAgICAgICAgICAgIGlmICh6ZXJvcGhJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhdmUgJzAnIHBsYWNlaG9sZGVyLCBhbGwgZGlnaXQgYmVmb3JlIHRoaXMgJzAnIHNob3VsZCBiZSB2YWxpZFxuICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb24gPSB6ZXJvcGhJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkaWdpdHBoSW5kZXggPiB6ZXJvcGhJbmRleCAmJiBkaWdpdHBoSW5kZXggPCBkbC5kZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IGRpZ2l0cGhJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFkZWNQYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbiA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBudW1iZXJzID0gX051bWJlckhlbHBlci5fX19leHBhbmROdW1iZXIodmFsdWUsIHByZWNpc2lvbiwgbmYubnVtYmVyR3JvdXBTaXplcywgJywnLCAnLicsIG5mLm5lZ2F0aXZlU2lnbiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobnVtYmVycyA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpbnRQYXJ0ID8gaW50UGFydC5qb2luKCcnKSA6ICcnKSArIChkZWNQYXJ0ID8gZGVjUGFydC5qb2luKCcnKSA6ICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVwbGFjZUV4cG9uZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGludFBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG51bWJlckludFBhcnQgPSBudW1iZXJzLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZWcgPSBudW1iZXJJbnRQYXJ0LnN1YnN0cigwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZyA9PT0gbmYubmVnYXRpdmVTaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJJbnRQYXJ0ID0gbnVtYmVySW50UGFydC5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2NEaWdpdExlbiA9IDAsIHByb2NJbnRQYXJ0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdFplcm9waEluZGV4ID0gcGFydEludEZvcm1hdHRlci5pbmRleE9mKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnREaWdMZW4gPSAoZmlyc3RaZXJvcGhJbmRleCA9PT0gLTEpID8gbnVtYmVySW50UGFydC5sZW5ndGggOiAocGFydEludEZvcm1hdHRlci5sZW5ndGggLSBmaXJzdFplcm9waEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gaW50UGFydC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXAgPSBpbnRQYXJ0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eKDB8IykrL2cudGVzdChpcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jSW50UGFydCA9IGlwICsgcHJvY0ludFBhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2NJbnRQYXJ0ICE9PSBwYXJ0SW50Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpcGxlbiA9IGlwLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXBpID0gbnVtYmVySW50UGFydC5sZW5ndGggLSBwcm9jRGlnaXRMZW4gLSAxOyBpcGkgPj0gMCAmJiBpcGxlbiA+IDA7IGlwaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmMgPSBudW1iZXJJbnRQYXJ0LmNoYXJBdChpcGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5faW5zZXJ0KG5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlwbGVuLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jRGlnaXRMZW4rKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvY0RpZ2l0TGVuID49IG51bWJlckludFBhcnQubGVuZ3RoICYmIHByb2NEaWdpdExlbiA8IGludERpZ0xlbiAmJiBpcGxlbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuX2luc2VydChuZXcgQXJyYXkoaXBsZW4gKyAxKS5qb2luKCcwJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY0RpZ2l0TGVuICs9IGlwbGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnQgPSBudW1iZXJJbnRQYXJ0LnN1YnN0cigwLCBudW1iZXJJbnRQYXJ0Lmxlbmd0aCAtIHByb2NEaWdpdExlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdFplcm9waEluZGV4ID49IDAgJiYgZmlyc3RaZXJvcGhJbmRleCA8IHBhcnRJbnRGb3JtYXR0ZXIubGVuZ3RoIC0gcHJvY0RpZ2l0TGVuIC0gcGFydC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQgPSBuZXcgQXJyYXkocGFydEludEZvcm1hdHRlci5sZW5ndGggLSBwcm9jRGlnaXRMZW4gLSBmaXJzdFplcm9waEluZGV4IC0gcGFydC5sZW5ndGggKyAxKS5qb2luKCcwJykgKyBwYXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuX2luc2VydChwYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlci5leHBvbmVudCAmJiAhcmVwbGFjZUV4cG9uZW50ICYmIC9eKChFKFxcK3wtKT98ZShcXCt8LSk/KVxcZCspL2cudGVzdChpcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlRXhwb25lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cCArPSBmb3JtYXR0ZXIuZXhwb25lbnQuc3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cCArPSBfTnVtYmVySGVscGVyLl9fX3NpZ25zW2Zvcm1hdHRlci5leHBvbmVudC5zaWduXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgKz0gX051bWJlckhlbHBlci5fX196ZXJvUGFkKGV4cG9uZW50VmFsdWUudG9TdHJpbmcoKSwgZm9ybWF0dGVyLmV4cG9uZW50LmV4cCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5faW5zZXJ0KGV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuX2luc2VydChpcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZyA9PT0gbmYubmVnYXRpdmVTaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRCdWlsZGVyLl9pbnNlcnQobmVnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVyLmdyb3VwID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gX051bWJlckhlbHBlci5fX2luc2VydEdyb3VwU2VwYXJhdG9yKHJlc3VsdEJ1aWxkZXIudG9TdHJpbmcoKSwgbmYubnVtYmVyR3JvdXBTaXplcywgJywnLCBuZi5uZWdhdGl2ZVNpZ24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlciA9IG5ldyBfU3RyaW5nQnVpbGRlcihzdHIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkZWNQYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXJEZWNQYXJ0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVjaXNpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVjU2VwSW5kZXggPSBudW1iZXJzLmluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWNTZXBJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJEZWNQYXJ0ID0gbnVtYmVycy5zdWJzdHJpbmcoZGVjU2VwSW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFydEludEZvcm1hdHRlciA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5hcHBlbmQobnVtYmVycy5zdWJzdHIoMCwgZGVjU2VwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5hcHBlbmQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghL14oIyspJC9pZy50ZXN0KHBhcnREZWNGb3JtYXR0ZXIpIHx8IGRlY1BhcnQuam9pbignJykubGVuZ3RoICE9PSBwYXJ0RGVjRm9ybWF0dGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5hcHBlbmQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh6ZXJvcGhJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJEZWNQYXJ0ID0gbmV3IEFycmF5KHplcm9waEluZGV4ICsgMSkuam9pbignMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZGVjaW1hbCBwYXJ0LlxuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtRGVjSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGQgPSAwOyBkIDwgZGVjUGFydC5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHAgPSBkZWNQYXJ0W2RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eKDB8IykrL2cudGVzdChkcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRCdWlsZGVyLmFwcGVuZChudW1iZXJEZWNQYXJ0LnN1YnN0cihudW1EZWNJbmRleCwgZHAubGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtRGVjSW5kZXggKz0gZHAubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXIuZXhwb25lbnQgJiYgIXJlcGxhY2VFeHBvbmVudCAmJiAvXigoRShcXCt8LSk/fGUoXFwrfC0pPylcXGQrKS9nLnRlc3QoZHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZUV4cG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgKz0gZm9ybWF0dGVyLmV4cG9uZW50LnN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgKz0gX051bWJlckhlbHBlci5fX19zaWduc1tmb3JtYXR0ZXIuZXhwb25lbnQuc2lnbl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwICs9IF9OdW1iZXJIZWxwZXIuX19femVyb1BhZChleHBvbmVudFZhbHVlLnRvU3RyaW5nKCksIGZvcm1hdHRlci5leHBvbmVudC5leHAsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuYXBwZW5kKGV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuYXBwZW5kKGRwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0U3RyaW5nID0gcmVzdWx0QnVpbGRlci50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgLy9wcm9jZXNzIGF1dG8gYWRkICcjJyBmb3IgYWxvbmUgJy4nLCBpZiBleGlzdCBzdWJzdHJpbmcgJzAuJyBhbmQgbm90IGEgZmxvYXQgbnVtYmVyLHRoZW4gcmVtb3ZlICcwJ1xuICAgICAgICAgICAgICAgIHZhciB6ZXJvRG90SW5kZXggPSByZXN1bHRTdHJpbmcuaW5kZXhPZihcIjAuXCIpO1xuICAgICAgICAgICAgICAgIGlmICh6ZXJvRG90SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoemVyb0RvdEluZGV4ICsgMiA9PSByZXN1bHRTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBlbmR3aXRoICcwLicsIHJlbW92ZSBpdCwgcmVzdWx0IGlzICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U3RyaW5nID0gcmVzdWx0U3RyaW5nLnJlcGxhY2UoXCIwLlwiLCBcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoemVyb0RvdEluZGV4ICsgMiA8IHJlc3VsdFN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGlzICcwLmFiYycgb3Igc3RoLCByZW1vdmUgJzAnLCByZXN1bHQgaXMgJy5hYmMnXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS9bMC05XSsvZy50ZXN0KHJlc3VsdFN0cmluZy5jaGFyQXQoemVyb0RvdEluZGV4ICsgMikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U3RyaW5nID0gcmVzdWx0U3RyaW5nLnJlcGxhY2UoXCIwLlwiLCBcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0U3RyaW5nO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX3BhcnNlTnVtYmVyTmVnYXRpdmVQYXR0ZXJuID0gZnVuY3Rpb24gKHZhbHVlLCBudW1Gb3JtYXQsIG51bWJlck5lZ2F0aXZlUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHZhciBuZWcgPSBudW1Gb3JtYXQubmVnYXRpdmVTaWduO1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBudW1Gb3JtYXQucG9zaXRpdmVTaWduO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZVN0ciA9IG5ldyBfU3RyaW5nSGVscGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyTmVnYXRpdmVQYXR0ZXJuID09PSA0IHx8IG51bWJlck5lZ2F0aXZlUGF0dGVybiA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBuZWcgPSAnICcgKyBuZWc7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9ICcgJyArIHBvcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlck5lZ2F0aXZlUGF0dGVybiA9PT0gNCB8fCBudW1iZXJOZWdhdGl2ZVBhdHRlcm4gPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlU3RyLmVuZHNXaXRoKG5lZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJy0nLCB2YWx1ZS5zdWJzdHIoMCwgdmFsdWUubGVuZ3RoIC0gbmVnLmxlbmd0aCldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlU3RyLmVuZHNXaXRoKHBvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJysnLCB2YWx1ZS5zdWJzdHIoMCwgdmFsdWUubGVuZ3RoIC0gcG9zLmxlbmd0aCldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChudW1iZXJOZWdhdGl2ZVBhdHRlcm4gPT09IDIgfHwgbnVtYmVyTmVnYXRpdmVQYXR0ZXJuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVN0ci5zdGFydHNXaXRoKG5lZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJy0nLCB2YWx1ZS5zdWJzdHIobmVnLmxlbmd0aCldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlU3RyLnN0YXJ0c1dpdGgocG9zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnKycsIHZhbHVlLnN1YnN0cihwb3MubGVuZ3RoKV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlck5lZ2F0aXZlUGF0dGVybiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVTdHIuc3RhcnRzV2l0aCgnKCcpICYmIHZhbHVlU3RyLmVuZHNXaXRoKCcpJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJy0nLCB2YWx1ZS5zdWJzdHIoMSwgdmFsdWUubGVuZ3RoIC0gMildO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWycnLCB2YWx1ZV07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLl9fcGFyc2VOdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUsIGN1bHR1cmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgIT09IGtleXdvcmRfdW5kZWZpbmVkICYmIHZhbHVlICE9PSBrZXl3b3JkX251bGwpID8gbmV3IF9TdHJpbmdIZWxwZXIodmFsdWUpLnRyaW0oKSA6IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goL15bKy1dP2luZmluaXR5JC9pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5tYXRjaCgvXjB4W2EtZjAtOV0rJC9pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG51bUZvcm1hdCA9IGN1bHR1cmVJbmZvLm51bWJlckZvcm1hdDtcbiAgICAgICAgICAgICAgICB2YXIgc2lnbkluZm8gPSBfTnVtYmVySGVscGVyLl9fcGFyc2VOdW1iZXJOZWdhdGl2ZVBhdHRlcm4odmFsdWUsIG51bUZvcm1hdCwgbnVtRm9ybWF0Lm51bWJlck5lZ2F0aXZlUGF0dGVybik7XG4gICAgICAgICAgICAgICAgdmFyIHNpZ24gPSBzaWduSW5mb1swXTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtID0gc2lnbkluZm9bMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoKHNpZ24gPT09ICcnKSAmJiAobnVtRm9ybWF0Lm51bWJlck5lZ2F0aXZlUGF0dGVybiAhPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2lnbkluZm8gPSBfTnVtYmVySGVscGVyLl9fcGFyc2VOdW1iZXJOZWdhdGl2ZVBhdHRlcm4odmFsdWUsIG51bUZvcm1hdCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHNpZ24gPSBzaWduSW5mb1swXTtcbiAgICAgICAgICAgICAgICAgICAgbnVtID0gc2lnbkluZm9bMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzaWduID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBzaWduID0gJysnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vdHJpbSBjdXJyZW5jeVN5bWJvbFxuICAgICAgICAgICAgICAgIGlmIChudW1bMF0gPT09IG51bUZvcm1hdC5jdXJyZW5jeVN5bWJvbCkge1xuICAgICAgICAgICAgICAgICAgICBudW0gPSBudW0uc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBleHBvbmVudDtcbiAgICAgICAgICAgICAgICB2YXIgaW50QW5kRnJhY3Rpb247XG4gICAgICAgICAgICAgICAgdmFyIGV4cG9uZW50UG9zID0gbnVtLmluZGV4T2YoJ2UnKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwb25lbnRQb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9uZW50UG9zID0gbnVtLmluZGV4T2YoJ0UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV4cG9uZW50UG9zIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRBbmRGcmFjdGlvbiA9IG51bTtcbiAgICAgICAgICAgICAgICAgICAgZXhwb25lbnQgPSBrZXl3b3JkX251bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW50QW5kRnJhY3Rpb24gPSBudW0uc3Vic3RyKDAsIGV4cG9uZW50UG9zKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwb25lbnQgPSBudW0uc3Vic3RyKGV4cG9uZW50UG9zICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGludGVnZXIsIGZyYWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBkZWNpbWFsUG9zID0gaW50QW5kRnJhY3Rpb24uaW5kZXhPZignLicpO1xuICAgICAgICAgICAgICAgIGlmIChkZWNpbWFsUG9zIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlZ2VyID0gaW50QW5kRnJhY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIGZyYWN0aW9uID0ga2V5d29yZF9udWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVnZXIgPSBpbnRBbmRGcmFjdGlvbi5zdWJzdHIoMCwgZGVjaW1hbFBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGZyYWN0aW9uID0gaW50QW5kRnJhY3Rpb24uc3Vic3RyKGRlY2ltYWxQb3MgKyAnLicubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnRlZ2VyID0gaW50ZWdlci5zcGxpdCgnLCcpLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgIHZhciBhbHROdW1Hcm91cFNlcGFyYXRvciA9ICcsJy5yZXBsYWNlKC9cXHUwMEEwL2csIFwiIFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoJywnICE9PSBhbHROdW1Hcm91cFNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICBpbnRlZ2VyID0gaW50ZWdlci5zcGxpdChhbHROdW1Hcm91cFNlcGFyYXRvcikuam9pbignJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBzaWduICsgaW50ZWdlcjtcbiAgICAgICAgICAgICAgICBpZiAoZnJhY3Rpb24gIT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwICs9ICcuJyArIGZyYWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vdHJpbSBwZXJjZW50U3ltYm9sLHRoZW4gY29ycmVjdFxuICAgICAgICAgICAgICAgIHZhciBsYXN0Q2hhciA9IHBbcC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdENoYXIgPT09IG51bUZvcm1hdC5wZXJjZW50U3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSBwLnN1YnN0cigwLCBwLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBwID0gbmV3IF9TdHJpbmdIZWxwZXIocCkudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmRwID0gcC5pbmRleE9mKCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZHAgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZHAgPSBwLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0QnVpbGRlciA9IG5ldyBfU3RyaW5nQnVpbGRlcignJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEJ1aWxkZXIuYXBwZW5kKHAuc3Vic3RyKDAsIG5kcCAtIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5hcHBlbmQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0QnVpbGRlci5hcHBlbmQocC5zdWJzdHIobmRwIC0gMiwgMikpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRCdWlsZGVyLmFwcGVuZChwLnN1YnN0cihuZHAgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHAgPSByZXN1bHRCdWlsZGVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGV4cG9uZW50ICE9PSBrZXl3b3JkX251bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cFNpZ25JbmZvID0gX051bWJlckhlbHBlci5fX3BhcnNlTnVtYmVyTmVnYXRpdmVQYXR0ZXJuKGV4cG9uZW50LCBudW1Gb3JtYXQsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwU2lnbkluZm9bMF0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBTaWduSW5mb1swXSA9ICcrJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwICs9ICdlJyArIGV4cFNpZ25JbmZvWzBdICsgZXhwU2lnbkluZm9bMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwLm1hdGNoKC9eWystXT9cXGQqXFwuP1xcZCooZVsrLV0/XFxkKyk/JC8pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX190b0hleFN0cmluZyA9IGZ1bmN0aW9uIChudW0sIGxvd0Nhc2UsIHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChNYXRoX2FicyhNYXRoX2Zsb29yKG51bSkgLSBudW0pICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJlYWQuU1IuRXhwX0JhZEZvcm1hdFNwZWNpZmllcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSBudW0gPj0gMCA/IG51bS50b1N0cmluZygxNikgOiAoX051bWJlckhlbHBlci5fX19tYXhJbnQzMiArIG51bSArIDEpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICBudW1iZXIgPSBsb3dDYXNlID8gbnVtYmVyLnRvTG93ZXJDYXNlKCkgOiBudW1iZXIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAocHJlY2lzaW9uICE9PSBrZXl3b3JkX3VuZGVmaW5lZCAmJiBwcmVjaXNpb24gIT09IGtleXdvcmRfbnVsbCAmJiBudW1iZXIubGVuZ3RoIDwgcHJlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfTnVtYmVySGVscGVyLl9fX3plcm9QYWQobnVtYmVyLCBwcmVjaXNpb24sIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX190b1NjaWVudGlmaWMgPSBmdW5jdGlvbiAobnVtLCBlLCBwcmVjaXNpb24sIGdyb3VwU2l6ZXMsIHNlcCwgZGVjaW1hbENoYXIsIG5lZ2F0aXZlU2lnbikge1xuICAgICAgICAgICAgICAgIHZhciBkaWdpdExlbiA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGRpZ1NlcE1vdmVSaWdodCA9IChudW0gPj0gMSB8fCBudW0gPT09IDApO1xuICAgICAgICAgICAgICAgIHdoaWxlIChkaWdpdExlbiA8IDEwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2UgPSBNYXRoX3BvdygxMCwgZGlnaXRMZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrRm5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZ1NlcE1vdmVSaWdodCAmJiAobnVtIC8gYmFzZSA8IDEwKSB8fCAhZGlnU2VwTW92ZVJpZ2h0ICYmIChudW0gKiBiYXNlID49IDEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRpZ2l0TGVuKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG51bSA9IGRpZ1NlcE1vdmVSaWdodCA/IE1hdGhfYWJzKG51bSkgLyBNYXRoX3BvdygxMCwgZGlnaXRMZW4pIDogTWF0aF9hYnMobnVtKSAqIE1hdGhfcG93KDEwLCBkaWdpdExlbik7XG4gICAgICAgICAgICAgICAgdmFyIG51bWJlciA9IF9OdW1iZXJIZWxwZXIuX19fZXhwYW5kTnVtYmVyKG51bSwgcHJlY2lzaW9uLCBncm91cFNpemVzLCBzZXAsIGRlY2ltYWxDaGFyLCBuZWdhdGl2ZVNpZ24pO1xuICAgICAgICAgICAgICAgIG51bWJlciArPSBlICsgKGRpZ1NlcE1vdmVSaWdodCA/IFwiK1wiIDogXCItXCIpICsgX051bWJlckhlbHBlci5fX196ZXJvUGFkKGRpZ2l0TGVuLnRvU3RyaW5nKCksIDMsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLnJlbW92ZUN1bHR1cmVTeW1ib2xJbk51bSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSBrZXl3b3JkX3VuZGVmaW5lZCB8fCBvYmogPT09IGtleXdvcmRfbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbnVtYmVyU3RyaW5nID0gb2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgbnVtYmVyU3RyaW5nID0gbnVtYmVyU3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cCgnWyxdJywgXCJnXCIpLCBcIlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyU3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cCgnWy5dJywgXCJnXCIpLCBcIi5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLnJlcGxhY2VDdWx0dXJlU3ltYm9sVG9Ob3JtYWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxpemUuQ3VsdHVyZXMuQ1IubnVtYmVyRGVjaW1hbFNlcGFyYXRvciAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShSZWdVdGlsLmdldFJlZygnWycgKyBnbG9iYWxpemUuQ3VsdHVyZXMuQ1IubnVtYmVyRGVjaW1hbFNlcGFyYXRvciArICddJyksICcjZG90IycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsaXplLkN1bHR1cmVzLkNSLm51bWJlckdyb3VwU2VwYXJhdG9yICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKFJlZ1V0aWwuZ2V0UmVnKCdbJyArIGdsb2JhbGl6ZS5DdWx0dXJlcy5DUi5udW1iZXJHcm91cFNlcGFyYXRvciArICddJyksICcjZ3JvdXAjJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxpemUuQ3VsdHVyZXMuQ1IubnVtYmVyRGVjaW1hbFNlcGFyYXRvciAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShSZWdVdGlsLmdldFJlZygnI2RvdCMnKSwgJy4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbGl6ZS5DdWx0dXJlcy5DUi5udW1iZXJHcm91cFNlcGFyYXRvciAhPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShSZWdVdGlsLmdldFJlZygnI2dyb3VwIycpLCAnLCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLnJlcGxhY2VOb3JtYWxUb0N1bHR1cmVTeW1ibGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxpemUuQ3VsdHVyZXMuQ1IubnVtYmVyRGVjaW1hbFNlcGFyYXRvciAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShSZWdVdGlsLmdldFJlZygnWy5dJyksICcjZG90IycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsaXplLkN1bHR1cmVzLkNSLm51bWJlckdyb3VwU2VwYXJhdG9yICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKFJlZ1V0aWwuZ2V0UmVnKCdbLF0nKSwgJyNncm91cCMnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsaXplLkN1bHR1cmVzLkNSLm51bWJlckRlY2ltYWxTZXBhcmF0b3IgIT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoUmVnVXRpbC5nZXRSZWcoJyNkb3QjJyksIGdsb2JhbGl6ZS5DdWx0dXJlcy5DUi5udW1iZXJEZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbGl6ZS5DdWx0dXJlcy5DUi5udW1iZXJHcm91cFNlcGFyYXRvciAhPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShSZWdVdGlsLmdldFJlZygnI2dyb3VwIycpLCBnbG9iYWxpemUuQ3VsdHVyZXMuQ1IubnVtYmVyR3JvdXBTZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19zaWducyA9IHtcbiAgICAgICAgICAgICAgICAnMSc6ICcrJyxcbiAgICAgICAgICAgICAgICAnMCc6ICcnLFxuICAgICAgICAgICAgICAgICctMSc6ICctJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19tYXhJbnQzMiA9IDQyOTQ5NjcyOTU7XG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLl9fX3BlcmNlbnRQb3NpdGl2ZVBhdHRlcm4gPSBbXCJuICVcIiwgXCJuJVwiLCBcIiVuXCIsIFwiJSBuXCJdO1xuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19wZXJjZW50TmVnYXRpdmVQYXR0ZXJuID0gW1wiLW4gJVwiLCBcIi1uJVwiLCBcIi0lblwiLCBcIiUtblwiLCBcIiVuLVwiLCBcIm4tJVwiLCBcIm4lLVwiLCBcIi0lIG5cIiwgXCJuICUtXCIsIFwiJSBuLVwiLCBcIiUgLW5cIiwgXCJuLSAlXCJdO1xuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19udW1iZXJOZWdhdGl2ZVBhdHRlcm4gPSBbXCIobilcIiwgXCItblwiLCBcIi0gblwiLCBcIm4tXCIsIFwibiAtXCJdO1xuICAgICAgICAgICAgX051bWJlckhlbHBlci5fX19jdXJyZW5jeVBvc2l0aXZlUGF0dGVybiA9IFtcIiRuXCIsIFwibiRcIiwgXCIkIG5cIiwgXCJuICRcIl07XG4gICAgICAgICAgICBfTnVtYmVySGVscGVyLl9fX2N1cnJlbmN5TmVnYXRpdmVQYXR0ZXJuID0gW1xuICAgICAgICAgICAgICAgIFwiKCRuKVwiLCBcIi0kblwiLCBcIiQtblwiLCBcIiRuLVwiLCBcIihuJClcIiwgXCItbiRcIiwgXCJuLSRcIiwgXCJuJC1cIiwgXCItbiAkXCIsIFwiLSQgblwiLFxuICAgICAgICAgICAgICAgIFwibiAkLVwiLCBcIiQgbi1cIiwgXCIkIC1uXCIsIFwibi0gJFwiLCBcIigkIG4pXCIsIFwiKG4gJClcIl07XG4gICAgICAgICAgICByZXR1cm4gX051bWJlckhlbHBlcjtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgc3ByZWFkLl9OdW1iZXJIZWxwZXIgPSBfTnVtYmVySGVscGVyO1xuXG4gICAgICAgIHZhciBfV29yZFdyYXBIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gX1dvcmRXcmFwSGVscGVyKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX1dvcmRXcmFwSGVscGVyLl9nZXRDdHggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfV29yZFdyYXBIZWxwZXIuX2N0eCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfV29yZFdyYXBIZWxwZXIuX2N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9Xb3JkV3JhcEhlbHBlci5fY3R4O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1dvcmRXcmFwSGVscGVyLl9nZXRXcmFwSW5mbyA9IGZ1bmN0aW9uICh0ZXh0LCB3aWR0aCwgZm9udCkge1xuICAgICAgICAgICAgICAgIHZhciB3cmFwTGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBMaW5lcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IF9Xb3JkV3JhcEhlbHBlci5fZ2V0Q3R4KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjdHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBMaW5lcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSBmb250O1xuICAgICAgICAgICAgICAgIGlmICh3aWR0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGFyTWluV2lkdGggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGV4dC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wQ2hhciA9IHRleHQuY2hhckF0KGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wQ2hhciAhPT0gXCIgXCIgJiYgIWZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyTWluV2lkdGggPSBNYXRoX21pbihjaGFyTWluV2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0ZW1wQ2hhcikud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZW1wQ2hhciAhPT0gXCIgXCIgJiYgZmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJNaW5XaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZW1wQ2hhcikud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gY2hhck1pbldpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSB0ZXh0LnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBMaW5lID0gX1dvcmRXcmFwSGVscGVyLl9nZXRXcmFwSW5mb0J5V29yZChsaW5lc1tpXSwgd2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAod3JhcExpbmUgIT0ga2V5d29yZF9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdyYXBMaW5lLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JhcExpbmVzLnB1c2god3JhcExpbmVbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwTGluZXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfV29yZFdyYXBIZWxwZXIuX2dldFRleHRXb3JkcyA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBzcGFjZSA9IFwiIFwiO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lc1tzdGFydEluZGV4XSA9PT0ga2V5d29yZF91bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW3N0YXJ0SW5kZXhdID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudENoYXIgPSB0ZXh0LmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRDaGFyID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgKyAxIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRDaGFyID0gdGV4dC5jaGFyQXQoaSArIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgoY3VycmVudENoYXIgPT09IHNwYWNlICYmIG5leHRDaGFyICE9PSBzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW3N0YXJ0SW5kZXhdICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbc3RhcnRJbmRleF0gKz0gY3VycmVudENoYXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1dvcmRXcmFwSGVscGVyLl9tZWFzdXJlVGV4dCA9IGZ1bmN0aW9uICh0ZXh0LCBmb250KSB7XG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IF9Xb3JkV3JhcEhlbHBlci5fZ2V0Q3R4KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjdHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN0eC5mb250ICE9PSBmb250KSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gZm9udDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9Xb3JkV3JhcEhlbHBlci5fbWVhc3VyZVRleHRXaXRob3V0RW5kU3BhY2VzID0gZnVuY3Rpb24gKHRleHQsIGZvbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gX1dvcmRXcmFwSGVscGVyLl9nZXRDdHgoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSBmb250O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdGVtcFRleHQgPSBfV29yZFdyYXBIZWxwZXIuX3JlbW92ZUVuZFNwYWNlKHRleHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHgubWVhc3VyZVRleHQodGVtcFRleHQpLndpZHRoO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX1dvcmRXcmFwSGVscGVyLl9yZW1vdmVFbmRTcGFjZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGV4dC5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0ZXh0LmNoYXJBdChpbmRleCkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHRleHQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfV29yZFdyYXBIZWxwZXIuX2dldFdyYXBJbmZvQnlDaGFyYWN0ZXIgPSBmdW5jdGlvbiAodGV4dCwgd2lkdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gX1dvcmRXcmFwSGVscGVyLl9nZXRDdHgoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b3RhbFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyV2lkdGggPSB0b3RhbFdpZHRoIC8gdGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldExlbmd0aCA9IE1hdGhfY2VpbCh3aWR0aCAvIGNoYXJXaWR0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsV2lkdGggPiB3aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNMb25nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ViVGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRhcmdldExlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ViV2lkdGggPSBjdHgubWVhc3VyZVRleHQoc3ViVGV4dCkud2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJXaWR0aCA9PSB3aWR0aCB8fCBpc0xvbmcgJiYgc3ViV2lkdGggPCB3aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goc3ViVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaCh0ZXh0LnN1YnN0cmluZyhzdWJUZXh0Lmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3ViV2lkdGggPiB3aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJUZXh0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVtYWluVGV4dCA9IHRleHQuc3Vic3RyaW5nKHN1YlRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9Xb3JkV3JhcEhlbHBlci5fbWVhc3VyZVRleHRXaXRob3V0RW5kU3BhY2VzKHJlbWFpblRleHQpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKHN1YlRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChyZW1haW5UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0xvbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcCA9ICh3aWR0aCAtIHN1YldpZHRoKSAvIGNoYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gc3RlcCA+PSAxID8gc3RlcCA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVuZ3RoICs9IHN0ZXA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCAhPSBrZXl3b3JkX251bGwgJiYgdGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9Xb3JkV3JhcEhlbHBlci5fZ2V0V3JhcEluZm9CeVdvcmQgPSBmdW5jdGlvbiAodGV4dCwgd2lkdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgd29yZHMgPSBfV29yZFdyYXBIZWxwZXIuX2dldFRleHRXb3Jkcyh0ZXh0KTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gX1dvcmRXcmFwSGVscGVyLl9nZXRDdHgoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0b3RhbFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyV2lkdGggPSB0b3RhbFdpZHRoIC8gdGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGF2ZXJhZ2VMZW5ndGggPSBwYXJzZUludCgod2lkdGggLyBjaGFyV2lkdGgpICsgXCJcIiwgMTApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpbmVJbmRleCA9IDAsIHN0YWNrQ2hhckNvdW50ID0gMCwgdGVtcENvdW50ID0gMCwgaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBzdGFjayA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpc0xvbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPCB3b3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTG9uZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3b3JkID0gd29yZHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCh3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrQ2hhckNvdW50ICs9IHdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrQ2hhckNvdW50IDwgYXZlcmFnZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBDb3VudCA9IHN0YWNrQ2hhckNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrQ2hhckNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ViV2lkdGggPSBfV29yZFdyYXBIZWxwZXIuX21lYXN1cmVUZXh0V2l0aG91dEVuZFNwYWNlcyhzdGFjay5qb2luKFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YldpZHRoID4gd2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wV29yZCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IF9Xb3JkV3JhcEhlbHBlci5fZ2V0V3JhcEluZm9CeUNoYXJhY3Rlcih0ZW1wV29yZCwgd2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gocGFydHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZHNbaW5kZXhdID0gcGFydHNbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrKzsgLy8gaWYgdGhlIHdvcmQgbWF0Y2hlcyAvW15cXHNdW1xcc10qLywgZ28gdG8gbmV4dCB3b3JkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lSW5kZXgrK10gPSBzdGFjay5qb2luKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9uZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9uZyA9IHRydWU7IC8vIHN0YWNrIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgd29yZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChzdWJXaWR0aCA8IHdpZHRoICYmIGlzTG9uZyA9PT0gdHJ1ZSkgfHwgc3ViV2lkdGggPT09IHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2xpbmVJbmRleCsrXSA9IF9Xb3JkV3JhcEhlbHBlci5fcmVtb3ZlRW5kU3BhY2Uoc3RhY2suam9pbihcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjayA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJXaWR0aCA8IHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tDaGFyQ291bnQgPSB0ZW1wQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lSW5kZXhdID0gX1dvcmRXcmFwSGVscGVyLl9yZW1vdmVFbmRTcGFjZShzdGFjay5qb2luKFwiXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBfV29yZFdyYXBIZWxwZXI7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHNwcmVhZC5fV29yZFdyYXBIZWxwZXIgPSBfV29yZFdyYXBIZWxwZXI7XG5cbiAgICAgICAgLy88ZWRpdG9yLWZvbGQgZGVzYz1cIkZvcm1hdENvbnZlcnRlclwiPlxuICAgICAgICAvKipcbiAgICAgICAgICogUmVwcmVzZW50cyB0aGUgY29udmVydGluZyBvZiBhIHZhbHVlIHRvIGEgc3BlY2lmaWVkIGRhdGEgdHlwZS5cbiAgICAgICAgICogQGNsYXNzXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgRm9ybWF0Q29udmVydGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIEZvcm1hdENvbnZlcnRlcigpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgYSBudW1iZXIsIERhdGVUaW1lLCBvciBUaW1lU3BhbiB2YWx1ZS5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgdmFsdWUgZm9yIHdoaWNoIHRvIGRldGVybWluZSB0aGUgbnVtYmVyIHR5cGUuXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gPGM+dHJ1ZTwvYz4gaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyOyBvdGhlcndpc2UsIDxjPmZhbHNlPC9jPi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgRm9ybWF0Q29udmVydGVyLklzTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwuaXNUeXBlKHZhbHVlLCBcIm51bWJlclwiKSB8fCB1dGlsLmlzVHlwZSh2YWx1ZSwgXCJEYXRlVGltZVwiKSB8fCB1dGlsLmlzVHlwZSh2YWx1ZSwgXCJUaW1lU3BhblwiKSB8fCAodmFsdWUgJiYgIXV0aWwuaXNUeXBlKHZhbHVlLCBcImJvb2xlYW5cIikgJiYgIWlzTmFOKHZhbHVlKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENvbnZlcnRzIHRoZSB2YWx1ZSB0byBhIGRvdWJsZSB0eXBlLlxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIHRoZSBudW1iZXIgdHlwZS5cbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBGb3JtYXRDb252ZXJ0ZXIuVG9Eb3VibGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGtleXdvcmRfbnVsbCB8fCB2YWx1ZSA9PT0ga2V5d29yZF91bmRlZmluZWQgfHwgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDAuMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHV0aWwuaXNUeXBlKHZhbHVlLCBcIm51bWJlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzVHlwZSh2YWx1ZSwgXCJzdHJpbmdcIikgJiYgIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX051bWJlckhlbHBlci5wYXJzZUxvY2FsZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzVHlwZSh2YWx1ZSwgXCJib29sZWFuXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IDEuMCA6IDAuMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHV0aWwuaXNUeXBlKHZhbHVlLCBcIkRhdGVUaW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgX0RhdGVUaW1lSGVscGVyKHZhbHVlKS50b09BRGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodXRpbC5pc1R5cGUodmFsdWUsIFwiVGltZVNwYW5cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBfRGF0ZVRpbWVIZWxwZXIodmFsdWUpLlRvdGFsRGF5cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgdmFsdWUgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gc3RyaW5nIHR5cGUuXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgY29udmVydGVkIHN0cmluZy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgRm9ybWF0Q29udmVydGVyLnRvU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdHJ5ICB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0ga2V5d29yZF9udWxsIHx8IHZhbHVlID09PSBrZXl3b3JkX3VuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID8gXCJUUlVFXCIgOiBcIkZBTFNFXCI7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0Q29udmVydGVyO1xuICAgICAgICB9KSgpO1xuICAgICAgICBzcHJlYWQuRm9ybWF0Q29udmVydGVyID0gRm9ybWF0Q29udmVydGVyO1xuICAgIH0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9udW1iZXJGb3JtYXR0ZXIvZm9ybWF0dGVyVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJmb3JtYXR0ZXIuanMifQ==