// JavaScript source code


// Class for both bins and contents
// Lengths in inches
class Box {
	constructor(length, width, height, isUpright = false) {
		this.length = length;
		this.width = width;
		this.height = height;
		this.isUpright = isUpright;
	}
	//rotates box so that length >= width >= height, unless isUpright;
	setOrientation() {
		if (this.isUpright) {
			return;
		}
		var x = this.width
		var y = this.length
		var	z = this.height
		if (x == Math.min(x, y, z)) {
			this.height = x;
			this.length = Math.max(y, z);
			this.width = Math.min(y, z);
		}
		else if (y == Math.min(x, y, z)) {
			this.height = y;
			this.length = Math.max(x, z)
			this.width = Math.min(x, z);
		}
		else {
			this.height = z;
			this.length = Math.max(x, y);
			this.width = Math.min(x, y);
		}
		console.log("Rotated box from (" + x + "," + y + "," + z + ") to (" + this.length + "," + this.width + "," + this.height + ").")
	}

	//returns volume of box
	getVolume() {
		return this.width * this.length * this.height;
	}
	//returns area of bottom face of box
	getMaxArea() {
		return this.width * this.length;
	}
	//rotates box 90 degrees horizontally
	rotateHorizontal() {
		var x = this.length;
		this.length = this.width;
		this.width = x;
		return;
	}
	//rotates box 90 degrees vertically, unless isUpright
	rotateVertical() {
		if (this.isUpright) {
			return;
		}
		else {
			var x = this.height
			this.height = this.length;
			this.length = x;
			return;
		}
    }
};


// Interior dimensions of bins to be packed
//var bins = [
//	new Box(7, 7, 9, true),
//	new Box(10, 5.5, 9, true),
//	new Box(14, 9.5, 9, true),
//	new Box(15, 12, 8, true),
//	new Box(15, 15, 8, true),
//	new Box(15, 13, 12, true),
//	new Box(23, 16, 13, true)
//];

var bins = [
	new Box(3, 3, 5, true),
	new Box(4, 5, 7, true),
	new Box(6, 7, 7, true),
	new Box(8, 8, 8, true),
	new Box(10, 10, 10, true)
]


// Set of boxes to be packed in any order

var unorderedContents = [
	new Box(2, 1, 4, true),
	new Box(5, 5, 1, true),
	new Box(2, 1, 3),
	new Box(4, 3, 3),
	new Box(2, 2, 2),
];

// Sets orientation for contents
for (c in unorderedContents) {
	unorderedContents[c].setOrientation();
}


// Ordering contents by maximum surface area, with ties going to highest volume
var contents = []
while (unorderedContents.length > 0) {
	console.log("Ordering contents by surface area...");
	maxArea = 0
	largestElement = 0

	for (c in unorderedContents) {
		if (unorderedContents[c].getMaxArea() > maxArea || (unorderedContents[c].getMaxArea() == maxArea && unorderedContents[c].getVolume() > unorderedContents[largestElement].getVolume())) {
			maxArea = unorderedContents[c].getMaxArea();
			largestElement = c;
		}
	}
	
	contents.push(unorderedContents[largestElement]);
	unorderedContents.splice(largestElement, 1);
}

console.log(contents);



function shiftBins(toShift) {
	for (let step = 0; step < toShift; step++) {
		bins.shift();
		
	}
	console.log("Shifted " + toShift + " bins.");
}


//calculating volume of contents
totalVolume = 0;
for (c in contents) {
	totalVolume += contents[c].getVolume();
}
//calculating which bins have less volume than desired contents (including 15% of packing space)
tooSmall = 0;
for (b in bins) {
	if (bins[b].getVolume() /* (*.85) Potential size modifier to allow packaging space */ < totalVolume) {
		tooSmall += 1;
		console.log("Bin " + b + " is too small.");
	}
}
shiftBins(tooSmall);

//calculating which bins cannot fit largest object from surface area issues

tooSmall = 0;
for (b in bins) {
	if (bins[b].getMaxArea() < contents[0].getMaxArea()) {
		tooSmall += 1;
		console.log("Bin " + b + "has too small an area.");
    }
}
shiftBins(tooSmall);

