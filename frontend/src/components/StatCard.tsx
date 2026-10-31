interface Props {
  title: string;
  value: number;
  icon: string;
  tone: string;
}

export default function StatCard({
  title,
  value,
  icon,
  tone
}: Props) {

  return (
    <article className="stat-card">

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>

      <span className={`stat-icon ${tone}`}>
        {icon}
      </span>

    </article>
  );
}
