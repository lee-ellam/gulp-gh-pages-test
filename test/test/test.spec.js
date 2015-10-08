var TestSubject = require('../../components/test/test');

describe('dna-test specs', function () {

	let testSubject,
		testOptionsStub;

	beforeEach(()=>{
		testOptionsStub = {
			node: null
		};
		testSubject = new TestSubject(testOptionsStub);
	});

	it('should always pass this', ()=>{
		expect(true).toBeTruthy();
	});

});
