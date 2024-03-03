window.addEventListener('load', async () => {
    try {
        // Show loading screen
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'block';

        // Load API data
        await loadAllData();

        // Hide loading screen and show content
        loadingScreen.style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }
    catch (error) {
        console.error("Error initializing:", error);
    }
});