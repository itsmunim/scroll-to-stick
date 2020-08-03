const header = document.getElementsByClassName('header')[0];
const statusElem = document.getElementById('status-txt');
const listener = ({ status }) => {
  const emoji = status === 'normal' ? '🙄' : '😝';
  statusElem.innerText = `${status.replace(/-/g, ' ').toUpperCase()} ${emoji}`;
};
ScrollToStick.applyScrollToStick('header-wrap', header.offsetHeight, { listener });