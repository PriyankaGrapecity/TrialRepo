(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Calc"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["Calc"] = factory();
})(this, function() {
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

	    var CalcCommon = __webpack_require__(1); // jshint ignore:line
	    //var CalcFunctions = require('./functions'); // jshint ignore:line
	    var CalcContext = __webpack_require__(2);
	    var CalcParser = __webpack_require__(3);
	    var CalcExpressions = __webpack_require__(4);
	    var CalcEvaluator = __webpack_require__(5);
	    var CalcHelper = __webpack_require__(6); // jshint ignore:line
	    var CalcManager = __webpack_require__(7);
	    var CalcModels = __webpack_require__(8); // jshint ignore:line
	    var CalcSource = __webpack_require__(9);
	    var CalcCollections = __webpack_require__(10);
	    var CalcFunctions = __webpack_require__(11);

	    module.exports = {
	        Common: CalcCommon,
	        Helper: CalcHelper,
	        CalcManager: CalcManager,
	        ParserContext: CalcContext.ParserContext,
	        EvaluatorContext: CalcContext.EvaluateContext,
	        Expressions: CalcExpressions,
	        Parser: CalcParser.Parser,
	        Evaluator: CalcEvaluator,
	        CalcSource: CalcSource.CalcSource,
	        Collections: CalcCollections,
	        Functions: CalcFunctions
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

	(function() {
	    /* jshint ignore:start */
	    'use strict';
	    var Calc = {}
	    module.exports = Calc;

	    var CONST_UNDEFINED = 'undefined';
	    var CONST_NUMBER = 'number';
	    var CONST_STRING = 'string';
	    var CONST_BOOLEAN = 'boolean';
	    var CONST_TRUE = 'TRUE';
	    var CONST_FALSE = 'FALSE';
	    var CONST_ARRAY = 'ARRAY'; // jshint ignore:line
	    var CONST_ARRAYROW = 'ARRAYROW'; // jshint ignore:line
	    var CONST_NULL = '#NULL!';
	    var CONST_DIV0 = '#DIV/0!';
	    var CONST_VALUE = '#VALUE!';
	    var CONST_REF = '#REF!';
	    var CONST_NAME = '#NAME?';
	    var CONST_NA = '#N/A';
	    var CONST_NUM = '#NUM!';
	    var CONST_EXPR = 'expr'; // jshint ignore:line
	    var ERROR_LIST = [CONST_NULL, CONST_DIV0, CONST_VALUE, CONST_REF, CONST_NAME, CONST_NA, CONST_NUM];
	    var ERRORCODE_LIST = [0x00, 0x07, 0x0F, 0x17, 0x1D, 0x2A, 0x24];
	    var LETTER_POWS = [1, 26, 676]; // jshint ignore:line
	    var KEYWORD_NULL = null;
	    var KEYWORD_UNDEFINED = undefined;
	    var MATH_MIN = Math.min; // jshint ignore:line
	    var MATH_MAX = Math.max; // jshint ignore:line
	    var MATH_ABS = Math.abs;
	    var MATH_POW = Math.pow; // jshint ignore:line
	    var SR = __webpack_require__(12);
	    Calc.sr = SR;
	    Calc.parseOption = null;

	    var SRHelper = (function() {
	        function SRHelper() {

	        }

	        SRHelper.throwSR = function(sr) {
	            //throw SRHelper.sr(sr)
	        }

	        SRHelper.sr = function(sr) {
	            //return globalize.Cultures.SR[sr];
	        }

	        SRHelper.cr = function(name) {
	            //return globalize.Cultures.CR[name];
	        }

	        return SRHelper;
	    })();
	    Calc.SRHelper = SRHelper;

	    var throwSR = Calc.SRHelper.throwSR;
	    var sr = Calc.SRHelper.sr;
	    var cr = Calc.SRHelper.cr;
	    var invalidCast = 'Exp_InvalidCast';

	    /**
	     * Represents the missing argument constant.
	     */
	    Calc.missingArgument = {};

	    var __extends = function(d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) {
	                d[p] = b[p];
	            }
	        }
	        function __() {
	            this.constructor = d;
	        }

	        __.prototype = b.prototype;
	        d.prototype = new __();
	    };
	    Calc.__extends = __extends;

	    (function(CalcValueType) {
	        /**
	         *  The any type.
	         */
	        CalcValueType[CalcValueType['anyType'] = 0] = 'anyType';

	        /**
	         *  The number type.
	         */
	        CalcValueType[CalcValueType['numberType'] = 1] = 'numberType';

	        /**
	         *  The string type.
	         */
	        CalcValueType[CalcValueType['stringType'] = 2] = 'stringType';

	        /**
	         *  The boolean type.
	         */
	        CalcValueType[CalcValueType['booleanType'] = 3] = 'booleanType';

	        /**
	         *  The date type.
	         */
	        CalcValueType[CalcValueType['dateType'] = 4] = 'dateType';
	    })(Calc.CalcValueType || (Calc.CalcValueType = {}));

	    var Convert = (function() {
	        function Convert() {
	        }

	        //isNumber use short name to reduce size
	        Convert.num = function(value) {
	            return (typeof value === CONST_NUMBER) || (typeof value === CONST_BOOLEAN) || (!isNaN(value) && !isNaN(parseFloat(value))) || (value instanceof Date);
	        };

	        //static isNumber(value: any): boolean {
	        //    return (typeof value === const_number) || (!isNaN(value) && !isNaN(parseFloat(value))) ||
	        //        (value instanceof Date);
	        //}
	        // isError, use short name to reduce size
	        Convert.err = function(value) {
	            return value instanceof CalcError;
	        };

	        // isArray, use short name to reduce size
	        Convert.arr = function(value) {
	            return value instanceof Array;
	        };

	        //isReference, use short name to reduce size
	        Convert.ref = function(value) {
	            return value instanceof Reference;
	        };

	        Convert.toResult = function(value) {
	            if (isNaN(value) || !isFinite(value)) {
	                return Calc.CalcErrorsNumber;
	            }
	            return value;
	        };

	        Convert.toArr = function(value, valueType, toOneDimension, breakOnError, breakOnConvertError, ignoreBlank) {
	            return KEYWORD_NULL;
	        };

	        Convert.convertValue = function(value, valueType, convert, ignoreBlank) {
	            if (Convert.err(value)) {
	                return value;
	            }
	            var refValue = {value: KEYWORD_NULL};
	            var error = Convert.CalcConvertedError;
	            if (ignoreBlank && valueType !== 0 /* anyType */ && (value === KEYWORD_NULL || value === KEYWORD_UNDEFINED)) {
	                return error;
	            }
	            switch (valueType) {
	                case 1 /* numberType */
	                :
	                    if (!convert) {
	                        if ((typeof value) !== CONST_NUMBER && !(value instanceof Date)) {
	                            value = error;
	                        }
	                    } else {
	                        if (Convert.rD(value, refValue)) {
	                            value = refValue.value;
	                        } else {
	                            value = error;
	                        }
	                    }
	                    break;
	                case 4 /* dateType */
	                :
	                    if (typeof (value) === CONST_STRING) {
	                        var date = Convert._parseLocale(value);
	                        if (typeof date !== CONST_UNDEFINED && date !== KEYWORD_NULL) {
	                            value = Convert._toOADate(date);
	                        } else {
	                            value = error;
	                        }
	                    } else if (!convert) {
	                        if ((typeof value) !== CONST_NUMBER && !(value instanceof Date)) {
	                            value = error;
	                        }
	                    } else {
	                        if (Convert.rD(value, refValue)) {
	                            value = refValue.value;
	                        } else {
	                            value = error;
	                        }
	                    }
	                    break;
	                case 3 /* booleanType */
	                :
	                    if (!convert) {
	                        if ((typeof value) !== CONST_BOOLEAN) {
	                            value = error;
	                        }
	                    } else {
	                        if (Convert.rB(value, refValue)) {
	                            value = refValue.value;
	                        } else {
	                            value = false;
	                        }
	                    }
	                    break;
	                case 2 /* stringType */
	                :
	                    value = value === KEYWORD_NULL || value === KEYWORD_UNDEFINED ? '' : value.toString();
	                    break;
	            }
	            return value;
	        };

	        Convert._isNaNOrInfinite = function(value) {
	            return isNaN(value) || !isFinite(value);
	        };

	        // toInt, use I for code size.
	        Convert.I = function(value) {
	            var dVal = Convert.D(value);
	            if (MATH_ABS(dVal) < 1E+21) {
	                return parseInt(dVal, 10);
	            }

	            throwSR('Exp_InvalidCast');
	        };

	        // toDouble, use D for code size.
	        Convert.D = function(value) {
	            var doubleValue = {value: 0};
	            if (Convert.rD(value, doubleValue)) {
	                return doubleValue.value;
	            }
	            throwSR(invalidCast);
	            ;
	        };

	        // tryToDouble, use rD for code size.
	        Convert.rD = function(value, doubleValue) {
	            var result = KEYWORD_NULL;
	            if (typeof value === CONST_UNDEFINED || value === KEYWORD_NULL) {
	                doubleValue.value = 0;
	                return true;
	            }
	            var typestr = typeof value;
	            try {
	                if (typestr === CONST_NUMBER) {
	                    result = new Number(value).valueOf();
	                    if (Convert._isNaNOrInfinite(result)) {
	                        return false;
	                    }
	                } else if (typestr === CONST_STRING) {
	                    // Cylj comment this code at 2014/2/11.
	                    // This code will take the performence problem, and SpreadX dose not have
	                    // this code too.
	                    //var date = spread._DateTimeHelper.parseLocale(value);
	                    //if (typeof date !== const_undefined && date !== keyword_null)
	                    //    result = new spread._DateTimeHelper(date).toOADate();
	                    //else {
	                    value = value.trim();
	                    if (value.length === 0) {
	                        doubleValue.value = 0;
	                        return true;
	                    }
	                    var isPercent = false;
	                    if (value.charAt(value.length - 1) === '%') {
	                        isPercent = true;
	                        value = value.substr(0, value.length - 1);
	                    }
	                    result = new Number(value).valueOf();
	                    if (Convert._isNaNOrInfinite(result)) {
	                        return false;
	                    }
	                    if (isPercent) {
	                        result /= 100;
	                    }
	                    //}
	                } else if (typestr === CONST_BOOLEAN) {
	                    result = value ? 1 : 0;
	                } else if (value instanceof Date) {
	                    result = Convert._toOADate(value);
	                } else {
	                    return false;
	                }
	            } catch (ex) {
	                return false;
	            }
	            doubleValue.value = result;
	            return true;
	        };

	        // tryToBool, use rB for code size.
	        Convert.rB = function(value, boolValue) {
	            try {
	                if (typeof value === CONST_UNDEFINED || value === KEYWORD_NULL) {
	                    return false;
	                } else if (typeof value === CONST_BOOLEAN) {
	                } else if (value instanceof Date) {
	                    value = Convert._toOADate(value) !== 0;
	                } else if (Convert.num(value)) {
	                    value = value !== 0;
	                } else {
	                    throwSR(invalidCast);
	                }
	            } catch (ex) {
	            }
	            boolValue.value = value;
	            return true;
	        };

	        // toBool, use B for code size.
	        Convert.B = function(value) {
	            if (typeof value === CONST_UNDEFINED || value === KEYWORD_NULL) {
	                return false;
	            } else if (typeof value === CONST_BOOLEAN) {
	                return value;
	            } else if (value instanceof Date) {
	                return Convert._toOADate(value) !== 0;
	            } else if (Convert.num(value)) {
	                return value !== 0;
	            } else if (Convert.err(value)) {
	                return false;
	            } else {
	                throwSR(invalidCast);
	                ;
	            }
	        };

	        // toString, use S for code size.
	        Convert.S = function(value) {
	            try {
	                if (typeof value === CONST_UNDEFINED || value === KEYWORD_NULL) {
	                    return '';
	                } else if (typeof value === CONST_BOOLEAN) {
	                    return value ? CONST_TRUE : CONST_FALSE;
	                } else if (typeof value === CONST_STRING) {
	                    return value;
	                } else if (value instanceof Date) {
	                    // TODO
	                    //return new _DateTimeHelper(value).localeFormat('M/d/yyyy h:mm:ss');
	                } else if (Convert.arr(value)) {
	                    throwSR(invalidCast);
	                    ;
	                } else {
	                    return value.toString();
	                }
	            } catch (err) {
	                throwSR(invalidCast);
	                ;
	            }
	        };

	        // toDateTime, use DT for code size.
	        Convert.DT = function(value) {
	            var dateValue = {value: KEYWORD_NULL};
	            if (Convert.rDT(value, dateValue)) {
	                return dateValue.value;
	            }
	            throwSR(invalidCast);
	            ;
	        };

	        // tryToDateTime, use rDT for code size.
	        Convert.rDT = function(value, dateValue) {
	            if (typeof value === CONST_UNDEFINED || value === KEYWORD_NULL) {
	                dateValue.value = Convert._fromOADate(0);
	            } else if (value instanceof Date) {
	                dateValue.value = new Date(value);
	            } else if (typeof value === CONST_STRING) {
	                // TODO
	                var dateTime = Convert._parseLocale(value);
	                if ((typeof dateTime === CONST_UNDEFINED || dateTime === KEYWORD_NULL) && !isNaN(value)) {
	                    dateTime = Convert._fromOADate(parseFloat(value));
	                }
	                if (dateTime === KEYWORD_UNDEFINED || dateTime === KEYWORD_NULL) {
	                    return false;
	                }
	                dateValue.value = dateTime;
	            } else if (typeof value === CONST_NUMBER) {
	                dateValue.value = Convert._fromOADate(value);
	            } else {
	                return false;
	            }
	            return true;
	        };

	        // 1440: 60*24  oneDayMinute
	        // 86400000: oneDayMillSeconds
	        // 25569: oaDate of 1970/1/1
	        // Date.getTime() mill seconds from 1970/1/1(UTC)
	        Convert._toOADate = function(date) {
	            if (date === KEYWORD_UNDEFINED || date === KEYWORD_NULL) {
	                return 0;
	            }
	            if (typeof date === 'number') {
	                date = new Date(date);
	            }

	            //return (date.getTime() / 86400000) + 25569 - date.getTimezoneOffset() / 1440;
	            // multiply 86400000 and 1440 first then do divide. it will cause some float precision error if the order is not.
	            return (date.getTime() * 1440 + 25569 * 86400000 * 1440 - date.getTimezoneOffset() * 86400000) / (86400000 * 1440);
	        };

	        Convert._fromOADate = function(oadate) {
	            var offsetDay = oadate - 25569;
	            var date = new Date(offsetDay * 86400000);

	            // multiply 86400000 first then do divide. it will cause some float precision error if the order is not.
	            // 2014/10/17 ben.yin here is a '+1' or '-1', is for javascript divide low precision, it will loss last digit precision.So here add 1, for loss, for result right.
	            // add 1 when after 1987, sub 1 when before 1987
	            var adjustValue = offsetDay >= 0 ? 1 : -1;
	            return new Date((oadate * 86400000 * 1440 + adjustValue - 25569 * 86400000 * 1440 + date.getTimezoneOffset() * 86400000) / 1440);
	        };

	        // TODO
	        Convert._parseLocale = function(value) {
	            return new Date(value);
	        };
	        Convert.CalcConvertedError = {};
	        return Convert;
	    })();
	    Calc.Convert = Convert;

	    var _Helper = (function() {
	        function _Helper() {
	        }

	        _Helper._argumentExists = function(args, index) {
	            return args && index < args.length && (args[index] !== Calc.missingArgument);
	        };
	        _Helper._argumentValid = function(args, index) {
	            if (!args) {
	                return false;
	            }
	            var arg = args[index];
	            return arg !== Calc.missingArgument && arg !== KEYWORD_NULL && arg !== KEYWORD_UNDEFINED && !arg._error;
	        };
	        return _Helper;
	    })();
	    Calc._Helper = _Helper;

	    var StringUtil = (function() {
	        function StringUtil() {
	        }

	        StringUtil.replace = function(src, substr, replacement) {
	            return src.split(substr).join(replacement);
	        };

	        StringUtil.startsWith = function(src, prefix) {
	            return src.indexOf(prefix) === 0;
	        };

	        StringUtil.endsWith = function(src, suffix) {
	            var l = src.length - suffix.length;
	            return l >= 0 && src.indexOf(suffix, l) === l;
	        };

	        StringUtil.leftBefore = function(src, suffex) {
	            var index = src.indexOf(suffex);
	            if (index < 0 || index >= src.length) {
	                return src;
	            } else {
	                return src.substr(0, index);
	            }
	        };

	        StringUtil.contains = function(src, ss) {
	            return src.indexOf(ss) >= 0;
	        };

	        StringUtil.count = function(src, ss) {
	            var count = 0;
	            var pos = src.indexOf(ss);
	            while (pos >= 0) {
	                count += 1;
	                pos = src.indexOf(ss, pos + 1);
	            }
	            return count;
	        };
	        return StringUtil;
	    })();
	    Calc.StringUtil = StringUtil;

	    var RegUtil = (function() {
	        function RegUtil() {
	        }

	        RegUtil.getReg = function(regStr) {
	            var reg = RegUtil.regDict[regStr];
	            if (!reg) {
	                reg = RegUtil.regDict[regStr] = new RegExp(regStr, 'g');
	            }
	            reg.lastIndex = 0;
	            return reg;
	        };

	        RegUtil.getRegIgnoreCase = function(regStr) {
	            var reg = RegUtil.regDictIgnoreCase[regStr];
	            if (!reg) {
	                reg = RegUtil.regDictIgnoreCase[regStr] = new RegExp(regStr, 'gi');
	            }
	            reg.lastIndex = 0;
	            return reg;
	        };

	        RegUtil.getWildcardCriteria = function(criteria) {
	            if (RegUtil.wildcardParseRecord[criteria]) {
	                return RegUtil.wildcardParseResultBuffer[criteria];
	            }
	            if (RegUtil.getReg('[~?*]+').test(criteria)) {
	                var criteriaTemp = criteria;
	                var asteriskSymbol = RegUtil.getReplaceSymbol('asterisk', criteriaTemp);
	                var questionSymbol = RegUtil.getReplaceSymbol('question', criteriaTemp);
	                var tildeSymbol = RegUtil.getReplaceSymbol('tilde', criteriaTemp);

	                criteriaTemp = StringUtil.replace(criteriaTemp, '~~', tildeSymbol);
	                criteriaTemp = StringUtil.replace(criteriaTemp, '~*', asteriskSymbol);
	                criteriaTemp = StringUtil.replace(criteriaTemp, '~?', questionSymbol);

	                criteriaTemp = criteriaTemp.replace(RegUtil.getReg('([.+$^\\[\\](){}|\/])'), '\\$1');
	                criteriaTemp = StringUtil.replace(criteriaTemp, '*', '.*');
	                criteriaTemp = StringUtil.replace(criteriaTemp, '?', '.');

	                criteriaTemp = StringUtil.replace(criteriaTemp, asteriskSymbol, '\\*');
	                criteriaTemp = StringUtil.replace(criteriaTemp, questionSymbol, '\\?');
	                criteriaTemp = StringUtil.replace(criteriaTemp, tildeSymbol, '~');
	                RegUtil.wildcardParseResultBuffer[criteria] = criteriaTemp;
	                RegUtil.wildcardParseRecord[criteria] = true;
	                return criteriaTemp;
	            }

	            return KEYWORD_NULL;
	        };

	        RegUtil.getWildcardCriteriaFullMatch = function(criteria) {
	            var criteriaTemp = RegUtil.getWildcardCriteria(criteria);
	            if (criteriaTemp) {
	                criteriaTemp = '^' + criteriaTemp + '$';
	            }
	            return criteriaTemp;
	        };

	        RegUtil.getReplaceSymbol = function(expectSymbol, srcStr) {
	            var asteriskSymbol = '#' + expectSymbol + '0#';
	            for (var i = 1; i < 10000; i++) {
	                if (srcStr.indexOf(asteriskSymbol) > 0) {
	                    asteriskSymbol = StringUtil.replace(asteriskSymbol, '#' + expectSymbol + (i - 1) + '#', '#' + expectSymbol + i + '#');
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
	    Calc.RegUtil = RegUtil;

	    var CalcError = (function() {
	        /**
	         * Represents an error in calculation.
	         * @class
	         * @param {string} error The description of the error.
	         * @param {number} errorCode The error code.
	         */
	        function CalcError(error, errorCode) {
	            this._error = error;
	            this._code = errorCode;
	        }

	        /**
	         * Returns a string that represents this instance.
	         * @returns {string} The error string.
	         */
	        CalcError.prototype.toString = function() {
	            return this._error;
	        };

	        /**
	         * Parses the specified error from the string.
	         * @param {string} value The error string.
	         * @returns {$.wijmo.wijspread.Calc.Error} The calculation error.
	         */
	        CalcError.parse = function(value) {
	            var err = CalcError._parseCore(value);
	            if (err === KEYWORD_UNDEFINED) {
	                throw 'Incorrect error!';
	            }
	            return err;
	        };

	        CalcError._parseCore = function(value) {
	            if (typeof value !== CONST_UNDEFINED && value !== KEYWORD_NULL && value !== '') {
	                for (var i = 0; i < ERROR_LIST.length; i++) {
	                    var errItem = ERROR_LIST[i];
	                    if (errItem === value || errItem === value.toUpperCase()) {
	                        return new CalcError(errItem, ERRORCODE_LIST[i]);
	                    }
	                }
	            }
	            return KEYWORD_UNDEFINED;
	        };
	        return CalcError;
	    })();
	    Calc.CalcError = CalcError;

	    Calc.CalcErrorsNull = new CalcError(CONST_NULL, 0x00);
	    Calc.CalcErrorsDivideByZero = new CalcError(CONST_DIV0, 0x07);
	    Calc.CalcErrorsValue = new CalcError(CONST_VALUE, 0x0F);
	    Calc.CalcErrorsReference = new CalcError(CONST_REF, 0x17);
	    Calc.CalcErrorsName = new CalcError(CONST_NAME, 0x1D);
	    Calc.CalcErrorsNotAvailable = new CalcError(CONST_NA, 0x2A);
	    Calc.CalcErrorsNumber = new CalcError(CONST_NUM, 0x24);

	    /**
	     * Represents an Errors object that lists all the supported errors.
	     * @class $.wijmo.wijspread.Calc.Errors
	     */
	    var Errors = (function() {
	        function Errors() {
	        }

	        Errors.Null = Calc.CalcErrorsNull;

	        Errors.DivideByZero = Calc.CalcErrorsDivideByZero;

	        Errors.Value = Calc.CalcErrorsValue;

	        Errors.Reference = Calc.CalcErrorsReference;

	        Errors.Name = Calc.CalcErrorsName;

	        Errors.NotAvailable = Calc.CalcErrorsNotAvailable;

	        Errors.Number = Calc.CalcErrorsNumber;
	        return Errors;
	    })();
	    Calc.Errors = Errors;

	    var ParserConstants = (function() {
	        function ParserConstants() {
	        }

	        ParserConstants.BAND_INDEX_CONST = -2147483648;
	        ParserConstants.maxRowCount = 1048576;
	        ParserConstants.maxColumnCount = 16384;
	        return ParserConstants;
	    })();
	    Calc.ParserConstants = ParserConstants;

	    var CalcColumnReference = (function() {
	        /**
	         * Represents an area referenced in a spread sheet.
	         * @class $.wijmo.wijspread.Calc.Reference
	         */
	        function CalcColumnReference(calcSource, column) {
	            var self = this;
	            self.calcSource = calcSource;
	            self.column = column;
	            self.dataType = calcSource.getDataType(column);
	        }

	        CalcColumnReference.prototype.getValue = function(index, groupPath) {
	            var self = this;
	            if (index == -1) {
	                return self.calcSource.getValues(self.column, groupPath);
	            } else {
	                return self.calcSource.getValue(self.column, index, groupPath);
	            }
	        };
	        return CalcColumnReference;
	    })();
	    Calc.CalcColumnReference = CalcColumnReference;

	    var CalcTableReference = (function() {
	        /**
	         * Represents an area referenced in a spread sheet.
	         * @class $.wijmo.wijspread.Calc.Reference
	         */
	        function CalcTableReference(calcSource) {
	            var self = this;
	            self.calcSource = calcSource;
	            self.name = calcSource.getName();
	        }

	        CalcTableReference.prototype.toArray = function() {
	            return this.calcSource.toArray();
	        }

	        return CalcTableReference;
	    })();
	    Calc.CalcTableReference = CalcTableReference;

	    var CalcFieldReference = (function() {
	        /**
	         * Represents an area referenced in a spread sheet.
	         * @class $.wijmo.wijspread.Calc.Reference
	         */
	        function CalcFieldReference(calcSource, name) {
	            var self = this;
	            self.calcSource = calcSource;
	            self.name = name;
	        }

	        CalcFieldReference.prototype.getValue = function() {
	            var self = this;
	            return self.calcSource.getFieldValue(self.name);
	        };
	        return CalcFieldReference;
	    })();
	    Calc.CalcFieldReference = CalcFieldReference;
	    /* jshint ignore:end */
	})();


/***/ },
/* 2 */
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

	(function() {
	    'use strict';
	    var KEYWORD_UNDEFINED = undefined; // jshint ignore:line

	    var EvaluateContext = (function() {
	        function EvaluateContext(calcSource, currentRow, groupPath) {
	            var self = this;
	            self.calcSource = calcSource;
	            self.currentRow = currentRow;
	            self.groupPath = groupPath;
	            self.expandArrayToMultiCallCount_ = 0;
	            self.aggregatingCount_ = 0;
	            self.filteringCount_ = 0;
	            self.currentRowInternal_ = KEYWORD_UNDEFINED;
	        }

	        EvaluateContext.prototype = {
	            getCurrentRow: function() {
	                var self = this;
	                if (self.currentRow !== KEYWORD_UNDEFINED) {
	                    return self.currentRow;
	                }
	                if (self.isAggregating_() || self.isFiltering_()) {
	                    return -1;
	                } else if (self.currentRowInternal_ !== KEYWORD_UNDEFINED) {
	                    return self.currentRowInternal_;
	                } else {
	                    return -1;
	                }
	            },

	            isAggregating_: function() {
	                return this.aggregatingCount_ > 0;
	            },
	            beginAggregating_: function() {
	                this.aggregatingCount_++;
	            },
	            endAggregating_: function() {
	                this.aggregatingCount_--;
	            },

	            isFiltering_: function() {
	                return this.filteringCount_ > 0;
	            },
	            beginFilter_: function() {
	                this.filteringCount_++;
	            },
	            endFilter_: function() {
	                this.filteringCount_--;
	            }
	        };
	        return EvaluateContext;
	    })();
	    var ParserContext = (function() {
	        function ParserContext(calcSource, option) {
	            var self = this;
	            self.calcSource = calcSource;
	            self.option = option;
	        }

	        return ParserContext;
	    })();

	    module.exports = {
	        EvaluateContext: EvaluateContext,
	        ParserContext: ParserContext
	    };
	})();


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

	(function() {
	    'use strict';
	    var Calc = __webpack_require__(1);
	    var CalcExpressions = __webpack_require__(4);
	    var CalcContext = __webpack_require__(2);
	    var CalcFunctions = __webpack_require__(11);

	    var SRHelper = Calc.SRHelper;
	    var throwSR = SRHelper.throwSR;
	    var sr = SRHelper.sr;// jshint ignore:line
	    var cr = SRHelper.cr;// jshint ignore:line

	    var notSupport = 'Exp_NotSupport';
	    var invalidArr = 'Exp_InvalidArray';// jshint ignore:line
	    var atIndexOn = 'AtIndexOn';
	    var singleQuote = 'SingleQuote';
	    var fullStop = 'FullStop';
	    var formulaInvalid = 'Exp_FormulaInvalid';
	    var invalidTokenAt = 'Exp_InvalidTokenAt';
	    var invalidPara = 'Exp_InvalidParameters';
	    var noSyntax = 'Exp_NoSyntax';
	    var matchSyntax = 'Exp_MatchSyntax';
	    var singleQuotesFullStop = 'SingleQuotesFullStop';
	    var isValid = 'Exp_IsValid'; // jshint ignore:line
	    var invalidArrayAt = 'Exp_InvalidArrayAt';
	    var singleQuoteAt = 'SingleQuoteAt';// jshint ignore:line

	    var CalcParser = {};
	    module.exports = CalcParser;

	    var CONST_UNDEFINED = 'undefined';
	    var CONST_NUMBER = 'number';// jshint ignore:line
	    var CONST_STRING = 'string';
	    var CONST_BOOLEAN = 'boolean';
	    var CONST_TRUE = 'TRUE';
	    var CONST_FALSE = 'FALSE';
	    var CONST_ARRAY = 'ARRAY';
	    var CONST_ARRAYROW = 'ARRAYROW';
	    var CONST_NULL = '#NULL!';
	    var CONST_DIV0 = '#DIV/0!';
	    var CONST_VALUE = '#VALUE!';
	    var CONST_REF = '#REF!';
	    var CONST_NAME = '#NAME?';
	    var CONST_NA = '#N/A';
	    var CONST_NUM = '#NUM!';
	    var CONST_EXPR = 'expr';// jshint ignore:line
	    var CONST_ARRAYINFO = 'arrayInfo';// jshint ignore:line
	    var CONST_WORKINGEXPR = 'workingExpr';// jshint ignore:line
	    var ERROR_LIST = [CONST_NULL, CONST_DIV0, CONST_VALUE, CONST_REF, CONST_NAME, CONST_NA, CONST_NUM];
	    var ERRORCODE_LIST = [0x00, 0x07, 0x0F, 0x17, 0x1D, 0x2A, 0x24];// jshint ignore:line
	    var LETTER_POWS = [1, 26, 676];// jshint ignore:line
	    var KEYWORD_NULL = null;
	    var KEYWORD_UNDEFINED = undefined;// jshint ignore:line
	    var SUPPROT_ROW_COLUMN_FORMULA = false;// jshint ignore:line
	    var MATH_MIN = Math.min;// jshint ignore:line
	    var MATH_MAX = Math.max;// jshint ignore:line
	    var MATH_ABS = Math.abs;
	    var MATH_POW = Math.pow;

	    //<editor-fold desc='Char Helper'>
	    var NumberState = {
	        None: 0,
	        Sign: 1,
	        Int: 2,
	        Dot: 3,
	        Decimal: 4,
	        Exponent: 5,
	        SignExponent: 6,
	        ScientificNotation: 7,
	        Number: 8
	    };

	    var LatinUnicodeCategory = {
	        UppercaseLetter: 0x00,
	        LowercaseLetter: 0x01,
	        DecimalDigitNumber: 0x08,
	        OtherNumber: 0x0a,
	        SpaceSeparator: 0x0b,
	        Control: 0x0e,
	        ConnectorPunctuation: 0x12,
	        DashPunctuation: 0x13,
	        OpenPunctuation: 0x14,
	        ClosePunctuation: 0x15,
	        InitialQuotePunctuation: 0x16,
	        FinalQuotePunctuation: 0x17,
	        OtherPunctuation: 0x18,
	        MathSymbol: 0x19,
	        currencySymbol: 0x1a,
	        ModifierSymbol: 0x1b,
	        OtherSymbol: 0x1c
	    };
	    var categoryForLatin1 = [
	        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
	        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
	        0xb, 0x18, 0x18, 0x18, 0x1a, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18,
	        0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18,
	        0x18, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x14, 0x18, 0x15, 0x1b, 0x12,
	        0x1b, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
	        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x14, 0x19, 0x15, 0x19, 0xe,
	        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
	        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
	        0xb, 0x18, 0x1a, 0x1a, 0x1a, 0x1a, 0x1c, 0x1c, 0x1b, 0x1c, 0x1, 0x16, 0x19, 0x13, 0x1c, 0x1b,
	        0x1c, 0x19, 0xa, 0xa, 0x1b, 0x1, 0x1c, 0x18, 0x1b, 0xa, 0x1, 0x17, 0xa, 0xa, 0xa, 0x18,
	        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x19, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1,
	        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
	        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x19, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1
	    ];

	    var Parser = (function() {
	        function Parser(option) {
	            if ((typeof (option) === CONST_UNDEFINED || option === KEYWORD_NULL)) {
	                return;
	            }
	            Parser.setParserOption(option);
	        }

	        Parser.setParserOption = function(option) {
	            Parser.listSeparator = getProperty(option, 'listSeparator', ',');
	            Parser.numberDecimalSeparator = getProperty(option, 'numberDecimalSeparator', '.');
	            Parser.arrayGroupSeparator = getProperty(option, 'arrayGroupSeparator', ';');
	            Parser._arrayArgumentSepatator = (Parser.listSeparator === Parser.arrayGroupSeparator) ? '\\' : Parser.listSeparator;
	            Parser._operatorInfix = '\\+-*/^&=><: ' + Parser.listSeparator;
	        };

	        Parser.getParserOption = function() {
	            var option = {
	                'numberDecimalSeparator': Parser.numberDecimalSeparator,
	                'listSeparator': Parser.listSeparator,
	                'arrayGroupSeparator': Parser.arrayGroupSeparator
	            };
	            return option;
	        };

	        /**
	         * Parses a string formula to the expression using the specified ParserContext.
	         * @param {string} formula A string formula.
	         * @param {$.wijmo.wijspread.Calc.ParserContext} context The parser context setting.
	         * @returns {$.wijmo.wijspread.CalcExpressions.Expression} The expression for the parsed string formula.
	         */
	        Parser.prototype.parse = function(formula, context) {
	            var self = this;
	            if (!context) {
	                return KEYWORD_NULL;
	            }
	            if (context.option) {
	                Parser.setParserOption(context.option);
	            }
	            var tokens = self._parseToToken(formula);
	            return self._buildExpressionTree(context, tokens);
	        };

	        /**
	         * Unparses a CalcExpression to a string using the specified ParserContext.
	         * @param {$.wijmo.wijspread.CalcExpressions.Expression} expr An expression that indicates the expression tree.
	         * @param {$.wijmo.wijspread.Calc.ParserContext} context The parser context setting.
	         * @returns {string} The specified CalcExpression as a string.
	         */
	        Parser.prototype.unparse = function(expr, context) {
	            Parser.unparseWithoutCulture = false;
	            if (!expr) {
	                return '';
	            }
	            if (!context) {
	                context = new CalcContext.ParserContext(KEYWORD_NULL);
	            }
	            if (context.option) {
	                Parser.setParserOption(context.option);
	            }
	            var formula = {content: ''};
	            this._unparseExpression(expr, context, formula);
	            return formula.content;
	        };

	        Parser.prototype.unparseWithoutCulture = function(expr, context) {
	            Parser.unparseWithoutCulture = true;
	            if (!expr) {
	                return '';
	            }
	            if (!context) {
	                context = new CalcContext.ParserContext(KEYWORD_NULL);
	            }
	            if (context.option) {
	                Parser.setParserOption(context.option);
	            }
	            var formula = {content: ''};
	            this._unparseExpression(expr, context, formula);
	            Parser.unparseWithoutCulture = false;
	            return formula.content;
	        };

	        // unparse
	        Parser.prototype._unparseExpression = function(expr, context, formula) {
	            var self = this;
	            if (expr instanceof Calc.Expressions.ConstantExpression) {
	                self._unparseConstantExpression(expr, context, formula);
	            } else if (expr instanceof Calc.Expressions.OperatorExpression) {
	                self._unParseOperatorExpressions(expr, context, formula);
	            } else if (expr instanceof Calc.Expressions.StructReferenceExpression) {
	                self._unParseStructExpression(expr, context, formula);
	            } else if (expr.t === 8 /* Parentheses */) {
	                formula.content += '(';
	                self._unparseExpression(expr.argument, context, formula);
	                formula.content += ')';
	            } else if (expr.t === 3 /* Function */) {
	                formula.content += expr.getFunctionName();
	                formula.content += '(';
	                for (var i = 0; i < expr.argCount(); i++) {
	                    if (i !== 0) {
	                        if (Parser.unparseWithoutCulture) {
	                            formula.content += ',';
	                        } else {
	                            // TODO global listSpeparator
	                            //formula.content += spread.CR.listSeparator;
	                        }
	                    }
	                    self._unparseExpression(expr.getArg(i), context, formula);
	                }
	                formula.content += ')';
	            } else {
	                throwSR(notSupport);
	            }
	        };

	        /* jshint ignore:start */
	        Parser.prototype._unparseSource = function(source, context, formula) {
	            return '';
	        };
	        /* jshint ignore:end */

	        Parser.prototype._removeApostrophe = function(formula) {
	            var formulaContent = formula.content;
	            var length = formulaContent.length;
	            if (formulaContent.charAt(length - 1) === '\'') {
	                formula.content = formulaContent.substr(1, length - 2);
	                return true;
	            }
	            return false;
	        };

	        Parser.prototype._removeWorkbook = function(formula) {
	            if (formula.content.charAt(0) !== '[') {
	                return {success: false, workBookName: ''};
	            }
	            var index = formula.content.indexOf(']');
	            var workBookName = formula.content.substr(0, index + 1);
	            formula.content = formula.content.substr(index);
	            return {success: true, workBookName: workBookName};
	        };

	        /* jshint ignore:start */
	        Parser.prototype._unParseOperatorExpressions = function(expr, context, formula) {
	            var self = this;
	            if (expr.t === 5 /* UnaryOperator */) {
	                var op = expr.operator;
	                if (op === Operators.percent) {
	                    self._unparseExpression(expr.operand, context, formula);
	                    formula.content += op.name;
	                } else {
	                    formula.content += op.name;
	                    self._unparseExpression(expr.operand, context, formula);
	                }
	            } else if (expr.t === 4 /* BinaryOperator */) {
	                var leftPart = {content: ''};
	                var rightPart = {content: ''};
	                self._unparseExpression(expr.right, context, rightPart);
	                var leftIsBin = expr.left.t === 4 /* BinaryOperator */;
	                var rightIsBin = expr.right.t === 4 /* BinaryOperator */;
	                var priority = getOpeatorPriority(expr.operator.name);
	                if (leftIsBin && getOpeatorPriority(expr.left.operator.name) > priority) {
	                    leftPart.content += '(';
	                    self._unparseExpression(expr.left, context, leftPart);
	                    leftPart.content += ')';
	                } else {
	                    self._unparseExpression(expr.left, context, leftPart);
	                }
	                if (rightIsBin && getOpeatorPriority(expr.right.operator.name) > priority) {
	                    rightPart.content += '(';
	                    self._unparseExpression(expr.right, context, rightPart);
	                    rightPart.content += '(';
	                }
	                formula.content += leftPart.content;
	                formula.content += expr.operator.t === 5 /* UnaryOperator */ ? Parser.listSeparator : expr.operator.name;
	                formula.content += rightPart.content;
	            } else {
	                throwSR(notSupport);
	            }
	        };

	        Parser.prototype._unparseConstantExpression = function(expr, context, formula) {
	            var self = this;
	            var errMsg = sr(invalidArr);
	            if (expr.t === 1 /* String */) {
	                formula.content += '"';
	                formula.content += expr.value;
	                formula.content += '"';
	            } else if (expr.t === 0 /* Double */) {
	                var value = expr.originalValue;
	                if (!Parser.unparseWithoutCulture) {
	                    // TODO parser globalize
	                    //value = _NumberHelper.replaceNormalToCultureSymble(value.toString())
	                }
	                formula.content += value;
	            } else if (expr.t === 2 /* Boolean */) {
	                formula.content += expr.value ? CONST_TRUE : CONST_FALSE;
	            } else if (expr.t === 9 /* Array */) {
	                formula.content += '{';
	                var array = expr.value;
	                if (array.getRowCount() <= 0) {
	                    throw errMsg;
	                }
	                var bandIndex = Calc.ParserConstants.BAND_INDEX_CONST;
	                var colCount = bandIndex;
	                for (var rowIndex = 0; rowIndex < array.getRowCount(); rowIndex++) {
	                    if (rowIndex >= 1) {
	                        if (Parser.unparseWithoutCulture) {
	                            formula.content += ';';
	                        } else {
	                            formula.content += Parser.arrayGroupSeparator;
	                        }
	                    }
	                    for (var columnIndex = 0; columnIndex < array.getColumnCount(); columnIndex++) {
	                        if (colCount !== bandIndex && (colCount !== array.getColumnCount() || array.getColumnCount() === 0)) {
	                            throw errMsg;
	                        }
	                        if (columnIndex !== 0) {
	                            var arrayArgumentSepatator;
	                            if (Parser.unparseWithoutCulture) {
	                                arrayArgumentSepatator = ',';
	                            } else {
	                                arrayArgumentSepatator = (Parser.listSeparator === Parser.arrayGroupSeparator) ? '\\' : Parser.listSeparator;
	                            }
	                            formula.content += arrayArgumentSepatator;
	                        }
	                        var v = array.getValue(rowIndex, columnIndex);
	                        if (v === KEYWORD_UNDEFINED || v === KEYWORD_NULL) {
	                            throw errMsg;
	                        }
	                        if (v instanceof CalcExpressions.Expression) {
	                            self._unparseExpression(v, context, formula);
	                        } else {
	                            if (typeof v === CONST_STRING) {
	                                formula.content += '"';
	                                formula.content += v;
	                                formula.content += '"';
	                            } else if (typeof v === CONST_BOOLEAN) {
	                                formula.content += v ? CONST_TRUE : CONST_FALSE;
	                            } else if (!Parser.unparseWithoutCulture && typeof v === CONST_NUMBER) {
	                                // TODO parser globalize
	                                //formula.content += _NumberHelper.replaceNormalToCultureSymble(v.toString());
	                            } else {
	                                formula.content += v.toString();
	                            }
	                        }
	                    }
	                }
	                formula.content += '}';
	            } else if (expr.t === 7 /* ExternalError */) {
	                self._unparseSource(expr.source, context, formula);
	                formula.content += '!';
	                formula.content += expr.value.toString();
	            } else if (expr.t === 6 /* Error */) {
	                formula.content += expr.value.toString();
	            } else if (expr.t === 12 /* MissingArgument */) {
	                // do nothing.
	            } else {
	                throwSR(notSupport);
	            }
	        };

	        Parser.prototype._unParseStructExpressions = function(expr, context, formula) {
	            var self = this;
	            formula.content += expr.table;
	            if (expr.column) {
	                formula.content += '[';
	                formula.content += expr.column;
	                formula.content += ']';
	            }
	        };
	        /* jshint ignore:end */

	        Parser.prototype._parseToToken = function(formula, throwError) {
	            if (typeof throwError === 'undefined') {
	                throwError = true;
	            }
	            var self = this;
	            var len = formula.length;
	            var tokens1 = [];
	            var stack = [];
	            var stackEnd = -1;
	            var value = '';
	            var CONST_AT_INDEX_ON = sr(atIndexOn);
	            var currentToken;
	            var tokenStartIndex = 0;
	            var startIndex = 0;
	            var stackToken;
	            while (startIndex < len && formula.charAt(startIndex) === ' ') {
	                startIndex++;
	            }
	            if (formula.charAt(startIndex) === '=') {
	                startIndex++;
	            }
	            tokenStartIndex = startIndex;
	            for (var index = startIndex; index < len; index++) {
	                var currentChar = formula.charAt(index);
	                var rs;
	                var previous;
	                var endIndex;

	                if (currentChar === '"') {
	                    // double-quoted strings
	                    rs = readString(formula, index, '"', '"', throwError);
	                    if (rs) {
	                        tokens1.push(new FormulaToken(rs.result, 0 /* Operand */, index + 1, 3 /* Text */));
	                        index = rs.endIndex;
	                        tokenStartIndex = index + 1;
	                    } else {
	                        value += formula.substring(index, len);
	                        index = len - 1;
	                    }
	                } else if (currentChar === '\'') {
	                    // single-quoted strings (links), in path. such as 'She+ et1'!A1 + 2
	                    rs = readString(formula, index, '\'', '\'', throwError);
	                    if (rs) {
	                        value += '\'';
	                        value += rs.result;
	                        value += '\'';
	                        index = rs.endIndex;
	                    } else {
	                        value += '\'';
	                        index = index + 1;
	                    }
	                } else if (currentChar === '[') {
	                    // bracked strings (R1C1 range index or linked workbook name),
	                    // R[1]C[1]or[workbook1]sheet1!R1C1 or table1[#All]
	                    //rs = readString(formula, index, '[', ']');
	                    rs = readString2(formula, index, '[', ']', '\'', throwError); // table1[[#All], [col'[umn1]]
	                    if (rs) {
	                        //value += '[';
	                        value += rs.result;
	                        value += ']';
	                        index = rs.endIndex;
	                    } else {
	                        if (value === 'R' || value === 'r' || value === 'C' || value === 'c') {
	                            continue;
	                        }
	                        value += formula.substring(index, len);
	                        index = len - 1;
	                    }
	                } else if (currentChar === '\r' || currentChar === '\n') {
	                    continue;
	                } else if (currentChar === '#') {
	                    // error values, end marks a token, determined from absolute list of values
	                    var re = readError(formula, index);
	                    if (re) {
	                        var nextChar = index < len ? formula.charAt(index + 1) : '\0';
	                        if (index > 0 && formula.charAt(index - 1) === '!') {
	                            value += re.result;
	                        } else if (CONST_REF === re.result.toUpperCase() && index < len && (isLetterOrDigit(nextChar) || nextChar === '$')) {
	                            // #REF!A1  #REF!$A$1:$B$2
	                            value += re.result;
	                        } else {
	                            tokens1.push(new FormulaToken(re.result, 0 /* Operand */, index, 6 /* Error */));
	                            tokenStartIndex = index + 1;
	                        }
	                        index = re.endIndex;
	                    } else {
	                        value += currentChar;
	                        //tokens1.push(new FormulaToken(currentChar, ExcelFormulaTokenType.Unknown, index));
	                        //value = '';
	                        //tokenStartIndex = index + 1;
	                    }
	                } else if (currentChar === '+' || currentChar === '-') {
	                    previous = tokens1.length === 0 ? null : tokens1[tokens1.length - 1];
	                    if (value.length !== 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        tokens1.push(new FormulaToken(currentChar, 5 /* OperatorInfix */, index));
	                        value = '';
	                        tokenStartIndex = index + 1;
	                    } else {
	                        if (previous && previous.type === 7 /* Whitespace */) {
	                            tokens1.pop();
	                            previous = tokens1[tokens1.length - 1];
	                        }
	                        if (previous && ((previous.type === 1 /* Function */ && previous.subType === 2 /* Stop */) || (previous.type === 2 /* Subexpression */ && previous.subType === 2 /* Stop */) || (previous.type === 6 /* OperatorPostfix */) || (previous.type === 0 /* Operand */))) {
	                            // binary operator
	                            tokens1.push(new FormulaToken(currentChar, 5 /* OperatorInfix */, index));
	                            tokenStartIndex = index + 1;
	                        } else {
	                            tokens1.push(new FormulaToken(currentChar, 4 /* OperatorPrefix */, index));
	                            tokenStartIndex = index + 1;
	                        }
	                    }
	                } else if (currentChar === Parser.numberDecimalSeparator || isDigit(currentChar)) {
	                    var isNum;
	                    if (value.length > 0) {
	                        value += currentChar;
	                    } else if ((isNum = isNumber2(formula, index, Parser.numberDecimalSeparator)).result) {
	                        endIndex = isNum.endIndex;
	                        var num = formula.slice(index, endIndex + 1);
	                        if (Parser.numberDecimalSeparator !== '.') {
	                            // TODO parser globalize
	                            //num = _NumberHelper.replaceCultureSymbolToNormal(num);
	                        }
	                        while (endIndex <= len - 2 && formula.charAt(endIndex + 1) === ' ') {
	                            endIndex++;
	                        }

	                        // in the formula SUM(1 : 2), 1 and 2 is a row reference, not a number.
	                        if (endIndex <= len - 2 && formula.charAt(endIndex + 1) === ':') {
	                            value += num;
	                            value += ':';
	                            endIndex++;
	                            tokenStartIndex = index;
	                        } else {
	                            tokens1.push(new FormulaToken(num, 0 /* Operand */, index, 4 /* Number */));
	                            tokenStartIndex = index + 1;
	                        }
	                        index = endIndex;
	                    } else {
	                        value += currentChar;
	                    }
	                } else if (currentChar === '{') {
	                    if (value.length > 0 && throwError) {
	                        throw sr(formulaInvalid) + sr(singleQuote) + '{' + CONST_AT_INDEX_ON + index + sr(fullStop);
	                    }
	                    currentToken = new FormulaToken(CONST_ARRAY, 1 /* Function */, index, 1 /* Start */);
	                    tokens1.push(currentToken);
	                    stack[++stackEnd] = currentToken;
	                    currentToken = new FormulaToken(CONST_ARRAYROW, 1 /* Function */, index, 1 /* Start */);
	                    tokens1.push(currentToken);
	                    stack[++stackEnd] = currentToken;
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === Parser.arrayGroupSeparator && stackEnd >= 0 && (stack[stackEnd].value === CONST_ARRAY || stack[stackEnd].value === CONST_ARRAYROW)) {
	                    // the array separator
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    if (stackEnd < 0 && throwError) {
	                        throw sr(formulaInvalid) + sr(singleQuote) + currentChar + CONST_AT_INDEX_ON + index + sr(fullStop);
	                    }
	                    stackToken = stack[stackEnd--];
	                    stackToken = new FormulaToken(currentChar, stackToken.type, index, 2 /* Stop */);
	                    tokens1.push(stackToken);
	                    tokens1.push(new FormulaToken(Parser.listSeparator, 3 /* Argument */, index));
	                    currentToken = new FormulaToken(CONST_ARRAYROW, 1 /* Function */, index + 1, 1 /* Start */);
	                    tokens1.push(currentToken);
	                    stack[++stackEnd] = currentToken;
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === '}') {
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    if (endIndex < 0 && throwError) {
	                        throw sr(formulaInvalid) + sr(singleQuote);
	                        //+currentChar + CONST_AT_INDEX_ON + index + sr(fullStop);
	                    }
	                    stackToken = stack[stackEnd--];
	                    stackToken = new FormulaToken(currentChar, stackToken.type, index, 2 /* Stop */);
	                    tokens1.push(stackToken);
	                    stackToken = stack[stackEnd--];
	                    stackToken = new FormulaToken(currentChar, stackToken.type, index, 2 /* Stop */);
	                    tokens1.push(stackToken);
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === ' ') {
	                    var sIndex = index;
	                    index++;
	                    while ((index < len) && value.charAt(value.length - 1) === ' ') {
	                        index++;
	                    }
	                    if (value.length > 0 && value.charAt(value.length - 1) !== ':' && index < len && formula.charAt(index) !== ':') {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                        tokens1.push(new FormulaToken('', 7 /* Whitespace */, sIndex));
	                    }
	                    tokenStartIndex = index;
	                    index--;
	                } else if ((index + 2) <= len && currentChar === '<' && formula.charAt(index + 1) === '=' || currentChar === '>' && formula.charAt(index + 1) === '=' || currentChar === '<' && formula.charAt(index + 1) === '>') {
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    tokens1.push(new FormulaToken(formula.slice(index, index + 2), 5 /* OperatorInfix */, index, 5 /* Logical */));
	                    index++;
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === '%') {
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    tokens1.push(new FormulaToken(formula.charAt(index), 6 /* OperatorPostfix */, index));
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === '+' || currentChar === '-' || currentChar === '*' || currentChar === '/' || currentChar === '=' || currentChar === '>' || currentChar === '<' || currentChar === '&' || currentChar === '^' || currentChar === '|') {
	                    // standard infix operators
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    if (currentChar === '&') {
	                        if (formula.charAt(index + 1) === '&') {
	                            tokens1.push(new FormulaToken('&&', 5 /* OperatorInfix */, index));
	                            tokenStartIndex = index + 1;
	                            index += 1;
	                            continue;
	                        }
	                    } else if (currentChar === '|') {
	                        if (formula.charAt(index + 1) === '|') {
	                            tokens1.push(new FormulaToken('||', 5 /* OperatorInfix */, index));
	                            tokenStartIndex = index + 1;
	                            index += 1;
	                        } else {
	                            value += currentChar;
	                        }
	                        continue;
	                    }
	                    tokens1.push(new FormulaToken(currentChar, 5 /* OperatorInfix */, index));
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === '(') {
	                    // start sub expression or function
	                    if (value.length > 0) {
	                        var lastChar = value.charAt(value.length - 1);
	                        if (lastChar === ':' || lastChar === Parser.listSeparator || lastChar === ' ') {
	                            // A1:(A2,A3) | A1,(A2,A3)
	                            value = value.slice(0, value.length - 1);
	                            tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex, 7 /* RangeOrName */));
	                            tokens1.push(new FormulaToken(lastChar, 5 /* OperatorInfix */, index - 1, 0 /* Nothing */));
	                            currentToken = new FormulaToken('', 2 /* Subexpression */, index, 1 /* Start */);
	                            tokens1.push(currentToken);
	                            stack[++stackEnd] = currentToken;
	                        } else {
	                            //try A1:INDIRECT('B1')
	                            var refOpIndex = value.indexOf(':');
	                            var refOpToken = ':';
	                            if (refOpIndex === -1) {
	                                refOpIndex = value.indexOf(Parser.listSeparator);
	                                refOpToken = Parser.listSeparator;
	                            }
	                            if (refOpIndex === -1) {
	                                refOpIndex = value.indexOf(' ');
	                                refOpToken = ' ';
	                            }
	                            if (refOpIndex !== -1 && refOpIndex > 0) {
	                                tokens1.push(new FormulaToken(value.substr(0, refOpIndex), 0 /* Operand */, tokenStartIndex, 7 /* RangeOrName */));
	                                tokens1.push(new FormulaToken(refOpToken, 5 /* OperatorInfix */, tokenStartIndex + refOpIndex, 0 /* Nothing */));
	                                value = value.slice(refOpIndex + 1);
	                                currentToken = new FormulaToken(value.toUpperCase(), 1 /* Function */, tokenStartIndex + refOpIndex + 1, 1 /* Start */);
	                                tokens1.push(currentToken);
	                                stack[++stackEnd] = currentToken;
	                            } else {
	                                // function
	                                currentToken = new FormulaToken(value.toUpperCase(), 1 /* Function */, index - value.length, 1 /* Start */);
	                                tokens1.push(currentToken);
	                                stack[++stackEnd] = currentToken;
	                            }
	                        }
	                        value = '';
	                    } else {
	                        currentToken = new FormulaToken('', 2 /* Subexpression */, index, 1 /* Start */);
	                        tokens1.push(currentToken);
	                        stack[++stackEnd] = currentToken;
	                    }
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === Parser.listSeparator || currentChar === Parser._arrayArgumentSepatator || currentChar === Parser.arrayGroupSeparator) {
	                    // function, sub expression, or array parameters, or operand unions
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    if (stackEnd < 0 || stack[stackEnd].type !== 1 /* Function */) {
	                        tokens1.push(new FormulaToken(Parser.listSeparator, 5 /* OperatorInfix */, index, 10 /* Union */));
	                    } else {
	                        tokens1.push(new FormulaToken(Parser._arrayArgumentSepatator, 3 /* Argument */, index));
	                    }
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === ')') {
	                    if (value.length > 0) {
	                        tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	                        value = '';
	                    }
	                    if (stackEnd < 0 && throwError) {
	                        throw sr(formulaInvalid) + sr(singleQuote);
	                        //+currentChar + CONST_AT_INDEX_ON + index + sr(fullStop);
	                    }
	                    stackToken = stack[stackEnd--];
	                    stackToken = new FormulaToken(currentChar, stackToken.type, index, 2 /* Stop */);
	                    tokens1.push(stackToken);
	                    tokenStartIndex = index + 1;
	                } else if (currentChar === ':') {
	                    // such as (A1 A2):B3
	                    if (value.length === 0 && tokens1[tokens1.length - 1].subType === 2 /* Stop */) {
	                        tokens1.push(new FormulaToken(':', 5 /* OperatorInfix */, index, 11 /* RangeOp */));
	                        tokenStartIndex = index + 1;
	                    } else {
	                        value += ':';
	                    }
	                } else {
	                    value += currentChar;
	                }
	            }
	            if (value.length > 0) {
	                tokens1.push(new FormulaToken(value, 0 /* Operand */, tokenStartIndex));
	            }

	            return self._processTokens(tokens1, throwError);
	        };

	        Parser.prototype._processTokens = function(tokens1, throwError) {
	            // remove unnecessary white-space tokens;
	            // identifying operand and infix-operator subtypes;
	            // pulling '@' from function names;
	            // process error tokens.
	            // build token tree.
	            var tokens2 = this._removeWhiteSpace(tokens1);
	            var stack = [];
	            var rootToken = new FormulaToken('', 8 /* Unknown */, 0, 1 /* Start */);
	            stack.push(rootToken);
	            var parent;
	            var length = tokens2.length;
	            for (var i = 0; i < length; i++) {
	                var currentToken = tokens2[i];
	                if (!currentToken) {
	                    continue;
	                }
	                var previous = i === 0 ? KEYWORD_NULL : tokens2[i - 1];
	                var next = i === length - 1 ? KEYWORD_NULL : tokens2[i + 1];

	                // determine the logical values
	                if (currentToken.type === 0 /* Operand */ && currentToken.subType === 0 /* Nothing */) {
	                    var value = currentToken.value.toUpperCase();
	                    if (value === CONST_TRUE || value === CONST_FALSE) {
	                        currentToken.subType = 5 /* Logical */;
	                        currentToken.value = value;
	                    } else {
	                        currentToken.subType = 7 /* RangeOrName */;
	                    }
	                } else if (currentToken.type === 1 /* Function */) {
	                    // remove the char '@' before the Function
	                    if (currentToken.value.length > 0) {
	                        if (currentToken.value.charAt(0) === '@') {
	                            currentToken.value = currentToken.value.substr(1);
	                        }
	                    }
	                }
	                if (stack.length === 0 && throwError) {
	                    throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                }
	                parent = stack[stack.length - 1];

	                // process the possible error tokens
	                if (parent.value === CONST_ARRAYROW) {
	                    if (throwError && (currentToken.type !== 3 /* Argument */ && currentToken.subType !== 6 /* Error */ && currentToken.subType !== 2 /* Stop */ && currentToken.subType !== 5 /* Logical */ && currentToken.subType !== 4 /* Number */ && currentToken.subType !== 3 /* Text */ && currentToken.type !== 4 /* OperatorPrefix */)) {
	                        throw sr(invalidArrayAt) + currentToken.index + sr(fullStop);
	                    }
	                }
	                switch (currentToken.type) {
	                    case 0 /* Operand */
	                    :
	                        if (throwError && (previous && (previous.type === 0 /* Operand */ || previous.type === 6 /* OperatorPostfix */ || previous.type === 1 /* Function */ && previous.subType === 2 /* Stop */ || previous.type === 2 /* Subexpression */ && previous.subType === 2 /* Stop */))) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    case 1 /* Function */
	                    :
	                    case 2 /* Subexpression */
	                    :
	                        if (currentToken.value === CONST_ARRAY && currentToken.type === 1 /* Function */ && currentToken.subType === 1 /* Start */ && !previous) {
	                            break;
	                        } else if (throwError && (currentToken.subType === 2 /* Stop */ && (!previous || previous.type === 4 /* OperatorPrefix */ || previous.type === 5 /* OperatorInfix */) || currentToken.subType === 1 /* Start */ && previous && (!next || previous.type === 6 /* OperatorPostfix */ || previous.subType === 2 /* Stop */))) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        if (throwError && (currentToken.subType === 2 /* Stop */ && currentToken.type === 2 /* Subexpression */ && previous.subType === 1 /* Start */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        if (throwError && (currentToken.subType === 2 /* Stop */ && currentToken.type === 1 /* Function */ && previous.type === 2 /* Subexpression */ && previous.subType === 1 /* Start */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        if (throwError && currentToken.subType === 1 /* Start */ && previous && (previous.type === 1 /* Function */ && previous.subType === 2 /* Stop */ || previous.type === 0 /* Operand */ || previous.type === 6 /* OperatorPostfix */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    case 3 /* Argument */
	                    :
	                        if (throwError && (!next || !previous || previous.type === 5 /* OperatorInfix */ || previous.type === 4 /* OperatorPrefix */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    case 4 /* OperatorPrefix */
	                    :
	                        if (throwError && (!next || previous && (previous.type === 6 /* OperatorPostfix */))) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    case 5 /* OperatorInfix */
	                    :
	                        if (throwError && (!next || !previous || previous.type === 5 /* OperatorInfix */ || previous.type === 4 /* OperatorPrefix */ || previous.type === 3 /* Argument */ || previous.type === 1 /* Function */ && previous.subType === 1 /* Start */ || previous.type === 2 /* Subexpression */ && previous.subType === 1 /* Start */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    case 6 /* OperatorPostfix */
	                    :
	                        if (throwError && (!previous || previous.type === 4 /* OperatorPrefix */ || previous.type === 5 /* OperatorInfix */ || previous.type === 1 /* Function */ && previous.subType === 1 /* Start */ || previous.type === 2 /* Subexpression */ && previous.subType === 1 /* Start */)) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                        break;
	                    default:
	                        if (throwError) {
	                            throw sr(invalidTokenAt) + currentToken.index + sr(fullStop);
	                        }
	                }

	                //if throwError is false, it's called by formula textbox, so return token array
	                if (throwError) {
	                    //build token tree.
	                    if (currentToken.subType === 1 /* Start */) {
	                        stack.push(currentToken);
	                        parent.children.push(currentToken);
	                    } else if (currentToken.subType === 2 /* Stop */) {
	                        if (stack.length === 0) {
	                            var currentChar;
	                            if (currentToken.value === CONST_ARRAY || currentToken.value === CONST_ARRAYROW) {
	                                currentChar = '}';
	                            } else {
	                                currentChar = ')';
	                            }
	                            if (throwError) {
	                                throw sr(formulaInvalid) + sr(singleQuote);
	                                //+currentChar + sr(singleQuoteAt) + currentToken.index + sr(fullStop);
	                            }
	                        }
	                        stack.pop();
	                    } else {
	                        parent.children.push(currentToken);
	                    }
	                }
	            }
	            if (throwError) {
	                return rootToken.children;
	            } else {
	                return tokens2;
	            }
	        };

	        Parser.prototype._removeWhiteSpace = function(tokens1) {
	            // remove unnecessary white-space tokens and converting necessary ones to binary intersection operator.
	            var tokens2 = [];
	            var length = tokens1.length;
	            for (var i = 0; i < length; i++) {
	                var token = tokens1[i];
	                if (!token) {
	                    continue;
	                }
	                if (token.type !== 7 /* Whitespace */) {
	                    tokens2.push(token);
	                    continue;
	                }

	                var previous = i === 0 ? KEYWORD_NULL : tokens1[i - 1];
	                var next = i === length - 1 ? KEYWORD_NULL : tokens1[i + 1];
	                if (!previous || !next) {
	                    continue;
	                }
	                if ((((previous.type === 1 /* Function */) && (previous.subType === 2 /* Stop */)) || ((previous.type === 2 /* Subexpression */) && (previous.subType === 2 /* Stop */)) || (previous.type === 0 /* Operand */)) && (((next.type === 1 /* Function */) && (next.subType === 1 /* Start */)) || ((next.type === 2 /* Subexpression */) && (next.subType === 1 /* Start */)) || (next.type === 0 /* Operand */))) {
	                    tokens2.push(new FormulaToken(' ', 5 /* OperatorInfix */, token.index, 9 /* Intersection */));
	                }
	            }
	            return tokens2;
	        };

	        Parser.prototype._buildExpressionNode = function(context, token) {
	            var self = this;
	            var currentExpression;
	            if (token.type === 1 /* Function */) {
	                if (token.value === CONST_ARRAY) {
	                    currentExpression = self._buildArraryExpression(context, token);
	                } else {
	                    currentExpression = self._buildFunctionExpression(context, token);
	                }
	            } else if (token.type === 2 /* Subexpression */) {
	                currentExpression = self._buildSubExpression(context, token);
	            } else if (token.type === 0 /* Operand */) {
	                if (token.subType === 4 /* Number */) {
	                    currentExpression = new CalcExpressions.DoubleExpression(parseFloat(token.value), token.value);
	                } else if (token.subType === 6 /* Error */) {
	                    currentExpression = new CalcExpressions.ErrorExpression(Calc.CalcError.parse(token.value));
	                } else if (token.subType === 5 /* Logical */) {
	                    if (compareStringIgnoreCase(token.value, CONST_TRUE)) {
	                        currentExpression = new CalcExpressions.BooleanExpression(true);
	                    } else if (compareStringIgnoreCase(token.value, CONST_FALSE)) {
	                        currentExpression = new CalcExpressions.BooleanExpression(false);
	                    }
	                } else if (token.subType === 7 /* Struct or Field */) {
	                    currentExpression = self._buildStructOrFieldExpression(context, token.value, token.index);
	                } else {
	                    currentExpression = new CalcExpressions.StringExpression(token.value);
	                }
	            }
	            return currentExpression;
	        };

	        Parser.prototype._buildExpressionTree = function(context, tokens) {
	            // parse to expression and binary operator list
	            // the list should be: expression operator expression operator expression
	            var results = this._parseToBinaryOperatorList(context, tokens);
	            var currentExpression;
	            var lastExpression;
	            var nextExpression;
	            var index;

	            for (index = 3; index < results.length;) {
	                var nextToken = results[index];
	                var currentToken = results[index - 2];
	                if (nextToken && nextToken.type === 5 /* OperatorInfix */) {
	                    while (index >= 3 && getOpeatorPriority(nextToken.value) >= getOpeatorPriority(currentToken.value)) {
	                        //compose two expressions and the binary operator to one expression
	                        lastExpression = results[index - 3];
	                        nextExpression = results[index - 1];
	                        currentExpression = new CalcExpressions.BinaryOperatorExpression(getBinaryOperator(currentToken), lastExpression, nextExpression);
	                        results.splice(index - 3, 3);
	                        results.splice(index - 3, 0, currentExpression);
	                        index -= 2;
	                        if (index >= 3) {
	                            currentToken = results[index - 2];
	                        }
	                    }
	                    index += 2;
	                } else {
	                    index++;
	                }
	            }
	            if (results.length === 1) {
	                return results[0];
	            } else {
	                for (index = results.length - 2; index > 0; index -= 2) {
	                    lastExpression = results[index - 1];
	                    nextExpression = results[index + 1];
	                    currentExpression = new CalcExpressions.BinaryOperatorExpression(getBinaryOperator(results[index]), lastExpression, nextExpression);
	                    results.splice(index - 1, 3);
	                    results.push(currentExpression);
	                }
	                return currentExpression;
	            }
	        };

	        Parser.prototype._parseToBinaryOperatorList = function(context, tokens) {
	            var results = [];
	            var currentExpression;
	            var Operators = CalcParser.Operators;
	            for (var i = 0; i < tokens.length; i++) {
	                var currentToken = tokens[i];
	                if (currentToken.type === 4 /* OperatorPrefix */) {
	                    var opStack = [];
	                    while (currentToken.type === 4 /* OperatorPrefix */) {
	                        opStack.push(currentToken.value === '+' ? Operators.plus : Operators.negate);
	                        i++;
	                        currentToken = tokens[i];
	                    }
	                    var nextToken = tokens[i];
	                    currentExpression = new CalcExpressions.UnaryOperatorExpression(opStack.pop(), this._buildExpressionNode(context, nextToken));
	                    while (opStack.length > 0) {
	                        currentExpression = new CalcExpressions.UnaryOperatorExpression(opStack.pop(), currentExpression);
	                    }
	                    results.push(currentExpression);
	                } else if (currentToken.type === 6 /* OperatorPostfix */) {
	                    var lastExpression = results[results.length - 1];
	                    currentExpression = new CalcExpressions.UnaryOperatorExpression(Operators.percent, lastExpression);
	                    results.pop();
	                    results.push(currentExpression);
	                } else if (currentToken.type === 5 /* OperatorInfix */) {
	                    results.push(currentToken);
	                } else {
	                    currentExpression = this._buildExpressionNode(context, currentToken);
	                    results.push(currentExpression);
	                }
	            }
	            return results;
	        };

	        Parser.prototype._buildFunctionExpression = function(context, rootToken) {
	            var args = [];
	            var subTokens = [];
	            for (var i = 0; i < rootToken.children.length; i++) {
	                var token = rootToken.children[i];
	                if (token.type !== 3 /* Argument */) {
	                    subTokens.push(token);
	                } else {
	                    if (subTokens.length === 0) {
	                        args.push(new CalcExpressions.MissingArgumentExpression());
	                    } else {
	                        args.push(this._buildExpressionTree(context, subTokens));
	                        subTokens = [];
	                    }
	                }
	            }
	            if (subTokens.length !== 0) {
	                args.push(this._buildExpressionTree(context, subTokens));
	            } else if (rootToken.children.length !== 0) {
	                args.push(new CalcExpressions.MissingArgumentExpression());
	            }
	            var fn = CalcFunctions.findGlobalFunction(rootToken.value);
	            if (fn) {
	                var argsLength = args.length;
	                if (argsLength < fn.minArgs || argsLength > fn.maxArgs) {
	                    throw sr(invalidPara) + rootToken.index + sr(fullStop);
	                }
	                return new CalcExpressions.FunctionExpression(fn, args);
	            } else {
	                return new CalcExpressions.FunctionExpression(rootToken.value, args);
	            }
	        };

	        Parser.prototype._buildSubExpression = function(context, rootToken) {
	            return new CalcExpressions.ParenthesesExpression(this._buildExpressionTree(context, rootToken.children));
	        };

	        Parser.prototype._buildStructOrFieldExpression = function(context, value) {
	            if (value === KEYWORD_UNDEFINED || value === KEYWORD_NULL || value === '') {
	                return {endIndex: 0, expression: KEYWORD_NULL};
	            }
	            var length = value.length;

	            var reg = /^([^\[\]]*)[\[]{1}([^\[\]]+)[\]]{1}$/g;
	            var results = reg.exec(value);
	            if (results) {
	                if (results.length !== 3) {
	                    return {endIndex: length, expression: KEYWORD_NULL};
	                }
	                var table = results[1];
	                var column = results[2];
	                if (column) {
	                    if (context.calcSource.hasColumn(column)) {
	                        if (!table) {
	                            table = context.calcSource.getName();
	                        }
	                        return new CalcExpressions.StructReferenceExpression(table, column);
	                    } else if (context.calcSource.hasField(column)) {
	                        return new CalcExpressions.FieldReferenceExpression(column);
	                    } else {
	                        return new CalcExpressions.UnknownReferenceExpression(column);
	                    }
	                }
	            } else {
	                return new CalcExpressions.StructReferenceExpression(value);
	            }
	            //return null;
	        };

	        Parser.prototype._validateName = function(name) {
	            if (name === KEYWORD_UNDEFINED || name === KEYWORD_NULL || name === '') {
	                return false;
	            }
	            var nameLength = name.length;
	            if (nameLength === 1 && (name === 'R' || name === 'r' || name === 'C' || name === 'c')) {
	                return false;
	            }
	            var currentChar = name.charAt(0);
	            if (!(currentChar === '_' || currentChar === '\\' || isLetter(currentChar) || isSymbol(currentChar))) {
	                return false;
	            }
	            for (var i = 1; i < nameLength; i++) {
	                currentChar = name.charAt(i);
	                if (!(currentChar === '_' || currentChar === '\\' || currentChar === '?' || currentChar === '.' || isLetterOrDigit(currentChar) || isSymbol(currentChar))) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        Parser._isLetter = isLetter;
	        Parser._isLetterOrDigit = isLetterOrDigit;

	        Parser.listSeparator = ',';
	        Parser.numberDecimalSeparator = '.';
	        Parser.arrayGroupSeparator = ';';
	        Parser._arrayArgumentSepatator = Parser.listSeparator;
	        Parser._operatorInfix = '\\+-*/^&=><: ' + Parser.listSeparator;
	        Parser.unparseWithoutCulture = false;
	        return Parser;
	    })();
	    CalcParser.Parser = Parser;

	    function isLatin1(cc) {
	        return cc <= 0x00ff;
	    }

	    function isAscii(cc) {
	        return cc <= 0x007f;
	    }

	    function isDigit(c) {
	        var cc = c.charCodeAt(0);

	        //if (!isLatin1(cc)) { // not latin character, not supported yet.
	        //    return false;
	        //}
	        // 0-9
	        return cc >= 48 && cc <= 57;
	    }

	    function isLetter(c) {
	        var cc = c.charCodeAt(0);
	        if (!isLatin1(cc)) {
	            return true;
	        }

	        // fix bug 92964
	        if (!isAscii(cc)) {
	            return categoryForLatin1[cc] === LatinUnicodeCategory.UppercaseLetter || categoryForLatin1[cc] === LatinUnicodeCategory.LowercaseLetter;
	        }
	        // make lowcase
	        cc |= 0x20; // jshint ignore:line

	        // // a-z;
	        return (cc >= 96 && cc <= 122);
	    }

	    function isLetterOrDigit(c) {
	        var cc = c.charCodeAt(0);
	        if (!isLatin1(cc)) {
	            return true;
	        }

	        // fix bug 92964
	        if (!isAscii(cc)) {
	            return categoryForLatin1[cc] === LatinUnicodeCategory.UppercaseLetter || categoryForLatin1[cc] === LatinUnicodeCategory.LowercaseLetter;
	        }
	        if (cc <= 57) {
	            return cc >= 48;
	        }
	        // make lowcase
	        cc |= 0x20; // jshint ignore:line

	        // a-z;
	        return (cc >= 96 && cc <= 122);
	    }

	    function isSymbol(c) {
	        var cc = c.charCodeAt(0);
	        if (!isLatin1(cc)) {
	            return false;
	        }
	        return categoryForLatin1[cc] === LatinUnicodeCategory.MathSymbol || categoryForLatin1[cc] === LatinUnicodeCategory.currencySymbol || categoryForLatin1[cc] === LatinUnicodeCategory.ModifierSymbol || categoryForLatin1[cc] === LatinUnicodeCategory.OtherSymbol;
	    }

	    /* jshint ignore:start */
	    function isNumber(c) {
	        var cc = c.charCodeAt(0);

	        //if (!isLatin1(cc)) {
	        //    return false;
	        //}
	        // fix bug 92964
	        if (!isAscii(cc)) {
	            return categoryForLatin1[cc] === LatinUnicodeCategory.DecimalDigitNumber || categoryForLatin1[cc] === LatinUnicodeCategory.OtherNumber;
	        }

	        // 0-9
	        return cc >= 48 && cc <= 57;
	    }
	    /* jshint ignore:end */

	    function isNumber2(str, startIndex, numberDecimalSeparator) {
	        var len = str.length;
	        var state = NumberState.None;
	        for (var i = startIndex; i < len; i++) {
	            var currentChar = str.charAt(i);
	            if (isDigit(currentChar)) {
	                if (state === NumberState.None) {
	                    state = NumberState.Int;
	                } else if (state === NumberState.Dot) {
	                    state = NumberState.Decimal;
	                } else if (state === NumberState.Sign) {
	                    state = NumberState.Int;
	                } else if (state === NumberState.Exponent || state === NumberState.SignExponent) {
	                    state = NumberState.ScientificNotation;
	                }
	            } else if (currentChar === numberDecimalSeparator) {
	                if (state === NumberState.Int) {
	                    state = NumberState.Decimal;
	                } else if (state === NumberState.None || state === NumberState.Sign) {
	                    state = NumberState.Dot;
	                } else {
	                    return {result: false};
	                }
	            } else if (currentChar === '+' || currentChar === '-') {
	                if (state === NumberState.None) {
	                    state = NumberState.Sign;
	                } else if (state === NumberState.Exponent) {
	                    state = NumberState.SignExponent;
	                } else {
	                    return {result: true, endIndex: i - 1};
	                }
	            } else if (currentChar === 'E' || currentChar === 'e') {
	                if (state === NumberState.Int || state === NumberState.Decimal) {
	                    state = NumberState.Exponent;
	                } else {
	                    return {result: false};
	                }
	            } else if (state === NumberState.Int || state === NumberState.Decimal || state === NumberState.ScientificNotation) {
	                return {result: true, endIndex: i - 1};
	            }
	        }
	        if (state === NumberState.Int || state === NumberState.Decimal || state === NumberState.ScientificNotation) {
	            return {result: true, endIndex: len - 1};
	        }
	        return {result: false};
	    }

	    //</editor-fold>
	    //<editor-fold desc='Parser Definition'>
	    var ExcelFormulaTokenType;
	    (function(ExcelFormulaTokenType) {
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Operand = 0] = 'Operand';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Function = 1] = 'Function';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Subexpression = 2] = 'Subexpression';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Argument = 3] = 'Argument';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.OperatorPrefix = 4] = 'OperatorPrefix';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.OperatorInfix = 5] = 'OperatorInfix';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.OperatorPostfix = 6] = 'OperatorPostfix';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Whitespace = 7] = 'Whitespace';
	        ExcelFormulaTokenType[ExcelFormulaTokenType.Unknown = 8] = 'Unknown';
	    })(ExcelFormulaTokenType || (ExcelFormulaTokenType = {}));
	    var ExcelFormulaTokenSubtype;
	    (function(ExcelFormulaTokenSubtype) {
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Nothing = 0] = 'Nothing';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Start = 1] = 'Start';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Stop = 2] = 'Stop';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Text = 3] = 'Text';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Number = 4] = 'Number';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Logical = 5] = 'Logical';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Error = 6] = 'Error';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.RangeOrName = 7] = 'RangeOrName';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Concatenation = 8] = 'Concatenation';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Intersection = 9] = 'Intersection';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.Union = 10] = 'Union';
	        ExcelFormulaTokenSubtype[ExcelFormulaTokenSubtype.RangeOp = 11] = 'RangeOp';
	    })(ExcelFormulaTokenSubtype || (ExcelFormulaTokenSubtype = {}));

	    var FormulaToken = (function() {
	        function FormulaToken(value, type, index, subType) {
	            if (subType === KEYWORD_UNDEFINED || subType === KEYWORD_NULL) {
	                subType = 0 /* Nothing */;
	            }

	            var self = this;
	            self.value = value;
	            self.type = type;
	            self.index = index;
	            self.subType = subType;
	            self.children = [];
	        }

	        return FormulaToken;
	    })();

	    function readString(formula, startIndex, startSign, endSign, throwError) {
	        var len = formula.length;
	        var startSignCount = (startSign === endSign) ? 0 : 1;
	        var text = '';
	        for (var index = startIndex + 1; index < len; index++) {
	            var currentChar = formula.charAt(index);
	            if (currentChar === startSign) {
	                startSignCount++;
	            }
	            if (currentChar === endSign) {
	                startSignCount--;
	                if (startSign === endSign && index + 2 < len && formula.charAt(index + 1) === startSign) {
	                    text += startSign;
	                    index++;
	                } else if (startSignCount !== 0) {
	                    text += currentChar;
	                } else {
	                    return {result: text, endIndex: index};
	                }
	            } else {
	                text += currentChar;
	            }
	        }
	        if (throwError) {
	            throw sr(noSyntax) + endSign + sr(matchSyntax) + startSign + sr(singleQuotesFullStop);
	        }
	    }

	    function readString2(formula, startIndex, startSign, endSign, escapeSign, throwError) {
	        var len = formula.length;
	        var startSignCount = 0;
	        var text = '';
	        for (var index = startIndex; index < len; index++) {
	            var currentChar = formula.charAt(index);
	            if (currentChar === escapeSign) {
	                text += currentChar;
	                index++;
	                currentChar = formula.charAt(index);
	            }
	            if (currentChar === startSign) {
	                text += currentChar;
	                startSignCount++;
	            } else if (currentChar === endSign) {
	                startSignCount--;
	                if (startSignCount !== 0) {
	                    text += currentChar;
	                } else {
	                    return {result: text, endIndex: index};
	                }
	            } else {
	                text += currentChar;
	            }
	        }
	        if (throwError) {
	            throw sr(noSyntax) + endSign + sr(matchSyntax) + startSign + sr(singleQuotesFullStop);
	        }
	    }

	    function readError(formula, startIndex, throwError) {
	        var len = formula.length;
	        var surplusLen = len - startIndex;
	        for (var i = 0; i < ERROR_LIST.length; i++) {
	            var err = ERROR_LIST[i];
	            var errLength = err.length;
	            if (startIndex + errLength > len) {
	                continue;
	            }
	            var errStr = formula.slice(startIndex, startIndex + errLength);
	            if (errLength <= surplusLen && (err === errStr || err === errStr.toUpperCase())) {
	                return {result: err, endIndex: startIndex + errLength - 1};
	            }
	        }
	        if (throwError) {
	            throw sr(singleQuote);
	            //+formula.slice(startIndex) + sr(isValid);
	        }
	    }

	    function getOpeatorPriority(op) {
	        if (op === '^' || op === ':') {
	            return 1;
	        } else if (op === '*' || op === '/' || op === ' ') {
	            return 2;
	        } else if (op === '+' || op === '-' || op === ',') {
	            return 3;
	        } else if (op === '&') {
	            return 4;
	        } else if (op === '||' || op === '&&') {
	            return 6;
	        } else {
	            return 5;
	        }
	    }

	    function getBinaryOperator(token) {
	        var value = token.value;
	        var Operators = CalcParser.Operators;
	        if (value === '^') {
	            return Operators.exponent;
	        } else if (value === '*') {
	            return Operators.multiply;
	        } else if (value === '/') {
	            return Operators.divide;
	        } else if (value === '+') {
	            return Operators.add;
	        } else if (value === '-') {
	            return Operators.subtract;
	        } else if (value === '&') {
	            return Operators.concatenate;
	        } else if (value === '<') {
	            return Operators.lessThan;
	        } else if (value === '=') {
	            return Operators.equal;
	        } else if (value === '>') {
	            return Operators.greaterThan;
	        } else if (value === '>=') {
	            return Operators.greaterThanOrEqual;
	        } else if (value === '<=') {
	            return Operators.lessThanOrEqual;
	        } else if (value === '<>') {
	            return Operators.notEqual;
	        } else if (value === '&&') {
	            return Operators.and;
	        } else if (value === '||') {
	            return Operators.or;
	        }
	        return Operators.add;
	    }

	    function getProperty(obj, name, fallback) {
	        return (obj && obj.hasOwnProperty(name)) ? obj[name] : fallback;
	    }

	    function compareStringIgnoreCase(s1, s2) {
	        if ((s1 === KEYWORD_UNDEFINED || s1 === KEYWORD_NULL) && (s2 === KEYWORD_UNDEFINED || s2 === KEYWORD_NULL)) {
	            return true;
	        }
	        if (((s1 === KEYWORD_UNDEFINED || s1 === KEYWORD_NULL) && (s2 !== KEYWORD_UNDEFINED && s2 !== KEYWORD_NULL)) || ((s1 !== KEYWORD_UNDEFINED && s1 !== KEYWORD_NULL) && (s2 === KEYWORD_UNDEFINED || s2 === KEYWORD_NULL))) {
	            return false;
	        }
	        return s1.toLowerCase() === s2.toLowerCase();
	    }

	    (function(Operators) {
	        var Operator = (function() {
	            /**
	             * Represents an operator. This is a base class.
	             * @class
	             * @param {string} name The name of the operator.
	             */
	            function Operator(name) {
	                this.name = name;
	            }

	            /**
	             * Gets the name of the operator.
	             * @returns {string} The name of the operator.
	             */
	            Operator.prototype.getName = function() {
	                return this.name;
	            };

	            /**
	             * Tests whether two operator structures are different.
	             * @returns {boolean} <c>true</c> if the operators are the same; otherwise, <c>false</c>.
	             */
	            Operator.prototype.compareTo = function(other) {
	                return compareStringIgnoreCase(this.name, other.name);
	            };

	            Operator.prototype.toString = function() {
	                return this.getName();
	            };
	            return Operator;
	        })();
	        Operators.Operator = Operator;

	        //<editor-fold desc='UnaryOperator'>
	        var UnaryOperator = (function(_super) {
	            /**
	             * Returns the result of the operator applied to the operand.
	             * @class
	             * @param {string} name Represents the operator name.
	             */
	            function UnaryOperator_(name) {
	                _super.call(this, name);
	            }
	            Calc.__extends(UnaryOperator_, _super);

	            UnaryOperator_.prototype._evaluateSingle = function(operand, context) { // jshint ignore:line
	            };
	            /**
	             * Returns the result of the operator applied to the operand.
	             * @param {object} operand The operand for the operator evaluation.
	             * @param {object} context The context associated with the operator evaluation.
	             * @returns {object} The result of the operator applied to the operand.
	             */
	            UnaryOperator_.prototype.evaluate = function(operand, context) { // jshint ignore:line
	                var self = this;
	                var operandValue = operand;
	                if (operandValue instanceof Calc.CalcColumnReference || operandValue instanceof  Calc.CalcFieldReference) {
	                    operandValue = operandValue.getValue(context.getCurrentRow(), context.groupPath);
	                }
	                if (_.isArray(operandValue)) {
	                    return _.map(operandValue, function(value) {
	                        return self._evaluateSingle(value, context);
	                    });
	                } else {
	                    return self._evaluateSingle(operandValue, context);
	                }
	            };
	            return UnaryOperator_;
	        })(Operator);
	        Operators.UnaryOperator = UnaryOperator;

	        Operators.plus = new UnaryOperator('+');
	        Operators.plus._evaluateSingle = function(operand, context) { // jshint ignore:line
	            if (operand === KEYWORD_UNDEFINED || operand === KEYWORD_NULL) {
	                return 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(operand, doubleLeft)) {
	                // cylj fix the bug 69442, return the string direct as excel.
	                if (typeof operand === 'string') {
	                    return operand;
	                }
	                return Calc.CalcErrorsValue;
	            }
	            return Calc.Convert.D(doubleLeft.value);
	        };

	        Operators.negate = new UnaryOperator('-');
	        Operators.negate._evaluateSingle = function(operand, context) { // jshint ignore:line
	            if (operand === KEYWORD_UNDEFINED || operand === KEYWORD_NULL) {
	                return 0;
	            }
	            var doubleValue = {value: 0};
	            if (!Calc.Convert.rD(operand, doubleValue)) {
	                return Calc.CalcErrorsValue;
	            }
	            return -doubleValue.value;
	        };

	        Operators.percent = new UnaryOperator('%');
	        Operators.percent._evaluateSingle = function(operand, context) { // jshint ignore:line
	            if (operand === KEYWORD_UNDEFINED || operand === KEYWORD_NULL) {
	                return 0;
	            }
	            var doubleValue = {value: 0};
	            if (!Calc.Convert.rD(operand, doubleValue)) {
	                return Calc.CalcErrorsValue;
	            }
	            return doubleValue.value / 100;
	        };

	        //</editor-fold>
	        //<editor-fold desc='BinaryOperator'>
	        function _approxEqual(x, y) {
	            if (x === y) {
	                return true;
	            }
	            return MATH_ABS(x - y) < MATH_ABS(x) / (16777216.0 * 16777216.0);
	        }

	        var BinaryOperator = (function(_super) {
	            /**
	             * Represents a binary operator.
	             * @class
	             * @param {string} name The name of the operator.
	             * @param {boolean} acceptsReference Determines whether the operator accepts reference values for the specified operand.
	             */
	            function BinaryOperator_(name, acceptsReference) {
	                _super.call(this, name);
	                this.acceptsReference = acceptsReference;
	            }
	            Calc.__extends(BinaryOperator_, _super);

	            BinaryOperator_.prototype._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            };

	            /**
	             * Returns the result of the operator applied to the operands.
	             * @param {object} left The left operand.
	             * @param {object} right The right operand.
	             * @param {object} context The context associated with the operator evaluation.
	             * @returns {object} Result of the operator applied to the operands.
	             */
	            BinaryOperator_.prototype.evaluate = function(left, right, context) {
	                var self = this;
	                var leftValue;
	                if (left instanceof Calc.CalcColumnReference || left instanceof Calc.CalcFieldReference) {
	                    leftValue = left.getValue(context.getCurrentRow(), context.groupPath);
	                } else {
	                    leftValue = left;
	                }
	                var rightValue;
	                if (right instanceof Calc.CalcColumnReference || right instanceof Calc.CalcFieldReference) {
	                    rightValue = right.getValue(context.getCurrentRow(), context.groupPath);
	                } else {
	                    rightValue = right;
	                }
	                var leftArray = _.isArray(leftValue);
	                var rightArray = _.isArray(rightValue);
	                if (leftArray && rightArray && leftValue.length === rightValue.length) {
	                    return _.map(leftValue, function(value, index) {
	                        return self._evaluateSingle(value, rightValue[index], context);
	                    });
	                } else if (!leftArray && !rightArray) {
	                    return self._evaluateSingle(leftValue, rightValue, context);
	                } else if (leftArray) {
	                    return _.map(leftValue, function(value) {
	                        return self._evaluateSingle(value, rightValue, context);
	                    });
	                } else if (rightArray) {
	                    return _.map(rightValue, function(value) {
	                        return self._evaluateSingle(leftValue, value, context);
	                    });
	                }
	            };
	            return BinaryOperator_;
	        })(Operator);
	        Operators.BinaryOperator = BinaryOperator;

	        Operators.add = new BinaryOperator('+', false);
	        Operators.add._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(left, doubleLeft)) {
	                return Calc.CalcErrorsValue;
	            }
	            var doubleRight = {value: 0};
	            if (!Calc.Convert.rD(right, doubleRight)) {
	                return Calc.CalcErrorsValue;
	            }
	            return doubleLeft.value + doubleRight.value;
	        };

	        Operators.subtract = new BinaryOperator('-', false);
	        Operators.subtract._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(left, doubleLeft)) {
	                return Calc.CalcErrorsValue;
	            }
	            var doubleRight = {value: 0};
	            if (!Calc.Convert.rD(right, doubleRight)) {
	                return Calc.CalcErrorsValue;
	            }
	            return doubleLeft.value - doubleRight.value;
	        };

	        Operators.multiply = new BinaryOperator('*', false);
	        Operators.multiply._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(left, doubleLeft)) {
	                return Calc.CalcErrorsValue;
	            }
	            var doubleRight = {value: 0};
	            if (!Calc.Convert.rD(right, doubleRight)) {
	                return Calc.CalcErrorsValue;
	            }
	            return doubleLeft.value * doubleRight.value;
	        };

	        Operators.divide = new BinaryOperator('/', false);
	        Operators.divide._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL || right === '' || right === 0) {
	                return Calc.CalcErrorsDivideByZero;
	            }
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(left, doubleLeft)) {
	                return Calc.CalcErrorsValue;
	            }
	            var doubleRight = {value: 0};
	            if (!Calc.Convert.rD(right, doubleRight)) {
	                return Calc.CalcErrorsValue;
	            }

	            if (doubleRight.value === 0) {
	                return Calc.CalcErrorsDivideByZero;
	            }
	            return doubleLeft.value / doubleRight.value;
	        };

	        Operators.exponent = new BinaryOperator('^', false);
	        Operators.exponent._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            var doubleLeft = {value: 0};
	            if (!Calc.Convert.rD(left, doubleLeft)) {
	                return Calc.CalcErrorsValue;
	            }
	            left = doubleLeft.value;
	            var doubleRight = {value: 0};
	            if (!Calc.Convert.rD(right, doubleRight)) {
	                return Calc.CalcErrorsValue;
	            }
	            right = doubleRight.value;
	            if (left === 0.0 && right < 0) {
	                return Calc.CalcErrorsDivideByZero;
	            }
	            return MATH_POW(left, right);
	        };

	        Operators.concatenate = new BinaryOperator('&', false);
	        Operators.concatenate._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = '';
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = '';
	            }
	            return left.toString() + right.toString();
	        };

	        Operators.and = new BinaryOperator('&&', false);
	        Operators.and._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            return (!!left) && (!!right);
	        };

	        Operators.or = new BinaryOperator('||', false);
	        Operators.or._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            return (!!left) || (!!right);
	        };

	        Operators.equal = new BinaryOperator('=', false);
	        Operators.equal._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                if (typeof right === CONST_STRING) {
	                    left = '';
	                } else {
	                    left = 0;
	                }
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                if (typeof left === CONST_STRING) {
	                    right = '';
	                } else {
	                    right = 0;
	                }
	            }
	            if (typeof left === CONST_STRING || typeof right === CONST_STRING) {
	                return left.toString().toUpperCase() === right.toString().toUpperCase();
	            } else {
	                var doubleLeft = {value: 0};
	                if (!Calc.Convert.rD(left, doubleLeft)) {
	                    return Calc.CalcErrorsValue;
	                }
	                left = doubleLeft.value;
	                var doubleRight = {value: 0};
	                if (!Calc.Convert.rD(right, doubleRight)) {
	                    return Calc.CalcErrorsValue;
	                }
	                right = doubleRight.value;
	                var x = left;
	                var y = right;
	                return _approxEqual(x, y);
	            }
	        };

	        Operators.notEqual = new BinaryOperator('<>', false);
	        Operators.notEqual._evaluateSingle = function(left, right, context) {
	            var value = Operators.equal._evaluateSingle.call(this, left, right, context);
	            if (typeof value === CONST_BOOLEAN) {
	                return !value;
	            }
	            return value;
	        };

	        Operators.lessThan = new BinaryOperator('<', false);
	        Operators.lessThan._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            if (typeof left === CONST_STRING || typeof right === CONST_STRING) {
	                return left.toString().toUpperCase() < right.toString().toUpperCase();
	            } else {
	                var doubleLeft = {value: 0};
	                if (!Calc.Convert.rD(left, doubleLeft)) {
	                    return Calc.CalcErrorsValue;
	                }
	                left = doubleLeft.value;
	                var doubleRight = {value: 0};
	                if (!Calc.Convert.rD(right, doubleRight)) {
	                    return Calc.CalcErrorsValue;
	                }
	                right = doubleRight.value;
	                var x = left;
	                var y = right;
	                return x < y && !_approxEqual(x, y);
	            }
	        };

	        Operators.greaterThan = new BinaryOperator('>', false);
	        Operators.greaterThan._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            if (typeof left === CONST_STRING || typeof right === CONST_STRING) {
	                return left.toString().toUpperCase() > right.toString().toUpperCase();
	            } else {
	                var doubleLeft = {value: 0};
	                if (!Calc.Convert.rD(left, doubleLeft)) {
	                    return Calc.CalcErrorsValue;
	                }
	                left = doubleLeft.value;
	                var doubleRight = {value: 0};
	                if (!Calc.Convert.rD(right, doubleRight)) {
	                    return Calc.CalcErrorsValue;
	                }
	                right = doubleRight.value;
	                var x = left;
	                var y = right;
	                return x > y && !_approxEqual(x, y);
	            }
	        };

	        Operators.lessThanOrEqual = new BinaryOperator('<=', false);
	        Operators.lessThanOrEqual._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            if (typeof left === CONST_STRING || typeof right === CONST_STRING) {
	                return left.toString().toUpperCase() <= right.toString().toUpperCase();
	            } else {
	                var doubleLeft = {value: 0};
	                if (!Calc.Convert.rD(left, doubleLeft)) {
	                    return Calc.CalcErrorsValue;
	                }
	                left = doubleLeft.value;
	                var doubleRight = {value: 0};
	                if (!Calc.Convert.rD(right, doubleRight)) {
	                    return Calc.CalcErrorsValue;
	                }
	                right = doubleRight.value;
	                var x = left;
	                var y = right;
	                return x < y || _approxEqual(x, y);
	            }
	        };

	        Operators.greaterThanOrEqual = new BinaryOperator('>=', false);
	        Operators.greaterThanOrEqual._evaluateSingle = function(left, right, context) { // jshint ignore:line
	            if (Calc.Convert.err(left)) {
	                return left;
	            }
	            if (Calc.Convert.err(right)) {
	                return right;
	            }
	            if (left === KEYWORD_UNDEFINED || left === KEYWORD_NULL) {
	                left = 0;
	            }
	            if (right === KEYWORD_UNDEFINED || right === KEYWORD_NULL) {
	                right = 0;
	            }
	            if (typeof left === CONST_STRING || typeof right === CONST_STRING) {
	                return left.toString().toUpperCase() >= right.toString().toUpperCase();
	            } else {
	                var doubleLeft = {value: 0};
	                if (!Calc.Convert.rD(left, doubleLeft)) {
	                    return Calc.CalcErrorsValue;
	                }
	                left = doubleLeft.value;
	                var doubleRight = {value: 0};
	                if (!Calc.Convert.rD(right, doubleRight)) {
	                    return Calc.CalcErrorsValue;
	                }
	                right = doubleRight.value;
	                var x = left;
	                var y = right;
	                return x > y || _approxEqual(x, y);
	            }
	        };

	    })(CalcParser.Operators || (CalcParser.Operators = {}));

	})();


