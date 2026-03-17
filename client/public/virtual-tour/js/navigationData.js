/**
 * Hardcoded Navigation Data
 * Contains all buildings/locations with their scene IDs (navigationmapID)
 * Used by the navigation tab to allow direct jumping to scenes
 */

window.navigationData = {
  buildings: [
    {
      id: "block_a",
      name: "Block A",
      sub: "",
      navigationmapID: "ndOApxJoL"
    },
    {
      id: "block_b",
      name: "Block B",
      sub: "",
      navigationmapID: "SQKRUL6DV"
    },
    {
      id: "block_c",
      name: "Block C",
      sub: "Agriculture Dept.",
      navigationmapID: "Q8Ke_egMx"
    },
    {
      id: "block_d",
      name: "Block D",
      sub: "",
      navigationmapID: "L6GdNLSBrIy"
    },
    {
      id: "block_e",
      name: "Block E",
      sub: "",
      navigationmapID: "5Pd9XFNOX"
    },
    {
      id: "block_f",
      name: "F block",
      sub: "",
      navigationmapID: "5Pd9XFNOX"
    },
    {
      id: "school",
      name: "School",
      sub: "",
      navigationmapID: "UohmalxTf"
    },
    {
      id: "library",
      name: "Innovation Lab",
      sub: "",
      navigationmapID: ""
    },
    {
      id: "management_block",
      name: "Management Block",
      sub: "",
      navigationmapID: ""
    },
    {
      id: "manufacturing_workshop",
      name: "Mp workshop",
      sub: "",
      navigationmapID: "2ZrYa9OBH"
    },
    {
      id: "cad_office",
      name: "CAD Office",
      sub: "",
      navigationmapID: "Q8Ke_egMx"
    },
    {
      id: "mini_seminar_hall",
      name: "main seminar hall",
      sub: "",
      navigationmapID: "5mv7WJ6-QJC"
    },
    {
      id: "boys_hostel",
      name: "Boys hostel",
      sub: "",
      navigationmapID: "CBm09mc8zMC"
    },
    {
      id: "girls_hostel",
      name: "girls hostel",
      sub: "",
      navigationmapID: "1-eH8pLDL"
    },
    {
      id: "A_block",
      name: "A block",
      sub: "",
      navigationmapID: "ndOApxJoL"
    },
    {
      id: "i_block",
      name: "i block",
      sub: "",
      navigationmapID: "b57_ujvoR"
    },
    {
      id: "parking",
      name: "parking",
      sub: "",
      navigationmapID: "5sD6isScO"
    }
  ],

  /**
   * Get building by ID
   * @param {string} id - Building ID
   * @returns {object|null} Building object or null if not found
   */
  getBuilding(id) {
    return this.buildings.find(b => b.id === id) || null;
  },

  /**
   * Get building by scene ID (navigationmapID)
   * @param {string} sceneId - Scene ID
   * @returns {object|null} Building object or null if not found
   */
  getBuildingBySceneId(sceneId) {
    return this.buildings.find(b => b.navigationmapID === sceneId) || null;
  },

  /**
   * Get all buildings with valid scene IDs
   * @returns {array} Array of buildings that have navigationmapID
   */
  getVisibleBuildings() {
    return this.buildings.filter(b => b.navigationmapID && b.navigationmapID.trim());
  }
};
