document.addEventListener('DOMContentLoaded', async () => {
    const playerSelect = document.getElementById('player-select');
    const teamSelect = document.getElementById('team-select');
    const assignButton = document.getElementById('assign-button');
    const playerTableBody = document.getElementById('player-table-body');

    // Fetch players and populate player dropdown
    async function populatePlayerSelect() {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/players');
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
    async function populateTeamSelect(assignedTeams) {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/teams');
            const teams = await response.json();

            // Filter out assigned teams
            const unassignedTeams = teams.filter(team => !assignedTeams.has(team._id));

            unassignedTeams.sort((a, b) => a.teamName.localeCompare(b.teamName)); // Sort alphabetically
            teamSelect.innerHTML = ''; // Clear existing options
            unassignedTeams.forEach(team => {
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
    async function displayPlayerTeams() {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/playerTeams');
            const playerTeams = await response.json();

            const playersContainer = document.getElementById('players-container');
            playersContainer.innerHTML = ''; // Clear the container before adding new content

            // Store assigned teams
            const assignedTeams = new Set();

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
                
                // Add the team to the assignedTeams set
                assignedTeams.add(playerTeam.teamId._id);

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

            // Now call the populateTeamSelect function with assignedTeams
            await populateTeamSelect(assignedTeams);

            // Check if all teams are assigned and hide the button if true
            checkIfAllTeamsAssigned(assignedTeams);
        } catch (error) {
            console.error('Error fetching player teams:', error);
        }
    }

    // Function to fetch and display the leaderboard
    async function displayLeaderboard() {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/playerTeams');
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
        await displayPlayerTeams();
        await displayLeaderboard(); // Call the new leaderboard display function
    }

document.addEventListener('DOMContentLoaded', async () => {
    await fetchLastRunTime(); // Call to fetch the last run time first
    await populatePlayerSelect();
    await populateTeamSelect();
    await displayPlayerTeams();
    await displayLeaderboard();
});


    // Function to check if all teams are assigned
    function checkIfAllTeamsAssigned(assignedTeams) {
        // Check if the team dropdown has any options
        const dropdowns = document.querySelector('.dropdowns'); // Select the dropdowns div
        if (teamSelect.options.length === 0) {
            // Hide selection elements
            dropdowns.style.display = 'none';

            // Display message
            const message = document.createElement('p');
            message.textContent = 'All teams assigned for the current season';
            message.id = 'all-teams-assigned-message'; // Optional: for styling or further manipulations
            document.getElementById('players-container').appendChild(message);
        } else {
            // If there are still teams, ensure the dropdowns are visible
            dropdowns.style.display = 'flex'; // Or 'block', depending on your layout
        }
    }

    async function fetchLastRunTime() {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/lastScrape');
            const lastRun = await response.json();
            document.getElementById('last-run-time').textContent = `Last Scrape: ${new Date(lastRun.timestamp).toLocaleString()}`;
        } catch (error) {
            console.error('Error fetching last run time:', error);
        }
    }

    // Call this function when the page loads
    document.addEventListener('DOMContentLoaded', fetchLastRunTime);

    // Initial load
    await initialLoad();

    // Assign a team to a player
    assignButton.addEventListener('click', async () => {
        const selectedPlayerId = playerSelect.value;
        const selectedTeamId = teamSelect.value;

        if (selectedPlayerId && selectedTeamId) {
            try {
                const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/playerTeams', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ playerId: selectedPlayerId, teamId: selectedTeamId }),
                });

                if (response.ok) {
                    await displayPlayerTeams(); // Refresh displayed teams
                } else {
                    console.error('Error assigning team:', response.statusText);
                }
            } catch (error) {
                console.error('Error assigning team:', error);
            }
        } else {
            alert('Please select both a player and a team to assign.');
        }
    });
});







