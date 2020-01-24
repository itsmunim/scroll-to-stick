import React, { useEffect } from 'react';
import ScrollHelper from './scroll.helper';

import { SCROLL_DIRECTIONS, ScrollHelper } from './scroll.helper';

function ScrollToStick({ applyOn, offset, children }) {
  const style = {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    transition: 'top 100ms ease-in',
  };

  const scrollHelper = new ScrollHelper();

  const onScrollChange = (elem) => {
    return (scrollInfo) => {
      const { direction, lastKnownDirection } = scrollInfo;
      if (direction !== lastKnownDirection) {
        elem.style.top = direction === 'down' ? `-${offset}px` : 0;
      }
    };
  };

  useEffect(() => {
    const applyOnElem = applyOn.current;
    Object.assign(applyOnElem.style, style);

    scrollHelper.attachHook(onScrollChange(applyOnElem));

    return () => {
      scrollHelper.decommission();
    };
  });

  return <>{children}</>;
}

export default ScrollToStick;
