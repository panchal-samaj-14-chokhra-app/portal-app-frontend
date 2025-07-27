# Panchal Samaj 14 Chhkhra - Digital Census Portal

A comprehensive digital census management system for Panchal Samaj 14 Chhkhra community.

## Features

- **Admin Dashboard**: Complete overview of census data
- **Village Management**: Manage villages and their information
- **Family Records**: Track family details and members
- **User Management**: Handle different user roles and permissions
- **Multi-language Support**: Hindi and English interface
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query
- **Internationalization**: next-intl
- **Testing**: Jest, React Testing Library

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_REQUEST_URL=your-backend-api-url
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
├── components/            # Reusable UI components
├── config/               # Configuration files
├── data-hooks/           # API hooks and data fetching
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── messages/             # Internationalization messages
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
