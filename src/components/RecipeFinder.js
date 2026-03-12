import React, { useState } from 'react';

const RecipeFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipes = [
    {
      id: 1,
      title: "Avocado Toast with Poached Egg",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop",
      time: "15 min",
      difficulty: "Easy",
      tags: ["Breakfast", "Healthy"],
      ingredients: [
        "2 slices of sourdough bread",
        "1 ripe avocado",
        "2 large eggs",
        "Red pepper flakes",
        "Salt and pepper",
        "Lemon juice"
      ],
      instructions: [
        "Toast the sourdough bread slices until golden brown.",
        "In a small bowl, mash the avocado with lemon juice, salt, and pepper.",
        "Poach the eggs in simmering water for 3-4 minutes.",
        "Spread the mashed avocado on the toast.",
        "Top with poached eggs and sprinkle with red pepper flakes."
      ]
    },
    {
      id: 2,
      title: "Quinoa Salad with Roasted Veggies",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
      time: "40 min",
      difficulty: "Medium",
      tags: ["Lunch", "Vegan"],
      ingredients: [
        "1 cup quinoa",
        "2 cups water",
        "1 red bell pepper, chopped",
        "1 zucchini, sliced",
        "1/4 cup olive oil",
        "Fresh parsley"
      ],
      instructions: [
        "Rinse quinoa and cook in water for 15 minutes.",
        "Toss vegetables with olive oil and roast at 200°C for 25 minutes.",
        "Mix cooked quinoa with roasted vegetables and fresh parsley.",
        "Season with salt and lemon juice to taste."
      ]
    },
    {
      id: 3,
      title: "Spicy Salmon with Asparagus",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop",
      time: "25 min",
      difficulty: "Medium",
      tags: ["Dinner", "Protein"],
      ingredients: [
        "2 salmon fillets",
        "1 bunch asparagus",
        "2 tbsp sriracha",
        "1 tbsp honey",
        "1 tbsp soy sauce",
        "Garlic powder"
      ],
      instructions: [
        "Preheat oven to 200°C.",
        "Mix sriracha, honey, soy sauce, and garlic powder in a bowl.",
        "Place salmon and asparagus on a baking sheet.",
        "Brush the sauce over the salmon.",
        "Bake for 12-15 minutes until salmon is cooked through."
      ]
    },
    {
      id: 4,
      title: "Berry Blast Smoothie Bowl",
      image: "https://images.unsplash.com/photo-1494597564530-811f274cb450?w=800&auto=format&fit=crop",
      time: "10 min",
      difficulty: "Very Easy",
      tags: ["Snack", "Fruity"],
      ingredients: [
        "1 cup frozen berries",
        "1 frozen banana",
        "1/2 cup almond milk",
        "Granola",
        "Chia seeds"
      ],
      instructions: [
        "Blend frozen berries, banana, and almond milk until smooth.",
        "Pour into a bowl.",
        "Top with granola, chia seeds, and fresh berries.",
        "Enjoy immediately!"
      ]
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-100 rounded-2xl m-5 shadow-2xl font-sans">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl max-w-4xl w-full shadow-xl border border-white/40">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-amber-900 mb-2">Recipe Finder</h2>
          <p className="text-amber-700/70 text-sm italic">Discover delicious recipes for every occasion</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-10 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by meal or tag..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-amber-100 focus:outline-none focus:border-amber-400 bg-white/60 shadow-inner transition-all text-amber-900 placeholder-amber-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-amber-300">🔍</span>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group cursor-pointer bg-white/50 rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                  {recipe.difficulty}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-amber-900 leading-tight group-hover:text-amber-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <span className="text-xs text-amber-500 font-medium whitespace-nowrap ml-2">🕒 {recipe.time}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border border-amber-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-20 text-amber-500/50 italic">
            No recipes found for your quest. Try searching something else!
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-900/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-colors z-10"
              >
                ✕
              </button>
              
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-8">
                <h3 className="text-3xl font-extrabold text-amber-900 mb-4">{selectedRecipe.title}</h3>
                
                <div className="flex gap-4 mb-8">
                  <div className="bg-amber-50 px-4 py-2 rounded-2xl">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Time</p>
                    <p className="text-lg font-bold text-amber-900">{selectedRecipe.time}</p>
                  </div>
                  <div className="bg-amber-50 px-4 py-2 rounded-2xl">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Difficulty</p>
                    <p className="text-lg font-bold text-amber-900">{selectedRecipe.difficulty}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                    <span className="mr-2">🥑</span> Ingredients
                  </h4>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                    <span className="mr-2">👨‍🍳</span> Instructions
                  </h4>
                  <ol className="space-y-4">
                    {selectedRecipe.instructions.map((inst, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-900 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-amber-800 leading-relaxed">{inst}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(251, 191, 36, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
};

export default RecipeFinder;