/***/ },
/* 4 */
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

	(function() {
	    'use strict';
	    var Calc = __webpack_require__(1);

	    var CalcExpressions = {};
	    module.exports = CalcExpressions;

	    var CONST_UNDEFINED = 'undefined'; // jshint ignore:line
	    var CONST_NUMBER = 'number'; // jshint ignore:line
	    var CONST_STRING = 'string';
	    var CONST_BOOLEAN = 'boolean'; // jshint ignore:line
	    var CONST_TRUE = 'TRUE'; // jshint ignore:line
	    var CONST_FALSE = 'FALSE'; // jshint ignore:line
	    var CONST_ARRAY = 'ARRAY'; // jshint ignore:line
	    var CONST_ARRAYROW = 'ARRAYROW'; // jshint ignore:line
	    var CONST_NULL = '#NULL!';
	    var CONST_DIV0 = '#DIV/0!';
	    var CONST_VALUE = '#VALUE!';
	    var CONST_REF = '#REF!';
	    var CONST_NAME = '#NAME?';
	    var CONST_NA = '#N/A';
	    var CONST_NUM = '#NUM!';
	    var CONST_EXPR = 'expr'; // jshint ignore:line
	    var CONST_ARRAYINFO = 'arrayInfo'; // jshint ignore:line
	    var CONST_WORKINGEXPR = 'workingExpr'; // jshint ignore:line
	    var ERROR_LIST = [CONST_NULL, CONST_DIV0, CONST_VALUE, CONST_REF, CONST_NAME, CONST_NA, CONST_NUM]; // jshint ignore:line
	    var ERRORCODE_LIST = [0x00, 0x07, 0x0F, 0x17, 0x1D, 0x2A, 0x24]; // jshint ignore:line
	    var LETTER_POWS = [1, 26, 676]; // jshint ignore:line
	    var KEYWORD_NULL = null;
	    var KEYWORD_UNDEFINED = undefined; // jshint ignore:line
	    var SUPPORT_ROW_COLUMN_FORMULA = false; // jshint ignore:line
	    var MATH_MIN = Math.min; // jshint ignore:line
	    var MATH_MAX = Math.max; // jshint ignore:line
	    var MATH_ABS = Math.abs; // jshint ignore:line
	    var MATH_POW = Math.pow; // jshint ignore:line

	    (function(ExpressionType) {
	        ExpressionType[ExpressionType.Double = 0] = 'Double';
	        ExpressionType[ExpressionType.String = 1] = 'String';
	        ExpressionType[ExpressionType.Boolean = 2] = 'Boolean';
	        ExpressionType[ExpressionType.Function = 3] = 'Function';
	        ExpressionType[ExpressionType.BinaryOperator = 4] = 'BinaryOperator';
	        ExpressionType[ExpressionType.UnaryOperator = 5] = 'UnaryOperator';
	        ExpressionType[ExpressionType.Error = 6] = 'Error';
	        ExpressionType[ExpressionType.ExternalError = 7] = 'ExternalError';
	        ExpressionType[ExpressionType.Parentheses = 8] = 'Parentheses';
	        ExpressionType[ExpressionType.Array = 9] = 'Array';
	        ExpressionType[ExpressionType.StructReference = 10] = 'StructReference';
	        ExpressionType[ExpressionType.SheetRangeError = 11] = 'SheetRangeError';
	        ExpressionType[ExpressionType.MissingArgument = 12] = 'MissingArgument';
	    })(CalcExpressions.ExpressionType || (CalcExpressions.ExpressionType = {}));
	    var ExpressionType = CalcExpressions.ExpressionType; // jshint ignore:line

	    (function(Expressions) {
	        var Expression = (function() {
	            /**
	             * Provides the base class from which the classes that represent expression tree nodes are derived. This is an abstract class.
	             * @class
	             */
	            function Expression() {
	            }

	            return Expression;
	        })();
	        Expressions.Expression = Expression;

	        var ParenthesesExpression = (function(_super) {
	            /**
	             * Represents an expression type for parentheses surrounding a specified expression.
	             * @extends $.wijmo.wijspread.Calc.Expressions.Expression
	             * @class
	             * @param {object} arg The expression inside the parentheses.
	             */
	            function ParenthesesExpression_(arg) {
	                _super.call(this);
	                this.argument = arg;
	                this.t = 8 /* Parentheses */;
	            }

	            Calc.__extends(ParenthesesExpression_, _super);
	            return ParenthesesExpression_;
	        })(Expression);
	        Expressions.ParenthesesExpression = ParenthesesExpression;

	        var FunctionExpression = (function(_super) {
	            /**
	             * Represents an expression with a function applied to a list of parameters as the expression.
	             * @extends $.wijmo.wijspread.Calc.Expressions.Expression
	             * @class
	             * @param {object} fn The name of the function.
	             * @param {object[]} args The list of parameters.
	             */
	            function FunctionExpression_(fn, args) {
	                _super.call(this);
	                this.fn = fn;
	                this.args = args;
	                this.t = 3 /* Function */;
	            }
	            Calc.__extends(FunctionExpression_, _super);

	            /**
	             * Gets the number of parameters being passed to the function.
	             * @returns {number} The number of parameters.
	             */
	            FunctionExpression_.prototype.argCount = function() {
	                return this.args ? this.args.length : 0;
	            };

	            /**
	             * Returns the specified parameter being passed to the function.
	             * @param {number} index The index of the parameter (or argument).
	             * @returns {object} The specified parameter.
	             */
	            FunctionExpression_.prototype.getArg = function(index) {
	                return this.args ? this.args[index] : KEYWORD_NULL;
	            };

	            /**
	             * Gets the name of the function.
	             * @returns {string} The name of the function.
	             */
	            FunctionExpression_.prototype.getFunctionName = function() {
	                var self = this;
	                return typeof (self.fn) === CONST_STRING ? self.fn : self.fn.name;
	            };

	            return FunctionExpression_;
	        })(Expression);
	        Expressions.FunctionExpression = FunctionExpression;

	        var ConstantExpression = (function(_super) {
	            /**
	             * Represents an expression that has a constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.Expression
	             * @class
	             * @param {object} value The constant value.
	             */
	            function ConstantExpression_(value) {
	                _super.call(this);
	                this.value = value;
	            }
	            Calc.__extends(ConstantExpression_, _super);

	            return ConstantExpression_;
	        })(Expression);
	        Expressions.ConstantExpression = ConstantExpression;

	        var BooleanExpression = (function(_super) {
	            /**
	             * Represents a boolean constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ConstantExpression
	             * @class
	             * @param {boolean} boolValue The boolean value.
	             */
	            function BooleanExpression_(value) {
	                _super.call(this, value);
	                this.t = 2 /* Boolean */;
	            }
	            Calc.__extends(BooleanExpression_, _super);

	            return BooleanExpression_;
	        })(ConstantExpression);
	        Expressions.BooleanExpression = BooleanExpression;

	        var DoubleExpression = (function(_super) {
	            /**
	             * Represents a double constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ConstantExpression
	             * @class
	             * @param {number} value The double value.
	             * @param {string} originalNumAsString The original string of the number.
	             */
	            function DoubleExpression_(value, originalNumAsString) {
	                _super.call(this, value);
	                this.originalValue = originalNumAsString;
	                this.t = 0 /* Double */;
	            }
	            Calc.__extends(DoubleExpression_, _super);

	            return DoubleExpression_;
	        })(ConstantExpression);
	        Expressions.DoubleExpression = DoubleExpression;

	        var StringExpression = (function(_super) {
	            /**
	             * Represents a string constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ConstantExpression
	             * @class
	             * @param {string} value The string value.
	             */
	            function StringExpression_(value) {
	                _super.call(this, value);
	                this.t = 1 /* String */;
	            }
	            Calc.__extends(StringExpression_, _super);

	            return StringExpression_;
	        })(ConstantExpression);
	        Expressions.StringExpression = StringExpression;

	        var ErrorExpression = (function(_super) {
	            /**
	             * Represents an error constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ConstantExpression
	             * @class
	             * @param {$.wijmo.wijspread.Calc.Error} value The error value.
	             */
	            function ErrorExpression_(value) {
	                _super.call(this, value);
	                this.t = 6 /* Error */;
	            }
	            Calc.__extends(ErrorExpression_, _super);

	            return ErrorExpression_;
	        })(ConstantExpression);
	        Expressions.ErrorExpression = ErrorExpression;

	        var ExternalErrorExpression = (function(_super) {
	            /**
	             * Represents an external error value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ErrorExpression
	             * @class
	             * @param {object} source The owner of the error.
	             * @param {$.wijmo.wijspread.Calc.Error} value The error value.
	             */
	            function ExternalErrorExpression_(source, value) {
	                _super.call(this, value);
	                this.source = source;
	                this.t = 7 /* ExternalError */;
	            }
	            Calc.__extends(ExternalErrorExpression_, _super);

	            return ExternalErrorExpression_;
	        })(ErrorExpression);
	        Expressions.ExternalErrorExpression = ExternalErrorExpression;

	        var MissingArgumentExpression = (function(_super) {
	            /**
	             * Represents a missing argument constant value.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ConstantExpression
	             * @class
	             */
	            function MissingArgumentExpression_() {
	                _super.call(this, Calc.missingArgument);
	                this.t = 12 /* MissingArgument */;
	            }
	            Calc.__extends(MissingArgumentExpression_, _super);

	            return MissingArgumentExpression_;
	        })(ConstantExpression);
	        Expressions.MissingArgumentExpression = MissingArgumentExpression;

	        var OperatorExpression = (function(_super) {
	            /**
	             * Represents an operator expression. This is an abstract class.
	             * @extends $.wijmo.wijspread.Calc.Expressions.Expression
	             * @class
	             * @param {object} operator The operator.
	             */
	            function OperatorExpression_(operator) {
	                _super.call(this);
	                this.operator = operator;
	            }
	            Calc.__extends(OperatorExpression_, _super);

	            return OperatorExpression_;
	        })(Expression);
	        Expressions.OperatorExpression = OperatorExpression;

	        var UnaryOperatorExpression = (function(_super) {
	            /**
	             * Represents an expression that has a unary operator.
	             * @extends $.wijmo.wijspread.Calc.Expressions.OperatorExpression
	             * @class
	             * @param {object} operator The unary operator.
	             * @param {object} operand The operand.
	             */
	            function UnaryOperatorExpression_(operator, operand) {
	                _super.call(this, operator);
	                this.operand = operand;
	                this.t = 5 /* UnaryOperator */;
	            }
	            Calc.__extends(UnaryOperatorExpression_, _super);

	            return UnaryOperatorExpression_;
	        })(OperatorExpression);
	        Expressions.UnaryOperatorExpression = UnaryOperatorExpression;

	        var BinaryOperatorExpression = (function(_super) {
	            /**
	             * Represents an expression that has a binary operator.
	             * @extends $.wijmo.wijspread.Calc.Expressions.OperatorExpression
	             * @class
	             * @param {object} operator The binary operator.
	             * @param {object} left The left operand.
	             * @param {object} right The right operand.
	             */
	            function BinaryOperatorExpression_(operator, left, right) {
	                _super.call(this, operator);
	                this.left = left;
	                this.right = right;
	                this.t = 4 /* BinaryOperator */;
	            }
	            Calc.__extends(BinaryOperatorExpression_, _super);

	            return BinaryOperatorExpression_;
	        })(OperatorExpression);
	        Expressions.BinaryOperatorExpression = BinaryOperatorExpression;

	        var StructReferenceExpression = (function(_super) {
	            /**
	             * Represents a struct reference expression.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ReferenceExpression
	             * @class
	             * @param {string} structRef The struct reference string.
	             */
	            function StructReferenceExpression_(table, column) {
	                var self = this;
	                self.table = table;
	                self.column = column;
	            }
	            Calc.__extends(StructReferenceExpression_, _super);

	            return StructReferenceExpression_;
	        })(Expression);
	        Expressions.StructReferenceExpression = StructReferenceExpression;

	        var FieldReferenceExpression = (function(_super) {
	            /**
	             * Represents a struct reference expression.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ReferenceExpression
	             * @class
	             * @param {string} structRef The struct reference string.
	             */
	            function FieldReferenceExpression_(name) {
	                var self = this;
	                self.name = name;
	            }
	            Calc.__extends(FieldReferenceExpression_, _super);

	            return FieldReferenceExpression_;
	        })(Expression);
	        Expressions.FieldReferenceExpression = FieldReferenceExpression;

	        var UnknownReferenceExpression = (function(_super) {
	            /**
	             * Represents a struct reference expression.
	             * @extends $.wijmo.wijspread.Calc.Expressions.ReferenceExpression
	             * @class
	             * @param {string} structRef The struct reference string.
	             */
	            function UnknownReferenceExpression_(name) {
	                var self = this;
	                self.name = name;
	            }
	            Calc.__extends(UnknownReferenceExpression_, _super);

	            return UnknownReferenceExpression_;
	        })(Expression);
	        Expressions.UnknownReferenceExpression = UnknownReferenceExpression;

	    })(CalcExpressions || (CalcExpressions = {}));
	})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';

	    var CONST_UNDEFINED = 'undefined';// jshint ignore:line
	    var CONST_NUMBER = 'number';// jshint ignore:line
	    var CONST_STRING = 'string';// jshint ignore:line
	    var CONST_BOOLEAN = 'boolean';// jshint ignore:line
	    var CONST_TRUE = 'TRUE';// jshint ignore:line
	    var CONST_FALSE = 'FALSE';// jshint ignore:line
	    var CONST_ARRAY = 'ARRAY';// jshint ignore:line
	    var CONST_ARRAYROW = 'ARRAYROW';// jshint ignore:line
	    var CONST_NULL = '#NULL!';
	    var CONST_DIV0 = '#DIV/0!';
	    var CONST_VALUE = '#VALUE!';
	    var CONST_REF = '#REF!';
	    var CONST_NAME = '#NAME?';
	    var CONST_NA = '#N/A';
	    var CONST_NUM = '#NUM!';
	    var CONST_EXPR = 'expr';// jshint ignore:line
	    var CONST_ARRAYINFO = 'arrayInfo';// jshint ignore:line
	    var CONST_WORKINGEXPR = 'workingExpr';// jshint ignore:line
	    var ERROR_LIST = [CONST_NULL, CONST_DIV0, CONST_VALUE, CONST_REF, CONST_NAME, CONST_NA, CONST_NUM];// jshint ignore:line
	    var ERRORCODE_LIST = [0x00, 0x07, 0x0F, 0x17, 0x1D, 0x2A, 0x24];// jshint ignore:line
	    var LETTER_POWS = [1, 26, 676];// jshint ignore:line
	    var KEYWORD_NULL = null;
	    var KEYWORD_UNDEFINED = undefined;// jshint ignore:line
	    var SUPPROT_ROW_COLUMN_FORMULA = false;// jshint ignore:line
	    var MATH_MIN = Math.min;// jshint ignore:line
	    var MATH_MAX = Math.max;// jshint ignore:line
	    var MATH_ABS = Math.abs;// jshint ignore:line
	    var MATH_POW = Math.pow;// jshint ignore:line

	    var Calc = __webpack_require__(1);
	    var CalcExpressions = __webpack_require__(4);
	    var CalcParser = __webpack_require__(3);
	    var CalcHelper = __webpack_require__(6);
	    var CalcFunctions = __webpack_require__(11);

	    var throwSR = Calc.SRHelper.throwSR;

	    var defaultParser = new CalcParser.Parser();

	    var Evaluator = (function() {
	        function Evaluator() {
	        }

	        Evaluator.prototype.evaluateFormula = function(formula, parserContext, evaluatorContext) {
	            var expr = defaultParser.parse(formula, parserContext);
	            return this.evaluateExpression(expr, evaluatorContext);
	        };

	        /**
	         * Evaluates an expression with the specified context.
	         * @param {$.wijmo.wijspread.CalcExpressions.Expression} expression The expression to be evaluated.
	         * @param {$.wijmo.wijspread.Calc.EvaluateContext} evaluatorContext The context for the evaluator to query data.
	         * @returns {object} The result of the evaluation.
	         */
	        Evaluator.prototype.evaluateExpression = function(expression, evaluatorContext) {
	            var result = this._evaluate(expression, evaluatorContext);
	            return result;
	        };
	        Evaluator.prototype._evaluate = function(expr, context) {
	            if (!expr) {
	                throwSR('Exp_ExprIsNull');
	            }
	            while (expr.t === 8 /* Parentheses */) {
	                expr = expr.argument;
	            }
	            var self = this;
	            var result;
	            if (expr instanceof CalcExpressions.ConstantExpression) {
	                result = self._evaluateConst(expr, context);
	            } else if (expr instanceof CalcExpressions.UnaryOperatorExpression /* UnaryOperator */) {
	                result = self._evaluateUnaryOperation(expr, context);
	            } else if (expr instanceof CalcExpressions.BinaryOperatorExpression /* BinaryOperator */) {
	                result = self._evaluateBinaryOperation(expr, context);
	            } else if (expr instanceof CalcExpressions.FunctionExpression /* Function */) {
	                if (expr.fn.isCalculate()) {
	                    result = self._evaluateCalculateFunction(expr, context);
	                } else if (expr.fn.isSummarize()) {
	                    result = self._evaluateSummarizeFunction(expr, context);
	                } else {
	                    result = self._evaluateFunction(expr, context);
	                }
	            } else if (expr instanceof CalcExpressions.StructReferenceExpression /* StructExpression */) {
	                result = self._evaluateStructExpression(expr, context);
	            } else if (expr instanceof CalcExpressions.FieldReferenceExpression /* FieldExpression */) {
	                result = self._evaluateFieldExpression(expr, context);
	            } else if (expr instanceof CalcExpressions.UnknownReferenceExpression /* FieldExpression */) {
	                result = self._evaluateUnknownExpression(expr, context);
	            }
	            return result;
	        };

	        Evaluator.prototype._evaluateConst = function(expr, context) { // jshint ignore:line
	            var value = expr.value;
	            return value;
	        };
	        Evaluator.prototype._evaluateUnaryOperation = function(expr, context) {
	            //var acceptsReferences = false;

	            // first evaluate the parameter, then invoke operator.
	            var arg = this._evaluate(expr.operand, context);
	            if (Calc.Convert.err(arg)) {
	                return arg;
	            }
	            if (arg === Calc.missingArgument) {
	                return Calc.CalcErrorsNotAvailable;
	            }
	            return expr.operator.evaluate(arg, context);
	        };
	        Evaluator.prototype._evaluateBinaryOperation = function(expr, context) {

	            // first evaluate arguments expressions one by one, if error found, return directly.
	            // Then invoke operator
	            var sub = [expr.left, expr.right];
	            var args = [];
	            for (var i = 0; i < 2; i++) {
	                var arg = this._evaluate(sub[i], context);
	                if (Calc.Convert.err(arg)) {
	                    return arg;
	                }
	                if (arg === Calc.missingArgument) {
	                    return Calc.CalcErrorsNotAvailable;
	                }
	                args[i] = arg;
	            }
	            return expr.operator.evaluate(args[0], args[1], context);
	        };

	        Evaluator.prototype._evaluateFunction = function(expr, context) {
	            if (!expr || !expr.fn || typeof expr.fn === 'string') {
	                return Calc.CalcErrorsName;
	            }
	            var self = this;
	            var argCount = expr.argCount();
	            var fn = expr.fn;
	            var argExprs = [];
	            var args = [];
	            var arg;
	            var i;
	            var cachedSource;
	            for (i = 0; i < argCount; i++) {
	                argExprs.push(expr.getArg(i));
	            }
	            var tableArgIndex = fn.tableArgIndex();
	            if (tableArgIndex !== -1) {
	                cachedSource = context.calcSource;
	                var filterArgs = preProcessFilterContext_.call(self, argExprs, tableArgIndex, context);
	                if (filterArgs.filterOmitted) {
	                    ++argCount;
	                }
	                args[tableArgIndex] = filterArgs.tableContextArg;
	            }

	            var isAggregator = fn.isAggregator();
	            if (isAggregator) {
	                context.beginAggregating_();
	            }
	            if (argCount !== 0) {
	                for (i = 0; i < argCount; i++) {
	                    if (i === tableArgIndex) {
	                        continue;
	                    }

	                    var argExpr = argExprs[i];
	                    arg = self._evaluate(argExpr, context);

	                    if ((Calc.Convert.err(arg)) && !fn.acceptsError(i)) {
	                        return arg;
	                    }
	                    if (arg === Calc.missingArgument) {
	                        if (!fn.acceptsMissingArgument(i)) {
	                            arg = KEYWORD_NULL;
	                        }
	                    }
	                    args[i] = arg;
	                }

	            }
	            var result = expr.fn.evaluate(args, context);
	            if (tableArgIndex !== -1 && cachedSource) {
	                context.calcSource = cachedSource;
	            }
	            if (isAggregator) {
	                context.endAggregating_();
	            }
	            return result;
	        };

	        Evaluator.prototype._evaluateCalculateFunction = function(expr, context) {
	            if (!expr || !expr.fn || typeof expr.fn === 'string') {
	                return Calc.CalcErrorsName;
	            }
	            var self = this;
	            var calcExpr = expr.getArg(0);
	            var argCount = expr.argCount();
	            var argExpr;
	            var i;
	            var result;
	            var filter;
	            var filterExprs = [];
	            var tempContext;
	            var fieldObj;
	            var columnObj;
	            var cachedSource = context.calcSource;

	            if (argCount === 1) {
	                result = self._evaluate(calcExpr, context);
	                if (CalcHelper.columnRef(result)) {
	                    result = result.getValue(context.getCurrentRow(), context.groupPath);
	                } else if (CalcHelper.fieldRef(result)) {
	                    result = result.getValue();
	                }
	                return result;
	            }
	            for (i = 1; i < argCount; i++) {
	                argExpr = expr.getArg(i);
	                filterExprs.push(argExpr);
	            }
	            _.forEach(filterExprs, function(filterExpr) {
	                if (CalcHelper.fnExpr(filterExpr) && filterExpr.fn.isTableResult()) {
	                    if (!CalcHelper.err(tempContext = self._evaluate(filterExpr, context))) {
	                        context.calcSource = tempContext.calcSource;
	                    }
	                } else {
	                    filter = CalcFunctions.findGlobalFunction('filter');
	                    filter = new CalcExpressions.FunctionExpression(filter, [filterExpr]);
	                    if (!CalcHelper.err(tempContext = self._evaluate(filter, context))) {
	                        context.calcSource = tempContext.calcSource;
	                    }
	                }
	            });
	            result = self._evaluate(calcExpr, context);
	            if (CalcHelper.columnRef(result)) {
	                columnObj = result.calcSource.findColumn(result.column);
	                if (!columnObj) {
	                    return Calc.CalcErrorsReference;
	                }
	                var row = context.getCurrentRow(false);
	                if (context.calcSource.isFilterOut(row)) {
	                    return;
	                } else {
	                    result = (columnObj.type === CalcHelper.DATA_COLUMN) ?
	                        result.getValue(row, context.groupPath) :
	                        self._evaluate(columnObj.expression, context);
	                }
	            } else if (CalcHelper.fieldRef(result)) {
	                fieldObj = result.calcSource.findCalcField(result.name);
	                argExpr = fieldObj && fieldObj.expression;
	                if (!argExpr) {
	                    return Calc.CalcErrorsReference;
	                }
	                result = self._evaluate(argExpr, context);
	            }
	            context.calcSource = cachedSource;
	            return result;
	        };

	        Evaluator.prototype._evaluateSummarizeFunction = function(expr, context) {
	            if (!expr || !expr.fn || typeof expr.fn === 'string') {
	                return Calc.CalcErrorsName;
	            }
	            var self = this;
	            var argCount = expr.argCount();
	            var fn = expr.fn;
	            var argExprs = [];
	            var args = [];
	            var i;
	            var cachedSource = context.calcSource;
	            for (i = 0; i < argCount; i++) {
	                argExprs.push(expr.getArg(i));
	            }

	            var tableArgIndex = fn.tableArgIndex();
	            var filterArgs = preProcessFilterContext_.call(self, argExprs, tableArgIndex, context);
	            if (filterArgs.filterOmitted) {
	                ++argCount;
	            }
	            args[tableArgIndex] = filterArgs.tableContextArg;

	            var isAggregator = fn.isAggregator();
	            if (isAggregator) {
	                context.beginAggregating_();
	            }

	            //get parameters:
	            var columnNames = [];
	            var newColumns = [];
	            var newExprs = [];
	            var len = argExprs.length;
	            i = 1;
	            //todo: adjust the logic to correct the case of nest summarize
	            var tempExpr;
	            while (CalcHelper.structExpr(tempExpr = argExprs[i]) && tempExpr.column && i < len) {
	                columnNames.push(tempExpr.column);
	                ++i;
	            }
	            while (CalcHelper.strExpr(tempExpr = argExprs[i]) && i < len) {
	                if (_.indexOf(columnNames, tempExpr.value) < 0) {
	                    newColumns.push(tempExpr.value);
	                    ++i;
	                } else {
	                    return Calc.CalcErrorsReference;
	                }
	                newExprs.push(argExprs[i++] || Calc.CalcErrorsReference);
	            }

	            //set group and calculate
	            var tempCalcSource = context.calcSource;
	            var tempTable = tempCalcSource.getModel(CalcHelper.CALC_TABLE);
	            var groupDesc = _.map(columnNames, function(name) {
	                return {field: name};
	            });

	            tempTable.beginUseGroup();
	            var groupTree = tempCalcSource.group(groupDesc);
	            var groupPathBackup = context.groupPath;
	            var groupPathStack = [];
	            for (i = groupTree.groups.length - 1; i >= 0; --i) {
	                groupPathStack.push([i]);
	            }
	            var currGroupPath;
	            var currGroup;
	            var isBottomLevel;
	            var result = [];
	            var tempResult;
	            var itemSample;
	            while (groupPathStack.length > 0) {
	                currGroupPath = groupPathStack.pop();
	                currGroup = getGroupByPath_(groupTree, currGroupPath);
	                context.groupPath = currGroupPath;
	                itemSample = currGroup.getItem(0);
	                isBottomLevel = currGroup.isBottomLevel;
	                if (isBottomLevel === true) {
	                    tempResult = {};
	                    for (i = 0, len = newColumns.length; i < len; ++i) {
	                        tempExpr = newExprs[i];
	                        if (CalcHelper.err(tempExpr)) {
	                            tempResult[newColumns[i]] = tempExpr;
	                        } else {
	                            tempResult[newColumns[i]] = self._evaluate(tempExpr, context);
	                        }
	                    }
	                    for (i = 0, len = columnNames.length; i < len; ++i) {
	                        tempResult[columnNames[i]] = itemSample[columnNames[i]];
	                    }
	                    result.push(tempResult);
	                } else if (currGroup.isBottomLevel === false) {
	                    for (i = currGroup.groups.length - 1; i >= 0; --i) {
	                        groupPathStack.push(currGroupPath.concat([i]));
	                    }
	                }
	            }
	            context.groupPath = groupPathBackup;
	            tempTable.endUseGroup();
	            if (tableArgIndex !== -1 && cachedSource) {
	                context.calcSource = cachedSource;
	            }
	            if (isAggregator) {
	                context.endAggregating_();
	            }
	            return new Calc.CalcTableReference(context.calcSource.create('summarizedTable', result));
	        };

	        function preProcessFilterContext_(argExprs, tableArgIndex, context) {
	            var self = this;
	            var tableContextArg;
	            var tableContextExpr = argExprs[tableArgIndex];
	            var calcSource = context.calcSource;
	            var filterOmitted = false;
	            if (CalcHelper.structExpr(tableContextExpr) && !tableContextExpr.column) {
	                if (tableContextExpr.table === calcSource.name) {
	                    tableContextArg = self._evaluate(tableContextExpr, context);
	                } else {
	                    return Calc.CalcErrorsReference;
	                }
	            } else if (CalcHelper.strExpr(tableContextExpr)) {
	                if (tableContextExpr.value === calcSource.name) {
	                    tableContextArg = new Calc.CalcTableReference(calcSource);
	                } else {
	                    return Calc.CalcErrorsReference;
	                }
	            } else if (CalcHelper.fnExpr(tableContextExpr) && tableContextExpr.fn.isTableResult()) {
	                tableContextArg = self._evaluate(tableContextExpr, context);
	            } else {
	                tableContextArg = new Calc.CalcTableReference(calcSource);
	                argExprs.splice(tableArgIndex, 0, null);
	                filterOmitted = true;
	            }
	            if (CalcHelper.err(tableContextArg)) {
	                return Calc.CalcErrorsReference;
	            }
	            if (CalcHelper.tabRef(tableContextArg)) {
	                context.calcSource = tableContextArg.calcSource;
	            }
	            //else if(_.isArray(tableContextArg)){ // like SUMX([price] > 100,[count] * [price]), it has no filter/table, just array of filter results
	            //    var tmpSource = cachedSource.clone();
	            //    tmpSource.setFilterStates(tableContextArg);
	            //    context.calcSource = tmpSource;
	            //}
	            return {
	                filterOmitted: filterOmitted,
	                tableContextArg: tableContextArg
	            };
	        }

	        function getGroupByPath_(group, path) {
	            var i;
	            var len;
	            var currentGroup = group.groups[path[0]];
	            for (i = 1, len = path.length; i < len; i++) {
	                currentGroup = currentGroup.groups[path[i]];
	            }
	            return currentGroup;
	        }

	        Evaluator.prototype._evaluateStructExpression = function(expr, context) {
	            if (expr.table && expr.column) {
	                return new Calc.CalcColumnReference(context.calcSource, expr.column);
	            } else if (expr.table) {
	                return new Calc.CalcTableReference(context.calcSource, expr.table);
	            }
	        };

	        Evaluator.prototype._evaluateFieldExpression = function(expr, context) {
	            return new Calc.CalcFieldReference(context.calcSource, expr.name);
	        };

	        Evaluator.prototype._evaluateUnknownExpression = function(expr, context) {
	            if (context.calcSource.findColumn(expr.name)) {
	                return new Calc.CalcColumnReference(context.calcSource, expr.name);
	            } else if (context.calcSource.findCalcField(expr.name)) {
	                return new Calc.CalcFieldReference(context.calcSource, expr.name);
	            }
	            return Calc.CalcErrorsReference;
	        };

	        Evaluator.prototype._evaluateWithArgs = function(expr, evaluateDelegate, context, args) {
	            return evaluateDelegate(args, context);
	        };
	        return Evaluator;
	    })();

	    module.exports = Evaluator;
	})();


