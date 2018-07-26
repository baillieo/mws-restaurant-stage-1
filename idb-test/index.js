
idb.open('test', 1, function (upgradeDb) {
	let keyValSotre = upgradeDb.createObjectStore('keyval');
});