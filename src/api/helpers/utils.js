const arr2Obj = (arr = []) => {
	return arr.reduce((acc, country) => {
		acc[country]= true;
		return acc;
	}, {});
};

module.exports = {
	arr2Obj
};