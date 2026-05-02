import React from 'react';
import { Calendar, UserCheck, Flag, Inbox, Trophy } from 'lucide-react';

const phases = [
  { id: 1, title: 'Voter Registration', icon: <UserCheck size={24} />, description: 'Citizens register to vote. Verification of eligibility.', date: 'Jan 1 - Feb 28', status: 'completed' },
  { id: 2, title: 'Candidate Nomination', icon: <Flag size={24} />, description: 'Candidates file their nomination papers.', date: 'Mar 1 - Mar 15', status: 'completed' },
  { id: 3, title: 'Campaigning', icon: <Calendar size={24} />, description: 'Candidates campaign in their constituencies.', date: 'Mar 16 - Apr 15', status: 'active' },
  { id: 4, title: 'Voting Process', icon: <Inbox size={24} />, description: 'Registered voters cast their ballots.', date: 'Apr 20', status: 'upcoming' },
  { id: 5, title: 'Result Declaration', icon: <Trophy size={24} />, description: 'Votes are counted and winners are announced.', date: 'Apr 25', status: 'upcoming' },
];

const ProcessDetails = () => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Election Process Guide</h1>
        <p className="text-muted">A step-by-step breakdown of how elections work in our democracy.</p>
      </div>

      <div className="timeline">
        {phases.map((phase, index) => (
          <div key={phase.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="card glass-panel timeline-content">
              <div className="flex items-center gap-2 mb-2">
                <div style={{ 
                  color: phase.status === 'completed' ? '#10B981' : phase.status === 'active' ? '#4F46E5' : '#94A3B8',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '8px',
                  borderRadius: '50%'
                }}>
                  {phase.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: phase.status === 'upcoming' ? 'var(--text-muted)' : 'white' }}>{phase.title}</h3>
              </div>
              <p className="text-muted mb-2">{phase.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span style={{ fontWeight: 500, color: '#A5B4FC' }}>{phase.date}</span>
                <span style={{ 
                  textTransform: 'uppercase', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: phase.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : phase.status === 'active' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                  color: phase.status === 'completed' ? '#10B981' : phase.status === 'active' ? '#818CF8' : '#94A3B8'
                }}>
                  {phase.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessDetails;
