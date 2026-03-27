import type { Meta, StoryObj } from "@storybook/react";
import { AutoComplete } from "./AutoComplete";

const meta: Meta<typeof AutoComplete> = {
  title: "Exercises/AutoComplete",
  component: AutoComplete,
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

const mockData = [
  { id: "1", name: "JavaScript" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "Java" },
  { id: "4", name: "Python" },
  { id: "5", name: "React" },
  { id: "6", name: "React Native" },
  { id: "7", name: "Redux" },
  { id: "8", name: "Rust" },
  { id: "9", name: "Ruby" },
];

const mockFetchResults = async (query: string) => {
  await new Promise((r) => setTimeout(r, 200)); // simulate latency
  return mockData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const Default: Story = {
  args: {
    fetchResults: mockFetchResults,
  },
};
