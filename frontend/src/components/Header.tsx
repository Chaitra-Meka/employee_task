interface Props {
  title: string;
  subtitle: string;
}

export default function Header({
  title,
  subtitle
}: Props) {

  return (
    <header className="page-header">

      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="admin-profile">
        <span>AD</span>
        <strong>Admin</strong>
      </div>

    </header>
  );
}