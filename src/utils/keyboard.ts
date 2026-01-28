export function handleListKeydown(
  event: KeyboardEvent,
  items: HTMLElement[],
  direction: 'vertical' | 'horizontal' = 'vertical'
): number | null {
  const current = items.indexOf(event.target as HTMLElement);
  if (current === -1) return null;

  const next = direction === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const prev = direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

  let newIndex: number | null = null;

  switch (event.key) {
    case next:
      event.preventDefault();
      newIndex = (current + 1) % items.length;
      break;
    case prev:
      event.preventDefault();
      newIndex = (current - 1 + items.length) % items.length;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
  }

  return newIndex;
}

let escapeController: AbortController | null = null;

export function onEscapeClose(
  trigger: HTMLElement,
  closeCallback: () => void
): void {
  escapeController?.abort();
  escapeController = new AbortController();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      closeCallback();
      trigger.focus();
    }
  }, { signal: escapeController.signal });
}
