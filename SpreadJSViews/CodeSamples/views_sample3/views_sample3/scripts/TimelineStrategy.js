(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["TimelineStrategy"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["TimelineStrategy"] = factory();
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
	    var doT = __webpack_require__(2);
	    var gcUtils = __webpack_require__(1);
	    var domUtil = __webpack_require__(3);
	    var POS_ABS = 'absolute';
	    var POS_REL = 'relative';
	    var OVERFLOW_HIDDEN = 'hidden';
	    var VIEW_PORT = 'viewport';
	    var MAIN_LINE = 'mainline';
	    var DISPLAYMODE_ALL = 'all';
	    var DISPLAYMODE_SEPARATE = 'separate';
	    var DISPLAYMODE_BOTH = 'both';
	    var DIRECTION_LEFT = 'left';
	    var DIRECTION_RIGHT = 'right';
	
	    //endregion
	
	    //region Constructor
	    var TimelineStrategy = function(options) {
	        var self = this;
	        self.name = 'Timeline';
	        self.options = _.defaults(options || {}, self.getDefaultOptions());
	        self.layoutInfo_ = null;
	    };
	    //endregion
	
	    //region Prototype
	    TimelineStrategy.prototype = {
	        init: function(grid) {
	            var self = this;
	            self.grid = grid;
	
	            grid.onMouseWheel.addHandler(handleMouseWheel_);
	            clearCache.call(self);
	        },
	
	        getDefaultOptions: function() {
	            return {
	                displayMode: DISPLAYMODE_SEPARATE,
	                gutter: 13,
	                intervalDistance: 15
	            };
	        },
	
	        getLayoutInfo: function() {
	            var self = this;
	
	            return self.layoutInfo_ || (self.layoutInfo_ = {
	                    mainline: getViewPortLayoutInfo_.call(self),
	                    viewport: getViewPortLayoutInfo_.call(self)
	                });
	        },
	
	        getRenderRowInfo_: function(row, area) {
	            return getRenderRowInfo.call(this, row, area);
	        },
	
	        getRenderRange_: function(options) {
	            return getRenderRange.call(this, options);
	        },
	
	        getRenderInfo: function(options) {
	            return getRenderInfo.call(this, options);
	        },
	
	        getRowTemplate: function() {
	            //row is placed by layoutengine,so there is no need for this function.
	        },
	
	        showScrollPanel: function(area) {
	            return true;
	        },
	
	        initGroupInfosHeight_: function() {
	
	        },
	
	        getScrollPanelRenderInfo: function(area) {
	            if (area === MAIN_LINE) {
	                return;
	            }
	
	            var viewportLayout = this.getLayoutInfo().viewport;
	            var showVScrollbar = viewportLayout.contentHeight > viewportLayout.height;
	
	            return {
	                outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-left scroll-top',
	                outerDivStyle: {
	                    position: 'absolute',
	                    top: viewportLayout.top,
	                    left: viewportLayout.left,
	                    height: viewportLayout.height,
	                    width: viewportLayout.width + (showVScrollbar ? domUtil.getScrollbarSize().width : 0),
	                    overflowX: 'auto'
	                },
	                innerDivStyle: {
	                    position: 'relative',
	                    height: viewportLayout.contentHeight,
	                    width: viewportLayout.contentWidth
	                }
	            };
	        },
	
	        handleScroll: function() {
	            var self = this;
	            var grid = self.grid;
	            var offsetTop = grid.scrollOffset.top;
	            var layout = self.getLayoutInfo().viewport;
	            var maxOffsetTop = layout.contentHeight - layout.height;
	
	            console.log('scrollTop: ' + grid.scrollOffset.top);
	
	            if (maxOffsetTop - offsetTop < 20 && !self.scrollToEnd && !self.validateWhenScroll_) {
	                console.log('begin validate');
	                self.validateWhenScroll_ = true;
	                setTimeout(function() {
	                    console.log('end validate');
	                    delete self.validateWhenScroll_;
	                }, 50);
	                grid.invalidate(false);
	                return;
	            } else {
	                grid.scrollRenderPart_(VIEW_PORT);
	            }
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
	            var layoutEngine = grid.layoutEngine;
	            var hitTestInfo;
	            var groupInfos;
	            var groupInfo;
	            var containerSize;
	            var containerOffset;
	            var groupContainerKey;
	            var groupContainer;
	            var viewportLayout = layout.viewport;
	            var point = {
	                left: offsetLeft,
	                top: offsetTop
	            };
	
	            var layoutRects = getRenderEventRects.call(self, viewportLayout);
	            var viewPort = document.getElementById(grid.uid + '-viewport');
	            if (!contains_(viewportLayout, point)) {
	                return;
	            }
	
	            groupInfos = grid.groupInfos_;
	            if (!groupInfos || groupInfos.length === 0) {
	                return null;
	            }
	
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupInfo = groupInfos[i];
	                if (options.displayMode === DISPLAYMODE_ALL) {
	                    groupContainerKey = grid.uid + '-g' + groupInfo.path.join('_');
	                    groupContainer = document.getElementById(groupContainerKey);
	                    if (groupContainer && pointIn_(offsetLeft, offsetTop, groupContainer, viewPort)) {
	                        var groupHeight = getElementSizeFromCache.call(self, groupContainerKey).height;
	                        containerOffset = domUtil.offset(groupContainer);
	                        containerSize = {
	                            width: layoutRects.leftRect.width,
	                            height: groupHeight
	                        };
	
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
	
	                        return hitTestInfo;
	                    }
	                } else {
	                    for (var index = 0, itemCount = groupInfo.data.itemCount; index < itemCount; index++) {
	                        groupContainerKey = grid.uid + '-g' + groupInfo.path.join('_') + '-container' + index;
	                        groupContainer = document.getElementById(groupContainerKey);
	                        if (groupContainer && pointIn_(offsetLeft, offsetTop, groupContainer, viewPort)) {
	                            return {
	                                area: 'viewport',
	                                row: -1,
	                                column: -1,
	                                groupInfo: {
	                                    area: 'eventContainer',
	                                    path: groupInfo.path,
	                                    row: index
	                                }
	                            };
	                        }
	                    }
	                }
	            }
	        },
	
	        destroy: function() {
	            var self = this;
	            var grid = self.grid;
	
	            grid.onMouseWheel.addHandler(handleMouseWheel_);
	            self.grid = null;
	        },
	
	        clearRenderCache_: function() {
	            var self = this;
	            if (!self.validateWhenScroll_) {
	                clearCache.call(self);
	            }
	
	            self.layoutInfo_ = null;
	            self.scrollableHeight_ = 0;
	        }
	    };
	    //endregion
	
	    function clearCache() {
	        var scope = this;
	        scope.cachedItemSize_ = [];
	        scope.scrollToEnd = null;
	        scope.hasVScrollBar_ = null;
	        scope.cachedGroupHeaderFn_ = null;
	    }
	
	    function getViewPortLayoutInfo_() {
	        var scope = this;
	        var grid = scope.grid;
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var left = 0;
	        var top = 0;
	        var width = containerRect.width;
	        var height = containerRect.height;
	        width = hasVScrollBar.call(scope) ? (width - domUtil.getScrollbarSize().width) : width;
	        var contentheight = getcontentHeight.call(scope, top, left, width, height);
	
	        return {
	            top: top,
	            left: left,
	            width: width,
	            height: height,
	            contentWidth: width,
	            contentHeight: contentheight
	        };
	    }
	
	    function getcontentHeight(left, top, width, height) {
	        var scope = this;
	        if (scope.scrollableHeight_) {
	            return scope.scrollableHeight_;
	        }
	
	        var currentLayoutInfo = {
	            top: top,
	            left: left,
	            width: width,
	            height: height
	        };
	        var grid = scope.grid;
	        var options = {
	            offsetTop: grid.scrollOffset ? grid.scrollOffset.top : 0,
	            offsetLeft: grid.scrollOffset ? grid.scrollOffset.left : 0
	        };
	
	        scope.scrollableHeight_ = measureScrollableHeight.call(scope, currentLayoutInfo, options);
	        console.log('update scrollableHeight: ' + scope.scrollableHeight_);
	        return scope.scrollableHeight_;
	    }
	
	    function getRenderInfo(options) {
	        var self = this;
	        var area = (options && options.area) || '';
	        if (!area) {
	            return null;
	        }
	
	        var layoutInfo = self.getLayoutInfo();
	        var currentLayoutInfo = layoutInfo.viewport;
	        var r;
	        var scope = this;
	        var height = currentLayoutInfo.height;
	        var width = currentLayoutInfo.width;
	
	        if (area === VIEW_PORT) {
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
	                },
	                innerDivTranslate: {
	                    left: 0,
	                    top: -options.offsetTop || 0
	                }
	            };
	
	            r.renderedRows = getRenderedEventElements.call(scope, currentLayoutInfo, options);
	        } else {
	            r = {
	                outerDivCssClass: 'gc-mainline',
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
	
	            r.renderedRows = getTimeLineElement.call(scope, currentLayoutInfo);
	        }
	
	        return r;
	    }
	
	    function getRenderedEventElements(layoutInfo, options) {
	        return getRenderedEventsInfo.call(this, layoutInfo, options).rows;
	    }
	
	    function measureScrollableHeight(layoutInfo, options) {
	        var measureOptions = {
	            height: layoutInfo.height + 200
	        };
	        options = _.defaults(options, measureOptions);
	        return getRenderedEventsInfo.call(this, layoutInfo, options).height;
	    }
	
	    function getTimeLineElement(layoutInfo) {
	        var scope = this;
	        var timeLineLocation = getTimeLineLocation.call(scope, layoutInfo);
	        var timeLines = [];
	        if (scope.options.displayMode === DISPLAYMODE_BOTH) {
	            timeLines.push(getRenderedTimeLineInfo.call(scope, timeLineLocation.leftAxis));
	            timeLines.push(getRenderedTimeLineInfo.call(scope, timeLineLocation.rightAxis));
	        } else {
	            timeLines.push(getRenderedTimeLineInfo.call(scope, timeLineLocation));
	        }
	
	        return timeLines;
	    }
	
	    function getTimelineWidth() {
	        var scope = this;
	        var timeLineRect = {top: 0, left: 0};
	        var timeLine = getRenderedTimeLineInfo.call(scope, timeLineRect);
	        return getElementSize.call(scope, timeLine, timeLine.key).width;
	    }
	
	    function getRenderEventRects(layoutInfo) {
	        var leftRect;
	        var rightRect;
	        var leftleadShape;
	        var rightleadShape;
	        var self = this;
	        var options = self.options;
	        var lineWidth = getTimelineWidth.call(self);
	        if (options.displayMode === DISPLAYMODE_SEPARATE) {
	            var rightedge = (layoutInfo.width + lineWidth) / 2;
	            leftleadShape = getleadShapeRenderInfo.call(self, DIRECTION_LEFT);
	            leftRect = {
	                left: 0,
	                top: 0,
	                width: rightedge - leftleadShape.width + 1,
	                height: '100%'
	            };
	
	            rightleadShape = getleadShapeRenderInfo.call(self, DIRECTION_RIGHT);
	            var leftedge = (layoutInfo.width - lineWidth) / 2;
	            var left = leftedge + rightleadShape.width;
	            rightRect = {
	                left: left - 1,
	                top: 0,
	                width: layoutInfo.width - left,
	                height: '100%'
	            };
	        } else if (options.displayMode === DISPLAYMODE_ALL) {
	            rightleadShape = getleadShapeRenderInfo.call(self, DIRECTION_RIGHT);
	            rightRect = leftRect = {
	                left: rightleadShape.width - 1,
	                top: 0,
	                width: layoutInfo.width - rightleadShape.width,
	                height: '100%'
	            };
	        } else {
	            leftleadShape = getleadShapeRenderInfo.call(self, DIRECTION_LEFT);
	            rightleadShape = getleadShapeRenderInfo.call(self, DIRECTION_RIGHT);
	            var middleSpace = layoutInfo.width - leftleadShape.width - rightleadShape.width;
	            var width = Math.floor(middleSpace * 0.8);
	            leftRect = {
	                left: leftleadShape.width,
	                top: 0,
	                width: width,
	                height: '100%'
	            };
	
	            rightRect = {
	                left: rightleadShape.width + middleSpace - width,
	                top: 0,
	                width: width,
	                height: '100%'
	            };
	        }
	
	        return {
	            leftRect: leftRect,
	            rightRect: rightRect
	        };
	    }
	
	    function hasVScrollBar() {
	        var scope = this;
	        if (scope.hasVScrollBar_) {
	            return true;
	        }
	
	        var grid = scope.grid;
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var left = 0;
	        var top = 0;
	        var width = containerRect.width;
	        var height = containerRect.height;
	        var contentheight = getcontentHeight.call(scope, top, left, width, height);
	        scope.cachedItemSize_ = [];
	        scope.scrollToEnd = null;
	        scope.hasVScrollBar_ = contentheight > height;
	        return scope.hasVScrollBar_;
	    }
	
	    function getRenderedTimeLineInfo(location) {
	        return {
	            key: 'timeline-line',
	            renderInfo: {
	                cssClass: 'timeline-line',
	                style: {
	                    left: location.left,
	                    top: location.top,
	                    height: '100%',
	                    position: 'absolute'
	                },
	                renderedHTML: '<div></div>'
	            }
	        };
	    }
	
	    function getTimeLineLocation(layoutInfo) {
	        var self = this;
	        var options = self.options;
	        var lineWidth = getTimelineWidth.call(self);
	        if (options.displayMode === DISPLAYMODE_SEPARATE) {
	            return {
	                top: 0,
	                left: (layoutInfo.width - lineWidth) / 2
	            };
	        } else if (options.displayMode === DISPLAYMODE_ALL) {
	            return {
	                top: 0,
	                left: 0
	            };
	        } else if (options.displayMode === DISPLAYMODE_BOTH) {
	            return {
	                leftAxis: {
	                    top: 0,
	                    left: 0
	                },
	                rightAxis: {
	                    top: 0,
	                    left: layoutInfo.width - lineWidth
	                }
	            };
	        }
	    }
	
	    function getRenderRange(options) {
	        if (options.area === MAIN_LINE) {
	            return;
	        }
	
	        var self = this;
	        var r = getRenderInfo.call(self, options);
	        return {
	            top: -options.offsetTop || 0,
	            left: 0,
	            renderedRows: r.renderedRows
	        };
	    }
	
	    function getRenderRowInfo(row) {
	        return row;
	    }
	
	    function getRenderedEventsInfo(layoutInfo, scrolloptions) {
	        var self = this;
	        var i;
	        var len;
	        var rows = [];
	        var groupsInfos = getCurrentViewGroup_.call(self);
	        var layoutRects = getRenderEventRects.call(self, layoutInfo, scrolloptions);
	        var offsetTop = scrolloptions.offsetTop;
	        var idPrefix = self.grid.uid;
	        var grid = self.grid;
	        var layoutEngine = grid.layoutEngine;
	        var group;
	        var groupRenderInfo;
	        var displayMode = self.options.displayMode;
	        var leftRect;
	        var rightRect;
	        var childHTML = '';
	        var tpRow;
	        var containerWidth = 0;
	        var options = self.options;
	        var leadShape;
	        var containserSize;
	        var renderRows;
	        var offsetBottom = offsetTop + (scrolloptions.height ? scrolloptions.height : layoutInfo.height);
	        var top = 0;
	        var itemHeight = 0;
	        var leftTop = 0;
	        var rightTop = 0;
	        var layoutDirection = DIRECTION_LEFT;
	
	        for (var index = 0, length = groupsInfos.length; index < length; index++) {
	            var groupInfo = groupsInfos[index];
	            group = groupInfo.data;
	            if (isOutOfViewPort(top, offsetBottom)) {
	                break;
	            }
	
	            if (displayMode === DISPLAYMODE_ALL) {
	                leftRect = layoutRects.leftRect;
	                tpRow = getGroupHeader_.call(self, groupInfo, 0, top, layoutInfo.width);
	                if (tpRow) {
	                    itemHeight = tpRow.height;
	                    itemHeight += options.intervalDistance ? options.intervalDistance : 0;
	                    if (isIntersectArea(top, top + itemHeight, offsetTop, offsetBottom)) {
	                        rows.push(tpRow.row);
	                    }
	                    top += itemHeight;
	                }
	
	                leadShape = getleadShapeRenderInfo.call(self, DIRECTION_RIGHT);
	                childHTML += leadShape.shape;
	                containerWidth = leftRect.width;
	                containserSize = {
	                    width: containerWidth,
	                    height: '100%'
	                };
	                renderRows = getLayoutEngineInnerGroupRenderInfo.call(self, layoutEngine, groupInfo, containserSize, getOneSideEventLayoutCallBack.bind(self));
	                for (i = 0, len = renderRows.length; i < len; i++) {
	                    childHTML += grid.renderRow_(renderRows[i]);
	                }
	
	                groupRenderInfo = getGroupRenderInfo.call(self, idPrefix, groupInfo, leftRect.left, top, containerWidth, childHTML);
	                itemHeight = getElementSize.call(self, groupRenderInfo, groupRenderInfo.key).height;
	                if (options.intervalDistance) {
	                    itemHeight += options.intervalDistance;
	                }
	                if (isIntersectArea(top, top + itemHeight, offsetTop, offsetBottom)) {
	                    rows.push(groupRenderInfo);
	                }
	                top += itemHeight;
	                childHTML = '';
	            } else if (displayMode === DISPLAYMODE_SEPARATE) {
	                leftRect = layoutRects.leftRect;
	                rightRect = layoutRects.rightRect;
	                tpRow = getGroupHeader_.call(self, groupInfo, 0, top, layoutInfo.width);
	
	                if (tpRow) {
	                    itemHeight = tpRow.height;
	                    itemHeight += options.intervalDistance ? options.intervalDistance : 0;
	                    if (isIntersectArea(top, top + itemHeight, offsetTop, offsetBottom)) {
	                        rows.push(tpRow.row);
	                    }
	                    top += itemHeight;
	                    leftTop = rightTop = top;
	                    layoutDirection = DIRECTION_LEFT;
	                }
	
	                containerWidth = leftRect.width;
	                containserSize = {
	                    width: containerWidth,
	                    height: '100%'
	                };
	                renderRows = getLayoutEngineInnerGroupRenderInfo.call(self, layoutEngine, groupInfo, containserSize, getSeparateEventLayoutCallBack.bind(self));
	
	                for (i = 0, len = renderRows.length; i < len; i++) {
	                    childHTML = '';
	                    leadShape = getleadShapeRenderInfo.call(self, layoutDirection);
	                    childHTML += leadShape.shape;
	                    childHTML += grid.renderRow_(renderRows[i]);
	
	                    if (layoutDirection === DIRECTION_LEFT) {
	                        itemHeight = 0;
	                        if (options.intervalDistance) {
	                            itemHeight += options.intervalDistance;
	                        }
	                        groupRenderInfo = getGroupRenderInfo.call(self, idPrefix, groupInfo, leftRect.left, leftTop, leftRect.width, childHTML, i);
	                        itemHeight += getElementSize.call(self, groupRenderInfo, groupRenderInfo.key).height;
	                        if (isIntersectArea(leftTop, leftTop + itemHeight, offsetTop, offsetBottom)) {
	                            rows.push(groupRenderInfo);
	                        }
	                        leftTop += itemHeight;
	                        layoutDirection = DIRECTION_RIGHT;
	                    } else {
	                        itemHeight = 0;
	                        if (options.intervalDistance) {
	                            itemHeight += options.intervalDistance;
	                        }
	
	                        groupRenderInfo = getGroupRenderInfo.call(self, idPrefix, groupInfo, rightRect.left, rightTop, rightRect.width, childHTML, i);
	                        itemHeight += getElementSize.call(self, groupRenderInfo, groupRenderInfo.key).height;
	                        if (isIntersectArea(rightTop, rightTop + itemHeight, offsetTop, offsetBottom)) {
	                            rows.push(groupRenderInfo);
	                        }
	                        rightTop += itemHeight;
	                        layoutDirection = DIRECTION_LEFT;
	                    }
	                }
	                top = Math.max(leftTop, rightTop);
	            } else {
	                tpRow = getGroupHeader_.call(self, groupInfo, 0, top, layoutInfo.width);
	                if (tpRow) {
	                    itemHeight = tpRow.height;
	                    itemHeight += options.intervalDistance ? options.intervalDistance : 0;
	                    if (isIntersectArea(top, top + itemHeight, offsetTop, offsetBottom)) {
	                        rows.push(tpRow.row);
	                    }
	                    top += itemHeight;
	                }
	
	                containserSize = {
	                    width: layoutRects.leftRect.width,
	                    height: '100%'
	                };
	                if (groupInfo.isBottomLevel) {
	                    return;
	                }
	
	                renderRows = getAllRenderedRows.call(self, layoutEngine, groupInfo, containserSize);
	                for (i = 0, len = renderRows.length; i < len; i++) {
	                    var renderRow = renderRows[i];
	                    childHTML = '';
	                    var direction = renderRow.direction === 'left' ? DIRECTION_RIGHT : DIRECTION_LEFT;
	                    leadShape = getleadShapeRenderInfo.call(self, direction);
	                    childHTML += leadShape.shape;
	                    childHTML += grid.renderRow_(renderRow.row);
	
	                    itemHeight = 0;
	                    if (options.intervalDistance) {
	                        itemHeight += options.intervalDistance;
	                    }
	                    var layoutRect = renderRow.direction === 'left' ? layoutRects.leftRect : layoutRects.rightRect;
	                    groupRenderInfo = getGroupRenderInfo.call(self, idPrefix, groupInfo, layoutRect.left, top, layoutRect.width, childHTML, i);
	                    itemHeight += getElementSize.call(self, groupRenderInfo, groupRenderInfo.key).height;
	                    if (isIntersectArea(top, top + itemHeight, offsetTop, offsetBottom)) {
	                        rows.push(groupRenderInfo);
	                    }
	                    top += itemHeight;
	                }
	            }
	        }
	
	        if (index === groupsInfos.length) {
	            self.scrollToEnd = true;
	        }
	
	        return {
	            rows: rows,
	            height: top
	        };
	    }
	
	    function getAllRenderedRows(layoutEngine, groupInfo, containserSize) {
	        var self = this;
	        var renderRows = [];
	        var subRows;
	        for (var i = 0, len = groupInfo.children.length; i < len; i++) {
	            var subGroup = groupInfo.children[i];
	            if (!subGroup.isBottomLevel) {
	                continue;
	            }
	
	            subRows = getLayoutEngineInnerGroupRenderInfo.call(self, layoutEngine, subGroup, containserSize, getSeparateEventLayoutCallBack.bind(self));
	            for (var j = 0, len2 = subRows.length; j < len2; j++) {
	                var row = subRows[j];
	                renderRows.push({
	                    direction: subGroup.data.name,
	                    row: row,
	                    sourceIndex: subGroup.data.toSourceRow(j)
	                });
	            }
	        }
	
	        renderRows.sort(function(row1, row2) {
	            return row1.sourceIndex > row2.sourceIndex;
	        });
	
	        return renderRows;
	    }
	
	    function isIntersectArea(top, bottom, offsetTop, offsetBottom) {
	        return bottom > offsetTop && top < offsetBottom;
	    }
	
	    function isOutOfViewPort(top, offsetBottom) {
	        return top > offsetBottom;
	    }
	
	    function getLayoutEngineInnerGroupRenderInfo(layoutEngine, groupInfo, containserSize, callBack) {
	        var rows;
	        rows = layoutEngine.getInnerGroupRenderInfo(groupInfo, containserSize, callBack);
	        return rows;
	    }
	
	    function getElementSize(renderInfo, key) {
	        var self = this;
	        var size;
	        if (key) {
	            var result = getElementSizeFromCache.call(self, key);
	            if (result) {
	                return result.size;
	            }
	        }
	
	        var event = self.grid.renderRow_(renderInfo);
	        if (event) {
	            var element = domUtil.createElement(event);
	            document.body.appendChild(element);
	            size = domUtil.getElementRect(element);
	            document.body.removeChild(element);
	            self.cachedItemSize_.push({
	                key: key,
	                size: size
	            });
	        }
	
	        return size;
	    }
	
	    function getElementSizeFromCache(key) {
	        var self = this;
	        return _.find(self.cachedItemSize_, function(item) {
	            return item.key === key;
	        });
	    }
	
	    function getGroupRenderInfo(idPrefix, groupInfo, left, top, width, renderHtml, index) {
	        var trailing = gcUtils.isUndefinedOrNull(index) ? '' : ('-container' + index);
	        var key = idPrefix + '-g' + groupInfo.path.join('_') + trailing;
	        var result;
	
	        result = {
	            key: key,
	            renderInfo: {
	                cssClass: 'timeline-event-container',
	                style: {
	                    position: 'absolute',
	                    left: left,
	                    top: top,
	                    width: width
	                },
	                renderedHTML: renderHtml
	            }
	        };
	        return result;
	    }
	
	    function getleadShapeRenderInfo(direction) {
	        var self = this;
	        var renderHtml;
	        var isRightSide = direction === DIRECTION_RIGHT;
	        var width = self.options.gutter;
	
	        renderHtml = isRightSide ? '<div class="timeline-leftshape" style="float:left;margin-left:' + -width + 'px;width:' + width + 'px;"></div>' :
	        '<div class="timeline-rightshape" style="float:right; margin-right:' + -width + 'px;width:' + width + 'px;"></div>';
	
	        return {
	            shape: renderHtml,
	            width: width
	        };
	    }
	
	    function getSeparateEventLayoutCallBack() {
	        return {
	            cssClass: 'timeline-event',
	            location: {
	                top: 0
	            },
	            rowHeight: '100%'
	        };
	    }
	
	    function getOneSideEventLayoutCallBack() {
	        return {
	            cssClass: 'timeline-event',
	            location: {
	                top: 0
	            },
	            rowHeight: '100%'
	        };
	    }
	
	    function getGroupHeader_(groupInfo, left, top, width, getUpdateKey) {
	        var scope = this;
	        var grid = scope.grid;
	        var row;
	        var header = groupInfo.data.groupDescriptor.header;
	        var height = 0;
	        if (header && header.visible) {
	            if (!header.template) {
	                return null;
	            }
	
	            var key = grid.uid + '-gh' + groupInfo.path.join('_');
	            if (getUpdateKey) {
	                row = {
	                    key: key,
	                    info: groupInfo,
	                    top: top,
	                    width: width
	                };
	            } else {
	                row = getGroupHeaderRow.call(scope, key, groupInfo, left, width, top);
	                height = getElementSize.call(scope, row, key).height;
	            }
	        }
	
	        return {row: row, height: height};
	    }
	
	    function getGroupHeaderRow(key, groupInfo, left, width, top) {
	        var self = this;
	        return {
	            key: key,
	            renderInfo: {
	                cssClass: 'gc-row g' + groupInfo.path.join('_'),
	                style: {
	                    left: left,
	                    top: top,
	                    width: width,
	                    overflow: 'hidden'
	                },
	                renderedHTML: getGroupHeaderTemplate_.call(self, groupInfo)(getGroupFooterData_.call(self, groupInfo))
	            }
	        };
	    }
	
	    function getGroupFooterData_(groupInfo) {
	        var self = this;
	        var group = groupInfo.data;
	        var result = {
	            name: group.name,
	            count: group.itemCount,
	            level: group.level,
	            margin: group.level * 18,
	            groupStatus: group.collapsed ? 'collapsed' : 'expand',
	            condition: group.groupDescriptor.field
	        };
	        var calcSource = self.grid.data.calcSource;
	        _.each(self.grid.columns, function(col) {
	            //TODO: handle the case that the col.aggregation is an array
	            var aggregator = (col.aggregation && col.aggregation.length > 0) ? col.aggregation[0] : {};
	            if (gcUtils.isString(aggregator)) {
	                aggregator = {formula: aggregator};
	            }
	
	            if (aggregator.formula && calcSource) {
	                var value = calcSource.getCalcGroupFieldValue(col.id, groupInfo.path);
	                var formattedValue = value;
	                var formatter = aggregator.format;
	                if (!gcUtils.isUndefinedOrNull(formatter)) {
	                    formattedValue = formatValue(value, formatter);
	                }
	                //var formatValue = formatValue_.call(self, col.id, value);
	                //TODO: get aggregator value
	                result['__agg_' + col.id] = formattedValue;
	            }
	        });
	        return result;
	    }
	
	    function formatValue(value, format) {
	        if (!gcUtils.isUndefinedOrNull(window.GcSpread)) {
	            var Formatter = gcUtils.findPlugin('Formatter');
	            var ExcelFormatter = Formatter ? Formatter.ExcelFormatter : null;
	            if (ExcelFormatter) {
	                var formatObj = new ExcelFormatter(format);
	                return formatObj.format(value);
	            }
	        }
	        return value;
	    }
	
	    function getGroupHeaderTemplate_(groupInfo) {
	        var self = this;
	        var groupPath = groupInfo.path;
	        var group = groupInfo.data;
	        self.cachedGroupHeaderFn_ = self.cachedGroupHeaderFn_ || [];
	        if (self.cachedGroupHeaderFn_[groupPath.length - 1]) {
	            return self.cachedGroupHeaderFn_[groupPath.length - 1];
	        }
	
	        var header = group.groupDescriptor.header;
	        //TODO: preprocess user given header template, add height
	        var templateStr = (header && header.template);
	
	        self.cachedGroupHeaderFn_[groupPath.length - 1] = doT.template(templateStr, null, null, true);
	        return self.cachedGroupHeaderFn_[groupPath.length - 1];
	    }
	
	    function getCurrentViewGroup_() {
	        var self = this;
	
	        //todo: fiter some unused group info.
	        return self.grid.groupInfos_;
	    }
	
	    function handleMouseWheel_(sender, e) {
	        var grid = sender;
	        var strategy = grid.layoutEngine.groupStrategy_;
	        if (!strategy.showScrollPanel(VIEW_PORT)) {
	            return;
	        }
	
	        //simulate scroll
	        var offsetDelta = e.deltaY;
	        if (offsetDelta !== 0) {
	            var layout = strategy.getLayoutInfo().viewport;
	            var maxOffsetTop = layout.contentHeight - layout.height;
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
	
	    module.exports = TimelineStrategy;
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


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1YzQ4NzM5ODQxNjQxOTBhNGU4ZSIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2dyb3VwU3RyYXRlZ2llcy9UaW1lbGluZVN0cmF0ZWd5LmpzIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvZ2NVdGlscy5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2RvVC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2RvbVV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyw2REFBNkQsaUZBQWlGLHVHQUF1RztBQUNoUyxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQStDO0FBQy9DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDs7QUFFQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLDhFQUE2RSxtQkFBbUI7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5REFBd0QsZ0JBQWdCO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQW9ELFNBQVM7QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFEQUFvRCxTQUFTO0FBQzdEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxREFBb0QsU0FBUztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF3RCxTQUFTO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtELFVBQVU7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVGQUFzRiw2QkFBNkIsc0JBQXNCO0FBQ3pJLDhEQUE2RCwrQkFBK0Isc0JBQXNCOztBQUVsSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUM3K0JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsWUFBWTtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckIseUNBQXdDLEtBQUssV0FBVyxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW1DLGdCQUFnQjtBQUNuRDtBQUNBLHdDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQztBQUMxQyxrQkFBaUI7QUFDakIsc0NBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQWtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakIsaURBQWdEO0FBQ2hELG1EQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxlQUFlO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFpRDs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQXlEO0FBQ3pELFVBQVM7QUFDVDs7QUFFQSx1RUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRkFBcUY7QUFDckY7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsRUFBQzs7Ozs7OztBQzd6QkQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCLEVBQUUsWUFBWSxNQUFNLEVBQUU7QUFDL0MsNkJBQTRCLEVBQUUsYUFBYSxFQUFFO0FBQzdDLHdCQUF1QixFQUFFLGFBQWEsRUFBRTtBQUN4QyxxQkFBb0IsRUFBRSxhQUFhLEVBQUU7QUFDckMsc0hBQXFILElBQUksSUFBSTtBQUM3SCx3QkFBdUIsRUFBRSxxQ0FBcUMsRUFBRTtBQUNoRTtBQUNBLDZCQUE0QixFQUFFLHlCQUF5QixFQUFFO0FBQ3pELHlCQUF3QixFQUFFLFNBQVMsRUFBRSxxREFBcUQsRUFBRTtBQUM1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsZ0NBQStCLFdBQVcsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLEVBQUU7QUFDbEgsc0VBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLDBCQUF5QixZQUFZO0FBQ3JDLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0Esa0JBQWlCLHVEQUF1RDtBQUN4RSxpQkFBZ0IsVUFBVSxpQkFBaUIseUJBQXlCO0FBQ3BFLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQXlDO0FBQ3pDLDBCQUF5QjtBQUN6QjtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVFQUFzRTs7QUFFdEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxpQ0FBZ0MsZ0NBQWdDLGNBQWMsS0FBSztBQUNuRixnQ0FBK0IsMkJBQTJCLGNBQWM7QUFDeEUsY0FBYTtBQUNiO0FBQ0EsMENBQXlDLEVBQUU7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLG1DQUFtQyxtQkFBbUIsdUVBQXVFLGlDQUFpQztBQUN6TCxpRUFBZ0U7QUFDaEUsY0FBYTtBQUNiO0FBQ0EsMkJBQTBCO0FBQzFCLGNBQWE7QUFDYixjQUFhLFdBQVc7QUFDeEI7QUFDQSw0QkFBMkIsR0FBRyxLQUFLLFVBQVU7QUFDN0MsMEJBQXlCLEdBQUcsS0FBSzs7QUFFakM7QUFDQTtBQUNBO0FBQ0EsNEZBQTJGO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOztBQUVEOzs7Ozs7O0FDektBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQiw0QkFBNEIsT0FBTyx3Q0FBd0MsTUFBTTtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQStDLHNCQUFzQixzQkFBc0I7QUFDM0Y7O0FBRUE7QUFDQSxnREFBK0Msc0JBQXNCLHNCQUFzQjtBQUMzRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCLGdCQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsZUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLFFBQVE7QUFDdkIsaUJBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBLDRCQUEyQixHQUFHO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3RUFBdUUsY0FBYyxlQUFlLGFBQWEsY0FBYyxpQkFBaUI7QUFDaEo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVGltZWxpbmVTdHJhdGVneVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJHY1NwcmVhZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl1bXCJUaW1lbGluZVN0cmF0ZWd5XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWM0ODczOTg0MTY0MTkwYTRlOGVcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy9yZWdpb24gRmllbGRcbiAgICB2YXIgZG9UID0gcmVxdWlyZSgnLi4vZG9ULmpzJyk7XG4gICAgdmFyIGdjVXRpbHMgPSByZXF1aXJlKCcuLi9nY1V0aWxzJyk7XG4gICAgdmFyIGRvbVV0aWwgPSByZXF1aXJlKCcuLi9kb21VdGlsJyk7XG4gICAgdmFyIFBPU19BQlMgPSAnYWJzb2x1dGUnO1xuICAgIHZhciBQT1NfUkVMID0gJ3JlbGF0aXZlJztcbiAgICB2YXIgT1ZFUkZMT1dfSElEREVOID0gJ2hpZGRlbic7XG4gICAgdmFyIFZJRVdfUE9SVCA9ICd2aWV3cG9ydCc7XG4gICAgdmFyIE1BSU5fTElORSA9ICdtYWlubGluZSc7XG4gICAgdmFyIERJU1BMQVlNT0RFX0FMTCA9ICdhbGwnO1xuICAgIHZhciBESVNQTEFZTU9ERV9TRVBBUkFURSA9ICdzZXBhcmF0ZSc7XG4gICAgdmFyIERJU1BMQVlNT0RFX0JPVEggPSAnYm90aCc7XG4gICAgdmFyIERJUkVDVElPTl9MRUZUID0gJ2xlZnQnO1xuICAgIHZhciBESVJFQ1RJT05fUklHSFQgPSAncmlnaHQnO1xuXG4gICAgLy9lbmRyZWdpb25cblxuICAgIC8vcmVnaW9uIENvbnN0cnVjdG9yXG4gICAgdmFyIFRpbWVsaW5lU3RyYXRlZ3kgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5uYW1lID0gJ1RpbWVsaW5lJztcbiAgICAgICAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBzZWxmLmdldERlZmF1bHRPcHRpb25zKCkpO1xuICAgICAgICBzZWxmLmxheW91dEluZm9fID0gbnVsbDtcbiAgICB9O1xuICAgIC8vZW5kcmVnaW9uXG5cbiAgICAvL3JlZ2lvbiBQcm90b3R5cGVcbiAgICBUaW1lbGluZVN0cmF0ZWd5LnByb3RvdHlwZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oZ3JpZCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5ncmlkID0gZ3JpZDtcblxuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlV2hlZWwuYWRkSGFuZGxlcihoYW5kbGVNb3VzZVdoZWVsXyk7XG4gICAgICAgICAgICBjbGVhckNhY2hlLmNhbGwoc2VsZik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RGVmYXVsdE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5TW9kZTogRElTUExBWU1PREVfU0VQQVJBVEUsXG4gICAgICAgICAgICAgICAgZ3V0dGVyOiAxMyxcbiAgICAgICAgICAgICAgICBpbnRlcnZhbERpc3RhbmNlOiAxNVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRJbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIHNlbGYubGF5b3V0SW5mb18gfHwgKHNlbGYubGF5b3V0SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5saW5lOiBnZXRWaWV3UG9ydExheW91dEluZm9fLmNhbGwoc2VsZiksXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiBnZXRWaWV3UG9ydExheW91dEluZm9fLmNhbGwoc2VsZilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJSb3dJbmZvXzogZnVuY3Rpb24ocm93LCBhcmVhKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmVuZGVyUm93SW5mby5jYWxsKHRoaXMsIHJvdywgYXJlYSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVuZGVyUmFuZ2VfOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmVuZGVyUmFuZ2UuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJJbmZvOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmVuZGVySW5mby5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJvd1RlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vcm93IGlzIHBsYWNlZCBieSBsYXlvdXRlbmdpbmUsc28gdGhlcmUgaXMgbm8gbmVlZCBmb3IgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgfSxcblxuICAgICAgICBzaG93U2Nyb2xsUGFuZWw6IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRHcm91cEluZm9zSGVpZ2h0XzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY3JvbGxQYW5lbFJlbmRlckluZm86IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIGlmIChhcmVhID09PSBNQUlOX0xJTkUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2aWV3cG9ydExheW91dCA9IHRoaXMuZ2V0TGF5b3V0SW5mbygpLnZpZXdwb3J0O1xuICAgICAgICAgICAgdmFyIHNob3dWU2Nyb2xsYmFyID0gdmlld3BvcnRMYXlvdXQuY29udGVudEhlaWdodCA+IHZpZXdwb3J0TGF5b3V0LmhlaWdodDtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwgc2Nyb2xsLWxlZnQgc2Nyb2xsLXRvcCcsXG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB2aWV3cG9ydExheW91dC50b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHZpZXdwb3J0TGF5b3V0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnRMYXlvdXQuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQud2lkdGggKyAoc2hvd1ZTY3JvbGxiYXIgPyBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCA6IDApLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvd1g6ICdhdXRvJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2aWV3cG9ydExheW91dC5jb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQuY29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTY3JvbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gZ3JpZC5zY3JvbGxPZmZzZXQudG9wO1xuICAgICAgICAgICAgdmFyIGxheW91dCA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpLnZpZXdwb3J0O1xuICAgICAgICAgICAgdmFyIG1heE9mZnNldFRvcCA9IGxheW91dC5jb250ZW50SGVpZ2h0IC0gbGF5b3V0LmhlaWdodDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Njcm9sbFRvcDogJyArIGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIGlmIChtYXhPZmZzZXRUb3AgLSBvZmZzZXRUb3AgPCAyMCAmJiAhc2VsZi5zY3JvbGxUb0VuZCAmJiAhc2VsZi52YWxpZGF0ZVdoZW5TY3JvbGxfKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2JlZ2luIHZhbGlkYXRlJyk7XG4gICAgICAgICAgICAgICAgc2VsZi52YWxpZGF0ZVdoZW5TY3JvbGxfID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZW5kIHZhbGlkYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLnZhbGlkYXRlV2hlblNjcm9sbF87XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncmlkLnNjcm9sbFJlbmRlclBhcnRfKFZJRVdfUE9SVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGl0VGVzdDogZnVuY3Rpb24oZXZlbnRBcmdzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gZXZlbnRBcmdzLnBhZ2VYO1xuICAgICAgICAgICAgdmFyIHRvcCA9IGV2ZW50QXJncy5wYWdlWTtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGxheW91dCA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpO1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lckluZm8gPSBncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IGxlZnQgLSBjb250YWluZXJJbmZvLmxlZnQ7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gdG9wIC0gY29udGFpbmVySW5mby50b3A7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICB2YXIgbGF5b3V0RW5naW5lID0gZ3JpZC5sYXlvdXRFbmdpbmU7XG4gICAgICAgICAgICB2YXIgaGl0VGVzdEluZm87XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcztcbiAgICAgICAgICAgIHZhciBncm91cEluZm87XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyU2l6ZTtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJPZmZzZXQ7XG4gICAgICAgICAgICB2YXIgZ3JvdXBDb250YWluZXJLZXk7XG4gICAgICAgICAgICB2YXIgZ3JvdXBDb250YWluZXI7XG4gICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBsYXlvdXQudmlld3BvcnQ7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICB0b3A6IG9mZnNldFRvcFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGxheW91dFJlY3RzID0gZ2V0UmVuZGVyRXZlbnRSZWN0cy5jYWxsKHNlbGYsIHZpZXdwb3J0TGF5b3V0KTtcbiAgICAgICAgICAgIHZhciB2aWV3UG9ydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkICsgJy12aWV3cG9ydCcpO1xuICAgICAgICAgICAgaWYgKCFjb250YWluc18odmlld3BvcnRMYXlvdXQsIHBvaW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3JvdXBJbmZvcyA9IGdyaWQuZ3JvdXBJbmZvc187XG4gICAgICAgICAgICBpZiAoIWdyb3VwSW5mb3MgfHwgZ3JvdXBJbmZvcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyb3VwSW5mb3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGlzcGxheU1vZGUgPT09IERJU1BMQVlNT0RFX0FMTCkge1xuICAgICAgICAgICAgICAgICAgICBncm91cENvbnRhaW5lcktleSA9IGdyaWQudWlkICsgJy1nJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cENvbnRhaW5lcktleSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cENvbnRhaW5lciAmJiBwb2ludEluXyhvZmZzZXRMZWZ0LCBvZmZzZXRUb3AsIGdyb3VwQ29udGFpbmVyLCB2aWV3UG9ydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cEhlaWdodCA9IGdldEVsZW1lbnRTaXplRnJvbUNhY2hlLmNhbGwoc2VsZiwgZ3JvdXBDb250YWluZXJLZXkpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGdyb3VwQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclNpemUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGxheW91dFJlY3RzLmxlZnRSZWN0LndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogZ3JvdXBIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0gbGF5b3V0RW5naW5lLmhpdFRlc3RHcm91cENvbnRlbnRfKGdyb3VwSW5mbywgJ3ZpZXdwb3J0JywgbGVmdCAtIGNvbnRhaW5lck9mZnNldC5sZWZ0LCB0b3AgLSBjb250YWluZXJPZmZzZXQudG9wLCBjb250YWluZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGl0VGVzdEluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiAndmlld3BvcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6ICdldmVudENvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoaXRUZXN0SW5mbztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMCwgaXRlbUNvdW50ID0gZ3JvdXBJbmZvLmRhdGEuaXRlbUNvdW50OyBpbmRleCA8IGl0ZW1Db3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb250YWluZXJLZXkgPSBncmlkLnVpZCArICctZycgKyBncm91cEluZm8ucGF0aC5qb2luKCdfJykgKyAnLWNvbnRhaW5lcicgKyBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBDb250YWluZXJLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwQ29udGFpbmVyICYmIHBvaW50SW5fKG9mZnNldExlZnQsIG9mZnNldFRvcCwgZ3JvdXBDb250YWluZXIsIHZpZXdQb3J0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6ICd2aWV3cG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ2V2ZW50Q29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwSW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuXG4gICAgICAgICAgICBncmlkLm9uTW91c2VXaGVlbC5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlV2hlZWxfKTtcbiAgICAgICAgICAgIHNlbGYuZ3JpZCA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXJSZW5kZXJDYWNoZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFzZWxmLnZhbGlkYXRlV2hlblNjcm9sbF8pIHtcbiAgICAgICAgICAgICAgICBjbGVhckNhY2hlLmNhbGwoc2VsZik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxhYmxlSGVpZ2h0XyA9IDA7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vZW5kcmVnaW9uXG5cbiAgICBmdW5jdGlvbiBjbGVhckNhY2hlKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICBzY29wZS5jYWNoZWRJdGVtU2l6ZV8gPSBbXTtcbiAgICAgICAgc2NvcGUuc2Nyb2xsVG9FbmQgPSBudWxsO1xuICAgICAgICBzY29wZS5oYXNWU2Nyb2xsQmFyXyA9IG51bGw7XG4gICAgICAgIHNjb3BlLmNhY2hlZEdyb3VwSGVhZGVyRm5fID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWaWV3UG9ydExheW91dEluZm9fKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgIHZhciBjb250YWluZXJSZWN0ID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuICAgICAgICB2YXIgbGVmdCA9IDA7XG4gICAgICAgIHZhciB0b3AgPSAwO1xuICAgICAgICB2YXIgd2lkdGggPSBjb250YWluZXJSZWN0LndpZHRoO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gY29udGFpbmVyUmVjdC5oZWlnaHQ7XG4gICAgICAgIHdpZHRoID0gaGFzVlNjcm9sbEJhci5jYWxsKHNjb3BlKSA/ICh3aWR0aCAtIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoKSA6IHdpZHRoO1xuICAgICAgICB2YXIgY29udGVudGhlaWdodCA9IGdldGNvbnRlbnRIZWlnaHQuY2FsbChzY29wZSwgdG9wLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICBjb250ZW50V2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgY29udGVudEhlaWdodDogY29udGVudGhlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldGNvbnRlbnRIZWlnaHQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIGlmIChzY29wZS5zY3JvbGxhYmxlSGVpZ2h0Xykge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLnNjcm9sbGFibGVIZWlnaHRfO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1cnJlbnRMYXlvdXRJbmZvID0ge1xuICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldFRvcDogZ3JpZC5zY3JvbGxPZmZzZXQgPyBncmlkLnNjcm9sbE9mZnNldC50b3AgOiAwLFxuICAgICAgICAgICAgb2Zmc2V0TGVmdDogZ3JpZC5zY3JvbGxPZmZzZXQgPyBncmlkLnNjcm9sbE9mZnNldC5sZWZ0IDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHNjb3BlLnNjcm9sbGFibGVIZWlnaHRfID0gbWVhc3VyZVNjcm9sbGFibGVIZWlnaHQuY2FsbChzY29wZSwgY3VycmVudExheW91dEluZm8sIG9wdGlvbnMpO1xuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHNjcm9sbGFibGVIZWlnaHQ6ICcgKyBzY29wZS5zY3JvbGxhYmxlSGVpZ2h0Xyk7XG4gICAgICAgIHJldHVybiBzY29wZS5zY3JvbGxhYmxlSGVpZ2h0XztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJJbmZvKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYXJlYSA9IChvcHRpb25zICYmIG9wdGlvbnMuYXJlYSkgfHwgJyc7XG4gICAgICAgIGlmICghYXJlYSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpO1xuICAgICAgICB2YXIgY3VycmVudExheW91dEluZm8gPSBsYXlvdXRJbmZvLnZpZXdwb3J0O1xuICAgICAgICB2YXIgcjtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgdmFyIGhlaWdodCA9IGN1cnJlbnRMYXlvdXRJbmZvLmhlaWdodDtcbiAgICAgICAgdmFyIHdpZHRoID0gY3VycmVudExheW91dEluZm8ud2lkdGg7XG5cbiAgICAgICAgaWYgKGFyZWEgPT09IFZJRVdfUE9SVCkge1xuICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2Mtdmlld3BvcnQnLFxuICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogY3VycmVudExheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyZW50TGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2VHJhbnNsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogLW9wdGlvbnMub2Zmc2V0VG9wIHx8IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IGdldFJlbmRlcmVkRXZlbnRFbGVtZW50cy5jYWxsKHNjb3BlLCBjdXJyZW50TGF5b3V0SW5mbywgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy1tYWlubGluZScsXG4gICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyZW50TGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGN1cnJlbnRMYXlvdXRJbmZvLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19ISURERU5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gZ2V0VGltZUxpbmVFbGVtZW50LmNhbGwoc2NvcGUsIGN1cnJlbnRMYXlvdXRJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkRXZlbnRFbGVtZW50cyhsYXlvdXRJbmZvLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEV2ZW50c0luZm8uY2FsbCh0aGlzLCBsYXlvdXRJbmZvLCBvcHRpb25zKS5yb3dzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lYXN1cmVTY3JvbGxhYmxlSGVpZ2h0KGxheW91dEluZm8sIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG1lYXN1cmVPcHRpb25zID0ge1xuICAgICAgICAgICAgaGVpZ2h0OiBsYXlvdXRJbmZvLmhlaWdodCArIDIwMFxuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zLCBtZWFzdXJlT3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEV2ZW50c0luZm8uY2FsbCh0aGlzLCBsYXlvdXRJbmZvLCBvcHRpb25zKS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGltZUxpbmVFbGVtZW50KGxheW91dEluZm8pIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgdmFyIHRpbWVMaW5lTG9jYXRpb24gPSBnZXRUaW1lTGluZUxvY2F0aW9uLmNhbGwoc2NvcGUsIGxheW91dEluZm8pO1xuICAgICAgICB2YXIgdGltZUxpbmVzID0gW107XG4gICAgICAgIGlmIChzY29wZS5vcHRpb25zLmRpc3BsYXlNb2RlID09PSBESVNQTEFZTU9ERV9CT1RIKSB7XG4gICAgICAgICAgICB0aW1lTGluZXMucHVzaChnZXRSZW5kZXJlZFRpbWVMaW5lSW5mby5jYWxsKHNjb3BlLCB0aW1lTGluZUxvY2F0aW9uLmxlZnRBeGlzKSk7XG4gICAgICAgICAgICB0aW1lTGluZXMucHVzaChnZXRSZW5kZXJlZFRpbWVMaW5lSW5mby5jYWxsKHNjb3BlLCB0aW1lTGluZUxvY2F0aW9uLnJpZ2h0QXhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZUxpbmVzLnB1c2goZ2V0UmVuZGVyZWRUaW1lTGluZUluZm8uY2FsbChzY29wZSwgdGltZUxpbmVMb2NhdGlvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVMaW5lcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaW1lbGluZVdpZHRoKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgdGltZUxpbmVSZWN0ID0ge3RvcDogMCwgbGVmdDogMH07XG4gICAgICAgIHZhciB0aW1lTGluZSA9IGdldFJlbmRlcmVkVGltZUxpbmVJbmZvLmNhbGwoc2NvcGUsIHRpbWVMaW5lUmVjdCk7XG4gICAgICAgIHJldHVybiBnZXRFbGVtZW50U2l6ZS5jYWxsKHNjb3BlLCB0aW1lTGluZSwgdGltZUxpbmUua2V5KS53aWR0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJFdmVudFJlY3RzKGxheW91dEluZm8pIHtcbiAgICAgICAgdmFyIGxlZnRSZWN0O1xuICAgICAgICB2YXIgcmlnaHRSZWN0O1xuICAgICAgICB2YXIgbGVmdGxlYWRTaGFwZTtcbiAgICAgICAgdmFyIHJpZ2h0bGVhZFNoYXBlO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgbGluZVdpZHRoID0gZ2V0VGltZWxpbmVXaWR0aC5jYWxsKHNlbGYpO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXNwbGF5TW9kZSA9PT0gRElTUExBWU1PREVfU0VQQVJBVEUpIHtcbiAgICAgICAgICAgIHZhciByaWdodGVkZ2UgPSAobGF5b3V0SW5mby53aWR0aCArIGxpbmVXaWR0aCkgLyAyO1xuICAgICAgICAgICAgbGVmdGxlYWRTaGFwZSA9IGdldGxlYWRTaGFwZVJlbmRlckluZm8uY2FsbChzZWxmLCBESVJFQ1RJT05fTEVGVCk7XG4gICAgICAgICAgICBsZWZ0UmVjdCA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogcmlnaHRlZGdlIC0gbGVmdGxlYWRTaGFwZS53aWR0aCArIDEsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJpZ2h0bGVhZFNoYXBlID0gZ2V0bGVhZFNoYXBlUmVuZGVySW5mby5jYWxsKHNlbGYsIERJUkVDVElPTl9SSUdIVCk7XG4gICAgICAgICAgICB2YXIgbGVmdGVkZ2UgPSAobGF5b3V0SW5mby53aWR0aCAtIGxpbmVXaWR0aCkgLyAyO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSBsZWZ0ZWRnZSArIHJpZ2h0bGVhZFNoYXBlLndpZHRoO1xuICAgICAgICAgICAgcmlnaHRSZWN0ID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQgLSAxLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0SW5mby53aWR0aCAtIGxlZnQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kaXNwbGF5TW9kZSA9PT0gRElTUExBWU1PREVfQUxMKSB7XG4gICAgICAgICAgICByaWdodGxlYWRTaGFwZSA9IGdldGxlYWRTaGFwZVJlbmRlckluZm8uY2FsbChzZWxmLCBESVJFQ1RJT05fUklHSFQpO1xuICAgICAgICAgICAgcmlnaHRSZWN0ID0gbGVmdFJlY3QgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogcmlnaHRsZWFkU2hhcGUud2lkdGggLSAxLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0SW5mby53aWR0aCAtIHJpZ2h0bGVhZFNoYXBlLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVmdGxlYWRTaGFwZSA9IGdldGxlYWRTaGFwZVJlbmRlckluZm8uY2FsbChzZWxmLCBESVJFQ1RJT05fTEVGVCk7XG4gICAgICAgICAgICByaWdodGxlYWRTaGFwZSA9IGdldGxlYWRTaGFwZVJlbmRlckluZm8uY2FsbChzZWxmLCBESVJFQ1RJT05fUklHSFQpO1xuICAgICAgICAgICAgdmFyIG1pZGRsZVNwYWNlID0gbGF5b3V0SW5mby53aWR0aCAtIGxlZnRsZWFkU2hhcGUud2lkdGggLSByaWdodGxlYWRTaGFwZS53aWR0aDtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IE1hdGguZmxvb3IobWlkZGxlU3BhY2UgKiAwLjgpO1xuICAgICAgICAgICAgbGVmdFJlY3QgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogbGVmdGxlYWRTaGFwZS53aWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByaWdodFJlY3QgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogcmlnaHRsZWFkU2hhcGUud2lkdGggKyBtaWRkbGVTcGFjZSAtIHdpZHRoLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdFJlY3Q6IGxlZnRSZWN0LFxuICAgICAgICAgICAgcmlnaHRSZWN0OiByaWdodFJlY3RcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNWU2Nyb2xsQmFyKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICBpZiAoc2NvcGUuaGFzVlNjcm9sbEJhcl8pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgY29udGFpbmVyUmVjdCA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgdmFyIGxlZnQgPSAwO1xuICAgICAgICB2YXIgdG9wID0gMDtcbiAgICAgICAgdmFyIHdpZHRoID0gY29udGFpbmVyUmVjdC53aWR0aDtcbiAgICAgICAgdmFyIGhlaWdodCA9IGNvbnRhaW5lclJlY3QuaGVpZ2h0O1xuICAgICAgICB2YXIgY29udGVudGhlaWdodCA9IGdldGNvbnRlbnRIZWlnaHQuY2FsbChzY29wZSwgdG9wLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgc2NvcGUuY2FjaGVkSXRlbVNpemVfID0gW107XG4gICAgICAgIHNjb3BlLnNjcm9sbFRvRW5kID0gbnVsbDtcbiAgICAgICAgc2NvcGUuaGFzVlNjcm9sbEJhcl8gPSBjb250ZW50aGVpZ2h0ID4gaGVpZ2h0O1xuICAgICAgICByZXR1cm4gc2NvcGUuaGFzVlNjcm9sbEJhcl87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRUaW1lTGluZUluZm8obG9jYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogJ3RpbWVsaW5lLWxpbmUnLFxuICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAndGltZWxpbmUtbGluZScsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbG9jYXRpb24ubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBsb2NhdGlvbi50b3AsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiAnPGRpdj48L2Rpdj4nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGltZUxpbmVMb2NhdGlvbihsYXlvdXRJbmZvKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciBsaW5lV2lkdGggPSBnZXRUaW1lbGluZVdpZHRoLmNhbGwoc2VsZik7XG4gICAgICAgIGlmIChvcHRpb25zLmRpc3BsYXlNb2RlID09PSBESVNQTEFZTU9ERV9TRVBBUkFURSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogKGxheW91dEluZm8ud2lkdGggLSBsaW5lV2lkdGgpIC8gMlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmRpc3BsYXlNb2RlID09PSBESVNQTEFZTU9ERV9BTEwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kaXNwbGF5TW9kZSA9PT0gRElTUExBWU1PREVfQk9USCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0QXhpczoge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJpZ2h0QXhpczoge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxheW91dEluZm8ud2lkdGggLSBsaW5lV2lkdGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyUmFuZ2Uob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5hcmVhID09PSBNQUlOX0xJTkUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHIgPSBnZXRSZW5kZXJJbmZvLmNhbGwoc2VsZiwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IC1vcHRpb25zLm9mZnNldFRvcCB8fCAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHJlbmRlcmVkUm93czogci5yZW5kZXJlZFJvd3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSZW5kZXJSb3dJbmZvKHJvdykge1xuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkRXZlbnRzSW5mbyhsYXlvdXRJbmZvLCBzY3JvbGxvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgIHZhciBncm91cHNJbmZvcyA9IGdldEN1cnJlbnRWaWV3R3JvdXBfLmNhbGwoc2VsZik7XG4gICAgICAgIHZhciBsYXlvdXRSZWN0cyA9IGdldFJlbmRlckV2ZW50UmVjdHMuY2FsbChzZWxmLCBsYXlvdXRJbmZvLCBzY3JvbGxvcHRpb25zKTtcbiAgICAgICAgdmFyIG9mZnNldFRvcCA9IHNjcm9sbG9wdGlvbnMub2Zmc2V0VG9wO1xuICAgICAgICB2YXIgaWRQcmVmaXggPSBzZWxmLmdyaWQudWlkO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgIHZhciBncm91cFJlbmRlckluZm87XG4gICAgICAgIHZhciBkaXNwbGF5TW9kZSA9IHNlbGYub3B0aW9ucy5kaXNwbGF5TW9kZTtcbiAgICAgICAgdmFyIGxlZnRSZWN0O1xuICAgICAgICB2YXIgcmlnaHRSZWN0O1xuICAgICAgICB2YXIgY2hpbGRIVE1MID0gJyc7XG4gICAgICAgIHZhciB0cFJvdztcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gMDtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgIHZhciBsZWFkU2hhcGU7XG4gICAgICAgIHZhciBjb250YWluc2VyU2l6ZTtcbiAgICAgICAgdmFyIHJlbmRlclJvd3M7XG4gICAgICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgKyAoc2Nyb2xsb3B0aW9ucy5oZWlnaHQgPyBzY3JvbGxvcHRpb25zLmhlaWdodCA6IGxheW91dEluZm8uaGVpZ2h0KTtcbiAgICAgICAgdmFyIHRvcCA9IDA7XG4gICAgICAgIHZhciBpdGVtSGVpZ2h0ID0gMDtcbiAgICAgICAgdmFyIGxlZnRUb3AgPSAwO1xuICAgICAgICB2YXIgcmlnaHRUb3AgPSAwO1xuICAgICAgICB2YXIgbGF5b3V0RGlyZWN0aW9uID0gRElSRUNUSU9OX0xFRlQ7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBncm91cHNJbmZvcy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvID0gZ3JvdXBzSW5mb3NbaW5kZXhdO1xuICAgICAgICAgICAgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgIGlmIChpc091dE9mVmlld1BvcnQodG9wLCBvZmZzZXRCb3R0b20pKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXNwbGF5TW9kZSA9PT0gRElTUExBWU1PREVfQUxMKSB7XG4gICAgICAgICAgICAgICAgbGVmdFJlY3QgPSBsYXlvdXRSZWN0cy5sZWZ0UmVjdDtcbiAgICAgICAgICAgICAgICB0cFJvdyA9IGdldEdyb3VwSGVhZGVyXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgMCwgdG9wLCBsYXlvdXRJbmZvLndpZHRoKTtcbiAgICAgICAgICAgICAgICBpZiAodHBSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCA9IHRwUm93LmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCArPSBvcHRpb25zLmludGVydmFsRGlzdGFuY2UgPyBvcHRpb25zLmludGVydmFsRGlzdGFuY2UgOiAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnRlcnNlY3RBcmVhKHRvcCwgdG9wICsgaXRlbUhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2godHBSb3cucm93KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b3AgKz0gaXRlbUhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZWFkU2hhcGUgPSBnZXRsZWFkU2hhcGVSZW5kZXJJbmZvLmNhbGwoc2VsZiwgRElSRUNUSU9OX1JJR0hUKTtcbiAgICAgICAgICAgICAgICBjaGlsZEhUTUwgKz0gbGVhZFNoYXBlLnNoYXBlO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gbGVmdFJlY3Qud2lkdGg7XG4gICAgICAgICAgICAgICAgY29udGFpbnNlclNpemUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlbmRlclJvd3MgPSBnZXRMYXlvdXRFbmdpbmVJbm5lckdyb3VwUmVuZGVySW5mby5jYWxsKHNlbGYsIGxheW91dEVuZ2luZSwgZ3JvdXBJbmZvLCBjb250YWluc2VyU2l6ZSwgZ2V0T25lU2lkZUV2ZW50TGF5b3V0Q2FsbEJhY2suYmluZChzZWxmKSk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVuZGVyUm93cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZEhUTUwgKz0gZ3JpZC5yZW5kZXJSb3dfKHJlbmRlclJvd3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGdyb3VwUmVuZGVySW5mbyA9IGdldEdyb3VwUmVuZGVySW5mby5jYWxsKHNlbGYsIGlkUHJlZml4LCBncm91cEluZm8sIGxlZnRSZWN0LmxlZnQsIHRvcCwgY29udGFpbmVyV2lkdGgsIGNoaWxkSFRNTCk7XG4gICAgICAgICAgICAgICAgaXRlbUhlaWdodCA9IGdldEVsZW1lbnRTaXplLmNhbGwoc2VsZiwgZ3JvdXBSZW5kZXJJbmZvLCBncm91cFJlbmRlckluZm8ua2V5KS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaW50ZXJ2YWxEaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtSGVpZ2h0ICs9IG9wdGlvbnMuaW50ZXJ2YWxEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzSW50ZXJzZWN0QXJlYSh0b3AsIHRvcCArIGl0ZW1IZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSkge1xuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ3JvdXBSZW5kZXJJbmZvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgICAgICAgICAgICAgY2hpbGRIVE1MID0gJyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3BsYXlNb2RlID09PSBESVNQTEFZTU9ERV9TRVBBUkFURSkge1xuICAgICAgICAgICAgICAgIGxlZnRSZWN0ID0gbGF5b3V0UmVjdHMubGVmdFJlY3Q7XG4gICAgICAgICAgICAgICAgcmlnaHRSZWN0ID0gbGF5b3V0UmVjdHMucmlnaHRSZWN0O1xuICAgICAgICAgICAgICAgIHRwUm93ID0gZ2V0R3JvdXBIZWFkZXJfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCAwLCB0b3AsIGxheW91dEluZm8ud2lkdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRwUm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1IZWlnaHQgPSB0cFJvdy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1IZWlnaHQgKz0gb3B0aW9ucy5pbnRlcnZhbERpc3RhbmNlID8gb3B0aW9ucy5pbnRlcnZhbERpc3RhbmNlIDogMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW50ZXJzZWN0QXJlYSh0b3AsIHRvcCArIGl0ZW1IZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHRwUm93LnJvdyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRUb3AgPSByaWdodFRvcCA9IHRvcDtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0RGlyZWN0aW9uID0gRElSRUNUSU9OX0xFRlQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSBsZWZ0UmVjdC53aWR0aDtcbiAgICAgICAgICAgICAgICBjb250YWluc2VyU2l6ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVuZGVyUm93cyA9IGdldExheW91dEVuZ2luZUlubmVyR3JvdXBSZW5kZXJJbmZvLmNhbGwoc2VsZiwgbGF5b3V0RW5naW5lLCBncm91cEluZm8sIGNvbnRhaW5zZXJTaXplLCBnZXRTZXBhcmF0ZUV2ZW50TGF5b3V0Q2FsbEJhY2suYmluZChzZWxmKSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZW5kZXJSb3dzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkSFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBsZWFkU2hhcGUgPSBnZXRsZWFkU2hhcGVSZW5kZXJJbmZvLmNhbGwoc2VsZiwgbGF5b3V0RGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRIVE1MICs9IGxlYWRTaGFwZS5zaGFwZTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRIVE1MICs9IGdyaWQucmVuZGVyUm93XyhyZW5kZXJSb3dzW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5b3V0RGlyZWN0aW9uID09PSBESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pbnRlcnZhbERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCArPSBvcHRpb25zLmludGVydmFsRGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFJlbmRlckluZm8gPSBnZXRHcm91cFJlbmRlckluZm8uY2FsbChzZWxmLCBpZFByZWZpeCwgZ3JvdXBJbmZvLCBsZWZ0UmVjdC5sZWZ0LCBsZWZ0VG9wLCBsZWZ0UmVjdC53aWR0aCwgY2hpbGRIVE1MLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1IZWlnaHQgKz0gZ2V0RWxlbWVudFNpemUuY2FsbChzZWxmLCBncm91cFJlbmRlckluZm8sIGdyb3VwUmVuZGVySW5mby5rZXkpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0ludGVyc2VjdEFyZWEobGVmdFRvcCwgbGVmdFRvcCArIGl0ZW1IZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChncm91cFJlbmRlckluZm8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFRvcCArPSBpdGVtSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0RGlyZWN0aW9uID0gRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pbnRlcnZhbERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCArPSBvcHRpb25zLmludGVydmFsRGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUmVuZGVySW5mbyA9IGdldEdyb3VwUmVuZGVySW5mby5jYWxsKHNlbGYsIGlkUHJlZml4LCBncm91cEluZm8sIHJpZ2h0UmVjdC5sZWZ0LCByaWdodFRvcCwgcmlnaHRSZWN0LndpZHRoLCBjaGlsZEhUTUwsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCArPSBnZXRFbGVtZW50U2l6ZS5jYWxsKHNlbGYsIGdyb3VwUmVuZGVySW5mbywgZ3JvdXBSZW5kZXJJbmZvLmtleSkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW50ZXJzZWN0QXJlYShyaWdodFRvcCwgcmlnaHRUb3AgKyBpdGVtSGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ3JvdXBSZW5kZXJJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0VG9wICs9IGl0ZW1IZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXREaXJlY3Rpb24gPSBESVJFQ1RJT05fTEVGVDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLm1heChsZWZ0VG9wLCByaWdodFRvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRwUm93ID0gZ2V0R3JvdXBIZWFkZXJfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCAwLCB0b3AsIGxheW91dEluZm8ud2lkdGgpO1xuICAgICAgICAgICAgICAgIGlmICh0cFJvdykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtSGVpZ2h0ID0gdHBSb3cuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpdGVtSGVpZ2h0ICs9IG9wdGlvbnMuaW50ZXJ2YWxEaXN0YW5jZSA/IG9wdGlvbnMuaW50ZXJ2YWxEaXN0YW5jZSA6IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ludGVyc2VjdEFyZWEodG9wLCB0b3AgKyBpdGVtSGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCh0cFJvdy5yb3cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRvcCArPSBpdGVtSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnRhaW5zZXJTaXplID0ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0UmVjdHMubGVmdFJlY3Qud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBJbmZvLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlbmRlclJvd3MgPSBnZXRBbGxSZW5kZXJlZFJvd3MuY2FsbChzZWxmLCBsYXlvdXRFbmdpbmUsIGdyb3VwSW5mbywgY29udGFpbnNlclNpemUpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlbmRlclJvd3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlclJvdyA9IHJlbmRlclJvd3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkSFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gcmVuZGVyUm93LmRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gRElSRUNUSU9OX1JJR0hUIDogRElSRUNUSU9OX0xFRlQ7XG4gICAgICAgICAgICAgICAgICAgIGxlYWRTaGFwZSA9IGdldGxlYWRTaGFwZVJlbmRlckluZm8uY2FsbChzZWxmLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZEhUTUwgKz0gbGVhZFNoYXBlLnNoYXBlO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZEhUTUwgKz0gZ3JpZC5yZW5kZXJSb3dfKHJlbmRlclJvdy5yb3cpO1xuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1IZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pbnRlcnZhbERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtSGVpZ2h0ICs9IG9wdGlvbnMuaW50ZXJ2YWxEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGF5b3V0UmVjdCA9IHJlbmRlclJvdy5kaXJlY3Rpb24gPT09ICdsZWZ0JyA/IGxheW91dFJlY3RzLmxlZnRSZWN0IDogbGF5b3V0UmVjdHMucmlnaHRSZWN0O1xuICAgICAgICAgICAgICAgICAgICBncm91cFJlbmRlckluZm8gPSBnZXRHcm91cFJlbmRlckluZm8uY2FsbChzZWxmLCBpZFByZWZpeCwgZ3JvdXBJbmZvLCBsYXlvdXRSZWN0LmxlZnQsIHRvcCwgbGF5b3V0UmVjdC53aWR0aCwgY2hpbGRIVE1MLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUhlaWdodCArPSBnZXRFbGVtZW50U2l6ZS5jYWxsKHNlbGYsIGdyb3VwUmVuZGVySW5mbywgZ3JvdXBSZW5kZXJJbmZvLmtleSkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnRlcnNlY3RBcmVhKHRvcCwgdG9wICsgaXRlbUhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ3JvdXBSZW5kZXJJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b3AgKz0gaXRlbUhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPT09IGdyb3Vwc0luZm9zLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxUb0VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93czogcm93cyxcbiAgICAgICAgICAgIGhlaWdodDogdG9wXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWxsUmVuZGVyZWRSb3dzKGxheW91dEVuZ2luZSwgZ3JvdXBJbmZvLCBjb250YWluc2VyU2l6ZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciByZW5kZXJSb3dzID0gW107XG4gICAgICAgIHZhciBzdWJSb3dzO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZ3JvdXBJbmZvLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3ViR3JvdXAgPSBncm91cEluZm8uY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoIXN1Ykdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3ViUm93cyA9IGdldExheW91dEVuZ2luZUlubmVyR3JvdXBSZW5kZXJJbmZvLmNhbGwoc2VsZiwgbGF5b3V0RW5naW5lLCBzdWJHcm91cCwgY29udGFpbnNlclNpemUsIGdldFNlcGFyYXRlRXZlbnRMYXlvdXRDYWxsQmFjay5iaW5kKHNlbGYpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4yID0gc3ViUm93cy5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gc3ViUm93c1tqXTtcbiAgICAgICAgICAgICAgICByZW5kZXJSb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IHN1Ykdyb3VwLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcm93OiByb3csXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUluZGV4OiBzdWJHcm91cC5kYXRhLnRvU291cmNlUm93KGopXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJSb3dzLnNvcnQoZnVuY3Rpb24ocm93MSwgcm93Mikge1xuICAgICAgICAgICAgcmV0dXJuIHJvdzEuc291cmNlSW5kZXggPiByb3cyLnNvdXJjZUluZGV4O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVuZGVyUm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0ludGVyc2VjdEFyZWEodG9wLCBib3R0b20sIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgICAgIHJldHVybiBib3R0b20gPiBvZmZzZXRUb3AgJiYgdG9wIDwgb2Zmc2V0Qm90dG9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT3V0T2ZWaWV3UG9ydCh0b3AsIG9mZnNldEJvdHRvbSkge1xuICAgICAgICByZXR1cm4gdG9wID4gb2Zmc2V0Qm90dG9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExheW91dEVuZ2luZUlubmVyR3JvdXBSZW5kZXJJbmZvKGxheW91dEVuZ2luZSwgZ3JvdXBJbmZvLCBjb250YWluc2VyU2l6ZSwgY2FsbEJhY2spIHtcbiAgICAgICAgdmFyIHJvd3M7XG4gICAgICAgIHJvd3MgPSBsYXlvdXRFbmdpbmUuZ2V0SW5uZXJHcm91cFJlbmRlckluZm8oZ3JvdXBJbmZvLCBjb250YWluc2VyU2l6ZSwgY2FsbEJhY2spO1xuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50U2l6ZShyZW5kZXJJbmZvLCBrZXkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc2l6ZTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEVsZW1lbnRTaXplRnJvbUNhY2hlLmNhbGwoc2VsZiwga2V5KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnQgPSBzZWxmLmdyaWQucmVuZGVyUm93XyhyZW5kZXJJbmZvKTtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudChldmVudCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgc2l6ZSA9IGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QoZWxlbWVudCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgc2VsZi5jYWNoZWRJdGVtU2l6ZV8ucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50U2l6ZUZyb21DYWNoZShrZXkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gXy5maW5kKHNlbGYuY2FjaGVkSXRlbVNpemVfLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5rZXkgPT09IGtleTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBSZW5kZXJJbmZvKGlkUHJlZml4LCBncm91cEluZm8sIGxlZnQsIHRvcCwgd2lkdGgsIHJlbmRlckh0bWwsIGluZGV4KSB7XG4gICAgICAgIHZhciB0cmFpbGluZyA9IGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwoaW5kZXgpID8gJycgOiAoJy1jb250YWluZXInICsgaW5kZXgpO1xuICAgICAgICB2YXIga2V5ID0gaWRQcmVmaXggKyAnLWcnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpICsgdHJhaWxpbmc7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICd0aW1lbGluZS1ldmVudC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHJlbmRlckh0bWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRsZWFkU2hhcGVSZW5kZXJJbmZvKGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciByZW5kZXJIdG1sO1xuICAgICAgICB2YXIgaXNSaWdodFNpZGUgPSBkaXJlY3Rpb24gPT09IERJUkVDVElPTl9SSUdIVDtcbiAgICAgICAgdmFyIHdpZHRoID0gc2VsZi5vcHRpb25zLmd1dHRlcjtcblxuICAgICAgICByZW5kZXJIdG1sID0gaXNSaWdodFNpZGUgPyAnPGRpdiBjbGFzcz1cInRpbWVsaW5lLWxlZnRzaGFwZVwiIHN0eWxlPVwiZmxvYXQ6bGVmdDttYXJnaW4tbGVmdDonICsgLXdpZHRoICsgJ3B4O3dpZHRoOicgKyB3aWR0aCArICdweDtcIj48L2Rpdj4nIDpcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0aW1lbGluZS1yaWdodHNoYXBlXCIgc3R5bGU9XCJmbG9hdDpyaWdodDsgbWFyZ2luLXJpZ2h0OicgKyAtd2lkdGggKyAncHg7d2lkdGg6JyArIHdpZHRoICsgJ3B4O1wiPjwvZGl2Pic7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNoYXBlOiByZW5kZXJIdG1sLFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2VwYXJhdGVFdmVudExheW91dENhbGxCYWNrKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3NzQ2xhc3M6ICd0aW1lbGluZS1ldmVudCcsXG4gICAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvd0hlaWdodDogJzEwMCUnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T25lU2lkZUV2ZW50TGF5b3V0Q2FsbEJhY2soKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjc3NDbGFzczogJ3RpbWVsaW5lLWV2ZW50JyxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm93SGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlcl8oZ3JvdXBJbmZvLCBsZWZ0LCB0b3AsIHdpZHRoLCBnZXRVcGRhdGVLZXkpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgcm93O1xuICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXBJbmZvLmRhdGEuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgdmFyIGhlaWdodCA9IDA7XG4gICAgICAgIGlmIChoZWFkZXIgJiYgaGVhZGVyLnZpc2libGUpIHtcbiAgICAgICAgICAgIGlmICghaGVhZGVyLnRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBrZXkgPSBncmlkLnVpZCArICctZ2gnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgaWYgKGdldFVwZGF0ZUtleSkge1xuICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIGluZm86IGdyb3VwSW5mbyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdyA9IGdldEdyb3VwSGVhZGVyUm93LmNhbGwoc2NvcGUsIGtleSwgZ3JvdXBJbmZvLCBsZWZ0LCB3aWR0aCwgdG9wKTtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBnZXRFbGVtZW50U2l6ZS5jYWxsKHNjb3BlLCByb3csIGtleSkuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3c6IHJvdywgaGVpZ2h0OiBoZWlnaHR9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyUm93KGtleSwgZ3JvdXBJbmZvLCBsZWZ0LCB3aWR0aCwgdG9wKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93IGcnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiBnZXRHcm91cEhlYWRlclRlbXBsYXRlXy5jYWxsKHNlbGYsIGdyb3VwSW5mbykoZ2V0R3JvdXBGb290ZXJEYXRhXy5jYWxsKHNlbGYsIGdyb3VwSW5mbykpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJEYXRhXyhncm91cEluZm8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgICAgICBjb3VudDogZ3JvdXAuaXRlbUNvdW50LFxuICAgICAgICAgICAgbGV2ZWw6IGdyb3VwLmxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiBncm91cC5sZXZlbCAqIDE4LFxuICAgICAgICAgICAgZ3JvdXBTdGF0dXM6IGdyb3VwLmNvbGxhcHNlZCA/ICdjb2xsYXBzZWQnIDogJ2V4cGFuZCcsXG4gICAgICAgICAgICBjb25kaXRpb246IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5maWVsZFxuICAgICAgICB9O1xuICAgICAgICB2YXIgY2FsY1NvdXJjZSA9IHNlbGYuZ3JpZC5kYXRhLmNhbGNTb3VyY2U7XG4gICAgICAgIF8uZWFjaChzZWxmLmdyaWQuY29sdW1ucywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAvL1RPRE86IGhhbmRsZSB0aGUgY2FzZSB0aGF0IHRoZSBjb2wuYWdncmVnYXRpb24gaXMgYW4gYXJyYXlcbiAgICAgICAgICAgIHZhciBhZ2dyZWdhdG9yID0gKGNvbC5hZ2dyZWdhdGlvbiAmJiBjb2wuYWdncmVnYXRpb24ubGVuZ3RoID4gMCkgPyBjb2wuYWdncmVnYXRpb25bMF0gOiB7fTtcbiAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzU3RyaW5nKGFnZ3JlZ2F0b3IpKSB7XG4gICAgICAgICAgICAgICAgYWdncmVnYXRvciA9IHtmb3JtdWxhOiBhZ2dyZWdhdG9yfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFnZ3JlZ2F0b3IuZm9ybXVsYSAmJiBjYWxjU291cmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2FsY1NvdXJjZS5nZXRDYWxjR3JvdXBGaWVsZFZhbHVlKGNvbC5pZCwgZ3JvdXBJbmZvLnBhdGgpO1xuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZXIgPSBhZ2dyZWdhdG9yLmZvcm1hdDtcbiAgICAgICAgICAgICAgICBpZiAoIWdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwoZm9ybWF0dGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWRWYWx1ZSA9IGZvcm1hdFZhbHVlKHZhbHVlLCBmb3JtYXR0ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL3ZhciBmb3JtYXRWYWx1ZSA9IGZvcm1hdFZhbHVlXy5jYWxsKHNlbGYsIGNvbC5pZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIC8vVE9ETzogZ2V0IGFnZ3JlZ2F0b3IgdmFsdWVcbiAgICAgICAgICAgICAgICByZXN1bHRbJ19fYWdnXycgKyBjb2wuaWRdID0gZm9ybWF0dGVkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsKHdpbmRvdy5HY1NwcmVhZCkpIHtcbiAgICAgICAgICAgIHZhciBGb3JtYXR0ZXIgPSBnY1V0aWxzLmZpbmRQbHVnaW4oJ0Zvcm1hdHRlcicpO1xuICAgICAgICAgICAgdmFyIEV4Y2VsRm9ybWF0dGVyID0gRm9ybWF0dGVyID8gRm9ybWF0dGVyLkV4Y2VsRm9ybWF0dGVyIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChFeGNlbEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICAgIHZhciBmb3JtYXRPYmogPSBuZXcgRXhjZWxGb3JtYXR0ZXIoZm9ybWF0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0T2JqLmZvcm1hdCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyVGVtcGxhdGVfKGdyb3VwSW5mbykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncm91cFBhdGggPSBncm91cEluZm8ucGF0aDtcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgIHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl8gPSBzZWxmLmNhY2hlZEdyb3VwSGVhZGVyRm5fIHx8IFtdO1xuICAgICAgICBpZiAoc2VsZi5jYWNoZWRHcm91cEhlYWRlckZuX1tncm91cFBhdGgubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhY2hlZEdyb3VwSGVhZGVyRm5fW2dyb3VwUGF0aC5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoZWFkZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuaGVhZGVyO1xuICAgICAgICAvL1RPRE86IHByZXByb2Nlc3MgdXNlciBnaXZlbiBoZWFkZXIgdGVtcGxhdGUsIGFkZCBoZWlnaHRcbiAgICAgICAgdmFyIHRlbXBsYXRlU3RyID0gKGhlYWRlciAmJiBoZWFkZXIudGVtcGxhdGUpO1xuXG4gICAgICAgIHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdID0gZG9ULnRlbXBsYXRlKHRlbXBsYXRlU3RyLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRWaWV3R3JvdXBfKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy90b2RvOiBmaXRlciBzb21lIHVudXNlZCBncm91cCBpbmZvLlxuICAgICAgICByZXR1cm4gc2VsZi5ncmlkLmdyb3VwSW5mb3NfO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlV2hlZWxfKHNlbmRlciwgZSkge1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbmRlcjtcbiAgICAgICAgdmFyIHN0cmF0ZWd5ID0gZ3JpZC5sYXlvdXRFbmdpbmUuZ3JvdXBTdHJhdGVneV87XG4gICAgICAgIGlmICghc3RyYXRlZ3kuc2hvd1Njcm9sbFBhbmVsKFZJRVdfUE9SVCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2ltdWxhdGUgc2Nyb2xsXG4gICAgICAgIHZhciBvZmZzZXREZWx0YSA9IGUuZGVsdGFZO1xuICAgICAgICBpZiAob2Zmc2V0RGVsdGEgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBsYXlvdXQgPSBzdHJhdGVneS5nZXRMYXlvdXRJbmZvKCkudmlld3BvcnQ7XG4gICAgICAgICAgICB2YXIgbWF4T2Zmc2V0VG9wID0gbGF5b3V0LmNvbnRlbnRIZWlnaHQgLSBsYXlvdXQuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3A7XG4gICAgICAgICAgICBpZiAob2Zmc2V0RGVsdGEgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA+PSBtYXhPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKG9mZnNldFRvcCArIG9mZnNldERlbHRhLCBtYXhPZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9tVXRpbC5nZXRFbGVtZW50KCcjJyArIGdyaWQudWlkICsgJyAuZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwnKS5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH1cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zXyhsYXlvdXRJbmZvLCBwb2ludCkge1xuICAgICAgICByZXR1cm4gcG9pbnQubGVmdCA+PSBsYXlvdXRJbmZvLmxlZnQgJiYgcG9pbnQudG9wID49IGxheW91dEluZm8udG9wICYmIHBvaW50LmxlZnQgPD0gKGxheW91dEluZm8ubGVmdCArIGxheW91dEluZm8ud2lkdGgpICYmIHBvaW50LnRvcCA8PSAobGF5b3V0SW5mby50b3AgKyBsYXlvdXRJbmZvLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBlbGVtZW50LCByZWxhdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVsZU9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGVsZW1lbnQpO1xuICAgICAgICB2YXIgdGFyZ2V0RWxlT2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQocmVsYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdmFyIGxlZnQgPSBlbGVPZmZzZXQubGVmdCAtIHRhcmdldEVsZU9mZnNldC5sZWZ0O1xuICAgICAgICB2YXIgdG9wID0gZWxlT2Zmc2V0LnRvcCAtIHRhcmdldEVsZU9mZnNldC50b3A7XG5cbiAgICAgICAgaWYgKG9mZnNldExlZnQgPj0gbGVmdCAmJiBvZmZzZXRMZWZ0IDw9IChsZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aCkgJiZcbiAgICAgICAgICAgIG9mZnNldFRvcCA+PSB0b3AgJiYgb2Zmc2V0VG9wIDw9ICh0b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRpbWVsaW5lU3RyYXRlZ3k7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZ3JvdXBTdHJhdGVnaWVzL1RpbWVsaW5lU3RyYXRlZ3kuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBVTkRFRklORUQgPSAndW5kZWZpbmVkJztcbiAgICB2YXIgZ2NVdGlscyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKHZhbCwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mKHZhbCkgPT09IHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FzdHMgYSB2YWx1ZSB0byBhIHR5cGUgaWYgcG9zc2libGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY2FzdC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9yIGludGVyZmFjZSBuYW1lIHRvIGNhc3QgdG8uXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluIGlmIHRoZSBjYXN0IHdhcyBzdWNjZXNzZnVsLCBudWxsIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cnlDYXN0KHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIC8vIG51bGwgZG9lc24ndCBpbXBsZW1lbnQgYW55dGhpbmdcbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZXN0IGZvciBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb24gKElRdWVyeUludGVyZmFjZSlcbiAgICAgICAgaWYgKGlzU3RyaW5nKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKSAmJiB2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKHR5cGUpID8gdmFsdWUgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciB0eXBlIHRlc3RcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgdHlwZSA/IHZhbHVlIDogbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnRyeUNhc3QgPSB0cnlDYXN0O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHByaW1pdGl2ZSB0eXBlIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgb3IgZGF0ZSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSB8fCBpc0Jvb2xlYW4odmFsdWUpIHx8IGlzRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdzdHJpbmcnKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzdHJpbmcgaXMgbnVsbCwgZW1wdHksIG9yIHdoaXRlc3BhY2Ugb25seS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgPyB0cnVlIDogdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKS5sZW5ndGggPCAxO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2UgPSBpc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnbnVtYmVyJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNJbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA9PT0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0ludCA9IGlzSW50O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIEJvb2xlYW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Z1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgVU5ERUZJTkVEKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgRGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih2YWx1ZS5nZXRUaW1lKCkpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNEYXRlID0gaXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBBcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0FycmF5ID0gaXNBcnJheTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gb2JqZWN0IChhcyBvcHBvc2VkIHRvIGEgdmFsdWUgdHlwZSBvciBhIGRhdGUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhaXNEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIGEgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKiBAcmV0dXJuIEEgQHNlZTpEYXRhVHlwZSB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUeXBlKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXJyYXknO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5nZXRUeXBlID0gZ2V0VHlwZTtcblxuICAgIGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzVW5kZWZpbmVkKHZhbHVlKSB8fCBpc051bGwodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNOdWxsID0gaXNOdWxsO1xuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwgPSBpc1VuZGVmaW5lZE9yTnVsbDtcblxuICAgIC8vVE9ETzogcmV2aWV3IHRoaXMgbWV0aG9kIGFmdGVyIGZvcm1tdHRlciBpbXBsZW1lbnRhdGlvbiBkb25lLlxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHR5cGUgb2YgYSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb252ZXJzaW9uIGZhaWxzLCB0aGUgb3JpZ2luYWwgdmFsdWUgaXMgcmV0dXJuZWQuIFRvIGNoZWNrIGlmIGFcbiAgICAgKiBjb252ZXJzaW9uIHN1Y2NlZWRlZCwgeW91IHNob3VsZCBjaGVjayB0aGUgdHlwZSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY29udmVydC5cbiAgICAgKiBAcGFyYW0gdHlwZSBAc2VlOkRhdGFUeXBlIHRvIGNvbnZlcnQgdGhlIHZhbHVlIHRvLlxuICAgICAqIEByZXR1cm4gVGhlIGNvbnZlcnRlZCB2YWx1ZSwgb3IgdGhlIG9yaWdpbmFsIHZhbHVlIGlmIGEgY29udmVyc2lvbiB3YXMgbm90IHBvc3NpYmxlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IHN0cmluZ3MgdG8gbnVtYmVycywgZGF0ZXMsIG9yIGJvb2xlYW5zXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4obnVtKSA/IHZhbHVlIDogbnVtO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgYW55dGhpbmcgdG8gc3RyaW5nXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNoYW5nZVR5cGUgPSBjaGFuZ2VUeXBlO1xuICAgIC8vXG4gICAgLy8vKipcbiAgICAvLyAqIFJlcGxhY2VzIGVhY2ggZm9ybWF0IGl0ZW0gaW4gYSBzcGVjaWZpZWQgc3RyaW5nIHdpdGggdGhlIHRleHQgZXF1aXZhbGVudCBvZiBhblxuICAgIC8vICogb2JqZWN0J3MgdmFsdWUuXG4gICAgLy8gKlxuICAgIC8vICogVGhlIGZ1bmN0aW9uIHdvcmtzIGJ5IHJlcGxhY2luZyBwYXJ0cyBvZiB0aGUgPGI+Zm9ybWF0U3RyaW5nPC9iPiB3aXRoIHRoZSBwYXR0ZXJuXG4gICAgLy8gKiAne25hbWU6Zm9ybWF0fScgd2l0aCBwcm9wZXJ0aWVzIG9mIHRoZSA8Yj5kYXRhPC9iPiBwYXJhbWV0ZXIuIEZvciBleGFtcGxlOlxuICAgIC8vICpcbiAgICAvLyAqIDxwcmU+XG4gICAgLy8gKiB2YXIgZGF0YSA9IHsgbmFtZTogJ0pvZScsIGFtb3VudDogMTIzNDU2IH07XG4gICAgLy8gKiB2YXIgbXNnID0gd2lqbW8uZm9ybWF0KCdIZWxsbyB7bmFtZX0sIHlvdSB3b24ge2Ftb3VudDpuMn0hJywgZGF0YSk7XG4gICAgLy8gKiA8L3ByZT5cbiAgICAvLyAqXG4gICAgLy8gKiBUaGUgb3B0aW9uYWwgPGI+Zm9ybWF0RnVuY3Rpb248L2I+IGFsbG93cyB5b3UgdG8gY3VzdG9taXplIHRoZSBjb250ZW50IGJ5IHByb3ZpZGluZ1xuICAgIC8vICogY29udGV4dC1zZW5zaXRpdmUgZm9ybWF0dGluZy4gSWYgcHJvdmlkZWQsIHRoZSBmb3JtYXQgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgZm9yIGVhY2hcbiAgICAvLyAqIGZvcm1hdCBlbGVtZW50IGFuZCBnZXRzIHBhc3NlZCB0aGUgZGF0YSBvYmplY3QsIHRoZSBwYXJhbWV0ZXIgbmFtZSwgdGhlIGZvcm1hdCxcbiAgICAvLyAqIGFuZCB0aGUgdmFsdWU7IGl0IHNob3VsZCByZXR1cm4gYW4gb3V0cHV0IHN0cmluZy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gKlxuICAgIC8vICogPHByZT5cbiAgICAvLyAqIHZhciBkYXRhID0geyBuYW1lOiAnSm9lJywgYW1vdW50OiAxMjM0NTYgfTtcbiAgICAvLyAqIHZhciBtc2cgPSB3aWptby5mb3JtYXQoJ0hlbGxvIHtuYW1lfSwgeW91IHdvbiB7YW1vdW50Om4yfSEnLCBkYXRhLFxuICAgIC8vICogICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEsIG5hbWUsIGZtdCwgdmFsKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgaWYgKHdpam1vLmlzU3RyaW5nKGRhdGFbbmFtZV0pKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgICAgIHZhbCA9IHdpam1vLmVzY2FwZUh0bWwoZGF0YVtuYW1lXSk7XG4gICAgLy8qICAgICAgICAgICAgICAgfVxuICAgIC8vKiAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgLy8qICAgICAgICAgICAgIH0pO1xuICAgIC8vICogPC9wcmU+XG4gICAgLy8gKlxuICAgIC8vICogQHBhcmFtIGZvcm1hdCBBIGNvbXBvc2l0ZSBmb3JtYXQgc3RyaW5nLlxuICAgIC8vICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2JqZWN0IHVzZWQgdG8gYnVpbGQgdGhlIHN0cmluZy5cbiAgICAvLyAqIEBwYXJhbSBmb3JtYXRGdW5jdGlvbiBBbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvIGZvcm1hdCBpdGVtcyBpbiBjb250ZXh0LlxuICAgIC8vICogQHJldHVybiBUaGUgZm9ybWF0dGVkIHN0cmluZy5cbiAgICAvLyAqL1xuICAgIC8vZnVuY3Rpb24gZm9ybWF0KGZvcm1hdCwgZGF0YSwgZm9ybWF0RnVuY3Rpb24pIHtcbiAgICAvLyAgICBmb3JtYXQgPSBhc1N0cmluZyhmb3JtYXQpO1xuICAgIC8vICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgvXFx7KC4qPykoOiguKj8pKT9cXH0vZywgZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCB4LCBmbXQpIHtcbiAgICAvLyAgICAgICAgdmFyIHZhbCA9IG1hdGNoO1xuICAgIC8vICAgICAgICBpZiAobmFtZSAmJiBuYW1lWzBdICE9ICd7JyAmJiBkYXRhKSB7XG4gICAgLy8gICAgICAgICAgICAvLyBnZXQgdGhlIHZhbHVlXG4gICAgLy8gICAgICAgICAgICB2YWwgPSBkYXRhW25hbWVdO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBhcHBseSBzdGF0aWMgZm9ybWF0XG4gICAgLy8gICAgICAgICAgICBpZiAoZm10KSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gd2lqbW8uR2xvYmFsaXplLmZvcm1hdCh2YWwsIGZtdCk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIC8vIGFwcGx5IGZvcm1hdCBmdW5jdGlvblxuICAgIC8vICAgICAgICAgICAgaWYgKGZvcm1hdEZ1bmN0aW9uKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gZm9ybWF0RnVuY3Rpb24oZGF0YSwgbmFtZSwgZm10LCB2YWwpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgICAgIHJldHVybiB2YWwgPT0gbnVsbCA/ICcnIDogdmFsO1xuICAgIC8vICAgIH0pO1xuICAgIC8vfVxuICAgIC8vZ2NVdGlscy5mb3JtYXQgPSBmb3JtYXQ7XG5cbiAgICAvKipcbiAgICAgKiBDbGFtcHMgYSB2YWx1ZSBiZXR3ZWVuIGEgbWluaW11bSBhbmQgYSBtYXhpbXVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIE9yaWdpbmFsIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtaW4gTWluaW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtYXggTWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChtYXgpICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKG1pbikgJiYgdmFsdWUgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1pbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jbGFtcCA9IGNsYW1wO1xuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHRoZSBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0IHRvIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBUaGUgZGVzdGluYXRpb24gb2JqZWN0IG11c3QgZGVmaW5lIGFsbCB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBzb3VyY2UsXG4gICAgICogb3IgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZHN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHNyYyBUaGUgc291cmNlIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3B5KGRzdCwgc3JjKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXkgaW4gZHN0LCAnVW5rbm93biBrZXkgXCInICsga2V5ICsgJ1wiLicpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XG4gICAgICAgICAgICBpZiAoIWRzdC5fY29weSB8fCAhZHN0Ll9jb3B5KGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBkc3Rba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjb3B5KGRzdFtrZXldLCB2YWx1ZSk7IC8vIGNvcHkgc3ViLW9iamVjdHNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHZhbHVlOyAvLyBhc3NpZ24gdmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jb3B5ID0gY29weTtcblxuICAgIC8qKlxuICAgICAqIFRocm93cyBhbiBleGNlcHRpb24gaWYgYSBjb25kaXRpb24gaXMgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29uZGl0aW9uIENvbmRpdGlvbiBleHBlY3RlZCB0byBiZSB0cnVlLlxuICAgICAqIEBwYXJhbSBtc2cgTWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IHRydWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnKSB7XG4gICAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyAnKiogQXNzZXJ0aW9uIGZhaWxlZCBpbiBXaWptbzogJyArIG1zZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdjVXRpbHMuYXNzZXJ0ID0gYXNzZXJ0O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBzdHJpbmcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHN0cmluZyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNTdHJpbmcodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzU3RyaW5nKHZhbHVlKSwgJ1N0cmluZyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNTdHJpbmcgPSBhc1N0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIG51bWVyaWMuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEBwYXJhbSBwb3NpdGl2ZSBXaGV0aGVyIHRvIGFjY2VwdCBvbmx5IHBvc2l0aXZlIG51bWVyaWMgdmFsdWVzLlxuICAgICAqIEByZXR1cm4gVGhlIG51bWJlciBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNOdW1iZXIodmFsdWUsIG51bGxPSywgcG9zaXRpdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja1R5cGUocG9zaXRpdmUsIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc051bWJlcih2YWx1ZSksICdOdW1iZXIgZXhwZWN0ZWQuJyk7XG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiB2YWx1ZSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdQb3NpdGl2ZSBudW1iZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc051bWJlciA9IGFzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhbiBpbnRlZ2VyLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpdmUgV2hldGhlciB0byBhY2NlcHQgb25seSBwb3NpdGl2ZSBpbnRlZ2Vycy5cbiAgICAgKiBAcmV0dXJuIFRoZSBudW1iZXIgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzSW50KHZhbHVlLCBudWxsT0ssIHBvc2l0aXZlKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tUeXBlKHBvc2l0aXZlLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBwb3NpdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNJbnQodmFsdWUpLCAnSW50ZWdlciBleHBlY3RlZC4nKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIHZhbHVlICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Bvc2l0aXZlIGludGVnZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0ludCA9IGFzSW50O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBCb29sZWFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIEJvb2xlYW4uXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEJvb2xlYW4gcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzQm9vbGVhbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzQm9vbGVhbih2YWx1ZSksICdCb29sZWFuIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0Jvb2xlYW4gPSBhc0Jvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIERhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBEYXRlLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBEYXRlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0RhdGUodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0RhdGUodmFsdWUpLCAnRGF0ZSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNEYXRlID0gYXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBmdW5jdGlvbiBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNGdW5jdGlvbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzRnVuY3Rpb24odmFsdWUpLCAnRnVuY3Rpb24gZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRnVuY3Rpb24gPSBhc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYW4gYXJyYXkuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIGFycmF5IHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0FycmF5KHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNBcnJheSh2YWx1ZSksICdBcnJheSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNBcnJheSA9IGFzQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIGdpdmVuIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgY2hlY2tlZC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIHZhbHVlIGV4cGVjdGVkLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNUeXBlKHZhbHVlLCB0eXBlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgdmFsdWUgaW5zdGFuY2VvZiB0eXBlLCB0eXBlICsgJyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNUeXBlID0gYXNUeXBlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSB2YWxpZCBzZXR0aW5nIGZvciBhbiBlbnVtZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIG1lbWJlciBvZiB0aGUgZW51bWVyYXRpb24uXG4gICAgICogQHBhcmFtIGVudW1UeXBlIEVudW1lcmF0aW9uIHRvIHRlc3QgZm9yLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNFbnVtKHZhbHVlLCBlbnVtVHlwZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNVbmRlZmluZWRPck51bGwodmFsdWUpICYmIG51bGxPSykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSBlbnVtVHlwZVt2YWx1ZV07XG4gICAgICAgIGFzc2VydCghaXNVbmRlZmluZWRPck51bGwoZSksICdJbnZhbGlkIGVudW0gdmFsdWUuJyk7XG4gICAgICAgIHJldHVybiBpc051bWJlcihlKSA/IGUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRW51bSA9IGFzRW51bTtcblxuICAgIC8qKlxuICAgICAqIEVudW1lcmF0aW9uIHdpdGgga2V5IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgZW51bWVyYXRpb24gaXMgdXNlZnVsIHdoZW4gaGFuZGxpbmcgPGI+a2V5RG93bjwvYj4gZXZlbnRzLlxuICAgICAqL1xuICAgIHZhciBLZXkgPSB7XG4gICAgICAgIC8qKiBUaGUgYmFja3NwYWNlIGtleS4gKi9cbiAgICAgICAgQmFjazogOCxcbiAgICAgICAgLyoqIFRoZSB0YWIga2V5LiAqL1xuICAgICAgICBUYWI6IDksXG4gICAgICAgIC8qKiBUaGUgZW50ZXIga2V5LiAqL1xuICAgICAgICBFbnRlcjogMTMsXG4gICAgICAgIC8qKiBUaGUgZXNjYXBlIGtleS4gKi9cbiAgICAgICAgRXNjYXBlOiAyNyxcbiAgICAgICAgLyoqIFRoZSBzcGFjZSBrZXkuICovXG4gICAgICAgIFNwYWNlOiAzMixcbiAgICAgICAgLyoqIFRoZSBwYWdlIHVwIGtleS4gKi9cbiAgICAgICAgUGFnZVVwOiAzMyxcbiAgICAgICAgLyoqIFRoZSBwYWdlIGRvd24ga2V5LiAqL1xuICAgICAgICBQYWdlRG93bjogMzQsXG4gICAgICAgIC8qKiBUaGUgZW5kIGtleS4gKi9cbiAgICAgICAgRW5kOiAzNSxcbiAgICAgICAgLyoqIFRoZSBob21lIGtleS4gKi9cbiAgICAgICAgSG9tZTogMzYsXG4gICAgICAgIC8qKiBUaGUgbGVmdCBhcnJvdyBrZXkuICovXG4gICAgICAgIExlZnQ6IDM3LFxuICAgICAgICAvKiogVGhlIHVwIGFycm93IGtleS4gKi9cbiAgICAgICAgVXA6IDM4LFxuICAgICAgICAvKiogVGhlIHJpZ2h0IGFycm93IGtleS4gKi9cbiAgICAgICAgUmlnaHQ6IDM5LFxuICAgICAgICAvKiogVGhlIGRvd24gYXJyb3cga2V5LiAqL1xuICAgICAgICBEb3duOiA0MCxcbiAgICAgICAgLyoqIFRoZSBkZWxldGUga2V5LiAqL1xuICAgICAgICBEZWxldGU6IDQ2LFxuICAgICAgICAvKiogVGhlIEYxIGtleS4gKi9cbiAgICAgICAgRjE6IDExMixcbiAgICAgICAgLyoqIFRoZSBGMiBrZXkuICovXG4gICAgICAgIEYyOiAxMTMsXG4gICAgICAgIC8qKiBUaGUgRjMga2V5LiAqL1xuICAgICAgICBGMzogMTE0LFxuICAgICAgICAvKiogVGhlIEY0IGtleS4gKi9cbiAgICAgICAgRjQ6IDExNSxcbiAgICAgICAgLyoqIFRoZSBGNSBrZXkuICovXG4gICAgICAgIEY1OiAxMTYsXG4gICAgICAgIC8qKiBUaGUgRjYga2V5LiAqL1xuICAgICAgICBGNjogMTE3LFxuICAgICAgICAvKiogVGhlIEY3IGtleS4gKi9cbiAgICAgICAgRjc6IDExOCxcbiAgICAgICAgLyoqIFRoZSBGOCBrZXkuICovXG4gICAgICAgIEY4OiAxMTksXG4gICAgICAgIC8qKiBUaGUgRjkga2V5LiAqL1xuICAgICAgICBGOTogMTIwLFxuICAgICAgICAvKiogVGhlIEYxMCBrZXkuICovXG4gICAgICAgIEYxMDogMTIxLFxuICAgICAgICAvKiogVGhlIEYxMSBrZXkuICovXG4gICAgICAgIEYxMTogMTIyLFxuICAgICAgICAvKiogVGhlIEYxMiBrZXkuICovXG4gICAgICAgIEYxMjogMTIzXG4gICAgfTtcbiAgICBnY1V0aWxzLktleSA9IEtleTtcblxuICAgIHZhciBFZGl0b3JUeXBlID0ge1xuICAgICAgICAnVGV4dCc6ICd0ZXh0JyxcbiAgICAgICAgJ0NoZWNrQm94JzogJ2NoZWNrYm94JyxcbiAgICAgICAgJ0RhdGUnOiAnZGF0ZScsXG4gICAgICAgICdDb2xvcic6ICdjb2xvcicsXG4gICAgICAgICdOdW1iZXInOiAnbnVtYmVyJ1xuICAgIH07XG4gICAgZ2NVdGlscy5FZGl0b3JUeXBlID0gRWRpdG9yVHlwZTtcblxuICAgIHZhciBEYXRhVHlwZSA9IHtcbiAgICAgICAgJ09iamVjdCc6ICdPYmplY3QnLFxuICAgICAgICAnU3RyaW5nJzogJ1N0cmluZycsXG4gICAgICAgICdOdW1iZXInOiAnTnVtYmVyJyxcbiAgICAgICAgJ0Jvb2xlYW4nOiAnQm9vbGVhbicsXG4gICAgICAgICdEYXRlJzogJ0RhdGUnLFxuICAgICAgICAnQXJyYXknOiAnQXJyYXknXG4gICAgfTtcbiAgICBnY1V0aWxzLkRhdGFUeXBlID0gRGF0YVR5cGU7XG5cbiAgICB2YXIgaXNVbml0bGVzc051bWJlciA9IHtcbiAgICAgICAgY29sdW1uQ291bnQ6IHRydWUsXG4gICAgICAgIGZsZXg6IHRydWUsXG4gICAgICAgIGZsZXhHcm93OiB0cnVlLFxuICAgICAgICBmbGV4U2hyaW5rOiB0cnVlLFxuICAgICAgICBmb250V2VpZ2h0OiB0cnVlLFxuICAgICAgICBsaW5lQ2xhbXA6IHRydWUsXG4gICAgICAgIGxpbmVIZWlnaHQ6IHRydWUsXG4gICAgICAgIG9wYWNpdHk6IHRydWUsXG4gICAgICAgIG9yZGVyOiB0cnVlLFxuICAgICAgICBvcnBoYW5zOiB0cnVlLFxuICAgICAgICB3aWRvd3M6IHRydWUsXG4gICAgICAgIHpJbmRleDogdHJ1ZSxcbiAgICAgICAgem9vbTogdHJ1ZSxcblxuICAgICAgICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gICAgICAgIGZpbGxPcGFjaXR5OiB0cnVlLFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB0cnVlXG4gICAgfTtcbiAgICB2YXIgX3VwcGVyY2FzZVBhdHRlcm4gPSAvKFtBLVpdKS9nO1xuICAgIHZhciBtc1BhdHRlcm4gPSAvXi1tcy0vO1xuXG4gICAgZnVuY3Rpb24gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaXNFbXB0eSA9IGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB2YWx1ZSA9PT0gJyc7XG4gICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNOb25OdW1lcmljID0gaXNOYU4odmFsdWUpO1xuICAgICAgICBpZiAoaXNOb25OdW1lcmljIHx8IHZhbHVlID09PSAwIHx8XG4gICAgICAgICAgICBpc1VuaXRsZXNzTnVtYmVyLmhhc093blByb3BlcnR5KG5hbWUpICYmIGlzVW5pdGxlc3NOdW1iZXJbbmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiAnJyArIHZhbHVlOyAvLyBjYXN0IHRvIHN0cmluZ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSArICdweCc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVtb2l6ZVN0cmluZ09ubHkoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhY2hlID0ge307XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhY2hlW3N0cmluZ10gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHByb2Nlc3NTdHlsZU5hbWUgPSBtZW1vaXplU3RyaW5nT25seShmdW5jdGlvbihzdHlsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHlsZU5hbWUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX3VwcGVyY2FzZVBhdHRlcm4sICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCAnLW1zLScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hcmt1cEZvclN0eWxlcyhzdHlsZXMpIHtcbiAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHN0eWxlcykge1xuICAgICAgICAgICAgaWYgKCFzdHlsZXMuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBzdHlsZXNbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwoc3R5bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IHByb2Nlc3NTdHlsZU5hbWUoc3R5bGVOYW1lKSArICc6JztcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IGRhbmdlcm91c1N0eWxlVmFsdWUoc3R5bGVOYW1lLCBzdHlsZVZhbHVlKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VyaWFsaXplZCB8fCBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzID0gY3JlYXRlTWFya3VwRm9yU3R5bGVzO1xuXG4gICAgLyoqXG4gICAgICogQ2FuY2VscyB0aGUgcm91dGUgZm9yIERPTSBldmVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZWxEZWZhdWx0KGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL0lFIDhcbiAgICAgICAgICAgIGUuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2FuY2VsRGVmYXVsdCA9IGNhbmNlbERlZmF1bHQ7XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVPYmplY3Qob2JqKSB7XG4gICAgICAgIHZhciBjbG9uZU9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICAgICAgdmFyIGNhY2hlXyA9IFtdO1xuICAgICAgICBpZiAoY2xvbmVPYmopIHtcbiAgICAgICAgICAgIGNhY2hlXy5wdXNoKGNsb25lT2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdDtcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oZGVzdFtpdGVtXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IHNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmVPYmo7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemVPYmplY3Q7XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZU9iamVjdChvYmopIHtcbiAgICAgICAgdmFyIGNsb25lT2JqID0gXy5jbG9uZShvYmopO1xuICAgICAgICB2YXIgY2FjaGVfID0gW107XG4gICAgICAgIGlmIChjbG9uZU9iaikge1xuICAgICAgICAgICAgY2FjaGVfLnB1c2goY2xvbmVPYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0O1xuICAgICAgICB2YXIgZnVuYztcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGRlc3RbaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IGZ1bmM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lT2JqO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVPYmplY3QgPSBkZXNlcmlhbGl6ZU9iamVjdDtcblxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuc2VyaWFsaXplRnVuY3Rpb24gPSBzZXJpYWxpemVGdW5jdGlvbjtcblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHRlbXBTdHIgPSB2YWx1ZS5zdWJzdHIoOCwgdmFsdWUuaW5kZXhPZignKCcpIC0gOCk7IC8vOCBpcyAnZnVuY3Rpb24nIGxlbmd0aFxuICAgICAgICAgICAgaWYgKHZhbHVlLnN1YnN0cigwLCA4KSA9PT0gJ2Z1bmN0aW9uJyAmJiB0ZW1wU3RyLnJlcGxhY2UoL1xccysvLCAnJykgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ1N0YXJ0ID0gdmFsdWUuaW5kZXhPZignKCcpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYXJnRW5kID0gdmFsdWUuaW5kZXhPZignKScpO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gdmFsdWUuc3Vic3RyKGFyZ1N0YXJ0LCBhcmdFbmQgLSBhcmdTdGFydCkuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcucmVwbGFjZSgvXFxzKy8sICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keVN0YXJ0ID0gdmFsdWUuaW5kZXhPZigneycpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keUVuZCA9IHZhbHVlLmxhc3RJbmRleE9mKCd9Jyk7XG4gICAgICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYXJncywgdmFsdWUuc3Vic3RyKGJvZHlTdGFydCwgYm9keUVuZCAtIGJvZHlTdGFydCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVGdW5jdGlvbiA9IGRlc2VyaWFsaXplRnVuY3Rpb247XG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gQHNlZTpJQ29sbGVjdGlvblZpZXcgb3IgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb3IgQHNlZTpJQ29sbGVjdGlvblZpZXcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEBzZWU6SUNvbGxlY3Rpb25WaWV3IHRoYXQgd2FzIHBhc3NlZCBpbiBvciBhIEBzZWU6Q29sbGVjdGlvblZpZXdcbiAgICAgKiBjcmVhdGVkIGZyb20gdGhlIGFycmF5IHRoYXQgd2FzIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICAvKlxuICAgICBmdW5jdGlvbiBhc0NvbGxlY3Rpb25WaWV3KHZhbHVlLCBudWxsT0spIHtcbiAgICAgaWYgKHR5cGVvZiBudWxsT0sgPT09IFwidW5kZWZpbmVkXCIpIHsgbnVsbE9LID0gdHJ1ZTsgfVxuICAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBudWxsT0spIHtcbiAgICAgcmV0dXJuIG51bGw7XG4gICAgIH1cbiAgICAgdmFyIGN2ID0gdHJ5Q2FzdCh2YWx1ZSwgJ0lDb2xsZWN0aW9uVmlldycpO1xuICAgICBpZiAoY3YgIT0gbnVsbCkge1xuICAgICByZXR1cm4gY3Y7XG4gICAgIH1cbiAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xuICAgICBhc3NlcnQoZmFsc2UsICdBcnJheSBvciBJQ29sbGVjdGlvblZpZXcgZXhwZWN0ZWQuJyk7XG4gICAgIH1cbiAgICAgcmV0dXJuIG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyh2YWx1ZSk7XG4gICAgIH1cbiAgICAgZ2NVdGlscy5hc0NvbGxlY3Rpb25WaWV3ID0gYXNDb2xsZWN0aW9uVmlldzsqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcGx1Z2luIG1vZHVsZS5cbiAgICAgKiBAcGFyYW0gbmFtZSBvZiBtb2R1bGVcbiAgICAgKiBAcmV0dXJucyBwbHVnaW4gbW9kdWxlIG9iamVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRQbHVnaW4obmFtZSkge1xuICAgICAgICB2YXIgcGx1Z2luO1xuICAgICAgICAvLyBmaW5kIGZyb20gZ2xvYmFsXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBHY1NwcmVhZC5WaWV3cy5HY0dyaWQuUGx1Z2luc1tuYW1lXTsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy8gICAgcGx1Z2luID0gcmVxdWlyZWpzICYmIHJlcXVpcmVqcyhuYW1lKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIC8vLy8gY29tbW9uanMgbm90IHN1cHBvcnRlZCBub3dcbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIHJldHVybiBwbHVnaW47XG4gICAgfVxuXG4gICAgZ2NVdGlscy5maW5kUGx1Z2luID0gZmluZFBsdWdpbjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZ2NVdGlscztcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9nY1V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIi8vIGRvVC5qc1xuLy8gMjAxMS0yMDE0LCBMYXVyYSBEb2t0b3JvdmEsIGh0dHBzOi8vZ2l0aHViLmNvbS9vbGFkby9kb1Rcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZG9UID0ge1xuICAgICAgICB2ZXJzaW9uOiBcIjEuMC4zXCIsXG4gICAgICAgIHRlbXBsYXRlU2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGV2YWx1YXRlOiAvXFx7XFx7KFtcXHNcXFNdKz8oXFx9PykrKVxcfVxcfS9nLFxuICAgICAgICAgICAgaW50ZXJwb2xhdGU6IC9cXHtcXHs9KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICBlbmNvZGU6IC9cXHtcXHshKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2U6IC9cXHtcXHsjKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2VQYXJhbXM6IC8oXnxbXlxcdyRdKWRlZig/OlxcLnxcXFtbXFwnXFxcIl0pKFtcXHckXFwuXSspKD86W1xcJ1xcXCJdXFxdKT9cXHMqXFw6XFxzKihbXFx3JFxcLl0rfFxcXCJbXlxcXCJdK1xcXCJ8XFwnW15cXCddK1xcJ3xcXHtbXlxcfV0rXFx9KS9nLFxuICAgICAgICAgICAgZGVmaW5lOiAvXFx7XFx7IyNcXHMqKFtcXHdcXC4kXSspXFxzKihcXDp8PSkoW1xcc1xcU10rPykjXFx9XFx9L2csXG4gICAgICAgICAgICBkZWZpbmVQYXJhbXM6IC9eXFxzKihbXFx3JF0rKTooW1xcc1xcU10rKS8sXG4gICAgICAgICAgICBjb25kaXRpb25hbDogL1xce1xce1xcPyhcXD8pP1xccyooW1xcc1xcU10qPylcXHMqXFx9XFx9L2csXG4gICAgICAgICAgICBpdGVyYXRlOiAvXFx7XFx7flxccyooPzpcXH1cXH18KFtcXHNcXFNdKz8pXFxzKlxcOlxccyooW1xcdyRdKylcXHMqKD86XFw6XFxzKihbXFx3JF0rKSk/XFxzKlxcfVxcfSkvZyxcbiAgICAgICAgICAgIHZhcm5hbWU6IFwiaXRcIixcbiAgICAgICAgICAgIHN0cmlwOiB0cnVlLFxuICAgICAgICAgICAgYXBwZW5kOiB0cnVlLFxuICAgICAgICAgICAgc2VsZmNvbnRhaW5lZDogZmFsc2UsXG4gICAgICAgICAgICBkb05vdFNraXBFbmNvZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLCAvL2ZuLCBjb21waWxlIHRlbXBsYXRlXG4gICAgICAgIGNvbXBpbGU6IHVuZGVmaW5lZCAgLy9mbiwgZm9yIGV4cHJlc3NcbiAgICB9LCBfZ2xvYmFscztcblxuICAgIGRvVC5lbmNvZGVIVE1MU291cmNlID0gZnVuY3Rpb24oZG9Ob3RTa2lwRW5jb2RlZCkge1xuICAgICAgICB2YXIgZW5jb2RlSFRNTFJ1bGVzID0ge1wiJlwiOiBcIiYjMzg7XCIsIFwiPFwiOiBcIiYjNjA7XCIsIFwiPlwiOiBcIiYjNjI7XCIsICdcIic6IFwiJiMzNDtcIiwgXCInXCI6IFwiJiMzOTtcIiwgXCIvXCI6IFwiJiM0NztcIn0sXG4gICAgICAgICAgICBtYXRjaEhUTUwgPSBkb05vdFNraXBFbmNvZGVkID8gL1smPD5cIidcXC9dL2cgOiAvJig/ISM/XFx3KzspfDx8PnxcInwnfFxcLy9nO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGUgPyBjb2RlLnRvU3RyaW5nKCkucmVwbGFjZShtYXRjaEhUTUwsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTFJ1bGVzW21dIHx8IG07XG4gICAgICAgICAgICB9KSA6IFwiXCI7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgX2dsb2JhbHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzIHx8ICgwLCBldmFsKShcInRoaXNcIik7XG4gICAgfSgpKTtcblxuICAgIC8vSGliZXJcbiAgICAvL3JlcGxhdGUgdGhlIG1vZHVsZSBkZWZpbml0aW9uIHdpdGggc2ltcGxlIG1vZHVsZS5leHBvcnRzIHNpbmNlIHdlIG9ubHkgcnVuXG4gICAgLy9pdCBpbiBub2RlIGxpa2UgZW52aXJvbm1lbnRcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9UO1xuICAgIC8vaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvL1xuICAgIC8vfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vXHRkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZG9UO30pO1xuICAgIC8vfSBlbHNlIHtcbiAgICAvL1x0X2dsb2JhbHMuZG9UID0gZG9UO1xuICAgIC8vfVxuXG4gICAgdmFyIHN0YXJ0ZW5kID0ge1xuICAgICAgICBhcHBlbmQ6IHtzdGFydDogXCInKyhcIiwgZW5kOiBcIikrJ1wiLCBzdGFydGVuY29kZTogXCInK2VuY29kZUhUTUwoXCJ9LFxuICAgICAgICBzcGxpdDoge3N0YXJ0OiBcIic7b3V0Kz0oXCIsIGVuZDogXCIpO291dCs9J1wiLCBzdGFydGVuY29kZTogXCInO291dCs9ZW5jb2RlSFRNTChcIn1cbiAgICB9LCBza2lwID0gLyReLztcblxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZWZzKGMsIGJsb2NrLCBkZWYpIHtcbiAgICAgICAgcmV0dXJuICgodHlwZW9mIGJsb2NrID09PSBcInN0cmluZ1wiKSA/IGJsb2NrIDogYmxvY2sudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZGVmaW5lIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUsIGFzc2lnbiwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiZGVmLlwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZS5zdWJzdHJpbmcoNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghKGNvZGUgaW4gZGVmKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXNzaWduID09PSBcIjpcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuZGVmaW5lUGFyYW1zKSB2YWx1ZS5yZXBsYWNlKGMuZGVmaW5lUGFyYW1zLCBmdW5jdGlvbihtLCBwYXJhbSwgdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltjb2RlXSA9IHthcmc6IHBhcmFtLCB0ZXh0OiB2fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoY29kZSBpbiBkZWYpKSBkZWZbY29kZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGdW5jdGlvbihcImRlZlwiLCBcImRlZlsnXCIgKyBjb2RlICsgXCInXT1cIiArIHZhbHVlKShkZWYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMudXNlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy51c2VQYXJhbXMpIGNvZGUgPSBjb2RlLnJlcGxhY2UoYy51c2VQYXJhbXMsIGZ1bmN0aW9uKG0sIHMsIGQsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZbZF0gJiYgZGVmW2RdLmFyZyAmJiBwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ3ID0gKGQgKyBcIjpcIiArIHBhcmFtKS5yZXBsYWNlKC8nfFxcXFwvZywgXCJfXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwID0gZGVmLl9fZXhwIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwW3J3XSA9IGRlZltkXS50ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChcIihefFteXFxcXHckXSlcIiArIGRlZltkXS5hcmcgKyBcIihbXlxcXFx3JF0pXCIsIFwiZ1wiKSwgXCIkMVwiICsgcGFyYW0gKyBcIiQyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMgKyBcImRlZi5fX2V4cFsnXCIgKyBydyArIFwiJ11cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB2ID0gbmV3IEZ1bmN0aW9uKFwiZGVmXCIsIFwicmV0dXJuIFwiICsgY29kZSkoZGVmKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA/IHJlc29sdmVEZWZzKGMsIHYsIGRlZikgOiB2O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGUoY29kZSkge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlKC9cXFxcKCd8XFxcXCkvZywgXCIkMVwiKS5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIik7XG4gICAgfVxuXG4gICAgZG9ULnRlbXBsYXRlID0gZnVuY3Rpb24odG1wbCwgYywgZGVmLCBkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgIGMgPSBjIHx8IGRvVC50ZW1wbGF0ZVNldHRpbmdzO1xuICAgICAgICB2YXIgY3NlID0gYy5hcHBlbmQgPyBzdGFydGVuZC5hcHBlbmQgOiBzdGFydGVuZC5zcGxpdCwgbmVlZGh0bWxlbmNvZGUsIHNpZCA9IDAsIGluZHYsXG4gICAgICAgICAgICBzdHIgPSAoYy51c2UgfHwgYy5kZWZpbmUpID8gcmVzb2x2ZURlZnMoYywgdG1wbCwgZGVmIHx8IHt9KSA6IHRtcGw7XG5cbiAgICAgICAgdmFyIHVuZXNjYXBlQ29kZTtcblxuICAgICAgICBzdHIgPSAoXCJ2YXIgb3V0PSdcIiArIChjLnN0cmlwID8gc3RyLnJlcGxhY2UoLyhefFxccnxcXG4pXFx0KiArfCArXFx0KihcXHJ8XFxufCQpL2csIFwiIFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccnxcXG58XFx0fFxcL1xcKltcXHNcXFNdKj9cXCpcXC8vZywgXCJcIikgOiBzdHIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJ3xcXFxcL2csIFwiXFxcXCQmXCIpXG4gICAgICAgICAgICAucmVwbGFjZShjLmludGVycG9sYXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoISFkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuZXNjYXBlQ29kZSA9IHVuZXNjYXBlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKCd8fCcpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZUNvZGUgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArICcodHlwZW9mICcgKyBjb2RlICsgJyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAnICsgY29kZSArICchPT0gbnVsbCk/JyArIHVuZXNjYXBlQ29kZSArICc6IFwiXCInICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmVuY29kZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgbmVlZGh0bWxlbmNvZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnRlbmNvZGUgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5jb25kaXRpb25hbCB8fCBza2lwLCBmdW5jdGlvbihtLCBlbHNlY2FzZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbHNlY2FzZSA/XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID8gXCInO31lbHNlIGlmKFwiICsgdW5lc2NhcGUoY29kZSkgKyBcIil7b3V0Kz0nXCIgOiBcIic7fWVsc2V7b3V0Kz0nXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPyBcIic7aWYoXCIgKyB1bmVzY2FwZShjb2RlKSArIFwiKXtvdXQrPSdcIiA6IFwiJzt9b3V0Kz0nXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuaXRlcmF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBpdGVyYXRlLCB2bmFtZSwgaW5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZXJhdGUpIHJldHVybiBcIic7fSB9IG91dCs9J1wiO1xuICAgICAgICAgICAgICAgIHNpZCArPSAxO1xuICAgICAgICAgICAgICAgIGluZHYgPSBpbmFtZSB8fCBcImlcIiArIHNpZDtcbiAgICAgICAgICAgICAgICBpdGVyYXRlID0gdW5lc2NhcGUoaXRlcmF0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXCc7dmFyIGFycicgKyBzaWQgKyAnPScgKyBpdGVyYXRlICsgXCI7aWYoYXJyXCIgKyBzaWQgKyBcIil7dmFyIFwiICsgdm5hbWUgKyBcIixcIiArIGluZHYgKyBcIj0tMSxsXCIgKyBzaWQgKyBcIj1hcnJcIiArIHNpZCArIFwiLmxlbmd0aC0xO3doaWxlKFwiICsgaW5kdiArIFwiPGxcIiArIHNpZCArIFwiKXtcIlxuICAgICAgICAgICAgICAgICAgICArIHZuYW1lICsgXCI9YXJyXCIgKyBzaWQgKyBcIltcIiArIGluZHYgKyBcIis9MV07b3V0Kz0nXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5ldmFsdWF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiJztcIiArIHVuZXNjYXBlKGNvZGUpICsgXCJvdXQrPSdcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICsgXCInO3JldHVybiBvdXQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIikucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpLnJlcGxhY2UoL1xcci9nLCBcIlxcXFxyXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcc3w7fFxcfXxefFxceylvdXRcXCs9Jyc7L2csICckMScpLnJlcGxhY2UoL1xcKycnL2csIFwiXCIpO1xuICAgICAgICAvLy5yZXBsYWNlKC8oXFxzfDt8XFx9fF58XFx7KW91dFxcKz0nJ1xcKy9nLCckMW91dCs9Jyk7XG5cbiAgICAgICAgaWYgKG5lZWRodG1sZW5jb2RlKSB7XG4gICAgICAgICAgICBpZiAoIWMuc2VsZmNvbnRhaW5lZCAmJiBfZ2xvYmFscyAmJiAhX2dsb2JhbHMuX2VuY29kZUhUTUwpIF9nbG9iYWxzLl9lbmNvZGVIVE1MID0gZG9ULmVuY29kZUhUTUxTb3VyY2UoYy5kb05vdFNraXBFbmNvZGVkKTtcbiAgICAgICAgICAgIHN0ciA9IFwidmFyIGVuY29kZUhUTUwgPSB0eXBlb2YgX2VuY29kZUhUTUwgIT09ICd1bmRlZmluZWQnID8gX2VuY29kZUhUTUwgOiAoXCJcbiAgICAgICAgICAgICAgICArIGRvVC5lbmNvZGVIVE1MU291cmNlLnRvU3RyaW5nKCkgKyBcIihcIiArIChjLmRvTm90U2tpcEVuY29kZWQgfHwgJycpICsgXCIpKTtcIlxuICAgICAgICAgICAgICAgICsgc3RyO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGMudmFybmFtZSwgc3RyKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBjcmVhdGUgYSB0ZW1wbGF0ZSBmdW5jdGlvbjogXCIgKyBzdHIpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb1QuY29tcGlsZSA9IGZ1bmN0aW9uKHRtcGwsIGRlZikge1xuICAgICAgICByZXR1cm4gZG9ULnRlbXBsYXRlKHRtcGwsIG51bGwsIGRlZik7XG4gICAgfTtcblxufSgpKTtcblxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2RvVC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGdjVXRpbHMgPSByZXF1aXJlKCcuL2djVXRpbHMnKTtcblxuICAgIHZhciBkb21VdGlsID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVsZW1lbnQgZnJvbSBhbiBIVE1MIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBodG1sIEhUTUwgZnJhZ21lbnQgdG8gY29udmVydCBpbnRvIGFuIEhUTUxFbGVtZW50LlxuICAgICAqIEByZXR1cm4gVGhlIG5ldyBlbGVtZW50LlxuICAgICAqL1xuXG4gICAgLy9yZW1vdmUgYWxsIGNvbW1lbnRzIGFuZCB3aGl0ZXNwYWNlIG9ubHkgdGV4dCBub2Rlc1xuICAgIGZ1bmN0aW9uIGNsZWFuKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IG4rKykgeyAvL2RvIHJld3JpdGUgaXQgdG8gZm9yKHZhciBuPTAsbGVuPVhYWDtpPGxlbjspXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW25dO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gOCB8fCAoY2hpbGQubm9kZVR5cGUgPT09IDMgJiYgIS9cXFMvLnRlc3QoY2hpbGQubm9kZVZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIG4tLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb21VdGlsLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBkaXYgPSBudWxsO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5jcmVhdGVUZW1wbGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBjbGVhbihyKTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5pbm5lckhUTUwucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldEVsZW1lbnRPdXRlclRleHQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm91dGVySFRNTC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKS5yZXBsYWNlKC8mZ3Q7L2csICc+Jyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIGVsZW1lbnQgaGFzIGEgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGNoZWNrIGZvci5cbiAgICAgKi9cbiAgICBkb21VdGlsLmhhc0NsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInKTtcbiAgICAgICAgICAgIHJldHVybiBlICYmIHJ4LnRlc3QoZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyByZW1vdmVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gcmVtb3ZlIGZvcm0gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiBkb21VdGlsLmhhc0NsYXNzKGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoJ1xcXFxzP1xcXFxiJyArIGNsYXNzTmFtZSArICdcXFxcYicsICdnJyk7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuLnJlcGxhY2UocngsICcnKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNsYXNzIHRvIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgYWRkZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBhZGQgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5hZGRDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiAhZG9tVXRpbC5oYXNDbGFzcyhlLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuID8gY24gKyAnICcgKyBjbGFzc05hbWUgOiBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgb3IgcmVtb3ZlcyBhIGNsYXNzIHRvIG9yIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGFkZCBvciByZW1vdmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhZGRPclJlbW92ZSBXaGV0aGVyIHRvIGFkZCBvciByZW1vdmUgdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGRvbVV0aWwudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUsIGFkZE9yUmVtb3ZlKSB7XG4gICAgICAgIGlmIChhZGRPclJlbW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZG9tVXRpbC5hZGRDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVXRpbC5yZW1vdmVDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vICoqIGpRdWVyeSByZXBsYWNlbWVudCBtZXRob2RzXG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBlbGVtZW50IGZyb20gYSBqUXVlcnktc3R5bGUgc2VsZWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8c3RyaW5nfSBzZWxlY3RvciBBbiBlbGVtZW50LCBhIHNlbGVjdG9yIHN0cmluZywgb3IgYSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIEhUTUwgZWxlbWVudCBjb250YWlucyBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBwYXJlbnQgUGFyZW50IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBjaGlsZCBDaGlsZCBlbGVtZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBhcmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBjaGlsZCBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuY29udGFpbnMgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGZvciAodmFyIGUgPSBjaGlsZDsgZTsgZSA9IGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKGUgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBjb29yZGluYXRlcyBvZiBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIGRvbVV0aWwub2Zmc2V0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgZWxlbWVudC5zY3JvbGxUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyBlbGVtZW50LnNjcm9sbExlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIGFuIGVsZW1lbnQgaW4gcGFnZSBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgc2ltaWxhciB0byB0aGUgPGI+Z2V0Qm91bmRpbmdDbGllbnRSZWN0PC9iPiBmdW5jdGlvbixcbiAgICAgKiBleGNlcHQgdGhhdCB1c2VzIHdpbmRvdyBjb29yZGluYXRlcywgd2hpY2ggY2hhbmdlIHdoZW4gdGhlXG4gICAgICogZG9jdW1lbnQgc2Nyb2xscy5cbiAgICAgKi9cbiAgICBkb21VdGlsLmdldEVsZW1lbnRSZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmMgPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgd2lkdGg6IHJjLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbm5lciBjb250ZW50IHJlY3RhbmdsZSBvZiBpbnB1dCBlbGVtZW50LlxuICAgICAqIFBhZGRpbmcgYW5kIGJveC1zaXppbmcgaXMgY29uc2lkZXJlZC5cbiAgICAgKiBUaGUgcmVzdWx0IGlzIHRoZSBhY3R1YWwgcmVjdGFuZ2xlIHRvIHBsYWNlIGNoaWxkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGUgcmVwcmVzZW50IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRDb250ZW50UmVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHJjID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5nZXRTdHlsZShlKTtcbiAgICAgICAgdmFyIG1lYXN1cmVtZW50cyA9IFtcbiAgICAgICAgICAgICdwYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAncGFkZGluZ1JpZ2h0JyxcbiAgICAgICAgICAgICdwYWRkaW5nVG9wJyxcbiAgICAgICAgICAgICdwYWRkaW5nQm90dG9tJyxcbiAgICAgICAgICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJCb3R0b21XaWR0aCdcbiAgICAgICAgXTtcbiAgICAgICAgdmFyIHNpemUgPSB7fTtcbiAgICAgICAgbWVhc3VyZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgc2l6ZVtwcm9wXSA9ICFpc05hTihudW0pID8gbnVtIDogMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwYWRkaW5nV2lkdGggPSBzaXplLnBhZGRpbmdMZWZ0ICsgc2l6ZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgICAgICAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHNpemUuYm9yZGVyTGVmdFdpZHRoICsgc2l6ZS5wYWRkaW5nTGVmdCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0ICsgc2l6ZS5ib3JkZXJUb3BXaWR0aCArIHNpemUucGFkZGluZ1RvcCxcbiAgICAgICAgICAgIHdpZHRoOiByYy53aWR0aCAtIHBhZGRpbmdXaWR0aCAtIGJvcmRlcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHQgLSBwYWRkaW5nSGVpZ2h0IC0gYm9yZGVySGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVzIHRoZSBzdHlsZSBvZiBhbiBlbGVtZW50IGJ5IGFwcGx5aW5nIHRoZSBwcm9wZXJ0aWVzIHNwZWNpZmllZCBpbiBhbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB3aG9zZSBzdHlsZSB3aWxsIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjc3MgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0eWxlIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5zZXRDc3MgPSBmdW5jdGlvbihlLCBjc3MpIHtcbiAgICAgICAgdmFyIHMgPSBlLnN0eWxlO1xuICAgICAgICBmb3IgKHZhciBwIGluIGNzcykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNzc1twXTtcbiAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzTnVtYmVyKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocC5tYXRjaCgvd2lkdGh8aGVpZ2h0fGxlZnR8dG9wfHJpZ2h0fGJvdHRvbXxzaXplfHBhZGRpbmd8bWFyZ2luJy9pKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJ3B4JzsgLy8gZGVmYXVsdCB1bml0IGZvciBnZW9tZXRyeSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc1twXSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9tVXRpbC5zY3JvbGxiYXJTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tVXRpbC5zY3JvbGxiYXJTaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6LTEwMDAwcHg7IGxlZnQ6LTEwMDAwcHg7IHdpZHRoOjEwMHB4OyBoZWlnaHQ6MTAwcHg7IG92ZXJmbG93OnNjcm9sbDtcIj48L2Rpdj4nKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBkb21VdGlsLnNjcm9sbGJhclNpemUgPSB7XG4gICAgICAgICAgICB3aWR0aDogZGl2Lm9mZnNldFdpZHRoIC0gZGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBkaXYub2Zmc2V0SGVpZ2h0IC0gZGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gICAgICAgIHJldHVybiBkb21VdGlsLnNjcm9sbGJhclNpemU7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBmbiA9IGdldENvbXB1dGVkU3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGU7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oZWxlbWVudCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGVWYWx1ZSA9IGZ1bmN0aW9uKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZG9tVXRpbC5nZXRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHN0eWxlID8gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KSA6IG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuR2V0TWF4U3VwcG9ydGVkQ1NTSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGggPSAxMDAwMDAwO1xuICAgICAgICB2YXIgdGVzdFVwVG8gPSA2MDAwMDAwICogMTAwMDtcbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiLz4nKTtcbiAgICAgICAgdmFyIHRlc3Q7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHRlc3QgPSBoICsgNTAwMDAwOyAvLyogMjtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSB0ZXN0ICsgJ3B4JztcbiAgICAgICAgICAgIGlmICh0ZXN0ID4gdGVzdFVwVG8gfHwgZGl2Lm9mZnNldEhlaWdodCAhPT0gdGVzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaCA9IHRlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICAgICAgZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQgPSBoO1xuICAgICAgICByZXR1cm4gZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQ7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9tVXRpbDtcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6IlRpbWVsaW5lU3RyYXRlZ3kuanMifQ==