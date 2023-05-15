
export function calculateBonusesByType (arrayOfBonuses) {
    // Takes an array of objects
    // Returns an integer
    const types = [];
    const bonuses = {};
    let final = 0;
    arrayOfBonuses.forEach(bonus => {
        const { type, value } = bonus;
        if(!type || value <= 0) {
            // Typeless bonuses always stack
            // Penalties always stack
            final += value;
            return;
        }
        // Create an array for this specific 'type' if needed
        if(!bonuses[type]) {
            types.push(type);
            bonuses[type] = [];
        }
        // Add bonus to type's array
        bonuses[type].push(value);
    });
    // Only keep the largest bonus of each type
    types.forEach(type => {
        final += Math.max(...bonuses[type]);
    });
    // Return the result
    return final;
};