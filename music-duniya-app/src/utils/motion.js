export const pageTransition = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export const dockAnimation = {
  initial: { y: 80, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: 'spring', damping: 25, stiffness: 180 },
};

export const playerAnimation = {
  layoutId: "player-container",
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { type: 'spring', damping: 30, stiffness: 200 },
};

export const universeModeAnimation = {
  initial: { opacity: 0, scale: 0.8, borderRadius: '100px' },
  animate: { opacity: 1, scale: 1, borderRadius: '24px' },
  exit: { opacity: 0, scale: 0.8, borderRadius: '100px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};
