import { useCallback, useEffect, useState } from 'react';

const pinchZoomThreshold = 1.01;

export function useVisualViewportOverlay(isOpen: boolean) {
    const [overlayNode, setOverlayNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const viewport = window.visualViewport;
        if (!isOpen || !overlayNode || !viewport) return;

        let pendingFrame = 0;

        const applyViewportBounds = () => {
            pendingFrame = 0;

            if (viewport.scale > pinchZoomThreshold) {
                overlayNode.style.top = '';
                overlayNode.style.left = '';
                overlayNode.style.width = '';
                overlayNode.style.height = '';
                return;
            }

            overlayNode.style.top = `${viewport.offsetTop}px`;
            overlayNode.style.left = `${viewport.offsetLeft}px`;
            overlayNode.style.width = `${viewport.width}px`;
            overlayNode.style.height = `${viewport.height}px`;
        };

        const scheduleViewportBounds = () => {
            if (pendingFrame) return;
            pendingFrame = requestAnimationFrame(applyViewportBounds);
        };

        applyViewportBounds();
        viewport.addEventListener('resize', scheduleViewportBounds);
        viewport.addEventListener('scroll', scheduleViewportBounds);

        return () => {
            cancelAnimationFrame(pendingFrame);
            viewport.removeEventListener('resize', scheduleViewportBounds);
            viewport.removeEventListener('scroll', scheduleViewportBounds);
        };
    }, [isOpen, overlayNode]);

    return useCallback((node: HTMLElement | null) => {
        setOverlayNode(node);
    }, []);
}
