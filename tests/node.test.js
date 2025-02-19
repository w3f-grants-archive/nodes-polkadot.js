/**
 * @jest-environment node
 */

require('./prepare-env.js')('node');
window.MyInstance = null; // Required for this sequential tests

test('Blackprint.Engine does exist on window', async () => {
	expect(window.Blackprint.Engine).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	window.MyInstance = new Blackprint.Engine();

	// Throw when any error happen
	MyInstance.on('error', ev => {
		console.error(ev);
		throw new Error("Something was wrong, please check the console.error");
	});

	// Remove log when the cable was replaced
	MyInstance.on('cable.replaced', () => {});
});

// This may took longer to finish because will also load polkadot.js's module
// -> Prefer using the bundled version to reduce load time
test("Load required modules", async () => {
	// Force to Node.js environment
	Blackprint.Environment.isBrowser = false;
	Blackprint.Environment.isNode = true;

	// Alternative for Blackprint.loadModuleFromURL(...);
	await import("../dist/nodes-polkadotjs.mjs"); // For Browser/Node.js

	// Wait and avoid Jest's test environment being torn down
	await Blackprint.getContext('Polkadot.js');
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Check if the nodes has been registered
	expect(Blackprint.nodes['Polkadot.js']).toBeDefined();
});

// Let's test the nodes
require('./nodes/http-and-ws-provider.js');
require('./nodes/event-new-heads.js');
require('./nodes/import-mnemonic.js');
require('./nodes/sign-verify.js');
require('./nodes/encrypt-decrypt.js');
// require('./nodes/browser-extension.js'); // Only for browser
require('./nodes/experimental-nodes.js');
require('./nodes/converter-nodes.js');

// Because we're testing for Browser and Node.js
// We will run the transfer balance's unit test on Browser only

// In case you're not sure if the unit test does work for browser or not, feel free to uncomment below
// require('./nodes/transfer-balance.js'); // This also contain test for listening balance changes