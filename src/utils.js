/*
3rd Party library imports
 */
const fieldSquareSize = require('config').get('fieldSquares.size');

/*
Project file imports
 */

const printFieldSquare = (fieldSquares) => {
	for (let y = 0; y < fieldSquareSize.y; y += 1) {
		let xLine = `${y} `;
		for (let x = 0; x < fieldSquareSize.y; x += 1) {
			const currentFieldSquare = fieldSquares[`${x},${y}`];
			xLine += ` ${currentFieldSquare.color} `;
		}
		console.log(xLine);
	}
};

const generateFieldSquareKey = position => `${position.x},${position.y}`;

module.exports = {
	printFieldSquare,
	generateFieldSquareKey,
};
