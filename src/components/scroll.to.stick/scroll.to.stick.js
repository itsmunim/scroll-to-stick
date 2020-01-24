import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { SCROLL_DIRECTIONS, ScrollHelper } from '../../utils/scroll.helper/scroll.helper';

function ScrollToStick({ applyOn, offset, children }) {
  const style = {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    transition: 'top 100ms ease-in',
  };

  const scrollHelper = new ScrollHelper();

  /* eslint-disable no-param-reassign */
  const onScrollChange = (elem) => {
    return (scrollInfo) => {
      const { direction, lastKnownDirection } = scrollInfo;
      if (direction !== lastKnownDirection) {
        elem.style.top = direction === SCROLL_DIRECTIONS.DOWN ? `-${offset}px` : 0;
      }
    };
  };
  /* eslint-enable no-param-reassign */

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

ScrollToStick.propTypes = {
  applyOn: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default ScrollToStick;
