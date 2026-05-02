import { db } from './src/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const setupData = async () => {
  try {
    console.log("Setting up Firestore with initial election data...");

    const candidates = [
      { id: "1", name: 'Arjun Sharma', party: 'Progressive Alliance', color: '#4F46E5', votes: 450, constituencyId: "pune-central" },
      { id: "2", name: 'Priya Patel', party: 'Democratic Front', color: '#10B981', votes: 520, constituencyId: "pune-central" },
      { id: "3", name: 'Rahul Verma', party: 'Independent', color: '#F59E0B', votes: 120, constituencyId: "pune-central" }
    ];

    for (const c of candidates) {
      await setDoc(doc(db, "candidates", c.id), c);
    }

    const phases = [
      { id: "1", title: 'Voter Registration', description: 'Citizens register to vote. Verification of eligibility.', date: 'Jan 1 - Feb 28', status: 'completed' },
      { id: "2", title: 'Candidate Nomination', description: 'Candidates file their nomination papers.', date: 'Mar 1 - Mar 15', status: 'completed' },
      { id: "3", title: 'Campaigning', description: 'Candidates campaign in their constituencies.', date: 'Mar 16 - Apr 15', status: 'active' },
      { id: "4", title: 'Voting Process', description: 'Registered voters cast their ballots.', date: 'Apr 20', status: 'upcoming' },
      { id: "5", title: 'Result Declaration', description: 'Votes are counted and winners are announced.', date: 'Apr 25', status: 'upcoming' }
    ];

    for (const p of phases) {
      await setDoc(doc(db, "election_phases", p.id), p);
    }

    console.log("Successfully seeded Firestore database!");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up Firestore:", err);
    process.exit(1);
  }
};

setupData();
