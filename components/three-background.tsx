"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"

// Dynamically import Three.js to prevent SSR issues
const ThreeBackgroundClient = dynamic(() => Promise.resolve(ThreeBackgroundComponent), {
  ssr: false,
  loading: () => <div className="threejs-bg" />,
})

function ThreeBackgroundComponent() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>()
  const rendererRef = useRef<any>()
  const frameRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current || typeof window === "undefined") return

    // Dynamically import Three.js only on client side
    import("three")
      .then((THREE) => {
        // Scene setup
        const scene = new THREE.Scene()
        sceneRef.current = scene

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 5

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000000, 0)
        rendererRef.current = renderer

        if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement)
        }

        // Create floating geometric shapes with maroon colors
        const shapes: any[] = []
        const maroonColors = [0xdc5f5f, 0xc53030, 0x9b2c2c, 0xf4b5b5]

        // Add floating cubes (reduced count for performance)
        for (let i = 0; i < 8; i++) {
          const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
          const material = new THREE.MeshBasicMaterial({
            color: maroonColors[Math.floor(Math.random() * maroonColors.length)],
            transparent: true,
            opacity: 0.6,
          })
          const cube = new THREE.Mesh(geometry, material)

          cube.position.x = (Math.random() - 0.5) * 20
          cube.position.y = (Math.random() - 0.5) * 20
          cube.position.z = (Math.random() - 0.5) * 10

          cube.rotation.x = Math.random() * Math.PI
          cube.rotation.y = Math.random() * Math.PI

          shapes.push(cube)
          scene.add(cube)
        }

        // Add floating spheres (reduced count)
        for (let i = 0; i < 5; i++) {
          const geometry = new THREE.SphereGeometry(0.15, 8, 8) // Reduced segments
          const material = new THREE.MeshBasicMaterial({
            color: maroonColors[Math.floor(Math.random() * maroonColors.length)],
            transparent: true,
            opacity: 0.4,
            wireframe: true,
          })
          const sphere = new THREE.Mesh(geometry, material)

          sphere.position.x = (Math.random() - 0.5) * 25
          sphere.position.y = (Math.random() - 0.5) * 25
          sphere.position.z = (Math.random() - 0.5) * 15

          shapes.push(sphere)
          scene.add(sphere)
        }

        // Add auction-themed elements (reduced count)
        for (let i = 0; i < 3; i++) {
          const group = new THREE.Group()

          // Gavel handle
          const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8) // Reduced segments
          const handleMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b4513,
            transparent: true,
            opacity: 0.7,
          })
          const handle = new THREE.Mesh(handleGeometry, handleMaterial)

          // Gavel head
          const headGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8) // Reduced segments
          const headMaterial = new THREE.MeshBasicMaterial({
            color: maroonColors[Math.floor(Math.random() * maroonColors.length)],
            transparent: true,
            opacity: 0.8,
          })
          const head = new THREE.Mesh(headGeometry, headMaterial)
          head.position.y = 0.4
          head.rotation.z = Math.PI / 2

          group.add(handle)
          group.add(head)

          group.position.x = (Math.random() - 0.5) * 30
          group.position.y = (Math.random() - 0.5) * 30
          group.position.z = (Math.random() - 0.5) * 20

          group.rotation.x = Math.random() * Math.PI
          group.rotation.y = Math.random() * Math.PI
          group.rotation.z = Math.random() * Math.PI

          shapes.push(group)
          scene.add(group)
        }

        // Mouse interaction
        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (event: MouseEvent) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1
        }

        window.addEventListener("mousemove", handleMouseMove)

        // Animation loop
        const animate = () => {
          frameRef.current = requestAnimationFrame(animate)

          // Rotate and move shapes
          shapes.forEach((shape, index) => {
            if (shape.rotation) {
              shape.rotation.x += 0.005 + index * 0.0001
              shape.rotation.y += 0.005 + index * 0.0001
            }

            // Floating motion
            if (shape.position) {
              shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002

              // Mouse interaction (reduced intensity)
              shape.position.x += (mouseX * 1 - shape.position.x) * 0.001
              shape.position.y += (mouseY * 1 - shape.position.y) * 0.001
            }
          })

          // Camera gentle movement
          camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.005
          camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.005

          renderer.render(scene, camera)
        }

        animate()

        // Handle window resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener("resize", handleResize)

        // Cleanup function
        return () => {
          window.removeEventListener("mousemove", handleMouseMove)
          window.removeEventListener("resize", handleResize)

          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current)
          }

          if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
            mountRef.current.removeChild(renderer.domElement)
          }

          // Dispose of Three.js objects
          shapes.forEach((shape) => {
            if (shape.geometry) shape.geometry.dispose()
            if (shape.material) {
              if (Array.isArray(shape.material)) {
                shape.material.forEach((material: any) => material.dispose())
              } else {
                shape.material.dispose()
              }
            }
          })

          renderer.dispose()
        }
      })
      .catch((error) => {
        console.error("Failed to load Three.js:", error)
      })
  }, [])

  return <div ref={mountRef} className="threejs-bg" />
}

export function ThreeBackground() {
  return <ThreeBackgroundClient />
}
