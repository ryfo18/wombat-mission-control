import React from 'react';
import { Link } from 'react-router-dom';

const Baseball = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">⚾️ Baseball Coaching</h2>
      <p className="text-slate-400">
        Welcome to the Baseball section of Mission Control. Here you'll find position-specific drills,
        full-team exercises, and sample practice plans to help you run effective, fun practices for your
        12‑year‑old team.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg">Position Drills</h3>
          <p className="text-slate-400 mb-4">
            Drills tailored to each position: pitcher, catcher, infield, outfield.
          </p>
          <Link to="/baseball/position-drills" className="w-full inline-block px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700">
            View Position Drills
          </Link>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg">Team Drills</h3>
          <p className="text-slate-400 mb-4">
            Full‑team exercises that work on communication, situational play, and conditioning.
          </p>
          <Link to="/baseball/team-drills" className="w-full inline-block px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700">
            View Team Drills
          </Link>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg">Practice Plans</h3>
          <p className="text-slate-400 mb-4">
            Sample practice plans you can mix and match to build your own schedule.
          </p>
          <Link to="/baseball/practice-plans" className="w-full inline-block px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700">
            View Practice Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Baseball;