 




// Initialization and Setup
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});



function initializeApp() {
    try {
        loadSavedPreferences();
        updatePreview();
        setupHumorSlider();
        checkForResume();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        // Handle initialization failure gracefully
    }
}



function setupEventListeners() {
    // Character Selection
    document.getElementById('character').addEventListener('change', updatePreview);
    document.getElementById('custom-name').addEventListener('input', updatePreview);
    document.getElementById('custom-traits').addEventListener('input', updatePreview);
    document.getElementById('custom-backstory').addEventListener('input', updatePreview);
    
    // Story Configuration
    document.getElementById('tone').addEventListener('change', updatePreview);
    document.getElementById('humor-slider').addEventListener('input', updateHumorValue);
    document.getElementById('themes').addEventListener('change', updatePreview);
    
    // Character Details
    document.getElementById('backstory').addEventListener('change', updatePreview);
    document.getElementById('quirks').addEventListener('change', updatePreview);
    document.getElementById('length').addEventListener('change', updatePreview);
    
    // Buttons
    document.getElementById('save-custom-character').addEventListener('click', saveCustomCharacter);
    document.getElementById('save-selections').addEventListener('click', savePreferences);
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('export-word').addEventListener('click', exportToWord);
    document.getElementById('export-epub').addEventListener('click', exportToEpub);
    document.getElementById('generate-ai-story').addEventListener('click', generateAIStory);
    document.getElementById('analyze-story').addEventListener('click', analyzeStory);
    document.getElementById('suggest-alternatives').addEventListener('click', suggestAlternatives);
    document.getElementById('start-tutorial').addEventListener('click', startTutorial);
}

// Add cleanup function:
function cleanupEventListeners() {
    const elements = [
        'character',
        'custom-name',
        'custom-traits',
        'custom-backstory',
        // ... other elements
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.replaceWith(element.cloneNode(true));
        }
    });
}

// Core Story Generation
async function generateStory() {
    try {
        const character = getCharacterDetails();
        const storyConfig = getStoryConfiguration();
        
        if (!character || !storyConfig) {
            throw new Error('Invalid story configuration');
        }
        
        const story = await combineStoryElements(character, storyConfig);
        updateOutput(story);
        updateAchievements();
    } catch (error) {
        console.error('Story generation failed:', error);
        // Show user-friendly error message
        document.getElementById('output').innerHTML = 'Failed to generate story. Please try again.';
    }
}


function getCharacterDetails() {
    const name = document.getElementById('character')?.value?.trim();
    const backstory = document.getElementById('backstory')?.value?.trim();
    
    if (!name || !backstory) {
        throw new Error('Required character details missing');
    }
    
    return {
        name,
        backstory,
        quirks: document.getElementById('quirks')?.value?.trim() || '',
        customName: document.getElementById('custom-name')?.value?.trim() || '',
        customTraits: document.getElementById('custom-traits')?.value?.trim() || '',
        customBackstory: document.getElementById('custom-backstory')?.value?.trim() || ''
    };
}


function getStoryConfiguration() {
    return {
        tone: document.getElementById('tone').value,
        humorLevel: document.getElementById('humor-slider').value,
        themes: Array.from(document.getElementById('themes').selectedOptions).map(option => option.value),
        length: document.getElementById('length').value,
        relationships: document.getElementById('relationships').value
    };
}

function combineStoryElements(character, config) {
    // Sample story generation logic
    const storyStart = getStoryStart(character, config);
    const storyMiddle = getStoryMiddle(character, config);
    const storyEnd = getStoryEnd(character, config);
    
    return `${storyStart}\n\n${storyMiddle}\n\n${storyEnd}`;
}

function getStoryStart(character, config) {
    return `In a ${config.tone} turn of events, ${character.name}, known for their ${character.quirks}, began their journey...`;
}

function getStoryMiddle(character, config) {
    return `As the story unfolds, we learn about ${character.name}'s ${character.backstory}...`;
}

function getStoryEnd(character, config) {
    return `Finally, through ${config.themes.join(' and ')}, ${character.name} discovers their true path.`;
}

// Preview and Updates
function updatePreview() {
    const preview = generatePreview();
    document.getElementById('preview').innerHTML = preview;
}

