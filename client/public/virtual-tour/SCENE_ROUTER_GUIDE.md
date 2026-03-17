# Scene Router - Virtual Tour URL-based Navigation

## Overview

The Scene Router system allows direct navigation to specific scenes in the virtual tour through URL parameters. This enables:

- **Deep linking** - Share links to specific scenes
- **Bookmarking** - Users can bookmark specific locations in the tour
- **Direct navigation** - Jump directly to any scene by sceneId
- **State persistence** - The current scene is reflected in the URL

## How It Works

### 1. Automatic Scene Detection
When you navigate through scenes in the tour, the system automatically:
- Detects when a new scene image loads
- Extracts the sceneId from the image filename (e.g., `scene-T2UcAkhP1.jpg` → `T2UcAkhP1`)
- Updates the browser URL with the current sceneId

### 2. URL Format
The scene is stored as a query parameter:
```
https://yoursite.com/virtual-tour/index.html?sceneId=T2UcAkhP1
```

### 3. Direct Navigation
When someone visits a URL with a sceneId parameter, the tour will load and attempt to navigate to that specific scene.

## Usage Examples

### Direct URL Navigation
```
# Visit Girls Hostel Midway
https://campus360.edu.in/virtual-tour/?sceneId=T2UcAkhP1

# Visit Workshop Crossroad
https://campus360.edu.in/virtual-tour/?sceneId=vhHXHHHnNa-

# Visit MP Workshop
https://campus360.edu.in/virtual-tour/?sceneId=oGBSvHXoByM
```

### JavaScript API
```javascript
// Get current scene ID
const currentScene = window.SceneRouter.currentSceneId;

// Navigate to a specific scene
if (window.SceneRouter.navigateToScene) {
    window.SceneRouter.navigateToScene('T2UcAkhP1');
}

// Get scene details
const scene = window.SceneRouter.getScene('T2UcAkhP1');
if (scene) {
    console.log('Scene title:', scene.title);
    console.log('Scene URL:', scene.url);
}

// Get all available scenes
const scenes = window.SceneRouter.tourData.scenes;
scenes.forEach(scene => {
    console.log(scene.id, ':', scene.title);
});
```

## Implementation Details

### Files Modified
1. **index.html** - Added scene router scripts
2. **js/sceneRouter.js** - Main routing logic
3. **js/sceneRouterHook.js** - Engine integration hooks

### How Scene Detection Works

1. **Image Loading Hook** - Monitors when images are loaded via THREE.TextureLoader
2. **Scene ID Extraction** - Parses the filename to extract sceneId
3. **URL Update** - Updates browser history with the current sceneId
4. **State Management** - Maintains current scene state

### Scene ID to Image Mapping

The system automatically extracts scene IDs from image filenames:

```
Image File: scene-T2UcAkhP1.jpg
↓
Scene ID: T2UcAkhP1
↓
URL: ?sceneId=T2UcAkhP1
```

## Advanced Usage

### Redirect to Scene
Create a redirect link to any scene:
```html
<a href="?sceneId=T2UcAkhP1">Visit Girls Hostel</a>
```

### Generate Scene Links Dynamically
```javascript
// Generate links for all scenes
window.SceneRouter.tourData.scenes.forEach(scene => {
    const link = `?sceneId=${scene.id}`;
    console.log(`${scene.title}: ${link}`);
});
```

### Track Scene Changes
```javascript
// Listen for URL changes
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.sceneId) {
        console.log('Navigated to scene:', event.state.sceneId);
    }
});
```

## Complete Scene List (Example)

Based on tourData.js, here are some available scenes:

| Scene ID | Title | Image |
|----------|-------|-------|
| T2UcAkhP1 | Girls Hostel Midway | scene-T2UcAkhP1.jpg |
| vhHXHHHnNa- | Workshop Crossroad | scene-vhHXHHHnNa-.jpg |
| oGBSvHXoByM | Way to MP Workshop | scene-oGBSvHXoByM.jpg |
| 2ZrYa9OBH | MP WORKSHOP (FRONT VIEW) | scene-2ZrYa9OBH.jpg |
| ujLRXkV52 | Work Shop Inner | scene-ujLRXkV52.jpg |
| Zl9rcKR4a | WORKSHOP Corridor | scene-Zl9rcKR4a.jpg |
| iie8v4vl- | Toyota Learning Shop | scene-iie8v4vl-.jpg |
| J9Qpg8Yj4 | Welding shop | scene-J9Qpg8Yj4.jpg |
| 6r2O3-mko | Foundary shop | scene-6r2O3-mko.jpg |
| 4DdHS3125Ip | Lathe Machine Shop | scene-4DdHS3125Ip.jpg |

## Troubleshooting

### Scene Not Loading
- Verify the sceneId exists in tourData.js
- Check browser console for errors
- Ensure the image file exists in the images/ folder

### URL Not Updating
- Check that sceneRouterHook.js is loaded
- Verify images are being loaded correctly
- Check browser console for any JavaScript errors

### Navigation Not Working
- Ensure the viewer is fully initialized
- Wait a few seconds after page load before navigating
- Check that `window.PANOLENS` is available

## Console Debugging

Enable verbose logging:
```javascript
// Check if router is initialized
console.log('Router ready:', !!window.SceneRouter);
console.log('Current scene:', window.SceneRouter?.currentSceneId);
console.log('Total scenes:', window.SceneRouter?.sceneMap.size);

// List all available scenes
Array.from(window.SceneRouter?.sceneMap.keys()).forEach(id => {
    const scene = window.SceneRouter.sceneMap.get(id);
    console.log(`${id}: ${scene.title}`);
});
```

## Future Enhancements

Potential improvements:
- [ ] Add scene transition animations
- [ ] Implement scene navigation history
- [ ] Add scene search functionality
- [ ] Create a scene selector UI
- [ ] Support for camera position parameters
- [ ] Scene favorites/bookmarks
