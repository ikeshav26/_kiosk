/**
 * Scene Router - Handles URL-based scene navigation for the virtual tour
 * Automatically updates URL when scene changes and loads scene from URL params
 */
(function() {
    // Store original initialization
    const originalInit = window.onload;
    
    // Scene Router object
    window.SceneRouter = {
        currentSceneId: null,
        tourData: null,
        sceneMap: new Map(), // Maps sceneId to scene object
        
        // Initialize the router after tour data is loaded
        init: function() {
            // Wait for tourData to be available
            const checkTourData = setInterval(() => {
                if (window.tourData && window.tourData.scenes) {
                    clearInterval(checkTourData);
                    this.setup(window.tourData);
                } else if (window.PANOLENS) {
                    // Try alternate location
                    clearInterval(checkTourData);
                    this.waitForViewer();
                }
            }, 100);
        },
        
        // Setup router with tour data
        setup: function(data) {
            this.tourData = data;
            
            // Build scene map for quick lookup
            if (data.scenes && Array.isArray(data.scenes)) {
                data.scenes.forEach(scene => {
                    if (scene.id) {
                        this.sceneMap.set(scene.id, scene);
                    }
                });
            }
            
            // Check URL for initial scene
            const urlParams = new URLSearchParams(window.location.search);
            const sceneIdFromUrl = urlParams.get('sceneId');
            
            if (sceneIdFromUrl && this.sceneMap.has(sceneIdFromUrl)) {
                this.currentSceneId = sceneIdFromUrl;
                console.log('Scene Router: Loading scene from URL param:', sceneIdFromUrl);
            }
            
            // Hook into viewer to detect scene changes
            this.setupViewerListener();
        },
        
        // Wait for PANOLENS viewer to be initialized
        waitForViewer: function() {
            const checkViewer = setInterval(() => {
                if (window.PANOLENS && window.PANOLENS.Viewer && document.querySelector('[data-panolens-viewer]')) {
                    clearInterval(checkViewer);
                    
                    // Get all scenes from the viewer
                    setTimeout(() => {
                        this.setupViewerListener();
                    }, 500);
                }
            }, 100);
        },
        
        // Setup listener for scene changes in the viewer
        setupViewerListener: function() {
            try {
                // Try to find the viewer instance
                let viewer = null;
                
                // Method 1: Look for viewer in window
                if (window.PANOLENS && window.PANOLENS.viewer) {
                    viewer = window.PANOLENS.viewer;
                }
                
                // Method 2: Look in DOM
                if (!viewer && window.PANOLENS && window.PANOLENS.Viewer) {
                    const viewerEl = document.querySelector('[data-panolens-viewer]');
                    if (viewerEl && viewerEl.__viewer) {
                        viewer = viewerEl.__viewer;
                    }
                }
                
                if (viewer) {
                    console.log('Scene Router: Viewer found, setting up scene change listener');
                    
                    // Listen for enter-scene event
                    if (viewer.addEventListener) {
                        viewer.addEventListener('panolens-viewer-handler', (e) => {
                            if (e.detail && e.detail.method === 'onSceneChange') {
                                const scene = e.detail.data;
                                if (scene && scene.id) {
                                    this.onSceneChange(scene.id);
                                }
                            }
                        });
                    }
                    
                    // Alternative: Monitor all scenes
                    this.monitorSceneChanges();
                } else {
                    console.log('Scene Router: Viewer not yet available, will try again');
                    setTimeout(() => this.setupViewerListener(), 500);
                }
            } catch (e) {
                console.log('Scene Router: Error setting up viewer listener', e);
                // Continue with alternative monitoring
                this.monitorSceneChanges();
            }
        },
        
        // Monitor scene changes through observer
        monitorSceneChanges: function() {
            // Create observer for scene visibility changes
            const observer = new MutationObserver(() => {
                this.detectCurrentScene();
            });
            
            observer.observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class', 'style']
            });
            
            // Also check periodically
            setInterval(() => {
                this.detectCurrentScene();
            }, 1000);
        },
        
        // Detect current scene based on DOM
        detectCurrentScene: function() {
            try {
                // Look for visible canvas or active panorama
                const scenes = document.querySelectorAll('[data-scene-id]');
                scenes.forEach(scene => {
                    if (scene.style.display !== 'none' && scene.clientHeight > 0) {
                        const sceneId = scene.getAttribute('data-scene-id');
                        if (sceneId && sceneId !== this.currentSceneId) {
                            this.onSceneChange(sceneId);
                        }
                    }
                });
            } catch (e) {
                // Silent fail
            }
        },
        
        // Called when scene changes
        onSceneChange: function(sceneId) {
            if (sceneId && sceneId !== this.currentSceneId) {
                this.currentSceneId = sceneId;
                this.updateUrlForScene(sceneId);
                console.log('Scene Router: Scene changed to', sceneId);
            }
        },
        
        // Update URL with scene ID
        updateUrlForScene: function(sceneId) {
            const url = new URL(window.location);
            url.searchParams.set('sceneId', sceneId);
            
            // Use replaceState to avoid adding to history
            window.history.replaceState({ sceneId: sceneId }, '', url.toString());
        },
        
        // Extract scene ID from image filename
        extractSceneIdFromImage: function(imagePath) {
            // Match pattern: scene-{ID}.jpg
            const match = imagePath.match(/scene-([^\/]+)\.(jpg|png)/i);
            if (match) {
                return match[1];
            }
            return null;
        },
        
        // Get scene by ID
        getScene: function(sceneId) {
            return this.sceneMap.get(sceneId);
        },
        
        // Navigate to specific scene
        navigateToScene: function(sceneId) {
            const scene = this.getScene(sceneId);
            if (scene && window.PANOLENS && window.PANOLENS.viewer) {
                this.onSceneChange(sceneId);
                // The viewer should have a method to switch scenes
                if (window.PANOLENS.viewer.showScene) {
                    window.PANOLENS.viewer.showScene(scene);
                }
            }
        }
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.SceneRouter.init();
        });
    } else {
        window.SceneRouter.init();
    }
})();