function generatePreview() {
    const character = getCharacterDetails();
    const config = getStoryConfiguration();
    return `Preview: A ${config.length}-word ${config.tone} story about ${character.name}, featuring themes of ${config.themes.join(', ')}...`;
}

function updateOutput(story) {
    document.getElementById('output').innerHTML = story;
}

// Save  Functions
function savePreferences() {
    try {
        const preferences = {
            character: getCharacterDetails(),
            configuration: getStoryConfiguration()
        };
        
        if (!preferences.character || !preferences.configuration) {
            throw new Error('Invalid preferences data');
        }
        
        localStorage.setItem('storyPreferences', JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('Failed to save preferences:', error);
        return false;
    }
}

function loadSavedPreferences() {
    const saved = localStorage.getItem('storyPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        applySavedPreferences(preferences);
    }
}

function applySavedPreferences(preferences) {
    // Apply character preferences
    document.getElementById('character').value = preferences.character.name;
    document.getElementById('backstory').value = preferences.character.backstory;
    document.getElementById('quirks').value = preferences.character.quirks;
    document.getElementById('custom-name').value = preferences.character.customName;
    document.getElementById('custom-traits').value = preferences.character.customTraits;
    document.getElementById('custom-backstory').value = preferences.character.customBackstory;

    // Apply configuration preferences
    document.getElementById('tone').value = preferences.configuration.tone;
    document.getElementById('humor-slider').value = preferences.configuration.humorLevel;
    document.getElementById('relationships').value = preferences.configuration.relationships;
    
    // Apply theme selections
    const themesSelect = document.getElementById('themes');
    preferences.configuration.themes.forEach(theme => {
        Array.from(themesSelect.options).forEach(option => {
            if (option.value === theme) option.selected = true;
        });
    });
}



// Export Functions
function exportToPDF() {
    const story = document.getElementById('output').innerHTML;
    alert('PDF export feature coming soon!');
    // Implementation for PDF export would go here
}

function exportToWord() {
    const story = document.getElementById('output').innerHTML;
    alert('Word export feature coming soon!');
    // Implementation for Word export would go here
}



// Advanced Features
function generateAIStory(prompt, options = {}) {
    // Default settings
    const defaults = {
        genre: 'fantasy',
        length: 'medium',
        tone: 'neutral',
        complexity: 0.7,
        maxTokens: 1000,
        temperature: 0.8
    };

    // Merge defaults with provided options
    const settings = { ...defaults, ...options };

    // Story generation state management
    let storyState = {
        isGenerating: false,
        progress: 0,
        currentScene: 0,
        storyElements: []
    };

    class StoryGenerator {
        constructor(prompt, settings) {
            this.prompt = prompt;
            this.settings = settings;
            this.storyStructure = [];
            this.events = new EventEmitter();
        }

        async generate() {
            try {
                storyState.isGenerating = true;
                updateUI('Initiating story generation...');

                // Generate story outline
                const outline = await this.createStoryOutline();
                storyState.progress = 20;
                updateUI('Creating story structure...', outline);

                // Generate character profiles
                const characters = await this.developCharacters(outline);
                storyState.progress = 40;
                updateUI('Developing characters...', characters);

                // Generate scene descriptions
                const scenes = await this.createScenes(outline, characters);
                storyState.progress = 60;
                updateUI('Crafting scenes...', scenes);

                // Generate dialogue
                const dialogue = await this.generateDialogue(scenes, characters);
                storyState.progress = 80;
                updateUI('Writing dialogue...', dialogue);

                // Combine everything into final story
                const story = await this.combineElements(outline, characters, scenes, dialogue);
                storyState.progress = 100;
                updateUI('Finalizing your story...', story);

                return this.formatStory(story);
            } catch (error) {
                console.error('Story generation error:', error);
                throw new Error('Failed to generate story. Please try again.');
            } finally {
                storyState.isGenerating = false;
            }
        }

        async createStoryOutline() {
            // Create basic story structure using the three-act format
            return [
                {
                    act: 1,
                    description: 'Setup and introduction',
                    keyEvents: await this.generateKeyEvents(this.prompt, 'setup'),
                    mood: this.settings.tone
                },
                {
                    act: 2,
                    description: 'Confrontation and development',
                    keyEvents: await this.generateKeyEvents(this.prompt, 'development'),
                    mood: this.intensifyMood(this.settings.tone)
                },
                {
                    act: 3,
                    description: 'Resolution and conclusion',
                    keyEvents: await this.generateKeyEvents(this.prompt, 'resolution'),
                    mood: this.resolveMood(this.settings.tone)
                }
            ];
        }

        async developCharacters(outline) {
            const characterRoles = this.identifyCharacterRoles(outline);
            return characterRoles.map(role => ({
                name: this.generateCharacterName(),
                role: role,
                personality: this.generatePersonalityTraits(),
                background: this.generateCharacterBackground(),
                goals: this.generateCharacterGoals(role, outline),
                relationships: []
            }));
        }

        async createScenes(outline, characters) {
            return outline.flatMap(act => 
                act.keyEvents.map(event => ({
                    setting: this.generateSceneSetting(event),
                    description: this.generateSceneDescription(event, characters),
                    mood: this.calculateSceneMood(act.mood, event),
                    participants: this.determineSceneParticipants(characters, event)
                }))
            );
        }

        async generateDialogue(scenes, characters) {
            return scenes.map(scene => ({
                scene: scene,
                exchanges: this.createDialogueExchanges(
                    scene.participants,
                    scene.mood,
                    this.settings.complexity
                )
            }));
        }

        // Helper methods for story generation
        intensifyMood(mood) {
            // Logic to intensify the emotional tone
            return mood;
        }

        resolveMood(mood) {
            // Logic to create resolution for the emotional tone
            return mood;
        }

        generateCharacterName() {
            // Character name generation logic
            const names = ['Alex', 'Morgan', 'Jordan', 'Taylor', 'Casey'];
            return names[Math.floor(Math.random() * names.length)];
        }

        generatePersonalityTraits() {
            // Personality trait generation logic
            return {
                mainTrait: 'determined',
                quirks: ['talks to plants', 'collects rare coins'],
                flaws: ['impatient', 'stubborn']
            };
        }

        // UI update helper
        updateUI(message, data) {
            // Emit events for UI updates
            this.events.emit('progressUpdate', {
                message: message,
                progress: storyState.progress,
                data: data
            });
        }

        formatStory(story) {
            // Format the final story with proper structure and styling
            return {
                title: this.generateTitle(story),
                content: this.formatContent(story),
                metadata: {
                    genre: this.settings.genre,
                    length: this.settings.length,
                    generatedAt: new Date().toISOString()
                }
            };
        }
    }

    // Create and return a new story generator instance
    const generator = new StoryGenerator(prompt, settings);
    return generator.generate();
}

// Event handling for UI updates
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}


