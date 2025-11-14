export const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to NoteBox</h2>
        <p className="text-lg text-gray-600">
          Your lightweight app for quick notes with search and tag categorization.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">
          Start creating your notes and organize them with tags for easy access.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
