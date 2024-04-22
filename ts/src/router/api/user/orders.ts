import { Router } from "express";
import { KEYS } from "../../../constant/index.js";

const {
  REQUEST: { PARAMS },
} = KEYS;

export const orders = Router();

orders.get("/");

orders.get(`/:${PARAMS.ID.ORDER}`);

orders.post("/");

orders.put(`/:${PARAMS.ID.ORDER}`);

orders.delete(`/:${PARAMS.ID.ORDER}`);
