import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, input, model, signal } from '@angular/core';
import { provideBrnCollapsible } from './brn-collapsible-token';

let collapsibleContentIdSequence = 0;

export type BrnCollapsibleState = 'open' | 'closed';

@Directive({
	selector: '[brnCollapsible],brn-collapsible',
	host: {
		'[attr.data-state]': 'expanded() ? "open" : "closed"',
		'[attr.disabled]': 'disabled() ? true : undefined',
	},
	providers: [provideBrnCollapsible(BrnCollapsible)],
})
export class BrnCollapsible {
	public readonly contentId = signal(`brn-collapsible-content-${++collapsibleContentIdSequence}`);

	/**
	 * The expanded or collapsed state of the collapsible component.
	 */
	public readonly expanded = model<boolean>(false);

	/**
	 * The disabled state of the collapsible component.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Toggles the expanded state of the collapsible component.
	 */
	public toggle(): void {
		this.expanded.update((expanded) => !expanded);
	}
}
