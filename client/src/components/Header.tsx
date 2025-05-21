import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="">
      <nav className="">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="no-underline text-inherit hover:text-inherit font-bold">
            Dashboard
          </Link>
          <Link
            to="/new"
            className="no-underline text-inherit hover:text-inherit font-bold">
            Add Job
          </Link>
        </div>
      </nav>
    </header>
  );
}
