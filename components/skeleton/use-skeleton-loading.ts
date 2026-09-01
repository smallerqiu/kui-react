import { useEffect, useState } from "react";

export const useSkeletonLoading = (loading: boolean, delay: number): boolean => {
  const duration = Number.isFinite(delay) ? Math.max(0, delay) : 0;
  const [show, setShow] = useState(loading && duration === 0);
  const [previousLoading, setPreviousLoading] = useState(loading);

  if (previousLoading !== loading) {
    setPreviousLoading(loading);
    setShow(loading && duration === 0);
  }

  useEffect(() => {
    if (!loading || show || duration === 0) return;
    const timer = setTimeout(() => setShow(true), duration);
    return () => clearTimeout(timer);
  }, [duration, loading, show]);

  return show;
};
