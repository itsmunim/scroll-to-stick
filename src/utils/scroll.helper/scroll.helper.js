import debounce from 'lodash/debounce';

const SCROLL_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
};

function ScrollHelper(document) {
  this.lastScrollAmount = 0;
  this.threshold = 5;
  this.scrollable = document.documentElement;

  const getScrollBoundary = () => {
    const { clientHeight, scrollHeight } = this.scrollable;
    return {
      min: 0,
      max: scrollHeight - clientHeight,
    };
  };

  const getBoundedScrollAmount = () => {
    const boundary = getScrollBoundary();
    let { scrollTop } = this.scrollable;
    scrollTop = scrollTop < boundary.min ? boundary.min : scrollTop;
    return scrollTop > boundary.max ? boundary.max : scrollTop;
  };

  const onScroll = () => {
    const scrollAmount = getBoundedScrollAmount();
    const delta = Math.abs(scrollAmount - this.lastScrollAmount);
    let direction;

    if (delta > this.threshold) {
      direction = scrollAmount > this.lastScrollAmount ? SCROLL_DIRECTIONS.DOWN : SCROLL_DIRECTIONS.UP;
      if (this.onScrollChange) {
        this.onScrollChange({ delta, direction, lastKnownDirection: this.lastKnownDirection });
      }
    }

    this.lastScrollAmount = scrollAmount;
    this.lastKnownDirection = direction;
  };

  const onScrollHandler = debounce(onScroll, 10);
  document.addEventListener('scroll', onScrollHandler);

  /**
   * Attaches a hook where the scroll helper will
   * send scroll information with format-
   * { delta, direction, lastKnownDirection }
   */
  this.attachHook = (callable) => {
    this.onScrollChange = callable;
  };

  /**
   * Detaches from scroll event listening and hence
   * decommissions this helper
   */
  this.decommission = () => {
    document.removeEventListener('scroll', onScrollHandler);
  };

  /**
   * Set a threshold to define how much delta should occur
   * before the attached hook will be called with scroll info
   */
  this.setThreshold = (threshold) => {
    this.threshold = threshold;
  };
}

export { SCROLL_DIRECTIONS, ScrollHelper };
