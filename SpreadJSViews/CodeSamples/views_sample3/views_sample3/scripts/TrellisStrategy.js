(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["TrellisStrategy"] = factory();
	else
		root["GcSpread"] = root["GcSpread"] || {}, root["GcSpread"]["Views"] = root["GcSpread"]["Views"] || {}, root["GcSpread"]["Views"]["GcGrid"] = root["GcSpread"]["Views"]["GcGrid"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"] = root["GcSpread"]["Views"]["GcGrid"]["Plugins"] || {}, root["GcSpread"]["Views"]["GcGrid"]["Plugins"]["TrellisStrategy"] = factory();
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
	    var domUtil = __webpack_require__(3);
	    var doT = __webpack_require__(2);
	    var TouchWrapper = __webpack_require__(4);
	    var VIEWPORT = 'viewport';
	    var GROUP_HEADER = 'groupHeader';
	    //var GROUP_FOOTER = 'groupFooter';
	    var GROUP_CONTENT = 'groupContent';
	    var VERTICAL = 'vertical';
	    var HORIZONTAL = 'horizontal';
	    var STARTDRAG = 'startdrag';
	    var DRAGMOVING = 'dragmoving';
	    var MARGIN_TOP = 'margin-top';
	    var MARGIN_LEFT = 'margin-left';
	    // var MARGIN_BOTTOM = 'margin-bottom';
	    var DEFAULTLAYOUT = {
	        columnSpan: 1,
	        direction: HORIZONTAL
	    };
	
	    var TrellisStrategy = function(options) {
	        var self = this;
	        var defaults = {
	            itemWidth: 150,
	            gapSize: 4
	        };
	        self.name = 'TrellisStrategy'; //name must end with LayoutEngine
	        self.options = _.defaults(options || {}, defaults);
	    };
	
	    TrellisStrategy.prototype = {
	        init: function(grid) {
	            var self = this;
	            self.grid = grid;
	
	            self.handleMouseMoveFn_ = handleMouseMove.bind(grid);
	            self.handleTouchStartFn_ = handleTouchStart.bind(grid);
	            self.handleTouchMoveFn_ = handleTouchMove.bind(grid);
	            self.handleTouchEndFn_ = handleTouchEnd.bind(grid);
	            grid.onMouseDown.addHandler(handleMouseDown);
	            grid.onMouseWheel.addHandler(handleMouseWheel);
	            grid.onMouseMove.addHandler(self.handleMouseMoveFn_);
	            grid.onTouchStart_.addHandler(self.handleTouchStartFn_);
	
	            //var element = domUtil.createElement('<div class="gc-trellis-group-item" style="position:absolute;left:9999px;height:9999px;"></div>');
	            //document.body.appendChild(element);
	            //var elementStyle = domUtil.getStyle(element);
	            //document.body.removeChild(element);
	        },
	
	        getLayoutInfo: function() {
	            var r = {};
	            r[VIEWPORT] = getViewportLayoutInfo_(this);
	            return r;
	        },
	
	        getRenderInfo: function(options) {
	            var self = this;
	            var groups = self.grid.data.groups;
	            if (!groups || groups.length <= 0) {
	                return null;
	            }
	            var includeRows = options.includeRows || true;
	            var offsetTop = options.offsetTop;
	            var layout = getViewportLayoutInfo_(self);
	
	            var outerDivStyle = {
	                position: 'absolute',
	                left: layout.left,
	                top: layout.top,
	                height: layout.height,
	                width: layout.width,
	                overflow: 'hidden'
	            };
	            var innerDivStyle = {
	                position: 'relative',
	                height: layout.contentHeight - (offsetTop < 0 ? offsetTop : 0),
	                width: layout.contentWidth
	            };
	            var r = {
	                outerDivCssClass: 'gc-viewport gc-trellis-viewport',
	                outerDivStyle: outerDivStyle,
	                innerDivStyle: innerDivStyle,
	                innerDivTranslate: {
	                    left: -options.offsetLeft || 0,
	                    top: -options.offsetTop || 0
	                },
	                renderedRows: []
	            };
	            if (includeRows) {
	                var maxHeight = layout.height;
	                var i;
	                var length;
	                for (i = 0, length = groups.length; i < length; i++) {
	                    maxHeight = Math.max(maxHeight, self.grid.getGroupInfo_([i]).height);
	                }
	                var renderedHTML = '';
	                for (i = 0, length = groups.length; i < length; i++) {
	                    renderedHTML += getGroupRenderedHTML_(self, self.grid.getGroupInfo_([i]), maxHeight);
	                }
	                r.renderedRows.push({
	                    key: self.grid.uid + '-gc-group-container',
	                    renderInfo: {
	                        renderedHTML: renderedHTML
	                    }
	                });
	            }
	            return r;
	        },
	
	        getRenderRange_: function(options) {
	            var scope = this;
	
	            return {
	                left: -options.offsetLeft || 0,
	                top: -options.offsetTop || 0,
	                renderedRows: [{key: scope.grid.uid + '-gc-group-container'}]
	            };
	        },
	
	        showScrollPanel: function() {
	            var layoutInfo = this.getLayoutInfo()[VIEWPORT];
	            if (layoutInfo) {
	                if (layoutInfo.height < layoutInfo.contentHeight || layoutInfo.width < layoutInfo.contentWidth) {
	                    return true;
	                }
	            }
	            return false;
	        },
	
	        isScrollableArea_: function() {
	            return false;
	        },
	
	        handleScroll: function() {
	            this.grid.scrollRenderPart_(VIEWPORT);
	        },
	
	        getScrollPanelRenderInfo: function() {
	            var viewportLayout = this.getLayoutInfo().viewport;
	            var showHScrollbar = viewportLayout.contentWidth > viewportLayout.width;
	            var showVScrollbar = viewportLayout.contentHeight > viewportLayout.height;
	            return {
	                outerDivCssClass: 'gc-grid-viewport-scroll-panel scroll-left scroll-top',
	                outerDivStyle: {
	                    position: 'absolute',
	                    top: 0,
	                    left: 0,
	                    height: viewportLayout.height + (showHScrollbar ? domUtil.getScrollbarSize().height : 0),
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
	
	        getRowTemplate: function() {
	            var self = this;
	            var grid = self.grid;
	            if (self.rowTemplateFn_) {
	                return self.rowTemplateFn_;
	            }
	            var templateStr = getRawRowTemplate_(this);
	            var oldColTmpl;
	            var newColTmpl;
	            var cssName;
	            var tagName;
	            var colTmpl;
	
	            var element = domUtil.createElement(templateStr);
	            //Different browsers may return different innerHTMLs compared with the original HTML,
	            //they may reorder the attribute of a tag,escapes tags with inside a noscript tag etc.
	            templateStr = domUtil.getElementInnerText(element);
	
	            var annotationCols = element.querySelectorAll('[data-column]');
	            for (var index = 0, length = annotationCols.length; index < length; index++) {
	                var annotationCol = annotationCols[index];
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
	                        for (var i = 0, len = dataFields.length; i < len; i++) {
	                            temp.push(grid.getColById_(dataFields[i]).presenter || '{{=it.' + dataFields[i] + '}}');
	                        }
	                        colAnnotation = temp.join(' ');
	                    }
	                }
	                colTmpl = annotationCol;
	                tagName = colTmpl.tagName;
	                oldColTmpl = domUtil.getElementOuterText(colTmpl);
	                cssName = 'gc-cell gc-trellis-cell c' + index;
	
	                newColTmpl = oldColTmpl.slice(0, oldColTmpl.length - (tagName.length + 3)) +
	                    '<div style="overflow:hidden;"><div  class="' + cssName + '"' + ' role="gridcell"' + '>' +
	                    (col.presenter ? col.presenter : colAnnotation) +
	                    '</div></div></' + tagName + '>';
	
	                //outerHTML returns double quotes in attribute sometimes
	                if (templateStr.indexOf(oldColTmpl) === -1) {
	                    oldColTmpl = oldColTmpl.replace(/"/g, '\'');
	                }
	                templateStr = templateStr.replace(oldColTmpl, newColTmpl);
	            }
	
	            self.rowTemplateFn_ = doT.template(templateStr, null, null, true);
	            return self.rowTemplateFn_;
	        },
	
	        hitTest: function(eventArgs) {
	            //TODO: remove hitTestGroup and hitTestGroupItem
	            var self = this;
	            var left = eventArgs.pageX;
	            var top = eventArgs.pageY;
	            var hitTestInfo = hitTest_.call(self, left, top);
	            return hitTestInfo;
	        },
	
	        clearRenderCache_: function() {
	            this.cacheViewportLayout_ = null;
	        },
	
	        initGroupInfosHeight_: function() {
	            var self = this;
	            var groupInfos = self.grid.groupInfos_;
	            var i;
	            var len;
	            var height = 0;
	            var groupInfo;
	            //group strategy need two steps process
	            //first round, use the default container to calculate the group height
	            //second round, use the max group height as the minheight, expand child groups to fill the remaining space.
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupInfo = groupInfos[i];
	                height = Math.max(height, self.getGroupHeight_(groupInfo, false));
	            }
	
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupInfos[i].height = self.getGroupHeight_(groupInfos[i], true, height);
	            }
	        },
	
	        getGroupHeight_: function(groupInfo, updateChildHeight, minHeight) {
	            var self = this;
	            var grid = self.grid;
	            var contentRect = grid.getContainerInfo_().contentRect;
	            if (!minHeight) {
	                minHeight = contentRect.height;
	                var contentWidth = 0;
	                var groupInfos = grid.groupInfos_;
	                for (var i = 0, length = groupInfos.length; i < length; i++) {
	                    contentWidth += getGroupWidth_(self, groupInfos[i]);
	                }
	                contentWidth += (length - 1) * self.options.gapSize;
	                if (contentWidth > (contentRect.width)) {
	                    minHeight -= domUtil.getScrollbarSize().height;
	                }
	            }
	            return getGroupHeightInternal_(this, groupInfo, updateChildHeight, minHeight);
	        },
	
	        destroy: function() {
	            var self = this;
	            var grid = self.grid;
	            grid.onMouseWheel.removeHandler(handleMouseWheel);
	            grid.onMouseDown.removeHandler(handleMouseDown);
	            grid.onMouseMove.removeHandler(self.handleMouseMoveFn_);
	            grid.onTouchStart_.removeHandler(self.handleTouchStartFn_);
	            self.grid = null;
	        },
	
	        toJSON: function() {
	            var self = this;
	            var options = self.options;
	            var jsonObj = {};
	            jsonObj.name = self.name;
	            var trellisOptions = {};
	            if (options.itemWidth !== 150) {
	                trellisOptions.itemWidth = options.itemWidth;
	            }
	
	            if (options.gapSize !== 4) {
	                trellisOptions.gapSize = options.gapSize;
	            }
	            if (options.groupLayoutFn) {
	                trellisOptions.groupLayoutFn = gcUtils.serializeFunction(options.groupLayoutFn);
	            }
	            if (options.rowTemplate) {
	                trellisOptions.rowTemplate = options.rowTemplate;
	            }
	            if (!_.isEmpty(trellisOptions)) {
	                jsonObj.options = trellisOptions;
	            }
	            return jsonObj;
	        }
	    };
	
	    function hitTestGroup_(self, groupInfo, left, top) {
	        var layoutEngine = self.grid.layoutEngine;
	        var groupHeaderHeight;
	        var gapSize = self.options.gapSize;
	        var group = groupInfo.data;
	        var layout;
	        var options = self.options;
	        var i;
	        var len;
	        var children;
	        var groupWidth;
	        var groupHeight;
	        var hitTestInfo;
	        groupHeaderHeight = layoutEngine.getGroupHeaderHeight_(group);
	        if (top <= groupHeaderHeight) {
	
	            return {
	                area: VIEWPORT,
	                row: -1,
	                column: -1,
	                groupInfo: {
	                    path: groupInfo.path,
	                    area: GROUP_HEADER
	                }
	            };
	        }
	
	        top -= (groupHeaderHeight + gapSize);
	        if (groupInfo.isBottomLevel) {
	            var groupContent = document.querySelector('#' + self.grid.uid + '-g' + groupInfo.path.join('_') + ' .gc-trellis-group-body');
	            hitTestInfo = layoutEngine.hitTestGroupContent_(groupInfo, VIEWPORT, left, top, {
	                width: getGroupWidth_(self, groupInfo),
	                height: groupInfo.height - (groupHeaderHeight + gapSize),
	                scrollLeft: groupContent.scrollLeft, //Group content may have scrollbar
	                scrollTop: groupContent.scrollTop
	            });
	            //for the trellis group, the las group content area contains empty space in some case
	            if (hitTestInfo === null && top < groupInfo.height - (groupHeaderHeight + gapSize)) {
	                hitTestInfo = {
	                    area: VIEWPORT,
	                    row: -1,
	                    column: -1,
	                    groupInfo: {
	                        path: groupInfo.path,
	                        row: -1,
	                        column: -1,
	                        area: GROUP_CONTENT
	                    }
	                };
	            }
	            return hitTestInfo;
	        } else {
	            children = groupInfo.children;
	            layout = options.groupLayoutFn ? options.groupLayoutFn(group) : DEFAULTLAYOUT;
	            if (layout.direction === VERTICAL) {
	                for (i = 0, len = children.length; i < len; i++) {
	                    groupHeight = children[i].height;
	                    if (top <= groupHeight) {
	                        return hitTestGroup_(self, children[i], left, top);
	                    }
	                    top -= (groupHeight + gapSize);
	                }
	            } else {
	                for (i = 0, len = children.length; i < len; i++) {
	                    groupWidth = getGroupWidth_(self, children[i]);
	                    if (left <= groupWidth) {
	                        return hitTestGroup_(self, children[i], left, top);
	                    }
	                    left -= (groupWidth + gapSize);
	                }
	            }
	        }
	        return null;
	    }
	
	    function hitTest_(left, top) {
	        var self = this;
	        var layoutInfo = self.getLayoutInfo()[VIEWPORT];
	        var grid = self.grid;
	        var containerInfo = grid.getContainerInfo_().contentRect;
	        var groupInfos;
	        var groupWidth;
	        var i;
	        var len;
	        left = left - (containerInfo.left);
	        top = top - (containerInfo.top);
	        if (contains_(layoutInfo, {left: left, top: top})) {
	            left += grid.scrollOffset.left;
	            top += grid.scrollOffset.top;
	            groupInfos = grid.groupInfos_;
	            for (i = 0, len = groupInfos.length; i < len; i++) {
	                groupWidth = getGroupWidth_(self, groupInfos[i]);
	                if (left <= groupWidth) {
	                    return hitTestGroup_(self, groupInfos[i], left, top);
	                }
	                left -= (groupWidth + self.options.gapSize);
	            }
	        }
	        return null;
	    }
	
	    function contains_(layoutInfo, point) {
	        return point.left >= layoutInfo.left && point.top >= layoutInfo.top && point.left <= (layoutInfo.left + layoutInfo.width) && point.top <= (layoutInfo.top + layoutInfo.height);
	    }
	
	    function handleTouchStart(sender, e) {
	        console.log('touch start');
	        var args = getEventArgs(e);
	        if (handlePointerDown(sender, args)) {
	            e.handled = true;
	        }
	    }
	
	    function handleMouseDown(sender, e) {
	        console.log('mouse down');
	        handlePointerDown(sender, e, true);
	    }
	
	    function handlePointerDown(sender, e, mouseEvent) {
	        var self = sender.layoutEngine.groupStrategy_;
	        self.hitTestInfo_ = self.hitTest(e);
	        var hitInfo = self.hitTestInfo_;
	        if (!hitInfo) {
	            return;
	        }
	        self.mouseDownHitInfo_ = hitInfo;
	        //var hi = self.hitTest(e);
	        //self.hitTestItemInfo_ = self.hitTestGroupItem(e.pageX, e.pageY);
	        var groupInfo = hitInfo.groupInfo;
	        if (groupInfo && groupInfo.area === 'groupContent' && groupInfo.row >= 0 && groupInfo.column >= 0 && !self.dragDropStatus) {
	            //disable drag effect on the elements like <img></img>
	            if (e.target && e.target.draggable) {
	                e.target.draggable = false;
	            }
	            startMoveItem_(e, self, mouseEvent);
	            self.dragDropStatus = STARTDRAG;
	            return true;
	        }
	
	        return false;
	    }
	
	    function handleTouchMove(e) {
	        var self = this;
	        var args = getEventArgs(e);
	        console.log('touch move');
	        if (handlePointerMove.call(self, args)) {
	            e.handled = true;
	        }
	    }
	
	    function handleMouseMove(sender, e) {
	        var self = this;
	        console.log('mouse move');
	        //call from document mousemove
	        if (!e && Object.prototype.toString.call(sender) === '[object MouseEvent]') {
	            e = sender;
	        }
	
	        handlePointerMove.call(self, e);
	    }
	
	    function handlePointerMove(e) {
	        var grid = this;
	        var self = grid.layoutEngine.groupStrategy_;
	        self.hitTestInfo_ = self.hitTest(e);
	        if (self.moveGroupItem_) {
	            self.dragDropStatus = DRAGMOVING;
	            continueMoveItem_.call(self, e);
	            return true;
	        }
	
	        return false;
	    }
	
	    function handleMouseWheel(sender, e) {
	        var grid = sender;
	        var groupStrategy = grid.layoutEngine.groupStrategy_;
	        var offsetDelta = e.deltaY;
	        if (offsetDelta !== 0) {
	            var layout = groupStrategy.getLayoutInfo().viewport;
	            var hasVertical = layout.height < layout.contentHeight;
	            var hasHorizontal = layout.width < layout.contentWidth;
	            var scrollbarHeight = (hasHorizontal && hasVertical) ? domUtil.getScrollbarSize().height : 0;
	            var maxOffsetTop = Math.max(layout.contentHeight - layout.height + scrollbarHeight, 0);
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
	            domUtil.getElement('#' + grid.uid + '-viewport-scroll').scrollTop = scrollTop;
	        }
	        e.preventDefault();
	    }
	
	    function handleTouchEnd() {
	        var self = this.layoutEngine.groupStrategy_;
	        console.log('touch end');
	        endMoveItem_.call(self);
	    }
	
	    function startMoveItem_(e, groupStrategy, mouseEvent) {
	        var self = groupStrategy;
	        var hitGroupInfo = self.mouseDownHitInfo_.groupInfo;
	        var element = document.getElementById(self.grid.uid + '-gr' + hitGroupInfo.path.join('_') + '-r' + hitGroupInfo.row);
	        if (!element) {
	            return;
	        }
	        var elementStyle = domUtil.getStyle(element);
	        var elementMarginTop = parseFloat(elementStyle.getPropertyValue(MARGIN_TOP));
	        var elementMarginLeft = parseFloat(elementStyle.getPropertyValue(MARGIN_LEFT));
	        var elementOffset = domUtil.offset(element);
	
	        element.removeAttribute('id');
	        self.moveGroupItem_ = self.grid.getGroupInfo_(hitGroupInfo.path).data.getItem(hitGroupInfo.row);
	        if (!self.placeHolderElement_) {
	            self.placeHolderElement_ = element.cloneNode(false);
	            domUtil.setCss(self.placeHolderElement_, {
	                'background': '#999',
	                'width': elementStyle.width,
	                'height': elementStyle.height
	            });
	            //var contentarea = self.placeHolderElement_.children[0];
	            //if (contentarea) {
	            //    contentarea.innerHTML = '';
	            //    domUtil.setCss(contentarea, {'background': '#999'});
	            //}
	        }
	        movePlaceHolder_(e, self);
	
	        self.movingElement_ = element;
	
	        self.itemOffsetFromPoint_ = {
	            left: e.pageX - (elementOffset.left - elementMarginLeft),
	            top: e.pageY - (elementOffset.top - elementMarginTop)
	        };
	
	        document.body.appendChild(self.movingElement_);
	        domUtil.setCss(self.movingElement_, {
	            position: 'absolute',
	            left: (e.pageX - self.itemOffsetFromPoint_.left) + 'px',
	            top: (e.pageY - self.itemOffsetFromPoint_.top) + 'px'
	        });
	        self.mouseStartPosition_ = {left: e.pageX, top: e.pageY};
	        self.ismouseEvent_ = mouseEvent;
	        if (mouseEvent) {
	            self.mouseUpHandler_ = endMoveItem_.bind(self);
	            document.addEventListener('mousemove', self.handleMouseMoveFn_);
	            document.addEventListener('mouseup', self.mouseUpHandler_);
	        } else {
	            TouchWrapper(document).on('touchmove', self.handleTouchMoveFn_);
	            TouchWrapper(document).on('touchend', self.handleTouchEndFn_);
	        }
	
	        document.body.className = document.body.className + ' no-select';
	    }
	
	    function continueMoveItem_(e) {
	        var self = this;
	        var hitGroupInfo = self.mouseDownHitInfo_.groupInfo;
	        if (!hitGroupInfo) {
	            return;
	        }
	
	        domUtil.setCss(self.movingElement_, {
	            'left': (e.pageX - self.itemOffsetFromPoint_.left) + 'px',
	            'top': (e.pageY - self.itemOffsetFromPoint_.top) + 'px'
	        });
	        movePlaceHolder_(e, self);
	    }
	
	    function endMoveItem_() {
	        var self = this;
	        if (self.dragDropStatus === STARTDRAG || self.dragDropStatus === DRAGMOVING) {
	            updateDataView_(self);
	            if (self.ismouseEvent_) {
	                document.removeEventListener('mousemove', self.handleMouseMoveFn_);
	                document.removeEventListener('mouseup', self.mouseUpHandler_);
	            } else {
	                TouchWrapper(document).off('touchmove', self.handleTouchMoveFn_);
	                TouchWrapper(document).off('touchend', self.handleTouchEndFn_);
	            }
	            document.body.removeChild(self.movingElement_);
	            self.mouseMoveHandler_ = null;
	            self.mouseUpHandler_ = null;
	            self.hitTestItemInfo_ = null;
	            self.mouseStartPosition_ = null;
	            self.moveGroupItem_ = null;
	            self.mouseDownHitInfo_ = null;
	            self.placeHolderElement_ = null;
	            self.placeHolderGroupInfo_ = null;
	            self.movingElement_ = null;
	            self.dragDropStatus = null;
	            document.body.className = document.body.className.replace('no-select', '');
	            self.grid.invalidate();
	        }
	    }
	
	    function updateDataView_(self) {
	        if (self.placeHolderGroupInfo_) {
	            var groups = self.grid.data.groups;
	            var field;
	            var newValue;
	            var index;
	            var length;
	            var i;
	            var groupPath = self.placeHolderGroupInfo_.path;
	            for (i = 0, length = groupPath.length; i < length; i++) {
	                index = groupPath[i];
	                field = groups[index].groupDescriptor.field;
	                newValue = groups[index].getItem(0)[field];
	                if (self.moveGroupItem_[field] !== newValue) {
	                    self.moveGroupItem_[field] = newValue;
	                }
	                groups = groups[index].groups;
	            }
	            self.grid.data.refresh();
	        }
	    }
	
	    function getEventArgs(e) {
	        return {
	            pageX: e.targetTouches[0].pageX,
	            pageY: e.targetTouches[0].pageY,
	            target: e.target
	        };
	    }
	
	    function movePlaceHolder_(e, self) {
	        if (!self.hitTestInfo_) {
	            return;
	        }
	        var hitGroupInfo = self.hitTestInfo_.groupInfo;
	        if (hitGroupInfo) {
	            var groupInfo = self.grid.getGroupInfo_(hitGroupInfo.path);
	            var group = groupInfo.data;
	            if (group && group.isBottomLevel) {
	                var contentElement = document.querySelector('#' + self.grid.uid + '-g' + hitGroupInfo.path.join('_') + ' .gc-trellis-group-body-inner');
	                var element = null;
	                if (hitGroupInfo.row >= 0) {
	                    var mouseDownGroupInfo = self.mouseDownHitInfo_.groupInfo;
	                    //drag drop in the same group is the special case since it will remove one item at the begining
	                    if (JSON.stringify(hitGroupInfo.path) === JSON.stringify(mouseDownGroupInfo.path)) {
	                        element = document.getElementById(self.grid.uid + '-gr' + hitGroupInfo.path.join('_') + '-r' + (hitGroupInfo.row >= mouseDownGroupInfo.row ? (hitGroupInfo.row + 1) : hitGroupInfo.row));
	                    } else {
	                        element = document.getElementById(self.grid.uid + '-gr' + hitGroupInfo.path.join('_') + '-r' + hitGroupInfo.row);
	                    }
	                }
	
	                if (element) {
	                    contentElement.insertBefore(self.placeHolderElement_, element);
	                } else {
	                    contentElement.appendChild(self.placeHolderElement_);
	                }
	                self.placeHolderGroupInfo_ = hitGroupInfo;
	            }
	        }
	    }
	
	    function getRawRowTemplate_(layoutEngine) {
	        var self = layoutEngine;
	        var rowTmpl = self.options.rowTemplate;
	        if (rowTmpl) {
	            if (gcUtils.isString(rowTmpl) && rowTmpl.length > 1 && rowTmpl[0] === '#') {
	                var tmplElement = document.getElementById(rowTmpl.slice(1));
	                return tmplElement.innerHTML;
	            } else {
	                return rowTmpl;
	            }
	        } else {
	            return getDefaultRawRowTemplate_(self);
	        }
	    }
	
	    function getDefaultRawRowTemplate_(self) {
	        var cols = self.grid.columns;
	        var col;
	        var height = self.grid.layoutEngine.getRowHeight_();
	        var r = '<div><div class="gc-trellis-group-item" style="height:' + height + 'px;">';
	        for (var i = 0, length = cols.length; i < length; i++) {
	            col = cols[i];
	            if (col.visible !== false) {
	                r += '<div  data-column="' + col.id + '"></div>';
	            }
	        }
	        r += '</div></div>';
	        return r;
	    }
	
	    function getViewportLayoutInfo_(self) {
	        if (self.cacheViewportLayout_) {
	            return self.cacheViewportLayout_;
	        }
	        var grid = self.grid;
	        var groups = grid.data.groups;
	        if (!groups || groups.length <= 0) {
	            return null;
	        }
	        var containerInfo = grid.getContainerInfo_().contentRect;
	        var width = containerInfo.width;
	        var height = containerInfo.height;
	        var gapSize = self.options.gapSize;
	
	        var contentWidth = 0;
	        var contentHeight = height;
	        var tempHeight = 0;
	        var groupInfos = grid.groupInfos_;
	        for (var i = 0, length = groupInfos.length; i < length; i++) {
	            contentWidth += Math.ceil(getGroupWidth_(self, groupInfos[i]));
	            tempHeight = Math.max(tempHeight, groupInfos[i].height);
	        }
	        contentWidth += (length - 1) * gapSize;
	        if (contentWidth > width) {
	            contentHeight -= domUtil.getScrollbarSize().height;
	        }
	        contentHeight = Math.max(contentHeight, tempHeight);
	        width = (height >= contentHeight) ? width : (width - domUtil.getScrollbarSize().width);
	        height = (width >= contentWidth) ? height : (height - domUtil.getScrollbarSize().height);
	        self.cacheViewportLayout_ = {
	            top: 0,
	            left: 0,
	            width: width,
	            height: height,
	            contentWidth: contentWidth,
	            contentHeight: contentHeight
	        };
	
	        return self.cacheViewportLayout_;
	    }
	
	    function getGroupWidth_(self, groupInfo) {
	        if (groupInfo.width) {
	            return groupInfo.width;
	        }
	        var options = self.options;
	        var layout = options.groupLayoutFn ? options.groupLayoutFn(groupInfo.data) : DEFAULTLAYOUT;
	        var result = 0;
	        var group = groupInfo.data;
	        if (!group.isBottomLevel) {
	            var i = 0;
	            var length = groupInfo.children.length;
	            if (layout.direction === VERTICAL) {
	                for (; i < length; i++) {
	                    result = Math.max(result, getGroupWidth_(self, groupInfo.children[i]));
	                }
	            } else {
	                for (; i < length; i++) {
	                    result += getGroupWidth_(self, groupInfo.children[i]);
	                }
	                result += (length - 1) * options.gapSize;
	            }
	        } else {
	            result = options.itemWidth * layout.columnSpan;
	        }
	        groupInfo.width = result;
	        return result;
	    }
	
	    function getGroupHeightInternal_(self, groupInfo, updateChildHeight, minHeight) {
	        var options = self.options;
	        var grid = self.grid;
	        var layoutEngine = grid.layoutEngine;
	        var group = groupInfo.data;
	        var layout = options.groupLayoutFn ? options.groupLayoutFn(group) : DEFAULTLAYOUT;
	        var headerHeight = layoutEngine.getGroupHeaderHeight_(group);
	        var result = 0;
	        var gapSize = options.gapSize;
	        var height;
	        if (!groupInfo.isBottomLevel) {
	            var children = groupInfo.children;
	            var i;
	            var length = children.length;
	            if (layout.direction === VERTICAL) {
	                //for the vertical direction, we expand the last group to fill the remaining space.
	                for (i = 0; i < length - 1; i++) {
	                    height = getGroupHeightInternal_(self, children[i], updateChildHeight, 0);
	                    if (updateChildHeight) {
	                        children[i].height = height;
	                    }
	                    result += height;
	                    result += gapSize;
	                }
	                minHeight = minHeight - result - headerHeight - gapSize;
	                height = getGroupHeightInternal_(self, children[i], updateChildHeight, minHeight);
	                if (updateChildHeight) {
	                    children[i].height = height;
	                }
	                result += height;
	            } else {
	                minHeight = minHeight - headerHeight - gapSize;
	                for (i = 0; i < length; i++) {
	                    height = getGroupHeightInternal_(self, children[i], updateChildHeight, minHeight);
	                    if (updateChildHeight) {
	                        children[i].height = height;
	                    }
	                    result = Math.max(result, height);
	                }
	            }
	            result += headerHeight + gapSize;
	        } else {
	            height = layoutEngine.getInnerGroupHeight(groupInfo, {
	                width: layout.columnSpan * options.itemWidth
	            });
	            minHeight = minHeight - headerHeight - gapSize;
	            result = headerHeight + Math.max(minHeight, height) + options.gapSize;
	        }
	        return result;
	    }
	
	    function getTrellisRowCallback(groupInfo, itemIndex) {
	        return {
	            cssClass: 'gc-trellis-row',
	            style: {
	                position: 'static',
	                overflow: 'hidden'
	            }
	        };
	    }
	
	    function getGroupRenderedHTML_(self, groupInfo) {
	        var group = groupInfo.data;
	        var grid = self.grid;
	        var options = self.options;
	        var layoutFn = options.groupLayoutFn;
	        var layout = layoutFn ? layoutFn(group) : DEFAULTLAYOUT;
	        var children = groupInfo.children;
	        var layoutEngine = grid.layoutEngine;
	
	        var itemWidth = options.itemWidth;
	        var containerWidth = layout.columnSpan * itemWidth;
	        var groupHeaderHeight = grid.layoutEngine.getGroupHeaderHeight_(group);
	        var groupPath = groupInfo.path;
	        var gapSize = options.gapSize;
	        var renderedHTML = '';
	        var i;
	        var length;
	        var bottomLevelHeight = 0;
	        if (children) {
	            //get group render html
	            for (i = 0; i < children.length; i++) {
	                renderedHTML += getGroupRenderedHTML_(self, children[i], children[i].height);
	            }
	        } else {
	            //get group item render html
	            var rows = layoutEngine.getInnerGroupRenderInfo(groupInfo, {width: containerWidth}, getTrellisRowCallback.bind(self));
	            bottomLevelHeight = layoutEngine.getInnerGroupHeight(groupInfo, {width: containerWidth});
	            var innerWidth = containerWidth;
	            if (layoutEngine.getInnerGroupWidth) {
	                innerWidth = layoutEngine.getInnerGroupWidth(groupInfo, {width: containerWidth});
	            }
	            var itemRenderedHTML = '<div class="gc-trellis-group-body-inner" style="min-width:' + innerWidth + 'px;height:' + bottomLevelHeight + 'px;">';
	            for (i = 0, length = rows.length; i < length; i++) {
	                itemRenderedHTML += grid.renderRow_(rows[i]);
	            }
	            itemRenderedHTML += '</div>';
	            renderedHTML = itemRenderedHTML;
	        }
	
	        var parentGroup = group.parent;
	        var parentLayoutDirection = (parentGroup && layoutFn) ? layoutFn(parentGroup).direction : DEFAULTLAYOUT.direction;
	        var groupIndex = groupPath[group.level];
	        var groupBodyStyle = {
	            marginBottom: gapSize
	        };
	
	        if (group.isBottomLevel) {
	            groupBodyStyle = {
	                marginBottom: gapSize,
	                width: layout.columnSpan * itemWidth,
	                position: 'relative',
	                overflow: 'auto',
	                //minHeight: groupInfo.height - groupHeaderHeight - gapSize
	                minHeight: bottomLevelHeight + domUtil.getScrollbarSize().height //min-height to make dynamic height
	            };
	        }
	        var groupBodyClass = group.isBottomLevel ? 'gc-trellis-group-body gc-trellis-group-content' : 'gc-trellis-group-body';
	
	        var groupStyle = {};
	        if (group.level === 0 || parentLayoutDirection !== VERTICAL) {
	            groupStyle.marginLeft = (groupIndex === 0) ? 0 : gapSize;
	        }
	        if (parentLayoutDirection === VERTICAL) {
	            groupStyle.clear = 'both';
	        }
	
	        var headerStyle = {
	            marginBottom: gapSize,
	            height: groupHeaderHeight
	        };
	
	        renderedHTML = '<div style="' + gcUtils.createMarkupForStyles(groupStyle) + '" id="' + grid.uid + '-g' + groupPath.join('_') + '" class="gc-trellis-group l' + group.level + '" > ' +
	            '<div class="gc-trellis-group-header" style="' + gcUtils.createMarkupForStyles(headerStyle) + '">' +
	            '<div class="gc-trellis-group-header-inner" style="max-width:' + getGroupWidth_(self, groupInfo) + 'px;">' + group.name + '</div></div>' +
	            '<div class="' + groupBodyClass + '" style="' + gcUtils.createMarkupForStyles(groupBodyStyle) + '">' + renderedHTML + '</div></div>';
	        return renderedHTML;
	    }
	
	    module.exports = TrellisStrategy;
	})
	();


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


