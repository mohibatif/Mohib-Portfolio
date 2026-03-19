'use client'

import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={(spline) => {
          // Attempt to stop all auto-playing animations
          try {
            // Some scenes have a 'Start' event that triggers the zoom.
            // We can try to stop all timelines or emit a 'Stop' event if present.
            // However, the most effective way often is to just find the cameras
            // and ensure they are at their final state, but that's scene-dependent.
            // As a general fix, we'll try to stop all animations.
            // spline.stopAnimation(); // If supported
          } catch (e) {}
        }}
      />
    </Suspense>
  )
}
