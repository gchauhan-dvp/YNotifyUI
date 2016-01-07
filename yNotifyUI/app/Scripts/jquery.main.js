

/*
 * jQuery Accordion plugin
 */
; (function ($) {
    $.fn.slideAccordion = function (opt) {
        // default options
        var options = $.extend({
            addClassBeforeAnimation: false,
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 300,
            collapsible: true,
            event: 'click'
        }, opt);

        return this.each(function () {
            // options
            var accordion = $(this);
            var items = accordion.find(':has(' + options.slider + ')');

            items.each(function () {
                var item = $(this);
                var opener = item.find(options.opener);
                var slider = item.find(options.slider);
                opener.bind(options.event, function (e) {
                    if (!slider.is(':animated')) {
                        if (item.hasClass(options.activeClass)) {
                            if (options.collapsible) {
                                slider.slideUp(options.animSpeed, function () {
                                    hideSlide(slider);
                                    item.removeClass(options.activeClass);
                                });
                            }
                        } else {
                            // show active
                            var levelItems = item.siblings('.' + options.activeClass);
                            var sliderElements = levelItems.find(options.slider);
                            item.addClass(options.activeClass);
                            showSlide(slider).hide().slideDown(options.animSpeed);

                            // collapse others
                            sliderElements.slideUp(options.animSpeed, function () {
                                levelItems.removeClass(options.activeClass);
                                hideSlide(sliderElements);
                            });
                        }
                    }
                    e.preventDefault();
                });
                if (item.hasClass(options.activeClass)) showSlide(slider); else hideSlide(slider);
            });
        });
    };

    // accordion slide visibility
    var showSlide = function (slide) {
        return slide.css({ position: '', top: '', left: '', width: '' });
    };
    var hideSlide = function (slide) {
        return slide.show().css({ position: 'absolute', top: -9999, left: -9999, width: slide.width() });
    };
}(jQuery));

// main navigation init
function initNavigation() {
    var activeClass = 'expanded',
		scrollClass = 'scrolled',
		animDuration = 400,
		win = jQuery(window),
		fixedClass = 'fixed';



    jQuery('.columns').each(function () {
        var holder = jQuery(this),
			page = jQuery('html'),
			contentBlock = jQuery('.info-block'),
			opener = holder.find('.btn-item'),
			drop = holder.find('.panel'),
            reload = holder.find('.btn-reload');
        overlay = jQuery('.administration .bg-main');

        reload.on('mouseenter   touchstart focus', function () {
            $(this).addClass('btn-reload-hover');
            
        });

        reload.bind('touchend mouseout blur', function () {
            $(this).removeClass('btn-reload-hover');
        });

        // navigation toggle
        function toggleMenu() {
            opener.addClass('btn-item-hover');
            if (holder.hasClass(activeClass)) {
                hideMenu();
                $('.slide').hide();
                $('.slide').closest('li').removeClass('active');
            } else {
                showMenu();
            }
        }

        function showMenu() {
            
            holder.addClass(activeClass).animate({ left: drop.width() }, animDuration, function () { opener.removeClass('btn-item-hover'); });
            page.addClass(scrollClass);
            overlay.fadeIn(animDuration);
            
           
        }
        function hideMenu() {
            holder.removeClass(activeClass).animate({ left: 0 }, animDuration, function () {
                opener.removeClass('btn-item-hover');
                page.removeClass(scrollClass);
            });
            overlay.fadeOut(animDuration);
           

        }

        // click event handler
        opener.on('click', function (e) {
            e.preventDefault();
            toggleMenu();
        });

        page.removeClass(scrollClass);
    });
}

// accordion menu init
function initAccordion() {
    jQuery('.accordion').slideAccordion({
        opener: '.opener',
        slider: '.slide',
        animSpeed: 300
    });
}

// clear inputs on focus
function initInputs() {
    PlaceholderInput.replaceByOptions({
        // filter options
        clearInputs: true,
        clearTextareas: true,
        clearPasswords: true,
        skipClass: 'default',

        // input options
        wrapWithElement: false,
        showUntilTyping: false,
        getParentByClass: false,
        placeholderAttr: 'value'
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.person-list').sameHeight({
        elements: 'a',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });
    jQuery('.post-nav').sameHeight({
        elements: 'a',
        flexible: true
    });
}



/*
 * jQuery SameHeight plugin
 */
; (function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }
            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;
            var isBorderBox = element.css('boxSizing') === 'border-box';

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (parent.is(this)) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function ($) {
    $(function () {
        var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
        var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

        // required styles
        resizeFrame.css({
            width: '100em',
            height: '10px',
            position: 'absolute',
            borderWidth: 0,
            top: '-9999px',
            left: '-9999px'
        }).appendTo('body');

        // use native IE resize event if possible
        if (window.attachEvent && !window.addEventListener) {
            resizeFrame.bind('resize', function () {
                $.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
            });
        }
            // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame[0].contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
        jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
    });
    return {
        // public method, so it can be called from within the iframe
        trigger: function (em) {
            $(window).trigger("fontresize", [em]);
        }
    };
}(jQuery));

