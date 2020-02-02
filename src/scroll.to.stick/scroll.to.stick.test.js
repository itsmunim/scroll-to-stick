import applyScrollToStick from './scroll.to.stick';

jest.useFakeTimers();

describe('scroll to stick', () => {
  let listener, offset, applyOnElem;

  beforeAll(() => {
    const div = document.createElement('div');
    div.setAttribute('id', 'container');
    div.style.height = '500px';
    div.style.overflowY = 'scroll';
    document.body.appendChild(div);
    // mock clientHeight & scrollHeight
    Object.defineProperty(document.documentElement, 'clientHeight', {
      get: () => '300px',
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      get: () => '800px',
    });

    const header = document.createElement('header');
    header.style.height = '40px';

    const nav = document.createElement('div');
    nav.style.height = '30px';

    const topWrapper = document.createElement('div');
    topWrapper.setAttribute('id', 'top-wrapper');
    topWrapper.style.height = '70px';

    topWrapper.appendChild(header);
    topWrapper.appendChild(nav);

    div.appendChild(topWrapper);
    document.body.appendChild(div);

    // apply the function
    const headerElem = document.getElementsByTagName('header')[0];
    applyOnElem = document.getElementById('top-wrapper');
    offset = headerElem.offsetHeight;
    applyScrollToStick(topWrapper, offset, listener);
  });

  afterAll(() => {
    const div = document.getElementById('container');
    if (div) {
      document.body.removeChild(div);
    }
  });

  function getApplyOnElem() {
    return document.getElementById('top-wrapper');
  }

  it('should move the element upwards by offset amount when downwards scroll happen', () => {
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    jest.runAllTimers();
    expect(applyOnElem.style.top).toEqual(`-${offset}px`);
  });

  it('should move the element to normal position when upwards scroll happen', () => {
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    // this ensures scroll helper gets the delta and can detect
    // that this is an upward scroll
    document.documentElement.scrollTop = 50;
    document.dispatchEvent(new CustomEvent('scroll'));

    jest.runAllTimers();

    expect(applyOnElem.style.top).toEqual('0px');
  });

  it('should not change the element position if the consecutive scrolls are on same direction', () => {
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    jest.runAllTimers();
    expect(applyOnElem.style.top).toEqual(`-${offset}px`);

    document.documentElement.scrollTop = 150;
    document.dispatchEvent(new CustomEvent('scroll'));
    jest.runAllTimers();
    expect(applyOnElem.style.top).toEqual(`-${offset}px`);
  });

  it('should fire event with proper status', () => {
    let expectedStatus;
    listener = ({ status }) => {
      expect(status).toEqual(expectedStatus);
    };

    expectedStatus = 'stuck-top';
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    jest.runAllTimers();

    expectedStatus = 'normal';
    document.documentElement.scrollTop = 55;
    document.dispatchEvent(new CustomEvent('scroll'));
    jest.runAllTimers();
  });
});
