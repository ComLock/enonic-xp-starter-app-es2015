export interface Request<
	Params extends {} = {},
	PathParams extends {} = {}
> {
	body? :string
	headers? :{
		Accept? :string
		Authorization? :string
	}
	method? :string
	params? :Params
	pathParams? :PathParams
}
