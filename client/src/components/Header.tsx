import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <nav>
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            Job Tracker
          </Link>

          <div className="space-x-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link
              to="/new"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              + Add Job
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
