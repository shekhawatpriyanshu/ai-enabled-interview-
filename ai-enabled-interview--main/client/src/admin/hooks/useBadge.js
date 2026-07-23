import { useState } from "react";
import toast from "react-hot-toast";
import BadgeService from "../services/BadgeService";

const useBadge = () => {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState([]);

  const getBadges = async () => {
    try {
      setLoading(true);
      const data = await BadgeService.getBadges();
      if (data.success) {
        setBadges(data.badges || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load badges.");
    } finally {
      setLoading(false);
    }
  };

  const createBadge = async (formData) => {
    try {
      setLoading(true);
      const data = await BadgeService.createBadge(formData);
      if (data.success) {
        toast.success(data.message || "Badge created successfully.");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create badge.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBadge = async (id, formData) => {
    try {
      setLoading(true);
      const data = await BadgeService.updateBadge(id, formData);
      if (data.success) {
        toast.success(data.message || "Badge updated successfully.");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update badge.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBadge = async (id) => {
    try {
      setLoading(true);
      const data = await BadgeService.deleteBadge(id);
      if (data.success) {
        toast.success(data.message || "Badge deleted successfully.");
        setBadges((prev) => prev.filter((b) => b._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete badge.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    badges,
    getBadges,
    createBadge,
    updateBadge,
    deleteBadge,
  };
};

export default useBadge;
