// Use a self-invoking async function to allow for top-level await
(async () => {
    const fetch = (await import('node-fetch')).default;

    async function removeAllAssignments() {
        try {
            const response = await fetch('https://nhl-leaderboard-backend.onrender.com/api/playerTeams', {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('All team assignments removed successfully.');
            } else {
                console.error('Failed to remove assignments:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing team assignments:', error);
        }
    }

    await removeAllAssignments();
})();
