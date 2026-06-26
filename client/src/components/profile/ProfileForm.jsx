import { useState } from "react";

const ProfileForm = ({
  initialData,
  onSubmit,
}) => {
  const [avatar, setAvatar] =
    useState(null);

  const [form, setForm] =
    useState({
      bio:
        initialData?.bio || "",
      college:
        initialData?.college || "",
      skills:
        initialData?.skills?.join(",") ||
        "",
      github:
        initialData?.github || "",
      linkedin:
        initialData?.linkedin || "",
      experience:
        initialData?.experience || "",
      location:
        initialData?.location || "",
    });

  const submitHandler = (e) => {
    e.preventDefault();

    const formData =
      new FormData();

    if (avatar) {
      formData.append(
        "avatar",
        avatar
      );
    }

    formData.append(
      "bio",
      form.bio
    );
    formData.append(
      "college",
      form.college
    );
    formData.append(
      "skills",
      form.skills
    );
    formData.append(
      "github",
      form.github
    );
    formData.append(
      "linkedin",
      form.linkedin
    );
    formData.append(
      "experience",
      form.experience
    );
    formData.append(
      "location",
      form.location
    );

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-6 rounded-lg shadow"
    >
      <label className="block mb-2 font-medium">
        Profile Image
      </label>

      <input
        type="file"
        accept="image/*"
        className="w-full border p-3 mb-4"
        onChange={(e) =>
          setAvatar(
            e.target.files[0]
          )
        }
      />

      <textarea
        placeholder="Bio"
        className="w-full border p-3 mb-3"
        value={form.bio}
        onChange={(e) =>
          setForm({
            ...form,
            bio: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="College"
        className="w-full border p-3 mb-3"
        value={form.college}
        onChange={(e) =>
          setForm({
            ...form,
            college:
              e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Skills (comma separated)"
        className="w-full border p-3 mb-3"
        value={form.skills}
        onChange={(e) =>
          setForm({
            ...form,
            skills:
              e.target.value,
          })
        }
      />

<input
  type="text"  className="w-full border p-3 mb-3"
  placeholder="github.com/yash-sisodiaa"
  value={form.github}
  onChange={(e) =>
    setForm({
      ...form,
      github: e.target.value,
    })
  }
/>


<input
  type="text" className="w-full border p-3 mb-3"
  placeholder="linkedin.com/in/yash-sisodia"
  value={form.linkedin}
  onChange={(e) =>
    setForm({
      ...form,
      linkedin: e.target.value,
    })
  }
/>
      <input
        type="text"
        placeholder="Experience"
        className="w-full border p-3 mb-3"
        value={form.experience}
        onChange={(e) =>
          setForm({
            ...form,
            experience:
              e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Location"
        className="w-full border p-3 mb-3"
        value={form.location}
        onChange={(e) =>
          setForm({
            ...form,
            location:
              e.target.value,
          })
        }
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Profile
      </button>
    </form>
  );
};

export default ProfileForm;