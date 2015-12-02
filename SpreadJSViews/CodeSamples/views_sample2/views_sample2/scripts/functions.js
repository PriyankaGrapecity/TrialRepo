(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["Calc"], factory);
	else if(typeof exports === 'object')
		exports["Functions"] = factory(require(undefined));
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["Calc"] = root["GcSpread"]["Views"]["Calc"] || {}, root["GcSpread"]["Views"]["Calc"]["Functions"] = factory(root["GcSpread"]["Views"]["Calc"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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

	    var CalcModule = __webpack_require__(1);
	    var Calc;
	    if (CalcModule) {
	        Calc = CalcModule.Common;
	    }else{
	        throw 'not found the calc module!';
	    }

	    var Functions = CalcModule.Functions;
	    module.exports = Functions;

	    //var throwSR = Calc.SRHelper.throwSR;
	    var throwSR  = function(){};
	    var invalidArg = 'Exp_InvalidArgument';
	    var invalidFnName = 'Exp_InvalidFunctionName';
	    var overrideNotAllow = 'Exp_OverrideNotAllowed';

	    //<editor-fold desc='namespace'>
	    var KEYWORD_NULL = null;
	    var KEYWORD_UNDEFINED = undefined; // jshint ignore:line
	    var MATH_ABS = Math.abs;
	    var MATH_SQRT = Math.sqrt;
	    var MATH_MAX = Math.max;
	    var MATH_MIN = Math.min;
	    var MATH_FLOOR = Math.floor;
	    var MATH_CEIL = Math.ceil;
	    var MATH_SIN = Math.sin;
	    var MATH_ASIN = Math.asin;
	    var MATH_COS = Math.cos;
	    var MATH_ACOS = Math.acos;
	    var MATH_TAN = Math.tan;
	    var MATH_ATAN = Math.atan;
	    var MATH_ATAN2 = Math.atan2;
	    var MATH_EXP = Math.exp;
	    var MATH_LOG = Math.log;
	    var MATH_PI = Math.PI;
	    var MATH_RANDOM = Math.random;
	    var MATH_POW = Math.pow;
	    var CONST_STRING = 'string';
	    var CONST_BOOLEAN = 'boolean';
	    var CONST_NUMBER = 'number';
	    var CONST_BLANK = '';

	    var CalcConvert = Calc.Convert;
	    var CalcErrors = Calc.Errors;
	    var CalcErrorsNull = CalcErrors.Null;
	    var CalcErrorsDivideByZero = CalcErrors.DivideByZero;
	    var CalcErrorsValue = CalcErrors.Value;
	    var CalcErrorsReference = CalcErrors.Reference;
	    var CalcErrorsName = CalcErrors.Name;
	    var CalcErrorsNotAvailable = CalcErrors.NotAvailable;
	    var CalcErrorsNumber = CalcErrors.Number;

	    var Function = (function() {
	        /**
	         * Represents an abstract base class for defining functions.
	         * @class
	         * @param {string} name The name of the function.
	         * @param {number} minArgs The minimum number of arguments for the function.
	         * @param {number} maxArgs The maximum number of arguments for the function.
	         */
	        function Function(name, minArgs, maxArgs) {
	            var argumentsLength = arguments.length;
	            this._init(name, argumentsLength < 2 ? 0 : minArgs, argumentsLength < 3 ? 0 : maxArgs);
	            this.typeName = '';
	        }

	        Function.prototype._init = function(name, minArgs, maxArgs) {
	            var self = this;
	            self.name = name;
	            self.minArgs = minArgs;
	            self.maxArgs = maxArgs;
	        };

	        /**
	         * Determines whether the function accepts array values for the specified argument.
	         * @param {number} argIndex Index of the argument.
	         * @function
	         * @returns {boolean} <c>true</c> if the function accepts array values for the specified argument; otherwise, <c>false</c>.
	         */
	        Function.prototype.acceptsArray = function(argIndex) {
	            return false;
	        };

	        /**
	         * Determines whether the function accepts Reference values for the specified argument.
	         * @param {number} argIndex Index of the argument.
	         * @returns {boolean} <c>true</c> if the function accepts Reference values for the specified argument; otherwise, <c>false</c>.
	         * @function
	         */
	        Function.prototype.acceptsReference = function(argIndex) {
	            return false;
	        };

	        /**
	         * Indicates whether the function can process Error values.
	         * @param {number} argIndex Index of the argument.
	         * @returns {boolean} <c>true</c> if the function can process Error values for the specified argument; otherwise, <c>false</c>.
	         * @function
	         */
	        Function.prototype.acceptsError = function(argIndex) {
	            return false;
	        };

	        /**
	         * Indicates whether the Evaluate method can process missing arguments.
	         * @param {number} argIndex Index of the argument
	         * @returns {boolean} <c>true</c> if the Evaluate method can process missing arguments; otherwise, <c>false</c>.
	         */
	        Function.prototype.acceptsMissingArgument = function(argIndex) {
	            return false;
	        };

	        /**
	         * Determines whether the function is volatile while it is being evaluated.
	         * @returns {boolean} <c>true</c> if the function is volatile; otherwise, <c>false</c>.
	         */
	        Function.prototype.isVolatile = function() {
	            return false;
	        };

	        /**
	         * Gets a value indicating whether this function is branched by arguments as conditional.
	         * @returns {boolean} <c>true</c> if this instance is branched; otherwise, <c>false</c>.
	         */
	        Function.prototype.isBranch = function() {
	            return false;
	        };

	        Function.prototype.isFilter = function() {
	            return false;
	        };

	        Function.prototype.isTableResult = function() {
	            return false;
	        };

	        Function.prototype.tableArgIndex = function() {
	            return -1;
	        };

	        Function.prototype.isCalculate = function() {
	            return false;
	        };

	        Function.prototype.isSummarize = function() {
	            return false;
	        };

	        Function.prototype.isAggregator = function() {
	            return false;
	        };

	        /**
	         * Finds the test argument when this function is branched.
	         * @returns {number} Indicates the index of the argument that would be treated as the test condition.
	         */
	        Function.prototype.findTestArgument = function() {
	            return -1;
	        };

	        /**
	         * Finds the branch argument.
	         * @param {object} test The test.
	         * @returns {number} Indicates the index of the argument that would be treated as the branch condition.
	         */
	        Function.prototype.findBranchArgument = function(test) {
	            return -1;
	        };

	        /**
	         * Returns the result of the function applied to the arguments.
	         * @param {object} args Arguments for the function evaluation
	         * @returns {object} The result of the function applied to the arguments.
	         */
	        Function.prototype.evaluate = function(args, context) {
	        };

	        /**
	         * Returns the string representation of the function.
	         * @returns {string} The string representation of the function.
	         */
	        Function.prototype.toString = function() {
	            return this.name;
	        };

	        /**
	         * Saves the object state to a JSON string.
	         * @returns {Object} The function data.
	         */
	        Function.prototype.toJSON = function() {
	            var settings = {};
	            for (var p in this) {
	                if (this.hasOwnProperty(p)) {
	                    settings[p] = this[p];
	                }
	            }
	            return settings;
	        };

	        /**
	         * Loads the object state from the specified JSON string.
	         * @param {Object} settings The function data from deserialization.
	         */
	        Function.prototype.fromJSON = function(settings) {
	            if (!settings) {
	                return;
	            }
	            for (var p in settings) {
	                if (settings[p] !== KEYWORD_UNDEFINED) {
	                    this[p] = settings[p];
	                }
	            }
	        };
	        return Function;
	    })();
	    Functions.Function = Function;

	    var CalcHelper = (function() {
	        function CalcHelper() {

	        }

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

	        return CalcHelper;
	    })();

	    var _builtInFunctions = {};
	    var _customFunctions = {};

	    function defineCustomFunction(name, fnEvaluate, options) {
	        if (name === undefined || name === null) {
	            throwSR(invalidFnName);
	        }
	        var fn;
	        name = name.toUpperCase();
	        if (_builtInFunctions.hasOwnProperty(name)) {
	            throwSR(invalidFnName);
	        }
	        if (!_customFunctions.hasOwnProperty(name)) {
	            fn = new Function(name, 0, 255);
	            _customFunctions[name] = fn;
	        } else {
	            fn = _customFunctions[name];
	            if (!fn) {
	                _customFunctions[name] = new Functions.Function(name, 0, 255);
	                fn = Functions[name.toUpperCase()];
	            } else if (!options || !options.override) {
	                throwSR(overrideNotAllow);
	            }
	        }
	        if (fnEvaluate && typeof fnEvaluate === "function") {
	            fn.evaluate = fnEvaluate;
	        }
	        if (options) {
	            for (var prop in options) {
	                if (options.hasOwnProperty(prop) && prop !== 'override') {
	                    fn[prop] = options[prop];
	                }
	            }
	        }
	        return fn;
	    }
	    Functions.defineCustomFunction = defineCustomFunction;

	    function findGlobalFunction(name) {
	        if (name === KEYWORD_UNDEFINED || name === KEYWORD_NULL) {
	            return KEYWORD_NULL;
	        }
	        name = name.toUpperCase();
	        if (_builtInFunctions && _builtInFunctions.hasOwnProperty(name)) {
	            return _builtInFunctions[name];
	        }
	        if (_customFunctions.hasOwnProperty(name)) {
	            return _customFunctions[name];
	        }
	        return KEYWORD_NULL;
	    }
	    Functions.findGlobalFunction = findGlobalFunction;

	    //<editor-fold desc='Help class'>
	    var regExpKeyPattern = [/\\/g, /\(/g, /\[/g, /\{/g, /\^/g, /\$/g, /\|/g, /\)/g, /\+/g, /\./g];

	    var _FinancialHelper = (function() {
	        function _FinancialHelper() {
	        }

	        _FinancialHelper.__isLeapYear = function(year) { // jshint ignore:line
	            return (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) || year === 1900;
	        };

	        _FinancialHelper.__compareDateTime = function(date1, date2) {
	            return date1 - date2;
	        };

	        _FinancialHelper.__toOADate = function(date) {
	            return CalcConvert._toOADate(date);
	        };

	        _FinancialHelper.__annual_year_basis = function(date, basis) { // jshint ignore:line
	            var leap_year;

	            switch (basis) {
	                case 0:
	                    return 360;
	                case 1:
	                    leap_year = _FinancialHelper.__isLeapYear(date.getFullYear());
	                    return leap_year ? 366 : 365;
	                case 2:
	                    return 360;
	                case 3:
	                    return 365;
	                case 4:
	                    return 360;
	                default:
	                    return -1;
	            }
	        };

	        _FinancialHelper.__getDaysInMonth = function(year, month) { // jshint ignore:line
	            switch (month) {
	                case 0:
	                case 2:
	                case 4:
	                case 6:
	                case 7:
	                case 9:
	                case 11:
	                    return 31;
	                case 1:
	                    if (_FinancialHelper.__isLeapYear(year)) {
	                        return 29;
	                    } else {
	                        return 28;
	                    }
	                    break;
	                case 3:
	                case 5:
	                case 8:
	                case 10:
	                    return 30;
	            }
	        };

	        _FinancialHelper.__Days_Between_BASIS_30E_360 = function(from, to) { // jshint ignore:line
	            var y1, m1, d1, y2, m2, d2;

	            y1 = from.getFullYear();
	            m1 = from.getMonth();
	            d1 = from.getDate();
	            y2 = to.getFullYear();
	            m2 = to.getMonth();
	            d2 = to.getDate();

	            if (d1 === 31) {
	                d1 = 30;
	            }
	            if (d2 === 31) {
	                d2 = 30;
	            }

	            return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
	        };

	        _FinancialHelper.__Days_Between_BASIS_30Ep_360 = function(from, to) { // jshint ignore:line
	            var y1, m1, d1, y2, m2, d2;

	            y1 = from.getFullYear();
	            m1 = from.getMonth();
	            d1 = from.getDate();
	            y2 = to.getFullYear();
	            m2 = to.getMonth();
	            d2 = to.getDate();

	            if (d1 === 31) {
	                d1 = 30;
	            }
	            if (d2 === 31) {
	                d2 = 1;
	                m2++;
	            }

	            return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
	        };

	        _FinancialHelper.__Days_Between_BASIS_MSRB_30_360_SYM = function(from, to) { // jshint ignore:line
	            var y1, m1, d1, y2, m2, d2;

	            y1 = from.getFullYear();
	            m1 = from.getMonth();
	            d1 = from.getDate();
	            y2 = to.getFullYear();
	            m2 = to.getMonth();
	            d2 = to.getDate();

	            if (m1 === 2 && _FinancialHelper.__getDaysInMonth(y1, m1) === d1) {
	                d1 = 30;
	            }
	            if (m2 === 2 && _FinancialHelper.__getDaysInMonth(y2, m2) === d2) {
	                d2 = 30;
	            }
	            if (d2 === 31 && d1 >= 30) {
	                d2 = 30;
	            }
	            if (d1 === 31) {
	                d1 = 30;
	            }

	            return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
	        };

	        _FinancialHelper.__Days_Between_BASIS_MSRB_30_360 = function(from, to) { // jshint ignore:line
	            var y1, m1, d1, y2, m2, d2;

	            y1 = from.getFullYear();
	            m1 = from.getMonth();
	            d1 = from.getDate();
	            y2 = to.getFullYear();
	            m2 = to.getMonth();
	            d2 = to.getDate();

	            if ((m1 === 2 && _FinancialHelper.__getDaysInMonth(y1, m1) === d1) && (m2 === 2 && _FinancialHelper.__getDaysInMonth(y2, m2) === d2)) {
	                d1 = 30;
	                d2 = 30;
	            }
	            if (d2 === 31 && d1 >= 30) {
	                d2 = 30;
	            }
	            if (d1 === 31) {
	                d1 = 30;
	            }

	            return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
	        };

	        _FinancialHelper.__days_between_basis = function(from, to, basis) { // jshint ignore:line
	            var sign = 1;

	            if (_FinancialHelper.__compareDateTime(from, to) > 0) {
	                var tmp = from;
	                from = to;
	                to = tmp;
	                sign = -1;
	            }

	            switch (basis) {
	                case 1:
	                case 2:
	                case 3:
	                    return sign * CalcConvert.I(_FinancialHelper.__toOADate(to) - _FinancialHelper.__toOADate(from));
	                case 4:
	                    return sign * _FinancialHelper.__Days_Between_BASIS_30E_360(from, to); // jshint ignore:line
	                case 5:
	                    return sign * _FinancialHelper.__Days_Between_BASIS_30Ep_360(from, to); // jshint ignore:line
	                case 6:
	                    return sign * _FinancialHelper.__Days_Between_BASIS_MSRB_30_360_SYM(from, to); // jshint ignore:line
	                default:
	                    return sign * _FinancialHelper.__Days_Between_BASIS_MSRB_30_360(from, to); // jshint ignore:line
	            }
	        };
	        return _FinancialHelper;
	    })();
	    Functions._FinancialHelper = _FinancialHelper;

	    var _StatHelper = (function() {
	        function _StatHelper() {
	        }

	        _StatHelper.st_normsdist = function(args) {
	            var z;

	            if (isNaN(z = CalcConvert.D(args[0]))) {
	                return CalcErrorsValue;
	            }
	            var Z_MAX = 6.0;
	            var y;
	            var x;
	            var w;
	            if (z === 0.0) {
	                x = 0.0;
	            } else {
	                y = 0.5 * MATH_ABS(z);
	                if (y >= (Z_MAX * 0.5)) {
	                    x = 1.0;
	                } else if (y < 1.0) {
	                    w = y * y;
	                    x = ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w - 0.019198292004) * w + 0.059054035642) * w - 0.151968751364) * w + 0.319152932694) * w - 0.531923007300) * w + 0.797884560593) * y * 2.0;
	                } else {
	                    y -= 2.0;
	                    x = (((((((((((((-0.000045255659 * y + 0.000152529290) * y - 0.000019538132) * y - 0.000676904986) * y + 0.001390604284) * y - 0.000794620820) * y - 0.002034254874) * y + 0.006549791214) * y - 0.010557625006) * y + 0.011630447319) * y - 0.009279453341) * y + 0.005353579108) * y - 0.002141268741) * y + 0.000535310849) * y + 0.999936657524;
	                }
	            }
	            return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
	        };

	        _StatHelper.__averageIncludeSubtotals = function(args, includeSubtotals, includeHiddenRow) {
	            //var sum = 0.0;
	            //var n = 0.0;
	            //var n = 0;
	            //for (var i = 0; i < args.length; i++) {
	            //    var array = CalcConvert.toArr(args[i], CalcValueType.numberType, false, false, false, true);
	            //    for (var range = 0; range < array.rangeCount; range++) {
	            //        var rangeRef = array.rangeCount > 1 ? array[range] : array;
	            //        var refRow: number, refCol: number;
	            //        if (array.isReference) {
	            //            refRow = (<Reference>args[i]).getRow(range);
	            //            refCol = (<Reference>args[i]).getColumn(range);
	            //        }
	            //        for (var row = 0; row < rangeRef.length; row++) {
	            //            // function is subtotal and arguments is reference, the row must not hidden row.
	            //            if (!includeSubtotals && array.isReference && (<Reference>args[i]).isHiddenRow(range, row, includeHiddenRow)) {
	            //                continue;
	            //            }
	            //            var rowRef = rangeRef[row];
	            //            for (var col = 0; col < rowRef.length; col++) {
	            //                if (includeSubtotals || !array.isReference || !(<Reference>args[i]).isSubtotal(range, row + refRow, col + refCol)) {
	            //                    var val = rowRef[col];
	            //                    if (val !== CalcConvert.CalcConvertedError) {
	            //                        sum += val;
	            //                        n++;
	            //                    }
	            //                }
	            //            }
	            //        }
	            //    }
	            //}
	            //if (n === 0) {
	            //    return CalcErrorsDivideByZero;
	            //}
	            //return CalcConvert.toResult(sum / n);
	        };

	        _StatHelper.__countIncludeSubtotals = function(args, includeSubtotals, includeHiddenRow) {
	            //var n = 0;
	            //for (var i = 0; i < args.length; i++) {
	            //    var array = CalcConvert.toArr(args[i], CalcValueType.anyType, false, false, false, true);
	            //    for (var range = 0; range < array.rangeCount; range++) {
	            //        var rangeRef = array.rangeCount > 1 ? array[range] : array;
	            //        var refRow: number, refCol: number;
	            //        if (array.isReference) {
	            //            refRow = (<Reference>args[i]).getRow(range);
	            //            refCol = (<Reference>args[i]).getColumn(range);
	            //        }
	            //        for (var row = 0; row < rangeRef.length; row++) {
	            //            // function is subtotal and arguments is reference, the row must not hidden row.
	            //            if (!includeSubtotals && array.isReference && (<Reference>args[i]).isHiddenRow(range, row, includeHiddenRow)) {
	            //                continue;
	            //            }
	            //            var rowRef = rangeRef[row];
	            //            for (var col = 0; col < rowRef.length; col++) {
	            //                if (includeSubtotals || !array.isReference || !(<Reference>args[i]).isSubtotal(range, row + refRow, col + refCol)) {
	            //                    var val = rowRef[col];
	            //                    if (val !== null && val !== '' && val !== CalcConvert.CalcConvertedError) {
	            //                        n++;
	            //                    }
	            //                }
	            //            }
	            //        }
	            //    }
	            //}
	            //return n;
	        };

	        _StatHelper.__countaIncludeSubtotals = function(args, includeSubtotals, includeHiddenRow) {
	            //var n = 0;
	            //for (var i = 0; i < args.length; i++) {
	            //    var array = CalcConvert.toArr(args[i], CalcValueType.anyType, false, false, false);
	            //    for (var range = 0; range < array.rangeCount; range++) {
	            //        var rangeRef = array.rangeCount > 1 ? array[range] : array;
	            //        var refRow: number, refCol: number;
	            //        if (array.isReference) {
	            //            refRow = (<Reference>args[i]).getRow(range);
	            //            refCol = (<Reference>args[i]).getColumn(range);
	            //        }
	            //        for (var row = 0; row < rangeRef.length; row++) {
	            //            // function is subtotal and arguments is reference, the row must not hidden row.
	            //            if (!includeSubtotals && array.isReference && (<Reference>args[i]).isHiddenRow(range, row, includeHiddenRow)) {
	            //                continue;
	            //            }
	            //            var rowRef = rangeRef[row];
	            //            for (var col = 0; col < rowRef.length; col++) {
	            //                if (includeSubtotals || !array.isReference || !(<Reference>args[i]).isSubtotal(range, row + refRow, col + refCol)) {
	            //                    var val = rowRef[col];
	            //                    if (val !== keyword_null && val !== keyword_undefined) {
	            //                        n++;
	            //                    }
	            //                }
	            //            }
	            //        }
	            //    }
	            //}
	            //return n;
	        };

	        _StatHelper.__maxIncludeSubtotals = function(args, includeSubtotals, includeHiddenRow) {
	            //var anyValue = false, max = 0.0, val;
	            //for (var i = 0; i < args.length; i++) {
	            //    var array = CalcConvert.toArr(args[i], CalcValueType.numberType, false, true, false, true);
	            //    if (array.isError) {
	            //        return array[0];
	            //    }
	            //    if (array.isConvertError) {
	            //        return CalcErrorsValue;
	            //    }
	            //    for (var range = 0; range < array.rangeCount; range++) {
	            //        var rangeRef = array.rangeCount > 1 ? array[range] : array;
	            //        var refRow: number, refCol: number;
	            //        if (array.isReference) {
	            //            refRow = (<Reference>args[i]).getRow(range);
	            //            refCol = (<Reference>args[i]).getColumn(range);
	            //        }
	            //        for (var row = 0; row < rangeRef.length; row++) {
	            //            // function is subtotal and arguments is reference, the row must not hidden row.
	            //            if (!includeSubtotals && array.isReference && (<Reference>args[i]).isHiddenRow(range, row, includeHiddenRow)) {
	            //                continue;
	            //            }
	            //            var rowRef = rangeRef[row];
	            //            for (var col = 0; col < rowRef.length; col++) {
	            //                if (includeSubtotals || !array.isReference || !(<Reference>args[i]).isSubtotal(range, row + refRow, col + refCol)) {
	            //                    val = rowRef[col];
	            //                    if (val !== CalcConvert.CalcConvertedError) {
	            //                        if (!anyValue || val > max) {
	            //                            max = val;
	            //                        }
	            //                        anyValue = true;
	            //                    }
	            //                }
	            //            }
	            //        }
	            //    }
	            //}
	            //return max;
	        };

	        _StatHelper.__minIncludeSubtotals = function(args, includeSubtotals, includeHiddenRow) {
	            //var anyValue = false, min = 0.0, val;
	            //for (var i = 0; i < args.length; i++) {
	            //    var array = CalcConvert.toArr(args[i], CalcValueType.numberType, false, true, false, true);
	            //    if (array.isError) {
	            //        return array[0];
	            //    }
	            //    if (array.isConvertError) {
	            //        return CalcErrorsValue;
	            //    }
	            //    for (var range = 0; range < array.rangeCount; range++) {
	            //        var rangeRef = array.rangeCount > 1 ? array[range] : array;
	            //        var refRow: number, refCol: number;
	            //        if (array.isReference) {
	            //            refRow = (<Reference>args[i]).getRow(range);
	            //            refCol = (<Reference>args[i]).getColumn(range);
	            //        }
	            //        for (var row = 0; row < rangeRef.length; row++) {
	            //            // function is subtotal and arguments is reference, the row must not hidden row.
	            //            if (!includeSubtotals && array.isReference && (<Reference>args[i]).isHiddenRow(range, row, includeHiddenRow)) {
	            //                continue;
	            //            }
	            //            var rowRef = rangeRef[row];
	            //            for (var col = 0; col < rowRef.length; col++) {
	            //                if (includeSubtotals || !array.isReference || !(<Reference>args[i]).isSubtotal(range, row + refRow, col + refCol)) {
	            //                    val = rowRef[col];
	            //                    if (val !== CalcConvert.CalcConvertedError) {
	            //                        if (!anyValue || val < min) {
	            //                            min = val;
	            //                        }
	            //                        anyValue = true;
	            //                    }
	            //                }
	            //            }
	            //        }
	            //    }
	            //}
	            //return min;
	        };

	        _StatHelper.st_percentile = st_percentile;
	        return _StatHelper;
	    })();
	    Functions._StatHelper = _StatHelper;

	    //<editor-fold desc='Definitions'>

	    function _defineBuildInFunction(name, fnEvaluate, options) {
	        if (name === KEYWORD_UNDEFINED || name === KEYWORD_NULL) {
	            throwSR(invalidFnName);
	        }
	        var fn;
	        name = name.toUpperCase();
	        if (!_builtInFunctions.hasOwnProperty(name)) {
	            fn = new Functions.Function(name, 0, 255);
	            _builtInFunctions[name] = fn;
	        } else {
	            fn = _builtInFunctions[name];
	            if (!fn) {
	                _builtInFunctions[name] = new Function(name, 0, 255);
	                fn = Functions[name.toUpperCase()];
	            } else if (!options || !options.override) {
	                throwSR(overrideNotAllow);
	            }
	        }
	        if (fnEvaluate && typeof fnEvaluate === 'function') {
	            fn.evaluate = fnEvaluate;
	        }
	        if (options) {
	            for (var prop in options) {
	                if (options.hasOwnProperty(prop) && prop !== 'override') {
	                    fn[prop] = options[prop];
	                }
	            }
	        }
	        return fn;
	    }

	    Functions.defineBuildInFunction = _defineBuildInFunction;

	    var _DateHelper = (function() {
	        function _DateHelper() {
	        }

	        _DateHelper.days360 = dt_days360;
	        _DateHelper.yearfrac = dt_yearfrac;
	        return _DateHelper;
	    })();
	    Functions._DateHelper = _DateHelper;

	    //</editor-fold>
	    //<editor-fold desc='Helper'>
	    function acceptsAny(i) {
	        return true;
	    }

	    Functions.acceptsAny = acceptsAny;

	    function acceptsOne(i) {
	        return i === 1;
	    }

	    Functions.acceptsOne = acceptsOne;
	    function acceptsTwo(i) {
	        return i === 2;
	    }

	    Functions.acceptsTwo = acceptsTwo;

	    function acceptsThree(i) {
	        return i === 3;
	    }

	    Functions.acceptsThree = acceptsThree;

	    function isVolatile() {
	        return true;
	    }

	    Functions.isVolatile = isVolatile;

	    function acceptsOneTwo(i) {
	        return i === 1 || i === 2;
	    }

	    Functions.acceptsOneTwo = acceptsOneTwo;

	    function isBranch() {
	        return true;
	    }

	    Functions.isBranch = isBranch;

	    function isFilter() {
	        return true;
	    }

	    Functions.isFilter = isFilter;

	    function firstTableArgIndex() {
	        return 0;
	    }

	    Functions.firstTableArgIndex = firstTableArgIndex;

	    function secondTableArgIndex() {
	        return 1;
	    }

	    Functions.secondTableArgIndex = secondTableArgIndex;

	    function tableResult() {
	        return true;
	    }

	    Functions.tableResult = tableResult;

	    function isAggregator() {
	        return true;
	    }

	    Functions.isAggregator = isAggregator;

	    function isCalculate() {
	        return true;
	    }

	    Functions.isCalculate = isCalculate;

	    function isSummarize() {
	        return true;
	    }

	    Functions.isSummarize = isSummarize;


	    function acceptsZero(i) {
	        return i === 0;
	    }

	    Functions.acceptsZero = acceptsZero;

	    function __iterate(obj, fn, ctx) {
	        if (CalcConvert.err(obj)) {
	            ctx.value = obj;
	            return false;
	        } else if (CalcConvert.ref(obj)) {
	            for (var a = 0; a < obj.getRangeCount(); a++) {
	                for (var r = 0; r < obj.getRowCount(a); r++) {
	                    for (var c = 0; c < obj.getColumnCount(a); c++) {
	                        //if (obj instanceof Calc._SheetRangeReference) {
	                        //    for (var i = 0; i < obj.getSheetCount(); i++) {
	                        //        if (ctx.includeSubtotal || !obj.isSubtotal(i, a, r, c)) {
	                        //            if (fn(obj.getValue(i, a, r, c), ctx) === false) {
	                        //                return false;
	                        //            }
	                        //        }
	                        //    }
	                        //} else
	                        if (ctx.includeSubtotal || !obj.isSubtotal(a, r, c)) {
	                            if (fn(obj.getValue(a, r, c), ctx) === false) {
	                                return false;
	                            }
	                        }
	                    }
	                }
	            }
	        } else if (CalcConvert.arr(obj)) {
	            for (var i1 = 0; i1 < obj.length(); i1++) {
	                if (fn(obj.getValueByIndex(i1), ctx) === false) {
	                    return false;
	                }
	            }
	        } else if ($.isArray(obj)) {
	            $.each(obj, function(i, v) {
	                return fn(v, ctx);
	            });
	        } else {
	            if (fn(obj, ctx) === false) {
	                return false;
	            }
	        }
	        return true;
	    }

	    function findTestArgument() {
	        return 0;
	    }

	    Functions.findTestArgument = findTestArgument;

	    function findBranchArgument(test) {
	        if (CalcConvert.err(test)) {
	            return -1;
	        }
	        var result = false;
	        try {
	            result = CalcConvert.B(test);
	        } catch (err) {
	        }
	        return result ? 1 : 2;
	    }

	    function acceptsSecond(i) {
	        return i === 1;
	    }

	    Functions.acceptsSecond = acceptsSecond;

	    function acceptsThird(i) {
	        return i === 2;
	    }

	    Functions.acceptsThird = acceptsThird;

	    function acceptsFirstOrOne(i) {
	        return i === 0 || i === 1;
	    }

	    Functions.acceptsFirstOrOne = acceptsFirstOrOne;

	    function acceptsFirst(i) {
	        return i === 0;
	    }

	    Functions.acceptsFirst = acceptsFirst;


	    //<editor-fold desc='MathExtend'>
	    var MathEx = (function() {
	        function MathEx() {
	        }

	        MathEx.log = function(a, base) {
	            if (isNaN(a)) {
	                return a;
	            }
	            if (isNaN(base)) {
	                return base;
	            }
	            if (base !== 1.0 && a === 1.0 || base !== 0.0 && (base !== Number.POSITIVE_INFINITY)) {
	                return (MATH_LOG(a) / MATH_LOG(base));
	            }
	            return NaN;
	        };
	        MathEx.log10 = function(num) {
	            return MathEx.log(num, 10);
	        };
	        return MathEx;
	    })();

	    //</editor-fold>

	    var _MathHelper = (function() {
	        function _approxFloor(x) {
	            var r = MATH_FLOOR(x);
	            if (_approxEqual(x, r + 1.0)) {
	                return r + 1.0;
	            }
	            return r;
	        }

	        function _approxCeiling(x) {
	            var r = MATH_CEIL(x);
	            if (_approxEqual(x, r - 1.0)) {
	                return r - 1.0;
	            }
	            return r;
	        }

	        function _approxEqual(x, y) {
	            if (x === y) {
	                return true;
	            }
	            return MATH_ABS(x - y) < MATH_ABS(x) / (16777216.0 * 16777216.0);
	        }

	        function _initPow10() {
	            var pow10Array = [];
	            pow10Array[0x00] = 1e0;
	            pow10Array[0x01] = 1e1;
	            pow10Array[0x02] = 1e2;
	            pow10Array[0x03] = 1e3;
	            pow10Array[0x04] = 1e4;
	            pow10Array[0x05] = 1e5;
	            pow10Array[0x06] = 1e6;
	            pow10Array[0x07] = 1e7;
	            pow10Array[0x08] = 1e8;
	            pow10Array[0x09] = 1e9;
	            pow10Array[0x0a] = 1e10;
	            pow10Array[0x0b] = 1e11;
	            pow10Array[0x0c] = 1e12;
	            pow10Array[0x0d] = 1e13;
	            pow10Array[0x0e] = 1e14;
	            pow10Array[0x0f] = 1e15;
	            pow10Array[0x10] = 1e16;
	            return pow10Array;
	        }

	        function _pow10(n) {
	            var pow10Array = _initPow10();
	            var value = pow10Array[n];
	            if (value !== KEYWORD_UNDEFINED && value !== KEYWORD_NULL) {
	                return value;
	            }
	            return MATH_POW(10.0, parseFloat(n));
	        }

	        function _buildCriteria(crit, criteria) {
	            var compareString;
	            var regMatchString;
	            var compareDouble;
	            var wildcardCriteria;
	            var reg;
	            switch (crit) {
	                case 0:
	                    compareString = (function(v1, v2) {
	                        return v1 <= v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 <= v2;
	                    });
	                    break;
	                case 1:
	                    compareString = (function(v1, v2) {
	                        return v1 >= v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 >= v2;
	                    });
	                    break;
	                case 2:
	                    compareString = (function(v1, v2) {
	                        return v1 !== v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 !== v2;
	                    });
	                    break;
	                case 3:
	                    compareString = (function(v1, v2) {
	                        return v1 < v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 < v2;
	                    });
	                    break;
	                case 4:
	                    compareString = (function(v1, v2) {
	                        return v1 === v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 === v2;
	                    });
	                    wildcardCriteria = Calc.RegUtil.getWildcardCriteriaFullMatch(criteria);
	                    if (wildcardCriteria) {
	                        reg = Calc.RegUtil.getRegIgnoreCase(wildcardCriteria);
	                        regMatchString = (function(v1) {
	                            reg.lastIndex = 0;
	                            return reg.test(v1);
	                        });
	                    }
	                    break;
	                case 5:
	                    compareString = (function(v1, v2) {
	                        return v1 > v2;
	                    });
	                    compareDouble = (function(v1, v2) {
	                        return v1 > v2;
	                    });
	                    break;
	                default:
	                    return (function(v) {
	                        return false;
	                    });
	            }

	            var critVal = -1;
	            var isCritNumber = true;
	            try {
	                var doubleValue = {value: 0};
	                if (criteria === KEYWORD_UNDEFINED || criteria === KEYWORD_NULL) {
	                    critVal = 0;
	                } else if (CalcConvert.rD(criteria.toString(), doubleValue)) {
	                    critVal = doubleValue.value;
	                } else {
	                    isCritNumber = false;
	                }
	            } catch (e) {
	                isCritNumber = false;
	            }
	            return (function(value) {
	                if (value === KEYWORD_UNDEFINED || value === KEYWORD_NULL) {
	                    value = '';
	                }
	                if (isCritNumber) {
	                    var chkVal = -1;
	                    try {
	                        var doubleValue = {value: 0};
	                        if (CalcConvert.rD(value, doubleValue)) {
	                            return compareDouble(doubleValue.value, critVal);
	                        }
	                    } catch (e) {
	                    }
	                }
	                if (wildcardCriteria && regMatchString) {
	                    return regMatchString(value.toString());
	                }
	                return compareString(value.toString().toUpperCase(), (criteria !== KEYWORD_UNDEFINED && criteria !== KEYWORD_NULL) ? criteria.toString().toUpperCase() : '');
	            });
	        }

	        function _parseCriteria(criteria) {
	            if (CalcConvert.num(criteria)) {
	                // equal to
	                return _buildCriteria(4, criteria);
	            }

	            var OPERATORS_INFIX = '=><';
	            var critString = (criteria !== KEYWORD_UNDEFINED && criteria !== KEYWORD_NULL) ? criteria.toString().toUpperCase() : '';
	            var prevChar = '\0';
	            for (var i = 0; i < 2 && i < critString.length; i++) {
	                var tc = critString[i];
	                if (OPERATORS_INFIX.indexOf(tc) !== -1) {
	                    if (tc === '=') {
	                        switch (prevChar) {
	                            case '<':
	                                return _buildCriteria(0, critString.substring(2));
	                            case '>':
	                                return _buildCriteria(1, critString.substring(2));
	                            default:
	                                return _buildCriteria(4, (prevChar === '\0') ? critString.substring(1) : criteria);
	                        }
	                    } else {
	                        if (prevChar === '\0') {
	                            prevChar = tc;
	                            continue;
	                        }

	                        if (prevChar === '<') {
	                            if (tc === '>') {
	                                return _buildCriteria(2, critString.substring(2));
	                            } else {
	                                return _buildCriteria(3, critString.substring(1));
	                            }
	                        } else if (prevChar === '>') {
	                            return _buildCriteria(5, critString.substring(1));
	                        }
	                    }
	                } else {
	                    switch (prevChar) {
	                        case '<':
	                            return _buildCriteria(3, critString.substring(1));
	                        case '>':
	                            return _buildCriteria(5, critString.substring(1));
	                        default:
	                            break;
	                    }
	                }
	            }
	            return _buildCriteria(4, criteria);
	        }

	        function _round(number, digits) {
	            if (isNaN(number)) {
	                return CalcErrorsValue;
	            }
	            var power = _pow10(MATH_ABS(digits));
	            if (digits < 0) {
	                number /= power;
	            } else {
	                number *= power;
	            }
	            if (number < 0.0) {
	                number = _approxCeiling(number - 0.5);
	            } else {
	                number = _approxFloor(number + 0.5);
	            }
	            if (digits < 0) {
	                number *= power;
	            } else {
	                number /= power;
	            }
	            return CalcConvert.toResult(number);
	        }

	        function _combin(n, k) {
	            if (isNaN(n) || isNaN(k)) {
	                return CalcErrorsValue;
	            }
	            if (n < 0.0 || k < 0.0 || n < k) {
	                return CalcErrorsNumber;
	            }
	            var result = 1.0;
	            k = MATH_MIN(n - k, k);
	            for (var i = 1.0; i <= k; i++) {
	                result *= n - i + 1.0;
	                result /= i;
	            }
	            return CalcConvert.toResult(result);
	        }

	        function _log1p(x) {
	            return MATH_LOG(1.0 + x) - (((1.0 + x) - 1.0) - x) / (1.0 + x);
	        }

	        function _pow1p(x, y) {
	            var ret;
	            if (MATH_ABS(x) > 0.5) {
	                ret = MATH_POW(1.0 + x, y);
	            } else {
	                ret = MATH_EXP(y * _log1p(x));
	            }

	            if (!isFinite(ret)) {
	                if (ret === Number.POSITIVE_INFINITY) {
	                    ret = 1.79769e+308; //double.MaxValue
	                } else if (ret === Number.NEGATIVE_INFINITY) {
	                    ret = -1.79769e+308; //double.MinValue
	                }
	            } else if (isNaN(ret)) {
	                ret = 4.94066e-324; //double.Epsilon
	            }

	            return ret;
	        }

	        function _cosh(d) {
	            return (MATH_EXP(d) + MATH_EXP(-d)) / 2;
	        }

	        function _sinh(d) {
	            return (MATH_EXP(d) - MATH_EXP(-d)) / 2;
	        }

	        return {
	            approxFloor: _approxFloor,
	            approxCeiling: _approxCeiling,
	            approxEqual: _approxEqual,
	            pow10: _pow10,
	            parseCriteria: _parseCriteria,
	            round: _round,
	            combin: _combin,
	            log10: MathEx.log10,
	            log: MathEx.log,
	            pow1p: _pow1p,
	            log1p: _log1p,
	            cosh: _cosh,
	            sinh: _sinh
	        };
	    })();
	    Functions._MathHelper = _MathHelper;

	    //</editor-fold>

	    //<editor-fold desc='Math&Trig'>
	    function mt_abs(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _abs$evaluateSingleValue);
	    }

	    function _abs$evaluateSingleValue(value) {
	        var num = parseFloat(value);
	        return _.isFinite(num) ? CalcConvert.toResult(MATH_ABS(num)) : CalcErrorsValue;
	    }

	    function mt_int(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _int$evaluateSingleValue);
	    }

	    function _int$evaluateSingleValue(value) {
	        var num = parseFloat(value);
	        if (num === KEYWORD_UNDEFINED || num === KEYWORD_NULL) {
	            return CalcErrorsValue;
	        }
	        return Functions._MathHelper.approxFloor(num);
	    }

	    function mt_ceiling(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _ceiling$evaluateSingleValue);
	    }

	    function _ceiling$evaluateSingleValue(values) {
	        var num = CalcConvert.D(values[0]);
	        var sign = CalcConvert.D(values[1]);
	        if (isNaN(num) || isNaN(sign)) {
	            return CalcErrorsValue;
	        }
	        if (num === 0.0 || sign === 0.0) {
	            return 0.0;
	        }

	        if (num > 0.0 && sign < 0.0) {
	            return CalcErrorsNumber;
	        }

	        if (num < 0.0 && 0.0 < sign) {
	            sign = -sign;
	            return Functions._MathHelper.approxFloor(num / sign) * sign;
	        }
	        return Functions._MathHelper.approxCeiling(num / sign) * sign;
	    }

	    function mt_iso_ceiling(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = _.isUndefined(args[1]) ? 1 : fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _iso_ceiling$evaluateSingleValue);
	    }

	    function _iso_ceiling$evaluateSingleValue(values) {
	        var num = CalcConvert.D(values[0]);
	        var sign = CalcConvert.D(values[1]);
	        sign = CalcConvert.D(sign);
	        if (isNaN(num) || isNaN(sign)) {
	            return CalcErrorsValue;
	        }
	        if (num === 0.0 || sign === 0.0) {
	            return 0.0;
	        }
	        if (sign < 0) {
	            sign = -sign;
	        }
	        return Functions._MathHelper.approxCeiling(num / sign) * sign;
	    }

	    function mt_currency(args) {
	        return args;
	    }

	    function mt_degrees(args) {
	        var num;
	        if (isNaN(num = parseFloat(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return 180.0 * num / MATH_PI;
	    }

	    function mt_even(args) {
	        var num = parseFloat(args[0]);
	        if (num < 0.0) {
	            num = MATH_FLOOR(num);
	            if (num % 2.0 !== 0.0) {
	                num -= 1.0;
	            }
	        } else {
	            num = MATH_CEIL(num);
	            if (num % 2.0 !== 0.0) {
	                num += 1.0;
	            }
	        }
	        return num;
	    }

	    function mt_fact(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _fact$evaluateSingleValue);
	    }

	    function _fact$evaluateSingleValue(values) {
	        var num = parseInt(values, 10);
	        var result = 1.0;
	        if (isNaN(num)) {
	            return CalcErrorsValue;
	        }
	        if (num < 0 || 170 < num) {
	            return CalcErrorsNumber;
	        }
	        for (var i = 1; i <= num; i++) {
	            result *= i;
	        }
	        return result;
	    }

	    function mt_ln(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _ln$evaluateSingleValue);
	    }

	    function _ln$evaluateSingleValue(values) {
	        var num = parseFloat(values);
	        if (num === KEYWORD_UNDEFINED || num === KEYWORD_NULL) {
	            return CalcErrorsValue;
	        }
	        if (num <= 0.0) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_LOG(num));
	    }

	    function mt_mod(args) {
	        var num = parseFloat(args[0]);
	        var divisor = parseFloat(args[1]);
	        if (divisor === 0.0) {
	            return '#DIV/0!';
	        }
	        return num - divisor * MATH_FLOOR(num / divisor);
	    }

	    function mt_odd(args) {
	        var num = parseFloat(args[0]);
	        if (num < 0.0) {
	            num = MATH_FLOOR(num);
	            if (num % 2.0 === 0.0) {
	                num -= 1.0;
	            }
	        } else {
	            num = MATH_CEIL(num);
	            if (num % 2.0 === 0.0) {
	                num += 1.0;
	            }
	        }
	        return num;
	    }

	    function mt_pi() {
	        return MATH_PI;
	    }

	    function mt_power(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _power$evaluateSingleValue);
	    }

	    function _power$evaluateSingleValue(values) {
	        var num = parseFloat(values[0]);
	        var power = parseFloat(values[1]);
	        return _.isFinite(num) && _.isFinite(power) ? MATH_POW(num, power) : CalcErrorsNumber;
	    }

	    function __sumItems(item, ctx) {
	        if (CalcConvert.err(item)) {
	            ctx.value = item;
	            return false;
	        } else if (CalcConvert.ref(item) || CalcConvert.arr(item) || _.isArray(item)) {
	            return __iterate(item, __sumItems, ctx);
	        } else {
	            var dv = {value: 0};
	            if (CalcConvert.rD(item, dv)) {
	                var v = dv.value;
	                if (!isNaN(v) && isFinite(v)) {
	                    ctx.value += v;
	                }
	            }
	            return true;
	        }
	    }

	    function mt_sum(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        if (!_.isArray(values)) {
	            values = [values];
	        }
	        var dateFlag = false;
	        for (var i = 0, len = values.length, result = 0; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                result += values[i];
	            } else if (_.isDate(values[i])) {
	                result += CalcConvert._toOADate(values[i]);
	                dateFlag = true;
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return dateFlag ? CalcConvert._fromOADate(result) : result;
	    }

	    function mt_sumx(args, context) {
	        return args.length === 2 ? mt_sum([args[1]], context) : CalcErrorsReference;
	    }

	    function mt_sign(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _sign$evaluateSingleValue);
	    }

	    function _sign$evaluateSingleValue(values) {
	        var num = parseFloat(values);
	        return _.isFinite(num) ?
	            num > 0 ? 1 : (num < 0 ? -1 : 0) :
	            CalcErrorsValue;
	    }

	    function __gcdImp(a, b) {
	        while (b !== 0) {
	            var r = a % b;
	            a = b;
	            b = r;
	        }
	        return a;
	    }

	    function mt_gcd(args) {
	        var result = 0;

	        for (var i = 0; i < args.length; i++) {
	            var array = CalcConvert.toArr(args[i], 1 /* numberType */, true, true, false);

	            for (var j = 0; j < array.length; j++) {
	                var obj = array[i];
	                if (obj !== CalcConvert.CalcConvertedError) {
	                    if (obj < 0) {
	                        return CalcErrorsNumber;
	                    }
	                    result = __gcdImp(result, CalcConvert.I(obj));
	                }
	            }
	        }
	        return result;
	    }

	    function mt_lcm(args) {
	        var result = 1;
	        var nums = [];

	        for (var i = 0; i < args.length; i++) {
	            var array = CalcConvert.toArr(args[i], 1 /* numberType */, true, true, false);

	            for (var j = 0; j < array.length; j++) {
	                var obj = array[j];
	                if (obj !== CalcConvert.CalcConvertedError) {
	                    if (obj < 0) {
	                        return CalcErrorsNumber;
	                    } else if (obj === 0) {
	                        return 0;
	                    }
	                    nums.push(CalcConvert.I(obj));
	                }
	            }
	            for (var k = 0; k < nums.length; k++) {
	                var item = nums[k];
	                result /= __gcdImp(result, item);
	                result *= item;
	            }
	        }
	        return result;
	    }

	    function mt_sqrt(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _sqrt$evaluateSingleValue);
	    }

	    function _sqrt$evaluateSingleValue(values) {
	        var num = parseFloat(values);
	        return num >= 0 ? MATH_SQRT(num) : CalcErrorsNumber;
	    }

	    function mt_quotient(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _quotient$evaluateSingleValue);
	    }

	    function _quotient$evaluateSingleValue(values) {
	        if (CalcConvert.err(values[0])) {
	            return values[0];
	        }
	        if (CalcConvert.err(values[1])) {
	            return values[1];
	        }

	        var num = CalcConvert.D(values[0]);
	        var denom = CalcConvert.D(values[1]);
	        if (isNaN(num) || isNaN(denom)) {
	            return CalcErrorsValue;
	        }
	        if (denom === 0.0) {
	            return CalcErrorsDivideByZero;
	        }
	        return parseInt((num / denom).toString(), 10);
	    }

	    function mt_floor(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _floor$evaluateSingleValue);
	    }

	    function _floor$evaluateSingleValue(values) {
	        var num = CalcConvert.D(values[0]);
	        var sign = CalcConvert.D(values[1]);
	        if (isNaN(num) || isNaN(sign)) {
	            return CalcErrorsValue;
	        }
	        if (num === 0.0 || sign === 0.0) {
	            return 0.0;
	        }

	        if (num > 0.0 && sign < 0.0) {
	            return CalcErrorsNumber;
	        }

	        var _MathHelper = Functions._MathHelper;
	        if (num < 0.0 && 0.0 < sign) {
	            sign = -sign;
	            return _MathHelper.approxCeiling(num / sign) * sign;
	        }
	        return _MathHelper.approxFloor(num / sign) * sign;
	    }

	    function mt_mround(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _mround$evaluateSingleValue);
	    }

	    function _mround$evaluateSingleValue(values) {
	        var number = CalcConvert.D(values[0]);
	        var multiple = CalcConvert.D(values[1]);
	        if (isNaN(number) || isNaN(multiple)) {
	            return CalcErrorsValue;
	        }
	        if (number === 0.0 || multiple === 0.0) {
	            return 0.0;
	        }
	        if ((number < 0.0 && 0.0 < multiple) || (multiple < 0.0 && 0.0 < number)) {
	            return CalcErrorsNumber;
	        }
	        return Functions._MathHelper.approxFloor(number / multiple + 0.5) * multiple;
	    }

	    function mt_round(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _round$evaluateSingleValue);
	    }

	    function _round$evaluateSingleValue(values) {
	        var number = CalcConvert.D(values[0]);
	        if (isNaN(number)) {
	            return CalcErrorsValue;
	        }
	        var digits = CalcConvert.I(values[1]);
	        var _MathHelper = Functions._MathHelper;
	        var power = _MathHelper.pow10(MATH_ABS(digits));
	        if (digits < 0) {
	            number /= power;
	        } else {
	            number *= power;
	        }
	        if (number < 0.0) {
	            number = _MathHelper.approxCeiling(number - 0.5);
	        } else {
	            number = _MathHelper.approxFloor(number + 0.5);
	        }
	        if (digits < 0) {
	            number *= power;
	        } else {
	            number /= power;
	        }
	        return CalcConvert.toResult(number);
	    }

	    function mt_rounddown(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _rounddown$evaluateSingleValue);
	    }

	    function _rounddown$evaluateSingleValue(values) {
	        var number = CalcConvert.D(values[0]);
	        if (isNaN(number)) {
	            return CalcErrorsValue;
	        }
	        var digits = CalcConvert.I(values[1]);
	        var _MathHelper = Functions._MathHelper;
	        var power = _MathHelper.pow10(MATH_ABS(digits));
	        if (digits < 0) {
	            number /= power;
	        } else {
	            number *= power;
	        }
	        if (number < 0.0) {
	            number = _MathHelper.approxCeiling(number);
	        } else {
	            number = _MathHelper.approxFloor(number);
	        }
	        if (digits < 0) {
	            number *= power;
	        } else {
	            number /= power;
	        }
	        return CalcConvert.toResult(number);
	    }

	    function mt_roundup(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _roundup$evaluateSingleValue);
	    }

	    function _roundup$evaluateSingleValue(values) {
	        var number = CalcConvert.D(values[0]);
	        if (isNaN(number)) {
	            return CalcErrorsValue;
	        }
	        var digits = CalcConvert.I(values[1]);
	        var _MathHelper = Functions._MathHelper;
	        var power = _MathHelper.pow10(MATH_ABS(digits));
	        if (digits < 0) {
	            number /= power;
	        } else {
	            number *= power;
	        }
	        if (number < 0.0) {
	            number = _MathHelper.approxFloor(number);
	        } else {
	            number = _MathHelper.approxCeiling(number);
	        }
	        if (digits < 0) {
	            number *= power;
	        } else {
	            number /= power;
	        }
	        return CalcConvert.toResult(number);
	    }

	    function mt_trunc(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = Calc._Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 0;
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _trunc$evaluateSingleValue);
	    }

	    function _trunc$evaluateSingleValue(values) {
	        var number = CalcConvert.D(values[0]);
	        var digits = values[1];
	        if (isNaN(number)) {
	            return CalcErrorsValue;
	        }
	        var _MathHelper = Functions._MathHelper;
	        var power = _MathHelper.pow10(MATH_ABS(digits));
	        if (digits < 0) {
	            number /= power;
	        } else {
	            number *= power;
	        }
	        if (number < 0.0) {
	            number = _MathHelper.approxCeiling(number);
	        } else {
	            number = _MathHelper.approxFloor(number);
	        }
	        if (digits < 0) {
	            number *= power;
	        } else {
	            number /= power;
	        }
	        return CalcConvert.toResult(number);
	    }

	    function mt_exp(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _exp$evaluateSingleValue);
	    }

	    function _exp$evaluateSingleValue(values) {
	        var d;

	        if (isNaN(d = CalcConvert.D(values))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_EXP(d));
	    }

	    function mt_log(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = args.length === 2 ? fixValues_(args[1], context, false) : 10.0;
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _log$evaluateSingleValue);
	    }

	    function _log$evaluateSingleValue(values) {
	        var num = parseFloat(values[0]);
	        var base = parseFloat(values[1]);
	        if (_.isFinite(num) && _.isFinite(base)) {
	            return num <= 0.0 || base <= 0.0 ?
	                CalcErrorsNumber :
	                CalcConvert.toResult(MathEx.log(num, base));
	        } else {
	            return CalcErrorsValue;
	        }
	    }

	    function mt_log10(args, context) {
	        return args.length === 1 ? mt_log(args, context) : CalcErrorsReference;
	        //var num = CalcConvert.D(args[0]);
	        //if (isNaN(num)) {
	        //    return CalcErrorsValue;
	        //}
	        //if (num <= 0.0) {
	        //    return CalcErrorsNumber;
	        //}
	        //return CalcConvert.toResult(MathEx.log10(num));
	    }

	    function mt_sqrtpi(args) {
	        var number;

	        if (isNaN(number = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        if (number < 0.0) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_SQRT(number * MATH_PI));
	    }

	    function mt_radians(args) {
	        var d;
	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return MATH_PI * d / 180.0;
	    }

	    function mt_cos(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_COS(d));
	    }

	    function mt_acos(args) {
	        var num;

	        if (isNaN(num = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        if (num < -1.0 || 1.0 < num) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_ACOS(num));
	    }

	    function mt_cosh(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult((MATH_EXP(d) + MATH_EXP(-d)) / 2);
	    }

	    function mt_acosh(args) {
	        var num;

	        if (isNaN(num = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        if (num < 1.0) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_LOG(num + MATH_SQRT(num * num - 1.0)));
	    }

	    function mt_sin(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_SIN(d));
	    }

	    function mt_asin(args) {
	        var num;

	        if (isNaN(num = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        if (num < -1.0 || 1.0 < num) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_ASIN(num));
	    }

	    function mt_sinh(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult((MATH_EXP(d) - MATH_EXP(-d)) / 2);
	    }

	    function mt_asinh(args) {
	        var number;

	        if (isNaN(number = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_LOG(number + MATH_SQRT(number * number + 1.0)));
	    }

	    function mt_tan(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_TAN(d));
	    }

	    function mt_atan(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return CalcConvert.toResult(MATH_ATAN(d));
	    }

	    function mt_atan2(args) {
	        var x, y;

	        if (isNaN(x = CalcConvert.D(args[0])) || isNaN(y = CalcConvert.D(args[1]))) {
	            return CalcErrorsValue;
	        }
	        if (x === 0.0 && y === 0.0) {
	            return CalcErrorsDivideByZero;
	        }
	        return CalcConvert.toResult(MATH_ATAN2(y, x));
	    }

	    function mt_tanh(args) {
	        var d;

	        if (isNaN(d = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        var x = MATH_EXP(d);
	        var y = MATH_EXP(-d);
	        return CalcConvert.toResult(x - y) / (x + y);
	    }

	    function mt_atanh(args) {
	        var number;

	        if (isNaN(number = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        if (number <= -1.0 || 1.0 <= number) {
	            return CalcErrorsNumber;
	        }
	        return CalcConvert.toResult(MATH_LOG((1.0 + number) / (1.0 - number)) / 2.0);
	    }

	    function mt_rand() {
	        return MATH_RANDOM();
	        //var random = Math_random();
	        //var result = -1 + random * 2;
	        //return Math_abs(result);
	    }

	    function mt_randbetween(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _randbetween$evaluateSingleValue);
	    }

	    function _randbetween$evaluateSingleValue(values) {
	        if (CalcConvert.err(values[1])) {
	            return values[1];
	        }
	        if (CalcConvert.err(values[0])) {
	            return values[0];
	        }
	        var min;
	        var max;
	        var temp;
	        if (isNaN(min = CalcConvert.I(values[0])) || isNaN(max = CalcConvert.I(values[1]))) {
	            return CalcErrorsValue;
	        }
	        if (max < min) {
	            temp = min;
	            min = max;
	            max = temp;
	            //return CalcErrorsNumber;
	        }
	        var random = MATH_RANDOM();
	        return CalcConvert.I(min + random * (max - min + 1));
	    }

	    //</editor-fold>
	    //<editor-fold desc='Logical'>
	    function lg_and(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _and$evaluateSingleValue);
	        //for (var i = 0; i < args.length; i++) {
	        //    var array = CalcConvert.toArr(args[i], 3 /* booleanType */, true, true, false);
	        //
	        //    for (var j = 0; j < array.length; j++) {
	        //        if (!array[j]) {
	        //            return false;
	        //        }
	        //    }
	        //}
	        //return true;
	    }

	    function _and$evaluateSingleValue(values) {
	        return (!!values[0]) && (!!values[1]);
	    }

	    function lg_or(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _or$evaluateSingleValue);
	        //for (var i = 0; i < args.length; i++) {
	        //    var array = CalcConvert.toArr(args[i], 3 /* booleanType */, true, true, false);
	        //
	        //    for (var j = 0; j < array.length; j++) {
	        //        if (array[j] && array[j] !== CalcConvert.CalcConvertedError) {
	        //            return true;
	        //        }
	        //    }
	        //}
	        //return false;
	    }

	    function _or$evaluateSingleValue(values) {
	        return (!!values[0]) || (!!values[1]);
	    }

	    function lg_not(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _not$evaluateSingleValue);
	        // TODO, exclude reference
	        //if (CalcConvert.ref(args[0])) {
	        //    if (args[0].getRangeCount() > 1) {
	        //        return CalcErrorsValue;
	        //    }
	        //    return new Calc._UnaryCompositeConcreteReference(args[0].getSource(),
	        //        args[0].getRow(0), args[0].getColumn(0), args[0].getRowCount(0), args[0].getColumnCount(0),
	        //        _not$evaluateSingleValue);
	        //}
	        //if (CalcConvert.arr(args[0])) {
	        //    var result = [];
	        //    var rowCount = args[0].getRowCount();
	        //    var columnCount = args[0].getColumnCount();
	        //    for (var i = 0; i < rowCount; i++) {
	        //        result[i] = [columnCount];
	        //        for (var j = 0; j < columnCount; j++) {
	        //            var val = args[0].getValue(i, j);
	        //            var type = typeof val;
	        //            if (type === const_boolean || type === const_number) {
	        //                result[i][j] = !val;
	        //            } else {
	        //                result[i][j] = CalcErrorsValue;
	        //            }
	        //        }
	        //    }
	        //    //return new Calc._ConcreteArray(result);
	        //    return result;
	        //}
	        //return _not$evaluateSingleValue(args[0]);
	    }

	    function _not$evaluateSingleValue(value) {
	        try {
	            var result = CalcConvert.B(value);
	            return !result;
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function lg_if(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2, values3], context, _if$evaluateSingleValue);
	        //var arg0 = args[0];
	        //var arg1 = args[1];
	        //var _Helper = Calc._Helper;
	        //var arg2 = _Helper._argumentExists(args, 2) ? args[2] : (args.length === 2 ? <any>false : 0);
	        //var val = _Helper.tryExtractToSingleValue(arg0);
	        //if (val.success) {
	        //    arg0 = val.value;
	        //    return _if$evaluateSingleValue(arg0, arg1, arg2);
	        //}
	        //val = _Helper.tryExtractToSingleValue(arg1);
	        //arg1 = val.value;
	        //var isArg1Simple = val.success;
	        //val = _Helper.tryExtractToSingleValue(arg2);
	        //arg2 = val.value;
	        //var isArg2Simple = val.success;
	        //var rowCount = arg0.getRowCount();
	        //var columnCount = arg0.getColumnCount();
	        //var result = [];
	        //for (var i = 0; i < rowCount; i++) {
	        //    result[i] = [columnCount];
	        //    for (var j = 0; j < columnCount; j++) {
	        //        result[i][j] = _if$evaluateSingleValue(arg0.getValue(i, j),
	        //            isArg1Simple ? arg1 : _Helper.getArrayValue(arg1, i, j),
	        //            isArg2Simple ? arg2 : _Helper.getArrayValue(arg2, i, j));
	        //    }
	        //}
	        ////return new Calc._ConcreteArray(result);
	        //return result;
	    }

	    function _if$evaluateSingleValue(values) {
	        return !!values[0] ? values[1] : (_.isUndefined(values[2]) || _.isNull(values[2]) ? '' : values[2]);
	    }

	    //function _if$evaluateSingleValue(arg0, arg1, arg2) {
	    //    try {
	    //        var condition = CalcConvert.B(arg0);
	    //        return condition ? arg1 : arg2;
	    //    } catch (err) {
	    //        return CalcErrorsValue;
	    //    }
	    //}

	    function lg_iferror(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _iferror$evaluateSingleValue);

	        // TODO, exclude reference
	        //if (!isError && CalcConvert.ref(args[0])) {
	        //    var arg0Ref = args[0];
	        //    if (arg0Ref.getRangeCount() > 1) {
	        //        return CalcErrorsValue;
	        //    }
	        //    return new Calc._BinaryCompositeConcreteReference(arg0Ref.getSource(), arg0Ref.getRow(0),
	        //        arg0Ref.getColumn(0),
	        //        arg0Ref.getRowCount(0), arg0Ref.getColumnCount(0),
	        //        _iferror$evaluateSingle,
	        //        args[1]);
	        //}
	    }

	    function _iferror$evaluateSingleValue(values) {
	        var isError = CalcConvert.err(values[0]);
	        return isError ? ((values[1] !== KEYWORD_UNDEFINED && values[1] !== KEYWORD_NULL) ? values[1] : 0) : ((values[0] !== KEYWORD_UNDEFINED && values[0] !== KEYWORD_NULL) ? values[0] : 0);
	    }

	    function lg_true() {
	        return true;
	    }

	    function lg_false() {
	        return false;
	    }

	    //</editor-fold>
	    //<editor-fold desc='DateTime'>
	    function dt_date(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2, values3], context, _date$evaluateSingleValue);
	    }

	    function _date$evaluateSingleValue(values) {
	        try {
	            var year, month, day;
	            if (isNaN(year = CalcConvert.I(values[0])) || isNaN(month = CalcConvert.I(values[1])) || isNaN(day = CalcConvert.I(values[2]))) {
	                return CalcErrorsValue;
	            }
	            if (year < 0 || 9999 < year) {
	                return CalcErrorsNumber;
	            }
	            if (year <= 1899) {
	                year += 1900;
	            }
	            var date = new Date(year, month - 1, day);
	            if (date < new Date(1899, 11, 30)) {
	                return CalcErrorsNumber;
	            }
	            return date;
	        } catch (err) {
	            return CalcErrorsNumber;
	        }
	    }

	    function dt_time(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2, values3], context, _time$evaluateSingleValue);
	    }

	    function _time$evaluateSingleValue(values) {
	        var hour, minute, second;
	        try {
	            if (isNaN(hour = CalcConvert.I(values[0])) || isNaN(minute = CalcConvert.I(values[1])) || isNaN(second = CalcConvert.I(values[2]))) {
	                return CalcErrorsValue;
	            }
	            var time = CalcConvert._fromOADate(0);
	            time.setHours(hour);
	            time.setMinutes(minute);
	            time.setSeconds(second);
	            time.setMilliseconds(0);
	            if (time.getHours() < 0 && time.getMinutes() < 0 && time.getSeconds() < 0) {
	                return CalcErrorsNumber;
	            }
	            return time;
	        } catch (err) {
	            return CalcErrorsNumber;
	        }
	    }

	    function _isLeapYear(year) {
	        //the last condition is for Excel's bug
	        return (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) || year === 1900;
	    }

	    function dt_datevalue(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _datevalue$evaluateSingleValue);
	    }

	    function _datevalue$evaluateSingleValue(values) {
	        var text = CalcConvert.S(values);
	        if (text === KEYWORD_UNDEFINED || text === KEYWORD_NULL || text === '') {
	            return CalcErrorsValue;
	        }
	        try {
	            var date = CalcConvert._parseLocale(text);
	            var year = date.getFullYear();
	            if (year < 1900) {
	                return CalcErrorsValue;
	            }
	            var month = date.getMonth();
	            var day = date.getDate();
	            var days = 0;
	            for (var i = 1900; i < year; i++) {
	                if (_isLeapYear(i)) {
	                    days += 366;
	                } else {
	                    days += 365;
	                }
	            }

	            for (var i1 = 0; i1 < month; i1++) {
	                switch (i1) {
	                    case 0:
	                    case 2:
	                    case 4:
	                    case 6:
	                    case 7:
	                    case 9:
	                    case 11:
	                        days += 31;
	                        break;
	                    case 1:
	                        if (_isLeapYear(year)) {
	                            days += 29;
	                        } else {
	                            days += 28;
	                        }
	                        break;
	                    case 3:
	                    case 5:
	                    case 8:
	                    case 10:
	                        days += 30;
	                        break;
	                }
	            }
	            days += day;
	            return CalcConvert._fromOADate(days);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_timevalue(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _timevalue$evaluateSingleValue);
	    }

	    function _timevalue$evaluateSingleValue(values) {
	        var text = CalcConvert.S(values);
	        if (text === KEYWORD_UNDEFINED || text === KEYWORD_NULL || text === '') {
	            return CalcErrorsValue;
	        }
	        try {
	            var time = text.split(':');
	            var hour = time[0];
	            var minute = time[1];
	            var second = time[2];
	            return new Date(1899, 11, 30, hour, minute, second);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }


	    //function __parseTime(text) {
	    //    try {
	    //        return CalcConvert._parseLocale(text);
	    //    } catch (err) {
	    //        return CalcErrorsValue;
	    //    }
	    //}
	    //function dt_timevalue(args) {
	    //    var text = CalcConvert.S(args[0]);
	    //    if (text === KEYWORD_UNDEFINED || text === KEYWORD_NULL || text === '') {
	    //        return CalcErrorsValue;
	    //    }
	    //    try {
	    //        var time = __parseTime(text);
	    //        var totalSeconds = ((time.getHours() * 60) + time.getMinutes()) * 60 + time.getSeconds();
	    //        var allSecondsADay = 24 * 3600;
	    //        return totalSeconds / allSecondsADay;
	    //    } catch (err) {
	    //        return CalcErrorsValue;
	    //    }
	    //}

	    function dt_now(args) {
	        return new Date();
	    }

	    function dt_today() {
	        var date = new Date();
	        date.setHours(0);
	        date.setMinutes(0);
	        date.setSeconds(0);
	        date.setMilliseconds(0);
	        return date;
	    }

	    function dt_hour(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _hour$evaluateSingleValue);
	    }

	    function _hour$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getHours();
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_minute(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _minute$evaluateSingleValue);
	    }

	    function _minute$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getMinutes();
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_second(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _second$evaluateSingleValue);
	    }

	    function _second$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getSeconds();
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_day(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _day$evaluateSingleValue);
	    }

	    function _day$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getDate();
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_month(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _month$evaluateSingleValue);
	    }

	    function _month$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getMonth() + 1;
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function dt_year(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _year$evaluateSingleValue);
	    }

	    function _year$evaluateSingleValue(values) {
	        try {
	            var dt = CalcConvert.DT(values);
	            return dt.getFullYear();
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	    }

	    function _getDayOfYear(date) {
	        var year = date.getFullYear();
	        var month = date.getMonth();
	        var day = date.getDate();
	        var days = 0;

	        for (var i = 0; i < month; i++) {
	            switch (i) {
	                case 0:
	                case 2:
	                case 4:
	                case 6:
	                case 7:
	                case 9:
	                case 11:
	                    days += 31;
	                    break;
	                case 1:
	                    if (_isLeapYear(year)) {
	                        days += 29;
	                    } else {
	                        days += 28;
	                    }
	                    break;
	                case 3:
	                case 5:
	                case 8:
	                case 10:
	                    days += 30;
	                    break;
	            }
	        }
	        days += day;
	        return days;
	    }

	    function _getWeekOfYear(date, type) {
	        var days = _getDayOfYear(date);
	        var dayOfFirstDay = new Date(date.getFullYear(), 0, 1).getDay();
	        if (type === 2) {
	            dayOfFirstDay -= 1;
	            if (dayOfFirstDay < 0) {
	                dayOfFirstDay = 6;
	            }
	        }
	        var dayDiff = days - 1 - (6 - dayOfFirstDay);
	        if (dayDiff < 0) {
	            dayDiff = 0;
	        }
	        return 1 + CalcConvert.I(dayDiff / 7) + ((dayDiff % 7 !== 0) ? 1 : 0);
	    }

	    function dt_weeknum(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _weeknum$evaluateSingleValue);
	    }

	    function _weeknum$evaluateSingleValue(values) {
	        var date;

	        try {
	            date = CalcConvert.DT(values[0]);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	        var type;
	        if (isNaN(type = CalcConvert.I(values[1] ? values[1] : 1))) {
	            return CalcErrorsValue;
	        }
	        var cal;
	        switch (type) {
	            case 1:
	            case 2:
	                return _getWeekOfYear(date, type);
	            default:
	                return CalcErrorsNumber;
	        }
	    }

	    function dt_weekday(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _weekday$evaluateSingleValue);
	    }

	    function _weekday$evaluateSingleValue(values) {
	        var dt;
	        try {
	            dt = CalcConvert.DT(values[0]);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	        var type;
	        if (isNaN(type = CalcConvert.I(values[1] ? values[1] : 1))) {
	            return CalcErrorsValue;
	        }
	        var result;
	        switch (type) {
	            case 1:
	                result = dt.getDay() + 1;
	                break;
	            case 2:
	                if (dt.getDay() === 0) {
	                    result = 7;
	                } else {
	                    result = dt.getDay();
	                }
	                break;
	            case 3:
	                if (dt.getDay() === 0) {
	                    result = 6;
	                } else {
	                    result = dt.getDay() - 1;
	                }
	                break;
	            default:
	                return CalcErrorsNumber;
	        }
	        return result;
	    }

	    function dt_edate(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _edate$evaluateSingleValue);
	    }

	    function _edate$evaluateSingleValue(values) {
	        var startDate;
	        var months;

	        try {
	            startDate = CalcConvert.DT(values[0]);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	        if (isNaN(months = CalcConvert.I(values[1]))) {
	            return CalcErrorsValue;
	        }
	        startDate.setMonth(startDate.getMonth() + months);
	        return startDate;
	    }

	    function _getDaysInMonth(year, month) {
	        switch (month) {
	            case 0:
	            case 2:
	            case 4:
	            case 6:
	            case 7:
	            case 9:
	            case 11:
	                return 31;
	            case 1:
	                return _isLeapYear(year) ? 29 : 28;
	            case 3:
	            case 5:
	            case 8:
	            case 10:
	                return 30;
	        }
	    }

	    function dt_eomonth(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values1, values2], context, _eomonth$evaluateSingleValue);
	    }

	    function _eomonth$evaluateSingleValue(values) {
	        var startDate;
	        var months;

	        try {
	            startDate = CalcConvert.DT(values[0]);
	        } catch (err) {
	            return CalcErrorsValue;
	        }
	        if (isNaN(months = CalcConvert.I(values[1]))) {
	            return CalcErrorsValue;
	        }
	        startDate.setMonth(startDate.getMonth() + months);
	        var days = _getDaysInMonth(startDate.getFullYear(), startDate.getMonth());
	        startDate.setDate(days);
	        return startDate;
	    }

	    function _compareDateTime(date1, date2) {
	        return date1 - date2;
	    }

	    function dt_days360(args) {
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var startDate = CalcConvert.DT(args[0]);
	        var endDate = CalcConvert.DT(args[1]);
	        var method = _Helper._argumentExists(args, 2) ? CalcConvert.B(args[2]) : false;
	        var startDay = startDate.getDate();
	        var endDay = endDate.getDate();
	        var startMonth = startDate.getMonth();
	        var endMonth = endDate.getMonth();
	        var StartYear = startDate.getFullYear();
	        var endYear = endDate.getFullYear();
	        if (method) {
	            endDay = endDay === 31 ? 30 : endDay;
	            startDay = startDay === 31 ? 30 : startDay;
	        } else {
	            startDay = startDay === 31 ? 30 : startDay;
	            if (endDay === 31) {
	                if (startDay < 30) {
	                    endDay = 1;
	                    endMonth++;
	                    if (endMonth > 12) {
	                        endMonth = 1;
	                        endYear++;
	                    }
	                } else {
	                    endDay = 30;
	                }
	            }
	        }
	        return ((endYear - StartYear) * 12 + (endMonth - startMonth)) * 30 + (endDay - startDay);
	    }

	    function _yearfracImp(from, to, basis) {

	        var days = _FinancialHelper.__days_between_basis(from, to, basis);
	        var peryear;

	        if (days < 0) {
	            var tmp;
	            days = -days;
	            tmp = from;
	            from = to;
	            to = tmp;
	        }

	        if (basis === 1) {
	            var y1 = from.getFullYear();
	            var y2 = to.getFullYear();
	            var d1, d2;
	            var feb29s, years;

	            d1 = from;
	            d1.setFullYear(d1.getFullYear() + 1);
	            if (_compareDateTime(to, d1) > 0) {
	                // More than one year.
	                years = y2 + 1 - y1;
	                d1 = new Date(y1, 0, 1);
	                d2 = new Date(y2 + 1, 0, 1);

	                //var DateTimeHelper = wijmo.spread._DateTimeHelper;
	                feb29s = CalcConvert.I(CalcConvert._toOADate(d2) - CalcConvert._toOADate(d1)) - 365 * (y2 + 1 - y1);
	            } else {
	                // Less than one year.
	                years = 1;

	                if ((_isLeapYear(y1) && from.getMonth() < 3) || (_isLeapYear(y2) && (to.getMonth() * 0x100 + to.getDate() >= 2 * 0x100 + 29))) {
	                    feb29s = 1;
	                } else {
	                    feb29s = 0;
	                }
	            }

	            var d = CalcConvert.D(feb29s) / CalcConvert.D(years);
	            peryear = 365.0 + d;
	        } else {
	            peryear = _FinancialHelper.__annual_year_basis(new Date(), basis);
	        }
	        return days / peryear;
	    }

	    function dt_yearfrac(args) {
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var startDate = CalcConvert.DT(args[0]);
	        var endDate = CalcConvert.DT(args[1]);
	        var basis = _Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : 0;
	        if (basis < 0 || basis > 4) {
	            return CalcErrorsNumber;
	        }
	        return _yearfracImp(startDate, endDate, basis);
	    }

	    //</editor-fold>
	    //<editor-fold desc='Text'>

	    function tx_blank() {
	        return ' ';
	    }

	    function _isWhiteSpace(ch) {
	        return (ch === ' ') || (ch === '\t') || (ch === '\n');
	    }

	    function tx_trim(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        var text = CalcConvert.S(values).trim();
	        var str = [];
	        var bAddWhiteSp = true;
	        for (var i = 0; i < text.length; i++) {
	            var ch = text.charAt(i);
	            if (!_isWhiteSpace(ch) || bAddWhiteSp) {
	                str.push(ch);
	            }
	            bAddWhiteSp = !_isWhiteSpace(ch);
	        }
	        return str.join('');
	    }

	    function _addCommas(value) {
	        var str = value.toString();
	        var prefix = '';
	        if (value < 0) {
	            str = str.substr(1);
	            prefix = '-';
	        }
	        var splits = str.split('.');
	        if (splits.length < 1 || splits.length > 2) {
	            return CalcErrorsValue;
	        }
	        var result = [];
	        if (splits.length === 2) {
	            result.push(splits[1]);
	            result.push('.');
	        }
	        str = splits[0];
	        for (var i = str.length - 1 - 2; i >= 0; i = i - 3) {
	            result.push(str.substr(i, 3));
	            if (i > 0) {
	                result.push(',');
	            }
	        }
	        result.push(str.substring(0, i + 3));
	        result.reverse();
	        return prefix + result.join('');
	    }

	    function _toCurrency(value) {
	        var commasValue = _addCommas(value);
	        if (value < 0) {
	            commasValue = commasValue.substr(1); //if value is negative,delete '-'
	        }
	        var result = [];
	        result.push('$');
	        result.push(commasValue);
	        if (value < 0) {
	            result.push(')'); //if value is negative,add '(' and ')'
	            result.unshift('(');
	        }
	        return result.join('');
	    }

	    function tx_fixed(args) {
	        var _number;
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        if (isNaN(_number = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        var decimals = _Helper._argumentExists(args, 1) ? CalcConvert.I(args[1]) : 2;
	        var noCommas = _Helper._argumentExists(args, 2) ? CalcConvert.B(args[2]) : false;
	        var list = [];
	        var divisor = 0;
	        if (decimals < 0) {
	            divisor = CalcConvert.I(MATH_POW(10, MATH_ABS(decimals)));
	            _number /= divisor;
	            list[0] = _number;
	            list[1] = 0;
	        } else {
	            list[0] = _number;
	            list[1] = decimals;
	        }
	        _number = CalcConvert.D(mt_round(list));
	        if (decimals < 0) {
	            _number *= divisor;
	        }
	        if (noCommas) {
	            return _number.toString();
	        } else {
	            return _addCommas(_number);
	        }
	    }

	    function tx_value(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        var Convert = CalcConvert;
	        var text = CalcConvert.S(values);
	        //for accounting standard which denote -x as (x)
	        var sign = 1;
	        if (text.length > 2 && text.charAt(0) === '(' && text.charAt(text.length - 1) === ')') {
	            text = text.slice(1, text.length - 1);
	            sign = -1;
	        }
	        var d;
	        var dt;
	        if (!isNaN(d = parseFloat(text))) {
	            return d * sign;
	        } else {
	            dt = Convert._parseLocale(text);
	            if (dt !== KEYWORD_UNDEFINED && dt !== KEYWORD_NULL) {
	                var result = Convert._toOADate(dt);
	                if (!Convert.err(result)) {
	                    return result;
	                } else {
	                    return dt_timevalue([dt]);
	                }
	            }
	        }
	        return CalcErrorsValue;
	    }

	    function tx_lower(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        var text = CalcConvert.S(values);
	        return text.toLowerCase();
	    }

	    function tx_upper(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference;
	        }
	        var text = CalcConvert.S(values);
	        return text.toUpperCase();
	    }

	    function tx_replace(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        var values4 = fixValues_(args[3], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3) || CalcHelper.tabRef(values4) || CalcHelper.err(values4)) {
	            return CalcErrorsReference;
	        }
	        var oldText = CalcConvert.S(values1);
	        var start = CalcConvert.I(values2);
	        var length = CalcConvert.I(values3);
	        var newText = CalcConvert.S(values4);
	        if (start < 1 || length < 0) {
	            return CalcErrorsValue;
	        }
	        start = MATH_MIN(start, oldText.length + 1);
	        length = MATH_MIN(length, oldText.length - start + 1);
	        var before = oldText.substring(0, start - 1);
	        var after = oldText.substr(start - 1 + length);
	        return before.concat(newText).concat(after);
	    }

	    function tx_substitute(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3)) {
	            return CalcErrorsReference;
	        }
	        var searchtext = CalcConvert.S(values1);
	        var oldtext = CalcConvert.S(values2);
	        var newtext = CalcConvert.S(values3);
	        var result;

	        if (oldtext === '' || oldtext === KEYWORD_UNDEFINED || oldtext === KEYWORD_NULL) {
	            return searchtext;
	        }
	        if (args.length > 3) {
	            var inst = CalcConvert.I(args[3]);
	            var index = 0;
	            if (inst < 1) {
	                return CalcErrorsValue;
	            }
	            for (var i = 0; i < inst; i++) {
	                index = searchtext.indexOf(oldtext, index);
	                if (index === -1) {
	                    return searchtext;
	                }
	                index += oldtext.length;
	            }
	            index -= oldtext.length;
	            var before = searchtext.substring(0, index);
	            var after = searchtext.substr(index + oldtext.length);
	            result = before.concat(newtext).concat(after);
	        } else {
	            result = Calc.StringUtil.replace(searchtext, oldtext, newtext);
	        }
	        return result;
	    }

	    function tx_concatenate(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        var left = _.isUndefined(values1) || _.isNull(values1) ? '' : values1.toString();
	        var right = _.isUndefined(values2) || _.isNull(values2) ? '' : values2.toString();
	        return left + right;
	        //var sb = [];
	        //var length = args.length;
	        //for (var i = 0; i < length; i++) {
	        //    var array = CalcConvert.toArr(args[i], 0 /* anyType */, true, false, false);
	        //    var len = array.length;
	        //    for (var j = 0; j < len; j++) {
	        //        var tmpValue = array[j];
	        //        if (tmpValue !== keyword_undefined && tmpValue !== keyword_null) {
	        //            sb.push(CalcConvert.S(tmpValue));
	        //        }
	        //    }
	        //}
	        //return sb.join('');
	    }

	    function tx_left(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var text = CalcConvert.S(values1);
	        var numChars = values2 ? CalcConvert.I(values2) : 1;
	        if (_.isNaN(numChars) || _.isUndefined(numChars)) {
	            return CalcErrorsValue;
	        }
	        if (numChars < 0) {
	            return CalcErrorsValue;
	        } else if (numChars >= text.length) {
	            return text;
	        } else {
	            return text.substr(0, numChars);
	        }
	    }

	    function tx_mid(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        var values3 = fixValues_(args[2], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2) || CalcHelper.tabRef(values3) || CalcHelper.err(values3)) {
	            return CalcErrorsReference;
	        }
	        var text = CalcConvert.S(values1);
	        var start = CalcConvert.I(values2) - 1;
	        var length = CalcConvert.I(values3);
	        if (start < 0 || length < 0) {
	            return CalcErrorsValue;
	        } else if (start >= text.length) {
	            return '';
	        } else if (text.length < start + length) {
	            return text.substr(start);
	        } else {
	            return text.substr(start, length);
	        }
	    }

	    function tx_right(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var text = CalcConvert.S(values1);
	        var numChars = values2 ? CalcConvert.I(values2) : 1;
	        if (_.isNaN(numChars) || _.isUndefined(numChars)) {
	            return CalcErrorsValue;
	        }
	        if (numChars < 0) {
	            return CalcErrorsValue;
	        } else if (text.length < numChars) {
	            return text;
	        } else {
	            return text.substr(text.length - numChars, numChars);
	        }
	    }

	    function tx_rept(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        var text = CalcConvert.S(values1);
	        var count = CalcConvert.I(values2);
	        if (count < 0 || 32767 < count * text.length) {
	            return CalcErrorsValue;
	        }
	        var result = [];
	        for (var i = 0; i < count; i++) {
	            result.push(text);
	        }
	        return result.join('');
	    }

	    function tx_len(args, context) {
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || CalcHelper.err(values)) {
	            return CalcErrorsReference
	        }
	        return CalcConvert.S(values).length;
	    }

	    function tx_find(args) {
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var searchtext = CalcConvert.S(args[0]);
	        var text = CalcConvert.S(args[1]);
	        var start = _Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : 1;
	        var found;
	        if (start < 1 || text.length < start) {
	            return CalcErrorsValue;
	        }
	        found = text.indexOf(searchtext, start - 1);
	        if (found === -1) {
	            return CalcErrorsValue;
	        }
	        return found + 1;
	    }

	    function tx_search(args) {
	        var Convert = CalcConvert, _Helper = Calc._Helper;
	        var searchtext = CalcConvert.S(args[0]);
	        var text = CalcConvert.S(args[1]);
	        var startIndex = _Helper._argumentExists(args, 2) ? CalcConvert.I(args[2]) : 1;
	        startIndex--;
	        if (startIndex < 0) {
	            return CalcErrorsValue;
	        }
	        var index = -1;
	        try {
	            var wildcardCriteria = Calc.RegUtil.getWildcardCriteria(searchtext);
	            if (!wildcardCriteria) {
	                index = text.toLowerCase().indexOf(searchtext.toLowerCase(), startIndex);
	            } else {
	                var regex = Calc.RegUtil.getRegIgnoreCase(wildcardCriteria);
	                var matchStr = regex.exec(text);
	                if (matchStr !== KEYWORD_UNDEFINED && matchStr !== KEYWORD_NULL) {
	                    index = matchStr.index;
	                } else {
	                    index = -1;
	                }
	            }
	        } catch (err) {
	        }
	        if (index === -1) {
	            return CalcErrorsValue;
	        }
	        return index + 1;
	    }

	    function tx_exact(args, context) {
	        var values1 = fixValues_(args[0], context, false);
	        var values2 = fixValues_(args[1], context, false);
	        if (CalcHelper.tabRef(values1) || CalcHelper.err(values1) || CalcHelper.tabRef(values2) || CalcHelper.err(values2)) {
	            return CalcErrorsReference;
	        }
	        var text1 = CalcConvert.S(values1);
	        var text2 = CalcConvert.S(values2);
	        return text1 === text2;
	    }

	    function tx_t(args) {
	        var val = args[0];
	        return typeof val === 'string' ? val : '';
	    }

	    //</editor-fold>
	    //<editor-fold desc='Information'>

	    function _checkArgumentsLength(args) {
	        if (args === KEYWORD_UNDEFINED || args === KEYWORD_NULL) {
	            throwSR(invalidArg);
	        } else {
	            if (args.length < 1 || args.length > 1) {
	                throwSR(invalidArg);
	            }
	        }
	    }

	    function in_contains(args, context) {
	        var len = args && args.length;
	        var index = 0;
	        var values = fixValues_(args[index], context, false);
	        var value;
	        var result = true;
	        if (CalcHelper.tabRef(values)) {
	            if (values.name === context.calcSource.name) {
	                index = 1;
	            } else {
	                return CalcErrorsReference;
	            }
	        }
	        for (; index < len; ++index) {
	            if (index + 1 === len) {
	                return CalcErrorsReference;
	            }
	            if (CalcHelper.columnRef(args[index])) {
	                values = fixValues_(args[index], context, false);
	                value = fixValues_(args[index + 1], context, false);
	                if (CalcHelper.err(values) || CalcHelper.err(value) || CalcHelper.tabRef(value)) {
	                    return CalcErrorsReference;
	                }
	                result = result && _.includes(values, value);
	                ++index;
	            } else {
	                return CalcErrorsReference;
	            }
	        }
	        return result;
	    }

	    //function _isError(obj, ctx) {
	    //    if (CalcConvert.err(obj)) {
	    //        ctx.value = true;
	    //    } else if ((typeof obj) === CONST_STRING) {
	    //        var err = Calc.CalcError._parseCore(obj);
	    //        ctx.value = (err !== KEYWORD_UNDEFINED && err !== KEYWORD_NULL);
	    //    }
	    //    ctx.value = false;

	    function in_isError(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isError$evaluateSingleValue);
	        //var result = {value: false};
	        //if (CalcConvert.err(args[0])) {
	        //    result.value = true;
	        //} else {
	        //    __iterate(args[0], _isError, result);
	        //}
	        //return result.value;
	    }

	    function _isError$evaluateSingleValue(values) {
	        if (CalcConvert.err(values)) {
	            return true;
	        } else if ((typeof values) === CONST_STRING) {
	            var err = Calc.CalcError._parseCore(values);
	            return (err !== KEYWORD_UNDEFINED && err !== KEYWORD_NULL);
	        }
	        return false;
	    }

	    function in_isNumber(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isNumber$evaluateSingleValue);
	        //return CalcConvert.num(args[0]);
	    }

	    function _isNumber$evaluateSingleValue(values) {
	        return _.isNumber(values) || values === CalcErrorsNumber || values === CalcErrorsDivideByZero;
	    }

	    function in_isEven(args) {
	        _checkArgumentsLength(args);
	        var num;
	        if (isNaN(num = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return Functions._MathHelper.approxFloor(MATH_ABS(num)) % 2.0 === 0.0;
	    }

	    function in_isOdd(args) {
	        _checkArgumentsLength(args);
	        var num;
	        if (isNaN(num = CalcConvert.D(args[0]))) {
	            return CalcErrorsValue;
	        }
	        return Functions._MathHelper.approxFloor(MATH_ABS(num)) % 2.0 !== 0.0;
	    }

	    function in_number(args) {
	        _checkArgumentsLength(args);
	        var value = args[0];

	        if (CalcConvert.num(value)) {
	            return CalcConvert.D(value);
	        } else if ((typeof value) === CONST_BOOLEAN) {
	            return (value) ? 1.0 : 0.0;
	        } else if (CalcConvert.err(value)) {
	            return value;
	        }
	        return 0.0;
	    }

	    function in_isBlank(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isBlank$evaluateSingleValue);
	    }

	    function _isBlank$evaluateSingleValue(values) {
	        return values === KEYWORD_UNDEFINED || values === KEYWORD_NULL || values === CONST_BLANK;
	    }

	    function in_isLogical(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isLogical$evaluateSingleValue);
	    }

	    function _isLogical$evaluateSingleValue(values) {
	        return (typeof values) === CONST_BOOLEAN;
	    }

	    function in_isText(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isText$evaluateSingleValue);
	    }

	    function _isText$evaluateSingleValue(values) {
	        return (typeof values) === CONST_STRING;
	    }

	    function in_isNonText(args, context) {
	        _checkArgumentsLength(args);
	        var values = fixValues_(args[0], context, false);
	        if (CalcHelper.tabRef(values) || values === CalcErrorsReference) {
	            return CalcErrorsReference;
	        }
	        return carryOutArrayFunctions_([values], context, _isNonText$evaluateSingleValue);
	    }

	    function _isNonText$evaluateSingleValue(values) {
	        return (typeof values) !== CONST_STRING;
	    }

	    function in_first(args, context) {
	        var arg = args.length === 1 ? args[0] : args[1];
	        var values = CalcHelper.columnRef(arg) ? arg.getValue(-1, context.groupPath) : CalcErrorsReference;
	        return CalcHelper.err(arg) ? CalcErrorsReference : values[0];
	    }

	    function in_last(args, context) {
	        var arg = args.length === 1 ? args[0] : args[1];
	        var rowCount = arg.calcSource.getRowCount();
	        var values = CalcHelper.columnRef(arg) ? arg.getValue(-1, context.groupPath) : CalcErrorsReference;
	        return CalcHelper.err(arg) ? CalcErrorsReference : values[rowCount - 1];
	    }

	    //</editor-fold>
	    //<editor-fold desc='filter Functions'>
	    function ft_all(args, context) {
	        var columnList = [];
	        var len = args.length;
	        var i = 0;
	        var reproducedSource;
	        var arg;
	        if (args.length === 0) {
	            reproducedSource = context.calcSource.reproduce();
	            return new Calc.CalcTableReference(reproducedSource);
	        }
	        arg = args[0];
	        if (args.length === 1) {
	            return CalcHelper.tabRef(arg) && arg.name === context.calcSource.name ?
	                new Calc.CalcTableReference(context.calcSource.reproduce()) :
	                CalcHelper.columnRef(arg) ?
	                    new Calc.CalcTableReference(context.calcSource.reproduceWithColumns([arg.column])) :
	                    CalcErrorsReference;
	        }
	        if (CalcHelper.tabRef(arg = args[0])) {
	            if (arg.name === context.calcSource.name) {
	                ++i;
	            } else {
	                return CalcErrorsReference;
	            }
	        }
	        for (; i < len; ++i) {
	            if (CalcHelper.columnRef(arg = args[i])) {
	                columnList.push(arg.column);
	            } else {
	                return CalcErrorsReference;
	            }
	        }
	        reproducedSource = context.calcSource.reproduceWithColumns(columnList);
	        return new Calc.CalcTableReference(reproducedSource);
	    }

	    //only a declare for parser to get the right function type, this function is actually handled in evaluator.js
	    function ft_calculate() {}

	    //only a declare for parser to get the right function type, this function is actually handled in evaluator.js
	    function ft_summarize() {}

	    function ft_distinct(args, context) {
	        var calcSource,
	            filterStates = [],
	            columnRef = args[0],
	            currentRow = -1,
	            array,
	            len,
	            i = 0,
	            uniq = [],
	            value,
	            reproducedSource;
	        if (!CalcHelper.columnRef(columnRef)) {
	            return CalcErrorsReference;
	        }
	        array = columnRef.getValue(currentRow, context.groupPath);
	        len = array ? array.length : 0;
	        //if length of input column is zero, return error
	        if (len === 0) {
	            return CalcErrorsReference;
	        }
	        for (; i < len; i++) {
	            if (_.indexOf(uniq, value = array[i]) < 0) {
	                uniq.push(value);
	                filterStates[i] = true;
	            } else {
	                filterStates[i] = false;
	            }
	        }
	        if ((calcSource = context.calcSource) && !(_.isUndefined(filterStates) || _.isNull(filterStates))) {
	            reproducedSource = calcSource.reproduceWithColumns([columnRef.column]);
	            reproducedSource.overlapFilterStates_(filterStates);
	            return new Calc.CalcTableReference(reproducedSource);
	        } else {
	            return CalcErrorsReference;
	        }
	    }

	    function ft_filter(args, context) {
	        var calcSource,
	            filterStates,
	            arg,
	            currentRow = context.getCurrentRow();
	        if (args.length == 1) { // no TableReference, use the context's calcSource
	            calcSource = context.calcSource;
	            arg = args[0];
	        } else if (args.length == 2) { // has TableReference
	            calcSource = args[0].calcSource;
	            arg = args[1];
	        }
	        filterStates = CalcHelper.columnRef(arg) ?
	            arg.getValue(currentRow, context.groupPath) :
	            arg;
	        if (calcSource && !(_.isUndefined(filterStates) || _.isNull(filterStates))) {
	            var clonedSource = calcSource.clone();
	            if (currentRow < 0) {
	                clonedSource.overlapFilterStates_(filterStates);
	            } else {
	                clonedSource.overlapFilterSingleState_(filterStates, currentRow);
	            }
	            return new Calc.CalcTableReference(clonedSource);
	        }
	    }

	    function ft_parentGroup(args, context) {
	        var calcSource = context.calcSource;
	        var groupPath = context.groupPath;
	        var parentGroup;
	        if (!groupPath || groupPath.length < 2) {
	            parentGroup = []; //root group
	        } else {
	            parentGroup = groupPath.slice(0, groupPath.length - 1);
	        }
	        if (calcSource) {
	            var clonedSource = calcSource.clone();
	            clonedSource.bindGroup(parentGroup);
	            return new Calc.CalcTableReference(clonedSource);
	        }
	    }

	    function ft_currentGroup(args, context) {
	        var calcSource = context.calcSource;
	        var groupPath = context.groupPath;
	        if (!groupPath) {
	            var currentRow = context.currentRow || context.currentRowInternal_;
	            if (currentRow !== -1) {
	                groupPath = context.calcSource.getGroupPath(currentRow);
	            }
	        }
	        if (groupPath && calcSource) {
	            var clonedSource = calcSource.clone();
	            clonedSource.bindGroup(groupPath);
	            return new Calc.CalcTableReference(clonedSource);
	        }
	    }

	    function ft_topN(args, context) {
	        var i;
	        var tempI;
	        var j;
	        var endI;
	        var values;
	        var tempValues;
	        var calcSource;
	        var tempResult;
	        var compareResult;
	        var valuesSet = [];
	        var mappings = [];
	        var inverseMapping = [];
	        var orders = [];
	        var len = args.length;
	        var rowCount = context.calcSource.getRowCount();
	        var n = fixValues_(args[0], context, true);
	        if (!_.isNumber(n)) {
	            return CalcErrorsReference;
	        }
	        if (n >= rowCount) {
	            //return input table
	            return args[1];
	        } else if (n <= 0) {
	            //return empty table
	            return new Calc.CalcTableReference();
	        }
	        values = args[1];
	        if (CalcHelper.tabRef(values)) {
	            calcSource = values.calcSource;
	        } else {
	            return CalcErrorsReference;
	        }
	        for (i = 2; i < len; ++i) {
	            //fix expressions:
	            values = tempValues ? tempValues : fixValues_(args[i], context, true);
	            if (CalcHelper.tabRef(values)) {
	                return CalcErrorsReference;
	            } else {
	                valuesSet.push(values);
	            }
	            //fix orders:
	            if (i + 1 < len) {
	                values = fixValues_(args[i + 1], context, true);
	                if (values === 1) {
	                    orders.push(-1);
	                    ++i;
	                    tempValues = KEYWORD_UNDEFINED;
	                } else if (values === 0) {
	                    orders.push(1);
	                    ++i;
	                    tempValues = KEYWORD_UNDEFINED;
	                } else {
	                    orders.push(1);
	                    tempValues = values;
	                }
	            } else {
	                orders.push(1);
	            }
	        }
	        //sorting:
	        i = 0;
	        while (i < rowCount) {
	            mappings[i] = i;
	            ++i;
	        }
	        for (i = 0; i < n;) {
	            tempResult = [i];
	            tempI = i;
	            for (j = i + 1; j < rowCount; j++) {
	                if ((compareResult = compareInTopN_(valuesSet, orders, mappings, tempI, j)) < 0) {
	                    tempResult = [j];
	                    tempI = j;
	                } else if (compareResult === 0) {
	                    tempResult.push(j);
	                }
	            }
	            swapInTopN_(mappings, i, tempResult);
	            i += tempResult.length;
	        }
	        endI = i;
	        //set filter status:
	        i = 0;
	        while (i < rowCount) {
	            inverseMapping[mappings[i]] = (i < endI);
	            ++i;
	        }
	        //return table
	        if (calcSource && !(_.isUndefined(inverseMapping) || _.isNull(inverseMapping))) {
	            var clonedSource = calcSource.clone();
	            clonedSource.overlapFilterStates_(inverseMapping);
	            return new Calc.CalcTableReference(clonedSource);
	        }
	    }

	    function compareInTopN_(valuesSet, orders, mappings, i, j) {
	        var D = valuesSet.length;
	        var index;
	        var vi;
	        var vj;
	        for (index = 0; index < D; ++index) {
	            vi = valuesSet[index];
	            if (_.isArray(vi)) {
	                vj = vi[mappings[j]];
	                vi = vi[mappings[i]];
	                if (vi > vj) {
	                    return orders[index];
	                } else if (vi < vj) {
	                    return -orders[index];
	                }
	            }
	        }
	        return 0;
	    }

	    function swapInTopN_(mappings, startIndex, result) {
	        var tempIndex;
	        var ri;
	        var si;
	        for (var i = 0, len = result.length; i < len; ++i) {
	            if ((ri = result[i]) !== (si = i + startIndex)) {
	                tempIndex = mappings[si];
	                mappings[si] = mappings[ri];
	                mappings[ri] = tempIndex;
	            }
	        }
	    }

	    //</editor-fold>
	    //<editor-fold desc='Statistical Functions'>
	    function st_average(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        for (var i = 0, len = values.length, avg = 0, n = 0; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                avg += values[i];
	                n++;
	            } else if (_.isDate(values[i])) {
	                avg += CalcConvert._toOADate(values[i]);
	                n++;
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return n === 0 ? 0 : avg / n;
	    }

	    function st_averagea(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        for (var i = 0, len = values.length, avg = 0, n = 0; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                avg += values[i];
	                n++;
	            } else if (_.isDate(values[i])) {
	                avg += CalcConvert._toOADate(values[i]);
	                n++;
	            } else if (_.isString(values[i])) {
	                n++;
	            } else if (_.isBoolean(values[i])) {
	                avg += ~~values[i];
	                n++;
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return n === 0 ? 0 : avg / n;
	    }

	    function st_averagex(args, context) {
	        return args.length === 2 ? st_average([args[1]], context) : CalcErrorsReference;
	    }

	    function st_percentile(args) {
	        var k, convert = CalcConvert;
	        if (isNaN(k = CalcConvert.D(args[1]))) {
	            return CalcErrorsValue;
	        }
	        var array = CalcConvert.toArr(args[0], 1 /* numberType */, true, true, false);

	        var list = [];
	        for (var i = 0; i < array.length; i++) {
	            var x = array[i];
	            if (x !== CalcConvert.CalcConvertedError) {
	                list.push(x);
	            }
	        }
	        list.sort(function(x, y) {
	            return x - y;
	        });
	        if (list.length === 0) {
	            return CalcErrorsNumber;
	        }
	        if (k < 0 || 1 < k) {
	            return CalcErrorsNumber;
	        }
	        var index = k * (list.length - 1);
	        var rem = index % 1.0;
	        index = parseInt(index.toString(), 10);
	        if (rem === 0.0) {
	            return list[index];
	        } else {
	            return CalcConvert.D(list[index]) + rem * (CalcConvert.D(list[index + 1]) - CalcConvert.D(list[index]));
	        }
	    }

	    function st_max(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var dateFlag = false;
	        var temp;
	        for (var i = 0, len = values.length, result; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                if (!result || result < values[i]) {
	                    result = values[i];
	                }
	            } else if (_.isDate(values[i])) {
	                dateFlag = true;
	                temp = CalcConvert._toOADate(values[i]);
	                if (!result || result < temp) {
	                    result = temp;
	                }
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return dateFlag ? CalcConvert._fromOADate(result) : result;
	    }

	    function st_maxa(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var dateFlag = false;
	        var temp;
	        for (var i = 0, len = values.length, result; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                if (!result || result < values[i]) {
	                    result = values[i];
	                }
	            } else if (_.isDate(values[i])) {
	                dateFlag = true;
	                temp = CalcConvert._toOADate(values[i]);
	                if (!result || result < temp) {
	                    result = temp;
	                }
	            } else if (_.isString(values[i])) {
	                if (!result || result < 0) {
	                    result = 0;
	                }
	            } else if (_.isBoolean(values[i])) {
	                if (!result || result < ~~values[i]) {
	                    result = values[i];
	                }
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return dateFlag ? CalcConvert._fromOADate(result) : result;
	    }

	    function st_maxx(args, context) {
	        return args.length === 2 ? st_max([args[1]], context) : CalcErrorsReference;
	    }

	    function st_min(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var dateFlag = false;
	        var temp;
	        for (var i = 0, len = values.length, result; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                if (!result || result > values[i]) {
	                    result = values[i];
	                }
	            } else if (_.isDate(values[i])) {
	                dateFlag = true;
	                temp = CalcConvert._toOADate(values[i]);
	                if (!result || result > temp) {
	                    result = temp;
	                }
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return dateFlag ? CalcConvert._fromOADate(result) : result;
	    }

	    function st_mina(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var dateFlag = false;
	        var temp;
	        for (var i = 0, len = values.length, result; i < len; i++) {
	            if (_.isNumber(values[i])) {
	                if (!result || result > values[i]) {
	                    result = values[i];
	                }
	            } else if (_.isDate(values[i])) {
	                dateFlag = true;
	                temp = CalcConvert._toOADate(values[i]);
	                if (!result || result > temp) {
	                    result = temp;
	                }
	            } else if (_.isString(values[i])) {
	                if (!result || result > 0) {
	                    result = 0;
	                }
	            } else if (_.isBoolean(values[i])) {
	                if (!result || result > ~~values[i]) {
	                    result = values[i];
	                }
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return dateFlag ? CalcConvert._fromOADate(result) : result;
	    }

	    function st_minx(args, context) {
	        return args.length === 2 ? st_min([args[1]], context) : CalcErrorsReference;
	    }

	    function st_large(args) {
	        if (CalcConvert.err(args[0])) {
	            return args[0];
	        }
	        if (CalcConvert.err(args[1])) {
	            return args[1];
	        }
	        var k;
	        if (isNaN(k = CalcConvert.I(args[1]))) {
	            return CalcErrorsValue;
	        }
	        var array = CalcConvert.toArr(args[0], 1 /* numberType */, true, true, false);

	        var list = [];
	        for (var i = 0; i < array.length; i++) {
	            var x = array[i];
	            if (x !== CalcConvert.CalcConvertedError) {
	                list.push(x);
	            }
	        }
	        list.sort(function(x, y) {
	            return x - y;
	        });
	        if (k <= 0 || list.length < k) {
	            return CalcErrorsNumber;
	        }
	        return list[list.length - k];
	    }

	    function st_small(args) {
	        if (CalcConvert.err(args[0])) {
	            return args[0];
	        }
	        if (CalcConvert.err(args[1])) {
	            return args[1];
	        }
	        var k;
	        if (isNaN(k = CalcConvert.I(args[1]))) {
	            return CalcErrorsValue;
	        }
	        var array = CalcConvert.toArr(args[0], 1 /* numberType */, true, true, false);

	        var list = [];
	        for (var i = 0; i < array.length; i++) {
	            var x = array[i];
	            if (x !== CalcConvert.CalcConvertedError) {
	                list.push(x);
	            }
	        }
	        list.sort(function(x, y) {
	            return x - y;
	        });
	        if (k <= 0 || list.length < k) {
	            return CalcErrorsNumber;
	        }
	        return list[k - 1];
	    }

	    function st_rank(args) {
	        //var convert = CalcConvert, arrayHelper = Calc.CalcArrayHelper;
	        //var num;
	        //if (CalcConvert.ref(args[0])) {
	        //    if (arrayHelper.getLength(args[0]) === 1) {
	        //        num = arrayHelper.getValueByIndex(args[0], 0);
	        //    } else {
	        //        return CalcErrorsValue;
	        //    }
	        //} else {
	        //    num = args[0];
	        //}
	        //if (isNaN(num = CalcConvert.D(num))) {
	        //    return CalcErrorsValue;
	        //}
	        //var array = CalcConvert.toArr(args[1], CalcValueType.numberType, true, true, false);
	        //var order = 0.0;
	        //if (Calc._Helper._argumentExists(args, 2)) {
	        //    if (isNaN(order = CalcConvert.D(args[2]))) {
	        //        return CalcErrorsValue;
	        //    }
	        //}
	        //var lessThanCount = 0;
	        //var equalToCount = 0;
	        //var greaterThanCount = 0;
	        //for (var i = 0; i < array.length; i++) {
	        //    var x = array[i];
	        //    if (x !== CalcConvert.CalcConvertedError) {
	        //        if (x < num) {
	        //            lessThanCount++;
	        //        }
	        //        else if (num < x) {
	        //            greaterThanCount++;
	        //        }
	        //        else {
	        //            equalToCount++;
	        //        }
	        //    }
	        //}
	        //if (equalToCount === 0) {
	        //    return CalcErrorsNotAvailable;
	        //}
	        //return order === 0 ? greaterThanCount + 1 : lessThanCount + 1;
	    }

	    function st_count(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        //todo: extract the type check
	        for (var i = 0, n = 0, len = values.length; i < len; i++) {
	            if (_.isNumber(values[i]) || _.isDate(values[i])) {
	                n++;
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return n;
	    }

	    function st_countx(args, context) {
	        return args.length === 2 ? st_count([args[1]], context) : CalcErrorsReference;
	    }

	    function st_counta(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        //todo: extract the type check
	        for (var i = 0, n = 0, len = values.length; i < len; i++) {
	            if (_.isNumber(values[i]) || _.isDate(values[i]) || _.isBoolean(values[i]) || _.isString(values[i])) {
	                n++;
	            } else if (!_.isUndefined(values[i]) && !_.isNull(values[i])) {
	                return CalcErrorsValue;
	            }
	        }
	        return n;
	    }

	    function st_countax(args, context) {
	        return args.length === 2 ? st_counta([args[1]], context) : CalcErrorsReference;
	    }

	    function st_countrows(args, context) {
	        if (args.length !== 1) {
	            return CalcErrorsReference;
	        } else {
	            var arg = args[0];
	            if (CalcHelper.tabRef(arg)) {
	                return arg.calcSource.getRowCount();
	            } else {
	                return CalcErrorsReference;
	            }
	        }
	    }

	    // In Microsoft Excel, the COUNTBLANK function treats the
	    // the empty string '' as blank, but the ISBLANK function treats
	    // the empty string '' as non-blank.  In OpenOffice Calc, both
	    // the COUNTBLANK function and the ISBLANK function treat the
	    // empty string '' as non-blank.  Since OpenOffice is more
	    // consistent, we are using the same definition of COUNTBLANK
	    // as found in OpenOffice Calc.
	    function st_countblank(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        //todo: extract the type check
	        for (var i = 0, n = 0, len = values.length; i < len; i++) {
	            if (_.isUndefined(values[i]) || _.isNull(values[i]) || values[i] === '') {
	                n++;
	            }
	        }
	        return n;
	    }

	    function st_distinctcount(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        return _.uniq(values).length;
	    }

	    function st_stdev_s(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var nD = getVariance_(values, true);
	        return CalcHelper.err(nD) ?
	            nD :
	            _.isNaN(nD) ? CalcErrorsNumber : MATH_SQRT(nD);
	    }

	    function st_stdev_p(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var nD = getVariance_(values, false);
	        return CalcHelper.err(nD) ?
	            nD :
	            _.isNaN(nD) ? CalcErrorsNumber : MATH_SQRT(nD);
	    }

	    function st_stdevx_s(args, context) {
	        return args.length === 2 ? st_stdev_s([args[1]], context) : CalcErrorsReference;
	    }

	    function st_stdevx_p(args, context) {
	        return args.length === 2 ? st_stdev_p([args[1]], context) : CalcErrorsReference;
	    }

	    function st_var_s(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var nD = getVariance_(values, true);
	        return CalcHelper.err(nD) ?
	            nD :
	            _.isNaN(nD) ? CalcErrorsNumber : nD;
	    }

	    function st_var_p(args, context) {
	        var values = fixValues_(args[0], context, true);
	        if (!_.isArray(values)) {
	            return CalcErrorsReference;
	        }
	        var nD = getVariance_(values, false);
	        return CalcHelper.err(nD) ?
	            nD :
	            _.isNaN(nD) ? CalcErrorsNumber : nD;
	    }

	    function st_varx_s(args, context) {
	        return args.length === 2 ? st_var_s([args[1]], context) : CalcErrorsReference;
	    }

	    function st_varx_p(args, context) {
	        return args.length === 2 ? st_var_p([args[1]], context) : CalcErrorsReference;
	    }

	    function st_histogram(args, context) {
	        var values1 = fixValues_(args[1], context, true);
	        var values2 = fixValues_(args[2], context, true);
	        var values3 = fixValues_(args[3], context, true);
	        //default mode is discrete mode
	        //validate parameters
	        if (!_.isArray(values1)) {
	            return CalcErrorsValue;
	        }
	        var mode = _.isNumber(values2) ? values2 : 1;
	        if (mode === 0) {
	            var scale = (_.isNumber(values3) && values3 > 0) ? values3 : 1;
	            return continuousHistogram(values1, scale);
	        } else {
	            return discreteHistogram(values1);
	        }
	    }

	    function continuousHistogram(values1, scale) {
	        // handle axis
	        var i, len;
	        var values = [];
	        values1.forEach(function(value) {
	            if (_.isNumber(value)) {
	                values.push(value);
	            }
	        });
	        var axisArr;
	        var min, max;
	        min = max = values[0];
	        values.forEach(function(value) {
	            if (_.isNumber(value)) {
	                min = MATH_MIN(value, min);
	                max = MATH_MAX(value, max);
	            }
	        });
	        min = MATH_FLOOR(min / scale) * scale;
	        max = MATH_MAX(max / scale) * scale;
	        if (!_.isNumber(min) || _.isNaN(min) || !_.isNumber(max) || _.isNaN(max)) {
	            return CalcErrorsValue;
	        }
	        axisArr = [];
	        i = 0;
	        len = Math.round((max - min) / scale);
	        axisArr.length = len;
	        for (; i <= len; ++i) {
	            axisArr[i] = i * scale + min;
	        }
	        //init histogram
	        var hist = [];
	        hist.length = axisArr.length + 1;
	        for (i = 0, len = hist.length; i < len; ++i) {
	            hist[i] = 0;
	        }
	        values.forEach(function(value) {
	            var index = biSearch(axisArr, value);
	            if (index !== false) {
	                ++hist[index];
	            }
	        });
	        return hist;
	    }

	    //discrete mode ignore the axis array input
	    function discreteHistogram(values) {
	        var axisArr = {};
	        for (var i = 0, len = values.length; i < len; ++i) {
	            var value = values[i];
	            if (_.isUndefined(axisArr[value])) {
	                axisArr[value] = 1;
	            } else {
	                ++axisArr[value];
	            }
	        }
	        var keys = _.keys(axisArr);
	        keys.sort();
	        return keys.map(function (key) {
	            return axisArr[key];
	        });
	    }

	    //array:    | 0 1 2 3 4 5 6
	    //return:   |0 1 2 3 4 5 6 7
	    function biSearch(arr, n) {
	        if (!_.isNumber(n) || _.isNaN(n)) {
	            return false;
	        }
	        var start = 0;
	        var end = arr.length;
	        if (end === 0) {
	            return 0;
	        }
	        var len = end;
	        var i = MATH_FLOOR(end / 2);
	        do{
	            if (arr[i] > n) {
	                if (i === 0) {
	                    return 0;
	                }
	                end = i;
	                i = MATH_FLOOR((i + start) / 2);
	            } else if (arr[i + 1] <= n){
	                if (i === len) {
	                    return len + 1;
	                }
	                start = i;
	                i = MATH_FLOOR((i + end) / 2);
	            } else {
	                return i + 1;
	            }
	        } while(true);
	    }

	    function getVariance_(arr, isStandard) {
	        var n = 0;
	        var sum = 0;
	        var squareSum = 0;
	        var temp;
	        if (_.isArray(arr)) {
	            arr.forEach(function(item) {
	                if (!_.isUndefined(item) && !_.isNull(item)) {
	                    if (_.isNumber(temp = CalcConvert.D(item))) {
	                        ++n;
	                        sum += temp;
	                        squareSum += temp * temp;
	                    }
	                }
	            })
	        }
	        if (n > 1) {
	            //the expression sum(x^2) - sum(x)^2 / n is bound to larger or equal than zero,
	            //max is to fix the float precision error in js.
	            return isStandard ?
	            MATH_MAX(squareSum - sum * sum / n, 0) / (n - 1) :
	            MATH_MAX(squareSum - sum * sum / n, 0) / n;
	        }
	        return CalcErrorsValue;
	    }

	    //</editor-fold>

	    //TODO, check forAggregator
	    function fixValues_(arg, context, forAggregator) {
	        var values = arg;
	        var rowIndex;
	        if (_.isArray(values)) {
	            rowIndex = context.getCurrentRow(forAggregator);
	            return rowIndex >= 0 ? values[rowIndex] : values;
	        } else if (CalcHelper.columnRef(values)) {
	            return values.getValue(context.getCurrentRow(forAggregator), context.groupPath);
	        } else if (CalcHelper.fieldRef(values)) {
	            return values.getValue();
	        } else {
	            return values;
	        }
	    }

	    function carryOutArrayFunctions_(args, context, fn) {
	        var i;
	        var j;
	        var values;
	        var rowCount = context.calcSource.getRowCount();
	        if (!args || args.length === 0) {
	            return CalcErrorsReference;
	        }
	        var len = args.length;
	        if (len === 1) {
	            values = args[0];
	            return _.isArray(values) ?
	                _.map(values, function(value) {
	                    return fn(value);
	                }) :
	                fn(values);
	        }
	        values = args;
	        var result = [];
	        var lengthArray = values.map(function(value) {
	            return _.isArray(value) ? value.length : 1;
	        });
	        var maxD = lengthArray.reduce(function(p, c) {
	            return p > c ? p : c;
	        });
	        var tempArg;
	        if (maxD > 1) {
	            for (i = 0; i < rowCount; i++) {
	                tempArg = [];
	                for (j = 0; j < len; j++) {
	                    tempArg[j] = _.isArray(values[j]) ? values[j][i] : values[j];
	                }
	                result[i] = fn(tempArg);
	            }
	            return result;
	        } else {
	            return fn(values);
	        }
	    }

	    //<editor-fold desc='Math&Trig Functions definitions'>
	    _defineBuildInFunction('ABS', mt_abs, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ACOS', mt_acos, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ASIN', mt_asin, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ATAN', mt_atan, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ATAN2', mt_atan2, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('COS', mt_cos, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('CEILING', mt_ceiling, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('CURRENCY', mt_currency, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ODD', mt_odd, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('EVEN', mt_even, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('FLOOR', mt_floor, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('ISO.CEILING', mt_iso_ceiling, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('LN', mt_ln, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('SQRT', mt_sqrt, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('SIN', mt_sin, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('TAN', mt_tan, {minArgs: 1, maxArgs: 1});

	    _defineBuildInFunction('SIGN', mt_sign, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('GCD', mt_gcd, {minArgs: 1});
	    _defineBuildInFunction('LCM', mt_lcm, {minArgs: 1});
	    _defineBuildInFunction('POWER', mt_power, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('MOD', mt_mod, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('QUOTIENT', mt_quotient, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('INT', mt_int, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('MROUND', mt_mround, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('ROUND', mt_round, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('ROUNDDOWN', mt_rounddown, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('ROUNDUP', mt_roundup, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('TRUNC', mt_trunc, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('EXP', mt_exp, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('LOG', mt_log, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('LOG10', mt_log10, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('SUM', mt_sum, {minArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('SUMX', mt_sumx, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });

	    _defineBuildInFunction('PI', mt_pi, {minArgs: 0, maxArgs: 0});
	    _defineBuildInFunction('SQRTPI', mt_sqrtpi, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('DEGREES', mt_degrees, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('RADIANS', mt_radians, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('COSH', mt_cosh, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ACOSH', mt_acosh, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('SINH', mt_sinh, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ASINH', mt_asinh, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('TANH', mt_tanh, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ATANH', mt_atanh, {minArgs: 1, maxArgs: 1});

	    _defineBuildInFunction('FACT', mt_fact, {minArgs: 1, maxArgs: 1});

	    _defineBuildInFunction('RAND', mt_rand, {minArgs: 0, maxArgs: 0, isVolatile: isVolatile});
	    _defineBuildInFunction('RANDBETWEEN', mt_randbetween, {minArgs: 2, maxArgs: 2, isVolatile: isVolatile});

	    //</editor-fold>
	    //<editor-fold desc='Logical function definitions'>
	    _defineBuildInFunction('AND', lg_and, {minArgs: 1});
	    _defineBuildInFunction('OR', lg_or, {minArgs: 1});
	    _defineBuildInFunction('NOT', lg_not, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('IF', lg_if, {
	        minArgs: 2,
	        maxArgs: 3,
	        isBranch: isBranch,
	        findTestArgument: findTestArgument,
	        findBranchArgument: findBranchArgument
	    });
	    _defineBuildInFunction('IFERROR', lg_iferror, {
	        minArgs: 2, maxArgs: 2, acceptsError: Functions.acceptsZero
	    });
	    _defineBuildInFunction('TRUE', lg_true, {minArgs: 0, maxArgs: 0});
	    _defineBuildInFunction('FALSE', lg_false, {minArgs: 0, maxArgs: 0});

	    //</editor-fold>
	    //<editor-fold desc='DateTime Functions definitions'>
	    _defineBuildInFunction('DATE', dt_date, {minArgs: 3, maxArgs: 3});
	    _defineBuildInFunction('TIME', dt_time, {minArgs: 3, maxArgs: 3});
	    _defineBuildInFunction('DATEVALUE', dt_datevalue, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('TIMEVALUE', dt_timevalue, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('NOW', dt_now, {minArgs: 0, maxArgs: 0, isVolatile: isVolatile});
	    _defineBuildInFunction('TODAY', dt_today, {minArgs: 0, maxArgs: 0, isVolatile: isVolatile});
	    _defineBuildInFunction('HOUR', dt_hour, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('MINUTE', dt_minute, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('SECOND', dt_second, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('DAY', dt_day, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('MONTH', dt_month, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('YEAR', dt_year, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('WEEKNUM', dt_weeknum, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('WEEKDAY', dt_weekday, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('EDATE', dt_edate, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('EOMONTH', dt_eomonth, {minArgs: 2, maxArgs: 2});

	    _defineBuildInFunction('YEARFRAC', dt_yearfrac, {minArgs: 2, maxArgs: 3});

	    //def('DATEDIF', dt_datedif, { minArgs: 3, maxArgs: 3 });
	    //</editor-fold>
	    //<editor-fold desc='Text Functions definitions'>
	    _defineBuildInFunction('BLANK', tx_blank, {minArgs: 0, maxArgs: 0});
	    //def('CLEAN', tx_clean, { minArgs: 1, maxArgs: 1 });
	    _defineBuildInFunction('TRIM', tx_trim, {minArgs: 1, maxArgs: 1});

	    //def('DOLLAR', tx_dollar, { minArgs: 1, maxArgs: 2 });
	    _defineBuildInFunction('FIXED', tx_fixed, {minArgs: 1, maxArgs: 3});
	    _defineBuildInFunction('VALUE', tx_value, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('LOWER', tx_lower, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('UPPER', tx_upper, {minArgs: 1, maxArgs: 1});

	    //def('CHAR', tx_char, { minArgs: 1, maxArgs: 1 });
	    //def('CODE', tx_code, { minArgs: 1, maxArgs: 1 });
	    _defineBuildInFunction('REPLACE', tx_replace, {minArgs: 4, maxArgs: 4});
	    _defineBuildInFunction('SUBSTITUTE', tx_substitute, {minArgs: 3, maxArgs: 4});
	    _defineBuildInFunction('CONCATENATE', tx_concatenate, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('LEFT', tx_left, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('MID', tx_mid, {minArgs: 3, maxArgs: 3});
	    _defineBuildInFunction('RIGHT', tx_right, {minArgs: 1, maxArgs: 2});
	    _defineBuildInFunction('REPT', tx_rept, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('LEN', tx_len, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('FIND', tx_find, {minArgs: 2, maxArgs: 3});
	    _defineBuildInFunction('SEARCH', tx_search, {minArgs: 2, maxArgs: 3});
	    _defineBuildInFunction('EXACT', tx_exact, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('T', tx_t, {minArgs: 1, maxArgs: 1});

	    //</editor-fold>
	    //<editor-fold desc='Information function definitions'>
	    _defineBuildInFunction('FIRST', in_first, {minArgs: 1, maxArgs: 2, tableArgIndex: Functions.firstTableArgIndex});
	    _defineBuildInFunction('LAST', in_last, {minArgs: 1, maxArgs: 2, tableArgIndex: Functions.firstTableArgIndex});
	    _defineBuildInFunction('CONTAINS', in_contains, {minArgs: 2});
	    _defineBuildInFunction('ISERROR', in_isError, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});
	    _defineBuildInFunction('ISNUMBER', in_isNumber, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});
	    _defineBuildInFunction('ISEVEN', in_isEven, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ISODD', in_isOdd, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('N', in_number, {minArgs: 1, maxArgs: 1});
	    _defineBuildInFunction('ISBLANK', in_isBlank, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});
	    _defineBuildInFunction('ISLOGICAL', in_isLogical, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});
	    _defineBuildInFunction('ISTEXT', in_isText, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});
	    _defineBuildInFunction('ISNONTEXT', in_isNonText, {minArgs: 1, maxArgs: 1, acceptsError: Functions.acceptsZero});

	    //</editor-fold>
	    //<editor-fold desc='Statistical function definitions for fill'>
	    _defineBuildInFunction('AVERAGE', st_average, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('AVERAGEA', st_averagea, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('AVERAGEX', st_averagex, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('MAX', st_max, {minArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('MAXA', st_maxa, {minArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('MAXX', st_maxx, {
	        minArgs: 1,
	        maxArgs: 2,
	        isAggregator: Functions.isAggregator,
	        tableArgIndex: Functions.firstTableArgIndex
	    });
	    _defineBuildInFunction('MIN', st_min, {minArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('MINA', st_mina, {minArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('MINX', st_minx, {
	        minArgs: 1,
	        maxArgs: 2,
	        isAggregator: Functions.isAggregator,
	        tableArgIndex: Functions.firstTableArgIndex
	    });
	    _defineBuildInFunction('LARGE', st_large, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('SMALL', st_small, {minArgs: 2, maxArgs: 2});
	    _defineBuildInFunction('RANK.EQ', st_rank, {minArgs: 2, maxArgs: 3});
	    _defineBuildInFunction('COUNT', st_count, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('COUNTX', st_countx, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('COUNTA', st_counta, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('COUNTAX', st_countax, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('COUNTROWS', st_countrows, {
	        minArgs: 0,
	        maxArgs: 1,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('COUNTBLANK', st_countblank, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('DISTINCTCOUNT', st_distinctcount, {
	        minArgs: 1,
	        maxArgs: 1,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('STDEV.S', st_stdev_s, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('STDEV.P', st_stdev_p, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('STDEVX.S', st_stdevx_s, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('STDEVX.P', st_stdevx_p, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('VAR.S', st_var_s, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('VAR.P', st_var_p, {minArgs: 1, maxArgs: 1, isAggregator: Functions.isAggregator});
	    _defineBuildInFunction('VARX.S', st_varx_s, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('VARX.P', st_varx_p, {
	        minArgs: 1,
	        maxArgs: 2,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isAggregator: Functions.isAggregator
	    });
	    _defineBuildInFunction('HISTOGRAM', st_histogram, {
	        minArgs: 1,
	        maxArgs: 3,
	        tableArgIndex: Functions.firstTableArgIndex
	    });
	    //</editor-fold>
	    //<editor-fold desc='filter function definitions'>
	    _defineBuildInFunction('TOPN', ft_topN, {
	        minArgs: 2,
	        isFilter: Functions.isFilter,
	        tableArgIndex: Functions.secondTableArgIndex,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('ALL', ft_all, {
	        minArgs: 0,
	        isFilter: Functions.isFilter,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('CALCULATE', ft_calculate, {
	        minArgs: 1,
	        isCalculate: Functions.isCalculate
	    });
	    _defineBuildInFunction('DISTINCT', ft_distinct, {
	        minArgs: 1,
	        maxArgs: 1,
	        isFilter: Functions.isFilter,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('FILTER', ft_filter, {
	        minArgs: 1,
	        maxArgs: 2,
	        isFilter: Functions.isFilter,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('PARENTGROUP', ft_parentGroup, {
	        minArgs: 0,
	        isFilter: Functions.isFilter,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('CURRENTGROUP', ft_currentGroup, {
	        minArgs: 0,
	        isFilter: Functions.isFilter,
	        isTableResult: Functions.tableResult
	    });
	    _defineBuildInFunction('SUMMARIZE', ft_summarize, {
	        minArgs: 1,
	        isSummarize: Functions.isSummarize,
	        isFilter: Functions.isFilter,
	        tableArgIndex: Functions.firstTableArgIndex,
	        isTableResult: Functions.tableResult
	    });
	    //</editor-fold>
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
