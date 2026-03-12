// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
let currentUser = null;

// Check if user is logged in
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Remove previous error state
        input.classList.remove('error');
        
        if (!value) {
            input.classList.add('error');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
            input.classList.add('error');
            isValid = false;
        } else if (input.type === 'password' && value.length < 6) {
            input.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message with better styling
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        messageEl.setAttribute('role', 'alert');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
            messageEl.removeAttribute('role');
        }, 5000);
    }
}

// Login functionality
async function handleLogin(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm('loginForm')) {
        showMessage('Please fill in all fields correctly', 'error');
        return;
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Signing in...</span>';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Register functionality
async function handleRegister(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm('registerForm')) {
        showMessage('Please fill in all fields correctly', 'error');
        return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate name length
    if (name.length < 2) {
        document.getElementById('name').classList.add('error');
        showMessage('Name must be at least 2 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Creating account...</span>';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showMessage('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'addskills.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Add skills functionality
async function handleSkillsSubmit(event) {
    event.preventDefault();
    
    const teachSkills = Array.from(document.querySelectorAll('.skill-input[data-type="teach"]'))
        .map(input => input.value.trim())
        .filter(skill => skill !== '');
    
    const learnSkills = Array.from(document.querySelectorAll('.skill-input[data-type="learn"]'))
        .map(input => input.value.trim())
        .filter(skill => skill !== '');
    
    if (teachSkills.length === 0 && learnSkills.length === 0) {
        showMessage('Please add at least one skill that you can teach or want to learn', 'error');
        return;
    }
    
    // Validate skill names
    const allSkills = [...teachSkills, ...learnSkills];
    const invalidSkills = allSkills.filter(skill => skill.length < 2);
    if (invalidSkills.length > 0) {
        showMessage('Skill names must be at least 2 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Saving skills...</span>';
    submitBtn.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skillsTeach: teachSkills, skillsLearn: learnSkills })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showMessage('Skills saved successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Failed to save skills. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Skills error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load user profile
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            return data.user;
        } else {
            console.error('Profile load error:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Profile load error:', error);
        return null;
    }
}

// Load matches
async function loadMatches() {
    if (!currentUser) {
        currentUser = await loadUserProfile();
    }
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/match/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayMatches(data.matches, data.currentUser);
        } else {
            console.error('Matches load error:', data.message);
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('noMatches').style.display = 'block';
        }
    } catch (error) {
        console.error('Matches load error:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('noMatches').style.display = 'block';
    }
}

// Display matches
function displayMatches(matches, currentUser) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noMatches = document.getElementById('noMatches');
    const matchesGrid = document.getElementById('matchesGrid');
    
    loadingSpinner.style.display = 'none';
    
    if (matches.length === 0) {
        noMatches.style.display = 'block';
        matchesGrid.innerHTML = '';
    } else {
        noMatches.style.display = 'none';
        matchesGrid.innerHTML = matches.map(match => createMatchCard(match)).join('');
    }
    
    // Display user skills
    displayUserSkills(currentUser);
}

// Create match card HTML
function createMatchCard(match) {
    const teachSkills = match.skillsTeach.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    const learnSkills = match.skillsLearn.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    
    return `
        <div class="match-card">
            <h3>${match.name}</h3>
            
            <div class="match-score">
                <strong>Match Score:</strong> ${match.matchScore.teachesWhatYouWant} skills you want to learn, 
                ${match.matchScore.wantsWhatYouTeach} skills they want to learn
            </div>
            
            <div class="match-skills">
                <h4>Can Teach:</h4>
                <div class="skill-tags">${teachSkills}</div>
            </div>
            
            <div class="match-skills">
                <h4>Wants to Learn:</h4>
                <div class="skill-tags">${learnSkills}</div>
            </div>
            
            <button class="btn btn-primary" onclick="sendRequest('${match.id}', '${match.name}')">
                Send Request
            </button>
        </div>
    `;
}

// Display user skills
function displayUserSkills(user) {
    const teachSkillsEl = document.getElementById('userTeachSkills');
    const learnSkillsEl = document.getElementById('userLearnSkills');
    
    if (teachSkillsEl && user.skillsTeach) {
        teachSkillsEl.innerHTML = user.skillsTeach.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }
    
    if (learnSkillsEl && user.skillsLearn) {
        learnSkillsEl.innerHTML = user.skillsLearn.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }
}

// Send request (placeholder function)
function sendRequest(userId, userName) {
    showMessage(`Request sent to ${userName}! (This is a demo - feature coming soon)`, 'success');
}

// Add skill input with better validation
function addSkillInput(type) {
    const container = type === 'teach' ? 'teachSkillsContainer' : 'learnSkillsContainer';
    const containerEl = document.getElementById(container);
    
    // Limit number of skills
    const existingInputs = containerEl.querySelectorAll('.skill-input');
    if (existingInputs.length >= 10) {
        showMessage('Maximum 10 skills allowed per category', 'error');
        return;
    }
    
    const inputGroup = document.createElement('div');
    inputGroup.className = 'skill-input-group';
    inputGroup.innerHTML = `
        <input 
            type="text" 
            class="skill-input" 
            placeholder="Enter a skill" 
            data-type="${type}"
            aria-label="Skill ${type === 'teach' ? 'to teach' : 'to learn'}"
            maxlength="50"
        >
        <button type="button" class="btn btn-add" onclick="removeSkillInput(this)" aria-label="Remove skill">
            <span>−</span>
        </button>
    `;
    
    containerEl.appendChild(inputGroup);
    
    // Focus on new input
    const newInput = inputGroup.querySelector('.skill-input');
    newInput.focus();
    
    // Add validation on input
    newInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s\-\&]/g, ''); // Allow only alphanumeric, spaces, hyphens, and ampersands
    });
}

