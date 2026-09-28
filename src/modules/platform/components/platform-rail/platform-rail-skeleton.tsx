import { BrandLogo } from '../brand-logo/brand-logo'

export function PlatformRailSkeleton() {
  return (
    <div className="chrome flex w-[78px] flex-none flex-col items-center gap-[14px] border-r border-bd bg-(--ch-rail) py-[14px] narrow:w-[62px] mobile:order-3 mobile:h-[60px] mobile:w-full mobile:border-t mobile:border-r-0">
      <div className="mobile:hidden">
        <BrandLogo />
      </div>
    </div>
  )
}
