import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCityStore } from '../store/useCityStore'

export default function Building({ data, isSelected, isFiltered, onClick, onPointerOver, onPointerOut }) {
  const meshRef = useRef()
  const edgesRef = useRef()
  const windowsRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { timeOfDay } = useCityStore()
  
  const opacity = isFiltered ? 0.15 : 1
  const baseColor = data.color

  const windowData = useMemo(() => {
    const windows = []
    const floorCount = Math.floor(data.size[1] / 3)
    
    for (let floorIndex = 0; floorIndex < floorCount; floorIndex++) {
      const y = floorIndex * 3 + 1.5
      for (const x of [-data.size[0] / 2 + 0.01, data.size[0] / 2 - 0.01]) {
        for (let zi = 0; zi < Math.floor(data.size[2] / 2); zi++) {
          const z = -data.size[2] / 2 + 1 + zi * 2
          windows.push({
            position: [x, y, z],
            isLit: Math.random() > 0.3,
            flickerOffset: Math.random() * Math.PI * 2
          })
        }
      }
    }
    return windows
  }, [data.size])

  useFrame((state) => {
    const isNight = timeOfDay < 0.25 || timeOfDay > 0.75
    const nightFactor = isNight ? 1 : Math.max(0, 1 - Math.abs(timeOfDay - 0.5) * 4)

    if (meshRef.current) {
      const material = meshRef.current.material
      const baseEmissive = 0.05 + nightFactor * 0.1
      
      if (isSelected) {
        material.emissiveIntensity = baseEmissive + 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      } else if (hovered) {
        material.emissiveIntensity = baseEmissive + 0.25
      } else {
        material.emissiveIntensity = baseEmissive
      }
    }
    
    if (edgesRef.current) {
      edgesRef.current.visible = isSelected || hovered
    }

    if (windowsRef.current) {
      windowsRef.current.children.forEach((window, i) => {
        const mat = window.material
        const winData = windowData[i]
        if (winData && winData.isLit) {
          const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 2 + winData.flickerOffset) * 0.2
          mat.opacity = 0.3 + nightFactor * 0.6 * flicker
        } else {
          mat.opacity = 0.1 + nightFactor * 0.1
        }
      })
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    onClick(data)
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    onPointerOver(e)
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    onPointerOut(e)
  }

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        position={[0, data.size[1] / 2, 0]}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={data.size} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={opacity}
          emissive={baseColor}
          emissiveIntensity={0.1}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(...data.size)]} />
        <lineBasicMaterial color="#00ffff" transparent opacity={0.8} />
      </lineSegments>
      
      <group ref={windowsRef}>
        {windowData.map((win, i) => (
          <mesh key={i} position={win.position}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshBasicMaterial
              color={win.isLit ? '#ffffaa' : '#222233'}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
