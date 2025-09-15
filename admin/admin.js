// DE-MAJ Architecture - Admin Panel Script

import { $, $$, addEvent, addClass, removeClass, createElement } from '../scripts/lib/dom.js';
import { storage, exportData } from '../scripts/lib/storage.js';
import projectsData from '../scripts/data/projects.json' assert { type: 'json' };
import siteData from '../scripts/data/site.json' assert { type: 'json' };
import catalogueData from '../scripts/data/catalogue.json' assert { type: 'json' };

class AdminPanel {
  constructor() {
    this.projects = [...projectsData];
    this.site = { ...siteData };
    this.catalogue = [...catalogueData ];
    this.currentProject = null;
    this.init();
  }
  
  init() {
    this.setupTabs();
    this.loadData();
    this.setupEventListeners();
    this.setupDragAndDrop();
  }
  
  setupTabs() {
    const tabs = $$('.admin-nav__tab');
    const tabContents = $$('.admin-tab');
    
    tabs.forEach(tab => {
      addEvent(tab, 'click', () => {
        const tabId = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => removeClass(t, 'admin-nav__tab--active'));
        tabContents.forEach(tc => removeClass(tc, 'admin-tab--active'));
        
        // Add active class to clicked tab and corresponding content
        addClass(tab, 'admin-nav__tab--active');
        addClass($(`#${tabId}-tab`), 'admin-tab--active');
      });
    });
  }
  
  loadData() {
    this.loadProjects();
    this.loadSiteSettings();
    this.loadCatalogue();
  }
  
  loadProjects() {
    const tbody = $('#projects-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = this.projects.map(project => `
      <tr class="sortable-item" data-project-id="${project.id}">
        <td>
          <span class="drag-handle">⋮⋮</span>
          <strong>${project.title}</strong>
        </td>
        <td>${this.getCategoryName(project.categoryId)}</td>
        <td>${project.year}</td>
        <td><span class="status-badge status-badge--${project.status}">${project.status}</span></td>
        <td>${project.sortOrder || 0}</td>
        <td>
          <div class="admin-table__actions">
            <button class="admin-table__btn" onclick="adminPanel.editProject('${project.id}')">Edit</button>
            <button class="admin-table__btn admin-table__btn--danger" onclick="adminPanel.deleteProject('${project.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  loadSiteSettings() {
    Object.keys(this.site).forEach(key => {
      const input = $(`#${key}`);
      if (input) {
        input.value = this.site[key] || '';
      }
    });
  }
  
  loadCatalogue() {
    const tbody = $('#catalogue-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = this.catalogue.map(item => `
      <tr>
        <td><strong>${item.title}</strong></td>
        <td>${item.description}</td>
        <td>${item.file}</td>
        <td>${item.size}</td>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>
          <div class="admin-table__actions">
            <button class="admin-table__btn" onclick="adminPanel.editCatalogueItem('${item.id}')">Edit</button>
            <button class="admin-table__btn admin-table__btn--danger" onclick="adminPanel.deleteCatalogueItem('${item.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  setupEventListeners() {
    // Project management
    addEvent($('#add-project'), 'click', () => this.showProjectModal());
    addEvent($('#import-projects'), 'click', () => this.importData('projects'));
    addEvent($('#export-projects'), 'click', () => this.exportData('projects'));
    
    // Site settings
    addEvent($('#site-form'), 'submit', (e) => this.saveSiteSettings(e));
    addEvent($('#import-site'), 'click', () => this.importData('site'));
    addEvent($('#export-site'), 'click', () => this.exportData('site'));
    
    // Catalogue management
    addEvent($('#add-catalogue'), 'click', () => this.showCatalogueModal());
    addEvent($('#import-catalogue'), 'click', () => this.importData('catalogue'));
    addEvent($('#export-catalogue'), 'click', () => this.exportData('catalogue'));
    
    // Modal controls
    addEvent($('#project-modal-close'), 'click', () => this.hideProjectModal());
    addEvent($('#project-cancel'), 'click', () => this.hideProjectModal());
    addEvent($('#project-form'), 'submit', (e) => this.saveProject(e));
    
    // JSON import
    addEvent($('#json-import'), 'change', (e) => this.handleFileImport(e));
  }
  
  setupDragAndDrop() {
    const tbody = $('#projects-table-body');
    if (!tbody) return;
    
    let draggedElement = null;
    
    // Drag start
    addEvent(tbody, 'dragstart', (e) => {
      if (e.target.classList.contains('drag-handle')) {
        draggedElement = e.target.closest('tr');
        addClass(draggedElement, 'sortable-item--dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });
    
    // Drag end
    addEvent(tbody, 'dragend', (e) => {
      if (draggedElement) {
        removeClass(draggedElement, 'sortable-item--dragging');
        draggedElement = null;
      }
    });
    
    // Drag over
    addEvent(tbody, 'dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      const afterElement = this.getDragAfterElement(tbody, e.clientY);
      const dragging = $('.sortable-item--dragging');
      
      if (afterElement == null) {
        tbody.appendChild(dragging);
      } else {
        tbody.insertBefore(dragging, afterElement);
      }
    });
    
    // Drop
    addEvent(tbody, 'drop', (e) => {
      e.preventDefault();
      this.updateProjectOrder();
    });
  }
  
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.sortable-item--dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  updateProjectOrder() {
    const rows = $$('#projects-table-body tr');
    rows.forEach((row, index) => {
      const projectId = row.dataset.projectId;
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        project.sortOrder = index + 1;
      }
    });
    
    this.saveToStorage('projects', this.projects);
    this.showToast('Project order updated', 'success');
  }
  
  showProjectModal(projectId = null) {
    const modal = $('#project-modal');
    const title = $('#project-modal-title');
    const form = $('#project-form');
    
    if (projectId) {
      this.currentProject = this.projects.find(p => p.id === projectId);
      title.textContent = 'Edit Project';
      this.populateProjectForm(this.currentProject);
    } else {
      this.currentProject = null;
      title.textContent = 'Add Project';
      form.reset();
    }
    
    addClass(modal, 'modal--open');
  }
  
  hideProjectModal() {
    const modal = $('#project-modal');
    removeClass(modal, 'modal--open');
    this.currentProject = null;
  }
  
  populateProjectForm(project) {
    Object.keys(project).forEach(key => {
      const input = $(`#project-${key}`);
      if (input) {
        input.value = project[key] || '';
      }
    });
  }
  
  saveProject(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const projectData = Object.fromEntries(formData.entries());
    
    // Generate ID and slug if new project
    if (!this.currentProject) {
      projectData.id = this.generateId();
      projectData.slug = this.generateSlug(projectData.title);
    } else {
      projectData.id = this.currentProject.id;
    }
    
    // Set default values
    projectData.gallery = projectData.gallery || [];
    projectData.assets = projectData.assets || [];
    projectData.sortOrder = projectData.sortOrder || this.projects.length + 1;
    
    if (this.currentProject) {
      // Update existing project
      const index = this.projects.findIndex(p => p.id === this.currentProject.id);
      this.projects[index] = projectData;
    } else {
      // Add new project
      this.projects.push(projectData);
    }
    
    this.saveToStorage('projects', this.projects);
    this.loadProjects();
    this.hideProjectModal();
    this.showToast('Project saved successfully', 'success');
  }
  
  editProject(projectId) {
    this.showProjectModal(projectId);
  }
  
  deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.saveToStorage('projects', this.projects);
      this.loadProjects();
      this.showToast('Project deleted successfully', 'success');
    }
  }
  
  saveSiteSettings(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    this.site = Object.fromEntries(formData.entries());
    
    this.saveToStorage('site', this.site);
    this.showToast('Site settings saved successfully', 'success');
  }
  
  showCatalogueModal() {
    // Implementation for catalogue modal
    this.showToast('Catalogue modal coming soon', 'info');
  }
  
  editCatalogueItem(itemId) {
    // Implementation for editing catalogue item
    this.showToast('Edit catalogue item coming soon', 'info');
  }
  
  deleteCatalogueItem(itemId) {
    if (confirm('Are you sure you want to delete this catalogue item?')) {
      this.catalogue = this.catalogue.filter(item => item.id !== itemId);
      this.saveToStorage('catalogue', this.catalogue);
      this.loadCatalogue();
      this.showToast('Catalogue item deleted successfully', 'success');
    }
  }
  
  importData(type) {
    const input = $('#json-import');
    input.dataset.type = type;
    input.click();
  }
  
  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const type = e.target.dataset.type;
        
        if (type === 'projects') {
          this.projects = data;
          this.loadProjects();
        } else if (type === 'site') {
          this.site = data;
          this.loadSiteSettings();
        } else if (type === 'catalogue') {
          this.catalogue = data;
          this.loadCatalogue();
        }
        
        this.saveToStorage(type, data);
        this.showToast(`${type} data imported successfully`, 'success');
      } catch (error) {
        this.showToast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  }
  
  exportData(type) {
    let data, filename;
    
    if (type === 'projects') {
      data = this.projects;
      filename = 'projects.json';
    } else if (type === 'site') {
      data = this.site;
      filename = 'site.json';
    } else if (type === 'catalogue') {
      data = this.catalogue;
      filename = 'catalogue.json';
    }
    
    exportData.exportJSON(data, filename);
    this.showToast(`${type} data exported successfully`, 'success');
  }
  
  saveToStorage(type, data) {
    storage.set(`admin_${type}`, data);
  }
  
  loadFromStorage(type) {
    return storage.get(`admin_${type}`);
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  getCategoryName(categoryId) {
    const categories = {
      '01': 'MASTER PLANING',
      '02': 'SOCIAL',
      '03': 'HOTEL - LEISURE',
      '04': 'RESEDENTIAL',
      '05': 'COMMERCIAL',
      '06': 'TRANSPORTING'
    };
    return categories[categoryId] || 'Unknown';
  }
  
  showToast(message, type = 'info') {
    const toast = createElement('div', {
      className: `toast toast--${type}`,
      innerHTML: `
        <div class="toast__content">
          <span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
          <span class="toast__message">${message}</span>
          <button class="toast__close">&times;</button>
        </div>
      `
    });
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      addClass(toast, 'toast--show');
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideToast(toast);
    }, 3000);
    
    // Close button
    const closeBtn = $('.toast__close', toast);
    addEvent(closeBtn, 'click', () => {
      this.hideToast(toast);
    });
  }
  
  hideToast(toast) {
    removeClass(toast, 'toast--show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Make adminPanel globally available for onclick handlers
window.adminPanel = adminPanel;