/*
 * JavaScript Custom Forms Module
 */
jcf = {
    // global options
    modules: {},
    plugins: {},
    baseOptions: {
        unselectableClass: 'jcf-unselectable',
        labelActiveClass: 'jcf-label-active',
        labelDisabledClass: 'jcf-label-disabled',
        classPrefix: 'jcf-class-',
        hiddenClass: 'jcf-hidden',
        focusClass: 'jcf-focus',
        wrapperTag: 'div'
    },
    // replacer function
    customForms: {
        setOptions: function (obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && typeof obj[p] === 'object') {
                    jcf.lib.extend(jcf.modules[p].prototype.defaultOptions, obj[p]);
                }
            }
        },
        replaceAll: function (context) {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector, context);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    } else {
                        // replace form element
                        if (!jcf.lib.hasClass(els[i], 'default') && jcf.modules[k].prototype.checkElement(els[i])) {
                            new jcf.modules[k]({
                                replaces: els[i]
                            });
                        }
                    }
                }
            }
        },
        refreshAll: function (context) {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector, context);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    }
                }
            }
        },
        refreshElement: function (obj) {
            if (obj && obj.jcf) {
                obj.jcf.refreshState();
            }
        },
        destroyAll: function () {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        els[i].jcf.destroy();
                    }
                }
            }
        }
    },
    // detect device type
    isTouchDevice: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    isWinPhoneDevice: navigator.msPointerEnabled && /MSIE 10.*Touch/.test(navigator.userAgent),
    // define base module
    setBaseModule: function (obj) {
        jcf.customControl = function (opt) {
            this.options = jcf.lib.extend({}, jcf.baseOptions, this.defaultOptions, opt);
            this.init();
        };
        for (var p in obj) {
            jcf.customControl.prototype[p] = obj[p];
        }
    },
    // add module to jcf.modules
    addModule: function (obj) {
        if (obj.name) {
            // create new module proto class
            jcf.modules[obj.name] = function () {
                jcf.modules[obj.name].superclass.constructor.apply(this, arguments);
            }
            jcf.lib.inherit(jcf.modules[obj.name], jcf.customControl);
            for (var p in obj) {
                jcf.modules[obj.name].prototype[p] = obj[p]
            }
            // on create module
            jcf.modules[obj.name].prototype.onCreateModule();
            // make callback for exciting modules
            for (var mod in jcf.modules) {
                if (jcf.modules[mod] != jcf.modules[obj.name]) {
                    jcf.modules[mod].prototype.onModuleAdded(jcf.modules[obj.name]);
                }
            }
        }
    },
    // add plugin to jcf.plugins
    addPlugin: function (obj) {
        if (obj && obj.name) {
            jcf.plugins[obj.name] = function () {
                this.init.apply(this, arguments);
            }
            for (var p in obj) {
                jcf.plugins[obj.name].prototype[p] = obj[p];
            }
        }
    },
    // miscellaneous init
    init: function () {
        if (navigator.pointerEnabled) {
            this.eventPress = 'pointerdown';
            this.eventMove = 'pointermove';
            this.eventRelease = 'pointerup';
        } else if (navigator.msPointerEnabled) {
            this.eventPress = 'MSPointerDown';
            this.eventMove = 'MSPointerMove';
            this.eventRelease = 'MSPointerUp';
        } else {
            this.eventPress = this.isTouchDevice ? 'touchstart' : 'mousedown';
            this.eventMove = this.isTouchDevice ? 'touchmove' : 'mousemove';
            this.eventRelease = this.isTouchDevice ? 'touchend' : 'mouseup';
        }

        setTimeout(function () {
            jcf.lib.domReady(function () {
                jcf.initStyles();
            });
        }, 1);
        return this;
    },
    initStyles: function () {
        // create <style> element and rules
        var head = document.getElementsByTagName('head')[0],
			style = document.createElement('style'),
			rules = document.createTextNode('.' + jcf.baseOptions.unselectableClass + '{' +
				'-moz-user-select:none;' +
				'-webkit-tap-highlight-color:rgba(255,255,255,0);' +
				'-webkit-user-select:none;' +
				'user-select:none;' +
			'}');

        // append style element
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = rules.nodeValue;
        } else {
            style.appendChild(rules);
        }
        head.appendChild(style);
    }
}.init();

/*
 * Custom Form Control prototype
 */
