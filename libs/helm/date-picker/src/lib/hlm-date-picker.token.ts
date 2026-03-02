import {
	type ExistingProvider,
	inject,
	InjectionToken,
	type Signal,
	type Type,
	type ValueProvider,
} from '@angular/core';
import type { BrnPopover } from '@spartan-ng/brain/popover';

export interface HlmDatePickerBase {
	popover: Signal<BrnPopover>;
	disabledState: Signal<boolean>;
	formattedDate: Signal<string | undefined>;
	updateDate: (date: unknown) => void;
}

export const HlmDatePickerToken = new InjectionToken<HlmDatePickerBase>('HlmDatePickerToken');

export function provideHlmDatePicker(instance: Type<HlmDatePickerBase>): ExistingProvider {
	return { provide: HlmDatePickerToken, useExisting: instance };
}

/**
 * Inject the date picker component.
 */
export function injectHlmDatePicker(): HlmDatePickerBase {
	return inject(HlmDatePickerToken) as HlmDatePickerBase;
}

export interface HlmDatePickerConfig<T> {
	/**
	 * If true, the date picker will close when a date is selected.
	 */
	autoCloseOnSelect: boolean;

	/**
	 * Defines how the date should be displayed in the UI.
	 *
	 * @param date
	 * @returns formatted date
	 */
	formatDate: (date: T) => string;

	/**
	 * Defines how the date should be transformed before saving to model/form.
	 *
	 * @param date
	 * @returns transformed date
	 */
	transformDate: (date: T) => T;

	/**
	 * Defines how the string value should be parsed to a date.
	 *
	 * @param value
	 * @returns parsed date
	 */
	parseDate?: (value: string) => T | undefined;
}

function getDefaultConfig<T>(): HlmDatePickerConfig<T> {
	return {
		formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
		transformDate: (date) => date,
		autoCloseOnSelect: false,
		parseDate: (value) => {
			const date = new Date(value);
			return !isNaN(date.getTime()) ? (date as T) : undefined;
		},
	};
}

const HlmDatePickerConfigToken = new InjectionToken<HlmDatePickerConfig<unknown>>('HlmDatePickerConfig');

export function provideHlmDatePickerConfig<T>(config: Partial<HlmDatePickerConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerConfigToken, useValue: { ...getDefaultConfig(), ...config } };
}

export function injectHlmDatePickerConfig<T>(): HlmDatePickerConfig<T> {
	const injectedConfig = inject(HlmDatePickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerConfig<T>) : getDefaultConfig();
}
