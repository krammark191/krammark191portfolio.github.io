document.addEventListener('DOMContentLoaded', function () {
    const projectTiles = document.querySelectorAll('.project-tile');

    // Handle video loading and fallback
    projectTiles.forEach(tile => {
        const video = tile.querySelector('video');
        const gifFallback = tile.querySelector('.gif-fallback');
        const staticImg = tile.querySelector('.static-img');

        if (video) {
            // Initially hide video and set up loading
            video.style.opacity = '0';
            video.load(); // Explicitly load the video

            // When video can play
            video.addEventListener('canplay', () => {
                video.classList.add('loaded');
                console.log('Video loaded:', video.src); // Debug log
            });

            // Handle hover events
            tile.addEventListener('mouseenter', () => {
                staticImg.style.opacity = '0';

                // Debug log
                console.log('Video readyState:', video.readyState);

                if (video.classList.contains('loaded')) {
                    // Video is ready, show video and hide GIF
                    video.style.opacity = '1';
                    gifFallback.style.opacity = '0';
                    video.play()
                        .catch(e => {
                            console.log('Video play failed:', e);
                            // Fallback to GIF if video fails to play
                            video.style.opacity = '0';
                            gifFallback.style.opacity = '1';
                        });
                } else {
                    // Video not ready, show GIF
                    gifFallback.style.opacity = '1';
                    video.style.opacity = '0';
                }
            });

            tile.addEventListener('mouseleave', () => {
                // Reset to static image
                staticImg.style.opacity = '1';
                gifFallback.style.opacity = '0';
                video.style.opacity = '0';
                if (!video.paused) {
                    video.pause();
                }
                video.currentTime = 0;
            });
        }
    });

    // Modal handling
    const modal = document.getElementById('projectModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeButton = modal.querySelector('.close-modal');

    // Handle project tile clicks
    projectTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
            // Don't trigger modal if clicking a link or button
            if (e.target.closest('a')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const title = tile.querySelector('h3').textContent;
            const details = tile.querySelector('.project-details');

            if (details) {
                const descriptions = details.querySelectorAll('.project-description');
                const modalDescriptionDiv = modal.querySelector('.modal-description');
                
                // Clear previous content
                modalDescriptionDiv.innerHTML = '';
                
                // Add each description as a separate paragraph
                descriptions.forEach((desc, index) => {
                    const p = document.createElement('p');
                    p.textContent = desc.textContent;
                    p.className = index === 0 ? 'primary-description' : 'secondary-description';
                    modalDescriptionDiv.appendChild(p);
                });

                const tech = details.querySelector('.project-tech').textContent;
                const projectLinks = details.querySelector('.project-links');
                const modalLinks = modal.querySelector('.modal-links');

                // Check for video first, then gif fallback
                const video = tile.querySelector('video.video-main');
                const gif = tile.querySelector('.gif-fallback');

                // Clear previous modal media
                modal.querySelector('.modal-media').innerHTML = '';

                // Use video if it's loaded, otherwise use gif
                if (video && video.readyState >= 3) {
                    const videoClone = video.cloneNode(true);
                    videoClone.classList.remove('hover-gif', 'video-main');
                    videoClone.style.opacity = '1';
                    modal.querySelector('.modal-media').appendChild(videoClone);
                    videoClone.play();
                } else if (gif) {
                    modal.querySelector('.modal-media').innerHTML = `<img src="${gif.src}" alt="${gif.alt}">`;
                }

                modal.querySelector('.modal-title').textContent = title;
                modal.querySelector('.modal-tech').textContent = tech;

                if (projectLinks) {
                    modalLinks.innerHTML = projectLinks.innerHTML;
                } else {
                    const githubLink = details.querySelector('.project-link');
                    modalLinks.innerHTML = githubLink.outerHTML;
                }

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Handle PDF button clicks
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('pdf-button')) {
            e.preventDefault();
            e.stopPropagation();
            togglePDF();
        }
    });

    // Close modal when clicking close button or outside
    closeButton.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal function
    function closeModal() {
        const modalVideo = modal.querySelector('video');
        if (modalVideo) {
            modalVideo.pause();
        }
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Language showcase animation
    function initLanguageShowcase() {
        const gifs = document.querySelectorAll('.language-gif');
        const proficiencyBar = document.getElementById('proficiencyBar');
        const languageName = document.getElementById('languageName');
        let currentIndex = 0;

        function updateShowcase() {
            // Remove active class from all gifs
            gifs.forEach(gif => gif.classList.remove('active'));
            
            // Add active class to current gif
            const currentGif = gifs[currentIndex];
            currentGif.classList.add('active');
            
            // Update proficiency bar
            const proficiency = currentGif.dataset.proficiency;
            proficiencyBar.style.width = `${proficiency}%`;
            
            // Update language name
            languageName.textContent = currentGif.alt;
            
            // Increment index
            currentIndex = (currentIndex + 1) % gifs.length;
        }

        // Initial update
        updateShowcase();
        
        // Set interval for cycling
        setInterval(updateShowcase, 3000);
    }

    // Call the function when the page loads
    document.addEventListener('DOMContentLoaded', initLanguageShowcase);

    // Language icons functionality
    document.addEventListener('DOMContentLoaded', () => {
        const languageIcons = document.querySelectorAll('.language-icon');
        const proficiencyBar = document.getElementById('proficiencyBar');
        const languageName = document.getElementById('languageName');
        let currentIndex = 0;
        let intervalId;

        function showLanguage(index) {
            // Hide all icons
            languageIcons.forEach(icon => icon.classList.remove('active'));
            
            // Show the selected icon
            languageIcons[index].classList.add('active');
            
            // Update proficiency bar
            const proficiency = languageIcons[index].dataset.proficiency;
            proficiencyBar.style.width = `${proficiency}%`;
            
            // Update language name
            languageName.textContent = languageIcons[index].alt;
        }

        function nextLanguage() {
            currentIndex = (currentIndex + 1) % languageIcons.length;
            showLanguage(currentIndex);
        }

        // Start automatic rotation
        intervalId = setInterval(nextLanguage, 3000);

        // Allow manual navigation by clicking
        languageIcons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                clearInterval(intervalId);
                currentIndex = index;
                showLanguage(currentIndex);
                intervalId = setInterval(nextLanguage, 3000);
            });
        });

        // Show initial language
        showLanguage(0);
    });
});