jcf.setBaseModule({
    init: function () {
        if (this.options.replaces) {
            this.realElement = this.options.replaces;
            this.realElement.jcf = this;
            this.replaceObject();
        }
    },
    defaultOptions: {
        // default module options (will be merged with base options)
    },
    checkElement: function (el) {
        return true; // additional check for correct form element
    },
    replaceObject: function () {
        this.createWrapper();
        this.attachEvents();
        this.fixStyles();
        this.setupWrapper();
    },
    createWrapper: function () {
        this.fakeElement = jcf.lib.createElement(this.options.wrapperTag);
        this.labelFor = jcf.lib.getLabelFor(this.realElement);
        jcf.lib.disableTextSelection(this.fakeElement);
        jcf.lib.addClass(this.fakeElement, jcf.lib.getAllClasses(this.realElement.className, this.options.classPrefix));
        jcf.lib.addClass(this.realElement, jcf.baseOptions.hiddenClass);
    },
    attachEvents: function () {
        jcf.lib.event.add(this.realElement, 'focus', this.onFocusHandler, this);
        jcf.lib.event.add(this.realElement, 'blur', this.onBlurHandler, this);
        jcf.lib.event.add(this.fakeElement, 'click', this.onFakeClick, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventPress, this.onFakePressed, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventRelease, this.onFakeReleased, this);

        if (this.labelFor) {
            this.labelFor.jcf = this;
            jcf.lib.event.add(this.labelFor, 'click', this.onFakeClick, this);
            jcf.lib.event.add(this.labelFor, jcf.eventPress, this.onFakePressed, this);
            jcf.lib.event.add(this.labelFor, jcf.eventRelease, this.onFakeReleased, this);
        }
    },
    fixStyles: function () {
        // hide mobile webkit tap effect
        if (jcf.isTouchDevice) {
            var tapStyle = 'rgba(255,255,255,0)';
            this.realElement.style.webkitTapHighlightColor = tapStyle;
            this.fakeElement.style.webkitTapHighlightColor = tapStyle;
            if (this.labelFor) {
                this.labelFor.style.webkitTapHighlightColor = tapStyle;
            }
        }
    },
    setupWrapper: function () {
        // implement in subclass
    },
    refreshState: function () {
        // implement in subclass
    },
    destroy: function () {
        if (this.fakeElement && this.fakeElement.parentNode) {
            this.fakeElement.parentNode.removeChild(this.fakeElement);
        }
        jcf.lib.removeClass(this.realElement, jcf.baseOptions.hiddenClass);
        this.realElement.jcf = null;
    },
    onFocus: function () {
        // emulated focus event
        jcf.lib.addClass(this.fakeElement, this.options.focusClass);
    },
    onBlur: function (cb) {
        // emulated blur event
        jcf.lib.removeClass(this.fakeElement, this.options.focusClass);
    },
    onFocusHandler: function () {
        // handle focus loses
        if (this.focused) return;
        this.focused = true;

        // handle touch devices also
        if (jcf.isTouchDevice) {
            if (jcf.focusedInstance && jcf.focusedInstance.realElement != this.realElement) {
                jcf.focusedInstance.onBlur();
                jcf.focusedInstance.realElement.blur();
            }
            jcf.focusedInstance = this;
        }
        this.onFocus.apply(this, arguments);
    },
    onBlurHandler: function () {
        // handle focus loses
        if (!this.pressedFlag) {
            this.focused = false;
            this.onBlur.apply(this, arguments);
        }
    },
    onFakeClick: function () {
        if (jcf.isTouchDevice) {
            this.onFocus();
        } else if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakePressed: function (e) {
        this.pressedFlag = true;
    },
    onFakeReleased: function () {
        this.pressedFlag = false;
    },
    onCreateModule: function () {
        // implement in subclass
    },
    onModuleAdded: function (module) {
        // implement in subclass
    },
    onControlReady: function () {
        // implement in subclass
    }
});

/*
 * JCF Utility Library
 */
jcf.lib = {
    bind: function (func, scope) {
        return function () {
            return func.apply(scope, arguments);
        };
    },
    browser: (function () {
        var ua = navigator.userAgent.toLowerCase(), res = {},
		match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
        res[match[1]] = true;
        res.version = match[2] || "0";
        res.safariMac = ua.indexOf('mac') != -1 && ua.indexOf('safari') != -1;
        return res;
    })(),
    getOffset: function (obj) {
        if (obj.getBoundingClientRect && !jcf.isWinPhoneDevice) {
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
            var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
            return {
                top: Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
                left: Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
            };
        } else {
            var posLeft = 0, posTop = 0;
            while (obj.offsetParent) { posLeft += obj.offsetLeft; posTop += obj.offsetTop; obj = obj.offsetParent; }
            return { top: posTop, left: posLeft };
        }
    },
    getScrollTop: function () {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    getScrollLeft: function () {
        return window.pageXOffset || document.documentElement.scrollLeft;
    },
    getWindowWidth: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth;
    },
    getWindowHeight: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
    },
    getStyle: function (el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    },
    getParent: function (obj, selector) {
        while (obj.parentNode && obj.parentNode != document.body) {
            if (obj.parentNode.tagName.toLowerCase() == selector.toLowerCase()) {
                return obj.parentNode;
            }
            obj = obj.parentNode;
        }
        return false;
    },
    isParent: function (parent, child) {
        while (child.parentNode) {
            if (child.parentNode === parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    getLabelFor: function (object) {
        var parentLabel = jcf.lib.getParent(object, 'label');
        if (parentLabel) {
            return parentLabel;
        } else if (object.id) {
            return jcf.lib.queryBySelector('label[for="' + object.id + '"]')[0];
        }
    },
    disableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = function () { return false; };
        } else if (window.opera) {
            el.setAttribute('unselectable', 'on');
        } else {
            jcf.lib.addClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    enableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = null;
        } else if (window.opera) {
            el.removeAttribute('unselectable');
        } else {
            jcf.lib.removeClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    queryBySelector: function (selector, scope) {
        if (typeof scope === 'string') {
            var result = [];
            var holders = this.getElementsBySelector(scope);
            for (var i = 0, contextNodes; i < holders.length; i++) {
                contextNodes = Array.prototype.slice.call(this.getElementsBySelector(selector, holders[i]));
                result = result.concat(contextNodes);
            }
            return result;
        } else {
            return this.getElementsBySelector(selector, scope);
        }
    },
    prevSibling: function (node) {
        while (node = node.previousSibling) if (node.nodeType == 1) break;
        return node;
    },
    nextSibling: function (node) {
        while (node = node.nextSibling) if (node.nodeType == 1) break;
        return node;
    },
    fireEvent: function (element, event) {
        if (element.dispatchEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        } else if (document.createEventObject) {
            var evt = document.createEventObject();
            return element.fireEvent('on' + event, evt);
        }
    },
    inherit: function (Child, Parent) {
        var F = function () { }
        F.prototype = Parent.prototype
        Child.prototype = new F()
        Child.prototype.constructor = Child
        Child.superclass = Parent.prototype
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    hasClass: function (obj, cname) {
        return (obj.className ? obj.className.match(new RegExp('(\\s|^)' + cname + '(\\s|$)')) : false);
    },
    addClass: function (obj, cname) {
        if (!this.hasClass(obj, cname)) obj.className += (!obj.className.length || obj.className.charAt(obj.className.length - 1) === ' ' ? '' : ' ') + cname;
    },
    removeClass: function (obj, cname) {
        if (this.hasClass(obj, cname)) obj.className = obj.className.replace(new RegExp('(\\s|^)' + cname + '(\\s|$)'), ' ').replace(/\s+$/, '');
    },
    toggleClass: function (obj, cname, condition) {
        if (condition) this.addClass(obj, cname); else this.removeClass(obj, cname);
    },
    createElement: function (tagName, options) {
        var el = document.createElement(tagName);
        for (var p in options) {
            if (options.hasOwnProperty(p)) {
                switch (p) {
                    case 'class': el.className = options[p]; break;
                    case 'html': el.innerHTML = options[p]; break;
                    case 'style': this.setStyles(el, options[p]); break;
                    default: el.setAttribute(p, options[p]);
                }
            }
        }
        return el;
    },
    setStyles: function (el, styles) {
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                switch (p) {
                    case 'float': el.style.cssFloat = styles[p]; break;
                    case 'opacity': el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + styles[p] * 100 + ')'; el.style.opacity = styles[p]; break;
                    default: el.style[p] = (typeof styles[p] === 'undefined' ? 0 : styles[p]) + (typeof styles[p] === 'number' ? 'px' : '');
                }
            }
        }
        return el;
    },
    getInnerWidth: function (el) {
        return el.offsetWidth - (parseInt(this.getStyle(el, 'paddingLeft')) || 0) - (parseInt(this.getStyle(el, 'paddingRight')) || 0);
    },
    getInnerHeight: function (el) {
        return el.offsetHeight - (parseInt(this.getStyle(el, 'paddingTop')) || 0) - (parseInt(this.getStyle(el, 'paddingBottom')) || 0);
    },
    getAllClasses: function (cname, prefix, skip) {
        if (!skip) skip = '';
        if (!prefix) prefix = '';
        return cname ? cname.replace(new RegExp('(\\s|^)' + skip + '(\\s|$)'), ' ').replace(/[\s]*([\S]+)+[\s]*/gi, prefix + "$1 ") : '';
    },
    getElementsBySelector: function (selector, scope) {
        if (typeof document.querySelectorAll === 'function') {
            return (scope || document).querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = [element];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=': checkFunction = function (e) { return (e.getAttribute(attrName) == attrValue) }; break;
                        case '~': checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)'))) }; break;
                        case '|': checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?'))) }; break;
                        case '^': checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
                        case '$': checkFunction = function (e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
                        case '*': checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
                        default: checkFunction = function (e) { return e.getAttribute(attrName) };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    scrollSize: (function () {
        var content, hold, sizeBefore, sizeAfter;
        function buildSizer() {
            if (hold) removeSizer();
            content = document.createElement('div');
            hold = document.createElement('div');
            hold.style.cssText = 'position:absolute;overflow:hidden;width:100px;height:100px';
            hold.appendChild(content);
            document.body.appendChild(hold);
        }
        function removeSizer() {
            document.body.removeChild(hold);
            hold = null;
        }
        function calcSize(vertical) {
            buildSizer();
            content.style.cssText = 'height:' + (vertical ? '100%' : '200px');
            sizeBefore = (vertical ? content.offsetHeight : content.offsetWidth);
            hold.style.overflow = 'scroll'; content.innerHTML = 1;
            sizeAfter = (vertical ? content.offsetHeight : content.offsetWidth);
            if (vertical && hold.clientHeight) sizeAfter = hold.clientHeight;
            removeSizer();
            return sizeBefore - sizeAfter;
        }
        return {
            getWidth: function () {
                return calcSize(false);
            },
            getHeight: function () {
                return calcSize(true)
            }
        }
    }()),
    domReady: function (handler) {
        var called = false
        function ready() {
            if (called) return;
            called = true;
            handler();
        }
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", ready, false);
        } else if (document.attachEvent) {
            if (document.documentElement.doScroll && window == window.top) {
                function tryScroll() {
                    if (called) return
                    if (!document.body) return
                    try {
                        document.documentElement.doScroll("left")
                        ready()
                    } catch (e) {
                        setTimeout(tryScroll, 0)
                    }
                }
                tryScroll()
            }
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    ready()
                }
            })
        }
        if (window.addEventListener) window.addEventListener('load', ready, false)
        else if (window.attachEvent) window.attachEvent('onload', ready)
    },
    event: (function () {
        var guid = 0;
        function fixEvent(e) {
            e = e || window.event;
            if (e.isFixed) {
                return e;
            }
            e.isFixed = true;
            e.preventDefault = e.preventDefault || function () { this.returnValue = false }
            e.stopPropagation = e.stopPropagation || function () { this.cancelBubble = true }
            if (!e.target) {
                e.target = e.srcElement
            }
            if (!e.relatedTarget && e.fromElement) {
                e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;
            }
            if (e.pageX == null && e.clientX != null) {
                var html = document.documentElement, body = document.body;
                e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
                e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
            }
            if (!e.which && e.button) {
                e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
            }
            if (e.type === "DOMMouseScroll" || e.type === 'mousewheel') {
                e.mWheelDelta = 0;
                if (e.wheelDelta) {
                    e.mWheelDelta = e.wheelDelta / 120;
                } else if (e.detail) {
                    e.mWheelDelta = -e.detail / 3;
                }
            }
            return e;
        }
        function commonHandle(event, customScope) {
            event = fixEvent(event);
            var handlers = this.events[event.type];
            for (var g in handlers) {
                var handler = handlers[g];
                var ret = handler.call(customScope || this, event);
                if (ret === false) {
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
        }
        var publicAPI = {
            add: function (elem, type, handler, forcedScope) {
                if (elem.setInterval && (elem != window && !elem.frameElement)) {
                    elem = window;
                }
                if (!handler.guid) {
                    handler.guid = ++guid;
                }
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (event) {
                        return commonHandle.call(elem, event);
                    }
                }
                if (!elem.events[type]) {
                    elem.events[type] = {};
                    if (elem.addEventListener) elem.addEventListener(type, elem.handle, false);
                    else if (elem.attachEvent) elem.attachEvent("on" + type, elem.handle);
                    if (type === 'mousewheel') {
                        publicAPI.add(elem, 'DOMMouseScroll', handler, forcedScope);
                    }
                }
                var fakeHandler = jcf.lib.bind(handler, forcedScope);
                fakeHandler.guid = handler.guid;
                elem.events[type][handler.guid] = forcedScope ? fakeHandler : handler;
            },
            remove: function (elem, type, handler) {
                var handlers = elem.events && elem.events[type];
                if (!handlers) return;
                delete handlers[handler.guid];
                for (var any in handlers) return;
                if (elem.removeEventListener) elem.removeEventListener(type, elem.handle, false);
                else if (elem.detachEvent) elem.detachEvent("on" + type, elem.handle);
                delete elem.events[type];
                for (var any in elem.events) return;
                try {
                    delete elem.handle;
                    delete elem.events;
                } catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute("handle");
                        elem.removeAttribute("events");
                    }
                }
                if (type === 'mousewheel') {
                    publicAPI.remove(elem, 'DOMMouseScroll', handler);
                }
            }
        }
        return publicAPI;
    }())
}

