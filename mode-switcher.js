/**
 * Create a listener that applies IME states when VSCodeVim changes the cursor
 * style for Normal and Insert modes.
 *
 * @param {object} options
 * @param {number} options.normalCursorStyle
 * @param {number} options.insertCursorStyle
 * @param {boolean} options.rememberLastIMEState
 * @param {number} options.defaultIMEStateForInsert
 * @param {number} options.defaultIMEStateForNormal
 * @param {() => number} options.getIMEState
 * @param {(state: number) => number} options.setIMEState
 */
function createModeSwitcher({
	normalCursorStyle,
	insertCursorStyle,
	rememberLastIMEState,
	defaultIMEStateForInsert,
	defaultIMEStateForNormal,
	getIMEState,
	setIMEState,
}) {
	let lastCursorStyle = null;
	let lastIMEStateOnInsert = null;

	return (event) => {
		const cursorStyle = event?.options?.cursorStyle ?? event?.textEditor?.options?.cursorStyle;
		if (cursorStyle == null || cursorStyle === lastCursorStyle) {
			return;
		}

		if (cursorStyle === normalCursorStyle) {
			if (rememberLastIMEState) {
				const currentState = getIMEState();
				lastIMEStateOnInsert = currentState === -1
					? defaultIMEStateForInsert
					: currentState;
			}

			lastCursorStyle = cursorStyle;
			setIMEState(defaultIMEStateForNormal);
			return;
		}

		if (cursorStyle === insertCursorStyle) {
			const insertState = rememberLastIMEState && lastIMEStateOnInsert !== null
				? lastIMEStateOnInsert
				: defaultIMEStateForInsert;

			lastCursorStyle = cursorStyle;
			setIMEState(insertState);
		}
	};
}

module.exports = { createModeSwitcher };
