"use client";

import { Button } from "@/components/ui/button";

type LoadMorePagerProps = {
  shown: number;
  total: number;
  noun: string;
  onLoadMore: () => void;
};

export const LoadMorePager = ({
  shown,
  total,
  noun,
  onLoadMore,
}: LoadMorePagerProps) => (
  <div className="flex flex-col items-center">
    <p className="text-body-sm text-[#3c4347]">
      1-{shown} of {total} {noun}
    </p>
    <div aria-hidden className="mt-1 h-px w-40 bg-[#eaeaea]">
      <div
        className="h-px bg-[#3c4347]"
        style={{ width: `${(shown / total) * 100}%` }}
      />
    </div>

    {shown < total && (
      <Button
        type="button"
        size="cta"
        variant="jemai-ink"
        onClick={onLoadMore}
        className="mt-7.5 h-11.75 px-7.5"
      >
        Load more
      </Button>
    )}
  </div>
);
