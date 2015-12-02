(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["Calc"], factory);
	else if(typeof exports === 'object')
		exports["Sparkline"] = factory(require(undefined));
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["Sparkline"] = factory(root["GcSpread"]["Views"]["Calc"]);
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
	    var domUtil = __webpack_require__(2);
	    var gcUtils = __webpack_require__(3);
	    var Calc = __webpack_require__(1);
	    var CalcHelper = Calc.Helper;
	    var MathFloor = Math.floor;
	    var MathPI = Math.PI;
	    var MathSin = Math.sin;
	    var MathCos = Math.cos;
	    var MathMin = Math.min;
	    var MathMax = Math.max;
	    var MathAbs = Math.abs;
	    //var Math_round = Math.round;
	    //var Math_pow = Math.pow;
	    //var Math_sqrt = Math.sqrt;
	    //var Math_random = Math.random;
	    //var keyword_undefined = undefined;
	    //var Math_ceil = Math.ceil;
	    //var const_string = "string";

	    //region Helper Method
	    var _Color = (function() {
	        function _Color(a, r, g, b) {
	            var self = this;
	            self.a = a;
	            self.r = r;
	            self.g = g;
	            self.b = b;
	        }

	        _Color.prototype = {
	            toString: function() {
	                var self = this;
	                if (self.a === 255) {
	                    return '#' + self.getColorUnitString(self.r) + self.getColorUnitString(self.g) + self.getColorUnitString(self.b);
	                }
	                return 'rgba(' + self.r + ',' + self.g + ',' + self.b + ',' + self.a + ')';
	            },

	            //getBrightness: function() {
	            //    return ((this.r * 299) + (this.g * 587) + (this.b * 114)) / 1000;
	            //},

	            getColorUnitString: function(unit) {
	                var s = unit.toString(16);
	                if (s.length === 1) {
	                    s = '0' + s;
	                }
	                return s;
	            }
	        };

	        _Color.hueToRGB = function(n1, n2, hue) {
	            if (hue < 0) {
	                hue += 240;
	            }
	            if (hue > 240) {
	                hue -= 240;
	            }
	            if (hue < 40) {
	                return (n1 + ((((n2 - n1) * hue) + 20) / 40));
	            }
	            if (hue < 120) {
	                return n2;
	            }
	            if (hue < 160) {
	                return (n1 + ((((n2 - n1) * (160 - hue)) + 20) / 40));
	            }
	            return n1;
	        };

	        _Color.fromHLS = function(hue, luminosity, saturation) {
	            var r;
	            var g;
	            var b;
	            if (saturation === 0) {
	                r = g = b = parseInt(((luminosity * 0xff) / 240), 10);
	            } else {
	                var n1;
	                var n2;
	                if (luminosity <= 120) {
	                    n2 = ((luminosity * (240 + saturation)) + 120) / 240;
	                } else {
	                    n2 = (luminosity + saturation) - (((luminosity * saturation) + 120) / 240);
	                }
	                n1 = (2 * luminosity) - n2;
	                r = parseInt((((_Color.hueToRGB(n1, n2, hue + 80) * 0xff) + 120) / 240), 10);
	                g = parseInt((((_Color.hueToRGB(n1, n2, hue) * 0xff) + 120) / 240), 10);
	                b = parseInt((((_Color.hueToRGB(n1, n2, hue - 80) * 0xff) + 120) / 240), 10);
	            }
	            return new _Color(0xff, r, g, b);
	        };

	        _Color.parse = function(value) {
	            return parseToColor(value);
	        };

	        return _Color;
	    })();

	    var _PositionRect = (function() {
	        function _PositionRect(x, y, w, h) {
	            var self = this;
	            self.X = x;
	            self.Y = y;
	            self.Width = w;
	            self.Height = h;
	            self.Left = self.X;
	            self.Right = self.Left + self.Width;
	            self.Top = self.Y;
	            self.Bottom = self.Y + self.Height;
	        }

	        return _PositionRect;
	    })();

	    function parseToColor(value) {
	        if (value instanceof _Color) {
	            return value;
	        }
	        var a = 0;
	        var r = 0;
	        var g = 0;
	        var b = 0;
	        if (value && value !== '') {
	            var val = parseColorString(value);
	            if (val) {
	                if (val.length === 3) {
	                    a = 255;
	                    r = val[0];
	                    g = val[1];
	                    b = val[2];
	                } else if (val.length === 4) {
	                    a = val[0];
	                    r = val[1];
	                    g = val[2];
	                    b = val[3];
	                }
	            }
	        }
	        return new _Color(a, r, g, b);
	    }

	    function parseColorString(value) {
	        var rrggbbPattern = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i; //#rrggbb
	        var rgbPattern = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i; //#rgb
	        var rgbFunctionPattern = /^rgb\(([\s\d]*),([\s\d]*),([\s\d]*)\)$/i; //rgb(n,n,n) or rgb(n%,n%,n%)
	        var rgbaFunctionPattern = /^rgba\(([\s\d]*),([\s\d]*),([\s\d]*),([\s\d]*)\)$/i; //rgba(r,g,b,a) or rgba(r%,g%,b%,a)

	        var normalizeColorString = (function() {
	            var _canvasContext;
	            return function(strColor1) {
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
	            };
	        }());

	        var hexToColorUnit = function(x) {
	            return parseInt(x, 16);
	        };

	        var hex2ToColorUnit2 = function(x) {
	            return parseInt(x + x, 16);
	        };

	        var decOrPercentToColorUnit = function(x) {
	            return x.indexOf('%') > 0 ? parseFloat(x) * 2.55 : parseFloat(x);
	        };

	        var sColor = normalizeColorString(value);
	        var re = RegExp;
	        if (rrggbbPattern.test(sColor)) { // this is the most use-case after transformed by canvas.
	            return _.map([re.$1, re.$2, re.$3], hexToColorUnit);
	        } else if (rgbaFunctionPattern.test(sColor)) {// rgba(x,x,x,x) is a special case which not transformed by canvas.
	            var v = _.map([re.$1, re.$2, re.$3], decOrPercentToColorUnit);
	            v.splice(0, 0, parseFloat(re.$4) * 255);
	            return v;
	        } else if (rgbFunctionPattern.test(sColor)) {
	            return _.map([re.$1, re.$2, re.$3], decOrPercentToColorUnit);
	        } else if (rgbPattern.test(sColor)) {
	            return _.map([re.$1, re.$2, re.$3], hex2ToColorUnit2);
	        }
	        return null;
	    }

	    function getAllValuesFromReference(reference, context) {
	        var values = reference;
	        var resultArray;
	        //if (_.isArray(values)) {
	        //    rowIndex = context.getCurrentRow();
	        //    resultArray = rowIndex >= 0 ? values[rowIndex] : values;
	        //}
	        if (CalcHelper.columnRef(values)) {
	            resultArray = values.getValue(context.getCurrentRow(), context.groupPath);
	        } else if (CalcHelper.fieldRef(values)) {
	            resultArray = values.getValue();
	        } else {
	            resultArray = values;
	        }

	        if (gcUtils.isUndefinedOrNull(resultArray) || resultArray === '') {
	            return [];
	        }
	        return gcUtils.isArray(resultArray) ? resultArray : [resultArray];
	    }

	    function parseSetting(jsonSetting) {
	        var setting = {};
	        var inBracket = false;
	        var inProperty = true;
	        var property = '';
	        var value = '';
	        if (jsonSetting) {
	            jsonSetting = jsonSetting.substr(1, jsonSetting.length - 2);//remove brace at the start and end of jsonSetting
	            for (var i = 0, len = jsonSetting.length; i < len; i++) {
	                var char = jsonSetting.charAt(i);
	                if (char === ':') {
	                    inProperty = false;
	                } else if (char === ',' && !inBracket) {
	                    setting[property] = value;
	                    property = '';
	                    value = '';
	                    inProperty = true;
	                } else if (char === '\'' || char === '\"') {
	                    //discard
	                } else {
	                    if (char === '(') {
	                        inBracket = true;
	                    } else if (char === ')') {
	                        inBracket = false;
	                    }
	                    if (inProperty) {
	                        property += char;
	                    } else {
	                        value += char;
	                    }
	                }
	            }
	            if (property) {
	                setting[property] = value;
	            }
	            for (var p in setting) {
	                var v = setting[p];
	                if (!gcUtils.isUndefinedOrNull(v)) {
	                    if (v.toUpperCase() === 'TRUE') {
	                        setting[p] = true;
	                    } else if (v.toUpperCase() === 'FALSE') {
	                        setting[p] = false;
	                    } else if (!isNaN(v) && isFinite(v)) {
	                        setting[p] = parseFloat(v);
	                    }
	                }
	            }
	        }
	        return setting;
	    }

	    function fromOADate(oadate) {
	        var offsetDay = oadate - 25569;
	        var date = new Date(offsetDay * 86400000);
	        // multiply 86400000 first then do divide. it will cause some float precision error if the order is not.
	        // 2014/10/17 ben.yin here is a "+1" or "-1", is for javascript divide low precision, it will loss last digit precision.So here add 1, for loss, for result right.
	        // add 1 when after 1987, sub 1 when before 1987
	        var adjustValue = offsetDay >= 0 ? 1 : -1;
	        return new Date((oadate * 86400000 * 1440 + adjustValue - 25569 * 86400000 * 1440 + date.getTimezoneOffset() * 86400000) / 1440);
	    }

	    var EmptyValueStyle = {
	        Gaps: 0,
	        Zero: 1,
	        Connect: 2
	    };

	    var SparklineAxisMinMax = {
	        // Specifies that the vertical axis minimum or maximum for each sparkline in this sparkline group is calculated automatically such that the data point with the minimum or maximum value can be displayed in the plot area.
	        individual: 0,
	        // Specifies that the vertical axis minimum or maximum is shared across all sparklines in this sparkline group and is calculated automatically such that the data point with the minimum or maximum value can be displayed in the plot area.
	        group: 1,
	        //Specifies that the vertical axis minimum or maximum for each sparkline in this sparkline group is specified by the manualMin attribute or the manualMax attribute of the sparkline group.
	        custom: 2
	    };

	    function extends_(d, b) {
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
	    }

	    //endregion

	    var SparklineEx = (function() {
	        function SparklineEx() {

	        }

	        SparklineEx.prototype = {
	            paint: function(container) {
	                var self = this;
	                var containerRect = domUtil.getElementRect(container);
	                var width = containerRect.width;
	                var height = containerRect.height;
	                var canvas = domUtil.createElement('<canvas style="position:absolute;left:0;top:0;" width="' + width + '" height="' + height + '"></canvas>');
	                var context = canvas.getContext('2d');
	                self._paint(context, width, height);
	                container.innerHTML = '';
	                container.appendChild(canvas);
	            },

	            valueOf: function() {
	                return '';
	            }
	        };
	        return SparklineEx;
	    })();

	    var PieSparkline = (function(super_) {
	        function PieSparkline(args) {
	            var self = this;
	            self.args = args;
	            self.name = 'PIESPARKLINE';
	        }

	        extends_(PieSparkline, super_);

	        PieSparkline.prototype._paint = function(context, width, height) {
	            var self = this;
	            var centerX = width / 2;
	            var centerY = height / 2;
	            var margin = 5;
	            var radius = MathMin(width, height) / 2 - margin;
	            var fromAngle = -0.5 * MathPI;
	            var toAngle;
	            var XOnCircle = centerX + radius * MathCos(fromAngle);
	            var YOnCircle = centerY + radius * MathSin(fromAngle);
	            var XOnCircleCacheArray = [];
	            var YOnCircleCacheArray = [];
	            if (radius <= 0) {
	                return;
	            }
	            var args = self.args;
	            var values = _fixValues.call(self, args.values);
	            var length = values.length;
	            var colors = _fixColors.call(self, length, args.colors);
	            var sum = 0;
	            var i;
	            for (i = 0; i < length; i++) {
	                sum += values[i];
	            }
	            context.save();
	            //paint sector
	            for (i = 0; i < length; i++) {
	                toAngle = fromAngle + values[i] / sum * 2 * MathPI;

	                context.beginPath();
	                context.moveTo(centerX, centerY);
	                context.lineTo(XOnCircle, YOnCircle);
	                context.arc(centerX, centerY, radius, fromAngle, toAngle, false);
	                context.lineTo(centerX, centerY);
	                context.fillStyle = colors[i];
	                context.fill();

	                XOnCircleCacheArray.push(XOnCircle);
	                YOnCircleCacheArray.push(YOnCircle);

	                fromAngle = toAngle;
	                XOnCircle = centerX + radius * MathCos(fromAngle);
	                YOnCircle = centerY + radius * MathSin(fromAngle);
	            }
	            //paint separating line
	            context.strokeStyle = 'white';
	            for (i = 0; i < length; i++) {
	                context.beginPath();
	                context.moveTo(centerX, centerY);
	                context.lineTo(XOnCircleCacheArray[i], YOnCircleCacheArray[i]);
	                context.stroke();
	            }
	            context.restore();
	        };

	        function _fixValues(values) {
	            var newValues = [];
	            var temp;
	            if (gcUtils.isUndefinedOrNull(values)) {
	                return newValues;
	            }
	            for (var i = 0, j = 0, length = values.length; i < length; i++) {
	                temp = values[i];
	                if (!gcUtils.isUndefinedOrNull(temp) && !isNaN(temp) && isFinite(temp)) {
	                    if (temp < 0) {
	                        temp = -temp;
	                    }
	                    newValues[j++] = temp;
	                } else {
	                    newValues[j++] = 0;
	                }
	            }
	            if (values.length === 1 && newValues.length === 1) {
	                newValues[1] = 1 - newValues[0];
	            }
	            return newValues;
	        }

	        function _fixColors(valueCount, colors) {
	            var newColors = [];
	            var colorCount = colors.length;
	            var i;
	            if (valueCount <= colorCount) {
	                newColors = colors.slice(0, valueCount);
	            } else {
	                if (colorCount === 0) {
	                    newColors.push('darkgray');
	                    colorCount = 1;
	                } else {
	                    newColors = colors.slice(0);
	                }
	                var baseColors = [];
	                var color;
	                var r;
	                var g;
	                var b;
	                var len = valueCount - colorCount + 1;
	                for (i = 0; i < colorCount; i++) {
	                    baseColors[i] = _Color.parse(newColors[i]);
	                }
	                for (i = colorCount; i < valueCount; i++) {
	                    color = baseColors[i % colorCount];
	                    r = color.r;
	                    g = color.g;
	                    b = color.b;
	                    r -= (r / len) * (i / colorCount);
	                    g -= (g / len) * (i / colorCount);
	                    b -= (b / len) * (i / colorCount);
	                    newColors[i] = new _Color(255, MathFloor(r), MathFloor(g), MathFloor(b)).toString();
	                }
	            }
	            return newColors;
	        }

	        return PieSparkline;
	    })(SparklineEx);

	    //remove DataOrientation, DateAxisOrientation, settings: displayHidden
	    var CompatibleSparklineSetting = (function() {
	        function CompatibleSparklineSetting(setting) {
	            var self = this;
	            if (!setting) {
	                self.axisColor = 'black';
	                self.firstMarkerColor = 'rgba(149, 179, 215, 255)';
	                self.highMarkerColor = 'blue';
	                self.lastMarkerColor = 'rgba(149, 179, 215, 255)';
	                self.lowMarkerColor = 'blue';
	                self.markersColor = 'rgba(36, 64, 98, 255)';
	                self.negativeColor = 'brown';
	                self.seriesColor = 'rgba(36, 64, 98, 255)';
	                //Indicates how to display the empty cells.
	                self.displayEmptyCellsAs = EmptyValueStyle.Gaps;
	                //Indicates whether each sparkline in the sparkline group is displayed in a right-to-left manner.
	                self.rightToLeft = false;
	                // Indicates whether the horizontal axis is displayed for each sparkline in this sparkline group.
	                self.displayXAxis = false;
	                // Indicates the line weight for each sparkline in the sparkline group, where the line weight is measured in points. The weight must be greater than or equal to zero, and must be less than or equal to 3 (LineSeries only supports line weight values in the range of 0.0-3.0).
	                self.lineWeight = 1.0;
	                self.showFirst = false;
	                self.showHigh = false;
	                self.showLast = false;
	                self.showLow = false;
	                self.showNegative = false;
	                self.showMarkers = false;
	                // Indicates the maximum for the vertical axis that is shared across all sparklines in this sparkline group. The axis is zero if maxAxisType does not equal custom.
	                self.manualMax = 0.0;
	                // Indicates the minimum for the vertical axis that is shared across all sparklines in this sparkline group. The axis is zero if minAxisType does not equal custom.
	                self.manualMin = 0.0;
	                // Indicates how the vertical axis maximum is calculated for the sparklines in this sparkline group.
	                self.maxAxisType = SparklineAxisMinMax.individual;
	                // Indicates how the vertical axis minimum is calculated for the sparklines in this sparkline group.
	                self.minAxisType = SparklineAxisMinMax.individual;
	                // Gets the maximum value of the sparkline group.
	                self.groupMaxValue = 0;
	                // Gets the minimum value of the sparkline group.
	                self.groupMinValue = 0;
	                //// Indicates whether data in hidden cells is plotted for the sparklines in this sparkline group.
	                //self.displayHidden = false;
	            } else {
	                for (var x in setting) {
	                    if (x) {
	                        self[x] = setting[x];
	                    }
	                }
	            }
	        }

	        return CompatibleSparklineSetting;
	    })();

	    var CompatibleSparkline = (function(super_) {
	        function CompatibleSparkline() {
	            var self = this;
	            _clearCache.call(self);
	            //var self = this;
	            //if (options) {
	            //    self.setOptions(options);
	            //}
	        }

	        extends_(CompatibleSparkline, super_);

	        CompatibleSparkline.prototype._paint = function(context, width, height) {
	            var self = this;
	            _clearCache.call(self);
	            var args = self.args;
	            self.setting = args.setting;
	            self.cachedValues = _fixValues(args.values);
	            self.cachedDatetimes = _fixValues(args.dates, true);

	            context.save();
	            context.rect(0, 0, width, height);
	            context.clip();
	            context.beginPath();
	            if (self.name === 'LINESPARKLINE') {
	                _paintLines.call(self, context, width, height);
	            }
	            _paintDataPoints.call(self, context, width, height);
	            _paintAxis.call(self, context, width, height);
	            context.restore();
	        };

	        function _fixValues(values, isDatetime) {
	            //TODO: displayHidden
	            var ret = [];
	            var value;
	            if (gcUtils.isUndefinedOrNull(values)) {
	                return ret;
	            }
	            for (var i = 0, length = values.length; i < length; i++) {
	                value = values[i];
	                if (!gcUtils.isUndefinedOrNull(value)) {
	                    if (isDatetime) {
	                        if (gcUtils.isNumber(value)) {
	                            value = fromOADate(value);
	                        } else {
	                            value = Date.parse(value);
	                        }
	                    } else if (!gcUtils.isNumber(value)) {
	                        value = null;
	                    }
	                }
	                ret.push(value);
	            }
	            return ret;
	        }

	        function _paintAxis(ctx, w, h) {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var setting = self.setting;
	            if (!setting.displayXAxis || !_hasAxis.call(self)) {
	                return;
	            }
	            var space = _getSpace.call(self);
	            var avalibleSize = {Width: w, Height: h};
	            var x1 = space; //left space
	            var x2 = avalibleSize.Width - space; //right space
	            var y1 = MathFloor(_getAxisY.call(self, avalibleSize, cachedValues, setting)) + 0.5;
	            var y2 = y1;
	            var color = setting.axisColor;
	            var lineWidth = 1; //TODO: zoomFactor

	            if (ctx.strokeStyle !== color) {
	                ctx.strokeStyle = color;
	            }
	            if (ctx.lineWidth !== lineWidth) {
	                ctx.lineWidth = lineWidth;
	            }
	            ctx.beginPath();
	            ctx.moveTo(x1, y1);
	            ctx.lineTo(x2, y2);
	            ctx.stroke();
	        }

	        function _getAxisYNormal(availableSize) {
	            var self = this;
	            var setting = self.setting;
	            var size = _getCanvasSize.call(self, availableSize, setting);
	            var max = _getActualMaxValue.call(self);
	            var min = _getActualMinValue.call(self);

	            //if there is no value.
	            if (max === -Number.MAX_VALUE || min === Number.MAX_VALUE) {
	                return availableSize.Height / 2;
	            }

	            var range = max - min;

	            if (max === min) {
	                if (max === 0) {
	                    return availableSize.Height / 2;
	                }

	                range = max;
	                if (max < 0) {
	                    max = 0;
	                }
	            }

	            var d = size.Height / range;
	            return _getSpace.call(self) + max * d;
	        }

	        function _getAxisY(availableSize) {
	            var self = this;
	            if (self.name === 'WINLOSSSPARKLINE') {
	                return availableSize.Height / 2;
	            }
	            return _getAxisYNormal.call(self, availableSize);
	        }

	        function _hasAxisNormal() {
	            var self = this;
	            var max = _getActualMaxValue.call(self);
	            if (max !== -Number.MAX_VALUE) {
	                var min = _getActualMinValue.call(self);
	                if (min !== Number.MAX_VALUE) {
	                    return max === min || (max * min <= 0);
	                }
	            }
	            return true;
	        }

	        function _hasAxis() {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var b = _hasAxisNormal.call(self);
	            if (self.name !== 'WINLOSSSPARKLINE') {
	                return b;
	            }

	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var cachedIndexMapingCount = cachedIndexMaping.length;
	            var index;
	            var item;
	            if (!b && cachedIndexMapingCount > 0) {
	                for (var i = 0; i < cachedIndexMapingCount; i++) {
	                    index = cachedIndexMaping[i];
	                    item = cachedValues[index];
	                    if (!gcUtils.isUndefinedOrNull(item)) {
	                        return true;
	                    }
	                }
	            }
	            return b;
	        }

	        function _paintDataPoints(ctx, w, h) {
	            var self = this;
	            var finalSize = {Width: w, Height: h};
	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var cachedIndexMapingCount = cachedIndexMaping.length;
	            var index;
	            var color;
	            var rec;
	            var centerX;
	            var centerY;
	            var newX;
	            var newY;
	            var newWidth;
	            var newHeight;

	            for (var i = 0; i < cachedIndexMapingCount; i++) {
	                index = cachedIndexMaping[i];
	                color = _getDataPointColor.call(self, index);
	                rec = _getDataPointPosition.call(self, index, finalSize);

	                if (ctx.fillStyle !== color) {
	                    ctx.fillStyle = color;
	                }

	                if (self.name === 'LINESPARKLINE') {
	                    ctx.save();
	                    centerX = rec.X + rec.Width / 2;
	                    centerY = rec.Y + rec.Height / 2;
	                    ctx.translate(centerX, centerY);
	                    ctx.rotate(45 * MathPI / 180);
	                    ctx.fillRect(0 - rec.Width / 2, 0 - rec.Height / 2, rec.Width, rec.Height);
	                    ctx.restore();
	                } else {
	                    newX = rec.X + rec.Width / 4;
	                    newX = MathFloor(newX);
	                    newY = rec.Y;
	                    newWidth = rec.Width / 2;
	                    newHeight = rec.Height;
	                    ctx.fillRect(newX, newY, newWidth, newHeight);
	                }
	            }
	        }

	        function _getDataPointColor(indexInValueCache) {
	            //TODO: need to consider theme
	            var self = this;
	            var cachedDatetimes = self.cachedDatetimes;
	            var setting = self.setting;
	            var ret = null;
	            var value = _getValue.call(self, indexInValueCache);
	            var cachedMinValue = self._cachedMinValue;
	            var cachedMaxValue = self._cachedMaxValue;
	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var cachedIndexMapingCount = cachedIndexMaping.length;

	            if (!gcUtils.isUndefinedOrNull(value)) {
	                if (cachedMinValue === Number.MAX_VALUE || cachedMaxValue === -Number.MAX_VALUE) {
	                    _getMaxMinValue.call(self);
	                }
	                var min = cachedMinValue;
	                if (value === min && setting.showLow) {
	                    ret = setting.lowMarkerColor;
	                }

	                if (gcUtils.isUndefinedOrNull(ret)) {
	                    var max = cachedMaxValue;
	                    if (value === max && setting.showHigh) {
	                        ret = setting.highMarkerColor;
	                    }
	                }

	                if (gcUtils.isUndefinedOrNull(ret)) {
	                    if (cachedDatetimes && cachedDatetimes.length) {
	                        var dateIndex1 = cachedIndexMaping.indexOf(indexInValueCache);
	                        if (dateIndex1 === 0 && setting.showFirst) {//first marker.
	                            ret = setting.firstMarkerColor;
	                        }
	                    } else {
	                        if (indexInValueCache === 0 && setting.showFirst) { //first marker.
	                            ret = setting.firstMarkerColor;
	                        }
	                    }
	                }

	                if (gcUtils.isUndefinedOrNull(ret)) {
	                    if (cachedDatetimes && cachedDatetimes.length) {
	                        var dateIndex2 = cachedIndexMaping.indexOf(indexInValueCache);
	                        if (dateIndex2 === cachedIndexMapingCount - 1 && setting.showLast) {
	                            // last marker
	                            ret = setting.lastMarkerColor;
	                        }
	                    } else {
	                        if (indexInValueCache === cachedIndexMapingCount - 1 && setting.showLast) { // last marker
	                            ret = setting.lastMarkerColor;
	                        }
	                    }
	                }

	                if (gcUtils.isUndefinedOrNull(ret)) {
	                    if (value < 0 && setting.showNegative) {
	                        ret = setting.negativeColor;
	                    }
	                }

	                if (gcUtils.isUndefinedOrNull(ret)) {
	                    if (self.name === 'LINESPARKLINE') {
	                        if (setting.showMarkers) {
	                            ret = setting.markersColor;
	                        }
	                    } else if (self.name === 'COLUMNSPARKLINE') {
	                        ret = setting.seriesColor;
	                    } else if (self.name === 'WINLOSSSPARKLINE') {
	                        ret = setting.seriesColor;
	                    }
	                }
	            }

	            if (gcUtils.isUndefinedOrNull(ret)) {
	                return 'Transparent';
	            } else {
	                return ret;
	            }
	        }

	        function _paintLines(context, width, height) {
	            //:calculate the points
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var setting = self.setting;
	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var i;
	            var p1;
	            var p2;
	            var count = cachedIndexMaping.length - 1;

	            if (count < 0) {
	                count = 0;
	            }
	            var linePos = self.linePos = [];
	            var start;
	            var end;
	            var endIndex;
	            var startRec;
	            var endRec;
	            var displayEmptyCellsAs = setting.displayEmptyCellsAs;
	            var d;

	            for (i = 0; i < count; i++) {
	                start = cachedValues[cachedIndexMaping[i]];
	                if (gcUtils.isUndefinedOrNull(start) && displayEmptyCellsAs === EmptyValueStyle.Zero) {
	                    start = 0;
	                }
	                if (!gcUtils.isUndefinedOrNull(start)) {
	                    endIndex = i + 1;
	                    end = cachedValues[cachedIndexMaping[endIndex]];
	                    if (gcUtils.isUndefinedOrNull(end)) {
	                        if (displayEmptyCellsAs === EmptyValueStyle.Zero) {
	                            end = 0;
	                        } else if (displayEmptyCellsAs === EmptyValueStyle.Connect) {
	                            while (gcUtils.isUndefinedOrNull(end) && endIndex <= count) {
	                                endIndex++;
	                                end = cachedValues[cachedIndexMaping[endIndex]];
	                            }
	                        }
	                    }
	                    if (!gcUtils.isUndefinedOrNull(end)) {
	                        startRec = _getDataPointPosition.call(self, cachedIndexMaping[i], {
	                            Width: width,
	                            Height: height
	                        });
	                        endRec = _getDataPointPosition.call(self, cachedIndexMaping[endIndex], {
	                            Width: width,
	                            Height: height
	                        });
	                        d = startRec.Width / 2;
	                        p1 = {X: startRec.X + d, Y: startRec.Y + d};
	                        p2 = {X: endRec.X + d, Y: endRec.Y + d};
	                        linePos[i] = {P1: p1, P2: p2};
	                    }
	                }
	            }
	            //:~end calculate points

	            //: draw the lines.
	            var linePosCount = linePos.length;
	            var line;
	            if (linePosCount > 0) {
	                context.strokeStyle = setting.seriesColor;
	                context.lineCap = 'round';
	                context.lineWidth = _getLineWeight.call(self);
	                for (i = 0; i < linePosCount; i++) {
	                    line = linePos[i];
	                    if (line) {
	                        context.beginPath();
	                        p1 = line.P1;
	                        p2 = line.P2;
	                        context.moveTo(p1.X, p1.Y);
	                        context.lineTo(p2.X, p2.Y);
	                        context.stroke();
	                        context.closePath();
	                    }
	                }
	            }
	        }

	        function _getCachedIndexMaping() {
	            //If exist data axis, sort by time sequence
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var cachedDatetimes = self.cachedDatetimes;
	            if (self._cachedIndexMapping) {
	                return self._cachedIndexMapping;
	            }
	            var cachedIndexMapping = self._cachedIndexMapping = [];
	            var valueCount = cachedValues.length;
	            var i;
	            var v;
	            if (cachedDatetimes && cachedDatetimes.length) { //displayDateAxis or not
	                var dateAxisCount = cachedDatetimes.length;
	                var count = MathMin(valueCount, dateAxisCount);
	                var sorted = [];
	                if (count > 0) {
	                    sorted = cachedDatetimes.slice(0, count);
	                }

	                //then sort them
	                sorted.sort(function(a, b) {
	                    if (a === b) {
	                        return 0;
	                    }
	                    if (isNaN(a)) {
	                        a = 0;
	                    }
	                    if (isNaN(b)) {
	                        b = 0;
	                    }
	                    return a - b;
	                });

	                var sortedCount = sorted.length;
	                var datetime;
	                var valueIndex;
	                for (i = 0; i < sortedCount; i++) {
	                    datetime = sorted[i];
	                    if (!gcUtils.isUndefinedOrNull(datetime)) {
	                        valueIndex = cachedDatetimes.indexOf(datetime);
	                        while (cachedIndexMapping.indexOf(valueIndex) !== -1) {
	                            valueIndex = cachedDatetimes.indexOf(datetime, valueIndex + 1);
	                        }
	                        if (!isNaN(datetime)) {
	                            v = cachedValues[valueIndex];
	                            if (!gcUtils.isUndefinedOrNull(v) && !isNaN(v)) {
	                                cachedIndexMapping.push(valueIndex);
	                            }
	                        }
	                    }
	                }
	            } else {
	                for (i = 0; i < valueCount; i++) {
	                    v = cachedValues[i];
	                    if (!gcUtils.isUndefinedOrNull(v) && !isNaN(v)) {
	                        cachedIndexMapping.push(i);
	                    }
	                }
	            }
	            return cachedIndexMapping;
	        }

	        function _getDataPointPosition(index, availableSize) {
	            var self = this;
	            var lineWeight = _getLineWeight.call(self);
	            lineWeight++;
	            if (lineWeight < 2) {
	                lineWeight = 2;
	            }
	            var rec = _getDataPointPositionNormal.call(self, index, availableSize);
	            if (self.name === 'LINESPARKLINE') {
	                //for line type;
	                rec.X = rec.X + (rec.Width - lineWeight) / 2;

	                var value = _getValue.call(self, index);
	                if (!gcUtils.isUndefinedOrNull(value)) {
	                    if (value >= 0) {
	                        rec.Y -= lineWeight / 2;
	                    } else {
	                        rec.Y = rec.Bottom - lineWeight / 2;
	                    }
	                    rec.Width = lineWeight;
	                    rec.Height = lineWeight;
	                } else {
	                    rec.Width = 0;
	                    rec.Height = 0;
	                }
	            }
	            //if (self.info.group().setting.rightToLeft) {
	            //    var left = rec.X, reverseLeft = availableSize.Width - left, newLeft = reverseLeft - rec.Width;
	            //    rec = new _PositionRect(newLeft, rec.Y, rec.Width, rec.Height);
	            //}
	            return rec;
	        }

	        function _getDataPointPositionNormal(index, availableSize) {
	            var self = this;
	            var itemWidth = _getItemWidth.call(self, availableSize);
	            var x = _getItemX.call(self, availableSize, index);
	            if (itemWidth < 0) {
	                itemWidth = 0;
	            }
	            itemWidth = MathFloor(itemWidth);
	            if (itemWidth % 2 === 1) {
	                itemWidth += 1;
	            }

	            var height = _getItemHeight.call(self, availableSize, index);
	            var axis = _getAxisY.call(self, availableSize);
	            var max = _getActualMaxValue.call(self);
	            var min = _getActualMinValue.call(self);
	            var y = 0;
	            if (max < 0 && min < 0) {
	                y = MathMax(_getSpace.call(self), axis);
	            } else {
	                y = axis;
	                if (height >= 0) {
	                    y = axis - height;
	                }
	            }

	            var visibleHeight = _getItemVisibleHeight.call(self, availableSize, index);
	            var rect = new _PositionRect(x, y, itemWidth, MathAbs(visibleHeight));

	            if (height !== 0) {
	                var topSpace = _getSpace.call(self);
	                if (rect.Y < topSpace && rect.Bottom < topSpace + 1) {
	                    rect.Height = MathFloor(rect.Height + 1);
	                } else {
	                    var bottomLine = availableSize.Height - _getSpace.call(self);
	                    if (rect.Bottom > bottomLine && rect.Y > bottomLine - 1) {
	                        rect.Y = bottomLine - visibleHeight;
	                        rect.Height = visibleHeight;
	                    }
	                }
	            }
	            return rect;
	        }

	        function _getValue(valueIndex) {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var setting = self.setting;
	            var item = cachedValues[valueIndex];
	            if (gcUtils.isUndefinedOrNull(item) && setting.displayEmptyCellsAs === EmptyValueStyle.Zero) {
	                item = 0;
	            }
	            return item;
	        }

	        function _getItemWidth(availableSize) {
	            var self = this;
	            var cachedDatetimes = self.cachedDatetimes;
	            if (cachedDatetimes && cachedDatetimes.length) {
	                return _calcItemWidth.call(self, availableSize);
	            } else {
	                var count = _getCachedIndexMaping.call(self).length;
	                return ((availableSize.Width - _getSpace.call(self) * 2) / count); //left, right space
	            }
	        }

	        function _calcItemWidth(availableSize) {
	            var self = this;
	            var cachedDatetimes = self.cachedDatetimes;
	            var min = _getMinDatetime.call(self);
	            var max = _getMaxDatetime.call(self);
	            var datetimeValues = [];
	            var i;
	            var d;
	            var index;
	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var cachedIndexMapingCount = cachedIndexMaping.length;

	            for (i = 0; i < cachedIndexMapingCount; i++) {
	                index = cachedIndexMaping[i];
	                d = cachedDatetimes[index];
	                if (gcUtils.isUndefinedOrNull(d) || isNaN(d)) {
	                    continue;
	                }
	                if (!d) {
	                    continue;
	                }
	                datetimeValues.push(d);
	            }

	            datetimeValues.sort(function(x, y) {
	                return x - y;
	            });

	            var valueCount = datetimeValues.length;
	            if (valueCount > 1 && min !== max) {
	                var minDValue = Number.MAX_VALUE;
	                var sumD = 0;
	                var oa;
	                for (i = 1; i < valueCount; i++) {
	                    oa = datetimeValues[i];
	                    d = oa - datetimeValues[i - 1];
	                    if (d < minDValue && d > 0) {
	                        minDValue = d;
	                    }
	                    sumD += d;
	                }

	                var width = (availableSize.Width - _getSpace.call(self) * 2) * minDValue / sumD / 2; //left,right space
	                if (width < 2) {
	                    width = 2;
	                }
	                return width;
	            } else {
	                return (availableSize.Width - _getSpace.call(self) * 2) / 2; //left,right space
	            }
	        }

	        function _getMinDatetime() {
	            var self = this;
	            var oldCachedMinDatetime = self._cachedMinDatetime;
	            if (isNaN(oldCachedMinDatetime) || oldCachedMinDatetime === Number.MAX_VALUE) {
	                _getMaxMindatetimes.call(self);
	            }
	            return self._cachedMinDatetime;
	        }

	        function _getMaxDatetime() {
	            var self = this;
	            var oldCachedMaxDatetime = self._cachedMaxDatetime;
	            if (isNaN(oldCachedMaxDatetime) || oldCachedMaxDatetime === -Number.MAX_VALUE) {
	                _getMaxMindatetimes.call(self);
	            }
	            return self._cachedMaxDatetime;
	        }

	        function _getMaxMindatetimes() {
	            var self = this;
	            var cachedDatetimes = self.cachedDatetimes;
	            var maxDatetime = new Date(0, 0, 0);
	            var minDatetime = Number.MAX_VALUE;
	            var cachedIndexMaping = _getCachedIndexMaping.call(self);
	            var cachedIndexMapingCount = cachedIndexMaping.length;
	            var index;
	            var datetime;
	            var v;

	            for (var i = 0; i < cachedIndexMapingCount; i++) {
	                index = cachedIndexMaping[i];
	                datetime = cachedDatetimes[index];
	                if (isNaN(datetime)) {
	                    //for hidden datetimes
	                    continue;
	                }
	                v = _getValue.call(self, index);
	                if (v !== null && gcUtils.isUndefined(v) || isNaN(v)) {
	                    //for hidden values.
	                    continue;
	                }

	                if (gcUtils.isUndefinedOrNull(datetime)) {
	                    continue;
	                }

	                if (datetime > maxDatetime) {
	                    maxDatetime = datetime;
	                }
	                if (datetime < minDatetime) {
	                    minDatetime = datetime;
	                }
	            }
	            self._cachedMaxDatetime = maxDatetime;
	            self._cachedMinDatetime = minDatetime;
	        }

	        function _getSpace() {
	            var self = this;
	            if (self.name === 'LINESPARKLINE') {
	                return 3 + _getLineWeight.call(self) + 1;
	            }
	            return 3;
	        }

	        function _getItemX(availableSize, index) {
	            var self = this;
	            var cachedDatetimes = self.cachedDatetimes;
	            var itemWidth;
	            var leftSpace = _getSpace.call(self);
	            if (cachedDatetimes && cachedDatetimes.length) {
	                itemWidth = _getItemWidth.call(self, availableSize);

	                var max = _getMaxDatetime.call(self);
	                var min = _getMinDatetime.call(self);
	                if (max === min) {
	                    return leftSpace + itemWidth / 2;
	                }
	                var datetime = cachedDatetimes[index];
	                if (!datetime) {
	                    return 0;
	                }
	                // -itemWidth;// -itemWidth;
	                var canvasWidth = availableSize.Width - leftSpace * 2;

	                canvasWidth -= itemWidth;// minus for the last item's width

	                var range = (max - min);
	                return leftSpace + MathFloor(((datetime - min) / range) * canvasWidth);

	            } else {
	                itemWidth = _getItemWidth.call(self, availableSize);
	                var valueIndex = _getCachedIndexMaping.call(self).indexOf(index);
	                var x = leftSpace + itemWidth * valueIndex;
	                return MathFloor(x);
	            }
	        }

	        function _getItemHeight(availableSize, index) {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var setting = self.setting;
	            var value;

	            if (self.name === 'LINESPARKLINE') {
	                return _getItemHeightNormal.call(self, availableSize, index);
	            } else if (self.name === 'COLUMNSPARKLINE') {
	                value = cachedValues[index];
	                if (gcUtils.isUndefinedOrNull(value)) {
	                    if (setting.displayEmptyCellsAs === EmptyValueStyle.Zero) {
	                        return 0;
	                    }
	                }
	                var h = _getItemHeightNormal.call(self, availableSize, index);
	                if (h > -self._minItemHeight && h < self._minItemHeight) {
	                    if (value > 0) {
	                        return h + self._minItemHeight;
	                    } else if (value < 0) {
	                        return h - self._minItemHeight;
	                    }
	                }
	                return h;
	            } else if (self.name === 'WINLOSSSPARKLINE') {
	                value = cachedValues[index];
	                if (gcUtils.isUndefinedOrNull(value) || value === 0 || isNaN(value)) {
	                    return 0;
	                }
	                var size = _getCanvasSize.call(self, availableSize);
	                if (value >= 0) {
	                    return size.Height / 2;
	                } else {
	                    return -size.Height / 2;
	                }
	            }
	        }

	        function _getItemHeightNormal(availableSize, index) {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var size = _getCanvasSize.call(self, availableSize);
	            var max = _getActualMaxValue.call(self);
	            var min = _getActualMinValue.call(self);
	            var range = max - min;
	            var value;
	            var d;

	            if (max === min) {
	                if (max === 0) {
	                    return 0;
	                }
	                range = MathAbs(max);
	            }

	            value = cachedValues[index];
	            if (!value) {
	                value = 0;
	            }
	            d = size.Height / range;

	            return (value) * d;
	        }

	        function _getCanvasSize(availableSize) {
	            var self = this;
	            var space = _getSpace.call(self);
	            var w = availableSize.Width - space * 2;
	            w = MathMax(w, 0);
	            var h = availableSize.Height - space * 2;
	            h = MathMax(h, 0);
	            return {Width: w, Height: h};
	        }

	        function _getActualMaxValue() {
	            var self = this;
	            var setting = self.setting;
	            if (self._cachedMaxValue === -Number.MAX_VALUE || !self._cachedMaxValue) {
	                _getMaxMinValue.call(self);
	            }
	            var maxAxisType = setting.maxAxisType;
	            if (maxAxisType === SparklineAxisMinMax.individual) {
	                return self._cachedMaxValue;
	            } else if (maxAxisType === SparklineAxisMinMax.group) {
	                return setting.groupMaxValue;
	            } else if (maxAxisType === SparklineAxisMinMax.custom) {
	                return setting.manualMax;
	            }
	            return self._cachedMaxValue;
	        }

	        function _getActualMinValue() {
	            var self = this;
	            var setting = self.setting;
	            if (self._cachedMinValue === Number.MAX_VALUE || !self._cachedMinValue) {
	                _getMaxMinValue.call(self);
	            }
	            var maxAxisType = setting.minAxisType;
	            if (maxAxisType === SparklineAxisMinMax.individual) {
	                return self._cachedMinValue;
	            } else if (maxAxisType === SparklineAxisMinMax.group) {
	                return setting.groupMinValue;
	            } else if (maxAxisType === SparklineAxisMinMax.custom) {
	                return setting.manualMin;
	            }
	        }

	        function _getMaxMinValue() {
	            var self = this;
	            var cachedValues = self.cachedValues;
	            var valueCount = cachedValues.length;
	            var item;

	            for (var i = 0; i < valueCount; i++) {
	                item = cachedValues[i];
	                if (!gcUtils.isUndefinedOrNull(item)) {
	                    if (!gcUtils.isNumber(item)) {
	                        item = 0;
	                    }
	                    if (item < self._cachedMinValue) {
	                        self._cachedMinValue = item;
	                    }
	                    if (item > self._cachedMaxValue) {
	                        self._cachedMaxValue = item;
	                    }
	                }
	            }
	        }

	        function _getItemVisibleHeightNormal(availableSize, index) {
	            var self = this;
	            var size = _getCanvasSize.call(self, availableSize);
	            var max = _getActualMaxValue.call(self);
	            var min = _getActualMinValue.call(self);

	            var range = max - min;
	            var d;
	            var value;

	            if (max === min) {
	                if (max === 0) {
	                    return 0;
	                }
	                range = max;
	            }

	            d = size.Height / range;
	            value = _getValue.call(self, index);
	            if (gcUtils.isUndefinedOrNull(value)) {
	                value = 0;
	            }

	            if (max !== min && max * min > 0) {
	                var visibleHeight = 0;
	                if (value >= 0) {
	                    visibleHeight = (value - min) * d;
	                } else {
	                    visibleHeight = (value - max) * d;
	                }
	                return visibleHeight;
	            } else {
	                return (value) * d;
	            }
	        }

	        function _getItemVisibleHeight(availableSize, index) {
	            var self = this;
	            if (self.name === 'LINESPARKLINE') {
	                return _getItemVisibleHeightNormal.call(self, availableSize, index);
	            } else if (self.name === 'COLUMNSPARKLINE') {
	                var h = _getItemVisibleHeightNormal.call(self, availableSize, index);
	                var minItemHeight = self._minItemHeight;

	                if (h > -minItemHeight && h < minItemHeight) {
	                    var value = _getValue.call(self, index);
	                    if (gcUtils.isUndefinedOrNull(value)) {
	                        value = 0;
	                    }
	                    if (value !== 0) {
	                        if (value > 0) {
	                            return h + minItemHeight;
	                        } else {
	                            return h - minItemHeight;
	                        }
	                    }
	                }
	                return h;
	            } else if (self.name === 'WINLOSSSPARKLINE') {
	                return _getItemHeight.call(self, availableSize, index);
	            }
	        }

	        function _clearCache() {
	            var self = this;
	            self._cachedMinDatetime = Number.MAX_VALUE;
	            self._cachedMaxDatetime = -Number.MAX_VALUE;

	            self._cachedMinValue = Number.MAX_VALUE;
	            self._cachedMaxValue = -Number.MAX_VALUE;

	            self._cachedIndexMapping = null;
	            self.cachedValues = null;
	            self.cachedDatetimes = null;

	            self._minItemHeight = 2;
	        }

	        function _getLineWeight() {
	            var self = this;
	            var setting = self.setting;
	            var lineWeight = setting.lineWeight * 1; //TODO:zoomFactor

	            if (lineWeight < 1) {
	                lineWeight = 1;
	            }
	            return lineWeight;
	        }

	        return CompatibleSparkline;
	    })(SparklineEx);

	    var LineSparkline = (function(super_) {
	        function LineSparkline(args) {
	            var self = this;
	            self.name = 'LINESPARKLINE';
	            self.args = args;
	            super_.call(self);
	        }

	        extends_(LineSparkline, super_);

	        return LineSparkline;
	    })(CompatibleSparkline);

	    var ColumnSparkline = (function(super_) {
	        function ColumnSparkline(args) {
	            var self = this;
	            self.name = 'COLUMNSPARKLINE';
	            self.args = args;
	            super_.call(self);
	        }

	        extends_(ColumnSparkline, super_);

	        return ColumnSparkline;
	    })(CompatibleSparkline);

	    var WinlossSparkline = (function(super_) {
	        function WinlossSparkline(args) {
	            var self = this;
	            self.name = 'WINLOSSSPARKLINE';
	            self.args = args;
	            super_.call(self);
	        }

	        extends_(WinlossSparkline, super_);

	        return WinlossSparkline;
	    })(CompatibleSparkline);

	    function spCompatibleSparkline(args, context) {
	        var data = getAllValuesFromReference(args[1], context);
	        if (data.length) {
	            var dateAxis = getAllValuesFromReference(args[2], context);
	            var jsonSetting = args[3];
	            var setting = new CompatibleSparklineSetting();
	            if (jsonSetting) {
	                var obj = parseSetting(jsonSetting);
	                var actualProp;
	                var prop;
	                var dict = {
	                    AXISCOLOR: 'axisColor',
	                    FIRSTMARKERCOLOR: 'firstMarkerColor',
	                    HIGHMARKERCOLOR: 'highMarkerColor',
	                    LASTMARKERCOLOR: 'lastMarkerColor',
	                    LOWMARKERCOLOR: 'lowMarkerColor',
	                    MARKERSCOLOR: 'markersColor',
	                    NEGATIVECOLOR: 'negativeColor',
	                    SERIESCOLOR: 'seriesColor',
	                    DISPLAYEMPTYCELLSAS: 'displayEmptyCellsAs',
	                    RIGHTTOLEFT: 'rightToLeft',
	                    DISPLAYXAXIS: 'displayXAxis',
	                    SHOWFIRST: 'showFirst',
	                    SHOWHIGH: 'showHigh',
	                    SHOWLAST: 'showLast',
	                    SHOWLOW: 'showLow',
	                    SHOWNEGATIVE: 'showNegative',
	                    SHOWMARKERS: 'showMarkers',
	                    MANUALMAX: 'manualMax',
	                    MANUALMIN: 'manualMin',
	                    MAXAXISTYPE: 'maxAxisType',
	                    MINAXISTYPE: 'minAxisType',
	                    LINEWEIGHT: 'lineWeight'
	                };
	                for (prop in obj) {
	                    if (prop) {
	                        actualProp = dict[prop.toUpperCase()];
	                        if (actualProp) {
	                            setting[actualProp] = obj[prop];
	                        }
	                    }
	                }
	                var shortDict = {
	                    AC: 'axisColor',
	                    FMC: 'firstMarkerColor',
	                    HMC: 'highMarkerColor',
	                    LASTMC: 'lastMarkerColor',
	                    LOWMC: 'lowMarkerColor',
	                    MC: 'markersColor',
	                    NC: 'negativeColor',
	                    SC: 'seriesColor',
	                    DECA: 'displayEmptyCellsAs',
	                    RTL: 'rightToLeft',
	                    DXA: 'displayXAxis',
	                    SF: 'showFirst',
	                    SH: 'showHigh',
	                    SLAST: 'showLast',
	                    SLOW: 'showLow',
	                    SN: 'showNegative',
	                    SM: 'showMarkers',
	                    MMAX: 'manualMax',
	                    MMIN: 'manualMin',
	                    MAXAT: 'maxAxisType',
	                    MINAT: 'minAxisType',
	                    LW: 'lineWeight'
	                };
	                for (prop in obj) {
	                    if (prop) {
	                        actualProp = shortDict[prop.toUpperCase()];
	                        if (actualProp) {
	                            setting[actualProp] = obj[prop];
	                        }
	                    }
	                }
	                if (setting.maxAxisType === SparklineAxisMinMax.group) {
	                    setting.maxAxisType = SparklineAxisMinMax.individual;
	                }
	                if (setting.minAxisType === SparklineAxisMinMax.group) {
	                    setting.minAxisType = SparklineAxisMinMax.individual;
	                }
	                setting.rightToLeft = !!setting.rightToLeft;
	                setting.displayXAxis = !!setting.displayXAxis;
	                setting.showFirst = !!setting.showFirst;
	                setting.showHigh = !!setting.showHigh;
	                setting.showLast = !!setting.showLast;
	                setting.showLow = !!setting.showLow;
	                setting.showNegative = !!setting.showNegative;
	                setting.showMarkers = !!setting.showMarkers;
	            }

	            var params = {
	                values: data,
	                dates: dateAxis,
	                setting: setting
	            };

	            if (this.name === 'LINESPARKLINE') {
	                return new LineSparkline(params);
	            } else if (this.name === 'COLUMNSPARKLINE') {
	                return new ColumnSparkline(params);
	            } else {
	                return new WinlossSparkline(params);
	            }
	        }
	        return null;
	    }

	    function spPiesparkline(args, context) {
	        return new PieSparkline({
	            values: getAllValuesFromReference(args[1], context),
	            colors: args.slice(2)
	        });
	    }

	    var defineCustomFn = Calc.Functions.defineCustomFunction;

	    defineCustomFn('PIESPARKLINE', spPiesparkline, {
	        minArgs: 1,
	        tableArgIndex: Calc.Functions.firstTableArgIndex
	    });

	    defineCustomFn('LINESPARKLINE', spCompatibleSparkline, {
	        minArgs: 1,
	        tableArgIndex: Calc.Functions.firstTableArgIndex
	    });

	    defineCustomFn('COLUMNSPARKLINE', spCompatibleSparkline, {
	        minArgs: 1,
	        tableArgIndex: Calc.Functions.firstTableArgIndex
	    });

	    defineCustomFn('WINLOSSSPARKLINE', spCompatibleSparkline, {
	        minArgs: 1,
	        tableArgIndex: Calc.Functions.firstTableArgIndex
	    });

	    module.exports = {
	        BaseSparkline: SparklineEx,
	        PieSparkline: PieSparkline,
	        LineSparkline: LineSparkline,
	        ColumnSparkline: ColumnSparkline,
	        WinlossSparkline: WinlossSparkline
	    };
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';

	    var gcUtils = __webpack_require__(3);

	    var domUtil = {};

	    /**
	     * Creates an element from an HTML string.
	     *
	     * @param html HTML fragment to convert into an HTMLElement.
	     * @return The new element.
	     */

	    //remove all comments and whitespace only text nodes
	    function clean(node) {
	        if (node && node.childNodes) {
	            for (var n = 0; n < node.childNodes.length; n++) { //do rewrite it to for(var n=0,len=XXX;i<len;)
	                var child = node.childNodes[n];
	                if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
	                    node.removeChild(child);
	                    n--;
	                } else if (child.nodeType === 1) {
	                    clean(child);
	                }
	            }
	        }
	    }

	    domUtil.createElement = function(html) {
	        var div = document.createElement('div');
	        div.innerHTML = html;
	        var r = div.children[0];
	        div = null;
	        return r;
	    };

	    domUtil.createTemplateElement = function(html) {
	        var div = document.createElement('div');
	        div.innerHTML = html;
	        var r = div.children[0];
	        clean(r);
	        return div;
	    };

	    domUtil.getElementInnerText = function(element) {
	        return element.innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	    };

	    domUtil.getElementOuterText = function(element) {
	        return element.outerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	    };

	    /**
	     * Checks whether an element has a class.
	     *
	     * @param {Element} e Element to check.
	     * @param {string} className Class to check for.
	     */
	    domUtil.hasClass = function(e, className) {
	        // note: using e.getAttribute('class') instead of e.classNames
	        // so this works with SVG as well as regular HTML elements.
	        if (e && e.getAttribute) {
	            var rx = new RegExp('\\b' + className + '\\b');
	            return e && rx.test(e.getAttribute('class'));
	        }
	        return false;
	    };

	    /**
	     * Removes a class from an element.
	     *
	     * @param {Element} e Element that will have the class removed.
	     * @param {string} className Class to remove form the element.
	     */
	    domUtil.removeClass = function(e, className) {
	        // note: using e.getAttribute('class') instead of e.classNames
	        // so this works with SVG as well as regular HTML elements.
	        if (e && e.setAttribute && domUtil.hasClass(e, className)) {
	            var rx = new RegExp('\\s?\\b' + className + '\\b', 'g');
	            var cn = e.getAttribute('class');
	            e.setAttribute('class', cn.replace(rx, ''));
	        }
	    };

	    /**
	     * Adds a class to an element.
	     *
	     * @param {Element} e Element that will have the class added.
	     * @param {string} className Class to add to the element.
	     */
	    domUtil.addClass = function(e, className) {
	        // note: using e.getAttribute('class') instead of e.classNames
	        // so this works with SVG as well as regular HTML elements.
	        if (e && e.setAttribute && !domUtil.hasClass(e, className)) {
	            var cn = e.getAttribute('class');
	            e.setAttribute('class', cn ? cn + ' ' + className : className);
	        }
	    };

	    /**
	     * Adds or removes a class to or from an element.
	     *
	     * @param {Element} e Element that will have the class added.
	     * @param {string} className Class to add or remove.
	     * @param {boolean} addOrRemove Whether to add or remove the class.
	     */
	    domUtil.toggleClass = function(e, className, addOrRemove) {
	        if (addOrRemove === true) {
	            domUtil.addClass(e, className);
	        } else {
	            domUtil.removeClass(e, className);
	        }
	    };

	    // ** jQuery replacement methods
	    /**
	     * Gets an element from a jQuery-style selector.
	     *
	     * @param {Element|string} selector An element, a selector string, or a jQuery object.
	     */
	    domUtil.getElement = function(selector) {
	        if (selector instanceof HTMLElement) {
	            return selector;
	        }
	        if (gcUtils.isString(selector)) {
	            return document.querySelector(selector);
	        }
	        return null;
	    };

	    /**
	     * Checks whether an HTML element contains another.
	     *
	     * @param {Element} parent Parent element.
	     * @param {Element} child Child element.
	     * @return {boolean} True if the parent element contains the child element.
	     */
	    domUtil.contains = function(parent, child) {
	        for (var e = child; e; e = e.parentElement) {
	            if (e === parent) {
	                return true;
	            }
	        }
	        return false;
	    };

	    /**
	     * Gets the current coordinates of element.
	     * @param {Element} element
	     */
	    domUtil.offset = function(element) {
	        var rect = element.getBoundingClientRect();
	        return {
	            top: rect.top + element.scrollTop + window.pageYOffset,
	            left: rect.left + element.scrollLeft + window.pageXOffset
	        };
	    };

	    /**
	     * Gets the bounding rectangle of an element in page coordinates.
	     *
	     * This is similar to the <b>getBoundingClientRect</b> function,
	     * except that uses window coordinates, which change when the
	     * document scrolls.
	     */
	    domUtil.getElementRect = function(e) {
	        var rc = e.getBoundingClientRect();
	        return {
	            left: rc.left + window.pageXOffset,
	            top: rc.top + window.pageYOffset,
	            width: rc.width,
	            height: rc.height
	        };
	    };

	    /**
	     * Get the inner content rectangle of input element.
	     * Padding and box-sizing is considered.
	     * The result is the actual rectangle to place child element.
	     * @param e represent the element
	     */
	    domUtil.getContentRect = function(e) {
	        var rc = e.getBoundingClientRect();
	        var style = this.getStyle(e);
	        var measurements = [
	            'paddingLeft',
	            'paddingRight',
	            'paddingTop',
	            'paddingBottom',
	            'borderLeftWidth',
	            'borderRightWidth',
	            'borderTopWidth',
	            'borderBottomWidth'
	        ];
	        var size = {};
	        measurements.forEach(function(prop) {
	            var num = parseFloat(style[prop]);
	            size[prop] = !isNaN(num) ? num : 0;
	        });
	        var paddingWidth = size.paddingLeft + size.paddingRight;
	        var paddingHeight = size.paddingTop + size.paddingBottom;
	        var borderWidth = size.borderLeftWidth + size.borderRightWidth;
	        var borderHeight = size.borderTopWidth + size.borderBottomWidth;
	        return {
	            left: rc.left + window.pageXOffset + size.borderLeftWidth + size.paddingLeft,
	            top: rc.top + window.pageYOffset + size.borderTopWidth + size.paddingTop,
	            width: rc.width - paddingWidth - borderWidth,
	            height: rc.height - paddingHeight - borderHeight
	        };
	    };

	    /**
	     * Modifies the style of an element by applying the properties specified in an object.
	     *
	     * @param {Element} e Element whose style will be modified.
	     * @param {Object} css Object containing the style properties to apply to the element.
	     */
	    domUtil.setCss = function(e, css) {
	        var s = e.style;
	        for (var p in css) {
	            var val = css[p];
	            if (gcUtils.isNumber(val)) {
	                if (p.match(/width|height|left|top|right|bottom|size|padding|margin'/i)) {
	                    val += 'px'; // default unit for geometry properties
	                }
	            }
	            s[p] = val.toString();
	        }
	    };

	    domUtil.getScrollbarSize = function() {
	        if (domUtil.scrollbarSize) {
	            return domUtil.scrollbarSize;
	        }

	        var div = domUtil.createElement('<div style="position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;"></div>');
	        document.body.appendChild(div);
	        domUtil.scrollbarSize = {
	            width: div.offsetWidth - div.clientWidth,
	            height: div.offsetHeight - div.clientHeight
	        };
	        div.parentNode.removeChild(div);

	        return domUtil.scrollbarSize;
	    };

	    domUtil.getStyle = function(element) {
	        var fn = getComputedStyle || window.getComputedStyle;
	        if (element && fn) {
	            return fn(element, null);
	        }
	        return null;
	    };

	    domUtil.getStyleValue = function(element, styleProperty) {
	        var style = domUtil.getStyle(element);
	        return style ? style.getPropertyValue(styleProperty) : null;
	    };

	    domUtil.GetMaxSupportedCSSHeight = function() {
	        if (domUtil.maxSupportedCSSHeight) {
	            return domUtil.maxSupportedCSSHeight;
	        }

	        var h = 1000000;
	        var testUpTo = 6000000 * 1000;
	        var div = domUtil.createElement('<div style="display:none"/>');
	        var test;
	        document.body.appendChild(div);
	        while (true) {
	            test = h + 500000; //* 2;
	            div.style.height = test + 'px';
	            if (test > testUpTo || div.offsetHeight !== test) {
	                break;
	            }
	            h = test;
	        }
	        div.parentNode.removeChild(div);
	        domUtil.maxSupportedCSSHeight = h;
	        return domUtil.maxSupportedCSSHeight;
	    };

	    module.exports = domUtil;
	}());


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	    var UNDEFINED = 'undefined';
	    var gcUtils = {};

	    function checkType(val, type) {
	        return typeof(val) === type;
	    }

	    /**
	     * Casts a value to a type if possible.
	     *
	     * @param value Value to cast.
	     * @param type Type or interface name to cast to.
	     * @return The value passed in if the cast was successful, null otherwise.
	     */
	    function tryCast(value, type) {
	        // null doesn't implement anything
	        if (isUndefinedOrNull(value)) {
	            return null;
	        }

	        // test for interface implementation (IQueryInterface)
	        if (isString(type)) {
	            return isFunction(value.implementsInterface) && value.implementsInterface(type) ? value : null;
	        }

	        // regular type test
	        return value instanceof type ? value : null;
	    }

	    gcUtils.tryCast = tryCast;

	    /**
	     * Determines whether an object is a primitive type (string, number, boolean, or date).
	     *
	     * @param value Value to test.
	     */
	    function isPrimitive(value) {
	        return isString(value) || isNumber(value) || isBoolean(value) || isDate(value);
	    }

	    gcUtils.isPrimitive = isPrimitive;

	    /**
	     * Determines whether an object is a string.
	     *
	     * @param value Value to test.
	     */
	    function isString(value) {
	        return checkType(value, 'string');
	    }

	    gcUtils.isString = isString;

	    /**
	     * Determines whether a string is null, empty, or whitespace only.
	     *
	     * @param value Value to test.
	     */
	    function isUndefinedOrNullOrWhiteSpace(value) {
	        return isUndefinedOrNull(value) ? true : value.replace(/\s/g, '').length < 1;
	    }

	    gcUtils.isUndefinedOrNullOrWhiteSpace = isUndefinedOrNullOrWhiteSpace;

	    /**
	     * Determines whether an object is a number.
	     *
	     * @param value Value to test.
	     */
	    function isNumber(value) {
	        return checkType(value, 'number');
	    }

	    gcUtils.isNumber = isNumber;

	    /**
	     * Determines whether an object is an integer.
	     *
	     * @param value Value to test.
	     */
	    function isInt(value) {
	        return isNumber(value) && value === Math.round(value);
	    }

	    gcUtils.isInt = isInt;

	    /**
	     * Determines whether an object is a Boolean.
	     *
	     * @param value Value to test.
	     */
	    function isBoolean(value) {
	        return checkType(value, 'boolean');
	    }

	    gcUtils.isBoolean = isBoolean;

	    /**
	     * Determines whether an object is a function.
	     *
	     * @param value Value to test.
	     */
	    function isFunction(value) {
	        return checkType(value, 'function');
	    }

	    gcUtils.isFunction = isFunction;

	    /**
	     * Determines whether an object is undefined.
	     *
	     * @param value Value to test.
	     */
	    function isUndefined(value) {
	        return checkType(value, UNDEFINED);
	    }

	    gcUtils.isUndefined = isUndefined;

	    /**
	     * Determines whether an object is a Date.
	     *
	     * @param value Value to test.
	     */
	    function isDate(value) {
	        return value instanceof Date && !isNaN(value.getTime());
	    }

	    gcUtils.isDate = isDate;

	    /**
	     * Determines whether an object is an Array.
	     *
	     * @param value Value to test.
	     */
	    function isArray(value) {
	        return value instanceof Array;
	    }

	    gcUtils.isArray = isArray;

	    /**
	     * Determines whether an object is an object (as opposed to a value type or a date).
	     *
	     * @param value Value to test.
	     */
	    function isObject(value) {
	        return !isUndefinedOrNull(value) && typeof value === 'object' && !isDate(value);
	    }

	    gcUtils.isObject = isObject;

	    /**
	     * Gets the type of a value.
	     *
	     * @param value Value to test.
	     * @return A @see:DataType value representing the type of the value passed in.
	     */
	    function getType(value) {
	        if (isNumber(value)) {
	            return 'number';
	        }

	        if (isBoolean(value)) {
	            return 'boolean';
	        }
	        if (isDate(value)) {
	            return 'date';
	        }
	        if (isString(value)) {
	            return 'string';
	        }
	        if (isArray(value)) {
	            return 'array';
	        }
	        if (isObject(value)) {
	            return 'object';
	        }
	        return '';
	    }

	    gcUtils.getType = getType;

	    function isNull(value) {
	        return value === null;
	    }

	    function isUndefinedOrNull(value) {
	        return isUndefined(value) || isNull(value);
	    }

	    gcUtils.isNull = isNull;
	    gcUtils.isUndefinedOrNull = isUndefinedOrNull;

	    //TODO: review this method after formmtter implementation done.
	    /**
	     * Changes the type of a value.
	     *
	     * If the conversion fails, the original value is returned. To check if a
	     * conversion succeeded, you should check the type of the returned value.
	     *
	     * @param value Value to convert.
	     * @param type @see:DataType to convert the value to.
	     * @return The converted value, or the original value if a conversion was not possible.
	     */
	    function changeType(value, type) {
	        if (!isUndefinedOrNull(value)) {
	            type = type.toLowerCase();
	            // convert strings to numbers, dates, or booleans
	            if (isString(value)) {
	                switch (type) {
	                    case 'number':
	                        var num = parseFloat(value);
	                        return isNaN(num) ? value : num;
	                    case 'date':
	                        return new Date(value);
	                    case 'boolean':
	                        return value.toLowerCase() === 'true';
	                }
	            }

	            // convert anything to string
	            if (type === 'string') {
	                return value.toString();
	            }
	        }

	        return value;
	    }

	    gcUtils.changeType = changeType;
	    //
	    ///**
	    // * Replaces each format item in a specified string with the text equivalent of an
	    // * object's value.
	    // *
	    // * The function works by replacing parts of the <b>formatString</b> with the pattern
	    // * '{name:format}' with properties of the <b>data</b> parameter. For example:
	    // *
	    // * <pre>
	    // * var data = { name: 'Joe', amount: 123456 };
	    // * var msg = wijmo.format('Hello {name}, you won {amount:n2}!', data);
	    // * </pre>
	    // *
	    // * The optional <b>formatFunction</b> allows you to customize the content by providing
	    // * context-sensitive formatting. If provided, the format function gets called for each
	    // * format element and gets passed the data object, the parameter name, the format,
	    // * and the value; it should return an output string. For example:
	    // *
	    // * <pre>
	    // * var data = { name: 'Joe', amount: 123456 };
	    // * var msg = wijmo.format('Hello {name}, you won {amount:n2}!', data,
	    // *             function (data, name, fmt, val) {
	    //*               if (wijmo.isString(data[name])) {
	    //*                   val = wijmo.escapeHtml(data[name]);
	    //*               }
	    //*               return val;
	    //*             });
	    // * </pre>
	    // *
	    // * @param format A composite format string.
	    // * @param data The data object used to build the string.
	    // * @param formatFunction An optional function used to format items in context.
	    // * @return The formatted string.
	    // */
	    //function format(format, data, formatFunction) {
	    //    format = asString(format);
	    //    return format.replace(/\{(.*?)(:(.*?))?\}/g, function (match, name, x, fmt) {
	    //        var val = match;
	    //        if (name && name[0] != '{' && data) {
	    //            // get the value
	    //            val = data[name];
	    //
	    //            // apply static format
	    //            if (fmt) {
	    //                val = wijmo.Globalize.format(val, fmt);
	    //            }
	    //
	    //            // apply format function
	    //            if (formatFunction) {
	    //                val = formatFunction(data, name, fmt, val);
	    //            }
	    //        }
	    //        return val == null ? '' : val;
	    //    });
	    //}
	    //gcUtils.format = format;

	    /**
	     * Clamps a value between a minimum and a maximum.
	     *
	     * @param value Original value.
	     * @param min Minimum allowed value.
	     * @param max Maximum allowed value.
	     */
	    function clamp(value, min, max) {
	        if (!isUndefinedOrNull(value)) {
	            if (!isUndefinedOrNull(max) && value > max) {
	                value = max;
	            }
	            if (!isUndefinedOrNull(min) && value < min) {
	                value = min;
	            }
	        }
	        return value;
	    }

	    gcUtils.clamp = clamp;

	    /**
	     * Copies the properties from an object to another.
	     *
	     * The destination object must define all the properties defined in the source,
	     * or an error will be thrown.
	     *
	     * @param dst The destination object.
	     * @param src The source object.
	     */
	    function copy(dst, src) {
	        for (var key in src) {
	            assert(key in dst, 'Unknown key "' + key + '".');
	            var value = src[key];
	            if (!dst._copy || !dst._copy(key, value)) {
	                if (isObject(value) && dst[key]) {
	                    copy(dst[key], value); // copy sub-objects
	                } else {
	                    dst[key] = value; // assign values
	                }
	            }
	        }
	    }

	    gcUtils.copy = copy;

	    /**
	     * Throws an exception if a condition is false.
	     *
	     * @param condition Condition expected to be true.
	     * @param msg Message of the exception if the condition is not true.
	     */
	    function assert(condition, msg) {
	        if (!condition) {
	            throw '** Assertion failed in Wijmo: ' + msg;
	        }
	    }

	    gcUtils.assert = assert;

	    /**
	     * Asserts that a value is a string.
	     *
	     * @param value Value supposed to be a string.
	     * @param nullOK Whether null values are acceptable.
	     * @return The string passed in.
	     */
	    function asString(value, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = true;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isString(value), 'String expected.');
	        return value;
	    }

	    gcUtils.asString = asString;

	    /**
	     * Asserts that a value is a number.
	     *
	     * @param value Value supposed to be numeric.
	     * @param nullOK Whether null values are acceptable.
	     * @param positive Whether to accept only positive numeric values.
	     * @return The number passed in.
	     */
	    function asNumber(value, nullOK, positive) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        if (checkType(positive, UNDEFINED)) {
	            positive = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isNumber(value), 'Number expected.');
	        if (positive && value && value < 0) {
	            throw 'Positive number expected.';
	        }
	        return value;
	    }

	    gcUtils.asNumber = asNumber;

	    /**
	     * Asserts that a value is an integer.
	     *
	     * @param value Value supposed to be an integer.
	     * @param nullOK Whether null values are acceptable.
	     * @param positive Whether to accept only positive integers.
	     * @return The number passed in.
	     */
	    function asInt(value, nullOK, positive) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        if (checkType(positive, UNDEFINED)) {
	            positive = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isInt(value), 'Integer expected.');
	        if (positive && value && value < 0) {
	            throw 'Positive integer expected.';
	        }
	        return value;
	    }

	    gcUtils.asInt = asInt;

	    /**
	     * Asserts that a value is a Boolean.
	     *
	     * @param value Value supposed to be Boolean.
	     * @param nullOK Whether null values are acceptable.
	     * @return The Boolean passed in.
	     */
	    function asBoolean(value, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isBoolean(value), 'Boolean expected.');
	        return value;
	    }

	    gcUtils.asBoolean = asBoolean;

	    /**
	     * Asserts that a value is a Date.
	     *
	     * @param value Value supposed to be a Date.
	     * @param nullOK Whether null values are acceptable.
	     * @return The Date passed in.
	     */
	    function asDate(value, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isDate(value), 'Date expected.');
	        return value;
	    }

	    gcUtils.asDate = asDate;

	    /**
	     * Asserts that a value is a function.
	     *
	     * @param value Value supposed to be a function.
	     * @param nullOK Whether null values are acceptable.
	     * @return The function passed in.
	     */
	    function asFunction(value, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isFunction(value), 'Function expected.');
	        return value;
	    }

	    gcUtils.asFunction = asFunction;

	    /**
	     * Asserts that a value is an array.
	     *
	     * @param value Value supposed to be an array.
	     * @param nullOK Whether null values are acceptable.
	     * @return The array passed in.
	     */
	    function asArray(value, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || isArray(value), 'Array expected.');
	        return value;
	    }

	    gcUtils.asArray = asArray;

	    /**
	     * Asserts that a value is an instance of a given type.
	     *
	     * @param value Value to be checked.
	     * @param type Type of value expected.
	     * @param nullOK Whether null values are acceptable.
	     * @return The value passed in.
	     */
	    function asType(value, type, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        assert((nullOK && isUndefinedOrNull(value)) || value instanceof type, type + ' expected.');
	        return value;
	    }

	    gcUtils.asType = asType;

	    /**
	     * Asserts that a value is a valid setting for an enumeration.
	     *
	     * @param value Value supposed to be a member of the enumeration.
	     * @param enumType Enumeration to test for.
	     * @param nullOK Whether null values are acceptable.
	     * @return The value passed in.
	     */
	    function asEnum(value, enumType, nullOK) {
	        if (checkType(nullOK, UNDEFINED)) {
	            nullOK = false;
	        }
	        if (isUndefinedOrNull(value) && nullOK) {
	            return null;
	        }
	        var e = enumType[value];
	        assert(!isUndefinedOrNull(e), 'Invalid enum value.');
	        return isNumber(e) ? e : value;
	    }

	    gcUtils.asEnum = asEnum;

	    /**
	     * Enumeration with key values.
	     *
	     * This enumeration is useful when handling <b>keyDown</b> events.
	     */
	    var Key = {
	        /** The backspace key. */
	        Back: 8,
	        /** The tab key. */
	        Tab: 9,
	        /** The enter key. */
	        Enter: 13,
	        /** The escape key. */
	        Escape: 27,
	        /** The space key. */
	        Space: 32,
	        /** The page up key. */
	        PageUp: 33,
	        /** The page down key. */
	        PageDown: 34,
	        /** The end key. */
	        End: 35,
	        /** The home key. */
	        Home: 36,
	        /** The left arrow key. */
	        Left: 37,
	        /** The up arrow key. */
	        Up: 38,
	        /** The right arrow key. */
	        Right: 39,
	        /** The down arrow key. */
	        Down: 40,
	        /** The delete key. */
	        Delete: 46,
	        /** The F1 key. */
	        F1: 112,
	        /** The F2 key. */
	        F2: 113,
	        /** The F3 key. */
	        F3: 114,
	        /** The F4 key. */
	        F4: 115,
	        /** The F5 key. */
	        F5: 116,
	        /** The F6 key. */
	        F6: 117,
	        /** The F7 key. */
	        F7: 118,
	        /** The F8 key. */
	        F8: 119,
	        /** The F9 key. */
	        F9: 120,
	        /** The F10 key. */
	        F10: 121,
	        /** The F11 key. */
	        F11: 122,
	        /** The F12 key. */
	        F12: 123
	    };
	    gcUtils.Key = Key;

	    var EditorType = {
	        'Text': 'text',
	        'CheckBox': 'checkbox',
	        'Date': 'date',
	        'Color': 'color',
	        'Number': 'number'
	    };
	    gcUtils.EditorType = EditorType;

	    var DataType = {
	        'Object': 'Object',
	        'String': 'String',
	        'Number': 'Number',
	        'Boolean': 'Boolean',
	        'Date': 'Date',
	        'Array': 'Array'
	    };
	    gcUtils.DataType = DataType;

	    var isUnitlessNumber = {
	        columnCount: true,
	        flex: true,
	        flexGrow: true,
	        flexShrink: true,
	        fontWeight: true,
	        lineClamp: true,
	        lineHeight: true,
	        opacity: true,
	        order: true,
	        orphans: true,
	        widows: true,
	        zIndex: true,
	        zoom: true,

	        // SVG-related properties
	        fillOpacity: true,
	        strokeOpacity: true
	    };
	    var _uppercasePattern = /([A-Z])/g;
	    var msPattern = /^-ms-/;

	    function dangerousStyleValue(name, value) {
	        var isEmpty = isUndefinedOrNull(value) || typeof value === 'boolean' || value === '';
	        if (isEmpty) {
	            return '';
	        }

	        var isNonNumeric = isNaN(value);
	        if (isNonNumeric || value === 0 ||
	            isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
	            return '' + value; // cast to string
	        }

	        if (typeof value === 'string') {
	            value = value.trim();
	        }
	        return value + 'px';
	    }

	    function memoizeStringOnly(callback) {
	        var cache = {};
	        return function(string) {
	            if (cache.hasOwnProperty(string)) {
	                return cache[string];
	            } else {
	                cache[string] = callback.call(this, string);
	                return cache[string];
	            }
	        };
	    }

	    var processStyleName = memoizeStringOnly(function(styleName) {
	        return hyphenateStyleName(styleName);
	    });

	    function hyphenate(string) {
	        return string.replace(_uppercasePattern, '-$1').toLowerCase();
	    }

	    function hyphenateStyleName(string) {
	        return hyphenate(string).replace(msPattern, '-ms-');
	    }

	    function createMarkupForStyles(styles) {
	        var serialized = '';
	        for (var styleName in styles) {
	            if (!styles.hasOwnProperty(styleName)) {
	                continue;
	            }
	            var styleValue = styles[styleName];
	            if (!isUndefinedOrNull(styleValue)) {
	                serialized += processStyleName(styleName) + ':';
	                serialized += dangerousStyleValue(styleName, styleValue) + ';';
	            }
	        }
	        return serialized || null;
	    }

	    gcUtils.createMarkupForStyles = createMarkupForStyles;

	    /**
	     * Cancels the route for DOM event.
	     */
	    function cancelDefault(e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	            e.stopPropagation();
	        } else {
	            //IE 8
	            e.cancelBubble = false;
	            e.returnValue = false;
	        }
	        return false;
	    }

	    gcUtils.cancelDefault = cancelDefault;

	    function serializeObject(obj) {
	        var cloneObj = _.clone(obj);
	        var cache_ = [];
	        if (cloneObj) {
	            cache_.push(cloneObj);
	        }
	        var dest;
	        while (cache_.length > 0) {
	            dest = cache_.pop();
	            if (!isObject(dest)) {
	                continue;
	            }
	            for (var item in dest) {
	                cache_.push(dest[item]);
	                if (isFunction(dest[item])) {
	                    dest[item] = serializeFunction(dest[item]);
	                }
	            }
	        }
	        return cloneObj;
	    }

	    gcUtils.serializeObject = serializeObject;

	    function deserializeObject(obj) {
	        var cloneObj = _.clone(obj);
	        var cache_ = [];
	        if (cloneObj) {
	            cache_.push(cloneObj);
	        }
	        var dest;
	        var func;
	        while (cache_.length > 0) {
	            dest = cache_.pop();
	            if (!isObject(dest)) {
	                continue;
	            }
	            for (var item in dest) {
	                cache_.push(dest[item]);
	                if (isString(dest[item])) {
	                    func = deserializeFunction(dest[item]);
	                    if (func) {
	                        dest[item] = func;
	                    }
	                }
	            }
	        }
	        return cloneObj;
	    }

	    gcUtils.deserializeObject = deserializeObject;

	    function serializeFunction(value) {
	        return value.toString();
	    }

	    gcUtils.serializeFunction = serializeFunction;

	    function deserializeFunction(value) {
	        if (isString(value)) {
	            var tempStr = value.substr(8, value.indexOf('(') - 8); //8 is 'function' length
	            if (value.substr(0, 8) === 'function' && tempStr.replace(/\s+/, '') === '') {
	                var argStart = value.indexOf('(') + 1;
	                var argEnd = value.indexOf(')');
	                var args = value.substr(argStart, argEnd - argStart).split(',').map(function(arg) {
	                    return arg.replace(/\s+/, '');
	                });
	                var bodyStart = value.indexOf('{') + 1;
	                var bodyEnd = value.lastIndexOf('}');
	                /*jslint evil: true */
	                return new Function(args, value.substr(bodyStart, bodyEnd - bodyStart));
	            }
	        }
	        return null;
	    }

	    gcUtils.deserializeFunction = deserializeFunction;
	    /**
	     * Asserts that a value is an @see:ICollectionView or an Array.
	     *
	     * @param value Array or @see:ICollectionView.
	     * @param nullOK Whether null values are acceptable.
	     * @return The @see:ICollectionView that was passed in or a @see:CollectionView
	     * created from the array that was passed in.
	     */
	    /*
	     function asCollectionView(value, nullOK) {
	     if (typeof nullOK === "undefined") { nullOK = true; }
	     if (value == null && nullOK) {
	     return null;
	     }
	     var cv = tryCast(value, 'ICollectionView');
	     if (cv != null) {
	     return cv;
	     }
	     if (!isArray(value)) {
	     assert(false, 'Array or ICollectionView expected.');
	     }
	     return new wijmo.collections.CollectionView(value);
	     }
	     gcUtils.asCollectionView = asCollectionView;*/

	    /**
	     * Find the plugin module.
	     * @param name of module
	     * @returns plugin module object
	     */
	    function findPlugin(name) {
	        var plugin;
	        // find from global
	        try {
	            plugin = GcSpread.Views.GcGrid.Plugins[name];// jshint ignore:line
	        } catch (e) {
	        }

	        //if (!plugin && typeof define === 'function' && define.amd) {// jshint ignore:line
	        //    plugin = requirejs && requirejs(name) // jshint ignore:line
	        //}
	        //
	        //// commonjs not supported now
	        //if (!plugin && typeof exports === 'object' && typeof module === 'object') {// jshint ignore:line
	        //}
	        return plugin;
	    }

	    gcUtils.findPlugin = findPlugin;

	    module.exports = gcUtils;
	}());


/***/ }
/******/ ])
});