/***/ },
/* 6 */
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

	(function() {
	    'use strict';
	    var Calc = __webpack_require__(1);
	    var CalcExpressions = __webpack_require__(4);
	    var CalcFunctions = __webpack_require__(11);

	    var CalcHelper = (function() {
	        function CalcHelper() {

	        }

	        CalcHelper.DATA_COLUMN = 'DataCol';
	        CalcHelper.CALC_COLUMN = 'CalcCol';
	        CalcHelper.EXTERNAL_COLUMN = 'ExternalCol';
	        CalcHelper.CALC_FIELD = 'CalcField';
	        CalcHelper.CALC_G_FIELD = 'CalcGField';
	        CalcHelper.CALC_TABLE = 'CalcTable';

	        CalcHelper.resolveDepends = function(expression, calcSource) {
	            var depExprList = [];
	            resolveExpressions_(expression, null, depExprList);
	            if (depExprList.length === 0) {
	                return null;
	            }
	            return _.map(depExprList, function(depExpr) {
	                var expr = depExpr.expr;
	                var aggContext = depExpr.aggContext;
	                if (CalcHelper.structExpr(expr)) {
	                    var column = expr.column;
	                    if (column) {
	                        var type = null;
	                        var colObj = calcSource.findColumn(column);
	                        if (colObj) {
	                            type = colObj.type;
	                        } else {
	                            type = CalcHelper.EXTERNAL_COLUMN;
	                        }
	                        //if(calcSource.findDataColumn(column)){
	                        //    type = CalcHelper.DATA_COLUMN;
	                        //}else if(calcSource.findCalcColumn(column)) {
	                        //    type = CalcHelper.CALC_COLUMN;
	                        //}else {
	                        //    type = CalcHelper.EXTERNAL_COLUMN;
	                        //}
	                        return {
	                            type: type,
	                            table: expr.table,
	                            column: column,
	                            aggContext: aggContext
	                        };
	                    } else {
	                        return {
	                            type: 'table',
	                            table: expr.table
	                        };
	                    }
	                } else if (CalcHelper.fieldExpr(expr)) {
	                    var name = expr.name;
	                    if (name) {
	                        return {type: CalcHelper.CALC_FIELD, name: name};
	                    } else {
	                        return null;
	                    }
	                }
	            });
	        };

	        CalcHelper.structExpr = function(expr) {
	            return expr instanceof CalcExpressions.StructReferenceExpression;
	        };

	        CalcHelper.fnExpr = function(expr) {
	            return expr instanceof CalcExpressions.FunctionExpression;
	        };

	        CalcHelper.fieldExpr = function(expr) {
	            return expr instanceof CalcExpressions.FieldReferenceExpression;
	        };

	        CalcHelper.binaryExpr = function(expr) {
	            return expr instanceof CalcExpressions.BinaryOperatorExpression;
	        };

	        CalcHelper.tableContextFn = function(fn) {
	            return fn.tableArgIndex() !== -1;
	        };

	        CalcHelper.filterFn = function(expr) {
	            return expr instanceof CalcExpressions.FunctionExpression && expr.fn instanceof CalcFunctions.Function && expr.fn.isFilter();
	        };

	        CalcHelper.aggFn = function(expr) {
	            return expr instanceof CalcExpressions.FunctionExpression && expr.fn instanceof CalcFunctions.Function && expr.fn.isAggregator();
	        };

	        CalcHelper.fieldRef = function(ref) {
	            return ref instanceof Calc.CalcFieldReference;
	        };

	        CalcHelper.columnRef = function(ref) {
	            return ref instanceof Calc.CalcColumnReference;
	        };

	        CalcHelper.tabRef = function(ref) {
	            return ref instanceof Calc.CalcTableReference;
	        };

	        CalcHelper.err = function(value) {
	            return value instanceof Calc.CalcError;
	        };

	        CalcHelper.strExpr = function(expr) {
	            return expr instanceof CalcExpressions.StringExpression;
	        };

	        CalcHelper.unknowExpr = function(expr) {
	            return expr instanceof CalcExpressions.UnknownReferenceExpression;
	        };

	        CalcHelper.getCalcObj = function(calcDepNode, calcSource) {
	            var calcObj;
	            var colName = calcDepNode.column;
	            if (calcDepNode.type === CalcHelper.CALC_COLUMN) {
	                calcObj = calcSource.findCalcColumn(colName);
	            } else if (calcDepNode.type === CalcHelper.DATA_COLUMN) {
	                calcObj = calcSource.findDataColumn(colName);
	            } else if (calcDepNode.type === CalcHelper.CALC_FIELD) {
	                calcObj = calcSource.findCalcField(calcDepNode.name);
	            } else if (calcDepNode.type === CalcHelper.CALC_G_FIELD) {
	                calcObj = calcSource.findCalcGroupField(calcDepNode.name);
	            } else {
	                calcObj = null;
	            }
	            return calcObj;
	        };

	        function resolveExpressions_(expr, parentExpr, depExprList) {
	            if (CalcHelper.structExpr(expr)) {
	                depExprList.push({expr: expr, aggContext: CalcHelper.aggFn(parentExpr)});
	            } else if (CalcHelper.fieldExpr(expr)) {
	                depExprList.push({expr: expr});
	            } else if (CalcHelper.binaryExpr(expr)) {
	                resolveExpressions_(expr.left, expr, depExprList);
	                resolveExpressions_(expr.right, expr, depExprList);
	            } else if (CalcHelper.fnExpr(expr)) {
	                var args = expr.args;
	                if (args && args.length > 0) {
	                    _.forEach(args, function(argExpr) {
	                        resolveExpressions_(argExpr, expr, depExprList);
	                    });
	                }
	            }
	        }

	        return CalcHelper;
	    })();

	    module.exports = CalcHelper;
	})();


