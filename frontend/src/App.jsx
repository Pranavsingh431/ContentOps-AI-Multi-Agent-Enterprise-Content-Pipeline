import React from "react";
import { useState } from "react";
import InputBox from "./components/InputBox";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [text, setText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetch(`${backendUrl}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await result.json();
      if (!result.ok) {
        setGeneratedContent("");
        setError(data?.detail || "Unable to process request.");
        return;
      }
      const content = data?.generated_content || data?.output || "";
      if (!content) {
        setGeneratedContent("");
        setError("No generated content was returned by the backend.");
        return;
      }

      setGeneratedContent(content);
    } catch {
      setGeneratedContent("");
      setError("Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Text Processor</h1>
        <InputBox
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && <p style={styles.error}>{error}</p>}

        {generatedContent && (
          <div style={styles.responseBox}>
            <h2 style={styles.responseTitle}>Generated Content</h2>
            <div style={styles.content}>{generatedContent}</div>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#f3f4f6",
    padding: "1.5rem",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    padding: "1.5rem",
    boxShadow: "0 10px 24px rgba(17, 24, 39, 0.06)",
  },
  title: {
    marginTop: 0,
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#111827",
  },
  responseBox: {
    marginTop: "1.25rem",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "1rem",
    display: "grid",
    gap: "0.5rem",
  },
  responseTitle: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#111827",
  },
  content: {
    margin: 0,
    color: "#374151",
    fontSize: "1rem",
    lineHeight: 1.7,
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "1rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  error: {
    marginTop: "1rem",
    marginBottom: 0,
    color: "#b91c1c",
    fontWeight: 500,
  },
};
