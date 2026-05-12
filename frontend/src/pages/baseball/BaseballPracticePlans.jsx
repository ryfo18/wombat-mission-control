import React from 'react';
import { Link } from 'react-router-dom';

const BaseballPracticePlans = () => {
  // Example data - in a real app, this might come from an API or markdown files
  const practicePlans = [
    {
      name: 'Fundamentals Focus (90 min)',
      description: 'A practice focused on building core fielding and throwing skills with fun competitions.',
      segments: [
        { time: '0-10 min', activity: 'Dynamic Warm-up', details: 'Jog, high knees, butt kicks, arm circles, ladder/shuffle drills.' },
        { time: '10-25 min', activity: 'Station Rotation', details: 'Three stations: Two Ball, Kneeling Catch, Short Hop Showdown (5 min each).' },
        { time: '25-35 min', activity: 'Water Break & Chat', details: 'Quick huddle: what felt good, what to tweak.' },
        { time: '35-55 min', activity: 'Beat the Ball Game', details: 'Team competition: fielders vs. runners to base.' },
        { time: '55-65 min', activity: 'Think Fast', details: 'Reaction drill: call Mine! and make the play.' },
        { time: '65-80 min', activity: 'Live Situational Defense', details: 'Fungoes with runners advancing; focus on communication and backups.' },
        { time: '80-90 min', activity: 'Cool-down & Fun Finish', details: 'Light stretch, end with Home Run Derby (soft toss) or team chant.' }
      ]
    },
    {
      name: 'Game Situations (120 min)',
      description: 'A longer practice that incorporates batting practice and situational defense.',
      segments: [
        { time: '0-15 min', activity: 'Warm-up & Throwing Progression', details: 'Partner throws from short to long distance.' },
        { time: '15-30 min', activity: 'Infield Drills', details: 'Funneling drill, backhand practice, double play feeds.' },
        { time: '30-45 min', activity: 'Outfield Drills', details: 'Drop step, crow hop, communication flies.' },
        { time: '45-55 min', activity: 'Water Break', details: 'Hydrate and quick talk.' },
        { time: '55-75 min', activity: 'Batting Practice', details: 'Rounds: opposite field, pull, situational hitting.' },
        { time: '75-90 min', activity: 'Situational Defense', details: 'Coach hits with runners on; practice cutoffs, relays, tag ups.' },
        { time: '90-105 min', activity: 'Scrimmage', details: 'Controlled game: coach pitches, focus on making plays.' },
        { time: '105-120 min', activity: 'Cool-down & Review', details: 'Stretch, review what worked, assign home practice.' }
      ]
    },
    {
      name: 'Pre-Game Warmup (30 min)',
      description: 'A quick, effective warmup before a game to get players ready and focused.',
      segments: [
        { time: '0-5 min', activity: 'Dynamic Stretch', details: 'Leg swings, arm circles, torso twists.' },
        { time: '5-12 min', activity: 'Throwing Progression', details: 'Partner throws: start close, back to long toss distance.' },
        { time: '12-20 min', activity: 'Fielding Drill', details: 'Short hop or roller drill to get hands ready.' },
        { time: '20-25 min', activity: 'Base Running', details: 'Lead-offs and shuffles off bases.' },
        { time: '25-30 min', activity: 'Mental Reps', details: 'Visualize situations: ground ball, fly ball, base hit.' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">🗓️ Practice Plans</h2>
      <p className="text-slate-400">
        Sample practice plans you can mix and match to build your own schedule.
      </p>
      {practicePlans.map((plan) => (
        <div key={plan.name} className="bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">{plan.name}</h3>
          <p className="text-slate-400 mb-4">{plan.description}</p>
          <div className="space-y-4">
            {plan.segments.map((segment) => (
              <div key={segment.time} className="flex flex-col sm:flex-row sm:items-start sm:justify-between bg-slate-700/50 p-3 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-slate-300">{segment.time}</p>
                  <p className="text-slate-400"><strong>{segment.activity}</strong>: {segment.details}</p>
                </div>
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

export default BaseballPracticePlans;