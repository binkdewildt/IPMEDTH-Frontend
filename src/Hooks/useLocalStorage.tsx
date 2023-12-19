import { useState, useEffect } from "react";

type ReturnType<T> = [
	T | undefined,
	React.Dispatch<React.SetStateAction<T | undefined>>
];

export const useLocalStorage = <T,>(
	key: string,
	initialValue?: T
): ReturnType<T> => {
	const [value, setValue] = useState(() => {
		let currentValue: T | undefined = initialValue;

		try {
			currentValue = JSON.parse(
				localStorage.getItem(key) || String(initialValue)
			);
		} catch (error) {
			currentValue = initialValue;
		}

		return currentValue;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue];
};

export default useLocalStorage;
