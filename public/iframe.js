window.addEventListener('message', function (event) {
  const data = event.data;
  if (data?.type === 'ELEMENTS_READY') {
    initializeMoveable();
  }
});

function initializeMoveable() {
  const container = document.body;
  const targets = document.querySelectorAll('.target');
  let currentTarget = null;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  const moveable = new Moveable(container, {
    target: null,
    draggable: true,
    resizable: true,
    scalable: true,
    rotatable: true,
    origin: true,
    snappable: true,
    snapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
    elementSnapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
    isDisplaySnapDigit: true,
    isDisplayInnerSnapDigit: true,
    snapThreshold: 5,
    snapHorizontalThreshold: 5,
    snapVerticalThreshold: 5,
    elementGuidelines: Array.from(document.querySelectorAll('.target')),
    verticalGuidelines: [0, containerWidth / 2, containerWidth],
    horizontalGuidelines: [0, containerHeight / 2, containerHeight]
  });

  targets.forEach((target) => {
    target.addEventListener('click', function (e) {
      e.stopPropagation();
      currentTarget = target;
      moveable.target = target;
      window.parent.postMessage(
        {
          type: 'SELECT_ELEMENT',
          id: target.id
        },
        '*'
      );
    });
  });

  container.addEventListener('click', function () {
    currentTarget = null;
    moveable.target = null;
  });

  window.addEventListener('message', function (event) {
    const data = event.data;

    if (data && data.type === 'SELECTION_UPDATED') {
      const element = data.element;
      const target = document.getElementById(element.id);

      target.click();

      if (target) {
        target.style.left = element.x + 'px';
        target.style.top = element.y + 'px';

        const moveableBox = document.querySelector('.moveable-control-box');
        if (moveableBox) {
          moveableBox.style.transform = 'translate3d(' + element.x + 'px, ' + element.y + 'px, 0px)';
        }
      }
    }
  });

  moveable
    .on('dragStart', function () {
      window.parent.postMessage({ type: 'DRAG_START' }, '*');
    })
    .on('dragEnd', function () {
      window.parent.postMessage({ type: 'DRAG_END' }, '*');
    })
    .on('drag', function ({ target, left, top }) {
      target.style.left = left + 'px';
      target.style.top = top + 'px';
      window.parent.postMessage(
        {
          type: 'UPDATE_POSITION',
          id: target.id,
          left: Math.round(left),
          top: Math.round(top)
        },
        '*'
      );
    })
    .on('resize', function ({ target, width, height }) {
      target.style.width = width + 'px';
      target.style.height = height + 'px';
      window.parent.postMessage(
        {
          type: 'UPDATE_POSITION',
          id: target.id,
          width: Math.round(width),
          height: Math.round(height)
        },
        '*'
      );
    })
    .on('rotate', function ({ target, transform }) {
      target.style.transform = transform;
      window.parent.postMessage(
        {
          type: 'UPDATE_POSITION',
          id: target.id,
          transform: transform
        },
        '*'
      );
    })
    .on('scale', function ({ target, transform }) {
      target.style.transform = transform;
      window.parent.postMessage(
        {
          type: 'UPDATE_POSITION',
          id: target.id,
          transform: transform
        },
        '*'
      );
    });
}
