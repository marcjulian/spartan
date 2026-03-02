import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmDatePickerAnchor } from './hlm-date-picker-anchor';
import { injectHlmDatePicker, injectHlmDatePickerConfig } from './hlm-date-picker.token';

@Component({
	selector: 'hlm-date-picker-input',
	imports: [HlmInputGroupImports, HlmButtonImports, HlmDatePickerAnchor, NgIcon],
	providers: [provideIcons({ lucideCalendar })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-input-group hlmDatePickerAnchor [hlmDatePickerAnchorFor]="_popover()">
			<input
				[value]="_inputValue()"
				hlmInputGroupInput
				[id]="inputId()"
				[placeholder]="placeholder()"
				[disabled]="_disabled()"
				(keydown.arrowDown)="_open()"
				(keydown.enter)="_handleEnter($event)"
				(input)="_handleInputChange($event)"
				(blur)="_commit()"
			/>
			<hlm-input-group-addon align="inline-end">
				<button hlmInputGroupButton size="icon-xs" (click)="_popover().open()" [disabled]="_disabled()">
					<ng-icon name="lucideCalendar" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class HlmDatePickerInput {
	private readonly _datePicker = injectHlmDatePicker();
	private readonly _config = injectHlmDatePickerConfig();
	private static _nextId = 0;

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInput._nextId++}`);

	public readonly placeholder = input('');

	protected readonly _inputValue = signal('');

	constructor() {
		effect(() => {
			const formattedDate = this._datePicker.formattedDate();
			untracked(() => {
				if (formattedDate !== undefined && formattedDate !== this._inputValue()) {
					this._inputValue.set(formattedDate ?? '');
				}
			});
		});
	}

	protected _handleInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this._inputValue.set(value);
	}

	protected _handleEnter(event: Event) {
		event.preventDefault();
		this._commit();
		this._popover().close();
	}

	protected _commit() {
		const value = this._inputValue().trim();
		if (!value) {
			this._datePicker.updateDate(undefined);
			this._inputValue.set('');
			return;
		}

		const date = this._config.parseDate?.(value);

		if (date && this._isValidDate(date)) {
			this._datePicker.updateDate(date);
		} else {
			this._inputValue.set(this._datePicker.formattedDate() ?? '');
		}
	}

	private _isValidDate(date: unknown) {
		if (date instanceof Date) {
			return !isNaN(date.getTime());
		}
		return date != null;
	}

	protected _open() {
		this._popover().open();
	}
}
