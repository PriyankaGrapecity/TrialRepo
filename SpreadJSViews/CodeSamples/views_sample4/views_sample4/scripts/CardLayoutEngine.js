(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["CardLayoutEngine"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["CardLayoutEngine"] = factory();
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
	        var HORIZONTAL = 'horizontal';
	        var VERTICAL = 'vertical';
	        var RTL_CLASS_NAME = 'gc-rtl';
	        var GROUP_HEADER = 'groupHeader';
	        var GROUP_FOOTER = 'groupFooter';
	        var GROUP_CONTENT = 'groupContent';
	        var DEFAULT_HEADER_HEIGHT = 40;
	        var GROUP_INDENT = 18;
	
	        var CardLayoutEngine = function(options) {
	            var optionDefaults = {
	                cardHeight: 256,
	                cardWidth: 256,
	                direction: HORIZONTAL,
	                showScrollBar: true,
	                rightToLeft: false
	            };
	            var self = this;
	            self.layoutInfo_ = null;
	
	            self.name = 'CardLayoutEngine'; //name must end with LayoutEngine
	            self.options = _.defaults(options || {}, optionDefaults);
	        };
	
	        CardLayoutEngine.prototype = {
	            getColumnDefaults_: function() {
	                return {
	                    visible: true,
	                    allowSorting: false,
	                    allowEditing: false
	                };
	            },
	
	            init: function(grid) {
	                var self = this;
	
	                self.grid = grid;
	                grid.columns = _.map(grid.columns, function(col) {
	                    return _.defaults(col, _.defaults(self.getColumnDefaults_(), {
	                        id: col.dataField,
	                        caption: col.dataField
	                    }));
	                });
	
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
	                if (self.groupStrategy_) {
	                    self.groupStrategy_.clearRenderCache_();
	                }
	                self.layoutInfo_ = null;
	                self.rowTemplateFn_ = null;
	                self.hasScrollBars_ = null;
	                self.cachedContainerSizeWithoutScrollBar_ = null;
	                self.cachedContainerSizeWithScrollBar_ = null;
	            },
	
	            getRenderInfo: function(options) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.getRenderInfo(options);
	                }
	                var includeRows = options.includeRows || true;
	                var area = (options && options.area) || '';
	                if (!area) {
	                    return null;
	                }
	                var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	                var layoutEngineOptions = scope.options;
	                var direction = layoutEngineOptions.direction;
	                var rightToLeft = layoutEngineOptions.rightToLeft;
	                var width = layoutInfo.width;
	                var height = layoutInfo.height;
	                var r;
	                var hasScrollBars = scope.hasScrollBar_();
	                var outerDivLeft = rightToLeft && hasScrollBars.vertical ? layoutInfo.left + domUtil.getScrollbarSize().width : layoutInfo.left;
	                var innerDivLeft = rightToLeft && (direction === VERTICAL) ? layoutInfo.contentWidth - options.offsetLeft - width : -options.offsetLeft;
	
	                r = {
	                    outerDivCssClass: 'gc-viewport' + (rightToLeft ? ' ' + RTL_CLASS_NAME : ''),
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: layoutInfo.top,
	                        left: outerDivLeft,
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
	                        left: innerDivLeft,
	                        top: -options.offsetTop
	                    },
	                    renderedRows: []
	                };
	                if (includeRows) {
	                    r.renderedRows = getRenderInfoInternal_.call(scope, direction, layoutInfo, options, false);
	                }
	                return r;
	            },
	
	            getRenderRange_: function(options) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.getRenderRange_(options);
	                }
	
	                var area = (options && options.area) || '';
	                if (!area) {
	                    return null;
	                }
	
	                return getRowsRenderRange_.call(scope, options);
	            },
	
	            getRenderRowInfo_: function(row, area) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.getRenderRowInfo_(row, area);
	                }
	                var options = scope.options;
	                var grid = scope.grid;
	
	                if (scope.grid.data.groups) {
	                    var info = row.info;
	                    var groupInfo = grid.getGroupInfo_(info.path);
	
	                    var direction = options.direction;
	                    var rightToLeft = options.rightToLeft;
	                    var key = row.key;
	                    var rect = row.bounds;
	
	                    if (info.area === GROUP_HEADER) {
	                        return getGroupHeaderRow_.call(scope, key, info, groupInfo, rect, direction, rightToLeft);
	                    } else if (info.area === GROUP_CONTENT) {
	                        return getGroupContentRow_.call(scope, key, row.index, rect, groupInfo, rightToLeft);
	                    } else {
	                        return getGroupFooterRow_.call(scope, key, info, groupInfo, rect, direction, rightToLeft);
	                    }
	                } else {
	                    return getRenderRowInfoInternal.call(scope, row.key, row.style, row.index);
	                }
	            },
	
	            getRowTemplate: function() {
	                return getTemplate_.call(this, false);
	            },
	
	            showScrollPanel: function(area) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.showScrollPanel(area);
	                }
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
	
	            isScrollableArea_: function(area) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.isScrollableArea_(area);
	                }
	
	                return area.toLowerCase() === VIEWPORT;
	            },
	
	            getScrollPanelRenderInfo: function(area) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.getScrollPanelRenderInfo(area);
	                }
	                if (area.toLowerCase() === VIEWPORT) {
	                    var viewportLayout = self.getLayoutInfo()[VIEWPORT];
	                    var hasScrollBar = self.hasScrollBar_();
	                    return {
	                        outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-left scroll-top' + (self.options.rightToLeft ? ' ' + RTL_CLASS_NAME : ''),
	                        outerDivStyle: {
	                            position: POS_ABS,
	                            top: 0,
	                            left: 0,
	                            height: viewportLayout.height + (hasScrollBar.horizontal ? domUtil.getScrollbarSize().height : 0),
	                            width: viewportLayout.width + (hasScrollBar.vertical ? domUtil.getScrollbarSize().width : 0),
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
	
	            hasScrollBar_: function() {
	                var scope = this;
	                if (scope.hasScrollBars_) {
	                    return scope.hasScrollBars_;
	                } else {
	                    var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	                    return {
	                        vertical: layoutInfo.height < layoutInfo.contentHeight,
	                        horizontal: layoutInfo.width < layoutInfo.contentWidth
	                    };
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
	
	            getInitialScrollOffset: function() {
	                var layoutInfo = this.getLayoutInfo()[VIEWPORT];
	                var options = this.options;
	
	                return {
	                    top: 0,
	                    left: options.rightToLeft && (options.direction === VERTICAL) ? layoutInfo.contentWidth - layoutInfo.width : 0
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
	                for (i = 0, len = groupInfos.length; i < len; i++) {
	                    groupInfos[i].height = self.getGroupHeight_(groupInfos[i]);
	                }
	            },
	
	            getGroupHeight_: function(groupInfo) {
	                var scope = this;
	
	                if (!groupInfo) {
	                    return 0;
	                }
	                if (!gcUtils.isUndefined(groupInfo.height)) {
	                    return groupInfo.height;
	                }
	
	                var group = groupInfo.data;
	                var options = scope.options;
	                var direction = options.direction;
	                var sideLength = 0;
	                var header = group.groupDescriptor.header;
	                if (header && header.visible) {
	                    sideLength += scope.getGroupHeaderHeight_(group);
	                }
	
	                var containerSize = getContainerSizeWithScrollBar_.call(scope);
	                var cardCountInAssistDirection;
	                var i;
	                var len;
	                var childGroup;
	                if (direction === VERTICAL) {
	                    cardCountInAssistDirection = Math.floor(containerSize.height / options.cardHeight);
	                } else {
	                    cardCountInAssistDirection = Math.floor(containerSize.width / options.cardWidth);
	                }
	                if (!group.collapsed) {
	                    len = group.isBottomLevel ? group.itemCount : groupInfo.children.length;
	                    if (group.isBottomLevel) {
	                        sideLength += Math.ceil(len / cardCountInAssistDirection) * scope.getRowHeight_();
	                    } else {
	                        for (i = 0; i < len; i++) {
	                            childGroup = groupInfo.children[i];
	                            childGroup.height = scope.getGroupHeight_(childGroup);
	                            sideLength += childGroup.height;
	                        }
	                    }
	                    sideLength += scope.getGroupFooterHeight_(group);
	                } else {
	                    var footer = group.groupDescriptor.footer;
	                    if (!footer && footer.visible && !footer.collapseWithGroup) {
	                        sideLength += scope.getGroupFooterHeight_(group);
	                    }
	                }
	                return sideLength;
	            },
	
	            handleScroll: function() {
	                var self = this;
	                if (self.groupStrategy_) {
	                    self.groupStrategy_.handleScroll();
	                } else {
	                    var grid = self.grid;
	                    grid.scrollRenderPart_(VIEWPORT);
	                }
	            },
	
	            hitTest: function(eventArgs) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.hitTest(eventArgs);
	                }
	                var left = eventArgs.pageX;
	                var top = eventArgs.pageY;
	                var grid = scope.grid;
	                //get container padding and position
	                var containerInfo = grid.getContainerInfo_().contentRect;
	                var offsetLeft = left - containerInfo.left;
	                var offsetTop = top - containerInfo.top;
	                var point = {
	                    left: offsetLeft,
	                    top: offsetTop
	                };
	                var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	                var contentWidth = layoutInfo.contentWidth;
	                var options = scope.options;
	                var direction = options.direction;
	                var rightToLeft = options.rightToLeft;
	                var cardWidth = options.cardWidth;
	                var cardHeight = options.cardHeight;
	                var cardCountInAssistDirection = layoutInfo.cardCountInAssistDirection;
	                var hitTestInfo = {
	                    area: '',
	                    row: -1,
	                    groupInfo: null
	                };
	                var i;
	                var len;
	
	                var height;
	                var inContentRelativeLeft;
	                var groupInfos = grid.groupInfos_;
	                var headerHeight;
	                var groupHeight;
	                var groupInfo;
	                var group;
	                var row;
	                //if viewport
	                var inViewPort;
	                if (direction === HORIZONTAL && rightToLeft) {
	                    var scrollBarWidth = domUtil.getScrollbarSize().width;
	                    inViewPort = contains2d_({
	                        left: layoutInfo.left + scrollBarWidth,
	                        top: layoutInfo.top,
	                        width: layoutInfo.width,
	                        height: layoutInfo.height
	                    }, point);
	                } else {
	                    inViewPort = contains2d_(layoutInfo, point);
	                }
	                if (inViewPort) {
	                    hitTestInfo.area = VIEWPORT;
	                    offsetLeft += grid.scrollOffset.left - layoutInfo.left;
	                    offsetTop += grid.scrollOffset.top - layoutInfo.top;
	
	                    if (direction === VERTICAL) {
	                        height = rightToLeft ? contentWidth - offsetLeft - grid.scrollOffset.left : offsetLeft + grid.scrollOffset.left;
	                    } else {
	                        height = offsetTop;
	                    }
	                    if (!groupInfos || groupInfos.length === 0) {
	                        if (direction === VERTICAL) {
	                            inContentRelativeLeft = offsetTop;
	                            row = Math.floor(height / cardWidth) * cardCountInAssistDirection + Math.floor(inContentRelativeLeft / cardHeight);
	                        } else {
	                            inContentRelativeLeft = rightToLeft ? layoutInfo.width - offsetLeft : offsetLeft;
	                            row = Math.floor(height / cardHeight) * cardCountInAssistDirection + Math.floor(inContentRelativeLeft / cardWidth);
	                        }
	                        if (row >= grid.data.itemCount) {
	                            row = -1;
	                        }
	                        hitTestInfo.row = row;
	                    } else {
	                        for (i = 0, len = groupInfos.length; i < len; i++) {
	                            groupInfo = groupInfos[i];
	                            group = groupInfo.data;
	                            headerHeight = scope.getGroupHeaderHeight_(group);
	                            groupHeight = groupInfo.collapsed ? (headerHeight + (group.groupDescriptor.footer.collapseWithGroup ? 0 : scope.getGroupFooterHeight_(group))) : groupInfo.height;
	                            if (offsetTop < groupHeight) {
	                                return hitTestGroup_.call(scope, groupInfo, offsetLeft, offsetTop);
	                            }
	                            offsetTop -= groupHeight;
	                        }
	                    }
	                }
	                return hitTestInfo;
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
	
	            toJSON: function() {
	                var self = this;
	                var options = self.options;
	                var jsonObj = {};
	                jsonObj.name = self.name;
	                var cardOptions = {};
	                if (options.cardHeight !== 256) {
	                    cardOptions.cardHeight = options.cardHeight;
	                }
	                if (options.cardWidth !== 256) {
	                    cardOptions.cardWidth = options.cardWidth;
	                }
	                if (options.direction !== HORIZONTAL) {
	                    cardOptions.direction = options.direction;
	                }
	                if (options.showScrollBar !== true) {
	                    cardOptions.showScrollBar = options.showScrollBar;
	                }
	                if (options.rightToLeft !== false) {
	                    cardOptions.rightToLeft = options.rightToLeft;
	                }
	                if (options.rowTemplate) {
	                    cardOptions.rowTemplate = getRawRowTemplate_.call(self);
	                }
	                if (options.groupStrategy) {
	                    cardOptions.groupStrategy = options.groupStrategy.toJSON();
	                }
	                if (!_.isEmpty(cardOptions)) {
	                    jsonObj.options = cardOptions;
	                }
	                return jsonObj;
	            },
	
	            getInnerGroupHeight: function(groupInfo, containerSize) {
	                if (!groupInfo.isBottomLevel) {
	                    return 0;
	                }
	                var self = this;
	                var options = self.options;
	                return Math.ceil(groupInfo.data.itemCount / Math.floor(containerSize.width / options.cardWidth)) * self.getRowHeight_();
	            },
	
	            getInnerGroupRenderInfo: function(groupInfo, containerSize, layoutCallback) {
	                if (!groupInfo.isBottomLevel) {
	                    return;
	                }
	                var self = this;
	                var options = self.options;
	                var group = groupInfo.data;
	                var startPosition = 0;
	                var direction = options.direction;
	                var cardCountInAssistDirection = (direction === VERTICAL) ? Math.floor(containerSize.height / options.cardHeight) : Math.floor(containerSize.width / options.cardWidth);
	                var i;
	                var len;
	                var rowHeight = self.getRowHeight_();
	                var rows = [];
	                var layout;
	                var additionalStyle;
	                var additionalCSSClass;
	                var renderRect;
	                var cardHeight = options.cardHeight;
	                var cardWidth = options.cardWidth;
	                for (i = 0, len = group.itemCount; i < len; i++) {
	                    if (layoutCallback) {
	                        layout = layoutCallback(groupInfo, i);
	                        additionalCSSClass = layout.cssClass;
	                        additionalStyle = layout.style || {};
	                        additionalStyle.width = options.itemWidth;
	                        var layoutBound = layout.location;
	                        if (layoutBound) {
	                            renderRect = {
	                                top: layoutBound.top,
	                                left: layoutBound.left,
	                                height: cardHeight,
	                                width: cardWidth
	                            };
	                            rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, i, renderRect, false, additionalCSSClass, additionalStyle));
	                        } else {
	                            renderRect = {
	                                top: direction === VERTICAL ? (i % cardCountInAssistDirection * cardHeight) : startPosition,
	                                left: direction === VERTICAL ? startPosition : (i % cardCountInAssistDirection * cardWidth),
	                                height: cardHeight,
	                                width: cardWidth
	                            };
	
	                            rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, i, renderRect, false, additionalCSSClass, additionalStyle));
	                            if (i % cardCountInAssistDirection === cardCountInAssistDirection - 1) {
	                                startPosition += rowHeight;
	                            }
	                        }
	                    } else {
	                        additionalStyle = {width: options.itemWidth};
	                        renderRect = {
	                            top: direction === VERTICAL ? (i % cardCountInAssistDirection * cardHeight) : startPosition,
	                            left: direction === VERTICAL ? startPosition : (i % cardCountInAssistDirection * cardWidth),
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, groupInfo, i, renderRect, false, null, additionalStyle));
	                        if (i % cardCountInAssistDirection === cardCountInAssistDirection - 1) {
	                            startPosition += rowHeight;
	                        }
	                    }
	                }
	                return rows;
	            },
	
	            getMaxVisibleItemCount: function(containerSize) {
	                var self = this;
	                var options = self.options;
	                var itemsPerRow = (options.direction === VERTICAL ? Math.floor(containerSize.height / options.cardHeight) : Math.floor(containerSize.width / options.cardWidth));
	                return itemsPerRow * ((options.direction === VERTICAL) ? Math.floor(containerSize.width / options.cardWidth) : Math.floor(containerSize.height / options.cardHeight));
	            },
	
	            hitTestGroupContent_: function(groupInfo, area, left, top, containerSize) {
	                if (area !== VIEWPORT) {
	                    return null;
	                }
	                var self = this;
	                var options = self.options;
	                var direction = options.direction;
	                var cardWidth = options.cardWidth;
	                var cardHeight = options.cardHeight;
	                var group = groupInfo.data;
	                var itemsPerRow = (direction === VERTICAL) ? Math.floor(containerSize.height / cardHeight) : Math.floor(containerSize.width / cardWidth);
	                var row = -1;
	                if (direction === VERTICAL) {
	                    row = Math.floor(left / cardWidth) * itemsPerRow + Math.floor(top / cardHeight);
	                } else {
	                    row = Math.floor(top / cardHeight) * itemsPerRow + Math.floor(left / cardWidth);
	                }
	                if (row >= group.itemCount) {
	                    row = -1;
	                }
	                return {
	                    area: VIEWPORT,
	                    row: -1,
	                    column: -1,
	                    groupInfo: {
	                        area: GROUP_CONTENT,
	                        path: groupInfo.path,
	                        row: row,
	                        column: -1
	                    }
	                };
	            },
	
	            getRowHeight_: function() {
	                var direction = this.options.direction;
	                return direction === VERTICAL ? this.options.cardWidth : this.options.cardHeight;
	            },
	
	            getGroupHeaderHeight_: function(group) {
	                var header = group.groupDescriptor.header;
	                return (header && header.visible) ? (header.height || DEFAULT_HEADER_HEIGHT) : 0;
	            },
	
	            getGroupFooterHeight_: function(group) {
	                var footer = group.groupDescriptor.footer;
	                return (footer && footer.visible) ? (footer.height || DEFAULT_HEADER_HEIGHT) : 0;
	            },
	
	            registeEvents_: function() {
	                var self = this;
	                self.grid.onMouseWheel.addHandler(handleMouseWheel);
	                self.grid.onMouseClick.addHandler(handleMouseClick);
	                self.grid.onTap_.addHandler(handleTouchTap);
	            },
	
	            unRegisteEvents_: function() {
	                var self = this;
	                self.grid.onMouseWheel.removeHandler(handleMouseWheel);
	                self.grid.onMouseClick.removeHandler(handleMouseClick);
	                self.grid.onTap_.removeHandler(handleTouchTap);
	            },
	
	            handleTemplateChange_: function() {
	            },
	
	            canDoSwipe_: function() {
	                return false;
	            },
	
	            canStartSwipe_: function() {
	
	            }
	        };
	
	        function hitTestGroup_(groupInfo, left, top) {
	            var self = this;
	            var group = groupInfo.data;
	            var children;
	            var child;
	            var i;
	            var len;
	            var headerHeight = self.getGroupHeaderHeight_(group);
	            var footerHeight = self.getGroupFooterHeight_(group);
	            var groupHeight;
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            var footer = group.groupDescriptor.footer;
	            var hitTestInfo;
	            var headerElement;
	            var groupPath = groupInfo.path;
	            var toggleElement;
	            var onExpandToggle;
	            if (top < headerHeight) {
	                onExpandToggle = false;
	                headerElement = document.getElementById(self.grid.uid + '-gh' + groupPath.join('_'));
	                if (headerElement) {
	                    toggleElement = headerElement.querySelector('.gc-grouping-toggle');
	                    var eleOffset = domUtil.offset(toggleElement);
	                    var elementRect = domUtil.getElementRect(toggleElement);
	                    var headerElementOffset = domUtil.offset(headerElement);
	                    if (contains2d_.call(self, {
	                            left: eleOffset.left - headerElementOffset.left,
	                            top: eleOffset.top - headerElementOffset.top,
	                            width: elementRect.width,
	                            height: elementRect.height
	                        }, {left: left, top: top}, true)) {
	                        onExpandToggle = true;
	                    }
	                }
	                return {
	                    area: VIEWPORT,
	                    row: -1,
	                    column: -1,
	                    groupInfo: {
	                        path: groupPath,
	                        area: GROUP_HEADER,
	                        onExpandToggle: onExpandToggle
	                    }
	                };
	            }
	            top -= headerHeight;
	            if (groupInfo.isBottomLevel) {
	                hitTestInfo = self.hitTestGroupContent_(groupInfo, VIEWPORT, left, top, {
	                    width: layoutInfo.contentWidth,
	                    height: layoutInfo.contentHeight
	                });
	                if (!hitTestInfo) { //must be footer?
	                    return {
	                        area: VIEWPORT,
	                        row: -1,
	                        column: -1,
	                        groupInfo: {
	                            path: groupPath,
	                            area: GROUP_FOOTER
	                        }
	                    };
	                }
	                return hitTestInfo;
	            } else {
	                children = groupInfo.children;
	                for (i = 0, len = children.length; i < len; i++) {
	                    child = children[i];
	                    groupHeight = child.collapsed ? (headerHeight + (footer.collapseWithGroup ? 0 : footerHeight)) : child.height;
	                    if (top <= groupHeight) {
	                        return hitTestGroup_.call(self, children[i], left, top);
	                    }
	                    top -= groupHeight;
	                }
	            }
	            return null;
	        }
	
	        function getRowsRenderRange_(options) {
	            var scope = this;
	            var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	            var layoutEngineOptions = scope.options;
	            var direction = layoutEngineOptions.direction;
	            var reverse = layoutEngineOptions.rightToLeft && (direction === VERTICAL);
	
	            return {
	                left: reverse ? layoutInfo.contentWidth - layoutInfo.width - options.offsetLeft : -options.offsetLeft,
	                top: -options.offsetTop,
	                renderedRows: getRenderInfoInternal_.call(scope, direction, layoutInfo, options, true)
	            };
	        }
	
	        function getRenderInfoInternal_(direction, layoutInfo, options, getUpdateRow) {
	            var scope = this;
	            var visibleRange = {
	                start: direction === VERTICAL ? options.offsetLeft : options.offsetTop,
	                end: direction === VERTICAL ? options.offsetLeft + layoutInfo.width : options.offsetTop + layoutInfo.height
	            };
	
	            if (scope.grid.data.groups) {
	                return getRenderedGroupItemsInfo_.call(scope, visibleRange, getUpdateRow);
	            } else {
	                return getRenderedItemsInfo_.call(scope, visibleRange, getUpdateRow);
	            }
	        }
	
	        function getContainerSizeWithoutScrollBar_() {
	            var scope = this;
	            if (scope.cachedContainerSizeWithoutScrollBar_) {
	                return scope.cachedContainerSizeWithoutScrollBar_;
	            }
	            var containerInfo = scope.grid.getContainerInfo_();
	            var rect = containerInfo.contentRect;
	
	            scope.cachedContainerSizeWithoutScrollBar_ = {
	                width: rect.width,
	                height: rect.height
	            };
	
	            return scope.cachedContainerSizeWithoutScrollBar_;
	        }
	
	        function getContainerSizeWithScrollBar_() {
	            var scope = this;
	            if (scope.cachedContainerSizeWithScrollBar_) {
	                return scope.cachedContainerSizeWithScrollBar_;
	            }
	
	            var direction = scope.options.direction;
	            var showScrollBar = scope.options.showScrollBar;
	            var containerSize = getContainerSizeWithoutScrollBar_.call(scope);
	            var width = containerSize.width;
	            var height = containerSize.height;
	
	            if (scope.grid.data.groups) {
	                if (showScrollBar && !isGroupFitTheContainer_.call(scope)) {
	                    if (direction === VERTICAL) {
	                        scope.hasScrollBars_ = {
	                            vertical: false,
	                            horizontal: true
	                        };
	                        height -= domUtil.getScrollbarSize().height;
	                    } else {
	                        scope.hasScrollBars_ = {
	                            vertical: true,
	                            horizontal: false
	                        };
	                        width -= domUtil.getScrollbarSize().width;
	                    }
	                }
	            } else {
	                if (showScrollBar && !isUngroupedFitTheContainer_.call(scope)) {
	                    if (direction === VERTICAL) {
	                        scope.hasScrollBars_ = {
	                            vertical: false,
	                            horizontal: true
	                        };
	                        height -= domUtil.getScrollbarSize().height;
	                    } else {
	                        scope.hasScrollBars_ = {
	                            vertical: true,
	                            horizontal: false
	                        };
	                        width -= domUtil.getScrollbarSize().width;
	                    }
	                }
	            }
	
	            scope.cachedContainerSizeWithScrollBar_ = {
	                width: width,
	                height: height
	            };
	            return scope.cachedContainerSizeWithScrollBar_;
	        }
	
	        function isGroupFitTheContainer_() {
	            var scope = this;
	            var direction = scope.direction;
	            var rawContainerSize = getContainerSizeWithoutScrollBar_.call(scope);
	            var heightThreshold = direction === VERTICAL ? rawContainerSize.width : rawContainerSize.height;
	            var currHeight = 0;
	            var groups = scope.grid.data.groups;
	            var i;
	            var len = groups.length;
	            for (i = 0; i < len; i++) {
	                currHeight += getTestGroupHeight_.call(scope, groups[i], heightThreshold, 0);
	                if (currHeight > heightThreshold) {
	                    break;
	                }
	            }
	            return currHeight <= heightThreshold;
	        }
	
	        function isUngroupedFitTheContainer_() {
	            var scope = this;
	            var grid = scope.grid;
	            var options = scope.options;
	            var dataLength = grid.data.itemCount;
	            var rawContainerSize = getContainerSizeWithoutScrollBar_.call(scope);
	
	            var cardCountInAColumn = Math.floor(rawContainerSize.height / options.cardHeight);
	            var cardCountInARow = Math.floor(rawContainerSize.width / options.cardWidth);
	
	            return cardCountInAColumn * cardCountInARow >= dataLength;
	        }
	
	        function getTestGroupHeight_(groupInfo, heightThreshold, startPosition) {
	            if (!groupInfo) {
	                return 0;
	            }
	
	            var scope = this;
	            var options = scope.options;
	            var direction = options.direction;
	            var cardCountInAssistDirection;
	            var footer;
	            var i;
	            var len;
	
	            var currTotalHeight = startPosition;
	            if (currTotalHeight > heightThreshold) {
	                return currTotalHeight;
	            }
	
	            var containerSize = getContainerSizeWithoutScrollBar_.call(scope);
	            if (direction === VERTICAL) {
	                cardCountInAssistDirection = Math.floor(containerSize.height / options.cardHeight);
	            } else {
	                cardCountInAssistDirection = Math.floor(containerSize.width / options.cardWidth);
	            }
	
	            var groupDes = groupInfo.groupDescriptor;
	            footer = groupDes.footer;
	            var headerHeight = scope.getGroupHeaderHeight_(groupInfo);
	            var footerHeight = scope.getGroupFooterHeight_(groupInfo);
	            currTotalHeight += headerHeight;
	            if (currTotalHeight > heightThreshold) {
	                return currTotalHeight;
	            }
	            if (!groupDes.collapsed) {
	                if (groupInfo.isBottomLevel) {
	                    len = groupInfo.itemCount;
	                    currTotalHeight += Math.ceil(len / cardCountInAssistDirection) * scope.getRowHeight_();
	                    if (currTotalHeight > heightThreshold) {
	                        return currTotalHeight;
	                    }
	                } else {
	                    len = groupInfo.groups.length;
	                    for (i = 0; i < len; i++) {
	                        currTotalHeight = getTestGroupHeight_.call(scope, groupInfo.groups[i], heightThreshold, currTotalHeight);
	                        if (currTotalHeight > heightThreshold) {
	                            return currTotalHeight;
	                        }
	                    }
	                }
	                currTotalHeight += footerHeight;
	            } else {
	                if (footer && footer.visible && !footer.collapseWithGroup) {
	                    currTotalHeight += footerHeight;
	                }
	            }
	            return currTotalHeight;
	        }
	
	        function getRawRowTemplate_() {
	            var rowTmpl = this.options.rowTemplate;
	            if (rowTmpl) {
	                if (gcUtils.isString(rowTmpl) && rowTmpl.length > 1 && rowTmpl[0] === '#') {
	                    var tmplElement = document.getElementById(rowTmpl.slice(1));
	                    return tmplElement.innerHTML;
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
	            var totalVisibleCols = 0;
	            _.each(cols, function(col) {
	                if (col.visible) {
	                    totalVisibleCols += 1;
	                }
	            });
	            var itemHeight = Math.floor(self.options.cardHeight / totalVisibleCols);
	
	            var r = '<div>';
	            _.each(cols, function(col) {
	                if (col.visible) {
	                    r += '<div class="gc-column" style="position:static;' + (col.visible ? ('height:' + itemHeight + 'px;') : 'display:none;') + '" data-column="' + col.id + '"></div>';
	                }
	            });
	            r += '</div>';
	            return r;
	        }
	
	        function getViewportLayoutInfo_() {
	            var scope = this;
	            var options = scope.options;
	            var direction = options.direction;
	            var cardHeight = options.cardHeight;
	            var cardWidth = options.cardWidth;
	            var contentHeight;
	            var contentWidth;
	            var cardCountInAssistDirection;
	
	            var containerSize = getContainerSizeWithScrollBar_.call(scope);
	            var cHeight = containerSize.height;
	            var cWidth = containerSize.width;
	            if (direction === VERTICAL) {
	                cardCountInAssistDirection = Math.floor(cHeight / cardHeight);
	                contentWidth = getContentHeight_(scope.grid, cardCountInAssistDirection);
	                contentHeight = cHeight;
	
	            } else {
	                cardCountInAssistDirection = Math.floor(cWidth / cardWidth);
	                contentHeight = getContentHeight_(scope.grid, cardCountInAssistDirection);
	                contentWidth = cWidth;
	            }
	            return {
	                top: 0,
	                left: 0,
	                width: cWidth,
	                height: cHeight,
	                contentWidth: contentWidth,
	                contentHeight: contentHeight,
	                cardCountInAssistDirection: cardCountInAssistDirection
	            };
	        }
	
	        function getContentHeight_(grid, cardCountInAssistDirection) {
	            var data = grid.data;
	            if (hasGroup_(grid)) {
	                return _.reduce(grid.groupInfos_, function(sum, item) {
	                    return sum + item.height;
	                }, 0);
	            } else {
	                var options = grid.layoutEngine.options;
	                var direction = options.direction;
	                var cardWidth = options.cardWidth;
	                var cardHeight = options.cardHeight;
	                var len = data.itemCount;
	                return direction === VERTICAL ? Math.ceil(len / cardCountInAssistDirection) * cardWidth : Math.ceil(len / cardCountInAssistDirection) * cardHeight;
	            }
	        }
	
	        function getRenderedItemsInfo_(visibleRange, getUpdateRow) {
	            var scope = this;
	            var rows = [];
	
	            var grid = scope.grid;
	            var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	            var layoutEngineOptions = scope.options;
	            var direction = layoutEngineOptions.direction;
	            var rightToLeft = layoutEngineOptions.rightToLeft;
	            var cardWidth = layoutEngineOptions.cardWidth;
	            var cardHeight = layoutEngineOptions.cardHeight;
	            var startEndIndex;
	            var i;
	            var style;
	            var key;
	
	            //calculate the render ranges
	            startEndIndex = getStartEndIndexAt_.call(scope, {top: visibleRange.start, left: visibleRange.start});
	
	            //get cards render info
	            var formattedRowItem;
	            var leftCoordinate;
	            if (direction === VERTICAL) {
	                for (i = startEndIndex.start; i < startEndIndex.end; i++) {
	                    formattedRowItem = grid.getDataItem(i);
	                    leftCoordinate = Math.floor(i / layoutInfo.cardCountInAssistDirection) * cardWidth;
	                    if (rightToLeft) {
	                        style = {
	                            top: i % layoutInfo.cardCountInAssistDirection * cardHeight,
	                            right: leftCoordinate,
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                    } else {
	                        style = {
	                            top: i % layoutInfo.cardCountInAssistDirection * cardHeight,
	                            left: leftCoordinate,
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                    }
	                    key = grid.uid + '-r' + i;
	                    rows.push(createRow_.call(scope, key, style, i, getUpdateRow));
	                }
	            } else {
	                //default direction is horizontal
	                for (i = startEndIndex.start; i < startEndIndex.end; i++) {
	
	                    leftCoordinate = i % layoutInfo.cardCountInAssistDirection * cardWidth;
	                    if (rightToLeft) {
	                        style = {
	                            top: Math.floor(i / layoutInfo.cardCountInAssistDirection) * cardHeight,
	                            right: leftCoordinate,
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                    } else {
	                        style = {
	                            top: Math.floor(i / layoutInfo.cardCountInAssistDirection) * cardHeight,
	                            left: leftCoordinate,
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                    }
	
	                    key = grid.uid + '-r' + i;
	                    rows.push(createRow_.call(scope, key, style, i, getUpdateRow));
	                }
	            }
	            return rows;
	        }
	
	        function createRow_(key, style, index, getUpdateRow) {
	            var scope = this;
	            if (getUpdateRow) {
	                return {
	                    key: key,
	                    style: style,
	                    index: index
	                };
	            } else {
	                return getRenderRowInfoInternal.call(scope, key, style, index);
	            }
	        }
	
	        function getRenderRowInfoInternal(key, style, index) {
	            var scope = this;
	            var grid = scope.grid;
	            var formattedRowItem = grid.getFormattedDataItem(index);
	
	            return {
	                key: key,
	                renderInfo: {
	                    cssClass: 'gc-row r' + index,
	                    style: style,
	                    renderedHTML: scope.getRowTemplate()(formattedRowItem)
	                }
	            };
	        }
	
	        function getRenderedGroupContentItemInfo_(groupInfo, rowIndex, renderRect, getUpdateRow, additionalCSSClass, additionalStyle) {
	            var self = this;
	            var key = self.grid.uid + '-gr' + groupInfo.path.join('_') + '-r' + rowIndex;
	
	            if (getUpdateRow) {
	                return {
	                    key: key,
	                    info: {
	                        path: groupInfo.path,
	                        itemIndex: rowIndex,
	                        area: GROUP_CONTENT
	                    },
	                    bounds: renderRect,
	                    index: rowIndex
	                };
	            } else {
	                return getGroupContentRow_.call(self, key, rowIndex, renderRect, groupInfo, self.options.rightToLeft, additionalCSSClass, additionalStyle);
	            }
	        }
	
	        function getRenderedGroupItemsInfo_(visibleRange, getUpdateRow) {
	            var rows = [];
	            var scope = this;
	            var grid = scope.grid;
	            var entireGroupInfos = grid.groupInfos_;
	            var groupInfos = [];
	            var height;
	            var startRender = false;
	            var endRenderItem = false;
	            var endRender = false;
	            var currInfo;
	            var groupInfo;
	            var i;
	            var len;
	            var maxIndex = 0;
	            var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	            var cardCountInAssistDirection = layoutInfo.cardCountInAssistDirection;
	            var options = scope.options;
	            var direction = options.direction;
	            var rightToLeft = options.rightToLeft;
	            var cardHeight = options.cardHeight;
	            var cardWidth = options.cardWidth;
	            var contentWidth = layoutInfo.contentWidth;
	            var contentHeight = layoutInfo.contentHeight;
	            var rect;
	            var rowIndex;
	            var reverse = rightToLeft && (direction === VERTICAL);
	            var windowRange = reverse ? {
	                start: contentWidth - visibleRange.end,
	                end: contentWidth - visibleRange.start
	            } : visibleRange;
	            var currentStartPosition = 0;
	            var footer;
	            var key;
	            var renderRect;
	            for (i = 0, len = entireGroupInfos.length - 1; i <= len; i++) {
	                groupInfos.push({
	                    path: [i],
	                    itemIndex: -1,
	                    area: GROUP_HEADER
	                });
	            }
	
	            //skip groups, minimize the overlap compare
	            while (groupInfos.length > 0) {
	                currInfo = groupInfos[0];
	                groupInfo = grid.getGroupInfo_(currInfo.path);
	                if (!startRender) {
	                    if (overlaps_(windowRange, {
	                            start: currentStartPosition,
	                            end: currentStartPosition + groupInfo.height
	                        })) {
	                        startRender = true;
	                        break;
	                    } else {
	                        currentStartPosition += groupInfo.height;
	                        groupInfos.shift();
	                    }
	                }
	            }
	
	            startRender = false;
	            while (groupInfos.length > 0) {
	                if (endRender) {
	                    break;
	                }
	                currInfo = groupInfos.shift();
	                groupInfo = grid.getGroupInfo_(currInfo.path);
	
	                if (currInfo.area === GROUP_HEADER) {
	                    var header = groupInfo.data.groupDescriptor.header;
	                    if (header && header.visible) {
	                        height = scope.getGroupHeaderHeight_(groupInfo.data);
	                        if (!startRender) {
	                            if (overlaps_(windowRange, {
	                                    start: currentStartPosition,
	                                    end: currentStartPosition + height
	                                })) {
	                                startRender = true;
	                            } else {
	                                currentStartPosition += height;
	                            }
	                        }
	                        if (startRender) {
	                            if (direction === VERTICAL) {
	                                rect = {
	                                    width: height,
	                                    height: contentHeight,
	                                    top: 0,
	                                    left: currentStartPosition
	                                };
	                            } else {
	                                rect = {
	                                    width: contentWidth,
	                                    height: height,
	                                    top: currentStartPosition,
	                                    left: 0
	                                };
	                            }
	
	                            key = grid.uid + '-gh' + currInfo.path.join('_');
	                            if (getUpdateRow) {
	                                rows.push({
	                                    key: key,
	                                    info: currInfo,
	                                    bounds: rect
	                                });
	                            } else {
	                                rows.push(getGroupHeaderRow_.call(scope, key, currInfo, groupInfo, rect, direction, rightToLeft));
	                            }
	
	                            currentStartPosition += height;
	                            if (!contains1d_(windowRange, currentStartPosition)) {
	                                endRender = true;
	                            }
	                        }
	                    }
	                } else if (currInfo.area === GROUP_CONTENT) {
	                    groupInfo = grid.getGroupInfo_(currInfo.path);
	                    rowIndex = currInfo.itemIndex;
	                    height = scope.getRowHeight_();
	                    if (!startRender) {
	                        if (overlaps_(windowRange, {start: currentStartPosition, end: currentStartPosition + height})) {
	                            startRender = true;
	                        } else {
	                            endRenderItem = (rowIndex % cardCountInAssistDirection === cardCountInAssistDirection - 1) || rowIndex === maxIndex - 1;
	                            if (endRenderItem) {
	                                currentStartPosition += height;
	                            }
	                        }
	                    }
	                    if (startRender) {
	                        renderRect = {
	                            top: direction === VERTICAL ? (rowIndex % cardCountInAssistDirection * cardHeight) : currentStartPosition,
	                            left: direction === VERTICAL ? currentStartPosition : (rowIndex % cardCountInAssistDirection * cardWidth),
	                            height: cardHeight,
	                            width: cardWidth
	                        };
	                        rows.push(getRenderedGroupContentItemInfo_.call(scope, groupInfo, rowIndex, renderRect, getUpdateRow));
	                        endRenderItem = (rowIndex % cardCountInAssistDirection === cardCountInAssistDirection - 1) || rowIndex === maxIndex - 1;
	                        if (endRenderItem) {
	                            currentStartPosition += height;
	                            if (!contains1d_(windowRange, currentStartPosition)) {
	                                endRender = true;
	                            }
	                        }
	                    }
	                } else {
	                    groupInfo = grid.getGroupInfo_(currInfo.path);
	                    footer = groupInfo.data.groupDescriptor.footer;
	                    if (footer && footer.visible) {
	                        height = scope.getGroupFooterHeight_(groupInfo.data);
	                        if (!startRender) {
	                            if (overlaps_(windowRange, {
	                                    start: currentStartPosition,
	                                    end: currentStartPosition + height
	                                })) {
	                                startRender = true;
	                            } else {
	                                currentStartPosition += height;
	                            }
	                        }
	                        if (startRender) {
	                            if (direction === VERTICAL) {
	                                rect = {
	                                    width: height,
	                                    height: contentHeight,
	                                    top: 0,
	                                    left: currentStartPosition
	                                };
	                            } else {
	                                rect = {
	                                    width: contentWidth,
	                                    height: height,
	                                    top: currentStartPosition,
	                                    left: 0
	                                };
	                            }
	
	                            key = grid.uid + '-gf' + currInfo.path.join('_');
	                            if (getUpdateRow) {
	                                rows.push({
	                                    key: key,
	                                    info: currInfo,
	                                    bounds: rect
	                                });
	                            } else {
	                                rows.push(getGroupFooterRow_.call(scope, key, currInfo, groupInfo, rect, direction, rightToLeft));
	                            }
	                            rows.push({
	                                key: key,
	                                isRowRole: false,
	                                renderInfo: getGroupFooterRenderInfo_.call(scope, currInfo.path, groupInfo, rect, direction, rightToLeft)
	                            });
	                            currentStartPosition += height;
	                            if (!contains1d_(windowRange, currentStartPosition)) {
	                                endRender = true;
	                            }
	                        }
	                    }
	                }
	
	                if (currInfo.area === GROUP_HEADER) {
	                    groupInfo = grid.getGroupInfo_(currInfo.path);
	                    var group = groupInfo.data;
	                    footer = group.groupDescriptor.footer;
	                    if (group.collapsed) {
	                        if (group && !group.isBottomLevel && footer && footer.visible && !footer.collapseWithGroup) {
	                            groupInfos.unshift({
	                                path: currInfo.path,
	                                itemIndex: -1,
	                                area: GROUP_FOOTER
	                            });
	                        }
	                    } else {
	                        groupInfos.unshift({
	                            path: currInfo.path,
	                            itemIndex: -1,
	                            area: GROUP_FOOTER
	                        });
	
	                        len = maxIndex = group.isBottomLevel ? group.itemCount : groupInfo.children.length;
	                        for (i = len - 1; i >= 0; i--) {
	                            if (group.isBottomLevel) {
	                                groupInfos.unshift({
	                                    path: currInfo.path,
	                                    itemIndex: i,
	                                    area: GROUP_CONTENT
	                                });
	                            } else {
	                                groupInfos.unshift({
	                                    path: currInfo.path.slice().concat([i]),
	                                    itemIndex: -1,
	                                    area: GROUP_HEADER
	                                });
	                            }
	                        }
	                    }
	                }
	            }
	
	            return rows;
	        }
	
	        function getGroupHeaderRow_(key, currInfo, groupInfo, rect, direction, rightToLeft) {
	            var scope = this;
	
	            return {
	                key: key,
	                isRowRole: false,
	                renderInfo: getGroupHeaderRenderInfo_.call(scope, currInfo.path, groupInfo, rect, direction, rightToLeft)
	            };
	        }
	
	        function getGroupContentRow_(key, rowIndex, rect, groupInfo, rightToLeft, additionalCSSClass, additionalStyle) {
	            var scope = this;
	
	            return {
	                key: key,
	                isRowRole: true,
	                renderInfo: getGroupRowRenderInfo_.call(scope, rowIndex, groupInfo, rect, rightToLeft, additionalCSSClass, additionalStyle)
	            };
	        }
	
	        function getGroupFooterRow_(key, currInfo, groupInfo, rect, direction, rightToLeft) {
	            var scope = this;
	            return {
	                key: key,
	                isRowRole: false,
	                renderInfo: getGroupFooterRenderInfo_.call(scope, currInfo.path, groupInfo, rect, direction, rightToLeft)
	            };
	        }
	
	        function getGroupHeaderRenderInfo_(groupPath, groupInfo, rect, direction, rightToLeft) {
	            var style;
	            if (rightToLeft) {
	                style = {
	                    top: rect.top,
	                    right: rect.left,
	                    height: rect.height,
	                    width: rect.width
	                };
	            } else {
	                style = {
	                    top: rect.top,
	                    left: rect.left,
	                    height: rect.height,
	                    width: rect.width
	                };
	            }
	            var width = direction === VERTICAL ? rect.height : rect.width;
	            return {
	                cssClass: 'gc-row g' + groupPath.join('_'),
	                style: style,
	                renderedHTML: renderGroupHeader_.call(this, groupInfo, width)
	            };
	        }
	
	        function renderGroupHeader_(groupInfo, width) {
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
	
	            return doT.template(getGroupHeaderTemplate_.call(self, group, width), null, null, true)(data);
	        }
	
	        function getGroupHeaderTemplate_(group, width) {
	            var scope = this;
	            var height = scope.getGroupHeaderHeight_(group);
	            var direction = scope.options.direction;
	            var rightToLeft = scope.options.rightToLeft;
	            //TODO: preprocess user given header template, add height
	            var defaultTemplate;
	            if (direction === VERTICAL) {
	                if (rightToLeft) {
	                    defaultTemplate = '<div class="gc-group-header-cell gc-group-header gc-group-header-v-rtl" style="right:' + height + 'px;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;">' +
	                        '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-right:{{=it.margin}}px;"></span>&nbsp<span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                        '</div>';
	                } else {
	                    defaultTemplate = '<div class="gc-group-header-cell gc-group-header gc-group-header-v" style="left:' + height + 'px;width:' + width + 'px;height:' + height + 'px;line-height:' + height + 'px;">' +
	                        '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-left:{{=it.margin}}px;"></span>&nbsp<span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                        '</div>';
	                }
	            } else {
	                if (rightToLeft) {
	                    defaultTemplate = '<div class="gc-group-header gc-group-header-cell" style="height:' + height + 'px;line-height:' + height + 'px;">' +
	                        '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-right:{{=it.margin}}px;"></span>&nbsp<span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                        '</div>';
	                } else {
	                    defaultTemplate = '<div class="gc-group-header gc-group-header-cell " style="height:' + height + 'px;line-height:' + height + 'px;">' +
	                        '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-left:{{=it.margin}}px;"></span>&nbsp<span level="{{=it.level}}">{{=it.condition}}: {{=it.name}}<span> ({{=it.count}})</span></span>' +
	                        '</div>';
	                }
	            }
	            return group.groupDescriptor.header.template || defaultTemplate;
	        }
	
	        function getGroupRowRenderInfo_(index, groupInfo, rect, rightToLeft, additionalCSSClass, additionalStyle) {
	            var self = this;
	            var style;
	            if (rightToLeft) {
	                style = {
	                    top: rect.top,
	                    right: rect.left,
	                    height: rect.height,
	                    width: rect.width,
	                    overflow: 'hidden'
	                };
	            } else {
	                style = {
	                    top: rect.top,
	                    left: rect.left,
	                    height: rect.height,
	                    width: rect.width,
	                    overflow: 'hidden'
	                };
	            }
	            style = additionalStyle ? _.assign(additionalStyle, style) : style;
	            return {
	                cssClass: 'gc-row' + (additionalCSSClass ? (' ' + additionalCSSClass) : ''),
	                style: style,
	                renderedHTML: self.getRowTemplate()(self.grid.formatDataItem(groupInfo.data.getItem(index)))
	            };
	        }
	
	        //TODO: how to handle group footer in card layoutEngine
	        function getGroupFooterRenderInfo_(groupPath, groupInfo, rect, direction, rightToLeft) {
	            var style;
	            if (rightToLeft) {
	                style = {
	                    top: rect.top,
	                    right: rect.left,
	                    height: rect.height,
	                    width: rect.width
	                };
	            } else {
	                style = {
	                    top: rect.top,
	                    left: rect.left,
	                    height: rect.height,
	                    width: rect.width
	                };
	            }
	            //var width = direction === VERTICAL ? rect.height : rect.width;
	            return {
	                cssClass: 'gc-row g' + groupPath.join('_'),
	                style: style,
	                renderedHTML: '<div></div>'
	            };
	        }
	
	        function overlaps_(range1, range2) {
	            return range1.end > range2.start && range2.end > range1.start;
	        }
	
	        function contains1d_(range, position) {
	            return (range.end > position && position >= range.start);
	        }
	
	        function contains2d_(rect, point, enlarge) {
	            var self = this;
	            var enlargeLength = (enlarge && self.grid.isTouchMode) ? 10 : 0;
	            var left = rect.left - enlargeLength;
	            var right = rect.left + rect.width + enlargeLength;
	            var top = rect.top - enlargeLength;
	            var bottom = rect.top + rect.height + enlargeLength;
	
	            return point.left >= left && point.top >= top && point.left < right && point.top < bottom;
	        }
	
	        //TODO refactor the render process. kill these redundant functions
	        function getStartEndIndexAt_(offset) {
	            //assuming all cards have the same size
	            var scope = this;
	            var options = scope.options;
	            var layoutInfo = scope.getLayoutInfo()[VIEWPORT];
	            var dataLength = scope.grid.data.itemCount;
	            var startCoordinate;
	            var endCoordinate;
	            var startIndex;
	            var endIndex;
	            var cardCountInAssistDirection = layoutInfo.cardCountInAssistDirection;
	
	            if (options.direction === VERTICAL) {
	                if (options.rightToLeft) {
	                    startCoordinate = layoutInfo.contentWidth - offset.left - layoutInfo.width;
	                    endCoordinate = layoutInfo.contentWidth - offset.left;
	                } else {
	                    startCoordinate = offset.left;
	                    endCoordinate = offset.left + layoutInfo.width;
	                }
	                startIndex = Math.floor(startCoordinate / options.cardWidth);
	                endIndex = Math.floor(endCoordinate / options.cardWidth);
	                startIndex = Math.max(startIndex * cardCountInAssistDirection, 0);
	                endIndex = Math.min((endIndex + 1) * cardCountInAssistDirection, dataLength);
	            } else {
	                startCoordinate = offset.top;
	                endCoordinate = offset.top + layoutInfo.height;
	                startIndex = Math.floor(startCoordinate / options.cardHeight);
	                endIndex = Math.floor(endCoordinate / options.cardHeight);
	                startIndex = Math.max(startIndex * cardCountInAssistDirection, 0);
	                endIndex = Math.min((endIndex + 1) * cardCountInAssistDirection, dataLength);
	            }
	
	            return {
	                start: startIndex,
	                end: endIndex
	            };
	        }
	
	        function getTemplate_() {
	            var self = this;
	            var grid = self.grid;
	            if (self.rowTemplateFn_) {
	                return self.rowTemplateFn_;
	            }
	            var templateStr = getRawRowTemplate_.call(self);
	            var oldColTmpl;
	            var newColTmpl;
	            var id;
	            var cssName;
	            var tagName;
	            var colTmpl;
	            var colAnnotation;
	
	            var element = domUtil.createTemplateElement(templateStr);
	            //Different browsers may return different innerHTMLs compared with the original HTML,
	            //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	            templateStr = domUtil.getElementInnerText(element);
	
	            var annotationCols = element.querySelectorAll('[data-column]');
	            _.each(annotationCols, function(annotationCol, index) {
	                var col = grid.getColById_(annotationCol.getAttribute('data-column'));
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
	                                temp.push(grid.getColById_(dataField).presenter || '{{=it.' + col.dataField + '}}');
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
	                    '<div style="height:100%;" class="' + cssName + ' ' + id + '"' + ' role="gridcell">' +
	                    colAnnotation + '</div></' + tagName + '>';
	
	                //outerHTML returns double quotes in attribute sometimes
	                if (templateStr.indexOf(oldColTmpl) === -1) {
	                    oldColTmpl = oldColTmpl.replace(/"/g, '\'');
	                }
	                templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	            });
	
	            self.rowTemplateFn_ = doT.template(templateStr, null, null, true);
	            return self.rowTemplateFn_;
	        }
	
	        function hasGroup_(grid) {
	            return !!grid.data.groups;
	        }
	
	        function handleMouseWheel(sender, e) {
	            var grid = sender;
	            var layoutInfo;
	            var layoutEngine = grid.layoutEngine;
	            var hasScrollBar = layoutEngine.hasScrollBar_();
	            if (!layoutEngine.options.showScrollBar) {
	                return;
	            }
	
	            var offsetDelta = e.deltaY;
	
	            //simulate scroll
	            if (layoutEngine.options.direction !== VERTICAL && hasScrollBar.vertical) {
	                if (offsetDelta !== 0) {
	                    layoutInfo = layoutEngine.getLayoutInfo()[VIEWPORT];
	                    var maxOffsetTop = Math.max(layoutInfo.contentHeight - layoutInfo.height, 0);
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
	
	            } else if (hasScrollBar.horizontal) {
	                if (offsetDelta !== 0) {
	                    layoutInfo = layoutEngine.getLayoutInfo()[VIEWPORT];
	                    var maxOffsetLeft = Math.max(layoutInfo.contentWidth - layoutInfo.width, 0);
	                    var offsetLeft = grid.scrollOffset.left;
	                    var scrollLeft;
	                    if (offsetDelta > 0) {
	                        if (offsetLeft >= maxOffsetLeft) {
	                            return;
	                        } else {
	                            scrollLeft = Math.min(offsetLeft + offsetDelta, maxOffsetLeft);
	                        }
	                    } else if (offsetDelta < 0) {
	                        if (offsetLeft === 0) {
	                            return;
	                        } else {
	                            scrollLeft = Math.max(offsetLeft + offsetDelta, 0);
	                        }
	                    }
	                    domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel').scrollLeft = scrollLeft;
	                }
	                e.preventDefault();
	
	            }
	        }
	
	        function handleMouseClick(sender, e) {
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
	                        grid.invalidate();
	                    }
	                }
	            }
	        }
	
	        function handleTouchTap(sender, e) {
	            handleMouseClick(sender, e, true);
	        }
	
	        module.exports = CardLayoutEngine;
	    }()
	)
	;


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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKioqIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1ZDIzMmU3MTk0ZDhmMzBiOGU1NT9lNjJlKioqKiIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2xheW91dEVuZ2luZXMvQ2FyZExheW91dEVuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanM/YzgyZCoqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanM/NDkyOCoqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzP2QwY2QqKioqIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsNkRBQTZELGlGQUFpRix1R0FBdUc7QUFDaFMsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUEyQztBQUMzQyxvREFBbUQ7QUFDbkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7QUFDTDtBQUNBOzs7Ozs7O0FDanNEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQix5Q0FBd0MsS0FBSyxXQUFXLFVBQVU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1QjtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQyxnQkFBZ0I7QUFDbkQ7QUFDQSx3Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEM7QUFDMUMsa0JBQWlCO0FBQ2pCLHNDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1FQUFrRTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCLGlEQUFnRDtBQUNoRCxtREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBeUMsZUFBZTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUF5RDtBQUN6RCxVQUFTO0FBQ1Q7O0FBRUEsdUVBQXNFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUM3ekJEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QixFQUFFLFlBQVksTUFBTSxFQUFFO0FBQy9DLDZCQUE0QixFQUFFLGFBQWEsRUFBRTtBQUM3Qyx3QkFBdUIsRUFBRSxhQUFhLEVBQUU7QUFDeEMscUJBQW9CLEVBQUUsYUFBYSxFQUFFO0FBQ3JDLHNIQUFxSCxJQUFJLElBQUk7QUFDN0gsd0JBQXVCLEVBQUUscUNBQXFDLEVBQUU7QUFDaEU7QUFDQSw2QkFBNEIsRUFBRSx5QkFBeUIsRUFBRTtBQUN6RCx5QkFBd0IsRUFBRSxTQUFTLEVBQUUscURBQXFELEVBQUU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLGdDQUErQixXQUFXLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxFQUFFO0FBQ2xILHNFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCwwQkFBeUIsWUFBWTtBQUNyQyxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQix1REFBdUQ7QUFDeEUsaUJBQWdCLFVBQVUsaUJBQWlCLHlCQUF5QjtBQUNwRSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QztBQUN6QywwQkFBeUI7QUFDekI7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1RUFBc0U7O0FBRXRFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsaUNBQWdDLGdDQUFnQyxjQUFjLEtBQUs7QUFDbkYsZ0NBQStCLDJCQUEyQixjQUFjO0FBQ3hFLGNBQWE7QUFDYjtBQUNBLDBDQUF5QyxFQUFFO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixtQ0FBbUMsbUJBQW1CLHVFQUF1RSxpQ0FBaUM7QUFDekwsaUVBQWdFO0FBQ2hFLGNBQWE7QUFDYjtBQUNBLDJCQUEwQjtBQUMxQixjQUFhO0FBQ2IsY0FBYSxXQUFXO0FBQ3hCO0FBQ0EsNEJBQTJCLEdBQUcsS0FBSyxVQUFVO0FBQzdDLDBCQUF5QixHQUFHLEtBQUs7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLDRGQUEyRjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7QUFFRDs7Ozs7OztBQ3pLQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsNEJBQTRCLE9BQU8sd0NBQXdDLE1BQU07QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdEQUErQyxzQkFBc0Isc0JBQXNCO0FBQzNGOztBQUVBO0FBQ0EsZ0RBQStDLHNCQUFzQixzQkFBc0I7QUFDM0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxRQUFRO0FBQ3ZCLGdCQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkIsZ0JBQWUsT0FBTztBQUN0QixnQkFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxRQUFRO0FBQ3ZCLGlCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQSw0QkFBMkIsR0FBRztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsUUFBUTtBQUN2QixnQkFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0VBQXVFLGNBQWMsZUFBZSxhQUFhLGNBQWMsaUJBQWlCO0FBQ2hKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkNhcmRMYXlvdXRFbmdpbmVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiR2NTcHJlYWRcIl0gPSByb290W1wiR2NTcHJlYWRcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdW1wiQ2FyZExheW91dEVuZ2luZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDVkMjMyZTcxOTRkOGYzMGI4ZTU1XG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgdmFyIGdjVXRpbHMgPSByZXF1aXJlKCcuLi9nY1V0aWxzJyk7XG4gICAgICAgIHZhciBkb1QgPSByZXF1aXJlKCcuLi9kb1QuanMnKTtcbiAgICAgICAgdmFyIGRvbVV0aWwgPSByZXF1aXJlKCcuLi9kb21VdGlsJyk7XG5cbiAgICAgICAgdmFyIFBPU19BQlMgPSAnYWJzb2x1dGUnO1xuICAgICAgICB2YXIgUE9TX1JFTCA9ICdyZWxhdGl2ZSc7XG4gICAgICAgIHZhciBPVkVSRkxPV19ISURERU4gPSAnaGlkZGVuJztcbiAgICAgICAgdmFyIE9WRVJGTE9XX0FVVE8gPSAnYXV0byc7XG4gICAgICAgIHZhciBWSUVXUE9SVCA9ICd2aWV3cG9ydCc7XG4gICAgICAgIHZhciBIT1JJWk9OVEFMID0gJ2hvcml6b250YWwnO1xuICAgICAgICB2YXIgVkVSVElDQUwgPSAndmVydGljYWwnO1xuICAgICAgICB2YXIgUlRMX0NMQVNTX05BTUUgPSAnZ2MtcnRsJztcbiAgICAgICAgdmFyIEdST1VQX0hFQURFUiA9ICdncm91cEhlYWRlcic7XG4gICAgICAgIHZhciBHUk9VUF9GT09URVIgPSAnZ3JvdXBGb290ZXInO1xuICAgICAgICB2YXIgR1JPVVBfQ09OVEVOVCA9ICdncm91cENvbnRlbnQnO1xuICAgICAgICB2YXIgREVGQVVMVF9IRUFERVJfSEVJR0hUID0gNDA7XG4gICAgICAgIHZhciBHUk9VUF9JTkRFTlQgPSAxODtcblxuICAgICAgICB2YXIgQ2FyZExheW91dEVuZ2luZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25EZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBjYXJkSGVpZ2h0OiAyNTYsXG4gICAgICAgICAgICAgICAgY2FyZFdpZHRoOiAyNTYsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBIT1JJWk9OVEFMLFxuICAgICAgICAgICAgICAgIHNob3dTY3JvbGxCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgcmlnaHRUb0xlZnQ6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5sYXlvdXRJbmZvXyA9IG51bGw7XG5cbiAgICAgICAgICAgIHNlbGYubmFtZSA9ICdDYXJkTGF5b3V0RW5naW5lJzsgLy9uYW1lIG11c3QgZW5kIHdpdGggTGF5b3V0RW5naW5lXG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIG9wdGlvbkRlZmF1bHRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBDYXJkTGF5b3V0RW5naW5lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGdldENvbHVtbkRlZmF1bHRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dTb3J0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dFZGl0aW5nOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbihncmlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkID0gZ3JpZDtcbiAgICAgICAgICAgICAgICBncmlkLmNvbHVtbnMgPSBfLm1hcChncmlkLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhjb2wsIF8uZGVmYXVsdHMoc2VsZi5nZXRDb2x1bW5EZWZhdWx0c18oKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNvbC5kYXRhRmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0aW9uOiBjb2wuZGF0YUZpZWxkXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0TGF5b3V0SW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdyb3VwU3RyYXRlZ3lfLmdldExheW91dEluZm8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYubGF5b3V0SW5mb18gfHwgKHNlbGYubGF5b3V0SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3cG9ydDogZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXy5jYWxsKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY2xlYXJSZW5kZXJDYWNoZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdyb3VwU3RyYXRlZ3lfLmNsZWFyUmVuZGVyQ2FjaGVfKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYucm93VGVtcGxhdGVGbl8gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuaGFzU2Nyb2xsQmFyc18gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmNhY2hlZENvbnRhaW5lclNpemVXaXRoU2Nyb2xsQmFyXyA9IG51bGw7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRSZW5kZXJJbmZvOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlckluZm8ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlUm93cyA9IG9wdGlvbnMuaW5jbHVkZVJvd3MgfHwgdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgYXJlYSA9IChvcHRpb25zICYmIG9wdGlvbnMuYXJlYSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNjb3BlLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZU9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBsYXlvdXRFbmdpbmVPcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBsYXlvdXRFbmdpbmVPcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGxheW91dEluZm8ud2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGxheW91dEluZm8uaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciByO1xuICAgICAgICAgICAgICAgIHZhciBoYXNTY3JvbGxCYXJzID0gc2NvcGUuaGFzU2Nyb2xsQmFyXygpO1xuICAgICAgICAgICAgICAgIHZhciBvdXRlckRpdkxlZnQgPSByaWdodFRvTGVmdCAmJiBoYXNTY3JvbGxCYXJzLnZlcnRpY2FsID8gbGF5b3V0SW5mby5sZWZ0ICsgZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGggOiBsYXlvdXRJbmZvLmxlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIGlubmVyRGl2TGVmdCA9IHJpZ2h0VG9MZWZ0ICYmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSA/IGxheW91dEluZm8uY29udGVudFdpZHRoIC0gb3B0aW9ucy5vZmZzZXRMZWZ0IC0gd2lkdGggOiAtb3B0aW9ucy5vZmZzZXRMZWZ0O1xuXG4gICAgICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLXZpZXdwb3J0JyArIChyaWdodFRvTGVmdCA/ICcgJyArIFJUTF9DTEFTU19OQU1FIDogJycpLFxuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogbGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBvdXRlckRpdkxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19ISURERU5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dEluZm8uY29udGVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbm5lckRpdlRyYW5zbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaW5uZXJEaXZMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3BcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGluY2x1ZGVSb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gZ2V0UmVuZGVySW5mb0ludGVybmFsXy5jYWxsKHNjb3BlLCBkaXJlY3Rpb24sIGxheW91dEluZm8sIG9wdGlvbnMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRSZW5kZXJSYW5nZV86IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZ3JvdXBTdHJhdGVneV8uZ2V0UmVuZGVyUmFuZ2VfKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBhcmVhID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hcmVhKSB8fCAnJztcbiAgICAgICAgICAgICAgICBpZiAoIWFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFJvd3NSZW5kZXJSYW5nZV8uY2FsbChzY29wZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRSZW5kZXJSb3dJbmZvXzogZnVuY3Rpb24ocm93LCBhcmVhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlclJvd0luZm9fKHJvdywgYXJlYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuZ3JpZC5kYXRhLmdyb3Vwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IHJvdy5pbmZvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBJbmZvID0gZ3JpZC5nZXRHcm91cEluZm9fKGluZm8ucGF0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBvcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gcm93LmtleTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSByb3cuYm91bmRzO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwSGVhZGVyUm93Xy5jYWxsKHNjb3BlLCBrZXksIGluZm8sIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5mby5hcmVhID09PSBHUk9VUF9DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0R3JvdXBDb250ZW50Um93Xy5jYWxsKHNjb3BlLCBrZXksIHJvdy5pbmRleCwgcmVjdCwgZ3JvdXBJbmZvLCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0R3JvdXBGb290ZXJSb3dfLmNhbGwoc2NvcGUsIGtleSwgaW5mbywgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRSZW5kZXJSb3dJbmZvSW50ZXJuYWwuY2FsbChzY29wZSwgcm93LmtleSwgcm93LnN0eWxlLCByb3cuaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFJvd1RlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VGVtcGxhdGVfLmNhbGwodGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2hvd1Njcm9sbFBhbmVsOiBmdW5jdGlvbihhcmVhKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdyb3VwU3RyYXRlZ3lfLnNob3dTY3JvbGxQYW5lbChhcmVhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLm9wdGlvbnMuc2hvd1Njcm9sbEJhcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhcmVhLnRvTG93ZXJDYXNlKCkgPT09IFZJRVdQT1JUKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGF5b3V0SW5mby5oZWlnaHQgPCBsYXlvdXRJbmZvLmNvbnRlbnRIZWlnaHQgfHwgbGF5b3V0SW5mby53aWR0aCA8IGxheW91dEluZm8uY29udGVudFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc1Njcm9sbGFibGVBcmVhXzogZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5pc1Njcm9sbGFibGVBcmVhXyhhcmVhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYXJlYS50b0xvd2VyQ2FzZSgpID09PSBWSUVXUE9SVDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFNjcm9sbFBhbmVsUmVuZGVySW5mbzogZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5nZXRTY3JvbGxQYW5lbFJlbmRlckluZm8oYXJlYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhcmVhLnRvTG93ZXJDYXNlKCkgPT09IFZJRVdQT1JUKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3cG9ydExheW91dCA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1Njcm9sbEJhciA9IHNlbGYuaGFzU2Nyb2xsQmFyXygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsIHNjcm9sbC1sZWZ0IHNjcm9sbC10b3AnICsgKHNlbGYub3B0aW9ucy5yaWdodFRvTGVmdCA/ICcgJyArIFJUTF9DTEFTU19OQU1FIDogJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnRMYXlvdXQuaGVpZ2h0ICsgKGhhc1Njcm9sbEJhci5ob3Jpem9udGFsID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IDogMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZpZXdwb3J0TGF5b3V0LndpZHRoICsgKGhhc1Njcm9sbEJhci52ZXJ0aWNhbCA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoIDogMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0FVVE9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19SRUwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2aWV3cG9ydExheW91dC5jb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC5jb250ZW50V2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYXNTY3JvbGxCYXJfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNTY3JvbGxCYXJzXykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuaGFzU2Nyb2xsQmFyc187XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IGxheW91dEluZm8uaGVpZ2h0IDwgbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogbGF5b3V0SW5mby53aWR0aCA8IGxheW91dEluZm8uY29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0R3JvdXBJbmZvRGVmYXVsdHNfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncm91cFN0cmF0ZWd5Xy5nZXRHcm91cEluZm9EZWZhdWx0c18oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlV2l0aEdyb3VwOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldEluaXRpYWxTY3JvbGxPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gdGhpcy5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBvcHRpb25zLnJpZ2h0VG9MZWZ0ICYmIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gVkVSVElDQUwpID8gbGF5b3V0SW5mby5jb250ZW50V2lkdGggLSBsYXlvdXRJbmZvLndpZHRoIDogMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbml0R3JvdXBJbmZvc0hlaWdodF86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5pbml0R3JvdXBJbmZvc0hlaWdodF8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBzZWxmLmdyaWQuZ3JvdXBJbmZvc187XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cEluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3NbaV0uaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEhlaWdodF8oZ3JvdXBJbmZvc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0R3JvdXBIZWlnaHRfOiBmdW5jdGlvbihncm91cEluZm8pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFncm91cEluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZ2NVdGlscy5pc1VuZGVmaW5lZChncm91cEluZm8uaGVpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBzaWRlTGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyICYmIGhlYWRlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGggKz0gc2NvcGUuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyU2l6ZSA9IGdldENvbnRhaW5lclNpemVXaXRoU2Nyb2xsQmFyXy5jYWxsKHNjb3BlKTtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRHcm91cDtcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID0gTWF0aC5mbG9vcihjb250YWluZXJTaXplLndpZHRoIC8gb3B0aW9ucy5jYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICBsZW4gPSBncm91cC5pc0JvdHRvbUxldmVsID8gZ3JvdXAuaXRlbUNvdW50IDogZ3JvdXBJbmZvLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGggKz0gTWF0aC5jZWlsKGxlbiAvIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uKSAqIHNjb3BlLmdldFJvd0hlaWdodF8oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR3JvdXAgPSBncm91cEluZm8uY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHcm91cC5oZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlaWdodF8oY2hpbGRHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkZUxlbmd0aCArPSBjaGlsZEdyb3VwLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaWRlTGVuZ3RoICs9IHNjb3BlLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvb3RlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlICYmICFmb290ZXIuY29sbGFwc2VXaXRoR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGggKz0gc2NvcGUuZ2V0R3JvdXBGb290ZXJIZWlnaHRfKGdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc2lkZUxlbmd0aDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXBTdHJhdGVneV8uaGFuZGxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oVklFV1BPUlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGhpdFRlc3Q6IGZ1bmN0aW9uKGV2ZW50QXJncykge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5ncm91cFN0cmF0ZWd5Xy5oaXRUZXN0KGV2ZW50QXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gZXZlbnRBcmdzLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHZhciB0b3AgPSBldmVudEFyZ3MucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICAgICAgICAgIC8vZ2V0IGNvbnRhaW5lciBwYWRkaW5nIGFuZCBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXJJbmZvID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gbGVmdCAtIGNvbnRhaW5lckluZm8ubGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gdG9wIC0gY29udGFpbmVySW5mby50b3A7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IG9mZnNldFRvcFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50V2lkdGggPSBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciByaWdodFRvTGVmdCA9IG9wdGlvbnMucmlnaHRUb0xlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRXaWR0aCA9IG9wdGlvbnMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSGVpZ2h0ID0gb3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiBudWxsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICB2YXIgbGVuO1xuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgaW5Db250ZW50UmVsYXRpdmVMZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBncm91cEluZm9zID0gZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgICAgICAgICB2YXIgaGVhZGVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBncm91cEhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICAgICAgICAgIHZhciBncm91cDtcbiAgICAgICAgICAgICAgICB2YXIgcm93O1xuICAgICAgICAgICAgICAgIC8vaWYgdmlld3BvcnRcbiAgICAgICAgICAgICAgICB2YXIgaW5WaWV3UG9ydDtcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBIT1JJWk9OVEFMICYmIHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGxCYXJXaWR0aCA9IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpblZpZXdQb3J0ID0gY29udGFpbnMyZF8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbGF5b3V0SW5mby5sZWZ0ICsgc2Nyb2xsQmFyV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGxheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGxheW91dEluZm8ud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dEluZm8uaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0sIHBvaW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpblZpZXdQb3J0ID0gY29udGFpbnMyZF8obGF5b3V0SW5mbywgcG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5WaWV3UG9ydCkge1xuICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mby5hcmVhID0gVklFV1BPUlQ7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgKz0gZ3JpZC5zY3JvbGxPZmZzZXQubGVmdCAtIGxheW91dEluZm8ubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wICs9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcCAtIGxheW91dEluZm8udG9wO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSByaWdodFRvTGVmdCA/IGNvbnRlbnRXaWR0aCAtIG9mZnNldExlZnQgLSBncmlkLnNjcm9sbE9mZnNldC5sZWZ0IDogb2Zmc2V0TGVmdCArIGdyaWQuc2Nyb2xsT2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBvZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncm91cEluZm9zIHx8IGdyb3VwSW5mb3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluQ29udGVudFJlbGF0aXZlTGVmdCA9IG9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKGhlaWdodCAvIGNhcmRXaWR0aCkgKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiArIE1hdGguZmxvb3IoaW5Db250ZW50UmVsYXRpdmVMZWZ0IC8gY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluQ29udGVudFJlbGF0aXZlTGVmdCA9IHJpZ2h0VG9MZWZ0ID8gbGF5b3V0SW5mby53aWR0aCAtIG9mZnNldExlZnQgOiBvZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gY2FyZEhlaWdodCkgKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiArIE1hdGguZmxvb3IoaW5Db250ZW50UmVsYXRpdmVMZWZ0IC8gY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPj0gZ3JpZC5kYXRhLml0ZW1Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8ucm93ID0gcm93O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyb3VwSW5mb3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSGVpZ2h0ID0gZ3JvdXBJbmZvLmNvbGxhcHNlZCA/IChoZWFkZXJIZWlnaHQgKyAoZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmZvb3Rlci5jb2xsYXBzZVdpdGhHcm91cCA/IDAgOiBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXApKSkgOiBncm91cEluZm8uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPCBncm91cEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEdyb3VwXy5jYWxsKHNjb3BlLCBncm91cEluZm8sIG9mZnNldExlZnQsIG9mZnNldFRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCAtPSBncm91cEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEluZm87XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ncm91cFN0cmF0ZWd5Xy5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLmdyb3VwU3RyYXRlZ3lfO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudW5SZWdpc3RlRXZlbnRzXygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBqc29uT2JqID0ge307XG4gICAgICAgICAgICAgICAganNvbk9iai5uYW1lID0gc2VsZi5uYW1lO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkT3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNhcmRIZWlnaHQgIT09IDI1Nikge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5jYXJkSGVpZ2h0ID0gb3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jYXJkV2lkdGggIT09IDI1Nikge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5jYXJkV2lkdGggPSBvcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aW9uICE9PSBIT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRPcHRpb25zLmRpcmVjdGlvbiA9IG9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zaG93U2Nyb2xsQmFyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRPcHRpb25zLnNob3dTY3JvbGxCYXIgPSBvcHRpb25zLnNob3dTY3JvbGxCYXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnJpZ2h0VG9MZWZ0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5yaWdodFRvTGVmdCA9IG9wdGlvbnMucmlnaHRUb0xlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnJvd1RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRPcHRpb25zLnJvd1RlbXBsYXRlID0gZ2V0UmF3Um93VGVtcGxhdGVfLmNhbGwoc2VsZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmdyb3VwU3RyYXRlZ3kpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZE9wdGlvbnMuZ3JvdXBTdHJhdGVneSA9IG9wdGlvbnMuZ3JvdXBTdHJhdGVneS50b0pTT04oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkoY2FyZE9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGpzb25PYmoub3B0aW9ucyA9IGNhcmRPcHRpb25zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbk9iajtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldElubmVyR3JvdXBIZWlnaHQ6IGZ1bmN0aW9uKGdyb3VwSW5mbywgY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGdyb3VwSW5mby5kYXRhLml0ZW1Db3VudCAvIE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKSkgKiBzZWxmLmdldFJvd0hlaWdodF8oKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldElubmVyR3JvdXBSZW5kZXJJbmZvOiBmdW5jdGlvbihncm91cEluZm8sIGNvbnRhaW5lclNpemUsIGxheW91dENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IG9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSA/IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpIDogTWF0aC5mbG9vcihjb250YWluZXJTaXplLndpZHRoIC8gb3B0aW9ucy5jYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICAgICAgdmFyIHJvd0hlaWdodCA9IHNlbGYuZ2V0Um93SGVpZ2h0XygpO1xuICAgICAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGxheW91dDtcbiAgICAgICAgICAgICAgICB2YXIgYWRkaXRpb25hbFN0eWxlO1xuICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsQ1NTQ2xhc3M7XG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlclJlY3Q7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRXaWR0aCA9IG9wdGlvbnMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwLml0ZW1Db3VudDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXlvdXRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0ID0gbGF5b3V0Q2FsbGJhY2soZ3JvdXBJbmZvLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDU1NDbGFzcyA9IGxheW91dC5jc3NDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTdHlsZSA9IGxheW91dC5zdHlsZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTdHlsZS53aWR0aCA9IG9wdGlvbnMuaXRlbVdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheW91dEJvdW5kID0gbGF5b3V0LmxvY2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxheW91dEJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBsYXlvdXRCb3VuZC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxheW91dEJvdW5kLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldFJlbmRlcmVkR3JvdXBDb250ZW50SXRlbUluZm9fLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCBpLCByZW5kZXJSZWN0LCBmYWxzZSwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gKGkgJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAqIGNhcmRIZWlnaHQpIDogc3RhcnRQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IHN0YXJ0UG9zaXRpb24gOiAoaSAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZFdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgaSwgcmVuZGVyUmVjdCwgZmFsc2UsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9PT0gY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gKz0gcm93SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxTdHlsZSA9IHt3aWR0aDogb3B0aW9ucy5pdGVtV2lkdGh9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyAoaSAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZEhlaWdodCkgOiBzdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBzdGFydFBvc2l0aW9uIDogKGkgJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAqIGNhcmRXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjYXJkV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBncm91cEluZm8sIGksIHJlbmRlclJlY3QsIGZhbHNlLCBudWxsLCBhZGRpdGlvbmFsU3R5bGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPT09IGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gKz0gcm93SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByb3dzO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0TWF4VmlzaWJsZUl0ZW1Db3VudDogZnVuY3Rpb24oY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXNQZXJSb3cgPSAob3B0aW9ucy5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gTWF0aC5mbG9vcihjb250YWluZXJTaXplLmhlaWdodCAvIG9wdGlvbnMuY2FyZEhlaWdodCkgOiBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUud2lkdGggLyBvcHRpb25zLmNhcmRXaWR0aCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtc1BlclJvdyAqICgob3B0aW9ucy5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSA/IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKSA6IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGhpdFRlc3RHcm91cENvbnRlbnRfOiBmdW5jdGlvbihncm91cEluZm8sIGFyZWEsIGxlZnQsIHRvcCwgY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmVhICE9PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zUGVyUm93ID0gKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpID8gTWF0aC5mbG9vcihjb250YWluZXJTaXplLmhlaWdodCAvIGNhcmRIZWlnaHQpIDogTWF0aC5mbG9vcihjb250YWluZXJTaXplLndpZHRoIC8gY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gLTE7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcihsZWZ0IC8gY2FyZFdpZHRoKSAqIGl0ZW1zUGVyUm93ICsgTWF0aC5mbG9vcih0b3AgLyBjYXJkSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKHRvcCAvIGNhcmRIZWlnaHQpICogaXRlbXNQZXJSb3cgKyBNYXRoLmZsb29yKGxlZnQgLyBjYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm93ID49IGdyb3VwLml0ZW1Db3VudCkge1xuICAgICAgICAgICAgICAgICAgICByb3cgPSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbjogLTEsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfQ09OVEVOVCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwSW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3csXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0Um93SGVpZ2h0XzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyB0aGlzLm9wdGlvbnMuY2FyZFdpZHRoIDogdGhpcy5vcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRHcm91cEhlYWRlckhlaWdodF86IGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5oZWFkZXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChoZWFkZXIgJiYgaGVhZGVyLnZpc2libGUpID8gKGhlYWRlci5oZWlnaHQgfHwgREVGQVVMVF9IRUFERVJfSEVJR0hUKSA6IDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRHcm91cEZvb3RlckhlaWdodF86IGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvb3RlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUpID8gKGZvb3Rlci5oZWlnaHQgfHwgREVGQVVMVF9IRUFERVJfSEVJR0hUKSA6IDA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZWdpc3RlRXZlbnRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuZ3JpZC5vbk1vdXNlV2hlZWwuYWRkSGFuZGxlcihoYW5kbGVNb3VzZVdoZWVsKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdyaWQub25Nb3VzZUNsaWNrLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VDbGljayk7XG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkLm9uVGFwXy5hZGRIYW5kbGVyKGhhbmRsZVRvdWNoVGFwKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHVuUmVnaXN0ZUV2ZW50c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLmdyaWQub25Nb3VzZVdoZWVsLnJlbW92ZUhhbmRsZXIoaGFuZGxlTW91c2VXaGVlbCk7XG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VDbGljay5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2spO1xuICAgICAgICAgICAgICAgIHNlbGYuZ3JpZC5vblRhcF8ucmVtb3ZlSGFuZGxlcihoYW5kbGVUb3VjaFRhcCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYW5kbGVUZW1wbGF0ZUNoYW5nZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY2FuRG9Td2lwZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNhblN0YXJ0U3dpcGVfOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhpdFRlc3RHcm91cF8oZ3JvdXBJbmZvLCBsZWZ0LCB0b3ApIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuO1xuICAgICAgICAgICAgdmFyIGNoaWxkO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9IHNlbGYuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJIZWlnaHQgPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICB2YXIgZ3JvdXBIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZ3JvdXBQYXRoID0gZ3JvdXBJbmZvLnBhdGg7XG4gICAgICAgICAgICB2YXIgdG9nZ2xlRWxlbWVudDtcbiAgICAgICAgICAgIHZhciBvbkV4cGFuZFRvZ2dsZTtcbiAgICAgICAgICAgIGlmICh0b3AgPCBoZWFkZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhlYWRlckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLmdyaWQudWlkICsgJy1naCcgKyBncm91cFBhdGguam9pbignXycpKTtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVFbGVtZW50ID0gaGVhZGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2MtZ3JvdXBpbmctdG9nZ2xlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVPZmZzZXQgPSBkb21VdGlsLm9mZnNldCh0b2dnbGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdCh0b2dnbGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRPZmZzZXQgPSBkb21VdGlsLm9mZnNldChoZWFkZXJFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zMmRfLmNhbGwoc2VsZiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGVsZU9mZnNldC5sZWZ0IC0gaGVhZGVyRWxlbWVudE9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogZWxlT2Zmc2V0LnRvcCAtIGhlYWRlckVsZW1lbnRPZmZzZXQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50UmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGVsZW1lbnRSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge2xlZnQ6IGxlZnQsIHRvcDogdG9wfSwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXhwYW5kVG9nZ2xlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZTogb25FeHBhbmRUb2dnbGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b3AgLT0gaGVhZGVySGVpZ2h0O1xuICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgaGl0VGVzdEluZm8gPSBzZWxmLmhpdFRlc3RHcm91cENvbnRlbnRfKGdyb3VwSW5mbywgVklFV1BPUlQsIGxlZnQsIHRvcCwge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0SW5mby5jb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFoaXRUZXN0SW5mbykgeyAvL211c3QgYmUgZm9vdGVyP1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9GT09URVJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGdyb3VwSW5mby5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBncm91cEhlaWdodCA9IGNoaWxkLmNvbGxhcHNlZCA/IChoZWFkZXJIZWlnaHQgKyAoZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwID8gMCA6IGZvb3RlckhlaWdodCkpIDogY2hpbGQuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDw9IGdyb3VwSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEdyb3VwXy5jYWxsKHNlbGYsIGNoaWxkcmVuW2ldLCBsZWZ0LCB0b3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRvcCAtPSBncm91cEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFJvd3NSZW5kZXJSYW5nZV8ob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBsYXlvdXRFbmdpbmVPcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBsYXlvdXRFbmdpbmVPcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciByZXZlcnNlID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdCAmJiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdDogcmV2ZXJzZSA/IGxheW91dEluZm8uY29udGVudFdpZHRoIC0gbGF5b3V0SW5mby53aWR0aCAtIG9wdGlvbnMub2Zmc2V0TGVmdCA6IC1vcHRpb25zLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBnZXRSZW5kZXJJbmZvSW50ZXJuYWxfLmNhbGwoc2NvcGUsIGRpcmVjdGlvbiwgbGF5b3V0SW5mbywgb3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSZW5kZXJJbmZvSW50ZXJuYWxfKGRpcmVjdGlvbiwgbGF5b3V0SW5mbywgb3B0aW9ucywgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHZpc2libGVSYW5nZSA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IG9wdGlvbnMub2Zmc2V0TGVmdCA6IG9wdGlvbnMub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIGVuZDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IG9wdGlvbnMub2Zmc2V0TGVmdCArIGxheW91dEluZm8ud2lkdGggOiBvcHRpb25zLm9mZnNldFRvcCArIGxheW91dEluZm8uaGVpZ2h0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUuZ3JpZC5kYXRhLmdyb3Vwcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEdyb3VwSXRlbXNJbmZvXy5jYWxsKHNjb3BlLCB2aXNpYmxlUmFuZ2UsIGdldFVwZGF0ZVJvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEl0ZW1zSW5mb18uY2FsbChzY29wZSwgdmlzaWJsZVJhbmdlLCBnZXRVcGRhdGVSb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzY29wZS5jYWNoZWRDb250YWluZXJTaXplV2l0aG91dFNjcm9sbEJhcl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lckluZm8gPSBzY29wZS5ncmlkLmdldENvbnRhaW5lckluZm9fKCk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IGNvbnRhaW5lckluZm8uY29udGVudFJlY3Q7XG5cbiAgICAgICAgICAgIHNjb3BlLmNhY2hlZENvbnRhaW5lclNpemVXaXRob3V0U2Nyb2xsQmFyXyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzY29wZS5jYWNoZWRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gc2NvcGUub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgc2hvd1Njcm9sbEJhciA9IHNjb3BlLm9wdGlvbnMuc2hvd1Njcm9sbEJhcjtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gY29udGFpbmVyU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBjb250YWluZXJTaXplLmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLmdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd1Njcm9sbEJhciAmJiAhaXNHcm91cEZpdFRoZUNvbnRhaW5lcl8uY2FsbChzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzaG93U2Nyb2xsQmFyICYmICFpc1VuZ3JvdXBlZEZpdFRoZUNvbnRhaW5lcl8uY2FsbChzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmNhY2hlZENvbnRhaW5lclNpemVXaXRoU2Nyb2xsQmFyXyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNHcm91cEZpdFRoZUNvbnRhaW5lcl8oKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHNjb3BlLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciByYXdDb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgdmFyIGhlaWdodFRocmVzaG9sZCA9IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyByYXdDb250YWluZXJTaXplLndpZHRoIDogcmF3Q29udGFpbmVyU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY3VyckhlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgZ3JvdXBzID0gc2NvcGUuZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbiA9IGdyb3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJySGVpZ2h0ICs9IGdldFRlc3RHcm91cEhlaWdodF8uY2FsbChzY29wZSwgZ3JvdXBzW2ldLCBoZWlnaHRUaHJlc2hvbGQsIDApO1xuICAgICAgICAgICAgICAgIGlmIChjdXJySGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJySGVpZ2h0IDw9IGhlaWdodFRocmVzaG9sZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzVW5ncm91cGVkRml0VGhlQ29udGFpbmVyXygpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGF0YUxlbmd0aCA9IGdyaWQuZGF0YS5pdGVtQ291bnQ7XG4gICAgICAgICAgICB2YXIgcmF3Q29udGFpbmVyU2l6ZSA9IGdldENvbnRhaW5lclNpemVXaXRob3V0U2Nyb2xsQmFyXy5jYWxsKHNjb3BlKTtcblxuICAgICAgICAgICAgdmFyIGNhcmRDb3VudEluQUNvbHVtbiA9IE1hdGguZmxvb3IocmF3Q29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgdmFyIGNhcmRDb3VudEluQVJvdyA9IE1hdGguZmxvb3IocmF3Q29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhcmRDb3VudEluQUNvbHVtbiAqIGNhcmRDb3VudEluQVJvdyA+PSBkYXRhTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVzdEdyb3VwSGVpZ2h0Xyhncm91cEluZm8sIGhlaWdodFRocmVzaG9sZCwgc3RhcnRQb3NpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciBmb290ZXI7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW47XG5cbiAgICAgICAgICAgIHZhciBjdXJyVG90YWxIZWlnaHQgPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKGN1cnJUb3RhbEhlaWdodCA+IGhlaWdodFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyVG90YWxIZWlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGdyb3VwRGVzID0gZ3JvdXBJbmZvLmdyb3VwRGVzY3JpcHRvcjtcbiAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwRGVzLmZvb3RlcjtcbiAgICAgICAgICAgIHZhciBoZWFkZXJIZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXBJbmZvKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJIZWlnaHQgPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvKTtcbiAgICAgICAgICAgIGN1cnJUb3RhbEhlaWdodCArPSBoZWFkZXJIZWlnaHQ7XG4gICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJUb3RhbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZ3JvdXBEZXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbiA9IGdyb3VwSW5mby5pdGVtQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJUb3RhbEhlaWdodCArPSBNYXRoLmNlaWwobGVuIC8gY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pICogc2NvcGUuZ2V0Um93SGVpZ2h0XygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyclRvdGFsSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gZ3JvdXBJbmZvLmdyb3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvdGFsSGVpZ2h0ID0gZ2V0VGVzdEdyb3VwSGVpZ2h0Xy5jYWxsKHNjb3BlLCBncm91cEluZm8uZ3JvdXBzW2ldLCBoZWlnaHRUaHJlc2hvbGQsIGN1cnJUb3RhbEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJUb3RhbEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyVG90YWxIZWlnaHQgKz0gZm9vdGVySGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlICYmICFmb290ZXIuY29sbGFwc2VXaXRoR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyclRvdGFsSGVpZ2h0ICs9IGZvb3RlckhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VyclRvdGFsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmF3Um93VGVtcGxhdGVfKCkge1xuICAgICAgICAgICAgdmFyIHJvd1RtcGwgPSB0aGlzLm9wdGlvbnMucm93VGVtcGxhdGU7XG4gICAgICAgICAgICBpZiAocm93VG1wbCkge1xuICAgICAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzU3RyaW5nKHJvd1RtcGwpICYmIHJvd1RtcGwubGVuZ3RoID4gMSAmJiByb3dUbXBsWzBdID09PSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocm93VG1wbC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0bXBsRWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvd1RtcGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXygpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjb2xzID0gc2VsZi5ncmlkLmNvbHVtbnM7XG4gICAgICAgICAgICB2YXIgdG90YWxWaXNpYmxlQ29scyA9IDA7XG4gICAgICAgICAgICBfLmVhY2goY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsVmlzaWJsZUNvbHMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpdGVtSGVpZ2h0ID0gTWF0aC5mbG9vcihzZWxmLm9wdGlvbnMuY2FyZEhlaWdodCAvIHRvdGFsVmlzaWJsZUNvbHMpO1xuXG4gICAgICAgICAgICB2YXIgciA9ICc8ZGl2Pic7XG4gICAgICAgICAgICBfLmVhY2goY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHIgKz0gJzxkaXYgY2xhc3M9XCJnYy1jb2x1bW5cIiBzdHlsZT1cInBvc2l0aW9uOnN0YXRpYzsnICsgKGNvbC52aXNpYmxlID8gKCdoZWlnaHQ6JyArIGl0ZW1IZWlnaHQgKyAncHg7JykgOiAnZGlzcGxheTpub25lOycpICsgJ1wiIGRhdGEtY29sdW1uPVwiJyArIGNvbC5pZCArICdcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgciArPSAnPC9kaXY+JztcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgY2FyZEhlaWdodCA9IG9wdGlvbnMuY2FyZEhlaWdodDtcbiAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBvcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjb250ZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbjtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8uY2FsbChzY29wZSk7XG4gICAgICAgICAgICB2YXIgY0hlaWdodCA9IGNvbnRhaW5lclNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGNXaWR0aCA9IGNvbnRhaW5lclNpemUud2lkdGg7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID0gTWF0aC5mbG9vcihjSGVpZ2h0IC8gY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgY29udGVudFdpZHRoID0gZ2V0Q29udGVudEhlaWdodF8oc2NvcGUuZ3JpZCwgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBjSGVpZ2h0O1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID0gTWF0aC5mbG9vcihjV2lkdGggLyBjYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBnZXRDb250ZW50SGVpZ2h0XyhzY29wZS5ncmlkLCBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29udGVudFdpZHRoID0gY1dpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogY1dpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogY0hlaWdodCxcbiAgICAgICAgICAgICAgICBjb250ZW50V2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0OiBjb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uOiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbnRlbnRIZWlnaHRfKGdyaWQsIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGdyaWQuZGF0YTtcbiAgICAgICAgICAgIGlmIChoYXNHcm91cF8oZ3JpZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5yZWR1Y2UoZ3JpZC5ncm91cEluZm9zXywgZnVuY3Rpb24oc3VtLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdW0gKyBpdGVtLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBncmlkLmxheW91dEVuZ2luZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IGRhdGEuaXRlbUNvdW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gTWF0aC5jZWlsKGxlbiAvIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uKSAqIGNhcmRXaWR0aCA6IE1hdGguY2VpbChsZW4gLyBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRJdGVtc0luZm9fKHZpc2libGVSYW5nZSwgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcblxuICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZU9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGxheW91dEVuZ2luZU9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBsYXlvdXRFbmdpbmVPcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjYXJkSGVpZ2h0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgdmFyIHN0YXJ0RW5kSW5kZXg7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBzdHlsZTtcbiAgICAgICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgICAgIC8vY2FsY3VsYXRlIHRoZSByZW5kZXIgcmFuZ2VzXG4gICAgICAgICAgICBzdGFydEVuZEluZGV4ID0gZ2V0U3RhcnRFbmRJbmRleEF0Xy5jYWxsKHNjb3BlLCB7dG9wOiB2aXNpYmxlUmFuZ2Uuc3RhcnQsIGxlZnQ6IHZpc2libGVSYW5nZS5zdGFydH0pO1xuXG4gICAgICAgICAgICAvL2dldCBjYXJkcyByZW5kZXIgaW5mb1xuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZFJvd0l0ZW07XG4gICAgICAgICAgICB2YXIgbGVmdENvb3JkaW5hdGU7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IHN0YXJ0RW5kSW5kZXguc3RhcnQ7IGkgPCBzdGFydEVuZEluZGV4LmVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFJvd0l0ZW0gPSBncmlkLmdldERhdGFJdGVtKGkpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0Q29vcmRpbmF0ZSA9IE1hdGguZmxvb3IoaSAvIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pICogY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogaSAlIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBsZWZ0Q29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogaSAlIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRDb29yZGluYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGdyaWQudWlkICsgJy1yJyArIGk7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChjcmVhdGVSb3dfLmNhbGwoc2NvcGUsIGtleSwgc3R5bGUsIGksIGdldFVwZGF0ZVJvdykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9kZWZhdWx0IGRpcmVjdGlvbiBpcyBob3Jpem9udGFsXG4gICAgICAgICAgICAgICAgZm9yIChpID0gc3RhcnRFbmRJbmRleC5zdGFydDsgaSA8IHN0YXJ0RW5kSW5kZXguZW5kOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBsZWZ0Q29vcmRpbmF0ZSA9IGkgJSBsYXlvdXRJbmZvLmNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogTWF0aC5mbG9vcihpIC8gbGF5b3V0SW5mby5jYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBsZWZ0Q29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogTWF0aC5mbG9vcihpIC8gbGF5b3V0SW5mby5jYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRDb29yZGluYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAga2V5ID0gZ3JpZC51aWQgKyAnLXInICsgaTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGNyZWF0ZVJvd18uY2FsbChzY29wZSwga2V5LCBzdHlsZSwgaSwgZ2V0VXBkYXRlUm93KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVSb3dfKGtleSwgc3R5bGUsIGluZGV4LCBnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFJlbmRlclJvd0luZm9JbnRlcm5hbC5jYWxsKHNjb3BlLCBrZXksIHN0eWxlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSZW5kZXJSb3dJbmZvSW50ZXJuYWwoa2V5LCBzdHlsZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkUm93SXRlbSA9IGdyaWQuZ2V0Rm9ybWF0dGVkRGF0YUl0ZW0oaW5kZXgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cgcicgKyBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHNjb3BlLmdldFJvd1RlbXBsYXRlKCkoZm9ybWF0dGVkUm93SXRlbSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18oZ3JvdXBJbmZvLCByb3dJbmRleCwgcmVuZGVyUmVjdCwgZ2V0VXBkYXRlUm93LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGtleSA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyByb3dJbmRleDtcblxuICAgICAgICAgICAgaWYgKGdldFVwZGF0ZVJvdykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogcm93SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kczogcmVuZGVyUmVjdCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvd0luZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwQ29udGVudFJvd18uY2FsbChzZWxmLCBrZXksIHJvd0luZGV4LCByZW5kZXJSZWN0LCBncm91cEluZm8sIHNlbGYub3B0aW9ucy5yaWdodFRvTGVmdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cEl0ZW1zSW5mb18odmlzaWJsZVJhbmdlLCBnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICAgICAgdmFyIGVudGlyZUdyb3VwSW5mb3MgPSBncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgc3RhcnRSZW5kZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBlbmRSZW5kZXJJdGVtID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZW5kUmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY3VyckluZm87XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIG1heEluZGV4ID0gMDtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBvcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICB2YXIgY29udGVudFdpZHRoID0gbGF5b3V0SW5mby5jb250ZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY29udGVudEhlaWdodCA9IGxheW91dEluZm8uY29udGVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZWN0O1xuICAgICAgICAgICAgdmFyIHJvd0luZGV4O1xuICAgICAgICAgICAgdmFyIHJldmVyc2UgPSByaWdodFRvTGVmdCAmJiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCk7XG4gICAgICAgICAgICB2YXIgd2luZG93UmFuZ2UgPSByZXZlcnNlID8ge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBjb250ZW50V2lkdGggLSB2aXNpYmxlUmFuZ2UuZW5kLFxuICAgICAgICAgICAgICAgIGVuZDogY29udGVudFdpZHRoIC0gdmlzaWJsZVJhbmdlLnN0YXJ0XG4gICAgICAgICAgICB9IDogdmlzaWJsZVJhbmdlO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRTdGFydFBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIHZhciBmb290ZXI7XG4gICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAgdmFyIHJlbmRlclJlY3Q7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbnRpcmVHcm91cEluZm9zLmxlbmd0aCAtIDE7IGkgPD0gbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncm91cEluZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBbaV0sXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NraXAgZ3JvdXBzLCBtaW5pbWl6ZSB0aGUgb3ZlcmxhcCBjb21wYXJlXG4gICAgICAgICAgICB3aGlsZSAoZ3JvdXBJbmZvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VyckluZm8gPSBncm91cEluZm9zWzBdO1xuICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBjdXJyZW50U3RhcnRQb3NpdGlvbiArIGdyb3VwSW5mby5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm9zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoZ3JvdXBJbmZvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VyckluZm8gPSBncm91cEluZm9zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JpZC5nZXRHcm91cEluZm9fKGN1cnJJbmZvLnBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJJbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXBJbmZvLmRhdGEuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlciAmJiBoZWFkZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gc2NvcGUuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwSW5mby5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3ZlcmxhcHNfKHdpbmRvd1JhbmdlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGN1cnJlbnRTdGFydFBvc2l0aW9uICsgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhcnRQb3NpdGlvbiArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNvbnRlbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyZW50U3RhcnRQb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJlbnRTdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGdyaWQudWlkICsgJy1naCcgKyBjdXJySW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm86IGN1cnJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzOiByZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRHcm91cEhlYWRlclJvd18uY2FsbChzY29wZSwga2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXJ0UG9zaXRpb24gKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29udGFpbnMxZF8od2luZG93UmFuZ2UsIGN1cnJlbnRTdGFydFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncmlkLmdldEdyb3VwSW5mb18oY3VyckluZm8ucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJvd0luZGV4ID0gY3VyckluZm8uaXRlbUluZGV4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBzY29wZS5nZXRSb3dIZWlnaHRfKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sIGVuZDogY3VycmVudFN0YXJ0UG9zaXRpb24gKyBoZWlnaHR9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUmVuZGVySXRlbSA9IChyb3dJbmRleCAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID09PSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAtIDEpIHx8IHJvd0luZGV4ID09PSBtYXhJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXJ0UG9zaXRpb24gKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gKHJvd0luZGV4ICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0KSA6IGN1cnJlbnRTdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBjdXJyZW50U3RhcnRQb3NpdGlvbiA6IChyb3dJbmRleCAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZFdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXy5jYWxsKHNjb3BlLCBncm91cEluZm8sIHJvd0luZGV4LCByZW5kZXJSZWN0LCBnZXRVcGRhdGVSb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlckl0ZW0gPSAocm93SW5kZXggJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9PT0gY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gLSAxKSB8fCByb3dJbmRleCA9PT0gbWF4SW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhcnRQb3NpdGlvbiArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWluczFkXyh3aW5kb3dSYW5nZSwgY3VycmVudFN0YXJ0UG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JpZC5nZXRHcm91cEluZm9fKGN1cnJJbmZvLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBmb290ZXIgPSBncm91cEluZm8uZGF0YS5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBjdXJyZW50U3RhcnRQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogY3VycmVudFN0YXJ0UG9zaXRpb24gKyBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGN1cnJlbnRTdGFydFBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZ3JpZC51aWQgKyAnLWdmJyArIGN1cnJJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogY3VyckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZHM6IHJlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldEdyb3VwRm9vdGVyUm93Xy5jYWxsKHNjb3BlLCBrZXksIGN1cnJJbmZvLCBncm91cEluZm8sIHJlY3QsIGRpcmVjdGlvbiwgcmlnaHRUb0xlZnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUm93Um9sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckluZm86IGdldEdyb3VwRm9vdGVyUmVuZGVySW5mb18uY2FsbChzY29wZSwgY3VyckluZm8ucGF0aCwgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5zMWRfKHdpbmRvd1JhbmdlLCBjdXJyZW50U3RhcnRQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyckluZm8uYXJlYSA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cCAmJiAhZ3JvdXAuaXNCb3R0b21MZXZlbCAmJiBmb290ZXIgJiYgZm9vdGVyLnZpc2libGUgJiYgIWZvb3Rlci5jb2xsYXBzZVdpdGhHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0ZPT1RFUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gbWF4SW5kZXggPSBncm91cC5pc0JvdHRvbUxldmVsID8gZ3JvdXAuaXRlbUNvdW50IDogZ3JvdXBJbmZvLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLnNsaWNlKCkuY29uY2F0KFtpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclJvd18oa2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIGlzUm93Um9sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBIZWFkZXJSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCBjdXJySW5mby5wYXRoLCBncm91cEluZm8sIHJlY3QsIGRpcmVjdGlvbiwgcmlnaHRUb0xlZnQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBDb250ZW50Um93XyhrZXksIHJvd0luZGV4LCByZWN0LCBncm91cEluZm8sIHJpZ2h0VG9MZWZ0LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBpc1Jvd1JvbGU6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBSb3dSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCByb3dJbmRleCwgZ3JvdXBJbmZvLCByZWN0LCByaWdodFRvTGVmdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSb3dfKGtleSwgY3VyckluZm8sIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgaXNSb3dSb2xlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiBnZXRHcm91cEZvb3RlclJlbmRlckluZm9fLmNhbGwoc2NvcGUsIGN1cnJJbmZvLnBhdGgsIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclJlbmRlckluZm9fKGdyb3VwUGF0aCwgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICB2YXIgc3R5bGU7XG4gICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gcmVjdC5oZWlnaHQgOiByZWN0LndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwUGF0aC5qb2luKCdfJyksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogcmVuZGVyR3JvdXBIZWFkZXJfLmNhbGwodGhpcywgZ3JvdXBJbmZvLCB3aWR0aClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJHcm91cEhlYWRlcl8oZ3JvdXBJbmZvLCB3aWR0aCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGdyb3VwLm5hbWU7XG5cbiAgICAgICAgICAgIC8vVE9ETzogdXNlIGZvcm1hdHRlcj9cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09ICdbb2JqZWN0IERhdGVdJykge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBsZXZlbDogZ3JvdXAubGV2ZWwsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiBncm91cC5sZXZlbCAqIEdST1VQX0lOREVOVCxcbiAgICAgICAgICAgICAgICBncm91cFN0YXR1czogZ3JvdXAuY29sbGFwc2VkID8gJ2NvbGxhcHNlZCcgOiAnZXhwYW5kJyxcbiAgICAgICAgICAgICAgICBjb25kaXRpb246IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5maWVsZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIGNvdW50OiBncm91cC5pdGVtQ291bnRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBkb1QudGVtcGxhdGUoZ2V0R3JvdXBIZWFkZXJUZW1wbGF0ZV8uY2FsbChzZWxmLCBncm91cCwgd2lkdGgpLCBudWxsLCBudWxsLCB0cnVlKShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyVGVtcGxhdGVfKGdyb3VwLCB3aWR0aCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHNjb3BlLm9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gc2NvcGUub3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgIC8vVE9ETzogcHJlcHJvY2VzcyB1c2VyIGdpdmVuIGhlYWRlciB0ZW1wbGF0ZSwgYWRkIGhlaWdodFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRUZW1wbGF0ZTtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci12LXJ0bFwiIHN0eWxlPVwicmlnaHQ6JyArIGhlaWdodCArICdweDt3aWR0aDonICsgd2lkdGggKyAncHg7aGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7bGluZS1oZWlnaHQ6JyArIGhlaWdodCArICdweDtcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImdjLWljb24gZ2MtZ3JvdXBpbmctdG9nZ2xlIHt7PWl0Lmdyb3VwU3RhdHVzfX1cIiBzdHlsZT1cIm1hcmdpbi1yaWdodDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj4mbmJzcDxzcGFuIGxldmVsPVwie3s9aXQubGV2ZWx9fVwiPnt7PWl0LmNvbmRpdGlvbn19OiB7ez1pdC5uYW1lfX08c3Bhbj4gKHt7PWl0LmNvdW50fX0pPC9zcGFuPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci12XCIgc3R5bGU9XCJsZWZ0OicgKyBoZWlnaHQgKyAncHg7d2lkdGg6JyArIHdpZHRoICsgJ3B4O2hlaWdodDonICsgaGVpZ2h0ICsgJ3B4O2xpbmUtaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJnYy1pY29uIGdjLWdyb3VwaW5nLXRvZ2dsZSB7ez1pdC5ncm91cFN0YXR1c319XCIgc3R5bGU9XCJtYXJnaW4tbGVmdDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj4mbmJzcDxzcGFuIGxldmVsPVwie3s9aXQubGV2ZWx9fVwiPnt7PWl0LmNvbmRpdGlvbn19OiB7ez1pdC5uYW1lfX08c3Bhbj4gKHt7PWl0LmNvdW50fX0pPC9zcGFuPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci1jZWxsXCIgc3R5bGU9XCJoZWlnaHQ6JyArIGhlaWdodCArICdweDtsaW5lLWhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLXJpZ2h0Ont7PWl0Lm1hcmdpbn19cHg7XCI+PC9zcGFuPiZuYnNwPHNwYW4gbGV2ZWw9XCJ7ez1pdC5sZXZlbH19XCI+e3s9aXQuY29uZGl0aW9ufX06IHt7PWl0Lm5hbWV9fTxzcGFuPiAoe3s9aXQuY291bnR9fSk8L3NwYW4+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJnYy1ncm91cC1oZWFkZXIgZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgXCIgc3R5bGU9XCJoZWlnaHQ6JyArIGhlaWdodCArICdweDtsaW5lLWhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6e3s9aXQubWFyZ2lufX1weDtcIj48L3NwYW4+Jm5ic3A8c3BhbiBsZXZlbD1cInt7PWl0LmxldmVsfX1cIj57ez1pdC5jb25kaXRpb259fToge3s9aXQubmFtZX19PHNwYW4+ICh7ez1pdC5jb3VudH19KTwvc3Bhbj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlci50ZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cFJvd1JlbmRlckluZm9fKGluZGV4LCBncm91cEluZm8sIHJlY3QsIHJpZ2h0VG9MZWZ0LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHN0eWxlO1xuICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0eWxlID0gYWRkaXRpb25hbFN0eWxlID8gXy5hc3NpZ24oYWRkaXRpb25hbFN0eWxlLCBzdHlsZSkgOiBzdHlsZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cnICsgKGFkZGl0aW9uYWxDU1NDbGFzcyA/ICgnICcgKyBhZGRpdGlvbmFsQ1NTQ2xhc3MpIDogJycpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHNlbGYuZ2V0Um93VGVtcGxhdGUoKShzZWxmLmdyaWQuZm9ybWF0RGF0YUl0ZW0oZ3JvdXBJbmZvLmRhdGEuZ2V0SXRlbShpbmRleCkpKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogaG93IHRvIGhhbmRsZSBncm91cCBmb290ZXIgaW4gY2FyZCBsYXlvdXRFbmdpbmVcbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSZW5kZXJJbmZvXyhncm91cFBhdGgsIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgdmFyIHN0eWxlO1xuICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy92YXIgd2lkdGggPSBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gcmVjdC5oZWlnaHQgOiByZWN0LndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwUGF0aC5qb2luKCdfJyksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogJzxkaXY+PC9kaXY+J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXBzXyhyYW5nZTEsIHJhbmdlMikge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlMS5lbmQgPiByYW5nZTIuc3RhcnQgJiYgcmFuZ2UyLmVuZCA+IHJhbmdlMS5zdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbnRhaW5zMWRfKHJhbmdlLCBwb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIChyYW5nZS5lbmQgPiBwb3NpdGlvbiAmJiBwb3NpdGlvbiA+PSByYW5nZS5zdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb250YWluczJkXyhyZWN0LCBwb2ludCwgZW5sYXJnZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGVubGFyZ2VMZW5ndGggPSAoZW5sYXJnZSAmJiBzZWxmLmdyaWQuaXNUb3VjaE1vZGUpID8gMTAgOiAwO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSByZWN0LmxlZnQgLSBlbmxhcmdlTGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCArIGVubGFyZ2VMZW5ndGg7XG4gICAgICAgICAgICB2YXIgdG9wID0gcmVjdC50b3AgLSBlbmxhcmdlTGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGJvdHRvbSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKyBlbmxhcmdlTGVuZ3RoO1xuXG4gICAgICAgICAgICByZXR1cm4gcG9pbnQubGVmdCA+PSBsZWZ0ICYmIHBvaW50LnRvcCA+PSB0b3AgJiYgcG9pbnQubGVmdCA8IHJpZ2h0ICYmIHBvaW50LnRvcCA8IGJvdHRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETyByZWZhY3RvciB0aGUgcmVuZGVyIHByb2Nlc3MuIGtpbGwgdGhlc2UgcmVkdW5kYW50IGZ1bmN0aW9uc1xuICAgICAgICBmdW5jdGlvbiBnZXRTdGFydEVuZEluZGV4QXRfKG9mZnNldCkge1xuICAgICAgICAgICAgLy9hc3N1bWluZyBhbGwgY2FyZHMgaGF2ZSB0aGUgc2FtZSBzaXplXG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgdmFyIGRhdGFMZW5ndGggPSBzY29wZS5ncmlkLmRhdGEuaXRlbUNvdW50O1xuICAgICAgICAgICAgdmFyIHN0YXJ0Q29vcmRpbmF0ZTtcbiAgICAgICAgICAgIHZhciBlbmRDb29yZGluYXRlO1xuICAgICAgICAgICAgdmFyIHN0YXJ0SW5kZXg7XG4gICAgICAgICAgICB2YXIgZW5kSW5kZXg7XG4gICAgICAgICAgICB2YXIgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPSBsYXlvdXRJbmZvLmNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMucmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRDb29yZGluYXRlID0gbGF5b3V0SW5mby5jb250ZW50V2lkdGggLSBvZmZzZXQubGVmdCAtIGxheW91dEluZm8ud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGVuZENvb3JkaW5hdGUgPSBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCAtIG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29vcmRpbmF0ZSA9IG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICBlbmRDb29yZGluYXRlID0gb2Zmc2V0LmxlZnQgKyBsYXlvdXRJbmZvLndpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gTWF0aC5mbG9vcihzdGFydENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLmZsb29yKGVuZENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IE1hdGgubWF4KHN0YXJ0SW5kZXggKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiwgMCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLm1pbigoZW5kSW5kZXggKyAxKSAqIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uLCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhcnRDb29yZGluYXRlID0gb2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICBlbmRDb29yZGluYXRlID0gb2Zmc2V0LnRvcCArIGxheW91dEluZm8uaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKHN0YXJ0Q29vcmRpbmF0ZSAvIG9wdGlvbnMuY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLmZsb29yKGVuZENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1heChzdGFydEluZGV4ICogY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24sIDApO1xuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gTWF0aC5taW4oKGVuZEluZGV4ICsgMSkgKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiwgZGF0YUxlbmd0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgICAgZW5kOiBlbmRJbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlXygpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgaWYgKHNlbGYucm93VGVtcGxhdGVGbl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5yb3dUZW1wbGF0ZUZuXztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgdmFyIG9sZENvbFRtcGw7XG4gICAgICAgICAgICB2YXIgbmV3Q29sVG1wbDtcbiAgICAgICAgICAgIHZhciBpZDtcbiAgICAgICAgICAgIHZhciBjc3NOYW1lO1xuICAgICAgICAgICAgdmFyIHRhZ05hbWU7XG4gICAgICAgICAgICB2YXIgY29sVG1wbDtcbiAgICAgICAgICAgIHZhciBjb2xBbm5vdGF0aW9uO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvbVV0aWwuY3JlYXRlVGVtcGxhdGVFbGVtZW50KHRlbXBsYXRlU3RyKTtcbiAgICAgICAgICAgIC8vRGlmZmVyZW50IGJyb3dzZXJzIG1heSByZXR1cm4gZGlmZmVyZW50IGlubmVySFRNTHMgY29tcGFyZWQgd2l0aCB0aGUgb3JpZ2luYWwgSFRNTCxcbiAgICAgICAgICAgIC8vdGhleSBtYXkgcmVvcmRlciB0aGUgYXR0cmlidXRlIG9mIGEgdGFnLGVzY2FwZXMgdGFncyB3aXRoIGluc2lkZSBhIG5vc2NyaXB0IHRhZyBldGMuXG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciA9IGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dChlbGVtZW50KTtcblxuICAgICAgICAgICAgdmFyIGFubm90YXRpb25Db2xzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb2x1bW5dJyk7XG4gICAgICAgICAgICBfLmVhY2goYW5ub3RhdGlvbkNvbHMsIGZ1bmN0aW9uKGFubm90YXRpb25Db2wsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IGdyaWQuZ2V0Q29sQnlJZF8oYW5ub3RhdGlvbkNvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sdW1uJykpO1xuICAgICAgICAgICAgICAgIGlmIChjb2wgJiYgY29sLmRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmlzQ2FsY0NvbHVtbl8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSAne3s9aXQuJyArIGNvbC5pZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUZpZWxkcyA9IGNvbC5kYXRhRmllbGQuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRmllbGRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSBjb2wucHJlc2VudGVyIHx8ICd7ez1pdC4nICsgY29sLmRhdGFGaWVsZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFGaWVsZHMsIGZ1bmN0aW9uKGRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goZ3JpZC5nZXRDb2xCeUlkXyhkYXRhRmllbGQpLnByZXNlbnRlciB8fCAne3s9aXQuJyArIGNvbC5kYXRhRmllbGQgKyAnfX0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gdGVtcC5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbFRtcGwgPSBhbm5vdGF0aW9uQ29sO1xuICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBjb2xUbXBsLnRhZ05hbWU7XG4gICAgICAgICAgICAgICAgb2xkQ29sVG1wbCA9IGRvbVV0aWwuZ2V0RWxlbWVudE91dGVyVGV4dChjb2xUbXBsKTtcbiAgICAgICAgICAgICAgICBpZCA9ICdjJyArIGluZGV4O1xuICAgICAgICAgICAgICAgIGNzc05hbWUgPSAnZ2MtY2VsbCc7XG5cbiAgICAgICAgICAgICAgICBuZXdDb2xUbXBsID0gb2xkQ29sVG1wbC5zbGljZSgwLCBvbGRDb2xUbXBsLmxlbmd0aCAtICh0YWdOYW1lLmxlbmd0aCArIDMpKSArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwMCU7XCIgY2xhc3M9XCInICsgY3NzTmFtZSArICcgJyArIGlkICsgJ1wiJyArICcgcm9sZT1cImdyaWRjZWxsXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gKyAnPC9kaXY+PC8nICsgdGFnTmFtZSArICc+JztcblxuICAgICAgICAgICAgICAgIC8vb3V0ZXJIVE1MIHJldHVybnMgZG91YmxlIHF1b3RlcyBpbiBhdHRyaWJ1dGUgc29tZXRpbWVzXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlU3RyLmluZGV4T2Yob2xkQ29sVG1wbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZENvbFRtcGwgPSBvbGRDb2xUbXBsLnJlcGxhY2UoL1wiL2csICdcXCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0ci5yZXBsYWNlKG9sZENvbFRtcGwsIG5ld0NvbFRtcGwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYucm93VGVtcGxhdGVGbl8gPSBkb1QudGVtcGxhdGUodGVtcGxhdGVTdHIsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucm93VGVtcGxhdGVGbl87XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYXNHcm91cF8oZ3JpZCkge1xuICAgICAgICAgICAgcmV0dXJuICEhZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlV2hlZWwoc2VuZGVyLCBlKSB7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbmRlcjtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvO1xuICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICAgICAgdmFyIGhhc1Njcm9sbEJhciA9IGxheW91dEVuZ2luZS5oYXNTY3JvbGxCYXJfKCk7XG4gICAgICAgICAgICBpZiAoIWxheW91dEVuZ2luZS5vcHRpb25zLnNob3dTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXREZWx0YSA9IGUuZGVsdGFZO1xuXG4gICAgICAgICAgICAvL3NpbXVsYXRlIHNjcm9sbFxuICAgICAgICAgICAgaWYgKGxheW91dEVuZ2luZS5vcHRpb25zLmRpcmVjdGlvbiAhPT0gVkVSVElDQUwgJiYgaGFzU2Nyb2xsQmFyLnZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dEluZm8gPSBsYXlvdXRFbmdpbmUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heE9mZnNldFRvcCA9IE1hdGgubWF4KGxheW91dEluZm8uY29udGVudEhlaWdodCAtIGxheW91dEluZm8uaGVpZ2h0LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldERlbHRhID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA+PSBtYXhPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKG9mZnNldFRvcCArIG9mZnNldERlbHRhLCBtYXhPZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsJykuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzU2Nyb2xsQmFyLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0RGVsdGEgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0SW5mbyA9IGxheW91dEVuZ2luZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4T2Zmc2V0TGVmdCA9IE1hdGgubWF4KGxheW91dEluZm8uY29udGVudFdpZHRoIC0gbGF5b3V0SW5mby53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gZ3JpZC5zY3JvbGxPZmZzZXQubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXREZWx0YSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID49IG1heE9mZnNldExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBNYXRoLm1pbihvZmZzZXRMZWZ0ICsgb2Zmc2V0RGVsdGEsIG1heE9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldExlZnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBNYXRoLm1heChvZmZzZXRMZWZ0ICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsJykuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTW91c2VDbGljayhzZW5kZXIsIGUpIHtcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VuZGVyO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzZW5kZXIubGF5b3V0RW5naW5lO1xuICAgICAgICAgICAgdmFyIGhpdEluZm87XG4gICAgICAgICAgICAvL2lmICghaGl0SW5mbykge1xuICAgICAgICAgICAgc2VsZi5oaXRUZXN0SW5mb18gPSBzZWxmLmhpdFRlc3QoZSk7XG4gICAgICAgICAgICBoaXRJbmZvID0gc2VsZi5oaXRUZXN0SW5mb187XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBpZiAoIWhpdEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubW91c2VEb3duUG9pbnRfID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IGUucGFnZVgsXG4gICAgICAgICAgICAgICAgdG9wOiBlLnBhZ2VZXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgICAgICBpZiAoZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9DT05URU5UICYmIGdyb3VwSW5mby5yb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyBncm91cEluZm8ucm93O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBJbmZvLmFyZWEgPT09IEdST1VQX0ZPT1RFUikge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGYuZ3JpZC51aWQgKyAnLWdmJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5vbkV4cGFuZFRvZ2dsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEluZm8ucGF0aCkuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmNvbGxhcHNlZCA9ICFncm91cC5jb2xsYXBzZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoVGFwKHNlbmRlciwgZSkge1xuICAgICAgICAgICAgaGFuZGxlTW91c2VDbGljayhzZW5kZXIsIGUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBDYXJkTGF5b3V0RW5naW5lO1xuICAgIH0oKVxuKVxuO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvbGF5b3V0RW5naW5lcy9DYXJkTGF5b3V0RW5naW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSA1XG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgVU5ERUZJTkVEID0gJ3VuZGVmaW5lZCc7XG4gICAgdmFyIGdjVXRpbHMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZSh2YWwsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZih2YWwpID09PSB0eXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhc3RzIGEgdmFsdWUgdG8gYSB0eXBlIGlmIHBvc3NpYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGNhc3QuXG4gICAgICogQHBhcmFtIHR5cGUgVHlwZSBvciBpbnRlcmZhY2UgbmFtZSB0byBjYXN0IHRvLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbiBpZiB0aGUgY2FzdCB3YXMgc3VjY2Vzc2Z1bCwgbnVsbCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJ5Q2FzdCh2YWx1ZSwgdHlwZSkge1xuICAgICAgICAvLyBudWxsIGRvZXNuJ3QgaW1wbGVtZW50IGFueXRoaW5nXG4gICAgICAgIGlmIChpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGVzdCBmb3IgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uIChJUXVlcnlJbnRlcmZhY2UpXG4gICAgICAgIGlmIChpc1N0cmluZyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUuaW1wbGVtZW50c0ludGVyZmFjZSkgJiYgdmFsdWUuaW1wbGVtZW50c0ludGVyZmFjZSh0eXBlKSA/IHZhbHVlIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgdHlwZSB0ZXN0XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUgPyB2YWx1ZSA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy50cnlDYXN0ID0gdHJ5Q2FzdDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBwcmltaXRpdmUgdHlwZSAoc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIG9yIGRhdGUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNQcmltaXRpdmUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzU3RyaW5nKHZhbHVlKSB8fCBpc051bWJlcih2YWx1ZSkgfHwgaXNCb29sZWFuKHZhbHVlKSB8fCBpc0RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RyaW5nIGlzIG51bGwsIGVtcHR5LCBvciB3aGl0ZXNwYWNlIG9ubHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNVbmRlZmluZWRPck51bGwodmFsdWUpID8gdHJ1ZSA6IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJykubGVuZ3RoIDwgMTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlID0gaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2U7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ251bWJlcicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSW50KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgPT09IE1hdGgucm91bmQodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNJbnQgPSBpc0ludDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBCb29sZWFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdib29sZWFuJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIHVuZGVmaW5lZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsIFVOREVGSU5FRCk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIERhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4odmFsdWUuZ2V0VGltZSgpKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIG9iamVjdCAoYXMgb3Bwb3NlZCB0byBhIHZhbHVlIHR5cGUgb3IgYSBkYXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAhaXNVbmRlZmluZWRPck51bGwodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIWlzRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdHlwZSBvZiBhIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICogQHJldHVybiBBIEBzZWU6RGF0YVR5cGUgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VHlwZSh2YWx1ZSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ251bWJlcic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdib29sZWFuJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2FycmF5JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZ2V0VHlwZSA9IGdldFR5cGU7XG5cbiAgICBmdW5jdGlvbiBpc051bGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1VuZGVmaW5lZCh2YWx1ZSkgfHwgaXNOdWxsKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzTnVsbCA9IGlzTnVsbDtcbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsID0gaXNVbmRlZmluZWRPck51bGw7XG5cbiAgICAvL1RPRE86IHJldmlldyB0aGlzIG1ldGhvZCBhZnRlciBmb3JtbXR0ZXIgaW1wbGVtZW50YXRpb24gZG9uZS5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSB0eXBlIG9mIGEgdmFsdWUuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgdGhlIG9yaWdpbmFsIHZhbHVlIGlzIHJldHVybmVkLiBUbyBjaGVjayBpZiBhXG4gICAgICogY29udmVyc2lvbiBzdWNjZWVkZWQsIHlvdSBzaG91bGQgY2hlY2sgdGhlIHR5cGUgb2YgdGhlIHJldHVybmVkIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGNvbnZlcnQuXG4gICAgICogQHBhcmFtIHR5cGUgQHNlZTpEYXRhVHlwZSB0byBjb252ZXJ0IHRoZSB2YWx1ZSB0by5cbiAgICAgKiBAcmV0dXJuIFRoZSBjb252ZXJ0ZWQgdmFsdWUsIG9yIHRoZSBvcmlnaW5hbCB2YWx1ZSBpZiBhIGNvbnZlcnNpb24gd2FzIG5vdCBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGFuZ2VUeXBlKHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gY29udmVydCBzdHJpbmdzIHRvIG51bWJlcnMsIGRhdGVzLCBvciBib29sZWFuc1xuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKG51bSkgPyB2YWx1ZSA6IG51bTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IGFueXRoaW5nIHRvIHN0cmluZ1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jaGFuZ2VUeXBlID0gY2hhbmdlVHlwZTtcbiAgICAvL1xuICAgIC8vLyoqXG4gICAgLy8gKiBSZXBsYWNlcyBlYWNoIGZvcm1hdCBpdGVtIGluIGEgc3BlY2lmaWVkIHN0cmluZyB3aXRoIHRoZSB0ZXh0IGVxdWl2YWxlbnQgb2YgYW5cbiAgICAvLyAqIG9iamVjdCdzIHZhbHVlLlxuICAgIC8vICpcbiAgICAvLyAqIFRoZSBmdW5jdGlvbiB3b3JrcyBieSByZXBsYWNpbmcgcGFydHMgb2YgdGhlIDxiPmZvcm1hdFN0cmluZzwvYj4gd2l0aCB0aGUgcGF0dGVyblxuICAgIC8vICogJ3tuYW1lOmZvcm1hdH0nIHdpdGggcHJvcGVydGllcyBvZiB0aGUgPGI+ZGF0YTwvYj4gcGFyYW1ldGVyLiBGb3IgZXhhbXBsZTpcbiAgICAvLyAqXG4gICAgLy8gKiA8cHJlPlxuICAgIC8vICogdmFyIGRhdGEgPSB7IG5hbWU6ICdKb2UnLCBhbW91bnQ6IDEyMzQ1NiB9O1xuICAgIC8vICogdmFyIG1zZyA9IHdpam1vLmZvcm1hdCgnSGVsbG8ge25hbWV9LCB5b3Ugd29uIHthbW91bnQ6bjJ9IScsIGRhdGEpO1xuICAgIC8vICogPC9wcmU+XG4gICAgLy8gKlxuICAgIC8vICogVGhlIG9wdGlvbmFsIDxiPmZvcm1hdEZ1bmN0aW9uPC9iPiBhbGxvd3MgeW91IHRvIGN1c3RvbWl6ZSB0aGUgY29udGVudCBieSBwcm92aWRpbmdcbiAgICAvLyAqIGNvbnRleHQtc2Vuc2l0aXZlIGZvcm1hdHRpbmcuIElmIHByb3ZpZGVkLCB0aGUgZm9ybWF0IGZ1bmN0aW9uIGdldHMgY2FsbGVkIGZvciBlYWNoXG4gICAgLy8gKiBmb3JtYXQgZWxlbWVudCBhbmQgZ2V0cyBwYXNzZWQgdGhlIGRhdGEgb2JqZWN0LCB0aGUgcGFyYW1ldGVyIG5hbWUsIHRoZSBmb3JtYXQsXG4gICAgLy8gKiBhbmQgdGhlIHZhbHVlOyBpdCBzaG91bGQgcmV0dXJuIGFuIG91dHB1dCBzdHJpbmcuIEZvciBleGFtcGxlOlxuICAgIC8vICpcbiAgICAvLyAqIDxwcmU+XG4gICAgLy8gKiB2YXIgZGF0YSA9IHsgbmFtZTogJ0pvZScsIGFtb3VudDogMTIzNDU2IH07XG4gICAgLy8gKiB2YXIgbXNnID0gd2lqbW8uZm9ybWF0KCdIZWxsbyB7bmFtZX0sIHlvdSB3b24ge2Ftb3VudDpuMn0hJywgZGF0YSxcbiAgICAvLyAqICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhLCBuYW1lLCBmbXQsIHZhbCkge1xuICAgIC8vKiAgICAgICAgICAgICAgIGlmICh3aWptby5pc1N0cmluZyhkYXRhW25hbWVdKSkge1xuICAgIC8vKiAgICAgICAgICAgICAgICAgICB2YWwgPSB3aWptby5lc2NhcGVIdG1sKGRhdGFbbmFtZV0pO1xuICAgIC8vKiAgICAgICAgICAgICAgIH1cbiAgICAvLyogICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgIC8vKiAgICAgICAgICAgICB9KTtcbiAgICAvLyAqIDwvcHJlPlxuICAgIC8vICpcbiAgICAvLyAqIEBwYXJhbSBmb3JtYXQgQSBjb21wb3NpdGUgZm9ybWF0IHN0cmluZy5cbiAgICAvLyAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIG9iamVjdCB1c2VkIHRvIGJ1aWxkIHRoZSBzdHJpbmcuXG4gICAgLy8gKiBAcGFyYW0gZm9ybWF0RnVuY3Rpb24gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0byBmb3JtYXQgaXRlbXMgaW4gY29udGV4dC5cbiAgICAvLyAqIEByZXR1cm4gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXG4gICAgLy8gKi9cbiAgICAvL2Z1bmN0aW9uIGZvcm1hdChmb3JtYXQsIGRhdGEsIGZvcm1hdEZ1bmN0aW9uKSB7XG4gICAgLy8gICAgZm9ybWF0ID0gYXNTdHJpbmcoZm9ybWF0KTtcbiAgICAvLyAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL1xceyguKj8pKDooLio/KSk/XFx9L2csIGZ1bmN0aW9uIChtYXRjaCwgbmFtZSwgeCwgZm10KSB7XG4gICAgLy8gICAgICAgIHZhciB2YWwgPSBtYXRjaDtcbiAgICAvLyAgICAgICAgaWYgKG5hbWUgJiYgbmFtZVswXSAhPSAneycgJiYgZGF0YSkge1xuICAgIC8vICAgICAgICAgICAgLy8gZ2V0IHRoZSB2YWx1ZVxuICAgIC8vICAgICAgICAgICAgdmFsID0gZGF0YVtuYW1lXTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgLy8gYXBwbHkgc3RhdGljIGZvcm1hdFxuICAgIC8vICAgICAgICAgICAgaWYgKGZtdCkge1xuICAgIC8vICAgICAgICAgICAgICAgIHZhbCA9IHdpam1vLkdsb2JhbGl6ZS5mb3JtYXQodmFsLCBmbXQpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBhcHBseSBmb3JtYXQgZnVuY3Rpb25cbiAgICAvLyAgICAgICAgICAgIGlmIChmb3JtYXRGdW5jdGlvbikge1xuICAgIC8vICAgICAgICAgICAgICAgIHZhbCA9IGZvcm1hdEZ1bmN0aW9uKGRhdGEsIG5hbWUsIGZtdCwgdmFsKTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgfVxuICAgIC8vICAgICAgICByZXR1cm4gdmFsID09IG51bGwgPyAnJyA6IHZhbDtcbiAgICAvLyAgICB9KTtcbiAgICAvL31cbiAgICAvL2djVXRpbHMuZm9ybWF0ID0gZm9ybWF0O1xuXG4gICAgLyoqXG4gICAgICogQ2xhbXBzIGEgdmFsdWUgYmV0d2VlbiBhIG1pbmltdW0gYW5kIGEgbWF4aW11bS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBPcmlnaW5hbCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gbWluIE1pbmltdW0gYWxsb3dlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gbWF4IE1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwobWF4KSAmJiB2YWx1ZSA+IG1heCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChtaW4pICYmIHZhbHVlIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtaW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2xhbXAgPSBjbGFtcDtcblxuICAgIC8qKlxuICAgICAqIENvcGllcyB0aGUgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdCB0byBhbm90aGVyLlxuICAgICAqXG4gICAgICogVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBtdXN0IGRlZmluZSBhbGwgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgc291cmNlLFxuICAgICAqIG9yIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRzdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSBzcmMgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weShkc3QsIHNyYykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5IGluIGRzdCwgJ1Vua25vd24ga2V5IFwiJyArIGtleSArICdcIi4nKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xuICAgICAgICAgICAgaWYgKCFkc3QuX2NvcHkgfHwgIWRzdC5fY29weShrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgZHN0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29weShkc3Rba2V5XSwgdmFsdWUpOyAvLyBjb3B5IHN1Yi1vYmplY3RzXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSB2YWx1ZTsgLy8gYXNzaWduIHZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdjVXRpbHMuY29weSA9IGNvcHk7XG5cbiAgICAvKipcbiAgICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIGEgY29uZGl0aW9uIGlzIGZhbHNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbmRpdGlvbiBDb25kaXRpb24gZXhwZWN0ZWQgdG8gYmUgdHJ1ZS5cbiAgICAgKiBAcGFyYW0gbXNnIE1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvbiBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCB0cnVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1zZykge1xuICAgICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgJyoqIEFzc2VydGlvbiBmYWlsZWQgaW4gV2lqbW86ICcgKyBtc2c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzc2VydCA9IGFzc2VydDtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgc3RyaW5nLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBzdHJpbmcgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3RyaW5nKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc1N0cmluZyh2YWx1ZSksICdTdHJpbmcgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzU3RyaW5nID0gYXNTdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBudW1lcmljLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpdmUgV2hldGhlciB0byBhY2NlcHQgb25seSBwb3NpdGl2ZSBudW1lcmljIHZhbHVlcy5cbiAgICAgKiBAcmV0dXJuIFRoZSBudW1iZXIgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzTnVtYmVyKHZhbHVlLCBudWxsT0ssIHBvc2l0aXZlKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tUeXBlKHBvc2l0aXZlLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBwb3NpdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNOdW1iZXIodmFsdWUpLCAnTnVtYmVyIGV4cGVjdGVkLicpO1xuICAgICAgICBpZiAocG9zaXRpdmUgJiYgdmFsdWUgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnUG9zaXRpdmUgbnVtYmVyIGV4cGVjdGVkLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNOdW1iZXIgPSBhc051bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYW4gaW50ZWdlci5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHBhcmFtIHBvc2l0aXZlIFdoZXRoZXIgdG8gYWNjZXB0IG9ubHkgcG9zaXRpdmUgaW50ZWdlcnMuXG4gICAgICogQHJldHVybiBUaGUgbnVtYmVyIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0ludCh2YWx1ZSwgbnVsbE9LLCBwb3NpdGl2ZSkge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoZWNrVHlwZShwb3NpdGl2ZSwgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgcG9zaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzSW50KHZhbHVlKSwgJ0ludGVnZXIgZXhwZWN0ZWQuJyk7XG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiB2YWx1ZSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdQb3NpdGl2ZSBpbnRlZ2VyIGV4cGVjdGVkLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNJbnQgPSBhc0ludDtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgQm9vbGVhbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBCb29sZWFuLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBCb29sZWFuIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0Jvb2xlYW4odmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0Jvb2xlYW4odmFsdWUpLCAnQm9vbGVhbiBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNCb29sZWFuID0gYXNCb29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBEYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgRGF0ZS5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgRGF0ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNEYXRlKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNEYXRlKHZhbHVlKSwgJ0RhdGUgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRGF0ZSA9IGFzRGF0ZTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgZnVuY3Rpb24gcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRnVuY3Rpb24odmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0Z1bmN0aW9uKHZhbHVlKSwgJ0Z1bmN0aW9uIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0Z1bmN0aW9uID0gYXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGFuIGFycmF5LlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBhcnJheSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNBcnJheSh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzQXJyYXkodmFsdWUpLCAnQXJyYXkgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzQXJyYXkgPSBhc0FycmF5O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBnaXZlbiB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHBhcmFtIHR5cGUgVHlwZSBvZiB2YWx1ZSBleHBlY3RlZC5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzVHlwZSh2YWx1ZSwgdHlwZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IHZhbHVlIGluc3RhbmNlb2YgdHlwZSwgdHlwZSArICcgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzVHlwZSA9IGFzVHlwZTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgdmFsaWQgc2V0dGluZyBmb3IgYW4gZW51bWVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBtZW1iZXIgb2YgdGhlIGVudW1lcmF0aW9uLlxuICAgICAqIEBwYXJhbSBlbnVtVHlwZSBFbnVtZXJhdGlvbiB0byB0ZXN0IGZvci5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRW51bSh2YWx1ZSwgZW51bVR5cGUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSAmJiBudWxsT0spIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gZW51bVR5cGVbdmFsdWVdO1xuICAgICAgICBhc3NlcnQoIWlzVW5kZWZpbmVkT3JOdWxsKGUpLCAnSW52YWxpZCBlbnVtIHZhbHVlLicpO1xuICAgICAgICByZXR1cm4gaXNOdW1iZXIoZSkgPyBlIDogdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0VudW0gPSBhc0VudW07XG5cbiAgICAvKipcbiAgICAgKiBFbnVtZXJhdGlvbiB3aXRoIGtleSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGVudW1lcmF0aW9uIGlzIHVzZWZ1bCB3aGVuIGhhbmRsaW5nIDxiPmtleURvd248L2I+IGV2ZW50cy5cbiAgICAgKi9cbiAgICB2YXIgS2V5ID0ge1xuICAgICAgICAvKiogVGhlIGJhY2tzcGFjZSBrZXkuICovXG4gICAgICAgIEJhY2s6IDgsXG4gICAgICAgIC8qKiBUaGUgdGFiIGtleS4gKi9cbiAgICAgICAgVGFiOiA5LFxuICAgICAgICAvKiogVGhlIGVudGVyIGtleS4gKi9cbiAgICAgICAgRW50ZXI6IDEzLFxuICAgICAgICAvKiogVGhlIGVzY2FwZSBrZXkuICovXG4gICAgICAgIEVzY2FwZTogMjcsXG4gICAgICAgIC8qKiBUaGUgc3BhY2Uga2V5LiAqL1xuICAgICAgICBTcGFjZTogMzIsXG4gICAgICAgIC8qKiBUaGUgcGFnZSB1cCBrZXkuICovXG4gICAgICAgIFBhZ2VVcDogMzMsXG4gICAgICAgIC8qKiBUaGUgcGFnZSBkb3duIGtleS4gKi9cbiAgICAgICAgUGFnZURvd246IDM0LFxuICAgICAgICAvKiogVGhlIGVuZCBrZXkuICovXG4gICAgICAgIEVuZDogMzUsXG4gICAgICAgIC8qKiBUaGUgaG9tZSBrZXkuICovXG4gICAgICAgIEhvbWU6IDM2LFxuICAgICAgICAvKiogVGhlIGxlZnQgYXJyb3cga2V5LiAqL1xuICAgICAgICBMZWZ0OiAzNyxcbiAgICAgICAgLyoqIFRoZSB1cCBhcnJvdyBrZXkuICovXG4gICAgICAgIFVwOiAzOCxcbiAgICAgICAgLyoqIFRoZSByaWdodCBhcnJvdyBrZXkuICovXG4gICAgICAgIFJpZ2h0OiAzOSxcbiAgICAgICAgLyoqIFRoZSBkb3duIGFycm93IGtleS4gKi9cbiAgICAgICAgRG93bjogNDAsXG4gICAgICAgIC8qKiBUaGUgZGVsZXRlIGtleS4gKi9cbiAgICAgICAgRGVsZXRlOiA0NixcbiAgICAgICAgLyoqIFRoZSBGMSBrZXkuICovXG4gICAgICAgIEYxOiAxMTIsXG4gICAgICAgIC8qKiBUaGUgRjIga2V5LiAqL1xuICAgICAgICBGMjogMTEzLFxuICAgICAgICAvKiogVGhlIEYzIGtleS4gKi9cbiAgICAgICAgRjM6IDExNCxcbiAgICAgICAgLyoqIFRoZSBGNCBrZXkuICovXG4gICAgICAgIEY0OiAxMTUsXG4gICAgICAgIC8qKiBUaGUgRjUga2V5LiAqL1xuICAgICAgICBGNTogMTE2LFxuICAgICAgICAvKiogVGhlIEY2IGtleS4gKi9cbiAgICAgICAgRjY6IDExNyxcbiAgICAgICAgLyoqIFRoZSBGNyBrZXkuICovXG4gICAgICAgIEY3OiAxMTgsXG4gICAgICAgIC8qKiBUaGUgRjgga2V5LiAqL1xuICAgICAgICBGODogMTE5LFxuICAgICAgICAvKiogVGhlIEY5IGtleS4gKi9cbiAgICAgICAgRjk6IDEyMCxcbiAgICAgICAgLyoqIFRoZSBGMTAga2V5LiAqL1xuICAgICAgICBGMTA6IDEyMSxcbiAgICAgICAgLyoqIFRoZSBGMTEga2V5LiAqL1xuICAgICAgICBGMTE6IDEyMixcbiAgICAgICAgLyoqIFRoZSBGMTIga2V5LiAqL1xuICAgICAgICBGMTI6IDEyM1xuICAgIH07XG4gICAgZ2NVdGlscy5LZXkgPSBLZXk7XG5cbiAgICB2YXIgRWRpdG9yVHlwZSA9IHtcbiAgICAgICAgJ1RleHQnOiAndGV4dCcsXG4gICAgICAgICdDaGVja0JveCc6ICdjaGVja2JveCcsXG4gICAgICAgICdEYXRlJzogJ2RhdGUnLFxuICAgICAgICAnQ29sb3InOiAnY29sb3InLFxuICAgICAgICAnTnVtYmVyJzogJ251bWJlcidcbiAgICB9O1xuICAgIGdjVXRpbHMuRWRpdG9yVHlwZSA9IEVkaXRvclR5cGU7XG5cbiAgICB2YXIgRGF0YVR5cGUgPSB7XG4gICAgICAgICdPYmplY3QnOiAnT2JqZWN0JyxcbiAgICAgICAgJ1N0cmluZyc6ICdTdHJpbmcnLFxuICAgICAgICAnTnVtYmVyJzogJ051bWJlcicsXG4gICAgICAgICdCb29sZWFuJzogJ0Jvb2xlYW4nLFxuICAgICAgICAnRGF0ZSc6ICdEYXRlJyxcbiAgICAgICAgJ0FycmF5JzogJ0FycmF5J1xuICAgIH07XG4gICAgZ2NVdGlscy5EYXRhVHlwZSA9IERhdGFUeXBlO1xuXG4gICAgdmFyIGlzVW5pdGxlc3NOdW1iZXIgPSB7XG4gICAgICAgIGNvbHVtbkNvdW50OiB0cnVlLFxuICAgICAgICBmbGV4OiB0cnVlLFxuICAgICAgICBmbGV4R3JvdzogdHJ1ZSxcbiAgICAgICAgZmxleFNocmluazogdHJ1ZSxcbiAgICAgICAgZm9udFdlaWdodDogdHJ1ZSxcbiAgICAgICAgbGluZUNsYW1wOiB0cnVlLFxuICAgICAgICBsaW5lSGVpZ2h0OiB0cnVlLFxuICAgICAgICBvcGFjaXR5OiB0cnVlLFxuICAgICAgICBvcmRlcjogdHJ1ZSxcbiAgICAgICAgb3JwaGFuczogdHJ1ZSxcbiAgICAgICAgd2lkb3dzOiB0cnVlLFxuICAgICAgICB6SW5kZXg6IHRydWUsXG4gICAgICAgIHpvb206IHRydWUsXG5cbiAgICAgICAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICAgICAgICBmaWxsT3BhY2l0eTogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIF91cHBlcmNhc2VQYXR0ZXJuID0gLyhbQS1aXSkvZztcbiAgICB2YXIgbXNQYXR0ZXJuID0gL14tbXMtLztcblxuICAgIGZ1bmN0aW9uIGRhbmdlcm91c1N0eWxlVmFsdWUobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGlzRW1wdHkgPSBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicgfHwgdmFsdWUgPT09ICcnO1xuICAgICAgICBpZiAoaXNFbXB0eSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzTm9uTnVtZXJpYyA9IGlzTmFOKHZhbHVlKTtcbiAgICAgICAgaWYgKGlzTm9uTnVtZXJpYyB8fCB2YWx1ZSA9PT0gMCB8fFxuICAgICAgICAgICAgaXNVbml0bGVzc051bWJlci5oYXNPd25Qcm9wZXJ0eShuYW1lKSAmJiBpc1VuaXRsZXNzTnVtYmVyW25hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gJycgKyB2YWx1ZTsgLy8gY2FzdCB0byBzdHJpbmdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgKyAncHgnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lbW9pemVTdHJpbmdPbmx5KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IHt9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVtzdHJpbmddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWNoZVtzdHJpbmddID0gY2FsbGJhY2suY2FsbCh0aGlzLCBzdHJpbmcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVtzdHJpbmddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBwcm9jZXNzU3R5bGVOYW1lID0gbWVtb2l6ZVN0cmluZ09ubHkoZnVuY3Rpb24oc3R5bGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBoeXBoZW5hdGVTdHlsZU5hbWUoc3R5bGVOYW1lKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZShzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKF91cHBlcmNhc2VQYXR0ZXJuLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoeXBoZW5hdGVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBoeXBoZW5hdGUoc3RyaW5nKS5yZXBsYWNlKG1zUGF0dGVybiwgJy1tcy0nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVNYXJrdXBGb3JTdHlsZXMoc3R5bGVzKSB7XG4gICAgICAgIHZhciBzZXJpYWxpemVkID0gJyc7XG4gICAgICAgIGZvciAodmFyIHN0eWxlTmFtZSBpbiBzdHlsZXMpIHtcbiAgICAgICAgICAgIGlmICghc3R5bGVzLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gc3R5bGVzW3N0eWxlTmFtZV07XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHN0eWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZCArPSBwcm9jZXNzU3R5bGVOYW1lKHN0eWxlTmFtZSkgKyAnOic7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZCArPSBkYW5nZXJvdXNTdHlsZVZhbHVlKHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyA9IGNyZWF0ZU1hcmt1cEZvclN0eWxlcztcblxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgdGhlIHJvdXRlIGZvciBET00gZXZlbnQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FuY2VsRGVmYXVsdChlKSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9JRSA4XG4gICAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNhbmNlbERlZmF1bHQgPSBjYW5jZWxEZWZhdWx0O1xuXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplT2JqZWN0KG9iaikge1xuICAgICAgICB2YXIgY2xvbmVPYmogPSBfLmNsb25lKG9iaik7XG4gICAgICAgIHZhciBjYWNoZV8gPSBbXTtcbiAgICAgICAgaWYgKGNsb25lT2JqKSB7XG4gICAgICAgICAgICBjYWNoZV8ucHVzaChjbG9uZU9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3Q7XG4gICAgICAgIHdoaWxlIChjYWNoZV8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVzdCA9IGNhY2hlXy5wb3AoKTtcbiAgICAgICAgICAgIGlmICghaXNPYmplY3QoZGVzdCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gZGVzdCkge1xuICAgICAgICAgICAgICAgIGNhY2hlXy5wdXNoKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGRlc3RbaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RbaXRlbV0gPSBzZXJpYWxpemVGdW5jdGlvbihkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lT2JqO1xuICAgIH1cblxuICAgIGdjVXRpbHMuc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplT2JqZWN0O1xuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVPYmplY3Qob2JqKSB7XG4gICAgICAgIHZhciBjbG9uZU9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICAgICAgdmFyIGNhY2hlXyA9IFtdO1xuICAgICAgICBpZiAoY2xvbmVPYmopIHtcbiAgICAgICAgICAgIGNhY2hlXy5wdXNoKGNsb25lT2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdDtcbiAgICAgICAgdmFyIGZ1bmM7XG4gICAgICAgIHdoaWxlIChjYWNoZV8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVzdCA9IGNhY2hlXy5wb3AoKTtcbiAgICAgICAgICAgIGlmICghaXNPYmplY3QoZGVzdCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gZGVzdCkge1xuICAgICAgICAgICAgICAgIGNhY2hlXy5wdXNoKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIGlmIChpc1N0cmluZyhkZXN0W2l0ZW1dKSkge1xuICAgICAgICAgICAgICAgICAgICBmdW5jID0gZGVzZXJpYWxpemVGdW5jdGlvbihkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RbaXRlbV0gPSBmdW5jO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZU9iajtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmRlc2VyaWFsaXplT2JqZWN0ID0gZGVzZXJpYWxpemVPYmplY3Q7XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnNlcmlhbGl6ZUZ1bmN0aW9uID0gc2VyaWFsaXplRnVuY3Rpb247XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wU3RyID0gdmFsdWUuc3Vic3RyKDgsIHZhbHVlLmluZGV4T2YoJygnKSAtIDgpOyAvLzggaXMgJ2Z1bmN0aW9uJyBsZW5ndGhcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zdWJzdHIoMCwgOCkgPT09ICdmdW5jdGlvbicgJiYgdGVtcFN0ci5yZXBsYWNlKC9cXHMrLywgJycpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHZhciBhcmdTdGFydCA9IHZhbHVlLmluZGV4T2YoJygnKSArIDE7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ0VuZCA9IHZhbHVlLmluZGV4T2YoJyknKTtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHZhbHVlLnN1YnN0cihhcmdTdGFydCwgYXJnRW5kIC0gYXJnU3RhcnQpLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLnJlcGxhY2UoL1xccysvLCAnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvZHlTdGFydCA9IHZhbHVlLmluZGV4T2YoJ3snKSArIDE7XG4gICAgICAgICAgICAgICAgdmFyIGJvZHlFbmQgPSB2YWx1ZS5sYXN0SW5kZXhPZignfScpO1xuICAgICAgICAgICAgICAgIC8qanNsaW50IGV2aWw6IHRydWUgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGFyZ3MsIHZhbHVlLnN1YnN0cihib2R5U3RhcnQsIGJvZHlFbmQgLSBib2R5U3RhcnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmRlc2VyaWFsaXplRnVuY3Rpb24gPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uO1xuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIEBzZWU6SUNvbGxlY3Rpb25WaWV3IG9yIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIEFycmF5IG9yIEBzZWU6SUNvbGxlY3Rpb25WaWV3LlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBAc2VlOklDb2xsZWN0aW9uVmlldyB0aGF0IHdhcyBwYXNzZWQgaW4gb3IgYSBAc2VlOkNvbGxlY3Rpb25WaWV3XG4gICAgICogY3JlYXRlZCBmcm9tIHRoZSBhcnJheSB0aGF0IHdhcyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgLypcbiAgICAgZnVuY3Rpb24gYXNDb2xsZWN0aW9uVmlldyh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgIGlmICh0eXBlb2YgbnVsbE9LID09PSBcInVuZGVmaW5lZFwiKSB7IG51bGxPSyA9IHRydWU7IH1cbiAgICAgaWYgKHZhbHVlID09IG51bGwgJiYgbnVsbE9LKSB7XG4gICAgIHJldHVybiBudWxsO1xuICAgICB9XG4gICAgIHZhciBjdiA9IHRyeUNhc3QodmFsdWUsICdJQ29sbGVjdGlvblZpZXcnKTtcbiAgICAgaWYgKGN2ICE9IG51bGwpIHtcbiAgICAgcmV0dXJuIGN2O1xuICAgICB9XG4gICAgIGlmICghaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgYXNzZXJ0KGZhbHNlLCAnQXJyYXkgb3IgSUNvbGxlY3Rpb25WaWV3IGV4cGVjdGVkLicpO1xuICAgICB9XG4gICAgIHJldHVybiBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcodmFsdWUpO1xuICAgICB9XG4gICAgIGdjVXRpbHMuYXNDb2xsZWN0aW9uVmlldyA9IGFzQ29sbGVjdGlvblZpZXc7Ki9cblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIHBsdWdpbiBtb2R1bGUuXG4gICAgICogQHBhcmFtIG5hbWUgb2YgbW9kdWxlXG4gICAgICogQHJldHVybnMgcGx1Z2luIG1vZHVsZSBvYmplY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kUGx1Z2luKG5hbWUpIHtcbiAgICAgICAgdmFyIHBsdWdpbjtcbiAgICAgICAgLy8gZmluZCBmcm9tIGdsb2JhbFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGx1Z2luID0gR2NTcHJlYWQuVmlld3MuR2NHcmlkLlBsdWdpbnNbbmFtZV07Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgKCFwbHVnaW4gJiYgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vICAgIHBsdWdpbiA9IHJlcXVpcmVqcyAmJiByZXF1aXJlanMobmFtZSkgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuICAgICAgICAvLy8vIGNvbW1vbmpzIG5vdCBzdXBwb3J0ZWQgbm93XG4gICAgICAgIC8vaWYgKCFwbHVnaW4gJiYgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vfVxuICAgICAgICByZXR1cm4gcGx1Z2luO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZmluZFBsdWdpbiA9IGZpbmRQbHVnaW47XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdjVXRpbHM7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZ2NVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIvLyBkb1QuanNcbi8vIDIwMTEtMjAxNCwgTGF1cmEgRG9rdG9yb3ZhLCBodHRwczovL2dpdGh1Yi5jb20vb2xhZG8vZG9UXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRvVCA9IHtcbiAgICAgICAgdmVyc2lvbjogXCIxLjAuM1wiLFxuICAgICAgICB0ZW1wbGF0ZVNldHRpbmdzOiB7XG4gICAgICAgICAgICBldmFsdWF0ZTogL1xce1xceyhbXFxzXFxTXSs/KFxcfT8pKylcXH1cXH0vZyxcbiAgICAgICAgICAgIGludGVycG9sYXRlOiAvXFx7XFx7PShbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgZW5jb2RlOiAvXFx7XFx7IShbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgdXNlOiAvXFx7XFx7IyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgdXNlUGFyYW1zOiAvKF58W15cXHckXSlkZWYoPzpcXC58XFxbW1xcJ1xcXCJdKShbXFx3JFxcLl0rKSg/OltcXCdcXFwiXVxcXSk/XFxzKlxcOlxccyooW1xcdyRcXC5dK3xcXFwiW15cXFwiXStcXFwifFxcJ1teXFwnXStcXCd8XFx7W15cXH1dK1xcfSkvZyxcbiAgICAgICAgICAgIGRlZmluZTogL1xce1xceyMjXFxzKihbXFx3XFwuJF0rKVxccyooXFw6fD0pKFtcXHNcXFNdKz8pI1xcfVxcfS9nLFxuICAgICAgICAgICAgZGVmaW5lUGFyYW1zOiAvXlxccyooW1xcdyRdKyk6KFtcXHNcXFNdKykvLFxuICAgICAgICAgICAgY29uZGl0aW9uYWw6IC9cXHtcXHtcXD8oXFw/KT9cXHMqKFtcXHNcXFNdKj8pXFxzKlxcfVxcfS9nLFxuICAgICAgICAgICAgaXRlcmF0ZTogL1xce1xce35cXHMqKD86XFx9XFx9fChbXFxzXFxTXSs/KVxccypcXDpcXHMqKFtcXHckXSspXFxzKig/OlxcOlxccyooW1xcdyRdKykpP1xccypcXH1cXH0pL2csXG4gICAgICAgICAgICB2YXJuYW1lOiBcIml0XCIsXG4gICAgICAgICAgICBzdHJpcDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGVuZDogdHJ1ZSxcbiAgICAgICAgICAgIHNlbGZjb250YWluZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZG9Ob3RTa2lwRW5jb2RlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IHVuZGVmaW5lZCwgLy9mbiwgY29tcGlsZSB0ZW1wbGF0ZVxuICAgICAgICBjb21waWxlOiB1bmRlZmluZWQgIC8vZm4sIGZvciBleHByZXNzXG4gICAgfSwgX2dsb2JhbHM7XG5cbiAgICBkb1QuZW5jb2RlSFRNTFNvdXJjZSA9IGZ1bmN0aW9uKGRvTm90U2tpcEVuY29kZWQpIHtcbiAgICAgICAgdmFyIGVuY29kZUhUTUxSdWxlcyA9IHtcIiZcIjogXCImIzM4O1wiLCBcIjxcIjogXCImIzYwO1wiLCBcIj5cIjogXCImIzYyO1wiLCAnXCInOiBcIiYjMzQ7XCIsIFwiJ1wiOiBcIiYjMzk7XCIsIFwiL1wiOiBcIiYjNDc7XCJ9LFxuICAgICAgICAgICAgbWF0Y2hIVE1MID0gZG9Ob3RTa2lwRW5jb2RlZCA/IC9bJjw+XCInXFwvXS9nIDogLyYoPyEjP1xcdys7KXw8fD58XCJ8J3xcXC8vZztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2RlID8gY29kZS50b1N0cmluZygpLnJlcGxhY2UobWF0Y2hIVE1MLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZUhUTUxSdWxlc1ttXSB8fCBtO1xuICAgICAgICAgICAgfSkgOiBcIlwiO1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIF9nbG9iYWxzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcyB8fCAoMCwgZXZhbCkoXCJ0aGlzXCIpO1xuICAgIH0oKSk7XG5cbiAgICAvL0hpYmVyXG4gICAgLy9yZXBsYXRlIHRoZSBtb2R1bGUgZGVmaW5pdGlvbiB3aXRoIHNpbXBsZSBtb2R1bGUuZXhwb3J0cyBzaW5jZSB3ZSBvbmx5IHJ1blxuICAgIC8vaXQgaW4gbm9kZSBsaWtlIGVudmlyb25tZW50XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvVDtcbiAgICAvL2lmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy9cbiAgICAvL30gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAvL1x0ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGRvVDt9KTtcbiAgICAvL30gZWxzZSB7XG4gICAgLy9cdF9nbG9iYWxzLmRvVCA9IGRvVDtcbiAgICAvL31cblxuICAgIHZhciBzdGFydGVuZCA9IHtcbiAgICAgICAgYXBwZW5kOiB7c3RhcnQ6IFwiJysoXCIsIGVuZDogXCIpKydcIiwgc3RhcnRlbmNvZGU6IFwiJytlbmNvZGVIVE1MKFwifSxcbiAgICAgICAgc3BsaXQ6IHtzdGFydDogXCInO291dCs9KFwiLCBlbmQ6IFwiKTtvdXQrPSdcIiwgc3RhcnRlbmNvZGU6IFwiJztvdXQrPWVuY29kZUhUTUwoXCJ9XG4gICAgfSwgc2tpcCA9IC8kXi87XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlRGVmcyhjLCBibG9jaywgZGVmKSB7XG4gICAgICAgIHJldHVybiAoKHR5cGVvZiBibG9jayA9PT0gXCJzdHJpbmdcIikgPyBibG9jayA6IGJsb2NrLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAucmVwbGFjZShjLmRlZmluZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlLCBhc3NpZ24sIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZihcImRlZi5cIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUuc3Vic3RyaW5nKDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShjb2RlIGluIGRlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzc2lnbiA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLmRlZmluZVBhcmFtcykgdmFsdWUucmVwbGFjZShjLmRlZmluZVBhcmFtcywgZnVuY3Rpb24obSwgcGFyYW0sIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbY29kZV0gPSB7YXJnOiBwYXJhbSwgdGV4dDogdn07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGNvZGUgaW4gZGVmKSkgZGVmW2NvZGVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRnVuY3Rpb24oXCJkZWZcIiwgXCJkZWZbJ1wiICsgY29kZSArIFwiJ109XCIgKyB2YWx1ZSkoZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLnVzZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMudXNlUGFyYW1zKSBjb2RlID0gY29kZS5yZXBsYWNlKGMudXNlUGFyYW1zLCBmdW5jdGlvbihtLCBzLCBkLCBwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmW2RdICYmIGRlZltkXS5hcmcgJiYgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBydyA9IChkICsgXCI6XCIgKyBwYXJhbSkucmVwbGFjZSgvJ3xcXFxcL2csIFwiX1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZi5fX2V4cCA9IGRlZi5fX2V4cCB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZi5fX2V4cFtyd10gPSBkZWZbZF0udGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxbXlxcXFx3JF0pXCIgKyBkZWZbZF0uYXJnICsgXCIoW15cXFxcdyRdKVwiLCBcImdcIiksIFwiJDFcIiArIHBhcmFtICsgXCIkMlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzICsgXCJkZWYuX19leHBbJ1wiICsgcncgKyBcIiddXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdiA9IG5ldyBGdW5jdGlvbihcImRlZlwiLCBcInJldHVybiBcIiArIGNvZGUpKGRlZik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPyByZXNvbHZlRGVmcyhjLCB2LCBkZWYpIDogdjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZSgvXFxcXCgnfFxcXFwpL2csIFwiJDFcIikucmVwbGFjZSgvW1xcclxcdFxcbl0vZywgXCIgXCIpO1xuICAgIH1cblxuICAgIGRvVC50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRtcGwsIGMsIGRlZiwgZG9udFJlbmRlck51bGxPclVuZGVmaW5lZCkge1xuICAgICAgICBjID0gYyB8fCBkb1QudGVtcGxhdGVTZXR0aW5ncztcbiAgICAgICAgdmFyIGNzZSA9IGMuYXBwZW5kID8gc3RhcnRlbmQuYXBwZW5kIDogc3RhcnRlbmQuc3BsaXQsIG5lZWRodG1sZW5jb2RlLCBzaWQgPSAwLCBpbmR2LFxuICAgICAgICAgICAgc3RyID0gKGMudXNlIHx8IGMuZGVmaW5lKSA/IHJlc29sdmVEZWZzKGMsIHRtcGwsIGRlZiB8fCB7fSkgOiB0bXBsO1xuXG4gICAgICAgIHZhciB1bmVzY2FwZUNvZGU7XG5cbiAgICAgICAgc3RyID0gKFwidmFyIG91dD0nXCIgKyAoYy5zdHJpcCA/IHN0ci5yZXBsYWNlKC8oXnxcXHJ8XFxuKVxcdCogK3wgK1xcdCooXFxyfFxcbnwkKS9nLCBcIiBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJ8XFxufFxcdHxcXC9cXCpbXFxzXFxTXSo/XFwqXFwvL2csIFwiXCIpIDogc3RyKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyd8XFxcXC9nLCBcIlxcXFwkJlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5pbnRlcnBvbGF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEhZG9udFJlbmRlck51bGxPclVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB1bmVzY2FwZUNvZGUgPSB1bmVzY2FwZShjb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZignfHwnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGVDb2RlICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyAnKHR5cGVvZiAnICsgY29kZSArICcgIT09IFwidW5kZWZpbmVkXCIgJiYgJyArIGNvZGUgKyAnIT09IG51bGwpPycgKyB1bmVzY2FwZUNvZGUgKyAnOiBcIlwiJyArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5lbmNvZGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIG5lZWRodG1sZW5jb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ZW5jb2RlICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuY29uZGl0aW9uYWwgfHwgc2tpcCwgZnVuY3Rpb24obSwgZWxzZWNhc2UsIGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxzZWNhc2UgP1xuICAgICAgICAgICAgICAgICAgICAoY29kZSA/IFwiJzt9ZWxzZSBpZihcIiArIHVuZXNjYXBlKGNvZGUpICsgXCIpe291dCs9J1wiIDogXCInO31lbHNle291dCs9J1wiKSA6XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID8gXCInO2lmKFwiICsgdW5lc2NhcGUoY29kZSkgKyBcIil7b3V0Kz0nXCIgOiBcIic7fW91dCs9J1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLml0ZXJhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgaXRlcmF0ZSwgdm5hbWUsIGluYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpdGVyYXRlKSByZXR1cm4gXCInO30gfSBvdXQrPSdcIjtcbiAgICAgICAgICAgICAgICBzaWQgKz0gMTtcbiAgICAgICAgICAgICAgICBpbmR2ID0gaW5hbWUgfHwgXCJpXCIgKyBzaWQ7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZSA9IHVuZXNjYXBlKGl0ZXJhdGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnXFwnO3ZhciBhcnInICsgc2lkICsgJz0nICsgaXRlcmF0ZSArIFwiO2lmKGFyclwiICsgc2lkICsgXCIpe3ZhciBcIiArIHZuYW1lICsgXCIsXCIgKyBpbmR2ICsgXCI9LTEsbFwiICsgc2lkICsgXCI9YXJyXCIgKyBzaWQgKyBcIi5sZW5ndGgtMTt3aGlsZShcIiArIGluZHYgKyBcIjxsXCIgKyBzaWQgKyBcIil7XCJcbiAgICAgICAgICAgICAgICAgICAgKyB2bmFtZSArIFwiPWFyclwiICsgc2lkICsgXCJbXCIgKyBpbmR2ICsgXCIrPTFdO291dCs9J1wiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZXZhbHVhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIic7XCIgKyB1bmVzY2FwZShjb2RlKSArIFwib3V0Kz0nXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICArIFwiJztyZXR1cm4gb3V0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKS5yZXBsYWNlKC9cXHIvZywgXCJcXFxcclwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHN8O3xcXH18XnxcXHspb3V0XFwrPScnOy9nLCAnJDEnKS5yZXBsYWNlKC9cXCsnJy9nLCBcIlwiKTtcbiAgICAgICAgLy8ucmVwbGFjZSgvKFxcc3w7fFxcfXxefFxceylvdXRcXCs9JydcXCsvZywnJDFvdXQrPScpO1xuXG4gICAgICAgIGlmIChuZWVkaHRtbGVuY29kZSkge1xuICAgICAgICAgICAgaWYgKCFjLnNlbGZjb250YWluZWQgJiYgX2dsb2JhbHMgJiYgIV9nbG9iYWxzLl9lbmNvZGVIVE1MKSBfZ2xvYmFscy5fZW5jb2RlSFRNTCA9IGRvVC5lbmNvZGVIVE1MU291cmNlKGMuZG9Ob3RTa2lwRW5jb2RlZCk7XG4gICAgICAgICAgICBzdHIgPSBcInZhciBlbmNvZGVIVE1MID0gdHlwZW9mIF9lbmNvZGVIVE1MICE9PSAndW5kZWZpbmVkJyA/IF9lbmNvZGVIVE1MIDogKFwiXG4gICAgICAgICAgICAgICAgKyBkb1QuZW5jb2RlSFRNTFNvdXJjZS50b1N0cmluZygpICsgXCIoXCIgKyAoYy5kb05vdFNraXBFbmNvZGVkIHx8ICcnKSArIFwiKSk7XCJcbiAgICAgICAgICAgICAgICArIHN0cjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihjLnZhcm5hbWUsIHN0cik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikgY29uc29sZS5sb2coXCJDb3VsZCBub3QgY3JlYXRlIGEgdGVtcGxhdGUgZnVuY3Rpb246IFwiICsgc3RyKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9ULmNvbXBpbGUgPSBmdW5jdGlvbih0bXBsLCBkZWYpIHtcbiAgICAgICAgcmV0dXJuIGRvVC50ZW1wbGF0ZSh0bXBsLCBudWxsLCBkZWYpO1xuICAgIH07XG5cbn0oKSk7XG5cbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi9nY1V0aWxzJyk7XG5cbiAgICB2YXIgZG9tVXRpbCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbGVtZW50IGZyb20gYW4gSFRNTCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaHRtbCBIVE1MIGZyYWdtZW50IHRvIGNvbnZlcnQgaW50byBhbiBIVE1MRWxlbWVudC5cbiAgICAgKiBAcmV0dXJuIFRoZSBuZXcgZWxlbWVudC5cbiAgICAgKi9cblxuICAgIC8vcmVtb3ZlIGFsbCBjb21tZW50cyBhbmQgd2hpdGVzcGFjZSBvbmx5IHRleHQgbm9kZXNcbiAgICBmdW5jdGlvbiBjbGVhbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBuKyspIHsgLy9kbyByZXdyaXRlIGl0IHRvIGZvcih2YXIgbj0wLGxlbj1YWFg7aTxsZW47KVxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGROb2Rlc1tuXTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDggfHwgKGNoaWxkLm5vZGVUeXBlID09PSAzICYmICEvXFxTLy50ZXN0KGNoaWxkLm5vZGVWYWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBuLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhbihjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZG9tVXRpbC5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB2YXIgciA9IGRpdi5jaGlsZHJlblswXTtcbiAgICAgICAgZGl2ID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuY3JlYXRlVGVtcGxhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB2YXIgciA9IGRpdi5jaGlsZHJlblswXTtcbiAgICAgICAgY2xlYW4ocik7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuaW5uZXJIVE1MLnJlcGxhY2UoLyZhbXA7L2csICcmJykucmVwbGFjZSgvJmx0Oy9nLCAnPCcpLnJlcGxhY2UoLyZndDsvZywgJz4nKTtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50T3V0ZXJUZXh0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vdXRlckhUTUwucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhbiBlbGVtZW50IGhhcyBhIGNsYXNzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBjaGVjayBmb3IuXG4gICAgICovXG4gICAgZG9tVXRpbC5oYXNDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgY2xhc3NOYW1lICsgJ1xcXFxiJyk7XG4gICAgICAgICAgICByZXR1cm4gZSAmJiByeC50ZXN0KGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgcmVtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIHJlbW92ZSBmb3JtIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5zZXRBdHRyaWJ1dGUgJiYgZG9tVXRpbC5oYXNDbGFzcyhlLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKCdcXFxccz9cXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInLCAnZycpO1xuICAgICAgICAgICAgdmFyIGNuID0gZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbi5yZXBsYWNlKHJ4LCAnJykpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIGFkZGVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gYWRkIHRvIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuYWRkQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5zZXRBdHRyaWJ1dGUgJiYgIWRvbVV0aWwuaGFzQ2xhc3MoZSwgY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgdmFyIGNuID0gZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbiA/IGNuICsgJyAnICsgY2xhc3NOYW1lIDogY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIG9yIHJlbW92ZXMgYSBjbGFzcyB0byBvciBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgYWRkZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBhZGQgb3IgcmVtb3ZlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRkT3JSZW1vdmUgV2hldGhlciB0byBhZGQgb3IgcmVtb3ZlIHRoZSBjbGFzcy5cbiAgICAgKi9cbiAgICBkb21VdGlsLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lLCBhZGRPclJlbW92ZSkge1xuICAgICAgICBpZiAoYWRkT3JSZW1vdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRvbVV0aWwuYWRkQ2xhc3MoZSwgY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbVV0aWwucmVtb3ZlQ2xhc3MoZSwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAqKiBqUXVlcnkgcmVwbGFjZW1lbnQgbWV0aG9kc1xuICAgIC8qKlxuICAgICAqIEdldHMgYW4gZWxlbWVudCBmcm9tIGEgalF1ZXJ5LXN0eWxlIHNlbGVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fHN0cmluZ30gc2VsZWN0b3IgQW4gZWxlbWVudCwgYSBzZWxlY3RvciBzdHJpbmcsIG9yIGEgalF1ZXJ5IG9iamVjdC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmdldEVsZW1lbnQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnY1V0aWxzLmlzU3RyaW5nKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhbiBIVE1MIGVsZW1lbnQgY29udGFpbnMgYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IFBhcmVudCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gY2hpbGQgQ2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXJlbnQgZWxlbWVudCBjb250YWlucyB0aGUgY2hpbGQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmNvbnRhaW5zID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBmb3IgKHZhciBlID0gY2hpbGQ7IGU7IGUgPSBlLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChlID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgY29vcmRpbmF0ZXMgb2YgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBkb21VdGlsLm9mZnNldCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCArIGVsZW1lbnQuc2Nyb2xsVG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgZWxlbWVudC5zY3JvbGxMZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGJvdW5kaW5nIHJlY3RhbmdsZSBvZiBhbiBlbGVtZW50IGluIHBhZ2UgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHNpbWlsYXIgdG8gdGhlIDxiPmdldEJvdW5kaW5nQ2xpZW50UmVjdDwvYj4gZnVuY3Rpb24sXG4gICAgICogZXhjZXB0IHRoYXQgdXNlcyB3aW5kb3cgY29vcmRpbmF0ZXMsIHdoaWNoIGNoYW5nZSB3aGVuIHRoZVxuICAgICAqIGRvY3VtZW50IHNjcm9sbHMuXG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50UmVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHJjID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IHJjLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICB0b3A6IHJjLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIHdpZHRoOiByYy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcmMuaGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaW5uZXIgY29udGVudCByZWN0YW5nbGUgb2YgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBQYWRkaW5nIGFuZCBib3gtc2l6aW5nIGlzIGNvbnNpZGVyZWQuXG4gICAgICogVGhlIHJlc3VsdCBpcyB0aGUgYWN0dWFsIHJlY3RhbmdsZSB0byBwbGFjZSBjaGlsZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSBlIHJlcHJlc2VudCB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0Q29udGVudFJlY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciByYyA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMuZ2V0U3R5bGUoZSk7XG4gICAgICAgIHZhciBtZWFzdXJlbWVudHMgPSBbXG4gICAgICAgICAgICAncGFkZGluZ0xlZnQnLFxuICAgICAgICAgICAgJ3BhZGRpbmdSaWdodCcsXG4gICAgICAgICAgICAncGFkZGluZ1RvcCcsXG4gICAgICAgICAgICAncGFkZGluZ0JvdHRvbScsXG4gICAgICAgICAgICAnYm9yZGVyTGVmdFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJSaWdodFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJUb3BXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyQm90dG9tV2lkdGgnXG4gICAgICAgIF07XG4gICAgICAgIHZhciBzaXplID0ge307XG4gICAgICAgIG1lYXN1cmVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHN0eWxlW3Byb3BdKTtcbiAgICAgICAgICAgIHNpemVbcHJvcF0gPSAhaXNOYU4obnVtKSA/IG51bSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcGFkZGluZ1dpZHRoID0gc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUucGFkZGluZ1JpZ2h0O1xuICAgICAgICB2YXIgcGFkZGluZ0hlaWdodCA9IHNpemUucGFkZGluZ1RvcCArIHNpemUucGFkZGluZ0JvdHRvbTtcbiAgICAgICAgdmFyIGJvcmRlcldpZHRoID0gc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLmJvcmRlclJpZ2h0V2lkdGg7XG4gICAgICAgIHZhciBib3JkZXJIZWlnaHQgPSBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IHJjLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgKyBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUucGFkZGluZ0xlZnQsXG4gICAgICAgICAgICB0b3A6IHJjLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCArIHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLnBhZGRpbmdUb3AsXG4gICAgICAgICAgICB3aWR0aDogcmMud2lkdGggLSBwYWRkaW5nV2lkdGggLSBib3JkZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcmMuaGVpZ2h0IC0gcGFkZGluZ0hlaWdodCAtIGJvcmRlckhlaWdodFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNb2RpZmllcyB0aGUgc3R5bGUgb2YgYW4gZWxlbWVudCBieSBhcHBseWluZyB0aGUgcHJvcGVydGllcyBzcGVjaWZpZWQgaW4gYW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgd2hvc2Ugc3R5bGUgd2lsbCBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3NzIE9iamVjdCBjb250YWluaW5nIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuc2V0Q3NzID0gZnVuY3Rpb24oZSwgY3NzKSB7XG4gICAgICAgIHZhciBzID0gZS5zdHlsZTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjc3MpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjc3NbcF07XG4gICAgICAgICAgICBpZiAoZ2NVdGlscy5pc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHAubWF0Y2goL3dpZHRofGhlaWdodHxsZWZ0fHRvcHxyaWdodHxib3R0b218c2l6ZXxwYWRkaW5nfG1hcmdpbicvaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9ICdweCc7IC8vIGRlZmF1bHQgdW5pdCBmb3IgZ2VvbWV0cnkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNbcF0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFNjcm9sbGJhclNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaXYgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOi0xMDAwMHB4OyBsZWZ0Oi0xMDAwMHB4OyB3aWR0aDoxMDBweDsgaGVpZ2h0OjEwMHB4OyBvdmVyZmxvdzpzY3JvbGw7XCI+PC9kaXY+Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgZG9tVXRpbC5zY3JvbGxiYXJTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGRpdi5vZmZzZXRXaWR0aCAtIGRpdi5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogZGl2Lm9mZnNldEhlaWdodCAtIGRpdi5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcblxuICAgICAgICByZXR1cm4gZG9tVXRpbC5zY3JvbGxiYXJTaXplO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFN0eWxlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgZm4gPSBnZXRDb21wdXRlZFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xuICAgICAgICBpZiAoZWxlbWVudCAmJiBmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuKGVsZW1lbnQsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFN0eWxlVmFsdWUgPSBmdW5jdGlvbihlbGVtZW50LCBzdHlsZVByb3BlcnR5KSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvbVV0aWwuZ2V0U3R5bGUoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBzdHlsZSA/IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoc3R5bGVQcm9wZXJ0eSkgOiBudWxsO1xuICAgIH07XG5cbiAgICBkb21VdGlsLkdldE1heFN1cHBvcnRlZENTU0hlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoID0gMTAwMDAwMDtcbiAgICAgICAgdmFyIHRlc3RVcFRvID0gNjAwMDAwMCAqIDEwMDA7XG4gICAgICAgIHZhciBkaXYgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIi8+Jyk7XG4gICAgICAgIHZhciB0ZXN0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB0ZXN0ID0gaCArIDUwMDAwMDsgLy8qIDI7XG4gICAgICAgICAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gdGVzdCArICdweCc7XG4gICAgICAgICAgICBpZiAodGVzdCA+IHRlc3RVcFRvIHx8IGRpdi5vZmZzZXRIZWlnaHQgIT09IHRlc3QpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGggPSB0ZXN0O1xuICAgICAgICB9XG4gICAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG4gICAgICAgIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0ID0gaDtcbiAgICAgICAgcmV0dXJuIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0O1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvbVV0aWw7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZG9tVXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJDYXJkTGF5b3V0RW5naW5lLmpzIn0=