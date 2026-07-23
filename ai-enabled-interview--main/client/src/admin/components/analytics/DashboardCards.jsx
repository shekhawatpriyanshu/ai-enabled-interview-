import React from "react";

import StatsCard from "./StatsCard";

const DashboardCards = ({ dashboard }) => {
  if (!dashboard) return null;

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
      <StatsCard
        title="Users"
        value={dashboard.users.totalUsers}
      />

      <StatsCard
        title="Interviews"
        value={
          dashboard.interviews.totalInterviews
        }
      />

      <StatsCard
        title="Tests"
        value={dashboard.tests.totalTests}
      />

      <StatsCard
        title="Coding Problems"
        value={
          dashboard.coding.totalCodingProblems
        }
      />

      <StatsCard
        title="Coding Submissions"
        value={
          dashboard.coding.codingSubmissions
        }
      />

      <StatsCard
        title="Accepted"
        value={
          dashboard.coding.acceptedCoding
        }
      />

      <StatsCard
        title="Contests"
        value={
          dashboard.contests.totalContests
        }
      />

      <StatsCard
        title="Participants"
        value={
          dashboard.contests
            .contestParticipants
        }
      />

      <StatsCard
        title="Discussions"
        value={
          dashboard.community
            .totalDiscussions
        }
      />

      <StatsCard
        title="Comments"
        value={
          dashboard.community.totalComments
        }
      />

      <StatsCard
        title="Resume Uploads"
        value={
          dashboard.resumes
            .totalResumeUploads
        }
      />
    </div>
  );
};

export default DashboardCards;