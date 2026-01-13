const calculateSurgePrice = (basePrice, seatsAvailable) => {
  let surgeMultiplier = 1;

  if (seatsAvailable < 10) {
    surgeMultiplier = 1.4; // +40%
  } else if (seatsAvailable < 20) {
    surgeMultiplier = 1.2; // +20%
  }

  return Math.round(basePrice * surgeMultiplier);
};

export { calculateSurgePrice };
