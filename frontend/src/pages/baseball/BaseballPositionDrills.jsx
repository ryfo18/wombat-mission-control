import React from 'react';
import { Link } from 'react-router-dom';

const BaseballPositionDrills = () => {
  // Example data - in a real app, this might come from an API or markdown files
  const positionDrills = [
    {
      position: 'Pitcher',
      drills: [
        {
          name: 'Target Practice',
          description: 'Set up targets in the strike zone. Pitcher aims to hit each target with different pitch types.',
          videoUrl: 'https://www.youtube.com/watch?v=example1'
        },
        {
          name: 'Long Toss',
          description: 'Gradually increase distance to build arm strength and accuracy.',
          videoUrl: 'https://www.youtube.com/watch?v=example2'
        }
      ]
    },
    {
      position: 'Catcher',
      drills: [
        {
          name: 'Blocking Drill',
          description: 'Coach throws balls in the dirt; catcher practices blocking and quickly recovering.',
          videoUrl: 'https://www.youtube.com/watch?v=example3'
        },
        {
          name: 'Pop Time',
          description: 'Practice quick transfers from catch to throw to second base.',
          videoUrl: 'https://www.youtube.com/watch?v=example4'
        }
      ]
    },
    {
      position: 'Infield',
      drills: [
        {
          name: 'Funneling Drill',
          description: 'Practice the funnel technique: Form, Find, Funnel on routine ground balls.',
          videoUrl: 'https://www.youthbaseballedge.com/one-tip-will-elevate-infielder/'
        },
        {
          name: 'Short Hop Showdown',
          description: 'Field short hops with soft hands, stay low and athletic.',
          videoUrl: 'https://www.youtube.com/watch?v=example5'
        }
      ]
    },
    {
      position: 'Outfield',
      drills: [
        {
          name: 'Drop Step Drill',
          description: 'Practice drop steps for fly balls hit over the head.',
          videoUrl: 'https://www.youtube.com/watch?v=example6'
        },
        {
          name: 'Crow Hop',
          description: 'Learn to transfer momentum into a strong throw after catching a fly ball.',
          videoUrl: 'https://www.youtube.com/watch?v=example7'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">⚾️ Position Drills</h2>
      <p className="text-slate-400">
        Drills for each position to develop specific skills. Click on a drill for more details.
      </p>
      {positionDrills.map((position) => (
        <div key={position.position} className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{position.position}</h3>
          <div className="space-y-4">
            {position.drills.map((drill) => (
              <div key={drill.name} className="flex flex-col sm:flex-row sm:items-start sm:justify-between bg-slate-700/50 p-4 rounded-md">
                <div>
                  <h4 className="font-medium">{drill.name}</h4>
                  <p className="text-slate-400 text-sm">{drill.description}</p>
                </div>
                {drill.videoUrl && (
                  <a
                    href={drill.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-0 inline-block px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Watch Video
                  </a>
                )}
              </div>
            ))}
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

export default BaseballPositionDrills;