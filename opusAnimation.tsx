"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

type AdditionalEffect = "explode" | "scatter" | "implode" | "spiral" | "morph"

export default function OpusParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeEffects, setActiveEffects] = useState<{ [key in AdditionalEffect]?: boolean }>({})
  
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    points: THREE.Points
    geometry: THREE.BufferGeometry
    originalPositions: Float32Array
    velocities: Float32Array
    phases: Float32Array
    intersectionPoint: THREE.Vector3 | null
    particleCount: number
  } | null>(null)
  
  const activeEffectsRef = useRef<{ [key in AdditionalEffect]?: boolean }>(activeEffects)

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
  }

  const e = (px: number, py: number, sx: number, sy: number) => {
    const dx = Math.abs(px) - sx
    const dy = Math.abs(py) - sy
    return Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) + Math.min(Math.max(dx, dy), 0)
  }

  const g = (px: number, py: number, ax: number, ay: number, cx: number, cy: number, w: number) => {
    const pax = px - ax
    const pay = py - ay
    const bax = cx - ax
    const bay = cy - ay
    const dotBaBa = bax * bax + bay * bay
    const dotPaBa = pax * bax + pay * bay
    const h = clamp(dotPaBa / dotBaBa, 0, 1)
    const dx = pax - bax * h
    const dy = pay - bay * h
    return Math.sqrt(dx * dx + dy * dy) - w
  }

  // Distance function for OPUS - ULTRA PRECISE uniform construction
  const dist = (px: number, py: number) => {
    const w = 0.045  // REDUCED stroke width from 0.06 to 0.045
    
    // SMALLER SIZE: All letters EXACTLY 0.50 tall (y: -0.25 to +0.25)
    // SMALLER SIZE: All letters EXACTLY 0.22 wide
    // CRITICAL: Spacing between letters: 0.18 units
    
    // Letter positions (left edge):
    // O: -0.60
    // P: -0.20  (gap of 0.18 from O)
    // U: +0.20  (gap of 0.18 from P)
    // S: +0.60  (gap of 0.18 from U)
    
    // O - Rectangle at x = -0.60 to -0.38 (width 0.22)
    const oLeft = g(px, py, -0.60, 0.25, -0.60, -0.25, w)
    const oRight = g(px, py, -0.38, 0.25, -0.38, -0.25, w)
    const oTop = g(px, py, -0.60, 0.25, -0.38, 0.25, w)
    const oBottom = g(px, py, -0.60, -0.25, -0.38, -0.25, w)
    const oShape = Math.min(oLeft, Math.min(oRight, Math.min(oTop, oBottom)))
    
    // P - At x = -0.20 to +0.02 (width 0.22)
    const pLeft = g(px, py, -0.20, 0.25, -0.20, -0.25, w)
    const pTopH = g(px, py, -0.20, 0.25, 0.02, 0.25, w)
    const pMidH = g(px, py, -0.20, 0.0, 0.02, 0.0, w)
    const pRight = g(px, py, 0.02, 0.25, 0.02, 0.0, w)
    const pShape = Math.min(pLeft, Math.min(pTopH, Math.min(pMidH, pRight)))
    
    // U - At x = 0.20 to 0.42 (width 0.22)
    const uLeft = g(px, py, 0.20, 0.25, 0.20, -0.25, w)
    const uRight = g(px, py, 0.42, 0.25, 0.42, -0.25, w)
    const uBottom = g(px, py, 0.20, -0.25, 0.42, -0.25, w)
    const uShape = Math.min(uLeft, Math.min(uRight, uBottom))
    
    // S - At x = 0.60 to 0.82 (width 0.22)
    const sTopH = g(px, py, 0.60, 0.25, 0.82, 0.25, w)
    const sTopLeft = g(px, py, 0.60, 0.25, 0.60, 0.0, w)
    const sMidH = g(px, py, 0.60, 0.0, 0.82, 0.0, w)
    const sBottomRight = g(px, py, 0.82, 0.0, 0.82, -0.25, w)
    const sBottomH = g(px, py, 0.60, -0.25, 0.82, -0.25, w)
    const sShape = Math.min(sTopH, Math.min(sTopLeft, Math.min(sMidH, Math.min(sBottomRight, sBottomH))))
    
    return Math.min(oShape, Math.min(pShape, Math.min(uShape, sShape)))
  }

  useEffect(() => {
    activeEffectsRef.current = activeEffects
  }, [activeEffects])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.width, canvas.height)
    renderer.setClearColor(0x000000)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

    const numParticles = 15000
    const thickness = 0.2
    const positions = new Float32Array(numParticles * 3)
    const colors = new Float32Array(numParticles * 3)
    let i = 0
    const maxAttempts = 1500000
    let attempts = 0

    while (i < numParticles && attempts < maxAttempts) {
      attempts++
      const x = Math.random() * 4 - 2
      const y = Math.random() * 2 - 1
      const z = Math.random() * thickness - thickness / 2

      if (dist(x, y) <= 0) {
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
        i++
      }
    }

    const originalPositions = positions.slice()
    const phases = new Float32Array(i)
    const velocities = new Float32Array(i * 3)

    for (let j = 0; j < i; j++) {
      phases[j] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.005,
      sizeAttenuation: true,
      vertexColors: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    camera.position.set(0, 0, 1.5)

    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      geometry,
      originalPositions,
      velocities,
      phases,
      intersectionPoint: null,
      particleCount: i,
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!sceneRef.current) return
      const rect = canvas.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top
      mouse.x = (offsetX / canvas.clientWidth) * 2 - 1
      mouse.y = -(offsetY / canvas.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersect = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, intersect)) {
        sceneRef.current.intersectionPoint = intersect
      }
    }

    const handleMouseLeave = () => {
      if (sceneRef.current) {
        sceneRef.current.intersectionPoint = null
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    let animationId: number
    const animate = (timestamp: number) => {
      if (!sceneRef.current) return

      const time = timestamp * 0.001
      const {
        geometry,
        originalPositions,
        velocities,
        phases,
        intersectionPoint,
        particleCount,
      } = sceneRef.current

      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute

      const radiusSwirl = 0.01
      const angularSpeed = 1
      const effectRadius = 0.3
      const repelStrength = 0.05
      const attractStrength = 0.05
      const damping = 0.95

      const additionalFactors: { [key in AdditionalEffect]?: number } = {}
      for (const key in activeEffectsRef.current) {
        additionalFactors[key as AdditionalEffect] = activeEffectsRef.current[key as AdditionalEffect] ? 1 : 0
      }

      for (let j = 0; j < particleCount; j++) {
        const idx = j * 3
        const ox = originalPositions[idx]
        const oy = originalPositions[idx + 1]
        const oz = originalPositions[idx + 2]

        const theta = angularSpeed * time + phases[j]
        const swirlDx = radiusSwirl * Math.cos(theta)
        const swirlDy = radiusSwirl * Math.sin(theta)

        const targetX = ox + swirlDx
        const targetY = oy + swirlDy
        const targetZ = oz

        let px = positionAttribute.getX(j)
        let py = positionAttribute.getY(j)
        let pz = positionAttribute.getZ(j)

        let vx = velocities[idx]
        let vy = velocities[idx + 1]
        let vz = velocities[idx + 2]

        const explodeFactor = additionalFactors.explode || 0
        const scatterFactor = additionalFactors.scatter || 0
        const implodeFactor = additionalFactors.implode || 0
        const spiralFactor = additionalFactors.spiral || 0
        const morphFactor = additionalFactors.morph || 0

        const cx = px - 0
        const cy = py - 0
        const cz = pz - 0
        const cdistSq = cx * cx + cy * cy + cz * cz
        const cdist = Math.sqrt(cdistSq)

        if (explodeFactor > 0 && cdist > 0.001) {
          vx += (cx / cdist) * 0.1 * explodeFactor
          vy += (cy / cdist) * 0.1 * explodeFactor
          vz += (cz / cdist) * 0.1 * explodeFactor
        }

        if (scatterFactor > 0) {
          vx += (Math.random() - 0.5) * 0.05 * scatterFactor
          vy += (Math.random() - 0.5) * 0.05 * scatterFactor
          vz += (Math.random() - 0.5) * 0.05 * scatterFactor
        }

        if (implodeFactor > 0 && cdist > 0.001) {
          vx -= (cx / cdist) * 0.1 * implodeFactor
          vy -= (cy / cdist) * 0.1 * implodeFactor
          vz -= (cz / cdist) * 0.1 * implodeFactor
        }

        if (spiralFactor > 0 && cdist > 0.05) {
          const vortexStrength = 0.15 * spiralFactor
          const tangentX = -cy
          const tangentY = cx
          const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY)
          if (tangentLength > 0.001) {
            vx += (tangentX / tangentLength) * vortexStrength
            vy += (tangentY / tangentLength) * vortexStrength
          }
          const pullStrength = vortexStrength * 0.3
          vx -= (cx / cdist) * pullStrength
          vy -= (cy / cdist) * pullStrength
        }

        if (morphFactor > 0) {
          const angle = Math.atan2(py, px) + time * 2
          const radius = Math.sqrt(px * px + py * py + pz * pz)
          const offsetX = Math.cos(angle) * Math.sin(radius * 2) * 0.2 * morphFactor
          const offsetY = Math.sin(angle * 1.5) * 0.15 * morphFactor
          const offsetZ = 0
          vx += offsetX
          vy += offsetY
          vz += offsetZ
        }

        if (intersectionPoint) {
          const dx = px - intersectionPoint.x
          const dy = py - intersectionPoint.y
          const dz = pz - intersectionPoint.z
          const distSq = dx * dx + dy * dy + dz * dz
          const dist = Math.sqrt(distSq)

          if (distSq < effectRadius * effectRadius && distSq > 0.0001) {
            const force = (1 - dist / effectRadius) * repelStrength
            vx += (dx / dist) * force
            vy += (dy / dist) * force
            vz += (dz / dist) * force
          }
        }

        const attractDx = targetX - px
        const attractDy = targetY - py
        const attractDz = targetZ - pz
        vx += attractDx * attractStrength
        vy += attractDy * attractStrength
        vz += attractDz * attractStrength

        vx *= damping
        vy *= damping
        vz *= damping

        px += vx
        py += vy
        pz += vz

        positionAttribute.setXYZ(j, px, py, pz)
        velocities[idx] = vx
        velocities[idx + 1] = vy
        velocities[idx + 2] = vz

        let r: number, g: number, b: number

        // Uniform sapphire blue color for all letters with HIGH brightness
        // Using the darkest shade from the gradient for consistency
        r = 0 * 4.5
        g = 0.1216 * 4.5
        b = 0.2471 * 4.5

        if (explodeFactor > 0) {
          const intensity = 1 + Math.sin(time * 8 - cdist * 15) * 0.5 * explodeFactor
          r = intensity * 10.0
          g = intensity * 5.0
          b = intensity * 2.0
        }

        if (scatterFactor > 0) {
          r = 3.0 + Math.random() * 1.5 * scatterFactor
          g = 6.0 + Math.random() * 1.5 * scatterFactor
          b = 3.0 + Math.random() * 1.5 * scatterFactor
        }

        if (implodeFactor > 0) {
          const intensity = 1 + Math.sin(time * 8 - cdist * 15) * 0.5 * implodeFactor
          r = intensity * 2.0
          g = intensity * 2.0
          b = intensity * 10.0
        }

        if (spiralFactor > 0) {
          const angle = Math.atan2(cy, cx) + time * 5
          const intensity = 10
          r = (Math.sin(angle) * 0.5 + 0.5) * intensity
          g = (Math.sin(angle + (Math.PI * 2) / 3) * 0.5 + 0.5) * intensity
          b = (Math.sin(angle + (Math.PI * 4) / 3) * 0.5 + 0.5) * intensity
        }

        if (morphFactor > 0) {
          const angle = Math.atan2(py, px) + time * 2
          const intensity = (Math.sin(angle) * 0.5 + 0.5) * 2 + 1 * morphFactor
          r = intensity * 7.0
          g = intensity * 4.0
          b = intensity * 5.5
        }

        colorAttribute.setXYZ(j, r, g, b)
      }

      positionAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  const triggerEffect = (eff: AdditionalEffect) => {
    setActiveEffects((prev) => {
      const newState = { ...prev }
      if (newState[eff]) {
        delete newState[eff]
      } else {
        newState[eff] = true
      }
      return newState
    })
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <canvas
        ref={canvasRef}
        width={1600}
        height={800}
        className="block"
      />
      <div className="absolute bottom-5 right-5">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm hover:underline"
        >
        </a>
      </div>
    </div>
  )
}