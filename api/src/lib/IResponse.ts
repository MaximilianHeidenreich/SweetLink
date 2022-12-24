export interface IOk {
	ok: true;
	data?: unknown;
}

export interface IError {
	ok: false;
	error: string | unknown;
}
