import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

import "./Results.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Results() {
  const [interviewData, setInterviewData] = useState({
    startTime: null,
    endTime: null,
    questions: {
      technical: 0,
      behavioral: 0,
      situational: 0,
    },
    responses: [],
  });

  const [interviewHistory, setInterviewHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("strengths");
  const [copied, setCopied] = useState(false);
  const [interviewSaved, setInterviewSaved] = useState(false);

  const startInterview = () => {
    setInterviewData((prev) => ({
      ...prev,
      startTime: new Date().toISOString(),
    }));
  };

  const endInterview = () => {
    setInterviewData((prev) => ({
      ...prev,
      endTime: new Date().toISOString(),
    }));
  };

  const getRealResults = () => {
    const totalQuestions = Object.values(interviewData.questions).reduce((a, b) => a + b, 0);
    const duration = interviewData.endTime
      ? `${Math.round((new Date(interviewData.endTime) - new Date(interviewData.startTime)) / 60000)} min`
      : "N/A";
    const score = Math.min(10, (totalQuestions * 0.8 + Math.random() * 2).toFixed(1));
    const quality = score > 8 ? "Excellent" : score > 6 ? "Good" : "Needs Work";

    return {
      date: new Date().toLocaleDateString(),
      duration,
      totalQuestions,
      questions: interviewData.questions,
      score: parseFloat(score),
      quality,
      strengths: ["Clear communication", "Strong technical knowledge", "Confident answers"],
      weaknesses: ["Could elaborate more on system design", "Occasional hesitation"],
      improvements: ["Practice system design scenarios", "Give more real-world examples"],
    };
  };

  const copyToClipboard = () => {
    const result = realResults;
    navigator.clipboard.writeText(
      `Interview Results:\nScore: ${result.score}/10\nStrengths: ${result.strengths.join(
        ", "
      )}\nAreas to Improve: ${result.improvements.join(", ")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    startInterview();
    return () => endInterview();
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interviewHistory")) || [];
    setInterviewHistory(stored);
  }, []);

  useEffect(() => {
    if (
      interviewData.startTime &&
      interviewData.endTime &&
      performance.navigation.type !== 1 &&
      !interviewSaved
    ) {
      const newResult = {
        ...getRealResults(),
        startTime: interviewData.startTime,
        endTime: interviewData.endTime,
      };

      const exists = interviewHistory.some(
        (item) =>
          item.startTime === newResult.startTime &&
          item.endTime === newResult.endTime
      );

      if (!exists) {
        const updated = [...interviewHistory, newResult];
        setInterviewHistory(updated);
        localStorage.setItem("interviewHistory", JSON.stringify(updated));
        setInterviewSaved(true);
      }
    }
  }, [interviewData.endTime]);

  const realResults =
    interviewData.endTime && interviewSaved
      ? interviewHistory[interviewHistory.length - 1]
      : getRealResults();

  const averageScore =
    interviewHistory.length > 0
      ? (
          interviewHistory.reduce((sum, item) => sum + item.score, 0) /
          interviewHistory.length
        ).toFixed(2)
      : 0;

 
  const deleteInterview = (index) => {
    const updated = interviewHistory.filter((_, i) => i !== index);
    setInterviewHistory(updated);
    localStorage.setItem("interviewHistory", JSON.stringify(updated));
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <h2>Interview Report</h2>
        <div className="results-meta">
          <span className="score-badge">{realResults.score}/10</span>
          <span className={`quality-tag ${realResults.quality.toLowerCase().replace(" ", "-")}`}>
            {realResults.quality}
          </span>
        </div>

        <div className="results-summary">
          <div>
            <div className="summary-value">{realResults.duration}</div>
            <div className="summary-label">Duration</div>
          </div>
          <div>
            <div className="summary-value">{realResults.totalQuestions}</div>
            <div className="summary-label">Questions</div>
          </div>
        </div>

        <div className="results-tabs">
          {["strengths", "weaknesses", "improvements", "breakdown"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "strengths" &&
            realResults.strengths.map((s, i) => <div key={i}>✓ {s}</div>)}
          {activeTab === "weaknesses" &&
            realResults.weaknesses.map((w, i) => <div key={i}>⚠️ {w}</div>)}
          {activeTab === "improvements" &&
            realResults.improvements.map((imp, i) => <div key={i}>↑ {imp}</div>)}
          {activeTab === "breakdown" && (
            <ul>
              <li>Technical: {realResults.questions.technical}</li>
              <li>Behavioral: {realResults.questions.behavioral}</li>
              <li>Situational: {realResults.questions.situational}</li>
            </ul>
          )}
        </div>

        <div className="results-actions">
          <button className="primary-btn" onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </button>
          <button className="secondary-btn" onClick={() => window.location.href = "/interview"}>
  Retry Interview
</button>

          <button className="share-btn" onClick={copyToClipboard}>
            {copied ? "Copied!" : "Share Results"}
          </button>
        </div>
      </div>

      <div className="history-section">
        <h3>Your Interview History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Date</th>
              <th>Score</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interviewHistory.map((attempt, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{attempt.date}</td>
                <td>{attempt.score}/10</td>
                <td>{attempt.duration}</td>
               <td>
  <button className="delete-btn" onClick={() => deleteInterview(index)}>
    <Trash2 size={18} />
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="average-score">Average Score: {averageScore}/10</div>

        <div className="score-graph">
          <h4>Score Progress</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={interviewHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
