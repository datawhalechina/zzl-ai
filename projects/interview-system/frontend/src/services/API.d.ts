export interface IResponseType {
  data?: object | array;
  status?: true | false;
  msg?: string;
}
export interface IPaginationParam {
  pageNo?: number;
  pageSize?: number;
}
