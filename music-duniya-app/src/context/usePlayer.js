import { useContext } from 'react'
import { PlayerContext } from './playerContextCore'

export function usePlayer() {
  return useContext(PlayerContext)
}
