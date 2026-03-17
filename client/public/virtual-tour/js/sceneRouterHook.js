/**
 * Scene Router Engine Hook - Integrates with PANOLENS engine to detect scene changes
 * Hooks into the image loading mechanism to capture when scenes change
 */
(function() {
    // Extended scene router with engine integration
    window.SceneRouterHook = {
        enabled: true,
        lastLoadedImage: null,
        
        init: function() {
            this.hookIntoImageLoader();
            this.hookIntoPanorama();
            this.setupHashNavigation();
        },
        
        // Hook into the image loader to detect scene changes
        hookIntoImageLoader: function() {
            // Patch the TextureLoader's load method
            if (window.THREE && window.THREE.TextureLoader) {
                const originalLoad = window.THREE.TextureLoader.prototype.load;
                const self = this;
                
                window.THREE.TextureLoader.prototype.load = function(url, onLoad, onProgress, onError) {
                    // Call the original load
                    const texture = originalLoad.call(this, url, onLoad, onProgress, onError);
                    
                    // Check if this is a scene image
                    if (url && typeof url === 'string' && url.includes('scene-')) {
                        self.onImageLoaded(url);
                    }
                    
                    return texture;
                };
            }
        },
        
        // Hook into PANOLENS panorama to detect when panorama/scene is shown
        hookIntoPanorama: function() {
            const checkPanolens = setInterval(() => {
                if (window.PANOLENS && window.PANOLENS.ImagePanorama) {
                    clearInterval(checkPanolens);
                    
                    const originalInit = window.PANOLENS.ImagePanorama.prototype.initialize;
                    const self = this;
                    
                    if (originalInit) {
                        window.PANOLENS.ImagePanorama.prototype.initialize = function() {
                            const result = originalInit.call(this);
                            
                            // When panorama initializes, extract scene ID from image
                            if (this.image && this.image instanceof Image) {
                                const url = this.image.src;
                                self.onImageLoaded(url);
                            }
                            
                            return result;
                        };
                    }
                    
                    // Also hook the update method
                    const originalUpdate = window.PANOLENS.ImagePanorama.prototype.update;
                    if (originalUpdate) {
                        window.PANOLENS.ImagePanorama.prototype.update = function() {
                            const result = originalUpdate.call(this);
                            
                            if (this.getImage && this.getImage.src) {
                                self.onImageLoaded(this.getImage().src);
                            }
                            
                            return result;
                        };
                    }
                }
            }, 100);
        },
        
        // When an image is loaded
        onImageLoaded: function(imageUrl) {
            if (!imageUrl) return;
            
            const sceneId = this.extractSceneIdFromUrl(imageUrl);
            
            if (sceneId && sceneId !== this.lastLoadedImage) {
                this.lastLoadedImage = sceneId;
                this.updateRoute(sceneId);
            }
        },
        
        // Extract scene ID from image URL
        extractSceneIdFromUrl: function(url) {
            // Pattern: .../scene-{ID}.jpg or images/scene-{ID}.jpg
            const match = url.match(/scene-([^\/\?\.]+)/i);
            if (match && match[1]) {
                return match[1];
            }
            return null;
        },
        
        // Update the browser URL/route
        updateRoute: function(sceneId) {
            if (window.SceneRouter) {
                window.SceneRouter.onSceneChange(sceneId);
            } else {
                // Fallback if SceneRouter not initialized yet
                const url = new URL(window.location);
                url.searchParams.set('sceneId', sceneId);
                window.history.replaceState({ sceneId: sceneId }, '', url.toString());
            }
            
            console.log('✓ Scene route updated:', sceneId);
        },
        
        // Setup navigation via URL hash or query param
        setupHashNavigation: function() {
            window.addEventListener('hashchange', () => {
                this.navigateFromUrl();
            });
            
            // Check on load
            setTimeout(() => {
                this.navigateFromUrl();
            }, 2000);
        },
        
        // Navigate to scene from URL params
        navigateFromUrl: function() {
            const params = new URLSearchParams(window.location.search);
            const sceneId = params.get('sceneId');
            
            if (sceneId && window.SceneRouter && window.SceneRouter.sceneMap.has(sceneId)) {
                console.log('Navigating to scene from URL:', sceneId);
                // The router will handle scene navigation
            }
        }
    };
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.SceneRouterHook.init();
        });
    } else {
        window.SceneRouterHook.init();
    }
})();
