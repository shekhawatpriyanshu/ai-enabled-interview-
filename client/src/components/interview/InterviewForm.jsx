import { useState } from "react";

const InterviewForm = ({
  onSubmit,
  loading,
}) => {
  const [role, setRole] =
    useState("Java");

  const [
    experienceLevel,
    setExperienceLevel,
  ] = useState("Fresher");

  const submitHandler = (
    e
  ) => {
    e.preventDefault();

    onSubmit({
      role,
      experienceLevel,
    });
  };

  return (
    <form
      onSubmit={
        submitHandler
      }
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 font-mono text-black">
          Target Role
        </label>

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
          className="w-full border  rounded-xl p-4"
        >
          <option>
            Java
          </option>

          <option>
            React
          </option>

          <option>
            Node.js
          </option>

          <option>
            Sql
          </option>

          <option>
            Spring Boot
          </option>

          <option>
            Aws
          </option>
           <option>
            PHP
          </option>

          <option>
            Python
          </option>

          <option>
            C
          </option>

          <option>
            C++
          </option>

          <option>
          Salesforce
          </option>

          <option>
            QA Engineer
          </option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-mono text-black">
          Experience Level
        </label>

        <select
          value={
            experienceLevel
          }
          onChange={(e) =>
            setExperienceLevel(
              e.target.value
            )
          }
          className="w-full border rounded-xl p-4"
        >
          <option>
            Fresher
          </option>

          <option>
            Junior
          </option>

          <option>
            Mid
          </option>

          <option>
            Senior
          </option>
        </select>
      </div>

      <button
        disabled={loading}
        className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        {loading
          ? "Generating Questions..."
          : "Start Interview"}
      </button>
    </form>
  );
};

export default InterviewForm;