// custom radio module
jcf.addModule({
    name: 'radio',
    selector: 'input[type="radio"]',
    defaultOptions: {
        wrapperClass: 'rad-area',
        focusClass: 'rad-focus',
        checkedClass: 'rad-checked',
        uncheckedClass: 'rad-unchecked',
        disabledClass: 'rad-disabled',
        radStructure: '<span></span>'
    },
    getRadioGroup: function (item) {
        var name = item.getAttribute('name');
        if (name) {
            return jcf.lib.queryBySelector('input[name="' + name + '"]', jcf.lib.getParent('form'));
        } else {
            return [item];
        }
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.radStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        this.refreshState();
        this.addEvents();
    },
    addEvents: function () {
        jcf.lib.event.add(this.fakeElement, 'click', this.toggleRadio, this);
        if (this.labelFor) {
            jcf.lib.event.add(this.labelFor, 'click', this.toggleRadio, this);
        }
    },
    onFocus: function (e) {
        jcf.modules[this.name].superclass.onFocus.apply(this, arguments);
        setTimeout(jcf.lib.bind(function () {
            this.refreshState();
        }, this), 10);
    },
    toggleRadio: function () {
        if (!this.realElement.disabled && !this.realElement.checked) {
            this.realElement.checked = true;
            jcf.lib.fireEvent(this.realElement, 'change');
        }
        this.refreshState();
    },
    refreshState: function () {
        var els = this.getRadioGroup(this.realElement);
        for (var i = 0; i < els.length; i++) {
            var curEl = els[i].jcf;
            if (curEl) {
                if (curEl.realElement.checked) {
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.checkedClass);
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.uncheckedClass);
                    if (curEl.labelFor) {
                        jcf.lib.addClass(curEl.labelFor, curEl.options.labelActiveClass);
                    }
                } else {
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.checkedClass);
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.uncheckedClass);
                    if (curEl.labelFor) {
                        jcf.lib.removeClass(curEl.labelFor, curEl.options.labelActiveClass);
                    }
                }
                if (curEl.realElement.disabled) {
                    jcf.lib.addClass(curEl.fakeElement, curEl.options.disabledClass);
                    if (curEl.labelFor) {
                        jcf.lib.addClass(curEl.labelFor, curEl.options.labelDisabledClass);
                    }
                } else {
                    jcf.lib.removeClass(curEl.fakeElement, curEl.options.disabledClass);
                    if (curEl.labelFor) {
                        jcf.lib.removeClass(curEl.labelFor, curEl.options.labelDisabledClass);
                    }
                }
            }
        }
    }
});

