/**
 * App Manager - Centralized application state and component management
 */

class AppManager {
  constructor() {
    this.state = {
      initialized: false,
      loading: false,
      error: null,
      components: new Map(),
      eventListeners: new Map()
    };
    
    this.config = {
      debug: true,
      version: '1.0.0',
      apiEndpoint: '/api',
      supportedLanguages: ['en', 'ar', 'fr'],
      defaultLanguage: 'en',
      defaultTheme: 'dark'
    };
  }

  // Component registration and management
  registerComponent(name, instance) {
    if (this.state.components.has(name)) {
      console.warn(`Component '${name}' is already registered`);
      return false;
    }
    
    this.state.components.set(name, instance);
    this.log(`📝 Component '${name}' registered`);
    return true;
  }

  getComponent(name) {
    return this.state.components.get(name);
  }

  hasComponent(name) {
    return this.state.components.has(name);
  }

  // Event management
  addEventListener(event, handler, component = 'global') {
    if (!this.state.eventListeners.has(event)) {
      this.state.eventListeners.set(event, []);
    }
    
    this.state.eventListeners.get(event).push({
      handler,
      component
    });
  }

  removeEventListener(event, handler) {
    if (!this.state.eventListeners.has(event)) return;
    
    const listeners = this.state.eventListeners.get(event);
    const index = listeners.findIndex(l => l.handler === handler);
    
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, data = null) {
    if (!this.state.eventListeners.has(event)) return;
    
    const listeners = this.state.eventListeners.get(event);
    listeners.forEach(({ handler }) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for '${event}':`, error);
      }
    });
  }

  // State management
  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    this.emit('stateChanged', { key, value, oldValue });
  }

  getState(key) {
    return key ? this.state[key] : this.state;
  }

  // Utility methods
  log(message, ...args) {
    if (this.config.debug) {
      console.log(`[AppManager] ${message}`, ...args);
    }
  }

  error(message, ...args) {
    console.error(`[AppManager] ${message}`, ...args);
  }

  // Initialization helpers
  async initializeWithRetry(initFunction, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await initFunction();
        return true;
      } catch (error) {
        this.error(`Initialization attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Component lifecycle management
  async destroyComponent(name) {
    const component = this.getComponent(name);
    if (!component) return;
    
    try {
      if (typeof component.destroy === 'function') {
        await component.destroy();
      }
      
      // Remove event listeners for this component
      this.state.eventListeners.forEach((listeners, event) => {
        const filtered = listeners.filter(l => l.component !== name);
        this.state.eventListeners.set(event, filtered);
      });
      
      this.state.components.delete(name);
      this.log(`🗑️ Component '${name}' destroyed`);
    } catch (error) {
      this.error(`Failed to destroy component '${name}':`, error);
    }
  }

  async refreshComponent(name) {
    const component = this.getComponent(name);
    if (!component) return;
    
    try {
      if (typeof component.refresh === 'function') {
        await component.refresh();
        this.log(`🔄 Component '${name}' refreshed`);
      }
    } catch (error) {
      this.error(`Failed to refresh component '${name}':`, error);
    }
  }

  // Global refresh
  async refreshAll() {
    this.log('🔄 Refreshing all components...');
    
    const refreshPromises = Array.from(this.state.components.entries()).map(
      async ([name, component]) => {
        try {
          if (typeof component.refresh === 'function') {
            await component.refresh();
          }
        } catch (error) {
          this.error(`Failed to refresh component '${name}':`, error);
        }
      }
    );
    
    await Promise.all(refreshPromises);
    this.log('✅ All components refreshed');
  }

  // Health check
  getHealthStatus() {
    const componentCount = this.state.components.size;
    const eventListenerCount = Array.from(this.state.eventListeners.values())
      .reduce((sum, listeners) => sum + listeners.length, 0);
    
    return {
      initialized: this.state.initialized,
      loading: this.state.loading,
      error: this.state.error,
      components: componentCount,
      eventListeners: eventListenerCount,
      version: this.config.version,
      timestamp: new Date().toISOString()
    };
  }

  // Debugging helpers
  debugInfo() {
    return {
      state: this.state,
      config: this.config,
      components: Array.from(this.state.components.keys()),
      events: Array.from(this.state.eventListeners.keys()),
      health: this.getHealthStatus()
    };
  }
}

// Create global instance
window.appManager = new AppManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppManager;
}
