(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Views"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = factory();
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
	    var Event = __webpack_require__(1).Event;
	    var GridLayoutEngine = __webpack_require__(6);
	    //var collections = require('./collectionView');
	    var domUtil = __webpack_require__(2);
	    var gcUtils = __webpack_require__(3);
	    var TouchWrapper = __webpack_require__(4);
	    var editingHandler = __webpack_require__(5);
	    var MAXSCROLLABLEVERTICALOFFSET = 100;
	    var MAXFEEDBACKOFFSET = 40;
	    var touchStatus;
	    var inertialMoveStatus;
	    var inertialMovetimeSpan = 16;
	    var instancesByReactRootID = {};
	    var scrollPanelZIndexchanged = false;
	
	    var VIEWPORT = 'viewport';
	    var PINNED_VIEWPORT = 'pinnedLeftViewport';
	    var PINNED_RIGHT_VIEWPORT = 'pinnedRightViewport';
	    var GROUP_HEADER = 'groupHeader';
	    var GROUP_FOOTER = 'groupFooter';
	    var GROUP_CONTENT = 'groupContent';
	
	    var Calc = __webpack_require__(7);
	    var collections = Calc.Collections;
	    //for IE9
	    if (window && !window.requestAnimationFrame) {
	        var lastTime_ = 0;
	        window.requestAnimationFrame = function(callback) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime_));
	            window.setTimeout(function() {
	                    callback();
	                },
	                timeToCall);
	            lastTime_ = currTime + timeToCall;
	        };
	    }
	
	    if (window && (typeof window.CustomEvent) !== 'function') {
	        window.CustomEvent = function(event, params) {
	            var evt;
	            params = params || {
	                    bubbles: false,
	                    cancelable: false,
	                    detail: undefined
	                };
	            evt = document.createEvent('CustomEvent');
	            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	            return evt;
	        };
	    }
	
	    /**
	     * Create a new instance of grid model.
	     * @param {Element} container Container node the grid will attached
	     * @param {Array} data An array of objects for grid model.
	     * @param {Array|Object} config An array of column definitions or a JSON object used to deserilze the grid
	     * @param {(Grid.LayoutEngine|Object)} options An layoutEngine instance or options object which will be used to initialise a Grid.GridLayoutEngine instance
	     * @constructor
	     */
	    var GcGrid = function(container, data, config, options) {
	        if (!container) {
	            throw new Error('GcGrid need a valid container to host');
	        }
	
	        var self = this;
	        var uid = Math.round(1000000 * Math.random());
	        self.uid = 'gc-' + uid;
	        instancesByReactRootID[uid] = this;
	
	        self.container = container;
	
	        var jsonObject;
	        if (config && !gcUtils.isUndefined(config.version)) {
	            jsonObject = gcUtils.deserializeObject(config);
	            self.columnsConfig_ = jsonObject.columns;
	            self.columns = self.flatternColumns_(self.columnsConfig_);
	        } else {
	            self.columnsConfig_ = config;
	            //will be initialized during layout engine initialization
	            self.columns = config ? self.flatternColumns_(config) : _.map(_.keys((data && data[0]) || []), function(key) {
	                return {
	                    id: key,
	                    caption: key,
	                    dataField: key
	                };
	            });
	
	            //add remaining data properties as hidden column
	            var tempCol;
	            _.each(_.keys((data && data[0]) || []), function(key) {
	                if (!getColByDataField_.call(self, key)) {
	                    tempCol = {
	                        id: key,
	                        caption: key,
	                        dataField: key,
	                        visible: false,
	                        width: 80
	                    };
	                    self.columns.push(tempCol);
	                    if (self.columnsConfig_) {
	                        self.columnsConfig_.push(tempCol);
	                    }
	                }
	            });
	
	            if (config) {
	                self.colTree_ = {};
	                buildColumnDefTree_(config, null, self.colTree_);
	            } else {
	                self.columnsConfig_ = self.columns;
	            }
	        }
	
	        self.data = new collections.CalcCollection(data, _.map(self.columns, function(column) {
	            return {name: column.id, field: column.dataField};
	        }));
	
	        var i;
	        var length;
	        if (self.data.itemCount) {
	            var item = self.data.sourceCollection[0];
	            if (item) {
	                var cols = self.columns;
	                var col;
	                for (i = 0, length = cols.length; i < length; i++) {
	                    col = cols[i];
	                    if (!col.dataType && col.dataField) {
	                        col.dataType = gcUtils.getType(item[col.dataField]);
	                    }
	                }
	            }
	        }
	
	        self.onMouseClick = new Event();
	        self.onMouseDbClick = new Event();
	        self.onMouseDown = new Event();
	        self.onMouseUp = new Event();
	        self.onMouseMove = new Event();
	        self.onMouseWheel = new Event();
	        self.onKeyDown = new Event();
	        self.editing = new Event();
	        self.onTouchStart_ = new Event();
	        self.onTouchMove_ = new Event();
	        self.onTouchEnd_ = new Event();
	        //When I prevent mouse event while process touch event.it works well on chrome but also fire native click event on IE.
	        //so I only fire tap event on chrome. -Tim
	        self.onTap_ = new Event();
	        self.onSwipe_ = new Event();
	        //in fact,touch scroll is handled by grid.But in some case, it needs chance to clear cache data.
	        self.onTouchScroll_ = new Event();
	
	        self.onScrollOver_ = new Event();
	
	        if (jsonObject) {
	            self.layoutEngine = getLayoutEngine_(jsonObject.layoutEngine);
	        } else {
	            var name = options && options.name;
	            self.layoutEngine = (name && gcUtils.isString(name) && name.length > 12 && name.slice(-12).toLowerCase() === 'layoutengine') ? options : new GridLayoutEngine(_.defaults(options || {}, {allowEditing: false}));
	        }
	
	        self.options = self.layoutEngine.options;
	        var defaultTemplate = self.options.rowTemplate;
	        Object.defineProperty(self.options, 'rowTemplate', {
	            get: function() {
	                return defaultTemplate;
	            },
	            set: function(newValue) {
	                if (defaultTemplate !== newValue) {
	                    //it's usually change the template during layout/group strategy changed
	                    //as the result, the size of the template maybe different and column size may changed
	                    defaultTemplate = newValue;
	                    self.layoutEngine.handleTemplateChange_();
	                }
	            },
	            enumerable: true,
	            configurable: true
	        });
	
	        self.init();
	
	        self.scrollOffset = self.getInitialScrollOffset();
	
	        //create render components
	        //render each components
	        self.scrollableElements_ = [];
	        self.lastRenderedRows_ = {};
	
	        buildDomTree_.call(self);
	        //cache the event handlers since .bind will create a new function.
	        self.handleClickFn_ = handleClick.bind(self);
	        self.handleDbClickFn_ = handleDoubleClick.bind(self);
	        self.handleMouseDownFn_ = handleMouseDown.bind(self);
	        self.handleMouseMoveFn_ = handleMouseMove.bind(self);
	        self.handleMouseUpFn_ = handleMouseUp.bind(self);
	        self.handleKeyDownFn_ = handleKeyDown.bind(self);
	        self.handleWheelFn_ = handleMouseWheel.bind(self);
	        self.handleScrollFn_ = handleScroll_.bind(self);
	        self.handleWindowResizeFn_ = handleWindowResize_.bind(self);
	        self.handleTouchStartFn_ = handleTouchStart_.bind(self);
	        self.handleTouchMoveFn_ = handleTouchMove_.bind(self);
	        self.handleTouchEndFn_ = handleTouchEnd_.bind(self);
	        self.handleInertiaMoveFn_ = handleInertiaMove_.bind(self);
	        self.changeScrollPanelZIndexFn_ = changeBackScrollPanelZIndex.bind(self);
	        self.handleDebounceMouseWheelFn_ = _.debounce(self.changeScrollPanelZIndexFn_, 500);
	        self.handleScrollOverFn_ = handleScollOver_.bind(self);
	        self.handleDebounceScrollOverFn_ = _.debounce(self.handleScrollOverFn_, 200);
	        self.isTouchMode = window.PointerEvent || window.MSPointerEvent || ('ontouchstart' in document.documentElement);
	        registerEvents_.call(this);
	    };
	
	    GcGrid.prototype = {
	        init: function() {
	            var self = this;
	            //adjust self.container
	            //parse column expresion, formatters here
	
	            self.colFormatters_ = {};
	            if (!gcUtils.isUndefinedOrNull(GcGrid)) {
	                self.ExcelFormatter_ = GcGrid.Plugins && GcGrid.Plugins.Formatter && GcGrid.Plugins.Formatter.ExcelFormatter;
	            }
	            _.each(self.columns, function(col) {
	                if (col && col.format) {
	                    var formatter = col.format;
	                    var colId = col.id;
	                    if (gcUtils.isString(formatter) && self.ExcelFormatter_) {
	                        self.colFormatters_[colId] = new self.ExcelFormatter_(formatter);
	                    } else if (gcUtils.isFunction(formatter)) {
	                        self.colFormatters_[colId] = formatter;
	                    }
	                }
	            });
	
	            self.data.getDefaults = function() {
	                return {
	                    group: self.layoutEngine.getGroupInfoDefaults_()
	                };
	            };
	
	            if (self.options.filterExpression) {
	                self.data.filterExpression = self.options.filterExpression;
	            }
	
	            if (self.options.sorting) {
	                var sortDescriptors = _.clone(self.options.sorting, true);
	                _.remove(sortDescriptors, function(sortInfo) {
	                    return gcUtils.isUndefinedOrNull(sortInfo.ascending);
	                });
	                self.data.sortDescriptors = sortDescriptors;
	            }
	
	            if (self.options.grouping) {
	                self.data.groupDescriptors = self.options.grouping;
	            }
	
	            if (self.options.hierarchyDescriptor) {
	                self.data.hierarchyDescriptor = self.options.hierarchyDescriptor;
	            }
	
	            editingHandler.init(self);
	            self.editingHandler = editingHandler;
	            self.layoutEngine.init(self);
	
	            updateGroupStrategy_.call(self);
	
	            if (self.options.groupable || self.data.groups) {
	                self.groupInfos_ = [];
	                self.updateGroupInfos_();
	            }
	
	            var i;
	            var length;
	            var col;
	
	            initBuildInActions_.call(self);
	            self.columnActions_ = {};
	            for (i = 0, length = self.columns.length; i < length; i++) {
	                col = self.columns[i];
	                if (col.action) {
	                    self.columnActions_[col.id] = _.map(gcUtils.isArray(col.action) ? col.action : [col.action], createColumnAction_.bind(self));
	                }
	            }
	
	            initCE_.call(self);
	        },
	        //TODO: remove getDataItem later
	        //getDataItem2_: function(group, row) {
	        //    return this.getDataItem(group ? group.itemMappings[row] : row);
	        //},
	
	        getDataItem: function(row) {
	            var self = this;
	            var data = self.data;
	            if (!data) {
	                return null;
	            }
	            if (row === -1) {
	                return null;
	            }
	            return data.getItem(row);
	        },
	
	        getFormattedDataItem: function(row) {
	            var self = this;
	            var dataItem = self.getDataItem(row);
	            return self.formatDataItem(dataItem);
	        },
	
	        formatDataItem: function(dataItem) {
	            var self = this;
	            var result = {};
	            var i;
	            var len;
	            var col;
	            for (i = 0, len = self.columns.length; i < len; i++) {
	                col = self.columns[i];
	                if (col) {
	                    var prop;
	                    var value;
	                    var field = col.dataField;
	                    if (gcUtils.isString(field)) {
	                        if (col.isCalcColumn_) {  // calculated column
	                            prop = col.id;
	                            value = dataItem[prop];
	                        } else { // bound column
	                            if (field.split(',').length === 1) {
	                                prop = col.dataField;
	                                value = dataItem[prop];
	                            }
	                        }
	                    }
	                    if (prop) {
	                        var colFormatter = self.colFormatters_[col.id];
	                        if (colFormatter) {
	                            if (self.ExcelFormatter_ && (colFormatter instanceof self.ExcelFormatter_)) {
	                                result[prop] = colFormatter.format(value);
	                            } else if (gcUtils.isFunction(colFormatter)) {
	                                result[prop] = colFormatter({value: value, item: dataItem, colDef: col});
	                            }
	                        } else {
	                            result[prop] = value;
	                        }
	                    }
	                }
	            }
	            if (dataItem.node) {
	                result.node = dataItem.node;
	            }
	            return result;
	        },
	
	        /**
	         * get the layout info
	         */
	        getLayoutInfo: function() {
	            return this.layoutEngine.getLayoutInfo();
	        },
	
	        getRenderInfo: function(option) {
	            return this.layoutEngine.getRenderInfo(option);
	        },
	
	        showScrollPanel: function(area) {
	            return this.layoutEngine.showScrollPanel(area);
	        },
	
	        isScrollableArea_: function(area) {
	            return this.layoutEngine.isScrollableArea_(area);
	        },
	
	        getScrollPanelRenderInfo: function(area) {
	            return this.layoutEngine.getScrollPanelRenderInfo(area);
	        },
	
	        getInitialScrollOffset: function() {
	            if (this.layoutEngine.getInitialScrollOffset) {
	                return this.layoutEngine.getInitialScrollOffset();
	            } else {
	                return {
	                    top: 0,
	                    left: 0
	                };
	            }
	        },
	
	        //
	        //handleEditingKeyDown: function(e) {
	        //    var self = this;
	        //    var Key = gcUtils.Key;
	        //    switch (e.keyCode) {
	        //        case Key.Up:
	        //        case Key.Down:
	        //        case Key.Left:
	        //        case Key.Right:
	        //        case Key.PageUp:
	        //        case Key.PageDown:
	        //        case Key.Home:
	        //        case Key.End:
	        //            if (!self.isFullEdit) {
	        //                self.stopCellEditing();
	        //                return;
	        //            }
	        //            break;
	        //        default:
	        //            self.trigger_(self.cellEditing, {
	        //                row: self.activeRow,
	        //                col: self.activeColumn,
	        //                editingText: self.currentEditor.getValue()
	        //            });
	        //    }
	        //},
	        //
	        //handleActiveCellPositionChange: function() {
	        //    var self = this;
	        //    if (!self.activeCellNode) {
	        //        return;
	        //    }
	        //    if (self.currentEditor) {
	        //        if (!domUtil.contains(self.container, self.activeCellNode)) {
	        //            self.stopCellEditing();
	        //            return;
	        //        }
	        //        if (self.currentEditor.args.position) {
	        //            var cellNodeOffset = domUtil.offset(self.activeCellNode);
	        //            var gridOffset = domUtil.offset(self.container);
	        //            self.currentEditor.args.position = {
	        //                top: cellNodeOffset.top - gridOffset.top,
	        //                left: cellNodeOffset.left - gridOffset.left
	        //            };
	        //        }
	        //    }
	        //},
	
	        destroy: function() {
	            var self = this;
	
	            unRegisterEvents_.call(this);
	
	            //TODO: destroy stuffs if needed.
	            editingHandler.destroy(self);
	            if (self.layoutEngine) {
	                self.layoutEngine.destroy();
	                self.layoutEngine = null;
	            }
	
	            self.container.removeChild(document.getElementById(self.uid));
	            delete instancesByReactRootID[self.uid.slice(3)];
	            self.columnActions_ = null;
	        },
	
	        updateGroupInfos_: function() {
	            var self = this;
	            var data = self.data;
	            if (data.groups === null) {
	                self.groupInfos_ = null;
	            } else {
	                var i;
	                var len;
	                self.groupInfos_ = self.groupInfos_ || [];
	                self.groupInfos_.length = 0;
	                if (data.groups) {
	                    for (i = 0, len = data.groups.length; i < len; i++) {
	                        self.groupInfos_.push(createGroupInfo_.call(this, data.groups[i], [i]));
	                    }
	                    self.layoutEngine.initGroupInfosHeight_();
	                }
	            }
	        },
	
	        updateTemplate_: function() {
	            var layoutEngine = this.layoutEngine;
	            layoutEngine.clearRenderCache_();
	        },
	
	        /**
	         * Invalidate entire control.
	         * @param {boolean} rebuildDOMTree  rebuild entire DOM tree or not. If it's true,
	         * it will remove the old DOM tree and insert a new one, otherwise, it will update old
	         * DOM tree container and refresh each layout area.
	         * The default value is true.
	         */
	        invalidate: function(rebuildDOMTree) {
	            var self = this;
	            var scrollPanel;
	            var layoutEngine = self.layoutEngine;
	            self.containerInfo_ = null;
	            layoutEngine.clearRenderCache_();
	            updateGroupStrategy_.call(self);
	            self.updateGroupInfos_();
	
	            if (gcUtils.isUndefinedOrNull(rebuildDOMTree)) {
	                rebuildDOMTree = true;
	            }
	            rebuildDOMTree = !!rebuildDOMTree;
	
	            if (rebuildDOMTree) {
	                //clear render cache
	                self.lastRenderedRows_ = {};
	                unRegisterScrollEvent_.call(self);
	                buildDomTree_.call(self);
	                var initScrollOffset = layoutEngine.getInitialScrollOffset();
	                if (self.scrollOffset.top !== initScrollOffset.top) {
	                    scrollPanel = domUtil.getElement('#' + self.uid + ' .gc-grid-viewport-scroll-panel.scroll-top');
	                    if (scrollPanel) {
	                        scrollPanel.scrollTop = self.scrollOffset.top;
	                    }
	                }
	                if (self.scrollOffset.left !== initScrollOffset.left) {
	                    scrollPanel = domUtil.getElement('#' + self.uid + ' .gc-grid-viewport-scroll-panel.scroll-left');
	                    if (scrollPanel) {
	                        scrollPanel.scrollLeft = self.scrollOffset.left;
	                    }
	                }
	                registerScrollEvent_.call(this);
	                return;
	            }
	
	            var element;
	            var renderInfo;
	            var selector;
	            var layoutIno = self.getLayoutInfo();
	            _.keys(layoutIno).map(function(area) {
	                //update scroll container
	                if (self.showScrollPanel(area)) {
	                    selector = self.uid + '-' + area + '-scroll';
	                    element = document.getElementById(selector);
	                    renderInfo = self.getScrollPanelRenderInfo(area);
	                    if (renderInfo) {
	                        if (element) {
	                            element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.outerDivStyle);
	                            if (element.childNodes.length > 0) {
	                                element.childNodes[0].style.cssText = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                            }
	                        } else {
	                            var id = self.uid + '-' + area + '-scroll';
	                            self.scrollableElements_.push(id);
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
	                            var parentNode = document.querySelector('#' + self.uid + ' .gc-grid-container');
	                            parentNode.insertBefore(scrollBarElement, parentNode.firstElementChild);
	                        }
	                    }
	                } else {
	                    selector = self.uid + '-' + area + '-scroll';
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
	                //update container
	                renderInfo = self.getRenderInfo({
	                    area: area,
	                    offsetTop: self.scrollOffset.top,
	                    offsetLeft: self.scrollOffset.left,
	                    includeRows: false
	                });
	                if (renderInfo) {
	                    selector = self.uid + '-' + area;
	                    element = document.getElementById(selector);
	                    element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.outerDivStyle);
	                    selector += '-inner';
	                    element = document.getElementById(selector);
	                    if (element) {
	                        element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                    }
	                }
	            });
	            //update container and clear cached items
	            _.keys(layoutIno).map(function(area) {
	                self.refresh(area);
	            });
	        },
	
	        /**
	         * Refresh the specified part of the grid.
	         * @param {string} area Which part needs to be refresh
	         * /
	         //*/
	        refresh: function(area) {
	            var self = this;
	            var rows;
	            var i;
	            var len;
	            var renderRange = self.layoutEngine.getRenderRange_({
	                area: area,
	                offsetTop: self.scrollOffset.top,
	                offsetLeft: self.scrollOffset.left
	            });
	
	            var innerElement = document.getElementById(self.uid + '-' + area + '-inner');
	            if (renderRange) {
	                setTransform(innerElement, renderRange.left, renderRange.top);
	            }
	            if (renderRange) {
	                rows = renderRange.renderedRows || [];
	                var lastRenderedRows = self.lastRenderedRows_[area];
	                var newRenderedRows = _.pluck(rows, 'key');
	                var operations = findMinimumOperations_(lastRenderedRows, newRenderedRows);
	                var info;
	                var key;
	                //var style;
	                //var element;
	                var div = document.createElement('div');
	                var op;
	                for (i = 0, len = operations.length; i < len; i++) {
	                    op = operations[i];
	                    switch (op.operation) {
	                        case 'insert':
	                            key = findRow(rows, op.item);
	                            info = self.layoutEngine.getRenderRowInfo_(key, area);
	                            div.innerHTML = self.renderRow_(info);
	                            innerElement.appendChild(div.childNodes[0]);
	                            break;
	                        case 'delete':
	                            key = lastRenderedRows[op.index];
	                            innerElement.removeChild(document.getElementById(key));
	                            break;
	                        case 'update':
	                            key = findRow(rows, lastRenderedRows[op.index]);
	                            info = self.layoutEngine.getRenderRowInfo_(key, area);
	                            div.innerHTML = self.renderRow_(info);
	                            innerElement.replaceChild(div.childNodes[0], document.getElementById(key.key));
	                            break;
	                        case 'replace':
	                            var oldItemKey = lastRenderedRows[op.index[0]];
	                            var newItemKey = findRow(rows, newRenderedRows[op.index[1]]);
	                            info = self.layoutEngine.getRenderRowInfo_(newItemKey, area);
	                            div.innerHTML = self.renderRow_(info);
	                            innerElement.replaceChild(div.childNodes[0], document.getElementById(oldItemKey));
	                            break;
	                    }
	                }
	
	                self.lastRenderedRows_[area] = newRenderedRows;
	                div = null;
	            }
	        },
	
	        scrollRenderPart_: function(area) {
	            var self = this;
	            var rows;
	            var i;
	            var len;
	            //if (gcUtils.isUndefinedOrNull(rebuildRowContentDOMTree)) {
	            //    rebuildRowContentDOMTree = true;
	            //}
	            //rebuildRowContentDOMTree = !!rebuildRowContentDOMTree;
	
	            var renderRange = self.layoutEngine.getRenderRange_({
	                area: area,
	                offsetTop: self.scrollOffset.top,
	                offsetLeft: self.scrollOffset.left
	            });
	
	            var innerElement = document.getElementById(self.uid + '-' + area + '-inner');
	            setTransform(innerElement, renderRange.left, renderRange.top);
	
	            if (renderRange) {
	                rows = renderRange.renderedRows || [];
	                var lastRenderedRows = self.lastRenderedRows_[area];
	                var newRenderedRows = _.pluck(rows, 'key');
	                var operations = findScrollMinimumOperations(lastRenderedRows, newRenderedRows);
	                var info;
	                var key;
	                //var style;
	                //var element;
	                var div = document.createElement('div');
	                var op;
	                for (i = 0, len = operations.length; i < len; i++) {
	                    op = operations[i];
	                    switch (op.operation) {
	                        case 'insert':
	                            key = findRow(rows, op.index);
	                            info = self.layoutEngine.getRenderRowInfo_(key, area);
	                            div.innerHTML = self.renderRow_(info);
	                            innerElement.appendChild(div.childNodes[0]);
	                            break;
	                        case 'delete':
	                            key = op.index;
	                            //innerElement.removeChild(innerElement.querySelector('.' + key))
	                            innerElement.removeChild(document.getElementById(key));
	                            break;
	                        case 'replace':
	                            var oldItemKey = op.index[0];
	                            var newItemKey = findRow(rows, op.index[1]);
	                            info = self.layoutEngine.getRenderRowInfo_(newItemKey, area);
	                            div.innerHTML = self.renderRow_(info);
	                            // innerElement.replaceChild(div.childNodes[0], innerElement.querySelector('.' + oldItemKey));
	                            innerElement.replaceChild(div.childNodes[0], document.getElementById(oldItemKey));
	                            break;
	                    }
	                }
	
	                self.lastRenderedRows_[area] = newRenderedRows;
	                div = null;
	            }
	        },
	
	        //TODO: refactoring it later.
	        //TODO: By innerHTML serializition will lose canvas info. So editing sparkline formula is wrong. I'll fix it later. -Jackson
	        refreshRow_: function(area, groupPath, row) {
	            var self = this;
	            var innerElement = document.getElementById(self.uid + '-' + area + '-inner');
	            var div = document.createElement('div');
	            var info;
	            if (innerElement) {
	                var key = self.uid + '-r' + row;
	                info = self.layoutEngine.getRenderRowInfo_({
	                    key: key,
	                    index: row,
	                    height: self.options.rowHeight,
	                    path: groupPath
	                }, area);
	                div.innerHTML = self.renderRow_(info);
	                innerElement.replaceChild(div.childNodes[0], document.getElementById(key));
	            }
	        },
	
	        refreshScrollBar_: function() {
	            var self = this;
	            var layoutInfo = self.layoutEngine.getLayoutInfo();
	            var selector;
	            var element;
	            var renderInfo;
	            _.keys(layoutInfo).map(function(area) {
	                //update scroll container
	                if (self.showScrollPanel(area)) {
	                    selector = self.uid + '-' + area + '-scroll';
	                    element = document.getElementById(selector);
	                    renderInfo = self.getScrollPanelRenderInfo(area);
	                    if (renderInfo) {
	                        if (element) {
	                            element.style.cssText = gcUtils.createMarkupForStyles(renderInfo.outerDivStyle);
	                            if (element.childNodes.length > 0) {
	                                element.childNodes[0].style.cssText = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                            }
	                        } else {
	                            var id = self.uid + '-' + area + '-scroll';
	                            self.scrollableElements_.push(id);
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
	                            var parentNode = document.querySelector('#' + self.uid + ' .gc-grid-container');
	                            parentNode.insertBefore(scrollBarElement, parentNode.firstElementChild);
	                        }
	                    }
	                } else {
	                    selector = self.uid + '-' + area + '-scroll';
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
	
	        getRowTemplate: function() {
	            return this.layoutEngine.getRowTemplate();
	        },
	
	        toJSON: function() {
	            var self = this;
	            var jsonObj = {};
	            jsonObj.version = '0.1';
	            jsonObj.layoutEngine = self.layoutEngine.toJSON();
	            jsonObj.columns = gcUtils.serializeObject(self.columnsConfig_);
	
	            var option = {};
	            var i;
	            var length;
	            var groupDescriptors = self.data.groupDescriptors;
	            if (groupDescriptors) {
	                var groups = [];
	                for (i = 0, length = groupDescriptors.length; i < length; i++) {
	                    groups.push(gcUtils.serializeObject(groupDescriptors[i]));
	                }
	                if (groups.length > 0) {
	                    option.grouping = groups;
	                }
	            }
	            if (self.data.filterExpression) {
	                option.filter = self.data.filterExpression;
	            }
	            jsonObj.layoutEngine.options = _.defaults(option, jsonObj.layoutEngine.options);
	            return jsonObj;
	        },
	
	        getContainerInfo_: function() {
	            var self = this;
	            //Fix bug, we need consider css settings in .gc-grid class
	            self.container.className += ' gc-grid';
	
	            self.containerInfo_ = {
	                contentRect: domUtil.getContentRect(self.container)
	            };
	
	            self.container.className = self.container.className.replace('gc-grid', '');
	            return self.containerInfo_;
	        },
	
	        getGroupInfo_: function(path) {
	            var i;
	            var len;
	            var groupInfos = this.groupInfos_;
	            var currentGroup = groupInfos[path[0]];
	            for (i = 1, len = path.length; i < len; i++) {
	                currentGroup = currentGroup.children[path[i]];
	            }
	            return currentGroup;
	        },
	
	        getActionHandler_: function(columnId, name) {
	            var self = this;
	            if (self.buildInActions_[name]) {
	                if (name === 'edit' && editingHandler.isEditing_) {
	                    return function() {
	                        self.stopEditing();
	                    };
	                }
	                return self.buildInActions_[name].handler;
	            }
	            var colActions = self.columnActions_[columnId];
	            if (colActions) {
	                var action;
	                var i;
	                var length;
	                for (i = 0, length = colActions.length; i < length; i++) {
	                    action = colActions[i];
	                    if (action.name === name && action.handler) {
	                        return action.handler;
	                    }
	                }
	            }
	            return null;
	        },
	
	        startEditing: function() {
	            var self = this;
	            var hitInfo = self.layoutEngine && self.layoutEngine.hitTestInfo_;
	            if (!hitInfo) {
	                return false;
	            }
	            var uiRowIndex;
	            var groupInfo = null;
	            var hitGroupInfo = hitInfo.groupInfo;
	            if (hitGroupInfo) {
	                uiRowIndex = hitGroupInfo.row;
	                groupInfo = self.getGroupInfo_(hitGroupInfo.path);
	            } else {
	                uiRowIndex = hitInfo.row;
	            }
	            var isEditing = editingHandler.startEditing(self, groupInfo, uiRowIndex);
	            if (self.hasEditAction_ && isEditing) {
	                updateEditingButtonValue.call(self, 'save');
	            }
	            return isEditing;
	        },
	
	        stopEditing: function() {
	            var self = this;
	            if (editingHandler.isEditing_) {
	                if (self.hasEditAction_) {
	                    updateEditingButtonValue.call(self, 'edit');
	                }
	                return editingHandler.stopEditing(self);
	            }
	            return false;
	        },
	
	        cancelEditing: function() {
	            var self = this;
	            if (self.hasEditAction_) {
	                updateEditingButtonValue.call(self, 'edit');
	            }
	            editingHandler.unMountEditors(self);
	        },
	
	        getSelections: function() {
	            var self = this;
	            if (self.layoutEngine) {
	                return self.layoutEngine.getSelections();
	            }
	            return [];
	        },
	
	        renderRow_: function(row) {
	            var rowRenderInfo = row.renderInfo;
	            var serialized = '<div' + (row.key ? (' id="' + row.key + '"') : '') + (row.isRowRole ? ' role="row"' : '') + (row.selected ? ' aira-selected="true"' : '');
	            if (rowRenderInfo.style) {
	                serialized += ' style="' + gcUtils.createMarkupForStyles(rowRenderInfo.style) + '"';
	            }
	            if (rowRenderInfo.cssClass) {
	                serialized += ' class="' + rowRenderInfo.cssClass + (row.selected ? ' gc-selected' : '') + '"';
	            }
	            serialized += '>';
	            if (rowRenderInfo.renderedHTML) {
	                serialized += rowRenderInfo.renderedHTML;
	            }
	            serialized += '</div>';
	            return serialized;
	        },
	
	        getColById_: function(id) {
	            var cols = this.columns;
	            var col;
	            for (var i = 0, len = cols.length; i < len; i++) {
	                col = cols[i];
	                if (col.id === id) {
	                    return col;
	                }
	            }
	            return null;
	        },
	
	        isColVisible_: function(col, pinned) {
	            if (!col.visible || col.pinned !== pinned) {
	                return false;
	            }
	            var colTree = this.colTree_;
	            if (colTree) {
	                var parent = colTree[colTree[col.id].parent];
	                if (parent) {
	                    var status = pinned === 'left' ? parent.pinnedStatus : (pinned === 'right' ? parent.pinnedRightStatus : parent.status);
	                    if (status.isCollapsed && col.headerGroupShow === 'expanded') {
	                        return false;
	                    } else if (!status.isCollapsed && col.headerGroupShow === 'collapsed') {
	                        return false;
	                    }
	                }
	            }
	            return true;
	        },
	
	        flatternColumns_: function(colsConfig) {
	            var self = this;
	            var result = [];
	            _.each(colsConfig, function(obj) {
	                if (obj.hasOwnProperty('dataField') || obj.hasOwnProperty('action') || obj.hasOwnProperty('asyncRender')) {
	                    result.push(obj);
	                } else if (obj.hasOwnProperty('columns')) {
	                    result = result.concat(self.flatternColumns_(obj.columns));
	                }
	            });
	            return result;
	        },
	
	        insertColumns_: function(columns) {
	            var self = this;
	            var i;
	            var len;
	            var col;
	            if (!gcUtils.isArray(columns)) {
	                columns = [columns];
	            }
	            var item = self.data.sourceCollection[0];
	            for (i = 0, len = columns.length; i < len; i++) {
	                col = columns[i];
	                if (!col.columns) {
	                    col = _.defaults(col, _.defaults(self.layoutEngine.getColumnDefaults_(), {
	                        id: col.dataField,
	                        caption: col.dataField
	                    }));
	                } else {
	                    initCols_.call(self, col.columns);
	                }
	                col.visibleWidth = col.width;
	                if (!col.dataType && col.dataField) {
	                    col.dataType = gcUtils.getType(item[col.dataField]);
	                }
	                if (col.format && col.id) {
	                    var colId = col.id;
	                    var formatter = col.format;
	                    if (gcUtils.isString(formatter) && self.ExcelFormatter_) {
	                        self.colFormatters_[colId] = new self.ExcelFormatter_(formatter);
	                    } else if (gcUtils.isFunction(formatter)) {
	                        self.colFormatters_[colId] = formatter;
	                    }
	                }
	                if (col.action) {
	                    self.columnActions_[col.id] = _.map(gcUtils.isArray(col.action) ? col.action : [col.action], createColumnAction_.bind(self));
	                }
	                if (_.startsWith(_.trim(col.dataField), '=')) {
	                    col.isCalcColumn_ = true;
	                    self.data.calcSource_.addCalcColumn(col.id, col.dataField);
	                }
	                self.columnsConfig_.push(col);
	                self.columns.push(col);
	            }
	            if (self.colTree_) {
	                self.colTree_ = {};
	                buildColumnDefTree_(self.columnsConfig_, null, self.colTree_);
	            }
	
	            if (self.layoutEngine.updateStartSize_) {
	                self.layoutEngine.updateStartSize_();
	            }
	            self.invalidate();
	        }
	    };
	
	    function getColByDataField_(dataField) {
	        var cols = this.columns;
	        var col;
	        for (var i = 0, len = cols.length; i < len; i++) {
	            col = cols[i];
	            if (col.dataField === dataField) {
	                return col;
	            }
	        }
	        return null;
	    }
	
	    function initCols_(cols) {
	        var self = this;
	        var i;
	        var len;
	        var col;
	        for (i = 0, len = cols.length; i < len; i++) {
	            col = cols[i];
	            if (!col.columns) {
	                col = _.defaults(col, _.defaults(self.layoutEngine.getColumnDefaults_(), {
	                    id: col.dataField,
	                    caption: col.dataField
	                }));
	            } else {
	                initCols_.call(self, col);
	            }
	        }
	    }
	
	    function buildColumnDefTree_(colsConfig, parent, columnDefTree) {
	        _.each(colsConfig, function(obj) {
	            if (obj.hasOwnProperty('dataField') || obj.hasOwnProperty('action') || obj.hasOwnProperty('asyncRender')) {
	                columnDefTree[obj.id] = {
	                    parent: parent
	                };
	            } else if (obj.hasOwnProperty('columns')) {
	                columnDefTree[obj.caption] = {
	                    parent: parent,
	                    status: {
	                        showIcon: showCollapseIcon(obj, 'none'),
	                        isCollapsed: true
	                    },
	                    pinnedStatus: {
	                        showIcon: showCollapseIcon(obj, 'left'),
	                        isCollapsed: true
	                    },
	                    pinnedRightStatus: {
	                        showIcon: showCollapseIcon(obj, 'right'),
	                        isCollapsed: true
	                    }
	                };
	                buildColumnDefTree_(obj.columns, obj.caption, columnDefTree);
	            }
	        });
	    }
	
	    function hasPinnedOrUnpinnedColumn_(cols, pinned) {
	        var i;
	        var len;
	        var col;
	        var result = false;
	        for (i = 0, len = cols.length; i < len; i++) {
	            col = cols[i];
	            if (col.columns) {
	                result = hasPinnedOrUnpinnedColumn_(col.columns, pinned);
	            } else {
	                result = col.pinned === pinned;
	            }
	            if (result) {
	                break;
	            }
	        }
	        return result;
	    }
	
	    function showCollapseIcon(col, pinned) {
	        var cols = col.columns;
	        var len = cols.length;
	        var i;
	        var len2 = len;
	        var showCount = 0;
	        var hiddenCount = 0;
	        var len3 = 0;
	        for (i = 0; i < len2; i++) {
	            col = cols[i];
	            if (!col.columns) {
	                col.pinned = col.pinned || 'none';
	            }
	
	            if ((col.columns && hasPinnedOrUnpinnedColumn_(col.columns, pinned)) || (col.pinned === pinned && col.headerGroupShow !== 'expanded')) {
	                showCount += 1;
	                len3 += 1;
	            } else if (col.pinned === pinned && col.headerGroupShow === 'expanded') {
	                hiddenCount += 1;
	                len3 += 1;
	            }
	        }
	
	        if (showCount === len3 || hiddenCount === len3) {
	            return false;
	        }
	        return true;
	    }
	
	    //function flatternColumns_(colsConfig) {
	    //    var result = [];
	    //    _.each(colsConfig, function(obj) {
	    //        if (obj.hasOwnProperty('dataField') || obj.hasOwnProperty('action')) {
	    //            result.push(obj);
	    //        } else if (obj.hasOwnProperty('columns')) {
	    //            result = result.concat(flatternColumns_(obj.columns));
	    //        }
	    //    });
	    //    return result;
	    //}
	
	    //TODO: handle the action column in group
	    function updateEditingButtonValue(value) {
	        var editingInfo = editingHandler.editingInfo_;
	        var selectionPart = editingInfo.group ? ('-gr' + editingInfo.group.join('_') + '-r' + editingInfo.rowIndex) : ('-r' + editingInfo.rowIndex);
	        var element = document.querySelector('#' + this.uid + selectionPart + ' .gc-action-area button[data-action="edit"]');
	        if (element) {
	            element.innerHTML = value;
	        }
	    }
	
	    function createColumnAction_(item) {
	        var self = this;
	        var isStr = gcUtils.isString(item);
	        var name = isStr ? item : item.name;
	        if (!isStr && self.buildInActions_[name] && item.handler) {
	            self.buildInActions_[name].handler = item.handler;
	        }
	        if (name === 'edit') {
	            self.hasEditAction_ = true;
	        }
	        if (name === 'cancel') {
	            self.hasCancelAction_ = true;
	        }
	        return isStr ? {name: item} : item;
	    }
	
	    function findRow(rows, rowKey) {
	        return _.find(rows, function(row) {
	            return row.key === rowKey;
	        });
	    }
	
	    function setTransform(element, left, top) {
	        element.style.setProperty(getTransformProName(), getTransformProValue(left, top));
	    }
	
	    function getTransformProName() {
	        return (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || navigator.userAgent.match(/Firefox/i)) ? 'transform' : '-webkit-transform';
	    }
	
	    function getTransformProValue(left, top) {
	        top = top + 'px';
	        left = left + 'px';
	        return 'translate3d(' + left + ',' + top + ', 0px)';
	    }
	
	    function getLayoutEngine_(layoutEngineInfo) {
	        var name = layoutEngineInfo.name;
	        var options = layoutEngineInfo.options;
	        if (options && options.groupStrategy) {
	            var strategy = options.groupStrategy;
	            if (gcUtils.isString(strategy.name) && GcGrid && GcGrid.Plugins && GcGrid.Plugins[strategy.name]) {
	                options.groupStrategy = new GcGrid.Plugins[strategy.name](options);
	            }
	        }
	        if (gcUtils.isString(name) && GcGrid && GcGrid.Plugins && GcGrid.Plugins[name]) {
	            return new GcGrid.Plugins[name](options);
	        }
	        return new GridLayoutEngine(options);
	    }
	
	    function trigger_(event, sender, e) {
	        e = e || {};
	        return event.raise(sender, e);
	    }
	
	    function createGroupInfo_(group, path) {
	        var self = this;
	        var r = {
	            data: group,
	            path: path,
	            isBottomLevel: group.isBottomLevel
	        };
	        if (!group.isBottomLevel) {
	            r.children = _.map(group.groups, function(subGroup, index) {
	                return createGroupInfo_.call(self, subGroup, path.concat([index]));
	            });
	        }
	        return r;
	    }
	
	    function registerEvents_() {
	        var self = this;
	        var container = self.container;
	        if (!container.tabIndex || container.tabIndex < 0) { //Only focusable element can be bound keydown event.
	            container.tabIndex = 1;
	        }
	        container.addEventListener('click', self.handleClickFn_);
	        container.addEventListener('dblclick', self.handleDbClickFn_);
	        container.addEventListener('mousedown', self.handleMouseDownFn_);
	        container.addEventListener('mouseup', self.handleMouseUpFn_);
	        container.addEventListener('mousemove', self.handleMouseMoveFn_);
	        container.addEventListener('keydown', self.handleKeyDownFn_);
	        container.addEventListener('wheel', self.handleWheelFn_);
	        container.addEventListener('wheel', self.handleDebounceMouseWheelFn_);
	
	        self.onScrollOver_.addHandler(self.handleDebounceScrollOverFn_);
	
	        window.addEventListener('resize', self.handleWindowResizeFn_);
	        registerScrollEvent_.call(self);
	        registerTouchEvent_.call(self);
	
	        self.data.collectionChanged.addHandler(handleCollectionChanged_, self);
	    }
	
	    function changeScrollPanelZindex() {
	        var self = this;
	        if (!scrollPanelZIndexchanged) {
	            var element = document.getElementById(self.uid + '-viewport-scroll');
	            if (element) {
	                element.style['z-index'] = 20000;
	                scrollPanelZIndexchanged = true;
	            }
	        }
	    }
	
	    function changeBackScrollPanelZIndex() {
	        var self = this;
	        if (scrollPanelZIndexchanged) {
	            var element = document.getElementById(self.uid + '-viewport-scroll');
	            if (element) {
	                element.style.removeProperty('z-index');
	                scrollPanelZIndexchanged = false;
	                self.scrolling_ = false;
	            }
	        }
	    }
	
	    function unRegisterEvents_() {
	        var self = this;
	        var container = self.container;
	        container.removeEventListener('click', self.handleClickFn_);
	        container.removeEventListener('dblclick', self.handleDbClickFn_);
	        container.removeEventListener('mousedown', self.handleMouseDownFn_);
	        container.removeEventListener('mouseup', self.handleMouseUpFn_);
	        container.removeEventListener('mouseMove', self.handleMouseMoveFn_);
	        container.removeEventListener('keydown', self.handleKeyDownFn_);
	        container.removeEventListener('wheel', self.handleWheelFn_);
	        container.removeEventListener('wheel', self.handleDebounceMouseWheelFn_);
	
	        self.onScrollOver_.removeHandler(self.handleDebounceScrollOverFn_);
	
	        window.removeEventListener('resize', self.handleWindowResizeFn_);
	        unRegisterScrollEvent_.call(self);
	        unRegisterTouchEvent.call(self);
	
	        self.data.collectionChanged.removeHandler(self.handleCollectionChangedFn_);
	    }
	
	    function unRegisterScrollEvent_() {
	        var self = this;
	        var element;
	        _.each(self.scrollableElements_, function(item) {
	            element = document.getElementById(item);
	            if (element) {
	                element.removeEventListener('scroll', self.handleScrollFn_);
	            }
	
	        });
	        self.scrollableElements_.length = 0;
	    }
	
	    function buildDomTree_() {
	        var self = this;
	        var renderedRows;
	        var layoutInfo = self.getLayoutInfo();
	        var html = '<div role="grid" id="' + self.uid + '"class="' + (self.options.className ? self.options.className : 'gc-grid') + '"><div class="gc-grid-container">';
	        var renderInfo;
	        var rows;
	        var innerDivStyle;
	        self.scrollableElements_.length = 0;
	        _.keys(layoutInfo).map(function(area) {
	            if (self.showScrollPanel(area)) {
	                renderInfo = self.getScrollPanelRenderInfo(area);
	                if (renderInfo) {
	                    var id = self.uid + '-' + area + '-scroll';
	                    self.scrollableElements_.push(id);
	                    html += '<div id="' + id + '" class="' + renderInfo.outerDivCssClass + '"';
	                    if (renderInfo.outerDivCssClass) {
	                        html += ' style="' + gcUtils.createMarkupForStyles(renderInfo.outerDivStyle) + '"';
	                    }
	                    html += '><div';
	                    if (renderInfo.innerDivStyle) {
	                        html += ' style="' + gcUtils.createMarkupForStyles(renderInfo.innerDivStyle) + '"';
	                    }
	                    html += '></div></div>';
	                }
	            } else {
	                //when the area does not show scroll panel,in order to show all content of area,
	                //should reset scrolloffset.
	                if (self.isScrollableArea_ && self.isScrollableArea_(area)) {
	                    if (self.layoutEngine.getInitialScrollOffset) {
	                        self.scrollOffset = self.layoutEngine.getInitialScrollOffset();
	                    } else {
	                        self.scrollOffset.top = 0;
	                        self.scrollOffset.left = 0;
	                    }
	                }
	            }
	            renderInfo = self.getRenderInfo({
	                area: area,
	                offsetTop: self.scrollOffset.top,
	                offsetLeft: self.scrollOffset.left
	            });
	            renderedRows = self.lastRenderedRows_[area] = (self.lastRenderedRows_[area] || []);
	            if (renderInfo) {
	                html += '<div id="' + self.uid + '-' + area + '"';
	                if (renderInfo.outerDivStyle) {
	                    html += ' style="' + gcUtils.createMarkupForStyles(renderInfo.outerDivStyle) + '"';
	                }
	                if (renderInfo.outerDivCssClass) {
	                    html += ' class="' + renderInfo.outerDivCssClass + '"';
	                }
	                html += '><div id="' + self.uid + '-' + area + '-inner"';
	                if (renderInfo.innerDivStyle) {
	                    innerDivStyle = gcUtils.createMarkupForStyles(renderInfo.innerDivStyle);
	                }
	
	                if (renderInfo.innerDivTranslate) {
	                    innerDivStyle += getTransformProName() + ':' + getTransformProValue(renderInfo.innerDivTranslate.left, renderInfo.innerDivTranslate.top);
	                }
	
	                if (innerDivStyle) {
	                    html += ' style="' + innerDivStyle + '"';
	                }
	
	                if (renderInfo.innerDivCssClass) {
	                    html += ' class="' + renderInfo.innerDivCssClass + '"';
	                }
	                html += '>';
	                rows = renderInfo.renderedRows || [];
	                _.each(rows, function(row) {
	                    renderedRows.push(row.key);
	                    html += self.renderRow_(row);
	                });
	
	                html += '</div></div>';
	            }
	
	        });
	        html += '</div></div>';
	
	        self.container.innerHTML = html;
	
	        startAsyncRender_.call(self);
	    }
	
	    function startAsyncRender_(scrollDirection) {
	        var self = this;
	        var columns = self.columns;
	        var columnDef;
	        var i;
	        var length;
	        var needAsynRender = false;
	        for (i = 0, length = columns.length; i < length; i++) {
	            columnDef = columns[i];
	            if (columnDef.asyncRender || hasSparkline(columnDef)) {
	                needAsynRender = true;
	                break;
	            }
	        }
	        if (!needAsynRender) {
	            return;
	        }
	        self.asynRows_ = {};
	        var renderedRows = self.lastRenderedRows_;
	        _.each([VIEWPORT, PINNED_VIEWPORT, PINNED_RIGHT_VIEWPORT], function(area) {
	            if (renderedRows[area]) {
	                self.asynRows_[area] = getGlobalIndexByID_.call(self, renderedRows[area], area);
	            }
	            //according to scroll direction to changed rendering sequence
	            if (scrollDirection === 'down' && self.asynRows_[area]) {
	                self.asynRows_[area] = self.asynRows_[area].reverse();
	            }
	        });
	
	        self.asynIndex_ = 0;
	        self.asynRenderTimer_ = setTimeout(asyncRenderRows_.bind(this), 30);
	    }
	
	    function asyncRenderRows_() {
	        var self = this;
	        var i;
	        var length;
	        var rowIndex;
	        var rowElement;
	        var container;
	        var columnDef;
	        var columns = self.columns;
	        var rows = self.asynRows_;
	        var isRunning = false;
	        var rowData = null;
	        var rowArr;
	        var rowInfo;
	        var sparklineObj;
	        var calcSource = self.data.calcSource;
	        var formula;
	        _.each([VIEWPORT, PINNED_VIEWPORT, PINNED_RIGHT_VIEWPORT], function(area) {
	            rowArr = rows[area];
	            if (rowArr && self.asynIndex_ < rowArr.length) {
	                isRunning = true;
	                rowInfo = rowArr[self.asynIndex_];
	                rowElement = getRowElement_.call(self, rowInfo, area);
	                if (rowElement) {
	                    if (rowInfo.groupArea && rowInfo.groupArea === GROUP_CONTENT) {
	                        rowIndex = self.getGroupInfo_(rowInfo.path).data.toSourceRow(rowInfo.row);
	                    } else {
	                        rowIndex = rowInfo.row;
	                    }
	                    if (!gcUtils.isUndefined(rowIndex)) {
	                        rowData = self.getDataItem(rowIndex);
	                    }
	                    for (i = 0, length = columns.length; i < length; i++) {
	                        sparklineObj = null;
	                        container = null;
	                        columnDef = columns[i];
	                        if (rowInfo.groupArea === GROUP_HEADER || rowInfo.groupArea === GROUP_FOOTER) {
	                            container = rowElement.querySelector('.gc-group-sparkline');
	                            formula = container && container.getAttribute('data-formula');
	                            if (formula) {
	                                sparklineObj = calcSource.getEvaluator().evaluateFormula(container.getAttribute('data-formula'), calcSource.getParserContext(), calcSource.getEvaluatorContext(-1, rowInfo.path));
	                                container.removeAttribute('data-formula');
	                            }
	                        } else {
	                            container = rowElement.querySelector('[data-column=' + columnDef.id + '] .gc-cell');
	                            sparklineObj = rowData[columnDef.id];
	                        }
	                        if (sparklineObj instanceof GcGrid.Plugins.Sparkline.BaseSparkline && container) {
	                            sparklineObj.paint(container);
	                        }
	                        if (columnDef.asyncRender && container) {
	                            columnDef.asyncRender(rowData, container);
	                        }
	                    }
	                }
	            }
	        });
	        if (isRunning) {
	            self.asynIndex_++;
	            self.asynRenderTimer_ = setTimeout(asyncRenderRows_.bind(this), 30);
	        }
	    }
	
	    function hasSparkline(column) {
	        var sparklineNames = [
	            'PIESPARKLINE',
	            'LINESPARKLINE',
	            'COLUMNSPARKLINE',
	            'WINLOSSSPARKLINE'
	        ];
	        var name;
	        for (var i = 0, length = sparklineNames.length; i < length; i++) {
	            name = '=' + sparklineNames[i];
	            if (column.isCalcColumn_) {
	                if (column.dataField.indexOf(name) !== -1) {
	                    return true;
	                }
	            } else if (column.groupHeader) {
	                if (column.groupHeader.indexOf(name) !== -1) {
	                    return true;
	                }
	            } else if (column.groupFooter) {
	                if (column.groupFooter.indexOf(name) !== -1) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	
	    function getGlobalIndexByID_(rowKeys, area) {
	        var self = this;
	        if (!rowKeys || !rowKeys.length) {
	            return;
	        }
	
	        var uid = self.uid;
	        var prefix = uid + '-' + (area === PINNED_VIEWPORT ? 'p' : (area === PINNED_RIGHT_VIEWPORT ? 'pr' : ''));
	        var hasGroup = self.data.groups && self.data.groups.length > 0;
	        var key;
	        var result = [];
	        var i;
	        var length;
	        var path;
	        var rowIndex;
	
	        if (hasGroup) {
	            var headerPrefix = prefix + 'gh';
	            var footerPrefix = prefix + 'gf';
	            var contentPrefix = prefix + 'gr';
	            var groupArea;
	            for (i = 0, length = rowKeys.length; i < length; i++) {
	                key = rowKeys[i];
	                if (key.indexOf(contentPrefix) !== -1) {
	                    path = key.substr(contentPrefix.length, key.indexOf('-r') - contentPrefix.length);
	                    rowIndex = +key.substr(key.indexOf('-r') + 2);
	                    groupArea = GROUP_CONTENT;
	                } else if (key.indexOf(headerPrefix) !== -1) {
	                    path = key.substr(headerPrefix.length);
	                    groupArea = GROUP_HEADER;
	                } else if (key.indexOf(footerPrefix) !== -1) {
	                    path = key.substr(footerPrefix.length);
	                    groupArea = GROUP_FOOTER;
	                }
	                result.push({
	                    row: rowIndex,
	                    path: path.split('_'),
	                    groupArea: groupArea
	                });
	            }
	        } else {
	            prefix = prefix + 'r';
	            for (i = 0, length = rowKeys.length; i < length; i++) {
	                key = rowKeys[i];
	                rowIndex = +key.substr(prefix.length);
	                result.push({
	                    row: rowIndex
	                });
	            }
	        }
	        return result;
	    }
	
	    function getRowElement_(rowInfo, area) {
	        var uid = this.uid;
	        var selector;
	        var prefix = area === PINNED_VIEWPORT ? 'p' : (area === PINNED_RIGHT_VIEWPORT ? 'pr' : '');
	        if (rowInfo.groupArea) {
	            if (rowInfo.groupArea === GROUP_CONTENT && rowInfo.row >= 0) {
	                selector = uid + '-' + prefix + 'gr' + rowInfo.path.join('_') + '-r' + rowInfo.row;
	            } else if (rowInfo.groupArea === GROUP_FOOTER) {
	                selector = uid + '-' + prefix + 'gf' + rowInfo.path.join('_');
	            } else if (rowInfo.groupArea === GROUP_HEADER) {
	                selector = uid + '-' + prefix + 'gh' + rowInfo.path.join('_');
	            }
	        } else {
	            if (rowInfo.row >= 0) {
	                selector = uid + '-' + prefix + 'r' + rowInfo.row;
	            }
	        }
	        return selector ? document.getElementById(selector) : null;
	    }
	
	    function registerScrollEvent_() {
	        var self = this;
	        _.each(self.scrollableElements_, function(item) {
	            document.getElementById(item).addEventListener('scroll', self.handleScrollFn_);
	        });
	    }
	
	    function registerTouchEvent_() {
	        var self = this;
	        var container = self.container;
	
	        TouchWrapper(container).on('touchstart', self.handleTouchStartFn_);
	        TouchWrapper(container).on('touchmove', self.handleTouchMoveFn_);
	        TouchWrapper(container).on('touchend', self.handleTouchEndFn_);
	        container.addEventListener('inertiamove', _.throttle(self.handleInertiaMoveFn_, inertialMovetimeSpan));
	    }
	
	    function unRegisterTouchEvent() {
	        var self = this;
	        var container = self.container;
	
	        TouchWrapper(container).off('touchstart', self.handleTouchStartFn_);
	        TouchWrapper(container).off('touchmove', self.handleTouchMoveFn_);
	        TouchWrapper(container).off('touchend', self.handleTouchEndFn_);
	        container.removeEventListener('inertiamove', self.handleInertiaMoveFn_);
	    }
	
	    function handleTouchStart_(e) {
	        var self = this;
	        resetStatus.call(self);
	        touchStatus.touchEventInfo = [{
	            timeStap: (new Date().getTime()),
	            x: e.targetTouches[0].pageX,
	            y: e.targetTouches[0].pageY
	        }];
	
	        if (e.cancelable) {
	            e.preventDefault();
	        }
	
	        touchStatus.touchStartHitInfo = self.layoutEngine.hitTest({
	            pageX: e.targetTouches[0].pageX,
	            pageY: e.targetTouches[0].pageY
	        });
	        trigger_(self.onTouchStart_, self, e);
	    }
	
	    function handleTouchMove_(e) {
	        var self = this;
	        if (e.cancelable) {
	            e.preventDefault();
	        }
	
	        trigger_(self.onTouchMove_, self, e);
	        if (e.handled) {
	            return;
	        }
	
	        if (filterMessage(e)) {
	            return;
	        }
	
	        detectTouchAction.call(self, e);
	
	        if (touchStatus.touchAction === 'pinch') {
	            return;
	        } else if (touchStatus.touchAction === 'scroll' || touchStatus.touchAction === 'swipestart' || touchStatus.touchAction === 'swipemoving') {
	            if (shouldProcessMove_()) {
	                var deltaX = touchStatus.touchEventInfo[0].x - e.targetTouches[0].pageX;
	                var deltaY = touchStatus.touchEventInfo[0].y - e.targetTouches[0].pageY;
	                var delta = touchStatus.moveDirection === 'horizontal' ? deltaX : deltaY;
	
	                if (touchStatus.touchAction === 'scroll') {
	                    if (!canScroll()) {
	                        return;
	                    }
	
	                    touchStatus.stopInertiaMove = true;
	                    trigger_(self.onTouchScroll_, self, e);
	                    if (e.handled) {
	                        return;
	                    } else {
	                        scrollGrid.call(self, e, touchStatus.startOffset.left, touchStatus.startOffset.top, delta);
	                    }
	                } else if (touchStatus.touchAction === 'swipestart' || touchStatus.touchAction === 'swipemoving') {
	                    if (!canSwipe()) {
	                        return;
	                    }
	
	                    raiseSwipeEvent_.call(self, e);
	                }
	
	                touchStatus.touchEventInfo.push(
	                    {
	                        timeStap: (new Date()).getTime(),
	                        x: e.targetTouches[0].pageX,
	                        y: e.targetTouches[0].pageY
	                    }
	                );
	            }
	        }
	    }
	
	    function handleTouchEnd_(e) {
	        var self = this;
	        if (e.cancelable) {
	            e.preventDefault();
	        }
	
	        trigger_(self.onTouchEnd_, self, e);
	        //if (e.handled) {
	        //    return;
	        //}
	
	        detectTouchAction.call(self, e, true);
	        if (touchStatus.touchAction === 'pinch') {
	            return;
	        } else if (touchStatus.touchAction === 'tap') {
	            if (TouchWrapper().shouldRaiseTapEvent()) {
	                trigger_(self.onTap_, self, {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY});
	            } else {
	                self.tapPoint_ = e.changedTouches[0];
	            }
	        } else if (touchStatus.touchAction === 'swipeend') {
	            if (!canSwipe()) {
	                return;
	            }
	            raiseSwipeEvent_.call(self, e);
	        } else if (touchStatus.touchAction === 'scroll') {
	            if (!canScroll()) {
	                return;
	            }
	
	            touchStatus.stopInertiaMove = false;
	            inertialMoveStatus = {};
	            inertialMoveStatus.v = getInertialStartVelocity(touchStatus.moveDirection === 'horizontal' ? e.changedTouches[0].pageX : e.changedTouches[0].pageY);
	            inertialMoveStatus.deceleration = (inertialMoveStatus.v < 0 ? 1 : -1) * 0.0006;
	            inertialMoveStatus.v = Math.abs(inertialMoveStatus.v) > 2.0 ? (inertialMoveStatus.v < 0 ? -2.0 : 2.0) : inertialMoveStatus.v;
	            inertialMoveStatus.element = this.container;
	            inertialMoveStatus.moveInterval = setInterval(raiseInertiaMove, inertialMovetimeSpan);
	            inertialMoveStatus.topleftDelta = 0;
	            inertialMoveStatus.rightbottomDelta = 0;
	        }
	    }
	
	    function handleInertiaMove_(e) {
	        var self = this;
	        var rowHeight = self.options.rowHeight;
	        var nowV = inertialMoveStatus.v + inertialMovetimeSpan * inertialMoveStatus.deceleration;
	        var visZero = inertialMoveStatus.deceleration * nowV > 0;
	        var isHorizontal = touchStatus.moveDirection === 'horizontal';
	        var layoutInfo = self.layoutEngine.getLayoutInfo();
	        var viewPortInfo = layoutInfo.viewport;
	        if (!viewPortInfo) {
	            if (inertialMoveStatus.moveInterval) {
	                clearInterval(inertialMoveStatus.moveInterval);
	            }
	            return;
	        }
	
	        var leftTop = isHorizontal ? self.scrollOffset.left : self.scrollOffset.top;
	        var length = isHorizontal ? viewPortInfo.width : viewPortInfo.height;
	        var rightBottom = isHorizontal ? self.scrollOffset.left + length : self.scrollOffset.top + length;
	        var maxLeftTop = -MAXFEEDBACKOFFSET;
	        var contentlength = isHorizontal ? viewPortInfo.contentWidth : viewPortInfo.contentHeight;
	        var maxRightBottom = contentlength + MAXFEEDBACKOFFSET;
	        var scrollable = contentlength > length;
	        var baseleft = self.scrollOffset.left;
	        var basetop = self.scrollOffset.top;
	
	        if (visZero) {
	            touchStatus.stopInertiaMove = true;
	        } else if (!visZero && (leftTop < maxLeftTop || rightBottom > maxRightBottom)) {
	            touchStatus.stopInertiaMove = true;
	        }
	
	        if (touchStatus.stopInertiaMove) {
	            if (leftTop < 0 || !scrollable) {
	                baseleft = isHorizontal ? 0 : self.scrollOffset.left;
	                basetop = isHorizontal ? self.scrollOffset.top : 0;
	            } else if (rightBottom > contentlength) {
	                baseleft = isHorizontal ? contentlength - viewPortInfo.width : self.scrollOffset.left;
	                basetop = isHorizontal ? self.scrollOffset.top : contentlength - viewPortInfo.height;
	            }
	            scrollGrid.call(self, e, baseleft, basetop, 0);
	            clearInterval(inertialMoveStatus.moveInterval);
	            return;
	        }
	
	        var delta = (nowV + inertialMoveStatus.v) / 2 * inertialMovetimeSpan;
	        var direction = delta < 0 ? -1 : 1;
	        delta = Math.abs(Math.floor(delta));
	        var minValue = (rowHeight / 3) * 2;
	        var maxValue = (rowHeight / 3) * 4;
	
	        if (delta > minValue && delta < maxValue) {
	            delta = minValue * direction;
	            inertialMoveStatus.v = delta / inertialMovetimeSpan;
	        } else {
	            delta = delta * direction;
	            inertialMoveStatus.v = nowV;
	        }
	
	        if (leftTop < 0) {
	            inertialMoveStatus.topleftDelta += delta;
	            baseleft = isHorizontal ? 0 : self.scrollOffset.left;
	            basetop = isHorizontal ? self.scrollOffset.top : 0;
	            scrollGrid.call(self, e, baseleft, basetop, inertialMoveStatus.topleftDelta);
	        } else if (rightBottom > contentlength && scrollable) {
	            inertialMoveStatus.rightbottomDelta += delta;
	            baseleft = isHorizontal ? contentlength - viewPortInfo.width : self.scrollOffset.left;
	            basetop = isHorizontal ? self.scrollOffset.top : contentlength - viewPortInfo.height;
	            scrollGrid.call(self, e, baseleft, basetop, inertialMoveStatus.rightbottomDelta);
	        } else {
	            scrollGrid.call(self, e, self.scrollOffset.left, self.scrollOffset.top, delta);
	        }
	    }
	
	    function raiseSwipeEvent_(e) {
	        var self = this;
	        var isHorizontal = touchStatus.moveDirection === 'horizontal';
	        var isSwipeEnd = touchStatus.touchAction === 'swipeend';
	        var nowLocation = isHorizontal ? (isSwipeEnd ? e.changedTouches[0].pageX : e.targetTouches[0].pageX) : (isSwipeEnd ? e.changedTouches[0].pageY : e.targetTouches[0].pageY);
	        e.swipeStatus = touchStatus.touchAction;
	        e.moveDistance = isHorizontal ? (touchStatus.touchEventInfo[0].x - nowLocation) : (touchStatus.touchEventInfo[0].y - nowLocation);
	        e.velocity = getInertialStartVelocity(nowLocation);
	        trigger_(self.onSwipe_, self, e);
	    }
	
	    function canScroll() {
	        var hitInfo = touchStatus.touchStartHitInfo;
	        var inPinnedViewPort = hitInfo && hitInfo.area && hitInfo.area.indexOf('pinned') > -1;
	        if (inPinnedViewPort && touchStatus.moveDirection === 'horizontal') {
	            return false;
	        }
	
	        return true;
	    }
	
	    function canSwipe() {
	        var hitInfo = touchStatus.touchStartHitInfo;
	        var inPinnedViewPort = hitInfo && hitInfo.area && hitInfo.area.indexOf('pinned') > -1;
	        if (inPinnedViewPort) {
	            return false;
	        }
	
	        if (hitInfo && hitInfo.area === 'viewport' && hitInfo.row === -1 && hitInfo.column === -1) {
	            if (hitInfo.groupInfo && (hitInfo.groupInfo.area === 'groupHeader' || hitInfo.groupInfo.area === 'groupFooter')) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    function shouldProcessMove_() {
	        var previousEventInfo = touchStatus.touchEventInfo[touchStatus.touchEventInfo.length - 1];
	        var processMove = ((new Date().getTime()) - previousEventInfo.timeStap) > 1000 / 80 || touchStatus.touchEventInfo.length === 1;
	
	        return processMove;
	    }
	
	    function raiseInertiaMove() {
	        if (!touchStatus.stopInertiaMove) {
	            var evt = new CustomEvent('inertiamove', {bubbles: true, cancelable: true});
	            inertialMoveStatus.element.dispatchEvent(evt);
	        }
	    }
	
	    function resetStatus() {
	        var self = this;
	        touchStatus = {};
	        touchStatus.stopInertiaMove = true;
	        touchStatus.startOffset = self.scrollOffset;
	        touchStatus.stopFeedBack = true;
	
	        if (inertialMoveStatus) {
	            clearInterval(inertialMoveStatus.moveInterval);
	        }
	        self.tapPoint_ = null;
	    }
	
	    function detectTouchAction(e, touchEnd) {
	        var touchStartEvent = touchStatus.touchEventInfo;
	        var self = this;
	        if (touchStartEvent) {
	            if (touchEnd) {
	                if (touchStartEvent[0].x === e.changedTouches[0].pageX && touchStartEvent[0].y === e.changedTouches[0].pageY) {
	                    touchStatus.touchAction = 'tap';
	                } else if (touchStatus.touchAction === 'swipemoving') {
	                    touchStatus.touchAction = 'swipeend';
	                }
	            } else {
	                if (e.touches.length > 1) {
	                    touchStatus.touchAction = 'pinch';
	                } else if (touchStatus.touchAction === 'swipestart' || touchStatus.touchAction === 'swipemoving') {
	                    touchStatus.touchAction = 'swipemoving';
	                } else if (touchStatus.touchAction === 'scroll') {
	                    touchStatus.touchAction = 'scroll';
	                } else {
	                    if (!updateMoveDirection(e)) {
	                        return;
	                    }
	
	                    var deltaX = touchStatus.touchEventInfo[0].x - e.targetTouches[0].pageX;
	                    var deltaY = touchStatus.touchEventInfo[0].y - e.targetTouches[0].pageY;
	
	                    if (self.options.allowSwipe && self.layoutEngine.canDoSwipe_(touchStatus.moveDirection)) {
	                        if (self.layoutEngine.canStartSwipe_(deltaX, deltaY)) {
	                            touchStatus.touchAction = 'swipestart';
	                        }
	                    } else {
	                        touchStatus.touchAction = 'scroll';
	                    }
	                }
	            }
	        }
	    }
	
	    function filterMessage(e) {
	        var touchStartEvent = touchStatus.touchEventInfo;
	        if (touchStartEvent) {
	            if (touchStartEvent[0].x === e.targetTouches[0].pageX && touchStartEvent[0].y === e.targetTouches[0].pageY) {
	                return true;
	            }
	        }
	    }
	
	    function getInertialStartVelocity(nowLocation) {
	        var index = touchStatus.touchEventInfo.length - 1;
	        var lastEvent = touchStatus.touchEventInfo[index];
	        var location = touchStatus.moveDirection === 'horizontal' ? lastEvent.x : lastEvent.y;
	        var nowTime = (new Date()).getTime();
	
	        while (location === nowLocation) {
	            index--;
	            if (index >= 0) {
	                lastEvent = touchStatus.touchEventInfo[index];
	                location = touchStatus.moveDirection === 'horizontal' ? lastEvent.x : lastEvent.y;
	            } else {
	                break;
	            }
	        }
	        return (location - nowLocation) / (nowTime - lastEvent.timeStap);
	    }
	
	    function updateMoveDirection(e) {
	        if (!touchStatus.moveDirection) {
	            var x = e.targetTouches[0].pageX;
	            var y = e.targetTouches[0].pageY;
	            var index = touchStatus.touchEventInfo.length - 1;
	
	            var lastEventInfo = touchStatus.touchEventInfo[index];
	            var moveX = x - lastEventInfo.x;
	            var moveY = y - lastEventInfo.y;
	
	            if (moveX === moveY) {
	                return false;
	            }
	
	            touchStatus.moveDirection = Math.abs(moveY) > Math.abs(moveX) ? 'vertical' : 'horizontal';
	            return true;
	        }
	
	        return true;
	    }
	
	    function scrollGrid(e, left, top, delta) {
	        if (touchStatus.moveDirection === 'horizontal') {
	            scrollGridHorizontal.call(this, e, left, top, delta);
	        } else {
	            scrollGridVertical.call(this, e, left, top, delta);
	        }
	    }
	
	    function scrollGridHorizontal(e, left, top, delta) {
	        var self = this;
	        var layoutInfo = self.layoutEngine.getLayoutInfo();
	        var viewPortInfo = layoutInfo.viewport;
	        if (!viewPortInfo) {
	            return;
	        }
	
	        var length = viewPortInfo.width;
	        var contentLength = viewPortInfo.contentWidth;
	        var scrollable = contentLength > length;
	        left += delta;
	
	        if (left < 0) {
	            left = GetBoundaryValeu(left);
	        } else if (left + length > contentLength && scrollable) {
	            left = contentLength - length + GetBoundaryValeu(left + length - contentLength);
	        }
	
	        self.scrollOffset = {
	            top: top,
	            left: left
	        };
	        if (delta) {
	            self.scollDirection = delta > 0 ? 'left' : 'right';
	        }
	        e.scrollDirection = self.scollDirection;
	        self.layoutEngine.handleScroll(e);
	    }
	
	    function scrollGridVertical(e, left, top, delta) {
	        var self = this;
	        var layoutInfo = self.layoutEngine.getLayoutInfo();
	        var viewPortInfo = layoutInfo.viewport;
	        if (!viewPortInfo) {
	            return;
	        }
	        var length = viewPortInfo.height;
	        var contentHeight = viewPortInfo.contentHeight;
	        var scrollable = contentHeight > length;
	        top += delta;
	
	        if (top < 0) {
	            top = GetBoundaryValeu(top);
	        } else if (top + length > contentHeight && scrollable) {
	            top = contentHeight - length + GetBoundaryValeu(top + length - contentHeight);
	        }
	
	        self.scrollOffset = {
	            top: top,
	            left: left
	        };
	        if (delta) {
	            self.scollDirection = delta > 0 ? 'up' : 'down';
	        }
	        e.scrollDirection = self.scollDirection;
	        self.layoutEngine.handleScroll(e);
	    }
	
	    function GetBoundaryValeu(value) {
	        var _translateOffsetY = value;
	        return GetBoundaryFactor(Math.abs(_translateOffsetY), MAXSCROLLABLEVERTICALOFFSET) * (_translateOffsetY > 0 ? 1 : -1);
	    }
	
	    function GetBoundaryFactor(input, boundary) {
	        return -boundary / (input / boundary + 1.0) + boundary;
	    }
	
	    function handleClick(e) {
	        var grid = this;
	        var tapPoint = grid.tapPoint_;
	        if (tapPoint) {
	            if (tapPoint.pageX === e.pageX && tapPoint.pageY === e.pageY && tapPoint.target === e.target) {
	                trigger_(this.onTap_, grid, {pageX: tapPoint.pageX, pageY: tapPoint.pageY});
	            } else {
	                trigger_(this.onMouseClick, this, e);
	            }
	            grid.tapPoint_ = null;
	        } else {
	            trigger_(this.onMouseClick, this, e);
	        }
	    }
	
	    function handleDoubleClick(e) {
	        trigger_(this.onMouseDbClick, this, e);
	    }
	
	    function handleMouseUp(e) {
	        var self = this;
	        self.scrolling_ = false;
	        trigger_(self.onMouseUp, self, e);
	    }
	
	    function handleMouseDown(e) {
	        trigger_(this.onMouseDown, this, e);
	    }
	
	    function handleMouseWheel(e) {
	        changeScrollPanelZindex.call(this);
	        trigger_(this.onMouseWheel, this, e);
	    }
	
	    function handleMouseMove(e) {
	        var self = this;
	        if (!self.scrolling_) {
	            trigger_(self.onMouseMove, self, e);
	        }
	    }
	
	    function handleKeyDown(e) {
	        trigger_(this.onKeyDown, this, e);
	    }
	
	    function handleWindowResize_() {
	        this.invalidate();
	    }
	
	    function handleScroll_(e) {
	        var self = this;
	        var target = e.target;
	        var scrollDirection;
	        if (!self.layoutEngine.isResizingCol_) {
	            self.scrolling_ = true;
	            e.preventDefault();
	            if (!gcUtils.isUndefined(self.asynRenderTimer_)) {
	                clearTimeout(self.asynRenderTimer_);
	            }
	            if (window && window.requestAnimationFrame) {
	                window.requestAnimationFrame(function() {
	                    scrollDirection = self.scrollOffset.top > target.scrollTop ? 'down' : 'up';
	                    e.scrollDirection = scrollDirection;
	
	                    var className = target.className;
	                    if (className.indexOf('scroll-top') >= 0) {
	                        self.scrollOffset.top = target.scrollTop;
	                    }
	                    if (className.indexOf('scroll-left') >= 0) {
	                        self.scrollOffset.left = target.scrollLeft;
	                    }
	
	                    self.layoutEngine.handleScroll(e);
	                });
	            }
	        }
	    }
	
	    function handleCollectionChanged_() {
	        this.invalidate();
	    }
	
	    function handleScollOver_(sender, args) {
	        startAsyncRender_.call(this, args.scrollDirection);
	    }
	
	    //finds the minimum step to update originalCollection to targetCollection
	    function findMinimumOperations_(originalCollection, targetCollection) {
	        var n1 = originalCollection.length;
	        var n2 = targetCollection.length;
	        var operation = [];
	        var i;
	        var j;
	        var mindis = [];
	
	        if (n1 === 0) {
	            for (i = 0; i < n2; i++) {
	                operation.push({
	                    operation: 'insert',
	                    index: i,
	                    item: targetCollection[i]
	                });
	            }
	            return operation;
	        }
	        if (n2 === 0) {
	            for (i = 0; i < n1; i++) {
	                operation.push({
	                    operation: 'delete',
	                    index: n1 - i - 1
	                });
	            }
	
	            return operation;
	        }
	
	        for (i = 0; i <= n1; i++) {
	            mindis[i] = [];
	        }
	
	        for (i = 0; i <= n1; i++) {
	            mindis[i][0] = i;
	        }
	
	        for (i = 0; i <= n2; i++) {
	            mindis[0][i] = i;
	        }
	
	        for (i = 1; i <= n1; i++) {
	            for (j = 1; j <= n2; j++) {
	                if (originalCollection[i - 1] === targetCollection[j - 1]) {
	                    mindis[i][j] = mindis[i - 1][j - 1];
	                } else {
	                    mindis[i][j] = Math.min(mindis[i - 1][j] + 1, mindis[i][j - 1] + 1, mindis[i - 1][j - 1] + 1);
	                }
	            }
	        }
	
	        i = n1;
	        j = n2;
	        while (i >= 1 || j >= 1) {
	            if (i >= 1 && j >= 1 && (originalCollection[i - 1] === targetCollection[j - 1])) {
	                i = i - 1;
	                j = j - 1;
	                operation.push({
	                    operation: 'update',
	                    index: i
	                });
	            } else if (i >= 1 && (mindis[i][j] === mindis[i - 1][j] + 1)) {
	                operation.push({
	                    operation: 'delete',
	                    index: i - 1
	                });
	                i = i - 1;
	            } else if (j >= 1 && (mindis[i][j] === mindis[i][j - 1] + 1)) {
	                operation.push({
	                    operation: 'insert',
	                    index: i,
	                    item: targetCollection[j - 1]
	                });
	                j = j - 1;
	            } else if (i >= 1 && j >= 1) {
	                operation.push({
	                    operation: 'replace',
	                    index: [i - 1, j - 1]
	                });
	                i = i - 1;
	                j = j - 1;
	            }
	        }
	        return operation;
	    }
	
	    function findScrollMinimumOperations(originalCollection, targetCollection) {
	        //var s1 = _.difference(originalCollection, targetCollection);
	        //var s2 = _.difference(targetCollection, originalCollection);
	        //var i;
	        //var len = Math.min(s1.length, s2.length);
	        //var operation = [];
	        //for (i = 0; i < len; i++) {
	        //    operation.push({
	        //        operation: 'replace',
	        //        index: [s1[i], s2[i]]
	        //    });
	        //}
	        //
	        //for (; i < s1.length; i++) {
	        //    operation.push({
	        //        operation: 'delete',
	        //        index: s1[i]
	        //    });
	        //}
	        //
	        //i = len;
	        //
	        //for (; i < s2.length; i++) {
	        //    operation.push({
	        //        operation: 'insert',
	        //        index: s2[i]
	        //    });
	        //}
	        //return operation;
	        var s1 = originalCollection;
	        var s2 = targetCollection;
	        var n1 = s1.length;
	        var n2 = s2.length;
	        var i = 0;
	        var j = 0;
	        var operation = [];
	        var position = s2.indexOf(s1[0]);
	        if (position === -1) {
	            position = s1.indexOf(s2[0]);
	            for (; i < position; i++) {
	                operation.push({
	                    operation: 'delete',
	                    index: s1[i]
	                });
	            }
	        } else {
	            for (; j < position; j++) {
	                operation.push({
	                    operation: 'insert',
	                    index: s2[j]
	                });
	            }
	        }
	
	        while (i < n1 && j < n2) {
	            if (s1[i] !== s2[j]) {
	                break;
	            }
	            i++;
	            j++;
	        }
	
	        for (; i < n1; i++) {
	            operation.push({
	                operation: 'delete',
	                index: s1[i]
	            });
	        }
	
	        for (; j < n2; j++) {
	            operation.push({
	                operation: 'insert',
	                index: s2[j]
	            });
	        }
	
	        return operation;
	    }
	
	    function createGroupStrategy_(self) {
	        var grid = self.grid;
	        var groupStrategyObj = self.options.groupStrategy;
	        if (grid.data.groups && groupStrategyObj) {
	            var strategy = groupStrategyObj.name;
	            var groupInfos = grid.data.groupDescriptors;
	            if (strategy.toLowerCase() === 'calendarstrategy' &&
	                (groupInfos.length !== 1 || grid.getColById_(groupInfos[0].field).dataType !== 'date')) {
	                /*jshint ignore:start */
	                console && console.error && console.error('calendar strategy can only be used in the case that there is only one level group and the data type of the grouping column is [object Date]');
	                /*jshint ignore:end */
	            } else {
	                self.groupStrategy_ = groupStrategyObj;
	            }
	        }
	        if (self.groupStrategy_) {
	            self.groupStrategy_.init(grid);
	        } else {
	            self.registeEvents_();
	        }
	    }
	
	    function updateGroupStrategy_() {
	        var self = this;
	        var layoutEngine = self.layoutEngine;
	        var groupStrategyObj = self.options.groupStrategy;
	        if (layoutEngine.groupStrategy_) {
	            //remove
	            if (gcUtils.isUndefinedOrNull(groupStrategyObj)) {
	                layoutEngine.groupStrategy_.destroy();
	                delete layoutEngine.groupStrategy_;
	                layoutEngine.registeEvents_();
	            } else {
	                //the same name
	                if (layoutEngine.groupStrategy_.name.toLowerCase() === groupStrategyObj.name.toLowerCase()) {
	                    var newOptons = groupStrategyObj.options;
	                    var oldOptions = layoutEngine.groupStrategy_.options;
	                    if (JSON.stringify(gcUtils.serializeObject(newOptons)) !== JSON.stringify(gcUtils.serializeObject(oldOptions))) {
	                        layoutEngine.groupStrategy_.options = newOptons;
	                        layoutEngine.groupStrategy_.clearRenderCache_();
	                    }
	                } else { //the other new group stratey
	                    layoutEngine.groupStrategy_.destroy();
	                    delete layoutEngine.groupStrategy_;
	                    createGroupStrategy_(layoutEngine);
	                }
	            }
	        } else if (!gcUtils.isUndefinedOrNull(self.options.groupStrategy)) {
	            layoutEngine.unRegisteEvents_();
	            createGroupStrategy_(layoutEngine);
	        } else {
	            layoutEngine.unRegisteEvents_();
	            layoutEngine.registeEvents_();
	        }
	    }
	
	    /**
	     * Gets the control that is hosted in a given DOM element
	     * @param {Element} node The DOM element that is hosting the control.
	     * @returns Control
	     */
	    GcGrid.getControlByElement = function(node) {
	        if (node) {
	            var gridNode = node.querySelector('[role="grid"]');
	            if (gridNode) {
	                var id = gridNode.id;
	                if (id.slice(0, 3) === 'gc-' && id.length > 3 && !isNaN(id.slice(3))) {
	                    return instancesByReactRootID[+(id.slice(3))];
	                }
	
	            }
	        }
	        return null;
	    };
	
	    //<editor-fold desc="Calc Engine">
	    function initCE_() {
	        var self = this;
	        _.forEach(self.columns, function(colObj) {
	            var dataField = colObj.dataField;
	            if (_.startsWith(_.trim(dataField), '=')) {
	                colObj.isCalcColumn_ = true;
	                //calcSource.addCalcColumn(colObj.id, dataField);
	            }
	        });
	
	    }
	
	    //</editor-fold>
	
	    function initBuildInActions_() {
	        var self = this;
	        self.buildInActions_ = {
	            'edit': {
	                name: 'edit',
	                handler: function(e) {
	                    e.closeActionColumnPanel();
	                    self.startEditing();
	                }
	            },
	            'cancel': {
	                name: 'cancel',
	                handler: function(e) {
	                    e.closeActionColumnPanel();
	                    self.cancelEditing();
	                }
	            }
	        };
	    }
	
	    module.exports = {
	        GcGrid: GcGrid,
	        Calc: Calc
	    };
	}());


/***/ },
/* 1 */
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	(function(window) {
	        'use strict';
	
	        var supportEvents = ['touchstart', 'touchmove', 'touchend'];
	
	        var lastHwTimestamp = 0;
	
	        var eventMappings = {
	            touchstart: ['pointerdown', 'MSPointerDown', 'touchstart'],
	            touchmove: ['pointermove', 'MSPointerMove', 'touchmove'],
	            touchend: ['pointerup', 'MSPointerUp', 'touchend']
	        };
	
	        var mappingIndex = window.PointerEvent ? 0 : (window.MSPointerEvent ? 1 : 2);
	
	        var touchesWrapper;
	        var changedTouchesWrapper;
	        var targetTouchesWrapper;
	
	        function TouchWrapper(element) {
	            return new Manager(element);
	        }
	
	        function Manager(element) {
	            this.element = element;
	        }
	
	        Manager.prototype = {
	            on: function(targetEvent, handler) {
	                var element = this.element;
	
	                if (supportEvents.indexOf(targetEvent) === -1) {
	                    element.addEventListener(targetEvent, handler);
	                    return;
	                }
	
	                if (supportTargetEvent(element, targetEvent)) {
	                    element.addEventListener(targetEvent, handler);
	                    return;
	                } else {
	                    var nativeEvent = eventNameGenerate(targetEvent);
	                    if (supportTargetEvent(element, nativeEvent)) {
	                        var nativeHandler = function(evt) {
	                            generateTouchClonedEvent(evt, handler, targetEvent);
	                        };
	
	                        var uid = guid();
	                        handler.uid = uid;
	                        addorRemoveWrapEventListener(element, nativeEvent, nativeHandler, uid, true);
	
	                        disableIEScroll(element);
	                    }
	                }
	            },
	
	            off: function(targetEvent, handler) {
	                var element = this.element;
	
	                if (supportEvents.indexOf(targetEvent) === -1) {
	                    element.removeEventListener(targetEvent, handler);
	                    return;
	                }
	
	                if (supportTargetEvent(element, targetEvent)) {
	                    element.removeEventListener(element, targetEvent);
	                    return;
	                } else {
	                    addorRemoveWrapEventListener(element, targetEvent, handler, false);
	                    enableIEScroll(element);
	                }
	            },
	
	            shouldRaiseTapEvent:function() {
	                return !(window.PointerEvent || window.MSPointerEvent);
	            }
	        };
	
	        function TouchListWrapper() {
	            var touchList = [];
	            var scope = this;
	
	            //refer: http://www.w3.org/TR/touch-events/
	            function Touch(identifier, target, screenX, screenY, clientX, clientY, pageX, pageY) {
	                var self = this;
	                self.identifier = identifier;
	                self.target = target;
	                self.screenX = screenX;
	                self.screenY = screenY;
	                self.clientX = clientX;
	                self.clientY = clientY;
	                self.pageX = pageX;
	                self.pageY = pageY;
	            }
	
	            function getTouch(identifier) {
	                var i;
	                var l;
	                for (i = 0, l = touchList.length; i < l; i += 1) {
	                    if (touchList[i].identifier === identifier) {
	                        return touchList[i];
	                    }
	                }
	            }
	
	            function addUpdateTouch(touch) {
	                var i;
	                var l;
	                for (i = 0, l = touchList.length; i < l; i += 1) {
	                    if (touchList[i].identifier === touch.identifier) {
	                        touchList[i] = touch;
	                        return;
	                    }
	                }
	
	                touchList.push(touch);
	            }
	
	            function removeTouch(identifier) {
	                var i;
	                var l;
	                for (i = 0, l = touchList.length; i < touchList.length; i += 1) {
	                    if (touchList[i].identifier === identifier) {
	                        touchList.splice(i, 1);
	                    }
	                }
	            }
	
	            function clearTouches() {
	                while (touchList.length > 0) {
	                    touchList.pop();
	                }
	            }
	
	            function containsTouchAt(screenX, screenY) {
	                var i;
	
	                for (i = 0; i < touchList.length; i += 1) {
	                    if (touchList[i].screenX === screenX && touchList[i].screenY === screenY) {
	                        return true;
	                    }
	                }
	
	                return false;
	            }
	
	            scope.touchList = touchList;
	
	            scope.Touch = Touch;
	            scope.getTouch = getTouch;
	            scope.addUpdateTouch = addUpdateTouch;
	            scope.removeTouch = removeTouch;
	            scope.clearTouches = clearTouches;
	            scope.containsTouchAt = containsTouchAt;
	        }
	
	        function addorRemoveWrapEventListener(element, event, handler, uid, enable) {
	            if (enable) {
	                element.addEventListener(event, handler, false);
	                if (!window.cachedEvents) {
	                    window.cachedEvents = [];
	                }
	
	                window.cachedEvents.push(
	                    {
	                        element: element,
	                        event: event,
	                        handler: handler,
	                        uid: uid
	                    }
	                );
	            } else {
	                if (!window.cachedEvents) {
	                    return;
	                }
	
	                for (var i = 0, l = window.cachedEvents.length; i < l; i++) {
	                    var cachedEvent = window.cachedEvents[i];
	                    if (cachedEvent.uid === handler.uid) {
	                        cachedEvent.element.removeEventListener(cachedEvent.event, cachedEvent.handler);
	                        break;
	                    }
	                }
	
	                window.cachedEvents.splice(i, 1);
	                if (window.cachedEvents.length === 0) {
	                    delete window.cachedEvents;
	                }
	            }
	        }
	
	        function generateTouchClonedEvent(eventArgs, handler) {
	            var evObj;
	            var oldTouch;
	            var oldTarget;
	
	            function updateTargetTouches(thisTouchTarget, touchesTouchList) {
	                var i;
	                var touch;
	
	                targetTouchesWrapper.clearTouches();
	
	                //targetTouches:a list of Touches for every point of contact that is touching the surface and started on the element that is the target of the current event.
	                for (i = 0; i < touchesTouchList.length; i++) {
	                    touch = touchesTouchList[i];
	                    if (touch.target.isSameNode(thisTouchTarget)) {
	                        targetTouchesWrapper.addUpdateTouch(touch);
	                    }
	                }
	            }
	
	            function touchHandler(event) {
	                var eventType;
	                var touch;
	                var touchEvent;
	
	                if (isPointerDownEvent(event)) {
	                    eventType = 'touchstart';
	                } else {
	                    eventType = 'touchmove';
	                }
	
	                touch = new touchesWrapper.Touch(event.pointerId, (isPointerDownEvent(event) ? event.target : oldTarget),
	                    event.screenX, event.screenY, event.clientX, event.clientY, event.pageX, event.pageY);
	
	                // Remove, from changedTouches, any Touch that is no longer being touched, or is being touched
	                // in exactly the same place.
	                // In order to make sure that simultaneous touches don't kick each other off of the changedTouches array
	                // (because they are processed as different pointer events), skip this if the lastHwTimestamp hasn't increased.
	                if (event.hwTimestamp > lastHwTimestamp) {
	                    (function() {
	                        var i;
	                        var changedTouchList;
	                        var changedTouch;
	                        var matchingTouch;
	                        var identifier;
	                        changedTouchList = changedTouchesWrapper.touchList;
	                        for (i = 0; i < changedTouchList.length; i += 1) {
	                            changedTouch = changedTouchList[i];
	                            identifier = changedTouch.identifier;
	                            matchingTouch = touchesWrapper.getTouch(identifier);
	
	                            if (!matchingTouch || touchesAreAtSameSpot(matchingTouch, changedTouch)) {
	                                changedTouchesWrapper.removeTouch(identifier);
	                            }
	                        }
	                    }());
	                }
	
	                var pointerId = event.pointerId;
	                if (isPointerDownEvent(event)) {
	                    if (event.type === 'MSPointerDown') {
	                        touch.target.msSetPointerCapture(pointerId);
	                    } else {
	                        touch.target.setPointerCapture(pointerId);
	                    }
	
	                    //问题：有些时候，当手指离开当前页面时，element 无法收到pointer up/cancle 事件，
	                    //就没有时机去remove 离开的touch pointer
	                    //方案：目前只有在pointerdown时清空缓存的pointer 信息。
	                    //影响：按照以前设计可以支持多个手指，现在只能支持单个手指，因为IE下的zoom行为已经被浏览器实现，所以
	                    //改动不会导致缺失。后面有时间的话这个点需要再考虑考虑 -Tim 4/28/2015.
	                    touchesWrapper.clearTouches();
	                    log('pointerDown ' + 'timstap:' + event.hwTimestamp + ' pointerId: ' + event.pointerId);
	                } else {
	                    log('pointerMove' + ' timstap:' + event.hwTimestamp + ' pointerId: ' + event.pointerId);
	                }
	                event.stopPropagation();
	                touchesWrapper.addUpdateTouch(touch);
	                changedTouchesWrapper.addUpdateTouch(touch);
	                updateTargetTouches(touch.target, touchesWrapper.touchList);
	
	                touchEvent = new CustomEvent(eventType, {bubbles: true, cancelable: true});
	                touchEvent.touches = touchesWrapper.touchList;
	                touchEvent.changedTouches = changedTouchesWrapper.touchList;
	                touchEvent.targetTouches = targetTouchesWrapper.touchList;
	
	                return touchEvent;
	            }
	
	            function touchChangedHandler(event) {
	                var eventType;
	                var touch;
	                var touchEvent;
	
	                event.changedTouches = [];
	                event.changedTouches.length = 1;
	                event.changedTouches[0] = event;
	                event.changedTouches[0].identifier = event.pointerId;
	
	                touch = new touchesWrapper.Touch(event.pointerId, oldTarget, event.screenX, event.screenY, event.clientX, event.clientY, event.pageX, event.pageY);
	
	                if (isPointerUpEvent(event)) {
	                    eventType = 'touchend';
	                    if (event.type === 'MSPointerUp') {
	                        touch.target.msReleasePointerCapture(event.pointerId);
	                    } else {
	                        touch.target.releasePointerCapture(event.pointerId);
	                    }
	                }
	
	                // This is a new touch event if it happened at a greater time than the last touch event.
	                // If it is a new touch event, clear out the changedTouches TouchList.
	                if (event.hwTimestamp > lastHwTimestamp) {
	                    changedTouchesWrapper.clearTouches();
	                }
	                event.stopPropagation();
	                touchesWrapper.removeTouch(touch.identifier);
	                changedTouchesWrapper.addUpdateTouch(touch);
	                updateTargetTouches(touch.target, touchesWrapper.touchList);
	
	                touchEvent = new CustomEvent(eventType, {bubbles: true, cancelable: true});
	                touchEvent.touches = touchesWrapper.touchList;
	                touchEvent.changedTouches = changedTouchesWrapper.touchList;
	                touchEvent.targetTouches = targetTouchesWrapper.touchList;
	
	                return touchEvent;
	            }
	
	            var output = false;
	
	            function log(value) {
	                if (output) {
	                    console.log(value);
	                }
	            }
	
	            function isPointerDownEvent(event) {
	                return event.type === 'MSPointerDown' || event.type === 'pointerdown';
	            }
	
	            function isPointerMoveEvent(event) {
	                return event.type === 'MSPointerMove' || event.type === 'pointermove';
	            }
	
	            function isPointerUpEvent(event) {
	                return event.type === 'MSPointerUp' || event.type === 'pointerup';
	            }
	
	            if (ignorePointerEvent(eventArgs)) {
	                return;
	            }
	
	            // An important difference between the MS pointer events and the W3C touch events
	            // is that for pointer events except for pointerdown, all target the element that the touch
	            // is over when the event is fired.
	            // The W3C touch events target the element where the touch originally started.
	            // Therefore, when these events are fired, we must make this change manually.
	            if (!isPointerDownEvent(eventArgs)) {
	                oldTouch = touchesWrapper.getTouch(eventArgs.pointerId);
	                oldTarget = oldTouch ? oldTouch.target : eventArgs.target;
	            }
	
	            if (isPointerDownEvent(eventArgs) || isPointerMoveEvent(eventArgs)) {
	                evObj = touchHandler(eventArgs);
	            } else {
	                evObj = touchChangedHandler(eventArgs);
	            }
	
	            evObj.preventDefault = function() {
	                if (eventArgs.preventDefault) {
	                    eventArgs.preventDefault();
	                }
	            };
	
	            handler.call(eventArgs.target, evObj);
	
	            lastHwTimestamp = eventArgs.hwTimestamp;
	        }
	
	        function eventNameGenerate(event) {
	            return eventMappings[event][mappingIndex];
	        }
	
	        function supportTargetEvent(element, event) {
	            var eventPro = 'on' + event.toLowerCase();
	            return (eventPro in element) || (element.hasOwnProperty(eventPro));
	        }
	
	        function ignorePointerEvent(event) {
	
	            if (event.pointerType === 'mouse' || event.pointerType === 4) {
	                return true;
	            }
	
	            if (event.type === 'pointerdown' && event.x === 0 && event.y === 0) {
	                return true;
	            }
	
	            if (event.pointerType === 'pen' && event.pressure === 0 && event.type === 'pointermove') {
	                return true;
	            }
	            return false;
	        }
	
	        function touchesAreAtSameSpot(touch0, touch1) {
	            return touch0.screenX === touch1.screenX && touch0.screenY === touch1.screenY;
	        }
	
	        function disableIEScroll(element) {
	            if (element && element.style) {
	                if (window.MSPointerEvent) {
	                    element.style.setAttribute('-ms-touch-action', 'none;');
	                } else {
	                    element.style.touchAction = 'none';
	                }
	            }
	        }
	
	        function enableIEScroll(element) {
	            if (element && element.style) {
	                if (window.MSPointerEvent) {
	                    element.style.removeAttribute('-ms-touch-action');
	                } else {
	                    element.style.touchAction = null;
	                }
	            }
	        }
	
	        function guid() {
	            function s4() {
	                return Math.floor((1 + Math.random()) * 0x10000)
	                    .toString(16)
	                    .substring(1);
	            }
	
	            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	                s4() + '-' + s4() + s4() + s4();
	        }
	
	        touchesWrapper = new TouchListWrapper();
	        changedTouchesWrapper = new TouchListWrapper();
	        targetTouchesWrapper = new TouchListWrapper();
	
	        module.exports = TouchWrapper;
	    }(window));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
	    var domUtil = __webpack_require__(2);
	    var gcUtils = __webpack_require__(3);
	    var doT = __webpack_require__(8);
	    var EditorType = gcUtils.EditorType;
	    var Editor = {};
	    var EditMode = {
	        Inline: 'inline',
	        PopUp: 'popup',
	        EditForm: 'editForm'
	    };
	
	    //<editor-fold desc="Helper">
	    function setContainerZIndex_(GeneralEditor) {
	        var elements = document.querySelectorAll('#' + GeneralEditor.options.gridModel.uid + '-editing-area .top');
	        var length = elements.length;
	        for (var i = 0; i < length; i++) {
	            domUtil.removeClass(elements[i], 'top');
	        }
	        domUtil.addClass(this, 'top');
	    }
	
	    function adjustStyle_(GeneralEditor) {
	        var self = GeneralEditor;
	        var inputHeight = self.options.position.height;
	        if (self.type_ === EditorType.Date) {
	            var datePickerHeight = 10;
	            var style = domUtil.getStyle(self.$input);
	            var borderTopWidth = parseFloat(style.getPropertyValue('border-top-width'));
	            var borderBottomWidth = parseFloat(style.getPropertyValue('border-bottom-width'));
	            if (!isNaN(borderTopWidth) && !isNaN(borderBottomWidth)) {
	                var padding = (inputHeight - borderTopWidth - borderBottomWidth) / 2 - datePickerHeight;
	                self.$input.style.padding = padding + 'px 0px';
	            }
	        }
	    }
	
	    function fixDate_(value) {
	        var date = new Date(value);
	        var year = date.getFullYear().toString();
	        var month = (date.getMonth() + 1).toString();
	        var day = (date.getDate()).toString();
	        if (month.length === 1) {
	            month = '0' + month;
	        }
	        if (day.length === 1) {
	            day = '0' + day;
	        }
	        return year + '-' + month + '-' + day;
	    }
	
	    function setViewportTransform_(remove) {
	        //Fix bug. transform will make 'z-index' take no effect.
	        var grid = this.gridModel;
	        var proName = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || navigator.userAgent.match(/Firefox/i)) ? 'transform' : '-webkit-transform';
	        var viewportInner = document.getElementById(grid.uid + '-viewport-inner');
	        var scrollOffset = grid.scrollOffset;
	        if (remove) {
	            viewportInner.style.removeProperty(proName);
	            viewportInner.style.left = -scrollOffset.left + 'px';
	            viewportInner.style.top = -scrollOffset.top + 'px';
	        } else {
	            var translate3d = 'translate3d(' + (-scrollOffset.left) + 'px,' + (-scrollOffset.top) + 'px, 0px)';
	            viewportInner.style.removeProperty('left');
	            viewportInner.style.removeProperty('top');
	            viewportInner.style.setProperty(proName, translate3d);
	        }
	    }
	
	    function isValueChanged_(newValue, oldValue) {
	        return JSON.stringify(newValue) !== JSON.stringify(oldValue);
	    }
	
	    function serializeValue_(index) {
	        var self = this;
	        var editMode = self.gridModel.options.editMode;
	        var editor = self.editors_[index];
	        var columnDef = self.gridModel.columns[index];
	        var value;
	        if (editMode === EditMode.Inline) {
	            value = editor.serializeValue();
	        } else {
	            var tagName = editor.tagName.toLowerCase();
	            if (tagName === 'input' && editor.type === EditorType.CheckBox) {
	                value = editor.checked;
	            } else {
	                value = editor.value;
	            }
	        }
	        var dataType = columnDef.dataType;
	        if (!dataType) {
	            dataType = gcUtils.getType(self.formattedItem[columnDef.dataField]);
	        }
	        return dataType ? gcUtils.changeType(value, dataType) : value;
	    }
	
	    function commitChanges_(newItem) {
	        var self = this;
	        var grid = self.gridModel;
	        var editors = self.editors_;
	        var length = grid.columns.length;
	        var row = self.editingInfo_.rowIndex;
	        var groupInfo = self.editingInfo_.groupInfo;
	        var item = groupInfo ? groupInfo.data.getItem(row) : grid.getDataItem(row);
	        var editor;
	        var columnDef;
	        var val;
	        var colDataField;
	        var colID;
	        var calcSource = grid.data.calcSource;
	        for (var col = 0; col < length; col++) {
	            editor = editors[col];
	            if (editor) {
	                columnDef = grid.columns[col];
	                colDataField = columnDef.dataField;
	                colID = columnDef.id;
	                if (columnDef.isCalcColumn_) {
	                    val = newItem[colID];
	                    if (colDataField !== val) {
	                        columnDef.dataField = val;
	                        if (calcSource) {
	                            calcSource.dirtyColumn(colID, -1, val);
	                            self.wholeColumnChanged_ = true;
	                        }
	                    }
	                } else {
	                    val = newItem[colDataField];
	                    if (item[colDataField] !== val) {
	                        item[colDataField] = val;
	                        if (calcSource) {
	                            self.wholeColumnChanged_ = calcSource.dirtyColumn(colID, row);
	                        }
	                    }
	                }
	                editor = null;
	            }
	        }
	        if (grid.data.groups) {
	            grid.data.refresh();
	        }
	    }
	
	    function cacheTemplateEditors_(element) {
	        var self = this;
	        var tempEditors = element.querySelectorAll('[data-column]');
	        var gridModel = self.gridModel;
	        var columns = gridModel.columns;
	        self.editors_ = [];
	        var i;
	        var index;
	        var length;
	        var col;
	        for (i = 0, length = tempEditors.length; i < length; i++) {
	            col = gridModel.getColById_(tempEditors[i].getAttribute('data-column'));
	            index = columns.indexOf(col);
	            if (index >= 0) {
	                self.editors_[index] = tempEditors[i];
	            }
	        }
	    }
	
	    function allowEditing_() {
	        var self = this;
	        var gridModel = self.gridModel;
	        var columns = gridModel.columns;
	        var i;
	        var length;
	        if (!gridModel.options.allowEditing) {
	            return false;
	        }
	        for (i = 0, length = columns.length; i < length; i++) {
	            if (columns[i].allowEditing) {
	                return true;
	            }
	        }
	        return false;
	    }
	
	    //</editor-fold>
	
	    //<editor-fold desc="GeneralEditor">
	    var GeneralEditor = (function() {
	        function GeneralEditor(options) {
	            var self = this;
	            self.options = options;
	        }
	
	        GeneralEditor.prototype = {
	            install: function() {
	                var self = this;
	                var options = self.options;
	                self.type_ = Editor.getEditorType(options.col.dataType);
	                var type = self.type_;
	
	                self.container = options.container;
	
	                var inputElement;
	                if (type === EditorType.CheckBox) {
	                    inputElement = '<input type="checkbox" class="gc-inline-editor checkbox"' +
	                        ' style="margin:0 auto;vertical-align:middle" />';
	                    self.container.style.textAlign = 'center';
	                } else {
	                    inputElement = '<input type="' + type + '" class="gc-inline-editor ' + (type === EditorType.Date ? 'date' : '') + '" />';
	                }
	                self.$input = domUtil.createElement(inputElement);
	
	                var rawValue = options.value;
	                if (type === EditorType.CheckBox) {
	                    self.defaultValue = !!rawValue;
	                    self.$input.checked = self.defaultValue;
	                } else if (type === EditorType.Date) {
	                    self.defaultValue = fixDate_(rawValue);
	                    self.$input.value = self.defaultValue;
	                    self.$input.select();
	                } else {
	                    self.defaultValue = rawValue;
	                    self.$input.value = self.defaultValue;
	                    self.$input.select();
	                }
	
	                self.container.appendChild(self.$input);
	                adjustStyle_(self);
	                self.$input.focus();
	                self.setZIndex_ = setContainerZIndex_.bind(self.container, self);
	                self.container.addEventListener('click', self.setZIndex_);
	            },
	
	            destroy: function() {
	                var container = this.container;
	                container.removeEventListener('click', this.setZIndex_);
	            },
	
	            focus: function() {
	                this.$input.focus();
	            },
	
	            serializeValue: function() {
	                var self = this;
	                if (self.type_ === EditorType.CheckBox) {
	                    return self.$input.checked;
	                } else {
	                    return self.$input.value;
	                }
	            }
	        };
	        return GeneralEditor;
	    })();
	    //</editor-fold>
	
	    //<editor-fold desc="Editor Template">
	    function getEditorTemplate_() {
	        var self = this;
	        var layoutEngine = self.gridModel.layoutEngine;
	        var template = getUserDefinedEditorTemplate_.call(self) || layoutEngine.getDefaultEditorTemplate_();
	        var element = domUtil.createTemplateElement(template);
	        var templateStr = domUtil.getElementInnerText(element);
	        var controls = element.querySelectorAll('[data-column]');
	        var id;
	        var con;
	        var tagName;
	        var oldTmp;
	        var newTmp;
	        var selOpt;
	        var i;
	        var j;
	        var len;
	        var length;
	        var oldOptStr;
	        var newOptStr;
	        for (i = 0, length = controls.length; i < length; i++) {
	            con = controls[i];
	            oldTmp = domUtil.getElementOuterText(con);
	            tagName = con.tagName.toLowerCase();
	            id = con.getAttribute('data-column');
	            if (tagName === 'textarea') {
	                con.innerHTML = '{{=it.' + id + '}}';
	                newTmp = domUtil.getElementOuterText(con);
	            } else if (tagName === 'input' && con.type === 'checkbox') {
	                newTmp = '<input ' + '{{? it.' + id + '}}checked{{?}}' + oldTmp.substr(oldTmp.indexOf('<input') + 6); // 6 is '<input' length
	            } else if (tagName === 'select') {
	                selOpt = con.options;
	                newTmp = oldTmp;
	                for (j = 0, len = selOpt.length; j < len; j++) {
	                    oldOptStr = domUtil.getElementOuterText(selOpt[j]);
	                    newOptStr = '<option ' + '{{? it.' + id + ' === "' + selOpt[j].text + '"}}selected{{?}}' + oldOptStr.substr(oldOptStr.indexOf('<option') + 7); //7 is '<option' length
	                    newTmp = newTmp.replace(oldOptStr, newOptStr);
	                }
	            } else {
	                con.setAttribute('value', '{{=it.' + id + '}}');
	                newTmp = domUtil.getElementOuterText(con);
	            }
	            if (newTmp) {
	                // jscs:disable validateQuoteMarks
	                /*jshint quotmark: double */
	                newTmp = newTmp.replace(/"/g, "'");
	                // jscs:enable validateQuoteMarks
	                templateStr = templateStr.replace(oldTmp, newTmp);
	            }
	        }
	        return doT.template(templateStr, null, null, true);
	    }
	
	    function getUserDefinedEditorTemplate_() {
	        var gridModel = this.gridModel;
	        var options = gridModel.options;
	        if (options && options.editRowTemplate) {
	            var editTmp = gridModel.options.editRowTemplate;
	            if (gcUtils.isString(editTmp) && editTmp.length > 1 && editTmp[0] === '#') {
	                var tmplElement = document.getElementById(editTmp.slice(1));
	                return tmplElement.innerHTML;
	            } else {
	                return editTmp;
	            }
	        }
	        return null;
	    }
	
	    function getFormattedItem_(item) {
	        var self = this;
	        var columns = self.gridModel.columns;
	        var col;
	        var dataField;
	        for (var i = 0, length = columns.length; i < length; i++) {
	            col = columns[i];
	            dataField = col.dataField;
	            if (col.isCalcColumn_) {
	                item[col.id] = dataField;
	            } else {
	                if (col.dataType && col.dataType.toLowerCase() === 'date') {
	                    item[dataField] = fixDate_(item[dataField]);
	                }
	            }
	        }
	        return item;
	    }
	
	    //</editor-fold>
	
	    //<editor-fold desc="Start Editing">
	    function startTemplateEditing_(groupInfo, uiRowIndex) {
	        var self = this;
	        var gridModel = self.gridModel;
	        var editorTemplate_ = getEditorTemplate_.call(this);
	        var rowIndex = self.editingInfo_.rowIndex;
	        var dataItem = groupInfo ? groupInfo.data.getItem(rowIndex) : gridModel.getDataItem(rowIndex);
	        self.formattedItem = getFormattedItem_.call(self, _.clone(dataItem));
	        self.oldItem = _.clone(self.formattedItem);
	        var args = {
	            status: 'beforeStartEditing',
	            gridModel: gridModel,
	            groupInfo: groupInfo,
	            row: rowIndex,
	            item: self.formattedItem,
	            cancel: false
	        };
	        gridModel.editing.raise(gridModel, args);
	        if (args && args.cancel) {
	            return false;
	        }
	        var editorHTML = editorTemplate_(self.formattedItem);
	        gridModel.layoutEngine.startEditing_(groupInfo, uiRowIndex, editorHTML);
	        var element;
	        var uid = gridModel.uid;
	        var editMode = gridModel.options.editMode;
	        if (editMode === EditMode.PopUp) {
	            element = document.getElementById(uid + '-popup-editing-area');
	        } else if (editMode === EditMode.EditForm) {
	            element = document.getElementById(uid + '-form-editing-area');
	        }
	        cacheTemplateEditors_.call(self, element);
	    }
	
	    function startInlineEditing_(groupInfo, uiRowIndex) {
	        var self = this;
	        var grid = self.gridModel;
	        var columns = grid.columns;
	        var editors = self.editors_ = [];
	        //TODO: re-consider this, maybe we don't need remove select effects
	        //var oldElement = domUtil.getElement('.gc-selected');
	        //if (oldElement) {
	        //    domUtil.removeClass(oldElement, 'gc-selected');
	        //}
	        var selector = grid.uid + (groupInfo ? ('-gr' + groupInfo.path.join('_')) : '') + '-r' + uiRowIndex;
	        var pinnedSelector = grid.uid + (groupInfo ? ('-pgr' + groupInfo.path.join('_')) : '') + '-pr' + uiRowIndex;
	        var pinnedRightSelector = grid.uid + (groupInfo ? ('-prgr' + groupInfo.path.join('_')) : '') + '-prr' + uiRowIndex;
	
	        var row = document.getElementById(selector);
	        var rowRect = domUtil.getElementRect(row);
	        var pinnedRow = document.getElementById(pinnedSelector);
	        var pinnedRowRect;
	        if (pinnedRow) {
	            pinnedRowRect = domUtil.getElementRect(pinnedRow);
	        }
	
	        //var pinnedRightRow = document.getElementById(pinnedRightSelector);
	        //var pinnedRightRowRect;
	        //if (pinnedRightRow) {
	        //    pinnedRightRowRect = domUtil.getElementRect(pinnedRightRow);
	        //}
	        self.inlineContainer = document.createDocumentFragment();
	        var container = domUtil.createElement('<div class="gc-inline-editor-container" ></div>');
	        var rowIndex = self.editingInfo_.rowIndex;
	        var dataItem = groupInfo ? groupInfo.data.getItem(rowIndex) : grid.getDataItem(rowIndex);
	        self.formattedItem = getFormattedItem_.call(self, _.clone(dataItem));
	        self.oldItem = _.clone(self.formattedItem);
	        var args = {
	            status: 'beforeStartEditing',
	            gridModel: grid,
	            groupInfo: groupInfo,
	            row: rowIndex,
	            item: self.formattedItem,
	            cancel: false
	        };
	        grid.editing.raise(grid, args);
	        if (args && args.cancel) {
	            return false;
	        }
	        var cloneContainer;
	        var editor;
	        var columnDef;
	        var editingValue;
	        var editNode;
	        var actionNode;
	        var cellPosition;
	        var op;
	        var i;
	        var len;
	        var s;
	        var needSetViewportTransform = false;
	        for (i = 0, len = columns.length; i < len; i++) {
	            columnDef = columns[i];
	            if (columnDef.pinned === 'left') {
	                s = pinnedSelector;
	            } else if (columnDef.pinned === 'right') {
	                s = pinnedRightSelector;
	            } else {
	                s = selector;
	            }
	            if (self.isColumnEditable(grid, columnDef)) {
	                editingValue = columnDef.isCalcColumn_ ? self.formattedItem[columnDef.id] : self.formattedItem[columnDef.dataField];
	                editNode = domUtil.getElement('#' + s + ' [data-column="' + columnDef.id + '"]');
	                if (editNode) {
	                    cellPosition = domUtil.getElementRect(editNode);
	                    cloneContainer = container.cloneNode();
	
	                    domUtil.setCss(cloneContainer, {
	                        'top': cellPosition.top - rowRect.top,
	                        'left': cellPosition.left - (pinnedRowRect ? pinnedRowRect.left : rowRect.left),
	                        'width': cellPosition.width - 1,  //TODO: -1 is not a good way
	                        'zIndex': columnDef.pinned === 'none' ? 1 : 2
	                    });
	                    self.inlineContainer.appendChild(cloneContainer);
	                    op = {
	                        container: cloneContainer,
	                        gridModel: grid,
	                        col: columnDef,
	                        position: cellPosition,
	                        value: editingValue
	                    };
	                    if (columnDef.editor) {
	                        editor = new columnDef.editor(op);
	                    } else {
	                        editor = new GeneralEditor(op);
	                        //fix bug. set height as the default row height for the default editors.
	                        cloneContainer.style.height = cellPosition.height + 'px';
	                    }
	
	                    editor.install();
	                    editors[i] = editor;
	                    editor = null;
	                }
	            } else {
	                if (columnDef.action) {
	                    actionNode = domUtil.getElement('#' + s + ' .c' + i + ' .gc-action-area');
	                    if (actionNode) {
	                        actionNode.className += ' top';
	                    }
	                    needSetViewportTransform = true;
	                }
	            }
	        }
	        if (needSetViewportTransform) {
	            setViewportTransform_.call(self, true);
	        }
	        grid.layoutEngine.startEditing_(groupInfo, uiRowIndex);
	        for (i = 0, len = editors.length; i < len; i++) {
	            if (editors[i] && editors[i].focus) {
	                editors[i].focus();
	                break;
	            }
	        }
	    }
	
	    //</editor-fold>
	
	    //<editor-fold desc="Event">
	    function registEvents_() {
	        var self = this;
	        var grid = self.gridModel;
	        self.doubleClickHandler_ = doubleClickHandler_.bind(self);
	        self.mouseClickHandler_ = mouseClickHandler_.bind(self);
	        self.tapHandler_ = tapHandler_.bind(self);
	        grid.onMouseDbClick.addHandler(self.doubleClickHandler_);
	        grid.onMouseClick.addHandler(self.mouseClickHandler_);
	        grid.onTap_.addHandler(self.tapHandler_);
	    }
	
	    function unRegistEvents_() {
	        var self = this;
	        var grid = self.gridModel;
	        grid.onMouseDbClick.removeHandler(self.doubleClickHandler_);
	        grid.onMouseClick.removeHandler(self.mouseClickHandler_);
	        grid.onTap_.removeHandler(self.tapHandler_);
	        self.doubleClickHandler_ = null;
	        self.mouseClickHandler_ = null;
	        self.tapHandler_ = null;
	    }
	
	    function tapHandler_(sender, e) {
	        mouseClickHandler_.call(this, sender, e);
	    }
	
	    function doubleClickHandler_(sender, e) {
	        var self = this;
	        var gridModel = sender;
	        var layoutEngine = gridModel.layoutEngine;
	        var hitInfo = layoutEngine && layoutEngine.hitTest(e);
	
	        if (!hitInfo || (self.isEditing_ && isEditingSameRow_(hitInfo, self.editingInfo_))) {
	            return;
	        }
	        if ((hitInfo.area === 'viewport' || hitInfo.area === 'pinnedViewport') && !gridModel.hasEditAction_) {
	            var uiRowIndex;
	            var groupInfo = null;
	            var hitGroupInfo = hitInfo.groupInfo;
	            if (hitGroupInfo) {
	                uiRowIndex = hitGroupInfo.row;
	                groupInfo = gridModel.getGroupInfo_(hitGroupInfo.path);
	            } else {
	                uiRowIndex = hitInfo.row;
	            }
	            self.startEditing(gridModel, groupInfo, uiRowIndex);
	        }
	    }
	
	    function isEditingSameRow_(hitInfo, editingInfo) {
	        return hitInfo.groupInfo ?
	            (hitInfo.groupInfo.group === editingInfo.groupInfo.path && hitInfo.groupInfo.row === editingInfo.rowIndex) :
	        hitInfo.row === editingInfo.rowIndex;
	    }
	
	    function mouseClickHandler_(sender, e) {
	        var self = this;
	        var gridModel = sender;
	        var layoutEngine = gridModel.layoutEngine;
	        var hitInfo = layoutEngine.hitTest(e);
	        if (!hitInfo) {
	            return;
	        }
	
	        if (self.isEditing_ && !isEditingSameRow_(hitInfo, self.editingInfo_) && !gridModel.hasEditAction_) {
	            self.stopEditing(gridModel);
	        }
	    }
	
	    function documentMouseMoveHandler_(e) {
	        var self = this;
	        var info = self.startMoveInfo_;
	        var gridModel = self.gridModel;
	        if (info) {
	            var container = document.getElementById(gridModel.uid + '-popup-editing-area');
	            var mouseOffset = info.mouseOffset;
	            var containerOffset = info.containerOffset;
	            domUtil.setCss(container, {
	                'left': containerOffset.left + (e.pageX - mouseOffset.left),
	                'top': containerOffset.top + (e.pageY - mouseOffset.top)
	            });
	        }
	    }
	
	    function documentMouseUpHandler_() {
	        var self = this;
	        self.startMoveInfo_ = null;
	        document.removeEventListener('mousemove', self.documentMouseMoveHandler_);
	        document.removeEventListener('mouseup', self.documentMouseUpHandler_);
	        self.documentMouseMoveHandler_ = null;
	        self.documentMouseUpHandler_ = null;
	    }
	
	    //</editor-fold>
	
	    //<editor-fold desc="Public Method">
	    function init(gridModel) {
	        var self = this;
	        self.gridModel = gridModel;
	        registEvents_.call(self);
	    }
	
	    Editor.init = init;
	
	    function startEditing(gridModel, groupInfo, rowIndex) {
	        var self = this;
	        if (!allowEditing_.call(self)) {
	            return false;
	        }
	        if (self.isEditing_) {
	            if (self.gridModel && self.gridModel.uid !== gridModel.uid) {
	                return false;
	            } else {
	                self.unMountEditors(gridModel);
	            }
	        }
	        self.gridModel = gridModel;
	        var options = gridModel.options;
	        //var dataRowIndex = groupInfo ? groupInfo.data.toGlobalIndex(rowIndex) : rowIndex;
	        self.editingInfo_ = {
	            //group: groupInfo ? groupInfo.path : null,
	            groupInfo: groupInfo,
	            rowIndex: rowIndex
	        };
	        var editMode = options.editMode || EditMode.Inline;
	        if (editMode === EditMode.PopUp || editMode === EditMode.EditForm) {
	            startTemplateEditing_.call(self, groupInfo, rowIndex);
	        } else { //Inline mode
	            startInlineEditing_.call(self, groupInfo, rowIndex);
	        }
	        var args = {
	            status: 'startEditing',
	            gridModel: gridModel,
	            groupInfo: groupInfo,
	            row: rowIndex,
	            item: self.formattedItem
	        };
	        gridModel.editing.raise(gridModel, args);
	        self.isEditing_ = true;
	        return true;
	    }
	
	    Editor.startEditing = startEditing;
	
	    function stopEditing(gridModel) {
	        var self = this;
	        if (!self.isEditing_) {
	            return false;
	        }
	        if (!self.gridModel || self.gridModel.uid !== gridModel.uid) {
	            return false;
	        }
	        var row = self.editingInfo_.rowIndex;
	        var newItem = _.clone(self.formattedItem);
	        var columns = gridModel.columns;
	        var editors = self.editors_;
	        var i;
	        var length;
	        var columnDef;
	        var newValue;
	        for (i = 0, length = columns.length; i < length; i++) {
	            columnDef = columns[i];
	            if (editors[i]) {
	                newValue = serializeValue_.call(self, i);
	                if (columnDef.isCalcColumn_) {
	                    newItem[columnDef.id] = newValue;
	                    //self.calcColumnChanged_ = self.calcColumnChanged_ || columnDef.dataField !== newValue;//calc column changed will invalidate after commit change
	                } else {
	                    newItem[columnDef.dataField] = newValue;
	                }
	            }
	        }
	        var args = {
	            status: 'beforeEndEditing',
	            gridModel: gridModel,
	            groupInfo: self.editingInfo_.groupInfo,
	            row: row,
	            oldItem: self.oldItem,
	            newItem: newItem,
	            cancel: false
	        };
	        gridModel.editing.raise(gridModel, args);
	        if (args && args.cancel) {
	            return false;
	        }
	        var valueChanged = false;
	        if (isValueChanged_(newItem, self.oldItem)) {
	            commitChanges_.call(self, newItem);
	            valueChanged = true;
	        }
	        self.unMountEditors(gridModel, valueChanged);
	        gridModel.editing.raise(gridModel, {
	            status: 'endEditing',
	            gridModel: gridModel,
	            row: row,
	            item: newItem
	        });
	        return true;
	    }
	
	    Editor.stopEditing = stopEditing;
	
	    function unMountEditors(gridModel, valueChanged) {
	        var self = this;
	        if (!self.gridModel || self.gridModel.uid !== gridModel.uid) {
	            return false;
	        }
	        var layoutEngine = gridModel.layoutEngine;
	        layoutEngine.stopEditing_(valueChanged);
	        var editMode = layoutEngine.options.editMode;
	        if (editMode === EditMode.Inline) {
	            var uid = gridModel.uid;
	            var actionColumns = document.querySelectorAll('#' + uid + ' .gc-action-area.top');
	            if (actionColumns && actionColumns.length) {
	                for (var i = 0, length = actionColumns.length; i < length; i++) {
	                    domUtil.removeClass(actionColumns[i], 'top');
	                }
	                setViewportTransform_.call(self);
	            }
	        }
	        self.isEditing_ = false;
	        //self.calcColumnChanged_ = false;
	        self.wholeColumnChanged_ = false;
	        self.editingInfo_ = null;
	        self.formattedItem = null;
	        self.oldItem = null;
	        self.editors_.length = 0;
	        self.inlineContainer = null;
	    }
	
	    Editor.unMountEditors = unMountEditors;
	
	    function isColumnEditable(gridModel, col) {
	        var self = this;
	        if (self.gridModel && self.gridModel.uid !== gridModel.uid) {
	            return;
	        }
	        self.gridModel = gridModel;
	        var options = this.gridModel.options;
	        if (col.visible === false) {
	            return false;
	        }
	        if (col.action) { //action column can't enter editing status
	            return false;
	        }
	        var dataField = col.dataField; //multi-field can't enter editing status
	        if (!_.startsWith(_.trim(dataField), '=') && dataField && dataField.split(',').length !== 1) {
	            return false;
	        }
	        if (options.allowEditing && col.hasOwnProperty('allowEditing')) {
	            return col.allowEditing;
	        }
	        return true;
	    }
	
	    Editor.isColumnEditable = isColumnEditable;
	
	    function destroy(gridModel) {
	        var self = this;
	        if (!self.gridModel || self.gridModel.uid !== gridModel.uid) {
	            return;
	        }
	        unRegistEvents_.call(self);
	        if (self.isEditing_) {
	            self.unMountEditors(gridModel);
	        }
	        self.gridModel = null;
	    }
	
	    Editor.destroy = destroy;
	
	    function getEditorType(dataType) {
	        var editorType = gcUtils.EditorType;
	        if (!dataType) {
	            return editorType.Text;
	        } else {
	            dataType = dataType.toLowerCase();
	            switch (dataType) {
	                case 'boolean':
	                    return editorType.CheckBox;
	                case 'date':
	                    return editorType.Date;
	                case 'number':
	                    return editorType.Number;
	                default:
	                    return editorType.Text;
	            }
	        }
	    }
	
	    Editor.getEditorType = getEditorType;
	
	    function containerMouseDownHandler(e) {
	        var self = this;
	        var gridModel = self.gridModel;
	        var curTarget = e.target;
	        var className = curTarget.className;
	        var tagName = curTarget.tagName.toLowerCase();
	        var arr = className ? className.split(' ') : [];
	        while (tagName !== 'body') {
	            if (arr.indexOf('gc-editing-close') !== -1) {
	                gridModel.cancelEditing();
	                break;
	            } else if (arr.indexOf('gc-editing-update') !== -1) {
	                gridModel.stopEditing();
	                break;
	            } else if (arr.indexOf('gc-editing-cancel') !== -1) {
	                gridModel.cancelEditing();
	                break;
	            } else if (arr.indexOf('gc-editing-header') !== -1) {
	                var container = document.getElementById(gridModel.uid + '-popup-editing-area');
	                if (container) {
	                    self.documentMouseMoveHandler_ = documentMouseMoveHandler_.bind(self);
	                    self.documentMouseUpHandler_ = documentMouseUpHandler_.bind(self);
	                    document.addEventListener('mousemove', self.documentMouseMoveHandler_);
	                    document.addEventListener('mouseup', self.documentMouseUpHandler_);
	                    var containerOffset = domUtil.offset(container);
	                    var containerStyle = domUtil.getStyle(container);
	                    var containerMarginTop = parseFloat(containerStyle.getPropertyValue('margin-top'));
	                    var containerMarginLeft = parseFloat(containerStyle.getPropertyValue('margin-left'));
	                    self.startMoveInfo_ = {
	                        mouseOffset: {
	                            left: e.pageX,
	                            top: e.pageY
	                        },
	                        containerOffset: {
	                            left: containerOffset.left - containerMarginLeft,
	                            top: containerOffset.top - containerMarginTop
	                        }
	                    };
	                }
	                break;
	            }
	            curTarget = curTarget.parentNode;
	            tagName = curTarget.tagName.toLowerCase();
	            className = curTarget.className;
	            arr = className ? className.split(' ') : [];
	        }
	    }
	
	    Editor.containerMouseDownHandler = containerMouseDownHandler;
	
	    function containerKeyDownHandler(e) {
	        var self = this;
	        var gridModel = self.gridModel;
	        var Key = gcUtils.Key;
	        switch (e.keyCode) {
	            case Key.Enter:
	                if (!gridModel.hasEditAction_) {
	                    gridModel.stopEditing();
	                }
	                break;
	            case Key.Escape:
	                if (!gridModel.hasCancelAction_) {
	                    gridModel.cancelEditing();
	                }
	                break;
	            default:
	                break;
	        }
	    }
	
	    Editor.containerKeyDownHandler = containerKeyDownHandler;
	
	    function getInlineFragment() {
	        return this.inlineContainer;
	    }
	
	    Editor.getInlineFragment = getInlineFragment;
	
	    //</editor-fold>
	
	    module.exports = Editor;
	})();


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	        'use strict';
	        var gcUtils = __webpack_require__(3);
	        var doT = __webpack_require__(8);
	        var domUtil = __webpack_require__(2);
	        var POS_ABS = 'absolute';
	        var POS_REL = 'relative';
	        var OVERFLOW_HIDDEN = 'hidden';
	        var OVERFLOW_AUTO = 'auto';
	        var VIEWPORT = 'viewport';
	        var TOOLPANEL = 'toolPanel';
	        var PINNED_VIEWPORT = 'pinnedLeftViewport';
	        var PINNED_COLUMN_HEADER = 'pinnedLeftColumnHeader';
	        var PINNED_RIGHT_VIEWPORT = 'pinnedRightViewport';
	        var PINNED_RIGHT_COLUMN_HEADER = 'pinnedRightColumnHeader';
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
	        var MIN_COL_WIDTH = 6;
	        var SelectMode = {
	            NONE: 'none',
	            SINGLE: 'single',
	            MULTIPLE: 'multiple'
	        };
	        var swipeStatus = {};
	        var FLICK_THRESHOLD_V = 0.8;
	
	        var GridLayoutEngine = function(options) {
	            var optionDefaults = {
	                rowHeaderWidth: 40,
	                colHeaderHeight: 24,
	                rowHeight: 24,
	                colWidth: '*',
	                showRowHeader: true,
	                showColHeader: true,
	                showGroupHeader: true,
	                showGroupFooter: true,
	                allowEditing: false,
	                allowGrouping: false,  //if set to true, it will show a group drag panel to help user grouping the data at runtime
	                allowSorting: false,
	                selectionMode: SelectMode.SINGLE,
	                allowHeaderSelect: false,
	                allowColumnReorder: true,
	                allowColumnResize: true,
	                editMode: 'inline',
	                showToolPanel: false
	            };
	
	            var self = this;
	            self.layoutInfo_ = null;
	            self.name = 'GridLayoutEngine'; //name must end with LayoutEngine
	            self.options = _.defaults(options || {}, optionDefaults);
	        };
	
	        GridLayoutEngine.prototype = {
	            getColumnDefaults_: function() {
	                var self = this;
	                var options = self.options;
	                return {
	                    width: options.colWidth,
	                    visible: true,
	                    allowSorting: options.allowSorting,
	                    pinned: 'none',
	                    allowEditing: options.allowEditing
	                };
	            },
	
	            updateStartSize_: function() {
	                var scope = this;
	                var grid = scope.grid;
	                var columns = grid.columns;
	                var options = scope.options;
	                var containerRect = grid.getContainerInfo_().contentRect;
	                var szAvailable = containerRect.width - options.rowHeaderWidth - getToolPanelWidth_.call(scope);
	                if ((grid.data.itemCount * options.rowHeight) > (containerRect.height - options.colHeaderHeight)) {
	                    szAvailable -= domUtil.getScrollbarSize().width;
	                }
	
	                var startCount = 0;
	                var lastStartCol;
	                var lastWidth;
	                var szCols = [];
	                var hasStar = false;
	
	                _.each(columns, function(col, index) {
	                    if (grid.isColVisible_(col, col.pinned)) {
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
	                _.each(grid.columns, function(col) {
	                    col.visibleWidth = col.width;
	                });
	
	                updatePinnedColumns_.call(self);
	
	                if (_.some(grid.columns, 'pinned', 'left')) {
	                    self.hasLeftPinnedColumn_ = true;
	                }
	
	                if (_.some(grid.columns, 'pinned', 'right')) {
	                    self.hasRightPinnedColumn_ = true;
	                }
	
	                self.updateStartSize_();
	
	                //If there is row template, use the actual column width in row template.
	                consolidateColumnWidth_.call(self, 'none');
	                if (self.hasLeftPinnedColumn_) {
	                    consolidateColumnWidth_.call(self, 'left');
	                }
	                if (self.hasRightPinnedColumn_) {
	                    consolidateColumnWidth_.call(self, 'right');
	                }
	                var showToolPanel_ = self.options.showToolPanel;
	                Object.defineProperty(self.options, 'showToolPanel', {
	                    get: function() {
	                        return showToolPanel_;
	                    },
	                    set: function(newValue) {
	                        if (showToolPanel_ !== newValue) {
	                            //it's usually change the template during layout/group strategy changed
	                            //as the result, the size of the template maybe different and column size may changed
	                            showToolPanel_ = newValue;
	                            self.grid.invalidate();
	                        }
	                    },
	                    enumerable: true,
	                    configurable: true
	                });
	            },
	
	            getLayoutInfo: function() {
	                var self = this;
	                var options = self.options;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.getLayoutInfo();
	                }
	                if (self.layoutInfo_) {
	                    return self.layoutInfo_;
	                }
	                var layoutInfo = self.layoutInfo_ = {};
	                if (options.showToolPanel) {
	                    layoutInfo[TOOLPANEL] = getToolPanelLayoutInfo_.call(self);
	                }
	                var allColumnHiddlen = _.all(self.grid.columns, function(col) {
	                    return !col.visible;
	                });
	                if (!allColumnHiddlen) {
	                    if (self.hasLeftPinnedColumn_) {
	                        layoutInfo[PINNED_VIEWPORT] = getPinnedViewportLayoutInfo_.call(self, 'left');
	                    }
	                    if (self.hasRightPinnedColumn_) {
	                        layoutInfo[PINNED_RIGHT_VIEWPORT] = getPinnedViewportLayoutInfo_.call(self, 'right');
	                    }
	                    layoutInfo[VIEWPORT] = getViewportLayoutInfo_.call(self);
	
	                    if (options.showColHeader && options.showRowHeader) {
	                        layoutInfo[CORNER_HEADER] = getCornerHeaderLayoutInfo_.call(self);
	                    }
	                    if (options.showRowHeader) {
	                        layoutInfo[ROW_HEADER] = getRowHeaderLayoutInfo_.call(self);
	                    }
	                    if (options.showColHeader) {
	                        layoutInfo[COLUMN_HEADER] = getColumnHeaderLayoutInfo_.call(self);
	                        if (self.hasLeftPinnedColumn_) {
	                            layoutInfo[PINNED_COLUMN_HEADER] = getPinnedColumnHeaderViewportLayoutInfo_.call(self, 'left');
	                        }
	                        if (self.hasRightPinnedColumn_) {
	                            layoutInfo[PINNED_RIGHT_COLUMN_HEADER] = getPinnedColumnHeaderViewportLayoutInfo_.call(self, 'right');
	                        }
	                    }
	                    if (self.options.allowGrouping) {
	                        layoutInfo[GROUP_DRAG_PANEL] = getGroupDragPanelLayoutInfo_.call(self);
	                    }
	                }
	                return layoutInfo;
	            },
	
	            getRenderRowInfo_: function(row, area) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.getRenderRowInfo_(row, area);
	                }
	
	                var uid = scope.grid.uid;
	                var hasGroup = hasGroup_(scope.grid);
	
	                if (area === VIEWPORT || area === PINNED_VIEWPORT || area === PINNED_RIGHT_VIEWPORT) {
	                    if (hasGroup) {
	                        var part = row.area;
	                        var currInfo = row.info;
	                        var groupInfo = scope.grid.getGroupInfo_(currInfo.path);
	                        if (part === GROUP_HEADER) {
	                            return getGroupHeaderRow_.call(scope, row.key, currInfo, groupInfo, row.width, row.top, area);
	                        } else if (part === GROUP_CONTENT) {
	                            return getGroupContentRow_.call(scope, row.key, currInfo.itemIndex, groupInfo, row.height, row.top, area);
	                        } else {
	                            return getGroupFooterRow_.call(scope, row.key, currInfo, groupInfo, row.top, area);
	                        }
	                    } else {
	                        return createRowRenderInfo.call(scope, row.index, row.height, area, uid);
	                    }
	                } else if (area === ROW_HEADER) {
	                    var key = row.key;
	                    var top = hasGroup ? row.top : row.index * row.height;
	                    var isRowRole = hasGroup ? false : true;
	                    var height = row.height;
	
	                    return buildHeaderCell.call(scope, key, row.info, isRowRole, top, height, row.index);
	                } else if (area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER) {
	                    return getRenderedColumnHeaderInfo_.call(scope, area);
	                }
	            },
	
	            getRenderRange_: function(options) {
	                var scope = this;
	                if (scope.groupStrategy_) {
	                    return scope.groupStrategy_.getRenderRange_(options);
	                }
	
	                var area = (options && options.area) || '';
	                if (!area || area === CORNER_HEADER || area === TOOLPANEL || area === GROUP_DRAG_PANEL) {
	                    return null;
	                }
	
	                return getRowsRenderInfo.call(scope, area, options);
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
	                var offsetTop;
	                var grid = scope.grid;
	
	                var renderRange = getRenderRange.call(scope, area, currLayoutInfo, options);
	                start = renderRange.start;
	                end = renderRange.end;
	                offsetTop = renderRange.offsetTop;
	                var cssClass = 'gc-viewport';
	                if (area === PINNED_VIEWPORT) {
	                    cssClass = 'gc-pinned-left';
	                } else if (area === PINNED_RIGHT_VIEWPORT) {
	                    cssClass = 'gc-pinned-right';
	                }
	                if (area === VIEWPORT || area === PINNED_VIEWPORT || area === PINNED_RIGHT_VIEWPORT) {
	                    r = {
	                        outerDivCssClass: cssClass,
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
	                            width: currLayoutInfo.contentWidth,
	                            height: height - (offsetTop < 0 ? offsetTop : 0)
	                        },
	                        innerDivTranslate: {
	                            left: area === VIEWPORT ? (-options.offsetLeft || 0) : 0,
	                            top: -options.offsetTop
	                        },
	                        renderedRows: []
	                    };
	                    if (includeRows) {
	                        if (hasGroup_(grid)) {
	                            r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(scope, start, end, offsetTop, false, false, area));
	                        } else {
	                            for (i = start; i < end; i++) {
	                                r.renderedRows.push(createRowRenderInfo.call(scope, i, rowHeight, area, uid));
	                            }
	                        }
	                    }
	
	                } else if (area === CORNER_HEADER) {
	                    r = {
	                        outerDivCssClass: 'gc-cornerHeader',
	                        outerDivStyle: {
	                            position: POS_ABS,
	                            top: currLayoutInfo.top,
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
	                } else if (area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER) {
	                    cssClass = 'gc-columnHeader';
	                    if (area === PINNED_COLUMN_HEADER) {
	                        cssClass += ' gc-pinned-left';
	                    } else if (area === PINNED_RIGHT_COLUMN_HEADER) {
	                        cssClass += ' gc-pinned-right';
	                    }
	                    r = {
	                        outerDivCssClass: cssClass,
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
	                            height: height,
	                            width: currLayoutInfo.contentWidth
	                        },
	                        innerDivTranslate: {
	                            left: area === COLUMN_HEADER ? (-options.offsetLeft || 0) : 0,
	                            top: 0
	                        },
	                        renderedRows: [getRenderedColumnHeaderInfo_.call(scope, area)]
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
	                            height: height - (offsetTop < 0 ? offsetTop : 0),
	                            width: currLayoutInfo.contentWidth
	                        },
	                        innerDivTranslate: {
	                            left: 0,
	                            top: -options.offsetTop
	                        },
	                        renderedRows: []
	                    };
	                    if (includeRows) {
	                        if (hasGroup_(grid)) {
	                            r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(scope, start, end, offsetTop, true, false, area));
	                        } else {
	                            for (i = start; i < end; i++) {
	                                r.renderedRows.push(getRowHeaderCellRenderInfo_.call(scope, null, i, rowHeight, offsetTop));
	                                offsetTop += rowHeight;
	                            }
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
	                        renderedRows: [{
	                            isRowRole: false,
	                            renderInfo: {
	                                renderedHTML: getRenderedGroupDragPanelInfo_.call(scope, true)
	                            }
	                        }]
	                    };
	                } else if (area === TOOLPANEL) {
	                    r = {
	                        outerDivCssClass: 'gc-tool-panel-container',
	                        outerDivStyle: {
	                            position: POS_ABS,
	                            top: currLayoutInfo.top,
	                            left: currLayoutInfo.left,
	                            height: height,
	                            width: width,
	                            overflow: OVERFLOW_HIDDEN,
	                            zIndex: 999
	                        },
	                        innerDivStyle: {
	                            position: POS_REL,
	                            height: '100%',
	                            //width: width
	                        },
	                        renderedRows: [getToolPanelRenderInfo_.call(scope)]
	                    };
	                }
	                return r;
	            },
	
	            getInitialScrollOffset: function() {
	                return {
	                    top: 0,
	                    left: 0
	                };
	            },
	
	            getRowTemplate: function(area) {
	                var self = this;
	                ////TODO: re-consider whether we should use group strategy row template here
	                //if (self.groupStrategy_) {
	                //    return self.groupStrategy_.getRowTemplate();
	                //}
	                return getTemplate_.call(self, false, area);
	            },
	
	            showScrollPanel: function(area) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.showScrollPanel(area);
	                }
	                var layoutInfo;
	                if (area === VIEWPORT) {
	                    layoutInfo = self.getLayoutInfo()[VIEWPORT];
	                    if (!self.hasRightPinnedColumn_ && (layoutInfo.height < layoutInfo.contentHeight ||
	                        layoutInfo.width < layoutInfo.contentWidth)) {
	                        return true;
	                    } else if (self.hasRightPinnedColumn_ && layoutInfo.width < layoutInfo.contentWidth) {
	                        return true;
	                    }
	                }
	                if (area === PINNED_RIGHT_VIEWPORT) {
	                    layoutInfo = self.getLayoutInfo()[VIEWPORT];
	                    if (layoutInfo.height < layoutInfo.contentHeight) {
	                        return true;
	                    }
	                }
	                return false;
	            },
	
	            isScrollableArea_: function(area) {
	                var self = this;
	                if (self.groupStrategy_ && self.groupStrategy_.isScrollableArea_) {
	                    return self.groupStrategy_.isScrollableArea_(area);
	                }
	
	                return area === VIEWPORT;
	            },
	
	            getScrollPanelRenderInfo: function(area) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.getScrollPanelRenderInfo(area);
	                }
	                if (area === VIEWPORT || area === PINNED_RIGHT_VIEWPORT) {
	                    var layout = self.getLayoutInfo();
	                    var emptyLayout = {width: 0, height: 0, contentWidth: 0, contentHeight: 0};
	                    var columnHeaderLayoutInfo = layout[COLUMN_HEADER] || emptyLayout;
	                    var rowHeaderLayoutInfo = layout[ROW_HEADER] || emptyLayout;
	                    var viewportLayout = layout[VIEWPORT];
	                    var pinnedViewportlayout = layout[PINNED_VIEWPORT];
	                    var showHScrollbar = area === VIEWPORT ? (viewportLayout.contentWidth > viewportLayout.width) : false;
	                    var showVScrollbar = area === VIEWPORT ? (!self.hasRightPinnedColumn_ && viewportLayout.contentHeight > viewportLayout.height) : viewportLayout.contentHeight > viewportLayout.height;
	                    var outerWidth;
	                    var innerWidth;
	                    var outerHeight;
	                    var innerHeight;
	                    var left = 0;
	                    var cssClass = 'gc-grid-' + VIEWPORT + '-scroll-panel';
	                    if (area === VIEWPORT) {
	                        cssClass += ' scroll-left';
	                        if (!self.hasRightPinnedColumn_) {
	                            cssClass += ' scroll-top';
	                        }
	                        outerWidth = viewportLayout.width + (self.hasLeftPinnedColumn_ ? 0 : rowHeaderLayoutInfo.width) + (showVScrollbar ? domUtil.getScrollbarSize().width : 0);
	                        innerWidth = viewportLayout.contentWidth + (self.hasLeftPinnedColumn_ ? 0 : rowHeaderLayoutInfo.width);
	                        outerHeight = viewportLayout.height + columnHeaderLayoutInfo.height + (showHScrollbar ? domUtil.getScrollbarSize().height : 0);
	                        innerHeight = (self.hasRightPinnedColumn_ ? viewportLayout.height : viewportLayout.contentHeight) + columnHeaderLayoutInfo.height;
	                        left = self.hasLeftPinnedColumn_ ? (rowHeaderLayoutInfo.width + pinnedViewportlayout.width) : 0;
	                    } else {
	                        cssClass += ' scroll-top';
	                        var pinnedRightLayout = layout[area];
	                        outerWidth = pinnedRightLayout.width + (showVScrollbar ? domUtil.getScrollbarSize().width : 0);
	                        innerWidth = pinnedRightLayout.width;
	                        outerHeight = pinnedRightLayout.height + columnHeaderLayoutInfo.height;
	                        innerHeight = viewportLayout.contentHeight + columnHeaderLayoutInfo.height;
	                        left = rowHeaderLayoutInfo.width + (self.hasLeftPinnedColumn_ ? pinnedViewportlayout.width : 0) + viewportLayout.width;
	                    }
	
	                    return {
	                        outerDivCssClass: cssClass,
	                        outerDivStyle: {
	                            position: POS_ABS,
	                            top: this.options.allowGrouping ? layout[GROUP_DRAG_PANEL].height : 0,
	                            left: left,
	                            height: outerHeight,
	                            width: outerWidth,
	                            overflow: OVERFLOW_AUTO
	                        },
	                        innerDivStyle: {
	                            position: POS_REL,
	                            height: innerHeight,
	                            width: innerWidth
	                        }
	                    };
	                }
	            },
	
	            clearRenderCache_: function() {
	                var self = this;
	                if (self.groupStrategy_) {
	                    self.groupStrategy_.clearRenderCache_();
	                }
	
	                clearTemplateCache_.call(self);
	                self.toolPanelInfo_ = null;
	                self.grouDragPanelLayoutInfo_ = null;
	                self.cachedViewportLayoutInfo_ = null;
	                self.layoutInfo_ = null;
	
	                if (self.hasLeftPinnedColumn_) {
	                    self.pvInfo_ = null;
	                }
	                if (self.hasRightPinnedColumn_) {
	                    self.prvInfo_ = null;
	                }
	            },
	
	            handleTemplateChange_: function() {
	                var self = this;
	                if (!self.suspendTmplUpdate_) {
	                    self.updateStartSize_();
	                    consolidateColumnWidth_.call(self, 'none');
	                    self.colsResizeInfo_ = null;
	                    self.colLayouts_ = null;
	                    if (self.hasLeftPinnedColumn_) {
	                        consolidateColumnWidth_.call(self, 'left');
	                    }
	                    if (self.hasRightPinnedColumn_) {
	                        consolidateColumnWidth_.call(self, 'right');
	                    }
	                }
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
	                if (self.groupStrategy_ && self.groupStrategy_.initGroupInfosHeight_) {
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
	
	            handleScroll: function(e) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    self.groupStrategy_.handleScroll();
	                } else {
	                    var grid = self.grid;
	                    if (!self.isResizingCol_) {
	                        grid.stopEditing();
	                        grid.scrollRenderPart_(VIEWPORT);
	                        grid.scrollRenderPart_(COLUMN_HEADER);
	                        if (self.hasLeftPinnedColumn_) {
	                            grid.scrollRenderPart_(PINNED_VIEWPORT);
	                            grid.scrollRenderPart_(PINNED_COLUMN_HEADER);
	                        }
	                        if (self.hasRightPinnedColumn_) {
	                            grid.scrollRenderPart_(PINNED_RIGHT_VIEWPORT);
	                            grid.scrollRenderPart_(PINNED_RIGHT_COLUMN_HEADER);
	                        }
	                        grid.scrollRenderPart_(ROW_HEADER);
	                    }
	                }
	                self.grid.onScrollOver_.raise(self.grid, {
	                    scrollDirection: e.scrollDirection
	                });
	            },
	
	            hitTest: function(eventArgs) {
	                var self = this;
	                if (self.groupStrategy_) {
	                    return self.groupStrategy_.hitTest(eventArgs);
	                }
	                var options = self.options;
	                var left = eventArgs.pageX;
	                var top = eventArgs.pageY;
	                var grid = self.grid;
	                var layoutInfo = self.getLayoutInfo();
	                var emptyLayout = {width: 0, height: 0, contentWidth: 0, contentHeight: 0};
	                var viewportLayout = layoutInfo[VIEWPORT] || emptyLayout;
	                var columnHeaderLayout = layoutInfo[COLUMN_HEADER] || emptyLayout;
	                var rowHeaderLayout = layoutInfo[ROW_HEADER] || emptyLayout;
	                var cornerHeaderLayout = layoutInfo[CORNER_HEADER] || emptyLayout;
	                var pinnedViewportLayout = layoutInfo[PINNED_VIEWPORT] || emptyLayout;
	                var pinnedColumnHeaderLayout = layoutInfo[PINNED_COLUMN_HEADER] || emptyLayout;
	                var pinnedRightViewportLayout = layoutInfo[PINNED_RIGHT_VIEWPORT] || emptyLayout;
	                var pinnedRightColumnHeaderLayout = layoutInfo[PINNED_RIGHT_COLUMN_HEADER] || emptyLayout;
	                var toolPanelLayout = layoutInfo[TOOLPANEL] || emptyLayout;
	                var groupDragPanelLayout = options.allowGrouping ? layoutInfo[GROUP_DRAG_PANEL] : null;
	
	                var containerInfo = grid.getContainerInfo_().contentRect;
	                var offsetLeft = left - containerInfo.left;
	                var offsetTop = top - containerInfo.top;
	
	                var panelOffset;
	                var cellElement;
	                var cellOffset;
	                var cellLeft;
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
	                var inViewport = contains_(viewportLayout, point);
	                var inPinnedViewport = false;
	                var inPinnedColumnHeaderArea = false;
	                var inRightPinnedViewport = false;
	                var inRightPinnedColumnHeaderArea = false;
	                var inToolPanel = contains_(toolPanelLayout, point);
	                var inTreeNode = false;
	
	                var inColumnHeaderArea = contains_(columnHeaderLayout, point);
	                if (self.hasLeftPinnedColumn_) {
	                    inPinnedViewport = contains_(pinnedViewportLayout, point);
	                    inPinnedColumnHeaderArea = contains_(pinnedColumnHeaderLayout, point);
	                }
	                if (self.hasRightPinnedColumn_) {
	                    inRightPinnedViewport = contains_(pinnedRightViewportLayout, point);
	                    inRightPinnedColumnHeaderArea = contains_(pinnedRightColumnHeaderLayout, point);
	                }
	                if (options.showToolPanel && inToolPanel) {
	                    hitTestInfo = {
	                        area: TOOLPANEL,
	                        row: -1,
	                        column: -1
	                    };
	                    offsetLeft -= toolPanelLayout.left;
	                    offsetTop -= toolPanelLayout.top;
	
	                    var listItems;
	                    var listItem;
	                    var checkIcon;
	                    var removeIcon;
	                    var toolPanel = document.querySelector('#' + grid.uid + '-' + TOOLPANEL);
	                    var columnList = toolPanel.querySelector('.column-list');
	                    var groupList = toolPanel.querySelector('.group-list');
	                    if (pointIn_.call(self, offsetLeft, offsetTop, columnList, toolPanel)) {
	                        hitTestInfo.columnListInfo = {};
	                        listItems = toolPanel.querySelectorAll('.column-list-item');
	                        for (i = 0, len = listItems.length; i < len; i++) {
	                            listItem = listItems[i];
	                            if (pointIn_(offsetLeft, offsetTop, listItem, toolPanel)) {
	
	                                hitTestInfo.columnListInfo.column = listItem.getAttribute('data-col-id');
	                                checkIcon = listItem.querySelector('.check');
	                                if (pointIn_.call(self, offsetLeft, offsetTop, checkIcon, toolPanel, true)) {
	                                    hitTestInfo.columnListInfo.action = 'visible';
	                                }
	                                break;
	                            }
	                        }
	                    } else if (pointIn_.call(self, offsetLeft, offsetTop, groupList, toolPanel)) {
	                        hitTestInfo.groupListInfo = {};
	                        listItems = toolPanel.querySelectorAll('.group-list-item');
	                        for (i = 0, len = listItems.length; i < len; i++) {
	                            listItem = listItems[i];
	                            if (pointIn_.call(self, offsetLeft, offsetTop, listItem, toolPanel)) {
	                                hitTestInfo.groupListInfo.group = listItem.getAttribute('data-group-id');
	                                removeIcon = listItem.querySelector('.remove');
	                                if (pointIn_.call(self, offsetLeft, offsetTop, removeIcon, toolPanel, true)) {
	                                    hitTestInfo.groupListInfo.action = 'removeGroup';
	                                }
	                                break;
	                            }
	                        }
	                    } else {
	                        var insertColumnIcon = toolPanel.querySelector('.insert-column-icon');
	                        if (insertColumnIcon && pointIn_.call(self, offsetLeft, offsetTop, insertColumnIcon, toolPanel, true)) {
	                            hitTestInfo.columnListInfo = {};
	                            hitTestInfo.columnListInfo.action = 'showAddColumnWindow';
	                        }
	                    }
	                } else if (inViewport || inPinnedViewport || inRightPinnedViewport) {
	                    offsetLeft -= rowHeaderLayout.width;
	                    offsetTop -= (columnHeaderLayout.height);
	                    if (options.allowGrouping) {
	                        offsetTop -= groupDragPanelLayout.height;
	                    }
	                    if (inViewport) {
	                        if (self.hasLeftPinnedColumn_) {
	                            offsetLeft -= pinnedViewportLayout.width;
	                        }
	                        offsetLeft += grid.scrollOffset.left;
	                    }
	                    if (inRightPinnedViewport) {
	                        if (self.hasLeftPinnedColumn_) {
	                            offsetLeft -= pinnedViewportLayout.width;
	                        }
	                        offsetLeft -= viewportLayout.width;
	                    }
	                    offsetTop += grid.scrollOffset.top;
	
	                    if (hasGroup_(grid)) {
	                        startRowPosition = 0;
	                        offsetTopLeft = offsetTop;
	                        for (i = 0, len = grid.data.groups.length; i < len; i++) {
	                            groupInfo = grid.groupInfos_[i];
	                            hitTestInfo = hitTestGroup_.call(self, groupInfo, offsetTopLeft, startRowPosition, offsetLeft, offsetTop, VIEWPORT);
	                            if (hitTestInfo) {
	                                hitTestInfo.area = (inViewport ? VIEWPORT : (inPinnedViewport ? PINNED_VIEWPORT : PINNED_RIGHT_VIEWPORT));
	                                break;
	                            }
	                            offsetTopLeft -= groupInfo.height;
	                            startRowPosition += groupInfo.height;
	                        }
	                    } else {
	                        rowInfo = getRowInfoAt.call(this, {top: offsetTop});
	                        if (rowInfo) {
	                            var row = rowInfo.index;
	                            startRowPosition = rowInfo.startPosition;
	                            var offsetTopFromCurrentRow = offsetTop - startRowPosition;
	                            var rowSelector = grid.uid + (inViewport ? '-r' : (inPinnedViewport ? '-pr' : '-prr')) + row;
	                            var rowElement = document.getElementById(rowSelector);
	                            var actionElements;
	                            offsetLeft -= (rowElement.style.left ? parseFloat(rowElement.style.left) : 0);
	                            for (i = 0; i < colLen; i++) {
	                                cellElement = rowElement.querySelector('.c' + i);
	                                if (cellElement && pointIn_(offsetLeft, offsetTopFromCurrentRow, cellElement, rowElement)) {
	                                    column = i;
	                                    var nodeElement = cellElement.querySelector('.gc-tree-node');
	                                    if (nodeElement && pointIn_.call(self, offsetLeft, offsetTopFromCurrentRow, nodeElement, rowElement, true)) {
	                                        inTreeNode = true;
	                                        break;
	                                    } else if (cols[i].action) {
	                                        actionElements = cellElement.querySelectorAll('[data-action]');
	                                        for (actIndex = 0, actLen = actionElements.length; actIndex < actLen; actIndex++) {
	                                            if (pointIn_(offsetLeft, offsetTopFromCurrentRow, actionElements[actIndex], rowElement)) {
	                                                action = grid.getActionHandler_(cols[i].id, actionElements[actIndex].getAttribute('data-action'));
	                                            }
	                                        }
	                                    }
	                                    break;
	                                }
	                            }
	
	                            if (column === -1) {
	                                action = hitTestTouchPanel_(grid, cols, offsetLeft, offsetTopFromCurrentRow, rowElement);
	                            }
	
	                            hitTestInfo = {
	                                area: (inViewport ? VIEWPORT : (inPinnedViewport ? PINNED_VIEWPORT : PINNED_RIGHT_VIEWPORT)),
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
	                } else if (inColumnHeaderArea || inPinnedColumnHeaderArea || inRightPinnedColumnHeaderArea) {
	                    offsetLeft -= rowHeaderLayout.width;
	                    if (inColumnHeaderArea) {
	                        if (self.hasLeftPinnedColumn_) {
	                            offsetLeft -= pinnedColumnHeaderLayout.width;
	                        }
	                    }
	                    if (inRightPinnedColumnHeaderArea) {
	                        if (self.hasLeftPinnedColumn_) {
	                            offsetLeft -= pinnedColumnHeaderLayout.width;
	                        }
	                        offsetLeft -= viewportLayout.width;
	                    }
	                    offsetTop -= (options.allowGrouping ? groupDragPanelLayout.height : 0);
	
	                    var inColumnHeader = false;
	                    var selectPart = inColumnHeaderArea ? COLUMN_HEADER : (inPinnedColumnHeaderArea ? PINNED_COLUMN_HEADER : PINNED_RIGHT_COLUMN_HEADER);
	                    var columnHeaderPanel = document.getElementById(grid.uid + '-' + selectPart);
	                    var pinned = 'none';
	                    if (inPinnedColumnHeaderArea) {
	                        pinned = 'left';
	                    } else if (inRightPinnedColumnHeaderArea) {
	                        pinned = 'right';
	                    }
	                    panelOffset = domUtil.offset(columnHeaderPanel);
	                    for (i = 0; i < colLen; i++) {
	                        if (grid.isColVisible_(cols[i], pinned)) {
	                            cellElement = document.querySelector('#' + grid.uid + '-' + selectPart + ' .gc-column-header-cell.c' + i);
	                            if (cellElement) {
	                                cellOffset = domUtil.offset(cellElement);
	                                cellLeft = cellOffset.left - panelOffset.left;
	                                cellTop = cellOffset.top - panelOffset.top;
	                                var cellElementStyle = domUtil.getStyle(cellElement);
	                                var paddingLeft = parseStylePropertyValue_(cellElementStyle, PADDING_LEFT);
	                                var paddingRight = parseStylePropertyValue_(cellElementStyle, PADDING_RIGHT);
	                                if (pointIn_(offsetLeft, offsetTop, cellElement, columnHeaderPanel)) {
	                                    inColumnHeader = true;
	                                    hitTestInfo = {
	                                        area: selectPart,
	                                        row: -1,
	                                        column: i,
	                                        headerInfo: {
	                                            inResizeMode: (cellLeft + cellElement.offsetWidth - offsetLeft) <= RESIZE_GAP_SIZE,
	                                            resizeFromZero: false
	                                        }
	                                    };
	                                    break;
	                                } else if ((cellElement.clientWidth - paddingLeft - paddingRight) === 0 &&
	                                    cellLeft < offsetLeft && cellTop >= offsetTop && offsetTop <= (cellTop + cellElement.clientHeight) &&
	                                    (cellLeft + RESIZE_GAP_SIZE) > offsetLeft) {
	                                    inColumnHeader = true;
	                                    hitTestInfo = {
	                                        area: selectPart,
	                                        row: -1,
	                                        column: i,
	                                        headerInfo: {
	                                            inResizeMode: true,
	                                            resizeFromZero: true
	                                        }
	                                    };
	                                    break;
	                                }
	                            }
	                        }
	                    }
	                    var groupColumnHeaders = document.querySelectorAll('#' + grid.uid + '-' + selectPart + ' [data-column-group-header]');
	                    for (i = 0; i < groupColumnHeaders.length; i++) {
	                        var columnHeader = groupColumnHeaders[i];
	                        var columnCaption = columnHeader.getAttribute('data-column-group-header');
	                        if (columnCaption && pointIn_(offsetLeft, offsetTop, columnHeader, columnHeaderPanel)) {
	                            cellOffset = domUtil.offset(columnHeader);
	                            inColumnHeader = true;
	                            hitTestInfo = {
	                                area: selectPart,
	                                row: -1,
	                                column: -1,
	                                columnGroupInfo: {
	                                    caption: columnCaption
	                                },
	                                headerInfo: {
	                                    inResizeMode: (cellOffset.left - panelOffset.left + columnHeader.offsetWidth - offsetLeft) <= RESIZE_GAP_SIZE,
	                                    resizeFromZero: false
	                                }
	                            };
	
	                            var iconElement = columnHeader.querySelector('.gc-header-toggle');
	                            if (iconElement && pointIn_.call(self, offsetLeft, offsetTop, iconElement, columnHeaderPanel, true)) {
	                                hitTestInfo.columnGroupInfo.onExpandToggle = true;
	                            }
	                            break;
	                        }
	                    }
	
	                    if (!inColumnHeader) {
	                        hitTestInfo = {
	                            area: 'none'
	                        };
	                    }
	
	                } else if (contains_(rowHeaderLayout, point)) {
	                    offsetTop -= (columnHeaderLayout.height + (options.allowGrouping ? groupDragPanelLayout.height : 0));
	                    offsetTop += grid.scrollOffset.top;
	                    if (hasGroup_(grid)) {
	                        startRowPosition = 0;
	                        offsetTopLeft = offsetTop;
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
	                        rowInfo = getRowInfoAt.call(this, {top: offsetTop});
	                        if (rowInfo) {
	                            hitTestInfo = {
	                                area: ROW_HEADER,
	                                row: rowInfo.index,
	                                column: -1
	                            };
	                            if (options.allowHeaderSelect) {
	                                relativeElement = document.getElementById(grid.uid + '-rh' + rowInfo.index);
	                                element = relativeElement.querySelector('.gc-header-select-icon');
	                                if (element && pointIn_.call(self, offsetLeft, offsetTop - rowInfo.startPosition, element, relativeElement, true)) {
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
	                    hitTestInfo = {
	                        area: CORNER_HEADER,
	                        row: -1,
	                        column: -1
	                    };
	                    if (options.allowHeaderSelect) {
	                        relativeElement = document.getElementById(grid.uid + '-corner');
	                        element = relativeElement.querySelector('.gc-header-select-icon');
	                        offsetTop = offsetTop - (options.allowGrouping ? groupDragPanelLayout.height : 0);
	                        if (element && pointIn_.call(self, offsetLeft, offsetTop, element, relativeElement, true)) {
	                            hitTestInfo.checked = true;
	                        }
	                    }
	                } else if (options.allowGrouping && contains_(groupDragPanelLayout, point)) {
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
	                var gridOptions = {};
	                if (options.rowHeaderWidth !== 40) {
	                    gridOptions.rowHeaderWidth = options.rowHeaderWidth;
	                }
	                if (options.colHeaderHeight !== 24) {
	                    gridOptions.colHeaderHeight = options.colHeaderHeight;
	                }
	                if (options.rowHeight !== 24) {
	                    gridOptions.rowHeight = options.rowHeight;
	                }
	                if (options.colWidth !== '*') {
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
	                    gridOptions.rowTemplate = getRawRowTemplate_.call(self, false, VIEWPORT);
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
	                var sels = [];
	                var selectedRows = self.selectedRows_;
	                if (!selectedRows || !selectedRows.length) {
	                    return sels;
	                }
	                var collection = self.grid.data.sourceCollection;
	                for (var i = 0, length = selectedRows.length; i < length; i++) {
	                    sels.push(collection[selectedRows[i]]);
	                }
	                return sels;
	            },
	
	            getInnerGroupHeight: function(groupInfo, containerSize) {
	                if (!groupInfo.isBottomLevel) {
	                    return 0;
	                }
	                return this.getRowHeight_() * groupInfo.data.itemCount;
	            },
	
	            getInnerGroupRenderInfo: function(groupInfo, containerSize, layoutCallback) {
	                if (!groupInfo.isBottomLevel) {
	                    return;
	                }
	                var self = this;
	                var group = groupInfo.data;
	                var offsetTop = 0;
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
	                        rowHeight = layout.rowHeight || rowHeight;
	                        if (layout.location) {
	                            rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, layout.location.top, false, additionalCSSClass, additionalStyle, VIEWPORT));
	                        } else {
	                            rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, offsetTop, false, additionalCSSClass, additionalStyle, VIEWPORT));
	                            offsetTop += rowHeight;
	                        }
	                    } else {
	                        additionalStyle = {width: containerSize.width};
	                        rows.push(getRenderedGroupContentItemInfo_.call(self, i, groupInfo, rowHeight, offsetTop, false, null, additionalStyle, VIEWPORT));
	                        offsetTop += rowHeight;
	                    }
	                }
	                return rows;
	            },
	
	            getMaxVisibleItemCount: function(containerSize) {
	                var self = this;
	                return Math.floor(containerSize.height / self.getRowHeight_());
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
	                for (i = 0, len = group.itemCount; i < len; i++) {
	                    if (offsetTop <= rowHeight) {
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
	                    offsetTop -= rowHeight;
	                    //accHeight += height;
	                }
	                return null;
	            },
	
	            //TODO: add row index and return different values based on row index
	            getRowHeight_: function() {
	                return this.options.rowHeight;
	            },
	
	            getGroupHeaderHeight_: function(group) {
	                var header = group.groupDescriptor.header;
	                return (header && header.visible) ? (header.height || this.options.rowHeight) : 0;
	            },
	
	            getGroupFooterHeight_: function(group) {
	                var footer = group.groupDescriptor.footer;
	                return (footer && footer.visible) ? (footer.height || this.options.rowHeight) : 0;
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
	                grid.onTap_.addHandler(handleTouchTap);
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
	                grid.onTap_.removeHandler(handleTouchTap);
	                grid.onSwipe_.removeHandler(self.handleSwipeFn_);
	                grid.onTouchScroll_.removeHandler(self.handleScrollTouchFn_);
	            },
	
	            startEditing_: function(groupInfo, uiRowIndex, template) {
	                var self = this;
	                var editMode = self.options.editMode;
	                var grid = self.grid;
	                var editContainer;
	                var selector = grid.uid + (groupInfo ? ('-gr' + groupInfo.path.join('_')) : '') + '-r' + uiRowIndex;
	                var row = document.getElementById(selector);
	                var rowRect = domUtil.getElementRect(row);
	                var viewportRect = domUtil.getElementRect(document.getElementById(grid.uid + '-viewport'));
	                var pinnedViewportRect;
	                var pinnedRowRect;
	                if (self.hasLeftPinnedColumn_) {
	                    pinnedRowRect = domUtil.getElementRect(document.getElementById(grid.uid + (groupInfo ? ('-pgr' + groupInfo.path.join('_')) : '') + '-pr' + uiRowIndex));
	                    pinnedViewportRect = domUtil.getElementRect(document.getElementById(grid.uid + '-pinnedLeftViewport'));
	                }
	
	                var pinnedRightViewportRect;
	                var pinnedRightRowRect;
	                if (self.hasRightPinnedColumn_) {
	                    pinnedRightRowRect = domUtil.getElementRect(document.getElementById(grid.uid + (groupInfo ? ('-prgr' + groupInfo.path.join('_')) : '') + '-prr' + uiRowIndex));
	                    pinnedRightViewportRect = domUtil.getElementRect(document.getElementById(grid.uid + '-pinnedRightViewport'));
	                }
	                var editingHandler = grid.editingHandler;
	                var i;
	                var length;
	
	                self.containerKeyDownHandler_ = editingHandler.containerKeyDownHandler.bind(editingHandler);
	                self.containerMouseDownHandler_ = editingHandler.containerMouseDownHandler.bind(editingHandler);
	                if (editMode === 'inline') {
	                    var inlineFragment = editingHandler.getInlineFragment();
	                    editContainer = domUtil.createElement('<div id="' + grid.uid + '-inline-editing-area" class="gc-inline-editing-area gc-editing-area" style="top:' + rowRect.top + 'px;left:' + (pinnedViewportRect ? pinnedViewportRect.left : viewportRect.left) +
	                        'px; width:' + ((pinnedViewportRect ? pinnedViewportRect.width : 0) + viewportRect.width + (pinnedRightViewportRect ? pinnedRightViewportRect.width : 0)) + 'px;"></div>');
	                    var innerContainer = domUtil.createElement('<div id="' + grid.uid + '-inline-editing-area-inner" style="position:absolute;left:' + ((pinnedRowRect ? pinnedRowRect.left : rowRect.left) - (pinnedViewportRect ? pinnedViewportRect.left : viewportRect.left)) + 'px;"></div>');
	                    innerContainer.appendChild(inlineFragment);
	                    editContainer.appendChild(innerContainer);
	                    editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                    document.body.appendChild(editContainer);
	                    var inlineEditors = editContainer.querySelectorAll('.gc-inline-editor-container');
	                    var height = 0;
	                    var rect;
	                    for (i = 0, length = inlineEditors.length; i < length; i++) {
	                        rect = domUtil.getElementRect(inlineEditors[i]);
	                        height = Math.max(height, rect.top - rowRect.top + rect.height);
	                    }
	                    editContainer.style.height = height + 'px';
	                } else if (editMode === 'popup') {
	                    var editPopupOverlay = domUtil.createElement('<div class="gc-editing-overlay"></div>');
	                    editContainer = domUtil.createElement('<div id="' + grid.uid + '-popup-editing-area" class="gc-popup-editing-area gc-editing-area">' +
	                        '<div class="gc-editing-header"><span class="header-text">Edit Form</span><div class="gc-editing-close"><span class="gc-icon close-icon"></span></div></div>' +
	                        '<div class="gc-editing-content">' + template + '</div>' +
	                        '<div class="gc-editing-footer"><div class="gc-editing-cancel gc-editing-button"><span class="cancel-text">Cancel</span></div><div class="gc-editing-update gc-editing-button"><span class="update-text">Update</span></div></div></div>');
	
	                    editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                    editContainer.addEventListener('mousedown', self.containerMouseDownHandler_);
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
	                    var viewportInnerRect = domUtil.getElementRect(document.getElementById(grid.uid + '-' + VIEWPORT + '-inner'));
	                    var pinnedViewportInnerRect = null;
	                    if (self.hasLeftPinnedColumn_) {
	                        pinnedViewportInnerRect = domUtil.getElementRect(document.getElementById(grid.uid + '-' + PINNED_VIEWPORT + '-inner'));
	                    }
	                    var containerWidth = grid.getContainerInfo_().contentRect.width;
	                    editContainer = domUtil.createElement('<div style="overflow:hidden;position:absolute;left:' + ((pinnedViewportInnerRect ? pinnedViewportInnerRect.left : viewportInnerRect.left) - rowHeaderWidth) + 'px;' +
	                        'width:' + containerWidth +
	                        'px;max-width:' + containerWidth + 'px;" id="' + grid.uid + '-form-editing-area" class="gc-form-editing-area gc-editing-area">' +
	                        '<div class="gc-editing-content">' + template + '</div>' +
	                        '<div class="gc-editing-footer"><div class="gc-editing-cancel gc-editing-button"><span class="cancel-text">Cancel</span></div><div class="gc-editing-update gc-editing-button"><span class="update-text">Update</span></div></div></div>');
	
	                    editContainer.addEventListener('keydown', self.containerKeyDownHandler_);
	                    editContainer.addEventListener('mousedown', self.containerMouseDownHandler_);
	                    document.body.appendChild(editContainer);
	
	                    var renderedRows = grid.lastRenderedRows_.viewport;
	                    var renderedHeaders = grid.lastRenderedRows_.rowHeader;
	                    var pinnedRenderedRows = grid.lastRenderedRows_.pinnedViewport;
	                    var startIndex = renderedRows.indexOf(selector);
	                    var formHeight = domUtil.getElementRect(editContainer).height;
	                    var tempRow;
	                    var tempHeader;
	                    var tempPinnedRow;
	                    if (startIndex >= 0) {
	                        var availableHeight_ = viewportRect.height - rowRect.height - (rowRect.top - viewportRect.top);
	                        var distance;
	                        var topDist;
	                        if (availableHeight_ < formHeight) {
	                            //If there is no enough space to display, some rows move upward.
	                            distance = formHeight - availableHeight_;
	                            for (i = 0; i <= startIndex; i++) {
	                                tempRow = document.getElementById(renderedRows[i]);
	                                tempHeader = document.getElementById(renderedHeaders[i]);
	                                topDist = Math.ceil(parseInt(tempRow.style.top) - distance);
	                                tempRow.style.top = topDist + 'px';
	                                tempHeader.style.top = topDist + 'px';
	                                if (pinnedRenderedRows) {
	                                    tempPinnedRow = document.getElementById(pinnedRenderedRows[i]);
	                                    tempPinnedRow.style.top = topDist + 'px';
	                                }
	                            }
	                            editContainer.style.top = Math.ceil(rowRect.top + rowRect.height - distance) + 'px';
	                        } else {
	                            //If there is enough space, some rows move down
	                            for (i = startIndex + 1, length = renderedRows.length; i < length; i++) {
	                                tempRow = document.getElementById(renderedRows[i]);
	                                tempHeader = document.getElementById(renderedHeaders[i]);
	                                tempRow.style.top = (parseInt(tempRow.style.top) + formHeight) + 'px';
	                                tempHeader.style.top = (parseInt(tempHeader.style.top) + formHeight) + 'px';
	                                if (pinnedRenderedRows) {
	                                    tempPinnedRow = document.getElementById(pinnedRenderedRows[i]);
	                                    tempPinnedRow.style.top = (parseInt(tempPinnedRow.style.top) + formHeight) + 'px';
	                                }
	                            }
	                            editContainer.style.top = Math.ceil(rowRect.top + rowRect.height) + 'px';
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
	                var editMode = self.options.editMode;
	                var uid = grid.uid;
	                var editingHandler = grid.editingHandler;
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
	                    document.body.removeChild(editContainer);
	                }
	                self.containerKeyDownHandler_ = null;
	                self.containerMouseDownHandler_ = null;
	
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
	            canDoSwipe_: function(moveDirection) {
	                var grid = this.grid;
	                if (moveDirection === 'vertical') {
	                    return false;
	                }
	                var existTouchActionColumn;
	                for (var i = 0, len = grid.columns.length; i < len; i++) {
	                    var col = grid.columns[i];
	                    if (isTouchActionColumn_(col)) {
	                        existTouchActionColumn = true;
	                        break;
	                    }
	                }
	                return existTouchActionColumn;
	            },
	            canStartSwipe_: function(deltaX, deltaY) {
	                return Math.abs(deltaX) >= 10 && Math.abs(deltaY) <= 5;
	            }
	        };
	
	        function clearTemplateCache_() {
	            var self = this;
	            self.cachedTmplFn_ = null;
	            self.cachedGroupFooterFn_ = null;
	            self.cachedGroupHeaderFn_ = null;
	            self.ch_ = null;
	
	            if (self.hasLeftPinnedColumn_) {
	                self.cachedPinedTmplFn_ = null;
	                self.pch_ = null;
	            }
	            if (self.hasRightPinnedColumn_) {
	                self.cachedRightPinedTmplFn_ = null;
	                self.prch_ = null;
	            }
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
	            offsetLeft -= (rowElement.style.left ? parseFloat(rowElement.style.left) : 0);
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
	
	        function getRowsRenderInfo(area, options) {
	            var scope = this;
	            var grid = scope.grid;
	            var uid = grid.uid;
	            var currLayoutInfo = scope.getLayoutInfo()[area];
	            var r = {};
	            var i;
	            var rowHeight = scope.options.rowHeight;
	
	            var renderRange = getRenderRange.call(scope, area, currLayoutInfo, options);
	            if (area === VIEWPORT || area === PINNED_VIEWPORT || area === PINNED_RIGHT_VIEWPORT) {
	
	                r.left = area === VIEWPORT ? (-options.offsetLeft || 0) : 0;
	                r.top = -options.offsetTop;
	                r.renderedRows = [];
	
	                if (hasGroup_(grid)) {
	                    r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(scope, renderRange.start, renderRange.end, renderRange.offsetTop, false, true, area));
	                } else {
	                    for (i = renderRange.start; i < renderRange.end; i++) {
	                        r.renderedRows.push(
	                            {
	                                key: uid + (area === PINNED_VIEWPORT ? '-pr' : (area === PINNED_RIGHT_VIEWPORT ? '-prr' : '-r')) + i,
	                                index: i,
	                                height: rowHeight
	                            });
	                    }
	                }
	            } else if (area === ROW_HEADER) {
	                r.left = 0;
	                r.top = -options.offsetTop;
	                r.renderedRows = [];
	
	                if (hasGroup_(grid)) {
	                    r.renderedRows = r.renderedRows.concat(getGroupRenderInfo_.call(scope, renderRange.start, renderRange.end, renderRange.offsetTop, true, true, area));
	                } else {
	                    for (i = renderRange.start; i < renderRange.end; i++) {
	                        r.renderedRows.push(
	                            {
	                                key: uid + '-rh' + i,
	                                index: i,
	                                height: rowHeight
	                            });
	                    }
	                }
	            } else if (area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER) {
	                r.left = area === COLUMN_HEADER ? (-options.offsetLeft || 0) : 0;
	                r.top = 0;
	                r.renderedRows = [];
	
	                r.renderedRows.push({key: uid + (area === PINNED_COLUMN_HEADER ? '-pch' : (area === PINNED_RIGHT_COLUMN_HEADER ? '-prch' : '-ch'))});
	            }
	
	            return r;
	        }
	
	        function getRenderRange(area, currLayoutInfo, options) {
	            var scope = this;
	            var grid = scope.grid;
	            var renderRange = {};
	            var offsetTop = options.offsetTop;
	            var offsetLeft = options.offsetLeft;
	            var isRowArea = (area === VIEWPORT || area === PINNED_VIEWPORT || area === PINNED_RIGHT_VIEWPORT || area === ROW_HEADER);
	
	            if (isRowArea) {
	                if (hasGroup_(scope.grid)) {
	                    renderRange.start = getGroupInfoAt_.call(scope, offsetTop);
	                    renderRange.end = getGroupInfoAt_.call(scope, offsetTop + currLayoutInfo.height);
	                    renderRange.offsetTop = renderRange.start.startPosition;
	                } else {
	                    var startInfo = getRowInfoAt.call(scope, {top: offsetTop, left: offsetLeft});
	                    var endInfo = getRowInfoAt.call(scope, {
	                        top: offsetTop + currLayoutInfo.height,
	                        left: offsetLeft + currLayoutInfo.width
	                    });
	
	                    if (startInfo) {
	                        renderRange.start = startInfo.index;
	                        renderRange.end = endInfo ? (endInfo.index + 1) : grid.data.itemCount;
	                        renderRange.offsetTop = startInfo.startPosition - offsetTop;
	                    } else {
	                        renderRange.start = renderRange.end = renderRange.offsetTop = 0;
	                    }
	                }
	            }
	
	            return renderRange;
	        }
	
	        function createRowRenderInfo(i, rowHeight, area, uid) {
	            var scope = this;
	            var formattedRowItem = scope.grid.getFormattedDataItem(i);
	            var sourceItemIndex = scope.grid.data.toSourceRow(i);
	            //var sourceItemIndex = i;
	            var keyPrefix = (area === VIEWPORT) ? '-r' : (area === PINNED_VIEWPORT ? '-pr' : '-prr');
	            var fn = area === PINNED_VIEWPORT ? scope.cachedPinedTmplFn_ : (area === PINNED_RIGHT_VIEWPORT ? scope.cachedRightPinedTmplFn_ : scope.cachedTmplFn_);
	            return {
	                key: uid + keyPrefix + i,
	                isRowRole: true,
	                selected: scope.selectedRows_ && scope.selectedRows_.indexOf(sourceItemIndex) !== -1,
	                renderInfo: {
	                    //TODO: remove index,evaluate the cssClasss, why always even?
	                    index: 0,
	                    cssClass: 'gc-row r' + i + ' even',
	                    style: {
	                        top: i * rowHeight,
	                        height: rowHeight
	                    },
	                    renderedHTML: (fn || scope.getRowTemplate(area))(formattedRowItem)
	                }
	            };
	        }
	
	        function getToolPanelWidth_() {
	            var self = this;
	            if (!self.options.showToolPanel) {
	                return 0;
	            }
	            self.toolPanelInfo_ = self.toolPanelInfo_ || getToolPanelInfo_();
	            return self.toolPanelInfo_.width;
	        }
	
	        function getToolPanelPadding_() {
	            var self = this;
	            if (!self.options.showToolPanel) {
	                return 0;
	            }
	            self.toolPanelInfo_ = self.toolPanelInfo_ || getToolPanelInfo_();
	            return self.toolPanelInfo_.padding;
	        }
	
	        function getToolPanelInfo_() {
	            var result = {};
	            var div = '<div style="position:absolute;top:-10000px;left:-10000px;width:5000px;height:5000px;">';
	            div += '<div class="gc-tool-panel-container"></div></div>';
	            var element = domUtil.createElement(div);
	            document.body.appendChild(element);
	            var container = element.firstChild;
	            result.width = parseInt(domUtil.getStyleValue(container, 'width')) || 200;
	            result.padding = (parseInt(domUtil.getStyleValue(container, 'padding-top')) || 0) + (parseInt(domUtil.getStyleValue(container, 'padding-bottom')) || 0);
	            document.body.removeChild(element);
	            return result;
	        }
	
	        function consolidateColumnWidth_(pinned) {
	            var self = this;
	            var tmpl = getUserDefinedTemplate_.call(self, pinned);
	            if (tmpl) {
	                var div = '<div style="position:absolute;top:-10000px;left:-10000px;width:5000px;height:5000px;">';
	                div += tmpl + '</div>';
	                var element = domUtil.createElement(div);
	                document.body.appendChild(element);
	
	                var colElem;
	                _.each(self.grid.columns, function(col) {
	                    colElem = element.querySelector('[data-column="' + col.id + '"]');
	                    if (colElem) {
	                        col.visibleWidth = domUtil.getElementRect(colElem).width;
	                    }
	                });
	
	                document.body.removeChild(element);
	            }
	        }
	
	        function getUserDefinedTemplate_(pinned) {
	            var options = this.options;
	            if (options) {
	                var rowTmpl;
	                if (pinned === 'left') {
	                    rowTmpl = options.pinnedLeftRowTemplate;
	                } else if (pinned === 'right') {
	                    rowTmpl = options.pinnedRightRowTemplate;
	                } else {
	                    rowTmpl = options.rowTemplate;
	                }
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
	
	        function getRawRowTemplate_(isColumnHeader, area) {
	            var self = this;
	            var pinned = 'none';
	            if (area === PINNED_VIEWPORT || area === PINNED_COLUMN_HEADER) {
	                pinned = 'left';
	            } else if (area === PINNED_RIGHT_VIEWPORT || area === PINNED_RIGHT_COLUMN_HEADER) {
	                pinned = 'right';
	            }
	            return getUserDefinedTemplate_.call(self, pinned) || (isColumnHeader ? getDefaultRawColumnHeaderTemplate_.call(self, pinned) : getDefaultRawRowTemplate_.call(self, pinned));
	        }
	
	        function filterActionColumn(templateStr, area) {
	            var self = this;
	            var grid = self.grid;
	            var div = document.createElement('div');
	            div.innerHTML = templateStr;
	            var element = div.children[0];
	            var annotationCols = element.querySelectorAll('[data-column]');
	            var colId;
	            var col;
	            var pinned = 'none';
	            if (area === PINNED_VIEWPORT || area === PINNED_COLUMN_HEADER) {
	                pinned = 'left';
	            } else if (area === PINNED_RIGHT_VIEWPORT || area === PINNED_RIGHT_COLUMN_HEADER) {
	                pinned = 'right';
	            }
	            _.each(annotationCols, function(annotationCol) {
	                colId = annotationCol.getAttribute('data-column');
	                col = grid.getColById_(colId);
	                //filter touch action column
	                if (isTouchActionColumn_(col)) {
	                    annotationCol.style.setProperty('display', 'none');
	                }
	                //filter group columns
	                if (!grid.isColVisible_(col, pinned)) {
	                    annotationCol.style.setProperty('display', 'none');
	                }
	
	            });
	
	            return domUtil.getElementInnerText(div);
	        }
	
	        function getDefaultRawRowTemplate_(pinned) {
	            var self = this;
	            var grid = self.grid;
	            var cols = grid.columns;
	            var left = 0;
	            var height = self.options.rowHeight;
	            var r = '<div style="height:' + height + 'px;">';
	            _.each(cols, function(col) {
	                if (grid.isColVisible_(col, pinned) && ((pinned === 'none' && col.pinned === 'none') || ((pinned === 'left' || pinned === 'right') && col.pinned === pinned))) {
	                    r += '<div class="gc-column" style="height:' + height + 'px;width:' + col.visibleWidth + 'px;left:' + left + 'px;' + (col.visible ? '' : 'display:none') + '" data-column="' + col.id + '"></div>';
	                    left += col.visibleWidth;
	                }
	            });
	            r += '</div>';
	            return r;
	        }
	
	        function getDefaultRawColumnHeaderTemplate_(pinned) {
	            var self = this;
	            var cols = self.grid.columnsConfig_;
	            var left = 0;
	            var baseHeight = self.options.colHeaderHeight;
	            var maxLevel = getColumnHeaderLevel_(cols);
	            var r = '<div style="height:' + baseHeight * maxLevel + 'px;">';
	            var info;
	
	            _.each(cols, function(col) {
	                info = getGroupColumnHeaderRenderInfo_.call(self, col, maxLevel, baseHeight, left, pinned);
	                if (info) {
	                    r += info.html;
	                    left += info.width;
	                }
	            });
	            r += '</div>';
	            return r;
	        }
	
	        function getGroupColumnHeaderRenderInfo_(col, parentGroupLevel, baseHeight, left, pinned) {
	            var self = this;
	            var grid = self.grid;
	            var level = getColumnHeaderLevel_([col]);
	            var colTree = grid.colTree_;
	            var width;
	            var r;
	            var i;
	            var len;
	            var info;
	            var columns;
	            var innerLeft;
	            var colDef;
	            if (level === 1) {
	                if (grid.isColVisible_(col, pinned) && ((pinned === 'none' && col.pinned === 'none') || ((pinned === 'left' || pinned === 'right') && col.pinned === pinned))) {
	                    return {
	                        html: '<div class="gc-column" style="height:' + (parentGroupLevel - level + 1) * baseHeight + 'px;width:' + col.visibleWidth + 'px;max-width:' + col.visibleWidth + 'px;left:' + left + 'px;' + (col.visible ? '' : 'display:none') + '" data-column="' + col.id + '"></div>',
	                        width: col.visibleWidth
	                    };
	                }
	            } else {
	                columns = col.columns;
	                if ((pinned !== 'none' && hasPinnedColumn_(columns)) || pinned === 'none') {
	                    width = getGroupColumnHeaderWidth_.call(self, columns, pinned);
	                    if (width > 0) {
	                        colDef = colTree[col.caption];
	                        r = '<div style="position:absolute; height:' + level * baseHeight + 'px;width:' + width + 'px;left:' + left + 'px;" data-column-group><div class="gc-column-header-cell" style="height:' +
	                            (parentGroupLevel - level + 1) * baseHeight + 'px;width:' + width + 'px;max-width:' + width + 'px;" data-column-group-header="' + col.caption + '"><span>' + col.caption + '</span>' +
	                            ((pinned !== 'none' ? (pinned === 'left' ? colDef.pinnedStatus.showIcon : colDef.pinnedRightStatus.showIcon) : colDef.status.showIcon) ? ' <span class="gc-icon gc-header-toggle ' +
	                            (((pinned !== 'none' ? (pinned === 'left' ? colDef.pinnedStatus.isCollapsed : colDef.pinnedRightStatus.isCollapsed) : colDef.status.isCollapsed)) ? 'collapsed' : 'expand') + '"></span>' : '') + '</div>';
	                        innerLeft = 0;
	                        for (i = 0, len = col.columns.length; i < len; i++) {
	                            info = getGroupColumnHeaderRenderInfo_.call(self, columns[i], level - 1, baseHeight, innerLeft, pinned);
	                            if (info) {
	                                r += info.html;
	                                innerLeft += info.width;
	                            }
	                        }
	                        r += '</div>';
	                        return {
	                            html: r,
	                            width: width
	                        };
	                    }
	                }
	                return null;
	            }
	        }
	
	        function hasPinnedColumn_(cols) {
	            var i;
	            var len;
	            var col;
	            var result = false;
	            for (i = 0, len = cols.length; i < len; i++) {
	                col = cols[i];
	                if (col.columns) {
	                    result = hasPinnedColumn_(col.columns);
	                } else {
	                    result = (col.pinned === 'left' || col.pinned === 'right');
	                }
	                if (result) {
	                    break;
	                }
	            }
	            return result;
	        }
	
	        function getGroupColumnHeaderWidth_(cols, pinned) {
	            var self = this;
	            var i;
	            var len;
	            var width = 0;
	            var col;
	            for (i = 0, len = cols.length; i < len; i++) {
	                col = cols[i];
	                if (col.columns) {
	                    width += getGroupColumnHeaderWidth_.call(self, col.columns, pinned);
	                } else if (self.grid.isColVisible_(col, pinned) && col.pinned === pinned) {
	                    width += col.visibleWidth;
	                }
	            }
	            return width;
	        }
	
	        function getColumnHeaderLevel_(cols) {
	            var i;
	            var len;
	            var max = 0;
	            var col;
	            for (i = 0, len = cols.length; i < len; i++) {
	                col = cols[i];
	                if (!col.hasOwnProperty('columns')) {
	                    max = Math.max(max, 1);
	                } else {
	                    max = Math.max(max, 1 + getColumnHeaderLevel_(col.columns));
	                }
	            }
	            return max;
	        }
	
	        function isTouchActionColumn_(col) {
	            return col.action && col.swipeDirection;
	        }
	
	        function getToolPanelRenderInfo_() {
	            var self = this;
	            var grid = self.grid;
	            var columns = grid.columns;
	            var padding = getToolPanelPadding_.call(self);
	
	            var totalHeight = self.getLayoutInfo()[TOOLPANEL].height - padding;
	
	            var colStr = '<div class="column-list" style="height:' + (totalHeight * 0.6 - 20) + 'px;"><div>'; //20 title height
	            _.each(columns, function(col) {
	                //colStr += '<div class="column-list-item"><input type="checkbox" value="' + col.id + '"' + (col.visible ? ' checked' : '') + '/><label>' + ' ' + col.caption + '</div>';
	                colStr += '<div data-col-id="' + col.id + '" class="column-list-item' + (col.visible ? '' : ' not-visible') + '"><div class="check"><span class="gc-icon select-icon' + (col.visible ? '' : ' not-visible') + '"></span></div><span class="content">' +
	                    col.caption + '</span></div>';
	
	            });
	            colStr += '</div></div>';
	            var html = '<div style="text-align:center; height:20px;">Columns';
	            if (!self.options.rowTemplate) {
	                html += '<span class="gc-icon insert-column-icon"><span>';
	            }
	            html += '</div>' + colStr;
	
	            html += '<div style="text-align:center; height:20px;">Group Columns';
	            colStr = '<div class="group-list" style="height:' + (totalHeight * 0.4 - 20) + 'px;"><div>'; //20 title height
	            var groupDescriptors = grid.data.groupDescriptors;
	            var len = groupDescriptors.length;
	            var col;
	            if (len > 0) {
	                _.each(groupDescriptors, function(desp) {
	                    col = grid.getColById_(desp.field);
	                    colStr += '<div data-group-id="' + col.id + '" class="group-list-item"><span class="content">' + col.caption + '</span><div class="remove"><span class="gc-icon remove-icon"></span></div></div>';
	
	                });
	            } else {
	                colStr += '<div><span class="group-clue">Drag columns from above to create groups</span></div>';
	            }
	            colStr += '</div></div>';
	            html += '</div>' + colStr;
	
	            return {
	                //key: self.grid.uid + '-tool-panel',
	                isRowRole: false,
	                renderInfo: {
	                    cssClass: '',
	                    style: {
	                        height: '100%'
	                    },
	                    renderedHTML: html
	                }
	            };
	        }
	
	        function getRenderedColumnHeaderInfo_(area) {
	            var self = this;
	            var result;
	            if (area === COLUMN_HEADER) {
	                result = self.ch_;
	            } else if (area === PINNED_COLUMN_HEADER) {
	                result = self.pch_;
	            } else {
	                result = self.prch_;
	            }
	            if (!result) {
	                result = getTemplate_.call(this, true, area);
	                if (area === PINNED_COLUMN_HEADER) {
	                    self.pch_ = result;
	                } else if (area === PINNED_RIGHT_COLUMN_HEADER) {
	                    self.prch_ = result;
	                } else {
	                    self.ch_ = result;
	                }
	            }
	            return {
	                key: self.grid.uid + (area === PINNED_COLUMN_HEADER ? '-pch' : (area === PINNED_RIGHT_COLUMN_HEADER ? '-prch' : '-ch')),
	                isRowRole: false,
	                renderInfo: {
	                    cssClass: 'gc-column-header ch',
	                    renderedHTML: result
	                }
	            };
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
	
	        function getGroupDragPanelHeight_() {
	            var scope = this;
	
	            //TODO: appendChild/removeChild twice is too expensive, improve it later.
	            var maxWidth = scope.grid.getContainerInfo_().contentRect.width;
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
	
	        function getGroupDragPanelLayoutInfo_() {
	            var scope = this;
	            if (scope.grouDragPanelLayoutInfo_) {
	                return scope.grouDragPanelLayoutInfo_;
	            }
	            var grid = scope.grid;
	            var width = grid.getContainerInfo_().contentRect.width;
	            var options = scope.options;
	            if (options.allowGrouping) {
	                var height = getGroupDragPanelHeight_.call(scope);
	                scope.grouDragPanelLayoutInfo_ = {
	                    top: 0,
	                    left: 0,
	                    width: width,
	                    height: height,
	                    contentWidth: width,
	                    contentHeight: height
	                };
	            } else {
	                scope.grouDragPanelLayoutInfo_ = {
	                    top: 0,
	                    left: 0,
	                    width: 0,
	                    height: 0,
	                    contentWidth: 0,
	                    contentHeight: 0
	                };
	            }
	
	            return scope.grouDragPanelLayoutInfo_;
	        }
	
	        function getPinnedColumnHeaderViewportLayoutInfo_(pinned) {
	            var scope = this;
	            var options = scope.options;
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	            var viewportLayoutInfo = getPinnedViewportLayoutInfo_.call(scope, pinned);
	            var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight * getColumnHeaderLevel_(scope.grid.columnsConfig_) : 0);
	
	            return {
	                top: groupDragPanelLayoutInfo.height,
	                left: viewportLayoutInfo.left,
	                width: viewportLayoutInfo.width,
	                height: colHeaderHeight,
	                contentWidth: viewportLayoutInfo.contentWidth,
	                contentHeight: colHeaderHeight
	            };
	        }
	
	        function getToolPanelLayoutInfo_() {
	            var self = this;
	            var containerRect = self.grid.getContainerInfo_().contentRect;
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(self);
	            var width = getToolPanelWidth_.call(self);
	            return {
	                top: groupDragPanelLayoutInfo.height,
	                left: Math.max(0, containerRect.width - width),
	                width: width,
	                height: containerRect.height - groupDragPanelLayoutInfo.height,
	                contentWidth: width,
	                contentHeight: containerRect.height - groupDragPanelLayoutInfo.height
	            };
	        }
	
	        function getPinnedViewportLayoutInfo_(pinned) {
	            var scope = this;
	            if (pinned === 'left' && scope.pvInfo_) {
	                return scope.pvInfo_;
	            } else if (pinned === 'right' && scope.prvInfo_) {
	                return scope.prvInfo_;
	            }
	            var grid = scope.grid;
	            var options = scope.options;
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	            var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	            var containerRect = grid.getContainerInfo_().contentRect;
	            var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight * getColumnHeaderLevel_(grid.columnsConfig_) : 0);
	            var height = containerRect.height - colHeaderHeight - groupDragPanelLayoutInfo.height;
	            var width;
	            var template = getUserDefinedTemplate_.call(scope, pinned);
	            if (template) {
	                var divStr = '<div style="position:absolute;top:-10000px;-10000px;width:5000px;height:5000px;">';
	                var element = domUtil.createTemplateElement(template);
	                element.children[0].style.display = 'inline-block';
	                divStr += element.innerHTML + '</div>';
	                var div = domUtil.createElement(divStr);
	                document.body.appendChild(div);
	                width = div.children[0].clientWidth;
	                document.body.removeChild(div);
	                div = null;
	            } else {
	                width = _.reduce(grid.columns, function(sum, col) {
	                    return sum + ((isTouchActionColumn_(col) || col.pinned !== pinned || !grid.isColVisible_(col, pinned)) ? 0 : col.visibleWidth);
	                }, 0);
	            }
	
	            if (pinned === 'left') {
	                scope.pvInfo_ = {
	                    top: colHeaderHeight + groupDragPanelLayoutInfo.height,
	                    left: rowHeaderWidth,
	                    width: width,
	                    height: height,
	                    contentWidth: width,
	                    contentHeight: height
	                };
	                return scope.pvInfo_;
	            } else {
	                var contentHeight = getContentHeight_(grid);
	                var leftPinnedLayout = getPinnedViewportLayoutInfo_.call(scope, 'left');
	                scope.prvInfo_ = {
	                    top: colHeaderHeight + groupDragPanelLayoutInfo.height,
	                    left: Math.max(leftPinnedLayout.left + leftPinnedLayout.width, containerRect.width - getToolPanelWidth_.call(scope) - width - (height < contentHeight ? domUtil.getScrollbarSize().width : 0)),
	                    width: width,
	                    height: height,
	                    contentWidth: width,
	                    contentHeight: height
	                };
	                return scope.prvInfo_;
	            }
	
	        }
	
	        function getViewportLayoutInfo_() {
	            var scope = this;
	            if (scope.cachedViewportLayoutInfo_) {
	                return scope.cachedViewportLayoutInfo_;
	            }
	            var grid = scope.grid;
	            var containerRect = grid.getContainerInfo_().contentRect;
	            var option = scope.options;
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	
	            var rowHeaderWidth = (option.showRowHeader ? option.rowHeaderWidth : 0);
	            var colHeaderHeight = (option.showColHeader ? option.colHeaderHeight * getColumnHeaderLevel_(grid.columnsConfig_) : 0);
	
	            var width = containerRect.width - getToolPanelWidth_.call(scope) - rowHeaderWidth;
	            var height = containerRect.height - colHeaderHeight - groupDragPanelLayoutInfo.height;
	            var contentHeight = getContentHeight_(grid);
	            width = (height >= contentHeight) ? width : (width - domUtil.getScrollbarSize().width);
	            var contentWidth;
	            //if there is rowTemplate, measure the template width as the content width
	            var template = getUserDefinedTemplate_.call(scope, false);
	            if (template) {
	                var divStr = '<div style="position:absolute;top:-10000px;-10000px;width:5000px;height:5000px;">';
	                var element = domUtil.createTemplateElement(template);
	                if (element.children[0].style.display !== 'table') {
	                    element.children[0].style.display = 'inline-block';
	                }
	                divStr += element.innerHTML + '</div>';
	                var div = domUtil.createElement(divStr);
	                document.body.appendChild(div);
	                contentWidth = div.children[0].clientWidth;
	                document.body.removeChild(div);
	                div = null;
	            } else {
	                contentWidth = _.reduce(grid.columns, function(sum, col) {
	                    return sum + ((isTouchActionColumn_(col) || (col.pinned !== 'none') || !grid.isColVisible_(col, 'none')) ? 0 : col.visibleWidth);
	                }, 0);
	            }
	            var pinnedWidth = 0;
	            var pinnedViewportLayoutInfo;
	            var pinnedRightViewportLayoutInfo;
	            if (scope.hasLeftPinnedColumn_) {
	                pinnedViewportLayoutInfo = getPinnedViewportLayoutInfo_.call(scope, 'left');
	                pinnedWidth = pinnedViewportLayoutInfo.width;
	            }
	            width -= pinnedWidth;
	            if (scope.hasRightPinnedColumn_) {
	                pinnedRightViewportLayoutInfo = getPinnedViewportLayoutInfo_.call(scope, 'right');
	                width -= pinnedRightViewportLayoutInfo.width;
	            }
	            var scrollbarHeight = domUtil.getScrollbarSize().height;
	            height = (width >= contentWidth) ? height : (height - scrollbarHeight);
	            if (width < contentWidth) {
	                if (pinnedRightViewportLayoutInfo) {
	                    pinnedRightViewportLayoutInfo.height -= scrollbarHeight;
	                }
	            }
	            scope.cachedViewportLayoutInfo_ = {
	                top: colHeaderHeight + groupDragPanelLayoutInfo.height,
	                left: (rowHeaderWidth + pinnedWidth),
	                width: Math.max(0, width),
	                height: height,
	                contentWidth: contentWidth,
	                contentHeight: contentHeight
	            };
	            return scope.cachedViewportLayoutInfo_;
	        }
	
	        function getContentHeight_(grid) {
	            var data = grid.data;
	            if (hasGroup_(grid)) {
	                return _.reduce(grid.groupInfos_, function(sum, item) {
	                    return sum + item.height;
	                }, 0);
	            } else {
	                return data.itemCount * grid.options.rowHeight;
	            }
	        }
	
	        function getRowHeaderLayoutInfo_() {
	            var scope = this;
	            var options = scope.options;
	            var viewportLayoutInfo = getViewportLayoutInfo_.call(scope);
	            var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	            var height = viewportLayoutInfo.height;
	            if (scope.hasLeftPinnedColumn_) {
	                height = getPinnedViewportLayoutInfo_.call(scope, 'left').height;
	            }
	            return {
	                top: viewportLayoutInfo.top,
	                left: 0,
	                width: rowHeaderWidth,
	                height: height,
	                contentWidth: rowHeaderWidth,
	                contentHeight: viewportLayoutInfo.contentHeight
	            };
	        }
	
	        function parseStylePropertyValue_(style, property) {
	            return parseFloat(style.getPropertyValue(property));
	        }
	
	        function getColumnHeaderLayoutInfo_() {
	            var scope = this;
	            var grid = scope.grid;
	            var options = scope.options;
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	            var viewportLayoutInfo = getViewportLayoutInfo_.call(scope);
	            var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight * getColumnHeaderLevel_(grid.columnsConfig_) : 0);
	
	            return {
	                top: groupDragPanelLayoutInfo.height,
	                left: viewportLayoutInfo.left,
	                width: viewportLayoutInfo.width,
	                height: colHeaderHeight,
	                contentWidth: viewportLayoutInfo.contentWidth,
	                contentHeight: colHeaderHeight
	            };
	        }
	
	        function getCornerHeaderLayoutInfo_() {
	            var scope = this;
	            var options = scope.options;
	
	            var groupDragPanelLayoutInfo = getGroupDragPanelLayoutInfo_.call(scope);
	            var rowHeaderWidth = (options.showRowHeader ? options.rowHeaderWidth : 0);
	            var colHeaderHeight = (options.showColHeader ? options.colHeaderHeight * getColumnHeaderLevel_(scope.grid.columnsConfig_) : 0);
	            return {
	                top: groupDragPanelLayoutInfo.height,
	                left: 0,
	                width: rowHeaderWidth,
	                height: colHeaderHeight,
	                contentWidth: rowHeaderWidth,
	                contentHeight: colHeaderHeight
	            };
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
	
	        function updatePinnedColumns_() {
	            var self = this;
	            var grid = self.grid;
	            var options = self.options;
	            var leftTmpl = options.pinnedLeftRowTemplate;
	            var rightTmpl = options.pinnedRightRowTemplate;
	            if (leftTmpl || rightTmpl) {
	                _.each(grid.columns, function(col) {
	                    col.pinned = false;
	                });
	            }
	            updatePinnedColumnsInRowTemplate_(grid, leftTmpl, 'left');
	            updatePinnedColumnsInRowTemplate_(grid, rightTmpl, 'right');
	        }
	
	        function updatePinnedColumnsInRowTemplate_(grid, rowTemplate, pinned) {
	            if (rowTemplate) {
	                var element = domUtil.createTemplateElement(rowTemplate);
	                var annotationCols = element.querySelectorAll('[data-column]');
	                _.each(annotationCols, function(annotationCol) {
	                    grid.getColById_(annotationCol.getAttribute('data-column')).pinned = pinned;
	                });
	                element = null;
	            }
	        }
	
	        function getGroupDescriptorIndex_(groupDes, id) {
	            var i;
	            var len;
	            for (i = 0, len = groupDes.length; i < len; i++) {
	                if (groupDes[i].field === id) {
	                    return i;
	                }
	            }
	            return -1;
	        }
	
	        function getColIndex_(id) {
	            var self = this;
	            var cols = self.grid.columns;
	            var col;
	            for (var i = 0, len = cols.length; i < len; i++) {
	                col = cols[i];
	                if (col.id === id) {
	                    return i;
	                }
	            }
	            return -1;
	        }
	
	        function getTemplate_(isColumnHeader, area) {
	            var self = this;
	            if (!isColumnHeader) {
	                if (area === VIEWPORT && self.cachedTmplFn_) {
	                    return self.cachedTmplFn_;
	                } else if (area === PINNED_VIEWPORT && self.cachedPinedTmplFn_) {
	                    return self.cachedPinedTmplFn_;
	                } else if (area === PINNED_RIGHT_VIEWPORT && self.cachedRightPinedTmplFn_) {
	                    return self.cachedRightPinedTmplFn_;
	                }
	            }
	
	            var templateStr = getRawRowTemplate_.call(this, isColumnHeader, area);
	            var oldColTmpl;
	            var newColTmpl;
	            var cssName;
	            var tagName;
	            var colId;
	            var colTmpl;
	            var height;
	            var grid = self.grid;
	            var colIndex;
	            templateStr = filterActionColumn.call(this, templateStr, area);
	            var element = domUtil.createTemplateElement(templateStr);
	            //Different browsers may return different innerHTMLs compared with the original HTML,
	            //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	            templateStr = domUtil.getElementInnerText(element);
	
	            var treeColId = getTreeColumn_(grid);
	            var annotationCols = element.querySelectorAll('[data-column]');
	            _.each(annotationCols, function(annotationCol) {
	                height = annotationCol.style.height;
	                //width = annotationCol.style.width;
	                colId = annotationCol.getAttribute('data-column');
	                var col = grid.getColById_(colId);
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
	                colIndex = getColIndex_.call(self, colId);
	                cssName = (isColumnHeader ? 'gc-column-header-cell' : 'gc-cell') + ' c' + colIndex + (col.cssClass ? (' ' + col.cssClass) : '');
	
	                var innerPresenter;
	                if (col.action) {
	                    innerPresenter = isColumnHeader ? (col.caption || '') : createActionColumn_.call(self, col);
	                } else {
	                    innerPresenter = isColumnHeader ? col.caption : (col.presenter ? col.presenter : colAnnotation);
	                }
	
	                if (!isColumnHeader && grid.data.isHierarchical && colId === treeColId) {
	                    var treeColPresenter = '<div style="margin-left:{{=it.node.offset}}px;">' +
	                        '<span class="gc-icon gc-tree-node {{? it.node.collapsed}}collapsed{{??}}expanded{{?}}" style="visibility:{{? it.node.children.length !=0}}visible{{??}}hidden{{?}};"></span></div>';
	                    innerPresenter = treeColPresenter + innerPresenter;
	                }
	
	                newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                    '<div class="' + cssName + '"' + (isColumnHeader ? '' : ' role="gridcell"') + '>' + innerPresenter +
	                    (isColumnHeader ? getSortIndicatorHtml_(self, col, colIndex) : '') +
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
	            var result;
	            if (!isColumnHeader) {
	                result = doT.template(templateStr, null, null, true);
	                if (area === PINNED_VIEWPORT) {
	                    self.cachedPinedTmplFn_ = result;
	                } else if (area === PINNED_RIGHT_VIEWPORT) {
	                    self.cachedRightPinedTmplFn_ = result;
	                } else {
	                    self.cachedTmplFn_ = result;
	                }
	                return result;
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
	                innerPresenter += (item.presenter ? item.presenter : ('<button class="gc-action" data-action="' + item.name + '">' + item.name + '</button>'));
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
	
	        function createColumnTouchPanel(panelWidth) {
	            var self = this;
	            var row = swipeStatus.row;
	            var actionType = swipeStatus.actionType;
	            var columns = swipeStatus.columns;
	            var id = row.id + '-' + actionType + '-actionPanel';
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            var className = row.className + ' actionPanel';
	            var width = panelWidth;
	            var left = actionType === 'left' ? (layoutInfo.contentWidth - width) : 0;
	            var style = 'top:' + row.style.top + '; height:' + row.style.height + '; left:' + left + 'px; width:' + width + 'px;position:absolute';
	            var containerHtml = '<div id="' + id + '" style="' + style + '" class="' + className + '">';
	            var colleft = actionType === 'left' ? 0 : width;
	
	            _.each(columns, function(col) {
	                var colWidth = (col.perferredSize / swipeStatus.columnsTotalWidth) * width;
	                var colTml;
	                if (actionType === 'right') {
	                    colleft -= colWidth;
	                }
	
	                colTml = '<div style = "' + 'height:100%;left:' + colleft + 'px;width:' + colWidth + 'px;position:absolute;overflow:hidden;">';
	                colTml += '<div style="height:100%;float:' + actionType + '" class="gc-actioncolumn' + col.index + '">' + col.persenter + '</div>';
	                colTml += '</div>';
	
	                if (actionType === 'left') {
	                    colleft += colWidth;
	                }
	
	                containerHtml += colTml;
	            });
	
	            containerHtml += '</div>';
	            return domUtil.createElement(containerHtml);
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
	
	        function contains_(layoutInfo, point) {
	            return point.left >= layoutInfo.left && point.top >= layoutInfo.top && point.left <= (layoutInfo.left + layoutInfo.width) && point.top <= (layoutInfo.top + layoutInfo.height);
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
	
	        function getGroupHeaderTemplate_(groupInfo, area) {
	            var self = this;
	            var groupPath = groupInfo.path;
	            var group = groupInfo.data;
	            self.cachedGroupHeaderFn_ = self.cachedGroupHeaderFn_ || {};
	            var cacheObj = self.cachedGroupHeaderFn_;
	            cacheObj[area] = cacheObj[area] || [];
	            if (cacheObj[area][groupPath.length - 1]) {
	                return cacheObj[area][groupPath.length - 1];
	            }
	            var height = self.getGroupHeaderHeight_(group);
	            var header = group.groupDescriptor.header;
	            var templateStr;
	            if (!self.hasLeftPinnedColumn_ || area === PINNED_VIEWPORT) {
	                var colGroupHeaders = '';
	                _.forEach(self.grid.columns, function(column) {
	                    if (column.groupHeader) {
	                        colGroupHeaders = colGroupHeaders + (colGroupHeaders ? ', ' : '') + column.groupHeader;
	                    }
	                });
	                var annotation = colGroupHeaders ? '(' + colGroupHeaders + ')' : '({{=it.count}} items)';
	                //TODO: preprocess user given header template, add height
	                templateStr = (header && header.template) ||
	                    '<div class="gc-group-header gc-group-header-cell " style="height:' + height + 'px;line-height:' +
	                    height + 'px;"><span class="gc-icon gc-grouping-toggle {{=it.groupStatus}}" style="margin-left:{{=it.margin}}px;"></span><span level="{{=it.level}}"> {{=it.name}}<span> ' + annotation + '</span></span></div>';
	
	            } else {
	                templateStr = '<div class="gc-group-header gc-group-header-cell " style="height:' + height + 'px;line-height:' + height + 'px;"></div>';
	            }
	
	            cacheObj[area][groupPath.length - 1] = doT.template(templateStr, null, null, true);
	            return cacheObj[area][groupPath.length - 1];
	        }
	
	        function getGroupFooterTemplate_(groupInfo, area) {
	            var self = this;
	            var grid = self.grid;
	            var groupPath = groupInfo.path;
	            self.cachedGroupFooterFn_ = self.cachedGroupFooterFn_ || {};
	            var cachedObj = self.cachedGroupFooterFn_;
	            cachedObj[area] = cachedObj[area] || [];
	            if (cachedObj[area][groupPath.length - 1]) {
	                return cachedObj[area][groupPath.length - 1];
	            }
	            var footer = groupInfo.data.groupDescriptor.footer;
	            var templateStr;
	            if (footer && area === PINNED_VIEWPORT) {
	                templateStr = footer.pinnedLeftTemplate;
	            } else if (footer && area === PINNED_RIGHT_VIEWPORT) {
	                templateStr = footer.pinnedRightTemplate;
	            }
	            templateStr = templateStr || getRawRowTemplate_.call(self, false, area);
	            var oldColTmpl;
	            var newColTmpl;
	            var cssName;
	            var tagName;
	            var colTmpl;
	            templateStr = filterActionColumn.call(this, templateStr, area);
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
	            cachedObj[area][groupPath.length - 1] = doT.template(templateStr, null, null, true);
	            return cachedObj[area][groupPath.length - 1];
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
	
	        function getGroupFooterRenderInfo_(groupInfo, offset, area) {
	            var self = this;
	            var height = self.getGroupFooterHeight_(groupInfo.data);
	
	            return {
	                cssClass: 'gc-row g' + groupInfo.path.join('_'),
	                style: {
	                    top: offset,
	                    height: height
	                },
	                renderedHTML: getGroupFooterTemplate_.call(self, groupInfo, area)(getGroupFooterData_.call(self, groupInfo))
	            };
	        }
	
	        function getGroupHeaderRenderInfo_(groupPath, groupInfo, width, top, area) {
	            var self = this;
	            return {
	                cssClass: 'gc-row g' + groupPath.join('_'),
	                style: {
	                    top: top,
	                    width: width,
	                    height: self.getGroupHeaderHeight_(groupInfo.data),
	                    overflow: 'hidden'
	                },
	                renderedHTML: renderGroupHeader_.call(self, groupInfo, area)
	            };
	        }
	
	        function getGroupRowRenderInfo_(rowIndex, groupInfo, height, offset, additionalCSSClass, additionalStyle, area) {
	            var self = this;
	            var style = {
	                top: offset,
	                height: height
	            };
	            style = additionalStyle ? _.assign(additionalStyle, style) : style;
	            return {
	                cssClass: 'gc-row' + (additionalCSSClass ? (' ' + additionalCSSClass) : ''),
	                style: style,
	                renderedHTML: self.getRowTemplate(area)(self.grid.formatDataItem(groupInfo.data.getItem(rowIndex)))
	            };
	        }
	
	        function getGroupRenderInfo_(startInfo, endInfo, offsetTop, isRowHeader, getUpdateKey, area) {
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
	
	            var groupRowHeaderContentWidth = scope.getLayoutInfo()[area].contentWidth;
	
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
	                        tpRow = getGroupHeader_.call(scope, currInfo, isRowHeader, groupRowHeaderContentWidth, offsetTop, getUpdateKey, area);
	                    } else if (currInfo.area === GROUP_CONTENT) {
	                        tpRow = getGroupContent_.call(scope, currInfo, isRowHeader, offsetTop, getUpdateKey, area);
	                    } else {
	                        tpRow = getGroupFooter_.call(scope, currInfo, isRowHeader, offsetTop, getUpdateKey, area);
	                    }
	
	                    if (tpRow.row) {
	                        rows = rows.concat(tpRow.row);
	                        offsetTop += tpRow.height;
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
	
	        function getGroupHeader_(currInfo, isRowHeader, width, offsetTop, getUpdateKey, area) {
	            var scope = this;
	            var grid = scope.grid;
	            var rows;
	            var height;
	            var groupInfo = grid.getGroupInfo_(currInfo.path);
	            var header = groupInfo.data.groupDescriptor.header;
	            if (header && header.visible) {
	                rows = [];
	                height = scope.getGroupHeaderHeight_(groupInfo.data);
	                if (isRowHeader) {
	                    rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetTop, height, getUpdateKey));
	                } else {
	                    var key = grid.uid + (area === PINNED_VIEWPORT ? '-pgh' : (area === VIEWPORT ? '-gh' : '-prgh')) + currInfo.path.join('_');
	                    if (getUpdateKey) {
	                        rows.push({
	                            key: key,
	                            info: currInfo,
	                            top: offsetTop,
	                            width: width,
	                            area: GROUP_HEADER
	                        });
	                    } else {
	                        rows.push(getGroupHeaderRow_.call(scope, key, currInfo, groupInfo, width, offsetTop, area));
	                    }
	                }
	            }
	
	            return {row: rows, height: height};
	        }
	
	        function getGroupHeaderRow_(key, currInfo, groupInfo, width, top, area) {
	            var scope = this;
	            return {
	                key: key,
	                isRowRole: false,
	                renderInfo: getGroupHeaderRenderInfo_.call(scope, currInfo.path, groupInfo, width, top, area)
	            };
	        }
	
	        function getRenderedGroupContentItemInfo_(rowIndex, groupInfo, height, offsetTop, getUpdateKey, additionalCSSClass, additionalStyle, area) {
	            var self = this;
	            var key = self.grid.uid + (area === VIEWPORT ? '-gr' : (area === PINNED_VIEWPORT ? '-pgr' : '-prgr')) + groupInfo.path.join('_') + '-r' + rowIndex;
	            if (getUpdateKey) {
	                return {
	                    key: key,
	                    info: {
	                        path: groupInfo.path,
	                        itemIndex: rowIndex,
	                        area: GROUP_CONTENT
	                    },
	                    top: offsetTop,
	                    height: getGroupItemRowHeight_.call(self),
	                    area: GROUP_CONTENT
	                };
	            } else {
	                return getGroupContentRow_.call(self, key, rowIndex, groupInfo, height, offsetTop, additionalCSSClass, additionalStyle, area);
	            }
	        }
	
	        function getGroupContent_(currInfo, isRowHeader, offsetTop, getUpdateKey, area) {
	            var scope = this;
	            var grid = scope.grid;
	            var rows = [];
	            var groupInfo = grid.getGroupInfo_(currInfo.path);
	            var height = getGroupItemRowHeight_.call(this);
	            if (isRowHeader) {
	                rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetTop, height, getUpdateKey));
	            } else {
	                rows.push(getRenderedGroupContentItemInfo_.call(scope, currInfo.itemIndex, groupInfo, height, offsetTop, getUpdateKey, null, null, area));
	            }
	
	            return {row: rows, height: height};
	        }
	
	        function getGroupContentRow_(key, rowIndex, groupInfo, height, top, additionalCSSClass, additionalStyle, area) {
	            var scope = this;
	            return {
	                key: key,
	                isRowRole: true,
	                selected: scope.selectedRows_ && scope.selectedRows_.indexOf(groupInfo.data.toSourceRow(rowIndex)) !== -1,
	                renderInfo: getGroupRowRenderInfo_.call(scope, rowIndex, groupInfo, height, top, additionalCSSClass, additionalStyle, area)
	            };
	        }
	
	        function getGroupFooter_(currInfo, isRowHeader, offsetTop, getUpdateKey, area) {
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
	                    rows.push(getGroupRowHeaderCell.call(scope, currInfo, offsetTop, height, getUpdateKey));
	                } else {
	                    var key = grid.uid + (area === PINNED_VIEWPORT ? '-pgf' : (area === PINNED_RIGHT_VIEWPORT ? '-prgf' : '-gf')) + currInfo.path.join('_');
	                    if (getUpdateKey) {
	                        rows.push({
	                            key: key,
	                            info: currInfo,
	                            top: offsetTop,
	                            area: GROUP_FOOTER
	                        });
	                    } else {
	                        rows.push(getGroupFooterRow_.call(scope, key, currInfo, groupInfo, offsetTop, area));
	                    }
	                }
	            }
	
	            return {row: rows, height: height};
	        }
	
	        function getGroupFooterRow_(key, currInfo, groupInfo, top, area) {
	            var scope = this;
	            return {
	                key: key,
	                isRowRole: false,
	                renderInfo: getGroupFooterRenderInfo_.call(scope, groupInfo, top, area)
	            };
	        }
	
	        function getGroupRowHeaderCell(currInfo, offsetTop, height, getUpdateKey) {
	            var scope = this;
	            if (getUpdateKey) {
	                return {
	                    key: getRowHeaderCellKey.call(this, currInfo),
	                    top: offsetTop,
	                    height: height,
	                    info: currInfo
	                };
	            } else {
	                return getRowHeaderCellRenderInfo_.call(scope, currInfo, null, height, offsetTop);
	            }
	        }
	
	        function renderGroupHeader_(groupInfo, area) {
	            var self = this;
	            return getGroupHeaderTemplate_.call(self, groupInfo, area)(getGroupFooterData_.call(self, groupInfo));
	        }
	
	        function getRowHeaderCellRenderInfo_(currentInfo, itemIndex, height, offsetTop) {
	            var self = this;
	            var key = getRowHeaderCellKey.call(self, currentInfo, itemIndex);
	            return buildHeaderCell.call(self, key, currentInfo, (currentInfo ? false : true), (itemIndex ? (itemIndex * height) : offsetTop), height, itemIndex);
	        }
	
	        function getRowHeaderCellKey(currentInfo, itemIndex) {
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
	
	        function buildHeaderCell(key, info, isRowRole, top, height, itemIndex) {
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
	                    isChecked = selectedRows && selectedRows.indexOf(itemIndex) !== -1;
	                }
	            }
	
	            return {
	                key: key,
	                isRowRole: isRowRole,
	                renderInfo: {
	                    cssClass: 'gc-row-header',
	                    style: {
	                        top: top,
	                        height: height,
	                        width: self.options.rowHeaderWidth
	                    },
	                    renderedHTML: '<div class="gc-row-header-cell">' + (checkboxSelectable && showCheckbox ? '<div id="' + key + '-select" class="gc-icon gc-header-select-icon' + (isChecked ? ' selected' : '') + '"></div>' : '') + '</div>'
	
	                }
	            };
	        }
	
	        //TODO: implement if we allow different row height
	        function getGroupItemRowHeight_() {
	            return this.options.rowHeight;
	        }
	
	        function getRowInfoAt(offset) {
	            var self = this;
	            var startPosition = 0;
	            var dataLen = self.grid.data.itemCount;
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
	                        startIndex = i * 10000;
	                        offsetTop -= item;
	                        startPosition = item;
	                        break;
	                    }
	                }
	            }
	
	            for (i = startIndex; i < dataLen; i++) {
	                if (offsetTop <= rowHeight) {
	                    return {
	                        index: i,
	                        startPosition: startPosition
	                    };
	                }
	                if (i % 10000 === 0) {
	                    self.cachedRowOffset_ = cachedRowOffset || [];
	                    self.cachedRowOffset_[i / 10000] = startPosition;
	                }
	                offsetTop -= rowHeight;
	                startPosition += rowHeight;
	            }
	
	            return null;
	        }
	
	        function startDragDroping_() {
	            var self = this;
	            var grid = self.grid;
	            var selector;
	            var hitTest = self.dragStartInfo_.hitTestInfo;
	            var hitColGroupCaption = hitTest.columnGroupInfo ? hitTest.columnGroupInfo.caption : null;
	            var capiton;
	            var area = hitTest.area;
	            if (area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER) {
	                if (hitTest.column >= 0) {
	                    selector = '#' + self.grid.uid + '-' + area + ' .gc-column-header-cell.c' + hitTest.column;
	                    capiton = grid.columns[hitTest.column].caption;
	                } else if (hitColGroupCaption) {
	                    selector = '#' + self.grid.uid + '-' + area + ' [data-column-group-header="' + hitColGroupCaption + '"]';
	                    capiton = hitColGroupCaption;
	                }
	
	            } else if (area === GROUP_DRAG_PANEL && hitTest.groupingPanelInfo) {
	                selector = '#' + self.grid.uid + '-grouping-indicator-' + hitTest.groupingPanelInfo.field;
	                capiton = grid.getColById_(hitTest.groupingPanelInfo.field).caption;
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
	                element = domUtil.createElement('<div class="gc-drag-clue"  style="z-index:999"><span class="gc-icon gc-icon-grouping-add"></span><div style="display:inline-block;overflow: hidden;white-space:pre;"><span> ' + capiton + '</span></div></div>');
	                element.id = '';
	                element.style.top = offset.top + 'px';
	                element.style.left = offset.left + 'px';
	                element.style.width = width + 'px';
	                element.style.height = height + 'px';
	                //element.style.height = height + 'px';
	                element.style.position = POS_ABS;
	                document.body.appendChild(element);
	                self.dragDropingElement_ = element;
	
	                var clueIndicatorElement = domUtil.createElement('<div class="gc-drag-clue-indicator"><span class="gc-icon top"></span><span class="gc-icon bottom"></span></div>');
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
	                            if (element && pointIn_.call(self, offsetLeft, offsetTop - accHeight, element, relativeElement, true)) {
	                                hitGroupInfo.groupInfo.checked = true;
	                            }
	                        }
	                        return hitGroupInfo;
	                    } else {
	                        relativeElement = document.getElementById(uid + (self.hasLeftPinnedColumn_ ? '-pgh' : '-gh') + groupPath.join('_'));
	                        element = relativeElement.querySelector('.gc-grouping-toggle');
	                        if (element && pointIn_.call(self, offsetLeft, offsetTop - accHeight, element, relativeElement, true)) {
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
	                        hitGroupInfo = self.hitTestGroupContent_(groupInfo, area, offsetLeft, offsetTop - accHeight);
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
	
	        function hitTestTouchPanel_(grid, cols, offsetLeft, offsetTopFromCurrentRow, rowElement) {
	            var actionTouchPanel = getTouchPanel();
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
	                    if (actionColumn && pointIn_(offsetLeft, offsetTopFromCurrentRow, actionColumn, rowElement)) {
	                        if (cols[columnIndex].action) {
	                            actionElements = actionColumn.querySelectorAll('[data-action]');
	                            for (actIndex = 0, actLen = actionElements.length; actIndex < actLen; actIndex++) {
	                                if (pointIn_(offsetLeft, offsetTopFromCurrentRow, actionElements[actIndex], rowElement)) {
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
	
	        function handleMouseDown(sender, e) {
	            handlePointerDown(sender, e);
	        }
	
	        function handleTouchStart(sender, e) {
	            var agrs = {pageX: e.targetTouches[0].pageX, pageY: e.targetTouches[0].pageY};
	            if (handlePointerDown(sender, agrs, true)) {
	                e.handled = true;
	            }
	        }
	
	        function handlePointerDown(sender, e, touchEvent) {
	            var grid = sender;
	            var editingHandler = grid.editingHandler;
	            var layoutEngine = grid.layoutEngine;
	            layoutEngine.hitTestInfo_ = layoutEngine.hitTest(e);
	            var hitInfo = layoutEngine.hitTestInfo_;
	            if (!hitInfo) {
	                return;
	            }
	            if (editingHandler.isEditing_) {
	                return;
	            }
	            layoutEngine.mouseDownPoint_ = {
	                left: e.pageX,
	                top: e.pageY
	            };
	
	            var area = hitInfo.area;
	            var element;
	            if (area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER || area === GROUP_DRAG_PANEL) {
	                layoutEngine.dragStartInfo_ = null;
	                if (inResizeGraphicArea.call(layoutEngine.grid, e) && touchEvent) {
	                    layoutEngine.mouseDownHitInfo_ = layoutEngine.touchDownHitInfo_;
	                } else if (hitInfo.headerInfo && hitInfo.headerInfo.inResizeMode && !touchEvent) {
	                    layoutEngine.mouseDownHitInfo_ = hitInfo;
	                } else if (canStartDraging_.call(layoutEngine, hitInfo)) {
	                    layoutEngine.dragStartInfo_ = {
	                        hitTestInfo: _.clone(hitInfo, true),
	                        pointOffset: {
	                            left: e.pageX,
	                            top: e.pageY
	                        }
	                    };
	                }
	            } else if (area === TOOLPANEL && layoutEngine.options.allowColumnReorder && hitInfo.columnListInfo && hitInfo.columnListInfo.column) {
	                element = grid.container.querySelector('.gc-tool-panel-container .column-list [data-col-id="' + hitInfo.columnListInfo.column + '"]');
	                element.className = element.className + ' selected';
	                layoutEngine.dragStartColumn_ = hitInfo.columnListInfo.column;
	            } else if (area === TOOLPANEL && hitInfo.groupListInfo && hitInfo.groupListInfo.group) {
	                element = grid.container.querySelector('.gc-tool-panel-container .group-list [data-group-id="' + hitInfo.groupListInfo.group + '"]');
	                element.className = element.className + ' selected';
	                layoutEngine.dragStartGroup_ = hitInfo.groupListInfo.group;
	            }
	        }
	
	        function inResizeGraphicArea(e) {
	            var grid = this;
	            var graphic = getResizeGraphic.call(grid);
	            if (graphic) {
	                var container = document.getElementById(grid.uid);
	                var containerInfo = domUtil.getContentRect(container);
	                var offsetLeft = e.pageX - containerInfo.left;
	                var offsetTop = e.pageY - containerInfo.top;
	
	                return pointIn_(offsetLeft, offsetTop, graphic, container);
	            }
	
	            return false;
	        }
	
	        function handleTouchMove_(sender, e) {
	            var agrs = {pageX: e.targetTouches[0].pageX, pageY: e.targetTouches[0].pageY};
	            if (handlePointerMove_.call(this, sender, agrs, false)) {
	                e.handled = true;
	            }
	        }
	
	        function handleMouseMove_(sender, e) {
	            handlePointerMove_.call(this, sender, e, true);
	        }
	
	        function getResizingChildCount_(grid, caption, pinned, includeMin) {
	            var childrenKeys = [];
	            var colTree = grid.colTree_;
	            _.each(colTree, function(item, key) {
	                if (item.parent === caption) {
	                    childrenKeys.push(key);
	                }
	            });
	
	            var visibleCount = 0;
	            var col;
	            _.each(childrenKeys, function(key) {
	                //group header
	                col = grid.getColById_(key);
	                if (!col) {
	                    visibleCount += getResizingChildCount_(grid, key, pinned, includeMin);
	                } else if (grid.isColVisible_(col, pinned) && ((includeMin && col.visibleWidth >= MIN_COL_WIDTH) || (col.visibleWidth > MIN_COL_WIDTH))) {
	                    visibleCount += 1;
	                }
	            });
	            return visibleCount;
	        }
	
	        function resizingColumnGroup_(grid, caption, offset, pinned) {
	            var childrenKeys = [];
	            var colTree = grid.colTree_;
	            _.each(colTree, function(item, key) {
	                if (item.parent === caption) {
	                    childrenKeys.push(key);
	                }
	            });
	
	            var visibleCount = 0;
	            var resizeCols_ = [];
	            var resizeColGroups_ = [];
	            var col;
	
	            _.each(childrenKeys, function(key) {
	                //group header
	                col = grid.getColById_(key);
	                if (!col && (offset > 0 || getResizingChildCount_(grid, key, pinned, false) > 0)) {
	                    visibleCount += 1;
	                    resizeColGroups_.push(key);
	                } else if (col && grid.isColVisible_(col, pinned) && ((offset < 0 && col.visibleWidth > MIN_COL_WIDTH) || offset > 0)) {
	                    visibleCount += 1;
	                    resizeCols_.push(key);
	                }
	            });
	
	            var childOffset = Math.floor(offset / visibleCount);
	            var lastCol;
	            var lastColGroup;
	            if (resizeCols_.length > 0) {
	                lastCol = resizeCols_[resizeCols_.length - 1];
	                resizeCols_ = resizeCols_.slice(0, resizeCols_.length - 1);
	            } else if (resizeColGroups_.length > 0) {
	                lastColGroup = resizeColGroups_[resizeColGroups_.length - 1];
	                resizeColGroups_ = resizeColGroups_.slice(0, resizeColGroups_.length - 1);
	            }
	            _.each(resizeCols_, function(key) {
	                col = grid.getColById_(key);
	                col.visibleWidth = Math.max(MIN_COL_WIDTH, col.visibleWidth + childOffset);
	            });
	            _.each(resizeColGroups_, function(key) {
	                resizingColumnGroup_(grid, key, childOffset, pinned);
	            });
	
	            var remainingOffset = offset - childOffset * (resizeCols_.length + resizeColGroups_.length);
	            if (lastCol) {
	                col = grid.getColById_(lastCol);
	                col.visibleWidth = Math.max(MIN_COL_WIDTH, col.visibleWidth + remainingOffset);
	            } else if (lastColGroup) {
	                resizingColumnGroup_(grid, lastColGroup, remainingOffset, pinned);
	            }
	        }
	
	        function canReorderColumn_(hitInfo) {
	            var self = this;
	            var grid = self.grid;
	            var cols = grid.columns;
	            if (!self.options.allowColumnReorder) {
	                return false;
	            }
	            var dragStartHitInfo = self.dragStartInfo_.hitTestInfo;
	            var dragColumnId;
	            var dropColumnId;
	            if (hitInfo && (hitInfo.area === COLUMN_HEADER || hitInfo.area === PINNED_COLUMN_HEADER || hitInfo.area === PINNED_RIGHT_COLUMN_HEADER)) {
	                if (hitInfo.column !== -1) {
	                    dropColumnId = cols[hitInfo.column].id;
	                } else if (hitInfo.columnGroupInfo) {
	                    dropColumnId = hitInfo.columnGroupInfo.caption;
	                }
	                if (dragStartHitInfo.column !== -1) {
	                    dragColumnId = cols[dragStartHitInfo.column].id;
	                } else if (dragStartHitInfo.columnGroupInfo) {
	                    dragColumnId = dragStartHitInfo.columnGroupInfo.caption;
	                }
	                var dragArea = dragStartHitInfo.area;
	                var dropArea = hitInfo.area;
	                return canReorderColumnInternal_(grid, dragColumnId, dropColumnId, dragArea, dropArea, dragStartHitInfo.column, hitInfo.column);
	
	            }
	            return false;
	        }
	
	        function canReorderColumnInternal_(grid, dragColumnId, dropColumnId, dragArea, dropArea, dragColumn, dropColumn) {
	            var container = grid.container;
	            if (dragColumnId !== dropColumnId || dragArea !== dropArea) {
	                var selectorPrefix = '#' + grid.uid;
	                var dragElement = container.querySelector(selectorPrefix + '-' + dragArea + ' .gc-column-header [' + (dragColumn !== -1 ? 'data-column' : 'data-column-group-header') +
	                    '="' + dragColumnId + '"]');
	                var dropElement = container.querySelector(selectorPrefix + '-' + dropArea + ' .gc-column-header [' + (dropColumn !== -1 ? 'data-column' : 'data-column-group-header') +
	                    '="' + dropColumnId + '"]');
	                var dragElementParent = dragElement;
	                if (dragElement === null || dropElement === null) {
	                    if (grid.colTree_) {
	                        if (grid.colTree_[dragColumnId].parent === grid.colTree_[dropColumnId].parent) {
	                            return true;
	                        }
	                        return false;
	                    }
	                    return true;
	                }
	                if (dragArea !== dropArea) {
	                    var totalColsCount = container.querySelectorAll(selectorPrefix + '-' + dragArea + ' [data-column]').length;
	                    var moveColsCount = 0;
	                    if (dragColumn >= 0) {
	                        moveColsCount = 1;
	                    } else {
	                        var tempNode = dragElement;
	                        var endNode = container.querySelector(selectorPrefix + '-' + dragArea);
	                        while (tempNode && tempNode !== endNode) {
	                            if (tempNode.hasAttribute('data-column-group')) {
	                                break;
	                            }
	                            tempNode = tempNode.parentNode;
	                        }
	                        moveColsCount = tempNode.querySelectorAll('[data-column]').length;
	                    }
	                    //need at least one column at the area
	                    if (totalColsCount === moveColsCount) {
	                        return false;
	                    }
	
	                }
	
	                //var offset1 = domUtil.getElementRect(dragElement);
	                //var offset2 = domUtil.getElementRect(dropElement);
	                //if (dragArea === dropArea && (offset1.left + offset1.width === offset2.left)) {
	                //    return false;
	                //}
	
	                var inItselfGroup = (dragColumn === -1);
	                while (dragElementParent && dragElementParent !== container) {
	                    if (dragElementParent.hasAttribute('data-column-group')) {
	                        if (inItselfGroup) {
	                            inItselfGroup = false;
	                        } else {
	                            break;
	                        }
	                    }
	                    dragElementParent = dragElementParent.parentNode;
	                }
	                var dropElementParent = dropElement;
	                inItselfGroup = (dropColumn === -1);
	                while (dropElementParent && dropElementParent !== container) {
	                    if (dropElementParent.hasAttribute('data-column-group')) {
	                        if (inItselfGroup) {
	                            inItselfGroup = false;
	                        } else {
	                            break;
	                        }
	                    }
	                    dropElementParent = dropElementParent.parentNode;
	                }
	
	                if (dragElementParent === dropElementParent) {
	                    return true;
	                }
	                if (dragElementParent.hasAttribute('data-column-group') && dropElementParent.hasAttribute('data-column-group')) {
	                    var dragGroupHeader;
	                    dragElementParent = dragElementParent.querySelector('[data-column-group-header]');
	                    if (dragElementParent) {
	                        dragGroupHeader = dragElementParent.getAttribute('data-column-group-header');
	                    }
	                    var dropGroupHeader;
	                    dropElementParent = dropElementParent.querySelector('[data-column-group-header]');
	                    if (dropElementParent) {
	                        dropGroupHeader = dropElementParent.getAttribute('data-column-group-header');
	                    }
	                    if (dragGroupHeader && dragGroupHeader === dropGroupHeader) {
	                        return true;
	                    }
	                }
	
	            }
	            return false;
	        }
	
	        function handlePointerMove_(sender, e, mouseEvent) {
	            var grid = this;
	            var layoutEngine = grid.layoutEngine;
	            var offset;
	            var indicatorElement;
	            //call from document mousemove
	            if (!e && Object.prototype.toString.call(sender) === '[object MouseEvent]') {
	                e = sender;
	            }
	            var downPoint;
	            var mouseDownHitInfo = layoutEngine.mouseDownHitInfo_;
	            var groupDes = grid.data.groupDescriptors;
	            var col;
	            var hitInfo = layoutEngine.hitTestInfo_ = layoutEngine.hitTest(e);
	            var len;
	            var minWidth = 0;
	            var i;
	            console.log('handle pointer move');
	            if (layoutEngine.isResizingCol_) {
	                var selector = getResizeElementSelector.call(grid);
	                var mouseHitArea = mouseDownHitInfo.area;
	                var leftMostOffset;
	                var pageX;
	                var column = mouseDownHitInfo.column;
	                var pinned = 'none';
	                if (mouseHitArea === PINNED_COLUMN_HEADER) {
	                    pinned = 'left';
	                } else if (mouseHitArea === PINNED_COLUMN_HEADER) {
	                    pinned = 'right';
	                }
	                if (!grid.options.rowTemplate) {
	                    if (column >= 0) {
	                        leftMostOffset = Math.ceil(domUtil.offset(document.querySelector(selector)).left + MIN_COL_WIDTH);
	                    } else if (mouseDownHitInfo.columnGroupInfo) {
	                        var count = getResizingChildCount_(grid, mouseDownHitInfo.columnGroupInfo.caption, pinned, true);
	                        leftMostOffset = Math.ceil(domUtil.offset(document.querySelector(selector)).left + (count * MIN_COL_WIDTH));
	                    }
	                } else {
	                    if (!layoutEngine.colsResizeInfo_) {
	                        initColsResizeInfo_.call(layoutEngine);
	                    }
	
	                    var resizeInfo = layoutEngine.colsResizeInfo_[column];
	                    var colLayouts = layoutEngine.colLayouts_;
	                    var colLayout = colLayouts[column];
	                    var affectedCols = resizeInfo.affectedCols;
	                    var c;
	                    for (i = 0, len = affectedCols.length; i < len; i++) {
	                        c = affectedCols[i];
	                        if (c !== column && colLayout.offset.left < colLayouts[c].offset.left) {
	                            minWidth = Math.max(minWidth, colLayouts[c].offset.left - colLayout.offset.left);
	                        }
	                    }
	                    minWidth = Math.max(minWidth, MIN_COL_WIDTH);
	                    leftMostOffset = Math.floor(domUtil.offset(document.querySelector(selector)).left) + minWidth;
	                }
	                pageX = Math.max(e.pageX, leftMostOffset);
	                offset = pageX - layoutEngine.resizingLastPoint_.left;
	
	                if (offset !== 0) {
	                    if (!grid.options.rowTemplate) {
	                        if (mouseDownHitInfo.column >= 0) {
	                            col = grid.columns[mouseDownHitInfo.column];
	                            col.visibleWidth = col.visibleWidth + offset;
	                            col.width = col.visibleWidth;
	                            grid.container.querySelector('.gc-grid').style.cursor = 'col-resize';
	                        } else if (mouseDownHitInfo.columnGroupInfo) {
	                            resizingColumnGroup_(grid, mouseDownHitInfo.columnGroupInfo.caption, offset, pinned);
	                        }
	                    } else {
	                        //TODO: support reisze column group
	                        if (mouseDownHitInfo.column >= 0) {
	                            var colWidth = grid.columns[mouseDownHitInfo.column].visibleWidth + offset;
	                            //fix a wired bug.
	                            //domUtil.offset(document.querySelector(selector)).left may return float value
	                            //grid.columns[mouseDownHitInfo.column].visibleWidth + offset will not equal to the minWidth
	                            if (pageX === leftMostOffset) {
	                                colWidth = minWidth;
	                            }
	                            setTemplateColumnWidth_.call(layoutEngine, column, colWidth);
	                        }
	                    }
	                    //grid.invalidate(false);
	                    clearTemplateCache_.call(layoutEngine);
	                    if (mouseHitArea !== PINNED_RIGHT_COLUMN_HEADER) {
	                        grid.invalidate(false);
	                    } else {
	                        grid.refresh(PINNED_RIGHT_COLUMN_HEADER);
	                        grid.refresh(PINNED_RIGHT_VIEWPORT);
	                    }
	
	                    updateResizeGraphics.call(grid, offset);
	                }
	                layoutEngine.resizingLastPoint_ = {
	                    left: pageX
	                };
	            } else if (layoutEngine.isDragDroping_) {
	                var dragStartInfo = layoutEngine.dragStartInfo_;
	                var pointOffset = dragStartInfo.pointOffset;
	                var element = layoutEngine.dragDropingElement_;
	                element.style.top = e.pageY + pointOffset.top + 'px';
	                element.style.left = e.pageX + pointOffset.left + 'px';
	                if (hitInfo && hitInfo.area === GROUP_DRAG_PANEL) {
	                    var dragColumn = dragStartInfo.hitTestInfo.column;
	                    if (dragStartInfo.hitTestInfo.area === GROUP_DRAG_PANEL || (dragColumn >= 0 && getGroupDescriptorIndex_(groupDes, grid.columns[dragColumn].id))) {
	                        layoutEngine.dragDropingElement_.querySelector('.gc-icon').className = 'gc-icon gc-icon-grouping-add';
	                        var to = getGroupInsertingLocation_.call(layoutEngine, e.pageX, e.pageY);
	                        var field;
	                        len = groupDes.length;
	                        if (len > 0) {
	                            field = (to === len ? groupDes[len - 1].field : groupDes[to].field);
	                            var groupingElement = document.getElementById(grid.uid + '-grouping-indicator-' + field);
	                            indicatorElement = layoutEngine.dragDropingIndicatorElement_;
	                            offset = domUtil.offset(groupingElement);
	                            indicatorElement.style.left = (to < len ? (offset.left - 15) : (offset.left + groupingElement.clientWidth)) + 'px';
	                            indicatorElement.style.top = (offset.top) + 'px';
	                            indicatorElement.style.height = groupingElement.clientHeight + 'px';
	                        } else {
	                            var panelElement = document.getElementById(grid.uid + '-groupingPanel');
	                            indicatorElement = layoutEngine.dragDropingIndicatorElement_;
	                            offset = domUtil.offset(panelElement);
	                            indicatorElement.style.left = offset.left + 'px';
	                            indicatorElement.style.top = (offset.top + 8) + 'px';
	                            indicatorElement.style.height = '20px';
	                        }
	                        layoutEngine.dragDropingIndicatorElement_.style.display = 'block';
	                    }
	                } else if (canReorderColumn_.call(layoutEngine, hitInfo)) {
	                    layoutEngine.dragDropingElement_.querySelector('.gc-icon').className = 'gc-icon gc-icon-grouping-add';
	                    var dropElement = grid.container.querySelector('#' + grid.uid + '-' + hitInfo.area + ' .gc-column-header [' + (hitInfo.column !== -1 ? 'data-column' : 'data-column-group-header') + '="' +
	                        (hitInfo.column !== -1 ? grid.columns[hitInfo.column].id : hitInfo.columnGroupInfo.caption) + '"]');
	                    offset = domUtil.offset(dropElement);
	                    indicatorElement = layoutEngine.dragDropingIndicatorElement_;
	                    indicatorElement.style.left = (offset.left - 8) + 'px';
	                    indicatorElement.style.top = (offset.top) + 'px';
	                    indicatorElement.style.height = dropElement.clientHeight + 'px';
	                    indicatorElement.style.display = 'block';
	                } else {
	                    layoutEngine.dragDropingElement_.querySelector('.gc-icon').className = 'gc-icon gc-icon-grouping-forbidden';
	                    layoutEngine.dragDropingIndicatorElement_.style.display = 'none';
	                }
	            } else if (layoutEngine.dragStartColumn_ || layoutEngine.dragStartGroup_) {
	                if (mouseEvent) {
	                    layoutEngine.handleMouseUpFn_ = handleMouseUp_.bind(grid);
	                    document.addEventListener('mouseup', layoutEngine.handleMouseUpFn_);
	                }
	                var sel = layoutEngine.dragStartColumn_ ? '.column-list-item' : '.group-list-item';
	                var oldDropElement = grid.container.querySelector('.gc-tool-panel-container ' + sel + '.drop-above');
	                if (oldDropElement) {
	                    oldDropElement.className = oldDropElement.className.replace('drop-above', '');
	                }
	                oldDropElement = grid.container.querySelector('.gc-tool-panel-container ' + sel + '.drop-below');
	                if (oldDropElement) {
	                    oldDropElement.className = oldDropElement.className.replace('drop-below', '');
	                }
	                var groupListElement = grid.container.querySelector('.gc-tool-panel-container .group-list');
	                groupListElement.className = groupListElement.className.replace('drag-over', '');
	                if (hitInfo && hitInfo.area === TOOLPANEL) {
	                    if (layoutEngine.dragStartColumn_ && hitInfo.columnListInfo && hitInfo.columnListInfo.column) {
	                        var dragColumnIndex = getColIndex_.call(layoutEngine, layoutEngine.dragStartColumn_);
	                        var dropColumn = hitInfo.columnListInfo.column;
	                        var dropColumnIndex = getColIndex_.call(layoutEngine, dropColumn);
	                        if (canReorderColumnInternal_(grid, layoutEngine.dragStartColumn_, dropColumn, getColumnArea_.call(layoutEngine, layoutEngine.dragStartColumn_), getColumnArea_.call(layoutEngine, dropColumn), dragColumnIndex, dropColumnIndex)) {
	                            var colElement = grid.container.querySelector('.gc-tool-panel-container .column-list [data-col-id="' + dropColumn + '"]');
	                            colElement.className += ((dragColumnIndex < dropColumnIndex) ? ' drop-below' : ' drop-above');
	                        }
	                    } else if (hitInfo.groupListInfo) {
	                        if (layoutEngine.dragStartColumn_) {
	                            groupListElement.className += ' drag-over';
	                        } else if (layoutEngine.dragStartGroup_ && hitInfo.groupListInfo.group) {
	                            var dragGroupIndex = getGroupDescriptorIndex_(grid.data.groupDescriptors, layoutEngine.dragStartGroup_);
	                            var dropGroup = hitInfo.groupListInfo.group;
	                            var dropGroupIndex = getGroupDescriptorIndex_(grid.data.groupDescriptors, dropGroup);
	                            if (dragGroupIndex !== -1 && dragGroupIndex !== dropGroupIndex) {
	                                var groupElement = grid.container.querySelector('.gc-tool-panel-container .group-list [data-group-id="' + dropGroup + '"]');
	                                groupElement.className += ((dragGroupIndex < dropGroupIndex) ? ' drop-below' : ' drop-above');
	                            }
	                        }
	                    }
	                }
	            } else {
	                downPoint = layoutEngine.mouseDownPoint_;
	                mouseDownHitInfo = layoutEngine.mouseDownHitInfo_;
	                var cursor = 'default';
	                if (hitInfo && (hitInfo.area === COLUMN_HEADER || hitInfo.area === PINNED_COLUMN_HEADER || hitInfo.area === PINNED_RIGHT_COLUMN_HEADER) && mouseDownHitInfo) {
	                    if (layoutEngine.options.allowColumnResize) {
	                        layoutEngine.isResizingCol_ = true;
	                        layoutEngine.resizingLastPoint_ = downPoint;
	                        if (mouseEvent) {
	                            layoutEngine.handleMouseUpFn_ = handleMouseUp_.bind(grid);
	                            document.addEventListener('mouseup', layoutEngine.handleMouseUpFn_);
	                            removeResizeGraphics.call(grid);
	                        }
	                    }
	                } else if (layoutEngine.dragStartInfo_ && !layoutEngine.isDragDroping_ &&
	                    ((downPoint && e.pageX !== downPoint.left) ||
	                    (downPoint && e.pageY !== downPoint.top))) {
	                    var sucess = startDragDroping_.call(layoutEngine);
	                    if (sucess) {
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
	                } else {
	                    cursor = 'default';
	                    layoutEngine.cursor_ = layoutEngine.cursor_ || 'default';
	                    if (hitInfo && hitInfo.headerInfo && hitInfo.headerInfo.inResizeMode && layoutEngine.options.allowColumnResize) {
	                        cursor = 'col-resize';
	                    }
	                    if (layoutEngine.cursor_ !== cursor) {
	                        layoutEngine.cursor_ = cursor;
	                        grid.container.querySelector('.gc-grid').style.cursor = cursor;
	                    }
	                }
	            }
	            return !!layoutEngine.dragStartInfo_ || layoutEngine.isResizingCol_ || layoutEngine.dragStartColumn_ || layoutEngine.dragStartGroup_;
	        }
	
	        function getColumnArea_(colId) {
	            var self = this;
	            var container = self.grid.container;
	            var headerElements = container.querySelectorAll('.gc-columnHeader');
	            var i;
	            var len;
	            var header;
	            var className;
	            for (i = 0, len = headerElements.length; i < len; i++) {
	                header = headerElements[i];
	                if (header.querySelector('[data-column="' + colId + '"]')) {
	                    className = header.className;
	                    if (className.indexOf('gc-pinned-left') >= 0) {
	                        return PINNED_COLUMN_HEADER;
	                    } else if (className.indexOf('gc-pinned-right') > 0) {
	                        return PINNED_RIGHT_COLUMN_HEADER;
	                    }
	                    return COLUMN_HEADER;
	                }
	            }
	            return null;
	        }
	
	        function getResizeElementSelector(hitInfo) {
	            var grid = this;
	            var mouseDownHitInfo = hitInfo ? hitInfo : grid.layoutEngine.mouseDownHitInfo_;
	            if (!mouseDownHitInfo) {
	                return;
	            }
	
	            var mouseHitArea = mouseDownHitInfo.area;
	            var selector = '#' + grid.uid + '-' + mouseHitArea;
	            if (mouseDownHitInfo.column >= 0) {
	                selector += ' [data-column="' + grid.columns[mouseDownHitInfo.column].id + '"]';
	            } else {
	                selector += ' [data-column-group-header="' + mouseDownHitInfo.columnGroupInfo.caption + '"]';
	            }
	
	            return selector;
	        }
	
	        function getResizeGraphic() {
	            var grid = this;
	            var id = grid.uid + '-resizeGraphic';
	            return document.getElementById(id);
	        }
	
	        function insertResizeGraphic(hitInfo) {
	            var self = this;
	            var selector = getResizeElementSelector.call(self, hitInfo);
	            var container = document.getElementById(self.uid);
	            var height = 24;
	            var width = 24;
	            self.layoutEngine.touchDownHitInfo_ = hitInfo;
	
	            if (selector) {
	                var element = document.querySelector(selector);
	                var eleRect = domUtil.getContentRect(element);
	                var containerRect = domUtil.getContentRect(container);
	                var left = eleRect.left - containerRect.left;
	                var top = eleRect.top - containerRect.top;
	                var id = self.uid + '-resizeGraphic';
	                var className = 'gc-resizeGraphic';
	                left = left + eleRect.width - width / 2;
	                var html = '<div id =' + id + ' class =' + className + ' style="position:absolute;height:' + height + 'px;width:' + width + 'px;left:' + left + 'px;top:' + top + 'px;"></div>';
	                container.appendChild(domUtil.createElement(html));
	            }
	        }
	
	        function updateResizeGraphics(offsetX) {
	            var grid = this;
	            var resizeGraphic = getResizeGraphic.call(grid);
	            if (resizeGraphic) {
	                var left = parseFloat(resizeGraphic.style.left);
	                resizeGraphic.style.left = (left + offsetX) + 'px';
	            }
	        }
	
	        function removeResizeGraphics() {
	            var self = this;
	            var resizeGraphic = getResizeGraphic.call(self);
	            if (resizeGraphic) {
	                var container = document.getElementById(self.uid);
	                container.removeChild(resizeGraphic);
	            }
	            self.touchDownHitInfo_ = null;
	        }
	
	        function setTemplateColumnWidth_(column, width) {
	            var self = this;
	            var cols = self.grid.columns;
	            var col = cols[column];
	            var colsResizeInfo = self.colsResizeInfo_;
	            var resizeInfo = colsResizeInfo[column];
	            var affectedCols = resizeInfo.affectedCols;
	            var shiftCols = resizeInfo.shiftCols;
	            var i;
	            var len;
	            var c;
	            var j;
	            var len2;
	            var widthOffset = width - col.visibleWidth;
	            var div = document.createElement('div');
	            div.innerHTML = getUserDefinedTemplate_.call(self, false);
	            var element = div.children[0];
	            var colElement;
	            var left;
	            for (i = 0, len = affectedCols.length; i < len; i++) {
	                c = affectedCols[i];
	                col = cols[c];
	                colElement = element.querySelector('[data-column="' + col.id + '"]');
	                if (colElement) {
	                    col.visibleWidth += widthOffset;
	                    col.width = col.visibleWidth;
	                    colElement.style.width = col.visibleWidth + 'px';
	                }
	            }
	
	            var parent = colElement.parentElement;
	            while (parent) {
	                if (parent.hasAttribute('data-column-group')) {
	                    width = parent.style.width;
	                    if (width) {
	                        parent.style.width = (parseInt(width) + widthOffset) + 'px';
	                    }
	                }
	                parent = parent.parentElement;
	            }
	
	            var parentShifted = [];
	            var affcols;
	            for (i = 0, len = shiftCols.length; i < len; i++) {
	                c = shiftCols[i];
	                col = cols[c];
	                colElement = element.querySelector('[data-column="' + col.id + '"]');
	                if (colElement) {
	                    left = colElement.style.left;
	                    if (left) {
	                        colElement.style.left = (parseInt(left) + widthOffset) + 'px';
	                    } else if (!parentShifted[c]) {
	                        //it don't have parent
	                        parent = colElement.parentElement;
	                        while (parent) {
	                            if (parent.hasAttribute('data-column-group')) {
	                                left = parent.style.left;
	                                if (left) {
	                                    parent.style.left = (parseInt(left) + widthOffset) + 'px';
	                                }
	                                parentShifted[c] = true;
	                                affcols = colsResizeInfo[c].affectedCols;
	                                for (j = 0, len2 = affcols.length; j < len2; j++) {
	                                    parentShifted[affcols[j]] = true;
	                                }
	                            }
	                            parent = parent.parentElement;
	                        }
	                    }
	                }
	            }
	            self.suspendTmplUpdate_ = true;
	            self.options.rowTemplate = element.outerHTML;
	            self.suspendTmplUpdate_ = false;
	        }
	
	        function initColsResizeInfo_() {
	            var self = this;
	            var cols = self.grid.columns;
	            var i;
	            var j;
	            var len = cols.length;
	            var col;
	
	            var divStr = '<div style="position:absolute;top:-10000px;-10000px;width:5000px;height:5000px;">';
	            var template = getUserDefinedTemplate_.call(self, false);
	            var element = domUtil.createTemplateElement(template);
	            divStr += element.innerHTML + '</div>';
	            var div = domUtil.createElement(divStr);
	            document.body.appendChild(div);
	
	            var colLayouts = [];
	            var colElement;
	            for (i = 0; i < len; i++) {
	                col = cols[i];
	                colElement = div.querySelector('[data-column="' + col.id + '"]');
	                if (colElement) {
	                    colLayouts[i] = {
	                        offset: domUtil.offset(colElement),
	                        rect: domUtil.getElementRect(colElement)
	                    };
	                }
	            }
	
	            self.colLayouts_ = colLayouts;
	            self.colsResizeInfo_ = [];
	
	            var colLayout;
	            var resizeColEndX;
	            var affectedCols;
	            var shiftCols;
	            var anotherColLayout;
	
	            for (i = 0; i < len; i++) {
	                col = cols[i];
	                colLayout = colLayouts[i];
	                if (colLayout) {
	                    resizeColEndX = colLayout.rect.width + colLayout.offset.left;
	                    affectedCols = [i];
	                    shiftCols = [];
	                    for (j = 0; j < len; j++) {
	                        if (j !== i) {
	                            anotherColLayout = colLayouts[j];
	                            if (col.visibleWidth > 0 && anotherColLayout) {
	                                if (resizeColEndX > anotherColLayout.offset.left && resizeColEndX <= (anotherColLayout.offset.left + anotherColLayout.rect.width)) {
	                                    affectedCols.push(j);
	                                } else if (anotherColLayout.offset.left >= resizeColEndX) {
	                                    shiftCols.push(j);
	                                }
	                            }
	                        }
	                    }
	                    self.colsResizeInfo_[i] = {
	                        affectedCols: affectedCols,
	                        shiftCols: shiftCols
	                    };
	                }
	            }
	            document.body.removeChild(div);
	        }
	
	        function handleTouchEnd_(sender, e) {
	            var agrs = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
	            if (handlePointerUp_.call(this, agrs, false)) {
	                e.handled = true;
	            }
	        }
	
	        function handleMouseUp_(e) {
	            handlePointerUp_.call(this, e, true);
	        }
	
	        function handlePointerUp_(e, mouseEvent) {
	            console.log('mouse up');
	            var self = this.layoutEngine;
	            var grid = self.grid;
	            var groupDes = grid.data.groupDescriptors.slice();
	            var needInvalidate = true;
	            var success;
	            var dragHitInfo;
	            var i;
	            var len;
	            var hitTestInfo = self.hitTestInfo_;
	            if (self.isDragDroping_) {
	                dragHitInfo = self.dragStartInfo_.hitTestInfo;
	                var field;
	                if (hitTestInfo && hitTestInfo.area === GROUP_DRAG_PANEL) {
	                    var to = getGroupInsertingLocation_.call(self, e.pageX, e.pageY);
	                    var groupingPanelInfo = self.hitTestInfo_.groupingPanelInfo;
	                    if ((dragHitInfo.area === COLUMN_HEADER || dragHitInfo.area === PINNED_COLUMN_HEADER || dragHitInfo.area === PINNED_RIGHT_COLUMN_HEADER) && dragHitInfo.column >= 0) {
	                        var newGorupColId = grid.columns[dragHitInfo.column].id;
	                        if (getGroupDescriptorIndex_(groupDes, newGorupColId) === -1) {
	                            groupDes.splice(to, 0, _.defaults({field: newGorupColId}, self.getGroupInfoDefaults_()));
	                            grid.data.groupDescriptors = groupDes;
	                        }
	                    } else if (dragHitInfo.area === GROUP_DRAG_PANEL && dragHitInfo.groupingPanelInfo) {
	                        var fromGroupField = dragHitInfo.groupingPanelInfo.field;
	                        field = groupingPanelInfo ? groupingPanelInfo.field : '';
	
	                        if (field === fromGroupField || (!field && groupDes[groupDes.length - 1].field === fromGroupField)) {
	                            needInvalidate = false;
	                        } else {
	
	                            len = groupDes.length;
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
	                                grid.data.groupDescriptors = groupDes;
	                            }
	                        }
	                    }
	                } else if (canReorderColumn_.call(self, hitTestInfo)) {
	                    dragHitInfo = self.dragStartInfo_.hitTestInfo;
	                    var pinned = 'none';
	                    if (hitTestInfo.area === PINNED_COLUMN_HEADER) {
	                        pinned = 'left';
	                    } else if (hitTestInfo.area === PINNED_RIGHT_COLUMN_HEADER) {
	                        pinned = 'right';
	                    }
	                    var template = getUserDefinedTemplate_.call(self, pinned);
	                    if (template) {
	                        reorderColumnsWidthTemplate_.call(self, template, dragHitInfo.columnGroupInfo && dragHitInfo.columnGroupInfo.caption, dragHitInfo.column, hitTestInfo.area, hitTestInfo.columnGroupInfo && hitTestInfo.columnGroupInfo.caption, hitTestInfo.column, true);
	                    } else {
	                        //update
	                        reorderColumns_.call(self, dragHitInfo.area, dragHitInfo.columnGroupInfo && dragHitInfo.columnGroupInfo.caption, dragHitInfo.column, hitTestInfo.area, hitTestInfo.columnGroupInfo && hitTestInfo.columnGroupInfo.caption, hitTestInfo.column, pinned, true);
	                    }
	                } else {  //remove grouping
	                    if (dragHitInfo.area === GROUP_DRAG_PANEL && dragHitInfo.groupingPanelInfo) {
	                        field = dragHitInfo.groupingPanelInfo.field;
	                    }
	                    if (field) {
	                        //self.grid.removeGroup(field);
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
	            } else if (self.isResizingCol_) {
	                self.resizingLastPoint_ = null;
	                grid.invalidate();
	            } else if (self.dragStartColumn_ || self.dragStartGroup_) {
	                if (hitTestInfo.area === TOOLPANEL) {
	                    processDragColumnInToolPanel.call(self, hitTestInfo);
	                    success = true;
	                }
	            }
	            if (mouseEvent) {
	                document.removeEventListener('mouseup', self.handleMouseUpFn_);
	            }
	            self.dragStartColumn_ = null;
	            self.dragStartGroup_ = null;
	            self.colsResizeInfo_ = null;
	            self.colLayouts_ = null;
	            self.isResizingCol_ = false;
	            self.mouseDownHitInfo_ = null;
	            self.mouseDownPoint_ = null;
	            self.isDragDroping_ = false;
	            self.dragStartInfo_ = null;
	            self.hitTestInfo_ = null;
	            return success;
	        }
	
	        function reorderColumnsWidthTemplate_(template, dragGroupCaption, dragColumn, dropArea, dropGroupCaption, dropColumn, insertBefore) {
	            var self = this;
	            var cols = self.grid.columns;
	            var div = document.createElement('div');
	            div.innerHTML = template;
	            var element = div.children[0];
	            var selector;
	            var originalCol;
	            var destCol;
	            if (dragColumn >= 0) {
	                selector = '[data-column="' + cols[dragColumn].id + '"]';
	                originalCol = element.querySelector(selector);
	            } else if (dragGroupCaption) {
	                selector = '[data-column-group-header="' + dragGroupCaption + '"]';
	                originalCol = element.querySelector(selector);
	                while (originalCol) {
	                    if (originalCol.hasAttribute('data-column-group')) {
	                        break;
	                    }
	                    originalCol = originalCol.parentNode;
	                }
	            }
	            if (dropColumn >= 0) {
	                selector = '[data-column="' + cols[dropColumn].id + '"]';
	                destCol = element.querySelector(selector);
	            } else if (dropGroupCaption) {
	                selector = '[data-column-group-header="' + dropGroupCaption + '"]';
	                destCol = element.querySelector(selector);
	                while (destCol) {
	                    if (destCol.hasAttribute('data-column-group')) {
	                        break;
	                    }
	                    destCol = destCol.parentNode;
	                }
	            }
	            //var cloneOriginalCol = originalCol.cloneNode(true);
	            //var cloneDestCol = destCol.cloneNode(true);
	            originalCol.parentNode.removeChild(originalCol);
	            if (insertBefore) {
	                destCol.parentNode.insertBefore(originalCol, destCol);
	            } else {
	                destCol.parentNode.insertBefore(originalCol, destCol.nextSibling);
	            }
	            self.suspendTmplUpdate_ = true;
	            if (dropArea === PINNED_COLUMN_HEADER) {
	                if (self.options.pinnedRowTemplate) {
	                    self.options.pinnedRowTemplate = element.outerHTML;
	                } else {
	                    self.options.rowTemplate = element.outerHTML;
	                }
	            } else {
	                self.options.rowTemplate = element.outerHTML;
	            }
	            self.suspendTmplUpdate_ = false;
	
	            if (dragColumn >= 0 && dropColumn >= 0) {
	                var temp = cols[dragColumn];
	                var dropColumnId = cols[dropColumn].id;
	                cols.splice(dragColumn, 1);
	                dropColumn = _.findIndex(cols, function(item) {
	                    return item.id === dropColumnId;
	                });
	                cols.splice(insertBefore ? dropColumn : dropColumn + 1, 0, temp);
	
	            }
	        }
	
	        function reorderColumns_(drapArea, dragGroupCaption, dragColumn, dropArea, dropGroupCaption, dropColumn, pinned, insertBefore) {
	            var self = this;
	            var grid = self.grid;
	            var cols = grid.columns;
	            var parents = [];
	            var colTree = grid.colTree_;
	            var temp;
	            temp = dragColumn >= 0 ? cols[dragColumn].id : dragGroupCaption;
	            if (grid.colTree_) {
	                var parent = colTree[temp].parent;
	                while (parent) {
	                    parents.push(parent);
	                    parent = colTree[parent].parent;
	                }
	            }
	            var i;
	
	            var root = grid.columnsConfig_;
	            var j;
	            var len2;
	            if (parents.length > 0) {
	                for (i = parents.length - 1; i >= 0; i--) {
	                    root = root.columns || root;
	                    for (j = 0, len2 = root.length; j < len2; j++) {
	                        if (root[j].caption === parents[i]) {
	                            root = root[j];
	                            break;
	                        }
	                    }
	                }
	            }
	
	            root = root.columns || root;
	            var index1 = _.findIndex(root, function(item) {
	                if (dragColumn >= 0) {
	                    return item.id === cols[dragColumn].id;
	                } else {
	                    return item.caption === dragGroupCaption;
	                }
	            });
	            temp = root[index1];
	            root.splice(index1, 1);
	            var index2 = _.findIndex(root, function(item) {
	                if (dropColumn >= 0) {
	                    return item.id === cols[dropColumn].id;
	                } else {
	                    return item.caption === dropGroupCaption;
	                }
	            });
	
	            if (index2 >= 0) {
	                root.splice(insertBefore ? index2 : index2 + 1, 0, temp);
	            } else {
	                root.push(temp);
	            }
	            if (drapArea !== dropArea) {
	                setColumnPinned_(temp, pinned);
	            }
	            grid.columns = grid.flatternColumns_(grid.columnsConfig_);
	        }
	
	        function setColumnPinned_(col, pinned) {
	            if (!col.columns) {
	                col.pinned = pinned;
	                return;
	            }
	            var i;
	            var len;
	            var cols = col.columns;
	            for (i = 0, len = cols.length; i < len; i++) {
	                setColumnPinned_(cols[i], pinned);
	            }
	        }
	
	        function inToolPanel_(e) {
	            var self = this;
	            var left = e.pageX;
	            var top = e.pageY;
	            var layoutInfo = self.getLayoutInfo();
	            var emptyLayout = {width: 0, height: 0, contentWidth: 0, contentHeight: 0};
	            var toolPanelLayout = layoutInfo[TOOLPANEL] || emptyLayout;
	            var containerInfo = self.grid.getContainerInfo_().contentRect;
	            var offsetLeft = left - containerInfo.left;
	            var offsetTop = top - containerInfo.top;
	            var point = {
	                left: offsetLeft,
	                top: offsetTop
	            };
	            return contains_(toolPanelLayout, point);
	        }
	
	        function handleMouseWheel(sender, e) {
	            var grid = sender;
	            var layoutEngine = grid.layoutEngine;
	            if (layoutEngine.options.showToolPanel && inToolPanel_.call(layoutEngine, e)) {
	                return;
	            }
	            if (!layoutEngine.showScrollPanel(VIEWPORT) && !layoutEngine.showScrollPanel(PINNED_RIGHT_VIEWPORT)) {
	                return;
	            }
	            e.preventDefault();
	            //simulate scroll
	            var offsetDeltaY = e.deltaY;
	            var offsetDeltaX = e.deltaX;
	            if (offsetDeltaY !== 0 || offsetDeltaX !== 0) {
	                /*jshint -W069 */
	                var layout = layoutEngine.getLayoutInfo()[VIEWPORT];
	                var maxOffsetTop = Math.max(layout.contentHeight + grid.options.colHeaderHeight - layout.height, 0);
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
	            console.log('mouse wheel');
	        }
	
	        function handleMouseClick_(sender, e, touchEvent) {
	            console.log('mouse click');
	            var self = sender.layoutEngine;
	            self.mouseDownPoint_ = null;
	            self.mouseDownHitInfo_ = null;
	            self.isDragDroping_ = false;
	            self.dragStartInfo_ = null;
	            self.hitTestInfo_ = self.hitTest(e);
	            var hitInfo = self.hitTestInfo_;
	            if (!hitInfo) {
	                return;
	            }
	            var hitArea = hitInfo.area;
	            var groupInfo;
	            var group;
	            var grid = self.grid;
	            var editingHandler = grid.editingHandler;
	
	            removeResizeGraphics.call(grid);
	            if (editingHandler.isEditing_ && !isEditingSameRow_(hitInfo, editingHandler.editingInfo_) && grid.hasEditAction_) {
	                return;
	            }
	            var actionHandler;
	            if (hitArea === VIEWPORT || hitArea === PINNED_VIEWPORT || hitArea === PINNED_RIGHT_VIEWPORT) {
	                actionHandler = hitInfo.action || null;
	            }
	            if (hitArea === GROUP_DRAG_PANEL) {
	                var groupingInfo = hitInfo.groupingPanelInfo;
	                if (groupingInfo) {
	                    if (groupingInfo.action === 'delete') {
	                        self.grid.data.groupDescriptors = _.remove(self.grid.data.groupDescriptors, function(info) {
	                            return info.field !== groupingInfo.field;
	                        });
	                    }
	                }
	            } else if (hitArea === COLUMN_HEADER || hitArea === PINNED_COLUMN_HEADER || hitArea === PINNED_RIGHT_COLUMN_HEADER) {
	                if (hitInfo.columnGroupInfo && hitInfo.columnGroupInfo.onExpandToggle) {
	                    var info = grid.colTree_[hitInfo.columnGroupInfo.caption];
	                    if (hitArea === COLUMN_HEADER) {
	                        info.status.isCollapsed = !info.status.isCollapsed;
	                    } else if (hitArea === PINNED_COLUMN_HEADER) {
	                        info.pinnedStatus.isCollapsed = !info.pinnedStatus.isCollapsed;
	                    } else {
	                        info.pinnedRightStatus.isCollapsed = !info.pinnedRightStatus.isCollapsed;
	                    }
	                    grid.invalidate();
	                } else {
	                    handleClickColHeader_.call(self, hitInfo);
	                }
	
	                if (((hitInfo.headerInfo && hitInfo.column > -1) || hitInfo.columnGroupInfo) && touchEvent) {
	                    insertResizeGraphic.call(grid, hitInfo);
	                }
	            } else if (hitArea === VIEWPORT || hitArea === PINNED_VIEWPORT || hitArea === PINNED_RIGHT_VIEWPORT) {
	                groupInfo = self.hitTestInfo_.groupInfo;
	                if (hitInfo.groupInfo && hitInfo.groupInfo.area === GROUP_HEADER) {
	                    if (groupInfo && groupInfo.onExpandToggle) {
	                        group = grid.getGroupInfo_(groupInfo.path).data;
	                        group.collapsed = !group.collapsed;
	                        grid.invalidate();
	                    }
	                } else if (hitInfo.groupInfo && hitInfo.groupInfo.area === GROUP_CONTENT) {
	                    actionHandler = hitInfo.groupInfo.action || null;
	                }
	
	                if (hitInfo.inTreeNode || (groupInfo && groupInfo.inTreeNode)) {
	                    updateTreeNode(self);
	                    grid.invalidate();
	                    return;
	                } else if (!editingHandler.isEditing_) {
	                    updateSelection(self);
	                }
	                //var dataItem = grid.getDataItem2_(hitInfo.groupInfo ? grid.getGroupInfo_(hitInfo.groupInfo.path).data : null, hitInfo.groupInfo ? hitInfo.groupInfo.row : hitInfo.row);
	                if (actionHandler) {
	                    actionHandler({
	                        gridModel: grid,
	                        hitInfo: hitInfo,
	                        dataItem: getDataItem.call(self.grid, hitInfo),
	                        closeActionColumnPanel: closeTouchPanel.bind(grid)
	                    });
	                }
	            } else if (hitArea === ROW_HEADER || hitArea === CORNER_HEADER) {
	                if (hitInfo.checked || (hitInfo.groupInfo && hitInfo.groupInfo.checked)) {
	                    updateSelection(self);
	                }
	            } else if (hitArea === TOOLPANEL) {
	                var colId = hitInfo.columnListInfo && hitInfo.columnListInfo.column;
	                var groupId = hitInfo.groupListInfo && hitInfo.groupListInfo.group;
	                if (colId && hitInfo.columnListInfo.action === 'visible') {
	                    var col = grid.getColById_(colId);
	                    col.visible = !col.visible;
	                    grid.invalidate();
	                } else if (hitInfo.columnListInfo && hitInfo.columnListInfo.action === 'showAddColumnWindow') {
	                    var editPopupOverlay = domUtil.createElement('<div class="gc-editing-overlay"></div>');
	                    var editContainer = domUtil.createElement('<div id="' + grid.uid + '-popup-addColumn" class="gc-popup-add-column gc-editing-area">' +
	                        '<div class="gc-popup-header"><span class="header-text">Add column</span><div class="gc-editing-close"><span class="gc-icon close-icon"></span></div></div>' +
	                        '<div class="gc-popup-content">' + '<textarea style="width:100%" rows="3" placeholder="input column or column array JSON object"></textarea><span class="error-text"><span>' + '</div>' +
	                        '<div class="gc-popup-footer"><div class="gc-editing-cancel gc-editing-button"><span class="cancel-text">Cancel</span></div><div class="gc-editing-update gc-editing-button"><span class="update-text">Add</span></div></div></div>');
	                    self.addColumnWindowMouseDownHandler_ = addColumnWindowMouseDownHandler.bind(self);
	                    document.addEventListener('click', self.addColumnWindowMouseDownHandler_);
	                    document.body.appendChild(editContainer);
	                    document.body.appendChild(editPopupOverlay);
	                    var containerRect = domUtil.getElementRect(editContainer);
	                    var left = parseInt((window.innerWidth - containerRect.width) / 2 + window.pageXOffset);
	                    var top = parseInt((window.innerHeight - containerRect.height) / 2 + window.pageYOffset);
	                    domUtil.setCss(editContainer, {
	                        left: left,
	                        top: top
	                    });
	                } else if (groupId && hitInfo.groupListInfo.action === 'removeGroup') {
	                    var tempGroupDes = grid.data.groupDescriptors.slice();
	                    tempGroupDes.splice(getGroupDescriptorIndex_(tempGroupDes, groupId), 1);
	                    grid.data.groupDescriptors = tempGroupDes;
	                }
	
	                var selectedElement = grid.container.querySelector('.gc-tool-panel-container .selected');
	                if (selectedElement) {
	                    selectedElement.className = selectedElement.className.replace('select', '');
	                }
	            }
	            //processDragColumnInToolPanel.call(self, hitInfo);
	        }
	
	        function processDragColumnInToolPanel(hitInfo) {
	            var self = this;
	            var grid = self.grid;
	            var tempGroupDes;
	            var dragColId = self.dragStartColumn_;
	            var dragGroupId = self.dragStartGroup_;
	            self.dragStartColumn_ = null;
	            self.dragStartGroup_ = null;
	            var colId = hitInfo.columnListInfo && hitInfo.columnListInfo.column;
	            var groupId = hitInfo.groupListInfo && hitInfo.groupListInfo.group;
	            if (colId) {
	                if (dragColId && dragColId !== colId) {
	                    var dropElement = grid.container.querySelector('.gc-tool-panel-container .column-list [data-col-id="' + colId + '"]');
	                    var className = dropElement.className;
	                    var dropColumn = grid.getColById_(colId);
	                    var pinned = dropColumn.pinned;
	                    var template = getUserDefinedTemplate_.call(self, pinned);
	                    if (template) {
	                        if (className.indexOf('drop-above') >= 0) {
	                            reorderColumnsWidthTemplate_.call(self, template, null, getColIndex_.call(self, dragColId), getColumnArea_.call(self, colId), null, getColIndex_.call(self, colId), true);
	                        } else if (className.indexOf('drop-below') >= 0) {
	                            reorderColumnsWidthTemplate_.call(self, template, null, getColIndex_.call(self, dragColId), getColumnArea_.call(self, colId), null, getColIndex_.call(self, colId), false);
	                        }
	                    } else {
	                        if (className.indexOf('drop-above') >= 0) {
	                            reorderColumns_.call(self, getColumnArea_.call(self, dragColId), null, getColIndex_.call(self, dragColId), getColumnArea_.call(self, colId), null, getColIndex_.call(self, colId), pinned, true);
	                        } else if (className.indexOf('drop-below') >= 0) {
	                            reorderColumns_.call(self, getColumnArea_.call(self, dragColId), null, getColIndex_.call(self, dragColId), getColumnArea_.call(self, colId), null, getColIndex_.call(self, colId), pinned, false);
	                        }
	                    }
	                    grid.invalidate();
	                }
	            } else if (dragColId && hitInfo.groupListInfo) {
	                if (getGroupDescriptorIndex_(grid.data.groupDescriptors, dragColId) === -1) {
	                    tempGroupDes = grid.data.groupDescriptors.slice();
	                    tempGroupDes.push(_.defaults({field: dragColId}, self.getGroupInfoDefaults_()));
	                    grid.data.groupDescriptors = tempGroupDes;
	                }
	            } else if (dragGroupId && hitInfo.groupListInfo) {
	                if (dragGroupId !== groupId && groupId !== null) {
	                    var dropGroupElement = grid.container.querySelector('.gc-tool-panel-container .group-list [data-group-id="' + groupId + '"]');
	                    var dropGroupElementClassName = dropGroupElement.className;
	                    tempGroupDes = grid.data.groupDescriptors.slice();
	                    var targetItem = tempGroupDes.splice(getGroupDescriptorIndex_(tempGroupDes, dragGroupId), 1)[0];
	                    var insertIndex = getGroupDescriptorIndex_(tempGroupDes, groupId);
	                    if (dropGroupElementClassName.indexOf('drop-above') >= 0) {
	                        tempGroupDes.splice(insertIndex, 0, targetItem);
	                    } else if (dropGroupElementClassName.indexOf('drop-below') >= 0) {
	                        tempGroupDes.splice(insertIndex + 1, 0, targetItem);
	                    }
	                    grid.data.groupDescriptors = tempGroupDes;
	                    grid.invalidate();
	                }
	            }
	            var selectedElement = grid.container.querySelector('.gc-tool-panel-container .selected');
	            if (selectedElement) {
	                selectedElement.className = selectedElement.className.replace('select', '');
	            }
	            var groupListElement = grid.container.querySelector('.gc-tool-panel-container .group-list');
	            groupListElement.className = groupListElement.className.replace('drag-over', '');
	        }
	
	        function removeAddColumnWindow_() {
	            var self = this;
	            var overlay = document.querySelector('.gc-editing-overlay');
	            document.body.removeChild(overlay);
	            var editorForm = document.getElementById(self.grid.uid + '-popup-addColumn');
	            document.body.removeChild(editorForm);
	            document.removeEventListener('click', self.addColumnWindowMouseDownHandler_);
	            self.addColumnWindowMouseDownHandler_ = null;
	        }
	
	        function addColumnWindowMouseDownHandler(e) {
	            var self = this;
	            var grid = self.grid;
	            var curTarget = e.target;
	            var className = curTarget.className;
	            var tagName = curTarget.tagName.toLowerCase();
	            var arr = className ? className.split(' ') : [];
	            while (tagName !== 'body') {
	                if (arr.indexOf('gc-editing-close') !== -1) {
	                    removeAddColumnWindow_.call(self);
	                    break;
	                } else if (arr.indexOf('gc-editing-update') !== -1) {
	                    try {
	                        var editTextarea = document.querySelector('#' + self.grid.uid + '-popup-addColumn textarea');
	                        var columns = JSON.parse(editTextarea.value);
	                        removeAddColumnWindow_.call(self);
	                        grid.insertColumns_(columns);
	                    } catch (err) {
	                        var errorSpan = document.querySelector('#' + self.grid.uid + '-popup-addColumn .error-text');
	                        errorSpan.textContent = 'input is not a valid JSON object';
	                    }
	                    break;
	                } else if (arr.indexOf('gc-editing-cancel') !== -1) {
	                    removeAddColumnWindow_.call(self);
	                    break;
	                } else if (arr.indexOf('gc-popup-header') !== -1) {
	                    var container = document.getElementById(grid.uid + '-popup-addColumn');
	                    if (container) {
	                        self.addColumnWindowMouseMoveHandler_ = addColumnWindowMouseMoveHandler_.bind(self);
	                        self.addColumnWindowMouseUpHandler_ = addColumnWindowMouseUpHandler_.bind(self);
	                        document.addEventListener('mousemove', self.addColumnWindowMouseMoveHandler_);
	                        document.addEventListener('mouseup', self.addColumnWindowMouseUpHandler_);
	                        var containerOffset = domUtil.offset(container);
	                        var containerStyle = domUtil.getStyle(container);
	                        var containerMarginTop = parseFloat(containerStyle.getPropertyValue('margin-top'));
	                        var containerMarginLeft = parseFloat(containerStyle.getPropertyValue('margin-left'));
	                        self.startMoveInfo_ = {
	                            mouseOffset: {
	                                left: e.pageX,
	                                top: e.pageY
	                            },
	                            containerOffset: {
	                                left: containerOffset.left - containerMarginLeft,
	                                top: containerOffset.top - containerMarginTop
	                            }
	                        };
	                    }
	                    break;
	                }
	                curTarget = curTarget.parentNode;
	                tagName = curTarget.tagName.toLowerCase();
	                className = curTarget.className;
	                arr = className ? className.split(' ') : [];
	            }
	        }
	
	        function addColumnWindowMouseUpHandler_() {
	            var self = this;
	            self.startMoveInfo_ = null;
	            document.removeEventListener('mousemove', self.addColumnWindowMouseMoveHandler_);
	            document.removeEventListener('mouseup', self.addColumnWindowMouseUpHandler_);
	            self.documentMouseMoveHandler_ = null;
	            self.documentMouseUpHandler_ = null;
	        }
	
	        function addColumnWindowMouseMoveHandler_(e) {
	            var self = this;
	            var info = self.startMoveInfo_;
	            if (info) {
	                var container = document.getElementById(self.grid.uid + '-popup-addColumn');
	                var mouseOffset = info.mouseOffset;
	                var containerOffset = info.containerOffset;
	                domUtil.setCss(container, {
	                    'left': containerOffset.left + (e.pageX - mouseOffset.left),
	                    'top': containerOffset.top + (e.pageY - mouseOffset.top)
	                });
	            }
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
	
	        function handleTouchTap(sender, e) {
	            handleMouseClick_(sender, e, true);
	        }
	
	        function handleTouchScroll() {
	            var self = this;
	            self.stopEditing();
	            closeTouchPanel.call(self);
	            removeResizeGraphics.call(self);
	        }
	
	        function handleSwipe_(sender, e) {
	            var self = this;
	            var layoutEngine = sender.layoutEngine;
	            var relatedRow;
	
	            if (e.swipeStatus === 'swipestart') {
	                var hitTestInfo_ = layoutEngine.hitTest({
	                    pageX: e.targetTouches[0].pageX,
	                    pageY: e.targetTouches[0].pageY
	                });
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
	
	                    if (getTouchPanel()) {
	                        swipeStatus.beginWithTouchPanel = true;
	                    }
	                }
	            } else if (e.swipeStatus === 'swipemoving') {
	                if (swipeStatus.row) {
	                    swipeStatus.moveDistance = e.moveDistance + (swipeStatus.beginWithTouchPanel ? (swipeStatus.actionType === 'left' ? 1 : -1) * swipeStatus.columnsTotalWidth : 0);
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
	                    swipeStatus.moveDistance = e.moveDistance + (swipeStatus.beginWithTouchPanel ? (swipeStatus.actionType === 'left' ? 1 : -1) * swipeStatus.columnsTotalWidth : 0);
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
	
	        function getActionType(moveDistance) {
	            var actionPanel;
	            var acType;
	            _.each(['left', 'right'], function(actionType) {
	                actionPanel = document.getElementById(swipeStatus.row.id + '-' + actionType + '-actionPanel');
	                if (actionPanel) {
	                    acType = actionType;
	                }
	            });
	
	            if (!acType) {
	                acType = moveDistance > 0 ? 'left' : 'right';
	            }
	
	            return acType;
	        }
	
	        function getTouchPanel() {
	            if (swipeStatus.row) {
	                return document.getElementById(swipeStatus.row.id + '-left-actionPanel') || document.getElementById(swipeStatus.row.id + '-right-actionPanel');
	            }
	        }
	
	        function isReverseMove() {
	            return (swipeStatus.moveDistance > 0 ? 'left' : 'right') !== swipeStatus.actionType;
	        }
	
	        function refreshActionRow(rowleft, panelWidth, useAnimation, velocity) {
	            var self = this;
	
	            if (!swipeStatus.row) {
	                return;
	            }
	
	            if (useAnimation) {
	                var currentRowleft = parseFloat(swipeStatus.row.style.left);
	                var touchPanel = document.getElementById(swipeStatus.row.id + '-' + swipeStatus.actionType + '-actionPanel');
	                var currentPanelWidth = touchPanel ? parseFloat(touchPanel.style.width) : 0;
	
	                var rowOffset = rowleft - currentRowleft;
	                var panelOffset = panelWidth - currentPanelWidth;
	                var duration = 0.25 * (1 / velocity);
	                duration = duration > 0.10 ? 0.10 : duration;
	
	                ani.play(duration, function(p) {
	                    updateRow.call(self, rowOffset * p + currentRowleft);
	                    updateTouchPanel.call(self, panelOffset * p + currentPanelWidth);
	                });
	            } else {
	                updateRow.call(self, rowleft);
	                updateTouchPanel.call(self, panelWidth);
	            }
	        }
	
	        function updateRow(newleft) {
	            var self = this;
	            var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	            swipeStatus.row.style.left = newleft + 'px';
	            if (newleft > 0) {
	                swipeStatus.row.style['border-right'] = '1px solid rgba(0, 0, 0, 0.2)';
	                swipeStatus.row.style.overflow = 'hidden';
	                swipeStatus.row.style.width = (layoutInfo.contentWidth - newleft) + 'px';
	            } else {
	                swipeStatus.row.style.removeProperty('border-right');
	                swipeStatus.row.style.removeProperty('overflow');
	                swipeStatus.row.style.removeProperty('width');
	            }
	        }
	
	        function updateTouchPanel(panelWidth) {
	            var self = this;
	            if (gcUtils.isNumber(panelWidth)) {
	                var viewPort = document.getElementById(self.uid + '-viewport-inner');
	                var actionPanel = document.getElementById(swipeStatus.row.id + '-' + swipeStatus.actionType + '-actionPanel');
	
	                if (actionPanel) {
	                    viewPort.removeChild(actionPanel);
	                }
	
	                if (panelWidth > 0) {
	                    viewPort.appendChild(createColumnTouchPanel.call(self, panelWidth));
	                }
	            }
	        }
	
	        function closeTouchPanel() {
	            var self = this;
	            ani.stop();
	            refreshActionRow.call(self, 0, 0);
	            swipeStatus = {};
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
	
	        function hasGroup_(grid) {
	            return grid.data.groups && grid.data.groups.length > 0;
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
	
	        function canStartDraging_(hitTestInfo) {
	            var self = this;
	            var grid = self.grid;
	            var data;
	            var column;
	            var groupDescriptors;
	            var area;
	            if (hitTestInfo) {
	                area = hitTestInfo.area;
	                if (area === GROUP_DRAG_PANEL) {
	                    return true;
	                } else if ((area === COLUMN_HEADER || area === PINNED_COLUMN_HEADER || area === PINNED_RIGHT_COLUMN_HEADER) && (hitTestInfo.column >= 0 || (hitTestInfo.columnGroupInfo && hitTestInfo.columnGroupInfo.caption))) {
	                    if (self.options.allowColumnReorder) {
	                        return true;
	                    }
	                    data = grid.data;
	                    groupDescriptors = data.groupDescriptors;
	                    column = grid.columns[hitTestInfo.column];
	                    var grouped = !!_.find(groupDescriptors, _.matchesProperty('field', column.id));
	                    return grouped ? false : !!(column.hasOwnProperty('allowGrouping') ? column.allowGrouping : this.grid.options.allowGrouping);
	                }
	            }
	            return false;
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
	                setAllStatus_(self, false, VIEWPORT);
	                if (self.hasLeftPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_VIEWPORT);
	                }
	                if (self.hasRightPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_RIGHT_VIEWPORT);
	                }
	            } else if (selModeOpt === SelectMode.SINGLE) {
	                targetElement = getCheckElement_(self, hitInfo);
	                if (hitInfo.area === CORNER_HEADER || (groupHitInfo && groupHitInfo.area === GROUP_HEADER)) {
	                    setCheckElementSelect_(targetElement, false);
	                    return;
	                }
	                if (!isNaN(srcRow) && selectedRows.indexOf(srcRow) === -1) {
	                    selectedRows.length = 0;
	                    selectedRows.push(srcRow);
	                    setAllStatus_(self, false, VIEWPORT);
	                    var element = getRowElement_(self, viewRow, groupHitInfo, VIEWPORT);
	                    setRowElementSelect_(element, true);
	                    if (self.hasLeftPinnedColumn_) {
	                        setAllStatus_(self, false, PINNED_VIEWPORT);
	                        element = getRowElement_(self, viewRow, hitInfo.groupInfo, PINNED_VIEWPORT);
	                        setRowElementSelect_(element, true);
	                    }
	                    if (self.hasRightPinnedColumn_) {
	                        setAllStatus_(self, false, PINNED_RIGHT_VIEWPORT);
	                        element = getRowElement_(self, viewRow, hitInfo.groupInfo, PINNED_RIGHT_VIEWPORT);
	                        setRowElementSelect_(element, true);
	                    }
	                }
	                setCheckElementSelect_(targetElement, true);
	            } else {
	                if (hitInfo.area === CORNER_HEADER) {
	                    checked = selectedRows.length === self.grid.data.itemCount;
	                    selectedRows.length = 0;
	                    if (!checked) {
	                        for (i = 0, length = self.grid.data.sourceCollection.length; i < length; i++) {
	                            selectedRows.push(i);
	                        }
	                    }
	                    setAllStatus_(self, !checked, VIEWPORT);
	                    if (self.hasLeftPinnedColumn_) {
	                        setAllStatus_(self, !checked, PINNED_VIEWPORT);
	                    }
	                    if (self.hasRightPinnedColumn_) {
	                        setAllStatus_(self, !checked, PINNED_RIGHT_VIEWPORT);
	                    }
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
	            var row = viewRow;
	            if (selModeOpt === SelectMode.NONE) {
	                selectedRows.length = 0;
	                setAllStatus_(self, false, VIEWPORT);
	                if (self.hasLeftPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_VIEWPORT);
	                }
	                if (self.hasRightPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_RIGHT_VIEWPORT);
	                }
	            } else if (selModeOpt === SelectMode.MULTIPLE) {
	                var itemIndex = selectedRows.indexOf(srcRow);
	                element = getRowElement_(self, row, groupHitInfo, VIEWPORT);
	                if (domUtil.hasClass(element, 'gc-selected')) {
	                    selectedRows.splice(itemIndex, 1);
	                    setRowElementSelect_(element, false);
	                } else {
	                    if (itemIndex < 0) {
	                        selectedRows.push(srcRow);
	                        setRowElementSelect_(element, true);
	                    }
	                }
	                if (self.hasLeftPinnedColumn_) {
	                    element = getRowElement_(self, row, groupHitInfo, PINNED_VIEWPORT);
	                    if (domUtil.hasClass(element, 'gc-selected')) {
	                        setRowElementSelect_(element, false);
	                    } else {
	                        if (itemIndex < 0) {
	                            setRowElementSelect_(element, true);
	                        }
	                    }
	                }
	                if (self.hasRightPinnedColumn_) {
	                    element = getRowElement_(self, row, groupHitInfo, PINNED_RIGHT_VIEWPORT);
	                    if (domUtil.hasClass(element, 'gc-selected')) {
	                        setRowElementSelect_(element, false);
	                    } else {
	                        if (itemIndex < 0) {
	                            setRowElementSelect_(element, true);
	                        }
	                    }
	                }
	            } else {
	                selectedRows.length = 0;
	                selectedRows.push(srcRow);
	                setAllStatus_(self, false, VIEWPORT);
	                element = getRowElement_(self, row, groupHitInfo, VIEWPORT);
	                setRowElementSelect_(element, true);
	                if (self.hasLeftPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_VIEWPORT);
	                    element = getRowElement_(self, row, groupHitInfo, PINNED_VIEWPORT);
	                    setRowElementSelect_(element, true);
	                }
	                if (self.hasRightPinnedColumn_) {
	                    setAllStatus_(self, false, PINNED_RIGHT_VIEWPORT);
	                    element = getRowElement_(self, row, groupHitInfo, PINNED_RIGHT_VIEWPORT);
	                    setRowElementSelect_(element, true);
	                }
	
	            }
	        }
	
	        //TODO: iterate all is not very efficient
	        function setAllStatus_(layoutEngine, status, area) {
	            var self = layoutEngine;
	            var i;
	            var length;
	            if (self.options.allowHeaderSelect) {
	                var rowCheckElements = self.grid.container.querySelectorAll('.gc-header-select-icon');
	                for (i = 0, length = rowCheckElements.length; i < length; i++) {
	                    setCheckElementSelect_(rowCheckElements[i], status);
	                }
	            }
	            var viewport = document.getElementById(self.grid.uid + '-' + area + '-inner');
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
	                rowElement = getRowElement_(self, hitInfo.row, null, VIEWPORT);
	                setRowElementSelect_(rowElement, checkedStatus);
	                if (self.hasLeftPinnedColumn_) {
	                    rowElement = getRowElement_(self, hitInfo.row, null, PINNED_VIEWPORT);
	                    setRowElementSelect_(rowElement, checkedStatus);
	                }
	                if (self.hasRightPinnedColumn_) {
	                    rowElement = getRowElement_(self, hitInfo.row, null, PINNED_RIGHT_VIEWPORT);
	                    setRowElementSelect_(rowElement, checkedStatus);
	                }
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
	                    rowElement = getRowElement_(self, null, groupHitInfo, VIEWPORT);
	                    setRowElementSelect_(rowElement, checkedStatus);
	                    if (self.hasLeftPinnedColumn_) {
	                        rowElement = getRowElement_(self, hitInfo.row, null, PINNED_VIEWPORT);
	                        setRowElementSelect_(rowElement, checkedStatus);
	                    }
	                    if (self.hasRightPinnedColumn_) {
	                        rowElement = getRowElement_(self, hitInfo.row, null, PINNED_RIGHT_VIEWPORT);
	                        setRowElementSelect_(rowElement, checkedStatus);
	                    }
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
	                                    if (self.hasLeftPinnedColumn_) {
	                                        rowElement = document.getElementById(uid + '-pgr' + path.join('_') + '-r' + i);
	                                        setRowElementSelect_(rowElement, checkedStatus);
	                                    }
	                                    if (self.hasRightPinnedColumn_) {
	                                        rowElement = document.getElementById(uid + '-prgr' + path.join('_') + '-r' + i);
	                                        setRowElementSelect_(rowElement, checkedStatus);
	                                    }
	                                }
	                            }
	                        }
	                    } else {
	                        for (i = 0, length = currentGroupInfo.data.itemCount; i < length; i++) {
	                            targetElement = document.getElementById(uid + '-grh' + currentGroupInfo.path.join('-') + '-r' + i + '-select');
	                            setCheckElementSelect_(targetElement, checkedStatus);
	                            rowElement = document.getElementById(uid + '-gr' + currentGroupInfo.path.join('_') + '-r' + i);
	                            setRowElementSelect_(rowElement, checkedStatus);
	                            if (self.hasLeftPinnedColumn_) {
	                                rowElement = document.getElementById(uid + '-pgr' + currentGroupInfo.path.join('_') + '-r' + i);
	                                setRowElementSelect_(rowElement, checkedStatus);
	                            }
	                            if (self.hasRightPinnedColumn_) {
	                                rowElement = document.getElementById(uid + '-prgr' + currentGroupInfo.path.join('_') + '-r' + i);
	                                setRowElementSelect_(rowElement, checkedStatus);
	                            }
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
	
	        function getRowElement_(layoutEngine, row, groupInfo, area) {
	            var self = layoutEngine;
	            var uid = self.grid.uid;
	            var selector;
	            var prefix = area === PINNED_VIEWPORT ? 'p' : (area === PINNED_RIGHT_VIEWPORT ? 'pr' : '');
	            if (!groupInfo) {
	                if (row >= 0) {
	                    selector = uid + '-' + prefix + 'r' + row;
	                }
	            } else {
	                if (groupInfo.area === GROUP_CONTENT && groupInfo.row >= 0) {
	                    selector = uid + '-' + prefix + 'gr' + groupInfo.path.join('_') + '-r' + groupInfo.row;
	                } else if (groupInfo.area === GROUP_FOOTER) {
	                    selector = uid + '-' + prefix + 'gf' + groupInfo.path.join('_');
	                } else if (groupInfo.area === GROUP_HEADER) {
	                    selector = uid + '-' + prefix + 'gh' + groupInfo.path.join('_');
	                }
	            }
	            return selector ? document.getElementById(selector) : null;
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
	
	        function formatValue(value, format, formula) {
	            var self = this;
	            var Sparkline = gcUtils.findPlugin('Sparkline');
	            if (Sparkline && value instanceof Sparkline.BaseSparkline) {
	                var containerHeight = self.options.rowHeight;
	                return '<span data-formula=\'' + formula + '\' class="gc-group-sparkline" style="position:relative;display:inline-block;vertical-align:middle;width:' + containerHeight * 4 + 'px;height:' + containerHeight + 'px;"></span>';
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
	
	        function isEditingSameRow_(hitInfo, editingInfo) {
	            return hitInfo.groupInfo ?
	                (hitInfo.groupInfo.group === editingInfo.groupInfo.path && hitInfo.groupInfo.row === editingInfo.rowIndex) :
	            hitInfo.row === editingInfo.rowIndex;
	        }
	
	        module.exports = GridLayoutEngine;
	    }
	    ()
	)
	;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
	    var CalcCommon = __webpack_require__(9); // jshint ignore:line
	    //var CalcFunctions = require('./functions'); // jshint ignore:line
	    var CalcContext = __webpack_require__(10);
	    var CalcParser = __webpack_require__(11);
	    var CalcExpressions = __webpack_require__(12);
	    var CalcEvaluator = __webpack_require__(13);
	    var CalcHelper = __webpack_require__(14); // jshint ignore:line
	    var CalcManager = __webpack_require__(15);
	    var CalcModels = __webpack_require__(16); // jshint ignore:line
	    var CalcSource = __webpack_require__(17);
	    var CalcCollections = __webpack_require__(18);
	    var CalcFunctions = __webpack_require__(19);
	
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
/* 8 */
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
	    var SR = __webpack_require__(20);
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
/* 11 */
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
	    var Calc = __webpack_require__(9);
	    var CalcExpressions = __webpack_require__(12);
	    var CalcContext = __webpack_require__(10);
	    var CalcFunctions = __webpack_require__(19);
	
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
/* 12 */
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
	    var Calc = __webpack_require__(9);
	
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
/* 13 */
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
	
	    var Calc = __webpack_require__(9);
	    var CalcExpressions = __webpack_require__(12);
	    var CalcParser = __webpack_require__(11);
	    var CalcHelper = __webpack_require__(14);
	    var CalcFunctions = __webpack_require__(19);
	
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
/* 14 */
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
	    var Calc = __webpack_require__(9);
	    var CalcExpressions = __webpack_require__(12);
	    var CalcFunctions = __webpack_require__(19);
	
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
/* 15 */
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
	    var CalcSource = __webpack_require__(17).CalcSource;
	    var CalcContext = __webpack_require__(10);
	    //var CalcModels = require('./calcModels');
	    var CalcHelper = __webpack_require__(14);
	
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
/* 16 */
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
	    var CalcHelper = __webpack_require__(14);
	    var CalcContext = __webpack_require__(10);
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
/* 17 */
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
	    var Calc = __webpack_require__(9);
	    var CalcModels = __webpack_require__(16);
	    var CalcHelper = __webpack_require__(14);
	    var CalcEvaluator = __webpack_require__(13);
	    var CalcParser = __webpack_require__(11).Parser;
	    var CalcContext = __webpack_require__(10);
	
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
/* 18 */
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
	    var CalcSource = __webpack_require__(17);
	    var CalcModels = __webpack_require__(16);
	
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	    'use strict';
	
	    module.exports = {
	        Functions: {}
	    };
	}());


/***/ },
/* 20 */
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
