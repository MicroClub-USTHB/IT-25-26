// src/components/StudentCard.jsx
import './StudentCard.css';

function StudentCard(props) {
    const { name, age, track } = props;
  // Get first letter for avatar
  const initial = name.charAt(0).toUpperCase();

  // Determine if senior (age >= 23)
  const isSenior = age >= 23;

  return (
    <div className={`student-card ${track.toLowerCase()} ${isSenior ? 'senior' : ''}`}>
      {/* Card Header */}
      <div className="student-card-header">
        <div className="student-avatar">
          {initial}
        </div>
        <div className="student-info">
          <h3 className="student-name">{props.name}</h3>
        </div>
      </div>

      {/* Student Details */}
      <div className="student-details">
        <div className="student-detail">
          <span className="student-detail-icon">📧</span>
          <span className="student-detail-label">Age:</span>
          <span className="student-detail-value">{props.age}</span>
        </div>

        <div className="student-detail">
          <span className="student-detail-icon">💼</span>
          <span className="student-detail-label">Track:</span>
          <span className="student-detail-value">{props.track}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="badges-container">
        {/* Age Badge */}
        {isSenior ? (
          <span className="badge badge-senior">
            ⭐ Senior
          </span>
        ) : (
          <span className="badge badge-junior">
            🌱 Junior
          </span>
        )}

        {/* Track Badge */}
        <span className={`badge badge-track ${track.toLowerCase()}`}>
          {track}
        </span>

        {/* Verified Badge (if age >= 25) */}
        {age >= 25 && (
          <span className="badge badge-verified">
            ✓ Verified
          </span>
        )}
      </div>
    </div>
  );
}

export default StudentCard;