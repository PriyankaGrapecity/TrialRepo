(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["CalendarStrategy"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["CalendarStrategy"] = factory();
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
	
	    //region Field
	    var gcUtils = __webpack_require__(1);
	    var doT = __webpack_require__(2);
	    var domUtil = __webpack_require__(3);
	    var Event = __webpack_require__(5).Event;
	    var VIEW_MONTH = 'Month';
	    var VIEW_DAY = 'Day';
	    var VIEW_WEEK = 'Week';
	    var POS_ABS = 'absolute';
	    var POS_REL = 'relative';
	    var OVERFLOW_HIDDEN = 'hidden';
	    var OVERFLOW_AUTO = 'auto';
	    var ONE_DAY = 24 * 1000 * 60 * 60;
	    var ONE_HOUR = 1000 * 60 * 60;
	    var maxColumnCount = 7;
	    var maxRowCount = 6;
	    //endregion
	
	    //region Constructor
	    var CalendarStrategy = function(options) {
	        var self = this;
	        self.name = 'CalendarStrategy'; //name must end with LayoutEngine
	        self.options = _.defaults(options || {}, self.getDefaultOptions());
	        self.layoutInfo_ = null;
	        self.onEventLimitClick = new Event();
	        self.onEventClick = new Event();
	        self.onPopoverClose = new Event();
	    };
	    //endregion
	
	    //region Prototype
	    CalendarStrategy.prototype = {
	        init: function(grid) {
	            var self = this;
	            self.grid = grid;
	            grid.onMouseWheel.addHandler(handleMouseWheel_);
	            grid.onMouseDown.addHandler(handleMouseDown_);
	            grid.onMouseUp.addHandler(handleMouseUp_);
	            grid.onMouseClick.addHandler(handleMouseClick_);
	        },
	
	        getDefaultOptions: function() {
	            var defaultStartDate = new Date();
	            var year = defaultStartDate.getFullYear();
	            var month = defaultStartDate.getMonth();
	            var day = defaultStartDate.getDate();
	            var defaultStartTime = new Date(year, month, day, 0, 0, 0);
	            var defaultEndTime = new Date(year, month, day, 24, 0, 0);
	            return {
	                viewMode: VIEW_MONTH,
	                startDate: defaultStartDate,
	                //displayingDays: 7,      //commit in v1
	                startTime: defaultStartTime, //start time of a day.
	                endTime: defaultEndTime,  //end time of a day.
	                timeUnit: 1,
	                rowHeaderWidth: 60,
	                colHeaderHeight: 25,
	                rowHeight: 50,
	                //colWidth: 150,
	                dateHeaderHeight: 25,
	                editable: false
	            };
	        },
	
	        getLayoutInfo: function() {
	            var self = this;
	            if (self.options.viewMode === VIEW_MONTH) {
	                return self.layoutInfo_ || (self.layoutInfo_ = {
	                        monthViewHeader: getMonthHeaderLayoutInfo_.call(this),
	                        monthViewCells: getMonthCellsLayoutInfo_.call(this),
	                        monthViewEvent: getMonthCellsLayoutInfo_.call(this)
	                    });
	            } else {
	                return self.layoutInfo_ || (self.layoutInfo_ = {
	                        daysViewCells: getDaysCellsLayoutInfo_.call(this),
	                        daysViewColumnHeader: getDaysColumnHeaderLayoutInfo_.call(this),
	                        daysViewRowHeader: getDaysRowHeaderLayoutInfo_.call(this),
	                        daysViewCorner: getDaysCornerLayoutInfo_.call(this),
	                        daysViewEvent: getDaysCellsLayoutInfo_.call(this),
	                        viewport: getDaysCellsLayoutInfo_.call(this)
	                    });
	            }
	        },
	
	        getRenderRowInfo_: function(row, area) {
	            var scope = this;
	            var uid = scope.grid.uid + '-';
	
	            if (area === 'daysViewCells') {
	                return createRowRenderInfo.call(scope, row.index, row.height, uid);
	            } else if (area === 'daysViewRowHeader') {
	                var displayDateTime = scope.displayDateTime_ || getDisplayDateTime_.call(this);
	                var rowHeaderWidth = scope.options.rowHeaderWidth;
	
	                return createRowHeaderCellInfo.call(scope, row.index, row.height, rowHeaderWidth, uid, displayDateTime[row.index]);
	            }
	        },
	
	        getRenderRange_: function(options) {
	            var scope = this;
	            var area = (options && options.area) || '';
	            if (!area) {
	                return null;
	            }
	
	            return getRowsRenderInfo.call(scope, area, options);
	        },
	
	        getRenderInfo: function(options) {
	            var scope = this;
	            var layoutInfo = this.getLayoutInfo();
	
	            var r = scope.options.viewMode !== VIEW_MONTH ? getRenderedDaysViewInfo_.call(this, options, layoutInfo) :
	                getRenderedMonthViewInfo_.call(this, options, layoutInfo);
	
	            return r;
	        },
	
	        getRowTemplate: function() {
	            return getTemplate_.call(this, false);
	        },
	
	        showScrollPanel: function(area) {
	            if (area === 'daysViewCells') {
	                var layoutInfo = this.getLayoutInfo()[area];
	                if (layoutInfo.height < layoutInfo.contentHeight || layoutInfo.width < layoutInfo.contentWidth) {
	                    return true;
	                }
	            }
	            return false;
	        },
	
	        isScrollableArea_: function() {
	            return false;
	        },
	
	        getScrollPanelRenderInfo: function(area) {
	            if (area === 'daysViewCells') {
	                var layout = this.getLayoutInfo();
	                var columnHeaderLayoutInfo = layout.daysViewColumnHeader;
	                var rowHeaderLayoutInfo = layout.daysViewRowHeader;
	                var viewportLayout = layout.daysViewCells;
	                return {
	                    outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-top scroll-left',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: 0,
	                        left: 0,
	                        height: viewportLayout.height + columnHeaderLayoutInfo.height,
	                        width: viewportLayout.width + rowHeaderLayoutInfo.width,
	                        overflow: OVERFLOW_AUTO
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        height: viewportLayout.contentHeight + columnHeaderLayoutInfo.height,
	                        width: viewportLayout.contentWidth + rowHeaderLayoutInfo.width
	                    }
	                };
	            }
	        },
	
	        handleScroll: function() {
	            var self = this;
	            var grid = self.grid;
	            if (self.options.viewMode === VIEW_MONTH) {
	                return;
	            }
	
	            grid.scrollRenderPart_('daysViewCells', false);
	            grid.scrollRenderPart_('daysViewColumnHeader', false);
	            grid.scrollRenderPart_('daysViewRowHeader', false);
	            grid.scrollRenderPart_('daysViewEvent', false);
	        },
	
	        hitTest: function(eventArgs) {
	            var self = this;
	            var grid = self.grid;
	            var left = eventArgs.pageX;
	            var top = eventArgs.pageY;
	            var options = self.options;
	            var layout = self.getLayoutInfo();
	            var containerInfo = grid.getContainerInfo_().contentRect;
	            var offsetLeft = left - containerInfo.left;
	            var offsetTop = top - containerInfo.top;
	            var i;
	            var len;
	            var point = {
	                left: offsetLeft,
	                top: offsetTop
	            };
	            var columnHeaderLayout;
	            var groupInfos;
	            var groupInfo;
	            if (options.viewMode === VIEW_MONTH) {
	                var monthEventLayout = layout.monthViewEvent;
	                if (contains_(monthEventLayout, point)) {
	                    columnHeaderLayout = layout.monthViewHeader;
	                    offsetTop -= columnHeaderLayout.height;
	                    groupInfos = grid.groupInfos_;
	                    if (!groupInfos || groupInfos.length === 0) {
	                        return null;
	                    }
	                    var layoutEngine = grid.layoutEngine;
	                    var eventPanel = document.getElementById(grid.uid + '-' + 'monthViewEvent');
	                    var hitTestInfo;
	                    var popoverElement = document.getElementById(grid.uid + '-popover-dialog');
	                    if (popoverElement && pointIn_(offsetLeft, offsetTop, popoverElement, eventPanel)) {
	                        var groupContent = document.querySelector('#' + grid.uid + '-popover-dialog' + ' .group-content');
	                        var popContentOffset = domUtil.offset(groupContent);
	                        var hitInfo = grid.layoutEngine.hitTestGroupContent_(self.popoverGroupInfo_, 'viewport', left - popContentOffset.left, top - popContentOffset.top, {
	                            width: groupContent.clientWidth,
	                            height: groupContent.clientHeight
	                        });
	                        hitTestInfo = {
	                            area: 'viewport',
	                            row: -1,
	                            column: -1,
	                            popoverInfo: {
	                                onCloseButton: false //TODO: need group item hit test here?
	                            }
	                        };
	                        if (hitInfo) {
	                            hitTestInfo.popoverInfo.groupPath = self.popoverGroupInfo_.path;
	                            hitTestInfo.popoverInfo.row = hitInfo.groupInfo.row;
	                        }
	                        var popCloseElement = document.querySelector('#' + grid.uid + '-popover-dialog' + ' .popover-close');
	                        if (popCloseElement && pointIn_(offsetLeft, offsetTop, popCloseElement, eventPanel)) {
	                            hitTestInfo.popoverInfo.onCloseButton = true;
	                        }
	                        return hitTestInfo;
	                    }
	
	                    var containerSize;
	                    var containerOffset;
	                    var layoutInfo = getCellLayoutInfo_.call(self, false);
	                    for (i = 0, len = groupInfos.length; i < len; i++) {
	                        groupInfo = groupInfos[i];
	                        containerSize = {
	                            width: layoutInfo.width,
	                            height: groupInfo.height
	                        };
	                        var group = groupInfo.data;
	                        var eventContainer = document.getElementById(grid.uid + '-g' + groupInfo.path.join('_'));
	                        if (eventContainer && pointIn_(offsetLeft, offsetTop, eventContainer, eventPanel)) {
	                            containerOffset = domUtil.offset(eventContainer);
	                            hitTestInfo = layoutEngine.hitTestGroupContent_(groupInfo, 'viewport', left - containerOffset.left, top - containerOffset.top, containerSize);
	                            if (!hitTestInfo) {
	                                return {
	                                    area: 'viewport',
	                                    row: -1,
	                                    column: -1,
	                                    groupInfo: {
	                                        area: 'eventContainer',
	                                        path: groupInfo.path,
	                                        row: -1
	                                    }
	                                };
	                            }
	                            var maxRowCount = layoutEngine.getMaxVisibleItemCount({
	                                width: getCellLayoutInfo_.call(self, false).width,
	                                height: groupInfo.height
	                            });
	                            var info = hitTestInfo.groupInfo;
	                            if (info && ((maxRowCount === 0 && info.row === 0) || info.row === (maxRowCount - 1)) && maxRowCount < group.itemCount) {
	                                info.action = 'eventLimit';
	                                info.row = -1;
	                            }
	                            return hitTestInfo;
	                        }
	                    }
	                }
	            } else {
	                var daysEventLayout = layout.daysViewEvent;
	                if (contains_(daysEventLayout, point)) {
	                    var rowHeaderLayout = layout.daysViewRowHeader;
	                    columnHeaderLayout = layout.daysViewColumnHeader;
	                    offsetLeft -= rowHeaderLayout.width;
	                    offsetTop -= columnHeaderLayout.height;
	                    var dayEventPanel = document.getElementById(grid.uid + '-' + 'daysViewEvent');
	                    groupInfos = getCurrentViewGroups_.call(self);
	                    var j;
	                    var len2;
	                    var element;
	                    for (i = 0, len = groupInfos.length; i < len; i++) {
	                        groupInfo = groupInfos[i];
	                        element = document.getElementById(grid.uid + '-g' + groupInfo.path.join('_'));
	                        if (pointIn_(offsetLeft, offsetTop, element, dayEventPanel)) {
	                            for (j = 0, len2 = groupInfo.data.itemCount; j < len2; j++) {
	                                element = document.getElementById(grid.uid + '-gr' + groupInfo.path.join('_') + '-r' + j);
	                                if (pointIn_(offsetLeft, offsetTop, element, dayEventPanel)) {
	                                    return {
	                                        area: 'viewport',
	                                        row: -1,
	                                        column: -1,
	                                        groupInfo: {
	                                            area: 'eventContainer',
	                                            path: groupInfo.path,
	                                            row: j
	                                        }
	                                    };
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        },
	
	        destroy: function() {
	            var self = this;
	            var grid = self.grid;
	            grid.onMouseWheel.removeHandler(handleMouseWheel_);
	            grid.onMouseDown.removeHandler(handleMouseDown_);
	            grid.onMouseUp.removeHandler(handleMouseUp_);
	            grid.onMouseClick.removeHandler(handleMouseClick_);
	        },
	
	        clearRenderCache_: function() {
	            var self = this;
	            self.layoutInfo_ = null;
	            self.cachedItemWidth_ = null;
	            if (self.monthViewHeaderHTML_) {
	                self.monthViewHeaderHTML_ = null;
	            }
	
	            if (self.monthContentInfo_) {
	                self.monthContentInfo_ = null;
	            }
	
	            if (self.cachedTmplFn_) {
	                self.cachedTmplFn_ = null;
	            }
	
	            if (self.cachedItemCount_) {
	                self.cachedItemCount_ = null;
	            }
	
	            if (self.displayDateTime_) {
	                self.displayDateTime_ = null;
	            }
	
	            if (self.cachedRowOffset_) {
	                self.cachedRowOffset_ = null;
	            }
	
	            if (self.cachedEventKeys_) {
	                self.cachedEventKeys_ = null;
	            }
	        },
	
	        initGroupInfosHeight_: function() {
	            var self = this;
	            var groupInfos = self.grid.groupInfos_;
	            var i;
	            var len;
	            var height = (self.options.viewMode !== VIEW_MONTH) ? getDaysCellsLayoutInfo_.call(self).contentHeight : (getCellLayoutInfo_.call(self, false).height - self.options.dateHeaderHeight);
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupInfos[i].height = height;
	            }
	        }
	    };
	    //endregion
	
	    function contains_(layoutInfo, point) {
	        return point.left >= layoutInfo.left && point.top >= layoutInfo.top && point.left <= (layoutInfo.left + layoutInfo.width) && point.top <= (layoutInfo.top + layoutInfo.height);
	    }
	
	    function pointIn_(offsetLeft, offsetTop, element, relativeElement) {
	        var eleOffset = domUtil.offset(element);
	        var targetEleOffset = domUtil.offset(relativeElement);
	        var left = eleOffset.left - targetEleOffset.left;
	        var top = eleOffset.top - targetEleOffset.top;
	
	        if (offsetLeft >= left && offsetLeft <= (left + element.clientWidth) &&
	            offsetTop >= top && offsetTop <= (top + element.clientHeight)) {
	            return true;
	        }
	        return false;
	    }
	
	    //region DaysView
	    function getDaysColumnHeaderLayoutInfo_() {
	        var self = this;
	        var viewPortLayout = getDaysCellsLayoutInfo_.call(self);
	        var options = self.options;
	
	        return {
	            top: 0,
	            left: viewPortLayout.left,
	            width: viewPortLayout.width,
	            height: options.colHeaderHeight,
	            contentWidth: viewPortLayout.contentWidth,
	            contentHeight: options.colHeaderHeight
	        };
	    }
	
	    function getDaysRowHeaderLayoutInfo_() {
	        var self = this;
	        var viewPortLayout = getDaysCellsLayoutInfo_.call(self);
	        var options = self.options;
	
	        return {
	            top: options.colHeaderHeight,
	            left: 0,
	            width: options.rowHeaderWidth,
	            height: viewPortLayout.height,
	            contentWidth: options.rowHeaderWidth,
	            contentHeight: viewPortLayout.contentHeight
	        };
	    }
	
	    function getDaysCellsLayoutInfo_() {
	        var self = this;
	        var grid = self.grid;
	        var options = self.options;
	        self.cachedItemCount_ = Math.ceil((options.endTime.getTime() - options.startTime.getTime()) / (options.timeUnit * ONE_HOUR));
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var displayingDays = options.viewMode === VIEW_DAY ? 1 : 7;
	        return {
	            top: options.colHeaderHeight,
	            left: options.rowHeaderWidth,
	            width: containerRect.width - options.rowHeaderWidth,
	            height: containerRect.height - options.colHeaderHeight,
	            contentWidth: displayingDays * calcEventColumnWidth_(self),
	            contentHeight: self.cachedItemCount_ * options.rowHeight
	        };
	    }
	
	    function getDaysCornerLayoutInfo_() {
	        var self = this;
	        var options = self.options;
	
	        return {
	            top: 0,
	            left: 0,
	            width: options.rowHeaderWidth,
	            height: options.colHeaderHeight,
	            contentWidth: options.rowHeaderWidth,
	            contentHeight: options.colHeaderHeight
	        };
	    }
	
	    function getRenderedDaysViewInfo_(options, layoutInfo) {
	        var area = (options && options.area) || '';
	        if (!area) {
	            return null;
	        }
	        var includeRows = options.includeRows || true;
	        var currentLayoutInfo = layoutInfo[area];
	        var r;
	        var i;
	        var scope = this;
	        var rowHeight = scope.options.rowHeight;
	        var rowHeaderWidth = scope.options.rowHeaderWidth;
	        var height = currentLayoutInfo.height;
	        var width = currentLayoutInfo.width;
	        var hasVScrollbar;
	        var hasHScrollbar;
	        var idPrefix = scope.grid.uid + '-';
	        var renderRange = getRenderRange.call(scope, area, currentLayoutInfo, options);
	        var offsetTop = renderRange.offsetTop;
	
	        if (area === 'daysViewCells') {
	            hasVScrollbar = currentLayoutInfo.height < currentLayoutInfo.contentHeight;
	            hasHScrollbar = currentLayoutInfo.width < currentLayoutInfo.contentWidth;
	            r = {
	                outerDivCssClass: 'gc-viewport',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height - (hasHScrollbar ? domUtil.getScrollbarSize().width : 0),
	                    width: width - (hasVScrollbar ? domUtil.getScrollbarSize().height : 0),
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    height: height - (offsetTop < 0 ? offsetTop : 0),
	                    width: currentLayoutInfo.contentWidth
	                },
	                innerDivTranslate: {
	                    left: -options.offsetLeft || 0,
	                    top: -options.offsetTop || 0
	                },
	                renderedRows: []
	            };
	            if (includeRows) {
	                for (i = renderRange.start; i < renderRange.end; i++) {
	                    r.renderedRows.push(createRowRenderInfo.call(scope, i, rowHeight, idPrefix));
	                }
	            }
	        } else if (area === 'daysViewEvent') {
	            hasVScrollbar = currentLayoutInfo.height < currentLayoutInfo.contentHeight;
	            hasHScrollbar = currentLayoutInfo.width < currentLayoutInfo.contentWidth;
	            r = {
	                outerDivCssClass: 'gc-viewport',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height - (hasHScrollbar ? domUtil.getScrollbarSize().width : 0),
	                    width: width - (hasVScrollbar ? domUtil.getScrollbarSize().height : 0),
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_ABS,
	                    height: height - (offsetTop < 0 ? offsetTop : 0),
	                    width: currentLayoutInfo.contentWidth
	                },
	                innerDivTranslate: {
	                    left: -options.offsetLeft || 0,
	                    top: -options.offsetTop || 0
	                },
	                renderedRows: []
	            };
	            if (includeRows) {
	                r.renderedRows = getRenderedDaysViewEventInfo_.call(scope);
	            }
	        } else if (area === 'daysViewColumnHeader') {
	            r = {
	                outerDivCssClass: 'gc-columnHeader',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height,
	                    width: width,
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    height: height,
	                    width: currentLayoutInfo.contentWidth
	                },
	                innerDivTranslate: {
	                    left: -options.offsetLeft || 0,
	                    top: 0
	                },
	                renderedRows: [{
	                    key: idPrefix + 'columnHeader',
	                    renderInfo: {
	                        cssClass: 'gc-column-header',
	                        renderedHTML: getRenderedDaysViewColumnHeaderInfo_.call(scope, options)
	                    }
	                }]
	            };
	        } else if (area === 'daysViewRowHeader') {
	            var displayDateTime = scope.displayDateTime_ || getDisplayDateTime_.call(scope);
	            scope.displayDateTime_ = displayDateTime;
	            r = {
	                outerDivCssClass: 'gc-rowHeader',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height,
	                    width: width,
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    height: height - (offsetTop < 0 ? offsetTop : 0),
	                    width: currentLayoutInfo.contentWidth
	                },
	                innerDivTranslate: {
	                    left: 0,
	                    top: -options.offsetTop || 0
	                },
	                renderedRows: []
	            };
	            if (includeRows) {
	                rowHeaderWidth = scope.options.rowHeaderWidth;
	                for (i = renderRange.start; i < renderRange.end; i++) {
	                    r.renderedRows.push(createRowHeaderCellInfo.call(scope, i, rowHeight, rowHeaderWidth, idPrefix, displayDateTime[i]));
	                }
	            }
	
	        } else if (area === 'daysViewCorner') {
	            r = {
	                outerDivCssClass: 'gc-cornerHeader',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    height: height,
	                    width: width
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    height: height,
	                    width: width
	                },
	                renderedRows: [{
	                    key: idPrefix + 'corner',
	                    renderInfo: {
	                        cssClass: 'gc-corner-header-cell',
	                        style: {
	                            height: '100%'
	                        }
	                    }
	                }]
	            };
	        }
	
	        return r;
	    }
	
	    function getRowsRenderInfo(area, options) {
	        var scope = this;
	        var idPrefix = scope.grid.uid + '-';
	        var currLayoutInfo = scope.getLayoutInfo()[area];
	        var r = {};
	        var i;
	        var rowHeight = scope.options.rowHeight;
	
	        var renderRange = getRenderRange.call(scope, area, currLayoutInfo, options);
	        if (area === 'daysViewCells') {
	            r.left = -options.offsetLeft || 0;
	            r.top = -options.offsetTop || 0;
	            r.renderedRows = [];
	
	            for (i = renderRange.start; i < renderRange.end; i++) {
	                r.renderedRows.push(
	                    {
	                        key: idPrefix + 'r' + i,
	                        index: i,
	                        height: rowHeight
	                    });
	            }
	        } else if (area === 'daysViewRowHeader') {
	            r.left = 0;
	            r.top = -options.offsetTop || 0;
	            r.renderedRows = [];
	
	            for (i = renderRange.start; i < renderRange.end; i++) {
	                r.renderedRows.push(
	                    {
	                        key: idPrefix + 'rh' + i,
	                        index: i,
	                        height: rowHeight
	                    });
	            }
	        } else if (area === 'daysViewColumnHeader') {
	            r.left = -options.offsetLeft || 0;
	            r.top = 0;
	            r.renderedRows = [];
	
	            r.renderedRows.push({key: idPrefix + 'columnHeader'});
	        } else {
	            r.left = -options.offsetLeft;
	            r.top = -options.offsetTop;
	            r.renderedRows = [];
	
	            if (scope.cachedEventKeys_) {
	                r.renderedRows = scope.cachedEventKeys_;
	            }
	        }
	
	        return r;
	    }
	
	    function getRenderRange(area, layoutInfo, options) {
	        var scope = this;
	        var startRowInfo;
	        var endRowInfo;
	        var offsetTop = options.offsetTop;
	        var renderRange = {};
	        var isRowArea = area === 'daysViewCells' || area === 'daysViewRowHeader';
	
	        if (isRowArea) {
	            startRowInfo = getRowInfoAt_.call(scope, {top: options.offsetTop, left: options.offsetLeft});
	            endRowInfo = getRowInfoAt_.call(scope, {
	                top: options.offsetTop + layoutInfo.height,
	                left: options.offsetLeft + layoutInfo.width
	            });
	
	            if (startRowInfo) {
	                renderRange.start = startRowInfo.index;
	                renderRange.end = endRowInfo ? (endRowInfo.index + 1) : scope.cachedItemCount_;
	                renderRange.offsetTop = startRowInfo.startPosition - offsetTop;
	            } else {
	                renderRange.start = renderRange.end = renderRange.offsetTop = 0;
	            }
	        }
	
	        return renderRange;
	    }
	
	    function createRowRenderInfo(i, rowHeight, idPrefix) {
	        return {
	            key: idPrefix + 'r' + i,
	            renderInfo: {
	                index: 0,
	                cssClass: 'gc-row r' + i + ' even',
	                style: {
	                    top: i * rowHeight,
	                    height: rowHeight
	                },
	                renderedHTML: getRenderedDaysViewPortInfo_.call(this)
	            }
	        };
	    }
	
	    function createRowHeaderCellInfo(i, rowHeight, width, idPrefix, item) {
	        return {
	            key: idPrefix + 'rh' + i,
	            renderInfo: {
	                index: i,
	                cssClass: 'gc-row-header r' + i,
	                style: {
	                    top: i * rowHeight,
	                    height: rowHeight,
	                    width: width
	                },
	                renderedHTML: getRenderedDaysViewRowHeaderInfo_.call(this, item)
	            }
	        };
	    }
	
	    function getRenderedDaysViewPortInfo_() {
	        var self = this;
	        var options = self.options;
	
	        var columnCount = options.viewMode === VIEW_DAY ? 1 : 7;
	
	        var height = options.rowHeight;
	        var width = calcEventColumnWidth_(self);
	        var left = 0;
	
	        var templateStr = '<div style="height:' + height + 'px">';
	        for (var i = 0; i < columnCount; i++) {
	            var cssName = 'gc-cell' + ' c' + i;
	            templateStr += buildHeadCellHTML_(left, width, height, cssName);
	            left += width;
	        }
	        templateStr += '</div>';
	
	        return templateStr;
	    }
	
	    function getRenderedDaysViewColumnHeaderInfo_() {
	        var self = this;
	        var options = self.options;
	        var startDate = options.startDate;
	        var columnCount = options.viewMode === VIEW_DAY ? 1 : 7;
	        var height = options.colHeaderHeight;
	        var width = calcEventColumnWidth_(self);
	        var left = 0;
	
	        var templateStr = '<div style="height:' + height + 'px">';
	        for (var i = 0; i < columnCount; i++) {
	
	            var formattedValue = getDaysColumnHeaderFormattedValue_.call(self, startDate);
	            var cssName = 'gc-column-header-cell' + ' c' + i;
	
	            templateStr += buildHeadCellHTML_(left, width, height, cssName, formattedValue);
	
	            left += width;
	            startDate = getDay_(startDate, 1);
	        }
	        templateStr += '</div>';
	
	        return templateStr;
	    }
	
	    function getRenderedDaysViewRowHeaderInfo_(date) {
	        var self = this;
	        var formattedValue = getDaysRowHeaderFormattedValue_.call(self, date);
	
	        return '<div class="gc-calendar-row-header-cell">' + formattedValue + '</div>';
	    }
	
	    function getDayEventRenderStyle_(groupInfo, itemIndex) {
	
	        //TODO: consider scroll offset
	        var self = this;
	        var group = groupInfo.data;
	        var eventTotalWidth = calcEventColumnWidth_(self);
	
	        var currentEvent = group.getItem(itemIndex);
	        var leftIntersetctCount = 0;
	        var totalIntersectCount = 0;
	        for (var i = 0; i < group.itemCount; i++) {
	            if (isEventIntersect_.call(self, currentEvent, group.getItem(i))) {
	                totalIntersectCount++;
	                if (i < itemIndex) {
	                    leftIntersetctCount++;
	                }
	            }
	        }
	
	        var eventWidth = Math.floor(eventTotalWidth / (totalIntersectCount === 0 ? 1 : totalIntersectCount));
	        var left = leftIntersetctCount * eventWidth;
	
	        return {
	            left: left,
	            top: getDaysEventTop_.call(self, currentEvent, itemIndex),
	            width: eventWidth,
	            height: getDaysEventHeight_.call(self, currentEvent),
	            position: 'absolute',
	            overflow: 'hidden'
	        };
	    }
	
	    function getDayEventLayoutCallBack(groupInfo, itemIndex) {
	        return {
	            style: {
	                position: 'absolute',
	                overflow: 'hidden'
	            },
	            location: {
	                left: 0,
	                top: 0
	            }
	        };
	    }
	
	    function getRenderedDaysViewEventInfo_() {
	        var self = this;
	        var baseLeftLine = 0;
	        var groupInfos = getCurrentViewGroups_.call(self);
	        var grid = self.grid;
	        var layoutEngine = grid.layoutEngine;
	        var options = self.options;
	        var eventTotalWidth = calcEventColumnWidth_(self);
	        var result = [];
	        var idPrefix = grid.uid + '-';
	        var index;
	        var len;
	        var group;
	        var containerSize;
	        var key;
	        var row;
	        self.cachedEventKeys_ = [];
	        _.each(groupInfos, function(groupInfo) {
	            var childHTML = '';
	            containerSize = {
	                height: groupInfo.height,
	                width: eventTotalWidth
	            };
	            group = groupInfo.data;
	            var rows = layoutEngine.getInnerGroupRenderInfo(groupInfo, containerSize, getDayEventLayoutCallBack.bind(self));
	
	            baseLeftLine = eventTotalWidth * getDaysSpan_(new Date(group.name), options.startDate);
	            for (index = 0, len = rows.length; index < len; index++) {
	                //transfer row key to the outer div
	                row = rows[index];
	                key = row.key;
	                row.key = null;
	                childHTML += ('<div id="' + key + '" class="day-event" style="' + gcUtils.createMarkupForStyles(getDayEventRenderStyle_.call(self, groupInfo, index)) + '">' + grid.renderRow_(row) + '</div>');
	            }
	            key = idPrefix + 'g' + groupInfo.path.join('_');
	            self.cachedEventKeys_.push({key: key});
	            result.push({
	                key: key,
	                renderInfo: {
	                    cssClass: 'day-event-container',
	                    style: {
	                        position: 'absolute',
	                        left: baseLeftLine,
	                        top: 0,
	                        width: eventTotalWidth,
	                        height: groupInfo.height,
	                        overflow: 'hidden'
	                    },
	                    renderedHTML: childHTML
	                }
	            });
	        });
	
	        return result;
	    }
	
	    function getDisplayDateTime_() {
	        var self = this;
	        var options = self.options;
	        var timeUnit = options.timeUnit * ONE_HOUR;
	        var startTime = options.startTime.getTime();
	        var endTime = options.endTime.getTime();
	        var displayTimes = [];
	        var time = startTime;
	
	        while (time < endTime) {
	            displayTimes.push(new Date(time));
	            time += timeUnit;
	        }
	
	        displayTimes.push(new Date(endTime));
	
	        return displayTimes;
	    }
	
	    function getRowInfoAt_(offset) {
	        var self = this;
	        var startPosition = 0;
	        var itemCount = self.cachedItemCount_;
	        var cachedRowOffset = self.cachedRowOffset_;
	        var offsetTop = offset.top;
	        var startIndex = 0;
	        var rowHeight = self.options.rowHeight;
	        var i;
	        var item;
	        if (cachedRowOffset) {
	            for (i = cachedRowOffset.length - 1; i >= 0; i--) {
	                item = cachedRowOffset[i];
	                if (item <= offsetTop) {
	                    startIndex = i * 100;
	                    offsetTop -= item;
	                    startPosition = item;
	                }
	            }
	        }
	
	        for (i = startIndex; i < itemCount; i++) {
	            if (offsetTop <= rowHeight) {
	                return {
	                    index: i,
	                    startPosition: startPosition
	                };
	            }
	            if (i % 100 === 0) {
	                self.cachedRowOffset_ = cachedRowOffset || [];
	                self.cachedRowOffset_[i / 100] = startPosition;
	            }
	            offsetTop -= rowHeight;
	            startPosition += rowHeight;
	        }
	
	        return null;
	
	    }
	
	    function isEventIntersect_(event1, event2) {
	        var self = this;
	        var options = self.options;
	        if (!options.eventStartField) {
	            return false;
	        }
	        if (!options.eventEndField) {
	            return false;
	        }
	
	        var event1Start = event1[options.eventStartField];
	        var event1End = event1[options.eventEndField];
	        var event2Start = event2[options.eventStartField];
	        var event2End = event2[options.eventEndField];
	
	        if (event1Start.getMonth() !== event2Start.getMonth()) {
	            return false;
	        }
	
	        if (event1End.getDate() !== event2End.getDate()) {
	            return false;
	        }
	
	        if (event1End.getTime() > event2Start.getTime() && (event2End.getTime() > event1Start.getTime())) {
	            return true;
	        }
	
	        return false;
	    }
	
	    function getDaysEventTop_(event, index) {
	        var self = this;
	        var options = self.options;
	        if (!options.eventStartField) {
	            return options.rowHeight * index;
	        }
	
	        var dayStartTime = options.startTime;
	        var eventStartTime = event[options.eventStartField];
	        var timeSpan = (eventStartTime.getHours() - dayStartTime.getHours()) + (eventStartTime.getMinutes() - dayStartTime.getMinutes()) / 60;
	
	        return options.rowHeight * timeSpan / self.options.timeUnit;
	    }
	
	    function getDaysEventHeight_(event) {
	        var self = this;
	        var options = self.options;
	        var timeSpan = self.options.timeUnit;
	        if (options.eventStartField && options.eventEndField) {
	            timeSpan = (event[options.eventEndField] - event[options.eventStartField]) / ONE_HOUR;
	        }
	
	        return (options.rowHeight * timeSpan) / self.options.timeUnit;
	    }
	
	    function getDaysSpan_(dateTime1, dateTime2) {
	        var date1 = new Date(dateTime1.getFullYear(), dateTime1.getMonth(), dateTime1.getDate());
	        var date2 = new Date(dateTime2.getFullYear(), dateTime2.getMonth(), dateTime2.getDate());
	
	        return Math.floor(Math.abs((date1 - date2) / ONE_DAY));
	    }
	
	    //endregion
	
	    //region MonthView
	    function getMonthHeaderLayoutInfo_() {
	        var scope = this;
	        var grid = scope.grid;
	        var containerRect = grid.getContainerInfo_().contentRect;
	
	        return {
	            top: 0,
	            left: 0,
	            width: containerRect.width,
	            height: scope.options.dateHeaderHeight
	        };
	    }
	
	    function getMonthCellsLayoutInfo_() {
	        var scope = this;
	        var grid = scope.grid;
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var dateHeaderHeight = scope.options.dateHeaderHeight;
	
	        return {
	            top: dateHeaderHeight,
	            left: 0,
	            width: containerRect.width,
	            height: containerRect.height - dateHeaderHeight
	        };
	    }
	
	    function getRenderedMonthViewInfo_(options, layoutInfo) {
	        var area = (options && options.area) || '';
	        if (!area) {
	            return null;
	        }
	        var includeRows = options.includeRows || true;
	        var currentLayoutInfo = layoutInfo[area];
	        var r;
	        var scope = this;
	        var height = currentLayoutInfo.height;
	        var width = currentLayoutInfo.width;
	
	        if (area === 'monthViewCells' || area === 'monthViewEvent') {
	            r = {
	                outerDivCssClass: 'gc-viewport',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height,
	                    width: width,
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    left: 0,
	                    top: 0,
	                    height: height,
	                    width: width
	                }
	            };
	            if (includeRows) {
	                r.renderedRows = area === 'monthViewCells' ? getRenderedMonthViewCellsInfo_.call(scope) : getRenderedMonthViewEventInfo_.call(scope);
	            }
	
	        } else if (area === 'monthViewHeader') {
	            r = {
	                outerDivCssClass: 'gc-columnHeader',
	                outerDivStyle: {
	                    position: POS_ABS,
	                    top: currentLayoutInfo.top,
	                    left: currentLayoutInfo.left,
	                    height: height,
	                    width: width,
	                    overflow: OVERFLOW_HIDDEN
	                },
	                innerDivStyle: {
	                    position: POS_REL,
	                    left: 0,
	                    top: 0,
	                    height: height,
	                    width: width
	                },
	                renderedRows: getRenderedMonthViewHeaderInfo_.call(scope)
	            };
	        }
	
	        return r;
	    }
	
	    function getRenderedMonthViewHeaderInfo_() {
	        var self = this;
	        var rowContext = {
	            layoutInfo: getCellLayoutInfo_.call(self, true),
	            rowcontentInfo: getMonthHeaderFormattedValue_.call(self)
	        };
	        var idPrefix = self.grid.uid + '-';
	
	        self.monthViewHeaderHTML_ = self.monthViewHeaderHTML_ ||
	            buildRowHTML_.call(self, true, rowContext);
	        return [
	            {
	                key: idPrefix + 'header',
	                renderInfo: {
	                    cssClass: 'gc-column-header',
	                    renderedHTML: self.monthViewHeaderHTML_
	                }
	            }
	        ];
	    }
	
	    function getRenderedMonthViewCellsInfo_() {
	        var self = this;
	        var offsetTop = 0;
	        var rows = [];
	        var rowContext = {};
	        var idPrefix = self.grid.uid + '-';
	        var layoutInfo = getCellLayoutInfo_.call(this, false);
	        var contentInfo = self.monthContentInfo_ || (self.monthContentInfo_ = getMonthCellContent_.call(this));
	
	        for (var i = 0; i < maxRowCount; i++) {
	            rowContext.layoutInfo = layoutInfo;
	            rowContext.rowcontentInfo = contentInfo.slice(i * maxColumnCount, i * maxColumnCount + maxColumnCount);
	
	            rows.push({
	                key: idPrefix + 'r' + i,
	                renderInfo: {
	                    index: 0,
	                    cssClass: 'gc-row r' + i + ' even',
	                    style: {
	                        top: offsetTop,
	                        height: layoutInfo.height
	                    },
	                    renderedHTML: buildRowHTML_.call(this, false, rowContext)
	                }
	
	            });
	            offsetTop += layoutInfo.height;
	        }
	
	        return rows;
	    }
	
	    /*jshint unused:false */
	    function getMonthEventLayoutCallBack(groupInfo, itemIndex) {
	        return {
	            cssClass: 'month-event',
	            style: {
	                position: 'absolute',
	                overflow: 'hidden'
	            }
	        };
	    }
	
	    function getRenderedMonthViewEventInfo_() {
	        var self = this;
	        var layoutInfo = getCellLayoutInfo_.call(self, false);
	        var startDate = self.monthViewStartDate_ || (self.monthViewStartDate_ = getMonthViewStartDate_.call(self));
	        var rowHeight = layoutInfo.height;
	        var columnWidth = layoutInfo.width;
	        var i;
	        var len;
	        var results = [];
	        var groupsInfos = getCurrentViewGroups_.call(self);
	        var idPrefix = self.grid.uid;
	        var grid = self.grid;
	        var layoutEngine = grid.layoutEngine;
	        var group;
	        var groupRenderInfo;
	
	        _.each(groupsInfos, function(groupInfo) {
	            group = groupInfo.data;
	            var eventDate = new Date(group.name);
	            var diffDays = Math.abs(eventDate - startDate) / ONE_DAY;
	            var left = (diffDays % maxColumnCount) * columnWidth;
	            var top = parseInt(diffDays / maxColumnCount) * rowHeight + self.options.dateHeaderHeight;
	
	            var childHTML = '';
	            var containserSize = {
	                width: columnWidth,
	                height: groupInfo.height
	            };
	            var rows = layoutEngine.getInnerGroupRenderInfo(groupInfo, containserSize, getMonthEventLayoutCallBack.bind(self));
	
	            //TODO: add group header/footer support
	            var maxViewItemCount = layoutEngine.getMaxVisibleItemCount(containserSize) - 1;
	            var moreRow;
	            var renderHTML;
	            var tempElement;
	            for (i = 0, len = rows.length; i < len; i++) {
	                if (maxViewItemCount === -1 || (i === maxViewItemCount && (i !== len - 1))) {
	                    moreRow = rows[i];
	                    moreRow.renderInfo = moreRow.renderInfo || {};
	                    renderHTML = moreRow.renderInfo.renderedHTML;
	                    if (!renderHTML) {
	                        renderHTML = '<div style="height:100%;"><a>' + '+' + (len - i) + ' more...' + '</a></div>';
	                    } else {
	                        tempElement = domUtil.createElement(renderHTML);
	                        tempElement.innerHTML = '<a>' + '+' + (len - i) + ' more...' + '</a>';
	                        renderHTML = tempElement.outerHTML;
	
	                    }
	                    moreRow.renderInfo.renderedHTML = renderHTML;
	                    childHTML += grid.renderRow_(moreRow);
	                    break;
	                }
	                childHTML += grid.renderRow_(rows[i]);
	            }
	            groupRenderInfo = {
	                key: idPrefix + '-g' + groupInfo.path.join('_'),
	                renderInfo: {
	                    cssClass: 'month-event-container',
	                    style: {
	                        position: 'absolute',
	                        left: left,
	                        top: top,
	                        width: columnWidth,
	                        height: groupInfo.height,
	                        overflow: 'hidden'
	                    },
	                    renderedHTML: childHTML
	                }
	            };
	            results.push(groupRenderInfo);
	        });
	
	        return results;
	    }
	
	    function buildRowHTML_(isMonthViewHeader, context) {
	        var left = 0;
	        var layoutInfo = context.layoutInfo;
	        var contentInfo = context.rowcontentInfo;
	        var height = layoutInfo.height;
	        var width = layoutInfo.width;
	
	        var templateStr = '<div style="height:' + height + 'px">';
	        var cssName = (isMonthViewHeader ? 'gc-calendar-column-header-cell' : 'gc-cell') + ' c';
	        var buildFn = isMonthViewHeader ? buildHeadCellHTML_ : buildContentCellHTML_;
	
	        for (var i = 0; i < maxColumnCount; i++) {
	            templateStr += buildFn(left, width, height, cssName + i, contentInfo[i]);
	            left += width;
	        }
	        templateStr += '</div>';
	
	        return templateStr;
	    }
	
	    function buildHeadCellHTML_(left, width, height, cssName, contentInfo) {
	        var value = contentInfo || '';
	        return '<div class = "gc-column" style="position:absolute;height:' + height + 'px; width:' + width + 'px;left:' + left + 'px;' +
	            '"><div style="height:100%;overflow:hidden;"><div style="height:100%;" class="' + cssName + '">' + value + '</div></div></div>';
	    }
	
	    function buildContentCellHTML_(left, width, height, cssName, contentInfo) {
	        var calendarCssName = 'gc-' + (contentInfo.isHeadingDay ? 'headingday' : (contentInfo.isTrailingDay ? 'trailingday' : 'day'));
	
	        var date = contentInfo.date.getDate();
	        var dateDiv = '<div class="' + calendarCssName + '"style = height:100%><span>' + date + '</span></div>';
	
	        return '<div class = "gc-column" style="position:absolute;height:' + height + 'px; width:' + width + 'px;left:' + left + 'px;' +
	            '"><div style="height:100%;overflow:hidden;"><div style="height:100%;" class="' + cssName + '">' + dateDiv + '</div></div></div>';
	    }
	
	    function getMonthViewStartDate_() {
	        var self = this;
	        var currentDate = self.options.startDate ? self.options.startDate : new Date();
	        var firstDateInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	        var weekDay = firstDateInCurrentMonth.getDay();
	        var headingDaysCount = weekDay === 0 ? maxColumnCount : weekDay;
	        return getDay_(firstDateInCurrentMonth, -1 * headingDaysCount);
	    }
	
	    function getMonthCellContent_() {
	        var self = this;
	        var currentDate = self.options.startDate ? self.options.startDate : new Date();
	        var firstDateInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	        var weekDay = firstDateInCurrentMonth.getDay();
	        var headingDaysCount = weekDay === 0 ? maxColumnCount : weekDay;
	        var daysCount = getMonthDaysCount_(firstDateInCurrentMonth);
	        var trailingDaysCount = maxRowCount * maxColumnCount - daysCount - headingDaysCount;
	
	        var datesInfo = [];
	        var tempDate;
	
	        for (var i = 0; i < headingDaysCount; i++) {
	            tempDate = getDay_(firstDateInCurrentMonth, i - headingDaysCount);
	            datesInfo.push(
	                {
	                    isHeadingDay: true,
	                    date: tempDate
	                }
	            );
	        }
	
	        tempDate = firstDateInCurrentMonth;
	        for (var day = 0; day < daysCount; day++) {
	            datesInfo.push({
	                date: tempDate
	            });
	            tempDate = getDay_(tempDate, 1);
	        }
	
	        for (var trailingDay = 0; trailingDay < trailingDaysCount; trailingDay++) {
	            datesInfo.push(
	                {
	                    isTrailingDay: true,
	                    date: tempDate
	                }
	            );
	            tempDate = getDay_(tempDate, 1);
	        }
	
	        return datesInfo;
	    }
	
	    function getMonthDaysCount_(date) {
	        var year = date.getFullYear();
	        var month = date.getMonth();
	
	        if (month === 11) {
	            year += 1;
	            month = 0;
	        } else {
	            month += 1;
	        }
	
	        return (new Date(year, month, 0)).getDate();
	    }
	
	    function getCellLayoutInfo_(isMonthViewHeader) {
	        var layoutEngine = this;
	        var area = isMonthViewHeader ? 'monthViewHeader' : 'monthViewCells';
	        var layoutInfo = layoutEngine.getLayoutInfo();
	        var currentLayoutInfo = layoutInfo[area];
	        var rowCount = isMonthViewHeader ? 1 : maxRowCount;
	
	        return {
	            width: Math.floor(currentLayoutInfo.width / maxColumnCount),
	            height: Math.floor(currentLayoutInfo.height / rowCount)
	        };
	    }
	
	    //endregion
	
	    //region Template related
	    function getTemplate_() {
	        var self = this;
	        var grid = self.grid;
	        if (self.cachedTmplFn_) {
	            return self.cachedTmplFn_;
	        }
	        var templateStr = getRawRowTemplate_.call(self);
	        var isMonthEvent = self.options.viewMode === 'Month';
	        var oldColTmpl;
	        var newColTmpl;
	        var cssName;
	        var tagName;
	        var colTmpl;
	
	        var element = domUtil.createTemplateElement(templateStr);
	        templateStr = domUtil.getElementInnerText(element);
	
	        var annotationCols = element.querySelectorAll('[data-column]');
	        _.each(annotationCols, function(annotationCol, index) {
	            var col = grid.getColById_(annotationCol.getAttribute('data-column'));
	            var colAnnotation;
	            if (col.isCalcColumn_) {
	                colAnnotation = '{{=it.' + col.id + '}}';
	            } else {
	                var dataFields = col.dataField ? col.dataField.split(',') : [];
	                if (dataFields.length === 1) {
	                    colAnnotation = '{{=it.' + col.dataField + '}}';
	                } else {
	                    var temp = [];
	                    _.each(dataFields, function(dataField) {
	                        temp.push(grid.getColById_(dataField).presenter || '{{=it.' + dataField + '}}');
	                    });
	                    colAnnotation = temp.join(' ');
	                }
	            }
	            colTmpl = annotationCol;
	            tagName = colTmpl.tagName;
	            oldColTmpl = domUtil.getElementOuterText(colTmpl);
	            cssName = (isMonthEvent ? 'gc-monthevent' : 'gc-daysevent') + ' c' + index;
	
	            newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                '<div style="height:100%;"><div style="height:100%;overflow:hidden;text-overflow: ellipsis;" class="' + cssName + '"' + '>' +
	                (col.presenter ? col.presenter : colAnnotation) +
	                '</div></div></' + tagName + '>';
	
	            //outerHTML returns double quotes in attribute sometimes
	            if (templateStr.indexOf(oldColTmpl) === -1) {
	                oldColTmpl = oldColTmpl.replace(/"/g, '\'');
	            }
	            templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	        });
	
	        element = null;
	        self.cachedTmplFn_ = doT.template(templateStr, null, null, true);
	        return self.cachedTmplFn_;
	    }
	
	    function getRawRowTemplate_() {
	        return getUserDefinedTemplate_.call(this) || getDefaultRawRowTemplate_.call(this);
	    }
	
	    function getDefaultRawRowTemplate_() {
	        var self = this;
	        return getEventTemplate_.call(self);
	    }
	
	    function getEventTemplate_() {
	        var self = this;
	        var cols = self.grid.columns;
	        var className = self.options.viewMode === 'Month' ? 'monthevent' : 'dayevent';
	
	        var r = '<div class=' + className + '>';
	        _.each(cols, function(col) {
	            if (col.visible) {
	                r += '<div class="gc-event-column" style="white-space:nowrap;" data-column="' + col.id + '"></div>';
	            }
	        });
	        r += '</div>';
	        return r;
	    }
	
	    function getUserDefinedTemplate_() {
	        var options = this.options;
	
	        if (options && options.rowTemplate) {
	            var rowTmpl = options.rowTemplate;
	            if (gcUtils.isString(rowTmpl) && rowTmpl.length > 1 && rowTmpl[0] === '#') {
	                var tmplElement = document.getElementById(rowTmpl.slice(1));
	                return tmplElement.innerHTML;
	            } else {
	                return rowTmpl;
	            }
	        }
	        return null;
	    }
	
	    //endregion
	
	    //region Group data
	    function getCurrentViewGroups_() {
	        var self = this;
	        var start;
	        var end;
	        var filterResult = [];
	        var options = self.options;
	        var date;
	        var startDate;
	        var year;
	        var month;
	        var displayingDays = options.viewMode === VIEW_DAY ? 1 : 7;
	        if (options.viewMode !== VIEW_MONTH) {
	            date = options.startDate;
	            start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	            end = getDay_(start, displayingDays - 1);
	        } else {
	            startDate = options.startDate;
	            year = startDate.getFullYear();
	            month = startDate.getMonth();
	
	            start = new Date(year, month, 1);
	            end = new Date(year, month, getMonthDaysCount_(startDate));
	        }
	        var group;
	        _.each(self.grid.groupInfos_, function(groupInfo) {
	            group = groupInfo.data;
	            var date = new Date(group.name);
	            if (date >= start && date <= end) {
	                filterResult.push(groupInfo);
	            }
	        });
	        return filterResult;
	    }
	
	    //endregion
	
	    //region FormatValue
	    function getMonthHeaderFormattedValue_() {
	        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	    }
	
	    function getDaysColumnHeaderFormattedValue_(date) {
	        var self = this;
	        if (self.options.columnHeaderFormatter) {
	            return self.options.columnHeaderFormatter.format(date);
	
	        } else {
	            return getDefaultDateFormattedValue_(date);
	        }
	    }
	
	    function getDaysRowHeaderFormattedValue_(time) {
	        var self = this;
	        if (self.options.rowHeaderFormatter) {
	            return self.options.rowHeaderFormatter.format(time);
	        } else {
	            return getDefaultTimeFormattedValue_(time);
	        }
	    }
	
	    function getDefaultTimeFormattedValue_(date) {
	        var hour = date.getHours();
	        var minutes = date.getMinutes();
	        return (hour >= 10 ? hour : '0' + hour) + ':' + (minutes >= 10 ? minutes : '0' + minutes);
	    }
	
	    function getDefaultDateFormattedValue_(date) {
	        var stringArry = date.toDateString().split(' ');
	        return stringArry.length === 4 ? stringArry[0] + ',' + stringArry[1] + ' ' + stringArry[2] : date.toLocaleDateString();
	    }
	
	    //endregion
	
	    //region Common method
	    function getDay_(currentDate, daysCount) {
	        var date = new Date(currentDate);
	        var timeSpan = ONE_DAY * daysCount;
	        date.setTime(date.getTime() + timeSpan);
	
	        return date;
	    }
	
	    function handleMouseClick_(sender, e) {
	        var grid = sender;
	        var groupStrategy = grid.layoutEngine.groupStrategy_;
	        var options = groupStrategy.options;
	        var hitInfo = groupStrategy.hitTest(e);
	        var groupInfo;
	        var popoverInfo;
	        var group;
	        if (hitInfo) {
	            popoverInfo = hitInfo.popoverInfo;
	            if (popoverInfo) {
	                if (popoverInfo.onCloseButton) {
	                    closePopover.call(groupStrategy);
	                } else {
	                    raiseEventClick(groupStrategy, popoverInfo.groupPath, popoverInfo.row);
	                }
	                return;
	            }
	            groupInfo = hitInfo.groupInfo;
	            if (groupInfo && groupInfo.action === 'eventLimit') {
	                groupInfo = grid.getGroupInfo_(groupInfo.path);
	                group = groupInfo.data;
	                var eventLimitArgs = {
	                    group: group,
	                    action: 'popover',
	                    cancel: false
	                };
	                groupStrategy.onEventLimitClick.raise(grid, eventLimitArgs);
	                if (eventLimitArgs && !eventLimitArgs.cancel) {
	                    var action = eventLimitArgs.action.toLowerCase();
	                    if (action === 'popover') {
	                        var parentElement = document.getElementById(grid.uid);
	                        var parentElementOffset = domUtil.offset(parentElement);
	                        var offset = domUtil.offset(document.getElementById(grid.uid + '-g' + groupInfo.path.join('_')));
	                        var offsetLeft = offset.left - parentElementOffset.left;
	                        var offsetTop = offset.top - groupStrategy.options.dateHeaderHeight - parentElementOffset.top;
	                        var excelFormatter = gcUtils.findPlugin('Formatter').ExcelFormatter;
	                        var dayFormatter = new excelFormatter('MMMM d');
	                        var header = dayFormatter.format(new Date(group.name));
	                        var dialogId = grid.uid + '-popover-dialog';
	                        var popupWidth = 300;
	                        var html = '<div id =' + dialogId + ' style = "' + 'position:absolute;' + 'top:' + offsetTop + 'px;left:' + offsetLeft + 'px;width:' + popupWidth + 'px;" class="popover-dialog">';
	                        //add header.
	                        html += '<div class = "popover-header"><span class="popover-header-text">' + header + '</span><div class="popover-close"><span class="gc-icon close-icon"></span></div></div>';
	                        html += '<div class = "popover-content" style="position:relative;width:' + popupWidth + 'px;overflow:auto;">';
	
	                        html += '</div>';
	                        var div = document.createElement('div');
	                        div.innerHTML = html;
	                        var r = div.children[0];
	                        div = null;
	                        parentElement.appendChild(r);
	
	                        var popoverElement = document.getElementById(dialogId);
	                        var contentElement = document.querySelector('#' + dialogId + ' .popover-content');
	                        contentElement.style.width = popoverElement.clientWidth + 'px';
	
	                        var style = domUtil.getStyle(contentElement);
	                        var contentWidth = contentElement.clientWidth - parseInt(style.getPropertyValue('padding-left')) - parseInt(style.getPropertyValue('padding-right'));
	                        var layoutEngine = grid.layoutEngine;
	                        var containerSize = {
	                            width: contentWidth,
	                            height: layoutEngine.getInnerGroupHeight(groupInfo, {width: contentWidth})
	                        };
	                        html = '';
	                        html = '<div class="group-content" style="position:relative;height:' + containerSize.height + 'px;">';
	                        var rows = layoutEngine.getInnerGroupRenderInfo(groupInfo, containerSize, getMonthEventLayoutCallBack.bind(groupStrategy));
	                        _.each(rows, function(row) {
	                            html += grid.renderRow_(row);
	                        });
	                        html += '</div>';
	                        contentElement.innerHTML = html;
	                        groupStrategy.popoverGroupInfo_ = groupInfo;
	                    } else if (action === 'day') {
	                        options.startDate = new Date(group.name);
	                        options.viewMode = VIEW_DAY;
	                        //groupStrategy.clearRenderCache_();
	
	                        grid.invalidate();
	
	                    } else if (action === 'week') {
	                        var date = new Date(group.name);
	                        options.startDate = getDay_(date, -1 * date.getDay());
	                        options.viewMode = VIEW_WEEK;
	                        //groupStrategy.clearRenderCache_();
	
	                        grid.invalidate();
	                    }
	                }
	            } else {
	                raiseEventClick(groupStrategy, groupInfo.path, groupInfo.row);
	            }
	        }
	    }
	
	    function calcEventColumnWidth_(self) {
	        if (self.cachedItemWidth_) {
	            return self.cachedItemWidth_;
	        }
	        var options = self.options;
	        var grid = self.grid;
	
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var containerHeight = containerRect.height - options.colHeaderHeight;
	        var contentHeight = Math.ceil((options.endTime.getTime() - options.startTime.getTime()) / (options.timeUnit * ONE_HOUR)) * options.rowHeight;
	        var width = containerRect.width - options.rowHeaderWidth - ((containerHeight < contentHeight) ? domUtil.getScrollbarSize().width : 0);
	        var viewMode = self.options.viewMode;
	        if (viewMode === VIEW_DAY) {
	            self.cachedItemWidth_ = width;
	        } else if (viewMode === VIEW_WEEK) {
	            self.cachedItemWidth_ = Math.floor(width / 7);
	        }
	        return self.cachedItemWidth_;
	    }
	
	    function handleMouseUp_(sender, e) {
	
	    }
	
	    function handleMouseDown_(sender, e) {
	        var grid = sender;
	        var groupStrategy = grid.layoutEngine.groupStrategy_;
	        var hitInfo = groupStrategy.hitTest(e);
	        var popoverInfo;
	        if (hitInfo) {
	            popoverInfo = hitInfo.popoverInfo;
	            if (!popoverInfo) {
	                closePopover.call(groupStrategy);
	            }
	        } else {
	            closePopover.call(groupStrategy);
	        }
	    }
	
	    function raiseEventClick(self, groupPath, itemIndex) {
	        if (itemIndex >= 0) {
	            var grid = self.grid;
	            var eventArgs = {
	                //data: grid.getGroupInfo_(groupPath).data.getItem(itemIndex)
	                data: grid.getGroupInfo_(groupPath).data.getItem(itemIndex)
	            };
	            self.onEventClick.raise(grid, eventArgs);
	        }
	    }
	
	    function closePopover() {
	        var self = this;
	        var grid = self.grid;
	        var popoverElement = document.getElementById(grid.uid + '-popover-dialog');
	        if (popoverElement) {
	            popoverElement.parentNode.removeChild(popoverElement);
	            self.popoverGroupInfo_ = null;
	            self.onPopoverClose.raise(grid);
	        }
	    }
	
	    function handleMouseWheel_(sender, e) {
	        var grid = sender;
	        var groupStrategy = grid.layoutEngine.groupStrategy_;
	        if (groupStrategy.options.viewMode !== 'Days') {
	            return;
	        }
	
	        //simulate scroll
	        var offsetDelta = e.deltaY;
	        if (offsetDelta !== 0) {
	            var layout = (groupStrategy.getLayoutInfo()).daysViewCells;
	            var maxOffsetTop = Math.max(layout.contentHeight + groupStrategy.options.colHeaderHeight - layout.height, 0);
	            var offsetTop = grid.scrollOffset.top;
	            var scrollTop;
	            if (offsetDelta > 0) {
	                if (offsetTop >= maxOffsetTop) {
	                    return;
	                } else {
	                    scrollTop = Math.min(offsetTop + offsetDelta, maxOffsetTop);
	                }
	            } else if (offsetDelta < 0) {
	                if (offsetTop === 0) {
	                    return;
	                } else {
	                    scrollTop = Math.max(offsetTop + offsetDelta, 0);
	                }
	            }
	
	            domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel').scrollTop = scrollTop;
	        }
	        e.preventDefault();
	    }
	
	    //endregion
	
	    module.exports = CalendarStrategy;
	}());


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


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
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
	
	    /*
	     * Represents an event handler (private class)
	     */
	    var EventHandler = (function() {
	        function EventHandler(handler, self) {
	            this.handler = handler;
	            this.self = self;
	        }
	
	        return EventHandler;
	    })();
	
	    /**
	     * Represents an event.
	     *
	     * Wijmo events are similar to .NET events. Any class may define events by
	     * declaring them as fields. Any class may subscribe to events using the
	     * event's @see:addHandler method, or unsubscribe using the @see:removeHandler
	     * method.
	     *
	     * Wijmo event handlers take two parameters: <i>sender</i> and <i>args</i>.
	     * The first is the object that raised the event, and the second is an object
	     * that contains the the event parameters.
	     *
	     * Classes that define events follow the .NET pattern where for every event
	     * there is an <i>on[EVENTNAME]</i> method that raises the event. This pattern
	     * allows derived classes to override the <i>on[EVENTNAME]</i> method and
	     * handle the event before and/or after the base class raises the event.
	     * Derived classes may even suppress the event by not calling the base class
	     * implementation.
	     *
	     * For example, the TypeScript code below overrides the <b>onValueChanged</b>
	     * event for a control to perform some processing before and after the
	     * <b>valueChanged</b> event fires:
	     * <pre>
	     *   // override base class
	     *   onValueChanged(e: EventArgs) {
	    *   // execute some code before the event fires
	    *   console.log('about to fire valueChanged');
	    *   // optionally, call base class to fire the event
	    *   super.onValueChanged(e);
	    *   // execute some code after the event fired
	    *   console.log('valueChanged event just fired');
	    * }
	     * </pre>
	     */
	    var Event = (function() {
	        function Event() {
	            this._handlers = [];
	        }
	
	        /**
	         * Adds a handler to this event.
	         *
	         * @param handler Function invoked when the event is raised.
	         * @param self Object that defines the event handler
	         * (accessible as 'this' from the handler code).
	         */
	        Event.prototype.addHandler = function(handler, self) {
	            this._handlers.push(new EventHandler(handler, self));
	        };
	
	        /**
	         * Removes a handler from this event.
	         *
	         * @param handler Function invoked when the event is raised.
	         * @param self Object that defines the event handler (accessible as 'this' from the handler code).
	         */
	        Event.prototype.removeHandler = function(handler, self) {
	            for (var i = 0; i < this._handlers.length; i++) {
	                var l = this._handlers[i];
	                if (l.handler === handler && l.self === self) {
	                    this._handlers.splice(i, 1);
	                    break;
	                }
	            }
	        };
	
	        /**
	         * Removes all handlers associated with this event.
	         */
	        Event.prototype.removeAllHandlers = function() {
	            this._handlers.length = 0;
	        };
	
	        /**
	         * Raises this event, causing all associated handlers to be invoked.
	         *
	         * @param sender Source object.
	         * @param args Event parameters.
	         */
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
	    /**
	     * Base class for event arguments.
	     */
	    var EventArgs = (function() {
	        function EventArgs() {
	        }
	
	        EventArgs.empty = new EventArgs();
	        return EventArgs;
	    })();
	
	    /**
	     * Provides arguments for cancellable events.
	     */
	    var CancelEventArgs = (function(_super) {
	        /*jshint -W004 */
	        __extends(CancelEventArgs, _super);
	        function CancelEventArgs() {
	            _super.apply(this, arguments);
	            /**
	             * Gets or sets a value that indicates whether the event should be canceled.
	             */
	            this.cancel = false;
	        }
	
	        return CancelEventArgs;
	    })(EventArgs);
	
	    /**
	     * Provides arguments for property change events.
	     */
	    var PropertyChangedEventArgs = (function(_super) {
	        /*jshint -W004 */
	        __extends(PropertyChangedEventArgs, _super);
	        /**
	         * Initializes a new instance of a @see:PropertyChangedEventArgs.
	         *
	         * @param propertyName The name of the property whose value changed.
	         * @param oldValue The old value of the property.
	         * @param newValue The new value of the property.
	         */
	        function PropertyChangedEventArgs(propertyName, oldValue, newValue) {
	            _super.call(this);
	            this._name = propertyName;
	            this._oldVal = oldValue;
	            this._newVal = newValue;
	        }
	
	        Object.defineProperty(PropertyChangedEventArgs.prototype, 'propertyName', {
	            /**
	             * Gets the name of the property whose value changed.
	             */
	            get: function() {
	                return this._name;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        Object.defineProperty(PropertyChangedEventArgs.prototype, 'oldValue', {
	            /**
	             * Gets the old value of the property.
	             */
	            get: function() {
	                return this._oldVal;
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        Object.defineProperty(PropertyChangedEventArgs.prototype, 'newValue', {
	            /**
	             * Gets the new value of the property.
	             */
	            get: function() {
	                return this._newVal;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return PropertyChangedEventArgs;
	    })(EventArgs);
	
	    module.exports = {
	        Event: Event,
	        EventHandler: EventHandler,
	        EventArgs: EventArgs,
	        CancelEventArgs: CancelEventArgs,
	        PropertyChangedEventArgs: PropertyChangedEventArgs
	    };
	}());


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKioiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDVjNDg3Mzk4NDE2NDE5MGE0ZThlPzEwYmMqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9ncm91cFN0cmF0ZWdpZXMvQ2FsZW5kYXJTdHJhdGVneS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanM/YzgyZCoqKiIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2RvVC5qcz80OTI4KioqIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvZG9tVXRpbC5qcz9kMGNkKioqIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvZXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyw2REFBNkQsaUZBQWlGLHVHQUF1RztBQUNoUyxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdDQUF1QztBQUN2QyxnREFBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQixjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF3RCxTQUFTO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXdELFNBQVM7QUFDakU7QUFDQTtBQUNBO0FBQ0EseUVBQXdFLFVBQVU7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFnRCxTQUFTO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsNENBQTJDLHFCQUFxQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBZ0QsUUFBUTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE0QixlQUFlO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQix5Q0FBd0MsS0FBSyxXQUFXLFVBQVU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QjtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQSx3Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEM7QUFDMUMsa0JBQWlCO0FBQ2pCLHNDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1FQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGlEQUFnRDtBQUNoRCxtREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsZUFBZTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RCxVQUFTO0FBQ1Q7O0FBRUEsdUVBQXNFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUM3ekJEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QixFQUFFLFlBQVksTUFBTSxFQUFFO0FBQy9DLDZCQUE0QixFQUFFLGFBQWEsRUFBRTtBQUM3Qyx3QkFBdUIsRUFBRSxhQUFhLEVBQUU7QUFDeEMscUJBQW9CLEVBQUUsYUFBYSxFQUFFO0FBQ3JDLHNIQUFxSCxJQUFJLElBQUk7QUFDN0gsd0JBQXVCLEVBQUUscUNBQXFDLEVBQUU7QUFDaEU7QUFDQSw2QkFBNEIsRUFBRSx5QkFBeUIsRUFBRTtBQUN6RCx5QkFBd0IsRUFBRSxTQUFTLEVBQUUscURBQXFELEVBQUU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLGdDQUErQixXQUFXLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxFQUFFO0FBQ2xILHNFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCwwQkFBeUIsWUFBWTtBQUNyQyxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQix1REFBdUQ7QUFDeEUsaUJBQWdCLFVBQVUsaUJBQWlCLHlCQUF5QjtBQUNwRSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QztBQUN6QywwQkFBeUI7QUFDekI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1RUFBc0U7O0FBRXRFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsaUNBQWdDLGdDQUFnQyxjQUFjLEtBQUs7QUFDbkYsZ0NBQStCLDJCQUEyQixjQUFjO0FBQ3hFLGNBQWE7QUFDYjtBQUNBLDBDQUF5QyxFQUFFO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixtQ0FBbUMsbUJBQW1CLHVFQUF1RSxpQ0FBaUM7QUFDekwsaUVBQWdFO0FBQ2hFLGNBQWE7QUFDYjtBQUNBLDJCQUEwQjtBQUMxQixjQUFhO0FBQ2IsY0FBYSxXQUFXO0FBQ3hCO0FBQ0EsNEJBQTJCLEdBQUcsS0FBSyxVQUFVO0FBQzdDLDBCQUF5QixHQUFHLEtBQUs7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLDRGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7QUFFRDs7Ozs7OztBQ3pLQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsNEJBQTRCLE9BQU8sd0NBQXdDLE1BQU07QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdEQUErQyxzQkFBc0Isc0JBQXNCO0FBQzNGOztBQUVBO0FBQ0EsZ0RBQStDLHNCQUFzQixzQkFBc0I7QUFDM0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxRQUFRO0FBQ3ZCLGlCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQSw0QkFBMkIsR0FBRztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0VBQXVFLGNBQWMsZUFBZSxhQUFhLGNBQWMsaUJBQWlCO0FBQ2hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7O0FDNVJEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLDJCQUEyQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJDYWxlbmRhclN0cmF0ZWd5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkdjU3ByZWFkXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXVtcIkNhbGVuZGFyU3RyYXRlZ3lcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA1YzQ4NzM5ODQxNjQxOTBhNGU4ZVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvL3JlZ2lvbiBGaWVsZFxuICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi4vZ2NVdGlscycpO1xuICAgIHZhciBkb1QgPSByZXF1aXJlKCcuLi9kb1QuanMnKTtcbiAgICB2YXIgZG9tVXRpbCA9IHJlcXVpcmUoJy4uL2RvbVV0aWwnKTtcbiAgICB2YXIgRXZlbnQgPSByZXF1aXJlKCcuLi9ldmVudCcpLkV2ZW50O1xuICAgIHZhciBWSUVXX01PTlRIID0gJ01vbnRoJztcbiAgICB2YXIgVklFV19EQVkgPSAnRGF5JztcbiAgICB2YXIgVklFV19XRUVLID0gJ1dlZWsnO1xuICAgIHZhciBQT1NfQUJTID0gJ2Fic29sdXRlJztcbiAgICB2YXIgUE9TX1JFTCA9ICdyZWxhdGl2ZSc7XG4gICAgdmFyIE9WRVJGTE9XX0hJRERFTiA9ICdoaWRkZW4nO1xuICAgIHZhciBPVkVSRkxPV19BVVRPID0gJ2F1dG8nO1xuICAgIHZhciBPTkVfREFZID0gMjQgKiAxMDAwICogNjAgKiA2MDtcbiAgICB2YXIgT05FX0hPVVIgPSAxMDAwICogNjAgKiA2MDtcbiAgICB2YXIgbWF4Q29sdW1uQ291bnQgPSA3O1xuICAgIHZhciBtYXhSb3dDb3VudCA9IDY7XG4gICAgLy9lbmRyZWdpb25cblxuICAgIC8vcmVnaW9uIENvbnN0cnVjdG9yXG4gICAgdmFyIENhbGVuZGFyU3RyYXRlZ3kgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5uYW1lID0gJ0NhbGVuZGFyU3RyYXRlZ3knOyAvL25hbWUgbXVzdCBlbmQgd2l0aCBMYXlvdXRFbmdpbmVcbiAgICAgICAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBzZWxmLmdldERlZmF1bHRPcHRpb25zKCkpO1xuICAgICAgICBzZWxmLmxheW91dEluZm9fID0gbnVsbDtcbiAgICAgICAgc2VsZi5vbkV2ZW50TGltaXRDbGljayA9IG5ldyBFdmVudCgpO1xuICAgICAgICBzZWxmLm9uRXZlbnRDbGljayA9IG5ldyBFdmVudCgpO1xuICAgICAgICBzZWxmLm9uUG9wb3ZlckNsb3NlID0gbmV3IEV2ZW50KCk7XG4gICAgfTtcbiAgICAvL2VuZHJlZ2lvblxuXG4gICAgLy9yZWdpb24gUHJvdG90eXBlXG4gICAgQ2FsZW5kYXJTdHJhdGVneS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGdyaWQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuZ3JpZCA9IGdyaWQ7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VXaGVlbC5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlV2hlZWxfKTtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZURvd24uYWRkSGFuZGxlcihoYW5kbGVNb3VzZURvd25fKTtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZVVwLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VVcF8pO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlQ2xpY2suYWRkSGFuZGxlcihoYW5kbGVNb3VzZUNsaWNrXyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RGVmYXVsdE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBkZWZhdWx0U3RhcnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBkZWZhdWx0U3RhcnREYXRlLmdldE1vbnRoKCk7XG4gICAgICAgICAgICB2YXIgZGF5ID0gZGVmYXVsdFN0YXJ0RGF0ZS5nZXREYXRlKCk7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdFN0YXJ0VGltZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXksIDAsIDAsIDApO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRFbmRUaW1lID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGRheSwgMjQsIDAsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2aWV3TW9kZTogVklFV19NT05USCxcbiAgICAgICAgICAgICAgICBzdGFydERhdGU6IGRlZmF1bHRTdGFydERhdGUsXG4gICAgICAgICAgICAgICAgLy9kaXNwbGF5aW5nRGF5czogNywgICAgICAvL2NvbW1pdCBpbiB2MVxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogZGVmYXVsdFN0YXJ0VGltZSwgLy9zdGFydCB0aW1lIG9mIGEgZGF5LlxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IGRlZmF1bHRFbmRUaW1lLCAgLy9lbmQgdGltZSBvZiBhIGRheS5cbiAgICAgICAgICAgICAgICB0aW1lVW5pdDogMSxcbiAgICAgICAgICAgICAgICByb3dIZWFkZXJXaWR0aDogNjAsXG4gICAgICAgICAgICAgICAgY29sSGVhZGVySGVpZ2h0OiAyNSxcbiAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIC8vY29sV2lkdGg6IDE1MCxcbiAgICAgICAgICAgICAgICBkYXRlSGVhZGVySGVpZ2h0OiAyNSxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGF5b3V0SW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnZpZXdNb2RlID09PSBWSUVXX01PTlRIKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubGF5b3V0SW5mb18gfHwgKHNlbGYubGF5b3V0SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aFZpZXdIZWFkZXI6IGdldE1vbnRoSGVhZGVyTGF5b3V0SW5mb18uY2FsbCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoVmlld0NlbGxzOiBnZXRNb250aENlbGxzTGF5b3V0SW5mb18uY2FsbCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoVmlld0V2ZW50OiBnZXRNb250aENlbGxzTGF5b3V0SW5mb18uY2FsbCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubGF5b3V0SW5mb18gfHwgKHNlbGYubGF5b3V0SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlzVmlld0NlbGxzOiBnZXREYXlzQ2VsbHNMYXlvdXRJbmZvXy5jYWxsKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5c1ZpZXdDb2x1bW5IZWFkZXI6IGdldERheXNDb2x1bW5IZWFkZXJMYXlvdXRJbmZvXy5jYWxsKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5c1ZpZXdSb3dIZWFkZXI6IGdldERheXNSb3dIZWFkZXJMYXlvdXRJbmZvXy5jYWxsKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5c1ZpZXdDb3JuZXI6IGdldERheXNDb3JuZXJMYXlvdXRJbmZvXy5jYWxsKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5c1ZpZXdFdmVudDogZ2V0RGF5c0NlbGxzTGF5b3V0SW5mb18uY2FsbCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiBnZXREYXlzQ2VsbHNMYXlvdXRJbmZvXy5jYWxsKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlbmRlclJvd0luZm9fOiBmdW5jdGlvbihyb3csIGFyZWEpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdWlkID0gc2NvcGUuZ3JpZC51aWQgKyAnLSc7XG5cbiAgICAgICAgICAgIGlmIChhcmVhID09PSAnZGF5c1ZpZXdDZWxscycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUm93UmVuZGVySW5mby5jYWxsKHNjb3BlLCByb3cuaW5kZXgsIHJvdy5oZWlnaHQsIHVpZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09ICdkYXlzVmlld1Jvd0hlYWRlcicpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlzcGxheURhdGVUaW1lID0gc2NvcGUuZGlzcGxheURhdGVUaW1lXyB8fCBnZXREaXNwbGF5RGF0ZVRpbWVfLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHJvd0hlYWRlcldpZHRoID0gc2NvcGUub3B0aW9ucy5yb3dIZWFkZXJXaWR0aDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVSb3dIZWFkZXJDZWxsSW5mby5jYWxsKHNjb3BlLCByb3cuaW5kZXgsIHJvdy5oZWlnaHQsIHJvd0hlYWRlcldpZHRoLCB1aWQsIGRpc3BsYXlEYXRlVGltZVtyb3cuaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJSYW5nZV86IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IChvcHRpb25zICYmIG9wdGlvbnMuYXJlYSkgfHwgJyc7XG4gICAgICAgICAgICBpZiAoIWFyZWEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGdldFJvd3NSZW5kZXJJbmZvLmNhbGwoc2NvcGUsIGFyZWEsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlbmRlckluZm86IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHRoaXMuZ2V0TGF5b3V0SW5mbygpO1xuXG4gICAgICAgICAgICB2YXIgciA9IHNjb3BlLm9wdGlvbnMudmlld01vZGUgIT09IFZJRVdfTU9OVEggPyBnZXRSZW5kZXJlZERheXNWaWV3SW5mb18uY2FsbCh0aGlzLCBvcHRpb25zLCBsYXlvdXRJbmZvKSA6XG4gICAgICAgICAgICAgICAgZ2V0UmVuZGVyZWRNb250aFZpZXdJbmZvXy5jYWxsKHRoaXMsIG9wdGlvbnMsIGxheW91dEluZm8pO1xuXG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSb3dUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0VGVtcGxhdGVfLmNhbGwodGhpcywgZmFsc2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dTY3JvbGxQYW5lbDogZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgaWYgKGFyZWEgPT09ICdkYXlzVmlld0NlbGxzJykge1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gdGhpcy5nZXRMYXlvdXRJbmZvKClbYXJlYV07XG4gICAgICAgICAgICAgICAgaWYgKGxheW91dEluZm8uaGVpZ2h0IDwgbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0IHx8IGxheW91dEluZm8ud2lkdGggPCBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTY3JvbGxhYmxlQXJlYV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNjcm9sbFBhbmVsUmVuZGVySW5mbzogZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgaWYgKGFyZWEgPT09ICdkYXlzVmlld0NlbGxzJykge1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXQgPSB0aGlzLmdldExheW91dEluZm8oKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uSGVhZGVyTGF5b3V0SW5mbyA9IGxheW91dC5kYXlzVmlld0NvbHVtbkhlYWRlcjtcbiAgICAgICAgICAgICAgICB2YXIgcm93SGVhZGVyTGF5b3V0SW5mbyA9IGxheW91dC5kYXlzVmlld1Jvd0hlYWRlcjtcbiAgICAgICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBsYXlvdXQuZGF5c1ZpZXdDZWxscztcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwgc2Nyb2xsLXRvcCBzY3JvbGwtbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnRMYXlvdXQuaGVpZ2h0ICsgY29sdW1uSGVhZGVyTGF5b3V0SW5mby5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQud2lkdGggKyByb3dIZWFkZXJMYXlvdXRJbmZvLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0FVVE9cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRIZWlnaHQgKyBjb2x1bW5IZWFkZXJMYXlvdXRJbmZvLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC5jb250ZW50V2lkdGggKyByb3dIZWFkZXJMYXlvdXRJbmZvLndpZHRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVNjcm9sbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMudmlld01vZGUgPT09IFZJRVdfTU9OVEgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oJ2RheXNWaWV3Q2VsbHMnLCBmYWxzZSk7XG4gICAgICAgICAgICBncmlkLnNjcm9sbFJlbmRlclBhcnRfKCdkYXlzVmlld0NvbHVtbkhlYWRlcicsIGZhbHNlKTtcbiAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oJ2RheXNWaWV3Um93SGVhZGVyJywgZmFsc2UpO1xuICAgICAgICAgICAgZ3JpZC5zY3JvbGxSZW5kZXJQYXJ0XygnZGF5c1ZpZXdFdmVudCcsIGZhbHNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoaXRUZXN0OiBmdW5jdGlvbihldmVudEFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSBldmVudEFyZ3MucGFnZVg7XG4gICAgICAgICAgICB2YXIgdG9wID0gZXZlbnRBcmdzLnBhZ2VZO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgbGF5b3V0ID0gc2VsZi5nZXRMYXlvdXRJbmZvKCk7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVySW5mbyA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gbGVmdCAtIGNvbnRhaW5lckluZm8ubGVmdDtcbiAgICAgICAgICAgIHZhciBvZmZzZXRUb3AgPSB0b3AgLSBjb250YWluZXJJbmZvLnRvcDtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGNvbHVtbkhlYWRlckxheW91dDtcbiAgICAgICAgICAgIHZhciBncm91cEluZm9zO1xuICAgICAgICAgICAgdmFyIGdyb3VwSW5mbztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnZpZXdNb2RlID09PSBWSUVXX01PTlRIKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vbnRoRXZlbnRMYXlvdXQgPSBsYXlvdXQubW9udGhWaWV3RXZlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zXyhtb250aEV2ZW50TGF5b3V0LCBwb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVhZGVyTGF5b3V0ID0gbGF5b3V0Lm1vbnRoVmlld0hlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IGNvbHVtbkhlYWRlckxheW91dC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MgPSBncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdyb3VwSW5mb3MgfHwgZ3JvdXBJbmZvcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSBncmlkLmxheW91dEVuZ2luZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctJyArICdtb250aFZpZXdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGl0VGVzdEluZm87XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3BvdmVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkICsgJy1wb3BvdmVyLWRpYWxvZycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9wb3ZlckVsZW1lbnQgJiYgcG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBwb3BvdmVyRWxlbWVudCwgZXZlbnRQYW5lbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIGdyaWQudWlkICsgJy1wb3BvdmVyLWRpYWxvZycgKyAnIC5ncm91cC1jb250ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wQ29udGVudE9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGdyb3VwQ29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGl0SW5mbyA9IGdyaWQubGF5b3V0RW5naW5lLmhpdFRlc3RHcm91cENvbnRlbnRfKHNlbGYucG9wb3Zlckdyb3VwSW5mb18sICd2aWV3cG9ydCcsIGxlZnQgLSBwb3BDb250ZW50T2Zmc2V0LmxlZnQsIHRvcCAtIHBvcENvbnRlbnRPZmZzZXQudG9wLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGdyb3VwQ29udGVudC5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGdyb3VwQ29udGVudC5jbGllbnRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ3ZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wb3ZlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZUJ1dHRvbjogZmFsc2UgLy9UT0RPOiBuZWVkIGdyb3VwIGl0ZW0gaGl0IHRlc3QgaGVyZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpdEluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mby5wb3BvdmVySW5mby5ncm91cFBhdGggPSBzZWxmLnBvcG92ZXJHcm91cEluZm9fLnBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8ucG9wb3ZlckluZm8ucm93ID0gaGl0SW5mby5ncm91cEluZm8ucm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcENsb3NlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgZ3JpZC51aWQgKyAnLXBvcG92ZXItZGlhbG9nJyArICcgLnBvcG92ZXItY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3BDbG9zZUVsZW1lbnQgJiYgcG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBwb3BDbG9zZUVsZW1lbnQsIGV2ZW50UGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8ucG9wb3ZlckluZm8ub25DbG9zZUJ1dHRvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEluZm87XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lck9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBnZXRDZWxsTGF5b3V0SW5mb18uY2FsbChzZWxmLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwSW5mb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyb3VwSW5mb3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJTaXplID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBsYXlvdXRJbmZvLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogZ3JvdXBJbmZvLmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLWcnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudENvbnRhaW5lciAmJiBwb2ludEluXyhvZmZzZXRMZWZ0LCBvZmZzZXRUb3AsIGV2ZW50Q29udGFpbmVyLCBldmVudFBhbmVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGV2ZW50Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mbyA9IGxheW91dEVuZ2luZS5oaXRUZXN0R3JvdXBDb250ZW50Xyhncm91cEluZm8sICd2aWV3cG9ydCcsIGxlZnQgLSBjb250YWluZXJPZmZzZXQubGVmdCwgdG9wIC0gY29udGFpbmVyT2Zmc2V0LnRvcCwgY29udGFpbmVyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoaXRUZXN0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ3ZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ2V2ZW50Q29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhSb3dDb3VudCA9IGxheW91dEVuZ2luZS5nZXRNYXhWaXNpYmxlSXRlbUNvdW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGdldENlbGxMYXlvdXRJbmZvXy5jYWxsKHNlbGYsIGZhbHNlKS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBncm91cEluZm8uaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZm8gPSBoaXRUZXN0SW5mby5ncm91cEluZm87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8gJiYgKChtYXhSb3dDb3VudCA9PT0gMCAmJiBpbmZvLnJvdyA9PT0gMCkgfHwgaW5mby5yb3cgPT09IChtYXhSb3dDb3VudCAtIDEpKSAmJiBtYXhSb3dDb3VudCA8IGdyb3VwLml0ZW1Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmFjdGlvbiA9ICdldmVudExpbWl0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5yb3cgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF5c0V2ZW50TGF5b3V0ID0gbGF5b3V0LmRheXNWaWV3RXZlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zXyhkYXlzRXZlbnRMYXlvdXQsIHBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93SGVhZGVyTGF5b3V0ID0gbGF5b3V0LmRheXNWaWV3Um93SGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWFkZXJMYXlvdXQgPSBsYXlvdXQuZGF5c1ZpZXdDb2x1bW5IZWFkZXI7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgLT0gcm93SGVhZGVyTGF5b3V0LndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3AgLT0gY29sdW1uSGVhZGVyTGF5b3V0LmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheUV2ZW50UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctJyArICdkYXlzVmlld0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MgPSBnZXRDdXJyZW50Vmlld0dyb3Vwc18uY2FsbChzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGo7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW4yO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JvdXBJbmZvc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctZycgKyBncm91cEluZm8ucGF0aC5qb2luKCdfJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50SW5fKG9mZnNldExlZnQsIG9mZnNldFRvcCwgZWxlbWVudCwgZGF5RXZlbnRQYW5lbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBsZW4yID0gZ3JvdXBJbmZvLmRhdGEuaXRlbUNvdW50OyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctZ3InICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpICsgJy1yJyArIGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBlbGVtZW50LCBkYXlFdmVudFBhbmVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiAndmlld3BvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ2V2ZW50Q29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogalxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZVdoZWVsLnJlbW92ZUhhbmRsZXIoaGFuZGxlTW91c2VXaGVlbF8pO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlRG93bi5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlRG93bl8pO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlVXAucmVtb3ZlSGFuZGxlcihoYW5kbGVNb3VzZVVwXyk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VDbGljay5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2tfKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhclJlbmRlckNhY2hlXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLmxheW91dEluZm9fID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuY2FjaGVkSXRlbVdpZHRoXyA9IG51bGw7XG4gICAgICAgICAgICBpZiAoc2VsZi5tb250aFZpZXdIZWFkZXJIVE1MXykge1xuICAgICAgICAgICAgICAgIHNlbGYubW9udGhWaWV3SGVhZGVySFRNTF8gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5tb250aENvbnRlbnRJbmZvXykge1xuICAgICAgICAgICAgICAgIHNlbGYubW9udGhDb250ZW50SW5mb18gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5jYWNoZWRUbXBsRm5fKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jYWNoZWRUbXBsRm5fID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuY2FjaGVkSXRlbUNvdW50Xykge1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkSXRlbUNvdW50XyA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmRpc3BsYXlEYXRlVGltZV8pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRpc3BsYXlEYXRlVGltZV8gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5jYWNoZWRSb3dPZmZzZXRfKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jYWNoZWRSb3dPZmZzZXRfID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuY2FjaGVkRXZlbnRLZXlzXykge1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkRXZlbnRLZXlzXyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEdyb3VwSW5mb3NIZWlnaHRfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncm91cEluZm9zID0gc2VsZi5ncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IChzZWxmLm9wdGlvbnMudmlld01vZGUgIT09IFZJRVdfTU9OVEgpID8gZ2V0RGF5c0NlbGxzTGF5b3V0SW5mb18uY2FsbChzZWxmKS5jb250ZW50SGVpZ2h0IDogKGdldENlbGxMYXlvdXRJbmZvXy5jYWxsKHNlbGYsIGZhbHNlKS5oZWlnaHQgLSBzZWxmLm9wdGlvbnMuZGF0ZUhlYWRlckhlaWdodCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cEluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvc1tpXS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vZW5kcmVnaW9uXG5cbiAgICBmdW5jdGlvbiBjb250YWluc18obGF5b3V0SW5mbywgcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50LmxlZnQgPj0gbGF5b3V0SW5mby5sZWZ0ICYmIHBvaW50LnRvcCA+PSBsYXlvdXRJbmZvLnRvcCAmJiBwb2ludC5sZWZ0IDw9IChsYXlvdXRJbmZvLmxlZnQgKyBsYXlvdXRJbmZvLndpZHRoKSAmJiBwb2ludC50b3AgPD0gKGxheW91dEluZm8udG9wICsgbGF5b3V0SW5mby5oZWlnaHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvaW50SW5fKG9mZnNldExlZnQsIG9mZnNldFRvcCwgZWxlbWVudCwgcmVsYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIHZhciBlbGVPZmZzZXQgPSBkb21VdGlsLm9mZnNldChlbGVtZW50KTtcbiAgICAgICAgdmFyIHRhcmdldEVsZU9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KHJlbGF0aXZlRWxlbWVudCk7XG4gICAgICAgIHZhciBsZWZ0ID0gZWxlT2Zmc2V0LmxlZnQgLSB0YXJnZXRFbGVPZmZzZXQubGVmdDtcbiAgICAgICAgdmFyIHRvcCA9IGVsZU9mZnNldC50b3AgLSB0YXJnZXRFbGVPZmZzZXQudG9wO1xuXG4gICAgICAgIGlmIChvZmZzZXRMZWZ0ID49IGxlZnQgJiYgb2Zmc2V0TGVmdCA8PSAobGVmdCArIGVsZW1lbnQuY2xpZW50V2lkdGgpICYmXG4gICAgICAgICAgICBvZmZzZXRUb3AgPj0gdG9wICYmIG9mZnNldFRvcCA8PSAodG9wICsgZWxlbWVudC5jbGllbnRIZWlnaHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9yZWdpb24gRGF5c1ZpZXdcbiAgICBmdW5jdGlvbiBnZXREYXlzQ29sdW1uSGVhZGVyTGF5b3V0SW5mb18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHZpZXdQb3J0TGF5b3V0ID0gZ2V0RGF5c0NlbGxzTGF5b3V0SW5mb18uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IHZpZXdQb3J0TGF5b3V0LmxlZnQsXG4gICAgICAgICAgICB3aWR0aDogdmlld1BvcnRMYXlvdXQud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9wdGlvbnMuY29sSGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgY29udGVudFdpZHRoOiB2aWV3UG9ydExheW91dC5jb250ZW50V2lkdGgsXG4gICAgICAgICAgICBjb250ZW50SGVpZ2h0OiBvcHRpb25zLmNvbEhlYWRlckhlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNSb3dIZWFkZXJMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdmlld1BvcnRMYXlvdXQgPSBnZXREYXlzQ2VsbHNMYXlvdXRJbmZvXy5jYWxsKHNlbGYpO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBvcHRpb25zLmNvbEhlYWRlckhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdmlld1BvcnRMYXlvdXQuaGVpZ2h0LFxuICAgICAgICAgICAgY29udGVudFdpZHRoOiBvcHRpb25zLnJvd0hlYWRlcldpZHRoLFxuICAgICAgICAgICAgY29udGVudEhlaWdodDogdmlld1BvcnRMYXlvdXQuY29udGVudEhlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNDZWxsc0xheW91dEluZm9fKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgc2VsZi5jYWNoZWRJdGVtQ291bnRfID0gTWF0aC5jZWlsKChvcHRpb25zLmVuZFRpbWUuZ2V0VGltZSgpIC0gb3B0aW9ucy5zdGFydFRpbWUuZ2V0VGltZSgpKSAvIChvcHRpb25zLnRpbWVVbml0ICogT05FX0hPVVIpKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG4gICAgICAgIHZhciBkaXNwbGF5aW5nRGF5cyA9IG9wdGlvbnMudmlld01vZGUgPT09IFZJRVdfREFZID8gMSA6IDc7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IG9wdGlvbnMuY29sSGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiBjb250YWluZXJSZWN0LndpZHRoIC0gb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogY29udGFpbmVyUmVjdC5oZWlnaHQgLSBvcHRpb25zLmNvbEhlYWRlckhlaWdodCxcbiAgICAgICAgICAgIGNvbnRlbnRXaWR0aDogZGlzcGxheWluZ0RheXMgKiBjYWxjRXZlbnRDb2x1bW5XaWR0aF8oc2VsZiksXG4gICAgICAgICAgICBjb250ZW50SGVpZ2h0OiBzZWxmLmNhY2hlZEl0ZW1Db3VudF8gKiBvcHRpb25zLnJvd0hlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNDb3JuZXJMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvcHRpb25zLnJvd0hlYWRlcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBvcHRpb25zLmNvbEhlYWRlckhlaWdodCxcbiAgICAgICAgICAgIGNvbnRlbnRXaWR0aDogb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCxcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IG9wdGlvbnMuY29sSGVhZGVySGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWREYXlzVmlld0luZm9fKG9wdGlvbnMsIGxheW91dEluZm8pIHtcbiAgICAgICAgdmFyIGFyZWEgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFyZWEpIHx8ICcnO1xuICAgICAgICBpZiAoIWFyZWEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbmNsdWRlUm93cyA9IG9wdGlvbnMuaW5jbHVkZVJvd3MgfHwgdHJ1ZTtcbiAgICAgICAgdmFyIGN1cnJlbnRMYXlvdXRJbmZvID0gbGF5b3V0SW5mb1thcmVhXTtcbiAgICAgICAgdmFyIHI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgcm93SGVpZ2h0ID0gc2NvcGUub3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgIHZhciByb3dIZWFkZXJXaWR0aCA9IHNjb3BlLm9wdGlvbnMucm93SGVhZGVyV2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSBjdXJyZW50TGF5b3V0SW5mby5oZWlnaHQ7XG4gICAgICAgIHZhciB3aWR0aCA9IGN1cnJlbnRMYXlvdXRJbmZvLndpZHRoO1xuICAgICAgICB2YXIgaGFzVlNjcm9sbGJhcjtcbiAgICAgICAgdmFyIGhhc0hTY3JvbGxiYXI7XG4gICAgICAgIHZhciBpZFByZWZpeCA9IHNjb3BlLmdyaWQudWlkICsgJy0nO1xuICAgICAgICB2YXIgcmVuZGVyUmFuZ2UgPSBnZXRSZW5kZXJSYW5nZS5jYWxsKHNjb3BlLCBhcmVhLCBjdXJyZW50TGF5b3V0SW5mbywgb3B0aW9ucyk7XG4gICAgICAgIHZhciBvZmZzZXRUb3AgPSByZW5kZXJSYW5nZS5vZmZzZXRUb3A7XG5cbiAgICAgICAgaWYgKGFyZWEgPT09ICdkYXlzVmlld0NlbGxzJykge1xuICAgICAgICAgICAgaGFzVlNjcm9sbGJhciA9IGN1cnJlbnRMYXlvdXRJbmZvLmhlaWdodCA8IGN1cnJlbnRMYXlvdXRJbmZvLmNvbnRlbnRIZWlnaHQ7XG4gICAgICAgICAgICBoYXNIU2Nyb2xsYmFyID0gY3VycmVudExheW91dEluZm8ud2lkdGggPCBjdXJyZW50TGF5b3V0SW5mby5jb250ZW50V2lkdGg7XG4gICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy12aWV3cG9ydCcsXG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyZW50TGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGN1cnJlbnRMYXlvdXRJbmZvLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gKGhhc0hTY3JvbGxiYXIgPyBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCA6IDApLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSAoaGFzVlNjcm9sbGJhciA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodCA6IDApLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIChvZmZzZXRUb3AgPCAwID8gb2Zmc2V0VG9wIDogMCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjdXJyZW50TGF5b3V0SW5mby5jb250ZW50V2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2VHJhbnNsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IC1vcHRpb25zLm9mZnNldExlZnQgfHwgMCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3AgfHwgMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpbmNsdWRlUm93cykge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IHJlbmRlclJhbmdlLnN0YXJ0OyBpIDwgcmVuZGVyUmFuZ2UuZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MucHVzaChjcmVhdGVSb3dSZW5kZXJJbmZvLmNhbGwoc2NvcGUsIGksIHJvd0hlaWdodCwgaWRQcmVmaXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJlYSA9PT0gJ2RheXNWaWV3RXZlbnQnKSB7XG4gICAgICAgICAgICBoYXNWU2Nyb2xsYmFyID0gY3VycmVudExheW91dEluZm8uaGVpZ2h0IDwgY3VycmVudExheW91dEluZm8uY29udGVudEhlaWdodDtcbiAgICAgICAgICAgIGhhc0hTY3JvbGxiYXIgPSBjdXJyZW50TGF5b3V0SW5mby53aWR0aCA8IGN1cnJlbnRMYXlvdXRJbmZvLmNvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgIHIgPSB7XG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLXZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJlbnRMYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogY3VycmVudExheW91dEluZm8ubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSAoaGFzSFNjcm9sbGJhciA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoIDogMCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIChoYXNWU2Nyb2xsYmFyID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IDogMCksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19ISURERU5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gKG9mZnNldFRvcCA8IDAgPyBvZmZzZXRUb3AgOiAwKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGN1cnJlbnRMYXlvdXRJbmZvLmNvbnRlbnRXaWR0aFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZUcmFuc2xhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLW9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IC1vcHRpb25zLm9mZnNldFRvcCB8fCAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZFJvd3M6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGluY2x1ZGVSb3dzKSB7XG4gICAgICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MgPSBnZXRSZW5kZXJlZERheXNWaWV3RXZlbnRJbmZvXy5jYWxsKHNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmVhID09PSAnZGF5c1ZpZXdDb2x1bW5IZWFkZXInKSB7XG4gICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy1jb2x1bW5IZWFkZXInLFxuICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogY3VycmVudExheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyZW50TGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGN1cnJlbnRMYXlvdXRJbmZvLmNvbnRlbnRXaWR0aFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZUcmFuc2xhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLW9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkUm93czogW3tcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpZFByZWZpeCArICdjb2x1bW5IZWFkZXInLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLWNvbHVtbi1oZWFkZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiBnZXRSZW5kZXJlZERheXNWaWV3Q29sdW1uSGVhZGVySW5mb18uY2FsbChzY29wZSwgb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09ICdkYXlzVmlld1Jvd0hlYWRlcicpIHtcbiAgICAgICAgICAgIHZhciBkaXNwbGF5RGF0ZVRpbWUgPSBzY29wZS5kaXNwbGF5RGF0ZVRpbWVfIHx8IGdldERpc3BsYXlEYXRlVGltZV8uY2FsbChzY29wZSk7XG4gICAgICAgICAgICBzY29wZS5kaXNwbGF5RGF0ZVRpbWVfID0gZGlzcGxheURhdGVUaW1lO1xuICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2Mtcm93SGVhZGVyJyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJlbnRMYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogY3VycmVudExheW91dEluZm8ubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0hJRERFTlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX1JFTCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSAob2Zmc2V0VG9wIDwgMCA/IG9mZnNldFRvcCA6IDApLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogY3VycmVudExheW91dEluZm8uY29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlRyYW5zbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IC1vcHRpb25zLm9mZnNldFRvcCB8fCAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZFJvd3M6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGluY2x1ZGVSb3dzKSB7XG4gICAgICAgICAgICAgICAgcm93SGVhZGVyV2lkdGggPSBzY29wZS5vcHRpb25zLnJvd0hlYWRlcldpZHRoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IHJlbmRlclJhbmdlLnN0YXJ0OyBpIDwgcmVuZGVyUmFuZ2UuZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MucHVzaChjcmVhdGVSb3dIZWFkZXJDZWxsSW5mby5jYWxsKHNjb3BlLCBpLCByb3dIZWlnaHQsIHJvd0hlYWRlcldpZHRoLCBpZFByZWZpeCwgZGlzcGxheURhdGVUaW1lW2ldKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoYXJlYSA9PT0gJ2RheXNWaWV3Q29ybmVyJykge1xuICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2MtY29ybmVySGVhZGVyJyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZFJvd3M6IFt7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaWRQcmVmaXggKyAnY29ybmVyJyxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1jb3JuZXItaGVhZGVyLWNlbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dzUmVuZGVySW5mbyhhcmVhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBpZFByZWZpeCA9IHNjb3BlLmdyaWQudWlkICsgJy0nO1xuICAgICAgICB2YXIgY3VyckxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbYXJlYV07XG4gICAgICAgIHZhciByID0ge307XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgcm93SGVpZ2h0ID0gc2NvcGUub3B0aW9ucy5yb3dIZWlnaHQ7XG5cbiAgICAgICAgdmFyIHJlbmRlclJhbmdlID0gZ2V0UmVuZGVyUmFuZ2UuY2FsbChzY29wZSwgYXJlYSwgY3VyckxheW91dEluZm8sIG9wdGlvbnMpO1xuICAgICAgICBpZiAoYXJlYSA9PT0gJ2RheXNWaWV3Q2VsbHMnKSB7XG4gICAgICAgICAgICByLmxlZnQgPSAtb3B0aW9ucy5vZmZzZXRMZWZ0IHx8IDA7XG4gICAgICAgICAgICByLnRvcCA9IC1vcHRpb25zLm9mZnNldFRvcCB8fCAwO1xuICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChpID0gcmVuZGVyUmFuZ2Uuc3RhcnQ7IGkgPCByZW5kZXJSYW5nZS5lbmQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogaWRQcmVmaXggKyAncicgKyBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJvd0hlaWdodFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmVhID09PSAnZGF5c1ZpZXdSb3dIZWFkZXInKSB7XG4gICAgICAgICAgICByLmxlZnQgPSAwO1xuICAgICAgICAgICAgci50b3AgPSAtb3B0aW9ucy5vZmZzZXRUb3AgfHwgMDtcbiAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gW107XG5cbiAgICAgICAgICAgIGZvciAoaSA9IHJlbmRlclJhbmdlLnN0YXJ0OyBpIDwgcmVuZGVyUmFuZ2UuZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGlkUHJlZml4ICsgJ3JoJyArIGksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogcm93SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09ICdkYXlzVmlld0NvbHVtbkhlYWRlcicpIHtcbiAgICAgICAgICAgIHIubGVmdCA9IC1vcHRpb25zLm9mZnNldExlZnQgfHwgMDtcbiAgICAgICAgICAgIHIudG9wID0gMDtcbiAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gW107XG5cbiAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzLnB1c2goe2tleTogaWRQcmVmaXggKyAnY29sdW1uSGVhZGVyJ30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgci5sZWZ0ID0gLW9wdGlvbnMub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHIudG9wID0gLW9wdGlvbnMub2Zmc2V0VG9wO1xuICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLmNhY2hlZEV2ZW50S2V5c18pIHtcbiAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IHNjb3BlLmNhY2hlZEV2ZW50S2V5c187XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJSYW5nZShhcmVhLCBsYXlvdXRJbmZvLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBzdGFydFJvd0luZm87XG4gICAgICAgIHZhciBlbmRSb3dJbmZvO1xuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gb3B0aW9ucy5vZmZzZXRUb3A7XG4gICAgICAgIHZhciByZW5kZXJSYW5nZSA9IHt9O1xuICAgICAgICB2YXIgaXNSb3dBcmVhID0gYXJlYSA9PT0gJ2RheXNWaWV3Q2VsbHMnIHx8IGFyZWEgPT09ICdkYXlzVmlld1Jvd0hlYWRlcic7XG5cbiAgICAgICAgaWYgKGlzUm93QXJlYSkge1xuICAgICAgICAgICAgc3RhcnRSb3dJbmZvID0gZ2V0Um93SW5mb0F0Xy5jYWxsKHNjb3BlLCB7dG9wOiBvcHRpb25zLm9mZnNldFRvcCwgbGVmdDogb3B0aW9ucy5vZmZzZXRMZWZ0fSk7XG4gICAgICAgICAgICBlbmRSb3dJbmZvID0gZ2V0Um93SW5mb0F0Xy5jYWxsKHNjb3BlLCB7XG4gICAgICAgICAgICAgICAgdG9wOiBvcHRpb25zLm9mZnNldFRvcCArIGxheW91dEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IG9wdGlvbnMub2Zmc2V0TGVmdCArIGxheW91dEluZm8ud2lkdGhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnRSb3dJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyUmFuZ2Uuc3RhcnQgPSBzdGFydFJvd0luZm8uaW5kZXg7XG4gICAgICAgICAgICAgICAgcmVuZGVyUmFuZ2UuZW5kID0gZW5kUm93SW5mbyA/IChlbmRSb3dJbmZvLmluZGV4ICsgMSkgOiBzY29wZS5jYWNoZWRJdGVtQ291bnRfO1xuICAgICAgICAgICAgICAgIHJlbmRlclJhbmdlLm9mZnNldFRvcCA9IHN0YXJ0Um93SW5mby5zdGFydFBvc2l0aW9uIC0gb2Zmc2V0VG9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZW5kZXJSYW5nZS5zdGFydCA9IHJlbmRlclJhbmdlLmVuZCA9IHJlbmRlclJhbmdlLm9mZnNldFRvcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyUmFuZ2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlUm93UmVuZGVySW5mbyhpLCByb3dIZWlnaHQsIGlkUHJlZml4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IGlkUHJlZml4ICsgJ3InICsgaSxcbiAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyByJyArIGkgKyAnIGV2ZW4nLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogaSAqIHJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByb3dIZWlnaHRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogZ2V0UmVuZGVyZWREYXlzVmlld1BvcnRJbmZvXy5jYWxsKHRoaXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlUm93SGVhZGVyQ2VsbEluZm8oaSwgcm93SGVpZ2h0LCB3aWR0aCwgaWRQcmVmaXgsIGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogaWRQcmVmaXggKyAncmgnICsgaSxcbiAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdy1oZWFkZXIgcicgKyBpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogaSAqIHJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByb3dIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiBnZXRSZW5kZXJlZERheXNWaWV3Um93SGVhZGVySW5mb18uY2FsbCh0aGlzLCBpdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkRGF5c1ZpZXdQb3J0SW5mb18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG5cbiAgICAgICAgdmFyIGNvbHVtbkNvdW50ID0gb3B0aW9ucy52aWV3TW9kZSA9PT0gVklFV19EQVkgPyAxIDogNztcblxuICAgICAgICB2YXIgaGVpZ2h0ID0gb3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgIHZhciB3aWR0aCA9IGNhbGNFdmVudENvbHVtbldpZHRoXyhzZWxmKTtcbiAgICAgICAgdmFyIGxlZnQgPSAwO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9ICc8ZGl2IHN0eWxlPVwiaGVpZ2h0OicgKyBoZWlnaHQgKyAncHhcIj4nO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjc3NOYW1lID0gJ2djLWNlbGwnICsgJyBjJyArIGk7XG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciArPSBidWlsZEhlYWRDZWxsSFRNTF8obGVmdCwgd2lkdGgsIGhlaWdodCwgY3NzTmFtZSk7XG4gICAgICAgICAgICBsZWZ0ICs9IHdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlU3RyICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZVN0cjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZERheXNWaWV3Q29sdW1uSGVhZGVySW5mb18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciBzdGFydERhdGUgPSBvcHRpb25zLnN0YXJ0RGF0ZTtcbiAgICAgICAgdmFyIGNvbHVtbkNvdW50ID0gb3B0aW9ucy52aWV3TW9kZSA9PT0gVklFV19EQVkgPyAxIDogNztcbiAgICAgICAgdmFyIGhlaWdodCA9IG9wdGlvbnMuY29sSGVhZGVySGVpZ2h0O1xuICAgICAgICB2YXIgd2lkdGggPSBjYWxjRXZlbnRDb2x1bW5XaWR0aF8oc2VsZik7XG4gICAgICAgIHZhciBsZWZ0ID0gMDtcblxuICAgICAgICB2YXIgdGVtcGxhdGVTdHIgPSAnPGRpdiBzdHlsZT1cImhlaWdodDonICsgaGVpZ2h0ICsgJ3B4XCI+JztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5Db3VudDsgaSsrKSB7XG5cbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IGdldERheXNDb2x1bW5IZWFkZXJGb3JtYXR0ZWRWYWx1ZV8uY2FsbChzZWxmLCBzdGFydERhdGUpO1xuICAgICAgICAgICAgdmFyIGNzc05hbWUgPSAnZ2MtY29sdW1uLWhlYWRlci1jZWxsJyArICcgYycgKyBpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciArPSBidWlsZEhlYWRDZWxsSFRNTF8obGVmdCwgd2lkdGgsIGhlaWdodCwgY3NzTmFtZSwgZm9ybWF0dGVkVmFsdWUpO1xuXG4gICAgICAgICAgICBsZWZ0ICs9IHdpZHRoO1xuICAgICAgICAgICAgc3RhcnREYXRlID0gZ2V0RGF5XyhzdGFydERhdGUsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlU3RyICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZVN0cjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZERheXNWaWV3Um93SGVhZGVySW5mb18oZGF0ZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IGdldERheXNSb3dIZWFkZXJGb3JtYXR0ZWRWYWx1ZV8uY2FsbChzZWxmLCBkYXRlKTtcblxuICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJnYy1jYWxlbmRhci1yb3ctaGVhZGVyLWNlbGxcIj4nICsgZm9ybWF0dGVkVmFsdWUgKyAnPC9kaXY+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlFdmVudFJlbmRlclN0eWxlXyhncm91cEluZm8sIGl0ZW1JbmRleCkge1xuXG4gICAgICAgIC8vVE9ETzogY29uc2lkZXIgc2Nyb2xsIG9mZnNldFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgZXZlbnRUb3RhbFdpZHRoID0gY2FsY0V2ZW50Q29sdW1uV2lkdGhfKHNlbGYpO1xuXG4gICAgICAgIHZhciBjdXJyZW50RXZlbnQgPSBncm91cC5nZXRJdGVtKGl0ZW1JbmRleCk7XG4gICAgICAgIHZhciBsZWZ0SW50ZXJzZXRjdENvdW50ID0gMDtcbiAgICAgICAgdmFyIHRvdGFsSW50ZXJzZWN0Q291bnQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwLml0ZW1Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNFdmVudEludGVyc2VjdF8uY2FsbChzZWxmLCBjdXJyZW50RXZlbnQsIGdyb3VwLmdldEl0ZW0oaSkpKSB7XG4gICAgICAgICAgICAgICAgdG90YWxJbnRlcnNlY3RDb3VudCsrO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgaXRlbUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRJbnRlcnNldGN0Q291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnRXaWR0aCA9IE1hdGguZmxvb3IoZXZlbnRUb3RhbFdpZHRoIC8gKHRvdGFsSW50ZXJzZWN0Q291bnQgPT09IDAgPyAxIDogdG90YWxJbnRlcnNlY3RDb3VudCkpO1xuICAgICAgICB2YXIgbGVmdCA9IGxlZnRJbnRlcnNldGN0Q291bnQgKiBldmVudFdpZHRoO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgdG9wOiBnZXREYXlzRXZlbnRUb3BfLmNhbGwoc2VsZiwgY3VycmVudEV2ZW50LCBpdGVtSW5kZXgpLFxuICAgICAgICAgICAgd2lkdGg6IGV2ZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGdldERheXNFdmVudEhlaWdodF8uY2FsbChzZWxmLCBjdXJyZW50RXZlbnQpLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlFdmVudExheW91dENhbGxCYWNrKGdyb3VwSW5mbywgaXRlbUluZGV4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZERheXNWaWV3RXZlbnRJbmZvXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYmFzZUxlZnRMaW5lID0gMDtcbiAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBnZXRDdXJyZW50Vmlld0dyb3Vwc18uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSBncmlkLmxheW91dEVuZ2luZTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciBldmVudFRvdGFsV2lkdGggPSBjYWxjRXZlbnRDb2x1bW5XaWR0aF8oc2VsZik7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGlkUHJlZml4ID0gZ3JpZC51aWQgKyAnLSc7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIGdyb3VwO1xuICAgICAgICB2YXIgY29udGFpbmVyU2l6ZTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgdmFyIHJvdztcbiAgICAgICAgc2VsZi5jYWNoZWRFdmVudEtleXNfID0gW107XG4gICAgICAgIF8uZWFjaChncm91cEluZm9zLCBmdW5jdGlvbihncm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZEhUTUwgPSAnJztcbiAgICAgICAgICAgIGNvbnRhaW5lclNpemUgPSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBncm91cEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBldmVudFRvdGFsV2lkdGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIHJvd3MgPSBsYXlvdXRFbmdpbmUuZ2V0SW5uZXJHcm91cFJlbmRlckluZm8oZ3JvdXBJbmZvLCBjb250YWluZXJTaXplLCBnZXREYXlFdmVudExheW91dENhbGxCYWNrLmJpbmQoc2VsZikpO1xuXG4gICAgICAgICAgICBiYXNlTGVmdExpbmUgPSBldmVudFRvdGFsV2lkdGggKiBnZXREYXlzU3Bhbl8obmV3IERhdGUoZ3JvdXAubmFtZSksIG9wdGlvbnMuc3RhcnREYXRlKTtcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwLCBsZW4gPSByb3dzLmxlbmd0aDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAvL3RyYW5zZmVyIHJvdyBrZXkgdG8gdGhlIG91dGVyIGRpdlxuICAgICAgICAgICAgICAgIHJvdyA9IHJvd3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGtleSA9IHJvdy5rZXk7XG4gICAgICAgICAgICAgICAgcm93LmtleSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY2hpbGRIVE1MICs9ICgnPGRpdiBpZD1cIicgKyBrZXkgKyAnXCIgY2xhc3M9XCJkYXktZXZlbnRcIiBzdHlsZT1cIicgKyBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyhnZXREYXlFdmVudFJlbmRlclN0eWxlXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgaW5kZXgpKSArICdcIj4nICsgZ3JpZC5yZW5kZXJSb3dfKHJvdykgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBpZFByZWZpeCArICdnJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIHNlbGYuY2FjaGVkRXZlbnRLZXlzXy5wdXNoKHtrZXk6IGtleX0pO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdkYXktZXZlbnQtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogYmFzZUxlZnRMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGV2ZW50VG90YWxXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogZ3JvdXBJbmZvLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IGNoaWxkSFRNTFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERpc3BsYXlEYXRlVGltZV8oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciB0aW1lVW5pdCA9IG9wdGlvbnMudGltZVVuaXQgKiBPTkVfSE9VUjtcbiAgICAgICAgdmFyIHN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIGVuZFRpbWUgPSBvcHRpb25zLmVuZFRpbWUuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgZGlzcGxheVRpbWVzID0gW107XG4gICAgICAgIHZhciB0aW1lID0gc3RhcnRUaW1lO1xuXG4gICAgICAgIHdoaWxlICh0aW1lIDwgZW5kVGltZSkge1xuICAgICAgICAgICAgZGlzcGxheVRpbWVzLnB1c2gobmV3IERhdGUodGltZSkpO1xuICAgICAgICAgICAgdGltZSArPSB0aW1lVW5pdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpc3BsYXlUaW1lcy5wdXNoKG5ldyBEYXRlKGVuZFRpbWUpKTtcblxuICAgICAgICByZXR1cm4gZGlzcGxheVRpbWVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJvd0luZm9BdF8ob2Zmc2V0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXJ0UG9zaXRpb24gPSAwO1xuICAgICAgICB2YXIgaXRlbUNvdW50ID0gc2VsZi5jYWNoZWRJdGVtQ291bnRfO1xuICAgICAgICB2YXIgY2FjaGVkUm93T2Zmc2V0ID0gc2VsZi5jYWNoZWRSb3dPZmZzZXRfO1xuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gb2Zmc2V0LnRvcDtcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgICB2YXIgcm93SGVpZ2h0ID0gc2VsZi5vcHRpb25zLnJvd0hlaWdodDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICBpZiAoY2FjaGVkUm93T2Zmc2V0KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBjYWNoZWRSb3dPZmZzZXQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gY2FjaGVkUm93T2Zmc2V0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtIDw9IG9mZnNldFRvcCkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gaSAqIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSBpdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IHN0YXJ0SW5kZXg7IGkgPCBpdGVtQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA8PSByb3dIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjogc3RhcnRQb3NpdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSAlIDEwMCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkUm93T2Zmc2V0XyA9IGNhY2hlZFJvd09mZnNldCB8fCBbXTtcbiAgICAgICAgICAgICAgICBzZWxmLmNhY2hlZFJvd09mZnNldF9baSAvIDEwMF0gPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2Zmc2V0VG9wIC09IHJvd0hlaWdodDtcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gKz0gcm93SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0V2ZW50SW50ZXJzZWN0XyhldmVudDEsIGV2ZW50Mikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICBpZiAoIW9wdGlvbnMuZXZlbnRTdGFydEZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvcHRpb25zLmV2ZW50RW5kRmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBldmVudDFTdGFydCA9IGV2ZW50MVtvcHRpb25zLmV2ZW50U3RhcnRGaWVsZF07XG4gICAgICAgIHZhciBldmVudDFFbmQgPSBldmVudDFbb3B0aW9ucy5ldmVudEVuZEZpZWxkXTtcbiAgICAgICAgdmFyIGV2ZW50MlN0YXJ0ID0gZXZlbnQyW29wdGlvbnMuZXZlbnRTdGFydEZpZWxkXTtcbiAgICAgICAgdmFyIGV2ZW50MkVuZCA9IGV2ZW50MltvcHRpb25zLmV2ZW50RW5kRmllbGRdO1xuXG4gICAgICAgIGlmIChldmVudDFTdGFydC5nZXRNb250aCgpICE9PSBldmVudDJTdGFydC5nZXRNb250aCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQxRW5kLmdldERhdGUoKSAhPT0gZXZlbnQyRW5kLmdldERhdGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50MUVuZC5nZXRUaW1lKCkgPiBldmVudDJTdGFydC5nZXRUaW1lKCkgJiYgKGV2ZW50MkVuZC5nZXRUaW1lKCkgPiBldmVudDFTdGFydC5nZXRUaW1lKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzRXZlbnRUb3BfKGV2ZW50LCBpbmRleCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICBpZiAoIW9wdGlvbnMuZXZlbnRTdGFydEZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5yb3dIZWlnaHQgKiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYXlTdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgdmFyIGV2ZW50U3RhcnRUaW1lID0gZXZlbnRbb3B0aW9ucy5ldmVudFN0YXJ0RmllbGRdO1xuICAgICAgICB2YXIgdGltZVNwYW4gPSAoZXZlbnRTdGFydFRpbWUuZ2V0SG91cnMoKSAtIGRheVN0YXJ0VGltZS5nZXRIb3VycygpKSArIChldmVudFN0YXJ0VGltZS5nZXRNaW51dGVzKCkgLSBkYXlTdGFydFRpbWUuZ2V0TWludXRlcygpKSAvIDYwO1xuXG4gICAgICAgIHJldHVybiBvcHRpb25zLnJvd0hlaWdodCAqIHRpbWVTcGFuIC8gc2VsZi5vcHRpb25zLnRpbWVVbml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNFdmVudEhlaWdodF8oZXZlbnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgdmFyIHRpbWVTcGFuID0gc2VsZi5vcHRpb25zLnRpbWVVbml0O1xuICAgICAgICBpZiAob3B0aW9ucy5ldmVudFN0YXJ0RmllbGQgJiYgb3B0aW9ucy5ldmVudEVuZEZpZWxkKSB7XG4gICAgICAgICAgICB0aW1lU3BhbiA9IChldmVudFtvcHRpb25zLmV2ZW50RW5kRmllbGRdIC0gZXZlbnRbb3B0aW9ucy5ldmVudFN0YXJ0RmllbGRdKSAvIE9ORV9IT1VSO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChvcHRpb25zLnJvd0hlaWdodCAqIHRpbWVTcGFuKSAvIHNlbGYub3B0aW9ucy50aW1lVW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzU3Bhbl8oZGF0ZVRpbWUxLCBkYXRlVGltZTIpIHtcbiAgICAgICAgdmFyIGRhdGUxID0gbmV3IERhdGUoZGF0ZVRpbWUxLmdldEZ1bGxZZWFyKCksIGRhdGVUaW1lMS5nZXRNb250aCgpLCBkYXRlVGltZTEuZ2V0RGF0ZSgpKTtcbiAgICAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoZGF0ZVRpbWUyLmdldEZ1bGxZZWFyKCksIGRhdGVUaW1lMi5nZXRNb250aCgpLCBkYXRlVGltZTIuZ2V0RGF0ZSgpKTtcblxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLmFicygoZGF0ZTEgLSBkYXRlMikgLyBPTkVfREFZKSk7XG4gICAgfVxuXG4gICAgLy9lbmRyZWdpb25cblxuICAgIC8vcmVnaW9uIE1vbnRoVmlld1xuICAgIGZ1bmN0aW9uIGdldE1vbnRoSGVhZGVyTGF5b3V0SW5mb18oKSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogY29udGFpbmVyUmVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogc2NvcGUub3B0aW9ucy5kYXRlSGVhZGVySGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TW9udGhDZWxsc0xheW91dEluZm9fKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgIHZhciBjb250YWluZXJSZWN0ID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuICAgICAgICB2YXIgZGF0ZUhlYWRlckhlaWdodCA9IHNjb3BlLm9wdGlvbnMuZGF0ZUhlYWRlckhlaWdodDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBkYXRlSGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiBjb250YWluZXJSZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBjb250YWluZXJSZWN0LmhlaWdodCAtIGRhdGVIZWFkZXJIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZE1vbnRoVmlld0luZm9fKG9wdGlvbnMsIGxheW91dEluZm8pIHtcbiAgICAgICAgdmFyIGFyZWEgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFyZWEpIHx8ICcnO1xuICAgICAgICBpZiAoIWFyZWEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbmNsdWRlUm93cyA9IG9wdGlvbnMuaW5jbHVkZVJvd3MgfHwgdHJ1ZTtcbiAgICAgICAgdmFyIGN1cnJlbnRMYXlvdXRJbmZvID0gbGF5b3V0SW5mb1thcmVhXTtcbiAgICAgICAgdmFyIHI7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBoZWlnaHQgPSBjdXJyZW50TGF5b3V0SW5mby5oZWlnaHQ7XG4gICAgICAgIHZhciB3aWR0aCA9IGN1cnJlbnRMYXlvdXRJbmZvLndpZHRoO1xuXG4gICAgICAgIGlmIChhcmVhID09PSAnbW9udGhWaWV3Q2VsbHMnIHx8IGFyZWEgPT09ICdtb250aFZpZXdFdmVudCcpIHtcbiAgICAgICAgICAgIHIgPSB7XG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLXZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJlbnRMYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogY3VycmVudExheW91dEluZm8ubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0hJRERFTlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX1JFTCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpbmNsdWRlUm93cykge1xuICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gYXJlYSA9PT0gJ21vbnRoVmlld0NlbGxzJyA/IGdldFJlbmRlcmVkTW9udGhWaWV3Q2VsbHNJbmZvXy5jYWxsKHNjb3BlKSA6IGdldFJlbmRlcmVkTW9udGhWaWV3RXZlbnRJbmZvXy5jYWxsKHNjb3BlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09ICdtb250aFZpZXdIZWFkZXInKSB7XG4gICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy1jb2x1bW5IZWFkZXInLFxuICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogY3VycmVudExheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyZW50TGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkUm93czogZ2V0UmVuZGVyZWRNb250aFZpZXdIZWFkZXJJbmZvXy5jYWxsKHNjb3BlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkTW9udGhWaWV3SGVhZGVySW5mb18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHJvd0NvbnRleHQgPSB7XG4gICAgICAgICAgICBsYXlvdXRJbmZvOiBnZXRDZWxsTGF5b3V0SW5mb18uY2FsbChzZWxmLCB0cnVlKSxcbiAgICAgICAgICAgIHJvd2NvbnRlbnRJbmZvOiBnZXRNb250aEhlYWRlckZvcm1hdHRlZFZhbHVlXy5jYWxsKHNlbGYpXG4gICAgICAgIH07XG4gICAgICAgIHZhciBpZFByZWZpeCA9IHNlbGYuZ3JpZC51aWQgKyAnLSc7XG5cbiAgICAgICAgc2VsZi5tb250aFZpZXdIZWFkZXJIVE1MXyA9IHNlbGYubW9udGhWaWV3SGVhZGVySFRNTF8gfHxcbiAgICAgICAgICAgIGJ1aWxkUm93SFRNTF8uY2FsbChzZWxmLCB0cnVlLCByb3dDb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IGlkUHJlZml4ICsgJ2hlYWRlcicsXG4gICAgICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLWNvbHVtbi1oZWFkZXInLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHNlbGYubW9udGhWaWV3SGVhZGVySFRNTF9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRNb250aFZpZXdDZWxsc0luZm9fKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvZmZzZXRUb3AgPSAwO1xuICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICB2YXIgcm93Q29udGV4dCA9IHt9O1xuICAgICAgICB2YXIgaWRQcmVmaXggPSBzZWxmLmdyaWQudWlkICsgJy0nO1xuICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IGdldENlbGxMYXlvdXRJbmZvXy5jYWxsKHRoaXMsIGZhbHNlKTtcbiAgICAgICAgdmFyIGNvbnRlbnRJbmZvID0gc2VsZi5tb250aENvbnRlbnRJbmZvXyB8fCAoc2VsZi5tb250aENvbnRlbnRJbmZvXyA9IGdldE1vbnRoQ2VsbENvbnRlbnRfLmNhbGwodGhpcykpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4Um93Q291bnQ7IGkrKykge1xuICAgICAgICAgICAgcm93Q29udGV4dC5sYXlvdXRJbmZvID0gbGF5b3V0SW5mbztcbiAgICAgICAgICAgIHJvd0NvbnRleHQucm93Y29udGVudEluZm8gPSBjb250ZW50SW5mby5zbGljZShpICogbWF4Q29sdW1uQ291bnQsIGkgKiBtYXhDb2x1bW5Db3VudCArIG1heENvbHVtbkNvdW50KTtcblxuICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBrZXk6IGlkUHJlZml4ICsgJ3InICsgaSxcbiAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyByJyArIGkgKyAnIGV2ZW4nLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBvZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dEluZm8uaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogYnVpbGRSb3dIVE1MXy5jYWxsKHRoaXMsIGZhbHNlLCByb3dDb250ZXh0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBvZmZzZXRUb3AgKz0gbGF5b3V0SW5mby5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICAvKmpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cbiAgICBmdW5jdGlvbiBnZXRNb250aEV2ZW50TGF5b3V0Q2FsbEJhY2soZ3JvdXBJbmZvLCBpdGVtSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAnbW9udGgtZXZlbnQnLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJlZE1vbnRoVmlld0V2ZW50SW5mb18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGxheW91dEluZm8gPSBnZXRDZWxsTGF5b3V0SW5mb18uY2FsbChzZWxmLCBmYWxzZSk7XG4gICAgICAgIHZhciBzdGFydERhdGUgPSBzZWxmLm1vbnRoVmlld1N0YXJ0RGF0ZV8gfHwgKHNlbGYubW9udGhWaWV3U3RhcnREYXRlXyA9IGdldE1vbnRoVmlld1N0YXJ0RGF0ZV8uY2FsbChzZWxmKSk7XG4gICAgICAgIHZhciByb3dIZWlnaHQgPSBsYXlvdXRJbmZvLmhlaWdodDtcbiAgICAgICAgdmFyIGNvbHVtbldpZHRoID0gbGF5b3V0SW5mby53aWR0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIHZhciBncm91cHNJbmZvcyA9IGdldEN1cnJlbnRWaWV3R3JvdXBzXy5jYWxsKHNlbGYpO1xuICAgICAgICB2YXIgaWRQcmVmaXggPSBzZWxmLmdyaWQudWlkO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgIHZhciBncm91cFJlbmRlckluZm87XG5cbiAgICAgICAgXy5lYWNoKGdyb3Vwc0luZm9zLCBmdW5jdGlvbihncm91cEluZm8pIHtcbiAgICAgICAgICAgIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICB2YXIgZXZlbnREYXRlID0gbmV3IERhdGUoZ3JvdXAubmFtZSk7XG4gICAgICAgICAgICB2YXIgZGlmZkRheXMgPSBNYXRoLmFicyhldmVudERhdGUgLSBzdGFydERhdGUpIC8gT05FX0RBWTtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gKGRpZmZEYXlzICUgbWF4Q29sdW1uQ291bnQpICogY29sdW1uV2lkdGg7XG4gICAgICAgICAgICB2YXIgdG9wID0gcGFyc2VJbnQoZGlmZkRheXMgLyBtYXhDb2x1bW5Db3VudCkgKiByb3dIZWlnaHQgKyBzZWxmLm9wdGlvbnMuZGF0ZUhlYWRlckhlaWdodDtcblxuICAgICAgICAgICAgdmFyIGNoaWxkSFRNTCA9ICcnO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5zZXJTaXplID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBjb2x1bW5XaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGdyb3VwSW5mby5oZWlnaHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgcm93cyA9IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwUmVuZGVySW5mbyhncm91cEluZm8sIGNvbnRhaW5zZXJTaXplLCBnZXRNb250aEV2ZW50TGF5b3V0Q2FsbEJhY2suYmluZChzZWxmKSk7XG5cbiAgICAgICAgICAgIC8vVE9ETzogYWRkIGdyb3VwIGhlYWRlci9mb290ZXIgc3VwcG9ydFxuICAgICAgICAgICAgdmFyIG1heFZpZXdJdGVtQ291bnQgPSBsYXlvdXRFbmdpbmUuZ2V0TWF4VmlzaWJsZUl0ZW1Db3VudChjb250YWluc2VyU2l6ZSkgLSAxO1xuICAgICAgICAgICAgdmFyIG1vcmVSb3c7XG4gICAgICAgICAgICB2YXIgcmVuZGVySFRNTDtcbiAgICAgICAgICAgIHZhciB0ZW1wRWxlbWVudDtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJvd3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4Vmlld0l0ZW1Db3VudCA9PT0gLTEgfHwgKGkgPT09IG1heFZpZXdJdGVtQ291bnQgJiYgKGkgIT09IGxlbiAtIDEpKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3JlUm93ID0gcm93c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbW9yZVJvdy5yZW5kZXJJbmZvID0gbW9yZVJvdy5yZW5kZXJJbmZvIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJIVE1MID0gbW9yZVJvdy5yZW5kZXJJbmZvLnJlbmRlcmVkSFRNTDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJIVE1MKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJIVE1MID0gJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtcIj48YT4nICsgJysnICsgKGxlbiAtIGkpICsgJyBtb3JlLi4uJyArICc8L2E+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBFbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KHJlbmRlckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEVsZW1lbnQuaW5uZXJIVE1MID0gJzxhPicgKyAnKycgKyAobGVuIC0gaSkgKyAnIG1vcmUuLi4nICsgJzwvYT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVySFRNTCA9IHRlbXBFbGVtZW50Lm91dGVySFRNTDtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1vcmVSb3cucmVuZGVySW5mby5yZW5kZXJlZEhUTUwgPSByZW5kZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZEhUTUwgKz0gZ3JpZC5yZW5kZXJSb3dfKG1vcmVSb3cpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hpbGRIVE1MICs9IGdyaWQucmVuZGVyUm93Xyhyb3dzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyb3VwUmVuZGVySW5mbyA9IHtcbiAgICAgICAgICAgICAgICBrZXk6IGlkUHJlZml4ICsgJy1nJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSxcbiAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnbW9udGgtZXZlbnQtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbHVtbldpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBncm91cEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogY2hpbGRIVE1MXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChncm91cFJlbmRlckluZm8pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZFJvd0hUTUxfKGlzTW9udGhWaWV3SGVhZGVyLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBsZWZ0ID0gMDtcbiAgICAgICAgdmFyIGxheW91dEluZm8gPSBjb250ZXh0LmxheW91dEluZm87XG4gICAgICAgIHZhciBjb250ZW50SW5mbyA9IGNvbnRleHQucm93Y29udGVudEluZm87XG4gICAgICAgIHZhciBoZWlnaHQgPSBsYXlvdXRJbmZvLmhlaWdodDtcbiAgICAgICAgdmFyIHdpZHRoID0gbGF5b3V0SW5mby53aWR0aDtcblxuICAgICAgICB2YXIgdGVtcGxhdGVTdHIgPSAnPGRpdiBzdHlsZT1cImhlaWdodDonICsgaGVpZ2h0ICsgJ3B4XCI+JztcbiAgICAgICAgdmFyIGNzc05hbWUgPSAoaXNNb250aFZpZXdIZWFkZXIgPyAnZ2MtY2FsZW5kYXItY29sdW1uLWhlYWRlci1jZWxsJyA6ICdnYy1jZWxsJykgKyAnIGMnO1xuICAgICAgICB2YXIgYnVpbGRGbiA9IGlzTW9udGhWaWV3SGVhZGVyID8gYnVpbGRIZWFkQ2VsbEhUTUxfIDogYnVpbGRDb250ZW50Q2VsbEhUTUxfO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4Q29sdW1uQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdGVtcGxhdGVTdHIgKz0gYnVpbGRGbihsZWZ0LCB3aWR0aCwgaGVpZ2h0LCBjc3NOYW1lICsgaSwgY29udGVudEluZm9baV0pO1xuICAgICAgICAgICAgbGVmdCArPSB3aWR0aDtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZVN0ciArPSAnPC9kaXY+JztcblxuICAgICAgICByZXR1cm4gdGVtcGxhdGVTdHI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRIZWFkQ2VsbEhUTUxfKGxlZnQsIHdpZHRoLCBoZWlnaHQsIGNzc05hbWUsIGNvbnRlbnRJbmZvKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGNvbnRlbnRJbmZvIHx8ICcnO1xuICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3MgPSBcImdjLWNvbHVtblwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7IHdpZHRoOicgKyB3aWR0aCArICdweDtsZWZ0OicgKyBsZWZ0ICsgJ3B4OycgK1xuICAgICAgICAgICAgJ1wiPjxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47XCI+PGRpdiBzdHlsZT1cImhlaWdodDoxMDAlO1wiIGNsYXNzPVwiJyArIGNzc05hbWUgKyAnXCI+JyArIHZhbHVlICsgJzwvZGl2PjwvZGl2PjwvZGl2Pic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRDb250ZW50Q2VsbEhUTUxfKGxlZnQsIHdpZHRoLCBoZWlnaHQsIGNzc05hbWUsIGNvbnRlbnRJbmZvKSB7XG4gICAgICAgIHZhciBjYWxlbmRhckNzc05hbWUgPSAnZ2MtJyArIChjb250ZW50SW5mby5pc0hlYWRpbmdEYXkgPyAnaGVhZGluZ2RheScgOiAoY29udGVudEluZm8uaXNUcmFpbGluZ0RheSA/ICd0cmFpbGluZ2RheScgOiAnZGF5JykpO1xuXG4gICAgICAgIHZhciBkYXRlID0gY29udGVudEluZm8uZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIHZhciBkYXRlRGl2ID0gJzxkaXYgY2xhc3M9XCInICsgY2FsZW5kYXJDc3NOYW1lICsgJ1wic3R5bGUgPSBoZWlnaHQ6MTAwJT48c3Bhbj4nICsgZGF0ZSArICc8L3NwYW4+PC9kaXY+JztcblxuICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3MgPSBcImdjLWNvbHVtblwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7IHdpZHRoOicgKyB3aWR0aCArICdweDtsZWZ0OicgKyBsZWZ0ICsgJ3B4OycgK1xuICAgICAgICAgICAgJ1wiPjxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47XCI+PGRpdiBzdHlsZT1cImhlaWdodDoxMDAlO1wiIGNsYXNzPVwiJyArIGNzc05hbWUgKyAnXCI+JyArIGRhdGVEaXYgKyAnPC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNb250aFZpZXdTdGFydERhdGVfKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IHNlbGYub3B0aW9ucy5zdGFydERhdGUgPyBzZWxmLm9wdGlvbnMuc3RhcnREYXRlIDogbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIGZpcnN0RGF0ZUluQ3VycmVudE1vbnRoID0gbmV3IERhdGUoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSwgY3VycmVudERhdGUuZ2V0TW9udGgoKSwgMSk7XG4gICAgICAgIHZhciB3ZWVrRGF5ID0gZmlyc3REYXRlSW5DdXJyZW50TW9udGguZ2V0RGF5KCk7XG4gICAgICAgIHZhciBoZWFkaW5nRGF5c0NvdW50ID0gd2Vla0RheSA9PT0gMCA/IG1heENvbHVtbkNvdW50IDogd2Vla0RheTtcbiAgICAgICAgcmV0dXJuIGdldERheV8oZmlyc3REYXRlSW5DdXJyZW50TW9udGgsIC0xICogaGVhZGluZ0RheXNDb3VudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TW9udGhDZWxsQ29udGVudF8oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gc2VsZi5vcHRpb25zLnN0YXJ0RGF0ZSA/IHNlbGYub3B0aW9ucy5zdGFydERhdGUgOiBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgZmlyc3REYXRlSW5DdXJyZW50TW9udGggPSBuZXcgRGF0ZShjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpLCBjdXJyZW50RGF0ZS5nZXRNb250aCgpLCAxKTtcbiAgICAgICAgdmFyIHdlZWtEYXkgPSBmaXJzdERhdGVJbkN1cnJlbnRNb250aC5nZXREYXkoKTtcbiAgICAgICAgdmFyIGhlYWRpbmdEYXlzQ291bnQgPSB3ZWVrRGF5ID09PSAwID8gbWF4Q29sdW1uQ291bnQgOiB3ZWVrRGF5O1xuICAgICAgICB2YXIgZGF5c0NvdW50ID0gZ2V0TW9udGhEYXlzQ291bnRfKGZpcnN0RGF0ZUluQ3VycmVudE1vbnRoKTtcbiAgICAgICAgdmFyIHRyYWlsaW5nRGF5c0NvdW50ID0gbWF4Um93Q291bnQgKiBtYXhDb2x1bW5Db3VudCAtIGRheXNDb3VudCAtIGhlYWRpbmdEYXlzQ291bnQ7XG5cbiAgICAgICAgdmFyIGRhdGVzSW5mbyA9IFtdO1xuICAgICAgICB2YXIgdGVtcERhdGU7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkaW5nRGF5c0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHRlbXBEYXRlID0gZ2V0RGF5XyhmaXJzdERhdGVJbkN1cnJlbnRNb250aCwgaSAtIGhlYWRpbmdEYXlzQ291bnQpO1xuICAgICAgICAgICAgZGF0ZXNJbmZvLnB1c2goXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpc0hlYWRpbmdEYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IHRlbXBEYXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlbXBEYXRlID0gZmlyc3REYXRlSW5DdXJyZW50TW9udGg7XG4gICAgICAgIGZvciAodmFyIGRheSA9IDA7IGRheSA8IGRheXNDb3VudDsgZGF5KyspIHtcbiAgICAgICAgICAgIGRhdGVzSW5mby5wdXNoKHtcbiAgICAgICAgICAgICAgICBkYXRlOiB0ZW1wRGF0ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0ZW1wRGF0ZSA9IGdldERheV8odGVtcERhdGUsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgdHJhaWxpbmdEYXkgPSAwOyB0cmFpbGluZ0RheSA8IHRyYWlsaW5nRGF5c0NvdW50OyB0cmFpbGluZ0RheSsrKSB7XG4gICAgICAgICAgICBkYXRlc0luZm8ucHVzaChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlzVHJhaWxpbmdEYXk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IHRlbXBEYXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRlbXBEYXRlID0gZ2V0RGF5Xyh0ZW1wRGF0ZSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0ZXNJbmZvO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1vbnRoRGF5c0NvdW50XyhkYXRlKSB7XG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCk7XG5cbiAgICAgICAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgICAgICAgICAgeWVhciArPSAxO1xuICAgICAgICAgICAgbW9udGggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9udGggKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAobmV3IERhdGUoeWVhciwgbW9udGgsIDApKS5nZXREYXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2VsbExheW91dEluZm9fKGlzTW9udGhWaWV3SGVhZGVyKSB7XG4gICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSB0aGlzO1xuICAgICAgICB2YXIgYXJlYSA9IGlzTW9udGhWaWV3SGVhZGVyID8gJ21vbnRoVmlld0hlYWRlcicgOiAnbW9udGhWaWV3Q2VsbHMnO1xuICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IGxheW91dEVuZ2luZS5nZXRMYXlvdXRJbmZvKCk7XG4gICAgICAgIHZhciBjdXJyZW50TGF5b3V0SW5mbyA9IGxheW91dEluZm9bYXJlYV07XG4gICAgICAgIHZhciByb3dDb3VudCA9IGlzTW9udGhWaWV3SGVhZGVyID8gMSA6IG1heFJvd0NvdW50O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogTWF0aC5mbG9vcihjdXJyZW50TGF5b3V0SW5mby53aWR0aCAvIG1heENvbHVtbkNvdW50KSxcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5mbG9vcihjdXJyZW50TGF5b3V0SW5mby5oZWlnaHQgLyByb3dDb3VudClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2VuZHJlZ2lvblxuXG4gICAgLy9yZWdpb24gVGVtcGxhdGUgcmVsYXRlZFxuICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgaWYgKHNlbGYuY2FjaGVkVG1wbEZuXykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FjaGVkVG1wbEZuXztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGVtcGxhdGVTdHIgPSBnZXRSYXdSb3dUZW1wbGF0ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIGlzTW9udGhFdmVudCA9IHNlbGYub3B0aW9ucy52aWV3TW9kZSA9PT0gJ01vbnRoJztcbiAgICAgICAgdmFyIG9sZENvbFRtcGw7XG4gICAgICAgIHZhciBuZXdDb2xUbXBsO1xuICAgICAgICB2YXIgY3NzTmFtZTtcbiAgICAgICAgdmFyIHRhZ05hbWU7XG4gICAgICAgIHZhciBjb2xUbXBsO1xuXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVUZW1wbGF0ZUVsZW1lbnQodGVtcGxhdGVTdHIpO1xuICAgICAgICB0ZW1wbGF0ZVN0ciA9IGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dChlbGVtZW50KTtcblxuICAgICAgICB2YXIgYW5ub3RhdGlvbkNvbHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbHVtbl0nKTtcbiAgICAgICAgXy5lYWNoKGFubm90YXRpb25Db2xzLCBmdW5jdGlvbihhbm5vdGF0aW9uQ29sLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGNvbCA9IGdyaWQuZ2V0Q29sQnlJZF8oYW5ub3RhdGlvbkNvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sdW1uJykpO1xuICAgICAgICAgICAgdmFyIGNvbEFubm90YXRpb247XG4gICAgICAgICAgICBpZiAoY29sLmlzQ2FsY0NvbHVtbl8pIHtcbiAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gJ3t7PWl0LicgKyBjb2wuaWQgKyAnfX0nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUZpZWxkcyA9IGNvbC5kYXRhRmllbGQgPyBjb2wuZGF0YUZpZWxkLnNwbGl0KCcsJykgOiBbXTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUZpZWxkcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sQW5ub3RhdGlvbiA9ICd7ez1pdC4nICsgY29sLmRhdGFGaWVsZCArICd9fSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFGaWVsZHMsIGZ1bmN0aW9uKGRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGdyaWQuZ2V0Q29sQnlJZF8oZGF0YUZpZWxkKS5wcmVzZW50ZXIgfHwgJ3t7PWl0LicgKyBkYXRhRmllbGQgKyAnfX0nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSB0ZW1wLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xUbXBsID0gYW5ub3RhdGlvbkNvbDtcbiAgICAgICAgICAgIHRhZ05hbWUgPSBjb2xUbXBsLnRhZ05hbWU7XG4gICAgICAgICAgICBvbGRDb2xUbXBsID0gZG9tVXRpbC5nZXRFbGVtZW50T3V0ZXJUZXh0KGNvbFRtcGwpO1xuICAgICAgICAgICAgY3NzTmFtZSA9IChpc01vbnRoRXZlbnQgPyAnZ2MtbW9udGhldmVudCcgOiAnZ2MtZGF5c2V2ZW50JykgKyAnIGMnICsgaW5kZXg7XG5cbiAgICAgICAgICAgIG5ld0NvbFRtcGwgPSBvbGRDb2xUbXBsLnNsaWNlKDAsIG9sZENvbFRtcGwubGVuZ3RoIC0gKHRhZ05hbWUubGVuZ3RoICsgMykpICtcbiAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cImhlaWdodDoxMDAlO1wiPjxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XCIgY2xhc3M9XCInICsgY3NzTmFtZSArICdcIicgKyAnPicgK1xuICAgICAgICAgICAgICAgIChjb2wucHJlc2VudGVyID8gY29sLnByZXNlbnRlciA6IGNvbEFubm90YXRpb24pICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+PC9kaXY+PC8nICsgdGFnTmFtZSArICc+JztcblxuICAgICAgICAgICAgLy9vdXRlckhUTUwgcmV0dXJucyBkb3VibGUgcXVvdGVzIGluIGF0dHJpYnV0ZSBzb21ldGltZXNcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZVN0ci5pbmRleE9mKG9sZENvbFRtcGwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG9sZENvbFRtcGwgPSBvbGRDb2xUbXBsLnJlcGxhY2UoL1wiL2csICdcXCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBsYXRlU3RyID0gdGVtcGxhdGVTdHIucmVwbGFjZShvbGRDb2xUbXBsLCBuZXdDb2xUbXBsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHNlbGYuY2FjaGVkVG1wbEZuXyA9IGRvVC50ZW1wbGF0ZSh0ZW1wbGF0ZVN0ciwgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBzZWxmLmNhY2hlZFRtcGxGbl87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmF3Um93VGVtcGxhdGVfKCkge1xuICAgICAgICByZXR1cm4gZ2V0VXNlckRlZmluZWRUZW1wbGF0ZV8uY2FsbCh0aGlzKSB8fCBnZXREZWZhdWx0UmF3Um93VGVtcGxhdGVfLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZ2V0RXZlbnRUZW1wbGF0ZV8uY2FsbChzZWxmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFdmVudFRlbXBsYXRlXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29scyA9IHNlbGYuZ3JpZC5jb2x1bW5zO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gc2VsZi5vcHRpb25zLnZpZXdNb2RlID09PSAnTW9udGgnID8gJ21vbnRoZXZlbnQnIDogJ2RheWV2ZW50JztcblxuICAgICAgICB2YXIgciA9ICc8ZGl2IGNsYXNzPScgKyBjbGFzc05hbWUgKyAnPic7XG4gICAgICAgIF8uZWFjaChjb2xzLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgIGlmIChjb2wudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHIgKz0gJzxkaXYgY2xhc3M9XCJnYy1ldmVudC1jb2x1bW5cIiBzdHlsZT1cIndoaXRlLXNwYWNlOm5vd3JhcDtcIiBkYXRhLWNvbHVtbj1cIicgKyBjb2wuaWQgKyAnXCI+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHIgKz0gJzwvZGl2Pic7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVzZXJEZWZpbmVkVGVtcGxhdGVfKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJvd1RlbXBsYXRlKSB7XG4gICAgICAgICAgICB2YXIgcm93VG1wbCA9IG9wdGlvbnMucm93VGVtcGxhdGU7XG4gICAgICAgICAgICBpZiAoZ2NVdGlscy5pc1N0cmluZyhyb3dUbXBsKSAmJiByb3dUbXBsLmxlbmd0aCA+IDEgJiYgcm93VG1wbFswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocm93VG1wbC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRtcGxFbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvd1RtcGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy9lbmRyZWdpb25cblxuICAgIC8vcmVnaW9uIEdyb3VwIGRhdGFcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50Vmlld0dyb3Vwc18oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXJ0O1xuICAgICAgICB2YXIgZW5kO1xuICAgICAgICB2YXIgZmlsdGVyUmVzdWx0ID0gW107XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgZGF0ZTtcbiAgICAgICAgdmFyIHN0YXJ0RGF0ZTtcbiAgICAgICAgdmFyIHllYXI7XG4gICAgICAgIHZhciBtb250aDtcbiAgICAgICAgdmFyIGRpc3BsYXlpbmdEYXlzID0gb3B0aW9ucy52aWV3TW9kZSA9PT0gVklFV19EQVkgPyAxIDogNztcbiAgICAgICAgaWYgKG9wdGlvbnMudmlld01vZGUgIT09IFZJRVdfTU9OVEgpIHtcbiAgICAgICAgICAgIGRhdGUgPSBvcHRpb25zLnN0YXJ0RGF0ZTtcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgICAgIGVuZCA9IGdldERheV8oc3RhcnQsIGRpc3BsYXlpbmdEYXlzIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydERhdGUgPSBvcHRpb25zLnN0YXJ0RGF0ZTtcbiAgICAgICAgICAgIHllYXIgPSBzdGFydERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgIG1vbnRoID0gc3RhcnREYXRlLmdldE1vbnRoKCk7XG5cbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICAgICAgICAgICAgZW5kID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGdldE1vbnRoRGF5c0NvdW50XyhzdGFydERhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgIF8uZWFjaChzZWxmLmdyaWQuZ3JvdXBJbmZvc18sIGZ1bmN0aW9uKGdyb3VwSW5mbykge1xuICAgICAgICAgICAgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZ3JvdXAubmFtZSk7XG4gICAgICAgICAgICBpZiAoZGF0ZSA+PSBzdGFydCAmJiBkYXRlIDw9IGVuZCkge1xuICAgICAgICAgICAgICAgIGZpbHRlclJlc3VsdC5wdXNoKGdyb3VwSW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmlsdGVyUmVzdWx0O1xuICAgIH1cblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICAvL3JlZ2lvbiBGb3JtYXRWYWx1ZVxuICAgIGZ1bmN0aW9uIGdldE1vbnRoSGVhZGVyRm9ybWF0dGVkVmFsdWVfKCkge1xuICAgICAgICByZXR1cm4gWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNDb2x1bW5IZWFkZXJGb3JtYXR0ZWRWYWx1ZV8oZGF0ZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuY29sdW1uSGVhZGVyRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb25zLmNvbHVtbkhlYWRlckZvcm1hdHRlci5mb3JtYXQoZGF0ZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXREZWZhdWx0RGF0ZUZvcm1hdHRlZFZhbHVlXyhkYXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERheXNSb3dIZWFkZXJGb3JtYXR0ZWRWYWx1ZV8odGltZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMucm93SGVhZGVyRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vcHRpb25zLnJvd0hlYWRlckZvcm1hdHRlci5mb3JtYXQodGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RGVmYXVsdFRpbWVGb3JtYXR0ZWRWYWx1ZV8odGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0VGltZUZvcm1hdHRlZFZhbHVlXyhkYXRlKSB7XG4gICAgICAgIHZhciBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICByZXR1cm4gKGhvdXIgPj0gMTAgPyBob3VyIDogJzAnICsgaG91cikgKyAnOicgKyAobWludXRlcyA+PSAxMCA/IG1pbnV0ZXMgOiAnMCcgKyBtaW51dGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREZWZhdWx0RGF0ZUZvcm1hdHRlZFZhbHVlXyhkYXRlKSB7XG4gICAgICAgIHZhciBzdHJpbmdBcnJ5ID0gZGF0ZS50b0RhdGVTdHJpbmcoKS5zcGxpdCgnICcpO1xuICAgICAgICByZXR1cm4gc3RyaW5nQXJyeS5sZW5ndGggPT09IDQgPyBzdHJpbmdBcnJ5WzBdICsgJywnICsgc3RyaW5nQXJyeVsxXSArICcgJyArIHN0cmluZ0FycnlbMl0gOiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgIH1cblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICAvL3JlZ2lvbiBDb21tb24gbWV0aG9kXG4gICAgZnVuY3Rpb24gZ2V0RGF5XyhjdXJyZW50RGF0ZSwgZGF5c0NvdW50KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoY3VycmVudERhdGUpO1xuICAgICAgICB2YXIgdGltZVNwYW4gPSBPTkVfREFZICogZGF5c0NvdW50O1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyB0aW1lU3Bhbik7XG5cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VDbGlja18oc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBncmlkID0gc2VuZGVyO1xuICAgICAgICB2YXIgZ3JvdXBTdHJhdGVneSA9IGdyaWQubGF5b3V0RW5naW5lLmdyb3VwU3RyYXRlZ3lfO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGdyb3VwU3RyYXRlZ3kub3B0aW9ucztcbiAgICAgICAgdmFyIGhpdEluZm8gPSBncm91cFN0cmF0ZWd5LmhpdFRlc3QoZSk7XG4gICAgICAgIHZhciBncm91cEluZm87XG4gICAgICAgIHZhciBwb3BvdmVySW5mbztcbiAgICAgICAgdmFyIGdyb3VwO1xuICAgICAgICBpZiAoaGl0SW5mbykge1xuICAgICAgICAgICAgcG9wb3ZlckluZm8gPSBoaXRJbmZvLnBvcG92ZXJJbmZvO1xuICAgICAgICAgICAgaWYgKHBvcG92ZXJJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBvcG92ZXJJbmZvLm9uQ2xvc2VCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VQb3BvdmVyLmNhbGwoZ3JvdXBTdHJhdGVneSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmFpc2VFdmVudENsaWNrKGdyb3VwU3RyYXRlZ3ksIHBvcG92ZXJJbmZvLmdyb3VwUGF0aCwgcG9wb3ZlckluZm8ucm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgICAgICBpZiAoZ3JvdXBJbmZvICYmIGdyb3VwSW5mby5hY3Rpb24gPT09ICdldmVudExpbWl0Jykge1xuICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEluZm8ucGF0aCk7XG4gICAgICAgICAgICAgICAgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRMaW1pdEFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cCxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAncG9wb3ZlcicsXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGdyb3VwU3RyYXRlZ3kub25FdmVudExpbWl0Q2xpY2sucmFpc2UoZ3JpZCwgZXZlbnRMaW1pdEFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmIChldmVudExpbWl0QXJncyAmJiAhZXZlbnRMaW1pdEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBldmVudExpbWl0QXJncy5hY3Rpb24udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3BvcG92ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRFbGVtZW50T2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQocGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLWcnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IG9mZnNldC5sZWZ0IC0gcGFyZW50RWxlbWVudE9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IG9mZnNldC50b3AgLSBncm91cFN0cmF0ZWd5Lm9wdGlvbnMuZGF0ZUhlYWRlckhlaWdodCAtIHBhcmVudEVsZW1lbnRPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4Y2VsRm9ybWF0dGVyID0gZ2NVdGlscy5maW5kUGx1Z2luKCdGb3JtYXR0ZXInKS5FeGNlbEZvcm1hdHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXlGb3JtYXR0ZXIgPSBuZXcgZXhjZWxGb3JtYXR0ZXIoJ01NTU0gZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlciA9IGRheUZvcm1hdHRlci5mb3JtYXQobmV3IERhdGUoZ3JvdXAubmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpYWxvZ0lkID0gZ3JpZC51aWQgKyAnLXBvcG92ZXItZGlhbG9nJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3B1cFdpZHRoID0gMzAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBpZCA9JyArIGRpYWxvZ0lkICsgJyBzdHlsZSA9IFwiJyArICdwb3NpdGlvbjphYnNvbHV0ZTsnICsgJ3RvcDonICsgb2Zmc2V0VG9wICsgJ3B4O2xlZnQ6JyArIG9mZnNldExlZnQgKyAncHg7d2lkdGg6JyArIHBvcHVwV2lkdGggKyAncHg7XCIgY2xhc3M9XCJwb3BvdmVyLWRpYWxvZ1wiPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FkZCBoZWFkZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzID0gXCJwb3BvdmVyLWhlYWRlclwiPjxzcGFuIGNsYXNzPVwicG9wb3Zlci1oZWFkZXItdGV4dFwiPicgKyBoZWFkZXIgKyAnPC9zcGFuPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNsb3NlXCI+PHNwYW4gY2xhc3M9XCJnYy1pY29uIGNsb3NlLWljb25cIj48L3NwYW4+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3MgPSBcInBvcG92ZXItY29udGVudFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6JyArIHBvcHVwV2lkdGggKyAncHg7b3ZlcmZsb3c6YXV0bztcIj4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IGRpdi5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wb3ZlckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaWFsb2dJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIGRpYWxvZ0lkICsgJyAucG9wb3Zlci1jb250ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudC5zdHlsZS53aWR0aCA9IHBvcG92ZXJFbGVtZW50LmNsaWVudFdpZHRoICsgJ3B4JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gZG9tVXRpbC5nZXRTdHlsZShjb250ZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudFdpZHRoID0gY29udGVudEVsZW1lbnQuY2xpZW50V2lkdGggLSBwYXJzZUludChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgLSBwYXJzZUludChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwSGVpZ2h0KGdyb3VwSW5mbywge3dpZHRoOiBjb250ZW50V2lkdGh9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImdyb3VwLWNvbnRlbnRcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDonICsgY29udGFpbmVyU2l6ZS5oZWlnaHQgKyAncHg7XCI+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3dzID0gbGF5b3V0RW5naW5lLmdldElubmVyR3JvdXBSZW5kZXJJbmZvKGdyb3VwSW5mbywgY29udGFpbmVyU2l6ZSwgZ2V0TW9udGhFdmVudExheW91dENhbGxCYWNrLmJpbmQoZ3JvdXBTdHJhdGVneSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHJvd3MsIGZ1bmN0aW9uKHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ3JpZC5yZW5kZXJSb3dfKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50RWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdHJhdGVneS5wb3BvdmVyR3JvdXBJbmZvXyA9IGdyb3VwSW5mbztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdkYXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKGdyb3VwLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy52aWV3TW9kZSA9IFZJRVdfREFZO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9ncm91cFN0cmF0ZWd5LmNsZWFyUmVuZGVyQ2FjaGVfKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZ3JvdXAubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN0YXJ0RGF0ZSA9IGdldERheV8oZGF0ZSwgLTEgKiBkYXRlLmdldERheSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudmlld01vZGUgPSBWSUVXX1dFRUs7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2dyb3VwU3RyYXRlZ3kuY2xlYXJSZW5kZXJDYWNoZV8oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhaXNlRXZlbnRDbGljayhncm91cFN0cmF0ZWd5LCBncm91cEluZm8ucGF0aCwgZ3JvdXBJbmZvLnJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjRXZlbnRDb2x1bW5XaWR0aF8oc2VsZikge1xuICAgICAgICBpZiAoc2VsZi5jYWNoZWRJdGVtV2lkdGhfKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRJdGVtV2lkdGhfO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcblxuICAgICAgICB2YXIgY29udGFpbmVyUmVjdCA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lclJlY3QuaGVpZ2h0IC0gb3B0aW9ucy5jb2xIZWFkZXJIZWlnaHQ7XG4gICAgICAgIHZhciBjb250ZW50SGVpZ2h0ID0gTWF0aC5jZWlsKChvcHRpb25zLmVuZFRpbWUuZ2V0VGltZSgpIC0gb3B0aW9ucy5zdGFydFRpbWUuZ2V0VGltZSgpKSAvIChvcHRpb25zLnRpbWVVbml0ICogT05FX0hPVVIpKSAqIG9wdGlvbnMucm93SGVpZ2h0O1xuICAgICAgICB2YXIgd2lkdGggPSBjb250YWluZXJSZWN0LndpZHRoIC0gb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCAtICgoY29udGFpbmVySGVpZ2h0IDwgY29udGVudEhlaWdodCkgPyBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCA6IDApO1xuICAgICAgICB2YXIgdmlld01vZGUgPSBzZWxmLm9wdGlvbnMudmlld01vZGU7XG4gICAgICAgIGlmICh2aWV3TW9kZSA9PT0gVklFV19EQVkpIHtcbiAgICAgICAgICAgIHNlbGYuY2FjaGVkSXRlbVdpZHRoXyA9IHdpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKHZpZXdNb2RlID09PSBWSUVXX1dFRUspIHtcbiAgICAgICAgICAgIHNlbGYuY2FjaGVkSXRlbVdpZHRoXyA9IE1hdGguZmxvb3Iod2lkdGggLyA3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRJdGVtV2lkdGhfO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlVXBfKHNlbmRlciwgZSkge1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VEb3duXyhzZW5kZXIsIGUpIHtcbiAgICAgICAgdmFyIGdyaWQgPSBzZW5kZXI7XG4gICAgICAgIHZhciBncm91cFN0cmF0ZWd5ID0gZ3JpZC5sYXlvdXRFbmdpbmUuZ3JvdXBTdHJhdGVneV87XG4gICAgICAgIHZhciBoaXRJbmZvID0gZ3JvdXBTdHJhdGVneS5oaXRUZXN0KGUpO1xuICAgICAgICB2YXIgcG9wb3ZlckluZm87XG4gICAgICAgIGlmIChoaXRJbmZvKSB7XG4gICAgICAgICAgICBwb3BvdmVySW5mbyA9IGhpdEluZm8ucG9wb3ZlckluZm87XG4gICAgICAgICAgICBpZiAoIXBvcG92ZXJJbmZvKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VQb3BvdmVyLmNhbGwoZ3JvdXBTdHJhdGVneSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbG9zZVBvcG92ZXIuY2FsbChncm91cFN0cmF0ZWd5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhaXNlRXZlbnRDbGljayhzZWxmLCBncm91cFBhdGgsIGl0ZW1JbmRleCkge1xuICAgICAgICBpZiAoaXRlbUluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgdmFyIGV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgICAgICAvL2RhdGE6IGdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cFBhdGgpLmRhdGEuZ2V0SXRlbShpdGVtSW5kZXgpXG4gICAgICAgICAgICAgICAgZGF0YTogZ3JpZC5nZXRHcm91cEluZm9fKGdyb3VwUGF0aCkuZGF0YS5nZXRJdGVtKGl0ZW1JbmRleClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZWxmLm9uRXZlbnRDbGljay5yYWlzZShncmlkLCBldmVudEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VQb3BvdmVyKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgcG9wb3ZlckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctcG9wb3Zlci1kaWFsb2cnKTtcbiAgICAgICAgaWYgKHBvcG92ZXJFbGVtZW50KSB7XG4gICAgICAgICAgICBwb3BvdmVyRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvcG92ZXJFbGVtZW50KTtcbiAgICAgICAgICAgIHNlbGYucG9wb3Zlckdyb3VwSW5mb18gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5vblBvcG92ZXJDbG9zZS5yYWlzZShncmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlV2hlZWxfKHNlbmRlciwgZSkge1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbmRlcjtcbiAgICAgICAgdmFyIGdyb3VwU3RyYXRlZ3kgPSBncmlkLmxheW91dEVuZ2luZS5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgaWYgKGdyb3VwU3RyYXRlZ3kub3B0aW9ucy52aWV3TW9kZSAhPT0gJ0RheXMnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL3NpbXVsYXRlIHNjcm9sbFxuICAgICAgICB2YXIgb2Zmc2V0RGVsdGEgPSBlLmRlbHRhWTtcbiAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgbGF5b3V0ID0gKGdyb3VwU3RyYXRlZ3kuZ2V0TGF5b3V0SW5mbygpKS5kYXlzVmlld0NlbGxzO1xuICAgICAgICAgICAgdmFyIG1heE9mZnNldFRvcCA9IE1hdGgubWF4KGxheW91dC5jb250ZW50SGVpZ2h0ICsgZ3JvdXBTdHJhdGVneS5vcHRpb25zLmNvbEhlYWRlckhlaWdodCAtIGxheW91dC5oZWlnaHQsIDApO1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3A7XG4gICAgICAgICAgICBpZiAob2Zmc2V0RGVsdGEgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA+PSBtYXhPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKG9mZnNldFRvcCArIG9mZnNldERlbHRhLCBtYXhPZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9tVXRpbC5nZXRFbGVtZW50KCcjJyArIGdyaWQudWlkICsgJyAuZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwnKS5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENhbGVuZGFyU3RyYXRlZ3k7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZ3JvdXBTdHJhdGVnaWVzL0NhbGVuZGFyU3RyYXRlZ3kuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDRcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBVTkRFRklORUQgPSAndW5kZWZpbmVkJztcbiAgICB2YXIgZ2NVdGlscyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKHZhbCwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mKHZhbCkgPT09IHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FzdHMgYSB2YWx1ZSB0byBhIHR5cGUgaWYgcG9zc2libGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY2FzdC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9yIGludGVyZmFjZSBuYW1lIHRvIGNhc3QgdG8uXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluIGlmIHRoZSBjYXN0IHdhcyBzdWNjZXNzZnVsLCBudWxsIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cnlDYXN0KHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIC8vIG51bGwgZG9lc24ndCBpbXBsZW1lbnQgYW55dGhpbmdcbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZXN0IGZvciBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb24gKElRdWVyeUludGVyZmFjZSlcbiAgICAgICAgaWYgKGlzU3RyaW5nKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKSAmJiB2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKHR5cGUpID8gdmFsdWUgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciB0eXBlIHRlc3RcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgdHlwZSA/IHZhbHVlIDogbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnRyeUNhc3QgPSB0cnlDYXN0O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHByaW1pdGl2ZSB0eXBlIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgb3IgZGF0ZSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSB8fCBpc0Jvb2xlYW4odmFsdWUpIHx8IGlzRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdzdHJpbmcnKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzdHJpbmcgaXMgbnVsbCwgZW1wdHksIG9yIHdoaXRlc3BhY2Ugb25seS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgPyB0cnVlIDogdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKS5sZW5ndGggPCAxO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2UgPSBpc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnbnVtYmVyJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNJbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA9PT0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0ludCA9IGlzSW50O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIEJvb2xlYW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Z1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgVU5ERUZJTkVEKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgRGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih2YWx1ZS5nZXRUaW1lKCkpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNEYXRlID0gaXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBBcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0FycmF5ID0gaXNBcnJheTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gb2JqZWN0IChhcyBvcHBvc2VkIHRvIGEgdmFsdWUgdHlwZSBvciBhIGRhdGUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhaXNEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIGEgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKiBAcmV0dXJuIEEgQHNlZTpEYXRhVHlwZSB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUeXBlKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXJyYXknO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5nZXRUeXBlID0gZ2V0VHlwZTtcblxuICAgIGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzVW5kZWZpbmVkKHZhbHVlKSB8fCBpc051bGwodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNOdWxsID0gaXNOdWxsO1xuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwgPSBpc1VuZGVmaW5lZE9yTnVsbDtcblxuICAgIC8vVE9ETzogcmV2aWV3IHRoaXMgbWV0aG9kIGFmdGVyIGZvcm1tdHRlciBpbXBsZW1lbnRhdGlvbiBkb25lLlxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHR5cGUgb2YgYSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb252ZXJzaW9uIGZhaWxzLCB0aGUgb3JpZ2luYWwgdmFsdWUgaXMgcmV0dXJuZWQuIFRvIGNoZWNrIGlmIGFcbiAgICAgKiBjb252ZXJzaW9uIHN1Y2NlZWRlZCwgeW91IHNob3VsZCBjaGVjayB0aGUgdHlwZSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY29udmVydC5cbiAgICAgKiBAcGFyYW0gdHlwZSBAc2VlOkRhdGFUeXBlIHRvIGNvbnZlcnQgdGhlIHZhbHVlIHRvLlxuICAgICAqIEByZXR1cm4gVGhlIGNvbnZlcnRlZCB2YWx1ZSwgb3IgdGhlIG9yaWdpbmFsIHZhbHVlIGlmIGEgY29udmVyc2lvbiB3YXMgbm90IHBvc3NpYmxlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IHN0cmluZ3MgdG8gbnVtYmVycywgZGF0ZXMsIG9yIGJvb2xlYW5zXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4obnVtKSA/IHZhbHVlIDogbnVtO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgYW55dGhpbmcgdG8gc3RyaW5nXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNoYW5nZVR5cGUgPSBjaGFuZ2VUeXBlO1xuICAgIC8vXG4gICAgLy8vKipcbiAgICAvLyAqIFJlcGxhY2VzIGVhY2ggZm9ybWF0IGl0ZW0gaW4gYSBzcGVjaWZpZWQgc3RyaW5nIHdpdGggdGhlIHRleHQgZXF1aXZhbGVudCBvZiBhblxuICAgIC8vICogb2JqZWN0J3MgdmFsdWUuXG4gICAgLy8gKlxuICAgIC8vICogVGhlIGZ1bmN0aW9uIHdvcmtzIGJ5IHJlcGxhY2luZyBwYXJ0cyBvZiB0aGUgPGI+Zm9ybWF0U3RyaW5nPC9iPiB3aXRoIHRoZSBwYXR0ZXJuXG4gICAgLy8gKiAne25hbWU6Zm9ybWF0fScgd2l0aCBwcm9wZXJ0aWVzIG9mIHRoZSA8Yj5kYXRhPC9iPiBwYXJhbWV0ZXIuIEZvciBleGFtcGxlOlxuICAgIC8vICpcbiAgICAvLyAqIDxwcmU+XG4gICAgLy8gKiB2YXIgZGF0YSA9IHsgbmFtZTogJ0pvZScsIGFtb3VudDogMTIzNDU2IH07XG4gICAgLy8gKiB2YXIgbXNnID0gd2lqbW8uZm9ybWF0KCdIZWxsbyB7bmFtZX0sIHlvdSB3b24ge2Ftb3VudDpuMn0hJywgZGF0YSk7XG4gICAgLy8gKiA8L3ByZT5cbiAgICAvLyAqXG4gICAgLy8gKiBUaGUgb3B0aW9uYWwgPGI+Zm9ybWF0RnVuY3Rpb248L2I+IGFsbG93cyB5b3UgdG8gY3VzdG9taXplIHRoZSBjb250ZW50IGJ5IHByb3ZpZGluZ1xuICAgIC8vICogY29udGV4dC1zZW5zaXRpdmUgZm9ybWF0dGluZy4gSWYgcHJvdmlkZWQsIHRoZSBmb3JtYXQgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgZm9yIGVhY2hcbiAgICAvLyAqIGZvcm1hdCBlbGVtZW50IGFuZCBnZXRzIHBhc3NlZCB0aGUgZGF0YSBvYmplY3QsIHRoZSBwYXJhbWV0ZXIgbmFtZSwgdGhlIGZvcm1hdCxcbiAgICAvLyAqIGFuZCB0aGUgdmFsdWU7IGl0IHNob3VsZCByZXR1cm4gYW4gb3V0cHV0IHN0cmluZy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gKlxuICAgIC8vICogPHByZT5cbiAgICAvLyAqIHZhciBkYXRhID0geyBuYW1lOiAnSm9lJywgYW1vdW50OiAxMjM0NTYgfTtcbiAgICAvLyAqIHZhciBtc2cgPSB3aWptby5mb3JtYXQoJ0hlbGxvIHtuYW1lfSwgeW91IHdvbiB7YW1vdW50Om4yfSEnLCBkYXRhLFxuICAgIC8vICogICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEsIG5hbWUsIGZtdCwgdmFsKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgaWYgKHdpam1vLmlzU3RyaW5nKGRhdGFbbmFtZV0pKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgICAgIHZhbCA9IHdpam1vLmVzY2FwZUh0bWwoZGF0YVtuYW1lXSk7XG4gICAgLy8qICAgICAgICAgICAgICAgfVxuICAgIC8vKiAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgLy8qICAgICAgICAgICAgIH0pO1xuICAgIC8vICogPC9wcmU+XG4gICAgLy8gKlxuICAgIC8vICogQHBhcmFtIGZvcm1hdCBBIGNvbXBvc2l0ZSBmb3JtYXQgc3RyaW5nLlxuICAgIC8vICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2JqZWN0IHVzZWQgdG8gYnVpbGQgdGhlIHN0cmluZy5cbiAgICAvLyAqIEBwYXJhbSBmb3JtYXRGdW5jdGlvbiBBbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvIGZvcm1hdCBpdGVtcyBpbiBjb250ZXh0LlxuICAgIC8vICogQHJldHVybiBUaGUgZm9ybWF0dGVkIHN0cmluZy5cbiAgICAvLyAqL1xuICAgIC8vZnVuY3Rpb24gZm9ybWF0KGZvcm1hdCwgZGF0YSwgZm9ybWF0RnVuY3Rpb24pIHtcbiAgICAvLyAgICBmb3JtYXQgPSBhc1N0cmluZyhmb3JtYXQpO1xuICAgIC8vICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgvXFx7KC4qPykoOiguKj8pKT9cXH0vZywgZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCB4LCBmbXQpIHtcbiAgICAvLyAgICAgICAgdmFyIHZhbCA9IG1hdGNoO1xuICAgIC8vICAgICAgICBpZiAobmFtZSAmJiBuYW1lWzBdICE9ICd7JyAmJiBkYXRhKSB7XG4gICAgLy8gICAgICAgICAgICAvLyBnZXQgdGhlIHZhbHVlXG4gICAgLy8gICAgICAgICAgICB2YWwgPSBkYXRhW25hbWVdO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBhcHBseSBzdGF0aWMgZm9ybWF0XG4gICAgLy8gICAgICAgICAgICBpZiAoZm10KSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gd2lqbW8uR2xvYmFsaXplLmZvcm1hdCh2YWwsIGZtdCk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIC8vIGFwcGx5IGZvcm1hdCBmdW5jdGlvblxuICAgIC8vICAgICAgICAgICAgaWYgKGZvcm1hdEZ1bmN0aW9uKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gZm9ybWF0RnVuY3Rpb24oZGF0YSwgbmFtZSwgZm10LCB2YWwpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgICAgIHJldHVybiB2YWwgPT0gbnVsbCA/ICcnIDogdmFsO1xuICAgIC8vICAgIH0pO1xuICAgIC8vfVxuICAgIC8vZ2NVdGlscy5mb3JtYXQgPSBmb3JtYXQ7XG5cbiAgICAvKipcbiAgICAgKiBDbGFtcHMgYSB2YWx1ZSBiZXR3ZWVuIGEgbWluaW11bSBhbmQgYSBtYXhpbXVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIE9yaWdpbmFsIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtaW4gTWluaW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtYXggTWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChtYXgpICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKG1pbikgJiYgdmFsdWUgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1pbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jbGFtcCA9IGNsYW1wO1xuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHRoZSBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0IHRvIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBUaGUgZGVzdGluYXRpb24gb2JqZWN0IG11c3QgZGVmaW5lIGFsbCB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBzb3VyY2UsXG4gICAgICogb3IgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZHN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHNyYyBUaGUgc291cmNlIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3B5KGRzdCwgc3JjKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXkgaW4gZHN0LCAnVW5rbm93biBrZXkgXCInICsga2V5ICsgJ1wiLicpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XG4gICAgICAgICAgICBpZiAoIWRzdC5fY29weSB8fCAhZHN0Ll9jb3B5KGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBkc3Rba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjb3B5KGRzdFtrZXldLCB2YWx1ZSk7IC8vIGNvcHkgc3ViLW9iamVjdHNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHZhbHVlOyAvLyBhc3NpZ24gdmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jb3B5ID0gY29weTtcblxuICAgIC8qKlxuICAgICAqIFRocm93cyBhbiBleGNlcHRpb24gaWYgYSBjb25kaXRpb24gaXMgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29uZGl0aW9uIENvbmRpdGlvbiBleHBlY3RlZCB0byBiZSB0cnVlLlxuICAgICAqIEBwYXJhbSBtc2cgTWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IHRydWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnKSB7XG4gICAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyAnKiogQXNzZXJ0aW9uIGZhaWxlZCBpbiBXaWptbzogJyArIG1zZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdjVXRpbHMuYXNzZXJ0ID0gYXNzZXJ0O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBzdHJpbmcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHN0cmluZyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNTdHJpbmcodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzU3RyaW5nKHZhbHVlKSwgJ1N0cmluZyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNTdHJpbmcgPSBhc1N0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIG51bWVyaWMuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEBwYXJhbSBwb3NpdGl2ZSBXaGV0aGVyIHRvIGFjY2VwdCBvbmx5IHBvc2l0aXZlIG51bWVyaWMgdmFsdWVzLlxuICAgICAqIEByZXR1cm4gVGhlIG51bWJlciBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNOdW1iZXIodmFsdWUsIG51bGxPSywgcG9zaXRpdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja1R5cGUocG9zaXRpdmUsIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc051bWJlcih2YWx1ZSksICdOdW1iZXIgZXhwZWN0ZWQuJyk7XG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiB2YWx1ZSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdQb3NpdGl2ZSBudW1iZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc051bWJlciA9IGFzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhbiBpbnRlZ2VyLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpdmUgV2hldGhlciB0byBhY2NlcHQgb25seSBwb3NpdGl2ZSBpbnRlZ2Vycy5cbiAgICAgKiBAcmV0dXJuIFRoZSBudW1iZXIgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzSW50KHZhbHVlLCBudWxsT0ssIHBvc2l0aXZlKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tUeXBlKHBvc2l0aXZlLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBwb3NpdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNJbnQodmFsdWUpLCAnSW50ZWdlciBleHBlY3RlZC4nKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIHZhbHVlICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Bvc2l0aXZlIGludGVnZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0ludCA9IGFzSW50O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBCb29sZWFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIEJvb2xlYW4uXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEJvb2xlYW4gcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzQm9vbGVhbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzQm9vbGVhbih2YWx1ZSksICdCb29sZWFuIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0Jvb2xlYW4gPSBhc0Jvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIERhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBEYXRlLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBEYXRlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0RhdGUodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0RhdGUodmFsdWUpLCAnRGF0ZSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNEYXRlID0gYXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBmdW5jdGlvbiBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNGdW5jdGlvbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzRnVuY3Rpb24odmFsdWUpLCAnRnVuY3Rpb24gZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRnVuY3Rpb24gPSBhc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYW4gYXJyYXkuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIGFycmF5IHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0FycmF5KHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNBcnJheSh2YWx1ZSksICdBcnJheSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNBcnJheSA9IGFzQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIGdpdmVuIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgY2hlY2tlZC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIHZhbHVlIGV4cGVjdGVkLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNUeXBlKHZhbHVlLCB0eXBlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgdmFsdWUgaW5zdGFuY2VvZiB0eXBlLCB0eXBlICsgJyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNUeXBlID0gYXNUeXBlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSB2YWxpZCBzZXR0aW5nIGZvciBhbiBlbnVtZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIG1lbWJlciBvZiB0aGUgZW51bWVyYXRpb24uXG4gICAgICogQHBhcmFtIGVudW1UeXBlIEVudW1lcmF0aW9uIHRvIHRlc3QgZm9yLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNFbnVtKHZhbHVlLCBlbnVtVHlwZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNVbmRlZmluZWRPck51bGwodmFsdWUpICYmIG51bGxPSykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSBlbnVtVHlwZVt2YWx1ZV07XG4gICAgICAgIGFzc2VydCghaXNVbmRlZmluZWRPck51bGwoZSksICdJbnZhbGlkIGVudW0gdmFsdWUuJyk7XG4gICAgICAgIHJldHVybiBpc051bWJlcihlKSA/IGUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRW51bSA9IGFzRW51bTtcblxuICAgIC8qKlxuICAgICAqIEVudW1lcmF0aW9uIHdpdGgga2V5IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgZW51bWVyYXRpb24gaXMgdXNlZnVsIHdoZW4gaGFuZGxpbmcgPGI+a2V5RG93bjwvYj4gZXZlbnRzLlxuICAgICAqL1xuICAgIHZhciBLZXkgPSB7XG4gICAgICAgIC8qKiBUaGUgYmFja3NwYWNlIGtleS4gKi9cbiAgICAgICAgQmFjazogOCxcbiAgICAgICAgLyoqIFRoZSB0YWIga2V5LiAqL1xuICAgICAgICBUYWI6IDksXG4gICAgICAgIC8qKiBUaGUgZW50ZXIga2V5LiAqL1xuICAgICAgICBFbnRlcjogMTMsXG4gICAgICAgIC8qKiBUaGUgZXNjYXBlIGtleS4gKi9cbiAgICAgICAgRXNjYXBlOiAyNyxcbiAgICAgICAgLyoqIFRoZSBzcGFjZSBrZXkuICovXG4gICAgICAgIFNwYWNlOiAzMixcbiAgICAgICAgLyoqIFRoZSBwYWdlIHVwIGtleS4gKi9cbiAgICAgICAgUGFnZVVwOiAzMyxcbiAgICAgICAgLyoqIFRoZSBwYWdlIGRvd24ga2V5LiAqL1xuICAgICAgICBQYWdlRG93bjogMzQsXG4gICAgICAgIC8qKiBUaGUgZW5kIGtleS4gKi9cbiAgICAgICAgRW5kOiAzNSxcbiAgICAgICAgLyoqIFRoZSBob21lIGtleS4gKi9cbiAgICAgICAgSG9tZTogMzYsXG4gICAgICAgIC8qKiBUaGUgbGVmdCBhcnJvdyBrZXkuICovXG4gICAgICAgIExlZnQ6IDM3LFxuICAgICAgICAvKiogVGhlIHVwIGFycm93IGtleS4gKi9cbiAgICAgICAgVXA6IDM4LFxuICAgICAgICAvKiogVGhlIHJpZ2h0IGFycm93IGtleS4gKi9cbiAgICAgICAgUmlnaHQ6IDM5LFxuICAgICAgICAvKiogVGhlIGRvd24gYXJyb3cga2V5LiAqL1xuICAgICAgICBEb3duOiA0MCxcbiAgICAgICAgLyoqIFRoZSBkZWxldGUga2V5LiAqL1xuICAgICAgICBEZWxldGU6IDQ2LFxuICAgICAgICAvKiogVGhlIEYxIGtleS4gKi9cbiAgICAgICAgRjE6IDExMixcbiAgICAgICAgLyoqIFRoZSBGMiBrZXkuICovXG4gICAgICAgIEYyOiAxMTMsXG4gICAgICAgIC8qKiBUaGUgRjMga2V5LiAqL1xuICAgICAgICBGMzogMTE0LFxuICAgICAgICAvKiogVGhlIEY0IGtleS4gKi9cbiAgICAgICAgRjQ6IDExNSxcbiAgICAgICAgLyoqIFRoZSBGNSBrZXkuICovXG4gICAgICAgIEY1OiAxMTYsXG4gICAgICAgIC8qKiBUaGUgRjYga2V5LiAqL1xuICAgICAgICBGNjogMTE3LFxuICAgICAgICAvKiogVGhlIEY3IGtleS4gKi9cbiAgICAgICAgRjc6IDExOCxcbiAgICAgICAgLyoqIFRoZSBGOCBrZXkuICovXG4gICAgICAgIEY4OiAxMTksXG4gICAgICAgIC8qKiBUaGUgRjkga2V5LiAqL1xuICAgICAgICBGOTogMTIwLFxuICAgICAgICAvKiogVGhlIEYxMCBrZXkuICovXG4gICAgICAgIEYxMDogMTIxLFxuICAgICAgICAvKiogVGhlIEYxMSBrZXkuICovXG4gICAgICAgIEYxMTogMTIyLFxuICAgICAgICAvKiogVGhlIEYxMiBrZXkuICovXG4gICAgICAgIEYxMjogMTIzXG4gICAgfTtcbiAgICBnY1V0aWxzLktleSA9IEtleTtcblxuICAgIHZhciBFZGl0b3JUeXBlID0ge1xuICAgICAgICAnVGV4dCc6ICd0ZXh0JyxcbiAgICAgICAgJ0NoZWNrQm94JzogJ2NoZWNrYm94JyxcbiAgICAgICAgJ0RhdGUnOiAnZGF0ZScsXG4gICAgICAgICdDb2xvcic6ICdjb2xvcicsXG4gICAgICAgICdOdW1iZXInOiAnbnVtYmVyJ1xuICAgIH07XG4gICAgZ2NVdGlscy5FZGl0b3JUeXBlID0gRWRpdG9yVHlwZTtcblxuICAgIHZhciBEYXRhVHlwZSA9IHtcbiAgICAgICAgJ09iamVjdCc6ICdPYmplY3QnLFxuICAgICAgICAnU3RyaW5nJzogJ1N0cmluZycsXG4gICAgICAgICdOdW1iZXInOiAnTnVtYmVyJyxcbiAgICAgICAgJ0Jvb2xlYW4nOiAnQm9vbGVhbicsXG4gICAgICAgICdEYXRlJzogJ0RhdGUnLFxuICAgICAgICAnQXJyYXknOiAnQXJyYXknXG4gICAgfTtcbiAgICBnY1V0aWxzLkRhdGFUeXBlID0gRGF0YVR5cGU7XG5cbiAgICB2YXIgaXNVbml0bGVzc051bWJlciA9IHtcbiAgICAgICAgY29sdW1uQ291bnQ6IHRydWUsXG4gICAgICAgIGZsZXg6IHRydWUsXG4gICAgICAgIGZsZXhHcm93OiB0cnVlLFxuICAgICAgICBmbGV4U2hyaW5rOiB0cnVlLFxuICAgICAgICBmb250V2VpZ2h0OiB0cnVlLFxuICAgICAgICBsaW5lQ2xhbXA6IHRydWUsXG4gICAgICAgIGxpbmVIZWlnaHQ6IHRydWUsXG4gICAgICAgIG9wYWNpdHk6IHRydWUsXG4gICAgICAgIG9yZGVyOiB0cnVlLFxuICAgICAgICBvcnBoYW5zOiB0cnVlLFxuICAgICAgICB3aWRvd3M6IHRydWUsXG4gICAgICAgIHpJbmRleDogdHJ1ZSxcbiAgICAgICAgem9vbTogdHJ1ZSxcblxuICAgICAgICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gICAgICAgIGZpbGxPcGFjaXR5OiB0cnVlLFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB0cnVlXG4gICAgfTtcbiAgICB2YXIgX3VwcGVyY2FzZVBhdHRlcm4gPSAvKFtBLVpdKS9nO1xuICAgIHZhciBtc1BhdHRlcm4gPSAvXi1tcy0vO1xuXG4gICAgZnVuY3Rpb24gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaXNFbXB0eSA9IGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB2YWx1ZSA9PT0gJyc7XG4gICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNOb25OdW1lcmljID0gaXNOYU4odmFsdWUpO1xuICAgICAgICBpZiAoaXNOb25OdW1lcmljIHx8IHZhbHVlID09PSAwIHx8XG4gICAgICAgICAgICBpc1VuaXRsZXNzTnVtYmVyLmhhc093blByb3BlcnR5KG5hbWUpICYmIGlzVW5pdGxlc3NOdW1iZXJbbmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiAnJyArIHZhbHVlOyAvLyBjYXN0IHRvIHN0cmluZ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSArICdweCc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVtb2l6ZVN0cmluZ09ubHkoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhY2hlID0ge307XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhY2hlW3N0cmluZ10gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHByb2Nlc3NTdHlsZU5hbWUgPSBtZW1vaXplU3RyaW5nT25seShmdW5jdGlvbihzdHlsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHlsZU5hbWUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX3VwcGVyY2FzZVBhdHRlcm4sICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCAnLW1zLScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hcmt1cEZvclN0eWxlcyhzdHlsZXMpIHtcbiAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHN0eWxlcykge1xuICAgICAgICAgICAgaWYgKCFzdHlsZXMuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBzdHlsZXNbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwoc3R5bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IHByb2Nlc3NTdHlsZU5hbWUoc3R5bGVOYW1lKSArICc6JztcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IGRhbmdlcm91c1N0eWxlVmFsdWUoc3R5bGVOYW1lLCBzdHlsZVZhbHVlKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VyaWFsaXplZCB8fCBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzID0gY3JlYXRlTWFya3VwRm9yU3R5bGVzO1xuXG4gICAgLyoqXG4gICAgICogQ2FuY2VscyB0aGUgcm91dGUgZm9yIERPTSBldmVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZWxEZWZhdWx0KGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL0lFIDhcbiAgICAgICAgICAgIGUuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2FuY2VsRGVmYXVsdCA9IGNhbmNlbERlZmF1bHQ7XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVPYmplY3Qob2JqKSB7XG4gICAgICAgIHZhciBjbG9uZU9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICAgICAgdmFyIGNhY2hlXyA9IFtdO1xuICAgICAgICBpZiAoY2xvbmVPYmopIHtcbiAgICAgICAgICAgIGNhY2hlXy5wdXNoKGNsb25lT2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdDtcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oZGVzdFtpdGVtXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IHNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmVPYmo7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemVPYmplY3Q7XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZU9iamVjdChvYmopIHtcbiAgICAgICAgdmFyIGNsb25lT2JqID0gXy5jbG9uZShvYmopO1xuICAgICAgICB2YXIgY2FjaGVfID0gW107XG4gICAgICAgIGlmIChjbG9uZU9iaikge1xuICAgICAgICAgICAgY2FjaGVfLnB1c2goY2xvbmVPYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0O1xuICAgICAgICB2YXIgZnVuYztcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGRlc3RbaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IGZ1bmM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lT2JqO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVPYmplY3QgPSBkZXNlcmlhbGl6ZU9iamVjdDtcblxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuc2VyaWFsaXplRnVuY3Rpb24gPSBzZXJpYWxpemVGdW5jdGlvbjtcblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHRlbXBTdHIgPSB2YWx1ZS5zdWJzdHIoOCwgdmFsdWUuaW5kZXhPZignKCcpIC0gOCk7IC8vOCBpcyAnZnVuY3Rpb24nIGxlbmd0aFxuICAgICAgICAgICAgaWYgKHZhbHVlLnN1YnN0cigwLCA4KSA9PT0gJ2Z1bmN0aW9uJyAmJiB0ZW1wU3RyLnJlcGxhY2UoL1xccysvLCAnJykgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ1N0YXJ0ID0gdmFsdWUuaW5kZXhPZignKCcpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYXJnRW5kID0gdmFsdWUuaW5kZXhPZignKScpO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gdmFsdWUuc3Vic3RyKGFyZ1N0YXJ0LCBhcmdFbmQgLSBhcmdTdGFydCkuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcucmVwbGFjZSgvXFxzKy8sICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keVN0YXJ0ID0gdmFsdWUuaW5kZXhPZigneycpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keUVuZCA9IHZhbHVlLmxhc3RJbmRleE9mKCd9Jyk7XG4gICAgICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYXJncywgdmFsdWUuc3Vic3RyKGJvZHlTdGFydCwgYm9keUVuZCAtIGJvZHlTdGFydCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVGdW5jdGlvbiA9IGRlc2VyaWFsaXplRnVuY3Rpb247XG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gQHNlZTpJQ29sbGVjdGlvblZpZXcgb3IgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb3IgQHNlZTpJQ29sbGVjdGlvblZpZXcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEBzZWU6SUNvbGxlY3Rpb25WaWV3IHRoYXQgd2FzIHBhc3NlZCBpbiBvciBhIEBzZWU6Q29sbGVjdGlvblZpZXdcbiAgICAgKiBjcmVhdGVkIGZyb20gdGhlIGFycmF5IHRoYXQgd2FzIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICAvKlxuICAgICBmdW5jdGlvbiBhc0NvbGxlY3Rpb25WaWV3KHZhbHVlLCBudWxsT0spIHtcbiAgICAgaWYgKHR5cGVvZiBudWxsT0sgPT09IFwidW5kZWZpbmVkXCIpIHsgbnVsbE9LID0gdHJ1ZTsgfVxuICAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBudWxsT0spIHtcbiAgICAgcmV0dXJuIG51bGw7XG4gICAgIH1cbiAgICAgdmFyIGN2ID0gdHJ5Q2FzdCh2YWx1ZSwgJ0lDb2xsZWN0aW9uVmlldycpO1xuICAgICBpZiAoY3YgIT0gbnVsbCkge1xuICAgICByZXR1cm4gY3Y7XG4gICAgIH1cbiAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xuICAgICBhc3NlcnQoZmFsc2UsICdBcnJheSBvciBJQ29sbGVjdGlvblZpZXcgZXhwZWN0ZWQuJyk7XG4gICAgIH1cbiAgICAgcmV0dXJuIG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyh2YWx1ZSk7XG4gICAgIH1cbiAgICAgZ2NVdGlscy5hc0NvbGxlY3Rpb25WaWV3ID0gYXNDb2xsZWN0aW9uVmlldzsqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcGx1Z2luIG1vZHVsZS5cbiAgICAgKiBAcGFyYW0gbmFtZSBvZiBtb2R1bGVcbiAgICAgKiBAcmV0dXJucyBwbHVnaW4gbW9kdWxlIG9iamVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRQbHVnaW4obmFtZSkge1xuICAgICAgICB2YXIgcGx1Z2luO1xuICAgICAgICAvLyBmaW5kIGZyb20gZ2xvYmFsXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBHY1NwcmVhZC5WaWV3cy5HY0dyaWQuUGx1Z2luc1tuYW1lXTsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy8gICAgcGx1Z2luID0gcmVxdWlyZWpzICYmIHJlcXVpcmVqcyhuYW1lKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIC8vLy8gY29tbW9uanMgbm90IHN1cHBvcnRlZCBub3dcbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIHJldHVybiBwbHVnaW47XG4gICAgfVxuXG4gICAgZ2NVdGlscy5maW5kUGx1Z2luID0gZmluZFBsdWdpbjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZ2NVdGlscztcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9nY1V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIi8vIGRvVC5qc1xuLy8gMjAxMS0yMDE0LCBMYXVyYSBEb2t0b3JvdmEsIGh0dHBzOi8vZ2l0aHViLmNvbS9vbGFkby9kb1Rcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZG9UID0ge1xuICAgICAgICB2ZXJzaW9uOiBcIjEuMC4zXCIsXG4gICAgICAgIHRlbXBsYXRlU2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGV2YWx1YXRlOiAvXFx7XFx7KFtcXHNcXFNdKz8oXFx9PykrKVxcfVxcfS9nLFxuICAgICAgICAgICAgaW50ZXJwb2xhdGU6IC9cXHtcXHs9KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICBlbmNvZGU6IC9cXHtcXHshKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2U6IC9cXHtcXHsjKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2VQYXJhbXM6IC8oXnxbXlxcdyRdKWRlZig/OlxcLnxcXFtbXFwnXFxcIl0pKFtcXHckXFwuXSspKD86W1xcJ1xcXCJdXFxdKT9cXHMqXFw6XFxzKihbXFx3JFxcLl0rfFxcXCJbXlxcXCJdK1xcXCJ8XFwnW15cXCddK1xcJ3xcXHtbXlxcfV0rXFx9KS9nLFxuICAgICAgICAgICAgZGVmaW5lOiAvXFx7XFx7IyNcXHMqKFtcXHdcXC4kXSspXFxzKihcXDp8PSkoW1xcc1xcU10rPykjXFx9XFx9L2csXG4gICAgICAgICAgICBkZWZpbmVQYXJhbXM6IC9eXFxzKihbXFx3JF0rKTooW1xcc1xcU10rKS8sXG4gICAgICAgICAgICBjb25kaXRpb25hbDogL1xce1xce1xcPyhcXD8pP1xccyooW1xcc1xcU10qPylcXHMqXFx9XFx9L2csXG4gICAgICAgICAgICBpdGVyYXRlOiAvXFx7XFx7flxccyooPzpcXH1cXH18KFtcXHNcXFNdKz8pXFxzKlxcOlxccyooW1xcdyRdKylcXHMqKD86XFw6XFxzKihbXFx3JF0rKSk/XFxzKlxcfVxcfSkvZyxcbiAgICAgICAgICAgIHZhcm5hbWU6IFwiaXRcIixcbiAgICAgICAgICAgIHN0cmlwOiB0cnVlLFxuICAgICAgICAgICAgYXBwZW5kOiB0cnVlLFxuICAgICAgICAgICAgc2VsZmNvbnRhaW5lZDogZmFsc2UsXG4gICAgICAgICAgICBkb05vdFNraXBFbmNvZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLCAvL2ZuLCBjb21waWxlIHRlbXBsYXRlXG4gICAgICAgIGNvbXBpbGU6IHVuZGVmaW5lZCAgLy9mbiwgZm9yIGV4cHJlc3NcbiAgICB9LCBfZ2xvYmFscztcblxuICAgIGRvVC5lbmNvZGVIVE1MU291cmNlID0gZnVuY3Rpb24oZG9Ob3RTa2lwRW5jb2RlZCkge1xuICAgICAgICB2YXIgZW5jb2RlSFRNTFJ1bGVzID0ge1wiJlwiOiBcIiYjMzg7XCIsIFwiPFwiOiBcIiYjNjA7XCIsIFwiPlwiOiBcIiYjNjI7XCIsICdcIic6IFwiJiMzNDtcIiwgXCInXCI6IFwiJiMzOTtcIiwgXCIvXCI6IFwiJiM0NztcIn0sXG4gICAgICAgICAgICBtYXRjaEhUTUwgPSBkb05vdFNraXBFbmNvZGVkID8gL1smPD5cIidcXC9dL2cgOiAvJig/ISM/XFx3KzspfDx8PnxcInwnfFxcLy9nO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGUgPyBjb2RlLnRvU3RyaW5nKCkucmVwbGFjZShtYXRjaEhUTUwsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTFJ1bGVzW21dIHx8IG07XG4gICAgICAgICAgICB9KSA6IFwiXCI7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgX2dsb2JhbHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzIHx8ICgwLCBldmFsKShcInRoaXNcIik7XG4gICAgfSgpKTtcblxuICAgIC8vSGliZXJcbiAgICAvL3JlcGxhdGUgdGhlIG1vZHVsZSBkZWZpbml0aW9uIHdpdGggc2ltcGxlIG1vZHVsZS5leHBvcnRzIHNpbmNlIHdlIG9ubHkgcnVuXG4gICAgLy9pdCBpbiBub2RlIGxpa2UgZW52aXJvbm1lbnRcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9UO1xuICAgIC8vaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvL1xuICAgIC8vfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vXHRkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZG9UO30pO1xuICAgIC8vfSBlbHNlIHtcbiAgICAvL1x0X2dsb2JhbHMuZG9UID0gZG9UO1xuICAgIC8vfVxuXG4gICAgdmFyIHN0YXJ0ZW5kID0ge1xuICAgICAgICBhcHBlbmQ6IHtzdGFydDogXCInKyhcIiwgZW5kOiBcIikrJ1wiLCBzdGFydGVuY29kZTogXCInK2VuY29kZUhUTUwoXCJ9LFxuICAgICAgICBzcGxpdDoge3N0YXJ0OiBcIic7b3V0Kz0oXCIsIGVuZDogXCIpO291dCs9J1wiLCBzdGFydGVuY29kZTogXCInO291dCs9ZW5jb2RlSFRNTChcIn1cbiAgICB9LCBza2lwID0gLyReLztcblxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZWZzKGMsIGJsb2NrLCBkZWYpIHtcbiAgICAgICAgcmV0dXJuICgodHlwZW9mIGJsb2NrID09PSBcInN0cmluZ1wiKSA/IGJsb2NrIDogYmxvY2sudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZGVmaW5lIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUsIGFzc2lnbiwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiZGVmLlwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZS5zdWJzdHJpbmcoNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghKGNvZGUgaW4gZGVmKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXNzaWduID09PSBcIjpcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuZGVmaW5lUGFyYW1zKSB2YWx1ZS5yZXBsYWNlKGMuZGVmaW5lUGFyYW1zLCBmdW5jdGlvbihtLCBwYXJhbSwgdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltjb2RlXSA9IHthcmc6IHBhcmFtLCB0ZXh0OiB2fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoY29kZSBpbiBkZWYpKSBkZWZbY29kZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGdW5jdGlvbihcImRlZlwiLCBcImRlZlsnXCIgKyBjb2RlICsgXCInXT1cIiArIHZhbHVlKShkZWYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMudXNlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy51c2VQYXJhbXMpIGNvZGUgPSBjb2RlLnJlcGxhY2UoYy51c2VQYXJhbXMsIGZ1bmN0aW9uKG0sIHMsIGQsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZbZF0gJiYgZGVmW2RdLmFyZyAmJiBwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ3ID0gKGQgKyBcIjpcIiArIHBhcmFtKS5yZXBsYWNlKC8nfFxcXFwvZywgXCJfXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwID0gZGVmLl9fZXhwIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwW3J3XSA9IGRlZltkXS50ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChcIihefFteXFxcXHckXSlcIiArIGRlZltkXS5hcmcgKyBcIihbXlxcXFx3JF0pXCIsIFwiZ1wiKSwgXCIkMVwiICsgcGFyYW0gKyBcIiQyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMgKyBcImRlZi5fX2V4cFsnXCIgKyBydyArIFwiJ11cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB2ID0gbmV3IEZ1bmN0aW9uKFwiZGVmXCIsIFwicmV0dXJuIFwiICsgY29kZSkoZGVmKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA/IHJlc29sdmVEZWZzKGMsIHYsIGRlZikgOiB2O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGUoY29kZSkge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlKC9cXFxcKCd8XFxcXCkvZywgXCIkMVwiKS5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIik7XG4gICAgfVxuXG4gICAgZG9ULnRlbXBsYXRlID0gZnVuY3Rpb24odG1wbCwgYywgZGVmLCBkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgIGMgPSBjIHx8IGRvVC50ZW1wbGF0ZVNldHRpbmdzO1xuICAgICAgICB2YXIgY3NlID0gYy5hcHBlbmQgPyBzdGFydGVuZC5hcHBlbmQgOiBzdGFydGVuZC5zcGxpdCwgbmVlZGh0bWxlbmNvZGUsIHNpZCA9IDAsIGluZHYsXG4gICAgICAgICAgICBzdHIgPSAoYy51c2UgfHwgYy5kZWZpbmUpID8gcmVzb2x2ZURlZnMoYywgdG1wbCwgZGVmIHx8IHt9KSA6IHRtcGw7XG5cbiAgICAgICAgdmFyIHVuZXNjYXBlQ29kZTtcblxuICAgICAgICBzdHIgPSAoXCJ2YXIgb3V0PSdcIiArIChjLnN0cmlwID8gc3RyLnJlcGxhY2UoLyhefFxccnxcXG4pXFx0KiArfCArXFx0KihcXHJ8XFxufCQpL2csIFwiIFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccnxcXG58XFx0fFxcL1xcKltcXHNcXFNdKj9cXCpcXC8vZywgXCJcIikgOiBzdHIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJ3xcXFxcL2csIFwiXFxcXCQmXCIpXG4gICAgICAgICAgICAucmVwbGFjZShjLmludGVycG9sYXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoISFkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuZXNjYXBlQ29kZSA9IHVuZXNjYXBlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKCd8fCcpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZUNvZGUgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArICcodHlwZW9mICcgKyBjb2RlICsgJyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAnICsgY29kZSArICchPT0gbnVsbCk/JyArIHVuZXNjYXBlQ29kZSArICc6IFwiXCInICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmVuY29kZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgbmVlZGh0bWxlbmNvZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnRlbmNvZGUgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5jb25kaXRpb25hbCB8fCBza2lwLCBmdW5jdGlvbihtLCBlbHNlY2FzZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbHNlY2FzZSA/XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID8gXCInO31lbHNlIGlmKFwiICsgdW5lc2NhcGUoY29kZSkgKyBcIil7b3V0Kz0nXCIgOiBcIic7fWVsc2V7b3V0Kz0nXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPyBcIic7aWYoXCIgKyB1bmVzY2FwZShjb2RlKSArIFwiKXtvdXQrPSdcIiA6IFwiJzt9b3V0Kz0nXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuaXRlcmF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBpdGVyYXRlLCB2bmFtZSwgaW5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZXJhdGUpIHJldHVybiBcIic7fSB9IG91dCs9J1wiO1xuICAgICAgICAgICAgICAgIHNpZCArPSAxO1xuICAgICAgICAgICAgICAgIGluZHYgPSBpbmFtZSB8fCBcImlcIiArIHNpZDtcbiAgICAgICAgICAgICAgICBpdGVyYXRlID0gdW5lc2NhcGUoaXRlcmF0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXCc7dmFyIGFycicgKyBzaWQgKyAnPScgKyBpdGVyYXRlICsgXCI7aWYoYXJyXCIgKyBzaWQgKyBcIil7dmFyIFwiICsgdm5hbWUgKyBcIixcIiArIGluZHYgKyBcIj0tMSxsXCIgKyBzaWQgKyBcIj1hcnJcIiArIHNpZCArIFwiLmxlbmd0aC0xO3doaWxlKFwiICsgaW5kdiArIFwiPGxcIiArIHNpZCArIFwiKXtcIlxuICAgICAgICAgICAgICAgICAgICArIHZuYW1lICsgXCI9YXJyXCIgKyBzaWQgKyBcIltcIiArIGluZHYgKyBcIis9MV07b3V0Kz0nXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5ldmFsdWF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiJztcIiArIHVuZXNjYXBlKGNvZGUpICsgXCJvdXQrPSdcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICsgXCInO3JldHVybiBvdXQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIikucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpLnJlcGxhY2UoL1xcci9nLCBcIlxcXFxyXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcc3w7fFxcfXxefFxceylvdXRcXCs9Jyc7L2csICckMScpLnJlcGxhY2UoL1xcKycnL2csIFwiXCIpO1xuICAgICAgICAvLy5yZXBsYWNlKC8oXFxzfDt8XFx9fF58XFx7KW91dFxcKz0nJ1xcKy9nLCckMW91dCs9Jyk7XG5cbiAgICAgICAgaWYgKG5lZWRodG1sZW5jb2RlKSB7XG4gICAgICAgICAgICBpZiAoIWMuc2VsZmNvbnRhaW5lZCAmJiBfZ2xvYmFscyAmJiAhX2dsb2JhbHMuX2VuY29kZUhUTUwpIF9nbG9iYWxzLl9lbmNvZGVIVE1MID0gZG9ULmVuY29kZUhUTUxTb3VyY2UoYy5kb05vdFNraXBFbmNvZGVkKTtcbiAgICAgICAgICAgIHN0ciA9IFwidmFyIGVuY29kZUhUTUwgPSB0eXBlb2YgX2VuY29kZUhUTUwgIT09ICd1bmRlZmluZWQnID8gX2VuY29kZUhUTUwgOiAoXCJcbiAgICAgICAgICAgICAgICArIGRvVC5lbmNvZGVIVE1MU291cmNlLnRvU3RyaW5nKCkgKyBcIihcIiArIChjLmRvTm90U2tpcEVuY29kZWQgfHwgJycpICsgXCIpKTtcIlxuICAgICAgICAgICAgICAgICsgc3RyO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGMudmFybmFtZSwgc3RyKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBjcmVhdGUgYSB0ZW1wbGF0ZSBmdW5jdGlvbjogXCIgKyBzdHIpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb1QuY29tcGlsZSA9IGZ1bmN0aW9uKHRtcGwsIGRlZikge1xuICAgICAgICByZXR1cm4gZG9ULnRlbXBsYXRlKHRtcGwsIG51bGwsIGRlZik7XG4gICAgfTtcblxufSgpKTtcblxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2RvVC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGdjVXRpbHMgPSByZXF1aXJlKCcuL2djVXRpbHMnKTtcblxuICAgIHZhciBkb21VdGlsID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVsZW1lbnQgZnJvbSBhbiBIVE1MIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBodG1sIEhUTUwgZnJhZ21lbnQgdG8gY29udmVydCBpbnRvIGFuIEhUTUxFbGVtZW50LlxuICAgICAqIEByZXR1cm4gVGhlIG5ldyBlbGVtZW50LlxuICAgICAqL1xuXG4gICAgLy9yZW1vdmUgYWxsIGNvbW1lbnRzIGFuZCB3aGl0ZXNwYWNlIG9ubHkgdGV4dCBub2Rlc1xuICAgIGZ1bmN0aW9uIGNsZWFuKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IG4rKykgeyAvL2RvIHJld3JpdGUgaXQgdG8gZm9yKHZhciBuPTAsbGVuPVhYWDtpPGxlbjspXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW25dO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gOCB8fCAoY2hpbGQubm9kZVR5cGUgPT09IDMgJiYgIS9cXFMvLnRlc3QoY2hpbGQubm9kZVZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIG4tLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb21VdGlsLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBkaXYgPSBudWxsO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5jcmVhdGVUZW1wbGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBjbGVhbihyKTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5pbm5lckhUTUwucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldEVsZW1lbnRPdXRlclRleHQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm91dGVySFRNTC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKS5yZXBsYWNlKC8mZ3Q7L2csICc+Jyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIGVsZW1lbnQgaGFzIGEgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGNoZWNrIGZvci5cbiAgICAgKi9cbiAgICBkb21VdGlsLmhhc0NsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInKTtcbiAgICAgICAgICAgIHJldHVybiBlICYmIHJ4LnRlc3QoZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyByZW1vdmVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gcmVtb3ZlIGZvcm0gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiBkb21VdGlsLmhhc0NsYXNzKGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoJ1xcXFxzP1xcXFxiJyArIGNsYXNzTmFtZSArICdcXFxcYicsICdnJyk7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuLnJlcGxhY2UocngsICcnKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNsYXNzIHRvIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgYWRkZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBhZGQgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5hZGRDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiAhZG9tVXRpbC5oYXNDbGFzcyhlLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuID8gY24gKyAnICcgKyBjbGFzc05hbWUgOiBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgb3IgcmVtb3ZlcyBhIGNsYXNzIHRvIG9yIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGFkZCBvciByZW1vdmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhZGRPclJlbW92ZSBXaGV0aGVyIHRvIGFkZCBvciByZW1vdmUgdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGRvbVV0aWwudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUsIGFkZE9yUmVtb3ZlKSB7XG4gICAgICAgIGlmIChhZGRPclJlbW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZG9tVXRpbC5hZGRDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVXRpbC5yZW1vdmVDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vICoqIGpRdWVyeSByZXBsYWNlbWVudCBtZXRob2RzXG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBlbGVtZW50IGZyb20gYSBqUXVlcnktc3R5bGUgc2VsZWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8c3RyaW5nfSBzZWxlY3RvciBBbiBlbGVtZW50LCBhIHNlbGVjdG9yIHN0cmluZywgb3IgYSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIEhUTUwgZWxlbWVudCBjb250YWlucyBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBwYXJlbnQgUGFyZW50IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBjaGlsZCBDaGlsZCBlbGVtZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBhcmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBjaGlsZCBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuY29udGFpbnMgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGZvciAodmFyIGUgPSBjaGlsZDsgZTsgZSA9IGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKGUgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBjb29yZGluYXRlcyBvZiBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIGRvbVV0aWwub2Zmc2V0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgZWxlbWVudC5zY3JvbGxUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyBlbGVtZW50LnNjcm9sbExlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIGFuIGVsZW1lbnQgaW4gcGFnZSBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgc2ltaWxhciB0byB0aGUgPGI+Z2V0Qm91bmRpbmdDbGllbnRSZWN0PC9iPiBmdW5jdGlvbixcbiAgICAgKiBleGNlcHQgdGhhdCB1c2VzIHdpbmRvdyBjb29yZGluYXRlcywgd2hpY2ggY2hhbmdlIHdoZW4gdGhlXG4gICAgICogZG9jdW1lbnQgc2Nyb2xscy5cbiAgICAgKi9cbiAgICBkb21VdGlsLmdldEVsZW1lbnRSZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmMgPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgd2lkdGg6IHJjLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbm5lciBjb250ZW50IHJlY3RhbmdsZSBvZiBpbnB1dCBlbGVtZW50LlxuICAgICAqIFBhZGRpbmcgYW5kIGJveC1zaXppbmcgaXMgY29uc2lkZXJlZC5cbiAgICAgKiBUaGUgcmVzdWx0IGlzIHRoZSBhY3R1YWwgcmVjdGFuZ2xlIHRvIHBsYWNlIGNoaWxkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGUgcmVwcmVzZW50IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRDb250ZW50UmVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHJjID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5nZXRTdHlsZShlKTtcbiAgICAgICAgdmFyIG1lYXN1cmVtZW50cyA9IFtcbiAgICAgICAgICAgICdwYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAncGFkZGluZ1JpZ2h0JyxcbiAgICAgICAgICAgICdwYWRkaW5nVG9wJyxcbiAgICAgICAgICAgICdwYWRkaW5nQm90dG9tJyxcbiAgICAgICAgICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJCb3R0b21XaWR0aCdcbiAgICAgICAgXTtcbiAgICAgICAgdmFyIHNpemUgPSB7fTtcbiAgICAgICAgbWVhc3VyZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgc2l6ZVtwcm9wXSA9ICFpc05hTihudW0pID8gbnVtIDogMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwYWRkaW5nV2lkdGggPSBzaXplLnBhZGRpbmdMZWZ0ICsgc2l6ZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgICAgICAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHNpemUuYm9yZGVyTGVmdFdpZHRoICsgc2l6ZS5wYWRkaW5nTGVmdCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0ICsgc2l6ZS5ib3JkZXJUb3BXaWR0aCArIHNpemUucGFkZGluZ1RvcCxcbiAgICAgICAgICAgIHdpZHRoOiByYy53aWR0aCAtIHBhZGRpbmdXaWR0aCAtIGJvcmRlcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHQgLSBwYWRkaW5nSGVpZ2h0IC0gYm9yZGVySGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVzIHRoZSBzdHlsZSBvZiBhbiBlbGVtZW50IGJ5IGFwcGx5aW5nIHRoZSBwcm9wZXJ0aWVzIHNwZWNpZmllZCBpbiBhbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB3aG9zZSBzdHlsZSB3aWxsIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjc3MgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0eWxlIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5zZXRDc3MgPSBmdW5jdGlvbihlLCBjc3MpIHtcbiAgICAgICAgdmFyIHMgPSBlLnN0eWxlO1xuICAgICAgICBmb3IgKHZhciBwIGluIGNzcykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNzc1twXTtcbiAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzTnVtYmVyKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocC5tYXRjaCgvd2lkdGh8aGVpZ2h0fGxlZnR8dG9wfHJpZ2h0fGJvdHRvbXxzaXplfHBhZGRpbmd8bWFyZ2luJy9pKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJ3B4JzsgLy8gZGVmYXVsdCB1bml0IGZvciBnZW9tZXRyeSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc1twXSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9tVXRpbC5zY3JvbGxiYXJTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tVXRpbC5zY3JvbGxiYXJTaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6LTEwMDAwcHg7IGxlZnQ6LTEwMDAwcHg7IHdpZHRoOjEwMHB4OyBoZWlnaHQ6MTAwcHg7IG92ZXJmbG93OnNjcm9sbDtcIj48L2Rpdj4nKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBkb21VdGlsLnNjcm9sbGJhclNpemUgPSB7XG4gICAgICAgICAgICB3aWR0aDogZGl2Lm9mZnNldFdpZHRoIC0gZGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBkaXYub2Zmc2V0SGVpZ2h0IC0gZGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gICAgICAgIHJldHVybiBkb21VdGlsLnNjcm9sbGJhclNpemU7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBmbiA9IGdldENvbXB1dGVkU3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGU7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oZWxlbWVudCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGVWYWx1ZSA9IGZ1bmN0aW9uKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZG9tVXRpbC5nZXRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHN0eWxlID8gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KSA6IG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuR2V0TWF4U3VwcG9ydGVkQ1NTSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGggPSAxMDAwMDAwO1xuICAgICAgICB2YXIgdGVzdFVwVG8gPSA2MDAwMDAwICogMTAwMDtcbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiLz4nKTtcbiAgICAgICAgdmFyIHRlc3Q7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHRlc3QgPSBoICsgNTAwMDAwOyAvLyogMjtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSB0ZXN0ICsgJ3B4JztcbiAgICAgICAgICAgIGlmICh0ZXN0ID4gdGVzdFVwVG8gfHwgZGl2Lm9mZnNldEhlaWdodCAhPT0gdGVzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaCA9IHRlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICAgICAgZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQgPSBoO1xuICAgICAgICByZXR1cm4gZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQ7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9tVXRpbDtcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgX19leHRlbmRzID0gZnVuY3Rpb24oZCwgYikge1xuICAgICAgICBmb3IgKHZhciBwIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgZFtwXSA9IGJbcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX18oKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gZDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlO1xuICAgICAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFJlcHJlc2VudHMgYW4gZXZlbnQgaGFuZGxlciAocHJpdmF0ZSBjbGFzcylcbiAgICAgKi9cbiAgICB2YXIgRXZlbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBFdmVudEhhbmRsZXIoaGFuZGxlciwgc2VsZikge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICAgICAgICAgIHRoaXMuc2VsZiA9IHNlbGY7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gRXZlbnRIYW5kbGVyO1xuICAgIH0pKCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIGFuIGV2ZW50LlxuICAgICAqXG4gICAgICogV2lqbW8gZXZlbnRzIGFyZSBzaW1pbGFyIHRvIC5ORVQgZXZlbnRzLiBBbnkgY2xhc3MgbWF5IGRlZmluZSBldmVudHMgYnlcbiAgICAgKiBkZWNsYXJpbmcgdGhlbSBhcyBmaWVsZHMuIEFueSBjbGFzcyBtYXkgc3Vic2NyaWJlIHRvIGV2ZW50cyB1c2luZyB0aGVcbiAgICAgKiBldmVudCdzIEBzZWU6YWRkSGFuZGxlciBtZXRob2QsIG9yIHVuc3Vic2NyaWJlIHVzaW5nIHRoZSBAc2VlOnJlbW92ZUhhbmRsZXJcbiAgICAgKiBtZXRob2QuXG4gICAgICpcbiAgICAgKiBXaWptbyBldmVudCBoYW5kbGVycyB0YWtlIHR3byBwYXJhbWV0ZXJzOiA8aT5zZW5kZXI8L2k+IGFuZCA8aT5hcmdzPC9pPi5cbiAgICAgKiBUaGUgZmlyc3QgaXMgdGhlIG9iamVjdCB0aGF0IHJhaXNlZCB0aGUgZXZlbnQsIGFuZCB0aGUgc2Vjb25kIGlzIGFuIG9iamVjdFxuICAgICAqIHRoYXQgY29udGFpbnMgdGhlIHRoZSBldmVudCBwYXJhbWV0ZXJzLlxuICAgICAqXG4gICAgICogQ2xhc3NlcyB0aGF0IGRlZmluZSBldmVudHMgZm9sbG93IHRoZSAuTkVUIHBhdHRlcm4gd2hlcmUgZm9yIGV2ZXJ5IGV2ZW50XG4gICAgICogdGhlcmUgaXMgYW4gPGk+b25bRVZFTlROQU1FXTwvaT4gbWV0aG9kIHRoYXQgcmFpc2VzIHRoZSBldmVudC4gVGhpcyBwYXR0ZXJuXG4gICAgICogYWxsb3dzIGRlcml2ZWQgY2xhc3NlcyB0byBvdmVycmlkZSB0aGUgPGk+b25bRVZFTlROQU1FXTwvaT4gbWV0aG9kIGFuZFxuICAgICAqIGhhbmRsZSB0aGUgZXZlbnQgYmVmb3JlIGFuZC9vciBhZnRlciB0aGUgYmFzZSBjbGFzcyByYWlzZXMgdGhlIGV2ZW50LlxuICAgICAqIERlcml2ZWQgY2xhc3NlcyBtYXkgZXZlbiBzdXBwcmVzcyB0aGUgZXZlbnQgYnkgbm90IGNhbGxpbmcgdGhlIGJhc2UgY2xhc3NcbiAgICAgKiBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCB0aGUgVHlwZVNjcmlwdCBjb2RlIGJlbG93IG92ZXJyaWRlcyB0aGUgPGI+b25WYWx1ZUNoYW5nZWQ8L2I+XG4gICAgICogZXZlbnQgZm9yIGEgY29udHJvbCB0byBwZXJmb3JtIHNvbWUgcHJvY2Vzc2luZyBiZWZvcmUgYW5kIGFmdGVyIHRoZVxuICAgICAqIDxiPnZhbHVlQ2hhbmdlZDwvYj4gZXZlbnQgZmlyZXM6XG4gICAgICogPHByZT5cbiAgICAgKiAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3NcbiAgICAgKiAgIG9uVmFsdWVDaGFuZ2VkKGU6IEV2ZW50QXJncykge1xuICAgICogICAvLyBleGVjdXRlIHNvbWUgY29kZSBiZWZvcmUgdGhlIGV2ZW50IGZpcmVzXG4gICAgKiAgIGNvbnNvbGUubG9nKCdhYm91dCB0byBmaXJlIHZhbHVlQ2hhbmdlZCcpO1xuICAgICogICAvLyBvcHRpb25hbGx5LCBjYWxsIGJhc2UgY2xhc3MgdG8gZmlyZSB0aGUgZXZlbnRcbiAgICAqICAgc3VwZXIub25WYWx1ZUNoYW5nZWQoZSk7XG4gICAgKiAgIC8vIGV4ZWN1dGUgc29tZSBjb2RlIGFmdGVyIHRoZSBldmVudCBmaXJlZFxuICAgICogICBjb25zb2xlLmxvZygndmFsdWVDaGFuZ2VkIGV2ZW50IGp1c3QgZmlyZWQnKTtcbiAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKi9cbiAgICB2YXIgRXZlbnQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50KCkge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIGEgaGFuZGxlciB0byB0aGlzIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gaGFuZGxlciBGdW5jdGlvbiBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIHJhaXNlZC5cbiAgICAgICAgICogQHBhcmFtIHNlbGYgT2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgZXZlbnQgaGFuZGxlclxuICAgICAgICAgKiAoYWNjZXNzaWJsZSBhcyAndGhpcycgZnJvbSB0aGUgaGFuZGxlciBjb2RlKS5cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5hZGRIYW5kbGVyID0gZnVuY3Rpb24oaGFuZGxlciwgc2VsZikge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMucHVzaChuZXcgRXZlbnRIYW5kbGVyKGhhbmRsZXIsIHNlbGYpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhIGhhbmRsZXIgZnJvbSB0aGlzIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gaGFuZGxlciBGdW5jdGlvbiBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIHJhaXNlZC5cbiAgICAgICAgICogQHBhcmFtIHNlbGYgT2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgZXZlbnQgaGFuZGxlciAoYWNjZXNzaWJsZSBhcyAndGhpcycgZnJvbSB0aGUgaGFuZGxlciBjb2RlKS5cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5yZW1vdmVIYW5kbGVyID0gZnVuY3Rpb24oaGFuZGxlciwgc2VsZikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9oYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsID0gdGhpcy5faGFuZGxlcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGwuaGFuZGxlciA9PT0gaGFuZGxlciAmJiBsLnNlbGYgPT09IHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYWxsIGhhbmRsZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnJlbW92ZUFsbEhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5sZW5ndGggPSAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSYWlzZXMgdGhpcyBldmVudCwgY2F1c2luZyBhbGwgYXNzb2NpYXRlZCBoYW5kbGVycyB0byBiZSBpbnZva2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2VuZGVyIFNvdXJjZSBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSBhcmdzIEV2ZW50IHBhcmFtZXRlcnMuXG4gICAgICAgICAqL1xuICAgICAgICBFdmVudC5wcm90b3R5cGUucmFpc2UgPSBmdW5jdGlvbihzZW5kZXIsIGFyZ3MpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJncyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5faGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbCA9IHRoaXMuX2hhbmRsZXJzW2ldO1xuICAgICAgICAgICAgICAgIGwuaGFuZGxlci5jYWxsKGwuc2VsZiwgc2VuZGVyLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnQucHJvdG90eXBlLCAnaGFzSGFuZGxlcnMnLCB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldHMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aGV0aGVyIHRoaXMgZXZlbnQgaGFzIGFueSBoYW5kbGVycy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlcnMubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gRXZlbnQ7XG4gICAgfSkoKTtcbiAgICAvKipcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBldmVudCBhcmd1bWVudHMuXG4gICAgICovXG4gICAgdmFyIEV2ZW50QXJncyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gRXZlbnRBcmdzKCkge1xuICAgICAgICB9XG5cbiAgICAgICAgRXZlbnRBcmdzLmVtcHR5ID0gbmV3IEV2ZW50QXJncygpO1xuICAgICAgICByZXR1cm4gRXZlbnRBcmdzO1xuICAgIH0pKCk7XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlcyBhcmd1bWVudHMgZm9yIGNhbmNlbGxhYmxlIGV2ZW50cy5cbiAgICAgKi9cbiAgICB2YXIgQ2FuY2VsRXZlbnRBcmdzID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgICAvKmpzaGludCAtVzAwNCAqL1xuICAgICAgICBfX2V4dGVuZHMoQ2FuY2VsRXZlbnRBcmdzLCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDYW5jZWxFdmVudEFyZ3MoKSB7XG4gICAgICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0cyBvciBzZXRzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJlIGNhbmNlbGVkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNhbmNlbCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENhbmNlbEV2ZW50QXJncztcbiAgICB9KShFdmVudEFyZ3MpO1xuXG4gICAgLyoqXG4gICAgICogUHJvdmlkZXMgYXJndW1lbnRzIGZvciBwcm9wZXJ0eSBjaGFuZ2UgZXZlbnRzLlxuICAgICAqL1xuICAgIHZhciBQcm9wZXJ0eUNoYW5nZWRFdmVudEFyZ3MgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICAgIC8qanNoaW50IC1XMDA0ICovXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9wZXJ0eUNoYW5nZWRFdmVudEFyZ3MsIF9zdXBlcik7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplcyBhIG5ldyBpbnN0YW5jZSBvZiBhIEBzZWU6UHJvcGVydHlDaGFuZ2VkRXZlbnRBcmdzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3aG9zZSB2YWx1ZSBjaGFuZ2VkLlxuICAgICAgICAgKiBAcGFyYW0gb2xkVmFsdWUgVGhlIG9sZCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG4gICAgICAgICAqIEBwYXJhbSBuZXdWYWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIFByb3BlcnR5Q2hhbmdlZEV2ZW50QXJncyhwcm9wZXJ0eU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9uYW1lID0gcHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgdGhpcy5fb2xkVmFsID0gb2xkVmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9uZXdWYWwgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9wZXJ0eUNoYW5nZWRFdmVudEFyZ3MucHJvdG90eXBlLCAncHJvcGVydHlOYW1lJywge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3aG9zZSB2YWx1ZSBjaGFuZ2VkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3BlcnR5Q2hhbmdlZEV2ZW50QXJncy5wcm90b3R5cGUsICdvbGRWYWx1ZScsIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0cyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb2xkVmFsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3BlcnR5Q2hhbmdlZEV2ZW50QXJncy5wcm90b3R5cGUsICduZXdWYWx1ZScsIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0cyB0aGUgbmV3IHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV3VmFsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9wZXJ0eUNoYW5nZWRFdmVudEFyZ3M7XG4gICAgfSkoRXZlbnRBcmdzKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBFdmVudDogRXZlbnQsXG4gICAgICAgIEV2ZW50SGFuZGxlcjogRXZlbnRIYW5kbGVyLFxuICAgICAgICBFdmVudEFyZ3M6IEV2ZW50QXJncyxcbiAgICAgICAgQ2FuY2VsRXZlbnRBcmdzOiBDYW5jZWxFdmVudEFyZ3MsXG4gICAgICAgIFByb3BlcnR5Q2hhbmdlZEV2ZW50QXJnczogUHJvcGVydHlDaGFuZ2VkRXZlbnRBcmdzXG4gICAgfTtcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9ldmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gNFxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IkNhbGVuZGFyU3RyYXRlZ3kuanMifQ==