import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, UserCheck, Flag, Inbox, Trophy, HelpCircle } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';

/**
 * Helper to get status color
 */
const getStatusTheme = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)', accent: '#10B981' };
    case 'active': return { color: '#4F46E5', bg: 'rgba(79, 70, 229, 0.2)', accent: '#818CF8' };
    default: return { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.2)', accent: '#94A3B8' };
  }
};

/**
 * ProcessDetails component displaying the election timeline.
 * Dynamically fetches phases from Firestore for improved scalability.
 */
const ProcessDetails = () => {
  const { data: phases, loading, error } = useFirestoreCollection('election_phases', 'id');

  const getIcon = (id) => {
    const icons = {
      "1": <UserCheck size={24} />,
      "2": <Flag size={24} />,
      "3": <Calendar size={24} />,
      "4": <Inbox size={24} />,
      "5": <Trophy size={24} />
    };
    return icons[id] || <HelpCircle size={24} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12" aria-live="polite">
        <div className="text-gradient animate-pulse" style={{ fontSize: '1.25rem' }}>Loading process details...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" role="main">
      <header className="text-center mb-8">
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Election Process Guide</h1>
        <p className="text-muted">A step-by-step breakdown of how elections work in our democracy.</p>
      </header>

      <div className="timeline" role="list">
        {phases.map((phase, index) => {
          const theme = getStatusTheme(phase.status);
          return (
            <section 
              key={phase.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              role="listitem"
              aria-label={`Phase ${index + 1}: ${phase.title}, Status: ${phase.status}`}
            >
              <div className="card glass-panel timeline-content">
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ 
                    color: theme.color,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '8px',
                    borderRadius: '50%'
                  }} aria-hidden="true">
                    {getIcon(phase.id)}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    color: phase.status === 'upcoming' ? 'var(--text-muted)' : 'white',
                    fontWeight: 600
                  }}>
                    {phase.title}
                  </h3>
                </div>
                <p className="text-muted mb-3">{phase.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ fontWeight: 500, color: '#A5B4FC' }} aria-label={`Scheduled for ${phase.date}`}>
                    {phase.date}
                  </span>
                  <span style={{ 
                    textTransform: 'uppercase', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: theme.bg,
                    color: theme.accent,
                    letterSpacing: '0.05em'
                  }}>
                    {phase.status}
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessDetails;
