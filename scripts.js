document.addEventListener('DOMContentLoaded', () => {
    const teamList = document.getElementById('team-list');

    // Fetch teams from the Express server
    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const teams = await response.json();
            displayTeams(teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            teamList.innerHTML = '<li>Error loading teams. Please try again later.</li>';
        }
    };

    // Display teams in the HTML
    const displayTeams = (teams) => {
        teamList.innerHTML = ''; // Clear existing list
        teams.forEach(team => {
            const listItem = document.createElement('li');
            listItem.textContent = `${team.teamName}: ${team.points} points`;
            teamList.appendChild(listItem);
        });
    };

    // Initial fetch
    fetchTeams();
});
