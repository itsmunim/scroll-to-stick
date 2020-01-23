import React, { useEffect } from 'react';
import debounce from 'lodash/debounce';

import { SCROLL_DIRECTIONS, ScrollHelper } from './scroll.helper';

function ScrollToStick({ applyOn, offset, children }) {
  const style = {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    transition: 'top 0.3s ease-out',
  };

  const getOnScrollHandler = (container, elem) => {
    let lastScrollAmount = 0,
      lastKnownDirection;
    return () => {
      const scrollAmount = Math.abs(container.scrollY);
      const direction = scrollAmount > lastScrollAmount ? 'down' : 'up';
      lastScrollAmount = scrollAmount;
      if (direction !== lastKnownDirection) {
        elem.style.top = direction === 'down' ? `-${offset}px` : 0;
      }
      lastKnownDirection = direction;
    };
  };

  useEffect(() => {
    const applyOnElem = applyOn.current;
    Object.assign(applyOnElem.style, style);

    const onScroll = getOnScrollHandler(window, applyOnElem);
    window.addEventListener('scroll', debounce(onScroll, 10));

    const cleanUp = () => {
      window.removeEventListener('scroll', onScroll);
    };

    return cleanUp;
  });

  return <>{children}</>;
}

export default ScrollToStick;
