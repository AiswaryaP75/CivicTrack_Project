import { PinIcon } from "./Icons";

export default function BrandPanel() {
  return (
    <div className="auth-brandpanel">
      <div className="brand-mark">
        <PinIcon className="pin" />
        CivicTrack
      </div>

      <div className="brand-copy">
        <h1>Report it once. Track it to the end.</h1>
        <p>
          CivicTrack connects residents, municipal officers, and field
          workers around a single, transparent complaint lifecycle — so
          every pothole, leak, or streetlight report gets seen, assigned,
          and resolved.
        </p>
        <div className="brand-stages">
          <span className="brand-stage-pill">SUBMITTED</span>
          <span className="brand-stage-pill">VERIFIED</span>
          <span className="brand-stage-pill">ASSIGNED</span>
          <span className="brand-stage-pill">IN PROGRESS</span>
          <span className="brand-stage-pill">RESOLVED</span>
        </div>
      </div>

      <div className="brand-foot">Group 7 · College Web Development Project</div>
    </div>
  );
}