//calculating which bins cannot fit longest length in contents
tooSmall = 0;
for (c in contents) {
	for (b in bins) {
		if (Math.max(bins[b].height, bins[b].width, bins[b].length) < contents[c].length) {
			tooSmall += 1;
			console.log("Bin " + b + " cannot fit item " + c + " as it is too short.");
		}
		else if (bins[b].height < contents[c].height) { // in the case that an item isUpright and taller than the bin
			tooSmall += 1;
			console.log("Bin " + b + " cannot fit item " + c + " due to height restraints.");
		}
	}
	
	shiftBins(tooSmall);
	tooSmall = 0;

}


// This will attempt to add an item to an area, recalculating the largest rectangular area to fit new items
function fitItem(item, vol) {
	var spaceNew = vol;

	if (spaceNew[1] > spaceNew[0]) {
		var x = spaceNew[1];
		spaceNew[1] = spaceNew[0];
		spaceNew[0] = x;
    }
	
//	console.log("fitItem being run on " + item.length + item.width + item.height + " over a space of " + vol+ ".")
	//will not fit if item would stick out of bin
	if (item.height >= spaceNew[2]) {
		return null;
    }

	if (item.length <= spaceNew[1]) {
		spaceNew[0] -= item.width;
		return spaceNew;
	}

	else if (item.length <= spaceNew[0]) {
		if (item.width >= spaceNew[1]) {
			return null;
		}
		var topArea = (spaceNew[0] - item.length) * spaceNew[1];
		var sideArea = spaceNew[0] * (spaceNew[1] - item.width);

		console.log(topArea, sideArea);
		if (topArea > sideArea) {
			spaceNew[0] -= item.length;
		}
		else {
			spaceNew[1] -= item.width;
		}
		return spaceNew;
	}
	else {
		return null;
        }
	}



function fillSpace(cont, vol) {

	fittingItems = [];
	nonFittingItems = [];

	while (cont.length > 0) {

		var x = cont[0];

		if (fitItem(x, vol) == null) {
			console.log(vol);
			if (x.isUpright) {
				console.log("Added item to nonFittingItems.");
				nonFittingItems.push(x);
				console.log("nonFittingItems now has " + fittingItems.length + " items.");
				cont.splice(0, 1);
			}
			else {
				console.log("Turning up");
				x.rotateVertical();
				if (fitItem(x, vol) == null) {
					console.log("Turning over");
					x.rotateHorizontal;
					x.rotateVertical;
					if (fitItem(x, vol) == null) {
						//if after all rotations the item does not fit, it is added to the non-fitting item array
						console.log("Added item to nonFittingItems.");
						console.log("Remaining volume is now:");
						console.log(vol);
						nonFittingItems.push(x);
						console.log("nonFittingItems now has " + fittingItems.length + " items.");

						cont.splice(0, 1);

					} else {
						//if space is lowered then the item fits
						console.log("added item to fittingItems.");
						console.log("Remaining volume is now " + vol + ".");
						fittingItems.push(x);
						cont.splice(0, 1);
						console.log("fittingItems now has " + fittingItems.length + " items.");
					}
				} else {
					//if space is lowered then the item fits
					console.log("added item to fittingItems");
					console.log("Remaining volume is now " + vol + ".");
					fittingItems.push(x);
					cont.splice(0, 1);
					console.log("fittingItems now has " + fittingItems.length + " items.");
				}

			}
		} else {
			//if space is lowered then the item fits
			console.log("added item to fittingItems");
			console.log("Remaining volume is now "+vol+".");
			fittingItems.push(x);
			cont.splice(0, 1);
			console.log("fittingItems now has " + fittingItems.length + " items.");
		}
	}
	//now there are two arrays with items, those that fit and those that do not;

	var returnArray = [fittingItems, nonFittingItems];
	console.log("fittingItems has " + returnArray[0].length + " items, nonFittingItems has " + returnArray[1].length + " items.");
	return returnArray;
}


// Prioritising contents based on their relative height to a given bin
function prioritiseTall(bin, cont) {
	var contNew = [];
	while (cont.length > 0) {
		for (c in cont) {

			if (cont[c].isUpright == true && cont[c].height > bin * .75) {
				contNew.push(cont[c]);
				cont.splice(c, 1);
				
			}
			
		}
		contNew.push(cont[0]);
		cont.splice(0, 1);
	}

	return contNew;
}

