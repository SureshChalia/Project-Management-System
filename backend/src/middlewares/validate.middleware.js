import ApiError from "../utils/ApiError.js";

const validate = (schema) => async (req, res, next) => {
	console.log('[validate.middleware] path=', req.path, 'nextType=', typeof next);
	try {
		const parsed = await schema.parseAsync(req.body);
		req.body = parsed;
		return next();
	} catch (err) {
		const message = err.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
		return next(new ApiError(400, message));
	}
};

export default validate;
