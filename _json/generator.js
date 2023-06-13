
export function calculateBonusesByType (...arrayOfBonuses) {
    // Takes an array of objects
    // Returns an integer
    const types = [];
    const bonuses = {};
    let final = 0;
    this._flatten(arrayOfBonuses).forEach(bonus => {
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

export function getNearbyAlignments (alignment) {
    // Takes a string alignment
    // Returns an array of alignments one step away from it
    if(alignment === "Unaligned") {
        return [ "LG", "LN", "LE", "NG", "N", "NE", "CG", "CN", "CE" ];
    } else if(alignment === "N") {
        return [ "LN", "NG", "N", "NE", "CN" ];
    }
    const [structure, morality] = alignment.split('');
    if(structure === "N") {
        return [ `L${morality}`, "N", `C${morality}`, alignment ];
    } else if (morality === "N") {
        return [ `${structure}G`, "N", `${structure}E`, alignment ];
    }
    return [ `N${morality}`, `${structure}N`, alignment ];
}


/**
 ************ THIS IS FOR FUTURE USE ************
 *
 * Produces a function which uses template strings to do simple interpolation from objects.
 * 
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
 * 
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 */
const generateTemplateString = (function(){
    let cache = {};

    function generateTemplate(template){
        let fn = cache[template];

        if (!fn){
            // Replace ${expressions} (etc) with ${map.expressions}.

            const sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                    return `\$\{map.${match.trim()}\}`;
                    })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            fn = Function('map', `return \`${sanitized}\``);
        }

        return fn;
    }

    return generateTemplate;
})();
