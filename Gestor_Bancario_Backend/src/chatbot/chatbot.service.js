import { GoogleGenAI } from '@google/genai';
import { chatbotSystemPrompt } from './system-prompt.js';
import Account from '../accounts/account.model.js';
import Transaction from '../transactions/transaction.model.js';
import Promotion from '../promotions/promotion.model.js';
import Service from '../services/service.model.js';
import Favorite from '../favorites/favorite.model.js';
import { getAllRates } from '../../helpers/currency-logic.js';

// El cliente de GenAI usará Vertex AI con las Application Default Credentials (ADC).
// Asegúrate de correr: gcloud auth application-default login

// Declaración de las tools (Function Calling)
const tools = [
    {
        functionDeclarations: [
            {
                name: 'get_user_accounts',
                description: 'Obtiene la lista de cuentas bancarias del usuario, incluyendo el saldo, tipo de cuenta y moneda.',
                parameters: {
                    type: 'OBJECT',
                },
            },
            {
                name: 'get_user_transactions',
                description: 'Obtiene el historial de las últimas 5 transacciones del usuario, ya sean depósitos, transferencias o retiros.',
                parameters: {
                    type: 'OBJECT',
                },
            },
            {
                name: 'get_active_promotions',
                description: 'Obtiene la lista de promociones bancarias que actualmente están activas para los usuarios.',
                parameters: {
                    type: 'OBJECT',
                },
            },
            {
                name: 'get_active_services',
                description: 'Obtiene la lista de servicios o productos bancarios que actualmente están activos.',
                parameters: {
                    type: 'OBJECT',
                },
            },
            {
                name: 'get_user_favorites',
                description: 'Obtiene la lista de cuentas favoritas (contactos guardados para transferencias) del usuario.',
                parameters: {
                    type: 'OBJECT',
                },
            },
            {
                name: 'get_exchange_rates',
                description: 'Obtiene el tipo de cambio actual de las divisas (GTQ, USD, EUR, etc) con respecto a una moneda base (por defecto USD).',
                parameters: {
                    type: 'OBJECT',
                    properties: {
                        base: {
                            type: 'STRING',
                            description: 'Moneda base para calcular el tipo de cambio, ej. USD o GTQ. Si no se provee, usa USD.'
                        }
                    },
                },
            }
        ],
    },
];

// Resolutores de las tools (Lógica real de Mongoose)
const toolFunctions = {
    get_user_accounts: async (userId) => {
        try {
            const accounts = await Account.find({ userId, estado: true })
                .select('numeroCuenta tipoCuenta saldo moneda -_id')
                .lean();
            if (accounts.length === 0) return { response: "El usuario no tiene cuentas activas." };
            return { response: accounts };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las cuentas." };
        }
    },
    get_user_transactions: async (userId) => {
        try {
            // Buscamos las cuentas del usuario primero para saber qué transferencias le pertenecen
            const accounts = await Account.find({ userId }).select('numeroCuenta').lean();
            const accountNumbers = accounts.map(a => a.numeroCuenta);

            const transactions = await Transaction.find({
                $or: [
                    { cuentaOrigen: { $in: accountNumbers } },
                    { cuentaDestino: { $in: accountNumbers } }
                ]
            })
            .sort({ fechaTransaccion: -1, createdAt: -1 })
            .limit(5)
            .select('tipoTransaccion monto moneda cuentaOrigen cuentaDestino estado createdAt -_id')
            .lean();

            if (transactions.length === 0) return { response: "El usuario no tiene transacciones recientes." };
            return { response: transactions };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las transacciones." };
        }
    },
    get_active_promotions: async () => {
        try {
            const promotions = await Promotion.find({ active: true, status: 'ACTIVE' })
                .select('name description terms type targetSegment -_id')
                .lean();
            if (promotions.length === 0) return { response: "No hay promociones activas en este momento." };
            return { response: promotions };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las promociones." };
        }
    },
    get_active_services: async () => {
        try {
            const services = await Service.find({ active: true, status: 'ACTIVE' })
                .select('name description category type price discount -_id')
                .lean();
            if (services.length === 0) return { response: "No hay servicios activos en este momento." };
            return { response: services };
        } catch (error) {
            return { error: "Ocurrió un error al buscar los servicios." };
        }
    },
    get_user_favorites: async (userId) => {
        try {
            const favorites = await Favorite.find({ userId })
                .select('alias cuenta tipo -_id')
                .lean();
            if (favorites.length === 0) return { response: "El usuario no tiene cuentas favoritas agregadas." };
            return { response: favorites };
        } catch (error) {
            return { error: "Ocurrió un error al buscar los favoritos." };
        }
    },
    get_exchange_rates: async (userId, args) => {
        try {
            // El modelo pasa los argumentos en "args" cuando hay parámetros.
            const base = args?.base || 'USD';
            const rates = await getAllRates(base);
            return { base, rates };
        } catch (error) {
            return { error: "Ocurrió un error al obtener los tipos de cambio." };
        }
    }
};

export const generateChatResponse = async (messagesHistory, userId) => {
    // Si no hay proyecto de GCP, tirar error claro
    if (!process.env.GCP_PROJECT_ID) {
        throw new Error('GCP_PROJECT_ID no configurado en el servidor');
    }

    // Instanciamos el cliente aquí para asegurar que dotenv ya haya cargado las variables
    const ai = new GoogleGenAI({
        vertexai: true,
        project: process.env.GCP_PROJECT_ID,
        location: process.env.GCP_LOCATION || 'global'
    });

    // Mapeamos el historial al formato del nuevo SDK
    const contents = messagesHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    // Todo menos el último que es la nueva pregunta
    const history = contents.slice(0, -1);
    const userMessage = contents[contents.length - 1].parts[0].text;

    const chatSession = ai.chats.create({
        model: 'gemini-3.1-flash-lite',
        config: {
            systemInstruction: chatbotSystemPrompt,
            tools: tools,
        },
        history: history,
    });
    
    // Enviar el mensaje
    let result = await chatSession.sendMessage({ message: userMessage });

    // Bucle para procesar llamadas a funciones si Gemini las pide
    let responseText = "";
    let calls = result.functionCalls;
    
    while (calls && calls.length > 0) {
        const call = calls[0]; // Ejecutamos la primera que pida
        
        console.log(`[Chatbot] AI invocó la herramienta: ${call.name}`);
        
        let toolResponseData;
        if (toolFunctions[call.name]) {
            // Pasamos el userId y también los argumentos que Gemini decidió enviarnos
            const args = call.args || {};
            toolResponseData = await toolFunctions[call.name](userId, args); 
        } else {
            toolResponseData = { error: "Función no encontrada." };
        }

        // Devolvemos el resultado a Gemini para que termine su análisis
        result = await chatSession.sendMessage({
            message: [{
                functionResponse: {
                    name: call.name,
                    response: toolResponseData
                }
            }]
        });
        
        calls = result.functionCalls;
    }

    // Ya no hay más function calls, retornar el texto final
    responseText = result.text;
    return responseText;
};
