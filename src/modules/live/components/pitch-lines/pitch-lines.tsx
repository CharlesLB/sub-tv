import { pitchLinesStyles as styles } from './pitch-lines.styles'

export function PitchLines() {
  return (
    <>
      <div className={styles.halfwayLine} />
      <div className={`${styles.line} ${styles.centerCircle}`} />
      <div className={styles.centerSpot} />
      <div className={`${styles.line} ${styles.leftPenaltyArea}`} />
      <div className={`${styles.line} ${styles.leftGoalArea}`} />
      <div className={`${styles.line} ${styles.rightPenaltyArea}`} />
      <div className={`${styles.line} ${styles.rightGoalArea}`} />
    </>
  )
}
