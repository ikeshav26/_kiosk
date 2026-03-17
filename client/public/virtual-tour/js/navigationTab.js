/**
 * Navigation Tab UI for Scene Router
 * Displays clickable location labels that navigate directly to scenes
 * Works with sceneRouter.js and navigationData.js
 */

class NavigationTab {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.position = options.position || 'bottom'; // 'bottom', 'left', 'right', 'top'
    this.visible = true;
    this.buildingData = window.navigationData?.getVisibleBuildings() || [];
    this.activeSceneId = null;

    this.init();
  }

  init() {
    this.createHTML();
    this.attachEventListeners();
    this.watchSceneChanges();
  }

  createHTML() {
    // Create main container
    const nav = document.createElement('div');
    nav.id = 'navigation-tab';
    nav.className = `nav-tab nav-${this.position}`;
    nav.innerHTML = `
      <div class="nav-header">
        <span class="nav-title">📍 Locations</span>
        <button class="nav-toggle" title="Toggle Navigation">
          <span class="nav-icon">⊕</span>
        </button>
      </div>
      <div class="nav-content">
        <div class="nav-search">
          <input 
            type="text" 
            class="nav-search-input" 
            placeholder="Search location..."
          >
        </div>
        <div class="nav-list"></div>
      </div>
    `;

    // Add styles
    this.addStyles();

    // Append to container
    this.container.appendChild(nav);

    // Populate list
    this.populateList();
  }

  addStyles() {
    if (document.getElementById('nav-tab-styles')) return;

    const style = document.createElement('style');
    style.id = 'nav-tab-styles';
    style.innerHTML = `
      #navigation-tab {
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 1000;
        max-width: 300px;
        font-size: 14px;
      }

      #navigation-tab.nav-bottom {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 500px;
      }

      #navigation-tab.nav-left {
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 280px;
        max-height: 70vh;
      }

      #navigation-tab.nav-right {
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 280px;
        max-height: 70vh;
      }

      #navigation-tab.nav-top {
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 500px;
      }

      .nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
      }

      .nav-title {
        font-weight: 600;
        font-size: 15px;
      }

      .nav-toggle {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
      }

      .nav-toggle:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .nav-content {
        display: flex;
        flex-direction: column;
        max-height: 400px;
        overflow: hidden;
        animation: slideDown 0.3s ease forwards;
      }

      .nav-content.collapsed {
        max-height: 0;
        animation: slideUp 0.3s ease forwards;
      }

      @keyframes slideDown {
        from {
          max-height: 0;
          opacity: 0;
        }
        to {
          max-height: 400px;
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          max-height: 400px;
          opacity: 1;
        }
        to {
          max-height: 0;
          opacity: 0;
        }
      }

      .nav-search {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
      }

      .nav-search-input {
        width: 100%;
        padding: 8px 12px;
        border: 2px solid #e0e0e0;
        border-radius: 4px;
        font-size: 13px;
        outline: none;
        transition: border-color 0.3s ease;
      }

      .nav-search-input:focus {
        border-color: #667eea;
      }

      .nav-list {
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1;
      }

      .nav-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .nav-item:hover {
        background: #f5f5f5;
        transform: translateX(4px);
      }

      .nav-item.active {
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-left: 4px solid #667eea;
        padding-left: 12px;
        font-weight: 600;
        color: #667eea;
      }

      .nav-item-info {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .nav-item-name {
        font-weight: 500;
        margin-bottom: 2px;
      }

      .nav-item-sub {
        font-size: 12px;
        color: #999;
      }

      .nav-item-id {
        font-size: 11px;
        color: #bbb;
        font-family: 'Courier New', monospace;
        margin-left: 8px;
        word-break: break-all;
      }

      .nav-empty {
        padding: 20px;
        text-align: center;
        color: #999;
        font-size: 13px;
      }

      /* Scrollbar styling */
      .nav-list::-webkit-scrollbar {
        width: 6px;
      }

      .nav-list::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .nav-list::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }

      .nav-list::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        #navigation-tab {
          max-width: 280px;
        }

        #navigation-tab.nav-bottom,
        #navigation-tab.nav-top {
          width: 95%;
        }

        .nav-content {
          max-height: 300px;
        }

        .nav-item {
          padding: 10px 12px;
          font-size: 13px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  populateList() {
    const listContainer = document.querySelector('.nav-list');
    listContainer.innerHTML = '';

    if (!this.buildingData || this.buildingData.length === 0) {
      listContainer.innerHTML = '<div class="nav-empty">No locations available</div>';
      return;
    }

    this.buildingData.forEach(building => {
      const item = document.createElement('div');
      item.className = 'nav-item';
      item.dataset.sceneId = building.navigationmapID;
      item.innerHTML = `
        <div class="nav-item-info">
          <div class="nav-item-name">${building.name}</div>
          ${building.sub ? `<div class="nav-item-sub">${building.sub}</div>` : ''}
        </div>
        <div class="nav-item-id">${building.navigationmapID}</div>
      `;

      item.addEventListener('click', () => this.navigateToScene(building.navigationmapID, item));
      listContainer.appendChild(item);
    });
  }

  navigateToScene(sceneId, element) {
    console.log('[NavigationTab] Navigating to scene:', sceneId);

    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element?.classList.add('active');

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('sceneId', sceneId);
    window.history.replaceState({}, '', url);

    this.activeSceneId = sceneId;

    // Try to find the scene and switch using the viewer's built-in methods
    if (window.PANOLENS && window.PANOLENS.viewer) {
      console.log('[NavigationTab] PANOLENS viewer found, attempting to switch scene');
      
      try {
        // Get all scenes from the viewer
        const allScenes = window.PANOLENS.viewer.scenes || [];
        console.log('[NavigationTab] Available scenes:', allScenes.length);
        
        // Find scene by image URL matching the sceneId
        const targetScene = allScenes.find(scene => {
          if (scene.image && scene.image.src) {
            const match = scene.image.src.match(/scene-([^\/\?\.]+)/i);
            return match && match[1] === sceneId;
          }
          return false;
        });
        
        if (targetScene) {
          console.log('[NavigationTab] Found target scene, switching...');
          // Use the viewer's method to show the scene
          if (window.PANOLENS.viewer.showScene) {
            window.PANOLENS.viewer.showScene(targetScene);
          } else if (window.PANOLENS.viewer.setScene) {
            window.PANOLENS.viewer.setScene(targetScene);
          } else {
            // Try alternative: dispatch viewer event
            window.PANOLENS.viewer.dispatchEvent({ type: 'scene-changed', scene: targetScene });
          }
        } else {
          console.log('[NavigationTab] Scene not found in viewer, reloading page');
          window.location.reload();
        }
      } catch (error) {
        console.error('[NavigationTab] Error switching scene:', error);
        window.location.reload();
      }
    } else {
      console.log('[NavigationTab] PANOLENS viewer not available, reloading page');
      window.location.reload();
    }
  }

  watchSceneChanges() {
    // Listen for scene changes from SceneRouter
    const checkSceneId = () => {
      const params = new URLSearchParams(window.location.search);
      const currentSceneId = params.get('sceneId');

      if (currentSceneId && currentSceneId !== this.activeSceneId) {
        this.activeSceneId = currentSceneId;
        const item = document.querySelector(`[data-scene-id="${currentSceneId}"]`);
        if (item) {
          document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        }
      }
    };

    // Check on load and periodically
    checkSceneId();
    setInterval(checkSceneId, 500);

    // Listen to popstate events (browser back/forward)
    window.addEventListener('popstate', checkSceneId);
  }

  attachEventListeners() {
    const toggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('.nav-header');
    const content = document.querySelector('.nav-content');
    const searchInput = document.querySelector('.nav-search-input');

    // Toggle collapse/expand
    if (toggle && header) {
      header.addEventListener('click', () => {
        content?.classList.toggle('collapsed');
        toggle.textContent = content?.classList.contains('collapsed') ? '⊖' : '⊕';
      });
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.nav-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'block' : 'none';
        });
      });
    }
  }

  hide() {
    const nav = document.getElementById('navigation-tab');
    if (nav) nav.style.display = 'none';
    this.visible = false;
  }

  show() {
    const nav = document.getElementById('navigation-tab');
    if (nav) nav.style.display = 'block';
    this.visible = true;
  }

  toggle() {
    this.visible ? this.hide() : this.show();
  }

  destroy() {
    const nav = document.getElementById('navigation-tab');
    if (nav) nav.remove();
  }
}

// Auto-initialization disabled - NavigationTab is instantiated only on demand
