import { useCallback, useEffect, useState } from 'react';

import { bankClient, getApiError } from '../../../shared/api';

// Historial de chats del usuario.
export function useChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bankClient.get('/chatbot');
      const list = res.data?.chats || res.data?.data?.chats || [];
      setChats(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus conversaciones'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, loading, error, refetch: fetchChats };
}

// Conversación individual + envío de mensajes.
export function useChat(initialChatId = null) {
  const [chatId, setChatId] = useState(initialChatId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialChatId));
  const [sending, setSending] = useState(false);

  const loadChat = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await bankClient.get(`/chatbot/${id}`);
      const chat = res.data?.chat || res.data?.data?.chat;
      setChatId(chat?._id || id);
      setMessages(chat?.messages || []);
    } catch {
      // Si falla, dejamos la conversación vacía; el usuario puede reintentar.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialChatId) loadChat(initialChatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatId]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Optimista: añadimos el mensaje del usuario de inmediato.
      const optimistic = { role: 'user', content: trimmed };
      setMessages((current) => [...current, optimistic]);
      setSending(true);
      try {
        const payload = { message: trimmed };
        if (chatId) payload.chatId = chatId;
        const res = await bankClient.post('/chatbot', payload);
        const data = res.data;
        if (data?.messages) setMessages(data.messages);
        if (data?.chatId) setChatId(data.chatId);
      } catch (err) {
        setMessages((current) => [
          ...current,
          { role: 'model', content: 'Lo siento, ocurrió un error al conectarme. Intenta de nuevo.' },
        ]);
        return { ok: false, error: getApiError(err) };
      } finally {
        setSending(false);
      }
      return { ok: true };
    },
    [chatId]
  );

  return { chatId, messages, loading, sending, sendMessage, loadChat };
}
