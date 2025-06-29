// controllers/pumpController.js
export const activateNutrientA = (req, res) => {
  console.log("Pompa Nutrien A diaktifkan");
  res.json({ message: "Pompa Nutrien A diaktifkan" });
};

export const activateNutrientB = (req, res) => {
  console.log("Pompa Nutrien B diaktifkan");
  res.json({ message: "Pompa Nutrien B diaktifkan" });
};

export const activatePhUp = (req, res) => {
  console.log("Pompa pH Up diaktifkan");
  res.json({ message: "Pompa pH Up diaktifkan" });
};

export const activatePhDown = (req, res) => {
  console.log("Pompa pH Down diaktifkan");
  res.json({ message: "Pompa pH Down diaktifkan" });
};
