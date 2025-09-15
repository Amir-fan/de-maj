// DE-MAJ Architecture - Simple Router

import { $, $$, addEvent } from './dom.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.init();
  }
  
  init() {
    // Handle browser back/forward
    addEvent(window, 'popstate', () => {
      this.handleRoute();
    });
    
    // Handle initial route
    this.handleRoute();
  }
  
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }
  
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }
  
  handleRoute() {
    const path = window.location.pathname;
    const route = this.findRoute(path);
    
    if (route) {
      this.currentRoute = route;
      route.handler(path);
    } else {
      this.handle404();
    }
  }
  
  findRoute(path) {
    for (const [routePath, handler] of this.routes) {
      if (this.matchRoute(routePath, path)) {
        return { path: routePath, handler };
      }
    }
    return null;
  }
  
  matchRoute(routePath, actualPath) {
    // Simple exact match for now
    // Could be extended to support parameters
    return routePath === actualPath;
  }
  
  handle404() {
    console.warn('Route not found:', window.location.pathname);
  }
  
  // Helper method to get route parameters
  getParams() {
    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return Object.fromEntries(params);
  }
}

// Create global router instance
const router = new Router();

export default router;
