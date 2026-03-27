/**
 * Implement AutoComplete here.
 * See README.md for the full problem description.
 */

import { useState } from "react";

interface SearchResult {
  id: string;
  name: string;
}

interface AutoCompleteProps {
  fetchResults: (query: string) => Promise<SearchResult[]>;
}

export function AutoComplete({ fetchResults }: AutoCompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // TODO: Implement debouncing, fetching, and race condition handling

  return (
    <div data-testid="autocomplete">
      <input
        data-testid="autocomplete-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul data-testid="autocomplete-results">
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