// Remove skill input with animation
function removeSkillInput(button) {
    const inputGroup = button.parentElement;
    const container = inputGroup.parentElement;
    const inputs = container.querySelectorAll('.skill-input');
    
    // Keep at least one input
    if (inputs.length <= 1) {
        showMessage('At least one skill field is required', 'error');
        return;
    }
    
    // Add fade out animation
    inputGroup.style.opacity = '0';
    inputGroup.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        inputGroup.remove();
    }, 200);
}

// Logout functionality
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser = null;
    window.location.href = 'index.html';
}

// Update user name display with better formatting
function updateUserNameDisplay() {
    const userNameEl = document.getElementById('userName');
    if (userNameEl && currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        userNameEl.textContent = `👤 ${firstName}`;
        userNameEl.setAttribute('data-tooltip', `Logged in as ${currentUser.name}`);
    }
}

// Enhanced page initialization
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Check auth status for protected pages
    if (currentPage !== 'index.html' && currentPage !== 'register.html' && !checkAuthStatus()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user display
    if (currentUser) {
        updateUserNameDisplay();
    }
    
    // Add input event listeners for real-time validation
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.classList.add('error');
                showMessage('Please enter a valid email address', 'error');
            } else {
                this.classList.remove('error');
            }
        });
    });
    
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
    
    // Page-specific setup
    switch (currentPage) {
        case 'index.html':
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            break;
            
        case 'register.html':
            const registerForm = document.getElementById('registerForm');
            if (registerForm) {
                registerForm.addEventListener('submit', handleRegister);
            }
            break;
            
        case 'addskills.html':
            const skillsForm = document.getElementById('skillsForm');
            if (skillsForm) {
                skillsForm.addEventListener('submit', handleSkillsSubmit);
            }
            // Add enter key support for skill inputs
            document.querySelectorAll('.skill-input').forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const type = this.getAttribute('data-type');
                        addSkillInput(type);
                    }
                });
            });
            break;
            
        case 'dashboard.html':
            loadMatches();
            break;
    }
    
    // Common event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const editSkillsBtn = document.getElementById('editSkillsBtn');
    if (editSkillsBtn) {
        editSkillsBtn.addEventListener('click', () => {
            window.location.href = 'addskills.html';
        });
    }
    
    const addMoreSkillsBtn = document.getElementById('addMoreSkillsBtn');
    if (addMoreSkillsBtn) {
        addMoreSkillsBtn.addEventListener('click', () => {
            window.location.href = 'addskills.html';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