/***/ }
/******/ ])
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWM0ODczOTg0MTY0MTkwYTRlOGU/MTBiYyoqIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvZ3JvdXBTdHJhdGVnaWVzL1RyZWxsaXNTdHJhdGVneS5qcyIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2djVXRpbHMuanM/YzgyZCoqIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvZG9ULmpzPzQ5MjgqKiIsIndlYnBhY2s6Ly8vLi9hcHAvc2NyaXB0cy9ncmlkL2RvbVV0aWwuanM/ZDBjZCoqIiwid2VicGFjazovLy8uL2FwcC9zY3JpcHRzL2dyaWQvVG91Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyw2REFBNkQsaUZBQWlGLHVHQUF1RztBQUNoUyxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUFzQztBQUN0QyxnREFBK0M7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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c0I7QUFDL0Y7QUFDQSxvSEFBbUgsbUNBQW1DO0FBQ3RKLDhDQUE2QyxZQUFZO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9IQUFtSDtBQUNuSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDO0FBQ0Q7Ozs7Ozs7QUNyNUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsWUFBWTtBQUN2QjtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLHlDQUF3QyxLQUFLLFdBQVcsVUFBVTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckIseUNBQXdDLEtBQUssV0FBVyxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW1DLGdCQUFnQjtBQUNuRDtBQUNBLHdDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQztBQUMxQyxrQkFBaUI7QUFDakIsc0NBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwRUFBeUU7QUFDekUsa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVHJlbGxpc1N0cmF0ZWd5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkdjU3ByZWFkXCJdID0gcm9vdFtcIkdjU3ByZWFkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXSA9IHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdIHx8IHt9LCByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gPSByb290W1wiR2NTcHJlYWRcIl1bXCJWaWV3c1wiXVtcIkdjR3JpZFwiXVtcIlBsdWdpbnNcIl0gfHwge30sIHJvb3RbXCJHY1NwcmVhZFwiXVtcIlZpZXdzXCJdW1wiR2NHcmlkXCJdW1wiUGx1Z2luc1wiXVtcIlRyZWxsaXNTdHJhdGVneVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDVjNDg3Mzk4NDE2NDE5MGE0ZThlXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZ2NVdGlscyA9IHJlcXVpcmUoJy4uL2djVXRpbHMnKTtcbiAgICB2YXIgZG9tVXRpbCA9IHJlcXVpcmUoJy4uL2RvbVV0aWwnKTtcbiAgICB2YXIgZG9UID0gcmVxdWlyZSgnLi4vZG9ULmpzJyk7XG4gICAgdmFyIFRvdWNoV3JhcHBlciA9IHJlcXVpcmUoJy4uL1RvdWNoJyk7XG4gICAgdmFyIFZJRVdQT1JUID0gJ3ZpZXdwb3J0JztcbiAgICB2YXIgR1JPVVBfSEVBREVSID0gJ2dyb3VwSGVhZGVyJztcbiAgICAvL3ZhciBHUk9VUF9GT09URVIgPSAnZ3JvdXBGb290ZXInO1xuICAgIHZhciBHUk9VUF9DT05URU5UID0gJ2dyb3VwQ29udGVudCc7XG4gICAgdmFyIFZFUlRJQ0FMID0gJ3ZlcnRpY2FsJztcbiAgICB2YXIgSE9SSVpPTlRBTCA9ICdob3Jpem9udGFsJztcbiAgICB2YXIgU1RBUlREUkFHID0gJ3N0YXJ0ZHJhZyc7XG4gICAgdmFyIERSQUdNT1ZJTkcgPSAnZHJhZ21vdmluZyc7XG4gICAgdmFyIE1BUkdJTl9UT1AgPSAnbWFyZ2luLXRvcCc7XG4gICAgdmFyIE1BUkdJTl9MRUZUID0gJ21hcmdpbi1sZWZ0JztcbiAgICAvLyB2YXIgTUFSR0lOX0JPVFRPTSA9ICdtYXJnaW4tYm90dG9tJztcbiAgICB2YXIgREVGQVVMVExBWU9VVCA9IHtcbiAgICAgICAgY29sdW1uU3BhbjogMSxcbiAgICAgICAgZGlyZWN0aW9uOiBIT1JJWk9OVEFMXG4gICAgfTtcblxuICAgIHZhciBUcmVsbGlzU3RyYXRlZ3kgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgaXRlbVdpZHRoOiAxNTAsXG4gICAgICAgICAgICBnYXBTaXplOiA0XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYubmFtZSA9ICdUcmVsbGlzU3RyYXRlZ3knOyAvL25hbWUgbXVzdCBlbmQgd2l0aCBMYXlvdXRFbmdpbmVcbiAgICAgICAgc2VsZi5vcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBkZWZhdWx0cyk7XG4gICAgfTtcblxuICAgIFRyZWxsaXNTdHJhdGVneS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKGdyaWQpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuZ3JpZCA9IGdyaWQ7XG5cbiAgICAgICAgICAgIHNlbGYuaGFuZGxlTW91c2VNb3ZlRm5fID0gaGFuZGxlTW91c2VNb3ZlLmJpbmQoZ3JpZCk7XG4gICAgICAgICAgICBzZWxmLmhhbmRsZVRvdWNoU3RhcnRGbl8gPSBoYW5kbGVUb3VjaFN0YXJ0LmJpbmQoZ3JpZCk7XG4gICAgICAgICAgICBzZWxmLmhhbmRsZVRvdWNoTW92ZUZuXyA9IGhhbmRsZVRvdWNoTW92ZS5iaW5kKGdyaWQpO1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVUb3VjaEVuZEZuXyA9IGhhbmRsZVRvdWNoRW5kLmJpbmQoZ3JpZCk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VEb3duLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VEb3duKTtcbiAgICAgICAgICAgIGdyaWQub25Nb3VzZVdoZWVsLmFkZEhhbmRsZXIoaGFuZGxlTW91c2VXaGVlbCk7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VNb3ZlLmFkZEhhbmRsZXIoc2VsZi5oYW5kbGVNb3VzZU1vdmVGbl8pO1xuICAgICAgICAgICAgZ3JpZC5vblRvdWNoU3RhcnRfLmFkZEhhbmRsZXIoc2VsZi5oYW5kbGVUb3VjaFN0YXJ0Rm5fKTtcblxuICAgICAgICAgICAgLy92YXIgZWxlbWVudCA9IGRvbVV0aWwuY3JlYXRlRWxlbWVudCgnPGRpdiBjbGFzcz1cImdjLXRyZWxsaXMtZ3JvdXAtaXRlbVwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7bGVmdDo5OTk5cHg7aGVpZ2h0Ojk5OTlweDtcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIC8vdmFyIGVsZW1lbnRTdHlsZSA9IGRvbVV0aWwuZ2V0U3R5bGUoZWxlbWVudCk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGF5b3V0SW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgciA9IHt9O1xuICAgICAgICAgICAgcltWSUVXUE9SVF0gPSBnZXRWaWV3cG9ydExheW91dEluZm9fKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVuZGVySW5mbzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyb3VwcyA9IHNlbGYuZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgICAgIGlmICghZ3JvdXBzIHx8IGdyb3Vwcy5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGluY2x1ZGVSb3dzID0gb3B0aW9ucy5pbmNsdWRlUm93cyB8fCB0cnVlO1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IG9wdGlvbnMub2Zmc2V0VG9wO1xuICAgICAgICAgICAgdmFyIGxheW91dCA9IGdldFZpZXdwb3J0TGF5b3V0SW5mb18oc2VsZik7XG5cbiAgICAgICAgICAgIHZhciBvdXRlckRpdlN0eWxlID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGxheW91dC5sZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogbGF5b3V0LnRvcCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGxheW91dC53aWR0aCxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaW5uZXJEaXZTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGxheW91dC5jb250ZW50SGVpZ2h0IC0gKG9mZnNldFRvcCA8IDAgPyBvZmZzZXRUb3AgOiAwKSxcbiAgICAgICAgICAgICAgICB3aWR0aDogbGF5b3V0LmNvbnRlbnRXaWR0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByID0ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy12aWV3cG9ydCBnYy10cmVsbGlzLXZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiBvdXRlckRpdlN0eWxlLFxuICAgICAgICAgICAgICAgIGlubmVyRGl2U3R5bGU6IGlubmVyRGl2U3R5bGUsXG4gICAgICAgICAgICAgICAgaW5uZXJEaXZUcmFuc2xhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogLW9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IC1vcHRpb25zLm9mZnNldFRvcCB8fCAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJlZFJvd3M6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGluY2x1ZGVSb3dzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IGxheW91dC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBncm91cHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0ID0gTWF0aC5tYXgobWF4SGVpZ2h0LCBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhbaV0pLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZEhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBncm91cHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWRIVE1MICs9IGdldEdyb3VwUmVuZGVyZWRIVE1MXyhzZWxmLCBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhbaV0pLCBtYXhIZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByLnJlbmRlcmVkUm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBzZWxmLmdyaWQudWlkICsgJy1nYy1ncm91cC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlZEhUTUw6IHJlbmRlcmVkSFRNTFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRSZW5kZXJSYW5nZV86IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdDogLW9wdGlvbnMub2Zmc2V0TGVmdCB8fCAwLFxuICAgICAgICAgICAgICAgIHRvcDogLW9wdGlvbnMub2Zmc2V0VG9wIHx8IDAsXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRSb3dzOiBbe2tleTogc2NvcGUuZ3JpZC51aWQgKyAnLWdjLWdyb3VwLWNvbnRhaW5lcid9XVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93U2Nyb2xsUGFuZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxheW91dEluZm8gPSB0aGlzLmdldExheW91dEluZm8oKVtWSUVXUE9SVF07XG4gICAgICAgICAgICBpZiAobGF5b3V0SW5mbykge1xuICAgICAgICAgICAgICAgIGlmIChsYXlvdXRJbmZvLmhlaWdodCA8IGxheW91dEluZm8uY29udGVudEhlaWdodCB8fCBsYXlvdXRJbmZvLndpZHRoIDwgbGF5b3V0SW5mby5jb250ZW50V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2Nyb2xsYWJsZUFyZWFfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTY3JvbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNjcm9sbFJlbmRlclBhcnRfKFZJRVdQT1JUKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY3JvbGxQYW5lbFJlbmRlckluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZpZXdwb3J0TGF5b3V0ID0gdGhpcy5nZXRMYXlvdXRJbmZvKCkudmlld3BvcnQ7XG4gICAgICAgICAgICB2YXIgc2hvd0hTY3JvbGxiYXIgPSB2aWV3cG9ydExheW91dC5jb250ZW50V2lkdGggPiB2aWV3cG9ydExheW91dC53aWR0aDtcbiAgICAgICAgICAgIHZhciBzaG93VlNjcm9sbGJhciA9IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRIZWlnaHQgPiB2aWV3cG9ydExheW91dC5oZWlnaHQ7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG91dGVyRGl2Q3NzQ2xhc3M6ICdnYy1ncmlkLXZpZXdwb3J0LXNjcm9sbC1wYW5lbCBzY3JvbGwtbGVmdCBzY3JvbGwtdG9wJyxcbiAgICAgICAgICAgICAgICBvdXRlckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnRMYXlvdXQuaGVpZ2h0ICsgKHNob3dIU2Nyb2xsYmFyID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IDogMCksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC53aWR0aCArIChzaG93VlNjcm9sbGJhciA/IGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLndpZHRoIDogMCksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93WDogJ2F1dG8nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbm5lckRpdlN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0TGF5b3V0LmNvbnRlbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydExheW91dC5jb250ZW50V2lkdGhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJvd1RlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBncmlkID0gc2VsZi5ncmlkO1xuICAgICAgICAgICAgaWYgKHNlbGYucm93VGVtcGxhdGVGbl8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5yb3dUZW1wbGF0ZUZuXztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVN0ciA9IGdldFJhd1Jvd1RlbXBsYXRlXyh0aGlzKTtcbiAgICAgICAgICAgIHZhciBvbGRDb2xUbXBsO1xuICAgICAgICAgICAgdmFyIG5ld0NvbFRtcGw7XG4gICAgICAgICAgICB2YXIgY3NzTmFtZTtcbiAgICAgICAgICAgIHZhciB0YWdOYW1lO1xuICAgICAgICAgICAgdmFyIGNvbFRtcGw7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9tVXRpbC5jcmVhdGVFbGVtZW50KHRlbXBsYXRlU3RyKTtcbiAgICAgICAgICAgIC8vRGlmZmVyZW50IGJyb3dzZXJzIG1heSByZXR1cm4gZGlmZmVyZW50IGlubmVySFRNTHMgY29tcGFyZWQgd2l0aCB0aGUgb3JpZ2luYWwgSFRNTCxcbiAgICAgICAgICAgIC8vdGhleSBtYXkgcmVvcmRlciB0aGUgYXR0cmlidXRlIG9mIGEgdGFnLGVzY2FwZXMgdGFncyB3aXRoIGluc2lkZSBhIG5vc2NyaXB0IHRhZyBldGMuXG4gICAgICAgICAgICB0ZW1wbGF0ZVN0ciA9IGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dChlbGVtZW50KTtcblxuICAgICAgICAgICAgdmFyIGFubm90YXRpb25Db2xzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb2x1bW5dJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGFubm90YXRpb25Db2xzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGlvbkNvbCA9IGFubm90YXRpb25Db2xzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB2YXIgY29sID0gZ3JpZC5nZXRDb2xCeUlkXyhhbm5vdGF0aW9uQ29sLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2x1bW4nKSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbEFubm90YXRpb247XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5pc0NhbGNDb2x1bW5fKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbEFubm90YXRpb24gPSAne3s9aXQuJyArIGNvbC5pZCArICd9fSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFGaWVsZHMgPSBjb2wuZGF0YUZpZWxkID8gY29sLmRhdGFGaWVsZC5zcGxpdCgnLCcpIDogW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhRmllbGRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sQW5ub3RhdGlvbiA9ICd7ez1pdC4nICsgY29sLmRhdGFGaWVsZCArICd9fSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGFGaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wLnB1c2goZ3JpZC5nZXRDb2xCeUlkXyhkYXRhRmllbGRzW2ldKS5wcmVzZW50ZXIgfHwgJ3t7PWl0LicgKyBkYXRhRmllbGRzW2ldICsgJ319Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xBbm5vdGF0aW9uID0gdGVtcC5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29sVG1wbCA9IGFubm90YXRpb25Db2w7XG4gICAgICAgICAgICAgICAgdGFnTmFtZSA9IGNvbFRtcGwudGFnTmFtZTtcbiAgICAgICAgICAgICAgICBvbGRDb2xUbXBsID0gZG9tVXRpbC5nZXRFbGVtZW50T3V0ZXJUZXh0KGNvbFRtcGwpO1xuICAgICAgICAgICAgICAgIGNzc05hbWUgPSAnZ2MtY2VsbCBnYy10cmVsbGlzLWNlbGwgYycgKyBpbmRleDtcblxuICAgICAgICAgICAgICAgIG5ld0NvbFRtcGwgPSBvbGRDb2xUbXBsLnNsaWNlKDAsIG9sZENvbFRtcGwubGVuZ3RoIC0gKHRhZ05hbWUubGVuZ3RoICsgMykpICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJvdmVyZmxvdzpoaWRkZW47XCI+PGRpdiAgY2xhc3M9XCInICsgY3NzTmFtZSArICdcIicgKyAnIHJvbGU9XCJncmlkY2VsbFwiJyArICc+JyArXG4gICAgICAgICAgICAgICAgICAgIChjb2wucHJlc2VudGVyID8gY29sLnByZXNlbnRlciA6IGNvbEFubm90YXRpb24pICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PjwvZGl2PjwvJyArIHRhZ05hbWUgKyAnPic7XG5cbiAgICAgICAgICAgICAgICAvL291dGVySFRNTCByZXR1cm5zIGRvdWJsZSBxdW90ZXMgaW4gYXR0cmlidXRlIHNvbWV0aW1lc1xuICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZVN0ci5pbmRleE9mKG9sZENvbFRtcGwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvbGRDb2xUbXBsID0gb2xkQ29sVG1wbC5yZXBsYWNlKC9cIi9nLCAnXFwnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlU3RyID0gdGVtcGxhdGVTdHIucmVwbGFjZShvbGRDb2xUbXBsLCBuZXdDb2xUbXBsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5yb3dUZW1wbGF0ZUZuXyA9IGRvVC50ZW1wbGF0ZSh0ZW1wbGF0ZVN0ciwgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5yb3dUZW1wbGF0ZUZuXztcbiAgICAgICAgfSxcblxuICAgICAgICBoaXRUZXN0OiBmdW5jdGlvbihldmVudEFyZ3MpIHtcbiAgICAgICAgICAgIC8vVE9ETzogcmVtb3ZlIGhpdFRlc3RHcm91cCBhbmQgaGl0VGVzdEdyb3VwSXRlbVxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSBldmVudEFyZ3MucGFnZVg7XG4gICAgICAgICAgICB2YXIgdG9wID0gZXZlbnRBcmdzLnBhZ2VZO1xuICAgICAgICAgICAgdmFyIGhpdFRlc3RJbmZvID0gaGl0VGVzdF8uY2FsbChzZWxmLCBsZWZ0LCB0b3ApO1xuICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RJbmZvO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyUmVuZGVyQ2FjaGVfOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVWaWV3cG9ydExheW91dF8gPSBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRHcm91cEluZm9zSGVpZ2h0XzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JvdXBJbmZvcyA9IHNlbGYuZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAwO1xuICAgICAgICAgICAgdmFyIGdyb3VwSW5mbztcbiAgICAgICAgICAgIC8vZ3JvdXAgc3RyYXRlZ3kgbmVlZCB0d28gc3RlcHMgcHJvY2Vzc1xuICAgICAgICAgICAgLy9maXJzdCByb3VuZCwgdXNlIHRoZSBkZWZhdWx0IGNvbnRhaW5lciB0byBjYWxjdWxhdGUgdGhlIGdyb3VwIGhlaWdodFxuICAgICAgICAgICAgLy9zZWNvbmQgcm91bmQsIHVzZSB0aGUgbWF4IGdyb3VwIGhlaWdodCBhcyB0aGUgbWluaGVpZ2h0LCBleHBhbmQgY2hpbGQgZ3JvdXBzIHRvIGZpbGwgdGhlIHJlbWFpbmluZyBzcGFjZS5cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGdyb3VwSW5mb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncm91cEluZm8gPSBncm91cEluZm9zW2ldO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgc2VsZi5nZXRHcm91cEhlaWdodF8oZ3JvdXBJbmZvLCBmYWxzZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cEluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmZvc1tpXS5oZWlnaHQgPSBzZWxmLmdldEdyb3VwSGVpZ2h0Xyhncm91cEluZm9zW2ldLCB0cnVlLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdyb3VwSGVpZ2h0XzogZnVuY3Rpb24oZ3JvdXBJbmZvLCB1cGRhdGVDaGlsZEhlaWdodCwgbWluSGVpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgICAgIHZhciBjb250ZW50UmVjdCA9IGdyaWQuZ2V0Q29udGFpbmVySW5mb18oKS5jb250ZW50UmVjdDtcbiAgICAgICAgICAgIGlmICghbWluSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0ID0gY29udGVudFJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50V2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBncm91cEluZm9zID0gZ3JpZC5ncm91cEluZm9zXztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50V2lkdGggKz0gZ2V0R3JvdXBXaWR0aF8oc2VsZiwgZ3JvdXBJbmZvc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRlbnRXaWR0aCArPSAobGVuZ3RoIC0gMSkgKiBzZWxmLm9wdGlvbnMuZ2FwU2l6ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGVudFdpZHRoID4gKGNvbnRlbnRSZWN0LndpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQgLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRHcm91cEhlaWdodEludGVybmFsXyh0aGlzLCBncm91cEluZm8sIHVwZGF0ZUNoaWxkSGVpZ2h0LCBtaW5IZWlnaHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VXaGVlbC5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlV2hlZWwpO1xuICAgICAgICAgICAgZ3JpZC5vbk1vdXNlRG93bi5yZW1vdmVIYW5kbGVyKGhhbmRsZU1vdXNlRG93bik7XG4gICAgICAgICAgICBncmlkLm9uTW91c2VNb3ZlLnJlbW92ZUhhbmRsZXIoc2VsZi5oYW5kbGVNb3VzZU1vdmVGbl8pO1xuICAgICAgICAgICAgZ3JpZC5vblRvdWNoU3RhcnRfLnJlbW92ZUhhbmRsZXIoc2VsZi5oYW5kbGVUb3VjaFN0YXJ0Rm5fKTtcbiAgICAgICAgICAgIHNlbGYuZ3JpZCA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9KU09OOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICAgICAgdmFyIGpzb25PYmogPSB7fTtcbiAgICAgICAgICAgIGpzb25PYmoubmFtZSA9IHNlbGYubmFtZTtcbiAgICAgICAgICAgIHZhciB0cmVsbGlzT3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaXRlbVdpZHRoICE9PSAxNTApIHtcbiAgICAgICAgICAgICAgICB0cmVsbGlzT3B0aW9ucy5pdGVtV2lkdGggPSBvcHRpb25zLml0ZW1XaWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ2FwU2l6ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgIHRyZWxsaXNPcHRpb25zLmdhcFNpemUgPSBvcHRpb25zLmdhcFNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncm91cExheW91dEZuKSB7XG4gICAgICAgICAgICAgICAgdHJlbGxpc09wdGlvbnMuZ3JvdXBMYXlvdXRGbiA9IGdjVXRpbHMuc2VyaWFsaXplRnVuY3Rpb24ob3B0aW9ucy5ncm91cExheW91dEZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJvd1RlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdHJlbGxpc09wdGlvbnMucm93VGVtcGxhdGUgPSBvcHRpb25zLnJvd1RlbXBsYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkodHJlbGxpc09wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAganNvbk9iai5vcHRpb25zID0gdHJlbGxpc09wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ganNvbk9iajtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBoaXRUZXN0R3JvdXBfKHNlbGYsIGdyb3VwSW5mbywgbGVmdCwgdG9wKSB7XG4gICAgICAgIHZhciBsYXlvdXRFbmdpbmUgPSBzZWxmLmdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgZ3JvdXBIZWFkZXJIZWlnaHQ7XG4gICAgICAgIHZhciBnYXBTaXplID0gc2VsZi5vcHRpb25zLmdhcFNpemU7XG4gICAgICAgIHZhciBncm91cCA9IGdyb3VwSW5mby5kYXRhO1xuICAgICAgICB2YXIgbGF5b3V0O1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciBjaGlsZHJlbjtcbiAgICAgICAgdmFyIGdyb3VwV2lkdGg7XG4gICAgICAgIHZhciBncm91cEhlaWdodDtcbiAgICAgICAgdmFyIGhpdFRlc3RJbmZvO1xuICAgICAgICBncm91cEhlYWRlckhlaWdodCA9IGxheW91dEVuZ2luZS5nZXRHcm91cEhlYWRlckhlaWdodF8oZ3JvdXApO1xuICAgICAgICBpZiAodG9wIDw9IGdyb3VwSGVhZGVySGVpZ2h0KSB7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYXJlYTogVklFV1BPUlQsXG4gICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgIGdyb3VwSW5mbzoge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfSEVBREVSXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvcCAtPSAoZ3JvdXBIZWFkZXJIZWlnaHQgKyBnYXBTaXplKTtcbiAgICAgICAgaWYgKGdyb3VwSW5mby5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICB2YXIgZ3JvdXBDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBzZWxmLmdyaWQudWlkICsgJy1nJyArIGdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICcgLmdjLXRyZWxsaXMtZ3JvdXAtYm9keScpO1xuICAgICAgICAgICAgaGl0VGVzdEluZm8gPSBsYXlvdXRFbmdpbmUuaGl0VGVzdEdyb3VwQ29udGVudF8oZ3JvdXBJbmZvLCBWSUVXUE9SVCwgbGVmdCwgdG9wLCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGdldEdyb3VwV2lkdGhfKHNlbGYsIGdyb3VwSW5mbyksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBncm91cEluZm8uaGVpZ2h0IC0gKGdyb3VwSGVhZGVySGVpZ2h0ICsgZ2FwU2l6ZSksXG4gICAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogZ3JvdXBDb250ZW50LnNjcm9sbExlZnQsIC8vR3JvdXAgY29udGVudCBtYXkgaGF2ZSBzY3JvbGxiYXJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IGdyb3VwQ29udGVudC5zY3JvbGxUb3BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9mb3IgdGhlIHRyZWxsaXMgZ3JvdXAsIHRoZSBsYXMgZ3JvdXAgY29udGVudCBhcmVhIGNvbnRhaW5zIGVtcHR5IHNwYWNlIGluIHNvbWUgY2FzZVxuICAgICAgICAgICAgaWYgKGhpdFRlc3RJbmZvID09PSBudWxsICYmIHRvcCA8IGdyb3VwSW5mby5oZWlnaHQgLSAoZ3JvdXBIZWFkZXJIZWlnaHQgKyBnYXBTaXplKSkge1xuICAgICAgICAgICAgICAgIGhpdFRlc3RJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICBhcmVhOiBWSUVXUE9SVCxcbiAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBncm91cEluZm8ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYTogR1JPVVBfQ09OVEVOVFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoaXRUZXN0SW5mbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoaWxkcmVuID0gZ3JvdXBJbmZvLmNoaWxkcmVuO1xuICAgICAgICAgICAgbGF5b3V0ID0gb3B0aW9ucy5ncm91cExheW91dEZuID8gb3B0aW9ucy5ncm91cExheW91dEZuKGdyb3VwKSA6IERFRkFVTFRMQVlPVVQ7XG4gICAgICAgICAgICBpZiAobGF5b3V0LmRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBncm91cEhlaWdodCA9IGNoaWxkcmVuW2ldLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcCA8PSBncm91cEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RHcm91cF8oc2VsZiwgY2hpbGRyZW5baV0sIGxlZnQsIHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9wIC09IChncm91cEhlaWdodCArIGdhcFNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBXaWR0aCA9IGdldEdyb3VwV2lkdGhfKHNlbGYsIGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlZnQgPD0gZ3JvdXBXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RHcm91cF8oc2VsZiwgY2hpbGRyZW5baV0sIGxlZnQsIHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGVmdCAtPSAoZ3JvdXBXaWR0aCArIGdhcFNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaXRUZXN0XyhsZWZ0LCB0b3ApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbGF5b3V0SW5mbyA9IHNlbGYuZ2V0TGF5b3V0SW5mbygpW1ZJRVdQT1JUXTtcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBjb250YWluZXJJbmZvID0gZ3JpZC5nZXRDb250YWluZXJJbmZvXygpLmNvbnRlbnRSZWN0O1xuICAgICAgICB2YXIgZ3JvdXBJbmZvcztcbiAgICAgICAgdmFyIGdyb3VwV2lkdGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICBsZWZ0ID0gbGVmdCAtIChjb250YWluZXJJbmZvLmxlZnQpO1xuICAgICAgICB0b3AgPSB0b3AgLSAoY29udGFpbmVySW5mby50b3ApO1xuICAgICAgICBpZiAoY29udGFpbnNfKGxheW91dEluZm8sIHtsZWZ0OiBsZWZ0LCB0b3A6IHRvcH0pKSB7XG4gICAgICAgICAgICBsZWZ0ICs9IGdyaWQuc2Nyb2xsT2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICB0b3AgKz0gZ3JpZC5zY3JvbGxPZmZzZXQudG9wO1xuICAgICAgICAgICAgZ3JvdXBJbmZvcyA9IGdyaWQuZ3JvdXBJbmZvc187XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBncm91cEluZm9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBXaWR0aCA9IGdldEdyb3VwV2lkdGhfKHNlbGYsIGdyb3VwSW5mb3NbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChsZWZ0IDw9IGdyb3VwV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdFRlc3RHcm91cF8oc2VsZiwgZ3JvdXBJbmZvc1tpXSwgbGVmdCwgdG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGVmdCAtPSAoZ3JvdXBXaWR0aCArIHNlbGYub3B0aW9ucy5nYXBTaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb250YWluc18obGF5b3V0SW5mbywgcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50LmxlZnQgPj0gbGF5b3V0SW5mby5sZWZ0ICYmIHBvaW50LnRvcCA+PSBsYXlvdXRJbmZvLnRvcCAmJiBwb2ludC5sZWZ0IDw9IChsYXlvdXRJbmZvLmxlZnQgKyBsYXlvdXRJbmZvLndpZHRoKSAmJiBwb2ludC50b3AgPD0gKGxheW91dEluZm8udG9wICsgbGF5b3V0SW5mby5oZWlnaHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnQoc2VuZGVyLCBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdGFydCcpO1xuICAgICAgICB2YXIgYXJncyA9IGdldEV2ZW50QXJncyhlKTtcbiAgICAgICAgaWYgKGhhbmRsZVBvaW50ZXJEb3duKHNlbmRlciwgYXJncykpIHtcbiAgICAgICAgICAgIGUuaGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3VzZURvd24oc2VuZGVyLCBlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3VzZSBkb3duJyk7XG4gICAgICAgIGhhbmRsZVBvaW50ZXJEb3duKHNlbmRlciwgZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlckRvd24oc2VuZGVyLCBlLCBtb3VzZUV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gc2VuZGVyLmxheW91dEVuZ2luZS5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgc2VsZi5oaXRUZXN0SW5mb18gPSBzZWxmLmhpdFRlc3QoZSk7XG4gICAgICAgIHZhciBoaXRJbmZvID0gc2VsZi5oaXRUZXN0SW5mb187XG4gICAgICAgIGlmICghaGl0SW5mbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYubW91c2VEb3duSGl0SW5mb18gPSBoaXRJbmZvO1xuICAgICAgICAvL3ZhciBoaSA9IHNlbGYuaGl0VGVzdChlKTtcbiAgICAgICAgLy9zZWxmLmhpdFRlc3RJdGVtSW5mb18gPSBzZWxmLmhpdFRlc3RHcm91cEl0ZW0oZS5wYWdlWCwgZS5wYWdlWSk7XG4gICAgICAgIHZhciBncm91cEluZm8gPSBoaXRJbmZvLmdyb3VwSW5mbztcbiAgICAgICAgaWYgKGdyb3VwSW5mbyAmJiBncm91cEluZm8uYXJlYSA9PT0gJ2dyb3VwQ29udGVudCcgJiYgZ3JvdXBJbmZvLnJvdyA+PSAwICYmIGdyb3VwSW5mby5jb2x1bW4gPj0gMCAmJiAhc2VsZi5kcmFnRHJvcFN0YXR1cykge1xuICAgICAgICAgICAgLy9kaXNhYmxlIGRyYWcgZWZmZWN0IG9uIHRoZSBlbGVtZW50cyBsaWtlIDxpbWc+PC9pbWc+XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgJiYgZS50YXJnZXQuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydE1vdmVJdGVtXyhlLCBzZWxmLCBtb3VzZUV2ZW50KTtcbiAgICAgICAgICAgIHNlbGYuZHJhZ0Ryb3BTdGF0dXMgPSBTVEFSVERSQUc7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaE1vdmUoZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBhcmdzID0gZ2V0RXZlbnRBcmdzKGUpO1xuICAgICAgICBjb25zb2xlLmxvZygndG91Y2ggbW92ZScpO1xuICAgICAgICBpZiAoaGFuZGxlUG9pbnRlck1vdmUuY2FsbChzZWxmLCBhcmdzKSkge1xuICAgICAgICAgICAgZS5oYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlTW92ZShzZW5kZXIsIGUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZygnbW91c2UgbW92ZScpO1xuICAgICAgICAvL2NhbGwgZnJvbSBkb2N1bWVudCBtb3VzZW1vdmVcbiAgICAgICAgaWYgKCFlICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzZW5kZXIpID09PSAnW29iamVjdCBNb3VzZUV2ZW50XScpIHtcbiAgICAgICAgICAgIGUgPSBzZW5kZXI7XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVQb2ludGVyTW92ZS5jYWxsKHNlbGYsIGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBvaW50ZXJNb3ZlKGUpIHtcbiAgICAgICAgdmFyIGdyaWQgPSB0aGlzO1xuICAgICAgICB2YXIgc2VsZiA9IGdyaWQubGF5b3V0RW5naW5lLmdyb3VwU3RyYXRlZ3lfO1xuICAgICAgICBzZWxmLmhpdFRlc3RJbmZvXyA9IHNlbGYuaGl0VGVzdChlKTtcbiAgICAgICAgaWYgKHNlbGYubW92ZUdyb3VwSXRlbV8pIHtcbiAgICAgICAgICAgIHNlbGYuZHJhZ0Ryb3BTdGF0dXMgPSBEUkFHTU9WSU5HO1xuICAgICAgICAgICAgY29udGludWVNb3ZlSXRlbV8uY2FsbChzZWxmLCBlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdXNlV2hlZWwoc2VuZGVyLCBlKSB7XG4gICAgICAgIHZhciBncmlkID0gc2VuZGVyO1xuICAgICAgICB2YXIgZ3JvdXBTdHJhdGVneSA9IGdyaWQubGF5b3V0RW5naW5lLmdyb3VwU3RyYXRlZ3lfO1xuICAgICAgICB2YXIgb2Zmc2V0RGVsdGEgPSBlLmRlbHRhWTtcbiAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgbGF5b3V0ID0gZ3JvdXBTdHJhdGVneS5nZXRMYXlvdXRJbmZvKCkudmlld3BvcnQ7XG4gICAgICAgICAgICB2YXIgaGFzVmVydGljYWwgPSBsYXlvdXQuaGVpZ2h0IDwgbGF5b3V0LmNvbnRlbnRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgaGFzSG9yaXpvbnRhbCA9IGxheW91dC53aWR0aCA8IGxheW91dC5jb250ZW50V2lkdGg7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsYmFySGVpZ2h0ID0gKGhhc0hvcml6b250YWwgJiYgaGFzVmVydGljYWwpID8gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IDogMDtcbiAgICAgICAgICAgIHZhciBtYXhPZmZzZXRUb3AgPSBNYXRoLm1heChsYXlvdXQuY29udGVudEhlaWdodCAtIGxheW91dC5oZWlnaHQgKyBzY3JvbGxiYXJIZWlnaHQsIDApO1xuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9IGdyaWQuc2Nyb2xsT2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3A7XG4gICAgICAgICAgICBpZiAob2Zmc2V0RGVsdGEgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA+PSBtYXhPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKG9mZnNldFRvcCArIG9mZnNldERlbHRhLCBtYXhPZmZzZXRUb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9mZnNldFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gTWF0aC5tYXgob2Zmc2V0VG9wICsgb2Zmc2V0RGVsdGEsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbVV0aWwuZ2V0RWxlbWVudCgnIycgKyBncmlkLnVpZCArICctdmlld3BvcnQtc2Nyb2xsJykuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLmxheW91dEVuZ2luZS5ncm91cFN0cmF0ZWd5XztcbiAgICAgICAgY29uc29sZS5sb2coJ3RvdWNoIGVuZCcpO1xuICAgICAgICBlbmRNb3ZlSXRlbV8uY2FsbChzZWxmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE1vdmVJdGVtXyhlLCBncm91cFN0cmF0ZWd5LCBtb3VzZUV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gZ3JvdXBTdHJhdGVneTtcbiAgICAgICAgdmFyIGhpdEdyb3VwSW5mbyA9IHNlbGYubW91c2VEb3duSGl0SW5mb18uZ3JvdXBJbmZvO1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGhpdEdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyBoaXRHcm91cEluZm8ucm93KTtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsZW1lbnRTdHlsZSA9IGRvbVV0aWwuZ2V0U3R5bGUoZWxlbWVudCk7XG4gICAgICAgIHZhciBlbGVtZW50TWFyZ2luVG9wID0gcGFyc2VGbG9hdChlbGVtZW50U3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShNQVJHSU5fVE9QKSk7XG4gICAgICAgIHZhciBlbGVtZW50TWFyZ2luTGVmdCA9IHBhcnNlRmxvYXQoZWxlbWVudFN0eWxlLmdldFByb3BlcnR5VmFsdWUoTUFSR0lOX0xFRlQpKTtcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSBkb21VdGlsLm9mZnNldChlbGVtZW50KTtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgc2VsZi5tb3ZlR3JvdXBJdGVtXyA9IHNlbGYuZ3JpZC5nZXRHcm91cEluZm9fKGhpdEdyb3VwSW5mby5wYXRoKS5kYXRhLmdldEl0ZW0oaGl0R3JvdXBJbmZvLnJvdyk7XG4gICAgICAgIGlmICghc2VsZi5wbGFjZUhvbGRlckVsZW1lbnRfKSB7XG4gICAgICAgICAgICBzZWxmLnBsYWNlSG9sZGVyRWxlbWVudF8gPSBlbGVtZW50LmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgICAgICBkb21VdGlsLnNldENzcyhzZWxmLnBsYWNlSG9sZGVyRWxlbWVudF8sIHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICcjOTk5JyxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiBlbGVtZW50U3R5bGUud2lkdGgsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6IGVsZW1lbnRTdHlsZS5oZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy92YXIgY29udGVudGFyZWEgPSBzZWxmLnBsYWNlSG9sZGVyRWxlbWVudF8uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAvL2lmIChjb250ZW50YXJlYSkge1xuICAgICAgICAgICAgLy8gICAgY29udGVudGFyZWEuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAvLyAgICBkb21VdGlsLnNldENzcyhjb250ZW50YXJlYSwgeydiYWNrZ3JvdW5kJzogJyM5OTknfSk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgICAgICBtb3ZlUGxhY2VIb2xkZXJfKGUsIHNlbGYpO1xuXG4gICAgICAgIHNlbGYubW92aW5nRWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgICAgIHNlbGYuaXRlbU9mZnNldEZyb21Qb2ludF8gPSB7XG4gICAgICAgICAgICBsZWZ0OiBlLnBhZ2VYIC0gKGVsZW1lbnRPZmZzZXQubGVmdCAtIGVsZW1lbnRNYXJnaW5MZWZ0KSxcbiAgICAgICAgICAgIHRvcDogZS5wYWdlWSAtIChlbGVtZW50T2Zmc2V0LnRvcCAtIGVsZW1lbnRNYXJnaW5Ub3ApXG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzZWxmLm1vdmluZ0VsZW1lbnRfKTtcbiAgICAgICAgZG9tVXRpbC5zZXRDc3Moc2VsZi5tb3ZpbmdFbGVtZW50Xywge1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiAoZS5wYWdlWCAtIHNlbGYuaXRlbU9mZnNldEZyb21Qb2ludF8ubGVmdCkgKyAncHgnLFxuICAgICAgICAgICAgdG9wOiAoZS5wYWdlWSAtIHNlbGYuaXRlbU9mZnNldEZyb21Qb2ludF8udG9wKSArICdweCdcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYubW91c2VTdGFydFBvc2l0aW9uXyA9IHtsZWZ0OiBlLnBhZ2VYLCB0b3A6IGUucGFnZVl9O1xuICAgICAgICBzZWxmLmlzbW91c2VFdmVudF8gPSBtb3VzZUV2ZW50O1xuICAgICAgICBpZiAobW91c2VFdmVudCkge1xuICAgICAgICAgICAgc2VsZi5tb3VzZVVwSGFuZGxlcl8gPSBlbmRNb3ZlSXRlbV8uYmluZChzZWxmKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNlbGYuaGFuZGxlTW91c2VNb3ZlRm5fKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm1vdXNlVXBIYW5kbGVyXyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUb3VjaFdyYXBwZXIoZG9jdW1lbnQpLm9uKCd0b3VjaG1vdmUnLCBzZWxmLmhhbmRsZVRvdWNoTW92ZUZuXyk7XG4gICAgICAgICAgICBUb3VjaFdyYXBwZXIoZG9jdW1lbnQpLm9uKCd0b3VjaGVuZCcsIHNlbGYuaGFuZGxlVG91Y2hFbmRGbl8pO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArICcgbm8tc2VsZWN0JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb250aW51ZU1vdmVJdGVtXyhlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGhpdEdyb3VwSW5mbyA9IHNlbGYubW91c2VEb3duSGl0SW5mb18uZ3JvdXBJbmZvO1xuICAgICAgICBpZiAoIWhpdEdyb3VwSW5mbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9tVXRpbC5zZXRDc3Moc2VsZi5tb3ZpbmdFbGVtZW50Xywge1xuICAgICAgICAgICAgJ2xlZnQnOiAoZS5wYWdlWCAtIHNlbGYuaXRlbU9mZnNldEZyb21Qb2ludF8ubGVmdCkgKyAncHgnLFxuICAgICAgICAgICAgJ3RvcCc6IChlLnBhZ2VZIC0gc2VsZi5pdGVtT2Zmc2V0RnJvbVBvaW50Xy50b3ApICsgJ3B4J1xuICAgICAgICB9KTtcbiAgICAgICAgbW92ZVBsYWNlSG9sZGVyXyhlLCBzZWxmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRNb3ZlSXRlbV8oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKHNlbGYuZHJhZ0Ryb3BTdGF0dXMgPT09IFNUQVJURFJBRyB8fCBzZWxmLmRyYWdEcm9wU3RhdHVzID09PSBEUkFHTU9WSU5HKSB7XG4gICAgICAgICAgICB1cGRhdGVEYXRhVmlld18oc2VsZik7XG4gICAgICAgICAgICBpZiAoc2VsZi5pc21vdXNlRXZlbnRfKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2VsZi5oYW5kbGVNb3VzZU1vdmVGbl8pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm1vdXNlVXBIYW5kbGVyXyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRvdWNoV3JhcHBlcihkb2N1bWVudCkub2ZmKCd0b3VjaG1vdmUnLCBzZWxmLmhhbmRsZVRvdWNoTW92ZUZuXyk7XG4gICAgICAgICAgICAgICAgVG91Y2hXcmFwcGVyKGRvY3VtZW50KS5vZmYoJ3RvdWNoZW5kJywgc2VsZi5oYW5kbGVUb3VjaEVuZEZuXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNlbGYubW92aW5nRWxlbWVudF8pO1xuICAgICAgICAgICAgc2VsZi5tb3VzZU1vdmVIYW5kbGVyXyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLm1vdXNlVXBIYW5kbGVyXyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLmhpdFRlc3RJdGVtSW5mb18gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5tb3VzZVN0YXJ0UG9zaXRpb25fID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYubW92ZUdyb3VwSXRlbV8gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5tb3VzZURvd25IaXRJbmZvXyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLnBsYWNlSG9sZGVyRWxlbWVudF8gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5wbGFjZUhvbGRlckdyb3VwSW5mb18gPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5tb3ZpbmdFbGVtZW50XyA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLmRyYWdEcm9wU3RhdHVzID0gbnVsbDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgnbm8tc2VsZWN0JywgJycpO1xuICAgICAgICAgICAgc2VsZi5ncmlkLmludmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGFWaWV3XyhzZWxmKSB7XG4gICAgICAgIGlmIChzZWxmLnBsYWNlSG9sZGVyR3JvdXBJbmZvXykge1xuICAgICAgICAgICAgdmFyIGdyb3VwcyA9IHNlbGYuZ3JpZC5kYXRhLmdyb3VwcztcbiAgICAgICAgICAgIHZhciBmaWVsZDtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgICAgIHZhciBsZW5ndGg7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIHZhciBncm91cFBhdGggPSBzZWxmLnBsYWNlSG9sZGVyR3JvdXBJbmZvXy5wYXRoO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZ3JvdXBQYXRoLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBncm91cFBhdGhbaV07XG4gICAgICAgICAgICAgICAgZmllbGQgPSBncm91cHNbaW5kZXhdLmdyb3VwRGVzY3JpcHRvci5maWVsZDtcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IGdyb3Vwc1tpbmRleF0uZ2V0SXRlbSgwKVtmaWVsZF07XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYubW92ZUdyb3VwSXRlbV9bZmllbGRdICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1vdmVHcm91cEl0ZW1fW2ZpZWxkXSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncm91cHMgPSBncm91cHNbaW5kZXhdLmdyb3VwcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZ3JpZC5kYXRhLnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEV2ZW50QXJncyhlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYWdlWDogZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgICAgICAgcGFnZVk6IGUudGFyZ2V0VG91Y2hlc1swXS5wYWdlWSxcbiAgICAgICAgICAgIHRhcmdldDogZS50YXJnZXRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlUGxhY2VIb2xkZXJfKGUsIHNlbGYpIHtcbiAgICAgICAgaWYgKCFzZWxmLmhpdFRlc3RJbmZvXykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoaXRHcm91cEluZm8gPSBzZWxmLmhpdFRlc3RJbmZvXy5ncm91cEluZm87XG4gICAgICAgIGlmIChoaXRHcm91cEluZm8pIHtcbiAgICAgICAgICAgIHZhciBncm91cEluZm8gPSBzZWxmLmdyaWQuZ2V0R3JvdXBJbmZvXyhoaXRHcm91cEluZm8ucGF0aCk7XG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgICAgIGlmIChncm91cCAmJiBncm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBzZWxmLmdyaWQudWlkICsgJy1nJyArIGhpdEdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICcgLmdjLXRyZWxsaXMtZ3JvdXAtYm9keS1pbm5lcicpO1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoaGl0R3JvdXBJbmZvLnJvdyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb3VzZURvd25Hcm91cEluZm8gPSBzZWxmLm1vdXNlRG93bkhpdEluZm9fLmdyb3VwSW5mbztcbiAgICAgICAgICAgICAgICAgICAgLy9kcmFnIGRyb3AgaW4gdGhlIHNhbWUgZ3JvdXAgaXMgdGhlIHNwZWNpYWwgY2FzZSBzaW5jZSBpdCB3aWxsIHJlbW92ZSBvbmUgaXRlbSBhdCB0aGUgYmVnaW5pbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGhpdEdyb3VwSW5mby5wYXRoKSA9PT0gSlNPTi5zdHJpbmdpZnkobW91c2VEb3duR3JvdXBJbmZvLnBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5ncmlkLnVpZCArICctZ3InICsgaGl0R3JvdXBJbmZvLnBhdGguam9pbignXycpICsgJy1yJyArIChoaXRHcm91cEluZm8ucm93ID49IG1vdXNlRG93bkdyb3VwSW5mby5yb3cgPyAoaGl0R3JvdXBJbmZvLnJvdyArIDEpIDogaGl0R3JvdXBJbmZvLnJvdykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuZ3JpZC51aWQgKyAnLWdyJyArIGhpdEdyb3VwSW5mby5wYXRoLmpvaW4oJ18nKSArICctcicgKyBoaXRHcm91cEluZm8ucm93KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50Lmluc2VydEJlZm9yZShzZWxmLnBsYWNlSG9sZGVyRWxlbWVudF8sIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHNlbGYucGxhY2VIb2xkZXJFbGVtZW50Xyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYucGxhY2VIb2xkZXJHcm91cEluZm9fID0gaGl0R3JvdXBJbmZvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmF3Um93VGVtcGxhdGVfKGxheW91dEVuZ2luZSkge1xuICAgICAgICB2YXIgc2VsZiA9IGxheW91dEVuZ2luZTtcbiAgICAgICAgdmFyIHJvd1RtcGwgPSBzZWxmLm9wdGlvbnMucm93VGVtcGxhdGU7XG4gICAgICAgIGlmIChyb3dUbXBsKSB7XG4gICAgICAgICAgICBpZiAoZ2NVdGlscy5pc1N0cmluZyhyb3dUbXBsKSAmJiByb3dUbXBsLmxlbmd0aCA+IDEgJiYgcm93VG1wbFswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocm93VG1wbC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRtcGxFbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvd1RtcGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RGVmYXVsdFJhd1Jvd1RlbXBsYXRlXyhzZWxmKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRSYXdSb3dUZW1wbGF0ZV8oc2VsZikge1xuICAgICAgICB2YXIgY29scyA9IHNlbGYuZ3JpZC5jb2x1bW5zO1xuICAgICAgICB2YXIgY29sO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gc2VsZi5ncmlkLmxheW91dEVuZ2luZS5nZXRSb3dIZWlnaHRfKCk7XG4gICAgICAgIHZhciByID0gJzxkaXY+PGRpdiBjbGFzcz1cImdjLXRyZWxsaXMtZ3JvdXAtaXRlbVwiIHN0eWxlPVwiaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7XCI+JztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGNvbHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbCA9IGNvbHNbaV07XG4gICAgICAgICAgICBpZiAoY29sLnZpc2libGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgciArPSAnPGRpdiAgZGF0YS1jb2x1bW49XCInICsgY29sLmlkICsgJ1wiPjwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgciArPSAnPC9kaXY+PC9kaXY+JztcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRMYXlvdXRJbmZvXyhzZWxmKSB7XG4gICAgICAgIGlmIChzZWxmLmNhY2hlVmlld3BvcnRMYXlvdXRfKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jYWNoZVZpZXdwb3J0TGF5b3V0XztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGdyb3VwcyA9IGdyaWQuZGF0YS5ncm91cHM7XG4gICAgICAgIGlmICghZ3JvdXBzIHx8IGdyb3Vwcy5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRhaW5lckluZm8gPSBncmlkLmdldENvbnRhaW5lckluZm9fKCkuY29udGVudFJlY3Q7XG4gICAgICAgIHZhciB3aWR0aCA9IGNvbnRhaW5lckluZm8ud2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSBjb250YWluZXJJbmZvLmhlaWdodDtcbiAgICAgICAgdmFyIGdhcFNpemUgPSBzZWxmLm9wdGlvbnMuZ2FwU2l6ZTtcblxuICAgICAgICB2YXIgY29udGVudFdpZHRoID0gMDtcbiAgICAgICAgdmFyIGNvbnRlbnRIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHZhciB0ZW1wSGVpZ2h0ID0gMDtcbiAgICAgICAgdmFyIGdyb3VwSW5mb3MgPSBncmlkLmdyb3VwSW5mb3NfO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ3JvdXBJbmZvcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29udGVudFdpZHRoICs9IE1hdGguY2VpbChnZXRHcm91cFdpZHRoXyhzZWxmLCBncm91cEluZm9zW2ldKSk7XG4gICAgICAgICAgICB0ZW1wSGVpZ2h0ID0gTWF0aC5tYXgodGVtcEhlaWdodCwgZ3JvdXBJbmZvc1tpXS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnRXaWR0aCArPSAobGVuZ3RoIC0gMSkgKiBnYXBTaXplO1xuICAgICAgICBpZiAoY29udGVudFdpZHRoID4gd2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQgLT0gZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnRIZWlnaHQgPSBNYXRoLm1heChjb250ZW50SGVpZ2h0LCB0ZW1wSGVpZ2h0KTtcbiAgICAgICAgd2lkdGggPSAoaGVpZ2h0ID49IGNvbnRlbnRIZWlnaHQpID8gd2lkdGggOiAod2lkdGggLSBkb21VdGlsLmdldFNjcm9sbGJhclNpemUoKS53aWR0aCk7XG4gICAgICAgIGhlaWdodCA9ICh3aWR0aCA+PSBjb250ZW50V2lkdGgpID8gaGVpZ2h0IDogKGhlaWdodCAtIGRvbVV0aWwuZ2V0U2Nyb2xsYmFyU2l6ZSgpLmhlaWdodCk7XG4gICAgICAgIHNlbGYuY2FjaGVWaWV3cG9ydExheW91dF8gPSB7XG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICBjb250ZW50V2lkdGg6IGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ6IGNvbnRlbnRIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VsZi5jYWNoZVZpZXdwb3J0TGF5b3V0XztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHcm91cFdpZHRoXyhzZWxmLCBncm91cEluZm8pIHtcbiAgICAgICAgaWYgKGdyb3VwSW5mby53aWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGdyb3VwSW5mby53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICAgICAgdmFyIGxheW91dCA9IG9wdGlvbnMuZ3JvdXBMYXlvdXRGbiA/IG9wdGlvbnMuZ3JvdXBMYXlvdXRGbihncm91cEluZm8uZGF0YSkgOiBERUZBVUxUTEFZT1VUO1xuICAgICAgICB2YXIgcmVzdWx0ID0gMDtcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBJbmZvLmRhdGE7XG4gICAgICAgIGlmICghZ3JvdXAuaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGdyb3VwSW5mby5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGF5b3V0LmRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGgubWF4KHJlc3VsdCwgZ2V0R3JvdXBXaWR0aF8oc2VsZiwgZ3JvdXBJbmZvLmNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBnZXRHcm91cFdpZHRoXyhzZWxmLCBncm91cEluZm8uY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gKGxlbmd0aCAtIDEpICogb3B0aW9ucy5nYXBTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gb3B0aW9ucy5pdGVtV2lkdGggKiBsYXlvdXQuY29sdW1uU3BhbjtcbiAgICAgICAgfVxuICAgICAgICBncm91cEluZm8ud2lkdGggPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBIZWlnaHRJbnRlcm5hbF8oc2VsZiwgZ3JvdXBJbmZvLCB1cGRhdGVDaGlsZEhlaWdodCwgbWluSGVpZ2h0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgZ3JpZCA9IHNlbGYuZ3JpZDtcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgdmFyIGxheW91dCA9IG9wdGlvbnMuZ3JvdXBMYXlvdXRGbiA/IG9wdGlvbnMuZ3JvdXBMYXlvdXRGbihncm91cCkgOiBERUZBVUxUTEFZT1VUO1xuICAgICAgICB2YXIgaGVhZGVySGVpZ2h0ID0gbGF5b3V0RW5naW5lLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICB2YXIgZ2FwU2l6ZSA9IG9wdGlvbnMuZ2FwU2l6ZTtcbiAgICAgICAgdmFyIGhlaWdodDtcbiAgICAgICAgaWYgKCFncm91cEluZm8uaXNCb3R0b21MZXZlbCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gZ3JvdXBJbmZvLmNoaWxkcmVuO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxheW91dC5kaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgLy9mb3IgdGhlIHZlcnRpY2FsIGRpcmVjdGlvbiwgd2UgZXhwYW5kIHRoZSBsYXN0IGdyb3VwIHRvIGZpbGwgdGhlIHJlbWFpbmluZyBzcGFjZS5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGdldEdyb3VwSGVpZ2h0SW50ZXJuYWxfKHNlbGYsIGNoaWxkcmVuW2ldLCB1cGRhdGVDaGlsZEhlaWdodCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDaGlsZEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBnYXBTaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQgPSBtaW5IZWlnaHQgLSByZXN1bHQgLSBoZWFkZXJIZWlnaHQgLSBnYXBTaXplO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGdldEdyb3VwSGVpZ2h0SW50ZXJuYWxfKHNlbGYsIGNoaWxkcmVuW2ldLCB1cGRhdGVDaGlsZEhlaWdodCwgbWluSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlQ2hpbGRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gaGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQgPSBtaW5IZWlnaHQgLSBoZWFkZXJIZWlnaHQgLSBnYXBTaXplO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBnZXRHcm91cEhlaWdodEludGVybmFsXyhzZWxmLCBjaGlsZHJlbltpXSwgdXBkYXRlQ2hpbGRIZWlnaHQsIG1pbkhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDaGlsZEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IE1hdGgubWF4KHJlc3VsdCwgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgKz0gaGVhZGVySGVpZ2h0ICsgZ2FwU2l6ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlaWdodCA9IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwSGVpZ2h0KGdyb3VwSW5mbywge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBsYXlvdXQuY29sdW1uU3BhbiAqIG9wdGlvbnMuaXRlbVdpZHRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IG1pbkhlaWdodCAtIGhlYWRlckhlaWdodCAtIGdhcFNpemU7XG4gICAgICAgICAgICByZXN1bHQgPSBoZWFkZXJIZWlnaHQgKyBNYXRoLm1heChtaW5IZWlnaHQsIGhlaWdodCkgKyBvcHRpb25zLmdhcFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUcmVsbGlzUm93Q2FsbGJhY2soZ3JvdXBJbmZvLCBpdGVtSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAnZ2MtdHJlbGxpcy1yb3cnLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3N0YXRpYycsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0R3JvdXBSZW5kZXJlZEhUTUxfKHNlbGYsIGdyb3VwSW5mbykge1xuICAgICAgICB2YXIgZ3JvdXAgPSBncm91cEluZm8uZGF0YTtcbiAgICAgICAgdmFyIGdyaWQgPSBzZWxmLmdyaWQ7XG4gICAgICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgICAgICB2YXIgbGF5b3V0Rm4gPSBvcHRpb25zLmdyb3VwTGF5b3V0Rm47XG4gICAgICAgIHZhciBsYXlvdXQgPSBsYXlvdXRGbiA/IGxheW91dEZuKGdyb3VwKSA6IERFRkFVTFRMQVlPVVQ7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IGdyb3VwSW5mby5jaGlsZHJlbjtcbiAgICAgICAgdmFyIGxheW91dEVuZ2luZSA9IGdyaWQubGF5b3V0RW5naW5lO1xuXG4gICAgICAgIHZhciBpdGVtV2lkdGggPSBvcHRpb25zLml0ZW1XaWR0aDtcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gbGF5b3V0LmNvbHVtblNwYW4gKiBpdGVtV2lkdGg7XG4gICAgICAgIHZhciBncm91cEhlYWRlckhlaWdodCA9IGdyaWQubGF5b3V0RW5naW5lLmdldEdyb3VwSGVhZGVySGVpZ2h0Xyhncm91cCk7XG4gICAgICAgIHZhciBncm91cFBhdGggPSBncm91cEluZm8ucGF0aDtcbiAgICAgICAgdmFyIGdhcFNpemUgPSBvcHRpb25zLmdhcFNpemU7XG4gICAgICAgIHZhciByZW5kZXJlZEhUTUwgPSAnJztcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBsZW5ndGg7XG4gICAgICAgIHZhciBib3R0b21MZXZlbEhlaWdodCA9IDA7XG4gICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgLy9nZXQgZ3JvdXAgcmVuZGVyIGh0bWxcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVkSFRNTCArPSBnZXRHcm91cFJlbmRlcmVkSFRNTF8oc2VsZiwgY2hpbGRyZW5baV0sIGNoaWxkcmVuW2ldLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2dldCBncm91cCBpdGVtIHJlbmRlciBodG1sXG4gICAgICAgICAgICB2YXIgcm93cyA9IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwUmVuZGVySW5mbyhncm91cEluZm8sIHt3aWR0aDogY29udGFpbmVyV2lkdGh9LCBnZXRUcmVsbGlzUm93Q2FsbGJhY2suYmluZChzZWxmKSk7XG4gICAgICAgICAgICBib3R0b21MZXZlbEhlaWdodCA9IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwSGVpZ2h0KGdyb3VwSW5mbywge3dpZHRoOiBjb250YWluZXJXaWR0aH0pO1xuICAgICAgICAgICAgdmFyIGlubmVyV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgICAgIGlmIChsYXlvdXRFbmdpbmUuZ2V0SW5uZXJHcm91cFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJXaWR0aCA9IGxheW91dEVuZ2luZS5nZXRJbm5lckdyb3VwV2lkdGgoZ3JvdXBJbmZvLCB7d2lkdGg6IGNvbnRhaW5lcldpZHRofSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaXRlbVJlbmRlcmVkSFRNTCA9ICc8ZGl2IGNsYXNzPVwiZ2MtdHJlbGxpcy1ncm91cC1ib2R5LWlubmVyXCIgc3R5bGU9XCJtaW4td2lkdGg6JyArIGlubmVyV2lkdGggKyAncHg7aGVpZ2h0OicgKyBib3R0b21MZXZlbEhlaWdodCArICdweDtcIj4nO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gcm93cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGl0ZW1SZW5kZXJlZEhUTUwgKz0gZ3JpZC5yZW5kZXJSb3dfKHJvd3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbVJlbmRlcmVkSFRNTCArPSAnPC9kaXY+JztcbiAgICAgICAgICAgIHJlbmRlcmVkSFRNTCA9IGl0ZW1SZW5kZXJlZEhUTUw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGFyZW50R3JvdXAgPSBncm91cC5wYXJlbnQ7XG4gICAgICAgIHZhciBwYXJlbnRMYXlvdXREaXJlY3Rpb24gPSAocGFyZW50R3JvdXAgJiYgbGF5b3V0Rm4pID8gbGF5b3V0Rm4ocGFyZW50R3JvdXApLmRpcmVjdGlvbiA6IERFRkFVTFRMQVlPVVQuZGlyZWN0aW9uO1xuICAgICAgICB2YXIgZ3JvdXBJbmRleCA9IGdyb3VwUGF0aFtncm91cC5sZXZlbF07XG4gICAgICAgIHZhciBncm91cEJvZHlTdHlsZSA9IHtcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogZ2FwU2l6ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChncm91cC5pc0JvdHRvbUxldmVsKSB7XG4gICAgICAgICAgICBncm91cEJvZHlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IGdhcFNpemUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGxheW91dC5jb2x1bW5TcGFuICogaXRlbVdpZHRoLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnYXV0bycsXG4gICAgICAgICAgICAgICAgLy9taW5IZWlnaHQ6IGdyb3VwSW5mby5oZWlnaHQgLSBncm91cEhlYWRlckhlaWdodCAtIGdhcFNpemVcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IGJvdHRvbUxldmVsSGVpZ2h0ICsgZG9tVXRpbC5nZXRTY3JvbGxiYXJTaXplKCkuaGVpZ2h0IC8vbWluLWhlaWdodCB0byBtYWtlIGR5bmFtaWMgaGVpZ2h0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBncm91cEJvZHlDbGFzcyA9IGdyb3VwLmlzQm90dG9tTGV2ZWwgPyAnZ2MtdHJlbGxpcy1ncm91cC1ib2R5IGdjLXRyZWxsaXMtZ3JvdXAtY29udGVudCcgOiAnZ2MtdHJlbGxpcy1ncm91cC1ib2R5JztcblxuICAgICAgICB2YXIgZ3JvdXBTdHlsZSA9IHt9O1xuICAgICAgICBpZiAoZ3JvdXAubGV2ZWwgPT09IDAgfHwgcGFyZW50TGF5b3V0RGlyZWN0aW9uICE9PSBWRVJUSUNBTCkge1xuICAgICAgICAgICAgZ3JvdXBTdHlsZS5tYXJnaW5MZWZ0ID0gKGdyb3VwSW5kZXggPT09IDApID8gMCA6IGdhcFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudExheW91dERpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcbiAgICAgICAgICAgIGdyb3VwU3R5bGUuY2xlYXIgPSAnYm90aCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGVhZGVyU3R5bGUgPSB7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IGdhcFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGdyb3VwSGVhZGVySGVpZ2h0XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVuZGVyZWRIVE1MID0gJzxkaXYgc3R5bGU9XCInICsgZ2NVdGlscy5jcmVhdGVNYXJrdXBGb3JTdHlsZXMoZ3JvdXBTdHlsZSkgKyAnXCIgaWQ9XCInICsgZ3JpZC51aWQgKyAnLWcnICsgZ3JvdXBQYXRoLmpvaW4oJ18nKSArICdcIiBjbGFzcz1cImdjLXRyZWxsaXMtZ3JvdXAgbCcgKyBncm91cC5sZXZlbCArICdcIiA+ICcgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJnYy10cmVsbGlzLWdyb3VwLWhlYWRlclwiIHN0eWxlPVwiJyArIGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzKGhlYWRlclN0eWxlKSArICdcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZ2MtdHJlbGxpcy1ncm91cC1oZWFkZXItaW5uZXJcIiBzdHlsZT1cIm1heC13aWR0aDonICsgZ2V0R3JvdXBXaWR0aF8oc2VsZiwgZ3JvdXBJbmZvKSArICdweDtcIj4nICsgZ3JvdXAubmFtZSArICc8L2Rpdj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiJyArIGdyb3VwQm9keUNsYXNzICsgJ1wiIHN0eWxlPVwiJyArIGdjVXRpbHMuY3JlYXRlTWFya3VwRm9yU3R5bGVzKGdyb3VwQm9keVN0eWxlKSArICdcIj4nICsgcmVuZGVyZWRIVE1MICsgJzwvZGl2PjwvZGl2Pic7XG4gICAgICAgIHJldHVybiByZW5kZXJlZEhUTUw7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUcmVsbGlzU3RyYXRlZ3k7XG59KVxuKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9ncm91cFN0cmF0ZWdpZXMvVHJlbGxpc1N0cmF0ZWd5LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAzXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgVU5ERUZJTkVEID0gJ3VuZGVmaW5lZCc7XG4gICAgdmFyIGdjVXRpbHMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZSh2YWwsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZih2YWwpID09PSB0eXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhc3RzIGEgdmFsdWUgdG8gYSB0eXBlIGlmIHBvc3NpYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGNhc3QuXG4gICAgICogQHBhcmFtIHR5cGUgVHlwZSBvciBpbnRlcmZhY2UgbmFtZSB0byBjYXN0IHRvLlxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIHBhc3NlZCBpbiBpZiB0aGUgY2FzdCB3YXMgc3VjY2Vzc2Z1bCwgbnVsbCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJ5Q2FzdCh2YWx1ZSwgdHlwZSkge1xuICAgICAgICAvLyBudWxsIGRvZXNuJ3QgaW1wbGVtZW50IGFueXRoaW5nXG4gICAgICAgIGlmIChpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGVzdCBmb3IgaW50ZXJmYWNlIGltcGxlbWVudGF0aW9uIChJUXVlcnlJbnRlcmZhY2UpXG4gICAgICAgIGlmIChpc1N0cmluZyh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUuaW1wbGVtZW50c0ludGVyZmFjZSkgJiYgdmFsdWUuaW1wbGVtZW50c0ludGVyZmFjZSh0eXBlKSA/IHZhbHVlIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZ3VsYXIgdHlwZSB0ZXN0XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUgPyB2YWx1ZSA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2NVdGlscy50cnlDYXN0ID0gdHJ5Q2FzdDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBwcmltaXRpdmUgdHlwZSAoc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIG9yIGRhdGUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNQcmltaXRpdmUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzU3RyaW5nKHZhbHVlKSB8fCBpc051bWJlcih2YWx1ZSkgfHwgaXNCb29sZWFuKHZhbHVlKSB8fCBpc0RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2hlY2tUeXBlKHZhbHVlLCAnc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RyaW5nIGlzIG51bGwsIGVtcHR5LCBvciB3aGl0ZXNwYWNlIG9ubHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbE9yV2hpdGVTcGFjZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNVbmRlZmluZWRPck51bGwodmFsdWUpID8gdHJ1ZSA6IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJykubGVuZ3RoIDwgMTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsT3JXaGl0ZVNwYWNlID0gaXNVbmRlZmluZWRPck51bGxPcldoaXRlU3BhY2U7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrVHlwZSh2YWx1ZSwgJ251bWJlcicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSW50KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgPT09IE1hdGgucm91bmQodmFsdWUpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNJbnQgPSBpc0ludDtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBCb29sZWFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdib29sZWFuJyk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsICdmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIHVuZGVmaW5lZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjaGVja1R5cGUodmFsdWUsIFVOREVGSU5FRCk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIERhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4odmFsdWUuZ2V0VGltZSgpKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIH1cblxuICAgIGdjVXRpbHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGFuIG9iamVjdCAoYXMgb3Bwb3NlZCB0byBhIHZhbHVlIHR5cGUgb3IgYSBkYXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSB0byB0ZXN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAhaXNVbmRlZmluZWRPck51bGwodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIWlzRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdHlwZSBvZiBhIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIHRlc3QuXG4gICAgICogQHJldHVybiBBIEBzZWU6RGF0YVR5cGUgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VHlwZSh2YWx1ZSkge1xuICAgICAgICBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ251bWJlcic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdib29sZWFuJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2FycmF5JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZ2V0VHlwZSA9IGdldFR5cGU7XG5cbiAgICBmdW5jdGlvbiBpc051bGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc1VuZGVmaW5lZCh2YWx1ZSkgfHwgaXNOdWxsKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmlzTnVsbCA9IGlzTnVsbDtcbiAgICBnY1V0aWxzLmlzVW5kZWZpbmVkT3JOdWxsID0gaXNVbmRlZmluZWRPck51bGw7XG5cbiAgICAvL1RPRE86IHJldmlldyB0aGlzIG1ldGhvZCBhZnRlciBmb3JtbXR0ZXIgaW1wbGVtZW50YXRpb24gZG9uZS5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSB0eXBlIG9mIGEgdmFsdWUuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgdGhlIG9yaWdpbmFsIHZhbHVlIGlzIHJldHVybmVkLiBUbyBjaGVjayBpZiBhXG4gICAgICogY29udmVyc2lvbiBzdWNjZWVkZWQsIHlvdSBzaG91bGQgY2hlY2sgdGhlIHR5cGUgb2YgdGhlIHJldHVybmVkIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGNvbnZlcnQuXG4gICAgICogQHBhcmFtIHR5cGUgQHNlZTpEYXRhVHlwZSB0byBjb252ZXJ0IHRoZSB2YWx1ZSB0by5cbiAgICAgKiBAcmV0dXJuIFRoZSBjb252ZXJ0ZWQgdmFsdWUsIG9yIHRoZSBvcmlnaW5hbCB2YWx1ZSBpZiBhIGNvbnZlcnNpb24gd2FzIG5vdCBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGFuZ2VUeXBlKHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gY29udmVydCBzdHJpbmdzIHRvIG51bWJlcnMsIGRhdGVzLCBvciBib29sZWFuc1xuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKG51bSkgPyB2YWx1ZSA6IG51bTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IGFueXRoaW5nIHRvIHN0cmluZ1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5jaGFuZ2VUeXBlID0gY2hhbmdlVHlwZTtcbiAgICAvL1xuICAgIC8vLyoqXG4gICAgLy8gKiBSZXBsYWNlcyBlYWNoIGZvcm1hdCBpdGVtIGluIGEgc3BlY2lmaWVkIHN0cmluZyB3aXRoIHRoZSB0ZXh0IGVxdWl2YWxlbnQgb2YgYW5cbiAgICAvLyAqIG9iamVjdCdzIHZhbHVlLlxuICAgIC8vICpcbiAgICAvLyAqIFRoZSBmdW5jdGlvbiB3b3JrcyBieSByZXBsYWNpbmcgcGFydHMgb2YgdGhlIDxiPmZvcm1hdFN0cmluZzwvYj4gd2l0aCB0aGUgcGF0dGVyblxuICAgIC8vICogJ3tuYW1lOmZvcm1hdH0nIHdpdGggcHJvcGVydGllcyBvZiB0aGUgPGI+ZGF0YTwvYj4gcGFyYW1ldGVyLiBGb3IgZXhhbXBsZTpcbiAgICAvLyAqXG4gICAgLy8gKiA8cHJlPlxuICAgIC8vICogdmFyIGRhdGEgPSB7IG5hbWU6ICdKb2UnLCBhbW91bnQ6IDEyMzQ1NiB9O1xuICAgIC8vICogdmFyIG1zZyA9IHdpam1vLmZvcm1hdCgnSGVsbG8ge25hbWV9LCB5b3Ugd29uIHthbW91bnQ6bjJ9IScsIGRhdGEpO1xuICAgIC8vICogPC9wcmU+XG4gICAgLy8gKlxuICAgIC8vICogVGhlIG9wdGlvbmFsIDxiPmZvcm1hdEZ1bmN0aW9uPC9iPiBhbGxvd3MgeW91IHRvIGN1c3RvbWl6ZSB0aGUgY29udGVudCBieSBwcm92aWRpbmdcbiAgICAvLyAqIGNvbnRleHQtc2Vuc2l0aXZlIGZvcm1hdHRpbmcuIElmIHByb3ZpZGVkLCB0aGUgZm9ybWF0IGZ1bmN0aW9uIGdldHMgY2FsbGVkIGZvciBlYWNoXG4gICAgLy8gKiBmb3JtYXQgZWxlbWVudCBhbmQgZ2V0cyBwYXNzZWQgdGhlIGRhdGEgb2JqZWN0LCB0aGUgcGFyYW1ldGVyIG5hbWUsIHRoZSBmb3JtYXQsXG4gICAgLy8gKiBhbmQgdGhlIHZhbHVlOyBpdCBzaG91bGQgcmV0dXJuIGFuIG91dHB1dCBzdHJpbmcuIEZvciBleGFtcGxlOlxuICAgIC8vICpcbiAgICAvLyAqIDxwcmU+XG4gICAgLy8gKiB2YXIgZGF0YSA9IHsgbmFtZTogJ0pvZScsIGFtb3VudDogMTIzNDU2IH07XG4gICAgLy8gKiB2YXIgbXNnID0gd2lqbW8uZm9ybWF0KCdIZWxsbyB7bmFtZX0sIHlvdSB3b24ge2Ftb3VudDpuMn0hJywgZGF0YSxcbiAgICAvLyAqICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhLCBuYW1lLCBmbXQsIHZhbCkge1xuICAgIC8vKiAgICAgICAgICAgICAgIGlmICh3aWptby5pc1N0cmluZyhkYXRhW25hbWVdKSkge1xuICAgIC8vKiAgICAgICAgICAgICAgICAgICB2YWwgPSB3aWptby5lc2NhcGVIdG1sKGRhdGFbbmFtZV0pO1xuICAgIC8vKiAgICAgICAgICAgICAgIH1cbiAgICAvLyogICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgIC8vKiAgICAgICAgICAgICB9KTtcbiAgICAvLyAqIDwvcHJlPlxuICAgIC8vICpcbiAgICAvLyAqIEBwYXJhbSBmb3JtYXQgQSBjb21wb3NpdGUgZm9ybWF0IHN0cmluZy5cbiAgICAvLyAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIG9iamVjdCB1c2VkIHRvIGJ1aWxkIHRoZSBzdHJpbmcuXG4gICAgLy8gKiBAcGFyYW0gZm9ybWF0RnVuY3Rpb24gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0byBmb3JtYXQgaXRlbXMgaW4gY29udGV4dC5cbiAgICAvLyAqIEByZXR1cm4gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXG4gICAgLy8gKi9cbiAgICAvL2Z1bmN0aW9uIGZvcm1hdChmb3JtYXQsIGRhdGEsIGZvcm1hdEZ1bmN0aW9uKSB7XG4gICAgLy8gICAgZm9ybWF0ID0gYXNTdHJpbmcoZm9ybWF0KTtcbiAgICAvLyAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL1xceyguKj8pKDooLio/KSk/XFx9L2csIGZ1bmN0aW9uIChtYXRjaCwgbmFtZSwgeCwgZm10KSB7XG4gICAgLy8gICAgICAgIHZhciB2YWwgPSBtYXRjaDtcbiAgICAvLyAgICAgICAgaWYgKG5hbWUgJiYgbmFtZVswXSAhPSAneycgJiYgZGF0YSkge1xuICAgIC8vICAgICAgICAgICAgLy8gZ2V0IHRoZSB2YWx1ZVxuICAgIC8vICAgICAgICAgICAgdmFsID0gZGF0YVtuYW1lXTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgLy8gYXBwbHkgc3RhdGljIGZvcm1hdFxuICAgIC8vICAgICAgICAgICAgaWYgKGZtdCkge1xuICAgIC8vICAgICAgICAgICAgICAgIHZhbCA9IHdpam1vLkdsb2JhbGl6ZS5mb3JtYXQodmFsLCBmbXQpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBhcHBseSBmb3JtYXQgZnVuY3Rpb25cbiAgICAvLyAgICAgICAgICAgIGlmIChmb3JtYXRGdW5jdGlvbikge1xuICAgIC8vICAgICAgICAgICAgICAgIHZhbCA9IGZvcm1hdEZ1bmN0aW9uKGRhdGEsIG5hbWUsIGZtdCwgdmFsKTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgfVxuICAgIC8vICAgICAgICByZXR1cm4gdmFsID09IG51bGwgPyAnJyA6IHZhbDtcbiAgICAvLyAgICB9KTtcbiAgICAvL31cbiAgICAvL2djVXRpbHMuZm9ybWF0ID0gZm9ybWF0O1xuXG4gICAgLyoqXG4gICAgICogQ2xhbXBzIGEgdmFsdWUgYmV0d2VlbiBhIG1pbmltdW0gYW5kIGEgbWF4aW11bS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBPcmlnaW5hbCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gbWluIE1pbmltdW0gYWxsb3dlZCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0gbWF4IE1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWRPck51bGwobWF4KSAmJiB2YWx1ZSA+IG1heCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZE9yTnVsbChtaW4pICYmIHZhbHVlIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtaW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuY2xhbXAgPSBjbGFtcDtcblxuICAgIC8qKlxuICAgICAqIENvcGllcyB0aGUgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdCB0byBhbm90aGVyLlxuICAgICAqXG4gICAgICogVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBtdXN0IGRlZmluZSBhbGwgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgc291cmNlLFxuICAgICAqIG9yIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRzdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSBzcmMgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29weShkc3QsIHNyYykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBhc3NlcnQoa2V5IGluIGRzdCwgJ1Vua25vd24ga2V5IFwiJyArIGtleSArICdcIi4nKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xuICAgICAgICAgICAgaWYgKCFkc3QuX2NvcHkgfHwgIWRzdC5fY29weShrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgZHN0W2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29weShkc3Rba2V5XSwgdmFsdWUpOyAvLyBjb3B5IHN1Yi1vYmplY3RzXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSB2YWx1ZTsgLy8gYXNzaWduIHZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdjVXRpbHMuY29weSA9IGNvcHk7XG5cbiAgICAvKipcbiAgICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIGEgY29uZGl0aW9uIGlzIGZhbHNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbmRpdGlvbiBDb25kaXRpb24gZXhwZWN0ZWQgdG8gYmUgdHJ1ZS5cbiAgICAgKiBAcGFyYW0gbXNnIE1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvbiBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCB0cnVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1zZykge1xuICAgICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgJyoqIEFzc2VydGlvbiBmYWlsZWQgaW4gV2lqbW86ICcgKyBtc2c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzc2VydCA9IGFzc2VydDtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgc3RyaW5nLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBzdHJpbmcgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3RyaW5nKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc1N0cmluZyh2YWx1ZSksICdTdHJpbmcgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzU3RyaW5nID0gYXNTdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBudW1lcmljLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpdmUgV2hldGhlciB0byBhY2NlcHQgb25seSBwb3NpdGl2ZSBudW1lcmljIHZhbHVlcy5cbiAgICAgKiBAcmV0dXJuIFRoZSBudW1iZXIgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzTnVtYmVyKHZhbHVlLCBudWxsT0ssIHBvc2l0aXZlKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tUeXBlKHBvc2l0aXZlLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBwb3NpdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNOdW1iZXIodmFsdWUpLCAnTnVtYmVyIGV4cGVjdGVkLicpO1xuICAgICAgICBpZiAocG9zaXRpdmUgJiYgdmFsdWUgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyAnUG9zaXRpdmUgbnVtYmVyIGV4cGVjdGVkLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNOdW1iZXIgPSBhc051bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGludGVnZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYW4gaW50ZWdlci5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHBhcmFtIHBvc2l0aXZlIFdoZXRoZXIgdG8gYWNjZXB0IG9ubHkgcG9zaXRpdmUgaW50ZWdlcnMuXG4gICAgICogQHJldHVybiBUaGUgbnVtYmVyIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0ludCh2YWx1ZSwgbnVsbE9LLCBwb3NpdGl2ZSkge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoZWNrVHlwZShwb3NpdGl2ZSwgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgcG9zaXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzSW50KHZhbHVlKSwgJ0ludGVnZXIgZXhwZWN0ZWQuJyk7XG4gICAgICAgIGlmIChwb3NpdGl2ZSAmJiB2YWx1ZSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93ICdQb3NpdGl2ZSBpbnRlZ2VyIGV4cGVjdGVkLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNJbnQgPSBhc0ludDtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgQm9vbGVhbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBzdXBwb3NlZCB0byBiZSBCb29sZWFuLlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBCb29sZWFuIHBhc3NlZCBpbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc0Jvb2xlYW4odmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0Jvb2xlYW4odmFsdWUpLCAnQm9vbGVhbiBleHBlY3RlZC4nKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdjVXRpbHMuYXNCb29sZWFuID0gYXNCb29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYSBEYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGEgRGF0ZS5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgRGF0ZSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNEYXRlKHZhbHVlLCBudWxsT0spIHtcbiAgICAgICAgaWYgKGNoZWNrVHlwZShudWxsT0ssIFVOREVGSU5FRCkpIHtcbiAgICAgICAgICAgIG51bGxPSyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCgobnVsbE9LICYmIGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSkgfHwgaXNEYXRlKHZhbHVlKSwgJ0RhdGUgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzRGF0ZSA9IGFzRGF0ZTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgZnVuY3Rpb24gcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRnVuY3Rpb24odmFsdWUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KChudWxsT0sgJiYgaXNVbmRlZmluZWRPck51bGwodmFsdWUpKSB8fCBpc0Z1bmN0aW9uKHZhbHVlKSwgJ0Z1bmN0aW9uIGV4cGVjdGVkLicpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0Z1bmN0aW9uID0gYXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHN1cHBvc2VkIHRvIGJlIGFuIGFycmF5LlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBhcnJheSBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNBcnJheSh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IGlzQXJyYXkodmFsdWUpLCAnQXJyYXkgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzQXJyYXkgPSBhc0FycmF5O1xuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBnaXZlbiB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHBhcmFtIHR5cGUgVHlwZSBvZiB2YWx1ZSBleHBlY3RlZC5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzVHlwZSh2YWx1ZSwgdHlwZSwgbnVsbE9LKSB7XG4gICAgICAgIGlmIChjaGVja1R5cGUobnVsbE9LLCBVTkRFRklORUQpKSB7XG4gICAgICAgICAgICBudWxsT0sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoKG51bGxPSyAmJiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkpIHx8IHZhbHVlIGluc3RhbmNlb2YgdHlwZSwgdHlwZSArICcgZXhwZWN0ZWQuJyk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmFzVHlwZSA9IGFzVHlwZTtcblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGEgdmFsaWQgc2V0dGluZyBmb3IgYW4gZW51bWVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgVmFsdWUgc3VwcG9zZWQgdG8gYmUgYSBtZW1iZXIgb2YgdGhlIGVudW1lcmF0aW9uLlxuICAgICAqIEBwYXJhbSBlbnVtVHlwZSBFbnVtZXJhdGlvbiB0byB0ZXN0IGZvci5cbiAgICAgKiBAcGFyYW0gbnVsbE9LIFdoZXRoZXIgbnVsbCB2YWx1ZXMgYXJlIGFjY2VwdGFibGUuXG4gICAgICogQHJldHVybiBUaGUgdmFsdWUgcGFzc2VkIGluLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzRW51bSh2YWx1ZSwgZW51bVR5cGUsIG51bGxPSykge1xuICAgICAgICBpZiAoY2hlY2tUeXBlKG51bGxPSywgVU5ERUZJTkVEKSkge1xuICAgICAgICAgICAgbnVsbE9LID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKHZhbHVlKSAmJiBudWxsT0spIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlID0gZW51bVR5cGVbdmFsdWVdO1xuICAgICAgICBhc3NlcnQoIWlzVW5kZWZpbmVkT3JOdWxsKGUpLCAnSW52YWxpZCBlbnVtIHZhbHVlLicpO1xuICAgICAgICByZXR1cm4gaXNOdW1iZXIoZSkgPyBlIDogdmFsdWU7XG4gICAgfVxuXG4gICAgZ2NVdGlscy5hc0VudW0gPSBhc0VudW07XG5cbiAgICAvKipcbiAgICAgKiBFbnVtZXJhdGlvbiB3aXRoIGtleSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGVudW1lcmF0aW9uIGlzIHVzZWZ1bCB3aGVuIGhhbmRsaW5nIDxiPmtleURvd248L2I+IGV2ZW50cy5cbiAgICAgKi9cbiAgICB2YXIgS2V5ID0ge1xuICAgICAgICAvKiogVGhlIGJhY2tzcGFjZSBrZXkuICovXG4gICAgICAgIEJhY2s6IDgsXG4gICAgICAgIC8qKiBUaGUgdGFiIGtleS4gKi9cbiAgICAgICAgVGFiOiA5LFxuICAgICAgICAvKiogVGhlIGVudGVyIGtleS4gKi9cbiAgICAgICAgRW50ZXI6IDEzLFxuICAgICAgICAvKiogVGhlIGVzY2FwZSBrZXkuICovXG4gICAgICAgIEVzY2FwZTogMjcsXG4gICAgICAgIC8qKiBUaGUgc3BhY2Uga2V5LiAqL1xuICAgICAgICBTcGFjZTogMzIsXG4gICAgICAgIC8qKiBUaGUgcGFnZSB1cCBrZXkuICovXG4gICAgICAgIFBhZ2VVcDogMzMsXG4gICAgICAgIC8qKiBUaGUgcGFnZSBkb3duIGtleS4gKi9cbiAgICAgICAgUGFnZURvd246IDM0LFxuICAgICAgICAvKiogVGhlIGVuZCBrZXkuICovXG4gICAgICAgIEVuZDogMzUsXG4gICAgICAgIC8qKiBUaGUgaG9tZSBrZXkuICovXG4gICAgICAgIEhvbWU6IDM2LFxuICAgICAgICAvKiogVGhlIGxlZnQgYXJyb3cga2V5LiAqL1xuICAgICAgICBMZWZ0OiAzNyxcbiAgICAgICAgLyoqIFRoZSB1cCBhcnJvdyBrZXkuICovXG4gICAgICAgIFVwOiAzOCxcbiAgICAgICAgLyoqIFRoZSByaWdodCBhcnJvdyBrZXkuICovXG4gICAgICAgIFJpZ2h0OiAzOSxcbiAgICAgICAgLyoqIFRoZSBkb3duIGFycm93IGtleS4gKi9cbiAgICAgICAgRG93bjogNDAsXG4gICAgICAgIC8qKiBUaGUgZGVsZXRlIGtleS4gKi9cbiAgICAgICAgRGVsZXRlOiA0NixcbiAgICAgICAgLyoqIFRoZSBGMSBrZXkuICovXG4gICAgICAgIEYxOiAxMTIsXG4gICAgICAgIC8qKiBUaGUgRjIga2V5LiAqL1xuICAgICAgICBGMjogMTEzLFxuICAgICAgICAvKiogVGhlIEYzIGtleS4gKi9cbiAgICAgICAgRjM6IDExNCxcbiAgICAgICAgLyoqIFRoZSBGNCBrZXkuICovXG4gICAgICAgIEY0OiAxMTUsXG4gICAgICAgIC8qKiBUaGUgRjUga2V5LiAqL1xuICAgICAgICBGNTogMTE2LFxuICAgICAgICAvKiogVGhlIEY2IGtleS4gKi9cbiAgICAgICAgRjY6IDExNyxcbiAgICAgICAgLyoqIFRoZSBGNyBrZXkuICovXG4gICAgICAgIEY3OiAxMTgsXG4gICAgICAgIC8qKiBUaGUgRjgga2V5LiAqL1xuICAgICAgICBGODogMTE5LFxuICAgICAgICAvKiogVGhlIEY5IGtleS4gKi9cbiAgICAgICAgRjk6IDEyMCxcbiAgICAgICAgLyoqIFRoZSBGMTAga2V5LiAqL1xuICAgICAgICBGMTA6IDEyMSxcbiAgICAgICAgLyoqIFRoZSBGMTEga2V5LiAqL1xuICAgICAgICBGMTE6IDEyMixcbiAgICAgICAgLyoqIFRoZSBGMTIga2V5LiAqL1xuICAgICAgICBGMTI6IDEyM1xuICAgIH07XG4gICAgZ2NVdGlscy5LZXkgPSBLZXk7XG5cbiAgICB2YXIgRWRpdG9yVHlwZSA9IHtcbiAgICAgICAgJ1RleHQnOiAndGV4dCcsXG4gICAgICAgICdDaGVja0JveCc6ICdjaGVja2JveCcsXG4gICAgICAgICdEYXRlJzogJ2RhdGUnLFxuICAgICAgICAnQ29sb3InOiAnY29sb3InLFxuICAgICAgICAnTnVtYmVyJzogJ251bWJlcidcbiAgICB9O1xuICAgIGdjVXRpbHMuRWRpdG9yVHlwZSA9IEVkaXRvclR5cGU7XG5cbiAgICB2YXIgRGF0YVR5cGUgPSB7XG4gICAgICAgICdPYmplY3QnOiAnT2JqZWN0JyxcbiAgICAgICAgJ1N0cmluZyc6ICdTdHJpbmcnLFxuICAgICAgICAnTnVtYmVyJzogJ051bWJlcicsXG4gICAgICAgICdCb29sZWFuJzogJ0Jvb2xlYW4nLFxuICAgICAgICAnRGF0ZSc6ICdEYXRlJyxcbiAgICAgICAgJ0FycmF5JzogJ0FycmF5J1xuICAgIH07XG4gICAgZ2NVdGlscy5EYXRhVHlwZSA9IERhdGFUeXBlO1xuXG4gICAgdmFyIGlzVW5pdGxlc3NOdW1iZXIgPSB7XG4gICAgICAgIGNvbHVtbkNvdW50OiB0cnVlLFxuICAgICAgICBmbGV4OiB0cnVlLFxuICAgICAgICBmbGV4R3JvdzogdHJ1ZSxcbiAgICAgICAgZmxleFNocmluazogdHJ1ZSxcbiAgICAgICAgZm9udFdlaWdodDogdHJ1ZSxcbiAgICAgICAgbGluZUNsYW1wOiB0cnVlLFxuICAgICAgICBsaW5lSGVpZ2h0OiB0cnVlLFxuICAgICAgICBvcGFjaXR5OiB0cnVlLFxuICAgICAgICBvcmRlcjogdHJ1ZSxcbiAgICAgICAgb3JwaGFuczogdHJ1ZSxcbiAgICAgICAgd2lkb3dzOiB0cnVlLFxuICAgICAgICB6SW5kZXg6IHRydWUsXG4gICAgICAgIHpvb206IHRydWUsXG5cbiAgICAgICAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICAgICAgICBmaWxsT3BhY2l0eTogdHJ1ZSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIF91cHBlcmNhc2VQYXR0ZXJuID0gLyhbQS1aXSkvZztcbiAgICB2YXIgbXNQYXR0ZXJuID0gL14tbXMtLztcblxuICAgIGZ1bmN0aW9uIGRhbmdlcm91c1N0eWxlVmFsdWUobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGlzRW1wdHkgPSBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicgfHwgdmFsdWUgPT09ICcnO1xuICAgICAgICBpZiAoaXNFbXB0eSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzTm9uTnVtZXJpYyA9IGlzTmFOKHZhbHVlKTtcbiAgICAgICAgaWYgKGlzTm9uTnVtZXJpYyB8fCB2YWx1ZSA9PT0gMCB8fFxuICAgICAgICAgICAgaXNVbml0bGVzc051bWJlci5oYXNPd25Qcm9wZXJ0eShuYW1lKSAmJiBpc1VuaXRsZXNzTnVtYmVyW25hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gJycgKyB2YWx1ZTsgLy8gY2FzdCB0byBzdHJpbmdcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgKyAncHgnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lbW9pemVTdHJpbmdPbmx5KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IHt9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVtzdHJpbmddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWNoZVtzdHJpbmddID0gY2FsbGJhY2suY2FsbCh0aGlzLCBzdHJpbmcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVtzdHJpbmddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBwcm9jZXNzU3R5bGVOYW1lID0gbWVtb2l6ZVN0cmluZ09ubHkoZnVuY3Rpb24oc3R5bGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBoeXBoZW5hdGVTdHlsZU5hbWUoc3R5bGVOYW1lKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZShzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKF91cHBlcmNhc2VQYXR0ZXJuLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoeXBoZW5hdGVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBoeXBoZW5hdGUoc3RyaW5nKS5yZXBsYWNlKG1zUGF0dGVybiwgJy1tcy0nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVNYXJrdXBGb3JTdHlsZXMoc3R5bGVzKSB7XG4gICAgICAgIHZhciBzZXJpYWxpemVkID0gJyc7XG4gICAgICAgIGZvciAodmFyIHN0eWxlTmFtZSBpbiBzdHlsZXMpIHtcbiAgICAgICAgICAgIGlmICghc3R5bGVzLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gc3R5bGVzW3N0eWxlTmFtZV07XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkT3JOdWxsKHN0eWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZCArPSBwcm9jZXNzU3R5bGVOYW1lKHN0eWxlTmFtZSkgKyAnOic7XG4gICAgICAgICAgICAgICAgc2VyaWFsaXplZCArPSBkYW5nZXJvdXNTdHlsZVZhbHVlKHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkgKyAnOyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNyZWF0ZU1hcmt1cEZvclN0eWxlcyA9IGNyZWF0ZU1hcmt1cEZvclN0eWxlcztcblxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgdGhlIHJvdXRlIGZvciBET00gZXZlbnQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FuY2VsRGVmYXVsdChlKSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9JRSA4XG4gICAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmNhbmNlbERlZmF1bHQgPSBjYW5jZWxEZWZhdWx0O1xuXG4gICAgZnVuY3Rpb24gc2VyaWFsaXplT2JqZWN0KG9iaikge1xuICAgICAgICB2YXIgY2xvbmVPYmogPSBfLmNsb25lKG9iaik7XG4gICAgICAgIHZhciBjYWNoZV8gPSBbXTtcbiAgICAgICAgaWYgKGNsb25lT2JqKSB7XG4gICAgICAgICAgICBjYWNoZV8ucHVzaChjbG9uZU9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3Q7XG4gICAgICAgIHdoaWxlIChjYWNoZV8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVzdCA9IGNhY2hlXy5wb3AoKTtcbiAgICAgICAgICAgIGlmICghaXNPYmplY3QoZGVzdCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gZGVzdCkge1xuICAgICAgICAgICAgICAgIGNhY2hlXy5wdXNoKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGRlc3RbaXRlbV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RbaXRlbV0gPSBzZXJpYWxpemVGdW5jdGlvbihkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lT2JqO1xuICAgIH1cblxuICAgIGdjVXRpbHMuc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplT2JqZWN0O1xuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemVPYmplY3Qob2JqKSB7XG4gICAgICAgIHZhciBjbG9uZU9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICAgICAgdmFyIGNhY2hlXyA9IFtdO1xuICAgICAgICBpZiAoY2xvbmVPYmopIHtcbiAgICAgICAgICAgIGNhY2hlXy5wdXNoKGNsb25lT2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVzdDtcbiAgICAgICAgdmFyIGZ1bmM7XG4gICAgICAgIHdoaWxlIChjYWNoZV8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVzdCA9IGNhY2hlXy5wb3AoKTtcbiAgICAgICAgICAgIGlmICghaXNPYmplY3QoZGVzdCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gaW4gZGVzdCkge1xuICAgICAgICAgICAgICAgIGNhY2hlXy5wdXNoKGRlc3RbaXRlbV0pO1xuICAgICAgICAgICAgICAgIGlmIChpc1N0cmluZyhkZXN0W2l0ZW1dKSkge1xuICAgICAgICAgICAgICAgICAgICBmdW5jID0gZGVzZXJpYWxpemVGdW5jdGlvbihkZXN0W2l0ZW1dKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RbaXRlbV0gPSBmdW5jO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZU9iajtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmRlc2VyaWFsaXplT2JqZWN0ID0gZGVzZXJpYWxpemVPYmplY3Q7XG5cbiAgICBmdW5jdGlvbiBzZXJpYWxpemVGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnY1V0aWxzLnNlcmlhbGl6ZUZ1bmN0aW9uID0gc2VyaWFsaXplRnVuY3Rpb247XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wU3RyID0gdmFsdWUuc3Vic3RyKDgsIHZhbHVlLmluZGV4T2YoJygnKSAtIDgpOyAvLzggaXMgJ2Z1bmN0aW9uJyBsZW5ndGhcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zdWJzdHIoMCwgOCkgPT09ICdmdW5jdGlvbicgJiYgdGVtcFN0ci5yZXBsYWNlKC9cXHMrLywgJycpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHZhciBhcmdTdGFydCA9IHZhbHVlLmluZGV4T2YoJygnKSArIDE7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ0VuZCA9IHZhbHVlLmluZGV4T2YoJyknKTtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IHZhbHVlLnN1YnN0cihhcmdTdGFydCwgYXJnRW5kIC0gYXJnU3RhcnQpLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLnJlcGxhY2UoL1xccysvLCAnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvZHlTdGFydCA9IHZhbHVlLmluZGV4T2YoJ3snKSArIDE7XG4gICAgICAgICAgICAgICAgdmFyIGJvZHlFbmQgPSB2YWx1ZS5sYXN0SW5kZXhPZignfScpO1xuICAgICAgICAgICAgICAgIC8qanNsaW50IGV2aWw6IHRydWUgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGFyZ3MsIHZhbHVlLnN1YnN0cihib2R5U3RhcnQsIGJvZHlFbmQgLSBib2R5U3RhcnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnY1V0aWxzLmRlc2VyaWFsaXplRnVuY3Rpb24gPSBkZXNlcmlhbGl6ZUZ1bmN0aW9uO1xuICAgIC8qKlxuICAgICAqIEFzc2VydHMgdGhhdCBhIHZhbHVlIGlzIGFuIEBzZWU6SUNvbGxlY3Rpb25WaWV3IG9yIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIEFycmF5IG9yIEBzZWU6SUNvbGxlY3Rpb25WaWV3LlxuICAgICAqIEBwYXJhbSBudWxsT0sgV2hldGhlciBudWxsIHZhbHVlcyBhcmUgYWNjZXB0YWJsZS5cbiAgICAgKiBAcmV0dXJuIFRoZSBAc2VlOklDb2xsZWN0aW9uVmlldyB0aGF0IHdhcyBwYXNzZWQgaW4gb3IgYSBAc2VlOkNvbGxlY3Rpb25WaWV3XG4gICAgICogY3JlYXRlZCBmcm9tIHRoZSBhcnJheSB0aGF0IHdhcyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgLypcbiAgICAgZnVuY3Rpb24gYXNDb2xsZWN0aW9uVmlldyh2YWx1ZSwgbnVsbE9LKSB7XG4gICAgIGlmICh0eXBlb2YgbnVsbE9LID09PSBcInVuZGVmaW5lZFwiKSB7IG51bGxPSyA9IHRydWU7IH1cbiAgICAgaWYgKHZhbHVlID09IG51bGwgJiYgbnVsbE9LKSB7XG4gICAgIHJldHVybiBudWxsO1xuICAgICB9XG4gICAgIHZhciBjdiA9IHRyeUNhc3QodmFsdWUsICdJQ29sbGVjdGlvblZpZXcnKTtcbiAgICAgaWYgKGN2ICE9IG51bGwpIHtcbiAgICAgcmV0dXJuIGN2O1xuICAgICB9XG4gICAgIGlmICghaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgYXNzZXJ0KGZhbHNlLCAnQXJyYXkgb3IgSUNvbGxlY3Rpb25WaWV3IGV4cGVjdGVkLicpO1xuICAgICB9XG4gICAgIHJldHVybiBuZXcgd2lqbW8uY29sbGVjdGlvbnMuQ29sbGVjdGlvblZpZXcodmFsdWUpO1xuICAgICB9XG4gICAgIGdjVXRpbHMuYXNDb2xsZWN0aW9uVmlldyA9IGFzQ29sbGVjdGlvblZpZXc7Ki9cblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIHBsdWdpbiBtb2R1bGUuXG4gICAgICogQHBhcmFtIG5hbWUgb2YgbW9kdWxlXG4gICAgICogQHJldHVybnMgcGx1Z2luIG1vZHVsZSBvYmplY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kUGx1Z2luKG5hbWUpIHtcbiAgICAgICAgdmFyIHBsdWdpbjtcbiAgICAgICAgLy8gZmluZCBmcm9tIGdsb2JhbFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGx1Z2luID0gR2NTcHJlYWQuVmlld3MuR2NHcmlkLlBsdWdpbnNbbmFtZV07Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgKCFwbHVnaW4gJiYgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vICAgIHBsdWdpbiA9IHJlcXVpcmVqcyAmJiByZXF1aXJlanMobmFtZSkgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vfVxuICAgICAgICAvL1xuICAgICAgICAvLy8vIGNvbW1vbmpzIG5vdCBzdXBwb3J0ZWQgbm93XG4gICAgICAgIC8vaWYgKCFwbHVnaW4gJiYgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7Ly8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIC8vfVxuICAgICAgICByZXR1cm4gcGx1Z2luO1xuICAgIH1cblxuICAgIGdjVXRpbHMuZmluZFBsdWdpbiA9IGZpbmRQbHVnaW47XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdjVXRpbHM7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZ2NVdGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIvLyBkb1QuanNcbi8vIDIwMTEtMjAxNCwgTGF1cmEgRG9rdG9yb3ZhLCBodHRwczovL2dpdGh1Yi5jb20vb2xhZG8vZG9UXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRvVCA9IHtcbiAgICAgICAgdmVyc2lvbjogXCIxLjAuM1wiLFxuICAgICAgICB0ZW1wbGF0ZVNldHRpbmdzOiB7XG4gICAgICAgICAgICBldmFsdWF0ZTogL1xce1xceyhbXFxzXFxTXSs/KFxcfT8pKylcXH1cXH0vZyxcbiAgICAgICAgICAgIGludGVycG9sYXRlOiAvXFx7XFx7PShbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgZW5jb2RlOiAvXFx7XFx7IShbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgdXNlOiAvXFx7XFx7IyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxuICAgICAgICAgICAgdXNlUGFyYW1zOiAvKF58W15cXHckXSlkZWYoPzpcXC58XFxbW1xcJ1xcXCJdKShbXFx3JFxcLl0rKSg/OltcXCdcXFwiXVxcXSk/XFxzKlxcOlxccyooW1xcdyRcXC5dK3xcXFwiW15cXFwiXStcXFwifFxcJ1teXFwnXStcXCd8XFx7W15cXH1dK1xcfSkvZyxcbiAgICAgICAgICAgIGRlZmluZTogL1xce1xceyMjXFxzKihbXFx3XFwuJF0rKVxccyooXFw6fD0pKFtcXHNcXFNdKz8pI1xcfVxcfS9nLFxuICAgICAgICAgICAgZGVmaW5lUGFyYW1zOiAvXlxccyooW1xcdyRdKyk6KFtcXHNcXFNdKykvLFxuICAgICAgICAgICAgY29uZGl0aW9uYWw6IC9cXHtcXHtcXD8oXFw/KT9cXHMqKFtcXHNcXFNdKj8pXFxzKlxcfVxcfS9nLFxuICAgICAgICAgICAgaXRlcmF0ZTogL1xce1xce35cXHMqKD86XFx9XFx9fChbXFxzXFxTXSs/KVxccypcXDpcXHMqKFtcXHckXSspXFxzKig/OlxcOlxccyooW1xcdyRdKykpP1xccypcXH1cXH0pL2csXG4gICAgICAgICAgICB2YXJuYW1lOiBcIml0XCIsXG4gICAgICAgICAgICBzdHJpcDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGVuZDogdHJ1ZSxcbiAgICAgICAgICAgIHNlbGZjb250YWluZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZG9Ob3RTa2lwRW5jb2RlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IHVuZGVmaW5lZCwgLy9mbiwgY29tcGlsZSB0ZW1wbGF0ZVxuICAgICAgICBjb21waWxlOiB1bmRlZmluZWQgIC8vZm4sIGZvciBleHByZXNzXG4gICAgfSwgX2dsb2JhbHM7XG5cbiAgICBkb1QuZW5jb2RlSFRNTFNvdXJjZSA9IGZ1bmN0aW9uKGRvTm90U2tpcEVuY29kZWQpIHtcbiAgICAgICAgdmFyIGVuY29kZUhUTUxSdWxlcyA9IHtcIiZcIjogXCImIzM4O1wiLCBcIjxcIjogXCImIzYwO1wiLCBcIj5cIjogXCImIzYyO1wiLCAnXCInOiBcIiYjMzQ7XCIsIFwiJ1wiOiBcIiYjMzk7XCIsIFwiL1wiOiBcIiYjNDc7XCJ9LFxuICAgICAgICAgICAgbWF0Y2hIVE1MID0gZG9Ob3RTa2lwRW5jb2RlZCA/IC9bJjw+XCInXFwvXS9nIDogLyYoPyEjP1xcdys7KXw8fD58XCJ8J3xcXC8vZztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2RlID8gY29kZS50b1N0cmluZygpLnJlcGxhY2UobWF0Y2hIVE1MLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZUhUTUxSdWxlc1ttXSB8fCBtO1xuICAgICAgICAgICAgfSkgOiBcIlwiO1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIF9nbG9iYWxzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcyB8fCAoMCwgZXZhbCkoXCJ0aGlzXCIpO1xuICAgIH0oKSk7XG5cbiAgICAvL0hpYmVyXG4gICAgLy9yZXBsYXRlIHRoZSBtb2R1bGUgZGVmaW5pdGlvbiB3aXRoIHNpbXBsZSBtb2R1bGUuZXhwb3J0cyBzaW5jZSB3ZSBvbmx5IHJ1blxuICAgIC8vaXQgaW4gbm9kZSBsaWtlIGVudmlyb25tZW50XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvVDtcbiAgICAvL2lmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy9cbiAgICAvL30gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAvL1x0ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGRvVDt9KTtcbiAgICAvL30gZWxzZSB7XG4gICAgLy9cdF9nbG9iYWxzLmRvVCA9IGRvVDtcbiAgICAvL31cblxuICAgIHZhciBzdGFydGVuZCA9IHtcbiAgICAgICAgYXBwZW5kOiB7c3RhcnQ6IFwiJysoXCIsIGVuZDogXCIpKydcIiwgc3RhcnRlbmNvZGU6IFwiJytlbmNvZGVIVE1MKFwifSxcbiAgICAgICAgc3BsaXQ6IHtzdGFydDogXCInO291dCs9KFwiLCBlbmQ6IFwiKTtvdXQrPSdcIiwgc3RhcnRlbmNvZGU6IFwiJztvdXQrPWVuY29kZUhUTUwoXCJ9XG4gICAgfSwgc2tpcCA9IC8kXi87XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlRGVmcyhjLCBibG9jaywgZGVmKSB7XG4gICAgICAgIHJldHVybiAoKHR5cGVvZiBibG9jayA9PT0gXCJzdHJpbmdcIikgPyBibG9jayA6IGJsb2NrLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAucmVwbGFjZShjLmRlZmluZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlLCBhc3NpZ24sIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZihcImRlZi5cIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUuc3Vic3RyaW5nKDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShjb2RlIGluIGRlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzc2lnbiA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLmRlZmluZVBhcmFtcykgdmFsdWUucmVwbGFjZShjLmRlZmluZVBhcmFtcywgZnVuY3Rpb24obSwgcGFyYW0sIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZbY29kZV0gPSB7YXJnOiBwYXJhbSwgdGV4dDogdn07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGNvZGUgaW4gZGVmKSkgZGVmW2NvZGVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRnVuY3Rpb24oXCJkZWZcIiwgXCJkZWZbJ1wiICsgY29kZSArIFwiJ109XCIgKyB2YWx1ZSkoZGVmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLnVzZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMudXNlUGFyYW1zKSBjb2RlID0gY29kZS5yZXBsYWNlKGMudXNlUGFyYW1zLCBmdW5jdGlvbihtLCBzLCBkLCBwYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmW2RdICYmIGRlZltkXS5hcmcgJiYgcGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBydyA9IChkICsgXCI6XCIgKyBwYXJhbSkucmVwbGFjZSgvJ3xcXFxcL2csIFwiX1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZi5fX2V4cCA9IGRlZi5fX2V4cCB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZi5fX2V4cFtyd10gPSBkZWZbZF0udGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxbXlxcXFx3JF0pXCIgKyBkZWZbZF0uYXJnICsgXCIoW15cXFxcdyRdKVwiLCBcImdcIiksIFwiJDFcIiArIHBhcmFtICsgXCIkMlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzICsgXCJkZWYuX19leHBbJ1wiICsgcncgKyBcIiddXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdiA9IG5ldyBGdW5jdGlvbihcImRlZlwiLCBcInJldHVybiBcIiArIGNvZGUpKGRlZik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPyByZXNvbHZlRGVmcyhjLCB2LCBkZWYpIDogdjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZSgvXFxcXCgnfFxcXFwpL2csIFwiJDFcIikucmVwbGFjZSgvW1xcclxcdFxcbl0vZywgXCIgXCIpO1xuICAgIH1cblxuICAgIGRvVC50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRtcGwsIGMsIGRlZiwgZG9udFJlbmRlck51bGxPclVuZGVmaW5lZCkge1xuICAgICAgICBjID0gYyB8fCBkb1QudGVtcGxhdGVTZXR0aW5ncztcbiAgICAgICAgdmFyIGNzZSA9IGMuYXBwZW5kID8gc3RhcnRlbmQuYXBwZW5kIDogc3RhcnRlbmQuc3BsaXQsIG5lZWRodG1sZW5jb2RlLCBzaWQgPSAwLCBpbmR2LFxuICAgICAgICAgICAgc3RyID0gKGMudXNlIHx8IGMuZGVmaW5lKSA/IHJlc29sdmVEZWZzKGMsIHRtcGwsIGRlZiB8fCB7fSkgOiB0bXBsO1xuXG4gICAgICAgIHZhciB1bmVzY2FwZUNvZGU7XG5cbiAgICAgICAgc3RyID0gKFwidmFyIG91dD0nXCIgKyAoYy5zdHJpcCA/IHN0ci5yZXBsYWNlKC8oXnxcXHJ8XFxuKVxcdCogK3wgK1xcdCooXFxyfFxcbnwkKS9nLCBcIiBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJ8XFxufFxcdHxcXC9cXCpbXFxzXFxTXSo/XFwqXFwvL2csIFwiXCIpIDogc3RyKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyd8XFxcXC9nLCBcIlxcXFwkJlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5pbnRlcnBvbGF0ZSB8fCBza2lwLCBmdW5jdGlvbihtLCBjb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEhZG9udFJlbmRlck51bGxPclVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB1bmVzY2FwZUNvZGUgPSB1bmVzY2FwZShjb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZignfHwnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGVDb2RlICsgY3NlLmVuZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyAnKHR5cGVvZiAnICsgY29kZSArICcgIT09IFwidW5kZWZpbmVkXCIgJiYgJyArIGNvZGUgKyAnIT09IG51bGwpPycgKyB1bmVzY2FwZUNvZGUgKyAnOiBcIlwiJyArIGNzZS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjc2Uuc3RhcnQgKyB1bmVzY2FwZShjb2RlKSArIGNzZS5lbmQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoYy5lbmNvZGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIG5lZWRodG1sZW5jb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3NlLnN0YXJ0ZW5jb2RlICsgdW5lc2NhcGUoY29kZSkgKyBjc2UuZW5kO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuY29uZGl0aW9uYWwgfHwgc2tpcCwgZnVuY3Rpb24obSwgZWxzZWNhc2UsIGNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxzZWNhc2UgP1xuICAgICAgICAgICAgICAgICAgICAoY29kZSA/IFwiJzt9ZWxzZSBpZihcIiArIHVuZXNjYXBlKGNvZGUpICsgXCIpe291dCs9J1wiIDogXCInO31lbHNle291dCs9J1wiKSA6XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID8gXCInO2lmKFwiICsgdW5lc2NhcGUoY29kZSkgKyBcIil7b3V0Kz0nXCIgOiBcIic7fW91dCs9J1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZShjLml0ZXJhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgaXRlcmF0ZSwgdm5hbWUsIGluYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpdGVyYXRlKSByZXR1cm4gXCInO30gfSBvdXQrPSdcIjtcbiAgICAgICAgICAgICAgICBzaWQgKz0gMTtcbiAgICAgICAgICAgICAgICBpbmR2ID0gaW5hbWUgfHwgXCJpXCIgKyBzaWQ7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZSA9IHVuZXNjYXBlKGl0ZXJhdGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnXFwnO3ZhciBhcnInICsgc2lkICsgJz0nICsgaXRlcmF0ZSArIFwiO2lmKGFyclwiICsgc2lkICsgXCIpe3ZhciBcIiArIHZuYW1lICsgXCIsXCIgKyBpbmR2ICsgXCI9LTEsbFwiICsgc2lkICsgXCI9YXJyXCIgKyBzaWQgKyBcIi5sZW5ndGgtMTt3aGlsZShcIiArIGluZHYgKyBcIjxsXCIgKyBzaWQgKyBcIil7XCJcbiAgICAgICAgICAgICAgICAgICAgKyB2bmFtZSArIFwiPWFyclwiICsgc2lkICsgXCJbXCIgKyBpbmR2ICsgXCIrPTFdO291dCs9J1wiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKGMuZXZhbHVhdGUgfHwgc2tpcCwgZnVuY3Rpb24obSwgY29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIic7XCIgKyB1bmVzY2FwZShjb2RlKSArIFwib3V0Kz0nXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICArIFwiJztyZXR1cm4gb3V0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKS5yZXBsYWNlKC9cXHIvZywgXCJcXFxcclwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHN8O3xcXH18XnxcXHspb3V0XFwrPScnOy9nLCAnJDEnKS5yZXBsYWNlKC9cXCsnJy9nLCBcIlwiKTtcbiAgICAgICAgLy8ucmVwbGFjZSgvKFxcc3w7fFxcfXxefFxceylvdXRcXCs9JydcXCsvZywnJDFvdXQrPScpO1xuXG4gICAgICAgIGlmIChuZWVkaHRtbGVuY29kZSkge1xuICAgICAgICAgICAgaWYgKCFjLnNlbGZjb250YWluZWQgJiYgX2dsb2JhbHMgJiYgIV9nbG9iYWxzLl9lbmNvZGVIVE1MKSBfZ2xvYmFscy5fZW5jb2RlSFRNTCA9IGRvVC5lbmNvZGVIVE1MU291cmNlKGMuZG9Ob3RTa2lwRW5jb2RlZCk7XG4gICAgICAgICAgICBzdHIgPSBcInZhciBlbmNvZGVIVE1MID0gdHlwZW9mIF9lbmNvZGVIVE1MICE9PSAndW5kZWZpbmVkJyA/IF9lbmNvZGVIVE1MIDogKFwiXG4gICAgICAgICAgICAgICAgKyBkb1QuZW5jb2RlSFRNTFNvdXJjZS50b1N0cmluZygpICsgXCIoXCIgKyAoYy5kb05vdFNraXBFbmNvZGVkIHx8ICcnKSArIFwiKSk7XCJcbiAgICAgICAgICAgICAgICArIHN0cjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihjLnZhcm5hbWUsIHN0cik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikgY29uc29sZS5sb2coXCJDb3VsZCBub3QgY3JlYXRlIGEgdGVtcGxhdGUgZnVuY3Rpb246IFwiICsgc3RyKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9ULmNvbXBpbGUgPSBmdW5jdGlvbih0bXBsLCBkZWYpIHtcbiAgICAgICAgcmV0dXJuIGRvVC50ZW1wbGF0ZSh0bXBsLCBudWxsLCBkZWYpO1xuICAgIH07XG5cbn0oKSk7XG5cbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NjcmlwdHMvZ3JpZC9kb1QuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1XG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBnY1V0aWxzID0gcmVxdWlyZSgnLi9nY1V0aWxzJyk7XG5cbiAgICB2YXIgZG9tVXRpbCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbGVtZW50IGZyb20gYW4gSFRNTCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaHRtbCBIVE1MIGZyYWdtZW50IHRvIGNvbnZlcnQgaW50byBhbiBIVE1MRWxlbWVudC5cbiAgICAgKiBAcmV0dXJuIFRoZSBuZXcgZWxlbWVudC5cbiAgICAgKi9cblxuICAgIC8vcmVtb3ZlIGFsbCBjb21tZW50cyBhbmQgd2hpdGVzcGFjZSBvbmx5IHRleHQgbm9kZXNcbiAgICBmdW5jdGlvbiBjbGVhbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBuKyspIHsgLy9kbyByZXdyaXRlIGl0IHRvIGZvcih2YXIgbj0wLGxlbj1YWFg7aTxsZW47KVxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGROb2Rlc1tuXTtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDggfHwgKGNoaWxkLm5vZGVUeXBlID09PSAzICYmICEvXFxTLy50ZXN0KGNoaWxkLm5vZGVWYWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBuLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhbihjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZG9tVXRpbC5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB2YXIgciA9IGRpdi5jaGlsZHJlblswXTtcbiAgICAgICAgZGl2ID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuY3JlYXRlVGVtcGxhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB2YXIgciA9IGRpdi5jaGlsZHJlblswXTtcbiAgICAgICAgY2xlYW4ocik7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfTtcblxuICAgIGRvbVV0aWwuZ2V0RWxlbWVudElubmVyVGV4dCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuaW5uZXJIVE1MLnJlcGxhY2UoLyZhbXA7L2csICcmJykucmVwbGFjZSgvJmx0Oy9nLCAnPCcpLnJlcGxhY2UoLyZndDsvZywgJz4nKTtcbiAgICB9O1xuXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50T3V0ZXJUZXh0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vdXRlckhUTUwucmVwbGFjZSgvJmFtcDsvZywgJyYnKS5yZXBsYWNlKC8mbHQ7L2csICc8JykucmVwbGFjZSgvJmd0Oy9nLCAnPicpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhbiBlbGVtZW50IGhhcyBhIGNsYXNzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBjaGVjayBmb3IuXG4gICAgICovXG4gICAgZG9tVXRpbC5oYXNDbGFzcyA9IGZ1bmN0aW9uKGUsIGNsYXNzTmFtZSkge1xuICAgICAgICAvLyBub3RlOiB1c2luZyBlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSBpbnN0ZWFkIG9mIGUuY2xhc3NOYW1lc1xuICAgICAgICAvLyBzbyB0aGlzIHdvcmtzIHdpdGggU1ZHIGFzIHdlbGwgYXMgcmVndWxhciBIVE1MIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZSAmJiBlLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgY2xhc3NOYW1lICsgJ1xcXFxiJyk7XG4gICAgICAgICAgICByZXR1cm4gZSAmJiByeC50ZXN0KGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgcmVtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIENsYXNzIHRvIHJlbW92ZSBmb3JtIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5zZXRBdHRyaWJ1dGUgJiYgZG9tVXRpbC5oYXNDbGFzcyhlLCBjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICB2YXIgcnggPSBuZXcgUmVnRXhwKCdcXFxccz9cXFxcYicgKyBjbGFzc05hbWUgKyAnXFxcXGInLCAnZycpO1xuICAgICAgICAgICAgdmFyIGNuID0gZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbi5yZXBsYWNlKHJ4LCAnJykpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgdGhhdCB3aWxsIGhhdmUgdGhlIGNsYXNzIGFkZGVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgQ2xhc3MgdG8gYWRkIHRvIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuYWRkQ2xhc3MgPSBmdW5jdGlvbihlLCBjbGFzc05hbWUpIHtcbiAgICAgICAgLy8gbm90ZTogdXNpbmcgZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgaW5zdGVhZCBvZiBlLmNsYXNzTmFtZXNcbiAgICAgICAgLy8gc28gdGhpcyB3b3JrcyB3aXRoIFNWRyBhcyB3ZWxsIGFzIHJlZ3VsYXIgSFRNTCBlbGVtZW50cy5cbiAgICAgICAgaWYgKGUgJiYgZS5zZXRBdHRyaWJ1dGUgJiYgIWRvbVV0aWwuaGFzQ2xhc3MoZSwgY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgdmFyIGNuID0gZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbiA/IGNuICsgJyAnICsgY2xhc3NOYW1lIDogY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIG9yIHJlbW92ZXMgYSBjbGFzcyB0byBvciBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGUgRWxlbWVudCB0aGF0IHdpbGwgaGF2ZSB0aGUgY2xhc3MgYWRkZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBDbGFzcyB0byBhZGQgb3IgcmVtb3ZlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRkT3JSZW1vdmUgV2hldGhlciB0byBhZGQgb3IgcmVtb3ZlIHRoZSBjbGFzcy5cbiAgICAgKi9cbiAgICBkb21VdGlsLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZSwgY2xhc3NOYW1lLCBhZGRPclJlbW92ZSkge1xuICAgICAgICBpZiAoYWRkT3JSZW1vdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRvbVV0aWwuYWRkQ2xhc3MoZSwgY2xhc3NOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbVV0aWwucmVtb3ZlQ2xhc3MoZSwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAqKiBqUXVlcnkgcmVwbGFjZW1lbnQgbWV0aG9kc1xuICAgIC8qKlxuICAgICAqIEdldHMgYW4gZWxlbWVudCBmcm9tIGEgalF1ZXJ5LXN0eWxlIHNlbGVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fHN0cmluZ30gc2VsZWN0b3IgQW4gZWxlbWVudCwgYSBzZWxlY3RvciBzdHJpbmcsIG9yIGEgalF1ZXJ5IG9iamVjdC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmdldEVsZW1lbnQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnY1V0aWxzLmlzU3RyaW5nKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhbiBIVE1MIGVsZW1lbnQgY29udGFpbnMgYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IFBhcmVudCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gY2hpbGQgQ2hpbGQgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXJlbnQgZWxlbWVudCBjb250YWlucyB0aGUgY2hpbGQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBkb21VdGlsLmNvbnRhaW5zID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBmb3IgKHZhciBlID0gY2hpbGQ7IGU7IGUgPSBlLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChlID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgY29vcmRpbmF0ZXMgb2YgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBkb21VdGlsLm9mZnNldCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCArIGVsZW1lbnQuc2Nyb2xsVG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgZWxlbWVudC5zY3JvbGxMZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGJvdW5kaW5nIHJlY3RhbmdsZSBvZiBhbiBlbGVtZW50IGluIHBhZ2UgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHNpbWlsYXIgdG8gdGhlIDxiPmdldEJvdW5kaW5nQ2xpZW50UmVjdDwvYj4gZnVuY3Rpb24sXG4gICAgICogZXhjZXB0IHRoYXQgdXNlcyB3aW5kb3cgY29vcmRpbmF0ZXMsIHdoaWNoIGNoYW5nZSB3aGVuIHRoZVxuICAgICAqIGRvY3VtZW50IHNjcm9sbHMuXG4gICAgICovXG4gICAgZG9tVXRpbC5nZXRFbGVtZW50UmVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHJjID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IHJjLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICB0b3A6IHJjLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIHdpZHRoOiByYy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcmMuaGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaW5uZXIgY29udGVudCByZWN0YW5nbGUgb2YgaW5wdXQgZWxlbWVudC5cbiAgICAgKiBQYWRkaW5nIGFuZCBib3gtc2l6aW5nIGlzIGNvbnNpZGVyZWQuXG4gICAgICogVGhlIHJlc3VsdCBpcyB0aGUgYWN0dWFsIHJlY3RhbmdsZSB0byBwbGFjZSBjaGlsZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSBlIHJlcHJlc2VudCB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIGRvbVV0aWwuZ2V0Q29udGVudFJlY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciByYyA9IGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMuZ2V0U3R5bGUoZSk7XG4gICAgICAgIHZhciBtZWFzdXJlbWVudHMgPSBbXG4gICAgICAgICAgICAncGFkZGluZ0xlZnQnLFxuICAgICAgICAgICAgJ3BhZGRpbmdSaWdodCcsXG4gICAgICAgICAgICAncGFkZGluZ1RvcCcsXG4gICAgICAgICAgICAncGFkZGluZ0JvdHRvbScsXG4gICAgICAgICAgICAnYm9yZGVyTGVmdFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJSaWdodFdpZHRoJyxcbiAgICAgICAgICAgICdib3JkZXJUb3BXaWR0aCcsXG4gICAgICAgICAgICAnYm9yZGVyQm90dG9tV2lkdGgnXG4gICAgICAgIF07XG4gICAgICAgIHZhciBzaXplID0ge307XG4gICAgICAgIG1lYXN1cmVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KHN0eWxlW3Byb3BdKTtcbiAgICAgICAgICAgIHNpemVbcHJvcF0gPSAhaXNOYU4obnVtKSA/IG51bSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcGFkZGluZ1dpZHRoID0gc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUucGFkZGluZ1JpZ2h0O1xuICAgICAgICB2YXIgcGFkZGluZ0hlaWdodCA9IHNpemUucGFkZGluZ1RvcCArIHNpemUucGFkZGluZ0JvdHRvbTtcbiAgICAgICAgdmFyIGJvcmRlcldpZHRoID0gc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLmJvcmRlclJpZ2h0V2lkdGg7XG4gICAgICAgIHZhciBib3JkZXJIZWlnaHQgPSBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IHJjLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgKyBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUucGFkZGluZ0xlZnQsXG4gICAgICAgICAgICB0b3A6IHJjLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCArIHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLnBhZGRpbmdUb3AsXG4gICAgICAgICAgICB3aWR0aDogcmMud2lkdGggLSBwYWRkaW5nV2lkdGggLSBib3JkZXJXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcmMuaGVpZ2h0IC0gcGFkZGluZ0hlaWdodCAtIGJvcmRlckhlaWdodFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNb2RpZmllcyB0aGUgc3R5bGUgb2YgYW4gZWxlbWVudCBieSBhcHBseWluZyB0aGUgcHJvcGVydGllcyBzcGVjaWZpZWQgaW4gYW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlIEVsZW1lbnQgd2hvc2Ugc3R5bGUgd2lsbCBiZSBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY3NzIE9iamVjdCBjb250YWluaW5nIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRoZSBlbGVtZW50LlxuICAgICAqL1xuICAgIGRvbVV0aWwuc2V0Q3NzID0gZnVuY3Rpb24oZSwgY3NzKSB7XG4gICAgICAgIHZhciBzID0gZS5zdHlsZTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjc3MpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjc3NbcF07XG4gICAgICAgICAgICBpZiAoZ2NVdGlscy5pc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHAubWF0Y2goL3dpZHRofGhlaWdodHxsZWZ0fHRvcHxyaWdodHxib3R0b218c2l6ZXxwYWRkaW5nfG1hcmdpbicvaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9ICdweCc7IC8vIGRlZmF1bHQgdW5pdCBmb3IgZ2VvbWV0cnkgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNbcF0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFNjcm9sbGJhclNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVV0aWwuc2Nyb2xsYmFyU2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaXYgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgdG9wOi0xMDAwMHB4OyBsZWZ0Oi0xMDAwMHB4OyB3aWR0aDoxMDBweDsgaGVpZ2h0OjEwMHB4OyBvdmVyZmxvdzpzY3JvbGw7XCI+PC9kaXY+Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgZG9tVXRpbC5zY3JvbGxiYXJTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IGRpdi5vZmZzZXRXaWR0aCAtIGRpdi5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogZGl2Lm9mZnNldEhlaWdodCAtIGRpdi5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcblxuICAgICAgICByZXR1cm4gZG9tVXRpbC5zY3JvbGxiYXJTaXplO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFN0eWxlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgZm4gPSBnZXRDb21wdXRlZFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xuICAgICAgICBpZiAoZWxlbWVudCAmJiBmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuKGVsZW1lbnQsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBkb21VdGlsLmdldFN0eWxlVmFsdWUgPSBmdW5jdGlvbihlbGVtZW50LCBzdHlsZVByb3BlcnR5KSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvbVV0aWwuZ2V0U3R5bGUoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiBzdHlsZSA/IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoc3R5bGVQcm9wZXJ0eSkgOiBudWxsO1xuICAgIH07XG5cbiAgICBkb21VdGlsLkdldE1heFN1cHBvcnRlZENTU0hlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9tVXRpbC5tYXhTdXBwb3J0ZWRDU1NIZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21VdGlsLm1heFN1cHBvcnRlZENTU0hlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoID0gMTAwMDAwMDtcbiAgICAgICAgdmFyIHRlc3RVcFRvID0gNjAwMDAwMCAqIDEwMDA7XG4gICAgICAgIHZhciBkaXYgPSBkb21VdGlsLmNyZWF0ZUVsZW1lbnQoJzxkaXYgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIi8+Jyk7XG4gICAgICAgIHZhciB0ZXN0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB0ZXN0ID0gaCArIDUwMDAwMDsgLy8qIDI7XG4gICAgICAgICAgICBkaXYuc3R5bGUuaGVpZ2h0ID0gdGVzdCArICdweCc7XG4gICAgICAgICAgICBpZiAodGVzdCA+IHRlc3RVcFRvIHx8IGRpdi5vZmZzZXRIZWlnaHQgIT09IHRlc3QpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGggPSB0ZXN0O1xuICAgICAgICB9XG4gICAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG4gICAgICAgIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0ID0gaDtcbiAgICAgICAgcmV0dXJuIGRvbVV0aWwubWF4U3VwcG9ydGVkQ1NTSGVpZ2h0O1xuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvbVV0aWw7XG59KCkpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvZG9tVXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDVcbiAqKi8iLCIoZnVuY3Rpb24od2luZG93KSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICB2YXIgc3VwcG9ydEV2ZW50cyA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hlbmQnXTtcblxuICAgICAgICB2YXIgbGFzdEh3VGltZXN0YW1wID0gMDtcblxuICAgICAgICB2YXIgZXZlbnRNYXBwaW5ncyA9IHtcbiAgICAgICAgICAgIHRvdWNoc3RhcnQ6IFsncG9pbnRlcmRvd24nLCAnTVNQb2ludGVyRG93bicsICd0b3VjaHN0YXJ0J10sXG4gICAgICAgICAgICB0b3VjaG1vdmU6IFsncG9pbnRlcm1vdmUnLCAnTVNQb2ludGVyTW92ZScsICd0b3VjaG1vdmUnXSxcbiAgICAgICAgICAgIHRvdWNoZW5kOiBbJ3BvaW50ZXJ1cCcsICdNU1BvaW50ZXJVcCcsICd0b3VjaGVuZCddXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG1hcHBpbmdJbmRleCA9IHdpbmRvdy5Qb2ludGVyRXZlbnQgPyAwIDogKHdpbmRvdy5NU1BvaW50ZXJFdmVudCA/IDEgOiAyKTtcblxuICAgICAgICB2YXIgdG91Y2hlc1dyYXBwZXI7XG4gICAgICAgIHZhciBjaGFuZ2VkVG91Y2hlc1dyYXBwZXI7XG4gICAgICAgIHZhciB0YXJnZXRUb3VjaGVzV3JhcHBlcjtcblxuICAgICAgICBmdW5jdGlvbiBUb3VjaFdyYXBwZXIoZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYW5hZ2VyKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gTWFuYWdlcihlbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBvbjogZnVuY3Rpb24odGFyZ2V0RXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmIChzdXBwb3J0RXZlbnRzLmluZGV4T2YodGFyZ2V0RXZlbnQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0RXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHN1cHBvcnRUYXJnZXRFdmVudChlbGVtZW50LCB0YXJnZXRFdmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRhcmdldEV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYXRpdmVFdmVudCA9IGV2ZW50TmFtZUdlbmVyYXRlKHRhcmdldEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1cHBvcnRUYXJnZXRFdmVudChlbGVtZW50LCBuYXRpdmVFdmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYXRpdmVIYW5kbGVyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVUb3VjaENsb25lZEV2ZW50KGV2dCwgaGFuZGxlciwgdGFyZ2V0RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVpZCA9IGd1aWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIudWlkID0gdWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkb3JSZW1vdmVXcmFwRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBuYXRpdmVFdmVudCwgbmF0aXZlSGFuZGxlciwgdWlkLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUlFU2Nyb2xsKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb2ZmOiBmdW5jdGlvbih0YXJnZXRFdmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1cHBvcnRFdmVudHMuaW5kZXhPZih0YXJnZXRFdmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0YXJnZXRFdmVudCwgaGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3VwcG9ydFRhcmdldEV2ZW50KGVsZW1lbnQsIHRhcmdldEV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZWxlbWVudCwgdGFyZ2V0RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkb3JSZW1vdmVXcmFwRXZlbnRMaXN0ZW5lcihlbGVtZW50LCB0YXJnZXRFdmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVJRVNjcm9sbChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzaG91bGRSYWlzZVRhcEV2ZW50OmZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhKHdpbmRvdy5Qb2ludGVyRXZlbnQgfHwgd2luZG93Lk1TUG9pbnRlckV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBUb3VjaExpc3RXcmFwcGVyKCkge1xuICAgICAgICAgICAgdmFyIHRvdWNoTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcztcblxuICAgICAgICAgICAgLy9yZWZlcjogaHR0cDovL3d3dy53My5vcmcvVFIvdG91Y2gtZXZlbnRzL1xuICAgICAgICAgICAgZnVuY3Rpb24gVG91Y2goaWRlbnRpZmllciwgdGFyZ2V0LCBzY3JlZW5YLCBzY3JlZW5ZLCBjbGllbnRYLCBjbGllbnRZLCBwYWdlWCwgcGFnZVkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi5pZGVudGlmaWVyID0gaWRlbnRpZmllcjtcbiAgICAgICAgICAgICAgICBzZWxmLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICBzZWxmLnNjcmVlblggPSBzY3JlZW5YO1xuICAgICAgICAgICAgICAgIHNlbGYuc2NyZWVuWSA9IHNjcmVlblk7XG4gICAgICAgICAgICAgICAgc2VsZi5jbGllbnRYID0gY2xpZW50WDtcbiAgICAgICAgICAgICAgICBzZWxmLmNsaWVudFkgPSBjbGllbnRZO1xuICAgICAgICAgICAgICAgIHNlbGYucGFnZVggPSBwYWdlWDtcbiAgICAgICAgICAgICAgICBzZWxmLnBhZ2VZID0gcGFnZVk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRvdWNoKGlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICB2YXIgbDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gdG91Y2hMaXN0Lmxlbmd0aDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG91Y2hMaXN0W2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b3VjaExpc3RbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFVwZGF0ZVRvdWNoKHRvdWNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgdmFyIGw7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IHRvdWNoTGlzdC5sZW5ndGg7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoTGlzdFtpXS5pZGVudGlmaWVyID09PSB0b3VjaC5pZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaExpc3RbaV0gPSB0b3VjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRvdWNoTGlzdC5wdXNoKHRvdWNoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVG91Y2goaWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciBsO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSB0b3VjaExpc3QubGVuZ3RoOyBpIDwgdG91Y2hMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaExpc3RbaV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2hMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJUb3VjaGVzKCkge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0b3VjaExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0b3VjaExpc3QucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjb250YWluc1RvdWNoQXQoc2NyZWVuWCwgc2NyZWVuWSkge1xuICAgICAgICAgICAgICAgIHZhciBpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRvdWNoTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG91Y2hMaXN0W2ldLnNjcmVlblggPT09IHNjcmVlblggJiYgdG91Y2hMaXN0W2ldLnNjcmVlblkgPT09IHNjcmVlblkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS50b3VjaExpc3QgPSB0b3VjaExpc3Q7XG5cbiAgICAgICAgICAgIHNjb3BlLlRvdWNoID0gVG91Y2g7XG4gICAgICAgICAgICBzY29wZS5nZXRUb3VjaCA9IGdldFRvdWNoO1xuICAgICAgICAgICAgc2NvcGUuYWRkVXBkYXRlVG91Y2ggPSBhZGRVcGRhdGVUb3VjaDtcbiAgICAgICAgICAgIHNjb3BlLnJlbW92ZVRvdWNoID0gcmVtb3ZlVG91Y2g7XG4gICAgICAgICAgICBzY29wZS5jbGVhclRvdWNoZXMgPSBjbGVhclRvdWNoZXM7XG4gICAgICAgICAgICBzY29wZS5jb250YWluc1RvdWNoQXQgPSBjb250YWluc1RvdWNoQXQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRvclJlbW92ZVdyYXBFdmVudExpc3RlbmVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCB1aWQsIGVuYWJsZSkge1xuICAgICAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICghd2luZG93LmNhY2hlZEV2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2FjaGVkRXZlbnRzID0gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2luZG93LmNhY2hlZEV2ZW50cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogdWlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5jYWNoZWRFdmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gd2luZG93LmNhY2hlZEV2ZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhY2hlZEV2ZW50ID0gd2luZG93LmNhY2hlZEV2ZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlZEV2ZW50LnVpZCA9PT0gaGFuZGxlci51aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlZEV2ZW50LmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihjYWNoZWRFdmVudC5ldmVudCwgY2FjaGVkRXZlbnQuaGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5jYWNoZWRFdmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY2FjaGVkRXZlbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgd2luZG93LmNhY2hlZEV2ZW50cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVRvdWNoQ2xvbmVkRXZlbnQoZXZlbnRBcmdzLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgZXZPYmo7XG4gICAgICAgICAgICB2YXIgb2xkVG91Y2g7XG4gICAgICAgICAgICB2YXIgb2xkVGFyZ2V0O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVUYXJnZXRUb3VjaGVzKHRoaXNUb3VjaFRhcmdldCwgdG91Y2hlc1RvdWNoTGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaDtcblxuICAgICAgICAgICAgICAgIHRhcmdldFRvdWNoZXNXcmFwcGVyLmNsZWFyVG91Y2hlcygpO1xuXG4gICAgICAgICAgICAgICAgLy90YXJnZXRUb3VjaGVzOmEgbGlzdCBvZiBUb3VjaGVzIGZvciBldmVyeSBwb2ludCBvZiBjb250YWN0IHRoYXQgaXMgdG91Y2hpbmcgdGhlIHN1cmZhY2UgYW5kIHN0YXJ0ZWQgb24gdGhlIGVsZW1lbnQgdGhhdCBpcyB0aGUgdGFyZ2V0IG9mIHRoZSBjdXJyZW50IGV2ZW50LlxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b3VjaGVzVG91Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoID0gdG91Y2hlc1RvdWNoTGlzdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoLnRhcmdldC5pc1NhbWVOb2RlKHRoaXNUb3VjaFRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFRvdWNoZXNXcmFwcGVyLmFkZFVwZGF0ZVRvdWNoKHRvdWNoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdG91Y2hIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50VHlwZTtcbiAgICAgICAgICAgICAgICB2YXIgdG91Y2g7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoRXZlbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNQb2ludGVyRG93bkV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudFR5cGUgPSAndG91Y2hzdGFydCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlID0gJ3RvdWNobW92ZSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG91Y2ggPSBuZXcgdG91Y2hlc1dyYXBwZXIuVG91Y2goZXZlbnQucG9pbnRlcklkLCAoaXNQb2ludGVyRG93bkV2ZW50KGV2ZW50KSA/IGV2ZW50LnRhcmdldCA6IG9sZFRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnNjcmVlblgsIGV2ZW50LnNjcmVlblksIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFksIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUsIGZyb20gY2hhbmdlZFRvdWNoZXMsIGFueSBUb3VjaCB0aGF0IGlzIG5vIGxvbmdlciBiZWluZyB0b3VjaGVkLCBvciBpcyBiZWluZyB0b3VjaGVkXG4gICAgICAgICAgICAgICAgLy8gaW4gZXhhY3RseSB0aGUgc2FtZSBwbGFjZS5cbiAgICAgICAgICAgICAgICAvLyBJbiBvcmRlciB0byBtYWtlIHN1cmUgdGhhdCBzaW11bHRhbmVvdXMgdG91Y2hlcyBkb24ndCBraWNrIGVhY2ggb3RoZXIgb2ZmIG9mIHRoZSBjaGFuZ2VkVG91Y2hlcyBhcnJheVxuICAgICAgICAgICAgICAgIC8vIChiZWNhdXNlIHRoZXkgYXJlIHByb2Nlc3NlZCBhcyBkaWZmZXJlbnQgcG9pbnRlciBldmVudHMpLCBza2lwIHRoaXMgaWYgdGhlIGxhc3RId1RpbWVzdGFtcCBoYXNuJ3QgaW5jcmVhc2VkLlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5od1RpbWVzdGFtcCA+IGxhc3RId1RpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkVG91Y2hMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYW5nZWRUb3VjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGluZ1RvdWNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkZW50aWZpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkVG91Y2hMaXN0ID0gY2hhbmdlZFRvdWNoZXNXcmFwcGVyLnRvdWNoTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGFuZ2VkVG91Y2hMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFRvdWNoID0gY2hhbmdlZFRvdWNoTGlzdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyID0gY2hhbmdlZFRvdWNoLmlkZW50aWZpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmdUb3VjaCA9IHRvdWNoZXNXcmFwcGVyLmdldFRvdWNoKGlkZW50aWZpZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXRjaGluZ1RvdWNoIHx8IHRvdWNoZXNBcmVBdFNhbWVTcG90KG1hdGNoaW5nVG91Y2gsIGNoYW5nZWRUb3VjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFRvdWNoZXNXcmFwcGVyLnJlbW92ZVRvdWNoKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRlcklkID0gZXZlbnQucG9pbnRlcklkO1xuICAgICAgICAgICAgICAgIGlmIChpc1BvaW50ZXJEb3duRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnTVNQb2ludGVyRG93bicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdWNoLnRhcmdldC5tc1NldFBvaW50ZXJDYXB0dXJlKHBvaW50ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaC50YXJnZXQuc2V0UG9pbnRlckNhcHR1cmUocG9pbnRlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8v6Zeu6aKY77ya5pyJ5Lqb5pe25YCZ77yM5b2T5omL5oyH56a75byA5b2T5YmN6aG16Z2i5pe277yMZWxlbWVudCDml6Dms5XmlLbliLBwb2ludGVyIHVwL2NhbmNsZSDkuovku7bvvIxcbiAgICAgICAgICAgICAgICAgICAgLy/lsLHmsqHmnInml7bmnLrljrtyZW1vdmUg56a75byA55qEdG91Y2ggcG9pbnRlclxuICAgICAgICAgICAgICAgICAgICAvL+aWueahiO+8muebruWJjeWPquacieWcqHBvaW50ZXJkb3du5pe25riF56m657yT5a2Y55qEcG9pbnRlciDkv6Hmga/jgIJcbiAgICAgICAgICAgICAgICAgICAgLy/lvbHlk43vvJrmjInnhafku6XliY3orr7orqHlj6/ku6XmlK/mjIHlpJrkuKrmiYvmjIfvvIznjrDlnKjlj6rog73mlK/mjIHljZXkuKrmiYvmjIfvvIzlm6DkuLpJReS4i+eahHpvb23ooYzkuLrlt7Lnu4/ooqvmtY/op4jlmajlrp7njrDvvIzmiYDku6VcbiAgICAgICAgICAgICAgICAgICAgLy/mlLnliqjkuI3kvJrlr7zoh7TnvLrlpLHjgILlkI7pnaLmnInml7bpl7TnmoTor53ov5nkuKrngrnpnIDopoHlho3ogIPomZHogIPomZEgLVRpbSA0LzI4LzIwMTUuXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoZXNXcmFwcGVyLmNsZWFyVG91Y2hlcygpO1xuICAgICAgICAgICAgICAgICAgICBsb2coJ3BvaW50ZXJEb3duICcgKyAndGltc3RhcDonICsgZXZlbnQuaHdUaW1lc3RhbXAgKyAnIHBvaW50ZXJJZDogJyArIGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdwb2ludGVyTW92ZScgKyAnIHRpbXN0YXA6JyArIGV2ZW50Lmh3VGltZXN0YW1wICsgJyBwb2ludGVySWQ6ICcgKyBldmVudC5wb2ludGVySWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB0b3VjaGVzV3JhcHBlci5hZGRVcGRhdGVUb3VjaCh0b3VjaCk7XG4gICAgICAgICAgICAgICAgY2hhbmdlZFRvdWNoZXNXcmFwcGVyLmFkZFVwZGF0ZVRvdWNoKHRvdWNoKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYXJnZXRUb3VjaGVzKHRvdWNoLnRhcmdldCwgdG91Y2hlc1dyYXBwZXIudG91Y2hMaXN0KTtcblxuICAgICAgICAgICAgICAgIHRvdWNoRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnRUeXBlLCB7YnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgIHRvdWNoRXZlbnQudG91Y2hlcyA9IHRvdWNoZXNXcmFwcGVyLnRvdWNoTGlzdDtcbiAgICAgICAgICAgICAgICB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzID0gY2hhbmdlZFRvdWNoZXNXcmFwcGVyLnRvdWNoTGlzdDtcbiAgICAgICAgICAgICAgICB0b3VjaEV2ZW50LnRhcmdldFRvdWNoZXMgPSB0YXJnZXRUb3VjaGVzV3JhcHBlci50b3VjaExpc3Q7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG91Y2hFdmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdG91Y2hDaGFuZ2VkSGFuZGxlcihldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBldmVudFR5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaEV2ZW50O1xuXG4gICAgICAgICAgICAgICAgZXZlbnQuY2hhbmdlZFRvdWNoZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPSAxO1xuICAgICAgICAgICAgICAgIGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdID0gZXZlbnQ7XG4gICAgICAgICAgICAgICAgZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllciA9IGV2ZW50LnBvaW50ZXJJZDtcblxuICAgICAgICAgICAgICAgIHRvdWNoID0gbmV3IHRvdWNoZXNXcmFwcGVyLlRvdWNoKGV2ZW50LnBvaW50ZXJJZCwgb2xkVGFyZ2V0LCBldmVudC5zY3JlZW5YLCBldmVudC5zY3JlZW5ZLCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCBldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzUG9pbnRlclVwRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZSA9ICd0b3VjaGVuZCc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnTVNQb2ludGVyVXAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaC50YXJnZXQubXNSZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdWNoLnRhcmdldC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBuZXcgdG91Y2ggZXZlbnQgaWYgaXQgaGFwcGVuZWQgYXQgYSBncmVhdGVyIHRpbWUgdGhhbiB0aGUgbGFzdCB0b3VjaCBldmVudC5cbiAgICAgICAgICAgICAgICAvLyBJZiBpdCBpcyBhIG5ldyB0b3VjaCBldmVudCwgY2xlYXIgb3V0IHRoZSBjaGFuZ2VkVG91Y2hlcyBUb3VjaExpc3QuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Lmh3VGltZXN0YW1wID4gbGFzdEh3VGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRUb3VjaGVzV3JhcHBlci5jbGVhclRvdWNoZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdG91Y2hlc1dyYXBwZXIucmVtb3ZlVG91Y2godG91Y2guaWRlbnRpZmllcik7XG4gICAgICAgICAgICAgICAgY2hhbmdlZFRvdWNoZXNXcmFwcGVyLmFkZFVwZGF0ZVRvdWNoKHRvdWNoKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVUYXJnZXRUb3VjaGVzKHRvdWNoLnRhcmdldCwgdG91Y2hlc1dyYXBwZXIudG91Y2hMaXN0KTtcblxuICAgICAgICAgICAgICAgIHRvdWNoRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnRUeXBlLCB7YnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgIHRvdWNoRXZlbnQudG91Y2hlcyA9IHRvdWNoZXNXcmFwcGVyLnRvdWNoTGlzdDtcbiAgICAgICAgICAgICAgICB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzID0gY2hhbmdlZFRvdWNoZXNXcmFwcGVyLnRvdWNoTGlzdDtcbiAgICAgICAgICAgICAgICB0b3VjaEV2ZW50LnRhcmdldFRvdWNoZXMgPSB0YXJnZXRUb3VjaGVzV3JhcHBlci50b3VjaExpc3Q7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdG91Y2hFdmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2codmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzUG9pbnRlckRvd25FdmVudChldmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudC50eXBlID09PSAnTVNQb2ludGVyRG93bicgfHwgZXZlbnQudHlwZSA9PT0gJ3BvaW50ZXJkb3duJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gaXNQb2ludGVyTW92ZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LnR5cGUgPT09ICdNU1BvaW50ZXJNb3ZlJyB8fCBldmVudC50eXBlID09PSAncG9pbnRlcm1vdmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBpc1BvaW50ZXJVcEV2ZW50KGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LnR5cGUgPT09ICdNU1BvaW50ZXJVcCcgfHwgZXZlbnQudHlwZSA9PT0gJ3BvaW50ZXJ1cCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpZ25vcmVQb2ludGVyRXZlbnQoZXZlbnRBcmdzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQW4gaW1wb3J0YW50IGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgTVMgcG9pbnRlciBldmVudHMgYW5kIHRoZSBXM0MgdG91Y2ggZXZlbnRzXG4gICAgICAgICAgICAvLyBpcyB0aGF0IGZvciBwb2ludGVyIGV2ZW50cyBleGNlcHQgZm9yIHBvaW50ZXJkb3duLCBhbGwgdGFyZ2V0IHRoZSBlbGVtZW50IHRoYXQgdGhlIHRvdWNoXG4gICAgICAgICAgICAvLyBpcyBvdmVyIHdoZW4gdGhlIGV2ZW50IGlzIGZpcmVkLlxuICAgICAgICAgICAgLy8gVGhlIFczQyB0b3VjaCBldmVudHMgdGFyZ2V0IHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaCBvcmlnaW5hbGx5IHN0YXJ0ZWQuXG4gICAgICAgICAgICAvLyBUaGVyZWZvcmUsIHdoZW4gdGhlc2UgZXZlbnRzIGFyZSBmaXJlZCwgd2UgbXVzdCBtYWtlIHRoaXMgY2hhbmdlIG1hbnVhbGx5LlxuICAgICAgICAgICAgaWYgKCFpc1BvaW50ZXJEb3duRXZlbnQoZXZlbnRBcmdzKSkge1xuICAgICAgICAgICAgICAgIG9sZFRvdWNoID0gdG91Y2hlc1dyYXBwZXIuZ2V0VG91Y2goZXZlbnRBcmdzLnBvaW50ZXJJZCk7XG4gICAgICAgICAgICAgICAgb2xkVGFyZ2V0ID0gb2xkVG91Y2ggPyBvbGRUb3VjaC50YXJnZXQgOiBldmVudEFyZ3MudGFyZ2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNQb2ludGVyRG93bkV2ZW50KGV2ZW50QXJncykgfHwgaXNQb2ludGVyTW92ZUV2ZW50KGV2ZW50QXJncykpIHtcbiAgICAgICAgICAgICAgICBldk9iaiA9IHRvdWNoSGFuZGxlcihldmVudEFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldk9iaiA9IHRvdWNoQ2hhbmdlZEhhbmRsZXIoZXZlbnRBcmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZPYmoucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRBcmdzLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50QXJncy5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbChldmVudEFyZ3MudGFyZ2V0LCBldk9iaik7XG5cbiAgICAgICAgICAgIGxhc3RId1RpbWVzdGFtcCA9IGV2ZW50QXJncy5od1RpbWVzdGFtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50TmFtZUdlbmVyYXRlKGV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnRNYXBwaW5nc1tldmVudF1bbWFwcGluZ0luZGV4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN1cHBvcnRUYXJnZXRFdmVudChlbGVtZW50LCBldmVudCkge1xuICAgICAgICAgICAgdmFyIGV2ZW50UHJvID0gJ29uJyArIGV2ZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gKGV2ZW50UHJvIGluIGVsZW1lbnQpIHx8IChlbGVtZW50Lmhhc093blByb3BlcnR5KGV2ZW50UHJvKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpZ25vcmVQb2ludGVyRXZlbnQoZXZlbnQpIHtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LnBvaW50ZXJUeXBlID09PSAnbW91c2UnIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAncG9pbnRlcmRvd24nICYmIGV2ZW50LnggPT09IDAgJiYgZXZlbnQueSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXZlbnQucG9pbnRlclR5cGUgPT09ICdwZW4nICYmIGV2ZW50LnByZXNzdXJlID09PSAwICYmIGV2ZW50LnR5cGUgPT09ICdwb2ludGVybW92ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvdWNoZXNBcmVBdFNhbWVTcG90KHRvdWNoMCwgdG91Y2gxKSB7XG4gICAgICAgICAgICByZXR1cm4gdG91Y2gwLnNjcmVlblggPT09IHRvdWNoMS5zY3JlZW5YICYmIHRvdWNoMC5zY3JlZW5ZID09PSB0b3VjaDEuc2NyZWVuWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRpc2FibGVJRVNjcm9sbChlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnNldEF0dHJpYnV0ZSgnLW1zLXRvdWNoLWFjdGlvbicsICdub25lOycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZW5hYmxlSUVTY3JvbGwoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5zdHlsZSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuTVNQb2ludGVyRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoJy1tcy10b3VjaC1hY3Rpb24nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBndWlkKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gczQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHM0KCkgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgK1xuICAgICAgICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b3VjaGVzV3JhcHBlciA9IG5ldyBUb3VjaExpc3RXcmFwcGVyKCk7XG4gICAgICAgIGNoYW5nZWRUb3VjaGVzV3JhcHBlciA9IG5ldyBUb3VjaExpc3RXcmFwcGVyKCk7XG4gICAgICAgIHRhcmdldFRvdWNoZXNXcmFwcGVyID0gbmV3IFRvdWNoTGlzdFdyYXBwZXIoKTtcblxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IFRvdWNoV3JhcHBlcjtcbiAgICB9KHdpbmRvdykpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zY3JpcHRzL2dyaWQvVG91Y2guanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJUcmVsbGlzU3RyYXRlZ3kuanMifQ==