document.addEventListener('DOMContentLoaded', function () {
    const projectTiles = document.querySelectorAll('.project-tile');

    // Only fetch each preview video once it's about to scroll into view,
    // instead of downloading all of them on page load.
    const videoLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.load();
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    // Handle video loading and fallback
    projectTiles.forEach(tile => {
        const video = tile.querySelector('video');
        const gifFallback = tile.querySelector('.gif-fallback');
        const staticImg = tile.querySelector('.static-img');

        if (video) {
            // Initially hide video and defer loading until near-visible
            video.style.opacity = '0';
            videoLoadObserver.observe(video);

            // When video can play
            video.addEventListener('canplay', () => {
                video.classList.add('loaded');
            });

            // Handle hover events
            tile.addEventListener('mouseenter', () => {
                staticImg.style.opacity = '0';

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

});