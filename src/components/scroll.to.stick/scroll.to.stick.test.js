import { mount } from 'enzyme';
import React from 'react';
import ScrollToStick from './scroll.to.stick';

jest.useFakeTimers();

describe('ScrollToStick', () => {
  let wrapper;

  const render = () => {
    const ref = React.createRef();
    const container = document.getElementById('container');
    const template = (
      <ScrollToStick applyOn={ref} offset={60}>
        <div id="elem-apply-on" style={{ height: '60px' }} ref={ref} />
      </ScrollToStick>
    );

    return mount(template, { attachTo: container });
  };

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

    wrapper = render();
  });

  afterAll(() => {
    const div = document.getElementById('container');
    if (div) {
      document.body.removeChild(div);
    }
  });

  it('should move the element upwards by offset amount when downwards scroll happen', () => {
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    const applyOnElem = wrapper.find('#elem-apply-on').get(0).ref.current;
    jest.runAllTimers();
    expect(applyOnElem.style.top).toEqual('-60px');
  });

  it('should move the element to normal position when upwards scroll happen', () => {
    document.documentElement.scrollTop = 100;
    document.dispatchEvent(new CustomEvent('scroll'));
    // this ensures scroll helper gets the delta and can detect
    // that this is an upward scroll
    document.documentElement.scrollTop = 50;
    document.dispatchEvent(new CustomEvent('scroll'));

    const applyOnElem = wrapper.find('#elem-apply-on').get(0).ref.current;
    jest.runAllTimers();

    expect(applyOnElem.style.top).toEqual('0px');
  });
});