/***/ },
/* 7 */
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

	(function() {
	    'use strict';
	    //var Calc = require('./common');
	    var CalcSource = __webpack_require__(9).CalcSource;
	    var CalcContext = __webpack_require__(2);
	    //var CalcModels = require('./calcModels');
	    var CalcHelper = __webpack_require__(6);

	    var CalcManager = (function() {
	        function CalcManager(name, dataSource) {
	            var self = this;
	            var calcSource = new CalcSource(name, dataSource);
	            self.calcSource_ = calcSource;
	            self.dataColumns_ = calcSource.getModel(CalcHelper.DATA_COLUMN);
	            self.calcColumns_ = calcSource.getModel(CalcHelper.CALC_COLUMN);
	            self.calcTable_ = calcSource.getModel(CalcHelper.CALC_TABLE);
	            self.calcFields_ = calcSource.getModel(CalcHelper.CALC_FIELD);
	            self.calcGroupFields_ = calcSource.getModel(CalcHelper.CALC_G_FIELD);
	        }

	        CalcManager.prototype = {
	            addCalcColumn: function(name, formula) {
	                this.calcColumns_.addColumn(name, formula);
	            },

	            removeCalcColumn: function(name) {
	                this.calcColumns_.removeColumn(name);
	            },

	            getCalcColumnValues: function(name) {
	                return this.calcSource_.getValues(name);
	            },

	            getCalcColumnValue: function(name, index) {
	                return this.calcSource_.getValue(name, index);
	            },

	            calculateColumn: function(name, force) {
	                this.calcColumns_.calculateColumn(name, force);
	            },

	            getCalcRowItem: function(row) {
	                return this.calcTable_.getCalcRowItem(row);
	            },

	            getRowItem: function(row) {
	                this.calcTable_.getRowItem(row);
	            },

	            addCalcField: function(name, formula) {
	                var self = this;
	                self.calcFields_.addField(name, formula);
	                var unknownExprColumns = getUnknownExpressionColumns.call(self);
	                if (unknownExprColumns.length > 0) {
	                    _.forEach(unknownExprColumns, function(col) {
	                        self.calcColumns_.updateColumnFormula(col);
	                    });
	                }
	            },

	            getCalcFieldValue: function(name) {
	                return this.calcFields_.getValue(name);
	            },

	            calculateField: function(name) {
	                return this.calcFields_.calculateField(name);
	            },

	            addCalcGroupField: function(name, formula) {
	                this.calcGroupFields_.addField(name, formula);
	            },

	            getCalcGroupFieldValue: function(name, groupPath) {
	                return this.calcGroupFields_.getValue(name, groupPath);
	            },

	            getParserContext: function() {
	                return new CalcContext.ParserContext(this.calcSource_);
	            },

	            getEvaluatorContext: function(row, groupPath) {
	                return new CalcContext.EvaluateContext(this.calcSource_, row, groupPath);
	            },

	            getParser: function() {
	                return this.calcSource_.getParser();
	            },

	            getEvaluator: function() {
	                return this.calcSource_.getEvaluator();
	            },

	            getDimension: function() {
	                return this.calcSource_.getDimension();
	            },

	            findDataColumn: function(name) {
	                return this.dataColumns_.findDataColumn(name);
	            },

	            findCalcColumn: function(name) {
	                return this.calcColumns_.findCalcColumn(name);
	            },

	            findColumn: function(name) {
	                return this.calcSource_.findColumn(name);
	            },

	            findCalcField: function(name) {
	                return this.calcFields_.findField(name);
	            },

	            findCalcGroupField: function(name) {
	                return this.calcGroupFields_.findField(name);
	            },

	            addRowItem: function(index, item) { // jshint ignore:line

	            },

	            removeRowItem: function(index) { // jshint ignore:line

	            },

	            group: function(gds) {
	                this.calcSource_.group(gds);
	            },

	            getGroups: function() {
	                if (this.dataSource.getGroups) {
	                    return this.dataSource.getGroups();
	                }
	                return null;
	            },

	            dirtyColumn: function(column, index, newFormula) {
	                this.calcSource_.dirtyColumn(column, index, newFormula);
	            },

	            dirtyField: function(name) {
	                this.calcSource_.dirtyField(name);
	            },

	            getCalcSource: function() {
	                return this.calcSource_;
	            }
	        };

	        function getUnknownExpressionColumns() {
	            var self = this;
	            var columns = [];
	            var calcColumns = self.calcColumns_.getColumns();
	            if (calcColumns) {
	                _.forEach(calcColumns, function(calcCol) {
	                    var result = containsUnknownExpression.call(self, calcCol.expression);
	                    if (result) {
	                        columns.push(calcCol.name);
	                    }
	                });
	            }
	            return columns;
	        }

	        function containsUnknownExpression(expr) {
	            if (!expr) {
	                return false;
	            }
	            if (CalcHelper.unknowExpr(expr)) {
	                return true;
	            } else if (CalcHelper.binaryExpr(expr)) {
	                if (containsUnknownExpression(expr.left) ||
	                        containsUnknownExpression(expr.right)) {
	                    return true;
	                }
	                return false;
	            } else if (CalcHelper.fnExpr(expr)) {
	                var args = expr.args;
	                if (args && args.length > 0) {
	                    for (var i = 0, len = args.length; i < len; i++) {
	                        if (containsUnknownExpression(args[i])) {
	                            return true;
	                        }
	                    }
	                }
	                return false;
	            } else {
	                return false;
	            }
	        }

	        return CalcManager;
	    })();

	    module.exports = CalcManager;
	})();


