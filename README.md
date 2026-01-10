# cooldev Portfolio

A sleek, minimalist portfolio website built with Next.js, TypeScript, and Tailwind CSS. Designed with a dark theme, monospace font, and orange accent colors to match the exact styling of the reference design.

## Features

- ✨ Dark theme with terminal-like aesthetic
- 🔤 Monospace font styling (JetBrains Mono)
- 🟠 Orange accent colors (#FF6B35)
- 📊 Real-time GitHub contribution graph
- 📝 Blog section with dynamic routing
- 🎨 Responsive design
- 📱 Clean and minimal UI

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Update GitHub username:**
   - Open `app/page.tsx`
   - Find `YOUR_GITHUB_USERNAME` and replace with your actual GitHub username
   - The GitHub calendar will automatically fetch your contribution data

3. **Update social media links:**
   - In `app/page.tsx`, update the footer links:
     - Twitter/X: `https://twitter.com`
     - GitHub: `https://github.com`
     - LinkedIn: `https://linkedin.com`
     - Email: `mailto:your@email.com`

4. **Customize your content:**
   - Update personal info in `app/page.tsx`
   - Modify projects in `app/projects/page.tsx`
   - Add/edit blog posts in `app/blog/[slug]/page.tsx`

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── github-contributions/    # API route for GitHub data
│   ├── blog/
│   │   └── [slug]/                   # Dynamic blog post pages
│   ├── projects/                     # Projects listing page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main portfolio page
│   └── globals.css                   # Global styles
├── components/
│   └── GitHubCalendar.tsx           # Custom GitHub contribution graph
└── package.json
```

## Customization Guide

### Personal Information
Edit `app/page.tsx`:
- Title and intro text
- Stack technologies
- Experience details
- Projects list
- Blog entries

### Projects
- Main page shows 3 featured projects
- Full list available at `/projects`
- Add more projects in `app/projects/page.tsx`

### Blog Posts
- Blog entries are in `app/blog/[slug]/page.tsx`
- Add new posts by creating new entries in the `blogPosts` object
- Each post has: title, date, and content

### GitHub Contributions
- The calendar automatically fetches data from GitHub
- Uses `github-contributions-api.vercel.app` service
- Falls back to mock data if username is not set or API fails

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JetBrains Mono** - Monospace font

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Your own server

## Notes

- The visit counter uses localStorage (client-side only)
- For production, consider using a proper analytics service
- GitHub contribution graph requires a valid GitHub username
- All styling matches the reference design with precision

## License

MIT License - feel free to use this template for your own portfolio!
