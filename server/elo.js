function rating(rWinner, rLoser, k) {
	let pWinner = winningProbability(rWinner, rLoser);
	let pLoser = winningProbability(rLoser, rWinner);
	return { winner: rWinner + k * (1 - pWinner), loser: rLoser + k * (0 - pLoser) }; 
}

function winningProbability(rWinner, rLoser) {
	return 1 / (1 + Math.pow(10, (rLoser - rWinner) / 400));
}

console.log(rating(1200, 1000, 35));
console.log(rating(1000, 1200, 35));
