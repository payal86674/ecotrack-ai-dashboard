"use client";

import { useState } from "react";

interface ActivityLogItem {
  id: string;
  activity: string;
  score: number;
  impact: string;
  tip?: string;
  date: string;
}

export default function Home() {
  const [activityInput, setActivityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Default overall Carbon Score
  const [carbonScore, setCarbonScore] = useState(84);

  // Activity Log List State
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([
    {
      id: "1",
      activity: "Used public transit for morning commute",
      score: 88,
      impact: "Saved approx. 2.1 kg of CO2 compared to driving alone.",
      date: "Yesterday",
    },
    {
      id: "2",
      activity: "Reused water bottle and skipped single-use plastic",
      score: 82,
      impact: "Prevented plastic waste accumulation.",
      date: "2 days ago",
    },
  ]);

  // Handle Calculate Impact button submission
  const handleCalculateImpact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityInput.trim()) {
      setErrorMessage("Please enter an activity first.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // Send request to your Next.js API route
      const response = await fetch("/api/analyze-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity: activityInput }),
      });

      if (!response.ok) {
        throw new Error("API route responded with an error");
      }

      const data = await response.json();

      // Extracted values from API or fallback defaults
      const calculatedScore = data.score || Math.floor(Math.random() * 20) + 75;
      const calculatedImpact =
        data.impact || "Great eco-friendly action! Every small choice helps reduce overall emissions.";

      const newLogItem: ActivityLogItem = {
        id: Date.now().toString(),
        activity: activityInput,
        score: calculatedScore,
        impact: calculatedImpact,
        tip: data.tip,
        date: "Today",
      };

      // Add new log entry to top of list
      setActivityLogs((prev) => [newLogItem, ...prev]);

      // Update global carbon score dynamically
      setCarbonScore(calculatedScore);

      // Reset text input field
      setActivityInput("");
    } catch (error) {
      console.error("Error analyzing activity:", error);
      setErrorMessage("Failed to analyze activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Today
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Good morning, Jordan.
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Make a small change today. See the impact add up.
            </p>
          </div>

          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            12 day logging streak
          </div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Input Form */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
                +
              </div>
              <h2 className="text-xl font-bold text-slate-900">Log a daily activity</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Tell us what you did and we'll estimate its footprint.
              </p>

              <form onSubmit={handleCalculateImpact} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    What did you do today?
                  </label>
                  <input
                    type="text"
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    placeholder="e.g. plant based lunch, rode bike to work..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-2xl transition shadow-md disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Calculate impact"}
                </button>

                {errorMessage && (
                  <p className="text-red-500 text-sm font-medium mt-2">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Card 2: AI Impact Summary */}
          <div className="bg-emerald-950 text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                ✦ AI impact summary
              </span>
              <span className="bg-emerald-900/60 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                Updated now
              </span>
            </div>

            <div className="flex items-center gap-6 my-4">
              {/* Score Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center border-4 border-emerald-500 rounded-full text-center shrink-0">
                <div>
                  <span className="text-3xl font-extrabold block leading-none">{carbonScore}</span>
                  <span className="text-[10px] text-emerald-300 uppercase font-bold">of 100</span>
                </div>
              </div>

              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase">Your carbon score</span>
                <h3 className="text-2xl font-bold">Excellent</h3>
                <p className="text-emerald-200/80 text-xs mt-1">
                  You're 18% better than the average this week.
                </p>
              </div>
            </div>

            <div className="border-t border-emerald-900/80 pt-4 mt-4">
              <span className="text-emerald-400 text-xs font-bold uppercase block mb-1">
                One thing to try
              </span>
              <p className="text-emerald-100 text-sm">
                Switching 1 car trip to public transit this week will boost your score by 4 points.
              </p>
            </div>
          </div>

        </div>

        {/* Activity Log List Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Activity Log</h2>

          {activityLogs.length === 0 ? (
            <p className="text-slate-400 text-sm">No activities logged yet.</p>
          ) : (
            <div className="space-y-4">
              {activityLogs.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-4 transition hover:bg-slate-100/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800 text-base">
                        {item.activity}
                      </h4>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">{item.impact}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-medium text-slate-400">Score Impact</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                      +{item.score} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}