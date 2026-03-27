import type { Meta, StoryObj } from "@storybook/react";
import { InfiniteFeed } from "./InfiniteFeed";

const meta: Meta<typeof InfiniteFeed> = {
  title: "Exercises/InfiniteFeed",
  component: InfiniteFeed,
};

export default meta;
type Story = StoryObj<typeof InfiniteFeed>;

const mockFetchPage = async (page: number) => {
  await new Promise((r) => setTimeout(r, 500)); // simulate latency
  if (page > 5) return []; // stop after 5 pages
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${page}-${i}`,
    title: `Page ${page} — Item ${i + 1}: ${Math.random().toString(36).slice(2, 10)}`,
  }));
};

export const Default: Story = {
  args: {
    fetchPage: mockFetchPage,
  },
};
