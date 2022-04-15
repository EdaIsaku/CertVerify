const row = document.querySelector('.rowSvg');
const zero = document.querySelector('.zero');

//eslint-disable-next-line
anime({
  targets: row,
  translateY: 10,
  autoplay: true,
  loop: true,
  easing: 'easeInOutSine',
  direction: 'alternate',
});

//eslint-disable-next-line
anime({
  targets: zero,
  translateX: 10,
  autoplay: true,
  loop: true,
  easing: 'easeInOutSine',
  direction: 'alternate',
  scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
  rotateY: { value: '+=180', delay: 200 },
});
