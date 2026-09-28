import { pitchMarkingsStyles as styles } from './pitch-markings.styles'

export function PitchMarkings() {
  return (
    <>
      <div aria-hidden className={styles.halfwayLine} />
      <div aria-hidden className={styles.centerCircle} />
      <div aria-hidden className={styles.centerSpot} />
      <div aria-hidden className={styles.leftPenaltyArea} />
      <div aria-hidden className={styles.leftGoalArea} />
      <div aria-hidden className={styles.rightPenaltyArea} />
      <div aria-hidden className={styles.rightGoalArea} />
    </>
  )
}
