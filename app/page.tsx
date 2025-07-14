import Link from "next/link"

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Village Hub</h1>
      <p>Explore and connect with villages around the world.</p>
      <nav>
        <ul>
          <li>
            <Link href="/villages">View All Villages</Link>
          </li>
          <li>
            <Link href="/village/new">Create a New Village</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
        </ul>
      </nav>
    </main>
  )
}
