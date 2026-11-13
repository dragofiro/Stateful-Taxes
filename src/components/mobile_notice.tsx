// Notice for narrow screens on the filing routes. The filer must choose: "Okay" opens the form,
// "I'm on mobile" goes back to the map. The choice to continue lasts for the browser session.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import './mobile_notice.css';

const NARROW = '(max-width: 767px)';
const ACCEPTED_KEY = 'stateful_taxes_mobile_ok';

function subscribeToNarrow(onChange: () => void): () => void {
  const query = window.matchMedia(NARROW);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useNarrowScreen(): boolean {
  return useSyncExternalStore(subscribeToNarrow, () => window.matchMedia(NARROW).matches);
}

function readAccepted(): boolean {
  try {
    return window.sessionStorage.getItem(ACCEPTED_KEY) === '1';
  } catch {
    return false;
  }
}

interface MobileNoticeProps {
  /** Leaves the form, for example back to the map. */
  onLeave: () => void;
}

export function MobileNotice({ onLeave }: MobileNoticeProps) {
  const narrow = useNarrowScreen();
  const [accepted, setAccepted] = useState(readAccepted);
  const okayRef = useRef<HTMLButtonElement>(null);
  const open = narrow && !accepted;

  useEffect(() => {
    if (!open) return;
    okayRef.current?.focus();
    // Stop the page behind the notice from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const accept = () => {
    try {
      window.sessionStorage.setItem(ACCEPTED_KEY, '1');
    } catch {
      // Without storage the notice shows again next time. That is acceptable.
    }
    setAccepted(true);
  };

  return (
    <div className="mn-backdrop">
      <div
        className="mn-toast"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mn-title"
        aria-describedby="mn-body"
      >
        <p id="mn-title" className="mn-title">
          Use a larger screen
        </p>
        <p id="mn-body" className="mn-body">
          This project does not support mobile devices, please use a desktop or laptop computer to access the
          application (You should not be doing taxes on a mobile device). If you are on desktop and can see this
          content, please maximize your browser window.
        </p>
        <div className="mn-actions">
          <button type="button" className="mn-btn mn-btn--leave" onClick={onLeave}>
            I'm on mobile
          </button>
          <button ref={okayRef} type="button" className="mn-btn mn-btn--okay" onClick={accept}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