/***/ },
/* 8 */
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

	(function() {
	    'use strict';
	    //var Calc = require('./common');
	    var CalcHelper = __webpack_require__(6);
	    var CalcContext = __webpack_require__(2);
	    //var gcUtils = require('../gcUtils');
	    var CalcModels = {};
	    var objectDefineProperty = Object.defineProperty;

	    var CalcGroup_ = (function() {
	        function CalcGroup_(table, name, level, isBottomLevel) {
	            var self = this;
	            self.level = level;
	            self.table_ = table;
	            self.isBottomLevel = isBottomLevel;
	            self.name = name;
	            if (isBottomLevel) {
	                self.items = [];
	            } else {
	                self.groups = [];
	            }
	        }

	        CalcGroup_.prototype = {
	            getItem: function(index) {
	                var self = this;
	                var bottomGroupInfo = self.searchChildGroup(index);
	                if (bottomGroupInfo) {
	                    if (self.rootNode_) {
	                        return self.rootNode_.getItem(index);
	                    } else {
	                        return self.table_.getRowItem_(bottomGroupInfo.group.items[bottomGroupInfo.relativeIndex]);
	                    }
	                }
	                return null;
	            },

	            getIndexMappingIndexes: function() {
	                var self = this;
	                var indexes = [];
	                var bGroups = self.getBottomGroups();
	                if (bGroups) {
	                    for (var gi = 0, gLen = bGroups.length; gi < gLen; gi++) {
	                        var bGroug = bGroups[gi];
	                        for (var i = 0, len = bGroug.items.length; i < len; i++) {
	                            indexes.push(bGroug.items[i]);
	                        }
	                    }
	                }
	                return indexes;
	            },

	            getItems: function() {
	                var self = this;
	                var items = [];
	                var bGroups = self.getBottomGroups();
	                if (bGroups) {
	                    for (var gi = 0, gLen = bGroups.length; gi < gLen; gi++) {
	                        var bGroug = bGroups[gi];
	                        for (var i = 0, len = bGroug.items.length; i < len; i++) {
	                            items.push(self.table_.getRowItem_(bGroug.items[i]));
	                        }
	                    }
	                }
	                return items;
	            },

	            toSourceIndex: function(localIndex) {
	                var self = this;
	                var bottomGroupInfo = self.searchChildGroup(localIndex);
	                var indexMappingIndex = bottomGroupInfo && bottomGroupInfo.group.items[bottomGroupInfo.relativeIndex];
	                var indexMappings = self.table_.indexMappings_;
	                if (indexMappings && indexMappingIndex >= 0 && indexMappingIndex < indexMappings.length) {
	                    return indexMappings[indexMappingIndex];
	                }
	                return indexMappingIndex;
	            },

	            hierarchy: function(hierarchyInfo) {
	                var self = this;
	                var table = self.table_;
	                self.hierarchyInfo_ = hierarchyInfo;
	                delete self.rootNode_;
	                if (!hierarchyInfo || !hierarchyInfo.hasOwnProperty('parentField') || !hierarchyInfo.hasOwnProperty('keyField')) {
	                    return null;
	                }

	                var root = createGroupsForTree_.call(self, {field: hierarchyInfo.parentField});
	                if (root && root.groups && root.groups.length > 0) {
	                    var groups = root.groups;
	                    var keyColObj = self.table_.findColumn(hierarchyInfo.keyField);
	                    var firstGroup = _.find(groups, _.matchesProperty('name', undefined));
	                    if (!firstGroup) {
	                        self.rootNode_ = null;
	                        return null;
	                    }
	                    var rootNode = new CalcNode_(table, -1, null, false);
	                    CalcTableModel.createTree_.call(table, firstGroup, rootNode, groups, keyColObj);
	                    self.rootNode_ = rootNode;
	                    if (self.sortInfos_) {
	                        CalcTableModel.sortNode_.call(table, self.rootNode_, self.sortInfos_);
	                    }
	                    return self.rootNode_;
	                }
	            },

	            findNode: function(index) {
	                var self = this;
	                if (self.rootNode_) {
	                    return self.rootNode_.findNode(index);
	                }
	            },

	            //toLocalIndex: function(sourceIndex) {
	            //    var self = this;
	            //    var mappingIndexes = self.getIndexMappingIndexes();
	            //    var sourceIndexes = _.map(mappingIndexes, function(mappingIndex) {
	            //        return self.table_.indexMappings[mappingIndex];
	            //    });
	            //    return sourceIndexes.indexOf(sourceIndex);
	            //},

	            //toGlobalIndex: function(localIndex) {
	            //    var self = this;
	            //    if (localIndex >= self.itemCount || localIndex < 0) {
	            //        return null;
	            //    }
	            //    if (self.level === -1) {
	            //        return localIndex;
	            //    }
	            //    var globalIndex = localIndex;
	            //    var currGroup = self;
	            //    var groups = [];
	            //    var tempGroup;
	            //    var parent = currGroup.parent;
	            //    while (parent) {
	            //        groups = parent.groups;
	            //        for (var i = 0, len = groups.length; i < len; ++i) {
	            //            tempGroup = groups[i];
	            //            if (tempGroup.name === currGroup.name) {
	            //                break;
	            //            } else {
	            //                globalIndex += tempGroup.itemCount;
	            //            }
	            //        }
	            //        currGroup = parent;
	            //        parent = currGroup.parent;
	            //    }
	            //    return globalIndex;
	            //},

	            searchChildGroup: function(index) {
	                var self = this;
	                var i = index;
	                if (i < 0 || i >= this.itemCount || !_.isNumber(i) || _.isNaN(i)) {
	                    return null;
	                }
	                if (this.isBottomLevel) {
	                    return {group: self, relativeIndex: i};
	                } else {
	                    var notBottom = true;
	                    var group = self;
	                    var childGroup;
	                    var groupIndex = 0;
	                    var itemCount;
	                    while (notBottom) {
	                        childGroup = group.groups[groupIndex];
	                        if ((itemCount = childGroup.itemCount) > i) {
	                            group = childGroup;
	                            notBottom = !group.isBottomLevel;
	                            groupIndex = 0;
	                        } else {
	                            i -= itemCount;
	                            ++groupIndex;
	                        }
	                    }
	                    return {group: group, relativeIndex: i};
	                }
	            },

	            sortTree: function() {
	                var self = this;
	                var bottomGroups = self.getBottomGroups();
	                if (bottomGroups) {
	                    _.forEach(bottomGroups, function(group) {
	                        if (group.rootNode) {
	                            group.rootNode.sort();
	                        }
	                    });
	                }
	            },

	            getBottomGroups: function() {
	                return getBottomGroups_(this);
	            }
	        };
	        var calcGroupProto = CalcGroup_.prototype;

	        objectDefineProperty(calcGroupProto, 'itemCount', {
	            get: function() {
	                var self = this;
	                var bottomGroups = getBottomGroups_(self);
	                var itemCount = 0;
	                _.forEach(bottomGroups, function(group) {
	                    // only when group has own property 'rootNode_' means the group is hierarchied
	                    if (group.hasOwnProperty('rootNode_')) {
	                        if (group.rootNode) { // it means that the group is hierarchied successfully, all nodes excepting the root node have its parent.
	                            itemCount += group.rootNode.nodeCount;
	                        } else { // it means that the group is hierarchied failed, the items are not bad.
	                            // 0
	                        }
	                    } else {
	                        itemCount += group.items.length;
	                    }
	                });
	                return itemCount;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcGroupProto, 'rootNode', {
	            get: function() {
	                return this.rootNode_;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        function getBottomGroups_(group) {
	            var result = [];
	            if (group.isBottomLevel) {
	                return [group];
	            } else {
	                for (var i = 0, len = group.groups.length; i < len; i++) {
	                    var subGroups = getBottomGroups_(group.groups[i]);
	                    result = result.concat(subGroups);
	                }
	            }
	            return result;
	        }

	        function createGroupsForTree_(treeGroupInfo) {
	            var self = this;
	            if (!self.isBottomLevel) {
	                return null;
	            }
	            var root = {};
	            var rowCount = self.items.length; // here must use self.items.length, can not use self.itemCount
	            root.itemCount = rowCount;
	            var groups;
	            var parent;
	            var i;
	            var name;
	            var group;
	            var colObj = self.table_.findColumn(treeGroupInfo.field);
	            for (i = 0; i < rowCount; ++i) {
	                groups = root.groups;
	                parent = root;

	                name = getGroupNameFromItemIndex_.call(self, colObj, i);
	                group = getGroup_.call(self, parent, name);
	                ++group.itemCount;
	                // move on to the next group
	                group.parent = parent;
	                parent = group;
	                groups = group.groups;

	                group.items.push(self.items[i]);
	            }
	            return root;
	        }

	        function getGroupNameFromItemIndex_(colObj, index) {
	            var self = this;
	            if (colObj) {
	                var value = getValue_.call(self, colObj, index);
	                if (value === null || value === undefined || value === '') {
	                    return undefined;
	                }
	                return value;
	            }
	            return undefined;
	        }

	        function getGroup_(parent, name) {
	            if (!parent.groups) {
	                parent.groups = [];
	            }
	            var groups = parent.groups;
	            for (var i = 0; i < groups.length; i++) {
	                if (groups[i].name === name) {
	                    return groups[i];
	                }
	            }
	            // not found, create new group
	            var group = {name: name, itemCount: 0, items: []};
	            groups.push(group);
	            return group;
	        }

	        function getValue_(colObj, localIndex) {
	            var self = this;
	            var table = self.table_;
	            var indexMappings = table.indexMappings_;
	            var indexMappingIndex = self.items[localIndex];
	            var srcIndex = indexMappingIndex;
	            if (indexMappings && indexMappingIndex >= 0 && indexMappingIndex < indexMappings.length) {
	                srcIndex = indexMappings[indexMappingIndex];
	            }
	            var value;
	            if (colObj.type === CalcHelper.DATA_COLUMN) {
	                //value = self.dataColumns_.sourceCollection[index][colObj.name];
	                value = table.dataColumns_.getValue(srcIndex, colObj);
	            } else { // calc column
	                value = table.calcColumns_.getValue(colObj, srcIndex);
	            }
	            return value;
	        }

	        return CalcGroup_;
	    })();
	    CalcModels.CalcGroup_ = CalcGroup_;

	    var CalcNode_ = (function() {
	        function CalcNode_(table, itemIndex, parent, collapsed) {
	            var self = this;
	            self.itemIndex = itemIndex;
	            self.children = [];
	            self.parent = parent;
	            self.level = parent && parent.hasOwnProperty('level') ? parent.level + 1 : -1;
	            if (parent) {
	                parent.children.push(self);
	            }
	            //if (parent) {
	            if (collapsed === undefined) {
	                self.collapsed = true;
	            } else {
	                self.collapsed = collapsed;
	            }
	            //} else {
	            //    self.collapsed = false;
	            //}
	            self.table_ = table;
	        }

	        CalcNode_.prototype = {
	            getItem: function(relativeIndex) {
	                var self = this;
	                if (relativeIndex !== undefined) {
	                    var node = findNode_.call(self, self, relativeIndex);
	                    if (node) {
	                        return self.table_.getRowItem_(node.itemIndex);
	                    }
	                } else {
	                    return self.table_.getRowItem_(self.itemIndex);
	                }
	            },
	            getItems: function(option) {
	                var self = this;
	                var arg = {};
	                arg.containCollapsed = option ? !!option.collapsed : false;
	                arg.start = option && option.start ? option.start : 0;
	                arg.end = option && option.end ? option.end : Number.MAX_VALUE;
	                var nodes = travelNode_(self, arg);
	                var items = _.map(nodes, function(node) {
	                    return node.getItem();
	                });
	                return items;
	            },
	            expandAll: function() {
	                operateNodes_(this, function(node) {
	                    node.collapsed = false;
	                });
	            },
	            collapseAll: function() {
	                operateNodes_(this, function(node) {
	                    node.collapsed = true;
	                });
	            },
	            findNode: function(index) {
	                return findNode_(this, index);
	            },
	            getIndexMappingIndexes: function() {
	                var result = [];
	                operateNodes_(this, function(node) {
	                    result.push(node.itemIndex);
	                });
	                return result;
	            },
	            toSourceIndex: function(index) {
	                var self = this;
	                var node = self.findNode(index);
	                if (node) {
	                    var indexMappings = self.table_.indexMappings_;
	                    if (indexMappings) {
	                        return indexMappings[node.itemIndex];
	                    }
	                    return node.itemIndex;
	                }
	            },
	            sort: function() {
	                var table = this.table_;
	                CalcTableModel.sortNode_.call(table, this, table.sortInfos_);
	            }
	        };

	        objectDefineProperty(CalcNode_.prototype, 'nodeCount', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                var counter = 0;
	                operateNodes_(this, function() {
	                    counter++;
	                });
	                return counter;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        function findNode_(node, searchIndex, currentIndex, all) {
	            if (currentIndex === undefined) {
	                currentIndex = node.level === -1 ? -1 : 0;
	            } else {
	                currentIndex++;
	            }
	            if (currentIndex === searchIndex) {
	                return node;
	            }
	            try {
	                if (all || !node.collapsed) {
	                    for (var i = 0; i < node.children.length; i++) {
	                        var result = findNode_(node.children[i], searchIndex, currentIndex);
	                        if (_.isNumber(result)) {
	                            currentIndex = result;
	                        } else {
	                            return result;
	                        }
	                    }
	                }
	            } catch (e) {
	                console.log(e);
	            }
	            return currentIndex;
	        }

	        CalcNode_.findNode_ = findNode_;

	        function travelNode_(node, arg, action) {
	            var nodes = [];
	            if (!arg.hasOwnProperty('currentIndex')) {
	                arg.currentIndex = node.level === -1 ? -1 : 0;
	            } else {
	                arg.currentIndex++;
	            }
	            var currentIndex = arg.currentIndex;
	            if (currentIndex > arg.end) {
	                return nodes;
	            }
	            if (currentIndex >= arg.start && node.level !== -1) {
	                nodes.push(node);
	                if (action) {
	                    action(node);
	                }
	            }
	            if (arg.containCollapsed || !node.collapsed) {
	                _.forEach(node.children, function(childNode) {
	                    var childNodes = travelNode_(childNode, arg, action);
	                    if (childNodes.length > 0) {
	                        nodes = nodes.concat(childNodes);
	                    }
	                });
	            }
	            return nodes;
	        }

	        function operateNodes_(node, action) {
	            var arg = {};
	            arg.containCollapsed = false;
	            arg.start = 0;
	            arg.end = Number.MAX_VALUE;
	            travelNode_(node, arg, action);
	        }

	        CalcNode_.operateNodes_ = operateNodes_;

	        return CalcNode_;
	    })();
	    CalcModels.CalcNode_ = CalcNode_;

	    var CalcTableModel = (function() {
	        function CalcTableModel(calcSource, dataColumns, calcColumns) {
	            var self = this;
	            if (!dataColumns) {
	                return;
	            }
	            self.calcSource_ = calcSource;
	            self.dataColumns_ = dataColumns;
	            self.calcColumns_ = calcColumns;
	            self.columns_ = _.map(dataColumns.columns, function(col) {
	                return {
	                    name: col.name,
	                    field: col.field,
	                    type: CalcHelper.DATA_COLUMN,
	                    dataType: col.dataType
	                };
	            });
	            clearFilterStates_.call(self);
	            self.indexMappings_ = null;
	            self.sortSensitive_ = false;
	            self.groupSensitive_ = false;
	        }

	        CalcTableModel.prototype = {
	            getRowCount: function() {
	                var self = this;
	                if (self.indexMappings_) {
	                    return self.indexMappings_.length;
	                } else {
	                    return self.dataColumns_.getDimension();
	                }
	            },

	            filter: function(expression) {
	                var self = this;
	                self.filterExpr_ = expression;
	                var cachedGroupInfos = self.groupInfos_;
	                var cachedSortInfos = self.sortInfos_;
	                var cachedHierachyInfo = self.hierarchyInfo_;
	                clearAllStates_.call(self);
	                if (expression) {
	                    var calcSource = self.calcSource_;
	                    if (expression) {
	                        var parser = calcSource.getParser();
	                        var parserContext = calcSource.getParserContext();
	                        var evaluator = calcSource.getEvaluator();
	                        var evaluatorContext = calcSource.getEvaluatorContext();

	                        var expr = parser.parse(expression, parserContext);
	                        self.filterStates_ = evaluator.evaluateExpression(expr, evaluatorContext);
	                    }
	                } else {
	                    clearFilterStates_.call(self);
	                }

	                updateStatesOnSetFilterStates_.call(this);

	                if (cachedHierachyInfo) {
	                    if (cachedGroupInfos) {
	                        self.hierarchyInfo_ = cachedHierachyInfo;
	                        // hierachy will be accomplished in group
	                        self.group(cachedGroupInfos);
	                    } else {
	                        self.hierarchy(cachedHierachyInfo);
	                    }
	                } else {
	                    if (cachedSortInfos) {
	                        self.sort(cachedSortInfos);
	                    }
	                    if (cachedGroupInfos) {
	                        self.group(cachedGroupInfos);
	                    }
	                }
	            },

	            sort: function(sortInfos) {
	                var self = this;
	                self.sortInfos_ = sortInfos;
	                var cachedGds;

	                // if no sortInfo, then must reset the indexMappings
	                if (!sortInfos || sortInfos.length === 0) {
	                    self.sortInfos_ = null;

	                    updateStatesOnSetFilterStates_.call(this);

	                    if (self.hierarchyInfo_) {
	                        // must restore the node collapsed status after re hierarchy
	                        var cachedNodeStatus = {};
	                        if (self.groups_) {
	                            var bottomGroups = self.groups_.getBottomGroups();
	                            if (bottomGroups) {
	                                _.forEach(bottomGroups, function(group) {
	                                    if (group.rootNode) {
	                                        CalcNode_.operateNodes_(group.rootNode, function(node) {
	                                            cachedNodeStatus[node.value] = node.collapsed;
	                                        });
	                                    }
	                                    CalcNode_.operateNodes_(group.rootNode, function(node) {
	                                        if (cachedNodeStatus.hasOwnProperty(node.value)) {
	                                            node.collapsed = cachedNodeStatus[node.value];
	                                        }
	                                    });
	                                });
	                            }

	                            cachedGds = self.groupInfos_;
	                            clearGroupStates_.call(self);
	                            self.group(cachedGds);

	                            bottomGroups = self.groups_.getBottomGroups();
	                            if (bottomGroups) {
	                                _.forEach(bottomGroups, function(group) {
	                                    if (group.rootNode) {
	                                        CalcNode_.operateNodes_(group.rootNode, function(node) {
	                                            if (cachedNodeStatus.hasOwnProperty(node.value)) {
	                                                node.collapsed = cachedNodeStatus[node.value];
	                                            }
	                                        });
	                                    }
	                                });
	                            }
	                        } else {
	                            if (self.rootNode_) {
	                                CalcNode_.operateNodes_(self.rootNode_, function(node) {
	                                    cachedNodeStatus[node.value] = node.collapsed;
	                                });
	                            }
	                            self.hierarchy(self.hierarchyInfo_);
	                            CalcNode_.operateNodes_(self.rootNode_, function(node) {
	                                if (cachedNodeStatus.hasOwnProperty(node.value)) {
	                                    node.collapsed = cachedNodeStatus[node.value];
	                                }
	                            });
	                        }
	                    }
	                } else {
	                    if (self.hierarchyInfo_) {
	                        if (self.groups_) {
	                            self.groups_.sortTree();
	                        } else {
	                            sortNode_.call(self, self.rootNode_, sortInfos);
	                            //self.hierarchy(cachedHierachyInfo);
	                        }
	                    } else {
	                        cachedGds = self.groupInfos_;
	                        clearGroupStates_.call(self);

	                        var sortMappings = [];
	                        var i = 0;
	                        var len = 0;
	                        if (self.indexMappings_) {
	                            for (i = 0, len = self.indexMappings_.length; i < len; i++) {
	                                sortMappings[i] = self.indexMappings_[i];
	                            }
	                        } else {
	                            for (i = 0, len = self.getDimension(); i < len; i++) {
	                                sortMappings[i] = i;
	                            }
	                        }

	                        var sortColumns = {};
	                        _.forEach(sortInfos, function(sortInfo) {
	                            if (!sortInfo.hasOwnProperty('ascending')) {
	                                sortInfo.ascending = true;
	                            } else {
	                                sortInfo.ascending = !!sortInfo.ascending;
	                            }
	                            sortColumns[sortInfo.field] = self.dataColumns_.findColumn(sortInfo.field) || self.calcColumns_.findColumn(sortInfo.field);
	                        });
	                        sortMappings.sort(function(index1, index2) {
	                            for (var i = 0, sortLen = sortInfos.length; i < sortLen; i++) {
	                                // get values
	                                var sd = sortInfos[i];
	                                var sortCol = sortColumns[sd.field];
	                                var v1;
	                                var v2;
	                                if (sortCol) {
	                                    //v1 = self.dataColumns_.sourceCollection[index1];
	                                    //v2 = self.dataColumns_.sourceCollection[index2];
	                                    v1 = getSingleValue_.call(self, sortCol, index1);
	                                    v2 = getSingleValue_.call(self, sortCol, index2);
	                                    if (sd.converter) {
	                                        v1 = sd.converter(v1);
	                                        v2 = sd.converter(v2);
	                                    }
	                                }

	                                // check for NaN (isNaN returns true for NaN but also for non-numbers)
	                                if (v1 !== v1) {
	                                    v1 = null;
	                                }
	                                if (v2 !== v2) {
	                                    v2 = null;
	                                }

	                                // ignore case when sorting  (but add the original string to keep the
	                                // strings different and the sort consistent, 'aa' between 'AA' and 'bb')
	                                if (_.isString(v1)) {
	                                    v1 = v1.toLowerCase() + v1;
	                                }
	                                if (_.isString(v2)) {
	                                    v2 = v2.toLowerCase() + v2;
	                                }

	                                // compare the values (at last!)
	                                var cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
	                                if (cmp !== 0) {
	                                    return sd.ascending ? +cmp : -cmp;
	                                }
	                            }
	                            return 0;
	                        });

	                        self.indexMappings_ = sortMappings;
	                        if (cachedGds) {
	                            self.group(cachedGds);
	                        }
	                    }
	                }
	            },

	            group: function(groupInfos) {
	                var self = this;
	                self.groupInfos_ = groupInfos;
	                self.groups_ = null;

	                var cachedHierachyInfo = self.hierarchyInfo_;
	                clearHierachyStates_.call(self);

	                if (!groupInfos || groupInfos.length === 0) {
	                    self.groups_ = null;
	                    if (cachedHierachyInfo) {
	                        self.hierarchy(cachedHierachyInfo);
	                    }
	                    return null;
	                }
	                self.groups_ = createCalcGroup_.call(self, groupInfos);
	                if (cachedHierachyInfo) {
	                    var bottomGroups = self.groups_.getBottomGroups();
	                    if (bottomGroups && bottomGroups.length > 0) {
	                        _.forEach(bottomGroups, function(bottomGroup) {
	                            bottomGroup.hierarchy(cachedHierachyInfo);
	                        });
	                    }
	                }
	                onGoupsUpdated_.call(self);
	                return self.groups_;
	            },

	            hierarchy: function(hierarchyInfo) {
	                var self = this;
	                self.hierarchyInfo_ = hierarchyInfo;
	                self.rootNode_ = null;
	                if (!hierarchyInfo || !hierarchyInfo.hasOwnProperty('parentField') || !hierarchyInfo.hasOwnProperty('keyField')) {
	                    self.rootNode_ = null;
	                    return null;
	                }

	                if (self.groups_) {
	                    var bottomGroups = self.groups_.getBottomGroups();
	                    if (bottomGroups && bottomGroups.length > 0) {
	                        _.forEach(bottomGroups, function(bottomGroup) {
	                            bottomGroup.hierarchy(self.hierarchyInfo_);
	                        });
	                    }
	                } else {
	                    var root = createCalcGroup_.call(self, [{field: hierarchyInfo.parentField}]);
	                    if (root && root.groups && root.groups.length > 0) {
	                        var groups = root.groups;
	                        var keyColObj = self.findColumn(hierarchyInfo.keyField);
	                        var firstGroup = _.find(groups, _.matchesProperty('name', undefined));
	                        if (!firstGroup) {
	                            self.rootNode_ = null;
	                            return null;
	                        }
	                        var rootNode = new CalcNode_(self, -1, null, false);
	                        createTree_.call(self, firstGroup, rootNode, groups, keyColObj);
	                        self.rootNode_ = rootNode;
	                        if (self.sortInfos_) {
	                            sortNode_.call(self, self.rootNode_, self.sortInfos_);
	                        }
	                        //self.cachedNodeStatus_ = {};
	                        return self.rootNode_;
	                    }
	                }
	                return null;
	            },

	            // the new states is based on current filter, so this method will ignore current filtered out rows
	            // and only overlap the states to current rowStates_
	            overlapFilterStates: function(states) {
	                var self = this;
	                if (_.isArray(states)) {
	                    var dimension = self.getDimension();
	                    var overlapIndex = 0;
	                    var len = states.length;
	                    self.indexMappings_ = [];
	                    for (var i = 0; i < dimension; i++) {
	                        if (self.rowStates_[i] !== false) {
	                            if (overlapIndex >= len) {
	                                break;
	                            }
	                            self.rowStates_[i] = states[overlapIndex];
	                            overlapIndex++;
	                        }
	                        if (self.rowStates_[i]) {
	                            self.indexMappings_.push(i);
	                        }
	                    }
	                }
	            },

	            overlapFilterSingleState: function(states, currentRow) {
	                var self = this;
	                if (!_.isArray(states) && currentRow > -1) {
	                    var sRow = mapToSourceRow_.call(self, currentRow);
	                    if (self.rowStates_[sRow] !== false) {
	                        self.rowStates_[sRow] = states;
	                        if (states === false) {
	                            if (self.indexMappings_) {
	                                self.indexMappings_.splice(currentRow, 1);
	                            } else {
	                                self.indexMappings_ = [];
	                                for (var i = 0, len = self.getDimension(); i < len; i++) {
	                                    if (self.rowStates_[i] !== false) {
	                                        self.indexMappings_.push(i);
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            },

	            getRowItem: function(row) {
	                var self = this;
	                if (self.groups_) {
	                    return self.groups_.getItem(row);
	                } else if (self.rootNode_) {
	                    return self.rootNode_.getItem(row);
	                } else {
	                    return self.getRowItem_(row);
	                }
	            },

	            getDataRowItem: function(row) {
	                var self = this;
	                row = mapToSourceRow_.call(self, row);
	                return self.dataColumns_.getRowItem(row);
	            },

	            getCalcRowItem: function(row) {
	                var self = this;
	                var srcRow = mapToSourceRow_.call(self, row);
	                var calcRowItem = getCalcRowItem_.call(self, srcRow);
	                return calcRowItem;
	            },

	            getValues: function(column, group, internal) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return;
	                //}
	                var values = [];
	                var rowIndex;
	                var value;
	                var rowCount;
	                if (self.boundGroup_) {
	                    group = self.boundGroup_;
	                }
	                var indexMappings = self.indexMappings_;
	                if (group && _.isArray(group) && group.length > 0) {
	                    var indexes = getIndexMappingIndexes.call(self, group);
	                    for (var index = 0, len = indexes.length; index < len; index++) {
	                        rowIndex = indexMappings ? indexMappings[indexes[index]] : indexes[index];
	                        if (self.rowStates_[rowIndex] !== false) {
	                            value = getSingleValue_.call(self, colObj, rowIndex, internal);
	                            values.push(value);
	                        }
	                    }
	                } else {
	                    if (indexMappings) {
	                        for (var i = 0, len1 = indexMappings.length; i < len1; i++) {
	                            value = getSingleValue_.call(this, colObj, indexMappings[i], internal);
	                            values.push(value);
	                        }
	                    } else {
	                        for (rowIndex = 0, rowCount = self.getDimension(); rowIndex < rowCount; rowIndex++) {
	                            value = getSingleValue_.call(this, colObj, rowIndex, internal);
	                            values.push(value);
	                        }
	                    }
	                }
	                return values;
	            },

	            getValue: function(column, index, internal) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return;
	                //}
	                index = mapToSourceRow_.call(self, index);
	                return getSingleValue_.call(this, colObj, index, internal);
	            },

	            addRowItem: function(index, item) { // jshint ignore:line

	            },

	            removeRowItem: function(index) { // jshint ignore:line

	            },

	            getDimension: function() {
	                return this.dataColumns_.getDimension();
	            },

	            getGroupPath: function(row) {
	                var self = this;
	                if (!self.groups_) {
	                    return [];
	                }
	                var path = [];
	                findRowInGroup_.call(self, self.groups_, row, path);
	                if (path.length === 0) {
	                    return;
	                }
	                return path;
	            },

	            bindGroup: function(group) {
	                this.boundGroup_ = group;
	            },

	            unbindGroup: function() {
	                delete this.boundGroup_;
	            },

	            clone: function() {
	                var self = this;
	                var cloneObj = new CalcTableModel(null);
	                cloneObj.dataColumns_ = self.dataColumns_;
	                cloneObj.calcColumns_ = self.calcColumns_;
	                cloneObj.columns_ = _.clone(self.columns_, true);
	                cloneObj.rowStates_ = _.clone(self.rowStates_);
	                cloneObj.filterStates_ = _.clone(self.filterStates_);
	                cloneObj.groups_ = self.groups_;
	                cloneObj.indexMappings_ = _.clone(self.indexMappings_, true);
	                cloneObj.rootNode_ = self.rootNode_;
	                return cloneObj;
	            },

	            reproduce: function() {
	                var self = this;
	                var reproducedObj = new CalcTableModel(null);
	                reproducedObj.dataColumns_ = self.dataColumns_;
	                reproducedObj.calcColumns_ = self.calcColumns_;
	                reproducedObj.columns_ = _.clone(self.columns_, true);
	                reproducedObj.rowStates_ = [];
	                reproducedObj.rowStates_.length = self.getDimension();
	                reproducedObj.filter = null;
	                reproducedObj.filterStates_ = null;
	                reproducedObj.groups_ = self.groups_;
	                reproducedObj.rootNode_ = self.rootNode_;
	                return reproducedObj;
	            },

	            reproduceWithColumns: function(columns) {
	                var self = this;
	                var reproducedObj = new CalcTableModel(null);
	                var columnNames = self.columns_;
	                var validColumns = [];
	                var index;
	                columnNames = _.map(columnNames, function(columnName) {
	                    return columnName.name;
	                });
	                reproducedObj.dataColumns_ = self.dataColumns_;
	                reproducedObj.calcColumns_ = self.calcColumns_;
	                _.forEach(columns, function(column) {
	                    if ((index = _.indexOf(columnNames, column)) > -1) {
	                        validColumns.push(self.columns_[index]);
	                    }
	                });
	                reproducedObj.columns_ = validColumns;
	                reproducedObj.rowStates_ = [];
	                reproducedObj.rowStates_.length = self.getDimension();
	                reproducedObj.filter = null;
	                reproducedObj.filterStates_ = null;
	                reproducedObj.groups_ = _.clone(self.groups_, true);
	                return reproducedObj;
	            },

	            beginUseGroup: function() {
	                var self = this;
	                var groupObj = {
	                    groups: self.groups_,
	                    groupInfos: self.groupInfos_
	                };
	                if (self.backupGroups_) {
	                    self.backupGroups_.push(groupObj);
	                } else {
	                    self.backupGroups_ = [groupObj];
	                }
	            },

	            endUseGroup: function() {
	                var self = this;
	                if (self.backupGroups_ && self.backupGroups_.length > 0) {
	                    var groupObj = self.backupGroups_.pop();
	                    self.groups_ = groupObj.groups;
	                    self.groupInfos_ = groupObj.groupInfos;
	                }
	            },

	            getGroups: function() {
	                return this.groups_;
	            },

	            getRootNode: function() {
	                return this.rootNode_;
	            },

	            updateGroups: function() {
	                var self = this;
	                self.group(self.groupInfos_);
	                onGoupsUpdated_.call(self);
	            },

	            findColumn: function(column) {
	                var self = this;
	                return self.dataColumns_.findColumn(column) || self.calcColumns_.findColumn(column);
	            },

	            toArray: function(group) {
	                var self = this;
	                if (self.boundGroup_) {
	                    group = self.boundGroup_;
	                }
	                var rowIndex;
	                var rowCount;
	                var rows = [];
	                if (group && _.isArray(group) && group.length > 0) {
	                    var indexes = getIndexMappingIndexes.call(self, group);
	                    for (var index = 0, len = indexes.length; index < len; index++) {
	                        rowIndex = indexes[index];
	                        rows.push(self.getRowItem(rowIndex));
	                    }
	                } else {
	                    var indexMappings = self.indexMappings_;
	                    if (indexMappings) {
	                        for (var i = 0, len1 = indexMappings.length; i < len1; i++) {
	                            rows.push(self.getRowItem(i));
	                        }
	                    } else {
	                        for (rowIndex = 0, rowCount = self.getDimension(); rowIndex < rowCount; rowIndex++) {
	                            rows.push(self.getRowItem(rowIndex));
	                        }
	                    }
	                }
	                return rows;
	            },

	            mapToSourceRow: function(viewRow) {
	                return mapToSourceRow_.call(this, viewRow);
	            },

	            mapToViewRow: function(sourceRow) {
	                return mapToViewRow_.call(this, sourceRow);
	            },

	            isFilterOut: function(srcRow) {
	                return this.rowStates_[srcRow] === false;
	            },

	            getRowItem_: function(row) {
	                var self = this;
	                var srcRow = row;
	                if (self.indexMappings_ && row >= 0 && row < self.indexMappings_.length) {
	                    srcRow = self.indexMappings_[row];
	                }
	                var dataItem = self.dataColumns_.getRowItem(srcRow);
	                var calcItem = getCalcRowItem_.call(self, srcRow);
	                if (calcItem) {
	                    return new RowItem_(dataItem, calcItem, srcRow);
	                } else {
	                    return dataItem;
	                }
	            },

	            beginContextManipulate: function() {
	                var self = this;
	                var contextStatusObj = {
	                    groups: self.groups_,
	                    groupInfos: self.groupInfos_,
	                    rowStates: self.rowStates_,
	                    filterStates: self.filterStates_,
	                    indexMappings: self.indexMappings_
	                };
	                if (self.backupAllStatus_) {
	                    self.backupAllStatus_.push(contextStatusObj);
	                } else {
	                    self.backupAllStatus_ = [contextStatusObj];
	                }
	                clearAllStates_.call(self);
	            },

	            endContextManipulate: function() {
	                var self = this;
	                if (self.backupAllStatus_ && self.backupAllStatus_.length > 0) {
	                    var contextStatusObj = self.backupAllStatus_.pop();
	                    self.groups_ = contextStatusObj.groups;
	                    self.groupInfos_ = contextStatusObj.groupInfos;
	                    self.rowStates_ = contextStatusObj.rowStates;
	                    self.filterStates_ = contextStatusObj.filterStates;
	                    self.indexMappings_ = contextStatusObj.indexMappings;
	                }
	            }
	        };

	        function getCalcRowItem_(srcRow) {
	            var self = this;
	            var calcRowItem = {};
	            var calcColumns = self.calcColumns_.getColumns();
	            if (calcColumns.length === 0) {
	                return null;
	            }
	            _.forEach(calcColumns, function(calcColObj) {
	                var value = self.calcColumns_.getValue(calcColObj, srcRow);
	                calcRowItem[calcColObj.name] = value;
	            });
	            return calcRowItem;
	        }

	        function createCalcGroup_(groupInfos) {
	            var self = this;
	            if (!_.isArray(groupInfos)) {
	                return null;
	            }
	            var root = new CalcGroup_(self, null, -1, false);
	            var rowCount = self.getRowCount();
	            //root.itemCount = rowCount;
	            root.path = [];
	            var groups;
	            var parent;
	            var i;
	            var level;
	            var levels = groupInfos.length;
	            var gd;
	            var name;
	            var last;
	            var group;
	            var path;
	            for (i = 0; i < rowCount; ++i) {
	                groups = root.groups;
	                parent = root;
	                path = [];
	                for (level = 0; level < levels; ++level) {
	                    gd = groupInfos[level];
	                    name = getGroupNameFromItemIndex_.call(self, gd, i);
	                    last = level === levels - 1;
	                    group = getCalcGroup_.call(self, parent, name, level, last);
	                    //++group.itemCount;
	                    // move on to the next group
	                    group.parent = parent;
	                    parent = group;
	                    groups = group.groups;
	                }
	                group.items.push(i);
	            }
	            return root;
	        }

	        function getGroupNameFromItemIndex_(groupDescription, index) {
	            var self = this;
	            var colObj = self.findColumn(groupDescription.field);
	            if (colObj) {
	                var value = self.getValue(colObj, index, false);
	                if (_.isFunction(groupDescription.converter)) {
	                    return groupDescription.converter(value);
	                }
	                if (value === null || value === undefined) {
	                    return undefined;
	                }
	                return value;
	            }
	            return null;
	        }

	        function getCalcGroup_(parent, name, level, isBottomLevel) {
	            var groups = parent.groups;
	            for (var i = 0; i < groups.length; i++) {
	                if (groups[i].name === name) {
	                    return groups[i];
	                }
	            }
	            // not found, create new group
	            var group = new CalcGroup_(this, name, level, isBottomLevel);
	            group.path = parent.path.concat(groups.length);
	            groups.push(group);
	            return group;
	        }

	        function RowItem_(dataItem, calcItem, srcIndex) {
	            var self = this;
	            self.dataItem_ = dataItem;
	            self.calcItem_ = calcItem;
	            self.sourceIndex_ = srcIndex;

	            if (dataItem) {
	                var dataKeys = _.keys(dataItem);
	                _.forEach(dataKeys, function(key) {
	                    objectDefineProperty(self, key, {
	                        get: function() {
	                            return dataItem[key];
	                        },
	                        set: function(value) {
	                            dataItem[key] = value;
	                        },
	                        enumerable: true,
	                        configurable: true
	                    });
	                });
	            }

	            if (calcItem) {
	                var calcKeys = _.keys(calcItem);
	                _.forEach(calcKeys, function(key) {
	                    objectDefineProperty(self, key, {
	                        get: function() {
	                            return calcItem[key];
	                        },
	                        set: function(value) {
	                            calcItem[key] = value;
	                        },
	                        enumerable: true,
	                        configurable: true
	                    });
	                });
	            }

	            objectDefineProperty(self, 'sourceIndex', {
	                get: function() {
	                    return this.sourceIndex_;
	                },
	                enumerable: true,
	                configurable: true
	            });
	        }

	        function findRowInGroup_(group, row, path) {
	            if (group.isBottomLevel) {
	                return group.items.indexOf(row) !== -1;
	            } else if (group.groups) {
	                for (var i = 0, len = group.groups.length; i < len; i++) {
	                    var found = findRowInGroup_(group.groups[i], row, path);
	                    if (found) {
	                        path.splice(0, 0, i);
	                        return found;
	                    }
	                }
	            }

	        }

	        // while set filter, the invisible column will always keep invisible, but the visible columns may change to invisible
	        // so while set filer, only check the visible columns is ok.
	        function updateStatesOnSetFilterStates_() {
	            var self = this;
	            var rowCount = self.getDimension();
	            self.indexMappings_ = [];
	            for (var row = 0; row < rowCount; row++) {
	                updateRowState_.call(self, row);
	                if (self.rowStates_[row]) {
	                    self.indexMappings_.push(row);
	                }
	            }
	        }

	        function updateRowState_(row) {
	            var self = this;
	            var filterState = self.filterStates_ === null || self.filterStates_[row] !== false;
	            self.rowStates_[row] = filterState;
	        }

	        function getSingleValue_(colObj, srcIndex, internal) {
	            var self = this;
	            var value;
	            if (colObj.type === CalcHelper.DATA_COLUMN) {
	                //value = self.dataColumns_.sourceCollection[index][colObj.name];
	                value = self.dataColumns_.getValue(srcIndex, colObj);
	            } else { // calc column
	                if (internal) {
	                    value = colObj.values[srcIndex];
	                } else {
	                    value = self.calcColumns_.getValue(colObj, srcIndex);
	                }
	            }
	            return value;
	        }

	        function getIndexMappingIndexes(groupPath) {
	            var self = this;
	            var group = getGroup_(self.groups_, groupPath);
	            if (group) {
	                var indexes;
	                try {
	                    indexes = group.getIndexMappingIndexes();
	                } catch (e) {
	                    console.log(e);
	                }
	                return indexes;
	            }
	            return null;
	        }

	        function getGroup_(rootGroup, groupPath) {
	            var currentGroup = rootGroup;
	            for (var i = 0, len = groupPath.length; i < len; i++) {
	                var index = groupPath[i];
	                var groups = currentGroup.groups;
	                if (groups && index < groups.length) {
	                    currentGroup = groups[index];
	                } else {
	                    return null;
	                }
	            }
	            return currentGroup;
	        }

	        function onGoupsUpdated_() {
	            var self = this;
	            var calcColumns = self.calcColumns_.getColumns();
	            _.forEach(calcColumns, function(calcCol) {
	                self.calcColumns_.dirty(calcCol, -1);
	            });
	        }

	        function mapToSourceRow_(row) {
	            var self = this;
	            var index = row;
	            // during grouping or hierachying, the groups_ and rootNode_ will be first set null, so the index does not need to be transformed by group and tree
	            if (self.groups_) {
	                var groupInfo = self.groups_.searchChildGroup(row);
	                if (groupInfo) {
	                    index = groupInfo.group.items[groupInfo.relativeIndex];
	                } else {
	                    index = -1;
	                }
	            } else if (self.rootNode_) {
	                var node = self.rootNode_.findNode(row);
	                if (node) {
	                    index = node.itemIndex;
	                } else {
	                    index = -1;
	                }
	            }

	            if (self.indexMappings_ && index >= 0 && index < self.indexMappings_.length) {
	                return self.indexMappings_[index];
	            }
	            return index;
	        }

	        function mapToViewRow_(row) {
	            var self = this;
	            var index = row;
	            if (self.indexMappings_) {
	                index = self.indexMappings_.indexOf(row);
	            }

	            if (index !== -1) {
	                var mappingIndexes;
	                if (self.groups_) {
	                    mappingIndexes = self.groups_.getIndexMappingIndexes();
	                    return mappingIndexes.indexOf(index);
	                } else if (self.rootNode_) {
	                    mappingIndexes = self.rootNode_.getIndexMappingIndexes();
	                    return mappingIndexes.indexOf(index);
	                }
	            }
	            return index;
	        }

	        function clearAllStates_() {
	            var self = this;
	            clearFilterStates_.call(self);
	            clearGroupStates_.call(self);
	            clearHierachyStates_.call(self);
	        }

	        function clearFilterStates_() {
	            var self = this;
	            var rowCount = self.dataColumns_.getDimension();
	            self.filterExpr_ = null;
	            self.rowStates_ = [];
	            self.rowStates_.length = rowCount;
	            self.filterStates_ = null;
	            self.indexMappings_ = null;
	        }

	        function clearGroupStates_() {
	            var self = this;
	            self.groups_ = null;
	            self.groupInfos_ = null;
	        }

	        function clearHierachyStates_() {
	            var self = this;
	            self.rootNode_ = null;
	            self.hierachyInfo_ = null;
	        }

	        function createTree_(group, parentNode, groups, keyColObj) {
	            var self = this;
	            for (var i = 0; i < group.itemCount; i++) {
	                new CalcNode_(self, group.items[i], parentNode, self.hierarchyInfo_.collapsed);
	            }
	            var nodes = parentNode.children;
	            if (nodes.length > 0) {
	                for (var j = 0; j < nodes.length; j++) {
	                    var node = nodes[j];
	                    var index = node.itemIndex;
	                    var srcIndex = index;
	                    var indexMappings = self.indexMappings_;
	                    if (indexMappings && index >= 0 && index < indexMappings.length) {
	                        srcIndex = indexMappings[index];
	                    }
	                    var keyValue = getSingleValue_.call(self, keyColObj, srcIndex);
	                    node.value = keyValue;
	                    //if (self.cachedNodeStatus_.hasOwnProperty(keyValue)) {
	                    //    node.collapsed = self.cachedNodeStatus_[keyValue];
	                    //}
	                    var childGroup = _.find(groups, _.matchesProperty('name', keyValue));
	                    if (childGroup) {
	                        createTree_.call(self, childGroup, node, groups, keyColObj);
	                    }
	                }
	            }
	        }

	        CalcTableModel.createTree_ = createTree_;

	        function sortNode_(node, sortInfos, sortColumns) {
	            var self = this;
	            if (!sortColumns) {
	                sortColumns = {};
	                _.forEach(sortInfos, function(sortInfo) {
	                    if (!sortInfo.hasOwnProperty('ascending')) {
	                        sortInfo.ascending = true;
	                    } else {
	                        sortInfo.ascending = !!sortInfo.ascending;
	                    }
	                    sortColumns[sortInfo.field] = self.dataColumns_.findColumn(sortInfo.field) || self.calcColumns_.findColumn(sortInfo.field);
	                });
	            }
	            node.children.sort(function(node1, node2) {
	                for (var i = 0, sortLen = sortInfos.length; i < sortLen; i++) {
	                    // get values
	                    var sd = sortInfos[i];
	                    var sortCol = sortColumns[sd.field];
	                    var v1;
	                    var v2;
	                    if (sortCol) {
	                        var srcIndex1 = self.indexMappings_ ? self.indexMappings_[node1.itemIndex] : node1.itemIndex;
	                        var srcIndex2 = self.indexMappings_ ? self.indexMappings_[node2.itemIndex] : node2.itemIndex;
	                        v1 = getSingleValue_.call(self, sortCol, srcIndex1);
	                        v2 = getSingleValue_.call(self, sortCol, srcIndex2);
	                        if (sd.converter) {
	                            v1 = sd.converter(v1);
	                            v2 = sd.converter(v2);
	                        }
	                    }

	                    // check for NaN (isNaN returns true for NaN but also for non-numbers)
	                    if (v1 !== v1) {
	                        v1 = null;
	                    }
	                    if (v2 !== v2) {
	                        v2 = null;
	                    }

	                    // ignore case when sorting  (but add the original string to keep the
	                    // strings different and the sort consistent, 'aa' between 'AA' and 'bb')
	                    if (_.isString(v1)) {
	                        v1 = v1.toLowerCase() + v1;
	                    }
	                    if (_.isString(v2)) {
	                        v2 = v2.toLowerCase() + v2;
	                    }

	                    // compare the values (at last!)
	                    var cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
	                    if (cmp !== 0) {
	                        return sd.ascending ? +cmp : -cmp;
	                    }
	                }
	                return 0;
	            });
	            if (node.children.length > 0) {
	                _.forEach(node.children, function(childNode) {
	                    sortNode_.call(self, childNode, sortInfos, sortColumns);
	                });
	            }
	        }

	        CalcTableModel.sortNode_ = sortNode_;

	        return CalcTableModel;
	    })();
	    CalcModels.CalcTableModel = CalcTableModel;

	    var DataColumnsModel = (function() {
	        function DataColumnsModel(dataSource, columnDefs) {
	            var self = this;
	            self.dataSource = dataSource;
	            var srcArray;
	            var dimension;
	            if (_.isArray(dataSource)) {
	                srcArray = dataSource;
	            } else if (dataSource.getSourceArray) {
	                srcArray = dataSource.getSourceArray();
	            }
	            if (srcArray) {
	                self.sourceCollection = srcArray;
	                dimension = srcArray.length;
	            } else if (dataSource.getDimension) {
	                dimension = dataSource.getDimension();
	            }

	            var defaultCols = getDefaultColumns_.call(self);
	            if (dataSource.getColumns || columnDefs) {
	                var columns = (dataSource.getColumns && dataSource.getColumns()) || columnDefs;
	                self.columns = _.map(columns, function(col) {
	                    var dirtyStates = [];
	                    dirtyStates.length = dimension;
	                    if (col.name && col.field) {
	                        return {
	                            name: col.name,
	                            field: col.field,
	                            type: CalcHelper.DATA_COLUMN,
	                            dirtyStates: dirtyStates,
	                            dirty: false,
	                            dataType: undefined
	                        };
	                    }
	                });
	                if (defaultCols) {
	                    _.forEach(defaultCols, function(defCol) {
	                        if (!_.find(self.columns, _.matchesProperty('field', defCol.field))) {
	                            self.columns.push(defCol);
	                        }
	                    });
	                }
	            }
	            if (!self.columns || self.columns.length === 0) {
	                self.columns = defaultCols;
	            }
	        }

	        DataColumnsModel.prototype = {
	            getRowItem: function(row) {
	                var self = this;
	                var item;
	                if (self.sourceCollection) {
	                    item = self.sourceCollection[row];
	                } else if (self.getDataItem()) {
	                    item = self.getDataItem(row);
	                }
	                if (item) {
	                    return item;
	                } else {
	                    throw 'can not find the item at index ' + row;
	                }
	            },

	            getDimension: function() {
	                var self = this;
	                if (self.sourceCollection) {
	                    return self.sourceCollection.length;
	                } else if (self.dataSource.getDimension) {
	                    return self.dataSource.getDimension();
	                }
	                return 0;
	            },

	            getValue: function(row, column) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return;
	                //}
	                var field = colObj.field;
	                var value;
	                if (self.sourceCollection) {
	                    try {
	                        value = self.sourceCollection[row][field];
	                    } catch (e) {
	                        console.log(e);
	                    }
	                } else if (self.dataSource.getDataItem) {
	                    var item = self.dataSource.getDataItem(row);
	                    if (item) {
	                        value = item[field];
	                    }
	                }
	                var converter = colObj.converter;
	                if (!converter || !_.isFunction(converter)) {
	                    return value;
	                }
	                return converter(value);
	            },

	            findColumn: function(column) {
	                return _.find(this.columns, _.matchesProperty('name', column));
	            },

	            hasDirty: function(column) {
	                var self = this;
	                var colObj = self.findColumn(column);
	                if (!colObj) {
	                    return false;
	                }
	                var states = colObj.dirtyStates;
	                for (var i = 0, len = states.length; i < len; i++) {
	                    if (states[i] === true) {
	                        return true;
	                    }
	                }
	                return false;
	            },

	            dirty: function(column, index) {
	                markDirty_.call(this, column, index, true);
	            },

	            unDirty: function(column, index) {
	                markDirty_.call(this, column, index, false);
	            }
	        };

	        function markDirty_(column, index, state) {
	            var self = this;
	            var colObj = column;
	            if (_.isString(column)) {
	                colObj = self.findColumn(column);
	            }
	            if (!colObj) {
	                return;
	            }
	            if (index >= 0 && index < self.getDimension()) {
	                colObj.dirtyStates[index] = state;
	            } else if (index === -1) {
	                if (state) {
	                    _.fill(colObj.dirtyStates, true);
	                } else {
	                    var dirtyStates = [];
	                    dirtyStates.length = self.getDimension();
	                    colObj.dirtyStates = dirtyStates;
	                }
	            }
	        }

	        function getDefaultColumns_() {
	            var self = this;
	            var sourceCollection = self.sourceCollection;
	            var firstItem;
	            if (sourceCollection && sourceCollection.length > 0) {
	                firstItem = sourceCollection[0];
	            } else if (sourceCollection && sourceCollection.getDataItem) {
	                firstItem = sourceCollection.getDataItem(0);
	            }
	            if (firstItem) {
	                var dimension = self.getDimension();
	                return _.map(_.keys(firstItem), function(key) {
	                    var dirtyStates = [];
	                    dirtyStates.length = dimension;
	                    return {
	                        name: key,
	                        field: key,
	                        type: CalcHelper.DATA_COLUMN,
	                        dirtyStates: dirtyStates,
	                        dirty: false,
	                        dataType: undefined
	                    };
	                });
	            }
	            return null;
	        }

	        return DataColumnsModel;
	    })();
	    CalcModels.DataColumnsModel = DataColumnsModel;

	    var CalcColumnsModel = (function() {
	        function CalcColumnsModel(calcSource) {
	            var self = this;
	            self.calcSource_ = calcSource;
	            self.name = calcSource.name;
	            self.columns_ = [];
	            self.parser_ = calcSource.getParser();
	            self.evaluator_ = calcSource.getEvaluator();
	            //if (columns) {
	            //    _.forEach(columns, function(column) {
	            //        addColumn_.call(self, column.name, column.field);
	            //    });
	            //}
	        }

	        CalcColumnsModel.prototype = {
	            addColumn: function(column, formula) {
	                return addColumn_.call(this, column, formula);
	            },

	            removeColumn: function(column) {
	                _.remove(this.columns_, _.matchesProperty('name', column));
	            },

	            getValues: function(column) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return null;
	                //}
	                if (self.hasDirty(colObj)) {
	                    self.calculateColumn(colObj);
	                }
	                return colObj.values;
	            },

	            getValue: function(column, index) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return null;
	                //}
	                if (colObj.dirtyStates[index] !== false) {
	                    self.calculateValue(column, index);
	                }
	                return colObj.values[index];
	            },

	            calculateValue: function(column, index) {
	                var self = this;
	                var colObj = column;
	                if (_.isString(column)) {
	                    colObj = self.findColumn(column);
	                }
	                if (!colObj) {
	                    return null;
	                }
	                calculateColumn_.call(this, colObj, index, false);
	            },

	            calculateColumn: function(column, force) {
	                var self = this;
	                var colObj = column;
	                if (_.isString(column)) {
	                    colObj = self.findColumn(column);
	                }
	                if (!colObj) {
	                    return null;
	                }
	                calculateColumn_.call(this, colObj, -1, force);
	            },

	            findColumn: function(column) {
	                return _.find(this.columns_, _.matchesProperty('name', column));
	            },

	            getColumns: function() {
	                return this.columns_;
	            },

	            hasDirty: function(column) {
	                //var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return null;
	                //}
	                var states = colObj.dirtyStates;
	                for (var i = 0, len = states.length; i < len; i++) {
	                    if (states[i] !== false) {
	                        return true;
	                    }
	                }
	                return false;
	            },

	            dirty: function(column, index, newFormula) {
	                var self = this;
	                var colObj = column;
	                //if (_.isString(column)) {
	                //    colObj = self.findColumn(column);
	                //}
	                //if (!colObj) {
	                //    return;
	                //}
	                if (newFormula && colObj.formula !== newFormula) {
	                    updateColumnFormula.call(self, colObj, newFormula);
	                } else {
	                    var dimension = self.calcSource_.getDimension();
	                    if (index >= 0 && index < dimension) {
	                        colObj.dirtyStates[index] = true;
	                    } else if (index === -1) {
	                        var dirtyStates = [];
	                        dirtyStates.length = dimension;
	                        colObj.dirtyStates = dirtyStates;
	                    }
	                }
	            },

	            updateColumnFormula: function(column, newFormula) {
	                var self = this;
	                var colObj = self.findColumn(column);
	                if (colObj) {
	                    if (!newFormula) {
	                        newFormula = colObj.formula;
	                    }
	                    updateColumnFormula.call(self, colObj, newFormula);
	                }
	            }
	        };

	        function addColumn_(column, formula) {
	            var self = this;
	            var rowCount = self.calcSource_.getDimension();
	            var values = [];
	            var dirtyStates = [];
	            values.length = rowCount;
	            dirtyStates.length = rowCount;
	            var context = new CalcContext.ParserContext(self.calcSource_);
	            var expression = self.parser_.parse(formula, context);
	            if (!expression) {
	                return null;
	            }
	            var depends = CalcHelper.resolveDepends(expression, self.calcSource_);
	            var calcColumn = {
	                name: column,
	                type: CalcHelper.CALC_COLUMN,
	                formula: formula,
	                expression: expression,
	                values: values,
	                dirtyStates: dirtyStates,
	                depends: depends,
	                isCalculating: false,
	                dirty: false
	            };
	            self.columns_.push(calcColumn);
	            return calcColumn;
	        }

	        function calculateColumn_(column, index, force) {
	            var self = this;
	            var colObj = column;
	            column = colObj.name;
	            var dirtyStates;
	            var isDepDirty = false;
	            var fieldsModel = self.calcSource_.getModel(CalcHelper.CALC_FIELD);
	            var dataColsModel = self.calcSource_.getModel(CalcHelper.DATA_COLUMN);
	            var i;
	            var len;
	            var depends;
	            colObj.isCalculating = true;
	            try {
	                var calculatingStack = [];
	                calculatingStack.push({type: CalcHelper.CALC_COLUMN, table: self.name, column: column});
	                while (calculatingStack.length !== 0) {
	                    var topCalcDep = calculatingStack[calculatingStack.length - 1];
	                    var topCalcObj = CalcHelper.getCalcObj(topCalcDep, self.calcSource_);
	                    if (topCalcObj === null) {
	                        calculatingStack.pop();
	                        continue;
	                    }
	                    var hasDirtyDepends = false;
	                    depends = topCalcObj.depends;
	                    if (depends) {
	                        for (i = 0, len = depends.length; i < len; i++) {
	                            var depCalcObj = CalcHelper.getCalcObj(depends[i], self.calcSource_);
	                            if (depCalcObj) {
	                                var depDirtyIndex = depends[i].aggContext ? -1 : index;
	                                isDepDirty = false;
	                                if (depDirtyIndex === -1) {
	                                    if ((depCalcObj.type === CalcHelper.CALC_FIELD && depCalcObj.dirty) ||
	                                            (depCalcObj.type === CalcHelper.DATA_COLUMN && dataColsModel.hasDirty(depCalcObj)) ||
	                                            (depCalcObj.type === CalcHelper.CALC_COLUMN && self.hasDirty(depCalcObj))) {
	                                        isDepDirty = true;
	                                    }
	                                } else {
	                                    if (depCalcObj.type === CalcHelper.DATA_COLUMN) {
	                                        dirtyStates = depCalcObj.dirtyStates;
	                                        if (dirtyStates[depDirtyIndex] === true) {
	                                            isDepDirty = true;
	                                        }
	                                    } else if (depCalcObj.type === CalcHelper.CALC_COLUMN) {
	                                        dirtyStates = depCalcObj.dirtyStates;
	                                        if (dirtyStates[depDirtyIndex] !== false) {
	                                            isDepDirty = true;
	                                        }

	                                    } else if (depCalcObj.type === CalcHelper.CALC_FIELD) {
	                                        if (depCalcObj.dirty !== false) {
	                                            isDepDirty = true;
	                                        }
	                                    }
	                                }
	                            }
	                            if (isDepDirty) {
	                                calculatingStack.push(depends[i]);
	                                hasDirtyDepends = true;
	                            }
	                        }
	                    }
	                    if (!hasDirtyDepends) {
	                        if (topCalcDep.type === CalcHelper.CALC_COLUMN) {
	                            calculateColumnInternal_.call(this, topCalcObj, topCalcDep.aggContext ? -1 : index, force);
	                            calculatingStack.pop();
	                        } else if (topCalcDep.type === CalcHelper.CALC_FIELD && fieldsModel) {
	                            fieldsModel.calculateField(topCalcObj.name);
	                            calculatingStack.pop();
	                        } else if (topCalcDep.type === CalcHelper.DATA_COLUMN) {
	                            dataColsModel.unDirty(topCalcObj.name, index);
	                            calculatingStack.pop();
	                        }
	                    }
	                }

	            } catch (e) {
	                if (e) {
	                    console.log('calculate exception thrown!');
	                    console.log(e.message);
	                    console.log(e.stack);
	                }
	            } finally {
	                colObj.isCalculating = false;
	            }
	        }

	        function calculateColumnInternal_(colObj, index, force) {
	            var self = this;
	            if (index === -1) {
	                if (colObj.dirty) { // hasn't been calculated, so calculate all is more efficient.
	                    calculateValues_.call(this, colObj);
	                } else { // has already calculated all once, so now only need to calculate the dirty items.
	                    var rowCount = self.calcSource_.getDimension();
	                    for (var row = 0; row < rowCount; row++) {
	                        if (force || colObj.dirtyStates[row] !== false) {
	                            calculateSingleValue_.call(self, colObj, row);
	                        }
	                    }
	                }
	            } else {
	                if (force || colObj.dirtyStates[index] !== false) {
	                    calculateSingleValue_.call(self, colObj, index);
	                }
	            }
	        }

	        function calculateSingleValue_(colObj, index) {
	            var self = this;
	            if (colObj.type === CalcHelper.CALC_COLUMN) {
	                var calcSource = self.calcSource_;
	                var calcTable = calcSource.getModel(CalcHelper.CALC_TABLE);
	                var context = new CalcContext.EvaluateContext(calcSource);
	                context.currentRowInternal_ = index;
	                calcTable.beginContextManipulate();
	                var result = self.evaluator_.evaluateExpression(colObj.expression, context);
	                if (CalcHelper.columnRef(result) && index !== -1) {
	                    result = result.getValue(index);
	                }
	                colObj.values[index] = result;
	                colObj.dirtyStates[index] = false;
	                calcTable.endContextManipulate();
	            }
	        }

	        function calculateValues_(colObj) {
	            var self = this;
	            if (colObj.type === CalcHelper.CALC_COLUMN) {
	                var calcSource = self.calcSource_;
	                var calcTable = calcSource.getModel(CalcHelper.CALC_TABLE);
	                var context = new CalcContext.EvaluateContext(self.calcSource_);
	                context.currentRowInternal_ = -1;
	                calcTable.beginContextManipulate();
	                var values = self.evaluator_.evaluateExpression(colObj.expression, context);
	                for (var i = 0, len = values.length; i < len; i++) {
	                    var srcRow = self.calcSource_.mapToSourceRow(i);
	                    colObj.values[srcRow] = values[i];
	                    colObj.dirtyStates[srcRow] = false;
	                }
	                calcTable.endContextManipulate();
	            }
	        }

	        function updateColumnFormula(colObj, newFormula) {
	            var self = this;
	            colObj.formula = newFormula;
	            var context = new CalcContext.ParserContext(self.calcSource_);
	            var expression = self.parser_.parse(newFormula, context);
	            colObj.expression = expression;
	            if (!expression) {
	                colObj.depends = null;
	            } else {
	                var depends = CalcHelper.resolveDepends(expression, self.calcSource_);
	                colObj.depends = depends;
	            }

	            var dirtyStates = [];
	            dirtyStates.length = self.calcSource_.getDimension();
	            colObj.dirtyStates = dirtyStates;
	        }

	        return CalcColumnsModel;
	    })();
	    CalcModels.CalcColumnsModel = CalcColumnsModel;

	    var CalcFieldsModel = (function() {
	        function CalcFieldsModel(calcSource) {
	            var self = this;
	            self.calcSource_ = calcSource;
	            self.parser_ = calcSource.getParser();
	            self.evaluator_ = calcSource.getEvaluator();
	            self.calcFields_ = [];
	        }

	        CalcFieldsModel.prototype = {
	            addField: function(name, formula) {
	                var self = this;
	                var context = new CalcContext.ParserContext(self.calcSource_);
	                var expression = self.parser_.parse(formula, context);
	                if (!expression) {
	                    return null;
	                }
	                var depends = CalcHelper.resolveDepends(expression, self.calcSource_);
	                var calcField = {
	                    name: name,
	                    type: CalcHelper.CALC_FIELD,
	                    formula: formula,
	                    expression: expression,
	                    value: undefined,
	                    dirty: true,
	                    depends: depends,
	                    isCalculating: false
	                };
	                self.calcFields_.push(calcField);
	                return calcField;
	            },

	            removeField: function(name) {
	                var calcField = _.remove(this.calcFields_, function(field) {
	                    return field.name === name;
	                });
	                return calcField;
	            },

	            calculateField: function(name, groupPath) {
	                var self = this;
	                var calcField = self.findField(name);
	                if (calcField.isCalculating) {
	                    return;
	                }

	                var calcColsModel = self.calcSource_.getModel(CalcHelper.CALC_COLUMN);
	                var dataColsModel = self.calcSource_.getModel(CalcHelper.DATA_COLUMN);
	                var i;
	                var len;
	                var depends;
	                calcField.isCalculating = true;
	                try {
	                    var calculatingStack = [];
	                    calculatingStack.push({type: CalcHelper.CALC_FIELD, name: name});
	                    while (calculatingStack.length !== 0) {
	                        var topCalcDep = calculatingStack[calculatingStack.length - 1];
	                        var topCalcObj = CalcHelper.getCalcObj(topCalcDep, self.calcSource_);
	                        if (topCalcObj === null) {
	                            calculatingStack.pop();
	                            continue;
	                        }
	                        var hasDirtyDepends = false;
	                        depends = topCalcObj.depends;
	                        if (depends) {
	                            for (i = 0, len = depends.length; i < len; i++) {
	                                var depCalcObj = CalcHelper.getCalcObj(depends[i], self.calcSource_);
	                                var isDpeDirty = false;
	                                if (depCalcObj) {
	                                    if ((depCalcObj.type === CalcHelper.CALC_FIELD && depCalcObj.dirty) ||
	                                            (depCalcObj.type === CalcHelper.DATA_COLUMN && dataColsModel.hasDirty(depCalcObj)) ||
	                                            (depCalcObj.type === CalcHelper.CALC_COLUMN && calcColsModel.hasDirty(depCalcObj))) {
	                                        isDpeDirty = true;
	                                    }

	                                    if (isDpeDirty) {
	                                        calculatingStack.push(depends[i]);
	                                        hasDirtyDepends = true;
	                                    }
	                                }
	                            }
	                        }
	                        if (!hasDirtyDepends) {
	                            if (topCalcDep.type === CalcHelper.CALC_COLUMN && calcColsModel) {
	                                calcColsModel.calculateColumn(topCalcObj.name);
	                                calculatingStack.pop();
	                            } else if (topCalcDep.type === CalcHelper.DATA_COLUMN && dataColsModel) {
	                                dataColsModel.unDirty(topCalcObj.name, -1);
	                                calculatingStack.pop();
	                            } else if (topCalcDep.type === CalcHelper.CALC_FIELD) {
	                                calculateFieldInternal_.call(this, topCalcObj, groupPath);
	                                calculatingStack.pop();
	                            }
	                        }
	                    }

	                } catch (e) {
	                    if (e) {
	                        console.log('calculate exception thrown!');
	                        console.log(e.message);
	                        console.log(e.stack);
	                    }
	                } finally {
	                    calcField.isCalculating = false;
	                }
	            },

	            findField: function(name) {
	                return _.find(this.calcFields_, _.matchesProperty('name', name));
	            },

	            getValue: function(name, groupPath) {
	                var self = this;
	                var calcFieldObj = self.findField(name);
	                if (calcFieldObj) {
	                    if (calcFieldObj.dirty) {
	                        self.calculateField(name, groupPath);
	                    }
	                    return calcFieldObj.value;
	                }
	            },

	            getFields: function() {
	                return this.calcFields_;
	            },

	            dirty: function(field) {
	                var self = this;
	                var calcField = field;
	                if (_.isString(field)) {
	                    calcField = self.findField(field);
	                }
	                if (calcField) {
	                    calcField.dirty = true;
	                }
	            }
	        };

	        function calculateFieldInternal_(calcFieldObj, groupPath) {
	            var self = this;
	            if (calcFieldObj.dirty) {
	                var context = new CalcContext.EvaluateContext(self.calcSource_, undefined, groupPath);
	                context.currentRowInternal_ = -1;
	                calcFieldObj.value = self.evaluator_.evaluateExpression(calcFieldObj.expression, context);
	                calcFieldObj.dirty = false;
	            }
	        }

	        return CalcFieldsModel;
	    })();
	    CalcModels.CalcFieldsModel = CalcFieldsModel;

	    var CalcGroupFieldsModel = (function() {
	        function CalcGroupFieldsModel(calcSource) {
	            var self = this;
	            self.calcSource_ = calcSource;
	            self.parser_ = calcSource.getParser();
	            self.evaluator_ = calcSource.getEvaluator();
	            self.calcFields_ = [];
	            initGroups_.call(self);
	        }

	        CalcGroupFieldsModel.prototype = {
	            addField: function(name, formula) {
	                var self = this;
	                var context = new CalcContext.ParserContext(self.calcSource_);
	                var expression = self.parser_.parse(formula, context);
	                if (!expression) {
	                    return null;
	                }
	                var depends = CalcHelper.resolveDepends(expression, self.calcSource_);
	                var fieldObj = {
	                    name: name,
	                    type: CalcHelper.CALC_G_FIELD,
	                    formula: formula,
	                    expression: expression,
	                    value: undefined,
	                    dirty: true,
	                    depends: depends,
	                    isCalculating: false
	                };
	                var calcField = {};
	                _.merge(calcField, self.rootGroupField_, fieldObj);
	                self.calcFields_.push(calcField);
	                return calcField;
	            },

	            calculateField: function(name, groupPath) {
	                var self = this;
	                var calcField = self.findField(name);
	                if (calcField.isCalculating) {
	                    return;
	                }

	                var fieldsModel = self.calcSource_.getModel(CalcHelper.CALC_FIELD);
	                var calcColsModel = self.calcSource_.getModel(CalcHelper.CALC_COLUMN);
	                var dataColsModel = self.calcSource_.getModel(CalcHelper.DATA_COLUMN);
	                var i;
	                var len;
	                var depends;
	                calcField.isCalculating = true;
	                try {
	                    var calculatingStack = [];
	                    calculatingStack.push({type: CalcHelper.CALC_G_FIELD, name: name});
	                    while (calculatingStack.length !== 0) {
	                        var topCalcDep = calculatingStack[calculatingStack.length - 1];
	                        var topCalcObj = CalcHelper.getCalcObj(topCalcDep, self.calcSource_);
	                        if (topCalcObj === null) {
	                            calculatingStack.pop();
	                            continue;
	                        }
	                        var hasDirtyDepends = false;
	                        depends = topCalcObj.depends;
	                        if (depends) {
	                            for (i = 0, len = depends.length; i < len; i++) {
	                                var depCalcObj = CalcHelper.getCalcObj(depends[i], self.calcSource_);
	                                var isDpeDirty = false;
	                                if (depCalcObj) {
	                                    if ((depCalcObj.type === CalcHelper.CALC_FIELD && depCalcObj.dirty) ||
	                                            (depCalcObj.type === CalcHelper.DATA_COLUMN && dataColsModel.hasDirty(depCalcObj)) ||
	                                            (depCalcObj.type === CalcHelper.CALC_COLUMN && calcColsModel.hasDirty(depCalcObj))) {
	                                        isDpeDirty = true;
	                                    }

	                                    if (isDpeDirty) {
	                                        calculatingStack.push(depends[i]);
	                                        hasDirtyDepends = true;
	                                    }
	                                }
	                            }
	                        }
	                        if (!hasDirtyDepends) {
	                            if (topCalcDep.type === CalcHelper.CALC_COLUMN && calcColsModel) {
	                                calcColsModel.calculateColumn(topCalcObj.name);
	                                calculatingStack.pop();
	                            } else if (topCalcDep.type === CalcHelper.CALC_FIELD && fieldsModel) {
	                                fieldsModel.calculateField(topCalcObj.name);
	                                calculatingStack.pop();
	                            } else if (topCalcDep.type === CalcHelper.DATA_COLUMN && dataColsModel) {
	                                dataColsModel.unDirty(topCalcObj.name, -1);
	                                calculatingStack.pop();
	                            } else if (topCalcDep.type === CalcHelper.CALC_G_FIELD) {
	                                calculateGroupFieldInternal_.call(self, topCalcObj, groupPath);
	                                calculatingStack.pop();
	                            }
	                        }
	                    }

	                } catch (e) {
	                    if (e) {
	                        console.log('calculate exception thrown!');
	                        console.log(e.message);
	                        console.log(e.stack);
	                    }
	                } finally {
	                    calcField.isCalculating = false;
	                }
	            },

	            findField: function(name) {
	                return _.find(this.calcFields_, _.matchesProperty('name', name));
	            },

	            getValue: function(name, groupPath) {
	                var self = this;
	                var rootGroupFieldObj = self.findField(name);
	                var groupFieldObj = findGroupField_.call(self, rootGroupFieldObj, groupPath);
	                if (groupFieldObj) {
	                    if (groupFieldObj.dirty) {
	                        self.calculateField(name, groupPath);
	                    }
	                    return groupFieldObj.value;
	                }
	                return;
	            },

	            getFields: function() {
	                return this.calcFields_;
	            },

	            updateGroups: function() {
	                var self = this;
	                initGroups_.call(self);
	                if (self.calcFields_ && self.rootGroupField_) {
	                    _.forEach(self.calcFields_, function(calcField) {
	                        calcField.fields = _.clone(self.rootGroupField_.fields, true);
	                        calcField.dirty = true;
	                    });
	                }
	            },

	            dirty: function(field) {
	                var self = this;
	                var calcField = field;
	                if (_.isString(field)) {
	                    calcField = self.findField(field);
	                }
	                if (calcField) {
	                    dirtyFields_.call(self, calcField);
	                }
	            }
	        };

	        function initGroups_() {
	            var self = this;
	            var rootGroup = self.calcSource_.getGroups();
	            if (rootGroup) {
	                self.rootGroupField_ = {value: undefined};
	                resolveGroups_.call(self, rootGroup, self.rootGroupField_);
	            }
	        }

	        function resolveGroups_(group, groupField) {
	            if (group.groups) {
	                if (!groupField.fields) {
	                    groupField.fields = [];
	                }
	                _.forEach(group.groups, function(subGroup) {
	                    var subField = {value: undefined, dirty: true};
	                    groupField.fields.push(subField);
	                    resolveGroups_(subGroup, subField);
	                });
	            }
	        }

	        function findGroupField_(rootFieldObj, groupPath) {
	            //var self = this;
	            var currentField = rootFieldObj;
	            if (!currentField) {
	                return;
	            }
	            for (var i = 0, len = groupPath.length; i < len; i++) {
	                var index = groupPath[i];
	                var fields = currentField.fields;
	                if (fields && index < fields.length) {
	                    currentField = fields[index];
	                } else {
	                    return null;
	                }
	            }
	            return currentField;
	        }

	        function calculateGroupFieldInternal_(rootFieldObj, groupPath) {
	            var self = this;
	            var groupFieldObj = findGroupField_.call(self, rootFieldObj, groupPath);
	            if (groupFieldObj && groupFieldObj.dirty) {
	                var context = new CalcContext.EvaluateContext(self.calcSource_, undefined, groupPath);
	                context.currentRowInternal_ = -1;
	                groupFieldObj.value = self.evaluator_.evaluateExpression(rootFieldObj.expression, context);
	                groupFieldObj.dirty = false;
	            }
	        }

	        function dirtyFields_(calcField) {
	            var self = this;
	            calcField.dirty = true;
	            var subFields = calcField.fields;
	            if (subFields) {
	                for (var i = 0, len = subFields.length; i < len; i++) {
	                    dirtyFields_.call(self, subFields[i]);
	                }
	            }
	        }

	        return CalcGroupFieldsModel;
	    })();
	    CalcModels.CalcGroupFieldsModel = CalcGroupFieldsModel;

	    module.exports = CalcModels;
	})();


/***/ },
/* 9 */
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

	(function() {
	    'use strict';
	    var Calc = __webpack_require__(1);
	    var CalcModels = __webpack_require__(8);
	    var CalcHelper = __webpack_require__(6);
	    var CalcEvaluator = __webpack_require__(5);
	    var CalcParser = __webpack_require__(3).Parser;
	    var CalcContext = __webpack_require__(2);

	    var CalcSource = (function() {
	        function CalcSource(name, dataSource, columnDefs) {
	            if (name && dataSource) {
	                var self = this;
	                self.name = name;
	                self.dataSource = dataSource;
	                var dataColumns;
	                if (columnDefs) {
	                    dataColumns = _.filter(columnDefs, function(column) {
	                        return column.field && !_.startsWith(_.trim(column.field), '=');
	                    });
	                }
	                self.dataColumns_ = new CalcModels.DataColumnsModel(dataSource, dataColumns);
	                self.calcColumns_ = new CalcModels.CalcColumnsModel(self);
	                self.calcTable_ = new CalcModels.CalcTableModel(self, self.dataColumns_, self.calcColumns_);
	                self.calcFields_ = new CalcModels.CalcFieldsModel(self);
	                self.calcGroupFields_ = new CalcModels.CalcGroupFieldsModel(self);
	                if (columnDefs) {
	                    _.forEach(columnDefs, function(column) {
	                        if (column.field && _.startsWith(_.trim(column.field), '=')) {
	                            self.calcColumns_.addColumn(column.name, column.field);
	                        }
	                    });
	                }
	            }
	        }

	        CalcSource.prototype = {
	            getName: function() {
	                return this.name;
	            },
	            getRowItem: function(row) {
	                return this.calcTable_.getRowItem(row);
	            },
	            hasColumn: function(column) {
	                var self = this;
	                return !!self.calcTable_.findColumn(column);
	            },
	            hasField: function(field) {
	                var self = this;
	                return !!self.calcFields_.findField(field);
	            },
	            addCalcColumn: function(name, formula) {
	                this.calcColumns_.addColumn(name, formula);
	            },
	            addCalcField: function(name, formula) {
	                var self = this;
	                self.calcFields_.addField(name, formula);
	                var unknownExprColumns = getUnknownExpressionColumns.call(self);
	                if (unknownExprColumns.length > 0) {
	                    _.forEach(unknownExprColumns, function(col) {
	                        self.calcColumns_.updateColumnFormula(col);
	                    });
	                }
	            },
	            removeCalcField: function(name) {
	                return this.calcFields_.removeField(name);
	            },
	            getCalcFieldValue: function(name) {
	                return this.calcFields_.getValue(name);
	            },
	            addCalcGroupField: function(name, formula) {
	                this.calcGroupFields_.addField(name, formula);
	            },

	            addRowItem: function(item, srcIndex) { // jshint ignore:line
	                var self = this;
	                var addIndex = srcIndex ? srcIndex : self.getDimension();
	                var srcCollection = self.dataColumns_.sourceCollection;
	                if (srcCollection) {
	                    if (srcCollection.addItem && _.isFunction(srcCollection.addItem)) {
	                        srcCollection.addItem(item, addIndex);
	                    } else if (_.isArray(srcCollection)) {
	                        srcCollection.splice(addIndex, 0, item);
	                    }
	                }
	                var allColumns = self.dataColumns_.columns.concat(self.calcColumns_.columns_);
	                _.forEach(allColumns, function(colObj) {
	                    if (colObj.prototype === CalcHelper.CALC_COLUMN) {
	                        colObj.values.splice(addIndex, 0, undefined);
	                    }
	                    colObj.dirtyStates.splice(addIndex, 0, true);
	                    dirtyColumn_.call(self, colObj, srcIndex);
	                });
	            },

	            removeRowItem: function(srcIndex) { // jshint ignore:line
	                var self = this;
	                var dimension = self.getDimension();
	                var srcCollection = self.dataColumns_.sourceCollection;
	                if (srcCollection) {
	                    if (srcCollection.removeItem && _.isFunction(srcCollection.removeItem)) {
	                        srcCollection.removeItem(srcIndex);
	                    } else if (_.isArray(srcCollection)) {
	                        srcCollection.splice(srcIndex, 1);
	                    }
	                }
	                var allColumns = self.dataColumns_.columns.concat(self.calcColumns_.columns_);
	                _.forEachRight(allColumns, function(colObj) {
	                    if (colObj.prototype === CalcHelper.CALC_COLUMN) {
	                        colObj.values.splice(srcIndex, 1);
	                    }
	                    colObj.dirtyStates.splice(srcIndex, 1);
	                    dirtyColumn_.call(self, colObj, dimension);// dirty last inexisting item
	                });
	            },

	            filter: function(expression) {
	                var self = this;
	                self.calcTable_.filter(expression);
	                self.calcFields_.calcFields_.forEach(function(calcfield) {
	                    self.dirtyField(calcfield.name);
	                });
	                self.calcGroupFields_.updateGroups();
	            },
	            sort: function(sortds) {
	                var self = this;
	                self.calcTable_.sort(sortds);
	                self.calcGroupFields_.updateGroups();
	            },
	            group: function(gds) {
	                var self = this;
	                var groups = self.calcTable_.group(gds);
	                self.calcGroupFields_.updateGroups();
	                return groups;
	            },
	            hierarchy: function(hierarchyInfo) {
	                return this.calcTable_.hierarchy(hierarchyInfo);
	            },

	            getCalcGroupFieldValue: function(name, groupPath) {
	                return this.calcGroupFields_.getValue(name, groupPath);
	            },
	            getValues: function(column, group) {
	                var self = this;
	                var colObj = self.findColumn(column);
	                if (colObj) {
	                    return this.calcTable_.getValues(colObj, group, false);
	                }
	                return null;
	            },
	            getValue: function(column, index) {
	                var self = this;
	                var colObj = self.findColumn(column);
	                if (colObj) {
	                    return this.calcTable_.getValue(colObj, index, false);
	                }
	                return null;
	            },
	            getRowCount: function() {
	                return this.calcTable_.getRowCount();
	            },
	            getDimension: function() {
	                return this.calcTable_.getDimension();
	            },
	            findColumn: function(column) {
	                var self = this;
	                return self.findDataColumn(column) || self.findCalcColumn(column);
	            },
	            findDataColumn: function(name) {
	                return this.dataColumns_.findColumn(name);
	            },
	            findCalcColumn: function(name) {
	                return this.calcColumns_.findColumn(name);
	            },
	            findCalcField: function(name) {
	                return this.calcFields_.findField(name);
	            },
	            findCalcGroupField: function(name) {
	                return this.calcGroupFields_.findField(name);
	            },
	            getFieldValue: function(name) {
	                if (this.calcFields_) {
	                    return this.calcFields_.getValue(name);
	                }
	            },
	            getDataType: function(column) {
	                var colObj = this.calcTable_.findColumn(column);
	                if (colObj) {
	                    return colObj.dataType;
	                }
	            },
	            getParser: function() {
	                return new CalcParser(Calc.parseOption);
	            },
	            getEvaluator: function() {
	                return new CalcEvaluator();
	            },
	            getParserContext: function() {
	                return new CalcContext.ParserContext(this);
	            },
	            getEvaluatorContext: function(row, groupPath) {
	                return new CalcContext.EvaluateContext(this, row, groupPath);
	            },
	            getGroups: function() {
	                return this.calcTable_.getGroups();
	            },
	            getRootNode: function() {
	                return this.calcTable_.getRootNode();
	            },
	            create: function(name, dataSource) {
	                return new CalcSource(name, dataSource);
	            },
	            clone: function() {
	                var self = this;
	                var clonedObj = new CalcSource();
	                clonedObj.name = self.name;
	                clonedObj.dataSource = self.dataSource;
	                clonedObj.dataColumns_ = self.dataColumns_;
	                clonedObj.calcColumns_ = self.calcColumns_;
	                clonedObj.calcTable_ = self.calcTable_.clone();
	                clonedObj.calcFields_ = self.calcFields_;
	                clonedObj.calcGroupFields_ = self.calcGroupFields_;
	                return clonedObj;
	            },
	            reproduce: function() {
	                var self = this;
	                var reproducedObj = new CalcSource();
	                reproducedObj.name = self.name;
	                reproducedObj.dataSource = self.dataSource;
	                reproducedObj.dataColumns_ = self.dataColumns_;
	                reproducedObj.calcColumns_ = self.calcColumns_;
	                reproducedObj.calcTable_ = self.calcTable_.reproduce();
	                reproducedObj.calcFields_ = self.calcFields_;
	                reproducedObj.calcGroupFields_ = self.calcGroupFields_;
	                return reproducedObj;
	            },
	            reproduceWithColumns: function(columns) {
	                var self = this;
	                var reproducedObj = new CalcSource();
	                reproducedObj.name = self.name;
	                reproducedObj.dataSource = self.dataSource;
	                reproducedObj.dataColumns_ = self.dataColumns_;
	                reproducedObj.calcColumns_ = self.calcColumns_;
	                reproducedObj.calcTable_ = self.calcTable_.reproduceWithColumns(columns);
	                reproducedObj.calcFields_ = self.calcFields_;
	                reproducedObj.calcGroupFields_ = self.calcGroupFields_;
	                return reproducedObj;
	            },
	            bindGroup: function(groupPath) {
	                return this.calcTable_.bindGroup(groupPath);
	            },
	            unbindGroup: function() {
	                return this.calcTable_.unbindGroup();
	            },
	            getGroupPath: function(row) {
	                return this.calcTable_.getGroupPath(row);
	            },
	            overlapFilterStates_: function(filterStates) {
	                var self = this;
	                self.calcTable_.overlapFilterStates(filterStates);
	                self.calcGroupFields_.updateGroups();
	            },
	            overlapFilterSingleState_: function(filterStates, currentRow) {
	                var self = this;
	                self.calcTable_.overlapFilterSingleState(filterStates, currentRow);
	            },
	            getModel: function(type) {
	                var self = this;
	                switch (type) {
	                    case CalcHelper.DATA_COLUMN:
	                        return self.dataColumns_;
	                    case CalcHelper.CALC_COLUMN:
	                        return self.calcColumns_;
	                    case CalcHelper.CALC_TABLE:
	                        return self.calcTable_;
	                    case CalcHelper.CALC_FIELD:
	                        return self.calcFields_;
	                    case CalcHelper.CALC_G_FIELD:
	                        return self.calcGroupFields_;
	                }
	            },
	            dirtyColumn: function(column, index, newFormula) {
	                var self = this;
	                var col = self.findColumn(column);
	                if (!col) {
	                    return;
	                }
	                if (_.isUndefined(index)) {
	                    index = -1;
	                }
	                var srcIndex = self.calcTable_.mapToSourceRow(index);
	                var wholeColumnChanged = dirtyColumn_.call(self, col, srcIndex, newFormula);
	                return index === -1 || wholeColumnChanged;
	            },
	            dirtyColumns: function() {
	                var self = this;
	                var calcColumns = self.calcColumns_.getColumns();
	                _.forEach(calcColumns, function(calcColumn) {
	                    dirtyColumn_.call(self, calcColumn, -1);
	                });
	            },
	            dirtyField: function(name) {
	                var self = this;
	                var field = self.findCalcField(name);
	                if (!field) {
	                    return;
	                }
	                self.calcFields_.dirty(name);
	                var listeners = findListenersRecursively_.call(self, {calc: field, index: -1});
	                dirtyListeners_.call(self, listeners);
	            },
	            dirtyFields: function() {
	                var self = this;
	                var fields = self.calcFields_.getFields();
	                _.forEach(fields, function(field) {
	                    self.calcFields_.dirty(field);
	                    var listeners = findListenersRecursively_.call(self, {calc: field, index: -1});
	                    dirtyListeners_.call(self, listeners);
	                });
	            },
	            dirtyAll: function() {
	                this.dirtyColumns();
	                this.dirtyFields();
	            },
	            toArray: function(group) {
	                return this.calcTable_.toArray(group);
	            },

	            mapToSourceRow: function(row) {
	                return this.calcTable_.mapToSourceRow(row);
	            },
	            mapToViewRow: function(row) {
	                return this.calcTable_.mapToViewRow(row);
	            },
	            isFilterOut: function(srcRow) {
	                return this.calcTable_.isFilterOut(srcRow);
	            }
	        };

	        function dirtyColumn_(col, srcIndex, newFormula) {
	            var self = this;
	            if (col.type === CalcHelper.DATA_COLUMN) {
	                self.dataColumns_.dirty(col, srcIndex);
	            } else if (col.type === CalcHelper.CALC_COLUMN) {
	                self.calcColumns_.dirty(col, -1, newFormula);
	            }
	            var listeners = findListenersRecursively_.call(self, {calc: col, index: srcIndex});
	            dirtyListeners_.call(self, listeners);
	            return _.any(listeners, function(listener) {
	                return listener.calc.type === CalcHelper.CALC_COLUMN && listener.index === -1;
	            });
	        }

	        function findListenersRecursively_(calcListener) {
	            var self = this;
	            var listeners = findListeners_.call(self, calcListener);
	            if (listeners.length > 0) {
	                _.forEach(listeners, function(listener) {
	                    var deepListeners = findListenersRecursively_.call(self, listener);
	                    listeners = listeners.concat(deepListeners);
	                });
	            }
	            return listeners;
	        }

	        function findListeners_(calcListener) {
	            var self = this;
	            var listeners = [];
	            var calcCols = self.calcColumns_.getColumns();
	            _.forEach(calcCols, function(calcCol) {
	                if (isInDepends_.call(self, calcListener.calc, calcCol)) {
	                    if (isCalcInAgg_(calcListener.calc, calcCol.expression)) {
	                        listeners.push({calc: calcCol, index: -1});
	                    } else {
	                        listeners.push({calc: calcCol, index: calcListener.index});
	                    }
	                }
	            });
	            var calcFields = self.calcFields_.getFields();
	            _.forEach(calcFields, function(calcField) {
	                if (isInDepends_.call(self, calcListener.calc, calcField)) {
	                    listeners.push({calc: calcField, index: -1});
	                }
	            });
	            var calcGroupFields = self.calcGroupFields_.getFields();
	            _.forEach(calcGroupFields, function(calcField) {
	                if (isInDepends_.call(self, calcListener.calc, calcField)) {
	                    listeners.push({calc: calcField, index: -1});
	                }
	            });
	            return listeners;
	        }

	        function isInDepends_(calc1, calc2) {
	            var self = this;
	            var depends = calc2.depends;
	            for (var i = 0, len = depends.length; i < len; i++) {
	                if (isDepend_.call(self, calc1, depends[i])) {
	                    return true;
	                }
	            }
	        }

	        function isDepend_(calc, depend) {
	            if (depend.type === calc.type) {
	                var type = depend.type;
	                if ((type === CalcHelper.CALC_COLUMN && depend.column === calc.name) ||
	                        (type === CalcHelper.DATA_COLUMN && depend.column === calc.name) ||
	                        (type === CalcHelper.CALC_FIELD && depend.name === calc.name)) {
	                    return true;
	                } else {
	                    return false;
	                }
	            }
	        }

	        function isCalcInAgg_(calc, expr) {
	            if (CalcHelper.aggFn(expr)) {
	                return true;
	            }

	            if (CalcHelper.binaryExpr(expr)) {
	                var result = isCalcInAgg_(calc, expr.left);
	                if (result) {
	                    return true;
	                }
	                return isCalcInAgg_(calc, expr.right);
	            } else if (CalcHelper.fnExpr(expr)) {
	                if (CalcHelper.aggFn(expr)) {
	                    return true;
	                } else {
	                    var args = expr.args;
	                    if (args && args.length > 0) {
	                        return _.any(args, function(argExpr) {
	                            return isCalcInAgg_(calc, argExpr);
	                        });
	                    }
	                }
	            }
	            return false;
	        }

	        function dirtyListeners_(listeners) {
	            var self = this;
	            _.forEach(listeners, function(listener) {
	                var calc = listener.calc;
	                var index = listener.index;
	                var type = calc.type;
	                switch (type) {
	                    case CalcHelper.DATA_COLUMN:
	                        if (listener.index !== undefined) {
	                            self.dataColumns_.dirty(calc, index);
	                        }
	                        break;
	                    case CalcHelper.CALC_COLUMN:
	                        if (listener.index !== undefined) {
	                            self.calcColumns_.dirty(calc, index);
	                        }
	                        break;
	                    case CalcHelper.CALC_FIELD:
	                        self.calcFields_.dirty(calc);
	                        break;
	                    case CalcHelper.CALC_G_FIELD:
	                        self.calcGroupFields_.dirty(calc);
	                        break;
	                }
	            });
	        }

	        function getUnknownExpressionColumns() {
	            var self = this;
	            var columns = [];
	            var calcColumns = self.calcColumns_.getColumns();
	            if (calcColumns) {
	                _.forEach(calcColumns, function(calcCol) {
	                    var result = containsUnknownExpression.call(self, calcCol.expression);
	                    if (result) {
	                        columns.push(calcCol.name);
	                    }
	                });
	            }
	            return columns;
	        }

	        function containsUnknownExpression(expr) {
	            if (!expr) {
	                return false;
	            }
	            if (CalcHelper.unknowExpr(expr)) {
	                return true;
	            } else if (CalcHelper.binaryExpr(expr)) {
	                if (containsUnknownExpression(expr.left) ||
	                        containsUnknownExpression(expr.right)) {
	                    return true;
	                }
	                return false;
	            } else if (CalcHelper.fnExpr(expr)) {
	                var args = expr.args;
	                if (args && args.length > 0) {
	                    for (var i = 0, len = args.length; i < len; i++) {
	                        if (containsUnknownExpression(args[i])) {
	                            return true;
	                        }
	                    }
	                }
	                return false;
	            } else {
	                return false;
	            }
	        }

	        return CalcSource;
	    })();

	    module.exports = {
	        CalcSource: CalcSource
	    };
	})();


/***/ },
/* 10 */
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

	(function() {
	    'use strict';
	    var CalcSource = __webpack_require__(9);
	    var CalcModels = __webpack_require__(8);

	    var objectDefineProperty = Object.defineProperty;

	    var EventHandler = (function() {
	        function EventHandler(handler, self) {
	            this.handler = handler;
	            this.self = self;
	        }

	        return EventHandler;
	    })();

	    var Event = (function() {
	        function Event() {
	            this._handlers = [];
	        }

	        Event.prototype.addHandler = function(handler, self) {
	            this._handlers.push(new EventHandler(handler, self));
	        };

	        Event.prototype.removeHandler = function(handler, self) {
	            for (var i = 0; i < this._handlers.length; i++) {
	                var l = this._handlers[i];
	                if (l.handler === handler && l.self === self) {
	                    this._handlers.splice(i, 1);
	                    break;
	                }
	            }
	        };

	        Event.prototype.removeAllHandlers = function() {
	            this._handlers.length = 0;
	        };

	        Event.prototype.raise = function(sender, args) {
	            if (typeof args === 'undefined') {
	                args = null;
	            }
	            for (var i = 0; i < this._handlers.length; i++) {
	                var l = this._handlers[i];
	                l.handler.call(l.self, sender, args);
	            }
	        };

	        Object.defineProperty(Event.prototype, 'hasHandlers', {
	            /**
	             * Gets a value that indicates whether this event has any handlers.
	             */
	            get: function() {
	                return this._handlers.length > 0;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return Event;
	    })();

	    var CalcCollectionGroup = (function() {
	        /**
	         * Initializes a new instance of a @see:CollectionViewGroup.
	         *
	         * @param groupDescriptor @see:GroupDescription that owns the new group.
	         * @param name Name of the new group.
	         * @param level Level of the new group.
	         * @param isBottomLevel Whether this group has any subgroups.
	         * @param collapsed Whether this group is collapsed or not
	         */
	        function CalcCollectionGroup(calcCollection, groupDescriptor, calcGroup) {
	            var self = this;
	            self._calcCollection = calcCollection;
	            self._gd = groupDescriptor;
	            self._calcGroup = calcGroup;
	            self._collapsed = groupDescriptor ? !!groupDescriptor.collapsed : false;
	            self._groups = [];
	            var hds = calcCollection.hierarchyDescriptor;
	            if (calcGroup.isBottomLevel && calcGroup.rootNode && hds) {
	                self._rootNode = CalcCollection.createCVTree_(calcGroup.rootNode, hds);
	            }
	        }

	        //cvgPrototype.toGlobalIndex = function(localIndex) {
	        //    return this._calcGroup.toGlobalIndex(localIndex);
	        //};        //cvgPrototype.toGlobalIndex = function(localIndex) {
	        //    return this._calcGroup.toGlobalIndex(localIndex);
	        //};

	        CalcCollectionGroup.prototype = {
	            getItem: function(localIndex) {
	                var self = this;
	                if (self._rootNode) {
	                    return self._rootNode.getItem(localIndex);
	                } else {
	                    return self._calcGroup.getItem(localIndex);
	                }
	            },
	            getItems: function() {
	                var self = this;
	                if (self._rootNode) {
	                    return self._rootNode.getItems();
	                } else {
	                    return this._calcGroup.getItems();
	                }
	            },
	            toSourceRow: function(localIndex) {
	                var self = this;
	                if (self._rootNode) {
	                    return self._rootNode.toSourceRow(localIndex);
	                } else {
	                    return this._calcGroup.toSourceIndex(localIndex);
	                }
	            },
	            updateTree_: function() {
	                var self = this;
	                updateTree_(self, self._calcCollection.hierarchyDescriptor);
	            }
	        };

	        var cvgPrototype = CalcCollectionGroup.prototype;

	        objectDefineProperty(cvgPrototype, 'name', {
	            /*
	             * Gets the name of this group.
	             */
	            get: function() {
	                return this._calcGroup.name;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'collapsed', {
	            /*
	             * Gets the name of this group.
	             */
	            get: function() {
	                return this._collapsed;
	            },
	            set: function(value) {
	                this._collapsed = value;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'parent', {
	            /*
	             * Gets the name of this group.
	             */
	            get: function() {
	                return this._parent;
	            },
	            set: function(value) {
	                this._parent = value;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'level', {
	            /*
	             * Gets the level of this group.
	             */
	            get: function() {
	                return this._calcGroup.level;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'isBottomLevel', {
	            /*
	             * Gets a value that indicates whether this group has any subgroups.
	             */
	            get: function() {
	                return this._calcGroup.isBottomLevel;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'itemCount', {
	            /*
	             * Gets an array containing the items included in this group (including all subgroups).
	             */
	            get: function() {
	                return this._calcGroup.itemCount;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'groups', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                return this._groups;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'groupDescriptor', {
	            /*
	             * Gets the @see:GroupDescription that owns this group.
	             */
	            get: function() {
	                return this._gd;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'rootNode', {
	            /*
	             * Gets the @see:GroupDescription that owns this group.
	             */
	            get: function() {
	                return this._rootNode;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'isHierarchical', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                var self = this;
	                var result = false;
	                traversalBottomGroups_(self, function(cvGroup) {
	                    if (cvGroup.rootNode) {
	                        result = true;
	                        return true;
	                    }
	                });
	                return result;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        function updateTree_(cvGroup, hds) {
	            traversalBottomGroups_(cvGroup, function(cvGroup) {
	                var calcGroup = cvGroup._calcGroup;
	                if (calcGroup.rootNode) {
	                    cvGroup._rootNode = CalcCollection.createCVTree_(calcGroup.rootNode, hds);
	                }
	            });
	        }

	        function traversalBottomGroups_(cvGroup, callback) {
	            if (cvGroup.isBottomLevel) {
	                var stop = callback(cvGroup);
	                if (stop) {
	                    return;
	                }
	            } else {
	                _.forEach(cvGroup.groups, function(subGroup) {
	                    traversalBottomGroups_(subGroup, callback);
	                });
	            }
	        }

	        return CalcCollectionGroup;
	    })();

	    var CalcCollectionNode = (function() {
	        function CalcCollectionNode(calcNode) {
	            var self = this;
	            self._calcNode = calcNode;
	            self._parent = null;
	            self._children = [];
	        }

	        CalcCollectionNode.offsetUnit = 20;

	        CalcCollectionNode.prototype = {
	            getItem: function(relativeIndex) {
	                var self = this;
	                var item = null;
	                var node = CalcModels.CalcNode_.findNode_(self, relativeIndex);
	                if (node) {
	                    item = node._calcNode.getItem();
	                    item.node = node;
	                }
	                return item;
	            },
	            getItems: function(option) {
	                return this._calcNode.getItems(option);
	            },
	            expandAll: function() {
	                this._calcNode.expandAll();
	            },
	            collapseAll: function() {
	                this._calcNode.collapseAll();
	            },
	            findNode: function(relativeIndex) {
	                return CalcModels.CalcNode_.findNode_(this, relativeIndex);
	            },
	            toSourceRow: function(relativeIndex) {
	                return this._calcNode.toSourceIndex(relativeIndex);
	            },
	            toJSON: function() {

	            }
	        };
	        var cvgPrototype = CalcCollectionNode.prototype;

	        objectDefineProperty(cvgPrototype, 'collapsed', {
	            /*
	             * Gets the name of this group.
	             */
	            get: function() {
	                return this._calcNode.collapsed;
	            },
	            set: function(value) {
	                this._calcNode.collapsed = value;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'parent', {
	            /*
	             * Gets the name of this group.
	             */
	            get: function() {
	                return this._parent;
	            },
	            set: function(value) {
	                this._parent = value;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'level', {
	            /*
	             * Gets the level of this group.
	             */
	            get: function() {
	                return this._calcNode.level;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'children', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                return this._children;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'value', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                return this._calcNode.value;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'nodeCount', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                return this._calcNode.nodeCount;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(cvgPrototype, 'offset', {
	            /*
	             * Gets an array containing the this group's subgroups.
	             */
	            get: function() {
	                return this.level * CalcCollectionNode.offsetUnit;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        return CalcCollectionNode;
	    })();

	    var Filter = (function() {
	        var Filter = function(calcCollection, expr) {
	            var self = this;
	            self.expr_ = expr;
	            self.calcCollection_ = calcCollection;
	        };

	        Filter.prototype = {
	            and: function(expr) {
	                var self = this;
	                self.expr_ = self.expr_ ? '((' + self.expr_ + ')&&(' + expr + '))' : expr;
	                return self;
	            },
	            or: function(expr) {
	                var self = this;
	                self.expr_ = self.expr_ ? '((' + self.expr_ + ')||(' + expr + '))' : expr;
	                return self;
	            },
	            do: function() {
	                var self = this;
	                self.calcCollection_.filterExpression = self.expr_;
	            },
	            clear: function() {
	                this.expr_ = null;
	                return this;
	            }
	        };

	        return Filter;
	    })();

	    var CalcCollection = (function() {
	        function CalcCollection(sourceCollection, columnDefs) {
	            var self = this;
	            self.sourceCollection_ = sourceCollection;
	            self.calcSource_ = new CalcSource.CalcSource('__default', sourceCollection, columnDefs);
	            self.sortds_ = [];
	            self.gds_ = [];
	            self.hds_ = null;
	            self.groups_ = null;
	            self.rootNode_ = null;

	            self.filterObj_ = null;

	            self.getDefaults = null;
	            self.collectionChanged = new Event();
	        }

	        CalcCollection.prototype = {
	            getItem: function(row) {
	                var self = this;
	                if (self.rootGroup_) {
	                    return self.rootGroup_.getItem(row);
	                } else if (self.rootNode_) {
	                    return self.rootNode_.getItem(row);
	                } else {
	                    return self.calcSource.getRowItem(row);
	                }
	            },
	            addItem: function(item, srcRow) {
	                var self = this;
	                self.calcSource_.addRowItem(item, srcRow);
	                self.refresh();
	                raiseCollectionChanged_.call(self, {action: 'addItem', data: {item: item, row: srcRow}});
	            },
	            removeItem: function(srcRow) {
	                var self = this;
	                self.calcSource_.removeRowItem(srcRow);
	                self.refresh();
	                raiseCollectionChanged_.call(self, {action: 'removeItem', data: {row: srcRow}});
	            },
	            filter: function(expression) {
	                var self = this;
	                if (!self.filterObj_) {
	                    self.filterObj_ = new Filter(self, expression);
	                }
	                if (expression) {
	                    self.filterObj_.expr_ = expression;
	                }
	                return self.filterObj_;
	            },
	            refresh: function() {
	                var self = this;
	                if (self.filterExpr_) {
	                    filter_.call(self, self.filterExpr_);
	                } else if (self.sortds_ && self.sortds_.length > 0) {
	                    sort_.call(self, self.sortds_);
	                } else if (self.gds_ && self.gds_.length > 0) {
	                    group_.call(self, self.gds_);
	                } else if (self.hds_ && self.hds_.length > 0) {
	                    hierarchy_.call(self, self.hds_);
	                }
	            },
	            addCalcField: function(name, formula) {
	                var self = this;
	                self.calcSource_.addCalcField(name, formula);
	                raiseCollectionChanged_.call(self, {action: 'addCalcField'});
	            },
	            getCalcField: function(name) {
	                var self = this;
	                var calcSource = self.calcSource_;
	                if (calcSource) {
	                    var fieldObj = calcSource.findCalcField(name);
	                    if (fieldObj) {
	                        var value = calcSource.getCalcFieldValue(name);
	                        return {name: name, formula: fieldObj.formula, value: value};
	                    }
	                }
	                return null;
	            },
	            removeCalcField: function(name) {
	                var self = this;
	                self.calcSource_.removeCalcField(name);
	                raiseCollectionChanged_.call(self, {action: 'removeCalcField'});
	            },
	            toSourceRow: function(viewRow) {
	                return this.calcSource_.mapToSourceRow(viewRow);
	            },
	            calculate: function(formula, evaluatorContext) {
	                var calcSource = this.calcSource_;
	                var parserContext = calcSource.getParserContext();
	                if (!evaluatorContext) {
	                    evaluatorContext = calcSource.getEvaluatorContext();
	                }
	                return calcSource.getEvaluator().evaluateFormula(formula, parserContext, evaluatorContext);
	            }
	        };
	        var calcCollectionProto = CalcCollection.prototype;

	        objectDefineProperty(calcCollectionProto, 'filterExpression', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                return this.filterExpr_;
	            },
	            set: function(value) {
	                var self = this;
	                self.filterExpr_ = value;
	                filter_.call(self, value);
	                raiseCollectionChanged_.call(self, {action: 'filter'});
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'sortDescriptors', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                return this.sortds_;
	            },
	            set: function(value) {
	                var self = this;
	                var result = null;
	                if (value) {
	                    var sortInfos = _.isArray(value) ? value : [value];
	                    result = preProcessSortInfos_.call(self, sortInfos);
	                }
	                self.sortds_ = result;
	                sort_.call(self, result);
	                raiseCollectionChanged_.call(self, {action: 'sort'});
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'groupDescriptors', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                return this.gds_;
	            },
	            set: function(value) {
	                var self = this;
	                var result = null;
	                if (value) {
	                    var groupingInfos = _.isArray(value) ? value : [value];
	                    result = preProcessGroupInfos_.call(self, groupingInfos);
	                }
	                self.gds_ = result;
	                group_.call(self, result);
	                raiseCollectionChanged_.call(self, {action: 'group'});
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'itemCount', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                var self = this;
	                if (self.rootNode_) {
	                    return self.rootNode_.nodeCount;
	                } else if (self.rootGroup_) {
	                    return self.rootGroup_.itemCount;
	                } else {
	                    return this.calcSource.getRowCount();
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'hierarchyDescriptor', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                return this.hds_;
	            },
	            set: function(value) {
	                var self = this;
	                self.hds_ = _.clone(value);
	                if (!value.hasOwnProperty('collapsed')) {
	                    self.hds_.collapsed = true;
	                }
	                hierarchy_.call(self, value);
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'sourceCollection', {
	            get: function() {
	                return this.sourceCollection_;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'groups', {
	            get: function() {
	                return this.groups_;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'nodes', {
	            get: function() {
	                if (this.rootNode_ && this.rootNode_.children.length > 0) {
	                    return this.rootNode_.children;
	                }
	                return null;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'rootNode', {
	            get: function() {
	                return this.rootNode_;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'calcSource', {
	            get: function() {
	                return this.calcSource_;
	            },
	            enumerable: true,
	            configurable: true
	        });

	        objectDefineProperty(calcCollectionProto, 'isHierarchical', {
	            /*
	             * Gets the name of the property that is used to determine which
	             * group an item belongs to.
	             */
	            get: function() {
	                var self = this;
	                return self.rootNode_ || (self.rootGroup_ && self.rootGroup_.isHierarchical);
	            },
	            enumerable: true,
	            configurable: true
	        });

	        function filter_(expression) {
	            var self = this;
	            self.calcSource_.filter(expression);
	            if (self.gds_) {
	                updateGroup_.call(self);
	            }
	            if (self.hds_) {
	                updateTree_.call(self);
	            }
	        }

	        function sort_(collectionSds) {
	            var self = this;
	            var calcSds = toCalcSds_.call(self, collectionSds);
	            self.calcSource_.sort(calcSds);
	            if (self.gds_) {
	                updateGroup_.call(self);
	            }
	            if (self.hds_) {
	                updateTree_.call(self);
	            }
	        }

	        function group_(collectionGds) {
	            var self = this;
	            var calcGds = toCalcGds_.call(self, collectionGds);
	            self.rootCalcGroup_ = self.calcSource_.group(calcGds);
	            updateGroup_.call(self);
	            if (self.hds_) {
	                updateTree_.call(self);
	            }
	        }

	        function hierarchy_(hierarchyInfo) {
	            var self = this;
	            self.rootCalcNode_ = self.calcSource_.hierarchy(hierarchyInfo);
	            updateTree_.call(self);
	        }

	        function updateTree_() {
	            var self = this;
	            if (self.rootGroup_) {
	                self.rootGroup_.updateTree_();
	            } else {
	                self.rootCalcNode_ = self.calcSource_.getRootNode();
	                self.rootNode_ = createCVTree_(self.rootCalcNode_, self.hds_);
	            }
	        }

	        function updateGroup_() {
	            var self = this;
	            self.rootCalcGroup_ = self.calcSource_.getGroups();
	            if (self.rootCalcGroup_) {
	                self.rootGroup_ = createCVGroup_.call(self, self.rootCalcGroup_);
	                self.groups_ = self.rootGroup_.groups;
	            } else {
	                self.rootGroup_ = null;
	                self.groups_ = null;
	            }
	        }

	        function toCalcSds_(collectionSds) {
	            if (!collectionSds) {
	                return undefined;
	            }
	            return _.map(collectionSds, function(sds) {
	                var converter = sds.converter;
	                var calcsds = {field: sds.field, ascending: sds.ascending};
	                if (converter) {
	                    calcsds.converter = converter;
	                }
	                return calcsds;
	            });
	        }

	        function toCalcGds_(collectionGds) {
	            if (!collectionGds) {
	                return undefined;
	            }
	            return _.map(collectionGds, function(gd) {
	                var converter = gd.converter;
	                var calcGd = {field: gd.field};
	                if (converter) {
	                    calcGd.converter = converter;
	                }
	                return calcGd;
	            });
	        }

	        function createCVGroup_(calcGroup) {
	            var self = this;
	            var level = calcGroup.level;
	            var cvGds;
	            if (level >= 0) {
	                cvGds = self.gds_[level];
	            }
	            var cvGroup = new CalcCollectionGroup(self, cvGds, calcGroup);
	            if (!calcGroup.isBottomLevel) {
	                var subCvGroups = _.map(calcGroup.groups, function(subCalcGroup) {
	                    var subCvGroup = createCVGroup_.call(self, subCalcGroup);
	                    if (level !== -1) { //no parent for the first groups
	                        subCvGroup.parent = cvGroup;
	                    }
	                    return subCvGroup;
	                });
	                for (var i = 0, len = subCvGroups.length; i < len; i++) {
	                    cvGroup.groups.push(subCvGroups[i]);
	                }
	            }
	            return cvGroup;
	        }

	        function raiseCollectionChanged_(args) {
	            this.collectionChanged.raise(this, args);
	        }

	        function preProcessGroupInfos_(groupInfos) {
	            var self = this;
	            var allStrings = _.all(groupInfos, function(item) {
	                return _.isString(item);
	            });
	            var allObjects = _.all(groupInfos, function(item) {
	                return _.isObject(item);
	            });

	            if (!allObjects) {
	                if (!allStrings) {
	                    return console && console.error && console.error('Can not mixing use the string of column ID and group setting object');
	                } else {
	                    groupInfos = _.map(groupInfos, function(item) {
	                        return {field: item};
	                    });
	                }
	            }
	            var getDefaults = self.getDefaults;
	            var defaults = getDefaults && _.isFunction(getDefaults) ? getDefaults() : null;
	            if (defaults && defaults.group) {
	                var defaultGroupInfo = defaults.group;
	                var gds = [];
	                for (var i = 0, len = groupInfos.length; i < len; i++) {
	                    var groupInfo = groupInfos[i];
	                    groupInfo.header = _.defaults(groupInfo.header || {}, defaultGroupInfo.header);
	                    groupInfo.footer = _.defaults(groupInfo.footer || {}, defaultGroupInfo.footer);
	                    groupInfo = _.defaults(groupInfo, defaultGroupInfo);
	                    gds.push(groupInfo);
	                }
	                return gds;
	            } else {
	                return groupInfos;
	            }
	        }

	        function preProcessSortInfos_(sortInfos) {
	            var allStrings = _.all(sortInfos, function(item) {
	                return _.isString(item);
	            });
	            var allObjects = _.all(sortInfos, function(item) {
	                return _.isObject(item);
	            });

	            if (!allObjects) {
	                if (!allStrings) {
	                    return console && console.error && console.error('Can not mixing use the string of column ID and sort setting object');
	                } else {
	                    sortInfos = _.map(sortInfos, function(item) {
	                        return {field: item};
	                    });
	                }
	            }
	            return sortInfos;
	        }

	        function createCVTree_(calcNode, hds) {
	            var cvNode = new CalcCollectionNode(calcNode, !!hds.collapsed);
	            var childCvNodes = _.map(calcNode.children, function(childCalcNode) {
	                var childCvNode = createCVTree_(childCalcNode, hds);
	                childCvNode.parent = cvNode;
	                return childCvNode;
	            });
	            for (var i = 0, len = childCvNodes.length; i < len; i++) {
	                cvNode._children.push(childCvNodes[i]);
	            }
	            return cvNode;
	        }

	        CalcCollection.createCVTree_ = createCVTree_;

	        return CalcCollection;
	    })();

	    module.exports = {
	        CalcCollection: CalcCollection
	    };
	})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';

	    module.exports = {
	        Functions: {}
	    };
	}());


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// jscs:disable validateJSDoc
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
	(function() {
	    /* jshint ignore:start */
	    'use strict';
	    var spread = {};
	    module.exports = spread;

	    var _ENStringResource = (function() {
	        function _ENStringResource() {
	        }

	        _ENStringResource.Exp_InvalidArgument = 'Invalid argument';
	        _ENStringResource.Exp_InvalidCast = 'InvalidCastException';
	        _ENStringResource.Exp_NotSupport = 'NotSupportException';
	        _ENStringResource.Exp_FormulaInvalid = 'The formula you typed contains an invalid char: ';
	        _ENStringResource.Exp_InvalidTokenAt = 'invalid token at ';
	        _ENStringResource.Exp_InvalidArrayAt = 'Invalid array at ';
	        _ENStringResource.Exp_InvalidCellReference = 'Invalid cell reference or name at ';
	        _ENStringResource.Exp_InvalidFunctionName = 'Invalid function name';
	        _ENStringResource.Exp_InvalidOverrideFunction = 'Cannot override built-in function';
	        _ENStringResource.Exp_OverrideNotAllowed = 'Attempt to override function while override is not allowed';
	        _ENStringResource.Exp_NoSyntax = 'no syntax "';
	        _ENStringResource.Exp_MatchSyntax = '"to match the syntax "';
	        _ENStringResource.SingleQuotesFullStop = '".';
	        _ENStringResource.SingleQuote = '';
	        _ENStringResource.Exp_IsValid = '" is invalid.';
	        _ENStringResource.Exp_InvalidArray = 'Invalid array';
	        _ENStringResource.AtIndexOn = '" at index on ';
	        _ENStringResource.FullStop = '.';
	        _ENStringResource.SingleQuoteAt = '" at ';

	        return _ENStringResource;
	    })();
	    spread._ENStringResource = _ENStringResource;

	    spread.SR = _ENStringResource;

	    /* jshint ignore:end */
	})();

/***/ }
/******/ ])
});
