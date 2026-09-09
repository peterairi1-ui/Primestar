const attachedRails = new WeakSet();

function attachRail(rail) {
  if (attachedRails.has(rail)) return;
  attachedRails.add(rail);
  rail.style.scrollSnapType = 'none';
  let dragging = false;
  rail.addEventListener('pointerdown', () => { dragging = true; });
  const stopDragging = () => { dragging = false; };
  rail.addEventListener('pointerup', stopDragging);
  rail.addEventListener('pointercancel', stopDragging);
  window.setInterval(() => {
    if (dragging || rail.matches(':hover') || rail.contains(document.activeElement)) return;
    rail.scrollLeft += 1;
    if (rail.scrollLeft >= rail.scrollWidth / 2) rail.scrollLeft = 0;
  }, 30);
}

const observer = new MutationObserver(() => {
  document.querySelectorAll('.vendor-rail').forEach(attachRail);
});
observer.observe(document.body, { childList: true, subtree: true });
document.querySelectorAll('.vendor-rail').forEach(attachRail);
