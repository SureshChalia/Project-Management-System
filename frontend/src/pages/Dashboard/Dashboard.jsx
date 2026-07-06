import React, { useMemo } from "react";
import StatCard from "../../components/common/StatCard";
import { FiUsers, FiLayers, FiArchive, FiFolder, FiActivity } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RecentActivity from "../../components/dashboard/RecentActivity";
import OnlineMembers from "../../components/dashboard/OnlineMembers";
import ProjectProgress from "../../components/dashboard/ProjectProgress";

export default function Dashboard() {
  const { projects, loading } = useSelector((s) => s.projects);

  const total = projects.length;
  const active = projects.filter((p) => p.status === "Active").length;
  const archived = projects.filter((p) => p.status === "Archived").length;

  const membersSet = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      (p.members || []).forEach((m) => set.add(m._id));
      if (p.owner) set.add(p.owner._id);
    });
    return set;
  }, [projects]);

  const totalMembers = membersSet.size;

  // Build activity list from project timestamps
  const activities = projects
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)
    .map((p) => ({
      actorInitials: p.owner ? `${p.owner.firstName?.[0] || ''}${p.owner.lastName?.[0] || ''}` : 'U',
      text: `${p.name} updated`,
      time: new Date(p.updatedAt).toLocaleString(),
    }));

  return (
    <div className="w-full min-w-0 grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <StatCard title="Total Projects" value={total} icon={<FiFolder />} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <StatCard title="Active Projects" value={active} icon={<FiLayers />} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <StatCard title="Archived Projects" value={archived} icon={<FiArchive />} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <StatCard title="Total Members" value={totalMembers} icon={<FiUsers />} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Link to="/projects" className="text-indigo-600">View all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
            {loading && <div className="col-span-full text-center py-8">Loading projects...</div>}
            {!loading && projects.slice(0, 6).map((p, idx) => (
              <ProjectProgress key={p._id} project={p} percent={Math.min(90, Math.floor((p.members?.length||0) * 10))} />
            ))}
            {!loading && projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="inline-block text-center">
                  <div className="w-32 h-32 mx-auto rounded-xl bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 text-4xl">📁</div>
                  <h3 className="mt-4 text-lg font-semibold">No Projects Yet</h3>
                  <p className="text-sm text-gray-500 mt-2">Create your first project to organize work and invite team members.</p>
                  <Link to="/projects" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded">Create Your First Project</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4 min-w-0">
          <RecentActivity activities={activities} />
          <OnlineMembers members={projects.flatMap(p => p.members || []).slice(0, 20)} />
        </div>
      </div>
  );
}