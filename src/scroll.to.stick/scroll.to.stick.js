import { SCROLL_DIRECTIONS, ScrollHelper } from '../utils/scroll.helper';

const defaultStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 999,
  transition: 'top 100ms ease-in'
};

/* eslint-disable no-param-reassign */
function onScrollChange(elem, offset, listener) {
  return (scrollInfo) => {
    const { direction, lastKnownDirection } = scrollInfo;
    listener = listener || (() => { });

    if (direction !== lastKnownDirection) {
      if (direction === SCROLL_DIRECTIONS.DOWN) {
        elem.style.top = `-${offset}px`;
        listener({ status: 'stuck-top' });
      } else {
        elem.style.top = 0;
        listener({ status: 'normal' });
      }
    }
  };
}
/* eslint-enable no-param-reassign */

export default function applyScrollToStick(elem, offset, config) {
  const { listener, threshold } = config || {};

  let applyOn = elem;
  if (typeof elem === 'string') {
    applyOn = document.getElementById(elem);
  }

  Object.assign(applyOn.style, defaultStyle);

  const scrollHelper = new ScrollHelper(document);
  if (threshold && typeof threshold === 'number') {
    scrollHelper.setThreshold(Math.ceil(threshold));
  }

  scrollHelper.attachHook(onScrollChange(applyOn, offset, listener));

  return () => {
    scrollHelper.decommission();
  };
}

