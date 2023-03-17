import { Response } from 'express';

export function handleError(res: Response, code: number, message: string) {
  return res.status(code).json({ message });
}
