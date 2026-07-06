import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../redux/slices/authSlice";
import { clearProjects } from "../../redux/slices/projectSlice";
import { clearTasks } from "../../redux/slices/taskSlice";
import { socketDisconnected } from "../../redux/slices/socketSlice";
import socketService from "../../services/socket.service";
import storage from "../../utils/storage";

export default function Navbar({ onToggleSidebar }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.removeToken();
    socketService.disconnect();

    dispatch(clearProjects());
    dispatch(clearTasks());
    dispatch(socketDisconnected());
    dispatch(logout());

    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-md">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded bg-white/20 hover:bg-white/30"
        >
          Menu
        </button>

        <div className="flex flex-col">
          <span className="text-lg font-semibold">Project Management</span>
          <span className="text-xs opacity-90">Organize your team's work</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-white/15 rounded-full px-3 py-1">
          <svg
            className="w-4 h-4 mr-2 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            placeholder="Search projects, members..."
            className="bg-transparent placeholder-white/80 outline-none text-sm"
          />
        </div>

        <button type="button" className="p-2 rounded bg-white/20 hover:bg-white/30">
          Alerts
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm">
            {user ? user.firstName?.[0] || "U" : "U"}
          </div>
          <div className="hidden sm:block text-sm">
            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
