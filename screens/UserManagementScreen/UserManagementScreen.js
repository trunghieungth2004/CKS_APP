import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import {
  Text,
  Appbar,
  ActivityIndicator,
  Surface,
  Button,
  Dialog,
  Portal,
  TextInput,
  Searchbar,
  Snackbar,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../config/constants";

export default function UserManagementScreen() {
  const { paperTheme } = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editUsername, setEditUsername] = useState("");

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [message, setMessage] = useState("");

  const [createVisible, setCreateVisible] = useState(false);
const [newUser, setNewUser] = useState({
  email: "",
  password: "",
  username: "",
  role_id: 3,
  store_code: "",
  store_name: "",
});

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 0: return "Admin";
      case 1: return "CK Staff";
      case 2: return "Supply Staff";
      case 3: return "Manager";
      case 4: return "Store Staff";
      default: return "Unknown";
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await apiService.post(API_ENDPOINTS.USER.ALL, {});
      if (result.success && Array.isArray(result.data.data)) {
        setUsers(result.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const result = await apiService.post("/api/user/one", { userId });
      if (result.success) {
        setSelectedUser(result.data.data);
        setEditUsername(result.data.data.username || "");
        setDialogVisible(true);
      }
    } catch (err) {
      setMessage("Error loading user");
    }
  };

  const handleCreateUser = async () => {
  try {
    const result = await apiService.post(
      API_ENDPOINTS.USER.CREATE,
      newUser
    );

    console.log("CREATE RESULT:", result);

    if (result.statusCode === 201) {
      setMessage("User created successfully");

      loadUsers();

      setNewUser({
        email: "",
        password: "",
        username: "",
        role_id: 3,
        store_code: "",
        store_name: "",
      });
    } else {
      setMessage(result.message || "Create failed");
    }
  } catch (error) {
    console.error("CREATE ERROR:", error);
    setMessage("Error creating user");
  } finally {
    setCreateVisible(false);
  }
};

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const result = await apiService.put("/api/user", {
        userId: selectedUser.user_id,
        username: editUsername,
        email: selectedUser.email,
      });

      if (result.success) {
        setMessage("User updated successfully");
        loadUsers();
      } else {
        setMessage(result.message || "Update failed");
      }
    } catch {
      setMessage("Error updating user");
    } finally {
      setDialogVisible(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const result = await apiService.delete("/api/user/users", {
        userId: selectedUser.user_id,
      });

      if (result.success) {
        setMessage("User deleted successfully");
        loadUsers();
        setSelectedUser(null);
      } else {
        setMessage(result.message || "Delete failed");
      }
    } catch {
      setMessage("Error deleting user");
    } finally {
      setDialogVisible(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.username || "";
    const email = user.email || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />

      <Appbar.Header>
        <Appbar.Content title="User Management" />
      </Appbar.Header>

      <Button
        mode="contained"
        style={{ margin: 16 }}
        onPress={() => setCreateVisible(true)}
      >
        Create User
      </Button>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.user_id}
              onPress={() => handleViewUser(user.user_id)}
            >
              <Surface style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>
                  {user.username || user.email}
                </Text>
                <Text>{user.email}</Text>
                <Text>Role: {getRoleName(user.role_id)}</Text>
              </Surface>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Dialog Create */}
      <Portal>
        <Dialog visible={createVisible} onDismiss={() => setCreateVisible(false)}>
          <Dialog.Title>Create User</Dialog.Title>
         <Dialog.Content>
  <TextInput
    label="Email"
    value={newUser.email}
    onChangeText={(v) => setNewUser({ ...newUser, email: v })}
    style={{ marginBottom: 8 }}
  />

  <TextInput
    label="Password"
    value={newUser.password}
    secureTextEntry
    onChangeText={(v) => setNewUser({ ...newUser, password: v })}
    style={{ marginBottom: 8 }}
  />

  <TextInput
    label="Username"
    value={newUser.username}
    onChangeText={(v) => setNewUser({ ...newUser, username: v })}
    style={{ marginBottom: 8 }}
  />

  <TextInput
    label="Role ID"
    value={String(newUser.role_id)}
    keyboardType="numeric"
    onChangeText={(v) =>
      setNewUser({ ...newUser, role_id: Number(v) })
    }
    style={{ marginBottom: 8 }}
  />

  <TextInput
    label="Store Code"
    value={newUser.store_code}
    onChangeText={(v) => setNewUser({ ...newUser, store_code: v })}
    style={{ marginBottom: 8 }}
  />

  <TextInput
    label="Store Name"
    value={newUser.store_name}
    onChangeText={(v) => setNewUser({ ...newUser, store_name: v })}
  />
</Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCreateUser}>Create</Button>
            <Button onPress={() => setCreateVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog Detail */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>User Detail</Dialog.Title>
          <Dialog.Content>
            {selectedUser && (
              <>
                <Text>Email: {selectedUser.email}</Text>
                <TextInput
                  label="Username"
                  value={editUsername}
                  onChangeText={setEditUsername}
                />
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setConfirmAction("update"); setConfirmVisible(true); }}>
              Save
            </Button>
            <Button textColor="red"
              onPress={() => { setConfirmAction("delete"); setConfirmVisible(true); }}>
              Delete
            </Button>
            <Button onPress={() => setDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Confirm */}
      <Portal>
        <Dialog visible={confirmVisible} onDismiss={() => setConfirmVisible(false)}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Text>
              {confirmAction === "delete"
                ? "Are you sure delete?"
                : "Save changes?"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setConfirmVisible(false);
                confirmAction === "delete"
                  ? handleDeleteUser()
                  : handleUpdateUser();
              }}
            >
              Yes
            </Button>
            <Button onPress={() => setConfirmVisible(false)}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={!!message}
        onDismiss={() => setMessage("")}
        duration={3000}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 10 },
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});