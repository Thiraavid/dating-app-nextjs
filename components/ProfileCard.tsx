import { UserProfile } from "@/types";

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const imageUrl = profile.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80";

  return (
    <article className="profile-card">
      <div className="profile-image" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="image-overlay">
          <h3 style={{ margin: 0, fontSize: "1.8rem" }}>{profile.name}, {profile.age}</h3>
          <p style={{ margin: "0.3rem 0 0", opacity: 0.9 }}>
            <i className="fa-solid fa-location-dot"></i> {profile.location} · {profile.distance} km away
          </p>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-head">
          <p style={{ color: "var(--muted)", margin: "0 0 0.5rem" }}>
            <i className="fa-solid fa-circle-info"></i> About
          </p>
          <span className="match-score"><i className="fa-solid fa-star"></i> {profile.matchScore}% Match</span>
        </div>
        <p>{profile.bio}</p>
        <div className="tag-row" style={{ marginTop: "1rem" }}>
          {profile.interests.map((interest) => (
            <span key={interest}><i className="fa-solid fa-tag"></i> {interest}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
