import { Request, Response } from "express";

let proveedores = [];

export const getProveedores = (req: Request, res: Response) => {
    res.json(proveedores);
};

export const crearProveedor = (req: Request, res: Response) => {
    const nuevoProveedor = { id: proveedores.length + 1, ...req.body };
    proveedores.push(nuevoProveedor);
    res.status(201).json(nuevoProveedor);
};