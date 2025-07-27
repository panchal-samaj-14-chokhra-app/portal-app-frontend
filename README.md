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

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