// custom checkbox module
jcf.addModule({
    name: 'checkbox',
    selector: 'input[type="checkbox"]',
    defaultOptions: {
        wrapperClass: 'chk-area',
        focusClass: 'chk-focus',
        checkedClass: 'chk-checked',
        labelActiveClass: 'chk-label-active',
        uncheckedClass: 'chk-unchecked',
        disabledClass: 'chk-disabled',
        chkStructure: '<span></span>'
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.chkStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        jcf.lib.event.add(this.realElement, 'click', this.onRealClick, this);
        this.refreshState();
    },
    isLinkTarget: function (target, limitParent) {
        while (target.parentNode || target === limitParent) {
            if (target.tagName.toLowerCase() === 'a') {
                return true;
            }
            target = target.parentNode;
        }
    },
    onFakePressed: function () {
        jcf.modules[this.name].superclass.onFakePressed.apply(this, arguments);
        if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakeClick: function (e) {
        jcf.modules[this.name].superclass.onFakeClick.apply(this, arguments);
        this.tmpTimer = setTimeout(jcf.lib.bind(function () {
            this.toggle();
        }, this), 10);
        if (!this.isLinkTarget(e.target, this.labelFor)) {
            return false;
        }
    },
    onRealClick: function (e) {
        setTimeout(jcf.lib.bind(function () {
            this.refreshState();
        }, this), 10);
        e.stopPropagation();
    },
    toggle: function (e) {
        if (!this.realElement.disabled) {
            if (this.realElement.checked) {
                this.realElement.checked = false;
            } else {
                this.realElement.checked = true;
            }
        }
        this.refreshState();
        jcf.lib.fireEvent(this.realElement, 'change');
        return false;
    },
    refreshState: function () {
        if (this.realElement.checked) {
            jcf.lib.addClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.removeClass(this.fakeElement, this.options.uncheckedClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelActiveClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.addClass(this.fakeElement, this.options.uncheckedClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelActiveClass);
            }
        }
        if (this.realElement.disabled) {
            jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
            }
        }
    }
});


