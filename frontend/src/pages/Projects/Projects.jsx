import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject as createProjectThunk,
  deleteProjectById,
  updateProjectById,
} from "../../redux/thunks/projectThunks";
import Button from "../../components/common/Button";
import ProjectCard from "../../components/projects/ProjectCard";
import Modal from "../../components/common/Modal";
import ProjectForm from "../../components/projects/ProjectForm";
import DeleteModal from "../../components/common/DeleteModal";

export default function Projects() {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((s) => s.projects);
  const user = useSelector((s) => s.auth.user);
  const role = user?.role;
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (payload) => {
    await dispatch(createProjectThunk(payload));
    setShowCreate(false);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteProjectById(id));
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-sm text-gray-500">All projects you're a member of or own</p>
        </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <input placeholder="Search projects" className="w-full sm:w-64 rounded-md border px-3 py-2" />
          </div>
          {role !== "Member" && (
            <Button onClick={() => setShowCreate(true)}>Create Project</Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg">No Projects Yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p._id} project={p} onDelete={(id) => { setDeleteProjectId(id); setShowDelete(true); }} onEdit={(proj) => setEditProject(proj)} />
        ))}
      </div>

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <h3 className="text-lg font-semibold mb-2">Create Project</h3>
          <ProjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editProject && (
        <Modal onClose={() => setEditProject(null)}>
          <h3 className="text-lg font-semibold mb-2">Edit Project</h3>
          <ProjectForm initialValues={editProject} onSubmit={async (values) => { await dispatch(updateProjectById(editProject._id, values)); setEditProject(null); }} onCancel={() => setEditProject(null)} />
        </Modal>
      )}

      {showDelete && (
        <DeleteModal
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onCancel={() => { setShowDelete(false); setDeleteProjectId(null); }}
          onConfirm={async () => { await dispatch(deleteProjectById(deleteProjectId)); setShowDelete(false); setDeleteProjectId(null); }}
        />
      )}
    </div>
  );
}
 
