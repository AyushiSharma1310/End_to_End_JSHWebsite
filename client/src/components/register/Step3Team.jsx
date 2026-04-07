export default function Step3Team({ formData, handleChange }) {
  return (
    <>
      <input
        name="team_name"
        placeholder="Team Name"
        value={formData.team_name || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="team_members"
        placeholder="Number of Members"
        value={formData.team_members || ""}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      />
    </>
  );
}