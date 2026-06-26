const ProfileCard = ({ profile }) => {
  const githubUrl = profile.github
    ? profile.github.startsWith("http")
      ? profile.github
      : `https://${profile.github}`
    : null;

  const linkedinUrl = profile.linkedin
    ? profile.linkedin.startsWith("http")
      ? profile.linkedin
      : `https://${profile.linkedin}`
    : null;

  console.log("Github:", githubUrl);
  console.log("LinkedIn:", linkedinUrl);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex items-center gap-5">
        <img
          src={
            profile.avatar
              ? `http://localhost:3000/${profile.avatar.replace(
                  /\\/g,
                  "/"
                )}`
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/150";
          }}
        />

        <div>
          <h2 className="text-2xl font-bold">
            {profile.user?.name}
          </h2>

          <p className="text-gray-600">
            {profile.user?.email}
          </p>

          <p className="text-gray-600">
            {profile.location ||
              "No location added"}
          </p>

          <p className="text-gray-600">
            Role: {profile.user?.role}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-lg">
          Bio
        </h3>

        <p className="text-gray-700">
          {profile.bio ||
            "No bio added"}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-lg">
          College
        </h3>

        <p className="text-gray-700">
          {profile.college ||
            "Not provided"}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-lg">
          Experience
        </h3>

        <p className="text-gray-700">
          {profile.experience ||
            "Not provided"}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-lg">
          Skills
        </h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills?.length > 0 ? (
            profile.skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              )
            )
          ) : (
            <p className="text-gray-500">
              No skills added
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-3">
          Social Links
        </h3>

        <div className="flex gap-4">

          {githubUrl ? (
            <button
              onClick={() =>
                window.open(
                  githubUrl,
                  "_blank"
                )
              }
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg transition"
            >
              GitHub Profile
            </button>
          ) : (
            <span className="text-gray-500">
              No GitHub Added
            </span>
          )}

          {linkedinUrl ? (
            <button
              onClick={() =>
                window.open(
                  linkedinUrl,
                  "_blank"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              LinkedIn Profile
            </button>
          ) : (
            <span className="text-gray-500">
              No LinkedIn Added
            </span>
          )}

        </div>
      </div>

    </div>
  );
};

export default ProfileCard;