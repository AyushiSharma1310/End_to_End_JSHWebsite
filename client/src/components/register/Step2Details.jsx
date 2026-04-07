export default function Step2Details({
  formData,
  handleChange,
  fetchLocationFromPincode,
  loadingLocation,
  captcha,
  userCaptcha,
  setUserCaptcha,
}) {
  return (
    <>
      <input
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={(e) => {
          handleChange(e);
          fetchLocationFromPincode(e.target.value);
        }}
        className="w-full border p-3 rounded-lg"
        required
      />

      {loadingLocation && (
        <p className="text-sm text-gray-500">Fetching location...</p>
      )}

      <input value={formData.state} readOnly className="w-full border p-3 rounded-lg bg-gray-100" />
      <input value={formData.district} readOnly className="w-full border p-3 rounded-lg bg-gray-100" />
      <input value={formData.city} readOnly className="w-full border p-3 rounded-lg bg-gray-100" />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="Password"
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        placeholder="Confirm Password"
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />

      <p className="text-sm font-medium">Solve: {captcha.question}</p>
      <input
        value={userCaptcha}
        onChange={(e) => setUserCaptcha(e.target.value)}
        className="w-full border p-3 rounded-lg"
        required
      />
    </>
  );
}