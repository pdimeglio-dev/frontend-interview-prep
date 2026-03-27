/**
 * Implement InfiniteFeed here.
 * See README.md for the full problem description.
 */

import { useState, useRef } from "react";

interface FeedItem {
  id: string;
  title: string;
}

interface InfiniteFeedProps {
  fetchPage: (page: number) => Promise<FeedItem[]>;
}

export function InfiniteFeed({ fetchPage }: InfiniteFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // TODO: Implement IntersectionObserver, page tracking, fetching, and append logic

  return (
    <div data-testid="infinite-feed">
      {items.map((item) => (
        <div key={item.id} data-testid="feed-item">
          {item.title}
        </div>
      ))}
      <div ref={loaderRef} data-testid="sentinel">
        {isLoading && <p>Loading more...</p>}
      </div>
    </div>
  );
}
