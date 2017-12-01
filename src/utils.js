/*
3rd Party library imports
 */
const fieldSquareSize = require('config').get('fieldSquares.size');
const { split, zipObj, compose } = require('ramda');

/*
Project file imports
 */

const printFieldSquare = (fieldSquares) => {
	for (let y = 0; y < fieldSquareSize.y; y += 1) {
		const indent = y < 10 ? ' ' : '';
		let xLine = `${y}${indent}| `;
		for (let x = 0; x < fieldSquareSize.y; x += 1) {
			const currentFieldSquare = fieldSquares[`${x},${y}`];
			xLine += ` ${currentFieldSquare.color} `;
		}
		console.log(xLine);
	}
};

const isPositionAtRear = ({ x, y }) =>
	+x === 0
	|| +x === fieldSquareSize.x - 1
	|| +y === 0
	|| +y === fieldSquareSize.y - 1;

const generateFieldSquareKey = position => `${position.x},${position.y}`;

const splitFieldSquareKeyIntoPosition = compose(zipObj(['x', 'y']), split(','));

const Heading = {
	North: -0.5 * Math.PI,
	NorthEast: 1.75 * Math.PI,
	NorthWest: 1.25 * Math.PI,
	South: 0.5 * Math.PI,
	SouthEast: 0.25 * Math.PI,
	SouthWest: 0.75 * Math.PI,
	West: Math.PI,
	East: 0,
};

module.exports = {
	printFieldSquare,
	generateFieldSquareKey,
	splitFieldSquareKeyIntoPosition,
	isPositionAtRear,
	Heading,
};
