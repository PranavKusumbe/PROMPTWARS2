import React, { useState, useEffect } from 'react';
import { MapPin, Inbox, BarChart3, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Dashboard = ({ user }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));
        const candidatesData = [];
        querySnapshot.forEach((doc) => {
          candidatesData.push({ id: doc.id, ...doc.data() });
        });
        setCandidates(candidatesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVote = (candidateId) => {
    if (window.confirm('Are you sure you want to cast your vote for this candidate? This action cannot be undone.')) {
      setHasVoted(true);
      alert('Your vote has been securely recorded!');
    }
  };

  return (
    <div className="animate-fade-in" role="main">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4" style={{ textAlign: 'left' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Welcome, {user.displayName}</h1>
          <p className="text-muted flex items-center gap-2 mt-1" aria-label="Constituency: Pune Central">
            <MapPin size={16} aria-hidden="true" />
            Constituency: Pune Central (Demo)
          </p>
        </div>
        <div className="card glass-panel flex items-center gap-2" style={{ padding: '0.75rem 1rem' }} aria-label="Current Election Phase">
          <AlertCircle size={20} className="text-primary" aria-hidden="true" />
          <span style={{ fontWeight: 500 }}>Phase 3: Campaigning</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Voting Section */}
        <section className="card glass-panel" aria-labelledby="voting-section-title">
          <div className="flex items-center gap-2 mb-2 border-b" style={{ paddingBottom: '1rem', borderColor: 'rgba(255,255,255,0.1)' }}>
            <Inbox className="text-primary" size={24} aria-hidden="true" />
            <h2 id="voting-section-title" style={{ fontSize: '1.25rem' }}>Cast Your Vote</h2>
          </div>
          
          {loading ? (
            <div className="text-center p-4" aria-live="polite">Loading candidates...</div>
          ) : hasVoted ? (
            <div className="flex-col items-center justify-center text-center mt-4" style={{ padding: '2rem 0' }} aria-live="polite">
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
                <Inbox size={48} color="#10B981" aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Vote Recorded</h3>
              <p className="text-muted">Thank you for participating in the democratic process.</p>
            </div>
          ) : (
            <div className="flex-col gap-2 mt-4" aria-live="polite">
              <p className="text-muted mb-2 text-sm">Select a candidate to cast your simulated vote. Voting is currently active in your constituency.</p>
              {candidates.map(candidate => (
                <div key={candidate.id} className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: candidate.color, flexShrink: 0 }} aria-hidden="true"></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{candidate.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{candidate.party}</div>
                    </div>
                  </div>
                  <button onClick={() => handleVote(candidate.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} aria-label={`Vote for ${candidate.name}`}>Vote</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Results Overview (Simulated) */}
        <section className="card glass-panel" aria-labelledby="results-section-title">
          <div className="flex items-center gap-2 mb-2 border-b" style={{ paddingBottom: '1rem', borderColor: 'rgba(255,255,255,0.1)' }}>
            <BarChart3 className="text-secondary" size={24} aria-hidden="true" />
            <h2 id="results-section-title" style={{ fontSize: '1.25rem' }}>Live Simulation Statistics</h2>
          </div>
          
          <div className="mt-4 flex-col gap-4">
            {loading ? (
              <div className="text-center p-4" aria-live="polite">Loading stats...</div>
            ) : candidates.map(candidate => {
              const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);
              const percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
              
              return (
                <div key={`stat-${candidate.id}`} style={{ marginBottom: '1rem' }} aria-label={`${candidate.name} has ${percentage} percent of votes`}>
                  <div className="flex justify-between text-sm mb-1" aria-hidden="true">
                    <span>{candidate.name}</span>
                    <span style={{ fontWeight: 600 }}>{percentage}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }} aria-hidden="true">
                    <div style={{ width: `${percentage}%`, height: '100%', background: candidate.color, transition: 'width 1s ease' }}></div>
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }} aria-hidden="true">{candidate.votes} votes</div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
