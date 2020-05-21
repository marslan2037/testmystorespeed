export default class ImpactType {

    constructor(id, category, impact, effort, display) {
        this.id = id;
        this.category = category;
        this.impact = impact;
        this.effort = effort;
        this.display = display;
    }
  
    getSortOrder() {
        return this.impact - this.effort;
    }
  
    getImpactString() {
        let s = "N/A";
        
        if (this.impact === 1) s = "Low"
        if (this.impact === 2) s = "Medium"
        if (this.impact === 3) s = "High"
        
        return s
    }
  
    getEffortString() {
        let s = "N/A";
        
        if (this.effort === 1) s = "Low"
        if (this.effort === 2) s = "Medium"
        if (this.effort === 3) s = "High"
        
        return s
    }
  }
  