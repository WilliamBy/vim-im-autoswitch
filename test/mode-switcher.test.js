const assert = require('assert').strict;
const { createModeSwitcher } = require('../mode-switcher');

function createHarness(overrides = {}) {
	const calls = [];
	let currentIMEState = 1;
	const onChange = createModeSwitcher({
		normalCursorStyle: 2,
		insertCursorStyle: 1,
		rememberLastIMEState: true,
		defaultIMEStateForInsert: 1,
		defaultIMEStateForNormal: 0,
		getIMEState: () => currentIMEState,
		setIMEState: (state) => {
			calls.push(state);
			currentIMEState = state;
			return 1;
		},
		...overrides,
	});
	return { onChange, calls };
}

	module.exports = (test) => {
	test('switches to the configured Normal state and restores the prior Insert state', () => {
	const { onChange, calls } = createHarness();
	onChange({ options: { cursorStyle: 2 } });
	onChange({ options: { cursorStyle: 1 } });

	assert.deepEqual(calls, [0, 1]);
});

	test('uses the Insert default when the first observed transition is into Insert mode', () => {
	const { onChange, calls } = createHarness();
	onChange({ options: { cursorStyle: 1 } });

	assert.deepEqual(calls, [1]);
});

	test('uses the Insert default when reading the previous state fails', () => {
	const { onChange, calls } = createHarness({ getIMEState: () => -1 });
	onChange({ options: { cursorStyle: 2 } });
	onChange({ options: { cursorStyle: 1 } });

	assert.deepEqual(calls, [0, 1]);
});

	test('ignores unrelated and duplicate cursor styles', () => {
	const { onChange, calls } = createHarness();
	onChange({ options: { cursorStyle: 3 } });
	onChange({ options: { cursorStyle: 2 } });
	onChange({ options: { cursorStyle: 2 } });

	assert.deepEqual(calls, [0]);
});

	test('uses the current editor options when the event options omit cursorStyle', () => {
	const { onChange, calls } = createHarness();
	onChange({ options: {}, textEditor: { options: { cursorStyle: 2 } } });

	assert.deepEqual(calls, [0]);
	});
};
