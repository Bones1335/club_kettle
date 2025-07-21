export class ModalManager {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createModalStructure();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    createModalStructure() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'modal-overlay';
        this.overlay.className = 'modal-overlay';
        
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        
        this.modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title"></h3>
                <button class="modal-close" id="modal-close">&times;</button>
            </div>
            <div class="modal-body" id="modal-body"></div>
            <div class="modal-footer" id="modal-footer"></div>
        `;
        
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);
    }

    setupEventListeners() {
        document.getElementById('modal-close').addEventListener('click', () => {
            this.close();
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    show(title, content, footer = '') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-footer').innerHTML = footer;
        
        this.overlay.classList.add('active');
        
        this.modal.focus();
        
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.overlay.classList.contains('active');
    }

    createButton(text, className = 'btn', onclick = null) {
        return `<button class="${className}" ${onclick ? `onclick="${onclick}"` : ''}>${text}</button>`;
    }
}

export class ModalTemplates {
    constructor(modalManager) {
        this.modal = modalManager;
    }

    showWorkoutDetails(workout) {
        const exercises = workout.Exercises.map(exercise => {
            return `
                <li>${exercise.name} (${exercise.tool})</li>
            `
        }).join('');

        const content = `
            <div class="workout-details">
                <p><strong>Name:</strong> ${workout.Workout.name}</p>
                <p><strong>Description:</strong> ${workout.Workout.description || 'No description'}</p>
                <p><strong>Exercises:</strong><ol>${exercises}</ol>
            </div>
        `;
        
        const footer = `
            ${this.modal.createButton('Cancel', 'btn btn-secondary', 'modalManager.close()')}
        `;
        
        this.modal.show('Workout Details', content, footer);
    }
}

export const modalManager = new ModalManager();
export const modalTemplates = new ModalTemplates(modalManager);

window.modalManager = modalManager;
window.modalTemplates = modalTemplates;