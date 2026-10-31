export type PageName =
  | "Dashboard"
  | "Employees"
  | "Tasks";

interface Props {
  page: PageName;
  onNavigate: (page: PageName) => void;
}

const pages: PageName[] = [
  "Dashboard",
  "Employees",
  "Tasks"
];

export default function Sidebar({
  page,
  onNavigate
}: Props) {

  return (
    <aside className="sidebar">

      <div className="brand">
        <span className="brand-mark">ET</span>
        <span>TaskFlow</span>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav aria-label="Main navigation">

        {pages.map((item) => (

          <button
            key={item}
            type="button"
            className={`nav-link ${
              page === item ? "selected" : ""
            }`}
            aria-current={
              page === item ? "page" : undefined
            }
            onClick={() => onNavigate(item)}
          >
            <span aria-hidden="true">
              {item === "Dashboard"
                ? "▦"
                : item === "Employees"
                ? "♙"
                : "☑"}
            </span>

            {item}
          </button>

        ))}

      </nav>

      <p className="sidebar-note">
        Employee Task Tracker
      </p>

    </aside>
  );
}