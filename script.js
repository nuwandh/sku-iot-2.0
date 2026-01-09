document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }


    // --- 2. Mobile Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 3. Scroll Progress ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // --- 4. Scroll Animations (Intersection Observer) ---
    const observeElements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when leaving viewport to allow re-animation
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    observeElements.forEach(el => observer.observe(el));

    // --- 5. Timeline Real-Time Status Tracking ---
    function initTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length === 0) return;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

        timelineItems.forEach(item => {
            const dateStr = item.dataset.date;
            if (!dateStr) return;

            const milestoneDate = new Date(dateStr);
            milestoneDate.setHours(0, 0, 0, 0);

            const statusTag = item.querySelector('.status-tag');

            // Determine status based on date comparison
            if (currentDate > milestoneDate) {
                // Past event
                item.classList.add('status-done');
                if (statusTag) statusTag.textContent = 'DONE';
            } else if (currentDate.getTime() === milestoneDate.getTime()) {
                // Today's event
                item.classList.add('status-live');
                if (statusTag) statusTag.textContent = 'LIVE NOW';
            } else {
                // Future event
                item.classList.add('status-upcoming');
                if (statusTag) statusTag.textContent = 'UPCOMING';
            }
        });
    }

    // Initialize timeline on page load
    initTimeline();

    // --- 6. Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // --- 7. Form Handling (Custom Form) ---
    const form = document.getElementById('google-form');
    const addMemberBtn = document.getElementById('add-member-btn');
    const membersContainer = document.getElementById('members-container');
    const memberCountDisplay = document.getElementById('member-count-display');
    const MAX_MEMBERS = 4; // Total including leader
    let currentMembers = 1; // Start with Leader

    // Configuration for Member IDs (Slots 1, 2, 3)
    // Indexes match the 'extra' members (Member 1, Member 2, Member 3)
    const MEMBER_IDS = [
        {   // Member 1
            name: 'entry.1343391351',
            email: 'entry.139198678',
            id: 'entry.688846544',
            phone: 'entry.911421852'
        },
        {   // Member 2
            name: 'entry.37143100',
            email: 'entry.108368031',
            id: 'entry.1810013610',
            phone: 'entry.149790021'
        },
        {   // Member 3
            name: 'entry.1851371409',
            email: 'entry.71080221',
            id: 'entry.1749944194',
            phone: 'entry.2041292449'
        }
    ];

    if (addMemberBtn && membersContainer) {
        addMemberBtn.addEventListener('click', () => {
            if (currentMembers >= MAX_MEMBERS) return;

            // Determine which member slot we are adding
            const slotIndex = currentMembers - 1;
            const memberConfig = MEMBER_IDS[slotIndex];

            if (!memberConfig) {
                console.error("No ID configuration for member slot index:", slotIndex);
                return;
            }

            currentMembers++;
            updateMemberCount();

            const memberLabelIndex = currentMembers; // "Member 2", "Member 3"...

            const memberDiv = document.createElement('div');
            memberDiv.classList.add('card', 'form-section', 'scroll-animate', 'visible');
            memberDiv.style.marginTop = '1.5rem';
            memberDiv.dataset.slotIndex = slotIndex;

            memberDiv.innerHTML = `
                <div class="form-header-badge">
                    <span class="badge badge-orange">Member ${memberLabelIndex}</span>
                    <button type="button" class="btn-icon remove-member-btn" aria-label="Remove Member" style="float: right; margin-top: -5px; color: var(--danger);">
                        <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Full Name <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <input type="text" name="${memberConfig.name}" placeholder="Enter full name" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Email Address <span class="required">*</span></label>
                        <div class="input-wrapper">
                            <input type="email" name="${memberConfig.email}" placeholder="Enter email address" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Student ID (Optional)</label>
                        <div class="input-wrapper">
                            <input type="text" name="${memberConfig.id}" placeholder="Enter student ID">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Phone Number (Optional)</label>
                        <div class="input-wrapper">
                            <input type="tel" name="${memberConfig.phone}" placeholder="Enter phone number">
                        </div>
                    </div>
                </div>
            `;

            membersContainer.appendChild(memberDiv);

            // Add remove functionality
            const removeBtn = memberDiv.querySelector('.remove-member-btn');
            removeBtn.addEventListener('click', () => {
                memberDiv.remove();
                currentMembers--;
                updateMemberCount();
                relabelMembers();
            });

            if (currentMembers >= MAX_MEMBERS) {
                addMemberBtn.disabled = true;
                addMemberBtn.style.opacity = '0.5';
                addMemberBtn.style.cursor = 'not-allowed';
            }
        });
    }

    function updateMemberCount() {
        if (memberCountDisplay) memberCountDisplay.innerText = currentMembers;
        if (currentMembers < MAX_MEMBERS) {
            addMemberBtn.disabled = false;
            addMemberBtn.style.opacity = '1';
            addMemberBtn.style.cursor = 'pointer';
        }
    }

    function relabelMembers() {
        const memberCards = membersContainer.querySelectorAll('.form-section');
        memberCards.forEach((card, index) => {
            const badge = card.querySelector('.badge-orange');
            // Leader is 1, so first added member is 2
            if (badge) badge.innerText = `Member ${index + 2}`;
        });
    }

    // Only run if the form exists (avoid errors on other pages)
    if (form) {
        // --- Dummy Data Filler (Shift + Alt + D) ---
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'd') {
                console.log("Filling dummy data...");

                // 1. Fill Team Info
                const teamName = form.querySelector('input[name="entry.1928681021"]');
                const category = form.querySelector('select[name="entry.2126890954"]');
                if (teamName) teamName.value = "Test Team Alpha";
                if (category) category.value = "University Category (Undergraduate & Graduate)";

                // 2. Fill Team Leader
                form.querySelector('input[name="entry.1549534817"]').value = "John Doe (Leader)";
                form.querySelector('input[name="entry.1663784631"]').value = "leader@example.com";
                form.querySelector('input[name="entry.1067551578"]').value = "IT20001234";
                form.querySelector('input[name="entry.890610311"]').value = "0771234567";

                // 3. Add 3 Members if not present
                // We click the add button 3 times if currentMembers is 1
                const addBtn = document.getElementById('add-member-btn');

                // Helper to fill member data
                const fillMember = (index, name, email, id, phone) => {
                    // IDs from MEMBER_IDS array in script
                    // logic is: slotIndex = index (0-based for extra members)
                    // index 0 -> name entry.1343391351 (Member 2)
                    // index 1 -> name entry.37143100 (Member 3)
                    // index 2 -> name entry.1851371409 (Member 4)

                    // We need to wait for DOM update if we just clicked add, but we can try immediate or small delay
                    const slots = document.querySelectorAll('#members-container .form-section');
                    if (slots[index]) {
                        const inputs = slots[index].querySelectorAll('input');
                        if (inputs[0]) inputs[0].value = name;
                        if (inputs[1]) inputs[1].value = email;
                        if (inputs[2]) inputs[2].value = id;
                        if (inputs[3]) inputs[3].value = phone;
                    }
                };

                // Trigger clicks with slight delays to allow DOM update
                if (currentMembers < 4) {
                    let needed = 4 - currentMembers;
                    let count = 0;

                    const interval = setInterval(() => {
                        if (count >= needed) {
                            clearInterval(interval);
                            // After adding, fill data
                            setTimeout(() => {
                                fillMember(0, "Jane Smith", "jane@example.com", "IT20005678", "0711234567");
                                fillMember(1, "Mike Ross", "mike@example.com", "IT20009012", "0721234567");
                                fillMember(2, "Rachel Zane", "rachel@example.com", "IT20003456", "0751234567");
                            }, 100);
                            return;
                        }
                        if (addBtn && !addBtn.disabled) {
                            addBtn.click();
                        }
                        count++;
                    }, 50);
                } else {
                    // Already have members, just fill
                    fillMember(0, "Jane Smith", "jane@example.com", "IT20005678", "0711234567");
                    fillMember(1, "Mike Ross", "mike@example.com", "IT20009012", "0721234567");
                    fillMember(2, "Rachel Zane", "rachel@example.com", "IT20003456", "0751234567");
                }

                // 4. Terms Checkbox
                const terms = form.querySelector('input[name="entry.933861959"]');
                if (terms) terms.checked = true;

                // 5. Scroll to bottom
                terms.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        const iframe = document.getElementById('hidden_iframe');
        let submitted = false;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 0. Validation: Minimum Members
            const MIN_MEMBERS = 3;
            if (currentMembers < MIN_MEMBERS) {
                alert(`You must have at least ${MIN_MEMBERS} members (including the Team Leader) to register.`);
                return;
            }

            // 1. Loading State
            const submitBtn = form.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Submitting...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // 2. Set submitted flag explicitly
            submitted = true;

            // 3. Submit via Hidden Iframe (Bypasses CORS)
            form.submit();
        });

        if (iframe) {
            iframe.addEventListener('load', () => {
                if (submitted) {
                    // 4. Success UI
                    form.classList.add('submitted');
                    // Hide all form content except success message
                    Array.from(form.children).forEach(child => {
                        if (child.tagName !== 'IFRAME' && child.id !== 'form-success-message') {
                            child.style.display = 'none';
                        }
                    });

                    const successMsg = document.getElementById('form-success-message');
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Reset flag
                    submitted = false;
                }
            });
        }
    }

    // --- 8. Sponsors Carousel ---
    const carousel = document.querySelector('.sponsors-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.sponsor-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const nextBtn = carousel.querySelector('.carousel-control.next');

        let currentSlide = 0;
        let autoPlayInterval;
        const AUTO_PLAY_DELAY = 2000; // 2 seconds - fast auto-play



        function showSlide(index) {
            // Remove active from all
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Add active to current
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            if (dots[index]) {
                dots[index].classList.add('active');
            }

            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            let prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Navigation dots click
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoPlay();
                startAutoPlay(); // Restart auto-play
            });
        });

        // Prev/Next controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Initialize first slide and start auto-play
        showSlide(0); // Ensure first slide is visible
        console.log('Sponsors carousel initialized with', slides.length, 'slides');
        startAutoPlay();
        console.log('Auto-play started with', AUTO_PLAY_DELAY / 1000, 'second delay');
    }


});

