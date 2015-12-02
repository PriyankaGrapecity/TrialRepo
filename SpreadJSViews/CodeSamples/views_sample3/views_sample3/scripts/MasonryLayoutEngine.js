(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["MasonryLayoutEngine"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["MasonryLayoutEngine"] = factory();
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
	
	    var gcUtils = __webpack_require__(1);
	    var doT = __webpack_require__(2);
	    var domUtil = __webpack_require__(3);
	
	    var POS_ABS = 'absolute';
	    var POS_REL = 'relative';
	    var OVERFLOW_HIDDEN = 'hidden';
	    var OVERFLOW_AUTO = 'auto';
	    var VIEWPORT = 'viewport';
	    var BUFFER_LENGTH = 8;
	    var FIT_SEARCH_LENGTH = 10;
	    var PRUNE_FREE_RECT_START_AT = 100;
	    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
	    //var isNaN = Number.isNaN;
	    var STATUS_IDLE = 'idle';
	    var STATUS_LOADING = 'loading';
	    //var STATUS_TRANSITIONING = 'transitioning';
	    var RTL_CLASS_NAME = 'gc-rtl';
	    var GROUP_HEADER = 'groupHeader';
	    var GROUP_FOOTER = 'groupFooter';
	    var GROUP_CONTENT = 'groupContent';
	    var QUARTER_CONTAINER_HEIGHT = 'quarter-container';
	    var HALF_CONTAINER_HEIGHT = 'half-container';
	    var CONTAINER_HEIGHT = 'container';
	    var ALL_HEIGHT = 'infinite';
	    var DEFAULT_HEADER_HEIGHT = 40;
	    var GROUP_INDENT = 18;
	    var mathMin = Math.min;
	    var mathMax = Math.max;
	    var mathCeil = Math.ceil;
	
	    var objectDefineProperty = Object.defineProperty;
	
	    var MasonryRect = (function() {
	        function MasonryRect_(left, top, width, height) {
	            var self = this;
	            self.x1_ = left || 0;
	            self.y1_ = top || 0;
	            self.x2_ = self.x1_ + (self.w_ = width || 0);
	            self.y2_ = self.y1_ + (self.h_ = height || 0);
	        }
	
	        var MasonryRectProto = MasonryRect_.prototype;
	
	        objectDefineProperty(MasonryRectProto, 'left', {
	            get: function() {
	                return this.x1_;
	            },
	            set: function(x) {
	                var self = this;
	                self.x1_ = x;
	                self.x2_ = self.x1_ + self.w_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        objectDefineProperty(MasonryRectProto, 'top', {
	            get: function() {
	                return this.y1_;
	            },
	            set: function(y) {
	                var self = this;
	                self.y1_ = y;
	                self.y2_ = self.y1_ + self.h_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        objectDefineProperty(MasonryRectProto, 'width', {
	            get: function() {
	                return this.w_;
	            },
	            set: function(w) {
	                var self = this;
	                self.w_ = w;
	                self.x2_ = self.x1_ + self.w_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        objectDefineProperty(MasonryRectProto, 'height', {
	            get: function() {
	                return this.h_;
	            },
	            set: function(h) {
	                var self = this;
	                self.h_ = h;
	                self.y2_ = self.y1_ + self.h_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        objectDefineProperty(MasonryRectProto, 'right', {
	            get: function() {
	                return this.x2_;
	            },
	            set: function(x) {
	                var self = this;
	                self.x2_ = x;
	                self.x1_ = self.x2_ - self.w_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        objectDefineProperty(MasonryRectProto, 'bottom', {
	            get: function() {
	                return this.y2_;
	            },
	            set: function(y) {
	                var self = this;
	                self.y2_ = y;
	                self.y1_ = self.y2_ - self.h_;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        MasonryRectProto.clone = function() {
	            var self = this;
	            return new MasonryRect_(self.left, self.top, self.width, self.height);
	        };
	
	        MasonryRectProto.setRect = function(leftOrRect, top, width, height) {
	            var self = this;
	            if (leftOrRect instanceof MasonryRect_) {
	                self.x1_ = leftOrRect.left;
	                self.y1_ = leftOrRect.top;
	                self.x2_ = self.x1_ + (self.w_ = leftOrRect.width);
	                self.y2_ = self.y1_ + (self.h_ = leftOrRect.height);
	            } else {
	                self.x1_ = leftOrRect;
	                self.y1_ = top;
	                self.x2_ = self.x1_ + (self.w_ = width);
	                self.y2_ = self.y1_ + (self.h_ = height);
	            }
	        };
	
	        MasonryRectProto.moveBy = function(x, y) {
	            var self = this;
	            self.left += x;
	            self.top += y;
	            return self;
	        };
	
	        MasonryRectProto.moveTo = function(x, y) {
	            var self = this;
	            self.left = x;
	            self.top = y;
	            return self;
	        };
	
	        MasonryRectProto.overlaps = function(rect) {
	            var self = this;
	            return self.bottom > rect.top && rect.bottom > self.top &&
	                self.right > rect.left && rect.right > self.left;
	        };
	
	        MasonryRectProto.contains = function(rect) {
	            var self = this;
	            //quicker to check vertical parameter first, because usually vertical length is bigger
	            return rect.top >= self.top && self.bottom >= rect.bottom &&
	                rect.left >= self.left && self.right >= rect.right;
	        };
	
	        MasonryRectProto.containsPoint = function(point) {
	            var self = this;
	            //input point also could be a rectangle, the rectangle top-left vertex would be used as the point
	            //quicker to check vertical parameter first, because top is sorted
	            return point.top >= self.top && self.bottom > point.top &&
	                point.left >= self.left && self.right > point.left;
	        };
	
	        MasonryRectProto.congruent = function(rect) {
	            var self = this;
	            return rect.top === self.top && self.height === rect.height &&
	                rect.left === self.left && self.width === rect.width;
	        };
	
	        //MasonryRectProto.containedBy = function(rect) {
	        //    var self = this;
	        //    return self.right <= rect.right && rect.left <= self.left &&
	        //        self.bottom <= rect.bottom && rect.top <= self.top;
	        //};
	
	        MasonryRectProto.fits = function(rect) {
	            var self = this;
	            return self.width >= rect.width && self.height >= rect.height;
	        };
	
	        MasonryRectProto.partitionRect = function(rect) {
	            //return in the order: left, top, right, bottom, clockwise.
	            var self = this;
	            if (!self.overlaps(rect)) {
	                return self;
	            }
	
	            var partitionedRect = [];
	            var residueLeft = rect.left - self.left;
	            if (residueLeft > 0) {
	                partitionedRect.push(new MasonryRect_(self.left, self.top, residueLeft, self.height));
	            }
	            var residueTop = rect.top - self.top;
	            if (residueTop > 0) {
	                partitionedRect.push(new MasonryRect_(self.left, self.top, self.width, residueTop));
	            }
	            var residueRight = self.right - rect.right;
	            if (residueRight > 0) {
	                partitionedRect.push(new MasonryRect_(rect.right, self.top, residueRight, self.height));
	            }
	            var residueBottom = self.bottom - rect.bottom;
	            if (residueBottom > 0) {
	                partitionedRect.push(new MasonryRect_(self.left, rect.bottom, self.width, residueBottom));
	            }
	            return partitionedRect;
	        };
	
	        MasonryRectProto.placeRectExact = function(rect) {
	            var self = this;
	            if (!self.contains(rect)) {
	                return null;
	            }
	            return self.partitionRect(rect);
	        };
	
	        MasonryRectProto.placeRect = function(rect, fromRight, fromBottom) {
	            var self = this;
	            if (!self.fits(rect)) {
	                return null;
	            }
	            //default place mode:
	            //  |------|------------|
	            //  |      |            |
	            //  |      |            |
	            //  |------|            |
	            //  |                   |
	            //  |                   |
	            //  |-------------------|
	            if (fromRight) {
	                rect.right = self.right;
	            } else {
	                rect.left = self.left;
	            }
	            if (fromBottom) {
	                rect.bottom = self.bottom;
	            } else {
	                rect.top = self.top;
	            }
	            return self.partitionRect(rect);
	        };
	
	        MasonryRectProto.placeRectWithGutter = function(rect, rectWithGutter, fromRight, fromBottom) {
	            var self = this;
	            if (!self.fits(rect)) {
	                return null;
	            }
	            if (fromRight) {
	                rect.right = rectWithGutter.right = self.right;
	            } else {
	                rect.left = rectWithGutter.left = self.left;
	            }
	            if (fromBottom) {
	                rect.bottom = rectWithGutter.bottom = self.bottom;
	            } else {
	                rect.top = rectWithGutter.top = self.top;
	            }
	            return self.partitionRect(rectWithGutter);
	        };
	
	        //select a rect fit the current rect best, gutter was took into consideration
	        MasonryRectProto.fitsMost = function(rects, gutter, maxWidth, searchLength) {
	            var self = this;
	            var rectArr;
	            if (gcUtils.isArray(rects)) {
	                rectArr = rects;
	            } else if ('width' in rects && 'height' in rects) {
	                rectArr = [rects];
	            } else {
	                return false;
	            }
	            if (searchLength === 1) {
	                var rect = rectArr[0];
	                var width = mathMax(mathMin(self.left + rect.width + gutter, maxWidth) - self.left, rect.width);
	                var height = rect.height + gutter;
	                return self.width >= width && self.height >= height ? 0 : false;
	            }
	            var newRectArr = rectArr.slice(0, searchLength);
	            //todo: change this logic to fit gaps better
	            //plan 1: add a constrain function (about rasterSize) to choose a promising candidate instead of biggest possible candidate
	            //plan 2: use records of rect size or record the rect sizes to speed up this searching progress
	            //plan 3: an intelligent calculating algorithm to optimize the left spaces
	            //var widthStep = rasterSize && rasterSize.width >= 1 ? Math.floor(rasterSize.width) : POSITIVE_INFINITY;
	            //var heightStep = rasterSize && rasterSize.height >= 1 ? Math.floor(rasterSize.height) : POSITIVE_INFINITY;
	            var diffs = newRectArr.map(function(rect) {
	                var width = mathMax(mathMin(self.left + rect.width + gutter, maxWidth) - self.left, rect.width);
	                var widthDiff = self.width - width;
	                var heightDiff = self.height - rect.height - gutter;
	                //widthDiff first.
	                return (widthDiff >= 0 && heightDiff >= 0) ? (widthDiff * 1024 + mathMin(heightDiff, 1023)) : -1;
	            });
	            var fitsMostIndex = 0;
	            var minDiff = diffs.reduce(function(pre, cur, index) {
	                var preValid = pre >= 0;
	                var curValid = cur >= 0;
	                if (preValid && curValid) {
	                    var d = cur < pre;
	                    if (d) {
	                        fitsMostIndex = index;
	                        return cur;
	                    } else {
	                        return pre;
	                    }
	                } else if (preValid) {
	                    return pre;
	                } else if (curValid) {
	                    fitsMostIndex = index;
	                    return cur;
	                } else {
	                    return -1;
	                }
	            });
	
	            return minDiff < 0 ? false : fitsMostIndex;
	        };
	
	        MasonryRectProto.getStyle = function() {
	            var self = this;
	            return {
	                left: self.left,
	                top: self.top,
	                width: self.width,
	                height: self.height
	            };
	        };
	
	        return MasonryRect_;
	    })();
	
	    function MasonryLayoutEngine(options) {
	        var optionDefaults = {
	            columnWidth: 1,
	            rowHeight: 1,
	            gutter: 0,
	            keepOrder: true,
	            rightToLeft: false,
	            showScrollBar: true,
	            allowEdit: false
	        };
	        var self = this;
	        self.MasonryRect = MasonryRect;
	        self.layoutInfo_ = null;
	
	        self.name = 'MasonryLayoutEngine'; //name must end with LayoutEngine
	        self.options = _.defaults(options || {}, optionDefaults);
	    }
	
	    MasonryLayoutEngine.prototype = {
	        init: function(grid) {
	            var self = this;
	
	            self.grid = grid;
	            grid.columns = _.map(grid.columns, function(col) {
	                return _.defaults(col, _.defaults(self.getColumnDefaults_(), {
	                    caption: col.dataField,
	                    id: col.dataField
	                }));
	            });
	
	            var options = self.options;
	            var columnWidth = options.columnWidth;
	            options.columnWidth = gcUtils.isNumber(columnWidth) ? columnWidth : 1;
	            var rowHeight = options.rowHeight;
	            options.rowHeight = gcUtils.isNumber(rowHeight) ? rowHeight : 1;
	            var gutter = options.gutter;
	            options.gutter = gcUtils.isNumber(gutter) ? gutter : 0;
	
	            self.reloadData_();
	            self.status_ = STATUS_IDLE;
	            self.loadCount = 0;
	        },
	
	        getColumnDefaults_: function() {
	            return {
	                visible: true,
	                allowSorting: false,
	                allowEditing: false
	            };
	        },
	
	        getLayoutInfo: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getLayoutInfo();
	            }
	            return self.layoutInfo_ || (self.layoutInfo_ = {
	                    viewport: getViewportLayoutInfo_.call(this)
	                });
	        },
	
	        clearRenderCache_: function() {
	            var self = this;
	            self.layoutInfo_ = null;
	            if (self.status_ !== STATUS_LOADING) {
	                self.reloadData_();
	                self.hasScrollBar_ = null;
	                self.rowTemplateFn_ = null;
	                self.containerInnerSize_ = null;
	                self.contentSize_ = null;
	            }
	        },
	
	        getRenderInfo: function(options) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getRenderInfo(options);
	            }
	            var area = options && options.area;
	            if (area !== VIEWPORT) {
	                return null;
	            }
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            var layoutEngineOptions = self.options;
	            var rightToLeft = layoutEngineOptions.rightToLeft;
	            var width = layoutInfo.width;
	            var height = layoutInfo.height;
	            var r = {
	                outerDivCssClass: 'gc-viewport' + (rightToLeft ? ' ' + RTL_CLASS_NAME : ''),
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: layoutInfo.top,
	                    left: layoutInfo.left + (rightToLeft && self.hasScrollBar_ ? domUtil.getScrollbarSize().width : 0),
	                    height: height,
	                    width: width,
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    height: layoutInfo.contentHeight,
	                    width: width
	                },
	                innerDivTranslate: {
	                    left: -options.offsetLeft,
	                    top: -options.offsetTop
	                },
	                renderedRows: []
	            };
	
	            r.renderedRows = getRenderInfoInternal_.call(self, options);
	            return r;
	        },
	
	        getRenderRange_: function(options) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getRenderRange_(options);
	            }
	
	            var area = (options && options.area) || '';
	            if (!area) {
	                return null;
	            }
	
	            return {
	                left: -options.offsetLeft,
	                top: -options.offsetTop,
	                renderedRows: getRenderInfoInternal_.call(self, options, true)
	            };
	        },
	
	        getRowTemplate: function() {
	            return getTemplate_.call(this);
	        },
	
	        reLayout_: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                return;
	            }
	            if (self.grid.data.groups) {
	                var groupContentInfo = self.groupContentInfo_;
	                _.forEach(groupContentInfo, function(contentInfo) {
	                    partialReLayout_.call(self, contentInfo);
	                });
	                self.grid.updateGroupInfos_();
	            } else {
	                self.contentSize_.height = partialReLayout_.call(self, self.contentInfo_);
	            }
	        },
	
	        remeasureItem: function(i, group) {
	            var self = this;
	            if (self.groupStrategy_) {
	                self.grid.invalidate();
	            }
	            var itemInfo = getItemInfoByIndex_.call(self, i, group);
	            itemInfo.oldPosition = null;
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            var visibleRect = new MasonryRect(0, self.grid.scrollOffset.top, layoutInfo.contentWidth, layoutInfo.height);
	            self.remeasure_(self.contentInfo_, self.contentSize_, visibleRect);
	        },
	
	        remeasure_: function(contentInfo, contentSize, visibleRect, measureAll) {
	            var self = this;
	            var len = measureAll ? contentInfo.itemCount : contentInfo.renderedItems;
	            getItemRectangles_.call(self, {contentInfo: contentInfo, contentSize: contentSize}, {start: 0, end: len}, true, function() {
	                self.reLayout_();
	                self.status_ = STATUS_LOADING;
	                refreshItems_.call(self, visibleRect);
	                self.status_ = STATUS_IDLE;
	            });
	        },
	
	        reloadData_: function() {
	            var self = this;
	            var containerSize = getContainerInnerSize_.call(self);
	            self.minItemWidth_ = containerSize.width;
	            self.minItemHeight_ = containerSize.height;
	            var items = [];
	            var data = self.grid.data;
	            for (var i = 0, len = data.calcSource.getDimension(); i < len; ++i) {
	                items[i] = {
	                    rect: null
	                };
	            }
	            self.items_ = items;
	            var groups = data.groups;
	            //var calcSource = data.calcSource;
	            if (groups) {
	                self.groupContentInfo_ = {};
	                var parentGroup = {groups: groups};
	                var groupInfoStack = [{
	                    group: parentGroup,
	                    path: []
	                }];
	                while (groupInfoStack.length !== 0) {
	                    var currGroupInfo = groupInfoStack.pop();
	                    var currGroup = currGroupInfo.group;
	                    var currPath = currGroupInfo.path;
	                    if (currGroup.isBottomLevel) {
	                        var pathStr = currPath.join('_');
	                        self.groupContentInfo_[pathStr] = {
	                            group: currGroup,
	                            freeRectangles: [],
	                            renderedItems: 0,
	                            itemCount: currGroup.itemCount
	                        };
	                    } else {
	                        var children = currGroup.groups;
	                        for (i = children.length - 1; i > -1; --i) {
	                            groupInfoStack.push({
	                                group: children[i],
	                                path: currPath.concat([i])
	                            });
	                        }
	                    }
	                }
	                self.contentInfo_ = null;
	            } else {
	                self.groupContentInfo_ = null;
	                self.contentInfo_ = {
	                    renderedItems: 0,
	                    itemCount: data.itemCount,
	                    freeRectangles: []
	                };
	            }
	        },
	
	        refreshRow_: function(row, groupPath) {
	            var self = this;
	            var grid = self.grid;
	            var innerElement = document.getElementById(grid.uid + '-' + VIEWPORT + '-inner');
	            var div = document.createElement('div');
	            var info;
	            if (innerElement) {
	                var key = grid.uid + '-r' + row;
	                info = self.getRenderRowInfo_({
	                    key: key,
	                    index: row,
	                    height: grid.options.rowHeight,
	                    path: groupPath
	                }, VIEWPORT);
	                div.innerHTML = grid.renderRow_(info);
	                var oldElement = document.getElementById(key);
	                if (gcUtils.isUndefinedOrNull(oldElement)) {
	                    innerElement.appendChild(div.childNodes[0]);
	                    grid.lastRenderedRows_[VIEWPORT].push(key);
	                } else {
	                    innerElement.replaceChild(div.childNodes[0], document.getElementById(key));
	                }
	            }
	        },
	
	        deleteRow_: function(row, groupPath) {
	            var self = this;
	            var grid = self.grid;
	            var key = grid.uid + '-r' + row;
	            //var key = self.grid.uid + '-gr' + pathStr + '-r';
	            var index;
	            if ((index = grid.lastRenderedRows_[VIEWPORT].indexOf(key)) > -1) {
	                grid.lastRenderedRows_[VIEWPORT].splice(index, 1);
	                var innerElement = document.getElementById(grid.uid + '-' + VIEWPORT + '-inner');
	                var targetRow = document.getElementById(key);
	                if (innerElement && targetRow) {
	                    innerElement.removeChild(targetRow);
	                }
	            }
	        },
	
	        refreshScrollBar_: function() {
	            var self = this;
	            var grid = self.grid;
	            var layoutInfo = grid.layoutEngine.getLayoutInfo();
	            var selector;
	            var element;
	            var renderInfo;
	            _.keys(layoutInfo).map(function(area) {
	                //update scroll container
	                if (self.showScrollPanel(area)) {
	                    selector = grid.uid + '-' + area + '-scroll';
	                    element = document.getElementById(selector);
	                    renderInfo = self.getScrollPanelRenderInfo(area);
	                    if (renderInfo) {
	                        if (element) {
	                            element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.outerDivStyle);
	                            if (element.childNodes.length > 0) {
	                                element.childNodes[0].style.cssText = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                            }
	                        } else {
	                            var id = grid.uid + '-' + area + '-scroll';
	                            grid.scrollableElements_.push(id);
	                            var html = '<div id="' + id + '" class="' + renderInfo.outerDivCssClass + '"';
	                            if (renderInfo.outerDivCssClass) {
	                                html += ' style="' + gcUtils.createMarkupForStyles(renderInfo.outerDivStyle) + '"';
	                            }
	                            html += '><div';
	                            if (renderInfo.innerDivStyle) {
	                                html += ' style="' + gcUtils.createMarkupForStyles(renderInfo.innerDivStyle) + '"';
	                            }
	                            html += '></div></div>';
	                            var scrollBarElement = domUtil.createElement(html);
	                            var parentNode = document.querySelector('#' + grid.uid + ' .gc-grid-container');
	                            parentNode.insertBefore(scrollBarElement, parentNode.firstElementChild);
	                        }
	                    }
	                } else {
	                    selector = grid.uid + '-' + area + '-scroll';
	                    element = document.getElementById(selector);
	                    if (element) {
	                        renderInfo = self.getScrollPanelRenderInfo(area);
	                        if (renderInfo) {
	                            element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.outerDivStyle);
	                            if (element.childNodes.length > 0) {
	                                element.childNodes[0].style.cssText = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                            }
	                        }
	                    }
	                }
	            });
	        },
	
	        getRenderRowInfo_: function(row, area) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getRenderRowInfo_(row, area);
	            }
	            var options = self.options;
	            var grid = self.grid;
	
	            if (self.grid.data.groups) {
	                var info = row.info;
	                var groupInfo = grid.getGroupInfo_(info.path);
	
	                var rightToLeft = options.rightToLeft;
	                var key = row.key;
	                var rect = row.bounds;
	
	                if (info.area === GROUP_HEADER) {
	                    return getGroupHeaderRow_.call(self, key, info, groupInfo, rect, rightToLeft);
	                } else if (info.area === GROUP_CONTENT) {
	                    return getGroupContentRow_.call(self, key, row.index, rect, groupInfo, rightToLeft);
	                } else {
	                    return getGroupFooterRow_.call(self, key, info, groupInfo, rect, rightToLeft);
	                }
	            } else {
	                return getRenderRowInfoInternal.call(self, row.key, row.index);
	            }
	        },
	
	        showScrollPanel: function(area) {
	            var self = this;
	            if (!self.options.showScrollBar) {
	                return false;
	            }
	            if (area.toLowerCase() === VIEWPORT) {
	                var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	                if (layoutInfo.height < layoutInfo.contentHeight || layoutInfo.width < layoutInfo.contentWidth) {
	                    return true;
	                }
	            }
	            return false;
	        },
	
	        getInitialScrollOffset: function() {
	            return {
	                top: 0,
	                left: 0
	            };
	        },
	
	        getScrollPanelRenderInfo: function(area) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getScrollPanelRenderInfo(area);
	            }
	            if (area.toLowerCase() === VIEWPORT) {
	                var viewportLayout = self.getLayoutInfo()[VIEWPORT];
	                return {
	                    outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-top scroll-left' + (self.options.rightToLeft ? ' ' + RTL_CLASS_NAME : ''),
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: 0,
	                        left: 0,
	                        height: viewportLayout.height,
	                        width: viewportLayout.width + (self.hasScrollBar_ ? domUtil.getScrollbarSize().width : 0),
	                        overflow: OVERFLOW_AUTO
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        height: viewportLayout.contentHeight,
	                        width: viewportLayout.contentWidth
	                    }
	                };
	            }
	        },
	
	        isScrollableArea_: function(area) {
	            if (!this.options.showScrollBar) {
	                return false;
	            }
	            return area.toLowerCase() === VIEWPORT;
	        },
	
	        //todo: consider to use event path to reduce processing time cost
	        hitTest: function(eventArgs) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.hitTest(eventArgs);
	            }
	            var left = eventArgs.pageX;
	            var top = eventArgs.pageY;
	            var grid = self.grid;
	            //get container padding and position
	            var containerInfo = grid.getContainerInfo_().contentRect;
	            var offsetLeft = left - containerInfo.left;
	            var offsetTop = top - containerInfo.top;
	            var point = {
	                left: offsetLeft,
	                top: offsetTop
	            };
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            var hitTestInfo = {
	                area: '',
	                row: -1,
	                groupInfo: null
	            };
	            var i;
	            var len;
	            var groupInfos = grid.groupInfos_;
	            var groupHeight;
	            var groupInfo;
	            var groups = grid.data.groups;
	            //if viewport
	            var viewportRect = new MasonryRect(layoutInfo.left, layoutInfo.top, layoutInfo.width, layoutInfo.height);
	            if (viewportRect.containsPoint(point)) {
	                hitTestInfo.area = VIEWPORT;
	                offsetLeft += grid.scrollOffset.left - layoutInfo.left;
	                offsetTop += grid.scrollOffset.top - layoutInfo.top;
	
	                var relativePoint = {left: offsetLeft, top: offsetTop};
	                var items = self.items_;
	                if (!groups) {
	                    for (i = 0, len = self.contentInfo_.renderedItems; i < len; ++i) {
	                        if (items[i].rect.containsPoint(relativePoint)) {
	                            hitTestInfo.row = i;
	                            break;
	                        }
	                    }
	                } else {
	                    for (i = 0, len = groupInfos.length; i < len; ++i) {
	                        groupInfo = groupInfos[i];
	                        groupHeight = groupInfo.height;
	                        if (offsetTop < groupHeight) {
	                            return hitTestGroup_.call(self, groupInfo, offsetLeft, offsetTop);
	                        }
	                        offsetTop -= groupHeight;
	                    }
	                }
	            }
	            return hitTestInfo;
	        },
	
	        handleScroll: function() {
	            var self = this;
	            var grid = self.grid;
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            if (self.groupStrategy_) {
	                self.groupStrategy_.handleScroll();
	            } else if (self.status_ === STATUS_IDLE) {
	                var group = self.grid.data.groups;
	                var refreshHeight = modeToHeight_.call(self, QUARTER_CONTAINER_HEIGHT);
	                var contentSize = getContentSize_.call(self);
	                var visibleRect = new MasonryRect(0, grid.scrollOffset.top, layoutInfo.contentWidth, layoutInfo.height);
	                visibleRect.height += refreshHeight;
	                if (group) {
	                    var allRendered = _.every(self.groupContentInfo_, function(contentInfo) {
	                        return contentInfo.renderedItems === contentInfo.itemCount || contentInfo.group.collapsed;
	                    });
	                    if (!allRendered && contentSize.height < visibleRect.bottom) {
	                        self.status_ = STATUS_LOADING;
	                        loadGroups_.call(self, grid.groupInfos_, visibleRect, false, function(contentSize) {
	                            grid.updateGroupInfos_();
	                            self.contentSize_ = contentSize;
	                            grid.invalidate(false);
	                            self.status_ = STATUS_IDLE;
	                        });
	                    } else {
	                        grid.scrollRenderPart_(VIEWPORT);
	                    }
	                } else {
	                    if (self.contentInfo_.renderedItems < self.contentInfo_.itemCount &&
	                        contentSize.height < visibleRect.bottom) {
	                        var itemLayoutInfo = {
	                            contentSize: {
	                                width: layoutInfo.contentWidth,
	                                height: layoutInfo.contentHeight
	                            },
	                            contentInfo: self.contentInfo_
	                        };
	                        self.status_ = STATUS_LOADING;
	                        loadItems_.call(self, itemLayoutInfo, visibleRect, false, function(contentSize) {
	                            self.contentSize_ = contentSize;
	                            grid.invalidate(false);
	                            self.status_ = STATUS_IDLE;
	                        });
	                    } else {
	                        grid.scrollRenderPart_(VIEWPORT);
	                    }
	                }
	            } else {
	                grid.scrollRenderPart_(VIEWPORT);
	            }
	        },
	
	        getGroupInfoDefaults_: function() {
	            if (this.groupStrategy_) {
	                return this.groupStrategy_.getGroupInfoDefaults_();
	            }
	            return {
	                footer: {
	                    visible: false,
	                    collapseWithGroup: true
	                },
	                header: {
	                    visible: true
	                }
	            };
	        },
	
	        initGroupInfosHeight_: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.initGroupInfosHeight_();
	            }
	            var groupInfos = self.grid.groupInfos_;
	            var i;
	            var len;
	            var totalHeight = 0;
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                totalHeight += groupInfos[i].height = self.getGroupHeight_(groupInfos[i]);
	            }
	            if (self.contentSize_) {
	                self.contentSize_.height = totalHeight;
	            }
	        },
	
	        getGroupHeight_: function(groupInfo) {
	            var self = this;
	            if (!groupInfo) {
	                return 0;
	            }
	            if (!gcUtils.isUndefined(groupInfo.height)) {
	                return groupInfo.height;
	            }
	
	            var group = groupInfo.data;
	            var height = 0;
	            var header = group.groupDescriptor.header;
	            if (header && header.visible) {
	                height += self.getGroupHeaderHeight_(group);
	            }
	            var footer;
	            if (!group.collapsed) {
	                if (group.isBottomLevel) {
	                    height += self.getInnerGroupHeight(groupInfo);
	                } else {
	                    groupInfo.children.forEach(function(childGroup) {
	                        childGroup.height = self.getGroupHeight_(childGroup);
	                        height += childGroup.height;
	                    });
	                }
	                height += self.getGroupFooterHeight_(group);
	            } else {
	                footer = group.groupDescriptor.footer;
	                if (footer && footer.visible && !footer.collapseWithGroup) {
	                    height += self.getGroupFooterHeight_(group);
	                }
	            }
	            return height;
	        },
	
	        hitTestGroupContent_: function(groupInfo, area, left, top) {
	            if (area !== VIEWPORT) {
	                return null;
	            }
	            var point = {left: left, top: top};
	            var self = this;
	            var group = groupInfo.data;
	            var groupContentInfo = self.groupContentInfo_;
	            for (var i = 0, len = groupContentInfo[groupInfo.path.join('_')].itemCount; i < len; ++i) {
	                var item = getItemInfoByIndex_.call(self, i, group);
	                if (item.rect.containsPoint(point)) {
	                    return {
	                        area: VIEWPORT,
	                        row: -1,
	                        groupInfo: {
	                            area: GROUP_CONTENT,
	                            path: groupInfo.path,
	                            row: i
	                        }
	                    };
	                }
	
	            }
	            return {
	                area: VIEWPORT,
	                row: -1,
	                groupInfo: {
	                    area: GROUP_CONTENT,
	                    path: groupInfo.path,
	                    row: -1
	                }
	            };
	        },
	
	        getInnerGroupHeight: function(groupInfo) {
	            if (!groupInfo.isBottomLevel) {
	                return 0;
	            }
	            var groupContentInfo = this.groupContentInfo_;
	            return groupContentInfo ? getMaxHeightByFreeRectArr_(groupContentInfo[groupInfo.path.join('_')].freeRectangles) : 0;
	        },
	
	        getInnerGroupRenderInfo: function(groupInfo, containerSize, layoutCallback) {
	            if (!groupInfo.isBottomLevel) {
	                return;
	            }
	            var self = this;
	            var group = groupInfo.data;
	            var itemInfo;
	            var itemRect;
	            var rows = [];
	            var layout;
	            var additionalStyle;
	            var additionalCSSClass;
	            var renderRect;
	            var visibleRect = new MasonryRect(0, 0, containerSize.width, POSITIVE_INFINITY);
	            var pathStr = groupInfo.path.join('_');
	            var contentInfo = self.groupContentInfo_[pathStr];
	            var synFlag = false;
	            if (contentInfo.freeRectangles.length === 0) {
	                ++self.loadCount;
	                contentInfo.freeRectangles.push(visibleRect);
	                getItemRectangles_.call(self, {contentInfo: contentInfo, contentSize: containerSize}, {start: 0, end: contentInfo.itemCount}, false, function(itemRectArr, sync) {
	                    --self.loadCount;
	                    contentInfo.renderedItems = contentInfo.itemCount;
	                    placeItems_.call(self, itemRectArr, contentInfo, containerSize.width);
	                    synFlag = sync;
	                    if (!sync && self.loadCount === 0) {
	                        self.status_ = STATUS_LOADING;
	                        refreshItems_.call(self, visibleRect);
	                        self.status_ = STATUS_IDLE;
	                    }
	                });
	            } else {
	                synFlag = true;
	            }
	            if (!synFlag) {
	                return [];
	            }
	            var keyBase = self.grid.uid + '-gr' + pathStr + '-r';
	            if (layoutCallback) {
	                for (var i = 0, len = contentInfo.itemCount; i < len; ++i) {
	                    itemInfo = getItemInfoByIndex_.call(self, i, group);
	                    itemRect = itemInfo.rect;
	                    layout = layoutCallback(groupInfo, i);
	                    additionalCSSClass = layout.cssClass;
	                    additionalStyle = layout.style || {};
	                    additionalStyle.position = POS_ABS;
	                    var layoutBound = layout.location;
	                    var key = keyBase + i;
	                    if (layoutBound) {
	                        renderRect = new MasonryRect(layoutBound.left, layoutBound.top, itemRect.width, itemRect.height);
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, key, i, renderRect, false, additionalCSSClass, additionalStyle));
	                    } else {
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, key, i, itemRect, false, additionalCSSClass, additionalStyle));
	                    }
	                }
	            } else {
	                //todo: this route haven't been tested, might have bugs
	                rows = getRenderedGroupContentItemsInfo_.call(self, groupInfo, visibleRect, visibleRect, false);
	            }
	            return rows;
	        },
	
	        getMaxVisibleItemCount: function(containerSize, groupInfo) {
	            var self = this;
	            var grid = self.grid;
	            var sampleGroupInfo = groupInfo || (grid.groupInfos_ ? grid.groupInfos_[0] : null);
	            if (!sampleGroupInfo) {
	                return 0;
	            }
	            var group = sampleGroupInfo.data;
	            var pathStr = sampleGroupInfo.path.join('_');
	            var contentInfo = self.groupContentInfo_[pathStr];
	            var maxHeight = containerSize.height;
	            var i;
	            var len;
	            for (i = 0, len = contentInfo.itemCount; i < len; ++i) {
	                var itemInfo = getItemInfoByIndex_.call(self, i, group);
	                var itemRect = itemInfo.rect;
	                var bottom = itemRect.bottom;
	                if (bottom > maxHeight) {
	                    break;
	                }
	            }
	            return i;
	        },
	
	        getGroupHeaderHeight_: function(group) {
	            var header = group.groupDescriptor.header;
	            return (header && header.visible) ? (header.height || DEFAULT_HEADER_HEIGHT) : 0;
	        },
	
	        getGroupFooterHeight_: function(group) {
	            var footer = group.groupDescriptor.footer;
	            return (footer && footer.visible) ? (footer.height || DEFAULT_HEADER_HEIGHT) : 0;
	        },
	
	        handleTemplateChange_: function() {
	            this.grid.invalidate();
	        },
	
	        registeEvents_: function() {
	            var self = this;
	            self.grid.onMouseWheel.addHandler(handleMouseWheel);
	            self.grid.onMouseDown.addHandler(handleMouseDown);
	            //self.grid.onMouseClick.addHandler(handleMouseClick);
	        },
	
	        unRegisteEvents_: function() {
	            var self = this;
	            self.grid.onMouseWheel.removeHandler(handleMouseWheel);
	            self.grid.onMouseDown.removeHandler(handleMouseDown);
	            //self.grid.onMouseClick.removeHandler(handleMouseClick);
	        },
	
	        destroy: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                self.groupStrategy_.destroy();
	                delete self.groupStrategy_;
	            } else {
	                self.unRegisteEvents_();
	            }
	        },
	
	        canDoSwipe_: function() {
	            return false;
	        },
	
	        canStartSwipe_: function() {
	
	        }
	    };
	
	    function refreshItems_(visibleRect) {
	        var self = this;
	        var grid = self.grid;
	        var groups = grid.data.groups;
	        if (groups) {
	            //todo: partial render group
	            grid.invalidate();
	        } else {
	            renderMinRows_.call(self, self.contentInfo_, visibleRect);
	            self.layoutInfo_ = null;
	            self.refreshScrollBar_();
	        }
	    }
	
	    function renderMinRows_(contentInfo, visibleRect) {
	        var self = this;
	        var i = 0;
	        var len = contentInfo.renderedItems;
	        for (; i < len; ++i) {
	            var itemInfo = getItemInfoByIndex_.call(self, i, contentInfo.group);
	            if (gcUtils.isUndefinedOrNull(itemInfo.oldPosition) ||
	                (!itemInfo.rect.congruent(itemInfo.oldPosition)) &&
	                (visibleRect.overlaps(itemInfo.oldPosition) || visibleRect.overlaps(itemInfo.rect))) {
	                itemInfo.oldPosition = itemInfo.rect.clone();
	                self.refreshRow_(i);
	            } else if (!visibleRect.overlaps(itemInfo.rect)) {
	                self.deleteRow_(i);
	            }
	        }
	    }
	
	    function partialReLayout_(contentInfo) {
	        var self = this;
	        var itemRectArr = [];
	        for (var i = 0, len = contentInfo.renderedItems; i < len; ++i) {
	            itemRectArr.push(getItemInfoByIndex_.call(self, i, contentInfo.group).rect);
	        }
	        var contentSize = getContentSize_.call(self);
	        var testRect = new MasonryRect(0, 0, contentSize.width, POSITIVE_INFINITY);
	        contentInfo.freeRectangles.length = 0;
	        contentInfo.freeRectangles.push(testRect);
	
	        placeItems_.call(self, itemRectArr, contentInfo, contentSize.width);
	        return getMaxHeightByFreeRectArr_(contentInfo.freeRectangles);
	    }
	
	    function hitTestGroup_(groupInfo, left, top) {
	        var self = this;
	        var relativeTop = top;
	        var group = groupInfo.data;
	        var groupHeight = groupInfo.height;
	        var headerHeight = self.getGroupHeaderHeight_(group);
	        var footerHeight = self.getGroupFooterHeight_(group);
	        if (relativeTop < headerHeight) {
	            var onExpandToggle = false;
	            var headerElement = document.getElementById(self.grid.uid + '-gh' + groupInfo.path.join('_'));
	            if (headerElement) {
	                var toggleElement = headerElement.querySelector('.gc-grouping-toggle');
	                var eleOffset = domUtil.offset(toggleElement);
	                var elementRect = domUtil.getElementRect(toggleElement);
	                var headerElementOffset = domUtil.offset(headerElement);
	                var enlargeLength = self.grid.isTouchMode ? 10 : 0;
	                var toggleRect = new MasonryRect(
	                    eleOffset.left - headerElementOffset.left - enlargeLength,
	                    eleOffset.top - headerElementOffset.top - enlargeLength,
	                    elementRect.width + 2 * enlargeLength,
	                    elementRect.height + 2 * enlargeLength
	                );
	                if (toggleRect.containsPoint({left: left, top: top})) {
	                    onExpandToggle = true;
	                }
	                toggleRect = null;
	            }
	            return {
	                area: VIEWPORT,
	                row: -1,
	                groupInfo: {
	                    area: GROUP_HEADER,
	                    path: groupInfo.path,
	                    onExpandToggle: onExpandToggle
	                }
	            };
	        } else if (!group.collapsed) {
	            relativeTop -= headerHeight;
	            if (relativeTop < groupHeight - footerHeight) {
	                if (groupInfo.isBottomLevel) {
	                    return self.hitTestGroupContent_(groupInfo, VIEWPORT, left, relativeTop);
	                } else {
	                    var groups = groupInfo.children;
	                    for (var i = 0, len = groups.length; i < len; ++i) {
	                        groupHeight = groups[i].height;
	                        if (relativeTop < groupHeight) {
	                            return hitTestGroup_.call(self, groups[i], left, relativeTop);
	                        }
	                        relativeTop -= groupHeight;
	                    }
	                }
	            } else {
	                return {
	                    area: VIEWPORT,
	                    row: -1,
	                    groupInfo: {
	                        area: GROUP_FOOTER,
	                        path: groupInfo.path,
	                        row: -1
	                    }
	                };
	            }
	        }
	        return null;
	    }
	
	    //load group, note it has both synchronous and asynchronous logic
	    function tryToLoadGroups_(groupInfo, visibleRect) {
	        var self = this;
	        var grid = self.grid;
	        var groupContentInfo = self.groupContentInfo_;
	        var containerSize = getContainerInnerSize_.call(self);
	        var width = containerSize.width;
	
	        self.status_ = STATUS_LOADING;
	
	        _.forEach(groupContentInfo, function(contentInfo) {
	            contentInfo.freeRectangles.push(new MasonryRect(0, 0, width, POSITIVE_INFINITY));
	        });
	        loadGroups_.call(self, groupInfo, visibleRect, false, function(contentSize, sync) {
	            if (self.options.showScrollBar && contentSize.height > containerSize.height) {
	                self.hasScrollBar_ = true;
	                self.contentSize_ = {
	                    width: contentSize.width - domUtil.getScrollbarSize().width,
	                    height: contentSize.height
	                };
	                self.cachedContentSize_ = self.contentSize_;
	                //_.forEach(groupContentInfo, function(contentInfo) {
	                //    self.remeasure_(contentInfo, self.contentSize_);
	                //});
	                self.reLayout_();
	            } else {
	                self.contentSize_ = contentSize;
	            }
	            //if asynchronous do invalidate
	            if (sync === false) {
	                grid.invalidate();
	            } else {
	                grid.updateGroupInfos_();
	            }
	            self.status_ = STATUS_IDLE;
	        });
	    }
	
	    function loadGroups_(groupInfo, visibleRect, reload, callback) {
	        var self = this;
	        var groupContentInfo = self.groupContentInfo_;
	        var width = getContentSize_.call(self).width;
	        var relativeRect = visibleRect.clone();
	        var targetHeight = visibleRect.bottom;
	        var accHeight = 0;
	        var allSynFlag;
	        var done = false;
	
	        var groupElementStack = [];
	        for (var i = groupInfo.length - 1; i > -1; --i) {
	            groupElementStack.push({
	                groupInfo: groupInfo[i],
	                area: GROUP_HEADER
	            });
	        }
	
	        function endTry_(height) {
	            done = true;
	            relativeRect = null;
	            groupElementStack.length = 0;
	            callback({
	                width: width,
	                height: height
	            }, allSynFlag);
	        }
	
	        (function traverseGroup(height) {
	            if (!groupElementStack || groupElementStack.length === 0) {
	                return;
	            }
	            var synchronousLoad = true;
	
	            function loadItemFinish_(contentSize, sync) {
	                height += contentSize.height;
	                if (sync === true) {
	                    if (gcUtils.isUndefinedOrNull(allSynFlag)) {
	                        allSynFlag = true;
	                    }
	                    synchronousLoad = true;
	                    if (height > targetHeight) {
	                        endTry_(height);
	                    }
	                } else {
	                    allSynFlag = false;
	                    if (height > targetHeight) {
	                        endTry_(height);
	                    } else {
	                        traverseGroup(height);
	                    }
	                }
	            }
	
	            while (synchronousLoad && !done) {
	                if (groupElementStack.length === 0) {
	                    done = true;
	                    endTry_(height);
	                    return;
	                }
	                var groupElement = groupElementStack.pop();
	                var groupInfo = groupElement.groupInfo;
	                var group = groupInfo.data;
	                var header = group.groupDescriptor.header;
	                var footer = group.groupDescriptor.footer;
	                var area = groupElement.area;
	                if (area === GROUP_HEADER) {
	                    if (header && header.visible) {
	                        height += self.getGroupHeaderHeight_(group);
	                        if (height > targetHeight) {
	                            endTry_(height);
	                        }
	                    }
	                    if (!group.collapsed) {
	                        if (group.isBottomLevel) {
	                            groupElementStack.push({
	                                groupInfo: groupInfo,
	                                area: GROUP_CONTENT
	                            });
	                        } else {
	                            var children = groupInfo.children;
	                            for (i = children.length - 1; i > -1; --i) {
	                                groupElementStack.push({
	                                    groupInfo: children[i],
	                                    area: GROUP_HEADER
	                                });
	                            }
	                        }
	                        if (footer && footer.visible) {
	                            groupElementStack.push({
	                                groupInfo: groupInfo,
	                                area: GROUP_FOOTER
	                            });
	                        }
	                    } else if (footer && footer.visible && !footer.collapseWithGroup) {
	                        groupElementStack.push({
	                            groupInfo: groupInfo,
	                            area: GROUP_FOOTER
	                        });
	                    }
	                } else if (area === GROUP_CONTENT) {
	                    var path = groupInfo.path;
	                    var contentInfo = groupContentInfo[path.join('_')];
	                    if (reload || contentInfo.renderedItems < contentInfo.itemCount) {
	                        var itemLayoutInfo = {
	                            contentSize: {
	                                width: width,
	                                height: 0
	                            },
	                            contentInfo: contentInfo
	                        };
	                        //If the group element is bottom content, it is probably necessary to load asynchronously,
	                        // thus set the synchronousLoad flag to false.
	                        //And if the callback of loadItems shows that all items were load synchronously(which means
	                        // items contain no image tag or have only image tags which have their URL already loaded),
	                        // then set the flag back to true, in order to stay in the while loop to limit the recursive
	                        // stack.
	                        synchronousLoad = false;
	                        relativeRect.setRect(visibleRect);
	                        relativeRect.top -= height;
	                        loadItems_.call(self, itemLayoutInfo, relativeRect, false, loadItemFinish_);
	                    } else {
	                        //speed up, if the bottom group is loaded
	                        height += getMaxHeightByFreeRectArr_(contentInfo.freeRectangles);
	                        if (height > targetHeight) {
	                            endTry_(height);
	                        }
	                    }
	                } else {
	                    height += self.getGroupFooterHeight_(group);
	                    if (height > targetHeight) {
	                        endTry_(height);
	                    }
	                }
	            }
	            return height;
	        })(accHeight);
	    }
	
	    function tryToLoadItems_(itemLayoutInfo, visibleRect) {
	        var self = this;
	        var grid = self.grid;
	        var width = itemLayoutInfo.contentSize.width;
	        var contentInfo = itemLayoutInfo.contentInfo;
	        var containerSize = getContainerInnerSize_.call(self);
	
	        self.status_ = STATUS_LOADING;
	        //init rect
	        contentInfo.freeRectangles.push(new MasonryRect(0, 0, width, POSITIVE_INFINITY));
	        loadItems_.call(self, itemLayoutInfo, visibleRect, false, function(contentSize, sync) {
	            if (self.options.showScrollBar && contentSize.height > containerSize.height) {
	                self.hasScrollBar_ = true;
	                self.contentSize_ = {
	                    width: contentSize.width - domUtil.getScrollbarSize().width,
	                    height: contentSize.height
	                };
	                self.cachedContentSize_ = self.contentSize_;
	                self.reLayout_();
	            } else {
	                self.contentSize_ = contentSize;
	            }
	            //if asynchronous do invalidate
	            if (sync === false) {
	                grid.invalidate();
	            }
	            self.status_ = STATUS_IDLE;
	        });
	    }
	
	    function modeToHeight_(refreshMode) {
	        var self = this;
	        var containerSize = getContainerInnerSize_.call(self);
	        var refreshHeight;
	        switch (refreshMode) {
	            case QUARTER_CONTAINER_HEIGHT:
	                refreshHeight = containerSize.height / 4;
	                break;
	            case HALF_CONTAINER_HEIGHT:
	                refreshHeight = containerSize.height / 2;
	                break;
	            case CONTAINER_HEIGHT:
	                refreshHeight = containerSize.height;
	                break;
	            case ALL_HEIGHT:
	                refreshHeight = POSITIVE_INFINITY;
	                break;
	            default:
	                refreshHeight = parseFloat(refreshMode);
	                refreshHeight = gcUtils.isNumber(refreshHeight) ?
	                    mathMax(refreshHeight, 0) :
	                    0;
	        }
	        return refreshHeight;
	    }
	
	    /**
	     * fill items to the visible rectangle.
	     * @param itemLayoutInfo
	     * @param visibleRect
	     * @param reload
	     * @param callback
	     * @private
	     */
	    function loadItems_(itemLayoutInfo, visibleRect, reload, callback) {
	        var self = this;
	        var contentInfo = itemLayoutInfo.contentInfo;
	        var contentSize = itemLayoutInfo.contentSize;
	        var targetHeight = visibleRect.bottom;
	        var lastItem = contentInfo.renderedItems > 0 && getItemInfoByIndex_.call(self, contentInfo.renderedItems - 1, contentInfo.group);
	        if (lastItem && (lastItem.rect.top > targetHeight)) {
	            callback(contentSize, true);
	            return;
	        }
	        var itemCount = contentInfo.itemCount;
	        var contentWidth = contentSize.width;
	        var currentContentSize = _.clone(contentSize);
	        var allSynFlag = true;
	        var done = false;
	
	        //todo: throw error when loop too many times or loaded too many items.
	        (function loop() {
	            if (done) {
	                callback(currentContentSize, allSynFlag);
	                return;
	            }
	            var start = contentInfo.renderedItems;
	            var end = mathMin(contentInfo.renderedItems + BUFFER_LENGTH, itemCount);
	            getItemRectangles_.call(self, itemLayoutInfo, {start: start, end: end}, reload, function(items, sync) {
	                allSynFlag = allSynFlag && sync;
	                contentInfo.renderedItems += end - start;
	                var placedItemRectArr = placeItems_.call(self, items, contentInfo, contentWidth);
	                var height = getMaxHeightByFreeRectArr_(contentInfo.freeRectangles);
	                currentContentSize = {
	                    width: contentWidth,
	                    height: height
	                };
	                var maximumTop = 0;
	                _.forEach(placedItemRectArr, function(itemRect) {
	                    maximumTop = mathMax(maximumTop, itemRect.top);
	                });
	                if (maximumTop > targetHeight || contentInfo.renderedItems === itemCount) {
	                    done = true;
	                }
	                loop();
	            });
	        })();
	    }
	
	    //todo: handle video tag size
	    //by durationchange event and error event
	    function getItemRectangles_(itemLayoutInfo, indexRange, reload, callback) {
	        var self = this;
	
	        function updateImage_() {
	            --imgTagCount;
	            if (imgTagCount === 0) {
	                _.forEach(query, function(img) {
	                    img.removeEventListener('load', updateImage_);
	                    img.removeEventListener('error', updateImage_);
	                });
	                var itemRectArr = [];
	                for (i = 0, len = itemInfoArr.length; i < len; ++i) {
	                    //get loaded item size.
	                    item = itemInfoArr[i];
	                    itemRectArr.push(item.rect = getElementMasonryRect_.call(self, bufferContainer.children[i]));
	                }
	                document.body.removeChild(bufferContainer);
	                if (_.isFunction(callback)) {
	                    callback(itemRectArr, false);
	                }
	            }
	        }
	
	        //get item html
	        var i;
	        var len;
	        var index;
	        var item;
	        var itemInfo;
	        var itemInfoArr = [];
	        var itemCount = indexRange.end - indexRange.start;
	        var fragment = '';
	        var group = itemLayoutInfo.contentInfo.group;
	        for (i = 0; i < itemCount; ++i) {
	            itemInfoArr.push(itemInfo = getItemInfoByIndex_.call(self, index = i + indexRange.start, group));
	            item = getItemDataByIndex_.call(self, index, group);
	            if (reload || !itemInfo.rect) {
	                //fragment += itemInfo.html = self.getRowTemplate()(item);
	                fragment += '<div style="position:absolute;">' + (itemInfo.html = self.getRowTemplate()(item)) + '</div>';
	            }
	        }
	        //var contentSize = itemLayoutInfo.contentSize;
	        //var bufferContainer = domUtil.createElement('<div style="left:-10000px;top:-10000px;width:' + contentSize.width +
	        //'px;height:' + contentSize.height +
	        //'px;position:absolute;"></div>');
	        var bufferContainer = domUtil.createElement('<div style="left:-10000px;top:-10000px;position:absolute;"></div>');
	        bufferContainer.innerHTML = fragment;
	        var imgTagCount;
	        var query = bufferContainer.querySelectorAll('img');
	        len = imgTagCount = query.length;
	
	        for (i = 0; i < len; ++i) {
	            if (query[i].complete) {
	                --imgTagCount;
	            } else {
	                query[i].addEventListener('load', updateImage_);
	                query[i].addEventListener('error', updateImage_);
	            }
	        }
	
	        //append items and measure size
	        document.body.appendChild(bufferContainer);
	
	        //if there are no image tags, directly load size
	        //Note: this block precess synchronously
	        if (imgTagCount === 0) {
	            var itemRectArr = [];
	            for (i = 0, len = itemInfoArr.length; i < len; ++i) {
	                //get loaded item size.
	                item = itemInfoArr[i];
	                itemRectArr.push(item.rect = getElementMasonryRect_.call(self, bufferContainer.children[i]));
	            }
	            document.body.removeChild(bufferContainer);
	            if (_.isFunction(callback)) {
	                callback(itemRectArr, true);
	            }
	        }
	    }
	
	    function getItemDataByIndex_(index, group) {
	        var grid = this.grid;
	        return group ? grid.formatDataItem(group.getItem(index)) : grid.getFormattedDataItem(index);
	    }
	
	    function getItemInfoByIndex_(index, group) {
	        var self = this;
	        var calcSource = self.grid.data.calcSource;
	        return group ?
	            self.items_[group.toSourceRow(index)] :
	            self.items_[calcSource.mapToSourceRow(index)];
	    }
	
	    function getElementMasonryRect_(element) {
	        var self = this;
	        var options = self.options;
	        var columnWidth = options.columnWidth;
	        var rowHeight = options.rowHeight;
	        var rectSize = domUtil.getElementRect(element);
	        var width = mathCeil(rectSize.width / columnWidth) * columnWidth;
	        var height = mathCeil(rectSize.height / rowHeight) * rowHeight;
	        self.minItemWidth_ = mathMin(width, self.minItemWidth_);
	        self.minItemHeight_ = mathMin(height, self.minItemHeight_);
	        return new MasonryRect(
	            0,
	            0,
	            width,
	            height
	        );
	    }
	
	    function getMaxHeightByFreeRectArr_(freeRectArr) {
	        return (!freeRectArr || freeRectArr.length === 0) ? 0 : freeRectArr[freeRectArr.length - 1].top;
	    }
	
	    function placeItems_(items, contentInfo, contentWidth) {
	        var self = this;
	        var options = self.options;
	        var stepByStep = options.keepOrder;
	        var rightToLeft = options.rightToLeft;
	        var gutter = options.gutter;
	        var itemRectArr = items.slice();
	        var itemRectArrWithGutter = itemRectArr.map(function(item) {
	            var rect = item.clone();
	            rect.height += gutter;
	            rect.width += gutter;
	            return rect;
	        });
	
	        var searchLength = stepByStep ? 1 : FIT_SEARCH_LENGTH;
	
	        while (itemRectArr.length > 0) {
	            var freeRectangles = contentInfo.freeRectangles;
	            var newFreeRectangles = [];
	            var fit = false;
	            var itemRect;
	            var itemRectWithGutter;
	            for (var i = 0, len = freeRectangles.length; i < len; ++i) {
	                //fitsMost will return false while all input rectangles do not fit
	                var index = freeRectangles[i].fitsMost(
	                    itemRectArr,
	                    gutter,
	                    contentWidth,
	                    searchLength
	                );
	                if (index !== false) {
	                    itemRect = itemRectArr[index];
	                    itemRectWithGutter = itemRectArrWithGutter[index];
	                    itemRectArr.splice(index, 1);
	                    itemRectArrWithGutter.splice(index, 1);
	                    newFreeRectangles = newFreeRectangles.concat(freeRectangles[i].placeRectWithGutter(itemRect, itemRectWithGutter, rightToLeft));
	                    for (var j = 0, lenJ = freeRectangles.length; j < lenJ; ++j) {
	                        if (j !== i) {
	                            newFreeRectangles = newFreeRectangles.concat(freeRectangles[j].partitionRect(itemRectWithGutter));
	                        }
	                    }
	                    fit = true;
	                    break;
	                }
	            }
	            if (fit) {
	                mergeRectArr_.call(self, newFreeRectangles);
	                //sort spaces, fill higher ones first.
	                contentInfo.freeRectangles = newFreeRectangles.sort(function(rect1, rect2) {
	                    return rect1.top > rect2.top ? 1 : (rect1.top === rect2.top ? 0 : -1);
	                });
	            } else {
	                itemRectArr.splice(0, searchLength);
	            }
	        }
	
	        return items;
	    }
	
	    function mergeRectArr_(rectArr) {
	        //todo: accelerate merge
	        //plan1: prune small rect (done)
	        //plan2: prune remote rect
	        var self = this;
	        var gutter = self.options.gutter;
	        var pruneFlag = rectArr.length > PRUNE_FREE_RECT_START_AT;
	        for (var i = 0; i < rectArr.length; ++i) {
	            var currentRect = rectArr[i];
	            if (!currentRect || pruneFlag && !currentRect.fits({width: self.minItemWidth_ + gutter, height: self.minItemHeight_ + gutter})) {
	                rectArr.splice(i, 1);
	                --i;
	                continue;
	            }
	            for (var j = 0; j < rectArr.length; ++j) {
	                if (j < i) {
	                    if (currentRect.contains(rectArr[j])) {
	                        rectArr.splice(j, 1);
	                        --j;
	                        --i;
	                    }
	                } else if (j > i) {
	                    if (currentRect.contains(rectArr[j])) {
	                        rectArr.splice(j, 1);
	                        --j;
	                    }
	                }
	            }
	        }
	    }
	
	    function getContainerInnerSize_() {
	        var self = this;
	        return self.containerInnerSize_ || (self.containerInnerSize_ = domUtil.getContentRect(self.grid.container));
	    }
	
	    function getContentSize_() {
	        var self = this;
	        var grid = self.grid;
	        if (!self.contentSize_) {
	            var containerSize = getContainerInnerSize_.call(self);
	            self.contentSize_ = self.cachedContentSize_ ? _.clone(self.cachedContentSize_) : _.clone(containerSize);
	            var visibleRect = new MasonryRect(0, 0, containerSize.width, containerSize.height + grid.scrollOffset.top);
	            if (grid.data.groups) {
	                tryToLoadGroups_.call(self, grid.groupInfos_, visibleRect);
	            } else {
	                var itemLayoutInfo = {
	                    contentSize: {
	                        width: containerSize.width,
	                        height: containerSize.height
	                    },
	                    contentInfo: self.contentInfo_
	                };
	                tryToLoadItems_.call(self, itemLayoutInfo, visibleRect);
	            }
	        }
	        return self.contentSize_;
	    }
	
	    function getViewportLayoutInfo_() {
	        var self = this;
	        var containerSize = getContainerInnerSize_.call(self);
	        var contentSize = getContentSize_.call(self);
	        return {
	            top: 0,
	            left: 0,
	            width: contentSize.width,
	            height: containerSize.height,
	            contentWidth: contentSize.width,
	            contentHeight: contentSize.height
	        };
	    }
	
	    function getRawRowTemplate_() {
	        var rowTmpl = this.options.rowTemplate;
	        if (rowTmpl) {
	            if (gcUtils.isString(rowTmpl) && rowTmpl.length > 1 && rowTmpl[0] === '#') {
	                var tmplElement = document.getElementById(rowTmpl.slice(1));
	                return '<div>' + tmplElement.innerHTML + '</div>';
	            } else {
	                return rowTmpl;
	            }
	        } else {
	            return getDefaultRawRowTemplate_.call(this);
	        }
	    }
	
	    function getDefaultRawRowTemplate_() {
	        var self = this;
	        var cols = self.grid.columns;
	
	        var r = '<div>';
	        _.each(cols, function(col) {
	            if (col.visible) {
	                r += '<div class="gc-row-column" style="' + (col.visible ? '' : 'display:none') + '" data-column="' + col.id + '"></div>';
	            }
	        });
	        r += '</div>';
	        return r;
	    }
	
	    function getTemplate_() {
	        var self = this;
	        if (self.rowTemplateFn_) {
	            return self.rowTemplateFn_;
	        }
	        var templateStr = getRawRowTemplate_.call(this);
	        var oldColTmpl;
	        var newColTmpl;
	        var id;
	        var cssName;
	        var tagName;
	        var colTmpl;
	        var colAnnotation;
	
	        var element = domUtil.createElement(templateStr);
	        //Different browsers may return different innerHTMLs compared with the original HTML,
	        //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	        templateStr = domUtil.getElementInnerText(element);
	
	        var annotationCols = element.querySelectorAll('[data-column]');
	        _.each(annotationCols, function(annotationCol, index) {
	            var col = self.grid.getColById_(annotationCol.getAttribute('data-column'));
	            if (col && col.dataField) {
	                if (col.isCalcColumn_) {
	                    colAnnotation = '{{=it.' + col.id + '}}';
	                } else {
	                    var dataFields = col.dataField.split(',');
	                    if (dataFields.length === 1) {
	                        colAnnotation = col.presenter || '{{=it.' + col.dataField + '}}';
	                    } else {
	                        var temp = [];
	                        _.each(dataFields, function(dataField) {
	                            temp.push(self.grid.getColById_.call(self, dataField).presenter || '{{=it.' + col.dataField + '}}');
	                        });
	                        colAnnotation = temp.join(' ');
	                    }
	                }
	            } else {
	                colAnnotation = '';
	            }
	            colTmpl = annotationCol;
	            tagName = colTmpl.tagName;
	            oldColTmpl = domUtil.getElementOuterText(colTmpl);
	            id = 'c' + index;
	            cssName = 'gc-cell';
	
	            newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                '<div style="overflow:hidden;"><div class="' + cssName + ' ' + id + '"' + ' role="gridcell">' +
	                colAnnotation + '</div></div></' + tagName + '>';
	
	            //outerHTML returns double quotes in attribute sometimes
	            if (templateStr.indexOf(oldColTmpl) === -1) {
	                oldColTmpl = oldColTmpl.replace(/"/g, '\'');
	            }
	            templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	        });
	
	        self.rowTemplateFn_ = doT.template(templateStr, null, null, true);
	        return self.rowTemplateFn_;
	    }
	
	    function getRenderInfoInternal_(options, getUpdateRow) {
	        var self = this;
	        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	        var visibleRect = new MasonryRect(options.offsetLeft, options.offsetTop, layoutInfo.width, layoutInfo.height);
	        return self.grid.data.groups ?
	            getRenderedGroupItemsInfo_.call(self, visibleRect, getUpdateRow) :
	            getRenderedItemsInfo_.call(self, visibleRect, getUpdateRow);
	    }
	
	    function getRenderedGroupItemsInfo_(visibleRect, getUpdateRow) {
	        var self = this;
	        var rows = [];
	        var grid = self.grid;
	        var entireGroupInfos = grid.groupInfos_;
	        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	        var rightToLeft = self.options.rightToLeft;
	        var groupElement;
	        var groupInfo;
	        var groupRect = new MasonryRect(0, 0, layoutInfo.contentWidth, 0);
	        var i;
	        var key;
	
	        var groupElementStack = [];
	        for (i = entireGroupInfos.length - 1; i > -1; --i) {
	            groupElementStack.push({
	                path: [i],
	                groupInfo: entireGroupInfos[i],
	                area: GROUP_HEADER
	            });
	        }
	
	        var startRender = false;
	        var endRender = false;
	        //start render, flags are for quick exit.
	        while (groupElementStack.length > 0) {
	            if (endRender) {
	                break;
	            }
	            groupElement = groupElementStack.pop();
	            groupInfo = groupElement.groupInfo;
	            var group = groupInfo.data;
	            var area = groupElement.area;
	            var header;
	            var footer;
	            var pathStr = groupInfo.path.join('_');
	            //render:
	            if (area === GROUP_HEADER) {
	                header = group.groupDescriptor.header;
	                if (header && header.visible) {
	                    groupRect.height = self.getGroupHeaderHeight_(group);
	                    if (!startRender) {
	                        if (visibleRect.overlaps(groupRect)) {
	                            startRender = true;
	                        } else {
	                            groupRect.top += groupRect.height;
	                        }
	                    }
	                }
	                if (startRender) {
	                    key = grid.uid + '-gh' + pathStr;
	                    if (getUpdateRow) {
	                        rows.push({
	                            key: key,
	                            info: groupElement,
	                            bounds: groupRect.clone()
	                        });
	                    } else {
	                        rows.push(getGroupHeaderRow_.call(self, key, groupElement, groupInfo, groupRect));
	                    }
	                    groupRect.top += groupRect.height;
	                    if (!visibleRect.overlaps(groupRect)) {
	                        endRender = true;
	                    }
	                }
	            } else if (area === GROUP_CONTENT) {
	                groupRect.height = self.getInnerGroupHeight(groupInfo);
	                if (!startRender) {
	                    if (visibleRect.overlaps(groupRect)) {
	                        startRender = true;
	                    } else {
	                        groupRect.top += groupRect.height;
	                    }
	                }
	                if (startRender) {
	                    rows = rows.concat(getRenderedGroupContentItemsInfo_.call(self, groupInfo, groupRect, visibleRect, getUpdateRow));
	                    groupRect.top += groupRect.height;
	                    if (!visibleRect.overlaps(groupRect)) {
	                        endRender = true;
	                    }
	                }
	            } else {
	                footer = groupInfo.data.groupDescriptor.footer;
	                if (footer && footer.visible) {
	                    groupRect.height = self.getGroupFooterHeight_(group);
	                    if (!startRender) {
	                        if (visibleRect.overlaps(groupRect)) {
	                            startRender = true;
	                        } else {
	                            groupRect.top += groupRect.height;
	                        }
	                    }
	                    if (startRender) {
	                        key = grid.uid + '-gf' + groupElement.path.join('_');
	                        if (getUpdateRow) {
	                            rows.push({
	                                key: key,
	                                info: groupElement,
	                                bounds: groupRect.clone()
	                            });
	                        } else {
	                            rows.push(getGroupFooterRow_.call(self, key, groupElement, groupRect, rightToLeft));
	                        }
	                        groupRect.top += groupRect.height;
	                        if (!visibleRect.overlaps(groupRect)) {
	                            endRender = true;
	                        }
	                    }
	                }
	            }
	
	            //traverse:
	            if (area === GROUP_HEADER) {
	                footer = group.groupDescriptor.footer;
	                if (group.collapsed) {
	                    if (!group.isBottomLevel && footer && footer.visible && !footer.collapseWithGroup) {
	                        groupElementStack.push({
	                            path: groupElement.path,
	                            groupInfo: groupInfo,
	                            area: GROUP_FOOTER
	                        });
	                    }
	                } else {
	                    if (footer && footer.visible) {
	                        groupElementStack.push({
	                            path: groupElement.path,
	                            groupInfo: groupInfo,
	                            area: GROUP_FOOTER
	                        });
	                    }
	
	                    if (group.isBottomLevel) {
	                        groupElementStack.push({
	                            path: groupElement.path,
	                            groupInfo: groupInfo,
	                            area: GROUP_CONTENT
	                        });
	                    } else {
	                        for (i = group.isBottomLevel ? group.itemCount : groupInfo.children.length - 1; i > -1; --i) {
	                            groupElementStack.push({
	                                path: groupElement.path.slice().concat([i]),
	                                groupInfo: groupInfo.children[i],
	                                area: GROUP_HEADER
	                            });
	                        }
	                    }
	                }
	            }
	        }
	
	        return rows;
	    }
	
	    function getRenderedGroupContentItemsInfo_(groupInfo, groupRect, visibleRect, getUpdateRow, additionalCSSClass, additionalStyle) {
	        var self = this;
	        var grid = self.grid;
	        if (!grid.data.groups) {
	            return [];
	        }
	        var pathStr = groupInfo.path.join('_');
	        var keyBase = self.grid.uid + '-gr' + pathStr + '-r';
	        var contentInfo = self.groupContentInfo_[pathStr];
	        var rows = [];
	        var relativeRect;
	        var vectorY = groupRect.top;
	        // for each items which have index < loadedItems, check the placed property
	        // if placed and overlaps to the visual(or visual group) rectangle, render it
	        //todo: refine the search order.
	        for (var i = 0, len = contentInfo.renderedItems; i < len; ++i) {
	            var item = getItemInfoByIndex_.call(self, i, groupInfo.data);
	            var rect = item.rect;
	            relativeRect = rect.clone();
	            relativeRect.top += vectorY;
	            var key = keyBase + i;
	            if (visibleRect.overlaps(relativeRect)) {
	                rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, key, i, relativeRect, getUpdateRow, additionalCSSClass, additionalStyle));
	            }
	        }
	        relativeRect = null;
	        return rows;
	    }
	
	    function getRenderedGroupContentItemInfo_(groupInfo, key, i, rect, getUpdateRow, additionalCSSClass, additionalStyle) {
	        var path = groupInfo.path;
	        if (getUpdateRow) {
	            return {
	                key: key,
	                info: {
	                    path: path,
	                    itemIndex: i,
	                    area: GROUP_CONTENT
	                },
	                bounds: rect.clone(),
	                index: i
	            };
	        } else {
	            return getGroupContentRow_.call(this, key, i, rect, groupInfo, additionalCSSClass, additionalStyle);
	        }
	    }
	
	    function getGroupHeaderRow_(key, groupElement, groupInfo, rect) {
	        var self = this;
	
	        return {
	            key: key,
	            isRowRole: false,
	            renderInfo: getGroupHeaderRenderInfo_.call(self, groupElement.path, groupInfo, rect)
	        };
	    }
	
	    function getGroupContentRow_(key, rowIndex, rect, groupInfo, additionalCSSClass, additionalStyle) {
	        var self = this;
	
	        return {
	            key: key,
	            isRowRole: true,
	            renderInfo: getGroupRowRenderInfo_.call(self, rowIndex, groupInfo, rect, additionalCSSClass, additionalStyle)
	        };
	    }
	
	    function getGroupFooterRow_(key, currInfo, groupInfo, rect, rightToLeft) {
	        var self = this;
	        return {
	            key: key,
	            isRowRole: false,
	            renderInfo: getGroupFooterRenderInfo_.call(self, currInfo.path, groupInfo, rect, rightToLeft)
	        };
	    }
	
	    function getGroupHeaderRenderInfo_(groupPath, groupInfo, rect) {
	        return {
	            cssClass: 'gc-row g' + groupPath.join('_'),
	            style: {
	                top: rect.top,
	                left: rect.left,
	                height: rect.height,
	                width: rect.width
	            },
	            renderedHTML: renderGroupHeader_.call(this, groupInfo)
	        };
	    }
	
	    function renderGroupHeader_(groupInfo) {
	        var self = this;
	        var group = groupInfo.data;
	        var name = group.name;
	
	        //TODO: use formatter?
	        if (Object.prototype.toString.call(name) === '[object Date]') {
	            name = name.toISOString().slice(0, 10);
	        }
	
	        var data = {
	            level: group.level,
	            margin: group.level * GROUP_INDENT,
	            groupStatus: group.collapsed ? 'collapsed' : 'expand',
	            condition: group.groupDescriptor.field,
	            name: name,
	            count: group.itemCount
	        };
	
	        return doT.template(getGroupHeaderTemplate_.call(self, group), null, null, true)(data);
	    }
	
	    function getGroupHeaderTemplate_(group) {
	        var self = this;
	        var height = self.getGroupHeaderHeight_(group);
	        var rightToLeft = self.options.rightToLeft;
	        var defaultTemplate;
	        if (rightToLeft) {
	            defaultTemplate = '<div class="gc-group-header gc-group-header-cell" style="height:' + height + 'px;line-height:' + height + 'px;">' +
	                '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-right:{{=it.margin}}px;"></span><span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                '</div>';
	        } else {
	            defaultTemplate = '<div class="gc-group-header gc-group-header-cell " style="height:' + height + 'px;line-height:' + height + 'px;">' +
	                '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-left:{{=it.margin}}px;"></span><span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                '</div>';
	        }
	        return group.groupDescriptor.header.template || defaultTemplate;
	    }
	
	    function getGroupRowRenderInfo_(rowIndex, groupInfo, rect, additionalCSSClass, additionalStyle) {
	        var self = this;
	        var style = rect.getStyle();
	        style = additionalStyle ? _.assign(additionalStyle, style) : style;
	        var item = getItemInfoByIndex_.call(self, rowIndex, groupInfo.data);
	        return {
	            cssClass: 'gc-row' + (additionalCSSClass ? (' ' + additionalCSSClass) : ''),
	            style: style,
	            renderedHTML: item.html
	        };
	    }
	
	    function getGroupFooterRenderInfo_(groupPath, groupInfo, rect, rightToLeft) {
	        var style = {
	            top: rect.top,
	            right: rect.left,
	            height: rect.height,
	            width: rect.width
	        };
	        return {
	            cssClass: 'gc-row g' + groupPath.join('_'),
	            style: style,
	            renderedHTML: '<div></div>'
	        };
	    }
	
	    function getRenderedItemsInfo_(visibleRect, getUpdateRow) {
	        var self = this;
	        var rows = [];
	        var grid = self.grid;
	        // for each items which have index < loadedItems, check the placed property
	        // if placed and overlaps to the visual(or visual group) rectangle, render it
	        //todo: refine the search order.
	        for (var i = 0, len = self.contentInfo_.renderedItems; i < len; ++i) {
	            var item = getItemInfoByIndex_.call(self, i);
	            var rect = item.rect;
	            var key = grid.uid + '-r' + i;
	            if (visibleRect.overlaps(rect)) {
	                rows.push({
	                    key: key,
	                    index: i,
	                    renderInfo: {
	                        cssClass: 'gc-row r' + i,
	                        style: rect.getStyle(),
	                        renderedHTML: item.html
	                    }
	                });
	            }
	        }
	        return rows;
	    }
	
	    function getRenderRowInfoInternal(key, index) {
	        var self = this;
	        var item = self.items_[index];
	
	        return {
	            key: key,
	            index: index,
	            renderInfo: {
	                cssClass: 'gc-row r' + index,
	                style: item.rect.getStyle(),
	                renderedHTML: item.html
	            }
	        };
	    }
	
	    //function handleMouseClick(sender, e) {
	    //    var layoutEngine = sender.layoutEngine;
	    //    var hitTestInfo = layoutEngine.hitTest(e);
	    //    console.log(hitTestInfo.groupInfo.row);
	    //}
	
	    function handleMouseWheel(sender, e) {
	        var grid = sender;
	        var layoutInfo;
	        var layoutEngine = grid.layoutEngine;
	        if (!layoutEngine.options.showScrollBar || !layoutEngine.hasScrollBar_) {
	            return;
	        }
	
	        var offsetDelta = e.deltaY;
	
	        //simulate scroll
	        if (offsetDelta !== 0) {
	            layoutInfo = layoutEngine.getLayoutInfo()[VIEWPORT];
	            var maxOffsetTop = mathMax(layoutInfo.contentHeight - layoutInfo.height, 0);
	            var offsetTop = grid.scrollOffset.top;
	            var scrollTop;
	            if (offsetDelta > 0) {
	                if (offsetTop >= maxOffsetTop) {
	                    return;
	                } else {
	                    scrollTop = mathMin(offsetTop + offsetDelta, maxOffsetTop);
	                }
	            } else if (offsetDelta < 0) {
	                if (offsetTop === 0) {
	                    return;
	                } else {
	                    scrollTop = mathMax(offsetTop + offsetDelta, 0);
	                }
	            }
	            domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel').scrollTop = scrollTop;
	        }
	        e.preventDefault();
	    }
	
	    function handleMouseDown(sender, e) {
	        var grid = sender;
	        var self = sender.layoutEngine;
	        var hitInfo;
	        //if (!hitInfo) {
	        self.hitTestInfo_ = self.hitTest(e);
	        hitInfo = self.hitTestInfo_;
	        // }
	        if (!hitInfo) {
	            return;
	        }
	
	        self.mouseDownPoint_ = {
	            left: e.pageX,
	            top: e.pageY
	        };
	
	        var selector;
	        var groupInfo = hitInfo.groupInfo;
	        var group;
	        if (groupInfo) {
	            if (groupInfo.area === GROUP_CONTENT && groupInfo.row >= 0) {
	                selector = self.grid.uid + '-gr' + groupInfo.path.join('_') + '-r' + groupInfo.row;
	            } else if (groupInfo.area === GROUP_FOOTER) {
	                selector = self.grid.uid + '-gf' + groupInfo.path.join('_');
	            } else if (groupInfo.area === GROUP_HEADER) {
	                if (groupInfo.onExpandToggle) {
	                    group = self.grid.getGroupInfo_(groupInfo.path).data;
	                    group.collapsed = !group.collapsed;
	                    if (self.status_ === STATUS_IDLE) {
	                        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	                        var visibleRect = new MasonryRect(0, grid.scrollOffset.top, layoutInfo.contentWidth, layoutInfo.height);
	                        var refreshHeight = modeToHeight_.call(self, QUARTER_CONTAINER_HEIGHT);
	                        var allRendered = _.every(self.groupContentInfo_, function(contentInfo) {
	                            return contentInfo.renderedItems === contentInfo.itemCount;
	                        });
	                        if (!allRendered) {
	                            self.status_ = STATUS_LOADING;
	                            visibleRect.height += refreshHeight;
	                            loadGroups_.call(self, grid.groupInfos_, visibleRect, false, function(contentSize) {
	                                self.contentSize_ = contentSize;
	                                grid.invalidate();
	                                self.status_ = STATUS_IDLE;
	                            });
	                        } else {
	                            self.status_ = STATUS_LOADING;
	                            grid.invalidate();
	                            self.status_ = STATUS_IDLE;
	                        }
	                    }
	                }
	            }
	        }
	    }
	
	    module.exports = MasonryLayoutEngine;
	})();


