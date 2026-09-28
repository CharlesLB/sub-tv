const LINE = 'absolute border border-gr-linha'

export function PitchLines() {
  return (
    <>
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gr-linha" />
      <div className={`${LINE} top-1/2 left-1/2 aspect-square w-[17%] -translate-1/2 rounded-full`} />
      <div className="absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full bg-gr-linha" />
      <div className={`${LINE} top-[21%] left-0 h-[58%] w-[15%] rounded-card border-l-0`} />
      <div className={`${LINE} top-[36%] left-0 h-[28%] w-[6%] rounded-card border-l-0`} />
      <div className={`${LINE} top-[21%] right-0 h-[58%] w-[15%] rounded-card border-r-0`} />
      <div className={`${LINE} top-[36%] right-0 h-[28%] w-[6%] rounded-card border-r-0`} />
    </>
  )
}
