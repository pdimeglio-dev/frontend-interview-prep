// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Frontend Interview Prep — Notes",
  tagline: "Personal study notes for frontend interview concepts",
  favicon: "img/favicon.ico",

  url: "http://localhost",
  baseUrl: "/",

  onBrokenLinks: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "docs",
          sidebarPath: "./sidebars.js",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "📝 Study Notes",
        logo: {
          alt: "Study Notes",
          src: "img/favicon.ico",
          href: "/docs/",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "notesSidebar",
            position: "left",
            label: "Notes",
          },
          {
            href: "http://localhost:3737",
            label: "← Dashboard",
            position: "right",
          },
          {
            href: "https://github.com/pdimeglio-dev/frontend-interview-prep",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Frontend Interview Prep — Study Notes`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["typescript", "jsx", "tsx", "bash", "json"],
      },
    }),
};

export default config;
