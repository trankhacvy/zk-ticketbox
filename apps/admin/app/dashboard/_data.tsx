import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
} from "@tabler/icons-react";

export const apps = [
  {
    name: "Telegram",
    logo: <IconBrandTelegram />,
    connected: false,
    desc: "Connect with Telegram for real-time communication.",
  },
  {
    name: "Notion",
    logo: <IconBrandNotion />,
    connected: true,
    desc: "Effortlessly sync Notion pages for seamless collaboration.",
  },
  {
    name: "Figma",
    logo: <IconBrandFigma />,
    connected: true,
    desc: "View and collaborate on Figma designs in one place.",
  },
  {
    name: "Trello",
    logo: <IconBrandTrello />,
    connected: false,
    desc: "Sync Trello cards for streamlined project management.",
  },
  {
    name: "Slack",
    logo: <IconBrandSlack />,
    connected: false,
    desc: "Integrate Slack for efficient team communication",
  },
  {
    name: "Zoom",
    logo: <IconBrandZoom />,
    connected: true,
    desc: "Host Zoom meetings directly from the dashboard.",
  },
  {
    name: "Stripe",
    logo: <IconBrandStripe />,
    connected: false,
    desc: "Easily manage Stripe transactions and payments.",
  },
  {
    name: "Gmail",
    logo: <IconBrandGmail />,
    connected: true,
    desc: "Access and manage Gmail messages effortlessly.",
  },
  {
    name: "Medium",
    logo: <IconBrandMedium />,
    connected: false,
    desc: "Explore and share Medium stories on your dashboard.",
  },
  {
    name: "Skype",
    logo: <IconBrandSkype />,
    connected: false,
    desc: "Connect with Skype contacts seamlessly.",
  },
  {
    name: "Docker",
    logo: <IconBrandDocker />,
    connected: false,
    desc: "Effortlessly manage Docker containers on your dashboard.",
  },
  {
    name: "GitHub",
    logo: <IconBrandGithub />,
    connected: false,
    desc: "Streamline code management with GitHub integration.",
  },
  {
    name: "GitLab",
    logo: <IconBrandGitlab />,
    connected: false,
    desc: "Efficiently manage code projects with GitLab integration.",
  },
  {
    name: "Discord",
    logo: <IconBrandDiscord />,
    connected: false,
    desc: "Connect with Discord for seamless team communication.",
  },
  {
    name: "WhatsApp",
    logo: <IconBrandWhatsapp />,
    connected: false,
    desc: "Easily integrate WhatsApp for direct messaging.",
  },
];

export const events = [
  {
    id: 1,
    thumbnail:
      "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp",
    name: "Web Development Workshop",
    description:
      "Join us for an intensive workshop on modern web development techniques. Learn about the latest frameworks, tools, and best practices from industry experts.",
    startAt: new Date(2025, 5, 15, 10, 0),
    endAt: new Date(2025, 5, 15, 16, 0),
    locationType: "online",
    platform: "zoom",
    link: "https://zoom.us/j/123456789",
    attendees: 50,
  },
  {
    id: 2,
    thumbnail:
      "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp",
    name: "Annual Tech Conference",
    description:
      "Our flagship tech conference brings together thought leaders, innovators, and developers from around the world. Network with peers and gain insights into emerging technologies.",
    startAt: new Date(2025, 6, 10, 9, 0),
    endAt: new Date(2025, 6, 12, 17, 0),
    locationType: "offline",
    address: "123 Conference Center, Tech City, CA 94043",
    attendees: 500,
  },
  {
    id: 3,
    thumbnail:
      "https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp",
    name: "UI/UX Design Masterclass",
    description:
      "Elevate your design skills with our comprehensive masterclass. Learn about user research, wireframing, prototyping, and design systems from experienced designers.",
    startAt: new Date(2025, 5, 25, 13, 0),
    endAt: new Date(2025, 5, 25, 17, 0),
    locationType: "online",
    platform: "discord",
    link: "https://discord.gg/design-masterclass",
    attendees: 100,
  },
];
