import React from 'react';
import { Link } from 'react-router-dom';

const BaseballTeamDrills = () => {
  // Example data - in a real app, this might come from an API or markdown files
  const teamDrills = [
    {
      name: 'Relay Race',
      description: 'Teams compete to relay a ball from outfield to infield to home plate, emphasizing quick transfers and accurate throws.',
      setup: 'Split team into two lines: one in outfield, one in infield. First outfielder fields a ball, throws to first infielder, who relays to second infielder, then to catcher at home.',
      variations: [
        'Add a tag at each base for extra challenge',
        'Use different types of hits (ground balls, fly balls)',
        'Time each team and compete for best time'
      ]
    },
    {
      name: 'Situational Defense',
      description: 'Coach hits balls to different spots with runners on base; players must make the correct play based on the situation.',
      setup: 'Place runners on various bases. Coach hits fungoes and calls out the situation (e.g., "Runner on first, less than two outs"). Players react accordingly.',
      variations: [
        'Start with no runners, then add runners',
        'Include bunt defense situations',
        'Add score and inning context for game-like pressure'
      ]
    },
    {
      name: 'Pitcher Fielding Practice (PFP)',
      description: 'Pitchers practice fielding bunts, comebacks, and covering bases after pitching.',
      setup: 'Pitchers take turns pitching from mound, then immediately field a bunted ball or comebacker and make the appropriate throw.',
      variations: [
        'Include covering first base on ground balls to the right',
        'Practice fielding bunts to third and first base',
        'Add comebacker with runner stealing second'
      ]
    },
    {
      name: 'Outfield Communication',
      description: 'Outfielders practice calling for fly balls and backing each other up.',
      setup: 'Two outfielders start at their positions. Coach hits fly balls between them, forcing communication and backup.',
      variations: [
        'Add sun or wind factors (imaginary)',
        'Include fence awareness drills',
        'Add runner tagging up on fly balls'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">👥 Team Drills</h2>
      <p className="text-slate-400">
        Full-team exercises that work on communication, situational play, and conditioning.
      </p>
      {teamDrills.map((drill) => (
        <div key={drill.name} className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{drill.name}</h3>
          <div className="space-y-4">
            <p className="text-slate-400"><strong>Description:</strong> {drill.description}</p>
            <p className="text-slate-400"><strong>Setup:</strong> {drill.setup}</p>
            {drill.variations && (
              <div className="mt-4">
                <p className="font-medium text-slate-300">Variations:</p>
                <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1">
                  {drill.variations.map((variation, index) => (
                    <li key={index}>{variation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="mt-8 text-center">
        <Link to="/baseball" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          ← Back to Baseball
        </Link>
      </div>
    </div>
  );
};

export default BaseballTeamDrills;