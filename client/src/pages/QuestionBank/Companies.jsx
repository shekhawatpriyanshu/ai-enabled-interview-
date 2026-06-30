import { useEffect, useState } from "react";
import {
  getCompanies,
} from "../../services/QuestionService";

import MainLayout from "../../layouts/MainLayout";
import CompanyCard from "../../components/QuestionBank/CompanyCard";
import LoadingSkeleton from "../../components/QuestionBank/LoadingSkeleton";
import EmptyState from "../../components/QuestionBank/EmptyState";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await getCompanies();

      setCompanies(res.companies || []);
    } catch (error) {
      console.log("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton type="card" rows={8} />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Question Bank - Companies
        </h1>

        {/* Empty State */}
        {companies.length === 0 ? (
          <EmptyState
            title="No Companies Found"
            description="Start by adding companies like Google, Amazon, etc."
            buttonText="Add Company"
            buttonLink="/question-bank/company/create"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
              />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Companies;