/***/ },
/* 1 */
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// doT.js
	// 2011-2014, Laura Doktorova, https://github.com/olado/doT
	// Licensed under the MIT license.
	
	/* jshint ignore:start */
	
	(function() {
	    "use strict";
	
	    var doT = {
	        version: "1.0.3",
	        templateSettings: {
	            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
	            interpolate: /\{\{=([\s\S]+?)\}\}/g,
	            encode: /\{\{!([\s\S]+?)\}\}/g,
	            use: /\{\{#([\s\S]+?)\}\}/g,
	            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	            defineParams: /^\s*([\w$]+):([\s\S]+)/,
	            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	            varname: "it",
	            strip: true,
	            append: true,
	            selfcontained: false,
	            doNotSkipEncoded: false
	        },
	        template: undefined, //fn, compile template
	        compile: undefined  //fn, for express
	    }, _globals;
	
	    doT.encodeHTMLSource = function(doNotSkipEncoded) {
	        var encodeHTMLRules = {"&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;"},
	            matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
	        return function(code) {
	            return code ? code.toString().replace(matchHTML, function(m) {
	                return encodeHTMLRules[m] || m;
	            }) : "";
	        };
	    };
	
	
	    _globals = (function() {
	        return this || (0, eval)("this");
	    }());
	
	    //Hiber
	    //replate the module definition with simple module.exports since we only run
	    //it in node like environment
	
	    module.exports = doT;
	    //if (typeof module !== "undefined" && module.exports) {
	    //
	    //} else if (typeof define === "function" && define.amd) {
	    //	define(function(){return doT;});
	    //} else {
	    //	_globals.doT = doT;
	    //}
	
	    var startend = {
	        append: {start: "'+(", end: ")+'", startencode: "'+encodeHTML("},
	        split: {start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
	    }, skip = /$^/;
	
	    function resolveDefs(c, block, def) {
	        return ((typeof block === "string") ? block : block.toString())
	            .replace(c.define || skip, function(m, code, assign, value) {
	                if (code.indexOf("def.") === 0) {
	                    code = code.substring(4);
	                }
	                if (!(code in def)) {
	                    if (assign === ":") {
	                        if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
	                            def[code] = {arg: param, text: v};
	                        });
	                        if (!(code in def)) def[code] = value;
	                    } else {
	                        new Function("def", "def['" + code + "']=" + value)(def);
	                    }
	                }
	                return "";
	            })
	            .replace(c.use || skip, function(m, code) {
	                if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
	                    if (def[d] && def[d].arg && param) {
	                        var rw = (d + ":" + param).replace(/'|\\/g, "_");
	                        def.__exp = def.__exp || {};
	                        def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
	                        return s + "def.__exp['" + rw + "']";
	                    }
	                });
	                var v = new Function("def", "return " + code)(def);
	                return v ? resolveDefs(c, v, def) : v;
	            });
	    }
	
	    function unescape(code) {
	        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	    }
	
	    doT.template = function(tmpl, c, def, dontRenderNullOrUndefined) {
	        c = c || doT.templateSettings;
	        var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
	            str = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;
	
	        var unescapeCode;
	
	        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
	            .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str)
	            .replace(/'|\\/g, "\\$&")
	            .replace(c.interpolate || skip, function(m, code) {
	                if (!!dontRenderNullOrUndefined) {
	                    unescapeCode = unescape(code);
	                    if (code.indexOf('||') >= 0) {
	                        return cse.start + unescapeCode + cse.end;
	                    } else {
	                        return cse.start + '(typeof ' + code + ' !== "undefined" && ' + code + '!== null)?' + unescapeCode + ': ""' + cse.end;
	                    }
	                } else {
	                    return cse.start + unescape(code) + cse.end;
	                }
	
	                return cse.start + unescape(code) + cse.end;
	            })
	            .replace(c.encode || skip, function(m, code) {
	                needhtmlencode = true;
	                return cse.startencode + unescape(code) + cse.end;
	            })
	            .replace(c.conditional || skip, function(m, elsecase, code) {
	                return elsecase ?
	                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
	                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
	            })
	            .replace(c.iterate || skip, function(m, iterate, vname, iname) {
	                if (!iterate) return "';} } out+='";
	                sid += 1;
	                indv = iname || "i" + sid;
	                iterate = unescape(iterate);
	                return '\';var arr' + sid + '=' + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){"
	                    + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
	            })
	            .replace(c.evaluate || skip, function(m, code) {
	                return "';" + unescape(code) + "out+='";
	            })
	        + "';return out;")
	            .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
	            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
	        //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');
	
	        if (needhtmlencode) {
	            if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
	            str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
	                + doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
	                + str;
	        }
	        try {
	            return new Function(c.varname, str);
	        } catch (e) {
	            if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
	            throw e;
	        }
	    };
	
	    doT.compile = function(tmpl, def) {
	        return doT.template(tmpl, null, def);
	    };
	
	}());
	
	/* jshint ignore:end */


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
	    var gcUtils = __webpack_require__(1);
	
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


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1YzQ4NzM5ODQxNjQxOTBhNGU4ZT8xMGJjKiIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2xheW91dEVuZ2luZXMvTWFzb25yeUxheW91dEVuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanM/YzgyZCoiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanM/NDkyOCoiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzP2QwY2QqIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsNkRBQTZELGlGQUFpRix1R0FBdUc7QUFDaFMsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTJELHVCQUF1QjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxzREFBcUQsU0FBUztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQix5Q0FBd0MsS0FBSyxXQUFXLFVBQVU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QjtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQSx3Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEM7QUFDMUMsa0JBQWlCO0FBQ2pCLHNDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1FQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGlEQUFnRDtBQUNoRCxtREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsZUFBZTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RCxVQUFTO0FBQ1Q7O0FBRUEsdUVBQXNFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUM3ekJEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QixFQUFFLFlBQVksTUFBTSxFQUFFO0FBQy9DLDZCQUE0QixFQUFFLGFBQWEsRUFBRTtBQUM3Qyx3QkFBdUIsRUFBRSxhQUFhLEVBQUU7QUFDeEMscUJBQW9CLEVBQUUsYUFBYSxFQUFFO0FBQ3JDLHNIQUFxSCxJQUFJLElBQUk7QUFDN0gsd0JBQXVCLEVBQUUscUNBQXFDLEVBQUU7QUFDaEU7QUFDQSw2QkFBNEIsRUFBRSx5QkFBeUIsRUFBRTtBQUN6RCx5QkFBd0IsRUFBRSxTQUFTLEVBQUUscURBQXFELEVBQUU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLGdDQUErQixXQUFXLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxFQUFFO0FBQ2xILHNFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCwwQkFBeUIsWUFBWTtBQUNyQyxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQix1REFBdUQ7QUFDeEUsaUJBQWdCLFVBQVUsaUJBQWlCLHlCQUF5QjtBQUNwRSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QztBQUN6QywwQkFBeUI7QUFDekI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1RUFBc0U7O0FBRXRFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsaUNBQWdDLGdDQUFnQyxjQUFjLEtBQUs7QUFDbkYsZ0NBQStCLDJCQUEyQixjQUFjO0FBQ3hFLGNBQWE7QUFDYjtBQUNBLDBDQUF5QyxFQUFFO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixtQ0FBbUMsbUJBQW1CLHVFQUF1RSxpQ0FBaUM7QUFDekwsaUVBQWdFO0FBQ2hFLGNBQWE7QUFDYjtBQUNBLDJCQUEwQjtBQUMxQixjQUFhO0FBQ2IsY0FBYSxXQUFXO0FBQ3hCO0FBQ0EsNEJBQTJCLEdBQUcsS0FBSyxVQUFVO0FBQzdDLDBCQUF5QixHQUFHLEtBQUs7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLDRGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7QUFFRDs7Ozs7OztBQ3pLQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsNEJBQTRCLE9BQU8sd0NBQXdDLE1BQU07QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdEQUErQyxzQkFBc0Isc0JBQXNCO0FBQzNGOztBQUVBO0FBQ0EsZ0RBQStDLHNCQUFzQixzQkFBc0I7QUFDM0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxRQUFRO0FBQ3ZCLGlCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQSw0QkFBMkIsR0FBRztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0VBQXVFLGNBQWMsZUFBZSxhQUFhLGNBQWMsaUJBQWlCO0FBQ2hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1hc29ucnlMYXlvdXRFbmdpbmVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiR2NTcHJlYWRcIl0gPSByb290W1wiR2NTcHJlYWRcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdW1wiTWFzb25yeUxheW91dEVuZ2luZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDVjNDg3Mzk4NDE2NDE5MGE0ZThlXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi4vZ2NVdGlscycpO1xuICAgIHZhciBkb1QgPSByZXF1aXJlKCcuLi9kb1QuanMnKTtcbiAgICB2YXIgZG9tVXRpbCA9IHJlcXVpcmUoJy4uL2RvbVV0aWwnKTtcblxuICAgIHZhciBQT1NfQUJTID0gJ2Fic29sdXRlJztcbiAgICB2YXIgUE9TX1JFTCA9ICdyZWxhdGl2ZSc7XG4gICAgdmFyIE9WRVJGTE9XX0hJRERFTiA9ICdoaWRkZW4nO1xuICAgIHZhciBPVkVSRkxPV19BVVRPID0gJ2F1dG8nO1xuICAgIHZhciBWSUVXUE9SVCA9ICd2aWV3cG9ydCc7XG4gICAgdmFyIEJVRkZFUl9MRU5HVEggPSA4O1xuICAgIHZhciBGSVRfU0VBUkNIX0xFTkdUSCA9IDEwO1xuICAgIHZhciBQUlVORV9GUkVFX1JFQ1RfU1RBUlRfQVQgPSAxMDA7XG4gICAgdmFyIFBPU0lUSVZFX0lORklOSVRZID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIC8vdmFyIGlzTmFOID0gTnVtYmVyLmlzTmFOO1xuICAgIHZhciBTVEFUVVNfSURMRSA9ICdpZGxlJztcbiAgICB2YXIgU1RBVFVTX0xPQURJTkcgPSAnbG9hZGluZyc7XG4gICAgLy92YXIgU1RBVFVTX1RSQU5TSVRJT05JTkcgPSAndHJhbnNpdGlvbmluZyc7XG4gICAgdmFyIFJUTF9DTEFTU19OQU1FID0gJ2djLXJ0bCc7XG4gICAgdmFyIEdST1VQX0hFQURFUiA9ICdncm91cEhlYWRlcic7XG4gICAgdmFyIEdST1VQX0ZPT1RFUiA9ICdncm91cEZvb3Rlcic7XG4gICAgdmFyIEdST1VQX0NPTlRFTlQgPSAnZ3JvdXBDb250ZW50JztcbiAgICB2YXIgUVVBUlRFUl9DT05UQUlORVJfSEVJR0hUID0gJ3F1YXJ0ZXItY29udGFpbmVyJztcbiAgICB2YXIgSEFMRl9DT05UQUlORVJfSEVJR0hUID0gJ2hhbGYtY29udGFpbmVyJztcbiAgICB2YXIgQ09OVEFJTkVSX0hFSUdIVCA9ICdjb250YWluZXInO1xuICAgIHZhciBBTExfSEVJR0hUID0gJ2luZmluaXRlJztcbiAgICB2YXIgREVGQVVMVF9IRUFERVJfSEVJR0hUID0gNDA7XG4gICAgdmFyIEdST1VQX0lOREVOVCA9IDE4O1xuICAgIHZhciBtYXRoTWluID0gTWF0aC5taW47XG4gICAgdmFyIG1hdGhNYXggPSBNYXRoLm1heDtcbiAgICB2YXIgbWF0aENlaWwgPSBNYXRoLmNlaWw7XG5cbiAgICB2YXIgb2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbiAgICB2YXIgTWFzb25yeVJlY3QgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIE1hc29ucnlSZWN0XyhsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYueDFfID0gbGVmdCB8fCAwO1xuICAgICAgICAgICAgc2VsZi55MV8gPSB0b3AgfHwgMDtcbiAgICAgICAgICAgIHNlbGYueDJfID0gc2VsZi54MV8gKyAoc2VsZi53XyA9IHdpZHRoIHx8IDApO1xuICAgICAgICAgICAgc2VsZi55Ml8gPSBzZWxmLnkxXyArIChzZWxmLmhfID0gaGVpZ2h0IHx8IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIE1hc29ucnlSZWN0UHJvdG8gPSBNYXNvbnJ5UmVjdF8ucHJvdG90eXBlO1xuXG4gICAgICAgIG9iamVjdERlZmluZVByb3BlcnR5KE1hc29ucnlSZWN0UHJvdG8sICdsZWZ0Jywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54MV87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYueDFfID0geDtcbiAgICAgICAgICAgICAgICBzZWxmLngyXyA9IHNlbGYueDFfICsgc2VsZi53XztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdERlZmluZVByb3BlcnR5KE1hc29ucnlSZWN0UHJvdG8sICd0b3AnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnkxXztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi55MV8gPSB5O1xuICAgICAgICAgICAgICAgIHNlbGYueTJfID0gc2VsZi55MV8gKyBzZWxmLmhfO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0RGVmaW5lUHJvcGVydHkoTWFzb25yeVJlY3RQcm90bywgJ3dpZHRoJywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53XztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi53XyA9IHc7XG4gICAgICAgICAgICAgICAgc2VsZi54Ml8gPSBzZWxmLngxXyArIHNlbGYud187XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3REZWZpbmVQcm9wZXJ0eShNYXNvbnJ5UmVjdFByb3RvLCAnaGVpZ2h0Jywge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oXztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi5oXyA9IGg7XG4gICAgICAgICAgICAgICAgc2VsZi55Ml8gPSBzZWxmLnkxXyArIHNlbGYuaF87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3REZWZpbmVQcm9wZXJ0eShNYXNvbnJ5UmVjdFByb3RvLCAncmlnaHQnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLngyXztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi54Ml8gPSB4O1xuICAgICAgICAgICAgICAgIHNlbGYueDFfID0gc2VsZi54Ml8gLSBzZWxmLndfO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0RGVmaW5lUHJvcGVydHkoTWFzb25yeVJlY3RQcm90bywgJ2JvdHRvbScsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueTJfO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24oeSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLnkyXyA9IHk7XG4gICAgICAgICAgICAgICAgc2VsZi55MV8gPSBzZWxmLnkyXyAtIHNlbGYuaF87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hc29ucnlSZWN0XyhzZWxmLmxlZnQsIHNlbGYudG9wLCBzZWxmLndpZHRoLCBzZWxmLmhlaWdodCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWFzb25yeVJlY3RQcm90by5zZXRSZWN0ID0gZnVuY3Rpb24obGVmdE9yUmVjdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAobGVmdE9yUmVjdCBpbnN0YW5jZW9mIE1hc29ucnlSZWN0Xykge1xuICAgICAgICAgICAgICAgIHNlbGYueDFfID0gbGVmdE9yUmVjdC5sZWZ0O1xuICAgICAgICAgICAgICAgIHNlbGYueTFfID0gbGVmdE9yUmVjdC50b3A7XG4gICAgICAgICAgICAgICAgc2VsZi54Ml8gPSBzZWxmLngxXyArIChzZWxmLndfID0gbGVmdE9yUmVjdC53aWR0aCk7XG4gICAgICAgICAgICAgICAgc2VsZi55Ml8gPSBzZWxmLnkxXyArIChzZWxmLmhfID0gbGVmdE9yUmVjdC5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLngxXyA9IGxlZnRPclJlY3Q7XG4gICAgICAgICAgICAgICAgc2VsZi55MV8gPSB0b3A7XG4gICAgICAgICAgICAgICAgc2VsZi54Ml8gPSBzZWxmLngxXyArIChzZWxmLndfID0gd2lkdGgpO1xuICAgICAgICAgICAgICAgIHNlbGYueTJfID0gc2VsZi55MV8gKyAoc2VsZi5oXyA9IGhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgTWFzb25yeVJlY3RQcm90by5tb3ZlQnkgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLmxlZnQgKz0geDtcbiAgICAgICAgICAgIHNlbGYudG9wICs9IHk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLm1vdmVUbyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYubGVmdCA9IHg7XG4gICAgICAgICAgICBzZWxmLnRvcCA9IHk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLm92ZXJsYXBzID0gZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYm90dG9tID4gcmVjdC50b3AgJiYgcmVjdC5ib3R0b20gPiBzZWxmLnRvcCAmJlxuICAgICAgICAgICAgICAgIHNlbGYucmlnaHQgPiByZWN0LmxlZnQgJiYgcmVjdC5yaWdodCA+IHNlbGYubGVmdDtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy9xdWlja2VyIHRvIGNoZWNrIHZlcnRpY2FsIHBhcmFtZXRlciBmaXJzdCwgYmVjYXVzZSB1c3VhbGx5IHZlcnRpY2FsIGxlbmd0aCBpcyBiaWdnZXJcbiAgICAgICAgICAgIHJldHVybiByZWN0LnRvcCA+PSBzZWxmLnRvcCAmJiBzZWxmLmJvdHRvbSA+PSByZWN0LmJvdHRvbSAmJlxuICAgICAgICAgICAgICAgIHJlY3QubGVmdCA+PSBzZWxmLmxlZnQgJiYgc2VsZi5yaWdodCA+PSByZWN0LnJpZ2h0O1xuICAgICAgICB9O1xuXG4gICAgICAgIE1hc29ucnlSZWN0UHJvdG8uY29udGFpbnNQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAvL2lucHV0IHBvaW50IGFsc28gY291bGQgYmUgYSByZWN0YW5nbGUsIHRoZSByZWN0YW5nbGUgdG9wLWxlZnQgdmVydGV4IHdvdWxkIGJlIHVzZWQgYXMgdGhlIHBvaW50XG4gICAgICAgICAgICAvL3F1aWNrZXIgdG8gY2hlY2sgdmVydGljYWwgcGFyYW1ldGVyIGZpcnN0LCBiZWNhdXNlIHRvcCBpcyBzb3J0ZWRcbiAgICAgICAgICAgIHJldHVybiBwb2ludC50b3AgPj0gc2VsZi50b3AgJiYgc2VsZi5ib3R0b20gPiBwb2ludC50b3AgJiZcbiAgICAgICAgICAgICAgICBwb2ludC5sZWZ0ID49IHNlbGYubGVmdCAmJiBzZWxmLnJpZ2h0ID4gcG9pbnQubGVmdDtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLmNvbmdydWVudCA9IGZ1bmN0aW9uKHJlY3QpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiByZWN0LnRvcCA9PT0gc2VsZi50b3AgJiYgc2VsZi5oZWlnaHQgPT09IHJlY3QuaGVpZ2h0ICYmXG4gICAgICAgICAgICAgICAgcmVjdC5sZWZ0ID09PSBzZWxmLmxlZnQgJiYgc2VsZi53aWR0aCA9PT0gcmVjdC53aWR0aDtcbiAgICAgICAgfTtcblxuICAgICAgICAvL01hc29ucnlSZWN0UHJvdG8uY29udGFpbmVkQnkgPSBmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgIC8vICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gICAgcmV0dXJuIHNlbGYucmlnaHQgPD0gcmVjdC5yaWdodCAmJiByZWN0LmxlZnQgPD0gc2VsZi5sZWZ0ICYmXG4gICAgICAgIC8vICAgICAgICBzZWxmLmJvdHRvbSA8PSByZWN0LmJvdHRvbSAmJiByZWN0LnRvcCA8PSBzZWxmLnRvcDtcbiAgICAgICAgLy99O1xuXG4gICAgICAgIE1hc29ucnlSZWN0UHJvdG8uZml0cyA9IGZ1bmN0aW9uKHJlY3QpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmLndpZHRoID49IHJlY3Qud2lkdGggJiYgc2VsZi5oZWlnaHQgPj0gcmVjdC5oZWlnaHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWFzb25yeVJlY3RQcm90by5wYXJ0aXRpb25SZWN0ID0gZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAgICAgLy9yZXR1cm4gaW4gdGhlIG9yZGVyOiBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20sIGNsb2Nrd2lzZS5cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5vdmVybGFwcyhyZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFydGl0aW9uZWRSZWN0ID0gW107XG4gICAgICAgICAgICB2YXIgcmVzaWR1ZUxlZnQgPSByZWN0LmxlZnQgLSBzZWxmLmxlZnQ7XG4gICAgICAgICAgICBpZiAocmVzaWR1ZUxlZnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcGFydGl0aW9uZWRSZWN0LnB1c2gobmV3IE1hc29ucnlSZWN0XyhzZWxmLmxlZnQsIHNlbGYudG9wLCByZXNpZHVlTGVmdCwgc2VsZi5oZWlnaHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXNpZHVlVG9wID0gcmVjdC50b3AgLSBzZWxmLnRvcDtcbiAgICAgICAgICAgIGlmIChyZXNpZHVlVG9wID4gMCkge1xuICAgICAgICAgICAgICAgIHBhcnRpdGlvbmVkUmVjdC5wdXNoKG5ldyBNYXNvbnJ5UmVjdF8oc2VsZi5sZWZ0LCBzZWxmLnRvcCwgc2VsZi53aWR0aCwgcmVzaWR1ZVRvcCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlc2lkdWVSaWdodCA9IHNlbGYucmlnaHQgLSByZWN0LnJpZ2h0O1xuICAgICAgICAgICAgaWYgKHJlc2lkdWVSaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYXJ0aXRpb25lZFJlY3QucHVzaChuZXcgTWFzb25yeVJlY3RfKHJlY3QucmlnaHQsIHNlbGYudG9wLCByZXNpZHVlUmlnaHQsIHNlbGYuaGVpZ2h0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzaWR1ZUJvdHRvbSA9IHNlbGYuYm90dG9tIC0gcmVjdC5ib3R0b207XG4gICAgICAgICAgICBpZiAocmVzaWR1ZUJvdHRvbSA+IDApIHtcbiAgICAgICAgICAgICAgICBwYXJ0aXRpb25lZFJlY3QucHVzaChuZXcgTWFzb25yeVJlY3RfKHNlbGYubGVmdCwgcmVjdC5ib3R0b20sIHNlbGYud2lkdGgsIHJlc2lkdWVCb3R0b20pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJ0aXRpb25lZFJlY3Q7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWFzb25yeVJlY3RQcm90by5wbGFjZVJlY3RFeGFjdCA9IGZ1bmN0aW9uKHJlY3QpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5jb250YWlucyhyZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYucGFydGl0aW9uUmVjdChyZWN0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBNYXNvbnJ5UmVjdFByb3RvLnBsYWNlUmVjdCA9IGZ1bmN0aW9uKHJlY3QsIGZyb21SaWdodCwgZnJvbUJvdHRvbSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFzZWxmLmZpdHMocmVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vZGVmYXVsdCBwbGFjZSBtb2RlOlxuICAgICAgICAgICAgLy8gIHwtLS0tLS18LS0tLS0tLS0tLS0tfFxuICAgICAgICAgICAgLy8gIHwgICAgICB8ICAgICAgICAgICAgfFxuICAgICAgICAgICAgLy8gIHwgICAgICB8ICAgICAgICAgICAgfFxuICAgICAgICAgICAgLy8gIHwtLS0tLS18ICAgICAgICAgICAgfFxuICAgICAgICAgICAgLy8gIHwgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgLy8gIHwgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgLy8gIHwtLS0tLS0tLS0tLS0tLS0tLS0tfFxuICAgICAgICAgICAgaWYgKGZyb21SaWdodCkge1xuICAgICAgICAgICAgICAgIHJlY3QucmlnaHQgPSBzZWxmLnJpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWN0LmxlZnQgPSBzZWxmLmxlZnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnJvbUJvdHRvbSkge1xuICAgICAgICAgICAgICAgIHJlY3QuYm90dG9tID0gc2VsZi5ib3R0b207XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY3QudG9wID0gc2VsZi50b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wYXJ0aXRpb25SZWN0KHJlY3QpO1xuICAgICAgICB9O1xuXG4gICAgICAgIE1hc29ucnlSZWN0UHJvdG8ucGxhY2VSZWN0V2l0aEd1dHRlciA9IGZ1bmN0aW9uKHJlY3QsIHJlY3RXaXRoR3V0dGVyLCBmcm9tUmlnaHQsIGZyb21Cb3R0b20pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5maXRzKHJlY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnJvbVJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcmVjdC5yaWdodCA9IHJlY3RXaXRoR3V0dGVyLnJpZ2h0ID0gc2VsZi5yaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVjdC5sZWZ0ID0gcmVjdFdpdGhHdXR0ZXIubGVmdCA9IHNlbGYubGVmdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmcm9tQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgcmVjdC5ib3R0b20gPSByZWN0V2l0aEd1dHRlci5ib3R0b20gPSBzZWxmLmJvdHRvbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVjdC50b3AgPSByZWN0V2l0aEd1dHRlci50b3AgPSBzZWxmLnRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmLnBhcnRpdGlvblJlY3QocmVjdFdpdGhHdXR0ZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vc2VsZWN0IGEgcmVjdCBmaXQgdGhlIGN1cnJlbnQgcmVjdCBiZXN0LCBndXR0ZXIgd2FzIHRvb2sgaW50byBjb25zaWRlcmF0aW9uXG4gICAgICAgIE1hc29ucnlSZWN0UHJvdG8uZml0c01vc3QgPSBmdW5jdGlvbihyZWN0cywgZ3V0dGVyLCBtYXhXaWR0aCwgc2VhcmNoTGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcmVjdEFycjtcbiAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzQXJyYXkocmVjdHMpKSB7XG4gICAgICAgICAgICAgICAgcmVjdEFyciA9IHJlY3RzO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnd2lkdGgnIGluIHJlY3RzICYmICdoZWlnaHQnIGluIHJlY3RzKSB7XG4gICAgICAgICAgICAgICAgcmVjdEFyciA9IFtyZWN0c107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWFyY2hMZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IHJlY3RBcnJbMF07XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gbWF0aE1heChtYXRoTWluKHNlbGYubGVmdCArIHJlY3Qud2lkdGggKyBndXR0ZXIsIG1heFdpZHRoKSAtIHNlbGYubGVmdCwgcmVjdC53aWR0aCk7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IHJlY3QuaGVpZ2h0ICsgZ3V0dGVyO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLndpZHRoID49IHdpZHRoICYmIHNlbGYuaGVpZ2h0ID49IGhlaWdodCA/IDAgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdSZWN0QXJyID0gcmVjdEFyci5zbGljZSgwLCBzZWFyY2hMZW5ndGgpO1xuICAgICAgICAgICAgLy90b2RvOiBjaGFuZ2UgdGhpcyBsb2dpYyB0byBmaXQgZ2FwcyBiZXR0ZXJcbiAgICAgICAgICAgIC8vcGxhbiAxOiBhZGQgYSBjb25zdHJhaW4gZnVuY3Rpb24gKGFib3V0IHJhc3RlclNpemUpIHRvIGNob29zZSBhIHByb21pc2luZyBjYW5kaWRhdGUgaW5zdGVhZCBvZiBiaWdnZXN0IHBvc3NpYmxlIGNhbmRpZGF0ZVxuICAgICAgICAgICAgLy9wbGFuIDI6IHVzZSByZWNvcmRzIG9mIHJlY3Qgc2l6ZSBvciByZWNvcmQgdGhlIHJlY3Qgc2l6ZXMgdG8gc3BlZWQgdXAgdGhpcyBzZWFyY2hpbmcgcHJvZ3Jlc3NcbiAgICAgICAgICAgIC8vcGxhbiAzOiBhbiBpbnRlbGxpZ2VudCBjYWxjdWxhdGluZyBhbGdvcml0aG0gdG8gb3B0aW1pemUgdGhlIGxlZnQgc3BhY2VzXG4gICAgICAgICAgICAvL3ZhciB3aWR0aFN0ZXAgPSByYXN0ZXJTaXplICYmIHJhc3RlclNpemUud2lkdGggPj0gMSA/IE1hdGguZmxvb3IocmFzdGVyU2l6ZS53aWR0aCkgOiBQT1NJVElWRV9JTkZJTklUWTtcbiAgICAgICAgICAgIC8vdmFyIGhlaWdodFN0ZXAgPSByYXN0ZXJTaXplICYmIHJhc3RlclNpemUuaGVpZ2h0ID49IDEgPyBNYXRoLmZsb29yKHJhc3RlclNpemUuaGVpZ2h0KSA6IFBPU0lUSVZFX0lORklOSVRZO1xuICAgICAgICAgICAgdmFyIGRpZmZzID0gbmV3UmVjdEFyci5tYXAoZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IG1hdGhNYXgobWF0aE1pbihzZWxmLmxlZnQgKyByZWN0LndpZHRoICsgZ3V0dGVyLCBtYXhXaWR0aCkgLSBzZWxmLmxlZnQsIHJlY3Qud2lkdGgpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aERpZmYgPSBzZWxmLndpZHRoIC0gd2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodERpZmYgPSBzZWxmLmhlaWdodCAtIHJlY3QuaGVpZ2h0IC0gZ3V0dGVyO1xuICAgICAgICAgICAgICAgIC8vd2lkdGhEaWZmIGZpcnN0LlxuICAgICAgICAgICAgICAgIHJldHVybiAod2lkdGhEaWZmID49IDAgJiYgaGVpZ2h0RGlmZiA+PSAwKSA/ICh3aWR0aERpZmYgKiAxMDI0ICsgbWF0aE1pbihoZWlnaHREaWZmLCAxMDIzKSkgOiAtMTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGZpdHNNb3N0SW5kZXggPSAwO1xuICAgICAgICAgICAgdmFyIG1pbkRpZmYgPSBkaWZmcy5yZWR1Y2UoZnVuY3Rpb24ocHJlLCBjdXIsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZVZhbGlkID0gcHJlID49IDA7XG4gICAgICAgICAgICAgICAgdmFyIGN1clZhbGlkID0gY3VyID49IDA7XG4gICAgICAgICAgICAgICAgaWYgKHByZVZhbGlkICYmIGN1clZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gY3VyIDwgcHJlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZml0c01vc3RJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByZVZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBmaXRzTW9zdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbWluRGlmZiA8IDAgPyBmYWxzZSA6IGZpdHNNb3N0SW5kZXg7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWFzb25yeVJlY3RQcm90by5nZXRTdHlsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBzZWxmLmxlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiBzZWxmLnRvcCxcbiAgICAgICAgICAgICAgICB3aWR0aDogc2VsZi53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHNlbGYuaGVpZ2h0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBNYXNvbnJ5UmVjdF87XG4gICAgfSkoKTtcblxuICAgIGZ1bmN0aW9uIE1hc29ucnlMYXlvdXRFbmdpbmUob3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0aW9uRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjb2x1bW5XaWR0aDogMSxcbiAgICAgICAgICAgIHJvd0hlaWdodDogMSxcbiAgICAgICAgICAgIGd1dHRlcjogMCxcbiAgICAgICAgICAgIGtlZXBPcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHJpZ2h0VG9MZWZ0OiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dTY3JvbGxCYXI6IHRydWUsXG4gICAgICAgICAgICBhbGxvd0VkaXQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5NYXNvbnJ5UmVjdCA9IE1hc29ucnlSZWN0O1xuICAgICAgICBzZWxmLmxheW91dEluZm9fID0gbnVsbDtcblxuICAgICAgICBzZWxmLm5hbWUgPSAnTWFzb25yeUxheW91dEVuZ2luZSc7IC8vbmFtZSBtdXN0IGVuZCB3aXRoIExheW91dEVuZ2luZVxuICAgICAgICBzZWxmLm9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIG9wdGlvbkRlZmF1bHRzKTtcbiAgICB9XG5cbiAgICBNYXNvbnJ5TGF5b3V0RW5naW5lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oZ3JpZCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBzZWxmLmdyaWQgPSBncmlkO1xuICAgICAgICAgICAgZ3JpZC5jb2x1bW5zID0gXy5tYXAoZ3JpZC5jb2x1bW5zLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhjb2wsIF8uZGVmYXVsdHMoc2VsZi5nZXRDb2x1bW5EZWZhdWx0c18oKSwge1xuICAgICAgICAgICAgICAgICAgICBjYXB0aW9uOiBjb2wuZGF0YUZpZWxkLFxuICAgICAgICAgICAgICAgICAgICBpZDogY29sLmRhdGFGaWVsZFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBjb2x1bW5XaWR0aCA9IG9wdGlvbnMuY29sdW1uV2lkdGg7XG4gICAgICAgICAgICBvcHRpb25zLmNvbHVtbldpZHRoID0gZ2NVdGlscy5pc051bWJlcihjb2x1bW5XaWR0aCkgPyBjb2x1bW5XaWR0aCA6IDE7XG4gICAgICAgICAgICB2YXIgcm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgICAgICBvcHRpb25zLnJvd0hlaWdodCA9IGdjVXRpbHMuaXNOdW1iZXIocm93SGVpZ2h0KSA/IHJvd0hlaWdodCA6IDE7XG4gICAgICAgICAgICB2YXIgZ3V0dGVyID0gb3B0aW9ucy5ndXR0ZXI7XG4gICAgICAgICAgICBvcHRpb25zLmd1dHRlciA9IGdjVXRpbHMuaXNOdW1iZXIoZ3V0dGVyKSA/IGd1dHRlciA6IDA7XG5cbiAgICAgICAgICAgIHNlbGYucmVsb2FkRGF0YV8oKTtcbiAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgc2VsZi5sb2FkQ291bnQgPSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldENvbHVtbkRlZmF1bHRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgYWxsb3dTb3J0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbGxvd0VkaXRpbmc6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldExheW91dEluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5nZXRMYXlvdXRJbmZvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5sYXlvdXRJbmZvXyB8fCAoc2VsZi5sYXlvdXRJbmZvXyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdmlld3BvcnQ6IGdldFZpZXdwb3J0TGF5b3V0SW5mb18uY2FsbCh0aGlzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyUmVuZGVyQ2FjaGVfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNlbGYuc3RhdHVzXyAhPT0gU1RBVFVTX0xPQURJTkcpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlbG9hZERhdGFfKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oYXNTY3JvbGxCYXJfID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLnJvd1RlbXBsYXRlRm5fID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lcklubmVyU2l6ZV8gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJJbmZvOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlckluZm8ob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXJlYSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5hcmVhO1xuICAgICAgICAgICAgaWYgKGFyZWEgIT09IFZJRVdQT1JUKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBsYXlvdXRFbmdpbmVPcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGxheW91dEluZm8ud2lkdGg7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gbGF5b3V0SW5mby5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgciA9IHtcbiAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2Mtdmlld3BvcnQnICsgKHJpZ2h0VG9MZWZ0ID8gJyAnICsgUlRMX0NMQVNTX05BTUUgOiAnJyksXG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBsYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbGF5b3V0SW5mby5sZWZ0ICsgKHJpZ2h0VG9MZWZ0ICYmIHNlbGYuaGFzU2Nyb2xsQmFyXyA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoIDogMCksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19ISURERU5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2VHJhbnNsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1vcHRpb25zLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogLW9wdGlvbnMub2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZFJvd3M6IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IGdldFJlbmRlckluZm9JbnRlcm5hbF8uY2FsbChzZWxmLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlbmRlclJhbmdlXzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5nZXRSZW5kZXJSYW5nZV8ob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcmVhID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hcmVhKSB8fCAnJztcbiAgICAgICAgICAgIGlmICghYXJlYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IC1vcHRpb25zLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBnZXRSZW5kZXJJbmZvSW50ZXJuYWxfLmNhbGwoc2VsZiwgb3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Um93VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFRlbXBsYXRlXy5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlTGF5b3V0XzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBDb250ZW50SW5mbyA9IHNlbGYuZ3JvdXBDb250ZW50SW5mb187XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGdyb3VwQ29udGVudEluZm8sIGZ1bmN0aW9uKGNvbnRlbnRJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpYWxSZUxheW91dF8uY2FsbChzZWxmLCBjb250ZW50SW5mbyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkLnVwZGF0ZUdyb3VwSW5mb3NfKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfLmhlaWdodCA9IHBhcnRpYWxSZUxheW91dF8uY2FsbChzZWxmLCBzZWxmLmNvbnRlbnRJbmZvXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtZWFzdXJlSXRlbTogZnVuY3Rpb24oaSwgZ3JvdXApIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpdGVtSW5mbyA9IGdldEl0ZW1JbmZvQnlJbmRleF8uY2FsbChzZWxmLCBpLCBncm91cCk7XG4gICAgICAgICAgICBpdGVtSW5mby5vbGRQb3NpdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciB2aXNpYmxlUmVjdCA9IG5ldyBNYXNvbnJ5UmVjdCgwLCBzZWxmLmdyaWQuc2Nyb2xsT2Zmc2V0LnRvcCwgbGF5b3V0SW5mby5jb250ZW50V2lkdGgsIGxheW91dEluZm8uaGVpZ2h0KTtcbiAgICAgICAgICAgIHNlbGYucmVtZWFzdXJlXyhzZWxmLmNvbnRlbnRJbmZvXywgc2VsZi5jb250ZW50U2l6ZV8sIHZpc2libGVSZWN0KTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1lYXN1cmVfOiBmdW5jdGlvbihjb250ZW50SW5mbywgY29udGVudFNpemUsIHZpc2libGVSZWN0LCBtZWFzdXJlQWxsKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgbGVuID0gbWVhc3VyZUFsbCA/IGNvbnRlbnRJbmZvLml0ZW1Db3VudCA6IGNvbnRlbnRJbmZvLnJlbmRlcmVkSXRlbXM7XG4gICAgICAgICAgICBnZXRJdGVtUmVjdGFuZ2xlc18uY2FsbChzZWxmLCB7Y29udGVudEluZm86IGNvbnRlbnRJbmZvLCBjb250ZW50U2l6ZTogY29udGVudFNpemV9LCB7c3RhcnQ6IDAsIGVuZDogbGVufSwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZUxheW91dF8oKTtcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXR1c18gPSBTVEFUVVNfTE9BRElORztcbiAgICAgICAgICAgICAgICByZWZyZXNoSXRlbXNfLmNhbGwoc2VsZiwgdmlzaWJsZVJlY3QpO1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVsb2FkRGF0YV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJJbm5lclNpemVfLmNhbGwoc2VsZik7XG4gICAgICAgICAgICBzZWxmLm1pbkl0ZW1XaWR0aF8gPSBjb250YWluZXJTaXplLndpZHRoO1xuICAgICAgICAgICAgc2VsZi5taW5JdGVtSGVpZ2h0XyA9IGNvbnRhaW5lclNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHNlbGYuZ3JpZC5kYXRhO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEuY2FsY1NvdXJjZS5nZXREaW1lbnNpb24oKTsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgaXRlbXNbaV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Q6IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5pdGVtc18gPSBpdGVtcztcbiAgICAgICAgICAgIHZhciBncm91cHMgPSBkYXRhLmdyb3VwcztcbiAgICAgICAgICAgIC8vdmFyIGNhbGNTb3VyY2UgPSBkYXRhLmNhbGNTb3VyY2U7XG4gICAgICAgICAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ncm91cENvbnRlbnRJbmZvXyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRHcm91cCA9IHtncm91cHM6IGdyb3Vwc307XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mb1N0YWNrID0gW3tcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IHBhcmVudEdyb3VwLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBbXVxuICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIHdoaWxlIChncm91cEluZm9TdGFjay5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJHcm91cEluZm8gPSBncm91cEluZm9TdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJHcm91cCA9IGN1cnJHcm91cEluZm8uZ3JvdXA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUGF0aCA9IGN1cnJHcm91cEluZm8ucGF0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJHcm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aFN0ciA9IGN1cnJQYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXBDb250ZW50SW5mb19bcGF0aFN0cl0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IGN1cnJHcm91cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmVlUmVjdGFuZ2xlczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRJdGVtczogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ291bnQ6IGN1cnJHcm91cC5pdGVtQ291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBjdXJyR3JvdXAuZ3JvdXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+IC0xOyAtLWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm9TdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IGNoaWxkcmVuW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJyUGF0aC5jb25jYXQoW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudEluZm9fID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ncm91cENvbnRlbnRJbmZvXyA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250ZW50SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkSXRlbXM6IDAsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Db3VudDogZGF0YS5pdGVtQ291bnQsXG4gICAgICAgICAgICAgICAgICAgIGZyZWVSZWN0YW5nbGVzOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVmcmVzaFJvd186IGZ1bmN0aW9uKHJvdywgZ3JvdXBQYXRoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBpbm5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctJyArIFZJRVdQT1JUICsgJy1pbm5lcicpO1xuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdmFyIGluZm87XG4gICAgICAgICAgICBpZiAoaW5uZXJFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGdyaWQudWlkICsgJy1yJyArIHJvdztcbiAgICAgICAgICAgICAgICBpbmZvID0gc2VsZi5nZXRSZW5kZXJSb3dJbmZvXyh7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogcm93LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGdyaWQub3B0aW9ucy5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwUGF0aFxuICAgICAgICAgICAgICAgIH0sIFZJRVdQT1JUKTtcbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZ3JpZC5yZW5kZXJSb3dfKGluZm8pO1xuICAgICAgICAgICAgICAgIHZhciBvbGRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbChvbGRFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBpbm5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICBncmlkLmxhc3RSZW5kZXJlZFJvd3NfW1ZJRVdQT1JUXS5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LnJlcGxhY2VDaGlsZChkaXYuY2hpbGROb2Rlc1swXSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZVJvd186IGZ1bmN0aW9uKHJvdywgZ3JvdXBQYXRoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBrZXkgPSBncmlkLnVpZCArICctcicgKyByb3c7XG4gICAgICAgICAgICAvL3ZhciBrZXkgPSBzZWxmLmdyaWQudWlkICsgJy1ncicgKyBwYXRoU3RyICsgJy1yJztcbiAgICAgICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgICAgIGlmICgoaW5kZXggPSBncmlkLmxhc3RSZW5kZXJlZFJvd3NfW1ZJRVdQT1JUXS5pbmRleE9mKGtleSkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBncmlkLmxhc3RSZW5kZXJlZFJvd3NfW1ZJRVdQT1JUXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHZhciBpbm5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctJyArIFZJRVdQT1JUICsgJy1pbm5lcicpO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRSb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChpbm5lckVsZW1lbnQgJiYgdGFyZ2V0Um93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyRWxlbWVudC5yZW1vdmVDaGlsZCh0YXJnZXRSb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZWZyZXNoU2Nyb2xsQmFyXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gZ3JpZC5sYXlvdXRFbmdpbmUuZ2V0TGF5b3V0SW5mbygpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcmVuZGVySW5mbztcbiAgICAgICAgICAgIF8ua2V5cyhsYXlvdXRJbmZvKS5tYXAoZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgICAgIC8vdXBkYXRlIHNjcm9sbCBjb250YWluZXJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zaG93U2Nyb2xsUGFuZWwoYXJlYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBncmlkLnVpZCArICctJyArIGFyZWEgKyAnLXNjcm9sbCc7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckluZm8gPSBzZWxmLmdldFNjcm9sbFBhbmVsUmVuZGVySW5mbyhhcmVhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gZ2NVdGlscy5jcmVhdGVNYXJrdXBGb3JTdHlsZXMocmVuZGVySW5mby5vdXRlckRpdlN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZE5vZGVzWzBdLnN0eWxlLmNzc1RleHQgPSBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyhyZW5kZXJJbmZvLmlubmVyRGl2U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZ3JpZC51aWQgKyAnLScgKyBhcmVhICsgJy1zY3JvbGwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuc2Nyb2xsYWJsZUVsZW1lbnRzXy5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiJyArIHJlbmRlckluZm8ub3V0ZXJEaXZDc3NDbGFzcyArICdcIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckluZm8ub3V0ZXJEaXZDc3NDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICcgc3R5bGU9XCInICsgZ2NVdGlscy5jcmVhdGVNYXJrdXBGb3JTdHlsZXMocmVuZGVySW5mby5vdXRlckRpdlN0eWxlKSArICdcIic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJz48ZGl2JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVySW5mby5pbm5lckRpdlN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJyBzdHlsZT1cIicgKyBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyhyZW5kZXJJbmZvLmlubmVyRGl2U3R5bGUpICsgJ1wiJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbEJhckVsZW1lbnQgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIGdyaWQudWlkICsgJyAuZ2MtZ3JpZC1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JvbGxCYXJFbGVtZW50LCBwYXJlbnROb2RlLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gZ3JpZC51aWQgKyAnLScgKyBhcmVhICsgJy1zY3JvbGwnO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVySW5mbyA9IHNlbGYuZ2V0U2Nyb2xsUGFuZWxSZW5kZXJJbmZvKGFyZWEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyhyZW5kZXJJbmZvLm91dGVyRGl2U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkTm9kZXNbMF0uc3R5bGUuY3NzVGV4dCA9IGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzKHJlbmRlckluZm8uaW5uZXJEaXZTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVuZGVyUm93SW5mb186IGZ1bmN0aW9uKHJvdywgYXJlYSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5nZXRSZW5kZXJSb3dJbmZvXyhyb3csIGFyZWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcblxuICAgICAgICAgICAgaWYgKHNlbGYuZ3JpZC5kYXRhLmdyb3Vwcykge1xuICAgICAgICAgICAgICAgIHZhciBpbmZvID0gcm93LmluZm87XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhpbmZvLnBhdGgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gb3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gcm93LmtleTtcbiAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IHJvdy5ib3VuZHM7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwSGVhZGVyUm93Xy5jYWxsKHNlbGYsIGtleSwgaW5mbywgZ3JvdXBJbmZvLCByZWN0LCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmZvLmFyZWEgPT09IEdST1VQX0NPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwQ29udGVudFJvd18uY2FsbChzZWxmLCBrZXksIHJvdy5pbmRleCwgcmVjdCwgZ3JvdXBJbmZvLCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwRm9vdGVyUm93Xy5jYWxsKHNlbGYsIGtleSwgaW5mbywgZ3JvdXBJbmZvLCByZWN0LCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVuZGVyUm93SW5mb0ludGVybmFsLmNhbGwoc2VsZiwgcm93LmtleSwgcm93LmluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzaG93U2Nyb2xsUGFuZWw6IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5vcHRpb25zLnNob3dTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJlYS50b0xvd2VyQ2FzZSgpID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgIGlmIChsYXlvdXRJbmZvLmhlaWdodCA8IGxheW91dEluZm8uY29udGVudEhlaWdodCB8fCBsYXlvdXRJbmZvLndpZHRoIDwgbGF5b3V0SW5mby5jb250ZW50V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEluaXRpYWxTY3JvbGxPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY3JvbGxQYW5lbFJlbmRlckluZm86IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uZ2V0U2Nyb2xsUGFuZWxSZW5kZXJJbmZvKGFyZWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZWEudG9Mb3dlckNhc2UoKSA9PT0gVklFV1BPUlQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsIHNjcm9sbC10b3Agc2Nyb2xsLWxlZnQnICsgKHNlbGYub3B0aW9ucy5yaWdodFRvTGVmdCA/ICcgJyArIFJUTF9DTEFTU19OQU1FIDogJycpLFxuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC53aWR0aCArIChzZWxmLmhhc1Njcm9sbEJhcl8gPyBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCA6IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0FVVE9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQuY29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2Nyb2xsYWJsZUFyZWFfOiBmdW5jdGlvbihhcmVhKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93U2Nyb2xsQmFyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFyZWEudG9Mb3dlckNhc2UoKSA9PT0gVklFV1BPUlQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy90b2RvOiBjb25zaWRlciB0byB1c2UgZXZlbnQgcGF0aCB0byByZWR1Y2UgcHJvY2Vzc2luZyB0aW1lIGNvc3RcbiAgICAgICAgaGl0VGVzdDogZnVuY3Rpb24oZXZlbnRBcmdzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdyb3VwU3RyYXRlZ3lfLmhpdFRlc3QoZXZlbnRBcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsZWZ0ID0gZXZlbnRBcmdzLnBhZ2VYO1xuICAgICAgICAgICAgdmFyIHRvcCA9IGV2ZW50QXJncy5wYWdlWTtcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgLy9nZXQgY29udGFpbmVyIHBhZGRpbmcgYW5kIHBvc2l0aW9uXG4gICAgICAgICAgICB2YXIgY29udGFpbmVySW5mbyA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gbGVmdCAtIGNvbnRhaW5lckluZm8ubGVmdDtcbiAgICAgICAgICAgIHZhciBvZmZzZXRUb3AgPSB0b3AgLSBjb250YWluZXJJbmZvLnRvcDtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICB2YXIgaGl0VGVzdEluZm8gPSB7XG4gICAgICAgICAgICAgICAgYXJlYTogJycsXG4gICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICBncm91cEluZm86IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcyA9IGdyaWQuZ3JvdXBJbmZvc187XG4gICAgICAgICAgICB2YXIgZ3JvdXBIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICAgICAgdmFyIGdyb3VwcyA9IGdyaWQuZGF0YS5ncm91cHM7XG4gICAgICAgICAgICAvL2lmIHZpZXdwb3J0XG4gICAgICAgICAgICB2YXIgdmlld3BvcnRSZWN0ID0gbmV3IE1hc29ucnlSZWN0KGxheW91dEluZm8ubGVmdCwgbGF5b3V0SW5mby50b3AsIGxheW91dEluZm8ud2lkdGgsIGxheW91dEluZm8uaGVpZ2h0KTtcbiAgICAgICAgICAgIGlmICh2aWV3cG9ydFJlY3QuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgICAgICAgICAgICBoaXRUZXN0SW5mby5hcmVhID0gVklFV1BPUlQ7XG4gICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSBncmlkLnNjcm9sbE9mZnNldC5sZWZ0IC0gbGF5b3V0SW5mby5sZWZ0O1xuICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBncmlkLnNjcm9sbE9mZnNldC50b3AgLSBsYXlvdXRJbmZvLnRvcDtcblxuICAgICAgICAgICAgICAgIHZhciByZWxhdGl2ZVBvaW50ID0ge2xlZnQ6IG9mZnNldExlZnQsIHRvcDogb2Zmc2V0VG9wfTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBzZWxmLml0ZW1zXztcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3Vwcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBzZWxmLmNvbnRlbnRJbmZvXy5yZW5kZXJlZEl0ZW1zOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtc1tpXS5yZWN0LmNvbnRhaW5zUG9pbnQocmVsYXRpdmVQb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mby5yb3cgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JvdXBJbmZvc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSGVpZ2h0ID0gZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPCBncm91cEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoaXRUZXN0R3JvdXBfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCBvZmZzZXRMZWZ0LCBvZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IGdyb3VwSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVNjcm9sbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwU3RyYXRlZ3lfLmhhbmRsZVNjcm9sbCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnN0YXR1c18gPT09IFNUQVRVU19JRExFKSB7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gc2VsZi5ncmlkLmRhdGEuZ3JvdXBzO1xuICAgICAgICAgICAgICAgIHZhciByZWZyZXNoSGVpZ2h0ID0gbW9kZVRvSGVpZ2h0Xy5jYWxsKHNlbGYsIFFVQVJURVJfQ09OVEFJTkVSX0hFSUdIVCk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRTaXplID0gZ2V0Q29udGVudFNpemVfLmNhbGwoc2VsZik7XG4gICAgICAgICAgICAgICAgdmFyIHZpc2libGVSZWN0ID0gbmV3IE1hc29ucnlSZWN0KDAsIGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcCwgbGF5b3V0SW5mby5jb250ZW50V2lkdGgsIGxheW91dEluZm8uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2aXNpYmxlUmVjdC5oZWlnaHQgKz0gcmVmcmVzaEhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFJlbmRlcmVkID0gXy5ldmVyeShzZWxmLmdyb3VwQ29udGVudEluZm9fLCBmdW5jdGlvbihjb250ZW50SW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRJbmZvLnJlbmRlcmVkSXRlbXMgPT09IGNvbnRlbnRJbmZvLml0ZW1Db3VudCB8fCBjb250ZW50SW5mby5ncm91cC5jb2xsYXBzZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFsbFJlbmRlcmVkICYmIGNvbnRlbnRTaXplLmhlaWdodCA8IHZpc2libGVSZWN0LmJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGF0dXNfID0gU1RBVFVTX0xPQURJTkc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkR3JvdXBzXy5jYWxsKHNlbGYsIGdyaWQuZ3JvdXBJbmZvc18sIHZpc2libGVSZWN0LCBmYWxzZSwgZnVuY3Rpb24oY29udGVudFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLnVwZGF0ZUdyb3VwSW5mb3NfKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250ZW50U2l6ZV8gPSBjb250ZW50U2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLnNjcm9sbFJlbmRlclBhcnRfKFZJRVdQT1JUKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbnRlbnRJbmZvXy5yZW5kZXJlZEl0ZW1zIDwgc2VsZi5jb250ZW50SW5mb18uaXRlbUNvdW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50U2l6ZS5oZWlnaHQgPCB2aXNpYmxlUmVjdC5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtTGF5b3V0SW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50U2l6ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0SW5mby5jb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50SW5mbzogc2VsZi5jb250ZW50SW5mb19cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXR1c18gPSBTVEFUVVNfTE9BRElORztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRJdGVtc18uY2FsbChzZWxmLCBpdGVtTGF5b3V0SW5mbywgdmlzaWJsZVJlY3QsIGZhbHNlLCBmdW5jdGlvbihjb250ZW50U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfID0gY29udGVudFNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5pbnZhbGlkYXRlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXR1c18gPSBTVEFUVVNfSURMRTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5zY3JvbGxSZW5kZXJQYXJ0XyhWSUVXUE9SVCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oVklFV1BPUlQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdyb3VwSW5mb0RlZmF1bHRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdyb3VwU3RyYXRlZ3lfLmdldEdyb3VwSW5mb0RlZmF1bHRzXygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlV2l0aEdyb3VwOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEdyb3VwSW5mb3NIZWlnaHRfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uaW5pdEdyb3VwSW5mb3NIZWlnaHRfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcyA9IHNlbGYuZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgIHZhciB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cEluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgKz0gZ3JvdXBJbmZvc1tpXS5oZWlnaHQgPSBzZWxmLmdldEdyb3VwSGVpZ2h0Xyhncm91cEluZm9zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmNvbnRlbnRTaXplXykge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfLmhlaWdodCA9IHRvdGFsSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdyb3VwSGVpZ2h0XzogZnVuY3Rpb24oZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIWdyb3VwSW5mbykge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFnY1V0aWxzLmlzVW5kZWZpbmVkKGdyb3VwSW5mby5oZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgIGlmIChoZWFkZXIgJiYgaGVhZGVyLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgKz0gc2VsZi5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZvb3RlcjtcbiAgICAgICAgICAgIGlmICghZ3JvdXAuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHNlbGYuZ2V0SW5uZXJHcm91cEhlaWdodChncm91cEluZm8pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mby5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR3JvdXAuaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEhlaWdodF8oY2hpbGRHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gY2hpbGRHcm91cC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoZWlnaHQgKz0gc2VsZi5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgIGlmIChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUgJiYgIWZvb3Rlci5jb2xsYXBzZVdpdGhHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gc2VsZi5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGl0VGVzdEdyb3VwQ29udGVudF86IGZ1bmN0aW9uKGdyb3VwSW5mbywgYXJlYSwgbGVmdCwgdG9wKSB7XG4gICAgICAgICAgICBpZiAoYXJlYSAhPT0gVklFV1BPUlQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwb2ludCA9IHtsZWZ0OiBsZWZ0LCB0b3A6IHRvcH07XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgIHZhciBncm91cENvbnRlbnRJbmZvID0gc2VsZi5ncm91cENvbnRlbnRJbmZvXztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBncm91cENvbnRlbnRJbmZvW2dyb3VwSW5mby5wYXRoLmpvaW4oJ18nKV0uaXRlbUNvdW50OyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGdldEl0ZW1JbmZvQnlJbmRleF8uY2FsbChzZWxmLCBpLCBncm91cCk7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ucmVjdC5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfQ09OVEVOVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IGlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICBncm91cEluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfQ09OVEVOVCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJvdzogLTFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldElubmVyR3JvdXBIZWlnaHQ6IGZ1bmN0aW9uKGdyb3VwSW5mbykge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGdyb3VwQ29udGVudEluZm8gPSB0aGlzLmdyb3VwQ29udGVudEluZm9fO1xuICAgICAgICAgICAgcmV0dXJuIGdyb3VwQ29udGVudEluZm8gPyBnZXRNYXhIZWlnaHRCeUZyZWVSZWN0QXJyXyhncm91cENvbnRlbnRJbmZvW2dyb3VwSW5mby5wYXRoLmpvaW4oJ18nKV0uZnJlZVJlY3RhbmdsZXMpIDogMDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRJbm5lckdyb3VwUmVuZGVySW5mbzogZnVuY3Rpb24oZ3JvdXBJbmZvLCBjb250YWluZXJTaXplLCBsYXlvdXRDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIGl0ZW1JbmZvO1xuICAgICAgICAgICAgdmFyIGl0ZW1SZWN0O1xuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBsYXlvdXQ7XG4gICAgICAgICAgICB2YXIgYWRkaXRpb25hbFN0eWxlO1xuICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxDU1NDbGFzcztcbiAgICAgICAgICAgIHZhciByZW5kZXJSZWN0O1xuICAgICAgICAgICAgdmFyIHZpc2libGVSZWN0ID0gbmV3IE1hc29ucnlSZWN0KDAsIDAsIGNvbnRhaW5lclNpemUud2lkdGgsIFBPU0lUSVZFX0lORklOSVRZKTtcbiAgICAgICAgICAgIHZhciBwYXRoU3RyID0gZ3JvdXBJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gc2VsZi5ncm91cENvbnRlbnRJbmZvX1twYXRoU3RyXTtcbiAgICAgICAgICAgIHZhciBzeW5GbGFnID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoY29udGVudEluZm8uZnJlZVJlY3RhbmdsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgKytzZWxmLmxvYWRDb3VudDtcbiAgICAgICAgICAgICAgICBjb250ZW50SW5mby5mcmVlUmVjdGFuZ2xlcy5wdXNoKHZpc2libGVSZWN0KTtcbiAgICAgICAgICAgICAgICBnZXRJdGVtUmVjdGFuZ2xlc18uY2FsbChzZWxmLCB7Y29udGVudEluZm86IGNvbnRlbnRJbmZvLCBjb250ZW50U2l6ZTogY29udGFpbmVyU2l6ZX0sIHtzdGFydDogMCwgZW5kOiBjb250ZW50SW5mby5pdGVtQ291bnR9LCBmYWxzZSwgZnVuY3Rpb24oaXRlbVJlY3RBcnIsIHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgLS1zZWxmLmxvYWRDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEluZm8ucmVuZGVyZWRJdGVtcyA9IGNvbnRlbnRJbmZvLml0ZW1Db3VudDtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VJdGVtc18uY2FsbChzZWxmLCBpdGVtUmVjdEFyciwgY29udGVudEluZm8sIGNvbnRhaW5lclNpemUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICBzeW5GbGFnID0gc3luYztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzeW5jICYmIHNlbGYubG9hZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXR1c18gPSBTVEFUVVNfTE9BRElORztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hJdGVtc18uY2FsbChzZWxmLCB2aXNpYmxlUmVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXR1c18gPSBTVEFUVVNfSURMRTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzeW5GbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3luRmxhZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBrZXlCYXNlID0gc2VsZi5ncmlkLnVpZCArICctZ3InICsgcGF0aFN0ciArICctcic7XG4gICAgICAgICAgICBpZiAobGF5b3V0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29udGVudEluZm8uaXRlbUNvdW50OyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUluZm8gPSBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgaSwgZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBpdGVtUmVjdCA9IGl0ZW1JbmZvLnJlY3Q7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dCA9IGxheW91dENhbGxiYWNrKGdyb3VwSW5mbywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDU1NDbGFzcyA9IGxheW91dC5jc3NDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFN0eWxlID0gbGF5b3V0LnN0eWxlIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUucG9zaXRpb24gPSBQT1NfQUJTO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGF5b3V0Qm91bmQgPSBsYXlvdXQubG9jYXRpb247XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBrZXlCYXNlICsgaTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheW91dEJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSZWN0ID0gbmV3IE1hc29ucnlSZWN0KGxheW91dEJvdW5kLmxlZnQsIGxheW91dEJvdW5kLnRvcCwgaXRlbVJlY3Qud2lkdGgsIGl0ZW1SZWN0LmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBncm91cEluZm8sIGtleSwgaSwgcmVuZGVyUmVjdCwgZmFsc2UsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBncm91cEluZm8sIGtleSwgaSwgaXRlbVJlY3QsIGZhbHNlLCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL3RvZG86IHRoaXMgcm91dGUgaGF2ZW4ndCBiZWVuIHRlc3RlZCwgbWlnaHQgaGF2ZSBidWdzXG4gICAgICAgICAgICAgICAgcm93cyA9IGdldFJlbmRlcmVkR3JvdXBDb250ZW50SXRlbXNJbmZvXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgdmlzaWJsZVJlY3QsIHZpc2libGVSZWN0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRNYXhWaXNpYmxlSXRlbUNvdW50OiBmdW5jdGlvbihjb250YWluZXJTaXplLCBncm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgdmFyIHNhbXBsZUdyb3VwSW5mbyA9IGdyb3VwSW5mbyB8fCAoZ3JpZC5ncm91cEluZm9zXyA/IGdyaWQuZ3JvdXBJbmZvc19bMF0gOiBudWxsKTtcbiAgICAgICAgICAgIGlmICghc2FtcGxlR3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSBzYW1wbGVHcm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgIHZhciBwYXRoU3RyID0gc2FtcGxlR3JvdXBJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gc2VsZi5ncm91cENvbnRlbnRJbmZvX1twYXRoU3RyXTtcbiAgICAgICAgICAgIHZhciBtYXhIZWlnaHQgPSBjb250YWluZXJTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbnRlbnRJbmZvLml0ZW1Db3VudDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmZvID0gZ2V0SXRlbUluZm9CeUluZGV4Xy5jYWxsKHNlbGYsIGksIGdyb3VwKTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVJlY3QgPSBpdGVtSW5mby5yZWN0O1xuICAgICAgICAgICAgICAgIHZhciBib3R0b20gPSBpdGVtUmVjdC5ib3R0b207XG4gICAgICAgICAgICAgICAgaWYgKGJvdHRvbSA+IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHcm91cEhlYWRlckhlaWdodF86IGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgIHJldHVybiAoaGVhZGVyICYmIGhlYWRlci52aXNpYmxlKSA/IChoZWFkZXIuaGVpZ2h0IHx8IERFRkFVTFRfSEVBREVSX0hFSUdIVCkgOiAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdyb3VwRm9vdGVySGVpZ2h0XzogZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgcmV0dXJuIChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUpID8gKGZvb3Rlci5oZWlnaHQgfHwgREVGQVVMVF9IRUFERVJfSEVJR0hUKSA6IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlVGVtcGxhdGVDaGFuZ2VfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVnaXN0ZUV2ZW50c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VXaGVlbC5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlV2hlZWwpO1xuICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VEb3duLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VEb3duKTtcbiAgICAgICAgICAgIC8vc2VsZi5ncmlkLm9uTW91c2VDbGljay5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuUmVnaXN0ZUV2ZW50c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VXaGVlbC5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlV2hlZWwpO1xuICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VEb3duLnJlbW92ZUhhbmRsZXIoaGFuZGxlTW91c2VEb3duKTtcbiAgICAgICAgICAgIC8vc2VsZi5ncmlkLm9uTW91c2VDbGljay5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwU3RyYXRlZ3lfLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi51blJlZ2lzdGVFdmVudHNfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuRG9Td2lwZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhblN0YXJ0U3dpcGVfOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hJdGVtc18odmlzaWJsZVJlY3QpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGdyb3VwcyA9IGdyaWQuZGF0YS5ncm91cHM7XG4gICAgICAgIGlmIChncm91cHMpIHtcbiAgICAgICAgICAgIC8vdG9kbzogcGFydGlhbCByZW5kZXIgZ3JvdXBcbiAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVuZGVyTWluUm93c18uY2FsbChzZWxmLCBzZWxmLmNvbnRlbnRJbmZvXywgdmlzaWJsZVJlY3QpO1xuICAgICAgICAgICAgc2VsZi5sYXlvdXRJbmZvXyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLnJlZnJlc2hTY3JvbGxCYXJfKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJNaW5Sb3dzXyhjb250ZW50SW5mbywgdmlzaWJsZVJlY3QpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBsZW4gPSBjb250ZW50SW5mby5yZW5kZXJlZEl0ZW1zO1xuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgaXRlbUluZm8gPSBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgaSwgY29udGVudEluZm8uZ3JvdXApO1xuICAgICAgICAgICAgaWYgKGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwoaXRlbUluZm8ub2xkUG9zaXRpb24pIHx8XG4gICAgICAgICAgICAgICAgKCFpdGVtSW5mby5yZWN0LmNvbmdydWVudChpdGVtSW5mby5vbGRQb3NpdGlvbikpICYmXG4gICAgICAgICAgICAgICAgKHZpc2libGVSZWN0Lm92ZXJsYXBzKGl0ZW1JbmZvLm9sZFBvc2l0aW9uKSB8fCB2aXNpYmxlUmVjdC5vdmVybGFwcyhpdGVtSW5mby5yZWN0KSkpIHtcbiAgICAgICAgICAgICAgICBpdGVtSW5mby5vbGRQb3NpdGlvbiA9IGl0ZW1JbmZvLnJlY3QuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hSb3dfKGkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdmlzaWJsZVJlY3Qub3ZlcmxhcHMoaXRlbUluZm8ucmVjdCkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRlbGV0ZVJvd18oaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJ0aWFsUmVMYXlvdXRfKGNvbnRlbnRJbmZvKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGl0ZW1SZWN0QXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb250ZW50SW5mby5yZW5kZXJlZEl0ZW1zOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIGl0ZW1SZWN0QXJyLnB1c2goZ2V0SXRlbUluZm9CeUluZGV4Xy5jYWxsKHNlbGYsIGksIGNvbnRlbnRJbmZvLmdyb3VwKS5yZWN0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29udGVudFNpemUgPSBnZXRDb250ZW50U2l6ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIHRlc3RSZWN0ID0gbmV3IE1hc29ucnlSZWN0KDAsIDAsIGNvbnRlbnRTaXplLndpZHRoLCBQT1NJVElWRV9JTkZJTklUWSk7XG4gICAgICAgIGNvbnRlbnRJbmZvLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCA9IDA7XG4gICAgICAgIGNvbnRlbnRJbmZvLmZyZWVSZWN0YW5nbGVzLnB1c2godGVzdFJlY3QpO1xuXG4gICAgICAgIHBsYWNlSXRlbXNfLmNhbGwoc2VsZiwgaXRlbVJlY3RBcnIsIGNvbnRlbnRJbmZvLCBjb250ZW50U2l6ZS53aWR0aCk7XG4gICAgICAgIHJldHVybiBnZXRNYXhIZWlnaHRCeUZyZWVSZWN0QXJyXyhjb250ZW50SW5mby5mcmVlUmVjdGFuZ2xlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGl0VGVzdEdyb3VwXyhncm91cEluZm8sIGxlZnQsIHRvcCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciByZWxhdGl2ZVRvcCA9IHRvcDtcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgIHZhciBncm91cEhlaWdodCA9IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgIHZhciBoZWFkZXJIZWlnaHQgPSBzZWxmLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQgPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgIGlmIChyZWxhdGl2ZVRvcCA8IGhlYWRlckhlaWdodCkge1xuICAgICAgICAgICAgdmFyIG9uRXhwYW5kVG9nZ2xlID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgaGVhZGVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuZ3JpZC51aWQgKyAnLWdoJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSk7XG4gICAgICAgICAgICBpZiAoaGVhZGVyRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVFbGVtZW50ID0gaGVhZGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2MtZ3JvdXBpbmctdG9nZ2xlJyk7XG4gICAgICAgICAgICAgICAgdmFyIGVsZU9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KHRvZ2dsZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50UmVjdCA9IGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QodG9nZ2xlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRPZmZzZXQgPSBkb21VdGlsLm9mZnNldChoZWFkZXJFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB2YXIgZW5sYXJnZUxlbmd0aCA9IHNlbGYuZ3JpZC5pc1RvdWNoTW9kZSA/IDEwIDogMDtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlUmVjdCA9IG5ldyBNYXNvbnJ5UmVjdChcbiAgICAgICAgICAgICAgICAgICAgZWxlT2Zmc2V0LmxlZnQgLSBoZWFkZXJFbGVtZW50T2Zmc2V0LmxlZnQgLSBlbmxhcmdlTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBlbGVPZmZzZXQudG9wIC0gaGVhZGVyRWxlbWVudE9mZnNldC50b3AgLSBlbmxhcmdlTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50UmVjdC53aWR0aCArIDIgKiBlbmxhcmdlTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50UmVjdC5oZWlnaHQgKyAyICogZW5sYXJnZUxlbmd0aFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKHRvZ2dsZVJlY3QuY29udGFpbnNQb2ludCh7bGVmdDogbGVmdCwgdG9wOiB0b3B9KSkge1xuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvZ2dsZVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwSW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZTogb25FeHBhbmRUb2dnbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKCFncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHJlbGF0aXZlVG9wIC09IGhlYWRlckhlaWdodDtcbiAgICAgICAgICAgIGlmIChyZWxhdGl2ZVRvcCA8IGdyb3VwSGVpZ2h0IC0gZm9vdGVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmhpdFRlc3RHcm91cENvbnRlbnRfKGdyb3VwSW5mbywgVklFV1BPUlQsIGxlZnQsIHJlbGF0aXZlVG9wKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gZ3JvdXBJbmZvLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZ3JvdXBzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEhlaWdodCA9IGdyb3Vwc1tpXS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRpdmVUb3AgPCBncm91cEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoaXRUZXN0R3JvdXBfLmNhbGwoc2VsZiwgZ3JvdXBzW2ldLCBsZWZ0LCByZWxhdGl2ZVRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZVRvcCAtPSBncm91cEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vbG9hZCBncm91cCwgbm90ZSBpdCBoYXMgYm90aCBzeW5jaHJvbm91cyBhbmQgYXN5bmNocm9ub3VzIGxvZ2ljXG4gICAgZnVuY3Rpb24gdHJ5VG9Mb2FkR3JvdXBzXyhncm91cEluZm8sIHZpc2libGVSZWN0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBncm91cENvbnRlbnRJbmZvID0gc2VsZi5ncm91cENvbnRlbnRJbmZvXztcbiAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJJbm5lclNpemVfLmNhbGwoc2VsZik7XG4gICAgICAgIHZhciB3aWR0aCA9IGNvbnRhaW5lclNpemUud2lkdGg7XG5cbiAgICAgICAgc2VsZi5zdGF0dXNfID0gU1RBVFVTX0xPQURJTkc7XG5cbiAgICAgICAgXy5mb3JFYWNoKGdyb3VwQ29udGVudEluZm8sIGZ1bmN0aW9uKGNvbnRlbnRJbmZvKSB7XG4gICAgICAgICAgICBjb250ZW50SW5mby5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ldyBNYXNvbnJ5UmVjdCgwLCAwLCB3aWR0aCwgUE9TSVRJVkVfSU5GSU5JVFkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxvYWRHcm91cHNfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCB2aXNpYmxlUmVjdCwgZmFsc2UsIGZ1bmN0aW9uKGNvbnRlbnRTaXplLCBzeW5jKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNob3dTY3JvbGxCYXIgJiYgY29udGVudFNpemUuaGVpZ2h0ID4gY29udGFpbmVyU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhhc1Njcm9sbEJhcl8gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfID0ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29udGVudFNpemUud2lkdGggLSBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50U2l6ZS5oZWlnaHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkQ29udGVudFNpemVfID0gc2VsZi5jb250ZW50U2l6ZV87XG4gICAgICAgICAgICAgICAgLy9fLmZvckVhY2goZ3JvdXBDb250ZW50SW5mbywgZnVuY3Rpb24oY29udGVudEluZm8pIHtcbiAgICAgICAgICAgICAgICAvLyAgICBzZWxmLnJlbWVhc3VyZV8oY29udGVudEluZm8sIHNlbGYuY29udGVudFNpemVfKTtcbiAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAgICAgIHNlbGYucmVMYXlvdXRfKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfID0gY29udGVudFNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2lmIGFzeW5jaHJvbm91cyBkbyBpbnZhbGlkYXRlXG4gICAgICAgICAgICBpZiAoc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JpZC51cGRhdGVHcm91cEluZm9zXygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5zdGF0dXNfID0gU1RBVFVTX0lETEU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRHcm91cHNfKGdyb3VwSW5mbywgdmlzaWJsZVJlY3QsIHJlbG9hZCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXBDb250ZW50SW5mbyA9IHNlbGYuZ3JvdXBDb250ZW50SW5mb187XG4gICAgICAgIHZhciB3aWR0aCA9IGdldENvbnRlbnRTaXplXy5jYWxsKHNlbGYpLndpZHRoO1xuICAgICAgICB2YXIgcmVsYXRpdmVSZWN0ID0gdmlzaWJsZVJlY3QuY2xvbmUoKTtcbiAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IHZpc2libGVSZWN0LmJvdHRvbTtcbiAgICAgICAgdmFyIGFjY0hlaWdodCA9IDA7XG4gICAgICAgIHZhciBhbGxTeW5GbGFnO1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBncm91cEVsZW1lbnRTdGFjayA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gZ3JvdXBJbmZvLmxlbmd0aCAtIDE7IGkgPiAtMTsgLS1pKSB7XG4gICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICBncm91cEluZm86IGdyb3VwSW5mb1tpXSxcbiAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9IRUFERVJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZW5kVHJ5XyhoZWlnaHQpIHtcbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgcmVsYXRpdmVSZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIGdyb3VwRWxlbWVudFN0YWNrLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICB9LCBhbGxTeW5GbGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIChmdW5jdGlvbiB0cmF2ZXJzZUdyb3VwKGhlaWdodCkge1xuICAgICAgICAgICAgaWYgKCFncm91cEVsZW1lbnRTdGFjayB8fCBncm91cEVsZW1lbnRTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3luY2hyb25vdXNMb2FkID0gdHJ1ZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZEl0ZW1GaW5pc2hfKGNvbnRlbnRTaXplLCBzeW5jKSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ICs9IGNvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoc3luYyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbChhbGxTeW5GbGFnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsU3luRmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3luY2hyb25vdXNMb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhlaWdodCA+IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVHJ5XyhoZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsU3luRmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGVpZ2h0ID4gdGFyZ2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUcnlfKGhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZXJzZUdyb3VwKGhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChzeW5jaHJvbm91c0xvYWQgJiYgIWRvbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBFbGVtZW50U3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBlbmRUcnlfKGhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwRWxlbWVudCA9IGdyb3VwRWxlbWVudFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHZhciBncm91cEluZm8gPSBncm91cEVsZW1lbnQuZ3JvdXBJbmZvO1xuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuaGVhZGVyO1xuICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgIHZhciBhcmVhID0gZ3JvdXBFbGVtZW50LmFyZWE7XG4gICAgICAgICAgICAgICAgaWYgKGFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGVyICYmIGhlYWRlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gc2VsZi5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlaWdodCA+IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRyeV8oaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBncm91cEluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0NPTlRFTlRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gZ3JvdXBJbmZvLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPiAtMTsgLS1pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRWxlbWVudFN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBjaGlsZHJlbltpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbGVtZW50U3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzogZ3JvdXBJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9GT09URVJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUgJiYgIWZvb3Rlci5jb2xsYXBzZVdpdGhHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbGVtZW50U3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBncm91cEluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGdyb3VwSW5mby5wYXRoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEluZm8gPSBncm91cENvbnRlbnRJbmZvW3BhdGguam9pbignXycpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbG9hZCB8fCBjb250ZW50SW5mby5yZW5kZXJlZEl0ZW1zIDwgY29udGVudEluZm8uaXRlbUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUxheW91dEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFNpemU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRJbmZvOiBjb250ZW50SW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIGdyb3VwIGVsZW1lbnQgaXMgYm90dG9tIGNvbnRlbnQsIGl0IGlzIHByb2JhYmx5IG5lY2Vzc2FyeSB0byBsb2FkIGFzeW5jaHJvbm91c2x5LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGh1cyBzZXQgdGhlIHN5bmNocm9ub3VzTG9hZCBmbGFnIHRvIGZhbHNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9BbmQgaWYgdGhlIGNhbGxiYWNrIG9mIGxvYWRJdGVtcyBzaG93cyB0aGF0IGFsbCBpdGVtcyB3ZXJlIGxvYWQgc3luY2hyb25vdXNseSh3aGljaCBtZWFuc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbXMgY29udGFpbiBubyBpbWFnZSB0YWcgb3IgaGF2ZSBvbmx5IGltYWdlIHRhZ3Mgd2hpY2ggaGF2ZSB0aGVpciBVUkwgYWxyZWFkeSBsb2FkZWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBzZXQgdGhlIGZsYWcgYmFjayB0byB0cnVlLCBpbiBvcmRlciB0byBzdGF5IGluIHRoZSB3aGlsZSBsb29wIHRvIGxpbWl0IHRoZSByZWN1cnNpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0YWNrLlxuICAgICAgICAgICAgICAgICAgICAgICAgc3luY2hyb25vdXNMb2FkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZVJlY3Quc2V0UmVjdCh2aXNpYmxlUmVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZVJlY3QudG9wIC09IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRJdGVtc18uY2FsbChzZWxmLCBpdGVtTGF5b3V0SW5mbywgcmVsYXRpdmVSZWN0LCBmYWxzZSwgbG9hZEl0ZW1GaW5pc2hfKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BlZWQgdXAsIGlmIHRoZSBib3R0b20gZ3JvdXAgaXMgbG9hZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgKz0gZ2V0TWF4SGVpZ2h0QnlGcmVlUmVjdEFycl8oY29udGVudEluZm8uZnJlZVJlY3RhbmdsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlaWdodCA+IHRhcmdldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRyeV8oaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoZWlnaHQgPiB0YXJnZXRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRyeV8oaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgICAgIH0pKGFjY0hlaWdodCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJ5VG9Mb2FkSXRlbXNfKGl0ZW1MYXlvdXRJbmZvLCB2aXNpYmxlUmVjdCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgd2lkdGggPSBpdGVtTGF5b3V0SW5mby5jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gaXRlbUxheW91dEluZm8uY29udGVudEluZm87XG4gICAgICAgIHZhciBjb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVySW5uZXJTaXplXy5jYWxsKHNlbGYpO1xuXG4gICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19MT0FESU5HO1xuICAgICAgICAvL2luaXQgcmVjdFxuICAgICAgICBjb250ZW50SW5mby5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ldyBNYXNvbnJ5UmVjdCgwLCAwLCB3aWR0aCwgUE9TSVRJVkVfSU5GSU5JVFkpKTtcbiAgICAgICAgbG9hZEl0ZW1zXy5jYWxsKHNlbGYsIGl0ZW1MYXlvdXRJbmZvLCB2aXNpYmxlUmVjdCwgZmFsc2UsIGZ1bmN0aW9uKGNvbnRlbnRTaXplLCBzeW5jKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnNob3dTY3JvbGxCYXIgJiYgY29udGVudFNpemUuaGVpZ2h0ID4gY29udGFpbmVyU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhhc1Njcm9sbEJhcl8gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGVudFNpemVfID0ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29udGVudFNpemUud2lkdGggLSBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50U2l6ZS5oZWlnaHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkQ29udGVudFNpemVfID0gc2VsZi5jb250ZW50U2l6ZV87XG4gICAgICAgICAgICAgICAgc2VsZi5yZUxheW91dF8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250ZW50U2l6ZV8gPSBjb250ZW50U2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgYXN5bmNocm9ub3VzIGRvIGludmFsaWRhdGVcbiAgICAgICAgICAgIGlmIChzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5zdGF0dXNfID0gU1RBVFVTX0lETEU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vZGVUb0hlaWdodF8ocmVmcmVzaE1vZGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29udGFpbmVyU2l6ZSA9IGdldENvbnRhaW5lcklubmVyU2l6ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIHJlZnJlc2hIZWlnaHQ7XG4gICAgICAgIHN3aXRjaCAocmVmcmVzaE1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgUVVBUlRFUl9DT05UQUlORVJfSEVJR0hUOlxuICAgICAgICAgICAgICAgIHJlZnJlc2hIZWlnaHQgPSBjb250YWluZXJTaXplLmhlaWdodCAvIDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhBTEZfQ09OVEFJTkVSX0hFSUdIVDpcbiAgICAgICAgICAgICAgICByZWZyZXNoSGVpZ2h0ID0gY29udGFpbmVyU2l6ZS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDT05UQUlORVJfSEVJR0hUOlxuICAgICAgICAgICAgICAgIHJlZnJlc2hIZWlnaHQgPSBjb250YWluZXJTaXplLmhlaWdodDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQUxMX0hFSUdIVDpcbiAgICAgICAgICAgICAgICByZWZyZXNoSGVpZ2h0ID0gUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJlZnJlc2hIZWlnaHQgPSBwYXJzZUZsb2F0KHJlZnJlc2hNb2RlKTtcbiAgICAgICAgICAgICAgICByZWZyZXNoSGVpZ2h0ID0gZ2NVdGlscy5pc051bWJlcihyZWZyZXNoSGVpZ2h0KSA/XG4gICAgICAgICAgICAgICAgICAgIG1hdGhNYXgocmVmcmVzaEhlaWdodCwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWZyZXNoSGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbGwgaXRlbXMgdG8gdGhlIHZpc2libGUgcmVjdGFuZ2xlLlxuICAgICAqIEBwYXJhbSBpdGVtTGF5b3V0SW5mb1xuICAgICAqIEBwYXJhbSB2aXNpYmxlUmVjdFxuICAgICAqIEBwYXJhbSByZWxvYWRcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvYWRJdGVtc18oaXRlbUxheW91dEluZm8sIHZpc2libGVSZWN0LCByZWxvYWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gaXRlbUxheW91dEluZm8uY29udGVudEluZm87XG4gICAgICAgIHZhciBjb250ZW50U2l6ZSA9IGl0ZW1MYXlvdXRJbmZvLmNvbnRlbnRTaXplO1xuICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdmlzaWJsZVJlY3QuYm90dG9tO1xuICAgICAgICB2YXIgbGFzdEl0ZW0gPSBjb250ZW50SW5mby5yZW5kZXJlZEl0ZW1zID4gMCAmJiBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgY29udGVudEluZm8ucmVuZGVyZWRJdGVtcyAtIDEsIGNvbnRlbnRJbmZvLmdyb3VwKTtcbiAgICAgICAgaWYgKGxhc3RJdGVtICYmIChsYXN0SXRlbS5yZWN0LnRvcCA+IHRhcmdldEhlaWdodCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGNvbnRlbnRTaXplLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXRlbUNvdW50ID0gY29udGVudEluZm8uaXRlbUNvdW50O1xuICAgICAgICB2YXIgY29udGVudFdpZHRoID0gY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIHZhciBjdXJyZW50Q29udGVudFNpemUgPSBfLmNsb25lKGNvbnRlbnRTaXplKTtcbiAgICAgICAgdmFyIGFsbFN5bkZsYWcgPSB0cnVlO1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vdG9kbzogdGhyb3cgZXJyb3Igd2hlbiBsb29wIHRvbyBtYW55IHRpbWVzIG9yIGxvYWRlZCB0b28gbWFueSBpdGVtcy5cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJlbnRDb250ZW50U2l6ZSwgYWxsU3luRmxhZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gY29udGVudEluZm8ucmVuZGVyZWRJdGVtcztcbiAgICAgICAgICAgIHZhciBlbmQgPSBtYXRoTWluKGNvbnRlbnRJbmZvLnJlbmRlcmVkSXRlbXMgKyBCVUZGRVJfTEVOR1RILCBpdGVtQ291bnQpO1xuICAgICAgICAgICAgZ2V0SXRlbVJlY3RhbmdsZXNfLmNhbGwoc2VsZiwgaXRlbUxheW91dEluZm8sIHtzdGFydDogc3RhcnQsIGVuZDogZW5kfSwgcmVsb2FkLCBmdW5jdGlvbihpdGVtcywgc3luYykge1xuICAgICAgICAgICAgICAgIGFsbFN5bkZsYWcgPSBhbGxTeW5GbGFnICYmIHN5bmM7XG4gICAgICAgICAgICAgICAgY29udGVudEluZm8ucmVuZGVyZWRJdGVtcyArPSBlbmQgLSBzdGFydDtcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2VkSXRlbVJlY3RBcnIgPSBwbGFjZUl0ZW1zXy5jYWxsKHNlbGYsIGl0ZW1zLCBjb250ZW50SW5mbywgY29udGVudFdpZHRoKTtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZ2V0TWF4SGVpZ2h0QnlGcmVlUmVjdEFycl8oY29udGVudEluZm8uZnJlZVJlY3RhbmdsZXMpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZW50U2l6ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBtYXhpbXVtVG9wID0gMDtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2gocGxhY2VkSXRlbVJlY3RBcnIsIGZ1bmN0aW9uKGl0ZW1SZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heGltdW1Ub3AgPSBtYXRoTWF4KG1heGltdW1Ub3AsIGl0ZW1SZWN0LnRvcCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1heGltdW1Ub3AgPiB0YXJnZXRIZWlnaHQgfHwgY29udGVudEluZm8ucmVuZGVyZWRJdGVtcyA9PT0gaXRlbUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbiAgICAvL3RvZG86IGhhbmRsZSB2aWRlbyB0YWcgc2l6ZVxuICAgIC8vYnkgZHVyYXRpb25jaGFuZ2UgZXZlbnQgYW5kIGVycm9yIGV2ZW50XG4gICAgZnVuY3Rpb24gZ2V0SXRlbVJlY3RhbmdsZXNfKGl0ZW1MYXlvdXRJbmZvLCBpbmRleFJhbmdlLCByZWxvYWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVJbWFnZV8oKSB7XG4gICAgICAgICAgICAtLWltZ1RhZ0NvdW50O1xuICAgICAgICAgICAgaWYgKGltZ1RhZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHF1ZXJ5LCBmdW5jdGlvbihpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB1cGRhdGVJbWFnZV8pO1xuICAgICAgICAgICAgICAgICAgICBpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCB1cGRhdGVJbWFnZV8pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtUmVjdEFyciA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGl0ZW1JbmZvQXJyLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IGxvYWRlZCBpdGVtIHNpemUuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtSW5mb0FycltpXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVJlY3RBcnIucHVzaChpdGVtLnJlY3QgPSBnZXRFbGVtZW50TWFzb25yeVJlY3RfLmNhbGwoc2VsZiwgYnVmZmVyQ29udGFpbmVyLmNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYnVmZmVyQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpdGVtUmVjdEFyciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vZ2V0IGl0ZW0gaHRtbFxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgdmFyIGl0ZW1JbmZvO1xuICAgICAgICB2YXIgaXRlbUluZm9BcnIgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1Db3VudCA9IGluZGV4UmFuZ2UuZW5kIC0gaW5kZXhSYW5nZS5zdGFydDtcbiAgICAgICAgdmFyIGZyYWdtZW50ID0gJyc7XG4gICAgICAgIHZhciBncm91cCA9IGl0ZW1MYXlvdXRJbmZvLmNvbnRlbnRJbmZvLmdyb3VwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbUNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIGl0ZW1JbmZvQXJyLnB1c2goaXRlbUluZm8gPSBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgaW5kZXggPSBpICsgaW5kZXhSYW5nZS5zdGFydCwgZ3JvdXApKTtcbiAgICAgICAgICAgIGl0ZW0gPSBnZXRJdGVtRGF0YUJ5SW5kZXhfLmNhbGwoc2VsZiwgaW5kZXgsIGdyb3VwKTtcbiAgICAgICAgICAgIGlmIChyZWxvYWQgfHwgIWl0ZW1JbmZvLnJlY3QpIHtcbiAgICAgICAgICAgICAgICAvL2ZyYWdtZW50ICs9IGl0ZW1JbmZvLmh0bWwgPSBzZWxmLmdldFJvd1RlbXBsYXRlKCkoaXRlbSk7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnQgKz0gJzxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtcIj4nICsgKGl0ZW1JbmZvLmh0bWwgPSBzZWxmLmdldFJvd1RlbXBsYXRlKCkoaXRlbSkpICsgJzwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy92YXIgY29udGVudFNpemUgPSBpdGVtTGF5b3V0SW5mby5jb250ZW50U2l6ZTtcbiAgICAgICAgLy92YXIgYnVmZmVyQ29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IHN0eWxlPVwibGVmdDotMTAwMDBweDt0b3A6LTEwMDAwcHg7d2lkdGg6JyArIGNvbnRlbnRTaXplLndpZHRoICtcbiAgICAgICAgLy8ncHg7aGVpZ2h0OicgKyBjb250ZW50U2l6ZS5oZWlnaHQgK1xuICAgICAgICAvLydweDtwb3NpdGlvbjphYnNvbHV0ZTtcIj48L2Rpdj4nKTtcbiAgICAgICAgdmFyIGJ1ZmZlckNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cImxlZnQ6LTEwMDAwcHg7dG9wOi0xMDAwMHB4O3Bvc2l0aW9uOmFic29sdXRlO1wiPjwvZGl2PicpO1xuICAgICAgICBidWZmZXJDb250YWluZXIuaW5uZXJIVE1MID0gZnJhZ21lbnQ7XG4gICAgICAgIHZhciBpbWdUYWdDb3VudDtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gYnVmZmVyQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuICAgICAgICBsZW4gPSBpbWdUYWdDb3VudCA9IHF1ZXJ5Lmxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChxdWVyeVtpXS5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIC0taW1nVGFnQ291bnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXJ5W2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB1cGRhdGVJbWFnZV8pO1xuICAgICAgICAgICAgICAgIHF1ZXJ5W2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdXBkYXRlSW1hZ2VfKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vYXBwZW5kIGl0ZW1zIGFuZCBtZWFzdXJlIHNpemVcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidWZmZXJDb250YWluZXIpO1xuXG4gICAgICAgIC8vaWYgdGhlcmUgYXJlIG5vIGltYWdlIHRhZ3MsIGRpcmVjdGx5IGxvYWQgc2l6ZVxuICAgICAgICAvL05vdGU6IHRoaXMgYmxvY2sgcHJlY2VzcyBzeW5jaHJvbm91c2x5XG4gICAgICAgIGlmIChpbWdUYWdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIGl0ZW1SZWN0QXJyID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBpdGVtSW5mb0Fyci5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgIC8vZ2V0IGxvYWRlZCBpdGVtIHNpemUuXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW1JbmZvQXJyW2ldO1xuICAgICAgICAgICAgICAgIGl0ZW1SZWN0QXJyLnB1c2goaXRlbS5yZWN0ID0gZ2V0RWxlbWVudE1hc29ucnlSZWN0Xy5jYWxsKHNlbGYsIGJ1ZmZlckNvbnRhaW5lci5jaGlsZHJlbltpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChidWZmZXJDb250YWluZXIpO1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpdGVtUmVjdEFyciwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJdGVtRGF0YUJ5SW5kZXhfKGluZGV4LCBncm91cCkge1xuICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgcmV0dXJuIGdyb3VwID8gZ3JpZC5mb3JtYXREYXRhSXRlbShncm91cC5nZXRJdGVtKGluZGV4KSkgOiBncmlkLmdldEZvcm1hdHRlZERhdGFJdGVtKGluZGV4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJdGVtSW5mb0J5SW5kZXhfKGluZGV4LCBncm91cCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjYWxjU291cmNlID0gc2VsZi5ncmlkLmRhdGEuY2FsY1NvdXJjZTtcbiAgICAgICAgcmV0dXJuIGdyb3VwID9cbiAgICAgICAgICAgIHNlbGYuaXRlbXNfW2dyb3VwLnRvU291cmNlUm93KGluZGV4KV0gOlxuICAgICAgICAgICAgc2VsZi5pdGVtc19bY2FsY1NvdXJjZS5tYXBUb1NvdXJjZVJvdyhpbmRleCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRNYXNvbnJ5UmVjdF8oZWxlbWVudCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgY29sdW1uV2lkdGggPSBvcHRpb25zLmNvbHVtbldpZHRoO1xuICAgICAgICB2YXIgcm93SGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgIHZhciByZWN0U2l6ZSA9IGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QoZWxlbWVudCk7XG4gICAgICAgIHZhciB3aWR0aCA9IG1hdGhDZWlsKHJlY3RTaXplLndpZHRoIC8gY29sdW1uV2lkdGgpICogY29sdW1uV2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSBtYXRoQ2VpbChyZWN0U2l6ZS5oZWlnaHQgLyByb3dIZWlnaHQpICogcm93SGVpZ2h0O1xuICAgICAgICBzZWxmLm1pbkl0ZW1XaWR0aF8gPSBtYXRoTWluKHdpZHRoLCBzZWxmLm1pbkl0ZW1XaWR0aF8pO1xuICAgICAgICBzZWxmLm1pbkl0ZW1IZWlnaHRfID0gbWF0aE1pbihoZWlnaHQsIHNlbGYubWluSXRlbUhlaWdodF8pO1xuICAgICAgICByZXR1cm4gbmV3IE1hc29ucnlSZWN0KFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1heEhlaWdodEJ5RnJlZVJlY3RBcnJfKGZyZWVSZWN0QXJyKSB7XG4gICAgICAgIHJldHVybiAoIWZyZWVSZWN0QXJyIHx8IGZyZWVSZWN0QXJyLmxlbmd0aCA9PT0gMCkgPyAwIDogZnJlZVJlY3RBcnJbZnJlZVJlY3RBcnIubGVuZ3RoIC0gMV0udG9wO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBsYWNlSXRlbXNfKGl0ZW1zLCBjb250ZW50SW5mbywgY29udGVudFdpZHRoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciBzdGVwQnlTdGVwID0gb3B0aW9ucy5rZWVwT3JkZXI7XG4gICAgICAgIHZhciByaWdodFRvTGVmdCA9IG9wdGlvbnMucmlnaHRUb0xlZnQ7XG4gICAgICAgIHZhciBndXR0ZXIgPSBvcHRpb25zLmd1dHRlcjtcbiAgICAgICAgdmFyIGl0ZW1SZWN0QXJyID0gaXRlbXMuc2xpY2UoKTtcbiAgICAgICAgdmFyIGl0ZW1SZWN0QXJyV2l0aEd1dHRlciA9IGl0ZW1SZWN0QXJyLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IGl0ZW0uY2xvbmUoKTtcbiAgICAgICAgICAgIHJlY3QuaGVpZ2h0ICs9IGd1dHRlcjtcbiAgICAgICAgICAgIHJlY3Qud2lkdGggKz0gZ3V0dGVyO1xuICAgICAgICAgICAgcmV0dXJuIHJlY3Q7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBzZWFyY2hMZW5ndGggPSBzdGVwQnlTdGVwID8gMSA6IEZJVF9TRUFSQ0hfTEVOR1RIO1xuXG4gICAgICAgIHdoaWxlIChpdGVtUmVjdEFyci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgZnJlZVJlY3RhbmdsZXMgPSBjb250ZW50SW5mby5mcmVlUmVjdGFuZ2xlcztcbiAgICAgICAgICAgIHZhciBuZXdGcmVlUmVjdGFuZ2xlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGZpdCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGl0ZW1SZWN0O1xuICAgICAgICAgICAgdmFyIGl0ZW1SZWN0V2l0aEd1dHRlcjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmcmVlUmVjdGFuZ2xlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgIC8vZml0c01vc3Qgd2lsbCByZXR1cm4gZmFsc2Ugd2hpbGUgYWxsIGlucHV0IHJlY3RhbmdsZXMgZG8gbm90IGZpdFxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZyZWVSZWN0YW5nbGVzW2ldLmZpdHNNb3N0KFxuICAgICAgICAgICAgICAgICAgICBpdGVtUmVjdEFycixcbiAgICAgICAgICAgICAgICAgICAgZ3V0dGVyLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaExlbmd0aFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtUmVjdCA9IGl0ZW1SZWN0QXJyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVJlY3RXaXRoR3V0dGVyID0gaXRlbVJlY3RBcnJXaXRoR3V0dGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVJlY3RBcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVJlY3RBcnJXaXRoR3V0dGVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZyZWVSZWN0YW5nbGVzID0gbmV3RnJlZVJlY3RhbmdsZXMuY29uY2F0KGZyZWVSZWN0YW5nbGVzW2ldLnBsYWNlUmVjdFdpdGhHdXR0ZXIoaXRlbVJlY3QsIGl0ZW1SZWN0V2l0aEd1dHRlciwgcmlnaHRUb0xlZnQpKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbkogPSBmcmVlUmVjdGFuZ2xlcy5sZW5ndGg7IGogPCBsZW5KOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqICE9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RnJlZVJlY3RhbmdsZXMgPSBuZXdGcmVlUmVjdGFuZ2xlcy5jb25jYXQoZnJlZVJlY3RhbmdsZXNbal0ucGFydGl0aW9uUmVjdChpdGVtUmVjdFdpdGhHdXR0ZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZml0KSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VSZWN0QXJyXy5jYWxsKHNlbGYsIG5ld0ZyZWVSZWN0YW5nbGVzKTtcbiAgICAgICAgICAgICAgICAvL3NvcnQgc3BhY2VzLCBmaWxsIGhpZ2hlciBvbmVzIGZpcnN0LlxuICAgICAgICAgICAgICAgIGNvbnRlbnRJbmZvLmZyZWVSZWN0YW5nbGVzID0gbmV3RnJlZVJlY3RhbmdsZXMuc29ydChmdW5jdGlvbihyZWN0MSwgcmVjdDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY3QxLnRvcCA+IHJlY3QyLnRvcCA/IDEgOiAocmVjdDEudG9wID09PSByZWN0Mi50b3AgPyAwIDogLTEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtUmVjdEFyci5zcGxpY2UoMCwgc2VhcmNoTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXJnZVJlY3RBcnJfKHJlY3RBcnIpIHtcbiAgICAgICAgLy90b2RvOiBhY2NlbGVyYXRlIG1lcmdlXG4gICAgICAgIC8vcGxhbjE6IHBydW5lIHNtYWxsIHJlY3QgKGRvbmUpXG4gICAgICAgIC8vcGxhbjI6IHBydW5lIHJlbW90ZSByZWN0XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGd1dHRlciA9IHNlbGYub3B0aW9ucy5ndXR0ZXI7XG4gICAgICAgIHZhciBwcnVuZUZsYWcgPSByZWN0QXJyLmxlbmd0aCA+IFBSVU5FX0ZSRUVfUkVDVF9TVEFSVF9BVDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWN0QXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFJlY3QgPSByZWN0QXJyW2ldO1xuICAgICAgICAgICAgaWYgKCFjdXJyZW50UmVjdCB8fCBwcnVuZUZsYWcgJiYgIWN1cnJlbnRSZWN0LmZpdHMoe3dpZHRoOiBzZWxmLm1pbkl0ZW1XaWR0aF8gKyBndXR0ZXIsIGhlaWdodDogc2VsZi5taW5JdGVtSGVpZ2h0XyArIGd1dHRlcn0pKSB7XG4gICAgICAgICAgICAgICAgcmVjdEFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgLS1pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZWN0QXJyLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGogPCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVjdC5jb250YWlucyhyZWN0QXJyW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdEFyci5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAtLWo7XG4gICAgICAgICAgICAgICAgICAgICAgICAtLWk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGogPiBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UmVjdC5jb250YWlucyhyZWN0QXJyW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdEFyci5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAtLWo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb250YWluZXJJbm5lclNpemVfKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBzZWxmLmNvbnRhaW5lcklubmVyU2l6ZV8gfHwgKHNlbGYuY29udGFpbmVySW5uZXJTaXplXyA9IGRvbVV0aWwuZ2V0Q29udGVudFJlY3Qoc2VsZi5ncmlkLmNvbnRhaW5lcikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvbnRlbnRTaXplXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgaWYgKCFzZWxmLmNvbnRlbnRTaXplXykge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJJbm5lclNpemVfLmNhbGwoc2VsZik7XG4gICAgICAgICAgICBzZWxmLmNvbnRlbnRTaXplXyA9IHNlbGYuY2FjaGVkQ29udGVudFNpemVfID8gXy5jbG9uZShzZWxmLmNhY2hlZENvbnRlbnRTaXplXykgOiBfLmNsb25lKGNvbnRhaW5lclNpemUpO1xuICAgICAgICAgICAgdmFyIHZpc2libGVSZWN0ID0gbmV3IE1hc29ucnlSZWN0KDAsIDAsIGNvbnRhaW5lclNpemUud2lkdGgsIGNvbnRhaW5lclNpemUuaGVpZ2h0ICsgZ3JpZC5zY3JvbGxPZmZzZXQudG9wKTtcbiAgICAgICAgICAgIGlmIChncmlkLmRhdGEuZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgdHJ5VG9Mb2FkR3JvdXBzXy5jYWxsKHNlbGYsIGdyaWQuZ3JvdXBJbmZvc18sIHZpc2libGVSZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1MYXlvdXRJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50U2l6ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbnRhaW5lclNpemUud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNvbnRhaW5lclNpemUuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRJbmZvOiBzZWxmLmNvbnRlbnRJbmZvX1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdHJ5VG9Mb2FkSXRlbXNfLmNhbGwoc2VsZiwgaXRlbUxheW91dEluZm8sIHZpc2libGVSZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZi5jb250ZW50U2l6ZV87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29udGFpbmVyU2l6ZSA9IGdldENvbnRhaW5lcklubmVyU2l6ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIGNvbnRlbnRTaXplID0gZ2V0Q29udGVudFNpemVfLmNhbGwoc2VsZik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IGNvbnRlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBjb250YWluZXJTaXplLmhlaWdodCxcbiAgICAgICAgICAgIGNvbnRlbnRXaWR0aDogY29udGVudFNpemUud2lkdGgsXG4gICAgICAgICAgICBjb250ZW50SGVpZ2h0OiBjb250ZW50U2l6ZS5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYXdSb3dUZW1wbGF0ZV8oKSB7XG4gICAgICAgIHZhciByb3dUbXBsID0gdGhpcy5vcHRpb25zLnJvd1RlbXBsYXRlO1xuICAgICAgICBpZiAocm93VG1wbCkge1xuICAgICAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcocm93VG1wbCkgJiYgcm93VG1wbC5sZW5ndGggPiAxICYmIHJvd1RtcGxbMF0gPT09ICcjJykge1xuICAgICAgICAgICAgICAgIHZhciB0bXBsRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJvd1RtcGwuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICsgdG1wbEVsZW1lbnQuaW5uZXJIVE1MICsgJzwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3dUbXBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldERlZmF1bHRSYXdSb3dUZW1wbGF0ZV8uY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRSYXdSb3dUZW1wbGF0ZV8oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGNvbHMgPSBzZWxmLmdyaWQuY29sdW1ucztcblxuICAgICAgICB2YXIgciA9ICc8ZGl2Pic7XG4gICAgICAgIF8uZWFjaChjb2xzLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgIGlmIChjb2wudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHIgKz0gJzxkaXYgY2xhc3M9XCJnYy1yb3ctY29sdW1uXCIgc3R5bGU9XCInICsgKGNvbC52aXNpYmxlID8gJycgOiAnZGlzcGxheTpub25lJykgKyAnXCIgZGF0YS1jb2x1bW49XCInICsgY29sLmlkICsgJ1wiPjwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByICs9ICc8L2Rpdj4nO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZW1wbGF0ZV8oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHNlbGYucm93VGVtcGxhdGVGbl8pIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnJvd1RlbXBsYXRlRm5fO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHRoaXMpO1xuICAgICAgICB2YXIgb2xkQ29sVG1wbDtcbiAgICAgICAgdmFyIG5ld0NvbFRtcGw7XG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgdmFyIGNzc05hbWU7XG4gICAgICAgIHZhciB0YWdOYW1lO1xuICAgICAgICB2YXIgY29sVG1wbDtcbiAgICAgICAgdmFyIGNvbEFubm90YXRpb247XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQodGVtcGxhdGVTdHIpO1xuICAgICAgICAvL0RpZmZlcmVudCBicm93c2VycyBtYXkgcmV0dXJuIGRpZmZlcmVudCBpbm5lckhUTUxzIGNvbXBhcmVkIHdpdGggdGhlIG9yaWdpbmFsIEhUTUwsXG4gICAgICAgIC8vdGhleSBtYXkgcmVvcmRlciB0aGUgYXR0cmlidXRlIG9mIGEgdGFnLGVzY2FwZXMgdGFncyB3aXRoIGluc2lkZSBhIG5vc2NyaXB0IHRhZyBldGMuXG4gICAgICAgIHRlbXBsYXRlU3RyID0gZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0KGVsZW1lbnQpO1xuXG4gICAgICAgIHZhciBhbm5vdGF0aW9uQ29scyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29sdW1uXScpO1xuICAgICAgICBfLmVhY2goYW5ub3RhdGlvbkNvbHMsIGZ1bmN0aW9uKGFubm90YXRpb25Db2wsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgY29sID0gc2VsZi5ncmlkLmdldENvbEJ5SWRfKGFubm90YXRpb25Db2wuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbHVtbicpKTtcbiAgICAgICAgICAgIGlmIChjb2wgJiYgY29sLmRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2wuaXNDYWxjQ29sdW1uXykge1xuICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gJ3t7PWl0LicgKyBjb2wuaWQgKyAnfX0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhRmllbGRzID0gY29sLmRhdGFGaWVsZC5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUZpZWxkcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSBjb2wucHJlc2VudGVyIHx8ICd7ez1pdC4nICsgY29sLmRhdGFGaWVsZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFGaWVsZHMsIGZ1bmN0aW9uKGRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChzZWxmLmdyaWQuZ2V0Q29sQnlJZF8uY2FsbChzZWxmLCBkYXRhRmllbGQpLnByZXNlbnRlciB8fCAne3s9aXQuJyArIGNvbC5kYXRhRmllbGQgKyAnfX0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sQW5ub3RhdGlvbiA9IHRlbXAuam9pbignICcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xUbXBsID0gYW5ub3RhdGlvbkNvbDtcbiAgICAgICAgICAgIHRhZ05hbWUgPSBjb2xUbXBsLnRhZ05hbWU7XG4gICAgICAgICAgICBvbGRDb2xUbXBsID0gZG9tVXRpbC5nZXRFbGVtZW50T3V0ZXJUZXh0KGNvbFRtcGwpO1xuICAgICAgICAgICAgaWQgPSAnYycgKyBpbmRleDtcbiAgICAgICAgICAgIGNzc05hbWUgPSAnZ2MtY2VsbCc7XG5cbiAgICAgICAgICAgIG5ld0NvbFRtcGwgPSBvbGRDb2xUbXBsLnNsaWNlKDAsIG9sZENvbFRtcGwubGVuZ3RoIC0gKHRhZ05hbWUubGVuZ3RoICsgMykpICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIm92ZXJmbG93OmhpZGRlbjtcIj48ZGl2IGNsYXNzPVwiJyArIGNzc05hbWUgKyAnICcgKyBpZCArICdcIicgKyAnIHJvbGU9XCJncmlkY2VsbFwiPicgK1xuICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gKyAnPC9kaXY+PC9kaXY+PC8nICsgdGFnTmFtZSArICc+JztcblxuICAgICAgICAgICAgLy9vdXRlckhUTUwgcmV0dXJucyBkb3VibGUgcXVvdGVzIGluIGF0dHJpYnV0ZSBzb21ldGltZXNcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZVN0ci5pbmRleE9mKG9sZENvbFRtcGwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG9sZENvbFRtcGwgPSBvbGRDb2xUbXBsLnJlcGxhY2UoL1wiL2csICdcXCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBsYXRlU3RyID0gdGVtcGxhdGVTdHIucmVwbGFjZShvbGRDb2xUbXBsLCBuZXdDb2xUbXBsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5yb3dUZW1wbGF0ZUZuXyA9IGRvVC50ZW1wbGF0ZSh0ZW1wbGF0ZVN0ciwgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZWxmLnJvd1RlbXBsYXRlRm5fO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlckluZm9JbnRlcm5hbF8ob3B0aW9ucywgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGxheW91dEluZm8gPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgIHZhciB2aXNpYmxlUmVjdCA9IG5ldyBNYXNvbnJ5UmVjdChvcHRpb25zLm9mZnNldExlZnQsIG9wdGlvbnMub2Zmc2V0VG9wLCBsYXlvdXRJbmZvLndpZHRoLCBsYXlvdXRJbmZvLmhlaWdodCk7XG4gICAgICAgIHJldHVybiBzZWxmLmdyaWQuZGF0YS5ncm91cHMgP1xuICAgICAgICAgICAgZ2V0UmVuZGVyZWRHcm91cEl0ZW1zSW5mb18uY2FsbChzZWxmLCB2aXNpYmxlUmVjdCwgZ2V0VXBkYXRlUm93KSA6XG4gICAgICAgICAgICBnZXRSZW5kZXJlZEl0ZW1zSW5mb18uY2FsbChzZWxmLCB2aXNpYmxlUmVjdCwgZ2V0VXBkYXRlUm93KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZEdyb3VwSXRlbXNJbmZvXyh2aXNpYmxlUmVjdCwgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBlbnRpcmVHcm91cEluZm9zID0gZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgdmFyIGxheW91dEluZm8gPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgIHZhciByaWdodFRvTGVmdCA9IHNlbGYub3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgdmFyIGdyb3VwRWxlbWVudDtcbiAgICAgICAgdmFyIGdyb3VwSW5mbztcbiAgICAgICAgdmFyIGdyb3VwUmVjdCA9IG5ldyBNYXNvbnJ5UmVjdCgwLCAwLCBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCwgMCk7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIHZhciBncm91cEVsZW1lbnRTdGFjayA9IFtdO1xuICAgICAgICBmb3IgKGkgPSBlbnRpcmVHcm91cEluZm9zLmxlbmd0aCAtIDE7IGkgPiAtMTsgLS1pKSB7XG4gICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICBwYXRoOiBbaV0sXG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBlbnRpcmVHcm91cEluZm9zW2ldLFxuICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhcnRSZW5kZXIgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVuZFJlbmRlciA9IGZhbHNlO1xuICAgICAgICAvL3N0YXJ0IHJlbmRlciwgZmxhZ3MgYXJlIGZvciBxdWljayBleGl0LlxuICAgICAgICB3aGlsZSAoZ3JvdXBFbGVtZW50U3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGVuZFJlbmRlcikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBFbGVtZW50ID0gZ3JvdXBFbGVtZW50U3RhY2sucG9wKCk7XG4gICAgICAgICAgICBncm91cEluZm8gPSBncm91cEVsZW1lbnQuZ3JvdXBJbmZvO1xuICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IGdyb3VwRWxlbWVudC5hcmVhO1xuICAgICAgICAgICAgdmFyIGhlYWRlcjtcbiAgICAgICAgICAgIHZhciBmb290ZXI7XG4gICAgICAgICAgICB2YXIgcGF0aFN0ciA9IGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIC8vcmVuZGVyOlxuICAgICAgICAgICAgaWYgKGFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgIGhlYWRlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5oZWFkZXI7XG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlciAmJiBoZWFkZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBncm91cFJlY3QuaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJsZVJlY3Qub3ZlcmxhcHMoZ3JvdXBSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBncmlkLnVpZCArICctZ2gnICsgcGF0aFN0cjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdldFVwZGF0ZVJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvOiBncm91cEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzOiBncm91cFJlY3QuY2xvbmUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0R3JvdXBIZWFkZXJSb3dfLmNhbGwoc2VsZiwga2V5LCBncm91cEVsZW1lbnQsIGdyb3VwSW5mbywgZ3JvdXBSZWN0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZpc2libGVSZWN0Lm92ZXJsYXBzKGdyb3VwUmVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09IEdST1VQX0NPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICBncm91cFJlY3QuaGVpZ2h0ID0gc2VsZi5nZXRJbm5lckdyb3VwSGVpZ2h0KGdyb3VwSW5mbyk7XG4gICAgICAgICAgICAgICAgaWYgKCFzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJsZVJlY3Qub3ZlcmxhcHMoZ3JvdXBSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICByb3dzID0gcm93cy5jb25jYXQoZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtc0luZm9fLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCBncm91cFJlY3QsIHZpc2libGVSZWN0LCBnZXRVcGRhdGVSb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZpc2libGVSZWN0Lm92ZXJsYXBzKGdyb3VwUmVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwSW5mby5kYXRhLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgaWYgKGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBncm91cFJlY3QuaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJsZVJlY3Qub3ZlcmxhcHMoZ3JvdXBSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZ3JpZC51aWQgKyAnLWdmJyArIGdyb3VwRWxlbWVudC5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogZ3JvdXBFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZHM6IGdyb3VwUmVjdC5jbG9uZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRHcm91cEZvb3RlclJvd18uY2FsbChzZWxmLCBrZXksIGdyb3VwRWxlbWVudCwgZ3JvdXBSZWN0LCByaWdodFRvTGVmdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBSZWN0LnRvcCArPSBncm91cFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2aXNpYmxlUmVjdC5vdmVybGFwcyhncm91cFJlY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90cmF2ZXJzZTpcbiAgICAgICAgICAgIGlmIChhcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgIGlmIChncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncm91cC5pc0JvdHRvbUxldmVsICYmIGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSAmJiAhZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEVsZW1lbnQucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm86IGdyb3VwSW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9GT09URVJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbGVtZW50U3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBFbGVtZW50LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBncm91cEluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEVsZW1lbnQucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm86IGdyb3VwSW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IGdyb3VwLmlzQm90dG9tTGV2ZWwgPyBncm91cC5pdGVtQ291bnQgOiBncm91cEluZm8uY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+IC0xOyAtLWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEVsZW1lbnRTdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBFbGVtZW50LnBhdGguc2xpY2UoKS5jb25jYXQoW2ldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBncm91cEluZm8uY2hpbGRyZW5baV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtc0luZm9fKGdyb3VwSW5mbywgZ3JvdXBSZWN0LCB2aXNpYmxlUmVjdCwgZ2V0VXBkYXRlUm93LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICBpZiAoIWdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aFN0ciA9IGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgdmFyIGtleUJhc2UgPSBzZWxmLmdyaWQudWlkICsgJy1ncicgKyBwYXRoU3RyICsgJy1yJztcbiAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gc2VsZi5ncm91cENvbnRlbnRJbmZvX1twYXRoU3RyXTtcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgdmFyIHJlbGF0aXZlUmVjdDtcbiAgICAgICAgdmFyIHZlY3RvclkgPSBncm91cFJlY3QudG9wO1xuICAgICAgICAvLyBmb3IgZWFjaCBpdGVtcyB3aGljaCBoYXZlIGluZGV4IDwgbG9hZGVkSXRlbXMsIGNoZWNrIHRoZSBwbGFjZWQgcHJvcGVydHlcbiAgICAgICAgLy8gaWYgcGxhY2VkIGFuZCBvdmVybGFwcyB0byB0aGUgdmlzdWFsKG9yIHZpc3VhbCBncm91cCkgcmVjdGFuZ2xlLCByZW5kZXIgaXRcbiAgICAgICAgLy90b2RvOiByZWZpbmUgdGhlIHNlYXJjaCBvcmRlci5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbnRlbnRJbmZvLnJlbmRlcmVkSXRlbXM7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgaSwgZ3JvdXBJbmZvLmRhdGEpO1xuICAgICAgICAgICAgdmFyIHJlY3QgPSBpdGVtLnJlY3Q7XG4gICAgICAgICAgICByZWxhdGl2ZVJlY3QgPSByZWN0LmNsb25lKCk7XG4gICAgICAgICAgICByZWxhdGl2ZVJlY3QudG9wICs9IHZlY3Rvclk7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5QmFzZSArIGk7XG4gICAgICAgICAgICBpZiAodmlzaWJsZVJlY3Qub3ZlcmxhcHMocmVsYXRpdmVSZWN0KSkge1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywga2V5LCBpLCByZWxhdGl2ZVJlY3QsIGdldFVwZGF0ZVJvdywgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWxhdGl2ZVJlY3QgPSBudWxsO1xuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXyhncm91cEluZm8sIGtleSwgaSwgcmVjdCwgZ2V0VXBkYXRlUm93LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICB2YXIgcGF0aCA9IGdyb3VwSW5mby5wYXRoO1xuICAgICAgICBpZiAoZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIGluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib3VuZHM6IHJlY3QuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBpbmRleDogaVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRHcm91cENvbnRlbnRSb3dfLmNhbGwodGhpcywga2V5LCBpLCByZWN0LCBncm91cEluZm8sIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyUm93XyhrZXksIGdyb3VwRWxlbWVudCwgZ3JvdXBJbmZvLCByZWN0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICBpc1Jvd1JvbGU6IGZhbHNlLFxuICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBIZWFkZXJSZW5kZXJJbmZvXy5jYWxsKHNlbGYsIGdyb3VwRWxlbWVudC5wYXRoLCBncm91cEluZm8sIHJlY3QpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBDb250ZW50Um93XyhrZXksIHJvd0luZGV4LCByZWN0LCBncm91cEluZm8sIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICBpc1Jvd1JvbGU6IHRydWUsXG4gICAgICAgICAgICByZW5kZXJJbmZvOiBnZXRHcm91cFJvd1JlbmRlckluZm9fLmNhbGwoc2VsZiwgcm93SW5kZXgsIGdyb3VwSW5mbywgcmVjdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSb3dfKGtleSwgY3VyckluZm8sIGdyb3VwSW5mbywgcmVjdCwgcmlnaHRUb0xlZnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICBpc1Jvd1JvbGU6IGZhbHNlLFxuICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBGb290ZXJSZW5kZXJJbmZvXy5jYWxsKHNlbGYsIGN1cnJJbmZvLnBhdGgsIGdyb3VwSW5mbywgcmVjdCwgcmlnaHRUb0xlZnQpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBIZWFkZXJSZW5kZXJJbmZvXyhncm91cFBhdGgsIGdyb3VwSW5mbywgcmVjdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cgZycgKyBncm91cFBhdGguam9pbignXycpLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICB0b3A6IHJlY3QudG9wLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiByZW5kZXJHcm91cEhlYWRlcl8uY2FsbCh0aGlzLCBncm91cEluZm8pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyR3JvdXBIZWFkZXJfKGdyb3VwSW5mbykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgbmFtZSA9IGdyb3VwLm5hbWU7XG5cbiAgICAgICAgLy9UT0RPOiB1c2UgZm9ybWF0dGVyP1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5hbWUpID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBsZXZlbDogZ3JvdXAubGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IGdyb3VwLmxldmVsICogR1JPVVBfSU5ERU5ULFxuICAgICAgICAgICAgZ3JvdXBTdGF0dXM6IGdyb3VwLmNvbGxhcHNlZCA/ICdjb2xsYXBzZWQnIDogJ2V4cGFuZCcsXG4gICAgICAgICAgICBjb25kaXRpb246IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5maWVsZCxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBjb3VudDogZ3JvdXAuaXRlbUNvdW50XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRvVC50ZW1wbGF0ZShnZXRHcm91cEhlYWRlclRlbXBsYXRlXy5jYWxsKHNlbGYsIGdyb3VwKSwgbnVsbCwgbnVsbCwgdHJ1ZSkoZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBIZWFkZXJUZW1wbGF0ZV8oZ3JvdXApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBzZWxmLm9wdGlvbnMucmlnaHRUb0xlZnQ7XG4gICAgICAgIHZhciBkZWZhdWx0VGVtcGxhdGU7XG4gICAgICAgIGlmIChyaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgZGVmYXVsdFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJnYy1ncm91cC1oZWFkZXIgZ2MtZ3JvdXAtaGVhZGVyLWNlbGxcIiBzdHlsZT1cImhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O2xpbmUtaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7XCI+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLXJpZ2h0Ont7PWl0Lm1hcmdpbn19cHg7XCI+PC9zcGFuPjxzcGFuIGxldmVsPVwie3s9aXQubGV2ZWx9fVwiPnt7PWl0LmNvbmRpdGlvbn19OiB7ez1pdC5uYW1lfX08c3Bhbj4gKHt7PWl0LmNvdW50fX0pPC9zcGFuPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci1jZWxsIFwiIHN0eWxlPVwiaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7bGluZS1oZWlnaHQ6JyArIGhlaWdodCArICdweDtcIj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJnYy1pY29uIGdjLWdyb3VwaW5nLXRvZ2dsZSB7ez1pdC5ncm91cFN0YXR1c319XCIgc3R5bGU9XCJtYXJnaW4tbGVmdDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj48c3BhbiBsZXZlbD1cInt7PWl0LmxldmVsfX1cIj57ez1pdC5jb25kaXRpb259fToge3s9aXQubmFtZX19PHNwYW4+ICh7ez1pdC5jb3VudH19KTwvc3Bhbj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwLmdyb3VwRGVzY3JpcHRvci5oZWFkZXIudGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwUm93UmVuZGVySW5mb18ocm93SW5kZXgsIGdyb3VwSW5mbywgcmVjdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc3R5bGUgPSByZWN0LmdldFN0eWxlKCk7XG4gICAgICAgIHN0eWxlID0gYWRkaXRpb25hbFN0eWxlID8gXy5hc3NpZ24oYWRkaXRpb25hbFN0eWxlLCBzdHlsZSkgOiBzdHlsZTtcbiAgICAgICAgdmFyIGl0ZW0gPSBnZXRJdGVtSW5mb0J5SW5kZXhfLmNhbGwoc2VsZiwgcm93SW5kZXgsIGdyb3VwSW5mby5kYXRhKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93JyArIChhZGRpdGlvbmFsQ1NTQ2xhc3MgPyAoJyAnICsgYWRkaXRpb25hbENTU0NsYXNzKSA6ICcnKSxcbiAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogaXRlbS5odG1sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSZW5kZXJJbmZvXyhncm91cFBhdGgsIGdyb3VwSW5mbywgcmVjdCwgcmlnaHRUb0xlZnQpIHtcbiAgICAgICAgdmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93IGcnICsgZ3JvdXBQYXRoLmpvaW4oJ18nKSxcbiAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogJzxkaXY+PC9kaXY+J1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkSXRlbXNJbmZvXyh2aXNpYmxlUmVjdCwgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIC8vIGZvciBlYWNoIGl0ZW1zIHdoaWNoIGhhdmUgaW5kZXggPCBsb2FkZWRJdGVtcywgY2hlY2sgdGhlIHBsYWNlZCBwcm9wZXJ0eVxuICAgICAgICAvLyBpZiBwbGFjZWQgYW5kIG92ZXJsYXBzIHRvIHRoZSB2aXN1YWwob3IgdmlzdWFsIGdyb3VwKSByZWN0YW5nbGUsIHJlbmRlciBpdFxuICAgICAgICAvL3RvZG86IHJlZmluZSB0aGUgc2VhcmNoIG9yZGVyLlxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5jb250ZW50SW5mb18ucmVuZGVyZWRJdGVtczsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGdldEl0ZW1JbmZvQnlJbmRleF8uY2FsbChzZWxmLCBpKTtcbiAgICAgICAgICAgIHZhciByZWN0ID0gaXRlbS5yZWN0O1xuICAgICAgICAgICAgdmFyIGtleSA9IGdyaWQudWlkICsgJy1yJyArIGk7XG4gICAgICAgICAgICBpZiAodmlzaWJsZVJlY3Qub3ZlcmxhcHMocmVjdCkpIHtcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93IHInICsgaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiByZWN0LmdldFN0eWxlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IGl0ZW0uaHRtbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyUm93SW5mb0ludGVybmFsKGtleSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXRlbSA9IHNlbGYuaXRlbXNfW2luZGV4XTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cgcicgKyBpbmRleCxcbiAgICAgICAgICAgICAgICBzdHlsZTogaXRlbS5yZWN0LmdldFN0eWxlKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiBpdGVtLmh0bWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2Z1bmN0aW9uIGhhbmRsZU1vdXNlQ2xpY2soc2VuZGVyLCBlKSB7XG4gICAgLy8gICAgdmFyIGxheW91dEVuZ2luZSA9IHNlbmRlci5sYXlvdXRFbmdpbmU7XG4gICAgLy8gICAgdmFyIGhpdFRlc3RJbmZvID0gbGF5b3V0RW5naW5lLmhpdFRlc3QoZSk7XG4gICAgLy8gICAgY29uc29sZS5sb2coaGl0VGVzdEluZm8uZ3JvdXBJbmZvLnJvdyk7XG4gICAgLy99XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZVdoZWVsKHNlbmRlciwgZSkge1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbmRlcjtcbiAgICAgICAgdmFyIGxheW91dEluZm87XG4gICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSBncmlkLmxheW91dEVuZ2luZTtcbiAgICAgICAgaWYgKCFsYXlvdXRFbmdpbmUub3B0aW9ucy5zaG93U2Nyb2xsQmFyIHx8ICFsYXlvdXRFbmdpbmUuaGFzU2Nyb2xsQmFyXykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9mZnNldERlbHRhID0gZS5kZWx0YVk7XG5cbiAgICAgICAgLy9zaW11bGF0ZSBzY3JvbGxcbiAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXRJbmZvID0gbGF5b3V0RW5naW5lLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICB2YXIgbWF4T2Zmc2V0VG9wID0gbWF0aE1heChsYXlvdXRJbmZvLmNvbnRlbnRIZWlnaHQgLSBsYXlvdXRJbmZvLmhlaWdodCwgMCk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gZ3JpZC5zY3JvbGxPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGlmIChvZmZzZXREZWx0YSA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0VG9wID49IG1heE9mZnNldFRvcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF0aE1pbihvZmZzZXRUb3AgKyBvZmZzZXREZWx0YSwgbWF4T2Zmc2V0VG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG1hdGhNYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsJykuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZURvd24oc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBncmlkID0gc2VuZGVyO1xuICAgICAgICB2YXIgc2VsZiA9IHNlbmRlci5sYXlvdXRFbmdpbmU7XG4gICAgICAgIHZhciBoaXRJbmZvO1xuICAgICAgICAvL2lmICghaGl0SW5mbykge1xuICAgICAgICBzZWxmLmhpdFRlc3RJbmZvXyA9IHNlbGYuaGl0VGVzdChlKTtcbiAgICAgICAgaGl0SW5mbyA9IHNlbGYuaGl0VGVzdEluZm9fO1xuICAgICAgICAvLyB9XG4gICAgICAgIGlmICghaGl0SW5mbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5tb3VzZURvd25Qb2ludF8gPSB7XG4gICAgICAgICAgICBsZWZ0OiBlLnBhZ2VYLFxuICAgICAgICAgICAgdG9wOiBlLnBhZ2VZXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgIHZhciBncm91cDtcbiAgICAgICAgaWYgKGdyb3VwSW5mbykge1xuICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9DT05URU5UICYmIGdyb3VwSW5mby5yb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gc2VsZi5ncmlkLnVpZCArICctZ3InICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpICsgJy1yJyArIGdyb3VwSW5mby5yb3c7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9GT09URVIpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGYuZ3JpZC51aWQgKyAnLWdmJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBJbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgIGlmIChncm91cEluZm8ub25FeHBhbmRUb2dnbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEluZm8ucGF0aCkuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY29sbGFwc2VkID0gIWdyb3VwLmNvbGxhcHNlZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc3RhdHVzXyA9PT0gU1RBVFVTX0lETEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpc2libGVSZWN0ID0gbmV3IE1hc29ucnlSZWN0KDAsIGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcCwgbGF5b3V0SW5mby5jb250ZW50V2lkdGgsIGxheW91dEluZm8uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWZyZXNoSGVpZ2h0ID0gbW9kZVRvSGVpZ2h0Xy5jYWxsKHNlbGYsIFFVQVJURVJfQ09OVEFJTkVSX0hFSUdIVCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsUmVuZGVyZWQgPSBfLmV2ZXJ5KHNlbGYuZ3JvdXBDb250ZW50SW5mb18sIGZ1bmN0aW9uKGNvbnRlbnRJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRJbmZvLnJlbmRlcmVkSXRlbXMgPT09IGNvbnRlbnRJbmZvLml0ZW1Db3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbGxSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19MT0FESU5HO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGVSZWN0LmhlaWdodCArPSByZWZyZXNoSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRHcm91cHNfLmNhbGwoc2VsZiwgZ3JpZC5ncm91cEluZm9zXywgdmlzaWJsZVJlY3QsIGZhbHNlLCBmdW5jdGlvbihjb250ZW50U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRlbnRTaXplXyA9IGNvbnRlbnRTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zdGF0dXNfID0gU1RBVFVTX0lETEU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19MT0FESU5HO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3RhdHVzXyA9IFNUQVRVU19JRExFO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBNYXNvbnJ5TGF5b3V0RW5naW5lO1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2xheW91dEVuZ2luZXMvTWFzb25yeUxheW91dEVuZ2luZS5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIFVOREVGSU5FRCA9ICd1bmRlZmluZWQnO1xuICAgIHZhciBnY1V0aWxzID0ge307XG5cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUodmFsLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YodmFsKSA9PT0gdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXN0cyBhIHZhbHVlIHRvIGEgdHlwZSBpZiBwb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjYXN0LlxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb3IgaW50ZXJmYWNlIG5hbWUgdG8gY2FzdCB0by5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4gaWYgdGhlIGNhc3Qgd2FzIHN1Y2Nlc3NmdWwsIG51bGwgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyeUNhc3QodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgLy8gbnVsbCBkb2Vzbid0IGltcGxlbWVudCBhbnl0aGluZ1xuICAgICAgICBpZiAoaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRlc3QgZm9yIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvbiAoSVF1ZXJ5SW50ZXJmYWNlKVxuICAgICAgICBpZiAoaXNTdHJpbmcodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlLmltcGxlbWVudHNJbnRlcmZhY2UpICYmIHZhbHVlLmltcGxlbWVudHNJbnRlcmZhY2UodHlwZSkgPyB2YWx1ZSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIHR5cGUgdGVzdFxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiB0eXBlID8gdmFsdWUgOiBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMudHJ5Q2FzdCA9IHRyeUNhc3Q7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgcHJpbWl0aXZlIHR5cGUgKHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBvciBkYXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgfHwgaXNOdW1iZXIodmFsdWUpIHx8IGlzQm9vbGVhbih2YWx1ZSkgfHwgaXNEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ3N0cmluZycpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBpcyBudWxsLCBlbXB0eSwgb3Igd2hpdGVzcGFjZSBvbmx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2UodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSA/IHRydWUgOiB2YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpLmxlbmd0aCA8IDE7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZSA9IGlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdudW1iZXInKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIGludGVnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0ludCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlID09PSBNYXRoLnJvdW5kKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzSW50ID0gaXNJbnQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgQm9vbGVhbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnYm9vbGVhbicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCBVTkRFRklORUQpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBEYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0RhdGUgPSBpc0RhdGU7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBvYmplY3QgKGFzIG9wcG9zZWQgdG8gYSB2YWx1ZSB0eXBlIG9yIGEgZGF0ZSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFpc0RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgYSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqIEByZXR1cm4gQSBAc2VlOkRhdGFUeXBlIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFR5cGUodmFsdWUpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYm9vbGVhbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBnY1V0aWxzLmdldFR5cGUgPSBnZXRUeXBlO1xuXG4gICAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNVbmRlZmluZWQodmFsdWUpIHx8IGlzTnVsbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc051bGwgPSBpc051bGw7XG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbCA9IGlzVW5kZWZpbmVkT3JOdWxsO1xuXG4gICAgLy9UT0RPOiByZXZpZXcgdGhpcyBtZXRob2QgYWZ0ZXIgZm9ybW10dGVyIGltcGxlbWVudGF0aW9uIGRvbmUuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB0aGUgdHlwZSBvZiBhIHZhbHVlLlxuICAgICAqXG4gICAgICogSWYgdGhlIGNvbnZlcnNpb24gZmFpbHMsIHRoZSBvcmlnaW5hbCB2YWx1ZSBpcyByZXR1cm5lZC4gVG8gY2hlY2sgaWYgYVxuICAgICAqIGNvbnZlcnNpb24gc3VjY2VlZGVkLCB5b3Ugc2hvdWxkIGNoZWNrIHRoZSB0eXBlIG9mIHRoZSByZXR1cm5lZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjb252ZXJ0LlxuICAgICAqIEBwYXJhbSB0eXBlIEBzZWU6RGF0YVR5cGUgdG8gY29udmVydCB0aGUgdmFsdWUgdG8uXG4gICAgICogQHJldHVybiBUaGUgY29udmVydGVkIHZhbHVlLCBvciB0aGUgb3JpZ2luYWwgdmFsdWUgaWYgYSBjb252ZXJzaW9uIHdhcyBub3QgcG9zc2libGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hhbmdlVHlwZSh2YWx1ZSwgdHlwZSkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgc3RyaW5ncyB0byBudW1iZXJzLCBkYXRlcywgb3IgYm9vbGVhbnNcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTihudW0pID8gdmFsdWUgOiBudW07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29udmVydCBhbnl0aGluZyB0byBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2hhbmdlVHlwZSA9IGNoYW5nZVR5cGU7XG4gICAgLy9cbiAgICAvLy8qKlxuICAgIC8vICogUmVwbGFjZXMgZWFjaCBmb3JtYXQgaXRlbSBpbiBhIHNwZWNpZmllZCBzdHJpbmcgd2l0aCB0aGUgdGV4dCBlcXVpdmFsZW50IG9mIGFuXG4gICAgLy8gKiBvYmplY3QncyB2YWx1ZS5cbiAgICAvLyAqXG4gICAgLy8gKiBUaGUgZnVuY3Rpb24gd29ya3MgYnkgcmVwbGFjaW5nIHBhcnRzIG9mIHRoZSA8Yj5mb3JtYXRTdHJpbmc8L2I+IHdpdGggdGhlIHBhdHRlcm5cbiAgICAvLyAqICd7bmFtZTpmb3JtYXR9JyB3aXRoIHByb3BlcnRpZXMgb2YgdGhlIDxiPmRhdGE8L2I+IHBhcmFtZXRlci4gRm9yIGV4YW1wbGU6XG4gICAgLy8gKlxuICAgIC8vICogPHByZT5cbiAgICAvLyAqIHZhciBkYXRhID0geyBuYW1lOiAnSm9lJywgYW1vdW50OiAxMjM0NTYgfTtcbiAgICAvLyAqIHZhciBtc2cgPSB3aWptby5mb3JtYXQoJ0hlbGxvIHtuYW1lfSwgeW91IHdvbiB7YW1vdW50Om4yfSEnLCBkYXRhKTtcbiAgICAvLyAqIDwvcHJlPlxuICAgIC8vICpcbiAgICAvLyAqIFRoZSBvcHRpb25hbCA8Yj5mb3JtYXRGdW5jdGlvbjwvYj4gYWxsb3dzIHlvdSB0byBjdXN0b21pemUgdGhlIGNvbnRlbnQgYnkgcHJvdmlkaW5nXG4gICAgLy8gKiBjb250ZXh0LXNlbnNpdGl2ZSBmb3JtYXR0aW5nLiBJZiBwcm92aWRlZCwgdGhlIGZvcm1hdCBmdW5jdGlvbiBnZXRzIGNhbGxlZCBmb3IgZWFjaFxuICAgIC8vICogZm9ybWF0IGVsZW1lbnQgYW5kIGdldHMgcGFzc2VkIHRoZSBkYXRhIG9iamVjdCwgdGhlIHBhcmFtZXRlciBuYW1lLCB0aGUgZm9ybWF0LFxuICAgIC8vICogYW5kIHRoZSB2YWx1ZTsgaXQgc2hvdWxkIHJldHVybiBhbiBvdXRwdXQgc3RyaW5nLiBGb3IgZXhhbXBsZTpcbiAgICAvLyAqXG4gICAgLy8gKiA8cHJlPlxuICAgIC8vICogdmFyIGRhdGEgPSB7IG5hbWU6ICdKb2UnLCBhbW91bnQ6IDEyMzQ1NiB9O1xuICAgIC8vICogdmFyIG1zZyA9IHdpam1vLmZvcm1hdCgnSGVsbG8ge25hbWV9LCB5b3Ugd29uIHthbW91bnQ6bjJ9IScsIGRhdGEsXG4gICAgLy8gKiAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSwgbmFtZSwgZm10LCB2YWwpIHtcbiAgICAvLyogICAgICAgICAgICAgICBpZiAod2lqbW8uaXNTdHJpbmcoZGF0YVtuYW1lXSkpIHtcbiAgICAvLyogICAgICAgICAgICAgICAgICAgdmFsID0gd2lqbW8uZXNjYXBlSHRtbChkYXRhW25hbWVdKTtcbiAgICAvLyogICAgICAgICAgICAgICB9XG4gICAgLy8qICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAvLyogICAgICAgICAgICAgfSk7XG4gICAgLy8gKiA8L3ByZT5cbiAgICAvLyAqXG4gICAgLy8gKiBAcGFyYW0gZm9ybWF0IEEgY29tcG9zaXRlIGZvcm1hdCBzdHJpbmcuXG4gICAgLy8gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBvYmplY3QgdXNlZCB0byBidWlsZCB0aGUgc3RyaW5nLlxuICAgIC8vICogQHBhcmFtIGZvcm1hdEZ1bmN0aW9uIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG8gZm9ybWF0IGl0ZW1zIGluIGNvbnRleHQuXG4gICAgLy8gKiBAcmV0dXJuIFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgIC8vICovXG4gICAgLy9mdW5jdGlvbiBmb3JtYXQoZm9ybWF0LCBkYXRhLCBmb3JtYXRGdW5jdGlvbikge1xuICAgIC8vICAgIGZvcm1hdCA9IGFzU3RyaW5nKGZvcm1hdCk7XG4gICAgLy8gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKC9cXHsoLio/KSg6KC4qPykpP1xcfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG5hbWUsIHgsIGZtdCkge1xuICAgIC8vICAgICAgICB2YXIgdmFsID0gbWF0Y2g7XG4gICAgLy8gICAgICAgIGlmIChuYW1lICYmIG5hbWVbMF0gIT0gJ3snICYmIGRhdGEpIHtcbiAgICAvLyAgICAgICAgICAgIC8vIGdldCB0aGUgdmFsdWVcbiAgICAvLyAgICAgICAgICAgIHZhbCA9IGRhdGFbbmFtZV07XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIC8vIGFwcGx5IHN0YXRpYyBmb3JtYXRcbiAgICAvLyAgICAgICAgICAgIGlmIChmbXQpIHtcbiAgICAvLyAgICAgICAgICAgICAgICB2YWwgPSB3aWptby5HbG9iYWxpemUuZm9ybWF0KHZhbCwgZm10KTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgLy8gYXBwbHkgZm9ybWF0IGZ1bmN0aW9uXG4gICAgLy8gICAgICAgICAgICBpZiAoZm9ybWF0RnVuY3Rpb24pIHtcbiAgICAvLyAgICAgICAgICAgICAgICB2YWwgPSBmb3JtYXRGdW5jdGlvbihkYXRhLCBuYW1lLCBmbXQsIHZhbCk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICAgICAgcmV0dXJuIHZhbCA9PSBudWxsID8gJycgOiB2YWw7XG4gICAgLy8gICAgfSk7XG4gICAgLy99XG4gICAgLy9nY1V0aWxzLmZvcm1hdCA9IGZvcm1hdDtcblxuICAgIC8qKlxuICAgICAqIENsYW1wcyBhIHZhbHVlIGJldHdlZW4gYSBtaW5pbXVtIGFuZCBhIG1heGltdW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgT3JpZ2luYWwgdmFsdWUuXG4gICAgICogQHBhcmFtIG1pbiBNaW5pbXVtIGFsbG93ZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIG1heCBNYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKG1heCkgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1heDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwobWluKSAmJiB2YWx1ZSA8IG1pbikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWluO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNsYW1wID0gY2xhbXA7XG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgdGhlIHByb3BlcnRpZXMgZnJvbSBhbiBvYmplY3QgdG8gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgbXVzdCBkZWZpbmUgYWxsIHRoZSBwcm9wZXJ0aWVzIGRlZmluZWQgaW4gdGhlIHNvdXJjZSxcbiAgICAgKiBvciBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkc3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gc3JjIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkoZHN0LCBzcmMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSBpbiBkc3QsICdVbmtub3duIGtleSBcIicgKyBrZXkgKyAnXCIuJyk7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzcmNba2V5XTtcbiAgICAgICAgICAgIGlmICghZHN0Ll9jb3B5IHx8ICFkc3QuX2NvcHkoa2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmIGRzdFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvcHkoZHN0W2tleV0sIHZhbHVlKTsgLy8gY29weSBzdWItb2JqZWN0c1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdmFsdWU7IC8vIGFzc2lnbiB2YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnY1V0aWxzLmNvcHkgPSBjb3B5O1xuXG4gICAgLyoqXG4gICAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhIGNvbmRpdGlvbiBpcyBmYWxzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb25kaXRpb24gQ29uZGl0aW9uIGV4cGVjdGVkIHRvIGJlIHRydWUuXG4gICAgICogQHBhcmFtIG1zZyBNZXNzYWdlIG9mIHRoZSBleGNlcHRpb24gaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgdHJ1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cpIHtcbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHRocm93ICcqKiBBc3NlcnRpb24gZmFpbGVkIGluIFdpam1vOiAnICsgbXNnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc3NlcnQgPSBhc3NlcnQ7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgc3RyaW5nIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1N0cmluZyh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNTdHJpbmcodmFsdWUpLCAnU3RyaW5nIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc1N0cmluZyA9IGFzU3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgbnVtZXJpYy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHBhcmFtIHBvc2l0aXZlIFdoZXRoZXIgdG8gYWNjZXB0IG9ubHkgcG9zaXRpdmUgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICogQHJldHVybiBUaGUgbnVtYmVyIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc051bWJlcih2YWx1ZSwgbnVsbE9LLCBwb3NpdGl2ZSkge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoZWNrVHlwZShwb3NpdGl2ZSwgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgcG9zaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzTnVtYmVyKHZhbHVlKSwgJ051bWJlciBleHBlY3RlZC4nKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIHZhbHVlICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Bvc2l0aXZlIG51bWJlciBleHBlY3RlZC4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzTnVtYmVyID0gYXNOdW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGFuIGludGVnZXIuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEBwYXJhbSBwb3NpdGl2ZSBXaGV0aGVyIHRvIGFjY2VwdCBvbmx5IHBvc2l0aXZlIGludGVnZXJzLlxuICAgICAqIEByZXR1cm4gVGhlIG51bWJlciBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNJbnQodmFsdWUsIG51bGxPSywgcG9zaXRpdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja1R5cGUocG9zaXRpdmUsIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0ludCh2YWx1ZSksICdJbnRlZ2VyIGV4cGVjdGVkLicpO1xuICAgICAgICBpZiAocG9zaXRpdmUgJiYgdmFsdWUgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnUG9zaXRpdmUgaW50ZWdlciBleHBlY3RlZC4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzSW50ID0gYXNJbnQ7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIEJvb2xlYW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgQm9vbGVhbi5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgQm9vbGVhbiBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNCb29sZWFuKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNCb29sZWFuKHZhbHVlKSwgJ0Jvb2xlYW4gZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzQm9vbGVhbiA9IGFzQm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgRGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIERhdGUuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIERhdGUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRGF0ZSh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzRGF0ZSh2YWx1ZSksICdEYXRlIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0RhdGUgPSBhc0RhdGU7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIGZ1bmN0aW9uIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0Z1bmN0aW9uKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNGdW5jdGlvbih2YWx1ZSksICdGdW5jdGlvbiBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNGdW5jdGlvbiA9IGFzRnVuY3Rpb247XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhbiBhcnJheS5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgYXJyYXkgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzQXJyYXkodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0FycmF5KHZhbHVlKSwgJ0FycmF5IGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0FycmF5ID0gYXNBcnJheTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgZ2l2ZW4gdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBiZSBjaGVja2VkLlxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdmFsdWUgZXhwZWN0ZWQuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1R5cGUodmFsdWUsIHR5cGUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUsIHR5cGUgKyAnIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc1R5cGUgPSBhc1R5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIHZhbGlkIHNldHRpbmcgZm9yIGFuIGVudW1lcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgbWVtYmVyIG9mIHRoZSBlbnVtZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gZW51bVR5cGUgRW51bWVyYXRpb24gdG8gdGVzdCBmb3IuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0VudW0odmFsdWUsIGVudW1UeXBlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgJiYgbnVsbE9LKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZSA9IGVudW1UeXBlW3ZhbHVlXTtcbiAgICAgICAgYXNzZXJ0KCFpc1VuZGVmaW5lZE9yTnVsbChlKSwgJ0ludmFsaWQgZW51bSB2YWx1ZS4nKTtcbiAgICAgICAgcmV0dXJuIGlzTnVtYmVyKGUpID8gZSA6IHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNFbnVtID0gYXNFbnVtO1xuXG4gICAgLyoqXG4gICAgICogRW51bWVyYXRpb24gd2l0aCBrZXkgdmFsdWVzLlxuICAgICAqXG4gICAgICogVGhpcyBlbnVtZXJhdGlvbiBpcyB1c2VmdWwgd2hlbiBoYW5kbGluZyA8Yj5rZXlEb3duPC9iPiBldmVudHMuXG4gICAgICovXG4gICAgdmFyIEtleSA9IHtcbiAgICAgICAgLyoqIFRoZSBiYWNrc3BhY2Uga2V5LiAqL1xuICAgICAgICBCYWNrOiA4LFxuICAgICAgICAvKiogVGhlIHRhYiBrZXkuICovXG4gICAgICAgIFRhYjogOSxcbiAgICAgICAgLyoqIFRoZSBlbnRlciBrZXkuICovXG4gICAgICAgIEVudGVyOiAxMyxcbiAgICAgICAgLyoqIFRoZSBlc2NhcGUga2V5LiAqL1xuICAgICAgICBFc2NhcGU6IDI3LFxuICAgICAgICAvKiogVGhlIHNwYWNlIGtleS4gKi9cbiAgICAgICAgU3BhY2U6IDMyLFxuICAgICAgICAvKiogVGhlIHBhZ2UgdXAga2V5LiAqL1xuICAgICAgICBQYWdlVXA6IDMzLFxuICAgICAgICAvKiogVGhlIHBhZ2UgZG93biBrZXkuICovXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcbiAgICAgICAgLyoqIFRoZSBlbmQga2V5LiAqL1xuICAgICAgICBFbmQ6IDM1LFxuICAgICAgICAvKiogVGhlIGhvbWUga2V5LiAqL1xuICAgICAgICBIb21lOiAzNixcbiAgICAgICAgLyoqIFRoZSBsZWZ0IGFycm93IGtleS4gKi9cbiAgICAgICAgTGVmdDogMzcsXG4gICAgICAgIC8qKiBUaGUgdXAgYXJyb3cga2V5LiAqL1xuICAgICAgICBVcDogMzgsXG4gICAgICAgIC8qKiBUaGUgcmlnaHQgYXJyb3cga2V5LiAqL1xuICAgICAgICBSaWdodDogMzksXG4gICAgICAgIC8qKiBUaGUgZG93biBhcnJvdyBrZXkuICovXG4gICAgICAgIERvd246IDQwLFxuICAgICAgICAvKiogVGhlIGRlbGV0ZSBrZXkuICovXG4gICAgICAgIERlbGV0ZTogNDYsXG4gICAgICAgIC8qKiBUaGUgRjEga2V5LiAqL1xuICAgICAgICBGMTogMTEyLFxuICAgICAgICAvKiogVGhlIEYyIGtleS4gKi9cbiAgICAgICAgRjI6IDExMyxcbiAgICAgICAgLyoqIFRoZSBGMyBrZXkuICovXG4gICAgICAgIEYzOiAxMTQsXG4gICAgICAgIC8qKiBUaGUgRjQga2V5LiAqL1xuICAgICAgICBGNDogMTE1LFxuICAgICAgICAvKiogVGhlIEY1IGtleS4gKi9cbiAgICAgICAgRjU6IDExNixcbiAgICAgICAgLyoqIFRoZSBGNiBrZXkuICovXG4gICAgICAgIEY2OiAxMTcsXG4gICAgICAgIC8qKiBUaGUgRjcga2V5LiAqL1xuICAgICAgICBGNzogMTE4LFxuICAgICAgICAvKiogVGhlIEY4IGtleS4gKi9cbiAgICAgICAgRjg6IDExOSxcbiAgICAgICAgLyoqIFRoZSBGOSBrZXkuICovXG4gICAgICAgIEY5OiAxMjAsXG4gICAgICAgIC8qKiBUaGUgRjEwIGtleS4gKi9cbiAgICAgICAgRjEwOiAxMjEsXG4gICAgICAgIC8qKiBUaGUgRjExIGtleS4gKi9cbiAgICAgICAgRjExOiAxMjIsXG4gICAgICAgIC8qKiBUaGUgRjEyIGtleS4gKi9cbiAgICAgICAgRjEyOiAxMjNcbiAgICB9O1xuICAgIGdjVXRpbHMuS2V5ID0gS2V5O1xuXG4gICAgdmFyIEVkaXRvclR5cGUgPSB7XG4gICAgICAgICdUZXh0JzogJ3RleHQnLFxuICAgICAgICAnQ2hlY2tCb3gnOiAnY2hlY2tib3gnLFxuICAgICAgICAnRGF0ZSc6ICdkYXRlJyxcbiAgICAgICAgJ0NvbG9yJzogJ2NvbG9yJyxcbiAgICAgICAgJ051bWJlcic6ICdudW1iZXInXG4gICAgfTtcbiAgICBnY1V0aWxzLkVkaXRvclR5cGUgPSBFZGl0b3JUeXBlO1xuXG4gICAgdmFyIERhdGFUeXBlID0ge1xuICAgICAgICAnT2JqZWN0JzogJ09iamVjdCcsXG4gICAgICAgICdTdHJpbmcnOiAnU3RyaW5nJyxcbiAgICAgICAgJ051bWJlcic6ICdOdW1iZXInLFxuICAgICAgICAnQm9vbGVhbic6ICdCb29sZWFuJyxcbiAgICAgICAgJ0RhdGUnOiAnRGF0ZScsXG4gICAgICAgICdBcnJheSc6ICdBcnJheSdcbiAgICB9O1xuICAgIGdjVXRpbHMuRGF0YVR5cGUgPSBEYXRhVHlwZTtcblxuICAgIHZhciBpc1VuaXRsZXNzTnVtYmVyID0ge1xuICAgICAgICBjb2x1bW5Db3VudDogdHJ1ZSxcbiAgICAgICAgZmxleDogdHJ1ZSxcbiAgICAgICAgZmxleEdyb3c6IHRydWUsXG4gICAgICAgIGZsZXhTaHJpbms6IHRydWUsXG4gICAgICAgIGZvbnRXZWlnaHQ6IHRydWUsXG4gICAgICAgIGxpbmVDbGFtcDogdHJ1ZSxcbiAgICAgICAgbGluZUhlaWdodDogdHJ1ZSxcbiAgICAgICAgb3BhY2l0eTogdHJ1ZSxcbiAgICAgICAgb3JkZXI6IHRydWUsXG4gICAgICAgIG9ycGhhbnM6IHRydWUsXG4gICAgICAgIHdpZG93czogdHJ1ZSxcbiAgICAgICAgekluZGV4OiB0cnVlLFxuICAgICAgICB6b29tOiB0cnVlLFxuXG4gICAgICAgIC8vIFNWRy1yZWxhdGVkIHByb3BlcnRpZXNcbiAgICAgICAgZmlsbE9wYWNpdHk6IHRydWUsXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHRydWVcbiAgICB9O1xuICAgIHZhciBfdXBwZXJjYXNlUGF0dGVybiA9IC8oW0EtWl0pL2c7XG4gICAgdmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbiAgICBmdW5jdGlvbiBkYW5nZXJvdXNTdHlsZVZhbHVlKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBpc0VtcHR5ID0gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAnJztcbiAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpc05vbk51bWVyaWMgPSBpc05hTih2YWx1ZSk7XG4gICAgICAgIGlmIChpc05vbk51bWVyaWMgfHwgdmFsdWUgPT09IDAgfHxcbiAgICAgICAgICAgIGlzVW5pdGxlc3NOdW1iZXIuaGFzT3duUHJvcGVydHkobmFtZSkgJiYgaXNVbml0bGVzc051bWJlcltuYW1lXSkge1xuICAgICAgICAgICAgcmV0dXJuICcnICsgdmFsdWU7IC8vIGNhc3QgdG8gc3RyaW5nXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlICsgJ3B4JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZW1vaXplU3RyaW5nT25seShjYWxsYmFjaykge1xuICAgICAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICAgICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbc3RyaW5nXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FjaGVbc3RyaW5nXSA9IGNhbGxiYWNrLmNhbGwodGhpcywgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbc3RyaW5nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgcHJvY2Vzc1N0eWxlTmFtZSA9IG1lbW9pemVTdHJpbmdPbmx5KGZ1bmN0aW9uKHN0eWxlTmFtZSkge1xuICAgICAgICByZXR1cm4gaHlwaGVuYXRlU3R5bGVOYW1lKHN0eWxlTmFtZSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBoeXBoZW5hdGUoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShfdXBwZXJjYXNlUGF0dGVybiwgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICAgICAgICByZXR1cm4gaHlwaGVuYXRlKHN0cmluZykucmVwbGFjZShtc1BhdHRlcm4sICctbXMtJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTWFya3VwRm9yU3R5bGVzKHN0eWxlcykge1xuICAgICAgICB2YXIgc2VyaWFsaXplZCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBzdHlsZU5hbWUgaW4gc3R5bGVzKSB7XG4gICAgICAgICAgICBpZiAoIXN0eWxlcy5oYXNPd25Qcm9wZXJ0eShzdHlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHN0eWxlc1tzdHlsZU5hbWVdO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChzdHlsZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQgKz0gcHJvY2Vzc1N0eWxlTmFtZShzdHlsZU5hbWUpICsgJzonO1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQgKz0gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShzdHlsZU5hbWUsIHN0eWxlVmFsdWUpICsgJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jcmVhdGVNYXJrdXBGb3JTdHlsZXMgPSBjcmVhdGVNYXJrdXBGb3JTdHlsZXM7XG5cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIHRoZSByb3V0ZSBmb3IgRE9NIGV2ZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbmNlbERlZmF1bHQoZSkge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSUUgOFxuICAgICAgICAgICAgZS5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jYW5jZWxEZWZhdWx0ID0gY2FuY2VsRGVmYXVsdDtcblxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChvYmopIHtcbiAgICAgICAgdmFyIGNsb25lT2JqID0gXy5jbG9uZShvYmopO1xuICAgICAgICB2YXIgY2FjaGVfID0gW107XG4gICAgICAgIGlmIChjbG9uZU9iaikge1xuICAgICAgICAgICAgY2FjaGVfLnB1c2goY2xvbmVPYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0O1xuICAgICAgICB3aGlsZSAoY2FjaGVfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlc3QgPSBjYWNoZV8ucG9wKCk7XG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0KGRlc3QpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluIGRlc3QpIHtcbiAgICAgICAgICAgICAgICBjYWNoZV8ucHVzaChkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihkZXN0W2l0ZW1dKSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0W2l0ZW1dID0gc2VyaWFsaXplRnVuY3Rpb24oZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZU9iajtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZU9iamVjdDtcblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplT2JqZWN0KG9iaikge1xuICAgICAgICB2YXIgY2xvbmVPYmogPSBfLmNsb25lKG9iaik7XG4gICAgICAgIHZhciBjYWNoZV8gPSBbXTtcbiAgICAgICAgaWYgKGNsb25lT2JqKSB7XG4gICAgICAgICAgICBjYWNoZV8ucHVzaChjbG9uZU9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3Q7XG4gICAgICAgIHZhciBmdW5jO1xuICAgICAgICB3aGlsZSAoY2FjaGVfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlc3QgPSBjYWNoZV8ucG9wKCk7XG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0KGRlc3QpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluIGRlc3QpIHtcbiAgICAgICAgICAgICAgICBjYWNoZV8ucHVzaChkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdHJpbmcoZGVzdFtpdGVtXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IGRlc2VyaWFsaXplRnVuY3Rpb24oZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0W2l0ZW1dID0gZnVuYztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmVPYmo7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5kZXNlcmlhbGl6ZU9iamVjdCA9IGRlc2VyaWFsaXplT2JqZWN0O1xuXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5zZXJpYWxpemVGdW5jdGlvbiA9IHNlcmlhbGl6ZUZ1bmN0aW9uO1xuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgdGVtcFN0ciA9IHZhbHVlLnN1YnN0cig4LCB2YWx1ZS5pbmRleE9mKCcoJykgLSA4KTsgLy84IGlzICdmdW5jdGlvbicgbGVuZ3RoXG4gICAgICAgICAgICBpZiAodmFsdWUuc3Vic3RyKDAsIDgpID09PSAnZnVuY3Rpb24nICYmIHRlbXBTdHIucmVwbGFjZSgvXFxzKy8sICcnKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJnU3RhcnQgPSB2YWx1ZS5pbmRleE9mKCcoJykgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBhcmdFbmQgPSB2YWx1ZS5pbmRleE9mKCcpJyk7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB2YWx1ZS5zdWJzdHIoYXJnU3RhcnQsIGFyZ0VuZCAtIGFyZ1N0YXJ0KS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5yZXBsYWNlKC9cXHMrLywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBib2R5U3RhcnQgPSB2YWx1ZS5pbmRleE9mKCd7JykgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBib2R5RW5kID0gdmFsdWUubGFzdEluZGV4T2YoJ30nKTtcbiAgICAgICAgICAgICAgICAvKmpzbGludCBldmlsOiB0cnVlICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLCB2YWx1ZS5zdWJzdHIoYm9keVN0YXJ0LCBib2R5RW5kIC0gYm9keVN0YXJ0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5kZXNlcmlhbGl6ZUZ1bmN0aW9uID0gZGVzZXJpYWxpemVGdW5jdGlvbjtcbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBAc2VlOklDb2xsZWN0aW9uVmlldyBvciBhbiBBcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvciBAc2VlOklDb2xsZWN0aW9uVmlldy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgQHNlZTpJQ29sbGVjdGlvblZpZXcgdGhhdCB3YXMgcGFzc2VkIGluIG9yIGEgQHNlZTpDb2xsZWN0aW9uVmlld1xuICAgICAqIGNyZWF0ZWQgZnJvbSB0aGUgYXJyYXkgdGhhdCB3YXMgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIC8qXG4gICAgIGZ1bmN0aW9uIGFzQ29sbGVjdGlvblZpZXcodmFsdWUsIG51bGxPSykge1xuICAgICBpZiAodHlwZW9mIG51bGxPSyA9PT0gXCJ1bmRlZmluZWRcIikgeyBudWxsT0sgPSB0cnVlOyB9XG4gICAgIGlmICh2YWx1ZSA9PSBudWxsICYmIG51bGxPSykge1xuICAgICByZXR1cm4gbnVsbDtcbiAgICAgfVxuICAgICB2YXIgY3YgPSB0cnlDYXN0KHZhbHVlLCAnSUNvbGxlY3Rpb25WaWV3Jyk7XG4gICAgIGlmIChjdiAhPSBudWxsKSB7XG4gICAgIHJldHVybiBjdjtcbiAgICAgfVxuICAgICBpZiAoIWlzQXJyYXkodmFsdWUpKSB7XG4gICAgIGFzc2VydChmYWxzZSwgJ0FycmF5IG9yIElDb2xsZWN0aW9uVmlldyBleHBlY3RlZC4nKTtcbiAgICAgfVxuICAgICByZXR1cm4gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHZhbHVlKTtcbiAgICAgfVxuICAgICBnY1V0aWxzLmFzQ29sbGVjdGlvblZpZXcgPSBhc0NvbGxlY3Rpb25WaWV3OyovXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBwbHVnaW4gbW9kdWxlLlxuICAgICAqIEBwYXJhbSBuYW1lIG9mIG1vZHVsZVxuICAgICAqIEByZXR1cm5zIHBsdWdpbiBtb2R1bGUgb2JqZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZFBsdWdpbihuYW1lKSB7XG4gICAgICAgIHZhciBwbHVnaW47XG4gICAgICAgIC8vIGZpbmQgZnJvbSBnbG9iYWxcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBsdWdpbiA9IEdjU3ByZWFkLlZpZXdzLkdjR3JpZC5QbHVnaW5zW25hbWVdOy8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmICghcGx1Z2luICYmIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgey8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvLyAgICBwbHVnaW4gPSByZXF1aXJlanMgJiYgcmVxdWlyZWpzKG5hbWUpIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy8vLyBjb21tb25qcyBub3Qgc3VwcG9ydGVkIG5vd1xuICAgICAgICAvL2lmICghcGx1Z2luICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykgey8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvL31cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmZpbmRQbHVnaW4gPSBmaW5kUGx1Z2luO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnY1V0aWxzO1xufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIiwiLy8gZG9ULmpzXG4vLyAyMDExLTIwMTQsIExhdXJhIERva3Rvcm92YSwgaHR0cHM6Ly9naXRodWIuY29tL29sYWRvL2RvVFxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBkb1QgPSB7XG4gICAgICAgIHZlcnNpb246IFwiMS4wLjNcIixcbiAgICAgICAgdGVtcGxhdGVTZXR0aW5nczoge1xuICAgICAgICAgICAgZXZhbHVhdGU6IC9cXHtcXHsoW1xcc1xcU10rPyhcXH0/KSspXFx9XFx9L2csXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZTogL1xce1xcez0oW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIGVuY29kZTogL1xce1xceyEoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIHVzZTogL1xce1xceyMoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIHVzZVBhcmFtczogLyhefFteXFx3JF0pZGVmKD86XFwufFxcW1tcXCdcXFwiXSkoW1xcdyRcXC5dKykoPzpbXFwnXFxcIl1cXF0pP1xccypcXDpcXHMqKFtcXHckXFwuXSt8XFxcIlteXFxcIl0rXFxcInxcXCdbXlxcJ10rXFwnfFxce1teXFx9XStcXH0pL2csXG4gICAgICAgICAgICBkZWZpbmU6IC9cXHtcXHsjI1xccyooW1xcd1xcLiRdKylcXHMqKFxcOnw9KShbXFxzXFxTXSs/KSNcXH1cXH0vZyxcbiAgICAgICAgICAgIGRlZmluZVBhcmFtczogL15cXHMqKFtcXHckXSspOihbXFxzXFxTXSspLyxcbiAgICAgICAgICAgIGNvbmRpdGlvbmFsOiAvXFx7XFx7XFw/KFxcPyk/XFxzKihbXFxzXFxTXSo/KVxccypcXH1cXH0vZyxcbiAgICAgICAgICAgIGl0ZXJhdGU6IC9cXHtcXHt+XFxzKig/OlxcfVxcfXwoW1xcc1xcU10rPylcXHMqXFw6XFxzKihbXFx3JF0rKVxccyooPzpcXDpcXHMqKFtcXHckXSspKT9cXHMqXFx9XFx9KS9nLFxuICAgICAgICAgICAgdmFybmFtZTogXCJpdFwiLFxuICAgICAgICAgICAgc3RyaXA6IHRydWUsXG4gICAgICAgICAgICBhcHBlbmQ6IHRydWUsXG4gICAgICAgICAgICBzZWxmY29udGFpbmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRvTm90U2tpcEVuY29kZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsIC8vZm4sIGNvbXBpbGUgdGVtcGxhdGVcbiAgICAgICAgY29tcGlsZTogdW5kZWZpbmVkICAvL2ZuLCBmb3IgZXhwcmVzc1xuICAgIH0sIF9nbG9iYWxzO1xuXG4gICAgZG9ULmVuY29kZUhUTUxTb3VyY2UgPSBmdW5jdGlvbihkb05vdFNraXBFbmNvZGVkKSB7XG4gICAgICAgIHZhciBlbmNvZGVIVE1MUnVsZXMgPSB7XCImXCI6IFwiJiMzODtcIiwgXCI8XCI6IFwiJiM2MDtcIiwgXCI+XCI6IFwiJiM2MjtcIiwgJ1wiJzogXCImIzM0O1wiLCBcIidcIjogXCImIzM5O1wiLCBcIi9cIjogXCImIzQ3O1wifSxcbiAgICAgICAgICAgIG1hdGNoSFRNTCA9IGRvTm90U2tpcEVuY29kZWQgPyAvWyY8PlwiJ1xcL10vZyA6IC8mKD8hIz9cXHcrOyl8PHw+fFwifCd8XFwvL2c7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29kZSA/IGNvZGUudG9TdHJpbmcoKS5yZXBsYWNlKG1hdGNoSFRNTCwgZnVuY3Rpb24obSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVIVE1MUnVsZXNbbV0gfHwgbTtcbiAgICAgICAgICAgIH0pIDogXCJcIjtcbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICBfZ2xvYmFscyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgfHwgKDAsIGV2YWwpKFwidGhpc1wiKTtcbiAgICB9KCkpO1xuXG4gICAgLy9IaWJlclxuICAgIC8vcmVwbGF0ZSB0aGUgbW9kdWxlIGRlZmluaXRpb24gd2l0aCBzaW1wbGUgbW9kdWxlLmV4cG9ydHMgc2luY2Ugd2Ugb25seSBydW5cbiAgICAvL2l0IGluIG5vZGUgbGlrZSBlbnZpcm9ubWVudFxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb1Q7XG4gICAgLy9pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vXG4gICAgLy99IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy9cdGRlZmluZShmdW5jdGlvbigpe3JldHVybiBkb1Q7fSk7XG4gICAgLy99IGVsc2Uge1xuICAgIC8vXHRfZ2xvYmFscy5kb1QgPSBkb1Q7XG4gICAgLy99XG5cbiAgICB2YXIgc3RhcnRlbmQgPSB7XG4gICAgICAgIGFwcGVuZDoge3N0YXJ0OiBcIicrKFwiLCBlbmQ6IFwiKSsnXCIsIHN0YXJ0ZW5jb2RlOiBcIicrZW5jb2RlSFRNTChcIn0sXG4gICAgICAgIHNwbGl0OiB7c3RhcnQ6IFwiJztvdXQrPShcIiwgZW5kOiBcIik7b3V0Kz0nXCIsIHN0YXJ0ZW5jb2RlOiBcIic7b3V0Kz1lbmNvZGVIVE1MKFwifVxuICAgIH0sIHNraXAgPSAvJF4vO1xuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZURlZnMoYywgYmxvY2ssIGRlZikge1xuICAgICAgICByZXR1cm4gKCh0eXBlb2YgYmxvY2sgPT09IFwic3RyaW5nXCIpID8gYmxvY2sgOiBibG9jay50b1N0cmluZygpKVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5kZWZpbmUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSwgYXNzaWduLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChjb2RlLmluZGV4T2YoXCJkZWYuXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlLnN1YnN0cmluZyg0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoY29kZSBpbiBkZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NpZ24gPT09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5kZWZpbmVQYXJhbXMpIHZhbHVlLnJlcGxhY2UoYy5kZWZpbmVQYXJhbXMsIGZ1bmN0aW9uKG0sIHBhcmFtLCB2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmW2NvZGVdID0ge2FyZzogcGFyYW0sIHRleHQ6IHZ9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShjb2RlIGluIGRlZikpIGRlZltjb2RlXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZ1bmN0aW9uKFwiZGVmXCIsIFwiZGVmWydcIiArIGNvZGUgKyBcIiddPVwiICsgdmFsdWUpKGRlZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy51c2UgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjLnVzZVBhcmFtcykgY29kZSA9IGNvZGUucmVwbGFjZShjLnVzZVBhcmFtcywgZnVuY3Rpb24obSwgcywgZCwgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltkXSAmJiBkZWZbZF0uYXJnICYmIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcncgPSAoZCArIFwiOlwiICsgcGFyYW0pLnJlcGxhY2UoLyd8XFxcXC9nLCBcIl9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWYuX19leHAgPSBkZWYuX19leHAgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWYuX19leHBbcnddID0gZGVmW2RdLnRleHQucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58W15cXFxcdyRdKVwiICsgZGVmW2RdLmFyZyArIFwiKFteXFxcXHckXSlcIiwgXCJnXCIpLCBcIiQxXCIgKyBwYXJhbSArIFwiJDJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcyArIFwiZGVmLl9fZXhwWydcIiArIHJ3ICsgXCInXVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHYgPSBuZXcgRnVuY3Rpb24oXCJkZWZcIiwgXCJyZXR1cm4gXCIgKyBjb2RlKShkZWYpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID8gcmVzb2x2ZURlZnMoYywgdiwgZGVmKSA6IHY7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZShjb2RlKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoL1xcXFwoJ3xcXFxcKS9nLCBcIiQxXCIpLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKTtcbiAgICB9XG5cbiAgICBkb1QudGVtcGxhdGUgPSBmdW5jdGlvbih0bXBsLCBjLCBkZWYsIGRvbnRSZW5kZXJOdWxsT3JVbmRlZmluZWQpIHtcbiAgICAgICAgYyA9IGMgfHwgZG9ULnRlbXBsYXRlU2V0dGluZ3M7XG4gICAgICAgIHZhciBjc2UgPSBjLmFwcGVuZCA/IHN0YXJ0ZW5kLmFwcGVuZCA6IHN0YXJ0ZW5kLnNwbGl0LCBuZWVkaHRtbGVuY29kZSwgc2lkID0gMCwgaW5kdixcbiAgICAgICAgICAgIHN0ciA9IChjLnVzZSB8fCBjLmRlZmluZSkgPyByZXNvbHZlRGVmcyhjLCB0bXBsLCBkZWYgfHwge30pIDogdG1wbDtcblxuICAgICAgICB2YXIgdW5lc2NhcGVDb2RlO1xuXG4gICAgICAgIHN0ciA9IChcInZhciBvdXQ9J1wiICsgKGMuc3RyaXAgPyBzdHIucmVwbGFjZSgvKF58XFxyfFxcbilcXHQqICt8ICtcXHQqKFxccnxcXG58JCkvZywgXCIgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyfFxcbnxcXHR8XFwvXFwqW1xcc1xcU10qP1xcKlxcLy9nLCBcIlwiKSA6IHN0cilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8nfFxcXFwvZywgXCJcXFxcJCZcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuaW50ZXJwb2xhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGlmICghIWRvbnRSZW5kZXJOdWxsT3JVbmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5lc2NhcGVDb2RlID0gdW5lc2NhcGUoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlLmluZGV4T2YoJ3x8JykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlQ29kZSArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgJyh0eXBlb2YgJyArIGNvZGUgKyAnICE9PSBcInVuZGVmaW5lZFwiICYmICcgKyBjb2RlICsgJyE9PSBudWxsKT8nICsgdW5lc2NhcGVDb2RlICsgJzogXCJcIicgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZW5jb2RlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBuZWVkaHRtbGVuY29kZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydGVuY29kZSArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmNvbmRpdGlvbmFsIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGVsc2VjYXNlLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsc2VjYXNlID9cbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPyBcIic7fWVsc2UgaWYoXCIgKyB1bmVzY2FwZShjb2RlKSArIFwiKXtvdXQrPSdcIiA6IFwiJzt9ZWxzZXtvdXQrPSdcIikgOlxuICAgICAgICAgICAgICAgICAgICAoY29kZSA/IFwiJztpZihcIiArIHVuZXNjYXBlKGNvZGUpICsgXCIpe291dCs9J1wiIDogXCInO31vdXQrPSdcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5pdGVyYXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGl0ZXJhdGUsIHZuYW1lLCBpbmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICghaXRlcmF0ZSkgcmV0dXJuIFwiJzt9IH0gb3V0Kz0nXCI7XG4gICAgICAgICAgICAgICAgc2lkICs9IDE7XG4gICAgICAgICAgICAgICAgaW5kdiA9IGluYW1lIHx8IFwiaVwiICsgc2lkO1xuICAgICAgICAgICAgICAgIGl0ZXJhdGUgPSB1bmVzY2FwZShpdGVyYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1xcJzt2YXIgYXJyJyArIHNpZCArICc9JyArIGl0ZXJhdGUgKyBcIjtpZihhcnJcIiArIHNpZCArIFwiKXt2YXIgXCIgKyB2bmFtZSArIFwiLFwiICsgaW5kdiArIFwiPS0xLGxcIiArIHNpZCArIFwiPWFyclwiICsgc2lkICsgXCIubGVuZ3RoLTE7d2hpbGUoXCIgKyBpbmR2ICsgXCI8bFwiICsgc2lkICsgXCIpe1wiXG4gICAgICAgICAgICAgICAgICAgICsgdm5hbWUgKyBcIj1hcnJcIiArIHNpZCArIFwiW1wiICsgaW5kdiArIFwiKz0xXTtvdXQrPSdcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmV2YWx1YXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCInO1wiICsgdW5lc2NhcGUoY29kZSkgKyBcIm91dCs9J1wiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKyBcIic7cmV0dXJuIG91dDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKS5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JykucmVwbGFjZSgvXFxyL2csIFwiXFxcXHJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxzfDt8XFx9fF58XFx7KW91dFxcKz0nJzsvZywgJyQxJykucmVwbGFjZSgvXFwrJycvZywgXCJcIik7XG4gICAgICAgIC8vLnJlcGxhY2UoLyhcXHN8O3xcXH18XnxcXHspb3V0XFwrPScnXFwrL2csJyQxb3V0Kz0nKTtcblxuICAgICAgICBpZiAobmVlZGh0bWxlbmNvZGUpIHtcbiAgICAgICAgICAgIGlmICghYy5zZWxmY29udGFpbmVkICYmIF9nbG9iYWxzICYmICFfZ2xvYmFscy5fZW5jb2RlSFRNTCkgX2dsb2JhbHMuX2VuY29kZUhUTUwgPSBkb1QuZW5jb2RlSFRNTFNvdXJjZShjLmRvTm90U2tpcEVuY29kZWQpO1xuICAgICAgICAgICAgc3RyID0gXCJ2YXIgZW5jb2RlSFRNTCA9IHR5cGVvZiBfZW5jb2RlSFRNTCAhPT0gJ3VuZGVmaW5lZCcgPyBfZW5jb2RlSFRNTCA6IChcIlxuICAgICAgICAgICAgICAgICsgZG9ULmVuY29kZUhUTUxTb3VyY2UudG9TdHJpbmcoKSArIFwiKFwiICsgKGMuZG9Ob3RTa2lwRW5jb2RlZCB8fCAnJykgKyBcIikpO1wiXG4gICAgICAgICAgICAgICAgKyBzdHI7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYy52YXJuYW1lLCBzdHIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IGNyZWF0ZSBhIHRlbXBsYXRlIGZ1bmN0aW9uOiBcIiArIHN0cik7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvVC5jb21waWxlID0gZnVuY3Rpb24odG1wbCwgZGVmKSB7XG4gICAgICAgIHJldHVybiBkb1QudGVtcGxhdGUodG1wbCwgbnVsbCwgZGVmKTtcbiAgICB9O1xuXG59KCkpO1xuXG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZG9ULmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZ2NVdGlscyA9IHJlcXVpcmUoJy4vZ2NVdGlscycpO1xuXG4gICAgdmFyIGRvbVV0aWwgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZWxlbWVudCBmcm9tIGFuIEhUTUwgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGh0bWwgSFRNTCBmcmFnbWVudCB0byBjb252ZXJ0IGludG8gYW4gSFRNTEVsZW1lbnQuXG4gICAgICogQHJldHVybiBUaGUgbmV3IGVsZW1lbnQuXG4gICAgICovXG5cbiAgICAvL3JlbW92ZSBhbGwgY29tbWVudHMgYW5kIHdoaXRlc3BhY2Ugb25seSB0ZXh0IG5vZGVzXG4gICAgZnVuY3Rpb24gY2xlYW4obm9kZSkge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgbisrKSB7IC8vZG8gcmV3cml0ZSBpdCB0byBmb3IodmFyIG49MCxsZW49WFhYO2k8bGVuOylcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbbl07XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSA4IHx8IChjaGlsZC5ub2RlVHlwZSA9PT0gMyAmJiAhL1xcUy8udGVzdChjaGlsZC5ub2RlVmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgbi0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4oY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbVV0aWwuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdmFyIHIgPSBkaXYuY2hpbGRyZW5bMF07XG4gICAgICAgIGRpdiA9IG51bGw7XG4gICAgICAgIHJldHVybiByO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmNyZWF0ZVRlbXBsYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdmFyIHIgPSBkaXYuY2hpbGRyZW5bMF07XG4gICAgICAgIGNsZWFuKHIpO1xuICAgICAgICByZXR1cm4gZGl2O1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldEVsZW1lbnRJbm5lclRleHQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmlubmVySFRNTC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKS5yZXBsYWNlKC8mZ3Q7L2csICc+Jyk7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0RWxlbWVudE91dGVyVGV4dCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub3V0ZXJIVE1MLnJlcGxhY2UoLyZhbXA7L2csICcmJykucmVwbGFjZSgvJmx0Oy9nLCAnPCcpLnJlcGxhY2UoLyZndDsvZywgJz4nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgICAqL1xuICAgIGRvbVV0aWwuaGFzQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoJ1xcXFxiJyArIGNsYXNzTmFtZSArICdcXFxcYicpO1xuICAgICAgICAgICAgcmV0dXJuIGUgJiYgcngudGVzdChlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byByZW1vdmUgZm9ybSB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuc2V0QXR0cmlidXRlICYmIGRvbVV0aWwuaGFzQ2xhc3MoZSwgY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCgnXFxcXHM/XFxcXGInICsgY2xhc3NOYW1lICsgJ1xcXFxiJywgJ2cnKTtcbiAgICAgICAgICAgIHZhciBjbiA9IGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY24ucmVwbGFjZShyeCwgJycpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgY2xhc3MgdG8gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGFkZCB0byB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmFkZENsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuc2V0QXR0cmlidXRlICYmICFkb21VdGlsLmhhc0NsYXNzKGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBjbiA9IGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY24gPyBjbiArICcgJyArIGNsYXNzTmFtZSA6IGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBvciByZW1vdmVzIGEgY2xhc3MgdG8gb3IgZnJvbSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIGFkZGVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gYWRkIG9yIHJlbW92ZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFkZE9yUmVtb3ZlIFdoZXRoZXIgdG8gYWRkIG9yIHJlbW92ZSB0aGUgY2xhc3MuXG4gICAgICovXG4gICAgZG9tVXRpbC50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSwgYWRkT3JSZW1vdmUpIHtcbiAgICAgICAgaWYgKGFkZE9yUmVtb3ZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkb21VdGlsLmFkZENsYXNzKGUsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21VdGlsLnJlbW92ZUNsYXNzKGUsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gKiogalF1ZXJ5IHJlcGxhY2VtZW50IG1ldGhvZHNcbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGVsZW1lbnQgZnJvbSBhIGpRdWVyeS1zdHlsZSBzZWxlY3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IHNlbGVjdG9yIEFuIGVsZW1lbnQsIGEgc2VsZWN0b3Igc3RyaW5nLCBvciBhIGpRdWVyeSBvYmplY3QuXG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2NVdGlscy5pc1N0cmluZyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYW4gSFRNTCBlbGVtZW50IGNvbnRhaW5zIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudCBQYXJlbnQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkIENoaWxkIGVsZW1lbnQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGFyZW50IGVsZW1lbnQgY29udGFpbnMgdGhlIGNoaWxkIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5jb250YWlucyA9IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgZm9yICh2YXIgZSA9IGNoaWxkOyBlOyBlID0gZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoZSA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGNvb3JkaW5hdGVzIG9mIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgZG9tVXRpbC5vZmZzZXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyBlbGVtZW50LnNjcm9sbFRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIGVsZW1lbnQuc2Nyb2xsTGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBib3VuZGluZyByZWN0YW5nbGUgb2YgYW4gZWxlbWVudCBpbiBwYWdlIGNvb3JkaW5hdGVzLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBzaW1pbGFyIHRvIHRoZSA8Yj5nZXRCb3VuZGluZ0NsaWVudFJlY3Q8L2I+IGZ1bmN0aW9uLFxuICAgICAqIGV4Y2VwdCB0aGF0IHVzZXMgd2luZG93IGNvb3JkaW5hdGVzLCB3aGljaCBjaGFuZ2Ugd2hlbiB0aGVcbiAgICAgKiBkb2N1bWVudCBzY3JvbGxzLlxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciByYyA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiByYy5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICAgICAgdG9wOiByYy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICB3aWR0aDogcmMud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHJjLmhlaWdodFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGlubmVyIGNvbnRlbnQgcmVjdGFuZ2xlIG9mIGlucHV0IGVsZW1lbnQuXG4gICAgICogUGFkZGluZyBhbmQgYm94LXNpemluZyBpcyBjb25zaWRlcmVkLlxuICAgICAqIFRoZSByZXN1bHQgaXMgdGhlIGFjdHVhbCByZWN0YW5nbGUgdG8gcGxhY2UgY2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gZSByZXByZXNlbnQgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBkb21VdGlsLmdldENvbnRlbnRSZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmMgPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmdldFN0eWxlKGUpO1xuICAgICAgICB2YXIgbWVhc3VyZW1lbnRzID0gW1xuICAgICAgICAgICAgJ3BhZGRpbmdMZWZ0JyxcbiAgICAgICAgICAgICdwYWRkaW5nUmlnaHQnLFxuICAgICAgICAgICAgJ3BhZGRpbmdUb3AnLFxuICAgICAgICAgICAgJ3BhZGRpbmdCb3R0b20nLFxuICAgICAgICAgICAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyVG9wV2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlckJvdHRvbVdpZHRoJ1xuICAgICAgICBdO1xuICAgICAgICB2YXIgc2l6ZSA9IHt9O1xuICAgICAgICBtZWFzdXJlbWVudHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdChzdHlsZVtwcm9wXSk7XG4gICAgICAgICAgICBzaXplW3Byb3BdID0gIWlzTmFOKG51bSkgPyBudW0gOiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHBhZGRpbmdXaWR0aCA9IHNpemUucGFkZGluZ0xlZnQgKyBzaXplLnBhZGRpbmdSaWdodDtcbiAgICAgICAgdmFyIHBhZGRpbmdIZWlnaHQgPSBzaXplLnBhZGRpbmdUb3AgKyBzaXplLnBhZGRpbmdCb3R0b207XG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9IHNpemUuYm9yZGVyTGVmdFdpZHRoICsgc2l6ZS5ib3JkZXJSaWdodFdpZHRoO1xuICAgICAgICB2YXIgYm9yZGVySGVpZ2h0ID0gc2l6ZS5ib3JkZXJUb3BXaWR0aCArIHNpemUuYm9yZGVyQm90dG9tV2lkdGg7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiByYy5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0ICsgc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLnBhZGRpbmdMZWZ0LFxuICAgICAgICAgICAgdG9wOiByYy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQgKyBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5wYWRkaW5nVG9wLFxuICAgICAgICAgICAgd2lkdGg6IHJjLndpZHRoIC0gcGFkZGluZ1dpZHRoIC0gYm9yZGVyV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHJjLmhlaWdodCAtIHBhZGRpbmdIZWlnaHQgLSBib3JkZXJIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9kaWZpZXMgdGhlIHN0eWxlIG9mIGFuIGVsZW1lbnQgYnkgYXBwbHlpbmcgdGhlIHByb3BlcnRpZXMgc3BlY2lmaWVkIGluIGFuIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHdob3NlIHN0eWxlIHdpbGwgYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNzcyBPYmplY3QgY29udGFpbmluZyB0aGUgc3R5bGUgcHJvcGVydGllcyB0byBhcHBseSB0byB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLnNldENzcyA9IGZ1bmN0aW9uKGUsIGNzcykge1xuICAgICAgICB2YXIgcyA9IGUuc3R5bGU7XG4gICAgICAgIGZvciAodmFyIHAgaW4gY3NzKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gY3NzW3BdO1xuICAgICAgICAgICAgaWYgKGdjVXRpbHMuaXNOdW1iZXIodmFsKSkge1xuICAgICAgICAgICAgICAgIGlmIChwLm1hdGNoKC93aWR0aHxoZWlnaHR8bGVmdHx0b3B8cmlnaHR8Ym90dG9tfHNpemV8cGFkZGluZ3xtYXJnaW4nL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSAncHgnOyAvLyBkZWZhdWx0IHVuaXQgZm9yIGdlb21ldHJ5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzW3BdID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb21VdGlsLnNjcm9sbGJhclNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21VdGlsLnNjcm9sbGJhclNpemU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGl2ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDotMTAwMDBweDsgbGVmdDotMTAwMDBweDsgd2lkdGg6MTAwcHg7IGhlaWdodDoxMDBweDsgb3ZlcmZsb3c6c2Nyb2xsO1wiPjwvZGl2PicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBkaXYub2Zmc2V0V2lkdGggLSBkaXYuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGRpdi5vZmZzZXRIZWlnaHQgLSBkaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG5cbiAgICAgICAgcmV0dXJuIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZTtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTdHlsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGZuID0gZ2V0Q29tcHV0ZWRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZTtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbihlbGVtZW50LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTdHlsZVZhbHVlID0gZnVuY3Rpb24oZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb21VdGlsLmdldFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gc3R5bGUgPyBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpIDogbnVsbDtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5HZXRNYXhTdXBwb3J0ZWRDU1NIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaCA9IDEwMDAwMDA7XG4gICAgICAgIHZhciB0ZXN0VXBUbyA9IDYwMDAwMDAgKiAxMDAwO1xuICAgICAgICB2YXIgZGl2ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IHN0eWxlPVwiZGlzcGxheTpub25lXCIvPicpO1xuICAgICAgICB2YXIgdGVzdDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdGVzdCA9IGggKyA1MDAwMDA7IC8vKiAyO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IHRlc3QgKyAncHgnO1xuICAgICAgICAgICAgaWYgKHRlc3QgPiB0ZXN0VXBUbyB8fCBkaXYub2Zmc2V0SGVpZ2h0ICE9PSB0ZXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoID0gdGVzdDtcbiAgICAgICAgfVxuICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuICAgICAgICBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodCA9IGg7XG4gICAgICAgIHJldHVybiBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodDtcbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb21VdGlsO1xufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2RvbVV0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiTWFzb25yeUxheW91dEVuZ2luZS5qcyJ9