// placeholder class
; (function () {
    var placeholderCollection = [];
    PlaceholderInput = function () {
        this.options = {
            element: null,
            showUntilTyping: false,
            wrapWithElement: false,
            getParentByClass: false,
            showPasswordBullets: false,
            placeholderAttr: 'value',
            inputFocusClass: 'focus',
            inputActiveClass: 'text-active',
            parentFocusClass: 'parent-focus',
            parentActiveClass: 'parent-active',
            labelFocusClass: 'label-focus',
            labelActiveClass: 'label-active',
            fakeElementClass: 'input-placeholder-text'
        };
        placeholderCollection.push(this);
        this.init.apply(this, arguments);
    };
    PlaceholderInput.refreshAllInputs = function (except) {
        for (var i = 0; i < placeholderCollection.length; i++) {
            if (except !== placeholderCollection[i]) {
                placeholderCollection[i].refreshState();
            }
        }
    };
    PlaceholderInput.replaceByOptions = function (opt) {
        var inputs = [].concat(
			convertToArray(document.getElementsByTagName('input')),
			convertToArray(document.getElementsByTagName('textarea'))
		);
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].className.indexOf(opt.skipClass) < 0) {
                var inputType = getInputType(inputs[i]);
                var placeholderValue = inputs[i].getAttribute('placeholder');
                if (opt.focusOnly || (opt.clearInputs && (inputType === 'text' || inputType === 'email' || placeholderValue)) ||
					(opt.clearTextareas && inputType === 'textarea') ||
					(opt.clearPasswords && inputType === 'password')
				) {
                    new PlaceholderInput({
                        element: inputs[i],
                        focusOnly: opt.focusOnly,
                        wrapWithElement: opt.wrapWithElement,
                        showUntilTyping: opt.showUntilTyping,
                        getParentByClass: opt.getParentByClass,
                        showPasswordBullets: opt.showPasswordBullets,
                        placeholderAttr: placeholderValue ? 'placeholder' : opt.placeholderAttr
                    });
                }
            }
        }
    };
    PlaceholderInput.prototype = {
        init: function (opt) {
            this.setOptions(opt);
            if (this.element && this.element.PlaceholderInst) {
                this.element.PlaceholderInst.refreshClasses();
            } else {
                this.element.PlaceholderInst = this;
                if (this.elementType !== 'radio' || this.elementType !== 'checkbox' || this.elementType !== 'file') {
                    this.initElements();
                    this.attachEvents();
                    this.refreshClasses();
                }
            }
        },
        setOptions: function (opt) {
            for (var p in opt) {
                if (opt.hasOwnProperty(p)) {
                    this.options[p] = opt[p];
                }
            }
            if (this.options.element) {
                this.element = this.options.element;
                this.elementType = getInputType(this.element);
                if (this.options.focusOnly) {
                    this.wrapWithElement = false;
                } else {
                    if (this.elementType === 'password' && this.options.showPasswordBullets) {
                        this.wrapWithElement = false;
                    } else {
                        this.wrapWithElement = this.elementType === 'password' || this.options.showUntilTyping ? true : this.options.wrapWithElement;
                    }
                }
                this.setPlaceholderValue(this.options.placeholderAttr);
            }
        },
        setPlaceholderValue: function (attr) {
            this.origValue = (attr === 'value' ? this.element.defaultValue : (this.element.getAttribute(attr) || ''));
            if (this.options.placeholderAttr !== 'value') {
                this.element.removeAttribute(this.options.placeholderAttr);
            }
        },
        initElements: function () {
            // create fake element if needed
            if (this.wrapWithElement) {
                this.fakeElement = document.createElement('span');
                this.fakeElement.className = this.options.fakeElementClass;
                this.fakeElement.innerHTML += this.origValue;
                this.fakeElement.style.color = getStyle(this.element, 'color');
                this.fakeElement.style.position = 'absolute';
                this.element.parentNode.insertBefore(this.fakeElement, this.element);

                if (this.element.value === this.origValue || !this.element.value) {
                    this.element.value = '';
                    this.togglePlaceholderText(true);
                } else {
                    this.togglePlaceholderText(false);
                }
            } else if (!this.element.value && this.origValue.length) {
                this.element.value = this.origValue;
            }
            // get input label
            if (this.element.id) {
                this.labels = document.getElementsByTagName('label');
                for (var i = 0; i < this.labels.length; i++) {
                    if (this.labels[i].htmlFor === this.element.id) {
                        this.labelFor = this.labels[i];
                        break;
                    }
                }
            }
            // get parent node (or parentNode by className)
            this.elementParent = this.element.parentNode;
            if (typeof this.options.getParentByClass === 'string') {
                var el = this.element;
                while (el.parentNode) {
                    if (hasClass(el.parentNode, this.options.getParentByClass)) {
                        this.elementParent = el.parentNode;
                        break;
                    } else {
                        el = el.parentNode;
                    }
                }
            }
        },
        attachEvents: function () {
            this.element.onfocus = bindScope(this.focusHandler, this);
            this.element.onblur = bindScope(this.blurHandler, this);
            if (this.options.showUntilTyping) {
                this.element.onkeydown = bindScope(this.typingHandler, this);
                this.element.onpaste = bindScope(this.typingHandler, this);
            }
            if (this.wrapWithElement) this.fakeElement.onclick = bindScope(this.focusSetter, this);
        },
        togglePlaceholderText: function (state) {
            if (!this.element.readOnly && !this.options.focusOnly) {
                if (this.wrapWithElement) {
                    this.fakeElement.style.display = state ? '' : 'none';
                } else {
                    this.element.value = state ? this.origValue : '';
                }
            }
        },
        focusSetter: function () {
            this.element.focus();
        },
        focusHandler: function () {
            clearInterval(this.checkerInterval);
            this.checkerInterval = setInterval(bindScope(this.intervalHandler, this), 1);
            this.focused = true;
            if (!this.element.value.length || this.element.value === this.origValue) {
                if (!this.options.showUntilTyping) {
                    this.togglePlaceholderText(false);
                }
            }
            this.refreshClasses();
        },
        blurHandler: function () {
            clearInterval(this.checkerInterval);
            this.focused = false;
            if (!this.element.value.length || this.element.value === this.origValue) {
                this.togglePlaceholderText(true);
            }
            this.refreshClasses();
            PlaceholderInput.refreshAllInputs(this);
        },
        typingHandler: function () {
            setTimeout(bindScope(function () {
                if (this.element.value.length) {
                    this.togglePlaceholderText(false);
                    this.refreshClasses();
                }
            }, this), 10);
        },
        intervalHandler: function () {
            if (typeof this.tmpValue === 'undefined') {
                this.tmpValue = this.element.value;
            }
            if (this.tmpValue != this.element.value) {
                PlaceholderInput.refreshAllInputs(this);
            }
        },
        refreshState: function () {
            if (this.wrapWithElement) {
                if (this.element.value.length && this.element.value !== this.origValue) {
                    this.togglePlaceholderText(false);
                } else if (!this.element.value.length) {
                    this.togglePlaceholderText(true);
                }
            }
            this.refreshClasses();
        },
        refreshClasses: function () {
            this.textActive = this.focused || (this.element.value.length && this.element.value !== this.origValue);
            this.setStateClass(this.element, this.options.inputFocusClass, this.focused);
            this.setStateClass(this.elementParent, this.options.parentFocusClass, this.focused);
            this.setStateClass(this.labelFor, this.options.labelFocusClass, this.focused);
            this.setStateClass(this.element, this.options.inputActiveClass, this.textActive);
            this.setStateClass(this.elementParent, this.options.parentActiveClass, this.textActive);
            this.setStateClass(this.labelFor, this.options.labelActiveClass, this.textActive);
        },
        setStateClass: function (el, cls, state) {
            if (!el) return; else if (state) addClass(el, cls); else removeClass(el, cls);
        }
    };

    // utility functions
    function convertToArray(collection) {
        var arr = [];
        for (var i = 0, ref = arr.length = collection.length; i < ref; i++) {
            arr[i] = collection[i];
        }
        return arr;
    }
    function getInputType(input) {
        return (input.type ? input.type : input.tagName).toLowerCase();
    }
    function hasClass(el, cls) {
        return el.className ? el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
    }
    function addClass(el, cls) {
        if (!hasClass(el, cls)) el.className += " " + cls;
    }
    function removeClass(el, cls) {
        if (hasClass(el, cls)) { el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' '); }
    }
    function bindScope(f, scope) {
        return function () { return f.apply(scope, arguments); };
    }
    function getStyle(el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    }
}());