generateAIStory("A mysterious door appears in the forest", {
    genre: "fantasy",
    length: "medium",
    tone: "mysterious",
    complexity: 0.8
}).then(story => {
    console.log('Generated Story:', story);
}).catch(error => {
    console.error('Error:', error);
});


function analyzeStory() {
    const story = document.getElementById('output').innerHTML;
    const analysis = `Story analysis:\n- Word count: ${story.split(' ').length}\n- Tone: ${document.getElementById('tone').value}`;
    document.getElementById('analysis-results').innerHTML = analysis;
}

function suggestAlternatives() {
    const alternatives = "Alternative ending suggestions coming soon...";
    document.getElementById('alternatives').innerHTML = alternatives;
}

// UI Helper Functions
function setupHumorSlider() {
    const slider = document.getElementById('humor-slider');
    const value = document.getElementById('humor-value');
    value.textContent = `${slider.value}%`;
}

function updateHumorValue(e) {
    document.getElementById('humor-value').textContent = `${e.target.value}%`;
    updatePreview();
}

function startTutorial() {
    let currentStep = 0;
    const tutorialSteps = [
        {
            element: '#story-input',
            title: 'Welcome to the Story Generator!',
            message: 'This is where you\'ll enter your story prompts. Try something like "A magical forest..."',
            position: 'bottom'
        },
        {
            element: '#genre-select',
            title: 'Choose Your Genre',
            message: 'Select a genre to shape your story\'s theme and style.',
            position: 'right'
        },
        {
            element: '#length-slider',
            title: 'Story Length',
            message: 'Adjust this slider to control how long your generated story will be.',
            position: 'top'
        },
        {
            element: '#generate-btn',
            title: 'Generate Your Story',
            message: 'Click here when you\'re ready to create your story!',
            position: 'left'
        }
    ];

    function showTutorialStep() {
        if (currentStep >= tutorialSteps.length) {
            endTutorial();
            return;
        }

        const step = tutorialSteps[currentStep];
        const element = document.querySelector(step.element);
        
        // Create and show tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.message}</p>
            <button onclick="nextTutorialStep()">Next</button>
        `;

        // Position tooltip relative to element
        positionTooltip(tooltip, element, step.position);
        
        // Highlight the current element
        element.classList.add('tutorial-highlight');
    }

    function positionTooltip(tooltip, element, position) {
        const elementRect = element.getBoundingClientRect();
        const offset = 10; // Distance between element and tooltip

        switch(position) {
            case 'top':
                tooltip.style.bottom = `${window.innerHeight - elementRect.top + offset}px`;
                tooltip.style.left = `${elementRect.left + (elementRect.width / 2)}px`;
                break;
            case 'bottom':
                tooltip.style.top = `${elementRect.bottom + offset}px`;
                tooltip.style.left = `${elementRect.left + (elementRect.width / 2)}px`;
                break;
            case 'left':
                tooltip.style.right = `${window.innerWidth - elementRect.left + offset}px`;
                tooltip.style.top = `${elementRect.top + (elementRect.height / 2)}px`;
                break;
            case 'right':
                tooltip.style.left = `${elementRect.right + offset}px`;
                tooltip.style.top = `${elementRect.top + (elementRect.height / 2)}px`;
                break;
        }
    }

    function nextTutorialStep() {
        // Remove highlight from current element
        const currentElement = document.querySelector(tutorialSteps[currentStep].element);
        currentElement.classList.remove('tutorial-highlight');
        
        // Remove current tooltip
        const tooltip = document.querySelector('.tutorial-tooltip');
        if (tooltip) tooltip.remove();
        
        currentStep++;
        showTutorialStep();
    }

    function endTutorial() {
        const tooltip = document.querySelector('.tutorial-tooltip');
        if (tooltip) tooltip.remove();
        
        // Show completion message
        alert('Great! You\'re now ready to create amazing stories!');
        
        // Store in localStorage that tutorial has been completed
        localStorage.setItem('tutorialCompleted', 'true');
    }

    // Start the tutorial
    showTutorialStep();
}
function startTutorial() {
    let currentStep = 0;
    let activeTooltip = null;
    
    function cleanup() {
        if (activeTooltip) {
            activeTooltip.remove();
        }
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }
    
    // Clean up when leaving the page
    window.addEventListener('beforeunload', cleanup);
    
    // ... rest of tutorial code
}

// Add necessary CSS
const style = document.createElement('style');
style.textContent = `
    .tutorial-tooltip {
        position: fixed;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 300px;
    }

    .tutorial-highlight {
        position: relative;
        z-index: 999;
        box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.5);
        border-radius: 4px;
    }

    .tutorial-tooltip h3 {
        margin: 0 0 10px 0;
        color: #2c5282;
    }

    .tutorial-tooltip button {
        background: #4299e1;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        margin-top: 10px;
        cursor: pointer;
    }

    .tutorial-tooltip button:hover {
        background: #2b6cb0;
    }
`;
document.head.appendChild(style);

function updateAchievements() {
    const achievements = document.getElementById('achievements');
    achievements.innerHTML = 'New achievement unlocked: Story Creator!';
}
// Custom Character Management
function saveCustomCharacter() {
    const customCharacter = {
        name: document.getElementById('custom-name').value,
        traits: document.getElementById('custom-traits').value,
        backstory: document.getElementById('custom-backstory').value
    };
    
    let savedCharacters = JSON.parse(localStorage.getItem('customCharacters') || '[]');
    savedCharacters.push(customCharacter);
    localStorage.setItem('customCharacters', JSON.stringify(savedCharacters));
    
    alert('Custom character saved successfully!');
    updatePreview();
}