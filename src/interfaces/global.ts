import { Request } from "express";
import Articles from "src/Entities/Article";


export interface IRes<T> {
    data?: T;
    status: boolean;
    message: string;
}

export interface Paginated<T> extends IRes<T> {
  meta: { page: number, limit: number, total: number }
}

export interface Reqs extends Request {
  user: any;
}
  