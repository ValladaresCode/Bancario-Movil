import { Router } from 'express';
import { getCurrencies, getCurrencyHistory } from './currency.controller.js';

const api = Router();

/**
 * @route GET /gestionBancaria/api/v1/currencies
 * @desc Obtener tasas de cambio en tiempo real
 * @access Public/Private (Depende de tu preferencia, usualmente los clientes quieren ver esto antes de loguearse)
 */
api.get('/', getCurrencies);

/**
 * @route GET /gestionBancaria/api/v1/currencies/history
 * @desc Histórico de tasas por rango de fechas (solo USD/EUR/MXN/JPY, ver HISTORY_SUPPORTED_CURRENCIES)
 * @access Public
 */
api.get('/history', getCurrencyHistory);

export default api;
