"use client";

import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import type { ComponentType, ReactNode } from "react";

type ResponsiveComponents<P> = {
  mobile: ComponentType<P>;
  tablet: ComponentType<P>;
  desktop: ComponentType<P>;
};

type ResponsiveSwitcherProps<P> = ResponsiveComponents<P> & {
  props: P;
  fallback?: ReactNode;
};

export function ResponsiveSwitcher<P extends object>({
  mobile: Mobile,
  tablet: Tablet,
  desktop: Desktop,
  props,
  fallback = null,
}: ResponsiveSwitcherProps<P>) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }

  if (isMobile) return <Mobile {...props} />;
  if (isDesktop) return <Desktop {...props} />;
  return <Tablet {...props} />;
}

type ResponsiveSwitcherWithSkeletonProps<P> = ResponsiveComponents<P> & {
  skeletons: ResponsiveComponents<object>;
  props: P;
  isLoading: boolean;
};

export function ResponsiveSwitcherWithSkeleton<P extends object>({
  mobile: Mobile,
  tablet: Tablet,
  desktop: Desktop,
  skeletons,
  props,
  isLoading,
}: ResponsiveSwitcherWithSkeletonProps<P>) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isLoading) {
    const SkeletonMobile = skeletons.mobile;
    const SkeletonTablet = skeletons.tablet;
    const SkeletonDesktop = skeletons.desktop;

    if (isMobile) return <SkeletonMobile />;
    if (isDesktop) return <SkeletonDesktop />;
    return <SkeletonTablet />;
  }

  if (isMobile) return <Mobile {...props} />;
  if (isDesktop) return <Desktop {...props} />;
  return <Tablet {...props} />;
}

export function useResponsiveComponent<P extends object>(
  components: ResponsiveComponents<P>
): ComponentType<P> {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isMobile) return components.mobile;
  if (isDesktop) return components.desktop;
  return components.tablet;
}
