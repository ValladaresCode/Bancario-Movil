import { getAllRates, getHistoricalRates, HISTORY_SUPPORTED_CURRENCIES } from '../../helpers/currency-logic.js';

/**
 * Obtiene todas las tasas de cambio en tiempo real.
 */
export const getCurrencies = async (req, res) => {
    try {
        const { base } = req.query; // Ejemplo: ?base=USD
        const rates = await getAllRates(base || 'USD');

        return res.status(200).json({
            success: true,
            message: 'Tasas de cambio obtenidas correctamente',
            base: base || 'USD',
            rates,
            lastUpdate: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener divisas',
            error: error.message
        });
    }
};

/**
 * Obtiene el histórico de tasas (Frankfurter/ECB) para un par de monedas.
 * Solo cubre HISTORY_SUPPORTED_CURRENCIES (GTQ y COP no tienen histórico gratuito real).
 */
export const getCurrencyHistory = async (req, res) => {
    try {
        const base = String(req.query.base || '').toUpperCase();
        const target = String(req.query.target || '').toUpperCase();
        const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 7), 90);

        if (!HISTORY_SUPPORTED_CURRENCIES.includes(base) || !HISTORY_SUPPORTED_CURRENCIES.includes(target)) {
            return res.status(400).json({
                success: false,
                message: `Histórico solo disponible para: ${HISTORY_SUPPORTED_CURRENCIES.join(', ')}`
            });
        }

        if (base === target) {
            return res.status(400).json({
                success: false,
                message: 'La moneda base y destino deben ser diferentes'
            });
        }

        const points = await getHistoricalRates(base, target, days);

        return res.status(200).json({
            success: true,
            base,
            target,
            days,
            points
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener histórico de divisas',
            error: error.message
        });
    }
};
