import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/auth.service";
import socketService from "../services/socket.service";
import { loginSuccess, setError, logout } from "../redux/slices/authSlice";
import storage from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../redux/thunks/projectThunks";
import Loader from "../components/common/Loader";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth.user);
  const [restoring, setRestoring] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const restore = async () => {
      if (!token) {
        setRestoring(false);
        return;
      }

      if (authUser) {
        setRestoring(false);
        return;
      }

      setRestoring(true);
      try {
        const res = await authService.me();
        if (res && res.success) {
          dispatch(loginSuccess({ user: res.data.user, token }));
          dispatch(fetchProjects());

          try {
            await socketService.connect(token);
          } catch (socketError) {
            console.warn("Socket restore failed:", socketError.message || socketError);
          }
        } else {
          dispatch(setError(res.message || "Failed to restore session"));
          storage.removeToken();
          dispatch(logout());
          navigate("/", { replace: true });
        }
      } catch (err) {
        dispatch(setError(err.message || "Failed to restore session"));
        storage.removeToken();
        dispatch(logout());
        navigate("/", { replace: true });
      } finally {
        if (active) setRestoring(false);
      }
    };

    restore();
    return () => {
      active = false;
    };
  }, [token, authUser, dispatch, navigate]);

  useEffect(() => {
    const connectSocket = async () => {
      if (!token || socketService.getIsConnected()) return;
      try {
        await socketService.connect(token);
      } catch (socketError) {
        console.warn("Socket reconnect failed:", socketError.message || socketError);
      }
    };

    connectSocket();
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}