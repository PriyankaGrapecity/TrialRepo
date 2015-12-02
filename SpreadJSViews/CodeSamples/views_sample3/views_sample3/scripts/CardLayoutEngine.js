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
	            },
	
	            unRegisteEvents_: function() {
	                var self = this;
	                self.grid.onMouseWheel.removeHandler(handleMouseWheel);
	                self.grid.onMouseClick.removeHandler(handleMouseClick);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKioqIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1YzQ4NzM5ODQxNjQxOTBhNGU4ZT8xMGJjKioqKiIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2xheW91dEVuZ2luZXMvQ2FyZExheW91dEVuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanM/YzgyZCoqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanM/NDkyOCoqKioiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzP2QwY2QqKioqIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsNkRBQTZELGlGQUFpRix1R0FBdUc7QUFDaFMsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUEyQztBQUMzQyxvREFBbUQ7QUFDbkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7Ozs7OztBQzNyREE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxZQUFZO0FBQ3ZCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckIseUNBQXdDLEtBQUssV0FBVyxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUI7QUFDdkI7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQix5Q0FBd0MsS0FBSyxXQUFXLFVBQVU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBbUMsZ0JBQWdCO0FBQ25EO0FBQ0Esd0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDO0FBQzFDLGtCQUFpQjtBQUNqQixzQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQThCO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQTZF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QTtBQUNBOztBQUVBLHdFQUF1RSxjQUFjLGVBQWUsYUFBYSxjQUFjLGlCQUFpQjtBQUNoSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJDYXJkTGF5b3V0RW5naW5lXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkdjU3ByZWFkXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXVtcIkNhcmRMYXlvdXRFbmdpbmVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA1YzQ4NzM5ODQxNjQxOTBhNGU4ZVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi4vZ2NVdGlscycpO1xuICAgICAgICB2YXIgZG9UID0gcmVxdWlyZSgnLi4vZG9ULmpzJyk7XG4gICAgICAgIHZhciBkb21VdGlsID0gcmVxdWlyZSgnLi4vZG9tVXRpbCcpO1xuXG4gICAgICAgIHZhciBQT1NfQUJTID0gJ2Fic29sdXRlJztcbiAgICAgICAgdmFyIFBPU19SRUwgPSAncmVsYXRpdmUnO1xuICAgICAgICB2YXIgT1ZFUkZMT1dfSElEREVOID0gJ2hpZGRlbic7XG4gICAgICAgIHZhciBPVkVSRkxPV19BVVRPID0gJ2F1dG8nO1xuICAgICAgICB2YXIgVklFV1BPUlQgPSAndmlld3BvcnQnO1xuICAgICAgICB2YXIgSE9SSVpPTlRBTCA9ICdob3Jpem9udGFsJztcbiAgICAgICAgdmFyIFZFUlRJQ0FMID0gJ3ZlcnRpY2FsJztcbiAgICAgICAgdmFyIFJUTF9DTEFTU19OQU1FID0gJ2djLXJ0bCc7XG4gICAgICAgIHZhciBHUk9VUF9IRUFERVIgPSAnZ3JvdXBIZWFkZXInO1xuICAgICAgICB2YXIgR1JPVVBfRk9PVEVSID0gJ2dyb3VwRm9vdGVyJztcbiAgICAgICAgdmFyIEdST1VQX0NPTlRFTlQgPSAnZ3JvdXBDb250ZW50JztcbiAgICAgICAgdmFyIERFRkFVTFRfSEVBREVSX0hFSUdIVCA9IDQwO1xuICAgICAgICB2YXIgR1JPVVBfSU5ERU5UID0gMTg7XG5cbiAgICAgICAgdmFyIENhcmRMYXlvdXRFbmdpbmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9uRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgY2FyZEhlaWdodDogMjU2LFxuICAgICAgICAgICAgICAgIGNhcmRXaWR0aDogMjU2LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogSE9SSVpPTlRBTCxcbiAgICAgICAgICAgICAgICBzaG93U2Nyb2xsQmFyOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJpZ2h0VG9MZWZ0OiBmYWxzZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSBudWxsO1xuXG4gICAgICAgICAgICBzZWxmLm5hbWUgPSAnQ2FyZExheW91dEVuZ2luZSc7IC8vbmFtZSBtdXN0IGVuZCB3aXRoIExheW91dEVuZ2luZVxuICAgICAgICAgICAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBvcHRpb25EZWZhdWx0cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2FyZExheW91dEVuZ2luZS5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBnZXRDb2x1bW5EZWZhdWx0c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93U29ydGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93RWRpdGluZzogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oZ3JpZCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHNlbGYuZ3JpZCA9IGdyaWQ7XG4gICAgICAgICAgICAgICAgZ3JpZC5jb2x1bW5zID0gXy5tYXAoZ3JpZC5jb2x1bW5zLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoY29sLCBfLmRlZmF1bHRzKHNlbGYuZ2V0Q29sdW1uRGVmYXVsdHNfKCksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBjb2wuZGF0YUZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FwdGlvbjogY29sLmRhdGFGaWVsZFxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldExheW91dEluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5nZXRMYXlvdXRJbmZvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmxheW91dEluZm9fIHx8IChzZWxmLmxheW91dEluZm9fID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld3BvcnQ6IGdldFZpZXdwb3J0TGF5b3V0SW5mb18uY2FsbCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNsZWFyUmVuZGVyQ2FjaGVfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ncm91cFN0cmF0ZWd5Xy5jbGVhclJlbmRlckNhY2hlXygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmxheW91dEluZm9fID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLnJvd1RlbXBsYXRlRm5fID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmhhc1Njcm9sbEJhcnNfID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLmNhY2hlZENvbnRhaW5lclNpemVXaXRob3V0U2Nyb2xsQmFyXyA9IG51bGw7XG4gICAgICAgICAgICAgICAgc2VsZi5jYWNoZWRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8gPSBudWxsO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0UmVuZGVySW5mbzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5ncm91cFN0cmF0ZWd5Xy5nZXRSZW5kZXJJbmZvKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZVJvd3MgPSBvcHRpb25zLmluY2x1ZGVSb3dzIHx8IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGFyZWEgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFyZWEpIHx8ICcnO1xuICAgICAgICAgICAgICAgIGlmICghYXJlYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXRFbmdpbmVPcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gbGF5b3V0RW5naW5lT3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBsYXlvdXRJbmZvLndpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBsYXlvdXRJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgcjtcbiAgICAgICAgICAgICAgICB2YXIgaGFzU2Nyb2xsQmFycyA9IHNjb3BlLmhhc1Njcm9sbEJhcl8oKTtcbiAgICAgICAgICAgICAgICB2YXIgb3V0ZXJEaXZMZWZ0ID0gcmlnaHRUb0xlZnQgJiYgaGFzU2Nyb2xsQmFycy52ZXJ0aWNhbCA/IGxheW91dEluZm8ubGVmdCArIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoIDogbGF5b3V0SW5mby5sZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBpbm5lckRpdkxlZnQgPSByaWdodFRvTGVmdCAmJiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkgPyBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCAtIG9wdGlvbnMub2Zmc2V0TGVmdCAtIHdpZHRoIDogLW9wdGlvbnMub2Zmc2V0TGVmdDtcblxuICAgICAgICAgICAgICAgIHIgPSB7XG4gICAgICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy12aWV3cG9ydCcgKyAocmlnaHRUb0xlZnQgPyAnICcgKyBSVExfQ0xBU1NfTkFNRSA6ICcnKSxcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGxheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogb3V0ZXJEaXZMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBsYXlvdXRJbmZvLmNvbnRlbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXZUcmFuc2xhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGlubmVyRGl2TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogLW9wdGlvbnMub2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkUm93czogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlUm93cykge1xuICAgICAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IGdldFJlbmRlckluZm9JbnRlcm5hbF8uY2FsbChzY29wZSwgZGlyZWN0aW9uLCBsYXlvdXRJbmZvLCBvcHRpb25zLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0UmVuZGVyUmFuZ2VfOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlclJhbmdlXyhvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgYXJlYSA9IChvcHRpb25zICYmIG9wdGlvbnMuYXJlYSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSb3dzUmVuZGVyUmFuZ2VfLmNhbGwoc2NvcGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0UmVuZGVyUm93SW5mb186IGZ1bmN0aW9uKHJvdywgYXJlYSkge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5ncm91cFN0cmF0ZWd5Xy5nZXRSZW5kZXJSb3dJbmZvXyhyb3csIGFyZWEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZm8gPSByb3cuaW5mbztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhpbmZvLnBhdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gb3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHJvdy5rZXk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gcm93LmJvdW5kcztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRHcm91cEhlYWRlclJvd18uY2FsbChzY29wZSwga2V5LCBpbmZvLCBncm91cEluZm8sIHJlY3QsIGRpcmVjdGlvbiwgcmlnaHRUb0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwQ29udGVudFJvd18uY2FsbChzY29wZSwga2V5LCByb3cuaW5kZXgsIHJlY3QsIGdyb3VwSW5mbywgcmlnaHRUb0xlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwRm9vdGVyUm93Xy5jYWxsKHNjb3BlLCBrZXksIGluZm8sIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UmVuZGVyUm93SW5mb0ludGVybmFsLmNhbGwoc2NvcGUsIHJvdy5rZXksIHJvdy5zdHlsZSwgcm93LmluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRSb3dUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFRlbXBsYXRlXy5jYWxsKHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNob3dTY3JvbGxQYW5lbDogZnVuY3Rpb24oYXJlYSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5zaG93U2Nyb2xsUGFuZWwoYXJlYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5vcHRpb25zLnNob3dTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJlYS50b0xvd2VyQ2FzZSgpID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheW91dEluZm8uaGVpZ2h0IDwgbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0IHx8IGxheW91dEluZm8ud2lkdGggPCBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNTY3JvbGxhYmxlQXJlYV86IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uaXNTY3JvbGxhYmxlQXJlYV8oYXJlYSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZWEudG9Mb3dlckNhc2UoKSA9PT0gVklFV1BPUlQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRTY3JvbGxQYW5lbFJlbmRlckluZm86IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uZ2V0U2Nyb2xsUGFuZWxSZW5kZXJJbmZvKGFyZWEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJlYS50b0xvd2VyQ2FzZSgpID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYXNTY3JvbGxCYXIgPSBzZWxmLmhhc1Njcm9sbEJhcl8oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy1ncmlkLXZpZXdwb3J0LXNjcm9sbC1wYW5lbCBzY3JvbGwtbGVmdCBzY3JvbGwtdG9wJyArIChzZWxmLm9wdGlvbnMucmlnaHRUb0xlZnQgPyAnICcgKyBSVExfQ0xBU1NfTkFNRSA6ICcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmhlaWdodCArIChoYXNTY3JvbGxCYXIuaG9yaXpvbnRhbCA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodCA6IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC53aWR0aCArIChoYXNTY3JvbGxCYXIudmVydGljYWwgPyBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCA6IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19BVVRPXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnRMYXlvdXQuY29udGVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQuY29udGVudFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaGFzU2Nyb2xsQmFyXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzU2Nyb2xsQmFyc18pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmhhc1Njcm9sbEJhcnNfO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBsYXlvdXRJbmZvLmhlaWdodCA8IGxheW91dEluZm8uY29udGVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGxheW91dEluZm8ud2lkdGggPCBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldEdyb3VwSW5mb0RlZmF1bHRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBTdHJhdGVneV8uZ2V0R3JvdXBJbmZvRGVmYXVsdHNfKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZVdpdGhHcm91cDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRJbml0aWFsU2Nyb2xsT2Zmc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHRoaXMuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogb3B0aW9ucy5yaWdodFRvTGVmdCAmJiAob3B0aW9ucy5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSA/IGxheW91dEluZm8uY29udGVudFdpZHRoIC0gbGF5b3V0SW5mby53aWR0aCA6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5pdEdyb3VwSW5mb3NIZWlnaHRfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uaW5pdEdyb3VwSW5mb3NIZWlnaHRfKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBncm91cEluZm9zID0gc2VsZi5ncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBncm91cEluZm9zW2ldLmhlaWdodCA9IHNlbGYuZ2V0R3JvdXBIZWlnaHRfKGdyb3VwSW5mb3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldEdyb3VwSGVpZ2h0XzogZnVuY3Rpb24oZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWdjVXRpbHMuaXNVbmRlZmluZWQoZ3JvdXBJbmZvLmhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgc2lkZUxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5oZWFkZXI7XG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlciAmJiBoZWFkZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBzaWRlTGVuZ3RoICs9IHNjb3BlLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8uY2FsbChzY29wZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkR3JvdXA7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPSBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUuaGVpZ2h0IC8gb3B0aW9ucy5jYXJkSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gZ3JvdXAuaXNCb3R0b21MZXZlbCA/IGdyb3VwLml0ZW1Db3VudCA6IGdyb3VwSW5mby5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWRlTGVuZ3RoICs9IE1hdGguY2VpbChsZW4gLyBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBzY29wZS5nZXRSb3dIZWlnaHRfKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdyb3VwID0gZ3JvdXBJbmZvLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR3JvdXAuaGVpZ2h0ID0gc2NvcGUuZ2V0R3JvdXBIZWlnaHRfKGNoaWxkR3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGggKz0gY2hpbGRHcm91cC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2lkZUxlbmd0aCArPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvb3RlciAmJiBmb290ZXIudmlzaWJsZSAmJiAhZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWRlTGVuZ3RoICs9IHNjb3BlLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZGVMZW5ndGg7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdyb3VwU3RyYXRlZ3lfLmhhbmRsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgICAgICAgICBncmlkLnNjcm9sbFJlbmRlclBhcnRfKFZJRVdQT1JUKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoaXRUZXN0OiBmdW5jdGlvbihldmVudEFyZ3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZ3JvdXBTdHJhdGVneV8uaGl0VGVzdChldmVudEFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IGV2ZW50QXJncy5wYWdlWDtcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gZXZlbnRBcmdzLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgICAgICAgICAvL2dldCBjb250YWluZXIgcGFkZGluZyBhbmQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVySW5mbyA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IGxlZnQgLSBjb250YWluZXJJbmZvLmxlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IHRvcCAtIGNvbnRhaW5lckluZm8udG9wO1xuICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBvZmZzZXRUb3BcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudFdpZHRoID0gbGF5b3V0SW5mby5jb250ZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBvcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBvcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZEhlaWdodCA9IG9wdGlvbnMuY2FyZEhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPSBsYXlvdXRJbmZvLmNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBoaXRUZXN0SW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogJycsXG4gICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzogbnVsbFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIGxlbjtcblxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGluQ29udGVudFJlbGF0aXZlTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcyA9IGdyaWQuZ3JvdXBJbmZvc187XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlckhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mbztcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgICAgICAgICAgdmFyIHJvdztcbiAgICAgICAgICAgICAgICAvL2lmIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgdmFyIGluVmlld1BvcnQ7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gSE9SSVpPTlRBTCAmJiByaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsQmFyV2lkdGggPSBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaW5WaWV3UG9ydCA9IGNvbnRhaW5zMmRfKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxheW91dEluZm8ubGVmdCArIHNjcm9sbEJhcldpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBsYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBsYXlvdXRJbmZvLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBsYXlvdXRJbmZvLmhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9LCBwb2ludCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5WaWV3UG9ydCA9IGNvbnRhaW5zMmRfKGxheW91dEluZm8sIHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluVmlld1BvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8uYXJlYSA9IFZJRVdQT1JUO1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IGdyaWQuc2Nyb2xsT2Zmc2V0LmxlZnQgLSBsYXlvdXRJbmZvLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCArPSBncmlkLnNjcm9sbE9mZnNldC50b3AgLSBsYXlvdXRJbmZvLnRvcDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gcmlnaHRUb0xlZnQgPyBjb250ZW50V2lkdGggLSBvZmZzZXRMZWZ0IC0gZ3JpZC5zY3JvbGxPZmZzZXQubGVmdCA6IG9mZnNldExlZnQgKyBncmlkLnNjcm9sbE9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gb2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvcyB8fCBncm91cEluZm9zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNvbnRlbnRSZWxhdGl2ZUxlZnQgPSBvZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBjYXJkV2lkdGgpICogY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKyBNYXRoLmZsb29yKGluQ29udGVudFJlbGF0aXZlTGVmdCAvIGNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNvbnRlbnRSZWxhdGl2ZUxlZnQgPSByaWdodFRvTGVmdCA/IGxheW91dEluZm8ud2lkdGggLSBvZmZzZXRMZWZ0IDogb2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKGhlaWdodCAvIGNhcmRIZWlnaHQpICogY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKyBNYXRoLmZsb29yKGluQ29udGVudFJlbGF0aXZlTGVmdCAvIGNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID49IGdyaWQuZGF0YS5pdGVtQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLnJvdyA9IHJvdztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwSW5mb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncm91cEluZm9zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVySGVpZ2h0ID0gc2NvcGUuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEhlaWdodCA9IGdyb3VwSW5mby5jb2xsYXBzZWQgPyAoaGVhZGVySGVpZ2h0ICsgKGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXIuY29sbGFwc2VXaXRoR3JvdXAgPyAwIDogc2NvcGUuZ2V0R3JvdXBGb290ZXJIZWlnaHRfKGdyb3VwKSkpIDogZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2Zmc2V0VG9wIDwgZ3JvdXBIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RHcm91cF8uY2FsbChzY29wZSwgZ3JvdXBJbmZvLCBvZmZzZXRMZWZ0LCBvZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3AgLT0gZ3JvdXBIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXBTdHJhdGVneV8uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVuUmVnaXN0ZUV2ZW50c18oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIganNvbk9iaiA9IHt9O1xuICAgICAgICAgICAgICAgIGpzb25PYmoubmFtZSA9IHNlbGYubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZE9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5jYXJkSGVpZ2h0ICE9PSAyNTYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZE9wdGlvbnMuY2FyZEhlaWdodCA9IG9wdGlvbnMuY2FyZEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2FyZFdpZHRoICE9PSAyNTYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZE9wdGlvbnMuY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAhPT0gSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5kaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd1Njcm9sbEJhciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5zaG93U2Nyb2xsQmFyID0gb3B0aW9ucy5zaG93U2Nyb2xsQmFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yaWdodFRvTGVmdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZE9wdGlvbnMucmlnaHRUb0xlZnQgPSBvcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yb3dUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXJkT3B0aW9ucy5yb3dUZW1wbGF0ZSA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ncm91cFN0cmF0ZWd5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRPcHRpb25zLmdyb3VwU3RyYXRlZ3kgPSBvcHRpb25zLmdyb3VwU3RyYXRlZ3kudG9KU09OKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghXy5pc0VtcHR5KGNhcmRPcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICBqc29uT2JqLm9wdGlvbnMgPSBjYXJkT3B0aW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb25PYmo7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRJbm5lckdyb3VwSGVpZ2h0OiBmdW5jdGlvbihncm91cEluZm8sIGNvbnRhaW5lclNpemUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChncm91cEluZm8uZGF0YS5pdGVtQ291bnQgLyBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUud2lkdGggLyBvcHRpb25zLmNhcmRXaWR0aCkpICogc2VsZi5nZXRSb3dIZWlnaHRfKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRJbm5lckdyb3VwUmVuZGVySW5mbzogZnVuY3Rpb24oZ3JvdXBJbmZvLCBjb250YWluZXJTaXplLCBsYXlvdXRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0UG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPSAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkgPyBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUuaGVpZ2h0IC8gb3B0aW9ucy5jYXJkSGVpZ2h0KSA6IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgICAgIHZhciByb3dIZWlnaHQgPSBzZWxmLmdldFJvd0hlaWdodF8oKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXQ7XG4gICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxTdHlsZTtcbiAgICAgICAgICAgICAgICB2YXIgYWRkaXRpb25hbENTU0NsYXNzO1xuICAgICAgICAgICAgICAgIHZhciByZW5kZXJSZWN0O1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSGVpZ2h0ID0gb3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBvcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cC5pdGVtQ291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGF5b3V0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dCA9IGxheW91dENhbGxiYWNrKGdyb3VwSW5mbywgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsQ1NTQ2xhc3MgPSBsYXlvdXQuY3NzQ2xhc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUgPSBsYXlvdXQuc3R5bGUgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUud2lkdGggPSBvcHRpb25zLml0ZW1XaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXlvdXRCb3VuZCA9IGxheW91dC5sb2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXlvdXRCb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogbGF5b3V0Qm91bmQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBsYXlvdXRCb3VuZC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjYXJkV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgaSwgcmVuZGVyUmVjdCwgZmFsc2UsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IChpICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0KSA6IHN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBzdGFydFBvc2l0aW9uIDogKGkgJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAqIGNhcmRXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBncm91cEluZm8sIGksIHJlbmRlclJlY3QsIGZhbHNlLCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPT09IGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uICs9IHJvd0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUgPSB7d2lkdGg6IG9wdGlvbnMuaXRlbVdpZHRofTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gKGkgJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAqIGNhcmRIZWlnaHQpIDogc3RhcnRQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gc3RhcnRQb3NpdGlvbiA6IChpICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkV2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldFJlbmRlcmVkR3JvdXBDb250ZW50SXRlbUluZm9fLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLCBpLCByZW5kZXJSZWN0LCBmYWxzZSwgbnVsbCwgYWRkaXRpb25hbFN0eWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID09PSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uICs9IHJvd0hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldE1heFZpc2libGVJdGVtQ291bnQ6IGZ1bmN0aW9uKGNvbnRhaW5lclNpemUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zUGVyUm93ID0gKG9wdGlvbnMuZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpIDogTWF0aC5mbG9vcihjb250YWluZXJTaXplLndpZHRoIC8gb3B0aW9ucy5jYXJkV2lkdGgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXNQZXJSb3cgKiAoKG9wdGlvbnMuZGlyZWN0aW9uID09PSBWRVJUSUNBTCkgPyBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUud2lkdGggLyBvcHRpb25zLmNhcmRXaWR0aCkgOiBNYXRoLmZsb29yKGNvbnRhaW5lclNpemUuaGVpZ2h0IC8gb3B0aW9ucy5jYXJkSGVpZ2h0KSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoaXRUZXN0R3JvdXBDb250ZW50XzogZnVuY3Rpb24oZ3JvdXBJbmZvLCBhcmVhLCBsZWZ0LCB0b3AsIGNvbnRhaW5lclNpemUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJlYSAhPT0gVklFV1BPUlQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRXaWR0aCA9IG9wdGlvbnMuY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSGVpZ2h0ID0gb3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtc1BlclJvdyA9IChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSA/IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBjYXJkSGVpZ2h0KSA6IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIGNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IC0xO1xuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IE1hdGguZmxvb3IobGVmdCAvIGNhcmRXaWR0aCkgKiBpdGVtc1BlclJvdyArIE1hdGguZmxvb3IodG9wIC8gY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcih0b3AgLyBjYXJkSGVpZ2h0KSAqIGl0ZW1zUGVyUm93ICsgTWF0aC5mbG9vcihsZWZ0IC8gY2FyZFdpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvdyA+PSBncm91cC5pdGVtQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IFZJRVdQT1JULFxuICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICBncm91cEluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0NPTlRFTlQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogcm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFJvd0hlaWdodF86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gdGhpcy5vcHRpb25zLmNhcmRXaWR0aCA6IHRoaXMub3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0R3JvdXBIZWFkZXJIZWlnaHRfOiBmdW5jdGlvbihncm91cCkge1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuaGVhZGVyO1xuICAgICAgICAgICAgICAgIHJldHVybiAoaGVhZGVyICYmIGhlYWRlci52aXNpYmxlKSA/IChoZWFkZXIuaGVpZ2h0IHx8IERFRkFVTFRfSEVBREVSX0hFSUdIVCkgOiAwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0R3JvdXBGb290ZXJIZWlnaHRfOiBmdW5jdGlvbihncm91cCkge1xuICAgICAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSA/IChmb290ZXIuaGVpZ2h0IHx8IERFRkFVTFRfSEVBREVSX0hFSUdIVCkgOiAwO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVnaXN0ZUV2ZW50c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLmdyaWQub25Nb3VzZVdoZWVsLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VXaGVlbCk7XG4gICAgICAgICAgICAgICAgc2VsZi5ncmlkLm9uTW91c2VDbGljay5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2spO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdW5SZWdpc3RlRXZlbnRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuZ3JpZC5vbk1vdXNlV2hlZWwucmVtb3ZlSGFuZGxlcihoYW5kbGVNb3VzZVdoZWVsKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdyaWQub25Nb3VzZUNsaWNrLnJlbW92ZUhhbmRsZXIoaGFuZGxlTW91c2VDbGljayk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYW5kbGVUZW1wbGF0ZUNoYW5nZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY2FuRG9Td2lwZV86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNhblN0YXJ0U3dpcGVfOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhpdFRlc3RHcm91cF8oZ3JvdXBJbmZvLCBsZWZ0LCB0b3ApIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuO1xuICAgICAgICAgICAgdmFyIGNoaWxkO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9IHNlbGYuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJIZWlnaHQgPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICB2YXIgZ3JvdXBIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZ3JvdXBQYXRoID0gZ3JvdXBJbmZvLnBhdGg7XG4gICAgICAgICAgICB2YXIgdG9nZ2xlRWxlbWVudDtcbiAgICAgICAgICAgIHZhciBvbkV4cGFuZFRvZ2dsZTtcbiAgICAgICAgICAgIGlmICh0b3AgPCBoZWFkZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhlYWRlckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLmdyaWQudWlkICsgJy1naCcgKyBncm91cFBhdGguam9pbignXycpKTtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVFbGVtZW50ID0gaGVhZGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2MtZ3JvdXBpbmctdG9nZ2xlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVPZmZzZXQgPSBkb21VdGlsLm9mZnNldCh0b2dnbGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdCh0b2dnbGVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRPZmZzZXQgPSBkb21VdGlsLm9mZnNldChoZWFkZXJFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zMmRfLmNhbGwoc2VsZiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGVsZU9mZnNldC5sZWZ0IC0gaGVhZGVyRWxlbWVudE9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogZWxlT2Zmc2V0LnRvcCAtIGhlYWRlckVsZW1lbnRPZmZzZXQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50UmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGVsZW1lbnRSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge2xlZnQ6IGxlZnQsIHRvcDogdG9wfSwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXhwYW5kVG9nZ2xlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZTogb25FeHBhbmRUb2dnbGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b3AgLT0gaGVhZGVySGVpZ2h0O1xuICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgaGl0VGVzdEluZm8gPSBzZWxmLmhpdFRlc3RHcm91cENvbnRlbnRfKGdyb3VwSW5mbywgVklFV1BPUlQsIGxlZnQsIHRvcCwge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0SW5mby5jb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFoaXRUZXN0SW5mbykgeyAvL211c3QgYmUgZm9vdGVyP1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9GT09URVJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGdyb3VwSW5mby5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBncm91cEhlaWdodCA9IGNoaWxkLmNvbGxhcHNlZCA/IChoZWFkZXJIZWlnaHQgKyAoZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwID8gMCA6IGZvb3RlckhlaWdodCkpIDogY2hpbGQuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDw9IGdyb3VwSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEdyb3VwXy5jYWxsKHNlbGYsIGNoaWxkcmVuW2ldLCBsZWZ0LCB0b3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRvcCAtPSBncm91cEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFJvd3NSZW5kZXJSYW5nZV8ob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBsYXlvdXRFbmdpbmVPcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBsYXlvdXRFbmdpbmVPcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciByZXZlcnNlID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdCAmJiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdDogcmV2ZXJzZSA/IGxheW91dEluZm8uY29udGVudFdpZHRoIC0gbGF5b3V0SW5mby53aWR0aCAtIG9wdGlvbnMub2Zmc2V0TGVmdCA6IC1vcHRpb25zLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBnZXRSZW5kZXJJbmZvSW50ZXJuYWxfLmNhbGwoc2NvcGUsIGRpcmVjdGlvbiwgbGF5b3V0SW5mbywgb3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSZW5kZXJJbmZvSW50ZXJuYWxfKGRpcmVjdGlvbiwgbGF5b3V0SW5mbywgb3B0aW9ucywgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHZpc2libGVSYW5nZSA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IG9wdGlvbnMub2Zmc2V0TGVmdCA6IG9wdGlvbnMub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIGVuZDogZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/IG9wdGlvbnMub2Zmc2V0TGVmdCArIGxheW91dEluZm8ud2lkdGggOiBvcHRpb25zLm9mZnNldFRvcCArIGxheW91dEluZm8uaGVpZ2h0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUuZ3JpZC5kYXRhLmdyb3Vwcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEdyb3VwSXRlbXNJbmZvXy5jYWxsKHNjb3BlLCB2aXNpYmxlUmFuZ2UsIGdldFVwZGF0ZVJvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSZW5kZXJlZEl0ZW1zSW5mb18uY2FsbChzY29wZSwgdmlzaWJsZVJhbmdlLCBnZXRVcGRhdGVSb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzY29wZS5jYWNoZWRDb250YWluZXJTaXplV2l0aG91dFNjcm9sbEJhcl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lckluZm8gPSBzY29wZS5ncmlkLmdldENvbnRhaW5lckluZm9fKCk7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IGNvbnRhaW5lckluZm8uY29udGVudFJlY3Q7XG5cbiAgICAgICAgICAgIHNjb3BlLmNhY2hlZENvbnRhaW5lclNpemVXaXRob3V0U2Nyb2xsQmFyXyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzY29wZS5jYWNoZWRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gc2NvcGUub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgc2hvd1Njcm9sbEJhciA9IHNjb3BlLm9wdGlvbnMuc2hvd1Njcm9sbEJhcjtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gY29udGFpbmVyU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBjb250YWluZXJTaXplLmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKHNjb3BlLmdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd1Njcm9sbEJhciAmJiAhaXNHcm91cEZpdFRoZUNvbnRhaW5lcl8uY2FsbChzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzaG93U2Nyb2xsQmFyICYmICFpc1VuZ3JvdXBlZEZpdFRoZUNvbnRhaW5lcl8uY2FsbChzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmhhc1Njcm9sbEJhcnNfID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmNhY2hlZENvbnRhaW5lclNpemVXaXRoU2Nyb2xsQmFyXyA9IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FjaGVkQ29udGFpbmVyU2l6ZVdpdGhTY3JvbGxCYXJfO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNHcm91cEZpdFRoZUNvbnRhaW5lcl8oKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHNjb3BlLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciByYXdDb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgdmFyIGhlaWdodFRocmVzaG9sZCA9IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyByYXdDb250YWluZXJTaXplLndpZHRoIDogcmF3Q29udGFpbmVyU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY3VyckhlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgZ3JvdXBzID0gc2NvcGUuZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbiA9IGdyb3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjdXJySGVpZ2h0ICs9IGdldFRlc3RHcm91cEhlaWdodF8uY2FsbChzY29wZSwgZ3JvdXBzW2ldLCBoZWlnaHRUaHJlc2hvbGQsIDApO1xuICAgICAgICAgICAgICAgIGlmIChjdXJySGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJySGVpZ2h0IDw9IGhlaWdodFRocmVzaG9sZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzVW5ncm91cGVkRml0VGhlQ29udGFpbmVyXygpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGF0YUxlbmd0aCA9IGdyaWQuZGF0YS5pdGVtQ291bnQ7XG4gICAgICAgICAgICB2YXIgcmF3Q29udGFpbmVyU2l6ZSA9IGdldENvbnRhaW5lclNpemVXaXRob3V0U2Nyb2xsQmFyXy5jYWxsKHNjb3BlKTtcblxuICAgICAgICAgICAgdmFyIGNhcmRDb3VudEluQUNvbHVtbiA9IE1hdGguZmxvb3IocmF3Q29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgdmFyIGNhcmRDb3VudEluQVJvdyA9IE1hdGguZmxvb3IocmF3Q29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhcmRDb3VudEluQUNvbHVtbiAqIGNhcmRDb3VudEluQVJvdyA+PSBkYXRhTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVzdEdyb3VwSGVpZ2h0Xyhncm91cEluZm8sIGhlaWdodFRocmVzaG9sZCwgc3RhcnRQb3NpdGlvbikge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbjtcbiAgICAgICAgICAgIHZhciBmb290ZXI7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW47XG5cbiAgICAgICAgICAgIHZhciBjdXJyVG90YWxIZWlnaHQgPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgaWYgKGN1cnJUb3RhbEhlaWdodCA+IGhlaWdodFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyVG90YWxIZWlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXJTaXplID0gZ2V0Q29udGFpbmVyU2l6ZVdpdGhvdXRTY3JvbGxCYXJfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS5oZWlnaHQgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IE1hdGguZmxvb3IoY29udGFpbmVyU2l6ZS53aWR0aCAvIG9wdGlvbnMuY2FyZFdpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGdyb3VwRGVzID0gZ3JvdXBJbmZvLmdyb3VwRGVzY3JpcHRvcjtcbiAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwRGVzLmZvb3RlcjtcbiAgICAgICAgICAgIHZhciBoZWFkZXJIZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXBJbmZvKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJIZWlnaHQgPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvKTtcbiAgICAgICAgICAgIGN1cnJUb3RhbEhlaWdodCArPSBoZWFkZXJIZWlnaHQ7XG4gICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJUb3RhbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZ3JvdXBEZXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbiA9IGdyb3VwSW5mby5pdGVtQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJUb3RhbEhlaWdodCArPSBNYXRoLmNlaWwobGVuIC8gY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pICogc2NvcGUuZ2V0Um93SGVpZ2h0XygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyclRvdGFsSGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gZ3JvdXBJbmZvLmdyb3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclRvdGFsSGVpZ2h0ID0gZ2V0VGVzdEdyb3VwSGVpZ2h0Xy5jYWxsKHNjb3BlLCBncm91cEluZm8uZ3JvdXBzW2ldLCBoZWlnaHRUaHJlc2hvbGQsIGN1cnJUb3RhbEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclRvdGFsSGVpZ2h0ID4gaGVpZ2h0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJUb3RhbEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyVG90YWxIZWlnaHQgKz0gZm9vdGVySGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlICYmICFmb290ZXIuY29sbGFwc2VXaXRoR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyclRvdGFsSGVpZ2h0ICs9IGZvb3RlckhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VyclRvdGFsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmF3Um93VGVtcGxhdGVfKCkge1xuICAgICAgICAgICAgdmFyIHJvd1RtcGwgPSB0aGlzLm9wdGlvbnMucm93VGVtcGxhdGU7XG4gICAgICAgICAgICBpZiAocm93VG1wbCkge1xuICAgICAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzU3RyaW5nKHJvd1RtcGwpICYmIHJvd1RtcGwubGVuZ3RoID4gMSAmJiByb3dUbXBsWzBdID09PSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocm93VG1wbC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0bXBsRWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvd1RtcGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXygpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjb2xzID0gc2VsZi5ncmlkLmNvbHVtbnM7XG4gICAgICAgICAgICB2YXIgdG90YWxWaXNpYmxlQ29scyA9IDA7XG4gICAgICAgICAgICBfLmVhY2goY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsVmlzaWJsZUNvbHMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpdGVtSGVpZ2h0ID0gTWF0aC5mbG9vcihzZWxmLm9wdGlvbnMuY2FyZEhlaWdodCAvIHRvdGFsVmlzaWJsZUNvbHMpO1xuXG4gICAgICAgICAgICB2YXIgciA9ICc8ZGl2Pic7XG4gICAgICAgICAgICBfLmVhY2goY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHIgKz0gJzxkaXYgY2xhc3M9XCJnYy1jb2x1bW5cIiBzdHlsZT1cInBvc2l0aW9uOnN0YXRpYzsnICsgKGNvbC52aXNpYmxlID8gKCdoZWlnaHQ6JyArIGl0ZW1IZWlnaHQgKyAncHg7JykgOiAnZGlzcGxheTpub25lOycpICsgJ1wiIGRhdGEtY29sdW1uPVwiJyArIGNvbC5pZCArICdcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgciArPSAnPC9kaXY+JztcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgY2FyZEhlaWdodCA9IG9wdGlvbnMuY2FyZEhlaWdodDtcbiAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBvcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjb250ZW50SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbjtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclNpemUgPSBnZXRDb250YWluZXJTaXplV2l0aFNjcm9sbEJhcl8uY2FsbChzY29wZSk7XG4gICAgICAgICAgICB2YXIgY0hlaWdodCA9IGNvbnRhaW5lclNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGNXaWR0aCA9IGNvbnRhaW5lclNpemUud2lkdGg7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID0gTWF0aC5mbG9vcihjSGVpZ2h0IC8gY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgY29udGVudFdpZHRoID0gZ2V0Q29udGVudEhlaWdodF8oc2NvcGUuZ3JpZCwgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBjSGVpZ2h0O1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID0gTWF0aC5mbG9vcihjV2lkdGggLyBjYXJkV2lkdGgpO1xuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgPSBnZXRDb250ZW50SGVpZ2h0XyhzY29wZS5ncmlkLCBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29udGVudFdpZHRoID0gY1dpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogY1dpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogY0hlaWdodCxcbiAgICAgICAgICAgICAgICBjb250ZW50V2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICBjb250ZW50SGVpZ2h0OiBjb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uOiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbnRlbnRIZWlnaHRfKGdyaWQsIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGdyaWQuZGF0YTtcbiAgICAgICAgICAgIGlmIChoYXNHcm91cF8oZ3JpZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5yZWR1Y2UoZ3JpZC5ncm91cEluZm9zXywgZnVuY3Rpb24oc3VtLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdW0gKyBpdGVtLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBncmlkLmxheW91dEVuZ2luZS5vcHRpb25zO1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IGRhdGEuaXRlbUNvdW50O1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gTWF0aC5jZWlsKGxlbiAvIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uKSAqIGNhcmRXaWR0aCA6IE1hdGguY2VpbChsZW4gLyBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRJdGVtc0luZm9fKHZpc2libGVSYW5nZSwgZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcblxuICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZU9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGxheW91dEVuZ2luZU9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgIHZhciBjYXJkV2lkdGggPSBsYXlvdXRFbmdpbmVPcHRpb25zLmNhcmRXaWR0aDtcbiAgICAgICAgICAgIHZhciBjYXJkSGVpZ2h0ID0gbGF5b3V0RW5naW5lT3B0aW9ucy5jYXJkSGVpZ2h0O1xuICAgICAgICAgICAgdmFyIHN0YXJ0RW5kSW5kZXg7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBzdHlsZTtcbiAgICAgICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgICAgIC8vY2FsY3VsYXRlIHRoZSByZW5kZXIgcmFuZ2VzXG4gICAgICAgICAgICBzdGFydEVuZEluZGV4ID0gZ2V0U3RhcnRFbmRJbmRleEF0Xy5jYWxsKHNjb3BlLCB7dG9wOiB2aXNpYmxlUmFuZ2Uuc3RhcnQsIGxlZnQ6IHZpc2libGVSYW5nZS5zdGFydH0pO1xuXG4gICAgICAgICAgICAvL2dldCBjYXJkcyByZW5kZXIgaW5mb1xuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZFJvd0l0ZW07XG4gICAgICAgICAgICB2YXIgbGVmdENvb3JkaW5hdGU7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IHN0YXJ0RW5kSW5kZXguc3RhcnQ7IGkgPCBzdGFydEVuZEluZGV4LmVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZFJvd0l0ZW0gPSBncmlkLmdldERhdGFJdGVtKGkpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0Q29vcmRpbmF0ZSA9IE1hdGguZmxvb3IoaSAvIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24pICogY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogaSAlIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBsZWZ0Q29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogaSAlIGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRDb29yZGluYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGdyaWQudWlkICsgJy1yJyArIGk7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChjcmVhdGVSb3dfLmNhbGwoc2NvcGUsIGtleSwgc3R5bGUsIGksIGdldFVwZGF0ZVJvdykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9kZWZhdWx0IGRpcmVjdGlvbiBpcyBob3Jpem9udGFsXG4gICAgICAgICAgICAgICAgZm9yIChpID0gc3RhcnRFbmRJbmRleC5zdGFydDsgaSA8IHN0YXJ0RW5kSW5kZXguZW5kOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBsZWZ0Q29vcmRpbmF0ZSA9IGkgJSBsYXlvdXRJbmZvLmNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogTWF0aC5mbG9vcihpIC8gbGF5b3V0SW5mby5jYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBsZWZ0Q29vcmRpbmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogTWF0aC5mbG9vcihpIC8gbGF5b3V0SW5mby5jYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbikgKiBjYXJkSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRDb29yZGluYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY2FyZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2FyZFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAga2V5ID0gZ3JpZC51aWQgKyAnLXInICsgaTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGNyZWF0ZVJvd18uY2FsbChzY29wZSwga2V5LCBzdHlsZSwgaSwgZ2V0VXBkYXRlUm93KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVSb3dfKGtleSwgc3R5bGUsIGluZGV4LCBnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFJlbmRlclJvd0luZm9JbnRlcm5hbC5jYWxsKHNjb3BlLCBrZXksIHN0eWxlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSZW5kZXJSb3dJbmZvSW50ZXJuYWwoa2V5LCBzdHlsZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkUm93SXRlbSA9IGdyaWQuZ2V0Rm9ybWF0dGVkRGF0YUl0ZW0oaW5kZXgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cgcicgKyBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHNjb3BlLmdldFJvd1RlbXBsYXRlKCkoZm9ybWF0dGVkUm93SXRlbSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18oZ3JvdXBJbmZvLCByb3dJbmRleCwgcmVuZGVyUmVjdCwgZ2V0VXBkYXRlUm93LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGtleSA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyByb3dJbmRleDtcblxuICAgICAgICAgICAgaWYgKGdldFVwZGF0ZVJvdykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogcm93SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kczogcmVuZGVyUmVjdCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJvd0luZGV4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwQ29udGVudFJvd18uY2FsbChzZWxmLCBrZXksIHJvd0luZGV4LCByZW5kZXJSZWN0LCBncm91cEluZm8sIHNlbGYub3B0aW9ucy5yaWdodFRvTGVmdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cEl0ZW1zSW5mb18odmlzaWJsZVJhbmdlLCBnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICAgICAgdmFyIGVudGlyZUdyb3VwSW5mb3MgPSBncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgc3RhcnRSZW5kZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBlbmRSZW5kZXJJdGVtID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZW5kUmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY3VyckluZm87XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIG1heEluZGV4ID0gMDtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2NvcGUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9IGxheW91dEluZm8uY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aW9uID0gb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgICAgICB2YXIgcmlnaHRUb0xlZnQgPSBvcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICAgICAgICAgICAgdmFyIGNhcmRIZWlnaHQgPSBvcHRpb25zLmNhcmRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY2FyZFdpZHRoID0gb3B0aW9ucy5jYXJkV2lkdGg7XG4gICAgICAgICAgICB2YXIgY29udGVudFdpZHRoID0gbGF5b3V0SW5mby5jb250ZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgY29udGVudEhlaWdodCA9IGxheW91dEluZm8uY29udGVudEhlaWdodDtcbiAgICAgICAgICAgIHZhciByZWN0O1xuICAgICAgICAgICAgdmFyIHJvd0luZGV4O1xuICAgICAgICAgICAgdmFyIHJldmVyc2UgPSByaWdodFRvTGVmdCAmJiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCk7XG4gICAgICAgICAgICB2YXIgd2luZG93UmFuZ2UgPSByZXZlcnNlID8ge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBjb250ZW50V2lkdGggLSB2aXNpYmxlUmFuZ2UuZW5kLFxuICAgICAgICAgICAgICAgIGVuZDogY29udGVudFdpZHRoIC0gdmlzaWJsZVJhbmdlLnN0YXJ0XG4gICAgICAgICAgICB9IDogdmlzaWJsZVJhbmdlO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRTdGFydFBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIHZhciBmb290ZXI7XG4gICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAgdmFyIHJlbmRlclJlY3Q7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbnRpcmVHcm91cEluZm9zLmxlbmd0aCAtIDE7IGkgPD0gbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncm91cEluZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBbaV0sXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NraXAgZ3JvdXBzLCBtaW5pbWl6ZSB0aGUgb3ZlcmxhcCBjb21wYXJlXG4gICAgICAgICAgICB3aGlsZSAoZ3JvdXBJbmZvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VyckluZm8gPSBncm91cEluZm9zWzBdO1xuICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBjdXJyZW50U3RhcnRQb3NpdGlvbiArIGdyb3VwSW5mby5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm9zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoZ3JvdXBJbmZvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VyckluZm8gPSBncm91cEluZm9zLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JpZC5nZXRHcm91cEluZm9fKGN1cnJJbmZvLnBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJJbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXBJbmZvLmRhdGEuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlciAmJiBoZWFkZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gc2NvcGUuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwSW5mby5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3ZlcmxhcHNfKHdpbmRvd1JhbmdlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGN1cnJlbnRTdGFydFBvc2l0aW9uICsgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhcnRQb3NpdGlvbiArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNvbnRlbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyZW50U3RhcnRQb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJlbnRTdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGdyaWQudWlkICsgJy1naCcgKyBjdXJySW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0VXBkYXRlUm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm86IGN1cnJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRzOiByZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRHcm91cEhlYWRlclJvd18uY2FsbChzY29wZSwga2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXJ0UG9zaXRpb24gKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29udGFpbnMxZF8od2luZG93UmFuZ2UsIGN1cnJlbnRTdGFydFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncmlkLmdldEdyb3VwSW5mb18oY3VyckluZm8ucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJvd0luZGV4ID0gY3VyckluZm8uaXRlbUluZGV4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBzY29wZS5nZXRSb3dIZWlnaHRfKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtzdGFydDogY3VycmVudFN0YXJ0UG9zaXRpb24sIGVuZDogY3VycmVudFN0YXJ0UG9zaXRpb24gKyBoZWlnaHR9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUmVuZGVySXRlbSA9IChyb3dJbmRleCAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uID09PSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiAtIDEpIHx8IHJvd0luZGV4ID09PSBtYXhJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0YXJ0UG9zaXRpb24gKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclJlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gKHJvd0luZGV4ICUgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gKiBjYXJkSGVpZ2h0KSA6IGN1cnJlbnRTdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBjdXJyZW50U3RhcnRQb3NpdGlvbiA6IChyb3dJbmRleCAlIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uICogY2FyZFdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhcmRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhcmRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRSZW5kZXJlZEdyb3VwQ29udGVudEl0ZW1JbmZvXy5jYWxsKHNjb3BlLCBncm91cEluZm8sIHJvd0luZGV4LCByZW5kZXJSZWN0LCBnZXRVcGRhdGVSb3cpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlckl0ZW0gPSAocm93SW5kZXggJSBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiA9PT0gY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gLSAxKSB8fCByb3dJbmRleCA9PT0gbWF4SW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFJlbmRlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhcnRQb3NpdGlvbiArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWluczFkXyh3aW5kb3dSYW5nZSwgY3VycmVudFN0YXJ0UG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvID0gZ3JpZC5nZXRHcm91cEluZm9fKGN1cnJJbmZvLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBmb290ZXIgPSBncm91cEluZm8uZGF0YS5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGFydFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGFwc18od2luZG93UmFuZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBjdXJyZW50U3RhcnRQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogY3VycmVudFN0YXJ0UG9zaXRpb24gKyBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGN1cnJlbnRTdGFydFBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogY3VycmVudFN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZ3JpZC51aWQgKyAnLWdmJyArIGN1cnJJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRVcGRhdGVSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogY3VyckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZHM6IHJlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldEdyb3VwRm9vdGVyUm93Xy5jYWxsKHNjb3BlLCBrZXksIGN1cnJJbmZvLCBncm91cEluZm8sIHJlY3QsIGRpcmVjdGlvbiwgcmlnaHRUb0xlZnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUm93Um9sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckluZm86IGdldEdyb3VwRm9vdGVyUmVuZGVySW5mb18uY2FsbChzY29wZSwgY3VyckluZm8ucGF0aCwgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFydFBvc2l0aW9uICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5zMWRfKHdpbmRvd1JhbmdlLCBjdXJyZW50U3RhcnRQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyckluZm8uYXJlYSA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cCAmJiAhZ3JvdXAuaXNCb3R0b21MZXZlbCAmJiBmb290ZXIgJiYgZm9vdGVyLnZpc2libGUgJiYgIWZvb3Rlci5jb2xsYXBzZVdpdGhHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0ZPT1RFUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gbWF4SW5kZXggPSBncm91cC5pc0JvdHRvbUxldmVsID8gZ3JvdXAuaXRlbUNvdW50IDogZ3JvdXBJbmZvLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJJbmZvLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLnNsaWNlKCkuY29uY2F0KFtpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclJvd18oa2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIGlzUm93Um9sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBIZWFkZXJSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCBjdXJySW5mby5wYXRoLCBncm91cEluZm8sIHJlY3QsIGRpcmVjdGlvbiwgcmlnaHRUb0xlZnQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBDb250ZW50Um93XyhrZXksIHJvd0luZGV4LCByZWN0LCBncm91cEluZm8sIHJpZ2h0VG9MZWZ0LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBpc1Jvd1JvbGU6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBSb3dSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCByb3dJbmRleCwgZ3JvdXBJbmZvLCByZWN0LCByaWdodFRvTGVmdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSb3dfKGtleSwgY3VyckluZm8sIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgaXNSb3dSb2xlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiBnZXRHcm91cEZvb3RlclJlbmRlckluZm9fLmNhbGwoc2NvcGUsIGN1cnJJbmZvLnBhdGgsIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclJlbmRlckluZm9fKGdyb3VwUGF0aCwgZ3JvdXBJbmZvLCByZWN0LCBkaXJlY3Rpb24sIHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICB2YXIgc3R5bGU7XG4gICAgICAgICAgICBpZiAocmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gcmVjdC5oZWlnaHQgOiByZWN0LndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwUGF0aC5qb2luKCdfJyksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogcmVuZGVyR3JvdXBIZWFkZXJfLmNhbGwodGhpcywgZ3JvdXBJbmZvLCB3aWR0aClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXJHcm91cEhlYWRlcl8oZ3JvdXBJbmZvLCB3aWR0aCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGdyb3VwLm5hbWU7XG5cbiAgICAgICAgICAgIC8vVE9ETzogdXNlIGZvcm1hdHRlcj9cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmFtZSkgPT09ICdbb2JqZWN0IERhdGVdJykge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBsZXZlbDogZ3JvdXAubGV2ZWwsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiBncm91cC5sZXZlbCAqIEdST1VQX0lOREVOVCxcbiAgICAgICAgICAgICAgICBncm91cFN0YXR1czogZ3JvdXAuY29sbGFwc2VkID8gJ2NvbGxhcHNlZCcgOiAnZXhwYW5kJyxcbiAgICAgICAgICAgICAgICBjb25kaXRpb246IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5maWVsZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIGNvdW50OiBncm91cC5pdGVtQ291bnRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBkb1QudGVtcGxhdGUoZ2V0R3JvdXBIZWFkZXJUZW1wbGF0ZV8uY2FsbChzZWxmLCBncm91cCwgd2lkdGgpLCBudWxsLCBudWxsLCB0cnVlKShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyVGVtcGxhdGVfKGdyb3VwLCB3aWR0aCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBzY29wZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHNjb3BlLm9wdGlvbnMuZGlyZWN0aW9uO1xuICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0ID0gc2NvcGUub3B0aW9ucy5yaWdodFRvTGVmdDtcbiAgICAgICAgICAgIC8vVE9ETzogcHJlcHJvY2VzcyB1c2VyIGdpdmVuIGhlYWRlciB0ZW1wbGF0ZSwgYWRkIGhlaWdodFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRUZW1wbGF0ZTtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci12LXJ0bFwiIHN0eWxlPVwicmlnaHQ6JyArIGhlaWdodCArICdweDt3aWR0aDonICsgd2lkdGggKyAncHg7aGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7bGluZS1oZWlnaHQ6JyArIGhlaWdodCArICdweDtcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImdjLWljb24gZ2MtZ3JvdXBpbmctdG9nZ2xlIHt7PWl0Lmdyb3VwU3RhdHVzfX1cIiBzdHlsZT1cIm1hcmdpbi1yaWdodDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj4mbmJzcDxzcGFuIGxldmVsPVwie3s9aXQubGV2ZWx9fVwiPnt7PWl0LmNvbmRpdGlvbn19OiB7ez1pdC5uYW1lfX08c3Bhbj4gKHt7PWl0LmNvdW50fX0pPC9zcGFuPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci12XCIgc3R5bGU9XCJsZWZ0OicgKyBoZWlnaHQgKyAncHg7d2lkdGg6JyArIHdpZHRoICsgJ3B4O2hlaWdodDonICsgaGVpZ2h0ICsgJ3B4O2xpbmUtaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJnYy1pY29uIGdjLWdyb3VwaW5nLXRvZ2dsZSB7ez1pdC5ncm91cFN0YXR1c319XCIgc3R5bGU9XCJtYXJnaW4tbGVmdDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj4mbmJzcDxzcGFuIGxldmVsPVwie3s9aXQubGV2ZWx9fVwiPnt7PWl0LmNvbmRpdGlvbn19OiB7ez1pdC5uYW1lfX08c3Bhbj4gKHt7PWl0LmNvdW50fX0pPC9zcGFuPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci1jZWxsXCIgc3R5bGU9XCJoZWlnaHQ6JyArIGhlaWdodCArICdweDtsaW5lLWhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLXJpZ2h0Ont7PWl0Lm1hcmdpbn19cHg7XCI+PC9zcGFuPiZuYnNwPHNwYW4gbGV2ZWw9XCJ7ez1pdC5sZXZlbH19XCI+e3s9aXQuY29uZGl0aW9ufX06IHt7PWl0Lm5hbWV9fTxzcGFuPiAoe3s9aXQuY291bnR9fSk8L3NwYW4+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJnYy1ncm91cC1oZWFkZXIgZ2MtZ3JvdXAtaGVhZGVyLWNlbGwgXCIgc3R5bGU9XCJoZWlnaHQ6JyArIGhlaWdodCArICdweDtsaW5lLWhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6e3s9aXQubWFyZ2lufX1weDtcIj48L3NwYW4+Jm5ic3A8c3BhbiBsZXZlbD1cInt7PWl0LmxldmVsfX1cIj57ez1pdC5jb25kaXRpb259fToge3s9aXQubmFtZX19PHNwYW4+ICh7ez1pdC5jb3VudH19KTwvc3Bhbj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlci50ZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRHcm91cFJvd1JlbmRlckluZm9fKGluZGV4LCBncm91cEluZm8sIHJlY3QsIHJpZ2h0VG9MZWZ0LCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHN0eWxlO1xuICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0eWxlID0gYWRkaXRpb25hbFN0eWxlID8gXy5hc3NpZ24oYWRkaXRpb25hbFN0eWxlLCBzdHlsZSkgOiBzdHlsZTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cnICsgKGFkZGl0aW9uYWxDU1NDbGFzcyA/ICgnICcgKyBhZGRpdGlvbmFsQ1NTQ2xhc3MpIDogJycpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHNlbGYuZ2V0Um93VGVtcGxhdGUoKShzZWxmLmdyaWQuZm9ybWF0RGF0YUl0ZW0oZ3JvdXBJbmZvLmRhdGEuZ2V0SXRlbShpbmRleCkpKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogaG93IHRvIGhhbmRsZSBncm91cCBmb290ZXIgaW4gY2FyZCBsYXlvdXRFbmdpbmVcbiAgICAgICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJSZW5kZXJJbmZvXyhncm91cFBhdGgsIGdyb3VwSW5mbywgcmVjdCwgZGlyZWN0aW9uLCByaWdodFRvTGVmdCkge1xuICAgICAgICAgICAgdmFyIHN0eWxlO1xuICAgICAgICAgICAgaWYgKHJpZ2h0VG9MZWZ0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy92YXIgd2lkdGggPSBkaXJlY3Rpb24gPT09IFZFUlRJQ0FMID8gcmVjdC5oZWlnaHQgOiByZWN0LndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwUGF0aC5qb2luKCdfJyksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogJzxkaXY+PC9kaXY+J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXBzXyhyYW5nZTEsIHJhbmdlMikge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlMS5lbmQgPiByYW5nZTIuc3RhcnQgJiYgcmFuZ2UyLmVuZCA+IHJhbmdlMS5zdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbnRhaW5zMWRfKHJhbmdlLCBwb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIChyYW5nZS5lbmQgPiBwb3NpdGlvbiAmJiBwb3NpdGlvbiA+PSByYW5nZS5zdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb250YWluczJkXyhyZWN0LCBwb2ludCwgZW5sYXJnZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGVubGFyZ2VMZW5ndGggPSAoZW5sYXJnZSAmJiBzZWxmLmdyaWQuaXNUb3VjaE1vZGUpID8gMTAgOiAwO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSByZWN0LmxlZnQgLSBlbmxhcmdlTGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCArIGVubGFyZ2VMZW5ndGg7XG4gICAgICAgICAgICB2YXIgdG9wID0gcmVjdC50b3AgLSBlbmxhcmdlTGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGJvdHRvbSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKyBlbmxhcmdlTGVuZ3RoO1xuXG4gICAgICAgICAgICByZXR1cm4gcG9pbnQubGVmdCA+PSBsZWZ0ICYmIHBvaW50LnRvcCA+PSB0b3AgJiYgcG9pbnQubGVmdCA8IHJpZ2h0ICYmIHBvaW50LnRvcCA8IGJvdHRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETyByZWZhY3RvciB0aGUgcmVuZGVyIHByb2Nlc3MuIGtpbGwgdGhlc2UgcmVkdW5kYW50IGZ1bmN0aW9uc1xuICAgICAgICBmdW5jdGlvbiBnZXRTdGFydEVuZEluZGV4QXRfKG9mZnNldCkge1xuICAgICAgICAgICAgLy9hc3N1bWluZyBhbGwgY2FyZHMgaGF2ZSB0aGUgc2FtZSBzaXplXG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzY29wZS5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzY29wZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgdmFyIGRhdGFMZW5ndGggPSBzY29wZS5ncmlkLmRhdGEuaXRlbUNvdW50O1xuICAgICAgICAgICAgdmFyIHN0YXJ0Q29vcmRpbmF0ZTtcbiAgICAgICAgICAgIHZhciBlbmRDb29yZGluYXRlO1xuICAgICAgICAgICAgdmFyIHN0YXJ0SW5kZXg7XG4gICAgICAgICAgICB2YXIgZW5kSW5kZXg7XG4gICAgICAgICAgICB2YXIgY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24gPSBsYXlvdXRJbmZvLmNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMucmlnaHRUb0xlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRDb29yZGluYXRlID0gbGF5b3V0SW5mby5jb250ZW50V2lkdGggLSBvZmZzZXQubGVmdCAtIGxheW91dEluZm8ud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGVuZENvb3JkaW5hdGUgPSBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCAtIG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Q29vcmRpbmF0ZSA9IG9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICBlbmRDb29yZGluYXRlID0gb2Zmc2V0LmxlZnQgKyBsYXlvdXRJbmZvLndpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gTWF0aC5mbG9vcihzdGFydENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLmZsb29yKGVuZENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRXaWR0aCk7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IE1hdGgubWF4KHN0YXJ0SW5kZXggKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiwgMCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLm1pbigoZW5kSW5kZXggKyAxKSAqIGNhcmRDb3VudEluQXNzaXN0RGlyZWN0aW9uLCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhcnRDb29yZGluYXRlID0gb2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICBlbmRDb29yZGluYXRlID0gb2Zmc2V0LnRvcCArIGxheW91dEluZm8uaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKHN0YXJ0Q29vcmRpbmF0ZSAvIG9wdGlvbnMuY2FyZEhlaWdodCk7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLmZsb29yKGVuZENvb3JkaW5hdGUgLyBvcHRpb25zLmNhcmRIZWlnaHQpO1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1heChzdGFydEluZGV4ICogY2FyZENvdW50SW5Bc3Npc3REaXJlY3Rpb24sIDApO1xuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gTWF0aC5taW4oKGVuZEluZGV4ICsgMSkgKiBjYXJkQ291bnRJbkFzc2lzdERpcmVjdGlvbiwgZGF0YUxlbmd0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgICAgZW5kOiBlbmRJbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlXygpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgaWYgKHNlbGYucm93VGVtcGxhdGVGbl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5yb3dUZW1wbGF0ZUZuXztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgdmFyIG9sZENvbFRtcGw7XG4gICAgICAgICAgICB2YXIgbmV3Q29sVG1wbDtcbiAgICAgICAgICAgIHZhciBpZDtcbiAgICAgICAgICAgIHZhciBjc3NOYW1lO1xuICAgICAgICAgICAgdmFyIHRhZ05hbWU7XG4gICAgICAgICAgICB2YXIgY29sVG1wbDtcbiAgICAgICAgICAgIHZhciBjb2xBbm5vdGF0aW9uO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvbVV0aWwuY3JlYXRlVGVtcGxhdGVFbGVtZW50KHRlbXBsYXRlU3RyKTtcbiAgICAgICAgICAgIC8vRGlmZmVyZW50IGJyb3dzZXJzIG1heSByZXR1cm4gZGlmZmVyZW50IGlubmVySFRNTHMgY29tcGFyZWQgd2l0aCB0aGUgb3JpZ2luYWwgSFRNTCxcbiAgICAgICAgICAgIC8vdGhleSBtYXkgcmVvcmRlciB0aGUgYXR0cmlidXRlIG9mIGEgdGFnLGVzY2FwZXMgdGFncyB3aXRoIGluc2lkZSBhIG5vc2NyaXB0IHRhZyBldGMuXG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciA9IGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dChlbGVtZW50KTtcblxuICAgICAgICAgICAgdmFyIGFubm90YXRpb25Db2xzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb2x1bW5dJyk7XG4gICAgICAgICAgICBfLmVhY2goYW5ub3RhdGlvbkNvbHMsIGZ1bmN0aW9uKGFubm90YXRpb25Db2wsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbCA9IGdyaWQuZ2V0Q29sQnlJZF8oYW5ub3RhdGlvbkNvbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sdW1uJykpO1xuICAgICAgICAgICAgICAgIGlmIChjb2wgJiYgY29sLmRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmlzQ2FsY0NvbHVtbl8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSAne3s9aXQuJyArIGNvbC5pZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YUZpZWxkcyA9IGNvbC5kYXRhRmllbGQuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRmllbGRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSBjb2wucHJlc2VudGVyIHx8ICd7ez1pdC4nICsgY29sLmRhdGFGaWVsZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFGaWVsZHMsIGZ1bmN0aW9uKGRhdGFGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goZ3JpZC5nZXRDb2xCeUlkXyhkYXRhRmllbGQpLnByZXNlbnRlciB8fCAne3s9aXQuJyArIGNvbC5kYXRhRmllbGQgKyAnfX0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gdGVtcC5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbFRtcGwgPSBhbm5vdGF0aW9uQ29sO1xuICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBjb2xUbXBsLnRhZ05hbWU7XG4gICAgICAgICAgICAgICAgb2xkQ29sVG1wbCA9IGRvbVV0aWwuZ2V0RWxlbWVudE91dGVyVGV4dChjb2xUbXBsKTtcbiAgICAgICAgICAgICAgICBpZCA9ICdjJyArIGluZGV4O1xuICAgICAgICAgICAgICAgIGNzc05hbWUgPSAnZ2MtY2VsbCc7XG5cbiAgICAgICAgICAgICAgICBuZXdDb2xUbXBsID0gb2xkQ29sVG1wbC5zbGljZSgwLCBvbGRDb2xUbXBsLmxlbmd0aCAtICh0YWdOYW1lLmxlbmd0aCArIDMpKSArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwMCU7XCIgY2xhc3M9XCInICsgY3NzTmFtZSArICcgJyArIGlkICsgJ1wiJyArICcgcm9sZT1cImdyaWRjZWxsXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gKyAnPC9kaXY+PC8nICsgdGFnTmFtZSArICc+JztcblxuICAgICAgICAgICAgICAgIC8vb3V0ZXJIVE1MIHJldHVybnMgZG91YmxlIHF1b3RlcyBpbiBhdHRyaWJ1dGUgc29tZXRpbWVzXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlU3RyLmluZGV4T2Yob2xkQ29sVG1wbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZENvbFRtcGwgPSBvbGRDb2xUbXBsLnJlcGxhY2UoL1wiL2csICdcXCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0ci5yZXBsYWNlKG9sZENvbFRtcGwsIG5ld0NvbFRtcGwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYucm93VGVtcGxhdGVGbl8gPSBkb1QudGVtcGxhdGUodGVtcGxhdGVTdHIsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucm93VGVtcGxhdGVGbl87XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYXNHcm91cF8oZ3JpZCkge1xuICAgICAgICAgICAgcmV0dXJuICEhZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlV2hlZWwoc2VuZGVyLCBlKSB7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbmRlcjtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvO1xuICAgICAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICAgICAgdmFyIGhhc1Njcm9sbEJhciA9IGxheW91dEVuZ2luZS5oYXNTY3JvbGxCYXJfKCk7XG4gICAgICAgICAgICBpZiAoIWxheW91dEVuZ2luZS5vcHRpb25zLnNob3dTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXREZWx0YSA9IGUuZGVsdGFZO1xuXG4gICAgICAgICAgICAvL3NpbXVsYXRlIHNjcm9sbFxuICAgICAgICAgICAgaWYgKGxheW91dEVuZ2luZS5vcHRpb25zLmRpcmVjdGlvbiAhPT0gVkVSVElDQUwgJiYgaGFzU2Nyb2xsQmFyLnZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dEluZm8gPSBsYXlvdXRFbmdpbmUuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heE9mZnNldFRvcCA9IE1hdGgubWF4KGxheW91dEluZm8uY29udGVudEhlaWdodCAtIGxheW91dEluZm8uaGVpZ2h0LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldERlbHRhID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA+PSBtYXhPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKG9mZnNldFRvcCArIG9mZnNldERlbHRhLCBtYXhPZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsJykuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzU2Nyb2xsQmFyLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0RGVsdGEgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0SW5mbyA9IGxheW91dEVuZ2luZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4T2Zmc2V0TGVmdCA9IE1hdGgubWF4KGxheW91dEluZm8uY29udGVudFdpZHRoIC0gbGF5b3V0SW5mby53aWR0aCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gZ3JpZC5zY3JvbGxPZmZzZXQubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXREZWx0YSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID49IG1heE9mZnNldExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBNYXRoLm1pbihvZmZzZXRMZWZ0ICsgb2Zmc2V0RGVsdGEsIG1heE9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldExlZnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBNYXRoLm1heChvZmZzZXRMZWZ0ICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsJykuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTW91c2VDbGljayhzZW5kZXIsIGUpIHtcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VuZGVyO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzZW5kZXIubGF5b3V0RW5naW5lO1xuICAgICAgICAgICAgdmFyIGhpdEluZm87XG4gICAgICAgICAgICAvL2lmICghaGl0SW5mbykge1xuICAgICAgICAgICAgc2VsZi5oaXRUZXN0SW5mb18gPSBzZWxmLmhpdFRlc3QoZSk7XG4gICAgICAgICAgICBoaXRJbmZvID0gc2VsZi5oaXRUZXN0SW5mb187XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBpZiAoIWhpdEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYubW91c2VEb3duUG9pbnRfID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IGUucGFnZVgsXG4gICAgICAgICAgICAgICAgdG9wOiBlLnBhZ2VZXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgICAgICBpZiAoZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9DT05URU5UICYmIGdyb3VwSW5mby5yb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyBncm91cEluZm8ucm93O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBJbmZvLmFyZWEgPT09IEdST1VQX0ZPT1RFUikge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGYuZ3JpZC51aWQgKyAnLWdmJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5vbkV4cGFuZFRvZ2dsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEluZm8ucGF0aCkuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmNvbGxhcHNlZCA9ICFncm91cC5jb2xsYXBzZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQ2FyZExheW91dEVuZ2luZTtcbiAgICB9KClcbilcbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2xheW91dEVuZ2luZXMvQ2FyZExheW91dEVuZ2luZS5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gNVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIFVOREVGSU5FRCA9ICd1bmRlZmluZWQnO1xuICAgIHZhciBnY1V0aWxzID0ge307XG5cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUodmFsLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YodmFsKSA9PT0gdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXN0cyBhIHZhbHVlIHRvIGEgdHlwZSBpZiBwb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjYXN0LlxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb3IgaW50ZXJmYWNlIG5hbWUgdG8gY2FzdCB0by5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4gaWYgdGhlIGNhc3Qgd2FzIHN1Y2Nlc3NmdWwsIG51bGwgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyeUNhc3QodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgLy8gbnVsbCBkb2Vzbid0IGltcGxlbWVudCBhbnl0aGluZ1xuICAgICAgICBpZiAoaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRlc3QgZm9yIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvbiAoSVF1ZXJ5SW50ZXJmYWNlKVxuICAgICAgICBpZiAoaXNTdHJpbmcodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlLmltcGxlbWVudHNJbnRlcmZhY2UpICYmIHZhbHVlLmltcGxlbWVudHNJbnRlcmZhY2UodHlwZSkgPyB2YWx1ZSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWd1bGFyIHR5cGUgdGVzdFxuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiB0eXBlID8gdmFsdWUgOiBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMudHJ5Q2FzdCA9IHRyeUNhc3Q7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgcHJpbWl0aXZlIHR5cGUgKHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBvciBkYXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgfHwgaXNOdW1iZXIodmFsdWUpIHx8IGlzQm9vbGVhbih2YWx1ZSkgfHwgaXNEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ3N0cmluZycpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBpcyBudWxsLCBlbXB0eSwgb3Igd2hpdGVzcGFjZSBvbmx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2UodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSA/IHRydWUgOiB2YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpLmxlbmd0aCA8IDE7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZSA9IGlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdudW1iZXInKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIGludGVnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0ludCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlID09PSBNYXRoLnJvdW5kKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzSW50ID0gaXNJbnQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgQm9vbGVhbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnYm9vbGVhbicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCBVTkRFRklORUQpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBEYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgJiYgIWlzTmFOKHZhbHVlLmdldFRpbWUoKSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0RhdGUgPSBpc0RhdGU7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBvYmplY3QgKGFzIG9wcG9zZWQgdG8gYSB2YWx1ZSB0eXBlIG9yIGEgZGF0ZSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFpc0RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgYSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqIEByZXR1cm4gQSBAc2VlOkRhdGFUeXBlIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFR5cGUodmFsdWUpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYm9vbGVhbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBnY1V0aWxzLmdldFR5cGUgPSBnZXRUeXBlO1xuXG4gICAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNVbmRlZmluZWQodmFsdWUpIHx8IGlzTnVsbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc051bGwgPSBpc051bGw7XG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZE9yTnVsbCA9IGlzVW5kZWZpbmVkT3JOdWxsO1xuXG4gICAgLy9UT0RPOiByZXZpZXcgdGhpcyBtZXRob2QgYWZ0ZXIgZm9ybW10dGVyIGltcGxlbWVudGF0aW9uIGRvbmUuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB0aGUgdHlwZSBvZiBhIHZhbHVlLlxuICAgICAqXG4gICAgICogSWYgdGhlIGNvbnZlcnNpb24gZmFpbHMsIHRoZSBvcmlnaW5hbCB2YWx1ZSBpcyByZXR1cm5lZC4gVG8gY2hlY2sgaWYgYVxuICAgICAqIGNvbnZlcnNpb24gc3VjY2VlZGVkLCB5b3Ugc2hvdWxkIGNoZWNrIHRoZSB0eXBlIG9mIHRoZSByZXR1cm5lZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBjb252ZXJ0LlxuICAgICAqIEBwYXJhbSB0eXBlIEBzZWU6RGF0YVR5cGUgdG8gY29udmVydCB0aGUgdmFsdWUgdG8uXG4gICAgICogQHJldHVybiBUaGUgY29udmVydGVkIHZhbHVlLCBvciB0aGUgb3JpZ2luYWwgdmFsdWUgaWYgYSBjb252ZXJzaW9uIHdhcyBub3QgcG9zc2libGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hhbmdlVHlwZSh2YWx1ZSwgdHlwZSkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgc3RyaW5ncyB0byBudW1iZXJzLCBkYXRlcywgb3IgYm9vbGVhbnNcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTihudW0pID8gdmFsdWUgOiBudW07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29udmVydCBhbnl0aGluZyB0byBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2hhbmdlVHlwZSA9IGNoYW5nZVR5cGU7XG4gICAgLy9cbiAgICAvLy8qKlxuICAgIC8vICogUmVwbGFjZXMgZWFjaCBmb3JtYXQgaXRlbSBpbiBhIHNwZWNpZmllZCBzdHJpbmcgd2l0aCB0aGUgdGV4dCBlcXVpdmFsZW50IG9mIGFuXG4gICAgLy8gKiBvYmplY3QncyB2YWx1ZS5cbiAgICAvLyAqXG4gICAgLy8gKiBUaGUgZnVuY3Rpb24gd29ya3MgYnkgcmVwbGFjaW5nIHBhcnRzIG9mIHRoZSA8Yj5mb3JtYXRTdHJpbmc8L2I+IHdpdGggdGhlIHBhdHRlcm5cbiAgICAvLyAqICd7bmFtZTpmb3JtYXR9JyB3aXRoIHByb3BlcnRpZXMgb2YgdGhlIDxiPmRhdGE8L2I+IHBhcmFtZXRlci4gRm9yIGV4YW1wbGU6XG4gICAgLy8gKlxuICAgIC8vICogPHByZT5cbiAgICAvLyAqIHZhciBkYXRhID0geyBuYW1lOiAnSm9lJywgYW1vdW50OiAxMjM0NTYgfTtcbiAgICAvLyAqIHZhciBtc2cgPSB3aWptby5mb3JtYXQoJ0hlbGxvIHtuYW1lfSwgeW91IHdvbiB7YW1vdW50Om4yfSEnLCBkYXRhKTtcbiAgICAvLyAqIDwvcHJlPlxuICAgIC8vICpcbiAgICAvLyAqIFRoZSBvcHRpb25hbCA8Yj5mb3JtYXRGdW5jdGlvbjwvYj4gYWxsb3dzIHlvdSB0byBjdXN0b21pemUgdGhlIGNvbnRlbnQgYnkgcHJvdmlkaW5nXG4gICAgLy8gKiBjb250ZXh0LXNlbnNpdGl2ZSBmb3JtYXR0aW5nLiBJZiBwcm92aWRlZCwgdGhlIGZvcm1hdCBmdW5jdGlvbiBnZXRzIGNhbGxlZCBmb3IgZWFjaFxuICAgIC8vICogZm9ybWF0IGVsZW1lbnQgYW5kIGdldHMgcGFzc2VkIHRoZSBkYXRhIG9iamVjdCwgdGhlIHBhcmFtZXRlciBuYW1lLCB0aGUgZm9ybWF0LFxuICAgIC8vICogYW5kIHRoZSB2YWx1ZTsgaXQgc2hvdWxkIHJldHVybiBhbiBvdXRwdXQgc3RyaW5nLiBGb3IgZXhhbXBsZTpcbiAgICAvLyAqXG4gICAgLy8gKiA8cHJlPlxuICAgIC8vICogdmFyIGRhdGEgPSB7IG5hbWU6ICdKb2UnLCBhbW91bnQ6IDEyMzQ1NiB9O1xuICAgIC8vICogdmFyIG1zZyA9IHdpam1vLmZvcm1hdCgnSGVsbG8ge25hbWV9LCB5b3Ugd29uIHthbW91bnQ6bjJ9IScsIGRhdGEsXG4gICAgLy8gKiAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSwgbmFtZSwgZm10LCB2YWwpIHtcbiAgICAvLyogICAgICAgICAgICAgICBpZiAod2lqbW8uaXNTdHJpbmcoZGF0YVtuYW1lXSkpIHtcbiAgICAvLyogICAgICAgICAgICAgICAgICAgdmFsID0gd2lqbW8uZXNjYXBlSHRtbChkYXRhW25hbWVdKTtcbiAgICAvLyogICAgICAgICAgICAgICB9XG4gICAgLy8qICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAvLyogICAgICAgICAgICAgfSk7XG4gICAgLy8gKiA8L3ByZT5cbiAgICAvLyAqXG4gICAgLy8gKiBAcGFyYW0gZm9ybWF0IEEgY29tcG9zaXRlIGZvcm1hdCBzdHJpbmcuXG4gICAgLy8gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBvYmplY3QgdXNlZCB0byBidWlsZCB0aGUgc3RyaW5nLlxuICAgIC8vICogQHBhcmFtIGZvcm1hdEZ1bmN0aW9uIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG8gZm9ybWF0IGl0ZW1zIGluIGNvbnRleHQuXG4gICAgLy8gKiBAcmV0dXJuIFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgIC8vICovXG4gICAgLy9mdW5jdGlvbiBmb3JtYXQoZm9ybWF0LCBkYXRhLCBmb3JtYXRGdW5jdGlvbikge1xuICAgIC8vICAgIGZvcm1hdCA9IGFzU3RyaW5nKGZvcm1hdCk7XG4gICAgLy8gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKC9cXHsoLio/KSg6KC4qPykpP1xcfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG5hbWUsIHgsIGZtdCkge1xuICAgIC8vICAgICAgICB2YXIgdmFsID0gbWF0Y2g7XG4gICAgLy8gICAgICAgIGlmIChuYW1lICYmIG5hbWVbMF0gIT0gJ3snICYmIGRhdGEpIHtcbiAgICAvLyAgICAgICAgICAgIC8vIGdldCB0aGUgdmFsdWVcbiAgICAvLyAgICAgICAgICAgIHZhbCA9IGRhdGFbbmFtZV07XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIC8vIGFwcGx5IHN0YXRpYyBmb3JtYXRcbiAgICAvLyAgICAgICAgICAgIGlmIChmbXQpIHtcbiAgICAvLyAgICAgICAgICAgICAgICB2YWwgPSB3aWptby5HbG9iYWxpemUuZm9ybWF0KHZhbCwgZm10KTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgLy8gYXBwbHkgZm9ybWF0IGZ1bmN0aW9uXG4gICAgLy8gICAgICAgICAgICBpZiAoZm9ybWF0RnVuY3Rpb24pIHtcbiAgICAvLyAgICAgICAgICAgICAgICB2YWwgPSBmb3JtYXRGdW5jdGlvbihkYXRhLCBuYW1lLCBmbXQsIHZhbCk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICAgICAgcmV0dXJuIHZhbCA9PSBudWxsID8gJycgOiB2YWw7XG4gICAgLy8gICAgfSk7XG4gICAgLy99XG4gICAgLy9nY1V0aWxzLmZvcm1hdCA9IGZvcm1hdDtcblxuICAgIC8qKlxuICAgICAqIENsYW1wcyBhIHZhbHVlIGJldHdlZW4gYSBtaW5pbXVtIGFuZCBhIG1heGltdW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgT3JpZ2luYWwgdmFsdWUuXG4gICAgICogQHBhcmFtIG1pbiBNaW5pbXVtIGFsbG93ZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIG1heCBNYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKG1heCkgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1heDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwobWluKSAmJiB2YWx1ZSA8IG1pbikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWluO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNsYW1wID0gY2xhbXA7XG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgdGhlIHByb3BlcnRpZXMgZnJvbSBhbiBvYmplY3QgdG8gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgbXVzdCBkZWZpbmUgYWxsIHRoZSBwcm9wZXJ0aWVzIGRlZmluZWQgaW4gdGhlIHNvdXJjZSxcbiAgICAgKiBvciBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkc3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gc3JjIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvcHkoZHN0LCBzcmMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgICAgICAgYXNzZXJ0KGtleSBpbiBkc3QsICdVbmtub3duIGtleSBcIicgKyBrZXkgKyAnXCIuJyk7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzcmNba2V5XTtcbiAgICAgICAgICAgIGlmICghZHN0Ll9jb3B5IHx8ICFkc3QuX2NvcHkoa2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmIGRzdFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvcHkoZHN0W2tleV0sIHZhbHVlKTsgLy8gY29weSBzdWItb2JqZWN0c1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gdmFsdWU7IC8vIGFzc2lnbiB2YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnY1V0aWxzLmNvcHkgPSBjb3B5O1xuXG4gICAgLyoqXG4gICAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBhIGNvbmRpdGlvbiBpcyBmYWxzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb25kaXRpb24gQ29uZGl0aW9uIGV4cGVjdGVkIHRvIGJlIHRydWUuXG4gICAgICogQHBhcmFtIG1zZyBNZXNzYWdlIG9mIHRoZSBleGNlcHRpb24gaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgdHJ1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cpIHtcbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHRocm93ICcqKiBBc3NlcnRpb24gZmFpbGVkIGluIFdpam1vOiAnICsgbXNnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc3NlcnQgPSBhc3NlcnQ7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgc3RyaW5nIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1N0cmluZyh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNTdHJpbmcodmFsdWUpLCAnU3RyaW5nIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc1N0cmluZyA9IGFzU3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgbnVtZXJpYy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHBhcmFtIHBvc2l0aXZlIFdoZXRoZXIgdG8gYWNjZXB0IG9ubHkgcG9zaXRpdmUgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICogQHJldHVybiBUaGUgbnVtYmVyIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc051bWJlcih2YWx1ZSwgbnVsbE9LLCBwb3NpdGl2ZSkge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoZWNrVHlwZShwb3NpdGl2ZSwgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgcG9zaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzTnVtYmVyKHZhbHVlKSwgJ051bWJlciBleHBlY3RlZC4nKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIHZhbHVlICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Bvc2l0aXZlIG51bWJlciBleHBlY3RlZC4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzTnVtYmVyID0gYXNOdW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGFuIGludGVnZXIuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEBwYXJhbSBwb3NpdGl2ZSBXaGV0aGVyIHRvIGFjY2VwdCBvbmx5IHBvc2l0aXZlIGludGVnZXJzLlxuICAgICAqIEByZXR1cm4gVGhlIG51bWJlciBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNJbnQodmFsdWUsIG51bGxPSywgcG9zaXRpdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja1R5cGUocG9zaXRpdmUsIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0ludCh2YWx1ZSksICdJbnRlZ2VyIGV4cGVjdGVkLicpO1xuICAgICAgICBpZiAocG9zaXRpdmUgJiYgdmFsdWUgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnUG9zaXRpdmUgaW50ZWdlciBleHBlY3RlZC4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzSW50ID0gYXNJbnQ7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIEJvb2xlYW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgQm9vbGVhbi5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgQm9vbGVhbiBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNCb29sZWFuKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNCb29sZWFuKHZhbHVlKSwgJ0Jvb2xlYW4gZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzQm9vbGVhbiA9IGFzQm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgRGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIERhdGUuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIERhdGUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRGF0ZSh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzRGF0ZSh2YWx1ZSksICdEYXRlIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0RhdGUgPSBhc0RhdGU7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIGZ1bmN0aW9uIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0Z1bmN0aW9uKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNGdW5jdGlvbih2YWx1ZSksICdGdW5jdGlvbiBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNGdW5jdGlvbiA9IGFzRnVuY3Rpb247XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhbiBhcnJheS5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgYXJyYXkgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzQXJyYXkodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0FycmF5KHZhbHVlKSwgJ0FycmF5IGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0FycmF5ID0gYXNBcnJheTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgZ2l2ZW4gdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byBiZSBjaGVja2VkLlxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdmFsdWUgZXhwZWN0ZWQuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1R5cGUodmFsdWUsIHR5cGUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUsIHR5cGUgKyAnIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc1R5cGUgPSBhc1R5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIHZhbGlkIHNldHRpbmcgZm9yIGFuIGVudW1lcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgbWVtYmVyIG9mIHRoZSBlbnVtZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gZW51bVR5cGUgRW51bWVyYXRpb24gdG8gdGVzdCBmb3IuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0VudW0odmFsdWUsIGVudW1UeXBlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgJiYgbnVsbE9LKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZSA9IGVudW1UeXBlW3ZhbHVlXTtcbiAgICAgICAgYXNzZXJ0KCFpc1VuZGVmaW5lZE9yTnVsbChlKSwgJ0ludmFsaWQgZW51bSB2YWx1ZS4nKTtcbiAgICAgICAgcmV0dXJuIGlzTnVtYmVyKGUpID8gZSA6IHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNFbnVtID0gYXNFbnVtO1xuXG4gICAgLyoqXG4gICAgICogRW51bWVyYXRpb24gd2l0aCBrZXkgdmFsdWVzLlxuICAgICAqXG4gICAgICogVGhpcyBlbnVtZXJhdGlvbiBpcyB1c2VmdWwgd2hlbiBoYW5kbGluZyA8Yj5rZXlEb3duPC9iPiBldmVudHMuXG4gICAgICovXG4gICAgdmFyIEtleSA9IHtcbiAgICAgICAgLyoqIFRoZSBiYWNrc3BhY2Uga2V5LiAqL1xuICAgICAgICBCYWNrOiA4LFxuICAgICAgICAvKiogVGhlIHRhYiBrZXkuICovXG4gICAgICAgIFRhYjogOSxcbiAgICAgICAgLyoqIFRoZSBlbnRlciBrZXkuICovXG4gICAgICAgIEVudGVyOiAxMyxcbiAgICAgICAgLyoqIFRoZSBlc2NhcGUga2V5LiAqL1xuICAgICAgICBFc2NhcGU6IDI3LFxuICAgICAgICAvKiogVGhlIHNwYWNlIGtleS4gKi9cbiAgICAgICAgU3BhY2U6IDMyLFxuICAgICAgICAvKiogVGhlIHBhZ2UgdXAga2V5LiAqL1xuICAgICAgICBQYWdlVXA6IDMzLFxuICAgICAgICAvKiogVGhlIHBhZ2UgZG93biBrZXkuICovXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcbiAgICAgICAgLyoqIFRoZSBlbmQga2V5LiAqL1xuICAgICAgICBFbmQ6IDM1LFxuICAgICAgICAvKiogVGhlIGhvbWUga2V5LiAqL1xuICAgICAgICBIb21lOiAzNixcbiAgICAgICAgLyoqIFRoZSBsZWZ0IGFycm93IGtleS4gKi9cbiAgICAgICAgTGVmdDogMzcsXG4gICAgICAgIC8qKiBUaGUgdXAgYXJyb3cga2V5LiAqL1xuICAgICAgICBVcDogMzgsXG4gICAgICAgIC8qKiBUaGUgcmlnaHQgYXJyb3cga2V5LiAqL1xuICAgICAgICBSaWdodDogMzksXG4gICAgICAgIC8qKiBUaGUgZG93biBhcnJvdyBrZXkuICovXG4gICAgICAgIERvd246IDQwLFxuICAgICAgICAvKiogVGhlIGRlbGV0ZSBrZXkuICovXG4gICAgICAgIERlbGV0ZTogNDYsXG4gICAgICAgIC8qKiBUaGUgRjEga2V5LiAqL1xuICAgICAgICBGMTogMTEyLFxuICAgICAgICAvKiogVGhlIEYyIGtleS4gKi9cbiAgICAgICAgRjI6IDExMyxcbiAgICAgICAgLyoqIFRoZSBGMyBrZXkuICovXG4gICAgICAgIEYzOiAxMTQsXG4gICAgICAgIC8qKiBUaGUgRjQga2V5LiAqL1xuICAgICAgICBGNDogMTE1LFxuICAgICAgICAvKiogVGhlIEY1IGtleS4gKi9cbiAgICAgICAgRjU6IDExNixcbiAgICAgICAgLyoqIFRoZSBGNiBrZXkuICovXG4gICAgICAgIEY2OiAxMTcsXG4gICAgICAgIC8qKiBUaGUgRjcga2V5LiAqL1xuICAgICAgICBGNzogMTE4LFxuICAgICAgICAvKiogVGhlIEY4IGtleS4gKi9cbiAgICAgICAgRjg6IDExOSxcbiAgICAgICAgLyoqIFRoZSBGOSBrZXkuICovXG4gICAgICAgIEY5OiAxMjAsXG4gICAgICAgIC8qKiBUaGUgRjEwIGtleS4gKi9cbiAgICAgICAgRjEwOiAxMjEsXG4gICAgICAgIC8qKiBUaGUgRjExIGtleS4gKi9cbiAgICAgICAgRjExOiAxMjIsXG4gICAgICAgIC8qKiBUaGUgRjEyIGtleS4gKi9cbiAgICAgICAgRjEyOiAxMjNcbiAgICB9O1xuICAgIGdjVXRpbHMuS2V5ID0gS2V5O1xuXG4gICAgdmFyIEVkaXRvclR5cGUgPSB7XG4gICAgICAgICdUZXh0JzogJ3RleHQnLFxuICAgICAgICAnQ2hlY2tCb3gnOiAnY2hlY2tib3gnLFxuICAgICAgICAnRGF0ZSc6ICdkYXRlJyxcbiAgICAgICAgJ0NvbG9yJzogJ2NvbG9yJyxcbiAgICAgICAgJ051bWJlcic6ICdudW1iZXInXG4gICAgfTtcbiAgICBnY1V0aWxzLkVkaXRvclR5cGUgPSBFZGl0b3JUeXBlO1xuXG4gICAgdmFyIERhdGFUeXBlID0ge1xuICAgICAgICAnT2JqZWN0JzogJ09iamVjdCcsXG4gICAgICAgICdTdHJpbmcnOiAnU3RyaW5nJyxcbiAgICAgICAgJ051bWJlcic6ICdOdW1iZXInLFxuICAgICAgICAnQm9vbGVhbic6ICdCb29sZWFuJyxcbiAgICAgICAgJ0RhdGUnOiAnRGF0ZScsXG4gICAgICAgICdBcnJheSc6ICdBcnJheSdcbiAgICB9O1xuICAgIGdjVXRpbHMuRGF0YVR5cGUgPSBEYXRhVHlwZTtcblxuICAgIHZhciBpc1VuaXRsZXNzTnVtYmVyID0ge1xuICAgICAgICBjb2x1bW5Db3VudDogdHJ1ZSxcbiAgICAgICAgZmxleDogdHJ1ZSxcbiAgICAgICAgZmxleEdyb3c6IHRydWUsXG4gICAgICAgIGZsZXhTaHJpbms6IHRydWUsXG4gICAgICAgIGZvbnRXZWlnaHQ6IHRydWUsXG4gICAgICAgIGxpbmVDbGFtcDogdHJ1ZSxcbiAgICAgICAgbGluZUhlaWdodDogdHJ1ZSxcbiAgICAgICAgb3BhY2l0eTogdHJ1ZSxcbiAgICAgICAgb3JkZXI6IHRydWUsXG4gICAgICAgIG9ycGhhbnM6IHRydWUsXG4gICAgICAgIHdpZG93czogdHJ1ZSxcbiAgICAgICAgekluZGV4OiB0cnVlLFxuICAgICAgICB6b29tOiB0cnVlLFxuXG4gICAgICAgIC8vIFNWRy1yZWxhdGVkIHByb3BlcnRpZXNcbiAgICAgICAgZmlsbE9wYWNpdHk6IHRydWUsXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHRydWVcbiAgICB9O1xuICAgIHZhciBfdXBwZXJjYXNlUGF0dGVybiA9IC8oW0EtWl0pL2c7XG4gICAgdmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbiAgICBmdW5jdGlvbiBkYW5nZXJvdXNTdHlsZVZhbHVlKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBpc0VtcHR5ID0gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAnJztcbiAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpc05vbk51bWVyaWMgPSBpc05hTih2YWx1ZSk7XG4gICAgICAgIGlmIChpc05vbk51bWVyaWMgfHwgdmFsdWUgPT09IDAgfHxcbiAgICAgICAgICAgIGlzVW5pdGxlc3NOdW1iZXIuaGFzT3duUHJvcGVydHkobmFtZSkgJiYgaXNVbml0bGVzc051bWJlcltuYW1lXSkge1xuICAgICAgICAgICAgcmV0dXJuICcnICsgdmFsdWU7IC8vIGNhc3QgdG8gc3RyaW5nXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlICsgJ3B4JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZW1vaXplU3RyaW5nT25seShjYWxsYmFjaykge1xuICAgICAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgICAgICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbc3RyaW5nXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FjaGVbc3RyaW5nXSA9IGNhbGxiYWNrLmNhbGwodGhpcywgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbc3RyaW5nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgcHJvY2Vzc1N0eWxlTmFtZSA9IG1lbW9pemVTdHJpbmdPbmx5KGZ1bmN0aW9uKHN0eWxlTmFtZSkge1xuICAgICAgICByZXR1cm4gaHlwaGVuYXRlU3R5bGVOYW1lKHN0eWxlTmFtZSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBoeXBoZW5hdGUoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShfdXBwZXJjYXNlUGF0dGVybiwgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICAgICAgICByZXR1cm4gaHlwaGVuYXRlKHN0cmluZykucmVwbGFjZShtc1BhdHRlcm4sICctbXMtJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTWFya3VwRm9yU3R5bGVzKHN0eWxlcykge1xuICAgICAgICB2YXIgc2VyaWFsaXplZCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBzdHlsZU5hbWUgaW4gc3R5bGVzKSB7XG4gICAgICAgICAgICBpZiAoIXN0eWxlcy5oYXNPd25Qcm9wZXJ0eShzdHlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHN0eWxlc1tzdHlsZU5hbWVdO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChzdHlsZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQgKz0gcHJvY2Vzc1N0eWxlTmFtZShzdHlsZU5hbWUpICsgJzonO1xuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZWQgKz0gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShzdHlsZU5hbWUsIHN0eWxlVmFsdWUpICsgJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXJpYWxpemVkIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jcmVhdGVNYXJrdXBGb3JTdHlsZXMgPSBjcmVhdGVNYXJrdXBGb3JTdHlsZXM7XG5cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIHRoZSByb3V0ZSBmb3IgRE9NIGV2ZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbmNlbERlZmF1bHQoZSkge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSUUgOFxuICAgICAgICAgICAgZS5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jYW5jZWxEZWZhdWx0ID0gY2FuY2VsRGVmYXVsdDtcblxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChvYmopIHtcbiAgICAgICAgdmFyIGNsb25lT2JqID0gXy5jbG9uZShvYmopO1xuICAgICAgICB2YXIgY2FjaGVfID0gW107XG4gICAgICAgIGlmIChjbG9uZU9iaikge1xuICAgICAgICAgICAgY2FjaGVfLnB1c2goY2xvbmVPYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0O1xuICAgICAgICB3aGlsZSAoY2FjaGVfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlc3QgPSBjYWNoZV8ucG9wKCk7XG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0KGRlc3QpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluIGRlc3QpIHtcbiAgICAgICAgICAgICAgICBjYWNoZV8ucHVzaChkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihkZXN0W2l0ZW1dKSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0W2l0ZW1dID0gc2VyaWFsaXplRnVuY3Rpb24oZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZU9iajtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZU9iamVjdDtcblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplT2JqZWN0KG9iaikge1xuICAgICAgICB2YXIgY2xvbmVPYmogPSBfLmNsb25lKG9iaik7XG4gICAgICAgIHZhciBjYWNoZV8gPSBbXTtcbiAgICAgICAgaWYgKGNsb25lT2JqKSB7XG4gICAgICAgICAgICBjYWNoZV8ucHVzaChjbG9uZU9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3Q7XG4gICAgICAgIHZhciBmdW5jO1xuICAgICAgICB3aGlsZSAoY2FjaGVfLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlc3QgPSBjYWNoZV8ucG9wKCk7XG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0KGRlc3QpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluIGRlc3QpIHtcbiAgICAgICAgICAgICAgICBjYWNoZV8ucHVzaChkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdHJpbmcoZGVzdFtpdGVtXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYyA9IGRlc2VyaWFsaXplRnVuY3Rpb24oZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0W2l0ZW1dID0gZnVuYztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmVPYmo7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5kZXNlcmlhbGl6ZU9iamVjdCA9IGRlc2VyaWFsaXplT2JqZWN0O1xuXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5zZXJpYWxpemVGdW5jdGlvbiA9IHNlcmlhbGl6ZUZ1bmN0aW9uO1xuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgdGVtcFN0ciA9IHZhbHVlLnN1YnN0cig4LCB2YWx1ZS5pbmRleE9mKCcoJykgLSA4KTsgLy84IGlzICdmdW5jdGlvbicgbGVuZ3RoXG4gICAgICAgICAgICBpZiAodmFsdWUuc3Vic3RyKDAsIDgpID09PSAnZnVuY3Rpb24nICYmIHRlbXBTdHIucmVwbGFjZSgvXFxzKy8sICcnKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJnU3RhcnQgPSB2YWx1ZS5pbmRleE9mKCcoJykgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBhcmdFbmQgPSB2YWx1ZS5pbmRleE9mKCcpJyk7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSB2YWx1ZS5zdWJzdHIoYXJnU3RhcnQsIGFyZ0VuZCAtIGFyZ1N0YXJ0KS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5yZXBsYWNlKC9cXHMrLywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBib2R5U3RhcnQgPSB2YWx1ZS5pbmRleE9mKCd7JykgKyAxO1xuICAgICAgICAgICAgICAgIHZhciBib2R5RW5kID0gdmFsdWUubGFzdEluZGV4T2YoJ30nKTtcbiAgICAgICAgICAgICAgICAvKmpzbGludCBldmlsOiB0cnVlICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLCB2YWx1ZS5zdWJzdHIoYm9keVN0YXJ0LCBib2R5RW5kIC0gYm9keVN0YXJ0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5kZXNlcmlhbGl6ZUZ1bmN0aW9uID0gZGVzZXJpYWxpemVGdW5jdGlvbjtcbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBAc2VlOklDb2xsZWN0aW9uVmlldyBvciBhbiBBcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvciBAc2VlOklDb2xsZWN0aW9uVmlldy5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgQHNlZTpJQ29sbGVjdGlvblZpZXcgdGhhdCB3YXMgcGFzc2VkIGluIG9yIGEgQHNlZTpDb2xsZWN0aW9uVmlld1xuICAgICAqIGNyZWF0ZWQgZnJvbSB0aGUgYXJyYXkgdGhhdCB3YXMgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIC8qXG4gICAgIGZ1bmN0aW9uIGFzQ29sbGVjdGlvblZpZXcodmFsdWUsIG51bGxPSykge1xuICAgICBpZiAodHlwZW9mIG51bGxPSyA9PT0gXCJ1bmRlZmluZWRcIikgeyBudWxsT0sgPSB0cnVlOyB9XG4gICAgIGlmICh2YWx1ZSA9PSBudWxsICYmIG51bGxPSykge1xuICAgICByZXR1cm4gbnVsbDtcbiAgICAgfVxuICAgICB2YXIgY3YgPSB0cnlDYXN0KHZhbHVlLCAnSUNvbGxlY3Rpb25WaWV3Jyk7XG4gICAgIGlmIChjdiAhPSBudWxsKSB7XG4gICAgIHJldHVybiBjdjtcbiAgICAgfVxuICAgICBpZiAoIWlzQXJyYXkodmFsdWUpKSB7XG4gICAgIGFzc2VydChmYWxzZSwgJ0FycmF5IG9yIElDb2xsZWN0aW9uVmlldyBleHBlY3RlZC4nKTtcbiAgICAgfVxuICAgICByZXR1cm4gbmV3IHdpam1vLmNvbGxlY3Rpb25zLkNvbGxlY3Rpb25WaWV3KHZhbHVlKTtcbiAgICAgfVxuICAgICBnY1V0aWxzLmFzQ29sbGVjdGlvblZpZXcgPSBhc0NvbGxlY3Rpb25WaWV3OyovXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSBwbHVnaW4gbW9kdWxlLlxuICAgICAqIEBwYXJhbSBuYW1lIG9mIG1vZHVsZVxuICAgICAqIEByZXR1cm5zIHBsdWdpbiBtb2R1bGUgb2JqZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZFBsdWdpbihuYW1lKSB7XG4gICAgICAgIHZhciBwbHVnaW47XG4gICAgICAgIC8vIGZpbmQgZnJvbSBnbG9iYWxcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBsdWdpbiA9IEdjU3ByZWFkLlZpZXdzLkdjR3JpZC5QbHVnaW5zW25hbWVdOy8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmICghcGx1Z2luICYmIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgey8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvLyAgICBwbHVnaW4gPSByZXF1aXJlanMgJiYgcmVxdWlyZWpzKG5hbWUpIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy8vLyBjb21tb25qcyBub3Qgc3VwcG9ydGVkIG5vd1xuICAgICAgICAvL2lmICghcGx1Z2luICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykgey8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAvL31cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmZpbmRQbHVnaW4gPSBmaW5kUGx1Z2luO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnY1V0aWxzO1xufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIiwiLy8gZG9ULmpzXG4vLyAyMDExLTIwMTQsIExhdXJhIERva3Rvcm92YSwgaHR0cHM6Ly9naXRodWIuY29tL29sYWRvL2RvVFxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBkb1QgPSB7XG4gICAgICAgIHZlcnNpb246IFwiMS4wLjNcIixcbiAgICAgICAgdGVtcGxhdGVTZXR0aW5nczoge1xuICAgICAgICAgICAgZXZhbHVhdGU6IC9cXHtcXHsoW1xcc1xcU10rPyhcXH0/KSspXFx9XFx9L2csXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZTogL1xce1xcez0oW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIGVuY29kZTogL1xce1xceyEoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIHVzZTogL1xce1xceyMoW1xcc1xcU10rPylcXH1cXH0vZyxcbiAgICAgICAgICAgIHVzZVBhcmFtczogLyhefFteXFx3JF0pZGVmKD86XFwufFxcW1tcXCdcXFwiXSkoW1xcdyRcXC5dKykoPzpbXFwnXFxcIl1cXF0pP1xccypcXDpcXHMqKFtcXHckXFwuXSt8XFxcIlteXFxcIl0rXFxcInxcXCdbXlxcJ10rXFwnfFxce1teXFx9XStcXH0pL2csXG4gICAgICAgICAgICBkZWZpbmU6IC9cXHtcXHsjI1xccyooW1xcd1xcLiRdKylcXHMqKFxcOnw9KShbXFxzXFxTXSs/KSNcXH1cXH0vZyxcbiAgICAgICAgICAgIGRlZmluZVBhcmFtczogL15cXHMqKFtcXHckXSspOihbXFxzXFxTXSspLyxcbiAgICAgICAgICAgIGNvbmRpdGlvbmFsOiAvXFx7XFx7XFw/KFxcPyk/XFxzKihbXFxzXFxTXSo/KVxccypcXH1cXH0vZyxcbiAgICAgICAgICAgIGl0ZXJhdGU6IC9cXHtcXHt+XFxzKig/OlxcfVxcfXwoW1xcc1xcU10rPylcXHMqXFw6XFxzKihbXFx3JF0rKVxccyooPzpcXDpcXHMqKFtcXHckXSspKT9cXHMqXFx9XFx9KS9nLFxuICAgICAgICAgICAgdmFybmFtZTogXCJpdFwiLFxuICAgICAgICAgICAgc3RyaXA6IHRydWUsXG4gICAgICAgICAgICBhcHBlbmQ6IHRydWUsXG4gICAgICAgICAgICBzZWxmY29udGFpbmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRvTm90U2tpcEVuY29kZWQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsIC8vZm4sIGNvbXBpbGUgdGVtcGxhdGVcbiAgICAgICAgY29tcGlsZTogdW5kZWZpbmVkICAvL2ZuLCBmb3IgZXhwcmVzc1xuICAgIH0sIF9nbG9iYWxzO1xuXG4gICAgZG9ULmVuY29kZUhUTUxTb3VyY2UgPSBmdW5jdGlvbihkb05vdFNraXBFbmNvZGVkKSB7XG4gICAgICAgIHZhciBlbmNvZGVIVE1MUnVsZXMgPSB7XCImXCI6IFwiJiMzODtcIiwgXCI8XCI6IFwiJiM2MDtcIiwgXCI+XCI6IFwiJiM2MjtcIiwgJ1wiJzogXCImIzM0O1wiLCBcIidcIjogXCImIzM5O1wiLCBcIi9cIjogXCImIzQ3O1wifSxcbiAgICAgICAgICAgIG1hdGNoSFRNTCA9IGRvTm90U2tpcEVuY29kZWQgPyAvWyY8PlwiJ1xcL10vZyA6IC8mKD8hIz9cXHcrOyl8PHw+fFwifCd8XFwvL2c7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29kZSA/IGNvZGUudG9TdHJpbmcoKS5yZXBsYWNlKG1hdGNoSFRNTCwgZnVuY3Rpb24obSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVIVE1MUnVsZXNbbV0gfHwgbTtcbiAgICAgICAgICAgIH0pIDogXCJcIjtcbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICBfZ2xvYmFscyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgfHwgKDAsIGV2YWwpKFwidGhpc1wiKTtcbiAgICB9KCkpO1xuXG4gICAgLy9IaWJlclxuICAgIC8vcmVwbGF0ZSB0aGUgbW9kdWxlIGRlZmluaXRpb24gd2l0aCBzaW1wbGUgbW9kdWxlLmV4cG9ydHMgc2luY2Ugd2Ugb25seSBydW5cbiAgICAvL2l0IGluIG5vZGUgbGlrZSBlbnZpcm9ubWVudFxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb1Q7XG4gICAgLy9pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vXG4gICAgLy99IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy9cdGRlZmluZShmdW5jdGlvbigpe3JldHVybiBkb1Q7fSk7XG4gICAgLy99IGVsc2Uge1xuICAgIC8vXHRfZ2xvYmFscy5kb1QgPSBkb1Q7XG4gICAgLy99XG5cbiAgICB2YXIgc3RhcnRlbmQgPSB7XG4gICAgICAgIGFwcGVuZDoge3N0YXJ0OiBcIicrKFwiLCBlbmQ6IFwiKSsnXCIsIHN0YXJ0ZW5jb2RlOiBcIicrZW5jb2RlSFRNTChcIn0sXG4gICAgICAgIHNwbGl0OiB7c3RhcnQ6IFwiJztvdXQrPShcIiwgZW5kOiBcIik7b3V0Kz0nXCIsIHN0YXJ0ZW5jb2RlOiBcIic7b3V0Kz1lbmNvZGVIVE1MKFwifVxuICAgIH0sIHNraXAgPSAvJF4vO1xuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZURlZnMoYywgYmxvY2ssIGRlZikge1xuICAgICAgICByZXR1cm4gKCh0eXBlb2YgYmxvY2sgPT09IFwic3RyaW5nXCIpID8gYmxvY2sgOiBibG9jay50b1N0cmluZygpKVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5kZWZpbmUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSwgYXNzaWduLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChjb2RlLmluZGV4T2YoXCJkZWYuXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlLnN1YnN0cmluZyg0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoY29kZSBpbiBkZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NpZ24gPT09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5kZWZpbmVQYXJhbXMpIHZhbHVlLnJlcGxhY2UoYy5kZWZpbmVQYXJhbXMsIGZ1bmN0aW9uKG0sIHBhcmFtLCB2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmW2NvZGVdID0ge2FyZzogcGFyYW0sIHRleHQ6IHZ9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShjb2RlIGluIGRlZikpIGRlZltjb2RlXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZ1bmN0aW9uKFwiZGVmXCIsIFwiZGVmWydcIiArIGNvZGUgKyBcIiddPVwiICsgdmFsdWUpKGRlZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy51c2UgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjLnVzZVBhcmFtcykgY29kZSA9IGNvZGUucmVwbGFjZShjLnVzZVBhcmFtcywgZnVuY3Rpb24obSwgcywgZCwgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZltkXSAmJiBkZWZbZF0uYXJnICYmIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcncgPSAoZCArIFwiOlwiICsgcGFyYW0pLnJlcGxhY2UoLyd8XFxcXC9nLCBcIl9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWYuX19leHAgPSBkZWYuX19leHAgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWYuX19leHBbcnddID0gZGVmW2RdLnRleHQucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58W15cXFxcdyRdKVwiICsgZGVmW2RdLmFyZyArIFwiKFteXFxcXHckXSlcIiwgXCJnXCIpLCBcIiQxXCIgKyBwYXJhbSArIFwiJDJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcyArIFwiZGVmLl9fZXhwWydcIiArIHJ3ICsgXCInXVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHYgPSBuZXcgRnVuY3Rpb24oXCJkZWZcIiwgXCJyZXR1cm4gXCIgKyBjb2RlKShkZWYpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID8gcmVzb2x2ZURlZnMoYywgdiwgZGVmKSA6IHY7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZShjb2RlKSB7XG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoL1xcXFwoJ3xcXFxcKS9nLCBcIiQxXCIpLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKTtcbiAgICB9XG5cbiAgICBkb1QudGVtcGxhdGUgPSBmdW5jdGlvbih0bXBsLCBjLCBkZWYsIGRvbnRSZW5kZXJOdWxsT3JVbmRlZmluZWQpIHtcbiAgICAgICAgYyA9IGMgfHwgZG9ULnRlbXBsYXRlU2V0dGluZ3M7XG4gICAgICAgIHZhciBjc2UgPSBjLmFwcGVuZCA/IHN0YXJ0ZW5kLmFwcGVuZCA6IHN0YXJ0ZW5kLnNwbGl0LCBuZWVkaHRtbGVuY29kZSwgc2lkID0gMCwgaW5kdixcbiAgICAgICAgICAgIHN0ciA9IChjLnVzZSB8fCBjLmRlZmluZSkgPyByZXNvbHZlRGVmcyhjLCB0bXBsLCBkZWYgfHwge30pIDogdG1wbDtcblxuICAgICAgICB2YXIgdW5lc2NhcGVDb2RlO1xuXG4gICAgICAgIHN0ciA9IChcInZhciBvdXQ9J1wiICsgKGMuc3RyaXAgPyBzdHIucmVwbGFjZSgvKF58XFxyfFxcbilcXHQqICt8ICtcXHQqKFxccnxcXG58JCkvZywgXCIgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyfFxcbnxcXHR8XFwvXFwqW1xcc1xcU10qP1xcKlxcLy9nLCBcIlwiKSA6IHN0cilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8nfFxcXFwvZywgXCJcXFxcJCZcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuaW50ZXJwb2xhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGlmICghIWRvbnRSZW5kZXJOdWxsT3JVbmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5lc2NhcGVDb2RlID0gdW5lc2NhcGUoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlLmluZGV4T2YoJ3x8JykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlQ29kZSArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgJyh0eXBlb2YgJyArIGNvZGUgKyAnICE9PSBcInVuZGVmaW5lZFwiICYmICcgKyBjb2RlICsgJyE9PSBudWxsKT8nICsgdW5lc2NhcGVDb2RlICsgJzogXCJcIicgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZW5jb2RlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBuZWVkaHRtbGVuY29kZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydGVuY29kZSArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmNvbmRpdGlvbmFsIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGVsc2VjYXNlLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsc2VjYXNlID9cbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPyBcIic7fWVsc2UgaWYoXCIgKyB1bmVzY2FwZShjb2RlKSArIFwiKXtvdXQrPSdcIiA6IFwiJzt9ZWxzZXtvdXQrPSdcIikgOlxuICAgICAgICAgICAgICAgICAgICAoY29kZSA/IFwiJztpZihcIiArIHVuZXNjYXBlKGNvZGUpICsgXCIpe291dCs9J1wiIDogXCInO31vdXQrPSdcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5pdGVyYXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGl0ZXJhdGUsIHZuYW1lLCBpbmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICghaXRlcmF0ZSkgcmV0dXJuIFwiJzt9IH0gb3V0Kz0nXCI7XG4gICAgICAgICAgICAgICAgc2lkICs9IDE7XG4gICAgICAgICAgICAgICAgaW5kdiA9IGluYW1lIHx8IFwiaVwiICsgc2lkO1xuICAgICAgICAgICAgICAgIGl0ZXJhdGUgPSB1bmVzY2FwZShpdGVyYXRlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1xcJzt2YXIgYXJyJyArIHNpZCArICc9JyArIGl0ZXJhdGUgKyBcIjtpZihhcnJcIiArIHNpZCArIFwiKXt2YXIgXCIgKyB2bmFtZSArIFwiLFwiICsgaW5kdiArIFwiPS0xLGxcIiArIHNpZCArIFwiPWFyclwiICsgc2lkICsgXCIubGVuZ3RoLTE7d2hpbGUoXCIgKyBpbmR2ICsgXCI8bFwiICsgc2lkICsgXCIpe1wiXG4gICAgICAgICAgICAgICAgICAgICsgdm5hbWUgKyBcIj1hcnJcIiArIHNpZCArIFwiW1wiICsgaW5kdiArIFwiKz0xXTtvdXQrPSdcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmV2YWx1YXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCInO1wiICsgdW5lc2NhcGUoY29kZSkgKyBcIm91dCs9J1wiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKyBcIic7cmV0dXJuIG91dDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKS5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0JykucmVwbGFjZSgvXFxyL2csIFwiXFxcXHJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxzfDt8XFx9fF58XFx7KW91dFxcKz0nJzsvZywgJyQxJykucmVwbGFjZSgvXFwrJycvZywgXCJcIik7XG4gICAgICAgIC8vLnJlcGxhY2UoLyhcXHN8O3xcXH18XnxcXHspb3V0XFwrPScnXFwrL2csJyQxb3V0Kz0nKTtcblxuICAgICAgICBpZiAobmVlZGh0bWxlbmNvZGUpIHtcbiAgICAgICAgICAgIGlmICghYy5zZWxmY29udGFpbmVkICYmIF9nbG9iYWxzICYmICFfZ2xvYmFscy5fZW5jb2RlSFRNTCkgX2dsb2JhbHMuX2VuY29kZUhUTUwgPSBkb1QuZW5jb2RlSFRNTFNvdXJjZShjLmRvTm90U2tpcEVuY29kZWQpO1xuICAgICAgICAgICAgc3RyID0gXCJ2YXIgZW5jb2RlSFRNTCA9IHR5cGVvZiBfZW5jb2RlSFRNTCAhPT0gJ3VuZGVmaW5lZCcgPyBfZW5jb2RlSFRNTCA6IChcIlxuICAgICAgICAgICAgICAgICsgZG9ULmVuY29kZUhUTUxTb3VyY2UudG9TdHJpbmcoKSArIFwiKFwiICsgKGMuZG9Ob3RTa2lwRW5jb2RlZCB8fCAnJykgKyBcIikpO1wiXG4gICAgICAgICAgICAgICAgKyBzdHI7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYy52YXJuYW1lLCBzdHIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IGNyZWF0ZSBhIHRlbXBsYXRlIGZ1bmN0aW9uOiBcIiArIHN0cik7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvVC5jb21waWxlID0gZnVuY3Rpb24odG1wbCwgZGVmKSB7XG4gICAgICAgIHJldHVybiBkb1QudGVtcGxhdGUodG1wbCwgbnVsbCwgZGVmKTtcbiAgICB9O1xuXG59KCkpO1xuXG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZG9ULmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZ2NVdGlscyA9IHJlcXVpcmUoJy4vZ2NVdGlscycpO1xuXG4gICAgdmFyIGRvbVV0aWwgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZWxlbWVudCBmcm9tIGFuIEhUTUwgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGh0bWwgSFRNTCBmcmFnbWVudCB0byBjb252ZXJ0IGludG8gYW4gSFRNTEVsZW1lbnQuXG4gICAgICogQHJldHVybiBUaGUgbmV3IGVsZW1lbnQuXG4gICAgICovXG5cbiAgICAvL3JlbW92ZSBhbGwgY29tbWVudHMgYW5kIHdoaXRlc3BhY2Ugb25seSB0ZXh0IG5vZGVzXG4gICAgZnVuY3Rpb24gY2xlYW4obm9kZSkge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgbisrKSB7IC8vZG8gcmV3cml0ZSBpdCB0byBmb3IodmFyIG49MCxsZW49WFhYO2k8bGVuOylcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbbl07XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSA4IHx8IChjaGlsZC5ub2RlVHlwZSA9PT0gMyAmJiAhL1xcUy8udGVzdChjaGlsZC5ub2RlVmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgbi0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4oY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbVV0aWwuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdmFyIHIgPSBkaXYuY2hpbGRyZW5bMF07XG4gICAgICAgIGRpdiA9IG51bGw7XG4gICAgICAgIHJldHVybiByO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmNyZWF0ZVRlbXBsYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdmFyIHIgPSBkaXYuY2hpbGRyZW5bMF07XG4gICAgICAgIGNsZWFuKHIpO1xuICAgICAgICByZXR1cm4gZGl2O1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldEVsZW1lbnRJbm5lclRleHQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmlubmVySFRNTC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKS5yZXBsYWNlKC8mZ3Q7L2csICc+Jyk7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0RWxlbWVudE91dGVyVGV4dCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub3V0ZXJIVE1MLnJlcGxhY2UoLyZhbXA7L2csICcmJykucmVwbGFjZSgvJmx0Oy9nLCAnPCcpLnJlcGxhY2UoLyZndDsvZywgJz4nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgICAqL1xuICAgIGRvbVV0aWwuaGFzQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoJ1xcXFxiJyArIGNsYXNzTmFtZSArICdcXFxcYicpO1xuICAgICAgICAgICAgcmV0dXJuIGUgJiYgcngudGVzdChlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byByZW1vdmUgZm9ybSB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuc2V0QXR0cmlidXRlICYmIGRvbVV0aWwuaGFzQ2xhc3MoZSwgY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCgnXFxcXHM/XFxcXGInICsgY2xhc3NOYW1lICsgJ1xcXFxiJywgJ2cnKTtcbiAgICAgICAgICAgIHZhciBjbiA9IGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY24ucmVwbGFjZShyeCwgJycpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgY2xhc3MgdG8gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGFkZCB0byB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmFkZENsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuc2V0QXR0cmlidXRlICYmICFkb21VdGlsLmhhc0NsYXNzKGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBjbiA9IGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY24gPyBjbiArICcgJyArIGNsYXNzTmFtZSA6IGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBvciByZW1vdmVzIGEgY2xhc3MgdG8gb3IgZnJvbSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIGFkZGVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gYWRkIG9yIHJlbW92ZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFkZE9yUmVtb3ZlIFdoZXRoZXIgdG8gYWRkIG9yIHJlbW92ZSB0aGUgY2xhc3MuXG4gICAgICovXG4gICAgZG9tVXRpbC50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSwgYWRkT3JSZW1vdmUpIHtcbiAgICAgICAgaWYgKGFkZE9yUmVtb3ZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkb21VdGlsLmFkZENsYXNzKGUsIGNsYXNzTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb21VdGlsLnJlbW92ZUNsYXNzKGUsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gKiogalF1ZXJ5IHJlcGxhY2VtZW50IG1ldGhvZHNcbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGVsZW1lbnQgZnJvbSBhIGpRdWVyeS1zdHlsZSBzZWxlY3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IHNlbGVjdG9yIEFuIGVsZW1lbnQsIGEgc2VsZWN0b3Igc3RyaW5nLCBvciBhIGpRdWVyeSBvYmplY3QuXG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2NVdGlscy5pc1N0cmluZyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYW4gSFRNTCBlbGVtZW50IGNvbnRhaW5zIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudCBQYXJlbnQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGNoaWxkIENoaWxkIGVsZW1lbnQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGFyZW50IGVsZW1lbnQgY29udGFpbnMgdGhlIGNoaWxkIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5jb250YWlucyA9IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgZm9yICh2YXIgZSA9IGNoaWxkOyBlOyBlID0gZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoZSA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGNvb3JkaW5hdGVzIG9mIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgZG9tVXRpbC5vZmZzZXQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgKyBlbGVtZW50LnNjcm9sbFRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCArIGVsZW1lbnQuc2Nyb2xsTGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBib3VuZGluZyByZWN0YW5nbGUgb2YgYW4gZWxlbWVudCBpbiBwYWdlIGNvb3JkaW5hdGVzLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBzaW1pbGFyIHRvIHRoZSA8Yj5nZXRCb3VuZGluZ0NsaWVudFJlY3Q8L2I+IGZ1bmN0aW9uLFxuICAgICAqIGV4Y2VwdCB0aGF0IHVzZXMgd2luZG93IGNvb3JkaW5hdGVzLCB3aGljaCBjaGFuZ2Ugd2hlbiB0aGVcbiAgICAgKiBkb2N1bWVudCBzY3JvbGxzLlxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciByYyA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiByYy5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICAgICAgdG9wOiByYy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICB3aWR0aDogcmMud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHJjLmhlaWdodFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGlubmVyIGNvbnRlbnQgcmVjdGFuZ2xlIG9mIGlucHV0IGVsZW1lbnQuXG4gICAgICogUGFkZGluZyBhbmQgYm94LXNpemluZyBpcyBjb25zaWRlcmVkLlxuICAgICAqIFRoZSByZXN1bHQgaXMgdGhlIGFjdHVhbCByZWN0YW5nbGUgdG8gcGxhY2UgY2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gZSByZXByZXNlbnQgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBkb21VdGlsLmdldENvbnRlbnRSZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmMgPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmdldFN0eWxlKGUpO1xuICAgICAgICB2YXIgbWVhc3VyZW1lbnRzID0gW1xuICAgICAgICAgICAgJ3BhZGRpbmdMZWZ0JyxcbiAgICAgICAgICAgICdwYWRkaW5nUmlnaHQnLFxuICAgICAgICAgICAgJ3BhZGRpbmdUb3AnLFxuICAgICAgICAgICAgJ3BhZGRpbmdCb3R0b20nLFxuICAgICAgICAgICAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyVG9wV2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlckJvdHRvbVdpZHRoJ1xuICAgICAgICBdO1xuICAgICAgICB2YXIgc2l6ZSA9IHt9O1xuICAgICAgICBtZWFzdXJlbWVudHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdChzdHlsZVtwcm9wXSk7XG4gICAgICAgICAgICBzaXplW3Byb3BdID0gIWlzTmFOKG51bSkgPyBudW0gOiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHBhZGRpbmdXaWR0aCA9IHNpemUucGFkZGluZ0xlZnQgKyBzaXplLnBhZGRpbmdSaWdodDtcbiAgICAgICAgdmFyIHBhZGRpbmdIZWlnaHQgPSBzaXplLnBhZGRpbmdUb3AgKyBzaXplLnBhZGRpbmdCb3R0b207XG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9IHNpemUuYm9yZGVyTGVmdFdpZHRoICsgc2l6ZS5ib3JkZXJSaWdodFdpZHRoO1xuICAgICAgICB2YXIgYm9yZGVySGVpZ2h0ID0gc2l6ZS5ib3JkZXJUb3BXaWR0aCArIHNpemUuYm9yZGVyQm90dG9tV2lkdGg7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiByYy5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0ICsgc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLnBhZGRpbmdMZWZ0LFxuICAgICAgICAgICAgdG9wOiByYy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQgKyBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5wYWRkaW5nVG9wLFxuICAgICAgICAgICAgd2lkdGg6IHJjLndpZHRoIC0gcGFkZGluZ1dpZHRoIC0gYm9yZGVyV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHJjLmhlaWdodCAtIHBhZGRpbmdIZWlnaHQgLSBib3JkZXJIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9kaWZpZXMgdGhlIHN0eWxlIG9mIGFuIGVsZW1lbnQgYnkgYXBwbHlpbmcgdGhlIHByb3BlcnRpZXMgc3BlY2lmaWVkIGluIGFuIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHdob3NlIHN0eWxlIHdpbGwgYmUgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNzcyBPYmplY3QgY29udGFpbmluZyB0aGUgc3R5bGUgcHJvcGVydGllcyB0byBhcHBseSB0byB0aGUgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLnNldENzcyA9IGZ1bmN0aW9uKGUsIGNzcykge1xuICAgICAgICB2YXIgcyA9IGUuc3R5bGU7XG4gICAgICAgIGZvciAodmFyIHAgaW4gY3NzKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gY3NzW3BdO1xuICAgICAgICAgICAgaWYgKGdjVXRpbHMuaXNOdW1iZXIodmFsKSkge1xuICAgICAgICAgICAgICAgIGlmIChwLm1hdGNoKC93aWR0aHxoZWlnaHR8bGVmdHx0b3B8cmlnaHR8Ym90dG9tfHNpemV8cGFkZGluZ3xtYXJnaW4nL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSAncHgnOyAvLyBkZWZhdWx0IHVuaXQgZm9yIGdlb21ldHJ5IHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzW3BdID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb21VdGlsLnNjcm9sbGJhclNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21VdGlsLnNjcm9sbGJhclNpemU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGl2ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IHRvcDotMTAwMDBweDsgbGVmdDotMTAwMDBweDsgd2lkdGg6MTAwcHg7IGhlaWdodDoxMDBweDsgb3ZlcmZsb3c6c2Nyb2xsO1wiPjwvZGl2PicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBkaXYub2Zmc2V0V2lkdGggLSBkaXYuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGRpdi5vZmZzZXRIZWlnaHQgLSBkaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG5cbiAgICAgICAgcmV0dXJuIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZTtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTdHlsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGZuID0gZ2V0Q29tcHV0ZWRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZTtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbihlbGVtZW50LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRTdHlsZVZhbHVlID0gZnVuY3Rpb24oZWxlbWVudCwgc3R5bGVQcm9wZXJ0eSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb21VdGlsLmdldFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gc3R5bGUgPyBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlUHJvcGVydHkpIDogbnVsbDtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5HZXRNYXhTdXBwb3J0ZWRDU1NIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaCA9IDEwMDAwMDA7XG4gICAgICAgIHZhciB0ZXN0VXBUbyA9IDYwMDAwMDAgKiAxMDAwO1xuICAgICAgICB2YXIgZGl2ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IHN0eWxlPVwiZGlzcGxheTpub25lXCIvPicpO1xuICAgICAgICB2YXIgdGVzdDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdGVzdCA9IGggKyA1MDAwMDA7IC8vKiAyO1xuICAgICAgICAgICAgZGl2LnN0eWxlLmhlaWdodCA9IHRlc3QgKyAncHgnO1xuICAgICAgICAgICAgaWYgKHRlc3QgPiB0ZXN0VXBUbyB8fCBkaXYub2Zmc2V0SGVpZ2h0ICE9PSB0ZXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoID0gdGVzdDtcbiAgICAgICAgfVxuICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuICAgICAgICBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodCA9IGg7XG4gICAgICAgIHJldHVybiBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodDtcbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb21VdGlsO1xufSgpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2RvbVV0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiQ2FyZExheW91dEVuZ2luZS5qcyJ9