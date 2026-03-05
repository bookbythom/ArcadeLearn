import { useState, useEffect } from 'react';
import { adminAPI } from '@/app/utils/api';

// Rozhranie pre pouzivatela
interface User {
  userId: string;
  email: string;
  name: string;
  level: number;
  totalXP: number;
  streak: number;
  isAdmin: boolean;
  createdAt: string;
}

// Rozhranie pre vlastnosti admin panelu
interface AdminPanelProps {
  accessToken: string;
  currentUserId: string;
  onSelfReset?: () => void;
}

// Rozhranie pre modal zmeny statusu
interface StatusModal {
  show: boolean;
  user: User | null;
}

// Rozhranie pre modal potvrdenia vymazania
interface DeleteModal {
  show: boolean;
  user: User | null;
}

// Rozhranie pre modal potvrdenia resetu
interface ResetModal {
  show: boolean;
  user: User | null;
}

// Komponent pre admin panel
export default function AdminPanel(props: AdminPanelProps) {
  // State premenne
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusModal, setStatusModal] = useState<StatusModal>({ show: false, user: null });
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ show: false, user: null });
  const [resetModal, setResetModal] = useState<ResetModal>({ show: false, user: null });

  // ==================== NACITANIE DAT ====================

  // Effect pre nacitanie dat
  useEffect(() => {
    loadUsersFromServer();
  }, []);

  // Funkcia pre nacitanie pouzivatelov
  const loadUsersFromServer = async () => {
    try {
      setIsLoading(true);
      const usersData = await adminAPI.getAllUsers(props.accessToken);
      setUsersList(usersData);
      setErrorMessage('');
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setErrorMessage(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcia pre prepnutie admin statusu pouzivatela
  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.setAdminStatus(props.accessToken, userId, !currentStatus);
      setStatusModal({ show: false, user: null });
      await loadUsersFromServer();
    } catch (err: any) {
      console.error('Failed to toggle admin status:', err);
      alert(err.message || 'Failed to update admin status');
    }
  };

  // Funkcia pre vymazanie pouzivatela
  const deleteUserFromDatabase = async (userId: string) => {
    try {
      await adminAPI.deleteUser(props.accessToken, userId);
      setDeleteModal({ show: false, user: null });
      await loadUsersFromServer();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  // Funkcia pre reset pouzivatela
  const resetUserData = async (userId: string) => {
    try {
      await adminAPI.resetUserData(props.accessToken, userId);
      setResetModal({ show: false, user: null });
      await loadUsersFromServer();
      if (userId === props.currentUserId && props.onSelfReset) {
        props.onSelfReset();
      }
    } catch (err: any) {
      console.error('Failed to reset user:', err);
      alert(err.message || 'Failed to reset user');
    }
  };

  // ==================== RENDER ====================

  // Zobrazenie stavu nacitavania
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  // Zobrazenie error stavu
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Sekcia spravy pouzivatelov */}
      <div className="bg-[#2a2a2c] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <div className="text-[#b6b6b6] text-sm">
            Total Users: <span className="text-white font-semibold">{usersList.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3a3a3c]">
                <th className="text-left py-3 px-4 text-[#b6b6b6] font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-[#b6b6b6] font-semibold">Name</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Level</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Total XP</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Streak</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Status</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Joined</th>
                <th className="text-center py-3 px-4 text-[#b6b6b6] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr 
                  key={user.userId} 
                  className="border-b border-[#3a3a3c] hover:bg-[#3a3a3c] transition-colors"
                >
                  <td className="py-4 px-4 text-white">
                    {user.email}
                  </td>
                  <td className="py-4 px-4 text-white">
                    {user.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block bg-[#4cb025] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {user.level ?? 0}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-white font-medium">
                    {user.totalXP ?? 0}
                  </td>
                  <td className="py-4 px-4 text-center text-[#ff9505] font-medium">
                    {user.streak ?? 0}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setStatusModal({ show: true, user: user })}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        user.isAdmin
                          ? 'bg-[#4cb025] text-white hover:bg-[#5cc030]'
                          : 'bg-[#4a4a4c] text-[#b6b6b6] hover:bg-[#5a5a5c]'
                      }`}
                      title="Click to change status"
                    >
                      {user.isAdmin ? 'Admin' : 'User'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center text-[#b6b6b6] text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setResetModal({ show: true, user: user })}
                        className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#ff9505] text-white hover:bg-[#ffa533]"
                        title="Reset user data"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, user: user })}
                        className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer bg-red-600 text-white hover:bg-red-700"
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usersList.length === 0 && (
          <div className="text-center py-12 text-[#b6b6b6]">
            No users found
          </div>
        )}
      </div>

      {/* Modal zmeny statusu */}
      {statusModal.show && statusModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2a2a2c] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Change User Status</h2>
            <p className="text-[#b6b6b6] mb-6">
              Select the new status for <span className="text-white font-semibold">{statusModal.user.email}</span>
            </p>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => toggleAdminStatus(statusModal.user!.userId, true)}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 bg-[#4a4a4c] text-[#b6b6b6] hover:bg-[#5a5a5c] border-2 border-transparent hover:border-[#b6b6b6]"
              >
                User
              </button>
              <button
                onClick={() => toggleAdminStatus(statusModal.user!.userId, false)}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 bg-[#4cb025] text-white hover:bg-[#5cc030] border-2 border-transparent hover:border-[#5cc030]"
              >
                Admin
              </button>
            </div>

            <button
              onClick={() => setStatusModal({ show: false, user: null })}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Potvrdzovaci modal vymazania */}
      {deleteModal.show && deleteModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2a2a2c] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Delete User</h2>
            <p className="text-[#b6b6b6] mb-2">
              Are you sure you want to delete this user?
            </p>
            <p className="text-white font-semibold mb-6">
              {deleteModal.user.email}
            </p>
            <p className="text-red-400 text-sm mb-6">
              WARNING: This action cannot be undone. All user data including progress, islands, and streak will be permanently deleted.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUserFromDatabase(deleteModal.user!.userId)}
                className="flex-1 py-3 px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Potvrdzovaci modal resetu */}
      {resetModal.show && resetModal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2a2a2c] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Reset User</h2>
            <p className="text-[#b6b6b6] mb-2">
              Are you sure you want to reset this user?
            </p>
            <p className="text-white font-semibold mb-6">
              {resetModal.user.email}
            </p>
            <p className="text-red-400 text-sm mb-6">
              WARNING: This action cannot be undone. All user data including progress, islands, and streak will be reset.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setResetModal({ show: false, user: null })}
                className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]"
              >
                Cancel
              </button>
              <button
                onClick={() => resetUserData(resetModal.user!.userId)}
                className="flex-1 py-3 px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 bg-red-600 text-white hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}