// page init
function AngularCalling() {
    jcf.customForms.replaceAll();
    initAccordion();
    initInputs();
    initSameHeight();
    initNavigation();
};
// calendar Scroll
function getTargetTop(elemId) {
    var id = $('#CalendarContainer #' + elemId);
    var offset = $('#tabContainer').outerHeight(true) + calendarpaddingTop - $('#CalendarContainer').scrollTop() ;
    return $(id).offset().top - offset;
}
function navScroll(navId) {
    if (angular.isUndefined(navId)) return;
    $('#CalendarContainer').animate({  scrollTop: getTargetTop(navId) }, 300);
}
function SetActiveCalenderOnScroll() {
    $('#CalendarContainer').on('scroll', function () {
        var threshold = $('#CalendarContainer .title').height();
        var scrolledTo = $('#CalendarContainer').scrollTop();
        $('.meetingtime-section').each(function (i, slider) {
            var target = getTargetTop($(slider).attr('id'));
            if (scrolledTo > target - threshold) {
                $('.date-tab li').removeClass('active');
                $('.date-tab li#' + $(slider).attr('id')).addClass('active');
            }
        });
    });
}
function SetActiveCalender() {
    calendarpaddingTop = parseInt($('#CalendarContainer').parent().css('padding-top'),10);
    $('.date-tab').on('click', function (e) {
        e = e || window.event;
         $('#CalendarContainer').stop();
        navScroll($(e.target).closest('li').attr('id'));
    });
    SetActiveCalenderOnScroll();
}
