import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";
import Card from "../components/Card";
import Button from "../components/Button";

const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      addToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-in">
      <div className="flex items-center mb-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1 shadow-lg shadow-violet-500/30 mr-6">
          <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center text-3xl font-bold text-white uppercase tracking-widest backdrop-blur-sm">
             {profile?.name?.charAt(0) || user?.name?.charAt(0) || "U"}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">My Dashboard</h1>
          <p className="text-gray-400 font-medium">Manage your premium profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-white/5 hover:border-violet-500/30 transition-colors bg-[#111111]/80">
          <Card.Header className="border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Personal Details
            </h2>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Full Name</label>
              <p className="font-semibold text-gray-200 text-lg">{profile?.name || user?.name || "N/A"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Email Address</label>
              <p className="font-semibold text-gray-200 text-lg break-all">{profile?.email || user?.email || "N/A"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Phone Number</label>
              <p className="font-semibold text-gray-200 text-lg">{profile?.phone || "Not provided"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Home Address</label>
              <p className="font-semibold text-gray-200 text-lg">{profile?.address || "Not provided"}</p>
            </div>
          </Card.Body>
        </Card>

        <Card className="border border-white/5 hover:border-fuchsia-500/30 transition-colors bg-[#111111]/80 flex flex-col h-full">
          <Card.Header className="border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-3 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Security Data
            </h2>
          </Card.Header>
          <Card.Body className="space-y-6 flex-1">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Authorization Role</label>
              <div className="flex items-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                 <p className="font-bold text-gray-200 uppercase tracking-widest">{profile?.role || user?.role || "N/A"}</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Member Since</label>
              <p className="font-semibold text-gray-200 text-lg">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
              </p>
            </div>
          </Card.Body>
          <Card.Footer className="border-t border-white/5">
            <Button className="w-full">
              Update Preferences
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
