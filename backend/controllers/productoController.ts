import { Request, Response } from "express";

let productos = [];

export const getProductos = (req: Request, res: Response) => {
    res.json(productos);
};

export const crearProducto = (req: Request, res: Response) => {
    const nuevoProducto = { id: productos.length + 1, ...req.body };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
};