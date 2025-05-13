import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/new" className="hover:underline">
          Add Job
        </Link>
      </nav>
    </header>
  );
}
