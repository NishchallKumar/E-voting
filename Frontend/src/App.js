import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VoterDashboard from './components/Dashboard/VoterDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import VotePage from './components/Voting/VotePage';
import ResultsPage from './components/Voting/ResultsPage';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute roles={['voter']}>
                  <VoterDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/vote/:electionId"
              element={
                <PrivateRoute roles={['voter']}>
                  <VotePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:electionId"
              element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;