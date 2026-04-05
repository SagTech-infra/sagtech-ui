'use client';

const scrollToAnchor = (locationHash: string) => {
  const scrollToContainer = document.getElementById(locationHash);

  if (scrollToContainer) {
    scrollToContainer.scrollIntoView({
      behavior: 'smooth',
    });
  }
};

export default scrollToAnchor;
