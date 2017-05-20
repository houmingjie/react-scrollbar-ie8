import React, { Component, PropTypes } from 'react';
import css from 'dom-css';
import './scrollbar.css';
import { getInnerHeight, getInnerWidth, addListener, removeListener } from './util';
// import {
//     // containerStyleDefault,
//     // containerStyleAutoHeight,
//     // viewStyleAutoHeight,
//     // viewStyleUniversalInitial,
//     // viewStyleDefault,
//     // trackHorizontalStyleDefault,
//     // trackVerticalStyleDefault,
//     // thumbHorizontalStyleDefault,
//     // thumbVerticalStyleDefault,
//     disableSelectStyle,
//     disableSelectStyleReset
// } from './defaultStyle';

const disableSelectStyle = {
    userSelect: 'none'
};

const disableSelectStyleReset = {
    userSelect: ''
};

const containerStyleAutoHeight = {
    height: 'auto'
};

const viewStyleAutoHeight = {
    position: 'relative',
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined
};

function returnFalse() {
    return false;
}

function getScrollbarSize() {
    const outer = document.createElement('div');
    document.body.appendChild(outer);
    const outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.width = '100px';
    outerStyle.height = '100px';
    outerStyle.overflow = 'scroll';
    outerStyle.top = '-99999px';
    const scrollbarWidth = outer.offsetWidth - outer.clientWidth;
    const scrollbarHeight = outer.offsetHeight - outer.clientHeight;
    document.body.removeChild(outer);
    return { scrollbarWidth, scrollbarHeight };
}

const { scrollbarWidth: systemScrollBarWidth, scrollbarHeight: systemScrollBarHeight } = getScrollbarSize();

const rAF = window.requestAnimationFrame;
const cAF = window.cancelAnimationFrame;

const _elementStyle = document.createElement('div').style;
const _vendor = (function () {
    let i;
    let transform;
    let vendor;
    const vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
    let _i;
    let _len;
    for (i = _i = 0, _len = vendors.length; _i < _len; i = ++_i) {
        vendor = vendors[i];
        transform = `${vendor}ransform`;
        if (transform in _elementStyle) {
            return vendor.substr(0, vendor.length - 1);
        }
    }
    return false;
}());

