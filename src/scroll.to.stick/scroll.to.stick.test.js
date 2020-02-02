import applyScrollToStick from './scroll.to.stick';

describe('scroll to stick', () => {
  let offset, applyOnElem;

  beforeAll(() => {
    Object.defineProperty(document.documentElement, 'clientHeight', {
      get: () => '300px',
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      get: () => '800px',
    });
  });

  beforeEach(() => {
    // container
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    container.style.height = '500px';
    container.style.overflowY = 'scroll';

    // header
    const header = document.createElement('header');
    header.style.height = '40px';

    // nav
    const nav = document.createElement('div');
    nav.style.height = '30px';

    // top wrapper: header + nav
    const topWrapper = document.createElement('div');
    topWrapper.setAttribute('id', 'top-wrapper');
    topWrapper.style.height = '70px';

    topWrapper.appendChild(header);
    topWrapper.appendChild(nav);

    container.appendChild(topWrapper);
    document.body.appendChild(container);

    applyOnElem = document.getElementById('top-wrapper');
    offset = 40; // height of header element

    // reset document element scroll top
    document.documentElement.scrollTop = 0;
  });

  afterEach(() => {
    const container = document.getElementById('container');
    if (container) {
      document.body.removeChild(container);
    }
  });

  it('should move the element upwards by offset amount when downwards scroll happen', () => {
    applyScrollToStick(applyOnElem, offset);
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    expect(applyOnElem.style.top).toBe(`-${offset}px`);
  });

  it('should move the element to normal position when upwards scroll happen', () => {
    applyScrollToStick(applyOnElem, offset);
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    // this ensures scroll helper gets the delta and can detect
    // that this is an upward scroll
    document.documentElement.scrollTop = 50;
    document.dispatchEvent(new CustomEvent('scroll'));

    expect(applyOnElem.style.top).toBe('0px');
  });

  it('should not change the element position if the consecutive scrolls are on same direction', () => {
    applyScrollToStick(applyOnElem, offset);
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    expect(applyOnElem.style.top).toBe(`-${offset}px`);

    document.documentElement.scrollTop = 150;
    document.dispatchEvent(new CustomEvent('scroll'));
    expect(applyOnElem.style.top).toBe(`-${offset}px`);
  });

  it('should apply changes only if the scroll amount is more than threshold', () => {
    const threshold = 50;

    applyScrollToStick(applyOnElem, offset, { threshold });

    const elemTop = applyOnElem.style.top;
    let scrollTop = document.documentElement.scrollTop;

    document.documentElement.scrollTop = scrollTop + 20;
    document.dispatchEvent(new CustomEvent('scroll'));
    // should remain with whatever elem top was
    expect(applyOnElem.style.top).toBe(elemTop);

    // get the changed scroll top
    scrollTop = document.documentElement.scrollTop;

    // try with more than threshold amount
    document.documentElement.scrollTop = scrollTop + 51;
    document.dispatchEvent(new CustomEvent('scroll'));
    // should not be equal to previous elem top anymore
    expect(applyOnElem.style.top).not.toBe(elemTop);
  });

  it('should fire event with proper status', () => {
    let expectedStatus;
    const listener = ({ status }) => {
      expect(status).toBe(expectedStatus);
    };

    applyScrollToStick(applyOnElem, offset, { listener });

    expectedStatus = 'stuck-top';
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));

    expectedStatus = 'normal';
    document.documentElement.scrollTop = 55;
    document.dispatchEvent(new CustomEvent('scroll'));
  });
});
