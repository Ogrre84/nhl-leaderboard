// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    populateTeams();
    populateLeaderboard();
});

// Mock data for teams
const mockTeams = [
    { id: 1, name: "New Jersey Devils" },
    { id: 2, name: "New York Islanders" },
    { id: 3, name: "New York Rangers" },
    { id: 4, name: "Philadelphia Flyers" },
    { id: 5, name: "Pittsburgh Penguins" },
    // Add all current NHL teams here
];

// Mock data for leaderboard
const mockLeaderboard = [
    { rank: 1, user: "Ian Douglas", total_points: 250 },
    { rank: 2, user: "Alice Smith", total_points: 220 },
    { rank: 3, user: "Bob Johnson", total_points: 180 },
    // Add more users as needed
];

// Function to populate teams in the assign page
function populateTeams() {
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        mockTeams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });
    }
}

// Function to populate leaderboard
function populateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (leaderboardBody) {
        mockLeaderboard.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.rank}</td>
                <td>${user.user}</td>
                <td>${user.total_points}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }
}

// Handle Login Form Submission (Mock)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implement login functionality with backend
        alert('Login functionality to be implemented.');
    });
}

// Handle Signup Form Submission (Mock)
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implement signup functionality with backend
        alert('Signup functionality to be implemented.');
    });
}

// Handle Team Assignment Form Submission (Mock)
const assignForm = document.getElementById('assignForm');
if (assignForm) {
    assignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const selectedTeams = Array.from(document.getElementById('teamSelect').selectedOptions).map(option => option.text);
        // Implement team assignment functionality with backend
        alert(`Teams assigned to ${email}: ${selectedTeams.join(', ')}`);
    });
}
