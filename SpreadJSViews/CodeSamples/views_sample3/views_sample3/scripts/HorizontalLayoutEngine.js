(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["HorizontalLayoutEngine"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["HorizontalLayoutEngine"] = factory();
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
	    var COLUMN_HEADER = 'columnHeader';
	    var ROW_HEADER = 'rowHeader';
	    var CORNER_HEADER = 'cornerHeader';
	    var GROUP_DRAG_PANEL = 'groupingPanel';
	    var GROUP_DRAG_TEXT = 'Drag a column header here and drop it to group by that column';
	    var RESIZE_GAP_SIZE = 4;
	
	    var PADDING_LEFT = 'padding-left';
	    var PADDING_RIGHT = 'padding-right';
	
	    var GROUP_HEADER = 'groupHeader';
	    var GROUP_FOOTER = 'groupFooter';
	    var GROUP_CONTENT = 'groupContent';
	    var SelectMode = {
	        NONE: 'none',
	        SINGLE: 'single',
	        MULTIPLE: 'multiple'
	    };
	    var swipeStatus = {};
	    var FLICK_THRESHOLD_V = 0.8;
	
	    var HorizontalLayoutEngine = function(options) {
	        var optionDefaults = {
	            colHeaderHeight: 80,
	            colWidth: '*',
	            rowHeaderWidth: 24,
	            rowHeight: 80,
	            showRowHeader: true,
	            showColHeader: true,
	            showGroupHeader: true,
	            showGroupFooter: true,
	            allowEditing: false,
	            allowGrouping: false,  //if set to true, it will show a group drag panel to help user grouping the data at runtime
	            allowSorting: false,
	            selectionMode: SelectMode.SINGLE,
	            allowHeaderSelect: false,
	            editMode: 'inline'
	        };
	
	        var self = this;
	        self.layoutInfo_ = null;
	
	        self.name = 'HorizontalLayoutEngine'; //name must end with LayoutEngine
	        self.options = _.defaults(options || {}, optionDefaults);
	    };
	
	    HorizontalLayoutEngine.prototype = {
	        getColumnDefaults_: function() {
	            var self = this;
	            var options = self.options;
	            return {
	                width: options.colWidth,
	                visible: true,
	                allowSorting: options.allowSorting,
	                allowEditing: options.allowEditing
	            };
	        },
	
	        init: function(grid) {
	            var self = this;
	
	            self.grid = grid;
	            grid.columns = _.map(grid.columns, function(col) {
	                return _.defaults(col, _.defaults(self.getColumnDefaults_(), {
	                    caption: col.dataField,
	                    id: col.dataField
	                }));
	            });
	            _.each(grid.columns, function(col) {
	                col.visibleWidth = col.width;
	            });
	            updateStartSize_.call(self);
	            //If there is row template, use the actual column width in row template.
	            consolidateColumnWidth_.call(self);
	        },
	
	        getLayoutInfo: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getLayoutInfo();
	            }
	            if (self.layoutInfo_) {
	                return self.layoutInfo_;
	            }
	            self.layoutInfo_ = {};
	
	            self.layoutInfo_[VIEWPORT] = getViewportLayoutInfo_.call(this);
	            self.layoutInfo_[CORNER_HEADER] = getCornerHeaderLayoutInfo_.call(this);
	            self.layoutInfo_[ROW_HEADER] = getRowHeaderLayoutInfo_.call(this);
	            self.layoutInfo_[COLUMN_HEADER] = getColumnHeaderLayoutInfo_.call(this);
	
	            if (self.options.allowGrouping) {
	                self.layoutInfo_[GROUP_DRAG_PANEL] = getGroupDragPanelLayoutInfo_.call(this);
	            }
	            return self.layoutInfo_;
	        },
	
	        getRenderInfo: function(options) {
	            var scope = this;
	            if (scope.groupStrategy_) {
	                return scope.groupStrategy_.getRenderInfo(options);
	            }
	
	            var area = (options && options.area) || '';
	            if (!area) {
	                return null;
	            }
	
	            var uid = scope.grid.uid;
	            var layoutInfo = this.getLayoutInfo();
	            var currLayoutInfo = layoutInfo[area];
	            var width = currLayoutInfo.width;
	            var height = currLayoutInfo.height;
	            var r;
	            var i;
	            var rowHeight = scope.options.rowHeight;
	            var start;
	            var end;
	            var offsetLeft;
	            var grid = scope.grid;
	
	            var renderRange = getRenderRangeInfo_.call(scope, area, currLayoutInfo, options);
	            start = renderRange.start;
	            end = renderRange.end;
	            offsetLeft = renderRange.offsetLeft;
	
	            if (area === VIEWPORT) {
	                r = {
	                    outerDivCssClass: 'gc-viewport',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width,
	                        overflow: OVERFLOW_HIDDEN
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        width: width,
	                        height: currLayoutInfo.contentHeight
	                    },
	                    innerDivTranslate: {
	                        left: -options.offsetLeft,
	                        top: -options.offsetTop
	                    },
	                    renderedRows: []
	                };
	
	                if (hasGroup_(grid)) {
	                    r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(this, start, end, offsetLeft, false));
	                } else {
	                    for (i = start; i < end; i++) {
	                        r.renderedRows.push(createRowRenderInfo_.call(scope, i, rowHeight, uid));
	                    }
	                }
	            } else if (area === CORNER_HEADER) {
	                r = {
	                    outerDivCssClass: 'gc-cornerHeader',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width,
	                        overflow: OVERFLOW_HIDDEN,
	                        zIndex: 10
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        height: height,
	                        width: width
	                    },
	                    renderedRows: [{
	                        key: uid + '-corner',
	                        isRowRole: false,
	                        renderInfo: {
	                            cssClass: 'gc-corner-header-cell ch',
	                            style: {
	                                height: '100%'
	                            },
	                            renderedHTML: scope.options.allowHeaderSelect ? '<div id="' + uid + '-corner-select" class="gc-icon gc-header-select-icon' + ((grid.data.itemCount === (scope.selectedRows_ && scope.selectedRows_.length)) ? ' selected' : '') + '"></div>' : ''
	                        }
	                    }]
	                };
	            } else if (area === COLUMN_HEADER) {
	                r = {
	                    outerDivCssClass: 'gc-columnHeader',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width,
	                        overflow: OVERFLOW_HIDDEN
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        height: currLayoutInfo.contentHeight,
	                        width: width
	                    },
	                    innerDivTranslate: {
	                        left: 0,
	                        top: -options.offsetTop
	                    },
	                    renderedRows: getRenderedColumnHeaderInfo_.call(this)
	                };
	            } else if (area === ROW_HEADER) {
	                r = {
	                    outerDivCssClass: 'gc-rowHeader',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width,
	                        overflow: OVERFLOW_HIDDEN
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        width: width,
	                        height: currLayoutInfo.contentHeight
	                    },
	                    innerDivTranslate: {
	                        left: -options.offsetLeft || 0,
	                        top: 0
	                    },
	                    renderedRows: []
	                };
	                if (hasGroup_(grid)) {
	                    r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(this, start, end, offsetLeft, true));
	                } else {
	                    for (i = start; i < end; i++) {
	                        r.renderedRows.push(getRowHeaderCellRenderInfo_.call(scope, null, i, rowHeight, offsetLeft));
	                        offsetLeft += rowHeight;
	                    }
	                }
	            } else if (area === GROUP_DRAG_PANEL) {
	                r = {
	                    outerDivCssClass: 'gc-grouping-container no-select',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width,
	                        overflow: OVERFLOW_HIDDEN
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        top: currLayoutInfo.top,
	                        left: currLayoutInfo.left,
	                        height: height,
	                        width: width
	                    },
	                    renderedRows: []
	                };
	                r.renderedRows.push({
	                    isRowRole: false,
	                    renderInfo: {
	                        renderedHTML: getRenderedGroupDragPanelInfo_.call(scope, true)
	                    }
	                });
	            }
	            return r;
	        },
	
	        getRowTemplate: function() {
	            var self = this;
	            return self.cachedTmplFn_ || getTemplate_.call(self, false);
	        },
	
	        getInitialScrollOffset: function() {
	            return {
	                top: 0,
	                left: 0
	            };
	        },
	
	        showScrollPanel: function(area) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.showScrollPanel(area);
	            }
	            if (area === VIEWPORT) {
	                var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	                if (layoutInfo.height < layoutInfo.contentHeight ||
	                    layoutInfo.width < layoutInfo.contentWidth) {
	                    return true;
	                }
	            }
	            return false;
	        },
	
	        getScrollPanelRenderInfo: function(area) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.getScrollPanelRenderInfo(area);
	            }
	            if (area === VIEWPORT) {
	                var layout = self.getLayoutInfo();
	                var columnHeaderLayoutInfo = layout[COLUMN_HEADER];
	                var rowHeaderLayoutInfo = layout[ROW_HEADER];
	                var viewportLayout = layout[VIEWPORT];
	                var showHScrollbar = viewportLayout.contentWidth > viewportLayout.width;
	                var showVScrollbar = viewportLayout.contentHeight > viewportLayout.height;
	                return {
	                    outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-left scroll-top',
	                    outerDivStyle: {
	                        position: POS_ABS,
	                        top: this.options.allowGrouping ? layout[GROUP_DRAG_PANEL].height : 0,
	                        left: 0,
	                        height: viewportLayout.height + rowHeaderLayoutInfo.height + (showHScrollbar ? domUtil.getScrollbarSize().height : 0),
	                        width: viewportLayout.width + columnHeaderLayoutInfo.width + (showVScrollbar ? domUtil.getScrollbarSize().width : 0),
	                        overflow: OVERFLOW_AUTO
	                    },
	                    innerDivStyle: {
	                        position: POS_REL,
	                        height: viewportLayout.contentHeight + rowHeaderLayoutInfo.height,
	                        width: viewportLayout.contentWidth + columnHeaderLayoutInfo.width
	                    }
	                };
	            }
	        },
	
	        handleScroll: function(e) {
	            var self = this;
	            if (self.groupStrategy_) {
	                self.groupStrategy_.handleScroll();
	            } else {
	                var grid = self.grid;
	                grid.stopEditing();
	                grid.scrollRenderPart_(VIEWPORT);
	                grid.scrollRenderPart_(COLUMN_HEADER);
	                grid.scrollRenderPart_(ROW_HEADER);
	            }
	            self.grid.onScrollOver_.raise(self.grid, {
	                scrollDirection: e.scrollDirection
	            });
	        },
	
	        toJSON: function() {
	            var self = this;
	            var options = self.options;
	            var jsonObj = {};
	            jsonObj.name = self.name;
	            var gridOptions = {};
	            if (options.rowHeaderWidth !== 24) {
	                gridOptions.rowHeaderWidth = options.rowHeaderWidth;
	            }
	            if (options.colHeaderHeight !== 80) {
	                gridOptions.colHeaderHeight = options.colHeaderHeight;
	            }
	            if (options.rowHeight !== 80) {
	                gridOptions.rowHeight = options.rowHeight;
	            }
	            if (options.colWidth !== 24) {
	                gridOptions.colWidth = options.colWidth;
	            }
	            if (options.showRowHeader !== true) {
	                gridOptions.showRowHeader = options.showRowHeader;
	            }
	            if (options.showColHeader !== true) {
	                gridOptions.showColHeader = options.showColHeader;
	            }
	            if (options.showGroupHeader !== true) {
	                gridOptions.showGroupHeader = options.showGroupHeader;
	            }
	            if (options.showGroupFooter !== true) {
	                gridOptions.showGroupFooter = options.showGroupFooter;
	            }
	            if (options.allowEditing !== false) {
	                gridOptions.allowEditing = options.allowEditing;
	            }
	            if (options.allowGrouping !== false) {
	                gridOptions.allowGrouping = options.allowGrouping;
	            }
	            if (options.rowTemplate) {
	                gridOptions.rowTemplate = getRawRowTemplate_.call(self);
	            }
	            if (options.groupStrategy) {
	                gridOptions.groupStrategy = options.groupStrategy.toJSON();
	            }
	            if (options.editMode !== 'inline') {
	                gridOptions.editMode = options.editMode;
	            }
	            if (!_.isEmpty(gridOptions)) {
	                jsonObj.options = gridOptions;
	            }
	            return jsonObj;
	        },
	
	        getSelections: function() {
	            var self = this;
	            var grid = self.grid;
	            var sels = [];
	            var selectedRows = self.selectedRows_;
	            if (!selectedRows || !selectedRows.length) {
	                return sels;
	            }
	            var i;
	            var length;
	            var mappings = [];
	            for (i = 0, length = grid.data.itemCount; i < length; i++) {
	                mappings.push(grid.data.toSourceRow(i));
	            }
	            var result = _.intersection(mappings, selectedRows);
	            var collection = grid.data.sourceCollection;
	            for (i = 0, length = result.length; i < length; i++) {
	                sels.push(collection[result[i]]);
	            }
	            return sels;
	        },
	
	        hitTest: function(eventArgs) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.hitTest(eventArgs);
	            }
	            var left = eventArgs.pageX;
	            var top = eventArgs.pageY;
	            var grid = self.grid;
	            var layoutInfo = self.getLayoutInfo();
	            var viewportLayout = layoutInfo[VIEWPORT];
	            var columnHeaderLayout = layoutInfo[COLUMN_HEADER];
	            var rowHeaderLayout = layoutInfo[ROW_HEADER];
	            var cornerHeaderLayout = layoutInfo[CORNER_HEADER];
	            var groupDragPanelLayout = self.options.allowGrouping ? layoutInfo[GROUP_DRAG_PANEL] : null;
	
	            var containerInfo = grid.getContainerInfo_().contentRect;
	
	            var offsetLeft = left - containerInfo.left;
	            var offsetTop = top - containerInfo.top;
	
	            var panelOffset;
	            var cellElement;
	            var cellOffset;
	            var cellTop;
	            var cols = grid.columns;
	            var colLen = cols.length;
	            var column = -1;
	            var i;
	            var len;
	            var actIndex;
	            var actLen;
	            var action;
	            var hitTestInfo = null;
	            var point = {
	                left: offsetLeft,
	                top: offsetTop
	            };
	            var startRowPosition;
	            var offsetTopLeft;
	            var groupInfo;
	            var rowInfo;
	            var relativeElement;
	            var element;
	            var inTreeNode = false;
	
	            if (contains_(viewportLayout, point)) {
	                offsetLeft = offsetLeft - columnHeaderLayout.width + grid.scrollOffset.left;
	                offsetTop = offsetTop - rowHeaderLayout.height + grid.scrollOffset.top;
	                offsetTop = offsetTop - (self.options.allowGrouping ? groupDragPanelLayout.height : 0);
	
	                if (hasGroup_(grid)) {
	                    startRowPosition = 0;
	                    offsetTopLeft = offsetLeft;
	                    for (i = 0, len = grid.data.groups.length; i < len; i++) {
	                        groupInfo = grid.groupInfos_[i];
	                        hitTestInfo = hitTestGroup_.call(self, groupInfo, offsetTopLeft, startRowPosition, offsetLeft, offsetTop, VIEWPORT);
	                        if (hitTestInfo) {
	                            break;
	                        }
	                        offsetTopLeft -= groupInfo.height;
	                        startRowPosition += groupInfo.height;
	                    }
	                } else {
	                    rowInfo = getRowInfoAt_.call(this, {left: offsetLeft});
	                    if (rowInfo) {
	                        var row = rowInfo.index;
	                        startRowPosition = rowInfo.startPosition;
	                        var offsetLeftFromCurrentRow = offsetLeft - startRowPosition;
	                        var rowSelector = grid.uid + '-r' + row;
	                        var rowElement = document.getElementById(rowSelector);
	                        var actionElements;
	                        offsetTop -= (rowElement.style.top ? parseFloat(rowElement.style.top) : 0);
	                        for (i = 0; i < colLen; i++) {
	                            cellElement = rowElement.querySelector('.c' + i);
	                            if (cellElement && pointIn_(offsetLeftFromCurrentRow, offsetTop, cellElement, rowElement)) {
	                                column = i;
	                                var nodeElement = cellElement.querySelector('.gc-tree-node');
	                                if (nodeElement && pointIn_.call(self, offsetLeftFromCurrentRow, offsetTop, nodeElement, rowElement, true)) {
	                                    inTreeNode = true;
	                                    break;
	                                } else if (cols[i].action) {
	                                    actionElements = cellElement.querySelectorAll('[data-action]');
	                                    for (actIndex = 0, actLen = actionElements.length; actIndex < actLen; actIndex++) {
	                                        if (pointIn_(offsetLeftFromCurrentRow, offsetTop, actionElements[actIndex], rowElement)) {
	                                            action = grid.getActionHandler_(cols[i].id, actionElements[actIndex].getAttribute('data-action'));
	                                        }
	                                    }
	                                }
	                                break;
	                            }
	                        }
	
	                        if (column === -1) {
	                            action = hitTestTouchPanel_(grid, cols, offsetLeftFromCurrentRow, offsetTop, rowElement);
	                        }
	
	                        hitTestInfo = {
	                            area: VIEWPORT,
	                            row: row,
	                            column: column
	                        };
	                        if (inTreeNode) {
	                            hitTestInfo.inTreeNode = true;
	                        }
	                        if (action) {
	                            hitTestInfo.action = action;
	                        }
	                    } else {
	                        hitTestInfo = {
	                            area: 'none'
	                        };
	                    }
	                }
	            } else if (contains_(columnHeaderLayout, point)) {
	                offsetTop -= rowHeaderLayout.height;
	                offsetTop -= (self.options.allowGrouping ? groupDragPanelLayout.height : 0);
	                var inColumnHeader = false;
	                for (i = 0; i < colLen; i++) {
	                    if (cols[i].visible) {
	                        panelOffset = domUtil.offset(document.getElementById(grid.uid + '-' + COLUMN_HEADER));
	                        cellElement = document.querySelector('#' + grid.uid + '-' + COLUMN_HEADER + ' .gc-column-header-cell.c' + i);
	                        if (cellElement) {
	                            cellOffset = domUtil.offset(cellElement);
	                            cellTop = cellOffset.top - panelOffset.top;
	                            var cellElementStyle = domUtil.getStyle(cellElement);
	                            var paddingLeft = parseStylePropertyValue_(cellElementStyle, PADDING_LEFT);
	                            var paddingRight = parseStylePropertyValue_(cellElementStyle, PADDING_RIGHT);
	                            if (offsetTop >= cellTop && offsetTop <= cellTop + cellElement.offsetHeight) {
	                                inColumnHeader = true;
	                                hitTestInfo = {
	                                    area: COLUMN_HEADER,
	                                    row: -1,
	                                    column: i,
	                                    headerInfo: {
	                                        //inResizeMode: (cellTop + cellElement.offsetHeight - offsetTop) <= 4, //TODO: why it is 4
	                                        //resizeFromZero: false
	                                    }
	                                };
	                                break;
	
	                            } else if ((cellElement.clientWidth - paddingLeft - paddingRight) === 0 &&
	                                cellTop < offsetTop &&
	                                (cellTop + RESIZE_GAP_SIZE) > offsetTop) {
	                                inColumnHeader = true;
	                                hitTestInfo = {
	                                    area: COLUMN_HEADER,
	                                    row: -1,
	                                    column: i,
	                                    headerInfo: {
	                                        //inResizeMode: true,
	                                        //resizeFromZero: true
	                                    }
	                                };
	                                break;
	                            }
	                        }
	                    }
	                }
	                if (!inColumnHeader) {
	                    hitTestInfo = {
	                        area: 'none'
	                    };
	                }
	
	            } else if (contains_(rowHeaderLayout, point)) {
	                offsetTop -= (self.options.allowGrouping ? groupDragPanelLayout.height : 0);
	                offsetLeft = offsetLeft - columnHeaderLayout.width + grid.scrollOffset.left;
	                if (hasGroup_(grid)) {
	                    startRowPosition = 0;
	                    offsetTopLeft = offsetLeft;
	                    for (i = 0, len = grid.data.groups.length; i < len; i++) {
	                        groupInfo = grid.groupInfos_[i];
	
	                        hitTestInfo = hitTestGroup_.call(this, groupInfo, offsetTopLeft, startRowPosition, offsetLeft, offsetTop, ROW_HEADER);
	                        if (hitTestInfo) {
	                            break;
	                        }
	                        offsetTopLeft -= groupInfo.height;
	                        startRowPosition += groupInfo.height;
	                    }
	                } else {
	                    rowInfo = getRowInfoAt_.call(this, {left: offsetLeft});
	                    if (rowInfo) {
	                        hitTestInfo = {
	                            area: ROW_HEADER,
	                            row: rowInfo.index,
	                            column: -1
	                        };
	                        if (self.options.allowHeaderSelect) {
	                            relativeElement = document.getElementById(grid.uid + '-rh' + rowInfo.index);
	                            element = relativeElement.querySelector('.gc-header-select-icon');
	                            if (element && pointIn_.call(self, offsetLeft - rowInfo.startPosition, offsetTop, element, relativeElement, true)) {
	                                hitTestInfo.checked = true;
	                            }
	                        }
	                    } else {
	                        hitTestInfo = {
	                            area: 'none'
	                        };
	                    }
	                }
	            } else if (contains_(cornerHeaderLayout, point)) {
	                offsetTop = offsetTop - (self.options.allowGrouping ? groupDragPanelLayout.height : 0);
	                hitTestInfo = {
	                    area: CORNER_HEADER,
	                    row: -1,
	                    column: -1
	                };
	                if (self.options.allowHeaderSelect) {
	                    relativeElement = document.getElementById(grid.uid + '-corner');
	                    element = relativeElement.querySelector('.gc-header-select-icon');
	                    if (element && pointIn_.call(self, offsetLeft, offsetTop, element, relativeElement, true)) {
	                        hitTestInfo.checked = true;
	                    }
	                }
	            } else if (self.options.allowGrouping && contains_(groupDragPanelLayout, point)) {
	                hitTestInfo = {
	                    area: GROUP_DRAG_PANEL,
	                    row: -1,
	                    column: -1
	                };
	                var groupDescriptors = grid.data.groupDescriptors;
	                var panelElement = document.getElementById(grid.uid + '-' + GROUP_DRAG_PANEL);
	                for (i = 0, len = groupDescriptors.length; i < len; i++) {
	                    cellElement = document.getElementById(grid.uid + '-grouping-indicator-' + groupDescriptors[i].field);
	                    if (cellElement && pointIn_(offsetLeft, offsetTop, cellElement, panelElement)) {
	                        hitTestInfo.groupingPanelInfo = {
	                            field: groupDescriptors[i].field
	                        };
	                        if (pointIn_(offsetLeft, offsetTop, cellElement.querySelector('.gc-grouping-title'), panelElement)) {
	                            hitTestInfo.groupingPanelInfo.action = 'reorder';
	                        }
	                        if (pointIn_(offsetLeft, offsetTop, cellElement.querySelector('.gc-icon-grouping-delete'), panelElement)) {
	                            hitTestInfo.groupingPanelInfo.action = 'delete';
	                        }
	                        break;
	                    }
	                }
	            }
	            return hitTestInfo;
	        },
	
	        getRenderRowInfo_: function(row, area) {
	            var scope = this;
	            if (scope.groupStrategy_) {
	                return scope.groupStrategy_.getRenderRowInfo_(row, area);
	            }
	
	            var uid = scope.grid.uid;
	            var hasGroup = hasGroup_(scope.grid);
	
	            if (area === VIEWPORT) {
	                if (hasGroup) {
	                    var part = row.area;
	                    var currInfo = row.info;
	                    var groupInfo = scope.grid.getGroupInfo_(currInfo.path);
	                    if (part === GROUP_HEADER) {
	                        return getGroupHeaderRow.call(scope, row.key, currInfo, groupInfo, row.width, row.left);
	                    } else if (part === GROUP_CONTENT) {
	                        return getGroupContentRow.call(scope, row.key, currInfo.itemIndex, groupInfo, row.height, row.left);
	                    } else {
	                        return getGroupFooterRow.call(scope, row.key, currInfo, groupInfo, row.left);
	                    }
	                } else {
	                    return createRowRenderInfo_.call(scope, row.index, row.height, uid);
	                }
	            } else if (area === ROW_HEADER) {
	                var key = row.key;
	                var left = hasGroup ? row.left : row.index * row.height;
	                var isRowRole = hasGroup ? false : true;
	                var height = row.height;
	
	                return buildHeaderCell_.call(scope, key, row.info, isRowRole, left, height, row.index);
	            }
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
	
	            return getRowsRenderInfo_.call(scope, area, options);
	        },
	
	        isScrollableArea_: function(area) {
	            var self = this;
	            if (self.groupStrategy_) {
	                return self.groupStrategy_.isScrollableArea_(area);
	            }
	            return area === VIEWPORT;
	        },
	
	        registeEvents_: function() {
	            var self = this;
	            var grid = self.grid;
	            self.handleMouseMoveFn_ = handleMouseMove_.bind(grid);
	            self.handleTouchMoveFn_ = handleTouchMove_.bind(grid);
	            self.handleTouchEndFn_ = handleTouchEnd_.bind(grid);
	            self.handleSwipeFn_ = handleSwipe_.bind(grid);
	            self.handleScrollTouchFn_ = handleTouchScroll.bind(grid);
	            grid.onMouseClick.addHandler(handleMouseClick_);
	            //grid.onMouseDbClick.addHandler(handleMouseDoubleClick);
	            grid.onMouseMove.addHandler(self.handleMouseMoveFn_);
	            grid.onMouseWheel.addHandler(handleMouseWheel);
	            grid.onMouseDown.addHandler(handleMouseDown);
	            grid.onTouchStart_.addHandler(handleTouchStart);
	            grid.onTouchMove_.addHandler(self.handleTouchMoveFn_);
	            grid.onTouchEnd_.addHandler(self.handleTouchEndFn_);
	            grid.onSwipe_.addHandler(self.handleSwipeFn_);
	            grid.onTouchScroll_.addHandler(self.handleScrollTouchFn_);
	        },
	
	        unRegisteEvents_: function() {
	            var self = this;
	            var grid = self.grid;
	            //grid.onMouseDbClick.removeHandler(handleMouseDoubleClick);
	            grid.onMouseClick.removeHandler(handleMouseClick_);
	            grid.onMouseMove.removeHandler(self.handleMouseMoveFn_);
	            grid.onMouseWheel.removeHandler(handleMouseWheel);
	            grid.onMouseDown.removeHandler(handleMouseDown);
	            grid.onTouchStart_.removeHandler(handleTouchStart);
	            grid.onTouchMove_.removeHandler(self.handleTouchMoveFn_);
	            grid.onTouchEnd_.removeHandler(self.handleTouchEndFn_);
	            grid.onSwipe_.removeHandler(self.handleSwipeFn_);
	            grid.onTouchScroll_.removeHandler(self.handleScrollTouchFn_);
	        },
	
	        clearRenderCache_: function() {
	            var self = this;
	            if (self.groupStrategy_) {
	                self.groupStrategy_.clearRenderCache_();
	            }
	            self.layoutInfo_ = null;
	            self.cachedViewportLayoutInfo_ = null;
	            self.groupDragPanelLayoutInfo_ = null;
	            self.columnHeaderHTML = null;
	            self.cachedTmplFn_ = null;
	            //TODO: find a more good location to call the following method, we need update column size if template changed.
	            updateStartSize_.call(self);
	            consolidateColumnWidth_.call(self);
	        },
	
	        getGroupInfoDefaults_: function() {
	            if (this.groupStrategy_) {
	                return this.groupStrategy_.getGroupInfoDefaults_();
	            }
	            return {
	                footer: {
	                    visible: true,
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
	
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupInfos[i].height = self.getGroupHeight_(groupInfos[i]);
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
	            var i;
	            var len;
	            var footer;
	            var childGroup;
	            if (!group.collapsed) {
	                len = group.isBottomLevel ? group.itemCount : groupInfo.children.length;
	                for (i = 0; i < len; i++) {
	                    if (group.isBottomLevel) {
	                        height += self.getRowHeight_(group.getItem(i));
	                    } else {
	                        childGroup = groupInfo.children[i];
	                        childGroup.height = self.getGroupHeight_(childGroup);
	                        height += childGroup.height;
	                    }
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
	
	        getGroupHeaderHeight_: function(group) {
	            var header = group.groupDescriptor.header;
	            return (header && header.visible) ? (header.height || this.options.colWidth) : 0;
	        },
	
	        getGroupFooterHeight_: function(group) {
	            var footer = group.groupDescriptor.footer;
	            return (footer && footer.visible) ? (footer.height || this.options.rowHeight) : 0;
	        },
	
	        hitTestGroupContent_: function(groupInfo, area, offsetLeft, offsetTop, containerSize) {
	            if (!groupInfo.isBottomLevel || offsetLeft < 0 || offsetTop < 0) {
	                return null;
	            }
	            var self = this;
	            var uid = self.grid.uid;
	            var group = groupInfo.data;
	            var i;
	            var len;
	            var rowHeight = getGroupItemRowHeight_.call(self);
	            var hitGroupInfo;
	            var relativeElement;
	            var element;
	            var groupPath = groupInfo.path;
	            if (containerSize) {
	                offsetLeft += containerSize.scrollLeft ? containerSize.scrollLeft : 0;
	                offsetTop += containerSize.scrollTop ? containerSize.scrollTop : 0;
	            }
	            for (i = 0, len = group.itemCount; i < len; i++) {
	                if (offsetLeft <= rowHeight) {
	                    if (area === ROW_HEADER) {
	                        hitGroupInfo = {
	                            area: ROW_HEADER,
	                            row: -1,
	                            column: -1,
	                            groupInfo: {
	                                area: GROUP_CONTENT,
	                                path: groupPath,
	                                row: i,
	                                column: -1
	                            }
	                        };
	                        if (self.options.allowHeaderSelect) {
	                            relativeElement = document.getElementById(self.grid.uid + '-grh' + groupPath.join('-') + '-r' + i);
	                            element = relativeElement.querySelector('.gc-header-select-icon');
	                            if (element && pointIn_.call(self, offsetLeft, offsetTop, element, relativeElement, true)) {
	                                hitGroupInfo.groupInfo.checked = true;
	                            }
	                        }
	                        return hitGroupInfo;
	                    } else {
	                        relativeElement = document.getElementById(uid + '-gr' + groupPath.join('_') + '-r' + i);
	                        if (!relativeElement) {
	                            return {
	                                area: VIEWPORT,
	                                row: -1,
	                                column: -1,
	                                groupInfo: {
	                                    area: GROUP_CONTENT,
	                                    path: groupPath,
	                                    row: i,
	                                    column: -1
	                                }
	                            };
	                        }
	                        hitGroupInfo = hitTestGroupRowColumns_.call(self, groupPath, i, relativeElement, offsetLeft, offsetTop);
	                        return hitGroupInfo;
	                    }
	                }
	                offsetLeft -= rowHeight;
	            }
	            return null;
	        },
	
	        getRowHeight_: function() {
	            return this.options.rowHeight;
	        },
	
	        startEditing_: function(groupInfo, uiRowIndex, template) {
	            var self = this;
	            var editMode = self.options.editMode;
	            var grid = self.grid;
	            var editingHandler = grid.editingHandler;
	            var editContainer;
	            var selector = grid.uid + (groupInfo ? ('-gr' + groupInfo.path.join('_')) : '') + '-r' + uiRowIndex;
	            var row = document.getElementById(selector);
	            var rowRect = domUtil.getElementRect(row);
	            var viewportRect = domUtil.getElementRect(document.getElementById(grid.uid + '-viewport'));
	            var i;
	            var length;
	
	            self.containerKeyDownHandler_ = editingHandler.containerKeyDownHandler.bind(editingHandler);
	            self.containerMouseDownHandler_ = editingHandler.containerMouseDownHandler.bind(editingHandler);
	            self.containerClickHandler_ = editingHandler.containerClickHandler.bind(editingHandler);
	
	            if (editMode === 'inline') {
	                var inlineFragment = editingHandler.getInlineFragment();
	                editContainer = domUtil.createElement('<div id="' + grid.uid + '-inline-editing-area" class="gc-inline-editing-area gc-editing-area" style="top:' + viewportRect.top + 'px;left:' + rowRect.left +
	                    'px; height:' + viewportRect.height + 'px;"></div>');
	                var innerContainer = domUtil.createElement('<div id="' + grid.uid + '-inline-editing-area-inner" style="position:absolute;top:' + (rowRect.top - viewportRect.top) + 'px;"></div>');
	                innerContainer.appendChild(inlineFragment);
	                editContainer.appendChild(innerContainer);
	                editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                document.body.appendChild(editContainer);
	                var inlineEditors = editContainer.querySelectorAll('.gc-inline-editor-container');
	                var width = 0;
	                var rect;
	                for (i = 0, length = inlineEditors.length; i < length; i++) {
	                    rect = domUtil.getElementRect(inlineEditors[i]);
	                    width = Math.max(width, rect.left - rowRect.left + rect.width);
	                }
	                editContainer.style.width = width + 'px';
	            } else if (editMode === 'popup') {
	                var editPopupOverlay = domUtil.createElement('<div class="gc-editing-overlay"></div>');
	                editContainer = domUtil.createElement('<div id="' + grid.uid + '-popup-editing-area" class="gc-popup-editing-area gc-editing-area">' +
	                    '<div class="gc-editing-header"><span class="header-text">Edit Form</span><div class="gc-editing-close"><span class="gc-icon close-icon"></span></div></div>' +
	                    '<div class="gc-editing-content">' + template + '</div>' +
	                    '<div class="gc-editing-footer"><div class="gc-editing-cancel gc-editing-button"><span class="cancel-text">Cancel</span></div><div class="gc-editing-update gc-editing-button"><span class="update-text">Update</span></div></div></div>');
	
	                editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                editContainer.addEventListener('mousedown', self.containerMouseDownHandler_);
	                editContainer.addEventListener('click', self.containerClickHandler_);
	                document.body.appendChild(editContainer);
	                document.body.appendChild(editPopupOverlay);
	                var containerRect = domUtil.getElementRect(editContainer);
	                var left = parseInt((window.innerWidth - containerRect.width) / 2 + window.pageXOffset);
	                var top = parseInt((window.innerHeight - containerRect.height) / 2 + window.pageYOffset);
	                domUtil.setCss(editContainer, {
	                    left: left,
	                    top: top
	                });
	            } else if (editMode === 'editForm') {
	                var rowHeaderWidth = grid.options.rowHeaderWidth;
	                var viewportInnerRect = domUtil.getElementRect(document.getElementById(grid.uid + '-viewport-inner'));
	                editContainer = domUtil.createElement('<div style="overflow:hidden;position:absolute;top:' + (viewportRect.top - rowHeaderWidth) + 'px;' +
	                    'height:' + (viewportInnerRect.height + rowHeaderWidth) + 'px;max-height:' + (viewportRect.height + rowHeaderWidth) + 'px;" id="' + grid.uid + '-form-editing-area" class="gc-form-editing-area gc-editing-area">' +
	                    '<div class="gc-editing-content">' + template + '</div>' +
	                    '<div class="gc-editing-footer"><div class="gc-editing-cancel gc-editing-button"><span class="cancel-text">Cancel</span></div><div class="gc-editing-update gc-editing-button"><span class="update-text">Update</span></div></div></div>');
	
	                editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                editContainer.addEventListener('mousedown', self.containerMouseDownHandler_);
	                editContainer.addEventListener('click', self.containerClickHandler_);
	                document.body.appendChild(editContainer);
	
	                var renderedRows = grid.lastRenderedRows_.viewport;
	                var renderedHeaders = grid.lastRenderedRows_.rowHeader;
	                var startIndex = renderedRows.indexOf(selector);
	                var formWidth = domUtil.getElementRect(editContainer).width;
	                var tempRow;
	                var tempHeader;
	                if (startIndex >= 0) {
	                    var avaliableWidth_ = viewportRect.width - rowRect.width - (rowRect.left - viewportRect.left);
	                    //var availableHeight_ = viewportRect.height - rowRect.height - (rowRect.top - viewportRect.top);
	                    var distance;
	                    var topDist;
	                    if (avaliableWidth_ < formWidth) {
	                        //If there is no enough space to display, some rows move upward.
	                        distance = formWidth - avaliableWidth_;
	                        for (i = 0; i <= startIndex; i++) {
	                            tempRow = document.getElementById(renderedRows[i]);
	                            tempHeader = document.getElementById(renderedHeaders[i]);
	                            topDist = Math.ceil(parseInt(tempRow.style.left) - distance);
	                            tempRow.style.left = topDist + 'px';
	                            tempHeader.style.left = topDist + 'px';
	                        }
	                        editContainer.style.left = Math.ceil(rowRect.left + rowRect.width - distance) + 'px';
	                    } else {
	                        //If there is enough space, some rows move down
	                        for (i = startIndex + 1, length = renderedRows.length; i < length; i++) {
	                            tempRow = document.getElementById(renderedRows[i]);
	                            tempHeader = document.getElementById(renderedHeaders[i]);
	                            tempRow.style.left = (parseInt(tempRow.style.left) + formWidth) + 'px';
	                            tempHeader.style.left = (parseInt(tempHeader.style.left) + formWidth) + 'px';
	                        }
	                        editContainer.style.left = Math.ceil(rowRect.left + rowRect.width) + 'px';
	                    }
	                }
	            }
	            if (!editContainer.tabIndex || editContainer.tabIndex < 0) { //Only focusable element can be bound keydown event.
	                editContainer.tabIndex = 1;
	            }
	        },
	
	        stopEditing_: function(valueChanged) {
	            var self = this;
	            var grid = self.grid;
	            var editingHandler = grid.editingHandler;
	            var editMode = self.options.editMode;
	            var uid = grid.uid;
	            var editContainer;
	            if (editMode === 'inline') {
	                editContainer = document.getElementById(uid + '-inline-editing-area');
	            } else if (editMode === 'popup') {
	                var overlay = document.querySelector('.gc-editing-overlay');
	                if (overlay) {
	                    document.body.removeChild(overlay);
	                }
	                editContainer = document.getElementById(uid + '-popup-editing-area');
	            } else if (editMode === 'editForm') {
	                editContainer = document.getElementById(uid + '-form-editing-area');
	            }
	            if (editContainer) {
	                editContainer.removeEventListener('mousedown', self.containerMouseDownHandler_);
	                editContainer.removeEventListener('keydown', self.containerKeyDownHandler_);
	                editContainer.removeEventListener('click', self.containerClickHandler_);
	                document.body.removeChild(editContainer);
	            }
	
	            self.containerKeyDownHandler_ = null;
	            self.containerMouseDownHandler_ = null;
	            self.containerClickHandler_ = null;
	
	            if (editMode === 'editForm') {
	                grid.invalidate();
	            } else {
	                if (valueChanged) {
	                    if (grid.data.groups) {
	                        grid.updateGroupInfos_();
	                        grid.invalidate();
	                    } else {
	                        if (editingHandler.wholeColumnChanged_) {
	                            grid.invalidate();
	                        } else {
	                            var groupInfo = editingHandler.editingInfo_.groupInfo;
	                            grid.refreshRow_('viewport', groupInfo ? groupInfo.path : null, editingHandler.editingInfo_.rowIndex);
	                        }
	                    }
	                }
	            }
	        },
	
	        getDefaultEditorTemplate_: function() {
	            var grid = this.grid;
	            var editingHandler = grid.editingHandler;
	            var cols = grid.columns;
	            var r = '<div>';
	            _.each(cols, function(col) {
	                if (editingHandler.isColumnEditable(grid, col)) {
	                    r += '<div><div class="gc-editing-template-label"><label class="content-text">' + (col.caption || col.id) + '</label></div><div class="gc-editing-template-field"><input type="' + editingHandler.getEditorType(col.dataType) + '" data-column="' + col.id + '"></div></div>';
	                }
	            });
	            r += '</div>';
	            return r;
	        },
	
	        getInnerGroupWidth: function(groupInfo, containerSize) {
	            if (!groupInfo.isBottomLevel) {
	                return 0;
	            }
	            return this.getRowHeight_() * groupInfo.data.itemCount;
	        },
	
	        getInnerGroupHeight: function(groupInfo, containerSize) {
	            //return css style height, not the logic height.
	            if (!groupInfo.isBottomLevel) {
	                return 0;
	            }
	            return getContentHeight_(this.grid);
	        },
	
	        getInnerGroupRenderInfo: function(groupInfo, containerSize, layoutCallback) {
	            if (!groupInfo.isBottomLevel) {
	                return;
	            }
	            var self = this;
	            var group = groupInfo.data;
	            var offsetLeft = 0;
	            var i;
	            var len;
	            var rowHeight = self.getRowHeight_();
	            var rows = [];
	            var layout;
	            var additionalStyle;
	            var additionalCSSClass;
	            for (i = 0, len = group.itemCount; i < len; i++) {
	                if (layoutCallback) {
	                    layout = layoutCallback(groupInfo, i);
	                    additionalCSSClass = layout.cssClass;
	                    additionalStyle = layout.style || {};
	                    additionalStyle.width = containerSize.width;
	                    if (layout.location) {
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, layout.location.left, false, additionalCSSClass, additionalStyle));
	                    } else {
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, offsetLeft, false, additionalCSSClass, additionalStyle));
	                        offsetLeft += rowHeight;
	                    }
	                } else {
	                    additionalStyle = {width: containerSize.width};
	                    rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, offsetLeft, false, null, additionalStyle));
	                    offsetLeft += rowHeight;
	                }
	            }
	            return rows;
	        },
	
	        getMaxVisibleItemCount: function(containerSize) {
	            return Math.floor(containerSize.width / this.getRowHeight_());
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
	
	        handleTemplateChange_: function() {
	        },
	
	        canDoSwipe_: function(moveDirection, deltaX, deltaY) {
	            var grid = this.grid;
	            if (moveDirection === 'horizontal') {
	                return false;
	            }
	
	            var existTouchActionColumn = false;
	            for (var i = 0, len = grid.columns.length; i < len; i++) {
	                var col = grid.columns[i];
	                if (isTouchActionColumn_(col)) {
	                    existTouchActionColumn = true;
	                    break;
	                }
	            }
	
	            return existTouchActionColumn;
	        },
	
	        canStartSwipe_: function(detaX, deltaY) {
	            return Math.abs(deltaY) >= 10 && Math.abs(detaX) <= 5;
	        }
	    };
	
	    function createRowRenderInfo_(i, rowHeight, uid) {
	        var scope = this;
	        var formattedRowItem = scope.grid.getFormattedDataItem(i);
	        var sourceItemIndex = scope.grid.data.toSourceRow(i);
	        //var sourceItemIndex = i;
	        return {
	            key: uid + '-r' + i,
	            isRowRole: true,
	            selected: scope.selectedRows_ && scope.selectedRows_.indexOf(sourceItemIndex) !== -1,
	            renderInfo: {
	                index: 0,
	                cssClass: 'gc-row r' + i + ' even',
	                style: {
	                    left: i * rowHeight,
	                    width: rowHeight
	                },
	                renderedHTML: (scope.cachedTmplFn_ || scope.getRowTemplate())(formattedRowItem)
	            }
	        };
	    }
	
	    function getRenderRangeInfo_(area, currLayoutInfo, options) {
	        var scope = this;
	        var grid = scope.grid;
	        var renderRange = {};
	        var offsetLeft = options.offsetLeft;
	        var isRowArea = (area === VIEWPORT || area === ROW_HEADER);
	
	        if (isRowArea) {
	            if (hasGroup_(grid)) {
	                renderRange.start = getGroupInfoAt_.call(scope, offsetLeft);
	                renderRange.end = getGroupInfoAt_.call(scope, offsetLeft + currLayoutInfo.width);
	                renderRange.offsetLeft = renderRange.start.startPosition;
	            } else {
	                var startInfo = getRowInfoAt_.call(scope, {left: offsetLeft});
	                var endInfo = getRowInfoAt_.call(scope, {left: offsetLeft + currLayoutInfo.width});
	                if (startInfo) {
	                    renderRange.start = startInfo.index;
	                    renderRange.end = endInfo ? (endInfo.index + 1) : grid.data.itemCount;
	                    renderRange.offsetLeft = startInfo.startPosition - offsetLeft;
	                } else {
	                    renderRange.start = renderRange.end = renderRange.offsetLeft = 0;
	                }
	            }
	        }
	        return renderRange;
	    }
	
	    function getRowInfoAt_(offset) {
	        var self = this;
	        var startPosition = 0;
	        var dataLen = self.grid.data.itemCount;
	        var cachedRowOffset = self.cachedRowOffset_;
	        var offsetLeft = offset.left;
	        var startIndex = 0;
	        var rowHeight = self.options.rowHeight;
	        var i;
	        var item;
	        if (cachedRowOffset) {
	            for (i = cachedRowOffset.length - 1; i >= 0; i--) {
	                item = cachedRowOffset[i];
	                if (item <= offsetLeft) {
	                    startIndex = i * 10000;
	                    offsetLeft -= item;
	                    startPosition = item;
	                    break;
	                }
	            }
	        }
	
	        for (i = startIndex; i < dataLen; i++) {
	            if (offsetLeft <= rowHeight) {
	                return {
	                    index: i,
	                    startPosition: startPosition
	                };
	            }
	            if (i % 10000 === 0) {
	                self.cachedRowOffset_ = cachedRowOffset || [];
	                self.cachedRowOffset_[i / 10000] = startPosition;
	            }
	            offsetLeft -= rowHeight;
	            startPosition += rowHeight;
	        }
	        return null;
	    }
	
	    function getViewportLayoutInfo_() {
	        var scope = this;
	        if (scope.cachedViewportLayoutInfo_) {
	            return scope.cachedViewportLayoutInfo_;
	        }
	        var grid = scope.grid;
	        var option = scope.options;
	        var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	        var containerRect = grid.getContainerInfo_().contentRect;
	
	        var rowHeaderWidth = (option.showRowHeader ? option.rowHeaderWidth : 0);
	        var colHeaderHeight = (option.showColHeader ? option.colHeaderHeight : 0);
	
	        var width = containerRect.width - colHeaderHeight;
	        var height = containerRect.height - rowHeaderWidth - groupDragPanelLayoutInfo.height;
	
	        var contentWidth = getContentWidth_(grid);
	        var contentHeight = getContentHeight_(grid);
	        width = (height >= contentHeight) ? width : (width - domUtil.getScrollbarSize().width);
	        height = (width >= contentWidth) ? height : (height - domUtil.getScrollbarSize().height);
	
	        scope.cachedViewportLayoutInfo_ = {
	            top: rowHeaderWidth + groupDragPanelLayoutInfo.height,
	            left: colHeaderHeight,
	            width: width,
	            height: height,
	            contentWidth: contentWidth,
	            contentHeight: contentHeight
	        };
	        return scope.cachedViewportLayoutInfo_;
	    }
	
	    function getCornerHeaderLayoutInfo_() {
	        var options = this.options;
	        var scope = this;
	        var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	        var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	        var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight : 0);
	        return {
	            top: groupDragPanelLayoutInfo.height,
	            left: 0,
	            width: colHeaderHeight,
	            height: rowHeaderWidth,
	            contentWidth: colHeaderHeight,
	            contentHeight: rowHeaderWidth
	        };
	    }
	
	    function getRowHeaderLayoutInfo_() {
	        var scope = this;
	        var options = scope.options;
	        var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	        var viewportLayoutInfo = getViewportLayoutInfo_.call(scope);
	        var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	        var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight : 0);
	
	        return {
	            top: groupDragPanelLayoutInfo.height,
	            left: colHeaderHeight,
	            width: viewportLayoutInfo.width,
	            height: rowHeaderWidth,
	            contentWidth: viewportLayoutInfo.contentWidth,
	            contentHeight: rowHeaderWidth
	        };
	    }
	
	    function getColumnHeaderLayoutInfo_() {
	        var scope = this;
	        var options = scope.options;
	        var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	        var viewportLayoutInfo = getViewportLayoutInfo_.call(scope);
	        var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	        var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight : 0);
	
	        return {
	            top: rowHeaderWidth + groupDragPanelLayoutInfo.height,
	            left: 0,
	            width: colHeaderHeight,
	            height: viewportLayoutInfo.height,
	            contentWidth: colHeaderHeight,
	            contentHeight: viewportLayoutInfo.contentHeight
	        };
	    }
	
	    function getGroupDragPanelLayoutInfo_() {
	        var scope = this;
	        if (scope.groupDragPanelLayoutInfo_) {
	            return scope.groupDragPanelLayoutInfo_;
	        }
	        var grid = scope.grid;
	        var containerRect = grid.getContainerInfo_().contentRect;
	        var options = scope.options;
	        if (options.allowGrouping) {
	
	            var height = getGroupDragPanelHeight_.call(scope);
	            var width = containerRect.width;
	            scope.groupDragPanelLayoutInfo_ = {
	                top: 0,
	                left: 0,
	                width: width,
	                height: height,
	                contentWidth: width,
	                contentHeight: height
	            };
	        } else {
	            scope.groupDragPanelLayoutInfo_ = {
	                top: 0,
	                left: 0,
	                width: 0,
	                height: 0,
	                contentWidth: 0,
	                contentHeight: 0
	            };
	        }
	        return scope.groupDragPanelLayoutInfo_;
	    }
	
	    function getGroupDragPanelHeight_() {
	        var scope = this;
	
	        //TODO: appendChild/removeChild twice is too expensive, improve it later.
	        var containerRect = scope.grid.getContainerInfo_().contentRect;
	        var maxWidth = containerRect.width;
	        var groupDragPanelElement = domUtil.createElement('<div class="gc-grouping-container"><div>');
	        document.body.appendChild(groupDragPanelElement);
	        var groupDragPanelElementStyle = domUtil.getStyle(groupDragPanelElement);
	        var paddingLeft = parseStylePropertyValue_(groupDragPanelElementStyle, PADDING_LEFT);
	        var paddingRight = parseStylePropertyValue_(groupDragPanelElementStyle, PADDING_RIGHT);
	        document.body.removeChild(groupDragPanelElement);
	
	        maxWidth = maxWidth - paddingLeft - paddingRight;
	
	        var div = '<div class="gc-grouping-container"><div style="width:' + maxWidth + 'px;">' + getRenderedGroupDragPanelInfo_.call(scope, false) + '</div></div>';
	
	        var element = domUtil.createElement(div);
	        document.body.appendChild(element);
	        var height = element.offsetHeight;
	        document.body.removeChild(element);
	        return height;
	    }
	
	    function getRenderedGroupDragPanelInfo_(generateId) {
	        var self = this;
	        var grid = self.grid;
	        var groupDescriptors = grid.data.groupDescriptors;
	        var idPrefix = self.grid.uid + '-grouping-indicator-';
	        var i;
	        var colId;
	        var col;
	        var len = groupDescriptors.length;
	        var str = '';
	        if (len === 0) {
	            str += '<div class="gc-grouping-help-content">' + GROUP_DRAG_TEXT + '</div>';
	        } else {
	            for (i = 0; i < len; i++) {
	                colId = groupDescriptors[i].field;
	                col = grid.getColById_(colId);
	                str += ('<div' + (generateId ? (' id="' + idPrefix + colId + '"') : '') + ' class="gc-grouping-indicator"><span class="gc-grouping-title">' + (col ? col.caption : '') + '</span><span class="gc-icon gc-icon-grouping-delete"></span></div>');
	            }
	        }
	        return str;
	    }
	
	    function getGroupInsertingLocation_(left, top) {
	        var self = this;
	        var grid = self.grid;
	        var groupDes = grid.data.groupDescriptors;
	        var i;
	        var len = groupDes.length;
	        var to = 0;
	        var groupingElement;
	        var offset;
	        var groupingPanelInfo = self.hitTestInfo_.groupingPanelInfo;
	        var field = groupingPanelInfo ? groupingPanelInfo.field : '';
	        var previousLeft = 0;
	        var previousTop = 0;
	        var previousHeight = 0;
	        var clientHeight;
	        if (!field) {
	            to = len;
	            for (i = 0; i < len; i++) {
	                groupingElement = document.getElementById(grid.uid + '-grouping-indicator-' + groupDes[i].field);
	                clientHeight = groupingElement.clientHeight;
	                offset = domUtil.offset(groupingElement);
	                if (left < offset.left && top >= offset.top && top <= (offset.top + clientHeight)) {
	                    to = i;
	                    break;
	                }
	                if (offset.left < previousLeft && top >= previousTop && top <= (previousTop + previousHeight)) { //line break
	                    to = i;
	                    break;
	                }
	                previousLeft = offset.left;
	                previousTop = offset.top;
	                previousHeight = clientHeight;
	            }
	        } else {
	            groupingElement = document.getElementById(grid.uid + '-grouping-indicator-' + field);
	            offset = domUtil.offset(groupingElement);
	            if (offset.left <= left && left <= (offset.left + groupingElement.clientWidth) && top >= offset.top && top <= (offset.top + groupingElement.clientHeight)) {
	                for (i = 0; i < len; i++) {
	                    if (groupDes[i].field === field) {
	                        to = i;
	                        break;
	                    }
	                }
	            }
	        }
	
	        return to;
	    }
	
	    function startDragDroping_() {
	        var self = this;
	        var grid = self.grid;
	        var selector;
	        var hitTest = self.dragStartInfo_.hitTestInfo;
	        var col;
	        if (hitTest.area === COLUMN_HEADER && hitTest.column >= 0) {
	            selector = '#' + self.grid.uid + ' .gc-column-header-cell.c' + hitTest.column;
	            col = grid.columns[hitTest.column];
	        } else if (hitTest.area === GROUP_DRAG_PANEL && hitTest.groupingPanelInfo) {
	            selector = '#' + self.grid.uid + '-grouping-indicator-' + hitTest.groupingPanelInfo.field;
	            col = grid.getColById_(hitTest.groupingPanelInfo.field);
	        }
	
	        var element = document.querySelector(selector);
	        if (element) {
	            var offset = domUtil.offset(element);
	            var pointOffset = self.dragStartInfo_.pointOffset;
	            self.dragStartInfo_.pointOffset = {
	                left: offset.left - pointOffset.left,
	                top: offset.top - pointOffset.top
	            };
	            var width = element.clientWidth;
	            var height = element.clientHeight;
	            element = domUtil.createElement('<div class="gc-grouping-drag-clue"  style="zIndex:999"><span class="gc-icon gc-icon-grouping-add"></span><div style="display:inline-block;overflow: hidden;white-space:pre;"><span> ' + col.caption + '</span></div></div>');
	            element.id = '';
	            element.style.top = offset.top + 'px';
	            element.style.left = offset.left + 'px';
	            element.style.width = width + 'px';
	            element.style.zIndex = 999;
	            element.style.height = height + 'px';
	            element.style.position = POS_ABS;
	            document.body.appendChild(element);
	            self.dragDropingElement_ = element;
	
	            var clueIndicatorElement = domUtil.createElement('<span style="position:absolute;display: none;" class="gc-icon gc-grouping-drag-clue-indicator"></span>');
	            document.body.appendChild(clueIndicatorElement);
	            var elementStyle = domUtil.getStyle(element);
	            var paddingLeft = parseStylePropertyValue_(elementStyle, PADDING_LEFT);
	            var paddingRight = parseStylePropertyValue_(elementStyle, PADDING_RIGHT);
	
	            width = width - paddingLeft - paddingRight - 16;
	            element = element.querySelector('div');
	            element.style.width = width + 'px';
	            if (width <= 0) {
	                element.style.display = 'none';
	            }
	            self.dragDropingIndicatorElement_ = clueIndicatorElement;
	
	            return true;
	        }
	
	        return false;
	    }
	
	    function getGroupRenderInfo_(startInfo, endInfo, offsetLeft, isRowHeader, getUpdateKey) {
	        if (!startInfo || !endInfo) {
	            return [];
	        }
	        var rows = [];
	        var scope = this;
	        var grid = scope.grid;
	        var groupInfos = [];
	        var renderItem = false;
	        var allDone = false;
	        var currInfo;
	        var groupInfo;
	        var i;
	        var len;
	        var tpRow;
	
	        for (i = startInfo.path[0], len = endInfo.path[0]; i <= len; i++) {
	            groupInfos.push({
	                path: [i],
	                itemIndex: -1,
	                area: GROUP_HEADER
	            });
	        }
	
	        while (groupInfos.length > 0) {
	            if (allDone) {
	                break;
	            }
	            currInfo = groupInfos.shift();
	            if (!renderItem && groupInfoAreSame_(currInfo, startInfo)) {
	                renderItem = true;
	            }
	            if (renderItem && groupInfoAreSame_(currInfo, endInfo)) {
	                allDone = true;
	            }
	            if (renderItem) {
	                if (currInfo.area === GROUP_HEADER) {
	                    tpRow = getGroupHeader_.call(scope, currInfo, isRowHeader, offsetLeft, getUpdateKey);
	                } else if (currInfo.area === GROUP_CONTENT) {
	                    tpRow = getGroupContent_.call(scope, currInfo, isRowHeader, offsetLeft, getUpdateKey);
	                } else {
	                    tpRow = getGroupFooter_.call(scope, currInfo, isRowHeader, offsetLeft, getUpdateKey);
	                }
	
	                if (tpRow.row) {
	                    rows = rows.concat(tpRow.row);
	                    offsetLeft += tpRow.height;
	                }
	            }
	
	            if (currInfo.area === GROUP_HEADER) {
	                groupInfo = grid.getGroupInfo_(currInfo.path);
	                var group = groupInfo.data;
	                if (group.collapsed) {
	                    if (group && !group.isBottomeLevel && !(group.groupDescriptor.footer && group.groupDescriptor.footer.collapseWithGroup)) {
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
	
	                    len = group.isBottomLevel ? group.itemCount : groupInfo.children.length;
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
	
	    function groupInfoAreSame_(left, right) {
	        if (left.itemIndex !== right.itemIndex) {
	            return false;
	        }
	        if (left.area !== right.area) {
	            return false;
	        }
	
	        var leftPath = left.path;
	        var rightPath = right.path;
	        if (leftPath.length !== rightPath.length) {
	            return false;
	        }
	
	        for (var i = 0, len = leftPath.length; i < len; i++) {
	            if (leftPath[i] !== rightPath[i]) {
	                return false;
	            }
	        }
	        return true;
	    }
	
	    function getGroupHeader_(currInfo, isRowHeader, offsetLeft, getUpdateKey) {
	        var scope = this;
	        var grid = scope.grid;
	        var rows;
	        var height;
	        var width = scope.getLayoutInfo()[VIEWPORT].contentHeight;
	        var groupInfo = grid.getGroupInfo_(currInfo.path);
	        var header = groupInfo.data.groupDescriptor.header;
	        if (header && header.visible) {
	            rows = [];
	            height = scope.getGroupHeaderHeight_(groupInfo.data);
	            if (isRowHeader) {
	                rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetLeft, height, getUpdateKey));
	            } else {
	                var key = grid.uid + '-gh' + currInfo.path.join('_');
	                if (getUpdateKey) {
	                    rows.push({
	                        key: key,
	                        info: currInfo,
	                        left: offsetLeft,
	                        width: width,
	                        area: GROUP_HEADER
	                    });
	                } else {
	                    rows.push(getGroupHeaderRow.call(scope, key, currInfo, groupInfo, width, offsetLeft));
	                }
	            }
	        }
	
	        return {row: rows, height: height};
	    }
	
	    function getGroupContent_(currInfo, isRowHeader, offsetLeft, getUpdateKey) {
	        var scope = this;
	        var grid = scope.grid;
	        var rows = [];
	        var groupInfo = grid.getGroupInfo_(currInfo.path);
	        var height = getGroupItemRowHeight_.call(this);
	        if (isRowHeader) {
	            rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetLeft, height, getUpdateKey));
	        } else {
	            rows.push(getRenderedGroupContentItemInfo_.call(scope, currInfo.itemIndex, groupInfo, height, offsetLeft, getUpdateKey));
	        }
	        return {row: rows, height: height};
	    }
	
	    function getGroupFooter_(currInfo, isRowHeader, offsetLeft, getUpdateKey) {
	        var scope = this;
	        var grid = scope.grid;
	        var rows;
	        var groupInfo = grid.getGroupInfo_(currInfo.path);
	        var height;
	        var footer = groupInfo.data.groupDescriptor.footer;
	        if (footer && footer.visible) {
	            rows = [];
	            height = scope.getGroupFooterHeight_(groupInfo.data);
	            if (isRowHeader) {
	                rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetLeft, height, getUpdateKey));
	            } else {
	                var key = grid.uid + '-gf' + currInfo.path.join('_');
	                if (getUpdateKey) {
	                    rows.push({
	                        key: key,
	                        info: currInfo,
	                        left: offsetLeft,
	                        area: GROUP_FOOTER
	                    });
	                } else {
	                    rows.push(getGroupFooterRow.call(scope, key, currInfo, groupInfo, offsetLeft));
	                }
	            }
	        }
	
	        return {row: rows, height: height};
	    }
	
	    function getGroupFooterRow(key, currInfo, groupInfo, left) {
	        var scope = this;
	        return {
	            key: key,
	            isRowRole: false,
	            renderInfo: getGroupFooterRenderInfo_.call(scope, groupInfo, left)
	        };
	    }
	
	    function getGroupFooterRenderInfo_(groupInfo, offset) {
	        var self = this;
	        var height = self.getGroupFooterHeight_(groupInfo.data);
	
	        return {
	            cssClass: 'gc-row g' + groupInfo.path.join('_'),
	            style: {
	                left: offset,
	                width: height
	            },
	            renderedHTML: getGroupFooterTemplate_.call(self, groupInfo)(getGroupFooterData_.call(self, groupInfo))
	        };
	    }
	
	    function getGroupFooterTemplate_(groupInfo) {
	        var self = this;
	        var grid = self.grid;
	        var groupPath = groupInfo.path;
	        self.cachedGroupFooterFn_ = self.cachedGroupFooterFn_ || [];
	        if (self.cachedGroupFooterFn_[groupPath.length - 1]) {
	            return self.cachedGroupFooterFn_[groupPath.length - 1];
	        }
	        var footer = groupInfo.data.groupDescriptor.footer;
	        var templateStr = (footer && footer.template) || getRawRowTemplate_.call(self);
	        var oldColTmpl;
	        var newColTmpl;
	        var cssName;
	        var tagName;
	        var colTmpl;
	        templateStr = filterActionColumn_.call(this, templateStr);
	        var element = domUtil.createTemplateElement(templateStr);
	        //Different browsers may return different innerHTMLs compared with the original HTML,
	        //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	        templateStr = domUtil.getElementInnerText(element);
	
	        var annotationCols = element.querySelectorAll('[data-column]');
	        _.each(annotationCols, function(annotationCol, index) {
	            var col = grid.getColById_(annotationCol.getAttribute('data-column'));
	            //TODO: handel the case that col aggragation is an array
	            var colAnnotation = col.groupFooter || '';
	            colTmpl = annotationCol;
	            tagName = colTmpl.tagName;
	            oldColTmpl = colTmpl.outerHTML;
	            cssName = 'gc-cell gc-group-footer-cell' + ' c' + index;
	            newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                '<div style="height:100%;overflow:hidden;"><div style="height:100%;" class="' + cssName + '">' +
	                colAnnotation +
	                '</div></div></' + tagName + '>';
	
	            //outerHTML returns double quotes in attribute sometimes
	            if (templateStr.indexOf(oldColTmpl) === -1) {
	                // jscs:disable validateQuoteMarks
	                /*jshint quotmark: double */
	                oldColTmpl = oldColTmpl.replace(/"/g, "'");
	                // jscs:enable validateQuoteMarks
	            }
	            templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	        });
	        element = null;
	        self.cachedGroupFooterFn_[groupPath.length - 1] = doT.template(templateStr, null, null, true);
	        return self.cachedGroupFooterFn_[groupPath.length - 1];
	    }
	
	    function getRenderedGroupContentItemInfo_(rowIndex, groupInfo, height, offsetLeft, getUpdateKey, additionalCSSClass, additionalStyle) {
	        var self = this;
	        var key = self.grid.uid + '-gr' + groupInfo.path.join('_') + '-r' + rowIndex;
	        if (getUpdateKey) {
	            return {
	                key: key,
	                info: {
	                    path: groupInfo.path,
	                    itemIndex: rowIndex,
	                    area: GROUP_CONTENT
	                },
	                left: offsetLeft,
	                height: getGroupItemRowHeight_.call(self),
	                area: GROUP_CONTENT
	            };
	        } else {
	            return getGroupContentRow.call(self, key, rowIndex, groupInfo, height, offsetLeft, additionalCSSClass, additionalStyle);
	        }
	    }
	
	    function getGroupContentRow(key, rowIndex, groupInfo, height, left, additionalCSSClass, additionalStyle) {
	        var scope = this;
	        return {
	            key: key,
	            isRowRole: true,
	            selected: scope.selectedRows_ && scope.selectedRows_.indexOf(groupInfo.data.toSourceRow(rowIndex)) !== -1,
	            renderInfo: getGroupRowRenderInfo_.call(scope, rowIndex, groupInfo, height, left, additionalCSSClass, additionalStyle)
	        };
	    }
	
	    function getGroupRowRenderInfo_(rowIndex, groupInfo, height, offset, additionalCSSClass, additionalStyle) {
	        var style = {
	            left: offset,
	            width: height
	        };
	        style = additionalStyle ? _.assign(additionalStyle, style) : style;
	        return {
	            cssClass: 'gc-row' + (additionalCSSClass ? (' ' + additionalCSSClass) : ''),
	            style: style,
	            renderedHTML: this.getRowTemplate()(this.grid.formatDataItem(groupInfo.data.getItem(rowIndex)))
	        };
	    }
	
	    function getGroupItemRowHeight_() {
	        return this.options.rowHeight;
	    }
	
	    function getGroupRowHeaderCell(currInfo, offsetLeft, height, getUpdateKey) {
	        var scope = this;
	        if (getUpdateKey) {
	            return {
	                key: getRowHeaderCellKey_.call(this, currInfo),
	                left: offsetLeft,
	                height: height,
	                info: currInfo
	            };
	        } else {
	            return getRowHeaderCellRenderInfo_.call(scope, currInfo, null, height, offsetLeft);
	        }
	    }
	
	    function getGroupHeaderRow(key, currInfo, groupInfo, width, left) {
	        var scope = this;
	        return {
	            key: key,
	            isRowRole: false,
	            renderInfo: getGroupHeaderRenderInfo_.call(scope, currInfo.path, groupInfo, width, left)
	        };
	    }
	
	    function getGroupHeaderRenderInfo_(groupPath, groupInfo, width, left) {
	        var self = this;
	        return {
	            cssClass: 'gc-row g' + groupPath.join('_'),
	            style: {
	                left: left,
	                width: self.getGroupHeaderHeight_(groupInfo.data),
	                height: width,
	                overflow: 'hidden'
	            },
	            renderedHTML: renderGroupHeader_.call(self, groupInfo)
	        };
	    }
	
	    function renderGroupHeader_(groupInfo) {
	        var self = this;
	        return getGroupHeaderTemplate_.call(self, groupInfo)(getGroupFooterData_.call(self, groupInfo));
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
	        var colGroupHeaders = '';
	        _.forEach(self.grid.columns, function(column) {
	            if (column.groupHeader) {
	                colGroupHeaders = colGroupHeaders + (colGroupHeaders ? ', ' : '') + column.groupHeader;
	            }
	        });
	        var annotation = colGroupHeaders ? '(' + colGroupHeaders + ')' : '({{=it.count}} items)';
	        //TODO: preprocess user given header template, add height
	        var templateStr = (header && header.template) ||
	            '<div class="gc-group-header gc-group-header-cell ">' +
	            '<span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-top:{{=it.margin}}px;"></span>' +
	            '<div class="gc-grouping-header-text" level="{{=it.level}}"> {{=it.name}}<span> ' + annotation + '</span></div></div>';
	
	        self.cachedGroupHeaderFn_[groupPath.length - 1] = doT.template(templateStr, null, null, true);
	        return self.cachedGroupHeaderFn_[groupPath.length - 1];
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
	            condition: group.groupDescriptor.field,
	            eval: function(formula, format) {
	                var calcSource = self.grid.data.calcSource;
	                var result = calcSource.getEvaluator().evaluateFormula(formula, calcSource.getParserContext(), calcSource.getEvaluatorContext(-1, groupInfo.path));
	                return formatValue.call(self, result, format, formula);
	            }
	        };
	        return result;
	    }
	
	    function getGroupInfoAt_(offset) {
	        var self = this;
	        var startPosition = 0;
	        var path;
	        var i;
	        var len = self.grid.data.groups.length;
	        for (i = 0; i < len; i++) {
	            path = [i];
	            var groupInfo = self.grid.getGroupInfo_(path);
	            var groupHeight = groupInfo.height;
	            var result = getGroupInfoAtInternal_.call(self, path, offset, startPosition);
	            if (result) {
	                return result;
	            }
	
	            if (i === (len - 1)) {
	                var footer = groupInfo.data.groupDescriptor.footer;
	                if (footer && footer.visible) {
	                    return {
	                        path: [i],
	                        itemIndex: -1,
	                        area: 'groupFooter',
	                        startPosition: startPosition
	                    };
	                } else {
	                    path = [i];
	                    result = getLastGroupItemPath_.call(this, path);
	                    result.startPosition = startPosition;
	                    return result;
	                }
	            }
	            offset -= groupHeight;
	            startPosition += groupHeight;
	        }
	
	        return null;
	    }
	
	    function getGroupInfoAtInternal_(path, offsetTop, startPosition) {
	        var self = this;
	        var groupInfo = self.grid.getGroupInfo_(path);
	        var group = groupInfo.data;
	        var i;
	        var len;
	        var height;
	        if (offsetTop <= groupInfo.height) {
	            height = self.getGroupHeaderHeight_(group);
	            if (offsetTop <= height) {
	                return {
	                    path: path,
	                    itemIndex: -1,
	                    startPosition: startPosition,
	                    area: GROUP_HEADER
	                };
	            } else {
	                offsetTop -= height;
	                startPosition += height;
	                if (group.isBottomLevel) {
	                    for (i = 0, len = group.itemCount; i < len; i++) {
	                        height = self.getRowHeight_(group.getItem(i));
	                        if (offsetTop <= height) {
	                            return {
	                                path: path,
	                                itemIndex: i,
	                                startPosition: startPosition,
	                                area: GROUP_CONTENT
	                            };
	                        }
	                        offsetTop -= height;
	                        startPosition += height;
	                    }
	                } else {
	                    for (i = 0, len = groupInfo.children.length; i < len; i++) {
	                        var result = getGroupInfoAtInternal_.call(self, path.slice().concat([i]), offsetTop, startPosition);
	                        if (result) {
	                            return result;
	                        }
	                        height = groupInfo.children[i].height;
	                        offsetTop -= height;
	                        startPosition += height;
	                    }
	                }
	                return {
	                    path: path,
	                    itemIndex: -1,
	                    startPosition: startPosition,
	                    area: GROUP_FOOTER
	                };
	            }
	        } else {
	            return null;
	        }
	    }
	
	    function hitTestGroup_(groupInfo, heightLeft, accHeight, offsetLeft, offsetTop, area) {
	        var self = this;
	
	        var uid = self.grid.uid;
	        var group = groupInfo.data;
	        var groupPath = groupInfo.path;
	        var height = groupInfo.height;
	        var i;
	        var len;
	        var element;
	        var relativeElement;
	        var onGroupToggle = false;
	        var hitGroupInfo;
	        var children;
	        if (heightLeft <= height) {
	            height = self.getGroupHeaderHeight_(group);
	            //TODO: how to handle custom header template
	            if (heightLeft <= height) {
	                if (area === ROW_HEADER) {
	                    hitGroupInfo = {
	                        area: ROW_HEADER,
	                        row: -1,
	                        column: -1,
	                        groupInfo: {
	                            path: groupPath,
	                            area: GROUP_HEADER
	                        }
	                    };
	                    if (self.options.allowHeaderSelect) {
	                        relativeElement = document.getElementById(self.grid.uid + '-ghh' + groupPath.join('-'));
	                        element = relativeElement.querySelector('.gc-header-select-icon');
	                        if (element && pointIn_.call(self, offsetLeft - accHeight, offsetTop, element, relativeElement, true)) {
	                            hitGroupInfo.groupInfo.checked = true;
	                        }
	                    }
	                    return hitGroupInfo;
	                } else {
	                    relativeElement = document.getElementById(uid + '-gh' + groupPath.join('_'));
	                    element = relativeElement.querySelector('.gc-grouping-toggle');
	                    if (pointIn_.call(self, offsetLeft - accHeight, offsetTop, element, relativeElement, true)) {
	                        onGroupToggle = true;
	                    }
	                    return {
	                        area: VIEWPORT,
	                        row: -1,
	                        column: -1,
	                        groupInfo: {
	                            path: groupPath,
	                            area: GROUP_HEADER,
	                            onExpandToggle: onGroupToggle
	                        }
	                    };
	                }
	
	            } else {
	                heightLeft -= height;
	                accHeight += height;
	
	                if (group.collapsed) {
	                    if (group.groupDescriptor.footer && group.groupDescriptor.footer.collapseWithGroup) {
	                        throw 'group hitTest error';
	                    } else {
	                        if (heightLeft <= self.getGroupFooterHeight_(group)) {
	                            return hitTestGroupFooter_.call(self, groupInfo, offsetLeft, offsetTop, area);
	                        } else {
	                            throw 'group hitTest error';
	                        }
	                    }
	
	                }
	                if (!groupInfo.isBottomLevel) {
	                    children = groupInfo.children;
	                    for (i = 0, len = children.length; i < len; i++) {
	                        height = self.getGroupHeight_(children[i]);
	                        if (heightLeft <= height) {
	                            return hitTestGroup_.call(self, groupInfo.children[i], heightLeft, accHeight, offsetLeft, offsetTop, area);
	                        }
	                        heightLeft -= height;
	                        accHeight += height;
	                    }
	                } else {
	                    hitGroupInfo = self.hitTestGroupContent_(groupInfo, area, offsetLeft - accHeight, offsetTop);
	                    if (hitGroupInfo) {
	                        return hitGroupInfo;
	                    }
	                }
	                return hitTestGroupFooter_.call(self, groupInfo, offsetLeft, offsetTop, area);
	            }
	        }
	        return null;
	    }
	
	    function hitTestGroupFooter_(groupInfo, offsetLeft, offsetTop, area) {
	        var groupPath = groupInfo.path;
	        if (area === ROW_HEADER) {
	            return {
	                area: ROW_HEADER,
	                row: -1,
	                column: -1,
	                groupInfo: {
	                    path: groupPath,
	                    area: GROUP_FOOTER,
	                    row: -1,
	                    column: -1
	                }
	
	            };
	        }
	
	        var self = this;
	        var uid = self.grid.uid;
	        var cellElement;
	        var cellOffset;
	        var i;
	        var len = self.grid.columns.length;
	        var footerElement = document.getElementById(uid + '-gf' + groupPath.join('_'));
	        var footerElementOffset = domUtil.offset(footerElement);
	
	        for (i = 0; i < len; i++) {
	            cellElement = footerElement.querySelector('.c' + i);
	            if (cellElement) {
	                cellOffset = domUtil.offset(cellElement);
	                var left = cellOffset.left - footerElementOffset.left;
	                if (offsetLeft >= left && offsetLeft <= (left + cellElement.clientWidth)) {
	                    break;
	                }
	            }
	        }
	        return {
	            area: VIEWPORT,
	            row: -1,
	            column: -1,
	            groupInfo: {
	                path: groupPath,
	                area: GROUP_FOOTER,
	                row: -1,
	                column: i === len ? -1 : i
	            }
	        };
	    }
	
	    function hitTestGroupRowColumns_(groupPath, row, rowElement, offsetLeft, offsetTop) {
	        var self = this;
	        var c;
	        var cols = self.grid.columns;
	        var colLen = cols.length;
	        var colElement;
	        var actionElements;
	        var actIndex;
	        var actLen;
	        var action;
	        var hitGroupInfo;
	        var inTreeNode = false;
	        offsetTop -= (rowElement.style.top ? parseFloat(rowElement.style.top) : 0);
	        for (c = 0; c < colLen; c++) {
	            colElement = rowElement.querySelector('.c' + c);
	            if (colElement && pointIn_(offsetLeft, offsetTop, colElement, rowElement)) {
	                var nodeElement = colElement.querySelector('.gc-tree-node');
	                if (nodeElement && pointIn_.call(self, offsetLeft, offsetTop, nodeElement, rowElement, true)) {
	                    inTreeNode = true;
	                    break;
	                } else if (cols[c].action) {
	                    actionElements = colElement.querySelectorAll('[data-action]');
	                    for (actIndex = 0, actLen = actionElements.length; actIndex < actLen; actIndex++) {
	                        if (pointIn_(offsetLeft, offsetTop, actionElements[actIndex], rowElement)) {
	                            action = self.grid.getActionHandler_(cols[c].id, actionElements[actIndex].getAttribute('data-action'));
	                        }
	                    }
	                }
	                break;
	            }
	        }
	
	        if (!action) {
	            action = hitTestTouchPanel_(self.grid, cols, offsetLeft, offsetTop, rowElement);
	        }
	
	        hitGroupInfo = {
	            area: VIEWPORT,
	            row: -1,
	            column: -1,
	            groupInfo: {
	                area: GROUP_CONTENT,
	                path: groupPath,
	                row: row,
	                column: c === colLen ? -1 : c
	            }
	        };
	        if (inTreeNode) {
	            hitGroupInfo.groupInfo.inTreeNode = true;
	        }
	        if (action) {
	            hitGroupInfo.groupInfo.action = action;
	        }
	        return hitGroupInfo;
	    }
	
	    function getContentWidth_(grid) {
	        var data = grid.data;
	        if (hasGroup_(grid)) {
	            return _.reduce(grid.groupInfos_, function(sum, item) {
	                return sum + item.height;
	            }, 0);
	        } else {
	            return data.itemCount * grid.options.rowHeight;
	        }
	    }
	
	    function getContentHeight_(grid) {
	        //TODO: need to recaculate row rect if row template
	        return _.reduce(grid.columns, function(sum, col) {
	            return sum + ((!col.visible || isTouchActionColumn_(col)) ? 0 : col.visibleWidth);
	        }, 0);
	    }
	
	    function hasGroup_(grid) {
	        return grid.data.groups && grid.data.groups.length > 0;
	    }
	
	    function getRenderedColumnHeaderInfo_() {
	        var self = this;
	        self.columnHeaderHTML = self.columnHeaderHTML || getTemplate_.call(this, true);
	        return [
	            {
	                key: self.grid.uid + '-ch',
	                isRowRole: false,
	                renderInfo: {
	                    cssClass: 'gc-column-header ch',
	                    renderedHTML: self.columnHeaderHTML
	                }
	            }
	        ];
	    }
	
	    function getTemplate_(isColumnHeader) {
	        var self = this;
	        if (!isColumnHeader && self.cachedTmplFn_) {
	            return self.cachedTmplFn_;
	        }
	        var templateStr = getRawRowTemplate_.call(this, isColumnHeader);
	        var oldColTmpl;
	        var newColTmpl;
	        var cssName;
	        var tagName;
	        var colTmpl;
	        var grid = self.grid;
	        templateStr = filterActionColumn_.call(this, templateStr);
	        var element = domUtil.createTemplateElement(templateStr);
	        //Different browsers may return different innerHTMLs compared with the original HTML,
	        //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	        templateStr = domUtil.getElementInnerText(element);
	
	        var treeColId = getTreeColumn_(grid);
	        var annotationCols = element.querySelectorAll('[data-column]');
	        _.each(annotationCols, function(annotationCol, index) {
	            var col = grid.getColById_(annotationCol.getAttribute('data-column'));
	            var colId = col.id;
	            var colAnnotation;
	            if (col.isCalcColumn_) {
	                colAnnotation = '{{=it.' + colId + '}}';
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
	            cssName = (isColumnHeader ? 'gc-column-header-cell' : 'gc-cell') + ' c' + index + (col.cssClass ? (' ' + col.cssClass) : '');
	
	            var innerPresenter;
	            if (col.action) {
	                innerPresenter = isColumnHeader ? (col.caption || '') : createActionColumn_.call(self, col);
	            } else {
	                innerPresenter = isColumnHeader ? col.caption : (col.presenter ? col.presenter : colAnnotation);
	            }
	
	            if (!isColumnHeader && grid.data.isHierarchical && colId === treeColId) {
	                var treeColPresenter = '<div style="margin-top:{{=it.node.offset}}px;display: inline-block;">' +
	                    '<span class="gc-icon gc-tree-node {{? it.node.collapsed}}collapsed{{??}}expanded{{?}}" style="visibility:{{? it.node.children.length !=0}}visible{{??}}hidden{{?}};"></span></div>';
	                innerPresenter = treeColPresenter + innerPresenter;
	            }
	
	            newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                '<div style="height:100%;" class="' + cssName + '"' + (isColumnHeader ? '' : ' role="gridcell"') + '>' + innerPresenter +
	                (isColumnHeader ? getSortIndicatorHtml_(self, col, index) : '') +
	                '</div></' + tagName + '>';
	
	            //outerHTML returns double quotes in attribute sometimes
	            if (templateStr.indexOf(oldColTmpl) === -1) {
	                // jscs:disable validateQuoteMarks
	                /*jshint quotmark: double */
	                oldColTmpl = oldColTmpl.replace(/"/g, "'");
	                // jscs:enable validateQuoteMarks
	            }
	            templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	        });
	
	        if (!isColumnHeader) {
	            self.cachedTmplFn_ = doT.template(templateStr, null, null, true);
	            return self.cachedTmplFn_;
	        }
	
	        element = null;
	        return templateStr;
	    }
	
	    function getTreeColumn_(grid) {
	        var hierarchy = grid.options.hierarchy;
	        var cols = grid.columns;
	        if (hierarchy && hierarchy.column) {
	            var col = _.find(cols, _.matchesProperty('id', hierarchy.column));
	            return col ? col.id : cols[0].id;
	        } else {
	            return cols[0].id;
	        }
	    }
	
	    function getRawRowTemplate_(isColumnHeader) {
	        return getUserDefinedTemplate_.call(this, isColumnHeader) || getDefaultRawRowTemplate_.call(this, isColumnHeader);
	    }
	
	    function consolidateColumnWidth_() {
	        var self = this;
	        var tmpl = getUserDefinedTemplate_.call(this);
	        if (tmpl) {
	            var div = '<div style="position:absolute;top:-10000px;left:-10000px;width:5000px;height:5000px;">' + tmpl + '</div>';
	            var element = domUtil.createElement(div);
	            document.body.appendChild(element);
	            var colElem;
	            _.each(self.grid.columns, function(col) {
	                colElem = document.querySelector('[data-column="' + col.id + '"]');
	                if (colElem) {
	                    col.visibleWidth = domUtil.getElementRect(colElem).height;
	                }
	            });
	            document.body.removeChild(element);
	        }
	    }
	
	    function getUserDefinedTemplate_(isColumnHeader) {
	        var options = this.options;
	        if (options) {
	            var rowTmpl = isColumnHeader ? (options.columnHeaderTemplate || options.rowTemplate) : options.rowTemplate;
	            if (rowTmpl) {
	                if (gcUtils.isString(rowTmpl) && rowTmpl.length > 1 && rowTmpl[0] === '#') {
	                    var tmplElement = document.getElementById(rowTmpl.slice(1));
	                    return tmplElement.innerHTML;
	                } else {
	                    return rowTmpl;
	                }
	            }
	        }
	        return null;
	    }
	
	    function getDefaultRawRowTemplate_(isColumnHeader) {
	        var self = this;
	        var cols = self.grid.columns;
	        var top = 0;
	        var width = isColumnHeader ? self.options.colHeaderHeight : self.options.rowHeight;
	        var height = getContentHeight_(self.grid);
	        var r = '<div style="width:' + width + 'px;height:' + height + 'px;">';
	        _.each(cols, function(col) {
	            if (col.visible) {
	                r += '<div class="gc-column" style="width:' + width + 'px;height:' + col.visibleWidth + 'px;top:' + top + 'px;' + (col.visible ? '' : 'display:none') + '" data-column="' + col.id + '"></div>';
	                top += col.visibleWidth;
	            }
	        });
	        r += '</div>';
	        return r;
	    }
	
	    function filterActionColumn_(templateStr) {
	        var self = this;
	        var grid = self.grid;
	        var div = document.createElement('div');
	        div.innerHTML = templateStr;
	        var element = div.children[0];
	        var annotationCols = element.querySelectorAll('[data-column]');
	        _.each(annotationCols, function(annotationCol) {
	            var col = grid.getColById_(annotationCol.getAttribute('data-column'));
	            if (isTouchActionColumn_(col)) {
	                annotationCol.style.setProperty('display', 'none');
	            }
	        });
	
	        return domUtil.getElementInnerText(div);
	    }
	
	    function getRowHeaderCellRenderInfo_(currentInfo, itemIndex, height, offsetLeft) {
	        var self = this;
	        var key = getRowHeaderCellKey_.call(self, currentInfo, itemIndex);
	        return buildHeaderCell_.call(self, key, currentInfo, (currentInfo ? false : true), (itemIndex ? (itemIndex * height) : offsetLeft), height, itemIndex);
	    }
	
	    function getRowHeaderCellKey_(currentInfo, itemIndex) {
	        var self = this;
	        var key = self.grid.uid;
	        if (currentInfo) {
	            if (currentInfo.area === GROUP_HEADER) {
	                key += ('-ghh' + currentInfo.path.join('-'));
	            } else if (currentInfo.area === GROUP_CONTENT) {
	                key += ('-grh' + currentInfo.path.join('-') + '-r' + currentInfo.itemIndex);
	            } else {
	                key += ('-gfh' + currentInfo.path.join('-'));
	            }
	        } else {
	            key += ('-rh' + itemIndex);
	        }
	
	        return key;
	    }
	
	    function buildHeaderCell_(key, info, isRowRole, left, height, itemIndex) {
	        var self = this;
	        var grid = self.grid;
	        var showCheckbox = true;
	        var isChecked = false;
	        var selectedRows = self.selectedRows_;
	        var checkboxSelectable = self.options.allowHeaderSelect;
	        if (checkboxSelectable) {
	            if (info) {
	                if (info.area === GROUP_HEADER) {
	                    var mappings = getGroupMapping_(grid.getGroupInfo_(info.path));
	                    for (var i = 0, length = mappings.length; i < length; i++) {
	                        isChecked = selectedRows && selectedRows.indexOf(mappings[i]) !== -1;
	                        if (!isChecked) {
	                            break;
	                        }
	                    }
	                } else if (info.area === GROUP_FOOTER) {
	                    showCheckbox = false;
	                } else {
	                    var row = grid.getGroupInfo_(info.path).data.toSourceRow(info.itemIndex);
	                    isChecked = selectedRows && selectedRows.indexOf(row) !== -1;
	                }
	            } else {
	                isChecked = selectedRows && selectedRows.indexOf(grid.data.toSourceRow(itemIndex)) !== -1;
	            }
	        }
	        return {
	            key: key,
	            isRowRole: isRowRole,
	            renderInfo: {
	                cssClass: 'gc-row-header',
	                style: {
	                    left: left,
	                    width: height,
	                    height: self.options.rowHeaderWidth
	                },
	                renderedHTML: '<div class="gc-row-header-cell">' + (checkboxSelectable && showCheckbox ? '<div id="' + key + '-select" class="gc-icon gc-header-select-icon' + (isChecked ? ' selected' : '') + '"></div>' : '') + '</div>'
	
	            }
	        };
	    }
	
	    function getRowsRenderInfo_(area, options) {
	        var scope = this;
	        var grid = scope.grid;
	        var uid = grid.uid;
	        var currLayoutInfo = scope.getLayoutInfo()[area];
	        var r = {};
	        var i;
	        var rowHeight = scope.options.rowHeight;
	
	        var renderRange = getRenderRangeInfo_.call(scope, area, currLayoutInfo, options);
	        if (area === VIEWPORT) {
	            r.left = -options.offsetLeft;
	            r.top = -options.offsetTop;
	            r.renderedRows = [];
	            if (hasGroup_(grid)) {
	                r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(this, renderRange.start, renderRange.end, renderRange.offsetLeft, false, true));
	            } else {
	                for (i = renderRange.start; i < renderRange.end; i++) {
	                    r.renderedRows.push({
	                        key: uid + '-r' + i,
	                        index: i,
	                        height: rowHeight
	                    });
	                }
	            }
	        } else if (area === ROW_HEADER) {
	            r.left = -options.offsetLeft || 0;
	            r.top = 0;
	            r.renderedRows = [];
	
	            if (hasGroup_(grid)) {
	                r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(this, renderRange.start, renderRange.end, renderRange.offsetLeft, true, true));
	            } else {
	                for (i = renderRange.start; i < renderRange.end; i++) {
	                    r.renderedRows.push({
	                        key: uid + '-rh' + i,
	                        index: i,
	                        height: rowHeight
	                    });
	                }
	            }
	        } else if (area === COLUMN_HEADER) {
	            r.left = 0;
	            r.top = -options.offsetTop;
	            r.renderedRows = [];
	            r.renderedRows.push({key: uid + '-ch'});
	        }
	        return r;
	    }
	
	    function contains_(layoutInfo, point) {
	        return point.left >= layoutInfo.left && point.top >= layoutInfo.top && point.left <= (layoutInfo.left + layoutInfo.width) && point.top <= (layoutInfo.top + layoutInfo.height);
	    }
	
	    function pointIn_(offsetLeft, offsetTop, element, relativeElement, enlarge) {
	        var self = this;
	        var eleOffset = domUtil.offset(element);
	        var targetEleOffset = domUtil.offset(relativeElement);
	        var left = eleOffset.left - targetEleOffset.left;
	        var top = eleOffset.top - targetEleOffset.top;
	        var elementRect = domUtil.getElementRect(element);
	        var enlargelength = (enlarge && self.grid.isTouchMode) ? 10 : 0;
	        left -= enlargelength;
	        top -= enlargelength;
	        var right = left + elementRect.width + 2 * enlargelength;
	        var bottom = top + elementRect.height + 2 * enlargelength;
	
	        if (offsetLeft >= left && offsetLeft <= right &&
	            offsetTop >= top && offsetTop <= bottom) {
	            return true;
	        }
	
	        return false;
	    }
	
	    function hitTestTouchPanel_(grid, cols, offsetLeftFromCurrentRow, offsetTop, rowElement) {
	        var actionTouchPanel = getTouchPanel_();
	        var actionColumn;
	        var i;
	        var actIndex;
	        var actLen;
	        var actionElements;
	        var action;
	        if (actionTouchPanel) {
	            var actionLen = swipeStatus.columns.length;
	            for (i = 0; i < actionLen; i++) {
	                var columnIndex = swipeStatus.columns[i].index;
	                actionColumn = actionTouchPanel.querySelector('.gc-actioncolumn' + columnIndex);
	                if (actionColumn && pointIn_(offsetLeftFromCurrentRow, offsetTop, actionColumn, rowElement)) {
	                    if (cols[columnIndex].action) {
	                        actionElements = actionColumn.querySelectorAll('[data-action]');
	                        for (actIndex = 0, actLen = actionElements.length; actIndex < actLen; actIndex++) {
	                            if (pointIn_(offsetLeftFromCurrentRow, offsetTop, actionElements[actIndex], rowElement)) {
	                                action = grid.getActionHandler_(cols[columnIndex].id, actionElements[actIndex].getAttribute('data-action'));
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	
	        return action;
	    }
	
	    function getTouchPanel_() {
	        if (swipeStatus.row) {
	            return document.getElementById(swipeStatus.row.id + '-top-actionPanel') || document.getElementById(swipeStatus.row.id + '-bottom-actionPanel');
	        }
	    }
	
	    function parseStylePropertyValue_(style, property) {
	        return parseFloat(style.getPropertyValue(property));
	    }
	
	    function handleTouchMove_(sender, e) {
	        var args = {pageX: e.targetTouches[0].pageX, pageY: e.targetTouches[0].pageY};
	        if (handlePointerMove_.call(this, sender, args, false)) {
	            e.handled = true;
	        }
	    }
	
	    function handleMouseMove_(sender, e) {
	        handlePointerMove_.call(this, sender, e, true);
	    }
	
	    function handlePointerMove_(sender, e, mouseEvent) {
	        var grid = this;
	        var layoutEngine = grid.layoutEngine;
	
	        //call from document mousemove
	        if (!e && Object.prototype.toString.call(sender) === '[object MouseEvent]') {
	            e = sender;
	        }
	
	        if (layoutEngine.isDragDroping_) {
	            layoutEngine.hitTestInfo_ = layoutEngine.hitTest(e);
	            var pointOffset = layoutEngine.dragStartInfo_.pointOffset;
	            var element = layoutEngine.dragDropingElement_;
	            element.style.top = e.pageY + pointOffset.top + 'px';
	            element.style.left = e.pageX + pointOffset.left + 'px';
	
	            if (layoutEngine.hitTestInfo_ && layoutEngine.hitTestInfo_.area === GROUP_DRAG_PANEL) {
	                layoutEngine.dragDropingElement_.querySelector('.gc-icon').className = 'gc-icon gc-icon-grouping-add';
	                var groupDes = grid.data.groupDescriptors;
	                var to = getGroupInsertingLocation_.call(layoutEngine, e.pageX, e.pageY);
	                var field;
	                var len = groupDes.length;
	                if (len > 0) {
	                    field = (to === len ? groupDes[len - 1].field : groupDes[to].field);
	                    var groupingElement = document.getElementById(grid.uid + '-grouping-indicator-' + field);
	                    var indicatorElement = layoutEngine.dragDropingIndicatorElement_;
	                    var offset = domUtil.offset(groupingElement);
	                    indicatorElement.style.left = (to < len ? (offset.left - 15) : (offset.left + groupingElement.clientWidth)) + 'px';
	                    indicatorElement.style.top = (offset.top - 4) + 'px';
	                }
	
	                layoutEngine.dragDropingIndicatorElement_.style.display = 'block';
	
	            } else {
	                layoutEngine.dragDropingElement_.querySelector('.gc-icon').className = 'gc-icon gc-icon-grouping-forbidden';
	                layoutEngine.dragDropingIndicatorElement_.style.display = 'none';
	            }
	        } else {
	            layoutEngine.hitTestInfo_ = layoutEngine.hitTest(e);
	            if (layoutEngine.dragStartInfo_ && !layoutEngine.isDragDroping_ &&
	                ((layoutEngine.mouseDownPoint_ && e.pageX !== layoutEngine.mouseDownPoint_.left) ||
	                (layoutEngine.mouseDownPoint_ && e.pageY !== layoutEngine.mouseDownPoint_.top))) {
	                var success = startDragDroping_.call(layoutEngine);
	                if (success) {
	                    layoutEngine.isDragDroping_ = true;
	                    if (mouseEvent) {
	                        layoutEngine.handleMouseUpFn_ = handleMouseUp_.bind(grid);
	                        //fix a wired bug, if we bind mouse move earlier at the register method, it
	                        //will fail to remove the event listerner later.
	                        layoutEngine.handleMouseMoveFn2_ = handleMouseMove_.bind(grid);
	                        document.addEventListener('mousemove', layoutEngine.handleMouseMoveFn2_);
	                        document.addEventListener('mouseup', layoutEngine.handleMouseUpFn_);
	                    }
	                    document.body.className = document.body.className + ' no-select';
	                }
	            }
	        }
	
	        return !!layoutEngine.dragStartInfo_;
	    }
	
	    function handleTouchEnd_(sender, e) {
	        var args = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
	        if (handlePointerUp_.call(this, args, false)) {
	            e.handled = true;
	        }
	    }
	
	    function handleMouseUp_(e) {
	        handlePointerUp_.call(this, e, true);
	    }
	
	    function handlePointerUp_(e, mouseEvent) {
	        var self = this.layoutEngine;
	        var grid = self.grid;
	        var groupDes = grid.data.groupDescriptors;
	        var needInvalidate = true;
	        var success;
	        if (self.isDragDroping_) {
	            var hitTestInfo = self.hitTestInfo_;
	            var dragHitInfo = self.dragStartInfo_.hitTestInfo;
	            var field;
	            if (hitTestInfo && hitTestInfo.area === GROUP_DRAG_PANEL) {
	                var to = getGroupInsertingLocation_.call(self, e.pageX, e.pageY);
	                var groupingPanelInfo = self.hitTestInfo_.groupingPanelInfo;
	                if (dragHitInfo.area === COLUMN_HEADER && dragHitInfo.column >= 0) {
	                    var groupInfos = grid.data.groupDescriptors.slice();
	                    groupInfos.splice(to, 0, {field: grid.columns[dragHitInfo.column].id});
	                    grid.data.groupDescriptors = groupInfos;
	                } else if (dragHitInfo.area === GROUP_DRAG_PANEL && dragHitInfo.groupingPanelInfo) {
	                    var fromGroupField = dragHitInfo.groupingPanelInfo.field;
	                    field = groupingPanelInfo ? groupingPanelInfo.field : '';
	                    if (field === fromGroupField || (!field && groupDes[groupDes.length - 1].field === fromGroupField)) {
	                        needInvalidate = false;
	                    } else {
	                        var i;
	                        var len = groupDes.length;
	                        var from;
	
	                        for (i = 0; i < len; i++) {
	                            if (groupDes[i].field === fromGroupField) {
	                                from = i;
	                                break;
	                            }
	                        }
	                        if (from < to) { //fix bug, if reorder from left to right, we should insert before to item
	                            to = to - 1;
	                        }
	                        if (to === from) {
	                            needInvalidate = false;
	                        } else {
	                            groupDes.splice(to, 0, groupDes.splice(from, 1)[0]);
	                        }
	                    }
	                }
	            } else {  //remove grouping
	                if (dragHitInfo.area === COLUMN_HEADER && dragHitInfo.column >= 0) {
	                    field = self.grid.columns[dragHitInfo.column].id;
	                } else if (dragHitInfo.area === GROUP_DRAG_PANEL && dragHitInfo.groupingPanelInfo) {
	                    field = dragHitInfo.groupingPanelInfo.field;
	                }
	                if (field) {
	                    self.grid.data.groupDescriptors = _.remove(self.grid.data.groupDescriptors, function(info) {
	                        return info.field !== field;
	                    });
	                }
	            }
	            document.body.removeChild(self.dragDropingElement_);
	            document.body.removeChild(self.dragDropingIndicatorElement_);
	            self.dragDropingElement_ = null;
	            self.dragDropingIndicatorElement_ = null;
	            if (mouseEvent) {
	                document.removeEventListener('mousemove', self.handleMouseMoveFn2_);
	                document.removeEventListener('mouseup', self.handleMouseUpFn_);
	                self.handleMouseMoveFn2_ = null;
	                self.handleMouseUpFn_ = null;
	            }
	
	            document.body.className = document.body.className.replace('no-select', '');
	            if (needInvalidate) {
	                grid.invalidate();
	            }
	
	            success = true;
	        }
	        self.mouseDownPoint_ = null;
	        self.isDragDroping_ = false;
	        self.dragStartInfo_ = null;
	        self.hitTestInfo_ = null;
	        return success;
	    }
	
	    function handleSwipe_(sender, e) {
	        var self = this;
	        var layoutEngine = sender.layoutEngine;
	        var relatedRow;
	
	        console.log('distance: ' + e.moveDistance);
	        if (e.swipeStatus === 'swipestart') {
	            var hitTestInfo_ = layoutEngine.hitTest({pageX: e.targetTouches[0].pageX, pageY: e.targetTouches[0].pageY});
	            if (hitTestInfo_ && hitTestInfo_.area === VIEWPORT) {
	                relatedRow = getRelatedMoveRow.call(layoutEngine, hitTestInfo_);
	                self.stopEditing();
	                if (swipeStatus.row && relatedRow !== swipeStatus.row) {
	                    closeTouchPanel.call(self);
	                }
	
	                swipeStatus = {};
	                swipeStatus.row = relatedRow;
	                if (swipeStatus.row) {
	                    swipeStatus.actionType = getActionType(e.moveDistance);
	                    swipeStatus.columns = createActionColumns.call(layoutEngine);
	                    swipeStatus.columnsTotalWidth = 0;
	                    _.each(swipeStatus.columns, function(col) {
	                        swipeStatus.columnsTotalWidth += col.perferredSize;
	                    });
	                }
	
	                if (getTouchPanel_()) {
	                    swipeStatus.beginWithTouchPanel = true;
	                }
	            }
	        } else if (e.swipeStatus === 'swipemoving') {
	            if (swipeStatus.row) {
	                swipeStatus.moveDistance = e.moveDistance + (swipeStatus.beginWithTouchPanel ? (swipeStatus.actionType === 'top' ? 1 : -1) * swipeStatus.columnsTotalWidth : 0);
	                if (isReverseMove()) {
	                    refreshActionRow.call(self, -swipeStatus.moveDistance, 0);
	                } else if (Math.abs(swipeStatus.moveDistance) > swipeStatus.columnsTotalWidth) {
	                    refreshActionRow.call(self, -swipeStatus.moveDistance);
	                } else {
	                    refreshActionRow.call(self, -swipeStatus.moveDistance, Math.abs(swipeStatus.moveDistance));
	                }
	            }
	        } else {
	            if (swipeStatus.row) {
	                swipeStatus.moveDistance = e.moveDistance + (swipeStatus.beginWithTouchPanel ? (swipeStatus.actionType === 'top' ? 1 : -1) * swipeStatus.columnsTotalWidth : 0);
	                var v = Math.abs(e.velocity);
	                if (isReverseMove()) {
	                    refreshActionRow.call(self, 0, 0, true, v);
	                } else if (v > FLICK_THRESHOLD_V) {
	                    if (swipeStatus.beginWithTouchPanel) {
	                        refreshActionRow.call(self, 0, 0, true, v);
	                    } else {
	                        handleFlickGesture.call(self, e);
	                    }
	                } else {
	                    if (Math.abs(swipeStatus.moveDistance) < swipeStatus.columnsTotalWidth / 2) {
	                        refreshActionRow.call(self, 0, 0, true, v);
	                    } else {
	                        refreshActionRow.call(self, (swipeStatus.moveDistance > 0 ? -1 : 1) * swipeStatus.columnsTotalWidth, swipeStatus.columnsTotalWidth, true, v);
	                    }
	                }
	            }
	        }
	    }
	
	    function handleFlickGesture(e) {
	        var grid = this;
	        var layoutEngine = grid.layoutEngine;
	        var agrs;
	        var hitInfo;
	        var fn;
	
	        var action = findExecuteFlickAction.call(grid);
	        if (action && action.actionHandler) {
	            refreshActionRow.call(grid, (swipeStatus.moveDistance > 0 ? -1 : 1) * swipeStatus.columnsTotalWidth, swipeStatus.columnsTotalWidth, false, e.velocity);
	            agrs = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
	            layoutEngine.hitTestInfo_ = layoutEngine.hitTest(agrs);
	            hitInfo = layoutEngine.hitTestInfo_;
	            fn = function() {
	                action.actionHandler({
	                    gridModel: grid,
	                    hitInfo: hitInfo,
	                    dataItem: getDataItem.call(grid, hitInfo),
	                    closeActionColumnPanel: closeTouchPanel.bind(grid)
	                });
	            };
	
	            setTimeout(fn, 100);
	        } else {
	            refreshActionRow.call(grid, (swipeStatus.moveDistance > 0 ? -1 : 1) * swipeStatus.columnsTotalWidth, swipeStatus.columnsTotalWidth, true, e.velocity);
	        }
	    }
	
	    function findExecuteFlickAction() {
	        var self = this;
	        var actionPresenter;
	        var actionHandler;
	        var col;
	        var actionInfos;
	        var item;
	
	        for (var i = 0, collength = self.columns.length; i < collength; i++) {
	            col = self.columns[i];
	            actionInfos = self.columnActions_[col.id];
	            if (!actionInfos) {
	                continue;
	            }
	
	            for (var j = 0, length = actionInfos.length; j < length; j++) {
	                item = actionInfos[j];
	                if (item.flickAction === swipeStatus.actionType) {
	                    actionPresenter = (item.presenter ? item.presenter : ('<button class="gc-action" data-action="' + item.name + '">' + item.name + '</button>'));
	                    actionHandler = self.getActionHandler_(col.id, item.name);
	                    break;
	                }
	            }
	
	            if (actionPresenter) {
	                break;
	            }
	        }
	
	        if (actionPresenter !== '') {
	            return {
	                presenter: '<div class="gc-action-area">' + actionPresenter + '</div>',
	                actionHandler: actionHandler
	            };
	        } else {
	            return null;
	        }
	    }
	
	    function handleTouchScroll() {
	        var self = this;
	        self.stopEditing();
	        closeTouchPanel.call(self);
	    }
	
	    function handleMouseWheel(sender, e) {
	        var grid = sender;
	        var layoutEngine = grid.layoutEngine;
	        if (!layoutEngine.showScrollPanel(VIEWPORT)) {
	            return;
	        }
	        e.preventDefault();
	        var offsetDeltaY = e.deltaY;
	        var offsetDeltaX = e.deltaX;
	        if (offsetDeltaY !== 0 || offsetDeltaX !== 0) {
	            /*jshint -W069 */
	            var layout = layoutEngine.getLayoutInfo()[VIEWPORT];
	            var maxOffsetTop = Math.max(layout.contentHeight - layout.height, 0);
	            var maxOffsetLeft = Math.max(layout.contentWidth - layout.width, 0);
	            var offsetTop = grid.scrollOffset.top;
	            var offsetLeft = grid.scrollOffset.left;
	            var scrollTop;
	            var scrollLeft;
	            if (Math.abs(offsetDeltaX) <= Math.abs(offsetDeltaY) && offsetDeltaY > 0) {
	                if (offsetTop >= maxOffsetTop) {
	                    return;
	                } else {
	                    scrollTop = Math.min(offsetTop + offsetDeltaY, maxOffsetTop);
	                }
	                domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel.scroll-top').scrollTop = scrollTop;
	            } else if (Math.abs(offsetDeltaX) <= Math.abs(offsetDeltaY) && offsetDeltaY < 0) {
	                if (offsetTop === 0) {
	                    return;
	                } else {
	                    scrollTop = Math.max(offsetTop + offsetDeltaY, 0);
	                }
	                domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel.scroll-top').scrollTop = scrollTop;
	            } else if (Math.abs(offsetDeltaX) > Math.abs(offsetDeltaY) && offsetDeltaX > 0) {
	                if (offsetLeft >= maxOffsetLeft) {
	                    return;
	                } else {
	                    scrollLeft = Math.min(offsetLeft + offsetDeltaX, maxOffsetLeft);
	                }
	                domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel.scroll-left').scrollLeft = scrollLeft;
	            } else if (Math.abs(offsetDeltaX) > Math.abs(offsetDeltaY) && offsetDeltaX < 0) {
	                if (offsetLeft === 0) {
	                    return;
	                } else {
	                    scrollLeft = Math.max(offsetLeft + offsetDeltaX, 0);
	                }
	                domUtil.getElement('#' + grid.uid + ' .gc-grid-viewport-scroll-panel.scroll-left').scrollLeft = scrollLeft;
	            }
	        }
	    }
	
	    function handleMouseClick_(sender, e) {
	        var self = sender.layoutEngine;
	        self.hitTestInfo_ = self.hitTest(e);
	        var hitInfo = self.hitTestInfo_;
	        self.mouseDownPoint_ = null;
	        var groupInfo = self.hitTestInfo_.groupInfo;
	        var group;
	        var grid = self.grid;
	        var editingHandler = grid.editingHandler;
	        if (!hitInfo) {
	            return;
	        }
	        if (editingHandler.isEditing_ && !isEditingSameRow_(hitInfo, editingHandler.editingInfo_) && grid.hasEditAction_) {
	            return;
	        }
	
	        var actionHandler;
	        if (hitInfo.area === COLUMN_HEADER) {
	            handleClickColHeader_.call(self, hitInfo);
	            return;
	        }
	        if (hitInfo.area === VIEWPORT) {
	            actionHandler = hitInfo.action || null;
	            if (hitInfo.inTreeNode || (groupInfo && groupInfo.inTreeNode)) {
	                updateTreeNode(self);
	                grid.invalidate();
	                return;
	            }
	        }
	        if (hitInfo.area === GROUP_DRAG_PANEL) {
	            var groupingInfo = hitInfo.groupingPanelInfo;
	            if (groupingInfo) {
	                if (groupingInfo.action === 'delete') {
	                    self.grid.data.groupDescriptors = _.remove(self.grid.data.groupDescriptors, function(info) {
	                        return info.field !== groupingInfo.field;
	                    });
	                }
	            }
	        } else if (hitInfo.groupInfo && hitInfo.groupInfo.area === GROUP_HEADER) {
	            if (groupInfo && groupInfo.onExpandToggle) {
	                group = self.grid.getGroupInfo_(groupInfo.path).data;
	                group.collapsed = !group.collapsed;
	                sender.invalidate();
	            }
	        } else if (hitInfo.groupInfo && hitInfo.groupInfo.area === GROUP_CONTENT) {
	            actionHandler = hitInfo.groupInfo.action || null;
	        }
	
	        if (!editingHandler.isEditing_) {
	            updateSelection(self);
	        }
	
	        var dataItem = getDataItem.call(self.grid, hitInfo);
	        if (actionHandler) {
	            actionHandler({
	                gridModel: grid,
	                hitInfo: hitInfo,
	                dataItem: dataItem,
	                closeActionColumnPanel: closeTouchPanel.bind(grid)
	            });
	        }
	
	        self.mouseDownPoint_ = null;
	        self.isDragDroping_ = false;
	        self.hitTestInfo_ = null;
	        self.dragStartInfo_ = null;
	    }
	
	    function handleMouseDown(sender, e) {
	        handlePointerDown(sender, e);
	    }
	
	    function handleTouchStart(sender, e) {
	        var args = {pageX: e.targetTouches[0].pageX, pageY: e.targetTouches[0].pageY};
	        if (handlePointerDown(sender, args)) {
	            e.handled = true;
	        }
	    }
	
	    function handlePointerDown(sender, e) {
	        var layoutEngine = sender.layoutEngine;
	        layoutEngine.hitTestInfo_ = layoutEngine.hitTest(e);
	        var hitInfo = layoutEngine.hitTestInfo_;
	        if (!hitInfo) {
	            return;
	        }
	        var editingHandler = sender.editingHandler;
	        if (editingHandler.isEditing_) {
	            return;
	        }
	        handleDragStart.call(layoutEngine, hitInfo, e);
	    }
	
	    function handleClickColHeader_(hitInfo) {
	        var self = this;
	        var grid = self.grid;
	        var columns = grid.columns;
	        var col = hitInfo.column;
	        if (col >= 0) {
	            var colObj = columns[col];
	            var canSort = colObj.hasOwnProperty('allowSorting') ? colObj.allowSorting : self.options.allowSorting;
	            if (canSort) {
	                var currentSortInfo = null;
	                if (grid.data.sortDescriptors) {
	                    currentSortInfo = _.find(grid.data.sortDescriptors, _.matchesProperty('field', colObj.id));
	                }
	                var opSortInfo;
	                if (grid.options.sorting) {
	                    opSortInfo = _.find(grid.options.sorting, _.matchesProperty('field', colObj.id));
	                    if (opSortInfo && !opSortInfo.hasOwnProperty('ascending')) {
	                        opSortInfo.ascending = true;
	                    }
	                }
	                if (!opSortInfo) {
	                    opSortInfo = {field: colObj.id, ascending: true};
	                }
	                if (currentSortInfo) {
	                    if (currentSortInfo.ascending !== opSortInfo.ascending) {
	                        currentSortInfo = null;
	                    } else {
	                        currentSortInfo.ascending = !currentSortInfo.ascending;
	                    }
	                } else {
	                    currentSortInfo = _.clone(opSortInfo);
	                }
	                grid.data.sortDescriptors = currentSortInfo;
	            }
	        }
	    }
	
	    function closeTouchPanel() {
	        var self = this;
	        ani.stop();
	        refreshActionRow.call(self, 0, 0);
	        swipeStatus = {};
	    }
	
	    function refreshActionRow(rowtop, panelHeight, useAnimation, velocity) {
	        var self = this;
	        if (!swipeStatus.row) {
	            return;
	        }
	
	        if (useAnimation) {
	            var currentRowtop = parseFloat(swipeStatus.row.style.top);
	            var touchPanel = document.getElementById(swipeStatus.row.id + '-' + swipeStatus.actionType + '-actionPanel');
	            var currentPanelHeight = touchPanel ? parseFloat(touchPanel.style.height) : 0;
	
	            var rowOffset = rowtop - currentRowtop;
	            var panelOffset = panelHeight - currentPanelHeight;
	            var duration = 0.25 * (1 / velocity);
	            duration = duration > 0.10 ? 0.10 : duration;
	
	            ani.play(duration, function(p) {
	                updateRow.call(self, rowOffset * p + currentRowtop);
	                updateTouchPanel.call(self, panelOffset * p + currentPanelHeight);
	            });
	        } else {
	            updateRow.call(self, rowtop);
	            updateTouchPanel.call(self, panelHeight);
	        }
	    }
	
	    function updateRow(newTop) {
	        var self = this;
	        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	        swipeStatus.row.style.top = newTop + 'px';
	        if (newTop > 0) {
	            swipeStatus.row.style['border-right'] = '1px solid rgba(0, 0, 0, 0.2)';
	            swipeStatus.row.style.overflow = 'hidden';
	            swipeStatus.row.style.height = (layoutInfo.contentHeight - newTop) + 'px';
	        } else {
	            swipeStatus.row.style.removeProperty('border-right');
	            swipeStatus.row.style.removeProperty('overflow');
	            swipeStatus.row.style.removeProperty('height');
	        }
	    }
	
	    function updateTouchPanel(panelHeight) {
	        var self = this;
	        if (gcUtils.isNumber(panelHeight)) {
	            var viewPort = document.getElementById(self.uid + '-viewport-inner');
	            var actionPanel = document.getElementById(swipeStatus.row.id + '-' + swipeStatus.actionType + '-actionPanel');
	
	            if (actionPanel) {
	                viewPort.removeChild(actionPanel);
	            }
	
	            if (panelHeight > 0) {
	                viewPort.appendChild(createColumnTouchPanel.call(self, panelHeight));
	            }
	        }
	    }
	
	    function createColumnTouchPanel(panelHeight) {
	        var self = this;
	        var row = swipeStatus.row;
	        var actionType = swipeStatus.actionType;
	        var columns = swipeStatus.columns;
	        var id = row.id + '-' + actionType + '-actionPanel';
	        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	        var className = row.className + ' actionPanel';
	        var height = panelHeight;
	        var top = actionType === 'top' ? (layoutInfo.contentHeight - height) : 0;
	        var style = 'left:' + row.style.left + '; width:' + row.style.width + '; top:' + top + 'px; height:' + height + 'px;position:absolute';
	        var containerHtml = '<div id="' + id + '" style="' + style + '" class="' + className + '">';
	        var coltop = actionType === 'top' ? 0 : height;
	        var innerstyle;
	        _.each(columns, function(col) {
	            var colHeight = (col.perferredSize / swipeStatus.columnsTotalWidth) * height;
	            var colTml;
	            if (actionType === 'bottom') {
	                coltop -= colHeight;
	            }
	
	            innerstyle = actionType === 'bottom' ? ('position:absolute;left:0px;width:100%;height:' + col.perferredSize + 'px; top:' + (colHeight - col.perferredSize) + 'px;') : 'height:100%;';
	            colTml = '<div style = "' + 'width:100%;top:' + coltop + 'px;height:' + colHeight + 'px;position:absolute;overflow:hidden;">';
	            colTml += '<div style="' + innerstyle + '" class="gc-actioncolumn' + col.index + '">' + col.persenter + '</div>';
	            colTml += '</div>';
	
	            if (actionType === 'top') {
	                coltop += colHeight;
	            }
	
	            containerHtml += colTml;
	        });
	
	        containerHtml += '</div>';
	        return domUtil.createElement(containerHtml);
	    }
	
	    function handleDragStart(hitInfo, e) {
	        var self = this;
	        self.mouseDownPoint_ = {
	            left: e.pageX,
	            top: e.pageY
	        };
	
	        if (hitInfo.area === COLUMN_HEADER || hitInfo.area === GROUP_DRAG_PANEL) {
	            if (canStartDraging_.call(self, hitInfo)) {
	                self.dragStartInfo_ = {
	                    hitTestInfo: _.clone(hitInfo, true),
	                    pointOffset: {
	                        left: e.pageX,
	                        top: e.pageY
	                    }
	                };
	            } else {
	                self.dragStartInfo_ = null;
	            }
	        }
	
	        return !!self.dragStartInfo_;
	    }
	
	    function canStartDraging_(hitTestInfo) {
	        var data;
	        var column;
	        var groupDescriptors;
	        if (hitTestInfo) {
	            if (hitTestInfo.area === GROUP_DRAG_PANEL) {
	                return true;
	            } else if (hitTestInfo.area === COLUMN_HEADER && hitTestInfo.column >= 0) {
	                data = this.grid.data;
	                groupDescriptors = data.groupDescriptors;
	                column = this.grid.columns[hitTestInfo.column];
	                var grouped = !!_.find(groupDescriptors, _.matchesProperty('field', column.id));
	                return grouped ? false : !!(column.hasOwnProperty('allowGrouping') ? column.allowGrouping : this.grid.options.allowGrouping);
	            }
	        }
	        return false;
	    }
	
	    function parseStartSize_(value) {
	        if (gcUtils.isString(value) && value.length > 0 && value.slice(-1) === '*') {
	            var sz = value.length === 1 ? 1 : value.slice(0, -1) * 1;
	            if (sz > 0 && !isNaN(sz)) {
	                return sz;
	            }
	        }
	        return null;
	    }
	
	    function updateStartSize_() {
	        var scope = this;
	        var grid = scope.grid;
	        var columns = grid.columns;
	        var options = scope.options;
	        var containerInfo = grid.getContainerInfo_();
	        var containerRect = containerInfo.contentRect;
	        var szAvailable = containerRect.height - options.rowHeaderWidth;
	        if (options.allowGrouping) {
	            szAvailable -= getGroupDragPanelHeight_.call(scope);
	        }
	        if ((grid.data.itemCount * options.rowHeight) > (containerRect.width - options.colHeaderHeight)) {
	            szAvailable -= domUtil.getScrollbarSize().height;
	        }
	
	        var startCount = 0;
	        var lastStartCol;
	        var lastWidth;
	        var szCols = [];
	        var hasStar = false;
	
	        _.each(columns, function(col, index) {
	            if (col.visible) {
	                var sz = parseStartSize_(col.width);
	                szCols[index] = sz;
	                if (sz) {
	                    hasStar = true;
	                    startCount += sz;
	                    lastStartCol = index;
	                } else {
	                    szAvailable -= col.visibleWidth;
	                }
	            }
	        });
	
	        if (hasStar) {
	            lastWidth = szAvailable;
	            _.each(columns, function(col, index) {
	                if (col.visible) {
	                    if (szCols[index]) {
	                        if (index === lastStartCol) {
	                            col.visibleWidth = lastWidth;
	                        } else {
	                            col.visibleWidth = Math.max(0, Math.round(szCols[index] / startCount * szAvailable));
	                            lastWidth -= col.visibleWidth;
	                        }
	                    }
	                }
	            });
	        }
	    }
	
	    function updateTreeNode(layoutEngine) {
	        var self = layoutEngine;
	        var hitInfo = self.hitTestInfo_;
	        var hitGroupInfo = hitInfo.groupInfo;
	        var node;
	        if (hitGroupInfo) {
	            var group = self.grid.getGroupInfo_(hitGroupInfo.path).data;
	            node = group.rootNode.findNode(hitGroupInfo.row);
	        } else {
	            node = self.grid.data.rootNode.findNode(hitInfo.row);
	        }
	        if (node) {
	            node.collapsed = !node.collapsed;
	        }
	    }
	
	    function updateSelection(layoutEngine) {
	        var self = layoutEngine;
	        if (self.options.allowHeaderSelect) {
	            updateCheckboxSelection_(self);
	        } else {
	            updateGeneralSelection_(self);
	        }
	    }
	
	    function updateCheckboxSelection_(layoutEngine) {
	        var self = layoutEngine;
	        var hitInfo = self.hitTestInfo_;
	        var groupHitInfo = hitInfo.groupInfo;
	        if (!hitInfo.checked && (!groupHitInfo || !groupHitInfo.checked)) {
	            return;
	        }
	
	        var groupInfo = groupHitInfo ? self.grid.getGroupInfo_(groupHitInfo.path) : null;
	        var viewRow = groupHitInfo ? groupHitInfo.row : hitInfo.row;
	        var srcRow = groupInfo ? groupInfo.data.toSourceRow(viewRow) : self.grid.data.toSourceRow(viewRow);
	
	        var selectedRows = self.selectedRows_ = self.selectedRows_ || [];
	        var selModeOpt = self.options.selectionMode;
	        var i;
	        var length;
	        var targetElement;
	        var checked;  //current checked status;
	
	        if (selModeOpt === SelectMode.NONE) {
	            selectedRows.length = 0;
	            setAllStatus_(self, false);
	        } else if (selModeOpt === SelectMode.SINGLE) {
	            targetElement = getCheckElement_(self, hitInfo);
	            if (hitInfo.area === CORNER_HEADER || (groupHitInfo && groupHitInfo.area === GROUP_HEADER)) {
	                setCheckElementSelect_(targetElement, false);
	                return;
	            }
	            if (!isNaN(srcRow) && selectedRows.indexOf(srcRow) === -1) {
	                selectedRows.length = 0;
	                selectedRows.push(srcRow);
	                setAllStatus_(self, false);
	                var element = getRowElement_(self, viewRow, groupHitInfo);
	                setRowElementSelect_(element, true);
	            }
	            setCheckElementSelect_(targetElement, true);
	        } else {
	            if (hitInfo.area === CORNER_HEADER) {
	                checked = selectedRows.length === self.grid.data.itemCount;
	                selectedRows.length = 0;
	                if (!checked) {
	                    for (i = 0, length = self.grid.data.itemCount; i < length; i++) {
	                        selectedRows.push(self.grid.data.toSourceRow(i));
	                    }
	                }
	                setAllStatus_(self, !checked);
	            } else if (hitInfo.area === ROW_HEADER) {
	                if (groupHitInfo && groupHitInfo.area === GROUP_HEADER) {
	                    var mappings = getGroupMapping_(self.grid.getGroupInfo_(groupHitInfo.path));
	                    checked = _.difference(mappings, selectedRows).length <= 0;
	                    if (checked) {
	                        var intersection = _.intersection(selectedRows, mappings);
	                        for (i = 0, length = intersection.length; i < length; i++) {
	                            selectedRows.splice(selectedRows.indexOf(intersection[i]), 1);
	                        }
	                    } else {
	                        selectedRows = self.selectedRows_ = _.union(mappings, selectedRows);
	                    }
	                } else {
	                    var itemIndex = selectedRows.indexOf(srcRow);
	                    checked = itemIndex !== -1;
	                    if (checked) {
	                        selectedRows.splice(itemIndex, 1);
	                    } else {
	                        selectedRows.push(srcRow);
	                    }
	                }
	                checked = !checked; // after click, the checked status changed.
	                setMultiStatus_(self, checked);
	            }
	        }
	    }
	
	    function updateGeneralSelection_(layoutEngine) {
	        var self = layoutEngine;
	        var hitInfo = self.hitTestInfo_;
	        var groupHitInfo = hitInfo.groupInfo;
	        var hitInfoColumn = groupHitInfo ? groupHitInfo.column : hitInfo.column;
	        if (hitInfoColumn < 0) {
	            return;
	        }
	
	        var groupInfo = groupHitInfo ? self.grid.getGroupInfo_(groupHitInfo.path) : null;
	        var viewRow = groupHitInfo ? groupHitInfo.row : hitInfo.row;
	        var srcRow = groupInfo ? groupInfo.data.toSourceRow(viewRow) : self.grid.data.toSourceRow(viewRow);
	
	        if (isNaN(viewRow) || isNaN(srcRow)) {
	            return;
	        }
	
	        var selModeOpt = self.options.selectionMode;
	        var element;
	        var selectedRows = self.selectedRows_ = self.selectedRows_ || [];
	        var row = hitInfo.row;
	        if (selModeOpt === SelectMode.NONE) {
	            selectedRows.length = 0;
	            setAllStatus_(self, false);
	        } else if (selModeOpt === SelectMode.MULTIPLE) {
	            var itemIndex = selectedRows.indexOf(srcRow);
	            element = getRowElement_(self, row, groupHitInfo);
	            if (domUtil.hasClass(element, 'gc-selected')) {
	                selectedRows.splice(itemIndex, 1);
	                element = getRowElement_(self, row, groupHitInfo);
	                setRowElementSelect_(element, false);
	            } else {
	                if (itemIndex < 0) {
	                    selectedRows.push(srcRow);
	                    element = getRowElement_(self, row, groupHitInfo);
	                    setRowElementSelect_(element, true);
	                }
	            }
	        } else {
	            selectedRows.length = 0;
	            selectedRows.push(srcRow);
	            setAllStatus_(self, false);
	            element = getRowElement_(self, row, groupHitInfo);
	            setRowElementSelect_(element, true);
	        }
	    }
	
	    function setAllStatus_(layoutEngine, status) {
	        var self = layoutEngine;
	        var i;
	        var length;
	        if (self.options.allowHeaderSelect) {
	            var rowCheckElements = self.grid.container.querySelectorAll('.gc-header-select-icon');
	            for (i = 0, length = rowCheckElements.length; i < length; i++) {
	                setCheckElementSelect_(rowCheckElements[i], status);
	            }
	        }
	        var viewport = document.getElementById(self.grid.uid + '-viewport-inner');
	        var rows = viewport.children;
	        if (status) {
	            for (i = 0, length = rows.length; i < length; i++) {
	                domUtil.addClass(rows[i], 'gc-selected');
	                rows[i].setAttribute('aria-selected', 'true');
	            }
	        } else {
	            for (i = 0, length = rows.length; i < length; i++) {
	                domUtil.removeClass(rows[i], 'gc-selected');
	                rows[i].removeAttribute('aria-selected');
	            }
	        }
	    }
	
	    function setMultiStatus_(layoutEngine, checkedStatus) {
	        var self = layoutEngine;
	        var hitInfo = self.hitTestInfo_;
	        var groupHitInfo = hitInfo.groupInfo;
	        var uid = self.grid.uid;
	        var i;
	        var length;
	        var rowElement;
	        var targetElement = getCheckElement_(self, hitInfo);
	        var rootCheckElement = document.getElementById(uid + '-corner-select');
	        setCheckElementSelect_(rootCheckElement, self.selectedRows_.length === self.grid.data.itemCount);
	        //update row header checkbox
	        if (!groupHitInfo) {
	            rowElement = getRowElement_(self, hitInfo.row, null);
	            setRowElementSelect_(rowElement, checkedStatus);
	            setCheckElementSelect_(targetElement, checkedStatus);
	        } else {
	            //If there are groups, need to sync parent and children status
	            var targetGroupInfo;
	            var children;
	            var mappings;
	            //set parent status.
	            var path = _.clone(groupHitInfo.path);
	            if (groupHitInfo.area === GROUP_HEADER) {
	                path.pop();
	                setCheckElementSelect_(targetElement, checkedStatus);
	            } else if (groupHitInfo.area === GROUP_CONTENT) {
	                rowElement = getRowElement_(self, null, groupHitInfo);
	                setRowElementSelect_(rowElement, checkedStatus);
	                setCheckElementSelect_(targetElement, checkedStatus);
	            }
	            while (path.length > 0) {
	                targetElement = document.getElementById(uid + '-ghh' + path.join('-') + '-select');
	                if (targetElement) {
	                    targetGroupInfo = self.grid.getGroupInfo_(path);
	                    mappings = getGroupMapping_(targetGroupInfo);
	                    setCheckElementSelect_(targetElement, _.difference(mappings, self.selectedRows_).length <= 0);
	                }
	                path.pop();
	            }
	            //set children status.
	            if (groupHitInfo.area === GROUP_HEADER) {
	                var currentGroupInfo = self.grid.getGroupInfo_(groupHitInfo.path);
	                if (currentGroupInfo.children) {
	                    children = _.clone(currentGroupInfo.children);
	                    while (children.length) {
	                        targetGroupInfo = children.pop();
	                        path = targetGroupInfo.path;
	                        targetElement = document.getElementById(uid + '-ghh' + path.join('-') + '-select');
	                        setCheckElementSelect_(targetElement, checkedStatus);
	                        if (targetGroupInfo.children) {
	                            children.concat(targetGroupInfo.children);
	                        } else {
	                            for (i = 0, length = targetGroupInfo.data.itemCount; i < length; i++) {
	                                targetElement = document.getElementById(uid + '-grh' + path.join('-') + '-r' + i + '-select');
	                                setCheckElementSelect_(targetElement, checkedStatus);
	                                rowElement = document.getElementById(uid + '-gr' + path.join('_') + '-r' + i);
	                                setRowElementSelect_(rowElement, checkedStatus);
	                            }
	                        }
	                    }
	                } else {
	                    for (i = 0, length = currentGroupInfo.data.itemCount; i < length; i++) {
	                        targetElement = document.getElementById(uid + '-grh' + currentGroupInfo.path.join('-') + '-r' + i + '-select');
	                        setCheckElementSelect_(targetElement, checkedStatus);
	                        rowElement = document.getElementById(uid + '-gr' + currentGroupInfo.path.join('_') + '-r' + i);
	                        setRowElementSelect_(rowElement, checkedStatus);
	                    }
	                }
	            }
	        }
	    }
	
	    function setRowElementSelect_(element, status) {
	        if (element) {
	            if (status) {
	                domUtil.addClass(element, 'gc-selected');
	                element.setAttribute('aria-selected', 'true');
	            } else {
	                domUtil.removeClass(element, 'gc-selected');
	                element.removeAttribute('aria-selected');
	            }
	        }
	    }
	
	    function setCheckElementSelect_(element, status) {
	        if (element) {
	            if (status) {
	                domUtil.addClass(element, 'selected');
	            } else {
	                domUtil.removeClass(element, 'selected');
	            }
	        }
	    }
	
	    function getCheckElement_(layoutEngine, hitInfo) {
	        var self = layoutEngine;
	        var uid = self.grid.uid;
	        var selector;
	        var groupInfo = hitInfo.groupInfo;
	        if (hitInfo.area === CORNER_HEADER) {
	            selector = uid + '-corner';
	        } else if (hitInfo.area === ROW_HEADER) {
	            if (!groupInfo) {
	                var row = hitInfo.row;
	                if (row >= 0) {
	                    selector = uid + '-rh' + row;
	                }
	            } else {
	                if (groupInfo.area === GROUP_CONTENT && groupInfo.row >= 0) {
	                    selector = uid + '-grh' + groupInfo.path.join('-') + '-r' + groupInfo.row;
	                } else if (groupInfo.area === GROUP_HEADER) {
	                    selector = uid + '-ghh' + groupInfo.path.join('-');
	                }
	            }
	        }
	        return selector ? document.getElementById(selector + '-select') : null;
	    }
	
	    function getGroupMapping_(groupInfo) {
	        var mappings = [];
	        var group = groupInfo.data;
	        var i = 0;
	        while (i < group.itemCount) {
	            mappings.push(group.toSourceRow(i));
	            i++;
	        }
	        return mappings;
	    }
	
	    function createActionColumn_(col) {
	        var self = this;
	        var innerPresenter = '';
	        if (!self.grid.columnActions_) {
	            return innerPresenter;
	        }
	        var actionInfos = self.grid.columnActions_[col.id];
	        var item;
	        for (var i = 0, length = actionInfos.length; i < length; i++) {
	            item = actionInfos[i];
	            innerPresenter += '<div>' + (item.presenter ? item.presenter : ('<button class="gc-action" data-action="' + item.name + '">' + item.name + '</button>')) + '</div>';
	        }
	        if (innerPresenter !== '') {
	            innerPresenter = '<div class="gc-action-area">' + innerPresenter + '</div>';
	        }
	        return innerPresenter;
	    }
	
	    function createActionColumns() {
	        var self = this;
	        var columns = [];
	        var index = 0;
	        var actionType = swipeStatus.actionType;
	        _.each(self.grid.columns, function(col) {
	            if (isTouchActionColumn_(col) && col.swipeDirection === actionType) {
	                var innerPresenter = createActionColumn_.call(self, col);
	                columns.push({
	                    persenter: innerPresenter,
	                    perferredSize: col.visibleWidth,
	                    index: index
	                });
	            }
	            index++;
	        });
	
	        return columns;
	    }
	
	    function isTouchActionColumn_(col) {
	        return col.action && col.swipeDirection;
	    }
	
	    function getRowElement_(layoutEngine, row, groupInfo) {
	        var self = layoutEngine;
	        var uid = self.grid.uid;
	        var selector;
	        if (!groupInfo) {
	            if (row >= 0) {
	                selector = uid + '-r' + row;
	            }
	        } else {
	            if (groupInfo.area === GROUP_CONTENT && groupInfo.row >= 0) {
	                selector = uid + '-gr' + groupInfo.path.join('_') + '-r' + groupInfo.row;
	            } else if (groupInfo.area === GROUP_FOOTER) {
	                selector = uid + '-gf' + groupInfo.path.join('_');
	            } else if (groupInfo.area === GROUP_HEADER) {
	                selector = uid + '-gh' + groupInfo.path.join('_');
	            }
	        }
	        return selector ? document.getElementById(selector) : null;
	    }
	
	    function getDataItem(hitInfo) {
	        var dataItem;
	        var groupInfo;
	        var group;
	        var self = this;
	        if (hitInfo.groupInfo && hitInfo.groupInfo.area === GROUP_CONTENT) {
	            groupInfo = hitInfo.groupInfo;
	            group = self.getGroupInfo_(groupInfo.path).data;
	            dataItem = group.getItem(groupInfo.row);
	        } else {
	            dataItem = self.getDataItem(hitInfo.row);
	        }
	
	        return dataItem;
	    }
	
	    function getRelatedMoveRow(hitTestInfo) {
	        var self = this;
	        var uid = self.grid.uid;
	        var key;
	        var groupInfo = hitTestInfo.groupInfo;
	        if (groupInfo) {
	            var part = groupInfo.area;
	            if (part === GROUP_HEADER) {
	                key = uid + '-gh' + groupInfo.path.join('_');
	            } else if (part === GROUP_CONTENT) {
	                key = uid + '-gr' + groupInfo.path.join('_') + '-r' + groupInfo.row;
	            } else {
	                key = uid + '-gf' + groupInfo.path.join('_');
	            }
	        } else {
	            key = uid + '-r' + hitTestInfo.row;
	        }
	
	        return document.getElementById(key);
	    }
	
	    function getActionType(moveDistance) {
	        var actionPanel;
	        var acType;
	        _.each(['top', 'bottom'], function(actionType) {
	            actionPanel = document.getElementById(swipeStatus.row.id + '-' + actionType + '-actionPanel');
	            if (actionPanel) {
	                acType = actionType;
	            }
	        });
	
	        if (!acType) {
	            acType = moveDistance > 0 ? 'top' : 'bottom';
	        }
	
	        return acType;
	    }
	
	    function isReverseMove() {
	        return (swipeStatus.moveDistance > 0 ? 'top' : 'bottom') !== swipeStatus.actionType;
	    }
	
	    function formatValue(value, format, formula) {
	        var self = this;
	        var Sparkline = gcUtils.findPlugin('Sparkline');
	        if (Sparkline && value instanceof Sparkline.BaseSparkline) {
	            var containerWidth = self.options.rowHeight;
	            return '<span data-formula=\'' + formula + '\' class="gc-group-sparkline" style="position:relative;display:inline-block;vertical-align:middle;width:' + containerWidth + 'px;height:' + containerWidth + 'px;"></span>';
	        }
	        if (gcUtils.isFunction(format)) {
	            return format(value);
	        } else if (!gcUtils.isUndefinedOrNull(window.GcSpread)) {
	            var Formatter = gcUtils.findPlugin('Formatter');
	            var ExcelFormatter = Formatter ? Formatter.ExcelFormatter : null;
	            if (ExcelFormatter) {
	                var formatObj = new ExcelFormatter(format);
	                return formatObj.format(value);
	            }
	        }
	        return value;
	    }
	
	    function getSortIndicatorHtml_(layoutEngine, colObj, colIndex) {
	        var grid = layoutEngine.grid;
	        var sortInfo;
	        if (grid.data.sortDescriptors) {
	            sortInfo = _.find(grid.data.sortDescriptors, _.matchesProperty('field', colObj.id));
	        }
	        if (sortInfo) {
	            if (grid.options.sorting) {
	                var opSortInfo = _.find(grid.options.sorting, _.matchesProperty('field', colObj.id));
	                if (opSortInfo) {
	                    sortInfo = _.defaults(sortInfo, opSortInfo);
	                }
	            }
	            var sortCss = getSortCssClass_(sortInfo, colIndex);
	            return '<div class="sortContainer" style="float: right"><div class="' + sortCss + '"></div></div>';
	        }
	        return '';
	    }
	
	    function getSortCssClass_(sortInfo, colIndex) {
	        var ascending;
	        if (!sortInfo) {
	            ascending = true;
	        } else {
	            ascending = gcUtils.isUndefinedOrNull(sortInfo.ascending) ? true : !!sortInfo.ascending;
	        }
	        return ascending ? ('gc-icon gc-sorting ascending c' + colIndex) : ('gc-icon gc-sorting descending c' + colIndex);
	    }
	
	    function getLastGroupItemPath_(path) {
	        var self = this;
	        var groupInfo = self.grid.getGroupInfo_(path);
	        var group = groupInfo.data;
	        var gd = group.groupDescriptor;
	        var lastIndex = (group.isBottomLevel ? group.itemCount : groupInfo.children.length) - 1;
	        if (!group.isBottomLevel && !group.collapsed) {
	            return getLastGroupItemPath_.call(self, path.slice().concat([lastIndex]));
	        }
	        var footer = gd.footer;
	        if (group.collapsed) {
	            return {
	                path: path,
	                itemIndex: -1,
	                area: (footer && footer.visible && !footer.collapseWithGroup) ? GROUP_FOOTER : GROUP_HEADER
	            };
	        } else {
	            return {
	                path: path,
	                itemIndex: (footer && footer.visible) ? -1 : lastIndex,
	                area: (footer && footer.visible) ? GROUP_FOOTER : GROUP_HEADER
	            };
	        }
	    }
	
	    function isEditingSameRow_(hitInfo, editingInfo) {
	        return hitInfo.groupInfo ?
	            (hitInfo.groupInfo.group === editingInfo.groupInfo.path && hitInfo.groupInfo.row === editingInfo.rowIndex) :
	        hitInfo.row === editingInfo.rowIndex;
	    }
	
	    var ani = (function() {
	        var startTime = 0;
	        var _time = 0;
	        var _callback = null;
	        var playType = 0;//0 = timer, 1 = raf
	        var _lastTime = 0;
	        var _stopAnimation;
	        var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	
	        function playAnimation(time, cb) {
	            startTime = (new Date()).getTime();
	            _stopAnimation = false;
	            _time = time * 1000;
	            _callback = cb;
	
	            if (playType && raf) {
	                raf(_ani);
	            } else {
	                setTimeout(_ani, 16.6);
	            }
	        }
	
	        function _ani() {
	            var now = (new Date()).getTime();
	            var count = now - startTime;
	
	            var cb = function(val) {
	                _callback(val || easeOut(count, 0, 1, _time));
	
	            };
	
	            if (count >= _time || _stopAnimation) {
	                cb(1);
	                return;
	            }
	
	            cb();
	
	            _lastTime = (new Date()).getTime();
	
	            if (playType && raf) {
	                raf(_ani);
	            } else {
	                setTimeout(_ani, 16.6);
	            }
	        }
	
	        function easeOut(t, b, c, d) {
	            t /= d / 2;
	            if (t < 1) {
	                return c / 2 * t * t + b;
	            }
	
	            t--;
	            return -c / 2 * (t * (t - 2) - 1) + b;
	        }
	
	        //function easeInOut(t, b, c, d) {
	        //    if ((t /= d / 2) < 1) {
	        //        return c / 2 * t * t + b;
	        //    }
	        //    return -c / 2 * ((--t) * (t - 2) - 1) + b;
	        //}
	
	        //function linear(t, d) {
	        //    return t / d;
	        //}
	
	        function stopAnimation() {
	            _stopAnimation = true;
	        }
	
	        return {
	            play: playAnimation,
	            stop: stopAnimation
	        };
	    })();
	
	    module.exports = HorizontalLayoutEngine;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDVjNDg3Mzk4NDE2NDE5MGE0ZThlPzEwYmMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9sYXlvdXRFbmdpbmVzL0hvcml6b250YWxMYXlvdXRFbmdpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9nY1V0aWxzLmpzP2M4MmQiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanM/NDkyOCIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2RvbVV0aWwuanM/ZDBjZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLDZEQUE2RCxpRkFBaUYsdUdBQXVHO0FBQ2hTLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQzs7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QSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWdELFNBQVM7QUFDekQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIsU0FBUztBQUNwQztBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwr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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLEVBQUM7Ozs7Ozs7QUN2eEhEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsWUFBWTtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckIseUNBQXdDLEtBQUssV0FBVyxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW1DLGdCQUFnQjtBQUNuRDtBQUNBLHdDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQztBQUMxQyxrQkFBaUI7QUFDakIsc0NBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiSG9yaXpvbnRhbExheW91dEVuZ2luZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJHY1NwcmVhZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSB8fCB7fSwgcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdW1wiVmlld3NcIl1bXCJHY0dyaWRcIl1bXCJQbHVnaW5zXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl1bXCJIb3Jpem9udGFsTGF5b3V0RW5naW5lXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWM0ODczOTg0MTY0MTkwYTRlOGVcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi4vZ2NVdGlscycpO1xuICAgIHZhciBkb1QgPSByZXF1aXJlKCcuLi9kb1QuanMnKTtcbiAgICB2YXIgZG9tVXRpbCA9IHJlcXVpcmUoJy4uL2RvbVV0aWwnKTtcbiAgICB2YXIgUE9TX0FCUyA9ICdhYnNvbHV0ZSc7XG4gICAgdmFyIFBPU19SRUwgPSAncmVsYXRpdmUnO1xuICAgIHZhciBPVkVSRkxPV19ISURERU4gPSAnaGlkZGVuJztcbiAgICB2YXIgT1ZFUkZMT1dfQVVUTyA9ICdhdXRvJztcblxuICAgIHZhciBWSUVXUE9SVCA9ICd2aWV3cG9ydCc7XG4gICAgdmFyIENPTFVNTl9IRUFERVIgPSAnY29sdW1uSGVhZGVyJztcbiAgICB2YXIgUk9XX0hFQURFUiA9ICdyb3dIZWFkZXInO1xuICAgIHZhciBDT1JORVJfSEVBREVSID0gJ2Nvcm5lckhlYWRlcic7XG4gICAgdmFyIEdST1VQX0RSQUdfUEFORUwgPSAnZ3JvdXBpbmdQYW5lbCc7XG4gICAgdmFyIEdST1VQX0RSQUdfVEVYVCA9ICdEcmFnIGEgY29sdW1uIGhlYWRlciBoZXJlIGFuZCBkcm9wIGl0IHRvIGdyb3VwIGJ5IHRoYXQgY29sdW1uJztcbiAgICB2YXIgUkVTSVpFX0dBUF9TSVpFID0gNDtcblxuICAgIHZhciBQQURESU5HX0xFRlQgPSAncGFkZGluZy1sZWZ0JztcbiAgICB2YXIgUEFERElOR19SSUdIVCA9ICdwYWRkaW5nLXJpZ2h0JztcblxuICAgIHZhciBHUk9VUF9IRUFERVIgPSAnZ3JvdXBIZWFkZXInO1xuICAgIHZhciBHUk9VUF9GT09URVIgPSAnZ3JvdXBGb290ZXInO1xuICAgIHZhciBHUk9VUF9DT05URU5UID0gJ2dyb3VwQ29udGVudCc7XG4gICAgdmFyIFNlbGVjdE1vZGUgPSB7XG4gICAgICAgIE5PTkU6ICdub25lJyxcbiAgICAgICAgU0lOR0xFOiAnc2luZ2xlJyxcbiAgICAgICAgTVVMVElQTEU6ICdtdWx0aXBsZSdcbiAgICB9O1xuICAgIHZhciBzd2lwZVN0YXR1cyA9IHt9O1xuICAgIHZhciBGTElDS19USFJFU0hPTERfViA9IDAuODtcblxuICAgIHZhciBIb3Jpem9udGFsTGF5b3V0RW5naW5lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgb3B0aW9uRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjb2xIZWFkZXJIZWlnaHQ6IDgwLFxuICAgICAgICAgICAgY29sV2lkdGg6ICcqJyxcbiAgICAgICAgICAgIHJvd0hlYWRlcldpZHRoOiAyNCxcbiAgICAgICAgICAgIHJvd0hlaWdodDogODAsXG4gICAgICAgICAgICBzaG93Um93SGVhZGVyOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0NvbEhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dHcm91cEhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dHcm91cEZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93RWRpdGluZzogZmFsc2UsXG4gICAgICAgICAgICBhbGxvd0dyb3VwaW5nOiBmYWxzZSwgIC8vaWYgc2V0IHRvIHRydWUsIGl0IHdpbGwgc2hvdyBhIGdyb3VwIGRyYWcgcGFuZWwgdG8gaGVscCB1c2VyIGdyb3VwaW5nIHRoZSBkYXRhIGF0IHJ1bnRpbWVcbiAgICAgICAgICAgIGFsbG93U29ydGluZzogZmFsc2UsXG4gICAgICAgICAgICBzZWxlY3Rpb25Nb2RlOiBTZWxlY3RNb2RlLlNJTkdMRSxcbiAgICAgICAgICAgIGFsbG93SGVhZGVyU2VsZWN0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRNb2RlOiAnaW5saW5lJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sYXlvdXRJbmZvXyA9IG51bGw7XG5cbiAgICAgICAgc2VsZi5uYW1lID0gJ0hvcml6b250YWxMYXlvdXRFbmdpbmUnOyAvL25hbWUgbXVzdCBlbmQgd2l0aCBMYXlvdXRFbmdpbmVcbiAgICAgICAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBvcHRpb25EZWZhdWx0cyk7XG4gICAgfTtcblxuICAgIEhvcml6b250YWxMYXlvdXRFbmdpbmUucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb2x1bW5EZWZhdWx0c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBvcHRpb25zLmNvbFdpZHRoLFxuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgYWxsb3dTb3J0aW5nOiBvcHRpb25zLmFsbG93U29ydGluZyxcbiAgICAgICAgICAgICAgICBhbGxvd0VkaXRpbmc6IG9wdGlvbnMuYWxsb3dFZGl0aW5nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGdyaWQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2VsZi5ncmlkID0gZ3JpZDtcbiAgICAgICAgICAgIGdyaWQuY29sdW1ucyA9IF8ubWFwKGdyaWQuY29sdW1ucywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoY29sLCBfLmRlZmF1bHRzKHNlbGYuZ2V0Q29sdW1uRGVmYXVsdHNfKCksIHtcbiAgICAgICAgICAgICAgICAgICAgY2FwdGlvbjogY29sLmRhdGFGaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGNvbC5kYXRhRmllbGRcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF8uZWFjaChncmlkLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbCkge1xuICAgICAgICAgICAgICAgIGNvbC52aXNpYmxlV2lkdGggPSBjb2wud2lkdGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVwZGF0ZVN0YXJ0U2l6ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgICAgIC8vSWYgdGhlcmUgaXMgcm93IHRlbXBsYXRlLCB1c2UgdGhlIGFjdHVhbCBjb2x1bW4gd2lkdGggaW4gcm93IHRlbXBsYXRlLlxuICAgICAgICAgICAgY29uc29saWRhdGVDb2x1bW5XaWR0aF8uY2FsbChzZWxmKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRJbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uZ2V0TGF5b3V0SW5mbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYubGF5b3V0SW5mb18pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5sYXlvdXRJbmZvXztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSB7fTtcblxuICAgICAgICAgICAgc2VsZi5sYXlvdXRJbmZvX1tWSUVXUE9SVF0gPSBnZXRWaWV3cG9ydExheW91dEluZm9fLmNhbGwodGhpcyk7XG4gICAgICAgICAgICBzZWxmLmxheW91dEluZm9fW0NPUk5FUl9IRUFERVJdID0gZ2V0Q29ybmVySGVhZGVyTGF5b3V0SW5mb18uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb19bUk9XX0hFQURFUl0gPSBnZXRSb3dIZWFkZXJMYXlvdXRJbmZvXy5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgc2VsZi5sYXlvdXRJbmZvX1tDT0xVTU5fSEVBREVSXSA9IGdldENvbHVtbkhlYWRlckxheW91dEluZm9fLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dHcm91cGluZykge1xuICAgICAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb19bR1JPVVBfRFJBR19QQU5FTF0gPSBnZXRHcm91cERyYWdQYW5lbExheW91dEluZm9fLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5sYXlvdXRJbmZvXztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJJbmZvOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNjb3BlLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlckluZm8ob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcmVhID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hcmVhKSB8fCAnJztcbiAgICAgICAgICAgIGlmICghYXJlYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdWlkID0gc2NvcGUuZ3JpZC51aWQ7XG4gICAgICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHRoaXMuZ2V0TGF5b3V0SW5mbygpO1xuICAgICAgICAgICAgdmFyIGN1cnJMYXlvdXRJbmZvID0gbGF5b3V0SW5mb1thcmVhXTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGN1cnJMYXlvdXRJbmZvLndpZHRoO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGN1cnJMYXlvdXRJbmZvLmhlaWdodDtcbiAgICAgICAgICAgIHZhciByO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgcm93SGVpZ2h0ID0gc2NvcGUub3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgc3RhcnQ7XG4gICAgICAgICAgICB2YXIgZW5kO1xuICAgICAgICAgICAgdmFyIG9mZnNldExlZnQ7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNjb3BlLmdyaWQ7XG5cbiAgICAgICAgICAgIHZhciByZW5kZXJSYW5nZSA9IGdldFJlbmRlclJhbmdlSW5mb18uY2FsbChzY29wZSwgYXJlYSwgY3VyckxheW91dEluZm8sIG9wdGlvbnMpO1xuICAgICAgICAgICAgc3RhcnQgPSByZW5kZXJSYW5nZS5zdGFydDtcbiAgICAgICAgICAgIGVuZCA9IHJlbmRlclJhbmdlLmVuZDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgPSByZW5kZXJSYW5nZS5vZmZzZXRMZWZ0O1xuXG4gICAgICAgICAgICBpZiAoYXJlYSA9PT0gVklFV1BPUlQpIHtcbiAgICAgICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2Mtdmlld3BvcnQnLFxuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogY3VyckxheW91dEluZm8udG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogY3VyckxheW91dEluZm8ubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IE9WRVJGTE9XX0hJRERFTlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX1JFTCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogY3VyckxheW91dEluZm8uY29udGVudEhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbm5lckRpdlRyYW5zbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogLW9wdGlvbnMub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogLW9wdGlvbnMub2Zmc2V0VG9wXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkUm93czogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dyb3VwXyhncmlkKSkge1xuICAgICAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IHIucmVuZGVyZWRSb3dzLmNvbmNhdChnZXRHcm91cFJlbmRlckluZm9fLmNhbGwodGhpcywgc3RhcnQsIGVuZCwgb2Zmc2V0TGVmdCwgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cy5wdXNoKGNyZWF0ZVJvd1JlbmRlckluZm9fLmNhbGwoc2NvcGUsIGksIHJvd0hlaWdodCwgdWlkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09IENPUk5FUl9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2MtY29ybmVySGVhZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFBPU19BQlMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGN1cnJMYXlvdXRJbmZvLnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGN1cnJMYXlvdXRJbmZvLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19ISURERU4sXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB1aWQgKyAnLWNvcm5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Jvd1JvbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2MtY29ybmVyLWhlYWRlci1jZWxsIGNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiBzY29wZS5vcHRpb25zLmFsbG93SGVhZGVyU2VsZWN0ID8gJzxkaXYgaWQ9XCInICsgdWlkICsgJy1jb3JuZXItc2VsZWN0XCIgY2xhc3M9XCJnYy1pY29uIGdjLWhlYWRlci1zZWxlY3QtaWNvbicgKyAoKGdyaWQuZGF0YS5pdGVtQ291bnQgPT09IChzY29wZS5zZWxlY3RlZFJvd3NfICYmIHNjb3BlLnNlbGVjdGVkUm93c18ubGVuZ3RoKSkgPyAnIHNlbGVjdGVkJyA6ICcnKSArICdcIj48L2Rpdj4nIDogJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmVhID09PSBDT0xVTU5fSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLWNvbHVtbkhlYWRlcicsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyTGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyTGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjdXJyTGF5b3V0SW5mby5jb250ZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2VHJhbnNsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAtb3B0aW9ucy5vZmZzZXRUb3BcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBnZXRSZW5kZXJlZENvbHVtbkhlYWRlckluZm9fLmNhbGwodGhpcylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmVhID09PSBST1dfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgciA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLXJvd0hlYWRlcicsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyTGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyTGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBjdXJyTGF5b3V0SW5mby5jb250ZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2VHJhbnNsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtb3B0aW9ucy5vZmZzZXRMZWZ0IHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGhhc0dyb3VwXyhncmlkKSkge1xuICAgICAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IHIucmVuZGVyZWRSb3dzLmNvbmNhdChnZXRHcm91cFJlbmRlckluZm9fLmNhbGwodGhpcywgc3RhcnQsIGVuZCwgb2Zmc2V0TGVmdCwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzLnB1c2goZ2V0Um93SGVhZGVyQ2VsbFJlbmRlckluZm9fLmNhbGwoc2NvcGUsIG51bGwsIGksIHJvd0hlaWdodCwgb2Zmc2V0TGVmdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSByb3dIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09IEdST1VQX0RSQUdfUEFORUwpIHtcbiAgICAgICAgICAgICAgICByID0ge1xuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdkNzc0NsYXNzOiAnZ2MtZ3JvdXBpbmctY29udGFpbmVyIG5vLXNlbGVjdCcsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfQUJTLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyTGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyTGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogT1ZFUkZMT1dfSElEREVOXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBjdXJyTGF5b3V0SW5mby50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBjdXJyTGF5b3V0SW5mby5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlzUm93Um9sZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckluZm86IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogZ2V0UmVuZGVyZWRHcm91cERyYWdQYW5lbEluZm9fLmNhbGwoc2NvcGUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJvd1RlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhY2hlZFRtcGxGbl8gfHwgZ2V0VGVtcGxhdGVfLmNhbGwoc2VsZiwgZmFsc2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEluaXRpYWxTY3JvbGxPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93U2Nyb2xsUGFuZWw6IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uc2hvd1Njcm9sbFBhbmVsKGFyZWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZWEgPT09IFZJRVdQT1JUKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICAgICAgaWYgKGxheW91dEluZm8uaGVpZ2h0IDwgbGF5b3V0SW5mby5jb250ZW50SGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgICAgIGxheW91dEluZm8ud2lkdGggPCBsYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2Nyb2xsUGFuZWxSZW5kZXJJbmZvOiBmdW5jdGlvbihhcmVhKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdyb3VwU3RyYXRlZ3lfLmdldFNjcm9sbFBhbmVsUmVuZGVySW5mbyhhcmVhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcmVhID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgIHZhciBsYXlvdXQgPSBzZWxmLmdldExheW91dEluZm8oKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uSGVhZGVyTGF5b3V0SW5mbyA9IGxheW91dFtDT0xVTU5fSEVBREVSXTtcbiAgICAgICAgICAgICAgICB2YXIgcm93SGVhZGVyTGF5b3V0SW5mbyA9IGxheW91dFtST1dfSEVBREVSXTtcbiAgICAgICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBsYXlvdXRbVklFV1BPUlRdO1xuICAgICAgICAgICAgICAgIHZhciBzaG93SFNjcm9sbGJhciA9IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRXaWR0aCA+IHZpZXdwb3J0TGF5b3V0LndpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBzaG93VlNjcm9sbGJhciA9IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRIZWlnaHQgPiB2aWV3cG9ydExheW91dC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJEaXZDc3NDbGFzczogJ2djLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsIHNjcm9sbC1sZWZ0IHNjcm9sbC10b3AnLFxuICAgICAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogUE9TX0FCUyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5vcHRpb25zLmFsbG93R3JvdXBpbmcgPyBsYXlvdXRbR1JPVVBfRFJBR19QQU5FTF0uaGVpZ2h0IDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmhlaWdodCArIHJvd0hlYWRlckxheW91dEluZm8uaGVpZ2h0ICsgKHNob3dIU2Nyb2xsYmFyID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IDogMCksXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQud2lkdGggKyBjb2x1bW5IZWFkZXJMYXlvdXRJbmZvLndpZHRoICsgKHNob3dWU2Nyb2xsYmFyID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkud2lkdGggOiAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBPVkVSRkxPV19BVVRPXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBQT1NfUkVMLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2aWV3cG9ydExheW91dC5jb250ZW50SGVpZ2h0ICsgcm93SGVhZGVyTGF5b3V0SW5mby5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXQuY29udGVudFdpZHRoICsgY29sdW1uSGVhZGVyTGF5b3V0SW5mby53aWR0aFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTY3JvbGw6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ncm91cFN0cmF0ZWd5Xy5oYW5kbGVTY3JvbGwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICAgICAgZ3JpZC5zdG9wRWRpdGluZygpO1xuICAgICAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oVklFV1BPUlQpO1xuICAgICAgICAgICAgICAgIGdyaWQuc2Nyb2xsUmVuZGVyUGFydF8oQ09MVU1OX0hFQURFUik7XG4gICAgICAgICAgICAgICAgZ3JpZC5zY3JvbGxSZW5kZXJQYXJ0XyhST1dfSEVBREVSKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZ3JpZC5vblNjcm9sbE92ZXJfLnJhaXNlKHNlbGYuZ3JpZCwge1xuICAgICAgICAgICAgICAgIHNjcm9sbERpcmVjdGlvbjogZS5zY3JvbGxEaXJlY3Rpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgICAgIHZhciBqc29uT2JqID0ge307XG4gICAgICAgICAgICBqc29uT2JqLm5hbWUgPSBzZWxmLm5hbWU7XG4gICAgICAgICAgICB2YXIgZ3JpZE9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJvd0hlYWRlcldpZHRoICE9PSAyNCkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLnJvd0hlYWRlcldpZHRoID0gb3B0aW9ucy5yb3dIZWFkZXJXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbEhlYWRlckhlaWdodCAhPT0gODApIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5jb2xIZWFkZXJIZWlnaHQgPSBvcHRpb25zLmNvbEhlYWRlckhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJvd0hlaWdodCAhPT0gODApIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5yb3dIZWlnaHQgPSBvcHRpb25zLnJvd0hlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbFdpZHRoICE9PSAyNCkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLmNvbFdpZHRoID0gb3B0aW9ucy5jb2xXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNob3dSb3dIZWFkZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5zaG93Um93SGVhZGVyID0gb3B0aW9ucy5zaG93Um93SGVhZGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0NvbEhlYWRlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLnNob3dDb2xIZWFkZXIgPSBvcHRpb25zLnNob3dDb2xIZWFkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaG93R3JvdXBIZWFkZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5zaG93R3JvdXBIZWFkZXIgPSBvcHRpb25zLnNob3dHcm91cEhlYWRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNob3dHcm91cEZvb3RlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLnNob3dHcm91cEZvb3RlciA9IG9wdGlvbnMuc2hvd0dyb3VwRm9vdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dFZGl0aW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLmFsbG93RWRpdGluZyA9IG9wdGlvbnMuYWxsb3dFZGl0aW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dHcm91cGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5hbGxvd0dyb3VwaW5nID0gb3B0aW9ucy5hbGxvd0dyb3VwaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucm93VGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5yb3dUZW1wbGF0ZSA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JvdXBTdHJhdGVneSkge1xuICAgICAgICAgICAgICAgIGdyaWRPcHRpb25zLmdyb3VwU3RyYXRlZ3kgPSBvcHRpb25zLmdyb3VwU3RyYXRlZ3kudG9KU09OKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5lZGl0TW9kZSAhPT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgICAgICBncmlkT3B0aW9ucy5lZGl0TW9kZSA9IG9wdGlvbnMuZWRpdE1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIV8uaXNFbXB0eShncmlkT3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICBqc29uT2JqLm9wdGlvbnMgPSBncmlkT3B0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBqc29uT2JqO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNlbGVjdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICB2YXIgc2VscyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkUm93cyA9IHNlbGYuc2VsZWN0ZWRSb3dzXztcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWRSb3dzIHx8ICFzZWxlY3RlZFJvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW5ndGg7XG4gICAgICAgICAgICB2YXIgbWFwcGluZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGdyaWQuZGF0YS5pdGVtQ291bnQ7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1hcHBpbmdzLnB1c2goZ3JpZC5kYXRhLnRvU291cmNlUm93KGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBfLmludGVyc2VjdGlvbihtYXBwaW5ncywgc2VsZWN0ZWRSb3dzKTtcbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gZ3JpZC5kYXRhLnNvdXJjZUNvbGxlY3Rpb247XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSByZXN1bHQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzZWxzLnB1c2goY29sbGVjdGlvbltyZXN1bHRbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpdFRlc3Q6IGZ1bmN0aW9uKGV2ZW50QXJncykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5ncm91cFN0cmF0ZWd5Xy5oaXRUZXN0KGV2ZW50QXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGV2ZW50QXJncy5wYWdlWDtcbiAgICAgICAgICAgIHZhciB0b3AgPSBldmVudEFyZ3MucGFnZVk7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKCk7XG4gICAgICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXQgPSBsYXlvdXRJbmZvW1ZJRVdQT1JUXTtcbiAgICAgICAgICAgIHZhciBjb2x1bW5IZWFkZXJMYXlvdXQgPSBsYXlvdXRJbmZvW0NPTFVNTl9IRUFERVJdO1xuICAgICAgICAgICAgdmFyIHJvd0hlYWRlckxheW91dCA9IGxheW91dEluZm9bUk9XX0hFQURFUl07XG4gICAgICAgICAgICB2YXIgY29ybmVySGVhZGVyTGF5b3V0ID0gbGF5b3V0SW5mb1tDT1JORVJfSEVBREVSXTtcbiAgICAgICAgICAgIHZhciBncm91cERyYWdQYW5lbExheW91dCA9IHNlbGYub3B0aW9ucy5hbGxvd0dyb3VwaW5nID8gbGF5b3V0SW5mb1tHUk9VUF9EUkFHX1BBTkVMXSA6IG51bGw7XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXJJbmZvID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0TGVmdCA9IGxlZnQgLSBjb250YWluZXJJbmZvLmxlZnQ7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gdG9wIC0gY29udGFpbmVySW5mby50b3A7XG5cbiAgICAgICAgICAgIHZhciBwYW5lbE9mZnNldDtcbiAgICAgICAgICAgIHZhciBjZWxsRWxlbWVudDtcbiAgICAgICAgICAgIHZhciBjZWxsT2Zmc2V0O1xuICAgICAgICAgICAgdmFyIGNlbGxUb3A7XG4gICAgICAgICAgICB2YXIgY29scyA9IGdyaWQuY29sdW1ucztcbiAgICAgICAgICAgIHZhciBjb2xMZW4gPSBjb2xzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSAtMTtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgIHZhciBhY3RJbmRleDtcbiAgICAgICAgICAgIHZhciBhY3RMZW47XG4gICAgICAgICAgICB2YXIgYWN0aW9uO1xuICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0VG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHN0YXJ0Um93UG9zaXRpb247XG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wTGVmdDtcbiAgICAgICAgICAgIHZhciBncm91cEluZm87XG4gICAgICAgICAgICB2YXIgcm93SW5mbztcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgICAgIHZhciBpblRyZWVOb2RlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChjb250YWluc18odmlld3BvcnRMYXlvdXQsIHBvaW50KSkge1xuICAgICAgICAgICAgICAgIG9mZnNldExlZnQgPSBvZmZzZXRMZWZ0IC0gY29sdW1uSGVhZGVyTGF5b3V0LndpZHRoICsgZ3JpZC5zY3JvbGxPZmZzZXQubGVmdDtcbiAgICAgICAgICAgICAgICBvZmZzZXRUb3AgPSBvZmZzZXRUb3AgLSByb3dIZWFkZXJMYXlvdXQuaGVpZ2h0ICsgZ3JpZC5zY3JvbGxPZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIG9mZnNldFRvcCA9IG9mZnNldFRvcCAtIChzZWxmLm9wdGlvbnMuYWxsb3dHcm91cGluZyA/IGdyb3VwRHJhZ1BhbmVsTGF5b3V0LmhlaWdodCA6IDApO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dyb3VwXyhncmlkKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydFJvd1Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wTGVmdCA9IG9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyaWQuZGF0YS5ncm91cHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbyA9IGdyaWQuZ3JvdXBJbmZvc19baV07XG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mbyA9IGhpdFRlc3RHcm91cF8uY2FsbChzZWxmLCBncm91cEluZm8sIG9mZnNldFRvcExlZnQsIHN0YXJ0Um93UG9zaXRpb24sIG9mZnNldExlZnQsIG9mZnNldFRvcCwgVklFV1BPUlQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpdFRlc3RJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3BMZWZ0IC09IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFJvd1Bvc2l0aW9uICs9IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dJbmZvID0gZ2V0Um93SW5mb0F0Xy5jYWxsKHRoaXMsIHtsZWZ0OiBvZmZzZXRMZWZ0fSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gcm93SW5mby5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Um93UG9zaXRpb24gPSByb3dJbmZvLnN0YXJ0UG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0TGVmdEZyb21DdXJyZW50Um93ID0gb2Zmc2V0TGVmdCAtIHN0YXJ0Um93UG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93U2VsZWN0b3IgPSBncmlkLnVpZCArICctcicgKyByb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJvd1NlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb25FbGVtZW50cztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCAtPSAocm93RWxlbWVudC5zdHlsZS50b3AgPyBwYXJzZUZsb2F0KHJvd0VsZW1lbnQuc3R5bGUudG9wKSA6IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbExlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEVsZW1lbnQgPSByb3dFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jJyArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudCAmJiBwb2ludEluXyhvZmZzZXRMZWZ0RnJvbUN1cnJlbnRSb3csIG9mZnNldFRvcCwgY2VsbEVsZW1lbnQsIHJvd0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbiA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlRWxlbWVudCA9IGNlbGxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYy10cmVlLW5vZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVFbGVtZW50ICYmIHBvaW50SW5fLmNhbGwoc2VsZiwgb2Zmc2V0TGVmdEZyb21DdXJyZW50Um93LCBvZmZzZXRUb3AsIG5vZGVFbGVtZW50LCByb3dFbGVtZW50LCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5UcmVlTm9kZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xzW2ldLmFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uRWxlbWVudHMgPSBjZWxsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGFjdEluZGV4ID0gMCwgYWN0TGVuID0gYWN0aW9uRWxlbWVudHMubGVuZ3RoOyBhY3RJbmRleCA8IGFjdExlbjsgYWN0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb2ludEluXyhvZmZzZXRMZWZ0RnJvbUN1cnJlbnRSb3csIG9mZnNldFRvcCwgYWN0aW9uRWxlbWVudHNbYWN0SW5kZXhdLCByb3dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBncmlkLmdldEFjdGlvbkhhbmRsZXJfKGNvbHNbaV0uaWQsIGFjdGlvbkVsZW1lbnRzW2FjdEluZGV4XS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4gPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gaGl0VGVzdFRvdWNoUGFuZWxfKGdyaWQsIGNvbHMsIG9mZnNldExlZnRGcm9tQ3VycmVudFJvdywgb2Zmc2V0VG9wLCByb3dFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBjb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5UcmVlTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmluVHJlZU5vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGFpbnNfKGNvbHVtbkhlYWRlckxheW91dCwgcG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IHJvd0hlYWRlckxheW91dC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IChzZWxmLm9wdGlvbnMuYWxsb3dHcm91cGluZyA/IGdyb3VwRHJhZ1BhbmVsTGF5b3V0LmhlaWdodCA6IDApO1xuICAgICAgICAgICAgICAgIHZhciBpbkNvbHVtbkhlYWRlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2xMZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sc1tpXS52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYW5lbE9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkICsgJy0nICsgQ09MVU1OX0hFQURFUikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIGdyaWQudWlkICsgJy0nICsgQ09MVU1OX0hFQURFUiArICcgLmdjLWNvbHVtbi1oZWFkZXItY2VsbC5jJyArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbE9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGNlbGxFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsVG9wID0gY2VsbE9mZnNldC50b3AgLSBwYW5lbE9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxFbGVtZW50U3R5bGUgPSBkb21VdGlsLmdldFN0eWxlKGNlbGxFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFkZGluZ0xlZnQgPSBwYXJzZVN0eWxlUHJvcGVydHlWYWx1ZV8oY2VsbEVsZW1lbnRTdHlsZSwgUEFERElOR19MRUZUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFkZGluZ1JpZ2h0ID0gcGFyc2VTdHlsZVByb3BlcnR5VmFsdWVfKGNlbGxFbGVtZW50U3R5bGUsIFBBRERJTkdfUklHSFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPj0gY2VsbFRvcCAmJiBvZmZzZXRUb3AgPD0gY2VsbFRvcCArIGNlbGxFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNvbHVtbkhlYWRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogQ09MVU1OX0hFQURFUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pblJlc2l6ZU1vZGU6IChjZWxsVG9wICsgY2VsbEVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gb2Zmc2V0VG9wKSA8PSA0LCAvL1RPRE86IHdoeSBpdCBpcyA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNpemVGcm9tWmVybzogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChjZWxsRWxlbWVudC5jbGllbnRXaWR0aCAtIHBhZGRpbmdMZWZ0IC0gcGFkZGluZ1JpZ2h0KSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsVG9wIDwgb2Zmc2V0VG9wICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjZWxsVG9wICsgUkVTSVpFX0dBUF9TSVpFKSA+IG9mZnNldFRvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNvbHVtbkhlYWRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogQ09MVU1OX0hFQURFUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pblJlc2l6ZU1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNpemVGcm9tWmVybzogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFpbkNvbHVtbkhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250YWluc18ocm93SGVhZGVyTGF5b3V0LCBwb2ludCkpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRUb3AgLT0gKHNlbGYub3B0aW9ucy5hbGxvd0dyb3VwaW5nID8gZ3JvdXBEcmFnUGFuZWxMYXlvdXQuaGVpZ2h0IDogMCk7XG4gICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCA9IG9mZnNldExlZnQgLSBjb2x1bW5IZWFkZXJMYXlvdXQud2lkdGggKyBncmlkLnNjcm9sbE9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgIGlmIChoYXNHcm91cF8oZ3JpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRSb3dQb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcExlZnQgPSBvZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncmlkLmRhdGEuZ3JvdXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncmlkLmdyb3VwSW5mb3NfW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mbyA9IGhpdFRlc3RHcm91cF8uY2FsbCh0aGlzLCBncm91cEluZm8sIG9mZnNldFRvcExlZnQsIHN0YXJ0Um93UG9zaXRpb24sIG9mZnNldExlZnQsIG9mZnNldFRvcCwgUk9XX0hFQURFUik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGl0VGVzdEluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcExlZnQgLT0gZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Um93UG9zaXRpb24gKz0gZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0luZm8gPSBnZXRSb3dJbmZvQXRfLmNhbGwodGhpcywge2xlZnQ6IG9mZnNldExlZnR9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IFJPV19IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiByb3dJbmZvLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFsbG93SGVhZGVyU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLXJoJyArIHJvd0luZm8uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSByZWxhdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdjLWhlYWRlci1zZWxlY3QtaWNvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIHBvaW50SW5fLmNhbGwoc2VsZiwgb2Zmc2V0TGVmdCAtIHJvd0luZm8uc3RhcnRQb3NpdGlvbiwgb2Zmc2V0VG9wLCBlbGVtZW50LCByZWxhdGl2ZUVsZW1lbnQsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGFpbnNfKGNvcm5lckhlYWRlckxheW91dCwgcG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0VG9wID0gb2Zmc2V0VG9wIC0gKHNlbGYub3B0aW9ucy5hbGxvd0dyb3VwaW5nID8gZ3JvdXBEcmFnUGFuZWxMYXlvdXQuaGVpZ2h0IDogMCk7XG4gICAgICAgICAgICAgICAgaGl0VGVzdEluZm8gPSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IENPUk5FUl9IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbjogLTFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dIZWFkZXJTZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLWNvcm5lcicpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gcmVsYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYy1oZWFkZXItc2VsZWN0LWljb24nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgcG9pbnRJbl8uY2FsbChzZWxmLCBvZmZzZXRMZWZ0LCBvZmZzZXRUb3AsIGVsZW1lbnQsIHJlbGF0aXZlRWxlbWVudCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dHcm91cGluZyAmJiBjb250YWluc18oZ3JvdXBEcmFnUGFuZWxMYXlvdXQsIHBvaW50KSkge1xuICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9EUkFHX1BBTkVMLFxuICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBEZXNjcmlwdG9ycyA9IGdyaWQuZGF0YS5ncm91cERlc2NyaXB0b3JzO1xuICAgICAgICAgICAgICAgIHZhciBwYW5lbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctJyArIEdST1VQX0RSQUdfUEFORUwpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwRGVzY3JpcHRvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctZ3JvdXBpbmctaW5kaWNhdG9yLScgKyBncm91cERlc2NyaXB0b3JzW2ldLmZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxFbGVtZW50ICYmIHBvaW50SW5fKG9mZnNldExlZnQsIG9mZnNldFRvcCwgY2VsbEVsZW1lbnQsIHBhbmVsRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmdyb3VwaW5nUGFuZWxJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBncm91cERlc2NyaXB0b3JzW2ldLmZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50SW5fKG9mZnNldExlZnQsIG9mZnNldFRvcCwgY2VsbEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdjLWdyb3VwaW5nLXRpdGxlJyksIHBhbmVsRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXRUZXN0SW5mby5ncm91cGluZ1BhbmVsSW5mby5hY3Rpb24gPSAncmVvcmRlcic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBjZWxsRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2MtaWNvbi1ncm91cGluZy1kZWxldGUnKSwgcGFuZWxFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvLmdyb3VwaW5nUGFuZWxJbmZvLmFjdGlvbiA9ICdkZWxldGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGl0VGVzdEluZm87XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVuZGVyUm93SW5mb186IGZ1bmN0aW9uKHJvdywgYXJlYSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzY29wZS5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5ncm91cFN0cmF0ZWd5Xy5nZXRSZW5kZXJSb3dJbmZvXyhyb3csIGFyZWEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdWlkID0gc2NvcGUuZ3JpZC51aWQ7XG4gICAgICAgICAgICB2YXIgaGFzR3JvdXAgPSBoYXNHcm91cF8oc2NvcGUuZ3JpZCk7XG5cbiAgICAgICAgICAgIGlmIChhcmVhID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFydCA9IHJvdy5hcmVhO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyckluZm8gPSByb3cuaW5mbztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mbyA9IHNjb3BlLmdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEdyb3VwSGVhZGVyUm93LmNhbGwoc2NvcGUsIHJvdy5rZXksIGN1cnJJbmZvLCBncm91cEluZm8sIHJvdy53aWR0aCwgcm93LmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09IEdST1VQX0NPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRHcm91cENvbnRlbnRSb3cuY2FsbChzY29wZSwgcm93LmtleSwgY3VyckluZm8uaXRlbUluZGV4LCBncm91cEluZm8sIHJvdy5oZWlnaHQsIHJvdy5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRHcm91cEZvb3RlclJvdy5jYWxsKHNjb3BlLCByb3cua2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCByb3cubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUm93UmVuZGVySW5mb18uY2FsbChzY29wZSwgcm93LmluZGV4LCByb3cuaGVpZ2h0LCB1aWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJlYSA9PT0gUk9XX0hFQURFUikge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSByb3cua2V5O1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gaGFzR3JvdXAgPyByb3cubGVmdCA6IHJvdy5pbmRleCAqIHJvdy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGlzUm93Um9sZSA9IGhhc0dyb3VwID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSByb3cuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkSGVhZGVyQ2VsbF8uY2FsbChzY29wZSwga2V5LCByb3cuaW5mbywgaXNSb3dSb2xlLCBsZWZ0LCBoZWlnaHQsIHJvdy5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVuZGVyUmFuZ2VfOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNjb3BlLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwU3RyYXRlZ3lfLmdldFJlbmRlclJhbmdlXyhvcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFyZWEgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFyZWEpIHx8ICcnO1xuICAgICAgICAgICAgaWYgKCFhcmVhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBnZXRSb3dzUmVuZGVySW5mb18uY2FsbChzY29wZSwgYXJlYSwgb3B0aW9ucyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTY3JvbGxhYmxlQXJlYV86IGZ1bmN0aW9uKGFyZWEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uaXNTY3JvbGxhYmxlQXJlYV8oYXJlYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJlYSA9PT0gVklFV1BPUlQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVnaXN0ZUV2ZW50c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICBzZWxmLmhhbmRsZU1vdXNlTW92ZUZuXyA9IGhhbmRsZU1vdXNlTW92ZV8uYmluZChncmlkKTtcbiAgICAgICAgICAgIHNlbGYuaGFuZGxlVG91Y2hNb3ZlRm5fID0gaGFuZGxlVG91Y2hNb3ZlXy5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVUb3VjaEVuZEZuXyA9IGhhbmRsZVRvdWNoRW5kXy5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVTd2lwZUZuXyA9IGhhbmRsZVN3aXBlXy5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVTY3JvbGxUb3VjaEZuXyA9IGhhbmRsZVRvdWNoU2Nyb2xsLmJpbmQoZ3JpZCk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VDbGljay5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlQ2xpY2tfKTtcbiAgICAgICAgICAgIC8vZ3JpZC5vbk1vdXNlRGJDbGljay5hZGRIYW5kbGVyKGhhbmRsZU1vdXNlRG91YmxlQ2xpY2spO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlTW92ZS5hZGRIYW5kbGVyKHNlbGYuaGFuZGxlTW91c2VNb3ZlRm5fKTtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZVdoZWVsLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VXaGVlbCk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VEb3duLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VEb3duKTtcbiAgICAgICAgICAgIGdyaWQub25Ub3VjaFN0YXJ0Xy5hZGRIYW5kbGVyKGhhbmRsZVRvdWNoU3RhcnQpO1xuICAgICAgICAgICAgZ3JpZC5vblRvdWNoTW92ZV8uYWRkSGFuZGxlcihzZWxmLmhhbmRsZVRvdWNoTW92ZUZuXyk7XG4gICAgICAgICAgICBncmlkLm9uVG91Y2hFbmRfLmFkZEhhbmRsZXIoc2VsZi5oYW5kbGVUb3VjaEVuZEZuXyk7XG4gICAgICAgICAgICBncmlkLm9uU3dpcGVfLmFkZEhhbmRsZXIoc2VsZi5oYW5kbGVTd2lwZUZuXyk7XG4gICAgICAgICAgICBncmlkLm9uVG91Y2hTY3JvbGxfLmFkZEhhbmRsZXIoc2VsZi5oYW5kbGVTY3JvbGxUb3VjaEZuXyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5SZWdpc3RlRXZlbnRzXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIC8vZ3JpZC5vbk1vdXNlRGJDbGljay5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlRG91YmxlQ2xpY2spO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlQ2xpY2sucmVtb3ZlSGFuZGxlcihoYW5kbGVNb3VzZUNsaWNrXyk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VNb3ZlLnJlbW92ZUhhbmRsZXIoc2VsZi5oYW5kbGVNb3VzZU1vdmVGbl8pO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlV2hlZWwucmVtb3ZlSGFuZGxlcihoYW5kbGVNb3VzZVdoZWVsKTtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZURvd24ucmVtb3ZlSGFuZGxlcihoYW5kbGVNb3VzZURvd24pO1xuICAgICAgICAgICAgZ3JpZC5vblRvdWNoU3RhcnRfLnJlbW92ZUhhbmRsZXIoaGFuZGxlVG91Y2hTdGFydCk7XG4gICAgICAgICAgICBncmlkLm9uVG91Y2hNb3ZlXy5yZW1vdmVIYW5kbGVyKHNlbGYuaGFuZGxlVG91Y2hNb3ZlRm5fKTtcbiAgICAgICAgICAgIGdyaWQub25Ub3VjaEVuZF8ucmVtb3ZlSGFuZGxlcihzZWxmLmhhbmRsZVRvdWNoRW5kRm5fKTtcbiAgICAgICAgICAgIGdyaWQub25Td2lwZV8ucmVtb3ZlSGFuZGxlcihzZWxmLmhhbmRsZVN3aXBlRm5fKTtcbiAgICAgICAgICAgIGdyaWQub25Ub3VjaFNjcm9sbF8ucmVtb3ZlSGFuZGxlcihzZWxmLmhhbmRsZVNjcm9sbFRvdWNoRm5fKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhclJlbmRlckNhY2hlXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VsZi5ncm91cFN0cmF0ZWd5Xykge1xuICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXBTdHJhdGVneV8uY2xlYXJSZW5kZXJDYWNoZV8oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYubGF5b3V0SW5mb18gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5jYWNoZWRWaWV3cG9ydExheW91dEluZm9fID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuZ3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvXyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLmNvbHVtbkhlYWRlckhUTUwgPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5jYWNoZWRUbXBsRm5fID0gbnVsbDtcbiAgICAgICAgICAgIC8vVE9ETzogZmluZCBhIG1vcmUgZ29vZCBsb2NhdGlvbiB0byBjYWxsIHRoZSBmb2xsb3dpbmcgbWV0aG9kLCB3ZSBuZWVkIHVwZGF0ZSBjb2x1bW4gc2l6ZSBpZiB0ZW1wbGF0ZSBjaGFuZ2VkLlxuICAgICAgICAgICAgdXBkYXRlU3RhcnRTaXplXy5jYWxsKHNlbGYpO1xuICAgICAgICAgICAgY29uc29saWRhdGVDb2x1bW5XaWR0aF8uY2FsbChzZWxmKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHcm91cEluZm9EZWZhdWx0c186IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncm91cFN0cmF0ZWd5Xy5nZXRHcm91cEluZm9EZWZhdWx0c18oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZm9vdGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlV2l0aEdyb3VwOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEdyb3VwSW5mb3NIZWlnaHRfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZWxmLmdyb3VwU3RyYXRlZ3lfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ3JvdXBTdHJhdGVneV8uaW5pdEdyb3VwSW5mb3NIZWlnaHRfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcyA9IHNlbGYuZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGdyb3VwSW5mb3NbaV0uaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEhlaWdodF8oZ3JvdXBJbmZvc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0R3JvdXBIZWlnaHRfOiBmdW5jdGlvbihncm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWdjVXRpbHMuaXNVbmRlZmluZWQoZ3JvdXBJbmZvLmhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JvdXBJbmZvLmhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuaGVhZGVyO1xuICAgICAgICAgICAgaWYgKGhlYWRlciAmJiBoZWFkZXIudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGhlaWdodCArPSBzZWxmLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBsZW47XG4gICAgICAgICAgICB2YXIgZm9vdGVyO1xuICAgICAgICAgICAgdmFyIGNoaWxkR3JvdXA7XG4gICAgICAgICAgICBpZiAoIWdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgIGxlbiA9IGdyb3VwLmlzQm90dG9tTGV2ZWwgPyBncm91cC5pdGVtQ291bnQgOiBncm91cEluZm8uY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHNlbGYuZ2V0Um93SGVpZ2h0Xyhncm91cC5nZXRJdGVtKGkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR3JvdXAgPSBncm91cEluZm8uY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdyb3VwLmhlaWdodCA9IHNlbGYuZ2V0R3JvdXBIZWlnaHRfKGNoaWxkR3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IGNoaWxkR3JvdXAuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGhlaWdodCArPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvb3RlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgICAgICAgICAgaWYgKGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSAmJiAhZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHcm91cEhlYWRlckhlaWdodF86IGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmhlYWRlcjtcbiAgICAgICAgICAgIHJldHVybiAoaGVhZGVyICYmIGhlYWRlci52aXNpYmxlKSA/IChoZWFkZXIuaGVpZ2h0IHx8IHRoaXMub3B0aW9ucy5jb2xXaWR0aCkgOiAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdyb3VwRm9vdGVySGVpZ2h0XzogZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICAgICAgcmV0dXJuIChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUpID8gKGZvb3Rlci5oZWlnaHQgfHwgdGhpcy5vcHRpb25zLnJvd0hlaWdodCkgOiAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhpdFRlc3RHcm91cENvbnRlbnRfOiBmdW5jdGlvbihncm91cEluZm8sIGFyZWEsIG9mZnNldExlZnQsIG9mZnNldFRvcCwgY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCB8fCBvZmZzZXRMZWZ0IDwgMCB8fCBvZmZzZXRUb3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdWlkID0gc2VsZi5ncmlkLnVpZDtcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIHJvd0hlaWdodCA9IGdldEdyb3VwSXRlbVJvd0hlaWdodF8uY2FsbChzZWxmKTtcbiAgICAgICAgICAgIHZhciBoaXRHcm91cEluZm87XG4gICAgICAgICAgICB2YXIgcmVsYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgZ3JvdXBQYXRoID0gZ3JvdXBJbmZvLnBhdGg7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIG9mZnNldExlZnQgKz0gY29udGFpbmVyU2l6ZS5zY3JvbGxMZWZ0ID8gY29udGFpbmVyU2l6ZS5zY3JvbGxMZWZ0IDogMDtcbiAgICAgICAgICAgICAgICBvZmZzZXRUb3AgKz0gY29udGFpbmVyU2l6ZS5zY3JvbGxUb3AgPyBjb250YWluZXJTaXplLnNjcm9sbFRvcCA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cC5pdGVtQ291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0IDw9IHJvd0hlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJlYSA9PT0gUk9XX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGl0R3JvdXBJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IFJPV19IRUFERVIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5ULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFsbG93SGVhZGVyU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5ncmlkLnVpZCArICctZ3JoJyArIGdyb3VwUGF0aC5qb2luKCctJykgKyAnLXInICsgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IHJlbGF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2MtaGVhZGVyLXNlbGVjdC1pY29uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgcG9pbnRJbl8uY2FsbChzZWxmLCBvZmZzZXRMZWZ0LCBvZmZzZXRUb3AsIGVsZW1lbnQsIHJlbGF0aXZlRWxlbWVudCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0R3JvdXBJbmZvLmdyb3VwSW5mby5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0R3JvdXBJbmZvO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodWlkICsgJy1ncicgKyBncm91cFBhdGguam9pbignXycpICsgJy1yJyArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWxhdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5ULFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdEdyb3VwSW5mbyA9IGhpdFRlc3RHcm91cFJvd0NvbHVtbnNfLmNhbGwoc2VsZiwgZ3JvdXBQYXRoLCBpLCByZWxhdGl2ZUVsZW1lbnQsIG9mZnNldExlZnQsIG9mZnNldFRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0R3JvdXBJbmZvO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9mZnNldExlZnQgLT0gcm93SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Um93SGVpZ2h0XzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJvd0hlaWdodDtcbiAgICAgICAgfSxcblxuICAgICAgICBzdGFydEVkaXRpbmdfOiBmdW5jdGlvbihncm91cEluZm8sIHVpUm93SW5kZXgsIHRlbXBsYXRlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZWRpdE1vZGUgPSBzZWxmLm9wdGlvbnMuZWRpdE1vZGU7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBlZGl0aW5nSGFuZGxlciA9IGdyaWQuZWRpdGluZ0hhbmRsZXI7XG4gICAgICAgICAgICB2YXIgZWRpdENvbnRhaW5lcjtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGdyaWQudWlkICsgKGdyb3VwSW5mbyA/ICgnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSkgOiAnJykgKyAnLXInICsgdWlSb3dJbmRleDtcbiAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3Rvcik7XG4gICAgICAgICAgICB2YXIgcm93UmVjdCA9IGRvbVV0aWwuZ2V0RWxlbWVudFJlY3Qocm93KTtcbiAgICAgICAgICAgIHZhciB2aWV3cG9ydFJlY3QgPSBkb21VdGlsLmdldEVsZW1lbnRSZWN0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkICsgJy12aWV3cG9ydCcpKTtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbmd0aDtcblxuICAgICAgICAgICAgc2VsZi5jb250YWluZXJLZXlEb3duSGFuZGxlcl8gPSBlZGl0aW5nSGFuZGxlci5jb250YWluZXJLZXlEb3duSGFuZGxlci5iaW5kKGVkaXRpbmdIYW5kbGVyKTtcbiAgICAgICAgICAgIHNlbGYuY29udGFpbmVyTW91c2VEb3duSGFuZGxlcl8gPSBlZGl0aW5nSGFuZGxlci5jb250YWluZXJNb3VzZURvd25IYW5kbGVyLmJpbmQoZWRpdGluZ0hhbmRsZXIpO1xuICAgICAgICAgICAgc2VsZi5jb250YWluZXJDbGlja0hhbmRsZXJfID0gZWRpdGluZ0hhbmRsZXIuY29udGFpbmVyQ2xpY2tIYW5kbGVyLmJpbmQoZWRpdGluZ0hhbmRsZXIpO1xuXG4gICAgICAgICAgICBpZiAoZWRpdE1vZGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlubGluZUZyYWdtZW50ID0gZWRpdGluZ0hhbmRsZXIuZ2V0SW5saW5lRnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IGlkPVwiJyArIGdyaWQudWlkICsgJy1pbmxpbmUtZWRpdGluZy1hcmVhXCIgY2xhc3M9XCJnYy1pbmxpbmUtZWRpdGluZy1hcmVhIGdjLWVkaXRpbmctYXJlYVwiIHN0eWxlPVwidG9wOicgKyB2aWV3cG9ydFJlY3QudG9wICsgJ3B4O2xlZnQ6JyArIHJvd1JlY3QubGVmdCArXG4gICAgICAgICAgICAgICAgICAgICdweDsgaGVpZ2h0OicgKyB2aWV3cG9ydFJlY3QuaGVpZ2h0ICsgJ3B4O1wiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgIHZhciBpbm5lckNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBpZD1cIicgKyBncmlkLnVpZCArICctaW5saW5lLWVkaXRpbmctYXJlYS1pbm5lclwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7dG9wOicgKyAocm93UmVjdC50b3AgLSB2aWV3cG9ydFJlY3QudG9wKSArICdweDtcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICBpbm5lckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbmxpbmVGcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5hcHBlbmRDaGlsZChpbm5lckNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5jb250YWluZXJLZXlEb3duSGFuZGxlcl8pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWRpdENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIGlubGluZUVkaXRvcnMgPSBlZGl0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYy1pbmxpbmUtZWRpdG9yLWNvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHJlY3Q7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gaW5saW5lRWRpdG9ycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZWN0ID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdChpbmxpbmVFZGl0b3JzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBNYXRoLm1heCh3aWR0aCwgcmVjdC5sZWZ0IC0gcm93UmVjdC5sZWZ0ICsgcmVjdC53aWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVkaXRNb2RlID09PSAncG9wdXAnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRQb3B1cE92ZXJsYXkgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgY2xhc3M9XCJnYy1lZGl0aW5nLW92ZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IGlkPVwiJyArIGdyaWQudWlkICsgJy1wb3B1cC1lZGl0aW5nLWFyZWFcIiBjbGFzcz1cImdjLXBvcHVwLWVkaXRpbmctYXJlYSBnYy1lZGl0aW5nLWFyZWFcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJnYy1lZGl0aW5nLWhlYWRlclwiPjxzcGFuIGNsYXNzPVwiaGVhZGVyLXRleHRcIj5FZGl0IEZvcm08L3NwYW4+PGRpdiBjbGFzcz1cImdjLWVkaXRpbmctY2xvc2VcIj48c3BhbiBjbGFzcz1cImdjLWljb24gY2xvc2UtaWNvblwiPjwvc3Bhbj48L2Rpdj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJnYy1lZGl0aW5nLWNvbnRlbnRcIj4nICsgdGVtcGxhdGUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZ2MtZWRpdGluZy1mb290ZXJcIj48ZGl2IGNsYXNzPVwiZ2MtZWRpdGluZy1jYW5jZWwgZ2MtZWRpdGluZy1idXR0b25cIj48c3BhbiBjbGFzcz1cImNhbmNlbC10ZXh0XCI+Q2FuY2VsPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XCJnYy1lZGl0aW5nLXVwZGF0ZSBnYy1lZGl0aW5nLWJ1dHRvblwiPjxzcGFuIGNsYXNzPVwidXBkYXRlLXRleHRcIj5VcGRhdGU8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzZWxmLmNvbnRhaW5lcktleURvd25IYW5kbGVyXyk7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzZWxmLmNvbnRhaW5lck1vdXNlRG93bkhhbmRsZXJfKTtcbiAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi5jb250YWluZXJDbGlja0hhbmRsZXJfKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVkaXRDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWRpdFBvcHVwT3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBkb21VdGlsLmdldEVsZW1lbnRSZWN0KGVkaXRDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0ID0gcGFyc2VJbnQoKHdpbmRvdy5pbm5lcldpZHRoIC0gY29udGFpbmVyUmVjdC53aWR0aCkgLyAyICsgd2luZG93LnBhZ2VYT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gcGFyc2VJbnQoKHdpbmRvdy5pbm5lckhlaWdodCAtIGNvbnRhaW5lclJlY3QuaGVpZ2h0KSAvIDIgKyB3aW5kb3cucGFnZVlPZmZzZXQpO1xuICAgICAgICAgICAgICAgIGRvbVV0aWwuc2V0Q3NzKGVkaXRDb250YWluZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3BcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWRpdE1vZGUgPT09ICdlZGl0Rm9ybScpIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93SGVhZGVyV2lkdGggPSBncmlkLm9wdGlvbnMucm93SGVhZGVyV2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIHZpZXdwb3J0SW5uZXJSZWN0ID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncmlkLnVpZCArICctdmlld3BvcnQtaW5uZXInKSk7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cIm92ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6JyArICh2aWV3cG9ydFJlY3QudG9wIC0gcm93SGVhZGVyV2lkdGgpICsgJ3B4OycgK1xuICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0OicgKyAodmlld3BvcnRJbm5lclJlY3QuaGVpZ2h0ICsgcm93SGVhZGVyV2lkdGgpICsgJ3B4O21heC1oZWlnaHQ6JyArICh2aWV3cG9ydFJlY3QuaGVpZ2h0ICsgcm93SGVhZGVyV2lkdGgpICsgJ3B4O1wiIGlkPVwiJyArIGdyaWQudWlkICsgJy1mb3JtLWVkaXRpbmctYXJlYVwiIGNsYXNzPVwiZ2MtZm9ybS1lZGl0aW5nLWFyZWEgZ2MtZWRpdGluZy1hcmVhXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZ2MtZWRpdGluZy1jb250ZW50XCI+JyArIHRlbXBsYXRlICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImdjLWVkaXRpbmctZm9vdGVyXCI+PGRpdiBjbGFzcz1cImdjLWVkaXRpbmctY2FuY2VsIGdjLWVkaXRpbmctYnV0dG9uXCI+PHNwYW4gY2xhc3M9XCJjYW5jZWwtdGV4dFwiPkNhbmNlbDwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVwiZ2MtZWRpdGluZy11cGRhdGUgZ2MtZWRpdGluZy1idXR0b25cIj48c3BhbiBjbGFzcz1cInVwZGF0ZS10ZXh0XCI+VXBkYXRlPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5jb250YWluZXJLZXlEb3duSGFuZGxlcl8pO1xuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2VsZi5jb250YWluZXJNb3VzZURvd25IYW5kbGVyXyk7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGYuY29udGFpbmVyQ2xpY2tIYW5kbGVyXyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlZGl0Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZFJvd3MgPSBncmlkLmxhc3RSZW5kZXJlZFJvd3NfLnZpZXdwb3J0O1xuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZEhlYWRlcnMgPSBncmlkLmxhc3RSZW5kZXJlZFJvd3NfLnJvd0hlYWRlcjtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IHJlbmRlcmVkUm93cy5pbmRleE9mKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICB2YXIgZm9ybVdpZHRoID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdChlZGl0Q29udGFpbmVyKS53aWR0aDtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcFJvdztcbiAgICAgICAgICAgICAgICB2YXIgdGVtcEhlYWRlcjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdmFsaWFibGVXaWR0aF8gPSB2aWV3cG9ydFJlY3Qud2lkdGggLSByb3dSZWN0LndpZHRoIC0gKHJvd1JlY3QubGVmdCAtIHZpZXdwb3J0UmVjdC5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgYXZhaWxhYmxlSGVpZ2h0XyA9IHZpZXdwb3J0UmVjdC5oZWlnaHQgLSByb3dSZWN0LmhlaWdodCAtIChyb3dSZWN0LnRvcCAtIHZpZXdwb3J0UmVjdC50b3ApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3BEaXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXZhbGlhYmxlV2lkdGhfIDwgZm9ybVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlIGlzIG5vIGVub3VnaCBzcGFjZSB0byBkaXNwbGF5LCBzb21lIHJvd3MgbW92ZSB1cHdhcmQuXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGZvcm1XaWR0aCAtIGF2YWxpYWJsZVdpZHRoXztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPD0gc3RhcnRJbmRleDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJlbmRlcmVkUm93c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJlbmRlcmVkSGVhZGVyc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wRGlzdCA9IE1hdGguY2VpbChwYXJzZUludCh0ZW1wUm93LnN0eWxlLmxlZnQpIC0gZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBSb3cuc3R5bGUubGVmdCA9IHRvcERpc3QgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBIZWFkZXIuc3R5bGUubGVmdCA9IHRvcERpc3QgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5zdHlsZS5sZWZ0ID0gTWF0aC5jZWlsKHJvd1JlY3QubGVmdCArIHJvd1JlY3Qud2lkdGggLSBkaXN0YW5jZSkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSBpcyBlbm91Z2ggc3BhY2UsIHNvbWUgcm93cyBtb3ZlIGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IHN0YXJ0SW5kZXggKyAxLCBsZW5ndGggPSByZW5kZXJlZFJvd3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVuZGVyZWRSb3dzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wSGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVuZGVyZWRIZWFkZXJzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUm93LnN0eWxlLmxlZnQgPSAocGFyc2VJbnQodGVtcFJvdy5zdHlsZS5sZWZ0KSArIGZvcm1XaWR0aCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBIZWFkZXIuc3R5bGUubGVmdCA9IChwYXJzZUludCh0ZW1wSGVhZGVyLnN0eWxlLmxlZnQpICsgZm9ybVdpZHRoKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyLnN0eWxlLmxlZnQgPSBNYXRoLmNlaWwocm93UmVjdC5sZWZ0ICsgcm93UmVjdC53aWR0aCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFlZGl0Q29udGFpbmVyLnRhYkluZGV4IHx8IGVkaXRDb250YWluZXIudGFiSW5kZXggPCAwKSB7IC8vT25seSBmb2N1c2FibGUgZWxlbWVudCBjYW4gYmUgYm91bmQga2V5ZG93biBldmVudC5cbiAgICAgICAgICAgICAgICBlZGl0Q29udGFpbmVyLnRhYkluZGV4ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdG9wRWRpdGluZ186IGZ1bmN0aW9uKHZhbHVlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICB2YXIgZWRpdGluZ0hhbmRsZXIgPSBncmlkLmVkaXRpbmdIYW5kbGVyO1xuICAgICAgICAgICAgdmFyIGVkaXRNb2RlID0gc2VsZi5vcHRpb25zLmVkaXRNb2RlO1xuICAgICAgICAgICAgdmFyIHVpZCA9IGdyaWQudWlkO1xuICAgICAgICAgICAgdmFyIGVkaXRDb250YWluZXI7XG4gICAgICAgICAgICBpZiAoZWRpdE1vZGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHVpZCArICctaW5saW5lLWVkaXRpbmctYXJlYScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlZGl0TW9kZSA9PT0gJ3BvcHVwJykge1xuICAgICAgICAgICAgICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdjLWVkaXRpbmctb3ZlcmxheScpO1xuICAgICAgICAgICAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQob3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLXBvcHVwLWVkaXRpbmctYXJlYScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlZGl0TW9kZSA9PT0gJ2VkaXRGb3JtJykge1xuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWZvcm0tZWRpdGluZy1hcmVhJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZWRpdENvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2VsZi5jb250YWluZXJNb3VzZURvd25IYW5kbGVyXyk7XG4gICAgICAgICAgICAgICAgZWRpdENvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc2VsZi5jb250YWluZXJLZXlEb3duSGFuZGxlcl8pO1xuICAgICAgICAgICAgICAgIGVkaXRDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxmLmNvbnRhaW5lckNsaWNrSGFuZGxlcl8pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWRpdENvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuY29udGFpbmVyS2V5RG93bkhhbmRsZXJfID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuY29udGFpbmVyTW91c2VEb3duSGFuZGxlcl8gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5jb250YWluZXJDbGlja0hhbmRsZXJfID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGVkaXRNb2RlID09PSAnZWRpdEZvcm0nKSB7XG4gICAgICAgICAgICAgICAgZ3JpZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZUNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyaWQuZGF0YS5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQudXBkYXRlR3JvdXBJbmZvc18oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRpbmdIYW5kbGVyLndob2xlQ29sdW1uQ2hhbmdlZF8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGVkaXRpbmdIYW5kbGVyLmVkaXRpbmdJbmZvXy5ncm91cEluZm87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5yZWZyZXNoUm93Xygndmlld3BvcnQnLCBncm91cEluZm8gPyBncm91cEluZm8ucGF0aCA6IG51bGwsIGVkaXRpbmdIYW5kbGVyLmVkaXRpbmdJbmZvXy5yb3dJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RGVmYXVsdEVkaXRvclRlbXBsYXRlXzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgICAgIHZhciBlZGl0aW5nSGFuZGxlciA9IGdyaWQuZWRpdGluZ0hhbmRsZXI7XG4gICAgICAgICAgICB2YXIgY29scyA9IGdyaWQuY29sdW1ucztcbiAgICAgICAgICAgIHZhciByID0gJzxkaXY+JztcbiAgICAgICAgICAgIF8uZWFjaChjb2xzLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdGluZ0hhbmRsZXIuaXNDb2x1bW5FZGl0YWJsZShncmlkLCBjb2wpKSB7XG4gICAgICAgICAgICAgICAgICAgIHIgKz0gJzxkaXY+PGRpdiBjbGFzcz1cImdjLWVkaXRpbmctdGVtcGxhdGUtbGFiZWxcIj48bGFiZWwgY2xhc3M9XCJjb250ZW50LXRleHRcIj4nICsgKGNvbC5jYXB0aW9uIHx8IGNvbC5pZCkgKyAnPC9sYWJlbD48L2Rpdj48ZGl2IGNsYXNzPVwiZ2MtZWRpdGluZy10ZW1wbGF0ZS1maWVsZFwiPjxpbnB1dCB0eXBlPVwiJyArIGVkaXRpbmdIYW5kbGVyLmdldEVkaXRvclR5cGUoY29sLmRhdGFUeXBlKSArICdcIiBkYXRhLWNvbHVtbj1cIicgKyBjb2wuaWQgKyAnXCI+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHIgKz0gJzwvZGl2Pic7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRJbm5lckdyb3VwV2lkdGg6IGZ1bmN0aW9uKGdyb3VwSW5mbywgY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Um93SGVpZ2h0XygpICogZ3JvdXBJbmZvLmRhdGEuaXRlbUNvdW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldElubmVyR3JvdXBIZWlnaHQ6IGZ1bmN0aW9uKGdyb3VwSW5mbywgY29udGFpbmVyU2l6ZSkge1xuICAgICAgICAgICAgLy9yZXR1cm4gY3NzIHN0eWxlIGhlaWdodCwgbm90IHRoZSBsb2dpYyBoZWlnaHQuXG4gICAgICAgICAgICBpZiAoIWdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29udGVudEhlaWdodF8odGhpcy5ncmlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRJbm5lckdyb3VwUmVuZGVySW5mbzogZnVuY3Rpb24oZ3JvdXBJbmZvLCBjb250YWluZXJTaXplLCBsYXlvdXRDYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICAgICAgdmFyIG9mZnNldExlZnQgPSAwO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuO1xuICAgICAgICAgICAgdmFyIHJvd0hlaWdodCA9IHNlbGYuZ2V0Um93SGVpZ2h0XygpO1xuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBsYXlvdXQ7XG4gICAgICAgICAgICB2YXIgYWRkaXRpb25hbFN0eWxlO1xuICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxDU1NDbGFzcztcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwLml0ZW1Db3VudDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxheW91dENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dCA9IGxheW91dENhbGxiYWNrKGdyb3VwSW5mbywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxDU1NDbGFzcyA9IGxheW91dC5jc3NDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFN0eWxlID0gbGF5b3V0LnN0eWxlIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUud2lkdGggPSBjb250YWluZXJTaXplLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGF5b3V0LmxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBpLCBncm91cEluZm8sIHJvd0hlaWdodCwgbGF5b3V0LmxvY2F0aW9uLmxlZnQsIGZhbHNlLCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldFJlbmRlcmVkR3JvdXBDb250ZW50SXRlbUluZm9fLmNhbGwoc2VsZiwgaSwgZ3JvdXBJbmZvLCByb3dIZWlnaHQsIG9mZnNldExlZnQsIGZhbHNlLCBhZGRpdGlvbmFsQ1NTQ2xhc3MsIGFkZGl0aW9uYWxTdHlsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0TGVmdCArPSByb3dIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsU3R5bGUgPSB7d2lkdGg6IGNvbnRhaW5lclNpemUud2lkdGh9O1xuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18uY2FsbChzZWxmLCBpLCBncm91cEluZm8sIHJvd0hlaWdodCwgb2Zmc2V0TGVmdCwgZmFsc2UsIG51bGwsIGFkZGl0aW9uYWxTdHlsZSkpO1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IHJvd0hlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRNYXhWaXNpYmxlSXRlbUNvdW50OiBmdW5jdGlvbihjb250YWluZXJTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihjb250YWluZXJTaXplLndpZHRoIC8gdGhpcy5nZXRSb3dIZWlnaHRfKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlbGYuZ3JvdXBTdHJhdGVneV8pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwU3RyYXRlZ3lfLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi51blJlZ2lzdGVFdmVudHNfKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlVGVtcGxhdGVDaGFuZ2VfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgfSxcblxuICAgICAgICBjYW5Eb1N3aXBlXzogZnVuY3Rpb24obW92ZURpcmVjdGlvbiwgZGVsdGFYLCBkZWx0YVkpIHtcbiAgICAgICAgICAgIHZhciBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4aXN0VG91Y2hBY3Rpb25Db2x1bW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBncmlkLmNvbHVtbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sID0gZ3JpZC5jb2x1bW5zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpc1RvdWNoQWN0aW9uQ29sdW1uXyhjb2wpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0VG91Y2hBY3Rpb25Db2x1bW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBleGlzdFRvdWNoQWN0aW9uQ29sdW1uO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhblN0YXJ0U3dpcGVfOiBmdW5jdGlvbihkZXRhWCwgZGVsdGFZKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoZGVsdGFZKSA+PSAxMCAmJiBNYXRoLmFicyhkZXRhWCkgPD0gNTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVSb3dSZW5kZXJJbmZvXyhpLCByb3dIZWlnaHQsIHVpZCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgZm9ybWF0dGVkUm93SXRlbSA9IHNjb3BlLmdyaWQuZ2V0Rm9ybWF0dGVkRGF0YUl0ZW0oaSk7XG4gICAgICAgIHZhciBzb3VyY2VJdGVtSW5kZXggPSBzY29wZS5ncmlkLmRhdGEudG9Tb3VyY2VSb3coaSk7XG4gICAgICAgIC8vdmFyIHNvdXJjZUl0ZW1JbmRleCA9IGk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IHVpZCArICctcicgKyBpLFxuICAgICAgICAgICAgaXNSb3dSb2xlOiB0cnVlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHNjb3BlLnNlbGVjdGVkUm93c18gJiYgc2NvcGUuc2VsZWN0ZWRSb3dzXy5pbmRleE9mKHNvdXJjZUl0ZW1JbmRleCkgIT09IC0xLFxuICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93IHInICsgaSArICcgZXZlbicsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogaSAqIHJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJvd0hlaWdodFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiAoc2NvcGUuY2FjaGVkVG1wbEZuXyB8fCBzY29wZS5nZXRSb3dUZW1wbGF0ZSgpKShmb3JtYXR0ZWRSb3dJdGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlclJhbmdlSW5mb18oYXJlYSwgY3VyckxheW91dEluZm8sIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgcmVuZGVyUmFuZ2UgPSB7fTtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSBvcHRpb25zLm9mZnNldExlZnQ7XG4gICAgICAgIHZhciBpc1Jvd0FyZWEgPSAoYXJlYSA9PT0gVklFV1BPUlQgfHwgYXJlYSA9PT0gUk9XX0hFQURFUik7XG5cbiAgICAgICAgaWYgKGlzUm93QXJlYSkge1xuICAgICAgICAgICAgaWYgKGhhc0dyb3VwXyhncmlkKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlclJhbmdlLnN0YXJ0ID0gZ2V0R3JvdXBJbmZvQXRfLmNhbGwoc2NvcGUsIG9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgIHJlbmRlclJhbmdlLmVuZCA9IGdldEdyb3VwSW5mb0F0Xy5jYWxsKHNjb3BlLCBvZmZzZXRMZWZ0ICsgY3VyckxheW91dEluZm8ud2lkdGgpO1xuICAgICAgICAgICAgICAgIHJlbmRlclJhbmdlLm9mZnNldExlZnQgPSByZW5kZXJSYW5nZS5zdGFydC5zdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRJbmZvID0gZ2V0Um93SW5mb0F0Xy5jYWxsKHNjb3BlLCB7bGVmdDogb2Zmc2V0TGVmdH0pO1xuICAgICAgICAgICAgICAgIHZhciBlbmRJbmZvID0gZ2V0Um93SW5mb0F0Xy5jYWxsKHNjb3BlLCB7bGVmdDogb2Zmc2V0TGVmdCArIGN1cnJMYXlvdXRJbmZvLndpZHRofSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJSYW5nZS5zdGFydCA9IHN0YXJ0SW5mby5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyUmFuZ2UuZW5kID0gZW5kSW5mbyA/IChlbmRJbmZvLmluZGV4ICsgMSkgOiBncmlkLmRhdGEuaXRlbUNvdW50O1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJSYW5nZS5vZmZzZXRMZWZ0ID0gc3RhcnRJbmZvLnN0YXJ0UG9zaXRpb24gLSBvZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlclJhbmdlLnN0YXJ0ID0gcmVuZGVyUmFuZ2UuZW5kID0gcmVuZGVyUmFuZ2Uub2Zmc2V0TGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW5kZXJSYW5nZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbmZvQXRfKG9mZnNldCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzdGFydFBvc2l0aW9uID0gMDtcbiAgICAgICAgdmFyIGRhdGFMZW4gPSBzZWxmLmdyaWQuZGF0YS5pdGVtQ291bnQ7XG4gICAgICAgIHZhciBjYWNoZWRSb3dPZmZzZXQgPSBzZWxmLmNhY2hlZFJvd09mZnNldF87XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4gICAgICAgIHZhciBzdGFydEluZGV4ID0gMDtcbiAgICAgICAgdmFyIHJvd0hlaWdodCA9IHNlbGYub3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgaWYgKGNhY2hlZFJvd09mZnNldCkge1xuICAgICAgICAgICAgZm9yIChpID0gY2FjaGVkUm93T2Zmc2V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGNhY2hlZFJvd09mZnNldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA8PSBvZmZzZXRMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBpICogMTAwMDA7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldExlZnQgLT0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IHN0YXJ0SW5kZXg7IGkgPCBkYXRhTGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0IDw9IHJvd0hlaWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uOiBzdGFydFBvc2l0aW9uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpICUgMTAwMDAgPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNhY2hlZFJvd09mZnNldF8gPSBjYWNoZWRSb3dPZmZzZXQgfHwgW107XG4gICAgICAgICAgICAgICAgc2VsZi5jYWNoZWRSb3dPZmZzZXRfW2kgLyAxMDAwMF0gPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2Zmc2V0TGVmdCAtPSByb3dIZWlnaHQ7XG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uICs9IHJvd0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydExheW91dEluZm9fKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICBpZiAoc2NvcGUuY2FjaGVkVmlld3BvcnRMYXlvdXRJbmZvXykge1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmNhY2hlZFZpZXdwb3J0TGF5b3V0SW5mb187XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgb3B0aW9uID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgdmFyIGdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mbyA9IGdldEdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mb18uY2FsbChzY29wZSk7XG4gICAgICAgIHZhciBjb250YWluZXJSZWN0ID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuXG4gICAgICAgIHZhciByb3dIZWFkZXJXaWR0aCA9IChvcHRpb24uc2hvd1Jvd0hlYWRlciA/IG9wdGlvbi5yb3dIZWFkZXJXaWR0aCA6IDApO1xuICAgICAgICB2YXIgY29sSGVhZGVySGVpZ2h0ID0gKG9wdGlvbi5zaG93Q29sSGVhZGVyID8gb3B0aW9uLmNvbEhlYWRlckhlaWdodCA6IDApO1xuXG4gICAgICAgIHZhciB3aWR0aCA9IGNvbnRhaW5lclJlY3Qud2lkdGggLSBjb2xIZWFkZXJIZWlnaHQ7XG4gICAgICAgIHZhciBoZWlnaHQgPSBjb250YWluZXJSZWN0LmhlaWdodCAtIHJvd0hlYWRlcldpZHRoIC0gZ3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvLmhlaWdodDtcblxuICAgICAgICB2YXIgY29udGVudFdpZHRoID0gZ2V0Q29udGVudFdpZHRoXyhncmlkKTtcbiAgICAgICAgdmFyIGNvbnRlbnRIZWlnaHQgPSBnZXRDb250ZW50SGVpZ2h0XyhncmlkKTtcbiAgICAgICAgd2lkdGggPSAoaGVpZ2h0ID49IGNvbnRlbnRIZWlnaHQpID8gd2lkdGggOiAod2lkdGggLSBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCk7XG4gICAgICAgIGhlaWdodCA9ICh3aWR0aCA+PSBjb250ZW50V2lkdGgpID8gaGVpZ2h0IDogKGhlaWdodCAtIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodCk7XG5cbiAgICAgICAgc2NvcGUuY2FjaGVkVmlld3BvcnRMYXlvdXRJbmZvXyA9IHtcbiAgICAgICAgICAgIHRvcDogcm93SGVhZGVyV2lkdGggKyBncm91cERyYWdQYW5lbExheW91dEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogY29sSGVhZGVySGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICBjb250ZW50V2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IGNvbnRlbnRIZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNjb3BlLmNhY2hlZFZpZXdwb3J0TGF5b3V0SW5mb187XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29ybmVySGVhZGVyTGF5b3V0SW5mb18oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvID0gZ2V0R3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvXy5jYWxsKHNjb3BlKTtcbiAgICAgICAgdmFyIHJvd0hlYWRlcldpZHRoID0gKG9wdGlvbnMuc2hvd1Jvd0hlYWRlciA/IG9wdGlvbnMucm93SGVhZGVyV2lkdGggOiAwKTtcbiAgICAgICAgdmFyIGNvbEhlYWRlckhlaWdodCA9IChvcHRpb25zLnNob3dDb2xIZWFkZXIgPyBvcHRpb25zLmNvbEhlYWRlckhlaWdodCA6IDApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBncm91cERyYWdQYW5lbExheW91dEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiBjb2xIZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IHJvd0hlYWRlcldpZHRoLFxuICAgICAgICAgICAgY29udGVudFdpZHRoOiBjb2xIZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICBjb250ZW50SGVpZ2h0OiByb3dIZWFkZXJXaWR0aFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJvd0hlYWRlckxheW91dEluZm9fKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNjb3BlLm9wdGlvbnM7XG4gICAgICAgIHZhciBncm91cERyYWdQYW5lbExheW91dEluZm8gPSBnZXRHcm91cERyYWdQYW5lbExheW91dEluZm9fLmNhbGwoc2NvcGUpO1xuICAgICAgICB2YXIgdmlld3BvcnRMYXlvdXRJbmZvID0gZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXy5jYWxsKHNjb3BlKTtcbiAgICAgICAgdmFyIHJvd0hlYWRlcldpZHRoID0gKG9wdGlvbnMuc2hvd1Jvd0hlYWRlciA/IG9wdGlvbnMucm93SGVhZGVyV2lkdGggOiAwKTtcbiAgICAgICAgdmFyIGNvbEhlYWRlckhlaWdodCA9IChvcHRpb25zLnNob3dDb2xIZWFkZXIgPyBvcHRpb25zLmNvbEhlYWRlckhlaWdodCA6IDApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mby5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBjb2xIZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdmlld3BvcnRMYXlvdXRJbmZvLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByb3dIZWFkZXJXaWR0aCxcbiAgICAgICAgICAgIGNvbnRlbnRXaWR0aDogdmlld3BvcnRMYXlvdXRJbmZvLmNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IHJvd0hlYWRlcldpZHRoXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29sdW1uSGVhZGVyTGF5b3V0SW5mb18oKSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgdmFyIGdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mbyA9IGdldEdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mb18uY2FsbChzY29wZSk7XG4gICAgICAgIHZhciB2aWV3cG9ydExheW91dEluZm8gPSBnZXRWaWV3cG9ydExheW91dEluZm9fLmNhbGwoc2NvcGUpO1xuICAgICAgICB2YXIgcm93SGVhZGVyV2lkdGggPSAob3B0aW9ucy5zaG93Um93SGVhZGVyID8gb3B0aW9ucy5yb3dIZWFkZXJXaWR0aCA6IDApO1xuICAgICAgICB2YXIgY29sSGVhZGVySGVpZ2h0ID0gKG9wdGlvbnMuc2hvd0NvbEhlYWRlciA/IG9wdGlvbnMuY29sSGVhZGVySGVpZ2h0IDogMCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcm93SGVhZGVyV2lkdGggKyBncm91cERyYWdQYW5lbExheW91dEluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiBjb2xIZWFkZXJIZWlnaHQsXG4gICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0SW5mby5oZWlnaHQsXG4gICAgICAgICAgICBjb250ZW50V2lkdGg6IGNvbEhlYWRlckhlaWdodCxcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IHZpZXdwb3J0TGF5b3V0SW5mby5jb250ZW50SGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvXygpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgaWYgKHNjb3BlLmdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mb18pIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZS5ncm91cERyYWdQYW5lbExheW91dEluZm9fO1xuICAgICAgICB9XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dHcm91cGluZykge1xuXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZ2V0R3JvdXBEcmFnUGFuZWxIZWlnaHRfLmNhbGwoc2NvcGUpO1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gY29udGFpbmVyUmVjdC53aWR0aDtcbiAgICAgICAgICAgIHNjb3BlLmdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mb18gPSB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGNvbnRlbnRXaWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgY29udGVudEhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NvcGUuZ3JvdXBEcmFnUGFuZWxMYXlvdXRJbmZvXyA9IHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgY29udGVudFdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjb3BlLmdyb3VwRHJhZ1BhbmVsTGF5b3V0SW5mb187XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBEcmFnUGFuZWxIZWlnaHRfKCkge1xuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgICAgIC8vVE9ETzogYXBwZW5kQ2hpbGQvcmVtb3ZlQ2hpbGQgdHdpY2UgaXMgdG9vIGV4cGVuc2l2ZSwgaW1wcm92ZSBpdCBsYXRlci5cbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBzY29wZS5ncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG4gICAgICAgIHZhciBtYXhXaWR0aCA9IGNvbnRhaW5lclJlY3Qud2lkdGg7XG4gICAgICAgIHZhciBncm91cERyYWdQYW5lbEVsZW1lbnQgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgY2xhc3M9XCJnYy1ncm91cGluZy1jb250YWluZXJcIj48ZGl2PicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdyb3VwRHJhZ1BhbmVsRWxlbWVudCk7XG4gICAgICAgIHZhciBncm91cERyYWdQYW5lbEVsZW1lbnRTdHlsZSA9IGRvbVV0aWwuZ2V0U3R5bGUoZ3JvdXBEcmFnUGFuZWxFbGVtZW50KTtcbiAgICAgICAgdmFyIHBhZGRpbmdMZWZ0ID0gcGFyc2VTdHlsZVByb3BlcnR5VmFsdWVfKGdyb3VwRHJhZ1BhbmVsRWxlbWVudFN0eWxlLCBQQURESU5HX0xFRlQpO1xuICAgICAgICB2YXIgcGFkZGluZ1JpZ2h0ID0gcGFyc2VTdHlsZVByb3BlcnR5VmFsdWVfKGdyb3VwRHJhZ1BhbmVsRWxlbWVudFN0eWxlLCBQQURESU5HX1JJR0hUKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChncm91cERyYWdQYW5lbEVsZW1lbnQpO1xuXG4gICAgICAgIG1heFdpZHRoID0gbWF4V2lkdGggLSBwYWRkaW5nTGVmdCAtIHBhZGRpbmdSaWdodDtcblxuICAgICAgICB2YXIgZGl2ID0gJzxkaXYgY2xhc3M9XCJnYy1ncm91cGluZy1jb250YWluZXJcIj48ZGl2IHN0eWxlPVwid2lkdGg6JyArIG1heFdpZHRoICsgJ3B4O1wiPicgKyBnZXRSZW5kZXJlZEdyb3VwRHJhZ1BhbmVsSW5mb18uY2FsbChzY29wZSwgZmFsc2UpICsgJzwvZGl2PjwvZGl2Pic7XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoZGl2KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbmRlcmVkR3JvdXBEcmFnUGFuZWxJbmZvXyhnZW5lcmF0ZUlkKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBncm91cERlc2NyaXB0b3JzID0gZ3JpZC5kYXRhLmdyb3VwRGVzY3JpcHRvcnM7XG4gICAgICAgIHZhciBpZFByZWZpeCA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyb3VwaW5nLWluZGljYXRvci0nO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGNvbElkO1xuICAgICAgICB2YXIgY29sO1xuICAgICAgICB2YXIgbGVuID0gZ3JvdXBEZXNjcmlwdG9ycy5sZW5ndGg7XG4gICAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICAgICAgc3RyICs9ICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXBpbmctaGVscC1jb250ZW50XCI+JyArIEdST1VQX0RSQUdfVEVYVCArICc8L2Rpdj4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29sSWQgPSBncm91cERlc2NyaXB0b3JzW2ldLmZpZWxkO1xuICAgICAgICAgICAgICAgIGNvbCA9IGdyaWQuZ2V0Q29sQnlJZF8oY29sSWQpO1xuICAgICAgICAgICAgICAgIHN0ciArPSAoJzxkaXYnICsgKGdlbmVyYXRlSWQgPyAoJyBpZD1cIicgKyBpZFByZWZpeCArIGNvbElkICsgJ1wiJykgOiAnJykgKyAnIGNsYXNzPVwiZ2MtZ3JvdXBpbmctaW5kaWNhdG9yXCI+PHNwYW4gY2xhc3M9XCJnYy1ncm91cGluZy10aXRsZVwiPicgKyAoY29sID8gY29sLmNhcHRpb24gOiAnJykgKyAnPC9zcGFuPjxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1pY29uLWdyb3VwaW5nLWRlbGV0ZVwiPjwvc3Bhbj48L2Rpdj4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSW5zZXJ0aW5nTG9jYXRpb25fKGxlZnQsIHRvcCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgZ3JvdXBEZXMgPSBncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW4gPSBncm91cERlcy5sZW5ndGg7XG4gICAgICAgIHZhciB0byA9IDA7XG4gICAgICAgIHZhciBncm91cGluZ0VsZW1lbnQ7XG4gICAgICAgIHZhciBvZmZzZXQ7XG4gICAgICAgIHZhciBncm91cGluZ1BhbmVsSW5mbyA9IHNlbGYuaGl0VGVzdEluZm9fLmdyb3VwaW5nUGFuZWxJbmZvO1xuICAgICAgICB2YXIgZmllbGQgPSBncm91cGluZ1BhbmVsSW5mbyA/IGdyb3VwaW5nUGFuZWxJbmZvLmZpZWxkIDogJyc7XG4gICAgICAgIHZhciBwcmV2aW91c0xlZnQgPSAwO1xuICAgICAgICB2YXIgcHJldmlvdXNUb3AgPSAwO1xuICAgICAgICB2YXIgcHJldmlvdXNIZWlnaHQgPSAwO1xuICAgICAgICB2YXIgY2xpZW50SGVpZ2h0O1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICB0byA9IGxlbjtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGdyb3VwaW5nRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyaWQudWlkICsgJy1ncm91cGluZy1pbmRpY2F0b3ItJyArIGdyb3VwRGVzW2ldLmZpZWxkKTtcbiAgICAgICAgICAgICAgICBjbGllbnRIZWlnaHQgPSBncm91cGluZ0VsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGdyb3VwaW5nRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlZnQgPCBvZmZzZXQubGVmdCAmJiB0b3AgPj0gb2Zmc2V0LnRvcCAmJiB0b3AgPD0gKG9mZnNldC50b3AgKyBjbGllbnRIZWlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQubGVmdCA8IHByZXZpb3VzTGVmdCAmJiB0b3AgPj0gcHJldmlvdXNUb3AgJiYgdG9wIDw9IChwcmV2aW91c1RvcCArIHByZXZpb3VzSGVpZ2h0KSkgeyAvL2xpbmUgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXNMZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNUb3AgPSBvZmZzZXQudG9wO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzSGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JvdXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLWdyb3VwaW5nLWluZGljYXRvci0nICsgZmllbGQpO1xuICAgICAgICAgICAgb2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQoZ3JvdXBpbmdFbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChvZmZzZXQubGVmdCA8PSBsZWZ0ICYmIGxlZnQgPD0gKG9mZnNldC5sZWZ0ICsgZ3JvdXBpbmdFbGVtZW50LmNsaWVudFdpZHRoKSAmJiB0b3AgPj0gb2Zmc2V0LnRvcCAmJiB0b3AgPD0gKG9mZnNldC50b3AgKyBncm91cGluZ0VsZW1lbnQuY2xpZW50SGVpZ2h0KSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBEZXNbaV0uZmllbGQgPT09IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0byA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydERyYWdEcm9waW5nXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICB2YXIgaGl0VGVzdCA9IHNlbGYuZHJhZ1N0YXJ0SW5mb18uaGl0VGVzdEluZm87XG4gICAgICAgIHZhciBjb2w7XG4gICAgICAgIGlmIChoaXRUZXN0LmFyZWEgPT09IENPTFVNTl9IRUFERVIgJiYgaGl0VGVzdC5jb2x1bW4gPj0gMCkge1xuICAgICAgICAgICAgc2VsZWN0b3IgPSAnIycgKyBzZWxmLmdyaWQudWlkICsgJyAuZ2MtY29sdW1uLWhlYWRlci1jZWxsLmMnICsgaGl0VGVzdC5jb2x1bW47XG4gICAgICAgICAgICBjb2wgPSBncmlkLmNvbHVtbnNbaGl0VGVzdC5jb2x1bW5dO1xuICAgICAgICB9IGVsc2UgaWYgKGhpdFRlc3QuYXJlYSA9PT0gR1JPVVBfRFJBR19QQU5FTCAmJiBoaXRUZXN0Lmdyb3VwaW5nUGFuZWxJbmZvKSB7XG4gICAgICAgICAgICBzZWxlY3RvciA9ICcjJyArIHNlbGYuZ3JpZC51aWQgKyAnLWdyb3VwaW5nLWluZGljYXRvci0nICsgaGl0VGVzdC5ncm91cGluZ1BhbmVsSW5mby5maWVsZDtcbiAgICAgICAgICAgIGNvbCA9IGdyaWQuZ2V0Q29sQnlJZF8oaGl0VGVzdC5ncm91cGluZ1BhbmVsSW5mby5maWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGRvbVV0aWwub2Zmc2V0KGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIHBvaW50T2Zmc2V0ID0gc2VsZi5kcmFnU3RhcnRJbmZvXy5wb2ludE9mZnNldDtcbiAgICAgICAgICAgIHNlbGYuZHJhZ1N0YXJ0SW5mb18ucG9pbnRPZmZzZXQgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnQgLSBwb2ludE9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0LnRvcCAtIHBvaW50T2Zmc2V0LnRvcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICBlbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXBpbmctZHJhZy1jbHVlXCIgIHN0eWxlPVwiekluZGV4Ojk5OVwiPjxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1pY29uLWdyb3VwaW5nLWFkZFwiPjwvc3Bhbj48ZGl2IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6IGhpZGRlbjt3aGl0ZS1zcGFjZTpwcmU7XCI+PHNwYW4+ICcgKyBjb2wuY2FwdGlvbiArICc8L3NwYW4+PC9kaXY+PC9kaXY+Jyk7XG4gICAgICAgICAgICBlbGVtZW50LmlkID0gJyc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IG9mZnNldC50b3AgKyAncHgnO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb2Zmc2V0LmxlZnQgKyAncHgnO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gOTk5O1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFBPU19BQlM7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgc2VsZi5kcmFnRHJvcGluZ0VsZW1lbnRfID0gZWxlbWVudDtcblxuICAgICAgICAgICAgdmFyIGNsdWVJbmRpY2F0b3JFbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KCc8c3BhbiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO2Rpc3BsYXk6IG5vbmU7XCIgY2xhc3M9XCJnYy1pY29uIGdjLWdyb3VwaW5nLWRyYWctY2x1ZS1pbmRpY2F0b3JcIj48L3NwYW4+Jyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsdWVJbmRpY2F0b3JFbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50U3R5bGUgPSBkb21VdGlsLmdldFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIHBhZGRpbmdMZWZ0ID0gcGFyc2VTdHlsZVByb3BlcnR5VmFsdWVfKGVsZW1lbnRTdHlsZSwgUEFERElOR19MRUZUKTtcbiAgICAgICAgICAgIHZhciBwYWRkaW5nUmlnaHQgPSBwYXJzZVN0eWxlUHJvcGVydHlWYWx1ZV8oZWxlbWVudFN0eWxlLCBQQURESU5HX1JJR0hUKTtcblxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIHBhZGRpbmdMZWZ0IC0gcGFkZGluZ1JpZ2h0IC0gMTY7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgICAgICBpZiAod2lkdGggPD0gMCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZHJhZ0Ryb3BpbmdJbmRpY2F0b3JFbGVtZW50XyA9IGNsdWVJbmRpY2F0b3JFbGVtZW50O1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cFJlbmRlckluZm9fKHN0YXJ0SW5mbywgZW5kSW5mbywgb2Zmc2V0TGVmdCwgaXNSb3dIZWFkZXIsIGdldFVwZGF0ZUtleSkge1xuICAgICAgICBpZiAoIXN0YXJ0SW5mbyB8fCAhZW5kSW5mbykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHZhciByb3dzID0gW107XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBbXTtcbiAgICAgICAgdmFyIHJlbmRlckl0ZW0gPSBmYWxzZTtcbiAgICAgICAgdmFyIGFsbERvbmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGN1cnJJbmZvO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIHRwUm93O1xuXG4gICAgICAgIGZvciAoaSA9IHN0YXJ0SW5mby5wYXRoWzBdLCBsZW4gPSBlbmRJbmZvLnBhdGhbMF07IGkgPD0gbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGdyb3VwSW5mb3MucHVzaCh7XG4gICAgICAgICAgICAgICAgcGF0aDogW2ldLFxuICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChncm91cEluZm9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChhbGxEb25lKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJySW5mbyA9IGdyb3VwSW5mb3Muc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICghcmVuZGVySXRlbSAmJiBncm91cEluZm9BcmVTYW1lXyhjdXJySW5mbywgc3RhcnRJbmZvKSkge1xuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlbmRlckl0ZW0gJiYgZ3JvdXBJbmZvQXJlU2FtZV8oY3VyckluZm8sIGVuZEluZm8pKSB7XG4gICAgICAgICAgICAgICAgYWxsRG9uZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVuZGVySXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJySW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHBSb3cgPSBnZXRHcm91cEhlYWRlcl8uY2FsbChzY29wZSwgY3VyckluZm8sIGlzUm93SGVhZGVyLCBvZmZzZXRMZWZ0LCBnZXRVcGRhdGVLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgICAgICB0cFJvdyA9IGdldEdyb3VwQ29udGVudF8uY2FsbChzY29wZSwgY3VyckluZm8sIGlzUm93SGVhZGVyLCBvZmZzZXRMZWZ0LCBnZXRVcGRhdGVLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRwUm93ID0gZ2V0R3JvdXBGb290ZXJfLmNhbGwoc2NvcGUsIGN1cnJJbmZvLCBpc1Jvd0hlYWRlciwgb2Zmc2V0TGVmdCwgZ2V0VXBkYXRlS2V5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHBSb3cucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MgPSByb3dzLmNvbmNhdCh0cFJvdy5yb3cpO1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRMZWZ0ICs9IHRwUm93LmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJySW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncmlkLmdldEdyb3VwSW5mb18oY3VyckluZm8ucGF0aCk7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAgJiYgIWdyb3VwLmlzQm90dG9tZUxldmVsICYmICEoZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmZvb3RlciAmJiBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJySW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUluZGV4OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0ZPT1RFUlxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBsZW4gPSBncm91cC5pc0JvdHRvbUxldmVsID8gZ3JvdXAuaXRlbUNvdW50IDogZ3JvdXBJbmZvLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvcy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogY3VyckluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSW5mb3MudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJJbmZvLnBhdGguc2xpY2UoKS5jb25jYXQoW2ldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUluZGV4OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBncm91cEluZm9BcmVTYW1lXyhsZWZ0LCByaWdodCkge1xuICAgICAgICBpZiAobGVmdC5pdGVtSW5kZXggIT09IHJpZ2h0Lml0ZW1JbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZWZ0LmFyZWEgIT09IHJpZ2h0LmFyZWEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZWZ0UGF0aCA9IGxlZnQucGF0aDtcbiAgICAgICAgdmFyIHJpZ2h0UGF0aCA9IHJpZ2h0LnBhdGg7XG4gICAgICAgIGlmIChsZWZ0UGF0aC5sZW5ndGggIT09IHJpZ2h0UGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsZWZ0UGF0aC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGxlZnRQYXRoW2ldICE9PSByaWdodFBhdGhbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBIZWFkZXJfKGN1cnJJbmZvLCBpc1Jvd0hlYWRlciwgb2Zmc2V0TGVmdCwgZ2V0VXBkYXRlS2V5KSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIHJvd3M7XG4gICAgICAgIHZhciBoZWlnaHQ7XG4gICAgICAgIHZhciB3aWR0aCA9IHNjb3BlLmdldExheW91dEluZm8oKVtWSUVXUE9SVF0uY29udGVudEhlaWdodDtcbiAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgdmFyIGhlYWRlciA9IGdyb3VwSW5mby5kYXRhLmdyb3VwRGVzY3JpcHRvci5oZWFkZXI7XG4gICAgICAgIGlmIChoZWFkZXIgJiYgaGVhZGVyLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcbiAgICAgICAgICAgIGhlaWdodCA9IHNjb3BlLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cEluZm8uZGF0YSk7XG4gICAgICAgICAgICBpZiAoaXNSb3dIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0R3JvdXBSb3dIZWFkZXJDZWxsLmNhbGwoc2NvcGUsIGN1cnJJbmZvLCBvZmZzZXRMZWZ0LCBoZWlnaHQsIGdldFVwZGF0ZUtleSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ3JpZC51aWQgKyAnLWdoJyArIGN1cnJJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgICAgIGlmIChnZXRVcGRhdGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogY3VyckluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChnZXRHcm91cEhlYWRlclJvdy5jYWxsKHNjb3BlLCBrZXksIGN1cnJJbmZvLCBncm91cEluZm8sIHdpZHRoLCBvZmZzZXRMZWZ0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3c6IHJvd3MsIGhlaWdodDogaGVpZ2h0fTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cENvbnRlbnRfKGN1cnJJbmZvLCBpc1Jvd0hlYWRlciwgb2Zmc2V0TGVmdCwgZ2V0VXBkYXRlS2V5KSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcbiAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGdyaWQuZ2V0R3JvdXBJbmZvXyhjdXJySW5mby5wYXRoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGdldEdyb3VwSXRlbVJvd0hlaWdodF8uY2FsbCh0aGlzKTtcbiAgICAgICAgaWYgKGlzUm93SGVhZGVyKSB7XG4gICAgICAgICAgICByb3dzLnB1c2goZ2V0R3JvdXBSb3dIZWFkZXJDZWxsLmNhbGwoc2NvcGUsIGN1cnJJbmZvLCBvZmZzZXRMZWZ0LCBoZWlnaHQsIGdldFVwZGF0ZUtleSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93cy5wdXNoKGdldFJlbmRlcmVkR3JvdXBDb250ZW50SXRlbUluZm9fLmNhbGwoc2NvcGUsIGN1cnJJbmZvLml0ZW1JbmRleCwgZ3JvdXBJbmZvLCBoZWlnaHQsIG9mZnNldExlZnQsIGdldFVwZGF0ZUtleSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7cm93OiByb3dzLCBoZWlnaHQ6IGhlaWdodH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBGb290ZXJfKGN1cnJJbmZvLCBpc1Jvd0hlYWRlciwgb2Zmc2V0TGVmdCwgZ2V0VXBkYXRlS2V5KSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIHJvd3M7XG4gICAgICAgIHZhciBncm91cEluZm8gPSBncmlkLmdldEdyb3VwSW5mb18oY3VyckluZm8ucGF0aCk7XG4gICAgICAgIHZhciBoZWlnaHQ7XG4gICAgICAgIHZhciBmb290ZXIgPSBncm91cEluZm8uZGF0YS5ncm91cERlc2NyaXB0b3IuZm9vdGVyO1xuICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSB7XG4gICAgICAgICAgICByb3dzID0gW107XG4gICAgICAgICAgICBoZWlnaHQgPSBzY29wZS5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvLmRhdGEpO1xuICAgICAgICAgICAgaWYgKGlzUm93SGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKGdldEdyb3VwUm93SGVhZGVyQ2VsbC5jYWxsKHNjb3BlLCBjdXJySW5mbywgb2Zmc2V0TGVmdCwgaGVpZ2h0LCBnZXRVcGRhdGVLZXkpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGdyaWQudWlkICsgJy1nZicgKyBjdXJySW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0VXBkYXRlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm86IGN1cnJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0ZPT1RFUlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goZ2V0R3JvdXBGb290ZXJSb3cuY2FsbChzY29wZSwga2V5LCBjdXJySW5mbywgZ3JvdXBJbmZvLCBvZmZzZXRMZWZ0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3c6IHJvd3MsIGhlaWdodDogaGVpZ2h0fTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEZvb3RlclJvdyhrZXksIGN1cnJJbmZvLCBncm91cEluZm8sIGxlZnQpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgaXNSb3dSb2xlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlbmRlckluZm86IGdldEdyb3VwRm9vdGVyUmVuZGVySW5mb18uY2FsbChzY29wZSwgZ3JvdXBJbmZvLCBsZWZ0KVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwRm9vdGVyUmVuZGVySW5mb18oZ3JvdXBJbmZvLCBvZmZzZXQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gc2VsZi5nZXRHcm91cEZvb3RlckhlaWdodF8oZ3JvdXBJbmZvLmRhdGEpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSxcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBoZWlnaHRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW5kZXJlZEhUTUw6IGdldEdyb3VwRm9vdGVyVGVtcGxhdGVfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvKShnZXRHcm91cEZvb3RlckRhdGFfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvKSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEZvb3RlclRlbXBsYXRlXyhncm91cEluZm8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGdyb3VwUGF0aCA9IGdyb3VwSW5mby5wYXRoO1xuICAgICAgICBzZWxmLmNhY2hlZEdyb3VwRm9vdGVyRm5fID0gc2VsZi5jYWNoZWRHcm91cEZvb3RlckZuXyB8fCBbXTtcbiAgICAgICAgaWYgKHNlbGYuY2FjaGVkR3JvdXBGb290ZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRHcm91cEZvb3RlckZuX1tncm91cFBhdGgubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvb3RlciA9IGdyb3VwSW5mby5kYXRhLmdyb3VwRGVzY3JpcHRvci5mb290ZXI7XG4gICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IChmb290ZXIgJiYgZm9vdGVyLnRlbXBsYXRlKSB8fCBnZXRSYXdSb3dUZW1wbGF0ZV8uY2FsbChzZWxmKTtcbiAgICAgICAgdmFyIG9sZENvbFRtcGw7XG4gICAgICAgIHZhciBuZXdDb2xUbXBsO1xuICAgICAgICB2YXIgY3NzTmFtZTtcbiAgICAgICAgdmFyIHRhZ05hbWU7XG4gICAgICAgIHZhciBjb2xUbXBsO1xuICAgICAgICB0ZW1wbGF0ZVN0ciA9IGZpbHRlckFjdGlvbkNvbHVtbl8uY2FsbCh0aGlzLCB0ZW1wbGF0ZVN0cik7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVUZW1wbGF0ZUVsZW1lbnQodGVtcGxhdGVTdHIpO1xuICAgICAgICAvL0RpZmZlcmVudCBicm93c2VycyBtYXkgcmV0dXJuIGRpZmZlcmVudCBpbm5lckhUTUxzIGNvbXBhcmVkIHdpdGggdGhlIG9yaWdpbmFsIEhUTUwsXG4gICAgICAgIC8vdGhleSBtYXkgcmVvcmRlciB0aGUgYXR0cmlidXRlIG9mIGEgdGFnLGVzY2FwZXMgdGFncyB3aXRoIGluc2lkZSBhIG5vc2NyaXB0IHRhZyBldGMuXG4gICAgICAgIHRlbXBsYXRlU3RyID0gZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0KGVsZW1lbnQpO1xuXG4gICAgICAgIHZhciBhbm5vdGF0aW9uQ29scyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29sdW1uXScpO1xuICAgICAgICBfLmVhY2goYW5ub3RhdGlvbkNvbHMsIGZ1bmN0aW9uKGFubm90YXRpb25Db2wsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgY29sID0gZ3JpZC5nZXRDb2xCeUlkXyhhbm5vdGF0aW9uQ29sLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2x1bW4nKSk7XG4gICAgICAgICAgICAvL1RPRE86IGhhbmRlbCB0aGUgY2FzZSB0aGF0IGNvbCBhZ2dyYWdhdGlvbiBpcyBhbiBhcnJheVxuICAgICAgICAgICAgdmFyIGNvbEFubm90YXRpb24gPSBjb2wuZ3JvdXBGb290ZXIgfHwgJyc7XG4gICAgICAgICAgICBjb2xUbXBsID0gYW5ub3RhdGlvbkNvbDtcbiAgICAgICAgICAgIHRhZ05hbWUgPSBjb2xUbXBsLnRhZ05hbWU7XG4gICAgICAgICAgICBvbGRDb2xUbXBsID0gY29sVG1wbC5vdXRlckhUTUw7XG4gICAgICAgICAgICBjc3NOYW1lID0gJ2djLWNlbGwgZ2MtZ3JvdXAtZm9vdGVyLWNlbGwnICsgJyBjJyArIGluZGV4O1xuICAgICAgICAgICAgbmV3Q29sVG1wbCA9IG9sZENvbFRtcGwuc2xpY2UoMCwgb2xkQ29sVG1wbC5sZW5ndGggLSAodGFnTmFtZS5sZW5ndGggKyAzKSkgK1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwMCU7b3ZlcmZsb3c6aGlkZGVuO1wiPjxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtcIiBjbGFzcz1cIicgKyBjc3NOYW1lICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gK1xuICAgICAgICAgICAgICAgICc8L2Rpdj48L2Rpdj48LycgKyB0YWdOYW1lICsgJz4nO1xuXG4gICAgICAgICAgICAvL291dGVySFRNTCByZXR1cm5zIGRvdWJsZSBxdW90ZXMgaW4gYXR0cmlidXRlIHNvbWV0aW1lc1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlU3RyLmluZGV4T2Yob2xkQ29sVG1wbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8ganNjczpkaXNhYmxlIHZhbGlkYXRlUXVvdGVNYXJrc1xuICAgICAgICAgICAgICAgIC8qanNoaW50IHF1b3RtYXJrOiBkb3VibGUgKi9cbiAgICAgICAgICAgICAgICBvbGRDb2xUbXBsID0gb2xkQ29sVG1wbC5yZXBsYWNlKC9cIi9nLCBcIidcIik7XG4gICAgICAgICAgICAgICAgLy8ganNjczplbmFibGUgdmFsaWRhdGVRdW90ZU1hcmtzXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciA9IHRlbXBsYXRlU3RyLnJlcGxhY2Uob2xkQ29sVG1wbCwgbmV3Q29sVG1wbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgc2VsZi5jYWNoZWRHcm91cEZvb3RlckZuX1tncm91cFBhdGgubGVuZ3RoIC0gMV0gPSBkb1QudGVtcGxhdGUodGVtcGxhdGVTdHIsIG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRHcm91cEZvb3RlckZuX1tncm91cFBhdGgubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRHcm91cENvbnRlbnRJdGVtSW5mb18ocm93SW5kZXgsIGdyb3VwSW5mbywgaGVpZ2h0LCBvZmZzZXRMZWZ0LCBnZXRVcGRhdGVLZXksIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGtleSA9IHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyByb3dJbmRleDtcbiAgICAgICAgaWYgKGdldFVwZGF0ZUtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwSW5mby5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IHJvd0luZGV4LFxuICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogZ2V0R3JvdXBJdGVtUm93SGVpZ2h0Xy5jYWxsKHNlbGYpLFxuICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0NPTlRFTlRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0R3JvdXBDb250ZW50Um93LmNhbGwoc2VsZiwga2V5LCByb3dJbmRleCwgZ3JvdXBJbmZvLCBoZWlnaHQsIG9mZnNldExlZnQsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwQ29udGVudFJvdyhrZXksIHJvd0luZGV4LCBncm91cEluZm8sIGhlaWdodCwgbGVmdCwgYWRkaXRpb25hbENTU0NsYXNzLCBhZGRpdGlvbmFsU3R5bGUpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgaXNSb3dSb2xlOiB0cnVlLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHNjb3BlLnNlbGVjdGVkUm93c18gJiYgc2NvcGUuc2VsZWN0ZWRSb3dzXy5pbmRleE9mKGdyb3VwSW5mby5kYXRhLnRvU291cmNlUm93KHJvd0luZGV4KSkgIT09IC0xLFxuICAgICAgICAgICAgcmVuZGVySW5mbzogZ2V0R3JvdXBSb3dSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCByb3dJbmRleCwgZ3JvdXBJbmZvLCBoZWlnaHQsIGxlZnQsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwUm93UmVuZGVySW5mb18ocm93SW5kZXgsIGdyb3VwSW5mbywgaGVpZ2h0LCBvZmZzZXQsIGFkZGl0aW9uYWxDU1NDbGFzcywgYWRkaXRpb25hbFN0eWxlKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IG9mZnNldCxcbiAgICAgICAgICAgIHdpZHRoOiBoZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgc3R5bGUgPSBhZGRpdGlvbmFsU3R5bGUgPyBfLmFzc2lnbihhZGRpdGlvbmFsU3R5bGUsIHN0eWxlKSA6IHN0eWxlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3NzQ2xhc3M6ICdnYy1yb3cnICsgKGFkZGl0aW9uYWxDU1NDbGFzcyA/ICgnICcgKyBhZGRpdGlvbmFsQ1NTQ2xhc3MpIDogJycpLFxuICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgcmVuZGVyZWRIVE1MOiB0aGlzLmdldFJvd1RlbXBsYXRlKCkodGhpcy5ncmlkLmZvcm1hdERhdGFJdGVtKGdyb3VwSW5mby5kYXRhLmdldEl0ZW0ocm93SW5kZXgpKSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEl0ZW1Sb3dIZWlnaHRfKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJvd0hlaWdodDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cFJvd0hlYWRlckNlbGwoY3VyckluZm8sIG9mZnNldExlZnQsIGhlaWdodCwgZ2V0VXBkYXRlS2V5KSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIGlmIChnZXRVcGRhdGVLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5OiBnZXRSb3dIZWFkZXJDZWxsS2V5Xy5jYWxsKHRoaXMsIGN1cnJJbmZvKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiBvZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGluZm86IGN1cnJJbmZvXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJvd0hlYWRlckNlbGxSZW5kZXJJbmZvXy5jYWxsKHNjb3BlLCBjdXJySW5mbywgbnVsbCwgaGVpZ2h0LCBvZmZzZXRMZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSGVhZGVyUm93KGtleSwgY3VyckluZm8sIGdyb3VwSW5mbywgd2lkdGgsIGxlZnQpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgaXNSb3dSb2xlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlbmRlckluZm86IGdldEdyb3VwSGVhZGVyUmVuZGVySW5mb18uY2FsbChzY29wZSwgY3VyckluZm8ucGF0aCwgZ3JvdXBJbmZvLCB3aWR0aCwgbGVmdClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclJlbmRlckluZm9fKGdyb3VwUGF0aCwgZ3JvdXBJbmZvLCB3aWR0aCwgbGVmdCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjc3NDbGFzczogJ2djLXJvdyBnJyArIGdyb3VwUGF0aC5qb2luKCdfJyksXG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHNlbGYuZ2V0R3JvdXBIZWFkZXJIZWlnaHRfKGdyb3VwSW5mby5kYXRhKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHdpZHRoLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogcmVuZGVyR3JvdXBIZWFkZXJfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckdyb3VwSGVhZGVyXyhncm91cEluZm8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZ2V0R3JvdXBIZWFkZXJUZW1wbGF0ZV8uY2FsbChzZWxmLCBncm91cEluZm8pKGdldEdyb3VwRm9vdGVyRGF0YV8uY2FsbChzZWxmLCBncm91cEluZm8pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEhlYWRlclRlbXBsYXRlXyhncm91cEluZm8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXBQYXRoID0gZ3JvdXBJbmZvLnBhdGg7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICBzZWxmLmNhY2hlZEdyb3VwSGVhZGVyRm5fID0gc2VsZi5jYWNoZWRHcm91cEhlYWRlckZuXyB8fCBbXTtcbiAgICAgICAgaWYgKHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRHcm91cEhlYWRlckZuX1tncm91cFBhdGgubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhlYWRlciA9IGdyb3VwLmdyb3VwRGVzY3JpcHRvci5oZWFkZXI7XG4gICAgICAgIHZhciBjb2xHcm91cEhlYWRlcnMgPSAnJztcbiAgICAgICAgXy5mb3JFYWNoKHNlbGYuZ3JpZC5jb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW4uZ3JvdXBIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBjb2xHcm91cEhlYWRlcnMgPSBjb2xHcm91cEhlYWRlcnMgKyAoY29sR3JvdXBIZWFkZXJzID8gJywgJyA6ICcnKSArIGNvbHVtbi5ncm91cEhlYWRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBhbm5vdGF0aW9uID0gY29sR3JvdXBIZWFkZXJzID8gJygnICsgY29sR3JvdXBIZWFkZXJzICsgJyknIDogJyh7ez1pdC5jb3VudH19IGl0ZW1zKSc7XG4gICAgICAgIC8vVE9ETzogcHJlcHJvY2VzcyB1c2VyIGdpdmVuIGhlYWRlciB0ZW1wbGF0ZSwgYWRkIGhlaWdodFxuICAgICAgICB2YXIgdGVtcGxhdGVTdHIgPSAoaGVhZGVyICYmIGhlYWRlci50ZW1wbGF0ZSkgfHxcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXAtaGVhZGVyIGdjLWdyb3VwLWhlYWRlci1jZWxsIFwiPicgK1xuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZ2MtaWNvbiBnYy1ncm91cGluZy10b2dnbGUge3s9aXQuZ3JvdXBTdGF0dXN9fVwiIHN0eWxlPVwibWFyZ2luLXRvcDp7ez1pdC5tYXJnaW59fXB4O1wiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZ2MtZ3JvdXBpbmctaGVhZGVyLXRleHRcIiBsZXZlbD1cInt7PWl0LmxldmVsfX1cIj4ge3s9aXQubmFtZX19PHNwYW4+ICcgKyBhbm5vdGF0aW9uICsgJzwvc3Bhbj48L2Rpdj48L2Rpdj4nO1xuXG4gICAgICAgIHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdID0gZG9ULnRlbXBsYXRlKHRlbXBsYXRlU3RyLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2FjaGVkR3JvdXBIZWFkZXJGbl9bZ3JvdXBQYXRoLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwRm9vdGVyRGF0YV8oZ3JvdXBJbmZvKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICAgICAgY291bnQ6IGdyb3VwLml0ZW1Db3VudCxcbiAgICAgICAgICAgIGxldmVsOiBncm91cC5sZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogZ3JvdXAubGV2ZWwgKiAxOCxcbiAgICAgICAgICAgIGdyb3VwU3RhdHVzOiBncm91cC5jb2xsYXBzZWQgPyAnY29sbGFwc2VkJyA6ICdleHBhbmQnLFxuICAgICAgICAgICAgY29uZGl0aW9uOiBncm91cC5ncm91cERlc2NyaXB0b3IuZmllbGQsXG4gICAgICAgICAgICBldmFsOiBmdW5jdGlvbihmb3JtdWxhLCBmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FsY1NvdXJjZSA9IHNlbGYuZ3JpZC5kYXRhLmNhbGNTb3VyY2U7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGNTb3VyY2UuZ2V0RXZhbHVhdG9yKCkuZXZhbHVhdGVGb3JtdWxhKGZvcm11bGEsIGNhbGNTb3VyY2UuZ2V0UGFyc2VyQ29udGV4dCgpLCBjYWxjU291cmNlLmdldEV2YWx1YXRvckNvbnRleHQoLTEsIGdyb3VwSW5mby5wYXRoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFZhbHVlLmNhbGwoc2VsZiwgcmVzdWx0LCBmb3JtYXQsIGZvcm11bGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEdyb3VwSW5mb0F0XyhvZmZzZXQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IDA7XG4gICAgICAgIHZhciBwYXRoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbiA9IHNlbGYuZ3JpZC5kYXRhLmdyb3Vwcy5sZW5ndGg7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgcGF0aCA9IFtpXTtcbiAgICAgICAgICAgIHZhciBncm91cEluZm8gPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhwYXRoKTtcbiAgICAgICAgICAgIHZhciBncm91cEhlaWdodCA9IGdyb3VwSW5mby5oZWlnaHQ7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0R3JvdXBJbmZvQXRJbnRlcm5hbF8uY2FsbChzZWxmLCBwYXRoLCBvZmZzZXQsIHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpID09PSAobGVuIC0gMSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm9vdGVyID0gZ3JvdXBJbmZvLmRhdGEuZ3JvdXBEZXNjcmlwdG9yLmZvb3RlcjtcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyICYmIGZvb3Rlci52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogJ2dyb3VwRm9vdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb246IHN0YXJ0UG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXRoID0gW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBnZXRMYXN0R3JvdXBJdGVtUGF0aF8uY2FsbCh0aGlzLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0UG9zaXRpb24gPSBzdGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldCAtPSBncm91cEhlaWdodDtcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gKz0gZ3JvdXBIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cEluZm9BdEludGVybmFsXyhwYXRoLCBvZmZzZXRUb3AsIHN0YXJ0UG9zaXRpb24pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvID0gc2VsZi5ncmlkLmdldEdyb3VwSW5mb18ocGF0aCk7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIGhlaWdodDtcbiAgICAgICAgaWYgKG9mZnNldFRvcCA8PSBncm91cEluZm8uaGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWlnaHQgPSBzZWxmLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICBpZiAob2Zmc2V0VG9wIDw9IGhlaWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb246IHN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9mZnNldFRvcCAtPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbiArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmlzQm90dG9tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZ3JvdXAuaXRlbUNvdW50OyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IHNlbGYuZ2V0Um93SGVpZ2h0Xyhncm91cC5nZXRJdGVtKGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPD0gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uOiBzdGFydFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9DT05URU5UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCAtPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvc2l0aW9uICs9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwSW5mby5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldEdyb3VwSW5mb0F0SW50ZXJuYWxfLmNhbGwoc2VsZiwgcGF0aC5zbGljZSgpLmNvbmNhdChbaV0pLCBvZmZzZXRUb3AsIHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBncm91cEluZm8uY2hpbGRyZW5baV0uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0VG9wIC09IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gKz0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb246IHN0YXJ0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0ZPT1RFUlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpdFRlc3RHcm91cF8oZ3JvdXBJbmZvLCBoZWlnaHRMZWZ0LCBhY2NIZWlnaHQsIG9mZnNldExlZnQsIG9mZnNldFRvcCwgYXJlYSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHVpZCA9IHNlbGYuZ3JpZC51aWQ7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgZ3JvdXBQYXRoID0gZ3JvdXBJbmZvLnBhdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSBncm91cEluZm8uaGVpZ2h0O1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgIHZhciByZWxhdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHZhciBvbkdyb3VwVG9nZ2xlID0gZmFsc2U7XG4gICAgICAgIHZhciBoaXRHcm91cEluZm87XG4gICAgICAgIHZhciBjaGlsZHJlbjtcbiAgICAgICAgaWYgKGhlaWdodExlZnQgPD0gaGVpZ2h0KSB7XG4gICAgICAgICAgICBoZWlnaHQgPSBzZWxmLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgICAgICAvL1RPRE86IGhvdyB0byBoYW5kbGUgY3VzdG9tIGhlYWRlciB0ZW1wbGF0ZVxuICAgICAgICAgICAgaWYgKGhlaWdodExlZnQgPD0gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZWEgPT09IFJPV19IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgaGl0R3JvdXBJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogUk9XX0hFQURFUixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFsbG93SGVhZGVyU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLmdyaWQudWlkICsgJy1naGgnICsgZ3JvdXBQYXRoLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gcmVsYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYy1oZWFkZXItc2VsZWN0LWljb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIHBvaW50SW5fLmNhbGwoc2VsZiwgb2Zmc2V0TGVmdCAtIGFjY0hlaWdodCwgb2Zmc2V0VG9wLCBlbGVtZW50LCByZWxhdGl2ZUVsZW1lbnQsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0R3JvdXBJbmZvLmdyb3VwSW5mby5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0R3JvdXBJbmZvO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHVpZCArICctZ2gnICsgZ3JvdXBQYXRoLmpvaW4oJ18nKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSByZWxhdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdjLWdyb3VwaW5nLXRvZ2dsZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRJbl8uY2FsbChzZWxmLCBvZmZzZXRMZWZ0IC0gYWNjSGVpZ2h0LCBvZmZzZXRUb3AsIGVsZW1lbnQsIHJlbGF0aXZlRWxlbWVudCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uR3JvdXBUb2dnbGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogZ3JvdXBQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWE6IEdST1VQX0hFQURFUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZFRvZ2dsZTogb25Hcm91cFRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWlnaHRMZWZ0IC09IGhlaWdodDtcbiAgICAgICAgICAgICAgICBhY2NIZWlnaHQgKz0gaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuZ3JvdXBEZXNjcmlwdG9yLmZvb3RlciAmJiBncm91cC5ncm91cERlc2NyaXB0b3IuZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnZ3JvdXAgaGl0VGVzdCBlcnJvcic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVpZ2h0TGVmdCA8PSBzZWxmLmdldEdyb3VwRm9vdGVySGVpZ2h0Xyhncm91cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEdyb3VwRm9vdGVyXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgb2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBhcmVhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ2dyb3VwIGhpdFRlc3QgZXJyb3InO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IGdyb3VwSW5mby5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IHNlbGYuZ2V0R3JvdXBIZWlnaHRfKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWlnaHRMZWZ0IDw9IGhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoaXRUZXN0R3JvdXBfLmNhbGwoc2VsZiwgZ3JvdXBJbmZvLmNoaWxkcmVuW2ldLCBoZWlnaHRMZWZ0LCBhY2NIZWlnaHQsIG9mZnNldExlZnQsIG9mZnNldFRvcCwgYXJlYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRMZWZ0IC09IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY0hlaWdodCArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoaXRHcm91cEluZm8gPSBzZWxmLmhpdFRlc3RHcm91cENvbnRlbnRfKGdyb3VwSW5mbywgYXJlYSwgb2Zmc2V0TGVmdCAtIGFjY0hlaWdodCwgb2Zmc2V0VG9wKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpdEdyb3VwSW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdEdyb3VwSW5mbztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaGl0VGVzdEdyb3VwRm9vdGVyXy5jYWxsKHNlbGYsIGdyb3VwSW5mbywgb2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBhcmVhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaXRUZXN0R3JvdXBGb290ZXJfKGdyb3VwSW5mbywgb2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBhcmVhKSB7XG4gICAgICAgIHZhciBncm91cFBhdGggPSBncm91cEluZm8ucGF0aDtcbiAgICAgICAgaWYgKGFyZWEgPT09IFJPV19IRUFERVIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYXJlYTogUk9XX0hFQURFUixcbiAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogLTEsXG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfRk9PVEVSLFxuICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdWlkID0gc2VsZi5ncmlkLnVpZDtcbiAgICAgICAgdmFyIGNlbGxFbGVtZW50O1xuICAgICAgICB2YXIgY2VsbE9mZnNldDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW4gPSBzZWxmLmdyaWQuY29sdW1ucy5sZW5ndGg7XG4gICAgICAgIHZhciBmb290ZXJFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodWlkICsgJy1nZicgKyBncm91cFBhdGguam9pbignXycpKTtcbiAgICAgICAgdmFyIGZvb3RlckVsZW1lbnRPZmZzZXQgPSBkb21VdGlsLm9mZnNldChmb290ZXJFbGVtZW50KTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNlbGxFbGVtZW50ID0gZm9vdGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYycgKyBpKTtcbiAgICAgICAgICAgIGlmIChjZWxsRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGNlbGxPZmZzZXQgPSBkb21VdGlsLm9mZnNldChjZWxsRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnQgPSBjZWxsT2Zmc2V0LmxlZnQgLSBmb290ZXJFbGVtZW50T2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldExlZnQgPj0gbGVmdCAmJiBvZmZzZXRMZWZ0IDw9IChsZWZ0ICsgY2VsbEVsZW1lbnQuY2xpZW50V2lkdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgIHBhdGg6IGdyb3VwUGF0aCxcbiAgICAgICAgICAgICAgICBhcmVhOiBHUk9VUF9GT09URVIsXG4gICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGkgPT09IGxlbiA/IC0xIDogaVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpdFRlc3RHcm91cFJvd0NvbHVtbnNfKGdyb3VwUGF0aCwgcm93LCByb3dFbGVtZW50LCBvZmZzZXRMZWZ0LCBvZmZzZXRUb3ApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYztcbiAgICAgICAgdmFyIGNvbHMgPSBzZWxmLmdyaWQuY29sdW1ucztcbiAgICAgICAgdmFyIGNvbExlbiA9IGNvbHMubGVuZ3RoO1xuICAgICAgICB2YXIgY29sRWxlbWVudDtcbiAgICAgICAgdmFyIGFjdGlvbkVsZW1lbnRzO1xuICAgICAgICB2YXIgYWN0SW5kZXg7XG4gICAgICAgIHZhciBhY3RMZW47XG4gICAgICAgIHZhciBhY3Rpb247XG4gICAgICAgIHZhciBoaXRHcm91cEluZm87XG4gICAgICAgIHZhciBpblRyZWVOb2RlID0gZmFsc2U7XG4gICAgICAgIG9mZnNldFRvcCAtPSAocm93RWxlbWVudC5zdHlsZS50b3AgPyBwYXJzZUZsb2F0KHJvd0VsZW1lbnQuc3R5bGUudG9wKSA6IDApO1xuICAgICAgICBmb3IgKGMgPSAwOyBjIDwgY29sTGVuOyBjKyspIHtcbiAgICAgICAgICAgIGNvbEVsZW1lbnQgPSByb3dFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jJyArIGMpO1xuICAgICAgICAgICAgaWYgKGNvbEVsZW1lbnQgJiYgcG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBjb2xFbGVtZW50LCByb3dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlRWxlbWVudCA9IGNvbEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmdjLXRyZWUtbm9kZScpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlRWxlbWVudCAmJiBwb2ludEluXy5jYWxsKHNlbGYsIG9mZnNldExlZnQsIG9mZnNldFRvcCwgbm9kZUVsZW1lbnQsIHJvd0VsZW1lbnQsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGluVHJlZU5vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbHNbY10uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbkVsZW1lbnRzID0gY29sRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoYWN0SW5kZXggPSAwLCBhY3RMZW4gPSBhY3Rpb25FbGVtZW50cy5sZW5ndGg7IGFjdEluZGV4IDwgYWN0TGVuOyBhY3RJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBhY3Rpb25FbGVtZW50c1thY3RJbmRleF0sIHJvd0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gc2VsZi5ncmlkLmdldEFjdGlvbkhhbmRsZXJfKGNvbHNbY10uaWQsIGFjdGlvbkVsZW1lbnRzW2FjdEluZGV4XS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWN0aW9uJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdGlvbiA9IGhpdFRlc3RUb3VjaFBhbmVsXyhzZWxmLmdyaWQsIGNvbHMsIG9mZnNldExlZnQsIG9mZnNldFRvcCwgcm93RWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBoaXRHcm91cEluZm8gPSB7XG4gICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfQ09OVEVOVCxcbiAgICAgICAgICAgICAgICBwYXRoOiBncm91cFBhdGgsXG4gICAgICAgICAgICAgICAgcm93OiByb3csXG4gICAgICAgICAgICAgICAgY29sdW1uOiBjID09PSBjb2xMZW4gPyAtMSA6IGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGluVHJlZU5vZGUpIHtcbiAgICAgICAgICAgIGhpdEdyb3VwSW5mby5ncm91cEluZm8uaW5UcmVlTm9kZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICAgICAgaGl0R3JvdXBJbmZvLmdyb3VwSW5mby5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpdEdyb3VwSW5mbztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb250ZW50V2lkdGhfKGdyaWQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBncmlkLmRhdGE7XG4gICAgICAgIGlmIChoYXNHcm91cF8oZ3JpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnJlZHVjZShncmlkLmdyb3VwSW5mb3NfLCBmdW5jdGlvbihzdW0sIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VtICsgaXRlbS5oZWlnaHQ7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLml0ZW1Db3VudCAqIGdyaWQub3B0aW9ucy5yb3dIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb250ZW50SGVpZ2h0XyhncmlkKSB7XG4gICAgICAgIC8vVE9ETzogbmVlZCB0byByZWNhY3VsYXRlIHJvdyByZWN0IGlmIHJvdyB0ZW1wbGF0ZVxuICAgICAgICByZXR1cm4gXy5yZWR1Y2UoZ3JpZC5jb2x1bW5zLCBmdW5jdGlvbihzdW0sIGNvbCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1bSArICgoIWNvbC52aXNpYmxlIHx8IGlzVG91Y2hBY3Rpb25Db2x1bW5fKGNvbCkpID8gMCA6IGNvbC52aXNpYmxlV2lkdGgpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNHcm91cF8oZ3JpZCkge1xuICAgICAgICByZXR1cm4gZ3JpZC5kYXRhLmdyb3VwcyAmJiBncmlkLmRhdGEuZ3JvdXBzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVuZGVyZWRDb2x1bW5IZWFkZXJJbmZvXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmNvbHVtbkhlYWRlckhUTUwgPSBzZWxmLmNvbHVtbkhlYWRlckhUTUwgfHwgZ2V0VGVtcGxhdGVfLmNhbGwodGhpcywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBzZWxmLmdyaWQudWlkICsgJy1jaCcsXG4gICAgICAgICAgICAgICAgaXNSb3dSb2xlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2MtY29sdW1uLWhlYWRlciBjaCcsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogc2VsZi5jb2x1bW5IZWFkZXJIVE1MXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlXyhpc0NvbHVtbkhlYWRlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghaXNDb2x1bW5IZWFkZXIgJiYgc2VsZi5jYWNoZWRUbXBsRm5fKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jYWNoZWRUbXBsRm5fO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IGdldFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHRoaXMsIGlzQ29sdW1uSGVhZGVyKTtcbiAgICAgICAgdmFyIG9sZENvbFRtcGw7XG4gICAgICAgIHZhciBuZXdDb2xUbXBsO1xuICAgICAgICB2YXIgY3NzTmFtZTtcbiAgICAgICAgdmFyIHRhZ05hbWU7XG4gICAgICAgIHZhciBjb2xUbXBsO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdGVtcGxhdGVTdHIgPSBmaWx0ZXJBY3Rpb25Db2x1bW5fLmNhbGwodGhpcywgdGVtcGxhdGVTdHIpO1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvbVV0aWwuY3JlYXRlVGVtcGxhdGVFbGVtZW50KHRlbXBsYXRlU3RyKTtcbiAgICAgICAgLy9EaWZmZXJlbnQgYnJvd3NlcnMgbWF5IHJldHVybiBkaWZmZXJlbnQgaW5uZXJIVE1McyBjb21wYXJlZCB3aXRoIHRoZSBvcmlnaW5hbCBIVE1MLFxuICAgICAgICAvL3RoZXkgbWF5IHJlb3JkZXIgdGhlIGF0dHJpYnV0ZSBvZiBhIHRhZyxlc2NhcGVzIHRhZ3Mgd2l0aCBpbnNpZGUgYSBub3NjcmlwdCB0YWcgZXRjLlxuICAgICAgICB0ZW1wbGF0ZVN0ciA9IGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dChlbGVtZW50KTtcblxuICAgICAgICB2YXIgdHJlZUNvbElkID0gZ2V0VHJlZUNvbHVtbl8oZ3JpZCk7XG4gICAgICAgIHZhciBhbm5vdGF0aW9uQ29scyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29sdW1uXScpO1xuICAgICAgICBfLmVhY2goYW5ub3RhdGlvbkNvbHMsIGZ1bmN0aW9uKGFubm90YXRpb25Db2wsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgY29sID0gZ3JpZC5nZXRDb2xCeUlkXyhhbm5vdGF0aW9uQ29sLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2x1bW4nKSk7XG4gICAgICAgICAgICB2YXIgY29sSWQgPSBjb2wuaWQ7XG4gICAgICAgICAgICB2YXIgY29sQW5ub3RhdGlvbjtcbiAgICAgICAgICAgIGlmIChjb2wuaXNDYWxjQ29sdW1uXykge1xuICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSAne3s9aXQuJyArIGNvbElkICsgJ319JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFGaWVsZHMgPSBjb2wuZGF0YUZpZWxkID8gY29sLmRhdGFGaWVsZC5zcGxpdCgnLCcpIDogW107XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFGaWVsZHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSAne3s9aXQuJyArIGNvbC5kYXRhRmllbGQgKyAnfX0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gW107XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChkYXRhRmllbGRzLCBmdW5jdGlvbihkYXRhRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaChncmlkLmdldENvbEJ5SWRfKGRhdGFGaWVsZCkucHJlc2VudGVyIHx8ICd7ez1pdC4nICsgZGF0YUZpZWxkICsgJ319Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gdGVtcC5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sVG1wbCA9IGFubm90YXRpb25Db2w7XG4gICAgICAgICAgICB0YWdOYW1lID0gY29sVG1wbC50YWdOYW1lO1xuICAgICAgICAgICAgb2xkQ29sVG1wbCA9IGRvbVV0aWwuZ2V0RWxlbWVudE91dGVyVGV4dChjb2xUbXBsKTtcbiAgICAgICAgICAgIGNzc05hbWUgPSAoaXNDb2x1bW5IZWFkZXIgPyAnZ2MtY29sdW1uLWhlYWRlci1jZWxsJyA6ICdnYy1jZWxsJykgKyAnIGMnICsgaW5kZXggKyAoY29sLmNzc0NsYXNzID8gKCcgJyArIGNvbC5jc3NDbGFzcykgOiAnJyk7XG5cbiAgICAgICAgICAgIHZhciBpbm5lclByZXNlbnRlcjtcbiAgICAgICAgICAgIGlmIChjb2wuYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJQcmVzZW50ZXIgPSBpc0NvbHVtbkhlYWRlciA/IChjb2wuY2FwdGlvbiB8fCAnJykgOiBjcmVhdGVBY3Rpb25Db2x1bW5fLmNhbGwoc2VsZiwgY29sKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5uZXJQcmVzZW50ZXIgPSBpc0NvbHVtbkhlYWRlciA/IGNvbC5jYXB0aW9uIDogKGNvbC5wcmVzZW50ZXIgPyBjb2wucHJlc2VudGVyIDogY29sQW5ub3RhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNDb2x1bW5IZWFkZXIgJiYgZ3JpZC5kYXRhLmlzSGllcmFyY2hpY2FsICYmIGNvbElkID09PSB0cmVlQ29sSWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJlZUNvbFByZXNlbnRlciA9ICc8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDp7ez1pdC5ub2RlLm9mZnNldH19cHg7ZGlzcGxheTogaW5saW5lLWJsb2NrO1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJnYy1pY29uIGdjLXRyZWUtbm9kZSB7ez8gaXQubm9kZS5jb2xsYXBzZWR9fWNvbGxhcHNlZHt7Pz99fWV4cGFuZGVke3s/fX1cIiBzdHlsZT1cInZpc2liaWxpdHk6e3s/IGl0Lm5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9MH19dmlzaWJsZXt7Pz99fWhpZGRlbnt7P319O1wiPjwvc3Bhbj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIGlubmVyUHJlc2VudGVyID0gdHJlZUNvbFByZXNlbnRlciArIGlubmVyUHJlc2VudGVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdDb2xUbXBsID0gb2xkQ29sVG1wbC5zbGljZSgwLCBvbGRDb2xUbXBsLmxlbmd0aCAtICh0YWdOYW1lLmxlbmd0aCArIDMpKSArXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTtcIiBjbGFzcz1cIicgKyBjc3NOYW1lICsgJ1wiJyArIChpc0NvbHVtbkhlYWRlciA/ICcnIDogJyByb2xlPVwiZ3JpZGNlbGxcIicpICsgJz4nICsgaW5uZXJQcmVzZW50ZXIgK1xuICAgICAgICAgICAgICAgIChpc0NvbHVtbkhlYWRlciA/IGdldFNvcnRJbmRpY2F0b3JIdG1sXyhzZWxmLCBjb2wsIGluZGV4KSA6ICcnKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PjwvJyArIHRhZ05hbWUgKyAnPic7XG5cbiAgICAgICAgICAgIC8vb3V0ZXJIVE1MIHJldHVybnMgZG91YmxlIHF1b3RlcyBpbiBhdHRyaWJ1dGUgc29tZXRpbWVzXG4gICAgICAgICAgICBpZiAodGVtcGxhdGVTdHIuaW5kZXhPZihvbGRDb2xUbXBsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBqc2NzOmRpc2FibGUgdmFsaWRhdGVRdW90ZU1hcmtzXG4gICAgICAgICAgICAgICAgLypqc2hpbnQgcXVvdG1hcms6IGRvdWJsZSAqL1xuICAgICAgICAgICAgICAgIG9sZENvbFRtcGwgPSBvbGRDb2xUbXBsLnJlcGxhY2UoL1wiL2csIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAvLyBqc2NzOmVuYWJsZSB2YWxpZGF0ZVF1b3RlTWFya3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBsYXRlU3RyID0gdGVtcGxhdGVTdHIucmVwbGFjZShvbGRDb2xUbXBsLCBuZXdDb2xUbXBsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFpc0NvbHVtbkhlYWRlcikge1xuICAgICAgICAgICAgc2VsZi5jYWNoZWRUbXBsRm5fID0gZG9ULnRlbXBsYXRlKHRlbXBsYXRlU3RyLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhY2hlZFRtcGxGbl87XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlU3RyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRyZWVDb2x1bW5fKGdyaWQpIHtcbiAgICAgICAgdmFyIGhpZXJhcmNoeSA9IGdyaWQub3B0aW9ucy5oaWVyYXJjaHk7XG4gICAgICAgIHZhciBjb2xzID0gZ3JpZC5jb2x1bW5zO1xuICAgICAgICBpZiAoaGllcmFyY2h5ICYmIGhpZXJhcmNoeS5jb2x1bW4pIHtcbiAgICAgICAgICAgIHZhciBjb2wgPSBfLmZpbmQoY29scywgXy5tYXRjaGVzUHJvcGVydHkoJ2lkJywgaGllcmFyY2h5LmNvbHVtbikpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbCA/IGNvbC5pZCA6IGNvbHNbMF0uaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29sc1swXS5pZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJhd1Jvd1RlbXBsYXRlXyhpc0NvbHVtbkhlYWRlcikge1xuICAgICAgICByZXR1cm4gZ2V0VXNlckRlZmluZWRUZW1wbGF0ZV8uY2FsbCh0aGlzLCBpc0NvbHVtbkhlYWRlcikgfHwgZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXy5jYWxsKHRoaXMsIGlzQ29sdW1uSGVhZGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25zb2xpZGF0ZUNvbHVtbldpZHRoXygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdG1wbCA9IGdldFVzZXJEZWZpbmVkVGVtcGxhdGVfLmNhbGwodGhpcyk7XG4gICAgICAgIGlmICh0bXBsKSB7XG4gICAgICAgICAgICB2YXIgZGl2ID0gJzxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTEwMDAwcHg7bGVmdDotMTAwMDBweDt3aWR0aDo1MDAwcHg7aGVpZ2h0OjUwMDBweDtcIj4nICsgdG1wbCArICc8L2Rpdj4nO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoZGl2KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgY29sRWxlbTtcbiAgICAgICAgICAgIF8uZWFjaChzZWxmLmdyaWQuY29sdW1ucywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICAgICAgY29sRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvbHVtbj1cIicgKyBjb2wuaWQgKyAnXCJdJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbEVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29sLnZpc2libGVXaWR0aCA9IGRvbVV0aWwuZ2V0RWxlbWVudFJlY3QoY29sRWxlbSkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVzZXJEZWZpbmVkVGVtcGxhdGVfKGlzQ29sdW1uSGVhZGVyKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHJvd1RtcGwgPSBpc0NvbHVtbkhlYWRlciA/IChvcHRpb25zLmNvbHVtbkhlYWRlclRlbXBsYXRlIHx8IG9wdGlvbnMucm93VGVtcGxhdGUpIDogb3B0aW9ucy5yb3dUZW1wbGF0ZTtcbiAgICAgICAgICAgIGlmIChyb3dUbXBsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcocm93VG1wbCkgJiYgcm93VG1wbC5sZW5ndGggPiAxICYmIHJvd1RtcGxbMF0gPT09ICcjJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyb3dUbXBsLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRtcGxFbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm93VG1wbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXyhpc0NvbHVtbkhlYWRlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjb2xzID0gc2VsZi5ncmlkLmNvbHVtbnM7XG4gICAgICAgIHZhciB0b3AgPSAwO1xuICAgICAgICB2YXIgd2lkdGggPSBpc0NvbHVtbkhlYWRlciA/IHNlbGYub3B0aW9ucy5jb2xIZWFkZXJIZWlnaHQgOiBzZWxmLm9wdGlvbnMucm93SGVpZ2h0O1xuICAgICAgICB2YXIgaGVpZ2h0ID0gZ2V0Q29udGVudEhlaWdodF8oc2VsZi5ncmlkKTtcbiAgICAgICAgdmFyIHIgPSAnPGRpdiBzdHlsZT1cIndpZHRoOicgKyB3aWR0aCArICdweDtoZWlnaHQ6JyArIGhlaWdodCArICdweDtcIj4nO1xuICAgICAgICBfLmVhY2goY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICBpZiAoY29sLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByICs9ICc8ZGl2IGNsYXNzPVwiZ2MtY29sdW1uXCIgc3R5bGU9XCJ3aWR0aDonICsgd2lkdGggKyAncHg7aGVpZ2h0OicgKyBjb2wudmlzaWJsZVdpZHRoICsgJ3B4O3RvcDonICsgdG9wICsgJ3B4OycgKyAoY29sLnZpc2libGUgPyAnJyA6ICdkaXNwbGF5Om5vbmUnKSArICdcIiBkYXRhLWNvbHVtbj1cIicgKyBjb2wuaWQgKyAnXCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICB0b3AgKz0gY29sLnZpc2libGVXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHIgKz0gJzwvZGl2Pic7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckFjdGlvbkNvbHVtbl8odGVtcGxhdGVTdHIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuaW5uZXJIVE1MID0gdGVtcGxhdGVTdHI7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgYW5ub3RhdGlvbkNvbHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbHVtbl0nKTtcbiAgICAgICAgXy5lYWNoKGFubm90YXRpb25Db2xzLCBmdW5jdGlvbihhbm5vdGF0aW9uQ29sKSB7XG4gICAgICAgICAgICB2YXIgY29sID0gZ3JpZC5nZXRDb2xCeUlkXyhhbm5vdGF0aW9uQ29sLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2x1bW4nKSk7XG4gICAgICAgICAgICBpZiAoaXNUb3VjaEFjdGlvbkNvbHVtbl8oY29sKSkge1xuICAgICAgICAgICAgICAgIGFubm90YXRpb25Db2wuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0KGRpdik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SGVhZGVyQ2VsbFJlbmRlckluZm9fKGN1cnJlbnRJbmZvLCBpdGVtSW5kZXgsIGhlaWdodCwgb2Zmc2V0TGVmdCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBrZXkgPSBnZXRSb3dIZWFkZXJDZWxsS2V5Xy5jYWxsKHNlbGYsIGN1cnJlbnRJbmZvLCBpdGVtSW5kZXgpO1xuICAgICAgICByZXR1cm4gYnVpbGRIZWFkZXJDZWxsXy5jYWxsKHNlbGYsIGtleSwgY3VycmVudEluZm8sIChjdXJyZW50SW5mbyA/IGZhbHNlIDogdHJ1ZSksIChpdGVtSW5kZXggPyAoaXRlbUluZGV4ICogaGVpZ2h0KSA6IG9mZnNldExlZnQpLCBoZWlnaHQsIGl0ZW1JbmRleCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SGVhZGVyQ2VsbEtleV8oY3VycmVudEluZm8sIGl0ZW1JbmRleCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBrZXkgPSBzZWxmLmdyaWQudWlkO1xuICAgICAgICBpZiAoY3VycmVudEluZm8pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50SW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICBrZXkgKz0gKCctZ2hoJyArIGN1cnJlbnRJbmZvLnBhdGguam9pbignLScpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgIGtleSArPSAoJy1ncmgnICsgY3VycmVudEluZm8ucGF0aC5qb2luKCctJykgKyAnLXInICsgY3VycmVudEluZm8uaXRlbUluZGV4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5ICs9ICgnLWdmaCcgKyBjdXJyZW50SW5mby5wYXRoLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXkgKz0gKCctcmgnICsgaXRlbUluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRIZWFkZXJDZWxsXyhrZXksIGluZm8sIGlzUm93Um9sZSwgbGVmdCwgaGVpZ2h0LCBpdGVtSW5kZXgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIHNob3dDaGVja2JveCA9IHRydWU7XG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHNlbGVjdGVkUm93cyA9IHNlbGYuc2VsZWN0ZWRSb3dzXztcbiAgICAgICAgdmFyIGNoZWNrYm94U2VsZWN0YWJsZSA9IHNlbGYub3B0aW9ucy5hbGxvd0hlYWRlclNlbGVjdDtcbiAgICAgICAgaWYgKGNoZWNrYm94U2VsZWN0YWJsZSkge1xuICAgICAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcHBpbmdzID0gZ2V0R3JvdXBNYXBwaW5nXyhncmlkLmdldEdyb3VwSW5mb18oaW5mby5wYXRoKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBtYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGVja2VkID0gc2VsZWN0ZWRSb3dzICYmIHNlbGVjdGVkUm93cy5pbmRleE9mKG1hcHBpbmdzW2ldKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmZvLmFyZWEgPT09IEdST1VQX0ZPT1RFUikge1xuICAgICAgICAgICAgICAgICAgICBzaG93Q2hlY2tib3ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZ3JpZC5nZXRHcm91cEluZm9fKGluZm8ucGF0aCkuZGF0YS50b1NvdXJjZVJvdyhpbmZvLml0ZW1JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZCA9IHNlbGVjdGVkUm93cyAmJiBzZWxlY3RlZFJvd3MuaW5kZXhPZihyb3cpICE9PSAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZCA9IHNlbGVjdGVkUm93cyAmJiBzZWxlY3RlZFJvd3MuaW5kZXhPZihncmlkLmRhdGEudG9Tb3VyY2VSb3coaXRlbUluZGV4KSkgIT09IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIGlzUm93Um9sZTogaXNSb3dSb2xlLFxuICAgICAgICAgICAgcmVuZGVySW5mbzoge1xuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2Mtcm93LWhlYWRlcicsXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBzZWxmLm9wdGlvbnMucm93SGVhZGVyV2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTDogJzxkaXYgY2xhc3M9XCJnYy1yb3ctaGVhZGVyLWNlbGxcIj4nICsgKGNoZWNrYm94U2VsZWN0YWJsZSAmJiBzaG93Q2hlY2tib3ggPyAnPGRpdiBpZD1cIicgKyBrZXkgKyAnLXNlbGVjdFwiIGNsYXNzPVwiZ2MtaWNvbiBnYy1oZWFkZXItc2VsZWN0LWljb24nICsgKGlzQ2hlY2tlZCA/ICcgc2VsZWN0ZWQnIDogJycpICsgJ1wiPjwvZGl2PicgOiAnJykgKyAnPC9kaXY+J1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93c1JlbmRlckluZm9fKGFyZWEsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzY29wZS5ncmlkO1xuICAgICAgICB2YXIgdWlkID0gZ3JpZC51aWQ7XG4gICAgICAgIHZhciBjdXJyTGF5b3V0SW5mbyA9IHNjb3BlLmdldExheW91dEluZm8oKVthcmVhXTtcbiAgICAgICAgdmFyIHIgPSB7fTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciByb3dIZWlnaHQgPSBzY29wZS5vcHRpb25zLnJvd0hlaWdodDtcblxuICAgICAgICB2YXIgcmVuZGVyUmFuZ2UgPSBnZXRSZW5kZXJSYW5nZUluZm9fLmNhbGwoc2NvcGUsIGFyZWEsIGN1cnJMYXlvdXRJbmZvLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKGFyZWEgPT09IFZJRVdQT1JUKSB7XG4gICAgICAgICAgICByLmxlZnQgPSAtb3B0aW9ucy5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgci50b3AgPSAtb3B0aW9ucy5vZmZzZXRUb3A7XG4gICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IFtdO1xuICAgICAgICAgICAgaWYgKGhhc0dyb3VwXyhncmlkKSkge1xuICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gci5yZW5kZXJlZFJvd3MuY29uY2F0KGdldEdyb3VwUmVuZGVySW5mb18uY2FsbCh0aGlzLCByZW5kZXJSYW5nZS5zdGFydCwgcmVuZGVyUmFuZ2UuZW5kLCByZW5kZXJSYW5nZS5vZmZzZXRMZWZ0LCBmYWxzZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSByZW5kZXJSYW5nZS5zdGFydDsgaSA8IHJlbmRlclJhbmdlLmVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB1aWQgKyAnLXInICsgaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiByb3dIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZWEgPT09IFJPV19IRUFERVIpIHtcbiAgICAgICAgICAgIHIubGVmdCA9IC1vcHRpb25zLm9mZnNldExlZnQgfHwgMDtcbiAgICAgICAgICAgIHIudG9wID0gMDtcbiAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzID0gW107XG5cbiAgICAgICAgICAgIGlmIChoYXNHcm91cF8oZ3JpZCkpIHtcbiAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IHIucmVuZGVyZWRSb3dzLmNvbmNhdChnZXRHcm91cFJlbmRlckluZm9fLmNhbGwodGhpcywgcmVuZGVyUmFuZ2Uuc3RhcnQsIHJlbmRlclJhbmdlLmVuZCwgcmVuZGVyUmFuZ2Uub2Zmc2V0TGVmdCwgdHJ1ZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSByZW5kZXJSYW5nZS5zdGFydDsgaSA8IHJlbmRlclJhbmdlLmVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHIucmVuZGVyZWRSb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB1aWQgKyAnLXJoJyArIGksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogcm93SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmVhID09PSBDT0xVTU5fSEVBREVSKSB7XG4gICAgICAgICAgICByLmxlZnQgPSAwO1xuICAgICAgICAgICAgci50b3AgPSAtb3B0aW9ucy5vZmZzZXRUb3A7XG4gICAgICAgICAgICByLnJlbmRlcmVkUm93cyA9IFtdO1xuICAgICAgICAgICAgci5yZW5kZXJlZFJvd3MucHVzaCh7a2V5OiB1aWQgKyAnLWNoJ30pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zXyhsYXlvdXRJbmZvLCBwb2ludCkge1xuICAgICAgICByZXR1cm4gcG9pbnQubGVmdCA+PSBsYXlvdXRJbmZvLmxlZnQgJiYgcG9pbnQudG9wID49IGxheW91dEluZm8udG9wICYmIHBvaW50LmxlZnQgPD0gKGxheW91dEluZm8ubGVmdCArIGxheW91dEluZm8ud2lkdGgpICYmIHBvaW50LnRvcCA8PSAobGF5b3V0SW5mby50b3AgKyBsYXlvdXRJbmZvLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRJbl8ob2Zmc2V0TGVmdCwgb2Zmc2V0VG9wLCBlbGVtZW50LCByZWxhdGl2ZUVsZW1lbnQsIGVubGFyZ2UpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZWxlT2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQoZWxlbWVudCk7XG4gICAgICAgIHZhciB0YXJnZXRFbGVPZmZzZXQgPSBkb21VdGlsLm9mZnNldChyZWxhdGl2ZUVsZW1lbnQpO1xuICAgICAgICB2YXIgbGVmdCA9IGVsZU9mZnNldC5sZWZ0IC0gdGFyZ2V0RWxlT2Zmc2V0LmxlZnQ7XG4gICAgICAgIHZhciB0b3AgPSBlbGVPZmZzZXQudG9wIC0gdGFyZ2V0RWxlT2Zmc2V0LnRvcDtcbiAgICAgICAgdmFyIGVsZW1lbnRSZWN0ID0gZG9tVXRpbC5nZXRFbGVtZW50UmVjdChlbGVtZW50KTtcbiAgICAgICAgdmFyIGVubGFyZ2VsZW5ndGggPSAoZW5sYXJnZSAmJiBzZWxmLmdyaWQuaXNUb3VjaE1vZGUpID8gMTAgOiAwO1xuICAgICAgICBsZWZ0IC09IGVubGFyZ2VsZW5ndGg7XG4gICAgICAgIHRvcCAtPSBlbmxhcmdlbGVuZ3RoO1xuICAgICAgICB2YXIgcmlnaHQgPSBsZWZ0ICsgZWxlbWVudFJlY3Qud2lkdGggKyAyICogZW5sYXJnZWxlbmd0aDtcbiAgICAgICAgdmFyIGJvdHRvbSA9IHRvcCArIGVsZW1lbnRSZWN0LmhlaWdodCArIDIgKiBlbmxhcmdlbGVuZ3RoO1xuXG4gICAgICAgIGlmIChvZmZzZXRMZWZ0ID49IGxlZnQgJiYgb2Zmc2V0TGVmdCA8PSByaWdodCAmJlxuICAgICAgICAgICAgb2Zmc2V0VG9wID49IHRvcCAmJiBvZmZzZXRUb3AgPD0gYm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaXRUZXN0VG91Y2hQYW5lbF8oZ3JpZCwgY29scywgb2Zmc2V0TGVmdEZyb21DdXJyZW50Um93LCBvZmZzZXRUb3AsIHJvd0VsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdGlvblRvdWNoUGFuZWwgPSBnZXRUb3VjaFBhbmVsXygpO1xuICAgICAgICB2YXIgYWN0aW9uQ29sdW1uO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGFjdEluZGV4O1xuICAgICAgICB2YXIgYWN0TGVuO1xuICAgICAgICB2YXIgYWN0aW9uRWxlbWVudHM7XG4gICAgICAgIHZhciBhY3Rpb247XG4gICAgICAgIGlmIChhY3Rpb25Ub3VjaFBhbmVsKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uTGVuID0gc3dpcGVTdGF0dXMuY29sdW1ucy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWN0aW9uTGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uSW5kZXggPSBzd2lwZVN0YXR1cy5jb2x1bW5zW2ldLmluZGV4O1xuICAgICAgICAgICAgICAgIGFjdGlvbkNvbHVtbiA9IGFjdGlvblRvdWNoUGFuZWwucXVlcnlTZWxlY3RvcignLmdjLWFjdGlvbmNvbHVtbicgKyBjb2x1bW5JbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbkNvbHVtbiAmJiBwb2ludEluXyhvZmZzZXRMZWZ0RnJvbUN1cnJlbnRSb3csIG9mZnNldFRvcCwgYWN0aW9uQ29sdW1uLCByb3dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sc1tjb2x1bW5JbmRleF0uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25FbGVtZW50cyA9IGFjdGlvbkNvbHVtbi5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGFjdEluZGV4ID0gMCwgYWN0TGVuID0gYWN0aW9uRWxlbWVudHMubGVuZ3RoOyBhY3RJbmRleCA8IGFjdExlbjsgYWN0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb2ludEluXyhvZmZzZXRMZWZ0RnJvbUN1cnJlbnRSb3csIG9mZnNldFRvcCwgYWN0aW9uRWxlbWVudHNbYWN0SW5kZXhdLCByb3dFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBncmlkLmdldEFjdGlvbkhhbmRsZXJfKGNvbHNbY29sdW1uSW5kZXhdLmlkLCBhY3Rpb25FbGVtZW50c1thY3RJbmRleF0uZ2V0QXR0cmlidXRlKCdkYXRhLWFjdGlvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUb3VjaFBhbmVsXygpIHtcbiAgICAgICAgaWYgKHN3aXBlU3RhdHVzLnJvdykge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN3aXBlU3RhdHVzLnJvdy5pZCArICctdG9wLWFjdGlvblBhbmVsJykgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3dpcGVTdGF0dXMucm93LmlkICsgJy1ib3R0b20tYWN0aW9uUGFuZWwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU3R5bGVQcm9wZXJ0eVZhbHVlXyhzdHlsZSwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZV8oc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBhcmdzID0ge3BhZ2VYOiBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVgsIHBhZ2VZOiBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVl9O1xuICAgICAgICBpZiAoaGFuZGxlUG9pbnRlck1vdmVfLmNhbGwodGhpcywgc2VuZGVyLCBhcmdzLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIGUuaGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZU1vdmVfKHNlbmRlciwgZSkge1xuICAgICAgICBoYW5kbGVQb2ludGVyTW92ZV8uY2FsbCh0aGlzLCBzZW5kZXIsIGUsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBvaW50ZXJNb3ZlXyhzZW5kZXIsIGUsIG1vdXNlRXZlbnQpIHtcbiAgICAgICAgdmFyIGdyaWQgPSB0aGlzO1xuICAgICAgICB2YXIgbGF5b3V0RW5naW5lID0gZ3JpZC5sYXlvdXRFbmdpbmU7XG5cbiAgICAgICAgLy9jYWxsIGZyb20gZG9jdW1lbnQgbW91c2Vtb3ZlXG4gICAgICAgIGlmICghZSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc2VuZGVyKSA9PT0gJ1tvYmplY3QgTW91c2VFdmVudF0nKSB7XG4gICAgICAgICAgICBlID0gc2VuZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxheW91dEVuZ2luZS5pc0RyYWdEcm9waW5nXykge1xuICAgICAgICAgICAgbGF5b3V0RW5naW5lLmhpdFRlc3RJbmZvXyA9IGxheW91dEVuZ2luZS5oaXRUZXN0KGUpO1xuICAgICAgICAgICAgdmFyIHBvaW50T2Zmc2V0ID0gbGF5b3V0RW5naW5lLmRyYWdTdGFydEluZm9fLnBvaW50T2Zmc2V0O1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBsYXlvdXRFbmdpbmUuZHJhZ0Ryb3BpbmdFbGVtZW50XztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSArIHBvaW50T2Zmc2V0LnRvcCArICdweCc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYICsgcG9pbnRPZmZzZXQubGVmdCArICdweCc7XG5cbiAgICAgICAgICAgIGlmIChsYXlvdXRFbmdpbmUuaGl0VGVzdEluZm9fICYmIGxheW91dEVuZ2luZS5oaXRUZXN0SW5mb18uYXJlYSA9PT0gR1JPVVBfRFJBR19QQU5FTCkge1xuICAgICAgICAgICAgICAgIGxheW91dEVuZ2luZS5kcmFnRHJvcGluZ0VsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy5nYy1pY29uJykuY2xhc3NOYW1lID0gJ2djLWljb24gZ2MtaWNvbi1ncm91cGluZy1hZGQnO1xuICAgICAgICAgICAgICAgIHZhciBncm91cERlcyA9IGdyaWQuZGF0YS5ncm91cERlc2NyaXB0b3JzO1xuICAgICAgICAgICAgICAgIHZhciB0byA9IGdldEdyb3VwSW5zZXJ0aW5nTG9jYXRpb25fLmNhbGwobGF5b3V0RW5naW5lLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQ7XG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IGdyb3VwRGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCA9ICh0byA9PT0gbGVuID8gZ3JvdXBEZXNbbGVuIC0gMV0uZmllbGQgOiBncm91cERlc1t0b10uZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JpZC51aWQgKyAnLWdyb3VwaW5nLWluZGljYXRvci0nICsgZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kaWNhdG9yRWxlbWVudCA9IGxheW91dEVuZ2luZS5kcmFnRHJvcGluZ0luZGljYXRvckVsZW1lbnRfO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZG9tVXRpbC5vZmZzZXQoZ3JvdXBpbmdFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHRvIDwgbGVuID8gKG9mZnNldC5sZWZ0IC0gMTUpIDogKG9mZnNldC5sZWZ0ICsgZ3JvdXBpbmdFbGVtZW50LmNsaWVudFdpZHRoKSkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBpbmRpY2F0b3JFbGVtZW50LnN0eWxlLnRvcCA9IChvZmZzZXQudG9wIC0gNCkgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxheW91dEVuZ2luZS5kcmFnRHJvcGluZ0luZGljYXRvckVsZW1lbnRfLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxheW91dEVuZ2luZS5kcmFnRHJvcGluZ0VsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy5nYy1pY29uJykuY2xhc3NOYW1lID0gJ2djLWljb24gZ2MtaWNvbi1ncm91cGluZy1mb3JiaWRkZW4nO1xuICAgICAgICAgICAgICAgIGxheW91dEVuZ2luZS5kcmFnRHJvcGluZ0luZGljYXRvckVsZW1lbnRfLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXlvdXRFbmdpbmUuaGl0VGVzdEluZm9fID0gbGF5b3V0RW5naW5lLmhpdFRlc3QoZSk7XG4gICAgICAgICAgICBpZiAobGF5b3V0RW5naW5lLmRyYWdTdGFydEluZm9fICYmICFsYXlvdXRFbmdpbmUuaXNEcmFnRHJvcGluZ18gJiZcbiAgICAgICAgICAgICAgICAoKGxheW91dEVuZ2luZS5tb3VzZURvd25Qb2ludF8gJiYgZS5wYWdlWCAhPT0gbGF5b3V0RW5naW5lLm1vdXNlRG93blBvaW50Xy5sZWZ0KSB8fFxuICAgICAgICAgICAgICAgIChsYXlvdXRFbmdpbmUubW91c2VEb3duUG9pbnRfICYmIGUucGFnZVkgIT09IGxheW91dEVuZ2luZS5tb3VzZURvd25Qb2ludF8udG9wKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IHN0YXJ0RHJhZ0Ryb3BpbmdfLmNhbGwobGF5b3V0RW5naW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXRFbmdpbmUuaXNEcmFnRHJvcGluZ18gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW91c2VFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0RW5naW5lLmhhbmRsZU1vdXNlVXBGbl8gPSBoYW5kbGVNb3VzZVVwXy5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9maXggYSB3aXJlZCBidWcsIGlmIHdlIGJpbmQgbW91c2UgbW92ZSBlYXJsaWVyIGF0IHRoZSByZWdpc3RlciBtZXRob2QsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dpbGwgZmFpbCB0byByZW1vdmUgdGhlIGV2ZW50IGxpc3Rlcm5lciBsYXRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dEVuZ2luZS5oYW5kbGVNb3VzZU1vdmVGbjJfID0gaGFuZGxlTW91c2VNb3ZlXy5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbGF5b3V0RW5naW5lLmhhbmRsZU1vdXNlTW92ZUZuMl8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGxheW91dEVuZ2luZS5oYW5kbGVNb3VzZVVwRm5fKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICsgJyBuby1zZWxlY3QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIWxheW91dEVuZ2luZS5kcmFnU3RhcnRJbmZvXztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZF8oc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBhcmdzID0ge3BhZ2VYOiBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYLCBwYWdlWTogZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWX07XG4gICAgICAgIGlmIChoYW5kbGVQb2ludGVyVXBfLmNhbGwodGhpcywgYXJncywgZmFsc2UpKSB7XG4gICAgICAgICAgICBlLmhhbmRsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VVcF8oZSkge1xuICAgICAgICBoYW5kbGVQb2ludGVyVXBfLmNhbGwodGhpcywgZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlclVwXyhlLCBtb3VzZUV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcy5sYXlvdXRFbmdpbmU7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgZ3JvdXBEZXMgPSBncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycztcbiAgICAgICAgdmFyIG5lZWRJbnZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHN1Y2Nlc3M7XG4gICAgICAgIGlmIChzZWxmLmlzRHJhZ0Ryb3BpbmdfKSB7XG4gICAgICAgICAgICB2YXIgaGl0VGVzdEluZm8gPSBzZWxmLmhpdFRlc3RJbmZvXztcbiAgICAgICAgICAgIHZhciBkcmFnSGl0SW5mbyA9IHNlbGYuZHJhZ1N0YXJ0SW5mb18uaGl0VGVzdEluZm87XG4gICAgICAgICAgICB2YXIgZmllbGQ7XG4gICAgICAgICAgICBpZiAoaGl0VGVzdEluZm8gJiYgaGl0VGVzdEluZm8uYXJlYSA9PT0gR1JPVVBfRFJBR19QQU5FTCkge1xuICAgICAgICAgICAgICAgIHZhciB0byA9IGdldEdyb3VwSW5zZXJ0aW5nTG9jYXRpb25fLmNhbGwoc2VsZiwgZS5wYWdlWCwgZS5wYWdlWSk7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwaW5nUGFuZWxJbmZvID0gc2VsZi5oaXRUZXN0SW5mb18uZ3JvdXBpbmdQYW5lbEluZm87XG4gICAgICAgICAgICAgICAgaWYgKGRyYWdIaXRJbmZvLmFyZWEgPT09IENPTFVNTl9IRUFERVIgJiYgZHJhZ0hpdEluZm8uY29sdW1uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICBncm91cEluZm9zLnNwbGljZSh0bywgMCwge2ZpZWxkOiBncmlkLmNvbHVtbnNbZHJhZ0hpdEluZm8uY29sdW1uXS5pZH0pO1xuICAgICAgICAgICAgICAgICAgICBncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycyA9IGdyb3VwSW5mb3M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkcmFnSGl0SW5mby5hcmVhID09PSBHUk9VUF9EUkFHX1BBTkVMICYmIGRyYWdIaXRJbmZvLmdyb3VwaW5nUGFuZWxJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tR3JvdXBGaWVsZCA9IGRyYWdIaXRJbmZvLmdyb3VwaW5nUGFuZWxJbmZvLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCA9IGdyb3VwaW5nUGFuZWxJbmZvID8gZ3JvdXBpbmdQYW5lbEluZm8uZmllbGQgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkID09PSBmcm9tR3JvdXBGaWVsZCB8fCAoIWZpZWxkICYmIGdyb3VwRGVzW2dyb3VwRGVzLmxlbmd0aCAtIDFdLmZpZWxkID09PSBmcm9tR3JvdXBGaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRJbnZhbGlkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSBncm91cERlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwRGVzW2ldLmZpZWxkID09PSBmcm9tR3JvdXBGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyb20gPCB0bykgeyAvL2ZpeCBidWcsIGlmIHJlb3JkZXIgZnJvbSBsZWZ0IHRvIHJpZ2h0LCB3ZSBzaG91bGQgaW5zZXJ0IGJlZm9yZSB0byBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gPSB0byAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG8gPT09IGZyb20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWVkSW52YWxpZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cERlcy5zcGxpY2UodG8sIDAsIGdyb3VwRGVzLnNwbGljZShmcm9tLCAxKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAgLy9yZW1vdmUgZ3JvdXBpbmdcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ0hpdEluZm8uYXJlYSA9PT0gQ09MVU1OX0hFQURFUiAmJiBkcmFnSGl0SW5mby5jb2x1bW4gPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCA9IHNlbGYuZ3JpZC5jb2x1bW5zW2RyYWdIaXRJbmZvLmNvbHVtbl0uaWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkcmFnSGl0SW5mby5hcmVhID09PSBHUk9VUF9EUkFHX1BBTkVMICYmIGRyYWdIaXRJbmZvLmdyb3VwaW5nUGFuZWxJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkID0gZHJhZ0hpdEluZm8uZ3JvdXBpbmdQYW5lbEluZm8uZmllbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdyaWQuZGF0YS5ncm91cERlc2NyaXB0b3JzID0gXy5yZW1vdmUoc2VsZi5ncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycywgZnVuY3Rpb24oaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluZm8uZmllbGQgIT09IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNlbGYuZHJhZ0Ryb3BpbmdFbGVtZW50Xyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNlbGYuZHJhZ0Ryb3BpbmdJbmRpY2F0b3JFbGVtZW50Xyk7XG4gICAgICAgICAgICBzZWxmLmRyYWdEcm9waW5nRWxlbWVudF8gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5kcmFnRHJvcGluZ0luZGljYXRvckVsZW1lbnRfID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChtb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2VsZi5oYW5kbGVNb3VzZU1vdmVGbjJfKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc2VsZi5oYW5kbGVNb3VzZVVwRm5fKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZU1vdXNlTW92ZUZuMl8gPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGYuaGFuZGxlTW91c2VVcEZuXyA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgnbm8tc2VsZWN0JywgJycpO1xuICAgICAgICAgICAgaWYgKG5lZWRJbnZhbGlkYXRlKSB7XG4gICAgICAgICAgICAgICAgZ3JpZC5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYubW91c2VEb3duUG9pbnRfID0gbnVsbDtcbiAgICAgICAgc2VsZi5pc0RyYWdEcm9waW5nXyA9IGZhbHNlO1xuICAgICAgICBzZWxmLmRyYWdTdGFydEluZm9fID0gbnVsbDtcbiAgICAgICAgc2VsZi5oaXRUZXN0SW5mb18gPSBudWxsO1xuICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTd2lwZV8oc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IHNlbmRlci5sYXlvdXRFbmdpbmU7XG4gICAgICAgIHZhciByZWxhdGVkUm93O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdkaXN0YW5jZTogJyArIGUubW92ZURpc3RhbmNlKTtcbiAgICAgICAgaWYgKGUuc3dpcGVTdGF0dXMgPT09ICdzd2lwZXN0YXJ0Jykge1xuICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvXyA9IGxheW91dEVuZ2luZS5oaXRUZXN0KHtwYWdlWDogZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYLCBwYWdlWTogZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZfSk7XG4gICAgICAgICAgICBpZiAoaGl0VGVzdEluZm9fICYmIGhpdFRlc3RJbmZvXy5hcmVhID09PSBWSUVXUE9SVCkge1xuICAgICAgICAgICAgICAgIHJlbGF0ZWRSb3cgPSBnZXRSZWxhdGVkTW92ZVJvdy5jYWxsKGxheW91dEVuZ2luZSwgaGl0VGVzdEluZm9fKTtcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3BFZGl0aW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKHN3aXBlU3RhdHVzLnJvdyAmJiByZWxhdGVkUm93ICE9PSBzd2lwZVN0YXR1cy5yb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VUb3VjaFBhbmVsLmNhbGwoc2VsZik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpcGVTdGF0dXMgPSB7fTtcbiAgICAgICAgICAgICAgICBzd2lwZVN0YXR1cy5yb3cgPSByZWxhdGVkUm93O1xuICAgICAgICAgICAgICAgIGlmIChzd2lwZVN0YXR1cy5yb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVTdGF0dXMuYWN0aW9uVHlwZSA9IGdldEFjdGlvblR5cGUoZS5tb3ZlRGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBzd2lwZVN0YXR1cy5jb2x1bW5zID0gY3JlYXRlQWN0aW9uQ29sdW1ucy5jYWxsKGxheW91dEVuZ2luZSk7XG4gICAgICAgICAgICAgICAgICAgIHN3aXBlU3RhdHVzLmNvbHVtbnNUb3RhbFdpZHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN3aXBlU3RhdHVzLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGggKz0gY29sLnBlcmZlcnJlZFNpemU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChnZXRUb3VjaFBhbmVsXygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXBlU3RhdHVzLmJlZ2luV2l0aFRvdWNoUGFuZWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlLnN3aXBlU3RhdHVzID09PSAnc3dpcGVtb3ZpbmcnKSB7XG4gICAgICAgICAgICBpZiAoc3dpcGVTdGF0dXMucm93KSB7XG4gICAgICAgICAgICAgICAgc3dpcGVTdGF0dXMubW92ZURpc3RhbmNlID0gZS5tb3ZlRGlzdGFuY2UgKyAoc3dpcGVTdGF0dXMuYmVnaW5XaXRoVG91Y2hQYW5lbCA/IChzd2lwZVN0YXR1cy5hY3Rpb25UeXBlID09PSAndG9wJyA/IDEgOiAtMSkgKiBzd2lwZVN0YXR1cy5jb2x1bW5zVG90YWxXaWR0aCA6IDApO1xuICAgICAgICAgICAgICAgIGlmIChpc1JldmVyc2VNb3ZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFjdGlvblJvdy5jYWxsKHNlbGYsIC1zd2lwZVN0YXR1cy5tb3ZlRGlzdGFuY2UsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoc3dpcGVTdGF0dXMubW92ZURpc3RhbmNlKSA+IHN3aXBlU3RhdHVzLmNvbHVtbnNUb3RhbFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBY3Rpb25Sb3cuY2FsbChzZWxmLCAtc3dpcGVTdGF0dXMubW92ZURpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWN0aW9uUm93LmNhbGwoc2VsZiwgLXN3aXBlU3RhdHVzLm1vdmVEaXN0YW5jZSwgTWF0aC5hYnMoc3dpcGVTdGF0dXMubW92ZURpc3RhbmNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN3aXBlU3RhdHVzLnJvdykge1xuICAgICAgICAgICAgICAgIHN3aXBlU3RhdHVzLm1vdmVEaXN0YW5jZSA9IGUubW92ZURpc3RhbmNlICsgKHN3aXBlU3RhdHVzLmJlZ2luV2l0aFRvdWNoUGFuZWwgPyAoc3dpcGVTdGF0dXMuYWN0aW9uVHlwZSA9PT0gJ3RvcCcgPyAxIDogLTEpICogc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGggOiAwKTtcbiAgICAgICAgICAgICAgICB2YXIgdiA9IE1hdGguYWJzKGUudmVsb2NpdHkpO1xuICAgICAgICAgICAgICAgIGlmIChpc1JldmVyc2VNb3ZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFjdGlvblJvdy5jYWxsKHNlbGYsIDAsIDAsIHRydWUsIHYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodiA+IEZMSUNLX1RIUkVTSE9MRF9WKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzd2lwZVN0YXR1cy5iZWdpbldpdGhUb3VjaFBhbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWN0aW9uUm93LmNhbGwoc2VsZiwgMCwgMCwgdHJ1ZSwgdik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVGbGlja0dlc3R1cmUuY2FsbChzZWxmLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzd2lwZVN0YXR1cy5tb3ZlRGlzdGFuY2UpIDwgc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGggLyAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWN0aW9uUm93LmNhbGwoc2VsZiwgMCwgMCwgdHJ1ZSwgdik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWN0aW9uUm93LmNhbGwoc2VsZiwgKHN3aXBlU3RhdHVzLm1vdmVEaXN0YW5jZSA+IDAgPyAtMSA6IDEpICogc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGgsIHN3aXBlU3RhdHVzLmNvbHVtbnNUb3RhbFdpZHRoLCB0cnVlLCB2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUZsaWNrR2VzdHVyZShlKSB7XG4gICAgICAgIHZhciBncmlkID0gdGhpcztcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgYWdycztcbiAgICAgICAgdmFyIGhpdEluZm87XG4gICAgICAgIHZhciBmbjtcblxuICAgICAgICB2YXIgYWN0aW9uID0gZmluZEV4ZWN1dGVGbGlja0FjdGlvbi5jYWxsKGdyaWQpO1xuICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi5hY3Rpb25IYW5kbGVyKSB7XG4gICAgICAgICAgICByZWZyZXNoQWN0aW9uUm93LmNhbGwoZ3JpZCwgKHN3aXBlU3RhdHVzLm1vdmVEaXN0YW5jZSA+IDAgPyAtMSA6IDEpICogc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGgsIHN3aXBlU3RhdHVzLmNvbHVtbnNUb3RhbFdpZHRoLCBmYWxzZSwgZS52ZWxvY2l0eSk7XG4gICAgICAgICAgICBhZ3JzID0ge3BhZ2VYOiBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYLCBwYWdlWTogZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWX07XG4gICAgICAgICAgICBsYXlvdXRFbmdpbmUuaGl0VGVzdEluZm9fID0gbGF5b3V0RW5naW5lLmhpdFRlc3QoYWdycyk7XG4gICAgICAgICAgICBoaXRJbmZvID0gbGF5b3V0RW5naW5lLmhpdFRlc3RJbmZvXztcbiAgICAgICAgICAgIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uLmFjdGlvbkhhbmRsZXIoe1xuICAgICAgICAgICAgICAgICAgICBncmlkTW9kZWw6IGdyaWQsXG4gICAgICAgICAgICAgICAgICAgIGhpdEluZm86IGhpdEluZm8sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFJdGVtOiBnZXREYXRhSXRlbS5jYWxsKGdyaWQsIGhpdEluZm8pLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZUFjdGlvbkNvbHVtblBhbmVsOiBjbG9zZVRvdWNoUGFuZWwuYmluZChncmlkKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmbiwgMTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlZnJlc2hBY3Rpb25Sb3cuY2FsbChncmlkLCAoc3dpcGVTdGF0dXMubW92ZURpc3RhbmNlID4gMCA/IC0xIDogMSkgKiBzd2lwZVN0YXR1cy5jb2x1bW5zVG90YWxXaWR0aCwgc3dpcGVTdGF0dXMuY29sdW1uc1RvdGFsV2lkdGgsIHRydWUsIGUudmVsb2NpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZEV4ZWN1dGVGbGlja0FjdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYWN0aW9uUHJlc2VudGVyO1xuICAgICAgICB2YXIgYWN0aW9uSGFuZGxlcjtcbiAgICAgICAgdmFyIGNvbDtcbiAgICAgICAgdmFyIGFjdGlvbkluZm9zO1xuICAgICAgICB2YXIgaXRlbTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgY29sbGVuZ3RoID0gc2VsZi5jb2x1bW5zLmxlbmd0aDsgaSA8IGNvbGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb2wgPSBzZWxmLmNvbHVtbnNbaV07XG4gICAgICAgICAgICBhY3Rpb25JbmZvcyA9IHNlbGYuY29sdW1uQWN0aW9uc19bY29sLmlkXTtcbiAgICAgICAgICAgIGlmICghYWN0aW9uSW5mb3MpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbmd0aCA9IGFjdGlvbkluZm9zLmxlbmd0aDsgaiA8IGxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGFjdGlvbkluZm9zW2pdO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmZsaWNrQWN0aW9uID09PSBzd2lwZVN0YXR1cy5hY3Rpb25UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvblByZXNlbnRlciA9IChpdGVtLnByZXNlbnRlciA/IGl0ZW0ucHJlc2VudGVyIDogKCc8YnV0dG9uIGNsYXNzPVwiZ2MtYWN0aW9uXCIgZGF0YS1hY3Rpb249XCInICsgaXRlbS5uYW1lICsgJ1wiPicgKyBpdGVtLm5hbWUgKyAnPC9idXR0b24+JykpO1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25IYW5kbGVyID0gc2VsZi5nZXRBY3Rpb25IYW5kbGVyXyhjb2wuaWQsIGl0ZW0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdGlvblByZXNlbnRlcikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvblByZXNlbnRlciAhPT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJlc2VudGVyOiAnPGRpdiBjbGFzcz1cImdjLWFjdGlvbi1hcmVhXCI+JyArIGFjdGlvblByZXNlbnRlciArICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGFjdGlvbkhhbmRsZXI6IGFjdGlvbkhhbmRsZXJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU2Nyb2xsKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYuc3RvcEVkaXRpbmcoKTtcbiAgICAgICAgY2xvc2VUb3VjaFBhbmVsLmNhbGwoc2VsZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VXaGVlbChzZW5kZXIsIGUpIHtcbiAgICAgICAgdmFyIGdyaWQgPSBzZW5kZXI7XG4gICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSBncmlkLmxheW91dEVuZ2luZTtcbiAgICAgICAgaWYgKCFsYXlvdXRFbmdpbmUuc2hvd1Njcm9sbFBhbmVsKFZJRVdQT1JUKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIG9mZnNldERlbHRhWSA9IGUuZGVsdGFZO1xuICAgICAgICB2YXIgb2Zmc2V0RGVsdGFYID0gZS5kZWx0YVg7XG4gICAgICAgIGlmIChvZmZzZXREZWx0YVkgIT09IDAgfHwgb2Zmc2V0RGVsdGFYICE9PSAwKSB7XG4gICAgICAgICAgICAvKmpzaGludCAtVzA2OSAqL1xuICAgICAgICAgICAgdmFyIGxheW91dCA9IGxheW91dEVuZ2luZS5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICAgICAgdmFyIG1heE9mZnNldFRvcCA9IE1hdGgubWF4KGxheW91dC5jb250ZW50SGVpZ2h0IC0gbGF5b3V0LmhlaWdodCwgMCk7XG4gICAgICAgICAgICB2YXIgbWF4T2Zmc2V0TGVmdCA9IE1hdGgubWF4KGxheW91dC5jb250ZW50V2lkdGggLSBsYXlvdXQud2lkdGgsIDApO1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gZ3JpZC5zY3JvbGxPZmZzZXQubGVmdDtcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3A7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhvZmZzZXREZWx0YVgpIDw9IE1hdGguYWJzKG9mZnNldERlbHRhWSkgJiYgb2Zmc2V0RGVsdGFZID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRUb3AgPj0gbWF4T2Zmc2V0VG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBNYXRoLm1pbihvZmZzZXRUb3AgKyBvZmZzZXREZWx0YVksIG1heE9mZnNldFRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsLnNjcm9sbC10b3AnKS5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKG9mZnNldERlbHRhWCkgPD0gTWF0aC5hYnMob2Zmc2V0RGVsdGFZKSAmJiBvZmZzZXREZWx0YVkgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGFZLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9tVXRpbC5nZXRFbGVtZW50KCcjJyArIGdyaWQudWlkICsgJyAuZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwuc2Nyb2xsLXRvcCcpLnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMob2Zmc2V0RGVsdGFYKSA+IE1hdGguYWJzKG9mZnNldERlbHRhWSkgJiYgb2Zmc2V0RGVsdGFYID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID49IG1heE9mZnNldExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBNYXRoLm1pbihvZmZzZXRMZWZ0ICsgb2Zmc2V0RGVsdGFYLCBtYXhPZmZzZXRMZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9tVXRpbC5nZXRFbGVtZW50KCcjJyArIGdyaWQudWlkICsgJyAuZ2MtZ3JpZC12aWV3cG9ydC1zY3JvbGwtcGFuZWwuc2Nyb2xsLWxlZnQnKS5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMob2Zmc2V0RGVsdGFYKSA+IE1hdGguYWJzKG9mZnNldERlbHRhWSkgJiYgb2Zmc2V0RGVsdGFYIDwgMCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRMZWZ0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgob2Zmc2V0TGVmdCArIG9mZnNldERlbHRhWCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICcgLmdjLWdyaWQtdmlld3BvcnQtc2Nyb2xsLXBhbmVsLnNjcm9sbC1sZWZ0Jykuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZUNsaWNrXyhzZW5kZXIsIGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzZW5kZXIubGF5b3V0RW5naW5lO1xuICAgICAgICBzZWxmLmhpdFRlc3RJbmZvXyA9IHNlbGYuaGl0VGVzdChlKTtcbiAgICAgICAgdmFyIGhpdEluZm8gPSBzZWxmLmhpdFRlc3RJbmZvXztcbiAgICAgICAgc2VsZi5tb3VzZURvd25Qb2ludF8gPSBudWxsO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvID0gc2VsZi5oaXRUZXN0SW5mb18uZ3JvdXBJbmZvO1xuICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICB2YXIgZWRpdGluZ0hhbmRsZXIgPSBncmlkLmVkaXRpbmdIYW5kbGVyO1xuICAgICAgICBpZiAoIWhpdEluZm8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWRpdGluZ0hhbmRsZXIuaXNFZGl0aW5nXyAmJiAhaXNFZGl0aW5nU2FtZVJvd18oaGl0SW5mbywgZWRpdGluZ0hhbmRsZXIuZWRpdGluZ0luZm9fKSAmJiBncmlkLmhhc0VkaXRBY3Rpb25fKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9uSGFuZGxlcjtcbiAgICAgICAgaWYgKGhpdEluZm8uYXJlYSA9PT0gQ09MVU1OX0hFQURFUikge1xuICAgICAgICAgICAgaGFuZGxlQ2xpY2tDb2xIZWFkZXJfLmNhbGwoc2VsZiwgaGl0SW5mbyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhpdEluZm8uYXJlYSA9PT0gVklFV1BPUlQpIHtcbiAgICAgICAgICAgIGFjdGlvbkhhbmRsZXIgPSBoaXRJbmZvLmFjdGlvbiB8fCBudWxsO1xuICAgICAgICAgICAgaWYgKGhpdEluZm8uaW5UcmVlTm9kZSB8fCAoZ3JvdXBJbmZvICYmIGdyb3VwSW5mby5pblRyZWVOb2RlKSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRyZWVOb2RlKHNlbGYpO1xuICAgICAgICAgICAgICAgIGdyaWQuaW52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaGl0SW5mby5hcmVhID09PSBHUk9VUF9EUkFHX1BBTkVMKSB7XG4gICAgICAgICAgICB2YXIgZ3JvdXBpbmdJbmZvID0gaGl0SW5mby5ncm91cGluZ1BhbmVsSW5mbztcbiAgICAgICAgICAgIGlmIChncm91cGluZ0luZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBpbmdJbmZvLmFjdGlvbiA9PT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ncmlkLmRhdGEuZ3JvdXBEZXNjcmlwdG9ycyA9IF8ucmVtb3ZlKHNlbGYuZ3JpZC5kYXRhLmdyb3VwRGVzY3JpcHRvcnMsIGZ1bmN0aW9uKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmZvLmZpZWxkICE9PSBncm91cGluZ0luZm8uZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChoaXRJbmZvLmdyb3VwSW5mbyAmJiBoaXRJbmZvLmdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpIHtcbiAgICAgICAgICAgIGlmIChncm91cEluZm8gJiYgZ3JvdXBJbmZvLm9uRXhwYW5kVG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXAgPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEluZm8ucGF0aCkuZGF0YTtcbiAgICAgICAgICAgICAgICBncm91cC5jb2xsYXBzZWQgPSAhZ3JvdXAuY29sbGFwc2VkO1xuICAgICAgICAgICAgICAgIHNlbmRlci5pbnZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaGl0SW5mby5ncm91cEluZm8gJiYgaGl0SW5mby5ncm91cEluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgYWN0aW9uSGFuZGxlciA9IGhpdEluZm8uZ3JvdXBJbmZvLmFjdGlvbiB8fCBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlZGl0aW5nSGFuZGxlci5pc0VkaXRpbmdfKSB7XG4gICAgICAgICAgICB1cGRhdGVTZWxlY3Rpb24oc2VsZik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGF0YUl0ZW0gPSBnZXREYXRhSXRlbS5jYWxsKHNlbGYuZ3JpZCwgaGl0SW5mbyk7XG4gICAgICAgIGlmIChhY3Rpb25IYW5kbGVyKSB7XG4gICAgICAgICAgICBhY3Rpb25IYW5kbGVyKHtcbiAgICAgICAgICAgICAgICBncmlkTW9kZWw6IGdyaWQsXG4gICAgICAgICAgICAgICAgaGl0SW5mbzogaGl0SW5mbyxcbiAgICAgICAgICAgICAgICBkYXRhSXRlbTogZGF0YUl0ZW0sXG4gICAgICAgICAgICAgICAgY2xvc2VBY3Rpb25Db2x1bW5QYW5lbDogY2xvc2VUb3VjaFBhbmVsLmJpbmQoZ3JpZClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5tb3VzZURvd25Qb2ludF8gPSBudWxsO1xuICAgICAgICBzZWxmLmlzRHJhZ0Ryb3BpbmdfID0gZmFsc2U7XG4gICAgICAgIHNlbGYuaGl0VGVzdEluZm9fID0gbnVsbDtcbiAgICAgICAgc2VsZi5kcmFnU3RhcnRJbmZvXyA9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTW91c2VEb3duKHNlbmRlciwgZSkge1xuICAgICAgICBoYW5kbGVQb2ludGVyRG93bihzZW5kZXIsIGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnQoc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBhcmdzID0ge3BhZ2VYOiBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVgsIHBhZ2VZOiBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVl9O1xuICAgICAgICBpZiAoaGFuZGxlUG9pbnRlckRvd24oc2VuZGVyLCBhcmdzKSkge1xuICAgICAgICAgICAgZS5oYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBvaW50ZXJEb3duKHNlbmRlciwgZSkge1xuICAgICAgICB2YXIgbGF5b3V0RW5naW5lID0gc2VuZGVyLmxheW91dEVuZ2luZTtcbiAgICAgICAgbGF5b3V0RW5naW5lLmhpdFRlc3RJbmZvXyA9IGxheW91dEVuZ2luZS5oaXRUZXN0KGUpO1xuICAgICAgICB2YXIgaGl0SW5mbyA9IGxheW91dEVuZ2luZS5oaXRUZXN0SW5mb187XG4gICAgICAgIGlmICghaGl0SW5mbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlZGl0aW5nSGFuZGxlciA9IHNlbmRlci5lZGl0aW5nSGFuZGxlcjtcbiAgICAgICAgaWYgKGVkaXRpbmdIYW5kbGVyLmlzRWRpdGluZ18pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVEcmFnU3RhcnQuY2FsbChsYXlvdXRFbmdpbmUsIGhpdEluZm8sIGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrQ29sSGVhZGVyXyhoaXRJbmZvKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBjb2x1bW5zID0gZ3JpZC5jb2x1bW5zO1xuICAgICAgICB2YXIgY29sID0gaGl0SW5mby5jb2x1bW47XG4gICAgICAgIGlmIChjb2wgPj0gMCkge1xuICAgICAgICAgICAgdmFyIGNvbE9iaiA9IGNvbHVtbnNbY29sXTtcbiAgICAgICAgICAgIHZhciBjYW5Tb3J0ID0gY29sT2JqLmhhc093blByb3BlcnR5KCdhbGxvd1NvcnRpbmcnKSA/IGNvbE9iai5hbGxvd1NvcnRpbmcgOiBzZWxmLm9wdGlvbnMuYWxsb3dTb3J0aW5nO1xuICAgICAgICAgICAgaWYgKGNhblNvcnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFNvcnRJbmZvID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoZ3JpZC5kYXRhLnNvcnREZXNjcmlwdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U29ydEluZm8gPSBfLmZpbmQoZ3JpZC5kYXRhLnNvcnREZXNjcmlwdG9ycywgXy5tYXRjaGVzUHJvcGVydHkoJ2ZpZWxkJywgY29sT2JqLmlkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBvcFNvcnRJbmZvO1xuICAgICAgICAgICAgICAgIGlmIChncmlkLm9wdGlvbnMuc29ydGluZykge1xuICAgICAgICAgICAgICAgICAgICBvcFNvcnRJbmZvID0gXy5maW5kKGdyaWQub3B0aW9ucy5zb3J0aW5nLCBfLm1hdGNoZXNQcm9wZXJ0eSgnZmllbGQnLCBjb2xPYmouaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wU29ydEluZm8gJiYgIW9wU29ydEluZm8uaGFzT3duUHJvcGVydHkoJ2FzY2VuZGluZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcFNvcnRJbmZvLmFzY2VuZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcFNvcnRJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wU29ydEluZm8gPSB7ZmllbGQ6IGNvbE9iai5pZCwgYXNjZW5kaW5nOiB0cnVlfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTb3J0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNvcnRJbmZvLmFzY2VuZGluZyAhPT0gb3BTb3J0SW5mby5hc2NlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTb3J0SW5mbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U29ydEluZm8uYXNjZW5kaW5nID0gIWN1cnJlbnRTb3J0SW5mby5hc2NlbmRpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U29ydEluZm8gPSBfLmNsb25lKG9wU29ydEluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncmlkLmRhdGEuc29ydERlc2NyaXB0b3JzID0gY3VycmVudFNvcnRJbmZvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VUb3VjaFBhbmVsKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGFuaS5zdG9wKCk7XG4gICAgICAgIHJlZnJlc2hBY3Rpb25Sb3cuY2FsbChzZWxmLCAwLCAwKTtcbiAgICAgICAgc3dpcGVTdGF0dXMgPSB7fTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoQWN0aW9uUm93KHJvd3RvcCwgcGFuZWxIZWlnaHQsIHVzZUFuaW1hdGlvbiwgdmVsb2NpdHkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXN3aXBlU3RhdHVzLnJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRSb3d0b3AgPSBwYXJzZUZsb2F0KHN3aXBlU3RhdHVzLnJvdy5zdHlsZS50b3ApO1xuICAgICAgICAgICAgdmFyIHRvdWNoUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzd2lwZVN0YXR1cy5yb3cuaWQgKyAnLScgKyBzd2lwZVN0YXR1cy5hY3Rpb25UeXBlICsgJy1hY3Rpb25QYW5lbCcpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRQYW5lbEhlaWdodCA9IHRvdWNoUGFuZWwgPyBwYXJzZUZsb2F0KHRvdWNoUGFuZWwuc3R5bGUuaGVpZ2h0KSA6IDA7XG5cbiAgICAgICAgICAgIHZhciByb3dPZmZzZXQgPSByb3d0b3AgLSBjdXJyZW50Um93dG9wO1xuICAgICAgICAgICAgdmFyIHBhbmVsT2Zmc2V0ID0gcGFuZWxIZWlnaHQgLSBjdXJyZW50UGFuZWxIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSAwLjI1ICogKDEgLyB2ZWxvY2l0eSk7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uID4gMC4xMCA/IDAuMTAgOiBkdXJhdGlvbjtcblxuICAgICAgICAgICAgYW5pLnBsYXkoZHVyYXRpb24sIGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVSb3cuY2FsbChzZWxmLCByb3dPZmZzZXQgKiBwICsgY3VycmVudFJvd3RvcCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVG91Y2hQYW5lbC5jYWxsKHNlbGYsIHBhbmVsT2Zmc2V0ICogcCArIGN1cnJlbnRQYW5lbEhlaWdodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZVJvdy5jYWxsKHNlbGYsIHJvd3RvcCk7XG4gICAgICAgICAgICB1cGRhdGVUb3VjaFBhbmVsLmNhbGwoc2VsZiwgcGFuZWxIZWlnaHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlUm93KG5ld1RvcCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBsYXlvdXRJbmZvID0gc2VsZi5nZXRMYXlvdXRJbmZvKClbVklFV1BPUlRdO1xuICAgICAgICBzd2lwZVN0YXR1cy5yb3cuc3R5bGUudG9wID0gbmV3VG9wICsgJ3B4JztcbiAgICAgICAgaWYgKG5ld1RvcCA+IDApIHtcbiAgICAgICAgICAgIHN3aXBlU3RhdHVzLnJvdy5zdHlsZVsnYm9yZGVyLXJpZ2h0J10gPSAnMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4yKSc7XG4gICAgICAgICAgICBzd2lwZVN0YXR1cy5yb3cuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIHN3aXBlU3RhdHVzLnJvdy5zdHlsZS5oZWlnaHQgPSAobGF5b3V0SW5mby5jb250ZW50SGVpZ2h0IC0gbmV3VG9wKSArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2lwZVN0YXR1cy5yb3cuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2JvcmRlci1yaWdodCcpO1xuICAgICAgICAgICAgc3dpcGVTdGF0dXMucm93LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdvdmVyZmxvdycpO1xuICAgICAgICAgICAgc3dpcGVTdGF0dXMucm93LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdoZWlnaHQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvdWNoUGFuZWwocGFuZWxIZWlnaHQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoZ2NVdGlscy5pc051bWJlcihwYW5lbEhlaWdodCkpIHtcbiAgICAgICAgICAgIHZhciB2aWV3UG9ydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYudWlkICsgJy12aWV3cG9ydC1pbm5lcicpO1xuICAgICAgICAgICAgdmFyIGFjdGlvblBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3dpcGVTdGF0dXMucm93LmlkICsgJy0nICsgc3dpcGVTdGF0dXMuYWN0aW9uVHlwZSArICctYWN0aW9uUGFuZWwnKTtcblxuICAgICAgICAgICAgaWYgKGFjdGlvblBhbmVsKSB7XG4gICAgICAgICAgICAgICAgdmlld1BvcnQucmVtb3ZlQ2hpbGQoYWN0aW9uUGFuZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFuZWxIZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmlld1BvcnQuYXBwZW5kQ2hpbGQoY3JlYXRlQ29sdW1uVG91Y2hQYW5lbC5jYWxsKHNlbGYsIHBhbmVsSGVpZ2h0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDb2x1bW5Ub3VjaFBhbmVsKHBhbmVsSGVpZ2h0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHJvdyA9IHN3aXBlU3RhdHVzLnJvdztcbiAgICAgICAgdmFyIGFjdGlvblR5cGUgPSBzd2lwZVN0YXR1cy5hY3Rpb25UeXBlO1xuICAgICAgICB2YXIgY29sdW1ucyA9IHN3aXBlU3RhdHVzLmNvbHVtbnM7XG4gICAgICAgIHZhciBpZCA9IHJvdy5pZCArICctJyArIGFjdGlvblR5cGUgKyAnLWFjdGlvblBhbmVsJztcbiAgICAgICAgdmFyIGxheW91dEluZm8gPSBzZWxmLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSByb3cuY2xhc3NOYW1lICsgJyBhY3Rpb25QYW5lbCc7XG4gICAgICAgIHZhciBoZWlnaHQgPSBwYW5lbEhlaWdodDtcbiAgICAgICAgdmFyIHRvcCA9IGFjdGlvblR5cGUgPT09ICd0b3AnID8gKGxheW91dEluZm8uY29udGVudEhlaWdodCAtIGhlaWdodCkgOiAwO1xuICAgICAgICB2YXIgc3R5bGUgPSAnbGVmdDonICsgcm93LnN0eWxlLmxlZnQgKyAnOyB3aWR0aDonICsgcm93LnN0eWxlLndpZHRoICsgJzsgdG9wOicgKyB0b3AgKyAncHg7IGhlaWdodDonICsgaGVpZ2h0ICsgJ3B4O3Bvc2l0aW9uOmFic29sdXRlJztcbiAgICAgICAgdmFyIGNvbnRhaW5lckh0bWwgPSAnPGRpdiBpZD1cIicgKyBpZCArICdcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCI+JztcbiAgICAgICAgdmFyIGNvbHRvcCA9IGFjdGlvblR5cGUgPT09ICd0b3AnID8gMCA6IGhlaWdodDtcbiAgICAgICAgdmFyIGlubmVyc3R5bGU7XG4gICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgICAgIHZhciBjb2xIZWlnaHQgPSAoY29sLnBlcmZlcnJlZFNpemUgLyBzd2lwZVN0YXR1cy5jb2x1bW5zVG90YWxXaWR0aCkgKiBoZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY29sVG1sO1xuICAgICAgICAgICAgaWYgKGFjdGlvblR5cGUgPT09ICdib3R0b20nKSB7XG4gICAgICAgICAgICAgICAgY29sdG9wIC09IGNvbEhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5uZXJzdHlsZSA9IGFjdGlvblR5cGUgPT09ICdib3R0b20nID8gKCdwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjBweDt3aWR0aDoxMDAlO2hlaWdodDonICsgY29sLnBlcmZlcnJlZFNpemUgKyAncHg7IHRvcDonICsgKGNvbEhlaWdodCAtIGNvbC5wZXJmZXJyZWRTaXplKSArICdweDsnKSA6ICdoZWlnaHQ6MTAwJTsnO1xuICAgICAgICAgICAgY29sVG1sID0gJzxkaXYgc3R5bGUgPSBcIicgKyAnd2lkdGg6MTAwJTt0b3A6JyArIGNvbHRvcCArICdweDtoZWlnaHQ6JyArIGNvbEhlaWdodCArICdweDtwb3NpdGlvbjphYnNvbHV0ZTtvdmVyZmxvdzpoaWRkZW47XCI+JztcbiAgICAgICAgICAgIGNvbFRtbCArPSAnPGRpdiBzdHlsZT1cIicgKyBpbm5lcnN0eWxlICsgJ1wiIGNsYXNzPVwiZ2MtYWN0aW9uY29sdW1uJyArIGNvbC5pbmRleCArICdcIj4nICsgY29sLnBlcnNlbnRlciArICc8L2Rpdj4nO1xuICAgICAgICAgICAgY29sVG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uVHlwZSA9PT0gJ3RvcCcpIHtcbiAgICAgICAgICAgICAgICBjb2x0b3AgKz0gY29sSGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250YWluZXJIdG1sICs9IGNvbFRtbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVySHRtbCArPSAnPC9kaXY+JztcbiAgICAgICAgcmV0dXJuIGRvbVV0aWwuY3JlYXRlRWxlbWVudChjb250YWluZXJIdG1sKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVEcmFnU3RhcnQoaGl0SW5mbywgZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubW91c2VEb3duUG9pbnRfID0ge1xuICAgICAgICAgICAgbGVmdDogZS5wYWdlWCxcbiAgICAgICAgICAgIHRvcDogZS5wYWdlWVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChoaXRJbmZvLmFyZWEgPT09IENPTFVNTl9IRUFERVIgfHwgaGl0SW5mby5hcmVhID09PSBHUk9VUF9EUkFHX1BBTkVMKSB7XG4gICAgICAgICAgICBpZiAoY2FuU3RhcnREcmFnaW5nXy5jYWxsKHNlbGYsIGhpdEluZm8pKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kcmFnU3RhcnRJbmZvXyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaGl0VGVzdEluZm86IF8uY2xvbmUoaGl0SW5mbywgdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgIHBvaW50T2Zmc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBlLnBhZ2VYLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBlLnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRyYWdTdGFydEluZm9fID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXNlbGYuZHJhZ1N0YXJ0SW5mb187XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuU3RhcnREcmFnaW5nXyhoaXRUZXN0SW5mbykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgdmFyIGNvbHVtbjtcbiAgICAgICAgdmFyIGdyb3VwRGVzY3JpcHRvcnM7XG4gICAgICAgIGlmIChoaXRUZXN0SW5mbykge1xuICAgICAgICAgICAgaWYgKGhpdFRlc3RJbmZvLmFyZWEgPT09IEdST1VQX0RSQUdfUEFORUwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGl0VGVzdEluZm8uYXJlYSA9PT0gQ09MVU1OX0hFQURFUiAmJiBoaXRUZXN0SW5mby5jb2x1bW4gPj0gMCkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdyaWQuZGF0YTtcbiAgICAgICAgICAgICAgICBncm91cERlc2NyaXB0b3JzID0gZGF0YS5ncm91cERlc2NyaXB0b3JzO1xuICAgICAgICAgICAgICAgIGNvbHVtbiA9IHRoaXMuZ3JpZC5jb2x1bW5zW2hpdFRlc3RJbmZvLmNvbHVtbl07XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwZWQgPSAhIV8uZmluZChncm91cERlc2NyaXB0b3JzLCBfLm1hdGNoZXNQcm9wZXJ0eSgnZmllbGQnLCBjb2x1bW4uaWQpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JvdXBlZCA/IGZhbHNlIDogISEoY29sdW1uLmhhc093blByb3BlcnR5KCdhbGxvd0dyb3VwaW5nJykgPyBjb2x1bW4uYWxsb3dHcm91cGluZyA6IHRoaXMuZ3JpZC5vcHRpb25zLmFsbG93R3JvdXBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVN0YXJ0U2l6ZV8odmFsdWUpIHtcbiAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA+IDAgJiYgdmFsdWUuc2xpY2UoLTEpID09PSAnKicpIHtcbiAgICAgICAgICAgIHZhciBzeiA9IHZhbHVlLmxlbmd0aCA9PT0gMSA/IDEgOiB2YWx1ZS5zbGljZSgwLCAtMSkgKiAxO1xuICAgICAgICAgICAgaWYgKHN6ID4gMCAmJiAhaXNOYU4oc3opKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN6O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVN0YXJ0U2l6ZV8oKSB7XG4gICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG4gICAgICAgIHZhciBncmlkID0gc2NvcGUuZ3JpZDtcbiAgICAgICAgdmFyIGNvbHVtbnMgPSBncmlkLmNvbHVtbnM7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2NvcGUub3B0aW9ucztcbiAgICAgICAgdmFyIGNvbnRhaW5lckluZm8gPSBncmlkLmdldENvbnRhaW5lckluZm9fKCk7XG4gICAgICAgIHZhciBjb250YWluZXJSZWN0ID0gY29udGFpbmVySW5mby5jb250ZW50UmVjdDtcbiAgICAgICAgdmFyIHN6QXZhaWxhYmxlID0gY29udGFpbmVyUmVjdC5oZWlnaHQgLSBvcHRpb25zLnJvd0hlYWRlcldpZHRoO1xuICAgICAgICBpZiAob3B0aW9ucy5hbGxvd0dyb3VwaW5nKSB7XG4gICAgICAgICAgICBzekF2YWlsYWJsZSAtPSBnZXRHcm91cERyYWdQYW5lbEhlaWdodF8uY2FsbChzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChncmlkLmRhdGEuaXRlbUNvdW50ICogb3B0aW9ucy5yb3dIZWlnaHQpID4gKGNvbnRhaW5lclJlY3Qud2lkdGggLSBvcHRpb25zLmNvbEhlYWRlckhlaWdodCkpIHtcbiAgICAgICAgICAgIHN6QXZhaWxhYmxlIC09IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGFydENvdW50ID0gMDtcbiAgICAgICAgdmFyIGxhc3RTdGFydENvbDtcbiAgICAgICAgdmFyIGxhc3RXaWR0aDtcbiAgICAgICAgdmFyIHN6Q29scyA9IFtdO1xuICAgICAgICB2YXIgaGFzU3RhciA9IGZhbHNlO1xuXG4gICAgICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihjb2wsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoY29sLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3ogPSBwYXJzZVN0YXJ0U2l6ZV8oY29sLndpZHRoKTtcbiAgICAgICAgICAgICAgICBzekNvbHNbaW5kZXhdID0gc3o7XG4gICAgICAgICAgICAgICAgaWYgKHN6KSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc1N0YXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzdGFydENvdW50ICs9IHN6O1xuICAgICAgICAgICAgICAgICAgICBsYXN0U3RhcnRDb2wgPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzekF2YWlsYWJsZSAtPSBjb2wudmlzaWJsZVdpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGhhc1N0YXIpIHtcbiAgICAgICAgICAgIGxhc3RXaWR0aCA9IHN6QXZhaWxhYmxlO1xuICAgICAgICAgICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN6Q29sc1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbGFzdFN0YXJ0Q29sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sLnZpc2libGVXaWR0aCA9IGxhc3RXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sLnZpc2libGVXaWR0aCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoc3pDb2xzW2luZGV4XSAvIHN0YXJ0Q291bnQgKiBzekF2YWlsYWJsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RXaWR0aCAtPSBjb2wudmlzaWJsZVdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVUcmVlTm9kZShsYXlvdXRFbmdpbmUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBsYXlvdXRFbmdpbmU7XG4gICAgICAgIHZhciBoaXRJbmZvID0gc2VsZi5oaXRUZXN0SW5mb187XG4gICAgICAgIHZhciBoaXRHcm91cEluZm8gPSBoaXRJbmZvLmdyb3VwSW5mbztcbiAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgIGlmIChoaXRHcm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBncm91cCA9IHNlbGYuZ3JpZC5nZXRHcm91cEluZm9fKGhpdEdyb3VwSW5mby5wYXRoKS5kYXRhO1xuICAgICAgICAgICAgbm9kZSA9IGdyb3VwLnJvb3ROb2RlLmZpbmROb2RlKGhpdEdyb3VwSW5mby5yb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IHNlbGYuZ3JpZC5kYXRhLnJvb3ROb2RlLmZpbmROb2RlKGhpdEluZm8ucm93KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbm9kZS5jb2xsYXBzZWQgPSAhbm9kZS5jb2xsYXBzZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTZWxlY3Rpb24obGF5b3V0RW5naW5lKSB7XG4gICAgICAgIHZhciBzZWxmID0gbGF5b3V0RW5naW5lO1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFsbG93SGVhZGVyU2VsZWN0KSB7XG4gICAgICAgICAgICB1cGRhdGVDaGVja2JveFNlbGVjdGlvbl8oc2VsZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVHZW5lcmFsU2VsZWN0aW9uXyhzZWxmKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoZWNrYm94U2VsZWN0aW9uXyhsYXlvdXRFbmdpbmUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBsYXlvdXRFbmdpbmU7XG4gICAgICAgIHZhciBoaXRJbmZvID0gc2VsZi5oaXRUZXN0SW5mb187XG4gICAgICAgIHZhciBncm91cEhpdEluZm8gPSBoaXRJbmZvLmdyb3VwSW5mbztcbiAgICAgICAgaWYgKCFoaXRJbmZvLmNoZWNrZWQgJiYgKCFncm91cEhpdEluZm8gfHwgIWdyb3VwSGl0SW5mby5jaGVja2VkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGdyb3VwSGl0SW5mbyA/IHNlbGYuZ3JpZC5nZXRHcm91cEluZm9fKGdyb3VwSGl0SW5mby5wYXRoKSA6IG51bGw7XG4gICAgICAgIHZhciB2aWV3Um93ID0gZ3JvdXBIaXRJbmZvID8gZ3JvdXBIaXRJbmZvLnJvdyA6IGhpdEluZm8ucm93O1xuICAgICAgICB2YXIgc3JjUm93ID0gZ3JvdXBJbmZvID8gZ3JvdXBJbmZvLmRhdGEudG9Tb3VyY2VSb3codmlld1JvdykgOiBzZWxmLmdyaWQuZGF0YS50b1NvdXJjZVJvdyh2aWV3Um93KTtcblxuICAgICAgICB2YXIgc2VsZWN0ZWRSb3dzID0gc2VsZi5zZWxlY3RlZFJvd3NfID0gc2VsZi5zZWxlY3RlZFJvd3NfIHx8IFtdO1xuICAgICAgICB2YXIgc2VsTW9kZU9wdCA9IHNlbGYub3B0aW9ucy5zZWxlY3Rpb25Nb2RlO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgdmFyIHRhcmdldEVsZW1lbnQ7XG4gICAgICAgIHZhciBjaGVja2VkOyAgLy9jdXJyZW50IGNoZWNrZWQgc3RhdHVzO1xuXG4gICAgICAgIGlmIChzZWxNb2RlT3B0ID09PSBTZWxlY3RNb2RlLk5PTkUpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkUm93cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgc2V0QWxsU3RhdHVzXyhzZWxmLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsTW9kZU9wdCA9PT0gU2VsZWN0TW9kZS5TSU5HTEUpIHtcbiAgICAgICAgICAgIHRhcmdldEVsZW1lbnQgPSBnZXRDaGVja0VsZW1lbnRfKHNlbGYsIGhpdEluZm8pO1xuICAgICAgICAgICAgaWYgKGhpdEluZm8uYXJlYSA9PT0gQ09STkVSX0hFQURFUiB8fCAoZ3JvdXBIaXRJbmZvICYmIGdyb3VwSGl0SW5mby5hcmVhID09PSBHUk9VUF9IRUFERVIpKSB7XG4gICAgICAgICAgICAgICAgc2V0Q2hlY2tFbGVtZW50U2VsZWN0Xyh0YXJnZXRFbGVtZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc05hTihzcmNSb3cpICYmIHNlbGVjdGVkUm93cy5pbmRleE9mKHNyY1JvdykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSb3dzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSb3dzLnB1c2goc3JjUm93KTtcbiAgICAgICAgICAgICAgICBzZXRBbGxTdGF0dXNfKHNlbGYsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdldFJvd0VsZW1lbnRfKHNlbGYsIHZpZXdSb3csIGdyb3VwSGl0SW5mbyk7XG4gICAgICAgICAgICAgICAgc2V0Um93RWxlbWVudFNlbGVjdF8oZWxlbWVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDaGVja0VsZW1lbnRTZWxlY3RfKHRhcmdldEVsZW1lbnQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGhpdEluZm8uYXJlYSA9PT0gQ09STkVSX0hFQURFUikge1xuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSBzZWxlY3RlZFJvd3MubGVuZ3RoID09PSBzZWxmLmdyaWQuZGF0YS5pdGVtQ291bnQ7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSb3dzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHNlbGYuZ3JpZC5kYXRhLml0ZW1Db3VudDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFJvd3MucHVzaChzZWxmLmdyaWQuZGF0YS50b1NvdXJjZVJvdyhpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0QWxsU3RhdHVzXyhzZWxmLCAhY2hlY2tlZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhpdEluZm8uYXJlYSA9PT0gUk9XX0hFQURFUikge1xuICAgICAgICAgICAgICAgIGlmIChncm91cEhpdEluZm8gJiYgZ3JvdXBIaXRJbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWFwcGluZ3MgPSBnZXRHcm91cE1hcHBpbmdfKHNlbGYuZ3JpZC5nZXRHcm91cEluZm9fKGdyb3VwSGl0SW5mby5wYXRoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSBfLmRpZmZlcmVuY2UobWFwcGluZ3MsIHNlbGVjdGVkUm93cykubGVuZ3RoIDw9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0gXy5pbnRlcnNlY3Rpb24oc2VsZWN0ZWRSb3dzLCBtYXBwaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBpbnRlcnNlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFJvd3Muc3BsaWNlKHNlbGVjdGVkUm93cy5pbmRleE9mKGludGVyc2VjdGlvbltpXSksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRSb3dzID0gc2VsZi5zZWxlY3RlZFJvd3NfID0gXy51bmlvbihtYXBwaW5ncywgc2VsZWN0ZWRSb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBzZWxlY3RlZFJvd3MuaW5kZXhPZihzcmNSb3cpO1xuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gaXRlbUluZGV4ICE9PSAtMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUm93cy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUm93cy5wdXNoKHNyY1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2tlZCA9ICFjaGVja2VkOyAvLyBhZnRlciBjbGljaywgdGhlIGNoZWNrZWQgc3RhdHVzIGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgc2V0TXVsdGlTdGF0dXNfKHNlbGYsIGNoZWNrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlR2VuZXJhbFNlbGVjdGlvbl8obGF5b3V0RW5naW5lKSB7XG4gICAgICAgIHZhciBzZWxmID0gbGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgaGl0SW5mbyA9IHNlbGYuaGl0VGVzdEluZm9fO1xuICAgICAgICB2YXIgZ3JvdXBIaXRJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgIHZhciBoaXRJbmZvQ29sdW1uID0gZ3JvdXBIaXRJbmZvID8gZ3JvdXBIaXRJbmZvLmNvbHVtbiA6IGhpdEluZm8uY29sdW1uO1xuICAgICAgICBpZiAoaGl0SW5mb0NvbHVtbiA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBncm91cEluZm8gPSBncm91cEhpdEluZm8gPyBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEhpdEluZm8ucGF0aCkgOiBudWxsO1xuICAgICAgICB2YXIgdmlld1JvdyA9IGdyb3VwSGl0SW5mbyA/IGdyb3VwSGl0SW5mby5yb3cgOiBoaXRJbmZvLnJvdztcbiAgICAgICAgdmFyIHNyY1JvdyA9IGdyb3VwSW5mbyA/IGdyb3VwSW5mby5kYXRhLnRvU291cmNlUm93KHZpZXdSb3cpIDogc2VsZi5ncmlkLmRhdGEudG9Tb3VyY2VSb3codmlld1Jvdyk7XG5cbiAgICAgICAgaWYgKGlzTmFOKHZpZXdSb3cpIHx8IGlzTmFOKHNyY1JvdykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxNb2RlT3B0ID0gc2VsZi5vcHRpb25zLnNlbGVjdGlvbk1vZGU7XG4gICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICB2YXIgc2VsZWN0ZWRSb3dzID0gc2VsZi5zZWxlY3RlZFJvd3NfID0gc2VsZi5zZWxlY3RlZFJvd3NfIHx8IFtdO1xuICAgICAgICB2YXIgcm93ID0gaGl0SW5mby5yb3c7XG4gICAgICAgIGlmIChzZWxNb2RlT3B0ID09PSBTZWxlY3RNb2RlLk5PTkUpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkUm93cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgc2V0QWxsU3RhdHVzXyhzZWxmLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsTW9kZU9wdCA9PT0gU2VsZWN0TW9kZS5NVUxUSVBMRSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IHNlbGVjdGVkUm93cy5pbmRleE9mKHNyY1Jvdyk7XG4gICAgICAgICAgICBlbGVtZW50ID0gZ2V0Um93RWxlbWVudF8oc2VsZiwgcm93LCBncm91cEhpdEluZm8pO1xuICAgICAgICAgICAgaWYgKGRvbVV0aWwuaGFzQ2xhc3MoZWxlbWVudCwgJ2djLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFJvd3Muc3BsaWNlKGl0ZW1JbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGdldFJvd0VsZW1lbnRfKHNlbGYsIHJvdywgZ3JvdXBIaXRJbmZvKTtcbiAgICAgICAgICAgICAgICBzZXRSb3dFbGVtZW50U2VsZWN0XyhlbGVtZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUm93cy5wdXNoKHNyY1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBnZXRSb3dFbGVtZW50XyhzZWxmLCByb3csIGdyb3VwSGl0SW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHNldFJvd0VsZW1lbnRTZWxlY3RfKGVsZW1lbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdGVkUm93cy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgc2VsZWN0ZWRSb3dzLnB1c2goc3JjUm93KTtcbiAgICAgICAgICAgIHNldEFsbFN0YXR1c18oc2VsZiwgZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudCA9IGdldFJvd0VsZW1lbnRfKHNlbGYsIHJvdywgZ3JvdXBIaXRJbmZvKTtcbiAgICAgICAgICAgIHNldFJvd0VsZW1lbnRTZWxlY3RfKGVsZW1lbnQsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QWxsU3RhdHVzXyhsYXlvdXRFbmdpbmUsIHN0YXR1cykge1xuICAgICAgICB2YXIgc2VsZiA9IGxheW91dEVuZ2luZTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW5ndGg7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWxsb3dIZWFkZXJTZWxlY3QpIHtcbiAgICAgICAgICAgIHZhciByb3dDaGVja0VsZW1lbnRzID0gc2VsZi5ncmlkLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZ2MtaGVhZGVyLXNlbGVjdC1pY29uJyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSByb3dDaGVja0VsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2V0Q2hlY2tFbGVtZW50U2VsZWN0Xyhyb3dDaGVja0VsZW1lbnRzW2ldLCBzdGF0dXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB2aWV3cG9ydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuZ3JpZC51aWQgKyAnLXZpZXdwb3J0LWlubmVyJyk7XG4gICAgICAgIHZhciByb3dzID0gdmlld3BvcnQuY2hpbGRyZW47XG4gICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHJvd3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkb21VdGlsLmFkZENsYXNzKHJvd3NbaV0sICdnYy1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHJvd3NbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHJvd3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkb21VdGlsLnJlbW92ZUNsYXNzKHJvd3NbaV0sICdnYy1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIHJvd3NbaV0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRNdWx0aVN0YXR1c18obGF5b3V0RW5naW5lLCBjaGVja2VkU3RhdHVzKSB7XG4gICAgICAgIHZhciBzZWxmID0gbGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgaGl0SW5mbyA9IHNlbGYuaGl0VGVzdEluZm9fO1xuICAgICAgICB2YXIgZ3JvdXBIaXRJbmZvID0gaGl0SW5mby5ncm91cEluZm87XG4gICAgICAgIHZhciB1aWQgPSBzZWxmLmdyaWQudWlkO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgdmFyIHJvd0VsZW1lbnQ7XG4gICAgICAgIHZhciB0YXJnZXRFbGVtZW50ID0gZ2V0Q2hlY2tFbGVtZW50XyhzZWxmLCBoaXRJbmZvKTtcbiAgICAgICAgdmFyIHJvb3RDaGVja0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWNvcm5lci1zZWxlY3QnKTtcbiAgICAgICAgc2V0Q2hlY2tFbGVtZW50U2VsZWN0Xyhyb290Q2hlY2tFbGVtZW50LCBzZWxmLnNlbGVjdGVkUm93c18ubGVuZ3RoID09PSBzZWxmLmdyaWQuZGF0YS5pdGVtQ291bnQpO1xuICAgICAgICAvL3VwZGF0ZSByb3cgaGVhZGVyIGNoZWNrYm94XG4gICAgICAgIGlmICghZ3JvdXBIaXRJbmZvKSB7XG4gICAgICAgICAgICByb3dFbGVtZW50ID0gZ2V0Um93RWxlbWVudF8oc2VsZiwgaGl0SW5mby5yb3csIG51bGwpO1xuICAgICAgICAgICAgc2V0Um93RWxlbWVudFNlbGVjdF8ocm93RWxlbWVudCwgY2hlY2tlZFN0YXR1cyk7XG4gICAgICAgICAgICBzZXRDaGVja0VsZW1lbnRTZWxlY3RfKHRhcmdldEVsZW1lbnQsIGNoZWNrZWRTdGF0dXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9JZiB0aGVyZSBhcmUgZ3JvdXBzLCBuZWVkIHRvIHN5bmMgcGFyZW50IGFuZCBjaGlsZHJlbiBzdGF0dXNcbiAgICAgICAgICAgIHZhciB0YXJnZXRHcm91cEluZm87XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW47XG4gICAgICAgICAgICB2YXIgbWFwcGluZ3M7XG4gICAgICAgICAgICAvL3NldCBwYXJlbnQgc3RhdHVzLlxuICAgICAgICAgICAgdmFyIHBhdGggPSBfLmNsb25lKGdyb3VwSGl0SW5mby5wYXRoKTtcbiAgICAgICAgICAgIGlmIChncm91cEhpdEluZm8uYXJlYSA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBzZXRDaGVja0VsZW1lbnRTZWxlY3RfKHRhcmdldEVsZW1lbnQsIGNoZWNrZWRTdGF0dXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChncm91cEhpdEluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQgPSBnZXRSb3dFbGVtZW50XyhzZWxmLCBudWxsLCBncm91cEhpdEluZm8pO1xuICAgICAgICAgICAgICAgIHNldFJvd0VsZW1lbnRTZWxlY3RfKHJvd0VsZW1lbnQsIGNoZWNrZWRTdGF0dXMpO1xuICAgICAgICAgICAgICAgIHNldENoZWNrRWxlbWVudFNlbGVjdF8odGFyZ2V0RWxlbWVudCwgY2hlY2tlZFN0YXR1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHVpZCArICctZ2hoJyArIHBhdGguam9pbignLScpICsgJy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRHcm91cEluZm8gPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwcGluZ3MgPSBnZXRHcm91cE1hcHBpbmdfKHRhcmdldEdyb3VwSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHNldENoZWNrRWxlbWVudFNlbGVjdF8odGFyZ2V0RWxlbWVudCwgXy5kaWZmZXJlbmNlKG1hcHBpbmdzLCBzZWxmLnNlbGVjdGVkUm93c18pLmxlbmd0aCA8PSAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vc2V0IGNoaWxkcmVuIHN0YXR1cy5cbiAgICAgICAgICAgIGlmIChncm91cEhpdEluZm8uYXJlYSA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRHcm91cEluZm8gPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhncm91cEhpdEluZm8ucGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRHcm91cEluZm8uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBfLmNsb25lKGN1cnJlbnRHcm91cEluZm8uY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRHcm91cEluZm8gPSBjaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSB0YXJnZXRHcm91cEluZm8ucGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWdoaCcgKyBwYXRoLmpvaW4oJy0nKSArICctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDaGVja0VsZW1lbnRTZWxlY3RfKHRhcmdldEVsZW1lbnQsIGNoZWNrZWRTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEdyb3VwSW5mby5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLmNvbmNhdCh0YXJnZXRHcm91cEluZm8uY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB0YXJnZXRHcm91cEluZm8uZGF0YS5pdGVtQ291bnQ7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodWlkICsgJy1ncmgnICsgcGF0aC5qb2luKCctJykgKyAnLXInICsgaSArICctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENoZWNrRWxlbWVudFNlbGVjdF8odGFyZ2V0RWxlbWVudCwgY2hlY2tlZFN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWdyJyArIHBhdGguam9pbignXycpICsgJy1yJyArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRSb3dFbGVtZW50U2VsZWN0Xyhyb3dFbGVtZW50LCBjaGVja2VkU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBjdXJyZW50R3JvdXBJbmZvLmRhdGEuaXRlbUNvdW50OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWdyaCcgKyBjdXJyZW50R3JvdXBJbmZvLnBhdGguam9pbignLScpICsgJy1yJyArIGkgKyAnLXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2hlY2tFbGVtZW50U2VsZWN0Xyh0YXJnZXRFbGVtZW50LCBjaGVja2VkU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1aWQgKyAnLWdyJyArIGN1cnJlbnRHcm91cEluZm8ucGF0aC5qb2luKCdfJykgKyAnLXInICsgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSb3dFbGVtZW50U2VsZWN0Xyhyb3dFbGVtZW50LCBjaGVja2VkU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFJvd0VsZW1lbnRTZWxlY3RfKGVsZW1lbnQsIHN0YXR1cykge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGRvbVV0aWwuYWRkQ2xhc3MoZWxlbWVudCwgJ2djLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb21VdGlsLnJlbW92ZUNsYXNzKGVsZW1lbnQsICdnYy1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDaGVja0VsZW1lbnRTZWxlY3RfKGVsZW1lbnQsIHN0YXR1cykge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGRvbVV0aWwuYWRkQ2xhc3MoZWxlbWVudCwgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbVV0aWwucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDaGVja0VsZW1lbnRfKGxheW91dEVuZ2luZSwgaGl0SW5mbykge1xuICAgICAgICB2YXIgc2VsZiA9IGxheW91dEVuZ2luZTtcbiAgICAgICAgdmFyIHVpZCA9IHNlbGYuZ3JpZC51aWQ7XG4gICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgdmFyIGdyb3VwSW5mbyA9IGhpdEluZm8uZ3JvdXBJbmZvO1xuICAgICAgICBpZiAoaGl0SW5mby5hcmVhID09PSBDT1JORVJfSEVBREVSKSB7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctY29ybmVyJztcbiAgICAgICAgfSBlbHNlIGlmIChoaXRJbmZvLmFyZWEgPT09IFJPV19IRUFERVIpIHtcbiAgICAgICAgICAgIGlmICghZ3JvdXBJbmZvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IGhpdEluZm8ucm93O1xuICAgICAgICAgICAgICAgIGlmIChyb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctcmgnICsgcm93O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9DT05URU5UICYmIGdyb3VwSW5mby5yb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctZ3JoJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJy0nKSArICctcicgKyBncm91cEluZm8ucm93O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZ3JvdXBJbmZvLmFyZWEgPT09IEdST1VQX0hFQURFUikge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctZ2hoJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJy0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3IgKyAnLXNlbGVjdCcpIDogbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cE1hcHBpbmdfKGdyb3VwSW5mbykge1xuICAgICAgICB2YXIgbWFwcGluZ3MgPSBbXTtcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBncm91cC5pdGVtQ291bnQpIHtcbiAgICAgICAgICAgIG1hcHBpbmdzLnB1c2goZ3JvdXAudG9Tb3VyY2VSb3coaSkpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXBwaW5ncztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBY3Rpb25Db2x1bW5fKGNvbCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBpbm5lclByZXNlbnRlciA9ICcnO1xuICAgICAgICBpZiAoIXNlbGYuZ3JpZC5jb2x1bW5BY3Rpb25zXykge1xuICAgICAgICAgICAgcmV0dXJuIGlubmVyUHJlc2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhY3Rpb25JbmZvcyA9IHNlbGYuZ3JpZC5jb2x1bW5BY3Rpb25zX1tjb2wuaWRdO1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFjdGlvbkluZm9zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gYWN0aW9uSW5mb3NbaV07XG4gICAgICAgICAgICBpbm5lclByZXNlbnRlciArPSAnPGRpdj4nICsgKGl0ZW0ucHJlc2VudGVyID8gaXRlbS5wcmVzZW50ZXIgOiAoJzxidXR0b24gY2xhc3M9XCJnYy1hY3Rpb25cIiBkYXRhLWFjdGlvbj1cIicgKyBpdGVtLm5hbWUgKyAnXCI+JyArIGl0ZW0ubmFtZSArICc8L2J1dHRvbj4nKSkgKyAnPC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5uZXJQcmVzZW50ZXIgIT09ICcnKSB7XG4gICAgICAgICAgICBpbm5lclByZXNlbnRlciA9ICc8ZGl2IGNsYXNzPVwiZ2MtYWN0aW9uLWFyZWFcIj4nICsgaW5uZXJQcmVzZW50ZXIgKyAnPC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5uZXJQcmVzZW50ZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQWN0aW9uQ29sdW1ucygpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29sdW1ucyA9IFtdO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB2YXIgYWN0aW9uVHlwZSA9IHN3aXBlU3RhdHVzLmFjdGlvblR5cGU7XG4gICAgICAgIF8uZWFjaChzZWxmLmdyaWQuY29sdW1ucywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgICAgICBpZiAoaXNUb3VjaEFjdGlvbkNvbHVtbl8oY29sKSAmJiBjb2wuc3dpcGVEaXJlY3Rpb24gPT09IGFjdGlvblR5cGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJQcmVzZW50ZXIgPSBjcmVhdGVBY3Rpb25Db2x1bW5fLmNhbGwoc2VsZiwgY29sKTtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwZXJzZW50ZXI6IGlubmVyUHJlc2VudGVyLFxuICAgICAgICAgICAgICAgICAgICBwZXJmZXJyZWRTaXplOiBjb2wudmlzaWJsZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVG91Y2hBY3Rpb25Db2x1bW5fKGNvbCkge1xuICAgICAgICByZXR1cm4gY29sLmFjdGlvbiAmJiBjb2wuc3dpcGVEaXJlY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93RWxlbWVudF8obGF5b3V0RW5naW5lLCByb3csIGdyb3VwSW5mbykge1xuICAgICAgICB2YXIgc2VsZiA9IGxheW91dEVuZ2luZTtcbiAgICAgICAgdmFyIHVpZCA9IHNlbGYuZ3JpZC51aWQ7XG4gICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgaWYgKCFncm91cEluZm8pIHtcbiAgICAgICAgICAgIGlmIChyb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gdWlkICsgJy1yJyArIHJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChncm91cEluZm8uYXJlYSA9PT0gR1JPVVBfQ09OVEVOVCAmJiBncm91cEluZm8ucm93ID49IDApIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctZ3InICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpICsgJy1yJyArIGdyb3VwSW5mby5yb3c7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdyb3VwSW5mby5hcmVhID09PSBHUk9VUF9GT09URVIpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHVpZCArICctZ2YnICsgZ3JvdXBJbmZvLnBhdGguam9pbignXycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChncm91cEluZm8uYXJlYSA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSB1aWQgKyAnLWdoJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZWN0b3IgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3RvcikgOiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGFJdGVtKGhpdEluZm8pIHtcbiAgICAgICAgdmFyIGRhdGFJdGVtO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvO1xuICAgICAgICB2YXIgZ3JvdXA7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKGhpdEluZm8uZ3JvdXBJbmZvICYmIGhpdEluZm8uZ3JvdXBJbmZvLmFyZWEgPT09IEdST1VQX0NPTlRFTlQpIHtcbiAgICAgICAgICAgIGdyb3VwSW5mbyA9IGhpdEluZm8uZ3JvdXBJbmZvO1xuICAgICAgICAgICAgZ3JvdXAgPSBzZWxmLmdldEdyb3VwSW5mb18oZ3JvdXBJbmZvLnBhdGgpLmRhdGE7XG4gICAgICAgICAgICBkYXRhSXRlbSA9IGdyb3VwLmdldEl0ZW0oZ3JvdXBJbmZvLnJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhSXRlbSA9IHNlbGYuZ2V0RGF0YUl0ZW0oaGl0SW5mby5yb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFJdGVtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlbGF0ZWRNb3ZlUm93KGhpdFRlc3RJbmZvKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHVpZCA9IHNlbGYuZ3JpZC51aWQ7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciBncm91cEluZm8gPSBoaXRUZXN0SW5mby5ncm91cEluZm87XG4gICAgICAgIGlmIChncm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBwYXJ0ID0gZ3JvdXBJbmZvLmFyZWE7XG4gICAgICAgICAgICBpZiAocGFydCA9PT0gR1JPVVBfSEVBREVSKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdWlkICsgJy1naCcgKyBncm91cEluZm8ucGF0aC5qb2luKCdfJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09IEdST1VQX0NPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSB1aWQgKyAnLWdyJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyBncm91cEluZm8ucm93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXkgPSB1aWQgKyAnLWdmJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IHVpZCArICctcicgKyBoaXRUZXN0SW5mby5yb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBY3Rpb25UeXBlKG1vdmVEaXN0YW5jZSkge1xuICAgICAgICB2YXIgYWN0aW9uUGFuZWw7XG4gICAgICAgIHZhciBhY1R5cGU7XG4gICAgICAgIF8uZWFjaChbJ3RvcCcsICdib3R0b20nXSwgZnVuY3Rpb24oYWN0aW9uVHlwZSkge1xuICAgICAgICAgICAgYWN0aW9uUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzd2lwZVN0YXR1cy5yb3cuaWQgKyAnLScgKyBhY3Rpb25UeXBlICsgJy1hY3Rpb25QYW5lbCcpO1xuICAgICAgICAgICAgaWYgKGFjdGlvblBhbmVsKSB7XG4gICAgICAgICAgICAgICAgYWNUeXBlID0gYWN0aW9uVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhY1R5cGUpIHtcbiAgICAgICAgICAgIGFjVHlwZSA9IG1vdmVEaXN0YW5jZSA+IDAgPyAndG9wJyA6ICdib3R0b20nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjVHlwZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1JldmVyc2VNb3ZlKCkge1xuICAgICAgICByZXR1cm4gKHN3aXBlU3RhdHVzLm1vdmVEaXN0YW5jZSA+IDAgPyAndG9wJyA6ICdib3R0b20nKSAhPT0gc3dpcGVTdGF0dXMuYWN0aW9uVHlwZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZSwgZm9ybWF0LCBmb3JtdWxhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIFNwYXJrbGluZSA9IGdjVXRpbHMuZmluZFBsdWdpbignU3BhcmtsaW5lJyk7XG4gICAgICAgIGlmIChTcGFya2xpbmUgJiYgdmFsdWUgaW5zdGFuY2VvZiBTcGFya2xpbmUuQmFzZVNwYXJrbGluZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gc2VsZi5vcHRpb25zLnJvd0hlaWdodDtcbiAgICAgICAgICAgIHJldHVybiAnPHNwYW4gZGF0YS1mb3JtdWxhPVxcJycgKyBmb3JtdWxhICsgJ1xcJyBjbGFzcz1cImdjLWdyb3VwLXNwYXJrbGluZVwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246bWlkZGxlO3dpZHRoOicgKyBjb250YWluZXJXaWR0aCArICdweDtoZWlnaHQ6JyArIGNvbnRhaW5lcldpZHRoICsgJ3B4O1wiPjwvc3Bhbj4nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnY1V0aWxzLmlzRnVuY3Rpb24oZm9ybWF0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwod2luZG93LkdjU3ByZWFkKSkge1xuICAgICAgICAgICAgdmFyIEZvcm1hdHRlciA9IGdjVXRpbHMuZmluZFBsdWdpbignRm9ybWF0dGVyJyk7XG4gICAgICAgICAgICB2YXIgRXhjZWxGb3JtYXR0ZXIgPSBGb3JtYXR0ZXIgPyBGb3JtYXR0ZXIuRXhjZWxGb3JtYXR0ZXIgOiBudWxsO1xuICAgICAgICAgICAgaWYgKEV4Y2VsRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdE9iaiA9IG5ldyBFeGNlbEZvcm1hdHRlcihmb3JtYXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRPYmouZm9ybWF0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U29ydEluZGljYXRvckh0bWxfKGxheW91dEVuZ2luZSwgY29sT2JqLCBjb2xJbmRleCkge1xuICAgICAgICB2YXIgZ3JpZCA9IGxheW91dEVuZ2luZS5ncmlkO1xuICAgICAgICB2YXIgc29ydEluZm87XG4gICAgICAgIGlmIChncmlkLmRhdGEuc29ydERlc2NyaXB0b3JzKSB7XG4gICAgICAgICAgICBzb3J0SW5mbyA9IF8uZmluZChncmlkLmRhdGEuc29ydERlc2NyaXB0b3JzLCBfLm1hdGNoZXNQcm9wZXJ0eSgnZmllbGQnLCBjb2xPYmouaWQpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc29ydEluZm8pIHtcbiAgICAgICAgICAgIGlmIChncmlkLm9wdGlvbnMuc29ydGluZykge1xuICAgICAgICAgICAgICAgIHZhciBvcFNvcnRJbmZvID0gXy5maW5kKGdyaWQub3B0aW9ucy5zb3J0aW5nLCBfLm1hdGNoZXNQcm9wZXJ0eSgnZmllbGQnLCBjb2xPYmouaWQpKTtcbiAgICAgICAgICAgICAgICBpZiAob3BTb3J0SW5mbykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0SW5mbyA9IF8uZGVmYXVsdHMoc29ydEluZm8sIG9wU29ydEluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb3J0Q3NzID0gZ2V0U29ydENzc0NsYXNzXyhzb3J0SW5mbywgY29sSW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwic29ydENvbnRhaW5lclwiIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0XCI+PGRpdiBjbGFzcz1cIicgKyBzb3J0Q3NzICsgJ1wiPjwvZGl2PjwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNvcnRDc3NDbGFzc18oc29ydEluZm8sIGNvbEluZGV4KSB7XG4gICAgICAgIHZhciBhc2NlbmRpbmc7XG4gICAgICAgIGlmICghc29ydEluZm8pIHtcbiAgICAgICAgICAgIGFzY2VuZGluZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhc2NlbmRpbmcgPSBnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsKHNvcnRJbmZvLmFzY2VuZGluZykgPyB0cnVlIDogISFzb3J0SW5mby5hc2NlbmRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzY2VuZGluZyA/ICgnZ2MtaWNvbiBnYy1zb3J0aW5nIGFzY2VuZGluZyBjJyArIGNvbEluZGV4KSA6ICgnZ2MtaWNvbiBnYy1zb3J0aW5nIGRlc2NlbmRpbmcgYycgKyBjb2xJbmRleCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TGFzdEdyb3VwSXRlbVBhdGhfKHBhdGgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZ3JvdXBJbmZvID0gc2VsZi5ncmlkLmdldEdyb3VwSW5mb18ocGF0aCk7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgZ2QgPSBncm91cC5ncm91cERlc2NyaXB0b3I7XG4gICAgICAgIHZhciBsYXN0SW5kZXggPSAoZ3JvdXAuaXNCb3R0b21MZXZlbCA/IGdyb3VwLml0ZW1Db3VudCA6IGdyb3VwSW5mby5jaGlsZHJlbi5sZW5ndGgpIC0gMTtcbiAgICAgICAgaWYgKCFncm91cC5pc0JvdHRvbUxldmVsICYmICFncm91cC5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRMYXN0R3JvdXBJdGVtUGF0aF8uY2FsbChzZWxmLCBwYXRoLnNsaWNlKCkuY29uY2F0KFtsYXN0SW5kZXhdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvb3RlciA9IGdkLmZvb3RlcjtcbiAgICAgICAgaWYgKGdyb3VwLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgIGl0ZW1JbmRleDogLTEsXG4gICAgICAgICAgICAgICAgYXJlYTogKGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSAmJiAhZm9vdGVyLmNvbGxhcHNlV2l0aEdyb3VwKSA/IEdST1VQX0ZPT1RFUiA6IEdST1VQX0hFQURFUlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXg6IChmb290ZXIgJiYgZm9vdGVyLnZpc2libGUpID8gLTEgOiBsYXN0SW5kZXgsXG4gICAgICAgICAgICAgICAgYXJlYTogKGZvb3RlciAmJiBmb290ZXIudmlzaWJsZSkgPyBHUk9VUF9GT09URVIgOiBHUk9VUF9IRUFERVJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VkaXRpbmdTYW1lUm93XyhoaXRJbmZvLCBlZGl0aW5nSW5mbykge1xuICAgICAgICByZXR1cm4gaGl0SW5mby5ncm91cEluZm8gP1xuICAgICAgICAgICAgKGhpdEluZm8uZ3JvdXBJbmZvLmdyb3VwID09PSBlZGl0aW5nSW5mby5ncm91cEluZm8ucGF0aCAmJiBoaXRJbmZvLmdyb3VwSW5mby5yb3cgPT09IGVkaXRpbmdJbmZvLnJvd0luZGV4KSA6XG4gICAgICAgIGhpdEluZm8ucm93ID09PSBlZGl0aW5nSW5mby5yb3dJbmRleDtcbiAgICB9XG5cbiAgICB2YXIgYW5pID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RhcnRUaW1lID0gMDtcbiAgICAgICAgdmFyIF90aW1lID0gMDtcbiAgICAgICAgdmFyIF9jYWxsYmFjayA9IG51bGw7XG4gICAgICAgIHZhciBwbGF5VHlwZSA9IDA7Ly8wID0gdGltZXIsIDEgPSByYWZcbiAgICAgICAgdmFyIF9sYXN0VGltZSA9IDA7XG4gICAgICAgIHZhciBfc3RvcEFuaW1hdGlvbjtcbiAgICAgICAgdmFyIHJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgICAgICBmdW5jdGlvbiBwbGF5QW5pbWF0aW9uKHRpbWUsIGNiKSB7XG4gICAgICAgICAgICBzdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgX3N0b3BBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIF90aW1lID0gdGltZSAqIDEwMDA7XG4gICAgICAgICAgICBfY2FsbGJhY2sgPSBjYjtcblxuICAgICAgICAgICAgaWYgKHBsYXlUeXBlICYmIHJhZikge1xuICAgICAgICAgICAgICAgIHJhZihfYW5pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChfYW5pLCAxNi42KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9hbmkoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IG5vdyAtIHN0YXJ0VGltZTtcblxuICAgICAgICAgICAgdmFyIGNiID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrKHZhbCB8fCBlYXNlT3V0KGNvdW50LCAwLCAxLCBfdGltZSkpO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY291bnQgPj0gX3RpbWUgfHwgX3N0b3BBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjYigxKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNiKCk7XG5cbiAgICAgICAgICAgIF9sYXN0VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5VHlwZSAmJiByYWYpIHtcbiAgICAgICAgICAgICAgICByYWYoX2FuaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoX2FuaSwgMTYuNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlYXNlT3V0KHQsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIHQgLz0gZCAvIDI7XG4gICAgICAgICAgICBpZiAodCA8IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHQtLTtcbiAgICAgICAgICAgIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGI7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Z1bmN0aW9uIGVhc2VJbk91dCh0LCBiLCBjLCBkKSB7XG4gICAgICAgIC8vICAgIGlmICgodCAvPSBkIC8gMikgPCAxKSB7XG4gICAgICAgIC8vICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gICAgICAgIC8vICAgIH1cbiAgICAgICAgLy8gICAgcmV0dXJuIC1jIC8gMiAqICgoLS10KSAqICh0IC0gMikgLSAxKSArIGI7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIC8vZnVuY3Rpb24gbGluZWFyKHQsIGQpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuIHQgLyBkO1xuICAgICAgICAvL31cblxuICAgICAgICBmdW5jdGlvbiBzdG9wQW5pbWF0aW9uKCkge1xuICAgICAgICAgICAgX3N0b3BBbmltYXRpb24gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBsYXk6IHBsYXlBbmltYXRpb24sXG4gICAgICAgICAgICBzdG9wOiBzdG9wQW5pbWF0aW9uXG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gSG9yaXpvbnRhbExheW91dEVuZ2luZTtcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9sYXlvdXRFbmdpbmVzL0hvcml6b250YWxMYXlvdXRFbmdpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBVTkRFRklORUQgPSAndW5kZWZpbmVkJztcbiAgICB2YXIgZ2NVdGlscyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKHZhbCwgdHlwZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mKHZhbCkgPT09IHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FzdHMgYSB2YWx1ZSB0byBhIHR5cGUgaWYgcG9zc2libGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY2FzdC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9yIGludGVyZmFjZSBuYW1lIHRvIGNhc3QgdG8uXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluIGlmIHRoZSBjYXN0IHdhcyBzdWNjZXNzZnVsLCBudWxsIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0cnlDYXN0KHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIC8vIG51bGwgZG9lc24ndCBpbXBsZW1lbnQgYW55dGhpbmdcbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZXN0IGZvciBpbnRlcmZhY2UgaW1wbGVtZW50YXRpb24gKElRdWVyeUludGVyZmFjZSlcbiAgICAgICAgaWYgKGlzU3RyaW5nKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKSAmJiB2YWx1ZS5pbXBsZW1lbnRzSW50ZXJmYWNlKHR5cGUpID8gdmFsdWUgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVndWxhciB0eXBlIHRlc3RcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgdHlwZSA/IHZhbHVlIDogbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnRyeUNhc3QgPSB0cnlDYXN0O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHByaW1pdGl2ZSB0eXBlIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgb3IgZGF0ZSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSB8fCBpc0Jvb2xlYW4odmFsdWUpIHx8IGlzRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdzdHJpbmcnKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzdHJpbmcgaXMgbnVsbCwgZW1wdHksIG9yIHdoaXRlc3BhY2Ugb25seS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgPyB0cnVlIDogdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKS5sZW5ndGggPCAxO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2UgPSBpc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnbnVtYmVyJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNJbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA9PT0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0ludCA9IGlzSW50O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIEJvb2xlYW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ2Z1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgVU5ERUZJTkVEKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgRGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih2YWx1ZS5nZXRUaW1lKCkpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNEYXRlID0gaXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhbiBBcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0FycmF5ID0gaXNBcnJheTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gb2JqZWN0IChhcyBvcHBvc2VkIHRvIGEgdmFsdWUgdHlwZSBvciBhIGRhdGUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhaXNEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIGEgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKiBAcmV0dXJuIEEgQHNlZTpEYXRhVHlwZSB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUeXBlKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXJyYXknO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5nZXRUeXBlID0gZ2V0VHlwZTtcblxuICAgIGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzVW5kZWZpbmVkKHZhbHVlKSB8fCBpc051bGwodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNOdWxsID0gaXNOdWxsO1xuICAgIGdjVXRpbHMuaXNVbmRlZmluZWRPck51bGwgPSBpc1VuZGVmaW5lZE9yTnVsbDtcblxuICAgIC8vVE9ETzogcmV2aWV3IHRoaXMgbWV0aG9kIGFmdGVyIGZvcm1tdHRlciBpbXBsZW1lbnRhdGlvbiBkb25lLlxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHR5cGUgb2YgYSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBjb252ZXJzaW9uIGZhaWxzLCB0aGUgb3JpZ2luYWwgdmFsdWUgaXMgcmV0dXJuZWQuIFRvIGNoZWNrIGlmIGFcbiAgICAgKiBjb252ZXJzaW9uIHN1Y2NlZWRlZCwgeW91IHNob3VsZCBjaGVjayB0aGUgdHlwZSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gY29udmVydC5cbiAgICAgKiBAcGFyYW0gdHlwZSBAc2VlOkRhdGFUeXBlIHRvIGNvbnZlcnQgdGhlIHZhbHVlIHRvLlxuICAgICAqIEByZXR1cm4gVGhlIGNvbnZlcnRlZCB2YWx1ZSwgb3IgdGhlIG9yaWdpbmFsIHZhbHVlIGlmIGEgY29udmVyc2lvbiB3YXMgbm90IHBvc3NpYmxlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoYW5nZVR5cGUodmFsdWUsIHR5cGUpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IHN0cmluZ3MgdG8gbnVtYmVycywgZGF0ZXMsIG9yIGJvb2xlYW5zXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4obnVtKSA/IHZhbHVlIDogbnVtO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgYW55dGhpbmcgdG8gc3RyaW5nXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNoYW5nZVR5cGUgPSBjaGFuZ2VUeXBlO1xuICAgIC8vXG4gICAgLy8vKipcbiAgICAvLyAqIFJlcGxhY2VzIGVhY2ggZm9ybWF0IGl0ZW0gaW4gYSBzcGVjaWZpZWQgc3RyaW5nIHdpdGggdGhlIHRleHQgZXF1aXZhbGVudCBvZiBhblxuICAgIC8vICogb2JqZWN0J3MgdmFsdWUuXG4gICAgLy8gKlxuICAgIC8vICogVGhlIGZ1bmN0aW9uIHdvcmtzIGJ5IHJlcGxhY2luZyBwYXJ0cyBvZiB0aGUgPGI+Zm9ybWF0U3RyaW5nPC9iPiB3aXRoIHRoZSBwYXR0ZXJuXG4gICAgLy8gKiAne25hbWU6Zm9ybWF0fScgd2l0aCBwcm9wZXJ0aWVzIG9mIHRoZSA8Yj5kYXRhPC9iPiBwYXJhbWV0ZXIuIEZvciBleGFtcGxlOlxuICAgIC8vICpcbiAgICAvLyAqIDxwcmU+XG4gICAgLy8gKiB2YXIgZGF0YSA9IHsgbmFtZTogJ0pvZScsIGFtb3VudDogMTIzNDU2IH07XG4gICAgLy8gKiB2YXIgbXNnID0gd2lqbW8uZm9ybWF0KCdIZWxsbyB7bmFtZX0sIHlvdSB3b24ge2Ftb3VudDpuMn0hJywgZGF0YSk7XG4gICAgLy8gKiA8L3ByZT5cbiAgICAvLyAqXG4gICAgLy8gKiBUaGUgb3B0aW9uYWwgPGI+Zm9ybWF0RnVuY3Rpb248L2I+IGFsbG93cyB5b3UgdG8gY3VzdG9taXplIHRoZSBjb250ZW50IGJ5IHByb3ZpZGluZ1xuICAgIC8vICogY29udGV4dC1zZW5zaXRpdmUgZm9ybWF0dGluZy4gSWYgcHJvdmlkZWQsIHRoZSBmb3JtYXQgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgZm9yIGVhY2hcbiAgICAvLyAqIGZvcm1hdCBlbGVtZW50IGFuZCBnZXRzIHBhc3NlZCB0aGUgZGF0YSBvYmplY3QsIHRoZSBwYXJhbWV0ZXIgbmFtZSwgdGhlIGZvcm1hdCxcbiAgICAvLyAqIGFuZCB0aGUgdmFsdWU7IGl0IHNob3VsZCByZXR1cm4gYW4gb3V0cHV0IHN0cmluZy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gKlxuICAgIC8vICogPHByZT5cbiAgICAvLyAqIHZhciBkYXRhID0geyBuYW1lOiAnSm9lJywgYW1vdW50OiAxMjM0NTYgfTtcbiAgICAvLyAqIHZhciBtc2cgPSB3aWptby5mb3JtYXQoJ0hlbGxvIHtuYW1lfSwgeW91IHdvbiB7YW1vdW50Om4yfSEnLCBkYXRhLFxuICAgIC8vICogICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEsIG5hbWUsIGZtdCwgdmFsKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgaWYgKHdpam1vLmlzU3RyaW5nKGRhdGFbbmFtZV0pKSB7XG4gICAgLy8qICAgICAgICAgICAgICAgICAgIHZhbCA9IHdpam1vLmVzY2FwZUh0bWwoZGF0YVtuYW1lXSk7XG4gICAgLy8qICAgICAgICAgICAgICAgfVxuICAgIC8vKiAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgLy8qICAgICAgICAgICAgIH0pO1xuICAgIC8vICogPC9wcmU+XG4gICAgLy8gKlxuICAgIC8vICogQHBhcmFtIGZvcm1hdCBBIGNvbXBvc2l0ZSBmb3JtYXQgc3RyaW5nLlxuICAgIC8vICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2JqZWN0IHVzZWQgdG8gYnVpbGQgdGhlIHN0cmluZy5cbiAgICAvLyAqIEBwYXJhbSBmb3JtYXRGdW5jdGlvbiBBbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvIGZvcm1hdCBpdGVtcyBpbiBjb250ZXh0LlxuICAgIC8vICogQHJldHVybiBUaGUgZm9ybWF0dGVkIHN0cmluZy5cbiAgICAvLyAqL1xuICAgIC8vZnVuY3Rpb24gZm9ybWF0KGZvcm1hdCwgZGF0YSwgZm9ybWF0RnVuY3Rpb24pIHtcbiAgICAvLyAgICBmb3JtYXQgPSBhc1N0cmluZyhmb3JtYXQpO1xuICAgIC8vICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgvXFx7KC4qPykoOiguKj8pKT9cXH0vZywgZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCB4LCBmbXQpIHtcbiAgICAvLyAgICAgICAgdmFyIHZhbCA9IG1hdGNoO1xuICAgIC8vICAgICAgICBpZiAobmFtZSAmJiBuYW1lWzBdICE9ICd7JyAmJiBkYXRhKSB7XG4gICAgLy8gICAgICAgICAgICAvLyBnZXQgdGhlIHZhbHVlXG4gICAgLy8gICAgICAgICAgICB2YWwgPSBkYXRhW25hbWVdO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBhcHBseSBzdGF0aWMgZm9ybWF0XG4gICAgLy8gICAgICAgICAgICBpZiAoZm10KSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gd2lqbW8uR2xvYmFsaXplLmZvcm1hdCh2YWwsIGZtdCk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIC8vIGFwcGx5IGZvcm1hdCBmdW5jdGlvblxuICAgIC8vICAgICAgICAgICAgaWYgKGZvcm1hdEZ1bmN0aW9uKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgdmFsID0gZm9ybWF0RnVuY3Rpb24oZGF0YSwgbmFtZSwgZm10LCB2YWwpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgICAgIHJldHVybiB2YWwgPT0gbnVsbCA/ICcnIDogdmFsO1xuICAgIC8vICAgIH0pO1xuICAgIC8vfVxuICAgIC8vZ2NVdGlscy5mb3JtYXQgPSBmb3JtYXQ7XG5cbiAgICAvKipcbiAgICAgKiBDbGFtcHMgYSB2YWx1ZSBiZXR3ZWVuIGEgbWluaW11bSBhbmQgYSBtYXhpbXVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIE9yaWdpbmFsIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtaW4gTWluaW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqIEBwYXJhbSBtYXggTWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChtYXgpICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKG1pbikgJiYgdmFsdWUgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1pbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jbGFtcCA9IGNsYW1wO1xuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHRoZSBwcm9wZXJ0aWVzIGZyb20gYW4gb2JqZWN0IHRvIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBUaGUgZGVzdGluYXRpb24gb2JqZWN0IG11c3QgZGVmaW5lIGFsbCB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBzb3VyY2UsXG4gICAgICogb3IgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZHN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHNyYyBUaGUgc291cmNlIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb3B5KGRzdCwgc3JjKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGFzc2VydChrZXkgaW4gZHN0LCAnVW5rbm93biBrZXkgXCInICsga2V5ICsgJ1wiLicpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XG4gICAgICAgICAgICBpZiAoIWRzdC5fY29weSB8fCAhZHN0Ll9jb3B5KGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBkc3Rba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjb3B5KGRzdFtrZXldLCB2YWx1ZSk7IC8vIGNvcHkgc3ViLW9iamVjdHNcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHZhbHVlOyAvLyBhc3NpZ24gdmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jb3B5ID0gY29weTtcblxuICAgIC8qKlxuICAgICAqIFRocm93cyBhbiBleGNlcHRpb24gaWYgYSBjb25kaXRpb24gaXMgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29uZGl0aW9uIENvbmRpdGlvbiBleHBlY3RlZCB0byBiZSB0cnVlLlxuICAgICAqIEBwYXJhbSBtc2cgTWVzc2FnZSBvZiB0aGUgZXhjZXB0aW9uIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IHRydWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnKSB7XG4gICAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyAnKiogQXNzZXJ0aW9uIGZhaWxlZCBpbiBXaWptbzogJyArIG1zZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdjVXRpbHMuYXNzZXJ0ID0gYXNzZXJ0O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBzdHJpbmcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIHN0cmluZyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNTdHJpbmcodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzU3RyaW5nKHZhbHVlKSwgJ1N0cmluZyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNTdHJpbmcgPSBhc1N0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIG51bWVyaWMuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEBwYXJhbSBwb3NpdGl2ZSBXaGV0aGVyIHRvIGFjY2VwdCBvbmx5IHBvc2l0aXZlIG51bWVyaWMgdmFsdWVzLlxuICAgICAqIEByZXR1cm4gVGhlIG51bWJlciBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNOdW1iZXIodmFsdWUsIG51bGxPSywgcG9zaXRpdmUpIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja1R5cGUocG9zaXRpdmUsIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIHBvc2l0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc051bWJlcih2YWx1ZSksICdOdW1iZXIgZXhwZWN0ZWQuJyk7XG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiB2YWx1ZSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdQb3NpdGl2ZSBudW1iZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc051bWJlciA9IGFzTnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhbiBpbnRlZ2VyLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpdmUgV2hldGhlciB0byBhY2NlcHQgb25seSBwb3NpdGl2ZSBpbnRlZ2Vycy5cbiAgICAgKiBAcmV0dXJuIFRoZSBudW1iZXIgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzSW50KHZhbHVlLCBudWxsT0ssIHBvc2l0aXZlKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tUeXBlKHBvc2l0aXZlLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBwb3NpdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNJbnQodmFsdWUpLCAnSW50ZWdlciBleHBlY3RlZC4nKTtcbiAgICAgICAgaWYgKHBvc2l0aXZlICYmIHZhbHVlICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgJ1Bvc2l0aXZlIGludGVnZXIgZXhwZWN0ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0ludCA9IGFzSW50O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBCb29sZWFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIEJvb2xlYW4uXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEJvb2xlYW4gcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzQm9vbGVhbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzQm9vbGVhbih2YWx1ZSksICdCb29sZWFuIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0Jvb2xlYW4gPSBhc0Jvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIERhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBEYXRlLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBEYXRlIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0RhdGUodmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0RhdGUodmFsdWUpLCAnRGF0ZSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNEYXRlID0gYXNEYXRlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBmdW5jdGlvbiBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNGdW5jdGlvbih2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzRnVuY3Rpb24odmFsdWUpLCAnRnVuY3Rpb24gZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRnVuY3Rpb24gPSBhc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYW4gYXJyYXkuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIGFycmF5IHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0FycmF5KHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNBcnJheSh2YWx1ZSksICdBcnJheSBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNBcnJheSA9IGFzQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIGdpdmVuIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gYmUgY2hlY2tlZC5cbiAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIHZhbHVlIGV4cGVjdGVkLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNUeXBlKHZhbHVlLCB0eXBlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgdmFsdWUgaW5zdGFuY2VvZiB0eXBlLCB0eXBlICsgJyBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNUeXBlID0gYXNUeXBlO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSB2YWxpZCBzZXR0aW5nIGZvciBhbiBlbnVtZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBhIG1lbWJlciBvZiB0aGUgZW51bWVyYXRpb24uXG4gICAgICogQHBhcmFtIGVudW1UeXBlIEVudW1lcmF0aW9uIHRvIHRlc3QgZm9yLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNFbnVtKHZhbHVlLCBlbnVtVHlwZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNVbmRlZmluZWRPck51bGwodmFsdWUpICYmIG51bGxPSykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGUgPSBlbnVtVHlwZVt2YWx1ZV07XG4gICAgICAgIGFzc2VydCghaXNVbmRlZmluZWRPck51bGwoZSksICdJbnZhbGlkIGVudW0gdmFsdWUuJyk7XG4gICAgICAgIHJldHVybiBpc051bWJlcihlKSA/IGUgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRW51bSA9IGFzRW51bTtcblxuICAgIC8qKlxuICAgICAqIEVudW1lcmF0aW9uIHdpdGgga2V5IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgZW51bWVyYXRpb24gaXMgdXNlZnVsIHdoZW4gaGFuZGxpbmcgPGI+a2V5RG93bjwvYj4gZXZlbnRzLlxuICAgICAqL1xuICAgIHZhciBLZXkgPSB7XG4gICAgICAgIC8qKiBUaGUgYmFja3NwYWNlIGtleS4gKi9cbiAgICAgICAgQmFjazogOCxcbiAgICAgICAgLyoqIFRoZSB0YWIga2V5LiAqL1xuICAgICAgICBUYWI6IDksXG4gICAgICAgIC8qKiBUaGUgZW50ZXIga2V5LiAqL1xuICAgICAgICBFbnRlcjogMTMsXG4gICAgICAgIC8qKiBUaGUgZXNjYXBlIGtleS4gKi9cbiAgICAgICAgRXNjYXBlOiAyNyxcbiAgICAgICAgLyoqIFRoZSBzcGFjZSBrZXkuICovXG4gICAgICAgIFNwYWNlOiAzMixcbiAgICAgICAgLyoqIFRoZSBwYWdlIHVwIGtleS4gKi9cbiAgICAgICAgUGFnZVVwOiAzMyxcbiAgICAgICAgLyoqIFRoZSBwYWdlIGRvd24ga2V5LiAqL1xuICAgICAgICBQYWdlRG93bjogMzQsXG4gICAgICAgIC8qKiBUaGUgZW5kIGtleS4gKi9cbiAgICAgICAgRW5kOiAzNSxcbiAgICAgICAgLyoqIFRoZSBob21lIGtleS4gKi9cbiAgICAgICAgSG9tZTogMzYsXG4gICAgICAgIC8qKiBUaGUgbGVmdCBhcnJvdyBrZXkuICovXG4gICAgICAgIExlZnQ6IDM3LFxuICAgICAgICAvKiogVGhlIHVwIGFycm93IGtleS4gKi9cbiAgICAgICAgVXA6IDM4LFxuICAgICAgICAvKiogVGhlIHJpZ2h0IGFycm93IGtleS4gKi9cbiAgICAgICAgUmlnaHQ6IDM5LFxuICAgICAgICAvKiogVGhlIGRvd24gYXJyb3cga2V5LiAqL1xuICAgICAgICBEb3duOiA0MCxcbiAgICAgICAgLyoqIFRoZSBkZWxldGUga2V5LiAqL1xuICAgICAgICBEZWxldGU6IDQ2LFxuICAgICAgICAvKiogVGhlIEYxIGtleS4gKi9cbiAgICAgICAgRjE6IDExMixcbiAgICAgICAgLyoqIFRoZSBGMiBrZXkuICovXG4gICAgICAgIEYyOiAxMTMsXG4gICAgICAgIC8qKiBUaGUgRjMga2V5LiAqL1xuICAgICAgICBGMzogMTE0LFxuICAgICAgICAvKiogVGhlIEY0IGtleS4gKi9cbiAgICAgICAgRjQ6IDExNSxcbiAgICAgICAgLyoqIFRoZSBGNSBrZXkuICovXG4gICAgICAgIEY1OiAxMTYsXG4gICAgICAgIC8qKiBUaGUgRjYga2V5LiAqL1xuICAgICAgICBGNjogMTE3LFxuICAgICAgICAvKiogVGhlIEY3IGtleS4gKi9cbiAgICAgICAgRjc6IDExOCxcbiAgICAgICAgLyoqIFRoZSBGOCBrZXkuICovXG4gICAgICAgIEY4OiAxMTksXG4gICAgICAgIC8qKiBUaGUgRjkga2V5LiAqL1xuICAgICAgICBGOTogMTIwLFxuICAgICAgICAvKiogVGhlIEYxMCBrZXkuICovXG4gICAgICAgIEYxMDogMTIxLFxuICAgICAgICAvKiogVGhlIEYxMSBrZXkuICovXG4gICAgICAgIEYxMTogMTIyLFxuICAgICAgICAvKiogVGhlIEYxMiBrZXkuICovXG4gICAgICAgIEYxMjogMTIzXG4gICAgfTtcbiAgICBnY1V0aWxzLktleSA9IEtleTtcblxuICAgIHZhciBFZGl0b3JUeXBlID0ge1xuICAgICAgICAnVGV4dCc6ICd0ZXh0JyxcbiAgICAgICAgJ0NoZWNrQm94JzogJ2NoZWNrYm94JyxcbiAgICAgICAgJ0RhdGUnOiAnZGF0ZScsXG4gICAgICAgICdDb2xvcic6ICdjb2xvcicsXG4gICAgICAgICdOdW1iZXInOiAnbnVtYmVyJ1xuICAgIH07XG4gICAgZ2NVdGlscy5FZGl0b3JUeXBlID0gRWRpdG9yVHlwZTtcblxuICAgIHZhciBEYXRhVHlwZSA9IHtcbiAgICAgICAgJ09iamVjdCc6ICdPYmplY3QnLFxuICAgICAgICAnU3RyaW5nJzogJ1N0cmluZycsXG4gICAgICAgICdOdW1iZXInOiAnTnVtYmVyJyxcbiAgICAgICAgJ0Jvb2xlYW4nOiAnQm9vbGVhbicsXG4gICAgICAgICdEYXRlJzogJ0RhdGUnLFxuICAgICAgICAnQXJyYXknOiAnQXJyYXknXG4gICAgfTtcbiAgICBnY1V0aWxzLkRhdGFUeXBlID0gRGF0YVR5cGU7XG5cbiAgICB2YXIgaXNVbml0bGVzc051bWJlciA9IHtcbiAgICAgICAgY29sdW1uQ291bnQ6IHRydWUsXG4gICAgICAgIGZsZXg6IHRydWUsXG4gICAgICAgIGZsZXhHcm93OiB0cnVlLFxuICAgICAgICBmbGV4U2hyaW5rOiB0cnVlLFxuICAgICAgICBmb250V2VpZ2h0OiB0cnVlLFxuICAgICAgICBsaW5lQ2xhbXA6IHRydWUsXG4gICAgICAgIGxpbmVIZWlnaHQ6IHRydWUsXG4gICAgICAgIG9wYWNpdHk6IHRydWUsXG4gICAgICAgIG9yZGVyOiB0cnVlLFxuICAgICAgICBvcnBoYW5zOiB0cnVlLFxuICAgICAgICB3aWRvd3M6IHRydWUsXG4gICAgICAgIHpJbmRleDogdHJ1ZSxcbiAgICAgICAgem9vbTogdHJ1ZSxcblxuICAgICAgICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gICAgICAgIGZpbGxPcGFjaXR5OiB0cnVlLFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB0cnVlXG4gICAgfTtcbiAgICB2YXIgX3VwcGVyY2FzZVBhdHRlcm4gPSAvKFtBLVpdKS9nO1xuICAgIHZhciBtc1BhdHRlcm4gPSAvXi1tcy0vO1xuXG4gICAgZnVuY3Rpb24gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaXNFbXB0eSA9IGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fCB2YWx1ZSA9PT0gJyc7XG4gICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNOb25OdW1lcmljID0gaXNOYU4odmFsdWUpO1xuICAgICAgICBpZiAoaXNOb25OdW1lcmljIHx8IHZhbHVlID09PSAwIHx8XG4gICAgICAgICAgICBpc1VuaXRsZXNzTnVtYmVyLmhhc093blByb3BlcnR5KG5hbWUpICYmIGlzVW5pdGxlc3NOdW1iZXJbbmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiAnJyArIHZhbHVlOyAvLyBjYXN0IHRvIHN0cmluZ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSArICdweCc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVtb2l6ZVN0cmluZ09ubHkoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhY2hlID0ge307XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChjYWNoZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhY2hlW3N0cmluZ10gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3N0cmluZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHByb2Nlc3NTdHlsZU5hbWUgPSBtZW1vaXplU3RyaW5nT25seShmdW5jdGlvbihzdHlsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHlsZU5hbWUpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX3VwcGVyY2FzZVBhdHRlcm4sICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCAnLW1zLScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hcmt1cEZvclN0eWxlcyhzdHlsZXMpIHtcbiAgICAgICAgdmFyIHNlcmlhbGl6ZWQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHN0eWxlcykge1xuICAgICAgICAgICAgaWYgKCFzdHlsZXMuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBzdHlsZXNbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwoc3R5bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IHByb2Nlc3NTdHlsZU5hbWUoc3R5bGVOYW1lKSArICc6JztcbiAgICAgICAgICAgICAgICBzZXJpYWxpemVkICs9IGRhbmdlcm91c1N0eWxlVmFsdWUoc3R5bGVOYW1lLCBzdHlsZVZhbHVlKSArICc7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VyaWFsaXplZCB8fCBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzID0gY3JlYXRlTWFya3VwRm9yU3R5bGVzO1xuXG4gICAgLyoqXG4gICAgICogQ2FuY2VscyB0aGUgcm91dGUgZm9yIERPTSBldmVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZWxEZWZhdWx0KGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL0lFIDhcbiAgICAgICAgICAgIGUuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2FuY2VsRGVmYXVsdCA9IGNhbmNlbERlZmF1bHQ7XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVPYmplY3Qob2JqKSB7XG4gICAgICAgIHZhciBjbG9uZU9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICAgICAgdmFyIGNhY2hlXyA9IFtdO1xuICAgICAgICBpZiAoY2xvbmVPYmopIHtcbiAgICAgICAgICAgIGNhY2hlXy5wdXNoKGNsb25lT2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdDtcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oZGVzdFtpdGVtXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IHNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmVPYmo7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemVPYmplY3Q7XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZU9iamVjdChvYmopIHtcbiAgICAgICAgdmFyIGNsb25lT2JqID0gXy5jbG9uZShvYmopO1xuICAgICAgICB2YXIgY2FjaGVfID0gW107XG4gICAgICAgIGlmIChjbG9uZU9iaikge1xuICAgICAgICAgICAgY2FjaGVfLnB1c2goY2xvbmVPYmopO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXN0O1xuICAgICAgICB2YXIgZnVuYztcbiAgICAgICAgd2hpbGUgKGNhY2hlXy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXN0ID0gY2FjaGVfLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdChkZXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgY2FjaGVfLnB1c2goZGVzdFtpdGVtXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGRlc3RbaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFtpdGVtXSA9IGZ1bmM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lT2JqO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVPYmplY3QgPSBkZXNlcmlhbGl6ZU9iamVjdDtcblxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuc2VyaWFsaXplRnVuY3Rpb24gPSBzZXJpYWxpemVGdW5jdGlvbjtcblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXplRnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHRlbXBTdHIgPSB2YWx1ZS5zdWJzdHIoOCwgdmFsdWUuaW5kZXhPZignKCcpIC0gOCk7IC8vOCBpcyAnZnVuY3Rpb24nIGxlbmd0aFxuICAgICAgICAgICAgaWYgKHZhbHVlLnN1YnN0cigwLCA4KSA9PT0gJ2Z1bmN0aW9uJyAmJiB0ZW1wU3RyLnJlcGxhY2UoL1xccysvLCAnJykgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ1N0YXJ0ID0gdmFsdWUuaW5kZXhPZignKCcpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYXJnRW5kID0gdmFsdWUuaW5kZXhPZignKScpO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gdmFsdWUuc3Vic3RyKGFyZ1N0YXJ0LCBhcmdFbmQgLSBhcmdTdGFydCkuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcucmVwbGFjZSgvXFxzKy8sICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keVN0YXJ0ID0gdmFsdWUuaW5kZXhPZigneycpICsgMTtcbiAgICAgICAgICAgICAgICB2YXIgYm9keUVuZCA9IHZhbHVlLmxhc3RJbmRleE9mKCd9Jyk7XG4gICAgICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYXJncywgdmFsdWUuc3Vic3RyKGJvZHlTdGFydCwgYm9keUVuZCAtIGJvZHlTdGFydCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZGVzZXJpYWxpemVGdW5jdGlvbiA9IGRlc2VyaWFsaXplRnVuY3Rpb247XG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gQHNlZTpJQ29sbGVjdGlvblZpZXcgb3IgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb3IgQHNlZTpJQ29sbGVjdGlvblZpZXcuXG4gICAgICogQHBhcmFtIG51bGxPSyBXaGV0aGVyIG51bGwgdmFsdWVzIGFyZSBhY2NlcHRhYmxlLlxuICAgICAqIEByZXR1cm4gVGhlIEBzZWU6SUNvbGxlY3Rpb25WaWV3IHRoYXQgd2FzIHBhc3NlZCBpbiBvciBhIEBzZWU6Q29sbGVjdGlvblZpZXdcbiAgICAgKiBjcmVhdGVkIGZyb20gdGhlIGFycmF5IHRoYXQgd2FzIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICAvKlxuICAgICBmdW5jdGlvbiBhc0NvbGxlY3Rpb25WaWV3KHZhbHVlLCBudWxsT0spIHtcbiAgICAgaWYgKHR5cGVvZiBudWxsT0sgPT09IFwidW5kZWZpbmVkXCIpIHsgbnVsbE9LID0gdHJ1ZTsgfVxuICAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBudWxsT0spIHtcbiAgICAgcmV0dXJuIG51bGw7XG4gICAgIH1cbiAgICAgdmFyIGN2ID0gdHJ5Q2FzdCh2YWx1ZSwgJ0lDb2xsZWN0aW9uVmlldycpO1xuICAgICBpZiAoY3YgIT0gbnVsbCkge1xuICAgICByZXR1cm4gY3Y7XG4gICAgIH1cbiAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xuICAgICBhc3NlcnQoZmFsc2UsICdBcnJheSBvciBJQ29sbGVjdGlvblZpZXcgZXhwZWN0ZWQuJyk7XG4gICAgIH1cbiAgICAgcmV0dXJuIG5ldyB3aWptby5jb2xsZWN0aW9ucy5Db2xsZWN0aW9uVmlldyh2YWx1ZSk7XG4gICAgIH1cbiAgICAgZ2NVdGlscy5hc0NvbGxlY3Rpb25WaWV3ID0gYXNDb2xsZWN0aW9uVmlldzsqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcGx1Z2luIG1vZHVsZS5cbiAgICAgKiBAcGFyYW0gbmFtZSBvZiBtb2R1bGVcbiAgICAgKiBAcmV0dXJucyBwbHVnaW4gbW9kdWxlIG9iamVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRQbHVnaW4obmFtZSkge1xuICAgICAgICB2YXIgcGx1Z2luO1xuICAgICAgICAvLyBmaW5kIGZyb20gZ2xvYmFsXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBHY1NwcmVhZC5WaWV3cy5HY0dyaWQuUGx1Z2luc1tuYW1lXTsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy8gICAgcGx1Z2luID0gcmVxdWlyZWpzICYmIHJlcXVpcmVqcyhuYW1lKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIC8vXG4gICAgICAgIC8vLy8gY29tbW9uanMgbm90IHN1cHBvcnRlZCBub3dcbiAgICAgICAgLy9pZiAoIXBsdWdpbiAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHsvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgLy99XG4gICAgICAgIHJldHVybiBwbHVnaW47XG4gICAgfVxuXG4gICAgZ2NVdGlscy5maW5kUGx1Z2luID0gZmluZFBsdWdpbjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZ2NVdGlscztcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9nY1V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyIsIi8vIGRvVC5qc1xuLy8gMjAxMS0yMDE0LCBMYXVyYSBEb2t0b3JvdmEsIGh0dHBzOi8vZ2l0aHViLmNvbS9vbGFkby9kb1Rcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZG9UID0ge1xuICAgICAgICB2ZXJzaW9uOiBcIjEuMC4zXCIsXG4gICAgICAgIHRlbXBsYXRlU2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGV2YWx1YXRlOiAvXFx7XFx7KFtcXHNcXFNdKz8oXFx9PykrKVxcfVxcfS9nLFxuICAgICAgICAgICAgaW50ZXJwb2xhdGU6IC9cXHtcXHs9KFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICBlbmNvZGU6IC9cXHtcXHshKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2U6IC9cXHtcXHsjKFtcXHNcXFNdKz8pXFx9XFx9L2csXG4gICAgICAgICAgICB1c2VQYXJhbXM6IC8oXnxbXlxcdyRdKWRlZig/OlxcLnxcXFtbXFwnXFxcIl0pKFtcXHckXFwuXSspKD86W1xcJ1xcXCJdXFxdKT9cXHMqXFw6XFxzKihbXFx3JFxcLl0rfFxcXCJbXlxcXCJdK1xcXCJ8XFwnW15cXCddK1xcJ3xcXHtbXlxcfV0rXFx9KS9nLFxuICAgICAgICAgICAgZGVmaW5lOiAvXFx7XFx7IyNcXHMqKFtcXHdcXC4kXSspXFxzKihcXDp8PSkoW1xcc1xcU10rPykjXFx9XFx9L2csXG4gICAgICAgICAgICBkZWZpbmVQYXJhbXM6IC9eXFxzKihbXFx3JF0rKTooW1xcc1xcU10rKS8sXG4gICAgICAgICAgICBjb25kaXRpb25hbDogL1xce1xce1xcPyhcXD8pP1xccyooW1xcc1xcU10qPylcXHMqXFx9XFx9L2csXG4gICAgICAgICAgICBpdGVyYXRlOiAvXFx7XFx7flxccyooPzpcXH1cXH18KFtcXHNcXFNdKz8pXFxzKlxcOlxccyooW1xcdyRdKylcXHMqKD86XFw6XFxzKihbXFx3JF0rKSk/XFxzKlxcfVxcfSkvZyxcbiAgICAgICAgICAgIHZhcm5hbWU6IFwiaXRcIixcbiAgICAgICAgICAgIHN0cmlwOiB0cnVlLFxuICAgICAgICAgICAgYXBwZW5kOiB0cnVlLFxuICAgICAgICAgICAgc2VsZmNvbnRhaW5lZDogZmFsc2UsXG4gICAgICAgICAgICBkb05vdFNraXBFbmNvZGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLCAvL2ZuLCBjb21waWxlIHRlbXBsYXRlXG4gICAgICAgIGNvbXBpbGU6IHVuZGVmaW5lZCAgLy9mbiwgZm9yIGV4cHJlc3NcbiAgICB9LCBfZ2xvYmFscztcblxuICAgIGRvVC5lbmNvZGVIVE1MU291cmNlID0gZnVuY3Rpb24oZG9Ob3RTa2lwRW5jb2RlZCkge1xuICAgICAgICB2YXIgZW5jb2RlSFRNTFJ1bGVzID0ge1wiJlwiOiBcIiYjMzg7XCIsIFwiPFwiOiBcIiYjNjA7XCIsIFwiPlwiOiBcIiYjNjI7XCIsICdcIic6IFwiJiMzNDtcIiwgXCInXCI6IFwiJiMzOTtcIiwgXCIvXCI6IFwiJiM0NztcIn0sXG4gICAgICAgICAgICBtYXRjaEhUTUwgPSBkb05vdFNraXBFbmNvZGVkID8gL1smPD5cIidcXC9dL2cgOiAvJig/ISM/XFx3KzspfDx8PnxcInwnfFxcLy9nO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGUgPyBjb2RlLnRvU3RyaW5nKCkucmVwbGFjZShtYXRjaEhUTUwsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlSFRNTFJ1bGVzW21dIHx8IG07XG4gICAgICAgICAgICB9KSA6IFwiXCI7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgX2dsb2JhbHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzIHx8ICgwLCBldmFsKShcInRoaXNcIik7XG4gICAgfSgpKTtcblxuICAgIC8vSGliZXJcbiAgICAvL3JlcGxhdGUgdGhlIG1vZHVsZSBkZWZpbml0aW9uIHdpdGggc2ltcGxlIG1vZHVsZS5leHBvcnRzIHNpbmNlIHdlIG9ubHkgcnVuXG4gICAgLy9pdCBpbiBub2RlIGxpa2UgZW52aXJvbm1lbnRcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9UO1xuICAgIC8vaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvL1xuICAgIC8vfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vXHRkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZG9UO30pO1xuICAgIC8vfSBlbHNlIHtcbiAgICAvL1x0X2dsb2JhbHMuZG9UID0gZG9UO1xuICAgIC8vfVxuXG4gICAgdmFyIHN0YXJ0ZW5kID0ge1xuICAgICAgICBhcHBlbmQ6IHtzdGFydDogXCInKyhcIiwgZW5kOiBcIikrJ1wiLCBzdGFydGVuY29kZTogXCInK2VuY29kZUhUTUwoXCJ9LFxuICAgICAgICBzcGxpdDoge3N0YXJ0OiBcIic7b3V0Kz0oXCIsIGVuZDogXCIpO291dCs9J1wiLCBzdGFydGVuY29kZTogXCInO291dCs9ZW5jb2RlSFRNTChcIn1cbiAgICB9LCBza2lwID0gLyReLztcblxuICAgIGZ1bmN0aW9uIHJlc29sdmVEZWZzKGMsIGJsb2NrLCBkZWYpIHtcbiAgICAgICAgcmV0dXJuICgodHlwZW9mIGJsb2NrID09PSBcInN0cmluZ1wiKSA/IGJsb2NrIDogYmxvY2sudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZGVmaW5lIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUsIGFzc2lnbiwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiZGVmLlwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb2RlID0gY29kZS5zdWJzdHJpbmcoNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghKGNvZGUgaW4gZGVmKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXNzaWduID09PSBcIjpcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuZGVmaW5lUGFyYW1zKSB2YWx1ZS5yZXBsYWNlKGMuZGVmaW5lUGFyYW1zLCBmdW5jdGlvbihtLCBwYXJhbSwgdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZltjb2RlXSA9IHthcmc6IHBhcmFtLCB0ZXh0OiB2fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoY29kZSBpbiBkZWYpKSBkZWZbY29kZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGdW5jdGlvbihcImRlZlwiLCBcImRlZlsnXCIgKyBjb2RlICsgXCInXT1cIiArIHZhbHVlKShkZWYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMudXNlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYy51c2VQYXJhbXMpIGNvZGUgPSBjb2RlLnJlcGxhY2UoYy51c2VQYXJhbXMsIGZ1bmN0aW9uKG0sIHMsIGQsIHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZbZF0gJiYgZGVmW2RdLmFyZyAmJiBwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ3ID0gKGQgKyBcIjpcIiArIHBhcmFtKS5yZXBsYWNlKC8nfFxcXFwvZywgXCJfXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwID0gZGVmLl9fZXhwIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmLl9fZXhwW3J3XSA9IGRlZltkXS50ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChcIihefFteXFxcXHckXSlcIiArIGRlZltkXS5hcmcgKyBcIihbXlxcXFx3JF0pXCIsIFwiZ1wiKSwgXCIkMVwiICsgcGFyYW0gKyBcIiQyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMgKyBcImRlZi5fX2V4cFsnXCIgKyBydyArIFwiJ11cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB2ID0gbmV3IEZ1bmN0aW9uKFwiZGVmXCIsIFwicmV0dXJuIFwiICsgY29kZSkoZGVmKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA/IHJlc29sdmVEZWZzKGMsIHYsIGRlZikgOiB2O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGUoY29kZSkge1xuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlKC9cXFxcKCd8XFxcXCkvZywgXCIkMVwiKS5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIik7XG4gICAgfVxuXG4gICAgZG9ULnRlbXBsYXRlID0gZnVuY3Rpb24odG1wbCwgYywgZGVmLCBkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgIGMgPSBjIHx8IGRvVC50ZW1wbGF0ZVNldHRpbmdzO1xuICAgICAgICB2YXIgY3NlID0gYy5hcHBlbmQgPyBzdGFydGVuZC5hcHBlbmQgOiBzdGFydGVuZC5zcGxpdCwgbmVlZGh0bWxlbmNvZGUsIHNpZCA9IDAsIGluZHYsXG4gICAgICAgICAgICBzdHIgPSAoYy51c2UgfHwgYy5kZWZpbmUpID8gcmVzb2x2ZURlZnMoYywgdG1wbCwgZGVmIHx8IHt9KSA6IHRtcGw7XG5cbiAgICAgICAgdmFyIHVuZXNjYXBlQ29kZTtcblxuICAgICAgICBzdHIgPSAoXCJ2YXIgb3V0PSdcIiArIChjLnN0cmlwID8gc3RyLnJlcGxhY2UoLyhefFxccnxcXG4pXFx0KiArfCArXFx0KihcXHJ8XFxufCQpL2csIFwiIFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccnxcXG58XFx0fFxcL1xcKltcXHNcXFNdKj9cXCpcXC8vZywgXCJcIikgOiBzdHIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJ3xcXFxcL2csIFwiXFxcXCQmXCIpXG4gICAgICAgICAgICAucmVwbGFjZShjLmludGVycG9sYXRlIHx8IHNraXAsIGZ1bmN0aW9uKG0sIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoISFkb250UmVuZGVyTnVsbE9yVW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuZXNjYXBlQ29kZSA9IHVuZXNjYXBlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKCd8fCcpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZUNvZGUgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArICcodHlwZW9mICcgKyBjb2RlICsgJyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAnICsgY29kZSArICchPT0gbnVsbCk/JyArIHVuZXNjYXBlQ29kZSArICc6IFwiXCInICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNzZS5zdGFydCArIHVuZXNjYXBlKGNvZGUpICsgY3NlLmVuZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLmVuY29kZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgbmVlZGh0bWxlbmNvZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnRlbmNvZGUgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5jb25kaXRpb25hbCB8fCBza2lwLCBmdW5jdGlvbihtLCBlbHNlY2FzZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbHNlY2FzZSA/XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID8gXCInO31lbHNlIGlmKFwiICsgdW5lc2NhcGUoY29kZSkgKyBcIil7b3V0Kz0nXCIgOiBcIic7fWVsc2V7b3V0Kz0nXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPyBcIic7aWYoXCIgKyB1bmVzY2FwZShjb2RlKSArIFwiKXtvdXQrPSdcIiA6IFwiJzt9b3V0Kz0nXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuaXRlcmF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBpdGVyYXRlLCB2bmFtZSwgaW5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZXJhdGUpIHJldHVybiBcIic7fSB9IG91dCs9J1wiO1xuICAgICAgICAgICAgICAgIHNpZCArPSAxO1xuICAgICAgICAgICAgICAgIGluZHYgPSBpbmFtZSB8fCBcImlcIiArIHNpZDtcbiAgICAgICAgICAgICAgICBpdGVyYXRlID0gdW5lc2NhcGUoaXRlcmF0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXCc7dmFyIGFycicgKyBzaWQgKyAnPScgKyBpdGVyYXRlICsgXCI7aWYoYXJyXCIgKyBzaWQgKyBcIil7dmFyIFwiICsgdm5hbWUgKyBcIixcIiArIGluZHYgKyBcIj0tMSxsXCIgKyBzaWQgKyBcIj1hcnJcIiArIHNpZCArIFwiLmxlbmd0aC0xO3doaWxlKFwiICsgaW5kdiArIFwiPGxcIiArIHNpZCArIFwiKXtcIlxuICAgICAgICAgICAgICAgICAgICArIHZuYW1lICsgXCI9YXJyXCIgKyBzaWQgKyBcIltcIiArIGluZHYgKyBcIis9MV07b3V0Kz0nXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5ldmFsdWF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiJztcIiArIHVuZXNjYXBlKGNvZGUpICsgXCJvdXQrPSdcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICsgXCInO3JldHVybiBvdXQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIikucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpLnJlcGxhY2UoL1xcci9nLCBcIlxcXFxyXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFxcc3w7fFxcfXxefFxceylvdXRcXCs9Jyc7L2csICckMScpLnJlcGxhY2UoL1xcKycnL2csIFwiXCIpO1xuICAgICAgICAvLy5yZXBsYWNlKC8oXFxzfDt8XFx9fF58XFx7KW91dFxcKz0nJ1xcKy9nLCckMW91dCs9Jyk7XG5cbiAgICAgICAgaWYgKG5lZWRodG1sZW5jb2RlKSB7XG4gICAgICAgICAgICBpZiAoIWMuc2VsZmNvbnRhaW5lZCAmJiBfZ2xvYmFscyAmJiAhX2dsb2JhbHMuX2VuY29kZUhUTUwpIF9nbG9iYWxzLl9lbmNvZGVIVE1MID0gZG9ULmVuY29kZUhUTUxTb3VyY2UoYy5kb05vdFNraXBFbmNvZGVkKTtcbiAgICAgICAgICAgIHN0ciA9IFwidmFyIGVuY29kZUhUTUwgPSB0eXBlb2YgX2VuY29kZUhUTUwgIT09ICd1bmRlZmluZWQnID8gX2VuY29kZUhUTUwgOiAoXCJcbiAgICAgICAgICAgICAgICArIGRvVC5lbmNvZGVIVE1MU291cmNlLnRvU3RyaW5nKCkgKyBcIihcIiArIChjLmRvTm90U2tpcEVuY29kZWQgfHwgJycpICsgXCIpKTtcIlxuICAgICAgICAgICAgICAgICsgc3RyO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGMudmFybmFtZSwgc3RyKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCBjcmVhdGUgYSB0ZW1wbGF0ZSBmdW5jdGlvbjogXCIgKyBzdHIpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb1QuY29tcGlsZSA9IGZ1bmN0aW9uKHRtcGwsIGRlZikge1xuICAgICAgICByZXR1cm4gZG9ULnRlbXBsYXRlKHRtcGwsIG51bGwsIGRlZik7XG4gICAgfTtcblxufSgpKTtcblxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc2NyaXB0cy9ncmlkL2RvVC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGdjVXRpbHMgPSByZXF1aXJlKCcuL2djVXRpbHMnKTtcblxuICAgIHZhciBkb21VdGlsID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVsZW1lbnQgZnJvbSBhbiBIVE1MIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBodG1sIEhUTUwgZnJhZ21lbnQgdG8gY29udmVydCBpbnRvIGFuIEhUTUxFbGVtZW50LlxuICAgICAqIEByZXR1cm4gVGhlIG5ldyBlbGVtZW50LlxuICAgICAqL1xuXG4gICAgLy9yZW1vdmUgYWxsIGNvbW1lbnRzIGFuZCB3aGl0ZXNwYWNlIG9ubHkgdGV4dCBub2Rlc1xuICAgIGZ1bmN0aW9uIGNsZWFuKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IG4rKykgeyAvL2RvIHJld3JpdGUgaXQgdG8gZm9yKHZhciBuPTAsbGVuPVhYWDtpPGxlbjspXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZE5vZGVzW25dO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gOCB8fCAoY2hpbGQubm9kZVR5cGUgPT09IDMgJiYgIS9cXFMvLnRlc3QoY2hpbGQubm9kZVZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIG4tLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb21VdGlsLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBkaXYgPSBudWxsO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5jcmVhdGVUZW1wbGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHZhciByID0gZGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICBjbGVhbihyKTtcbiAgICAgICAgcmV0dXJuIGRpdjtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50SW5uZXJUZXh0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5pbm5lckhUTUwucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldEVsZW1lbnRPdXRlclRleHQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm91dGVySFRNTC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpLnJlcGxhY2UoLyZsdDsvZywgJzwnKS5yZXBsYWNlKC8mZ3Q7L2csICc+Jyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIGVsZW1lbnQgaGFzIGEgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGNoZWNrIGZvci5cbiAgICAgKi9cbiAgICBkb21VdGlsLmhhc0NsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIG5vdGU6IHVzaW5nIGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpIGluc3RlYWQgb2YgZS5jbGFzc05hbWVzXG4gICAgICAgIC8vIHNvIHRoaXMgd29ya3Mgd2l0aCBTVkcgYXMgd2VsbCBhcyByZWd1bGFyIEhUTUwgZWxlbWVudHMuXG4gICAgICAgIGlmIChlICYmIGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInKTtcbiAgICAgICAgICAgIHJldHVybiBlICYmIHJ4LnRlc3QoZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyByZW1vdmVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gcmVtb3ZlIGZvcm0gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiBkb21VdGlsLmhhc0NsYXNzKGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHZhciByeCA9IG5ldyBSZWdFeHAoJ1xcXFxzP1xcXFxiJyArIGNsYXNzTmFtZSArICdcXFxcYicsICdnJyk7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuLnJlcGxhY2UocngsICcnKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNsYXNzIHRvIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgYWRkZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBhZGQgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5hZGRDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLnNldEF0dHJpYnV0ZSAmJiAhZG9tVXRpbC5oYXNDbGFzcyhlLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgY24gPSBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNuID8gY24gKyAnICcgKyBjbGFzc05hbWUgOiBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgb3IgcmVtb3ZlcyBhIGNsYXNzIHRvIG9yIGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZSBFbGVtZW50IHRoYXQgd2lsbCBoYXZlIHRoZSBjbGFzcyBhZGRlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIGFkZCBvciByZW1vdmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhZGRPclJlbW92ZSBXaGV0aGVyIHRvIGFkZCBvciByZW1vdmUgdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGRvbVV0aWwudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUsIGFkZE9yUmVtb3ZlKSB7XG4gICAgICAgIGlmIChhZGRPclJlbW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZG9tVXRpbC5hZGRDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tVXRpbC5yZW1vdmVDbGFzcyhlLCBjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vICoqIGpRdWVyeSByZXBsYWNlbWVudCBtZXRob2RzXG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBlbGVtZW50IGZyb20gYSBqUXVlcnktc3R5bGUgc2VsZWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8c3RyaW5nfSBzZWxlY3RvciBBbiBlbGVtZW50LCBhIHNlbGVjdG9yIHN0cmluZywgb3IgYSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdjVXRpbHMuaXNTdHJpbmcoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIGFuIEhUTUwgZWxlbWVudCBjb250YWlucyBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBwYXJlbnQgUGFyZW50IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBjaGlsZCBDaGlsZCBlbGVtZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBhcmVudCBlbGVtZW50IGNvbnRhaW5zIHRoZSBjaGlsZCBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuY29udGFpbnMgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGZvciAodmFyIGUgPSBjaGlsZDsgZTsgZSA9IGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKGUgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBjb29yZGluYXRlcyBvZiBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIGRvbVV0aWwub2Zmc2V0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgZWxlbWVudC5zY3JvbGxUb3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyBlbGVtZW50LnNjcm9sbExlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIGFuIGVsZW1lbnQgaW4gcGFnZSBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgc2ltaWxhciB0byB0aGUgPGI+Z2V0Qm91bmRpbmdDbGllbnRSZWN0PC9iPiBmdW5jdGlvbixcbiAgICAgKiBleGNlcHQgdGhhdCB1c2VzIHdpbmRvdyBjb29yZGluYXRlcywgd2hpY2ggY2hhbmdlIHdoZW4gdGhlXG4gICAgICogZG9jdW1lbnQgc2Nyb2xscy5cbiAgICAgKi9cbiAgICBkb21VdGlsLmdldEVsZW1lbnRSZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmMgPSBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgd2lkdGg6IHJjLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbm5lciBjb250ZW50IHJlY3RhbmdsZSBvZiBpbnB1dCBlbGVtZW50LlxuICAgICAqIFBhZGRpbmcgYW5kIGJveC1zaXppbmcgaXMgY29uc2lkZXJlZC5cbiAgICAgKiBUaGUgcmVzdWx0IGlzIHRoZSBhY3R1YWwgcmVjdGFuZ2xlIHRvIHBsYWNlIGNoaWxkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGUgcmVwcmVzZW50IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRDb250ZW50UmVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHJjID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5nZXRTdHlsZShlKTtcbiAgICAgICAgdmFyIG1lYXN1cmVtZW50cyA9IFtcbiAgICAgICAgICAgICdwYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAncGFkZGluZ1JpZ2h0JyxcbiAgICAgICAgICAgICdwYWRkaW5nVG9wJyxcbiAgICAgICAgICAgICdwYWRkaW5nQm90dG9tJyxcbiAgICAgICAgICAgICdib3JkZXJMZWZ0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclJpZ2h0V2lkdGgnLFxuICAgICAgICAgICAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJCb3R0b21XaWR0aCdcbiAgICAgICAgXTtcbiAgICAgICAgdmFyIHNpemUgPSB7fTtcbiAgICAgICAgbWVhc3VyZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgc2l6ZVtwcm9wXSA9ICFpc05hTihudW0pID8gbnVtIDogMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBwYWRkaW5nV2lkdGggPSBzaXplLnBhZGRpbmdMZWZ0ICsgc2l6ZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgICAgICAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogcmMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHNpemUuYm9yZGVyTGVmdFdpZHRoICsgc2l6ZS5wYWRkaW5nTGVmdCxcbiAgICAgICAgICAgIHRvcDogcmMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0ICsgc2l6ZS5ib3JkZXJUb3BXaWR0aCArIHNpemUucGFkZGluZ1RvcCxcbiAgICAgICAgICAgIHdpZHRoOiByYy53aWR0aCAtIHBhZGRpbmdXaWR0aCAtIGJvcmRlcldpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByYy5oZWlnaHQgLSBwYWRkaW5nSGVpZ2h0IC0gYm9yZGVySGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE1vZGlmaWVzIHRoZSBzdHlsZSBvZiBhbiBlbGVtZW50IGJ5IGFwcGx5aW5nIHRoZSBwcm9wZXJ0aWVzIHNwZWNpZmllZCBpbiBhbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB3aG9zZSBzdHlsZSB3aWxsIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjc3MgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0eWxlIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gdGhlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZG9tVXRpbC5zZXRDc3MgPSBmdW5jdGlvbihlLCBjc3MpIHtcbiAgICAgICAgdmFyIHMgPSBlLnN0eWxlO1xuICAgICAgICBmb3IgKHZhciBwIGluIGNzcykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNzc1twXTtcbiAgICAgICAgICAgIGlmIChnY1V0aWxzLmlzTnVtYmVyKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocC5tYXRjaCgvd2lkdGh8aGVpZ2h0fGxlZnR8dG9wfHJpZ2h0fGJvdHRvbXxzaXplfHBhZGRpbmd8bWFyZ2luJy9pKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJ3B4JzsgLy8gZGVmYXVsdCB1bml0IGZvciBnZW9tZXRyeSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc1twXSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9tVXRpbC5zY3JvbGxiYXJTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tVXRpbC5zY3JvbGxiYXJTaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyB0b3A6LTEwMDAwcHg7IGxlZnQ6LTEwMDAwcHg7IHdpZHRoOjEwMHB4OyBoZWlnaHQ6MTAwcHg7IG92ZXJmbG93OnNjcm9sbDtcIj48L2Rpdj4nKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBkb21VdGlsLnNjcm9sbGJhclNpemUgPSB7XG4gICAgICAgICAgICB3aWR0aDogZGl2Lm9mZnNldFdpZHRoIC0gZGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBkaXYub2Zmc2V0SGVpZ2h0IC0gZGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gICAgICAgIHJldHVybiBkb21VdGlsLnNjcm9sbGJhclNpemU7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciBmbiA9IGdldENvbXB1dGVkU3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGU7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oZWxlbWVudCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0U3R5bGVWYWx1ZSA9IGZ1bmN0aW9uKGVsZW1lbnQsIHN0eWxlUHJvcGVydHkpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZG9tVXRpbC5nZXRTdHlsZShlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHN0eWxlID8gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KSA6IG51bGw7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuR2V0TWF4U3VwcG9ydGVkQ1NTSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGggPSAxMDAwMDAwO1xuICAgICAgICB2YXIgdGVzdFVwVG8gPSA2MDAwMDAwICogMTAwMDtcbiAgICAgICAgdmFyIGRpdiA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiLz4nKTtcbiAgICAgICAgdmFyIHRlc3Q7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHRlc3QgPSBoICsgNTAwMDAwOyAvLyogMjtcbiAgICAgICAgICAgIGRpdi5zdHlsZS5oZWlnaHQgPSB0ZXN0ICsgJ3B4JztcbiAgICAgICAgICAgIGlmICh0ZXN0ID4gdGVzdFVwVG8gfHwgZGl2Lm9mZnNldEhlaWdodCAhPT0gdGVzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaCA9IHRlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICAgICAgZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQgPSBoO1xuICAgICAgICByZXR1cm4gZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQ7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9tVXRpbDtcbn0oKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9kb21VdGlsLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNVxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6Ikhvcml6b250YWxMYXlvdXRFbmdpbmUuanMifQ==