//attempt to fit all objects in smallest remaining bin, stacking up to three levels high


function selectBin() {
	while (bins.length > 0) {

		var contentsB = contents.slice();

		//prioritiseTall puts any items with a height of 75%+ of the bin to the front of the array
		contentsB = prioritiseTall(bins[0], contents.slice());

		var space = [bins[0].length, bins[0].width, bins[0].height];
		

		var fitFloor = [];
		var leftOverFloor = contents.slice();
		var tempFirst = [];
		var fitFirst = [];
		var leftOverFirst = [];
		//var tempSecond = [];
		//var fitSecond = [];
		//var leftOverSecond = [];
		//var orderStacked = [];

		console.log("Trying first layer.");
		console.log("contentsB has " + contentsB.length + " items.");


			//this attempts to fill the floor layer of the box with items
		allFloor = fillSpace(contentsB, space);
		fitFloor = allFloor[0];
		leftOverFloor = allFloor[1];

		//console.log("contents is " + contents.length);
		//console.log("contentsB is " + contentsB.length);
		//console.log("fitFloor is " + fitFloor.length);
		//console.log("leftOverFloor is " + leftOverFloor.length);

		

			if (fitFloor.length == contents.length) {
				console.log("All items will fit in one layer in bin " + bins[0].length + ", " + bins[0].width + ", " + bins[0].height + ".");
				return;
			}


		console.log("Reached second layer.")
		leftOverFirst = leftOverFloor;

		for (f in fitFloor) {
			console.log("Trying second layer, item " + f+".");
			//for every item that has been placed on the floor layer, calculate the space available, including restricted height, and attempt to fit more items
			var spaceF = [fitFloor[f].length, fitFloor[f].width, space[2] - fitFloor[f].height];


			//var alreadyFit = fitFirst.length;


			//places as many items as possible directly onto the F item 
			allFirst = fillSpace(leftOverFirst, spaceF);
			tempFirst = allFirst[0];
			leftOverFirst = allFirst[1];


			//	//making a note of where items sit in first layer
			//	orderStacked.push([f-1,alreadyFit]);
			//	while (tempFirst.length > 0) {
			//		fitFirst.push(tempFirst[0]);
			//		tempFirst.splice(0, 1);
			//	}
			//}
		}
			if (fitFloor.length + fitFirst.length == contents.length) {
				console.log("All items will fit in two layers in bin " + bins[0].length + ", " + bins[0].width + ", " + bins[0].height + ".");
				return;
		}

		//leftOverSecond = leftOverFirst;
		//console.log("reached third stack");
		//console.log("orderstacked is " + orderStacked);

		//for (f in fitFirst) {
		//	console.log("trying third stack, item " + f);

		//	//determining which box F sits upon
		//	console.log(orderStacked);
		//	var boxOn = [];
		//	if (orderStacked[0] = [-1, 0]) { orderStacked.push(); }

		//	boxOn = fitFloor[orderStacked[0]];
		//	for (let step = 0; step < orderStacked.length; step++) { 
		//	orderStacked[i][1]--;
		//}
		//	if (orderStacked[0] == [0, 0]) {
		//		for 
		//		orderStacked.shift();
		//	}

		//	console.log("box on is " +boxOn);

		//		var spaceS = (fitFirst[f].length, fitFirst[f].width, bins[0].height - fitFirst[f].height - .height);

		//		allSecond = fillSpace(leftOverSecond, spaceS);
		//		tempSecond = allSecond[0];
		//		leftOverSecond = allSecond[1];

		//	while (tempFirst.length > 0) {
		//		fitSecond.push(tempSecond[0]);
		//		tempSecond.splice(0, 1);
		//	}

		//	}

		//	if (fitFloor.length + fitFirst.length + fitSecond.length == contents.length) {
		//		console.log("this bin will fit all items in three layers, bin " + bins[0] + ".");
		//		return;
		//	}

		console.log("This bin will fit " + fitFloor.length +" items in the first layer, "+ fitFirst.length+" in the second layer, " /*" + fitSecond.length +",*/ + " with " + /*leftOverSecond*/ leftOverFirst.length + " items left over.");
		

		bins.shift();
		console.log("Bin shifted!")
	}
	return;
}


selectBin();
