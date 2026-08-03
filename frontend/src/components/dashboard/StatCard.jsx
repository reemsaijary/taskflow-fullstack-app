function StatCard({ icon: Icon, label, value, description, className = "" }) {
  return (
    <article className={`stat-card ${className}`}>
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={22} />
        </div>

        <span className="stat-value">{value}</span>
      </div>

      <div className="stat-card-content">
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

export default StatCard;