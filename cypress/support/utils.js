export class Utils {
	getRandomName() {
		let results = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < 10) {
			results += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return results;
	}

	getRandomEmail() {
		let results = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < 10) {
			results += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return results + '@gmail.com';
	}
}
