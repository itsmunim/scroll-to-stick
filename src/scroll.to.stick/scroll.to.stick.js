import { SCROLL_DIRECTIONS, ScrollHelper } from '../utils/scroll.helper';

const defaultStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  transition: 'top 100ms ease-in'
};

/* eslint-disable no-param-reassign */
function onScrollChange(elem, offset) {
  return (scrollInfo) => {
    const { direction, lastKnownDirection } = scrollInfo;
    if (direction !== lastKnownDirection) {
      elem.style.top = direction === SCROLL_DIRECTIONS.DOWN ? `-${offset}px` : 0;
    }
  };
}
/* eslint-enable no-param-reassign */

export default function applyScrollToStick(elem, offset) {
  let applyOn = elem;
  if (typeof elem === 'string') {
    applyOn = document.getElementById(elem);
  }

  Object.assign(elem.style, defaultStyle);

  const scrollHelper = new ScrollHelper(document);
  scrollHelper.attachHook(onScrollChange(applyOn, offset));

  return () => {
    scrollHelper.decommission();
  };
}

