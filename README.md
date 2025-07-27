# Panchal Samaj Census Portal

A comprehensive census management system for the Panchal Samaj community built with Next.js 14, TypeScript, and modern web technologies.

## Features

- **Admin Dashboard**: Complete administrative interface for managing census data
- **Village Management**: Add, edit, and manage village information
- **Family Records**: Comprehensive family and member registration system
- **Authentication**: Secure login system with NextAuth.js
- **Multilingual Support**: English and Hindi language support
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Live data updates and notifications

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/jeki01/smj-app-14-chokhra.git
cd smj-app-14-chokhra
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local`

5. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── group-component/  # Feature-specific components
├── lib/                  # Utility libraries
│   ├── providers/        # Context providers
│   └── i18n/            # Internationalization config
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── data-hooks/           # Data fetching hooks
└── messages/             # Translation files
\`\`\`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_REQUEST_URL=https://your-backend-api.vercel.app
\`\`\`

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to production branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@panchalsamaj.org or create an issue in the GitHub repository.
