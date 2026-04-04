/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  notesSidebar: [
    "intro",
    {
      type: "category",
      label: "⏱️ Module 1: Timer & Async",
      collapsed: false,
      items: [
        "module-1/closures",
        "module-1/this-keyword",
        "module-1/settimeout-cleartimeout",
        "module-1/event-loop",
        "module-1/rest-spread",
        "module-1/useeffect-cleanup",
        "module-1/debounce-leading-trailing",
      ],
    },
    {
      type: "category",
      label: "🧠 Module 2: Closure & Cache",
      items: [
        "module-2/closures-caching",
        "module-2/map-vs-weakmap",
        "module-2/referential-equality",
        "module-2/higher-order-functions",
        "module-2/useref-vs-usestate",
      ],
    },
    {
      type: "category",
      label: "📡 Module 3: Pub/Sub Architecture",
      items: [
        "module-3/observer-pattern",
        "module-3/javascript-classes",
        "module-3/map-and-set",
        "module-3/event-bubbling",
        "module-3/memory-leaks",
      ],
    },
    {
      type: "category",
      label: "🧬 Module 4: Reference & Recursion",
      items: [
        "module-4/primitive-vs-reference",
        "module-4/shallow-vs-deep-copy",
        "module-4/recursion",
        "module-4/typeof-instanceof",
        "module-4/weakmap-circular-refs",
      ],
    },
    {
      type: "category",
      label: "⚙️ Module 5: Functional Pipeline",
      items: [
        "module-5/higher-order-functions",
        "module-5/accumulator-pattern",
        "module-5/prototype-chain",
        "module-5/arguments-object",
        "module-5/function-arity",
        "module-5/currying",
      ],
    },
    {
      type: "category",
      label: "⚡ Module 6: Async Orchestrator",
      items: [
        "module-6/promises",
        "module-6/promise-resolve",
        "module-6/microtask-vs-macrotask",
        "module-6/async-await",
        "module-6/fetch-api",
        "module-6/abort-controller",
      ],
    },
    {
      type: "category",
      label: "🖼️ Module 7: DOM Performance",
      items: [
        "module-7/browser-rendering",
        "module-7/reflow-layout-thrashing",
        "module-7/css-position",
        "module-7/scroll-events",
        "module-7/core-web-vitals",
      ],
    },
    {
      type: "category",
      label: "🌍 Module 8: Data Fetching UI",
      items: [
        "module-8/controlled-components",
        "module-8/race-conditions",
        "module-8/intersection-observer",
        "module-8/pagination",
        "module-8/usecallback",
        "module-8/functional-state-updates",
      ],
    },
  ],
};

export default sidebars;
