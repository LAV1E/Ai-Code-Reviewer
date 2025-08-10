import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import { motion } from "framer-motion";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
  const [review, setReview] = useState(``);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      const response = await axios.post('https://ai-code-reviewer-1-tpna.onrender.com/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      setReview("⚠️ Error fetching review. Check console.");
      console.error(err);
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <header className="p-4 text-center text-white text-2xl font-bold tracking-wide border-b border-gray-700 shadow-md">
        🚀 AI Code Reviewer By Anshika
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 p-4 gap-4 text-white overflow-hidden">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-gray-800/80 rounded-2xl relative shadow-lg backdrop-blur-md border border-gray-700 flex flex-col"
        >
          <div className="flex-1">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={16}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(34,197,94,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={reviewCode}
            className="m-4 px-6 py-2 bg-green-500 text-black font-semibold rounded-full shadow-md transition-all self-end"
          >
            Review
          </motion.button>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-gray-800/80 rounded-2xl p-4 shadow-lg overflow-auto backdrop-blur-md border border-gray-700"
        >
          <div className="prose prose-invert max-w-none">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review || "💡 Your review will appear here..."}
            </Markdown>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
