document.addEventListener('DOMContentLoaded', async () => {
    const playerSelect = document.getElementById('player-select');
    const teamSelect = document.getElementById('team-select');
    const assignButton = document.getElementById('assign-button');
    const playerTableBody = document.getElementById('player-table-body');

    // Fetch players and populate player dropdown
    async function populatePlayerSelect() {
        try {
            const response = await fetch('/api/players');
            const players = await response.json();

            playerSelect.innerHTML = '';
            players.forEach(player => {
                const option = document.createElement('option');
                option.value = player._id;
                option.textContent = player.name;
                playerSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    }

    // Fetch teams and populate team dropdown
    async function populateTeamSelect() {
        try {
            const response = await fetch('/api/teams');
            const teams = await response.json();

            teams.sort((a, b) => a.teamName.localeCompare(b.teamName)); // Sort alphabetically
            teamSelect.innerHTML = '';
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team._id;
                option.textContent = team.teamName;
                teamSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }

    // Fetch player-team assignments and display in table
    // Fetch player-team assignments and display in tables
// Fetch player-team assignments and display in tables for each player
// Fetch player-team assignments and display in boxes for each player
async function displayPlayerTeams() {
    try {
        const response = await fetch('/api/playerTeams');
        const playerTeams = await response.json();

        const playersContainer = document.getElementById('players-container');
        playersContainer.innerHTML = ''; // Clear the container before adding new content

        // Group by playerId to create a table for each player
        const groupedTeams = playerTeams.reduce((acc, playerTeam) => {
            const playerId = playerTeam.playerId._id; // Assuming playerId is present
            if (!acc[playerId]) {
                acc[playerId] = { player: playerTeam.playerId.name, teams: [], totalPoints: 0 };
            }
            const teamName = playerTeam.teamId.teamName;
            const points = playerTeam.teamId.points; // Ensure points is being returned correctly
            acc[playerId].teams.push({ name: teamName, points });
            acc[playerId].totalPoints += points; // Accumulate total points
            return acc;
        }, {});

        // Create a table for each player
        for (const playerId in groupedTeams) {
            const { player, teams, totalPoints } = groupedTeams[playerId];

            // Create a div for the player's teams
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player-teams'); // Add a class for styling

            // Create a header for the player's teams
            const header = document.createElement('h2');
            header.textContent = `${player}'s Teams`;
            playerDiv.appendChild(header);

            // Create a list for the teams
            const list = document.createElement('ul');
            teams.forEach(team => {
                const listItem = document.createElement('li');
                listItem.textContent = `${team.name} (${team.points} points)`;
                list.appendChild(listItem);
            });
            playerDiv.appendChild(list);

            // Add total points
            const totalPointsElement = document.createElement('p');
            totalPointsElement.textContent = `Total Points: ${totalPoints}`;
            playerDiv.appendChild(totalPointsElement);

            // Append this player's div to the container
            playersContainer.appendChild(playerDiv);
        }
    } catch (error) {
        console.error('Error fetching player teams:', error);
    }
}
// Function to fetch and display the leaderboard
async function displayLeaderboard() {
    try {
        const response = await fetch('/api/playerTeams');
        const playerTeams = await response.json();

        const playerPoints = {};

        // Calculate total points for each player
        playerTeams.forEach(playerTeam => {
            const playerId = playerTeam.playerId.name; // Access the player name
            const points = playerTeam.teamId.points; // Access the points for each team

            // Sum the points for each player
            if (!playerPoints[playerId]) {
                playerPoints[playerId] = 0;
            }
            playerPoints[playerId] += points;
        });

        // Convert the object to an array and sort by points
        const leaderboardArray = Object.entries(playerPoints).map(([player, points]) => ({ player, points }));
        leaderboardArray.sort((a, b) => b.points - a.points); // Sort by total points in descending order

        const leaderboardBody = document.getElementById('leaderboard-body');
        leaderboardBody.innerHTML = ''; // Clear existing leaderboard

        // Populate the leaderboard table
        leaderboardArray.forEach(({ player, points }) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player}</td>
                <td>${points}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}


// Update the initial load function to include leaderboard display
async function initialLoad() {
    await populatePlayerSelect();
    await populateTeamSelect();
    await displayPlayerTeams();
    await displayLeaderboard(); // Call the new leaderboard display function
}

// Call the initial load function
initialLoad();


/*// Initial load
await populatePlayerSelect();
await populateTeamSelect();
await displayPlayerTeams();
await displayLeaderboard(); // Call the new leaderboard display function
*/

    // Assign a team to a player
assignButton.addEventListener('click', async () => {
    const playerId = playerSelect.value;
    const teamId = teamSelect.value;

    if (playerId && teamId) {
        try {
            const response = await fetch('/api/playerTeams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, teamId })
            });
            const result = await response.json();
            console.log('Team assigned:', result);

            // Remove the assigned team from the dropdown
            const optionToRemove = Array.from(teamSelect.options).find(option => option.value === teamId);
            if (optionToRemove) {
                teamSelect.removeChild(optionToRemove);
            }

            displayPlayerTeams();  // Refresh the table
			displayLeaderboard();
        } catch (error) {
            console.error('Error assigning team:', error);
        }
    } else {
        alert('Please select both a player and a team.');
    }
});

// Remove all assignments
const removeAssignmentsButton = document.getElementById('remove-assignments-button');

removeAssignmentsButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to remove all team assignments?')) {
        try {
            await fetch('/api/playerTeams', {
                method: 'DELETE',
            });
            console.log('All team assignments removed');
            displayPlayerTeams();  // Refresh the table
        } catch (error) {
            console.error('Error removing team assignments:', error);
        }
    }
});


    // Initial load
    await populatePlayerSelect();
    await populateTeamSelect();
    await displayPlayerTeams();
});
