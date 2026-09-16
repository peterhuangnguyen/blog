"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);

  // Hàm login gọi API /api/login
  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      alert("Sai username hoặc password");
    }
  };

  useEffect(() => {
    if (authenticated) {
      const fetchPosts = async () => {
        try {
          const res = await fetch("/api/posts");
          if (!res.ok) {
            console.error("API error", res.status);
            return;
          }
          const data = await res.json();
          setPosts(data.posts || []);
        } catch (err) {
          console.error("Failed to fetch posts", err);
        }
      };
      fetchPosts();
    }
  }, [authenticated]);

  const handleCreate = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    alert(`Bài viết "${title}" đã được tạo!`);
    const updated = await fetch("/api/posts").then((res) => res.json());
    setPosts(updated.posts);
    setTitle("");
    setContent("");
  };

  const handleEdit = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) {
        alert("Không tìm thấy bài viết!");
        return;
      }
      const data = await res.json();
      setSlug(slug);
      setContent(data.content);
      setEditing(true);
    } catch (err) {
      console.error("Lỗi khi fetch bài viết:", err);
    }
  };

  const handleUpdate = async () => {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, content }),
    });
    alert(`Bài viết "${slug}" đã được cập nhật!`);
    setEditing(false);
    setSlug("");
    setContent("");
    const updated = await fetch("/api/posts").then((res) => res.json());
    setPosts(updated.posts);
  };

  if (!authenticated) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập Admin</h1>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Login
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Admin - Quản lý bài viết
      </h1>

      <section className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>
        <div className="flex flex-col gap-4">
          {!editing && (
            <input
              className="border rounded-md p-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
          <textarea
            className="border rounded-md p-2 h-40"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {editing ? (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Cập nhật bài viết
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Tạo bài viết
            </button>
          )}
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách bài viết</h2>
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post} className="flex justify-between items-center py-3">
              <span className="font-medium">{post}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post.replace(".md", ""))}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Sửa
                </button>
                <button
                  onClick={() => console.log("Delete logic")}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
