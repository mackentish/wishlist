import { useCallback, useEffect, useState } from 'react';

const fieldScrollMargin = 16;
const keyboardSettleDelay = 150;

function scrollFieldWithinModal(
    modalScroller: HTMLElement,
    field: HTMLElement
) {
    let scroller: HTMLElement | null = field.parentElement;

    while (scroller) {
        if (scroller.scrollHeight > scroller.clientHeight) {
            const scrollerBounds = scroller.getBoundingClientRect();
            const fieldBounds = field.getBoundingClientRect();
            const hiddenBelow =
                fieldBounds.bottom + fieldScrollMargin - scrollerBounds.bottom;
            const hiddenAbove =
                scrollerBounds.top - (fieldBounds.top - fieldScrollMargin);

            if (hiddenBelow > 0) {
                scroller.scrollTop += hiddenBelow;
            } else if (hiddenAbove > 0) {
                scroller.scrollTop -= hiddenAbove;
            }
        }

        if (scroller === modalScroller) return;
        scroller = scroller.parentElement;
    }
}

export function useScrollFieldIntoView(isOpen: boolean) {
    const [scrollerNode, setScrollerNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen || !scrollerNode) return;

        let pendingFrame = 0;
        let pendingSettle: ReturnType<typeof setTimeout> | undefined;

        const scrollActiveFieldIntoView = () => {
            const field = document.activeElement;
            if (!(field instanceof HTMLElement)) return;
            if (field === scrollerNode) return;
            if (!scrollerNode.contains(field)) return;
            scrollFieldWithinModal(scrollerNode, field);
        };

        const scheduleScroll = () => {
            cancelAnimationFrame(pendingFrame);
            clearTimeout(pendingSettle);
            pendingFrame = requestAnimationFrame(scrollActiveFieldIntoView);
            pendingSettle = setTimeout(
                scrollActiveFieldIntoView,
                keyboardSettleDelay
            );
        };

        scrollerNode.addEventListener('focusin', scheduleScroll);
        window.visualViewport?.addEventListener('resize', scheduleScroll);

        return () => {
            cancelAnimationFrame(pendingFrame);
            clearTimeout(pendingSettle);
            scrollerNode.removeEventListener('focusin', scheduleScroll);
            window.visualViewport?.removeEventListener(
                'resize',
                scheduleScroll
            );
        };
    }, [isOpen, scrollerNode]);

    return useCallback((node: HTMLElement | null) => {
        setScrollerNode(node);
    }, []);
}
