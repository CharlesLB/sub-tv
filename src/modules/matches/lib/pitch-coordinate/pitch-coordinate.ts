import { z } from 'zod'

const PITCH_MINIMUM = 0
const PITCH_MAXIMUM = 100

export const PitchCoordinateSchema = z.number().min(PITCH_MINIMUM).max(PITCH_MAXIMUM)

export const PitchPointSchema = z.object({ x: PitchCoordinateSchema, y: PitchCoordinateSchema })
