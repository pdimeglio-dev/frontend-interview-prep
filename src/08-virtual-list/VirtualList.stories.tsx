import type { Meta, StoryObj } from "@storybook/react";
import { VirtualList } from "./VirtualList";

const meta: Meta<typeof VirtualList> = {
  title: "Exercises/VirtualList",
  component: VirtualList,
};

export default meta;
type Story = StoryObj<typeof VirtualList>;

const items = Array.from({ length: 10000 }, (_, i) => (
  <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
    Item {i} — {Math.random().toString(36).slice(2, 8)}
  </div>
));

export const Default: Story = {
  args: {
    items,
    itemHeight: 40,
    windowHeight: 400,
  },
};

export const SmallWindow: Story = {
  args: {
    items,
    itemHeight: 40,
    windowHeight: 200,
  },
};
