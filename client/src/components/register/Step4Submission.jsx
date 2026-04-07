export default function Step4Submission({ handleSubmit }) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        Review your details and submit to complete registration.
      </p>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Complete Registration
      </button>
    </>
  );
}