const tips = [
    "Carpooling once a week can reduce annual emissions by over 25 kg.",
    "Switch to LED light bulbs to save energy and lower your electricity bill.",
    "Unplug electronics when not in use; they still draw power in standby mode.",
    "Reduce, Reuse, Recycle. Follow this mantra to minimize waste.",
    "A single tree can absorb as much as 21 kg of CO₂ per year.",
    "Try a 'meatless Monday' to reduce your carbon footprint from food.",
    "Properly inflating your tires can improve fuel efficiency by up to 3%.",
    "Use a reusable water bottle instead of buying single-use plastic ones.",
    "Wash your clothes in cold water to save energy on heating.",
    "Support local farmers' markets to reduce emissions from long-distance food transport."
];

export function getEcoTip(): string {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
}
