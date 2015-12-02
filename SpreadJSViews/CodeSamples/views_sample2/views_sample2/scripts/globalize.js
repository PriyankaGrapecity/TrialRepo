(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Globalize"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["Globalize"] = factory();
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

	    var cultures = __webpack_require__(1);
	    var stringRes = __webpack_require__(2);

	    module.exports = {
	        Cultures: cultures,
	        StringResoures: stringRes
	    };
	}());


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
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
	    var sr = __webpack_require__(2);
	    var spread = {};
	    module.exports = spread;

	    var keyword_null = null;
	    var keyword_undefined = undefined;
	    var Math_max = Math.max;
	    var Math_min = Math.min;
	    var Math_ceil = Math.ceil;
	    var Math_floor = Math.floor;
	    var Math_abs = Math.abs;
	    var Math_pow = Math.pow;
	    var Math_round = Math.round;

	    var const_boolean = 'boolean';
	    var const_date = 'date';
	    var const_undefined = 'undefined';
	    var keyword_undefined = undefined;
	    var keyword_null = null;

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

	    var CultureInfo = (function() {
	        /**
	         * The custom culture class. The member variable can be overwrite.
	         * @class
	         */
	        function CultureInfo() {
	            var self = this;
	            self.currencyDecimalDigits = 2;
	            self.currencyDecimalSeparator = '.';
	            self.currencyPositivePattern = 0;
	            self.currencyGroupSeparator = ',';
	            /**
	             * Indicates the currency symbol.
	             * @type {string}
	             */
	            self.currencySymbol = '\u00A4';
	            self.currencyGroupSizes = [3];
	            self.currencyNegativePattern = 0;
	            self.digitSubstitution = 1;
	            self.isReadOnly = true;
	            self.numberGroupSizes = [3];
	            self.nanSymbol = 'NaN';
	            self.nativeDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	            self.numberNegativePattern = 1;
	            self.negativeInfinitySymbol = '-Infinity';
	            self.negativeSign = '-';
	            self.numberDecimalDigits = 2;
	            /**
	             * Indicates the decimal point.
	             * @type {string}
	             */
	            self.numberDecimalSeparator = '.';
	            /**
	             * Indicates the thousand separator.
	             * @type {string}
	             */
	            self.numberGroupSeparator = ',';
	            /**
	             * Indicates the separator for an array constant in a formula.
	             * @type {string}
	             */
	            self.arrayGroupSeparator = ';';
	            /**
	             * Indicates the separator for function arguments in a formula.
	             * @type {string}
	             */
	            self.listSeparator = ',';
	            self.positiveInfinitySymbol = 'Infinity';
	            self.positiveSign = '+';
	            self.percentDecimalDigits = 2;
	            self.percentDecimalSeparator = '.';
	            self.percentGroupSeparator = ',';
	            self.percentSymbol = '%';
	            self.perMilleSymbol = '\u2030';
	            self.percentPositivePattern = 0;
	            self.percentNegativePattern = 0;
	            self.percentGroupSizes = [3];
	            /**
	             * Indicates the AM designator.
	             * @type {string}
	             */
	            self.amDesignator = 'AM';
	            /**
	             * For the formatter 'MMM'.
	             * @type {Array}
	             */
	            self.abbreviatedMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''];
	            /**
	             * For the formatter 'ddd'.
	             * @type {Array}
	             */
	            self.abbreviatedDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	            /**
	             * For the formatter 'MMM'.
	             * @type {Array}
	             */
	            self.abbreviatedMonthGenitiveNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''];
	            self.calendarWeekRule = 0;
	            self.dateSeparator = '/';
	            /**
	             * For the formatter 'dddd'.
	             * @type {Array}
	             */
	            self.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	            self.firstDayOfWeek = 0;
	            /**
	             * For the standard date formatter 'F'.
	             * @type {string}
	             */
	            self.fullDateTimePattern = 'dddd, dd MMMM yyyy HH:mm:ss';
	            /**
	             * For the standard date formatter 'D'.
	             * @type {string}
	             */
	            self.longDatePattern = 'dddd, dd MMMM yyyy';
	            /**
	             * For the standard date formatter 'T' and 'U'.
	             * @type {string}
	             */
	            self.longTimePattern = 'HH:mm:ss';
	            /**
	             * For the standard date formatter 'M' and 'm'.
	             * @type {string}
	             */
	            self.monthDayPattern = 'MMMM dd';
	            /**
	             * For the formatter 'M' or 'MM'.
	             * @type {Array}
	             */
	            self.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''];
	            /**
	             * For the formatter 'MMMM'.
	             * @type {Array}
	             */
	            self.monthGenitiveNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''];
	            self.nativeCalendarName = 'Gregorian Calendar';
	            /**
	             * Indicates the PM designator.
	             * @type {string}
	             */
	            self.pmDesignator = 'PM';
	            /**
	             * For the standard date formatter 'R' and 'r'.
	             * @type {string}
	             */
	            self.rfc1123Pattern = 'ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'';
	            /**
	             * For the standard date formatter 'd'.
	             * @type {string}
	             */
	            self.shortDatePattern = 'MM/dd/yyyy';
	            /**
	             * For the standard date formatter 't'.
	             * @type {string}
	             */
	            self.shortTimePattern = 'HH:mm';
	            /**
	             * For the standard date formatter 's'.
	             * @type {string}
	             */
	            self.sortableDateTimePattern = 'yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss';
	            self.shortestDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	            self.timeSeparator = ':';
	            /**
	             * For the standard date formatter 'u'.
	             * @type {string}
	             */
	            self.universalSortableDateTimePattern = 'yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'';
	            /**
	             * For the standard date formatter 'y' and 'Y'.
	             * @type {string}
	             */
	            self.yearMonthPattern = 'yyyy MMMM';
	            self.calendarIsReadOnly = true;
	        }

	        return CultureInfo;
	    })();
	    spread.CultureInfo = CultureInfo;

	    var _ENCultureInfo = (function(_super) {
	        __extends(_ENCultureInfo, _super);
	        function _ENCultureInfo() {
	            _super.apply(this, arguments);
	            this.currencySymbol = '$';
	            this.isReadOnly = false;
	            this.fullDateTimePattern = 'dddd, MMMM dd, yyyy h:mm:ss tt';
	            this.longDatePattern = 'dddd, MMMM dd, yyyy';
	            this.longTimePattern = 'h:mm:ss tt';
	            this.shortDatePattern = 'M/d/yyyy';
	            this.shortTimePattern = 'h:mm tt';
	            this.yearMonthPattern = 'MMMM, yyyy';
	            this.calendarIsReadOnly = false;
	        }

	        return _ENCultureInfo;
	    })(CultureInfo);
	    spread._ENCultureInfo = _ENCultureInfo;

	    var _JPCultureInfo = (function(_super) {
	        __extends(_JPCultureInfo, _super);
	        function _JPCultureInfo() {
	            var self = this;
	            _super.apply(self, arguments);
	            self.currencyDecimalDigits = 0;
	            self.currencySymbol = '￥';
	            self.isReadOnly = false;
	            self.percentPositivePattern = 1;
	            self.percentNegativePattern = 1;
	            self.amDesignator = '午前';
	            self.abbreviatedMonthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''];
	            self.abbreviatedDayNames = ['日', '月', '火', '水', '木', '金', '土'];
	            self.abbreviatedMonthGenitiveNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ''];
	            self.dayNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
	            self.fullDateTimePattern = 'yyyy"年"M"月"d"日" H:mm:ss';
	            self.longDatePattern = 'yyyy"年"M"月"d"日"';
	            self.longTimePattern = 'H:mm:ss';
	            self.monthDayPattern = 'M"月"d"日"';
	            self.monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''];
	            self.monthGenitiveNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ''];
	            self.nativeCalendarName = '西暦 (日本語)';
	            self.pmDesignator = '午後';
	            self.shortDatePattern = 'yyyy/MM/dd';
	            self.shortTimePattern = 'H:mm';
	            self.shortestDayNames = ['日', '月', '火', '水', '木', '金', '土'];
	            self.yearMonthPattern = 'yyyy"年"M"月"';
	            self.calendarIsReadOnly = false;
	        }

	        return _JPCultureInfo;
	    })(CultureInfo);
	    spread._JPCultureInfo = _JPCultureInfo;

	    spread.cultureInfoDict = {
	        '': new CultureInfo(),
	        'en-us': new _ENCultureInfo(),
	        'ja-jp': new _JPCultureInfo()
	    };
	    spread.CR = spread.cultureInfoDict['en-us'];

	    spread.dateTimeFormats = [
	        'yy/MM/dd',
	        'yy/MM/d',
	        'yy/M/dd',
	        'yy/M/d',
	        'yyyy/MM/dd',
	        'yyyy/MM/d',
	        'yyyy/M/dd',
	        'yyyy/M/d',
	        'MM/dd/yyyy',
	        'MM/d/yyyy',
	        'M/dd/yyyy',
	        'M/d/yyyy',
	        'hh:mm:ss',
	        'hh:mm:s',
	        'hh:m:ss',
	        'hh:m:s',
	        'h:mm:ss',
	        'h:mm:s',
	        'h:m:ss',
	        'h:m:s',
	        'hh:mm:ss tt',
	        'hh:mm:s tt',
	        'hh:m:ss tt',
	        'hh:m:s tt',
	        'h:mm:ss tt',
	        'h:mm:s tt',
	        'h:m:ss tt',
	        'h:m:s tt',
	        'hh:mm',
	        'hh:m',
	        'h:mm',
	        'h:m',
	        'yy/MM/dd hh:mm:ss',
	        'yy/MM/dd hh:mm:s',
	        'yy/MM/dd hh:m:ss',
	        'yy/MM/dd hh:m:s',
	        'yy/MM/dd h:mm:ss',
	        'yy/MM/dd h:mm:s',
	        'yy/MM/dd h:m:ss',
	        'yy/MM/dd h:m:s',
	        'yy/MM/dd hh:mm:ss tt',
	        'yy/MM/dd hh:mm:s tt',
	        'yy/MM/dd hh:m:ss tt',
	        'yy/MM/dd hh:m:s tt',
	        'yy/MM/dd h:mm:ss tt',
	        'yy/MM/dd h:mm:s tt',
	        'yy/MM/dd h:m:ss tt',
	        'yy/MM/dd h:m:s tt',
	        'yy/MM/d hh:mm:ss',
	        'yy/MM/d hh:mm:s',
	        'yy/MM/d hh:m:ss',
	        'yy/MM/d hh:m:s',
	        'yy/MM/d hh:mm:ss',
	        'yy/MM/d h:mm:s',
	        'yy/MM/d h:m:ss',
	        'yy/MM/d h:m:s',
	        'yy/MM/d hh:mm:ss tt',
	        'yy/MM/d hh:mm:s tt',
	        'yy/MM/d hh:m:ss tt',
	        'yy/MM/d hh:m:s tt',
	        'yy/MM/d h:mm:ss tt',
	        'yy/MM/d h:mm:s tt',
	        'yy/MM/d h:m:ss tt',
	        'yy/MM/d h:m:s tt',
	        'yy/M/dd hh:mm:ss',
	        'yy/M/dd hh:mm:s',
	        'yy/M/dd hh:m:ss',
	        'yy/M/dd hh:m:s',
	        'yy/M/dd hh:mm:ss',
	        'yy/M/dd h:mm:s',
	        'yy/M/dd h:m:ss',
	        'yy/M/dd h:m:s',
	        'yy/M/dd hh:mm:ss tt',
	        'yy/M/dd hh:mm:s tt',
	        'yy/M/dd hh:m:ss tt',
	        'yy/M/dd hh:m:s tt',
	        'yy/M/dd h:mm:ss tt',
	        'yy/M/dd h:mm:s tt',
	        'yy/M/dd h:m:ss tt',
	        'yy/M/dd h:m:s tt',
	        'yy/M/d hh:mm:ss',
	        'yy/M/d hh:mm:s',
	        'yy/M/d hh:m:ss',
	        'yy/M/d hh:m:s',
	        'yy/M/d hh:mm:ss',
	        'yy/M/d h:mm:s',
	        'yy/M/d h:m:ss',
	        'yy/M/d h:m:s',
	        'yy/M/d hh:mm:ss tt',
	        'yy/M/d hh:mm:s tt',
	        'yy/M/d hh:m:ss tt',
	        'yy/M/d hh:m:s tt',
	        'yy/M/d h:mm:ss tt',
	        'yy/M/d h:mm:s tt',
	        'yy/M/d h:m:ss tt',
	        'yy/M/d h:m:s tt',
	        'yyyy/MM/dd hh:mm:ss',
	        'yyyy/MM/dd hh:mm:s',
	        'yyyy/MM/dd hh:m:ss',
	        'yyyy/MM/dd hh:m:s',
	        'yyyy/MM/dd hh:mm:ss',
	        'yyyy/MM/dd h:mm:s',
	        'yyyy/MM/dd h:m:ss',
	        'yyyy/MM/dd h:m:s',
	        'yyyy/MM/dd hh:mm:ss tt',
	        'yyyy/MM/dd hh:mm:s tt',
	        'yyyy/MM/dd hh:m:ss tt',
	        'yyyy/MM/dd hh:m:s tt',
	        'yyyy/MM/dd h:mm:ss tt',
	        'yyyy/MM/dd h:mm:s tt',
	        'yyyy/MM/dd h:m:ss tt',
	        'yyyy/MM/dd h:m:s tt',
	        'yyyy/MM/d hh:mm:ss',
	        'yyyy/MM/d hh:mm:s',
	        'yyyy/MM/d hh:m:ss',
	        'yyyy/MM/d hh:m:s',
	        'yyyy/MM/d hh:mm:ss',
	        'yyyy/MM/d h:mm:s',
	        'yyyy/MM/d h:m:ss',
	        'yyyy/MM/d h:m:s',
	        'yyyy/MM/d hh:mm:ss tt',
	        'yyyy/MM/d hh:mm:s tt',
	        'yyyy/MM/d hh:m:ss tt',
	        'yyyy/MM/d hh:m:s tt',
	        'yyyy/MM/d h:mm:ss tt',
	        'yyyy/MM/d h:mm:s tt',
	        'yyyy/MM/d h:m:ss tt',
	        'yyyy/MM/d h:m:s tt',
	        'yyyy/M/dd hh:mm:ss',
	        'yyyy/M/dd hh:mm:s',
	        'yyyy/M/dd hh:m:ss',
	        'yyyy/M/dd hh:m:s',
	        'yyyy/M/dd hh:mm:ss',
	        'yyyy/M/dd h:mm:s',
	        'yyyy/M/dd h:m:ss',
	        'yyyy/M/dd h:m:s',
	        'yyyy/M/dd hh:mm:ss tt',
	        'yyyy/M/dd hh:mm:s tt',
	        'yyyy/M/dd hh:m:ss tt',
	        'yyyy/M/dd hh:m:s tt',
	        'yyyy/M/dd h:mm:ss tt',
	        'yyyy/M/dd h:mm:s tt',
	        'yyyy/M/dd h:m:ss tt',
	        'yyyy/M/dd h:m:s tt',
	        'yyyy/M/d hh:mm:ss',
	        'yyyy/M/d hh:mm:s',
	        'yyyy/M/d hh:m:ss',
	        'yyyy/M/d hh:m:s',
	        'yyyy/M/d hh:mm:ss',
	        'yyyy/M/d h:mm:s',
	        'yyyy/M/d h:m:ss',
	        'yyyy/M/d h:m:s',
	        'yyyy/M/d hh:mm:ss tt',
	        'yyyy/M/d hh:mm:s tt',
	        'yyyy/M/d hh:m:ss tt',
	        'yyyy/M/d hh:m:s tt',
	        'yyyy/M/d h:mm:ss tt',
	        'yyyy/M/d h:mm:s tt',
	        'yyyy/M/d h:m:ss tt',
	        'yyyy/M/d h:m:s tt',
	        'MM/dd/yyyy hh:mm:ss',
	        'MM/dd/yyyy hh:mm:s',
	        'MM/dd/yyyy hh:m:ss',
	        'MM/dd/yyyy hh:m:s',
	        'MM/dd/yyyy hh:mm:ss',
	        'MM/dd/yyyy h:mm:s',
	        'MM/dd/yyyy h:m:ss',
	        'MM/dd/yyyy h:m:s',
	        'MM/dd/yyyy hh:mm:ss tt',
	        'MM/dd/yyyy hh:mm:s tt',
	        'MM/dd/yyyy hh:m:ss tt',
	        'MM/dd/yyyy hh:m:s tt',
	        'MM/dd/yyyy h:mm:ss tt',
	        'MM/dd/yyyy h:mm:s tt',
	        'MM/dd/yyyy h:m:ss tt',
	        'MM/dd/yyyy h:m:s tt',
	        'MM/d/yyyy hh:mm:ss',
	        'MM/d/yyyy hh:mm:s',
	        'MM/d/yyyy hh:m:ss',
	        'MM/d/yyyy hh:m:s',
	        'MM/d/yyyy hh:mm:ss',
	        'MM/d/yyyy h:mm:s',
	        'MM/d/yyyy h:m:ss',
	        'MM/d/yyyy h:m:s',
	        'MM/d/yyyy hh:mm:ss tt',
	        'MM/d/yyyy hh:mm:s tt',
	        'MM/d/yyyy hh:m:ss tt',
	        'MM/d/yyyy hh:m:s tt',
	        'MM/d/yyyy h:mm:ss tt',
	        'MM/d/yyyy h:mm:s tt',
	        'MM/d/yyyy h:m:ss tt',
	        'MM/d/yyyy h:m:s tt',
	        'M/dd/yyyy hh:mm:ss',
	        'M/dd/yyyy hh:mm:s',
	        'M/dd/yyyy hh:m:ss',
	        'M/dd/yyyy hh:m:s',
	        'M/dd/yyyy hh:mm:ss',
	        'M/dd/yyyy h:mm:s',
	        'M/dd/yyyy h:m:ss',
	        'M/dd/yyyy h:m:s',
	        'M/dd/yyyy hh:mm:ss tt',
	        'M/dd/yyyy hh:mm:s tt',
	        'M/dd/yyyy hh:m:ss tt',
	        'M/dd/yyyy hh:m:s tt',
	        'M/dd/yyyy h:mm:ss tt',
	        'M/dd/yyyy h:mm:s tt',
	        'M/dd/yyyy h:m:ss tt',
	        'M/dd/yyyy h:m:s tt',
	        'M/d/yyyy hh:mm:ss',
	        'M/d/yyyy hh:mm:s',
	        'M/d/yyyy hh:m:ss',
	        'M/d/yyyy hh:m:s',
	        'M/d/yyyy hh:mm:ss',
	        'M/d/yyyy h:mm:s',
	        'M/d/yyyy h:m:ss',
	        'M/d/yyyy h:m:s',
	        'M/d/yyyy hh:mm:ss tt',
	        'M/d/yyyy hh:mm:s tt',
	        'M/d/yyyy hh:m:ss tt',
	        'M/d/yyyy hh:m:s tt',
	        'M/d/yyyy h:mm:ss tt',
	        'M/d/yyyy h:mm:s tt',
	        'M/d/yyyy h:m:ss tt',
	        'M/d/yyyy h:m:s tt',
	        'yy-MM-dd',
	        'yy-MM-d',
	        'yy-M-dd',
	        'yy-M-d',
	        'yyyy-MM-dd',
	        'yyyy-MM-d',
	        'yyyy-M-dd',
	        'yyyy-M-d',
	        'MM-dd-yyyy',
	        'MM-d-yyyy',
	        'M-dd-yyyy',
	        'M-d-yyyy',
	        'yy-MM-dd hh:mm:ss',
	        'yy-MM-dd hh:mm:s',
	        'yy-MM-dd hh:m:ss',
	        'yy-MM-dd hh:m:s',
	        'yy-MM-dd h:mm:ss',
	        'yy-MM-dd h:mm:s',
	        'yy-MM-dd h:m:ss',
	        'yy-MM-dd h:m:s',
	        'yy-MM-dd hh:mm:ss tt',
	        'yy-MM-dd hh:mm:s tt',
	        'yy-MM-dd hh:m:ss tt',
	        'yy-MM-dd hh:m:s tt',
	        'yy-MM-dd h:mm:ss tt',
	        'yy-MM-dd h:mm:s tt',
	        'yy-MM-dd h:m:ss tt',
	        'yy-MM-dd h:m:s tt',
	        'yy-MM-d hh:mm:ss',
	        'yy-MM-d hh:mm:s',
	        'yy-MM-d hh:m:ss',
	        'yy-MM-d hh:m:s',
	        'yy-MM-d hh:mm:ss',
	        'yy-MM-d h:mm:s',
	        'yy-MM-d h:m:ss',
	        'yy-MM-d h:m:s',
	        'yy-MM-d hh:mm:ss tt',
	        'yy-MM-d hh:mm:s tt',
	        'yy-MM-d hh:m:ss tt',
	        'yy-MM-d hh:m:s tt',
	        'yy-MM-d h:mm:ss tt',
	        'yy-MM-d h:mm:s tt',
	        'yy-MM-d h:m:ss tt',
	        'yy-MM-d h:m:s tt',
	        'yy-M-dd hh:mm:ss',
	        'yy-M-dd hh:mm:s',
	        'yy-M-dd hh:m:ss',
	        'yy-M-dd hh:m:s',
	        'yy-M-dd hh:mm:ss',
	        'yy-M-dd h:mm:s',
	        'yy-M-dd h:m:ss',
	        'yy-M-dd h:m:s',
	        'yy-M-dd hh:mm:ss tt',
	        'yy-M-dd hh:mm:s tt',
	        'yy-M-dd hh:m:ss tt',
	        'yy-M-dd hh:m:s tt',
	        'yy-M-dd h:mm:ss tt',
	        'yy-M-dd h:mm:s tt',
	        'yy-M-dd h:m:ss tt',
	        'yy-M-dd h:m:s tt',
	        'yy-M-d hh:mm:ss',
	        'yy-M-d hh:mm:s',
	        'yy-M-d hh:m:ss',
	        'yy-M-d hh:m:s',
	        'yy-M-d hh:mm:ss',
	        'yy-M-d h:mm:s',
	        'yy-M-d h:m:ss',
	        'yy-M-d h:m:s',
	        'yy-M-d hh:mm:ss tt',
	        'yy-M-d hh:mm:s tt',
	        'yy-M-d hh:m:ss tt',
	        'yy-M-d hh:m:s tt',
	        'yy-M-d h:mm:ss tt',
	        'yy-M-d h:mm:s tt',
	        'yy-M-d h:m:ss tt',
	        'yy-M-d h:m:s tt',
	        'yyyy-MM-dd hh:mm:ss',
	        'yyyy-MM-dd hh:mm:s',
	        'yyyy-MM-dd hh:m:ss',
	        'yyyy-MM-dd hh:m:s',
	        'yyyy-MM-dd hh:mm:ss',
	        'yyyy-MM-dd h:mm:s',
	        'yyyy-MM-dd h:m:ss',
	        'yyyy-MM-dd h:m:s',
	        'yyyy-MM-dd hh:mm:ss tt',
	        'yyyy-MM-dd hh:mm:s tt',
	        'yyyy-MM-dd hh:m:ss tt',
	        'yyyy-MM-dd hh:m:s tt',
	        'yyyy-MM-dd h:mm:ss tt',
	        'yyyy-MM-dd h:mm:s tt',
	        'yyyy-MM-dd h:m:ss tt',
	        'yyyy-MM-dd h:m:s tt',
	        'yyyy-MM-d hh:mm:ss',
	        'yyyy-MM-d hh:mm:s',
	        'yyyy-MM-d hh:m:ss',
	        'yyyy-MM-d hh:m:s',
	        'yyyy-MM-d hh:mm:ss',
	        'yyyy-MM-d h:mm:s',
	        'yyyy-MM-d h:m:ss',
	        'yyyy-MM-d h:m:s',
	        'yyyy-MM-d hh:mm:ss tt',
	        'yyyy-MM-d hh:mm:s tt',
	        'yyyy-MM-d hh:m:ss tt',
	        'yyyy-MM-d hh:m:s tt',
	        'yyyy-MM-d h:mm:ss tt',
	        'yyyy-MM-d h:mm:s tt',
	        'yyyy-MM-d h:m:ss tt',
	        'yyyy-MM-d h:m:s tt',
	        'yyyy-M-dd hh:mm:ss',
	        'yyyy-M-dd hh:mm:s',
	        'yyyy-M-dd hh:m:ss',
	        'yyyy-M-dd hh:m:s',
	        'yyyy-M-dd hh:mm:ss',
	        'yyyy-M-dd h:mm:s',
	        'yyyy-M-dd h:m:ss',
	        'yyyy-M-dd h:m:s',
	        'yyyy-M-dd hh:mm:ss tt',
	        'yyyy-M-dd hh:mm:s tt',
	        'yyyy-M-dd hh:m:ss tt',
	        'yyyy-M-dd hh:m:s tt',
	        'yyyy-M-dd h:mm:ss tt',
	        'yyyy-M-dd h:mm:s tt',
	        'yyyy-M-dd h:m:ss tt',
	        'yyyy-M-dd h:m:s tt',
	        'yyyy-M-d hh:mm:ss',
	        'yyyy-M-d hh:mm:s',
	        'yyyy-M-d hh:m:ss',
	        'yyyy-M-d hh:m:s',
	        'yyyy-M-d hh:mm:ss',
	        'yyyy-M-d h:mm:s',
	        'yyyy-M-d h:m:ss',
	        'yyyy-M-d h:m:s',
	        'yyyy-M-d hh:mm:ss tt',
	        'yyyy-M-d hh:mm:s tt',
	        'yyyy-M-d hh:m:ss tt',
	        'yyyy-M-d hh:m:s tt',
	        'yyyy-M-d h:mm:ss tt',
	        'yyyy-M-d h:mm:s tt',
	        'yyyy-M-d h:m:ss tt',
	        'yyyy-M-d h:m:s tt',
	        'MM-dd-yyyy hh:mm:ss',
	        'MM-dd-yyyy hh:mm:s',
	        'MM-dd-yyyy hh:m:ss',
	        'MM-dd-yyyy hh:m:s',
	        'MM-dd-yyyy hh:mm:ss',
	        'MM-dd-yyyy h:mm:s',
	        'MM-dd-yyyy h:m:ss',
	        'MM-dd-yyyy h:m:s',
	        'MM-dd-yyyy hh:mm:ss tt',
	        'MM-dd-yyyy hh:mm:s tt',
	        'MM-dd-yyyy hh:m:ss tt',
	        'MM-dd-yyyy hh:m:s tt',
	        'MM-dd-yyyy h:mm:ss tt',
	        'MM-dd-yyyy h:mm:s tt',
	        'MM-dd-yyyy h:m:ss tt',
	        'MM-dd-yyyy h:m:s tt',
	        'MM-d-yyyy hh:mm:ss',
	        'MM-d-yyyy hh:mm:s',
	        'MM-d-yyyy hh:m:ss',
	        'MM-d-yyyy hh:m:s',
	        'MM-d-yyyy hh:mm:ss',
	        'MM-d-yyyy h:mm:s',
	        'MM-d-yyyy h:m:ss',
	        'MM-d-yyyy h:m:s',
	        'MM-d-yyyy hh:mm:ss tt',
	        'MM-d-yyyy hh:mm:s tt',
	        'MM-d-yyyy hh:m:ss tt',
	        'MM-d-yyyy hh:m:s tt',
	        'MM-d-yyyy h:mm:ss tt',
	        'MM-d-yyyy h:mm:s tt',
	        'MM-d-yyyy h:m:ss tt',
	        'MM-d-yyyy h:m:s tt',
	        'M-dd-yyyy hh:mm:ss',
	        'M-dd-yyyy hh:mm:s',
	        'M-dd-yyyy hh:m:ss',
	        'M-dd-yyyy hh:m:s',
	        'M-dd-yyyy hh:mm:ss',
	        'M-dd-yyyy h:mm:s',
	        'M-dd-yyyy h:m:ss',
	        'M-dd-yyyy h:m:s',
	        'M-dd-yyyy hh:mm:ss tt',
	        'M-dd-yyyy hh:mm:s tt',
	        'M-dd-yyyy hh:m:ss tt',
	        'M-dd-yyyy hh:m:s tt',
	        'M-dd-yyyy h:mm:ss tt',
	        'M-dd-yyyy h:mm:s tt',
	        'M-dd-yyyy h:m:ss tt',
	        'M-dd-yyyy h:m:s tt',
	        'M-d-yyyy hh:mm:ss',
	        'M-d-yyyy hh:mm:s',
	        'M-d-yyyy hh:m:ss',
	        'M-d-yyyy hh:m:s',
	        'M-d-yyyy hh:mm:ss',
	        'M-d-yyyy h:mm:s',
	        'M-d-yyyy h:m:ss',
	        'M-d-yyyy h:m:s',
	        'M-d-yyyy hh:mm:ss tt',
	        'M-d-yyyy hh:mm:s tt',
	        'M-d-yyyy hh:m:ss tt',
	        'M-d-yyyy hh:m:s tt',
	        'M-d-yyyy h:mm:ss tt',
	        'M-d-yyyy h:mm:s tt',
	        'M-d-yyyy h:m:ss tt',
	        'M-d-yyyy h:m:s tt'
	    ];

	    var _NumberFormatInfo = (function() {
	        function _NumberFormatInfo() {
	            var self = this;
	            var cultureInfo = spread._currentCultureResouce;
	            self.currencyDecimalDigits = cultureInfo.currencyDecimalDigits;
	            self.currencyDecimalSeparator = cultureInfo.currencyDecimalSeparator;
	            self.currencyPositivePattern = cultureInfo.currencyPositivePattern;
	            self.currencyGroupSeparator = cultureInfo.currencyGroupSeparator;
	            self.currencySymbol = cultureInfo.currencySymbol;
	            self.currencyGroupSizes = cultureInfo.currencyGroupSizes;
	            self.currencyNegativePattern = cultureInfo.currencyNegativePattern;
	            self.digitSubstitution = cultureInfo.digitSubstitution;
	            self.isReadOnly = cultureInfo.isReadOnly;
	            self.numberGroupSizes = cultureInfo.numberGroupSizes;
	            self.nanSymbol = cultureInfo.nanSymbol;
	            self.nativeDigits = cultureInfo.nativeDigits;
	            self.numberNegativePattern = cultureInfo.numberNegativePattern;
	            self.negativeInfinitySymbol = cultureInfo.negativeInfinitySymbol;
	            self.negativeSign = cultureInfo.negativeSign;
	            self.numberDecimalDigits = cultureInfo.numberDecimalDigits;
	            self.numberDecimalSeparator = cultureInfo.numberDecimalSeparator;
	            self.numberGroupSeparator = cultureInfo.numberGroupSeparator;
	            self.positiveInfinitySymbol = cultureInfo.positiveInfinitySymbol;
	            self.positiveSign = cultureInfo.positiveSign;
	            self.percentDecimalDigits = cultureInfo.percentDecimalDigits;
	            self.percentDecimalSeparator = cultureInfo.percentDecimalSeparator;
	            self.percentGroupSeparator = cultureInfo.percentGroupSeparator;
	            self.percentSymbol = cultureInfo.percentSymbol;
	            self.perMilleSymbol = cultureInfo.perMilleSymbol;
	            self.percentPositivePattern = cultureInfo.percentPositivePattern;
	            self.percentNegativePattern = cultureInfo.percentNegativePattern;
	            self.percentGroupSizes = cultureInfo.percentGroupSizes;
	        }

	        return _NumberFormatInfo;
	    })();
	    spread._NumberFormatInfo = _NumberFormatInfo;

	    var _Calendar = (function() {
	        function _Calendar() {
	            var self = this;
	            self.MinSupportedDateTime = '@-62135568000000@';
	            self.MaxSupportedDateTime = '@253402300799999@';
	            self.AlgorithmType = 1;
	            self.CalendarType = 1;
	            self.Eras = [1];
	            self.TwoDigitYearMax = 2029;
	            self.isReadOnly = true;
	        }

	        return _Calendar;
	    })();
	    spread._Calendar = _Calendar;

	    var _DateTimeFormatInfo = (function() {
	        function _DateTimeFormatInfo() {
	            var self = this;
	            var cultureInfo = spread._currentCultureResouce;
	            self.amDesignator = cultureInfo.amDesignator;
	            self.abbreviatedMonthNames = cultureInfo.abbreviatedMonthNames;
	            self.abbreviatedDayNames = cultureInfo.abbreviatedDayNames;
	            self.abbreviatedMonthGenitiveNames = cultureInfo.abbreviatedMonthGenitiveNames;
	            self.Calendar = new _Calendar();
	            self.calendarWeekRule = cultureInfo.calendarWeekRule;
	            self.dateSeparator = cultureInfo.dateSeparator;
	            self.dayNames = cultureInfo.dayNames;
	            self.firstDayOfWeek = cultureInfo.firstDayOfWeek;
	            self.fullDateTimePattern = cultureInfo.fullDateTimePattern;
	            self.isReadOnly = cultureInfo.isReadOnly;
	            self.longDatePattern = cultureInfo.longDatePattern;
	            self.longTimePattern = cultureInfo.longTimePattern;
	            self.monthDayPattern = cultureInfo.monthDayPattern;
	            self.monthNames = cultureInfo.monthNames;
	            self.monthGenitiveNames = cultureInfo.monthGenitiveNames;
	            self.nativeCalendarName = cultureInfo.nativeCalendarName;
	            self.pmDesignator = cultureInfo.pmDesignator;
	            self.rfc1123Pattern = cultureInfo.rfc1123Pattern;
	            self.shortDatePattern = cultureInfo.shortDatePattern;
	            self.shortTimePattern = cultureInfo.shortTimePattern;
	            self.sortableDateTimePattern = cultureInfo.sortableDateTimePattern;
	            self.shortestDayNames = cultureInfo.shortestDayNames;
	            self.timeSeparator = cultureInfo.timeSeparator;
	            self.universalSortableDateTimePattern = cultureInfo.universalSortableDateTimePattern;
	            self.yearMonthPattern = cultureInfo.yearMonthPattern;

	            self.Calendar.isReadOnly = cultureInfo.calendarIsReadOnly;
	        }

	        return _DateTimeFormatInfo;
	    })();
	    spread._DateTimeFormatInfo = _DateTimeFormatInfo;

	    function __toUpper(value) {
	        return value.split('\u00A0').join(' ').toUpperCase();
	    }

	    function __toUpperArray(arr) {
	        var result = [];
	        for (var i = 0, il = arr.length; i < il; i++) {
	            result[i] = __toUpper(arr[i]);
	        }
	        return result;
	    }

	    function __getIndex(value, a1, a2) {
	        var upper = __toUpper(value), i = _.indexOf(a1, upper);
	        if (i === -1) {
	            i = _.indexOf(a2, upper);
	        }
	        return i;
	    }

	    var _EraHelper = (function() {
	        function _EraHelper() {
	        }

	        _EraHelper.isValidEraDate = function(date) {
	            if (date < this.getEraMin() || date > this.getEraMax()) {
	                return false;
	            }
	            return true;
	        };

	        _EraHelper.getEraDates = function() {
	            var eras = window.spreadJSEras;
	            if (eras != keyword_undefined) {
	                var eraDates = new Array();
	                for (var i = 0; i < eras.length; i++) {
	                    var date = new Date(eras[i].startDate.replace(/-/g, '/'));
	                    eraDates[i] = date;
	                }
	                return eraDates;
	            }
	            return this.EraDates;
	        };
	        _EraHelper.getEraNames = function() {
	            var eras = window.spreadJSEras;
	            var eraNames = new Array();
	            if (eras != keyword_undefined) {
	                for (var i = 0; i < eras.length; i++) {
	                    eraNames[i] = eras[i].name;
	                }
	                return eraNames;
	            }

	            for (var i = 0; i < this.EraCount; i++) {
	                eraNames[i] = this.EraNames[i + 2 * this.EraCount];
	            }
	            return eraNames;
	        };

	        _EraHelper.getEraSymbols = function() {
	            var eras = window.spreadJSEras;
	            var eraSymbol = new Array();
	            if (eras != keyword_undefined) {
	                for (var i = 0; i < eras.length; i++) {
	                    eraSymbol[i] = eras[i].symbol;
	                }
	                return eraSymbol;
	            }

	            for (var i = 0; i < this.EraCount; i++) {
	                eraSymbol[i] = this.EraNames[i];
	                ;
	            }
	            return eraSymbol;
	        };

	        _EraHelper.getEraAbbreviations = function() {
	            var eras = window.spreadJSEras;
	            var eraAbbreviation = new Array();
	            if (eras != keyword_undefined) {
	                for (var i = 0; i < eras.length; i++) {
	                    eraAbbreviation[i] = eras[i].abbreviation;
	                }
	                return eraAbbreviation;
	            }

	            for (var i = 0; i < this.EraCount; i++) {
	                eraAbbreviation[i] = this.EraNames[i + this.EraCount];
	            }
	            return eraAbbreviation;
	        };

	        _EraHelper.getEraShortcuts = function() {
	            var eras = window.spreadJSEras;
	            var eraShortcuts = new Array();
	            if (eras != keyword_undefined) {
	                for (var i = 0; i < eras.length; i++) {
	                    eraShortcuts[i] = eras[i].shortcuts.split(',')[0];
	                }
	                return eraShortcuts;
	            }

	            for (var i = 0; i < this.EraCount; i++) {
	                eraShortcuts[i] = this.EraKeys[i];
	            }
	            return eraShortcuts;
	        };

	        _EraHelper.getEraMax = function() {
	            var eras = window.spreadJSEras;
	            if (eras != keyword_undefined) {
	                if (eras.length > 0) {
	                    var date = new Date(eras[eras.length - 1].startDate.replace(/-/g, '/'));
	                    date.setFullYear(date.getFullYear() + 99);
	                    return date;
	                }
	            }
	            return this.EraMax;
	        };

	        _EraHelper.getEraMin = function() {
	            var eras = window.spreadJSEras;
	            if (eras != keyword_undefined) {
	                if (eras.length > 0) {
	                    var date = new Date(eras[0].startDate.replace(/-/g, '/'));
	                    return date;
	                }
	            }
	            return this.EraMin;
	        };

	        _EraHelper.getEraCount = function() {
	            var eras = window.spreadJSEras;
	            if (eras != keyword_undefined) {
	                return eras.length;
	            }
	            return this.EraCount;
	        };

	        _EraHelper.getEraYears = function() {
	            var eras = window.spreadJSEras;
	            if (eras != keyword_undefined) {
	                var eraYears = new Array();
	                for (var i = 1; i < eras.length; i++) {
	                    var date1 = new Date(eras[i - 1].startDate.replace(/-/g, '/'));
	                    var date2 = new Date(eras[i].startDate.replace(/-/g, '/'));
	                    eraYears[i - 1] = date2.getFullYear() - date1.getFullYear() + 1;
	                }
	                eraYears[i - 1] = 99;
	                return eraYears;
	            }
	            return this.EraYears;
	        };

	        _EraHelper.getEraDate = function(date) {
	            var eraDate = new Object();
	            eraDate.era = -1;
	            eraDate.eraYear = -1;

	            var self = this;
	            if (!self.isValidEraDate(date)) {
	                return eraDate;
	            }

	            for (var i = 0; i < self.getEraCount(); i++) {
	                var nextDate = i + 1 != self.getEraCount() ? self.getEraDates()[i + 1] : self.addMilliseconds(self.getEraMax(), 1);

	                if (date < nextDate) {
	                    eraDate.era = i;
	                    eraDate.eraYear = date.getFullYear() - self.getEraDates()[i].getFullYear() + 1;

	                    break;
	                }
	            }

	            return eraDate;
	        };

	        _EraHelper.addMilliseconds = function(date, msec) {
	            var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
	            newDate.setMilliseconds(newDate.getMilliseconds() + msec);
	            return new Date(newDate.valueOf());
	        };

	        _EraHelper.getYearFromEra = function(era, eraYear) {
	            var startYear = _EraHelper.getEraDates()[era].getFullYear();
	            var year = startYear + eraYear - 1;
	            return year;
	        };

	        _EraHelper.parseEraPart = function(format, text) {
	            text = text.toUpperCase();
	            var eras = _EraHelper;
	            switch (format) {
	                case 'g':
	                    var eraSymbols = eras.getEraSymbols();
	                    for (var i = 0; i < eraSymbols.length; i++) {
	                        if (eraSymbols[i] === text) {
	                            return i;
	                        }
	                    }
	                    break;
	                case 'gg':
	                    var eraAbbreviations = eras.getEraAbbreviations();
	                    for (var i = 0; i < eraAbbreviations.length; i++) {
	                        if (eraAbbreviations[i] === text) {
	                            return i;
	                        }
	                    }
	                    break;
	                case 'ggg':
	                    var eraNames = eras.getEraNames();
	                    for (var i = 0; i < eraNames.length; i++) {
	                        if (eraNames[i] === text) {
	                            return i;
	                        }
	                    }
	                    break;
	            }
	            return -1;
	        };

	        _EraHelper.formatEraPart = function(format, date) {
	            var eras = _EraHelper;
	            var eraDateInfo = eras.getEraDate(date);
	            switch (format) {
	                case 'g':
	                    // jp culture, Display the era name in alphabet (M, T, S, H).
	                    if (eraDateInfo.era < 0) {
	                        break;
	                    }
	                    var eraName = (eras.getEraSymbols()[eraDateInfo.era]);
	                    return eraName;
	                    break;
	                case 'gg':
	                    // jp culture, Display the first character (DBCS) era (明, 大, 昭, 平).
	                    if (eraDateInfo.era < 0) {
	                        break;
	                    }
	                    var eraName = (eras.getEraAbbreviations()[eraDateInfo.era]);
	                    return eraName;
	                    break;
	                case 'ggg':
	                    // jp culture, Display the full (DBCS) era (明治, 大正, 昭和, 平成).
	                    if (eraDateInfo.era < 0) {
	                        break;
	                    }
	                    var eraName = (eras.getEraNames()[eraDateInfo.era]);
	                    return eraName;
	                    break;
	                case 'ee':
	                    // jp culture, Display the nengo year as a 2 digits number.
	                    if (eraDateInfo.eraYear < 0) {
	                        break;
	                    }
	                    var eraYear = eraDateInfo.eraYear.toString();
	                    if (eraYear.length === 1) {
	                        eraYear = '0' + eraYear;
	                    }
	                    return eraYear;
	                    break;
	                case 'e':
	                    if (eraDateInfo.eraYear < 0) {
	                        break;
	                    }
	                    var eraYear = eraDateInfo.eraYear.toString();
	                    return eraYear;
	                    break;
	            }
	            return '';
	        };
	        _EraHelper.EraDates = new Array(new Date(1868, 9 - 1, 8), new Date(1912, 7 - 1, 30), new Date(1926, 12 - 1, 25), new Date(1989, 1 - 1, 8));
	        _EraHelper.EraCount = 4;
	        _EraHelper.EraYears = new Array(45, 15, 64, 99);
	        _EraHelper.EraMax = new Date(2087, 12 - 1, 31, 23, 59, 59);
	        _EraHelper.EraMin = new Date(1868, 9 - 1, 8);
	        _EraHelper.EraKeys = new Array('1', '2', '3', '4', 'm', 't', 's', 'h');
	        _EraHelper.EraIndices = new Array(0, 1, 2, 3, 0, 1, 2, 3);
	        _EraHelper.EraNames = new Array('M', 'T', 'S', 'H', '\u660E', '\u5927', '\u662D', '\u5E73', '\u660E\u6CBB', '\u5927\u6B63', '\u662D\u548C', '\u5E73\u6210');
	        _EraHelper.EraYearMax = 99;
	        return _EraHelper;
	    })();
	    spread._EraHelper = _EraHelper;

	    var _CultureInfo = (function() {
	        function _CultureInfo(name) {
	            var self = this;
	            name = name ? name : '';
	            self.name = name;
	            spread._currentCultureResouce = getCultureInfoCore(name);
	            self.numberFormat = new spread._NumberFormatInfo();
	            self.dateTimeFormat = new spread._DateTimeFormatInfo();
	        }

	        _CultureInfo.prototype.Name = function() {
	            return this.name;
	        };

	        _CultureInfo.prototype.NumberFormat = function() {
	            return this.numberFormat;
	        };

	        _CultureInfo.prototype.DateTimeFormat = function() {
	            return this.dateTimeFormat;
	        };

	        _CultureInfo.prototype._getDateTimeFormats = function() {
	            if (!this._dateTimeFormats) {
	                //               var dtf = this.dateTimeFormat;
	                this._dateTimeFormats = spread.dateTimeFormats;
	            }
	            return this._dateTimeFormats;
	        };

	        _CultureInfo.prototype._getMonthIndex = function(value) {
	            var self = this;
	            if (!self._upperMonths) {
	                self._upperMonths = __toUpperArray(self.dateTimeFormat.monthNames);
	                self._upperMonthsGenitive = __toUpperArray(self.dateTimeFormat.monthGenitiveNames);
	            }
	            return __getIndex(value, self._upperMonths, self._upperMonthsGenitive);
	        };

	        _CultureInfo.prototype._getAbbrMonthIndex = function(value) {
	            var self = this;
	            if (!self._upperAbbrMonths) {
	                self._upperAbbrMonths = __toUpperArray(self.dateTimeFormat.abbreviatedMonthNames);
	                self._upperAbbrMonthsGenitive = __toUpperArray(self.dateTimeFormat.abbreviatedMonthGenitiveNames);
	            }
	            return __getIndex(value, self._upperAbbrMonths, self._upperAbbrMonthsGenitive);
	        };

	        _CultureInfo.prototype._getDayIndex = function(value) {
	            var self = this;
	            if (!self._upperDays) {
	                self._upperDays = __toUpperArray(self.dateTimeFormat.dayNames);
	            }
	            return _.indexOf(self._upperDays, __toUpper(value));
	        };
	        _CultureInfo.prototype._getAbbrDayIndex = function(value) {
	            var self = this;
	            if (!self._upperAbbrDays) {
	                self._upperAbbrDays = __toUpperArray(self.dateTimeFormat.abbreviatedDayNames);
	            }
	            return _.indexOf(self._upperAbbrDays, __toUpper(value));
	        };

	        //static _parseCulture(value: _CultureInfo): _CultureInfo {
	        //    var dtf = value.dateTimeFormat;
	        //    return new _CultureInfo(value.name, value.numberFormat, dtf);
	        //}
	        //_parse(value: _CultureInfo): _CultureInfo {
	        //    return _CultureInfo._parseCulture(value);
	        //}
	        _CultureInfo.invariantCulture = function() {
	            var cultureClass = _CultureInfo;
	            if (!cultureClass._invariantCulture) {
	                cultureClass._invariantCulture = new _CultureInfo('');
	            }
	            return cultureClass._invariantCulture;
	        };

	        _CultureInfo.currentCulture = function(cultureName) {
	            if (typeof cultureName === 'undefined') {
	                return _CultureInfo._currentCulture;
	            }
	            var cultureClass = _CultureInfo;
	            cultureClass._currentCulture = cultureClass.getCulture(cultureName);
	            return cultureClass._currentCulture;
	        };

	        _CultureInfo.enCulture = function() {
	            var cultureClass = _CultureInfo;
	            if (!cultureClass._enCulture) {
	                cultureClass._enCulture = new _CultureInfo('en-US');
	            }
	            return cultureClass._enCulture;
	        };

	        _CultureInfo.japanCulture = function() {
	            var cultureClass = _CultureInfo;
	            if (!cultureClass._japanCulture) {
	                var jpCulture = new _CultureInfo('ja-JP');

	                jpCulture.dateTimeFormat.eras = _EraHelper;
	                var dateTimeFormats = jpCulture._getDateTimeFormats().slice(0);
	                dateTimeFormats.push('');
	                cultureClass._japanCulture = jpCulture;
	            }
	            return cultureClass._japanCulture;
	        };

	        _CultureInfo.customCulture = function(cultureName) {
	            var cultureClass = _CultureInfo;
	            if (!cultureClass._customCulture || cultureClass._customCulture.Name() !== cultureName) {
	                var customCulture = new _CultureInfo(cultureName);
	                cultureClass._customCulture = customCulture;
	            }
	            return cultureClass._customCulture;
	        };

	        _CultureInfo.getCulture = function(cultureName) {
	            cultureName = cultureName ? cultureName : '';
	            cultureName = cultureName.toLowerCase();
	            spread._currentCultureResouce = getCultureInfoCore(cultureName);
	            switch (cultureName) {
	                case 'ja-jp':
	                    return _CultureInfo.japanCulture();
	                case 'en-us':
	                    return _CultureInfo.enCulture();
	                default:
	                    return _CultureInfo.customCulture(cultureName);
	            }
	        };
	        return _CultureInfo;
	    })();
	    spread._CultureInfo = _CultureInfo;

	    //</editor-fold>
	    spread._currentCulture;
	    spread._currentCultureResouce;

	    /**
	     * Gets or sets the SpreadJS culture.
	     * @param {string} culture The culture of the current Spread.
	     * @returns If this is invoked with no parameter, the return value is the current culture string.
	     */
	    function Culture(culture) {
	        if (arguments.length === 0) {
	            return spread._currentCulture;
	        }
	        if (typeof (culture) === const_undefined || culture === keyword_null)
	            return;
	        spread.switchCulture(culture);

	        // clean formatter cache
	        //spread._CacheMgr.clearFormatCache();
	        _cultureChanged(culture);
	    }

	    spread.Culture = Culture;

	    function switchCulture(culture) {
	        var cultureInfo = culture.toLowerCase();
	        if (spread._currentCulture !== cultureInfo) {
	            spread._currentCultureResouce = getCultureInfoCore(cultureInfo);
	            spread.CR = spread._currentCultureResouce;
	            switch (cultureInfo) {
	                case 'ja-jp':
	                    spread.SR = sr._JPStringResource;
	                    _CultureInfo.currentCulture('ja-jp');
	                    break;
	                case 'en-us':
	                    spread.SR = sr._ENStringResource;
	                    _CultureInfo.currentCulture('en-us');
	                    break;
	                default:
	                    spread.SR = sr._ENStringResource;
	                    _CultureInfo.currentCulture(cultureInfo);
	                    break;
	            }
	            spread._currentCulture = cultureInfo;
	        }
	    }

	    spread.switchCulture = switchCulture;

	    //Initialize culture when this javascript file is loaded, for that user can use GeneralFormatter only, then it use default culture
	    Culture('en-us');

	    /**
	     * Adds a culture.
	     * @param {string} cultureName The culture name.
	     * @param {$.wijmo.wijspread.CultureInfo} culture The culture.
	     */
	    function addCultureInfo(cultureName, culture) {
	        if (culture.numberDecimalSeparator == culture.listSeparator) {
	            culture.listSeparator = ';';
	        }

	        spread.cultureInfoDict[cultureName.toLowerCase()] = culture;
	    }

	    spread.addCultureInfo = addCultureInfo;

	    /**
	     * Gets the specified culture.
	     * @param {string} cultureName The culture name.
	     * @returns {$.wijmo.wijspread.CultureInfo} culture The culture.
	     */
	    function getCultureInfo(cultureName) {
	        var culture = getCultureInfoCore(cultureName);
	        var result = new spread.CultureInfo();
	        _.extend(result, culture);
	        return result;
	    }

	    spread.getCultureInfo = getCultureInfo;
	    function getCultureInfoCore(cultureName) {
	        cultureName = cultureName.toLowerCase();
	        var culture = spread.cultureInfoDict[cultureName];
	        if (!culture) {
	            culture = spread.cultureInfoDict[''];
	        }
	        return culture;
	    }

	    spread.getCultureInfoCore = getCultureInfoCore;

	    function _cultureChanged(culture) {
	        //$('div[gcUIElement='gcSpread']').trigger(spread.Events.CultureChanged, [{ CultureInfo: culture }]);
	    }

	    //(function () {
	    //    var elements = $('meta[name='spreadjs culture']');
	    //    if (elements.length > 0) {
	    //        var culture = $(elements[elements.length - 1]).attr('content');
	    //        if (culture !== keyword_null && culture != keyword_undefined && culture.toLowerCase() === 'ja-jp') {
	    //            spread.SR = spread._JPStringResource;
	    //            spread._currentCulture = 'ja-jp';
	    //        }
	    //    }
	    //})();
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
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
	        _ENStringResource.Exp_InvalidParameters = 'Invalid function parameters at ';
	        _ENStringResource.Exp_InvalidArrayColumns = 'The length of array columns are unequal at ';
	        _ENStringResource.Exp_ExprIsNull = 'The argument "expr" is null';
	        _ENStringResource.Exp_RuleIsNull = 'The argument "rule" is null';
	        _ENStringResource.CopyCells = 'Copy Cells';
	        _ENStringResource.FillSeries = 'Fill Series';
	        _ENStringResource.FillFormattingOnly = 'Fill Formatting Only';
	        _ENStringResource.FillWithoutFormatting = 'Fill Without Formatting';
	        _ENStringResource.Exp_NumberOnly = 'Only works for Numbers';
	        _ENStringResource.Exp_RangeContainsMergedCell = 'Range should not have merged cell.';
	        _ENStringResource.Exp_ChangeMergedCell = 'Cannot change part of merged cell.';
	        _ENStringResource.Exp_TargetContainsMergedCells = 'Target range should not have merged cells.';
	        _ENStringResource.Exp_MergedCellsIdentical = 'This operation requires the merged cells to be identically sized.';
	        _ENStringResource.SortAscending = 'Sort Ascending';
	        _ENStringResource.SortDescending = 'Sort Descending';
	        _ENStringResource.OK = 'OK';
	        _ENStringResource.Cancel = 'Cancel';
	        _ENStringResource.Search = 'Search';
	        _ENStringResource.CheckAll = 'Check all';
	        _ENStringResource.UncheckAll = 'Uncheck all';
	        _ENStringResource.Blanks = '(Blanks)';
	        _ENStringResource.Exp_FilterItemIsNull = 'FilterItem is null.';
	        _ENStringResource.Exp_InvalidColumnIndex = 'Invalid column index.';
	        _ENStringResource.Exp_TokenIsNull = 'token is null';
	        _ENStringResource.Exp_InvalidBackslash = 'the "\\" cannot be evaluated';
	        _ENStringResource.Exp_FormatIllegal = 'format is illegal.';
	        _ENStringResource.Exp_ValueIsNull = 'value is null';
	        _ENStringResource.Exp_PartIsNull = 'part is null';
	        _ENStringResource.Exp_DuplicatedDescriptor = 'The type of descriptor was added.';
	        _ENStringResource.Exp_TokenIllegal = 'token is illegal.';
	        _ENStringResource.Exp_ValueIllegal = 'value is illegal.';
	        _ENStringResource.Exp_StringIllegal = 'string is illegal.';
	        _ENStringResource.Exp_InvalidNull = 'InvalidNullException';
	        _ENStringResource.Exp_InvalidOperation = 'InvalidOperationException';
	        _ENStringResource.Exp_ArgumentNull = 'ArgumentNullException';
	        _ENStringResource.Exp_CriteriaIsNull = 'criteria is null';
	        _ENStringResource.Exp_InvalidString = 'Invalid string';
	        _ENStringResource.Exp_InvalidDateFormat = 'Invalid date format pattern';
	        _ENStringResource.Exp_InvalidOADate = 'invalid OADate';
	        _ENStringResource.Exp_InvalidExponentFormat = 'invalid exponent format';
	        _ENStringResource.Exp_InvalidSemicolons = 'invalid format: too many semicolons';
	        _ENStringResource.Exp_InvalidNumberGroupSize = 'NumberGroupSize must be between 1 and 9.';
	        _ENStringResource.Exp_BadFormatSpecifier = 'Bad Format Specifier';
	        _ENStringResource.Exp_InvalidNumberFormat = 'Invalid number format pattern';
	        _ENStringResource.Exp_InvalidIndex = 'Invalid index';
	        _ENStringResource.Exp_InvalidCount = 'Invalid count';
	        _ENStringResource.Exp_InvalidLevel = 'Invalid level';
	        _ENStringResource.Exp_GroupInfoIsNull = 'groupInfo is null';
	        _ENStringResource.Exp_SheetIsNull = 'sheet is null.';
	        _ENStringResource.Exp_DestSheetIsNull = 'destSheet is null';
	        _ENStringResource.Exp_PasteExtentIsNull = 'pasteExtent is null';
	        _ENStringResource.Exp_InvalidPastedArea = 'The pasted area should have the same size as the copy or cut area.';
	        _ENStringResource.Exp_ChangePartOfArray = 'Cannot change part of an array.';
	        _ENStringResource.Exp_ColumnReadOnly = 'The column you are trying to change is protected and therefore read-only.';
	        _ENStringResource.Exp_RowReadOnly = 'The row you are trying to change is protected and therefore read-only.';
	        _ENStringResource.Exp_CellReadOnly = 'The row you are trying to change is protected and therefore read-only.';
	        _ENStringResource.Exp_FillRangeContainsMergedCell = 'Cannot fill range that contains a merged cell.';
	        _ENStringResource.Exp_FillCellsReadOnly = 'The cells you are trying to fill is protected and therefore read-only.';
	        _ENStringResource.Exp_OverlappingSpans = 'This operation will cause overlapping spans.';
	        _ENStringResource.Exp_InvalidAndSpace = 'Invalid ';
	        _ENStringResource.ColonSpace = ': ';
	        _ENStringResource.MustBeBetween = ' (must be between ';
	        _ENStringResource.SpaceAndSpace = ' and ';
	        _ENStringResource.RightBracketFullStop = ').';
	        _ENStringResource.Exp_SrcIsNull = 'The argument "src" is null';
	        _ENStringResource.Exp_DestIsNull = 'The argument "dest" is null';
	        _ENStringResource.Exp_InvalidCustomFunction = 'invalid custom function';
	        _ENStringResource.Exp_InvalidCustomName = 'invalid custom name';
	        _ENStringResource.Exp_IndexOutOfRange = 'Index is out of range!';
	        _ENStringResource.Exp_InvalidRange = 'Invalid range';
	        _ENStringResource.Exp_RangeIsNull = 'range is null';
	        _ENStringResource.Exp_NotAFunction = 'is not a function';
	        _ENStringResource.Exp_Format = 'Format';
	        _ENStringResource.Exp_BraceMismatch = 'format: brace mis-match';
	        _ENStringResource.Exp_InvalidFormat = 'invalid format';
	        _ENStringResource.Exp_ArgumentOutOfRange = 'ArgumentOutOfRange';
	        _ENStringResource.Exp_DragDropShiftTableCell = 'This operation is not allowed. The operation is attempting to shift cells in a table on your worksheet.';
	        _ENStringResource.Exp_DragDropChangePartOfTable = 'Cannot complete operation: You are attempting to change a portion of a table row or column in a way that is not allowed.';
	        _ENStringResource.Exp_TableEmptyNameError = 'The table name cannot be empty.';
	        _ENStringResource.Exp_TableInvalidRow = 'Invalid row index or row count.';
	        _ENStringResource.Exp_TableInvalidColumn = 'Invalid column index or column count.';
	        _ENStringResource.Exp_TableIntersectError = 'The tables cannot be intersected.';
	        _ENStringResource.Exp_TableHasSameNameError = 'The current worksheet already exists in a table with the same name.';
	        _ENStringResource.Exp_TableDataSourceNullError = 'Table datasource cannot be null.';
	        _ENStringResource.Exp_TableStyleAddCustomStyleError = 'The style with the same name already exists in the styles.';
	        _ENStringResource.Exp_TableMoveOutOfRange = 'The table cannot be moved out of the sheet.';
	        _ENStringResource.Exp_TableResizeOutOfRange = 'The invalid row count, column count and table cannot be resize out of the sheet.';
	        _ENStringResource.Exp_PasteSourceCellsLocked = 'Source sheet"s cells are locked.';
	        _ENStringResource.Exp_InvalidCopyPasteSize = 'The copy and paste areas are not the same size.';
	        _ENStringResource.Exp_PasteDestinationCellsLocked = 'The cell you are trying to change is protected and therefore read-only.';
	        _ENStringResource.Exp_PasteChangeMergeCell = 'Cannot change part of a merged cell.';
	        _ENStringResource.Tip_Row = 'Row: ';
	        _ENStringResource.Tip_Column = 'Column: ';
	        _ENStringResource.Tip_Height = 'Height: ';
	        _ENStringResource.Tip_Width = 'Width: ';
	        _ENStringResource.Tip_pixels = ' pixels';
	        _ENStringResource.NewTab = 'New...';

	        _ENStringResource.Exp_EmptyNamedStyle = 'The name of named style cannot be empty or null';
	        _ENStringResource.Exp_FloatingObjectHasSameNameError = 'The current worksheet already has a floating object with the same name.';
	        _ENStringResource.Exp_FloatingObjectNameEmptyError = 'Floating object must have name';

	        _ENStringResource.ToolStrip_PasteText = 'Paste';
	        _ENStringResource.ToolStrip_CutText = 'Cut';
	        _ENStringResource.ToolStrip_CopyText = 'Copy';
	        _ENStringResource.ToolStrip_AutoFillText = 'AutoFill';

	        _ENStringResource.Exp_ArrayFromulaPart = 'You cannot change part of an array.';
	        _ENStringResource.Exp_ArrayFromulaSpan = 'Array formulas are not valid in merged cells.';
	        _ENStringResource.Exp_ArrayFormulaTable = 'multi-cell array formulas are not allowed in tables.';

	        _ENStringResource.Fbx_Summary = 'Summary';
	        _ENStringResource.Fbx_TableName_Description = 'Table name for ';
	        _ENStringResource.Fbx_CustomName_Description = 'Custom name for ';
	        return _ENStringResource;
	    })();
	    spread._ENStringResource = _ENStringResource;

	    var _JPStringResource = (function() {
	        function _JPStringResource() {
	        }

	        _JPStringResource.Exp_InvalidArgument = '無効な引数';
	        _JPStringResource.Exp_InvalidCast = '例外:無効なキャスト';
	        _JPStringResource.Exp_NotSupport = '例外:サポートされていない機能の利用を試みました';
	        _JPStringResource.Exp_FormulaInvalid = '入力された数式は無効な文字を含んでいます : ';
	        _JPStringResource.Exp_InvalidTokenAt = '無効なトークン : ';
	        _JPStringResource.Exp_InvalidArrayAt = '無効な配列 : ';
	        _JPStringResource.Exp_InvalidCellReference = 'セル名もしくはセル参照が無効です : ';
	        _JPStringResource.Exp_InvalidFunctionName = '無効な関数名';
	        _JPStringResource.Exp_InvalidOverrideFunction = '組込関数をオーバーライドすることはできません';
	        _JPStringResource.Exp_OverrideNotAllowed = '許可されていない関数オーバーライドの実行です';
	        _JPStringResource.Exp_NoSyntax = '構文 "';
	        _JPStringResource.Exp_MatchSyntax = '" は次の構文 ';
	        _JPStringResource.SingleQuotesFullStop = '" とマッチしませんでした。';
	        _JPStringResource.SingleQuote = '"';
	        _JPStringResource.Exp_IsValid = '" は無効です。';
	        _JPStringResource.Exp_InvalidArray = '無効な配列 : ';
	        _JPStringResource.AtIndexOn = '" 該当するインデックス : ';
	        _JPStringResource.FullStop = '';
	        _JPStringResource.SingleQuoteAt = '" 位置 : ';
	        _JPStringResource.Exp_InvalidParameters = '無効なパラメータの検出 : ';
	        _JPStringResource.Exp_InvalidArrayColumns = '配列のカラム長が一致しません 位置 : ';
	        _JPStringResource.Exp_ExprIsNull = '引数 "expr" が null です';
	        _JPStringResource.Exp_RuleIsNull = '引数 "rule" が null です';
	        _JPStringResource.CopyCells = 'セルのコピー';
	        _JPStringResource.FillSeries = '連結データ';
	        _JPStringResource.FillFormattingOnly = '書式のみコピー';
	        _JPStringResource.FillWithoutFormatting = '書式なしコピー';
	        _JPStringResource.Exp_NumberOnly = '数字のみ有効です';
	        _JPStringResource.Exp_RangeContainsMergedCell = '結合されたセルが範囲に含まれています。';
	        _JPStringResource.Exp_ChangeMergedCell = '結合されたセルの一部を変更することはできません。';
	        _JPStringResource.Exp_TargetContainsMergedCells = '結合されたセルが指定の範囲に含まれています。';
	        _JPStringResource.Exp_MergedCellsIdentical = 'この操作には同じサイズの結合セルが必要です。';
	        _JPStringResource.SortAscending = '昇順';
	        _JPStringResource.SortDescending = '降順';
	        _JPStringResource.OK = 'OK';
	        _JPStringResource.Cancel = 'キャンセル';
	        _JPStringResource.Search = '検索';
	        _JPStringResource.CheckAll = 'すべて選択';
	        _JPStringResource.UncheckAll = 'すべて解除';
	        _JPStringResource.Blanks = '(空白セル)';
	        _JPStringResource.Exp_FilterItemIsNull = 'フィルタ項目が null です。';
	        _JPStringResource.Exp_InvalidColumnIndex = '無効な列インデックスです。';
	        _JPStringResource.Exp_TokenIsNull = 'トークンが null です';
	        _JPStringResource.Exp_InvalidBackslash = '"\\" を評価できません。';
	        _JPStringResource.Exp_FormatIllegal = 'フォーマットが不正です。';
	        _JPStringResource.Exp_ValueIsNull = '値は null です';
	        _JPStringResource.Exp_PartIsNull = 'part は null です';
	        _JPStringResource.Exp_DuplicatedDescriptor = 'その種類の記述子は既に追加されています。';
	        _JPStringResource.Exp_TokenIllegal = 'トークンが不正です。';
	        _JPStringResource.Exp_ValueIllegal = '値が不正です。';
	        _JPStringResource.Exp_StringIllegal = '文字列が不正です。';
	        _JPStringResource.Exp_InvalidNull = '無効な null による例外';
	        _JPStringResource.Exp_InvalidOperation = '無効な操作による例外';
	        _JPStringResource.Exp_ArgumentNull = 'null 引数による例外';
	        _JPStringResource.Exp_CriteriaIsNull = '条件となる引数が null です';
	        _JPStringResource.Exp_InvalidString = '無効な文字列';
	        _JPStringResource.Exp_InvalidDateFormat = '無効な日付フォーマット';
	        _JPStringResource.Exp_InvalidOADate = '無効な OADate';
	        _JPStringResource.Exp_InvalidExponentFormat = '無効な指数のフォーマットです';
	        _JPStringResource.Exp_InvalidSemicolons = '無効なフォーマット: セミコロンが多すぎます';
	        _JPStringResource.Exp_InvalidNumberGroupSize = 'NumberGroupSize は1から9の値である必要があります。';
	        _JPStringResource.Exp_BadFormatSpecifier = '誤ったフォーマット指示子';
	        _JPStringResource.Exp_InvalidNumberFormat = '無効な数値フォーマットのパターンです';
	        _JPStringResource.Exp_InvalidIndex = '無効なインデックスです';
	        _JPStringResource.Exp_InvalidCount = '無効なカウントです';
	        _JPStringResource.Exp_InvalidLevel = '無効なレベルです';
	        _JPStringResource.Exp_GroupInfoIsNull = 'groupInfo が null です';
	        _JPStringResource.Exp_SheetIsNull = 'sheet が nullです。';
	        _JPStringResource.Exp_DestSheetIsNull = 'destSheet が null です。';
	        _JPStringResource.Exp_PasteExtentIsNull = 'pasteExtent が null です';
	        _JPStringResource.Exp_InvalidPastedArea = '貼り付け領域はコピー/切り取り範囲と同サイズである必要があります。';
	        _JPStringResource.Exp_ChangePartOfArray = '配列の一部を変更することはできません。';
	        _JPStringResource.Exp_ColumnReadOnly = '変更しようとしている列は保護されているため、読み取り専用となっています。';
	        _JPStringResource.Exp_RowReadOnly = '変更しようとしている行は保護されているため、読み取り専用となっています。';
	        _JPStringResource.Exp_CellReadOnly = '変更しようとしているセルは保護されているため、読み取り専用となっています。';
	        _JPStringResource.Exp_FillRangeContainsMergedCell = '結合したセルが含まれる範囲をフィルすることはできません。';
	        _JPStringResource.Exp_FillCellsReadOnly = 'フィルしようとしている範囲は保護されているため、読み取り専用となっています。';
	        _JPStringResource.Exp_OverlappingSpans = 'この操作は結合部分の重複を引き起こします。';
	        _JPStringResource.Exp_InvalidAndSpace = '無効な ';
	        _JPStringResource.ColonSpace = ' : ';
	        _JPStringResource.MustBeBetween = ' は ';
	        _JPStringResource.SpaceAndSpace = ' から ';
	        _JPStringResource.RightBracketFullStop = ' の間である必要があります。';
	        _JPStringResource.Exp_SrcIsNull = '引数 "src" は null です';
	        _JPStringResource.Exp_DestIsNull = '引数 "dest" は null です';
	        _JPStringResource.Exp_InvalidCustomFunction = '無効なカスタム関数';
	        _JPStringResource.Exp_InvalidCustomName = '無効な名前';
	        _JPStringResource.Exp_IndexOutOfRange = '範囲外のインデックスです!';
	        _JPStringResource.Exp_InvalidRange = '無効な範囲';
	        _JPStringResource.Exp_RangeIsNull = '範囲が null です';
	        _JPStringResource.Exp_NotAFunction = 'は関数ではありません';
	        _JPStringResource.Exp_Format = 'フォーマット';
	        _JPStringResource.Exp_BraceMismatch = 'フォーマット: 括弧の個数が一致していません';
	        _JPStringResource.Exp_InvalidFormat = '無効なフォーマット';
	        _JPStringResource.Exp_ArgumentOutOfRange = '範囲外の引数';
	        _JPStringResource.Exp_DragDropShiftTableCell = 'この操作はワークシート上のテーブル内でセルをシフトしようとしているため許可されません。';
	        _JPStringResource.Exp_DragDropChangePartOfTable = '操作を完了できません。許可されていない方法でテーブルの行または列の一部を変更しようとしています。';
	        _JPStringResource.Exp_TableEmptyNameError = 'テーブル名を空にすることはできません。';
	        _JPStringResource.Exp_TableInvalidRow = '無効な行インデックスもしくは行数です。';
	        _JPStringResource.Exp_TableInvalidColumn = '無効な列インデックスもしくは列数です。';
	        _JPStringResource.Exp_TableIntersectError = 'テーブルを重ね合わせることは出来ません。';
	        _JPStringResource.Exp_TableHasSameNameError = 'すでに同名のワークシートが存在します。';
	        _JPStringResource.Exp_TableDataSourceNullError = 'テーブルのデータソースを null にすることはできません。';
	        _JPStringResource.Exp_TableStyleAddCustomStyleError = 'すでに同名のスタイル名が存在します。';
	        _JPStringResource.Exp_TableMoveOutOfRange = 'テーブルをシート外に移動することはできません。';
	        _JPStringResource.Exp_TableResizeOutOfRange = '無効な行数、列数です。テーブルをシート範囲外にリサイズすることはできません。';
	        _JPStringResource.Exp_PasteSourceCellsLocked = '参照元となっているシートのセルはロックされています。';
	        _JPStringResource.Exp_InvalidCopyPasteSize = 'コピーと貼り付けの範囲サイズが異なっています。';
	        _JPStringResource.Exp_PasteDestinationCellsLocked = '変更しようとしているセルは保護されているため、読み取り専用となっています。';
	        _JPStringResource.Exp_PasteChangeMergeCell = '結合したセルの一部は変更できません。';
	        _JPStringResource.Tip_Row = '行: ';
	        _JPStringResource.Tip_Column = '列: ';
	        _JPStringResource.Tip_Height = '高さ: ';
	        _JPStringResource.Tip_Width = '幅: ';
	        _JPStringResource.Tip_pixels = ' ピクセル';
	        _JPStringResource.NewTab = 'New...';

	        _JPStringResource.Exp_EmptyNamedStyle = '名前付きスタイルの名称を空にすることはできません。';
	        _JPStringResource.Exp_FloatingObjectHasSameNameError = 'すでに同名のオブジェクト名が存在します。';
	        _JPStringResource.Exp_FloatingObjectNameEmptyError = 'オブジェクト名を空にすることはできません。';

	        _JPStringResource.ToolStrip_PasteText = '貼り付け';
	        _JPStringResource.ToolStrip_CutText = '切り取り';
	        _JPStringResource.ToolStrip_CopyText = 'コピー';
	        _JPStringResource.ToolStrip_AutoFillText = 'オートフィル';

	        _JPStringResource.Exp_ArrayFromulaPart = '配列の一部を変更できません。';
	        _JPStringResource.Exp_ArrayFromulaSpan = '配列数式は、結合したセルでは無効です。';
	        _JPStringResource.Exp_ArrayFormulaTable = '複数セルの配列数式はテーブルでは許可されていません。';

	        _JPStringResource.Fbx_Summary = '概要';
	        _JPStringResource.Fbx_TableName_Description = 'テーブル名 ';
	        _JPStringResource.Fbx_CustomName_Description = 'カスタム名 ';
	        return _JPStringResource;
	    })();
	    spread._JPStringResource = _JPStringResource;

	    spread.SR = _ENStringResource;
	})();


/***/ }
/******/ ])
});
