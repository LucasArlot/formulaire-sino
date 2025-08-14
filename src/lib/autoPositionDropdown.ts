export const installDropdownAutoPositioning = () => {
  const adjust = () => {
    const DROPDOWN_HEIGHT = 300;
    document.querySelectorAll<HTMLElement>('.port-list.show').forEach(list => {
      list.classList.add('repositioning');
      // Ignore if list is manually hidden or not in DOM
      if (!list.isConnected) return;
      const trigger = list.previousElementSibling as HTMLElement | null;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - rect.bottom - 20; // 20px padding like in CSS
      const spaceAbove = rect.top - 20;
      const spaceRight = viewportWidth - rect.left;
      const spaceLeft = rect.right;

      list.classList.remove('show-above', 'adjust-right', 'adjust-left');

      // Vertical check
      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
        list.classList.add('show-above');
      }

      // Horizontal check (match logic in CSS)
      if (spaceRight < 300) {
        list.classList.add('adjust-right');
      } else if (spaceLeft < 300) {
        list.classList.add('adjust-left');
      }

      // Update custom property for max-height calc (used in CSS)
      list.style.setProperty('--dropdown-top', `${rect.bottom}px`);

      // Allow paint in next frame, then reveal
      requestAnimationFrame(() => {
        list.classList.remove('repositioning');
      });
    });
  };

  // Observe events that may affect positioning
  ['scroll', 'resize'].forEach(ev => window.addEventListener(ev, adjust));
  document.addEventListener('click', adjust);
}; 