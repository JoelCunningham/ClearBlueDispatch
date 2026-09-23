"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import InputWrapper from "./input-wrapper";

type Point = { x: number; y: number };
type Stroke = Point[];

type SignatureInputProps = {
  id: string;
  label?: string;
  initial?: string;
  disabled?: boolean;
};

export default function SignatureInput({ id, label, initial, disabled = false }: SignatureInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [signature, setSignature] = useState(initial ?? "");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const setupContext = useCallback((context: CanvasRenderingContext2D, ratio: number) => {
    context.scale(ratio, ratio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2;
    context.strokeStyle = "#000";
  }, []);

  const redrawStrokes = useCallback((context: CanvasRenderingContext2D, strokeList: Stroke[]) => {
    strokeList.forEach(stroke => {
      if (stroke.length < 2) return;
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        context.lineTo(stroke[i].x, stroke[i].y);
      }
      context.stroke();
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      setIsLandscape(window.innerWidth > window.innerHeight);

      canvas.width = rect.width * ratio;
      canvas.height = 200 * ratio;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = "200px";

      const context = canvas.getContext("2d");
      if (!context) return;

      setupContext(context, ratio);

      if (strokes.length > 0) {
        redrawStrokes(context, strokes);
      } else if (initial && !isCleared) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, rect.width, 200);
        image.src = initial;
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [initial, strokes, isCleared, setupContext, redrawStrokes]);

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getPoint(event);

    if (!canvas || !context || !point) return;

    canvas.setPointerCapture(event.pointerId);

    context.beginPath();
    context.moveTo(point.x, point.y);

    setIsDrawing(true);
    setCurrentStroke([point]);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || disabled || !currentStroke) return;

    const context = canvasRef.current?.getContext("2d");
    const point = getPoint(event);

    if (!context || !point) return;

    context.lineTo(point.x, point.y);
    context.stroke();

    setCurrentStroke(prev => (prev ? [...prev, point] : [point]));
  }

  function stopDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsDrawing(false);
      return;
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    setIsDrawing(false);

    if (currentStroke) {
      const updatedStrokes = [...strokes, currentStroke];
      setStrokes(updatedStrokes);
      setCurrentStroke(null);
    }

    setSignature(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    setStrokes([]);
    setCurrentStroke(null);
    setSignature("");
    setIsCleared(true);
  }

  const hasContent = Boolean(signature || strokes.length > 0 || (initial && !isCleared));

  return (
    <InputWrapper id={id} label={label}>
      <div ref={containerRef} className="relative overflow-hidden rounded-md border bg-white">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
        />

        {!hasContent && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-sm text-muted-foreground">
            <span>Sign here</span>
            {!isLandscape && <span>Rotate your device for best results.</span>}
          </div>
        )}
      </div>

      <input type="hidden" id={id} name={id} value={signature} readOnly />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasContent}
          className="text-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 -mt-12 mr-2 z-10"
        >
          Clear
        </button>
      </div>
    </InputWrapper>
  );
}
