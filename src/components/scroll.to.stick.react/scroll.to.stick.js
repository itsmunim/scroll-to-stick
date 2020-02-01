import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import applyScrollToStick from '../../scroll.to.stick';

function ScrollToStick({ applyOn, offset, children }) {
  useEffect(() => {
    const applyOnElem = applyOn.current;
    const stopScrollToStick = applyScrollToStick(applyOnElem, offset);
    return stopScrollToStick;
  });

  return <>{children}</>;
}

ScrollToStick.propTypes = {
  applyOn: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  offset: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

export default ScrollToStick;
