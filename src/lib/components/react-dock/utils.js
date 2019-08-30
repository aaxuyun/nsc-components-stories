import autoprefix from './autoprefix'

const autoprefixes = styles => {
  return Object.keys(styles).reduce(
    (obj, key) => (obj[key] = autoprefix(styles[key]), obj),
    {}
  )
}

export const styles = autoprefixes({
  wrapper: {
    position: 'fixed',
    width: 0,
    height: 0,
    top: 0,
    left: 0
  },

  dim: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    opacity: 1
  },

  dimAppear: {
    opacity: 0
  },

  dimTransparent: {
    pointerEvents: 'none'
  },

  dimHidden: {
    opacity: 0
  },

  dock: {
    position: 'fixed',
    zIndex: 1,
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
    background: 'white',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },

  dockHidden: {
    opacity: 0
  },

  dockResizing: {
    transition: 'none'
  },

  dockContent: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },

  resizer: {
    position: 'absolute',
    zIndex: 2,
    opacity: 0
  }
})

const getTransitions = duration => {
  return ['left', 'top', 'width', 'height']
  .map(p => `${p} ${duration/1000}s ease-out`);
}

export const getDockStyles = (
  { fluid, dockStyle, dockHiddenStyle, duration, position, isVisible },
  { size, isResizing, fullWidth, fullHeight }
) => {
  let posStyle;
  const absSize = fluid ?
    (size * 100) + '%' :
    size + 'px';

  const getRestSize = fullSize => {
    return fluid ?
      (100 - size * 100) + '%' :
      (fullSize - size) + 'px';
  }

  switch(position) {
    case 'left':
      posStyle = {
        width: absSize,
        left: isVisible ? 0 : '-' + absSize
      };
      break;
    case 'right':
      posStyle = {
        left: isVisible ? getRestSize(fullWidth) : fullWidth,
        width: absSize
      };
      break;
    case 'top':
      posStyle = {
        top: isVisible ? 0 : '-' + absSize,
        height: absSize
      };
      break;
    case 'bottom':
      posStyle = {
        top: isVisible ? getRestSize(fullHeight) : fullHeight,
        height: absSize
      };
    break;
  }

  const transitions = getTransitions(duration)

  return [
    styles.dock,
    autoprefix({
      transition: [
        ...transitions,
        !isVisible && `opacity 0.01s linear ${duration/1000}s`
      ].filter(t => t).join(',')
    }),
    dockStyle,
    autoprefix(posStyle),
    isResizing && styles.dockResizing,
    !isVisible && styles.dockHidden,
    !isVisible && dockHiddenStyle,
  ]
}

export const getDimStyles = (
  { dimMode, dimStyle, duration, isVisible },
  { isTransitionStarted }
) => {
  return [
    styles.dim,
    autoprefix({
      transition: `opacity ${duration / 1000}s ease-out`,
    }),
    dimStyle,
    dimMode === 'transparent' && styles.dimTransparent,
    !isVisible && styles.dimHidden,
    isTransitionStarted && isVisible && styles.dimAppear,
    isTransitionStarted && !isVisible && styles.dimDisappear
  ]
}

export const getResizerStyles = position => {
  let resizerStyle;
  const size = 10;

  switch(position) {
    case 'left':
      resizerStyle = {
        right: -size / 2,
        width: size,
        top: 0,
        height: '100%',
        cursor: 'col-resize'
      };
      break;
    case 'right':
      resizerStyle = {
        left: -size / 2,
        width: size,
        top: 0,
        height: '100%',
        cursor: 'col-resize'
      };
      break;
    case 'top':
      resizerStyle = {
        bottom: -size / 2,
        height: size,
        left: 0,
        width: '100%',
        cursor: 'row-resize'
      };
      break;
    case 'bottom':
      resizerStyle = {
        top: -size / 2,
        height: size,
        left: 0,
        width: '100%',
        cursor: 'row-resize'
      };
    break;
  }

  return [
    styles.resizer,
    autoprefix(resizerStyle)
  ]
}

export const getFullSize = (position, fullWidth, fullHeight) => {
  return position === 'left' || position === 'right'
    ? fullWidth
    : fullHeight
}