function _prefixStyle(style) {
    if (_vendor === false) {
        return false;
    }
    if (_vendor === '') {
        return style;
    }
    return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

const transform = _prefixStyle('transform');
const hasTransform = transform !== false;

export default class Scrollbar extends Component {
    constructor(props) {
        super(props);
        [
            'handleScroll',
            'handleViewMouseEnter',
            'handleViewMouseLeave',
            'handleTrackMouseEnter',
            'handleTrackMouseLeave',
            'handleHorizontalTrackMouseDown',
            'handleVerticalTrackMouseDown',
            'handleHorizontalThumbMouseDown',
            'handleVerticalThumbMouseDown',
            'handleWindowResize',
            'handleDrag',
            'handleDragEnd',
        ].forEach(function (element) {
            if (this[element]) {
                this[element] = this[element].bind(this);
            }
        }, this);
    }

    componentDidMount() {
        this.addEventListener();
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        this.requestFrame && cAF && cAF(this.requestFrame);
        this.removeEventListener();
        clearTimeout(this.hideTracksTimeout);
        clearInterval(this.detectScrollingInterval);
    }

    getContainer() {
        const { container } = this.refs;
        return container;
    }

    getThumbHorizontalWidth() {
        const { thumbSize, thumbMinSize } = this.props;
        const { view, trackHorizontal } = this.refs;
        const { scrollWidth, clientWidth } = view;
        const trackWidth = getInnerWidth(trackHorizontal);
        const width = Math.ceil(clientWidth / scrollWidth * trackWidth);
        if (trackWidth === width) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(width, thumbMinSize);
    }

    getThumbVerticalHeight() {
        const { thumbSize, thumbMinSize } = this.props;
        const { view, trackVertical } = this.refs;
        const { scrollHeight, clientHeight } = view;
        const trackHeight = getInnerHeight(trackVertical);
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight) || 0;
        if (trackHeight === height) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(height, thumbMinSize);
    }

    getViewValue() {
        const { view } = this.refs;
        const {
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight
            } = view;

        return {
            left: (scrollLeft / (scrollWidth - clientWidth)) || 0,
            top: (scrollTop / (scrollHeight - clientHeight)) || 0,
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight
        };
    }

    getScrollLeftForOffset(offset) {
        const { view, trackHorizontal } = this.refs;
        const { scrollWidth, clientWidth } = view;
        const trackWidth = getInnerWidth(trackHorizontal);
        const thumbWidth = this.getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    }

    getScrollTopForOffset(offset) {
        const { view, trackVertical } = this.refs;
        const { scrollHeight, clientHeight } = view;
        const trackHeight = getInnerHeight(trackVertical);
        const thumbHeight = this.getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    }

    getScrollLeft() {
        const { view } = this.refs;
        return view.scrollLeft;
    }

    getScrollTop() {
        const { view } = this.refs;
        return view.scrollTop;
    }

    getScrollWidth() {
        const { view } = this.refs;
        return view.scrollWidth;
    }

    getScrollHeight() {
        const { view } = this.refs;
        return view.scrollHeight;
    }

    getClientWidth() {
        const { view } = this.refs;
        return view.clientWidth;
    }

    getClientHeight() {
        const { view } = this.refs;
        return view.clientHeight;
    }

    scrollLeft(left = 0) {
        const { view } = this.refs;
        view.scrollLeft = left;
    }

    scrollTop(top = 0) {
        const { view } = this.refs;
        view.scrollTop = top;
    }

    scrollToLeft() {
        const { view } = this.refs;
        view.scrollLeft = 0;
    }

    scrollToTop() {
        const { view } = this.refs;
        view.scrollTop = 0;
    }

    scrollToRight() {
        const { view } = this.refs;
        view.scrollLeft = view.scrollWidth;
    }

    scrollToBottom() {
        const { view } = this.refs;
        view.scrollTop = view.scrollHeight;
    }

    addEventListener() {
        const { view, trackHorizontal, trackVertical, thumbHorizontal, thumbVertical } = this.refs;
        addListener(view, 'scroll', this.handleScroll);
        addListener(view, 'mouseenter', this.handleViewMouseEnter);
        addListener(view, 'mouseleave', this.handleViewMouseLeave);

        addListener(trackHorizontal, 'mouseenter', this.handleTrackMouseEnter);
        addListener(trackHorizontal, 'mouseleave', this.handleTrackMouseLeave);
        addListener(trackHorizontal, 'mousedown', this.handleHorizontalTrackMouseDown);

        addListener(trackVertical, 'mouseenter', this.handleTrackMouseEnter);
        addListener(trackVertical, 'mouseleave', this.handleTrackMouseLeave);
        addListener(trackVertical, 'mousedown', this.handleVerticalTrackMouseDown);

        addListener(thumbHorizontal, 'mousedown', this.handleHorizontalThumbMouseDown);
        addListener(thumbVertical, 'mousedown', this.handleVerticalThumbMouseDown);

        addListener(window, 'resize', this.handleWindowResize);
    }

    removeEventListener() {
        const { view, trackHorizontal, trackVertical, thumbHorizontal } = this.refs;
        removeListener(view, 'scroll', this.handleScroll);

        removeListener(trackHorizontal, 'mouseenter', this.handleTrackMouseEnter);
        removeListener(trackHorizontal, 'mouseleave', this.handleTrackMouseLeave);
        removeListener(trackHorizontal, 'mousedown', this.handleHorizontalTrackMouseDown);

        removeListener(trackVertical, 'mouseenter', this.handleTrackMouseEnter);
        removeListener(trackVertical, 'mouseleave', this.handleTrackMouseLeave);
        removeListener(trackVertical, 'mousedown', this.handleVerticalTrackMouseDown);

        removeListener(thumbHorizontal, 'mousedown', this.handleHorizontalThumbMouseDown);
        removeListener(thumbHorizontal, 'mousedown', this.handleVerticalThumbMouseDown);

        removeListener(window, 'resize', this.handleWindowResize);

        this.teardownDragging();
    }

    handleScroll(event) {
        const { onScroll, onScrollFrame } = this.props;
        if (onScroll) onScroll(event);
        this.update((values) => {
            const { scrollLeft, scrollTop } = values;
            this.viewScrollLeft = scrollLeft;
            this.viewScrollTop = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        this.detectScrolling();
    }

    handleViewMouseEnter() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.showTracks();
    }

    handleViewMouseLeave() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleScrollStart() {
        const { onScrollStart } = this.props;
        if (onScrollStart) onScrollStart();
        this.handleScrollStartAutoHide();
    }

    handleScrollStartAutoHide() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.showTracks();
    }

    handleScrollStop() {
        const { onScrollStop } = this.props;
        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    }

    handleScrollStopAutoHide() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleWindowResize() {
        clearTimeout(this.resizeTimerKey);
        this.resizeTimerKey = setTimeout(() => {
            this.update();
        }, 100);
    }

    handleHorizontalTrackMouseDown(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        const { view, trackHorizontal } = this.refs;
        const { clientX } = event;
        const { left: targetLeft } = trackHorizontal.getBoundingClientRect();
        const thumbWidth = this.getThumbHorizontalWidth();
        const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
        view.scrollLeft = this.getScrollLeftForOffset(offset);
    }

    handleVerticalTrackMouseDown(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        const { view, trackVertical } = this.refs;
        const { clientY } = event;
        const { top: targetTop } = trackVertical.getBoundingClientRect();
        const thumbHeight = this.getThumbVerticalHeight();
        const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
        view.scrollTop = this.getScrollTopForOffset(offset);
    }

    handleHorizontalThumbMouseDown(event) {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.returnValue = false;
            event.cancelBabble = true;
        }
        this.handleDragStart(event);
        const { clientX } = event;
        const { thumbHorizontal } = this.refs;
        const { offsetWidth } = thumbHorizontal;
        const { left } = thumbHorizontal.getBoundingClientRect();
        this.prevPageX = offsetWidth - (clientX - left);
        return false;
    }

    handleVerticalThumbMouseDown(event) {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.returnValue = false;
            event.cancelBabble = true;
        }
        this.handleDragStart(event);
        const { clientY } = event;
        const { thumbVertical } = this.refs;
        const { offsetHeight } = thumbVertical;
        const { top } = thumbVertical.getBoundingClientRect();
        this.prevPageY = offsetHeight - (clientY - top);
        return false;
    }

    setupDragging() {
        css(document.body, disableSelectStyle);
        addListener(document, 'mousemove', this.handleDrag);
        addListener(document, 'mouseup', this.handleDragEnd);
        try {
            document.onselectstart = returnFalse;
        } catch (e) {

        }
    }

    teardownDragging() {
        css(document.body, disableSelectStyleReset);
        removeListener(document, 'mousemove', this.handleDrag);
        removeListener(document, 'mouseup', this.handleDragEnd);
        try {
            document.onselectstart = undefined;
        } catch (e) {

        }
    }

    handleDragStart(event) {
        this.dragging = true;
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        } else {
            event.returnValue = false;
        }

        this.setupDragging();
        return false;
    }

    handleDrag(event) {
        if (this.prevPageX) {
            const { clientX } = event;
            const { view, trackHorizontal } = this.refs;
            const { left: trackLeft } = trackHorizontal.getBoundingClientRect();
            const thumbWidth = this.getThumbHorizontalWidth();
            const clickPosition = thumbWidth - this.prevPageX;
            const offset = -trackLeft + clientX - clickPosition;
            view.scrollLeft = this.getScrollLeftForOffset(offset);
        }
        if (this.prevPageY) {
            const { clientY } = event;
            const { view, trackVertical } = this.refs;
            const { top: trackTop } = trackVertical.getBoundingClientRect();
            const thumbHeight = this.getThumbVerticalHeight();
            const clickPosition = thumbHeight - this.prevPageY;
            const offset = -trackTop + clientY - clickPosition;
            view.scrollTop = this.getScrollTopForOffset(offset);
        }
        return false;
    }

    handleDragEnd() {
        this.dragging = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        this.handleDragEndAutoHide();
    }

    handleDragEndAutoHide() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleTrackMouseEnter() {
        this.trackMouseOver = true;
        this.handleTrackMouseEnterAutoHide();
    }

    handleTrackMouseEnterAutoHide() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.showTracks();
    }

    handleTrackMouseLeave() {
        this.trackMouseOver = false;
        this.handleTrackMouseLeaveAutoHide();
    }

    handleTrackMouseLeaveAutoHide() {
        const { autoHide } = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    showTracks() {
        const { trackHorizontal, trackVertical } = this.refs;
        clearTimeout(this.hideTracksTimeout);
        css(trackHorizontal, { opacity: 1 });
        css(trackVertical, { opacity: 1 });
    }

    hideTracks() {
        if (this.dragging) return;
        if (this.scrolling) return;
        if (this.trackMouseOver) return;
        const { autoHideTimeout } = this.props;
        const { trackHorizontal, trackVertical } = this.refs;
        clearTimeout(this.hideTracksTimeout);
        this.hideTracksTimeout = setTimeout(() => {
            css(trackHorizontal, { opacity: 0 });
            css(trackVertical, { opacity: 0 });
        }, autoHideTimeout);
    }

    detectScrolling() {
        if (this.scrolling) return;
        this.scrolling = true;
        this.handleScrollStart();
        this.detectScrollingInterval = setInterval(() => {
            if (this.lastViewScrollLeft === this.viewScrollLeft
                && this.lastViewScrollTop === this.viewScrollTop) {
                clearInterval(this.detectScrollingInterval);
                this.scrolling = false;
                this.handleScrollStop();
            }
            this.lastViewScrollLeft = this.viewScrollLeft;
            this.lastViewScrollTop = this.viewScrollTop;
        }, 100);
    }

    update(callback) {
        if (rAF) {
            if (this.requestFrame && cAF) {
                cAF(this.requestFrame);
            }
            this.requestFrame = rAF(() => {
                this.requestFrame = undefined;
                this._update(callback);
            });
        } else {
            this._update(callback);
        }
    }

    _update(callback) {
        const { onUpdate, hideTracksWhenNotNeeded } = this.props;
        const values = this.getViewValue();
        const { thumbHorizontal, thumbVertical, trackHorizontal, trackVertical } = this.refs;
        const { scrollLeft, clientWidth, scrollWidth } = values;
        const trackHorizontalWidth = getInnerWidth(trackHorizontal);
        const thumbHorizontalWidth = this.getThumbHorizontalWidth();
        const thumbHorizontalX = (scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth)) || 0;
        const thumbHorizontalStyle = {
            width: thumbHorizontalWidth,
        };

        if (hasTransform) {
            thumbHorizontalStyle[transform] = `translateX(${thumbHorizontalX}px)`;
        } else {
            thumbHorizontalStyle.left = thumbHorizontalX;
        }

        const { scrollTop, clientHeight, scrollHeight } = values;
        const trackVerticalHeight = getInnerHeight(trackVertical);
        const thumbVerticalHeight = this.getThumbVerticalHeight();
        const thumbVerticalY = (scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight)) || 0;
        const thumbVerticalStyle = {
            height: thumbVerticalHeight,
        };

        if (hasTransform) {
            thumbVerticalStyle[transform] = `translateY(${thumbVerticalY}px)`;
        } else {
            thumbVerticalStyle.top = thumbVerticalY;
        }

        if (hideTracksWhenNotNeeded) {
            const trackHorizontalStyle = {
                visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
            };
            const trackVerticalStyle = {
                visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
            };

            css(trackHorizontal, trackHorizontalStyle);
            css(trackVertical, trackVerticalStyle);
        }
        css(thumbHorizontal, thumbHorizontalStyle);
        css(thumbVertical, thumbVerticalStyle);

        if (onUpdate) onUpdate(values);
        if (typeof callback !== 'function') return;
        callback(values);
    }

    render() {
        const {
            autoHide,
            autoHideDuration,
            className,
            onWheel,
            style,
            trackStyle,
            thumbStyle,
            tagName,
            autoHeight,
            autoHeightMin,
            autoHeightMax,
            children
        } = this.props;

        let containerStyle = {
            ...(autoHeight && {
                ...containerStyleAutoHeight,
                minHeight: autoHeightMin,
                maxHeight: autoHeightMax
            }),
            ...style
        }

        let viewStyle = {};
        let trackHorizontalStyle = {...trackStyle};
        let thumbHorizontalStyle = {...thumbStyle};
        let trackVerticalStyle = {...trackStyle};
        let thumbVerticalStyle = {...thumbStyle};

        viewStyle = {
            marginRight: -systemScrollBarWidth || 0,
            marginBottom: -systemScrollBarHeight || 0,
            ...(autoHeight && {
                ...viewStyleAutoHeight,
                // Add scrollbarWidth to autoHeight in order to compensate negative margins
                minHeight: isString(autoHeightMin)
                    ? `calc(${autoHeightMin} + ${systemScrollBarWidth}px)`
                    : autoHeightMin + systemScrollBarWidth,
                maxHeight: isString(autoHeightMax)
                    ? `calc(${autoHeightMax} + ${systemScrollBarHeight}px)`
                    : autoHeightMax + systemScrollBarHeight
            }),
        };

        if (autoHide) {
            const trackAutoHideStyle = {
                transition: `opacity ${autoHideDuration}ms`,
                opacity: 0
            };
            trackVerticalStyle = {
                ...trackVerticalStyle,
                ...trackAutoHideStyle
            }
            trackHorizontalStyle = {
                ...trackHorizontalStyle,
                ...trackAutoHideStyle
            };
        }

        const Tag = tagName;

        return (
            <Tag
                className={`scrollbar-container  ${className || ''}`}
                ref="container"
                onWheel={onWheel || null}
                style={containerStyle}>
                <div
                     className="scrollbar-view"
                     ref="view"
                     style={viewStyle}
                    >
                    {children}
                </div>
                <div
                    className="scrollbar-track scrollbar-track-horizontal"
                    style={trackHorizontalStyle}
                    ref="trackHorizontal">
                    <div
                        className="scrollbar-thumb scrollbar-thumb-horizontal"
                        style={thumbHorizontalStyle}
                        ref="thumbHorizontal">
                    </div>
                </div>
                <div
                    className="scrollbar-track scrollbar-track-vertical"
                    style={trackVerticalStyle}
                    ref="trackVertical">
                    <div
                        className="scrollbar-thumb scrollbar-thumb-vertical"
                        style={thumbVerticalStyle}
                        ref="thumbVertical">
                    </div>
                </div>
            </Tag>
        );
    }
}

Scrollbar.propTypes = {
    onScroll: PropTypes.func,
    onScrollFrame: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScrollStop: PropTypes.func,
    onUpdate: PropTypes.func,
    onWheel: PropTypes.func,
    tagName: PropTypes.string,
    thumbSize: PropTypes.number,
    thumbMinSize: PropTypes.number,
    hideTracksWhenNotNeeded: PropTypes.bool,
    autoHide: PropTypes.bool,
    autoHideTimeout: PropTypes.number,
    autoHideDuration: PropTypes.number,
    autoHeight: PropTypes.bool,
    autoHeightMin: PropTypes.oneOfType([
       PropTypes.number,
       PropTypes.string
    ]),
    autoHeightMax: PropTypes.oneOfType([
       PropTypes.number,
       PropTypes.string
    ]),
    children: PropTypes.node,
    style: PropTypes.object,
    trackStyle: PropTypes.object,
    thumbStyle: PropTypes.object,
    className: PropTypes.string,
};

Scrollbar.defaultProps = {
    tagName: 'div',
    thumbMinSize: 30,
    hideTracksWhenNotNeeded: true,
    autoHide: false,
    autoHideTimeout: 1000,
    autoHideDuration: 200,
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 200,
    universal: false,
    style: null,
};
